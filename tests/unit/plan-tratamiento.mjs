// Fase 6 «Plan de tratamiento», parte sin IA (lib/plan-tratamiento.js,
// data/plan-tratamiento.js, plan.js; docs/plan-tratamiento.md). Se ejecuta
// desde tests/unit.js.
import { assert, leer, test, state, withState, buildPhysiQPayload, buildContextSummaryText, buildInformeFisioterapiaText, DOSIS_DERIVAR, HYPOTHESES } from './comun.mjs';
const P = await import('../../lib/plan-tratamiento.js');
const D = await import('../../data/plan-tratamiento.js');
const { REFERENCIAS } = await import('../../data/referencias.js');
const { PHASE_DEFS, PHASE_NAV_IDS } = await import('../../data.js');
const { leerImportacion } = await import('../../lib/valoracion-json.js');
const PLAN = await import('../../plan.js');

console.log('\nplan de tratamiento (fase 6)');

const MATRIZ = (reposo, movimiento, tolerancia) => ({ dolor: 'Baja (≤3/10)', discapacidad: 'Mínima', reposo, movimiento, tolerancia });

test('plan: gravedad por NRS con los cortes de SINSS (0–3, 4–7, 8–10); sin NRS, null', () => {
  assert.deepEqual([0, 3, 4, 7, 8, 10].map(P.gravedadSINSS), ['minima', 'minima', 'moderada', 'moderada', 'maxima', 'maxima']);
  assert.equal(P.gravedadSINSS(null), null);
  assert.equal(P.gravedadSINSS(''), null);
});

test('plan: irritabilidad solo con reposo, movimiento y tolerancia (0–2 baja, 3–5 moderada, 6 alta); directa o incompleta = estimada', () => {
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') }), { nivel: 'baja', estimada: false });
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidad: MATRIZ('Intermitente', 'Al final del rango', 'Alta') }), { nivel: 'baja', estimada: false });
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidad: MATRIZ('Intermitente', 'Al final del rango', 'Moderada') }), { nivel: 'moderada', estimada: false });
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidad: MATRIZ('Presente', 'Antes del final del rango', 'Moderada') }), { nivel: 'moderada', estimada: false });
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidad: MATRIZ('Presente', 'Antes del final del rango', 'Baja') }), { nivel: 'alta', estimada: false });
  // El dolor y la discapacidad de la matriz (gravedad) no cuentan
  assert.equal(P.irritabilidadSINSS({ irritabilidad: { ...MATRIZ('Ausente', 'Al final del rango con SP', 'Alta'), dolor: 'Alta (≥7/10)', discapacidad: 'Alta' } }).nivel, 'baja');
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidadDirecta: true, irritabilidadNivel: 'Alta', irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') }), { nivel: 'alta', estimada: true });
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidadNivel: 'Moderada', irritabilidad: {} }), { nivel: 'moderada', estimada: true });
});

test('plan: escalón de B por gravedad × irritabilidad; sin gravedad, la máxima', () => {
  const tabla = {
    'alta|maxima': 1, 'alta|moderada': 1, 'alta|minima': 2,
    'moderada|maxima': 2, 'moderada|moderada': 2, 'moderada|minima': 2,
    'baja|maxima': 3, 'baja|moderada': 3, 'baja|minima': 4,
  };
  for (const [k, v] of Object.entries(tabla)) {
    const [irr, grav] = k.split('|');
    assert.equal(P.escalonB(grav, irr), v, k);
  }
  assert.equal(P.escalonB(null, 'baja'), 3);
  assert.equal(P.escalonB(null, 'alta'), 1);
});

test('plan: C solo con irritabilidad baja y síntomas que no empeoran; A nunca baja de 1', () => {
  assert.deepEqual(P.niveles({ gravedad: 'moderada', irritabilidad: 'baja', estabilidad: 'Estable' }), { A: 2, B: 3, C: 4, sinC: null, aIgual: false });
  const alta = P.niveles({ gravedad: 'maxima', irritabilidad: 'alta' });
  assert.equal(alta.A, 1); assert.equal(alta.B, 1); assert.equal(alta.C, null); assert.ok(alta.aIgual);
  assert.equal(alta.sinC, D.TEXTO_NIVELES.sinC.irritabilidad);
  assert.equal(P.niveles({ gravedad: 'moderada', irritabilidad: 'baja', estabilidad: 'Empeora' }).sinC, D.TEXTO_NIVELES.sinC.estabilidad);
  assert.equal(P.niveles({ gravedad: 'minima', irritabilidad: 'baja' }).sinC, D.TEXTO_NIVELES.sinC.tope);
});

test('plan: urgencias y derivaciones del árbol bloquean el plan, y los textos lo dicen', () => {
  const plan = P.construirPlan({ urgencias: ['Cauda equina'], derivaciones: ['Claudicación vascular'], hipotesis: [], elegidas: [] });
  assert.ok(plan.bloqueado);
  assert.deepEqual(plan.bloqueos.map(b => b.tipo), ['urgencia', 'derivacion']);
  const e = { paciente: 'P', regionTexto: 'Lumbar', fecha: '1/1/2026' };
  assert.match(P.textoPlanSesion(plan, e), /Cauda equina[\s\S]*Sin plan de tratamiento/);
  assert.match(P.textoPlanMes(plan, e), /Claudicación vascular/);
  assert.match(P.textoDomiciliario(plan, e), /valoración médica/);
});

test('plan: no se planifica una hipótesis «Derivar» sin tratar ni una ya tratada; por defecto, la posquirúrgica o la primera elegible', () => {
  const hs = [
    { id: 'a', derivar: true, tratada: false },
    { id: 'b', derivar: false, tratada: true },
    { id: 'c', derivar: false, tratada: false },
  ];
  assert.equal(P.elegible(hs[0]).ok, false);
  assert.equal(P.elegible(hs[1]).ok, false);
  assert.equal(P.hipotesisPorDefecto(hs), 'c');
  assert.equal(P.hipotesisPorDefecto([...hs, { id: 'pq1', posq: true }]), 'pq1');
  // Elegir una no elegible no la mete en el plan
  assert.deepEqual(P.construirPlan({ hipotesis: hs, elegidas: ['a', 'c'] }).hipotesis.map(h => h.id), ['c']);
});

test('plan: reevaluación con exploración neurológica si es radicular; «D más 1» en las siguientes; aviso de la primera sesión', () => {
  const hip = { id: 'lu3', name: 'Dolor Radicular Lumbar', pauta: 'Pauta.', derivar: false, tratada: false };
  const base = { hipotesis: [hip], elegidas: ['lu3'], severidad: 9, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') };
  const p1 = P.construirPlan({ ...base, sesion: 'primera' });
  assert.ok(p1.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionRadicular));
  assert.ok(!p1.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionSiguiente));
  assert.ok(p1.sesion.educacion.includes(D.TEXTOS_SESION.educacionPrimera));
  assert.equal(p1.sesion.notaPrimera, D.TEXTOS_SESION.primeraSesion);
  assert.ok(p1.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA), 'radicular con gravedad máxima: 7–10 días');
  const p2 = P.construirPlan({ ...base, sesion: 'siguiente', severidad: 5 });
  assert.ok(p2.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionSiguiente));
  assert.equal(p2.sesion.notaPrimera, '');
  assert.ok(!p2.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA));
  const noRad = P.construirPlan({ ...base, hipotesis: [{ ...hip, name: 'Dolor Lumbar Facetario' }] });
  assert.ok(!noRad.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionRadicular));
});

test('plan: sin pauta, «a criterio del fisioterapeuta»; sin NRS, aviso y gravedad prudente; miedo = aviso, no bloquea C', () => {
  const hs = [{ id: 'x', name: 'X', pauta: '', derivar: false, tratada: false }];
  const p = P.construirPlan({ hipotesis: hs, elegidas: ['x'], severidad: null, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta'), psico_miedo: 'Sí' });
  assert.ok(p.sesion.intervencion[0].sinPauta);
  assert.match(P.textoPlanSesion(p, {}), /pauta a criterio del fisioterapeuta/);
  assert.ok(p.avisos.includes(D.AVISOS.sinNRS));
  assert.ok(p.avisos.includes(D.AVISOS.miedo));
  assert.equal(p.niveles.C, 4, 'irritabilidad baja: C existe aunque haya miedo');
});

test('plan: cada escalón y cada regla cita fuentes del registro; FUENTES_PLAN está registrada', () => {
  for (const k of D.FUENTES_PLAN) assert.ok(REFERENCIAS[k], `«${k}» no está en data/referencias.js`);
  for (const [n, e] of Object.entries(D.ESCALONES)) {
    assert.ok(e.citas.length && e.citas.every(c => D.FUENTES_PLAN.some(k => c.startsWith(k))), `escalón ${n}`);
  }
  for (const r of [...D.REGLAS_MES, D.REGLA_RADICULAR_SEVERA, D.PROGRESION_GENERICA]) {
    assert.ok(D.FUENTES_PLAN.some(k => r.includes(k)), `regla sin fuente: ${r.slice(0, 50)}`);
  }
});

test('plan: el programa para casa va en lenguaje llano (sin escalones, grados, puntuaciones ni fuentes)', () => {
  const hs = [{ id: 'x', name: 'Dolor Radicular Lumbar', pauta: 'Pauta técnica.', pautaFuente: 'NICE NG59', derivar: false, tratada: false }];
  const p = P.construirPlan({ hipotesis: hs, elegidas: ['x'], severidad: 5, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') });
  const t = P.textoDomiciliario(p, { paciente: 'Ana' }, { ejercicios: 'Caminar 10 minutos', planNotes: { variableControl: 'Parar si hormiguea' } });
  assert.match(t, /Caminar 10 minutos/);
  assert.match(t, /Parar si hormiguea/);
  for (const prohibido of [...D.FUENTES_PLAN, 'NICE', 'grado', 'Nivel', 'LR', 'Pauta técnica', 'Radicular']) assert.ok(!t.includes(prohibido), prohibido);
});

test('plan: navegación con fase 6 opcional (PHASE_DEFS, nav, contenedor) y la importación la acepta', () => {
  assert.deepEqual(PHASE_DEFS.map(d => d.n), [1, 2, 3, 4, '4b', 5, 6]);
  assert.equal(PHASE_NAV_IDS[6], 'nav6');
  const html = leer('index.html');
  assert.match(html, /id="nav6"/);
  assert.match(html, /id="phase6"/);
  assert.match(html, /id="btnIrPlan"/);
  const archivo = st => JSON.stringify({ app: 'physiq-assessment', tipo: 'valoracion', version: 1, assessmentState: st });
  assert.ok(leerImportacion(archivo({ maxVisitedIdx: 6, currentPhase: 6, region: 'lumbar' })).ok);
});

test('plan: a physiq-report se le anuncia como mucho la fase 5 (la 6 no es parte de la valoración)', () => {
  const app = leer('app.js');
  assert.match(app, /const _faseAnunciada = \(\) => _FASES\[Math\.min\(state\.maxVisitedIdx, _idxFase\(5\)\)\];/);
  assert.ok(!/_phaseLabels/.test(app), 'quedan listas de fases a mano');
});

test('plan: con estado lumbar real, la pauta sale de la hipótesis y una «Derivar» no es elegible', () => {
  const derivar = Object.values(HYPOTHESES).find(h => h.dosis === DOSIS_DERIVAR);
  withState({ region: 'lumbar', activeHypotheses: ['lu3', derivar.id], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    const { plan, hs } = PLAN.planActual();
    assert.deepEqual(state.planTratamiento.hipotesis, ['lu3']);
    assert.equal(plan.sesion.intervencion[0].pauta, HYPOTHESES.lu3.dosis);
    assert.equal(P.elegible(hs.find(h => h.id === derivar.id)).ok, false);
  });
});

test('plan: nunca entra en el payload, 📋 Notas ni 📄 Informe', () => {
  const MARCA = 'MARCA_PLAN_FASE6';
  withState({ region: 'lumbar', activeHypotheses: ['lu3'], planTratamiento: { hipotesis: ['lu3'], nivel: 'B', frecuencia: 'A', sesion: 'primera', gravedad: null, irritabilidad: null, notas: { sesion: MARCA, mes: MARCA, domiciliario: MARCA } } }, () => {
    for (const t of [JSON.stringify(buildPhysiQPayload()), buildContextSummaryText(), buildInformeFisioterapiaText()]) assert.ok(!t.includes(MARCA));
  });
  state.planTratamiento = null;
});
