// Paciente anticoagulado o antiagregado (Fase P, docs/anticoagulado.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, buildPhysiQPayload, buildInformeFisioterapiaText,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML, sistemasActivos, withState, VALID_REGIONS } from './comun.mjs';
const A = await import('../../lib/anticoagulado.js');
const L = await import('../../lib/lupus.js');
const O = await import('../../lib/osteoporosis.js');
const IN = await import('../../lib/informe-narrativo.js');
const P = await import('../../lib/plan-tratamiento.js');
const PD = await import('../../data/plan-tratamiento.js');
const { HYPOTHESES } = await import('../../data.js');
const { SIS_ANTICOAGULADO, SIS_EMBARAZO } = await import('../../data/comun.js');

console.log('\npaciente anticoagulado o antiagregado (Fase P)');

const ac = (toma = null) => ({ anticoagulado: toma ? { estado: 'toma', toma } : A.anticoaguladoVacio() });
const visibles = toma => {
  let ids = [];
  withState({ region: 'lumbar', ...ac(toma) }, () => { ids = sistemasActivos().find(s => s.soloAnticoagulado)?.preguntas.map(q => q.id) || []; });
  return ids;
};
const URG = ['ac_u_cabeza', 'ac_u_cabeza_tardia', 'ac_u_espinal', 'ac_u_psoas', 'ac_u_pared', 'ac_u_compartimental'];

test('sistema común: la misma instancia en las 7 regiones, tras el del embarazo, oculto sin la tarjeta', () => {
  for (const r of VALID_REGIONS) {
    const sis = SYSTEMIC_SCREENING[r].sistemas;
    assert.ok(sis.includes(SIS_ANTICOAGULADO), r);
    assert.equal(sis.indexOf(SIS_ANTICOAGULADO), sis.indexOf(SIS_EMBARAZO) + 1, `${r}: justo después del embarazo`);
    withState({ region: r, ...ac() }, () => assert.ok(!sistemasActivos().some(s => s.soloAnticoagulado), `${r}: sin la tarjeta no se ve`));
    withState({ region: r, ...ac(['as']) }, () => assert.ok(sistemasActivos().some(s => s.soloAnticoagulado), `${r}: con la tarjeta se ve`));
  }
});

test('un solo estado, «Toma» (decisión 2): sin «Sospecha» ni «Diagnosticado»; chips de lo que toma', () => {
  assert.deepEqual(Object.keys(A.ESTADOS_AC), ['toma']);
  assert.deepEqual(A.TIPOS_AC, ['vk', 'do', 'hp', 'as', 'oa', 'ns']);
  assert.equal(A.normalizarAnticoagulado({ estado: 'sospecha' }).estado, '');
  const html = leer('index.html');
  const card = html.slice(html.indexOf('id="cardAnticoagulado"'), html.indexOf('id="cardCronologia"'));
  assert.ok(card.includes("selectACEstado('toma')") && !/sospecha|diagnosticad/i.test(card));
  assert.ok(html.indexOf('id="cardEmbarazo"') < html.indexOf('id="cardAnticoagulado"'), 'después del embarazo');
});

test('fase 2: seis urgencias y una derivación; ninguna con embudo; cada bandera enlazada a su pregunta', () => {
  assert.deepEqual(SIS_ANTICOAGULADO.preguntas.filter(q => q.urgencia).map(q => q.id), URG);
  assert.deepEqual(SIS_ANTICOAGULADO.preguntas.filter(q => q.derivacion).map(q => q.id), ['ac_d_hematoma']);
  const ids = new Set(SIS_ANTICOAGULADO.preguntas.map(q => q.id));
  for (const b of [...SIS_ANTICOAGULADO.banderasRojas, ...SIS_ANTICOAGULADO.banderasAmarillas]) {
    for (const id of [].concat(b.pregunta)) assert.ok(ids.has(id), `${b.texto}: ${id}`);
  }
  withState({ region: 'lumbar', ...ac(['do']) }, () => {
    const html = buildSistemaHTML(sistemasActivos().find(s => s.soloAnticoagulado));
    assert.ok(!html.includes('data-embudo='), 'sin embudo');
    for (const id of URG) assert.ok(html.includes(`sq2-urg`) && html.includes(id), id);
  });
  withState({ region: 'lumbar', ...ac(['do']), sistemicoAnswers: { ac_u_espinal: 'SI', ac_d_hematoma: 'SI' }, sistemicoAlerta: true }, () => {
    const d = buildPhysiQPayload();
    assert.ok(d.ur.includes(SIS_ANTICOAGULADO.preguntas.find(q => q.id === 'ac_u_espinal').urgencia));
    assert.ok(d.dv.includes(SIS_ANTICOAGULADO.preguntas.find(q => q.id === 'ac_d_hematoma').derivacion));
  });
  // Sin la tarjeta, una respuesta guardada no cuenta
  withState({ region: 'lumbar', ...ac(), sistemicoAnswers: { ac_u_espinal: 'SI' } }, () => assert.deepEqual(buildPhysiQPayload().ur, []));
});

test('golpe en la cabeza por fármaco (NICE NG232, 1.2.4): la aspirina sola no; clopidogrel, anticoagulante y «no lo sabe» sí', () => {
  assert.ok(!visibles(['as']).includes('ac_u_cabeza'), 'aspirina sola');
  for (const t of [['oa'], ['as', 'oa'], ['vk'], ['do'], ['hp'], ['ns'], []]) assert.ok(visibles(t).includes('ac_u_cabeza'), JSON.stringify(t));
  // Los síntomas tardíos, siempre
  for (const t of [['as'], ['oa'], ['do'], []]) assert.ok(visibles(t).includes('ac_u_cabeza_tardia'), JSON.stringify(t));
  // Psoas y pared abdominal, solo con anticoagulante (o «no lo sabe»)
  for (const id of ['ac_u_psoas', 'ac_u_pared']) {
    assert.ok(!visibles(['as', 'oa']).includes(id), `${id}: antiagregantes`);
    assert.ok(visibles(['vk']).includes(id) && visibles(['ns']).includes(id) && visibles([]).includes(id), id);
  }
  for (const id of ['ac_u_espinal', 'ac_u_compartimental', 'ac_d_hematoma']) assert.ok(visibles(['as']).includes(id), id);
});

test('seguridad: marcar la tarjeta (con todos los chips) nunca quita ni rebaja una urgencia de otro sistema', () => {
  for (const r of VALID_REGIONS) {
    const urgentes = SYSTEMIC_SCREENING[r].sistemas.filter(s => !Object.keys(s).some(k => /^solo[A-Z]/.test(k) && s[k] === true))
      .flatMap(s => s.preguntas).filter(q => q.urgencia);
    const respuestas = Object.fromEntries(urgentes.map(q => [q.id, 'SI']));
    const pinta = () => ({ ur: buildPhysiQPayload().ur, html: sistemasActivos().filter(s => !s.soloAnticoagulado).map(s => buildSistemaHTML(s)).join('') });
    let sin;
    withState({ region: r, ...ac(), sistemicoAnswers: respuestas }, () => { sin = pinta(); });
    withState({ region: r, ...ac(['vk', 'do', 'hp', 'as', 'oa']), sistemicoAnswers: respuestas }, () => {
      const con = pinta();
      assert.deepEqual(con.ur, sin.ur, `${r}: mismas urgencias`);
      assert.equal(con.html, sin.html, `${r}: los demás sistemas se pintan igual`);
    });
  }
});

test('grupos: anticoagulante, antiagregante, doble antiagregación y aspirina sola', () => {
  const t = toma => ({ estado: 'toma', toma });
  assert.ok(A.esAnticoagulante(t(['vk'])) && A.esAnticoagulante(t(['ns'])) && A.esAnticoagulante(t([])));
  assert.ok(!A.esAnticoagulante(t(['as', 'oa'])) && !A.esAnticoagulante(A.anticoaguladoVacio()));
  assert.ok(A.esAntiagregante(t(['oa'])) && !A.esAntiagregante(t(['do'])));
  assert.ok(A.dobleAntiagregacion(t(['as', 'oa'])) && !A.dobleAntiagregacion(t(['as'])));
  assert.ok(A.soloAspirina(t(['as'])) && !A.soloAspirina(t(['as', 'do'])) && !A.soloAspirina(t(['as', 'ns'])));
});

test('tope «sin thrust» (decisión 4): solo con anticoagulante (o «no lo sabe»), nunca con antiagregante solo', () => {
  const m = toma => O.motivosSinThrust(O.osteoporosisVacio(), null, { estado: 'toma', toma });
  for (const t of [['vk'], ['do'], ['hp'], ['ns'], [], ['as', 'do']]) assert.deepEqual(m(t), ['anticoagulante'], JSON.stringify(t));
  for (const t of [['as'], ['oa'], ['as', 'oa']]) assert.deepEqual(m(t), [], JSON.stringify(t));
  assert.deepEqual(O.motivosSinThrust(O.osteoporosisVacio(), null, A.anticoaguladoVacio()), []);
});

test('lupus (decisión 3): una sola fuente de datos; `le.at` sale de la tarjeta; la sesión antigua migra', () => {
  assert.ok(!L.CASILLAS_LES.includes('antitrombotico'));
  assert.ok(!('antitrombotico' in L.lupusVacio()));
  const html = leer('index.html');
  assert.ok(!html.includes('data-les-casilla="antitrombotico"') && html.includes('id="lesNotaAC"'));
  const lupus = { ...L.lupusVacio(), estado: 'diagnosticado' };
  withState({ lupus, ...ac(['oa']) }, () => assert.equal(buildPhysiQPayload().le.at, true));
  withState({ lupus, ...ac() }, () => assert.equal(buildPhysiQPayload().le.at, false));
  // Migración: la casilla antigua marcada y la tarjeta sin marcar → «Toma» con «No lo sabe»
  assert.deepEqual(A.migrarCasillaLupus({ antitrombotico: true }, undefined), { estado: 'toma', toma: ['ns'] });
  assert.deepEqual(A.migrarCasillaLupus({ antitrombotico: true }, { estado: 'toma', toma: ['as'] }), { estado: 'toma', toma: ['as'] }, 'la tarjeta ya marcada manda');
  assert.deepEqual(A.migrarCasillaLupus({ antitrombotico: false }, undefined), A.anticoaguladoVacio());
  const app = leer('app.js');
  assert.ok(app.indexOf('migrarCasillaLupus(state.lupus, state.anticoagulado)') < app.indexOf('state.lupus = normalizarLupus(state.lupus)'), 'migra antes de normalizar (que quita la casilla)');
});

test('payload `ac`: solo con la tarjeta marcada, en el orden de la tarjeta', () => {
  withState({ ...ac() }, () => assert.ok(!('ac' in buildPhysiQPayload()), 'sin la tarjeta, el payload no cambia'));
  withState({ ...ac(['as', 'vk']) }, () => assert.deepEqual(buildPhysiQPayload().ac, { es: 'toma', ti: ['vk', 'as'] }));
  withState({ ...ac([]) }, () => assert.deepEqual(buildPhysiQPayload().ac, { es: 'toma', ti: [] }));
});

test('📋 Notas, 📄 Informe (solo el antecedente, decisión 17) e informe con IA (sin fuentes)', () => {
  withState({ ...ac(['vk', 'as', 'oa']) }, () => {
    assert.match(buildContextSummaryText(), /🩸 ANTICOAGULADO\/ANTIAGREGADO: antivitamina K · aspirina · otro antiagregante · doble antiagregación/);
    const i = buildInformeFisioterapiaText();
    assert.match(i, /TRATAMIENTO ANTICOAGULANTE O ANTIAGREGANTE\n  · Tratamiento anticoagulante \(antivitamina K\)\.\n  · Tratamiento antiagregante doble\./);
    assert.ok(!/thrust|punción|Puentedura|NICE/i.test(i.slice(i.indexOf('TRATAMIENTO ANTICOAGULANTE'))), 'sin recomendaciones de técnica');
    const ctx = IN.contextoValoracion(buildPhysiQPayload());
    assert.ok(ctx.includes('Paciente anticoagulado o antiagregado (condición especial marcada por el fisioterapeuta):'));
    assert.ok(!/NICE|Puentedura|Hutting|Whedon|Chenoweth|Blaess|Steffel|Salmasi/.test(ctx.slice(ctx.indexOf('Paciente anticoagulado'))), 'el bloque no lleva las fuentes');
  });
  withState({ ...ac() }, () => {
    assert.ok(!buildContextSummaryText().includes('ANTICOAGULADO'));
    assert.ok(!buildInformeFisioterapiaText().includes('TRATAMIENTO ANTICOAGULANTE'));
  });
});

test('fase 5: el recuadro cambia por fármaco; nunca entra en lo que se comparte', () => {
  const t = A.AC.textos;
  const lin = ti => A.lineasRecomendacionAC({ es: 'toma', ti });
  for (const k of ['medico', 'tejidosBlandos', 'puncion', 'ondas', 'ejercicio', 'deporte', 'caidas', 'banderas', 'otrosFarmacos']) {
    assert.ok(lin(['as']).includes(t[k]) && lin(['do']).includes(t[k]), k);
  }
  assert.ok(lin(['as']).includes(t.cabezaAspirina) && !lin(['as']).includes(t.cabeza));
  assert.ok(lin(['oa']).includes(t.cabeza) && lin(['oa']).includes(t.antiagregante) && !lin(['oa']).includes(t.thrust));
  assert.ok(lin(['do']).includes(t.thrust) && !lin(['do']).includes(t.antiagregante));
  assert.ok(lin(['hp']).includes(t.heparina) && !lin(['do']).includes(t.heparina));
  assert.ok(leer('app.js').includes('_anticoaguladoResultadosHTML(ac)'));
  withState({ ...ac(['vk', 'hp']) }, () => {
    for (const k of ['tecnica4b', 'thrust', 'puncion', 'ondas', 'deporte', 'caidas', 'tejidosBlandos', 'nota']) {
      const frag = t[k].slice(0, 40);
      assert.ok(!JSON.stringify(buildPhysiQPayload()).includes(frag) && !buildContextSummaryText().includes(frag) && !buildInformeFisioterapiaText().includes(frag), k);
    }
  });
  assert.ok(leer('phase4b.js').includes('ac-nota-4b'));
});

test('fase 6: aviso y red del sangrado con la tarjeta; punción seca y ondas de choque solo por hipótesis', () => {
  const hs = ids => ids.map(id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false }));
  const base = { region: 'codo', hipotesis: hs(['x']), elegidas: ['x'], severidad: 5, irritabilidadNivel: 'Moderada', irritabilidad: {} };
  const sin = P.construirPlan(base);
  assert.ok(!sin.avisosHip.includes(PD.AVISOS.anticoagulado));
  assert.ok(!sin.sesion.cierre.includes(PD.TEXTOS_SESION.cierreAnticoagulado));
  for (const region of ['codo', 'lumbar', 'rodilla']) {
    const con = P.construirPlan({ ...base, region, anticoagulado: true });
    assert.ok(con.avisosHip.includes(PD.AVISOS.anticoagulado), region);
    assert.ok(!con.avisosHip.includes(PD.AVISOS.anticoaguladoPuncion) && !con.avisosHip.includes(PD.AVISOS.anticoaguladoOndas), region);
    assert.ok(con.sesion.cierre.includes(PD.TEXTOS_SESION.cierreAnticoagulado), region);
    assert.ok(con.alarmasCasa.includes(PD.TEXTOS_CASA.alarmaAnticoagulado.texto), region);
  }
  const puncion = P.construirPlan({ ...base, region: 'cervical', hipotesis: hs(['ce1']), elegidas: ['ce1'], anticoagulado: true });
  assert.ok(puncion.avisosHip.includes(PD.AVISOS.anticoaguladoPuncion));
  const ondas = P.construirPlan({ ...base, region: 'rodilla', hipotesis: hs(['ro6']), elegidas: ['ro6'], anticoagulado: true });
  assert.ok(ondas.avisosHip.includes(PD.AVISOS.anticoaguladoOndas));
  const sinTarjeta = P.construirPlan({ ...base, region: 'cervical', hipotesis: hs(['ce1']), elegidas: ['ce1'] });
  assert.ok(!sinTarjeta.avisosHip.includes(PD.AVISOS.anticoaguladoPuncion), 'sin la tarjeta, nada');
  // El tope: solo con su motivo
  const tope = P.construirPlan({ ...base, anticoagulado: true, sinThrust: ['anticoagulante'] });
  assert.ok(tope.avisosHip.includes(PD.AVISOS.sinThrustAnticoagulante) && !tope.avisosHip.includes(PD.AVISOS.sinThrustLupus));
  assert.ok(!P.construirPlan({ ...base, anticoagulado: true }).avisosHip.includes(PD.AVISOS.sinThrustAnticoagulante));
  assert.ok(!('lupusAntitrombotico' in PD.AVISOS), 'el aviso del lupus pasa a la tarjeta');
  assert.ok(leer('plan.js').includes('acActivo(state.anticoagulado)'));
});

test('listas de punción seca y ondas de choque (decisión 12): pautas que las recomiendan, no las que las desaconsejan', () => {
  assert.deepEqual(PD.HIP_PUNCION_SECA, ['h6', 'ce1', 'ce7', 'ce14', 'lu9', 'co1', 'ca1', 'ca15', 'tp26']);
  assert.deepEqual(PD.HIP_ONDAS_CHOQUE, ['h2', 'ca9', 'ca19', 'ro6']);
  for (const id of PD.HIP_PUNCION_SECA) assert.ok(/punción seca/i.test(HYPOTHESES[id].dosis), id);
  for (const id of PD.HIP_ONDAS_CHOQUE) assert.ok(/ondas de choque/i.test(HYPOTHESES[id].dosis), id);
  // Las que solo la nombran para no ofrecerla (NICE NG226, 1.3.8; Willy 2019) quedan fuera
  for (const id of ['h10', 'ro1', 'ro3', 'tp24']) {
    assert.ok(/punción seca/i.test(HYPOTHESES[id].dosis) && !PD.HIP_PUNCION_SECA.includes(id), id);
  }
  // Ninguna otra pauta las nombra sin estar decidida
  const decididas = new Set([...PD.HIP_PUNCION_SECA, 'h10', 'ro1', 'ro3', 'tp24']);
  for (const [id, h] of Object.entries(HYPOTHESES)) {
    if (/punción seca/i.test(h.dosis || '')) assert.ok(decididas.has(id), `${id}: pauta con punción seca sin decidir`);
    if (/ondas de choque/i.test(h.dosis || '')) assert.ok(PD.HIP_ONDAS_CHOQUE.includes(id), `${id}: pauta con ondas de choque sin decidir`);
  }
});

test('modo breve: «qué toma» sin registrar es un pendiente; el sistema no tiene embudo', () => {
  withState({ ...ac([]), modo: 'breve', region: 'lumbar' }, () => {
    const p = getPendientesBreve();
    assert.ok(p.some(x => x.texto.startsWith('Qué toma, sin registrar') && x.ancla === 'cardAnticoagulado'));
    assert.ok(!p.some(x => x.texto.includes('Anticoagulado o antiagregado')), 'no sale como sistema sin cribar');
  });
  withState({ ...ac(['as']), modo: 'breve', region: 'lumbar' }, () => assert.ok(!getPendientesBreve().some(p => p.texto.startsWith('Qué toma'))));
  withState({ ...ac([]), modo: 'completo', region: 'lumbar' }, () => assert.deepEqual(getPendientesBreve(), []));
});

test('normalizar: sesiones anteriores y valores raros', () => {
  assert.deepEqual(A.normalizarAnticoagulado(undefined), A.anticoaguladoVacio());
  assert.deepEqual(A.normalizarAnticoagulado({ estado: 'x', toma: 'vk' }), A.anticoaguladoVacio());
  assert.deepEqual(A.normalizarAnticoagulado({ estado: 'toma', toma: ['oa', 'zz', 'vk'] }), { estado: 'toma', toma: ['vk', 'oa'] });
});

test('se despliega y se expone: lib/anticoagulado.js en deploy-to-hub.yml; funciones de la tarjeta en window', () => {
  assert.ok(leer('.github', 'workflows', 'deploy-to-hub.yml').includes('lib/anticoagulado.js'));
  for (const f of ['selectACEstado', 'toggleACToma', 'irATarjetaAC', 'abrirFarmacos']) assert.equal(typeof globalThis[f], 'function', f);
  assert.ok(leer('index.html').includes("abrirFarmacos({ familia: 'antitromboticos' })"));
});

// physiq-report (lib/payload.js, _bloqueAC) llevará una copia de bloqueACIA()
// y su test fijará estos mismos textos: si cambian aquí, se copian allí.
const CABECERA = 'Paciente anticoagulado o antiagregado (condición especial marcada por el fisioterapeuta):';
const NO_AJUSTAR = '  · No sugieras suspender, saltarse ni ajustar el tratamiento. No atribuyas los síntomas del paciente al fármaco si el fisioterapeuta no lo ha dicho.';
const CABEZA = 'Golpe en la cabeza con anticoagulante o con un antiagregante que no sea la aspirina sola: a urgencias, aunque se encuentre bien; que un adulto le acompañe las primeras 24 horas y sepa que puede empeorar después de parecer recuperado. El sangrado tardío es raro, pero puede aparecer días después.';
const THRUST = 'Thrust: la única tabla específica de la columna torácica lo pone como contraindicación absoluta con tratamiento anticoagulante, y otra, de la terapia manual cervical, como precaución; las dos son opinión de expertos, y ninguna distingue fármacos ni da un INR. Un estudio de cohorte asoció la anticoagulación crónica a más lesión cerebral o medular tras la manipulación, sin probar la causa.';
const BANDERAS = 'Banderas de sangrado (fase 2): dolor brusco de cuello o espalda con debilidad, dolor de ingle o costado con el muslo débil o mareo, dolor brusco con bulto en la pared del abdomen, una extremidad tensa con dolor desproporcionado, y un hematoma que no se resuelve.';
export const AC_CASOS = {
  anticoaguladoYAspirina: [{ es: 'toma', ti: ['vk', 'as'] },
    `${CABECERA}\n  · Toma: antivitamina K; aspirina\n${NO_AJUSTAR}\n  · Consideraciones para la sesión: ${CABEZA} ${THRUST} ${BANDERAS}`],
  aspirinaSola: [{ es: 'toma', ti: ['as'] },
    `${CABECERA}\n  · Toma: aspirina\n${NO_AJUSTAR}\n  · Consideraciones para la sesión: Con la aspirina sola, el golpe en la cabeza no es por sí solo motivo de derivar; los síntomas tras el golpe sí lo son. Con antiagregante solo, ninguna fuente de manipulación lo trata como contraindicación; precaución con lo que tenga riesgo de golpe. ${BANDERAS}`],
  sinRegistrar: [{ es: 'toma', ti: [] },
    `${CABECERA}\n  · Toma: fármaco sin registrar\n${NO_AJUSTAR}\n  · Consideraciones para la sesión: ${CABEZA} ${THRUST} ${BANDERAS}`],
};
test('bloqueACIA: el texto que physiq-report copiará, literal', () => {
  for (const [k, [d, esperado]] of Object.entries(AC_CASOS)) assert.equal(A.bloqueACIA(d), esperado, k);
});
