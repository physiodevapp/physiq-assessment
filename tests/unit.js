'use strict';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import './dom-shim.mjs';

// Real ES modules, loaded only after the shims above are in place — app.js,
// phase4.js and phase4b.js touch `document`/`window` at module top level
// (e.g. app.js's _initHubIntegration() call).
const { HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES } = await import('../data.js');
const { calcLRScore, parseLR } = await import('../phase4b.js');
const { buildPhysiQPayload, getSistemicoAffirmativeTexts } = await import('../app.js');
const { state } = await import('../state.js');
const { rebuildHypotheses, pruneTreeFrom, resolveOptionTargets } = await import('../phase4.js');

// ── Test runner ───────────────────────────────────────────────────────────────
let passed = 0, failed = 0;
function test(name, fn) {
  try   { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.error(`  ✗ ${name}\n    ${e.message}`); failed++; }
}

// ── calcLRScore ───────────────────────────────────────────────────────────────
console.log('\ncalcLRScore');

test('all nd → Sin evaluar, totalLR=1', () => {
  const hyp = { tests: [{ lr_pos: '3.7', lr_neg: '0.36' }, { lr_pos: '1.5', lr_neg: '0.5' }] };
  const res = { 0: 'nd', 1: 'nd' };
  const r = calcLRScore(hyp, res);
  assert.equal(r.label,      'Sin evaluar');
  assert.equal(r.colorClass, 'hyp-orange');
  assert.equal(r.totalLR,    1.0);
  assert.equal(r.evaluatedCount, 0);
});

test('one positive LR 3.7 → Peso moderado, hyp-orange', () => {
  const hyp = { tests: [{ lr_pos: '3.7', lr_neg: '0.36' }] };
  const res = { 0: 'pos' };
  const r = calcLRScore(hyp, res);
  assert.equal(r.colorClass, 'hyp-orange');
  assert.ok(r.label.includes('Peso moderado'), `got: ${r.label}`);
  assert.ok(Math.abs(r.totalLR - 3.7) < 0.001);
});

test('one positive LR >= 5 → Peso alto, hyp-green', () => {
  const hyp = { tests: [{ lr_pos: '6.0', lr_neg: '0.2' }] };
  const res = { 0: 'pos' };
  const r = calcLRScore(hyp, res);
  assert.equal(r.colorClass, 'hyp-green');
  assert.ok(r.label.includes('Peso alto'), `got: ${r.label}`);
});

test('one negative LR_neg 0.2 → Peso bajo, hyp-red', () => {
  const hyp = { tests: [{ lr_pos: '3.7', lr_neg: '0.2' }] };
  const res = { 0: 'neg' };
  const r = calcLRScore(hyp, res);
  assert.equal(r.colorClass, 'hyp-red');
  assert.ok(r.label.includes('Peso bajo'), `got: ${r.label}`);
  assert.ok(Math.abs(r.totalLR - 0.2) < 0.001);
});

test('no LR and no Sn/Sp → Sin LR aplicable, neutral, LR stays 1', () => {
  const hyp = { tests: [{ lr_pos: null, lr_neg: null }] };
  const r = calcLRScore(hyp, { 0: 'pos' });
  assert.equal(r.totalLR, 1);
  assert.equal(r.colorClass, 'hyp-neutral');
  assert.ok(r.label.includes('Sin LR aplicable') && r.label.includes('1/1'), `got: ${r.label}`);
});

test('no LR, negative → hallazgo 0/1, no multiplier', () => {
  const hyp = { tests: [{ lr_pos: null, lr_neg: null }] };
  const r = calcLRScore(hyp, { 0: 'neg' });
  assert.equal(r.totalLR, 1);
  assert.ok(r.label.includes('0/1'), `got: ${r.label}`);
});

test('hasHighLR: pos LR=5 × neg LR=0.1 = 0.5 but still hyp-green', () => {
  const hyp = { tests: [{ lr_pos: '5.0', lr_neg: null }, { lr_pos: null, lr_neg: '0.1' }] };
  const res = { 0: 'pos', 1: 'neg' };
  const r = calcLRScore(hyp, res);
  assert.ok(Math.abs(r.totalLR - 0.5) < 0.001);
  assert.equal(r.colorClass, 'hyp-green');
});

test('LR chain 3.7 × 2.6 → product correct and hyp-green', () => {
  const hyp = { tests: [{ lr_pos: '3.7' }, { lr_pos: '2.6' }] };
  const res = { 0: 'pos', 1: 'pos' };
  const r = calcLRScore(hyp, res);
  assert.ok(Math.abs(r.totalLR - 3.7 * 2.6) < 0.001);
  assert.equal(r.colorClass, 'hyp-green');
});

test('LR computed from numeric Sn/Sp when no published LR', () => {
  const hyp = { tests: [{ sn: '84%', sp: '83%' }] };   // LR+ ≈ 4.94, LR− ≈ 0.19
  assert.ok(Math.abs(calcLRScore(hyp, { 0: 'pos' }).totalLR - 0.84 / 0.17) < 0.001);
  assert.ok(Math.abs(calcLRScore(hyp, { 0: 'neg' }).totalLR - 0.16 / 0.83) < 0.001);
});

test('Sn/Sp ranges are not computed', () => {
  const r = calcLRScore({ tests: [{ sn: '52–70%', sp: '55–83%' }] }, { 0: 'pos' });
  assert.equal(r.totalLR, 1);
  assert.equal(r.colorClass, 'hyp-neutral');
});

test('each direction judged separately: SLR (Sn .91 Sp .26) — pos is a finding, neg multiplies', () => {
  const hyp = { tests: [{ sn: '91%', sp: '26%' }] };   // LR+ 1.23 (no), LR− 0.35 (sí)
  const rPos = calcLRScore(hyp, { 0: 'pos' });
  assert.equal(rPos.totalLR, 1);
  assert.equal(rPos.colorClass, 'hyp-neutral');
  const rNeg = calcLRScore(hyp, { 0: 'neg' });
  assert.ok(Math.abs(rNeg.totalLR - 0.09 / 0.26) < 0.001);
  assert.equal(rNeg.colorClass, 'hyp-red');
});

test('published LR below 2 does not multiply', () => {
  const r = calcLRScore({ tests: [{ lr_pos: '1.5', lr_neg: '0.8' }] }, { 0: 'pos' });
  assert.equal(r.totalLR, 1);
});

test('LR range → conservative bound (lower for LR+, upper for LR−)', () => {
  const hyp = { tests: [{ lr_pos: '2.9–4.9', lr_neg: '0.43–0.49' }] };
  assert.ok(Math.abs(calcLRScore(hyp, { 0: 'pos' }).totalLR - 2.9) < 0.001);
  assert.ok(Math.abs(calcLRScore(hyp, { 0: 'neg' }).totalLR - 0.49) < 0.001);
  assert.equal(parseLR('3–50 (alta variabilidad)', 'pos'), 3);
  assert.equal(parseLR('97% VPP', 'neg'), null);
});

test('pronostico tests never score', () => {
  const r = calcLRScore({ tests: [{ lr_pos: '24.4', tipo: 'pronostico' }] }, { 0: 'pos' });
  assert.equal(r.totalLR, 1);
  assert.equal(r.evaluatedCount, 1);
  assert.equal(r.colorClass, 'hyp-neutral');
});

const CLUSTER_HYP = {
  clusters: { c: { nombre: 'C', umbralPos: 2, umbralNeg: 1, lr_pos: '4.0', lr_neg: '0.15' } },
  tests: [0, 1, 2, 3].map(() => ({ cluster: 'c', lr_pos: '9' })),
};

test('cluster: members never multiply alone; ≥ umbralPos → cluster LR+', () => {
  assert.equal(calcLRScore(CLUSTER_HYP, { 0: 'pos', 1: 'nd', 2: 'nd', 3: 'nd' }).totalLR, 1);
  assert.equal(calcLRScore(CLUSTER_HYP, { 0: 'pos', 1: 'pos', 2: 'nd', 3: 'nd' }).totalLR, 4);
});

test('cluster: LR− only when every member was done and positives ≤ umbralNeg', () => {
  assert.equal(calcLRScore(CLUSTER_HYP, { 0: 'pos', 1: 'neg', 2: 'neg', 3: 'nd' }).totalLR, 1);
  assert.ok(Math.abs(calcLRScore(CLUSTER_HYP, { 0: 'pos', 1: 'neg', 2: 'neg', 3: 'neg' }).totalLR - 0.15) < 0.001);
});

test('absorbe: composite test cancels its component LR', () => {
  const hyp = { tests: [{ lr_neg: '0.35' }, { lr_neg: '0.33', absorbe: [0] }] };
  assert.ok(Math.abs(calcLRScore(hyp, { 0: 'neg', 1: 'neg' }).totalLR - 0.33) < 0.001);
  assert.ok(Math.abs(calcLRScore(hyp, { 0: 'neg', 1: 'nd' }).totalLR - 0.35) < 0.001);
});

test('every HYPOTHESES test: LR fields are parseable or null (no text disguised as LR)', () => {
  for (const h of Object.values(HYPOTHESES)) h.tests.forEach(t => {
    if (t.lr_pos != null) assert.ok(parseLR(t.lr_pos, 'pos') != null, `${h.id}/${t.name} lr_pos=${t.lr_pos}`);
    if (t.lr_neg != null) assert.ok(parseLR(t.lr_neg, 'neg') != null, `${h.id}/${t.name} lr_neg=${t.lr_neg}`);
  });
});

test('every cluster reference points to an existing cluster rule', () => {
  for (const h of Object.values(HYPOTHESES)) h.tests.forEach(t => {
    if (t.cluster) assert.ok(h.clusters?.[t.cluster], `${h.id}/${t.name} → ${t.cluster}`);
  });
});

// ── buildPhysiQPayload ────────────────────────────────────────────────────────
console.log('\nbuildPhysiQPayload');

const BASE_STATE = {
  patient:          'Juan García',
  region:           'hombro',
  motivoConsulta:   'Dolor hombro derecho',
  mecanismo:        'Insidioso',
  cronologia:       'Crónico (>3 meses)',
  riesgoPsico:      'Bajo',
  severidad:        7,
  irritabilidadNivel: 'Moderada',
  naturaleza:       'Mecánica',
  sistemicoAlerta:  false,
  banderasRojas:    { br1: 'NO', br2: 'NO', br3: 'NO', br4: 'NO' },
  sistemicoAnswers: {},
  activeHypotheses: ['h2'],
  hypothesisScores: { h2: { totalLR: 3.7, label: '🟠 Peso moderado (LR× 3.7)', colorClass: 'hyp-orange' } },
  testResults:      { h2: { 0: 'pos', 1: 'neg' } },
  planNotes:        { variableControl: '', ventanaRecuperacion: '', anclajeHabito: '' },
};

function withState(patch, fn) {
  Object.assign(state, { ...BASE_STATE, ...patch });
  fn();
}

const REQUIRED_FIELDS = ['p', 'r', 'd', 'mo', 'me', 'cr', 'rp', 'nr', 'ir', 'na', 'si', 'br', 'sq', 'h', 'pn'];

test('all required fields present', () => {
  withState({}, () => {
    const p = buildPhysiQPayload();
    for (const key of REQUIRED_FIELDS) {
      assert.ok(key in p, `missing field: ${key}`);
    }
  });
});

test('patient null → p = ""', () => {
  withState({ patient: null }, () => {
    assert.equal(buildPhysiQPayload().p, '');
  });
});

test('severidad null → nr = 0', () => {
  withState({ severidad: null }, () => {
    assert.equal(buildPhysiQPayload().nr, 0);
  });
});

test('banderasRojas all NO → br = []', () => {
  withState({ banderasRojas: { br1: 'NO', br2: 'NO', br3: 'NO', br4: 'NO' } }, () => {
    const br = buildPhysiQPayload().br;
    assert.equal(br.length, 0);
  });
});

test('banderasRojas br1+br3 SI → correct labels in br', () => {
  withState({ banderasRojas: { br1: 'SI', br2: 'NO', br3: 'SI', br4: 'NO' } }, () => {
    const br = buildPhysiQPayload().br;
    assert.equal(br.length, 2);
    assert.ok(br.includes('Sudor nocturno / Pérdida de peso inexplicada'));
    assert.ok(br.includes('Déficit neurológico progresivo'));
  });
});

test('hypothesis mapped with id, name, sc, lr, tr', () => {
  withState({}, () => {
    const h = buildPhysiQPayload().h;
    assert.equal(h.length, 1);
    const [hyp] = h;
    assert.equal(hyp.id,          'h2');
    assert.equal(typeof hyp.name, 'string');
    assert.ok(hyp.name.length > 0);
    assert.equal(typeof hyp.sc,   'string');
    assert.equal(typeof hyp.lr,   'number');
    assert.ok(typeof hyp.tr === 'object' && hyp.tr !== null);
  });
});

test('hypothesis with no score → sc="Sin evaluar", lr=null', () => {
  withState({ hypothesisScores: {}, testResults: { h2: {} } }, () => {
    const [hyp] = buildPhysiQPayload().h;
    assert.equal(hyp.sc, 'Sin evaluar');
    assert.equal(hyp.lr, null);
  });
});

test('payload is JSON-serializable (no undefined)', () => {
  withState({}, () => {
    const p = buildPhysiQPayload();
    assert.doesNotThrow(() => JSON.stringify(p));
    assert.ok(!JSON.stringify(p).includes('"undefined"'));
  });
});

test('base64 payload size < 4096 chars', () => {
  withState({}, () => {
    const size = btoa(unescape(encodeURIComponent(JSON.stringify(buildPhysiQPayload())))).length;
    assert.ok(size < 4096, `payload too large: ${size} chars`);
  });
});

// ── getSistemicoAffirmativeTexts ──────────────────────────────────────────────
console.log('\ngetSistemicoAffirmativeTexts');

test('empty answers → []', () => {
  withState({ sistemicoAnswers: {}, region: 'hombro' }, () => {
    assert.equal(getSistemicoAffirmativeTexts().length, 0);
  });
});

test('region not set → []', () => {
  withState({ sistemicoAnswers: { 'hombro_cancer_q1': 'SI' }, region: '' }, () => {
    assert.equal(getSistemicoAffirmativeTexts().length, 0);
  });
});

test('affirmative answer for known region returns non-empty array', () => {
  // Find a real question id from the hombro screening data
  const sis = SYSTEMIC_SCREENING['hombro'];
  const firstQid = sis?.sistemas?.[0]?.preguntas?.[0]?.id || null;
  if (firstQid) {
    withState({ sistemicoAnswers: { [firstQid]: 'SI' }, region: 'hombro' }, () => {
      const texts = getSistemicoAffirmativeTexts();
      assert.ok(Array.isArray(texts));
      assert.ok(texts.length > 0, 'expected at least one text for SI answer');
    });
  }
});

// ── data.js integrity: HYPOTHESES ────────────────────────────────────────────
console.log('\nHYPOTHESES data integrity');

const VALID_REGIONS = ['hombro', 'cadera', 'cervical', 'lumbar', 'rodilla', 'codo'];

test('all 55 hypotheses present', () => {
  assert.equal(Object.keys(HYPOTHESES).length, 55);
});

test('every hypothesis has id, region, name, tests', () => {
  const missing = Object.entries(HYPOTHESES)
    .filter(([, h]) => !h.id || !h.region || !h.name || !Array.isArray(h.tests))
    .map(([k]) => k);
  assert.deepEqual(missing, []);
});

test('every hypothesis id matches its key', () => {
  const mismatched = Object.entries(HYPOTHESES)
    .filter(([k, h]) => h.id !== k)
    .map(([k, h]) => k + ' → id:' + h.id);
  assert.deepEqual(mismatched, []);
});

test('every hypothesis has a valid region', () => {
  const invalid = Object.entries(HYPOTHESES)
    .filter(([, h]) => !VALID_REGIONS.includes(h.region))
    .map(([k, h]) => k + ':' + h.region);
  assert.deepEqual(invalid, []);
});

test('no hypothesis has empty tests array', () => {
  const empty = Object.entries(HYPOTHESES)
    .filter(([, h]) => !h.tests || h.tests.length === 0)
    .map(([k]) => k);
  assert.deepEqual(empty, []);
});

test('all tests have a name', () => {
  const missing = Object.entries(HYPOTHESES).flatMap(([id, h]) =>
    h.tests
      .map((t, i) => ({ id, i, name: t.name }))
      .filter(({ name }) => !name)
      .map(({ id, i }) => id + '[' + i + ']')
  );
  assert.deepEqual(missing, []);
});

test('all lr_pos values are null or numeric string', () => {
  const invalid = Object.entries(HYPOTHESES).flatMap(([id, h]) =>
    h.tests
      .map((t, i) => ({ id, i, v: t.lr_pos }))
      .filter(({ v }) => v !== null && v !== undefined && isNaN(parseFloat(v)))
      .map(({ id, i, v }) => id + '[' + i + '].lr_pos=' + v)
  );
  assert.deepEqual(invalid, [], 'non-numeric lr_pos values found');
});

test('all lr_neg values are null or numeric string', () => {
  const invalid = Object.entries(HYPOTHESES).flatMap(([id, h]) =>
    h.tests
      .map((t, i) => ({ id, i, v: t.lr_neg }))
      .filter(({ v }) => v !== null && v !== undefined && isNaN(parseFloat(v)))
      .map(({ id, i, v }) => id + '[' + i + '].lr_neg=' + v)
  );
  assert.deepEqual(invalid, [], 'non-numeric lr_neg values found');
});

test('calcLRScore does not return NaN for any hypothesis with all-pos results', () => {
  const nanHyps = Object.entries(HYPOTHESES)
    .filter(([, h]) => {
      const fakeResults = Object.fromEntries(h.tests.map((_, i) => [i, 'pos']));
      const { totalLR } = calcLRScore(h, fakeResults);
      return isNaN(totalLR) || totalLR <= 0;
    })
    .map(([k]) => k);
  assert.deepEqual(nanHyps, []);
});

// ── data.js integrity: CIF_TREES ─────────────────────────────────────────────
console.log('\nCIF_TREES data integrity');

test('all 6 regions present', () => {
  for (const r of VALID_REGIONS) {
    assert.ok(typeof CIF_TREES[r] === 'object', `missing region: ${r}`);
  }
});

test('every tree has a title and a non-empty steps array', () => {
  const bad = VALID_REGIONS.filter(r => {
    const t = CIF_TREES[r];
    return !t || !t.title || !Array.isArray(t.steps) || t.steps.length === 0;
  });
  assert.deepEqual(bad, []);
});

test('no duplicate step ids within a tree', () => {
  const dupes = VALID_REGIONS.flatMap(r => {
    const seen = new Set(), out = [];
    CIF_TREES[r].steps.forEach(s => { if (seen.has(s.id)) out.push(r + ':' + s.id); seen.add(s.id); });
    return out;
  });
  assert.deepEqual(dupes, []);
});

test('every step has tag, question and a non-empty options array', () => {
  const bad = VALID_REGIONS.flatMap(r =>
    CIF_TREES[r].steps
      .filter(s => !s.tag || !s.question || !Array.isArray(s.options) || s.options.length === 0)
      .map(s => r + ':' + s.id)
  );
  assert.deepEqual(bad, []);
});

test('every option has label, value and a hypothesis array', () => {
  const bad = VALID_REGIONS.flatMap(r =>
    CIF_TREES[r].steps.flatMap(s =>
      s.options
        .map((o, i) => ({ o, i }))
        .filter(({ o }) => !o.label || !o.value || !Array.isArray(o.hypothesis))
        .map(({ i }) => r + ':' + s.id + '[' + i + ']')
    )
  );
  assert.deepEqual(bad, []);
});

test('every option.next references a step id within the same tree', () => {
  const dangling = VALID_REGIONS.flatMap(r => {
    const ids = new Set(CIF_TREES[r].steps.map(s => s.id));
    return CIF_TREES[r].steps.flatMap(s =>
      s.options
        .filter(o => o.next && !ids.has(o.next))
        .map(o => r + ':' + s.id + ' -> next:' + o.next)
    );
  });
  assert.deepEqual(dangling, [], 'option.next points to a non-existent step id');
});

test('every option.hypothesis id exists in HYPOTHESES', () => {
  const dangling = VALID_REGIONS.flatMap(r =>
    CIF_TREES[r].steps.flatMap(s =>
      s.options.flatMap(o =>
        o.hypothesis
          .filter(hId => !HYPOTHESES[hId])
          .map(hId => r + ':' + s.id + ' -> hypothesis:' + hId)
      )
    )
  );
  assert.deepEqual(dangling, [], 'option.hypothesis references a non-existent HYPOTHESES id');
});

test('every option.hypothesis id belongs to the same region as its tree', () => {
  const mismatched = VALID_REGIONS.flatMap(r =>
    CIF_TREES[r].steps.flatMap(s =>
      s.options.flatMap(o =>
        o.hypothesis
          .filter(hId => HYPOTHESES[hId] && HYPOTHESES[hId].region !== r)
          .map(hId => r + ':' + s.id + ' -> ' + hId + ' is region ' + HYPOTHESES[hId].region)
      )
    )
  );
  assert.deepEqual(mismatched, []);
});

// ── CIF tree navigation regression ────────────────────────────────────────────
// Inserting or reordering a step inside a region's `steps` array can silently
// change which step an UNRELATED option falls through to — an option without
// an explicit `next` resolves to "the next step in the array" (see the schema
// comment above CIF_TREES in data.js). That's not a schema violation (nothing
// above catches it), just a quiet change in clinical behavior for a branch
// nobody meant to touch. This test locks in the current resolved navigation
// graph for all 6 real regions, so a reorganization that changes it shows up
// as a named diff instead of a silent regression — see tests/gen-cif-snapshot.mjs
// for how to review and update the snapshot once a change is confirmed intentional.
console.log('\nCIF tree navigation regression (real data vs. checked-in snapshot)');

test('resolved next-step for every option matches tests/fixtures/cif-tree-navigation.json', () => {
  const expected = JSON.parse(readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'cif-tree-navigation.json'),
    'utf8'
  ));
  const live = {};
  for (const region of Object.keys(CIF_TREES).sort()) {
    const tree = CIF_TREES[region];
    const steps = {};
    tree.steps.forEach((step, stepIdx) => {
      steps[step.id] = step.options.map((opt, optIdx) => {
        const [target] = resolveOptionTargets(tree, stepIdx, opt);
        return target ? target.id : null;
      });
    });
    live[region] = steps;
  }
  assert.deepEqual(live, expected,
    'CIF tree navigation changed — if intentional, run `node tests/gen-cif-snapshot.mjs` after reviewing the diff');
});

// ── phase4.js engine: rebuildHypotheses / pruneTreeFrom / resolveOptionTargets ─
// Fixture tree — deliberately NOT real clinical content. These three functions
// take the tree/step as a parameter rather than importing CIF_TREES
// themselves, so the tree-walking engine can be regression-tested here
// independently of whatever data.js currently contains (Fase C of
// MIGRATION_PLAN.md).
console.log('\nphase4.js engine (fixture tree, decoupled from data.js)');

const FIXTURE_TREE = {
  title: 'Fixture — motor de árbol CIF',
  steps: [
    {
      id: 'fx_step1', tag: 'Paso 1', question: '¿Q1?',
      options: [
        { label: 'A', value: 'a', next: null,        hypothesis: ['fxA'] },
        { label: 'B', value: 'b', next: 'fx_step3',   hypothesis: ['fxB'] }
      ]
    },
    {
      id: 'fx_step2', tag: 'Paso 2', question: '¿Q2?',
      options: [
        { label: 'C', value: 'c', next: null, hypothesis: ['fxC'] }
      ]
    },
    {
      id: 'fx_step3', tag: 'Paso 3', question: '¿Q3?',
      options: [
        { label: 'D', value: 'd', next: null, hypothesis: ['fxA', 'fxD'] }
      ]
    }
  ]
};

test('resolveOptionTargets: no explicit next -> falls through to the next step in the array', () => {
  const targets = resolveOptionTargets(FIXTURE_TREE, 0, FIXTURE_TREE.steps[0].options[0]);
  assert.deepEqual(targets.map(s => s.id), ['fx_step2']);
});

test('resolveOptionTargets: explicit next -> jumps there instead of falling through', () => {
  const targets = resolveOptionTargets(FIXTURE_TREE, 0, FIXTURE_TREE.steps[0].options[1]);
  assert.deepEqual(targets.map(s => s.id), ['fx_step3']);
});

test('resolveOptionTargets: no next on the last step -> terminal, no targets', () => {
  const targets = resolveOptionTargets(FIXTURE_TREE, 2, FIXTURE_TREE.steps[2].options[0]);
  assert.deepEqual(targets, []);
});

test('resolveOptionTargets: explicit next equal to the sequential step is not duplicated', () => {
  const opt = { label: 'X', value: 'x', next: 'fx_step2', hypothesis: [] };
  const targets = resolveOptionTargets(FIXTURE_TREE, 0, opt);
  assert.deepEqual(targets.map(s => s.id), ['fx_step2']);
});

test('rebuildHypotheses: accumulates hypotheses from answered steps, in step order', () => {
  state.treeAnswers = { fx_step1: 'b', fx_step3: 'd' };
  rebuildHypotheses(FIXTURE_TREE);
  assert.deepEqual(state.activeHypotheses, ['fxB', 'fxA', 'fxD']);
});

test('rebuildHypotheses: dedupes a hypothesis reached via two different steps', () => {
  state.treeAnswers = { fx_step1: 'a', fx_step3: 'd' };
  rebuildHypotheses(FIXTURE_TREE);
  assert.deepEqual(state.activeHypotheses, ['fxA', 'fxD']);
});

test('rebuildHypotheses: unanswered steps and stale answers referencing a removed option are ignored', () => {
  state.treeAnswers = { fx_step1: 'nonexistent-value' };
  rebuildHypotheses(FIXTURE_TREE);
  assert.deepEqual(state.activeHypotheses, []);
});

test('pruneTreeFrom: deletes answers at and after fromIdx, keeps earlier ones', () => {
  state.treeAnswers = { fx_step1: 'a', fx_step2: 'c', fx_step3: 'd' };
  state.maxVisitedIdx = 0; state.treeModified = false;
  pruneTreeFrom(1, FIXTURE_TREE);
  assert.deepEqual(state.treeAnswers, { fx_step1: 'a' });
});

test('pruneTreeFrom: marks treeModified when phase 4b/5 were already visited', () => {
  state.treeAnswers = { fx_step1: 'a', fx_step2: 'c' };
  state.maxVisitedIdx = 4; state.treeModified = false;
  pruneTreeFrom(1, FIXTURE_TREE);
  assert.equal(state.treeModified, true);
});

test('pruneTreeFrom: leaves treeModified untouched when 4b/5 were never visited', () => {
  state.treeAnswers = { fx_step1: 'a', fx_step2: 'c' };
  state.maxVisitedIdx = 2; state.treeModified = false;
  pruneTreeFrom(1, FIXTURE_TREE);
  assert.equal(state.treeModified, false);
});

// ── data.js integrity: SYSTEMIC_SCREENING ─────────────────────────────────────
console.log('\nSYSTEMIC_SCREENING data integrity');

test('all 6 regions present', () => {
  for (const r of VALID_REGIONS) {
    assert.ok(typeof SYSTEMIC_SCREENING[r] === 'object', `missing region: ${r}`);
  }
});

test('every region has at least one sistema with at least one pregunta', () => {
  const empty = VALID_REGIONS.filter(r => {
    const data = SYSTEMIC_SCREENING[r];
    if (!data || !Array.isArray(data.sistemas)) return true;
    return !data.sistemas.some(s => s.preguntas && s.preguntas.length > 0);
  });
  assert.deepEqual(empty, []);
});

test('all preguntas have id and text', () => {
  const missing = VALID_REGIONS.flatMap(r => {
    const data = SYSTEMIC_SCREENING[r];
    if (!data) return [];
    return data.sistemas.flatMap((s, si) =>
      (s.preguntas || [])
        .filter(q => !q.id || !q.text)
        .map((q, qi) => r + '[' + si + '][' + qi + ']')
    );
  });
  assert.deepEqual(missing, []);
});

test('no duplicate pregunta IDs within a region', () => {
  const dupes = VALID_REGIONS.flatMap(r => {
    const data = SYSTEMIC_SCREENING[r];
    if (!data) return [];
    const ids = data.sistemas.flatMap(s => (s.preguntas || []).map(q => q.id));
    const seen = new Set(), dupes = [];
    ids.forEach(id => { if (seen.has(id)) dupes.push(r + ':' + id); seen.add(id); });
    return dupes;
  });
  assert.deepEqual(dupes, []);
});

// ── Formulario previo: esquemas (formularios/*.js) y lectura (formulario.js) ──
console.log('\nformulario previo');

const { default: FP_COMUN } = await import('../formularios/comun.js');
const fpMod = await import('../formulario.js');
const FP_REGIONES = {};
for (const r of fpMod.REGIONES_CON_FORMULARIO) FP_REGIONES[r] = (await import(`../formularios/${r}.js`)).default;
const FP_TIPOS = ['unica', 'multi', 'escala', 'matriz', 'texto'];
await fpMod.cargarEsquemaRegion('lumbar');   // test() es síncrono: precargar aquí

function fpItems(esq) { return esq.secciones.flatMap(s => s.items); }

for (const esq of [FP_COMUN, ...Object.values(FP_REGIONES)]) {
  test(`formulario ${esq.id}: ids únicos, tipos válidos, opciones y mostrarSi coherentes`, () => {
    const items = fpItems(esq);
    const ids = items.map(i => i.id);
    assert.equal(new Set(ids).size, ids.length, 'ids duplicados');
    items.forEach(it => {
      assert.ok(FP_TIPOS.includes(it.tipo), `${it.id}: tipo ${it.tipo}`);
      if (it.tipo === 'unica' || it.tipo === 'multi') assert.ok(it.opciones?.length, `${it.id}: sin opciones`);
      if (it.tipo === 'matriz') assert.ok(it.filas?.length && it.opciones?.length, `${it.id}: matriz incompleta`);
      if (it.detalle) assert.ok(it.opciones.includes(it.detalle.opcion), `${it.id}: detalle.opcion`);
      if (it.mostrarSi) {
        const ref = items.find(x => x.id === it.mostrarSi.id);
        assert.ok(ref, `${it.id}: mostrarSi → ${it.mostrarSi.id}`);
        it.mostrarSi.valores.forEach(v => assert.ok(ref.opciones.includes(v), `${it.id}: mostrarSi valor ${v}`));
      }
    });
  });
}

for (const [region, esq] of Object.entries(FP_REGIONES)) {
  test(`formulario ${region}: cada pista apunta a un paso del árbol y a una pregunta existente`, () => {
    const pasos = new Set(CIF_TREES[region].steps.map(s => s.id));
    for (const [paso, refs] of Object.entries(esq.pistas || {})) {
      assert.ok(pasos.has(paso), `paso ${paso} no existe en CIF_TREES.${region}`);
      refs.forEach(ref => {
        const [pref, rest] = ref.split(':');
        const [id, fila] = rest.split('.');
        const it = fpItems(pref === 'c' ? FP_COMUN : esq).find(x => x.id === id);
        assert.ok(it, `${ref}: pregunta inexistente`);
        if (fila) assert.ok(it.filas?.some(f => f.id === fila), `${ref}: fila inexistente`);
      });
    }
  });
}

test('resumen y pistas: solo respuestas visibles, con detalle y filas de matriz', () => {
  state.region = 'lumbar';
  state.formularioPrevio = {
    comun: { inicio: 'Poco a poco', primera_vez: 'Sí', episodio_previo: 'oculto: primera_vez ≠ No' },
    regiones: { lumbar: { pierna_hasta: 'Por debajo de la rodilla', empeora: { caminando: 'Sí' }, postura_alivio: 'Sí', postura_alivio__detalle: 'Sentado inclinado' } },
  };
  const r = fpMod.resumenFormularioPrevio();
  assert.ok(r.some(x => x.a === 'Poco a poco'));
  assert.ok(!r.some(x => x.a.startsWith('oculto')), 'mostrarSi no respetado');
  assert.ok(r.some(x => x.a === 'Sí — Sentado inclinado'));
  assert.ok(r.some(x => x.a === 'Caminando: Sí'));
  const p = fpMod.pistasPaso('lu_step2');
  assert.deepEqual(p, [{ q: 'Caminando', a: 'Sí' }]);
  assert.deepEqual(fpMod.pistasPaso('lu_step3').map(x => x.a), ['Poco a poco', 'Sí']);
});

test('payload lleva fp con el resumen del formulario', () => {
  const pl = buildPhysiQPayload();
  assert.ok(Array.isArray(pl.fp));
  state.formularioPrevio = { comun: {}, regiones: {} };
});

// ── Urgencias de región (fase 2) ─────────────────────────────────────────────
console.log('\nurgencias fase 2');

test('urgencia de región: título y líneas no vacías', () => {
  for (const [r, d] of Object.entries(SYSTEMIC_SCREENING)) {
    if (!d.urgencia) continue;
    assert.ok(d.urgencia.titulo && d.urgencia.lineas?.length, r);
    d.urgencia.lineas.forEach(l => assert.ok(typeof l === 'string' && l.trim(), r));
  }
  assert.ok(SYSTEMIC_SCREENING.lumbar.urgencia.titulo.includes('CAUDA EQUINA'));
});

test('l6 (cauda equina) es una pregunta de urgencia y entra en el payload', () => {
  const l6 = SYSTEMIC_SCREENING.lumbar.sistemas.flatMap(s => s.preguntas).find(q => q.id === 'l6');
  assert.ok(l6.urgencia);
  withState({ region: 'lumbar', sistemicoAnswers: { l6: 'SI' } }, () => {
    assert.deepEqual(buildPhysiQPayload().ur, [l6.urgencia]);
  });
  withState({ region: 'lumbar', sistemicoAnswers: { l6: 'NO' } }, () => {
    assert.deepEqual(buildPhysiQPayload().ur, []);
  });
});

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
