// Esquemas imprimibles generados desde los datos de la app (no hay textos a mano:
// si cambia data/, se regeneran y no se desfasan).
//
//   node docs/esquemas/generar.mjs [region|todas] [cribado|arbol|confirmacion|todos]
//
// Por defecto: lumbar, todos. Escribe en docs/esquemas/<tipo>-<region>.pdf y .png.
//   cribado      → fase 2, A4 vertical: sistemas y preguntas literales (sin las listas de banderas)
//   arbol        → fase 4, A3 apaisado: pasos del árbol CIF, respuestas e hipótesis que activan
//   confirmacion → fase 4b, A4 apaisado: tests de cada hipótesis con sus LR y si puntúan
// Necesita Playwright (como tests/smoke.mjs). Las reglas de LR son las de la app:
// importa lrEfectiva y testPuntua de phase4b.js, cargado con el mismo shim que tests/unit.js.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import '../../tests/dom-shim.mjs';

const { SYSTEMIC_SCREENING, CIF_TREES, HYPOTHESES } = await import('../../data.js');
const { lrEfectiva, testPuntua } = await import('../../phase4b.js');
const { resolveOptionTargets } = await import('../../phase4.js');

const DIR = dirname(fileURLToPath(import.meta.url));
const require = createRequire(process.cwd() + '/');
let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = require('playwright')); }

const NOMBRES = { hombro: 'Hombro', cadera: 'Cadera', cervical: 'Cervical', lumbar: 'Lumbar', rodilla: 'Rodilla', codo: 'Codo', tobillo_pie: 'Tobillo y pie' };
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmtLR = n => n >= 10 ? n.toFixed(0) : n.toFixed(n < 1 ? 2 : 1);   // igual que phase4b.js
const hoy = new Date().toLocaleDateString('es-ES');

const CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Helvetica, Arial, sans-serif; color: #1f2937; font-size: 10.5px; line-height: 1.35; }
  h1 { font-size: 20px; margin: 0 0 2px; } .sub { color: #6b7280; margin-bottom: 8px; }
  .aviso { border: 1.5px solid #d0342c; background: #fde8e8; color: #b42318; border-radius: 8px; padding: 6px 10px; font-weight: bold; margin-bottom: 8px; }
  .aviso div { font-weight: normal; }
  .pie { color: #6b7280; font-size: 9px; margin-top: 8px; }
  .chip { display: inline-block; border-radius: 10px; padding: 0 6px; font-size: 9px; font-weight: bold; }
  .urg { background: #d0342c; color: #fff; } .alerta { background: #fff1dc; color: #9a5b00; } .s1 { background: #eaf1ff; color: #3567d6; }
  .num { display: inline-block; min-width: 18px; height: 18px; border-radius: 9px; background: #7c4ddb; color: #fff; text-align: center; font-weight: bold; font-size: 10px; line-height: 18px; padding: 0 4px; }
`;

// ── Fase 2 · cribado ─────────────────────────────────────────────────────────
function htmlCribado(region) {
  const sc = SYSTEMIC_SCREENING[region];
  const sistemas = sc.sistemas.map(s => {
    const idx = Object.fromEntries(s.preguntas.map((q, i) => [q.id, i + 1]));
    const crit = s.criterioCompuesto
      ? `<div class="crit"><b>${esc(s.criterioCompuesto.etiqueta)}</b> — ${s.criterioCompuesto.minPositivas} o más de las preguntas ${s.criterioCompuesto.ids.map(id => idx[id]).join(', ')}${s.criterioCompuesto.filtro?.edadMax ? ` · edad ≤ ${s.criterioCompuesto.filtro.edadMax}` : ''}${s.criterioCompuesto.filtro?.evolucion ? ` · evolución: ${esc(s.criterioCompuesto.filtro.evolucion)}` : ''}</div>` : '';
    return `<section class="sis"><h2>${esc(s.icon || '')} ${esc(s.nombre)}</h2><ol>${s.preguntas.map(q => `
      <li class="${q.urgencia ? 'qurg' : ''}">${esc(q.text)} ${q.urgencia ? '<span class="chip urg">URGENCIA · derivar hoy</span>' : ''}${q.s1 ? ' <span class="chip s1">rápido</span>' : ''}</li>`).join('')}</ol>${crit}</section>`;
  }).join('');
  const urg = sc.urgencia ? `<div class="aviso">${esc(sc.urgencia.titulo)}${sc.urgencia.lineas.map(l => `<div>· ${esc(l)}</div>`).join('')}</div>` : '';
  return `<style>${CSS}
    @page { size: A4 portrait; margin: 10mm; }
    .cols { column-count: 2; column-gap: 10px; }
    .sis { break-inside: avoid; border: 1.5px solid #3567d6; border-radius: 8px; padding: 6px 8px; margin: 0 0 8px; background: #fbfdff; }
    .sis h2 { font-size: 12px; margin: 0 0 4px; color: #1e3a8a; }
    ol { margin: 0; padding-left: 18px; } li { margin-bottom: 3px; }
    li.qurg { color: #b42318; font-weight: bold; }
    .crit { margin-top: 4px; border-top: 1px dashed #94a3b8; padding-top: 4px; font-size: 9.5px; }
  </style>
  <h1>Cribado sistémico · ${NOMBRES[region]}</h1>
  <div class="sub">PhysiQ-Assessment · fase 2. Preguntas literales de la app. Las listas de banderas rojas y amarillas de cada sistema están en la app.</div>
  ${urg}
  <div class="cols">${sistemas}</div>
  <div class="pie">Un SÍ aislado no implica derivación automática (salvo las preguntas de URGENCIA): evaluar en el contexto clínico completo. «rápido» = pregunta del screening rápido. Generado desde los datos de la app el ${hoy}.</div>`;
}

// ── Fase 4 · árbol ───────────────────────────────────────────────────────────
// Pasos «principales»: los que están en todos los recorridos; el resto son desvíos.
function pasosPrincipales(tree) {
  const steps = tree.steps, ids = steps.map(s => s.id);
  const sig = id => { const i = ids.indexOf(id); return steps[i].options.flatMap(o => resolveOptionTargets(tree, i, o).map(t => t.id)); };
  const llegaAlFinSin = evitar => {
    const vistos = new Set(), pila = [ids[0]];
    if (ids[0] === evitar) return false;
    while (pila.length) {
      const id = pila.pop(); if (vistos.has(id)) continue; vistos.add(id);
      const i = ids.indexOf(id);
      if (steps[i].options.some(o => resolveOptionTargets(tree, i, o).length === 0)) return true;
      sig(id).filter(n => n !== evitar).forEach(n => pila.push(n));
    }
    return false;
  };
  return new Set(ids.filter(id => !llegaAlFinSin(id)));
}

function htmlArbol(region) {
  const tree = CIF_TREES[region];
  const principales = pasosPrincipales(tree);
  const ids = tree.steps.map(s => s.id);
  const nombrePaso = id => { const s = tree.steps.find(x => x.id === id); return (s.tag || id).split('—')[0].trim(); };
  // Desde dónde se entra a cada desvío: las respuestas de otros pasos que llevan a él
  const entradas = {};
  tree.steps.forEach((st, i) => {
    const van = st.options.filter(o => resolveOptionTargets(tree, i, o).some(t => !principales.has(t.id)))
      .map(o => ({ o, t: resolveOptionTargets(tree, i, o)[0].id }));
    const porDestino = {};
    van.forEach(({ o, t }) => (porDestino[t] ||= []).push(o));
    Object.entries(porDestino).forEach(([t, ops]) => (entradas[t] ||= []).push(
      ops.length === st.options.length ? `${nombrePaso(st.id)} (cualquier respuesta)` : `${nombrePaso(st.id)} «${ops.map(o => o.label.split('—')[0].trim()).join('» o «')}»`));
  });
  const filas = tree.steps.map((st, i) => {
    const opciones = st.options.map(o => {
      const [corto, ...resto] = o.label.split('—');
      const destino = resolveOptionTargets(tree, i, o)[0];
      const salto = destino && destino.id !== ids[i + 1] ? `<span class="salto">→ ${esc(nombrePaso(destino.id))}</span>` : (!destino && i < ids.length - 1 ? '<span class="salto">fin del árbol</span>' : '');
      const hips = o.hypothesis.map(h => HYPOTHESES[h]).filter(Boolean)
        .map(h => `<span class="hip"><span class="num">${esc(h.num || '')}</span> ${esc(h.name)}</span>`).join('');
      const efecto = o.derivacion ? `<span class="deriv">🩺 Derivación médica — el árbol continúa</span>` : '';
      return `<div class="op"><div class="opt"><b>${esc(corto.trim())}</b>${resto.length ? `<div class="det">${esc(resto.join('—').trim())}</div>` : ''}${salto}</div>
        <div class="flecha">→</div><div class="res">${hips}${efecto}${!hips && !efecto ? '<span class="nada">sin hipótesis</span>' : ''}</div></div>`;
    }).join('');
    const desvio = !principales.has(st.id);
    return `<div class="fila${desvio ? ' desvio' : ''}">
      ${desvio ? `<div class="entrada">Desvío: solo si se llega desde ${esc((entradas[st.id] || []).join(' o '))}</div>` : ''}
      <div class="paso"><div class="tag">${esc(st.tag || st.id)}</div><div class="preg">${esc(st.question)}</div></div>
      <div class="ops">${opciones}</div></div>`;
  }).join('<div class="baja">▼</div>');
  return `<style>${CSS}
    @page { size: A3 landscape; margin: 10mm; }
    .fila { display: grid; grid-template-columns: 30% 70%; gap: 8px; border: 1.5px solid #3567d6; border-radius: 9px; padding: 7px; background: #f5f8ff; break-inside: avoid; }
    .fila.desvio { margin-left: 40px; border-style: dashed; background: #fafaff; }
    .entrada { grid-column: 1 / -1; font-size: 9.5px; font-style: italic; color: #4b5563; }
    .tag { font-size: 9px; color: #3567d6; font-weight: bold; text-transform: uppercase; letter-spacing: .3px; }
    .preg { font-size: 12px; font-weight: bold; margin-top: 2px; }
    .op { display: grid; grid-template-columns: 1fr 18px 1fr; align-items: center; margin-bottom: 3px; }
    .opt { background: #fff; border: 1px solid #94a3b8; border-radius: 7px; padding: 3px 6px; }
    .det { font-size: 9px; color: #6b7280; }
    .salto { display: inline-block; font-size: 9px; font-weight: bold; color: #3567d6; margin-top: 1px; }
    .flecha { text-align: center; color: #475569; font-weight: bold; }
    .hip { display: inline-block; background: #f1e9ff; border: 1px solid #7c4ddb; border-radius: 7px; padding: 2px 6px; margin: 1px 2px 1px 0; font-weight: bold; }
    .deriv { display: inline-block; background: #fde8e8; border: 1px solid #d0342c; color: #b42318; border-radius: 7px; padding: 2px 6px; font-weight: bold; }
    .nada { display: inline-block; border: 1px dashed #94a3b8; border-radius: 7px; padding: 2px 6px; color: #6b7280; }
    .baja { text-align: center; color: #475569; font-size: 12px; line-height: 14px; }
    .final { break-inside: avoid; margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .final div { border-radius: 8px; padding: 6px 8px; }
  </style>
  <h1>${esc(tree.title || `Árbol de decisión CIF · ${NOMBRES[region]}`)}</h1>
  <div class="sub">PhysiQ-Assessment · fase 4 · ${NOMBRES[region]}. Las hipótesis se acumulan: cada respuesta puede sumar una y el recorrido sigue hasta el último paso.</div>
  <div class="aviso">REQUISITO PREVIO · Banderas rojas (fase 1) y cribado sistémico (fase 2). Si hay una urgencia, derivar: este árbol no se aplica.</div>
  ${filas}
  <div class="final">
    <div style="border:1.5px dashed #94a3b8; background:#f8fafc;"><b>Al terminar sin ninguna hipótesis activa:</b> la app propone trabajar con «dolor de ${NOMBRES[region].toLowerCase()} inespecífico», revisar los factores psicosociales y reconsiderar las respuestas; si el cuadro es crónico con riesgo psicosocial alto, considerar también sensibilización central.</div>
    <div style="border:1.5px solid #64748b; background:#f1f5f9;"><b>Fase 4b:</b> confirmar cada hipótesis activa con sus tests (esquema de confirmación de ${NOMBRES[region].toLowerCase()}).</div>
  </div>
  <div class="pie">Generado desde los datos de la app el ${hoy}.</div>`;
}

// ── Fase 4b · confirmación ───────────────────────────────────────────────────
function lrTxt(t) {
  const lr = lrEfectiva(t);
  const cuenta = t.tipo !== 'pronostico';   // un test pronóstico nunca entra en la puntuación
  const f = (v, o, util) => v == null ? '—' : `<span class="${util && cuenta ? 'util' : 'debil'}">${o === 'calculada' ? '≈' : ''}${fmtLR(v)}</span>`;
  return [f(lr.pos, lr.origenPos, lr.posUtil), f(lr.neg, lr.origenNeg, lr.negUtil)];
}
function htmlConfirmacion(region) {
  const hyps = Object.values(HYPOTHESES).filter(h => h.region === region);
  const bloques = hyps.map(h => {
    const clusters = Object.entries(h.clusters || {}).map(([cid, c]) => {
      const n = h.tests.filter(t => t.cluster === cid).length;
      const lr = lrEfectiva(c);
      const reglas = [lr.posUtil ? `≥${c.umbralPos} de ${n} positivos → LR+ ${fmtLR(lr.pos)}` : '', lr.negUtil && c.umbralNeg != null ? `${c.umbralNeg === 0 ? 'ninguno' : `≤${c.umbralNeg}`} de ${n} positivos (todos hechos) → LR− ${fmtLR(lr.neg)}` : ''].filter(Boolean).join(' · ');
      return `<tr class="cl"><td colspan="4">🧩 <b>${esc(c.nombre)}</b>: ${reglas || 'sin LR aplicable'}</td></tr>`;
    }).join('');
    const filas = h.tests.map(t => {
      const [pos, neg] = t.cluster ? ['', ''] : lrTxt(t);
      const papel = t.tipo === 'pronostico' ? 'pronóstico' : t.cluster ? 'en clúster' : testPuntua(h, t) ? '<b class="si">puntúa</b>' : 'hallazgo';
      return `<tr><td>${esc(t.name)}</td><td class="c">${pos}</td><td class="c">${neg}</td><td class="c">${papel}</td></tr>`;
    }).join('');
    return `<section class="hyp"><h2><span class="num">${esc(h.num || '')}</span> ${esc(h.name)}</h2>
      <table><thead><tr><th>Test</th><th>LR+</th><th>LR−</th><th>Papel</th></tr></thead><tbody>${clusters}${filas}</tbody></table></section>`;
  }).join('');
  return `<style>${CSS}
    @page { size: A4 landscape; margin: 8mm; }
    body { font-size: 9.5px; }
    .cols { column-count: 2; column-gap: 10px; }
    .hyp { break-inside: avoid; border: 1.5px solid #7c4ddb; border-radius: 8px; padding: 5px 7px; margin: 0 0 7px; }
    .hyp h2 { font-size: 11.5px; margin: 0 0 3px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 8.5px; color: #6b7280; border-bottom: 1px solid #cbd5e1; }
    td { border-bottom: 1px solid #eef2f7; padding: 1px 2px; vertical-align: top; }
    td.c, th:not(:first-child) { text-align: center; white-space: nowrap; width: 52px; }
    .util { font-weight: bold; color: #0f7a55; } .debil { color: #9ca3af; } b.si { color: #0f7a55; }
    tr.cl td { background: #f6f1ff; }
  </style>
  <h1>Confirmación de hipótesis · ${NOMBRES[region]}</h1>
  <div class="sub">PhysiQ-Assessment · fase 4b. LR en <b class="util">verde</b>: multiplica la puntuación (LR+ ≥ 2 o LR− ≤ 0,5); en gris: no informativa, cuenta como hallazgo. «≈» = calculada de S y E. «hallazgo»: sin LR aplicable. Criterios de cada test y fuentes, en la app.</div>
  <div class="cols">${bloques}</div>
  <div class="pie">Generado desde los datos de la app el ${hoy}.</div>`;
}

// ── Render ───────────────────────────────────────────────────────────────────
// [generador, apaisado, formato]
const TIPOS = { cribado: [htmlCribado, false, 'A4'], arbol: [htmlArbol, true, 'A3'], confirmacion: [htmlConfirmacion, true, 'A4'] };
const [regArg = 'lumbar', tipoArg = 'todos'] = process.argv.slice(2);
const regiones = regArg === 'todas' ? Object.keys(CIF_TREES) : [regArg];
const tipos = tipoArg === 'todos' ? Object.keys(TIPOS) : [tipoArg];

const browser = await chromium.launch();
for (const region of regiones) {
  if (!CIF_TREES[region]) throw new Error(`Región desconocida: ${region}`);
  for (const tipo of tipos) {
    const [fn, apaisado, formato] = TIPOS[tipo];
    const px = formato === 'A3' ? [1587, 1123] : [1123, 794];
    const page = await browser.newPage({ viewport: apaisado ? { width: px[0], height: px[1] } : { width: px[1], height: px[0] } });
    await page.setContent(`<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body>${fn(region)}</body></html>`);
    const base = join(DIR, `${tipo}-${region}`);
    await page.pdf({ path: `${base}.pdf`, format: formato, landscape: apaisado, printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({ path: `${base}.png`, fullPage: true });
    const paginas = (await page.pdf({ format: formato, landscape: apaisado, preferCSSPageSize: true })).toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length;
    console.log(`${tipo}-${region}: ${paginas} página${paginas === 1 ? '' : 's'}`);
    await page.close();
  }
}
await browser.close();
