// Implantes con electrodos (Fase P, docs/implantes-electrodos.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, HYPOTHESES, buildPhysiQPayload, buildInformeFisioterapiaText,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML, sistemasActivos, withState, VALID_REGIONS } from './comun.mjs';
const I = await import('../../lib/implantes.js');
const IN = await import('../../lib/informe-narrativo.js');
const P = await import('../../lib/plan-tratamiento.js');
const PD = await import('../../data/plan-tratamiento.js');
const RP = await import('../../lib/revision-plan.js');
const { REFERENCIAS } = await import('../../data/referencias.js');
const { IMPLANTES, SIS_PARKINSON } = await import('../../data/comun.js');

console.log('\nImplantes con electrodos (Fase P)');

const ie = (estado = '', tipos = []) => ({ implantes: { estado, tipos } });

test('tarjeta: un solo estado («Lleva») y 9 chips en el orden del texto cerrado; después del Parkinson', () => {
  assert.deepEqual(Object.keys(I.ESTADOS_IE), ['lleva']);
  assert.deepEqual(I.TIPOS_IE, ['mp', 'dai', 'em', 'ecp', 'ci', 'on', 'co', 're', 'ns']);
  const html = leer('index.html');
  assert.ok(html.indexOf('id="cardParkinson"') < html.indexOf('id="cardImplantes"'), 'después del Parkinson');
  assert.ok(html.indexOf('id="cardImplantes"') < html.indexOf('id="cardFarmacos"'), 'antes de los fármacos');
  assert.ok(html.includes('id="fpPistas_implantes"'), 'la pista del formulario');
  assert.equal(I.normalizarImplantes({ estado: 'x', tipos: ['zz'] }).estado, '');
  assert.deepEqual(I.normalizarImplantes({ estado: 'lleva', tipos: ['em', 'mp'] }).tipos, ['mp', 'em'], 'orden de la tarjeta');
});

test('chips: «No sabe cuál» excluye a los demás y al revés; un segundo toque desmarca', () => {
  let v = I.alternarTipo({ estado: 'lleva', tipos: ['mp'] }, 'em');
  assert.deepEqual(v.tipos, ['mp', 'em']);
  v = I.alternarTipo(v, 'ns');
  assert.deepEqual(v.tipos, ['ns']);
  v = I.alternarTipo(v, 'ci');
  assert.deepEqual(v.tipos, ['ci']);
  assert.deepEqual(I.alternarTipo(v, 'ci').tipos, []);
});

test('qué línea sale con qué chip (tabla del texto cerrado); la diatermia siempre; cada una una vez y en orden', () => {
  const L = I.clavesLineas;
  assert.deepEqual(L(['mp']), ['diatermia', 'cardiaco']);
  assert.deepEqual(L(['dai']), ['diatermia', 'cardiaco']);
  assert.deepEqual(L(['em']), ['diatermia', 'medular', 'laser']);
  assert.deepEqual(L(['ecp']), ['diatermia', 'cerebral', 'laser']);
  assert.deepEqual(L(['ci']), ['diatermia', 'coclear']);
  assert.deepEqual(L(['on']), ['diatermia', 'nervio', 'laser']);
  assert.deepEqual(L(['co']), ['diatermia', 'nervio']);
  assert.deepEqual(L(['re']), ['diatermia', 'retirado']);
  assert.deepEqual(L(['ns']), ['diatermia', 'cardiaco', 'nervio', 'laser', 'nosabe']);
  assert.deepEqual(L([]), L(['ns']), 'sin chips, como «No sabe cuál» (decisión 5)');
  assert.deepEqual(L(['mp', 'dai', 'em', 'on']), ['diatermia', 'cardiaco', 'medular', 'nervio', 'laser']);
});

test('frases del texto cerrado: la del cerebral profundo es la del Parkinson, sin cambios; cada línea con su fuente', () => {
  assert.equal(IMPLANTES.lineas.cerebral, SIS_PARKINSON.parkinson.textos.estimulador);
  for (const [k, t] of Object.entries(IMPLANTES.lineas)) {
    if (k === 'nosabe') continue;   // redacción propia (decisión 5)
    assert.match(t, /\((FDA|Health|Houghton|Stühlinger|Medtronic|MED-EL|Ghaly|Keus|Suhail)[^)]*\d{4}/, k);
  }
  assert.ok(IMPLANTES.lineas.diatermia.includes('a menos de 3 m') && IMPLANTES.lineas.diatermia.includes('ni si no sabes por dónde van'), 'decisiones 20 y 6');
  assert.ok(IMPLANTES.lineas.medular.includes('Sin masaje ni fricción'), 'decisión 10');
});

test('estimulador cerebral profundo: un solo dato con la fila del Parkinson (decisión 11)', () => {
  const S = I.sincronizarEstimulador;
  const diag = est => ({ estado: 'diagnosticado', estimulador: est });
  // La fila en «Sí» marca la tarjeta con el chip; otra respuesta, o borrarla, lo quita
  let r = S({ ie: { estado: '', tipos: [] }, pk: diag('SI'), evento: 'pkFila' });
  assert.deepEqual(r.ie, { estado: 'lleva', tipos: ['ecp'] });
  assert.deepEqual(S({ ie: r.ie, pk: diag(''), evento: 'pkFila' }).ie, { estado: '', tipos: [] }, 'sin otro chip, la tarjeta se desmarca');
  assert.deepEqual(S({ ie: { estado: 'lleva', tipos: ['mp', 'ecp'] }, pk: diag('NS'), evento: 'pkFila' }).ie, { estado: 'lleva', tipos: ['mp'] }, '«No lo sabe» quita el chip');
  // El chip marcado pone la fila en «Sí»; quitarlo la borra si estaba en «Sí»
  assert.equal(S({ ie: { estado: 'lleva', tipos: ['ecp'] }, pk: diag(''), evento: 'ie' }).pk.estimulador, 'SI');
  assert.equal(S({ ie: { estado: 'lleva', tipos: ['mp'] }, pk: diag('SI'), evento: 'ie' }).pk.estimulador, '');
  assert.equal(S({ ie: { estado: 'lleva', tipos: ['mp'] }, pk: diag('NS'), evento: 'ie' }).pk.estimulador, 'NS', '«No lo sabe» sigue en el Parkinson');
  // Sin el Parkinson diagnosticado, la fila no se toca
  assert.equal(S({ ie: { estado: 'lleva', tipos: ['ecp'] }, pk: { estado: '', estimulador: '' }, evento: 'ie' }).pk.estimulador, '');
  // Al pasar a «Diagnosticado» con el chip marcado, la fila pasa a «Sí»; una sesión antigua con «Sí» añade el chip
  assert.equal(S({ ie: { estado: 'lleva', tipos: ['ecp'] }, pk: diag(''), evento: 'pkEstado' }).pk.estimulador, 'SI');
  assert.deepEqual(S({ ie: { estado: '', tipos: [] }, pk: diag('SI'), evento: 'restaurar' }).ie, { estado: 'lleva', tipos: ['ecp'] });
});

test('sin sistema de la fase 2: marcar la tarjeta (con todos los chips) no cambia el cribado ni sus urgencias', () => {
  for (const r of VALID_REGIONS) {
    const urgentes = SYSTEMIC_SCREENING[r].sistemas.flatMap(s => s.preguntas).filter(q => q.urgencia);
    const respuestas = Object.fromEntries(urgentes.map(q => [q.id, 'SI']));
    const pinta = () => ({ ur: buildPhysiQPayload().ur, html: sistemasActivos().map(s => buildSistemaHTML(s)).join('') });
    let sin;
    withState({ region: r, ...ie(), sistemicoAnswers: respuestas }, () => { sin = pinta(); });
    for (const tipos of [[], ['ns'], ['mp', 'dai', 'em', 'ecp', 'ci', 'on', 'co', 're']]) {
      withState({ region: r, ...ie('lleva', tipos), sistemicoAnswers: respuestas }, () => {
        const con = pinta();
        assert.deepEqual(con.ur, sin.ur, `${r}: mismas urgencias`);
        assert.equal(con.html, sin.html, `${r}: el cribado se pinta igual`);
      });
    }
  }
  assert.ok(!Object.values(SYSTEMIC_SCREENING).some(s => s.sistemas.some(x => x.soloImplantes)), 'ningún sistema propio');
});

test('payload `ie`: solo con la tarjeta; { es: «lleva», ti } en el orden de la tarjeta, [] sin chips', () => {
  withState(ie(), () => assert.equal(buildPhysiQPayload().ie, undefined));
  withState(ie('lleva'), () => assert.deepEqual(buildPhysiQPayload().ie, { es: 'lleva', ti: [] }));
  withState(ie('lleva', ['em', 'mp']), () => assert.deepEqual(buildPhysiQPayload().ie, { es: 'lleva', ti: ['mp', 'em'] }));
});

test('📋 Notas, 📄 Informe (solo el antecedente, sin técnicas) e informe con IA (sin fuentes)', () => {
  withState(ie('lleva', ['mp', 'em']), () => {
    const notas = buildContextSummaryText();
    assert.ok(notas.includes('⚡ IMPLANTES CON ELECTRODOS: marcapasos · estimulador medular'), notas);
    const inf = buildInformeFisioterapiaText();
    assert.ok(inf.includes('IMPLANTES CON ELECTRODOS\n  · Portador de: marcapasos, estimulador medular.'), inf);
    const bloque = inf.slice(inf.indexOf('IMPLANTES CON ELECTRODOS')).split('\n\n')[0];
    assert.ok(!/onda corta|TENS|ultrasonido|electroterapia/i.test(bloque), `sin técnicas: ${bloque}`);
  });
  withState(ie('lleva'), () => {
    assert.ok(buildContextSummaryText().includes('⚡ IMPLANTES CON ELECTRODOS: sin registrar qué lleva'));
    assert.ok(buildInformeFisioterapiaText().includes('Portador de un implante con electrodos.'));
  });
  withState(ie(), () => assert.ok(!buildContextSummaryText().includes('IMPLANTES')));
  const bloque = I.bloqueIEIA({ es: 'lleva', ti: ['mp'] });
  assert.ok(!/\(\w[^()]*\d{4}/.test(bloque), 'sin citas');
  withState(ie('lleva', ['mp']), () => assert.ok(IN.contextoValoracion(buildPhysiQPayload()).includes(bloque), 'en el prompt'));
});

test('fase 6: el aviso en cualquier plan con las líneas de sus chips; por pauta; consejos para casa; sin red ni tope', () => {
  const hs = ids => ids.map(id => ({ id, name: HYPOTHESES[id]?.name || id, pauta: 'P.', derivar: false, tratada: false }));
  const base = { region: 'rodilla', hipotesis: hs(['ro4', 'ro5']), elegidas: ['ro5'], severidad: 5, irritabilidadNivel: 'Moderada', irritabilidad: {} };
  const sin = P.construirPlan(base);
  assert.ok(!sin.avisosHip.some(a => a.startsWith('Implantes con electrodos')));
  const con = P.construirPlan({ ...base, implantes: { tipos: ['dai', 'em'] } });
  for (const k of ['diatermia', 'cardiaco', 'medular', 'laser', 'columna']) assert.ok(con.avisosHip.includes(PD.AVISOS[`implantes_${k}`]), k);
  assert.ok(!con.avisosHip.includes(PD.AVISOS.implantes_coclear));
  assert.deepEqual(con.consejosCasa, [PD.TEXTOS_CASA.implantesTensDAI.texto, PD.TEXTOS_CASA.implantesColumna.texto, PD.TEXTOS_CASA.implantesTensMedular.texto]);
  assert.deepEqual(con.alarmasCasa, sin.alarmasCasa, 'sin red de seguridad nueva');
  assert.ok(!con.avisosHip.some(a => /thrust/i.test(a)), 'sin tope de técnica');
  // Por pauta (decisión 12): con ro4 elegida
  const r4 = P.construirPlan({ ...base, elegidas: ['ro4'], implantes: { tipos: ['mp'] } });
  assert.ok(r4.avisosHip.includes(PD.AVISOS_IMPLANTES_PAUTA.ro4.replace('{nombre}', HYPOTHESES.ro4.name)));
  // Con el chip del cerebral profundo, el aviso del Parkinson no se repite
  const pk = { ...base, parkinson: { estimulador: true } };
  assert.ok(P.construirPlan(pk).avisosHip.includes(PD.AVISOS.parkinsonEstimulador));
  assert.ok(!P.construirPlan({ ...pk, implantes: { tipos: ['ecp'] } }).avisosHip.includes(PD.AVISOS.parkinsonEstimulador));
  assert.ok(leer('plan.js').includes('ieActivo(state.implantes)'));
});

test('los avisos de la fase 6 son las frases de la tarjeta, tal cual, con su prefijo', () => {
  for (const [k, t] of Object.entries(IMPLANTES.lineas)) assert.equal(PD.AVISOS[`implantes_${k}`], `Implantes con electrodos: ${t}`, k);
  assert.equal(PD.AVISOS.implantes_columna, `Implantes con electrodos: ${IMPLANTES.textos.columna}`);
  for (const [id, t] of Object.entries(IMPLANTES.pautas)) assert.equal(PD.AVISOS_IMPLANTES_PAUTA[id], `Implantes con electrodos: la pauta de {nombre} ${t}.`, id);
});

test('lista fija de pautas (decisión 12): solo h1, ce5, ro2 y ro4 proponen la técnica; una pauta nueva que la proponga falla', () => {
  assert.deepEqual(Object.keys(IMPLANTES.pautas), ['h1', 'ce5', 'ro2', 'ro4']);
  // Las 16 pautas que nombran la técnica (docs/implantes-electrodos.md); las demás la desaconsejan
  const nombran = Object.entries(HYPOTHESES).filter(([, h]) => /\bTENS\b|electro(terapia|estimulaci|analges)|NMES|ultrasonido|interferencial|diatermia|onda corta|microondas/i
    .test(`${h.dosis || ''} ${JSON.stringify(h.dosisRamas || '')}`)).map(([id]) => id).sort();
  assert.deepEqual(nombran, ['ca1', 'ca15', 'ce5', 'co1', 'h1', 'h10', 'h2', 'h3', 'ro1', 'ro2', 'ro3', 'ro4', 'tp1', 'tp24', 'tp26', 'tp8'],
    'una pauta nueva nombra la técnica: decide si va en IMPLANTES.pautas');
});

test('revisión del plan con IA: un punto alto si propone un agente físico con la tarjeta marcada', () => {
  const plan = s => `## SESIÓN\n${s}\n## PLAN DEL MES\n- x.\n## PROGRAMA PARA CASA\n- y.`;
  const ids = (s, implantes) => RP.revisarPlan(plan(s), { implantes }).filter(p => p.id === 'implante');
  assert.equal(ids('- TENS 20 min en la rodilla.', false).length, 0, 'sin la tarjeta, nada');
  const p = ids('- TENS 20 min en la rodilla.', true);
  assert.equal(p.length, 1);
  assert.equal(p[0].nivel, 'alto');
  assert.ok(p[0].mensaje.startsWith('El plan propone TENS y el paciente lleva un implante con electrodos'));
  assert.equal(ids('- Sin onda corta ni ultrasonido por el implante.', true).length, 0, 'una frase que la descarta no cuenta');
  assert.ok(leer('plan-ia.js').includes('implantes: ieActivo(state.implantes)'));
});

test('modo breve: con la tarjeta y sin chips, «qué lleva» es un pendiente', () => {
  withState({ ...ie('lleva'), modo: 'breve', region: 'lumbar' }, () =>
    assert.ok(getPendientesBreve().some(x => x.texto === 'Implante con electrodos: qué lleva sin registrar' && x.ancla === 'cardImplantes')));
  withState({ ...ie('lleva', ['mp']), modo: 'breve', region: 'lumbar' }, () => assert.ok(!getPendientesBreve().some(x => x.ancla === 'cardImplantes')));
});

test('registro: las fuentes del texto cerrado están en data/referencias.js; las que no usa, fuera', () => {
  for (const k of ['FDA 2002 (diatermia)', 'Health Canada 2003 (diatermia)', 'Keus 2014', 'Stühlinger 2022', 'Houghton 2010', 'Suhail Arain 2023',
    'Mohammad 2022', 'Medtronic 2023 (neuroestimulación)', 'MED-EL 2026 (procedimientos médicos)', 'Ghaly 2016', 'Suarez-Fuster 2018']) assert.ok(REFERENCIAS[k], k);
  for (const k of ['Barmore 2022', 'Kim 2021', 'Chen 2022 (electroterapia)']) assert.ok(!REFERENCIAS[k], `${k}: el texto no la usa`);
});

test('se despliega y se expone: lib/implantes.js en deploy-to-hub.yml; funciones de la tarjeta en window', () => {
  assert.ok(leer('.github', 'workflows', 'deploy-to-hub.yml').includes('lib/implantes.js'));
  for (const f of ['selectIEEstado', 'toggleIETipo', 'irATarjetaIE']) assert.equal(typeof globalThis[f], 'function', f);
});

// physiq-report (lib/payload.js, _bloqueIE) llevará una copia de bloqueIEIA()
// y su test fijará estos mismos textos: si cambian aquí, se copian allí.
const CABECERA = 'Implantes con electrodos (condición especial marcada por el fisioterapeuta):';
const SIEMPRE = '  · No propongas onda corta ni microondas. No propongas ultrasonido terapéutico sobre el aparato o sus cables.';
const CARDIACO = '  · Con marcapasos o desfibrilador, no propongas electroterapia salvo que conste que la ha autorizado su unidad de marcapasos.';
const OTROS = '  · No propongas electroterapia sobre el aparato o sus cables.';
const US = '  · No propongas ultrasonido terapéutico en ninguna zona.';
export const IE_CASOS = {
  marcapasos: [{ es: 'lleva', ti: ['mp'] }, `${CABECERA}\n  · Lleva: marcapasos\n${SIEMPRE}\n${CARDIACO}`],
  medular: [{ es: 'lleva', ti: ['em'] }, `${CABECERA}\n  · Lleva: estimulador medular\n${SIEMPRE}\n${OTROS}\n${US}`],
  coclear: [{ es: 'lleva', ti: ['ci'] }, `${CABECERA}\n  · Lleva: implante coclear\n${SIEMPRE}\n${OTROS}`],
  retirado: [{ es: 'lleva', ti: ['re'] }, `${CABECERA}\n  · Lleva: implante retirado, pueden quedar electrodos\n${SIEMPRE}`],
  sinChips: [{ es: 'lleva', ti: [] }, `${CABECERA}\n  · Lleva: sin registrar qué lleva\n${SIEMPRE}\n${CARDIACO}`],
  varios: [{ es: 'lleva', ti: ['dai', 'ecp'] }, `${CABECERA}\n  · Lleva: desfibrilador implantable; estimulador cerebral profundo\n${SIEMPRE}\n${CARDIACO}\n${OTROS}\n${US}`],
};
test('bloqueIEIA: el texto que physiq-report copiará, literal', () => {
  for (const [k, [d, esperado]] of Object.entries(IE_CASOS)) assert.equal(I.bloqueIEIA(d), esperado, k);
});
