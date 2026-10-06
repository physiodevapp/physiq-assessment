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
  .urg { background: #d0342c; color: #fff; } .alerta { background: #fff1dc; color: #9a5b00; }
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
      <li class="${q.urgencia ? 'qurg' : ''}">${esc(q.text)} ${q.urgencia ? '<span class="chip urg">URGENCIA · derivar hoy</span>' : ''}</li>`).join('')}</ol>${crit}</section>`;
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
  <div class="pie">Un SÍ aislado no implica derivación automática (salvo las preguntas de URGENCIA): evaluar en el contexto clínico completo. Generado desde los datos de la app el ${hoy}.</div>`;
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

// Diseño de flujo (A3 apaisado): los pasos principales en columnas de izquierda a
// derecha (4 por banda; si hay más, la banda siguiente continúa debajo), los
// desvíos encima del paso del que salen, y debajo de cada paso sus respuestas con
// la hipótesis que activan. Las flechas se dibujan en el navegador, midiendo
// dónde ha quedado cada caja, así que sirven para el árbol de cualquier región.
const POR_BANDA = 4;
const numHip = h => (h.id.match(/\d+/) || [''])[0];
function etiquetaPaso(st, i) { const m = /Paso\s+([0-9]+[a-z]?)/i.exec(st.tag || ''); return m ? m[1] : String(i + 1); }

function htmlArbol(region) {
  const tree = CIF_TREES[region];
  const steps = tree.steps, ids = steps.map(s => s.id);
  const principales = pasosPrincipales(tree);
  const destinos = i => steps[i].options.map(o => resolveOptionTargets(tree, i, o)[0]?.id ?? null);
  const corto = o => o.label.split('—')[0].trim();
  const detalle = o => o.label.split('—').slice(1).join('—').trim();
  const lab = id => etiquetaPaso(steps[ids.indexOf(id)], ids.indexOf(id));

  // Grupos de desvío: cadenas de pasos no principales que salen de un paso principal
  const grupos = [];
  ids.forEach((id, i) => {
    if (!principales.has(id)) return;
    const porDestino = {};
    steps[i].options.forEach((o, k) => { const t = destinos(i)[k]; if (t && !principales.has(t)) (porDestino[t] ||= []).push(corto(o)); });
    Object.entries(porDestino).forEach(([ini, todas]) => {
      const etiquetas = [...new Set(todas)];
      const cadena = [ini];
      let actual = ini;
      for (;;) {
        const j = ids.indexOf(actual);
        const sig = destinos(j).find(t => t && !principales.has(t) && !cadena.includes(t));
        if (!sig) break;
        cadena.push(sig); actual = sig;
      }
      const ult = ids.indexOf(cadena[cadena.length - 1]);
      const vuelta = destinos(ult).find(t => t && principales.has(t)) ?? null;
      grupos.push({ entrada: id, etiquetas, cadena, vuelta });
    });
  });

  const resultado = o => {
    const hips = o.hypothesis.map(h => HYPOTHESES[h]).filter(Boolean)
      .map(h => `<div class="hip"><span class="nb">${numHip(h)}</span><span>${esc(h.name)}</span></div>`).join('');
    const der = o.derivacion ? `<div class="der"><b>Derivación médica</b><span>${esc(o.derivacion)}</span></div>` : '';
    return hips + der || '<div class="nada">sin hipótesis</div>';
  };
  const cajaPaso = (id, desvio) => {
    const i = ids.indexOf(id), st = steps[i];
    const lineas = desvio ? `<div class="dops">${st.options.map(o => `<div class="dop"><b>${esc(corto(o))}</b> → ${resultado(o)}</div>`).join('')}</div>` : '';
    return `<div class="paso${desvio ? ' desv' : ''}" id="box_${id}"><div class="cab"><span class="badge">${esc(lab(id))}</span><span class="preg">${esc(st.question)}</span></div>${lineas}</div>`;
  };
  const respuestas = (id, sigPrincipal) => {
    const i = ids.indexOf(id);
    return `<div class="resp"><div class="rt">Respuestas</div>${steps[i].options.map((o, k) => {
      // Si la respuesta no sigue al siguiente paso principal, se dice adónde va
      const t = destinos(i)[k];
      const ruta = t && t !== sigPrincipal ? `<div class="ruta">→ ${principales.has(t) ? 'paso' : 'desvío'} ${esc(lab(t))}</div>` : '';
      const res = o.hypothesis.length || o.derivacion || !ruta ? resultado(o) : '';
      return `<div class="op"><div class="opt"><b>${esc(corto(o))}</b>${detalle(o) ? `<span>${esc(detalle(o))}</span>` : ''}</div><div class="fl">→</div><div class="res">${res}${ruta}</div></div>`;
    }).join('')}</div>`;
  };

  const M = ids.filter(id => principales.has(id));
  const bandas = [];
  // Bandas equilibradas: 5 pasos → 3 + 2, no 4 + 1
  const nBandas = Math.ceil(M.length / POR_BANDA), porBanda = Math.ceil(M.length / nBandas);
  for (let k = 0; k < M.length; k += porBanda) bandas.push(M.slice(k, k + porBanda));
  const htmlBandas = bandas.map((banda, b) => {
    const gruposBanda = grupos.filter(g => banda.includes(g.entrada));
    const filasDesvio = gruposBanda.map(g => {
      const col = banda.indexOf(g.entrada) + 1;
      const inicio = Math.max(1, Math.min(col, POR_BANDA - g.cadena.length + 1));
      return `<div class="drow"><div class="dgrupo" style="grid-column:${inicio} / ${POR_BANDA + 1}"><div class="dnota">Desvío desde el paso ${esc(lab(g.entrada))} si «${esc(g.etiquetas.join('» o «'))}»</div><div class="dcajas">${g.cadena.map(id => cajaPaso(id, true)).join('')}</div></div></div>`;
    }).join('');
    return `<div class="banda" data-banda="${b}">${filasDesvio}
      <div class="grid">${banda.map(id => cajaPaso(id, false)).join('')}</div>
      <div class="grid">${banda.map(id => respuestas(id, M[M.indexOf(id) + 1])).join('')}</div></div>`;
  }).join('');

  // Datos para dibujar las flechas en el navegador
  const flechas = [];
  M.forEach((id, k) => {
    if (k === M.length - 1) return;
    const i = ids.indexOf(id);
    const directas = steps[i].options.filter((o, j) => destinos(i)[j] === M[k + 1]).map(corto);
    if (directas.length) flechas.push({ tipo: 'sig', de: id, a: M[k + 1], txt: directas.length === steps[i].options.length ? 'todas' : directas.join(' / ') });
  });
  grupos.forEach(g => {
    flechas.push({ tipo: 'entra', de: g.entrada, a: g.cadena[0], txt: g.etiquetas.join(' / ') });
    g.cadena.slice(1).forEach((id, k) => flechas.push({ tipo: 'cadena', de: g.cadena[k], a: id }));
    if (g.vuelta) flechas.push({ tipo: 'vuelve', de: g.cadena[g.cadena.length - 1], a: g.vuelta });
  });

  return `<style>${CSS}
    @page { size: A3 landscape; margin: 0; }
    body { font-size: 12px; }
    .pagina { position: relative; width: 1587px; height: 1122px; padding: 34px 40px; overflow: hidden; page-break-after: always; }
    .pagina:last-child { page-break-after: auto; }
    h1 { font-size: 28px; } .sub { font-size: 14px; }
    .aviso { font-size: 14px; }
    .banda { position: relative; padding-left: 34px; margin-bottom: 26px; }
    .grid { display: grid; grid-template-columns: repeat(${POR_BANDA}, 1fr); column-gap: 70px; }
    .drow { display: grid; grid-template-columns: repeat(${POR_BANDA}, 1fr); column-gap: 70px; margin-bottom: 44px; }
    .dgrupo { padding-left: 60px; }
    .dnota { font-size: 11.5px; font-style: italic; font-weight: bold; color: #6b7280; margin-bottom: 4px; }
    .dcajas { display: flex; gap: 70px; align-items: flex-start; }
    .paso { border: 2.5px solid #3567d6; background: #eaf1ff; border-radius: 14px; padding: 10px 12px; }
    .paso.desv { width: 330px; }
    .cab { display: flex; gap: 9px; align-items: flex-start; }
    .badge { flex: none; min-width: 32px; height: 32px; border-radius: 16px; background: #3567d6; color: #fff; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; padding: 0 5px; }
    .preg { font-size: 15.5px; font-weight: bold; line-height: 1.3; }
    .dops { margin-top: 8px; display: grid; gap: 4px; font-size: 11.5px; }
    .dop { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
    .dop .hip, .dop .nada, .dop .der { padding: 2px 6px; font-size: 11px; }
    .dop .der span { display: none; }
    .resp { margin-top: 14px; }
    .rt { font-size: 11.5px; font-weight: bold; color: #6b7280; margin-bottom: 4px; }
    .op { display: grid; grid-template-columns: 1fr 20px 1.05fr; align-items: center; margin-bottom: 7px; }
    .ruta { border: 2px solid #3567d6; color: #3567d6; background: #fff; border-radius: 10px; padding: 5px 8px; font-weight: bold; font-size: 12px; margin: 2px 0; }
    .opt { background: #f8fafc; border: 1.5px solid #94a3b8; border-radius: 10px; padding: 5px 9px; }
    .opt b { display: block; font-size: 13px; } .opt span { display: block; font-size: 10.5px; color: #6b7280; line-height: 1.25; }
    .fl { text-align: center; color: #475569; font-weight: bold; font-size: 15px; }
    .hip { display: flex; gap: 6px; align-items: center; text-align: left; background: #f1e9ff; border: 2px solid #7c4ddb; border-radius: 10px; padding: 5px 8px; font-weight: bold; font-size: 12px; margin: 2px 0; }
    .nb { flex: none; min-width: 24px; height: 24px; border-radius: 12px; background: #7c4ddb; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; padding: 0 4px; }
    .der { background: #fde8e8; border: 2px solid #d0342c; color: #b42318; border-radius: 10px; padding: 5px 8px; font-size: 12px; margin: 2px 0; }
    .der span { display: block; font-size: 10px; color: #7a271a; font-weight: normal; }
    .nada { border: 1.5px dashed #94a3b8; border-radius: 10px; padding: 7px 8px; color: #6b7280; text-align: center; background: #fff; }
    .final { display: grid; grid-template-columns: 1fr 1.6fr 1.2fr; gap: 14px; margin-top: 6px; }
    .final > div { border-radius: 12px; padding: 10px 12px; font-size: 12.5px; }
    .ley div { display: flex; align-items: center; gap: 8px; margin: 3px 0; }
    .ley i { display: inline-block; width: 26px; height: 16px; border-radius: 5px; border: 2px solid; }
    svg.flechas { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; }
    .continua { font-size: 12px; font-weight: bold; color: #3567d6; text-align: right; margin-top: -14px; }
  </style>
  <div class="pagina" id="pag0">
    <h1>${esc(tree.title || `Árbol de decisión CIF · ${NOMBRES[region]}`)}</h1>
    <div class="sub">PhysiQ-Assessment · fase 4 · ${NOMBRES[region]}. Cada respuesta puede sumar una hipótesis; se acumulan y todas se confirman con tests en la fase 4b.</div>
    <div class="aviso">REQUISITO PREVIO · Banderas rojas (fase 1) y cribado sistémico (fase 2). Si hay una urgencia, derivar: este árbol no se aplica.</div>
    ${htmlBandas}
    <div class="final" id="final">
      <div class="ley" style="border:1.5px solid #cbd5e1;"><b>Leyenda</b>
        <div><i style="background:#eaf1ff;border-color:#3567d6"></i>Pregunta del árbol</div>
        <div><i style="background:#f1e9ff;border-color:#7c4ddb"></i>Hipótesis que activa la respuesta</div>
        <div><i style="background:#fde8e8;border-color:#d0342c"></i>Derivación médica (el recorrido sigue)</div>
        <div><i style="background:#fff;border-color:#94a3b8;border-style:dashed"></i>Sin hipótesis</div></div>
      <div style="border:1.5px dashed #94a3b8; background:#f8fafc;"><b>Al terminar sin ninguna hipótesis activa</b><br>La app propone trabajar con «dolor de ${NOMBRES[region].toLowerCase()} inespecífico», revisar los factores psicosociales (fase 1 y SINSS) y reconsiderar las respuestas. Si el cuadro es crónico y el riesgo psicosocial es alto, sugiere considerar también sensibilización central.</div>
      <div style="border:1.5px solid #64748b; background:#f1f5f9;"><b>Fase 4b · confirmar</b><br>Cada hipótesis activa se confirma o descarta con sus tests: ver el esquema de confirmación de ${NOMBRES[region].toLowerCase()}.<div class="pie">Generado desde los datos de la app el ${hoy}.</div></div>
    </div>
  </div>
  <script>
  (() => {
    const FLECHAS = ${JSON.stringify(flechas)};
    const ALTO = 1122 - 34;
    // Reparte las bandas en páginas A3: si una no cabe, pasa a una página nueva
    const pags = [document.getElementById('pag0')];
    let pag = pags[0];
    for (const el of [...pag.querySelectorAll('.banda'), document.getElementById('final')]) {
      if (el.parentElement !== pag) pag.appendChild(el);
      // No cabe y en la página ya hay otra banda antes que ella: a una página nueva
      const otras = [...pag.querySelectorAll('.banda')].filter(x => x !== el && (x.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)).length;
      // Si se pasa poco (≤ 15 %), se queda y la página se reduce después
      if ((el.offsetTop + el.offsetHeight) > ALTO * 1.15 && otras > 0) {
        const nueva = document.createElement('div'); nueva.className = 'pagina'; nueva.id = 'pag' + pags.length;
        document.body.insertBefore(nueva, pag.nextSibling); pags.push(nueva); pag = nueva;
        pag.appendChild(el);
      }
    }
    // Una página que aun así se pasa de alto (una banda muy larga) se reduce lo justo
    for (const p of pags) {
      const alto = p.scrollHeight;
      p._z = alto > 1122 ? 1122 / alto : 1;
      if (p._z < 1) { p.style.width = (1587 / p._z) + 'px'; p.style.height = (1122 / p._z) + 'px'; p.style.zoom = p._z; }
    }
    const NS = 'http://www.w3.org/2000/svg';
    for (const p of pags) {
      const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'flechas');
      svg.setAttribute('width', 3000); svg.setAttribute('height', 3000);
      svg.innerHTML = '<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#475569"/></marker></defs>';
      p.appendChild(svg); p._svg = svg;
    }
    const caja = id => { const e = document.getElementById('box_' + id); const p = e.closest('.pagina'); const r = e.getBoundingClientRect(), rp = p.getBoundingClientRect();
      const z = p._z || 1; // con zoom, las medidas del navegador vienen escaladas; el SVG vive dentro de la página sin escalar
      return { p, x: (r.left - rp.left) / z, y: (r.top - rp.top) / z, w: r.width / z, h: r.height / z, banda: e.closest('.banda') }; };
    const linea = (svg, pts, txt, tx, ty) => {
      const d = document.createElementNS(NS, 'path');
      d.setAttribute('d', 'M' + pts.map(q => q.join(' ')).join(' L'));
      d.setAttribute('fill', 'none'); d.setAttribute('stroke', '#475569'); d.setAttribute('stroke-width', '2.5'); d.setAttribute('stroke-linejoin', 'round'); d.setAttribute('marker-end', 'url(#ah)');
      svg.appendChild(d);
      if (txt) { const t = document.createElementNS(NS, 'text'); t.setAttribute('x', tx); t.setAttribute('y', ty); t.setAttribute('text-anchor', 'middle');
        t.setAttribute('font-size', '12'); t.setAttribute('font-weight', 'bold'); t.setAttribute('fill', '#475569'); t.setAttribute('font-family', 'Helvetica, Arial, sans-serif'); t.textContent = txt; svg.appendChild(t); }
    };
    for (const f of FLECHAS) {
      const a = caja(f.de), b = caja(f.a);
      if (a.p !== b.p) { // cambia de página: una nota en lugar de la flecha
        const n = document.createElement('div'); n.className = 'continua'; n.textContent = 'continúa en la página siguiente →';
        a.banda.appendChild(n); continue; }
      const svg = a.p._svg;
      if (f.tipo === 'sig' && a.banda === b.banda) {
        const y = a.y + Math.min(a.h / 2, 40);
        linea(svg, [[a.x + a.w, y], [b.x - 4, y]], f.txt, (a.x + a.w + b.x) / 2, y - 7);
      } else if (f.tipo === 'sig') { // salto de banda: baja por el hueco y entra por la izquierda
        const fondo = (a.banda.getBoundingClientRect().bottom - a.p.getBoundingClientRect().top) / (a.p._z || 1) + 12;
        const y = b.y + Math.min(b.h / 2, 40);
        linea(svg, [[a.x + a.w, a.y + 30], [a.x + a.w + 22, a.y + 30], [a.x + a.w + 22, fondo], [b.x - 22, fondo], [b.x - 22, y], [b.x - 4, y]], f.txt, a.x + a.w + 40, fondo - 6);
      } else if (f.tipo === 'entra') {
        const x0 = a.x + 26, y1 = b.y + Math.min(b.h / 2, 34);
        const xe = b.x > x0 ? b.x - 4 : b.x + b.w + 4;
        linea(svg, [[x0, a.y], [x0, y1], [xe, y1]], f.txt, x0 - 16, (a.y + y1) / 2);
      } else if (f.tipo === 'cadena') {
        const y = a.y + Math.min(a.h / 2, 34);
        linea(svg, [[a.x + a.w, y], [b.x - 4, y]]);
      } else if (f.tipo === 'vuelve') {
        const y0 = a.y + Math.min(a.h / 2, 34), xr = a.x + a.w + 26, yb = b.y - 16, xb = b.x + b.w / 2;
        linea(svg, [[a.x + a.w, y0], [xr, y0], [xr, yb], [xb, yb], [xb, b.y - 4]]);
      }
    }
  })();
  </script>`;
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
