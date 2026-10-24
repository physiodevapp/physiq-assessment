// Guía «Efectos del ejercicio» de la cabecera (docs/efectos-ejercicio.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, buildPhysiQPayload, buildInformeFisioterapiaText, buildContextSummaryText,
  withState, citasEnTexto, claveRegistro } from './comun.mjs';
const { NIVELES_EJERCICIO, APARTADOS_EJERCICIO, BLOQUES_EJERCICIO, TEXTOS_EJERCICIO, BLOQUE_POR_HIPOTESIS } = await import('../../data/ejercicio.js');
const { HYPOTHESES } = await import('../../data.js');
const E = await import('../../lib/ejercicio.js');
const { REFERENCIAS } = await import('../../data/referencias.js');

console.log('\nguía de efectos del ejercicio (cabecera)');

// Un bloque de prueba, correcto, para ejercitar los validadores y el HTML sin
// depender de que ya haya contenido real escrito
const muestra = () => ({
  id: 'prueba', titulo: 'Bloque de prueba', resumen: 'Solo para los tests',
  apartados: {
    que: [{ t: 'Frase de prueba sobre qué ocurre con el ejercicio.', nivel: 'mecanismo' }],
    evidencia: [
      { t: 'Frase de prueba con efecto medido en personas (Prueba 2020).', nivel: 'clinico' },
      { t: 'Frase de prueba con un mecanismo solo visto en ratas.', nivel: 'mecanismo' },
    ],
    consulta: [{ t: 'Frase de prueba sobre qué cambia en la consulta.', nivel: 'discutido' }],
    paciente: [{ t: 'Frase de prueba para explicárselo al paciente.', apoya: [0] }],
  },
  fuentes: ['Prueba 2020'],
});

test('los bloques de docs/efectos-ejercicio.md, en su orden (mioquinas dentro del antiinflamatorio), y los tres niveles', () => {
  assert.deepEqual(BLOQUES_EJERCICIO.map(b => b.id), ['hipoalgesia', 'mecanotransduccion', 'antiinflamatorio', 'centrales', 'ortostatica', 'hipermovilidad']);
  for (const b of BLOQUES_EJERCICIO) assert.ok(b.titulo && b.resumen, b.id);
  assert.deepEqual(Object.keys(NIVELES_EJERCICIO), ['clinico', 'mecanismo', 'discutido']);
  for (const n of Object.values(NIVELES_EJERCICIO)) assert.ok(n.corto && n.explicacion.length > 20);
  assert.deepEqual(APARTADOS_EJERCICIO.map(a => a.id), ['que', 'evidencia', 'consulta', 'paciente']);
});

test('un bloque con contenido cumple el esquema y sus fuentes están en el registro', () => {
  for (const b of E.bloquesConContenido()) {
    assert.deepEqual(E.problemasBloque(b), [], b.id);
    for (const k of b.fuentes) assert.ok(REFERENCIAS[k], `${b.id}: «${k}» no está en data/referencias.js`);
  }
});

test('el validador acepta un bloque correcto y rechaza los fallos de nivel y de apoyo', () => {
  assert.deepEqual(E.problemasBloque(muestra()), []);
  const sinNivel = muestra(); sinNivel.apartados.evidencia[0].nivel = 'seguro';
  assert.ok(E.problemasBloque(sinNivel).some(p => /nivel «seguro» no existe/.test(p)));
  // decisión 4: una frase para el paciente no se apoya en mecanismo ni en discutido
  const enMecanismo = muestra(); enMecanismo.apartados.paciente[0].apoya = [1];
  assert.ok(E.problemasBloque(enMecanismo).some(p => /no es de nivel 'clinico'/.test(p)));
  const sinApoyo = muestra(); delete sinApoyo.apartados.paciente[0].apoya;
  assert.ok(E.problemasBloque(sinApoyo).some(p => /no dice en qué afirmación/.test(p)));
  const fantasma = muestra(); fantasma.apartados.paciente[0].apoya = [7];
  assert.ok(E.problemasBloque(fantasma).some(p => /no es de nivel 'clinico'/.test(p)));
  const vacio = muestra(); vacio.apartados.consulta = [];
  assert.ok(E.problemasBloque(vacio).some(p => /consulta: vacío/.test(p)));
  const sinFuentes = muestra(); sinFuentes.fuentes = [];
  assert.ok(E.problemasBloque(sinFuentes).some(p => /sin fuentes/.test(p)));
});

test('cada cita dentro de la frase es una fuente de su bloque', () => {
  for (const b of E.bloquesConContenido()) {
    const usadas = new Set();
    const textos = Object.values(b.apartados).flat().map(f => typeof f === 'string' ? f : f.t);
    for (const t of textos) {
      for (const m of citasEnTexto(t).matchAll(/data-cita="([^"]+)"/g)) {
        const clave = claveRegistro(m[1].replace(/&quot;/g, '"'), REFERENCIAS);
        assert.ok(clave && b.fuentes.includes(clave), `${b.id}: «${m[1]}» no es una de sus fuentes`);
        usadas.add(clave);
      }
    }
    for (const k of b.fuentes) assert.ok(usadas.has(k), `${b.id}: «${k}» está en fuentes pero no se cita`);
  }
});

test('límites: nunca dosifica por ti ni sustituye un tratamiento médico', () => {
  const prohibido = /\b(sustituye (a )?(la |el )?(medicaci|tratamiento m)|deja (la |el )?(medicaci|tratamiento)|no necesitas (medicaci|ir al m))/i;
  for (const b of E.bloquesConContenido()) {
    for (const f of Object.values(b.apartados).flat()) assert.ok(!prohibido.test(typeof f === 'string' ? f : f.t), `${b.id}: ${f.t ?? f}`);
  }
  assert.ok(/no sustituye a un tratamiento médico/.test(TEXTOS_EJERCICIO.limites));
});

test('el HTML: leyenda de niveles, chip pulsable por afirmación, «✨ IA» por párrafo y pendientes listados', () => {
  const vacia = E.ejercicioHTML();
  assert.equal((vacia.match(/class="ej-bloque"/g) || []).length, E.bloquesConContenido().length);
  for (const k of Object.keys(NIVELES_EJERCICIO)) assert.ok(vacia.includes(`ej-nivel-${k}`), k);
  for (const b of E.bloquesPendientes()) assert.ok(vacia.includes(b.titulo), b.id);
  // Con un bloque de prueba escrito: se pinta con sus chips, y el apartado «paciente» no lleva chip
  const b = BLOQUES_EJERCICIO.find(x => x.id === 'hipoalgesia');
  const antes = b.apartados;
  b.apartados = muestra().apartados; b.fuentes = ['Prueba 2020'];
  try {
    // Solo el bloque de prueba: los demás bloques escritos tienen sus propios chips
    const html = E.ejercicioHTML().split('data-bloque="hipoalgesia"')[1].split('data-bloque="')[0];
    assert.equal((html.match(/<button type="button" class="ej-nivel /g) || []).length, 4);   // que 1 + evidencia 2 + consulta 1
    assert.equal((html.match(/class="ia-parrafo"/g) || []).length, 5);                         // + 1 de paciente
    const paciente = 'data-apartado="paciente"' + html.split('data-apartado="paciente"')[1].split('</section>')[0];
    assert.ok(!paciente.includes('ej-nivel'), 'el apartado «paciente» no lleva chip de nivel');
    assert.ok(!html.includes('<li><strong>Hipoalgesia'), 'un bloque escrito deja de estar pendiente');
  } finally { delete b.apartados; delete b.fuentes; if (antes) b.apartados = antes; }
});

test('la guía no lee el estado del paciente ni llega al payload, los resúmenes o el prompt', () => {
  const src = leer('lib/ejercicio.js');
  assert.ok(!/\bstate\b/.test(src.replace(/\/\/.*$/gm, '')), 'lib/ejercicio.js no toca state');
  withState({ region: 'lumbar', patient: 'Paciente Prueba' }, () => {
    const salida = JSON.stringify(buildPhysiQPayload()) + buildInformeFisioterapiaText() + buildContextSummaryText();
    for (const b of BLOQUES_EJERCICIO) assert.ok(!salida.includes(b.titulo) && !salida.includes(b.resumen), b.id);
    for (const t of Object.values(TEXTOS_EJERCICIO)) assert.ok(!salida.includes(t), t);
  });
});

test('app: botón de cabecera, opción en «Herramientas», funciones expuestas, ficha de nivel y deploy', () => {
  const html = leer('index.html');
  assert.ok(html.includes('id="ejercicioBtn"') && html.includes('onclick="abrirEjercicio()"'));
  assert.ok(html.includes(`onclick="herramientaElegir('ejercicio')"`));
  assert.ok(html.includes('id="ejercicioOverlay"') && html.includes('onclick="cerrarEjercicio()"'));
  for (const fn of ['abrirEjercicio', 'cerrarEjercicio']) assert.equal(typeof globalThis[fn], 'function', fn);
  const app = leer('app.js');
  assert.ok(/ejercicio: abrirEjercicio/.test(app));
  assert.ok(/_ejercicioHistorial\) \{ cerrarEjercicio\(\{ desdeHistorial: true \}\)/.test(app), 'Atrás cierra la hoja');
  assert.ok(/cerrarEjercicio\(\{ sinHistorial: true \}\)/.test(app), '_closeAllOverlays la cierra');
  const deploy = leer('.github', 'workflows', 'deploy-to-hub.yml');
  assert.ok(deploy.includes('lib/ejercicio.js'), 'lib/ejercicio.js en el deploy (data/*.js ya se copia entero)');
});

test('enlace de la fase 6: alta → hipoalgesia, baja o moderada → mecanotransducción; sin nivel, como el plan (alta)', () => {
  const id = x => E.bloqueEjercicioParaIrritabilidad(x)?.id;
  assert.equal(id('alta'), 'hipoalgesia');
  assert.equal(id('moderada'), 'mecanotransduccion');
  assert.equal(id('baja'), 'mecanotransduccion');
  for (const sin of [null, undefined, '', 'Alta', 'otra']) assert.equal(id(sin), 'hipoalgesia', String(sin));
  // Solo enlaza un bloque ya escrito y que existe
  for (const k of ['alta', 'baja']) assert.ok(BLOQUES_EJERCICIO.some(b => b.id === id(k) && b.apartados));
});

test('enlace de la fase 6: sin bloque escrito no hay enlace', () => {
  const b = BLOQUES_EJERCICIO.find(x => x.id === 'hipoalgesia');
  const antes = b.apartados;
  delete b.apartados;
  try {
    assert.equal(E.bloqueEjercicioParaIrritabilidad('alta'), null);
    assert.equal(E.enlaceEjercicioHTML('alta'), '');
    assert.ok(E.enlaceEjercicioHTML('baja').includes("abrirEjercicio({ bloque: 'mecanotransduccion' })"), 'el otro bloque sigue enlazado');
  } finally { b.apartados = antes; }
});

test('enlace de la fase 6: ofrece también el otro bloque, sin cambiar el principal', () => {
  const alta = E.enlaceEjercicioHTML('alta');
  assert.ok(alta.includes('data-bloque-alternativo="mecanotransduccion"'));
  assert.ok(alta.indexOf('data-bloque-ejercicio="hipoalgesia"') < alta.indexOf('data-bloque-alternativo'));
  assert.ok(E.enlaceEjercicioHTML('baja').includes('data-bloque-alternativo="hipoalgesia"'));
  assert.ok(E.enlaceEjercicioHTML('moderada').includes('data-bloque-alternativo="hipoalgesia"'));
  assert.ok(!alta.includes('{titulo}'));
  const b = BLOQUES_EJERCICIO.find(x => x.id === 'mecanotransduccion');
  const antes = b.apartados;
  delete b.apartados;
  try { assert.ok(!E.enlaceEjercicioHTML('alta').includes('data-bloque-alternativo')); } finally { b.apartados = antes; }
});

test('enlace de la fase 6: «Efectos centrales» con riesgo psicosocial o cuestionario de ánimo con síntomas, «antiinflamatorio» solo con lupus', () => {
  assert.deepEqual(E.motivosEjercicio({}), { animo: false, reumatica: false });
  assert.equal(E.motivosEjercicio({ riesgoPsico: 'Bajo' }).animo, false);
  assert.equal(E.motivosEjercicio({ riesgoPsico: 'Medio' }).animo, true);
  assert.equal(E.motivosEjercicio({ riesgoPsico: 'Alto' }).animo, true);
  // PHQ-9: incompleto no cuenta; mínimo (0) no; leve (9 puntos) sí
  const r = v => ({ r: Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i + 1, v(i)])) });
  assert.equal(E.motivosEjercicio({ cuestionarios: { phq9: { r: { 1: 3 } } } }).animo, false);
  assert.equal(E.motivosEjercicio({ cuestionarios: { phq9: r(() => 0) } }).animo, false);
  assert.equal(E.motivosEjercicio({ cuestionarios: { phq9: r(i => i < 8 ? 1 : 0) } }).animo, true);
  // Un cuestionario que no es de ánimo no cuenta
  assert.ok(!E.CUESTIONARIOS_ANIMO.includes('odi'));
  assert.equal(E.motivosEjercicio({ lupusDiagnosticado: true }).reumatica, true);
  const sin = E.enlaceEjercicioHTML('alta');
  assert.ok(!sin.includes('data-bloque-extra'), 'sin motivo, solo los dos de la irritabilidad');
  const con = E.enlaceEjercicioHTML('alta', { animo: true, reumatica: true });
  assert.ok(con.includes('data-bloque-extra="centrales"') && con.includes('data-bloque-extra="antiinflamatorio"'));
  assert.ok(con.includes(TEXTOS_EJERCICIO.enlaceMotivoAnimo) && con.includes(TEXTOS_EJERCICIO.enlaceMotivoReumatica));
  assert.ok(con.indexOf('data-bloque-alternativo') < con.indexOf('data-bloque-extra'), 'los extra van después');
  assert.ok(E.enlaceEjercicioHTML('baja', { animo: true }).includes("abrirEjercicio({ bloque: 'centrales' })"));
});

test('enlace de los recuadros de la fase 5: lupus → antiinflamatorio, osteoporosis → mecanotransducción, disautonomía → ortostática, hipermovilidad → su bloque, nada más', () => {
  const les = E.enlaceCondicionEjercicioHTML('lupus');
  assert.ok(les.includes('data-bloque-condicion="antiinflamatorio"') && les.includes("abrirEjercicio({ bloque: 'antiinflamatorio' })"));
  assert.ok(les.includes(TEXTOS_EJERCICIO.enlaceCondicionLupus));
  const op = E.enlaceCondicionEjercicioHTML('osteoporosis');
  assert.ok(op.includes('data-bloque-condicion="mecanotransduccion"') && op.includes(TEXTOS_EJERCICIO.enlaceCondicionOsteoporosis));
  const ds = E.enlaceCondicionEjercicioHTML('disautonomia');
  assert.ok(ds.includes('data-bloque-condicion="ortostatica"') && ds.includes(TEXTOS_EJERCICIO.enlaceCondicionDisautonomia));
  const hm = E.enlaceCondicionEjercicioHTML('hipermovilidad');
  assert.ok(hm.includes('data-bloque-condicion="hipermovilidad"') && hm.includes(TEXTOS_EJERCICIO.enlaceCondicionHipermovilidad));
  for (const c of ['mastocitos', 'embarazo', 'anticoagulado', 'posquirurgico', '']) assert.equal(E.enlaceCondicionEjercicioHTML(c), '', c);
  // El lupus solo con «Diagnosticado», y ninguno de los dos llega a lo que se comparte
  const app = leer('app.js');
  assert.ok(app.includes("d.es === 'diagnosticado' ? enlaceCondicionEjercicioHTML('lupus') : ''"));
  // La hipermovilidad, nunca con el subtipo vascular: sus ensayos no lo incluyen y su pauta es otra (Byers 2017)
  assert.ok(app.includes("d.st === 'vascular' ? '' : enlaceCondicionEjercicioHTML('hipermovilidad')"));
  for (const t of [TEXTOS_EJERCICIO.enlaceCondicionLupus, TEXTOS_EJERCICIO.enlaceCondicionOsteoporosis, TEXTOS_EJERCICIO.enlaceCondicionDisautonomia, TEXTOS_EJERCICIO.enlaceCondicionHipermovilidad]) {
    for (const f of ['lib/resumenes.js', 'lib/lupus.js', 'lib/osteoporosis.js', 'lib/disautonomia.js', 'lib/hipermovilidad.js', 'informe-ia.js', 'lib/informe-narrativo.js']) assert.ok(!leer(f).includes(t), f);
  }
});

test('enlace de la fase 6 por hipótesis: la tabla solo nombra hipótesis y bloques que existen', () => {
  const escritos = E.bloquesConContenido().map(b => b.id);
  const CRONOLOGIAS = ['Agudo (<6 semanas)', 'Subagudo', 'Crónico (>3 meses)'];
  for (const [id, entrada] of Object.entries(BLOQUE_POR_HIPOTESIS)) {
    assert.ok(HYPOTHESES[id], `${id} no es una hipótesis`);
    const bloque = typeof entrada === 'string' ? entrada : entrada.bloque;
    if (typeof entrada !== 'string') assert.ok(CRONOLOGIAS.includes(entrada.cronologia), `${id}: cronología «${entrada.cronologia}»`);
    assert.ok(['hipoalgesia', 'mecanotransduccion'].includes(bloque) && escritos.includes(bloque), `${id} → ${bloque}`);
    // Carga y adaptación del tejido: solo tendinopatías (su frase para el paciente habla del tendón),
    // más el pinzamiento subacromial, que su guía (Desmeules 2025) incluye en la del manguito
    if (bloque === 'mecanotransduccion' && id !== 'h2') assert.ok(/tendinopat/i.test(HYPOTHESES[id].name), `${id}: ${HYPOTHESES[id].name}`);
  }
  assert.equal(BLOQUE_POR_HIPOTESIS.h2, 'mecanotransduccion');
  assert.ok(/Desmeules 2025/.test(HYPOTHESES.h2.dosisFuente) && /síndrome de dolor subacromial dentro de la tendinopatía del manguito/.test(HYPOTHESES.h2.dosisFuente), 'h2 se apoya en su guía');
  // Lo que cubre Geneen 2017 (la fuente de la frase de la hipoalgesia): artrosis de cadera y rodilla, patelofemoral
  for (const id of ['ca1', 'ro1', 'ro3']) assert.equal(BLOQUE_POR_HIPOTESIS[id], 'hipoalgesia', id);
  // Fuera a propósito: la artrosis que Geneen no cubre, la rotura del manguito, las radiculares y la estenosis,
  // las lesiones agudas y lo que se deriva
  for (const id of ['h10', 'tp24', 'h3', 'lu3', 'lu4', 'lu5', 'ce3', 'ce12', 'tp1', 'ro4', 'ro8', 'tp3', 'co7']) assert.ok(!BLOQUE_POR_HIPOTESIS[id], id);
});

test('enlace de la fase 6 por hipótesis: la lumbalgia y la cervicalgia mecánicas solo cuentan con dolor crónico', () => {
  const lumbar = [{ id: 'lu1', name: 'Disfunción Segmentaria' }];
  assert.equal(E.bloqueDeHipotesis('lu1'), null);
  assert.equal(E.bloqueDeHipotesis('lu1', { cronologia: 'Subagudo' }), null);
  assert.equal(E.bloqueDeHipotesis('lu1', { cronologia: 'Crónico (>3 meses)' }), 'hipoalgesia');
  assert.equal(E.bloqueDeHipotesis('ro5', { cronologia: 'Agudo (<6 semanas)' }), 'mecanotransduccion', 'sin condición vale siempre');
  const agudo = E.enlaceEjercicioHTML('baja', { hipotesis: lumbar, cronologia: 'Agudo (<6 semanas)' });
  assert.ok(agudo.includes('data-bloque-ejercicio="mecanotransduccion"') && !agudo.includes('data-por-hipotesis'), 'aguda: la irritabilidad');
  const cronico = E.enlaceEjercicioHTML('baja', { hipotesis: lumbar, cronologia: 'Crónico (>3 meses)' });
  assert.ok(cronico.includes('data-bloque-ejercicio="hipoalgesia"') && cronico.includes('data-por-hipotesis'));
  assert.ok(leer('plan.js').includes('cronologia: state.cronologia'), 'la fase 6 pasa la cronología');
});

test('enlace de la fase 6 por hipótesis: manda sobre la irritabilidad, y nombra la hipótesis', () => {
  const tendon = [{ id: 'ro5', name: 'Tendinopatía Rotuliana' }];
  const alta = E.enlaceEjercicioHTML('alta', { hipotesis: tendon });
  assert.ok(alta.includes('data-bloque-ejercicio="mecanotransduccion"') && alta.includes('data-por-hipotesis'));
  assert.ok(alta.includes('el bloque que corresponde a «Tendinopatía Rotuliana»'));
  assert.ok(alta.includes('data-bloque-alternativo="hipoalgesia"'), 'el secundario es el otro bloque');
  const cronico = [{ id: 'ce7', name: 'Dolor Mecánico Cervical Inespecífico Crónico' }];
  assert.ok(E.enlaceEjercicioHTML('baja', { hipotesis: cronico }).includes('data-bloque-ejercicio="hipoalgesia"'));
  // Una hipótesis fuera de la tabla no cuenta; las que están deciden
  assert.ok(E.enlaceEjercicioHTML('baja', { hipotesis: [...cronico, { id: 'ce1', name: 'X' }] }).includes('data-bloque-ejercicio="hipoalgesia"'));
  // Apuntan a bloques distintos, o ninguna en la tabla: la irritabilidad, como antes
  const mezcla = E.enlaceEjercicioHTML('alta', { hipotesis: [...tendon, ...cronico] });
  assert.ok(mezcla.includes('data-bloque-ejercicio="hipoalgesia"') && !mezcla.includes('data-por-hipotesis'));
  assert.ok(mezcla.includes('la irritabilidad elegida'));
  assert.ok(E.enlaceEjercicioHTML('baja', { hipotesis: [{ id: 'ce1', name: 'X' }] }).includes('data-bloque-ejercicio="mecanotransduccion"'));
  // Dos de la tabla con el mismo bloque: las nombra a las dos
  const dos = E.enlaceEjercicioHTML('alta', { hipotesis: [{ id: 'tp8', name: 'A' }, { id: 'tp9', name: 'B' }] });
  assert.ok(dos.includes('«A» y «B»'));
});

test('enlace de la fase 6: el botón abre el bloque y nombra cuál es', () => {
  const html = E.enlaceEjercicioHTML('alta');
  assert.ok(html.includes('data-bloque-ejercicio="hipoalgesia"'));
  assert.ok(html.includes("onclick=\"abrirEjercicio({ bloque: 'hipoalgesia' })\""));
  assert.ok(html.includes(TEXTOS_EJERCICIO.enlaceEducacion));
  assert.ok(html.includes('Hipoalgesia inducida por el ejercicio'), 'la ayuda dice a qué bloque lleva');
  assert.ok(!html.includes('{titulo}'));
});

test('enlace de la fase 6: solo en el bloque «Educación», solo en pantalla y nunca en los textos del plan', () => {
  const plan = leer('plan.js');
  assert.equal((plan.match(/enlaceEjercicioHTML\(/g) || []).length, 1);
  assert.ok(/b\.id === 'educacion' \? lista\(s\.educacion, b\.titulo\) \+ enlaceEjercicioHTML\(plan\.irritabilidad, \{ \.\.\.motivosEjercicio\(.*hipotesis: plan\.hipotesis, cronologia: state\.cronologia \}\)/.test(plan));
  assert.ok(leer('styles.css').includes('@media print { .plan-ejercicio, .cond-ejercicio { display: none !important; } }'));
  // Los textos que se comparten salen de lib/ y data/ del plan, que no conocen la guía
  for (const f of [['lib', 'plan-tratamiento.js'], ['data', 'plan-tratamiento.js'], ['lib', 'plan-ia.js']]) {
    const src = leer(...f).replace(/\/\/.*$/gm, '');
    assert.ok(!/ejercicio\.js|explicárselo al paciente/.test(src), f.join('/'));
  }
  assert.ok(/typeof opts\?\.bloque === 'string'/.test(leer('app.js')), 'abrirEjercicio acepta { bloque }');
});
