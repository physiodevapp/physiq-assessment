// «✨ Detallar con IA» de la fase 6 (Fase L, L4; decisiones 106–115 de
// docs/plan-tratamiento.md): prompt, revisión automática, vista, textos para
// compartir y aislamiento (solo standalone, nunca en el payload ni en el .json).
// Se ejecuta desde tests/unit.js.
import { assert, leer, test, state, buildPhysiQPayload, buildContextSummaryText, buildInformeFisioterapiaText } from './comun.mjs';
const PIA = await import('../../lib/plan-ia.js');
const RP = await import('../../lib/revision-plan.js');
const UI = await import('../../plan-ia.js');
const J = await import('../../lib/valoracion-json.js');
const D = await import('../../data/plan-tratamiento.js');

console.log('\nplan detallado con IA (fase 6, L4)');

const ALARMA = D.TEXTOS_CASA.alarmaNeuro.texto;
const ANDRES = JSON.parse(leer('tests/fixtures/casos/valoracion-andres-molina-lumbar.json')).assessmentState;

// Carga el caso de Andrés (lumbar radicular, dosifica P2, P3 independiente)
function conAndres(patch, fn) {
  const antes = { ...state };
  Object.assign(state, JSON.parse(JSON.stringify(ANDRES)), { planTratamiento: null, informeIA: null }, patch);
  try { return fn(); } finally {
    for (const k of Object.keys(state)) if (!(k in antes)) delete state[k];
    Object.assign(state, antes, { planTratamiento: null, informeIA: null });
  }
}

test('plan IA: el contexto del caso de Andrés — B «Muy suave», plan A, lu3, sin C, red de cola de caballo, P3 y lu6 fuera', () => conAndres({}, () => {
  const ctx = UI.contextoPlanIA();
  const en = ctx.entrada;
  assert.equal(en.nivel, 'B');
  assert.deepEqual([en.escalon.n, en.escalon.nombre], [1, 'Muy suave']);
  assert.equal(en.frecuencia.clave, 'A');
  assert.equal(en.sinC, true);
  assert.deepEqual(en.elegidas, ['Dolor Radicular Lumbar']);
  assert.ok(en.noElegidas.some(n => /discog/i.test(n)), 'lu6 no elegida');
  assert.deepEqual(en.independientes, ['P3 · Zona lumbar']);
  assert.deepEqual(en.alarmas, [ALARMA]);
  assert.equal(en.transcripcion, null, 'sin informe con IA no hay transcripción');
  assert.match(ctx.esqueleto, /INTERVENCIÓN PRINCIPAL \(12–35 min\)/);
}));

test('plan IA: el prompt lleva datos, esquema y reglas; nunca el texto del informe con IA', () => conAndres({
  informeIA: { texto: 'TEXTO-DEL-INFORME-QUE-NO-DEBE-IR', transcripcion: 'Dictado: le cuesta conducir.', conAudio: true, dictado: true, huella: 'otra' },
}, () => {
  const p = PIA.promptPlan(UI.contextoPlanIA().entrada);
  assert.ok(!p.includes('TEXTO-DEL-INFORME-QUE-NO-DEBE-IR'), 'decisión 4: nunca el informe');
  assert.match(p, /## DICTADO DEL FISIOTERAPEUTA \(solo para preferencias y contexto\)\nAVISO: la valoración cambió[^\n]*\nDictado: le cuesta conducir\./);
  assert.match(p, /## DATOS DE VALORACIÓN ESTRUCTURADA/);
  assert.match(p, /Nivel elegido: B · escalón «Muy suave» \(Manda el dolor\)/);
  assert.match(p, /Frecuencia del mes: Plan A · 1 sesión por semana/);
  assert.match(p, /### Plan de sesión\nPLAN DE SESIÓN \(50 min\)/);
  assert.match(p, /### Programa para casa \(texto base\)\nPROGRAMA PARA CASA/);
  assert.match(p, /NO trata \(no las planifiques\):\n {2}· Dolor Lumbar Discog/i);
  assert.match(p, /Síntomas independientes que este plan NO trata:\n {2}· P3 · Zona lumbar/);
  assert.match(p, /ni una propuesta C \(el esquema no la tiene\)/);
  assert.match(p, /solo grados I y II[^.]*nada de grado III ni IV/);
  assert.match(p, /termina esa línea con «\(sugerencia de la IA\)»/);
  assert.match(p, /centralización o preferencia direccional/);
  assert.ok(p.includes(`«${ALARMA}»`), 'la red de seguridad, para copiarla literal');
  assert.match(p, /primera sesión de tratamiento/);
  assert.match(p, /empieza DIRECTAMENTE con «## SESIÓN»/);
  assert.ok(!p.includes('{{TRANSCRIPT}}'), 'el worker no añade transcripción: va en el prompt');
}));

test('plan IA: sin audio en el informe, sin transcripción; la huella cambia con las elecciones de la fase 6', () => conAndres({
  informeIA: { texto: 'x', transcripcion: '(No disponible)', conAudio: false },
}, () => {
  const ctx = UI.contextoPlanIA();
  assert.equal(ctx.entrada.transcripcion, null);
  assert.ok(!PIA.promptPlan(ctx.entrada).includes('TRANSCRIPCIÓN DE LA CONSULTA'));
  const h1 = ctx.huella;
  state.planTratamiento.frecuencia = 'B';
  const h2 = UI.contextoPlanIA().huella;
  assert.notEqual(h1, h2);
  state.planTratamiento.notas.domiciliario = 'Caminar 10 min';
  assert.notEqual(UI.contextoPlanIA().huella, h2, 'lo que escribe el fisio para casa también');
}));

test('plan IA: sin plan que detallar (sin región, bloqueado o sin hipótesis), sin tarjeta', () => {
  conAndres({ region: '' }, () => assert.equal(UI.contextoPlanIA(), null));
  conAndres({ sistemicoAnswers: { ...ANDRES.sistemicoAnswers, l6: 'SI' } }, () => assert.equal(UI.contextoPlanIA(), null, 'urgencia de cola de caballo'));
  conAndres({ activeHypotheses: [] }, () => assert.equal(UI.contextoPlanIA(), null));
});

const ESQ = `INTERVENCIÓN PRINCIPAL (12–35 min)
- unas 3–4 movilizaciones de unos 30 s por articulación. Corta al principio, hasta conocer la respuesta a las 48 h (Maitland 2005, cap. 9).
- Ejercicios repetidos (George 2021; NICE NG59).
${ALARMA}`;
const OPC = { esqueleto: ESQ, escalon: 1, alarmas: [ALARMA], noElegidas: ['Dolor Lumbar Discogénico'], derivar: ['Fractura vertebral'], independientes: ['P3 · Zona lumbar'] };
const plan = (sesion, mes = '- Progresar según el esquema.', casa = `- Camina cada día.\n${ALARMA}`) =>
  `## SESIÓN\n### INTERVENCIÓN PRINCIPAL (12–35 min)\n${sesion}\n\n## PLAN DEL MES\n${mes}\n\n## PROGRAMA PARA CASA\n${casa}`;
const ids = (t, o = OPC) => RP.revisarPlan(t, o).map(p => p.id);

test('revisión del plan: un plan limpio no da puntos', () => {
  assert.deepEqual(ids(plan('- Movilización accesoria de grado I y II, unas 3–4 movilizaciones de unos 30 s.\n- Deslizamiento neural suave, 10 repeticiones (sugerencia de la IA).')), []);
});

test('revisión del plan: volumen sin marcar (cifra con unidad que no está en el esquema)', () => {
  assert.deepEqual(ids(plan('- 3 series de 10 repeticiones de extensión.')), ['volumen']);
  assert.deepEqual(ids(plan('- 3 x 10 de extensión.')), ['volumen']);
  assert.deepEqual(ids(plan('- Igual, 2 veces al día (sugerencia de la IA).')), [], 'marcada');
  assert.deepEqual(ids(plan('- Reevaluar a las 48 h.')), [], 'la cifra está en el esquema');
  assert.deepEqual(ids(plan('- Ver respuesta.', '- Sesión 2 (semana 2): reevaluación.')), [], 'sesión y semana no son dosis');
});

test('revisión del plan: fuente que el esquema no cita', () => {
  assert.deepEqual(ids(plan('- Movilización neural (Butler 2000).')), ['fuente']);
  assert.deepEqual(ids(plan('- Según la guía de Kovacs et al. 2019, lo que sea.')), ['fuente']);
  assert.deepEqual(ids(plan('- Recomendación del KNGF.')), ['fuente']);
  assert.deepEqual(ids(plan('- Ejercicios repetidos (George 2021) y NICE.')), [], 'citadas en el esquema');
});

test('revisión del plan: técnica por encima del escalón, salvo para prohibirla', () => {
  assert.deepEqual(ids(plan('- Movilización PA de grado III.')), ['escalon']);
  assert.deepEqual(ids(plan('- Grados III–IV si tolera.')), ['escalon']);
  assert.deepEqual(ids(plan('- Manipulación de alta velocidad (thrust) en L5.')), ['escalon']);
  assert.deepEqual(ids(plan('- Explorar con sobrepresión.')), ['escalon']);
  assert.deepEqual(ids(plan('- Sin grados III ni IV, ni thrust, ni sobrepresión.')), [], 'negada');
  assert.deepEqual(ids(plan('- Movilización de grado III.'), { ...OPC, escalon: 3 }), [], 'el escalón 3 admite grado III');
  assert.deepEqual(ids(plan('- Movilización de grado IV.'), { ...OPC, escalon: 3 }), ['escalon']);
});

test('revisión del plan: red de seguridad del programa para casa, tal cual', () => {
  assert.deepEqual(ids(plan('- Nada.', undefined, '- Camina.')), ['red']);
  assert.deepEqual(ids(plan('- Nada.', undefined, '- Camina.\nSi notas adormecimiento entre las piernas, ve a urgencias.')), ['red'], 'resumida no vale');
  assert.deepEqual(ids(`## SESIÓN\n- Nada.\n## PLAN DEL MES\n- Nada.`), ['secciones']);
});

test('revisión del plan: hipótesis que se deriva o no elegida, y síntoma independiente', () => {
  assert.deepEqual(ids(plan('- Para la fractura vertebral, extensión suave.')), ['derivar']);
  assert.deepEqual(ids(plan('- Ejercicios para el dolor lumbar discogénico.')), ['no-elegida']);
  assert.deepEqual(ids(plan('- El dolor lumbar discogénico no se trata en este plan.')), []);
  assert.deepEqual(ids(plan('- Estiramiento para la zona lumbar derecha.')), ['independiente']);
  assert.deepEqual(ids(plan('- La molestia de la zona lumbar es independiente: se valora aparte.')), []);
});

test('revisión del plan: comprobaciones a mano y recuento de revisados', () => {
  assert.equal(RP.comprobacionesPlan().length, 3);
  assert.match(RP.comprobacionesPlan({ posq: true }).join(' '), /protocolo del cirujano/);
  assert.match(RP.comprobacionesPlan({ transcripcion: true }).join(' '), /de la consulta/);
  const puntos = RP.revisarPlan(plan('- 3 series de extensión.\n- Grado IV.'), OPC);
  const com = RP.comprobacionesPlan();
  const r0 = RP.resumenRevisadosPlan(puntos, com, []);
  assert.deepEqual([r0.total, r0.pendientes, r0.altosPendientes], [5, 5, 1]);
  const todo = [...puntos.map(RP.clavePuntoPlan), ...com.map(RP.claveComprobacionPlan)];
  assert.equal(RP.resumenRevisadosPlan(puntos, com, todo).pendientes, 0);
});

test('plan IA: vista — las sugerencias se pintan aparte con su etiqueta, sin la marca, y escapadas', () => {
  const h = PIA.planIAHtml('## SESIÓN\n### CIERRE (45–50 min)\n- Reevaluar.\n- Caminar 10 min <b> (sugerencia de la IA).\nTexto suelto.');
  assert.match(h, /<h3>SESIÓN<\/h3><h4>CIERRE \(45–50 min\)<\/h4><ul><li>Reevaluar\.<\/li><li class="pia-sug">Caminar 10 min &lt;b&gt;\. <span class="pia-sug-et">Sugerencia de la IA, sin fuente en PhysiQ<\/span><\/li><\/ul><p>Texto suelto\.<\/p>/);
  assert.ok(!h.includes('(sugerencia de la IA)'));
});

test('plan IA: textos para compartir — el del fisio con marcas; el del paciente solo casa, sin marcas y con la red siempre', () => {
  const t = plan('- 10 repeticiones (sugerencia de la IA).', undefined, '- Camina 10 min cada mañana (sugerencia de la IA).');
  const fisio = PIA.textoPlanIA(t, { paciente: 'Andrés', regionTexto: 'Lumbar (izquierda)', fecha: '15/10/2026', nivel: 'B', escalon: 'Muy suave', frecuencia: 'Plan A' });
  assert.match(fisio, /^PLAN DE TRATAMIENTO DETALLADO — propuesta\nAndrés · Lumbar \(izquierda\) · 15\/10\/2026\nNivel B · Muy suave · Plan A\n\nSESIÓN/);
  assert.match(fisio, /\(sugerencia de la IA\)/);
  assert.ok(fisio.endsWith(PIA.PIE_PLAN_IA));
  const casa = PIA.textoCasaIA(t, { paciente: 'Andrés', fecha: '15/10/2026', alarmas: [ALARMA] });
  assert.equal(casa, `PROGRAMA PARA CASA\nAndrés · 15/10/2026\n\n· Camina 10 min cada mañana.\n\n${ALARMA}`, 'sin la marca; la red, añadida');
  const sinRed = PIA.textoCasaIA(plan('- x', undefined, '- Camina.'), { alarmas: [ALARMA] });
  assert.ok(sinRed.endsWith(`\n\n${ALARMA}`), 'si la IA no la copió, se añade');
});

test('plan IA: truncado — faltan secciones o acaba a medias', () => {
  assert.equal(PIA.planTruncado(plan('- x.', '- y.', '- z.')), false);
  assert.equal(PIA.planTruncado(plan('- x.', '- y.', '- z sin terminar')), true);
  assert.equal(PIA.planTruncado('## SESIÓN\n- x.'), true);
  assert.equal(PIA.planTruncado(''), true);
});

test('plan IA: nunca en el payload, 📋 Notas, 📄 Informe ni el .json exportado', () => conAndres({}, () => {
  UI.contextoPlanIA();
  state.planTratamiento.ia = { texto: 'MARCADOR-PLAN-IA', revisados: [] };
  for (const t of [JSON.stringify(buildPhysiQPayload()), buildContextSummaryText(), buildInformeFisioterapiaText()])
    assert.ok(!t.includes('MARCADOR-PLAN-IA'));
  const exp = J.exportarValoracion(state);
  assert.ok(!JSON.stringify(exp).includes('MARCADOR-PLAN-IA'));
  assert.ok(exp.assessmentState.planTratamiento && !('ia' in exp.assessmentState.planTratamiento), 'las elecciones del fisio sí van');
  assert.equal(state.planTratamiento.ia.texto, 'MARCADOR-PLAN-IA', 'exportar no toca el estado');
  const imp = J.leerImportacion(JSON.stringify({ ...exp, assessmentState: { ...exp.assessmentState, planTratamiento: { ...exp.assessmentState.planTratamiento, ia: { texto: 'x' } } } }));
  assert.ok(imp.ok && !('ia' in imp.assessmentState.planTratamiento));
}));

test('plan IA: solo standalone — plan.js la carga con import() fuera del hub; nada más la importa', () => {
  const plan = leer('plan.js');
  assert.match(plan, /if \(!_ia && !document\.body\.classList\.contains\('in-hub'\)\) \{\s*import\('\.\/plan-ia\.js'\)/);
  assert.ok(!/^import .*plan-ia\.js/m.test(plan), 'nunca estática');
  for (const f of ['app.js', 'index.html', 'phase4.js', 'phase4b.js', 'informe-ia.js']) assert.ok(!leer(f).includes('plan-ia.js'), f);
  assert.match(leer('index.html'), /<div id="planIA" hidden><\/div>/);
  const yml = leer('.github/workflows/deploy-to-hub.yml');
  for (const f of ['plan-ia.js', 'lib/plan-ia.js', 'lib/revision-plan.js', 'lib/turnstile.js']) assert.match(yml, new RegExp(` ${f.replace(/[./]/g, '\\$&')} `), f);
});

test('plan IA: Turnstile compartido con el informe con IA (un solo script, un widget por tarjeta)', () => {
  const ia = leer('informe-ia.js'), pia = leer('plan-ia.js');
  for (const s of [ia, pia]) {
    assert.match(s, /crearTurnstile\(\{ caja: \(\) => \$\('p?iaTurnstile'\)/);
    assert.ok(!s.includes('challenges.cloudflare.com'), 'el script solo en lib/turnstile.js');
  }
  assert.match(leer('lib/turnstile.js'), /render=explicit&onload=__iaTurnstileOnload/);
});

test('plan IA: las funciones de los onclick están en window', () => {
  const src = leer('plan-ia.js');
  const usadas = new Set([...src.matchAll(/on(?:click|change)="(\w+)\(/g)].map(m => m[1]));
  for (const f of ['compartirPlanIA', 'compartirCasaIA']) usadas.add(f);
  for (const f of usadas) assert.equal(typeof window[f], 'function', f);
});
