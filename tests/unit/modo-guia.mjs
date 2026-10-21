// Modo guía con grabadora externa: docs/modo-guia.md, decisión 3 («sin marcar» =
// «no preguntado», nunca «NO»). Se ejecuta desde tests/unit.js.
import { assert, leer, test, state, SYSTEMIC_SCREENING, buildPhysiQPayload, buildInformeFisioterapiaText, buildContextSummaryText,
  buildSistemaHTML, sistemasActivos, withState } from './comun.mjs';

console.log('\nmodo guía (sin marcar = no preguntado)');
const { getNoPreguntadas, lineasNoPreguntadas, getUrgenciasActivas } = await import('../../app.js');
const IN = await import('../../lib/informe-narrativo.js');

const SIN = { br1: '', br2: '', br3: '', br4: '' };
const guia = (patch, fn) => withState({ region: 'lumbar', registro: 'guia', banderasRojas: SIN, sistemicoAnswers: {}, ...patch }, fn);
const preguntas = () => sistemasActivos().flatMap(s => s.preguntas);
const todasNO = () => Object.fromEntries(preguntas().map(q => [q.id, 'NO']));

test('modo guía: el estado empieza en teclado y las sesiones antiguas no cambian', () => {
  assert.equal((leer('state.js').match(/registro: '(\w+)'/) || [])[1], 'teclado');
  assert.match(leer('app.js'), /if \(state\.registro !== 'guia'\) state\.registro = 'teclado';/);
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
