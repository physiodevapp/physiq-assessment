#!/usr/bin/env node
// Browser smoke test — launches the real app in Playwright and checks the
// things a unit test can't: that every ES module file actually loads (no
// broken `import` across app.js/state.js/data.js/phase4.js/phase4b.js/
// lib/session.js), that there are no console/page errors, and that a full
// walk through all 6 phases works by clicking the real UI (the same onclick
// handlers a physiotherapist would trigger) — for EACH of the 7 regions the
// app currently ships (hombro, cadera, cervical, lumbar, rodilla, codo,
// tobillo_pie), not
// just one. Each region has its own CIF_TREES entry with a different number
// of steps and branches, so walking only one region (as this file used to)
// leaves the other 6 regions' trees completely unexercised in a real browser.
//
// This project ships zero runtime dependencies (see CLAUDE.md) and this
// script keeps that true for the *app* — Playwright is dev-only tooling, not
// a project dependency. It is NOT listed in package.json. Run it with any
// Node that can resolve a `playwright` install, e.g.:
//
//   npx serve . &
//   node tests/smoke.mjs                       # if playwright is installed locally
//   NODE_PATH=/path/to/global/node_modules node tests/smoke.mjs   # if only installed globally
//
// Optional: `npm i -D playwright` once, if you want it as a local devDependency instead.
//
// Usage: node tests/smoke.mjs [url]   (defaults to http://localhost:3000)

import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  // Node's ESM resolver ignores NODE_PATH (only the legacy CJS resolver
  // honors it), so a global-only Playwright install needs this fallback.
  try {
    const { createRequire } = await import('node:module');
    ({ chromium } = createRequire(import.meta.url)('playwright'));
  } catch {
    console.error('Playwright is not available. Install it once with `npm i -D playwright`,');
    console.error('or run with NODE_PATH pointing at a global Playwright install.');
    process.exit(1);
  }
}

const BASE_URL = process.argv[2] || process.env.SMOKE_URL || 'http://localhost:3000';
// data/*.js: data.js los importa estáticamente, así que uno que falte rompe la app entera.
const MODULE_FILES = ['app.js', 'state.js', 'data.js', 'phase4.js', 'phase4b.js', 'lib/session.js', 'lib/posquirurgico.js',
  'data/comun.js', 'data/hombro.js', 'data/cadera.js', 'data/cervical.js', 'data/lumbar.js', 'data/rodilla.js', 'data/codo.js', 'data/tobillo_pie.js'];
const KNOWN_NOISE = ['ERR_CERT_AUTHORITY_INVALID']; // sandboxed egress proxy noise, not app errors
// Keep in sync with the region keys in CIF_TREES/SYSTEMIC_SCREENING (data.js)
// and VALID_REGIONS in tests/unit.js — add a new region to all three.
const REGIONS = ['hombro', 'cadera', 'cervical', 'lumbar', 'rodilla', 'codo', 'tobillo_pie'];

// Click the *last* rendered step each time — earlier steps stay in the DOM
// (answered options remain clickable, to allow changing an answer), so
// querying `#cifTree .option-btn` globally always matches the FIRST step
// ever rendered, not the pending one. That used to make this loop toggle
// the first step's first option on/off without ever reaching later steps,
// silently leaving the tree unanswered (caught by instrumenting this file:
// ended with `state.treeAnswers === {}`) — a real bug this fixes, not just a
// stylistic cleanup. `.locator(...).last()` re-queries fresh each turn.
async function walkCifTreeToCompletion(page) {
  for (let i = 0; i < 20; i++) {
    const lastStep = page.locator('#cifTree .tree-question').last();
    if (await lastStep.count() === 0) break;
    const opt = lastStep.locator('.option-btn, button').first();
    if (await opt.count() === 0) break;
    await opt.click().catch(() => {});
    await page.waitForTimeout(100);
    // Stop as soon as the tree is complete — otherwise the loop would keep
    // clicking the terminal step's already-selected option (nothing new to
    // render, so it stays "last"), and a second click on an already-selected
    // option UN-answers it (see selectTreeOption in phase4.js), silently
    // undoing completion.
    if (await page.locator('#treeComplete').count() > 0) break;
  }
  return page.evaluate(() => ({
    answeredSteps: Object.keys(state.treeAnswers).length,
    activeHypotheses: state.activeHypotheses.length,
    treeCompleteShown: !!document.getElementById('treeComplete'),
  }));
}

// Walks phases 1-5 for a single region via real UI clicks (the same onclick
// handlers a physiotherapist would trigger), always picking the first
// available option at each step — one golden path per region, not every
// branch, but enough to prove that region's CIF_TREES entry actually
// renders and completes in a real browser.
async function walkRegion(page, region) {
  await page.fill('#motivoConsulta', `Dolor de ${region} tras esfuerzo`);
  await page.click('#mecanismo .option-btn >> nth=0');
  await page.click('#cronologia .option-btn >> nth=0');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);

  await page.click(`[onclick="selectRegion('${region}', this)"]`);
  await page.waitForTimeout(150);
  await page.click('#btnContinuarSinss');
  await page.waitForTimeout(150);

  await page.click('#phase3 .nrs-btn >> nth=6');
  await page.evaluate(() => {
    ['naturaleza', 'estabilidad'].forEach(g => document.getElementById(g)?.querySelector('.option-btn')?.click());
  });
  await page.fill('#signoComparable', `Signo comparable de ${region}`);
  await page.click('#phase3 .btn-primary:has-text("Algoritmo CIF")');
  await page.waitForTimeout(150);

  const treeResult = await walkCifTreeToCompletion(page);

  // No forced state here on purpose: if the walk above didn't really reach
  // tree completion, `#btnGoConfirm` stays disabled and Playwright's
  // actionability check fails the click below loudly, instead of a hidden
  // hack papering over a broken CIF tree walk.
  await page.click('#btnGoConfirm');
  await page.waitForTimeout(150);

  await page.click('#phase4b button:has-text("Ver Resultados")');
  await page.waitForTimeout(150);

  const finalPhase = await page.evaluate(() => state.currentPhase);
  return { region, treeResult, finalPhase };
}

// Same golden path in modo breve (docs/modo-breve.md), again by real clicks:
// embudo NO on every system (clicking each desktop tab), irritabilidad
// directa, and «Resultados sin confirmar» from phase 4 straight to phase 5.
// Checks the safety invariant in a real browser — with every embudo in NO,
// the only screening questions still visible are the ones with `urgencia` —
// and that phase 5 carries the transparency line and the pending tests.
async function walkRegionBreve(page, region) {
  await page.click('#modoConsulta .option-btn:has-text("Breve")');
  await page.fill('#motivoConsulta', `Dolor de ${region} (breve)`);
  await page.click('#mecanismo .option-btn >> nth=0');
  await page.click('#cronologia .option-btn >> nth=0');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);

  await page.click(`[onclick="selectRegion('${region}', this)"]`);
  await page.waitForTimeout(150);
  const sisIds = await page.evaluate(() => [...document.querySelectorAll('#sistemaTabs .sistema-tab')].map(t => t.id.replace('tab_', '')));
  for (const id of sisIds) {
    await page.click(`#tab_${id}`);
    await page.click(`#panel_${id} [data-embudo] .sq-btn.no`);
  }
  const screening = await page.evaluate(() => {
    // Own computed display (not offsetParent): inactive tab panels are hidden as
    // a whole, but the embudo rule is what must hide each non-urgent question.
    const visibles = [...document.querySelectorAll('#sistemaPanels .sq2')].filter(el => getComputedStyle(el).display !== 'none');
    return {
      noUrgVisibles: visibles.filter(el => !el.classList.contains('sq2-urg')).length,
      urgVisibles: visibles.filter(el => el.classList.contains('sq2-urg')).length,
      urgTotal: document.querySelectorAll('#sistemaPanels .sq2.sq2-urg').length,
      embudoNo: Object.values(state.sistemicoBreve).filter(v => v === 'NO').length,
    };
  });
  await page.click('#btnContinuarSinss');
  await page.waitForTimeout(150);

  await page.click('#phase3 .nrs-btn >> nth=6');
  await page.click('#irritabDirecta .option-btn >> nth=1');
  const naturalezaOculta = await page.evaluate(() => getComputedStyle(document.getElementById('naturaleza').closest('.card')).display === 'none');
  await page.click('#phase3 .btn-primary:has-text("Algoritmo CIF")');
  await page.waitForTimeout(150);

  const treeResult = await walkCifTreeToCompletion(page);
  await page.click('#btnSinConfirmar');
  await page.waitForTimeout(150);

  const fase5 = await page.evaluate(() => ({
    phase: state.currentPhase,
    transparencia: document.getElementById('resultsContent').textContent.includes('Valoración inicial breve'),
    pendienteTests: document.getElementById('resultsContent').textContent.includes('Tests de confirmación sin hacer'),
    irritab: state.irritabilidadDirecta && state.irritabilidadNivel === 'Moderada',
  }));
  const ok = treeResult.treeCompleteShown && fase5.phase === 5 && fase5.transparencia && fase5.irritab && naturalezaOculta
    && screening.noUrgVisibles === 0 && screening.urgVisibles === screening.urgTotal && screening.embudoNo === sisIds.length
    && (treeResult.activeHypotheses === 0 || fase5.pendienteTests);
  return { region, ok, treeResult, screening, fase5, naturalezaOculta };
}

// Paciente posquirúrgico (docs/posquirurgico.md), por clics reales en cada
// región: con mecanismo Post-quirúrgico aparece la tarjeta «Cirugía» (y se
// oculta al quitarlo), las notas bajo las preguntas de traumatismo se ven en
// la fase 2, y la fase 5 abre con el recuadro del protocolo del cirujano.
async function walkRegionPosq(page, region) {
  await page.fill('#motivoConsulta', `Dolor de ${region} tras la cirugía`);
  const oculta = !(await page.isVisible('#cardCirugia'));
  await page.click('#mecanismo .option-btn:has-text("Post-quirúrgico")');
  const visible = await page.isVisible('#cardCirugia');
  await page.fill('#cirIntervencion', `Cirugía de ${region}`);
  await page.fill('#cirSemanas', '6');
  await page.click('#cirProtocolo .option-btn:has-text("Escrito")');
  await page.fill('#cirRestricciones', 'Sin carga hasta la semana 8');
  await page.click('#cirComplicaciones .option-btn:has-text("Ninguna")');
  const semanas = await page.textContent('#cirSemanasTxt');
  await page.click('#cronologia .option-btn >> nth=0');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);

  await page.click(`[onclick="selectRegion('${region}', this)"]`);
  await page.waitForTimeout(150);
  const notas = await page.evaluate(() => {
    const els = [...document.querySelectorAll('#sistemaPanels .nota-posq')];
    return { total: els.length, visibles: els.filter(el => getComputedStyle(el).display !== 'none').length };
  });
  await page.click('#btnContinuarSinss');
  await page.waitForTimeout(150);
  await page.click('#phase3 .nrs-btn >> nth=4');
  await page.fill('#signoComparable', 'Flexión');
  await page.click('#phase3 .btn-primary:has-text("Algoritmo CIF")');
  await page.waitForTimeout(150);
  const treeResult = await walkCifTreeToCompletion(page);
  await page.click('#btnGoConfirm');
  await page.waitForTimeout(150);
  await page.click('#phase4b button:has-text("Ver Resultados")');
  await page.waitForTimeout(150);
  const fase5 = await page.evaluate(() => {
    const t = document.getElementById('resultsContent').textContent;
    return { phase: state.currentPhase, recuadro: t.includes('Paciente posquirúrgico') && t.includes('Sin carga hasta la semana 8'),
      cq: state.cirugia.protocolo === 'Escrito' && state.cirugia.semanasAprox === 6 };
  });
  const ok = oculta && visible && semanas.startsWith('6 semanas') && notas.visibles === notas.total
    && treeResult.treeCompleteShown && fase5.phase === 5 && fase5.recuadro && fase5.cq;
  return { region, ok, oculta, visible, semanas, notas, treeResult, fase5 };
}

// Hombro operado de una fractura: h_step2b «traumatismo previo» activa h11
// («Derivar»). Marcada «ya diagnosticada y tratada» en la 4b, la fase 5 no
// pide derivación y dice que se siga el protocolo del cirujano.
async function checkHombroTratada(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.fill('#motivoConsulta', 'Rigidez tras fractura de húmero operada');
  await page.click('#mecanismo .option-btn:has-text("Post-quirúrgico")');
  await page.fill('#cirIntervencion', 'Osteosíntesis de húmero proximal');
  await page.click('#cirProtocolo .option-btn:has-text("Verbal")');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('hombro', this)"]`);
  await page.waitForTimeout(150);
  const notaTrauma = await page.evaluate(() => getComputedStyle(document.querySelector('#sq2_h_t1 .nota-posq')).display !== 'none');
  await page.click('#btnContinuarSinss');
  await page.waitForTimeout(150);
  await page.click('#phase3 .nrs-btn >> nth=4');
  await page.click('#phase3 .btn-primary:has-text("Algoritmo CIF")');
  await page.waitForTimeout(150);
  const elegir = async (stepId, idx) => { await page.click(`#opts_${stepId} .option-btn >> nth=${idx}`); await page.waitForTimeout(120); };
  await elegir('h_step1', 2);
  await elegir('h_step2', 0);
  await elegir('h_step2b', 0);          // traumatismo previo → h11
  await walkCifTreeToCompletion(page);
  await page.click('#btnGoConfirm');
  await page.waitForTimeout(150);
  await page.click('#hypcard_h11 .hypothesis-header');
  await page.waitForTimeout(150);
  await page.click('#hypcard_h11 .dx-tratada input');
  await page.waitForTimeout(150);
  const en4b = await page.evaluate(() => ({
    marcada: !!state.derivacionResuelta.h11,
    etiqueta: document.getElementById('score_h11').textContent,
    abierta: document.getElementById('hypcard_h11').classList.contains('open'),
    testsPlegados: !!document.querySelector('#hypcard_h11 details.dx-tratada-tests:not([open])'),
  }));
  await page.click('#phase4b button:has-text("Ver Resultados")');
  await page.waitForTimeout(150);
  const fase5 = await page.evaluate(() => {
    const t = document.getElementById('resultsContent').textContent;
    return { sinDerivacion: !t.includes('🚑 Derivación'), protocolo: t.includes('Ya intervenida: seguir el protocolo del cirujano'),
      casillaMarcada: !!document.querySelector('#resultsContent .dx-tratada input:checked') };
  });
  const ok = notaTrauma && en4b.marcada && en4b.etiqueta.includes('Diagnosticada y tratada') && en4b.abierta && en4b.testsPlegados
    && fase5.sinDerivacion && fase5.protocolo && fase5.casillaMarcada;
  return { ok, notaTrauma, en4b, fase5 };
}

// Razonamiento del cribado (fase 2, docs/razonamiento-cribado.md): nivel 1
// («¿Por qué?», <details>) y nivel 2 («Ampliar →»). Escritorio: panel lateral
// sin velo — se puede seguir contestando SÍ/NO con él abierto, «Ampliar» en
// otra pregunta cambia el contenido sin cerrarlo, Escape lo cierra. Móvil
// (390 px): bottom sheet con velo; el botón atrás lo cierra sin cambiar de
// fase, y la × también, sin dejar una entrada colgando en el historial.
const RAZON_SIS = 'l_cancer', RAZON_Q1 = 'l2', RAZON_Q2 = 'l_on2';
async function irAFase2(page, region) {
  await page.fill('#motivoConsulta', `Dolor de ${region} (razonamiento)`);
  await page.click('#mecanismo .option-btn >> nth=0');
  await page.click('#cronologia .option-btn >> nth=0');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('${region}', this)"]`);
  await page.waitForTimeout(200);
}
const razonEstado = page => page.evaluate(() => {
  const p = document.getElementById('razonPanel');
  const r = p.getBoundingClientRect();
  return {
    abierto: p.classList.contains('open'),
    visible: r.width > 0 && r.left < innerWidth && r.top < innerHeight && getComputedStyle(p).visibility === 'visible',
    velo: getComputedStyle(document.getElementById('razonScrim')).display !== 'none',
    pregunta: document.getElementById('razonPregunta').textContent,
    fase: state.currentPhase,
    ancho: r.width, alto: r.height, vw: innerWidth, vh: innerHeight,
    scrollX: document.documentElement.scrollWidth > innerWidth,
  };
});

// Derivación pedida por el árbol (`derivacion` en una opción de CIF_TREES):
// lumbar, paso 1 NO y paso 2 VASCULAR. Comprueba el aviso bajo el paso, en el
// «árbol completado» y en la fase 5, por clics reales.
async function checkDerivacionVascular(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.fill('#motivoConsulta', 'Dolor lumbar al caminar');
  await page.click('#mecanismo .option-btn >> nth=0');
  await page.click('#cronologia .option-btn >> nth=0');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('lumbar', this)"]`);
  await page.waitForTimeout(150);
  await page.click('#btnContinuarSinss');
  await page.waitForTimeout(150);
  await page.click('#phase3 .nrs-btn >> nth=4');
  await page.fill('#signoComparable', 'Marcha');
  await page.click('#phase3 .btn-primary:has-text("Algoritmo CIF")');
  await page.waitForTimeout(150);
  const elegir = async (stepId, idx) => { await page.click(`#opts_${stepId} .option-btn >> nth=${idx}`); await page.waitForTimeout(120); };
  await elegir('lu_step1', 1);          // NO
  await elegir('lu_step2', 2);          // VASCULAR
  const bajoPaso = await page.isVisible('#deriv_lu_step2 .alert-danger');
  await elegir('lu_step3', 0);
  await elegir('lu_step4', 0);
  const enCompleto = await page.isVisible('#treeComplete .alert-danger');
  await page.click('#btnGoConfirm');
  await page.waitForTimeout(150);
  await page.click('#phase4b button:has-text("Ver Resultados")');
  await page.waitForTimeout(150);
  const enFase5 = await page.evaluate(() => document.getElementById('resultsContent')?.textContent.includes('Derivación médica pendiente'));
  return { ok: bajoPaso && enCompleto && enFase5, bajoPaso, enCompleto, enFase5 };
}

async function checkRazonamientoEscritorio(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await irAFase2(page, 'lumbar');
  const base = `#panel_${RAZON_SIS}`;
  await page.click(`${base} #sq2_${RAZON_Q1} details.razon > summary`);
  const inlineVisible = await page.isVisible(`${base} #sq2_${RAZON_Q1} .razon-cuerpo`);
  await page.click(`${base} #sq2_${RAZON_Q1} .razon-ampliar`);
  await page.waitForTimeout(400);
  const a = await razonEstado(page);
  // Sin velo: el SÍ de otra pregunta se puede pulsar con el panel abierto
  await page.click(`${base} #sq2_${RAZON_Q2} .sq-btn.si`);
  const siConPanel = await page.evaluate(q => state.sistemicoAnswers[q] === 'SI', RAZON_Q2);
  await page.click(`${base} #sq2_${RAZON_Q2} details.razon > summary`);
  await page.click(`${base} #sq2_${RAZON_Q2} .razon-ampliar`);
  await page.waitForTimeout(150);
  const b = await razonEstado(page);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const c = await razonEstado(page);
  const ok = inlineVisible && a.abierto && a.visible && !a.velo && siConPanel
    && b.abierto && b.pregunta !== a.pregunta && !c.abierto && c.fase === 2;
  return { ok, inlineVisible, siConPanel, a, b, c };
}

async function checkRazonamientoMovil(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await irAFase2(page, 'lumbar');
  const acc = `#acc_${RAZON_SIS}`;
  await page.click(`${acc} .sistema-accordion-header`);
  await page.waitForTimeout(200);
  await page.click(`${acc} #sq2_${RAZON_Q1} details.razon > summary`);
  await page.click(`${acc} #sq2_${RAZON_Q1} .razon-ampliar`);
  await page.waitForTimeout(400);
  const a = await razonEstado(page);
  await page.goBack();                       // botón atrás: cierra el sheet, sigue en la fase 2
  await page.waitForTimeout(400);
  const b = await razonEstado(page);
  await page.click(`${acc} #sq2_${RAZON_Q1} .razon-ampliar`);
  await page.waitForTimeout(400);
  const c = await razonEstado(page);
  await page.click('#razonCerrar');
  await page.waitForTimeout(500);
  const d = await razonEstado(page);
  await page.goBack();                       // sin entrada colgando: este atrás ya va a la fase 1
  await page.waitForTimeout(400);
  const fase = await page.evaluate(() => state.currentPhase);
  const ok = a.abierto && a.visible && a.velo && a.alto > a.vh * 0.7 && !a.scrollX
    && !b.abierto && b.fase === 2 && c.abierto && !d.abierto && d.fase === 2 && fase === 1;
  return { ok, a, b, c, d, faseTrasAtras: fase };
}

// Informe narrativo con IA (informe-ia.js, solo standalone). Sin coste: el
// worker (/validate y POST /) y Turnstile se simulan con page.route. Cubre:
// sin licencia → tarjeta desactivada; «Introducir clave»; una respuesta en
// modo demo se descarta; audio adjunto exige consentimiento; el informe llega
// por SSE, se guarda en state.informeIA y se copia como texto plano. Y dentro
// de un iframe (hub) informe-ia.js ni se descarga.
const CLAVE_OK = 'CLAVE-SMOKE-OK';
async function mockWorkerYTurnstile(context, captura) {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Expose-Headers': 'X-PhysiQ-Mode' };
  await context.route('**/turnstile/v0/api.js*', route => route.fulfill({
    contentType: 'application/javascript',
    // Como el real: reset() vuelve a resolver y emite un token nuevo
    body: `let _o = null;
      window.turnstile = { render(el, o) { _o = o; el.textContent = 'turnstile simulado'; setTimeout(() => o.callback('tok-' + Date.now()), 30); return 'w1'; },
        reset() { setTimeout(() => _o && _o.callback('tok-' + Date.now()), 30); } };
      window.__iaTurnstileOnload && window.__iaTurnstileOnload();`,
  }));
  await context.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', async route => {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    const real = req.headers()['x-license-key'] === CLAVE_OK;
    if (req.url().endsWith('/validate')) {
      return route.fulfill({ headers: { ...cors, 'X-PhysiQ-Mode': real ? 'real' : 'demo' }, contentType: 'application/json',
        body: JSON.stringify({ ok: true, mode: real ? 'real' : 'demo', routes: { report: real ? 'real' : 'demo', email: 'demo' }, demoOnly: false }) });
    }
    captura.push(req.postDataBuffer()?.toString('latin1') || '');
    const sse = (t, d) => `event: ${t}\ndata: ${JSON.stringify(d)}\n\n`;
    const modo = captura.length === 1 ? 'demo' : 'real';   // la primera petición simula un worker en demo
    // La tercera simula un fallo de la API tal como lo reenvía el worker
    if (captura.length === 3) {
      return route.fulfill({ headers: { ...cors, 'X-PhysiQ-Mode': 'real' }, contentType: 'text/event-stream',
        body: sse('error', { message: 'Claude: Your credit balance is too low to access the Anthropic API.' }) });
    }
    // La cuarta, una ficha breve
    if (captura.length === 4) {
      return route.fulfill({ headers: { ...cors, 'X-PhysiQ-Mode': 'real' }, contentType: 'text/event-stream',
        body: sse('report_chunk', { text: '## PRESENTACIÓN CLÍNICA\nTexto.\n\n## HALLAZGOS Y CODIFICACIÓN CIF\nTexto.\n\n' })
          + sse('report_chunk', { text: '## OBJETIVOS Y PLAN\nReevaluar en dos semanas.' })
          + sse('done', { success: true }) });
    }
    return route.fulfill({ headers: { ...cors, 'X-PhysiQ-Mode': modo }, contentType: 'text/event-stream',
      body: sse('transcript', { text: 'Transcripción simulada de la sesión.' })
        + sse('report_chunk', { text: modo === 'demo' ? '## INFORME DEMO DE OTRO PACIENTE\n' : '## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES\nTexto clínico.\n\n' })
        + sse('report_chunk', { text: '## SEGUIMIENTO FUNCIONAL\nPendiente de reevaluaciones programadas.' })
        + sse('done', { success: true }) });
  });
}

// Exportar / importar la valoración (panel de sesión, lib/valoracion-json.js):
// lumbar completo con nombre → exportar (descarga real) → borrar sesión →
// importar el archivo → tras la recarga vuelve todo, en la fase 5. Y a 320 px
// los dos botones caben sin cortar el texto.
async function checkExportarImportar(browser, errors, tmpDir) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  await context.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', route => route.fulfill({
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'X-PhysiQ-Mode': 'demo' },
    contentType: 'application/json',
    body: JSON.stringify({ ok: true, mode: 'demo', routes: { report: 'demo', email: 'demo' }, demoOnly: false }),
  }));
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (exportar): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console (exportar): ${msg.text()}`); });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const r = {};

  await page.click('#sessionBtn');
  r.exportarDesactivadoAlEmpezar = await page.isDisabled('#sessionExport');
  await page.fill('#patientName', 'Prueba Exportación');
  await page.keyboard.press('Enter');
  await walkRegion(page, 'lumbar');
  const antes = await page.evaluate(() => JSON.stringify({ p: state.patient, r: state.region, t: state.treeAnswers, f: state.currentPhase, m: state.motivoConsulta, s: state.signoComparable }));

  await page.click('#sessionBtn');
  const [descarga] = await Promise.all([page.waitForEvent('download'), page.click('#sessionExport')]);
  r.nombreArchivo = descarga.suggestedFilename();
  const ruta = `${tmpDir}/${r.nombreArchivo}`;
  await descarga.saveAs(ruta);

  // Borrar sesión (el panel sigue abierto tras exportar): la app vuelve a la fase 1 vacía
  r.panelSigueAbierto = await page.isVisible('#sessionPanelClear');
  await page.click('#sessionPanelClear');
  await page.click('#confirmAction');
  await page.waitForTimeout(200);
  r.borrada = await page.evaluate(() => state.currentPhase === 1 && !state.region);

  // Importar: confirmación → recarga → restaurado
  await page.click('#sessionBtn');
  await page.setInputFiles('#sessionImportFile', ruta);
  await page.waitForSelector('#confirmBanner');
  await Promise.all([page.waitForEvent('load'), page.click('#confirmAction')]);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);
  const despues = await page.evaluate(() => JSON.stringify({ p: state.patient, r: state.region, t: state.treeAnswers, f: state.currentPhase, m: state.motivoConsulta, s: state.signoComparable }));
  r.restaurado = antes === despues;
  r.fase5Visible = await page.isVisible('#phase5');

  // Un archivo que no es una valoración: aviso y nada cambia
  const malo = `${tmpDir}/no-es-valoracion.json`;
  writeFileSync(malo, JSON.stringify({ app: 'otra' }));
  await page.click('#sessionBtn');
  await page.setInputFiles('#sessionImportFile', malo);
  await page.waitForTimeout(300);
  r.rechazaMalo = !(await page.isVisible('#confirmBanner')) && (await page.evaluate(() => state.region)) === 'lumbar';
  await page.evaluate(() => closeSessionPanel());

  // 320 px: los dos botones dentro del panel y sin texto cortado
  await page.setViewportSize({ width: 320, height: 640 });
  await page.click('#sessionBtn');
  r.caben320 = await page.evaluate(() => {
    const panel = document.getElementById('sessionPanel').getBoundingClientRect();
    return ['sessionExport', 'sessionImport'].every(id => {
      const b = document.getElementById(id);
      const rb = b.getBoundingClientRect();
      return rb.left >= panel.left && rb.right <= panel.right && b.scrollWidth <= b.clientWidth && rb.height >= 40;
    });
  });

  await context.close();
  r.ok = r.exportarDesactivadoAlEmpezar && /^valoracion-prueba-exportacion-\d{4}-\d{2}-\d{2}\.json$/.test(r.nombreArchivo)
    && r.borrada && r.restaurado && r.fase5Visible && r.rechazaMalo && r.caben320;
  return r;
}

async function checkInformeNarrativo(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const captura = [];
  await mockWorkerYTurnstile(context, captura);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (informe IA): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console (informe IA): ${msg.text()}`); });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.removeItem('physiq-license-key'); } catch {} });
  await page.reload({ waitUntil: 'networkidle' });
  const sinBotonSinLicencia = !(await page.isVisible('#grabBtn'));
  await walkRegion(page, 'lumbar');
  await page.waitForSelector('#iaLicencia .ia-licencia');
  const r = { sinBotonSinLicencia };
  r.sinLicencia = await page.isVisible('#iaLicencia :text("Disponible con licencia PhysiQ")');
  r.generadorOculto = await page.evaluate(() => document.getElementById('iaGenerador').hidden);

  // «Introducir clave»: una mala no se guarda, la buena sí y activa la tarjeta
  await page.click('#iaLicencia button:has-text("Introducir clave")');
  await page.fill('#iaClaveInput', 'CLAVE-MALA');
  await page.click('#iaClaveBtn');
  await page.waitForSelector('.ia-clave-msg');
  r.claveMalaNoGuardada = await page.evaluate(() => localStorage.getItem('physiq-license-key') === null);
  await page.fill('#iaClaveInput', CLAVE_OK);
  await page.click('#iaClaveBtn');
  await page.waitForFunction(() => !document.getElementById('iaGenerador').hidden);
  r.claveGuardada = await page.evaluate(k => localStorage.getItem('physiq-license-key') === k, CLAVE_OK);
  r.botonCabeceraConLicencia = await page.isVisible('#grabBtn');
  await page.waitForFunction(() => !document.getElementById('iaGenerar').disabled);
  // Consulta completa → narrativo por defecto; el selector cambia la elección
  r.plantillaPorDefecto = await page.evaluate(() =>
    document.querySelector('#iaPlantilla .option-btn.selected')?.textContent.includes('Narrativo'));
  await page.click('#iaPlantilla .option-btn:has-text("Ficha breve")');
  await page.click('#iaPlantilla .option-btn:has-text("Narrativo")');
  r.plantillaCambia = await page.evaluate(() =>
    document.querySelectorAll('#iaPlantilla .option-btn.selected').length === 1
    && document.querySelector('#iaPlantilla .option-btn.selected').textContent.includes('Narrativo'));

  // Respuesta en demo: se descarta, nunca se guarda el informe ficticio
  await page.click('#iaGenerar');
  await page.waitForFunction(() => document.querySelector('#iaLicencia .ia-licencia'));
  r.demoDescartado = await page.evaluate(() => state.informeIA === null && !document.getElementById('iaResultado').textContent.includes('DEMO'));
  await page.evaluate(() => iaReintentarLicencia());
  await page.waitForFunction(() => !document.getElementById('iaGenerador').hidden);

  // Audio adjunto → consentimiento obligatorio
  await page.setInputFiles('#iaArchivo', { name: 'sesion.webm', mimeType: 'audio/webm', buffer: Buffer.from('audio-falso') });
  await page.waitForSelector('#iaConsent input[type=checkbox]');
  await page.waitForTimeout(150);
  r.bloqueadoSinConsent = await page.evaluate(() => document.getElementById('iaGenerar').disabled);
  await page.check('#iaConsent input[type=checkbox]');
  await page.waitForFunction(() => !document.getElementById('iaGenerar').disabled);
  await page.click('#iaGenerar');
  await page.waitForSelector('#iaResultado .ia-resultado-det', { state: 'attached' });
  const cuerpo = Buffer.from(captura[1] || '', 'latin1').toString('utf8');
  r.peticion = cuerpo.includes('name="file"') && cuerpo.includes('DATOS DE VALORACI') && cuerpo.includes('{{TRANSCRIPT}}') && cuerpo.includes('name="whisperHint"');
  // Datos ampliados: el recorrido del árbol CIF va en el prompt
  r.promptAmpliado = cuerpo.includes('Recorrido de la exploración (pregunta clínica') && /name="maxTokens"\r\n\r\n7000/.test(cuerpo);
  // El informe llega plegado, con las acciones a la vista
  r.resultadoPlegado = await page.evaluate(() => {
    const det = document.getElementById('iaResultadoDet');
    return !!det && !det.open && det.querySelector('summary').textContent.includes('Narrativo');
  }) && await page.isVisible('#iaResultado button:has-text("Compartir")');
  r.guardado = await page.evaluate(() => !!state.informeIA?.texto && state.informeIA.conAudio === true
    && state.informeIA.transcripcion.includes('simulada'));
  r.audioBorrado = await page.evaluate(() => new Promise(res => {
    const rq = indexedDB.open('physiq', 3);
    rq.onsuccess = () => { const g = rq.result.transaction('audio').objectStore('audio').get('assessment-meta'); g.onsuccess = () => res(g.result === undefined); };
  }));
  await page.click('#iaResultado button:has-text("Copiar")');
  await page.waitForTimeout(200);
  const copiado = await page.evaluate(() => navigator.clipboard.readText());
  r.copiado = copiado.startsWith('INFORME DE FISIOTERAPIA') && copiado.includes('CONDICIÓN DE SALUD') && !copiado.includes('##');
  r.sinScrollX = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);

  // Un fallo de la API se queda en la tarjeta, en español y con el original
  await page.click('#iaGenSummary');
  await page.waitForFunction(() => !document.getElementById('iaGenerar').disabled);
  await page.click('#iaGenerar');
  await page.waitForSelector('#iaError .ia-error');
  r.errorLegible = await page.evaluate(() => {
    const t = document.getElementById('iaError').textContent;
    return t.includes('Anthropic (redacción)') && t.includes('no tiene saldo') && t.includes('credit balance is too low')
      && !!state.informeIA?.texto;   // el informe anterior sigue ahí
  });

  // Ficha breve: su propio límite y su propia última sección
  await page.click('#iaPlantilla .option-btn:has-text("Ficha breve")');
  await page.waitForFunction(() => !document.getElementById('iaGenerar').disabled);
  await page.click('#iaGenerar');
  await page.waitForFunction(() => state.informeIA?.plantilla === 'breve');
  const cuerpoFicha = Buffer.from(captura[3] || '', 'latin1').toString('utf8');
  r.fichaBreve = cuerpoFicha.includes('## OBJETIVOS Y PLAN') && /name="maxTokens"\r\n\r\n2500/.test(cuerpoFicha)
    && await page.evaluate(() => document.querySelector('#iaResultadoDet summary').textContent.includes('Ficha breve')
      && !document.querySelector('#iaResultado .alert-warning'));
  await context.close();

  // Dentro del hub (iframe): el módulo no se descarga y la tarjeta queda vacía
  const ctxHub = await browser.newContext();
  const hub = await ctxHub.newPage();
  const pedidos = [];
  hub.on('request', q => { if (/informe-ia\.js|informe-narrativo\.js|grabadora\.js|licencia-ia\.js/.test(q.url())) pedidos.push(q.url()); });
  await hub.setContent(`<iframe id="sat" src="${BASE_URL}" style="width:1000px;height:800px"></iframe>`);
  await hub.waitForTimeout(1500);
  const frame = hub.frames().find(f => f.url().startsWith(BASE_URL));
  await frame.evaluate(() => { buildResults(); goToPhase(5); });
  await hub.waitForTimeout(500);
  r.hubSinModulo = pedidos.length === 0 && await frame.evaluate(() => document.body.classList.contains('in-hub') && document.getElementById('informeIA').innerHTML === '');
  await ctxHub.close();

  r.ok = Object.entries(r).every(([, v]) => v === true);
  return r;
}

// Grabación desde la cabecera (grabadora.js), con el micrófono falso de
// Chromium. Táctil (390 px): un toque empieza, otro pausa (con el aviso de la
// pulsación larga) y otro reanuda; la pulsación larga pide descartar; sigue
// por todas las fases; la tarjeta de la fase 5 la ve en curso sin «Parar» y
// «Generar» la cierra y la usa; con un audio adjunto el menú solo ofrece
// descartarlo; «Reiniciar» avisa y descarta. Con ratón: la papelera descarta.
async function checkGrabadoraCabecera(errors) {
  const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
  // Con una grabación en marcha la página tiene beforeunload: si algo falla, el
  // navegador debe cerrarse igual o el proceso no termina nunca.
  try {
    const tactil = await recorrerGrabadora(browser, errors);
    const raton = await recorrerGrabadoraRaton(browser, errors);
    const r = { ...tactil, ...raton };
    r.ok = Object.values(r).every(v => v === true);
    return r;
  }
  catch (e) { return { ok: false, error: e.message.split('\n')[0] }; }
  finally { await browser.close().catch(() => {}); }
}

const metaAudioIDB = page => page.evaluate(() => new Promise(res => {
  const rq = indexedDB.open('physiq', 3);
  rq.onsuccess = () => { const g = rq.result.transaction('audio').objectStore('audio').get('assessment-meta'); g.onsuccess = () => res(g.result); };
}));

async function pulsacionLarga(page, sel) {
  const b = await page.locator(sel).boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(900);
  await page.mouse.up();
}

async function recorrerGrabadora(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await context.grantPermissions(['microphone']);
  await context.addInitScript(k => { try { localStorage.setItem('physiq-license-key', k); } catch {} }, CLAVE_OK);
  const captura = ['x'];
  await mockWorkerYTurnstile(context, captura);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (grabadora): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console (grabadora): ${msg.text()}`); });
  const clases = () => page.evaluate(() => document.getElementById('grabBtn').className);
  const esperaClase = (c, si = true) => page.waitForFunction(([c, si]) => document.getElementById('grabBtn').classList.contains(c) === si, [c, si]);
  const r = {};
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#grabBtn', { state: 'visible' });
  r.botonVisible = true;

  await page.click('#grabBtn');                        // fase 1: un toque empieza
  await esperaClase('recording');
  await page.waitForTimeout(1200);
  r.pildora = /\d\d:\d\d/.test(await page.textContent('#grabBtn'));
  r.sinPapeleraEnTactil = !(await page.isVisible('#grabDescBtn'));
  // A 390 px, grabando y también con el chip del modo breve (solo CSS: la clase
  // del body basta para medirlo): ni el logo pisa los botones ni se salen.
  const cabeceraCabe = () => page.evaluate(() => {
    const r = s => document.querySelector(s).getBoundingClientRect();
    const items = [...document.querySelectorAll('.header-right > *')].filter(e => e.offsetParent).map(e => e.getBoundingClientRect().right);
    return document.documentElement.scrollWidth <= innerWidth && Math.max(...items) <= innerWidth + 1
      && r('.logo').right <= r('.header-right').left + 1;
  });
  const sinBreve = await cabeceraCabe();
  await page.evaluate(() => document.body.classList.add('modo-breve'));
  const conBreve = await cabeceraCabe();
  await page.evaluate(() => document.body.classList.remove('modo-breve'));
  r.cabeceraSinDesbordar = sinBreve && conBreve;

  // Toque = pausa (con el aviso de la pulsación larga, sin menú) / reanudar
  await page.click('#grabBtn');
  await esperaClase('paused');
  r.toquePausa = await page.isHidden('#grabMenu');
  r.avisoPulsacionLarga = ((await page.textContent('#appToast').catch(() => '')) || '').includes('mantén pulsado');
  await page.click('#grabBtn');
  await esperaClase('recording');
  r.toqueReanuda = true;

  // Pulsación larga = confirmación de descartar; cancelarla deja todo igual
  await pulsacionLarga(page, '#grabBtn');
  await page.waitForSelector('#confirmBanner');
  r.largaPideDescartar = (await page.textContent('#confirmBanner')).includes('Descartar');
  await page.click('#confirmCancel');
  await page.waitForTimeout(300);
  r.cancelarNoPausa = (await clases()).includes('recording');

  await walkRegion(page, 'lumbar');                    // la consulta sigue grabando
  r.siguePorLasFases = (await clases()).includes('recording');
  await page.waitForSelector('#iaAudio .ia-grabando');
  r.tarjetaVeEnCurso = true;
  r.tarjetaSinParar = (await page.locator('#iaAudio button:has-text("Parar")').count()) === 0;
  await page.waitForSelector('#iaConsent input[type=checkbox]');
  r.consentMientrasGraba = await page.evaluate(() => document.getElementById('iaGenerar').disabled);
  await page.check('#iaConsent input[type=checkbox]');
  await page.waitForFunction(() => !document.getElementById('iaGenerar').disabled);
  const antes = captura.length;
  await page.click('#iaGenerar');                       // cierra la grabación y la usa
  await page.waitForFunction(n => document.querySelector('#iaResultado')?.textContent.includes('CONDICIÓN DE SALUD') || false, antes, { timeout: 15000 });
  r.generarCierraYUsa = captura.length === antes + 1 && /name="file"/.test(captura[captura.length - 1]);
  await page.waitForFunction(() => !document.getElementById('grabBtn').classList.contains('grab-pildora'));
  r.audioBorradoTrasInforme = (await metaAudioIDB(page)) === undefined;

  // Con un audio adjunto (cerrado): el menú solo ofrece ir al informe y descartar
  await page.setInputFiles('#iaArchivo', { name: 'consulta.webm', mimeType: 'audio/webm', buffer: Buffer.alloc(2048, 1) });
  await esperaClase('recorded');
  await page.click('#grabBtn');
  const menu = await page.textContent('#grabMenu');
  r.menuConAudio = menu.includes('Descartar') && !menu.includes('Grabar de nuevo') && !menu.includes('Parar');
  await page.click('#grabMenu button:has-text("Descartar")');
  await page.click('#confirmAction');
  await esperaClase('recorded', false);
  r.descartaAdjunto = (await metaAudioIDB(page)) === undefined;

  // Reiniciar con una grabación en curso: la confirmación avisa y la descarta
  await page.click('#grabBtn');
  await esperaClase('recording');
  await page.waitForTimeout(600);
  await page.click('.btn-reset');
  r.avisoEnReinicio = (await page.textContent('#confirmBanner')).includes('grabación en curso');
  await page.click('#confirmAction');
  await page.waitForFunction(() => !document.getElementById('grabBtn').classList.contains('grab-pildora'));
  await page.waitForTimeout(300);
  r.descartadoAlReiniciar = (await metaAudioIDB(page)) === undefined && !(await clases()).includes('recorded');
  await context.close();
  return r;
}

async function recorrerGrabadoraRaton(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.grantPermissions(['microphone']);
  await context.addInitScript(k => { try { localStorage.setItem('physiq-license-key', k); } catch {} }, CLAVE_OK);
  await mockWorkerYTurnstile(context, ['x']);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (grabadora ratón): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console (grabadora ratón): ${msg.text()}`); });
  const r = {};
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#grabBtn', { state: 'visible' });
  r.ratonSinPapeleraSinGrabar = !(await page.isVisible('#grabDescBtn'));
  await page.click('#grabBtn');
  await page.waitForFunction(() => document.getElementById('grabBtn').classList.contains('recording'));
  await page.waitForTimeout(800);
  r.ratonPapeleraVisible = await page.isVisible('#grabDescBtn');
  await page.click('#grabBtn');
  await page.waitForFunction(() => document.getElementById('grabBtn').classList.contains('paused'));
  r.ratonSinAvisoPulsacion = !((await page.textContent('#appToast').catch(() => '')) || '').includes('mantén pulsado');
  await page.click('#grabDescBtn');
  r.ratonPapeleraConfirma = (await page.textContent('#confirmBanner')).includes('Descartar');
  await page.click('#confirmAction');
  await page.waitForFunction(() => !document.getElementById('grabBtn').classList.contains('grab-pildora'));
  await page.waitForTimeout(300);
  r.ratonDescartado = (await metaAudioIDB(page)) === undefined && !(await page.isVisible('#grabDescBtn'));
  await context.close();
  return r;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  const moduleStatus = {};

  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  page.on('response', res => {
    const url = res.url();
    const match = MODULE_FILES.find(f => url.endsWith('/' + f));
    if (match) moduleStatus[match] = res.status();
  });

  // Standalone, la fase 5 monta la tarjeta del informe narrativo, que consulta
  // /validate al llegar: aquí responde siempre «demo» para que ningún recorrido
  // llame al worker real (checkInformeNarrativo usa su propio contexto).
  await page.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', route => route.fulfill({
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'X-PhysiQ-Mode': 'demo' },
    contentType: 'application/json',
    body: JSON.stringify({ ok: true, mode: 'demo', routes: { report: 'demo', email: 'demo' }, demoOnly: false }),
  }));

  console.log(`Loading ${BASE_URL} ...`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  console.log('\nModule file responses:');
  let modulesOk = true;
  for (const f of MODULE_FILES) {
    const status = moduleStatus[f];
    const ok = status === 200;
    if (!ok) modulesOk = false;
    console.log(`  ${ok ? '✓' : '✗'} ${f} -> ${status ?? 'never requested'}`);
  }

  console.log(`\nWalking through phases 1-5 for all ${REGIONS.length} regions...`);
  const results = [];
  for (const region of REGIONS) {
    // Fresh load per region instead of resetting in-page state: `patient`
    // is never filled here, so saveSession() never writes to IDB (it's
    // gated on a non-empty patient name — see CLAUDE.md), meaning a plain
    // reload always starts phase 1 clean with nothing to restore.
    if (results.length > 0) await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const r = await walkRegion(page, region);
    const t = r.treeResult;
    const ok = t.treeCompleteShown && r.finalPhase === 5;
    console.log(`  ${ok ? '✓' : '✗'} ${region.padEnd(9)} -> ${t.answeredSteps} pasos, ${t.activeHypotheses} hipótesis, árbol completo: ${t.treeCompleteShown}, fase alcanzada: ${r.finalPhase}`);
    results.push(r);
  }

  console.log(`\nModo breve (embudo, irritabilidad directa, resultados sin confirmar) for all ${REGIONS.length} regions...`);
  const breveResults = [];
  for (const region of REGIONS) {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const r = await walkRegionBreve(page, region);
    const sc = r.screening;
    console.log(`  ${r.ok ? '✓' : '✗'} ${region.padEnd(9)} -> embudo NO en ${sc.embudoNo} sistemas, urgentes visibles ${sc.urgVisibles}/${sc.urgTotal}, no urgentes visibles ${sc.noUrgVisibles}, fase ${r.fase5.phase}, transparencia: ${r.fase5.transparencia}`);
    breveResults.push(r);
  }

  console.log(`\nPaciente posquirúrgico (tarjeta «Cirugía», notas de traumatismo, protocolo en la fase 5) for all ${REGIONS.length} regions...`);
  const posqResults = [];
  for (const region of REGIONS) {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const r = await walkRegionPosq(page, region);
    console.log(`  ${r.ok ? '✓' : '✗'} ${region.padEnd(9)} -> tarjeta ${r.visible ? 'visible' : 'oculta'}, «${r.semanas}», notas de traumatismo visibles ${r.notas.visibles}/${r.notas.total}, fase ${r.fase5.phase}`);
    posqResults.push(r);
  }
  const hombroTratada = await checkHombroTratada(page);
  console.log(`  ${hombroTratada.ok ? '✓' : '✗'} hombro h_step2b → h11 «ya diagnosticada y tratada»: sin derivación en la fase 5, protocolo del cirujano`);

  // Exercise the mobile phase-sheet button (the last real bug found,
  // PHASE_NAV_IDS) once, on whichever region the loop above ended on.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click('.mobile-phase-menu-btn').catch(() => {});
  await page.waitForTimeout(150);
  const sheetOpen = await page.evaluate(() => document.getElementById('phaseSheet')?.classList.contains('open'));
  console.log(`\nPhase sheet opens from "☰ Fases": ${sheetOpen}`);

  console.log('\nRazonamiento del cribado (lumbar):');
  const razonEsc = await checkRazonamientoEscritorio(page);
  console.log(`  ${razonEsc.ok ? '✓' : '✗'} escritorio: panel lateral sin velo, SÍ con el panel abierto, cambia de pregunta, Escape cierra`);
  const razonMov = await checkRazonamientoMovil(page);
  console.log(`  ${razonMov.ok ? '✓' : '✗'} 390 px: bottom sheet con velo, atrás lo cierra en la fase 2, × sin entrada colgando`);

  console.log('\nDerivación del árbol (lumbar, VASCULAR):');
  const deriv = await checkDerivacionVascular(page);
  console.log(`  ${deriv.ok ? '✓' : '✗'} aviso bajo el paso, al completar el árbol y en la fase 5`);

  console.log('\nExportar / importar la valoración (panel de sesión):');
  const tmpDir = mkdtempSync(join(tmpdir(), 'physiq-smoke-'));
  const expImp = await checkExportarImportar(browser, errors, tmpDir);
  console.log(`  ${expImp.ok ? '✓' : '✗'} exportar descarga ${expImp.nombreArchivo}; borrar + importar restaura la valoración en la fase 5; rechaza otro JSON; caben a 320 px`);

  console.log('\nInforme narrativo con IA (worker y Turnstile simulados):');
  const informeIA = await checkInformeNarrativo(browser, errors);
  console.log(`  ${informeIA.ok ? '✓' : '✗'} licencia/clave, demo descartado, consentimiento con audio, SSE → informe guardado y copiado, nada en el hub`);

  await browser.close();

  console.log('\nGrabación desde la cabecera (micrófono falso de Chromium):');
  const grab = await checkGrabadoraCabecera(errors);
  console.log(`  ${grab.ok ? '✓' : '✗'} toque = empezar/pausa/reanudar, pulsación larga y papelera descartan, sigue por todas las fases, «Generar» la cierra y la usa; reiniciar avisa y descarta`);

  const realErrors = errors.filter(e => !KNOWN_NOISE.some(n => e.includes(n)));
  console.log(`\n${realErrors.length ? '✗' : '✓'} Console/page errors: ${realErrors.length}`);
  realErrors.forEach(e => console.log('  -', e));

  const regionsOk = results.every(r => r.treeResult.treeCompleteShown && r.finalPhase === 5);
  const breveOk = breveResults.every(r => r.ok);
  const posqOk = posqResults.every(r => r.ok) && hombroTratada.ok;
  const pass = modulesOk && regionsOk && breveOk && posqOk && sheetOpen === true && razonEsc.ok && razonMov.ok && deriv.ok && informeIA.ok && expImp.ok && grab.ok && realErrors.length === 0;
  console.log(pass ? '\n✓ SMOKE TEST PASSED' : '\n✗ SMOKE TEST FAILED');
  if (!regionsOk) {
    console.log('\nRegions that did not complete / reach phase 5:');
    results.filter(r => !(r.treeResult.treeCompleteShown && r.finalPhase === 5))
      .forEach(r => console.log('  -', JSON.stringify(r)));
  }
  if (!razonEsc.ok) console.log('\nRazonamiento escritorio:', JSON.stringify(razonEsc));
  if (!razonMov.ok) console.log('\nRazonamiento 390 px:', JSON.stringify(razonMov));
  if (!deriv.ok) console.log('\nDerivación del árbol:', JSON.stringify(deriv));
  if (!informeIA.ok) console.log('\nInforme narrativo:', JSON.stringify(informeIA));
  if (!expImp.ok) console.log('\nExportar / importar:', JSON.stringify(expImp));
  if (!grab.ok) console.log('\nGrabadora:', JSON.stringify(grab));
  if (!posqOk) {
    console.log('\nPosquirúrgico failures:');
    posqResults.filter(r => !r.ok).forEach(r => console.log('  -', JSON.stringify(r)));
    if (!hombroTratada.ok) console.log('  -', JSON.stringify(hombroTratada));
  }
  if (!breveOk) {
    console.log('\nModo breve failures:');
    breveResults.filter(r => !r.ok).forEach(r => console.log('  -', JSON.stringify(r)));
  }
  process.exit(pass ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(1); });
