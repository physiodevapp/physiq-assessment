'use strict';
// Construye docs/referencias.md: todas las referencias bibliográficas que cita
// el contenido clínico (data/) y en qué parte de la app se usa cada una.
//
// Lo usan tests/gen-referencias.mjs (escribe el archivo) y tests/unit.js
// (falla si docs/referencias.md no coincide con lo que sale de data/ ahora, o
// si data/referencias.js —el registro central— no cuadra con las citas).
// Funciones puras: reciben los objetos de data.js y el registro, sin fechas
// ni nada que cambie entre ejecuciones.
//
// Cómo se reconoce una referencia dentro de una cita de texto libre:
//   - «Autor Año», «Autor y Autor Año», «Autor et al. Año» → literatura
//     (una misma cita puede nombrar varias: «… Sman 2015 (…); Netterström-Wedin 2021 (…)»)
//   - «NICE NG226» y similares → guía NICE
//   - «Tarjeta de consulta <región>» → tarjeta del repo guia-de-consulta
// Se buscan en cualquier texto de HYPOTHESES (no solo en `fuente`), para que
// salgan también las menciones dentro de un `criterio` o una `dosis`.

const NOMBRE_REGION = {
  hombro: 'Hombro', cadera: 'Cadera', cervical: 'Cervical', lumbar: 'Lumbar',
  rodilla: 'Rodilla', codo: 'Codo', tobillo_pie: 'Tobillo y pie'
};

// Tarjetas de consulta (repo physiodevapp/guia-de-consulta). Las tarjetas son
// extractos de las guías clínicas de cada región, basadas en Lluch et al. 2020
// (ZERAPI; entrada con `tarjetas: true` en data/referencias.js); los pies de
// cada cara dicen de qué apartados salen. Copiados de data/tarjeta_<región>.js
// (TITULOS.pie*) y data/formulario_<región>.js (pie) en guia-de-consulta 90c8e19.
const TARJETAS = {
  hombro: {
    pies: [
      'Guía clínica de hombro, ap. 1 y 4 · Struyf · Powell y Lewis, cap. 3 — Ficha de primera visita, bloques 0, 3 y 4',
      'Guía clínica de hombro, ap. 5 y 6 · las filas ① y ② son propuestas de la guía, no proceden del capítulo · cuestionarios validados citados en el ap. 6: SPADI, DASH, ASES, SST, Constant'
    ],
    formulario: 'Hoja 2 de 2 · versión 1 — Preguntas discriminantes: guía clínica de hombro, ap. 3 (Dupuytren, trabajo y cambios de carga: ap. 5).'
  },
  cadera: {
    pies: [
      'Guía clínica de cadera e ingle, ap. 1 y 4 — Ficha de primera visita, bloques 0, 3 y 4',
      'Guía clínica de cadera e ingle, ap. 5 · las filas ① y ② son propuestas de la guía, no proceden del capítulo',
      'Guía clínica de cadera e ingle, ap. 5 y 6 · entidades de Doha y filas Imagen, Cuidado y Pronóstico'
    ],
    formulario: 'Hoja 2 de 2 · versión 2 — Preguntas discriminantes: guía clínica de cadera e ingle, ap. 3 (deporte y antecedentes: ap. 1 y 6).'
  },
  cervical: {
    pies: [
      'Guía clínica cervical, ap. 1 y 4 — Ficha de primera visita, bloques 0, 3 y 4',
      'Guía clínica cervical, ap. 5 y 6 · las filas ① y ② son propuestas de la guía, no proceden del capítulo'
    ],
    formulario: 'Hoja 2 de 2 · versión cervical — Preguntas discriminantes: guía clínica cervical, ap. 3. Ficha de primera visita: ejes 2 a 6 y bloque 4.'
  },
  lumbar: {
    pies: [
      'Guía clínica lumbar, ap. 1 y 4 · Fondevila Suárez, cap. 5 — Ficha de primera visita, bloques 0, 3 y 4',
      'Guía clínica lumbar, ap. 5 y 6 · las filas ① y ② son propuestas de la guía, no proceden del capítulo'
    ],
    formulario: 'Hoja 2 de 2 · versión lumbar — Preguntas discriminantes: guía clínica lumbar, ap. 3 y 6. Ficha de primera visita: ejes 2 a 6 y bloque 4.'
  },
  rodilla: {
    pies: [
      'Guía clínica de rodilla, ap. 1 y anexo A2–A3 · lo marcado (anexo) no procede del capítulo — Ficha de primera visita, bloques 0 y 3',
      'Guía clínica de rodilla, ap. 4 — Ficha de primera visita, bloque 4',
      'Guía clínica de rodilla, ap. 5 y anexo A1 · las filas ① y ② son propuestas de la guía, no proceden del capítulo',
      'Guía clínica de rodilla, ap. 5, 6 y anexo A4 · filas Imagen, Cuidado y Pronóstico'
    ],
    formulario: 'Hoja 2 de 2 · versión 1 — Preguntas discriminantes: guía clínica de rodilla, ap. 3 (trabajo de rodillas: ap. 5–6; rigidez <30 min: ap. 5).'
  },
  tobillo_pie: {
    pies: [
      'Guía clínica de tobillo y pie, ap. 1 y anexo A1 · lo marcado (anexo) no procede del capítulo — Ficha de primera visita, bloques 0 y 3',
      'Guía clínica de tobillo y pie, ap. 4 — Ficha de primera visita, bloque 4',
      'Guía clínica de tobillo y pie, ap. 5 · las filas ① y ② son propuestas de la guía, no proceden del capítulo',
      'Guía clínica de tobillo y pie, ap. 5, 6 y anexo A2 · filas Imagen, Cuidado y Pronóstico'
    ],
    formulario: 'Hoja 2 de 2 · versión 1 — Preguntas discriminantes: guía clínica de tobillo y pie, ap. 3 (carga y calzado: ap. 6; rigidez: ap. 3 y 5).'
  }
};

const AUTOR = "(?:(?:van|von) )?[A-ZÁÉÍÓÚÑÄÖÜÅ][\\p{L}'’-]+";
const RE_AUTOR_ANO = new RegExp(`(${AUTOR}(?: (?:y|e|and|&) ${AUTOR})?(?: et al\\.?)?) ((?:19|20)\\d{2})(?![\\d])`, 'gu');
const RE_NICE = /\bNICE (NG|CG|QS)(\d+)/g;
const RE_TARJETA = /Tarjeta de consulta (hombro|cadera|cervical|lumbar|rodilla|codo|tobillo y pie)/g;

function clavesDe(texto) {
  const claves = [];
  for (const m of texto.matchAll(RE_TARJETA)) claves.push({ tipo: 'tarjeta', clave: m[1].replace(/ y /, '_') });
  for (const m of texto.matchAll(RE_NICE)) claves.push({ tipo: 'lit', clave: `NICE ${m[1]}${m[2]}` });
  for (const m of texto.matchAll(RE_AUTOR_ANO)) claves.push({ tipo: 'lit', clave: `${m[1]} ${m[2]}` });
  const vistas = new Set();
  return claves.filter(c => !vistas.has(c.tipo + c.clave) && vistas.add(c.tipo + c.clave));
}

// Dónde aparece un texto de una hipótesis, en palabras de la app, y a qué
// afecta (`efecto`, para priorizar la revisión: lo que mueve la puntuación
// de la fase 4b pesa más que un texto).
function lugar(hyp, ruta, testPuntua) {
  const [a, b, c] = ruta;
  if (a === 'tests') {
    const t = hyp.tests[b];
    if (c !== 'fuente') return { donde: `Test «${t.name}» (en \`${c}\`)`, fase: '4b · mención en el texto', efecto: 'texto' };
    return { donde: `Test «${t.name}»`, fase: '4b · cita bajo el test', efecto: testPuntua(hyp, t) ? 'puntuación 4b' : 'test 4b sin puntuar' };
  }
  if (a === 'clusters') {
    const r = hyp.clusters[b];
    if (c !== 'fuente') return { donde: `Cluster «${r.nombre}» (en \`${c}\`)`, fase: '4b · mención en el texto', efecto: 'texto' };
    return { donde: `Cluster «${r.nombre}»`, fase: '4b · cita del cluster', efecto: testPuntua(hyp, { cluster: b }) ? 'puntuación 4b' : 'test 4b sin puntuar' };
  }
  if (a === 'pronostico') {
    return b === 'fuente'
      ? { donde: 'Pronóstico', fase: '5 · cita del pronóstico', efecto: 'pronóstico' }
      : { donde: `Pronóstico (en \`${b}\`)`, fase: '5 · mención en el texto', efecto: 'texto' };
  }
  if (a === 'dosisFuente') return { donde: 'Pauta de tratamiento', fase: '5 · cita de la pauta', efecto: 'pauta' };
  if (a === 'dosis') return { donde: 'Dosis (en el texto)', fase: '5 · mención en el texto', efecto: 'texto' };
  return { donde: `\`${ruta.join('.')}\``, fase: '—', efecto: 'texto' };
}
const ORDEN_EFECTO = ['puntuación 4b', 'pauta', 'pronóstico', 'test 4b sin puntuar', 'texto'];

function recorrer(obj, ruta, fn) {
  if (typeof obj === 'string') return fn(obj, ruta);
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) recorrer(v, [...ruta, Array.isArray(obj) ? Number(k) : k], fn);
  }
}

const esc = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const porRegion = regiones => (a, b) => regiones.indexOf(a.region) - regiones.indexOf(b.region);
const ancla = k => k.toLowerCase().replace(/[^\p{L}\d\s-]/gu, '').replace(/\s+/g, '-');

// Todas las citas de data/: literatura (clave → citas y usos), tarjetas
// (región → citas y usos), tests sin fuente y otras fuentes sin campo propio.
export function recogerCitas({ HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, testPuntua }) {
  const lit = new Map();        // clave → { citas: [texto], usos: [] }
  const tarjetas = new Map();   // región → { citas: [texto], usos: [] }
  const sinFuente = [];
  const otras = [];

  const anotar = (mapa, clave, cita, uso) => {
    if (!mapa.has(clave)) mapa.set(clave, { citas: [], usos: [] });
    const e = mapa.get(clave);
    let n = e.citas.indexOf(cita);
    if (n === -1) { e.citas.push(cita); n = e.citas.length - 1; }
    e.usos.push({ ...uso, cita: n + 1 });
  };

  for (const hyp of Object.values(HYPOTHESES)) {
    for (const campo of ['tests', 'clusters', 'pronostico', 'dosis', 'dosisFuente']) {
      recorrer(hyp[campo], [campo], (texto, ruta) => {
        for (const { tipo, clave } of clavesDe(texto)) {
          const uso = { region: hyp.region, hyp: `${hyp.id} · ${hyp.name}`, ...lugar(hyp, ruta, testPuntua) };
          anotar(tipo === 'tarjeta' ? tarjetas : lit, clave, texto, uso);
        }
      });
    }
    hyp.tests.forEach(t => {
      if (t.fuente || (t.cluster && hyp.clusters?.[t.cluster]?.fuente)) return;   // la del cluster cubre a sus miembros
      const cifras = [t.sn && `S ${t.sn}`, t.sp && `E ${t.sp}`, t.lr_pos && `LR+ ${t.lr_pos}`, t.lr_neg && `LR− ${t.lr_neg}`].filter(Boolean);
      sinFuente.push({ region: hyp.region, hyp: `${hyp.id} · ${hyp.name}`, test: t.name, cifras, puntua: testPuntua(hyp, t) });
    });
  }

  // Menciones fuera de HYPOTHESES (cribado de fase 2 y árbol de fase 4).
  for (const [nombre, obj, fase] of [['SYSTEMIC_SCREENING', SYSTEMIC_SCREENING, '2'], ['CIF_TREES', CIF_TREES, '4']]) {
    recorrer(obj, [nombre], (texto, ruta) => {
      for (const { tipo, clave } of clavesDe(texto)) {
        if (tipo !== 'lit') continue;
        anotar(lit, clave, texto, { region: ruta[1], hyp: '—', donde: `\`${ruta.slice(2).join('.')}\``, fase: `${fase} · mención en el texto`, efecto: 'texto' });
      }
    });
  }
  for (const [region, scr] of Object.entries(SYSTEMIC_SCREENING)) {
    if (scr.urgencia) otras.push({ region, que: `Recuadro «${scr.urgencia.titulo}»`, fase: '2', fuente: 'Literal de la tarjeta de consulta (URGENCIA)' });
    for (const sis of scr.sistemas || []) {
      if (sis.criterioCompuesto) otras.push({ region, que: `Criterio compuesto · ${sis.nombre}`, fase: '2', fuente: sis.criterioCompuesto.nota });
    }
  }
  return { lit, tarjetas, sinFuente, otras };
}

// Lo que no cuadra entre las citas de data/ y el registro (data/referencias.js).
// Todo vacío = bien. Lo comprueba tests/unit.js.
export function problemasRegistro({ lit, tarjetas }, REFERENCIAS) {
  const base = Object.keys(REFERENCIAS).filter(k => REFERENCIAS[k].tarjetas);
  return {
    sinRegistrar: [...lit.keys()].filter(k => !REFERENCIAS[k]),
    sinUso: Object.keys(REFERENCIAS).filter(k => !lit.has(k) && !(REFERENCIAS[k].tarjetas && tarjetas.size)),
    revisionMal: Object.entries(REFERENCIAS)
      .filter(([, r]) => r.revision !== null && !(/^\d{4}-(0[1-9]|1[0-2])$/.test(r.revision?.fecha) && r.revision?.resultado?.trim()))
      .map(([k]) => k),
    baseTarjetas: base.length === 1 ? [] : [`${base.length} entradas con tarjetas: true (tiene que haber exactamente 1)`]
  };
}

function lineaRegistro(r) {
  if (!r) return ['_⚠ No está en `data/referencias.js`._', ''];
  const xs = [
    r.autores && `Autores: ${r.autores}`,
    r.titulo && `Título: *${r.titulo}*`,
    `Publicación: ${r.publicacion || '—'}`,
    `DOI: ${r.doi || '—'}`,
    `Última revisión: ${r.revision ? `${r.revision.fecha} · ${r.revision.resultado}` : '**sin revisar**'}`,
    r.nota && `Nota: ${r.nota}`
  ].filter(Boolean);
  return [xs.join('  \n'), ''];
}

export function construirReferencias({ HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, REFERENCIAS, testPuntua }) {
  const regiones = Object.keys(CIF_TREES);
  const { lit, tarjetas, sinFuente, otras } = recogerCitas({ HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, testPuntua });
  const claveBase = Object.keys(REFERENCIAS).find(k => REFERENCIAS[k].tarjetas);

  const L = [];
  const p = (...xs) => L.push(...xs);
  const total = [...lit.values()].reduce((n, e) => n + e.usos.length, 0);
  const usosTarjetas = [...tarjetas.values()].flatMap(e => e.usos);
  const nTests = Object.values(HYPOTHESES).reduce((n, h) => n + h.tests.length, 0);
  const revisadas = Object.values(REFERENCIAS).filter(r => r.revision).length;

  p('# Referencias bibliográficas', '',
    '> **Archivo generado — no editar a mano.** Sale de `data/` y del registro `data/referencias.js` con',
    '> `node tests/gen-referencias.mjs`; `node tests/unit.js` falla si no está al día.', '',
    'Todas las referencias que cita el contenido clínico de la app y dónde se usa cada una.',
    'Las citas viven en `data/<región>.js`: `fuente` de cada test y de cada cluster (se ve en la fase 4b,',
    'bajo el test), `pronostico.fuente` y `dosisFuente` (fase 5, bajo el pronóstico y la pauta).',
    'También se recogen las menciones a un estudio dentro de otros textos (el `criterio` de un test, la `dosis`).',
    'Lo que es de la referencia y no de cada uso (revista, DOI, última revisión) vive en el registro',
    '`data/referencias.js`, una entrada por referencia.', '',
    '## Resumen', '',
    `- **${lit.size}** referencias de literatura, con **${total}** usos.`,
    `- **${tarjetas.size}** tarjetas de consulta (repo guia-de-consulta), con **${usosTarjetas.length}** usos${claveBase ? `, basadas en ${claveBase}` : ''}.`,
    `- **${revisadas}** de ${Object.keys(REFERENCIAS).length} referencias del registro revisadas. Ver «Estado de revisión».`,
    `- **${sinFuente.length}** de ${nTests} tests sin \`fuente\` (${sinFuente.filter(s => s.puntua).length} de ellos puntúan en la fase 4b). Ver «Tests sin fuente».`, '',
    '## Cómo revisar una referencia', '',
    '1. Coge la primera de «Estado de revisión» (sin revisar y que mueve la puntuación, primero).',
    '2. Busca si hay literatura más reciente o mejor (revisión sistemática, guía de práctica clínica).',
    '3. Si no hay nada mejor: en `data/referencias.js`, pon a esa referencia',
    "   `revision: { fecha: 'AAAA-MM', resultado: 'Sin cambios: <qué se buscó>' }`.",
    '4. Si la hay: en su tabla de usos (sección 2) tienes cada test, cluster, pronóstico o pauta que la cita.',
    '   En cada uno, cambia la `fuente` y las cifras (`sn`, `sp`, `lr_pos`, `lr_neg`) en `data/<región>.js`,',
    '   leyendo el artículo, nunca un resumen de terceros. Añade la referencia nueva al registro con su',
    '   `revision`; si la antigua deja de citarse, bórrala del registro (la prueba lo exige).',
    '5. `node tests/gen-referencias.mjs` y `node tests/unit.js`, y comitea `data/` junto con este archivo.',
    '   Cambiar un LR cambia la puntuación de la fase 4b: dilo en el mensaje del commit.', '',
    'Columna «Fase»: dónde lo ve el clínico. «4b · cita bajo el test» quiere decir que esa referencia respalda',
    'las cifras (S, E, LR) del test; que el test puntúe o no depende de las reglas de `calcLRScore` (ver CLAUDE.md).',
    'Columna «Cita»: número de la forma de citar (lista «Citada como») que usa esa fila.', '');

  // ── Estado de revisión ──
  const filas = Object.entries(REFERENCIAS).map(([k, r]) => {
    const usos = r.tarjetas ? usosTarjetas : (lit.get(k)?.usos || []);
    const efectos = ORDEN_EFECTO.filter(e => usos.some(u => u.efecto === e));
    const ano = Number((k.match(/(\d{4})$/) || [])[1]) || 0;
    return { k, r, n: usos.length, efectos, ano };
  });
  const rango = f => (f.efectos.length ? ORDEN_EFECTO.indexOf(f.efectos[0]) : ORDEN_EFECTO.length);
  filas.sort((a, b) =>
    (a.r.revision ? 1 : 0) - (b.r.revision ? 1 : 0) ||
    (a.r.revision?.fecha || '').localeCompare(b.r.revision?.fecha || '') ||
    rango(a) - rango(b) || a.ano - b.ano || a.k.localeCompare(b.k, 'es'));
  p('## Estado de revisión', '',
    'Orden de trabajo: primero las nunca revisadas, luego las revisadas hace más tiempo. Dentro de cada grupo,',
    'primero las que mueven la puntuación de la fase 4b, luego pauta y pronóstico (fase 5), y las más antiguas antes.',
    '«Afecta a»: «puntuación 4b» = respalda un test o cluster que puntúa; «test 4b sin puntuar» = el test se ve',
    'pero no mueve la puntuación; «texto» = solo se menciona.', '',
    '| Referencia | Afecta a | Usos | Última revisión |', '|---|---|---|---|',
    ...filas.map(f => `| [${f.k}](#${ancla(f.r.tarjetas ? '1. Tarjetas de consulta' : f.k)}) | ${f.efectos.join(' · ') || '—'} | ${f.n} | ${f.r.revision ? `${f.r.revision.fecha} · ${esc(f.r.revision.resultado)}` : '**sin revisar**'} |`), '');

  // ── 1. Tarjetas de consulta ──
  p('## 1. Tarjetas de consulta', '');
  if (claveBase) p(...lineaRegistro(REFERENCIAS[claveBase]));
  p('Las tarjetas de consulta están en el repo [physiodevapp/guia-de-consulta](https://github.com/physiodevapp/guia-de-consulta),',
    `en \`data/tarjeta_<región>.js\`. Son extractos de las **guías clínicas** de cada región, basadas en ${claveBase || '—'}`,
    '(arriba). En `data/` se citan como «Tarjeta de consulta <región>». Los pies de cada tarjeta (abajo, literales)',
    'dicen de qué apartados de la guía clínica sale cada cara.', '');
  for (const region of regiones) {
    const e = tarjetas.get(region);
    const t = TARJETAS[region];
    if (!e && !t) continue;
    p(`### Tarjeta de consulta ${NOMBRE_REGION[region].toLowerCase()}`, '');
    if (t) {
      p(`Archivo: \`guia-de-consulta/data/tarjeta_${region}.js\` · formulario previo: \`guia-de-consulta/data/formulario_${region}.js\``, '',
        'De dónde sale (pies de la tarjeta):', '', ...t.pies.map(x => `- ${x}`), '',
        `Formulario previo, cara 2 (\`formularios/${region}.js\`): ${t.formulario}`, '');
    }
    if (e) {
      p('Citada como:', '', ...e.citas.map((c, i) => `${i + 1}. ${c}`), '');
      p('| Hipótesis | Dónde | Fase | Cita |', '|---|---|---|---|',
        ...e.usos.map(u => `| ${esc(u.hyp)} | ${esc(u.donde)} | ${u.fase} | ${u.cita} |`), '');
    } else {
      p('_Ninguna cita en `data/` nombra esta tarjeta._', '');
    }
  }

  // ── 2. Literatura ──
  p('## 2. Literatura científica', '',
    'Orden alfabético. Un mismo «Autor Año» puede agrupar dos artículos distintos (p. ej. dos de Décary 2018):',
    'la lista «Citada como» los distingue.', '');
  const claves = [...lit.keys()].sort((a, b) => a.localeCompare(b, 'es'));
  p(claves.map(k => `[${k}](#${ancla(k)})`).join(' · '), '');
  for (const k of claves) {
    const e = lit.get(k);
    p(`### ${k}`, '', ...lineaRegistro(REFERENCIAS[k]), 'Citada como:', '', ...e.citas.map((c, i) => `${i + 1}. ${c}`), '',
      '| Región | Hipótesis | Dónde | Fase | Cita |', '|---|---|---|---|---|',
      ...e.usos.slice().sort(porRegion(regiones)).map(u => `| ${NOMBRE_REGION[u.region] || u.region} | ${esc(u.hyp)} | ${esc(u.donde)} | ${u.fase} | ${u.cita} |`), '');
  }

  // ── 3. Otras fuentes ──
  p('## 3. Otras fuentes del contenido', '',
    'Contenido que no lleva un campo `fuente` pero tiene origen conocido.', '',
    '| Región | Qué | Fase | Fuente |', '|---|---|---|---|',
    ...otras.sort(porRegion(regiones)).map(o => `| ${NOMBRE_REGION[o.region]} | ${esc(o.que)} | ${o.fase} | ${esc(o.fuente)} |`),
    '| Todas | Formulario previo, cara 1 (`formularios/comun.js`) | 1 | Literal de `guia-de-consulta/tools/plantilla_formularios.js` (cara 1) |',
    '| Ver sección 1 | Formulario previo, cara 2 (`formularios/<región>.js`) | 1 y 4 | Literal de `guia-de-consulta/data/formulario_<región>.js` |',
    '', 'Las fuentes que faltan para las dosis están en `docs/dosis-pendientes-fuentes.md`.', '');

  // ── 4. Tests sin fuente ──
  p('## 4. Tests sin fuente', '',
    'Tests sin `fuente` (los miembros de un cluster con `fuente` no cuentan: la cita del cluster los cubre).',
    '«Puntúa» = sí: sus cifras mueven la puntuación de la fase 4b sin que la app diga de dónde salen.', '');
  for (const region of regiones) {
    const filasR = sinFuente.filter(s => s.region === region);
    if (!filasR.length) continue;
    p(`### ${NOMBRE_REGION[region]} (${filasR.length})`, '',
      '| Hipótesis | Test | Cifras | Puntúa |', '|---|---|---|---|',
      ...filasR.map(s => `| ${esc(s.hyp)} | ${esc(s.test)} | ${esc(s.cifras.join(' · ') || '—')} | ${s.puntua ? '**sí**' : 'no'} |`), '');
  }

  return L.join('\n').replace(/\n+$/, '') + '\n';
}
