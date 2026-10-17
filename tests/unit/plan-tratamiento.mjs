// Fase 6 «Plan de tratamiento», parte sin IA (lib/plan-tratamiento.js,
// data/plan-tratamiento.js, plan.js; docs/plan-tratamiento.md). Se ejecuta
// desde tests/unit.js.
import { assert, leer, test, state, withState, buildPhysiQPayload, buildContextSummaryText, buildInformeFisioterapiaText, DOSIS_DERIVAR, HYPOTHESES, SYSTEMIC_SCREENING, VALID_REGIONS } from './comun.mjs';
const P = await import('../../lib/plan-tratamiento.js');
const D = await import('../../data/plan-tratamiento.js');
const await_posq = await import('../../lib/posquirurgico.js');
const { REFERENCIAS } = await import('../../data/referencias.js');
const { PHASE_DEFS, PHASE_NAV_IDS } = await import('../../data.js');
const { leerImportacion } = await import('../../lib/valoracion-json.js');
const PLAN = await import('../../plan.js');

console.log('\nplan de tratamiento (fase 6)');

const MATRIZ = (reposo, movimiento, tolerancia, calma = '') => ({ discapacidad: 'Mínima', reposo, movimiento, tolerancia, calma });

test('plan: gravedad por NRS con los cortes de SINSS (0–3, 4–7, 8–10); sin NRS, null', () => {
  assert.deepEqual([0, 3, 4, 7, 8, 10].map(P.gravedadSINSS), ['minima', 'minima', 'moderada', 'moderada', 'maxima', 'maxima']);
  assert.equal(P.gravedadSINSS(null), null);
  assert.equal(P.gravedadSINSS(''), null);
});

test('plan: irritabilidad con la regla de la fase 3 (lib/irritabilidad.js); directa = estimada, matriz a medias = incompleta', () => {
  const niv = (...a) => P.irritabilidadSINSS({ irritabilidad: MATRIZ(...a) }).nivel;
  // Sin el tiempo en calmarse: los cortes de la decisión 25 sobre reposo + movimiento + tolerancia
  assert.equal(niv('Ausente', 'Al final del rango con SP', 'Alta'), 'baja');           // 0
  assert.equal(niv('Intermitente', 'Al final del rango con SP', 'Alta'), 'baja');      // 1
  assert.equal(niv('Intermitente', 'Al final del rango', 'Alta'), 'moderada');         // 2
  assert.equal(niv('Presente', 'Antes del final del rango', 'Alta'), 'moderada');      // 4
  assert.equal(niv('Presente', 'Antes del final del rango', 'Moderada'), 'alta');      // 5
  assert.equal(niv('Presente', 'Antes del final del rango', 'Baja'), 'alta');          // 6
  // Con él, marca el suelo
  assert.equal(niv('Ausente', 'Al final del rango con SP', 'Alta', 'Tarda horas'), 'moderada');
  assert.equal(niv('Ausente', 'Al final del rango con SP', 'Alta', 'No cede hasta tras una noche'), 'alta');
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta', 'Cede en minutos') }), { nivel: 'baja', estimada: false, incompleta: false });
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') }), { nivel: 'baja', estimada: false, incompleta: true });
  // El dolor y la discapacidad (gravedad) no cuentan
  assert.equal(P.irritabilidadSINSS({ irritabilidad: { ...MATRIZ('Ausente', 'Al final del rango con SP', 'Alta'), dolor: 'Alta (≥7/10)', discapacidad: 'Alta' } }).nivel, 'baja');
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidadDirecta: true, irritabilidadNivel: 'Alta', irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') }), { nivel: 'alta', estimada: true, incompleta: false });
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidadNivel: 'Moderada', irritabilidad: {} }), { nivel: 'moderada', estimada: true, incompleta: false });
  assert.deepEqual(P.irritabilidadSINSS({ irritabilidad: {} }), { nivel: null, estimada: false, incompleta: true });
});

test('plan: la fase 3 y la fase 6 dan el mismo nivel (sin «en la fase 3»); matriz incompleta o sin registrar, con aviso', () => {
  const hs = [{ id: 'x', name: 'X', pauta: 'P.', derivar: false, tratada: false }];
  const base = { hipotesis: hs, elegidas: ['x'], severidad: 5 };
  const completa = P.construirPlan({ ...base, irritabilidad: MATRIZ('Presente', 'Antes del final del rango', 'Moderada', 'Cede en minutos'), irritabilidadNivel: 'Alta' });
  assert.equal(completa.irritabilidad, 'alta');
  assert.ok(!('irritabilidadFase3' in completa));
  assert.ok(!completa.avisos.includes(D.AVISOS.incompleta) && !completa.avisos.includes(D.AVISOS.sinIrritabilidad));
  const aMedias = P.construirPlan({ ...base, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta'), irritabilidadNivel: 'Baja' });
  assert.equal(aMedias.irritabilidad, 'baja');
  assert.ok(aMedias.avisos.includes(D.AVISOS.incompleta));
  const sin = P.construirPlan({ ...base, irritabilidad: MATRIZ('', '', ''), irritabilidadNivel: null });
  assert.equal(sin.irritabilidad, 'alta', 'sin irritabilidad, la prudente');
  assert.ok(sin.avisos.includes(D.AVISOS.sinIrritabilidad) && !sin.avisos.includes(D.AVISOS.incompleta));
  assert.ok(!P.construirPlan({ ...base, irritabilidad: MATRIZ('', '', ''), irritabilidadManual: 'baja' }).avisos.includes(D.AVISOS.sinIrritabilidad), 'elegida a mano: sin aviso');
  assert.equal(D.AVISOS.difiereFase3, undefined);
  assert.ok(!/difiereFase3|irritabilidadFase3/.test(leer('plan.js') + leer('lib/plan-tratamiento.js')));
  assert.match(leer('plan.js'), /AVISOS\.incompleta \|\| a === AVISOS\.sinIrritabilidad/);
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
  // A igual que B no se ofrece y C sin propuesta no existe: en los dos casos vale B
  assert.equal(P.nivelEfectivo(alta, 'A'), 'B');
  assert.equal(P.nivelEfectivo(alta, 'C'), 'B');
  assert.equal(P.nivelEfectivo(alta, 'B'), 'B');
  const baja = P.niveles({ gravedad: 'moderada', irritabilidad: 'baja', estabilidad: 'Estable' });
  assert.deepEqual(['A', 'B', 'C'].map(k => P.nivelEfectivo(baja, k)), ['A', 'B', 'C']);
  assert.match(leer('plan.js'), /k === 'A' && nv\.aIgual \? null/, 'A igual que B, deshabilitada');
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
  const listadas = new Set([...D.HIP_EXPLORACION_NEURO, ...D.HIP_NERVIO_PERIFERICO, ...Object.keys(D.HIP_NEURO_DESCARTADAS)]);
  for (const id of D.HIP_NERVIO_PERIFERICO) assert.ok(!D.HIP_EXPLORACION_NEURO.includes(id) && !D.HIP_RADICULARES.includes(id), `${id}: un nervio periférico no es radicular`);
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
  for (const [n, e] of [...Object.entries(D.ESCALONES), ...Object.entries(D.ESCALONES_PERIFERICOS)]) {
    assert.ok(e.citas.length && e.citas.every(c => D.FUENTES_PLAN.some(k => c.startsWith(k))), `escalón ${n}`);
  }
  for (const r of [...D.REGLAS_MES, ...D.REGLAS_MES_PERIFERICAS, D.REGLA_RADICULAR_SEVERA, D.PROGRESION_GENERICA, D.PROGRESION_PERIFERICA]) {
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

test('plan: con una hipótesis neurológica, la red de seguridad de su región en el cierre y al final del programa para casa; sin ella, solo la de siempre', () => {
  const base = { severidad: 5, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') };
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  for (const id of D.HIP_EXPLORACION_NEURO) {
    const region = HYPOTHESES[id].region;
    const red = D.RED_SEGURIDAD[region];
    assert.ok(red?.neuro, `${id}: su región (${region}) no tiene red de seguridad neurológica`);
    const p = P.construirPlan({ ...base, region, hipotesis: [hip(id)], elegidas: [id] });
    const esperadas = [red.neuro, ...[].concat(red.siempre || [])].filter(Boolean);
    assert.ok(p.neuro, id);
    assert.deepEqual(p.sesion.cierre, [D.TEXTOS_SESION.cierre, ...esperadas.map(x => D.TEXTOS_SESION[x.cierre])], id);
    const t = P.textoDomiciliario(p, {}, { ejercicios: 'X', parar: 'Y' });
    assert.ok(t.trimEnd().endsWith(esperadas.map(x => D.TEXTOS_CASA[x.casa].texto).join('\n\n')), `${id}: las alarmas van al final`);
  }
  const no = P.construirPlan({ ...base, region: 'lumbar', hipotesis: [hip('lu1')], elegidas: ['lu1'] });
  assert.ok(!no.neuro && !no.sesion.cierre.includes(D.TEXTOS_SESION.cierreNeuro));
  assert.ok(!P.textoDomiciliario(no, {}, { ejercicios: 'X', parar: 'Y' }).includes(D.TEXTOS_CASA.alarmaNeuro.texto));
  assert.ok(D.FUENTES_PLAN.includes('Finucane 2020'));
  assert.match(D.TEXTOS_CASA.alarmaNeuro.fuente, /^Finucane 2020/);
});

test('plan: lumbar — con un síntoma en el periné, la red de cola de caballo aunque no haya hipótesis neurológica', () => {
  const base = { region: 'lumbar', severidad: 5, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') };
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const con = P.construirPlan({ ...base, hipotesis: [hip('lu1')], elegidas: ['lu1'], redNeuroZona: true });
  assert.ok(con.sesion.cierre.includes(D.TEXTOS_SESION.cierreNeuro));
  assert.ok(P.textoDomiciliario(con, {}, { ejercicios: 'X', parar: 'Y' }).trimEnd().endsWith(D.TEXTOS_CASA.alarmaNeuro.texto));
  assert.ok(!con.neuro, 'no la vuelve hipótesis neurológica');
  assert.ok(!con.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionRadicular), 'sin la reevaluación radicular');
  // Con hipótesis neurológica y zona, una sola vez
  const ambas = P.construirPlan({ ...base, hipotesis: [hip('lu3')], elegidas: ['lu3'], redNeuroZona: true });
  assert.equal(ambas.sesion.cierre.filter(x => x === D.TEXTOS_SESION.cierreNeuro).length, 1);
  // En una región sin red neurológica no añade nada
  const hombro = P.construirPlan({ ...base, region: 'hombro', hipotesis: [hip('h2')], elegidas: ['h2'], redNeuroZona: true });
  assert.ok(!hombro.sesion.cierre.includes(D.TEXTOS_SESION.cierreNeuro));
});

test('plan: cervical — médula con ce3/ce12, arterias con cualquier hipótesis; nunca la cola de caballo; sin región, sin red', () => {
  const base = { region: 'cervical', severidad: 5, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta') };
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const casa = p => P.textoDomiciliario(p, {}, { ejercicios: 'X', parar: 'Y' });
  const ce1 = P.construirPlan({ ...base, hipotesis: [hip('ce1')], elegidas: ['ce1'] });
  assert.ok(!ce1.neuro);
  assert.deepEqual(ce1.sesion.cierre, [D.TEXTOS_SESION.cierre, D.TEXTOS_SESION.cierreArterial]);
  assert.ok(casa(ce1).trimEnd().endsWith(D.TEXTOS_CASA.alarmaArterial.texto));
  assert.ok(!casa(ce1).includes(D.TEXTOS_CASA.alarmaMedula.texto));
  for (const id of ['ce3', 'ce12']) {
    const p = P.construirPlan({ ...base, hipotesis: [hip(id)], elegidas: [id] });
    assert.ok(p.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionRadicular), id);
    assert.deepEqual(p.sesion.cierre, [D.TEXTOS_SESION.cierre, D.TEXTOS_SESION.cierreMedula, D.TEXTOS_SESION.cierreArterial], id);
    const t = casa(p);
    assert.ok(t.includes(D.TEXTOS_CASA.alarmaMedula.texto) && !t.includes(D.TEXTOS_CASA.alarmaNeuro.texto), id);
    assert.ok(!p.sesion.cierre.includes(D.TEXTOS_SESION.cierreNeuro), `${id}: la cola de caballo es lumbar`);
    assert.ok(P.construirPlan({ ...base, severidad: 9, hipotesis: [hip(id)], elegidas: [id] }).mes.reglas.includes(D.REGLA_RADICULAR_SEVERA), id);
  }
  assert.ok(!D.HIP_EXPLORACION_NEURO.includes('ce2') && D.HIP_NEURO_DESCARTADAS.ce2, 'ce2: control motor, no neurológica');
  // Sin región, o con una sin entrada (hoy, ninguna de las siete), no hay red de seguridad
  for (const region of [undefined, 'region_sin_entrada']) {
    const p = P.construirPlan({ ...base, region, hipotesis: [hip('ce3')], elegidas: ['ce3'] });
    assert.deepEqual(p.sesion.cierre, [D.TEXTOS_SESION.cierre], String(region));
    assert.deepEqual(p.alarmasCasa, []);
  }
  // Cada entrada apunta a textos que existen; toda región del plan tiene la suya
  for (const region of D.REGIONES_PLAN) assert.ok(D.RED_SEGURIDAD[region], `${region} sin RED_SEGURIDAD`);
  for (const [region, r] of Object.entries(D.RED_SEGURIDAD)) for (const [k, xs] of Object.entries(r)) for (const x of [].concat(xs)) {
    assert.ok(['neuro', 'siempre'].includes(k), `${region}.${k}`);
    assert.ok(k === 'siempre' || !Array.isArray(xs), `${region}.${k}: solo «siempre» admite una lista`);
    assert.equal(typeof D.TEXTOS_SESION[x.cierre], 'string', `${region}.${k}.cierre`);
    assert.equal(typeof D.TEXTOS_CASA[x.casa]?.texto, 'string', `${region}.${k}.casa`);
  }
});

test('plan: avisos por hipótesis por id (AVISOS_HIP): mareo con ce13, sin manipulación forzada con ce3/ce12, sin terapia manual en la aguda con ce12', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const avisos = ids => P.construirPlan({ region: 'cervical', severidad: 5, hipotesis: ids.map(hip), elegidas: ids }).avisosHip;
  for (const [id, ks] of Object.entries(D.AVISOS_HIP)) {
    assert.ok(HYPOTHESES[id], `${id} no existe`);
    assert.ok(D.REGIONES_PLAN.includes(HYPOTHESES[id].region), `${id}: región sin plan`);
    assert.ok(Array.isArray(ks) && ks.length, id);
    for (const k of ks) assert.equal(typeof D.AVISOS[k], 'string', `${id}: AVISOS.${k}`);
  }
  // ce12: su pauta aguda es sin terapia manual, y el aviso lo dice
  assert.match(HYPOTHESES.ce12.dosis, /sin terapia manual/);
  assert.ok(avisos(['ce12']).includes(D.AVISOS.sinTerapiaManualAguda));
  assert.ok(!avisos(['ce3']).includes(D.AVISOS.sinTerapiaManualAguda));
  assert.ok(avisos(['ce13']).includes(D.AVISOS.vertigo));
  assert.ok(avisos(['ce3']).includes(D.AVISOS.manipulacionCervical));
  assert.equal(avisos(['ce3', 'ce12']).filter(a => a === D.AVISOS.manipulacionCervical).length, 1, 'un aviso repetido sale una vez');
  assert.ok(!avisos(['ce1']).some(a => a === D.AVISOS.vertigo || a === D.AVISOS.manipulacionCervical));
});

test('plan: pauta con volumen propio (ce13, Reid 2014) sustituye a la cantidad genérica; con otra hipótesis sin él, salen las dos', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const cant = ids => P.construirPlan({ region: 'cervical', severidad: 5, hipotesis: ids.map(hip), elegidas: ids }).sesion.cantidad;
  assert.deepEqual(cant(['ce13']), [D.TEXTOS_SESION.cantidadReid]);
  assert.deepEqual(cant(['ce1']), [D.TEXTOS_SESION.cantidad]);
  assert.deepEqual(cant(['ce13', 'ce1']), [D.TEXTOS_SESION.cantidadReid, D.TEXTOS_SESION.cantidad]);
  assert.deepEqual(cant([]), [D.TEXTOS_SESION.cantidad]);
  // El texto repite el volumen de la pauta de ce13
  for (const frag of ['6 repeticiones', '3 aplicaciones de 30 s']) {
    assert.ok(HYPOTHESES.ce13.dosis.includes(frag) && D.TEXTOS_SESION.cantidadReid.includes(frag), frag);
  }
  for (const [id, k] of Object.entries(D.VOLUMEN_PAUTA)) { assert.ok(HYPOTHESES[id], id); assert.equal(typeof D.TEXTOS_SESION[k], 'string', k); }
  const t = P.textoPlanSesion(P.construirPlan({ region: 'cervical', severidad: 5, hipotesis: [hip('ce13')], elegidas: ['ce13'] }), {});
  assert.ok(t.includes(D.TEXTOS_SESION.cantidadReid) && !t.includes(D.TEXTOS_SESION.cantidad));
});

test('plan: pauta que fija la frecuencia (ce12, Kuijper 2009): plan B por defecto y nota en el mes', () => {
  assert.equal(P.frecuenciaPorDefecto('ce12'), 'B');
  assert.equal(P.frecuenciaPorDefecto('ce1'), 'A');
  assert.equal(P.frecuenciaPorDefecto(null), 'A');
  assert.match(HYPOTHESES.ce12.dosis, /2 veces por semana durante 6 semanas/);
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const p = P.construirPlan({ region: 'cervical', severidad: 5, hipotesis: [hip('ce12')], elegidas: ['ce12'] });
  assert.deepEqual(p.mes.notasPauta, [D.FRECUENCIA_PAUTA.ce12.nota]);
  assert.ok(P.textoPlanMes(p, {}, 'A').includes(D.FRECUENCIA_PAUTA.ce12.nota));
  assert.deepEqual(P.construirPlan({ region: 'cervical', severidad: 5, hipotesis: [hip('ce1')], elegidas: ['ce1'] }).mes.notasPauta, []);
  withState({ region: 'cervical', activeHypotheses: ['ce12'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    PLAN.planActual();
    assert.equal(state.planTratamiento.frecuencia, 'B');
  });
  state.planTratamiento = null;
});

test('plan: hombro (periférica) — escalones, cantidad, progresión y reglas de Peripheral; lumbar y cervical, igual que antes', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const plan = (region, ids) => P.construirPlan({ region, severidad: 5, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta'), hipotesis: ids.map(hip), elegidas: ids });
  assert.equal(P.familiaRegion('hombro'), 'periferica');
  for (const r of ['lumbar', 'cervical', undefined]) assert.equal(P.familiaRegion(r), 'columna', String(r));
  const h = plan('hombro', ['h2']);
  assert.equal(h.familia, 'periferica');
  assert.equal(h.escalones.B, D.ESCALONES_PERIFERICOS[h.niveles.B]);
  assert.equal(h.escalones.C, D.ESCALONES_PERIFERICOS[4]);
  assert.match(D.ESCALONES_PERIFERICOS[1].texto, /accesorio en posición indolora y apoyada antes que un fisiológico/);
  assert.deepEqual(h.sesion.cantidad, [D.TEXTOS_SESION.cantidadPeriferica]);
  assert.deepEqual(h.mes.progresion, [D.PROGRESION_GENERICA, D.PROGRESION_PERIFERICA]);
  assert.deepEqual(h.mes.reglas, D.REGLAS_MES_PERIFERICAS);
  for (const frag of ['60 %', '75 %', '10–20 %', 'último 40 %']) assert.ok(D.PROGRESION_PERIFERICA.includes(frag), frag);
  assert.ok(!D.REGLAS_MES_PERIFERICAS.some(r => /75 %|4–5 días/.test(r)), 'sin las reglas de Vertebral sin equivalente');
  const t = P.textoPlanMes(h, {});
  assert.ok(t.includes(D.PROGRESION_PERIFERICA) && t.includes(D.REGLAS_MES_PERIFERICAS[0]));
  assert.ok(P.textoPlanSesion(h, {}).includes(D.ESCALONES_PERIFERICOS[h.niveles.B].texto));
  for (const [region, id] of [['lumbar', 'lu1'], ['cervical', 'ce1']]) {
    const c = plan(region, [id]);
    assert.equal(c.familia, 'columna', region);
    assert.equal(c.escalones.B, D.ESCALONES[c.niveles.B], region);
    assert.deepEqual(c.sesion.cantidad, [D.TEXTOS_SESION.cantidad], region);
    assert.deepEqual(c.mes.progresion, [D.PROGRESION_GENERICA], region);
    assert.deepEqual(c.mes.reglas, D.REGLAS_MES, region);
  }
  assert.ok(D.REGIONES_PLAN.includes('hombro'));
  assert.ok(REFERENCIAS['Hengeveld y Banks 2005'] && D.FUENTES_PLAN.includes('Hengeveld y Banks 2005'));
});

test('plan: hombro — h6 como columna con la red arterial de cervical; con una hipótesis del hombro, aviso de dos familias', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const plan = ids => P.construirPlan({ region: 'hombro', severidad: 5, hipotesis: ids.map(hip), elegidas: ids });
  const h6 = plan(['h6']);
  assert.equal(h6.familia, 'columna');
  assert.equal(h6.escalones.B, D.ESCALONES[h6.niveles.B]);
  assert.deepEqual(h6.sesion.cantidad, [D.TEXTOS_SESION.cantidad]);
  assert.deepEqual(h6.sesion.cierre, [D.TEXTOS_SESION.cierre, D.TEXTOS_SESION.cierreCardiaco, D.TEXTOS_SESION.cierreArterial]);
  assert.deepEqual(h6.alarmasCasa, [D.TEXTOS_CASA.alarmaCardiaca.texto, D.TEXTOS_CASA.alarmaArterial.texto]);
  assert.ok(!h6.avisosHip.includes(D.AVISOS.manipulacionCervical) && !h6.alarmasCasa.includes(D.TEXTOS_CASA.alarmaMedula.texto), 'h6 no es radicular');
  assert.ok(!h6.avisosHip.includes(D.AVISOS.dosFamilias));
  assert.match(HYPOTHESES.h6.dosis, /manipulación o movilización cervical/, 'la red arterial se justifica por la terapia manual cervical de su pauta');
  const mixto = plan(['h2', 'h6']);
  assert.equal(mixto.familia, 'periferica', 'manda la principal');
  assert.ok(mixto.avisosHip.includes(D.AVISOS.dosFamilias));
  assert.deepEqual(mixto.sesion.cantidad, [D.TEXTOS_SESION.cantidadPeriferica, D.TEXTOS_SESION.cantidad]);
  assert.deepEqual(mixto.mes.progresion, [D.PROGRESION_GENERICA, D.PROGRESION_PERIFERICA]);
  assert.equal(plan(['h6', 'h2']).familia, 'columna');
  // La red de una región nunca sale repetida aunque la traiga también la hipótesis
  const cerv = P.redSeguridad('cervical', false, [hip('h6')]);
  assert.deepEqual(cerv.cierre, [D.TEXTOS_SESION.cierreArterial]);
  for (const [id, x] of Object.entries(D.RED_HIP)) {
    assert.ok(HYPOTHESES[id], id);
    assert.equal(typeof D.TEXTOS_SESION[x.cierre], 'string');
    assert.equal(typeof D.TEXTOS_CASA[x.casa]?.texto, 'string');
  }
  for (const [id, f] of Object.entries(D.FAMILIA_HIP)) { assert.ok(HYPOTHESES[id], id); assert.ok(['columna', 'periferica'].includes(f)); }
});

test('plan: hombro — red cardiaca siempre (h_c4); avisos de capsulitis (h1), inestabilidad (h4), artrosis (h10) y, con cirugía, prótesis', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const plan = (ids, extra = {}) => P.construirPlan({ region: 'hombro', severidad: 5, hipotesis: ids.map(hip), elegidas: ids, ...extra });
  const h2 = plan(['h2']);
  assert.deepEqual(h2.sesion.cierre, [D.TEXTOS_SESION.cierre, D.TEXTOS_SESION.cierreCardiaco]);
  assert.ok(P.textoDomiciliario(h2, {}, { ejercicios: 'X', parar: 'Y' }).trimEnd().endsWith(D.TEXTOS_CASA.alarmaCardiaca.texto));
  assert.ok(!h2.alarmasCasa.some(a => /ectópico|bazo|ano/.test(a)));
  // Los síntomas de la red son los de la pregunta urgente h_c4
  const hc4 = JSON.stringify(SYSTEMIC_SCREENING.hombro).includes('"id":"h_c4"');
  assert.ok(hc4, 'h_c4 existe en el cribado de hombro');
  for (const frag of ['20 minutos', 'sudor frío', 'náuseas', 'falta de aire', '112']) assert.ok(D.TEXTOS_CASA.alarmaCardiaca.texto.includes(frag), frag);
  assert.ok(plan(['h1']).avisosHip.includes(D.AVISOS.capsulitisPrecoz) && plan(['h1']).avisosHip.includes(D.AVISOS.capsulitisEstadios));
  assert.ok(plan(['h4']).avisosHip.includes(D.AVISOS.inestabilidad));
  for (const k of ['capsulitisEstadios', 'inestabilidad', 'artrosis']) assert.match(D.AVISOS[k], /Hengeveld y Banks 2005, cap\. 11, cuadro 11\.(9|11|12)/, k);
  assert.match(HYPOTHESES.h1.dosis, /no considera eficaz la terapia manual en la fase precoz dolorosa \(93 %\)/);
  assert.ok(plan(['h10']).avisosHip.includes(D.AVISOS.artrosis));
  assert.ok(!h2.avisosHip.some(a => [D.AVISOS.capsulitisPrecoz, D.AVISOS.capsulitisEstadios, D.AVISOS.inestabilidad, D.AVISOS.artrosis, D.AVISOS.protesis].includes(a)));
  const posq = plan(['h2'], { posq: { conProtocolo: true } });
  assert.ok(posq.avisosHip.includes(D.AVISOS.protesis));
  assert.ok(!P.construirPlan({ region: 'lumbar', severidad: 5, hipotesis: [hip('lu1')], elegidas: ['lu1'], posq: { conProtocolo: true } }).avisosHip.includes(D.AVISOS.protesis), 'la de prótesis es de periféricas');
  // Ninguna pauta de hombro fija volumen ni frecuencia, salvo la frecuencia de h8 (decisión 123); sin hipótesis neurológicas
  assert.equal(D.FRECUENCIA_PAUTA.h8.plan, 'B');
  for (const id of Object.keys(HYPOTHESES).filter(id => HYPOTHESES[id].region === 'hombro')) {
    assert.ok(!D.VOLUMEN_PAUTA[id] && (id === 'h8' || !D.FRECUENCIA_PAUTA[id]), id);
    assert.ok(!D.HIP_EXPLORACION_NEURO.includes(id), id);
  }
});

test('plan: con estado de hombro real, la pauta de h1, sus avisos, la red cardiaca y h11 («Derivar») no elegible', () => {
  withState({ region: 'hombro', activeHypotheses: ['h1', 'h11'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    const { plan, hs } = PLAN.planActual();
    assert.deepEqual(state.planTratamiento.hipotesis, ['h1']);
    assert.equal(plan.sesion.intervencion[0].pauta, HYPOTHESES.h1.dosis);
    assert.equal(P.elegible(hs.find(h => h.id === 'h11')).ok, false);
    assert.equal(plan.familia, 'periferica');
    assert.deepEqual(plan.alarmasCasa, [D.TEXTOS_CASA.alarmaCardiaca.texto]);
    assert.ok(plan.avisosHip.includes(D.AVISOS.capsulitisPrecoz));
  });
  state.planTratamiento = null;
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

test('plan: con estado cervical real, la pauta de ce3, su red de seguridad y ce8 («Derivar») no elegible', () => {
  withState({ region: 'cervical', activeHypotheses: ['ce3', 'ce8'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    const { plan, hs } = PLAN.planActual();
    assert.deepEqual(state.planTratamiento.hipotesis, ['ce3']);
    assert.equal(plan.sesion.intervencion[0].pauta, HYPOTHESES.ce3.dosis);
    assert.equal(P.elegible(hs.find(h => h.id === 'ce8')).ok, false);
    assert.deepEqual(plan.alarmasCasa, [D.TEXTOS_CASA.alarmaMedula.texto, D.TEXTOS_CASA.alarmaArterial.texto]);
    assert.ok(plan.avisosHip.includes(D.AVISOS.manipulacionCervical));
  });
  state.planTratamiento = null;
});

test('plan: varios síntomas — dosifica el más irritable; a igualdad, P1; otra región y sin irritabilidad no cuentan', () => {
  const hs = [{ id: 'x', name: 'X', pauta: 'P.', derivar: false, tratada: false }];
  const P2 = { n: 2, z: 'Pierna por debajo de la rodilla', nr: 3, ir: 'Alta', re: 'empeora' };
  const base = { hipotesis: hs, elegidas: ['x'], severidad: 6, zonaP1: 'Zona lumbar', irritabilidad: MATRIZ('Intermitente', 'Al final del rango', 'Alta') }; // P1 moderada
  // Sin secundarios: P1, como siempre
  const solo = P.construirPlan(base);
  assert.equal(solo.dosifica.n, 1); assert.equal(solo.dosifica.varios, false);
  assert.equal(solo.gravedad, 'moderada'); assert.equal(solo.irritabilidad, 'moderada');
  // P2 más irritable: manda P2, con la gravedad de su NRS y la irritabilidad estimada
  const p = P.construirPlan({ ...base, secundarios: [P2] });
  assert.equal(p.dosifica.n, 2); assert.equal(p.dosifica.nombre, 'P2 · Pierna por debajo de la rodilla');
  assert.equal(p.gravedadNRS, 'minima'); assert.equal(p.irritabilidad, 'alta'); assert.equal(p.irritabilidadEstimada, true);
  assert.ok(p.avisos.includes(D.AVISOS.dosificaOtro)); assert.ok(p.avisos.includes(D.AVISOS.estimada));
  assert.equal(p.niveles.B, 1);
  assert.match(P.textoPlanSesion(p, {}), /Irritabilidad: Alta \(según P2 · Pierna por debajo de la rodilla, el síntoma más irritable\)/);
  // A igualdad, P1; un secundario menos irritable tampoco cambia nada
  for (const ir of ['Moderada', 'Baja']) {
    const q = P.construirPlan({ ...base, secundarios: [{ ...P2, ir }] });
    assert.equal(q.dosifica.n, 1, ir); assert.equal(q.dosifica.varios, true); assert.ok(!q.avisos.includes(D.AVISOS.dosificaOtro));
    assert.doesNotMatch(P.textoPlanSesion(q, {}), /según P/);
  }
  // Entre secundarios igual de irritables, el de número más bajo
  assert.equal(P.construirPlan({ ...base, secundarios: [P2, { ...P2, n: 3, z: 'Pie' }] }).dosifica.n, 2);
  // Otra región o sin irritabilidad: no cuentan
  assert.equal(P.construirPlan({ ...base, secundarios: [{ ...P2, or: true }] }).dosifica.n, 1);
  assert.equal(P.construirPlan({ ...base, secundarios: [{ ...P2, ir: undefined }] }).dosifica.n, 1);
  // P1 sin irritabilidad cuenta como alta: ningún secundario lo supera
  assert.equal(P.construirPlan({ ...base, irritabilidad: {}, secundarios: [P2] }).dosifica.n, 1);
  // Secundario sin NRS: sin gravedad calculada, el aviso de siempre
  const sinNrs = P.construirPlan({ ...base, secundarios: [{ ...P2, nr: null }] });
  assert.equal(sinNrs.gravedadNRS, null); assert.ok(sinNrs.avisos.includes(D.AVISOS.sinNRS));
  // Lo elegido a mano sigue mandando
  assert.equal(P.construirPlan({ ...base, secundarios: [P2], irritabilidadManual: 'baja' }).irritabilidad, 'baja');
});

test('plan: varios síntomas — un secundario «Independiente» avisa de un posible segundo problema, también al compartir', () => {
  const hs = [{ id: 'x', name: 'X', pauta: 'P.', derivar: false, tratada: false }];
  const base = { hipotesis: hs, elegidas: ['x'], severidad: 5, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true };
  const p = P.construirPlan({ ...base, secundarios: [{ n: 2, z: 'Ingle', nr: 2, ir: 'Baja', re: 'independiente' }] });
  const av = p.avisosHip.find(a => a.startsWith(D.AVISOS.independiente));
  assert.equal(av, `${D.AVISOS.independiente} (P2 · Ingle)`);
  assert.ok(P.textoPlanSesion(p, {}).includes(`⚠ ${av}`));
  // Otra región «independiente» no (ya se dice pendiente de valorar), ni otra relación
  assert.ok(!P.construirPlan({ ...base, secundarios: [{ n: 2, z: 'Rodilla', nr: 2, re: 'independiente', or: true }] }).avisosHip.some(a => a.startsWith(D.AVISOS.independiente)));
  assert.ok(!P.construirPlan({ ...base, secundarios: [{ n: 2, z: 'Ingle', nr: 2, re: 'juntos' }] }).avisosHip.some(a => a.startsWith(D.AVISOS.independiente)));
});

test('plan: varios síntomas — con estado real, plan.js pasa P1 y los secundarios de la fase 3', () => {
  const v = () => ({ zonas: [], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: null, irritabilidad: '', relacion: '' });
  withState({ region: 'lumbar', activeHypotheses: ['lu3'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 6, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['lumbar'] },
    sintomasSecundarios: [{ ...v(), zonas: ['pierna'], nrs: 8, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.nombre, 'P2 · Pierna por debajo de la rodilla');
    assert.equal(plan.gravedadNRS, 'maxima');
    assert.ok(plan.avisosHip.includes(`${D.AVISOS.independiente} (P2 · Pierna por debajo de la rodilla)`));
  });
  state.planTratamiento = null; state.sintomasSecundarios = [];
});

test('plan: varios síntomas en cervical — dosifica el más irritable, avisa del independiente y mantiene lo propio de cervical', () => {
  const v = () => ({ zonas: [], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: null, irritabilidad: '', relacion: '' });
  withState({ region: 'cervical', activeHypotheses: ['ce3'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 4, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['cuello'] },
    sintomasSecundarios: [{ ...v(), zonas: ['brazo'], nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.nombre, 'P2 · Brazo');
    assert.equal(plan.irritabilidad, 'alta');
    assert.equal(plan.gravedadNRS, 'maxima', 'la gravedad sale del NRS de P2');
    assert.ok(plan.avisos.includes(D.AVISOS.dosificaOtro));
    assert.ok(plan.avisosHip.includes(`${D.AVISOS.independiente} (P2 · Brazo)`));
    // La regla de los 7–10 días usa el NRS del síntoma que dosifica (P2: 9), no el de P1 (4)
    assert.ok(plan.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA));
    // Lo propio de cervical sigue
    assert.ok(plan.avisosHip.includes(D.AVISOS.manipulacionCervical));
    assert.deepEqual(plan.alarmasCasa, [D.TEXTOS_CASA.alarmaMedula.texto, D.TEXTOS_CASA.alarmaArterial.texto]);
    assert.match(P.textoPlanSesion(plan, {}), /Irritabilidad: Alta \(según P2 · Brazo, el síntoma más irritable\)/);
  });
  // Un secundario de otra región («no valorada hoy») no dosifica
  withState({ region: 'cervical', activeHypotheses: ['ce1'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 4, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['cuello'] },
    sintomasSecundarios: [{ ...v(), otraRegion: true, nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.n, 1);
    assert.ok(!plan.avisos.includes(D.AVISOS.dosificaOtro));
  });
  state.planTratamiento = null; state.sintomasSecundarios = [];
});

test('plan: varios síntomas en hombro — dosifica el más irritable, avisa del independiente y mantiene lo propio de hombro', () => {
  const v = () => ({ zonas: [], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: null, irritabilidad: '', relacion: '' });
  withState({ region: 'hombro', activeHypotheses: ['h1'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 4, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['hombro_ant'] },
    sintomasSecundarios: [{ ...v(), zonas: ['cuello'], nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.nombre, 'P2 · Cuello o trapecio');
    assert.equal(plan.irritabilidad, 'alta');
    assert.equal(plan.gravedadNRS, 'maxima', 'la gravedad sale del NRS de P2');
    assert.equal(plan.niveles.B, 1);
    assert.ok(plan.avisos.includes(D.AVISOS.dosificaOtro));
    assert.ok(plan.avisosHip.includes(`${D.AVISOS.independiente} (P2 · Cuello o trapecio)`));
    // Sin hipótesis radicular en hombro: nunca la regla de los 7–10 días
    assert.ok(!plan.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA));
    // Lo propio de hombro sigue
    assert.equal(plan.familia, 'periferica');
    assert.equal(plan.escalones.B, D.ESCALONES_PERIFERICOS[1]);
    assert.ok(plan.avisosHip.includes(D.AVISOS.capsulitisPrecoz) && plan.avisosHip.includes(D.AVISOS.capsulitisEstadios));
    assert.deepEqual(plan.alarmasCasa, [D.TEXTOS_CASA.alarmaCardiaca.texto]);
    assert.match(P.textoPlanSesion(plan, {}), /Irritabilidad: Alta \(según P2 · Cuello o trapecio, el síntoma más irritable\)/);
  });
  // Un secundario de otra región («no valorada hoy») no dosifica
  withState({ region: 'hombro', activeHypotheses: ['h2'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 4, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['hombro_lat'] },
    sintomasSecundarios: [{ ...v(), otraRegion: true, nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.n, 1);
    assert.ok(!plan.avisos.includes(D.AVISOS.dosificaOtro));
  });
  state.planTratamiento = null; state.sintomasSecundarios = [];
});

test('plan: codo (periférica) — escalones, cantidad, progresión y reglas de Peripheral; lumbar, cervical y hombro, igual que antes', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const plan = (region, ids) => P.construirPlan({ region, severidad: 5, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta'), hipotesis: ids.map(hip), elegidas: ids });
  assert.ok(D.REGIONES_PLAN.includes('codo'));
  assert.equal(P.familiaRegion('codo'), 'periferica');
  const c = plan('codo', ['co1']);
  assert.equal(c.familia, 'periferica');
  assert.equal(c.escalones.B, D.ESCALONES_PERIFERICOS[c.niveles.B]);
  assert.equal(c.escalones.C, D.ESCALONES_PERIFERICOS[4]);
  assert.deepEqual(c.sesion.cantidad, [D.TEXTOS_SESION.cantidadPeriferica]);
  assert.deepEqual(c.mes.progresion, [D.PROGRESION_GENERICA, D.PROGRESION_PERIFERICA]);
  assert.deepEqual(c.mes.reglas, D.REGLAS_MES_PERIFERICAS);
  for (const id of Object.keys(HYPOTHESES).filter(id => HYPOTHESES[id].region === 'codo')) assert.ok(!D.FAMILIA_HIP[id] && !D.RED_HIP[id], `${id}: codo no cambia de familia ni trae red de otra región`);
  for (const [region, id, fam] of [['lumbar', 'lu1', 'columna'], ['cervical', 'ce1', 'columna'], ['hombro', 'h2', 'periferica']]) {
    const p = plan(region, [id]);
    assert.equal(p.familia, fam, region);
    assert.equal(p.escalones.B, P.tablaEscalones(fam)[p.niveles.B], region);
    assert.ok(!p.avisosHip.some(a => Object.values(D.AVISOS_HIP).flat().filter(k => /Codo|epicondil|radiohumeral|esqueleto/i.test(k)).map(k => D.AVISOS[k]).includes(a)), `${region}: sin avisos de codo`);
  }
  assert.deepEqual(plan('hombro', ['h2']).alarmasCasa, [D.TEXTOS_CASA.alarmaCardiaca.texto], 'hombro mantiene solo la cardiaca');
});

test('plan: codo — avisos por hipótesis del cap. 12 (co1, co2, co3, co4/co5, co6, nervios, esqueleto inmaduro) y, con cirugía, prótesis', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const plan = (ids, extra = {}) => P.construirPlan({ region: 'codo', severidad: 5, hipotesis: ids.map(hip), elegidas: ids, ...extra });
  const esperado = {
    co1: 'epicondilalgiaLateral', co2: 'epicondilalgiaMedial', co3: 'rigidezCodo', co4: 'inestabilidadCodo', co5: 'inestabilidadCodo',
    co6: 'radiohumeral', co8: 'nervioCodo', co9: 'nervioCodo', co13: 'nervioCodo', co15: 'esqueletoInmaduro', co16: 'esqueletoInmaduro',
  };
  for (const [id, k] of Object.entries(esperado)) assert.ok(plan([id]).avisosHip.includes(D.AVISOS[k]), `${id}: ${k}`);
  for (const id of ['co10', 'co11']) assert.deepEqual(plan([id]).avisosHip, [], `${id}: sin aviso propio`);
  for (const k of ['epicondilalgiaLateral', 'rigidezCodo', 'nervioCodo']) assert.match(D.AVISOS[k], /Hengeveld y Banks 2005, cap\. 12/, k);
  assert.match(D.AVISOS.epicondilalgiaLateral, /cuadro 12\.6, p\. 392/);
  assert.match(D.AVISOS.inestabilidadCodo, /Quzli 2025/); assert.match(HYPOTHESES.co5.dosis, /evitar la carga axial en extensión y supinación/);
  assert.match(D.AVISOS.esqueletoInmaduro, /no se aplican/); assert.match(HYPOTHESES.co15.dosis, /La fuente no da una pauta de ejercicio/);
  assert.match(HYPOTHESES.co2.dosis, /^Ejercicio excéntrico/); assert.ok(!/terapia manual/i.test(HYPOTHESES.co2.dosis), 'co2: su pauta no trae terapia manual');
  // Las «Derivar» de codo no se planifican
  for (const id of ['co7', 'co12', 'co14']) {
    assert.equal(HYPOTHESES[id].dosis, DOSIS_DERIVAR, id);
    assert.equal(P.elegible({ ...hip(id), derivar: true }).ok, false, id);
  }
  // Sin pauta: «a criterio del fisio»
  for (const id of ['co9', 'co10', 'co11', 'co13', 'co16']) assert.equal(HYPOTHESES[id].dosis, '', id);
  // Prótesis con mecanismo Post-quirúrgico (periférica), también en codo
  assert.ok(plan(['co3'], { posq: { conProtocolo: true } }).avisosHip.includes(D.AVISOS.protesis));
  assert.ok(!plan(['co3']).avisosHip.includes(D.AVISOS.protesis));
});

test('plan: codo — atrapamientos (co8, co9, co13): sensibilidad y fuerza del nervio cada sesión, sin red neurológica ni regla de días', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  for (const id of ['co8', 'co9', 'co13']) {
    assert.match(HYPOTHESES[id].name, /Neuropatía/, id);
    const p = P.construirPlan({ region: 'codo', severidad: 9, hipotesis: [hip(id)], elegidas: [id] });
    assert.ok(p.nervio && !p.neuro, id);
    assert.ok(p.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionNervio), id);
    assert.ok(!p.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionRadicular), id);
    assert.ok(!p.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA), `${id}: sin la regla de los 7–10 días aunque el NRS sea 9`);
    assert.deepEqual(p.alarmasCasa, [D.TEXTOS_CASA.alarmaInfeccion.texto], `${id}: solo la red de siempre`);
  }
  const no = P.construirPlan({ region: 'codo', severidad: 5, hipotesis: [hip('co1')], elegidas: ['co1'] });
  assert.ok(!no.nervio && !no.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionNervio));
  assert.match(D.TEXTOS_SESION.reevaluacionNervio, /Hengeveld y Banks 2005, cap\. 6, p\. 158/);
});

test('plan: codo — red de seguridad de infección siempre (co1); ni traumatismo ni posquirúrgicas en el programa para casa', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const p = P.construirPlan({ region: 'codo', severidad: 5, hipotesis: [hip('co3')], elegidas: ['co3'], posq: { conProtocolo: true } });
  assert.deepEqual(p.sesion.cierre, [D.TEXTOS_SESION.cierre, D.TEXTOS_SESION.cierreInfeccion]);
  const t = P.textoDomiciliario(p, {}, { ejercicios: 'X', parar: 'Y' });
  assert.ok(t.trimEnd().endsWith(D.TEXTOS_CASA.alarmaInfeccion.texto));
  assert.ok(t.includes(D.TEXTOS_CASA.cirujano.texto), 'con cirugía, «sigue las indicaciones de tu cirujano»');
  for (const frag of ['compartimental', 'radiografía', 'deformado', 'trombosis', '112']) assert.ok(!t.includes(frag), frag);
  // Los síntomas son los de la pregunta urgente co1
  const co1 = Object.values(SYSTEMIC_SCREENING.codo.sistemas).flatMap(s => s.preguntas).find(q => q.id === 'co1');
  assert.ok(co1?.urgencia, 'co1 es urgente');
  assert.match(co1.razonamiento.peso, /fiebre solo aparece en el 40–60 %/);
  for (const frag of ['rojo', 'caliente', 'hinchado', 'aunque no tengas fiebre', 'hoy mismo']) assert.ok(D.TEXTOS_CASA.alarmaInfeccion.texto.includes(frag), frag);
  assert.match(D.TEXTOS_CASA.alarmaInfeccion.fuente, /^Momodu y Savaliya 2023/);
});

test('plan: codo — la rigidez (co3) propone el plan B por defecto, con su nota; ninguna otra pauta de codo fija volumen ni frecuencia', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  assert.equal(P.frecuenciaPorDefecto('co3'), 'B');
  assert.match(HYPOTHESES.co3.dosis, /de 2 a 7 sesiones por semana durante 3 a 6 semanas/);
  const p = P.construirPlan({ region: 'codo', severidad: 5, hipotesis: [hip('co3')], elegidas: ['co3'] });
  assert.deepEqual(p.mes.notasPauta, [D.FRECUENCIA_PAUTA.co3.nota]);
  for (const id of Object.keys(HYPOTHESES).filter(id => HYPOTHESES[id].region === 'codo')) {
    assert.ok(!D.VOLUMEN_PAUTA[id], id);
    if (id !== 'co3') assert.ok(!D.FRECUENCIA_PAUTA[id], id);
  }
  withState({ region: 'codo', activeHypotheses: ['co3'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    PLAN.planActual();
    assert.equal(state.planTratamiento.frecuencia, 'B');
  });
  state.planTratamiento = null;
});

test('plan: con estado de codo real, la pauta de co1, su aviso, la red de infección y co7 («Derivar») no elegible', () => {
  withState({ region: 'codo', activeHypotheses: ['co7', 'co1'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    const { plan, hs } = PLAN.planActual();
    assert.deepEqual(state.planTratamiento.hipotesis, ['co1']);
    assert.equal(plan.sesion.intervencion[0].pauta, HYPOTHESES.co1.dosis);
    assert.equal(P.elegible(hs.find(h => h.id === 'co7')).ok, false);
    assert.equal(plan.familia, 'periferica');
    assert.deepEqual(plan.alarmasCasa, [D.TEXTOS_CASA.alarmaInfeccion.texto]);
    assert.ok(plan.avisosHip.includes(D.AVISOS.epicondilalgiaLateral));
  });
  state.planTratamiento = null;
});

test('plan: varios síntomas en codo — dosifica el más irritable, avisa del independiente y mantiene lo propio de codo', () => {
  const v = () => ({ zonas: [], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: null, irritabilidad: '', relacion: '' });
  withState({ region: 'codo', activeHypotheses: ['co1'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 4, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['codo_lat'] },
    sintomasSecundarios: [{ ...v(), zonas: ['antebrazo'], nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.nombre, 'P2 · Antebrazo');
    assert.equal(plan.irritabilidad, 'alta');
    assert.equal(plan.gravedadNRS, 'maxima', 'la gravedad sale del NRS de P2');
    assert.equal(plan.niveles.B, 1);
    assert.ok(plan.avisos.includes(D.AVISOS.dosificaOtro));
    assert.ok(plan.avisosHip.includes(`${D.AVISOS.independiente} (P2 · Antebrazo)`));
    assert.ok(!plan.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA));
    // Lo propio de codo sigue
    assert.equal(plan.familia, 'periferica');
    assert.equal(plan.escalones.B, D.ESCALONES_PERIFERICOS[1]);
    assert.ok(plan.avisosHip.includes(D.AVISOS.epicondilalgiaLateral));
    assert.deepEqual(plan.alarmasCasa, [D.TEXTOS_CASA.alarmaInfeccion.texto]);
    assert.match(P.textoPlanSesion(plan, {}), /Irritabilidad: Alta \(según P2 · Antebrazo, el síntoma más irritable\)/);
  });
  // Un secundario de otra región («no valorada hoy») no dosifica
  withState({ region: 'codo', activeHypotheses: ['co1'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 4, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['codo_lat'] },
    sintomasSecundarios: [{ ...v(), otraRegion: true, nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.n, 1);
    assert.ok(!plan.avisos.includes(D.AVISOS.dosificaOtro));
  });
  state.planTratamiento = null; state.sintomasSecundarios = [];
});

test('plan: rodilla (periférica) — escalones, cantidad, progresión y reglas de Peripheral; lumbar, cervical, hombro y codo, igual que antes', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const plan = (region, ids) => P.construirPlan({ region, severidad: 5, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta'), hipotesis: ids.map(hip), elegidas: ids });
  assert.ok(D.REGIONES_PLAN.includes('rodilla'));
  assert.equal(P.familiaRegion('rodilla'), 'periferica');
  const r = plan('rodilla', ['ro1']);
  assert.equal(r.familia, 'periferica');
  assert.equal(r.escalones.B, D.ESCALONES_PERIFERICOS[r.niveles.B]);
  assert.equal(r.escalones.C, D.ESCALONES_PERIFERICOS[4]);
  assert.deepEqual(r.sesion.cantidad, [D.TEXTOS_SESION.cantidadPeriferica]);
  assert.deepEqual(r.mes.progresion, [D.PROGRESION_GENERICA, D.PROGRESION_PERIFERICA]);
  assert.deepEqual(r.mes.reglas, D.REGLAS_MES_PERIFERICAS);
  for (const id of Object.keys(HYPOTHESES).filter(id => HYPOTHESES[id].region === 'rodilla')) assert.ok(!D.FAMILIA_HIP[id] && !D.RED_HIP[id], `${id}: rodilla no cambia de familia ni trae red de otra región`);
  const deRodilla = Object.entries(D.AVISOS_HIP).filter(([id]) => HYPOTHESES[id]?.region === 'rodilla').flatMap(([, ks]) => ks).map(k => D.AVISOS[k]);
  for (const [region, id, fam] of [['lumbar', 'lu1', 'columna'], ['cervical', 'ce1', 'columna'], ['hombro', 'h2', 'periferica'], ['codo', 'co1', 'periferica']]) {
    const p = plan(region, [id]);
    assert.equal(p.familia, fam, region);
    assert.equal(p.escalones.B, P.tablaEscalones(fam)[p.niveles.B], region);
    assert.ok(!p.avisosHip.some(a => deRodilla.includes(a)), `${region}: sin avisos de rodilla`);
    const posq = P.construirPlan({ region, severidad: 5, hipotesis: [hip(id)], elegidas: [id], posq: { conProtocolo: true } });
    assert.ok(!posq.avisosHip.includes(D.AVISOS.posqRodilla), `${region}: sin el aviso posquirúrgico de rodilla`);
  }
  assert.deepEqual(plan('hombro', ['h2']).alarmasCasa, [D.TEXTOS_CASA.alarmaCardiaca.texto], 'hombro mantiene solo la cardiaca');
  assert.deepEqual(plan('codo', ['co1']).alarmasCasa, [D.TEXTOS_CASA.alarmaInfeccion.texto], 'codo mantiene solo la de infección');
});

test('plan: rodilla — avisos por hipótesis del cap. 15 y, con cirugía, prótesis y el propio de rodilla', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const plan = (ids, extra = {}) => P.construirPlan({ region: 'rodilla', severidad: 5, hipotesis: ids.map(hip), elegidas: ids, ...extra });
  const esperado = {
    ro1: ['artrosisRodilla'], ro2: ['menisco'], ro3: ['patelofemoral'], ro4: ['ligamentoRodilla'], ro9: ['ligamentoRodilla'],
    ro8: ['ligamentoRodilla', 'esguinceReciente'], ro10: ['ligamentoRodilla', 'esguinceReciente'],
    ro5: ['cargaRodilla'], ro6: ['cargaRodilla'], ro12: ['rotulaInestable'], ro15: ['apofisitis'], ro18: ['tibioperonea'], ro19: ['nervioPeroneo'],
  };
  for (const [id, ks] of Object.entries(esperado)) assert.deepEqual(plan([id]).avisosHip, ks.map(k => D.AVISOS[k]), id);
  for (const id of ['ro7', 'ro13', 'ro14', 'ro16', 'ro17', 'ro20']) assert.deepEqual(plan([id]).avisosHip, [], `${id}: sin aviso propio`);
  for (const k of ['artrosisRodilla', 'menisco', 'patelofemoral', 'ligamentoRodilla', 'cargaRodilla', 'rotulaInestable', 'apofisitis', 'tibioperonea', 'nervioPeroneo', 'posqRodilla']) assert.match(D.AVISOS[k], /Hengeveld y Banks 2005, cap\. 15/, k);
  assert.match(D.AVISOS.esguinceReciente, /Hengeveld y Banks 2005, cap\. 8, p\. 220/);
  assert.notEqual(D.AVISOS.artrosisRodilla, D.AVISOS.artrosis, 'la artrosis de rodilla tiene su aviso, no el glenohumeral');
  assert.match(D.AVISOS.artrosisRodilla, /cuadro 15\.2, p\. 517/); assert.match(D.AVISOS.artrosisRodilla, /cap\. 8, p\. 224/);
  assert.match(HYPOTHESES.ro1.dosis, /Terapia manual solo junto al ejercicio \(1\.3\.6\)/); assert.match(D.AVISOS.artrosisRodilla, /NICE NG226, rec\. 1\.3\.6/);
  assert.match(HYPOTHESES.ro3.dosis, /terapia manual aislada \(A\)/); assert.match(D.AVISOS.patelofemoral, /Willy 2019, A/);
  assert.match(D.AVISOS.apofisitis, /no se aplican/); assert.ok(!/terapia manual/i.test(HYPOTHESES.ro15.dosis), 'ro15: su pauta no trae terapia manual');
  assert.ok(!/terapia manual/i.test(HYPOTHESES.ro5.dosis), 'ro5: su pauta no trae terapia manual');
  assert.match(HYPOTHESES.ro6.dosis, /junto a terapia manual/);
  // La «Derivar» de rodilla no se planifica
  assert.equal(HYPOTHESES.ro11.dosis, DOSIS_DERIVAR);
  assert.equal(P.elegible({ ...hip('ro11'), derivar: true }).ok, false);
  // Sin pauta: «a criterio del fisio»
  for (const id of ['ro7', 'ro13', 'ro14', 'ro16', 'ro17', 'ro18', 'ro19', 'ro20']) assert.equal(HYPOTHESES[id].dosis, '', id);
  // Con mecanismo Post-quirúrgico: el de prótesis de las periféricas y, después, el de rodilla
  const posq = plan(['ro1'], { posq: { conProtocolo: true } }).avisosHip;
  assert.ok(posq.indexOf(D.AVISOS.protesis) >= 0 && posq.indexOf(D.AVISOS.posqRodilla) > posq.indexOf(D.AVISOS.protesis));
  assert.ok(!plan(['ro1']).avisosHip.includes(D.AVISOS.posqRodilla));
  assert.deepEqual(D.AVISOS_POSQ_REGION.rodilla, ['posqRodilla']);
});

test('plan: rodilla — ro19 (peroneo común): exploración del nervio cada sesión, sin red neurológica ni regla de días', () => {
  const hip = id => ({ id, name: id, pauta: '', derivar: false, tratada: false });
  assert.match(HYPOTHESES.ro19.name, /Neuropatía/);
  assert.ok(D.HIP_NERVIO_PERIFERICO.includes('ro19') && !D.HIP_EXPLORACION_NEURO.includes('ro19') && !D.HIP_RADICULARES.includes('ro19'));
  const p = P.construirPlan({ region: 'rodilla', severidad: 9, hipotesis: [hip('ro19')], elegidas: ['ro19'] });
  assert.ok(p.nervio && !p.neuro);
  assert.ok(p.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionNervio));
  assert.ok(!p.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionRadicular));
  assert.ok(!p.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA), 'sin la regla de los 7–10 días aunque el NRS sea 9');
  assert.deepEqual(p.alarmasCasa, [D.TEXTOS_CASA.alarmaInfeccionRodilla.texto, D.TEXTOS_CASA.alarmaTVP.texto], 'solo la red de siempre');
  assert.ok(p.sesion.intervencion[0].sinPauta);
});

test('plan: rodilla — red de seguridad de infección y TVP siempre; ni isquemia, ni traumatismo, ni las demás posquirúrgicas', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const p = P.construirPlan({ region: 'rodilla', severidad: 5, hipotesis: [hip('ro3')], elegidas: ['ro3'], posq: { conProtocolo: true } });
  assert.deepEqual(p.sesion.cierre, [D.TEXTOS_SESION.cierre, D.TEXTOS_SESION.cierreInfeccionRodilla, D.TEXTOS_SESION.cierreTVP]);
  const t = P.textoDomiciliario(p, {}, { ejercicios: 'X', parar: 'Y' });
  assert.ok(t.trimEnd().endsWith([D.TEXTOS_CASA.alarmaInfeccionRodilla.texto, D.TEXTOS_CASA.alarmaTVP.texto].join('\n\n')));
  assert.ok(t.includes(D.TEXTOS_CASA.cirujano.texto), 'con cirugía, «sigue las indicaciones de tu cirujano»');
  for (const frag of ['compartimental', 'fría', 'pálida', 'chasquido', 'herida', 'codo']) assert.ok(!t.includes(frag), frag);
  // Los síntomas son los de las preguntas urgentes r1, r_i3, r_v2 y pq_tep
  const qs = Object.values(SYSTEMIC_SCREENING.rodilla.sistemas).flatMap(s => s.preguntas);
  const q = id => qs.find(x => x.id === id);
  for (const id of ['r1', 'r_i3', 'r_v2', 'pq_tep', 'r_v4', 'ro_t2', 'ro_t3', 'ro_t4', 'pq_compart']) assert.ok(q(id)?.urgencia, `${id} es urgente`);
  assert.match(q('r1').razonamiento.peso, /fiebre solo aparece en el 40–60 %/);
  assert.match(q('r1').razonamiento.peso, /La rodilla es la articulación más afectada en el adulto/);
  for (const frag of ['rodilla', 'delante de la rótula', 'roja', 'caliente', 'hinchada', 'aunque no tengas fiebre', 'hoy mismo']) assert.ok(D.TEXTOS_CASA.alarmaInfeccionRodilla.texto.includes(frag), frag);
  assert.match(q('r_v2').text, /pantorrilla o toda la pierna hinchada, caliente y más rojiza/);
  assert.match(q('pq_tep').urgencia, /112/);
  for (const frag of ['pantorrilla', 'caliente', 'más roja', 'hoy mismo', 'falta el aire', '112']) assert.ok(D.TEXTOS_CASA.alarmaTVP.texto.includes(frag), frag);
  assert.match(D.TEXTOS_CASA.alarmaInfeccionRodilla.fuente, /^Momodu y Savaliya 2023/);
  assert.match(D.TEXTOS_CASA.alarmaTVP.fuente, /^Waheed 2023/);
  // Sin cirugía, la misma red (la TVP no es solo posquirúrgica)
  const sin = P.construirPlan({ region: 'rodilla', severidad: 5, hipotesis: [hip('ro3')], elegidas: ['ro3'] });
  assert.deepEqual(sin.alarmasCasa, [D.TEXTOS_CASA.alarmaInfeccionRodilla.texto, D.TEXTOS_CASA.alarmaTVP.texto]);
});

test('plan: rodilla — ro2 usa la rama de su pauta que encaja (traumática, degenerativa, tras meniscectomía); sin rama, la pauta entera', () => {
  const casos = [
    [{ treeAnswers: { ro_step1: 'menisco' } }, 'Rotura traumática, sin cirugía'],
    [{ treeAnswers: { ro_step5: 'menisco' } }, 'Lesión degenerativa, sin cirugía'],
    [{ treeAnswers: { ro_step6: 'menisco' } }, 'Lesión degenerativa, sin cirugía'],
  ];
  for (const [extra, titulo] of casos) {
    withState({ region: 'rodilla', mecanismo: '', activeHypotheses: ['ro2'], hypothesisScores: {}, testResults: {}, planTratamiento: null, ...extra }, () => {
      const { plan } = PLAN.planActual();
      const rama = HYPOTHESES.ro2.dosisRamas.find(r => r.titulo === titulo);
      assert.equal(plan.sesion.intervencion[0].pauta, `${rama.texto} ${HYPOTHESES.ro2.dosisComun}`, titulo);
      assert.ok(plan.avisosHip.includes(D.AVISOS.menisco), titulo);
    });
    state.planTratamiento = null;
  }
  // La degenerativa es la única rama con terapia manual
  for (const r of HYPOTHESES.ro2.dosisRamas) assert.equal(/Terapia manual/.test(r.texto), r.titulo.startsWith('Lesión degenerativa'), r.titulo);
  // Sin rama que encaje, la pauta entera
  withState({ region: 'rodilla', mecanismo: '', activeHypotheses: ['ro2'], hypothesisScores: {}, testResults: {}, planTratamiento: null, treeAnswers: {} }, () => {
    assert.equal(PLAN.planActual().plan.sesion.intervencion[0].pauta, HYPOTHESES.ro2.dosis);
  });
  state.planTratamiento = null;
  // Tras una meniscectomía (Post-quirúrgico): la rama posquirúrgica, con el aviso de compatibilidad delante
  withState({ region: 'rodilla', mecanismo: 'Post-quirúrgico', cirugia: { intervencion: 'Meniscectomía parcial', fecha: '', semanasAprox: 3, protocolo: 'Escrito', restricciones: 'Carga según tolerancia', complicaciones: ['Ninguna'], complicacionOtra: '' },
    activeHypotheses: ['ro2'], hypothesisScores: {}, testResults: {}, treeAnswers: { ro_step5: 'menisco' }, planTratamiento: { hipotesis: ['ro2'] } }, () => {
    const { plan } = PLAN.planActual();
    const rama = HYPOTHESES.ro2.dosisRamas[0];
    assert.equal(rama.titulo, 'Tras una meniscectomía parcial');
    assert.equal(plan.sesion.intervencion[0].pauta, `${await_posq.TEXTO_PAUTA_COMPATIBLE} ${rama.texto} ${HYPOTHESES.ro2.dosisComun}`);
    assert.ok(plan.avisosHip.includes(D.AVISOS.protesis) && plan.avisosHip.includes(D.AVISOS.posqRodilla));
  });
  state.planTratamiento = null;
});

test('plan: rodilla — ro15 trae su frecuencia (plan A, con nota); ninguna pauta de rodilla trae volumen propio de terapia manual', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  assert.equal(P.frecuenciaPorDefecto('ro15'), 'A');
  assert.match(HYPOTHESES.ro15.dosis, /4 visitas en 12 semanas/);
  const p = P.construirPlan({ region: 'rodilla', severidad: 5, hipotesis: [hip('ro15')], elegidas: ['ro15'] });
  assert.deepEqual(p.mes.notasPauta, [D.FRECUENCIA_PAUTA.ro15.nota]);
  for (const id of Object.keys(HYPOTHESES).filter(id => HYPOTHESES[id].region === 'rodilla')) {
    assert.ok(!D.VOLUMEN_PAUTA[id], id);
    if (id !== 'ro15') assert.ok(!D.FRECUENCIA_PAUTA[id], id);
  }
});

test('plan: con estado de rodilla real, la pauta de ro1, su aviso, la red de infección y TVP, y ro11 («Derivar») no elegible', () => {
  withState({ region: 'rodilla', mecanismo: '', activeHypotheses: ['ro11', 'ro1'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    const { plan, hs } = PLAN.planActual();
    assert.deepEqual(state.planTratamiento.hipotesis, ['ro1']);
    assert.equal(state.planTratamiento.frecuencia, 'A');
    assert.equal(plan.sesion.intervencion[0].pauta, HYPOTHESES.ro1.dosis);
    assert.equal(P.elegible(hs.find(h => h.id === 'ro11')).ok, false);
    assert.equal(plan.familia, 'periferica');
    assert.deepEqual(plan.alarmasCasa, [D.TEXTOS_CASA.alarmaInfeccionRodilla.texto, D.TEXTOS_CASA.alarmaTVP.texto]);
    assert.ok(plan.avisosHip.includes(D.AVISOS.artrosisRodilla));
  });
  state.planTratamiento = null;
});

test('plan: varios síntomas en rodilla — dosifica el más irritable, avisa del independiente y mantiene lo propio de rodilla', () => {
  const v = () => ({ zonas: [], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: null, irritabilidad: '', relacion: '' });
  withState({ region: 'rodilla', mecanismo: '', activeHypotheses: ['ro3'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 4, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['rodilla_ant'] },
    sintomasSecundarios: [{ ...v(), zonas: ['pierna'], nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.nombre, 'P2 · Pierna');
    assert.equal(plan.irritabilidad, 'alta');
    assert.equal(plan.gravedadNRS, 'maxima', 'la gravedad sale del NRS de P2');
    assert.equal(plan.niveles.B, 1);
    assert.ok(plan.avisos.includes(D.AVISOS.dosificaOtro));
    assert.ok(plan.avisosHip.includes(`${D.AVISOS.independiente} (P2 · Pierna)`));
    assert.ok(!plan.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA));
    // Lo propio de rodilla sigue
    assert.equal(plan.familia, 'periferica');
    assert.equal(plan.escalones.B, D.ESCALONES_PERIFERICOS[1]);
    assert.ok(plan.avisosHip.includes(D.AVISOS.patelofemoral));
    assert.deepEqual(plan.alarmasCasa, [D.TEXTOS_CASA.alarmaInfeccionRodilla.texto, D.TEXTOS_CASA.alarmaTVP.texto]);
    assert.match(P.textoPlanSesion(plan, {}), /Irritabilidad: Alta \(según P2 · Pierna, el síntoma más irritable\)/);
  });
  // Un secundario de otra región («no valorada hoy») no dosifica
  withState({ region: 'rodilla', mecanismo: '', activeHypotheses: ['ro3'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 4, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['rodilla_ant'] },
    sintomasSecundarios: [{ ...v(), otraRegion: true, nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.n, 1);
    assert.ok(!plan.avisos.includes(D.AVISOS.dosificaOtro));
  });
  state.planTratamiento = null; state.sintomasSecundarios = [];
});

const RED_CADERA = () => [D.TEXTOS_CASA.alarmaFracturaEstres.texto, D.TEXTOS_CASA.alarmaInfeccionCadera.texto, D.TEXTOS_CASA.alarmaTVP.texto];

test('plan: cadera (periférica) — escalones, cantidad, progresión y reglas de Peripheral; ca10 como columna; las demás regiones, igual que antes', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const plan = (region, ids) => P.construirPlan({ region, severidad: 5, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta'), hipotesis: ids.map(hip), elegidas: ids });
  assert.ok(D.REGIONES_PLAN.includes('cadera'));
  assert.equal(P.familiaRegion('cadera'), 'periferica');
  const c = plan('cadera', ['ca1']);
  assert.equal(c.familia, 'periferica');
  assert.equal(c.escalones.B, D.ESCALONES_PERIFERICOS[c.niveles.B]);
  assert.equal(c.escalones.C, D.ESCALONES_PERIFERICOS[4]);
  assert.deepEqual(c.sesion.cantidad, [D.TEXTOS_SESION.cantidadPeriferica]);
  assert.deepEqual(c.mes.progresion, [D.PROGRESION_GENERICA, D.PROGRESION_PERIFERICA]);
  assert.deepEqual(c.mes.reglas, D.REGLAS_MES_PERIFERICAS);
  // ca10 (sacroilíaca): familia columna, sin red de otra región ni avisos
  const si = plan('cadera', ['ca10']);
  assert.equal(si.familia, 'columna');
  assert.equal(si.escalones.B, D.ESCALONES[si.niveles.B]);
  assert.deepEqual(si.sesion.cantidad, [D.TEXTOS_SESION.cantidad]);
  assert.deepEqual(si.mes.reglas, D.REGLAS_MES);
  assert.deepEqual(si.alarmasCasa, RED_CADERA(), 'la red es la de cadera');
  assert.ok(plan('cadera', ['ca1', 'ca10']).avisosHip.includes(D.AVISOS.dosFamilias));
  for (const id of Object.keys(HYPOTHESES).filter(id => HYPOTHESES[id].region === 'cadera')) {
    assert.ok(!D.RED_HIP[id], `${id}: no trae red de otra región`);
    assert.equal(!!D.FAMILIA_HIP[id], id === 'ca10', `${id}: solo ca10 cambia de familia`);
  }
  const deCadera = Object.entries(D.AVISOS_HIP).filter(([id]) => HYPOTHESES[id]?.region === 'cadera').flatMap(([, ks]) => ks).map(k => D.AVISOS[k]);
  for (const [region, id, fam] of [['lumbar', 'lu1', 'columna'], ['cervical', 'ce1', 'columna'], ['hombro', 'h2', 'periferica'], ['codo', 'co1', 'periferica'], ['rodilla', 'ro1', 'periferica']]) {
    const p = plan(region, [id]);
    assert.equal(p.familia, fam, region);
    assert.ok(!p.avisosHip.some(a => deCadera.includes(a)), `${region}: sin avisos de cadera`);
    const posq = P.construirPlan({ region, severidad: 5, hipotesis: [hip(id)], elegidas: [id], posq: { conProtocolo: true } });
    assert.ok(!posq.avisosHip.includes(D.AVISOS.posqCadera), `${region}: sin el aviso posquirúrgico de cadera`);
    assert.ok(!p.alarmasCasa.includes(D.TEXTOS_CASA.alarmaFracturaEstres.texto) && !p.alarmasCasa.includes(D.TEXTOS_CASA.alarmaInfeccionCadera.texto), `${region}: sin la red de cadera`);
  }
  assert.deepEqual(plan('rodilla', ['ro1']).alarmasCasa, [D.TEXTOS_CASA.alarmaInfeccionRodilla.texto, D.TEXTOS_CASA.alarmaTVP.texto], 'rodilla mantiene la suya');
});

test('plan: cadera — avisos por hipótesis del cap. 14 y, con cirugía, prótesis y el propio de cadera', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const plan = (ids, extra = {}) => P.construirPlan({ region: 'cadera', severidad: 5, hipotesis: ids.map(hip), elegidas: ids, ...extra });
  const esperado = {
    ca1: ['artrosisCadera'], ca2: ['pinzamientoCadera'], ca3: ['pinzamientoCadera'], ca4: ['tendinopatiaGlutea'], ca7: ['gluteoProfundo'],
    ca9: ['cargaCadera'], ca11: ['ingleAguda', 'ingleDeportiva'], ca12: ['inestabilidadCadera'], ca14: ['nervioCadera'], ca15: ['sensibilizacionCentral'],
    ca16: ['cargaCadera', 'ingleDeportiva'], ca17: ['cargaCadera', 'ingleDeportiva'], ca18: ['ingleDeportiva'], ca19: ['ingleDeportiva'],
  };
  for (const [id, ks] of Object.entries(esperado)) assert.deepEqual(plan([id]).avisosHip, ks.map(k => D.AVISOS[k]), id);
  for (const id of ['ca5', 'ca6', 'ca8', 'ca10', 'ca13']) assert.deepEqual(plan([id]).avisosHip, [], `${id}: sin aviso propio`);
  for (const k of ['artrosisCadera', 'pinzamientoCadera', 'inestabilidadCadera', 'tendinopatiaGlutea', 'cargaCadera', 'ingleDeportiva', 'gluteoProfundo', 'nervioCadera', 'posqCadera']) assert.match(D.AVISOS[k], /Hengeveld y Banks 2005, cap\. (14|8)/, k);
  assert.notEqual(D.AVISOS.artrosisCadera, D.AVISOS.artrosis); assert.notEqual(D.AVISOS.artrosisCadera, D.AVISOS.artrosisRodilla);
  assert.match(D.AVISOS.artrosisCadera, /cuadro 14\.3, p\. 476/); assert.match(D.AVISOS.artrosisCadera, /cap\. 8, p\. 224/);
  assert.match(HYPOTHESES.ca1.dosis, /siempre junto al ejercicio/); assert.match(HYPOTHESES.ca1.dosis, /irritabilidad \(F\)/);
  assert.match(HYPOTHESES.ca2.dosis, /rangos que reproduzcan el pinzamiento/); assert.match(D.AVISOS.pinzamientoCadera, /cuadro 14\.5, p\. 478/);
  assert.match(HYPOTHESES.ca12.dosis, /estructuras capsuloligamentosas/); assert.match(D.AVISOS.inestabilidadCadera, /cap\. 8, pp\. 224–225/);
  // ca4: su pauta evita estirar la cintilla, que el cuadro 14.6 sí estira: manda la pauta
  assert.match(HYPOTHESES.ca4.dosis, /no estirar piriforme ni cintilla iliotibial/); assert.match(D.AVISOS.tendinopatiaGlutea, /cuadro 14\.6, p\. 479/); assert.match(D.AVISOS.tendinopatiaGlutea, /manda la pauta/);
  for (const id of ['ca4', 'ca9', 'ca11', 'ca16']) assert.ok(!/terapia manual/i.test(HYPOTHESES[id].dosis), `${id}: su pauta no trae terapia manual`);
  assert.match(D.AVISOS.ingleDeportiva, /cuadro 14\.4/); assert.match(D.AVISOS.nervioCadera, /cuadro 14\.7, p\. 480/);
  assert.match(D.AVISOS.sensibilizacionCentral, /cap\. 10, recuadro 10\.3, pp\. 264–265/);
  assert.match(D.AVISOS.ingleAguda, /Serner 2020/);
  // Cadera no tiene ninguna «Derivar»; diez hipótesis sin pauta
  for (const id of Object.keys(HYPOTHESES).filter(id => HYPOTHESES[id].region === 'cadera')) assert.notEqual(HYPOTHESES[id].dosis, DOSIS_DERIVAR, id);
  for (const id of ['ca5', 'ca6', 'ca7', 'ca8', 'ca10', 'ca13', 'ca14', 'ca18']) assert.equal(HYPOTHESES[id].dosis, '', id);
  // Con mecanismo Post-quirúrgico: el de prótesis de las periféricas y, después, el de cadera
  const posq = plan(['ca1'], { posq: { conProtocolo: true } }).avisosHip;
  assert.ok(posq.indexOf(D.AVISOS.protesis) >= 0 && posq.indexOf(D.AVISOS.posqCadera) > posq.indexOf(D.AVISOS.protesis));
  assert.ok(!plan(['ca1']).avisosHip.includes(D.AVISOS.posqCadera));
  assert.ok(!posq.includes(D.AVISOS.posqRodilla));
  assert.deepEqual(D.AVISOS_POSQ_REGION.cadera, ['posqCadera']);
});

test('plan: cadera — ca7 y ca14 (nervio periférico): exploración del nervio cada sesión, sin red neurológica ni regla de días; ca6 descartada', () => {
  const hip = id => ({ id, name: id, pauta: '', derivar: false, tratada: false });
  for (const id of ['ca7', 'ca14']) {
    assert.ok(D.HIP_NERVIO_PERIFERICO.includes(id) && !D.HIP_EXPLORACION_NEURO.includes(id) && !D.HIP_RADICULARES.includes(id), id);
    const p = P.construirPlan({ region: 'cadera', severidad: 9, hipotesis: [hip(id)], elegidas: [id] });
    assert.ok(p.nervio && !p.neuro, id);
    assert.ok(p.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionNervio), id);
    assert.ok(!p.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionRadicular), id);
    assert.ok(!p.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA), `${id}: sin la regla de los 7–10 días aunque el NRS sea 9`);
    assert.deepEqual(p.alarmasCasa, RED_CADERA(), `${id}: solo la red de siempre`);
    assert.ok(p.sesion.intervencion[0].sinPauta, id);
  }
  assert.match(HYPOTHESES.ca14.name, /Neuropatías/); assert.match(HYPOTHESES.ca6.name, /Neuromuscular/);
  assert.ok(D.HIP_NEURO_DESCARTADAS.ca6 && !D.HIP_EXPLORACION_NEURO.includes('ca6') && !D.HIP_NERVIO_PERIFERICO.includes('ca6'));
  const p6 = P.construirPlan({ region: 'cadera', severidad: 5, hipotesis: [hip('ca6')], elegidas: ['ca6'] });
  assert.ok(!p6.nervio && !p6.neuro);
});

test('plan: cadera — red de seguridad de fractura de estrés, infección y TVP siempre; ni vascular aguda, ni urogenital, ni las demás posquirúrgicas', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const p = P.construirPlan({ region: 'cadera', severidad: 5, hipotesis: [hip('ca4')], elegidas: ['ca4'], posq: { conProtocolo: true } });
  assert.deepEqual(p.sesion.cierre, [D.TEXTOS_SESION.cierre, D.TEXTOS_SESION.cierreFracturaEstres, D.TEXTOS_SESION.cierreInfeccionCadera, D.TEXTOS_SESION.cierreTVP]);
  const t = P.textoDomiciliario(p, {}, { ejercicios: 'X', parar: 'Y' });
  assert.ok(t.trimEnd().endsWith(RED_CADERA().join('\n\n')));
  assert.ok(t.includes(D.TEXTOS_CASA.cirujano.texto));
  for (const frag of ['aorta', 'desgarr', 'testículo', 'regla', 'embarazo', 'fría', 'pálida', 'compartimental', 'herida', 'rodilla', 'codo']) assert.ok(!t.includes(frag), frag);
  // Los síntomas son los de las preguntas urgentes ca_os1, ca_in1, ca_in3, ca_v2 y pq_tep
  const qs = Object.values(SYSTEMIC_SCREENING.cadera.sistemas).flatMap(s => s.preguntas);
  const q = id => qs.find(x => x.id === id);
  for (const id of ['ca_os1', 'ca_in1', 'ca_v2', 'pq_tep', 'ca_v4', 'ca_v5', 'ca_u3', 'ca_u5']) assert.ok(q(id)?.urgencia, `${id} es urgente`);
  assert.match(SYSTEMIC_SCREENING.cadera.urgencia.titulo, /FRACTURA DE ESTRÉS DEL CUELLO FEMORAL/);
  assert.match(q('ca_os1').razonamiento.porque, /si se sigue cargando, la fisura puede completarse/);
  for (const frag of ['ingle', 'cadera', 'apoyar el peso', 'actividad', 'de noche', 'deja la actividad', 'hoy mismo']) assert.ok(D.TEXTOS_CASA.alarmaFracturaEstres.texto.includes(frag), frag);
  assert.match(q('ca_in1').text, /no poder apoyar la pierna/);
  assert.match(q('ca_in3').razonamiento.peso, /no cede en reposo y sigue de noche/);
  for (const frag of ['no poder apoyar la pierna', 'fiebre', 'mal en general', 'urgencias', 'prótesis', 'de noche']) assert.ok(D.TEXTOS_CASA.alarmaInfeccionCadera.texto.includes(frag), frag);
  assert.match(D.TEXTOS_CASA.alarmaFracturaEstres.fuente, /^Lluch 2020/);
  assert.match(D.TEXTOS_CASA.alarmaInfeccionCadera.fuente, /^Momodu y Savaliya 2023/);
  assert.match(D.TEXTOS_CASA.alarmaTVP.fuente, /prótesis de rodilla o de cadera/);
  // Sin cirugía, la misma red
  const sin = P.construirPlan({ region: 'cadera', severidad: 5, hipotesis: [hip('ca4')], elegidas: ['ca4'] });
  assert.deepEqual(sin.alarmasCasa, RED_CADERA());
});

test('plan: cadera — frecuencia de la pauta (ca1 A, ca4 B, ca9 A, ca11 B, ca16 B, con nota); ninguna trae volumen propio de terapia manual', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const esperado = { ca1: 'A', ca4: 'B', ca9: 'A', ca11: 'B', ca16: 'B' };
  for (const [id, f] of Object.entries(esperado)) {
    assert.equal(P.frecuenciaPorDefecto(id), f, id);
    assert.deepEqual(P.construirPlan({ region: 'cadera', severidad: 5, hipotesis: [hip(id)], elegidas: [id] }).mes.notasPauta, [D.FRECUENCIA_PAUTA[id].nota], id);
  }
  assert.match(HYPOTHESES.ca1.dosis, /de 1 a 5 sesiones por semana/); assert.match(HYPOTHESES.ca1.dosis, /1–3 veces por semana durante 6–12 semanas/);
  assert.match(HYPOTHESES.ca4.dosis, /14 sesiones individuales en 8 semanas/);
  assert.match(HYPOTHESES.ca9.dosis, /6 sesiones en 12 semanas \(semanas 0, 1, 2, 3, 6 y 12\)/);
  assert.match(HYPOTHESES.ca16.dosis, /3 veces por semana \(unos 90 min, en grupos de 2–4\) durante 8–12 semanas/);
  for (const id of Object.keys(HYPOTHESES).filter(id => HYPOTHESES[id].region === 'cadera')) {
    assert.ok(!D.VOLUMEN_PAUTA[id], id);
    if (!esperado[id]) assert.ok(!D.FRECUENCIA_PAUTA[id], id);
  }
});

test('plan: con estado de cadera real, la pauta de ca1, su aviso, su nota, la red de cadera y, con cirugía, sus avisos', () => {
  withState({ region: 'cadera', mecanismo: '', activeHypotheses: ['ca1'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    const { plan } = PLAN.planActual();
    assert.deepEqual(state.planTratamiento.hipotesis, ['ca1']);
    assert.equal(state.planTratamiento.frecuencia, 'A');
    assert.equal(plan.sesion.intervencion[0].pauta, HYPOTHESES.ca1.dosis);
    assert.equal(plan.familia, 'periferica');
    assert.deepEqual(plan.alarmasCasa, RED_CADERA());
    assert.ok(plan.avisosHip.includes(D.AVISOS.artrosisCadera));
    assert.deepEqual(plan.mes.notasPauta, [D.FRECUENCIA_PAUTA.ca1.nota]);
  });
  state.planTratamiento = null;
  withState({ region: 'cadera', mecanismo: '', activeHypotheses: ['ca4'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    PLAN.planActual();
    assert.equal(state.planTratamiento.frecuencia, 'B', 'ca4 por defecto propone el plan B');
  });
  state.planTratamiento = null;
  withState({ region: 'cadera', mecanismo: 'Post-quirúrgico', cirugia: { intervencion: 'Prótesis total de cadera', fecha: '', semanasAprox: 8, protocolo: 'Escrito', restricciones: 'Sin flexión de más de 90° las primeras 6 semanas', complicaciones: ['Ninguna'], complicacionOtra: '' },
    activeHypotheses: ['ca1'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    const { plan } = PLAN.planActual();
    assert.ok(plan.avisosHip.includes(D.AVISOS.protesis) && plan.avisosHip.includes(D.AVISOS.posqCadera));
    assert.ok(!plan.avisosHip.includes(D.AVISOS.posqRodilla));
  });
  state.planTratamiento = null;
});

test('plan: varios síntomas en cadera — dosifica el más irritable, avisa del independiente y mantiene lo propio de cadera', () => {
  const v = () => ({ zonas: [], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: null, irritabilidad: '', relacion: '' });
  withState({ region: 'cadera', mecanismo: '', activeHypotheses: ['ca4'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 4, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['cadera_lat'] },
    sintomasSecundarios: [{ ...v(), zonas: ['muslo_ant'], nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.nombre, 'P2 · Muslo anterior');
    assert.equal(plan.irritabilidad, 'alta');
    assert.equal(plan.gravedadNRS, 'maxima', 'la gravedad sale del NRS de P2');
    assert.equal(plan.niveles.B, 1);
    assert.ok(plan.avisos.includes(D.AVISOS.dosificaOtro));
    assert.ok(plan.avisosHip.includes(`${D.AVISOS.independiente} (P2 · Muslo anterior)`));
    assert.ok(!plan.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA));
    // Lo propio de cadera sigue
    assert.equal(plan.familia, 'periferica');
    assert.equal(plan.escalones.B, D.ESCALONES_PERIFERICOS[1]);
    assert.ok(plan.avisosHip.includes(D.AVISOS.tendinopatiaGlutea));
    assert.deepEqual(plan.alarmasCasa, RED_CADERA());
    assert.match(P.textoPlanSesion(plan, {}), /Irritabilidad: Alta \(según P2 · Muslo anterior, el síntoma más irritable\)/);
  });
  // Un secundario de otra región («no valorada hoy») no dosifica
  withState({ region: 'cadera', mecanismo: '', activeHypotheses: ['ca4'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 4, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['cadera_lat'] },
    sintomasSecundarios: [{ ...v(), otraRegion: true, nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.n, 1);
    assert.ok(!plan.avisos.includes(D.AVISOS.dosificaOtro));
  });
  state.planTratamiento = null; state.sintomasSecundarios = [];
});

const RED_TOBILLO = () => [D.TEXTOS_CASA.alarmaFracturaEstresPie.texto, D.TEXTOS_CASA.alarmaInfeccionTobillo.texto, D.TEXTOS_CASA.alarmaTVP.texto];
const TP_DERIVAR = ['tp3', 'tp4', 'tp5', 'tp6', 'tp17', 'tp30', 'tp35', 'tp37'];
const TP_SIN_PAUTA = ['tp7', 'tp10', 'tp11', 'tp12', 'tp13', 'tp15', 'tp16', 'tp18', 'tp19', 'tp20', 'tp22', 'tp23', 'tp25', 'tp27', 'tp28', 'tp29', 'tp32', 'tp34'];

test('plan: tobillo y pie (periférica) — escalones, cantidad, progresión y reglas de Peripheral; con ella están las siete regiones; las demás, igual que antes', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const plan = (region, ids) => P.construirPlan({ region, severidad: 5, irritabilidad: MATRIZ('Ausente', 'Al final del rango con SP', 'Alta'), hipotesis: ids.map(hip), elegidas: ids });
  assert.ok(D.REGIONES_PLAN.includes('tobillo_pie'));
  assert.deepEqual([...D.REGIONES_PLAN].sort(), [...VALID_REGIONS].sort(), 'las siete regiones tienen plan');
  assert.equal(P.familiaRegion('tobillo_pie'), 'periferica');
  const t = plan('tobillo_pie', ['tp1']);
  assert.equal(t.familia, 'periferica');
  assert.equal(t.escalones.B, D.ESCALONES_PERIFERICOS[t.niveles.B]);
  assert.equal(t.escalones.C, D.ESCALONES_PERIFERICOS[4]);
  assert.deepEqual(t.sesion.cantidad, [D.TEXTOS_SESION.cantidadPeriferica]);
  assert.deepEqual(t.mes.progresion, [D.PROGRESION_GENERICA, D.PROGRESION_PERIFERICA]);
  assert.deepEqual(t.mes.reglas, D.REGLAS_MES_PERIFERICAS);
  for (const id of Object.keys(HYPOTHESES).filter(id => HYPOTHESES[id].region === 'tobillo_pie')) {
    assert.ok(!D.FAMILIA_HIP[id], `${id}: ninguna cambia de familia`);
    assert.equal(!!D.RED_HIP[id], ['tp8', 'tp9'].includes(id), `${id}: solo tp8 y tp9 traen red por id`);
  }
  const deTobillo = Object.entries(D.AVISOS_HIP).filter(([id]) => HYPOTHESES[id]?.region === 'tobillo_pie').flatMap(([, ks]) => ks).map(k => D.AVISOS[k]);
  for (const [region, id, fam] of [['lumbar', 'lu1', 'columna'], ['cervical', 'ce1', 'columna'], ['hombro', 'h2', 'periferica'], ['codo', 'co1', 'periferica'], ['rodilla', 'ro1', 'periferica'], ['cadera', 'ca1', 'periferica']]) {
    const p = plan(region, [id]);
    assert.equal(p.familia, fam, region);
    assert.ok(!p.avisosHip.some(a => deTobillo.includes(a)), `${region}: sin avisos de tobillo y pie`);
    const posq = P.construirPlan({ region, severidad: 5, hipotesis: [hip(id)], elegidas: [id], posq: { conProtocolo: true } });
    assert.ok(!posq.avisosHip.includes(D.AVISOS.posqTobillo), `${region}: sin el aviso posquirúrgico de tobillo y pie`);
    for (const k of ['alarmaFracturaEstresPie', 'alarmaInfeccionTobillo', 'alarmaRoturaAquiles']) assert.ok(!p.alarmasCasa.includes(D.TEXTOS_CASA[k].texto), `${region}: sin ${k}`);
  }
  assert.deepEqual(plan('cadera', ['ca1']).alarmasCasa, [D.TEXTOS_CASA.alarmaFracturaEstres.texto, D.TEXTOS_CASA.alarmaInfeccionCadera.texto, D.TEXTOS_CASA.alarmaTVP.texto], 'cadera mantiene la suya');
  assert.deepEqual(plan('rodilla', ['ro1']).alarmasCasa, [D.TEXTOS_CASA.alarmaInfeccionRodilla.texto, D.TEXTOS_CASA.alarmaTVP.texto], 'rodilla mantiene la suya');
  // Ya no hay aviso de piloto: sin región, la fase pide elegirla
  const ui = leer('plan.js');
  assert.ok(!/piloto/.test(ui)); assert.match(ui, /elígela en la fase 2/);
});

test('plan: tobillo y pie — las 8 «Derivar» no se pueden elegir; 18 sin pauta salen «a criterio del fisio»', () => {
  const ids = Object.keys(HYPOTHESES).filter(id => HYPOTHESES[id].region === 'tobillo_pie');
  assert.equal(ids.length, 37);
  assert.deepEqual(ids.filter(id => HYPOTHESES[id].dosis === DOSIS_DERIVAR).sort(), [...TP_DERIVAR].sort());
  assert.deepEqual(ids.filter(id => HYPOTHESES[id].dosis === '').sort(), [...TP_SIN_PAUTA].sort());
  for (const id of TP_DERIVAR) assert.ok(!P.elegible({ id, derivar: true, tratada: false }).ok, id);
  // Con estado real: una «Derivar» activa no es la hipótesis por defecto
  withState({ region: 'tobillo_pie', mecanismo: '', activeHypotheses: ['tp3', 'tp1'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    PLAN.planActual();
    assert.deepEqual(state.planTratamiento.hipotesis, ['tp1']);
  });
  state.planTratamiento = null;
  const p = P.construirPlan({ region: 'tobillo_pie', severidad: 5, hipotesis: [{ id: 'tp7', name: 'tp7', pauta: '', derivar: false, tratada: false }], elegidas: ['tp7'] });
  assert.ok(p.sesion.intervencion[0].sinPauta);
});

test('plan: tobillo y pie — avisos por hipótesis del cap. 16 y, con cirugía, prótesis y el propio de tobillo y pie', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const plan = (ids, extra = {}) => P.construirPlan({ region: 'tobillo_pie', severidad: 5, hipotesis: ids.map(hip), elegidas: ids, ...extra });
  const esperado = {
    tp1: ['esguinceTobillo'], tp2: ['sindesmosis'], tp8: ['aquiles', 'monitorizacionDolor'], tp9: ['aquiles', 'aquilesInsercional'], tp10: ['aquiles'],
    tp12: ['nervioTobillo'], tp14: ['tibialPosterior'], tp16: ['nervioTobillo'], tp21: ['inestabilidadTobillo'], tp24: ['artrosisTobillo'],
    tp26: ['talon'], tp28: ['nervioTobillo'], tp33: ['fracturaEstresMetatarsiano'], tp34: ['morton'], tp36: ['apofisitisPie'],
  };
  for (const [id, ks] of Object.entries(esperado)) assert.deepEqual(plan([id]).avisosHip, ks.map(k => D.AVISOS[k]), id);
  for (const id of ['tp7', 'tp11', 'tp13', 'tp15', 'tp18', 'tp19', 'tp20', 'tp22', 'tp23', 'tp25', 'tp27', 'tp29', 'tp31', 'tp32']) assert.deepEqual(plan([id]).avisosHip, [], `${id}: sin aviso propio`);
  for (const k of ['esguinceTobillo', 'sindesmosis', 'aquiles', 'aquilesInsercional', 'tibialPosterior', 'inestabilidadTobillo', 'talon', 'nervioTobillo', 'morton', 'artrosisTobillo', 'fracturaEstresMetatarsiano', 'posqTobillo']) assert.match(D.AVISOS[k], /Hengeveld y Banks 2005, cap\. (16|8)/, k);
  // tp1: cuadro 16.4 y la lesión periarticular reciente del cap. 8
  assert.match(D.AVISOS.esguinceTobillo, /cuadro 16\.4, pp\. 564–565/); assert.match(D.AVISOS.esguinceTobillo, /cap\. 8, p\. 220/); assert.match(D.AVISOS.esguinceTobillo, /6–8 semanas/);
  assert.match(HYPOTHESES.tp1.dosis, /Terapia manual dentro del movimiento sin dolor/);
  // tp2: su pauta no trae terapia manual; descarga y bota
  assert.ok(!/terapia manual/i.test(HYPOTHESES.tp2.dosis)); assert.match(HYPOTHESES.tp2.dosis, /3 semanas sin carga/); assert.match(D.AVISOS.sindesmosis, /cap\. 8, pp\. 224–225/);
  // tp8: Silbernagel solo en la porción media (decisión 14)
  assert.match(D.AVISOS.monitorizacionDolor, /Silbernagel 2007/); assert.ok(!plan(['tp9']).avisosHip.includes(D.AVISOS.monitorizacionDolor));
  assert.match(HYPOTHESES.tp9.dosis, /sin carga en dorsiflexión/); assert.match(D.AVISOS.aquilesInsercional, /Pringels 2025/);
  // tp21: la manipulación de la guía no está en los escalones (sin grado V)
  assert.match(HYPOTHESES.tp21.dosis, /manipulación/); assert.match(D.AVISOS.inestabilidadTobillo, /grado V/);
  // tp26: su pauta trae terapia manual articular talocrural
  assert.match(HYPOTHESES.tp26.dosis, /terapia manual articular \(sobre todo la dorsiflexión talocrural\)/); assert.match(D.AVISOS.talon, /pp\. 570–574/);
  // tp33 y tp36: los escalones no se aplican
  for (const k of ['fracturaEstresMetatarsiano', 'apofisitisPie']) assert.match(D.AVISOS[k], /escalones (de terapia manual )?no se aplican/, k);
  assert.match(HYPOTHESES.tp36.dosis, /Rathleff 2020|Osgood-Schlatter/);
  // Con mecanismo Post-quirúrgico: el de prótesis de las periféricas y, después, el de tobillo y pie
  const posq = plan(['tp1'], { posq: { conProtocolo: true } }).avisosHip;
  assert.ok(posq.indexOf(D.AVISOS.protesis) >= 0 && posq.indexOf(D.AVISOS.posqTobillo) > posq.indexOf(D.AVISOS.protesis));
  assert.ok(!plan(['tp1']).avisosHip.includes(D.AVISOS.posqTobillo));
  assert.ok(!posq.includes(D.AVISOS.posqRodilla) && !posq.includes(D.AVISOS.posqCadera));
  assert.deepEqual(D.AVISOS_POSQ_REGION.tobillo_pie, ['posqTobillo']);
});

test('plan: tobillo y pie — tp12, tp16, tp28 y tp34 (nervio periférico): exploración del nervio cada sesión, sin red neurológica ni regla de días', () => {
  const hip = id => ({ id, name: id, pauta: '', derivar: false, tratada: false });
  for (const id of ['tp12', 'tp16', 'tp28', 'tp34']) {
    assert.ok(D.HIP_NERVIO_PERIFERICO.includes(id) && !D.HIP_EXPLORACION_NEURO.includes(id) && !D.HIP_RADICULARES.includes(id), id);
    const p = P.construirPlan({ region: 'tobillo_pie', severidad: 9, hipotesis: [hip(id)], elegidas: [id] });
    assert.ok(p.nervio && !p.neuro, id);
    assert.ok(p.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionNervio), id);
    assert.ok(!p.sesion.reevaluacion.includes(D.TEXTOS_SESION.reevaluacionRadicular), id);
    assert.ok(!p.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA), `${id}: sin la regla de los días aunque el NRS sea 9`);
    assert.deepEqual(p.alarmasCasa, RED_TOBILLO(), `${id}: solo la red de siempre`);
  }
  assert.match(HYPOTHESES.tp12.name, /Neuropatía/); assert.match(HYPOTHESES.tp34.name, /Neuroma/);
  assert.match(HYPOTHESES.tp16.name, /Túnel del Tarso/); assert.match(HYPOTHESES.tp28.name, /Atrapamiento Nervioso/);
});

test('plan: tobillo y pie — red de fractura de estrés, infección y TVP siempre; rotura del Aquiles solo con tp8 y tp9; ni compartimental, ni neuropatía aguda, ni hematológicas, ni las demás posquirúrgicas', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const p = P.construirPlan({ region: 'tobillo_pie', severidad: 5, hipotesis: [hip('tp1')], elegidas: ['tp1'], posq: { conProtocolo: true } });
  assert.deepEqual(p.sesion.cierre, [D.TEXTOS_SESION.cierre, D.TEXTOS_SESION.cierreFracturaEstresPie, D.TEXTOS_SESION.cierreInfeccionTobillo, D.TEXTOS_SESION.cierreTVP]);
  const t = P.textoDomiciliario(p, {}, { ejercicios: 'X', parar: 'Y' });
  assert.ok(t.trimEnd().endsWith(RED_TOBILLO().join('\n\n')));
  assert.ok(t.includes(D.TEXTOS_CASA.cirujano.texto));
  for (const frag of ['compartimental', 'pálido', 'pulso', 'piernas', 'quimioterapia', 'hemofilia', 'herida', 'Aquiles', 'rodilla', 'cadera', 'codo']) assert.ok(!t.includes(frag), frag);
  // tp8 y tp9: además, la rotura del Aquiles (por id)
  for (const id of ['tp8', 'tp9']) {
    const a = P.construirPlan({ region: 'tobillo_pie', severidad: 5, hipotesis: [hip(id)], elegidas: [id] });
    assert.deepEqual(a.alarmasCasa, [...RED_TOBILLO(), D.TEXTOS_CASA.alarmaRoturaAquiles.texto], id);
    assert.equal(a.sesion.cierre.at(-1), D.TEXTOS_SESION.cierreRoturaAquiles, id);
  }
  const dos = P.construirPlan({ region: 'tobillo_pie', severidad: 5, hipotesis: [hip('tp8'), hip('tp9')], elegidas: ['tp8', 'tp9'] });
  assert.equal(dos.alarmasCasa.filter(x => x === D.TEXTOS_CASA.alarmaRoturaAquiles.texto).length, 1, 'sin repetir');
  assert.ok(!P.construirPlan({ region: 'tobillo_pie', severidad: 5, hipotesis: [hip('tp10')], elegidas: ['tp10'] }).alarmasCasa.includes(D.TEXTOS_CASA.alarmaRoturaAquiles.texto));
  // Los síntomas son los de las preguntas tp_o1, tp_i1, tp_v2, pq_tep y tp_t3
  const qs = Object.values(SYSTEMIC_SCREENING.tobillo_pie.sistemas).flatMap(s => s.preguntas);
  const q = id => qs.find(x => x.id === id);
  for (const id of ['tp_i1', 'tp_v2', 'pq_tep', 'tp_t1', 'tp_n1', 'hem_5', 'hem_6', 'pq_compart']) assert.ok(q(id)?.urgencia, `${id} es urgente`);
  assert.ok(!q('tp_o1').urgencia && !q('tp_t3').urgencia, 'fractura de estrés y rotura del Aquiles: derivar, no urgencia');
  assert.match(q('tp_o1').text, /no mejora al calentar y le molesta por la noche/);
  for (const frag of ['poco a poco', 'apoyar', 'actividad', 'calentar', 'noche', 'deja la actividad', 've al médico']) assert.ok(D.TEXTOS_CASA.alarmaFracturaEstresPie.texto.includes(frag), frag);
  assert.ok(!D.TEXTOS_CASA.alarmaFracturaEstresPie.texto.includes('hoy mismo'), 'tp_o1 deriva, no es urgencia');
  assert.match(q('tp_i1').text, /fiebre alta y malestar general/);
  for (const frag of ['hinchada, caliente y muy dolorosa', 'fiebre', 'mal en general', 'urgencias', 'Aunque no tengas fiebre']) assert.ok(D.TEXTOS_CASA.alarmaInfeccionTobillo.texto.includes(frag), frag);
  assert.match(q('tp_t3').razonamiento.detalle, /tendinopatía previa del Aquiles/);
  for (const frag of ['golpe o una patada', 'chasquido', 'puntillas', 'deja los ejercicios']) assert.ok(D.TEXTOS_CASA.alarmaRoturaAquiles.texto.includes(frag), frag);
  assert.match(D.TEXTOS_CASA.alarmaFracturaEstresPie.fuente, /^May y Marappa-Ganeshan 2023/);
  assert.match(D.TEXTOS_CASA.alarmaInfeccionTobillo.fuente, /^Momodu y Savaliya 2023/);
  assert.match(D.TEXTOS_CASA.alarmaRoturaAquiles.fuente, /cuadro 16\.5/);
  // Sin cirugía, la misma red
  assert.deepEqual(P.construirPlan({ region: 'tobillo_pie', severidad: 5, hipotesis: [hip('tp1')], elegidas: ['tp1'] }).alarmasCasa, RED_TOBILLO());
});

test('plan: tobillo y pie — frecuencia de la pauta (tp14 A, tp21 B, tp36 A, con nota); tp8 y tp9 son ejercicio; ninguna trae volumen propio de terapia manual', () => {
  const hip = id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false });
  const esperado = { tp14: 'A', tp21: 'B', tp36: 'A' };
  for (const [id, f] of Object.entries(esperado)) {
    assert.equal(P.frecuenciaPorDefecto(id), f, id);
    assert.deepEqual(P.construirPlan({ region: 'tobillo_pie', severidad: 5, hipotesis: [hip(id)], elegidas: [id] }).mes.notasPauta, [D.FRECUENCIA_PAUTA[id].nota], id);
  }
  assert.match(HYPOTHESES.tp14.dosis, /revisión semanal de 30 min durante 10 semanas/);
  assert.match(HYPOTHESES.tp21.dosis, /12 sesiones supervisadas de unos 20 min, 3 por semana durante 4 semanas/);
  assert.match(HYPOTHESES.tp8.dosis, /al menos 3 veces por semana/); assert.match(HYPOTHESES.tp9.dosis, /dos veces al día, 7 días por semana/);
  for (const id of Object.keys(HYPOTHESES).filter(id => HYPOTHESES[id].region === 'tobillo_pie')) {
    assert.ok(!D.VOLUMEN_PAUTA[id], id);
    if (!esperado[id]) assert.ok(!D.FRECUENCIA_PAUTA[id], id);
  }
});

test('plan: con estado de tobillo y pie real, la pauta de tp1, su aviso, la red de tobillo y pie y, con cirugía, sus avisos; tp21 propone el plan B', () => {
  withState({ region: 'tobillo_pie', mecanismo: '', activeHypotheses: ['tp1'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    const { plan } = PLAN.planActual();
    assert.deepEqual(state.planTratamiento.hipotesis, ['tp1']);
    assert.equal(state.planTratamiento.frecuencia, 'A');
    assert.equal(plan.sesion.intervencion[0].pauta, HYPOTHESES.tp1.dosis);
    assert.equal(plan.familia, 'periferica');
    assert.deepEqual(plan.alarmasCasa, RED_TOBILLO());
    assert.ok(plan.avisosHip.includes(D.AVISOS.esguinceTobillo));
  });
  state.planTratamiento = null;
  withState({ region: 'tobillo_pie', mecanismo: '', activeHypotheses: ['tp21'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    PLAN.planActual();
    assert.equal(state.planTratamiento.frecuencia, 'B', 'tp21 por defecto propone el plan B');
  });
  state.planTratamiento = null;
  withState({ region: 'tobillo_pie', mecanismo: 'Post-quirúrgico', cirugia: { intervencion: 'Reparación del ligamento peroneoastragalino anterior', fecha: '', semanasAprox: 8, protocolo: 'Escrito', restricciones: 'Sin inversión forzada 12 semanas', complicaciones: ['Ninguna'], complicacionOtra: '' },
    activeHypotheses: ['tp21'], hypothesisScores: {}, testResults: {}, planTratamiento: null }, () => {
    const { plan } = PLAN.planActual();
    assert.ok(plan.avisosHip.includes(D.AVISOS.protesis) && plan.avisosHip.includes(D.AVISOS.posqTobillo));
    assert.ok(!plan.avisosHip.includes(D.AVISOS.posqCadera));
  });
  state.planTratamiento = null;
});

test('plan: varios síntomas en tobillo y pie — dosifica el más irritable, avisa del independiente y mantiene lo propio de tobillo y pie', () => {
  const v = () => ({ zonas: [], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: null, irritabilidad: '', relacion: '' });
  withState({ region: 'tobillo_pie', mecanismo: '', activeHypotheses: ['tp8'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 4, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['aquiles'] },
    sintomasSecundarios: [{ ...v(), zonas: ['talon'], nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.nombre, 'P2 · Talón o planta');
    assert.equal(plan.irritabilidad, 'alta');
    assert.equal(plan.gravedadNRS, 'maxima', 'la gravedad sale del NRS de P2');
    assert.equal(plan.niveles.B, 1);
    assert.ok(plan.avisos.includes(D.AVISOS.dosificaOtro));
    assert.ok(plan.avisosHip.includes(`${D.AVISOS.independiente} (P2 · Talón o planta)`));
    assert.ok(!plan.mes.reglas.includes(D.REGLA_RADICULAR_SEVERA));
    // Lo propio de tobillo y pie sigue
    assert.equal(plan.familia, 'periferica');
    assert.equal(plan.escalones.B, D.ESCALONES_PERIFERICOS[1]);
    assert.ok(plan.avisosHip.includes(D.AVISOS.aquiles) && plan.avisosHip.includes(D.AVISOS.monitorizacionDolor));
    assert.deepEqual(plan.alarmasCasa, [...RED_TOBILLO(), D.TEXTOS_CASA.alarmaRoturaAquiles.texto]);
    assert.match(P.textoPlanSesion(plan, {}), /Irritabilidad: Alta \(según P2 · Talón o planta, el síntoma más irritable\)/);
  });
  // Un secundario de otra región («no valorada hoy») no dosifica
  withState({ region: 'tobillo_pie', mecanismo: '', activeHypotheses: ['tp8'], hypothesisScores: {}, testResults: {}, planTratamiento: null,
    severidad: 4, irritabilidadNivel: 'Moderada', irritabilidadDirecta: true,
    sintomaPrincipal: { ...v(), zonas: ['aquiles'] },
    sintomasSecundarios: [{ ...v(), otraRegion: true, nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }] }, () => {
    const { plan } = PLAN.planActual();
    assert.equal(plan.dosifica.n, 1);
    assert.ok(!plan.avisos.includes(D.AVISOS.dosificaOtro));
  });
  state.planTratamiento = null; state.sintomasSecundarios = [];
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

test('plan: cap. 9 de Peripheral (decisiones 60–63): hoja de registro común con su detalle, citas periféricas, anotar solo en el plan A, qué comparar en las reevaluaciones', () => {
  // 60: hoja de registro común, con posición, ritmo, duración e indicaciones dadas; cita los dos libros
  assert.ok(D.HOJA_REGISTRO.some(t => /posición del paciente y de la articulación/.test(t) && /ritmo/.test(t) && /duración/.test(t)));
  assert.ok(D.HOJA_REGISTRO.some(t => t.startsWith('Indicaciones dadas')));
  assert.match(D.FUENTE_REGISTRO, /^Maitland 2005/); assert.match(D.FUENTE_REGISTRO, /Hengeveld y Banks 2005, cap\. 9/);
  // 61: los textos de la sesión citan también Peripheral
  for (const k of ['reevaluacionSiguiente', 'educacionPrimera', 'cierre']) assert.match(D.TEXTOS_SESION[k], /Hengeveld y Banks 2005, cap\. 9, p\. 24[36]/, k);
  assert.match(D.TEXTOS_CASA.primeraSesion.fuente, /Hengeveld y Banks 2005, cap\. 9, p\. 243/);
  // 62: anotar qué hacía y qué ayudó, solo con el plan A
  const hs = [{ id: 'x', name: 'X', pauta: 'P.', derivar: false, tratada: false }];
  const plan = P.construirPlan({ hipotesis: hs, elegidas: ['x'], severidad: 5 });
  const casa = f => P.textoDomiciliario(plan, {}, { ejercicios: 'X', parar: 'Y', frecuencia: f });
  assert.ok(casa('A').includes(D.TEXTOS_CASA.anotarAumento.texto));
  assert.ok(!casa('B').includes(D.TEXTOS_CASA.anotarAumento.texto));
  assert.ok(!casa('').includes(D.TEXTOS_CASA.anotarAumento.texto));
  assert.match(D.PLANES_MES.A.notas[0], /qué estaba haciendo y qué le ayudó \(Hengeveld y Banks 2005, cap\. 9, p\. 247\)/);
  // 63: qué comparar en las reevaluaciones, en el plan y en el texto del mes
  assert.deepEqual(plan.mes.retrospectiva, D.REEVALUACION_RETROSPECTIVA);
  const mes = P.textoPlanMes(plan, {}, 'B');
  assert.match(mes, /En las reevaluaciones intermedia y final, comparar \(Hengeveld y Banks 2005, cap\. 9, p\. 246\): bienestar general/);
  assert.match(mes, /HOJA DE REGISTRO DE CADA SESIÓN \(Maitland 2005, cap\. 9, tabla 9\.3, p\. 226; Hengeveld y Banks 2005/);
  const ui = leer('plan.js');
  assert.match(ui, /plan\.fuenteRegistro/); assert.match(ui, /plan\.mes\.retrospectiva/);
  assert.match(ui, /frecuencia: pt\.frecuencia \}\);/);
});
