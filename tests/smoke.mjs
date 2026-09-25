#!/usr/bin/env node
// Browser smoke test — launches the real app in Playwright and checks the
// things a unit test can't: that every ES module file actually loads (no
// broken `import` across app.js/state.js/data.js/phase4.js/phase4b.js/
// lib/session.js), that there are no console/page errors, and that a full
// walk through all 6 phases works by clicking the real UI (the same onclick
// handlers a physiotherapist would trigger).
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
const MODULE_FILES = ['app.js', 'state.js', 'data.js', 'phase4.js', 'phase4b.js', 'lib/session.js'];
const KNOWN_NOISE = ['ERR_CERT_AUTHORITY_INVALID']; // sandboxed egress proxy noise, not app errors

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

  console.log('\nWalking through phases 1-5 via real UI clicks...');
  await page.fill('#motivoConsulta', 'Dolor de hombro tras caída');
  await page.click('#mecanismo .option-btn >> nth=0');
  await page.click('#cronologia .option-btn >> nth=0');
  await page.click('#phase1 .btn-primary');
  await page.waitForTimeout(150);

  await page.click('.region-card:has-text("hombro"), [onclick*="hombro"]');
  await page.waitForTimeout(150);
  await page.click('#btnContinuarSinss');
  await page.waitForTimeout(150);

  await page.click('#phase3 .nrs-btn >> nth=6');
  await page.evaluate(() => {
    ['naturaleza', 'estadio', 'estabilidad'].forEach(g => document.getElementById(g)?.querySelector('.option-btn')?.click());
  });
  await page.fill('#signoComparable', 'Flexión de hombro con dolor');
  await page.click('#phase3 .btn-primary:has-text("Algoritmo CIF")');
  await page.waitForTimeout(150);

  // Click the *last* rendered step each time — earlier steps stay in the DOM
  // (answered options remain clickable, to allow changing an answer), so
  // querying `#cifTree .option-btn` globally always matches the FIRST step
  // ever rendered, not the pending one. That used to make this loop toggle
  // h_step1's first option on/off without ever reaching h_step2+, silently
  // leaving the tree unanswered (caught by instrumenting this file: ended
  // with `state.treeAnswers === {}`) — a real bug this fix closes, not just
  // a stylistic cleanup. `.locator(...).last()` re-queries fresh each turn.
  for (let i = 0; i < 8; i++) {
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

  const treeResult = await page.evaluate(() => ({
    answeredSteps: Object.keys(state.treeAnswers).length,
    activeHypotheses: state.activeHypotheses.length,
    treeCompleteShown: !!document.getElementById('treeComplete'),
  }));
  console.log(`\nCIF tree walk: ${treeResult.answeredSteps} steps answered, ${treeResult.activeHypotheses} hypotheses, complete banner shown: ${treeResult.treeCompleteShown}`);

  // No forced state here on purpose: if the walk above didn't really reach
  // tree completion, `#btnGoConfirm` stays disabled and Playwright's
  // actionability check fails the click below loudly, instead of a hidden
  // hack papering over a broken CIF tree walk.
  await page.click('#btnGoConfirm');
  await page.waitForTimeout(150);

  await page.click('#phase4b button:has-text("Ver Resultados")');
  await page.waitForTimeout(150);

  // Exercise the mobile phase-sheet button (the last real bug found, PHASE_NAV_IDS).
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click('.mobile-phase-menu-btn').catch(() => {});
  await page.waitForTimeout(150);
  const sheetOpen = await page.evaluate(() => document.getElementById('phaseSheet')?.classList.contains('open'));

  const finalPhase = await page.evaluate(() => state.currentPhase);
  console.log(`\nReached phase: ${finalPhase} (expected 5)`);
  console.log(`Phase sheet opens from "☰ Fases": ${sheetOpen}`);

  await browser.close();

  const realErrors = errors.filter(e => !KNOWN_NOISE.some(n => e.includes(n)));
  console.log(`\n${realErrors.length ? '✗' : '✓'} Console/page errors: ${realErrors.length}`);
  realErrors.forEach(e => console.log('  -', e));

  const pass = modulesOk && treeResult.treeCompleteShown && finalPhase === 5 && sheetOpen === true && realErrors.length === 0;
  console.log(pass ? '\n✓ SMOKE TEST PASSED' : '\n✗ SMOKE TEST FAILED');
  process.exit(pass ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(1); });
