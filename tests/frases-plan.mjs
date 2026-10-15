// Documento de revisión de los textos de la fase 6 (docs/plan-tratamiento-frases.md):
// cada frase que puede leer el fisio o el paciente, con su fuente o «redacción
// propia», para revisarla línea por línea. Lo genera tests/gen-frases-plan.mjs
// y tests/unit.js falla si no está al día (como docs/referencias.md).

const NOMBRE_TIPO = {
  app: 'describe la app (no afirma nada clínico)',
  organizacion: 'organización de la sesión (orientativa, editable; no evidencia)',
  etiqueta: 'etiqueta',
  redaccion: '**redacción propia**',
};
function tipoLegible(tipo) {
  if (!tipo) return '**redacción propia**';
  const [k, n] = tipo.split(':');
  if (k === 'decision') return `decisión ${n} de docs/plan-tratamiento.md`;
  if (k === 'principio') return `principio ${n} de docs/plan-tratamiento.md`;
  return NOMBRE_TIPO[k] || tipo;
}

// Fuente de un texto: las claves de FUENTES_PLAN que cita dentro; si no cita
// ninguna, su tipo en TIPO_TEXTO (sin tipo = redacción propia).
function fuenteDe(texto, fuentes, tipo) {
  const citadas = fuentes.filter(k => texto.includes(k));
  return citadas.length ? `fuente en el texto (${citadas.join(', ')})` : tipoLegible(tipo);
}

const item = (texto, fuente) => `- [ ] «${texto}»  \n  ↳ ${fuente}`;

export function construirFrases(D, P) {
  const F = D.FUENTES_PLAN;
  const tipos = D.TIPO_TEXTO || {};
  const auto = (t, clave) => item(t, fuenteDe(t, F, tipos[clave]));
  const grupo = (nombre, obj) => Object.entries(obj).forEach(([k, t]) => out.push(auto(t, `${nombre}.${k}`)));
  const out = [];
  const sec = (titulo, ayuda) => { out.push('', `## ${titulo}`, ''); if (ayuda) out.push(ayuda, ''); };

  out.push(
    '# Fase 6 · Frases para revisar',
    '',
    '> Generado por `node tests/gen-frases-plan.mjs` a partir de `data/plan-tratamiento.js` y `lib/plan-tratamiento.js`. No lo edites a mano: cambia el texto en `data/plan-tratamiento.js` y regenera (`tests/unit.js` falla si no está al día).',
    '',
    'Cómo revisarlo: marca cada casilla que valga tal cual y anota debajo las que haya que cambiar. «Redacción propia» = la frase no sale de ninguna fuente leída; son las que más necesitan tu revisión. Las cifras y páginas citadas están comprobadas contra las fuentes leídas (notas en `docs/plan-tratamiento.md`, «Fuentes leídas», en el razonamiento de la pregunta `l6` para Finucane 2020, en el de `cv3` para Margetis y Donnally 2025 y en el de `cv_ar1` y `cv_ar2` para Rushton 2023).',
  );

  sec('1. Programa para casa (lo lee el paciente)',
    'Va tal cual en «📤 Compartir → Programa para casa». «Qué hacer» y «Cuándo parar» los escribe el fisio (si «Cuándo parar» queda vacío, se usa la variable de control de la fase 5); lo que falte no sale, y compartir pide confirmación antes. «Cuándo hacerlo» y «Al día siguiente» usan las notas de la fase 5 si están rellenas. Las últimas frases (urgencias) son la red de seguridad de la región (sección 2): la neurológica solo con una hipótesis neurológica, la de siempre con cualquier plan de esa región. Con el plan bloqueado por una urgencia o una derivación no hay programa para casa.');
  for (const [k, v] of Object.entries(D.TEXTOS_CASA)) out.push(item(v.texto, v.fuente ? `fuente: ${v.fuente}` : tipoLegible(v.tipo)) + `  \n  ↳ clave \`${k}\``);

  sec('2. Reglas de decisión (no son frases, pero deciden qué sale)');
  out.push(
    `- [ ] Gravedad por NRS: 0–3 mínima, 4–7 moderada, 8–10 máxima.  \n  ↳ fuente: Petersen 2021, tabla 2`,
    `- [ ] Irritabilidad: suma de reposo + movimiento + tolerancia de la matriz (0–2 cada uno), 0–1 baja, 2–4 moderada, 5–6 alta.  \n  ↳ **decisión de diseño** (cortes asimétricos hacia lo prudente; revisión clínica 2026-10)`,
    `- [ ] Sin NRS: gravedad máxima (prudente), con enlace para registrarlo en la fase 3.  \n  ↳ **decisión de diseño**`,
  );
  const filas = P.NIVELES_IRRITABILIDAD.map(i => `| ${P.NOMBRE_IRRITABILIDAD[i]} | ${P.NIVELES_GRAVEDAD.slice().reverse().map(g => {
    const n = P.niveles({ gravedad: g, irritabilidad: i });
    return `B ${n.B}${n.C ? ` (C ${n.C})` : ''}`;
  }).join(' | ')} |`);
  out.push('', '- [ ] Escalón de la propuesta B (A = B − 1, mínimo 1; C = B + 1 solo con irritabilidad baja y síntomas que no empeoran):', '',
    '| Irritabilidad | Gravedad máxima | Gravedad moderada | Gravedad mínima |', '|---|---|---|---|', ...filas, '',
    '  ↳ Petersen 2021 (combinación gravedad × irritabilidad); concreción en escalones: **decisión de diseño** (revisión clínica 2026-10: alta siempre 1, B nunca 4).');
  const nombre = id => `\`${id}\``;
  out.push('',
    `- [ ] Exploración neurológica al empezar cada sesión: ${D.HIP_EXPLORACION_NEURO.map(nombre).join(', ')}.  \n  ↳ fuente: Maitland 2005, cap. 6, p. 136`,
    `- [ ] Regla de los 7–10 días: ${D.HIP_RADICULARES.map(nombre).join(', ')}, solo con NRS registrado de 8 o más.  \n  ↳ fuente: Maitland 2005, cap. 9, p. 217`);
  for (const [id, motivo] of Object.entries(D.HIP_NEURO_DESCARTADAS)) out.push(`- [ ] ${nombre(id)} no cuenta como neurológica: ${motivo}  \n  ↳ **decisión de diseño**`);
  const CUANDO = { neuro: 'con una hipótesis neurológica', siempre: 'con cualquier plan de la región' };
  for (const [region, r] of Object.entries(D.RED_SEGURIDAD)) {
    const partes = Object.entries(r).map(([k, x]) => `${CUANDO[k]}, cierre \`${x.cierre}\` y casa \`${x.casa}\``);
    out.push(`- [ ] Red de seguridad de ${region}: ${partes.join('; ')}.  \n  ↳ **decisión de diseño** (los textos, con su fuente, en las secciones 1 y 6)`);
  }
  for (const [id, k] of Object.entries(D.VOLUMEN_PAUTA)) out.push(`- [ ] Con ${nombre(id)}, la cantidad de terapia manual es la de su pauta: \`TEXTOS_SESION.${k}\` (sección 6) en vez de la genérica.  \n  ↳ **decisión de diseño** (decisión 41)`);
  for (const [id, f] of Object.entries(D.FRECUENCIA_PAUTA)) out.push(`- [ ] Con ${nombre(id)} como hipótesis por defecto, el plan del mes empieza en ${f.plan} (sección 7).  \n  ↳ **decisión de diseño** (decisión 42)`);
  for (const [id, ks] of Object.entries(D.AVISOS_HIP)) out.push(`- [ ] Avisos con ${nombre(id)}: ${ks.map(k => `\`AVISOS.${k}\``).join(', ')} (sección 5).  \n  ↳ **decisión de diseño**`);

  sec('3. Escalones de terapia manual');
  for (const [n, e] of Object.entries(D.ESCALONES)) out.push(item(`${n} · ${e.nombre} (${e.modo}): ${e.texto}`, `fuente: ${e.citas.join(' · ')}`));

  sec('4. Propuestas A, B y C');
  for (const k of ['A', 'B', 'C', 'aIgual']) out.push(auto(D.TEXTO_NIVELES[k], `TEXTO_NIVELES.${k}`));
  grupo('TEXTO_NIVELES.sinC', D.TEXTO_NIVELES.sinC);

  sec('5. Avisos de la fase');
  grupo('AVISOS', D.AVISOS);
  out.push(item(P.textoPosq(true), 'texto de la fase 5 (`TEXTO_PAUTA_COMPATIBLE`, lib/posquirurgico.js), ya revisado: posquirúrgico con protocolo'));
  out.push(item(P.textoPosq(false), 'texto de la fase 5 (`TEXTO_SIN_PROTOCOLO`, lib/posquirurgico.js), ya revisado: posquirúrgico sin protocolo'));

  sec('6. Sesión de 50 minutos', 'Minutos orientativos y editables en la fase 6 (organización de la sesión, no evidencia).');
  for (const b of P.rangosBloques().bloques) out.push(item(`${b.titulo}: ${b.duracion} min (${b.minutos})`, '**organización orientativa**'));
  grupo('TEXTOS_SESION', D.TEXTOS_SESION);

  sec('7. Plan de un mes');
  for (const p of [D.PLANES_MES.A, D.PLANES_MES.B]) {
    out.push(item(`${p.nombre}: ${p.sesiones} sesiones; reevaluación intermedia ${p.intermedia}; final ${p.final}; programa domiciliario: ${p.domiciliario}`, '**organización orientativa**'));
    p.notas.forEach((t, i) => out.push(auto(t, `PLANES_MES.notas.${i}`)));
  }
  for (const [id, f] of Object.entries(D.FRECUENCIA_PAUTA)) out.push(auto(f.nota, `FRECUENCIA_PAUTA.${id}.nota`));
  out.push(auto(D.PROGRESION_GENERICA, 'PROGRESION_GENERICA'));
  D.REGLAS_MES.forEach((t, i) => out.push(auto(t, `REGLAS_MES.${i}`)));
  out.push(auto(D.REGLA_RADICULAR_SEVERA, 'REGLA_RADICULAR_SEVERA'));

  sec('8. Hoja de registro de cada sesión', 'Fuente: Maitland 2005, cap. 9, tabla 9.3, p. 226.');
  for (const t of D.HOJA_REGISTRO) out.push(item(t, 'fuente: Maitland 2005, cap. 9, tabla 9.3'));

  const propias = out.filter(l => l.includes('**redacción propia**')).length;
  out.splice(5, 0, '', `Redacción propia: **${propias}** frase${propias === 1 ? '' : 's'}.`);
  return out.join('\n') + '\n';
}
