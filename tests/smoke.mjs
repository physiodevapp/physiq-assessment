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
// Usage: node tests/smoke.mjs [url] [--solo a,b] [--lista] [--secciones N] [--paralelo N]
//   url            defaults to http://localhost:3000 (or SMOKE_URL)
//   --lista        prints the section ids
//   --solo a,b     runs only those sections (module loading is always checked);
//                  the result line says PARCIAL — a full run is still due before main
//   --secciones N  sections at once (default 3); --paralelo N  pages at once in
//                  the per-region walks (default 7). Use 1 for both to run fully
//                  serially if a failure looks timing-related.
// Each section prints its own time, so the slow ones are visible.

import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { AsyncLocalStorage } from 'node:async_hooks';

const salidaActual = new AsyncLocalStorage();

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

const BASE_URL = process.argv.slice(2).find(a => !a.startsWith('--') && /^https?:/.test(a)) || process.env.SMOKE_URL || 'http://localhost:3000';
// data/*.js: data.js los importa estáticamente, así que uno que falte rompe la app entera.
const MODULE_FILES = ['app.js', 'state.js', 'data.js', 'phase4.js', 'phase4b.js', 'ampliar-ia.js', 'lib/session.js', 'lib/posquirurgico.js',
  'data/comun.js', 'data/anatomia.js', 'data/hombro.js', 'data/cadera.js', 'data/cervical.js', 'data/lumbar.js', 'data/rodilla.js', 'data/codo.js', 'data/tobillo_pie.js'];
const KNOWN_NOISE = ['ERR_CERT_AUTHORITY_INVALID']; // sandboxed egress proxy noise, not app errors
// Keep in sync with the region keys in CIF_TREES/SYSTEMIC_SCREENING (data.js)
// and VALID_REGIONS in tests/unit/comun.mjs — add a new region to all three.
const REGIONS = ['hombro', 'cadera', 'cervical', 'lumbar', 'rodilla', 'codo', 'tobillo_pie'];

// Carga la app dentro de un iframe (como en el hub) y espera a que termine de
// cargar y se haya marcado como «in-hub», en vez de una pausa fija.
async function cargarEnHub(hub) {
  await hub.setContent(`<iframe id="sat" src="${BASE_URL}" style="width:1000px;height:800px"></iframe>`, { waitUntil: 'networkidle' });
  const frame = hub.frames().find(f => f.url().startsWith(BASE_URL));
  await frame.waitForFunction(() => document.body.classList.contains('in-hub'));
  return frame;
}

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
    const opt = lastStep.locator('.option-group .option-btn').first();
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
  const sinPosq = (await page.$('#tab_transversal_posquirurgico')) === null;
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
  return { region, treeResult, finalPhase, sinPosq };
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
  // Sistema posquirúrgico: primera pestaña, con las preguntas de la región
  const cribado = await page.evaluate(() => ({
    primera: document.querySelector('#sistemaTabs .sistema-tab')?.id,
    preguntas: [...document.querySelectorAll('#panel_transversal_posquirurgico .sq2')].map(el => el.id.replace('sq2_', '')),
  }));
  const esperadas = ['lumbar', 'cervical'].includes(region)
    ? ['pq_herida', 'pq_tvp', 'pq_tep']
    : ['pq_herida', ['hombro', 'codo'].includes(region) ? 'pq_tvp_ms' : 'pq_tvp', 'pq_tep',
      ...(['codo', 'rodilla', 'tobillo_pie'].includes(region) ? ['pq_compart'] : []), 'pq_sdrc', 'pq_nervio'];
  const cribadoOk = cribado.primera === 'tab_transversal_posquirurgico' && JSON.stringify(cribado.preguntas) === JSON.stringify(esperadas);
  await page.click('#btnContinuarSinss');
  await page.waitForTimeout(150);
  await page.click('#phase3 .nrs-btn >> nth=4');
  await page.fill('#signoComparable', 'Flexión');
  await page.click('#phase3 .btn-primary:has-text("Algoritmo CIF")');
  await page.waitForTimeout(150);
  const treeResult = await walkCifTreeToCompletion(page);
  await page.click('#btnGoConfirm');
  await page.waitForTimeout(150);
  // Hipótesis posquirúrgica genérica: la primera tarjeta, con la intervención
  const pq1 = await page.evaluate(r => {
    const card = document.querySelector('#hypothesisCards .hypothesis-card');
    return card?.id === 'hypcard_pq1' && card.textContent.includes(`Postoperatorio: Cirugía de ${r}`) && !card.querySelector('.test-item, .test-btn');
  }, region);
  await page.click('#phase4b button:has-text("Ver Resultados")');
  await page.waitForTimeout(150);
  const fase5 = await page.evaluate(r => {
    const t = document.getElementById('resultsContent').textContent;
    const hip = t.slice(t.indexOf('Hipótesis'));
    return { phase: state.currentPhase, recuadro: t.includes('Paciente posquirúrgico') && t.includes('Sin carga hasta la semana 8'),
      cq: state.cirugia.protocolo === 'Escrito' && state.cirugia.semanasAprox === 6,
      pq1: hip.includes(`🏥 Postoperatorio: Cirugía de ${r}`) && hip.includes('Seguir el protocolo del cirujano: Sin carga hasta la semana 8') };
  }, region);
  const ok = cribadoOk && oculta && visible && semanas.startsWith('6 semanas') && notas.visibles === notas.total
    && treeResult.treeCompleteShown && pq1 && fase5.phase === 5 && fase5.recuadro && fase5.cq && fase5.pq1;
  return { region, ok, cribado, oculta, visible, semanas, notas, treeResult, pq1, fase5 };
}

// Cadera con prótesis: el árbol da la artrosis (ca_step2 → ca1). Con
// Post-quirúrgico, «Tratada con la cirugía» la saca de la pauta y de los
// tests; `pq1` va la primera. Al pasar el mecanismo a Insidioso, `pq1` y la
// casilla desaparecen y la artrosis vuelve a puntuar.
async function checkCaderaProtesis(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.fill('#motivoConsulta', 'Rehabilitación tras prótesis de cadera');
  await page.click('#mecanismo .option-btn:has-text("Post-quirúrgico")');
  await page.fill('#cirIntervencion', 'PTC derecha');
  await page.click('#cirProtocolo .option-btn:has-text("Escrito")');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('cadera', this)"]`);
  await page.waitForTimeout(150);
  await page.click('#btnContinuarSinss');
  await page.waitForTimeout(150);
  await page.click('#phase3 .nrs-btn >> nth=4');
  await page.click('#phase3 .btn-primary:has-text("Algoritmo CIF")');
  await page.waitForTimeout(150);
  const elegir = async (stepId, idx) => { await page.click(`#opts_${stepId} .option-btn >> nth=${idx}`); await page.waitForTimeout(120); };
  await elegir('ca_step1', 2);
  await elegir('ca_step1b', 1);
  await elegir('ca_step2', 0);          // perfil degenerativo → ca1, artrosis
  await walkCifTreeToCompletion(page);
  await page.click('#btnGoConfirm');
  await page.waitForTimeout(150);
  const orden = await page.evaluate(() => [...document.querySelectorAll('#hypothesisCards .hypothesis-card')].map(c => c.id.replace('hypcard_', '')));
  await page.click('#hypcard_ca1 .hypothesis-header');
  await page.waitForTimeout(150);
  const casilla = await page.textContent('#hypcard_ca1 .dx-tratada');
  await page.click('#hypcard_ca1 .dx-tratada input');
  await page.waitForTimeout(150);
  const en4b = await page.evaluate(() => ({ marcada: !!state.derivacionResuelta.ca1, etiqueta: document.getElementById('score_ca1').textContent }));
  await page.click('#phase4b button:has-text("Ver Resultados")');
  await page.waitForTimeout(150);
  const fase5 = await page.evaluate(async () => {
    const { buildInformeFisioterapiaText } = await import('./app.js');
    const t = document.getElementById('resultsContent').textContent;
    return { pq1: t.indexOf('Postoperatorio: PTC derecha') >= 0 && t.indexOf('Postoperatorio: PTC derecha') < t.indexOf('Artrosis de Cadera'),
      intervenida: t.includes('Ya intervenida: seguir el protocolo del cirujano'),
      informe: buildInformeFisioterapiaText().includes('Artrosis de Cadera (intervenida quirúrgicamente)') };
  });
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#mecanismo .option-btn:has-text("Insidioso")');
  await page.evaluate(() => goToPhase('4b'));
  await page.waitForTimeout(150);
  const sinPosq = await page.evaluate(() => ({
    pq1: !!document.getElementById('hypcard_pq1'),
    casilla: !!document.querySelector('#hypcard_ca1 .dx-tratada'),
    etiqueta: document.getElementById('score_ca1')?.textContent || '',
  }));
  const ok = orden[0] === 'pq1' && orden.includes('ca1') && casilla.includes('Tratada con la cirugía')
    && en4b.marcada && en4b.etiqueta.includes('Diagnosticada y tratada')
    && fase5.pq1 && fase5.intervenida && fase5.informe
    && !sinPosq.pq1 && !sinPosq.casilla && !sinPosq.etiqueta.includes('Diagnosticada y tratada');
  return { ok, orden, casilla, en4b, fase5, sinPosq };
}

// Cambiar el mecanismo con el cribado ya pintado (lumbar): Post-quirúrgico
// añade el sistema y conserva lo contestado; quitarlo lo retira y su urgencia
// deja de contar aunque la respuesta siga guardada.
async function checkCambioMecanismo(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.fill('#motivoConsulta', 'Lumbalgia');
  await page.click('#mecanismo .option-btn:has-text("Insidioso")');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('lumbar', this)"]`);
  await page.waitForTimeout(150);
  const qNormal = await page.evaluate(() => document.querySelector('#sistemaPanels .sistema-panel.active .sq2')?.id.replace('sq2_', ''));
  await page.click(`#sistemaPanels .sistema-panel.active #sq2_${qNormal} .sq-btn.si`);
  const antes = (await page.$('#tab_transversal_posquirurgico')) === null;
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#mecanismo .option-btn:has-text("Post-quirúrgico")');
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  const con = await page.evaluate(q => ({
    tab: !!document.getElementById('tab_transversal_posquirurgico'),
    conservada: state.sistemicoAnswers[q] === 'SI' && !!document.querySelector(`#sq2_${q} .sq-btn.si.selected`),
  }), qNormal);
  await page.click('#tab_transversal_posquirurgico');
  await page.click('#panel_transversal_posquirurgico #sq2_pq_herida .sq-btn.si');
  const urgencia = await page.evaluate(() => document.getElementById('sistemicoAlert').textContent.includes('Derivación urgente'));
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#mecanismo .option-btn:has-text("Traumático")');
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  const sin = await page.evaluate(() => ({
    tab: !!document.getElementById('tab_transversal_posquirurgico'),
    urgencia: document.getElementById('sistemicoAlert').textContent.includes('Derivación urgente'),
    alerta: state.sistemicoAlerta,
  }));
  const ok = antes && con.tab && con.conservada && urgencia && !sin.tab && !sin.urgencia && sin.alerta === true;
  return { ok, antes, con, urgencia, sin };
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

// Lado afectado (fase 2): aparece al elegir región, «Central» solo en columna,
// se guarda en el estado y cabe a 320 px sin desbordar.
async function checkLado(page) {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const r = {};
  // Sexo (fase 1, junto a la edad): se guarda, un segundo toque lo borra, cabe a 320 px
  await page.click('#sexo .option-btn:has-text("Mujer")');
  r.sexo = await page.evaluate(() => {
    const g = document.getElementById('sexo').getBoundingClientRect();
    const cabe = [...document.querySelectorAll('#sexo .option-btn')].every(b => {
      const rb = b.getBoundingClientRect();
      return rb.width > 0 && rb.left >= g.left - 1 && rb.right <= g.right + 1;
    }) && document.documentElement.scrollWidth <= innerWidth;
    return state.sexo === 'Mujer' && cabe;
  });
  await page.click('#sexo .option-btn:has-text("Mujer")');
  r.sexo = r.sexo && await page.evaluate(() => state.sexo === '');
  r.ocultoSinRegion = await page.evaluate(() => document.getElementById('ladoWrap').hidden);
  await irAFase2(page, 'hombro');
  const estado = () => page.evaluate(() => {
    const w = document.getElementById('ladoWrap');
    const c = w.querySelector('.lado-central');
    const rw = w.getBoundingClientRect();
    return {
      visible: !w.hidden && rw.height > 0,
      central: !c.hidden && c.getBoundingClientRect().width > 0,
      cabe: [...w.querySelectorAll('.option-btn')].filter(b => !b.hidden).every(b => {
        const rb = b.getBoundingClientRect();
        return rb.left >= rw.left - 1 && rb.right <= rw.right + 1 && b.scrollWidth <= b.clientWidth;
      }) && document.documentElement.scrollWidth <= innerWidth,
      lado: state.lado,
    };
  });
  const h = await estado();
  r.visibleConRegion = h.visible;
  r.sinCentralEnHombro = !h.central;
  r.cabe320 = h.cabe;
  await page.click('#lado .option-btn:has-text("Derecho")');
  r.guarda = (await estado()).lado === 'Derecho';
  await page.click(`[onclick="selectRegion('lumbar', this)"]`);
  await page.waitForTimeout(150);
  const l = await estado();
  r.centralEnLumbar = l.central && l.cabe;
  r.ok = r.sexo && r.ocultoSinRegion && r.visibleConRegion && r.sinCentralEnHombro && r.cabe320 && r.guarda && r.centralEnLumbar;
  await page.setViewportSize({ width: 1280, height: 900 });
  return r;
}

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

// «¿Por qué?» de los tests (fase 4b, docs/razonamiento-tests.md): hombro con
// h2 (pinzamiento). Bajo los badges, la frase de «cuánto pesa»; «Ampliar →»
// abre el mismo panel de la fase 2 con el detalle del test. Escritorio: panel
// lateral sin velo, se puede marcar un test con él abierto, ir a la fase 5 lo
// cierra. 390 px: bottom sheet con velo y atrás lo cierra sin salir de la 4b.
async function irA4bHombro(page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.fill('#motivoConsulta', 'Dolor de hombro al elevar el brazo');
  await page.click('#mecanismo .option-btn >> nth=1');
  await page.click('#cronologia .option-btn >> nth=0');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('hombro', this)"]`);
  await page.waitForTimeout(150);
  await page.click('#btnContinuarSinss');
  await page.waitForTimeout(150);
  await page.click('#phase3 .nrs-btn >> nth=4');
  await page.click('#phase3 .btn-primary:has-text("Algoritmo CIF")');
  await page.waitForTimeout(150);
  const elegir = async (stepId, idx) => { await page.click(`#opts_${stepId} .option-btn >> nth=${idx}`); await page.waitForTimeout(120); };
  await elegir('h_step1', 2);
  await elegir('h_step2', 1);
  await elegir('h_step3', 4);
  await elegir('h_step4', 0);
  await walkCifTreeToCompletion(page);
  await page.click('#btnGoConfirm');
  await page.waitForTimeout(150);
  const abierta = await page.evaluate(() => document.getElementById('hypcard_h2')?.classList.contains('open'));
  if (!abierta) { await page.click('#hypcard_h2 .hypothesis-header'); await page.waitForTimeout(200); }
}
async function checkTestsAmpliar(page) {
  const r = {};
  const hawkins = '#hypcard_h2 .test-item:has(.test-name:text-is("Test de Hawkins-Kennedy"))';
  await page.setViewportSize({ width: 1280, height: 860 });
  await irA4bHombro(page);
  r.peso = await page.textContent(`${hawkins} .test-peso`);
  r.criterioCorto = (await page.textContent(`${hawkins} .test-criterion`)).length < 120;
  await page.click(`${hawkins} .razon-ampliar`);
  await page.waitForTimeout(400);
  const a = await razonEstado(page);
  r.kicker = await page.textContent('#razonPanel .razon-kicker');
  r.detalle = await page.evaluate(() => document.getElementById('razonContenido').textContent.includes('Metaanálisis de 7 estudios'));
  r.enlace = await page.evaluate(() => document.querySelector('#razonContenido .razon-enlace')?.href || '');
  await page.click('#hypcard_h2 .test-item >> nth=0 >> .test-result-btn.pos');
  r.marcaConPanel = await page.evaluate(() => state.testResults.h2?.[0] === 'pos');
  await page.click('#phase4b button:has-text("Ver Resultados")');
  await page.waitForTimeout(300);
  const b = await razonEstado(page);
  r.escritorio = a.abierto && a.visible && !a.velo && a.pregunta === 'Test de Hawkins-Kennedy' && !b.abierto && b.fase === 5;

  await page.setViewportSize({ width: 390, height: 844 });
  await irA4bHombro(page);
  await page.click(`${hawkins} .razon-ampliar`);
  await page.waitForTimeout(400);
  const c = await razonEstado(page);
  await page.goBack();
  await page.waitForTimeout(400);
  const d = await razonEstado(page);
  r.movil = c.abierto && c.velo && !c.scrollX && !d.abierto && d.fase === '4b';
  r.ok = r.peso === 'Sirve para descartar; un positivo es solo un hallazgo.' && r.criterioCorto
    && r.kicker === 'Test · por qué y evidencia' && r.detalle && r.enlace.startsWith('https://doi.org/10.1136/bjsports-2012-091066') && r.marcaConPanel && r.escritorio && r.movil;
  if (!r.ok) Object.assign(r, { a, b, c, d });
  await page.setViewportSize({ width: 1280, height: 900 });
  return r;
}

// «Anatomía» de los tests (fase 4b, hombro; docs/anatomia-kenhub.md) y de las
// preguntas de cribado de la fase 2 (dentro de su «¿Por qué?»): en la 4b, bajo la
// fuente, un enlace a Kenhub por estructura (en español si existe; si no, en
// inglés marcado «EN») que se abre en pestaña nueva; el
// panel «Ampliar» repite la lista; cabe a 320 px; en el hub no se ve.
async function checkAnatomia(page, browser) {
  const r = {};
  const hawkins = '#hypcard_h2 .test-item:has(.test-name:text-is("Test de Hawkins-Kennedy"))';
  await page.setViewportSize({ width: 1280, height: 860 });
  await irA4bHombro(page);
  r.enlaces = await page.$$eval(`${hawkins} .test-anat a`, as => as.map(a => [a.textContent, a.getAttribute('href'), a.target, a.rel]));
  r.tarjeta = JSON.stringify(r.enlaces) === JSON.stringify([
    ['Supraespinoso ↗', 'https://www.kenhub.com/es/library/anatomia-es/musculo-supraespinoso', '_blank', 'noopener noreferrer'],
    ['Bursa subacromial EN ↗', 'https://www.kenhub.com/en/library/anatomy/subacromial-bursa', '_blank', 'noopener noreferrer'],
    ['Ligamento coracoacromial EN ↗', 'https://www.kenhub.com/en/library/anatomy/coracoacromial-ligament', '_blank', 'noopener noreferrer'],
  ]);
  // Debajo de la fuente y antes de los botones de resultado
  const item = () => [...document.querySelectorAll('#hypcard_h2 .test-item')]
    .find(e => e.querySelector('.test-name').textContent === 'Test de Hawkins-Kennedy');
  await page.evaluate(`window.__hawkins = ${item}`);
  r.orden = await page.evaluate(() => {
    const a = window.__hawkins().querySelector('.test-anat');
    return a?.previousElementSibling?.classList.contains('test-source') && a.nextElementSibling?.classList.contains('test-result-btns');
  });
  // Al pulsar se abre una pestaña nueva con la URL (sin tocar la valoración).
  // Kenhub no se carga en la prueba: la ruta responde con una página vacía.
  await page.context().route('https://www.kenhub.com/**', ruta => ruta.fulfill({ contentType: 'text/html', body: '<title>Kenhub</title>' }));
  const [popup] = await Promise.all([
    page.context().waitForEvent('page'),
    page.click(`${hawkins} .test-anat a >> nth=0`),
  ]);
  await popup.waitForLoadState();
  r.pestanaUrl = popup.url();
  r.pestana = r.pestanaUrl === 'https://www.kenhub.com/es/library/anatomia-es/musculo-supraespinoso';
  await popup.close();
  await page.context().unroute('https://www.kenhub.com/**');
  r.sigueEn4b = await page.evaluate(() => state.currentPhase === '4b');
  await page.click(`${hawkins} .razon-ampliar`);
  await page.waitForSelector('#razonContenido .razon-anatomia');
  r.panel = await page.$$eval('#razonContenido .razon-anatomia a', as => as.map(a => a.textContent));
  r.panelOk = r.panel.length === 3 && r.panel[0] === 'Supraespinoso ↗' && r.panel[1] === 'Bursa subacromial EN ↗'
    && await page.evaluate(() => [...document.querySelectorAll('#razonContenido .razon-etq')].map(e => e.textContent).join('|').includes('Anatomía (Kenhub)|Fuentes'));
  await page.keyboard.press('Escape');
  // 320 px: los enlaces caben (envuelven), sin scroll lateral
  await page.setViewportSize({ width: 320, height: 700 });
  await page.waitForTimeout(200);
  r.cabe = await page.evaluate(() => {
    const a = window.__hawkins().querySelector('.test-anat').getBoundingClientRect();
    return a.right <= innerWidth && document.documentElement.scrollWidth <= innerWidth;
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  // Fase 2 (cribado de hombro): «Anatomía» dentro del «¿Por qué?» de la
  // pregunta pleurítica (h5) y en su panel «Ampliar»
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await irAFase2(page, 'hombro');
  await page.click('#tab_h_pulmonar');
  const h5 = '#panel_h_pulmonar #sq2_h5';
  await page.click(`${h5} details.razon > summary`);
  r.fase2 = await page.$$eval(`${h5} .razon-cuerpo .test-anat a`, as => as.map(a => [a.textContent, a.getAttribute('href'), a.target]));
  r.fase2Visible = await page.isVisible(`${h5} .razon-cuerpo .test-anat`);
  r.fase2Ok = r.fase2Visible && JSON.stringify(r.fase2) === JSON.stringify([
    ['Pleura ↗', 'https://www.kenhub.com/es/library/anatomia-es/pleura-es', '_blank'],
    ['Diafragma ↗', 'https://www.kenhub.com/es/library/anatomia-es/diafragma-es', '_blank'],
    ['Nervio frénico ↗', 'https://www.kenhub.com/es/library/anatomia-es/nervio-frenico', '_blank'],
  ]);
  // Una pregunta sin anatomía (h4, dolor nocturno) no lleva la línea
  await page.click('#tab_h_cancer');
  await page.click('#panel_h_cancer #sq2_h4 details.razon > summary');
  r.fase2Sin = await page.evaluate(() => !document.querySelector('#panel_h_cancer #sq2_h4 .test-anat'));
  await page.click('#tab_h_pulmonar');
  await page.click(`${h5} .razon-ampliar`);
  await page.waitForSelector('#razonContenido .razon-anatomia');
  r.fase2Panel = await page.$$eval('#razonContenido .razon-anatomia a', as => as.map(a => a.textContent));
  r.fase2PanelOk = r.fase2Panel.join('|') === 'Pleura ↗|Diafragma ↗|Nervio frénico ↗';
  await page.keyboard.press('Escape');
  // En el hub, oculto
  const hub = await browser.newPage();
  const frame = await cargarEnHub(hub);
  r.hub = await frame.evaluate(() => {
    const d = document.createElement('div'); d.className = 'test-anat'; d.textContent = 'x';
    document.body.appendChild(d);
    return getComputedStyle(d).display === 'none';
  });
  await hub.close();
  r.ok = r.tarjeta && r.orden && r.pestana && r.sigueEn4b && r.panelOk && r.cabe && r.hub && r.fase2Ok && r.fase2Sin && r.fase2PanelOk;
  return r;
}

// «¿Por qué esta pregunta?» de los pasos del árbol (fase 4,
// docs/razonamiento-arbol.md), en lumbar: se abre sin marcar ninguna opción,
// «✨ IA» lleva el contexto del paso, «Ampliar →» abre el panel compartido con
// las fuentes enlazadas y, sin velo, se puede contestar el paso con él
// abierto. 390 px: sheet con velo que atrás cierra sin salir de la fase 4.
const ARBOL_PASO = 'lu_step1';
async function irAFase4Lumbar(page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await irAFase2(page, 'lumbar');
  await page.click('#btnContinuarSinss');
  await page.waitForTimeout(150);
  await page.click('#phase3 .nrs-btn >> nth=4');
  await page.click('#phase3 .btn-primary:has-text("Algoritmo CIF")');
  await page.waitForTimeout(200);
}
async function checkArbolRazon(page) {
  const r = {};
  const paso = `#${ARBOL_PASO}`;
  await page.setViewportSize({ width: 1280, height: 860 });
  await irAFase4Lumbar(page);
  await page.evaluate(() => {
    window.__iaHrefs = [];
    window.addEventListener('click', e => {
      const a = e.target.closest?.('a[target="_blank"]');
      if (a) { window.__iaHrefs.push(a.href); e.preventDefault(); }
    });
  });
  // El <details> va entre la pregunta y las opciones
  r.orden = await page.evaluate(s => {
    const d = document.querySelector(`${s} > details.razon`);
    return !!d && d.previousElementSibling?.classList.contains('tree-question-text')
      && !!(d.compareDocumentPosition(document.querySelector(`${s} .option-group`)) & Node.DOCUMENT_POSITION_FOLLOWING);
  }, paso);
  await page.click(`${paso} details.razon > summary`);
  r.inline = await page.isVisible(`${paso} .razon-cuerpo`);
  r.sinRespuesta = await page.evaluate(s => Object.keys(state.treeAnswers).length === 0
    && !document.querySelector(`${s} .option-btn.selected`) && document.querySelectorAll('#cifTree .tree-question').length === 1, paso);
  await page.click(`${paso} .ia-parrafo-ir`);
  r.ia = await page.evaluate(() => {
    const q = decodeURIComponent(((window.__iaHrefs.at(-1) || '').split('q=')[1] || '').replace(/\+/g, ' '));
    return q.includes('paso del árbol de decisión clínica') && q.includes('(región lumbar)') && !q.includes('(razonamiento)');
  });
  await page.click(`${paso} .razon-ampliar`);
  await page.waitForTimeout(400);
  const a = await razonEstado(page);
  r.kicker = await page.textContent('#razonPanel .razon-kicker');
  r.panel = await page.evaluate(() => {
    const c = document.getElementById('razonContenido');
    return { ia: (c.dataset.iaCtx || '').includes('paso del árbol'), enlace: !!c.querySelector('.razon-enlace[href^="https://"]'),
      secciones: [...c.querySelectorAll('.razon-seccion > .razon-etq')].map(e => e.textContent) };
  });
  r.pregunta = a.pregunta === await page.evaluate(s => document.querySelector(`${s} .tree-question-text`).textContent, paso);
  await page.click(`#opts_${ARBOL_PASO} .option-btn >> nth=0`);
  await page.waitForTimeout(150);
  const b = await razonEstado(page);
  r.contestaConPanel = await page.evaluate(s => state.treeAnswers[s] !== undefined, ARBOL_PASO) && b.abierto;
  r.escritorio = a.abierto && a.visible && !a.velo && r.kicker === '¿Por qué esta pregunta?' && r.panel.ia && r.panel.enlace
    && r.panel.secciones.join('|') === 'Por qué|En detalle|Fuentes';

  await page.setViewportSize({ width: 390, height: 844 });
  await irAFase4Lumbar(page);
  await page.click(`${paso} details.razon > summary`);
  await page.click(`${paso} .razon-ampliar`);
  await page.waitForTimeout(400);
  const c = await razonEstado(page);
  await page.goBack();
  await page.waitForTimeout(400);
  const d = await razonEstado(page);
  r.movil = c.abierto && c.velo && !c.scrollX && !d.abierto && d.fase === 4;
  r.ok = r.orden && r.inline && r.sinRespuesta && r.ia && r.pregunta && r.contestaConPanel && r.escritorio && r.movil;
  if (!r.ok) Object.assign(r, { a, b, c, d });
  await page.setViewportSize({ width: 1280, height: 900 });
  return r;
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
  const sinCruz = await page.isHidden('#razonCerrar');   // sin ✕ en móvil, como los demás sheets
  await page.mouse.click(10, 10);            // toque en el velo (por encima del sheet)
  await page.waitForTimeout(500);
  const d = await razonEstado(page);
  await page.goBack();                       // sin entrada colgando: este atrás ya va a la fase 1
  await page.waitForTimeout(400);
  const fase = await page.evaluate(() => state.currentPhase);
  const ok = a.abierto && a.visible && a.velo && a.alto > a.vh * 0.7 && !a.scrollX
    && !b.abierto && b.fase === 2 && c.abierto && sinCruz && !d.abierto && d.fase === 2 && fase === 1;
  return { ok, a, b, c, d, sinCruz, faseTrasAtras: fase };
}

// «Ampliar con IA» (ampliar-ia.js): el enlace «✨ IA ↗» de un párrafo abre
// Perplexity con el párrafo, el contexto y la frase de fuentes, sin datos del
// paciente; seleccionar texto del «¿Por qué?» saca la barra flotante (fuera
// del razonamiento, no); la ▾ abre el menú con la ventaja de cada destino y
// elegir Google se recuerda; el panel «Ampliar» lleva el suyo; Escape cierra
// el menú sin cerrar el panel. En el hub no hay barra ni enlaces visibles.
// Las pestañas nuevas no se abren: un listener en window (después del de la
// app, que fija el href) guarda el href y cancela la navegación.
async function checkAmpliarIA(browser) {
  const r = {};
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => { localStorage.removeItem('physiq-assessment-ia-destino'); });
  await page.fill('#edadPaciente', '47').catch(() => {});
  await irAFase2(page, 'lumbar');
  await page.evaluate(() => {
    window.__iaHrefs = [];
    window.addEventListener('click', e => {
      const a = e.target.closest?.('a[target="_blank"]');
      if (a) { window.__iaHrefs.push(a.href); e.preventDefault(); }
    });
  });
  const ultimoPrompt = () => page.evaluate(() => {
    const h = window.__iaHrefs.at(-1) || '';
    return { host: h.split('?')[0], q: decodeURIComponent((h.split('q=')[1] || '').replace(/\+/g, ' ')) };
  });
  const sq = `#panel_${RAZON_SIS} #sq2_${RAZON_Q1}`;
  await page.click(`${sq} details.razon > summary`);
  await page.click(`${sq} .ia-parrafo-ir`);
  const a = await ultimoPrompt();
  const porque = await page.evaluate(s => {
    const p = document.querySelector(`${s} .razon-cuerpo p`).cloneNode(true);
    p.querySelectorAll('.razon-etq, .ia-parrafo').forEach(e => e.remove());
    return p.textContent.replace(/\s+/g, ' ').trim();
  }, sq);
  r.parrafo = a.host === 'https://www.perplexity.ai/search' && a.q.includes(porque.slice(0, 60))
    && a.q.includes('pregunta de cribado') && a.q.includes('(región lumbar)')
    && a.q.includes('Busca información solo en fuentes científicas o académicas') && !a.q.includes('Dolor de lumbar') && !a.q.includes('Por qué');

  // Selección dentro del «¿Por qué?» → barra flotante con ese texto
  const seleccionar = sel => page.evaluate(s => {
    const p = document.querySelector(s);
    const nodo = [...p.childNodes].find(n => n.nodeType === 3 && n.textContent.trim().length > 30);
    const rg = document.createRange();
    rg.setStart(nodo, 1); rg.setEnd(nodo, Math.min(nodo.length, 40));
    getSelection().removeAllRanges(); getSelection().addRange(rg);
    return rg.toString().replace(/\s+/g, ' ').trim();
  }, sel);
  const elegido = await seleccionar(`${sq} .razon-cuerpo p`);
  await page.waitForTimeout(400);
  const barra = await page.evaluate(() => {
    const b = document.getElementById('iaBarra');
    const rc = b.getBoundingClientRect();
    const sel = getSelection().getRangeAt(0).getBoundingClientRect();
    return { visible: !b.hidden && rc.width > 0, dentro: rc.left >= 0 && rc.right <= innerWidth, texto: b.querySelector('.ia-barra-ir').textContent,
      hueco: Math.round(rc.top - sel.bottom) };
  });
  await page.click('#iaBarra .ia-barra-ir');
  const b = await ultimoPrompt();
  r.barra = barra.visible && barra.dentro && barra.texto.includes('Perplexity') && b.q.includes(`«${elegido}»`);
  r.huecoRaton = barra.hueco === 8 || barra.hueco;

  // ▾ → menú con las tres IA y su ventaja; elegir Google se recuerda
  await seleccionar(`${sq} .razon-cuerpo p`);
  await page.waitForTimeout(400);
  await page.click('#iaBarra .ia-elegir');
  r.menu = await page.evaluate(() => {
    const m = document.getElementById('iaMenu');
    const ops = [...m.querySelectorAll('.ia-menu-op')];
    return !m.hidden && ops.length === 3 && ops[0].classList.contains('actual')
      && ops.every(o => o.querySelector('.ia-menu-desc').textContent.length > 40)
      && m.textContent.includes('nunca datos del paciente');
  });
  await page.click('#iaMenu .ia-menu-op[data-destino="google"]');
  const c = await ultimoPrompt();
  await page.waitForTimeout(100);
  r.google = c.host === 'https://www.google.com/search' && (await page.evaluate(() => window.__iaHrefs.at(-1))).includes('udm=50')
    && await page.evaluate(() => localStorage.getItem('physiq-assessment-ia-destino') === 'google' && document.getElementById('iaMenu').hidden);
  await page.click(`${sq} .ia-parrafo-ir`);
  r.recordado = (await ultimoPrompt()).host === 'https://www.google.com/search';

  // Menú cerrado sin elegir tras perder la selección (en el móvil, el toque en
  // la ▾ la quita): la barra no se queda flotando. Con el menú abierto sigue.
  await seleccionar(`${sq} .razon-cuerpo p`);
  await page.waitForTimeout(400);
  await page.click('#iaBarra .ia-elegir');
  await page.evaluate(() => getSelection().removeAllRanges());
  await page.waitForTimeout(1000);
  const conMenu = await page.evaluate(() => !document.getElementById('iaBarra').hidden && !document.getElementById('iaMenu').hidden);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
  r.barraNoQueda = conMenu && await page.evaluate(() => document.getElementById('iaBarra').hidden && document.getElementById('iaMenu').hidden);

  // Scroll con la barra y el menú abiertos: el menú se cierra; con la
  // selección bajo la cabecera fija, la barra se esconde (antes se quedaba
  // clavada arriba, encima de la barra de fases) y vuelve al volver a verla.
  await seleccionar(`${sq} .razon-cuerpo p`);
  await page.waitForTimeout(400);
  await page.click('#iaBarra .ia-elegir');
  const yIni = await page.evaluate(() => scrollY);
  await page.evaluate(s => {
    document.body.style.paddingBottom = '2000px';  // sitio para el scroll al final de la fase
    const r = document.querySelector(s).getBoundingClientRect();
    scrollBy(0, r.bottom - 40);                // el texto queda bajo la cabecera
  }, `${sq} .razon-cuerpo p`);
  await page.waitForTimeout(300);
  const tapada = await page.evaluate(() => ({
    menu: document.getElementById('iaMenu').hidden, barra: document.getElementById('iaBarra').hidden,
    seleccion: !getSelection().isCollapsed,
  }));
  await page.evaluate(y => { scrollTo(0, y); document.body.style.paddingBottom = ''; }, yIni);
  await page.waitForTimeout(300);
  const vuelve = await page.evaluate(() => {
    const b = document.getElementById('iaBarra');
    const cab = Math.max(...[...document.querySelectorAll('.app-header, .phase-nav')].map(e => e.getBoundingClientRect().bottom));
    return !b.hidden && b.getBoundingClientRect().top >= cab;
  });
  r.scroll = (tapada.menu && tapada.barra && tapada.seleccion && vuelve) || { tapada, vuelve };

  // Selección fuera del razonamiento → sin barra
  await page.evaluate(() => getSelection().removeAllRanges());
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const t = document.querySelector('#phase2 .phase-title, #phase2 h2, #phase2 .card-title');
    const rg = document.createRange(); rg.selectNodeContents(t);
    getSelection().removeAllRanges(); getSelection().addRange(rg);
  });
  await page.waitForTimeout(600);
  r.fuera = await page.evaluate(() => document.getElementById('iaBarra').hidden);

  // Panel «Ampliar»: contexto y un «✨ IA» por párrafo; Escape cierra el menú, no el panel
  await page.click(`${sq} .razon-ampliar`);
  await page.waitForTimeout(400);
  r.panel = await page.evaluate(() => {
    const c = document.getElementById('razonContenido');
    return !!c.dataset.iaCtx && c.querySelectorAll('.ia-parrafo').length >= 2;
  });
  await page.click('#razonContenido .ia-parrafo .ia-elegir');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  r.escape = await page.evaluate(() => document.getElementById('iaMenu').hidden && document.getElementById('razonPanel').classList.contains('open'));
  await context.close();

  // Táctil (390 px): la barra queda 32 px bajo la selección, libre de los
  // marcadores nativos de selección
  const ctxTactil = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const movil = await ctxTactil.newPage();
  await movil.goto(BASE_URL, { waitUntil: 'networkidle' });
  await irAFase2(movil, 'lumbar');
  const acc = `#acc_${RAZON_SIS}`;
  await movil.click(`${acc} .sistema-accordion-header`);
  await movil.waitForTimeout(200);
  await movil.click(`${acc} #sq2_${RAZON_Q1} details.razon > summary`);
  await movil.evaluate(s => {
    const p = document.querySelector(s);
    p.scrollIntoView({ block: 'center' });
    const nodo = [...p.childNodes].find(n => n.nodeType === 3 && n.textContent.trim().length > 30);
    const rg = document.createRange(); rg.setStart(nodo, 1); rg.setEnd(nodo, 30);
    getSelection().removeAllRanges(); getSelection().addRange(rg);
  }, `${acc} #sq2_${RAZON_Q1} .razon-cuerpo p`);
  await movil.waitForTimeout(400);
  const t = await movil.evaluate(() => {
    const b = document.getElementById('iaBarra').getBoundingClientRect();
    const sel = getSelection().getRangeAt(0).getBoundingClientRect();
    return { visible: !document.getElementById('iaBarra').hidden, hueco: Math.round(b.top - sel.bottom), dentro: b.left >= 0 && b.right <= innerWidth };
  });
  r.huecoTactil = t.visible && t.dentro && t.hueco === 32 || t;
  await ctxTactil.close();

  // Hub: sin barra y sin enlaces visibles
  const ctxHub = await browser.newContext();
  const hub = await ctxHub.newPage();
  const frame = await cargarEnHub(hub);
  await frame.fill('#motivoConsulta', 'Dolor lumbar (hub)');
  await frame.click('#mecanismo .option-btn >> nth=0');
  await frame.click('#cronologia .option-btn >> nth=0');
  await frame.click('#phase1 .btn-primary');
  await frame.waitForTimeout(150);
  await frame.click(`[onclick="selectRegion('lumbar', this)"]`);
  await frame.waitForTimeout(200);
  await frame.click(`${sq} details.razon > summary`);
  r.hub = await frame.evaluate(s => !document.getElementById('iaBarra')
    && getComputedStyle(document.querySelector(`${s} .ia-parrafo`)).display === 'none', sq);
  await ctxHub.close();

  r.ok = Object.entries(r).every(([, v]) => v === true);
  return r;
}

// «✨ Preguntar a la IA» (cabecera, solo standalone): pregunta libre en
// cualquier fase. El prompt lleva la pregunta, la región si ya la hay y la
// frase de fuentes, nunca el nombre, la edad ni el motivo; vacía no navega;
// Claude se recuerda; Escape cierra; en el móvil es una hoja inferior que el
// atrás cierra sin cambiar de fase; a 320 px los tres destinos caben; en el
// hub no hay botón.
// Dictado simulado: Chromium headless no trae SpeechRecognition. Cada start()
// deja la instancia en window.__dictado para emitir resultados a mano.
const DICTADO_FALSO = () => {
  window.__dictados = [];
  window.SpeechRecognition = class {
    start() { this.activo = true; window.__dictado = this; window.__dictados.push(this); }
    stop() { this.activo = false; this.onend?.(); }
    abort() { this.activo = false; this.abortado = true; this.onend?.(); }
    decir(t) { this.onresult?.({ results: [[{ transcript: t }]] }); }
  };
};

async function checkPreguntaIA(browser, errors) {
  const r = {};
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  await context.addInitScript(DICTADO_FALSO);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (pregunta IA): ${err.message}`));
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.removeItem('physiq-assessment-ia-destino');
    window.__iaHrefs = [];
    // En captura: el panel del diálogo corta la propagación del click
    window.addEventListener('click', e => {
      const a = e.target.closest?.('a[target="_blank"]');
      if (a) { e.preventDefault(); setTimeout(() => window.__iaHrefs.push(a.getAttribute('href') === '#' ? '' : a.href), 0); }
    }, true);
  });
  const ultimo = () => page.evaluate(() => {
    const h = window.__iaHrefs.at(-1) || '';
    return { n: window.__iaHrefs.filter(Boolean).length, host: h.split('?')[0], q: decodeURIComponent((h.split('q=')[1] || '').replace(/\+/g, ' ')) };
  });
  const abierto = () => page.evaluate(() => document.getElementById('preguntaOverlay').classList.contains('open'));
  await page.click('#sessionBtn');
  await page.fill('#patientName', 'Paciente Secreta');
  await page.keyboard.press('Enter');
  await page.fill('#edadPaciente', '47');

  // Fase 1, sin región: botón en la cabecera, diálogo centrado, Perplexity por defecto
  await page.click('#preguntaIABtn');
  r.dialogo = await page.evaluate(() => {
    const p = document.getElementById('preguntaPanel').getBoundingClientRect();
    const sel = document.querySelector('#preguntaDestinos .option-btn.selected');
    return document.getElementById('preguntaOverlay').classList.contains('open') && p.width <= 420 && Math.abs(p.left + p.width / 2 - innerWidth / 2) < 2
      && document.querySelectorAll('#preguntaDestinos .option-btn').length === 3 && sel?.dataset.destino === 'perplexity'
      && document.activeElement?.id === 'preguntaTexto' && document.getElementById('preguntaIr').getAttribute('aria-disabled') === 'true'
      && document.querySelector('.pregunta-aviso').textContent.includes('No escribas ni dictes datos que identifiquen al paciente');
  });
  // 🎤 junto al título: lo dictado llena el texto y activa «Preguntar»;
  // cerrar corta el dictado y un resultado tardío ya no escribe
  await page.click('#preguntaCabecera .mic-btn');
  r.dictado = await page.evaluate(() => {
    const btn = document.querySelector('#preguntaCabecera .mic-btn');
    const tit = document.getElementById('preguntaTitulo').getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    const escuchando = btn.classList.contains('listening') && window.__dictado?.activo;
    window.__dictado.decir('Diferencia entre Hawkins y Neer');
    return escuchando && Math.abs((b.top + b.height / 2) - (tit.top + tit.height / 2)) < 4
      && document.getElementById('preguntaTexto').value === 'Diferencia entre Hawkins y Neer'
      && document.getElementById('preguntaIr').getAttribute('aria-disabled') === 'false';
  });
  await page.keyboard.press('Escape');
  r.dictadoCierra = await page.evaluate(() => {
    const rec = window.__dictado;
    rec.decir('tarde');
    return rec.abortado && !document.querySelector('#preguntaCabecera .mic-btn').classList.contains('listening')
      && !document.getElementById('preguntaTexto').value.includes('tarde');
  });
  // Con la sesión grabándose, el 🎤 está desactivado
  await page.evaluate(() => document.body.classList.add('grab-activa'));
  await page.click('#preguntaIABtn');
  r.dictadoGrabando = await page.evaluate(() => {
    const btn = document.querySelector('#preguntaCabecera .mic-btn');
    const n = window.__dictados.length;
    btn.click();
    return btn.disabled && window.__dictados.length === n;
  });
  await page.keyboard.press('Escape');
  await page.evaluate(() => { document.body.classList.remove('grab-activa'); document.getElementById('preguntaTexto').value = ''; });
  await page.click('#preguntaIABtn');
  await page.click('#preguntaIr', { force: true });   // aria-disabled: Playwright no lo pulsaría
  await page.waitForTimeout(150);
  r.vaciaNoNavega = (await ultimo()).n === 0 && await abierto();
  await page.fill('#preguntaTexto', '¿Hawkins o Neer?');
  await page.click('#preguntaIr');
  await page.waitForTimeout(150);
  const a = await ultimo();
  r.fase1 = a.host === 'https://www.perplexity.ai/search'
    && a.q.startsWith('Soy fisioterapeuta. Mi pregunta: «¿Hawkins o Neer?». Busca información solo en fuentes científicas o académicas')
    && a.q.endsWith('Cita las fuentes con enlace.') && !(await abierto())
    && await page.evaluate(() => document.getElementById('preguntaTexto').value === '');

  // Fase 2 (lumbar): región como contexto; Claude se recuerda; Enter envía
  await irAFase2(page, 'lumbar');
  await page.click('#preguntaIABtn');
  await page.click('#preguntaDestinos [data-destino="claude"]');
  r.claudeAviso = await page.evaluate(() => document.getElementById('preguntaVentaja').textContent.includes('cuenta')
    && document.getElementById('preguntaIr').textContent.includes('Claude')
    && localStorage.getItem('physiq-assessment-ia-destino') === 'claude');
  await page.fill('#preguntaTexto', 'Dosis de ejercicio en lumbalgia crónica');
  await page.press('#preguntaTexto', 'Enter');
  await page.waitForTimeout(150);
  const b = await ultimo();
  r.fase2 = b.n === 2 && b.host === 'https://claude.ai/new' && b.q.includes('Contexto: valoración de lumbar. Mi pregunta: «Dosis de ejercicio en lumbalgia crónica».')
    && !b.q.includes('Secreta') && !b.q.includes('47') && !b.q.includes('razonamiento');
  await page.waitForTimeout(100);
  await page.click('#preguntaIABtn');
  r.escape = await page.evaluate(() => document.querySelector('#preguntaDestinos .option-btn.selected')?.dataset.destino === 'claude');
  await page.keyboard.press('Escape');
  r.escape = r.escape && !(await abierto());
  await context.close();

  // Móvil táctil: hoja inferior a todo el ancho; atrás la cierra en la misma fase
  const ctxMovil = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await ctxMovil.addInitScript(DICTADO_FALSO);
  const movil = await ctxMovil.newPage();
  movil.on('pageerror', err => errors.push(`pageerror (pregunta IA móvil): ${err.message}`));
  await movil.goto(BASE_URL, { waitUntil: 'networkidle' });
  await irAFase2(movil, 'hombro');
  await movil.tap('#preguntaIABtn');
  await movil.waitForTimeout(400);
  const hoja = await movil.evaluate(() => {
    const p = document.getElementById('preguntaPanel').getBoundingClientRect();
    // Sin foco en el texto: el teclado no se despliega solo
    return Math.round(p.width) === innerWidth && Math.round(p.bottom) === innerHeight
      && document.activeElement?.id === 'preguntaPanel';
  });
  await movil.goBack();
  await movil.waitForTimeout(300);
  r.movil = hoja && await movil.evaluate(() => !document.getElementById('preguntaOverlay').classList.contains('open') && state.currentPhase === 2);
  // 320 px: los tres destinos y el botón caben sin cortar
  await movil.setViewportSize({ width: 320, height: 640 });
  await movil.tap('#preguntaIABtn');
  await movil.waitForTimeout(400);
  r.caben320 = await movil.evaluate(() => {
    const panel = document.getElementById('preguntaPanel').getBoundingClientRect();
    return [...document.querySelectorAll('#preguntaDestinos .option-btn'), document.getElementById('preguntaIr'), document.querySelector('#preguntaCabecera .mic-btn')].every(b => {
      const rb = b.getBoundingClientRect();
      return rb.left >= panel.left && rb.right <= panel.right && b.scrollWidth <= b.clientWidth;
    }) && document.documentElement.scrollWidth <= innerWidth;
  });
  await ctxMovil.close();

  // Hub: sin botón
  const ctxHub = await browser.newContext();
  const hub = await ctxHub.newPage();
  const frame = await cargarEnHub(hub);
  r.hub = await frame.evaluate(() => getComputedStyle(document.getElementById('preguntaIABtn')).display === 'none');
  await ctxHub.close();

  r.ok = Object.values(r).every(v => v === true);
  return r;
}

// Barra de fase de móvil (user decision, 2026-10): es un solo <button> que abre
// la hoja de fases; el «≡» va sin caja; en modo breve el chip «Breve» va al
// principio de la barra en móvil y sigue en la cabecera en escritorio.
async function checkBarraFase(page) {
  const r = {};
  r.cerrada = await page.evaluate(() => document.getElementById('mobilePhaseBar').getAttribute('aria-expanded') === 'false');
  r.sinCaja = await page.evaluate(() => {
    const cs = getComputedStyle(document.querySelector('.mobile-phase-menu-btn'));
    return cs.borderTopWidth === '0px' && document.getElementById('mobilePhaseBar').tagName === 'BUTTON';
  });
  await page.evaluate(() => document.body.classList.add('modo-breve'));
  const visible = sel => page.evaluate(s => { const e = document.querySelector(s); return !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0; }, sel);
  r.chipEnBarra = await visible('#mobilePhaseBar .modo-badge') && !(await visible('.app-header .modo-badge'));
  await page.setViewportSize({ width: 320, height: 640 });
  r.cabe320 = await page.evaluate(() => {
    const bar = document.getElementById('mobilePhaseBar').getBoundingClientRect();
    return [...document.querySelectorAll('#mobilePhaseBar > :not(.sr-only)')].every(e => { const b = e.getBoundingClientRect(); return b.left >= bar.left - 1 && b.right <= bar.right + 1; })
      && document.documentElement.scrollWidth <= innerWidth;
  });
  await page.setViewportSize({ width: 1280, height: 860 });
  r.chipEnCabecera = await visible('.app-header .modo-badge') && !(await visible('#mobilePhaseBar'));
  await page.evaluate(() => document.body.classList.remove('modo-breve'));
  await page.setViewportSize({ width: 390, height: 844 });
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

// «⏱ Tiempos de recuperación» (cabecera, cualquier fase, también en el hub):
// diálogo centrado y ancho en escritorio con una barra por fila de
// data/tejidos.js; sin cirugía no hay línea «Hoy»; con mecanismo
// Post-quirúrgico y semanas (tarjeta «Cirugía», UI real) la hay; Escape
// cierra; en el móvil es una hoja inferior que el atrás cierra sin cambiar de
// fase, y a 320 px ni la cabecera ni el panel desbordan; en el hub, el botón
// está. Nada entra en el payload.
async function checkTiemposTejido(browser, errors) {
  const r = {};
  const { TIEMPOS_TEJIDO } = await import(new URL('../data/tejidos.js', import.meta.url));
  // barras: una por fila y por subtipo (plegados, pero en el DOM)
  const barrasDe = filas => filas.reduce((n, f) => n + (Number.isInteger(f.desde) ? 1 : 0) + (f.subtipos?.length || 0), 0);
  const nFilas = TIEMPOS_TEJIDO.grupos.reduce((n, g) => n + barrasDe(g.filas), 0);
  const nFases = TIEMPOS_TEJIDO.fases.length;
  const nLig = barrasDe(TIEMPOS_TEJIDO.grupos.find(g => g.id === 'ligamento').filas);
  const nPend = TIEMPOS_TEJIDO.grupos.reduce((n, g) => n + g.filas.filter(f => f.pendiente).length, 0)
    + (TIEMPOS_TEJIDO.fases.some(f => !f.fuentes.length) ? 1 : 0);
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (tejidos): ${err.message}`));
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const abierto = () => page.evaluate(() => document.getElementById('tejidosOverlay').classList.contains('open'));
  await page.click('#tejidosBtn');
  r.dialogo = await page.evaluate(([n, nPend]) => {
    const p = document.getElementById('tejidosPanel').getBoundingClientRect();
    return p.width > 420 && p.width <= 760 && Math.abs(p.left + p.width / 2 - innerWidth / 2) < 2
      && document.querySelectorAll('#tejidosCuerpo .tej-barra').length === n
      && !document.querySelector('#tejidosCuerpo .tej-hoy')
      && document.querySelectorAll('#tejidosCuerpo .tej-pendiente').length === nPend;
  }, [nFilas, nPend]);
  await page.keyboard.press('Escape');
  r.escape = !(await abierto());
  // Post-quirúrgico con 6 semanas aproximadas, por la UI real
  await page.click('button.option-btn:has-text("Post-quirúrgico")');
  await page.fill('#cirSemanas', '6');
  await page.click('#tejidosBtn');
  r.hoy = await page.evaluate(n => document.querySelectorAll('#tejidosCuerpo .tej-hoy').length === n
    && document.querySelector('.tej-hoy-texto')?.textContent.includes('6 semanas tras la cirugía'), nFilas);
  // Con scroll hasta abajo, el eje de tiempo sigue pegado arriba del cuerpo
  r.ejeFijo = await page.evaluate(nFases => {
    const c = document.getElementById('tejidosCuerpo');
    c.scrollTop = c.scrollHeight;
    const eje = document.querySelector('#tejidosCuerpo .tej-eje').getBoundingClientRect();
    // La tira de colores de las fases va en el eje fijo, así que sigue a la vista
    const tira = [...document.querySelectorAll('#tejidosCuerpo .tej-eje .tej-eje-fase')];
    const colores = new Set(tira.map(t => getComputedStyle(t).backgroundColor));
    return c.scrollTop > 0 && Math.abs(eje.top - c.getBoundingClientRect().top) < 2
      && tira.length === nFases && colores.size === 3 && tira.every(t => { const b = t.getBoundingClientRect(); return b.top >= eje.top && b.bottom <= eje.bottom + 1; });
  }, nFases);
  // Filtro por tejido (sin «Todos»): «Ligamento» deja solo sus barras, se recuerda
  // al reabrir, volver a tocarla desmarca, y el título de un grupo filtra y desfiltra
  const barras = () => page.evaluate(() => document.querySelectorAll('#tejidosCuerpo .tej-barra').length);
  const pastilla = g => `#tejidosCuerpo .tej-filtro-btn[data-grupo="${g}"]`;
  r.sinTodos = await page.evaluate(() => ![...document.querySelectorAll('#tejidosCuerpo .tej-filtro-btn')].some(b => b.textContent === 'Todos'));
  await page.click(pastilla('ligamento'));
  r.filtro = await barras() === nLig && await page.evaluate(s => document.querySelector(s)?.getAttribute('aria-pressed') === 'true'
    && document.activeElement === document.querySelector(s), pastilla('ligamento'));
  await page.keyboard.press('Escape');
  await page.click('#tejidosBtn');
  r.filtroRecordado = await barras() === nLig;
  await page.click(pastilla('ligamento'));
  r.segundoToqueDesmarca = await barras() === nFilas && await page.evaluate(() => !document.querySelector('#tejidosCuerpo .tej-filtro-btn.activo'));
  await page.click('#tejidosCuerpo button.tej-grupo[data-grupo="hueso"]');
  const soloHueso = await page.evaluate(() => [...document.querySelectorAll('#tejidosCuerpo .tej-bloque')].map(b => b.dataset.grupo).join());
  await page.click('#tejidosCuerpo button.tej-grupo[data-grupo="hueso"]');
  r.grupoVuelveATodos = soloHueso === 'hueso' && await barras() === nFilas;
  // Menisco, grupo propio (Fase J, 3): su pastilla deja solo sus filas, sin subtipos
  const nMen = TIEMPOS_TEJIDO.grupos.find(g => g.id === 'menisco').filas.length;
  await page.click(pastilla('menisco'));
  r.menisco = await barras() === nMen && await page.evaluate(() => [...document.querySelectorAll('#tejidosCuerpo .tej-bloque')].map(b => b.dataset.grupo).join() === 'menisco');
  await page.click(pastilla('menisco'));
  r.menisco = r.menisco && await barras() === nFilas;
  // Qué mide la barra: rayado (protección) y contorno (programa) se ven distintos del liso
  r.mide = await page.evaluate(() => {
    const est = id => getComputedStyle(document.querySelector(`#tejidosCuerpo [data-tejido="${id}"] .tej-barra`));
    const liso = est('menisco_sutura'), rayado = est('fx_quinto_jones'), contorno = est('menisco_traumatica_conservador');
    return liso.backgroundImage === 'none' && rayado.backgroundImage.includes('repeating-linear-gradient')
      && contorno.backgroundColor === 'rgba(0, 0, 0, 0)' && contorno.boxShadow.includes('inset')
      && !!document.querySelector('#tejidosCuerpo .tej-leyenda-mide');
  });
  // Subtipos (Fase J): plegados bajo su fila; al desplegarlos se ven con su barra
  const nSubG3 = TIEMPOS_TEJIDO.grupos.find(g => g.id === 'ligamento').filas.find(f => f.id === 'ligamento_g3').subtipos.length;
  r.subtipos = await page.evaluate(nSub => {
    const d = document.querySelector('#tejidosCuerpo [data-tejido="ligamento_g3"] + details.tej-subtipos');
    if (!d || d.open) return false;
    // Dentro de un <details> cerrado, Chromium conserva el tamaño (content-visibility): se mira la visibilidad
    const ocultas = [...d.querySelectorAll('.tej-subfila')].every(x => !x.checkVisibility());
    d.open = true;
    const filasSub = [...d.querySelectorAll('.tej-subfila')];
    return ocultas && filasSub.length === nSub && filasSub.every(x => x.checkVisibility() && x.querySelector('.tej-barra').getBoundingClientRect().width > 0);
  }, nSubG3);
  // Tarjeta de una barra: tocarla dice su gravedad, qué mide y su plazo junto a ella;
  // la misma barra la cierra, Escape la cierra sin cerrar el panel, desplazar también
  const info = () => page.evaluate(() => { const i = document.getElementById('tejInfo'); return i && !i.hidden ? i.textContent : ''; });
  const barraSel = '#tejidosCuerpo .tej-barra[data-barra="menisco_sutura"]';
  await page.click(barraSel);
  const tInfo = await info();
  r.infoBarra = /Gravedad/.test(tInfo) && tInfo.includes(TIEMPOS_TEJIDO.medidas.deporte.etiqueta) && /Plazo/.test(tInfo)
    && await page.evaluate(s => {
      const b = document.querySelector(s).getBoundingClientRect(), i = document.getElementById('tejInfo').getBoundingClientRect();
      return document.querySelector(s).getAttribute('aria-expanded') === 'true' && Math.abs(i.top - b.bottom) < 20;
    }, barraSel);
  await page.click(barraSel);
  r.infoBarra = r.infoBarra && !(await info());
  await page.click(barraSel);
  await page.keyboard.press('Escape');
  r.infoBarra = r.infoBarra && !(await info()) && await abierto()
    && await page.evaluate(s => document.activeElement === document.querySelector(s), barraSel);
  await page.click(barraSel);
  await page.evaluate(() => { document.getElementById('tejidosCuerpo').scrollTop -= 200; });
  await page.waitForFunction(() => document.getElementById('tejInfo').hidden);
  await page.mouse.click(10, 10);   // velo
  r.velo = !(await abierto());
  r.sinPayload = await page.evaluate(async () => !/tejid|Remodelaci/i.test(JSON.stringify((await import('./app.js')).buildPhysiQPayload())));
  await context.close();

  // Móvil táctil: hoja inferior a todo el ancho; atrás la cierra en la misma fase
  const ctxMovil = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const movil = await ctxMovil.newPage();
  movil.on('pageerror', err => errors.push(`pageerror (tejidos móvil): ${err.message}`));
  await movil.goto(BASE_URL, { waitUntil: 'networkidle' });
  await irAFase2(movil, 'rodilla');
  await movil.tap('#tejidosBtn');
  await movil.waitForTimeout(400);
  const hoja = await movil.evaluate(() => {
    const p = document.getElementById('tejidosPanel').getBoundingClientRect();
    const t = document.getElementById('tejidosTitulo');
    return Math.round(p.width) === innerWidth && Math.round(p.bottom) === innerHeight && t.scrollHeight <= t.clientHeight + 1;
  });
  await movil.goBack();
  await movil.waitForTimeout(300);
  r.movil = hoja && await movil.evaluate(() => !document.getElementById('tejidosOverlay').classList.contains('open') && state.currentPhase === 2);
  // 320 px: cabecera y panel sin desbordar, etiquetas del eje enteras
  await movil.setViewportSize({ width: 320, height: 640 });
  await movil.evaluate(() => document.body.classList.add('modo-breve'));
  r.cabecera320 = await movil.evaluate(() => {
    const items = [...document.querySelectorAll('.header-right > *')].filter(e => e.offsetParent).map(e => e.getBoundingClientRect().right);
    return Math.max(...items) <= innerWidth + 1 && document.querySelector('.logo').getBoundingClientRect().right <= document.querySelector('.header-right').getBoundingClientRect().left + 1;
  });
  await movil.evaluate(() => document.body.classList.remove('modo-breve'));
  await movil.tap('#tejidosBtn');
  await movil.waitForTimeout(400);
  r.panel320 = await movil.evaluate(() => {
    const panel = document.getElementById('tejidosPanel').getBoundingClientRect();
    return document.documentElement.scrollWidth <= innerWidth
      && [...document.querySelectorAll('#tejidosCuerpo .tej-pista, #tejidosCuerpo .tej-nombre')].every(e => { const b = e.getBoundingClientRect(); return b.left >= panel.left - 1 && b.right <= panel.right + 1; })
      && [...document.querySelectorAll('.tej-col, .tej-filtro-btn, .tej-fase-ley')].every(c => c.scrollWidth <= c.clientWidth)
      // Pastillas en una sola fila (se desliza si no caben), nunca en dos
      && new Set([...document.querySelectorAll('.tej-filtro-btn')].map(b => Math.round(b.getBoundingClientRect().top))).size === 1
      && [...document.querySelectorAll('.tej-fase-ley')].every(c => { const b = c.getBoundingClientRect(); return b.left >= panel.left && b.right <= panel.right + 1; });
  });
  // Tarjeta de una barra en táctil a 320 px: dentro de la pantalla con 16 px de margen;
  // tocar fuera (texto del panel) la cierra y el panel sigue abierto
  await movil.evaluate(() => document.querySelector('#tejidosCuerpo .tej-barra[data-barra="nervio_neurapraxia"]').scrollIntoView({ block: 'center' }));
  await movil.tap('#tejidosCuerpo .tej-barra[data-barra="nervio_neurapraxia"]');
  r.infoBarra320 = await movil.evaluate(() => {
    const i = document.getElementById('tejInfo');
    if (!i || i.hidden) return false;
    const b = i.getBoundingClientRect();
    return b.left >= 15 && b.right <= innerWidth - 15 && b.top >= 0 && b.bottom <= innerHeight && document.documentElement.scrollWidth <= innerWidth;
  });
  await movil.tap('#tejidosTitulo');
  r.infoBarra320 = r.infoBarra320 && await movil.evaluate(() => document.getElementById('tejInfo').hidden
    && document.getElementById('tejidosOverlay').classList.contains('open'));
  await ctxMovil.close();

  // Hub: el botón sí está (consulta pura, sin red)
  const ctxHub = await browser.newContext();
  const hub = await ctxHub.newPage();
  const frame = await cargarEnHub(hub);
  r.hub = await frame.evaluate(() => getComputedStyle(document.getElementById('tejidosBtn')).display !== 'none');
  await ctxHub.close();

  r.ok = Object.values(r).every(v => v === true);
  return r;
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
// Táctil: un segundo toque deselecciona (sexo, NRS) y el NRS sin marcar llega
// al payload como null («no registrado»), nunca como 0. El :hover de los botones
// de opción solo vale con ratón (@media (hover: hover)): en un teléfono real se
// queda pegado y un botón recién deseleccionado parecía seguir marcado. El tap
// emulado no reproduce ese :hover pegado, así que se comprueban las reglas CSS.
// Diálogo común (showConfirmBanner) a 320 px: los dos botones en una sola
// línea, dentro del recuadro, con todas las etiquetas de acción que usa la app;
// la papelera solo en las acciones que borran o descartan (opts.borra).
const ACCIONES_DIALOGO = [
  ['Reiniciar', true], ['Pasar a completa', false], ['Cambiar región', true], ['Importar', true],
  ['Actualizar', false], ['Borrar sesión', true], ['Limpiar', true], ['Descartar', true],
  ['<span class="btn-text-full">Sí, cancelar</span><span class="btn-text-short">Cancelar</span>', true, 'Seguir'],
];
async function checkDialogos(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 320, height: 700 } });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (diálogos): ${err.message}`));
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const r = { fallos: [] };
  for (const [etiqueta, borra, cancelLabel] of ACCIONES_DIALOGO) {
    const m = await page.evaluate(async ([etiqueta, borra, cancelLabel]) => {
      const { showConfirmBanner } = await import('./app.js');
      const cerrar = showConfirmBanner('Título', 'Texto del diálogo.', etiqueta, () => {}, { borra, cancelLabel });
      const caja = document.querySelector('.confirm-box-btns').getBoundingClientRect();
      const botones = [...document.querySelectorAll('.confirm-box-btns button')];
      const unaLinea = botones.every(b => b.getBoundingClientRect().height < 40 && b.scrollWidth <= b.clientWidth);
      const dentro = botones.every(b => { const q = b.getBoundingClientRect(); return q.left >= caja.left - 0.5 && q.right <= caja.right + 0.5; });
      const papelera = !!document.querySelector('#confirmAction svg');
      cerrar();
      return { unaLinea, dentro, papelera };
    }, [etiqueta, borra, cancelLabel]);
    if (!m.unaLinea || !m.dentro || m.papelera !== borra) r.fallos.push({ etiqueta: etiqueta.replace(/<[^>]+>/g, ' ').trim(), ...m });
  }

  // Cerrar: Escape, un toque en el velo y el botón de cerrar cancelan (llaman a
  // opts.onCancel); solo el botón de acción hace la acción. Seleccionar texto
  // del recuadro y soltar en el velo no cierra. El dismiss() devuelto cierra
  // sin onCancel y, si el diálogo ya no está, no hace nada.
  const abrir = (opts = {}) => page.evaluate(async opts => {
    const { showConfirmBanner } = await import('./app.js');
    window._dlg = { accion: 0, cancelar: 0 };
    window._dlgDismiss = showConfirmBanner('Título', 'Texto del diálogo para seleccionar.', 'Borrar',
      () => { window._dlg.accion++; }, { ...opts, onCancel: () => { window._dlg.cancelar++; } });
  }, opts);
  const estado = () => page.evaluate(() => ({ abierto: !!document.getElementById('confirmBanner'), ...window._dlg }));
  const es = (e, abierto, accion, cancelar) => e.abierto === abierto && e.accion === accion && e.cancelar === cancelar;
  const cierre = {};
  await abrir();
  await page.keyboard.press('Escape');
  cierre.escape = es(await estado(), false, 0, 1);
  await abrir();
  await page.mouse.click(5, 650);
  cierre.velo = es(await estado(), false, 0, 1);
  await abrir();
  const texto = await page.locator('.confirm-box-text').boundingBox();
  await page.mouse.move(texto.x + 5, texto.y + texto.height / 2);
  await page.mouse.down();
  await page.mouse.move(5, 650, { steps: 4 });
  await page.mouse.up();
  cierre.seleccionarYSoltarEnVelo = es(await estado(), true, 0, 0);
  await page.evaluate(() => window._dlgDismiss());
  await abrir();
  await page.click('#confirmCancel');
  cierre.botonCerrar = es(await estado(), false, 0, 1);
  await abrir({ cancelLabel: 'Seguir' });
  cierre.cancelLabel = (await page.textContent('#confirmCancel')).trim() === 'Seguir';
  await page.click('#confirmAction');
  cierre.accion = es(await estado(), false, 1, 0);
  // dismiss() con el panel de sesión abierto debajo: cierra sin onCancel; el
  // segundo no hace nada (ni desbloquea el scroll que el panel sigue usando) y
  // Escape ya no llama a onCancel
  await page.evaluate(() => toggleSessionPanel());
  await abrir();
  await page.evaluate(() => { window._dlgDismiss(); window._dlgDismiss(); });
  await page.keyboard.press('Escape');
  cierre.dismiss = es(await estado(), false, 0, 0)
    && await page.evaluate(() => document.body.style.overflow === 'hidden');
  await page.evaluate(() => closeSessionPanel());
  // Un diálogo encima de otro: Escape cancela solo el de arriba, y el dismiss()
  // del de abajo (p. ej. al acabar la generación con IA) no cierra el de arriba;
  // al cerrar el de arriba la página vuelve a hacer scroll
  cierre.apilados = await page.evaluate(async () => {
    const { showConfirmBanner } = await import('./app.js');
    const c = { a: 0, b: 0 };
    showConfirmBanner('A', 'a', 'X', () => {}, { onCancel: () => { c.a++; } });
    showConfirmBanner('B', 'b', 'X', () => {}, { onCancel: () => { c.b++; } });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    const conScroll = () => document.body.style.overflow === '';
    const escapeSoloArriba = !document.getElementById('confirmBanner') && c.a === 0 && c.b === 1 && conScroll();
    const dA = showConfirmBanner('A', 'a', 'X', () => {}, { onCancel: () => { c.a++; } });
    showConfirmBanner('B', 'b', 'X', () => {}, { onCancel: () => { c.b++; } });
    dA();
    const bSigue = document.querySelector('#confirmBanner .confirm-box-title')?.textContent === 'B';
    document.getElementById('confirmCancel').click();
    return escapeSoloArriba && bSigue && c.a === 0 && c.b === 2 && conScroll();
  });
  r.cierre = cierre;
  r.ok = r.fallos.length === 0 && Object.values(cierre).every(v => v === true);
  await context.close();
  return r;
}

// Fase 5, lo plegado de las tarjetas de hipótesis: la pauta de ro2 con rama
// pone delante «Para este caso» y pliega las otras; lo que es seguridad (la
// pauta «Derivar» y la nota de compatibilidad con el protocolo del cirujano)
// nunca queda dentro de un <details>; al imprimir se despliega todo y después
// vuelve a como estaba.
async function checkFase5Plegado(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (fase 5 plegado): ${err.message}`));
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const fase5 = (datos, id, mirar) => page.evaluate(async ([datos, id, mirar]) => {
    const { HYPOTHESES, DOSIS_DERIVAR } = await import('./data.js');
    Object.assign(state, { mecanismo: '', treeAnswers: {}, testResults: {}, derivacionResuelta: {} }, datos);
    buildResults(); goToPhase(5);
    const hyp = HYPOTHESES[id];
    const tarjeta = [...document.querySelectorAll('#resultsContent .hyp5-card')].find(c => c.querySelector('.hyp5-nombre')?.textContent.includes(hyp.name));
    if (!tarjeta) return null;
    const visibleSinPlegar = el => !!el && el.checkVisibility() && !el.closest('details');
    const rama = tarjeta.querySelector('.pauta-rama-tit');
    const otras = tarjeta.querySelector('details.pauta-otras');
    if (mirar === 'rama') return { rama: rama && visibleSinPlegar(rama) ? rama.textContent : null, otrasCerradas: !!otras && !otras.open };
    if (mirar === 'derivar') {
      const caja = [...tarjeta.querySelectorAll('.exercise-box')].find(b => b.textContent.includes(DOSIS_DERIVAR));
      return { etiqueta: tarjeta.textContent.includes('🚑 Derivación'), sinPlegar: visibleSinPlegar(caja) };
    }
    const { TEXTO_PAUTA_COMPATIBLE } = await import('./lib/posquirurgico.js');
    const nota = [...tarjeta.querySelectorAll('.nota-posq')].find(n => n.textContent.includes(TEXTO_PAUTA_COMPATIBLE));
    return { sinPlegar: visibleSinPlegar(nota) };
  }, [datos, id, mirar]);
  const r = {};
  const rodilla = { region: 'rodilla', activeHypotheses: ['ro2'] };
  const conRama = await fase5({ ...rodilla, mecanismo: 'Traumático', treeAnswers: { ro_step1: 'menisco' } }, 'ro2', 'rama');
  r.rama = conRama?.rama === 'Para este caso: Rotura traumática, sin cirugía' && conRama.otrasCerradas;
  const sinRama = await fase5(rodilla, 'ro2', 'rama');
  r.sinRama = !!sinRama && sinRama.rama === null && !sinRama.otrasCerradas;
  const derivar = await fase5({ region: 'codo', activeHypotheses: ['co7'] }, 'co7', 'derivar');
  r.derivar = !!derivar?.etiqueta && derivar.sinPlegar;
  const cirugia = { intervencion: 'Meniscectomía parcial', fecha: '', semanasAprox: 4, protocolo: 'Escrito', restricciones: 'Sin pivotar 6 semanas', complicaciones: ['Ninguna'], complicacionOtra: '' };
  const posq = await fase5({ ...rodilla, mecanismo: 'Post-quirúrgico', cirugia }, 'ro2', 'posq');
  r.notaPosq = !!posq?.sinPlegar;
  // Imprimir: todo desplegado; después, cada <details> como estaba (uno abierto a mano sigue abierto)
  r.imprimir = await page.evaluate(() => {
    const todos = [...document.querySelectorAll('#phase5 details')];
    todos[0].open = true;
    const antes = todos.map(d => d.open);
    if (antes.every(Boolean)) return 'no hay nada plegado';
    dispatchEvent(new Event('beforeprint'));
    const desplegado = todos.every(d => d.open);
    dispatchEvent(new Event('afterprint'));
    return desplegado && todos.every((d, i) => d.open === antes[i]);
  });
  await context.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

async function checkBotonesTactil(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (táctil): ${err.message}`));
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const r = {};
  r.hoverSoloConRaton = await page.evaluate(() => {
    const clases = ['.option-btn', '.nrs-btn', '.test-result-btn', '.fp-escala-btn', '.region-card'];
    const sueltas = [];
    const recorrer = (reglas, conHover) => {
      for (const regla of reglas) {
        if (regla.cssRules && regla.media) recorrer(regla.cssRules, conHover || /hover:\s*hover/.test(regla.media.mediaText));
        else if (regla.selectorText && clases.some(c => regla.selectorText.includes(`${c}:hover`)) && !conHover) sueltas.push(regla.selectorText);
      }
    };
    for (const hoja of document.styleSheets) { try { recorrer(hoja.cssRules, false); } catch { /* hoja externa */ } }
    return sueltas.length === 0 || sueltas;
  });
  const dobleToque = async (sel) => {
    const btn = page.locator(sel).first();
    await btn.scrollIntoViewIfNeeded();
    await btn.tap();
    await page.waitForTimeout(100);
    await btn.tap();
    await page.waitForTimeout(100);
  };
  await dobleToque('#sexo .option-btn');
  r.sexoVacio = await page.evaluate(() => state.sexo === '' && !document.querySelector('#sexo .selected'));
  await page.evaluate(() => goToPhase(3));
  await page.waitForTimeout(300);
  await dobleToque('.nrs-btn:nth-child(5)');
  r.nrsVacio = await page.evaluate(() => state.severidad === null && !document.querySelector('.nrs-btn.selected')
    && document.getElementById('nrsLabel').textContent.includes('Sin seleccionar'));
  await page.evaluate(() => goToPhase(1));   // salir de la fase 3 ya no lo convierte en 0
  r.nrNull = await page.evaluate(async () => (await import('./app.js')).buildPhysiQPayload().nr === null);
  // Compartir en táctil: la hoja de compartir del sistema (aquí simulada), no el portapapeles
  r.compartirTactil = await page.evaluate(async () => {
    let compartido = null;
    navigator.share = async d => { compartido = d; };
    await (await import('./app.js')).compartirTexto('texto de prueba', { titulo: 't', copiado: 'c' });
    return compartido?.text === 'texto de prueba';
  });
  // Abrir el panel de sesión no pone el foco en el nombre (en el móvil sacaba
  // el teclado sin que se fuera a escribir)
  await page.tap('#sessionBtn');
  await page.waitForSelector('#sessionPanelOverlay.open');
  await page.waitForTimeout(200);
  r.sesionSinFoco = await page.evaluate(() => document.activeElement?.id !== 'patientName');
  await page.evaluate(() => closeSessionPanel());
  // «📤 Compartir» en móvil: hoja inferior pegada abajo; el atrás la cierra sin
  // cambiar de fase; tocar el velo también la cierra (y no deja la fase atrás)
  await page.evaluate(() => { state.region = 'lumbar'; buildResults(); goToPhase(5); });
  await page.waitForTimeout(300);
  await page.tap('#btnCompartir');
  await page.waitForSelector('#compartirOverlay.open');
  await page.waitForTimeout(400);   // animación de entrada
  r.hojaAbajo = await page.evaluate(() => {
    const b = document.getElementById('compartirPanel').getBoundingClientRect();
    return Math.abs(b.bottom - innerHeight) < 2 && b.left === 0 && Math.abs(b.width - innerWidth) < 2;
  });
  await page.goBack();
  await page.waitForTimeout(300);
  r.atrasCierraHoja = await page.evaluate(() => !document.getElementById('compartirOverlay').classList.contains('open') && state.currentPhase === 5);
  await page.tap('#btnCompartir');
  await page.waitForSelector('#compartirOverlay.open');
  await page.touchscreen.tap(195, 60);
  await page.waitForTimeout(400);
  r.veloCierraHoja = await page.evaluate(() => !document.getElementById('compartirOverlay').classList.contains('open') && state.currentPhase === 5);
  await context.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

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
  // «Reiniciar valoración» está en el panel (ya no en la cabecera) y sin datos no se puede usar
  r.reiniciarEnPanel = !(await page.$('.app-header .btn-reset, .app-header [onclick^="resetApp"]'))
    && await page.isDisabled('#sessionReset');
  await page.fill('#patientName', 'Prueba Exportación');
  await page.keyboard.press('Enter');
  await walkRegion(page, 'lumbar');
  // Con datos se activa; cancelar la confirmación vuelve al panel sin borrar nada
  await page.click('#sessionBtn');
  await page.click('#sessionReset');
  // Relevo de velos sin parpadeo: el velo del diálogo no se funde desde
  // transparente (solo entra el recuadro), ni el del panel al volver
  const velo = sel => page.evaluate(s => {
    const el = document.querySelector(s);
    return { relevo: el.classList.contains('relevo'), anim: getComputedStyle(el).animationName };
  }, sel);
  const ida = await velo('#confirmBanner');
  await page.click('#confirmCancel');
  const vuelta = await velo('#sessionPanelOverlay');
  r.relevoSinParpadeo = ida.relevo && ida.anim === 'none' && vuelta.relevo && vuelta.anim === 'none';
  if (!r.relevoSinParpadeo) r.relevo = { ida, vuelta };
  await page.waitForTimeout(200);
  r.reiniciarCancelaVuelvePanel = await page.isVisible('#sessionReset')
    && await page.evaluate(() => state.region === 'lumbar');
  await page.evaluate(() => closeSessionPanel());
  const antes = await page.evaluate(() => JSON.stringify({ p: state.patient, r: state.region, t: state.treeAnswers, f: state.currentPhase, m: state.motivoConsulta, s: state.signoComparable }));

  await page.click('#sessionBtn');
  const [descarga] = await Promise.all([page.waitForEvent('download'), page.click('#sessionExport')]);
  r.nombreArchivo = descarga.suggestedFilename();
  const ruta = `${tmpDir}/${r.nombreArchivo}`;
  await descarga.saveAs(ruta);

  // Borrar sesión (el panel sigue abierto tras exportar): cierra el panel y abre
  // el diálogo común con el nombre; cancelar (Escape, velo o botón) vuelve a
  // abrir el panel sin borrar nada; confirmar vuelve a la fase 1 vacía, también
  // el campo del nombre (si no, saveSession() lo devolvería al estado)
  r.panelSigueAbierto = await page.isVisible('#sessionPanelClear');
  const panelAbierto = () => page.evaluate(() => document.getElementById('sessionPanelOverlay').classList.contains('open'));
  const pedirBorrar = async () => {
    if (!(await panelAbierto())) await page.click('#sessionBtn');   // si cancelar no lo reabrió, ya consta como fallo
    await page.click('#sessionPanelClear');
    await page.waitForSelector('#confirmBanner');
    return !(await panelAbierto()) && (await page.textContent('#confirmBanner .confirm-box-text')).includes('«Prueba Exportación»');
  };
  const cancelado = async () => {
    await page.waitForTimeout(150);
    return !(await page.isVisible('#confirmBanner')) && await panelAbierto()
      && await page.evaluate(() => state.patient === 'Prueba Exportación' && state.region === 'lumbar');
  };
  r.borrarCancelar = {};
  r.borrarCancelar.dialogo = await pedirBorrar();
  await page.keyboard.press('Escape');
  r.borrarCancelar.escape = await cancelado();
  await pedirBorrar();
  await page.mouse.click(5, 880);
  r.borrarCancelar.velo = await cancelado();
  await pedirBorrar();
  await page.click('#confirmCancel');
  r.borrarCancelar.boton = await cancelado();
  await pedirBorrar();
  await page.click('#confirmAction');
  await page.waitForTimeout(200);
  r.borrada = await page.evaluate(async () => {
    (await import('./app.js')).saveSession();
    return state.currentPhase === 1 && !state.region && state.patient === '' && document.getElementById('patientName').value === '';
  });
  // El nombre va escapado en el texto del diálogo
  r.nombreEscapado = await page.evaluate(() => {
    state.patient = '<b>X</b>';
    promptClearSession();
    const ok = document.querySelector('#confirmBanner .confirm-box-text').textContent.includes('«<b>X</b>»');
    document.getElementById('confirmCancel').click();
    state.patient = '';
    return ok;
  });

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
    return ['sessionReset', 'sessionExport', 'sessionImport'].every(id => {
      const b = document.getElementById(id);
      const rb = b.getBoundingClientRect();
      return rb.left >= panel.left && rb.right <= panel.right && b.scrollWidth <= b.clientWidth && rb.height >= 40;
    });
  });

  // Móvil a 320 px, todas las fases: el primer nivel (cards, sistemas del
  // cribado, preguntas del árbol, hipótesis de la 4b, secciones de la fase 5)
  // va de borde a borde, las cajas de lectura de segundo nivel con 12 px de
  // relleno, y nada desborda en horizontal
  await page.evaluate(() => closeSessionPanel());
  await page.waitForTimeout(200);
  r.bandasMovil = {};
  for (const f of [1, 2, 3, 4, '4b', 5]) {
    await page.evaluate(f => goToPhase(f), f);
    await page.waitForTimeout(250);
    r.bandasMovil[f] = await page.evaluate(() => {
      const fase = document.querySelector('.phase-container.active');
      const sel = '.card, .sistema-accordion-row, .tree-question, .hypothesis-card, .summary-section';
      const primer = [...fase.querySelectorAll(sel)].filter(el => el.getBoundingClientRect().width > 0 && !el.parentElement.closest(sel));
      const banda = primer.length > 0 && primer.every(el => { const b = el.getBoundingClientRect(); return Math.round(b.left) === 0 && Math.round(b.right) === innerWidth; });
      const cajas = [...fase.querySelectorAll('.sq2, .test-item, .hyp5-card')].filter(el => el.getBoundingClientRect().width > 0);
      const relleno = cajas.every(el => getComputedStyle(el).paddingLeft === '12px');
      return banda && relleno && document.documentElement.scrollWidth <= innerWidth;
    });
  }
  r.fasesMovil = Object.values(r.bandasMovil).every(Boolean);

  await context.close();
  r.ok = r.exportarDesactivadoAlEmpezar && r.reiniciarEnPanel && r.reiniciarCancelaVuelvePanel && r.relevoSinParpadeo && /^valoracion-prueba-exportacion-\d{4}-\d{2}-\d{2}\.json$/.test(r.nombreArchivo)
    && Object.values(r.borrarCancelar).every(v => v === true) && r.borrada && r.nombreEscapado && r.restaurado && r.fase5Visible && r.rechazaMalo && r.caben320 && r.fasesMovil;
  return r;
}

// Aviso «Hay una versión nueva» con la versión desplegada simulada
// (lib/version.js sellado y version.json distinto, con page.route). En móvil:
// snackbar abajo, justo encima de los botones de navegación fijos (en todas
// las fases, también con la barra de contexto de la 2), sin tapar la barra de
// fases, con zonas táctiles de 44 px y sin desbordar a 320 px; oculto
// mientras se escribe; «×» lo cierra y deja el punto en el icono de sesión.
// En escritorio, arriba como siempre.
async function checkAvisoVersion(browser, errors) {
  const r = {};
  const preparar = async (viewport) => {
    const context = await browser.newContext({ viewport });
    await context.route('**/lib/version.js', async route => {
      const res = await route.fetch();
      const txt = (await res.text()).replace("VERSION_SHA = 'dev'", "VERSION_SHA = 'aaaaaaa'");
      route.fulfill({ response: res, body: txt });
    });
    await context.route('**/version.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ sha: 'bbbbbbb', fecha: '2026-10-11T10:00:00Z' }) }));
    const page = await context.newPage();
    page.on('pageerror', err => errors.push(`pageerror (aviso versión): ${err.message}`));
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('#versionAviso', { timeout: 5000 }).catch(() => {});
    return { context, page };
  };
  const medir = page => page.evaluate(() => {
    const a = document.getElementById('versionAviso');
    if (!a || getComputedStyle(a).display === 'none') return null;
    const q = a.getBoundingClientRect();
    const nav = document.querySelector('.phase-container.active .nav-buttons').getBoundingClientRect();
    const barra = document.querySelector('.mobile-phase-bar').getBoundingClientRect();
    const btns = [...a.querySelectorAll('button')].map(b => b.getBoundingClientRect());
    return {
      encimaNav: q.bottom <= nav.top + 0.5 && nav.top - q.bottom <= 16,
      bajoBarra: q.top >= barra.bottom,
      ancho: Math.round(q.left) === 16 && Math.round(innerWidth - q.right) === 16,
      tactil: btns.every(b => b.height >= 43.5 && b.width >= 43.5),
      sinDesbordar: document.documentElement.scrollWidth <= innerWidth && a.scrollWidth <= a.clientWidth + 1,
    };
  });
  const bien = m => !!m && Object.values(m).every(Boolean);

  // Móvil 390 px: todas las fases
  let { context, page } = await preparar({ width: 390, height: 844 });
  r.movil = {};
  for (const f of [1, 2, 3, 4, '4b', 5]) {
    await page.evaluate(f => { if (f !== 1) { state.region = state.region || 'hombro'; } goToPhase(f); }, f);
    await page.waitForTimeout(600);   // tras el fadeUp de la fase (0.4 s): con transform, la barra fija se mueve
    r.movil[f] = await medir(page);
  }
  // Fase 2 con la barra de contexto del sistema visible
  await page.evaluate(() => goToPhase(2));
  await page.evaluate(() => {
    document.querySelector('.sistema-accordion-row .sistema-accordion-header')?.click();
    const t = document.querySelector('.sistema-accordion-row.open');
    if (t) scrollTo(0, t.getBoundingClientRect().top + scrollY + 300);
  });
  await page.waitForTimeout(500);
  r.movilContexto = await medir(page);
  // Escribiendo en un campo: oculto
  await page.evaluate(() => goToPhase(1));
  await page.focus('#motivoConsulta');
  r.ocultoAlEscribir = await page.evaluate(() => getComputedStyle(document.getElementById('versionAviso')).display === 'none');
  await page.evaluate(() => document.activeElement.blur());
  // «×»: se va y deja el punto en el icono de sesión
  await page.click('#versionAvisoCerrar');
  r.cerrado = await page.evaluate(() => !document.getElementById('versionAviso')
    && document.getElementById('sessionBtn').classList.contains('version-nueva')
    && getComputedStyle(document.getElementById('sessionBtn'), '::after').content !== 'none');
  await context.close();

  // 320 px: cabe
  ({ context, page } = await preparar({ width: 320, height: 640 }));
  r.estrecho = await medir(page);
  await context.close();

  // Una sola línea a 320, 360 y 390 px, tanto con «Actualizar» como mientras
  // actualiza («⟳ Actualizando…», sin botón ni «×»). El clic y la medida van en
  // el mismo evaluate: recargarVersionNueva() pinta el estado antes de su
  // primer await, y luego recarga la página.
  r.unaLinea = {};
  for (const w of [320, 360, 390]) {
    ({ context, page } = await preparar({ width: w, height: 700 }));
    r.unaLinea[w] = await page.evaluate(() => {
      const linea = () => {
        const t = document.querySelector('#versionAviso .version-aviso-texto');
        return !!t && t.getBoundingClientRect().height <= parseFloat(getComputedStyle(t).lineHeight) * 1.2 + 1;
      };
      const antes = linea();
      document.getElementById('versionAvisoRecargar').click();
      const a = document.getElementById('versionAviso');
      return { antes, durante: linea() && !a.querySelector('button') && a.getAttribute('aria-busy') === 'true' };
    });
    await context.close();
  }

  // Escritorio: arriba, centrado
  ({ context, page } = await preparar({ width: 1280, height: 800 }));
  r.escritorio = await page.evaluate(() => {
    const a = document.getElementById('versionAviso');
    if (!a) return false;
    const q = a.getBoundingClientRect();
    return q.top < 200 && Math.abs((q.left + q.right) / 2 - innerWidth / 2) < 2;
  });
  await context.close();

  r.ok = Object.values(r.movil).every(bien) && bien(r.movilContexto) && r.ocultoAlEscribir && r.cerrado && bien(r.estrecho) && Object.values(r.unaLinea).every(x => x.antes && x.durante) && r.escritorio;
  return r;
}

// Aviso inferior (showToast): en móvil, banda a todo el ancho encima de los
// botones de navegación fijos (sin taparlos), una frase en ≤2 líneas, y
// encima del aviso de versión nueva si está; en escritorio, píldora centrada
// que no se parte por tener solo medio viewport de ancho.
async function checkToast(browser, errors) {
  const r = {};
  const medir = page => page.evaluate(() => {
    const t = document.getElementById('appToast');
    if (!t) return null;
    t.style.animation = 'none';
    const q = t.getBoundingClientRect();
    const nav = document.querySelector('.phase-container.active .nav-buttons')?.getBoundingClientRect();
    const fija = getComputedStyle(document.querySelector('.phase-container.active .nav-buttons')).position === 'fixed';
    const v = document.getElementById('versionAviso')?.getBoundingClientRect();
    return {
      w: innerWidth, left: Math.round(q.left), right: Math.round(innerWidth - q.right),
      encimaNav: !fija || q.bottom <= nav.top + 0.5,
      lineas: Math.round((t.clientHeight - parseFloat(getComputedStyle(t).paddingTop) - parseFloat(getComputedStyle(t).paddingBottom)) / parseFloat(getComputedStyle(t).lineHeight)),
      altura: q.height, sobreVersion: !v || q.bottom <= v.top + 0.5,
      fuente: parseFloat(getComputedStyle(t).fontSize),
      noCapturaToques: getComputedStyle(t).pointerEvents === 'none',
      sinDesbordar: document.documentElement.scrollWidth <= innerWidth,
    };
  });
  const corto = 'En pausa · mantén pulsado para descartar la grabación';
  for (const w of [320, 390]) {
    const context = await browser.newContext({ viewport: { width: w, height: 700 }, hasTouch: true });
    const page = await context.newPage();
    page.on('pageerror', err => errors.push(`pageerror (toast ${w}): ${err.message}`));
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    r[w] = {};
    for (const f of [1, 5]) {
      await page.evaluate(f => { if (f !== 1) state.region = 'hombro'; goToPhase(f); }, f);
      await page.waitForTimeout(600);
      await page.evaluate(async m => (await import('./app.js')).showToast(m), corto);
      const m = await medir(page);
      r[w][f] = m && m.left === 16 && m.right === 16 && m.encimaNav && m.fuente >= 14 && m.noCapturaToques && m.sinDesbordar && (w < 390 || m.lineas <= 2) ? true : m;
    }
    // Con el aviso de versión nueva abajo, el toast va encima
    await page.evaluate(() => {
      goToPhase(1);
      const a = document.createElement('div');
      a.id = 'versionAviso'; a.className = 'version-aviso';
      a.innerHTML = '<span class="version-aviso-texto">Versión nueva</span><button class="version-aviso-btn">Actualizar</button>';
      document.body.appendChild(a);
    });
    await page.waitForTimeout(600);
    await page.evaluate(async () => (await import('./app.js')).showToast('✓ Copiado'));
    const m = await medir(page);
    r[w].conVersion = m && m.sobreVersion ? true : m;
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(async m => (await import('./app.js')).showToast(m, 'warning'), corto);
  const m = await medir(page);
  r.escritorio = m && m.lineas === 1 && Math.abs(m.left - m.right) <= 1 ? true : m;
  await context.close();
  r.ok = [320, 390].every(w => Object.values(r[w]).every(x => x === true)) && r.escritorio === true;
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
  // Fase 5: un solo «📤 Compartir» abajo, con menú (paciente / notas; sin
  // informe IA no hay opción IA, y fuera del hub no hay «Enviar al informe»)
  const leerPortapapeles = () => page.evaluate(() => navigator.clipboard.readText());
  r.sinBotonesCabecera = (await page.locator('#phase5 .phase-header button').count()) === 0;
  await page.click('#btnCompartir');
  await page.waitForSelector('#compartirOverlay');
  r.menuSinIA = await page.evaluate(() => {
    const ops = [...document.querySelectorAll('#compartirOverlay .compartir-op-nombre')].map(e => e.textContent);
    return ops.join('|') === 'Para el paciente / médico|Notas clínicas';
  });
  await page.click('#compartirOverlay .compartir-op:has-text("Para el paciente")');
  await page.waitForTimeout(200);
  r.informePaciente = !(await page.isVisible('#compartirOverlay')) && (await leerPortapapeles()).includes('IMPRESIÓN CLÍNICA');
  await page.click('#btnCompartir');
  await page.click('#compartirOverlay .compartir-op:has-text("Notas clínicas")');
  await page.waitForTimeout(200);
  r.notasCopiadas = (await leerPortapapeles()).startsWith('VALORACIÓN PhysiQ-Assessment');
  r.valoracionRegistrada = await page.evaluate(async () => !!(await (await import('./lib/session.js')).readSession())?.assessment?.r);

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
  // Modo del audio: con audio sale el selector, por defecto diálogo (sin dictado en el prompt)
  r.modoAudioDialogo = !cuerpo.includes('DICTADO DEL FISIOTERAPEUTA') && cuerpo.includes('TRANSCRIPCIÓN DE LA SESIÓN');
  // Datos ampliados: el recorrido del árbol CIF va en el prompt
  r.promptAmpliado = cuerpo.includes('Hallazgos de la exploración (pregunta clínica') && /name="maxTokens"\r\n\r\n7000/.test(cuerpo);
  // El informe llega plegado, con las acciones a la vista
  r.resultadoPlegado = await page.evaluate(() => {
    const det = document.getElementById('iaResultadoDet');
    return !!det && !det.open && det.querySelector('summary').textContent.includes('Narrativo');
  }) && await page.isVisible('#iaResultado button:has-text("Descartar")');
  // Revisión automática: aparece sola bajo el informe (puntos o «sin incidencias»)
  r.revision = await page.evaluate(() => !!document.querySelector('#iaRevision .ia-revision'));
  r.comprobar = await page.evaluate(() => document.querySelectorAll('#iaComprobar .ia-comprobar li').length >= 2);
  // Marcar «Revisado»: cada punto y cada comprobación; el punto se queda a la
  // vista atenuado, las cabeceras cuentan, sobrevive a un repintado y el menú
  // de «Compartir» pasa de «sin revisar» a «revisados»
  const subIA = async () => {
    await page.click('#btnCompartir');
    await page.waitForSelector('#compartirOverlay.open');
    const t = await page.locator('#compartirOverlay .compartir-op:has-text("Informe clínico") .compartir-op-sub').textContent();
    await page.keyboard.press('Escape');
    return t;
  };
  r.menuSinRevisar = /sin revisar/.test(await subIA());
  await page.evaluate(() => document.querySelector('#iaRevision details')?.setAttribute('open', ''));
  const casillas = page.locator('#iaRevision .ia-rev-check, #iaComprobar .ia-rev-check');
  const nCasillas = await casillas.count();
  for (let i = 0; i < nCasillas; i++) await casillas.nth(i).check();
  // Marcar no cierra la caja de puntos (antes el «input» de la casilla
  // repintaba la tarjeta 400 ms después y la caja volvía cerrada)
  await page.waitForTimeout(700);
  r.cajaSigueAbierta = await page.evaluate(() => { const d = document.querySelector('#iaRevision details'); return !d || d.open; });
  r.revisadosMarcados = nCasillas >= 2 && await page.evaluate(n => {
    const det = document.querySelector('#iaRevision details.ia-revision');
    return state.informeIA.revisados.length === n
      && document.querySelectorAll('#iaRevision li.ia-rev-hecho, #iaComprobar li.ia-rev-hecho').length === n
      && (!det || (det.querySelector('summary').textContent.startsWith('✓') && det.classList.contains('ia-revision-hecha')))
      && document.querySelector('#iaComprobar .ia-comprobar').classList.contains('ia-comprobar-hecha');
  }, nCasillas);
  await page.evaluate(() => buildResults());
  await page.waitForSelector('#iaComprobar .ia-rev-check');
  r.revisadosTrasRepintar = (await page.locator('#iaRevision .ia-rev-check:checked, #iaComprobar .ia-rev-check:checked').count()) === nCasillas;
  r.menuRevisado = /revisado/.test(await subIA()) && !/sin revisar/.test(await subIA());
  await page.evaluate(() => document.querySelector('#iaRevision details')?.setAttribute('open', ''));
  await casillas.first().uncheck();
  r.menuDeNuevoPendiente = /1 de \d+ puntos sin revisar/.test(await subIA());
  // «⬇ Paquete de revisión»: al final, justo tras la fila de acciones clínicas y
  // fuera de ella, con el texto completo
  r.paquetePosicion = await page.evaluate(() => {
    const p = document.querySelector('#iaResultado .ia-rev-paquete');
    return !!p && p.previousElementSibling?.classList.contains('ia-acciones') && !p.nextElementSibling
      && p.textContent.includes('Paquete de revisión');
  });
  // «⬇ Paquete de revisión»: un .zip con informe, transcripción, puntos, valoración y prompt
  const [zipDescarga] = await Promise.all([page.waitForEvent('download'), page.click('#iaResultado .ia-rev-paquete button')]);
  const zipBytes = await new Promise((res, rej) => zipDescarga.createReadStream().then(st => {
    const trozos = []; st.on('data', c => trozos.push(c)); st.on('end', () => res(Buffer.concat(trozos))); st.on('error', rej);
  }, rej));
  const zipTexto = zipBytes.toString('latin1');
  r.paqueteRevision = /^revision-informe-.+\.zip$/.test(zipDescarga.suggestedFilename()) && zipTexto.startsWith('PK\x03\x04')
    && ['info.txt', '-audio-informe.txt', '-audio-transcripcion.txt', 'revision.txt', 'prompt.txt'].every(n => zipTexto.includes(n))
    && /valoracion-[a-z0-9-]+\.json/.test(zipTexto) && zipTexto.includes('DATOS DE VALORACI');
  r.guardado = await page.evaluate(() => !!state.informeIA?.texto && state.informeIA.conAudio === true
    && state.informeIA.transcripcion.includes('simulada'));
  r.audioBorrado = await page.evaluate(() => new Promise(res => {
    const rq = indexedDB.open('physiq', 3);
    rq.onsuccess = () => { const g = rq.result.transaction('audio').objectStore('audio').get('assessment-meta'); g.onsuccess = () => res(g.result === undefined); };
  }));
  // Compartir está solo en «📤 Compartir» de abajo: la tarjeta IA deja «Descartar»
  r.tarjetaSoloDescartar = await page.evaluate(() =>
    [...document.querySelectorAll('#iaResultado .ia-acciones button')].map(b => b.textContent.trim()).join('|') === 'Descartar');
  // Con informe IA el menú ofrece los tres documentos; Escape lo cierra
  await page.click('#btnCompartir');
  await page.waitForSelector('#compartirOverlay');
  r.menuInforme = (await page.locator('#compartirOverlay .compartir-op').count()) === 3;
  await page.keyboard.press('Escape');
  r.menuEscCierra = !(await page.isVisible('#compartirOverlay'));
  // En pantalla ancha es un diálogo centrado (≤ 420 px), no una hoja
  const vista = page.viewportSize();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.click('#btnCompartir');
  await page.waitForSelector('#compartirOverlay.open');
  await page.waitForTimeout(300);   // animación de entrada
  r.dialogoCentrado = await page.evaluate(() => {
    const b = document.getElementById('compartirPanel').getBoundingClientRect();
    return Math.abs((b.left + b.right) / 2 - innerWidth / 2) < 2 && Math.abs((b.top + b.bottom) / 2 - innerHeight / 2) < 2 && b.width <= 420;
  });
  await page.keyboard.press('Escape');
  await page.setViewportSize(vista);
  await page.click('#btnCompartir');
  await page.click('#compartirOverlay .compartir-op:has-text("Para el paciente")');
  await page.waitForTimeout(200);
  const paciente = await leerPortapapeles();
  r.menuPaciente = paciente.includes('IMPRESIÓN CLÍNICA') && !paciente.includes('CONDICIÓN DE SALUD') && !(await page.isVisible('#compartirOverlay'));
  await page.click('#btnCompartir');
  await page.click('#compartirOverlay .compartir-op:has-text("Informe clínico")');
  await page.waitForTimeout(200);
  const copiado = await leerPortapapeles();
  r.menuIA = copiado.startsWith('INFORME DE FISIOTERAPIA') && copiado.includes('CONDICIÓN DE SALUD') && !copiado.includes('##');
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
  // Mientras se genera, la línea de progreso dice qué tipo de informe es
  // (el selector no está a la vista y el título de la tarjeta es común)
  await page.evaluate(() => {
    window._progresos = [];
    new MutationObserver(() => {
      const t = document.getElementById('iaProgresoTexto')?.textContent;
      if (t) window._progresos.push(t);
    }).observe(document.getElementById('informeIA'), { subtree: true, childList: true, characterData: true });
  });
  await page.click('#iaGenerar');
  await page.waitForFunction(() => state.informeIA?.plantilla === 'breve');
  r.progresoConTipo = await page.evaluate(() => window._progresos.length > 0 && window._progresos.every(t => t.startsWith('Ficha breve · '))
    && document.querySelector('#informeIA .ia-titulo').textContent.trim() === '🎙 Informe con IA'
    // El texto de la tarjeta no nombra un tipo
    && !/narrativo/i.test(document.querySelector('#informeIA .ia-intro').textContent));
  const cuerpoFicha = Buffer.from(captura[3] || '', 'latin1').toString('utf8');
  r.fichaBreve = cuerpoFicha.includes('## OBJETIVOS Y PLAN') && /name="maxTokens"\r\n\r\n2500/.test(cuerpoFicha)
    && await page.evaluate(() => document.querySelector('#iaResultadoDet summary').textContent.includes('Ficha breve')
      && !document.querySelector('#iaResultado .alert-warning'));
  await context.close();

  // Dentro del hub (iframe): el módulo no se descarga y la tarjeta queda vacía
  const ctxHub = await browser.newContext();
  const hub = await ctxHub.newPage();
  const pedidos = [];
  hub.on('request', q => { if (/informe-ia\.js|informe-narrativo\.js|revision-informe\.js|grabadora\.js|licencia-ia\.js/.test(q.url())) pedidos.push(q.url()); });
  const frame = await cargarEnHub(hub);
  await frame.evaluate(() => { buildResults(); goToPhase(5); });
  await hub.waitForTimeout(500);
  r.hubSinModulo = pedidos.length === 0 && await frame.evaluate(() => document.body.classList.contains('in-hub') && document.getElementById('informeIA').innerHTML === '');
  // En el hub, el menú de «📤 Compartir» añade «Enviar al informe» (sin opción IA)
  await frame.click('#btnCompartir');
  await frame.waitForSelector('#compartirOverlay');
  r.hubMenu = await frame.evaluate(() => [...document.querySelectorAll('#compartirOverlay .compartir-op-nombre')]
    .map(e => e.textContent).join('|') === 'Para el paciente / médico|Notas clínicas|Enviar al informe');
  await ctxHub.close();

  r.ok = Object.entries(r).every(([, v]) => v === true);
  return r;
}

// Texto del toast sin esperar: page.textContent() espera a que exista el
// elemento hasta el timeout por defecto (30 s) si nunca se ha mostrado.
const textoToast = page => page.evaluate(() => document.getElementById('appToast')?.textContent || '');

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
  r.avisoPulsacionLarga = (await textoToast(page)).includes('mantén pulsado');
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
  // Dictado del fisio: consejos a la vista, cabecera y pista de Whisper propias
  r.selectorModoAudio = await page.evaluate(() => document.querySelector('#iaModoAudio .option-btn.selected')?.textContent.includes('diálogo'));
  // A 320 px, «Tipo de informe» y «Qué hay en el audio»: dos botones del mismo
  // ancho en una sola fila, sin texto cortado
  const vp = page.viewportSize();
  await page.setViewportSize({ width: 320, height: vp.height });
  await page.waitForTimeout(200);
  r.selectoresEstrechos = await page.evaluate(() => ['iaPlantilla', 'iaModoAudio'].every(id => {
    const bs = [...document.querySelectorAll(`#${id} .ia-plantilla-opciones .option-btn`)];
    if (bs.length !== 2) return false;
    const [a, b] = bs.map(x => x.getBoundingClientRect());
    return Math.abs(a.top - b.top) < 1 && Math.abs(a.width - b.width) < 1 && b.right <= innerWidth
      && bs.every(x => x.scrollWidth <= x.clientWidth && x.scrollHeight <= x.clientHeight + 1);
  }));
  await page.setViewportSize(vp);
  await page.waitForTimeout(200);
  await page.click('#iaModoAudio .option-btn:has-text("Dictado")');
  r.consejosDictado = await page.evaluate(() => document.querySelectorAll('#iaModoAudio .ia-consejos-dictado li').length === 3);
  const antes = captura.length;
  await page.click('#iaGenerar');                       // cierra la grabación y la usa
  await page.waitForFunction(n => document.querySelector('#iaResultado')?.textContent.includes('CONDICIÓN DE SALUD') || false, antes, { timeout: 15000 });
  r.generarCierraYUsa = captura.length === antes + 1 && /name="file"/.test(captura[captura.length - 1]);
  const cuerpoDictado = Buffer.from(captura[captura.length - 1] || '', 'latin1').toString('utf8');
  r.promptDictado = cuerpoDictado.includes('DICTADO DEL FISIOTERAPEUTA') && cuerpoDictado.includes('Dictado de un fisioterapeuta')
    && await page.evaluate(() => state.informeIA?.dictado === true && document.querySelector('#iaResultadoDet summary').textContent.includes('con dictado'));
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
  // «Reiniciar valoración» está en el panel de sesión, no en la cabecera
  await page.click('#sessionBtn');
  await page.click('#sessionReset');
  r.avisoEnReinicio = (await page.textContent('#confirmBanner')).includes('grabación en curso');
  await page.click('#confirmAction');
  await page.waitForFunction(() => !document.getElementById('grabBtn').classList.contains('grab-pildora'));
  await page.waitForTimeout(300);
  r.descartadoAlReiniciar = (await metaAudioIDB(page)) === undefined && !(await clases()).includes('recorded');
  await context.close();
  return r;
}

// Aviso de silencio (grabadora.js mide el nivel con un AnalyserNode): con un
// micrófono mudo (un WAV de silencio como dispositivo falso) la píldora pasa a
// ⚠ y sale el aviso; con el tono del micrófono falso normal, nunca. Las dos
// grabaciones van en paralelo para no sumar dos esperas de ~9 s.
async function checkGrabadoraSilencio(errors) {
  const dir = mkdtempSync(join(tmpdir(), 'physiq-silencio-'));
  const wav = join(dir, 'silencio.wav');
  const datos = 16000 * 2 * 20;   // 20 s, 16 kHz, mono, 16 bits, todo ceros
  const cab = Buffer.alloc(44);
  cab.write('RIFF', 0); cab.writeUInt32LE(36 + datos, 4); cab.write('WAVE', 8); cab.write('fmt ', 12);
  cab.writeUInt32LE(16, 16); cab.writeUInt16LE(1, 20); cab.writeUInt16LE(1, 22); cab.writeUInt32LE(16000, 24);
  cab.writeUInt32LE(32000, 28); cab.writeUInt16LE(2, 32); cab.writeUInt16LE(16, 34); cab.write('data', 36); cab.writeUInt32LE(datos, 40);
  writeFileSync(wav, Buffer.concat([cab, Buffer.alloc(datos)]));
  const grabar9s = async extra => {
    const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', ...extra] });
    try {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      await context.grantPermissions(['microphone']);
      await context.addInitScript(k => { try { localStorage.setItem('physiq-license-key', k); } catch {} }, CLAVE_OK);
      await mockWorkerYTurnstile(context, ['x']);
      const page = await context.newPage();
      page.on('pageerror', err => errors.push(`pageerror (silencio): ${err.message}`));
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForSelector('#grabBtn', { state: 'visible' });
      await page.click('#grabBtn');
      await page.waitForFunction(() => document.getElementById('grabBtn').classList.contains('recording'));
      await page.waitForTimeout(9500);
      const r = await page.evaluate(() => {
        const b = document.getElementById('grabBtn');
        return { aviso: b.classList.contains('grab-aviso'), title: b.title, toast: document.getElementById('appToast')?.textContent || '' };
      });
      await page.click('#grabDescBtn');
      await page.click('#confirmAction');
      return r;
    } finally { await browser.close().catch(() => {}); }
  };
  try {
    const [mudo, tono] = await Promise.all([grabar9s(['--use-file-for-fake-audio-capture=' + wav]), grabar9s([])]);
    const r = {
      mudoAvisa: mudo.aviso && /No se oye nada/.test(mudo.title) && /No se oye nada/.test(mudo.toast),
      tonoNoAvisa: !tono.aviso && !/No se oye nada/.test(tono.title),
    };
    r.ok = Object.values(r).every(v => v === true);
    return r;
  } catch (e) { return { ok: false, error: e.message.split('\n')[0] }; }
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
  r.ratonSinAvisoPulsacion = !(await textoToast(page)).includes('mantén pulsado');
  await page.click('#grabDescBtn');
  r.ratonPapeleraConfirma = (await page.textContent('#confirmBanner')).includes('Descartar');
  await page.click('#confirmAction');
  await page.waitForFunction(() => !document.getElementById('grabBtn').classList.contains('grab-pildora'));
  await page.waitForTimeout(300);
  r.ratonDescartado = (await metaAudioIDB(page)) === undefined && !(await page.isVisible('#grabDescBtn'));
  await context.close();
  return r;
}

// Opciones de línea de órdenes (véase la cabecera del archivo):
//   [url]               por defecto http://localhost:3000 (o SMOKE_URL)
//   --solo a,b          ejecuta solo esas secciones (o SMOKE_SOLO=a,b)
//   --lista             lista las secciones y sale
//   --paralelo N        páginas a la vez en los recorridos por región (o SMOKE_PARALELO; 1 = en serie)
//   --secciones N       secciones a la vez (o SMOKE_SECCIONES; 1 = en serie, útil si algo falla por tiempos)
function leerOpciones(argv) {
  const o = { url: null, solo: process.env.SMOKE_SOLO || '', lista: false, paralelo: Number(process.env.SMOKE_PARALELO) || REGIONS.length,
    secciones: Number(process.env.SMOKE_SECCIONES) || 3 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const [clave, valorIgual] = a.split(/=(.*)/s);
    const valor = () => valorIgual ?? argv[++i] ?? '';
    if (clave === '--solo') o.solo = valor();
    else if (clave === '--paralelo') o.paralelo = Math.max(1, Number(valor()) || 1);
    else if (clave === '--secciones') o.secciones = Math.max(1, Number(valor()) || 1);
    else if (a === '--lista') o.lista = true;
    else if (!a.startsWith('--')) o.url = a;
    else { console.error(`Opción desconocida: ${a}`); process.exit(2); }
  }
  o.solo = o.solo.split(',').map(x => x.trim()).filter(Boolean);
  return o;
}

// Ejecuta fn sobre cada elemento con como mucho n a la vez; devuelve los
// resultados en el mismo orden que los elementos.
async function enParalelo(items, n, fn) {
  const out = new Array(items.length);
  let siguiente = 0;
  const trabajador = async () => {
    while (siguiente < items.length) { const i = siguiente++; out[i] = await fn(items[i], i); }
  };
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, trabajador));
  return out;
}

// Una página nueva (contexto propio, así que su IDB no se cruza con otras)
// con los mismos escuchas de errores y el mismo /validate simulado.
// Bandas de contexto del formulario previo (fases 1 y 2) y del sistema abierto
// (fase 2): se ven solo con la cabecera bajo la banda y el bloque aún en
// pantalla, nunca dos a la vez; «↑ volver» lleva a la cabecera; caben a 320 px.
async function checkBandaFormulario(page) {
  const bandas = () => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => {
    const ver = id => document.getElementById(id).classList.contains('visible');
    r({ fp: ver('fpContextBanner'), sis: ver('sisContextBanner'),
      nombre: document.getElementById('fpBannerName').textContent,
      cont: document.getElementById('fpBannerCont').textContent });
  }))));
  const irA = y => page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
  // y de la página donde la cabecera del formulario ya ha pasado bajo la banda
  // y el formulario sigue ocupando la pantalla (o justo pasado su final)
  const posiciones = sel => page.evaluate(sel => {
    const det = document.querySelector(sel);
    const r = det.getBoundingClientRect();
    return { dentro: r.top + scrollY + 300, fuera: r.bottom + scrollY + 50 };
  }, sel);
  const res = {};
  for (const [ancho, alto] of [[390, 844], [1280, 860]]) {
    const k = `w${ancho}`;
    await page.setViewportSize({ width: ancho, height: alto });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.click('#fpDet_comun > summary');
    await page.waitForSelector('#fpBody_comun .fp-text, #fpBody_comun button');
    const pos = await posiciones('#fpDet_comun');
    const antes = await bandas();
    await irA(pos.dentro);
    const dentro = await bandas();
    const contSummary = await page.textContent('#fpCont_comun');
    // Responder sin hacer scroll: el contador de la banda se actualiza igual
    // (el.click() no desplaza la página, a diferencia de page.click)
    await page.evaluate(() => [...document.querySelectorAll('#fpBody_comun button')]
      .find(b => { const r = b.getBoundingClientRect(); return r.top > 200 && r.bottom < innerHeight; })?.click());
    const respondido = await bandas();
    const contRespondido = await page.textContent('#fpCont_comun');
    await irA(pos.fuera);
    const fuera = await bandas();
    await irA(pos.dentro);
    await page.click('#fpContextBanner .context-banner-back');
    await page.waitForFunction(() => {
      const s = document.querySelector('#fpDet_comun > summary').getBoundingClientRect();
      const t = parseFloat(getComputedStyle(document.getElementById('fpContextBanner')).top);
      return s.top >= t - 1 && s.top < t + 40;
    }, null, { timeout: 3000 }).then(() => true, () => false).then(v => { res[`${k}_volver`] = v; });
    const trasVolver = await bandas();
    await irA(pos.dentro);
    await page.evaluate(() => { document.getElementById('fpDet_comun').open = false; });
    const cerrado = await bandas();
    // Fase 2: formulario regional abierto + un sistema abierto debajo (el acordeón
    // de sistemas, y con él su banda, solo existe en ≤768 px)
    await irA(0);
    await irAFase2(page, 'lumbar');
    await page.click('#fpDet_region > summary');
    await page.waitForSelector('#fpBody_region .fp-text, #fpBody_region button');
    // Cada fila contestada de una matriz cuenta como una respuesta (lumbar «¿Qué le empeora?»)
    const matriz = await page.evaluate(async () => {
      const cont = () => document.getElementById('fpCont_region').textContent;
      const fila = i => document.querySelector(`[onclick^="fpMatriz('lumbar','empeora',${i},"]`);
      const antes = cont();
      fila(0)?.click(); fila(1)?.click();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      return { antes, despues: cont(), banda: document.getElementById('fpBannerCont').textContent };
    });
    await page.evaluate(() => [...document.querySelectorAll('#sistemicoQuestions .sistema-accordion-header')]
      .find(h => h.offsetParent)?.click());
    await page.waitForTimeout(100);
    const altoPag = await page.evaluate(() => document.documentElement.scrollHeight);
    let dos = false, vioFp = false, vioSis = false, nombreRegion = '';
    for (let y = 0; y < altoPag; y += 60) {
      await irA(y);
      const b = await bandas();
      if (b.fp && b.sis) dos = true;
      if (b.fp) { vioFp = true; nombreRegion = b.nombre; }
      if (b.sis) vioSis = true;
    }
    // La banda del sistema se va al dejar atrás el sistema abierto
    const filaPasada = await page.evaluate(() => {
      const r = document.querySelector('.sistema-accordion-row.open');
      return r ? r.getBoundingClientRect().bottom + scrollY + 50 : null;
    });
    let trasSistema = { sis: false };
    if (filaPasada !== null) {
      // Espacio extra al final: si no, el scroll se queda corto cuando el sistema es de los últimos
      await page.evaluate(() => { document.body.style.paddingBottom = '2000px'; });
      await irA(filaPasada); trasSistema = await bandas();
      await page.evaluate(() => { document.body.style.paddingBottom = ''; });
    }
    // Al cambiar de fase la banda no se queda
    await irA((await posiciones('#fpDet_region')).dentro);
    const enF2 = await bandas();
    await page.evaluate(() => goToPhase(1));
    const trasFase = await bandas();
    res[k] = { antes, dentro, contSummary, respondido, contRespondido, matriz, fuera, trasVolver, cerrado, trasSistema, dos, vioFp, vioSis, nombreRegion, enF2, trasFase };
    res[`${k}_ok`] = !antes.fp && dentro.fp && /General/.test(dentro.nombre) && dentro.cont === contSummary
      && respondido.fp && contRespondido !== contSummary && respondido.cont === contRespondido
      && !fuera.fp && res[`${k}_volver`] && !trasVolver.fp && !cerrado.fp
      && matriz.antes === 'Sin rellenar' && matriz.despues === '2 respuestas'
      && !trasSistema.sis && !dos && vioFp && (vioSis || ancho > 768) && /Lumbar/.test(nombreRegion) && enF2.fp && !trasFase.fp && !trasFase.sis;
  }
  // 320 px: la banda cabe en una línea, sin desbordar
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.click('#fpDet_comun > summary');
  await page.waitForSelector('#fpBody_comun .fp-text, #fpBody_comun button');
  await irA((await posiciones('#fpDet_comun')).dentro);
  const b320 = await bandas();
  res.cabe320 = b320.fp && await page.evaluate(() => {
    const b = document.getElementById('fpContextBanner');
    const btn = b.querySelector('.context-banner-back').getBoundingClientRect();
    return b.scrollWidth <= b.clientWidth && btn.right <= innerWidth && b.offsetHeight < 60;
  });
  res.ok = res.w390_ok && res.w1280_ok && res.cabe320;
  return res;
}

// Fase 6 «Plan de tratamiento» (opcional; docs/plan-tratamiento.md): lumbar
// por la interfaz real hasta la 5 y de ahí a la 6 con «Plan de tratamiento →».
// Escritorio: paso 6 en la barra, hipótesis por defecto, gravedad e
// irritabilidad marcadas y editables (con irritabilidad alta no hay C), menú
// de compartir con los tres documentos (el de casa sin fuentes), vuelta a la
// 5 con los resultados, y la sesión restaurada en la 6 tras recargar. Una
// urgencia de la fase 2 bloquea el plan; otra región muestra el aviso de
// piloto. 320 px: sin desbordar, tarjetas a todo el ancho, barra y hoja de
// fases con la 6.
async function checkFase6(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (fase 6): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error' && !KNOWN_NOISE.some(n => msg.text().includes(n))) errors.push(`console (fase 6): ${msg.text()}`); });
  await page.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', route => route.fulfill({
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'X-PhysiQ-Mode': 'demo' },
    contentType: 'application/json', body: JSON.stringify({ ok: true, mode: 'demo', routes: { report: 'demo' }, demoOnly: false }),
  }));
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const r = {};
  await walkRegion(page, 'lumbar');
  r.botonEnFase5 = await page.isVisible('#btnIrPlan');
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.fase6 = await page.evaluate(() => state.currentPhase === 6
    && document.getElementById('nav6').classList.contains('active')
    && document.getElementById('phaseIndicator').textContent.includes('FASE 6')
    && document.querySelectorAll('#planContenido .card').length === 5);
  r.hipotesisPorDefecto = await page.evaluate(() => document.querySelectorAll('.plan-hip .option-btn.selected').length === 1 && state.planTratamiento.hipotesis.length === 1);
  r.gravedadMarcada = await page.evaluate(() => {
    const sel = [...document.querySelectorAll('#planContenido .option-btn.selected')].map(b => b.textContent.trim());
    return sel.includes('Moderada');   // NRS 6 → moderada
  });
  const botonNivel = k => page.locator('.plan-niveles .option-btn', { hasText: new RegExp(`^${k} ·`) });
  await page.click('.option-btn[onclick="planElegir(\'irritabilidad\',\'alta\')"]');
  r.altaSinC = await botonNivel('C').isDisabled() && (await page.textContent('.plan-escalon-tit')).includes('Muy suave');
  await page.click('.option-btn[onclick="planElegir(\'irritabilidad\',\'baja\')"]');
  await botonNivel('C').click();
  r.bajaConC = await page.evaluate(() => state.planTratamiento.nivel === 'C');
  // Compartir: los tres documentos del plan
  const leer = () => page.evaluate(() => navigator.clipboard.readText());
  await page.click('#btnCompartirPlan');
  await page.waitForSelector('#compartirOverlay.open');
  r.tresOpciones = (await page.locator('#compartirOpciones .compartir-op').allTextContents()).map(t => t.trim().split('\n')[0].trim()).join('|') === 'Plan de sesión|Plan del mes|Programa para casa';
  await page.click('#compartirOpciones .compartir-op >> nth=0');
  await page.waitForFunction(() => !document.getElementById('compartirOverlay').classList.contains('open'));
  r.sesionCopiada = (await leer()).startsWith('PLAN DE SESIÓN');
  await page.fill('#planNotasCasa', 'Caminar 10 minutos al día');
  await page.click('#btnCompartirPlan');
  await page.click('#compartirOpciones .compartir-op >> nth=2');
  const casa = await leer();
  r.casaLlana = casa.startsWith('PROGRAMA PARA CASA') && casa.includes('Caminar 10 minutos') && !/Maitland|Petersen|grado|Nivel/.test(casa);
  // Atrás a la 5 con sus resultados; la 6 sigue en la barra
  await page.click('#phase6 .nav-buttons .btn-secondary');
  r.vueltaA5 = await page.evaluate(() => state.currentPhase === 5 && document.querySelectorAll('#resultsContent .summary-section').length > 0
    && document.getElementById('nav6').classList.contains('completed'));
  // Sesión restaurada en la 6 tras recargar (solo se guarda con nombre)
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  // saveSession() toma el nombre del campo #patientName
  await page.evaluate(() => { document.getElementById('patientName').value = 'Prueba Plan'; saveSession(); });
  await page.waitForTimeout(400);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => state.currentPhase === 6 && document.querySelectorAll('#planContenido .card').length === 5, null, { timeout: 8000 }).catch(() => {});
  r.restaurada = await page.evaluate(() => state.currentPhase === 6 && state.planTratamiento?.nivel === 'C'
    && document.querySelectorAll('#planContenido .card').length === 5 && document.querySelectorAll('#resultsContent .summary-section').length > 0);
  // Urgencia de la fase 2: sin plan
  r.bloqueo = await page.evaluate(() => { state.sistemicoAnswers.l6 = 'SI'; goToPhase(5); goToPhase(6); return true; })
    && await page.waitForFunction(() => document.querySelector('#planContenido .alert-danger') && !document.querySelector('#planContenido .card'), null, { timeout: 4000 }).then(() => true).catch(() => false);
  // Otra región: aviso de piloto
  r.piloto = await page.evaluate(() => { state.sistemicoAnswers = {}; state.region = 'hombro'; goToPhase(5); goToPhase(6); return true; })
    && await page.waitForFunction(() => document.querySelector('#planContenido .alert-info')?.textContent.includes('piloto'), null, { timeout: 4000 }).then(() => true).catch(() => false);
  await page.evaluate(() => { state.region = 'lumbar'; goToPhase(5); goToPhase(6); });
  await page.waitForSelector('#planContenido .card');
  // 320 px: sin desbordar, tarjetas a todo el ancho, barra y hoja de fases
  await page.setViewportSize({ width: 320, height: 700 });
  await page.waitForTimeout(250);
  r.movil320 = await page.evaluate(() => {
    const ancho = document.documentElement.clientWidth;
    const sinDesbordar = document.documentElement.scrollWidth <= ancho;
    const cards = [...document.querySelectorAll('#planContenido .card')];
    const bandas = cards.every(c => { const b = c.getBoundingClientRect(); return Math.round(b.left) <= 0 && Math.round(b.right) >= ancho; });
    return sinDesbordar && bandas && document.getElementById('mobilePhaseLabel').textContent.includes('Fase 6');
  });
  await page.click('#mobilePhaseBar');
  r.hojaFases = await page.evaluate(() => document.querySelectorAll('#phaseSheetList .phase-sheet-item').length === 7);
  await context.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

async function nuevaPagina(browser, errors, moduleStatus) {
  const page = await browser.newPage();
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  if (moduleStatus) page.on('response', res => {
    const match = MODULE_FILES.find(f => res.url().endsWith('/' + f));
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
  return page;
}

// Recorre las 7 regiones con `walk`, varias a la vez (una página por
// trabajador, recargada para cada región: `patient` nunca se rellena, así que
// saveSession() no escribe en IDB y cada carga empieza limpia en la fase 1).
async function porRegiones(ctx, walk) {
  const paginas = [];
  const res = await enParalelo(REGIONS, ctx.paralelo, async (region) => {
    let page = paginas.pop() || await nuevaPagina(ctx.browser, ctx.errors);
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      return await walk(page, region);
    } finally { paginas.push(page); }
  });
  await Promise.all(paginas.map(p => p.context().close()));
  return res;
}

// Cada sección devuelve true si pasa; imprime su propio detalle.
// `id` es lo que se pasa a --solo.
const SECCIONES = [
  { id: 'regiones', titulo: `Walking through phases 1-5 for all ${REGIONS.length} regions...`, run: async (ctx) => {
    const results = await porRegiones(ctx, walkRegion);
    results.forEach((r, i) => {
      const t = r.treeResult;
      const ok = t.treeCompleteShown && r.finalPhase === 5 && r.sinPosq;
      console.log(`  ${ok ? '✓' : '✗'} ${REGIONS[i].padEnd(9)} -> ${t.answeredSteps} pasos, ${t.activeHypotheses} hipótesis, árbol completo: ${t.treeCompleteShown}, fase alcanzada: ${r.finalPhase}`);
    });
    const ok = results.every(r => r.treeResult.treeCompleteShown && r.finalPhase === 5 && r.sinPosq);
    if (!ok) {
      console.log('\nRegions that did not complete / reach phase 5:');
      results.filter(r => !(r.treeResult.treeCompleteShown && r.finalPhase === 5 && r.sinPosq)).forEach(r => console.log('  -', JSON.stringify(r)));
    }
    return ok;
  } },

  { id: 'breve', titulo: `Modo breve (embudo, irritabilidad directa, resultados sin confirmar) for all ${REGIONS.length} regions...`, run: async (ctx) => {
    const res = await porRegiones(ctx, walkRegionBreve);
    res.forEach((r, i) => {
      const sc = r.screening;
      console.log(`  ${r.ok ? '✓' : '✗'} ${REGIONS[i].padEnd(9)} -> embudo NO en ${sc.embudoNo} sistemas, urgentes visibles ${sc.urgVisibles}/${sc.urgTotal}, no urgentes visibles ${sc.noUrgVisibles}, fase ${r.fase5.phase}, transparencia: ${r.fase5.transparencia}`);
    });
    const ok = res.every(r => r.ok);
    if (!ok) { console.log('\nModo breve failures:'); res.filter(r => !r.ok).forEach(r => console.log('  -', JSON.stringify(r))); }
    return ok;
  } },

  { id: 'posquirurgico', titulo: `Paciente posquirúrgico (tarjeta «Cirugía», notas de traumatismo, protocolo en la fase 5) for all ${REGIONS.length} regions...`, run: async (ctx) => {
    const res = await porRegiones(ctx, walkRegionPosq);
    res.forEach((r, i) => {
      console.log(`  ${r.ok ? '✓' : '✗'} ${REGIONS[i].padEnd(9)} -> tarjeta ${r.visible ? 'visible' : 'oculta'}, «${r.semanas}», cribado posquirúrgico ${r.cribado.preguntas.join(' ')}, notas de traumatismo visibles ${r.notas.visibles}/${r.notas.total}, fase ${r.fase5.phase}`);
    });
    // Los tres casos sueltos, cada uno en su página y a la vez.
    const [hombroTratada, caderaProtesis, cambioMec] = await Promise.all([checkHombroTratada, checkCaderaProtesis, checkCambioMecanismo].map(async check => {
      const page = await nuevaPagina(ctx.browser, ctx.errors);
      try { return await check(page); } finally { await page.context().close(); }
    }));
    console.log(`  ${cambioMec.ok ? '✓' : '✗'} cambiar el mecanismo con el cribado pintado añade o quita el sistema, conserva las respuestas y su urgencia deja de contar`);
    console.log(`  ${hombroTratada.ok ? '✓' : '✗'} hombro h_step2b → h11 «ya diagnosticada y tratada»: sin derivación en la fase 5, protocolo del cirujano`);
    console.log(`  ${caderaProtesis.ok ? '✓' : '✗'} cadera con prótesis: pq1 la primera, ca1 «tratada con la cirugía»; con Insidioso, sin pq1 ni casilla`);
    const ok = res.every(r => r.ok) && hombroTratada.ok && caderaProtesis.ok && cambioMec.ok;
    if (!ok) {
      console.log('\nPosquirúrgico failures:');
      res.filter(r => !r.ok).forEach(r => console.log('  -', JSON.stringify(r)));
      [hombroTratada, caderaProtesis, cambioMec].filter(r => !r.ok).forEach(r => console.log('  -', JSON.stringify(r)));
    }
    return ok;
  } },

  // The mobile phase-sheet button (the last real bug found, PHASE_NAV_IDS).
  // Toda la barra de fase es el botón (se pulsa por la izquierda, sobre el título).
  { id: 'barra-fase', titulo: 'Barra de fase en móvil:', run: async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.click('#mobilePhaseBar', { position: { x: 60, y: 20 } }).catch(() => {});
    await page.waitForTimeout(150);
    const sheetOpen = await page.evaluate(() => document.getElementById('phaseSheet')?.classList.contains('open')
      && document.getElementById('mobilePhaseBar').getAttribute('aria-expanded') === 'true');
    console.log(`  ${sheetOpen ? '✓' : '✗'} Phase sheet opens from the phase bar: ${sheetOpen}`);
    await page.evaluate(() => closePhaseSheet());
    const barraFase = await checkBarraFase(page);
    console.log(`  ${barraFase.ok ? '✓' : '✗'} barra de fase en móvil: botón entero sin caja en «≡», aria-expanded vuelve a false al cerrar; chip «Breve» en la barra (no en la cabecera) en móvil y en la cabecera en escritorio; cabe a 320 px${barraFase.ok ? '' : ' ' + JSON.stringify(barraFase)}`);
    return sheetOpen === true && barraFase.ok;
  } },

  { id: 'banda-formulario', titulo: 'Bandas de contexto del formulario previo y del cribado:', run: async ({ page }) => {
    const r = await checkBandaFormulario(page);
    console.log(`  ${r.ok ? '✓' : '✗'} formulario previo (fases 1 y 2, 390 y 1280 px): la banda aparece con la cabecera fuera, con nombre y contador (que se actualiza al responder sin hacer scroll, y cuenta cada fila de una matriz), se va al pasar el formulario, al cerrarlo y al cambiar de fase; «↑ volver» lleva a la cabecera; formulario regional y sistema abierto nunca a la vez, y la del sistema se va al dejarlo atrás; cabe a 320 px${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'cribado', titulo: 'Razonamiento del cribado (lumbar):', run: async ({ page }) => {
    const razonEsc = await checkRazonamientoEscritorio(page);
    console.log(`  ${razonEsc.ok ? '✓' : '✗'} escritorio: panel lateral sin velo, SÍ con el panel abierto, cambia de pregunta, Escape cierra`);
    const razonMov = await checkRazonamientoMovil(page);
    console.log(`  ${razonMov.ok ? '✓' : '✗'} 390 px: bottom sheet con velo, atrás lo cierra en la fase 2, sin ✕ (cierra el velo), sin entrada colgando`);
    if (!razonEsc.ok) console.log('\nRazonamiento escritorio:', JSON.stringify(razonEsc));
    if (!razonMov.ok) console.log('\nRazonamiento 390 px:', JSON.stringify(razonMov));
    return razonEsc.ok && razonMov.ok;
  } },

  { id: 'ia', titulo: '«✨ Ampliar con IA» y «✨ Preguntar a la IA»:', run: async ({ browser, errors }) => {
    const ampliarIA = await checkAmpliarIA(browser);
    console.log(`  ${ampliarIA.ok ? '✓' : '✗'} «✨ IA ↗» por párrafo y barra al seleccionar abren Perplexity con contexto y la frase de fuentes, sin datos del paciente; la barra 8 px bajo la selección con ratón y 32 px en táctil (libres los marcadores); el menú ▾ explica cada IA y recuerda Google; cerrado sin elegir y sin selección, la barra desaparece; al hacer scroll el menú se cierra y la barra no se pinta sobre la cabecera (se esconde y vuelve); fuera del razonamiento no hay barra; en el hub, nada${ampliarIA.ok ? '' : ' ' + JSON.stringify(ampliarIA)}`);
    const preguntaIA = await checkPreguntaIA(browser, errors);
    console.log(`  ${preguntaIA.ok ? '✓' : '✗'} «✨ Preguntar a la IA» (cabecera): diálogo con aviso, vacía no navega, prompt con la región y la frase de fuentes sin datos del paciente, 🎤 junto al título que llena el texto, se corta al cerrar y se desactiva grabando, Claude se recuerda, Escape cierra; hoja inferior en móvil sin teclado al abrir que atrás cierra; cabe a 320 px; en el hub, nada${preguntaIA.ok ? '' : ' ' + JSON.stringify(preguntaIA)}`);
    return ampliarIA.ok && preguntaIA.ok;
  } },

  { id: 'tejidos', titulo: '«⏱ Tiempos de recuperación»:', run: async ({ browser, errors }) => {
    const tejidos = await checkTiemposTejido(browser, errors);
    console.log(`  ${tejidos.ok ? '✓' : '✗'} «⏱ Tiempos de recuperación» (cabecera): diálogo ancho con una barra por fila y el eje fijo al hacer scroll (con la tira de colores de las fases), filtro por tejido en una fila sin «Todos» (se recuerda; un segundo toque o el título del grupo vuelven a todos; «Menisco», grupo propio), qué mide cada barra por su relleno, subtipos plegados que se despliegan, sin «Hoy» sin cirugía y con «Hoy» a las 6 semanas posquirúrgicas, Escape y velo cierran, fuera del payload; hoja inferior en móvil que atrás cierra; cabecera y panel caben a 320 px; también en el hub${tejidos.ok ? '' : ' ' + JSON.stringify(tejidos)}`);
    return tejidos.ok;
  } },

  { id: 'tests-4b', titulo: '«¿Por qué?» de los tests (fase 4b, hombro):', run: async ({ page }) => {
    const r = await checkTestsAmpliar(page);
    console.log(`  ${r.ok ? '✓' : '✗'} «cuánto pesa» bajo los badges, criterio corto, «Ampliar» abre el panel del test (lateral sin velo; sheet con velo a 390 px que atrás cierra sin salir de la 4b), ir a la fase 5 lo cierra`);
    if (!r.ok) console.log('\nTests 4b «Ampliar»:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'anatomia', titulo: '«Anatomía» en Kenhub (hombro: tests de la 4b y cribado de la fase 2):', run: async ({ page, browser }) => {
    const r = await checkAnatomia(page, browser);
    console.log(`  ${r.ok ? '✓' : '✗'} un enlace a Kenhub por estructura bajo la fuente (español o «EN»), en pestaña nueva sin salir de la 4b; el panel «Ampliar» los repite; cabe a 320 px; en la fase 2, dentro del «¿Por qué?» de la pregunta y en su «Ampliar»; oculto en el hub`);
    if (!r.ok) console.log('\nAnatomía:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'arbol', titulo: '«¿Por qué esta pregunta?» del árbol (fase 4, lumbar):', run: async ({ page }) => {
    const r = await checkArbolRazon(page);
    console.log(`  ${r.ok ? '✓' : '✗'} entre la pregunta y las opciones, se abre sin contestar el paso, «✨ IA» con el contexto del paso, «Ampliar» abre el panel (Por qué, En detalle, Fuentes enlazadas; lateral sin velo, se contesta con él abierto; sheet con velo a 390 px que atrás cierra sin salir de la fase 4)${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'lado', titulo: 'Sexo (fase 1) y lado afectado (fase 2):', run: async ({ page }) => {
    const r = await checkLado(page);
    console.log(`  ${r.ok ? '✓' : '✗'} sexo se guarda y se borra con un segundo toque; lado aparece al elegir región, «Central» solo en columna; todo cabe a 320 px`);
    if (!r.ok) console.log('\nLado afectado:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'derivacion', titulo: 'Derivación del árbol (lumbar, VASCULAR):', run: async ({ page }) => {
    const r = await checkDerivacionVascular(page);
    console.log(`  ${r.ok ? '✓' : '✗'} aviso bajo el paso, al completar el árbol y en la fase 5`);
    if (!r.ok) console.log('\nDerivación del árbol:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'tactil', titulo: 'Botones en táctil (segundo toque y :hover):', run: async ({ browser, errors }) => {
    const r = await checkBotonesTactil(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} sexo y NRS se deseleccionan; :hover de botones solo con ratón; NRS sin marcar → nr null; compartir usa la hoja del sistema; «Compartir» es una hoja inferior que se cierra con atrás o tocando el velo${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'dialogos', titulo: 'Diálogos de confirmación (320 px):', run: async ({ browser, errors }) => {
    const r = await checkDialogos(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} los botones caben en una línea con todas las etiquetas; papelera solo al borrar o descartar; Escape, el velo y «Cancelar» cancelan sin hacer la acción (seleccionar y soltar en el velo no cierra); dismiss() cierra sin onCancel y es idempotente${r.ok ? '' : ' ' + JSON.stringify({ fallos: r.fallos, cierre: r.cierre })}`);
    return r.ok;
  } },

  { id: 'fase5', titulo: 'Fase 5: pauta por situación y lo que nunca se pliega:', run: async ({ browser, errors }) => {
    const r = await checkFase5Plegado(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} ro2 traumática: «Para este caso» delante y las otras ramas plegadas; sin rama, la pauta entera; «🚑 Derivación» (co7) y la nota del protocolo del cirujano fuera de todo <details>; imprimir despliega y después deja cada <details> como estaba${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'fase6', titulo: 'Fase 6: plan de tratamiento (opcional, lumbar):', run: async ({ browser, errors }) => {
    const r = await checkFase6(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} de la 5 a la 6 con «Plan de tratamiento →»; paso 6 en la barra; hipótesis por defecto; gravedad e irritabilidad editables (con irritabilidad alta no hay C); compartir sesión, mes y casa (sin fuentes); vuelta a la 5; restaurada en la 6 tras recargar; urgencia → sin plan; otra región → piloto; 320 px sin desbordar y hoja de fases con la 6${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'exportar', titulo: 'Exportar / importar la valoración (panel de sesión):', run: async ({ browser, errors }) => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'physiq-smoke-'));
    const r = await checkExportarImportar(browser, errors, tmpDir);
    console.log(`  ${r.ok ? '✓' : '✗'} exportar descarga ${r.nombreArchivo}; panel → diálogo y vuelta sin parpadeo de velo; «Borrar» abre el diálogo común con el nombre escapado, cancelar (Escape, velo, botón) vuelve al panel, confirmar vacía también el campo del nombre; borrar + importar restaura la valoración en la fase 5; rechaza otro JSON; caben a 320 px; todas las fases a 320 px en bandas, sin desbordar${r.fasesMovil ? '' : ' ' + JSON.stringify(r.bandasMovil)}`);
    if (!r.ok) console.log('\nExportar / importar:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'version', titulo: 'Aviso de versión nueva (versión desplegada simulada):', run: async ({ browser, errors }) => {
    const r = await checkAvisoVersion(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} móvil: abajo, encima de los botones de navegación en todas las fases (también con la barra de contexto), 44 px táctiles, cabe a 320 px, una línea a 320/360/390 px también mientras actualiza, oculto al escribir; «×» deja el punto en el icono de sesión; escritorio: arriba${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'toast', titulo: 'Avisos inferiores (showToast):', run: async ({ browser, errors }) => {
    const r = await checkToast(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} móvil (320/390 px): banda a 16 px de los bordes encima de los botones de navegación, sin captar toques, ≥14 px de letra, un mensaje de una frase en ≤2 líneas a 390 px (antes 3 en media pantalla), encima del aviso de versión nueva; escritorio: píldora centrada en una línea${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'informe-ia', titulo: 'Informe narrativo con IA (worker y Turnstile simulados):', run: async ({ browser, errors }) => {
    const r = await checkInformeNarrativo(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} licencia/clave, demo descartado, consentimiento con audio, SSE → informe guardado, revisado y compartido; fase 5: un solo «Compartir» abajo con menú (paciente, IA si la hay, notas; «Enviar al informe» en el hub); nada de IA en el hub`);
    if (!r.ok) console.log('\nInforme narrativo:', JSON.stringify(r));
    return r.ok;
  } },

  // Lanza sus propios navegadores (micrófono falso); la grabación con sonido
  // y la del micrófono mudo van a la vez.
  { id: 'grabacion', titulo: 'Grabación desde la cabecera (micrófono falso de Chromium):', run: async ({ errors }) => {
    const [grab, silencio] = await Promise.all([checkGrabadoraCabecera(errors), checkGrabadoraSilencio(errors)]);
    console.log(`  ${grab.ok ? '✓' : '✗'} toque = empezar/pausa/reanudar, pulsación larga y papelera descartan, sigue por todas las fases, «Generar» la cierra y la usa; reiniciar avisa y descarta`);
    console.log(`  ${silencio.ok ? '✓' : '✗'} micrófono mudo → píldora ⚠ y aviso «No se oye nada»; con sonido, ningún aviso`);
    if (!grab.ok) console.log('\nGrabadora:', JSON.stringify(grab));
    if (!silencio.ok) console.log('    ', JSON.stringify(silencio));
    return grab.ok && silencio.ok;
  } },
];

async function main() {
  const op = leerOpciones(process.argv.slice(2));
  if (op.lista) { SECCIONES.forEach(s => console.log(`${s.id.padEnd(14)} ${s.titulo}`)); return; }
  const desconocidas = op.solo.filter(id => !SECCIONES.some(s => s.id === id));
  if (desconocidas.length) {
    console.error(`Sección desconocida: ${desconocidas.join(', ')}. Secciones: ${SECCIONES.map(s => s.id).join(', ')}`);
    process.exit(2);
  }
  const elegidas = op.solo.length ? SECCIONES.filter(s => op.solo.includes(s.id)) : SECCIONES;
  const inicio = Date.now();

  const browser = await chromium.launch();
  const errors = [];
  const moduleStatus = {};
  const page = await nuevaPagina(browser, errors, moduleStatus);

  // Siempre: que cada módulo cargue (también comprueba que el servidor responde).
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

  // Cada sección corre con su propia página y su salida se guarda aparte
  // (AsyncLocalStorage) y se imprime entera al acabar, en el orden de la lista.
  const salidas = new Map();
  const logOriginal = console.log;
  console.log = (...a) => { const buf = salidaActual.getStore(); if (buf) buf.push(a.join(' ')); else logOriginal(...a); };
  let impresas = 0;
  const imprimirListas = () => {
    while (impresas < elegidas.length && salidas.has(elegidas[impresas].id)) logOriginal(salidas.get(elegidas[impresas++].id).join('\n'));
  };
  const fallidas = [];
  await enParalelo(elegidas, op.secciones, async (s) => {
    const buf = [`\n${s.titulo}`];
    await salidaActual.run(buf, async () => {
      const t0 = Date.now();
      const page = await nuevaPagina(browser, errors);
      let ok;
      try { ok = await s.run({ browser, page, errors, paralelo: op.paralelo }); }
      catch (e) { ok = false; console.log(`  ✗ excepción: ${e.message.split('\n')[0]}`); }
      finally { await page.context().close().catch(() => {}); }
      console.log(`  (${s.id}: ${((Date.now() - t0) / 1000).toFixed(1)} s)`);
      if (!ok) fallidas.push(s.id);
    });
    salidas.set(s.id, buf);
    imprimirListas();
  });
  console.log = logOriginal;
  fallidas.sort((a, b) => elegidas.findIndex(s => s.id === a) - elegidas.findIndex(s => s.id === b));
  await browser.close();

  const realErrors = errors.filter(e => !KNOWN_NOISE.some(n => e.includes(n)));
  console.log(`\n${realErrors.length ? '✗' : '✓'} Console/page errors: ${realErrors.length}`);
  realErrors.forEach(e => console.log('  -', e));

  const pass = modulesOk && fallidas.length === 0 && realErrors.length === 0;
  const parcial = elegidas.length < SECCIONES.length;
  const resumen = parcial ? ` (PARCIAL: ${elegidas.map(s => s.id).join(', ')}; no sustituye a la ejecución completa antes de main)` : '';
  console.log(`\n${pass ? '✓ SMOKE TEST PASSED' : '✗ SMOKE TEST FAILED'}${resumen} · ${((Date.now() - inicio) / 1000).toFixed(0)} s`);
  if (fallidas.length) console.log(`Secciones con fallos: ${fallidas.join(', ')}  (repetir con --solo ${fallidas.join(',')})`);
  process.exit(pass ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(1); });
