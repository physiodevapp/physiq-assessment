// Informe narrativo con IA y licencia. Se ejecuta desde tests/unit.js.
import { assert, readFileSync, readdirSync, createHash, join, RAIZ, leer, test, HYPOTHESES,
   SYSTEMIC_SCREENING, CIF_TREES, state, buildPhysiQPayload, buildInformeFisioterapiaText,
   buildContextSummaryText, withState } from './comun.mjs';

// ── Informe narrativo con IA (lib/informe-narrativo.js, informe-ia.js) ───────
console.log('\ninforme narrativo (standalone)');
const IN = await import('../../lib/informe-narrativo.js');

test('prompt: estructura CIF de report, empieza por CONDICIÓN DE SALUD y cierra en SEGUIMIENTO FUNCIONAL', () => {
  withState({}, () => {
    const p = IN.buildNarrativePrompt(buildPhysiQPayload(), { conAudio: true });
    for (const sec of ['## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES', '## HISTORIA CLÍNICA Y EVOLUCIÓN',
      '## EVALUACIÓN DE FUNCIONES Y ESTRUCTURAS CORPORALES', '## CONCLUSIONES Y PLAN DE TRATAMIENTO', '## SEGUIMIENTO FUNCIONAL']) {
      assert.ok(p.includes(sec), `falta ${sec}`);
    }
    assert.ok(p.includes('{{TRANSCRIPT}}'), 'el worker necesita el hueco {{TRANSCRIPT}}');
    assert.ok(p.includes(`${IN.PALABRAS_INFORME} palabras`), 'presupuesto de extensión fijo');
    assert.ok(!p.includes('cabecera del documento'), 'aquí no hay cabecera: la identificación va aparte');
  });
});

test('prompt: lleva los datos de la valoración y las hipótesis (con sus subsecciones)', () => {
  withState({}, () => {
    const d = buildPhysiQPayload();
    const p = IN.buildNarrativePrompt(d, { conAudio: true });
    assert.ok(p.includes('DATOS DE VALORACIÓN ESTRUCTURADA'));
    assert.ok(p.includes('Dolor hombro derecho'), 'motivo de consulta');
    assert.ok(p.includes(d.h[0].name), 'hipótesis activa');
    assert.ok(p.includes('### Coherencia con hipótesis de valoración'));
  });
  withState({ activeHypotheses: [] }, () => {
    const p = IN.buildNarrativePrompt(buildPhysiQPayload(), { conAudio: true });
    assert.ok(!p.includes('### Coherencia con hipótesis de valoración'), 'sin hipótesis, sin esa subsección');
  });
});

test('prompt: sin audio pide redactar solo con los datos, y nunca inventar', () => {
  withState({}, () => {
    const sin = IN.buildNarrativePrompt(buildPhysiQPayload(), { conAudio: false });
    const con = IN.buildNarrativePrompt(buildPhysiQPayload(), { conAudio: true });
    assert.ok(sin.includes('No hay transcripción de la sesión'));
    assert.ok(!con.includes('No hay transcripción de la sesión'));
    assert.ok(sin.includes('No inventes') && con.includes('No inventes'));
  });
});

test('prompt: derivaciones, formulario previo, signos vitales y modo breve entran en el bloque de datos', () => {
  const d = { p: 'X', r: 'lumbar', d: '01/01/2026', h: [], br: [], sq: [], pn: {},
    ur: ['Cauda equina: derivar hoy'], dv: ['Claudicación vascular'],
    sv: { fc: 80, fr: null, spo2: 97, tas: 130, tad: 85 }, an: { talla: 170, peso: 70, imc: 24.2 },
    fp: [{ s: 'General', q: 'Cómo empezó', a: '«Al levantar una caja»' }], md: 'breve', pe: ['Tests sin hacer'] };
  const c = IN.contextoValoracion(d);
  for (const t of ['DERIVACIÓN URGENTE', 'Cauda equina', 'Claudicación vascular', 'FC 80 lpm', 'TA 130/85', 'IMC 24.2',
    'Al levantar una caja', 'inicial breve', 'Tests sin hacer']) assert.ok(c.includes(t), `falta «${t}»`);
  const vacio = IN.contextoValoracion({ h: [], br: [], sq: [], pn: {} });
  assert.ok(!vacio.includes('DERIVACIÓN') && !vacio.includes('Signos vitales') && !vacio.includes('Formulario previo'),
    'sin datos, sin bloques vacíos');
});

test('pista de Whisper por región, con default para lo desconocido', () => {
  assert.ok(IN.getWhisperPrompt('lumbar').includes('Columna lumbar'));
  assert.ok(IN.getWhisperPrompt('tobillo_pie').includes('Tobillo y pie'));
  assert.ok(IN.getWhisperPrompt('').startsWith('Fisioterapia musculoesquelética'));
  assert.ok(IN.getWhisperPrompt('inexistente').startsWith('Fisioterapia musculoesquelética'));
});

test('SSE: eventos completos, resto sin cerrar, bloques rotos ignorados', () => {
  const buf = 'event: transcript\ndata: {"text":"hola"}\n\nevent: report_chunk\ndata: {"text":"## A"}\n\nevent: basura\ndata: {no json}\n\nevent: report_chunk\ndata: {"te';
  const { eventos, resto } = IN.parseSSEBuffer(buf);
  assert.deepEqual(eventos.map(e => e.type), ['transcript', 'report_chunk']);
  assert.equal(eventos[0].data.text, 'hola');
  assert.ok(resto.startsWith('event: report_chunk'));
  assert.deepEqual(IN.parseSSEBlock('event: done\ndata: {"success":true}'), { type: 'done', data: { success: true } });
});

test('truncado: falta la última sección o acaba a mitad de frase', () => {
  assert.equal(IN.informeTruncado('## A\nTexto.\n## SEGUIMIENTO FUNCIONAL\nPendiente de reevaluaciones programadas.'), false);
  assert.equal(IN.informeTruncado('## A\nTexto.'), true);
  assert.equal(IN.informeTruncado('## SEGUIMIENTO FUNCIONAL\nPendiente de reev'), true);
  assert.equal(IN.informeTruncado(''), true);
});

const MD = `## CONDICIÓN DE SALUD
Párrafo con **negrita** y <script>x</script>.

### Factores Personales
Texto.

| Articulación | Rango |
|---|---|
| Hombro | 120° |
`;

test('markdown → texto: títulos en mayúsculas, tablas sin separador, sin **', () => {
  const t = IN.markdownATexto(MD);
  assert.ok(t.startsWith('CONDICIÓN DE SALUD\n'));
  assert.ok(t.includes('Párrafo con negrita'));
  assert.ok(!t.includes('**') && !t.includes('##') && !t.includes('---'));
  assert.ok(t.includes('Articulación | Rango') && t.includes('Hombro | 120°'));
});

test('markdown → HTML: escapa, títulos y tabla con cabecera', () => {
  const h = IN.markdownAHtml(MD);
  assert.ok(!h.includes('<script>') && h.includes('&lt;script&gt;'), 'el texto del modelo se escapa');
  assert.ok(h.includes('<h3>CONDICIÓN DE SALUD</h3>') && h.includes('<h4>Factores Personales</h4>'));
  assert.ok(h.includes('<th>Articulación</th>') && h.includes('<td>120°</td>'));
});

test('texto para compartir: identificación local + informe + pie, sin markdown', () => {
  const t = IN.textoParaCompartir(MD, { p: 'Ana Ruiz', d: '05/10/2026', r: 'tobillo_pie' }, r => r === 'tobillo_pie' ? 'Tobillo y pie' : r);
  assert.ok(t.startsWith('INFORME DE FISIOTERAPIA\nPaciente: Ana Ruiz\nFecha: 05/10/2026\nRegión valorada: Tobillo y pie'));
  assert.ok(t.includes('CONDICIÓN DE SALUD') && t.includes('redacción asistida por IA'));
  assert.ok(!t.includes('##'));
});

test('huella: cambia con la valoración, no con la fecha', () => {
  withState({}, () => {
    const a = buildPhysiQPayload();
    assert.equal(IN.huellaPayload(a), IN.huellaPayload({ ...a, d: '31/12/2099' }));
    assert.notEqual(IN.huellaPayload(a), IN.huellaPayload({ ...a, nr: a.nr + 1 }));
  });
});

test('errores de los servicios en español, con el original y la salida sin audio', () => {
  const casos = [
    ['Whisper: Your account is not active, please check your billing details on our website.', /OpenAI \(transcripción\).*no tiene saldo/, 'whisper'],
    ['Claude: Your credit balance is too low to access the Anthropic API.', /Anthropic \(redacción\).*no tiene saldo/, 'claude'],
    ['Whisper: Incorrect API key provided: sk-abc', /clave de OpenAI.*no es válida/, 'whisper'],
    ['Claude: Overloaded', /saturado/, 'claude'],
    ['Whisper: Invalid file format. Supported formats: [flac, m4a]', /audio no se ha podido procesar/, 'whisper'],
    ['Claude: Internal server error', /no responde ahora mismo/, 'claude'],
    ['Claude: something unexpected', /^No se ha podido redactar el informe \(Anthropic\)\.$/, 'claude'],
    ['Whisper: something unexpected', /^No se ha podido transcribir el audio \(OpenAI\)\.$/, 'whisper'],
  ];
  for (const [msg, re, servicio] of casos) {
    const e = IN.errorLegible(msg);
    assert.match(e.texto, re, msg);
    assert.equal(e.servicio, servicio);
    assert.equal(e.original, msg, 'el original se conserva');
    assert.equal(e.sinAudio, servicio === 'whisper', 'solo un fallo de transcripción sugiere generar sin audio');
  }
  // Un error de formato de Claude no es «audio no válido»
  assert.doesNotMatch(IN.errorLegible('Claude: invalid request format').texto, /audio/);
  // Los mensajes propios (ya en español, sin servicio delante) pasan tal cual
  const propio = IN.errorLegible('La verificación de seguridad ha fallado.');
  assert.equal(propio.texto, 'La verificación de seguridad ha fallado.');
  assert.equal(propio.servicio, null);
  assert.equal(propio.original, '');
});

test('línea de progreso: sección en minúscula salvo las siglas', () => {
  assert.equal(IN.seccionLegible('HALLAZGOS Y CODIFICACIÓN CIF'), 'Hallazgos y codificación CIF');
  assert.equal(IN.seccionLegible('## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES'), 'Condición de salud y factores contextuales');
  assert.equal(IN.seccionLegible('OBJETIVOS Y PLAN'), 'Objetivos y plan');
  assert.equal(IN.seccionLegible(''), '');
});

test('conexión cortada al generar: pantalla apagada / segundo plano, no un error de la API', () => {
  const red = m => Object.assign(new TypeError(m), {});
  // Los textos reales de iOS, Chrome y Firefox
  for (const m of ['Load failed', 'Failed to fetch', 'network error', 'NetworkError when attempting to fetch resource.', 'The network connection was lost.']) {
    const e = IN.errorConexion(red(m), { seOculto: true });
    assert.equal(e?.texto, IN.TEXTO_CONEXION_SEGUNDO_PLANO, m);
    assert.equal(e.original, m);
    assert.equal(e.sinAudio, false);
  }
  assert.equal(IN.errorConexion(red('Failed to fetch')).texto, IN.TEXTO_CONEXION_PERDIDA);
  // No son cortes: errores de la API (Error, aunque hablen de conexión) y fallos de código
  assert.equal(IN.errorConexion(new Error('Claude: connection reset by peer'), { seOculto: true }), null);
  assert.equal(IN.errorConexion(new Error('Error del servidor (500)'), { seOculto: true }), null);
  assert.equal(IN.errorConexion(new TypeError("Cannot read properties of undefined (reading 'text')"), { seOculto: true }), null);
  assert.equal(IN.errorConexion(null), null);
});

test('fase 5: cabecera de hipótesis en dos filas (nombre; etiqueta debajo) y un solo 🏥 en el postoperatorio', () => {
  const app = leer('app.js');
  assert.match(app, /_cabeceraHipHTML\(color, '', `🏥 \$\{_escHTML\(hyp\.name\)\}`, ETIQUETA_HIP_POSQ\.replace\(\/\^🏥\\s\*\/, ''\)/);
  const css = leer('styles.css');
  assert.match(css, /\.hyp5-cab \{ display: flex; align-items: flex-start;/, 'el punto se alinea con la primera línea');
});

test('cancelar la generación pide confirmación y el diálogo se cierra solo si la generación acaba', () => {
  const src = leer('informe-ia.js');
  const cancelar = src.slice(src.indexOf('function iaCancelar'), src.indexOf('function cancelarGeneracion'));
  assert.match(cancelar, /showConfirmBanner\('Cancelar la generación'[\s\S]*<span class="btn-text-full">Sí, cancelar<\/span><span class="btn-text-short">Cancelar<\/span>',\s*cancelarGeneracion, \{ cancelLabel: 'Seguir' \}\)/);
  assert.doesNotMatch(cancelar, /ctrl\.abort/, 'el botón ya no corta sin confirmar');
  const gen = src.slice(src.indexOf('async function iaGenerar'), src.indexOf('async function leerStream'));
  assert.match(gen, /finally \{[\s\S]*_cerrarDlgCancelar\?\.\(\);/);
  // Lo de showConfirmBanner (cancelLabel, dismiss() idempotente) lo comprueba
  // el smoke («Diálogos de confirmación»)
});

test('transcripción sin voz: silencio o texto de relleno de Whisper', () => {
  // Lo que Whisper devuelve con un audio en silencio
  for (const t of ['', '   ', 'Subtítulos realizados por la comunidad de Amara.org',
    'Subtítulos realizados por la comunidad de Amara.org Subtítulos realizados por la comunidad de Amara.org',
    '¡Suscríbete! Gracias por ver el vídeo.', 'Thank you for watching.', 'Hola. Hola. Hola. Hola.',
    'Gracias por ver. Gracias por ver. Gracias por ver.'])
    assert.equal(IN.transcripcionSinVoz(t), true, t);
  // Una consulta real, aunque sea corta o acabe con relleno
  for (const t of ['Me duele la rodilla izquierda desde hace dos meses, sobre todo al correr.',
    'Buenos días, Lucía. Cuéntame qué te pasa. Me duele la rodilla. Subtítulos realizados por la comunidad de Amara.org',
    'Sí. No. Al bajar escaleras me duele por delante.'])
    assert.equal(IN.transcripcionSinVoz(t), false, t);
  assert.match(IN.TEXTO_SIN_VOZ, /micrófono/);
});

test('al generar: una transcripción sin voz corta antes de redactar y conserva el audio', () => {
  const src = leer('informe-ia.js');
  const stream = src.slice(src.indexOf('async function leerStream'), src.indexOf('function iaCancelar'));
  // Solo con audio: sin audio la transcripción vacía es lo esperado
  assert.match(stream, /_gen\.conAudio && transcripcionSinVoz\(_gen\.transcripcion\)\) throw new SinVoz\(\)/);
  const gen = src.slice(src.indexOf('async function iaGenerar'), src.indexOf('async function leerStream'));
  const captura = gen.slice(gen.indexOf('} catch (err) {'), gen.lastIndexOf('} finally {'));
  assert.match(captura, /err instanceof SinVoz[\s\S]*texto: TEXTO_SIN_VOZ[^}]*sinAudio: true/);
  assert.ok(captura.length > 100);
  assert.doesNotMatch(captura, /quitarAudio/);
  // Sale por el catch sin guardar informe; el finally aborta el stream
  assert.match(gen, /finally \{[\s\S]*ctrl\.abort\(\)/);
});

test('grabadora: en el móvil se pausa al pasar a segundo plano y avisa al volver', () => {
  const src = leer('grabadora.js');
  const vis = src.slice(src.indexOf("addEventListener('visibilitychange'"), src.indexOf("addEventListener('beforeunload'"));
  // Oculta: pausa solo grabando, sin pausa previa y sin ratón (móvil); en el ordenador no
  assert.match(vis, /if \(_grab && !_grab\.pausado && !conRaton\(\)\) \{ pausar\(\); _grab\.pausaAuto = true; \}/);
  // Visible: aviso solo si la pausó la app y sigue en pausa
  assert.match(vis, /if \(_grab\?\.pausaAuto\) \{[\s\S]*if \(_grab\.pausado\) showToast\('Grabación en pausa: la app pasó a segundo plano/);
});

const G_SILENCIO = await import('../../grabadora.js');
test('grabadora: aviso de silencio solo grabando, antes al empezar que a media consulta', () => {
  const G = G_SILENCIO;
  assert.equal(G.silencioDetectado({ huboSonido: false, msSinSonido: G.SILENCIO_INICIO_MS - 500 }), false);
  assert.equal(G.silencioDetectado({ huboSonido: false, msSinSonido: G.SILENCIO_INICIO_MS }), true);
  assert.equal(G.silencioDetectado({ huboSonido: true, msSinSonido: G.SILENCIO_INICIO_MS }), false);
  assert.equal(G.silencioDetectado({ huboSonido: true, msSinSonido: G.SILENCIO_MS }), true);
  assert.ok(G.SILENCIO_MS > G.SILENCIO_INICIO_MS);
  const src = leer('grabadora.js');
  const medir = src.slice(src.indexOf('function medirNivel'), src.indexOf('export function pausar'));
  assert.match(medir, /g\.pausado \|\| n\.ctx\.state !== 'running'\) return/, 'en pausa o sin medir, nunca avisa');
  assert.match(src, /rec\.onstop = \(\) => \{[\s\S]{0,80}pararNivel\(g\)/, 'el AudioContext se cierra con la grabación');
});

test('al generar: pantalla encendida, aviso visible y corte explicado sin borrar el audio', () => {
  const src = leer('informe-ia.js');
  const gen = src.slice(src.indexOf('async function iaGenerar'), src.indexOf('async function leerStream'));
  assert.match(gen, /pedirWakeLockGen\(\);/);
  assert.match(gen, /finally \{[\s\S]*soltarWakeLockGen\(\);/);
  assert.match(gen, /errorConexion\(err, \{ seOculto: [^}]*\}\) \|\| errorLegible\(err\.message\)/);
  // El audio solo se quita tras guardar el informe, nunca en el catch
  const captura = gen.slice(gen.indexOf('} catch (err) {'), gen.lastIndexOf('} finally {'));
  assert.doesNotMatch(captura, /quitarAudio/);
  assert.match(src, /class="ia-nota-pantalla">Mantén la pantalla encendida/);
});

test('extensión del audio según el tipo MIME', () => {
  assert.equal(IN.extensionAudio('audio/webm;codecs=opus'), 'webm');
  assert.equal(IN.extensionAudio('audio/mp4'), 'm4a');
  assert.equal(IN.extensionAudio('audio/mpeg'), 'mp3');
  assert.equal(IN.extensionAudio(''), 'webm');
});

test('informeIA nunca entra en el payload, 📋 Notas ni 📄 Informe', () => {
  withState({ informeIA: { texto: 'TEXTO-IA-CENTINELA', transcripcion: 'TRANSCRIPCION-CENTINELA', huella: 'x' } }, () => {
    const textos = [JSON.stringify(buildPhysiQPayload()), buildContextSummaryText(), buildInformeFisioterapiaText()];
    for (const t of textos) assert.ok(!t.includes('CENTINELA'), 'el informe narrativo se filtró a un resumen');
  });
  state.informeIA = null;
});

const IA = await import('../../informe-ia.js');
const P = await import('../../lib/pauta.js');

test('datos ampliados: edad, fase 3, árbol, tests, criterios y pauta solo cuando hay datos', () => {
  const a = {
    edad: 52, signoComparable: 'Flexión lumbar', estabilidad: 'Empeorando',
    irritabilidad: { dolor: 'Alto', reposo: 'Presente', movimiento: 'Antes del final del rango', discapacidad: 'Moderada', tolerancia: 'Baja', calma: 'Tarda horas' },
    psico: [{ q: 'Miedo al movimiento', a: 'Sí' }],
    criterios: [{ etiqueta: 'Dolor lumbar inflamatorio', positivas: 2, total: 4, nota: 'Valorar derivación' }],
    arbol: [{ pregunta: '¿SLR positivo?', respuesta: 'SÍ — SLR <60°' }],
    tests: [{ hipotesis: 'Radiculopatía', items: [{ test: 'Slump', resultado: 'positivo', cluster: 'Cluster de Laslett' }, { test: 'CPR Flynn', resultado: 'negativo', pronostico: true }] }],
    pautas: [{ hipotesis: 'Radiculopatía', derivar: false, pauta: 'Movilidad neural', fuente: 'NICE NG59', pronostico: { horizonte: '6-12 semanas', derivacion: 'Déficit progresivo' }, prom: 'ODI' },
             { hipotesis: 'Fractura', derivar: true, pauta: '', fuente: '', prom: '' }],
  };
  const t = IN.bloquesAmpliados(a).join('\n');
  // El horizonte del pronóstico no se envía: el informe lo convertía en plan (Daniel: ecografía «para valorar líquido…»)
  assert.ok(!t.includes('6-12 semanas') && !/· Pronóstico/.test(t), 'sin la línea «Pronóstico»');
  for (const x of ['Signo comparable', 'Flexión lumbar', 'Empeorando', 'tolerancia al estrés físico: Baja', 'tiempo en calmarse tras la actividad que lo provoca: Tarda horas', 'Impacto en las actividades (gravedad): Moderada', 'Miedo al movimiento → Sí',
    'Dolor lumbar inflamatorio (2/4)', '¿SLR positivo? → SÍ — SLR <60°', 'Slump: positivo (parte del cluster «Cluster de Laslett»)',
    'Reglas pronósticas (predicen', '  · CPR Flynn: negativo (regla pronóstica, no diagnóstica)', 'Pauta: Movilidad neural', 'Fuente: NICE NG59',
    'Cuándo reconsiderar o derivar (contexto para el fisioterapeuta: no es plan ni explicación al paciente): Déficit progresivo', 'seguimiento: ODI', 'Derivar: sin tratamiento']) assert.ok(t.includes(x), `falta «${x}»`);
  assert.ok(!t.includes('nivel de dolor'), 'el «nivel de dolor» de la matriz antigua no va al prompt: el NRS ya está (decisión 100)');
  const vacio = { edad: null, signoComparable: '', estabilidad: '', irritabilidad: null, psico: [], criterios: [], arbol: [], tests: [], pautas: [] };
  assert.deepEqual(IN.bloquesAmpliados(vacio), [], 'sin datos, ningún bloque');
  assert.deepEqual(IN.bloquesAmpliados(null), []);
  const c = IN.contextoValoracion({ p: 'X', h: [], br: [], sq: [], pn: {} }, r => r, a);
  assert.match(c, /Edad: 52 años/);
  assert.ok(c.includes('Tests de confirmación realizados'));
  assert.doesNotMatch(IN.contextoValoracion({ p: 'X', h: [], br: [], sq: [], pn: {} }, r => r, vacio), /Edad:/);
});

test('plantillas: narrativo y ficha breve, por defecto según el tipo de consulta', () => {
  assert.equal(IN.plantillaPorDefecto('breve'), 'breve');
  assert.equal(IN.plantillaPorDefecto('completo'), 'narrativo');
  assert.equal(IN.plantillaPorDefecto(undefined), 'narrativo');
  const d = { p: 'X', r: 'lumbar', d: '01/01/2026', h: [], br: [], sq: [], pn: {} };
  const ficha = IN.PLANTILLAS.breve.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  for (const x of ['## PRESENTACIÓN CLÍNICA', '## HALLAZGOS Y CODIFICACIÓN CIF', '## OBJETIVOS Y PLAN', '{{TRANSCRIPT}}'])
    assert.ok(ficha.includes(x), `ficha: falta «${x}»`);
  assert.ok(!ficha.includes('## SEGUIMIENTO FUNCIONAL'));
  const narr = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.ok(narr.includes('## SEGUIMIENTO FUNCIONAL'));
  // Lo no explorado se dice una vez; la pauta de PhysiQ manda en las dos
  for (const p of [ficha, narr]) {
    assert.match(p, /UNA (sola )?vez/i, 'regla de «lo no explorado, una sola vez»');
    assert.match(p, /sin proponer dosis/);
  }
  assert.ok(IN.PLANTILLAS.breve.maxTokens < IN.PLANTILLAS.narrativo.maxTokens);
  assert.equal(IN.informeTruncado('## PRESENTACIÓN CLÍNICA\nA.\n## OBJETIVOS Y PLAN\nReevaluar en dos semanas.', 'breve'), false);
  assert.equal(IN.informeTruncado('## PRESENTACIÓN CLÍNICA\nA.\n## HALLAZGOS Y CODIFICACIÓN CIF\nB.', 'breve'), true);
});

test('prompt: el bloque de datos no lleva puntuaciones, notas del plan vacías ni nombres que inviten a citarlo', () => {
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', br: [], sq: [], dv: ['Sospecha de fractura: derivar'],
    h: [{ name: 'Síndrome subacromial', sc: '🟠 Peso moderado (LR× 2.0) · 2/2 hallazgos compatibles' }],
    pn: { variableControl: '', ventanaRecuperacion: '24 h', anclajeHabito: '  ' } };
  const amp = { edad: 52, signoComparable: '', estabilidad: '', irritabilidad: null, psico: [], criterios: [],
    arbol: [{ pregunta: '¿Traumatismo previo?', respuesta: 'SÍ' }], tests: [], pautas: [] };
  const ctx = IN.contextoValoracion(d, r => r, amp);
  assert.ok(ctx.includes('Síndrome subacromial'));
  for (const x of ['LR×', 'Peso moderado', 'hallazgos compatibles', 'Variable de control', 'Anclaje de hábito', 'árbol', 'Razonamiento clínico', 'Formulario previo'])
    assert.ok(!ctx.includes(x), `sin «${x}»`);
  assert.ok(ctx.includes('Recuperación entre sesiones: 24 h'), 'las notas con texto sí van, con etiqueta neutra');
  assert.ok(!ctx.includes('Ventana de recuperación'), 'sin el nombre del campo');
  assert.ok(ctx.includes('Hallazgos de la exploración'));
  assert.ok(!IN.contextoValoracion({ ...d, pn: {} }, r => r, null).includes('Notas del plan'), 'sin notas, sin bloque');
});

test('prompt: etiquetas internas limpias, IMC redondeado y comprobaciones de «Derivar»', () => {
  assert.equal(IN.limpiarEtiqueta('Luxación Bloqueada o Fractura (→ Rx)'), 'Luxación Bloqueada o Fractura');
  assert.equal(IN.limpiarEtiqueta('SÍ — Traumatismo previo → luxación bloqueada o fractura → Rx'), 'SÍ — Traumatismo previo — orienta a: luxación bloqueada o fractura; Rx');
  assert.equal(IN.limpiarEtiqueta('Gesto testigo (①) y medida objetiva (②)'), 'Gesto testigo y medida objetiva');
  assert.equal(IN.limpiarEtiqueta('Arco doloroso'), 'Arco doloroso');
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', br: [], sq: [], pn: {}, an: { talla: 171.2, peso: 64, imc: 21.83596820683029 },
    h: [{ name: 'Luxación Bloqueada o Fractura (→ Rx)' }] };
  const amp = { edad: null, signoComparable: '', estabilidad: '', irritabilidad: null, psico: [], criterios: [], arbol: [], pautas: [],
    tests: [
      { hipotesis: 'Luxación Bloqueada o Fractura (→ Rx)', derivar: true, items: [{ test: 'Fractura', resultado: 'negativo' }] },
      { hipotesis: 'Síndrome subacromial', items: [{ test: 'Arco doloroso', resultado: 'positivo' }] },
    ] };
  const ctx = IN.contextoValoracion(d, r => r, amp);
  assert.ok(ctx.includes('IMC 21.8') && !ctx.includes('21.835'), 'IMC con un decimal');
  assert.ok(!ctx.includes('(→') && !ctx.includes('①'), 'sin etiquetas internas');
  assert.match(ctx, /Luxación Bloqueada o Fractura — comprobaciones de una hipótesis que se deriva: .*un resultado negativo no la descarta/);
});

test('construirAmpliado: el gesto testigo no va y las hipótesis «Derivar» se marcan', () => {
  withState({ region: 'hombro', activeHypotheses: ['h11', 'h2'],
    testResults: { h11: { 0: 'neg' }, h2: { 0: 'pos', 5: 'pos' } } }, () => {
    const a = IA.construirAmpliado();
    const h11 = a.tests.find(t => t.hipotesis === HYPOTHESES.h11.name);
    const h2 = a.tests.find(t => t.hipotesis === HYPOTHESES.h2.name);
    assert.equal(h11.derivar, true);
    assert.ok(!('derivar' in h2));
    assert.ok(/^Gesto testigo/.test(HYPOTHESES.h2.tests[5].name), 'h2[5] sigue siendo el gesto testigo');
    assert.ok(!h2.items.some(i => /^Gesto testigo/.test(i.test)), 'el gesto testigo no va al prompt (no lleva valor)');
    assert.equal(h2.items.length, 1);
  });
});

test('construirAmpliado: una derivación del árbol ya resuelta llega como antecedente, sin «derivación médica»', () => {
  withState({ region: 'codo', treeAnswers: { co_step1: 'fractura', co_step2: 'si' }, activeHypotheses: ['co3'], derivacionResuelta: { co_step1: true } }, () => {
    const l = IA.construirAmpliado().arbol[0];
    assert.equal(l.respuesta, 'FRACTURA / LUXACIÓN');
    assert.equal(l.tratada, true);
    assert.match(IN.bloquesAmpliados({ arbol: [l] }).join('\n'), /FRACTURA \/ LUXACIÓN \(ya diagnosticada y tratada: es un antecedente\)/);
  });
  withState({ region: 'codo', treeAnswers: { co_step1: 'fractura' }, activeHypotheses: [], derivacionResuelta: {} }, () => {
    assert.match(IA.construirAmpliado().arbol[0].respuesta, /derivación médica/, 'sin marcar, la derivación sigue');
  });
});

test('construirAmpliado: iaPregunta / iaTexto del árbol sustituyen al texto de pantalla solo en el prompt', () => {
  withState({ region: 'cadera', treeAnswers: { ca_step1: 'no', ca_step2: 'no' }, activeHypotheses: [] }, () => {
    const arbol = IA.construirAmpliado().arbol;
    const r = arbol.map(x => x.respuesta).join('\n');
    assert.ok(!/cojera|rotación interna|síntomas mecánicos/.test(r), 'sin la cojera, la RI ni los síntomas mecánicos de las etiquetas');
    assert.ok(r.includes('NO — El dolor no parece referido desde la columna lumbar ni la sacroilíaca'));
    assert.ok(r.includes('NO — Perfil no degenerativo'));
  });
  withState({ region: 'tobillo_pie', treeAnswers: { tp_step1: 'no', tp_step6: 'aquiles_media', tp_step7: 'no' }, activeHypotheses: [] }, () => {
    const r = IA.construirAmpliado().arbol.map(x => x.respuesta);
    assert.ok(r.includes('AQUILES PORCIÓN MEDIA'), 'solo la conclusión, sin «Pinza, 2–6 cm» (Sergio, ronda 19)');
    assert.ok(!r.some(x => /Sin dolor medial/.test(x)), 'el NINGUNO de un paso de zona no se envía');
  });
  withState({ region: 'rodilla', treeAnswers: { ro_step1: 'menisco' }, activeHypotheses: [] }, () => {
    assert.equal(IA.construirAmpliado().arbol[0].respuesta, 'SÍ — Trauma rotacional (orienta a: menisco)', 'sin «síntomas de bloqueo o chasquidos» (Marta, ronda 18)');
  });
  for (const o of CIF_TREES.rodilla.steps.find(s => s.id === 'ro_step1').options.filter(o => o.value !== 'no'))
    assert.ok(o.iaTexto && !/bloqueo|chasquido|derrame|aprensión|escalón|pop/i.test(o.iaTexto), `ro_step1.${o.value}: iaTexto sin síntomas ni signos`);
  withState({ region: 'rodilla', treeAnswers: { ro_step1b: 'no' }, activeHypotheses: [] }, () => {
    const p = IA.construirAmpliado().arbol[0].pregunta;
    assert.ok(p.startsWith('¿Algún criterio de Ottawa') && !/Pittsburgh|%|Seaberg/.test(p));
  });
});

test('prompt: textoOpcionIA envía la conclusión; NO, derivaciones, iaEntera e iaTexto enteros; el NINGUNO de zona no va', () => {
  const t = IN.textoOpcionIA;
  assert.equal(t({ label: 'SÍ — Test de Spurling positivo, ULNT1 positivo o alivio' }), 'SÍ');
  assert.equal(t({ label: 'HOFFA — Recurvatum, test de Hoffa' }), 'HOFFA');
  assert.equal(t({ label: 'NO — FADDIR y flexión-RI negativos' }), 'NO — FADDIR y flexión-RI negativos');
  assert.equal(t({ label: 'THOMPSON POSITIVO — Rotura del Aquiles: derivación preferente' }), 'THOMPSON POSITIVO — Rotura del Aquiles: derivación preferente');
  assert.equal(t({ label: '5.º MT — Fractura', iaEntera: true }), '5.º MT — Fractura');
  assert.equal(t({ label: 'SÍ — A o B', iaTexto: 'SÍ — Orienta a X' }), 'SÍ — Orienta a X');
  assert.equal(t({ label: 'NINGUNO — Sin dolor medial o nada de esto lo explica' }), null);
  assert.equal(t({ label: 'NINGUNO — Ottawa negativo y eleva la pierna extendida' }), 'NINGUNO — Ottawa negativo y eleva la pierna extendida', 'un NINGUNO de seguridad sí va');
  assert.equal(t({ label: 'MENISCO MEDIAL' }), 'MENISCO MEDIAL');
  // Las preguntas con varios «SÍ» llevan iaTexto, o el prompt no sabría cuál fue
  for (const [r, tr] of Object.entries(CIF_TREES)) for (const st of tr.steps) {
    const sis = st.options.filter(o => !o.iaTexto && !o.iaEntera && t(o) === 'SÍ');
    assert.ok(sis.length <= 1, `${r}.${st.id}: varias opciones llegarían como «SÍ» a secas`);
  }
});

test('prompt: ninguna línea de «Hallazgos de la exploración» lleva cifras de S/E, «veces» ni citas', () => {
  const mal = /%|\(unas? \d+ veces\)|\b(19|20)\d\d\b|\b[SE] ≈|\bLR\b/;
  for (const [r, t] of Object.entries(CIF_TREES)) for (const st of t.steps) {
    assert.ok(!mal.test(IN.limpiarEtiqueta(st.iaPregunta || st.question)), `${r}.${st.id}: pregunta`);
    for (const o of st.options) assert.ok(!mal.test(IN.limpiarEtiqueta(o.iaTexto || o.label)), `${r}.${st.id}.${o.value}: opción`);
  }
});

test('prompt: ninguna pregunta del árbol que llega al prompt lleva una instrucción para el fisioterapeuta', () => {
  // «Descartar antes lo vascular», «Palpar primero», «→ DERIVAR…»: el informe podía leerlas como algo hecho;
  // la instrucción se queda en pantalla y al prompt va `iaPregunta`
  const instruccion = /descart|palpar|revisar siempre|→|deriv|malignidad|explorar primero/i;
  for (const [r, t] of Object.entries(CIF_TREES)) for (const st of t.steps)
    assert.ok(!instruccion.test(IN.limpiarEtiqueta(st.iaPregunta || st.question)), `${r}.${st.id}: ${st.iaPregunta || st.question}`);
  const tp5 = CIF_TREES.tobillo_pie.steps.find(s => s.id === 'tp_step5');
  assert.match(tp5.iaPregunta, /no reproduce/, 'la opción «NO — … sí reproduce» responde a la pregunta en negativo');
});

test('prompt: aviso de patrón en los hallazgos; recordatorio de discrepancias junto al formulario solo con audio', () => {
  const d = { p: 'X', r: 'rodilla', d: '01/01/2026', br: [], sq: [], pn: {}, h: [] };
  const amp = { arbol: [{ pregunta: '¿Mecanismo?', respuesta: 'SÍ — Trauma rotacional con síntomas de bloqueo o chasquidos' }],
    formulario: [{ g: 'sintomas', q: '¿Nota alguna de estas cosas?', a: 'Le falla o cede: No' }], tests: [], pautas: [], psico: [], criterios: [] };
  const sin = IN.contextoValoracion(d, r => r, amp);
  const con = IN.contextoValoracion(d, r => r, amp, { conAudio: true });
  assert.ok(sin.includes(IN.AVISO_HALLAZGOS) && con.includes(IN.AVISO_HALLAZGOS));
  assert.ok(!sin.includes(IN.RECORDATORIO_DISCREPANCIAS), 'sin audio no hay nada con qué discrepar');
  assert.ok(con.includes(IN.RECORDATORIO_DISCREPANCIAS));
  assert.ok(IN.buildNarrativePrompt(d, { conAudio: true, ampliado: amp }).includes(IN.RECORDATORIO_DISCREPANCIAS));
  assert.ok(IN.buildFichaBrevePrompt(d, { conAudio: true, ampliado: amp }).includes(IN.RECORDATORIO_DISCREPANCIAS));
  assert.ok(!IN.buildNarrativePrompt(d, { conAudio: false, ampliado: amp }).includes(IN.RECORDATORIO_DISCREPANCIAS));
  assert.match(IN.buildNarrativePrompt(d, { conAudio: true, dictado: true, ampliado: amp }), /«no la ha hecho»/, 'el dictado avisa del «he» → «ha» de Whisper');
  assert.ok(IN.buildNarrativePrompt(d, { conAudio: true, ampliado: amp }).includes(IN.AVISO_NIEGA), 'con audio, el aviso va en la indicación de Dolor');
  assert.ok(!IN.buildNarrativePrompt(d, { conAudio: false, ampliado: amp }).includes(IN.AVISO_NIEGA));
  assert.ok(!IN.buildNarrativePrompt(d, { conAudio: false, ampliado: amp }).includes('persona atendida'), 'sin el ejemplo neutro que copiaba aunque constara el sexo');
});

const FM = await import('../../formulario.js');
const ESQUEMAS_FP = [['comun', (await import('../../formularios/comun.js')).default],
  ...await Promise.all(FM.REGIONES_CON_FORMULARIO.map(async r => [r, (await import(`../../formularios/${r}.js`)).default]))];
await FM.cargarEsquemaRegion('hombro');
test('formulario para la IA: todo item lleva un grupo `ia` válido', () => {
  const esquemas = ESQUEMAS_FP;
  for (const [r, e] of esquemas) for (const sec of e.secciones) for (const it of sec.items)
    assert.ok(FM.GRUPOS_IA.includes(it.ia), `${r}.${it.id}: ia «${it.ia}»`);
  assert.deepEqual(IN.GRUPOS_FORMULARIO.map(([g]) => g), FM.GRUPOS_IA, 'mismos grupos en formulario.js y en el prompt');
});

test('formulario para la IA: agrupado por sección y sin «No sé» (ni filas de matriz)', () => {
  withState({ region: 'hombro', formularioPrevio: { comun: { evolucion: 'No sabría decir', despierta: 'Sí' }, regiones: { hombro: {
    provoca: { elevar: 'Sí', cruzar: 'No sé' }, nota: { fuerza: 'Sí', crujidos: 'No' },
    antecedentes: { tiroides: 'No sé' }, actividades: ['Nadar', 'No sabría decir'], lanza: 'No sabría decir' } } } }, () => {
    const f = FM.resumenFormularioIA();
    const txt = JSON.stringify(f);
    assert.ok(!/No sé|No sabría decir/.test(txt), 'sin «No sé»');
    assert.ok(!f.some(x => /tiroides|Si lanza|Desde que empezó/.test(x.q + x.a)), 'sin items que solo tenían «No sé»');
    const g = q => f.find(x => x.q.includes(q))?.g;
    assert.equal(g('¿Le aparece o le aumenta'), 'actividades');
    assert.equal(g('¿Nota alguna'), 'sintomas');
    assert.equal(g('¿Le despierta'), 'sintomas');
    assert.equal(g('En el trabajo'), 'contexto');
    const bloque = IN.bloqueFormulario(f);
    assert.ok(bloque.indexOf('Síntomas que refiere') < bloque.indexOf('Actividades y posturas'), 'grupos en orden');
    assert.match(bloque, /van en Limitaciones en las Actividades\):\n    · ¿Le aparece o le aumenta el dolor al…\? → Levantar el brazo, por delante o por un lado: Sí\n/);
    const amp = IA.construirAmpliado();
    assert.deepEqual(amp.formulario, f);
    // `iaTexto`: nombre clínico solo para la IA (tradujo la fila como «dedos en resorte»)
    state.formularioPrevio.regiones.hombro.antecedentes = { dupuytren: 'No' };
    assert.ok(FM.resumenFormularioIA().some(x => x.a === 'Contractura de Dupuytren (dedos que se quedan doblados hacia la palma): No'));
    assert.ok(FM.resumenFormularioPrevio().some(x => x.a === 'Dedos que se le quedan doblados hacia la palma: No'), 'el resumen normal sigue con el texto del papel');
    const ctx = IN.contextoValoracion(buildPhysiQPayload(), r => r, amp);
    assert.ok(ctx.includes('agrupado por la sección del informe'));
    assert.ok(!ctx.includes('(pregunta → respuesta):\n  · '), 'con datos ampliados no va el fp plano');
  });
});

test('prompt: discrepancias con otras palabras, lo referido no se borra, cada indicación a quien la dio (décima revisión)', () => {
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
    assert.ok(p.includes('También es una discrepancia cuando lo cuenta con otras palabras'));
    assert.ok(p.includes('no borra lo que refiere el paciente'));
    assert.ok(p.includes('Atribuye cada indicación a quien la dio'));
    assert.ok(p.includes('no lo uses para interpretar los hallazgos o los tests'));
    assert.ok(p.includes('No añadas coordinación, comunicación ni reevaluaciones con otros profesionales'));
    assert.ok(p.includes('La cirugía y sus restricciones no son factores ambientales'));
  }
  const n = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
  assert.ok(n.includes('la cirugía y las restricciones del cirujano no van aquí'), 'Factores Ambientales');
  assert.ok(n.includes('[Solo si hay cirugía: fecha, protocolo del cirujano'), 'Intervención Quirúrgica');
});

test('prompt: los ejemplos no son del caso y solo muestran la forma; estructura en orden (undécima revisión)', () => {
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
    assert.ok(p.includes('solo muestran la forma de escribir: nunca copies su contenido'));
    // Los ejemplos que se copiaron tal cual (Lucía, Pedro) ya no están
    assert.ok(!/despertares ocasionales|mano dormida|material de osteosíntesis/.test(p));
    assert.ok(p.includes('ni cambies ninguna de sección o de orden'));
    assert.ok(p.includes('No deduzcas la frecuencia ni la regularidad de una actividad'));
    assert.ok(p.includes('basta con una frase que lo supedite al protocolo del cirujano'));
    assert.ok(p.includes('«recorrido de la exploración»'), 'en la lista de fuentes que no se nombran');
  }
  const n = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
  assert.ok(n.includes('Intervención Quirúrgica y Cribado de Seguridad van dentro de HISTORIA CLÍNICA Y EVOLUCIÓN'));
  assert.ok(n.includes('Con cirugía, solo el diagnóstico que motivó la intervención'));
  assert.ok(n.includes('los hallazgos de movilidad van solo en Movilidad'));
  assert.ok(!/recorrido de la exploración y/.test(n), 'las instrucciones ya no usan el nombre del bloque');
});

test('prompt: sin ejemplos con género, tests con «o», picos sin reconciliar, Movilidad opcional (duodécima revisión)', () => {
  const d = { p: 'X', r: 'lumbar', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
    assert.ok(!/«sentada»|«sentado»|«la paciente»/.test(p), 'sin ejemplos con género que copiar');
    assert.ok(p.includes('no afirmes las dos'));
    assert.ok(p.includes('no cambies fechas ni circunstancias para que encajen'));
    assert.ok(p.includes('No añadas diagnósticos diferenciales que no estén en los datos'));
  }
  const n = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
  assert.ok(n.includes('### Movilidad\n[Solo si hay hallazgos de movilidad distintos del signo comparable'));
  assert.ok(n.includes('lo que no le empeora no se enumera aquí'));
});

test('prompt: siglas, cirujano una vez, notas sin nombre de campo, embudo (decimotercera revisión)', () => {
  const base = { p: 'X', r: 'tobillo_pie', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(base, { conAudio: true, nombreRegion: r => r, ampliado: null });
    assert.ok(p.includes('no desarrolles una sigla que los datos no desarrollan'));
    assert.ok(p.includes('y no lo repitas en ninguna otra parte (ni en la presentación, ni en lo pendiente, ni en los objetivos)'));
    assert.ok(p.includes('«en la conversación», «en consulta»'));
    assert.ok(p.includes('No atribuyas un síntoma a un mecanismo'));
  }
  const breve = { ...base, md: 'breve', cq: { iv: 'ORIF', fe: '30/07/2026', se: 10, pr: '', re: '', co: [] },
    pe: ['Cribado sistémico solo por embudo (sin preguntas una a una): Vascular', 'Formulario previo sin rellenar', 'Restricciones pendientes de confirmar con el cirujano (sin protocolo)'] };
  const c = IN.contextoValoracion(breve, r => r, null);
  assert.ok(!/Pendiente de completar:[\s\S]*cirujano/.test(c), 'con cirugía, la lista de pendientes no repite al cirujano');
  assert.ok(c.includes('Formulario previo sin rellenar'));
  assert.ok(c.includes('lo pendiente se dice solo en esa frase'));
  assert.match(c, /Cribado sistémico: sin hallazgos en el embudo \(cribado abreviado\)/);
  assert.match(IN.contextoValoracion({ ...base, md: 'breve', pe: ['Formulario previo sin rellenar'] }, r => r, null), /Cribado sistémico: Negativo/, 'sin embudo, como siempre');
  assert.match(IN.contextoValoracion({ ...base, pn: { variableControl: 'Dolor < 4/10', anclajeHabito: 'Tras el paseo' } }, r => r, null),
    /Indicaciones del fisioterapeuta para el plan:\n  · Para dosificar la carga: Dolor < 4\/10\n  · Cuándo hacer los ejercicios: Tras el paseo/);
});

test('tobillo: el KTW lleva su nombre (desarrolló la sigla como un test inexistente)', () => {
  assert.ok(HYPOTHESES.tp20.tests.some(t => t.name === 'KTW (rodilla a la pared)'));
  assert.ok(!Object.values(HYPOTHESES).some(h => h.tests.some(t => /\bKTW\b(?! \(rodilla a la pared\))/.test(t.name))), 'ningún test con la sigla sola');
});

test('prompt: derivación urgente sin pautas, cifras sin clasificar, psicosocial sin etiquetas diagnósticas (decimocuarta revisión)', () => {
  const a = { pautas: [{ hipotesis: 'Cefalea Cervicogénica', pauta: 'Biofeedback de 20 a 30 mmHg', fuente: 'APTA', prom: 'NDI', pronostico: { derivacion: 'El 30 % cumple criterios de migraña' } }] };
  const normal = IN.bloquesAmpliados(a).join('\n');
  assert.ok(normal.includes('Biofeedback de 20 a 30 mmHg'));
  const urg = IN.bloquesAmpliados(a, { urgente: true }).join('\n');
  assert.ok(!/mmHg|migraña|APTA/.test(urg), 'con derivación urgente no van pautas, fuentes ni pronóstico');
  assert.match(urg, /^Plan: derivación urgente\. La pauta de fisioterapia se decidirá después de la valoración médica/m);
  assert.ok(urg.includes('Escala recomendada para el seguimiento:\n  · Cefalea Cervicogénica: NDI'));
  const d = { p: 'X', r: 'cervical', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {}, ur: ['Cefalea con signos de alarma: derivación a urgencias hoy.'] };
  assert.ok(IN.contextoValoracion(d, r => r, a).includes('Plan: derivación urgente'), 'contextoValoracion pasa la urgencia');
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
    assert.ok(p.includes('Con una derivación urgente no escribas ningún plan de tratamiento'));
    assert.ok(p.includes('No nombres los diagnósticos que el médico deberá descartar'));
    assert.ok(p.includes('se dan tal cual, sin clasificarlas'));
  }
  withState({ region: 'cervical', riesgoPsico: 'Alto', psico_miedo: 'Sí', psico_autoef: 'Dudoso', psico_emocional: 'Sí' }, () => {
    const t = IN.bloquesAmpliados(IA.construirAmpliado()).join('\n');
    assert.match(t, /Cribado psicosocial detallado:\n  · Miedo al movimiento → Sí\n  · Baja autoeficacia → Dudoso\n  · Componente emocional → Sí/);
    assert.ok(!/ansiedad|depresión|catastrofización/.test(t), 'sin etiquetas diagnósticas');
  });
});

test('formulario de hombro: «llevar la mano a la espalda» sin el sujetador para la IA', () => {
  withState({ region: 'hombro', formularioPrevio: { comun: {}, regiones: { hombro: { provoca: { espalda: 'Sí' } } } } }, () => {
    assert.ok(FM.resumenFormularioIA().some(x => x.a === 'Llevar la mano a la espalda: Sí'));
    assert.ok(FM.resumenFormularioPrevio().some(x => x.a.includes('(sujetador, bolsillo)')), 'el papel no cambia');
  });
});

test('prompt: «No sé» nunca como negación, sin negativos inventados, cada dato en su sección', () => {
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
    assert.match(p, /«No sé» o «No sabría decir»: no las menciones de ninguna forma; ni como negación/);
    assert.match(p, /No afirmes negativos que no estén en los datos/);
    assert.match(p, /no la apoya|no la apoyan/, 'coherencia: «Derivar» con comprobaciones negativas');
  }
  const narr = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.match(narr, /La intensidad y la irritabilidad van en Dolor/);
  assert.match(narr, /Las actividades que provocan el dolor van en Limitaciones/);
  assert.match(narr, /dilo aquí y solo aquí, como «no muestra hallazgos que sugieran…», sin nombrar estructuras ni síndromes que no estén en los datos/);
  assert.match(narr, /Si no las hay, describe los hallazgos sin mencionar que faltan mediciones/);
  assert.ok(!/Lo que se descarta de otra región/.test(narr), "la indicación ya no invita a «descartar»");
  assert.match(narr, /sin suponer cómo podría afectarle/);
  assert.match(narr, /por falta de mejoría \(aquí y solo aquí\)/);
  assert.ok(!narr.includes('plan y pauta, y al final el seguimiento'), 'en el narrativo el seguimiento tiene su propia sección');
});

test('prompt: sin fisiopatología inventada, ejemplos negativos en Limitaciones, criterio de reevaluación solo en Seguimiento', () => {
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
    assert.match(p, /No añadas causas, mecanismos, secuelas ni fases de curación o de recuperación que no estén en los datos/);
    assert.match(p, /tampoco atribuyas los hallazgos a secuelas ni a la evolución esperable/);
    assert.match(p, /Si hay protocolo \(escrito o verbal\), sigue sus restricciones tal como constan: no pidas confirmarlo/);
    assert.match(p, /Cada recomendación del plan aparece una sola vez/);
  }
  const narr = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.match(narr, /Si aquí aparece fuerza, crujidos, bloqueos.*está mal/);
  assert.match(narr, /ni frases para decir que algo no se hizo, no se midió o «no se dispone de…»/);
  assert.match(narr, /va en Seguimiento, aunque venga dentro del texto de la pauta/);
});

test('ficha breve: sin nombre en el texto, CIF solo b/d, reparto de palabras, y sin «lo no explorado dilo una vez»', () => {
  const d = { p: 'X', r: 'rodilla', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  const f = IN.PLANTILLAS.breve.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.match(f, /Tampoco escribas el nombre del paciente ni la fecha en ningún punto del texto/);
  assert.match(f, /elegidos SOLO de esta lista .*si ningún código de la lista encaja, no pongas código: b134 funciones del sueño; /);
  assert.match(f, /d4101 ponerse en cuclillas; d4102/);
  // Lista cerrada: códigos b/d con forma válida, sin repetidos, todos en el prompt de la ficha y ninguno en el narrativo
  const cods = IN.CODIGOS_CIF.map(([c]) => c);
  assert.equal(new Set(cods).size, cods.length, 'sin códigos repetidos');
  for (const [c, t] of IN.CODIGOS_CIF) {
    assert.match(c, /^[bd]\d{3,5}$/, c);
    assert.ok(t && f.includes(`${c} ${t}`), `${c} en el prompt`);
  }
  assert.ok(!IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null }).includes('b134 funciones del sueño'), 'el narrativo no lleva códigos');
  assert.match(f, /PRESENTACIÓN CLÍNICA \d+, HALLAZGOS Y CODIFICACIÓN CIF \d+, OBJETIVOS Y PLAN \d+/);
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
    assert.ok(!/dilo UNA sola vez, en una frase, donde se describe la exploración/.test(p), 'sin la regla que invitaba a «no se realizó…»');
    assert.match(p, /Lo que no consta \(mediciones, fuerza, escalas, pruebas no realizadas…\) no se menciona/);
  }
  // Modo breve: decir una vez que es breve y qué queda pendiente, sin dar por completo lo pendiente
  const ctx = IN.contextoValoracion({ ...d, md: 'breve', pe: ['Cribado sistémico solo por embudo'] }, r => r, null);
  assert.match(ctx, /Dilo UNA vez en el informe, en una frase, junto con lo que queda pendiente de completar/);
  assert.match(ctx, /Pendiente de completar:\n  · Cribado sistémico solo por embudo/);
});

test('sexo: opcional, en la cabecera del prompt y del informe compartido, con concordancia; nunca en el payload', () => {
  withState({ region: 'rodilla', sexo: 'Mujer', edadPaciente: 34 }, () => {
    const d = buildPhysiQPayload();
    assert.ok(!('sexo' in d) && !('sx' in d), 'el payload (contrato con physiq-report) no cambia');
    const amp = IA.construirAmpliado();
    assert.equal(amp.sexo, 'Mujer');
    assert.match(IN.contextoValoracion(d, r => r, amp), /Edad: 34 años · Sexo: mujer · Región/);
  });
  withState({ region: 'rodilla', sexo: '' }, () => {
    assert.match(IN.contextoValoracion(buildPhysiQPayload(), r => r, IA.construirAmpliado()), /Sexo: no consta \(no lo deduzcas del nombre; redacta sin marcar el género\)/, 'sin sexo, la línea lo dice');
    assert.ok(!/Sexo:/.test(IN.contextoValoracion(buildPhysiQPayload(), r => r, null)), 'sin datos ampliados (payload de report), sin línea');
  });
  assert.match(IN.textoParaCompartir('## A\nB.', { p: 'X', d: '01/01/2026', r: 'rodilla', ed: 34, sx: 'Mujer' }, r => 'Rodilla'), /Edad: 34 años\nSexo: Mujer/);
  const p = IN.PLANTILLAS.breve.prompt({ p: 'X', r: 'rodilla', d: '01/01/2026', h: [], br: [], sq: [], pn: {} }, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.match(p, /Si consta el sexo, concuerda el género con él.*si no consta, redacta sin marcar el género/);
});

test('prompt: sin datos personales deducidos, sin citar las notas del plan, derivación descartada sin mencionar', () => {
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
    assert.match(p, /edad, sexo y lado afectado \(derecho, izquierdo\) solo si constan en los datos; nunca los deduzcas/);
    assert.match(p, /ni como desconocimiento \(«desconoce si…»\)/);
    assert.match(p, /no escribas que «descartan» nada/);
    assert.match(p, /«notas del plan» ni el nombre de sus campos/);
    assert.match(p, /si indica que no procede .*no menciones esa derivación en ningún punto/);
  }
  const narr = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.match(narr, /NO escribas el nombre del paciente ni la fecha en ningún punto del texto/);
  assert.match(narr, /los síntomas que refiere o niega van en Dolor/);
  assert.match(narr, /sin nombrar los tests/);
});

test('prompt: reglas de la revisión con informes reales, en las dos plantillas', () => {
  const d = { p: 'X', r: 'lumbar', d: '01/01/2026', h: [], br: [], sq: [], pn: {} };
  for (const conAudio of [true, false]) {
    for (const [nombre, pl] of Object.entries(IN.PLANTILLAS)) {
      const p = pl.prompt(d, { conAudio, nombreRegion: r => r, ampliado: null });
      // El diagnóstico médico fijo contradecía al paciente cuando lo contaba
      assert.ok(!p.includes('no aportado'), `${nombre}: sin «Diagnóstico médico: no aportado» fijo`);
      // «Prevalecen los datos estructurados» hacía descartar o yuxtaponer lo que cuenta el paciente
      assert.ok(!p.includes('prevalecen los datos estructurados'), `${nombre}: sin la regla antigua de discrepancias`);
      assert.match(p, /Discrepancias:/, `${nombre}: regla de discrepancias`);
      assert.match(p, /No menciones de dónde sale cada dato/, `${nombre}: sin citar las fuentes`);
      assert.match(p, /Reglas pronósticas.*nunca las uses para reforzar ni descartar/, `${nombre}: regla pronóstica`);
      assert.match(p, /Derivaciones:.*UNA sola vez, al principio/, `${nombre}: derivación una vez, al principio del plan`);
      assert.match(p, /no decidas por tu cuenta si se espera/, `${nombre}: derivación no urgente sin decidir el momento`);
      assert.match(p, /Derivar».*aunque sus tests clínicos hayan salido negativos/, `${nombre}: «Derivar» se mantiene con tests negativos`);
      assert.match(p, /no cites cocientes de probabilidad/, `${nombre}: sin jerga de puntuación`);
      assert.match(p, /No crees secciones ni subsecciones/, `${nombre}: sin secciones inventadas`);
      assert.match(p, /no interpretes ni justifiques la discrepancia/, `${nombre}: discrepancias sin interpretar`);
      // El ejemplo antiguo («niega inicialmente…, aunque en consulta refiere…») se copiaba tal cual, fuente incluida
      assert.ok(!/niega inicialmente|en consulta refiere/.test(p), `${nombre}: el ejemplo no nombra la fuente`);
      assert.match(p, /no es una discrepancia: recógelo tal cual. No escribas que algo «no se menciona», «no se confirma»/, `${nombre}: lo que solo consta en una fuente no es discrepancia`);
      assert.match(p, /otra zona u otro lado.*UNA vez como algo que refiere el paciente.*nunca en Pruebas Clínicas.*No le añadas plan, seguimiento, prevención/, `${nombre}: el otro lado, referido y sin plan inventado`);
      assert.match(p, /no escribas que la «confirman»/, `${nombre}: los tests apoyan, no confirman`);
      assert.match(p, /«Cuándo reconsiderar o derivar» es contexto para el fisioterapeuta: no lo conviertas en acciones del plan, criterios de vuelta a la actividad/, `${nombre}: el pronóstico no se convierte en plan`);
    }
  }
  // Códigos CIF: limitados en la ficha (tiene sección propia); el narrativo, sin códigos
  const ficha = IN.PLANTILLAS.breve.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  const narr = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.match(ficha, /si ningún código de la lista encaja, no pongas código/, 'ficha: códigos CIF limitados');
  assert.match(narr, /sin códigos alfanuméricos/, 'narrativo: sin códigos CIF');
  // Narrativo de valoración inicial: fuera las subsecciones que solo producían «no se realizó…»
  for (const x of ['Función Cardiorrespiratoria', 'Control Motor', '#### Equilibrio', '6MWT', 'EQ-5D', 'Limitación Funcional Global'])
    assert.ok(!narr.includes(x), `narrativo: sin «${x}»`);
  assert.match(narr, /«\[solo si…\]» se omiten por completo, título incluido/);
  // El tope de tokens solo evita cortes: holgado respecto a las palabras pedidas (~1,6 tokens/palabra en español con códigos)
  for (const pl of Object.values(IN.PLANTILLAS)) assert.ok(pl.maxTokens >= pl.palabras * 3, `${pl.nombre}: tope de tokens holgado`);
});

test('texto para compartir: la edad va en la identificación', () => {
  assert.match(IN.textoParaCompartir('## A\nB.', { p: 'X', d: '01/01/2026', r: 'lumbar', ed: 47 }), /Edad: 47 años/);
  assert.doesNotMatch(IN.textoParaCompartir('## A\nB.', { p: 'X', d: '01/01/2026', r: 'lumbar' }), /Edad:/);
});

test('construirAmpliado: lee el estado de las cinco fases', () => {
  const lu = CIF_TREES.lumbar.steps[0];
  const lu8 = HYPOTHESES.lu8, lu1 = HYPOTHESES.lu1, ce8 = HYPOTHESES.ce8;
  withState({
    region: 'lumbar', edadPaciente: 33, signoComparable: ' Flexión ', estabilidad: 'Estable',
    irritabilidad: { dolor: 'Alto' }, irritabilidadDirecta: false,
    riesgoPsico: 'Alto', psico_miedo: 'Sí', psico_autoef: '', psico_emocional: 'No',
    treeAnswers: { [lu.id]: lu.options[0].value },
    activeHypotheses: ['lu8', 'lu1', 'ce8'],
    testResults: { lu8: { 0: 'pos', 1: 'nd' }, lu1: { 0: 'neg' } },
  }, () => {
    const a = IA.construirAmpliado();
    assert.equal(a.edad, 33);
    assert.equal(a.signoComparable, 'Flexión');
    assert.deepEqual(a.irritabilidad, { dolor: 'Alto' });
    assert.deepEqual(a.psico.map(x => x.a), ['Sí', 'No'], 'solo lo contestado');
    assert.deepEqual(a.arbol, [{ pregunta: lu.question, respuesta: 'SÍ' }], 'solo la conclusión, sin los criterios «SLR <60° o Slump»');
    const t8 = a.tests.find(t => t.hipotesis === lu8.name);
    assert.equal(t8.items.length, 1, '«nd» no cuenta como realizado');
    assert.equal(t8.items[0].resultado, 'positivo');
    assert.equal(t8.items[0].cluster, lu8.clusters[lu8.tests[0].cluster].nombre);
    assert.equal(a.tests.find(t => t.hipotesis === lu1.name).items[0].pronostico, true);
    assert.ok(!a.tests.some(t => t.hipotesis === ce8.name), 'sin tests hechos, no aparece');
    const p8 = a.pautas.find(p => p.hipotesis === ce8.name);
    assert.equal(p8.derivar, true);
    assert.equal(p8.pauta, '', 'la pauta de derivar no se repite como texto');
    assert.equal(a.pautas.find(p => p.hipotesis === lu8.name).fuente, lu8.dosisFuente);
  });
  withState({ irritabilidad: { dolor: 'Alto' }, irritabilidadDirecta: true, riesgoPsico: 'Medio', psico_miedo: 'Sí' }, () => {
    const a = IA.construirAmpliado();
    assert.equal(a.irritabilidad, null, 'nivel elegido directamente: la matriz no se rellenó');
    assert.deepEqual(a.psico, [], 'el detalle psicosocial solo con riesgo Alto');
  });
});

test('construirAmpliado: criterio compuesto con la misma regla que la fase 2', () => {
  const sis = SYSTEMIC_SCREENING.lumbar.sistemas.find(s => s.criterioCompuesto);
  const c = sis.criterioCompuesto;
  const si = Object.fromEntries(c.ids.slice(0, c.minPositivas).map(id => [id, 'SI']));
  withState({ region: 'lumbar', edadPaciente: c.filtro.edadMax - 1, cronologia: c.filtro.evolucion, sistemicoAnswers: si }, () => {
    assert.deepEqual(IA.construirAmpliado().criterios.map(x => x.etiqueta), [c.etiqueta]);
  });
  withState({ region: 'lumbar', edadPaciente: c.filtro.edadMax, cronologia: c.filtro.evolucion, sistemicoAnswers: si }, () => {
    assert.deepEqual(IA.construirAmpliado().criterios, [], 'fuera del filtro de edad, no se cumple');
  });
});

test('el payload de physiq-report no cambia con los datos ampliados', () => {
  withState({ edadPaciente: 40, signoComparable: 'X', treeAnswers: {}, activeHypotheses: [] }, () => {
    const keys = Object.keys(buildPhysiQPayload());
    assert.ok(!keys.includes('ed') && !keys.includes('_ampliado'), 'ni edad ni datos ampliados en el payload');
  });
});

test('app.js solo carga informe-ia.js fuera del hub', () => {
  const src = leer('app.js');
  const montar = src.slice(src.indexOf('function _montarInformeIA'), src.indexOf('function _montarInformeIA') + 300);
  assert.ok(/if \(_enHub\(\)\) return;/.test(montar), '_montarInformeIA debe salir antes de importar dentro del hub');
  assert.ok(!/^import .*informe-ia/m.test(src), 'nunca import estático de informe-ia.js');
});

test('deploy-to-hub copia todo .js que la app carga', () => {
  const wf = leer('.github/workflows/deploy-to-hub.yml');
  // Todo .js de la raíz o de lib/ que la app importa (estático o con import())
  // se despliega: un fichero olvidado solo falla en producción (paquete de
  // revisión: zip.js). app.js lo carga index.html; data/ y formularios/ van con *.js.
  const raiz = join(RAIZ);
  const fuentes = [...readdirSync(raiz).filter(f => f.endsWith('.js')).map(f => [f, '']), ...readdirSync(join(raiz, 'lib')).filter(f => f.endsWith('.js')).map(f => [f, 'lib/'])];
  const usados = new Set();
  for (const [f, dir] of fuentes) {
    for (const m of readFileSync(join(raiz, dir, f), 'utf8').matchAll(/(?:from|import\(?)\s*'\.\/((?:lib\/)?[\w-]+\.js)'/g))
      usados.add(dir === 'lib/' ? `lib/${m[1]}` : m[1]);
  }
  usados.add('app.js');
  for (const f of usados) assert.ok(new RegExp(`(^|\\s)${f.replace(/\./g, '\\.')}(\\s|$)`, 'm').test(wf), `deploy-to-hub.yml no copia ${f}`);
  assert.match(wf, /cp data\/\*\.js /);
  assert.match(wf, /cp formularios\/\*\.js /);
});

// lib/reglas-informe.js es idéntico en physiq-report: si cambia aquí, cópialo
// allí tal cual y actualiza esta huella en los dos tests/unit.js.
const HUELLA_REGLAS_INFORME = 'd4b2256d15abc49b32db822e2cb10794a4150e5ef509242b8cde030262c52008';
test('reglas compartidas: lib/reglas-informe.js no ha cambiado sin copiarlo a physiq-report', () => {
  const raiz = join(RAIZ);
  const h = createHash('sha256').update(readFileSync(join(raiz, 'lib/reglas-informe.js'))).digest('hex');
  assert.equal(h, HUELLA_REGLAS_INFORME, 'lib/reglas-informe.js ha cambiado: cópialo igual a physiq-report y actualiza la huella en los dos repos');
});

test('grabadora: app.js solo la carga fuera del hub', () => {
  const src = leer('app.js');
  const ini = src.slice(src.indexOf('function _iniciarGrabadora'), src.indexOf('function _iniciarGrabadora') + 200);
  assert.ok(/if \(_enHub\(\)\) return;/.test(ini), '_iniciarGrabadora debe salir antes de importar dentro del hub');
  assert.ok(!/^import .*grabadora/m.test(src), 'nunca import estático de grabadora.js');
});

test('grabadora: un reinicio llegado de otra pestaña no descarta el audio de este dispositivo', () => {
  const src = leer('app.js');
  const cuerpo = nombre => {
    const i = src.indexOf(`function ${nombre}(`);
    return src.slice(i, src.indexOf('\n}\n', i)).replace(/\/\/.*$/gm, '');   // sin comentarios
  };
  assert.ok(!/descartarTodo|_descartarAudioSesion/.test(cuerpo('_softResetApp')), '_softResetApp no puede tocar el audio (también corre por SESSION_RESET/SESSION_CLEAR remotos)');
  assert.ok(/_descartarAudioSesion\(\)/.test(cuerpo('resetApp')), 'reiniciar valoración (confirmado aquí) sí lo descarta');
  assert.ok(/_avisoAudioSesion\(\)/.test(cuerpo('resetApp')), 'y lo avisa en la confirmación');
  assert.ok(/_avisoAudioSesion\(\)/.test(cuerpo('promptClearSession')), 'borrar sesión: avisa en la confirmación');
  assert.ok(/_descartarAudioSesion\(\)/.test(cuerpo('_borrarSesion')), 'y descarta al confirmar');
});

// ── Licencia: motivo legible cuando /validate no responde (lib/licencia-ia.js) ─
console.log('\nlicencia del informe narrativo (motivo del error)');
{
  const L = await import('../../lib/licencia-ia.js');
  const fetchReal = globalThis.fetch;
  const respuesta = (status, cuerpo = {}) => ({ ok: status >= 200 && status < 300, status,
    headers: { get: () => null }, json: async () => cuerpo });
  // fetch con CORS (primera llamada) y sin CORS (la sonda no-cors), por separado
  const caso = async (conCors, sinCors) => {
    globalThis.fetch = async (_url, opts = {}) => (opts.mode === 'no-cors' ? sinCors() : conCors());
    const estado = await L.comprobarLicencia(true);
    return { estado, motivo: L.detalleLicencia() };
  };
  const fallo = () => { throw new TypeError('Failed to fetch'); };
  const pruebas = [
    ['worker alcanzable pero sin respuesta legible → error del servidor', fallo, async () => ({ type: 'opaque' }), 'error-red', /responde, pero con un error/],
    ['ni siquiera la sonda llega → bloqueado o sin conexión', fallo, fallo, 'error-red', /bloqueador de anuncios/],
    ['429 → límite, no «sin licencia»', async () => respuesta(429), fallo, 'error-red', /Demasiadas comprobaciones/],
    ['500 legible → error con su código', async () => respuesta(500), fallo, 'error-red', /error \(500\)/],
  ];
  const resultados = [];
  for (const [nombre, conCors, sinCors, estado, motivo] of pruebas) resultados.push([nombre, await caso(conCors, sinCors), estado, motivo]);
  const real = await caso(async () => respuesta(200, { routes: { report: 'real' } }), fallo);
  globalThis.fetch = fetchReal;
  for (const [nombre, r, estado, motivo] of resultados) {
    test(`licencia: ${nombre}`, () => {
      assert.equal(r.estado, estado);
      assert.match(r.motivo, motivo);
    });
  }
  test('licencia: con respuesta válida el estado es el del worker', () => assert.equal(real.estado, 'real'));
}
