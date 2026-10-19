// Fármacos que toma el paciente (paso 3 de la farmacología, docs/farmacos-paciente.md).
// Fichero propio, no tests/unit/farmacos.mjs, que tocan las ramas que escriben
// familias en paralelo. Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, buildPhysiQPayload, buildInformeFisioterapiaText,
  buildContextSummaryText, buildSistemaHTML, sistemasActivos, withState, VALID_REGIONS } from './comun.mjs';
const F = await import('../../lib/farmacos-paciente.js');
const G = await import('../../lib/farmacos.js');
const IN = await import('../../lib/informe-narrativo.js');
const P = await import('../../lib/plan-tratamiento.js');
const { FAMILIAS_FARMACO } = await import('../../data/farmacos.js');
const { FAMILIAS_PACIENTE, TEXTOS_FARMACOS_PACIENTE } = await import('../../data/farmacos-paciente.js');

console.log('\nfármacos que toma (paso 3 de la farmacología)');

const conContenido = FAMILIAS_FARMACO.filter(f => f.apartados);
const marcables = F.familiasMarcables().map(f => f.id);
const textoFamilia = f => JSON.stringify(f.apartados);

test('chips: las familias con contenido de la guía, en su orden, sin los antitrombóticos (nunca una lista a mano)', () => {
  assert.deepEqual(marcables, conContenido.map(f => f.id).filter(id => id !== 'antitromboticos'));
  assert.ok(!marcables.includes('antitromboticos'));
  // Sin entrada en data/farmacos-paciente.js, el chip lleva el nombre de la familia
  const sinEntrada = conContenido.find(f => !FAMILIAS_PACIENTE[f.id] && f.id !== 'antitromboticos');
  if (sinEntrada) assert.equal(F.familiasMarcables().find(f => f.id === sinEntrada.id).corto, sinEntrada.nombre);
  assert.deepEqual(F.familiasPendientesNombres(), FAMILIAS_FARMACO.filter(f => !f.apartados).map(f => f.nombre));
});

test('data/farmacos-paciente.js: cada clave es una familia con contenido; corto y rótulo si hay plan', () => {
  for (const [id, x] of Object.entries(FAMILIAS_PACIENTE)) {
    assert.ok(conContenido.some(f => f.id === id), `${id}: familia sin contenido o inexistente`);
    assert.notEqual(id, 'antitromboticos', 'los antitrombóticos salen de su tarjeta');
    assert.ok(x.corto, id);
    if (x.plan?.length) assert.ok(x.rotulo, `${id}: aviso sin rótulo`);
  }
});

test('avisos de la fase 6: cada frase está literal en su familia de la guía y lleva cita (o es redacción propia ya revisada)', () => {
  const PROPIAS = [   // frases sin cita revisadas como redacción propia (docs/farmacologia.md)
    'Anota si tomó una dosis antes de la sesión.',
    'Las fuentes leídas no dan normas de terapia manual en estos pacientes ni sobre el ejercicio en las horas siguientes a la toma.',
    'Las fuentes leídas no dan normas de terapia manual ni de ejercicio con estos fármacos. El sangrado que estudian es el grave, digestivo o intracraneal, no los hematomas de las técnicas manuales.',
    'Las fuentes leídas no dan normas de terapia manual ni de dosificación del ejercicio con estos fármacos.',
  ];
  for (const [id, x] of Object.entries(FAMILIAS_PACIENTE)) {
    const fam = conContenido.find(f => f.id === id);
    for (const t of x.plan || []) {
      assert.ok(textoFamilia(fam).includes(JSON.stringify(t).slice(1, -1)), `${id}: «${t.slice(0, 60)}…» no está literal en la guía`);
      assert.ok(PROPIAS.includes(t) || /\([A-ZÁÉÍÓÚ][^()]*\d{4}[^()]*\)/.test(t), `${id}: «${t.slice(0, 60)}…» sin cita`);
    }
  }
});

test('nunca proponer cambiar, suspender ni ajustar la medicación', () => {
  const textos = [...Object.values(FAMILIAS_PACIENTE).flatMap(x => [x.rotulo, ...(x.plan || [])]), ...Object.values(TEXTOS_FARMACOS_PACIENTE)];
  const malo = /\b(suspende|suspender|retira|retirar|baja la dosis|reduce la dosis|deja de tomar|ajusta la dosis)\b/i;
  for (const t of textos) assert.ok(!malo.test(t.replace(/No le digas que deje ni cambie[^.]*\./, '').replace(/No sugieras cambiar, suspender ni ajustar[^.]*\./, '')), t);
});

test('normalizarFarmacos: ids conocidos y marcables, en el orden de la guía', () => {
  assert.deepEqual(F.normalizarFarmacos(undefined), { toma: [] });
  assert.deepEqual(F.normalizarFarmacos({ toma: ['opioides', 'xx', 'aine', 'antitromboticos', 'aine'] }), { toma: ['aine', 'opioides'] });
});

test('vistas de otras tarjetas (decisión 4): corticoides del lupus y de la osteoporosis, sin entrar en `fm`', () => {
  const lupus = c => ({ estado: 'diagnosticado', corticoides: c });
  const op = (c, t = '') => ({ estado: 'diagnosticada', corticoides: c, tratamiento: t });
  assert.deepEqual(F.derivadasDeTarjetas({ lupus: lupus('m') }).corticoides, ['Lupus (LES)']);
  assert.ok(!F.derivadasDeTarjetas({ lupus: lupus('no') }).corticoides);
  assert.ok(!F.derivadasDeTarjetas({ lupus: { estado: 'sospecha', corticoides: 'a' } }).corticoides);
  assert.deepEqual(F.derivadasDeTarjetas({ osteoporosis: op('a') }).corticoides, ['Osteoporosis o fragilidad ósea']);
  assert.ok(!F.derivadasDeTarjetas({ osteoporosis: { estado: 'sospecha', corticoides: 'a' } }).corticoides);
  // El hueso solo cuando su familia tenga contenido
  const hueso = F.derivadasDeTarjetas({ osteoporosis: op('', 'antirresortivo') }).hueso;
  assert.equal(!!hueso, conContenido.some(f => f.id === 'hueso'));
  // Antitrombóticos, desde su tarjeta
  assert.deepEqual(F.derivadasDeTarjetas({ anticoagulado: { estado: 'toma', toma: ['as'] } }).antitromboticos, ['Paciente anticoagulado o antiagregado']);
  const lista = F.familiasPaciente({ farmacos: { toma: ['aine'] }, lupus: lupus('b'), anticoagulado: { estado: 'toma', toma: [] } });
  assert.deepEqual(lista.map(x => x.id), conContenido.map(f => f.id).filter(id => ['aine', 'corticoides', 'antitromboticos'].includes(id)));
  assert.equal(F.textoFamiliaPaciente(lista.find(x => x.id === 'corticoides')), 'Corticoides (tarjeta «Lupus (LES)»)');
  assert.equal(F.textoFamiliaPaciente(lista.find(x => x.id === 'aine')), 'AINE');
  // El payload solo lleva lo marcado aquí
  withState({ farmacos: { toma: ['aine'] }, lupus: { ...lupus('b') } }, () => {
    assert.deepEqual(buildPhysiQPayload().fm, [{ id: 'aine', n: 'AINE' }]);
  });
});

test('payload `fm`: solo con algo marcado (la huella de informes anteriores no cambia), con el nombre dentro', () => {
  withState({}, () => assert.ok(!('fm' in buildPhysiQPayload())));
  withState({ farmacos: { toma: ['opioides', 'aine'] } }, () => {
    assert.deepEqual(buildPhysiQPayload().fm, [{ id: 'aine', n: 'AINE' }, { id: 'opioides', n: 'Opioides' }]);
    assert.ok(buildContextSummaryText().includes('💊 FÁRMACOS (familias): AINE · Opioides'));
    assert.ok(!buildInformeFisioterapiaText().includes('AINE'), 'nada en el 📄 Informe (decisión 16)');
  });
});

// Texto que physiq-report copiará literal en `_bloqueFM` (como AC_CASOS)
export const FM_CASOS = {
  dos: [[{ id: 'aine', n: 'AINE' }, { id: 'opioides', n: 'Opioides' }],
    'Fármacos que toma (familias registradas por el fisioterapeuta; sin dosis ni nombres):\n  · AINE; Opioides\n  · No sugieras cambiar, suspender ni ajustar la medicación, ni comentes interacciones entre fármacos. No atribuyas los síntomas del paciente a un fármaco si el fisioterapeuta no lo ha dicho, y no añadas recomendaciones sobre la medicación que no estén en estos datos.'],
  una: [[{ id: 'estatinas', n: 'Estatinas' }],
    'Fármacos que toma (familias registradas por el fisioterapeuta; sin dosis ni nombres):\n  · Estatinas\n  · No sugieras cambiar, suspender ni ajustar la medicación, ni comentes interacciones entre fármacos. No atribuyas los síntomas del paciente a un fármaco si el fisioterapeuta no lo ha dicho, y no añadas recomendaciones sobre la medicación que no estén en estos datos.'],
};
test('bloqueFMIA: el texto que physiq-report copiará, literal, y en contextoValoracion() solo con `fm`', () => {
  for (const [k, [d, esperado]] of Object.entries(FM_CASOS)) assert.equal(F.bloqueFMIA(d), esperado, k);
  const sin = IN.contextoValoracion({ r: 'lumbar' });
  assert.ok(!sin.includes('Fármacos que toma'));
  assert.ok(IN.contextoValoracion({ r: 'lumbar', fm: FM_CASOS.una[0] }).includes(FM_CASOS.una[1]));
});

test('fase 6: un aviso por familia con frases, la línea común una vez; nada por combinación ni para los antitrombóticos', () => {
  const hs = ids => ids.map(id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false }));
  const base = { region: 'lumbar', hipotesis: hs(['x']), elegidas: ['x'], severidad: 5, irritabilidadNivel: 'Moderada', irritabilidad: {} };
  const sin = P.construirPlan(base);
  const comun = TEXTOS_FARMACOS_PACIENTE.lineaComun;
  assert.ok(!sin.avisosHip.includes(comun));
  const conPlan = Object.keys(FAMILIAS_PACIENTE).filter(id => FAMILIAS_PACIENTE[id].plan?.length);
  for (const id of conPlan) {
    const p = P.construirPlan({ ...base, farmacos: [id] });
    const aviso = `${FAMILIAS_PACIENTE[id].rotulo}: ${FAMILIAS_PACIENTE[id].plan.join(' ')}`;
    assert.ok(p.avisosHip.includes(aviso), id);
    assert.equal(p.avisosHip.filter(a => a === comun).length, 1, id);
  }
  // Sin interacciones: con dos familias, exactamente la suma de cada una
  const [a, b] = conPlan;
  const dos = P.construirPlan({ ...base, farmacos: [a, b] }).avisosHip;
  const sueltos = new Set([...P.construirPlan({ ...base, farmacos: [a] }).avisosHip, ...P.construirPlan({ ...base, farmacos: [b] }).avisosHip]);
  assert.deepEqual(new Set(dos), sueltos);
  assert.deepEqual(F.avisosFarmacos(['antitromboticos']), []);
  // No cambian el nivel, la frecuencia ni el tope
  const todas = P.construirPlan({ ...base, farmacos: conPlan });
  assert.deepEqual([todas.niveles, todas.gravedad, todas.irritabilidad], [sin.niveles, sin.gravedad, sin.irritabilidad]);
  assert.deepEqual(todas.sesion.cierre, sin.sesion.cierre, 'sin red de seguridad nueva');
});

test('seguridad: marcar todas las familias nunca cambia el cribado de la fase 2 ni sus urgencias', () => {
  for (const r of VALID_REGIONS) {
    const urgentes = SYSTEMIC_SCREENING[r].sistemas.flatMap(s => s.preguntas).filter(q => q.urgencia);
    const respuestas = Object.fromEntries(urgentes.map(q => [q.id, 'SI']));
    const pinta = () => ({ ur: buildPhysiQPayload().ur, html: sistemasActivos().map(s => buildSistemaHTML(s)).join('') });
    let sin;
    withState({ region: r, sistemicoAnswers: respuestas }, () => { sin = pinta(); });
    withState({ region: r, sistemicoAnswers: respuestas, farmacos: { toma: marcables } }, () => {
      const con = pinta();
      assert.deepEqual(con.ur, sin.ur, `${r}: mismas urgencias`);
      assert.equal(con.html, sin.html, `${r}: el cribado se pinta igual`);
    });
  }
});

test('guía: «Este paciente» filtra y despliega; sin familias no hay chip; farmacosHTML no lee el estado', () => {
  const todo = G.farmacosHTML();
  assert.ok(!todo.includes('data-filtro-farmaco'));
  const paciente = [{ id: 'aine', texto: 'AINE' }];
  const conChip = G.farmacosHTML({ paciente });
  assert.ok(conChip.includes(`data-filtro-farmaco="${G.FILTRO_PACIENTE_FARM}"`) && conChip.includes('aria-pressed="false"'));
  const solo = G.farmacosHTML({ paciente, filtro: G.FILTRO_PACIENTE_FARM });
  assert.ok(solo.includes('data-filtro-farmaco="todas"') && solo.includes('aria-pressed="true"'));
  assert.deepEqual([...solo.matchAll(/data-familia="([^"]+)"/g)].map(m => m[1]), ['aine']);
  assert.ok(solo.includes('data-familia="aine" open'));
  assert.ok(solo.includes(TEXTOS_FARMACOS_PACIENTE.guiaPaciente) && !solo.includes('farm-pendientes"'));
  for (const f of ['farmacos.js', 'farmacos-paciente.js']) assert.ok(!/state\.js|\bstate\./.test(leer('lib', f)), `${f} no lee el estado`);
});

test('tarjeta: sin texto libre; expuesta en window; pistas del formulario en la tarjeta; en el despliegue', () => {
  const html = leer('index.html');
  const card = html.slice(html.indexOf('id="cardFarmacos"'), html.indexOf('id="cardCronologia"'));
  assert.ok(card && !/<(input|textarea)\b/.test(card), 'sin campos de texto libre');
  assert.ok(card.includes('id="fpPistas_farmacos"'));
  assert.equal(typeof globalThis.toggleFarmaco, 'function');
  assert.ok(leer('.github', 'workflows', 'deploy-to-hub.yml').includes('lib/farmacos-paciente.js'));
});
