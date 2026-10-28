// Modo guía con grabadora externa: docs/modo-guia.md, decisión 3 («sin marcar» =
// «no preguntado», nunca «NO»). Se ejecuta desde tests/unit.js.
import { assert, leer, readdirSync, join, RAIZ, test, state, SYSTEMIC_SCREENING, HYPOTHESES, buildPhysiQPayload, buildInformeFisioterapiaText, buildContextSummaryText,
  buildSistemaHTML, sistemasActivos, withState, BASE_STATE } from './comun.mjs';

console.log('\nmodo guía (sin marcar = no preguntado)');
const { getNoPreguntadas, lineasNoPreguntadas, getUrgenciasActivas } = await import('../../app.js');
const IN = await import('../../lib/informe-narrativo.js');
const MG = await import('../../lib/modo-guia.js');
const { VERBALES, TEXTOS_GUIA } = await import('../../data/guia.js');
const { buildTestItem } = await import('../../phase4b.js');

const SIN = { br1: '', br2: '', br3: '', br4: '' };
const guia = (patch, fn) => withState({ region: 'lumbar', registro: 'guia', banderasRojas: SIN, sistemicoAnswers: {}, ...patch }, fn);
const preguntas = () => sistemasActivos().flatMap(s => s.preguntas);
const todasNO = () => Object.fromEntries(preguntas().map(q => [q.id, 'NO']));

test('modo guía: el estado empieza en teclado y las sesiones antiguas no cambian', () => {
  assert.equal((leer('state.js').match(/registro: '(\w+)'/) || [])[1], 'teclado');
  assert.match(leer('app.js'), /if \(state\.registro !== 'guia' \|\| _enHub\(\)\) state\.registro = 'teclado';/);
});

test('modo guía: sin respuesta nunca cuenta como positivo (alerta, urgencias, derivaciones, sq, br)', () => {
  guia({}, () => {
    const d = buildPhysiQPayload();
    assert.equal(d.si, false);
    assert.deepEqual(d.ur, []);
    assert.deepEqual(d.sq, []);
    assert.deepEqual(d.br, []);
    assert.deepEqual(getUrgenciasActivas(), []);
  });
});

test('modo guía: ningún módulo trata «distinto de NO» como positivo', () => {
  // `respuesta !== 'NO'` contaría como SÍ una pregunta sin responder
  for (const f of ['app.js', 'informe-ia.js', 'plan.js', 'phase4.js', 'phase4b.js', 'lib/hipermovilidad.js', 'lib/sintomas.js', 'lib/condiciones.js']) {
    assert.doesNotMatch(leer(f), /(sistemicoAnswers|banderasRojas)[^;\n]*!==\s*'NO'/, f);
  }
});

test('modo guía: lumbar sin tocar nada lista las 6 urgencias, las 4 banderas rojas y el resto por sistema', () => {
  guia({}, () => {
    const np = getNoPreguntadas();
    const urg = preguntas().filter(q => q.urgencia);
    assert.deepEqual(urg.map(q => q.id).sort(), ['hem_5', 'hem_6', 'l6', 'l_e8', 'l_v4', 'sx_sincope']);
    assert.deepEqual(np.urgentes, urg.map(q => q.text));
    assert.equal(np.banderas.length, 4);
    const resto = preguntas().filter(q => !q.urgencia).length;
    assert.equal(np.sistemas.reduce((n, s) => n + s.n, 0), resto);
    // Urgencias primero, luego banderas, luego sistemas
    const lineas = buildPhysiQPayload().np;
    assert.ok(lineas[0].startsWith('Urgencia sin preguntar: '));
    assert.equal(lineas.length, 6 + 4 + np.sistemas.length);
  });
});

test('modo guía: con todo contestado no hay `np` y los resúmenes dicen «Negativo» como siempre', () => {
  guia({ banderasRojas: { br1: 'NO', br2: 'NO', br3: 'NO', br4: 'NO' } }, () => {
    state.sistemicoAnswers = todasNO();
    const d = buildPhysiQPayload();
    assert.ok(!('np' in d));
    assert.match(buildContextSummaryText(), /Cribado sistémico: Negativo/);
    assert.match(IN.contextoValoracion(d), /Cribado sistémico: Negativo/);
    assert.match(buildInformeFisioterapiaText(), /en el cribado realizado\./);
  });
});

test('modo teclado: todo empieza en NO, así que nunca hay «sin preguntar» (payload sin cambios)', () => {
  withState({ region: 'lumbar' }, () => {
    state.sistemicoAnswers = todasNO();
    assert.deepEqual(lineasNoPreguntadas(), []);
    assert.ok(!('np' in buildPhysiQPayload()));
  });
});

test('modo guía: el botón NO no viene marcado; en teclado sí', () => {
  guia({}, () => {
    const html = sistemasActivos().map(s => buildSistemaHTML(s)).join('');
    assert.doesNotMatch(html, /sq-btn no selected/);
  });
  withState({ region: 'lumbar' }, () => {
    const html = sistemasActivos().map(s => buildSistemaHTML(s)).join('');
    assert.match(html, /sq-btn no selected/);
  });
});

test('modo guía: un SÍ a una urgencia sale en `ur` y deja de estar «sin preguntar»; un NO también la quita', () => {
  guia({ sistemicoAnswers: { l6: 'SI', l_e8: 'NO' } }, () => {
    const d = buildPhysiQPayload();
    assert.equal(d.ur.length, 1);
    const l6 = preguntas().find(q => q.id === 'l6').text;
    const le8 = preguntas().find(q => q.id === 'l_e8').text;
    assert.ok(!getNoPreguntadas().urgentes.includes(l6));
    assert.ok(!getNoPreguntadas().urgentes.includes(le8));
    assert.equal(getNoPreguntadas().urgentes.length, 4);
  });
});

test('modo guía + breve: las urgencias se listan siempre; el resto lo cubren los pendientes del embudo', () => {
  guia({ modo: 'breve', sistemicoBreve: {} }, () => {
    const np = getNoPreguntadas();
    assert.equal(np.urgentes.length, 6);
    assert.deepEqual(np.sistemas, []);
  });
  guia({ modo: 'breve', sistemicoBreve: { l_vascular: 'SI' } }, () => {
    const np = getNoPreguntadas();
    const vascular = sistemasActivos().find(s => s.id === 'l_vascular');
    assert.deepEqual(np.sistemas.map(s => s.nombre), [vascular.nombre]);
    assert.equal(np.sistemas[0].n, vascular.preguntas.filter(q => !q.urgencia).length);
  });
});

test('modo guía: las preguntas `privada` (embarazo) nunca dan su texto en «sin preguntar»', () => {
  guia({ embarazo: { ...state.embarazo, estado: 'posparto' } }, () => {
    const privadas = preguntas().filter(q => q.privada);
    assert.ok(privadas.length, 'el sistema de embarazo tiene preguntas privadas');
    const texto = lineasNoPreguntadas().join('\n');
    privadas.forEach(q => assert.ok(!texto.includes(q.text), q.id));
    assert.match(texto, /una pregunta de urgencia de «/);
  });
});

test('modo guía: 📋 Notas, 📄 Informe y el prompt no dicen «Negativo» con preguntas sin hacer', () => {
  guia({}, () => {
    const d = buildPhysiQPayload();
    const notas = buildContextSummaryText();
    assert.match(notas, /Cribado sistémico: sin positivos en lo preguntado \(incompleto\)/);
    assert.match(notas, /❔ SIN PREGUNTAR: Urgencia sin preguntar: /);
    assert.match(buildInformeFisioterapiaText(), /en las preguntas realizadas; el cribado no se completó en esta sesión\./);
    const ctx = IN.contextoValoracion(d);
    assert.doesNotMatch(ctx, /Cribado sistémico: Negativo/);
    assert.doesNotMatch(ctx, /^ {2}Negativas$/m);
    assert.match(ctx, /Sin preguntar en la consulta/);
    d.np.forEach(l => assert.ok(ctx.includes(l), l));
  });
});

test('modo guía: el criterio de Goodman avisa cuando aún no se puede aplicar', () => {
  const crit = SYSTEMIC_SCREENING.lumbar.sistemas.find(s => s.criterioCompuesto)?.criterioCompuesto;
  assert.ok(crit);
  assert.match(leer('app.js'), /aún no se puede aplicar/);
});

console.log('\nmodo guía (paso 2: selector, frases, teclado numérico)');

test('modo guía: nombre automático «Paciente DD/MM HH:MM», con ceros', () => {
  assert.equal(MG.nombreAuto(new Date(2026, 9, 21, 9, 5)), 'Paciente 21/10 09:05');
  assert.equal(MG.nombreAuto(new Date(2026, 2, 3, 14, 32)), 'Paciente 03/03 14:32');
});

test('teclado numérico: cifras, ceros a la izquierda, máximo, borrar y decimales', () => {
  const t = (v, k, o) => MG.aplicarTecla(v, k, o);
  assert.equal(t('', '4'), '4');
  assert.equal(t('4', '5', { max: 120 }), '45');
  assert.equal(t('12', '5', { max: 120 }), '12', 'pasarse del máximo no cambia el valor');
  assert.equal(t('0', '5'), '5', 'sin ceros a la izquierda');
  assert.equal(t('45', 'borrar'), '4');
  assert.equal(t('', 'borrar'), '');
  assert.equal(t('45', 'limpiar'), '');
  assert.equal(t('70', '.', { decimal: false }), '70', 'sin decimales si el campo no los admite');
  assert.equal(t('', '.', { decimal: true }), '0.');
  assert.equal(t('70.5', '.', { decimal: true }), '70.5', 'un solo punto');
  assert.equal(t('7', 'x'), '7', 'una tecla desconocida no hace nada');
});

test('frases ancla: el test con su lado; sin lado (o Central) no inventa uno', () => {
  assert.equal(MG.fraseAncla('Slump', 'Derecho'), '«Slump, positivo a la derecha»');
  assert.equal(MG.fraseAncla('Slump', 'Izquierdo'), '«Slump, positivo a la izquierda»');
  assert.equal(MG.fraseAncla('Slump', 'Bilateral'), '«Slump, positivo bilateral»');
  assert.equal(MG.fraseAncla('Slump', 'Central'), '«Slump, positivo»');
  assert.equal(MG.fraseAncla('Slump', ''), '«Slump, positivo»');
});

test('modo guía: la tarjeta de un test lleva la frase ancla solo en modo guía', () => {
  const t = HYPOTHESES.ro4.tests[0];
  guia({ region: 'rodilla', lado: 'Izquierdo' }, () => {
    const html = buildTestItem('ro4', t, 0);
    assert.ok(html.includes('test-ancla') && html.includes(TEXTOS_GUIA.anclaTest));
    assert.ok(html.includes(MG.fraseAncla(t.name, 'Izquierdo')));
  });
  withState({ region: 'rodilla', lado: 'Izquierdo' }, () => {
    assert.ok(!buildTestItem('ro4', t, 0).includes('test-ancla'), 'en teclado la tarjeta no cambia');
  });
});

test('modo guía: los textos para decir en voz alta apuntan a cajas que existen y tienen frase', () => {
  const html = leer('index.html');
  for (const [id, v] of Object.entries(VERBALES)) {
    assert.match(html, new RegExp(`<textarea[^>]*id="${id}"`), id);
    assert.ok(v.frase && v.frase.length > 10, id);
  }
});

test('modo guía: el payload lleva `rg` solo en modo guía (la huella de lo demás no cambia)', () => {
  guia({}, () => assert.equal(buildPhysiQPayload().rg, 'guia'));
  withState({ region: 'lumbar' }, () => assert.ok(!('rg' in buildPhysiQPayload())));
});

test('modo guía: nunca en el hub (el selector se oculta y la sesión restaurada vuelve a teclado)', () => {
  assert.match(leer('styles.css'), /\.in-hub \.registro-bloque \{ display: none; \}/);
  assert.match(leer('app.js'), /function selectRegistro\(r\) \{\n  if \(_enHub\(\)/);
});

test('modo guía: el formulario previo cambia la caja de texto por la frase solo si está vacía', () => {
  const f = leer('formulario.js');
  assert.match(f, /state\.registro === 'guia' && !\(resp\[key\] \|\| ''\)\.trim\(\)/);
  assert.match(f, /verbal \|\| etiqueta/, 'sin frase corta, el enunciado');
});

test('modo guía: los números de la fase 1 usan el teclado propio y los manejadores de siempre', () => {
  const html = leer('index.html');
  for (const id of ['edadPaciente', 'vitalFc', 'vitalTas', 'vitalTad', 'vitalTalla', 'vitalPeso', 'cirSemanas', 'emSemanas', 'emSemanasPp']) {
    assert.match(html, new RegExp(`<input[^>]*type="number"[^>]*id="${id}"`), id);
  }
  const app = leer('app.js');
  assert.match(app, /dispatchEvent\(new Event\('input', \{ bubbles: true \}\)\)/);
  assert.match(app, /dispatchEvent\(new Event\('blur'\)\)/);
});

console.log('\nmodo guía (paso 3: frases cortas del formulario previo, lumbar)');
const COMUN = (await import('../../formularios/comun.js')).default;
const LUMBAR = (await import('../../formularios/lumbar.js')).default;
// Las 7 regiones (paso 5, 2026-10): el piloto era común + lumbar
const FORMULARIOS = [COMUN, LUMBAR, ...await Promise.all(['cadera', 'cervical', 'rodilla', 'hombro', 'tobillo_pie', 'codo']
  .map(async r => (await import(`../../formularios/${r}.js`)).default))];
const items = esq => esq.secciones.flatMap(s => s.items);

test('formulario previo (común y las 7 regiones): toda pregunta de texto y todo `detalle` tiene su frase corta para decir en voz alta', () => {
  for (const esq of FORMULARIOS) {
    for (const it of items(esq)) {
      // el `texto` va en tú: solo hace falta `verbal` si no sirve ya dicho tal cual
      if (it.tipo === 'texto') assert.ok(it.verbal || /^¿.*\?$/.test(it.texto), `${esq.id}.${it.id}: falta verbal`);
      if (it.detalle) assert.ok(it.detalle.verbal, `${esq.id}.${it.id}: falta verbal en el detalle`);
    }
  }
});

test('frases cortas: preguntas completas, con interrogación y de longitud hablable', () => {
  for (const esq of FORMULARIOS) {
    for (const it of items(esq)) {
      for (const v of [it.verbal, it.detalle?.verbal, it.tipo === 'texto' && !it.verbal ? it.texto : null].filter(Boolean)) {
        assert.match(v, /^¿.*\?$/, `${esq.id}.${it.id}: «${v}»`);
        assert.ok(v.length <= 75, `${esq.id}.${it.id}: demasiado larga (${v.length})`);
      }
    }
  }
});

test('frases cortas: solo se leen en modo guía y nunca llegan a los resúmenes ni al payload', () => {
  const f = leer('formulario.js');
  assert.match(f, /state\.registro === 'guia' && !\(resp\[key\] \|\| ''\)\.trim\(\)/);
  for (const arch of ['lib/resumenes.js', 'lib/informe-narrativo.js', 'informe-ia.js']) {
    assert.doesNotMatch(leer(arch), /\.verbal\b/, arch);
  }
});

test('frases cortas: se dicen de «tú» al paciente, nunca de «usted» (ni «le», «su», «tiene», «toma»…; «que te preocupe» sí vale)', () => {
  const usted = /\b(le|les|usted|su|sus|tiene|toma|hace|quiera)\b/i;
  for (const esq of FORMULARIOS) {
    for (const it of items(esq)) {
      for (const v of [it.verbal, it.detalle?.verbal, it.tipo === 'texto' && !it.verbal ? it.texto : null].filter(Boolean)) assert.doesNotMatch(v, usted, `${esq.id}.${it.id}: «${v}»`);
    }
  }
  // las de la fase 1 y 3 (la del signo comparable va al fisio, no al paciente)
  for (const [id, v] of Object.entries(VERBALES)) {
    if (id !== 'signoComparable') assert.doesNotMatch(v.frase, usted, `${id}: «${v.frase}»`);
  }
});

test('formulario del paciente: preguntas, títulos y ayudas en tú o impersonal, nunca de «usted» (decisión del usuario, 2026-10)', () => {
  const usted = /\b(le|les|usted|tiene|puede|quiera|duda|marque|deje|fíjese)\b/i;
  for (const esq of FORMULARIOS) {
    for (const sec of esq.secciones) {
      for (const v of [sec.titulo, sec.intro].filter(Boolean)) assert.doesNotMatch(v, usted, `${esq.id} · ${sec.titulo}: «${v}»`);
      for (const it of sec.items) {
        const textos = [it.texto, it.ayuda, it.detalle?.etiqueta, ...(it.filas || []).map(f => f.texto)].filter(Boolean);
        for (const v of textos) assert.doesNotMatch(v, usted, `${esq.id}.${it.id}: «${v}»`);
      }
    }
  }
});

console.log('\nmodo guía (paso 4: consentimiento, aviso del informe y preguntas habladas en el prompt)');
const IA = await import('../../informe-ia.js');
const fpMod = await import('../../formulario.js');
await fpMod.cargarEsquemaRegion('lumbar');
await (await import('./comun.mjs')).precargarFormularioPrevio();
const FP_VACIO = () => ({ comun: {}, regiones: { lumbar: {} } });
const preguntasDe = a => (a.guia || []).map(p => p.q);

test('consentimiento: el aviso del modo guía y el toast al activarlo lo recuerdan (decisión 13)', () => {
  assert.match(TEXTOS_GUIA.consentimiento, /consentimiento/);
  assert.ok(leer('index.html').includes('pídele su consentimiento: así queda en el audio'));
  assert.match(leer('app.js'), /_ponerNombreAuto\(\);\n    showToast\(TEXTOS_GUIA\.consentimiento\);/);
});

test('tarjeta del informe: en guía avisa de que el texto libre está en el audio, más fuerte sin audio', () => {
  assert.match(TEXTOS_GUIA.informeSinAudio, /no constará/);
  const ia = leer('informe-ia.js');
  assert.match(ia, /if \(state\.registro !== 'guia'\) \{ el\.innerHTML = ''; return; \}/);
  assert.match(ia, /TEXTOS_GUIA\.informeConAudio[\s\S]*TEXTOS_GUIA\.informeSinAudio/);
});

test('prompt: fuera del modo guía no hay lista de preguntas habladas (la huella no cambia)', () => {
  withState({ region: 'lumbar', formularioPrevio: FP_VACIO() }, () => assert.ok(!('guia' in IA.construirAmpliado())));
});

test('prompt: en guía van las preguntas con la caja vacía, con su grupo; lo ya escrito no', () => {
  guia({ formularioPrevio: FP_VACIO(), motivoConsulta: '', signoComparable: 'Flexión 40º' }, () => {
    const g = IA.construirAmpliado().guia;
    const qs = g.map(p => p.q);
    assert.ok(qs.includes(VERBALES.motivoConsulta.frase), 'motivo');
    assert.ok(!qs.some(q => /Signo comparable/.test(q)), 'el signo comparable escrito no va');
    assert.ok(qs.includes('¿Desde cuándo te pasa?'));
    assert.ok(qs.includes('¿Algo más que quieras contarme o que te preocupe?'), 'las de la región también');
    assert.equal(g.find(p => p.q === '¿Desde cuándo te pasa?').g, 'historia');
    assert.ok(g.every(p => ['historia', 'sintomas', 'actividades', 'contexto', 'exploracion'].includes(p.g)), 'todas con grupo');
  });
  guia({ formularioPrevio: { comun: { medicacion: 'Ibuprofeno' }, regiones: { lumbar: {} } }, signoComparable: '' }, () => {
    const qs = preguntasDe(IA.construirAmpliado());
    assert.ok(!qs.includes('¿Qué medicación tomas ahora?'), 'con texto escrito no se pregunta');
    assert.ok(qs.some(q => /^Signo comparable/.test(q)), 'el signo comparable va con su nombre, no con la instrucción al fisio');
  });
});

test('prompt: solo lo visible (episodio previo y «detalle» según la respuesta) y la cirugía solo si es posquirúrgico', () => {
  guia({ formularioPrevio: FP_VACIO() }, () => {
    const qs = preguntasDe(IA.construirAmpliado());
    assert.ok(!qs.includes('¿Cuándo fue la última vez que te pasó y cuánto te duró?'));
    assert.ok(!qs.includes('¿Qué fue lo que lo desencadenó?'));
    assert.ok(!qs.includes(VERBALES.cirIntervencion.frase));
  });
  guia({ mecanismo: 'Post-quirúrgico', formularioPrevio: { comun: { primera_vez: 'No, ya me había pasado antes', desencadenante: 'Sí' }, regiones: { lumbar: {} } } }, () => {
    const qs = preguntasDe(IA.construirAmpliado());
    assert.ok(qs.includes('¿Cuándo fue la última vez que te pasó y cuánto te duró?'));
    assert.ok(qs.includes('¿Qué fue lo que lo desencadenó?'));
    assert.ok(qs.includes(VERBALES.cirIntervencion.frase) && qs.includes(VERBALES.cirRestricciones.frase));
  });
});

test('prompt: «Preguntado» se marca en la lista, sin dar una respuesta', () => {
  guia({ formularioPrevio: FP_VACIO(), motivoConsulta: '', preguntado: { motivoConsulta: true, 'fp:comun:medicacion': true } }, () => {
    const g = IA.construirAmpliado().guia;
    assert.equal(g.find(p => p.q === VERBALES.motivoConsulta.frase).preguntado, true);
    assert.equal(g.find(p => p.q === '¿Qué medicación tomas ahora?').preguntado, true);
    assert.ok(!g.find(p => p.q === '¿Desde cuándo te pasa?').preguntado);
  });
});

test('prompt: la regla «no consta» con audio (buscar en la transcripción, omitir, sin «no refiere») y sin audio', () => {
  const ps = [{ g: 'historia', q: '¿Desde cuándo te pasa?', preguntado: true }, { g: 'exploracion', q: 'Signo comparable: …' }];
  const con = IN.bloqueGuia(ps, { conAudio: true });
  assert.ok(con.startsWith(IN.REGLA_GUIA_AUDIO));
  assert.match(con, /transcripción/);
  assert.match(con, /no escribas «no refiere», «niega» ni «no consta»/);
  assert.match(con, /· ¿Desde cuándo te pasa\? \(marcada como preguntada\)/);
  assert.match(con, /Exploración \(va en Movilidad o en Pruebas Clínicas\):\n    · Signo comparable/);
  const sin = IN.bloqueGuia(ps, { conAudio: false });
  assert.ok(sin.startsWith(IN.REGLA_GUIA_SIN_AUDIO));
  assert.doesNotMatch(sin, /transcripción/);
  assert.equal(IN.bloqueGuia([], { conAudio: true }), '');
});

test('prompt: el bloque llega al prompt completo, con o sin audio según la tarjeta', () => {
  guia({ formularioPrevio: FP_VACIO() }, () => {
    const d = buildPhysiQPayload();
    const a = IA.construirAmpliado();
    assert.ok(IN.contextoValoracion(d, n => n, a, { conAudio: true }).includes(IN.REGLA_GUIA_AUDIO));
    assert.ok(IN.contextoValoracion(d, n => n, a, { conAudio: false }).includes(IN.REGLA_GUIA_SIN_AUDIO));
  });
});

console.log('\nmodo guía (paso 4: urgencias contra la transcripción, decisión 6)');
const RI = await import('../../lib/revision-informe.js');
const { respuestasUrgentes } = await import('../../app.js');
const { CONTRASTE_URGENCIAS } = await import('../../data/guia.js');
const SIN_RESP = ids => ids.map(id => ({ id, respuesta: '' }));
const detecta = (tr, ids = Object.keys(CONTRASTE_URGENCIAS)) => RI.urgenciasEnTranscripcion(tr, SIN_RESP(ids)).map(u => u.id);

const CONDICIONALES = ['soloPosquirurgico', 'soloHipermovilidad', 'soloDisautonomia', 'soloLupus', 'soloMastocitos', 'soloOsteoporosis', 'soloEmbarazo', 'soloAnticoagulado'];
const preguntasUrgentes = condicionales => {
  const ids = new Map();
  for (const r of Object.keys(SYSTEMIC_SCREENING)) {
    for (const sis of SYSTEMIC_SCREENING[r].sistemas) {
      if (CONDICIONALES.some(k => sis[k]) !== condicionales) continue;
      sis.preguntas.filter(q => q.urgencia).forEach(q => ids.set(q.id, q));
    }
  }
  return ids;
};

test('urgencias en la transcripción: todas las preguntas de urgencia, de las 7 regiones y de las condiciones especiales, tienen tema y patrones válidos', () => {
  const regionales = preguntasUrgentes(false), condiciones = preguntasUrgentes(true);
  assert.equal(regionales.size, 36);
  assert.equal(condiciones.size, 40, 'paso 6: las de las condiciones especiales');
  assert.deepEqual(Object.keys(CONTRASTE_URGENCIAS).sort(), [...regionales.keys(), ...condiciones.keys()].sort(), 'una entrada por pregunta de urgencia, ni más ni menos');
  for (const [id, c] of Object.entries(CONTRASTE_URGENCIAS)) {
    assert.ok(c.tema && c.patrones.length, id);
    c.patrones.forEach(p => assert.doesNotThrow(() => new RegExp(p), `${id}: ${p}`));
  }
});

test('urgencias en la transcripción: una pregunta `privada` tiene un tema genérico, nunca su texto', () => {
  const privadas = [...preguntasUrgentes(true).values()].filter(q => q.privada);
  assert.deepEqual(privadas.map(q => q.id).sort(), ['em_u_autolesion', 'em_u_psicosis']);
  for (const q of privadas) assert.equal(CONTRASTE_URGENCIAS[q.id].tema, 'un posible problema de salud mental urgente tras el parto', q.id);
});

test('urgencias en la transcripción: detecta lo que el paciente cuenta, de cada pregunta', () => {
  const casos = {
    l6: ['Desde ayer se me escapa el pis sin darme cuenta.', 'Tengo como dormida la zona entre las piernas.', 'Me cuesta orinar desde el lunes.'],
    l_e8: ['Tengo un retraso de la regla de dos semanas.', 'He tenido un sangrado vaginal raro.'],
    l_v4: ['La pantorrilla derecha la tengo hinchada y caliente.'],
    sx_sincope: ['La semana pasada me desmayé corriendo.'],
    hem_5: ['Estoy con quimio desde marzo.'],
    hem_6: ['Soy hemofílico desde pequeño.'],
    ca_v4: ['Fue un dolor desgarrador en la espalda.'],
    ca_v5: ['De repente la pierna se me quedó fría y pálida.'],
    ca_u3: ['Tengo el testículo derecho hinchado desde esta mañana.'],
    ca_os1: ['El traumatólogo habló de una fractura de estrés.'],
    ca_in1: ['Anoche tuve fiebre y tiritona.'],
    cv_c3: ['Tengo un dolor en el pecho que no se me pasa.'],
    cv_ar1: ['Mi mujer dice que se me cae el párpado.'],
    cv_ar2: ['A ratos veo doble y me cuesta tragar.'],
    cv_ar3: ['Desde el accidente me tengo que sujetar la cabeza con las manos.'],
    cv_ar4: ['Es el peor dolor de cabeza que he tenido nunca.'],
    r_i3: ['Encima de la rótula lo tengo rojo y caliente.'],
    ro_t2: ['Desde la caída no puedo levantar la pierna estirada.'],
    ro_t3: ['Me di con la rodilla contra el salpicadero.'],
    h_c4: ['Me aprieta el pecho cuando subo escaleras.'],
    h_gi4: ['Con el accidente me di con el volante en el costado.'],
    h_t1: ['Desde la caída tengo el hombro hundido.'],
    tp_t1: ['Después de la lesión no noto el pie.', 'Tengo un dolor desproporcionado en el pie.'],
    tp_n1: ['Llevo una semana perdiendo fuerza en las dos piernas.'],
    co_t1: ['Desde la caída no puedo estirar del todo el codo.'],
    co_t2: ['Tras el golpe tengo la mano fría.'],
    // condiciones especiales (paso 6)
    pq_herida: ['La herida la tengo roja y caliente desde el viernes.', 'Se me ha abierto un poco la cicatriz.'],
    pq_tvp: ['Tengo el gemelo hinchado desde la operación.'],
    pq_tvp_ms: ['El brazo operado lo tengo hinchado y caliente.'],
    pq_tep: ['Anoche de repente me faltaba el aire.', 'Esta mañana tosí sangre.'],
    pq_compart: ['Tengo un dolor desproporcionado en la pierna.', 'El yeso me aprieta mucho y me duele.'],
    pq_nervio: ['Desde la operación noto la mano dormida.', 'Tengo hormigueo en el pie desde que me operaron.'],
    pq_nervio_col: ['Desde la operación de espalda tengo las piernas acorchadas.', 'Me cuesta orinar desde ayer.'],
    hm_v_dolor: ['De repente un dolor muy fuerte en la tripa.', 'Era un dolor desgarrador en el costado.'],
    hm_v_ojo: ['Noto un zumbido en la sien.', 'Tengo el ojo como saltón.'],
    hm_v_aire: ['De golpe me faltaba el aire.'],
    ds_u_esfuerzo: ['Me desmayé corriendo en el parque.'],
    ds_u_tumbado: ['Perdí el conocimiento estando tumbado en el sofá.', 'Noté el corazón a mil y me desmayé.'],
    ds_u_corazon: ['Me dijeron que tengo un soplo.'],
    ds_u_familia: ['Mi hermano murió de repente con treinta años.'],
    les_u_fiebre: ['Llevo dos días con febrícula.'],
    les_u_tvp: ['Tengo el antebrazo hinchado y caliente.'],
    les_u_tep_ictus: ['Se me torció la boca unos minutos.', 'Noté flojera en medio cuerpo un rato.'],
    les_u_pecho: ['Me duele el pecho al respirar hondo.'],
    les_u_dedos: ['Tengo una llaga en la yema del índice.', 'El dedo no recupera el color.'],
    les_u_neuro: ['La semana pasada tuve una convulsión.', 'Tengo el pie caído desde el lunes.'],
    op_u_medula: ['Noto torpeza en las piernas desde hace días.'],
    em_u_preeclampsia: ['Veo destellos desde ayer.', 'Se me ha hinchado de golpe la cara.'],
    em_u_sangrado: ['Esta mañana he manchado un poco.'],
    em_u_movimientos: ['El bebé se mueve menos desde ayer.'],
    em_u_parto: ['Tengo contracciones cada diez minutos.', 'Creo que he roto aguas.'],
    em_u_infeccion_emb: ['Desde ayer tengo fiebre y escalofríos.'],
    em_u_sangrado_pp: ['Estoy sangrando mucho y echo coágulos.'],
    em_u_infeccion: ['Tengo un flujo que huele fatal.'],
    em_u_tev: ['Tengo la pierna izquierda hinchada y caliente.'],
    em_u_corazon: ['Tengo palpitaciones por la noche.', 'Me falta el aire en cuanto estoy tumbada.'],
    em_u_perine: ['Los puntos de la episiotomía se me han abierto.'],
    em_u_incontinencia: ['Se me escapa la orina todo el rato.'],
    em_u_psicosis: ['Su pareja dice que la ve muy rara y acelerada.'],
    em_u_autolesion: ['A veces pienso que es mejor no estar.'],
    ac_u_cabeza: ['El domingo me di con la cabeza en la puerta del coche.'],
    ac_u_cabeza_tardia: ['Desde el golpe he vomitado dos veces.'],
    ac_u_espinal: ['Noto las dos piernas acorchadas desde esta mañana.'],
    ac_u_psoas: ['Tengo el muslo dormido y me duele la ingle.'],
    ac_u_pared: ['Me ha salido un bulto en la tripa al toser.'],
    ac_u_compartimental: ['El gemelo lo tengo duro como una piedra.'],
  };
  for (const [id, frases] of Object.entries(casos)) {
    frases.forEach(f => assert.ok(detecta(`Bueno. ${f} Vale.`, [id]).includes(id), `${id}: «${f}»`));
  }
  // y las que comparten patrones con otra (misma clínica, otra región)
  for (const [id, f] of [['ca_v2', 'Tengo el gemelo hinchado.'], ['r_v2', 'Tengo el gemelo hinchado.'], ['tp_v2', 'Tengo el gemelo hinchado.'],
    ['ca_u5', 'Tengo un retraso de la regla.'], ['h_g1', 'Tengo un retraso de la regla.'], ['r1', 'He tenido fiebre.'], ['tp_i1', 'He tenido fiebre.'],
    ['co1', 'He tenido fiebre.'], ['r_v4', 'Tengo el pie helado.'], ['ro_t4', 'Tengo el pie helado.']]) {
    assert.ok(detecta(f, [id]).includes(id), `${id}: «${f}»`);
  }
});

test('urgencias en la transcripción: no salta con la pregunta del fisio, con lo negado ni con «no está caliente»', () => {
  for (const f of [
    '¿Se te escapa el pis o notas dormida la zona entre las piernas? No, nada.',
    'No he notado que se me escape el pis.',
    'Nada de desmayos, nunca.',
    'La pantorrilla está blanda, no está caliente y no le duele al apretarla.',
    'Me duele la pierna al caminar.',
    'Fiebre, no. Escalofríos, tampoco.',
    // lo habitual en una consulta de fisioterapia no es una urgencia
    'Me caí de la bici y me di un golpe en la rodilla, que se hinchó.',
    'Me duele el hombro al girar el volante.',
    'Hace años se me salió el hombro y me lo tuvieron que colocar.',
    'Las pupilas son normales y le sujeto la cabeza para el test.',
    'No puedo mover bien el cuello desde que me levanté.',
    'Tuve un desgarro en el gemelo jugando al pádel.',
    // condiciones especiales: lo habitual tampoco
    'Al subir escaleras me falta el aire.',
    'Con el embarazo me ahogo un poco al caminar deprisa.',
    'La herida está bien cerrada, no está roja.',
    'Desde la operación estoy mucho mejor.',
    'Con el frío se me ponen los dedos blancos y luego se me pasa.',
    'Me duele la cabeza algunas tardes.',
    'El bebé se mueve muchísimo.',
    'Me di un golpe en el codo con la mesa.',
    'El horario de las sesiones es un poco confuso.',
  ]) assert.deepEqual(detecta(f), [], f);
  assert.deepEqual(RI.urgenciasEnTranscripcion('', SIN_RESP(['l6'])), []);
});

test('urgencias en la transcripción: un SÍ ya marcado no avisa; un NO o sin responder sí, y lo dice', () => {
  const tr = 'Doctor, desde ayer se me escapa el pis.';
  assert.deepEqual(RI.urgenciasEnTranscripcion(tr, [{ id: 'l6', respuesta: 'SI' }]), []);
  const datos = { p: 'X', r: 'lumbar', d: '01/01/2026', br: [], sq: [], pn: {}, h: [] };
  const rev = respuesta => RI.revisarInforme('Informe.', { datos, transcripcion: tr, cribado: [{ id: 'l6', respuesta }] })
    .filter(p => p.id === 'urgencia-transcripcion');
  const [enNO] = rev('NO'), [sinResp] = rev('');
  assert.equal(enNO.nivel, 'alto');
  assert.match(enNO.mensaje, /cauda equina.*en NO/);
  assert.match(sinResp.mensaje, /sin responder/);
  assert.match(enNO.cita, /se me escapa el pis/, 'cita la frase de la consulta');
  // sin la lista del cribado (herramientas antiguas, capa 3) no hace nada
  assert.deepEqual(RI.revisarInforme('Informe.', { datos, transcripcion: tr }).filter(p => p.id === 'urgencia-transcripcion'), []);
});

test('urgencias en la transcripción: en las transcripciones reales, con las 76 preguntas sin responder, solo la cefalea en trueno de Javier', () => {
  const dir = 'tests/fixtures/informes';
  const ids = Object.keys(CONTRASTE_URGENCIAS);
  const archivos = readdirSync(join(RAIZ, dir)).filter(f => /transcripcion\.txt$/.test(f));
  assert.ok(archivos.length >= 20);
  // «me dio de golpe un dolor de cabeza muy fuerte, el peor de mi vida»: cv_ar4
  // (en SÍ en su valoración), y una alarma también en el embarazo y con
  // anticoagulantes: verdaderos positivos
  const esperado = { 'javier-audio-transcripcion.txt': ['cv_ar4', 'em_u_preeclampsia', 'ac_u_cabeza_tardia'] };
  for (const f of archivos) assert.deepEqual(detecta(leer(dir, f), ids), esperado[f] || [], f);
  // con su cv_ar4 en SÍ, la región no avisa
  assert.deepEqual(RI.urgenciasEnTranscripcion(leer(dir, 'javier-audio-transcripcion.txt'), [{ id: 'cv_ar4', respuesta: 'SI' }]), []);
});

test('urgencias en la transcripción: la tarjeta y la herramienta le pasan las preguntas de urgencia con su respuesta', () => {
  assert.match(leer('informe-ia.js'), /cribado: respuestasUrgentes\(\)/);
  assert.match(leer('tools/revisar-informe.mjs'), /cribado: app\.respuestasUrgentes\(\)/);
  guia({ sistemicoAnswers: { l6: 'NO', sx_sincope: 'SI' } }, () => {
    const r = Object.fromEntries(respuestasUrgentes().map(x => [x.id, x.respuesta]));
    assert.equal(r.l6, 'NO');
    assert.equal(r.sx_sincope, 'SI');
    assert.equal(r.l_e8, '', 'sin responder');
    assert.ok(!('l_u5' in r), 'solo las de urgencia');
    assert.ok(!('les_u_fiebre' in r), 'sin la tarjeta, las de su condición no cuentan');
  });
  guia({ lupus: { ...BASE_STATE.lupus, estado: 'diagnosticado' } }, () => {
    assert.ok(respuestasUrgentes().some(x => x.id === 'les_u_fiebre'), 'con la tarjeta marcada, sí');
  });
});
