// Fase 6 «Plan de tratamiento», parte sin IA: funciones puras. Reciben una
// «entrada» ya resuelta (plan.js la arma desde el state) y devuelven el plan y
// sus textos para compartir. Diseño: docs/plan-tratamiento.md. Contenido
// clínico y fuentes: data/plan-tratamiento.js.
import {
  ESCALONES, TEXTO_NIVELES, AVISOS, BLOQUES_SESION, TEXTOS_SESION, PLANES_MES,
  PROGRESION_GENERICA, REGLAS_MES, REGLA_RADICULAR_SEVERA, HOJA_REGISTRO,
} from '../data/plan-tratamiento.js';

export const NIVELES_GRAVEDAD = ['minima', 'moderada', 'maxima'];
export const NIVELES_IRRITABILIDAD = ['baja', 'moderada', 'alta'];
export const NOMBRE_GRAVEDAD = { minima: 'Mínima', moderada: 'Moderada', maxima: 'Máxima' };
export const NOMBRE_IRRITABILIDAD = { baja: 'Baja', moderada: 'Moderada', alta: 'Alta' };

// Gravedad por el NRS con los cortes de SINSS: 0–3 mínima, 4–7 moderada,
// 8–10 máxima (Petersen 2021, tabla 2). Sin NRS → null.
export function gravedadSINSS(nrs) {
  if (nrs == null || nrs === '' || !Number.isFinite(Number(nrs))) return null;
  const n = Number(nrs);
  return n <= 3 ? 'minima' : n <= 7 ? 'moderada' : 'maxima';
}

// La matriz de la fase 3 mezcla gravedad (dolor, discapacidad) e irritabilidad
// (dolor en reposo, movimiento, tolerancia). La fase 6 usa solo los tres
// ítems de irritabilidad (decisión 12), con los cortes de la matriz de la app
// llevados a su escala: la matriz suma 0–10 (≤ 4 baja, 5–9 moderada, 10 alta);
// tres ítems suman 0–6 → 0–2 baja, 3–5 moderada, 6 alta.
export const ITEMS_IRRITABILIDAD = {
  reposo: ['Ausente', 'Intermitente', 'Presente'],
  movimiento: ['Al final del rango con SP', 'Al final del rango', 'Antes del final del rango'],
  tolerancia: ['Alta', 'Moderada', 'Baja'],
};
const DESDE_NIVEL = { Baja: 'baja', Moderada: 'moderada', Alta: 'alta' };

export function irritabilidadSINSS({ irritabilidad, irritabilidadNivel, irritabilidadDirecta } = {}) {
  const porNivel = DESDE_NIVEL[irritabilidadNivel] || null;
  if (irritabilidadDirecta) return { nivel: porNivel, estimada: true };
  let suma = 0;
  for (const [k, opciones] of Object.entries(ITEMS_IRRITABILIDAD)) {
    const i = opciones.indexOf(irritabilidad?.[k]);
    if (i < 0) return { nivel: porNivel, estimada: true };
    suma += i;
  }
  return { nivel: suma <= 2 ? 'baja' : suma <= 5 ? 'moderada' : 'alta', estimada: false };
}

// Escalón de B (1 muy suave … 4 firme) por gravedad × irritabilidad
// (Petersen 2021: las dos altas → solo hasta el límite activo; gravedad alta e
// irritabilidad baja → hasta el límite pasivo; gravedad baja e irritabilidad
// alta → prudencia cerca del dolor; las dos bajas → más agresivo). Sin
// gravedad se toma la máxima, que es lo prudente.
export function escalonB(gravedad, irritabilidad) {
  const g = gravedad || 'maxima';
  if (irritabilidad === 'alta') return g === 'minima' ? 2 : 1;
  if (irritabilidad === 'moderada') return 2;
  return g === 'minima' ? 4 : 3;
}

// A, B y C (decisiones 1, 11, 13, 17): A un escalón menos, C uno más y solo
// con irritabilidad baja y síntomas que no empeoran. El miedo al movimiento no
// bloquea C.
export function niveles({ gravedad, irritabilidad, estabilidad }) {
  const b = escalonB(gravedad, irritabilidad);
  const a = Math.max(1, b - 1);
  let c = null, sinC = null;
  if (irritabilidad !== 'baja') sinC = TEXTO_NIVELES.sinC.irritabilidad;
  else if (estabilidad === 'Empeora') sinC = TEXTO_NIVELES.sinC.estabilidad;
  else if (b >= 4) sinC = TEXTO_NIVELES.sinC.tope;
  else c = b + 1;
  return { A: a, B: b, C: c, sinC, aIgual: a === b };
}

// Bloqueos que impiden cualquier plan (decisión 5): urgencias de la fase 2 y
// derivaciones del árbol sin resolver.
export function bloqueosPlan({ urgencias = [], derivaciones = [] } = {}) {
  const b = [];
  if (urgencias.length) b.push({ tipo: 'urgencia', titulo: 'Derivación urgente pendiente', lineas: urgencias });
  if (derivaciones.length) b.push({ tipo: 'derivacion', titulo: 'Derivación médica pendiente', lineas: derivaciones });
  return b;
}

// Una hipótesis se puede planificar si no es de «Derivar» sin marcar como
// tratada, ni una regional ya tratada (con cirugía, la cubre la posquirúrgica).
export function elegible(h) {
  if (h.posq) return { ok: true };
  if (h.derivar && !h.tratada) return { ok: false, motivo: 'Derivar: sin tratamiento de fisioterapia hasta el diagnóstico médico.' };
  if (h.tratada) return { ok: false, motivo: 'Marcada como ya diagnosticada y tratada.' };
  return { ok: true };
}

// Hipótesis por defecto: la posquirúrgica si la hay; si no, la primera
// elegible (la entrada ya viene ordenada por peso, como en la fase 5).
export function hipotesisPorDefecto(hipotesis = []) {
  const posq = hipotesis.find(h => h.posq);
  if (posq) return posq.id;
  return hipotesis.find(h => elegible(h).ok)?.id || null;
}

export const esRadicular = h => /radicul/i.test(h?.name || '');

// Entrada (plan.js):
// { region, regionTexto, modo, posq: { conProtocolo, semanas, restricciones } | null,
//   urgencias, derivaciones, hipotesis: [{ id, name, prom, pauta, pautaFuente, derivar,
//   tratada, posq, pronostico, sinTests }], elegidas: [id, id?], severidad,
//   irritabilidad, irritabilidadNivel, irritabilidadDirecta, estabilidad, riesgoPsico,
//   psico_miedo, signoComparable, sesion: 'primera'|'siguiente',
//   gravedadManual, irritabilidadManual }
export function construirPlan(e) {
  const bloqueos = bloqueosPlan(e);
  const gravedadNRS = gravedadSINSS(e.severidad);
  const irr = irritabilidadSINSS(e);
  const gravedad = e.gravedadManual || gravedadNRS;
  const irritabilidad = e.irritabilidadManual || irr.nivel || 'alta';
  const avisos = [AVISOS.propuesta, AVISOS.orientativo];
  if (!gravedad) avisos.push(AVISOS.sinNRS);
  if (!e.irritabilidadManual && irr.estimada) avisos.push(AVISOS.estimada);
  if (e.psico_miedo === 'Sí' || e.riesgoPsico === 'Alto') avisos.push(AVISOS.miedo);

  const porId = Object.fromEntries((e.hipotesis || []).map(h => [h.id, h]));
  const elegidas = (e.elegidas || []).map(id => porId[id]).filter(h => h && elegible(h).ok);
  const nv = niveles({ gravedad, irritabilidad, estabilidad: e.estabilidad });
  const primera = (e.sesion || 'primera') === 'primera';
  const radicular = elegidas.some(esRadicular);

  const avisosHip = [];
  if (e.modo === 'breve' && elegidas.some(h => !h.posq && h.sinTests)) avisosHip.push(AVISOS.breveSinTests);
  if (e.posq) avisosHip.push(e.posq.conProtocolo ? AVISOS.posqProtocolo : AVISOS.posqSinProtocolo);
  if (elegidas.some(h => h.id === 'ce13')) avisosHip.push(AVISOS.vertigo);
  if (elegidas.length > 1) avisosHip.push('Dos hipótesis: la intervención principal se reparte entre ambas y el tiempo de cada una baja.');

  const intervencion = elegidas.map(h => ({
    id: h.id, name: h.name, posq: !!h.posq,
    pauta: h.pauta || '', pautaFuente: h.pautaFuente || '',
    sinPauta: !h.pauta,
  }));

  const reevaluacion = [TEXTOS_SESION.reevaluacionBase + (e.signoComparable ? ` Signo comparable registrado: «${e.signoComparable}».` : '')];
  if (!primera) reevaluacion.push(TEXTOS_SESION.reevaluacionSiguiente);
  if (radicular) reevaluacion.push(TEXTOS_SESION.reevaluacionRadicular);
  const educacion = [TEXTOS_SESION.educacionBase];
  if (primera) educacion.push(TEXTOS_SESION.educacionPrimera);

  const reglasMes = [...REGLAS_MES];
  if (radicular && gravedad === 'maxima') reglasMes.push(REGLA_RADICULAR_SEVERA);

  return {
    bloqueado: bloqueos.length > 0,
    bloqueos,
    avisos,
    avisosHip,
    gravedad, gravedadNRS, irritabilidad, irritabilidadCalculada: irr.nivel, irritabilidadEstimada: irr.estimada,
    niveles: nv,
    escalones: { A: ESCALONES[nv.A], B: ESCALONES[nv.B], C: nv.C ? ESCALONES[nv.C] : null },
    primera,
    hipotesis: elegidas,
    sesion: {
      bloques: BLOQUES_SESION.map(b => ({ ...b })),
      reevaluacion, educacion, intervencion,
      notaPrimera: primera ? TEXTOS_SESION.primeraSesion : '',
      cantidad: TEXTOS_SESION.cantidad,
      domiciliario: TEXTOS_SESION.domiciliario,
      cierre: TEXTOS_SESION.cierre,
    },
    mes: {
      A: PLANES_MES.A, B: PLANES_MES.B,
      prom: [...new Set(elegidas.map(h => h.prom).filter(Boolean))],
      progresion: PROGRESION_GENERICA,
      reglas: reglasMes,
      pronostico: elegidas.filter(h => h.pronostico).map(h => ({ name: h.name, ...h.pronostico })),
      posq: e.posq ? { ...e.posq } : null,
    },
    registro: HOJA_REGISTRO,
  };
}

// ─── Textos para compartir ───────────────────────────────────────
const linea = t => `- ${t}`;
const cab = (titulo, e) => [titulo, [e.paciente, e.regionTexto, e.fecha].filter(Boolean).join(' · '), ''];

function bloqueoTexto(plan) {
  return plan.bloqueos.flatMap(b => [`⚠ ${b.titulo}:`, ...b.lineas.map(linea)]).concat(['', 'Sin plan de tratamiento hasta resolverlo.']);
}

export function textoPlanSesion(plan, e, nivel = 'B') {
  const out = cab('PLAN DE SESIÓN (50 min) — propuesta', e);
  if (plan.bloqueado) return out.concat(bloqueoTexto(plan)).join('\n');
  const esc = plan.escalones[nivel] || plan.escalones.B;
  out.push(`Gravedad: ${NOMBRE_GRAVEDAD[plan.gravedad] || 'sin registrar'} · Irritabilidad: ${NOMBRE_IRRITABILIDAD[plan.irritabilidad]}`);
  out.push(`Nivel ${nivel} · ${esc.nombre} (${esc.modo})`);
  out.push(...plan.avisosHip.map(a => `⚠ ${a}`));
  if (plan.sesion.notaPrimera) out.push(plan.sesion.notaPrimera);
  out.push('');
  const s = plan.sesion;
  const contenido = {
    reevaluacion: s.reevaluacion,
    educacion: s.educacion,
    intervencion: [
      ...s.intervencion.map(h => `${h.name}: ${h.sinPauta ? 'pauta a criterio del fisioterapeuta.' : h.pauta}${h.pautaFuente ? ` (${h.pautaFuente})` : ''}`),
      `Terapia manual, nivel ${nivel}: ${esc.texto}`,
      s.cantidad,
    ],
    domiciliario: [s.domiciliario],
    cierre: [s.cierre],
  };
  for (const b of s.bloques) {
    out.push(`${b.titulo.toUpperCase()} (${b.minutos} min)`);
    out.push(...(contenido[b.id] || []).map(linea), '');
  }
  out.push('Minutos orientativos: organización de la sesión, no evidencia.');
  return out.join('\n');
}

export function textoPlanMes(plan, e, frecuencia = 'A') {
  const out = cab('PLAN DEL MES — propuesta', e);
  if (plan.bloqueado) return out.concat(bloqueoTexto(plan)).join('\n');
  const p = plan.mes[frecuencia] || plan.mes.A;
  out.push(p.nombre, '');
  out.push(linea(`Sesiones: ${p.sesiones}`));
  out.push(linea(`Reevaluación intermedia: ${p.intermedia}`));
  out.push(linea(`Reevaluación final: ${p.final}${plan.mes.prom.length ? `, con ${plan.mes.prom.join(' / ')}` : ''}`));
  out.push(linea(`Peso del programa domiciliario: ${p.domiciliario}`));
  out.push(...p.notas.map(linea));
  if (plan.mes.posq) out.push(linea(`Posquirúrgico${plan.mes.posq.semanas != null ? `, semana ${plan.mes.posq.semanas} tras la cirugía` : ''}: ${plan.mes.posq.conProtocolo ? AVISOS.posqProtocolo : AVISOS.posqSinProtocolo}`));
  out.push('', 'PROGRESIÓN', linea(plan.mes.progresion), '', 'SEGUIR O CAMBIAR', ...plan.mes.reglas.map(linea));
  if (plan.mes.pronostico.length) {
    out.push('', 'PRONÓSTICO Y CUÁNDO RECONSIDERAR');
    plan.mes.pronostico.forEach(pr => {
      if (pr.horizonte) out.push(linea(`${pr.name}: ${pr.horizonte}`));
      if (pr.derivacion) out.push(linea(`Reconsiderar o derivar si: ${pr.derivacion}`));
    });
  }
  out.push('', 'HOJA DE REGISTRO DE CADA SESIÓN', ...plan.registro.map(linea));
  return out.join('\n');
}

// Programa domiciliario para el paciente: lenguaje llano, sin escalones ni
// fuentes. Lo que hará en casa lo escribe el fisio (notas.domiciliario); las
// notas del plan de la fase 5 se reutilizan si están rellenas.
export function textoDomiciliario(plan, e, { ejercicios = '', planNotes = {} } = {}) {
  const out = ['PROGRAMA PARA CASA', [e.paciente, e.fecha].filter(Boolean).join(' · '), ''];
  if (plan.bloqueado) return out.concat(['Antes de empezar el tratamiento hace falta una valoración médica. Tu fisioterapeuta te indicará los pasos.']).join('\n');
  out.push('Qué hacer:', ejercicios.trim() || '(Tu fisioterapeuta te indicará los ejercicios.)', '');
  if (planNotes.anclajeHabito) out.push('Cuándo hacerlo:', planNotes.anclajeHabito, '');
  out.push('Cuándo parar:', planNotes.variableControl || '(Tu fisioterapeuta te indicará cuándo parar.)', '');
  out.push('Al día siguiente:', planNotes.ventanaRecuperacion || 'Fíjate en cómo estás a las 24 horas y anótalo para la próxima sesión.', '');
  // Aviso de la primera sesión (Maitland 2005, cap. 9, p. 219)
  if (plan.primera) out.push('Después de esta primera sesión puedes notar un aumento temporal de las molestias.', '');
  if (plan.mes.posq) out.push('Sigue siempre las indicaciones de tu cirujano.', '');
  out.push('Si algo empeora mucho o aparece algo nuevo, coméntalo con tu fisioterapeuta antes de la próxima sesión.');
  return out.join('\n');
}
