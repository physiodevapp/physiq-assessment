// Fase 6 «Plan de tratamiento», parte sin IA (lib/plan-tratamiento.js,
// data/plan-tratamiento.js, plan.js; docs/plan-tratamiento.md). Se ejecuta
// desde tests/unit.js.
import { assert, leer, test, state, withState, buildPhysiQPayload, buildContextSummaryText, buildInformeFisioterapiaText, DOSIS_DERIVAR, HYPOTHESES, SYSTEMIC_SCREENING } from './comun.mjs';
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
    const esperadas = [red.neuro, red.siempre].filter(Boolean);
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
  // Sin región, o con una sin entrada, no hay red de seguridad
  for (const region of [undefined, 'codo']) {
    const p = P.construirPlan({ ...base, region, hipotesis: [hip('ce3')], elegidas: ['ce3'] });
    assert.deepEqual(p.sesion.cierre, [D.TEXTOS_SESION.cierre], String(region));
    assert.deepEqual(p.alarmasCasa, []);
  }
  // Cada entrada apunta a textos que existen; toda región del plan tiene la suya
  for (const region of D.REGIONES_PLAN) assert.ok(D.RED_SEGURIDAD[region], `${region} sin RED_SEGURIDAD`);
  for (const [region, r] of Object.entries(D.RED_SEGURIDAD)) for (const [k, x] of Object.entries(r)) {
    assert.ok(['neuro', 'siempre'].includes(k), `${region}.${k}`);
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
  // Ninguna pauta de hombro fija volumen ni frecuencia; sin hipótesis neurológicas
  for (const id of Object.keys(HYPOTHESES).filter(id => HYPOTHESES[id].region === 'hombro')) {
    assert.ok(!D.VOLUMEN_PAUTA[id] && !D.FRECUENCIA_PAUTA[id], id);
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
