// Documento de revisión de los textos de la fase 6 (docs/plan-tratamiento-frases.md):
// cada frase que puede leer el fisio o el paciente, con su fuente o «redacción
// propia», para revisarla línea por línea. Lo genera tests/gen-frases-plan.mjs
// y tests/unit.js falla si no está al día (como docs/referencias.md).

// Fuente de un texto: las claves de FUENTES_PLAN que cita dentro.
function fuenteDe(texto, fuentes) {
  const citadas = fuentes.filter(k => texto.includes(k));
  return citadas.length ? `fuente en el texto (${citadas.join(', ')})` : '**redacción propia**';
}

const item = (texto, fuente) => `- [ ] «${texto}»  \n  ↳ ${fuente}`;

export function construirFrases(D, P) {
  const F = D.FUENTES_PLAN;
  const auto = t => item(t, fuenteDe(t, F));
  const out = [];
  const sec = (titulo, ayuda) => { out.push('', `## ${titulo}`, ''); if (ayuda) out.push(ayuda, ''); };

  out.push(
    '# Fase 6 · Frases para revisar',
    '',
    '> Generado por `node tests/gen-frases-plan.mjs` a partir de `data/plan-tratamiento.js` y `lib/plan-tratamiento.js`. No lo edites a mano: cambia el texto en `data/plan-tratamiento.js` y regenera (`tests/unit.js` falla si no está al día).',
    '',
    'Cómo revisarlo: marca cada casilla que valga tal cual y anota debajo las que haya que cambiar. «Redacción propia» = la frase no sale de ninguna fuente leída; son las que más necesitan tu revisión. Las cifras y páginas citadas están comprobadas contra los PDF que me pasaste (notas en `docs/plan-tratamiento.md`, «Fuentes leídas»).',
  );

  sec('1. Programa para casa (lo lee el paciente)',
    'Va tal cual en «📤 Compartir → Programa para casa». Lo que hará en casa y cuándo parar los escribe el fisio; si «Cuándo parar» queda vacío, se usa la variable de control de la fase 5 y, sin ninguna, la sección no sale y compartir pide confirmación. «Cuándo hacerlo» y «Al día siguiente» usan las notas de la fase 5 si están rellenas.');
  for (const [k, v] of Object.entries(D.TEXTOS_CASA)) out.push(item(v.texto, v.fuente ? `fuente: ${v.fuente}` : '**redacción propia**') + `  \n  ↳ clave \`${k}\``);

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

  sec('3. Escalones de terapia manual');
  for (const [n, e] of Object.entries(D.ESCALONES)) out.push(item(`${n} · ${e.nombre} (${e.modo}): ${e.texto}`, `fuente: ${e.citas.join(' · ')}`));

  sec('4. Propuestas A, B y C');
  for (const k of ['A', 'B', 'C']) out.push(auto(D.TEXTO_NIVELES[k]));
  for (const t of Object.values(D.TEXTO_NIVELES.sinC)) out.push(auto(t));
  out.push(auto(D.TEXTO_NIVELES.aIgual));

  sec('5. Avisos de la fase');
  for (const t of Object.values(D.AVISOS)) out.push(auto(t));

  sec('6. Sesión de 50 minutos', 'Minutos orientativos y editables en la fase 6 (organización de la sesión, no evidencia).');
  for (const b of P.rangosBloques().bloques) out.push(item(`${b.titulo}: ${b.duracion} min (${b.minutos})`, '**organización orientativa**'));
  for (const t of Object.values(D.TEXTOS_SESION)) out.push(auto(t));

  sec('7. Plan de un mes');
  for (const p of [D.PLANES_MES.A, D.PLANES_MES.B]) {
    out.push(item(`${p.nombre}: ${p.sesiones} sesiones; reevaluación intermedia ${p.intermedia}; final ${p.final}; programa domiciliario: ${p.domiciliario}`, '**organización orientativa**'));
    for (const t of p.notas) out.push(auto(t));
  }
  out.push(auto(D.PROGRESION_GENERICA));
  for (const t of D.REGLAS_MES) out.push(auto(t));
  out.push(auto(D.REGLA_RADICULAR_SEVERA));

  sec('8. Hoja de registro de cada sesión', 'Fuente: Maitland 2005, cap. 9, tabla 9.3, p. 226.');
  for (const t of D.HOJA_REGISTRO) out.push(item(t, 'fuente: Maitland 2005, cap. 9, tabla 9.3'));

  return out.join('\n') + '\n';
}
