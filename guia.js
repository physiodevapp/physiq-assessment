// Guía de consulta (guia.html): el porqué de cada elemento de los esquemas
// impresos (docs/esquemas), con la misma numeración, para abrirla desde el QR
// de cada hoja. Se pinta desde data/ con módulos puros (sin app.js ni state):
// nunca pide ni guarda datos del paciente. #<región>/<hoja>[/<elemento>]
import { SYSTEMIC_SCREENING, CIF_TREES, HYPOTHESES } from './data.js';
import { citasHTML, citasEnTexto, registroReferencias, enlaceCita } from './lib/citas.js';
import { iaParrafoHTML, ctxCribado, ctxArbol, ctxTest, attrIA, atributosIA, initAmpliarIA } from './ampliar-ia.js';
import { lrEfectiva, pesoTest, anatomiaPanelHTML, citasTest, calcLRScore, etiquetaHipHTML } from './lib/tests-4b.js';
import { resolveOptionTargets } from './lib/arbol.js';
import { CONDICION_SISTEMA, condicionPregunta, soloDeSistema, preguntasDeRegion, sistemasCribado, etiquetaPaso, HOJAS_GUIA } from './lib/esquemas.js';
import { nombreRegion } from './lib/region.js';
import { textoVersion } from './lib/version.js';
import './ficha.js';   // tarjeta de cada cita al tocarla

const REGIONES = Object.keys(CIF_TREES);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmtLR = n => n >= 10 ? n.toFixed(0) : n.toFixed(n < 1 ? 2 : 1);   // como phase4b.js
let REF = null;
// Calculadora de la confirmación: { [hipótesis]: { [test]: 'pos'|'neg' } }. Solo en
// memoria: no se guarda en ningún sitio y se borra al recargar o con «Borrar».
const RESULTADOS = {};

// ── Piezas comunes del «Por qué» ────────────────────────────────────────────
const seccion = (etq, html) => html ? `<div class="razon-seccion"><div class="razon-etq">${etq}</div>${html}</div>` : '';
const parrafos = texto => (texto || '').split('\n\n').filter(Boolean).map(p => `<p>${citasEnTexto(p)}${iaParrafoHTML()}</p>`).join('');
function fisiologiaHTML(f) {
  if (!f) return '';
  return `<div class="razon-seccion razon-fisio"><div class="razon-etq">Fisiología, paso a paso</div>
    <ol class="razon-pasos">${f.pasos.map(p => `<li>${citasEnTexto(p)}</li>`).join('')}</ol>
    ${f.nota ? `<p class="razon-fisio-nota">${citasEnTexto(f.nota)}</p>` : ''}
    <div class="razon-ia-pie">${iaParrafoHTML()}</div>
    ${f.metafora ? `<p class="razon-metafora"><span aria-hidden="true">💡</span> ${f.metafora}</p>` : ''}</div>`;
}
function fuentesHTML(citas) {
  if (!citas?.length) return '';
  const li = citas.map(c => enlaceCita(c, REF)).map(c => typeof c === 'string' ? `<li>${c}</li>`
    : `<li>${c.texto} <a class="razon-enlace" href="${c.url}" target="_blank" rel="noopener noreferrer">Abrir ↗</a></li>`).join('');
  return `<div class="razon-seccion razon-fuentes"><div class="razon-etq">Fuentes</div><ul>${li}</ul></div>`;
}
const porQue = (ctx, cuerpo) => cuerpo.trim()
  ? `<details class="razon"><summary>ⓘ Por qué y más</summary><div class="razon-cuerpo" data-ia-ctx="${attrIA(ctx)}">${cuerpo}</div></details>` : '';

// ── Cribado (fase 2) ────────────────────────────────────────────────────────
function htmlCribado(region) {
  const sc = SYSTEMIC_SCREENING[region];
  const { siempre, especiales } = sistemasCribado(SYSTEMIC_SCREENING, region);
  const sistema = s => {
    const preguntas = preguntasDeRegion(s, region);
    const conds = preguntas.map(condicionPregunta);
    const comun = conds.length && conds.every(c => c && c === conds[0]) ? conds[0] : '';
    const solo = soloDeSistema(s);
    const idx = Object.fromEntries(preguntas.map((q, i) => [q.id, i + 1]));
    const c = s.criterioCompuesto;
    const crit = c ? `<div class="guia-crit"><b>${esc(c.etiqueta)}</b> — ${c.minPositivas} o más de las preguntas ${c.ids.map(id => idx[id]).join(', ')}${c.filtro?.edadMax ? ` · edad ≤ ${c.filtro.edadMax}` : ''}${c.filtro?.evolucion ? ` · evolución: ${esc(c.filtro.evolucion)}` : ''}${c.nota ? `<br>${esc(c.nota)}` : ''}</div>` : '';
    return `<section class="guia-bloque${solo ? ' especial' : ''}"><h3>${esc(s.icon || '')} ${esc(s.nombre)}</h3>
      ${solo ? `<div class="guia-cond">Solo con ${esc(CONDICION_SISTEMA[solo])}${comun ? ` · ${esc(comun)}` : ''}</div>` : ''}
      ${preguntas.map((q, k) => {
        const r = q.razonamiento;
        const cuerpo = r ? seccion('Por qué', `<p>${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>`)
          + seccion('Cuánto pesa', `<p>${citasEnTexto(r.peso)}</p>`)
          + fisiologiaHTML(r.fisiologia) + seccion('En detalle', parrafos(r.detalle))
          + anatomiaPanelHTML(q) + fuentesHTML(r.citas || r.fuentes) : '';
        return `<div class="guia-item" id="q-${q.id}"><div class="guia-texto"><span class="guia-num">${k + 1}</span>${esc(q.text)}${q.urgencia ? '<span class="guia-chip urg">URGENCIA</span>' : q.derivacion ? '<span class="guia-chip der">DERIVACIÓN</span>' : ''}${conds[k] && !comun ? `<span class="guia-chip cuando">${esc(conds[k])}</span>` : ''}</div>
          ${q.urgencia ? `<div class="guia-nota guia-der">🚑 ${esc(q.urgencia)}</div>` : q.derivacion ? `<div class="guia-nota">🩺 ${esc(q.derivacion)}</div>` : ''}
          ${porQue(ctxCribado(region, q.text), cuerpo)}</div>`;
      }).join('')}${crit}</section>`;
  };
  const urg = sc.urgencia ? `<div class="guia-urg"><b>${esc(sc.urgencia.titulo)}</b>${sc.urgencia.lineas.map(l => `<div>· ${esc(l)}</div>`).join('')}</div>` : '';
  return `<h2>Cribado sistémico · ${nombreRegion(region)}</h2>${urg}
    ${siempre.map(sistema).join('')}
    ${especiales.length ? `<h2>Condiciones especiales</h2><p class="guia-nota">Solo aparecen en la fase 2 si en la fase 1 está marcada su tarjeta (o el mecanismo «Post-quirúrgico»).</p>${especiales.map(sistema).join('')}` : ''}`;
}

// ── Árbol CIF (fase 4) ──────────────────────────────────────────────────────
function htmlArbol(region) {
  const tree = CIF_TREES[region], steps = tree.steps;
  const lab = id => { const i = steps.findIndex(s => s.id === id); return etiquetaPaso(steps[i], i); };
  return `<h2>${esc(tree.title || `Árbol CIF · ${nombreRegion(region)}`)}</h2>
    <p class="guia-nota">Cada respuesta puede sumar una hipótesis; se acumulan y se confirman con tests en la fase 4b.</p>
    ${steps.map((st, i) => {
      const r = st.razonamiento;
      const cuerpo = r ? seccion('Por qué', `<p>${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>`)
        + seccion('En detalle', parrafos(r.detalle)) + fuentesHTML(r.citas || r.fuentes) : '';
      const ops = st.options.map(o => {
        const [corto, ...resto] = o.label.split('—');
        const hips = o.hypothesis.map(h => HYPOTHESES[h]).filter(Boolean).map(h => `<span class="guia-hip">${esc(h.num || '')} ${esc(h.name)}</span>`).join(', ');
        const t = resolveOptionTargets(tree, i, o)[0];
        const ruta = !t ? 'fin del árbol' : t.id !== steps[i + 1]?.id ? `sigue en el paso ${lab(t.id)}` : '';
        const res = [hips, o.derivacion ? `<span class="guia-der">Derivación médica: ${esc(o.derivacion)}</span>` : '', ruta].filter(Boolean).join(' · ');
        return `<li><b>${esc(corto.trim())}</b>${resto.length ? ` — ${esc(resto.join('—').trim())}` : ''}${res ? ` → ${res}` : ''}</li>`;
      }).join('');
      return `<section class="guia-bloque guia-item" id="paso-${st.id}"><h3><span class="guia-num">${esc(lab(st.id))}</span>${esc(st.question)}</h3>
        <ul class="guia-ops">${ops}</ul>${porQue(ctxArbol(region, st.iaPregunta || st.question), cuerpo)}</section>`;
    }).join('')}`;
}

// ── Confirmación (fase 4b) ──────────────────────────────────────────────────
function htmlConfirmacion(region) {
  const hyps = Object.values(HYPOTHESES).filter(h => h.region === region);
  const lrTxt = t => {
    const lr = lrEfectiva(t);
    const f = (v, o, util) => v == null ? '—' : `<span class="${util && t.tipo !== 'pronostico' ? 'util' : ''}">${o === 'calculada' ? '≈' : ''}${fmtLR(v)}</span>`;
    return `LR+ ${f(lr.pos, lr.origenPos, lr.posUtil)} · LR− ${f(lr.neg, lr.origenNeg, lr.negUtil)}`;
  };
  return `<h2>Confirmación de hipótesis · ${nombreRegion(region)}</h2>
    <p class="guia-nota">LR en verde: multiplica la puntuación (LR+ ≥ 2 o LR− ≤ 0,5). «≈» = calculada de S y E.</p>
    <div id="guiaResumenCalc">${resumenCalcHTML(region)}</div>
    ${hyps.map(h => {
      const clusters = Object.entries(h.clusters || {}).map(([cid, c]) => {
        const n = h.tests.filter(t => t.cluster === cid).length, lr = lrEfectiva(c);
        const reglas = [lr.posUtil ? `≥${c.umbralPos} de ${n} positivos → LR+ ${fmtLR(lr.pos)}` : '', lr.negUtil && c.umbralNeg != null ? `${c.umbralNeg === 0 ? 'ninguno' : `≤${c.umbralNeg}`} de ${n} positivos (todos hechos) → LR− ${fmtLR(lr.neg)}` : ''].filter(Boolean).join(' · ');
        return `<div class="guia-crit">🧩 <b>${esc(c.nombre)}</b>: ${reglas || 'sin LR aplicable'}. Sus tests no puntúan por separado.${c.fuente ? ` ${citasHTML(c.fuente)}` : ''}</div>`;
      }).join('');
      const tests = h.tests.map((t, k) => {
        const r = t.razonamiento;
        const cuerpo = (r?.porque ? seccion('Por qué', `<p>${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>`) : '')
          + seccion('En detalle', parrafos(r?.detalle)) + anatomiaPanelHTML(t) + fuentesHTML(citasTest(t));
        return `<div class="guia-item" id="test-${h.id}-${k}"><div class="guia-texto">${esc(t.name)}</div>
          <div class="guia-lr">${t.cluster ? `en el clúster ${esc(h.clusters?.[t.cluster]?.nombre || '')}` : lrTxt(t)}</div>
          <div class="guia-peso">${pesoTest(h, t, k)}</div>
          ${t.criterio ? `<div class="guia-criterio" ${atributosIA(ctxTest(region, t.name, h.name))} data-ia-parrafo>${citasEnTexto(t.criterio)}${iaParrafoHTML()}</div>` : ''}
          ${botonesTest(h.id, k)}
          ${porQue(ctxTest(region, t.name, h.name), cuerpo)}</div>`;
      }).join('');
      return `<section class="guia-bloque" id="hip-${h.id}"><h3><span class="guia-num">${esc(h.num || '')}</span>${esc(h.name)}</h3>
        <div class="guia-puntua" data-puntua="${h.id}">${puntuaHTML(h)}</div>${clusters}${tests}</section>`;
    }).join('')}`;
}

// ── Calculadora (mismas reglas que la fase 4b: calcLRScore, lib/tests-4b.js) ──
const RES_BTN = [['pos', '✓ Positivo'], ['neg', '✗ Negativo'], ['nd', 'Sin datos']];
function botonesTest(hId, k) {
  const r = RESULTADOS[hId]?.[k] || 'nd';
  return `<div class="test-result-btns guia-calc" role="group" aria-label="Resultado">${RES_BTN.map(([v, t]) =>
    `<button type="button" class="test-result-btn ${v}${r === v ? ' selected' : ''}" data-hip="${hId}" data-test="${k}" data-res="${v}" aria-pressed="${r === v}">${t}</button>`).join('')}</div>`;
}
function puntuaHTML(h) {
  const res = RESULTADOS[h.id] || {};
  return Object.keys(res).length ? etiquetaHipHTML(calcLRScore(h, res).label) : '<span class="guia-sin">Sin evaluar: marca los tests hechos</span>';
}
function resumenCalcHTML(region) {
  const hechas = Object.values(HYPOTHESES).filter(h => h.region === region && Object.keys(RESULTADOS[h.id] || {}).length)
    .map(h => ({ h, p: calcLRScore(h, RESULTADOS[h.id]) })).sort((a, b) => b.p.totalLR - a.p.totalLR);
  if (!hechas.length) return '<p class="guia-nota">Marca el resultado de los tests que hagas y cada hipótesis se puntúa como en la fase 4b de la app. No se guarda nada: se borra al recargar.</p>';
  return `<div class="guia-resumen"><div class="guia-resumen-cab"><b>Puntuación</b><button type="button" class="guia-borrar" data-borrar>Borrar resultados</button></div>
    ${hechas.map(({ h, p }) => `<a href="#${region}/confirmacion/hip-${h.id}" class="guia-resumen-fila"><span>${esc(h.num || '')} ${esc(h.name)}</span>${etiquetaHipHTML(p.label)}</a>`).join('')}
    <p class="guia-nota">No se guarda nada: se borra al recargar. Para la valoración completa, usa la app.</p></div>`;
}
function pintarCalc(region) {
  const r = document.getElementById('guiaResumenCalc');
  if (r) r.innerHTML = resumenCalcHTML(region);
}
document.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  const b = t?.closest('.guia-calc .test-result-btn');
  if (b) {
    const { hip, test, res } = b.dataset;
    const actual = RESULTADOS[hip] || (RESULTADOS[hip] = {});
    if (res === 'nd' || actual[test] === res) delete actual[test]; else actual[test] = res;
    if (!Object.keys(actual).length) delete RESULTADOS[hip];
    b.parentElement.outerHTML = botonesTest(hip, Number(test));
    const p = document.querySelector(`[data-puntua="${hip}"]`);
    if (p) p.innerHTML = puntuaHTML(HYPOTHESES[hip]);
    pintarCalc(HYPOTHESES[hip].region);
    return;
  }
  if (t?.closest('[data-borrar]')) {
    Object.keys(RESULTADOS).forEach(k => delete RESULTADOS[k]);
    pintar();
  }
});

const PINTAR = { cribado: htmlCribado, arbol: htmlArbol, confirmacion: htmlConfirmacion };

// ── Navegación ──────────────────────────────────────────────────────────────
function leerRuta() {
  const [r, h, el] = decodeURIComponent(location.hash.slice(1)).split('/');
  return { region: REGIONES.includes(r) ? r : 'lumbar', hoja: PINTAR[h] ? h : 'cribado', elemento: el || '' };
}

function pintar() {
  const { region, hoja, elemento } = leerRuta();
  document.getElementById('guiaRegion').value = region;
  document.getElementById('guiaHojas').innerHTML = Object.entries(HOJAS_GUIA)
    .map(([k, n]) => `<a href="#${region}/${k}"${k === hoja ? ' aria-current="page"' : ''}>${n}</a>`).join('');
  document.getElementById('guiaContenido').innerHTML = PINTAR[hoja](region);
  document.title = `${HOJAS_GUIA[hoja]} · ${nombreRegion(region)} · Guía de consulta`;
  const destino = elemento && document.getElementById(elemento);
  if (destino) {
    destino.classList.add('destacado');
    destino.querySelectorAll('details.razon').forEach(d => { d.open = true; });
    destino.scrollIntoView({ block: 'start' });
  } else window.scrollTo(0, 0);
}

async function iniciar() {
  const sel = document.getElementById('guiaRegion');
  sel.innerHTML = REGIONES.map(r => `<option value="${r}">${nombreRegion(r)}</option>`).join('');
  sel.addEventListener('change', () => { location.hash = `${sel.value}/${leerRuta().hoja}`; });
  // Las fuentes se enlazan con el registro; si no carga, se pintan sin enlace
  try { REF = await registroReferencias(); } catch { REF = null; }
  window.addEventListener('hashchange', pintar);
  pintar();
  const v = textoVersion();
  document.getElementById('guiaPie').innerHTML = `Contenido generado desde los datos de la app (versión ${esc(v)}). Si tu hoja impresa es más antigua, puede haber diferencias: manda lo que dice esta página. <a href="./">Abrir la app →</a><br>«✨ IA» abre una búsqueda externa con el texto de la guía, nunca con datos del paciente; PhysiQ no revisa la respuesta.`;
  initAmpliarIA();
}
iniciar();
