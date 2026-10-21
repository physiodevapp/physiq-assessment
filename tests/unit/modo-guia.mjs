// Modo guía con grabadora externa: docs/modo-guia.md, decisión 3 («sin marcar» =
// «no preguntado», nunca «NO»). Se ejecuta desde tests/unit.js.
import { assert, leer, test, state, SYSTEMIC_SCREENING, HYPOTHESES, buildPhysiQPayload, buildInformeFisioterapiaText, buildContextSummaryText,
  buildSistemaHTML, sistemasActivos, withState } from './comun.mjs';

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

test('modo guía: nombre automático «Paciente HH:MM», con ceros', () => {
  assert.equal(MG.nombreAuto(new Date(2026, 9, 21, 9, 5)), 'Paciente 09:05');
  assert.equal(MG.nombreAuto(new Date(2026, 9, 21, 14, 32)), 'Paciente 14:32');
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
const items = esq => esq.secciones.flatMap(s => s.items);

test('formulario previo (común y lumbar): toda pregunta de texto y todo `detalle` tiene su frase corta para decir en voz alta', () => {
  for (const esq of [COMUN, LUMBAR]) {
    for (const it of items(esq)) {
      if (it.tipo === 'texto') assert.ok(it.verbal, `${esq.id}.${it.id}: falta verbal`);
      if (it.detalle) assert.ok(it.detalle.verbal, `${esq.id}.${it.id}: falta verbal en el detalle`);
    }
  }
});

test('frases cortas: preguntas completas, con interrogación y de longitud hablable', () => {
  for (const esq of [COMUN, LUMBAR]) {
    for (const it of items(esq)) {
      for (const v of [it.verbal, it.detalle?.verbal].filter(Boolean)) {
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
