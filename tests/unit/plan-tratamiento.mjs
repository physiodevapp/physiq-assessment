// Fase 6 «Plan de tratamiento», parte sin IA (lib/plan-tratamiento.js,
// data/plan-tratamiento.js, plan.js; docs/plan-tratamiento.md). Se ejecuta
// desde tests/unit.js.
import { assert, leer, test, state, withState, buildPhysiQPayload, buildContextSummaryText, buildInformeFisioterapiaText, DOSIS_DERIVAR, HYPOTHESES } from './comun.mjs';
const P = await import('../../lib/plan-tratamiento.js');
const D = await import('../../data/plan-tratamiento.js');
const await_posq = await import('../../lib/posquirurgico.js');
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

test('plan: irritabilidad solo con reposo, movimiento y tolerancia (0–1 baja, 2–4 moderada, 5–6 alta); directa o incompleta = estimada', () => {
  const niv = (...a) => P.irritabilidadSINSS({ irritabilidad: MATRIZ(...a) }).nivel;
  assert.equal(niv('Ausente', 'Al final del rango con SP', 'Alta'), 'baja');           // 0
  assert.equal(niv('Intermitente', 'Al final del rango con SP', 'Alta'), 'baja');      // 1
  assert.equal(niv('Intermitente', 'Al final del rango', 'Alta'), 'moderada');         // 2
  assert.equal(niv('Presente', 'Antes del final del rango', 'Alta'), 'moderada');      // 4
  assert.equal(niv('Presente', 'Antes del final del rango', 'Moderada'), 'alta');      // 5: dos al máximo y uno intermedio
  assert.equal(niv('Presente', 'Antes del final del rango', 'Baja'), 'alta');          // 6
  assert.equal(P.irritabilidadSINSS({ irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') }).estimada, false);
  // El dolor y la discapacidad de la matriz (gravedad) no cuentan
  assert.equal(P.irritabilidadSINSS({ irritabilidad: { ...MATRIZ('Ausente', 'Al final del rango con SP', 'Alta'), dolor: 'Alta (≥7/10)', discapacidad: 'Alta' } }).nivel, 'baja');
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidadDirecta: true, irritabilidadNivel: 'Alta', irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') }), { nivel: 'alta', estimada: true, fase3: 'alta' });
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidadNivel: 'Moderada', irritabilidad: {} }), { nivel: 'moderada', estimada: true, fase3: 'moderada' });
});

test('plan: si el nivel de la fase 3 (matriz entera) difiere del de la fase 6, se muestran los dos', () => {
  const hs = [{ id: 'x', name: 'X', pauta: 'P.', derivar: false, tratada: false }];
  const base = { hipotesis: hs, elegidas: ['x'], severidad: 5, irritabilidad: MATRIZ('Presente', 'Antes del final del rango', 'Moderada') };
  assert.equal(P.construirPlan({ ...base, irritabilidadNivel: 'Moderada' }).irritabilidadFase3, 'moderada');
  assert.equal(P.construirPlan({ ...base, irritabilidadNivel: 'Alta' }).irritabilidadFase3, null);
  assert.equal(P.construirPlan({ ...base, irritabilidadDirecta: true, irritabilidadNivel: 'Baja' }).irritabilidadFase3, null, 'estimada: no hay dos cálculos');
  assert.match(leer('plan.js'), /AVISOS\.difiereFase3/);
});

test('plan: escalón de B por gravedad × irritabilidad; alta siempre 1; B nunca 4; sin gravedad, la máxima', () => {
  const tabla = {
    'alta|maxima': 1, 'alta|moderada': 1, 'alta|minima': 1,
    'moderada|maxima': 1, 'moderada|moderada': 2, 'moderada|minima': 2,
    'baja|maxima': 3, 'baja|moderada': 3, 'baja|minima': 3,
  };
  for (const [k, v] of Object.entries(tabla)) {
    const [irr, grav] = k.split('|');
    assert.equal(P.escalonB(grav, irr), v, k);
  }
  assert.equal(P.escalonB(null, 'baja'), 3);
  assert.equal(P.escalonB(null, 'moderada'), 1);
  assert.equal(P.escalonB(null, 'alta'), 1);
});

test('plan: C solo con irritabilidad baja y síntomas que no empeoran; el escalón 4 solo como C; A nunca baja de 1', () => {
  assert.deepEqual(P.niveles({ gravedad: 'moderada', irritabilidad: 'baja', estabilidad: 'Estable' }), { A: 2, B: 3, C: 4, sinC: null, aIgual: false });
  assert.equal(P.niveles({ gravedad: 'minima', irritabilidad: 'baja' }).C, 4);
  const alta = P.niveles({ gravedad: 'minima', irritabilidad: 'alta' });
  assert.equal(alta.A, 1); assert.equal(alta.B, 1); assert.equal(alta.C, null); assert.ok(alta.aIgual);
  assert.equal(alta.sinC, D.TEXTO_NIVELES.sinC.irritabilidad);
  assert.equal(P.niveles({ gravedad: 'moderada', irritabilidad: 'baja', estabilidad: 'Empeora' }).sinC, D.TEXTO_NIVELES.sinC.estabilidad);
  for (const g of P.NIVELES_GRAVEDAD) for (const i of P.NIVELES_IRRITABILIDAD) assert.ok(P.niveles({ gravedad: g, irritabilidad: i }).B < 4, `${g}|${i}`);
});

test('plan: urgencias y derivaciones del árbol bloquean el plan, y los textos lo dicen', () => {
  const plan = P.construirPlan({ urgencias: ['Cauda equina'], derivaciones: ['Claudicación vascular'], hipotesis: [], elegidas: [] });
  assert.ok(plan.bloqueado);
  assert.deepEqual(plan.bloqueos.map(b => b.tipo), ['urgencia', 'derivacion']);
  const e = { paciente: 'P', regionTexto: 'Lumbar', fecha: '1/1/2026' };
  assert.match(P.textoPlanSesion(plan, e), /Cauda equina[\s\S]*Sin plan de tratamiento/);
  assert.match(P.textoPlanMes(plan, e), /Claudicación vascular/);
  assert.equal(P.textoDomiciliario(plan, e), '', 'con el plan bloqueado no hay programa para casa');
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

test('plan: exploración neurológica por id (lu3, lu4, lu5), nunca por el nombre; «D más 1» en las siguientes; aviso de la primera sesión', () => {
  const hip = { id: 'lu3', name: 'Dolor Radicular Lumbar', pauta: 'Pauta.', derivar: false, tratada: false };
  const base = { hipotesis: [hip], elegidas: ['lu3'], severidad: 9, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') };
  const p1 = P.construirPlan({ ...base, sesion: 'primera' });
  assert.ok(p1.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionRadicular));
  assert.ok(!p1.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionSiguiente));
  assert.ok(p1.sesion.educacion.includes(D.TEXTOS_SESION.educacionPrimera));
  assert.equal(p1.sesion.notaPrimera, D.TEXTOS_SESION.primeraSesion);
  const p2 = P.construirPlan({ ...base, sesion: 'siguiente', severidad: 5 });
  assert.ok(p2.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionSiguiente));
  assert.equal(p2.sesion.notaPrimera, '');
  // El nombre no cuenta: otro id con nombre radicular no la pide; lu3 renombrada sí
  const otro = P.construirPlan({ ...base, hipotesis: [{ ...hip, id: 'zz' }], elegidas: ['zz'] });
  assert.ok(!otro.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionRadicular));
  const renombrada = P.construirPlan({ ...base, hipotesis: [{ ...hip, name: 'Otro nombre' }] });
  assert.ok(renombrada.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionRadicular));
  // La estenosis pide exploración neurológica, pero no la regla de los 7–10 días
  const esten = P.construirPlan({ ...base, hipotesis: [{ ...hip, id: 'lu4', name: 'Estenosis' }], elegidas: ['lu4'] });
  assert.ok(esten.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionRadicular));
  assert.ok(!esten.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA));
});

test('plan: regla de los 7–10 días solo con radicular y NRS registrado de 8 o más (no con la gravedad prudente sin NRS ni la elegida a mano)', () => {
  const hip = { id: 'lu5', name: 'Radiculopatía', pauta: 'P.', derivar: false, tratada: false };
  const base = { hipotesis: [hip], elegidas: ['lu5'], irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') };
  assert.ok(P.construirPlan({ ...base, severidad: 8 }).mes.reglas.includes(D.REGLA_RADICULAR_SEVERA));
  assert.ok(!P.construirPlan({ ...base, severidad: 7 }).mes.reglas.includes(D.REGLA_RADICULAR_SEVERA));
  const sinNRS = P.construirPlan({ ...base, severidad: null });
  assert.equal(sinNRS.gravedad, null);
  assert.ok(!sinNRS.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA));
  assert.ok(!P.construirPlan({ ...base, severidad: 5, gravedadManual: 'maxima' }).mes.reglas.includes(D.REGLA_RADICULAR_SEVERA));
});

test('plan: en las regiones del plan, toda hipótesis de nombre neurológico está en las listas por id o descartada con motivo', () => {
  const listadas = new Set([...D.HIP_EXPLORACION_NEURO, ...Object.keys(D.HIP_NEURO_DESCARTADAS)]);
  for (const id of D.HIP_RADICULARES) assert.ok(D.HIP_EXPLORACION_NEURO.includes(id), `${id}: radicular sin exploración neurológica`);
  for (const id of listadas) assert.ok(HYPOTHESES[id], `${id} no existe`);
  for (const h of Object.values(HYPOTHESES)) {
    if (!D.REGIONES_PLAN.includes(h.region)) continue;
    if (/radicul|estenosis|neuro/i.test(h.name)) assert.ok(listadas.has(h.id), `${h.id} «${h.name}»: añádela a HIP_EXPLORACION_NEURO o a HIP_NEURO_DESCARTADAS`);
  }
  for (const [id, motivo] of Object.entries(D.HIP_NEURO_DESCARTADAS)) assert.ok(String(motivo).trim(), `${id} sin motivo`);
});

test('plan: bloques de la sesión editables; los rangos se recalculan y avisan si no suman 50', () => {
  assert.equal(D.BLOQUES_SESION.reduce((t, b) => t + b.duracion, 0), D.MINUTOS_SESION);
  const def = P.rangosBloques();
  assert.deepEqual(def.bloques.map(b => b.minutos), ['0–5', '5–12', '12–35', '35–45', '45–50']);
  assert.ok(def.cuadra);
  const r = P.rangosBloques({ intervencion: '20', educacion: '', cierre: 'x' });
  assert.deepEqual(r.bloques.map(b => b.minutos), ['0–5', '5–12', '12–32', '32–42', '42–47']);
  assert.equal(r.total, 47); assert.ok(!r.cuadra);
  const hs = [{ id: 'x', name: 'X', pauta: 'P.', derivar: false, tratada: false }];
  const t = P.textoPlanSesion(P.construirPlan({ hipotesis: hs, elegidas: ['x'], severidad: 5, duraciones: { intervencion: 20 } }), {});
  assert.match(t, /INTERVENCIÓN PRINCIPAL \(12–32 min\)/);
  assert.match(t, /suman 47 min, no 50/);
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
  const t = P.textoDomiciliario(p, { paciente: 'Ana' }, { ejercicios: 'Caminar 10 minutos', parar: 'Parar si hormiguea' });
  assert.match(t, /Caminar 10 minutos/);
  assert.match(t, /Cuándo parar:\nParar si hormiguea/);
  for (const prohibido of [...D.FUENTES_PLAN, 'NICE', 'grado', 'Nivel', 'LR', 'Pauta técnica', 'Radicular']) assert.ok(!t.includes(prohibido), prohibido);
  // Todos los textos fijos vienen de TEXTOS_CASA
  for (const linea of t.split('\n').filter(Boolean)) {
    if (['Ana', 'Caminar 10 minutos', 'Parar si hormiguea'].includes(linea)) continue;
    assert.ok(Object.values(D.TEXTOS_CASA).some(v => v.texto === linea), `texto fuera de TEXTOS_CASA: ${linea}`);
  }
});

test('plan: «cuándo parar» del plan; si no, la variable de control de la fase 5; lo que falte no sale y compartir pide confirmación', () => {
  const p = P.construirPlan({ hipotesis: [], elegidas: [] });
  assert.equal(P.cuandoParar({ parar: ' Si duele ' }, { variableControl: 'VC' }), 'Si duele');
  assert.equal(P.cuandoParar({ parar: '' }, { variableControl: 'VC' }), 'VC');
  assert.equal(P.cuandoParar({}, {}), '');
  assert.match(P.textoDomiciliario(p, {}, { planNotes: { variableControl: 'VC' } }), /Cuándo parar:\nVC/);
  const sin = P.textoDomiciliario(p, {}, {});
  for (const k of ['queHacer', 'cuandoParar']) assert.ok(!sin.includes(D.TEXTOS_CASA[k].texto), k);
  assert.ok(!/te indicará/.test(sin), 'sin rellenos que prometen algo');
  assert.deepEqual(P.faltaEnCasa({}, {}), ['qué hacer', 'cuándo parar']);
  assert.deepEqual(P.faltaEnCasa({ domiciliario: 'X' }, { variableControl: 'VC' }), []);
  assert.deepEqual(P.faltaEnCasa({ domiciliario: ' ' }, { variableControl: 'VC' }), ['qué hacer']);
  assert.match(leer('plan.js'), /showConfirmBanner\('Programa incompleto'/);
});

test('plan: con una hipótesis neurológica, red de seguridad en el cierre y al final del programa para casa (Finucane 2020); sin ella, no', () => {
  const base = { severidad: 5, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') };
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  for (const id of D.HIP_EXPLORACION_NEURO) {
    const p = P.construirPlan({ ...base, hipotesis: [hip(id)], elegidas: [id] });
    assert.ok(p.neuro && p.sesion.cierre.includes(D.TEXTOS_SESION.cierreNeuro), id);
    const t = P.textoDomiciliario(p, {}, { ejercicios: 'X', parar: 'Y' });
    assert.ok(t.trimEnd().endsWith(D.TEXTOS_CASA.alarmaNeuro.texto), `${id}: la alarma va al final`);
  }
  const no = P.construirPlan({ ...base, hipotesis: [hip('lu1')], elegidas: ['lu1'] });
  assert.ok(!no.neuro && !no.sesion.cierre.includes(D.TEXTOS_SESION.cierreNeuro));
  assert.ok(!P.textoDomiciliario(no, {}, { ejercicios: 'X', parar: 'Y' }).includes(D.TEXTOS_CASA.alarmaNeuro.texto));
  assert.ok(D.FUENTES_PLAN.includes('Finucane 2020'));
  assert.match(D.TEXTOS_CASA.alarmaNeuro.fuente, /^Finucane 2020/);
});

test('plan: los avisos posquirúrgicos son los textos de la fase 5; sin propuesta C «por tope», que ya no puede darse', () => {
  const POSQ = await_posq;
  assert.equal(P.textoPosq(true), POSQ.TEXTO_PAUTA_COMPATIBLE);
  assert.equal(P.textoPosq(false), `${POSQ.TEXTO_SIN_PROTOCOLO}.`);
  const hs = [{ id: 'x', name: 'X', pauta: 'P.', derivar: false, tratada: false }];
  const conP = P.construirPlan({ hipotesis: hs, elegidas: ['x'], posq: { conProtocolo: true, semanas: 3 } });
  assert.ok(conP.avisosHip.includes(POSQ.TEXTO_PAUTA_COMPATIBLE));
  assert.match(P.textoPlanMes(conP, {}), new RegExp(POSQ.TEXTO_PAUTA_COMPATIBLE.slice(0, 30)));
  assert.ok(!('tope' in D.TEXTO_NIVELES.sinC));
  for (const k of ['posqProtocolo', 'posqSinProtocolo']) assert.ok(!(k in D.AVISOS), k);
  assert.ok(!/Maitland no trata/.test(D.AVISOS.soloTerapiaManual));
});

test('plan: TIPO_TEXTO solo nombra textos que existen y decisiones o principios del documento de diseño', () => {
  const diseno = leer('docs', 'plan-tratamiento.md');
  for (const [clave, tipo] of Object.entries(D.TIPO_TEXTO)) {
    const [obj, ...ruta] = clave.split('.');
    assert.equal(typeof ruta.reduce((o, k) => o?.[k], D[obj]), 'string', clave);
    const [k, n] = tipo.split(':');
    if (k === 'decision') assert.match(diseno, new RegExp(`^${n}\\. `, 'm'), `decisión ${n}`);
    else if (k === 'principio') assert.match(diseno, new RegExp(`^${n}\\. \\*\\*`, 'm'), `principio ${n}`);
    else assert.ok(['app', 'organizacion'].includes(k), tipo);
  }
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
  withState({ region: 'lumbar', activeHypotheses: ['lu3'], planTratamiento: { hipotesis: ['lu3'], nivel: 'B', frecuencia: 'A', sesion: 'primera', gravedad: null, irritabilidad: null, notas: { sesion: MARCA, mes: MARCA, domiciliario: MARCA, parar: MARCA }, duraciones: {} } }, () => {
    for (const t of [JSON.stringify(buildPhysiQPayload()), buildContextSummaryText(), buildInformeFisioterapiaText()]) assert.ok(!t.includes(MARCA));
  });
  state.planTratamiento = null;
});

const { construirFrases } = await import('../frases-plan.mjs');
test('plan: docs/plan-tratamiento-frases.md está al día con data/plan-tratamiento.js', () => {
  assert.equal(leer('docs', 'plan-tratamiento-frases.md'), construirFrases(D, P),
    'docs/plan-tratamiento-frases.md no está al día — ejecuta `node tests/gen-frases-plan.mjs` y comitéalo con el cambio');
});
