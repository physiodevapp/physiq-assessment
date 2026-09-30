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
const MODULE_FILES = ['app.js', 'state.js', 'data.js', 'phase4.js', 'phase4b.js', 'lib/session.js',
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

  // Exercise the mobile phase-sheet button (the last real bug found,
  // PHASE_NAV_IDS) once, on whichever region the loop above ended on.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click('.mobile-phase-menu-btn').catch(() => {});
  await page.waitForTimeout(150);
  const sheetOpen = await page.evaluate(() => document.getElementById('phaseSheet')?.classList.contains('open'));
  console.log(`\nPhase sheet opens from "☰ Fases": ${sheetOpen}`);

  await browser.close();

  const realErrors = errors.filter(e => !KNOWN_NOISE.some(n => e.includes(n)));
  console.log(`\n${realErrors.length ? '✗' : '✓'} Console/page errors: ${realErrors.length}`);
  realErrors.forEach(e => console.log('  -', e));

  const regionsOk = results.every(r => r.treeResult.treeCompleteShown && r.finalPhase === 5);
  const breveOk = breveResults.every(r => r.ok);
  const pass = modulesOk && regionsOk && breveOk && sheetOpen === true && realErrors.length === 0;
  console.log(pass ? '\n✓ SMOKE TEST PASSED' : '\n✗ SMOKE TEST FAILED');
  if (!regionsOk) {
    console.log('\nRegions that did not complete / reach phase 5:');
    results.filter(r => !(r.treeResult.treeCompleteShown && r.finalPhase === 5))
      .forEach(r => console.log('  -', JSON.stringify(r)));
  }
  if (!breveOk) {
    console.log('\nModo breve failures:');
    breveResults.filter(r => !r.ok).forEach(r => console.log('  -', JSON.stringify(r)));
  }
  process.exit(pass ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(1); });
