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
const MODULE_FILES = ['app.js', 'state.js', 'data.js', 'phase4.js', 'phase4b.js', 'ampliar-ia.js', 'lib/sintomas.js', 'sintomas.js', 'lib/pistas.js', 'lib/session.js', 'lib/posquirurgico.js',
  'data/comun.js', 'data/anatomia.js', 'data/hombro.js', 'data/cadera.js', 'data/cervical.js', 'data/lumbar.js', 'data/rodilla.js', 'data/codo.js', 'data/tobillo_pie.js', 'data/cuestionarios.js', 'lib/cuestionarios.js'];
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
// Primera opción de cada fila de la matriz de irritabilidad, en la vista visible
async function contestarMatriz(page, indice = 0) {
  for (const k of ['reposo', 'movimiento', 'tolerancia', 'calma']) {
    await page.locator(`#phase3 .irritab-btn[data-key="${k}"]:visible`).nth(indice).click();
  }
}

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
  // Matriz de irritabilidad sin preselección (decisión 101): la primera opción
  // de cada fila, con la vista que se vea (tabla o tarjetas) → irritabilidad baja
  await contestarMatriz(page);
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
  await page.evaluate(() => selectModo('breve'));
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
    ? ['pq_herida', 'pq_tvp', 'pq_tep', 'pq_nervio_col']
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
  await abrirApp(page);
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
  await abrirApp(page);
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
  await abrirApp(page);
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

// Silueta de la fase 2 (lib/silueta.js): figura según el sexo, que es el
// mismo dato en las fases 1 y 2; un toque elige región y lado; la lista sigue
// funcionando, el cambio de región pide confirmación pasada la fase 2, la
// figura no salta y las zonas caben sin pisarse a 320 px.
async function checkSilueta(page) {
  await page.setViewportSize({ width: 320, height: 700 });
  await abrirApp(page);
  const r = {};
  await page.click('#sexo .option-btn:has-text("Mujer")');
  await page.fill('#motivoConsulta', 'Dolor (silueta)');
  await page.click('#mecanismo .option-btn >> nth=0');
  await page.click('#cronologia .option-btn >> nth=0');
  await page.click('#phase1 .btn-primary');
  await page.waitForSelector('#siluetaRegion .sil-zona');
  const zona = (region, lado) => `#siluetaRegion .sil-zona[data-region="${region}"][data-lado="${lado}"]`;
  const estadoSinSalto = () => page.evaluate(() => ({
    region: state.region, lado: state.lado, sexo: state.sexo,
    texto: document.querySelector('.sil-elegida-texto').textContent,
    sub: document.querySelector('.sil-elegida-sub').textContent,
    figura: document.querySelector('.sil-lienzo').dataset.figura,
    sexoSilueta: document.querySelector('.sil-sexo .option-btn.selected')?.dataset.sexo || '',
    sexoFase1: document.querySelector('#sexo .option-btn.selected')?.textContent.trim() || '',
    nota: document.querySelector('.sil-nota').textContent,
    // Sin saltos: la figura siempre a la misma distancia del inicio del bloque; la fila del sexo cabe en su alto
    alto: Math.round(document.querySelector('.sil-lienzo').getBoundingClientRect().top - document.getElementById('siluetaRegion').getBoundingClientRect().top),
    // …y la misma altura con las dos figuras, así que lo de debajo (lado, lista) tampoco se mueve
    altoLienzo: Math.round(document.querySelector('.sil-lienzo').getBoundingClientRect().height),
    notaCabe: (() => {
      const fila = document.querySelector('.sil-sexo-fila').getBoundingClientRect();
      return [...document.querySelectorAll('.sil-sexo-fila > *')].every(el => { const c = el.getBoundingClientRect(); return c.top >= fila.top - 1 && c.bottom <= fila.bottom + 1 && c.right <= fila.right + 1; });
    })(),
    on: [...document.querySelectorAll('.sil-zona-on')].map(b => `${b.dataset.region}|${b.dataset.lado}`).sort(),
    aMedias: [...document.querySelectorAll('.sil-zona-region')].map(b => `${b.dataset.region}|${b.dataset.lado}`).sort(),
    tarjeta: document.querySelector('.region-card.selected')?.dataset.region || '',
    botonLado: document.querySelector('#lado .option-btn.selected')?.textContent || '',
  }));
  const altos = new Set(), altosLienzo = new Set(), figuras = new Set(), cabe = [];
  const estado = async () => { const e = await estadoSinSalto(); altos.add(e.alto); altosLienzo.add(e.altoLienzo); figuras.add(e.figura); cabe.push(e.notaCabe); return e; };
  const inicio = await estado();
  r.figuraDelSexo = inicio.figura === 'mujer' && inicio.sexoSilueta === 'Mujer' && inicio.nota === '' && inicio.texto === 'Toca la región en la silueta'
    && await page.evaluate(() => { const v = document.querySelector('#siluetaRegion .sil-vista'); return !!v && v.textContent.includes('Vista desde detrás') && v.getBoundingClientRect().bottom <= document.querySelector('.sil-lienzo').getBoundingClientRect().top + 4; });
  // A 320 px: zonas de 44 px, dentro de la pantalla y sin pisarse; nada desborda
  r.cabe320 = await page.evaluate(() => {
    const cajas = [...document.querySelectorAll('.sil-zona')].map(b => b.getBoundingClientRect());
    const centro = c => [c.left + c.width / 2, c.top + c.height / 2];
    const dist = cajas.flatMap((a, i) => cajas.slice(i + 1).map(b => Math.hypot(centro(a)[0] - centro(b)[0], centro(a)[1] - centro(b)[1])));
    return cajas.length === 12 && cajas.every(c => c.width >= 44 && c.height >= 44 && c.left >= 0 && c.right <= innerWidth)
      && Math.min(...dist) >= 44 && document.documentElement.scrollWidth <= innerWidth;
  });
  await page.click(zona('rodilla', 'Izquierdo'));
  let e = await estado();
  r.toqueRegionYLado = e.region === 'rodilla' && e.lado === 'Izquierdo' && e.texto === 'Rodilla (izquierda)'
    && e.tarjeta === 'rodilla' && e.botonLado === 'Izquierdo' && e.on.join() === 'rodilla|Izquierdo';
  // Las dos zonas de la región son casillas: el otro lado se añade (bilateral), sin confirmar…
  await page.click(zona('rodilla', 'Derecho'));
  e = await estado();
  r.bilateral = e.lado === 'Bilateral' && e.texto === 'Rodilla (bilateral)' && e.sub === 'Toca un lado para quitarlo'
    && e.botonLado === 'Bilateral' && e.on.join() === 'rodilla|Derecho,rodilla|Izquierdo' && !(await page.isVisible('#confirmBanner'));
  // …tocar uno lo quita…
  await page.click(zona('rodilla', 'Izquierdo'));
  e = await estado();
  r.quitaLado = e.lado === 'Derecho' && e.on.join() === 'rodilla|Derecho' && e.sub === '';
  // …y un segundo toque deja la región sin lado
  await page.click(zona('rodilla', 'Derecho'));
  e = await estado();
  r.sinLado = e.region === 'rodilla' && e.lado === '' && e.aMedias.join() === 'rodilla|Derecho,rodilla|Izquierdo' && e.sub === 'Lado sin indicar: toca uno (opcional)';
  // Región sin lado: borde continuo y «?» en sus dos zonas; las demás, discontinuas y sin «?»
  r.interrogacion = await page.evaluate(() => {
    const ver = b => getComputedStyle(b.querySelector('.sil-pregunta')).display !== 'none';
    const [aMedias, resto] = [[...document.querySelectorAll('.sil-zona-region')], [...document.querySelectorAll('.sil-zona:not(.sil-zona-region):not(.sil-zona-on)')]];
    return aMedias.length === 2 && aMedias.every(b => ver(b) && getComputedStyle(b).borderTopStyle === 'solid')
      && resto.length > 0 && resto.every(b => !ver(b) && getComputedStyle(b).borderTopStyle === 'dashed');
  });
  // Los botones de lado siguen funcionando y el dibujo los sigue
  await page.click('#lado .option-btn:has-text("Bilateral")');
  e = await estado();
  r.botonBilateral = e.on.join() === 'rodilla|Derecho,rodilla|Izquierdo';
  await page.click(zona('lumbar', ''));
  e = await estado();
  r.columna = e.region === 'lumbar' && e.lado === '' && e.texto === 'Lumbar' && e.on.join() === 'lumbar|';
  // El sexo de la silueta es el de la fase 1: lo cambia, la figura lo sigue y la región sigue marcada
  await page.click('#siluetaRegion .sil-sexo [data-sexo="Hombre"]');
  e = await estado();
  r.sexoDesdeSilueta = e.sexo === 'Hombre' && e.sexoFase1 === 'Hombre' && e.sexoSilueta === 'Hombre' && e.figura === 'hombre'
    && e.on.join() === 'lumbar|' && await page.evaluate(() => document.activeElement?.dataset.sexo === 'Hombre');
  // Segundo toque: lo quita en las dos fases (figura masculina por defecto, «Sin indicar»)
  await page.click('#siluetaRegion .sil-sexo [data-sexo="Hombre"]');
  e = await estado();
  r.sexoSegundoToque = e.sexo === '' && e.sexoFase1 === '' && e.sexoSilueta === '' && e.figura === 'hombre' && e.nota === 'Sin indicar';
  // La lista: región sin lado, sus dos zonas a medias
  await page.click('.region-card[data-region="codo"]');
  e = await estado();
  r.lista = e.region === 'codo' && e.lado === '' && e.aMedias.join() === 'codo|Derecho,codo|Izquierdo' && e.texto === 'Codo';
  // Pasada la fase 2, cambiar de región pide confirmación; cancelar no cambia nada
  await page.evaluate(() => { state.maxVisitedIdx = 2; });
  await page.click(zona('hombro', 'Derecho'));
  await page.waitForSelector('#confirmBanner');
  await page.click('#confirmCancel');
  e = await estado();
  r.cancela = e.region === 'codo' && e.lado === '';
  await page.click(zona('hombro', 'Derecho'));
  await page.waitForSelector('#confirmBanner');
  await page.click('#confirmAction');
  e = await estado();
  r.confirma = e.region === 'hombro' && e.lado === 'Derecho' && e.texto === 'Hombro (derecho)';
  // Y al revés: el sexo marcado en la fase 1 llega a la silueta
  await page.evaluate(() => goToPhase(1));
  await page.click('#sexo .option-btn:has-text("Mujer")');
  await page.evaluate(() => goToPhase(2));
  e = await estado();
  r.sexoDesdeFase1 = e.sexo === 'Mujer' && e.sexoSilueta === 'Mujer' && e.figura === 'mujer' && e.nota === '';
  await estado();
  r.sinSaltos = altos.size === 1 && altosLienzo.size === 1 && figuras.size === 2 && cabe.every(Boolean);
  if (!r.sinSaltos) r.altos = [...altos, '|', ...altosLienzo];
  // Tema claro: los colores de la silueta salen de sus variables
  r.tema = await page.evaluate(() => {
    const raiz = document.documentElement, antes = raiz.getAttribute('data-theme');
    const f = tema => { raiz.setAttribute('data-theme', tema); return getComputedStyle(document.querySelector('.sil-parte')).fill; };
    const oscuro = f('dark'), claro = f('light');
    raiz.setAttribute('data-theme', antes);
    return oscuro !== claro;
  });
  r.ok = Object.values(r).every(Boolean);
  await page.setViewportSize({ width: 1280, height: 900 });
  return r;
}

// Lado afectado (fase 2): aparece al elegir región, «Central» solo en columna,
// se guarda en el estado y cabe a 320 px sin desbordar.
async function checkLado(page) {
  await page.setViewportSize({ width: 320, height: 640 });
  await abrirApp(page);
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
// Hipermovilidad / Ehlers-Danlos (Fase P, docs/hipermovilidad.md), rodilla.
// Fase 1: sin marcar no hay sistema; «Sospecha» lo añade a la fase 2 con el
// cuestionario, la escala de Beighton (corte por edad), las urgencias del
// subtipo vascular sin plegar y la regla de sospecha. 4b: el aviso de laxitud
// en Lachman y no en las pruebas compuestas. Fase 5: el recuadro. 320 px: nada
// se sale. Quitar la marca quita el sistema.
async function checkHipermovilidad(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
  const r = {};
  await page.fill('#motivoConsulta', 'Dolor de rodilla');
  await page.fill('#edadPaciente', '30');
  await page.dispatchEvent('#edadPaciente', 'input');
  await page.click('#mecanismo .option-btn >> nth=1');
  await page.click('#cronologia .option-btn >> nth=0');
  r.subtipoOculto = !(await page.isVisible('#hmSubtipoWrap'));
  await page.click('#hmEstado .option-btn[data-valor="diagnosticada"]');
  r.subtipoVisible = await page.isVisible('#hmSubtipoWrap');
  await page.click('#hmEstado .option-btn[data-valor="sospecha"]');
  r.subtipoOcultoSospecha = !(await page.isVisible('#hmSubtipoWrap'));
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('rodilla', this)"]`);
  await page.waitForTimeout(150);
  r.tab = await page.isVisible('#tab_transversal_hipermovilidad');
  await page.click('#tab_transversal_hipermovilidad');
  const P = '#panel_transversal_hipermovilidad';
  r.cuestionario = await page.$$eval(`${P} .hm-cq`, els => els.length);
  await page.click(`${P} button:has-text("Hacer la escala de Beighton")`);
  for (let i = 0; i < 5; i++) await page.click(`${P} [data-beighton] >> nth=${i}`);
  r.hag = await page.evaluate(p => document.querySelector(p).textContent.includes('Beighton 5/9 · corte 5') && document.querySelector(p).textContent.includes('valorar derivación a reumatología'), P);
  await page.click(`${P} [data-beighton] >> nth=4`);   // 4/9
  r.beightonChips = await page.$$eval(`${P} [data-beighton]`, els => els.filter(e => e.classList.contains('selected') && e.getAttribute('aria-pressed') === 'true').length === 4 && els.every(e => e.tagName === 'BUTTON'));
  await page.click(`${P} .hm-cq >> nth=0 >> .sq-btn.si`);
  await page.click(`${P} .hm-cq >> nth=1 >> .sq-btn.si`);
  r.porCuestionario = await page.evaluate(p => document.querySelector(p).textContent.includes('Un punto por debajo del corte'), P);
  r.urgSinPlegar = await page.$$eval(`${P} .sq2-urg`, els => els.length) === 3;
  await page.click(`${P} #sq2_hm_v_ojo .sq-btn.si`);
  r.urgencia = await page.isVisible('#sistemicoAlert .urgencia-alert');
  await page.click(`${P} #sq2_hm_v_ojo .sq-btn.no`);
  await page.click(`${P} #sq2_hm_s_neumo .sq-btn.si`);
  r.menorSolo = await page.evaluate(p => document.querySelector(`${p} [data-hm-vascular]`).textContent.includes('por sí solo es un hallazgo'), P);
  await page.click(`${P} #sq2_hm_s_varices .sq-btn.si`);
  r.dosMenores = await page.evaluate(p => document.querySelector(`${p} [data-hm-vascular]`).textContent.includes('derivación preferente a genética'), P);
  // 4b: el aviso en los tests de laxitud de ro4
  await page.evaluate(() => { state.activeHypotheses = ['ro4']; goToPhase('4b'); });
  await page.waitForTimeout(200);
  r.avisos = await page.$$eval('#hypcard_ro4 .hm-aviso-test', els => els.length);
  // Fase 5: el recuadro
  await page.evaluate(() => { buildResults(); goToPhase(5); });
  await page.waitForTimeout(200);
  r.fase5 = await page.evaluate(() => { const t = document.querySelector('#resultsContent .hm-fase5')?.textContent || ''; return t.includes('Sospecha') && t.includes('Ejercicio graduado') && t.includes('derivación preferente a genética'); });
  // Enlace a la guía de efectos del ejercicio, bloque de hipermovilidad; nunca con el subtipo
  // vascular diagnosticado ni con la regla de sospecha vascular cumplida (aquí, dos menores)
  r.sinEnlaceSospechaVascular = !(await page.$('#resultsContent .hm-fase5 [data-bloque-condicion]'));
  await page.evaluate(() => { state.sistemicoAnswers.hm_s_varices = 'NO'; buildResults(); });
  r.enlaceEjercicio = !!(await page.$('#resultsContent .hm-fase5 [data-bloque-condicion="hipermovilidad"] button'));
  if (r.enlaceEjercicio) {
    await page.click('#resultsContent .hm-fase5 [data-bloque-condicion="hipermovilidad"] button');
    await page.waitForSelector('#ejercicioOverlay.open');
    r.enlaceEjercicio = await page.evaluate(() => document.querySelector('#ejercicioCuerpo [data-bloque="hipermovilidad"]')?.open === true);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.getElementById('ejercicioOverlay').classList.contains('open'));
  }
  r.sinEnlaceVascular = await page.evaluate(() => {
    const antes = { ...state.hipermovilidad };
    Object.assign(state.hipermovilidad, { estado: 'diagnosticada', subtipo: 'vascular' });
    buildResults();
    const hay = !!document.querySelector('#resultsContent .hm-fase5') && !document.querySelector('#resultsContent .hm-fase5 [data-bloque-condicion]');
    Object.assign(state.hipermovilidad, antes);
    buildResults();
    return hay;
  });
  // 320 px: fase 1 y fase 2 sin desbordar
  await page.setViewportSize({ width: 320, height: 700 });
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  r.ancho1 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  await page.click('#acc_transversal_hipermovilidad .sistema-accordion-header');
  await page.waitForTimeout(150);
  r.ancho2 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  // Diagnosticada sin saber el subtipo: las urgencias arteriales aparecen al
  // cumplirse la regla de sospecha vascular, y una marcada SÍ se queda al dejar de cumplirse
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#hmEstado .option-btn[data-valor="diagnosticada"]');
  await page.click('#hmSubtipo .option-btn[data-valor="ns"]');
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  await page.click('#tab_transversal_hipermovilidad');
  const urgVisibles = () => page.$$eval(`${P} .sq2-urg`, els => els.map(e => e.id).join(','));
  r.reglaSinUrg = await urgVisibles() === '';   // solo un menor (neumotórax)
  await page.click(`${P} #sq2_hm_s_familia .sq-btn.si`);
  r.reglaConUrg = await urgVisibles() === 'sq2_hm_v_dolor,sq2_hm_v_ojo,sq2_hm_v_aire';
  await page.click(`${P} #sq2_hm_v_dolor .sq-btn.si`);
  await page.click(`${P} #sq2_hm_s_familia .sq-btn.no`);
  r.urgMarcadaSeQueda = await urgVisibles() === 'sq2_hm_v_dolor'
    && await page.isVisible('#sistemicoAlert .urgencia-alert')
    && (await page.textContent('#sistemicoAlert')).includes('disección o rotura arterial');
  await page.click(`${P} #sq2_hm_v_dolor .sq-btn.no`);
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#hmEstado .option-btn[data-valor="sospecha"]');
  // Quitar la marca quita el sistema
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#hmEstado .option-btn[data-valor="sospecha"]');
  r.sinSistema = await page.evaluate(() => !document.getElementById('acc_transversal_hipermovilidad') && !document.getElementById('tab_transversal_hipermovilidad'));
  r.ok = r.subtipoOculto && r.beightonChips && r.subtipoVisible && r.subtipoOcultoSospecha && r.tab && r.cuestionario === 5 && r.hag && r.porCuestionario
    && r.urgSinPlegar && r.urgencia && r.menorSolo && r.dosMenores && r.avisos === 3 && r.fase5 && r.enlaceEjercicio && r.sinEnlaceSospechaVascular && r.sinEnlaceVascular && r.ancho1 && r.ancho2 && r.reglaSinUrg && r.reglaConUrg && r.urgMarcadaSeQueda && r.sinSistema;
  return r;
}

// Disautonomía / POTS (Fase P, docs/pots.md), lumbar. Fase 1: «cuál» solo con
// Diagnosticada. Fase 2: las 4 preguntas del síncope sin plegar y urgentes, la
// paroxística con 🩺, el patrón de sospecha y la prueba de bipedestación (las
// dos copias, panel y acordeón, sincronizadas; compatible e hipotensión). Fase
// 3: la nota de la tolerancia. 320 px: nada se sale. Quitar la marca quita el
// sistema. Después, un recorrido entero: la línea de la 4b, el recuadro de la
// fase 5 y el aviso y la red de seguridad de la fase 6.
async function checkDisautonomia(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
  const r = {};
  await page.fill('#motivoConsulta', 'Dolor lumbar y mareo al estar de pie');
  await page.fill('#edadPaciente', '24');
  await page.dispatchEvent('#edadPaciente', 'input');
  await page.click('#mecanismo .option-btn >> nth=1');
  await page.click('#cronologia .option-btn >> nth=0');
  r.tipoOculto = !(await page.isVisible('#dsTipoWrap'));
  await page.click('#dsEstado .option-btn[data-valor="diagnosticada"]');
  r.tipoVisible = await page.isVisible('#dsTipoWrap');
  await page.click('#dsEstado .option-btn[data-valor="sospecha"]');
  r.tipoOcultoSospecha = !(await page.isVisible('#dsTipoWrap'));
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('lumbar', this)"]`);
  await page.waitForTimeout(150);
  // Pregunta de síncope de la región (sx_sincope, decisión 9), urgente y sin plegar
  await page.click('#tab_l_vascular');
  r.sincopeRegion = await page.isVisible('#panel_l_vascular #sq2_sx_sincope.sq2-urg');
  r.tab = await page.isVisible('#tab_transversal_disautonomia');
  await page.click('#tab_transversal_disautonomia');
  const P = '#panel_transversal_disautonomia';
  r.urgSinPlegar = await page.$$eval(`${P} .sq2-urg`, els => els.length) === 4;
  r.sospecha = await page.$$eval(`${P} .ds-io`, els => els.length) === 3;
  await page.click(`${P} #sq2_ds_u_esfuerzo .sq-btn.si`);
  r.urgencia = await page.isVisible('#sistemicoAlert .urgencia-alert');
  await page.click(`${P} #sq2_ds_u_esfuerzo .sq-btn.no`);
  await page.click(`${P} #sq2_ds_d_paroxistica .sq-btn.si`);
  r.derivacion = await page.isVisible(`${P} #sq2_ds_d_paroxistica .sq2-deriv-msg`);
  await page.click(`${P} #sq2_ds_d_paroxistica .sq-btn.no`);
  // Prueba de bipedestación: compatible (24 años, corte 30)
  await page.click(`${P} button:has-text("Hacer la prueba de bipedestación")`);
  const campo = (f, c) => `${P} [data-ds-fila="${f}"][data-ds-campo="${c}"]`;
  const cifras = { tumbado: [70, 120, 75], m1: [95, 112, 72], m3: [102, 118, 76], m5: [104, 118, 76], m8: [99, 118, 76], m10: [101, 118, 76] };
  for (const [f, [fc, tas, tad]] of Object.entries(cifras)) {
    await page.fill(campo(f, 'fc'), String(fc));
    await page.fill(campo(f, 'tas'), String(tas));
    await page.fill(campo(f, 'tad'), String(tad));
  }
  await page.check(campo('m3', 'sintomas'));
  const resultado = () => page.evaluate(p => document.querySelector(`${p} [data-ds-resultado]`).textContent, P);
  r.compatible = (await resultado()).includes('Aumento de la FC de 32 lpm mantenido') && (await resultado()).includes('Compatible con taquicardia ortostática');
  r.sincronizada = await page.evaluate(() => document.querySelector('#acc_transversal_disautonomia [data-ds-fila="m10"][data-ds-campo="fc"]').value === '101'
    && document.querySelector('#acc_transversal_disautonomia [data-ds-fila="m3"][data-ds-campo="sintomas"]').checked);
  r.payload = await page.evaluate(async () => JSON.stringify((await import('./app.js')).buildPhysiQPayload().ds) === JSON.stringify({ es: 'sospecha', ti: '', pb: true, dfc: 32, ho: false, ot: true, cs: null }));
  await page.fill(campo('m5', 'tas'), '95');
  r.hipotension = (await resultado()).includes('hipotensión ortostática, no un POTS');
  await page.fill(campo('m5', 'tas'), '118');
  // Fase 3: la nota de la tolerancia
  await page.evaluate(() => goToPhase(3));
  await page.waitForTimeout(150);
  r.notaFase3 = await page.isVisible('#dsNotaTolerancia') && (await page.textContent('#dsNotaTolerancia')).includes('la matriz mide lo segundo');
  // 320 px: fase 1 y la prueba en el acordeón, sin desbordar
  await page.setViewportSize({ width: 320, height: 700 });
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  r.ancho1 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  await page.click('#acc_transversal_disautonomia .sistema-accordion-header');
  await page.waitForTimeout(150);
  r.ancho2 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  r.inputs320 = await page.$$eval('#acc_transversal_disautonomia .ds-tabla input[type="number"]', els => els.length === 18 && els.every(e => e.getBoundingClientRect().right <= 320 && e.getBoundingClientRect().width >= 40));
  // Quitar la marca quita el sistema
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#dsEstado .option-btn[data-valor="sospecha"]');
  r.sinSistema = await page.evaluate(() => !document.getElementById('acc_transversal_disautonomia') && !document.getElementById('tab_transversal_disautonomia') && !document.body.classList.contains('disautonomia'));
  // Recorrido entero con la sospecha marcada: 4b, fase 5 y fase 6
  await abrirApp(page);
  await page.click('#dsEstado .option-btn[data-valor="sospecha"]');
  await walkRegion(page, 'lumbar');
  r.fase5 = await page.evaluate(() => { const t = document.querySelector('#resultsContent .ds-fase5')?.textContent || ''; return t.includes('Sospecha') && t.includes('semirreclinado') && t.includes('valoración médica urgente'); });
  // Enlace a la guía de efectos del ejercicio, bloque de intolerancia ortostática
  r.enlaceEjercicio = !!(await page.$('#resultsContent .ds-fase5 [data-bloque-condicion="ortostatica"] button'));
  if (r.enlaceEjercicio) {
    await page.click('#resultsContent .ds-fase5 [data-bloque-condicion="ortostatica"] button');
    await page.waitForSelector('#ejercicioOverlay.open');
    r.enlaceEjercicio = await page.evaluate(() => document.querySelector('#ejercicioCuerpo [data-bloque="ortostatica"]')?.open === true);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.getElementById('ejercicioOverlay').classList.contains('open'));
  }
  await page.evaluate(() => goToPhase('4b'));
  await page.waitForTimeout(200);
  r.nota4b = await page.isVisible('#hypothesisCards .ds-nota-4b');
  await page.evaluate(() => goToPhase(5));
  await page.waitForTimeout(150);
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.fase6 = await page.evaluate(() => { const t = document.getElementById('planContenido').textContent; return t.includes('Disautonomía: empezar el ejercicio semirreclinado') && t.includes('si se desmaya mientras hace ejercicio'); });
  r.ok = r.tipoOculto && r.tipoVisible && r.tipoOcultoSospecha && r.tab && r.urgSinPlegar && r.sospecha && r.urgencia && r.derivacion
    && r.compatible && r.sincronizada && r.payload && r.hipotension && r.notaFase3 && r.ancho1 && r.ancho2 && r.inputs320 && r.sinSistema
    && r.fase5 && r.enlaceEjercicio && r.nota4b && r.fase6 && r.sincopeRegion;
  return r;
}

// Lupus (Fase P, docs/lupus.md), codo. Fase 1: las filas solo con
// «Diagnosticado», y un segundo toque desmarca. Fase 2: las 6 urgencias sin
// plegar, la derivación con 🩺; con «Sospecha», solo los rasgos y la
// derivación preferente. Fase 3: las dos notas. Con la hipermovilidad, la
// nota de Malfait bajo la escala de Beighton. 320 px: nada se sale. Quitar la
// marca quita el sistema. Después, un recorrido entero: la línea de la 4b, el
// recuadro de la fase 5 y los avisos y la red de seguridad de la fase 6.
async function checkLupus(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
  const r = {};
  await page.fill('#motivoConsulta', 'Dolor de codo al cargar');   // sin «lupus»: el informe con la sospecha no debe nombrarlo
  await page.fill('#edadPaciente', '34');
  await page.dispatchEvent('#edadPaciente', 'input');
  await page.click('#mecanismo .option-btn >> nth=1');
  await page.click('#cronologia .option-btn >> nth=0');
  r.filasOcultas = !(await page.isVisible('#lesDiagWrap'));
  await page.click('#lesEstado .option-btn[data-valor="sospecha"]');
  r.filasOcultasSospecha = !(await page.isVisible('#lesDiagWrap'));
  await page.click('#lesEstado .option-btn[data-valor="diagnosticado"]');
  r.filasVisibles = await page.isVisible('#lesDiagWrap');
  const fila = (k, v) => page.click(`[data-les-fila="${k}"] .option-btn[data-valor="${v}"]`);
  await fila('corticoides', 'a');
  await fila('corticoides', 'a');
  r.segundoToque = await page.evaluate(() => state.lupus.corticoides === '');
  await fila('corticoides', 'm');
  await fila('antifosfolipidos', 'no');
  await fila('actividad', 'peor');
  await page.click('[data-les-casilla="raynaud"]');
  r.estado = await page.evaluate(() => JSON.stringify(state.lupus) === JSON.stringify({ estado: 'diagnosticado', corticoides: 'm', dosisAltas: '', inmunosupresores: '',
    antifosfolipidos: 'no', osteonecrosis: false, raynaud: true, actividad: 'peor', rasgos: {} }));
  // El anticoagulante o antiagregante ya no es una casilla: una línea lleva a su tarjeta (docs/anticoagulado.md, decisión 3)
  r.enlaceAC = !(await page.$('[data-les-casilla="antitrombotico"]')) && (await page.textContent('#lesNotaAC')).includes('Paciente anticoagulado o antiagregado');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('codo', this)"]`);
  await page.waitForTimeout(150);
  r.tab = await page.isVisible('#tab_transversal_lupus');
  await page.click('#tab_transversal_lupus');
  const P = '#panel_transversal_lupus';
  r.urgSinPlegar = await page.$$eval(`${P} .sq2-urg`, els => els.length) === 6;
  r.sinEmbudo = await page.$$eval(`${P} [data-embudo]`, els => els.length) === 0;
  await page.click(`${P} #sq2_les_u_tvp .sq-btn.si`);
  r.urgencia = await page.isVisible('#sistemicoAlert .urgencia-alert');
  await page.click(`${P} #sq2_les_u_tvp .sq-btn.no`);
  await page.click(`${P} #sq2_les_d_rinon .sq-btn.si`);
  r.derivacion = await page.isVisible(`${P} #sq2_les_d_rinon .sq2-deriv-msg`);
  r.payloadDv = await page.evaluate(async () => (await import('./app.js')).buildPhysiQPayload().dv.some(t => t.startsWith('Posible afectación del riñón')));
  await page.click(`${P} #sq2_les_d_rinon .sq-btn.no`);
  // Fase 3: la nota de Naturaleza y, con «Peor, sin valorar aún», la del brote
  await page.evaluate(() => goToPhase(3));
  await page.waitForTimeout(150);
  r.notaNaturaleza = await page.isVisible('#lesNotaNaturaleza') && (await page.textContent('#lesNotaNaturaleza')).includes('sola no mide la actividad');
  r.notaBrote = await page.isVisible('#lesNotaBrote');
  // Con la hipermovilidad, la nota de Malfait bajo la escala de Beighton
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#hmEstado .option-btn[data-valor="sospecha"]');
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  await page.click('#tab_transversal_hipermovilidad');
  await page.click('#panel_transversal_hipermovilidad button:has-text("Hacer la escala de Beighton")');
  r.notaHM = (await page.textContent('#panel_transversal_hipermovilidad [data-hm-bloque]')).includes('Con lupus, el diagnóstico de SED hipermóvil');
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#hmEstado .option-btn[data-valor="sospecha"]');
  // «Sospecha»: sin urgencias del sistema, con los rasgos
  await page.click('#lesEstado .option-btn[data-valor="sospecha"]');
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  await page.click('#tab_transversal_lupus');
  r.sospechaSinUrg = await page.$$eval(`${P} .sq2-urg`, els => els.length) === 0;
  r.rasgos = await page.$$eval(`${P} .les-rasgo`, els => els.length) === 6;
  await page.click(`${P} .les-rasgo >> nth=1 >> .sq-btn.si`);
  r.derivarSospecha = (await page.textContent(`${P} [data-les-bloque]`)).includes('derivación preferente a su médico de atención primaria');
  r.sincronizada = await page.evaluate(() => document.querySelector('#acc_transversal_lupus [data-les-bloque]').textContent.includes('1 de 5 con «sí»'));
  r.informeSinLupus = await page.evaluate(async () => !/lupus/i.test((await import('./app.js')).buildInformeFisioterapiaText()));
  // 320 px: la tarjeta y el acordeón, sin desbordar
  await page.setViewportSize({ width: 320, height: 700 });
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#lesEstado .option-btn[data-valor="diagnosticado"]');
  r.ancho1 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  await page.click('#acc_transversal_lupus .sistema-accordion-header');
  await page.waitForTimeout(150);
  r.ancho2 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  // Quitar la marca quita el sistema
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#lesEstado .option-btn[data-valor="diagnosticado"]');
  r.sinSistema = await page.evaluate(() => !document.getElementById('acc_transversal_lupus') && !document.getElementById('tab_transversal_lupus') && !document.body.classList.contains('lupus'));
  // Recorrido entero con «Diagnosticado» y Raynaud: 4b, fase 5 y fase 6
  await abrirApp(page);
  await page.click('#lesEstado .option-btn[data-valor="diagnosticado"]');
  await page.click('[data-les-casilla="raynaud"]');
  await walkRegion(page, 'codo');
  r.fase5 = await page.evaluate(() => { const t = document.querySelector('#resultsContent .les-fase5')?.textContent || '';
    return t.includes('Diagnosticado') && t.includes('150–300 min') && t.includes('Fotoprotección') && t.includes('Raynaud') && t.includes('valoración médica hoy'); });
  // Enlace a la guía de efectos del ejercicio (docs/efectos-ejercicio.md)
  r.enlaceEjercicio = !!(await page.$('#resultsContent .les-fase5 [data-bloque-condicion="antiinflamatorio"] button'));
  if (r.enlaceEjercicio) {
    await page.click('#resultsContent .les-fase5 [data-bloque-condicion="antiinflamatorio"] button');
    await page.waitForSelector('#ejercicioOverlay.open');
    r.enlaceEjercicio = await page.evaluate(() => document.querySelector('#ejercicioCuerpo [data-bloque="antiinflamatorio"]')?.open === true);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.getElementById('ejercicioOverlay').classList.contains('open'));
  }
  await page.evaluate(() => goToPhase('4b'));
  await page.waitForTimeout(200);
  r.nota4b = await page.isVisible('#hypothesisCards .les-nota-4b');
  await page.evaluate(() => goToPhase(5));
  await page.waitForTimeout(150);
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.fase6 = await page.evaluate(() => { const t = document.getElementById('planContenido').textContent;
    return t.includes('Lupus: intensidad moderada') && t.includes('Lupus con Raynaud') && t.includes('una infección puede dar poca fiebre') && t.includes('pérdida de visión de golpe'); });
  r.ok = r.filasOcultas && r.filasOcultasSospecha && r.filasVisibles && r.segundoToque && r.estado && r.tab && r.urgSinPlegar && r.sinEmbudo
    && r.urgencia && r.derivacion && r.payloadDv && r.notaNaturaleza && r.notaBrote && r.notaHM && r.sospechaSinUrg && r.rasgos
    && r.derivarSospecha && r.sincronizada && r.informeSinLupus && r.ancho1 && r.ancho2 && r.sinSistema && r.fase5 && r.enlaceEjercicio && r.nota4b && r.fase6 && r.enlaceAC;
  return r;
}

// Paciente anticoagulado o antiagregado (Fase P, docs/anticoagulado.md),
// lumbar. Fase 1: un solo estado, «Toma», y los chips de lo que toma («No lo
// sabe» excluye a los demás); el enlace a la guía de fármacos la abre en los
// antitrombóticos. Fase 2: con la aspirina sola no sale el golpe en la cabeza
// (NICE NG232, 1.2.4) ni el psoas o la pared abdominal; con un anticoagulante,
// las seis urgencias, sin plegar ni embudo. 320 px: nada se sale. Quitar la
// marca quita el sistema. Después, un recorrido entero: la línea de la 4b, el
// recuadro de la fase 5 y los avisos, el tope y la red de la fase 6.
async function checkAnticoagulado(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
  const r = {};
  await page.fill('#motivoConsulta', 'Dolor lumbar al agacharse');
  await page.click('#mecanismo .option-btn >> nth=1');
  await page.click('#cronologia .option-btn >> nth=0');
  r.nota = (await page.textContent('#acNota')).includes('No le digas que lo deje');
  r.unEstado = await page.$$eval('#acEstado .option-btn', els => els.length === 1 && els[0].dataset.valor === 'toma');
  r.chipsOcultos = !(await page.isVisible('#acTomaWrap'));
  await page.click('#acEstado .option-btn[data-valor="toma"]');
  r.chips = await page.isVisible('#acTomaWrap') && await page.$$eval('#acToma [data-ac-toma]', els => els.length === 6);
  await page.click('[data-ac-toma="oa"]');
  await page.click('[data-ac-toma="as"]');
  r.ordenTarjeta = await page.evaluate(() => JSON.stringify(state.anticoagulado.toma) === '["as","oa"]');
  r.ariaPressed = await page.getAttribute('[data-ac-toma="as"]', 'aria-pressed') === 'true';
  await page.click('[data-ac-toma="ns"]');
  r.nsExcluye = await page.evaluate(() => JSON.stringify(state.anticoagulado.toma) === '["ns"]');
  await page.click('[data-ac-toma="ns"]');
  await page.click('[data-ac-toma="as"]');
  // La guía de fármacos, abierta en los antitrombóticos
  await page.click('#cardAnticoagulado button:has-text("Fármacos: anticoagulantes y antiagregantes")');
  await page.waitForSelector('#farmOverlay.open');
  r.guia = await page.evaluate(() => document.querySelector('#farmCuerpo [data-familia="antitromboticos"]')?.open === true
    && [...document.querySelectorAll('#farmCuerpo [data-familia]')].filter(d => d.open).length === 1);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('lumbar', this)"]`);
  await page.waitForTimeout(150);
  r.tab = await page.isVisible('#tab_transversal_anticoagulado');
  await page.click('#tab_transversal_anticoagulado');
  const P = '#panel_transversal_anticoagulado';
  r.aspirina = await page.evaluate(sel => { const ids = [...document.querySelectorAll(`${sel} .sq2`)].map(e => e.id);
    return !ids.includes('sq2_ac_u_cabeza') && !ids.includes('sq2_ac_u_psoas') && !ids.includes('sq2_ac_u_pared')
      && ids.includes('sq2_ac_u_cabeza_tardia') && ids.includes('sq2_ac_u_espinal') && ids.includes('sq2_ac_u_compartimental'); }, P);
  r.sinEmbudo = await page.$$eval(`${P} [data-embudo]`, els => els.length) === 0;
  await page.click(`${P} #sq2_ac_u_espinal .sq-btn.si`);
  r.urgencia = await page.isVisible('#sistemicoAlert .urgencia-alert');
  await page.click(`${P} #sq2_ac_u_espinal .sq-btn.no`);
  await page.click(`${P} #sq2_ac_d_hematoma .sq-btn.si`);
  r.derivacion = await page.isVisible(`${P} #sq2_ac_d_hematoma .sq2-deriv-msg`);
  await page.click(`${P} #sq2_ac_d_hematoma .sq-btn.no`);
  // Con un anticoagulante directo, las seis urgencias
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('[data-ac-toma="do"]');
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  await page.click('#tab_transversal_anticoagulado');
  r.anticoagulante = await page.$$eval(`${P} .sq2-urg`, els => els.length) === 6;
  // 320 px: la tarjeta y el acordeón, sin desbordar
  await page.setViewportSize({ width: 320, height: 700 });
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  r.ancho1 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  await page.click('#acc_transversal_anticoagulado .sistema-accordion-header');
  await page.waitForTimeout(150);
  r.ancho2 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  // Quitar la marca quita el sistema
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#acEstado .option-btn[data-valor="toma"]');
  r.sinSistema = await page.evaluate(() => !document.getElementById('acc_transversal_anticoagulado') && !document.getElementById('tab_transversal_anticoagulado') && !document.body.classList.contains('anticoagulado'));
  // Recorrido entero con un anticoagulante directo: 4b, fase 5 y fase 6
  await abrirApp(page);
  await page.click('#acEstado .option-btn[data-valor="toma"]');
  await page.click('[data-ac-toma="do"]');
  await walkRegion(page, 'lumbar');
  r.fase5 = await page.evaluate(() => { const t = document.querySelector('#resultsContent .ac-fase5')?.textContent || '';
    return t.includes('anticoagulante directo') && t.includes('Thrust') && t.includes('Punción seca') && t.includes('Ondas de choque') && t.includes('Caídas'); });
  r.fase5Cita = await page.evaluate(() => !!document.querySelector('#resultsContent .ac-fase5 .cita[data-cita^="NICE NG232"]'));
  await page.evaluate(() => goToPhase('4b'));
  await page.waitForTimeout(200);
  r.nota4b = await page.isVisible('#hypothesisCards .ac-nota-4b');
  await page.evaluate(() => goToPhase(5));
  await page.waitForTimeout(150);
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.fase6 = await page.evaluate(() => { const t = document.getElementById('planContenido').textContent;
    return t.includes('Anticoagulado o antiagregado: precaución') && t.includes('Anticoagulante: sin manipulación con thrust') && t.includes('Red de seguridad (anticoagulado o antiagregado)'); });
  r.ok = Object.values(r).every(Boolean);
  return r;
}

// Fármacos que toma (paso 3 de la farmacología, docs/farmacos-paciente.md),
// lumbar. Fase 1: chips de las familias escritas de la guía (sin texto libre),
// la línea del anticoagulado, el chip de corticoides desde el lupus (solo
// lectura), la medicación del formulario como pista; la guía con «Este
// paciente» (y su segundo toque); fase 5 con su recuadro, fase 6 con los
// avisos; 320 px y el hub.
async function checkFarmacosPaciente(browser, page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
  const r = {};
  const C = '#cardFarmacos';
  r.sinTexto = await page.$$eval(`${C} input, ${C} textarea`, els => els.length === 0);
  r.nota = (await page.textContent('#fmNota')).includes('No le digas que deje ni cambie');
  // Los chips son las familias escritas de la guía, sin los antitrombóticos
  const chips = await page.$$eval(`${C} [data-fm]`, els => els.map(e => e.dataset.fm));
  await page.evaluate(() => abrirFarmacos());
  await page.waitForSelector('#farmOverlay.open');
  const guia = await page.$$eval('#farmCuerpo [data-familia]', els => els.map(e => e.dataset.familia));
  r.sinChipGuia = await page.$$eval('#farmCuerpo [data-filtro-farmaco]', els => els.length === 0);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  r.chips = chips.length > 0 && JSON.stringify(chips) === JSON.stringify(guia.filter(id => id !== 'antitromboticos'));
  r.acSinMarcar = (await page.textContent('#fmNotaAC')).includes('sin marcar');
  r.verGuiaOculto = await page.$eval('#fmVerGuia', e => e.hidden);
  await page.click(`${C} [data-fm="aine"]`);
  r.aine = await page.evaluate(() => JSON.stringify(state.farmacos.toma) === '["aine"]')
    && await page.getAttribute(`${C} [data-fm="aine"]`, 'aria-pressed') === 'true';
  r.verGuia = !(await page.$eval('#fmVerGuia', e => e.hidden));
  // Anticoagulado marcado: la línea lo dice
  await page.click('#acEstado .option-btn[data-valor="toma"]');
  await page.click('[data-ac-toma="as"]');
  r.acMarcada = (await page.textContent('#fmNotaAC')).includes('marcada: aspirina');
  // Corticoides del lupus: marcado desde su tarjeta, no se desmarca aquí ni entra en `fm`
  await page.evaluate(() => { selectLESEstado('diagnosticado'); selectLESFila('corticoides', 'm'); });
  r.corticoidesLupus = await page.getAttribute(`${C} [data-fm="corticoides"]`, 'aria-pressed') === 'true'
    && (await page.textContent(`${C} [data-fm="corticoides"]`)).includes('tarjeta Lupus');
  // Bifosfonato o denosumab en la tarjeta de osteoporosis: el chip del hueso, marcado desde allí
  r.sinPendientes = await page.$eval('#fmPendientes', e => e.hidden && !e.textContent.trim());
  r.huesoSinMarcar = await page.getAttribute(`${C} [data-fm="hueso"]`, 'aria-pressed') === 'false';
  await page.evaluate(() => { selectOPEstado('diagnosticada'); selectOPFila('tratamiento', 'antirresortivo'); });
  r.huesoOsteoporosis = await page.getAttribute(`${C} [data-fm="hueso"]`, 'aria-pressed') === 'true'
    && (await page.textContent(`${C} [data-fm="hueso"]`)).includes('tarjeta Osteoporosis')
    && await page.evaluate(() => !state.farmacos.toma.includes('hueso'));
  await page.evaluate(() => { selectOPFila('tratamiento', 'antirresortivo'); selectOPEstado('diagnosticada'); });
  r.huesoQuitado = await page.getAttribute(`${C} [data-fm="hueso"]`, 'aria-pressed') === 'false';
  await page.click(`${C} [data-fm="corticoides"]`);
  r.soloLectura = await page.evaluate(() => !state.farmacos.toma.includes('corticoides'))
    && await page.getAttribute(`${C} [data-fm="corticoides"]`, 'aria-pressed') === 'true';
  // La medicación del formulario previo, como pista encima de la tarjeta
  await page.click('#fpDet_comun > summary');
  await page.waitForSelector('#fp_comun_medicacion');
  await page.fill('#fp_comun_medicacion', 'Ibuprofeno cuando duele');
  await page.waitForFunction(() => document.getElementById('fpPistas_farmacos')?.textContent.includes('Ibuprofeno cuando duele'), null, { timeout: 5000 }).catch(() => {});
  r.pista = (await page.textContent('#fpPistas_farmacos')).includes('Ibuprofeno cuando duele');
  r.pistaNoMarca = await page.evaluate(() => JSON.stringify(state.farmacos.toma) === '["aine"]');
  // La guía se abre en «Este paciente», con sus familias desplegadas; un segundo toque, todas
  await page.click('#fmVerGuia button');
  await page.waitForSelector('#farmOverlay.open');
  r.estePaciente = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('#farmCuerpo [data-familia]')].map(d => d.dataset.familia);
    const abiertas = [...document.querySelectorAll('#farmCuerpo [data-familia]')].every(d => d.open);
    const linea = document.querySelector('#farmCuerpo .farm-paciente')?.textContent || '';
    return JSON.stringify([...ids].sort()) === JSON.stringify(['aine', 'antitromboticos', 'corticoides'].sort()) && abiertas
      && linea.includes('Corticoides (tarjeta «Lupus (LES)»)');
  });
  await page.click('#farmCuerpo [data-filtro-farmaco]');
  r.todas = await page.evaluate(n => document.querySelectorAll('#farmCuerpo [data-familia]').length === n
    && document.querySelector('#farmCuerpo [data-filtro-farmaco]')?.getAttribute('aria-pressed') === 'false', guia.length);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  // 320 px: la tarjeta cabe
  await page.setViewportSize({ width: 320, height: 700 });
  await page.waitForTimeout(150);
  r.ancho = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  await page.setViewportSize({ width: 1280, height: 860 });
  // Recorrido: fase 5 con el recuadro y la fase 6 con los avisos
  await abrirApp(page);
  await page.click(`${C} [data-fm="aine"]`);
  await page.click(`${C} [data-fm="opioides"]`);
  await page.click(`${C} [data-fm="hueso"]`);
  await page.click(`${C} [data-fm="fluoroquinolonas"]`);
  await walkRegion(page, 'lumbar');
  r.fase5 = await page.evaluate(() => { const t = document.querySelector('#resultsContent .fm-fase5')?.textContent || '';
    return t.includes('AINE · Opioides') && t.includes('No le digas que deje ni cambie la medicación'); });
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.fase6 = await page.evaluate(() => { const t = document.getElementById('planContenido').textContent;
    return t.includes('Toma AINE: Deshidratación y calor') && t.includes('Toma opioides: Mareo, somnolencia y caídas')
      && t.includes('Toma fármacos que tocan el hueso: Pronto, con imagen del fémur')
      && t.includes('Toma o ha tomado fluoroquinolonas: Cuándo: puede empezar')
      && t.split('No le digas que deje ni cambie la medicación').length === 2; });
  // En el hub, la tarjeta y la guía funcionan (sin el atajo a la IA)
  const hub = await browser.newPage();
  try {
    const frame = await cargarEnHub(hub);
    r.hub = await frame.evaluate(() => {
      const b = document.querySelector('#cardFarmacos [data-fm="aine"]');
      b?.click();
      const ia = document.querySelector('#fmPendientes .farm-preguntar');
      return state.farmacos.toma.includes('aine') && (!ia || getComputedStyle(ia).display === 'none');
    });
  } finally { await hub.close(); }
  r.ok = Object.values(r).every(Boolean);
  return r;
}

// Trastorno mastocitario o anafilaxia (Fase P, docs/mastocitaria.md),
// rodilla. Fase 1: solo «Diagnosticado», las filas y las casillas, un segundo
// toque desmarca y «solo anafilaxia» oculta la pregunta de la anafilaxia.
// Fase 2: una derivación con 🩺, sin urgencias ni embudo, y la línea de la
// asociación en los bloques de hipermovilidad y disautonomía. 320 px: nada se
// sale. Quitar la marca quita el sistema. Después, un recorrido entero: la
// línea de la 4b, el recuadro de la fase 5 y el aviso y la red de la fase 6.
async function checkMastocitos(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
  const r = {};
  await page.fill('#motivoConsulta', 'Dolor de rodilla al subir escaleras');
  await page.click('#mecanismo .option-btn >> nth=1');
  await page.click('#cronologia .option-btn >> nth=0');
  r.nota = (await page.textContent('#maNota')).includes('Los síntomas crónicos');
  r.soloDiag = await page.$$eval('#maEstado .option-btn', els => els.length === 1 && els[0].dataset.valor === 'diagnosticado');
  r.filasOcultas = !(await page.isVisible('#maDiagWrap'));
  await page.click('#maEstado .option-btn[data-valor="diagnosticado"]');
  r.filasVisibles = await page.isVisible('#maDiagWrap');
  const fila = (k, v) => page.click(`[data-ma-fila="${k}"] .option-btn[data-valor="${v}"]`);
  await fila('tipo', 'otro');
  await fila('tipo', 'otro');
  r.segundoToque = await page.evaluate(() => state.mastocitos.tipo === '');
  await fila('tipo', 'soloAnafilaxia');
  r.anafilaxiaOculta = !(await page.isVisible('#maAnafilaxiaWrap'));
  await fila('tipo', 'mastocitosis');
  r.anafilaxiaVisible = await page.isVisible('#maAnafilaxiaWrap');
  await fila('anafilaxia', 'SI');
  await fila('autoinyector', 'NO');
  await page.click('[data-ma-desenc="calor"]');
  await page.click('[data-ma-desenc="roce"]');
  await page.fill('#maOtro', 'frutos secos');
  r.estado = await page.evaluate(() => JSON.stringify(state.mastocitos) === JSON.stringify({ estado: 'diagnosticado', tipo: 'mastocitosis', anafilaxia: 'SI', autoinyector: 'NO',
    desencadenantes: { calor: true, roce: true }, otro: 'frutos secos' }));
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('rodilla', this)"]`);
  await page.waitForTimeout(150);
  r.tab = await page.isVisible('#tab_transversal_mastocitos');
  await page.click('#tab_transversal_mastocitos');
  const P = '#panel_transversal_mastocitos';
  r.sinUrgNiEmbudo = await page.$$eval(`${P} .sq2-urg, ${P} [data-embudo]`, els => els.length) === 0;
  await page.click(`${P} #sq2_ma_d_episodios .sq-btn.si`);
  r.derivacion = await page.isVisible(`${P} #sq2_ma_d_episodios .sq2-deriv-msg`);
  r.payloadDv = await page.evaluate(async () => (await import('./app.js')).buildPhysiQPayload().dv.some(t => t.startsWith('Episodios nuevos o más graves')));
  r.sinUrgencia = !(await page.isVisible('#sistemicoAlert .urgencia-alert'));
  await page.click(`${P} #sq2_ma_d_episodios .sq-btn.no`);
  // La línea de la asociación (forma 1), con la hipermovilidad y la disautonomía en sospecha
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#hmEstado .option-btn[data-valor="sospecha"]');
  await page.click('#dsEstado .option-btn[data-valor="sospecha"]');
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  r.asociacion = await page.evaluate(() => ['#panel_transversal_hipermovilidad [data-hm-bloque]', '#panel_transversal_disautonomia [data-ds-bloque]']
    .every(sel => (document.querySelector(sel)?.textContent || '').includes('en 587 pacientes con esas etiquetas solo se confirmó en 1')));
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#hmEstado .option-btn[data-valor="sospecha"]');
  await page.click('#dsEstado .option-btn[data-valor="sospecha"]');
  // 320 px: la tarjeta y el acordeón, sin desbordar
  await page.setViewportSize({ width: 320, height: 700 });
  // Justo tras cambiar el ancho, la barra de frases rápidas desborda un momento
  // (405 px) hasta recolocarse: esperar a que se asiente, no un tiempo fijo
  // (con 100 ms fallaba de forma intermitente, 2026-10)
  r.ancho1 = await page.waitForFunction(() => document.documentElement.scrollWidth <= 320, null, { timeout: 2000 }).then(() => true, () => false);
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  await page.click('#acc_transversal_mastocitos .sistema-accordion-header');
  await page.waitForTimeout(150);
  r.ancho2 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  // Quitar la marca quita el sistema
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#maEstado .option-btn[data-valor="diagnosticado"]');
  r.sinSistema = await page.evaluate(() => !document.getElementById('acc_transversal_mastocitos') && !document.getElementById('tab_transversal_mastocitos') && !document.body.classList.contains('mastocitos'));
  // Recorrido entero con mastocitosis y sin autoinyector: 4b, fase 5 y fase 6
  await abrirApp(page);
  await page.click('#maEstado .option-btn[data-valor="diagnosticado"]');
  await page.click('[data-ma-fila="tipo"] .option-btn[data-valor="mastocitosis"]');
  await page.click('[data-ma-fila="autoinyector"] .option-btn[data-valor="sinReceta"]');
  await walkRegion(page, 'rodilla');
  r.fase5 = await page.evaluate(() => { const t = document.querySelector('#resultsContent .ma-fase5')?.textContent || '';
    return t.includes('llama al 112') && t.includes('si no puede, ayúdale') && t.includes('desmayo vasovagal') && t.includes('Tiene más riesgo de anafilaxia')
      && t.includes('En la mastocitosis') && t.includes('las guías indican llevar autoinyector') && t.includes('protocolo escrito'); });
  r.fase5Cita = await page.evaluate(() => !!document.querySelector('#resultsContent .ma-fase5 .cita[data-cita^="RCUK 2021"]'));
  await page.evaluate(() => goToPhase('4b'));
  await page.waitForTimeout(200);
  r.nota4b = await page.isVisible('#hypothesisCards .ma-nota-4b');
  await page.evaluate(() => goToPhase(5));
  await page.waitForTimeout(150);
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.fase6 = await page.evaluate(() => { const t = document.getElementById('planContenido').textContent;
    return t.includes('Trastorno mastocitario o anafilaxia: que traiga su autoinyector') && t.includes('Red de seguridad (trastorno mastocitario o anafilaxia)'); });
  r.ok = r.nota && r.soloDiag && r.filasOcultas && r.filasVisibles && r.segundoToque && r.anafilaxiaOculta && r.anafilaxiaVisible && r.estado
    && r.tab && r.sinUrgNiEmbudo && r.derivacion && r.payloadDv && r.sinUrgencia && r.asociacion && r.ancho1 && r.ancho2 && r.sinSistema
    && r.fase5 && r.fase5Cita && r.nota4b && r.fase6;
  return r;
}

// Osteoporosis o fragilidad ósea (Fase P, docs/osteoporosis.md), lumbar.
// Fase 1: «Diagnosticada» abre las filas, «alguna reciente» solo con fractura
// vertebral, y los corticoides sin tratamiento piden la derivación. Fase 2: la
// urgencia sin plegar, una derivación con 🩺, el bloque de caídas y, con
// «Sospecha», los factores con la regla de los 50 años. 320 px: nada se sale.
// Después, un recorrido entero: la línea de la 4b, el recuadro de la fase 5,
// el plan de la fase 6 y la fila del panel de tiempos.
async function checkOsteoporosis(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
  const r = {};
  await page.fill('#motivoConsulta', 'Dolor dorsal desde el parto');
  await page.click('#mecanismo .option-btn >> nth=1');
  await page.click('#cronologia .option-btn >> nth=0');
  r.nota = (await page.textContent('#opNota')).includes('Márcala si');
  r.filasOcultas = !(await page.isVisible('#opDiagWrap'));
  await page.click('#opEstado .option-btn[data-valor="diagnosticada"]');
  r.filasVisibles = await page.isVisible('#opDiagWrap');
  const fila = (k, v) => page.click(`[data-op-fila="${k}"] .option-btn[data-valor="${v}"]`);
  r.recienteOculta = !(await page.isVisible('#opRecienteWrap'));
  await fila('vertebrales', '1');
  r.recienteVisible = await page.isVisible('#opRecienteWrap');
  r.sinCasillasNativas = await page.$$eval('#cardOsteoporosis input[type="checkbox"]', els => els.length === 0);
  await page.click('[data-op-casilla="reciente"]');
  await fila('causa', 'plo');
  await fila('causa', 'plo');
  r.segundoToque = await page.evaluate(() => state.osteoporosis.causa === '');
  await fila('causa', 'plo');
  await fila('tratamiento', 'no');
  await fila('corticoides', 'a');
  r.derivCorticoides = (await page.textContent('#opDerivCorticoides')).includes('que su médico valore la protección ósea');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('lumbar', this)"]`);
  await page.waitForTimeout(150);
  r.tab = await page.isVisible('#tab_transversal_osteoporosis');
  await page.click('#tab_transversal_osteoporosis');
  const P = '#panel_transversal_osteoporosis';
  r.urgencia = await page.isVisible(`${P} #sq2_op_u_medula.sq2-urg`);
  r.sinEmbudo = await page.$$eval(`${P} [data-embudo]`, els => els.length) === 0;
  r.sinTalla = !(await page.$(`${P} #sq2_op_d_talla`));
  await page.click(`${P} #sq2_op_d_fractura .sq-btn.si`);
  r.derivacion = await page.isVisible(`${P} #sq2_op_d_fractura .sq2-deriv-msg`);
  r.payloadDv = await page.evaluate(async () => { const dv = (await import('./app.js')).buildPhysiQPayload().dv;
    return dv.some(t => t.startsWith('Posible fractura vertebral nueva')) && dv.some(t => t.startsWith('Corticoides de 7,5 mg/día')); });
  await page.click(`${P} #sq2_op_d_fractura .sq-btn.no`);
  await page.click(`${P} [data-op-caidas] .option-btn >> text="2 o más"`);
  r.caidas = (await page.textContent(`${P} [data-op-bloque]`)).includes('Riesgo alto de caídas');
  r.caidasCasillas = await page.$$eval(`${P} [data-op-bloque] [data-op-caida]`, els => els.length === 4);
  await page.click(`${P} [data-op-caida="suelo"]`);
  r.caidaChip = await page.evaluate(() => state.osteoporosis.caidas.suelo === true
    && document.querySelector('#panel_transversal_osteoporosis [data-op-caida="suelo"]').getAttribute('aria-pressed') === 'true');
  // «Sospecha»: los factores, con la edad de la fase 1
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#opEstado .option-btn[data-valor="sospecha"]');
  await page.fill('#edadPaciente', '67');
  await page.dispatchEvent('#edadPaciente', 'input');
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  await page.click('#tab_transversal_osteoporosis');
  r.factores = await page.$$eval(`${P} .op-factor`, els => els.length === 6);
  await page.click(`${P} .op-factor >> nth=1 >> .sq-btn.si`);
  r.sospecha = (await page.textContent(`${P} [data-op-bloque]`)).includes('Que su médico valore el riesgo de fractura');
  r.informeSinPalabra = await page.evaluate(async () => !/osteoporosis/i.test((await import('./app.js')).buildInformeFisioterapiaText()));
  // 320 px: la tarjeta y el acordeón, sin desbordar
  await page.setViewportSize({ width: 320, height: 700 });
  await page.waitForTimeout(100);
  await page.click('#acc_transversal_osteoporosis .sistema-accordion-header');
  await page.waitForTimeout(150);
  r.ancho2 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#opEstado .option-btn[data-valor="diagnosticada"]');
  r.ancho1 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  // Quitar la marca quita el sistema
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.click('#opEstado .option-btn[data-valor="diagnosticada"]');
  r.sinSistema = await page.evaluate(() => !document.getElementById('acc_transversal_osteoporosis') && !document.body.classList.contains('osteoporosis'));
  // Recorrido entero con una fractura vertebral: 4b, fase 5, fase 6 y panel de tiempos
  await abrirApp(page);
  await page.click('#opEstado .option-btn[data-valor="diagnosticada"]');
  await page.click('[data-op-fila="vertebrales"] .option-btn[data-valor="1"]');
  await page.click('[data-op-fila="causa"] .option-btn[data-valor="plo"]');
  await walkRegion(page, 'lumbar');
  r.fase5 = await page.evaluate(() => { const t = document.querySelector('#resultsContent .op-fase5')?.textContent || '';
    return t.includes('Fuerza progresiva') && t.includes('impacto solo hasta caminar') && t.includes('Sin manipulación forzada')
      && t.includes('Osteoporosis del embarazo o la lactancia'); });
  r.fase5Cita = await page.evaluate(() => !!document.querySelector('#resultsContent .op-fase5 .cita[data-cita^="Brooke-Wavell 2022"]'));
  // Enlace a la guía de efectos del ejercicio (docs/efectos-ejercicio.md)
  r.enlaceEjercicio = !!(await page.$('#resultsContent .op-fase5 [data-bloque-condicion="mecanotransduccion"] button'));
  if (r.enlaceEjercicio) {
    await page.click('#resultsContent .op-fase5 [data-bloque-condicion="mecanotransduccion"] button');
    await page.waitForSelector('#ejercicioOverlay.open');
    r.enlaceEjercicio = await page.evaluate(() => document.querySelector('#ejercicioCuerpo [data-bloque="mecanotransduccion"]')?.open === true);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.getElementById('ejercicioOverlay').classList.contains('open'));
  }
  await page.evaluate(() => goToPhase('4b'));
  await page.waitForTimeout(200);
  r.nota4b = await page.evaluate(async () => {
    const { HYPOTHESES } = await import('./data.js');
    const esperado = state.activeHypotheses.some(h => HYPOTHESES[h]?.tests.some(t => t.cargaOsea));
    const n = document.querySelectorAll('#hypothesisCards .op-aviso-test').length;
    return esperado ? n > 0 && !!document.querySelector('#hypothesisCards .op-aviso-test .op-razon') : n === 0;
  });
  r.activas = await page.evaluate(() => state.activeHypotheses.join());
  await page.evaluate(() => goToPhase(5));
  await page.waitForTimeout(150);
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.fase6 = await page.evaluate(() => { const t = document.getElementById('planContenido').textContent;
    return t.includes('Osteoporosis: fuerza progresiva') && t.includes('sin manipulación con thrust') && t.includes('Red de seguridad (osteoporosis)'); });
  await page.click('#tejidosBtn');
  await page.waitForSelector('#tejidosOverlay.open');
  r.tejidos = await page.evaluate(() => { const t = document.getElementById('tejidosCuerpo').textContent;
    return t.includes('Según la tarjeta «Osteoporosis o fragilidad ósea»: fractura vertebral.') && t.includes('el dolor puede durar mucho más'); });
  r.ok = r.nota && r.filasOcultas && r.filasVisibles && r.recienteOculta && r.recienteVisible && r.sinCasillasNativas && r.segundoToque && r.derivCorticoides
    && r.tab && r.urgencia && r.sinEmbudo && r.sinTalla && r.derivacion && r.payloadDv && r.caidas && r.caidasCasillas && r.caidaChip
    && r.factores && r.sospecha && r.informeSinPalabra && r.ancho1 && r.ancho2 && r.sinSistema
    && r.fase5 && r.fase5Cita && r.enlaceEjercicio && r.nota4b && r.fase6 && r.tejidos;
  return r;
}

// Embarazo o posparto (Fase P, docs/embarazo-posparto.md), lumbar.
// Fase 1: «Embarazada» con las semanas; la tensión de 165/100 pide valoración
// el mismo día; con sexo «Hombre» la tarjeta se pliega. Fase 2: las preguntas
// cambian con las semanas, urgencias sin plegar, ánimo y suelo pélvico.
// 320 px: nada se sale. Después, un recorrido entero: la línea del supino en
// la 4b, el recuadro de la fase 5 y el plan de la fase 6; y el posparto, con
// la línea del Gaenslen.
async function checkEmbarazo(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
  const r = {};
  await page.fill('#motivoConsulta', 'Dolor lumbar en el embarazo');
  await page.click('#mecanismo .option-btn >> nth=1');
  await page.click('#cronologia .option-btn >> nth=0');
  r.nota = (await page.textContent('#emNota')).includes('Márcala si');
  // Con sexo «Hombre», plegada en una línea con «Mostrar»
  await page.click('#sexo .option-btn >> text="Hombre"');
  r.plegada = await page.isVisible('#emHombre') && !(await page.isVisible('#emEstado'));
  await page.click('#emHombre button');
  r.mostrar = await page.isVisible('#emEstado');
  await page.click('#sexo .option-btn >> text="Mujer"');
  r.camposOcultos = !(await page.isVisible('#emEmbWrap')) && !(await page.isVisible('#emPpWrap'));
  await page.click('#emEstado .option-btn[data-valor="embarazada"]');
  r.embWrap = await page.isVisible('#emEmbWrap') && !(await page.isVisible('#emPpWrap'));
  r.sinSemanas = (await page.textContent('#emSinSemanas')).includes('Anota las semanas');
  await page.fill('#emSemanas', '14');
  await page.dispatchEvent('#emSemanas', 'input');
  r.sinCasillasNativas = await page.$$eval('#cardEmbarazo input[type="checkbox"]', els => els.length === 0);
  // Tensión 165/100 (la regla se pinta al salir del campo)
  await page.fill('#vitalTas', '165'); await page.dispatchEvent('#vitalTas', 'input'); await page.dispatchEvent('#vitalTas', 'blur');
  await page.fill('#vitalTad', '100'); await page.dispatchEvent('#vitalTad', 'input'); await page.dispatchEvent('#vitalTad', 'blur');
  r.ta = (await page.textContent('#emTA')).includes('valoración el mismo día');
  r.taUr = await page.evaluate(async () => (await import('./app.js')).buildPhysiQPayload().ur.some(t => t.startsWith('Tensión de 160/110')));
  await page.fill('#vitalTas', ''); await page.dispatchEvent('#vitalTas', 'input'); await page.dispatchEvent('#vitalTas', 'blur');
  await page.fill('#vitalTad', ''); await page.dispatchEvent('#vitalTad', 'input'); await page.dispatchEvent('#vitalTad', 'blur');
  r.taQuitada = (await page.textContent('#emTA')).trim() === '';
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('lumbar', this)"]`);
  await page.waitForTimeout(150);
  r.tab = await page.isVisible('#tab_transversal_embarazo');
  await page.click('#tab_transversal_embarazo');
  const P = '#panel_transversal_embarazo';
  r.semana14 = !(await page.$(`${P} #sq2_em_u_preeclampsia`)) && !!(await page.$(`${P} #sq2_em_u_sangrado.sq2-urg`));
  r.sinEmbudo = await page.$$eval(`${P} [data-embudo]`, els => els.length) === 0;
  // A las 30 semanas, la preeclampsia y los movimientos
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.fill('#emSemanas', '30');
  await page.dispatchEvent('#emSemanas', 'input');
  await page.evaluate(() => goToPhase(2));
  await page.waitForTimeout(150);
  await page.click('#tab_transversal_embarazo');
  r.semana30 = !!(await page.$(`${P} #sq2_em_u_preeclampsia.sq2-urg`)) && !!(await page.$(`${P} #sq2_em_u_movimientos.sq2-urg`));
  await page.click(`${P} #sq2_em_u_tev .sq-btn.si`);
  r.urgencia = await page.evaluate(async () => (await import('./app.js')).buildPhysiQPayload().ur.some(t => t.startsWith('Posible trombosis o embolia')));
  await page.click(`${P} #sq2_em_u_tev .sq-btn.no`);
  await page.click(`${P} .em-animo >> nth=0 >> .sq-btn.si`);
  r.animo = (await page.textContent(`${P} [data-em-bloque]`)).includes('el PHQ-9 de la calculadora');
  r.animoFuera = await page.evaluate(async () => { const m = await import('./app.js'); const p = m.buildPhysiQPayload();
    return !JSON.stringify(p).includes('decaída') && !m.buildInformeFisioterapiaText().includes('decaída'); });
  await page.click(`${P} .em-suelo >> nth=0 >> .sq-btn.si`);
  r.suelo = (await page.textContent(`${P} [data-em-bloque]`)).includes('programa supervisado de al menos 3 meses');
  // 320 px: el acordeón y la tarjeta, sin desbordar
  await page.setViewportSize({ width: 320, height: 700 });
  await page.waitForTimeout(100);
  await page.click('#acc_transversal_embarazo .sistema-accordion-header');
  await page.waitForTimeout(150);
  r.ancho2 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  await page.evaluate(() => goToPhase(1));
  await page.waitForTimeout(150);
  await page.click('#emEstado .option-btn[data-valor="posparto"]');
  r.ppWrap = await page.isVisible('#emPpWrap');
  r.ancho1 = await page.evaluate(() => document.documentElement.scrollWidth <= 320);
  // Quitar la marca quita el sistema
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.click('#emEstado .option-btn[data-valor="posparto"]');
  r.sinSistema = await page.evaluate(() => !document.getElementById('acc_transversal_embarazo') && !document.body.classList.contains('embarazo'));
  // Recorrido entero, embarazada de 30 semanas: 4b, fase 5 y fase 6
  await abrirApp(page);
  await page.click('#emEstado .option-btn[data-valor="embarazada"]');
  await page.fill('#emSemanas', '30');
  await page.dispatchEvent('#emSemanas', 'input');
  await walkRegion(page, 'lumbar');
  r.fase5 = await page.evaluate(() => { const t = document.querySelector('#resultsContent .em-fase5')?.textContent || '';
    return t.includes('150 min por semana') && t.includes('Parar el ejercicio y consultar') && t.includes('no basta para decir que sea seguro'); });
  r.fase5Cita = await page.evaluate(() => !!document.querySelector('#resultsContent .em-fase5 .cita[data-cita^="Mottola 2018"]'));
  // Enlace a la guía de efectos del ejercicio, bloque 8 (docs/efectos-ejercicio.md)
  r.enlaceEjercicio = !!(await page.$('#resultsContent .em-fase5 [data-bloque-condicion="embarazo"] button'));
  if (r.enlaceEjercicio) {
    await page.click('#resultsContent .em-fase5 [data-bloque-condicion="embarazo"] button');
    await page.waitForSelector('#ejercicioOverlay.open');
    r.enlaceEjercicio = await page.evaluate(() => document.querySelector('#ejercicioCuerpo [data-bloque="embarazo"]')?.open === true);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.getElementById('ejercicioOverlay').classList.contains('open'));
  }
  await page.evaluate(() => goToPhase('4b'));
  await page.waitForTimeout(200);
  r.nota4b = await page.evaluate(() => (document.querySelector('#hypothesisCards .em-nota-4b')?.textContent || '').includes('no la dejes mucho rato boca arriba'));
  await page.evaluate(() => goToPhase(5));
  await page.waitForTimeout(150);
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.fase6 = await page.evaluate(() => { const t = document.getElementById('planContenido').textContent;
    return t.includes('Embarazo: actividad de intensidad moderada') && t.includes('Red de seguridad (embarazo)'); });
  r.fase6Ejercicio = await page.evaluate(() => !!document.querySelector('#planSesion .plan-ejercicio [data-bloque-extra="embarazo"]')
    && document.querySelector('#planSesion .plan-ejercicio').textContent.includes('Por el embarazo o el posparto'));
  // Posparto de 2 semanas con la sacroilíaca: línea del Gaenslen en la 4b y de Vleeming en la fase 5
  await abrirApp(page);
  await page.click('#emEstado .option-btn[data-valor="posparto"]');
  await page.fill('#emSemanasPp', '2');
  await page.dispatchEvent('#emSemanasPp', 'input');
  await page.evaluate(() => { state.activeHypotheses = ['lu8']; });
  await page.evaluate(() => goToPhase('4b'));
  await page.waitForTimeout(200);
  r.gaenslen = await page.evaluate(() => [...document.querySelectorAll('#hypothesisCards .em-aviso-test')].some(e => e.textContent.includes('no hagas el Gaenslen')));
  r.ok = r.nota && r.plegada && r.mostrar && r.camposOcultos && r.embWrap && r.sinSemanas && r.sinCasillasNativas && r.ta && r.taUr && r.taQuitada
    && r.tab && r.semana14 && r.sinEmbudo && r.semana30 && r.urgencia && r.animo && r.animoFuera && r.suelo && r.ancho2 && r.ppWrap && r.ancho1
    && r.sinSistema && r.fase5 && r.fase5Cita && r.enlaceEjercicio && r.nota4b && r.fase6 && r.fase6Ejercicio && r.gaenslen;
  return r;
}

// Reloj de la prueba de bipedestación (docs/pots.md, «Reloj»): reloj del
// navegador simulado (page.clock), pitidos y vibración contados.
async function checkDsReloj(page) {
  await page.addInitScript(() => {
    window.__pitidos = 0; window.__vibra = 0; window.__wake = 0;
    const AC = window.AudioContext;
    if (AC) { const o = AC.prototype.createOscillator; AC.prototype.createOscillator = function () { window.__pitidos++; return o.call(this); }; }
    navigator.vibrate = () => { window.__vibra++; return true; };
    Object.defineProperty(navigator, 'wakeLock', { value: { request: async () => { window.__wake++; return { release: async () => {} }; } } });
  });
  await page.clock.install({ time: new Date('2026-10-17T10:00:00') });
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
  const r = {};
  await page.fill('#edadPaciente', '24');
  await page.dispatchEvent('#edadPaciente', 'input');
  await page.click('#dsEstado .option-btn[data-valor="sospecha"]');
  await page.evaluate(() => goToPhase(2));
  await page.click(`[onclick="selectRegion('lumbar', this)"]`);
  await page.click('#tab_transversal_disautonomia');
  const P = '#panel_transversal_disautonomia', A = '#acc_transversal_disautonomia';
  await page.click(`${P} button:has-text("Hacer la prueba de bipedestación")`);
  const reloj = () => page.evaluate(p => document.querySelector(`${p} [data-ds-reloj]`).textContent.replace(/\s+/g, ' ').trim(), P);
  const toca = sel => page.evaluate(sel => [...document.querySelectorAll(sel)].filter(e => e.classList.contains('ds-fila-toca')).map(e => e.dataset.dsEt || `${e.dataset.dsFila}.${e.dataset.dsCampo}`), sel);
  const pitidos = () => page.evaluate(() => window.__pitidos);
  r.botones = (await reloj()).includes('Empezar reposo tumbado (5 min)') && (await reloj()).includes('Se pone de pie');
  // Reposo
  await page.click(`${P} button:has-text("Empezar reposo tumbado")`);
  r.wake = await page.evaluate(() => window.__wake) === 1;
  await page.clock.runFor(125_000);
  r.reposo = (await reloj()).includes('2:05') && (await reloj()).includes('quedan 2:55');
  r.sinPitidoAntes = await pitidos() === 0;
  await page.clock.runFor(175_000);
  r.reposoCumplido = (await reloj()).includes('Reposo cumplido') && (await toca(`${P} [data-ds-et]`)).join() === 'tumbado';
  r.pitidoReposo = await pitidos() === 1 && await page.evaluate(() => window.__vibra) === 1;
  // De pie
  await page.click(`${P} .ds-reloj button:has-text("Se pone de pie")`);
  r.pie0 = (await reloj()).includes('0:00') && (await reloj()).includes('Siguiente: 1 min en 1:00');
  await page.clock.runFor(60_000);
  r.min1 = (await reloj()).includes('Ahora: medida de 1 min') && (await reloj()).includes('Siguiente: 3 min en 2:00');
  // Cada segundo cambian los textos, no los botones (un toque no se pierde)
  const parar = await page.$(`${P} .ds-reloj-btn`);
  await page.clock.runFor(3_000);
  r.botonEstable = await parar.evaluate(b => b.isConnected);
  r.filaM1 = (await toca(`${P} .ds-tabla > *`)).sort().join() === 'm1,m1.fc,m1.tad,m1.tas'
    && (await toca(`${A} [data-ds-et]`)).join() === 'm1';
  r.pitidoM1 = await pitidos() === 2;
  await page.clock.runFor(12_000);
  await page.fill(`${P} [data-ds-fila="m1"][data-ds-campo="fc"]`, '95');
  await page.clock.runFor(145_000);   // 3:40
  await page.fill(`${P} [data-ds-fila="m3"][data-ds-campo="fc"]`, '102');
  const etiqueta = (c, f) => page.evaluate(([c, f]) => document.querySelector(`${c} [data-ds-et="${f}"]`).textContent, [c, f]);
  r.tomaTarde = (await etiqueta(P, 'm3')).includes('toma a las 3:40') && (await etiqueta(A, 'm3')).includes('toma a las 3:40');
  r.tomaATiempo = !(await etiqueta(P, 'm1')).includes('toma');
  r.foco = await page.evaluate(p => document.activeElement === document.querySelector(`${p} [data-ds-fila="m3"][data-ds-campo="fc"]`), P);
  // La pantalla apagada no desajusta: el tiempo sale de la hora de inicio
  await page.clock.runFor(420_000);    // 10:40
  r.pitidos5 = await pitidos() === 6;
  await page.clock.runFor(30_000);     // 11:10
  r.terminada = (await reloj()).includes('Prueba terminada: 10 min de pie') && (await toca(`${P} [data-ds-et]`)).length === 0;
  await page.clock.runFor(120_000);
  r.sinMasPitidos = await pitidos() === 6;
  // El reloj no entra en el payload
  r.payload = await page.evaluate(async () => { const d = (await import('./app.js')).buildPhysiQPayload(); return !JSON.stringify(d).includes('reloj') && !JSON.stringify(d).includes('tomas'); });
  await page.click(`${P} button:has-text("Cerrar el reloj")`);
  r.cerrado = (await reloj()).includes('Empezar reposo tumbado') && await page.evaluate(() => state.disautonomia.bipedestacion.reloj === null)
    && await page.evaluate(p => document.querySelector(`${p} [data-ds-fila="m1"][data-ds-campo="fc"]`).value === '95', P);
  // «Parar» a media prueba
  await page.click(`${P} .ds-reloj button:has-text("Se pone de pie")`);
  await page.clock.runFor(30_000);
  await page.click(`${P} button:has-text("Parar")`);
  await page.clock.runFor(60_000);
  r.parar = await pitidos() === 6 && (await reloj()).includes('Empezar reposo tumbado');
  // 320 px: el reloj cabe en el acordeón
  await page.click(`${P} .ds-reloj button:has-text("Se pone de pie")`);
  await page.setViewportSize({ width: 320, height: 700 });
  await page.click(`${A} .sistema-accordion-header`);
  await page.clock.runFor(1_000);
  r.ancho = await page.evaluate(a => document.documentElement.scrollWidth <= 320
    && [...document.querySelectorAll(`${a} .ds-reloj-btn`)].every(b => b.getBoundingClientRect().right <= 320 && b.getBoundingClientRect().height >= 44), A);
  r.ok = Object.entries(r).every(([, v]) => v === true);
  return r;
}

async function checkDerivacionVascular(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
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

// Derivación del cribado (`derivacion` en una pregunta de la fase 2; quiste de
// Tarlov, l_u5, docs/tarlov.md): «¿Por qué?» y «Ampliar» con su fisiología;
// el mensaje 🩺 solo con SÍ; el aviso de la fase 2 dice «Derivación médica»
// sin el genérico «no exige derivación automática»; l6 sigue siendo urgencia;
// llega a la fase 5 como derivación pendiente.
async function checkDerivacionCribado(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
  await irAFase2(page, 'lumbar');
  await page.click('#tab_l_urogenital');
  const fila = '#panel_l_urogenital #sq2_l_u5';
  const r = {};
  r.urgL6 = await page.locator('#panel_l_urogenital #sq2_l6').evaluate(el => el.classList.contains('sq2-urg'));
  r.sinUrg = await page.locator(fila).evaluate(el => !el.classList.contains('sq2-urg'));
  r.msgOculto = !(await page.isVisible(`${fila} .sq2-deriv-msg`));
  await page.click(`${fila} summary`);
  r.porque = await page.locator(`${fila} .razon`).evaluate(d => d.open && /Por qué/i.test(d.textContent) && /Cuánto pesa/i.test(d.textContent));
  await page.click(`${fila} .razon-ampliar`);
  await page.waitForTimeout(200);
  r.ampliar = await page.evaluate(() => document.getElementById('razonPanel').classList.contains('open')
    && /Fisiología/i.test(document.getElementById('razonContenido').textContent)
    && /Hulens 2018/.test(document.getElementById('razonContenido').textContent));
  await page.keyboard.press('Escape');
  await page.click(`${fila} .sq-btn.si`);
  await page.waitForTimeout(150);
  r.msgVisible = await page.isVisible(`${fila} .sq2-deriv-msg`);
  r.aviso = await page.evaluate(() => {
    const t = document.getElementById('sistemicoAlert').textContent;
    return /Derivación médica/.test(t) && /quiste de Tarlov/.test(t) && !/watchful/.test(t) && !/Derivación urgente/.test(t);
  });
  await page.click('#btnContinuarSinss');
  await page.waitForTimeout(150);
  await page.click('#phase3 .nrs-btn >> nth=4');
  await page.fill('#signoComparable', 'Sedestación');
  await page.click('#phase3 .btn-primary:has-text("Algoritmo CIF")');
  await page.waitForTimeout(150);
  await walkCifTreeToCompletion(page);
  await page.click('#btnGoConfirm');
  await page.waitForTimeout(150);
  await page.click('#phase4b button:has-text("Ver Resultados")');
  await page.waitForTimeout(150);
  r.fase5 = await page.evaluate(() => {
    const t = document.getElementById('resultsContent')?.textContent || '';
    return t.includes('Derivación médica pendiente') && t.includes('quiste de Tarlov');
  });
  r.ok = Object.values(r).every(Boolean);
  return r;
}

// Modo guía (docs/modo-guia.md): el selector «Cómo se registra» de la fase 1, la
// frase para decir en voz alta en lugar de la caja de texto, el teclado numérico
// propio y, sobre todo, que el cribado no venga en NO (decisión 3): la fase 5
// abre con lo no preguntado, urgencias y banderas rojas en rojo, el resto aparte.
async function checkModoGuia(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await abrirApp(page);
  const r = {};
  await page.click('#registroConsulta .option-btn:has-text("Grabadora")');
  r.cuerpo = await page.evaluate(() => document.body.classList.contains('modo-guia') && state.registro === 'guia');
  r.nombreAuto = await page.evaluate(() => /^Paciente \d\d\/\d\d \d\d:\d\d$/.test(state.patient) && document.getElementById('patientName').value === state.patient);
  r.verbal = await page.evaluate(() => {
    const campo = document.getElementById('motivoConsulta');
    const v = document.querySelector('[data-verbal="motivoConsulta"]');
    return campo.offsetParent === null && !!v && v.offsetParent !== null && /Qué te trae/.test(v.textContent);
  });
  await page.click('[data-verbal="motivoConsulta"] .verbal-check');
  r.preguntado = await page.evaluate(() => state.preguntado.motivoConsulta === true
    && document.querySelector('[data-verbal="motivoConsulta"] .verbal-check').getAttribute('aria-pressed') === 'true');
  await page.click('#fpDet_comun summary');
  await page.waitForSelector('#fpBody_comun .verbal');
  r.formulario = await page.evaluate(() => {
    const t = document.getElementById('fpBody_comun').textContent;
    return /¿Desde cuándo te pasa\?/.test(t) && /¿Qué medicación tomas ahora\?/.test(t) && !/Medicación que toma ahora/.test(t)
      && document.querySelectorAll('#fpBody_comun textarea').length === 0;
  });
  // «Sí» en el desencadenante abre su detalle: también como frase, no como caja
  await page.click('#fpBody_comun .fp-opts button:has-text("Sí") >> nth=0');
  r.detalle = await page.evaluate(() => /¿Qué fue lo que lo desencadenó\?/.test(document.getElementById('fpBody_comun').textContent)
    && document.querySelectorAll('#fpBody_comun textarea').length === 0);
  await page.click('#fpDet_comun summary');
  r.sinTecladoSistema = await page.evaluate(() => document.getElementById('edadPaciente').getAttribute('inputmode') === 'none');
  await page.click('#edadPaciente');
  await page.waitForSelector('#tecladoOverlay.open');
  await page.click('#tecladoTeclas [data-tecla="4"]');
  await page.click('#tecladoTeclas [data-tecla="5"]');
  r.tecladoValor = await page.evaluate(() => document.getElementById('tecladoValor').textContent === '45' && state.edadPaciente === 45);
  await page.click('#tecladoListo');
  r.tecladoCierra = await page.evaluate(() => !document.getElementById('tecladoOverlay').classList.contains('open')
    && document.getElementById('edadPaciente').value === '45');
  r.bandera = await page.evaluate(() => document.querySelectorAll('#banderasRojas .sq-btn.selected').length === 0
    && Object.values(state.banderasRojas).every(v => v === ''));
  // (sin irAFase2: rellena #motivoConsulta, que en modo guía está oculto)
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.click('#mecanismo .option-btn >> nth=0');
  await page.click('#cronologia .option-btn >> nth=0');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);
  await page.click(`[onclick="selectRegion('lumbar', this)"]`);
  await page.waitForTimeout(200);
  r.sinNOmarcado = await page.evaluate(() => document.querySelectorAll('#sistemaPanels .sq2 .sq-btn.selected').length === 0
    && document.querySelectorAll('#sistemaPanels .sq2').length > 0);
  r.estadoVacio = await page.evaluate(() => Object.keys(state.sistemicoAnswers).length === 0);
  await page.click('#tab_l_urogenital');
  await page.click('#panel_l_urogenital #sq2_l6 .sq-btn.no');
  r.noMarcado = await page.evaluate(() => state.sistemicoAnswers.l6 === 'NO'
    && document.querySelector('#panel_l_urogenital #sq2_l6 .sq-btn.no').classList.contains('selected'));
  await page.click('#btnContinuarSinss');
  await page.waitForTimeout(150);
  r.signoVerbal = await page.evaluate(() => document.getElementById('signoComparable').offsetParent === null
    && /Flexión de hombro/.test(document.querySelector('[data-verbal="signoComparable"]')?.textContent || ''));
  await page.click('#phase3 .btn-primary:has-text("Algoritmo CIF")');
  await page.waitForTimeout(150);
  await walkCifTreeToCompletion(page);
  await page.click('#btnGoConfirm');
  await page.waitForTimeout(150);
  r.ancla = await page.evaluate(() => document.querySelectorAll('#phase4b .test-ancla').length > 0
    && /positivo/.test(document.querySelector('#phase4b .test-ancla').textContent));
  await page.click('#phase4b button:has-text("Ver Resultados")');
  await page.waitForTimeout(150);
  r.fase5 = await page.evaluate(() => {
    const c = document.getElementById('resultsContent');
    const urg = c?.querySelector('.no-preguntadas-urg');
    if (!urg || c.firstElementChild !== urg) return false;
    // l6 contestada: quedan 5 urgencias + 3 banderas rojas... (las 4, ninguna se tocó)
    return urg.querySelectorAll('li').length === 9 && !!c.querySelector('.no-preguntadas') && !urg.closest('details');
  });
  r.ok = Object.values(r).every(Boolean);
  return r;
}

// Cascanueces (l_u6) y MALS (bandera de pérdida de peso de l_gi),
// docs/mals-cascanueces.md: «¿Por qué?» y «Ampliar» con su fisiología, mensaje
// 🩺 solo con SÍ, aviso «Derivación médica» sin urgencia; el MALS solo está en
// el «Ampliar» de la bandera.
async function checkCascanueces(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
  await irAFase2(page, 'lumbar');
  await page.click('#tab_l_urogenital');
  const fila = '#panel_l_urogenital #sq2_l_u6';
  const r = {};
  r.sinUrg = await page.locator(fila).evaluate(el => !el.classList.contains('sq2-urg'));
  r.msgOculto = !(await page.isVisible(`${fila} .sq2-deriv-msg`));
  await page.click(`${fila} summary`);
  r.porque = await page.locator(`${fila} .razon`).evaluate(d => d.open && /Por qué/i.test(d.textContent) && /Cuánto pesa/i.test(d.textContent));
  await page.click(`${fila} .razon-ampliar`);
  await page.waitForSelector('#razonPanel.open');
  r.ampliar = await page.evaluate(() => {
    const t = document.getElementById('razonContenido').textContent;
    return /Fisiología/i.test(t) && /Penfold 2024/.test(t) && /Bruessel 2026/.test(t);
  });
  await page.keyboard.press('Escape');
  await page.click(`${fila} .sq-btn.si`);
  await page.waitForSelector(`${fila} .sq2-deriv-msg`, { state: 'visible' });
  r.msgVisible = true;
  r.aviso = await page.evaluate(() => {
    const t = document.getElementById('sistemicoAlert').textContent;
    return /Derivación médica/.test(t) && /cascanueces/.test(t) && !/Derivación urgente/.test(t);
  });
  await page.click('#tab_l_gi');
  const flag = page.locator('#panel_l_gi .flag-item', { hasText: 'Pérdida de peso inexplicada' });
  await flag.locator('.flag-porque').click();
  await flag.locator('.razon-ampliar').click();
  await page.waitForSelector('#razonPanel.open');
  r.mals = await page.evaluate(() => /arcuato medio/.test(document.getElementById('razonContenido').textContent));
  await page.keyboard.press('Escape');
  r.ok = Object.values(r).every(Boolean);
  return r;
}

// Congestión pélvica (ca_u6, cadera), docs/congestion-pelvica.md: «¿Por qué?» y
// «Ampliar» con su fisiología, mensaje 🩺 solo con SÍ, aviso «Derivación médica»
// sin urgencia; ca_u4 remite a ella en su «Ampliar».
async function checkCongestionPelvica(page) {
  await page.setViewportSize({ width: 1280, height: 860 });
  await abrirApp(page);
  await irAFase2(page, 'cadera');
  await page.click('#tab_ca_urogenital');
  const fila = '#panel_ca_urogenital #sq2_ca_u6';
  const r = {};
  r.sinUrg = await page.locator(fila).evaluate(el => !el.classList.contains('sq2-urg'));
  r.msgOculto = !(await page.isVisible(`${fila} .sq2-deriv-msg`));
  await page.click(`${fila} summary`);
  r.porque = await page.locator(`${fila} .razon`).evaluate(d => d.open && /Por qué/i.test(d.textContent) && /Cuánto pesa/i.test(d.textContent));
  await page.click(`${fila} .razon-ampliar`);
  await page.waitForSelector('#razonPanel.open');
  r.ampliar = await page.evaluate(() => {
    const t = document.getElementById('razonContenido').textContent;
    return /Fisiología/i.test(t) && /Champaneria 2016/.test(t) && /Shelkey 2014/.test(t);
  });
  await page.keyboard.press('Escape');
  await page.click(`${fila} .sq-btn.si`);
  await page.waitForSelector(`${fila} .sq2-deriv-msg`, { state: 'visible' });
  r.msgVisible = true;
  r.aviso = await page.evaluate(() => {
    const t = document.getElementById('sistemicoAlert').textContent;
    return /Derivación médica/.test(t) && /congestión pélvica/.test(t) && !/Derivación urgente/.test(t);
  });
  const u4 = '#panel_ca_urogenital #sq2_ca_u4';
  await page.click(`${u4} summary`);
  await page.click(`${u4} .razon-ampliar`);
  await page.waitForSelector('#razonPanel.open');
  r.u4 = await page.evaluate(() => /congestión pélvica/.test(document.getElementById('razonContenido').textContent));
  await page.keyboard.press('Escape');
  r.ok = Object.values(r).every(Boolean);
  return r;
}

// «¿Por qué?» de los tests (fase 4b, docs/razonamiento-tests.md): hombro con
// h2 (pinzamiento). Bajo los badges, la frase de «cuánto pesa»; «Ampliar →»
// abre el mismo panel de la fase 2 con el detalle del test. Escritorio: panel
// lateral sin velo, se puede marcar un test con él abierto, ir a la fase 5 lo
// cierra. 390 px: bottom sheet con velo y atrás lo cierra sin salir de la 4b.
async function irA4bHombro(page) {
  await abrirApp(page);
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
  await abrirApp(page);
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
  await abrirApp(page);
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
  await abrirApp(page);
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
  // Ancho: crece con la pantalla (380 → 560 px) sin tapar nunca la columna de
  // la fase, que conserva sus 780 px en cuanto hay sitio.
  const anchos = [];
  await page.click(`${base} #sq2_${RAZON_Q1} .razon-ampliar`);
  await page.waitForTimeout(400);
  for (const w of [1024, 1280, 1600, 1920]) {
    await page.setViewportSize({ width: w, height: 860 });
    await page.waitForTimeout(100);
    anchos.push(await page.evaluate(() => {
      const p = document.getElementById('razonPanel').getBoundingClientRect();
      const f = document.querySelector('#phase2').getBoundingClientRect();
      return { vw: innerWidth, panel: Math.round(p.width), fase: Math.round(f.width), hueco: Math.round(p.left - f.right) };
    }));
  }
  await page.keyboard.press('Escape');
  const anchoOk = anchos.every(x => x.panel >= 380 && x.panel <= 560 && x.hueco >= 0)
    && anchos.find(x => x.vw === 1920).panel === 560
    && anchos.find(x => x.vw === 1024).panel === 380
    && anchos.filter(x => x.vw >= 1280).every(x => x.fase === 780);
  const ok = inlineVisible && a.abierto && a.visible && !a.velo && siConPanel
    && b.abierto && b.pregunta !== a.pregunta && !c.abierto && c.fase === 2 && anchoOk;
  return { ok, inlineVisible, siConPanel, a, b, c, anchos };
}

async function checkRazonamientoMovil(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await abrirApp(page);
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

// «¿Por qué?» de las banderas (docs/razonamiento-banderas.md): el ⓘ de una
// bandera despliega debajo «Por qué» y «Cuánto pesa» (otro toque lo pliega) y
// su «Ampliar →» abre el panel del razonamiento con su pregunta (escritorio:
// lateral; 390 px: sheet que atrás cierra en la fase 2); una bandera sin
// «¿Por qué?» no lo lleva (hoy todas lo tienen). Posquirúrgico: en lumbar no se ven las banderas de
// miembros (compartimental, nervio, SDRC, yeso), en rodilla sí, con su ⓘ.
async function checkBanderas(browser) {
  const r = {};
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await context.newPage();
  await abrirApp(page);
  await irAFase2(page, 'lumbar');
  await page.click('#tab_l_espondilo');
  const panel = '#panel_l_espondilo';
  // Fase M cerrada: toda bandera propia de lumbar lleva su ⓘ (la regla «sin
  // «¿Por qué?», sin ⓘ» la cubre el test unitario con banderas de prueba)
  r.sinPorque = await page.evaluate(() => {
    const f = [...document.querySelectorAll('.sistema-panel:not([id^="panel_transversal_"]) .flag-item, [id^="panel_l_"] .flag-item')];
    return f.length > 0 && f.every(el => el.querySelector('.flag-porque'));
  });
  // Nivel 1: el ⓘ despliega «Por qué» y «Cuánto pesa» bajo la bandera, sin abrir el panel
  const ect = `${panel} .flag-item:has(.flag-texto:has-text("Embarazo ectópico"))`;
  await page.click(`${ect} .flag-porque`);
  r.inline = await page.locator(ect).evaluate(it => {
    const c = it.querySelector('.razon-bandera');
    return !c.hidden && c.offsetHeight > 0 && it.querySelector('.flag-porque').getAttribute('aria-expanded') === 'true'
      && /Por qué/i.test(c.textContent) && /Cuánto pesa/i.test(c.textContent)
      && !document.getElementById('razonPanel').classList.contains('open');
  });
  await page.click(`${ect} .flag-porque`);
  r.inlineCierra = await page.locator(`${ect} .razon-bandera`).evaluate(c => c.hidden);
  await page.click(`${ect} .flag-porque`);
  await page.click(`${ect} .razon-ampliar`);
  // Esperar a que termine de entrar (con carga, la transición tarda más)
  await page.waitForFunction(() => {
    const p = document.getElementById('razonPanel'), r = p.getBoundingClientRect();
    return p.classList.contains('open') && r.width > 0 && r.right <= innerWidth + 1 && getComputedStyle(p).visibility === 'visible';
  });
  const a = await razonEstado(page);
  r.escritorio = a.abierto && a.visible && !a.velo && a.pregunta.startsWith('Embarazo ectópico')
    && await page.evaluate(() => document.querySelector('#razonPanel .razon-kicker').textContent === '¿Por qué esta bandera roja?'
      && document.getElementById('razonContenido').textContent.includes('(Mujeres en edad fértil)')
      && document.getElementById('razonContenido').textContent.includes('NICE NG126'));
  await page.keyboard.press('Escape');
  r.fase1 = await page.isVisible('#panel_l_cancer .flag-fase1') || await page.evaluate(() => !!document.querySelector('#panel_l_cancer .flag-fase1'));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.click('#acc_l_cancer .sistema-accordion-header');
  await page.click('#acc_l_cancer .flag-item:has(.flag-texto:has-text("Antecedentes de cáncer")) .flag-porque');
  await page.click('#acc_l_cancer .flag-item:has(.flag-texto:has-text("Antecedentes de cáncer")) .razon-ampliar');
  await page.waitForSelector('#razonPanel.open');
  const b = await razonEstado(page);
  await page.goBack();
  await page.waitForFunction(() => !document.getElementById('razonPanel').classList.contains('open'));
  const c = await razonEstado(page);
  r.movil = b.abierto && b.velo && !b.scrollX && !c.abierto && c.fase === 2;
  await context.close();

  const posq = async region => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
    const pg = await ctx.newPage();
    await pg.goto(BASE_URL, { waitUntil: 'networkidle' });
    await pg.fill('#motivoConsulta', 'Operado (banderas)');
    await pg.click('#mecanismo .option-btn:has-text("Post-quirúrgico")');
    await pg.click('#cronologia .option-btn >> nth=0');
    await pg.click('#phase1 .btn-primary');
    await pg.click(`[onclick="selectRegion('${region}', this)"]`);
    await pg.waitForSelector('#panel_transversal_posquirurgico');
    const res = await pg.evaluate(() => [...document.querySelectorAll('#panel_transversal_posquirurgico .flag-item')]
      .map(el => ({ t: el.querySelector('.flag-texto').textContent, porque: !!el.querySelector('.flag-porque') })));
    await ctx.close();
    return res;
  };
  const lu = await posq('lumbar'), ro = await posq('rodilla');
  const miembros = /compartimento|territorio de un nervio|al roce \(SDRC\)/;
  r.posqLumbar = lu.length === 5 && !lu.some(f => miembros.test(f.t) || /Yeso/.test(f.t))
    && lu.some(f => /cirugía de columna/.test(f.t) && f.porque);
  r.posqRodilla = ro.length === 8 && !ro.some(f => /cirugía de columna/.test(f.t)) && ro.filter(f => miembros.test(f.t)).every(f => f.porque);
  r.ok = r.sinPorque && r.inline && r.inlineCierra && r.escritorio && r.fase1 && r.movil && r.posqLumbar && r.posqRodilla;
  if (!r.ok) Object.assign(r, { a, b, c, lu, ro });
  return r;
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
  await abrirApp(page);
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
  await abrirApp(page);
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
  // Modalidad «Fármacos»: guion visible, prompt con el guion y la región;
  // al volver a abrir, otra vez «Pregunta libre»
  await page.waitForTimeout(100);
  await page.click('#preguntaIABtn');
  r.tipoDefecto = await page.evaluate(() => document.querySelector('#preguntaTipos .option-btn.selected')?.dataset.tipo === 'libre'
    && document.getElementById('preguntaGuion').hidden);
  await page.click('#preguntaTipos [data-tipo="farmacos"]');
  r.farmacosUI = await page.evaluate(() => !document.getElementById('preguntaGuion').hidden
    && document.getElementById('preguntaGuion').textContent.includes('No propone cambiar la medicación')
    && document.getElementById('preguntaTexto').placeholder.includes('ibuprofeno')
    && document.getElementById('preguntaNota').textContent.includes('guion'));
  await page.fill('#preguntaTexto', 'Atorvastatina y bisoprolol');
  await page.press('#preguntaTexto', 'Enter');
  await page.waitForTimeout(150);
  const f = await ultimo();
  r.farmacos = f.n === 3 && f.q.includes('Contexto: valoración de lumbar. Fármacos o duda: «Atorvastatina y bisoprolol».')
    && f.q.includes('No propongas cambiar, suspender ni ajustar la medicación.') && f.q.includes('CIMA, AEMPS')
    && !f.q.includes('Secreta') && !f.q.includes('47');
  // Modalidad «Ejercicio»: guion visible y prompt con el guion de prescripción
  await page.waitForTimeout(100);
  await page.click('#preguntaIABtn');
  await page.click('#preguntaTipos [data-tipo="ejercicio"]');
  r.ejercicioUI = await page.evaluate(() => !document.getElementById('preguntaGuion').hidden
    && document.getElementById('preguntaGuion').textContent.includes('fase 6')
    && document.getElementById('preguntaTexto').placeholder.includes('excéntrico')
    && document.getElementById('preguntaNota').textContent.includes('guion'));
  await page.fill('#preguntaTexto', 'Progresión de carga en tendinopatía aquílea');
  await page.press('#preguntaTexto', 'Enter');
  await page.waitForTimeout(150);
  const e = await ultimo();
  r.ejercicio = e.n === 4 && e.q.includes('Contexto: valoración de lumbar. Duda de prescripción de ejercicio: «Progresión de carga en tendinopatía aquílea».')
    && e.q.includes('si ninguna fuente fija el volumen, dilo en lugar de proponer uno') && !e.q.includes('CIMA')
    && !e.q.includes('Secreta') && !e.q.includes('47');
  await page.waitForTimeout(100);
  await page.click('#preguntaIABtn');
  r.escape = await page.evaluate(() => document.querySelector('#preguntaDestinos .option-btn.selected')?.dataset.destino === 'claude'
    && document.querySelector('#preguntaTipos .option-btn.selected')?.dataset.tipo === 'libre');
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
  await abrirHerramienta(movil, 'pregunta');
  await movil.waitForTimeout(400);
  const hoja = await movil.evaluate(() => {
    const p = document.getElementById('preguntaPanel').getBoundingClientRect();
    // Sin foco en el texto: el teclado no se despliega solo
    return Math.round(p.width) === innerWidth && Math.round(p.bottom) === innerHeight
      && document.activeElement?.id === 'preguntaPanel';
  });
  r.movil = hoja && await atrasDesdeHerramienta(movil, 'preguntaOverlay')
    && await movil.evaluate(() => !document.getElementById('preguntaOverlay').classList.contains('open') && state.currentPhase === 2);
  // 320 px: los tres destinos y el botón caben sin cortar
  await movil.setViewportSize({ width: 320, height: 640 });
  await abrirHerramienta(movil, 'pregunta');
  await movil.waitForTimeout(400);
  r.caben320 = await movil.evaluate(() => {
    const panel = document.getElementById('preguntaPanel').getBoundingClientRect();
    return [...document.querySelectorAll('#preguntaDestinos .option-btn, #preguntaTipos .option-btn'), document.getElementById('preguntaIr'), document.querySelector('#preguntaCabecera .mic-btn')].every(b => {
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
// Atrás con una ventana abierta (móvil, decisión del usuario 2026-10): cierra
// la ventana (un diálogo = «Cancelar») y nunca cambia de fase; cerrarlas de
// cualquier otra forma no deja entradas en el historial, así que después un
// solo atrás cambia de fase; la acción de un diálogo y la fase elegida en la
// hoja de fases esperan a que se vaya la entrada.
async function checkAtrasVentanas(browser) {
  const r = {};
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const errores = [];
  p.on('pageerror', e => errores.push(e.message));
  await abrirApp(p);
  await p.evaluate(() => { window.state.maxVisitedIdx = 2; window.goToPhase(2); });
  const abierto = id => p.evaluate(i => document.getElementById(i)?.classList.contains('open'), id);
  const espera = (f, arg) => p.waitForFunction(f, arg, { timeout: 3000 }).then(() => true, () => false);
  const enFase = n => espera(f => String(window.state.currentPhase) === String(f), n);
  // Panel de sesión (con nombre, para que tenga la papelera)
  await p.tap('#sessionBtn');
  await p.waitForSelector('#sessionPanelOverlay.open');
  await p.fill('#patientName', 'Prueba');
  await p.goBack();
  r.panel = await espera(() => !document.getElementById('sessionPanelOverlay').classList.contains('open')) && await enFase(2);
  // Hoja de fases
  await p.tap('#mobilePhaseBar');
  await p.waitForSelector('#phaseSheet.open');
  await p.goBack();
  r.hojaFases = await espera(() => !document.getElementById('phaseSheet').classList.contains('open')) && await enFase(2);
  // Diálogo abierto desde el panel: atrás = cancelar, vuelve el panel; otro atrás lo cierra
  await p.tap('#sessionBtn');
  await p.waitForSelector('#sessionPanelOverlay.open');
  await p.tap('#sessionPanelClear');
  await p.waitForSelector('#confirmBanner');
  await p.goBack();
  r.dialogoCancela = await espera(() => !document.getElementById('confirmBanner')
    && document.getElementById('sessionPanelOverlay').classList.contains('open')) && await enFase(2)
    && await p.evaluate(() => window.state.maxVisitedIdx === 2);
  await p.goBack();
  r.dialogoPanel = await espera(() => !document.getElementById('sessionPanelOverlay').classList.contains('open')) && await enFase(2);
  // Teclado numérico (modo guía)
  await p.evaluate(() => { window.state.registro = 'guia'; window.goToPhase(1); });
  await enFase(1);
  await p.evaluate(() => window.goToPhase(2));
  await enFase(2);
  await p.evaluate(() => window.goToPhase(1));
  await enFase(1);
  await p.click('#edadPaciente');
  await p.waitForSelector('#tecladoOverlay.open');
  await p.goBack();
  r.teclado = await espera(() => !document.getElementById('tecladoOverlay').classList.contains('open')) && await enFase(1);
  await p.evaluate(() => { window.state.registro = 'teclado'; });
  await p.tap('#mobilePhaseBar');
  await p.waitForSelector('#phaseSheet.open');
  // La fase elegida en la hoja: se navega cuando la entrada de la hoja ya no está
  await p.tap('.phase-sheet-item:has-text("Fase 2")');
  r.hojaNavega = await enFase(2) && !(await abierto('phaseSheet'));
  // Abrir y cerrar de todas las formas no deja entradas: un atrás cambia de fase
  for (let i = 0; i < 3; i++) {
    await p.tap('#sessionBtn');
    await p.waitForSelector('#sessionPanelOverlay.open');
    if (i === 0) await p.evaluate(() => window.closeSessionPanel());
    else await p.tap('#sessionPanelOverlay', { position: { x: 20, y: 20 } });
    await espera(() => !document.getElementById('sessionPanelOverlay').classList.contains('open'));
  }
  await p.tap('#mobilePhaseBar');
  await p.waitForSelector('#phaseSheet.open');
  await p.tap('#phaseSheetOverlay', { position: { x: 20, y: 20 } });
  await espera(() => !document.getElementById('phaseSheet').classList.contains('open'));
  await p.tap('#sessionBtn');
  await p.waitForSelector('#sessionPanelOverlay.open');
  await p.tap('#sessionPanelClear');
  await p.waitForSelector('#confirmBanner');
  await p.tap('#confirmCancel');
  await p.waitForSelector('#sessionPanelOverlay.open');
  await p.tap('#sessionPanelOverlay', { position: { x: 20, y: 20 } });
  await espera(() => !document.getElementById('sessionPanelOverlay').classList.contains('open'));
  await p.waitForTimeout(200);
  await p.goBack();
  r.sinEntradas = await enFase(1) && !(await abierto('sessionPanelOverlay')) && !(await abierto('phaseSheet'));
  // La acción de un diálogo: «Borrar sesión» vuelve a la fase 1 y el atrás no reabre nada
  await p.evaluate(() => window.goToPhase(2));
  await enFase(2);
  await p.tap('#sessionBtn');
  await p.waitForSelector('#sessionPanelOverlay.open');
  await p.tap('#sessionPanelClear');
  await p.waitForSelector('#confirmBanner');
  await p.tap('#confirmAction');
  r.accion = await enFase(1) && await espera(() => !document.getElementById('confirmBanner')
    && !document.getElementById('sessionPanelOverlay').classList.contains('open') && window.state.maxVisitedIdx === 0);
  r.sinErrores = errores.length === 0;
  await ctx.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

// Atrás que cerraría la app (móvil, fase 1, sin nada abierto): pregunta con una
// valoración en curso (sin nombre: se pierde; con nombre: queda guardada) o
// grabando; «Seguir aquí» deja la app como estaba y el atrás vuelve a preguntar;
// «Salir» sale; con la app vacía sale sin preguntar.
async function checkSalidaApp(browser) {
  const r = {};
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const errores = [];
  p.on('pageerror', e => errores.push(e.message));
  const espera = (f, arg) => p.waitForFunction(f, arg, { timeout: 3000 }).then(() => true, () => false);
  const fuera = () => p.waitForURL('about:blank', { timeout: 3000 }).then(() => true, () => false);
  const dialogo = () => espera(() => !!document.querySelector('#confirmBanner.salida-app'));
  // Sin datos: sale sin preguntar
  await abrirApp(p);
  await p.tap('#mobilePhaseBar');
  await p.waitForSelector('#phaseSheet.open');
  await p.tap('#phaseSheetOverlay', { position: { x: 20, y: 20 } });
  await espera(() => !document.getElementById('phaseSheet').classList.contains('open'));
  await p.goBack();
  r.sinDatosSale = await fuera();
  // Datos sin nombre: pregunta; «Seguir aquí» se queda y vuelve a preguntar; «Salir» sale
  await abrirApp(p);
  await p.tap('#mecanismo .option-btn >> nth=0');
  await p.goBack();
  r.sinNombrePregunta = await dialogo() && await p.evaluate(() =>
    /no tiene nombre de paciente/.test(document.querySelector('#confirmBanner .confirm-box-text').textContent)
    && !/grabando/.test(document.querySelector('#confirmBanner .confirm-box-text').textContent)
    && String(window.state.currentPhase) === '1');
  await p.tap('#confirmCancel');
  r.seguir = await espera(() => !document.getElementById('confirmBanner') && history.state?.phase === 1 && !!window.state.mecanismo);
  await p.goBack();
  r.vuelvePreguntar = await dialogo();
  await p.tap('#confirmAction');
  r.salir = await fuera();
  // Con nombre y grabando: la grabación y que queda guardada; sin grabar, solo lo segundo
  await abrirApp(p);
  await p.tap('#sessionBtn');
  await p.waitForSelector('#sessionPanelOverlay.open');
  await p.fill('#patientName', 'Prueba');
  await p.goBack();
  await espera(() => !document.getElementById('sessionPanelOverlay').classList.contains('open'));
  await p.evaluate(() => document.body.classList.add('grab-activa'));
  await p.tap('#mecanismo .option-btn >> nth=0');
  await p.goBack();
  r.grabandoPregunta = await dialogo() && await p.evaluate(() => {
    const t = document.querySelector('#confirmBanner .confirm-box-text').textContent;
    return /grabando/.test(t) && /queda guardada/.test(t) && !/no tiene nombre/.test(t);
  });
  await p.keyboard.press('Escape');
  r.escapeSigue = await espera(() => !document.getElementById('confirmBanner') && history.state?.phase === 1);
  await p.evaluate(() => document.body.classList.remove('grab-activa'));
  await p.goBack();
  r.conNombrePregunta = await dialogo() && await p.evaluate(() => {
    const t = document.querySelector('#confirmBanner .confirm-box-text').textContent;
    return /queda guardada/.test(t) && !/grabando/.test(t) && !/no tiene nombre/.test(t);
  });
  await p.tap('#confirmAction');
  r.conNombreSale = await fuera();
  // Fuera de la fase 1, el atrás sigue cambiando de fase
  await abrirApp(p);
  await p.tap('#mecanismo .option-btn >> nth=0');
  await p.evaluate(() => { window.state.maxVisitedIdx = 1; window.goToPhase(2); });
  // Pasada la fase 1 sin nombre, en modo teclado: nombre automático (la sesión se guarda)
  r.nombreAutoTeclado = await p.evaluate(() => window.state.registro === 'teclado'
    && /^Paciente \d\d\/\d\d \d\d:\d\d$/.test(window.state.patient));
  await p.goBack();
  r.faseSinDialogo = await espera(() => String(window.state.currentPhase) === '1' && !document.getElementById('confirmBanner'));
  // Se puede vaciar el campo para escribir el nombre real: mientras tiene el foco no se rellena solo
  await p.tap('#sessionBtn');
  await p.waitForSelector('#sessionPanelOverlay.open');
  await p.fill('#patientName', '');
  r.vaciarNombre = await p.evaluate(() => document.getElementById('patientName').value === '' && window.state.patient === '');
  await p.fill('#patientName', 'Ana');
  r.nombreReal = await p.evaluate(() => window.state.patient === 'Ana');
  r.sinErrores = errores.length === 0;
  await ctx.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

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
// Calculadora de cuestionarios (📋 de la cabecera, lib/cuestionarios.js): en
// escritorio, diálogo centrado con un cuestionario por tarjeta; el PHQ-9 por
// toques reales da 12/27 «moderados», la alerta del ítem 9 sale y un segundo
// toque la quita; la tarjeta enseña el resultado; las zonas de Örebro se
// marcan y desmarcan; «Borrar respuestas» pregunta y vuelve al cuestionario;
// la fase 5 lo resume y Escape cierra. En móvil, hoja inferior que atrás
// cierra sin cambiar de fase; a 320 px nada desborda y la escala 0–10 deja
// botones de 40 px o más. También en el hub.
// Citas tocables (lib/citas.js + ficha.js): forma corta en el texto, ficha con la cita
// entera y su enlace al tocarla; se cierra con la misma cita, fuera, Escape (foco de
// vuelta), al desplazar y al cambiar de fase; teclado → foco en «Abrir ↗»; al imprimir,
// la cita entera; en móvil cabe con 16 px de margen; dentro de la calculadora, Escape
// cierra la ficha antes que el panel.
async function checkCitas(browser, errors) {
  const nueva = async (opts, etq) => {
    const context = await browser.newContext(opts);
    const page = await context.newPage();
    page.on('pageerror', err => errors.push(`pageerror (${etq}): ${err.message}`));
    page.on('console', msg => { if (msg.type() === 'error' && !KNOWN_NOISE.some(n => msg.text().includes(n))) errors.push(`console (${etq}): ${msg.text()}`); });
    await page.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', route => route.fulfill({
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'X-PhysiQ-Mode': 'demo' },
      contentType: 'application/json', body: JSON.stringify({ ok: true, mode: 'demo', routes: { report: 'demo' }, demoOnly: false }),
    }));
    await abrirApp(page);
    await walkRegion(page, 'lumbar');
    return { context, page };
  };
  const { context, page } = await nueva({ viewport: { width: 1280, height: 900 } }, 'citas');
  const r = {};
  const ficha = () => page.evaluate(() => { const f = document.getElementById('citaFicha'); return f && !f.hidden ? f.textContent : ''; });
  const cerrada = () => page.waitForFunction(() => { const f = document.getElementById('citaFicha'); return !f || f.hidden; }, null, { timeout: 3000 }).then(() => true, () => false);
  // Una cita con enlace en el registro, visible en la fase 5
  const sel = await page.evaluate(async () => {
    const { REFERENCIAS } = await import('./data/referencias.js');
    const { claveRegistro } = await import('./lib/citas.js');
    document.querySelectorAll('#phase5 details.pauta-det, #phase5 details.pronostico-det').forEach(d => { d.open = true; });
    const cs = [...document.querySelectorAll('#phase5 .cita')].filter(b => b.checkVisibility());
    const i = cs.findIndex(b => { const x = REFERENCIAS[claveRegistro(b.dataset.cita, REFERENCIAS)]; return x?.url || x?.doi; });
    cs.forEach((b, k) => b.toggleAttribute('data-prueba', k === i));
    return i >= 0 ? { cita: cs[i].dataset.cita } : null;
  });
  r.hayCitas = !!sel;
  r.formaCorta = await page.evaluate(() => [...document.querySelectorAll('#phase5 .cita')].some(x => x.querySelector('.cita-corta').textContent.length < x.dataset.cita.length));
  if (!sel) { await context.close(); return { ok: false, ...r }; }
  const b = '#phase5 .cita[data-prueba]';
  await page.click(b);
  await page.waitForFunction(() => document.querySelector('#citaFicha .cita-ficha-enlace'), null, { timeout: 5000 }).catch(() => {});
  r.abre = await page.evaluate(c => {
    const f = document.getElementById('citaFicha'), a = f?.querySelector('.cita-ficha-enlace');
    return !!f && !f.hidden && f.querySelector('.cita-ficha-texto').textContent === c && a?.target === '_blank' && /^https:\/\//.test(a.href)
      && document.querySelector('#phase5 .cita[data-prueba]').getAttribute('aria-expanded') === 'true';
  }, sel.cita);
  r.junto = await page.evaluate(() => {
    const a = document.querySelector('#phase5 .cita[data-prueba]').getBoundingClientRect(), f = document.getElementById('citaFicha').getBoundingClientRect();
    return f.left >= 16 && f.right <= innerWidth - 16 && (Math.abs(f.top - a.bottom - 8) < 2 || Math.abs(a.top - 8 - f.bottom) < 2);
  });
  await page.keyboard.press('Escape');
  r.escape = await cerrada() && await page.evaluate(() => document.activeElement?.matches('.cita[data-prueba]') && state.currentPhase === 5);
  await page.click(b); await page.click(b);
  r.mismaCita = await cerrada();
  await page.click(b); await page.mouse.click(5, 450);
  r.fuera = await cerrada();
  await page.click(b);
  await page.evaluate(() => window.scrollBy(0, 200));
  r.desplazar = await cerrada();
  await page.click(b);
  await page.evaluate(() => goToPhase(4));
  r.cambiarFase = await cerrada();
  await page.evaluate(() => goToPhase(5));
  // Teclado: Enter abre y el foco pasa a «Abrir ↗»; Escape lo devuelve a la cita
  await page.evaluate(() => { const x = document.querySelector('#phase5 .cita[data-prueba]'); x.scrollIntoView({ block: 'center' }); x.focus(); });
  await page.keyboard.press('Enter');
  r.teclado = await page.waitForFunction(() => document.activeElement?.matches('#citaFicha .cita-ficha-enlace'), null, { timeout: 3000 }).then(() => true, () => false);
  await page.keyboard.press('Escape');
  r.tecladoVuelve = await cerrada() && await page.evaluate(() => document.activeElement?.matches('.cita[data-prueba]'));
  // Al imprimir, la cita entera (forma corta + resto, que en pantalla está oculto)
  r.restoOculto = await page.evaluate(() => [...document.querySelectorAll('#phase5 .cita-resto')].every(x => getComputedStyle(x).display === 'none'));
  await page.emulateMedia({ media: 'print' });
  r.imprimir = await page.evaluate(c => {
    const x = document.querySelector('#phase5 .cita[data-prueba]');
    const resto = x.querySelector('.cita-resto');
    return x.innerText.trim() === c && (!resto || getComputedStyle(resto).display === 'inline');
  }, sel.cita);
  await page.emulateMedia({ media: 'screen' });
  // Fase 6: las fuentes del plan también son citas
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.fase6 = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('#planContenido .test-source .cita')].filter(x => x.checkVisibility());
    return cs.length > 0 && cs.every(x => /\d{4}/.test(x.querySelector('.cita-corta').textContent) && !x.querySelector('.cita-corta').textContent.includes(','));
  });
  // Citas dentro de una frase (Fase O2): botón con autor y año, el resto oculto, y el
  // texto del elemento sigue entero (lo que se comparte no cambia)
  r.enFrase6 = await page.evaluate(() => {
    const x = [...document.querySelectorAll('#planContenido li .cita, #planContenido .plan-ayuda .cita')].find(y => y.checkVisibility());
    if (!x) return false;
    const resto = x.querySelector('.cita-resto');
    return /\d{4}$/.test(x.querySelector('.cita-corta').textContent) && (!resto || !resto.checkVisibility())
      && x.closest('li, .plan-ayuda').textContent.includes(x.dataset.cita);
  });
  await page.evaluate(() => { const x = [...document.querySelectorAll('#planContenido .test-source .cita')].find(y => y.checkVisibility()); x.scrollIntoView({ block: 'center' }); x.setAttribute('data-p6', ''); });
  await page.click('#planContenido .cita[data-p6]');
  r.fase6Abre = (await ficha()).length > 0;
  await page.keyboard.press('Escape');
  await cerrada();
  // Fase 3: la ayuda de la irritabilidad lleva sus citas tocables
  await page.evaluate(() => goToPhase(3));
  r.enFrase3 = await page.evaluate(() => !!document.querySelector('#irritabilidadResumen .cita[data-cita="Barakatt 2009"]'));
  await page.evaluate(() => goToPhase(6));
  await page.waitForSelector('#planContenido .card');
  // Fase O3: razonamiento (4b) con citas tocables; «Ampliar con IA» sigue leyendo el párrafo entero
  await page.evaluate(() => goToPhase('4b'));
  await page.waitForSelector('#hypothesisCards .test-item', { state: 'attached' });
  r.razon4b = await page.evaluate(async () => {
    const x = document.querySelector('#phase4b .razon-cuerpo p .cita, #phase4b .test-criterion .cita');
    if (!x) return false;
    const { textoDe } = await import('./ampliar-ia.js');
    return textoDe(x.closest('p, .test-criterion')).includes(x.dataset.cita);
  });
  await page.evaluate(() => goToPhase(6));
  await page.waitForSelector('#planContenido .card');
  // Calculadora: la fuente es cita; Escape cierra la ficha y deja el panel abierto
  await page.click('#cuestBtn');
  await page.click('[data-cuest="phq9"]');
  await page.click('#cuestOverlay .cuest-fuente .cita >> nth=0');
  r.cuestAbre = (await ficha()).length > 0;
  await page.keyboard.press('Escape');
  r.cuestEscape = await cerrada() && await page.evaluate(() => document.getElementById('cuestOverlay').classList.contains('open'));
  await page.keyboard.press('Escape');
  r.cuestCierra = await page.waitForFunction(() => !document.getElementById('cuestOverlay').classList.contains('open'), null, { timeout: 3000 }).then(() => true, () => false);
  await context.close();

  // Móvil táctil a 320 px: la ficha cabe con 16 px de margen
  const m = await nueva({ viewport: { width: 320, height: 700 }, hasTouch: true, isMobile: true }, 'citas móvil');
  await m.page.evaluate(() => { document.querySelectorAll('#phase5 details.pauta-det').forEach(d => { d.open = true; }); const x = [...document.querySelectorAll('#phase5 .cita')].filter(y => y.checkVisibility()).pop(); x.scrollIntoView({ block: 'center' }); x.setAttribute('data-prueba', ''); });
  await m.page.tap('#phase5 .cita[data-prueba]');
  await m.page.waitForFunction(() => document.querySelector('#citaFicha .cita-ficha-enlace, #citaFicha .cita-ficha-sin'), null, { timeout: 5000 }).catch(() => {});
  r.movil = await m.page.evaluate(() => {
    const f = document.getElementById('citaFicha'), q = f?.getBoundingClientRect();
    return !!f && !f.hidden && q.left >= 16 && q.right <= innerWidth - 16 && q.top >= 0 && q.bottom <= innerHeight
      && document.documentElement.scrollWidth <= innerWidth;
  });
  await m.context.close();
  r.ok = Object.values(r).every(Boolean);
  return r;
}

// Guía de condiciones especiales (cabecera, docs/condiciones-especiales.md):
// diálogo con una fila por condición, cada botón lleva a su tarjeta o pregunta y
// la resalta sin marcar nada, el estado sigue a la tarjeta, Escape y atrás
// cierran sin cambiar de fase, cabe a 320 px y también sale en el hub.
async function checkCondiciones(browser, errors) {
  const r = {};
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (condiciones): ${err.message}`));
  await abrirApp(page);
  const abierto = () => page.evaluate(() => document.getElementById('condOverlay').classList.contains('open'));
  const estado = id => page.evaluate(i => document.querySelector(`[data-condicion="${i}"] .cond-estado`)?.textContent || '', id);
  await page.click('#condBtn');
  r.dialogo = await page.evaluate(() => {
    const p = document.getElementById('condPanel').getBoundingClientRect();
    const ids = [...document.querySelectorAll('#condCuerpo .cond-fila')].map(f => f.dataset.condicion).join();
    return p.width > 420 && p.width <= 560 && Math.abs(p.left + p.width / 2 - innerWidth / 2) < 2
      && ids === 'posquirurgico,hipermovilidad,disautonomia,lupus,mastocitos,osteoporosis,embarazo,anticoagulado,tarlov,cascanueces,congestionPelvica'
      && /Solo en lumbar/i.test(document.getElementById('condCuerpo').textContent)
      && /Solo en cadera/i.test(document.getElementById('condCuerpo').textContent)
      && document.querySelectorAll('#condCuerpo .cond-fila .cita').length > 0;
  });
  r.sinMarcar = await estado('lupus') === 'No consta' && await estado('posquirurgico') === 'No marcado';
  // Sin región: el botón de Tarlov elige lumbar, sin preguntar, y lleva a su pregunta
  r.lumbarSinRegion = await page.evaluate(() => /Elegir lumbar e ir a la pregunta/.test(document.querySelector('[data-condicion="tarlov"] .cond-ir').textContent));
  await page.click('[data-condicion="tarlov"] .cond-ir');
  r.eligeRegion = await page.waitForFunction(() => window.state.region === 'lumbar' && window.state.currentPhase === 2
    && !document.getElementById('confirmBanner')
    && document.querySelector('.region-card[data-region="lumbar"]').classList.contains('selected')
    && [...document.querySelectorAll('[id="sq2_l_u5"]')].some(e => e.offsetParent && e.classList.contains('flash-destacar')), null, { timeout: 4000 }).then(() => true, () => false);
  await page.click('#condBtn');
  // Ir a la tarjeta del lupus: fase 1, resaltada, nada marcado
  const antes = await page.evaluate(() => JSON.stringify(window.state));
  await page.evaluate(() => window.goToPhase(1));
  await page.click('[data-condicion="lupus"] .cond-ir');
  await page.waitForFunction(() => !document.getElementById('condOverlay').classList.contains('open'));
  r.tarjeta = await page.waitForFunction(() => document.getElementById('cardLupus').classList.contains('flash-destacar'), null, { timeout: 3000 }).then(() => true, () => false);
  r.noMarca = await page.evaluate(a => {
    const s = JSON.parse(a), n = window.state;
    return n.lupus.estado === s.lupus.estado && n.hipermovilidad.estado === s.hipermovilidad.estado && n.mecanismo === s.mecanismo;
  }, antes);
  // El estado sigue a la tarjeta
  await page.click('#lesEstado [data-valor="sospecha"]');
  await page.click('#condBtn');
  r.estadoSigue = await estado('lupus') === 'Sospecha';
  await page.keyboard.press('Escape');
  r.escape = !(await abierto());
  // Posquirúrgico → «Mecanismo de inicio»
  await page.click('#condBtn');
  await page.click('[data-condicion="posquirurgico"] .cond-ir');
  r.mecanismo = await page.waitForFunction(() => document.getElementById('cardMecanismo').classList.contains('flash-destacar'), null, { timeout: 3000 }).then(() => true, () => false);
  // Con lumbar: Tarlov lleva a su pregunta de la fase 2, resaltada
  await page.evaluate(() => { window.state.maxVisitedIdx = Math.max(window.state.maxVisitedIdx, 1); window.goToPhase(2); });
  await page.click('.region-card[data-region="lumbar"]');
  await page.waitForSelector('[id="sq2_l_u5"]', { state: 'attached' });
  await page.click('#condBtn');
  await page.click('[data-condicion="tarlov"] .cond-ir');
  r.pregunta = await page.waitForFunction(() => window.state.currentPhase === 2
    && [...document.querySelectorAll('[id="sq2_l_u5"]')].some(e => e.offsetParent && e.classList.contains('flash-destacar')), null, { timeout: 4000 }).then(() => true, () => false);
  // Con lumbar, congestión pélvica cambia a cadera tras confirmar; cancelar
  // vuelve a la guía sin cambiar nada
  await page.evaluate(() => { window.state.sistemicoAnswers.l_u5 = 'SI'; });
  await page.click('#condBtn');
  r.textoOtra = /Cambiar a cadera e ir/.test(await page.textContent('[data-condicion="congestionPelvica"] .cond-ir'));
  await page.click('[data-condicion="congestionPelvica"] .cond-ir');
  await page.waitForSelector('#confirmBanner .confirm-box-text');
  r.aviso = /Ahora valoras lumbar\. Esta pregunta solo está en el cribado de cadera/.test(await page.textContent('#confirmBanner .confirm-box-text'))
    && !(await abierto());
  await page.click('#confirmCancel');
  r.cancela = await page.waitForFunction(() => document.getElementById('condOverlay').classList.contains('open')
    && window.state.region === 'lumbar' && window.state.sistemicoAnswers.l_u5 === 'SI', null, { timeout: 3000 }).then(() => true, () => false);
  await page.click('[data-condicion="congestionPelvica"] .cond-ir');
  await page.click('#confirmAction');
  r.cambia = await page.waitForFunction(() => window.state.region === 'cadera' && window.state.currentPhase === 2
    && !document.getElementById('condOverlay').classList.contains('open')
    && [...document.querySelectorAll('[id="sq2_ca_u6"]')].some(e => e.offsetParent && e.classList.contains('flash-destacar')), null, { timeout: 4000 }).then(() => true, () => false);
  await page.emulateMedia({ media: 'print' });
  r.sinImprimir = await page.evaluate(() => getComputedStyle(document.getElementById('condBtn')).display === 'none');
  await context.close();

  // Móvil: desde «Herramientas», hoja inferior; atrás cierra en la misma fase;
  // un botón vuelve sin dejar la hoja abierta y la fase cambia una sola vez
  const movil = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
  const m = await movil.newPage();
  m.on('pageerror', err => errors.push(`pageerror (condiciones móvil): ${err.message}`));
  await abrirApp(m);
  await m.evaluate(() => { window.state.maxVisitedIdx = 2; window.goToPhase(2); });
  await abrirHerramienta(m, 'condiciones');
  await m.waitForSelector('#condOverlay.open');
  r.hoja = await m.waitForFunction(() => {
    const p = document.getElementById('condPanel').getBoundingClientRect();
    return Math.round(p.width) === innerWidth && Math.abs(p.bottom - innerHeight) < 2;
  }, null, { timeout: 3000 }).then(() => true, () => false);
  r.iconoOculto = await m.evaluate(() => getComputedStyle(document.getElementById('condBtn')).display === 'none');
  r.atras = await atrasDesdeHerramienta(m, 'condOverlay') && await m.evaluate(() => window.state.currentPhase === 2);
  // «‹ Herramientas» (solo abierta desde el menú) vuelve a él; desde ahí se
  // abre otra, y Escape cierra las dos sin dejar entradas en el historial
  await abrirHerramienta(m, 'condiciones');
  await m.waitForSelector('#condOverlay.open');
  r.volverVisible = await m.isVisible('#condPanel .herr-volver-btn');
  await m.tap('#condPanel .herr-volver-btn');
  r.volverMenu = await m.waitForFunction(() => !document.getElementById('condOverlay').classList.contains('open')
    && document.getElementById('herramientasOverlay').classList.contains('open'), null, { timeout: 3000 }).then(() => true, () => false);
  await m.tap('#herramientasOverlay [data-herramienta="farmacos"]');
  await m.waitForSelector('#farmOverlay.open');
  // Fijo arriba: solo se desplaza el cuerpo de la hoja, nunca el botón
  r.volverFijo = await m.evaluate(() => {
    const b = document.querySelector('#farmPanel .herr-volver-btn');
    const c = document.getElementById('farmCuerpo');
    const antes = b.getBoundingClientRect().top;
    c.scrollTop = c.scrollHeight;
    return c.scrollTop > 0 && Math.abs(b.getBoundingClientRect().top - antes) < 1;
  });
  await m.keyboard.press('Escape');
  r.escapeCierraTodo = await m.waitForFunction(() => !document.getElementById('farmOverlay').classList.contains('open')
    && !document.getElementById('herramientasOverlay').classList.contains('open') && !document.body.classList.contains('herr-volver'), null, { timeout: 3000 }).then(() => true, () => false);
  await m.waitForTimeout(200);
  await m.goBack();
  r.sinEntradasSobrantes = await m.waitForFunction(() => window.state.currentPhase === 1, null, { timeout: 3000 }).then(() => true, () => false);
  await m.evaluate(() => window.goToPhase(2));
  // Abierta sin pasar por el menú (enlace «Calcular»…), sin «‹ Herramientas»
  await m.evaluate(() => window.abrirCondiciones());
  await m.waitForSelector('#condOverlay.open');
  r.volverOculto = !(await m.isVisible('#condPanel .herr-volver-btn'));
  await m.goBack();
  r.atrasDirecto = await m.waitForFunction(() => !document.getElementById('condOverlay').classList.contains('open')
    && !document.getElementById('herramientasOverlay').classList.contains('open') && window.state.currentPhase === 2, null, { timeout: 3000 }).then(() => true, () => false);
  await abrirHerramienta(m, 'condiciones');
  await m.waitForSelector('#condOverlay.open');
  await m.tap('[data-condicion="hipermovilidad"] .cond-ir');
  r.irMovil = await m.waitForFunction(() => window.state.currentPhase === 1
    && document.getElementById('cardHipermovilidad').classList.contains('flash-destacar')
    && !document.getElementById('condOverlay').classList.contains('open'), null, { timeout: 4000 }).then(() => true, () => false);
  // Cambio de región desde la hoja: el aviso sale con la hoja ya cerrada;
  // cancelar la reabre y Atrás la vuelve a cerrar sin cambiar de fase
  await m.evaluate(() => { window.goToPhase(2); window.selectRegion('lumbar', document.querySelector('.region-card[data-region="lumbar"]')); });
  await abrirHerramienta(m, 'condiciones');
  await m.waitForSelector('#condOverlay.open');
  await m.tap('[data-condicion="congestionPelvica"] .cond-ir');
  await m.waitForSelector('#confirmBanner .confirm-box-text');
  r.avisoMovil = await m.evaluate(() => !document.getElementById('condOverlay').classList.contains('open'));
  await m.tap('#confirmCancel');
  await m.waitForSelector('#condOverlay.open');
  await m.goBack();
  r.cancelaMovil = await m.waitForFunction(() => !document.getElementById('condOverlay').classList.contains('open')
    && window.state.currentPhase === 2 && window.state.region === 'lumbar', null, { timeout: 3000 }).then(() => true, () => false);
  await m.setViewportSize({ width: 320, height: 700 });
  await abrirHerramienta(m, 'condiciones');
  await m.waitForSelector('#condOverlay.open');
  r.estrecho = await m.evaluate(() => {
    const c = document.getElementById('condCuerpo');
    return document.documentElement.scrollWidth <= innerWidth && c.scrollWidth <= c.clientWidth
      && [...c.querySelectorAll('.cond-ir')].every(b => b.getBoundingClientRect().right <= innerWidth);
  });
  await movil.close();

  // Hub: también aparece (no usa la red)
  const ctxHub = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  const hub = await ctxHub.newPage();
  const frame = await cargarEnHub(hub);
  r.hub = await frame.evaluate(() => getComputedStyle(document.getElementById('condBtn')).display !== 'none');
  await ctxHub.close();
  r.ok = Object.values(r).every(Boolean);
  return r;
}

// Guía de fármacos (docs/farmacologia.md, paso 2): diálogo centrado con las
// 13 familias plegadas y en orden, sin bloque de pendientes (ya no queda
// ninguna) y acabando en su pie; dentro, «✨ IA» con contexto (por encima del
// velo) y citas; farmacosPreguntarIA() abre «Preguntar a la IA» en la
// modalidad «Fármacos»; en móvil desde «Herramientas», atrás cierra; 320 px;
// en el hub, visible y sin el atajo a la IA.
async function checkFarmacos(browser, errors) {
  const r = {};
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  await portapapelesPropio(context);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (farmacos): ${err.message}`));
  await abrirApp(page);
  await page.evaluate(() => {
    window.__iaHrefs = [];
    window.addEventListener('click', e => {
      const a = e.target.closest?.('a[target="_blank"]');
      if (a) { e.preventDefault(); setTimeout(() => window.__iaHrefs.push(a.href), 0); }
    }, true);
  });
  await page.click('#farmBtn');
  r.dialogo = await page.evaluate(() => {
    const p = document.getElementById('farmPanel').getBoundingClientRect();
    const fam = [...document.querySelectorAll('#farmCuerpo .farm-familia')];
    return document.getElementById('farmOverlay').classList.contains('open') && p.width <= 560 && Math.abs(p.left + p.width / 2 - innerWidth / 2) < 2
      && fam.map(f => f.dataset.familia).join() === 'aine,corticoides,antitromboticos,opioides,gabapentinoides,antidepresivos,sedantes,estatinas,fluoroquinolonas,betabloqueantes,antihipertensivos,antidiabeticos,hueso' && fam.every(f => !f.open);
  });
  // Sin familias pendientes: ni bloque ni atajo, y la guía acaba en su pie, sin huecos
  r.sinPendientes = await page.evaluate(() => {
    const c = document.getElementById('farmCuerpo');
    const ultimo = [...c.children].at(-1);
    return !c.querySelector('.farm-pendientes, .farm-preguntar') && ultimo?.classList.contains('cond-pie') && ultimo.textContent.trim().length > 20
      && [...c.children].every(e => e.textContent.trim().length > 0);
  });
  await page.click('[data-familia="hueso"] > summary');
  r.hueso = await page.evaluate(() => [...document.querySelectorAll('[data-familia="hueso"] .farm-apartado')].map(a => a.dataset.apartado).join() === 'dolor,visceral,ejercicio,sueno,consultar'
    && document.querySelectorAll('[data-familia="hueso"] .farm-apartado .cita').length > 20
    && document.querySelector('[data-familia="hueso"]').textContent.includes('Fractura atípica de fémur'));
  await page.click('[data-familia="hueso"] > summary');
  await page.click('[data-familia="aine"] > summary');
  r.apartados = await page.evaluate(() => [...document.querySelectorAll('[data-familia="aine"] .farm-apartado')].map(a => a.dataset.apartado).join() === 'dolor,visceral,ejercicio,sueno,consultar'
    && document.querySelectorAll('[data-familia="aine"] .farm-apartado .cita').length > 3);
  // «Ficha técnica (CIMA)»: un enlace por principio activo al buscador de CIMA, en otra
  // pestaña y sin nada en la URL; al tocarlo se copia el nombre (portapapeles propio)
  const { CIMA_BUSCADOR } = await import(new URL('../lib/farmacos.js', import.meta.url));
  r.cima = await page.evaluate(base => {
    const as = [...document.querySelectorAll('[data-familia="aine"] .farm-cima a')];
    const vis = el => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
    return as.length === 6 && as.every(a => a.target === '_blank' && a.rel === 'noopener noreferrer' && vis(a)
      && a.href === base && a.textContent === `${a.dataset.cima} ↗`)
      && !document.querySelector('#farmCuerpo iframe');
  }, CIMA_BUSCADOR);
  await page.click('[data-familia="aine"] .farm-cima a[data-cima="naproxeno"]');
  r.cimaCopia = await page.waitForFunction(base => document.getElementById('appToast')?.textContent.startsWith('«naproxeno» copiado')
    && window.__iaHrefs.at(-1) === base, CIMA_BUSCADOR, { timeout: 3000 }).then(() => true, () => false)
    && await page.evaluate(() => navigator.clipboard.readText()) === 'naproxeno';
  // Volver de otra pestaña (CIMA) o de otra app: la guía sigue abierta, con la familia
  // desplegada y el mismo scroll; solo se cierra la tarjeta de una cita
  // Con la guía desplazada, toca una cita que esté a la vista (sin que Playwright mueva el scroll)
  await page.evaluate(() => { document.getElementById('farmCuerpo').scrollTop = 200; });
  await page.waitForTimeout(100);   // que pase el evento scroll antes de abrir la tarjeta (un scroll > 24 px la cierra)
  await page.evaluate(() => {
    const panel = document.getElementById('farmCuerpo');
    const p = panel.getBoundingClientRect();
    [...document.querySelectorAll('[data-familia="aine"] .farm-apartado .cita')]
      .find(c => { const b = c.getBoundingClientRect(); return b.top > p.top + 40 && b.bottom < p.bottom - 40; })?.click();
  });
  const conFicha = await page.waitForSelector('#citaFicha:not([hidden])', { timeout: 3000 }).then(() => true, () => false);
  r.vuelta = conFicha && await page.evaluate(async () => {
    const panel = document.getElementById('farmCuerpo');
    const antes = panel.scrollTop;
    const ver = v => { Object.defineProperty(document, 'visibilityState', { value: v, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); };
    ver('hidden');
    await new Promise(r => setTimeout(r, 50));
    ver('visible');
    delete document.visibilityState;
    const ficha = document.getElementById('citaFicha');
    return document.getElementById('farmOverlay').classList.contains('open')
      && document.querySelector('[data-familia="aine"]').open && antes > 0 && panel.scrollTop === antes
      && ficha.hidden;
  });
  // «✨ IA» del primer párrafo: visible sobre el velo y con la familia como contexto
  await page.click('[data-familia="aine"] .farm-apartado p .ia-parrafo-ir');
  await page.waitForTimeout(150);
  r.ia = await page.evaluate(() => {
    const q = decodeURIComponent((window.__iaHrefs.at(-1) || '').split('q=')[1] || '').replace(/\+/g, ' ');
    return q.includes('«AINE (antiinflamatorios no esteroideos)»') && q.includes('Alivian el dolor');
  });
  await page.click('[data-familia="aine"] .farm-apartado p .ia-elegir');
  r.menuEncima = await page.evaluate(() => {
    const m = document.getElementById('iaMenu');
    if (!m || m.hidden) return false;
    const b = m.getBoundingClientRect();
    return document.elementFromPoint(b.left + b.width / 2, b.top + 10)?.closest('#iaMenu') === m;
  });
  await page.keyboard.press('Escape');
  // farmacosPreguntarIA() sigue expuesta (sin botón mientras no haya pendientes)
  if (await page.evaluate(() => document.getElementById('farmOverlay').classList.contains('open'))) {
    await page.evaluate(() => window.farmacosPreguntarIA());
    r.preguntar = await page.waitForFunction(() => !document.getElementById('farmOverlay').classList.contains('open')
      && document.getElementById('preguntaOverlay').classList.contains('open')
      && document.querySelector('#preguntaTipos .option-btn.selected')?.dataset.tipo === 'farmacos', null, { timeout: 3000 }).then(() => true, () => false);
    await page.keyboard.press('Escape');
  } else r.preguntar = 'Escape cerró la guía con el menú abierto';
  await page.click('#farmBtn');
  await page.keyboard.press('Escape');
  r.escape = await page.evaluate(() => !document.getElementById('farmOverlay').classList.contains('open'));
  await page.emulateMedia({ media: 'print' });
  r.sinImprimir = await page.evaluate(() => getComputedStyle(document.getElementById('farmBtn')).display === 'none');
  await context.close();

  const movil = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
  const m = await movil.newPage();
  m.on('pageerror', err => errors.push(`pageerror (farmacos móvil): ${err.message}`));
  await abrirApp(m);
  await m.evaluate(() => { window.state.maxVisitedIdx = 2; window.goToPhase(2); });
  await abrirHerramienta(m, 'farmacos');
  await m.waitForSelector('#farmOverlay.open');
  r.hoja = await m.waitForFunction(() => {
    const p = document.getElementById('farmPanel').getBoundingClientRect();
    return Math.round(p.width) === innerWidth && Math.abs(p.bottom - innerHeight) < 2;
  }, null, { timeout: 3000 }).then(() => true, () => false)
    && await m.evaluate(() => getComputedStyle(document.getElementById('farmBtn')).display === 'none');
  r.atras = await atrasDesdeHerramienta(m, 'farmOverlay') && await m.evaluate(() => window.state.currentPhase === 2);
  await m.setViewportSize({ width: 320, height: 700 });
  await abrirHerramienta(m, 'farmacos');
  await m.waitForSelector('#farmOverlay.open');
  await m.tap('[data-familia="aine"] > summary');
  r.estrecho = await m.evaluate(() => {
    const c = document.getElementById('farmCuerpo');
    return document.documentElement.scrollWidth <= innerWidth && c.scrollWidth <= c.clientWidth;
  });
  await movil.close();

  const ctxHub = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  const hub = await ctxHub.newPage();
  const frame = await cargarEnHub(hub);
  r.hub = await frame.evaluate(() => {
    if (getComputedStyle(document.getElementById('farmBtn')).display === 'none') return false;
    window.abrirFarmacos();
    const b = document.querySelector('#farmCuerpo .farm-preguntar');
    document.querySelector('[data-familia="aine"]').open = true;
    const cima = document.querySelector('[data-familia="aine"] .farm-cima');
    return (!b || getComputedStyle(b).display === 'none') && !!cima && getComputedStyle(cima).display !== 'none';
  });
  await ctxHub.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

// Guía «Efectos del ejercicio» (docs/efectos-ejercicio.md): diálogo centrado
// con la hipoalgesia escrita, los otros bloques pendientes y la leyenda de
// niveles; chips de nivel pulsables con su ficha, «✨ IA» con el bloque como
// contexto y el apartado «paciente» sin chip; Escape, impresión, móvil desde «Herramientas» (atrás
// cierra), 320 px, cabecera sin desbordar a 769 px y el hub.
async function checkEjercicio(browser, errors) {
  const r = {};
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (ejercicio): ${err.message}`));
  await abrirApp(page);
  await page.evaluate(() => {
    window.__iaHrefs = [];
    window.addEventListener('click', e => {
      const a = e.target.closest?.('a[target="_blank"]');
      if (a) { e.preventDefault(); setTimeout(() => window.__iaHrefs.push(a.href), 0); }
    }, true);
  });
  await page.click('#ejercicioBtn');
  r.dialogo = await page.evaluate(() => {
    const p = document.getElementById('ejercicioPanel').getBoundingClientRect();
    // Los cuatro bloques escritos: ya no se pinta el apartado de pendientes
    return document.getElementById('ejercicioOverlay').classList.contains('open') && p.width <= 560 && Math.abs(p.left + p.width / 2 - innerWidth / 2) < 2
      && [...document.querySelectorAll('#ejercicioCuerpo .ej-bloque')].map(b => b.dataset.bloque).join() === 'hipoalgesia,mecanotransduccion,antiinflamatorio,centrales,ortostatica,hipermovilidad,embarazo'
      && !document.querySelector('#ejercicioCuerpo .ej-pendientes')
      && document.querySelectorAll('#ejercicioCuerpo .ej-niveles li').length === 3;
  });
  await page.keyboard.press('Escape');
  r.escape = await page.evaluate(() => !document.getElementById('ejercicioOverlay').classList.contains('open'));
  await page.click('#ejercicioBtn');
  await page.click('[data-bloque="hipoalgesia"] > summary');
  r.bloque = await page.evaluate(() => {
    const b = document.querySelector('[data-bloque="hipoalgesia"]');
    return [...b.querySelectorAll('.ej-apartado')].map(a => a.dataset.apartado).join() === 'que,evidencia,consulta,paciente'
      && b.querySelectorAll('button.ej-nivel').length === 13
      && !b.querySelector('[data-apartado="paciente"] .ej-nivel')
      && b.querySelectorAll('.ej-cuerpo .cita').length > 5
      && !!b.querySelector('.ej-mas');
  });
  await page.click('[data-bloque="hipoalgesia"] [data-apartado="evidencia"] p:first-of-type button.ej-nivel');
  r.ficha = await page.evaluate(() => {
    const f = document.getElementById('ejNivelFicha');
    return !!f && !f.hidden && f.textContent.includes('Efecto medido en personas') && Number(getComputedStyle(f).zIndex) > 999;
  });
  await page.keyboard.press('Escape');
  r.fichaEscape = await page.evaluate(() => document.getElementById('ejNivelFicha').hidden
    && document.getElementById('ejercicioOverlay').classList.contains('open'));
  await page.click('[data-bloque="hipoalgesia"] [data-apartado="que"] p .ia-parrafo-ir');
  await page.waitForTimeout(150);
  r.ia = await page.evaluate(() => {
    const q = decodeURIComponent((window.__iaHrefs.at(-1) || '').split('q=')[1] || '').replace(/\+/g, ' ');
    return q.includes('Hipoalgesia inducida por el ejercicio') && q.includes('Una sola sesión de ejercicio');
  });
  await page.keyboard.press('Escape');
  await page.emulateMedia({ media: 'print' });
  r.sinImprimir = await page.evaluate(() => getComputedStyle(document.getElementById('ejercicioBtn')).display === 'none');
  await context.close();

  // La cabecera de escritorio más estrecha (769 px) cabe con el icono nuevo
  const justo = await browser.newContext({ viewport: { width: 769, height: 800 } });
  const j = await justo.newPage();
  await abrirApp(j);
  r.cabecera = await j.evaluate(() => {
    const h = document.querySelector('.app-header');
    return document.documentElement.scrollWidth <= innerWidth && h.scrollWidth <= h.clientWidth + 1
      && getComputedStyle(document.getElementById('ejercicioBtn')).display !== 'none';
  });
  await justo.close();

  const movil = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
  const m = await movil.newPage();
  m.on('pageerror', err => errors.push(`pageerror (ejercicio móvil): ${err.message}`));
  await abrirApp(m);
  await m.evaluate(() => { window.state.maxVisitedIdx = 2; window.goToPhase(2); });
  await abrirHerramienta(m, 'ejercicio');
  await m.waitForSelector('#ejercicioOverlay.open');
  r.hoja = await m.waitForFunction(() => {
    const p = document.getElementById('ejercicioPanel').getBoundingClientRect();
    return Math.round(p.width) === innerWidth && Math.abs(p.bottom - innerHeight) < 2;
  }, null, { timeout: 3000 }).then(() => true, () => false)
    && await m.evaluate(() => getComputedStyle(document.getElementById('ejercicioBtn')).display === 'none');
  r.atras = await atrasDesdeHerramienta(m, 'ejercicioOverlay') && await m.evaluate(() => window.state.currentPhase === 2);
  await m.setViewportSize({ width: 320, height: 700 });
  await abrirHerramienta(m, 'ejercicio');
  await m.waitForSelector('#ejercicioOverlay.open');
  r.estrecho = await m.evaluate(() => {
    const c = document.getElementById('ejercicioCuerpo');
    return document.documentElement.scrollWidth <= innerWidth && c.scrollWidth <= c.clientWidth;
  });
  await movil.close();

  const ctxHub = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  const hub = await ctxHub.newPage();
  const frame = await cargarEnHub(hub);
  r.hub = await frame.evaluate(() => {
    if (getComputedStyle(document.getElementById('ejercicioBtn')).display === 'none') return false;
    window.abrirEjercicio();
    return document.getElementById('ejercicioOverlay').classList.contains('open');
  });
  await ctxHub.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

async function checkCuestionarios(browser, errors) {
  const r = {};
  const { CUESTIONARIOS } = await import(new URL('../data/cuestionarios.js', import.meta.url));
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (cuestionarios): ${err.message}`));
  await abrirApp(page);
  const abierto = () => page.evaluate(() => document.getElementById('cuestOverlay').classList.contains('open'));
  const res = () => page.textContent('#cuestResultado');
  const toca = (n, v) => page.click(`#cuestCuerpo .cuest-item[data-item="${n}"] .cuest-op[data-valor="${v}"]`);
  await page.click('#cuestBtn');
  r.dialogo = await page.evaluate(n => {
    const p = document.getElementById('cuestPanel').getBoundingClientRect();
    return p.width > 420 && p.width <= 560 && Math.abs(p.left + p.width / 2 - innerWidth / 2) < 2
      && document.querySelectorAll('#cuestCuerpo .cuest-tarjeta').length === n;
  }, CUESTIONARIOS.length);
  await page.click('[data-cuest="phq9"]');
  for (const [n, v] of [[1, 2], [2, 2], [3, 1], [4, 2], [5, 1], [6, 1], [7, 1], [8, 1]]) await toca(n, v);
  r.incompleto = /8\/9/.test(await res()) && /Falta 1 ítem: 9/.test(await res());
  await toca(9, 1);
  const conAlerta = await res();
  r.phq9 = /12\/27/.test(conAlerta) && /Síntomas depresivos moderados/.test(conAlerta) && /Ítem 9 positivo/.test(conAlerta);
  await toca(9, 1);   // segundo toque: deselecciona
  r.segundoToque = !/Ítem 9 positivo/.test(await res()) && /8\/9/.test(await res());
  await toca(9, 0);
  await page.click('[data-cuest-volver]');
  r.tarjeta = /11\/27 · Síntomas depresivos moderados/.test(await page.textContent('[data-cuest="phq9"]'));
  await page.click('[data-cuest="orebro"]');
  await toca(5, 0); await toca(5, 4); await toca(5, 4);
  r.marcas = await page.evaluate(() => JSON.stringify(window.state.cuestionarios.orebro?.r?.[5]) === '[0]');
  // Borrar: pregunta, borra y vuelve al mismo cuestionario
  await page.click('[data-cuest-borrar]');
  await page.waitForSelector('#confirmBanner');
  await page.click('#confirmAction');
  await page.waitForFunction(() => document.getElementById('cuestOverlay').classList.contains('open'));
  r.borrar = await page.evaluate(() => !window.state.cuestionarios.orebro && !!document.querySelector('#cuestCuerpo [data-item="25"]'));
  await page.keyboard.press('Escape');
  r.escape = !(await abierto());
  // Fase 5
  await page.evaluate(() => { Object.assign(window.state, { region: 'hombro', maxVisitedIdx: 5 }); window.buildResults(); window.goToPhase(5); });
  r.fase5 = await page.evaluate(() => {
    const c = document.getElementById('cuestFase5');
    return !!c && !c.hidden && /PHQ-9: 11\/27 — Síntomas depresivos moderados/.test(c.textContent);
  });
  await context.close();

  // Enlaces «Calcular»: fase 1 (Örebro y unidimensionales) y badge del PROM (4b y 5)
  const ctxEnl = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const e = await ctxEnl.newPage();
  e.on('pageerror', err => errors.push(`pageerror (calcular): ${err.message}`));
  await e.goto(BASE_URL, { waitUntil: 'networkidle' });
  await e.click('button[onclick="selectPsico(this, \'Alto\')"]');
  await e.click('#psico_miedo .option-btn:has-text("Sí")');
  r.calcFase1 = await e.evaluate(() =>
    !!document.querySelector('#psicoToolSuggest [data-cuest-abrir="orebro"]')
    && [...document.querySelectorAll('#psicoRecomendacion [data-cuest-abrir]')].map(b => b.dataset.cuestAbrir).join() === 'fabq,tsk11,pcs');
  await e.click('#psicoToolSuggest [data-cuest-abrir="orebro"]');
  r.calcAbre = await e.evaluate(() => document.getElementById('cuestOverlay').classList.contains('open')
    && !!document.querySelector('#cuestCuerpo [data-item="25"]'));
  await e.keyboard.press('Escape');
  await e.click('#psicoRecomendacion [data-cuest-abrir="tsk11"]');
  for (let n = 1; n <= 11; n++) await e.click(`#cuestCuerpo .cuest-item[data-item="${n}"] .cuest-op[data-valor="2"]`);
  await e.keyboard.press('Escape');
  r.calcRefresca = await e.evaluate(() => {
    const b = document.querySelector('#psicoRecomendacion [data-cuest-abrir="tsk11"]');
    return !!b && /TSK-11 · 22\/44 ✓/.test(b.textContent) && b.classList.contains('cuest-calc-hecho') && document.activeElement === b;
  });
  await e.evaluate(() => {
    Object.assign(window.state, { region: 'lumbar', activeHypotheses: ['lu1'], maxVisitedIdx: 5 });
    window.goToPhase('4b');
  });
  r.calcProm4b = await e.evaluate(() => [...document.querySelectorAll('#hypothesisCards .cuest-calc [data-cuest-abrir]')].map(b => b.dataset.cuestAbrir).join() === 'odi,rmdq');
  await e.evaluate(() => { window.buildResults(); window.goToPhase(5); });
  r.calcProm5 = await e.evaluate(() => [...document.querySelectorAll('#phase5 .cuest-calc [data-cuest-abrir]')].map(b => b.dataset.cuestAbrir).join() === 'odi,rmdq');
  await e.click('#phase5 [data-cuest-abrir="odi"]');
  r.calcAbreOdi = await e.evaluate(() => /Oswestry/.test(document.getElementById('cuestCuerpo').textContent));
  await e.keyboard.press('Escape');
  await e.emulateMedia({ media: 'print' });
  r.calcSinImprimir = await e.evaluate(() => [...document.querySelectorAll('#phase5 .cuest-calc')].every(c => getComputedStyle(c).display === 'none'));
  await ctxEnl.close();

  // Móvil: hoja inferior, atrás cierra en la misma fase; 320 px sin desbordar
  const movil = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
  const m = await movil.newPage();
  m.on('pageerror', err => errors.push(`pageerror (cuestionarios móvil): ${err.message}`));
  await m.goto(BASE_URL, { waitUntil: 'networkidle' });
  await abrirHerramienta(m, 'cuestionarios');
  await m.waitForSelector('#cuestOverlay.open');
  // Tras la animación de entrada (desliza desde abajo)
  r.hoja = await m.waitForFunction(() => {
    const p = document.getElementById('cuestPanel').getBoundingClientRect();
    return Math.round(p.width) === innerWidth && Math.abs(p.bottom - innerHeight) < 2;
  }, null, { timeout: 3000 }).then(() => true, () => false);
  // Cabecera: un solo botón «Herramientas» en vez de tres iconos, y el menú
  // se cierra al elegir (la herramienta pone su entrada encima de la suya)
  r.herramientas = await m.evaluate(() => {
    const ve = id => getComputedStyle(document.getElementById(id)).display !== 'none';
    return ve('herramientasBtn') && !ve('tejidosBtn') && !ve('cuestBtn') && !ve('preguntaIABtn')
      && !document.getElementById('herramientasOverlay').classList.contains('open');
  });
  // Tarjeta con descripción larga: sigue debajo del nombre (sin columna aparte)
  // y el estado empieza en el mismo borde que el nombre
  r.tarjetaLarga = await m.evaluate(() => {
    const t = document.querySelector('[data-cuest="orebro"]');
    const nombre = t.querySelector('.cuest-tarjeta-nombre').getBoundingClientRect();
    const lineas = [...t.querySelector('.cuest-tarjeta-titulo').getClientRects()];
    const estado = t.querySelector('.cuest-tarjeta-estado').getBoundingClientRect();
    return lineas.length > 1 && Math.abs(lineas[1].left - nombre.left) < 2
      && Math.abs(estado.left - nombre.left) < 2 && estado.top >= lineas.at(-1).bottom - 1;
  });
  r.atras = await atrasDesdeHerramienta(m, 'cuestOverlay') && await m.evaluate(() => window.state.currentPhase === 1);
  await m.setViewportSize({ width: 320, height: 700 });
  await abrirHerramienta(m, 'cuestionarios');
  await m.tap('[data-cuest="cadc"]');
  r.estrecho = await m.evaluate(() => {
    const c = document.getElementById('cuestCuerpo');
    const ops = [...document.querySelectorAll('#cuestCuerpo .cuest-item[data-item="1"] .cuest-op')];
    return c.scrollWidth <= c.clientWidth && document.documentElement.scrollWidth <= innerWidth
      && ops.length === 11 && ops.every(o => o.getBoundingClientRect().width >= 40)
      // Dos filas como la EVA (0–4 / 5–10), cada una de borde a borde, sin hueco
      && [ops.slice(0, 5), ops.slice(5)].every(fila => {
        const rs = fila.map(o => o.getBoundingClientRect());
        const caja = ops[0].parentElement.getBoundingClientRect();
        return rs.every(x => Math.abs(x.top - rs[0].top) < 1) && Math.abs(rs[0].left - caja.left) < 1 && Math.abs(rs.at(-1).right - caja.right) < 1;
      }) && Math.abs(ops[5].getBoundingClientRect().top - ops[4].getBoundingClientRect().bottom - 6) < 1;
  });
  // Opciones de texto (una respuesta o varias): dos columnas, la última a todo el ancho si son impares
  // (Örebro, ítems 6 y 5); con una opción larga, una por fila de borde a borde (VISA-A)
  await m.tap('[data-cuest-volver]');
  await m.tap('[data-cuest="orebro"]');
  const dosColumnas = sel => m.evaluate(sel => {
    const ops = [...document.querySelectorAll(sel)].map(o => o.getBoundingClientRect());
    const caja = document.querySelector(sel).parentElement.getBoundingClientRect();
    return ops.length > 2 && Math.abs(ops[0].top - ops[1].top) < 1 && ops[1].left > ops[0].right
      && Math.abs(ops[0].left - caja.left) < 1 && Math.abs(ops[1].right - caja.right) < 1
      && ops.every(x => x.height >= 40)
      && (ops.length % 2 === 0 || (Math.abs(ops.at(-1).left - caja.left) < 1 && Math.abs(ops.at(-1).right - caja.right) < 1));
  }, sel);
  r.lista = await dosColumnas('#cuestCuerpo .cuest-item[data-item="6"] .cuest-op')
    && await dosColumnas('#cuestCuerpo .cuest-item[data-item="5"] .cuest-op');
  await m.tap('[data-cuest-volver]');
  await m.tap('[data-cuest="visaa"]');
  r.largas = await m.evaluate(() => {
    const cont = [...document.querySelectorAll('#cuestCuerpo .cuest-ops-largas')];
    return cont.length > 0 && cont.every(c => {
      const ops = [...c.querySelectorAll('.cuest-op')].map(o => o.getBoundingClientRect()), caja = c.getBoundingClientRect();
      return ops.every((x, i) => Math.abs(x.left - caja.left) < 1 && Math.abs(x.right - caja.right) < 1 && (i === 0 || x.top > ops[i - 1].bottom));
    });
  });
  r.cabecera = await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth
    && document.getElementById('themeBtn').getBoundingClientRect().right <= innerWidth);
  await movil.close();

  // En el hub también (no usa red)
  const hubCtx = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  const frame = await cargarEnHub(await hubCtx.newPage());
  r.hub = await frame.evaluate(() => getComputedStyle(document.getElementById('cuestBtn')).display !== 'none');
  await hubCtx.close();
  r.ok = Object.values(r).every(Boolean);
  return r;
}

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
  await abrirApp(page);
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
  // Sus fuentes, enlazadas (el registro llega con import()): una por clave, en pestaña nueva;
  // tocar dentro de la tarjeta (fuera del enlace) no la cierra
  const nFuentes = TIEMPOS_TEJIDO.grupos.flatMap(g => g.filas).find(f => f.id === 'menisco_sutura').fuentes.length;
  await page.waitForFunction(() => document.querySelector('#tejInfo .tej-fuente-enlace'), null, { timeout: 5000 }).catch(() => {});
  r.infoFuentes = await page.evaluate(n => {
    const a = [...document.querySelectorAll('#tejInfo .tej-fuente-enlace')];
    // En línea con « · »: varias por línea, y el « · » del principio de cada línea queda
    // recortado (el <li> empieza antes que la caja que lo contiene)
    const dd = document.querySelector('#tejInfo .tej-info-fuentes dd').getBoundingClientRect();
    const lis = [...document.querySelectorAll('#tejInfo .tej-fuentes-lista li')].map(li => li.getBoundingClientRect());
    const lineas = new Set(lis.map(r => Math.round(r.top)));
    const inicioLinea = [...lineas].map(t => lis.filter(r => Math.round(r.top) === t).sort((x, y) => x.left - y.left)[0]);
    return a.length === n && a.every(x => x.target === '_blank' && /noopener/.test(x.rel) && /^https:\/\//.test(x.href))
      && lineas.size < n && inicioLinea.every(r => r.left < dd.left) && lis.every(r => r.right <= dd.right + 1);
  }, nFuentes);
  await page.click('#tejInfo .tej-info-fuentes dt');
  r.infoFuentes = r.infoFuentes && !!(await info());
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
  // «Este paciente» (Fase J): con un esguince lateral activo (y Post-quirúrgico, puesto
  // arriba) se abre con esa pastilla, solo la reparación quirúrgica, desplegada; tocarla
  // otra vez enseña todo, y reabrir vuelve a ella. Sin hipótesis con filas, no aparece.
  await page.evaluate(() => { state.activeHypotheses = ['tp1']; });
  await page.click('#tejidosBtn');
  r.paciente = await page.evaluate(() => {
    const p = document.querySelector('#tejidosCuerpo .tej-filtro-btn.activo');
    const b = [...document.querySelectorAll('#tejidosCuerpo .tej-barra')];
    return p?.dataset.grupo === 'paciente' && p === document.querySelector('#tejidosCuerpo .tej-filtro-btn')
      && b.length === 1 && b[0].dataset.barra === 'tobillo_lateral_cirugia' && b[0].checkVisibility()
      && document.querySelector('#tejidosCuerpo .tej-paciente')?.textContent.includes('Esguince Lateral Agudo');
  });
  await page.click(pastilla('paciente'));
  r.paciente = r.paciente && await barras() === nFilas;
  await page.keyboard.press('Escape');
  await page.click('#tejidosBtn');
  r.paciente = r.paciente && await barras() === 1;
  await page.keyboard.press('Escape');
  await page.evaluate(() => { state.activeHypotheses = ['h2']; });
  await page.click('#tejidosBtn');
  r.paciente = r.paciente && await barras() === nFilas && !(await page.$(pastilla('paciente')))
    && await page.evaluate(() => /no tiene plazo propio en este panel: Síndrome de Pinzamiento/.test(document.querySelector('#tejidosCuerpo .tej-paciente')?.textContent || ''));
  await page.keyboard.press('Escape');
  // Lumbalgia inespecífica: solo con cronología aguda va a «Lumbalgia aguda»
  await page.evaluate(() => { state.activeHypotheses = ['lu1']; state.cronologia = 'Agudo (<6 semanas)'; });
  await page.click('#tejidosBtn');
  r.paciente = r.paciente && await page.evaluate(() => [...document.querySelectorAll('#tejidosCuerpo .tej-barra')].map(b => b.dataset.barra).join() === 'lumbalgia_aguda');
  await page.keyboard.press('Escape');
  await page.evaluate(() => { state.cronologia = ''; });
  await page.evaluate(() => { state.activeHypotheses = []; });
  r.sinPayload = await page.evaluate(async () => !/tejid|Remodelaci/i.test(JSON.stringify((await import('./app.js')).buildPhysiQPayload())));
  await context.close();

  // Móvil táctil: hoja inferior a todo el ancho; atrás la cierra en la misma fase
  const ctxMovil = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const movil = await ctxMovil.newPage();
  movil.on('pageerror', err => errors.push(`pageerror (tejidos móvil): ${err.message}`));
  await movil.goto(BASE_URL, { waitUntil: 'networkidle' });
  await irAFase2(movil, 'rodilla');
  await abrirHerramienta(movil, 'tejidos');
  await movil.waitForTimeout(400);
  const hoja = await movil.evaluate(() => {
    const p = document.getElementById('tejidosPanel').getBoundingClientRect();
    const t = document.getElementById('tejidosTitulo');
    return Math.round(p.width) === innerWidth && Math.round(p.bottom) === innerHeight && t.scrollHeight <= t.clientHeight + 1;
  });
  r.movil = hoja && await atrasDesdeHerramienta(movil, 'tejidosOverlay')
    && await movil.evaluate(() => !document.getElementById('tejidosOverlay').classList.contains('open') && state.currentPhase === 2);
  // 320 px: cabecera y panel sin desbordar, etiquetas del eje enteras
  await movil.setViewportSize({ width: 320, height: 640 });
  await movil.evaluate(() => document.body.classList.add('modo-breve'));
  r.cabecera320 = await movil.evaluate(() => {
    const items = [...document.querySelectorAll('.header-right > *')].filter(e => e.offsetParent).map(e => e.getBoundingClientRect().right);
    return Math.max(...items) <= innerWidth + 1 && document.querySelector('.logo').getBoundingClientRect().right <= document.querySelector('.header-right').getBoundingClientRect().left + 1;
  });
  await movil.evaluate(() => document.body.classList.remove('modo-breve'));
  await abrirHerramienta(movil, 'tejidos');
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
    return b.left >= 15 && b.right <= innerWidth - 15 && b.top >= 0 && b.bottom <= innerHeight && document.documentElement.scrollWidth <= innerWidth
      // Fuentes en táctil: líneas de 24 px, pero cada enlace responde 3 px por encima y por
      // debajo de su caja (zona de toque de 32 px, ::after) y dentro de la tarjeta
      && [...i.querySelectorAll('.tej-fuente-enlace')].length > 0
      && [...i.querySelectorAll('.tej-fuente-enlace')].every(a => {
        const r = a.getBoundingClientRect(), x = r.left + r.width / 2;
        // Si el punto cae sobre el texto de un enlace de la línea de al lado, gana ese (es lo que
        // dice el CSS); depende de dónde parta la línea en cada máquina (CI, 2026-10)
        const enlaces = [...i.querySelectorAll('.tej-fuente-enlace')];
        const sobreOtro = y => enlaces.some(o => { if (o === a) return false; const q = o.getBoundingClientRect(); return x >= q.left && x <= q.right && y >= q.top && y <= q.bottom; });
        const toca = y => document.elementFromPoint(x, y)?.closest('.tej-fuente-enlace') === a || sobreOtro(y);
        return r.height >= 24 && r.height < 32 && toca(r.top - 3) && toca(r.bottom + 3) && toca(r.top + r.height / 2) && r.right <= b.right + 1;
      });
  });
  // Nota de grupo (nervio periférico): sus fuentes, plegadas y enlazadas al abrirlas
  r.grupoFuentes = await movil.evaluate(() => {
    const d = document.querySelector('#tejidosCuerpo .tej-grupo-fuentes');
    if (!d || d.open || d.querySelector('ul').checkVisibility()) return false;
    d.open = true;
    return [...d.querySelectorAll('.tej-fuente-enlace')].length === d.querySelector('ul').dataset.claves.split('|').length;
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
// Como el real: un widget por tarjeta (informe con IA y plan con IA, lib/turnstile.js);
// reset(id) vuelve a resolver ese widget y emite un token nuevo
const TURNSTILE_SIMULADO = `const _w = {}; let _n = 0;
  window.turnstile = { render(el, o) { const id = 'w' + (++_n); _w[id] = o; el.textContent = 'turnstile simulado'; setTimeout(() => o.callback('tok-' + Date.now()), 30); return id; },
    reset(id) { setTimeout(() => _w[id] && _w[id].callback('tok-' + Date.now()), 30); } };
  window.__iaTurnstileOnload && window.__iaTurnstileOnload();`;
async function mockWorkerYTurnstile(context, captura) {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Expose-Headers': 'X-PhysiQ-Mode' };
  await context.route('**/turnstile/v0/api.js*', route => route.fulfill({ contentType: 'application/javascript', body: TURNSTILE_SIMULADO }));
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
  ['<span class="btn-text-full">Compartir igualmente</span><span class="btn-text-short">Compartir</span>', false],
];
async function checkDialogos(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 320, height: 700 } });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (diálogos): ${err.message}`));
  await abrirApp(page);
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
  await abrirApp(page);
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
  // «✨ IA» en la pauta y el pronóstico (ampliar-ia.js): nada del paciente
  // dentro de un [data-ia-ctx] (ni la tarjeta pq1 ni la nota del protocolo)
  r.iaSinPaciente = await page.evaluate(() => {
    const conIA = [...document.querySelectorAll('#resultsContent [data-ia-ctx]')];
    const texto = conIA.map(c => c.textContent + c.dataset.iaCtx).join(' ');
    // (la rama «Tras meniscectomía» de ro2 es de data/: se buscan las restricciones y el nombre de pq1)
    return conIA.length > 0 && !/pivotar|Postoperatorio/i.test(texto)
      && !document.querySelector('#resultsContent .nota-posq [data-ia-ctx], #resultsContent .nota-posq[data-ia-ctx]')
      && !document.querySelector('#resultsContent .nota-posq')?.closest('[data-ia-ctx]');
  });
  await fase5({ ...rodilla, mecanismo: 'Traumático', treeAnswers: { ro_step1: 'menisco' } }, 'ro2', 'rama');
  await page.evaluate(() => {
    window.__iaHrefs = [];
    window.addEventListener('click', e => {
      const a = e.target.closest?.('a[target="_blank"]');
      if (a) { window.__iaHrefs.push(a.href); e.preventDefault(); }
    });
  });
  const promptDe = async (sel, abrir) => {
    await page.evaluate(([sel, abrir]) => { document.querySelectorAll(abrir).forEach(d => { d.open = true; }); document.querySelector(sel).scrollIntoView({ block: 'center' }); }, [sel, abrir]);
    await page.click(sel);
    return page.evaluate(() => decodeURIComponent(((window.__iaHrefs.at(-1) || '').split('q=')[1] || '').replace(/\+/g, ' ')));
  };
  const qPauta = await promptDe('#resultsContent details.pauta-det .pauta-det-resto .ia-parrafo-ir', '#resultsContent details.pauta-det');
  const primera = await page.textContent('#resultsContent details.pauta-det .pauta-det-primera');
  r.iaPauta = qPauta.includes('la pauta de tratamiento para la hipótesis') && qPauta.includes('situación «Rotura traumática, sin cirugía»')
    && qPauta.includes('(región rodilla)') && qPauta.includes('Qué quiere decir en la práctica clínica')
    && qPauta.includes(primera.trim().slice(0, 30)) && !qPauta.includes('Ver pauta completa') && !qPauta.includes('Ocultar pauta');
  const qOtra = await promptDe('#resultsContent details.pauta-otras .ia-parrafo-ir', '#resultsContent details.pauta-otras');
  r.iaOtra = qOtra.includes('la pauta de tratamiento') && !qOtra.includes('Rotura traumática, sin cirugía»');
  const qPron = await promptDe('#resultsContent details.pronostico-det .ia-parrafo-ir', '#resultsContent details.pronostico-det');
  r.iaPronostico = qPron.includes('el pronóstico y los criterios de derivación de la hipótesis') && qPron.includes('Qué quiere decir en la práctica clínica');
  await context.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

// «✨ IA» en los textos clínicos de las fases 3 a 6 (ampliar-ia.js): el resumen
// de irritabilidad, el criterio de un test de la 4b, una línea del recuadro de
// una condición especial y el plan de la fase 6, cada uno con su contexto y el
// enfoque práctico; nunca un dato del paciente (la cabecera del recuadro, el
// signo comparable, las restricciones de la cirugía), ni al tocar «✨ IA» ni al
// seleccionar texto.
async function checkIAFases(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (IA fases 3–6): ${err.message}`));
  await abrirApp(page);
  await walkRegion(page, 'lumbar');
  await page.evaluate(() => {
    window.__iaHrefs = [];
    window.addEventListener('click', e => {
      const a = e.target.closest?.('a[target="_blank"]');
      if (a) { window.__iaHrefs.push(a.href); e.preventDefault(); }
    });
  });
  const prompt = sel => page.evaluate(sel => {
    const a = document.querySelector(sel);
    if (!a) return null;
    a.click();
    return decodeURIComponent(((window.__iaHrefs.at(-1) || '').split('q=')[1] || '').replace(/\+/g, ' '));
  }, sel);
  const practica = q => !!q && q.includes('Qué quiere decir en la práctica clínica') && q.includes('(región lumbar)');
  const r = {};
  const q3 = await prompt('#irritabilidadResumen .ia-parrafo-ir');
  r.fase3 = practica(q3) && q3.includes('la irritabilidad baja (modelo SINSS de Maitland)');
  const q4b = await prompt('#hypothesisCards .test-criterion .ia-parrafo-ir');
  r.fase4b = practica(q4b) && q4b.includes('el test clínico «');
  // Recuadro del lupus en la fase 5: la línea sí, la cabecera con los datos no
  await page.evaluate(() => { Object.assign(state.lupus, { estado: 'diagnosticado', corticoides: 'a' }); buildResults(); });
  const q5 = await prompt('#resultsContent .les-fase5 .ia-parrafo-ir');
  r.fase5 = practica(q5) && q5.includes('para un paciente con «lupus eritematoso sistémico»') && !q5.includes('Diagnosticado');
  // Fase 6: reevaluación con el signo comparable aparte, escalón y lo que nunca sale
  await page.evaluate(() => { document.getElementById('signoComparable').value = state.signoComparable = 'SECRETO-123'; Object.assign(state.lupus, { estado: '' }); buildResults(); });
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  const qRe = await prompt('#planContenido li:has(.ia-excluir) .ia-parrafo-ir');
  r.reevaluacion = practica(qRe) && qRe.includes('apartado «Reevaluación') && !qRe.includes('SECRETO')
    && await page.evaluate(() => document.querySelector('#planContenido li .ia-excluir').textContent.includes('SECRETO-123'));
  const qEsc = await prompt('#planContenido .plan-escalon .ia-parrafo-ir');
  r.escalon = practica(qEsc) && qEsc.includes('apartado «terapia manual, ');
  const seleccionar = sel => page.evaluate(sel => {
    const el = document.querySelector(sel);
    el.scrollIntoView({ block: 'center' });
    const rango = document.createRange();
    rango.selectNodeContents(el);
    const s = getSelection(); s.removeAllRanges(); s.addRange(rango);
  }, sel);
  await seleccionar('#planContenido li .ia-excluir');
  await page.waitForTimeout(400);
  r.seleccionExcluida = await page.evaluate(() => document.getElementById('iaBarra').hidden);
  await seleccionar('#planContenido .plan-escalon [data-ia-parrafo]');
  await page.waitForSelector('#iaBarra:not([hidden])');
  r.seleccionEscalon = true;
  await page.evaluate(() => getSelection().removeAllRanges());
  // Posquirúrgico: la pauta de pq1 (restricciones del paciente) sin «✨ IA»
  await page.evaluate(() => {
    state.mecanismo = 'Post-quirúrgico';
    Object.assign(state.cirugia, { intervencion: 'Artrodesis L4-L5', protocolo: 'Escrito', restricciones: 'RESTRICCION-XYZ' });
    state.planTratamiento = null;
    goToPhase(5); buildResults();
  });
  await page.click('#btnIrPlan');
  // El plan anterior sigue pintado hasta que se repinta: esperar al nuevo, no a cualquier tarjeta
  await page.waitForFunction(() => document.getElementById('planContenido')?.textContent.includes('RESTRICCION-XYZ'), null, { timeout: 5000 }).catch(() => {});
  r.nadaDelPaciente = await page.evaluate(() => {
    const muestra = document.getElementById('planContenido').textContent.includes('RESTRICCION-XYZ');
    const enIA = [...document.querySelectorAll('#phase3 [data-ia-ctx], #phase5 [data-ia-ctx], #planContenido [data-ia-ctx]')].some(c => {
      const x = c.cloneNode(true); x.querySelectorAll('.ia-excluir').forEach(e => e.remove());
      return /RESTRICCION|SECRETO|Artrodesis/.test(x.textContent + c.dataset.iaCtx);
    });
    return muestra && !enIA;
  });
  await context.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

async function checkBotonesTactil(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (táctil): ${err.message}`));
  await abrirApp(page);
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
  await abrirApp(page);
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
  // «¿Reiniciar o borrar?»: plegado al abrir el panel; abierto (con el párrafo de
  // fuera del hub) en una pantalla baja, el panel no se sale y se desplaza dentro
  await page.setViewportSize({ width: 320, height: 568 });
  r.ayudaReiniciar = await page.evaluate(() => {
    const d = document.querySelector('#sessionPanel .session-ayuda');
    if (!d || d.open) return false;
    d.open = true;
    const panel = document.getElementById('sessionPanel');
    const rp = panel.getBoundingClientRect();
    const ok = rp.top >= 0 && /Borrar sesión/.test(d.textContent) && /Exportar/.test(d.textContent)
      && (panel.scrollHeight <= panel.clientHeight || getComputedStyle(panel).overflowY === 'auto');
    d.open = false;
    return ok;
  });
  await page.setViewportSize({ width: 320, height: 640 });

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
    && Object.values(r.borrarCancelar).every(v => v === true) && r.borrada && r.nombreEscapado && r.restaurado && r.fase5Visible && r.rechazaMalo && r.caben320 && r.ayudaReiniciar && r.fasesMovil;
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
    await abrirApp(page);
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
    await abrirApp(page);
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
  await abrirApp(page);
  await page.evaluate(async m => (await import('./app.js')).showToast(m, 'warning'), corto);
  const m = await medir(page);
  r.escritorio = m && m.lineas === 1 && Math.abs(m.left - m.right) <= 1 ? true : m;
  await context.close();
  r.ok = [320, 390].every(w => Object.values(r[w]).every(x => x === true)) && r.escritorio === true;
  return r;
}

async function checkInformeNarrativo(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await portapapelesPropio(context);
  const captura = [];
  await mockWorkerYTurnstile(context, captura);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (informe IA): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console (informe IA): ${msg.text()}`); });
  await abrirApp(page);
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
  await abrirApp(page);
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
      await abrirApp(page);
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
  await abrirApp(page);
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
// pantalla, nunca dos a la vez; toda la banda (no solo «↑ volver») lleva a la
// cabecera; caben a 320 px.
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
    await abrirApp(page);
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
    // Toda la banda vuelve, no solo «↑ volver»: se pulsa sobre el nombre
    await page.click('#fpBannerName');
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
  await abrirApp(page);
  await page.click('#fpDet_comun > summary');
  await page.waitForSelector('#fpBody_comun .fp-text, #fpBody_comun button');
  await irA((await posiciones('#fpDet_comun')).dentro);
  const b320 = await bandas();
  res.cabe320 = b320.fp && await page.evaluate(() => {
    const b = document.getElementById('fpContextBanner');
    const btn = b.querySelector('.context-banner-back').getBoundingClientRect();
    return b.scrollWidth <= b.clientWidth && btn.right <= innerWidth && b.offsetHeight < 60;
  });
  // Las tres bandas son un solo botón, sin otro botón dentro, y se anuncian como «Volver a …»
  res.botones = await page.evaluate(() => ['fpContextBanner', 'sisContextBanner', 'hypContextBanner'].every(id => {
    const b = document.getElementById(id);
    return b.tagName === 'BUTTON' && !b.querySelector('button') && /^Volver a /.test(b.querySelector('.sr-only')?.textContent || '');
  }));
  res.ok = res.w390_ok && res.w1280_ok && res.cabe320 && res.botones;
  return res;
}

// Fase 6 en cervical (L3, docs/plan-tratamiento.md): por la interfaz real hasta
// la 5 y a la 6. La red de seguridad es la de cervical (arterias siempre;
// médula con ce3/ce12), nunca la de cola de caballo de lumbar.
async function checkFase6Cervical(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await portapapelesPropio(context);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (fase 6 cervical): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error' && !KNOWN_NOISE.some(n => msg.text().includes(n))) errors.push(`console (fase 6 cervical): ${msg.text()}`); });
  await page.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', route => route.fulfill({
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'X-PhysiQ-Mode': 'demo' },
    contentType: 'application/json', body: JSON.stringify({ ok: true, mode: 'demo', routes: { report: 'demo' }, demoOnly: false }),
  }));
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const r = {};
  await walkRegion(page, 'cervical');
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.plan = await page.evaluate(() => state.currentPhase === 6 && !document.querySelector('#planContenido .alert-info')
    && document.querySelectorAll('#planContenido .card').length === 5);
  const { D } = await page.evaluate(async () => ({ D: JSON.parse(JSON.stringify(await import('./data/plan-tratamiento.js'))) }));
  // Varios síntomas (Fase N, paso 4) en cervical: un P2 en el brazo más
  // irritable e «Independiente» dosifica el plan y avisa; sin él, nada
  r.sinSecundarios = await page.evaluate(() => !document.getElementById('planDosifica'));
  await page.evaluate(() => {
    state.sintomaPrincipal.zonas = ['cuello'];
    state.sintomasSecundarios = [{ zonas: ['brazo'], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }];
    planElegir('sesion', 'primera');
  });
  await page.waitForSelector('#planDosifica');
  r.dosificaP2 = await page.evaluate(() => {
    const t = document.getElementById('planContenido').textContent;
    return document.getElementById('planDosifica').textContent.includes('P2 · Brazo, el síntoma más irritable')
      && t.includes('NRS 9/10') && t.includes('Un síntoma va independiente de P1') && t.includes('(P2 · Brazo)');
  });
  await page.evaluate(() => { state.sintomasSecundarios = []; state.sintomaPrincipal.zonas = []; planElegir('sesion', 'primera'); });
  await page.waitForFunction(() => !document.getElementById('planDosifica'));
  const casa = async () => {
    await page.fill('#planNotasCasa', 'Movilidad del cuello');
    await page.fill('#planParar', 'Si aumenta el hormigueo');
    await page.click('#btnCompartirPlan');
    await page.click('#compartirOpciones .compartir-op >> nth=2');
    await page.waitForFunction(() => !document.getElementById('compartirOverlay').classList.contains('open'));
    return page.evaluate(() => navigator.clipboard.readText());
  };
  const t1 = await casa();
  r.arterial = t1.trimEnd().endsWith(D.TEXTOS_CASA.alarmaArterial.texto) && !t1.includes(D.TEXTOS_CASA.alarmaNeuro.texto);
  // Con ce3 (radiculopatía) elegida a mano
  await page.evaluate(() => { if (!state.activeHypotheses.includes('ce3')) state.activeHypotheses.push('ce3'); state.planTratamiento.hipotesis = ['ce3']; goToPhase(5); goToPhase(6); });
  await page.waitForSelector('#planContenido .card');
  const html = await page.textContent('#planContenido');
  r.ce3 = html.includes(D.AVISOS.manipulacionCervical) && html.includes(D.TEXTOS_SESION.reevaluacionRadicular) && html.includes(D.TEXTOS_SESION.cierreMedula)
    && !html.includes(D.TEXTOS_SESION.cierreNeuro);
  const t2 = await casa();
  r.casaCe3 = t2.trimEnd().endsWith(`${D.TEXTOS_CASA.alarmaMedula.texto}\n\n${D.TEXTOS_CASA.alarmaArterial.texto}`);
  await page.evaluate(() => { if (!state.activeHypotheses.includes('ce12')) state.activeHypotheses.push('ce12'); state.planTratamiento.hipotesis = ['ce12']; goToPhase(5); goToPhase(6); });
  await page.waitForSelector('#planContenido .card');
  r.ce12 = (await page.textContent('#planContenido')).includes(D.AVISOS.sinTerapiaManualAguda)
    && (await page.textContent('#planContenido')).includes(D.FRECUENCIA_PAUTA.ce12.nota);
  await page.evaluate(() => { if (!state.activeHypotheses.includes('ce13')) state.activeHypotheses.push('ce13'); state.planTratamiento.hipotesis = ['ce13']; goToPhase(5); goToPhase(6); });
  await page.waitForSelector('#planContenido .card');
  const t13 = await page.textContent('#planContenido');
  r.ce13 = t13.includes(D.TEXTOS_SESION.cantidadReid) && !t13.includes(D.TEXTOS_SESION.cantidad) && t13.includes(D.AVISOS.vertigo);
  await context.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

// Fase 6 en hombro (L3, primera región periférica; decisiones 43–56 de
// docs/plan-tratamiento.md): por la interfaz real hasta la 5 (el camino de
// siempre la primera opción da h6, dolor referido desde el cuello) y a la 6.
// h6 va como columna y añade la red arterial de cervical a la cardiaca de
// hombro; h1 usa los escalones, la cantidad y la progresión de Peripheral con
// su aviso; h10, el de artrosis; h2 + h6, el aviso de dos familias.
async function checkFase6Hombro(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await portapapelesPropio(context);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (fase 6 hombro): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error' && !KNOWN_NOISE.some(n => msg.text().includes(n))) errors.push(`console (fase 6 hombro): ${msg.text()}`); });
  await page.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', route => route.fulfill({
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'X-PhysiQ-Mode': 'demo' },
    contentType: 'application/json', body: JSON.stringify({ ok: true, mode: 'demo', routes: { report: 'demo' }, demoOnly: false }),
  }));
  await abrirApp(page);
  const r = {};
  await walkRegion(page, 'hombro');
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.plan = await page.evaluate(() => state.currentPhase === 6 && !document.querySelector('#planContenido .alert-info')
    && document.querySelectorAll('#planContenido .card').length === 5 && state.planTratamiento.hipotesis[0] === 'h6');
  const { D } = await page.evaluate(async () => ({ D: JSON.parse(JSON.stringify(await import('./data/plan-tratamiento.js'))) }));
  const casa = async () => {
    await page.fill('#planNotasCasa', 'Movilidad del hombro');
    await page.fill('#planParar', 'Si aumenta el dolor por la noche');
    await page.click('#btnCompartirPlan');
    await page.click('#compartirOpciones .compartir-op >> nth=2');
    await page.waitForFunction(() => !document.getElementById('compartirOverlay').classList.contains('open'));
    return page.evaluate(() => navigator.clipboard.readText());
  };
  const elegir = ids => page.evaluate(ids => {
    for (const id of ids) if (!state.activeHypotheses.includes(id)) state.activeHypotheses.push(id);
    state.planTratamiento.hipotesis = ids; goToPhase(5); goToPhase(6);
  }, ids).then(() => page.waitForSelector('#planContenido .card')).then(() => page.textContent('#planContenido'));
  const t6 = await page.textContent('#planContenido');
  r.h6 = t6.includes(D.TEXTOS_SESION.cantidad) && !t6.includes(D.TEXTOS_SESION.cantidadPeriferica)
    && t6.includes(D.TEXTOS_SESION.cierreCardiaco) && t6.includes(D.TEXTOS_SESION.cierreArterial)
    && !t6.includes(D.AVISOS.manipulacionCervical) && !t6.includes(D.TEXTOS_SESION.cierreMedula);
  const c6 = await casa();
  r.casaH6 = c6.trimEnd().endsWith(`${D.TEXTOS_CASA.alarmaCardiaca.texto}\n\n${D.TEXTOS_CASA.alarmaArterial.texto}`)
    && !c6.includes(D.TEXTOS_CASA.alarmaNeuro.texto) && !c6.includes(D.TEXTOS_CASA.alarmaMedula.texto);
  const t1 = await elegir(['h1']);
  const nivelB = await page.evaluate(() => state.planTratamiento.nivel);
  r.h1 = t1.includes(D.AVISOS.capsulitisPrecoz) && t1.includes(D.AVISOS.capsulitisEstadios) && t1.includes(D.TEXTOS_SESION.cantidadPeriferica) && !t1.includes(D.TEXTOS_SESION.cantidad)
    && t1.includes(D.PROGRESION_PERIFERICA) && t1.includes(D.REGLAS_MES_PERIFERICAS[0]) && !t1.includes(D.REGLAS_MES[2])
    && Object.values(D.ESCALONES_PERIFERICOS).some(e => t1.includes(e.texto)) && !Object.values(D.ESCALONES).some(e => t1.includes(e.texto))
    && !t1.includes(D.TEXTOS_SESION.cierreArterial) && nivelB === 'B';
  const c1 = await casa();
  r.casaH1 = c1.trimEnd().endsWith(D.TEXTOS_CASA.alarmaCardiaca.texto) && !c1.includes(D.TEXTOS_CASA.alarmaArterial.texto);
  r.h10 = (await elegir(['h10'])).includes(D.AVISOS.artrosis);
  r.h4 = (await elegir(['h4'])).includes(D.AVISOS.inestabilidad);
  r.dosFamilias = (await elegir(['h2', 'h6'])).includes(D.AVISOS.dosFamilias);
  await context.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

// Fase 6 en codo (L3, segunda periférica; decisiones 64–71 de
// docs/plan-tratamiento.md): por la interfaz real hasta la 5 (la primera
// opción de cada paso da co7, rotura distal del bíceps, «Derivar», y después
// co3, co8, co1 y co4) y a la 6. co7 no se puede elegir y la hipótesis por
// defecto es co3, con el plan B (su pauta usó 2 o más sesiones por semana);
// el resto, a mano: co1 con los escalones, la cantidad,
// la progresión y las reglas de Peripheral, su aviso y la red de infección;
// co3 con su aviso y la nota de 2 o más sesiones por semana; co8 con la
// exploración del nervio y sin red neurológica; co5, co6 y co15 con sus
// avisos; varios síntomas; y, con cirugía, el aviso de prótesis.
async function checkFase6Codo(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await portapapelesPropio(context);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (fase 6 codo): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error' && !KNOWN_NOISE.some(n => msg.text().includes(n))) errors.push(`console (fase 6 codo): ${msg.text()}`); });
  await page.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', route => route.fulfill({
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'X-PhysiQ-Mode': 'demo' },
    contentType: 'application/json', body: JSON.stringify({ ok: true, mode: 'demo', routes: { report: 'demo' }, demoOnly: false }),
  }));
  await abrirApp(page);
  const r = {};
  await walkRegion(page, 'codo');
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.plan = await page.evaluate(() => state.currentPhase === 6 && !document.querySelector('#planContenido .alert-info')
    && document.querySelectorAll('#planContenido .card').length === 5
    && state.activeHypotheses.includes('co7') && !!document.querySelector('.plan-hip.plan-hip-no')
    && state.planTratamiento.hipotesis.join() === 'co3' && state.planTratamiento.frecuencia === 'B');
  const { D } = await page.evaluate(async () => ({ D: JSON.parse(JSON.stringify(await import('./data/plan-tratamiento.js'))) }));
  const casa = async () => {
    await page.fill('#planNotasCasa', 'Ejercicio de los extensores de la muñeca');
    await page.fill('#planParar', 'Si el dolor dura más de un día');
    await page.click('#btnCompartirPlan');
    await page.click('#compartirOpciones .compartir-op >> nth=2');
    await page.waitForFunction(() => !document.getElementById('compartirOverlay').classList.contains('open'));
    return page.evaluate(() => navigator.clipboard.readText());
  };
  const elegir = ids => page.evaluate(ids => {
    for (const id of ids) if (!state.activeHypotheses.includes(id)) state.activeHypotheses.push(id);
    state.planTratamiento.hipotesis = ids; goToPhase(5); goToPhase(6);
  }, ids).then(() => page.waitForSelector('#planContenido .card')).then(() => page.textContent('#planContenido'));
  const t1 = await elegir(['co1']);
  r.co1 = t1.includes(D.AVISOS.epicondilalgiaLateral) && t1.includes(D.TEXTOS_SESION.cantidadPeriferica) && !t1.includes(D.TEXTOS_SESION.cantidad)
    && t1.includes(D.PROGRESION_PERIFERICA) && t1.includes(D.REGLAS_MES_PERIFERICAS[0]) && !t1.includes(D.REGLAS_MES[2])
    && Object.values(D.ESCALONES_PERIFERICOS).some(e => t1.includes(e.texto)) && !Object.values(D.ESCALONES).some(e => t1.includes(e.texto))
    && t1.includes(D.TEXTOS_SESION.cierreInfeccion) && !t1.includes(D.TEXTOS_SESION.cierreCardiaco) && !t1.includes(D.TEXTOS_SESION.cierreArterial);
  // Tabla por hipótesis (docs/efectos-ejercicio.md): la epicondilalgia lateral
  // enlaza «Carga y adaptación del tejido» aunque la irritabilidad no lo diga
  r.enlaceHipCo1 = await page.evaluate(() => {
    const e = document.querySelector('#planSesion .plan-ejercicio');
    return e?.dataset.bloqueEjercicio === 'mecanotransduccion' && e.hasAttribute('data-por-hipotesis')
      && e.querySelector('.plan-ayuda').textContent.includes('Tendinopatía Lateral');
  });
  const c1 = await casa();
  r.casaCo1 = c1.trimEnd().endsWith(D.TEXTOS_CASA.alarmaInfeccion.texto)
    && ![D.TEXTOS_CASA.alarmaCardiaca, D.TEXTOS_CASA.alarmaArterial, D.TEXTOS_CASA.alarmaNeuro, D.TEXTOS_CASA.alarmaMedula].some(a => c1.includes(a.texto));
  // Varios síntomas (Fase N, paso 4) en codo
  await page.evaluate(() => {
    state.sintomaPrincipal.zonas = ['codo_lat'];
    state.sintomasSecundarios = [{ zonas: ['antebrazo'], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }];
    planElegir('sesion', 'primera');
  });
  await page.waitForSelector('#planDosifica');
  r.dosificaP2 = await page.evaluate(() => {
    const t = document.getElementById('planContenido').textContent;
    return document.getElementById('planDosifica').textContent.includes('P2 · Antebrazo, el síntoma más irritable')
      && t.includes('NRS 9/10') && t.includes('Un síntoma va independiente de P1') && t.includes('(P2 · Antebrazo)');
  });
  await page.evaluate(() => { state.sintomasSecundarios = []; state.sintomaPrincipal.zonas = []; planElegir('sesion', 'primera'); });
  await page.waitForFunction(() => !document.getElementById('planDosifica'));
  const t3 = await elegir(['co3']);
  r.co3 = t3.includes(D.AVISOS.rigidezCodo) && t3.includes(D.FRECUENCIA_PAUTA.co3.nota);
  const t8 = await elegir(['co8']);
  r.co8 = t8.includes(D.AVISOS.nervioCodo) && t8.includes(D.TEXTOS_SESION.reevaluacionNervio) && !t8.includes(D.TEXTOS_SESION.reevaluacionRadicular)
    && !t8.includes(D.TEXTOS_SESION.cierreNeuro) && !t8.includes(D.TEXTOS_SESION.cierreMedula);
  r.co5 = (await elegir(['co5'])).includes(D.AVISOS.inestabilidadCodo);
  r.co6 = (await elegir(['co6'])).includes(D.AVISOS.radiohumeral);
  r.co15 = (await elegir(['co15'])).includes(D.AVISOS.esqueletoInmaduro);
  // Con mecanismo Post-quirúrgico, el aviso condicional de prótesis (periféricas)
  await page.evaluate(() => { state.mecanismo = 'Post-quirúrgico'; });
  r.protesis = (await elegir(['co3'])).includes(D.AVISOS.protesis);
  await context.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

// Fase 6 en rodilla (L3, tercera periférica; decisiones 72–80): por la
// interfaz real hasta la 6 (primera opción en cada paso del árbol), y después
// las hipótesis con aviso elegidas a mano.
async function checkFase6Rodilla(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await portapapelesPropio(context);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (fase 6 rodilla): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error' && !KNOWN_NOISE.some(n => msg.text().includes(n))) errors.push(`console (fase 6 rodilla): ${msg.text()}`); });
  await page.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', route => route.fulfill({
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'X-PhysiQ-Mode': 'demo' },
    contentType: 'application/json', body: JSON.stringify({ ok: true, mode: 'demo', routes: { report: 'demo' }, demoOnly: false }),
  }));
  await abrirApp(page);
  const r = {};
  await walkRegion(page, 'rodilla');
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.plan = await page.evaluate(() => state.currentPhase === 6 && !document.querySelector('#planContenido .alert-info')
    && document.querySelectorAll('#planContenido .card').length === 5
    && state.activeHypotheses.includes('ro11') && !!document.querySelector('.plan-hip.plan-hip-no')
    && state.planTratamiento.hipotesis.join() === 'ro4' && state.planTratamiento.frecuencia === 'A');
  const { D } = await page.evaluate(async () => ({ D: JSON.parse(JSON.stringify(await import('./data/plan-tratamiento.js'))) }));
  const casa = async () => {
    await page.fill('#planNotasCasa', 'Sentadilla isométrica contra la pared');
    await page.fill('#planParar', 'Si el dolor pasa de 2/10 a la mañana siguiente');
    await page.click('#btnCompartirPlan');
    await page.click('#compartirOpciones .compartir-op >> nth=2');
    await page.waitForFunction(() => !document.getElementById('compartirOverlay').classList.contains('open'));
    return page.evaluate(() => navigator.clipboard.readText());
  };
  const elegir = ids => page.evaluate(ids => {
    for (const id of ids) if (!state.activeHypotheses.includes(id)) state.activeHypotheses.push(id);
    state.planTratamiento.hipotesis = ids; goToPhase(5); goToPhase(6);
  }, ids).then(() => page.waitForSelector('#planContenido .card')).then(() => page.textContent('#planContenido'));
  const t1 = await elegir(['ro1']);
  r.ro1 = t1.includes(D.AVISOS.artrosisRodilla) && !t1.includes(D.AVISOS.artrosis)
    && t1.includes(D.TEXTOS_SESION.cantidadPeriferica) && !t1.includes(D.TEXTOS_SESION.cantidad)
    && t1.includes(D.PROGRESION_PERIFERICA) && t1.includes(D.REGLAS_MES_PERIFERICAS[0]) && !t1.includes(D.REGLAS_MES[2])
    && Object.values(D.ESCALONES_PERIFERICOS).some(e => t1.includes(e.texto)) && !Object.values(D.ESCALONES).some(e => t1.includes(e.texto))
    && t1.includes(D.TEXTOS_SESION.cierreInfeccionRodilla) && t1.includes(D.TEXTOS_SESION.cierreTVP)
    && !t1.includes(D.TEXTOS_SESION.cierreInfeccion) && !t1.includes(D.TEXTOS_SESION.cierreCardiaco) && !t1.includes(D.TEXTOS_SESION.cierreArterial);
  const c1 = await casa();
  r.casaRo1 = c1.trimEnd().endsWith(`${D.TEXTOS_CASA.alarmaInfeccionRodilla.texto}\n\n${D.TEXTOS_CASA.alarmaTVP.texto}`)
    && ![D.TEXTOS_CASA.alarmaInfeccion, D.TEXTOS_CASA.alarmaCardiaca, D.TEXTOS_CASA.alarmaArterial, D.TEXTOS_CASA.alarmaNeuro, D.TEXTOS_CASA.alarmaMedula].some(a => c1.includes(a.texto));
  // Varios síntomas (Fase N, paso 4) en rodilla
  await page.evaluate(() => {
    state.sintomaPrincipal.zonas = ['rodilla_ant'];
    state.sintomasSecundarios = [{ zonas: ['pierna'], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }];
    planElegir('sesion', 'primera');
  });
  await page.waitForSelector('#planDosifica');
  r.dosificaP2 = await page.evaluate(() => {
    const t = document.getElementById('planContenido').textContent;
    return document.getElementById('planDosifica').textContent.includes('P2 · Pierna, el síntoma más irritable')
      && t.includes('NRS 9/10') && t.includes('Un síntoma va independiente de P1') && t.includes('(P2 · Pierna)');
  });
  await page.evaluate(() => { state.sintomasSecundarios = []; state.sintomaPrincipal.zonas = []; planElegir('sesion', 'primera'); });
  await page.waitForFunction(() => !document.getElementById('planDosifica'));
  // ro2: la rama de su pauta según el árbol
  await page.evaluate(() => { state.treeAnswers.ro_step1 = 'menisco'; });
  const t2 = await elegir(['ro2']);
  r.ro2 = t2.includes(D.AVISOS.menisco) && t2.includes('Rotura traumática: el ejercicio es una opción tan viable como la cirugía') && !t2.includes('Lesión degenerativa con síntomas');
  r.ro3 = (await elegir(['ro3'])).includes(D.AVISOS.patelofemoral);
  const t8 = await elegir(['ro8']);
  r.ro8 = t8.includes(D.AVISOS.ligamentoRodilla) && t8.includes(D.AVISOS.esguinceReciente);
  const t4 = await elegir(['ro4']);
  r.ro4 = t4.includes(D.AVISOS.ligamentoRodilla) && !t4.includes(D.AVISOS.esguinceReciente);
  r.ro5 = (await elegir(['ro5'])).includes(D.AVISOS.cargaRodilla);
  r.ro12 = (await elegir(['ro12'])).includes(D.AVISOS.rotulaInestable);
  const t15 = await elegir(['ro15']);
  r.ro15 = t15.includes(D.AVISOS.apofisitis) && t15.includes(D.FRECUENCIA_PAUTA.ro15.nota);
  r.ro18 = (await elegir(['ro18'])).includes(D.AVISOS.tibioperonea);
  const t19 = await elegir(['ro19']);
  r.ro19 = t19.includes(D.AVISOS.nervioPeroneo) && t19.includes(D.TEXTOS_SESION.reevaluacionNervio) && !t19.includes(D.TEXTOS_SESION.reevaluacionRadicular)
    && !t19.includes(D.TEXTOS_SESION.cierreNeuro) && !t19.includes(D.TEXTOS_SESION.cierreMedula) && t19.includes('Pauta a criterio del fisioterapeuta');
  // Con mecanismo Post-quirúrgico, el aviso condicional de prótesis y el de rodilla
  await page.evaluate(() => { state.mecanismo = 'Post-quirúrgico'; });
  const tp = await elegir(['ro1']);
  r.posq = tp.includes(D.AVISOS.protesis) && tp.includes(D.AVISOS.posqRodilla);
  await context.close();
  r.ok = Object.values(r).every(v => v === true);
  return r;
}

async function checkFase6Cadera(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await portapapelesPropio(context);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (fase 6 cadera): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error' && !KNOWN_NOISE.some(n => msg.text().includes(n))) errors.push(`console (fase 6 cadera): ${msg.text()}`); });
  await page.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', route => route.fulfill({
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'X-PhysiQ-Mode': 'demo' },
    contentType: 'application/json', body: JSON.stringify({ ok: true, mode: 'demo', routes: { report: 'demo' }, demoOnly: false }),
  }));
  await abrirApp(page);
  const r = {};
  await walkRegion(page, 'cadera');
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  r.plan = await page.evaluate(() => state.currentPhase === 6 && !document.querySelector('#planContenido .alert-info')
    && document.querySelectorAll('#planContenido .card').length === 5
    && state.planTratamiento.hipotesis.join() === 'ca10' && state.planTratamiento.frecuencia === 'A');
  const { D } = await page.evaluate(async () => ({ D: JSON.parse(JSON.stringify(await import('./data/plan-tratamiento.js'))) }));
  const RED = [D.TEXTOS_CASA.alarmaFracturaEstres, D.TEXTOS_CASA.alarmaInfeccionCadera, D.TEXTOS_CASA.alarmaTVP].map(a => a.texto);
  // ca10 (sacroilíaca), por defecto: familia columna y la red de cadera
  const t10 = await page.textContent('#planContenido');
  r.ca10 = t10.includes(D.TEXTOS_SESION.cantidad) && !t10.includes(D.TEXTOS_SESION.cantidadPeriferica) && t10.includes(D.REGLAS_MES[2])
    && Object.values(D.ESCALONES).some(e => t10.includes(e.texto))
    && t10.includes(D.TEXTOS_SESION.cierreFracturaEstres) && t10.includes(D.TEXTOS_SESION.cierreInfeccionCadera) && t10.includes(D.TEXTOS_SESION.cierreTVP);
  const casa = async () => {
    await page.fill('#planNotasCasa', 'Puente glúteo a dos piernas');
    await page.fill('#planParar', 'Si el dolor pasa de 5/10 o sigue a la mañana siguiente');
    await page.click('#btnCompartirPlan');
    await page.click('#compartirOpciones .compartir-op >> nth=2');
    await page.waitForFunction(() => !document.getElementById('compartirOverlay').classList.contains('open'));
    return page.evaluate(() => navigator.clipboard.readText());
  };
  const elegir = ids => page.evaluate(ids => {
    for (const id of ids) if (!state.activeHypotheses.includes(id)) state.activeHypotheses.push(id);
    state.planTratamiento.hipotesis = ids; goToPhase(5); goToPhase(6);
  }, ids).then(() => page.waitForSelector('#planContenido .card')).then(() => page.textContent('#planContenido'));
  const t1 = await elegir(['ca1']);
  r.ca1 = t1.includes(D.AVISOS.artrosisCadera) && !t1.includes(D.AVISOS.artrosis) && !t1.includes(D.AVISOS.artrosisRodilla)
    && t1.includes(D.TEXTOS_SESION.cantidadPeriferica) && !t1.includes(D.TEXTOS_SESION.cantidad)
    && t1.includes(D.PROGRESION_PERIFERICA) && t1.includes(D.REGLAS_MES_PERIFERICAS[0]) && !t1.includes(D.REGLAS_MES[2])
    && Object.values(D.ESCALONES_PERIFERICOS).some(e => t1.includes(e.texto)) && !Object.values(D.ESCALONES).some(e => t1.includes(e.texto))
    && t1.includes(D.FRECUENCIA_PAUTA.ca1.nota)
    && !t1.includes(D.TEXTOS_SESION.cierreInfeccionRodilla) && !t1.includes(D.TEXTOS_SESION.cierreInfeccion) && !t1.includes(D.TEXTOS_SESION.cierreCardiaco) && !t1.includes(D.TEXTOS_SESION.cierreArterial) && !t1.includes(D.TEXTOS_SESION.cierreNeuro);
  const c1 = await casa();
  r.casaCa1 = c1.trimEnd().endsWith(RED.join('\n\n'))
    && ![D.TEXTOS_CASA.alarmaInfeccionRodilla, D.TEXTOS_CASA.alarmaInfeccion, D.TEXTOS_CASA.alarmaCardiaca, D.TEXTOS_CASA.alarmaArterial, D.TEXTOS_CASA.alarmaNeuro, D.TEXTOS_CASA.alarmaMedula].some(a => c1.includes(a.texto));
  // Varios síntomas (Fase N, paso 4) en cadera
  await page.evaluate(() => {
    state.sintomaPrincipal.zonas = ['cadera_lat'];
    state.sintomasSecundarios = [{ zonas: ['muslo_ant'], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }];
    planElegir('sesion', 'primera');
  });
  await page.waitForSelector('#planDosifica');
  r.dosificaP2 = await page.evaluate(() => {
    const t = document.getElementById('planContenido').textContent;
    return document.getElementById('planDosifica').textContent.includes('P2 · Muslo anterior, el síntoma más irritable')
      && t.includes('NRS 9/10') && t.includes('Un síntoma va independiente de P1') && t.includes('(P2 · Muslo anterior)');
  });
  await page.evaluate(() => { state.sintomasSecundarios = []; state.sintomaPrincipal.zonas = []; planElegir('sesion', 'primera'); });
  await page.waitForFunction(() => !document.getElementById('planDosifica'));
  r.ca2 = (await elegir(['ca2'])).includes(D.AVISOS.pinzamientoCadera);
  const t4 = await elegir(['ca4']);
  r.ca4 = t4.includes(D.AVISOS.tendinopatiaGlutea) && t4.includes(D.FRECUENCIA_PAUTA.ca4.nota);
  const t11 = await elegir(['ca11']);
  r.ca11 = t11.includes(D.AVISOS.ingleAguda) && t11.includes(D.AVISOS.ingleDeportiva) && t11.includes(D.FRECUENCIA_PAUTA.ca11.nota);
  r.ca12 = (await elegir(['ca12'])).includes(D.AVISOS.inestabilidadCadera);
  const t16 = await elegir(['ca16']);
  r.ca16 = t16.includes(D.AVISOS.cargaCadera) && t16.includes(D.AVISOS.ingleDeportiva) && t16.includes(D.FRECUENCIA_PAUTA.ca16.nota);
  r.ca15 = (await elegir(['ca15'])).includes(D.AVISOS.sensibilizacionCentral);
  for (const [id, k] of [['ca7', 'gluteoProfundo'], ['ca14', 'nervioCadera']]) {
    const t = await elegir([id]);
    r[id] = t.includes(D.AVISOS[k]) && t.includes(D.TEXTOS_SESION.reevaluacionNervio) && !t.includes(D.TEXTOS_SESION.reevaluacionRadicular)
      && !t.includes(D.TEXTOS_SESION.cierreNeuro) && !t.includes(D.TEXTOS_SESION.cierreMedula) && t.includes('Pauta a criterio del fisioterapeuta');
  }
  // Con mecanismo Post-quirúrgico, el aviso condicional de prótesis y el de cadera
  await page.evaluate(() => { state.mecanismo = 'Post-quirúrgico'; });
  const tp = await elegir(['ca1']);
  r.posq = tp.includes(D.AVISOS.protesis) && tp.includes(D.AVISOS.posqCadera) && !tp.includes(D.AVISOS.posqRodilla);
  r.ok = Object.values(r).every(v => v === true);
  await context.close();
  return r;
}

// Fase 6 en tobillo y pie (L3, quinta y última periférica; decisiones 90–98):
// por la interfaz real hasta la 6 con la primera opción de cada paso; después,
// las hipótesis con aviso elegidas a mano.
async function checkFase6Tobillo(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await portapapelesPropio(context);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (fase 6 tobillo): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error' && !KNOWN_NOISE.some(n => msg.text().includes(n))) errors.push(`console (fase 6 tobillo): ${msg.text()}`); });
  await page.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', route => route.fulfill({
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'X-PhysiQ-Mode': 'demo' },
    contentType: 'application/json', body: JSON.stringify({ ok: true, mode: 'demo', routes: { report: 'demo' }, demoOnly: false }),
  }));
  await abrirApp(page);
  const r = {};
  await walkRegion(page, 'tobillo_pie');
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  const { D } = await page.evaluate(async () => ({ D: JSON.parse(JSON.stringify(await import('./data/plan-tratamiento.js'))) }));
  const RED = [D.TEXTOS_CASA.alarmaFracturaEstresPie, D.TEXTOS_CASA.alarmaInfeccionTobillo, D.TEXTOS_CASA.alarmaTVP].map(a => a.texto);
  // Por el camino de la primera opción: sin aviso de piloto, y las «Derivar» activas no se eligen
  r.plan = await page.evaluate(() => state.currentPhase === 6 && !document.querySelector('#planContenido .alert-info')
    && document.querySelectorAll('#planContenido .card').length === 5);
  // El camino activa primero tp37 (fractura de tobillo, «Derivar»), que no se
  // puede elegir: tp1 por defecto, con el plan A
  r.porDefecto = await page.evaluate(async () => {
    const { DOSIS_DERIVAR } = await import('./data/comun.js');
    const { HYPOTHESES } = await import('./data.js');
    return state.activeHypotheses[0] === 'tp37' && HYPOTHESES.tp37.dosis === DOSIS_DERIVAR
      && state.planTratamiento.hipotesis.join() === 'tp1' && state.planTratamiento.frecuencia === 'A';
  });
  const casa = async () => {
    await page.fill('#planNotasCasa', 'Equilibrio monopodal');
    await page.fill('#planParar', 'Si el dolor pasa de 5/10 o sigue a la mañana siguiente');
    await page.click('#btnCompartirPlan');
    await page.click('#compartirOpciones .compartir-op >> nth=2');
    await page.waitForFunction(() => !document.getElementById('compartirOverlay').classList.contains('open'));
    return page.evaluate(() => navigator.clipboard.readText());
  };
  const elegir = ids => page.evaluate(ids => {
    for (const id of ids) if (!state.activeHypotheses.includes(id)) state.activeHypotheses.push(id);
    state.planTratamiento.hipotesis = ids; goToPhase(5); goToPhase(6);
  }, ids).then(() => page.waitForSelector('#planContenido .card')).then(() => page.textContent('#planContenido'));
  // tp1: escalones, cantidad, progresión y reglas de Peripheral; su aviso; la red de tobillo y pie
  const t1 = await elegir(['tp1']);
  r.tp1 = t1.includes(D.AVISOS.esguinceTobillo)
    && t1.includes(D.TEXTOS_SESION.cantidadPeriferica) && !t1.includes(D.TEXTOS_SESION.cantidad)
    && t1.includes(D.PROGRESION_PERIFERICA) && t1.includes(D.REGLAS_MES_PERIFERICAS[0]) && !t1.includes(D.REGLAS_MES[2])
    && Object.values(D.ESCALONES_PERIFERICOS).some(e => t1.includes(e.texto)) && !Object.values(D.ESCALONES).some(e => t1.includes(e.texto))
    && t1.includes(D.TEXTOS_SESION.cierreFracturaEstresPie) && t1.includes(D.TEXTOS_SESION.cierreInfeccionTobillo) && t1.includes(D.TEXTOS_SESION.cierreTVP)
    && !t1.includes(D.TEXTOS_SESION.cierreRoturaAquiles) && !t1.includes(D.TEXTOS_SESION.cierreFracturaEstres) && !t1.includes(D.TEXTOS_SESION.cierreInfeccionRodilla)
    && !t1.includes(D.TEXTOS_SESION.cierreCardiaco) && !t1.includes(D.TEXTOS_SESION.cierreArterial) && !t1.includes(D.TEXTOS_SESION.cierreNeuro);
  const c1 = await casa();
  r.casaTp1 = c1.trimEnd().endsWith(RED.join('\n\n'))
    && ![D.TEXTOS_CASA.alarmaRoturaAquiles, D.TEXTOS_CASA.alarmaFracturaEstres, D.TEXTOS_CASA.alarmaInfeccionRodilla, D.TEXTOS_CASA.alarmaInfeccionCadera, D.TEXTOS_CASA.alarmaCardiaca, D.TEXTOS_CASA.alarmaArterial, D.TEXTOS_CASA.alarmaNeuro].some(a => c1.includes(a.texto));
  // Varios síntomas (Fase N, paso 4) en tobillo y pie
  await page.evaluate(() => {
    state.sintomaPrincipal.zonas = ['tobillo_lat'];
    state.sintomasSecundarios = [{ zonas: ['talon'], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: 9, irritabilidad: 'Alta', relacion: 'independiente' }];
    planElegir('sesion', 'primera');
  });
  await page.waitForSelector('#planDosifica');
  r.dosificaP2 = await page.evaluate(() => {
    const t = document.getElementById('planContenido').textContent;
    return document.getElementById('planDosifica').textContent.includes('P2 · Talón o planta, el síntoma más irritable')
      && t.includes('NRS 9/10') && t.includes('Un síntoma va independiente de P1') && t.includes('(P2 · Talón o planta)');
  });
  await page.evaluate(() => { state.sintomasSecundarios = []; state.sintomaPrincipal.zonas = []; planElegir('sesion', 'primera'); });
  await page.waitForFunction(() => !document.getElementById('planDosifica'));
  // tp8: los dos avisos y la rotura del Aquiles al final del programa para casa
  const t8 = await elegir(['tp8']);
  r.tp8 = t8.includes(D.AVISOS.aquiles) && t8.includes(D.AVISOS.monitorizacionDolor) && t8.includes(D.TEXTOS_SESION.cierreRoturaAquiles);
  r.casaTp8 = (await casa()).trimEnd().endsWith([...RED, D.TEXTOS_CASA.alarmaRoturaAquiles.texto].join('\n\n'));
  const t9 = await elegir(['tp9']);
  r.tp9 = t9.includes(D.AVISOS.aquilesInsercional) && !t9.includes(D.AVISOS.monitorizacionDolor) && t9.includes(D.TEXTOS_SESION.cierreRoturaAquiles);
  r.tp2 = (await elegir(['tp2'])).includes(D.AVISOS.sindesmosis);
  for (const [id, k] of [['tp14', 'tibialPosterior'], ['tp21', 'inestabilidadTobillo'], ['tp36', 'apofisitisPie']]) {
    const t = await elegir([id]);
    r[id] = t.includes(D.AVISOS[k]) && t.includes(D.FRECUENCIA_PAUTA[id].nota);
  }
  r.tp26 = (await elegir(['tp26'])).includes(D.AVISOS.talon);
  r.tp33 = (await elegir(['tp33'])).includes(D.AVISOS.fracturaEstresMetatarsiano);
  for (const [id, k] of [['tp16', 'nervioTobillo'], ['tp34', 'morton']]) {
    const t = await elegir([id]);
    r[id] = t.includes(D.AVISOS[k]) && t.includes(D.TEXTOS_SESION.reevaluacionNervio) && !t.includes(D.TEXTOS_SESION.reevaluacionRadicular)
      && !t.includes(D.TEXTOS_SESION.cierreNeuro) && !t.includes(D.TEXTOS_SESION.cierreMedula) && t.includes('Pauta a criterio del fisioterapeuta');
  }
  // Con mecanismo Post-quirúrgico, el aviso condicional de prótesis y el de tobillo y pie
  await page.evaluate(() => { state.mecanismo = 'Post-quirúrgico'; });
  const tq = await elegir(['tp21']);
  r.posq = tq.includes(D.AVISOS.protesis) && tq.includes(D.AVISOS.posqTobillo) && !tq.includes(D.AVISOS.posqCadera) && !tq.includes(D.AVISOS.posqRodilla);
  r.ok = Object.values(r).every(v => v === true);
  await context.close();
  return r;
}

// Fase 6 «Plan de tratamiento» (opcional; docs/plan-tratamiento.md): lumbar
// por la interfaz real hasta la 5 y de ahí a la 6 con «Plan de tratamiento →».
// Escritorio: paso 6 en la barra, hipótesis por defecto, gravedad e
// irritabilidad marcadas y editables (con irritabilidad alta no hay C), menú
// de compartir con los tres documentos (el de casa sin fuentes), vuelta a la
// 5 con los resultados, y la sesión restaurada en la 6 tras recargar. Una
// urgencia de la fase 2 bloquea el plan; sin región, pide elegirla en la
// fase 2. 320 px: sin desbordar, tarjetas a todo el ancho, barra y hoja de
// fases con la 6.
// «✨ Detallar con IA» de la fase 6 (plan-ia.js, solo standalone; Fase L, L4).
// Sin coste: worker y Turnstile simulados. El caso de Andrés se importa por el
// panel de sesión; con un informe con IA de dictado, el prompt lleva la
// transcripción y nunca el informe; el plan llega por SSE, las sugerencias se
// pintan aparte, la revisión señala la técnica por encima del escalón y el
// volumen sin marcar; «Programa para casa (IA)» no se comparte hasta revisar
// todo y sale sin marcas y con la red de seguridad; cambiar la frecuencia lo
// marca desactualizado; sigue tras recargar. En el hub, plan-ia.js ni se descarga.
const PLAN_IA_SIMULADO = `## SESIÓN
### REEVALUACIÓN (0–5 min)
- Slump izquierdo y exploración neurológica.
### INTERVENCIÓN PRINCIPAL (12–35 min)
- Slump sentado, 10 repeticiones lentas (sugerencia de la IA).
- Movilización PA de grado III en L5.
## PLAN DEL MES
- Sesión 2: reevaluación y progresar según el esquema.
## PROGRAMA PARA CASA
- Camina 10 minutos después de desayunar (sugerencia de la IA).
- Haz 3 series de 10 repeticiones.
Si notas adormecimiento entre las piernas o alrededor del ano, o cambios al orinar o al hacer de vientre, ve a urgencias hoy mismo.`;
async function checkPlanIA(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await portapapelesPropio(context);
  await context.addInitScript(k => { try { localStorage.setItem('physiq-license-key', k); } catch {} }, CLAVE_OK);
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Expose-Headers': 'X-PhysiQ-Mode' };
  const captura = [];
  await context.route('**/turnstile/v0/api.js*', route => route.fulfill({ contentType: 'application/javascript', body: TURNSTILE_SIMULADO }));
  await context.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', route => {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    if (req.url().endsWith('/validate')) return route.fulfill({ headers: { ...cors, 'X-PhysiQ-Mode': 'real' }, contentType: 'application/json',
      body: JSON.stringify({ ok: true, mode: 'real', routes: { report: 'real', email: 'demo' }, demoOnly: false }) });
    captura.push(req.postDataBuffer()?.toString('utf8') || '');
    const sse = (t, d) => `event: ${t}\ndata: ${JSON.stringify(d)}\n\n`;
    return route.fulfill({ headers: { ...cors, 'X-PhysiQ-Mode': 'real' }, contentType: 'text/event-stream',
      body: sse('transcript', { text: '(No disponible — informe basado exclusivamente en los datos de la valoración estructurada)' })
        + sse('report_chunk', { text: PLAN_IA_SIMULADO.slice(0, 200) }) + sse('report_chunk', { text: PLAN_IA_SIMULADO.slice(200) }) + sse('done', { success: true }) });
  });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (plan IA): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error' && !KNOWN_NOISE.some(n => msg.text().includes(n))) errors.push(`console (plan IA): ${msg.text()}`); });
  const r = {};
  await abrirApp(page);
  await page.click('#sessionBtn');
  await page.setInputFiles('#sessionImportFile', new URL('./fixtures/casos/valoracion-andres-molina-lumbar.json', import.meta.url).pathname);
  await page.waitForSelector('#confirmBanner');
  await Promise.all([page.waitForEvent('load'), page.click('#confirmAction')]);
  await page.waitForFunction(() => window.state?.currentPhase === 5 && state.patient === 'Andrés Molina');
  // Un informe con IA de dictado ya generado: el plan usa su transcripción
  await page.evaluate(() => { state.informeIA = { texto: 'TEXTO-DEL-INFORME', transcripcion: 'Dictado simulado: conduce cuarenta minutos.', conAudio: true, dictado: true, plantilla: 'narrativo', huella: 'x', fecha: new Date().toISOString() }; });
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planIA .pia-card');
  await page.waitForFunction(() => !document.getElementById('planIA').hidden && document.getElementById('piaGenerar') && !document.getElementById('piaGenerar').disabled, null, { timeout: 15000 });
  r.tarjeta = await page.evaluate(() => {
    const q = document.getElementById('piaQue').textContent;
    return q.includes('Nivel B · Muy suave') && q.includes('Plan A') && q.includes('Dolor Radicular Lumbar') && q.includes('dictado') && q.includes('La valoración cambió');
  });
  await page.click('#piaGenerar');
  await page.waitForFunction(() => !!state.planTratamiento?.ia?.texto, null, { timeout: 15000 });
  const prompt = captura[0] || '';
  r.prompt = prompt.includes('Dictado simulado: conduce cuarenta minutos.') && !prompt.includes('TEXTO-DEL-INFORME')
    && prompt.includes('Nivel elegido: B · escalón «Muy suave»') && prompt.includes('name="maxTokens"') && !prompt.includes('name="file"');
  await page.waitForSelector('#piaResultadoDet');
  await page.click('#piaResultadoDet > summary');
  r.sugerencias = await page.evaluate(() => {
    const s = [...document.querySelectorAll('.pia-plan .pia-sug')];
    return s.length === 2 && s.every(x => x.querySelector('.pia-sug-et')?.textContent === 'Sugerencia de la IA, sin fuente en PhysiQ')
      && !document.querySelector('.pia-plan').textContent.includes('(sugerencia de la IA)');
  });
  r.revision = await page.evaluate(() => {
    const t = document.getElementById('piaRevision').textContent;
    return t.includes('⚠ 3 puntos a revisar') && t.includes('técnica neural') && t.includes('Técnica por encima del escalón elegido (grado III)') && t.includes('3 series')
      && document.querySelectorAll('#piaComprobar li').length === 4;   // con transcripción, una más
  });
  // Compartir: sin revisar, el programa para casa (IA) no se comparte
  await page.evaluate(() => navigator.clipboard.writeText('VACIO'));
  await page.click('#btnCompartirPlan');
  await page.waitForSelector('#compartirOverlay.open');
  r.opciones = await page.evaluate(() => {
    const t = document.getElementById('compartirOpciones').textContent;
    return t.includes('Plan detallado (IA)') && t.includes('7 puntos sin revisar') && t.includes('Programa para casa (IA)') && t.includes('marca todos los puntos');
  });
  // Los toasts se apuntan al aparecer: con carga, uno dura menos que lo que tarda en mirarse
  await page.evaluate(() => {
    window.__toasts = [];
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.id === 'appToast') window.__toasts.push(n.textContent); })))
      .observe(document.body, { childList: true });
  });
  await page.click('.compartir-op[onclick="compartirCasaIA()"]');
  const toastBloqueo = await page.waitForFunction(() => window.__toasts.some(t => t.includes('marca como revisados los 7 puntos')), null, { timeout: 10000 }).then(() => true, () => false);
  const portaBloqueo = await page.evaluate(() => navigator.clipboard.readText());
  r.casaBloqueada = toastBloqueo && portaBloqueo === 'VACIO';
  if (!r.casaBloqueada) r.casaBloqueadaDetalle = { toasts: await page.evaluate(() => window.__toasts), portapapeles: portaBloqueo.slice(0, 60) };
  await page.evaluate(() => document.querySelectorAll('#piaRevision details, #piaResultadoDet').forEach(d => { d.open = true; }));
  for (const c of await page.$$('#piaRevision .ia-rev-check, #piaComprobar .ia-rev-check')) await c.check();
  r.revisados = await page.evaluate(() => document.querySelector('#piaRevision summary').textContent.includes('✓ 3 puntos revisados') && state.planTratamiento.ia.revisados.length === 7);
  await page.click('#btnCompartirPlan');
  await page.waitForSelector('#compartirOverlay.open');
  await page.click('.compartir-op[onclick="compartirCasaIA()"]');
  const portapapelesNuevo = () => page.waitForFunction(async () => (await navigator.clipboard.readText()) !== 'VACIO', null, { timeout: 5000 }).catch(() => {});
  await portapapelesNuevo();
  const casa = await page.evaluate(() => navigator.clipboard.readText());
  r.casa = casa.startsWith('PROGRAMA PARA CASA\nAndrés Molina') && casa.includes('· Camina 10 minutos después de desayunar.')
    && !casa.includes('sugerencia') && !casa.includes('grado III') && casa.trimEnd().endsWith('ve a urgencias hoy mismo.');
  await page.click('#btnCompartirPlan');
  await page.waitForSelector('#compartirOverlay.open');
  await page.evaluate(() => navigator.clipboard.writeText('VACIO'));
  await page.click('.compartir-op[onclick="compartirPlanIA()"]');
  await portapapelesNuevo();
  const fisio = await page.evaluate(() => navigator.clipboard.readText());
  r.planFisio = fisio.startsWith('PLAN DE TRATAMIENTO DETALLADO — propuesta\nAndrés Molina · Lumbar (izquierda)') && fisio.includes('(sugerencia de la IA)') && fisio.includes('Nivel B · Muy suave · Plan A');
  // «⬇ Paquete de revisión» del plan: descarga el .zip con su nombre
  const [descarga] = await Promise.all([page.waitForEvent('download', { timeout: 10000 }), page.click('#planIA .ia-rev-paquete-btn')]);
  r.paquete = /^revision-plan-andres-molina-\d{4}-\d{2}-\d{2}\.zip$/.test(descarga.suggestedFilename());
  // Cambiar la frecuencia: desactualizado
  await page.click('.option-btn[onclick="planElegir(\'frecuencia\',\'B\')"]');
  r.desactualizado = (await page.textContent('#piaResultado')).includes('han cambiado desde que se detalló');
  // Nunca en el payload ni en el .json exportado
  r.fueraPayload = await page.evaluate(async () => {
    const { buildPhysiQPayload } = await import('./app.js');
    const { exportarValoracion } = await import('./lib/valoracion-json.js');
    return !JSON.stringify(buildPhysiQPayload()).includes('Deslizamiento neural') && !JSON.stringify(exportarValoracion(state)).includes('Deslizamiento neural');
  });
  // Persiste con la sesión
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.state?.currentPhase === 6 && !!document.querySelector('#piaResultadoDet'), null, { timeout: 15000 });
  r.trasRecargar = await page.evaluate(() => state.planTratamiento.ia.revisados.length === 7);
  await context.close();

  // En el hub: ni la tarjeta ni el módulo
  const hub = await browser.newPage();
  const pedidos = [];
  hub.on('request', q => { if (/plan-ia\.js|revision-plan\.js|turnstile/.test(q.url())) pedidos.push(q.url()); });
  const frame = await cargarEnHub(hub);
  await frame.evaluate(() => { state.region = 'lumbar'; state.resultsBuilt = true; goToPhase(6); });
  await frame.waitForSelector('#planContenido > *');
  await frame.waitForTimeout(300);
  r.hubSinIA = !pedidos.length && await frame.evaluate(() => document.getElementById('planIA').hidden && !document.getElementById('planIA').firstChild);
  await hub.close();
  r.ok = Object.entries(r).every(([k, v]) => k === 'casaBloqueadaDetalle' || v === true);
  return r;
}

// Pantalla estrecha: ningún grupo de botones deja uno descolgado con hueco a su lado en la
// última fila (o llena la fila o el último ocupa todo el ancho). Recorre las 7 regiones
// hasta la fase 5 en un móvil de 320 px, abre todo lo plegable y mira cada fase (1–6).
// Fuera: la silueta (zonas colocadas sobre el dibujo) y las citas (texto corrido).
// Filas de opciones en pantalla estrecha (filas.js): un grupo pone todas sus opciones en una
// fila solo si cada texto cabe en una línea; si no, dos por fila (la última a todo el ancho
// si son impares) y, en los grupos de tres de las fases 1 y 3, una por fila si tampoco caben.
// En los cuestionarios no se baja de dos por fila. A 320, 360 y 390 px, también con la
// opción marcada (negrita) y tras repintar un ítem; en escritorio, sin data-cols.
async function checkFilas(browser, errors) {
  const r = {}, fallos = [];
  // Comprueba los grupos [data-filas] visibles: ninguna fila llena con un texto partido, salvo
  // la última disposición de su lista; la impar a todo el ancho con dos por fila
  const revisar = (page, donde) => page.evaluate(donde => {
    const lineas = x => { const rg = document.createRange(); rg.selectNodeContents(x);
      const tops = [...rg.getClientRects()].filter(q => q.width > 1).map(q => q.top).sort((a, b) => a - b);
      let n = 0, u = -Infinity; for (const t of tops) { if (t - u > 4) n++; u = t; } return n; };
    const out = [];
    for (const g of document.querySelectorAll('[data-filas]')) {
      if (!g.offsetWidth) continue;
      const pasos = g.dataset.filas.split(',').map(Number), cols = Number(g.dataset.cols);
      if (!cols) { out.push(`${donde}: ${g.id || g.className} sin data-cols`); continue; }
      const bs = [...g.children].filter(b => b.tagName === 'BUTTON'), caja = g.getBoundingClientRect();
      const tops = new Set(bs.map(b => Math.round(b.getBoundingClientRect().top)));
      if (cols !== pasos.at(-1) && bs.some(b => lineas(b) > 1)) out.push(`${donde}: ${g.id || g.className} con ${cols} columnas y un texto partido`);
      // Y es la primera disposición que cabe: con la anterior de la lista algún texto parte
      // (medido como filas.js, en negrita). No depende de la fuente de cada máquina.
      const i = pasos.indexOf(cols);
      if (i > 0) {
        g.classList.add('filas-midiendo'); g.dataset.cols = pasos[i - 1]; g.style.setProperty('--filas-cols', pasos[i - 1]);
        const parte = bs.some(b => lineas(b) > 1);
        g.dataset.cols = cols; g.style.setProperty('--filas-cols', cols); g.classList.remove('filas-midiendo');
        if (!parte) out.push(`${donde}: ${g.id || g.className} con ${cols} columnas cuando cabían ${pasos[i - 1]}`);
      }
      if (cols === bs.length && tops.size !== 1) out.push(`${donde}: ${g.id || g.className} no está en una fila`);
      if (cols === 2 && bs.length % 2) { const u = bs.at(-1).getBoundingClientRect();
        if (Math.abs(u.left - caja.left) > 1 || Math.abs(u.right - caja.right) > 1) out.push(`${donde}: ${g.id || g.className} impar sin la última a todo el ancho`); }
      if (cols === 1 && bs.some(b => Math.abs(b.getBoundingClientRect().width - caja.width) > 1)) out.push(`${donde}: ${g.id || g.className} una por fila sin ancho completo`);
    }
    return out;
  }, donde);
  const cols = (page, sel) => page.evaluate(sel => document.querySelector(sel)?.dataset.cols || '', sel);
  for (const W of [320, 360, 390]) {
    const context = await browser.newContext({ viewport: { width: W, height: 800 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    page.on('pageerror', err => errors.push(`pageerror (filas ${W}): ${err.message}`));
    await abrirApp(page);
    await page.waitForFunction(() => document.querySelector('#cronologia')?.dataset.cols);
    fallos.push(...await revisar(page, `${W} fase 1`));
    r[`cron${W}`] = await cols(page, '#cronologia');
    r[`mec${W}`] = await cols(page, '#mecanismo');
    // Marcada (negrita): la opción más larga sigue sin partir con la misma disposición
    await page.tap('#cronologia .option-btn >> nth=0');
    await page.tap('#mecanismo .option-btn >> nth=2');
    fallos.push(...await revisar(page, `${W} fase 1 marcada`));
    // Fase 3: naturaleza y estabilidad
    await page.fill('#motivoConsulta', 'x');
    await page.tap('#phase1 .btn-primary');
    await page.tap(`[onclick="selectRegion('lumbar', this)"]`);
    await page.tap('#btnContinuarSinss');
    await page.waitForFunction(() => document.querySelector('#naturaleza')?.dataset.cols);
    fallos.push(...await revisar(page, `${W} fase 3`));
    r[`nat${W}`] = await cols(page, '#naturaleza');
    // Cuestionarios: Kujala y CAIT; y tras tocar una opción (el ítem se repinta)
    for (const id of ['kujala', 'cait']) {
      await page.evaluate(id => window.abrirCuestionarios(id), id);
      await page.waitForFunction(() => document.querySelector('#cuestCuerpo .cuest-ops-fila')?.dataset.cols);
      fallos.push(...await revisar(page, `${W} ${id}`));
      if (await page.evaluate(() => [...document.querySelectorAll('#cuestCuerpo [data-filas]')].some(g => g.dataset.filas.endsWith(',1')))) fallos.push(`${W} ${id}: un cuestionario baja a una por fila`);
      const item = await page.evaluate(() => document.querySelector('#cuestCuerpo .cuest-ops-fila').closest('.cuest-item').dataset.item);
      await page.tap(`#cuestCuerpo .cuest-item[data-item="${item}"] .cuest-op >> nth=1`);
      await page.waitForFunction(item => document.querySelector(`#cuestCuerpo .cuest-item[data-item="${item}"] .cuest-ops-fila`)?.dataset.cols, item);
      fallos.push(...await revisar(page, `${W} ${id} marcada`));
      await page.evaluate(() => window.cerrarCuestionarios());
      await page.waitForFunction(() => !document.getElementById('cuestOverlay').classList.contains('open'));
    }
    await context.close();
  }
  // Cuántas columnas salen depende del ancho exacto del texto en cada máquina (a 360 px
  // naturaleza cabe en tres con 1 px de margen en un entorno y no en otro: CI, 2026-10), así que
  // no se fijan los valores: revisar() ya comprueba que es la primera disposición que cabe.
  // Aquí solo que un móvil más ancho nunca pone menos columnas
  r.esperado = ['cron', 'mec', 'nat'].every(k => Number(r[`${k}320`]) <= Number(r[`${k}360`]) && Number(r[`${k}360`]) <= Number(r[`${k}390`]));
  // Escritorio: sin data-cols, las tres en una fila como siempre
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await ctx.newPage();
  await abrirApp(page);
  await page.waitForTimeout(200);
  r.escritorio = await page.evaluate(() => [...document.querySelectorAll('#phase1 .option-group-col')].every(g => {
    const tops = new Set([...g.children].map(b => Math.round(b.getBoundingClientRect().top)));
    return !g.dataset.cols && tops.size === 1;
  }));
  await ctx.close();
  r.fallos = fallos;
  r.ok = !fallos.length && r.esperado && r.escritorio;
  return r;
}

async function checkSinHuecos(browser, errors) {
  const fallos = [];
  const huecos = page => page.evaluate(() => {
    const out = [];
    const visibles = el => el.getBoundingClientRect().width > 0;
    const conts = new Set([...document.querySelectorAll('.phase-container.active button')].filter(visibles).map(x => x.parentElement));
    for (const c of conts) {
      if (c.closest('.sil-lienzo')) continue;
      const bs = [...c.children].filter(x => x.tagName === 'BUTTON' && visibles(x) && !x.classList.contains('cita'));
      if (bs.length < 2) continue;
      // Filas por solape vertical, no por el top exacto: dos botones de la misma
      // fila pueden diferir en 1 px (borde distinto) y se leían como dos filas
      const filas = [];
      for (const x of [...bs].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)) {
        const r = x.getBoundingClientRect(), f = filas.at(-1);
        if (f && r.top < f.bottom - 4) { f.bs.push(x); f.bottom = Math.max(f.bottom, r.bottom); }
        else filas.push({ bottom: r.bottom, bs: [x] });
      }
      if (filas.length < 2) continue;
      const ult = filas.at(-1).bs.sort((a, b) => a.getBoundingClientRect().right - b.getBoundingClientRect().right);
      const hueco = c.getBoundingClientRect().right - ult.at(-1).getBoundingClientRect().right;
      if (hueco > 20) out.push(`${c.className} (${ult.map(x => x.textContent.trim().slice(0, 24)).join(' · ')}, hueco ${Math.round(hueco)} px)`);
    }
    return out;
  });
  for (const region of REGIONS) {
    const context = await browser.newContext({ viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    page.on('pageerror', err => errors.push(`pageerror (huecos ${region}): ${err.message}`));
    await abrirApp(page);
    const r = await walkRegion(page, region);
    if (r.finalPhase !== 5) { fallos.push(`${region}: no llega a la fase 5`); await context.close(); continue; }
    // Paciente posquirúrgico y condiciones especiales marcadas: sus filas de botones
    // (.cir-complicaciones, .hm-subtipos) solo se ven así (el hueco de «Cuál» en
    // Disautonomía pasó sin que esto lo viera, 2026-10)
    await page.evaluate(() => {
      window.goToPhase(1);
      [...document.querySelectorAll('#mecanismo .option-btn')].find(x => x.textContent.includes('Post-quirúrgico')).click();
      window.selectHMEstado('diagnosticada'); window.selectDsEstado('diagnosticada'); window.selectLESEstado('diagnosticado'); window.selectMAEstado('diagnosticado');
      window.selectOPEstado('diagnosticada'); window.selectOPFila('vertebrales', '1'); window.selectOPCaidas('1');
      window.selectEMEstado('posparto'); window.updateEM('semanasAprox', '3');
    });
    for (const f of [1, 2, 3, 4, '4b', 5, 6]) {
      await page.evaluate(f => window.goToPhase(f), f);
      await page.waitForFunction(f => String(window.state.currentPhase) === String(f), f);
      await page.evaluate(() => document.querySelectorAll('.phase-container.active details:not([open])').forEach(d => { d.open = true; }));
      // El formulario previo se pinta al abrirse (import() de formulario.js)
      if (f === 1 || f === 2) await page.waitForSelector('.phase-container.active .fp-opts');
      await page.waitForTimeout(150);
      for (const h of await huecos(page)) fallos.push(`${region} fase ${f}: ${h}`);
    }
    await context.close();
  }
  return { ok: fallos.length === 0, fallos: [...new Set(fallos)] };
}

async function checkFase6(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await portapapelesPropio(context);
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (fase 6): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error' && !KNOWN_NOISE.some(n => msg.text().includes(n))) errors.push(`console (fase 6): ${msg.text()}`); });
  await page.route('https://physiq-orchestrator.edu-gamboa-rodriguez.workers.dev/**', route => route.fulfill({
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'X-PhysiQ-Mode': 'demo' },
    contentType: 'application/json', body: JSON.stringify({ ok: true, mode: 'demo', routes: { report: 'demo' }, demoOnly: false }),
  }));
  await abrirApp(page);
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
  // Varios síntomas (Fase N, paso 4): sin secundarios no hay línea «Según…»;
  // con un P2 más irritable e «Independiente», dosifica P2 y avisa
  r.sinSecundarios = await page.evaluate(() => !document.getElementById('planDosifica'));
  await page.evaluate(() => {
    state.sintomaPrincipal.zonas = ['lumbar'];
    state.sintomasSecundarios = [{ zonas: ['pierna'], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: 2, irritabilidad: 'Alta', relacion: 'independiente' }];
    planElegir('sesion', 'primera');
  });
  await page.waitForSelector('#planDosifica');
  r.dosificaP2 = await page.evaluate(() => {
    const t = document.getElementById('planContenido').textContent;
    return document.getElementById('planDosifica').textContent.includes('P2 · Pierna por debajo de la rodilla, el síntoma más irritable')
      && t.includes('NRS 2/10') && t.includes('Un síntoma va independiente de P1') && t.includes('(P2 · Pierna por debajo de la rodilla)');
  });
  await page.evaluate(() => { state.sintomasSecundarios = []; state.sintomaPrincipal.zonas = []; planElegir('sesion', 'primera'); });
  await page.waitForFunction(() => !document.getElementById('planDosifica'));
  // Irritabilidad sin registrar en la fase 3 (decisión 101): alta, con aviso y
  // enlace a la matriz; la fase 6 y la fase 3 dan el mismo nivel
  r.mismoNivel = await page.evaluate(() => state.irritabilidadNivel === 'Baja'
    && document.querySelector('#planContenido .option-btn.selected[onclick="planElegir(\'irritabilidad\',\'baja\')"]') !== null
    && !document.getElementById('planContenido').textContent.includes('en la fase 3:'));
  const matrizAntes = await page.evaluate(() => JSON.stringify(state.irritabilidad));
  await page.evaluate(() => { state.irritabilidad = { reposo: '', movimiento: '', tolerancia: '', calma: '', discapacidad: '' }; state.irritabilidadNivel = null; planElegir('sesion', 'primera'); });
  r.sinIrritabilidad = await page.evaluate(() => {
    const t = document.getElementById('planContenido').textContent;
    return t.includes('Sin irritabilidad registrada en la fase 3') && t.includes('Completar la matriz en la fase 3 →')
      && document.querySelector('#planContenido .option-btn.selected[onclick="planElegir(\'irritabilidad\',\'alta\')"]') !== null;
  });
  await page.evaluate(m => { state.irritabilidad = JSON.parse(m); state.irritabilidadNivel = 'Baja'; planElegir('sesion', 'primera'); }, matrizAntes);
  r.gravedadMarcada = await page.evaluate(() => {
    const sel = [...document.querySelectorAll('#planContenido .option-btn.selected')].map(b => b.textContent.trim());
    return sel.includes('Moderada');   // NRS 6 → moderada
  });
  const botonNivel = k => page.locator('.plan-niveles .option-btn', { hasText: new RegExp(`^${k} ·`) });
  await page.click('.option-btn[onclick="planElegir(\'irritabilidad\',\'alta\')"]');
  r.altaSinC = await botonNivel('C').isDisabled() && (await page.textContent('.plan-escalon-tit')).includes('Muy suave');
  // Con irritabilidad alta A coincide con B: no se ofrece y vale B
  r.altaSinA = await botonNivel('A').isDisabled() && (await page.textContent('.plan-escalon-tit')).startsWith('Nivel B');
  // Enlace del bloque «Educación» a la guía «Efectos del ejercicio» (decisión 5 de
  // docs/efectos-ejercicio.md): con irritabilidad alta, la hipoalgesia
  const enlaceEj = () => page.evaluate(() => {
    const e = document.querySelector('#planSesion .plan-bloque:nth-child(2) .plan-ejercicio');
    return e ? { bloque: e.dataset.bloqueEjercicio, boton: e.querySelector('button')?.textContent.trim(), ayuda: e.querySelector('.plan-ayuda')?.textContent.trim() } : null;
  });
  const abrirDesdeEnlace = async id => {
    await page.click('#planSesion .plan-ejercicio .plan-enlace');
    await page.waitForSelector('#ejercicioOverlay.open');
    const ok = await page.evaluate(i => document.querySelector(`#ejercicioCuerpo [data-bloque="${i}"]`)?.open === true
      && [...document.querySelectorAll('#ejercicioCuerpo [data-bloque]')].filter(d => d.open).length === 1, id);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.getElementById('ejercicioOverlay').classList.contains('open'));
    return ok;
  };
  const eAlta = await enlaceEj();
  r.enlaceAltaOtro = await page.evaluate(() => document.querySelector('#planSesion .plan-ejercicio [data-bloque-alternativo]')?.dataset.bloqueAlternativo === 'mecanotransduccion');
  r.enlaceAlta = eAlta?.bloque === 'hipoalgesia' && eAlta.boton === 'Para explicárselo al paciente →'
    && eAlta.ayuda.includes('Hipoalgesia inducida por el ejercicio') && await abrirDesdeEnlace('hipoalgesia');
  await page.click('.option-btn[onclick="planElegir(\'irritabilidad\',\'baja\')"]');
  r.bajaConA = !(await botonNivel('A').isDisabled());
  const eBaja = await enlaceEj();
  r.enlaceBaja = eBaja?.bloque === 'mecanotransduccion' && eBaja.ayuda.includes('Carga y adaptación del tejido') && await abrirDesdeEnlace('mecanotransduccion');
  r.enlaceNoCompartido = await page.evaluate(() => {
    const t = document.getElementById('planContenido').textContent;
    return t.includes('Para explicárselo al paciente') && getComputedStyle(document.querySelector('.plan-ejercicio')).display !== 'none';
  });
  // Con riesgo psicosocial alto, también «Efectos centrales» (con su motivo); sin él, no
  r.enlaceSinExtra = await page.evaluate(() => !document.querySelector('#planSesion .plan-ejercicio [data-bloque-extra]'));
  await page.evaluate(() => { state.riesgoPsico = 'Alto'; });
  await page.click('.option-btn[onclick="planElegir(\'irritabilidad\',\'alta\')"]');
  r.enlaceCentrales = await page.evaluate(() => {
    const b = document.querySelector('#planSesion .plan-ejercicio [data-bloque-extra="centrales"]');
    return !!b && b.nextElementSibling?.textContent.includes('riesgo psicosocial')
      && !document.querySelector('#planSesion .plan-ejercicio [data-bloque-extra="antiinflamatorio"]');
  });
  await page.click('#planSesion .plan-ejercicio [data-bloque-extra="centrales"]');
  await page.waitForSelector('#ejercicioOverlay.open');
  r.enlaceCentrales = r.enlaceCentrales && await page.evaluate(() => document.querySelector('#ejercicioCuerpo [data-bloque="centrales"]')?.open === true);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.getElementById('ejercicioOverlay').classList.contains('open'));
  await page.evaluate(() => { state.riesgoPsico = ''; });
  // Con disautonomía e hipermovilidad, también sus bloques (misma regla que el recuadro
  // de la fase 5); con la regla de sospecha vascular cumplida, sin el de hipermovilidad
  const extras = () => page.evaluate(() => [...document.querySelectorAll('#planSesion .plan-ejercicio [data-bloque-extra]')]
    .map(b => `${b.dataset.bloqueExtra}:${b.nextElementSibling?.textContent.split(':')[0]}`).join('|'));
  const antesCond = await page.evaluate(() => JSON.stringify({ ds: state.disautonomia, hm: state.hipermovilidad, sa: state.sistemicoAnswers }));
  await page.evaluate(() => {
    state.disautonomia = { ...state.disautonomia, estado: 'sospecha' };
    state.hipermovilidad = { ...state.hipermovilidad, estado: 'sospecha', subtipo: '' };
  });
  await page.click('.option-btn[onclick="planElegir(\'irritabilidad\',\'alta\')"]');
  r.enlaceCondiciones = await extras() === 'ortostatica:Por la disautonomía|hipermovilidad:Por la hipermovilidad';
  await page.click('#planSesion .plan-ejercicio [data-bloque-extra="hipermovilidad"]');
  await page.waitForSelector('#ejercicioOverlay.open');
  r.enlaceCondiciones = r.enlaceCondiciones && await page.evaluate(() => document.querySelector('#ejercicioCuerpo [data-bloque="hipermovilidad"]')?.open === true);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.getElementById('ejercicioOverlay').classList.contains('open'));
  await page.evaluate(() => { state.sistemicoAnswers = { ...state.sistemicoAnswers, hm_s_familia: 'SI' }; });
  await page.click('.option-btn[onclick="planElegir(\'irritabilidad\',\'baja\')"]');
  r.enlaceSinVascular = await extras() === 'ortostatica:Por la disautonomía';
  await page.evaluate(() => {
    state.sistemicoAnswers = { ...state.sistemicoAnswers, hm_s_familia: 'NO' };
    state.hipermovilidad = { ...state.hipermovilidad, estado: 'diagnosticada', subtipo: 'vascular' };
  });
  await page.click('.option-btn[onclick="planElegir(\'irritabilidad\',\'alta\')"]');
  r.enlaceSinVascular = r.enlaceSinVascular && await extras() === 'ortostatica:Por la disautonomía';
  // Aviso del subtipo vascular diagnosticado (Byers 2017, p. 42): ahora sí; con la sospecha, no
  const avisoVascular = () => page.evaluate(() => [...document.querySelectorAll('#phase6 .alert-warning')].some(a => a.textContent.includes('Ehlers-Danlos vascular (diagnosticado)')));
  r.avisoVascular = await avisoVascular();
  await page.evaluate(() => { state.hipermovilidad = { ...state.hipermovilidad, estado: 'sospecha', subtipo: '' }; });
  await page.click('.option-btn[onclick="planElegir(\'irritabilidad\',\'baja\')"]');
  r.avisoVascular = r.avisoVascular && !(await avisoVascular());
  await page.click('.option-btn[onclick="planElegir(\'irritabilidad\',\'alta\')"]');
  await page.evaluate(a => { const o = JSON.parse(a); state.disautonomia = o.ds; state.hipermovilidad = o.hm; state.sistemicoAnswers = o.sa; }, antesCond);
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
  // Irritabilidad alta → B muy suave aunque la gravedad sea mínima
  await page.click('.option-btn[onclick="planElegir(\'gravedad\',\'minima\')"]');
  await page.click('.option-btn[onclick="planElegir(\'irritabilidad\',\'alta\')"]');
  r.altaMinimaMuySuave = (await page.textContent('.plan-escalon-tit')).includes('Muy suave');
  await page.click('.option-btn[onclick="planElegir(\'irritabilidad\',\'baja\')"]');
  await botonNivel('C').click();
  // Minutos editables: los rangos se recalculan y avisa si no suman 50
  await page.fill('.plan-bloque:nth-child(3) .plan-duracion input', '20');
  await page.dispatchEvent('.plan-bloque:nth-child(3) .plan-duracion input', 'change');
  await page.waitForFunction(() => document.getElementById('planTotalMin')?.textContent.includes('suman 47 min'));
  r.minutosEditables = await page.evaluate(() => [...document.querySelectorAll('.plan-bloque-min')].map(e => e.textContent.trim()).join('|') === '0–5 min|5–12 min|12–32 min|32–42 min|42–47 min'
    && !!document.querySelector('.plan-chip'));
  await page.fill('.plan-bloque:nth-child(3) .plan-duracion input', '23');
  await page.dispatchEvent('.plan-bloque:nth-child(3) .plan-duracion input', 'change');
  await page.waitForFunction(() => !document.getElementById('planTotalMin')?.textContent.includes('suman'));
  // Sin «cuándo parar»: pide confirmación y la sección no sale
  await page.fill('#planNotasCasa', 'Caminar 10 minutos al día');
  await page.click('#btnCompartirPlan');
  await page.click('#compartirOpciones .compartir-op >> nth=2');
  await page.waitForSelector('#confirmBanner');
  r.pideParar = (await page.textContent('#confirmBanner .confirm-box-title')).includes('Programa incompleto');
  await page.click('#confirmAction');
  await page.waitForFunction(() => !document.getElementById('confirmBanner'));
  const casa = await leer();
  r.casaLlana = casa.startsWith('PROGRAMA PARA CASA') && casa.includes('Caminar 10 minutos') && !/Maitland|Petersen|grado|Nivel/.test(casa)
    && !casa.includes('Cuándo parar');
  await page.fill('#planParar', 'Si aparece hormigueo en la pierna');
  await page.click('#btnCompartirPlan');
  await page.click('#compartirOpciones .compartir-op >> nth=2');
  await page.waitForFunction(() => !document.getElementById('compartirOverlay').classList.contains('open'));
  r.conParar = !(await page.$('#confirmBanner')) && (await leer()).includes('Cuándo parar:\nSi aparece hormigueo');
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
  // Bloqueado: «📤 Compartir» no ofrece el programa para casa
  await page.click('#btnCompartirPlan');
  await page.waitForSelector('#compartirOverlay.open');
  r.bloqueoSinCasa = (await page.locator('#compartirOpciones .compartir-op').allTextContents()).map(t => t.trim().split('\n')[0].trim()).join('|') === 'Plan de sesión|Plan del mes';
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.getElementById('compartirOverlay').classList.contains('open'));
  // Sin NRS: aviso con enlace a la fase 3
  await page.evaluate(() => { state.sistemicoAnswers = {}; state.severidad = null; state.planTratamiento.gravedad = null; goToPhase(5); goToPhase(6); });
  await page.waitForSelector('#planContenido .plan-enlace');
  await page.click('#planContenido .plan-enlace');
  r.enlaceNRS = await page.waitForFunction(() => state.currentPhase === 3, null, { timeout: 4000 }).then(() => true).catch(() => false);
  // Sin región (las siete tienen plan): pide elegirla en la fase 2
  r.sinRegion = await page.evaluate(() => { state.sistemicoAnswers = {}; state.region = ''; goToPhase(6); return true; })
    && await page.waitForFunction(() => document.querySelector('#planContenido .alert-info')?.textContent.includes('elígela en la fase 2'), null, { timeout: 4000 }).then(() => true).catch(() => false);
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

// Abre la app y espera a que sus módulos se hayan ejecutado. `networkidle`
// solo dice que no quedan peticiones: si una petición de un módulo falló, la
// app no llega a arrancar y la prueba se quedaba 30 s en un clic, con errores
// «state/goToPhase is not defined» que no decían por qué. Pasó dos veces en
// ejecuciones completas justo tras arrancar `npx serve` (2026-10); la misma
// firma sale cortando a propósito la conexión de un .js. Sin reintento: si la
// app no carga, la sección falla, pero diciendo qué petición se perdió.
// ≤768 px: tiempos de tejido, cuestionarios y «Preguntar a la IA» se abren
// desde el botón «Herramientas» de la cabecera
async function abrirHerramienta(page, k) {
  await page.tap('#herramientasBtn');
  await page.waitForSelector('#herramientasOverlay.open');
  await page.tap(`#herramientasOverlay [data-herramienta="${k}"]`);
}
// Abierta desde «Herramientas»: el atrás vuelve al menú (con la herramienta ya
// cerrada) y otro atrás cierra el menú, en la misma fase
async function atrasDesdeHerramienta(page, overlay) {
  await page.goBack();
  const alMenu = await page.waitForFunction(o => !document.getElementById(o).classList.contains('open')
    && document.getElementById('herramientasOverlay').classList.contains('open')
    && !document.body.classList.contains('herr-volver'), overlay, { timeout: 3000 }).then(() => true, () => false);
  await page.goBack();
  const cerrado = await page.waitForFunction(() => !document.getElementById('herramientasOverlay').classList.contains('open'), null, { timeout: 3000 })
    .then(() => true, () => false);
  return alMenu && cerrado;
}

// Un portapapeles por contexto. El de Chromium es uno para todo el navegador, y
// las secciones corren en paralelo: lo que copiaba una lo leía otra (2026-10, fallo
// intermitente de «plan-ia»: escribía 'VACIO', otra sección copiaba su texto y la
// comprobación de que no se había copiado nada fallaba). Vive en Node, así que
// sobrevive a las recargas del contexto; la app solo usa writeText().
async function portapapelesPropio(context) {
  let texto = '';
  await context.exposeBinding('__portapapeles', (_src, nuevo) => {
    if (typeof nuevo === 'string') texto = nuevo;
    return texto;
  });
  await context.addInitScript(() => {
    const clip = {
      writeText: t => window.__portapapeles(String(t)).then(() => undefined),
      readText: () => window.__portapapeles(null),
    };
    try { Object.defineProperty(navigator, 'clipboard', { value: clip, configurable: true }); } catch {}
  });
}

// El mismo navegador, pero cada contexto que abre empieza con la letra grande
// elegida (localStorage antes de cargar, como si el usuario la hubiera marcado):
// para repetir las comprobaciones de pantalla estrecha con letra grande sin copiarlas.
function conLetraGrande(browser) {
  const marcar = () => { try { localStorage.setItem('physiq-assessment-letra', 'grande'); } catch {} };
  const nuevoContexto = async (opts) => { const c = await browser.newContext(opts); await c.addInitScript(marcar); return c; };
  return new Proxy(browser, {
    get(b, k) {
      if (k === 'newContext') return nuevoContexto;
      if (k === 'newPage') return async (opts) => (await nuevoContexto(opts)).newPage();
      const v = b[k];
      return typeof v === 'function' ? v.bind(b) : v;
    },
  });
}

// Botones visibles cuyo texto no cabe (cortado o desbordado) y desborde horizontal de la página
async function desbordes(page) {
  return page.evaluate(() => {
    const cortados = [...document.querySelectorAll('button, .option-btn, a.btn')]
      .filter(b => b.offsetParent && b.getClientRects().length && b.scrollWidth > b.clientWidth + 1)
      .map(b => b.textContent.trim().replace(/\s+/g, ' ').slice(0, 40));
    return { horizontal: document.documentElement.scrollWidth > innerWidth, cortados };
  });
}

// Panel de sesión: «Reiniciar valoración» y «Borrar sesión» con texto, cada uno en su
// fila a todo el ancho, Borrar debajo, el texto en una línea; sin papelera junto al nombre
async function botonesPanelSesion(p) {
  await p.tap('#sessionBtn');
  await p.waitForSelector('#sessionPanelOverlay.open');
  await p.fill('#patientName', 'Prueba');
  const ok = await p.evaluate(() => {
    const re = document.getElementById('sessionReset'), bo = document.getElementById('sessionPanelClear');
    const nombre = document.getElementById('patientName');
    const a = re.getBoundingClientRect(), b = bo.getBoundingClientRect(), n = nombre.getBoundingClientRect();
    const unaLinea = el => el.scrollWidth <= el.clientWidth + 1 && el.getBoundingClientRect().height < 50;
    return /Borrar sesión/.test(bo.textContent) && !bo.disabled
      && Math.abs(a.width - b.width) < 1 && Math.abs(a.left - b.left) < 1 && b.top >= a.bottom
      && Math.abs(n.width - a.width) < 1 && unaLinea(re) && unaLinea(bo) && b.right <= innerWidth;
  });
  await p.goBack();
  await p.waitForFunction(() => !document.getElementById('sessionPanelOverlay').classList.contains('open'));
  return ok;
}

// Tamaño de letra: el botón, que se recuerda, y que con letra grande nada se desborda
async function checkLetra(browser, errors) {
  const r = {};
  const ctx = await browser.newContext({ viewport: { width: 320, height: 700 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push(`pageerror (letra): ${e.message}`));
  await abrirApp(p);
  const raiz = () => p.evaluate(() => getComputedStyle(document.documentElement).fontSize);
  r.normal = await raiz() === '16px' && await p.getAttribute('#letraBtn', 'aria-pressed') === 'false';
  r.panelNormal = await botonesPanelSesion(p);
  await p.tap('#letraBtn');
  r.grande = await raiz() === '18px' && await p.getAttribute('#letraBtn', 'aria-pressed') === 'true';
  r.panelGrande = await botonesPanelSesion(p);
  // Se recuerda y se aplica antes de pintar: al terminar de leer el HTML (antes de
  // que corran los módulos de la app) ya está puesta por el script del <head>
  await p.addInitScript(() => document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive') window.__letraAlLeer = document.documentElement.getAttribute('data-letra');
  }));
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForFunction(() => window.goToPhase);
  r.recordada = await raiz() === '18px' && await p.evaluate(() => window.__letraAlLeer === 'grande');
  // Cabecera a 320 y 360 px: los iconos no se montan entre sí ni sobre el logo, y no se salen
  for (const w of [320, 360]) {
    await p.setViewportSize({ width: w, height: 700 });
    r[`cabecera${w}`] = await p.evaluate(() => {
      const logo = document.querySelector('.logo').getBoundingClientRect();
      const items = [...document.querySelectorAll('.header-right > *')].filter(e => e.offsetParent).map(e => e.getBoundingClientRect());
      return items.every((b, i) => b.left >= logo.right - 1 && b.right <= innerWidth + 1 && (i === 0 || b.left >= items[i - 1].right - 1));
    });
  }
  // Fases 1–5 a 320 px con letra grande
  await p.setViewportSize({ width: 320, height: 700 });
  await walkRegion(p, 'lumbar');
  r.fases = {};
  for (const f of [1, 2, 3, 4, '4b', 5]) {
    await p.evaluate(n => window.goToPhase(n), f);
    await p.waitForTimeout(150);
    const d = await desbordes(p);
    if (d.horizontal || d.cortados.length) r.fases[f] = d;
  }
  r.sinDesbordes = Object.keys(r.fases).length === 0;
  if (r.sinDesbordes) delete r.fases;
  // Vuelve a normal
  await p.tap('#letraBtn');
  r.vuelve = await raiz() === '16px' && await p.evaluate(() => !document.documentElement.hasAttribute('data-letra') && localStorage.getItem('physiq-assessment-letra') === null);
  await ctx.close();
  r.ok = Object.entries(r).every(([, v]) => v === true);
  return r;
}

// Guía de consulta (guia.html): la página que abre el QR de cada esquema impreso
async function checkGuia(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await portapapelesPropio(context);   // la copia del nombre para CIMA, sin el portapapeles del navegador
  const page = await context.newPage();
  const fallidas = [];
  page.on('pageerror', err => errors.push(`pageerror (guía): ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error' && !KNOWN_NOISE.some(n => msg.text().includes(n))) errors.push(`console (guía): ${msg.text()}`); });
  page.on('requestfailed', r => { if (r.url().startsWith(BASE_URL)) fallidas.push(r.url()); });
  const base = BASE_URL.replace(/\/$/, '') + '/guia.html';
  const r = {};
  try {
    await page.goto(`${base}#lumbar/cribado`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.guia-item', { timeout: 10000 });
    // La numeración y el orden son los de la hoja: lib/esquemas.js, igual que docs/esquemas/generar.mjs
    r.cribado = await page.evaluate(async () => {
      const { SYSTEMIC_SCREENING } = await import('./data.js');
      const { sistemasCribado, preguntasDeRegion } = await import('./lib/esquemas.js');
      const { siempre, especiales } = sistemasCribado(SYSTEMIC_SCREENING, 'lumbar');
      const esperado = [...siempre, ...especiales].flatMap(s => preguntasDeRegion(s, 'lumbar').map((q, i) => `${q.id}:${i + 1}`));
      const pintado = [...document.querySelectorAll('.guia-item')].map(el => `${el.id.slice(2)}:${el.querySelector('.guia-num').textContent}`);
      return { mismo: JSON.stringify(esperado) === JSON.stringify(pintado), n: pintado.length,
        urgencias: document.querySelectorAll('.guia-chip.urg').length,
        ia: !!document.getElementById('iaBarra') && document.querySelectorAll('.razon-cuerpo[data-ia-ctx] .ia-parrafo-ir').length > 0,
        enlaces: document.querySelectorAll('.razon-enlace[target="_blank"]').length };
    });
    // Una cita abre su ficha
    await page.locator('details.razon').first().evaluate(d => { d.open = true; });
    await page.locator('details.razon .cita').first().click();
    r.ficha = await page.locator('#citaFicha').isVisible().catch(() => false);
    // Enlace directo a un elemento: resaltado y con su «Por qué» abierto
    await page.goto(`${base}#lumbar/cribado/q-l6`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#q-l6.destacado');
    r.ancla = await page.evaluate(() => document.querySelector('#q-l6 details.razon')?.open === true);
    // Pestañas y región
    await page.click('.guia-hojas a:has-text("Árbol")');
    await page.waitForSelector('#paso-lu_step1');
    r.arbol = await page.evaluate(async () => {
      const { CIF_TREES } = await import('./data.js');
      return document.querySelectorAll('[id^="paso-"]').length === CIF_TREES.lumbar.steps.length
        && /«dolor lumbar inespecífico»/.test(document.getElementById('sin-hipotesis')?.textContent || '');
    });
    await page.click('.guia-hojas a:has-text("Confirmación")');
    await page.waitForSelector('[id^="test-"]');
    r.confirmacion = await page.evaluate(async () => {
      const { HYPOTHESES } = await import('./data.js');
      const n = Object.values(HYPOTHESES).filter(h => h.region === 'lumbar').reduce((a, h) => a + h.tests.length, 0);
      return document.querySelectorAll('[id^="test-"]').length === n && document.querySelectorAll('.guia-peso').length === n;
    });
    // Calculadora: misma etiqueta que calcLRScore de la app; segundo toque desmarca; «Borrar» limpia
    const marcar = async (hip, k, res) => page.click(`#test-${hip}-${k} .guia-calc [data-res="${res}"]`);
    await marcar('lu3', 1, 'pos'); await marcar('lu3', 0, 'neg'); await marcar('lu4', 6, 'pos');
    r.calc = await page.evaluate(async () => {
      const { HYPOTHESES } = await import('./data.js');
      const { calcLRScore, etiquetaHipHTML } = await import('./lib/tests-4b.js');
      const esperado = id => etiquetaHipHTML(calcLRScore(HYPOTHESES[id], id === 'lu3' ? { 1: 'pos', 0: 'neg' } : { 6: 'pos' }).label);
      return document.querySelector('[data-puntua="lu3"]').innerHTML === esperado('lu3')
        && document.querySelector('[data-puntua="lu4"]').innerHTML === esperado('lu4')
        && document.querySelectorAll('.guia-resumen-fila').length === 2
        && document.querySelector('#test-lu3-1 [data-res="pos"]').classList.contains('selected');
    });
    await marcar('lu4', 6, 'pos');
    r.desmarca = await page.evaluate(() => document.querySelectorAll('.guia-resumen-fila').length === 1 && !document.querySelector('#test-lu4-6 .selected:not(.nd)'));
    await page.click('[data-borrar]');
    r.borrar = await page.evaluate(() => !document.querySelector('.guia-resumen-fila') && !document.querySelector('.guia-calc .selected:not(.nd)'));
    r.sinGuardar = await page.evaluate(() => { try { return localStorage.length === 0 || ![...Array(localStorage.length)].some((_, i) => !/^physiq-assessment-(theme|letra|ia-destino)$/.test(localStorage.key(i))); } catch { return true; } });
    // Irritabilidad: mismo nivel que nivelMatriz (fases 3 y 6) en varias combinaciones; segundo toque y «Borrar»
    await page.click('.guia-hojas a:has-text("Irritabilidad")');
    await page.waitForSelector('[data-irr]');
    r.irritabilidad = await page.evaluate(async () => {
      const { ITEMS_IRRITABILIDAD } = await import('./data/irritabilidad.js');
      const { nivelMatriz, NOMBRE_NIVEL } = await import('./lib/irritabilidad.js');
      const casos = [{}, { calma: 0 }, { calma: 1, reposo: 2, movimiento: 2, tolerancia: 1 }, { reposo: 1, movimiento: 1, tolerancia: 0 }, { calma: 2 }, { calma: 0, reposo: 0, movimiento: 1, tolerancia: 0 }];
      const fallos = [];
      for (const caso of casos) {
        document.querySelector('[data-irr-borrar]').click();
        const irr = {};
        for (const [k, i] of Object.entries(caso)) {
          const v = ITEMS_IRRITABILIDAD.find(x => x.clave === k).opciones[i].valor; irr[k] = v;
          document.querySelector(`[data-irr="${k}"][data-valor="${v}"]`).click();
        }
        const m = nivelMatriz(irr), txt = document.getElementById('guiaIrrRes').textContent;
        const ok = m.nivel ? txt.includes(`Irritabilidad ${NOMBRE_NIVEL[m.nivel]}`) && (!m.incompleta || /puede quedarse corto/.test(txt)) : /no registrada/.test(txt);
        if (!ok) fallos.push(JSON.stringify(caso));
      }
      return fallos;
    });
    await page.click('[data-irr-borrar]');
    await page.click('[data-irr="calma"][data-valor="Cede en minutos"]');
    await page.click('[data-irr="calma"][data-valor="Cede en minutos"]');
    r.irrDesmarca = await page.evaluate(() => !document.querySelector('[data-irr="calma"].selected'));
    await page.click('[data-irr="reposo"][data-valor="Presente"]');
    await page.click('[data-irr-borrar]');
    r.irrBorrar = await page.evaluate(() => !document.querySelector('[data-irr].selected') && /no registrada/.test(document.getElementById('guiaIrrRes').textContent));
    await page.selectOption('#guiaRegion', 'codo');
    await page.waitForFunction(() => location.hash === '#codo/irritabilidad');
    await page.click('.guia-hojas a:has-text("Confirmación")');
    await page.waitForSelector('#hip-co1');
    r.region = await page.evaluate(() => !!document.getElementById('hip-co1'));
    // Pauta y pronóstico por hipótesis (los de la fase 5); «🚑 Derivación» (co7) fuera de todo <details>
    r.pauta = await page.evaluate(() => [...document.querySelectorAll('[id^="hip-"]')].every(s => s.querySelector('.guia-pauta, .guia-urg'))
      && !!document.querySelector('#hip-co7 .guia-urg') && !document.querySelector('#hip-co7 .guia-urg').closest('details'));
    // Cabe a 320 px sin desbordar
    await page.setViewportSize({ width: 320, height: 700 });
    for (const h of ['cribado', 'irritabilidad', 'arbol', 'confirmacion']) {
      await page.goto(`${base}#lumbar/${h}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.querySelectorAll('details.razon').forEach(d => { d.open = true; }));
      r[`ancho_${h}`] = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    }
    // Tiempos de tejido (#tejidos/<hoja>, el QR de sus dos hojas): solo los grupos de esa hoja,
    // la ficha de una barra con sus fuentes, el filtro, el eje fijo bajo las pestañas, cabe a 320 px
    await page.goto(`${base}#tejidos/blandos`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.guia-tejidos .tej-barra', { state: 'attached' });
    r.tejidos = await page.evaluate(async () => {
      const { HOJAS_TEJIDO } = await import('./lib/esquemas.js');
      const grupos = [...document.querySelectorAll('.guia-tejidos .tej-filtro-btn')].map(b => b.dataset.grupo);
      return JSON.stringify(grupos) === JSON.stringify(HOJAS_TEJIDO.blandos.grupos)
        && document.getElementById('guiaTitulo').offsetParent !== null && !document.getElementById('guiaRegion').offsetParent
        && document.documentElement.scrollWidth <= innerWidth;
    });
    await page.locator('.guia-tejidos .tej-barra[data-barra]:visible').first().click();
    r.tejFicha = await page.waitForFunction(() => document.querySelector('#tejInfo:not([hidden]) .tej-fuente-enlace'), null, { timeout: 5000 }).then(() => true, () => false);
    await page.locator('.guia-tejidos .tej-filtro-btn[data-grupo="menisco"]').click();
    r.tejFiltro = await page.evaluate(() => [...document.querySelectorAll('.guia-tejidos .tej-grupo')].length === 1 && location.hash === '#tejidos/blandos');
    await page.click('.guia-hojas a:has-text("Hueso")');
    await page.waitForFunction(() => location.hash === '#tejidos/hueso' && document.querySelector('.guia-tejidos .tej-filtro-btn')?.dataset.grupo === 'hueso');
    r.tejHueso = await page.evaluate(() => [...document.querySelectorAll('.guia-tejidos .tej-filtro-btn')].map(b => b.dataset.grupo).join() === 'hueso,articulacion,columna'
      && document.documentElement.scrollWidth <= innerWidth);
    // Hoja impresa desfasada: el QR lleva ?h=<huella>; distinta de huellas.json → aviso con el PDF
    // actual; igual → «al día»; en otra pestaña, nada
    const huellas = await (await page.request.get(BASE_URL.replace(/\/$/, '') + '/docs/esquemas/huellas.json')).json();
    await page.goto(`${base.replace(/\.html$/, "")}?h=00000000#lumbar/cribado`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#guiaPapel');
    const pdf = await page.evaluate(() => document.querySelector('#guiaPapel a')?.getAttribute('href'));
    r.papelViejo = /versión anterior/.test(await page.textContent('#guiaPapel')) && /cribado-lumbar\.pdf$/.test(pdf || '')
      && (await page.request.get(new URL(pdf, page.url()).href)).ok();
    await page.click('.guia-hojas a:has-text("Árbol")');
    await page.waitForSelector('#paso-lu_step1');
    r.papelOtraHoja = !(await page.$('#guiaPapel'));
    await page.goto(`${base.replace(/\.html$/, "")}?h=${huellas["tejidos-hueso"].huella}#tejidos/hueso`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#guiaPapel');
    r.papelAlDia = /al día/.test(await page.textContent('#guiaPapel'));
    // Hojas para imprimir (#hojas): una fila por hoja de huellas.json con su versión y su PDF
    await page.goto(`${base}#hojas`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.guia-hoja');
    const filasHojas = await page.evaluate(() => [...document.querySelectorAll('.guia-hoja')].map(li => ({ v: li.querySelector('.guia-hoja-v').textContent, pdf: li.querySelector('a').getAttribute('href') })));
    const pdfsOk = await Promise.all(filasHojas.slice(0, 3).map(f => page.request.head(new URL(f.pdf, page.url()).href).then(x => x.ok())));
    // Libretos (completo y uno por región) arriba, con su PDF
    const libretos = await (await page.request.get(BASE_URL.replace(/\/$/, '') + '/docs/esquemas/libretos.json')).json();
    const filasLibretos = await page.evaluate(() => [...document.querySelectorAll('.guia-hoja a[href*="libreto-"]')].map(a => a.getAttribute('href')));
    r.libretos = filasLibretos.length === Object.keys(libretos).length && (await page.request.head(new URL(filasLibretos[0], page.url()).href)).ok();
    const soloHojas = filasHojas.filter(f => !/libreto-/.test(f.pdf));
    r.hojas = soloHojas.length === Object.keys(huellas).length
      && soloHojas.every(f => { const k = f.pdf.match(/([^/]+)\.pdf$/)[1]; return f.v === `v. ${huellas[k]?.huella}`; })
      && pdfsOk.every(Boolean) && await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    // Condiciones especiales (#condiciones, el QR de su hoja): todas las filas, sin estado ni botones
    await page.goto(`${base}#condiciones`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.cond-fila');
    r.condiciones = await page.evaluate(async () => {
      const { CONDICIONES } = await import('./data/condiciones.js');
      return document.querySelectorAll('.cond-fila').length === CONDICIONES.length && !document.querySelector('.cond-estado, .cond-ir')
        && document.querySelectorAll('.cond-fila .cita').length > 0 && document.documentElement.scrollWidth <= innerWidth;
    });
    // Fármacos (#farmacos, el QR de su hoja): la guía de la app; «Ficha técnica (CIMA)» copia el nombre y avisa
    await page.goto(`${base}#farmacos`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.farm-familia');
    await page.evaluate(() => { document.querySelector('.farm-familia').open = true; });
    const enlaceCima = page.locator('#farmCuerpo a[data-cima]').first();
    const nombreCima = await enlaceCima.getAttribute('data-cima');
    await enlaceCima.evaluate(a => a.addEventListener('click', e => e.preventDefault()));   // sin abrir CIMA
    await enlaceCima.click();
    await page.waitForSelector('#guiaAviso:not([hidden])');
    r.farmacos = await page.evaluate(async () => {
      const { familiasConContenido } = await import('./lib/farmacos.js');
      return document.querySelectorAll('.farm-familia').length === familiasConContenido().length && document.documentElement.scrollWidth <= innerWidth;
    }) && (await page.evaluate(() => navigator.clipboard.readText())) === nombreCima && (await page.textContent('#guiaAviso')).includes(nombreCima);
    // Irritabilidad suelta (#irritabilidad, el QR de su hoja): la misma calculadora, sin región
    await page.goto(`${base}#irritabilidad`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-irr]');
    await page.click('[data-irr="calma"][data-valor="Tarda horas"]');
    r.irrSuelta = /Irritabilidad moderada/i.test(await page.textContent('#guiaIrrRes'))
      && /Irritabilidad/.test(await page.textContent('#guiaTitulo')) && !(await page.$('#guiaContenido h2'));
    // No escribe nada del paciente: ni IndexedDB ni el canal de sesión
    r.sinSesion = await page.evaluate(async () => !(await indexedDB.databases?.() || []).some(d => d.name === 'physiq'));
    // (después de comprobar que la guía no crea la sesión: la app sí la abre)
    // La app enlaza «Hojas para imprimir» desde el panel de sesión
    {
      const app = await context.newPage();
      await abrirApp(app);
      await app.evaluate(() => window.toggleSessionPanel());
      await app.waitForSelector('#sessionHojas');
      const href = await app.evaluate(() => document.getElementById('sessionHojas').href);
      r.enlaceApp = /guia\.html#hojas$/.test(href) && (await app.request.get(href.replace(/#.*/, ''))).ok()
        && await app.evaluate(() => document.getElementById('sessionHojas').target === '_blank');
      await app.close();
    }
  } catch (e) { r.error = e.message; }
  await context.close();
  r.fallidas = fallidas;
  r.ok = !r.error && r.cribado?.mismo && r.cribado.urgencias > 0 && r.cribado.ia && r.cribado.enlaces > 0 && r.ficha && r.ancla && r.arbol
    && r.confirmacion && r.calc && r.desmarca && r.borrar && r.sinGuardar && r.irritabilidad?.length === 0 && r.irrDesmarca && r.irrBorrar && r.region && r.pauta && r.ancho_cribado && r.ancho_irritabilidad && r.ancho_arbol && r.ancho_confirmacion && r.tejidos && r.tejFicha && r.tejFiltro && r.tejHueso && r.papelViejo && r.papelOtraHoja && r.papelAlDia && r.hojas && r.libretos && r.condiciones && r.farmacos && r.irrSuelta && r.enlaceApp && r.sinSesion && !fallidas.length;
  return r;
}

async function abrirApp(page, url = BASE_URL) {
  if (!page.__fallidas) {
    page.__fallidas = [];
    page.on('requestfailed', r => page.__fallidas.push(`${r.url().replace(url, '')} (${r.failure()?.errorText || 'error'})`));
  }
  page.__fallidas.length = 0;
  // Cada apertura empieza sin sesión guardada: pasada la fase 1 el nombre automático
  // hace que se guarde, y otra apertura en el mismo contexto la restauraría. Las
  // pruebas de restauración recargan con page.reload(), que no pasa por aquí.
  try {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Storage.clearDataForOrigin', { origin: new URL(url).origin, storageTypes: 'indexeddb' });
    await cdp.detach();
  } catch { /* sin CDP (otro navegador): sin limpiar */ }
  await page.goto(url, { waitUntil: 'networkidle' });
  const lista = await page.waitForFunction(() => typeof window.goToPhase === 'function' && !!window.state, null, { timeout: 10000 })
    .then(() => true, () => false);
  if (!lista) {
    const propias = page.__fallidas.filter(f => !/^https?:/.test(f));
    throw new Error(`la app no terminó de cargar (módulos sin ejecutar)${propias.length ? `; peticiones fallidas: ${propias.join(', ')}` : ''}`);
  }
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
      await abrirApp(page);
      return await walk(page, region);
    } finally { paginas.push(page); }
  });
  await Promise.all(paginas.map(p => p.context().close()));
  return res;
}

// Tarjeta «Síntomas» de la fase 3 (docs/sintomas-multiples.md), lumbar: P1 con
// zonas, hasta P4 y no más, quitar con confirmación, «Hacer principal»
// intercambia NRS e irritabilidad, se restaura al recargar, sale en la fase 5,
// cabe a 320 px; en una región sin zonas (hombro) no se pinta.
// Matriz de irritabilidad de la fase 3 (decisiones 99–104 de
// docs/plan-tratamiento.md): sin preselección, el tiempo en calmarse marca el
// suelo y los otros tres lo suben, segundo toque vacía, el impacto en las
// actividades no cuenta, tabla y tarjetas sincronizadas, cabe a 320 px, textos
// de Maitland, fase 5 y modo breve con la pista.
async function checkIrritabilidad(page) {
  const r = {};
  await page.setViewportSize({ width: 1280, height: 900 });
  await abrirApp(page);
  await irAFase2(page, 'lumbar');
  await page.click('#btnContinuarSinss');
  await page.waitForSelector('#irritabTabla .irritab-btn');
  const resumen = () => page.textContent('#irritabilidadResumen');
  const tabla = (k, t) => page.click(`#irritabTabla .irritab-btn[data-key="${k}"]:has-text("${t}")`);
  r.sinPreseleccion = await page.evaluate(() => !document.querySelector('.irritab-btn.selected') && state.irritabilidadNivel === null)
    && (await resumen()).includes('Irritabilidad no registrada');
  r.filas = await page.evaluate(() => [...document.querySelectorAll('#irritabTabla tbody tr td:first-child')].map(td => td.firstChild.textContent).join('|'))
    === 'Dolor en reposo|Dolor con movimiento|Tolerancia al estrés físico|Tiempo en calmarse';
  r.unaLineaEscritorio = await page.evaluate(() => [...document.querySelectorAll('#irritabTabla .irritab-select')]
    .every(sel => new Set([...sel.children].map(b => Math.round(b.getBoundingClientRect().top))).size === 1));
  r.impactoEnSeveridad = await page.evaluate(() => !!document.querySelector('.card #nrsLabel ~ #impactoActividades .irritab-btn')
    && !document.querySelector('#irritabTabla [data-key="discapacidad"], #irritabTabla [data-key="dolor"]'));
  await tabla('calma', 'Horas');
  r.suelo = await page.evaluate(() => state.irritabilidadNivel === 'Moderada') && (await resumen()).includes('hasta el dolor')
    && (await resumen()).includes('Matriz incompleta');
  await tabla('reposo', 'Presente'); await tabla('movimiento', 'Antes FR'); await tabla('tolerancia', 'Moderada');
  r.otrosSuben = await page.evaluate(() => state.irritabilidadNivel === 'Alta') && (await resumen()).includes('se confirma en la 2.ª visita')
    && !(await resumen()).includes('incompleta');
  await tabla('tolerancia', 'Moderada');
  r.segundoToque = await page.evaluate(() => state.irritabilidad.tolerancia === '' && state.irritabilidadNivel === 'Moderada'
    && !document.querySelector('.irritab-btn[data-key="tolerancia"].selected'));
  await page.click('#impactoActividades .irritab-btn:has-text("Alto")');
  r.impactoNoCuenta = await page.evaluate(() => state.irritabilidad.discapacidad === 'Alta' && state.irritabilidadNivel === 'Moderada');
  // Móvil a 320 px: las tarjetas muestran lo mismo y elegir en ellas repinta la tabla
  await page.setViewportSize({ width: 320, height: 700 });
  r.tarjetasSincronizadas = await page.evaluate(() => {
    const sel = v => [...document.querySelectorAll(`${v} .irritab-btn.selected`)].map(b => `${b.dataset.key}=${b.dataset.valor}`).sort().join();
    return sel('#irritabTarjetas') === sel('#irritabTabla') && sel('#irritabTarjetas').includes('calma=Tarda horas');
  });
  await page.click('#irritabTarjetas .irritab-btn[data-key="calma"]:has-text("Minutos")');
  r.tablaSincronizada = await page.evaluate(() => document.querySelector('#irritabTabla .irritab-btn[data-key="calma"][data-valor="Cede en minutos"]').classList.contains('selected')
    && !document.querySelector('#irritabTabla .irritab-btn[data-key="calma"][data-valor="Tarda horas"]').classList.contains('selected'));
  r.cabe320 = await page.evaluate(() => document.documentElement.scrollWidth <= 320
    && [...document.querySelectorAll('#irritabTarjetas .irritab-btn, #impactoActividades .irritab-btn')].every(b => b.scrollWidth <= b.clientWidth + 1 && b.getBoundingClientRect().height < 48)
    && [...document.querySelectorAll('#irritabTarjetas .irritab-card, #impactoActividades')].every(c => c.getBoundingClientRect().right <= 320));
  // Todo en lo más bajo → baja, «hasta el límite»
  for (const [k, t] of [['reposo', 'Ausente'], ['movimiento', 'FR + SP'], ['tolerancia', 'Alta']]) await page.click(`#irritabTarjetas .irritab-btn[data-key="${k}"]:has-text("${t}")`);
  r.baja = await page.evaluate(() => state.irritabilidadNivel === 'Baja') && (await resumen()).includes('hasta el límite');
  // Fase 5: nivel, tiempo en calmarse e impacto
  r.fase5 = await page.evaluate(() => { buildResults(); const t = document.getElementById('resultsContent').textContent;
    return t.includes('Tiempo en calmarse') && t.includes('Cede en minutos') && t.includes('Impacto en las actividades'); });
  // Se restaura al recargar (con nombre, la sesión se guarda)
  await page.evaluate(() => { document.getElementById('patientName').value = 'Prueba irritabilidad'; saveSession(); });
  await page.waitForTimeout(300);
  // Recarga (no abrirApp, que empieza sin sesión guardada)
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#irritabTarjetas .irritab-btn.selected');
  r.restaurada = await page.evaluate(() => state.irritabilidadNivel === 'Baja' && state.irritabilidad.calma === 'Cede en minutos'
    && document.querySelectorAll('#irritabTarjetas .irritab-btn.selected').length === 4);
  // Modo breve: la pista del dato clave bajo el nivel directo
  await page.evaluate(() => { goToPhase(1); });
  await page.evaluate(() => selectModo('breve'));
  await page.evaluate(() => { goToPhase(3); });
  r.pistaBreve = await page.evaluate(() => { const p = document.getElementById('irritabPistaBreve'); return !!p && p.offsetParent !== null && p.textContent.includes('cuánto tarda en calmarse'); });
  r.ok = Object.values(r).every(Boolean);
  return r;
}

async function checkSintomas(page) {
  const r = {};
  await page.setViewportSize({ width: 320, height: 700 });
  await abrirApp(page);
  await page.evaluate(() => { document.getElementById('patientName').value = 'Prueba síntomas'; });
  await irAFase2(page, 'lumbar');
  await page.click('#btnContinuarSinss');
  await page.waitForSelector('#cardSintomas:not([hidden]) #sintItem_0');
  await page.click('#sintItem_0 .sint-zona:has-text("Zona lumbar")');
  await page.click('#sintItem_0 .sint-zona:has-text("Glúteo")');
  await page.click('#phase3 .nrs-btn >> nth=7');
  // «+ Añadir síntoma» con el estilo de botón de la app (no el nativo): 44 px y radio
  r.botonAnadir = await page.evaluate(() => {
    const b = document.querySelector('.sint-anadir'), cs = getComputedStyle(b);
    return b.getBoundingClientRect().height >= 44 && cs.borderRadius === '10px' && /Outfit/.test(cs.fontFamily);
  });
  for (let n = 0; n < 3; n++) await page.click('.sint-anadir');
  r.sinCuarto = await page.locator('.sint-anadir').count() === 0;
  await page.click('#sintItem_1 .sint-zona:has-text("Pierna por debajo")');
  await page.click('#sintItem_1 .sint-nrs-btn >> nth=3');
  await page.click('#sintItem_1 .option-btn:has-text("Moderada")');
  await page.click('#sintItem_1 .option-btn:has-text("Si P1 empeora")');
  await page.click('#sintItem_2 .sint-otra');
  await page.fill('#sintZonaLibre_2', 'Rodilla');
  await page.dispatchEvent('#sintZonaLibre_2', 'change');
  r.otraSinRelacion = await page.locator('#sintItem_2 .sint-relacion').count() === 0;
  // P4 vacío se quita sin preguntar; P3 con datos pide confirmación
  await page.click('#sintItem_3 .sint-quitar');
  r.quitarVacio = await page.evaluate(() => state.sintomasSecundarios.length === 2 && !document.querySelector('.confirm-box'));
  r.cabe = await page.evaluate(() => {
    const c = document.getElementById('cardSintomas').getBoundingClientRect();
    // Los chips de la descripción van en su fila con desplazamiento lateral (.chip-row), como en el resto de la app
    const dentro = [...document.querySelectorAll('#cardSintomas button:not(.chip-btn), #cardSintomas input')].every(e => {
      const b = e.getBoundingClientRect(); return b.width === 0 || (b.left >= c.left - 1 && b.right <= c.right + 1);
    });
    const unaLinea = [...document.querySelectorAll('#cardSintomas .sint-grupo .option-btn')].every(b => b.scrollWidth <= b.clientWidth + 1);
    return dentro && unaLinea && document.documentElement.scrollWidth <= innerWidth;
  });
  // Restaurar: recarga con nombre de paciente (la sesión se guarda en IDB)
  await page.evaluate(() => saveSession());
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => state.maxVisitedIdx >= 2);
  await page.evaluate(() => goToPhase(3));
  await page.waitForSelector('#sintItem_2');
  r.restaurado = await page.evaluate(() => state.sintomaPrincipal.zonas.join() === 'lumbar,gluteo'
    && state.sintomasSecundarios[0].nrs === 3 && state.sintomasSecundarios[1].otraRegion
    && document.querySelector('#sintItem_0 .sint-zona.selected')?.textContent === 'Zona lumbar');
  // Hacer principal P2: su NRS e irritabilidad pasan a las tarjetas de P1, y
  // la matriz (del P1 anterior) se vacía salvo el impacto en las actividades
  await contestarMatriz(page);
  await page.locator('#impactoActividades .irritab-btn:visible').nth(1).click();
  await page.click('#sintItem_1 .sint-accion:has-text("Hacer principal")');
  await page.click('.confirm-box-btns button:has-text("Cambiar")');
  r.cambio = await page.evaluate(() => state.sintomaPrincipal.zonas.join() === 'pierna' && state.severidad === 3
    && state.irritabilidadNivel === 'Moderada' && state.sintomasSecundarios[0].nrs === 7
    && state.sintomasSecundarios.every(s => !s.relacion)
    && document.querySelector('#phase3 .nrs-btn.selected')?.textContent.trim() === '3');
  r.matrizVaciada = await page.evaluate(() => ['reposo', 'movimiento', 'tolerancia', 'calma'].every(k => !state.irritabilidad[k])
    && !document.querySelector('#irritabTabla .irritab-btn.selected, #irritabTarjetas .irritab-btn.selected')
    && state.irritabilidad.discapacidad === 'Moderada' && state.irritabilidadDirecta);
  // P3 (otra región) con datos: quitar pide confirmación; se cancela
  await page.click('#sintItem_2 .sint-quitar');
  await page.waitForSelector('.confirm-box-btns');
  await page.keyboard.press('Escape');
  r.quitarCancelado = await page.evaluate(() => state.sintomasSecundarios.length === 2);
  // Paso 3 (pistas en el árbol): el recuadro «📝» del paso 1 lumbar recuerda
  // P1 (pierna) y P2 (zona lumbar), no la otra región, y no contesta el paso
  // (en el mismo recuadro que las respuestas del formulario previo ligadas al paso, que van antes)
  await page.evaluate(() => { state.formularioPrevio.regiones.lumbar = { pierna_hasta: 'Hasta el pie' }; goToPhase(4); });
  await page.waitForSelector('#lu_step1 .fp-pistas');
  r.pistaArbol = await page.evaluate(() => {
    const cajas = document.querySelectorAll('#lu_step1 .fp-pistas'), t = cajas[0].textContent;
    return cajas.length === 1 && t.indexOf('Hasta el pie') > -1 && t.indexOf('Hasta el pie') < t.indexOf('Síntoma P1')
      && t.includes('Síntoma P1 (principal): Pierna por debajo de la rodilla') && t.includes('NRS 3/10')
      && t.includes('Síntoma P2: Zona lumbar, glúteo') && !t.includes('Rodilla ·') && !t.includes('P3')
      && Object.keys(state.treeAnswers).length === 0 && !document.querySelector('#lu_step1 .option-btn.selected');
  });
  // Fase 5
  await page.evaluate(() => { state.maxVisitedIdx = 5; buildResults(); goToPhase(5); });
  await page.waitForSelector('#resultsContent .summary-section');
  r.fase5 = await page.evaluate(() => {
    const t = document.getElementById('resultsContent').textContent;
    return t.includes('Síntoma principal (P1)') && t.includes('Pierna por debajo de la rodilla') && t.includes('P3') && t.includes('otra región, no valorada hoy');
  });
  // Paso 2, una región por vez: sus zonas en orden y «Central» solo en columna;
  // el cambio de región borra los síntomas
  const cambiarRegion = async region => {
    await page.evaluate(() => goToPhase(2));
    await page.click(`[onclick="selectRegion('${region}', this)"]`);
    const confirmar = await page.waitForSelector('.confirm-box-btns button:has-text("Cambiar región")', { timeout: 3000 }).catch(() => null);
    if (confirmar) await confirmar.click();
    await page.click('#btnContinuarSinss');
    await page.waitForFunction(r => state.region === r && state.currentPhase === 3, region);
  };
  const zonasDe = async (region, esperadas, central) => {
    await cambiarRegion(region);
    await page.waitForSelector('#cardSintomas:not([hidden]) #sintItem_0');
    return page.evaluate(({ esperadas, central }) => {
      const zonas = [...document.querySelectorAll('#sintItem_0 .sint-zona')].map(b => b.textContent);
      const c = document.getElementById('cardSintomas').getBoundingClientRect();
      const dentro = [...document.querySelectorAll('#cardSintomas .sint-zona')].every(b => { const x = b.getBoundingClientRect(); return x.left >= c.left - 1 && x.right <= c.right + 1; });
      return JSON.stringify(zonas) === JSON.stringify(esperadas) && !!document.querySelector('#sintItem_0 .lado-central') === central
        && dentro && state.sintomasSecundarios.length === 0 && state.sintomaPrincipal.zonas.length === 0;
    }, { esperadas, central });
  };
  r.cervical = await zonasDe('cervical', ['Cuello', 'Cabeza', 'Trapecio o escápula', 'Hombro', 'Brazo', 'Antebrazo y mano', 'Zona dorsal'], true);
  // Pistas en el árbol cervical: la mano sale en el paso 1 (mielopatía)
  await page.click('#sintItem_0 .sint-zona:has-text("Antebrazo y mano")');
  await page.evaluate(() => goToPhase(4));
  await page.waitForSelector('#ce_step1 .fp-pistas');
  r.pistaCervical = await page.evaluate(() => document.querySelector('#ce_step1 .fp-pistas').textContent.includes('Síntoma P1 (principal): Antebrazo y mano')
    && Object.keys(state.treeAnswers).length === 0);
  r.hombro = await zonasDe('hombro', ['Hombro anterior', 'Hombro lateral (deltoides)', 'Hombro posterior', 'Brazo hasta el codo', 'Por debajo del codo', 'Cuello o trapecio'], false);
  // Pistas en el árbol de hombro: el cuello sale en el paso 1 (cribado cervical)
  await page.click('#sintItem_0 .sint-zona:has-text("Cuello o trapecio")');
  await page.evaluate(() => goToPhase(4));
  await page.waitForSelector('#h_step1 .fp-pistas');
  r.pistaHombro = await page.evaluate(() => document.querySelector('#h_step1 .fp-pistas').textContent.includes('Síntoma P1 (principal): Cuello o trapecio')
    && Object.keys(state.treeAnswers).length === 0);
  r.codo = await zonasDe('codo', ['Codo lateral', 'Codo medial', 'Codo posterior', 'Codo anterior', 'Antebrazo', 'Mano'], false);
  // Pistas en el árbol de codo: el codo anterior sale en el paso 1 (bíceps distal)
  await page.click('#sintItem_0 .sint-zona:has-text("Codo anterior")');
  await page.evaluate(() => goToPhase(4));
  await page.waitForSelector('#co_step1 .fp-pistas');
  r.pistaCodo = await page.evaluate(() => document.querySelector('#co_step1 .fp-pistas').textContent.includes('Síntoma P1 (principal): Codo anterior')
    && Object.keys(state.treeAnswers).length === 0);
  r.cadera = await zonasDe('cadera', ['Ingle', 'Cadera lateral', 'Glúteo', 'Muslo anterior', 'Rodilla', 'Zona lumbar'], false);
  // Pistas en el árbol de cadera: el glúteo sale en el paso 1 (sacroilíaca)
  await page.click('#sintItem_0 .sint-zona:has-text("Glúteo")');
  await page.evaluate(() => goToPhase(4));
  await page.waitForSelector('#ca_step1 .fp-pistas');
  r.pistaCadera = await page.evaluate(() => document.querySelector('#ca_step1 .fp-pistas').textContent.includes('Síntoma P1 (principal): Glúteo')
    && Object.keys(state.treeAnswers).length === 0);
  r.rodilla = await zonasDe('rodilla', ['Rodilla anterior (rótula)', 'Rodilla medial', 'Rodilla lateral', 'Rodilla posterior (hueco poplíteo)', 'Muslo', 'Pierna'], false);
  // Pistas en el árbol de rodilla: la rótula sale en el paso 1b (Ottawa), que
  // solo aparece tras contestar el paso 1; se contesta y la pista no contesta el 1b
  await page.click('#sintItem_0 .sint-zona:has-text("Rodilla anterior")');
  await page.evaluate(() => goToPhase(4));
  await page.click('#ro_step1 .option-group .option-btn >> nth=0');
  await page.waitForSelector('#ro_step1b .fp-pistas');
  r.pistaRodilla = await page.evaluate(() => document.querySelector('#ro_step1b .fp-pistas').textContent.includes('Síntoma P1 (principal): Rodilla anterior (rótula)')
    && !('ro_step1b' in state.treeAnswers) && !document.querySelector('#ro_step1 .fp-pistas'));
  r.tobillo = await zonasDe('tobillo_pie', ['Tobillo lateral', 'Tobillo medial', 'Tobillo anterior', 'Tendón de Aquiles', 'Talón o planta', 'Mediopié', 'Antepié o dedos', 'Pantorrilla'], false);
  // Pistas en el árbol de tobillo y pie: el tobillo lateral sale en el paso 2
  // (Ottawa), que aparece al contestar SÍ al 1; la pista no contesta el 2
  await page.click('#sintItem_0 .sint-zona:has-text("Tobillo lateral")');
  await page.evaluate(() => goToPhase(4));
  await page.click('#tp_step1 .option-group .option-btn >> nth=0');
  await page.waitForSelector('#tp_step2 .fp-pistas');
  r.pistaTobillo = await page.evaluate(() => document.querySelector('#tp_step2 .fp-pistas').textContent.includes('Síntoma P1 (principal): Tobillo lateral')
    && !('tp_step2' in state.treeAnswers) && !document.querySelector('#tp_step1 .fp-pistas'));
  r.ok = r.sinCuarto && r.otraSinRelacion && r.quitarVacio && r.cabe && r.restaurado && r.cambio && r.matrizVaciada && r.quitarCancelado && r.pistaArbol && r.fase5 && r.cervical && r.pistaCervical && r.pistaHombro && r.pistaCodo && r.pistaCadera && r.pistaRodilla && r.pistaTobillo && r.hombro && r.codo && r.cadera && r.rodilla && r.tobillo;
  return r;
}

// Sacro, cóccix y periné en lumbar (decisión 5 de docs/tarlov.md; diseño en
// docs/sintomas-multiples.md): chips a 320 px; P1 central sin «el de la región»;
// recordatorio del periné → «Ir a la pregunta» lleva a l6 (acordeón en móvil,
// pestaña en escritorio) sin contestarla; con l6 en SÍ desaparece; el sacro sale
// en el paso 4 del árbol y el cóccix en ninguno.
async function checkZonasCentrales(page) {
  const r = {};
  await page.setViewportSize({ width: 320, height: 700 });
  await abrirApp(page);
  await irAFase2(page, 'lumbar');
  await page.evaluate(() => { state.lado = 'Derecho'; });
  await page.click('#btnContinuarSinss');
  await page.waitForSelector('#cardSintomas:not([hidden]) #sintItem_0');
  r.chips = await page.evaluate(() => {
    const zonas = [...document.querySelectorAll('#sintItem_0 .sint-zona')].map(b => b.textContent);
    const c = document.getElementById('cardSintomas').getBoundingClientRect();
    const dentro = [...document.querySelectorAll('#cardSintomas .sint-zona')].every(b => { const x = b.getBoundingClientRect(); return x.left >= c.left - 1 && x.right <= c.right + 1; });
    return JSON.stringify(zonas) === JSON.stringify(['Zona lumbar', 'Sacro', 'Cóccix', 'Glúteo', 'Ingle', 'Periné, ano o genitales', 'Muslo anterior', 'Muslo posterior o lateral', 'Pierna por debajo de la rodilla', 'Pie'])
      && dentro && document.documentElement.scrollWidth <= innerWidth;
  });
  // P1 solo con zonas centrales: no da por hecho el lado de la región, ni preselecciona Central
  await page.click('#sintItem_0 .sint-zona:has-text("Cóccix")');
  r.ladoCentral = await page.evaluate(() => {
    const t = document.getElementById('sintItem_0').textContent;
    return t.includes('Zona central: marca Central') && !t.includes('Sin marcar: el de la región') && state.sintomaPrincipal.lado === ''
      && !document.querySelector('#sintItem_0 .lado-central.selected');
  });
  await page.click('#sintItem_0 .sint-zona:has-text("Glúteo")');
  r.ladoRegion = await page.evaluate(() => document.getElementById('sintItem_0').textContent.includes('Sin marcar: el de la región (derecho)'));
  await page.click('#sintItem_0 .sint-zona:has-text("Glúteo")');
  r.sinRecordatorioCoxis = await page.locator('#sintItem_0 .sint-recordatorio').count() === 0;
  // Periné: recordatorio de l6; nada del cribado cambia
  await page.click('#sintItem_0 .sint-zona:has-text("Periné")');
  r.recordatorio = await page.evaluate(() => {
    const el = document.querySelector('#sintItem_0 .sint-recordatorio');
    const c = document.getElementById('cardSintomas').getBoundingClientRect(), b = el?.getBoundingClientRect();
    return !!el && el.textContent.includes('urgencia hoy') && el.textContent.includes('Ir a la pregunta')
      && b.left >= c.left - 1 && b.right <= c.right + 1 && state.sistemicoAnswers.l6 === 'NO' && !state.sistemicoAlerta;
  });
  // «Ir a la pregunta →» en móvil: fase 2, acordeón abierto y l6 a la vista, sin contestarla
  await page.click('#sintItem_0 .sint-recordatorio-ir');
  await page.waitForFunction(() => state.currentPhase === 2 && [...document.querySelectorAll('[id="sq2_l6"]')].some(e => e.offsetParent !== null && e.classList.contains('flash-destacar')), null, { timeout: 5000 }).catch(() => {});
  const aLaVista = () => page.evaluate(() => {
    const e = [...document.querySelectorAll('[id="sq2_l6"]')].find(x => x.offsetParent !== null);
    if (!e) return false;
    const b = e.getBoundingClientRect();
    return state.currentPhase === 2 && e.classList.contains('flash-destacar') && b.bottom > 0 && b.top < innerHeight && state.sistemicoAnswers.l6 === 'NO';
  });
  await page.waitForTimeout(700);
  r.irMovil = await aLaVista();
  // Escritorio: la pestaña del sistema de l6
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.evaluate(() => { const t = document.querySelector('.sistema-tab'); t?.click(); goToPhase(3); });
  await page.waitForSelector('#sintItem_0 .sint-recordatorio-ir');
  await page.click('#sintItem_0 .sint-recordatorio-ir');
  await page.waitForTimeout(900);
  r.irEscritorio = await aLaVista();
  // l6 en SÍ: el recordatorio desaparece (la urgencia ya sale en todas partes)
  await page.locator('[id="sq2_l6"] .sq-btn.si').filter({ visible: true }).first().click();
  await page.evaluate(() => goToPhase(3));
  await page.waitForSelector('#sintItem_0');
  r.conL6 = await page.evaluate(() => state.sistemicoAnswers.l6 === 'SI' && !document.querySelector('#sintItem_0 .sint-recordatorio'));
  await page.evaluate(() => goToPhase(2));
  await page.locator('[id="sq2_l6"] .sq-btn.no').filter({ visible: true }).first().click();
  // Árbol: P2 en el sacro sale en el paso 4; P1 (cóccix y periné) no
  await page.evaluate(() => goToPhase(3));
  await page.click('.sint-anadir');
  await page.click('#sintItem_1 .sint-zona:has-text("Sacro")');
  await page.evaluate(() => goToPhase(4));
  await page.click('#lu_step1 .option-group .option-btn >> nth=1');
  await page.click('#lu_step2 .option-group .option-btn >> nth=1');
  await page.click('#lu_step3 .option-group .option-btn >> nth=2');
  await page.waitForSelector('#lu_step4 .fp-pistas');
  r.pistaSacro = await page.evaluate(() => {
    const t = document.querySelector('#lu_step4 .fp-pistas').textContent;
    return t.includes('Síntoma P2: Sacro') && !t.includes('Síntoma P1') && !('lu_step4' in state.treeAnswers);
  });
  r.ok = r.chips && r.ladoCentral && r.ladoRegion && r.sinRecordatorioCoxis && r.recordatorio && r.irMovil && r.irEscritorio && r.conL6 && r.pistaSacro;
  return r;
}

// Cada sección devuelve true si pasa; imprime su propio detalle.
// `id` es lo que se pasa a --solo.
// Móvil: la barra fija de navegación está dentro de la fase; si la animación
// de entrada llevara transform, durante ella se colocaría respecto a la fase
// (al final de la página, tapando «Plan de tratamiento →») y luego saltaría.
async function checkBarraFijaAnimacion(browser, errors) {
  const context = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(`pageerror (barra fija): ${err.message}`));
  await abrirApp(page);
  await walkRegion(page, 'lumbar');
  await page.click('#btnIrPlan');
  await page.waitForSelector('#planContenido .card');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const r = await page.evaluate(() => new Promise(res => {
    const barra = document.querySelector('#phase5 .nav-buttons');
    const fase = document.getElementById('phase5');
    let peor = 0, transform = false, n = 0;
    const t0 = performance.now();
    const tick = () => {
      const b = barra.getBoundingClientRect();
      peor = Math.max(peor, Math.abs(b.bottom - window.innerHeight));
      if (getComputedStyle(fase).transform !== 'none') transform = true;
      n++;
      if (performance.now() - t0 < 600) requestAnimationFrame(tick); else res({ peor: Math.round(peor), transform, n });
    };
    document.querySelector('#phase6 .nav-buttons .btn-secondary').click();
    requestAnimationFrame(tick);
  }));
  r.ok = r.n > 5 && r.peor <= 1 && !r.transform;
  await context.close();
  return r;
}

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
  { id: 'atras-ventanas', titulo: 'Atrás con una ventana abierta (móvil):', run: async ({ browser }) => {
    const c = await checkAtrasVentanas(browser);
    console.log(`  ${c.ok ? '✓' : '✗'} el atrás cierra el panel de sesión, la hoja de fases, el teclado numérico y un diálogo (como «Cancelar», volviendo al panel) sin cambiar de fase; la fase elegida en la hoja navega; abrir y cerrar de cualquier forma no deja entradas (un atrás cambia de fase); la acción de un diálogo se ejecuta${c.ok ? '' : ' ' + JSON.stringify(c)}`);
    return c.ok;
  } },
  { id: 'salida-app', titulo: 'Atrás que cerraría la app (móvil):', run: async ({ browser }) => {
    const c = await checkSalidaApp(browser);
    console.log(`  ${c.ok ? '✓' : '✗'} sin datos sale sin preguntar; con datos sin nombre pregunta, «Seguir aquí» se queda y el atrás vuelve a preguntar, «Salir» sale; con nombre y grabando avisa de la grabación y de que queda guardada (Escape se queda), sin grabar solo de lo segundo y «Salir» sale; fuera de la fase 1 el atrás cambia de fase; pasada la fase 1 sin nombre, también en modo teclado, nombre automático, que se puede vaciar para escribir el real${c.ok ? '' : ' ' + JSON.stringify(c)}`);
    return c.ok;
  } },
  { id: 'barra-fase', titulo: 'Barra de fase en móvil:', run: async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await abrirApp(page);
    await page.click('#mobilePhaseBar', { position: { x: 60, y: 20 } }).catch(() => {});
    await page.waitForTimeout(150);
    const sheetOpen = await page.evaluate(() => document.getElementById('phaseSheet')?.classList.contains('open')
      && document.getElementById('mobilePhaseBar').getAttribute('aria-expanded') === 'true');
    console.log(`  ${sheetOpen ? '✓' : '✗'} Phase sheet opens from the phase bar: ${sheetOpen}`);
    // Icono de la fase actual (flecha SVG) centrado en su círculo
    const iconoCentrado = await page.evaluate(() => {
      const c = document.querySelector('.phase-sheet-item.psi-active .phase-sheet-icon');
      const a = c?.getBoundingClientRect(), i = c?.querySelector('svg')?.getBoundingClientRect();
      return !!i && Math.abs((a.top + a.bottom) / 2 - (i.top + i.bottom) / 2) < 1 && Math.abs((a.left + a.right) / 2 - (i.left + i.right) / 2) < 1;
    });
    // Cada círculo lleva el número de su fase (4b, 5, 6), no la posición
    const numeros = await page.evaluate(() => [...document.querySelectorAll('.phase-sheet-item.psi-blocked')]
      .map(it => [it.querySelector('.phase-sheet-icon').textContent.trim(), it.querySelector('.phase-sheet-name').textContent.match(/^Fase (\S+)/)?.[1]]));
    const numerosOk = numeros.some(([c]) => c === '4b') && numeros.every(([c, f]) => c === f);
    console.log(`  ${iconoCentrado && numerosOk ? '✓' : '✗'} hoja de fases: la flecha de la fase actual está centrada en su círculo; los círculos llevan el número de la fase (${numeros.map(([c]) => c).join(', ')})`);
    await page.evaluate(() => closePhaseSheet());
    const barraFase = await checkBarraFase(page);
    console.log(`  ${barraFase.ok ? '✓' : '✗'} barra de fase en móvil: botón entero sin caja en «≡», aria-expanded vuelve a false al cerrar; chip «Breve» en la barra (no en la cabecera) en móvil y en la cabecera en escritorio; cabe a 320 px${barraFase.ok ? '' : ' ' + JSON.stringify(barraFase)}`);
    return sheetOpen === true && iconoCentrado && numerosOk && barraFase.ok;
  } },

  { id: 'banda-formulario', titulo: 'Bandas de contexto del formulario previo y del cribado:', run: async ({ page }) => {
    const r = await checkBandaFormulario(page);
    console.log(`  ${r.ok ? '✓' : '✗'} formulario previo (fases 1 y 2, 390 y 1280 px): la banda aparece con la cabecera fuera, con nombre y contador (que se actualiza al responder sin hacer scroll, y cuenta cada fila de una matriz), se va al pasar el formulario, al cerrarlo y al cambiar de fase; «↑ volver» lleva a la cabecera; formulario regional y sistema abierto nunca a la vez, y la del sistema se va al dejarlo atrás; cabe a 320 px${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'cribado', titulo: 'Razonamiento del cribado (lumbar):', run: async ({ page }) => {
    const razonEsc = await checkRazonamientoEscritorio(page);
    console.log(`  ${razonEsc.ok ? '✓' : '✗'} escritorio: panel lateral sin velo, SÍ con el panel abierto, cambia de pregunta, Escape cierra; ancho 380 → 560 px según la pantalla sin tapar la fase`);
    const razonMov = await checkRazonamientoMovil(page);
    console.log(`  ${razonMov.ok ? '✓' : '✗'} 390 px: bottom sheet con velo, atrás lo cierra en la fase 2, sin ✕ (cierra el velo), sin entrada colgando`);
    if (!razonEsc.ok) console.log('\nRazonamiento escritorio:', JSON.stringify(razonEsc));
    if (!razonMov.ok) console.log('\nRazonamiento 390 px:', JSON.stringify(razonMov));
    return razonEsc.ok && razonMov.ok;
  } },

  { id: 'banderas', titulo: '«¿Por qué?» de las banderas (lumbar, posquirúrgico en lumbar y rodilla):', run: async ({ browser }) => {
    const r = await checkBanderas(browser);
    console.log(`  ${r.ok ? '✓' : '✗'} el ⓘ de una bandera despliega por qué y cuánto pesa (otro toque lo pliega) y su «Ampliar →» abre su pregunta en el panel (escritorio y sheet a 390 px que atrás cierra en la fase 2); sin «¿Por qué?», sin ⓘ; «· fase 1»; las banderas posquirúrgicas de miembros no salen en lumbar y en rodilla sí, con ⓘ${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'ia', titulo: '«✨ Ampliar con IA» y «✨ Preguntar a la IA»:', run: async ({ browser, errors }) => {
    const ampliarIA = await checkAmpliarIA(browser);
    console.log(`  ${ampliarIA.ok ? '✓' : '✗'} «✨ IA ↗» por párrafo y barra al seleccionar abren Perplexity con contexto y la frase de fuentes, sin datos del paciente; la barra 8 px bajo la selección con ratón y 32 px en táctil (libres los marcadores); el menú ▾ explica cada IA y recuerda Google; cerrado sin elegir y sin selección, la barra desaparece; al hacer scroll el menú se cierra y la barra no se pinta sobre la cabecera (se esconde y vuelve); fuera del razonamiento no hay barra; en el hub, nada${ampliarIA.ok ? '' : ' ' + JSON.stringify(ampliarIA)}`);
    const preguntaIA = await checkPreguntaIA(browser, errors);
    console.log(`  ${preguntaIA.ok ? '✓' : '✗'} «✨ Preguntar a la IA» (cabecera): diálogo con aviso, vacía no navega, prompt con la región y la frase de fuentes sin datos del paciente, 🎤 junto al título que llena el texto, se corta al cerrar y se desactiva grabando, Claude se recuerda, modalidades «Fármacos» y «Ejercicio» con su guion (y vuelve a «Pregunta libre» al reabrir), Escape cierra; hoja inferior en móvil sin teclado al abrir que atrás cierra; cabe a 320 px; en el hub, nada${preguntaIA.ok ? '' : ' ' + JSON.stringify(preguntaIA)}`);
    return ampliarIA.ok && preguntaIA.ok;
  } },

  { id: 'tejidos', titulo: '«⏱ Tiempos de recuperación»:', run: async ({ browser, errors }) => {
    const tejidos = await checkTiemposTejido(browser, errors);
    console.log(`  ${tejidos.ok ? '✓' : '✗'} «⏱ Tiempos de recuperación» (cabecera): diálogo ancho con una barra por fila y el eje fijo al hacer scroll (con la tira de colores de las fases), filtro por tejido en una fila sin «Todos» (se recuerda; un segundo toque o el título del grupo vuelven a todos; «Menisco», grupo propio), qué mide cada barra por su relleno, subtipos plegados que se despliegan, «Este paciente» según las hipótesis activas, el mecanismo y la cronología (y aviso de las que no tienen plazo), tarjeta de una barra con sus fuentes enlazadas en línea con « · » (líneas de 24 px y toque de 32 px en táctil) y las de la nota de grupo plegadas, sin «Hoy» sin cirugía y con «Hoy» a las 6 semanas posquirúrgicas, Escape y velo cierran, fuera del payload; hoja inferior en móvil que atrás cierra; cabecera y panel caben a 320 px; también en el hub${tejidos.ok ? '' : ' ' + JSON.stringify(tejidos)}`);
    return tejidos.ok;
  } },

  { id: 'guia', titulo: 'Guía de consulta (guia.html, la del QR de los esquemas):', run: async ({ browser, errors }) => {
    const c = await checkGuia(browser, errors);
    console.log(`  ${c.ok ? '✓' : '✗'} carga sin errores; cribado con la numeración y el orden de la hoja (lib/esquemas.js), urgencias, «✨ IA» y fuentes enlazadas; una cita abre su ficha; #región/hoja/elemento lo resalta y abre su «Por qué»; pestañas Árbol y Confirmación con todos los pasos y tests; calculadora de la 4b con la misma etiqueta que la app (calcLRScore), resumen ordenado, segundo toque desmarca y «Borrar resultados» limpia, sin guardar nada; pestaña Irritabilidad con el mismo nivel que nivelMatriz (fases 3 y 6) y su aviso de matriz incompleta, segundo toque y «Borrar respuestas»; cambiar de región; la pauta y el pronóstico de cada hipótesis, con la derivación a la vista; tiempos de tejido (#tejidos/hoja, el QR de sus dos hojas) con solo los grupos de cada hoja, la ficha de una barra con fuentes enlazadas y el filtro; hoja impresa desfasada (?h= del QR distinto de huellas.json): aviso con el PDF actual, «al día» si coincide y nada en otra pestaña; «Hojas para imprimir» con los libretos a doble cara y la versión de cada hoja y su PDF; condiciones especiales (#condiciones) sin estado del paciente; fármacos (#farmacos) con la copia del nombre para CIMA; irritabilidad suelta (#irritabilidad); la app la enlaza desde el panel de sesión («Hojas para imprimir»); cabe a 320 px; no crea la sesión del paciente${c.ok ? '' : ' ' + JSON.stringify(c)}`);
    return c.ok;
  } },

  { id: 'citas', titulo: 'Citas tocables (fuentes de las fases 2–6 y de la calculadora):', run: async ({ browser, errors }) => {
    const c = await checkCitas(browser, errors);
    console.log(`  ${c.ok ? '✓' : '✗'} en el texto solo autor y año; al tocar, la ficha con la cita entera y «Abrir ↗» en pestaña nueva, junto a la cita; se cierra con la misma cita, fuera, Escape (foco de vuelta), al desplazar y al cambiar de fase; con teclado el foco va al enlace; al imprimir, la cita entera; dentro de una frase en las fases 3, 4b y 6 («Ampliar con IA» sigue leyendo el párrafo entero), en la fase 6 y en la calculadora también (Escape cierra la ficha antes que el panel); a 320 px táctil cabe sin desbordar${c.ok ? '' : ' ' + JSON.stringify(c)}`);
    return c.ok;
  } },

  { id: 'condiciones', titulo: 'Guía de condiciones especiales:', run: async ({ browser, errors }) => {
    const c = await checkCondiciones(browser, errors);
    console.log(`  ${c.ok ? '✓' : '✗'} Condiciones especiales (cabecera): diálogo centrado con las 11 filas en orden, «Solo en lumbar» y «Solo en cadera» y fuentes como citas; sin región, el botón de una fila de región la elige y lleva a su pregunta; con otra región pide confirmación (cancelar vuelve a la guía, también en móvil con Atrás) y la cambia; cada botón lleva a su tarjeta (fase 1) o pregunta (fase 2, con lumbar) y la resalta sin marcar nada; el estado sigue a la tarjeta; Escape cierra; oculto al imprimir; en móvil, desde «Herramientas», hoja inferior que atrás cierra en la misma fase y un botón que navega sin dejar la hoja abierta; cabe a 320 px; también en el hub${c.ok ? '' : ' ' + JSON.stringify(c)}`);
    return c.ok;
  } },

  { id: 'farmacos', titulo: 'Guía de fármacos:', run: async ({ browser, errors }) => {
    const c = await checkFarmacos(browser, errors);
    console.log(`  ${c.ok ? '✓' : '✗'} Fármacos (cabecera): diálogo centrado con las 13 familias plegadas y en orden (AINE, corticoides, anticoagulantes, opioides, gabapentinoides, antidepresivos, benzodiacepinas y relajantes, estatinas, fluoroquinolonas, betabloqueantes, diuréticos y otros antihipertensivos, insulina y antidiabéticos, fármacos que tocan el hueso), sin bloque de pendientes y acabando en su pie, los AINE y el hueso con sus cinco apartados y citas; «Ficha técnica (CIMA)»: seis enlaces de AINE al buscador de CIMA en otra pestaña, sin nada en la URL, y tocar uno copia su nombre; sigue abierta al volver de otra pestaña; «✨ IA» por párrafo con la familia como contexto y su menú por encima del velo; farmacosPreguntarIA() abre «Preguntar a la IA» en la modalidad «Fármacos»; Escape cierra; oculto al imprimir; en móvil, desde «Herramientas», hoja inferior que atrás cierra en la misma fase; cabe a 320 px; en el hub, visible sin el atajo a la IA y con los enlaces a CIMA${c.ok ? '' : ' ' + JSON.stringify(c)}`);
    return c.ok;
  } },

  { id: 'ejercicio', titulo: 'Guía de efectos del ejercicio:', run: async ({ browser, errors }) => {
    const c = await checkEjercicio(browser, errors);
    console.log(`  ${c.ok ? '✓' : '✗'} Efectos del ejercicio (cabecera): diálogo centrado con sus cinco bloques escritos, sin pendientes, y la leyenda de los tres niveles; la hipoalgesia con sus cuatro apartados, citas, «Ampliar» y un chip de nivel pulsable por afirmación (ninguno en «paciente») con su ficha por encima del velo, Escape cierra primero la ficha, «✨ IA» con el bloque como contexto; oculto al imprimir; cabecera sin desbordar a 769 px; en móvil, desde «Herramientas», hoja inferior que atrás cierra en la misma fase; cabe a 320 px; también en el hub${c.ok ? '' : ' ' + JSON.stringify(c)}`);
    return c.ok;
  } },

  { id: 'cuestionarios', titulo: 'Calculadora de cuestionarios:', run: async ({ browser, errors }) => {
    const c = await checkCuestionarios(browser, errors);
    console.log(`  ${c.ok ? '✓' : '✗'} Calculadora de cuestionarios (cabecera): diálogo centrado con una tarjeta por cuestionario; PHQ-9 por toques reales (incompleto, 12/27 moderados con la alerta del ítem 9, segundo toque la quita, la tarjeta enseña el resultado), zonas de Örebro marcadas y desmarcadas, «Borrar respuestas» pregunta y vuelve, Escape cierra, la fase 5 lo resume; en móvil, desde «Herramientas» (un botón en vez de tres iconos), hoja inferior que atrás cierra en la misma fase y tarjetas con la descripción larga bajo el nombre; a 320 px nada desborda y la escala 0–10 deja botones ≥ 40 px en dos filas 0–4 / 5–10 de borde a borde, como la EVA, las opciones de texto (una respuesta o varias) van en dos columnas, con la última a todo el ancho si son impares, y una por fila si alguna es larga; también en el hub${c.ok ? '' : ' ' + JSON.stringify(c)}`);
    return c.ok;
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

  { id: 'silueta', titulo: 'Silueta de la fase 2 (región y lado de un toque, 320 px):', run: async ({ page }) => {
    const r = await checkSilueta(page);
    console.log(`  ${r.ok ? '✓' : '✗'} figura según el sexo de la fase 1; un toque fija región y lado; las dos zonas de la región son casillas (el otro lado añade bilateral, tocar uno lo quita, segundo toque sin lado, con «?» y borde continuo en sus dos zonas) y los botones de lado siguen; columna sin lado; el sexo es el mismo en las fases 1 y 2 (se cambia y se quita desde cualquiera) y la figura lo sigue; la figura no salta al cambiar el sexo ni el lado, y las dos figuras miden lo mismo de alto; la lista sigue; cambiar de región pide confirmación; zonas de 44 px sin pisarse a 320 px; colores del tema${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'lado', titulo: 'Sexo (fase 1) y lado afectado (fase 2):', run: async ({ page }) => {
    const r = await checkLado(page);
    console.log(`  ${r.ok ? '✓' : '✗'} sexo se guarda y se borra con un segundo toque; lado aparece al elegir región, «Central» solo en columna; todo cabe a 320 px`);
    if (!r.ok) console.log('\nLado afectado:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'hipermovilidad', titulo: 'Hipermovilidad / Ehlers-Danlos (Fase P, rodilla):', run: async ({ page }) => {
    const r = await checkHipermovilidad(page);
    console.log(`  ${r.ok ? '✓' : '✗'} tarjeta, cribado con cuestionario y Beighton, urgencias sin plegar, regla vascular, aviso 4b, fase 5 y 320 px`);
    if (!r.ok) console.log('\nHipermovilidad:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'disautonomia', titulo: 'Disautonomía / POTS (Fase P, lumbar):', run: async ({ page }) => {
    const r = await checkDisautonomia(page);
    console.log(`  ${r.ok ? '✓' : '✗'} tarjeta, síncope urgente sin plegar, paroxística, sospecha, prueba de bipedestación (compatible, hipotensión, copias sincronizadas), notas 3 y 4b, fase 5, fase 6 y 320 px`);
    if (!r.ok) console.log('\nDisautonomía:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'lupus', titulo: 'Lupus (Fase P, codo):', run: async ({ page }) => {
    const r = await checkLupus(page);
    console.log(`  ${r.ok ? '✓' : '✗'} tarjeta con sus filas, urgencias sin plegar, derivación, sospecha con rasgos (sin la palabra lupus en el informe), notas 3 y 4b, nota de hipermovilidad, fase 5, fase 6 y 320 px`);
    if (!r.ok) console.log('\nLupus:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'mastocitos', titulo: 'Trastorno mastocitario o anafilaxia (Fase P, rodilla):', run: async ({ page }) => {
    const r = await checkMastocitos(page);
    console.log(`  ${r.ok ? '✓' : '✗'} tarjeta solo con «Diagnosticado», filas y desencadenantes, derivación sin urgencia ni embudo, texto de la asociación en hipermovilidad y disautonomía, nota 4b, fase 5 (qué hacer, desmayo, riesgo alto, sin autoinyector), fase 6 y 320 px`);
    if (!r.ok) console.log('\nMastocitos:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'anticoagulado', titulo: 'Paciente anticoagulado o antiagregado (Fase P, lumbar):', run: async ({ page }) => {
    const r = await checkAnticoagulado(page);
    console.log(`  ${r.ok ? '✓' : '✗'} tarjeta «Toma» con sus chips, guía de fármacos en los antitrombóticos, golpe en la cabeza según el fármaco, urgencias sin plegar ni embudo, derivación, nota 4b, fase 5, fase 6 (aviso, tope y red) y 320 px`);
    if (!r.ok) console.log('\nAnticoagulado:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'farmacos-paciente', titulo: 'Fármacos que toma (paso 3 de la farmacología, lumbar):', run: async ({ browser, page }) => {
    const r = await checkFarmacosPaciente(browser, page);
    console.log(`  ${r.ok ? '✓' : '✗'} tarjeta sin texto libre con los chips de las familias escritas de la guía, línea del anticoagulado, corticoides desde el lupus (solo lectura, fuera de fm), el hueso desde la osteoporosis con bifosfonato o denosumab (y se quita con ella), los avisos del hueso y de las fluoroquinolonas en la fase 6, sin línea de familias pendientes, medicación del formulario como pista que no marca nada, guía en «Este paciente» con un segundo toque a todas, fase 5, avisos de la fase 6 con la línea común una vez, 320 px y el hub`);
    if (!r.ok) console.log('\nFármacos que toma:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'osteoporosis', titulo: 'Osteoporosis o fragilidad ósea (Fase P, lumbar):', run: async ({ page }) => {
    const r = await checkOsteoporosis(page);
    console.log(`  ${r.ok ? '✓' : '✗'} tarjeta con sus filas y la derivación por corticoides, urgencia sin plegar, derivación, caídas, sospecha con factores (sin la palabra osteoporosis en el informe), nota 4b, fase 5, fase 6, panel de tiempos y 320 px`);
    if (!r.ok) console.log('\nOsteoporosis:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'embarazo', titulo: 'Embarazo o posparto (Fase P, lumbar):', run: async ({ page }) => {
    const r = await checkEmbarazo(page);
    console.log(`  ${r.ok ? '✓' : '✗'} tarjeta plegada con «Hombre», semanas, regla de la tensión, preguntas por semanas, urgencia, ánimo fuera del informe, suelo pélvico, supino en la 4b, Gaenslen en el posparto, fase 5, fase 6 y 320 px`);
    if (!r.ok) console.log('\nEmbarazo:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'ds-reloj', titulo: 'Reloj de la prueba de bipedestación (POTS, reloj simulado):', run: async ({ page }) => {
    const r = await checkDsReloj(page);
    console.log(`  ${r.ok ? '✓' : '✗'} reposo de 5 min, de pie con la fila que toca en las dos copias, un pitido por marca, «toma a las 3:40», terminada, Parar, fuera del payload, 320 px`);
    if (!r.ok) console.log('\nReloj:', JSON.stringify(r));
    return r.ok;
  } },

  { id: 'modo-guia', titulo: 'Modo guía: sin marcar = no preguntado (lumbar):', run: async ({ page }) => {
    const r = await checkModoGuia(page);
    console.log(`  ${r.ok ? '✓' : '✗'} selector, nombre automático, frase en voz alta con «Preguntado», teclado numérico (edad), cribado sin NO por defecto, frases ancla en la 4b y la fase 5 abre con lo no preguntado`);
    if (!r.ok) console.log('\nModo guía:', JSON.stringify(r));
    return r.ok;
  } },
  { id: 'derivacion', titulo: 'Derivación médica (árbol: lumbar VASCULAR; cribado: quiste de Tarlov):', run: async ({ page }) => {
    const r = await checkDerivacionVascular(page);
    console.log(`  ${r.ok ? '✓' : '✗'} árbol: aviso bajo el paso, al completar el árbol y en la fase 5`);
    if (!r.ok) console.log('\nDerivación del árbol:', JSON.stringify(r));
    const c = await checkDerivacionCribado(page);
    console.log(`  ${c.ok ? '✓' : '✗'} cribado (l_u5): «¿Por qué?» y «Ampliar» con fisiología, mensaje solo con SÍ, aviso sin el genérico, l6 sigue urgente, fase 5`);
    if (!c.ok) console.log('\nDerivación del cribado:', JSON.stringify(c));
    return r.ok && c.ok;
  } },

  { id: 'cascanueces', titulo: 'Cascanueces (l_u6) y MALS (lumbar, docs/mals-cascanueces.md):', run: async ({ page }) => {
    const r = await checkCascanueces(page);
    console.log(`  ${r.ok ? '✓' : '✗'} l_u6: «¿Por qué?» y «Ampliar» con fisiología, mensaje solo con SÍ, aviso «Derivación médica» sin urgencia; el MALS en el «Ampliar» de la bandera de l_gi${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'congestion-pelvica', titulo: 'Congestión pélvica (ca_u6, cadera, docs/congestion-pelvica.md):', run: async ({ page }) => {
    const r = await checkCongestionPelvica(page);
    console.log(`  ${r.ok ? '✓' : '✗'} ca_u6: «¿Por qué?» y «Ampliar» con fisiología, mensaje solo con SÍ, aviso «Derivación médica» sin urgencia; ca_u4 remite a ella${r.ok ? '' : ' ' + JSON.stringify(r)}`);
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
    console.log(`  ${r.ok ? '✓' : '✗'} ro2 traumática: «Para este caso» delante y las otras ramas plegadas; sin rama, la pauta entera; «🚑 Derivación» (co7) y la nota del protocolo del cirujano fuera de todo <details>; imprimir despliega y después deja cada <details> como estaba; «✨ IA» en la pauta (también la plegada y las otras situaciones) y el pronóstico, con su contexto y sin nada del paciente (ni pq1 ni la nota del protocolo)${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'ia-fases', titulo: '«✨ IA» en los textos clínicos de las fases 3 a 6:', run: async ({ browser, errors }) => {
    const r = await checkIAFases(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} resumen de irritabilidad, criterio de un test de la 4b, recuadro del lupus y plan de la fase 6 (reevaluación, escalón) abren la IA con su contexto y el enfoque práctico; la cabecera del recuadro, el signo comparable y la pauta posquirúrgica no salen, ni seleccionando el texto excluido${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'irritabilidad', titulo: 'Matriz de irritabilidad (fase 3, escritorio y 320 px):', run: async ({ browser, errors }) => {
    const page = await nuevaPagina(browser, errors);
    try {
      const r = await checkIrritabilidad(page);
      console.log(`  ${r.ok ? '✓' : '✗'} sin preselección («no registrada»); cuatro filas con el tiempo en calmarse (botones en una línea en escritorio) y el impacto en las actividades en la tarjeta de severidad; el tiempo en calmarse marca el suelo y los otros tres lo suben; segundo toque vacía; el impacto no cuenta; tabla y tarjetas sincronizadas; cabe a 320 px; baja → «hasta el límite», alta → se confirma en la 2.ª visita; fase 5; se restaura al recargar; pista en modo breve${r.ok ? '' : ' ' + JSON.stringify(r)}`);
      return r.ok;
    } finally { await page.context().close(); }
  } },
  { id: 'zonas-centrales', titulo: 'Síntomas: sacro, cóccix y periné en lumbar (fase 3):', run: async ({ browser, errors }) => {
    const page = await nuevaPagina(browser, errors);
    try {
      const r = await checkZonasCentrales(page);
      console.log(`  ${r.ok ? '✓' : '✗'} diez chips en orden que caben a 320 px; P1 central sin «el de la región» ni Central preseleccionado; recordatorio solo con el periné, sin tocar el cribado; «Ir a la pregunta» lleva a l6 en móvil (acordeón) y en escritorio (pestaña) sin contestarla; con l6 en SÍ desaparece; el sacro en el paso 4 del árbol, el cóccix y el periné no${r.ok ? '' : ' ' + JSON.stringify(r)}`);
      return r.ok;
    } finally { await page.context().close(); }
  } },
  { id: 'sintomas', titulo: 'Síntomas P1–P4 (fase 3, las 7 regiones):', run: async ({ browser, errors }) => {
    const page = await nuevaPagina(browser, errors);
    try {
      const r = await checkSintomas(page);
      console.log(`  ${r.ok ? '✓' : '✗'} zonas de P1; hasta P4 y no más; otra región sin irritabilidad ni relación; quitar un vacío sin preguntar y uno con datos con confirmación; cabe a 320 px en una línea; se restaura al recargar; «Hacer principal» intercambia NRS e irritabilidad, borra las relaciones y vacía la matriz (salvo el impacto en las actividades); pistas en el paso del árbol (lumbar, con las del formulario, sin la otra región, sin contestarlo; cervical, la mano en el paso 1; hombro, el cuello en el paso 1; codo, el anterior en el paso 1; cadera, el glúteo en el paso 1; rodilla, la rótula en el 1b; tobillo y pie, el lateral en el 2); fase 5 con P1–P3; cervical, hombro, codo, cadera, rodilla y tobillo y pie con sus zonas en orden, «Central» solo en cervical, sin los síntomas de la región anterior${r.ok ? '' : ' ' + JSON.stringify(r)}`);
      return r.ok;
    } finally { await page.context().close(); }
  } },

  { id: 'barra-fija', titulo: 'Barra de navegación fija durante la entrada de fase (móvil):', run: async ({ browser, errors }) => {
    const r = await checkBarraFijaAnimacion(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} al volver de la 6 a la 5, la barra «← Anterior / Compartir» sigue al pie de la pantalla en cada fotograma de la animación (sin transform en la fase), así que no tapa «Plan de tratamiento →» ni salta${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'filas', titulo: 'Filas de opciones en pantalla estrecha (320, 360 y 390 px):', run: async ({ browser, errors }) => {
    const r = await checkFilas(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} una fila solo si ningún texto parte; si no, dos por fila (la impar a todo el ancho) y, en los grupos de tres de las fases 1 y 3, una por fila; los cuestionarios nunca bajan de dos; también con la opción marcada y tras repintar; en escritorio sin cambios${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'huecos', titulo: 'Sin botones descolgados en pantalla estrecha (320 px, las 7 regiones, fases 1–6):', run: async ({ browser, errors }) => {
    const r = await checkSinHuecos(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} en ningún grupo de botones queda uno solo en la última fila con hueco al lado: la fila se llena o el último ocupa todo el ancho${r.ok ? '' : ' ' + JSON.stringify(r.fallos)}`);
    return r.ok;
  } },

  { id: 'letra', titulo: 'Tamaño de letra Normal / Grande:', run: async ({ browser, errors }) => {
    const r = await checkLetra(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} el botón «Aa» alterna Normal y Grande (raíz 16 → 18 px, aria-pressed), se recuerda al recargar sin saltar (se aplica antes de pintar) y vuelve a normal; con letra grande, la cabecera cabe a 320 y 360 px y en las fases 1–5 (lumbar) nada desborda en horizontal ni se corta el texto de un botón${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },
  { id: 'letra-filas', titulo: 'Letra grande: filas de opciones en pantalla estrecha:', run: async ({ browser, errors }) => {
    const r = await checkFilas(conLetraGrande(browser), errors);
    console.log(`  ${r.ok ? '✓' : '✗'} con letra grande, las mismas reglas que «filas»: una fila solo si ningún texto parte, si no dos por fila o una${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },
  { id: 'letra-huecos', titulo: 'Letra grande: sin botones descolgados (320 px, las 7 regiones, fases 1–6):', run: async ({ browser, errors }) => {
    const r = await checkSinHuecos(conLetraGrande(browser), errors);
    console.log(`  ${r.ok ? '✓' : '✗'} con letra grande, ningún grupo deja un botón solo con hueco al lado${r.ok ? '' : ' ' + JSON.stringify(r.fallos)}`);
    return r.ok;
  } },
  { id: 'letra-dialogos', titulo: 'Letra grande: diálogos de confirmación (320 px):', run: async ({ browser, errors }) => {
    const r = await checkDialogos(conLetraGrande(browser), errors);
    console.log(`  ${r.ok ? '✓' : '✗'} con letra grande, los botones de todos los diálogos caben en una línea y se cierran igual${r.ok ? '' : ' ' + JSON.stringify({ fallos: r.fallos, cierre: r.cierre })}`);
    return r.ok;
  } },

  { id: 'fase6', titulo: 'Fase 6: plan de tratamiento (opcional, lumbar):', run: async ({ browser, errors }) => {
    const r = await checkFase6(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} de la 5 a la 6 con «Plan de tratamiento →»; paso 6 en la barra; hipótesis por defecto; con varios síntomas dosifica el más irritable y avisa del independiente; el bloque «Educación» enlaza la guía «Efectos del ejercicio» (alta → hipoalgesia, baja → carga y adaptación del tejido), la abre ya en ese bloque y Escape la cierra, y con riesgo psicosocial alto enlaza también «Efectos centrales», con disautonomía «ortostática» y con hipermovilidad su bloque (nunca con el subtipo vascular diagnosticado ni con su sospecha cumplida); la misma irritabilidad que la fase 3 y, sin registrar, la alta con aviso y enlace a la matriz; gravedad e irritabilidad editables (con irritabilidad alta no hay C, A no se ofrece porque coincide con B, y B es muy suave aunque la gravedad sea mínima); minutos de los bloques editables con aviso si no suman 50; compartir sesión, mes y casa (sin fuentes; sin «qué hacer» o «cuándo parar» pide confirmación; bloqueado, sin programa para casa); sin NRS, enlace a la fase 3; vuelta a la 5; restaurada en la 6 tras recargar; urgencia → sin plan; sin región → elegirla en la fase 2; 320 px sin desbordar y hoja de fases con la 6${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'plan-ia', titulo: 'Fase 6: «✨ Detallar con IA» (worker y Turnstile simulados):', run: async ({ browser, errors }) => {
    const r = await checkPlanIA(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} caso de Andrés importado: la tarjeta dice qué se detallará (nivel B «Muy suave», plan A, lu3, con el dictado y su aviso); el prompt lleva la transcripción y nunca el informe, sin audio; el plan llega por SSE, las sugerencias se pintan aparte con su etiqueta, la revisión señala el grado III, las 3 series sin marcar y la técnica neural al abrir la primera sesión, más las comprobaciones; «Programa para casa (IA)» no se comparte sin revisarlo todo y sale sin marcas y con la red de cola de caballo; «Plan detallado (IA)» con las marcas; «⬇ Paquete de revisión» descarga el .zip del plan; cambiar la frecuencia lo marca desactualizado; fuera del payload y del .json; sigue tras recargar; en el hub, ni el módulo ni la tarjeta${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'fase6-cervical', titulo: 'Fase 6: plan de tratamiento en cervical (L3):', run: async ({ browser, errors }) => {
    const r = await checkFase6Cervical(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} cervical por la interfaz real hasta la 6: plan con sus tarjetas; con varios síntomas dosifica el más irritable (P2 · Brazo) y avisa del independiente; el programa para casa termina con la red de seguridad arterial y nunca con la de cola de caballo; con ce3, exploración neurológica, aviso de manipulación y red de la médula antes de la arterial; con ce12, aviso de la pauta aguda sin terapia manual y nota de 2 sesiones/semana; con ce13, el volumen de su pauta en vez del genérico y el aviso de mareo${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'fase6-hombro', titulo: 'Fase 6: plan de tratamiento en hombro (L3, primera periférica):', run: async ({ browser, errors }) => {
    const r = await checkFase6Hombro(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} hombro por la interfaz real hasta la 6 (h6 por el camino de la primera opción): h6 con la cantidad de columna, sin avisos radiculares, y el programa para casa termina con la red cardiaca y la arterial; con h1, avisos de capsulitis (fase precoz y por estadio), escalones, cantidad, progresión y reglas de Peripheral, y solo la red cardiaca; con h10, aviso de artrosis; con h4, aviso de inestabilidad; con h2 + h6, aviso de dos familias${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'fase6-codo', titulo: 'Fase 6: plan de tratamiento en codo (L3, segunda periférica):', run: async ({ browser, errors }) => {
    const r = await checkFase6Codo(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} codo por la interfaz real hasta la 6 (por el camino de la primera opción, co7, «Derivar», no elegible, y co3 por defecto con el plan B); con co1, escalones, cantidad, progresión y reglas de Peripheral, su aviso, y el programa para casa termina con la red de infección (ni cardiaca, ni arterial, ni neurológica); con varios síntomas dosifica el más irritable (P2 · Antebrazo) y avisa del independiente; con co3, aviso de rigidez y nota de frecuencia; con co8, exploración del nervio sin red neurológica; con co5, co6 y co15, sus avisos; con cirugía, el de prótesis${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'fase6-rodilla', titulo: 'Fase 6: plan de tratamiento en rodilla (L3, tercera periférica):', run: async ({ browser, errors }) => {
    const r = await checkFase6Rodilla(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} rodilla por la interfaz real hasta la 6 (por el camino de la primera opción, ro11, «Derivar», no elegible, y ro4 por defecto con el plan A); con ro1, escalones, cantidad, progresión y reglas de Peripheral, su aviso de artrosis (no el glenohumeral), y el programa para casa termina con la red de infección y la de TVP (ni la de codo, ni cardiaca, ni arterial, ni neurológica); con varios síntomas dosifica el más irritable (P2 · Pierna) y avisa del independiente; con ro2, la rama traumática de su pauta y su aviso; con ro3, ro5, ro12 y ro18, sus avisos; con ro8, ligamento y esguince, y con ro4 sin esguince; con ro15, su aviso y la nota de frecuencia; con ro19, exploración del nervio sin red neurológica y pauta a criterio del fisio; con cirugía, el de prótesis y el de rodilla${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'fase6-cadera', titulo: 'Fase 6: plan de tratamiento en cadera (L3, cuarta periférica):', run: async ({ browser, errors }) => {
    const r = await checkFase6Cadera(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} cadera por la interfaz real hasta la 6 (por el camino de la primera opción, ca10 por defecto, con la familia columna y el plan A); con ca1, escalones, cantidad, progresión y reglas de Peripheral, su aviso de artrosis (ni el glenohumeral ni el de rodilla), su nota de frecuencia, y el programa para casa termina con la red de fractura de estrés, la de infección y la de TVP (ni la de rodilla, ni la de codo, ni cardiaca, ni arterial, ni neurológica); con varios síntomas dosifica el más irritable (P2 · Muslo anterior) y avisa del independiente; con ca2, ca12 y ca15, sus avisos; con ca4, ca11 y ca16, sus avisos y su nota de frecuencia; con ca7 y ca14, exploración del nervio sin red neurológica y pauta a criterio del fisio; con cirugía, el de prótesis y el de cadera${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'fase6-tobillo', titulo: 'Fase 6: plan de tratamiento en tobillo y pie (L3, quinta periférica):', run: async ({ browser, errors }) => {
    const r = await checkFase6Tobillo(browser, errors);
    console.log(`  ${r.ok ? '✓' : '✗'} tobillo y pie por la interfaz real hasta la 6 (por el camino de la primera opción, tp37, «Derivar», no elegible, y tp1 por defecto con el plan A); con tp1, escalones, cantidad, progresión y reglas de Peripheral, su aviso de esguince, y el programa para casa termina con la red de fractura de estrés, la de infección y la de TVP (ni la rotura del Aquiles, ni la de cadera, ni la de rodilla, ni cardiaca, ni arterial, ni neurológica); con varios síntomas dosifica el más irritable (P2 · Talón o planta) y avisa del independiente; con tp8 y tp9, sus avisos y la rotura del Aquiles al final; con tp2, tp26 y tp33, sus avisos; con tp14, tp21 y tp36, sus avisos y su nota de frecuencia; con tp16 y tp34, exploración del nervio sin red neurológica y pauta a criterio del fisio; con cirugía, el de prótesis y el de tobillo y pie${r.ok ? '' : ' ' + JSON.stringify(r)}`);
    return r.ok;
  } },

  { id: 'exportar', titulo: 'Exportar / importar la valoración (panel de sesión):', run: async ({ browser, errors }) => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'physiq-smoke-'));
    const r = await checkExportarImportar(browser, errors, tmpDir);
    console.log(`  ${r.ok ? '✓' : '✗'} exportar descarga ${r.nombreArchivo}; panel → diálogo y vuelta sin parpadeo de velo; «Borrar» abre el diálogo común con el nombre escapado, cancelar (Escape, velo, botón) vuelve al panel, confirmar vacía también el campo del nombre; borrar + importar restaura la valoración en la fase 5; rechaza otro JSON; caben a 320 px; «¿Reiniciar o borrar?» plegado y, abierto, dentro de una pantalla baja; todas las fases a 320 px en bandas, sin desbordar${r.fasesMovil ? '' : ' ' + JSON.stringify(r.bandasMovil)}`);
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
  await abrirApp(page);
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
  const resumen = parcial ? ` (PARCIAL: ${elegidas.map(s => s.id).join(', ')}; la completa la ejecuta la CI del PR)` : '';
  console.log(`\n${pass ? '✓ SMOKE TEST PASSED' : '✗ SMOKE TEST FAILED'}${resumen} · ${((Date.now() - inicio) / 1000).toFixed(0)} s`);
  if (fallidas.length) console.log(`Secciones con fallos: ${fallidas.join(', ')}  (repetir con --solo ${fallidas.join(',')})`);
  process.exit(pass ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(1); });
