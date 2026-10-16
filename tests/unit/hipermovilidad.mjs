// Hipermovilidad / Ehlers-Danlos (Fase P, docs/hipermovilidad.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, HYPOTHESES, SYSTEMIC_SCREENING, buildPhysiQPayload, buildInformeFisioterapiaText,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML, sistemasActivos, buildTestItem, withState, VALID_REGIONS } from './comun.mjs';
const HMX = await import('../../lib/hipermovilidad.js');
const IN = await import('../../lib/informe-narrativo.js');
const { SIS_HIPERMOVILIDAD } = await import('../../data/comun.js');

console.log('\nhipermovilidad (Fase P)');

const hm = (extra = {}) => ({ hipermovilidad: { ...HMX.hipermovilidadVacia(), ...extra } });
const idsVisibles = () => (sistemasActivos().find(s => s.id === 'transversal_hipermovilidad')?.preguntas || []).map(q => q.id);
const URG = ['hm_v_dolor', 'hm_v_ojo', 'hm_v_aire'];
const SOSP = ['hm_s_familia', 'hm_s_rotura', 'hm_s_neumo', 'hm_s_piel', 'hm_s_varices'];

test('sistema común: la misma instancia en las 7 regiones, oculto sin la tarjeta activa', () => {
  for (const r of VALID_REGIONS) {
    assert.ok(SYSTEMIC_SCREENING[r].sistemas.includes(SIS_HIPERMOVILIDAD), r);
    withState({ region: r, ...hm() }, () => assert.ok(!sistemasActivos().some(s => s.soloHipermovilidad), `${r}: sin estado no se ve`));
  }
});

test('qué preguntas se ven según el estado y el subtipo', () => {
  withState({ ...hm({ estado: 'sospecha' }) }, () => assert.deepEqual(idsVisibles(), [...URG, ...SOSP]));
  withState({ ...hm({ estado: 'diagnosticada', subtipo: 'vascular' }) }, () => assert.deepEqual(idsVisibles(), URG));
  withState({ ...hm({ estado: 'diagnosticada', subtipo: 'hipermovil' }) }, () => {
    assert.deepEqual(idsVisibles(), []);
    const sis = sistemasActivos().find(s => s.soloHipermovilidad);
    assert.deepEqual(sis.banderasRojas, [], 'sin urgencias visibles, tampoco sus banderas');
  });
  for (const st of ['otro', 'ns', '']) {
    withState({ ...hm({ estado: 'diagnosticada', subtipo: st }) }, () => assert.deepEqual(idsVisibles(), SOSP, `subtipo «${st}»`));
  }
});

test('urgencias: las tres llevan `urgencia`, se pintan sin plegar (sq2-urg) y van a `ur`', () => {
  assert.deepEqual(SIS_HIPERMOVILIDAD.preguntas.filter(q => q.urgencia).map(q => q.id), URG);
  withState({ ...hm({ estado: 'sospecha' }) }, () => {
    const html = buildSistemaHTML(sistemasActivos().find(s => s.soloHipermovilidad));
    URG.forEach(id => assert.match(html, new RegExp(`class="sq2[^"]*sq2-urg[^"]*" id="sq2_${id}"`), id));
    assert.ok(!html.includes('data-embudo='), 'sin embudo');
    assert.ok(html.includes('data-hm-bloque') && html.includes('data-hm-vascular'));
  });
  withState({ ...hm({ estado: 'sospecha' }), sistemicoAnswers: { hm_v_ojo: 'SI' } }, () => {
    assert.deepEqual(buildPhysiQPayload().ur, [SIS_HIPERMOVILIDAD.preguntas[1].urgencia]);
  });
  withState({ ...hm(), sistemicoAnswers: { hm_v_ojo: 'SI' } }, () => {
    assert.deepEqual(buildPhysiQPayload().ur, [], 'sin la tarjeta activa, una respuesta guardada no cuenta');
  });
});

test('Beighton: suma de las 9 casillas y corte por edad de Malfait 2017 (6 / 5 / 4)', () => {
  assert.equal(HMX.casillasBeighton().length, 9);
  assert.equal(HMX.puntosBeighton({ beighton: null }), null);
  assert.equal(HMX.puntosBeighton({ beighton: {} }), 0);
  assert.equal(HMX.puntosBeighton({ beighton: { menique_d: true, menique_i: true, tronco: true } }), 3);
  assert.equal(HMX.corteBeighton(null), null);
  assert.equal(HMX.corteBeighton(12).corte, 6);
  assert.equal(HMX.corteBeighton(17).corte, 6);
  assert.equal(HMX.corteBeighton(18).corte, 5);
  assert.equal(HMX.corteBeighton(50).corte, 5);
  assert.equal(HMX.corteBeighton(51).corte, 4);
});

test('hipermovilidad generalizada: ≥ corte, o un punto por debajo con el cuestionario positivo', () => {
  const b = n => Object.fromEntries(HMX.casillasBeighton().slice(0, n).map(k => [k, true]));
  const si2 = { cq1: 'SI', cq2: 'SI' };
  assert.equal(HMX.resultadoHAG({ beighton: null, cuestionario: {} }, 30).estado, 'sin-beighton');
  assert.equal(HMX.resultadoHAG({ beighton: b(6), cuestionario: {} }, null).estado, 'sin-edad');
  assert.equal(HMX.resultadoHAG({ beighton: b(5), cuestionario: {} }, 30).estado, 'hag');
  assert.equal(HMX.resultadoHAG({ beighton: b(4), cuestionario: {} }, 30).estado, 'no-hag');
  const r = HMX.resultadoHAG({ beighton: b(4), cuestionario: si2 }, 30);
  assert.equal(r.estado, 'hag'); assert.ok(r.porCuestionario);
  assert.equal(HMX.resultadoHAG({ beighton: b(3), cuestionario: si2 }, 30).estado, 'no-hag', 'dos por debajo no');
  assert.equal(HMX.resultadoHAG({ beighton: b(4), cuestionario: { cq1: 'SI' } }, 30).estado, 'no-hag', 'un «sí» no basta');
});

test('sospecha del subtipo vascular: un «sí» mayor o dos «sí» derivan; un menor solo, no', () => {
  const s = HMX.hipermovilidadVacia(); s.estado = 'sospecha';
  assert.equal(HMX.reglaVascular(s, { hm_s_familia: 'SI' }).derivar, true);
  assert.equal(HMX.reglaVascular(s, { hm_s_rotura: 'SI' }).derivar, true);
  assert.equal(HMX.reglaVascular(s, { hm_s_neumo: 'SI' }).derivar, false);
  assert.equal(HMX.reglaVascular(s, { hm_s_neumo: 'SI', hm_s_varices: 'SI' }).derivar, true);
  assert.equal(HMX.reglaVascular({ estado: 'diagnosticada', subtipo: 'vascular' }, { hm_s_familia: 'SI' }), null, 'ya diagnosticada vascular: no se pregunta');
  assert.deepEqual(SIS_HIPERMOVILIDAD.preguntas.filter(q => q.hmPeso === 'mayor').map(q => q.id), ['hm_s_familia', 'hm_s_rotura']);
});

test('payload `hm`: solo con la tarjeta activa; con sus datos', () => {
  withState({ ...hm() }, () => assert.ok(!('hm' in buildPhysiQPayload()), 'sin estado, el payload no cambia'));
  const b6 = Object.fromEntries(HMX.casillasBeighton().slice(0, 6).map(k => [k, true]));
  withState({ ...hm({ estado: 'sospecha', beighton: b6, cuestionario: { cq1: 'SI', cq2: 'NO' } }), edadPaciente: 30,
    sistemicoAnswers: { hm_s_neumo: 'SI', hm_s_piel: 'SI' } }, () => {
    assert.deepEqual(buildPhysiQPayload().hm, { es: 'sospecha', st: '', bt: 6, co: 5, cu: 1, hag: true, vs: true });
  });
  withState({ ...hm({ estado: 'diagnosticada' }) }, () => {
    assert.deepEqual(buildPhysiQPayload().hm, { es: 'diagnosticada', st: 'ns', bt: null, co: null, cu: null, hag: null, vs: false });
  });
});

test('📋 Notas, 📄 Informe e informe con IA', () => {
  const b6 = Object.fromEntries(HMX.casillasBeighton().slice(0, 6).map(k => [k, true]));
  withState({ ...hm({ estado: 'sospecha', beighton: b6 }), edadPaciente: 30 }, () => {
    const n = buildContextSummaryText(), i = buildInformeFisioterapiaText();
    assert.match(n, /🧬 HIPERMOVILIDAD: sospecha · Beighton 6\/9 \(corte 5\) · hipermovilidad generalizada/);
    assert.match(i, /HIPERMOVILIDAD ARTICULAR\n  · Hipermovilidad articular generalizada en la exploración: se recomienda valoración por reumatología\./);
    assert.ok(!/Ehlers/i.test(i), 'con la sospecha, el informe no nombra el Ehlers-Danlos');
    const ctx = IN.contextoValoracion(buildPhysiQPayload());
    assert.ok(ctx.includes('Hipermovilidad (condición especial marcada por el fisioterapeuta):'));
    assert.ok(ctx.includes('no escribas que el paciente tiene un síndrome de Ehlers-Danlos'));
    assert.ok(!/Engelbert|Byers|Malfait/.test(ctx), 'el prompt no lleva las fuentes (el informe no debe nombrarlas)');
  });
  withState({ ...hm({ estado: 'diagnosticada', subtipo: 'vascular' }) }, () => {
    assert.ok(IN.contextoValoracion(buildPhysiQPayload()).includes('ejercicio isométrico'), 'línea del subtipo vascular');
  });
  withState({ ...hm({ estado: 'diagnosticada', subtipo: 'ns' }) }, () => {
    assert.ok(!IN.contextoValoracion(buildPhysiQPayload()).includes('ejercicio isométrico'), 'sin saber el subtipo, no se restringe el ejercicio');
  });
  withState({ ...hm() }, () => {
    assert.ok(!buildContextSummaryText().includes('HIPERMOVILIDAD'));
    assert.ok(!buildInformeFisioterapiaText().includes('HIPERMOVILIDAD'));
  });
});

test('tests de laxitud: la lista acordada (16) y el aviso solo con la tarjeta activa', () => {
  const lista = Object.values(HYPOTHESES).flatMap(h => h.tests.map((t, i) => t.laxitud ? `${h.id}:${i}` : null)).filter(Boolean);
  assert.deepEqual(lista, ['h4:6', 'ca12:0', 'ro4:0', 'ro4:1', 'ro4:2', 'ro9:0', 'ro10:1', 'ro10:4', 'co4:4', 'co5:0', 'co5:4', 'co15:1',
    'tp1:3', 'tp21:1', 'tp21:2', 'tp22:1']);
  const aviso = HMX.HM.textos.laxitud;
  withState({ ...hm({ estado: 'sospecha' }), region: 'rodilla' }, () => {
    assert.ok(buildTestItem('ro4', HYPOTHESES.ro4.tests[0], 0).includes(aviso), 'Lachman con aviso');
    assert.ok(!buildTestItem('ro4', HYPOTHESES.ro4.tests[4], 4).includes(aviso), 'prueba compuesta sin aviso');
    assert.ok(!JSON.stringify(buildPhysiQPayload()).includes(aviso.slice(0, 30)));
    assert.ok(!buildContextSummaryText().includes(aviso.slice(0, 30)));
  });
  withState({ ...hm(), region: 'rodilla' }, () => {
    assert.ok(!buildTestItem('ro4', HYPOTHESES.ro4.tests[0], 0).includes(aviso), 'sin la tarjeta, sin aviso');
  });
});

test('modo breve: Beighton sin hacer con la sospecha es un pendiente; el sistema no tiene embudo', () => {
  withState({ ...hm({ estado: 'sospecha' }), modo: 'breve', region: 'lumbar' }, () => {
    const t = getPendientesBreve().map(p => p.texto);
    assert.ok(t.includes('Escala de Beighton sin hacer (sospecha de hipermovilidad)'));
    assert.ok(!t.some(x => x.includes('Hipermovilidad')), 'no sale como sistema sin cribar');
  });
  withState({ ...hm({ estado: 'sospecha', beighton: {} }), modo: 'breve', region: 'lumbar' }, () => {
    assert.ok(!getPendientesBreve().some(p => p.texto.startsWith('Escala de Beighton')));
  });
});

test('normalizar: sesiones anteriores y valores raros', () => {
  assert.deepEqual(HMX.normalizarHipermovilidad(undefined), HMX.hipermovilidadVacia());
  assert.deepEqual(HMX.normalizarHipermovilidad({ estado: 'otra', subtipo: 'x', beighton: 3 }), HMX.hipermovilidadVacia());
});

test('se despliega: lib/hipermovilidad.js en deploy-to-hub.yml', () => {
  assert.ok(leer('.github', 'workflows', 'deploy-to-hub.yml').includes('lib/hipermovilidad.js'));
});
