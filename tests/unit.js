'use strict';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import './dom-shim.mjs';

// Real ES modules, loaded only after the shims above are in place — app.js,
// phase4.js and phase4b.js touch `document`/`window` at module top level
// (e.g. app.js's _initHubIntegration() call).
const { HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, DOSIS_DERIVAR } = await import('../data.js');
const { calcLRScore, parseLR, testPuntua } = await import('../phase4b.js');
const { buildPhysiQPayload, buildInformeFisioterapiaText, getSistemicoAffirmativeTexts, precargarFormularioPrevio,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML } = await import('../app.js');
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
  modo:             'completo',
  sistemicoBreve:   {},
  irritabilidadDirecta: false,
  maxVisitedIdx:    5,
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

const VALID_REGIONS = ['hombro', 'cadera', 'cervical', 'lumbar', 'rodilla', 'codo', 'tobillo_pie'];

test('all 119 hypotheses present', () => {
  assert.equal(Object.keys(HYPOTHESES).length, 119);
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

test('all 7 regions present', () => {
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

// ── docs/referencias.md al día y registro de referencias ─────────────────────
// Índice generado de todas las referencias de data/ y dónde se usan (ver
// tests/referencias.mjs), y el registro central data/referencias.js: toda
// referencia citada tiene que estar en el registro y toda entrada del registro
// tiene que citarse en algún sitio. Si alguien toca una `fuente` o el registro
// sin regenerar el índice, falla.
console.log('\ndocs/referencias.md y data/referencias.js');

const { construirReferencias, recogerCitas, problemasRegistro } = await import('./referencias.mjs');
const { REFERENCIAS } = await import('../data/referencias.js');
const problemas = problemasRegistro(recogerCitas({ HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, REFERENCIAS, testPuntua }), REFERENCIAS);

test('toda referencia citada en data/ está en data/referencias.js', () => {
  assert.deepEqual(problemas.sinRegistrar, [], `${problemas.sinRegistrar.join(', ')}: añádelas al registro (clave = «Autor Año» tal como sale en la cita)`);
});

test('toda entrada de data/referencias.js se cita en data/', () => {
  assert.deepEqual(problemas.sinUso, [], `${problemas.sinUso.join(', ')}: ya no se citan, bórralas del registro (o corrige la clave)`);
});

test("data/referencias.js: revision es null o { fecha: 'AAAA-MM', resultado }", () => {
  assert.deepEqual(problemas.revisionMal, [], `revision mal escrita en: ${problemas.revisionMal.join(', ')}`);
});

test("data/referencias.js: doi vacío o con forma de DOI ('10.xxxx/…', sin prefijo https://doi.org/)", () => {
  const mal = Object.entries(REFERENCIAS).filter(([, r]) => r.doi && !/^10\.\d{4,9}\/\S+$/.test(r.doi)).map(([k]) => k);
  assert.deepEqual(mal, [], `doi mal escrito en: ${mal.join(', ')}`);
});

test('data/referencias.js: exactamente una referencia base de las tarjetas (tarjetas: true)', () => {
  assert.deepEqual(problemas.baseTarjetas, []);
});

test('docs/referencias.md coincide con las citas de data/ y con el registro', () => {
  const actual = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'referencias.md'), 'utf8');
  const esperado = construirReferencias({ HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, REFERENCIAS, testPuntua });
  assert.ok(actual === esperado,
    'docs/referencias.md no está al día — ejecuta `node tests/gen-referencias.mjs` y comitéalo junto con el cambio');
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

test('all 7 regions present', () => {
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
await fpMod.cargarEsquemaRegion('tobillo_pie');
await precargarFormularioPrevio();              // app.js carga formulario.js con import() dinámico

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
      if (it.informe) {
        assert.ok(typeof it.informe === 'string' && it.informe.trim(), `${it.id}: informe vacío`);
        assert.notEqual(it.tipo, 'matriz', `${it.id}: informe en matriz`);
      }
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

test('formulario comun: pistas de la fase 1 apuntan a una tarjeta con hueco y a una pregunta existente', () => {
  const campos = Object.keys(FP_COMUN.pistas || {});
  assert.deepEqual(campos, ['mecanismo', 'cronologia']);
  campos.forEach(campo => FP_COMUN.pistas[campo].forEach(ref => {
    assert.ok(ref.startsWith('c:'), `${ref}: la cara común solo puede apuntar a sí misma`);
    assert.ok(fpItems(FP_COMUN).some(x => x.id === ref.slice(2)), `${ref}: pregunta inexistente`);
  }));
});

test('pistas fase 1: solo lo respondido y visible, con detalle', () => {
  state.formularioPrevio = {
    comun: { desde_cuando: 'hace 5 semanas', desencadenante: 'Sí', desencadenante__detalle: 'una caída', primera_vez: 'Sí', episodio_previo: 'oculto' },
    regiones: {},
  };
  assert.deepEqual(fpMod.pistasFase1('mecanismo').map(x => x.a), ['Sí — una caída']);
  assert.deepEqual(fpMod.pistasFase1('cronologia').map(x => x.a), ['hace 5 semanas']);
  assert.deepEqual(fpMod.pistasFase1('inexistente'), []);
  // Solo lo escrito con palabras del paciente va como cita (texto libre o detalle)
  assert.deepEqual(fpMod.pistasFase1('mecanismo').map(x => x.cita), ['una caída']);
  assert.deepEqual(fpMod.pistasFase1('cronologia').map(x => x.cita), ['hace 5 semanas']);
  state.formularioPrevio.comun.inicio = 'De golpe';
  assert.ok(!fpMod.pistasFase1('mecanismo').find(x => x.a === 'De golpe').cita, 'una opción no es cita');
});

test('informe: antecedentes marcados; «prefiero comentarlo en persona» no existe en PhysiQ', () => {
  const comun = fpItems(FP_COMUN);
  assert.ok(!comun.some(i => i.id === 'en_persona'), 'en_persona se quitó a propósito (ver cabecera de formularios/comun.js)');
  assert.deepEqual(comun.filter(i => i.antecedente).map(i => i.id), ['enfermedades', 'operaciones', 'medicacion']);
  comun.filter(i => i.antecedente).forEach(i => assert.ok(i.informe, i.id));
});

test('informe: solo lo marcado, con su etiqueta, sin «No sabría decir» y actividades unidas', () => {
  state.region = 'lumbar';
  state.formularioPrevio = {
    comun: {
      inicio: 'Poco a poco', evolucion: 'A peor', despierta: 'ns',
      actividad_1: 'Conducir', actividad_2: 'Dormir', probado: ['Reposo', 'Medicación'],
      medicacion: 'Ibuprofeno 600', en_persona: ['Hay algo relacionado con esta molestia que prefiero comentarle en persona.'],
    },
    regiones: { lumbar: { pierna_hasta: 'Hasta la rodilla', pierna_lado: 'Derecha', cambia_lado: 'Sí', empeora: { caminando: 'Sí' } } },
  };
  const inf = fpMod.informeFormularioPrevio();
  assert.deepEqual(inf.historia, [
    { q: 'Evolución desde el inicio', a: 'A peor' },
    { q: 'Actividades limitadas', a: 'Conducir; Dormir' },
    { q: 'Tratamientos ya probados', a: 'Reposo, Medicación' },
    { q: 'Dolor irradiado a la pierna', a: 'Hasta la rodilla' },
    { q: 'Pierna afectada', a: 'Derecha' },
  ]);
  assert.deepEqual(inf.antecedentes, [{ q: 'Medicación actual', a: 'Ibuprofeno 600' }]);
  const txt = buildInformeFisioterapiaText();
  assert.ok(txt.includes('SEGÚN REFIERE EL PACIENTE\n  · Evolución desde el inicio: A peor'), txt);
  assert.ok(txt.includes('ANTECEDENTES REFERIDOS POR EL PACIENTE\n  · Medicación actual: Ibuprofeno 600'));
  assert.ok(!txt.includes('en persona'));
  assert.ok(!fpMod.resumenFormularioPrevio().some(x => x.a.includes('en persona')), 'respuesta antigua de en_persona');
  state.formularioPrevio = { comun: {}, regiones: {} };
  assert.ok(!buildInformeFisioterapiaText().includes('SEGÚN REFIERE'), 'sin respuestas no sale la sección');
});

test('informe tobillo y pie: mecanismo y torceduras previas, nada más de la cara 2', () => {
  state.region = 'tobillo_pie';
  state.formularioPrevio = {
    comun: {},
    regiones: { tobillo_pie: {
      que_paso: ['Se me torció el tobillo hacia dentro, apoyando el borde de fuera del pie', 'No sabría decir'],
      torceduras: 'Varias veces', chasquido: 'Sí', provoca: { correr: 'Sí' },
    } },
  };
  assert.deepEqual(fpMod.informeFormularioPrevio().historia, [
    { q: 'Cómo se lesionó', a: 'Se me torció el tobillo hacia dentro, apoyando el borde de fuera del pie' },
    { q: 'Torceduras previas del mismo tobillo', a: 'Varias veces' },
  ]);
  state.formularioPrevio = { comun: {}, regiones: {} };
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

test('lu8: la regla SI es 3 de 5 tests de provocación (como la tarjeta lumbar)', () => {
  const h = HYPOTHESES.lu8;
  assert.equal(h.tests.filter(t => t.cluster === 'laslett').length, 5);
  assert.equal(h.clusters.laslett.umbralPos, 3);
  const r = Object.fromEntries(h.tests.map((t, i) => [i, 'nd']));
  h.tests.forEach((t, i) => { if (t.cluster) r[i] = 'neg'; });
  [0, 1, 2].forEach(i => { r[i] = 'pos'; });
  assert.ok(Math.abs(calcLRScore(h, r).totalLR - 2.44) < 0.001);
});

test('árbol CIF: `derivacion` de una opción es texto no vacío; lumbar VASCULAR la lleva', () => {
  for (const [r, tree] of Object.entries(CIF_TREES)) {
    tree.steps.forEach(st => st.options.forEach(o => {
      if ('derivacion' in o) assert.ok(typeof o.derivacion === 'string' && o.derivacion.trim(), `${r}/${st.id}/${o.value}`);
    }));
  }
  const vasc = CIF_TREES.lumbar.steps.find(s => s.id === 'lu_step2').options.find(o => o.value === 'vascular');
  assert.ok(vasc.derivacion?.includes('derivación médica'));
});

test('árbol CIF: VASCULAR entra en payload (dv), 📋 Notas y 📄 Informe; otra respuesta no', () => {
  const msg = CIF_TREES.lumbar.steps.find(s => s.id === 'lu_step2').options.find(o => o.value === 'vascular').derivacion;
  withState({ region: 'lumbar', treeAnswers: { lu_step1: 'no', lu_step2: 'vascular' } }, () => {
    assert.deepEqual(buildPhysiQPayload().dv, [msg]);
    assert.ok(buildContextSummaryText().includes(`🩺 DERIVACIÓN MÉDICA (árbol CIF): ${msg}`));
    const inf = buildInformeFisioterapiaText();
    assert.ok(inf.includes('Se recomienda valoración médica') && inf.includes(msg));
  });
  withState({ region: 'lumbar', treeAnswers: { lu_step1: 'no', lu_step2: 'si' } }, () => {
    assert.deepEqual(buildPhysiQPayload().dv, []);
    assert.ok(!buildContextSummaryText().includes('DERIVACIÓN MÉDICA'));
    assert.ok(!buildInformeFisioterapiaText().includes('Se recomienda valoración médica'));
  });
});

test('cadera: fractura de estrés del cuello femoral, artritis séptica y torsión testicular son urgencias', () => {
  const qs = SYSTEMIC_SCREENING.cadera.sistemas.flatMap(s => s.preguntas);
  ['ca_os1', 'ca_in1', 'ca_u3'].forEach(id => assert.ok(qs.find(q => q.id === id)?.urgencia, id));
  withState({ region: 'cadera', sistemicoAnswers: { ca_os1: 'SI', ca_in1: 'NO', ca_u3: 'NO' } }, () => {
    assert.equal(buildPhysiQPayload().ur.length, 1);
  });
});

test('cadera: ningún test multiplica por una LR− de 0; Thomas y FADDIR no puntúan; trocantéreo según Kinsella 2024', () => {
  Object.values(HYPOTHESES).filter(h => h.region === 'cadera').forEach(h => {
    const r = Object.fromEntries(h.tests.map((_, i) => [i, 'neg']));
    assert.ok(calcLRScore(h, r).totalLR > 0, h.id);
  });
  // Thomas (S/E calculadas por Reiman 2015 sobre una serie de casos) y FADDIR (agrupado con probabilidad
  // previa del 90 %; Pålsson 2020 en FAIS) son hallazgos en SIFA y en labrum.
  for (const id of ['ca2', 'ca3']) {
    const h = HYPOTHESES[id];
    h.tests.forEach((t, i) => {
      if (t.name !== 'Test de Thomas' && !t.name.includes('FADDIR')) return;
      for (const r of ['pos', 'neg']) assert.equal(calcLRScore(h, { [i]: r }).totalLR, 1, `${id} ${t.name} ${r}`);
    });
  }
  // Síndrome trocantéreo: palpación × abducción resistida reproducen la secuencia de Kinsella 2024
  // (59 % → 96 % con las dos positivas, → 14 % con las dos negativas); la derotación es hallazgo.
  const ca4 = HYPOTHESES.ca4, iPal = ca4.tests.findIndex(t => t.name.startsWith('Palpación')),
    iAbd = ca4.tests.findIndex(t => t.name.startsWith('Test de Abducción')),
    iDer = ca4.tests.findIndex(t => t.name.startsWith('Derotación'));
  assert.ok(Math.abs(calcLRScore(ca4, { [iPal]: 'pos', [iAbd]: 'pos' }).totalLR - 2.42 * 6.09) < 0.001);
  assert.ok(Math.abs(calcLRScore(ca4, { [iPal]: 'neg', [iAbd]: 'neg' }).totalLR - 0.25 * 0.45) < 0.001);
  assert.equal(calcLRScore(ca4, { [iDer]: 'pos' }).totalLR, 1);
});

test('ca1: los criterios ACR no puntúan (cifras de la muestra de desarrollo); la RI disminuida puntúa sola', () => {
  const h = HYPOTHESES.ca1, iAcr = h.tests.findIndex(t => t.name.startsWith('Criterios clínicos ACR'));
  assert.equal(calcLRScore(h, { [iAcr]: 'pos' }).totalLR, 1);
  assert.equal(calcLRScore(h, { [iAcr]: 'neg' }).totalLR, 1);
  assert.ok(Math.abs(calcLRScore(h, { 0: 'pos', 2: 'pos', [iAcr]: 'pos' }).totalLR - 3.2) < 0.001);
});

test('ca10: thigh thrust y compresión puntúan solos (Laslett 2005) y el cluster de Laslett los absorbe', () => {
  const h = HYPOTHESES.ca10, iTt = h.tests.findIndex(t => t.name === 'Thigh thrust'),
    iCl = h.tests.findIndex(t => t.name.startsWith('Cluster de Laslett'));
  assert.ok(h.tests[iCl].absorbe.includes(iTt));
  assert.ok(Math.abs(calcLRScore(h, { [iTt]: 'pos' }).totalLR - 2.8) < 0.001);
  assert.ok(Math.abs(calcLRScore(h, { [iTt]: 'neg' }).totalLR - 0.18) < 0.001);
  const soloCluster = calcLRScore(h, { [iCl]: 'pos' }).totalLR;
  assert.ok(Math.abs(calcLRScore(h, { [iCl]: 'pos', [iTt]: 'pos' }).totalLR - soloCluster) < 0.001);
  const iCo = h.tests.findIndex(t => t.name === 'Test de Compresión Pélvica');
  assert.ok(h.tests[iCl].absorbe.includes(iCo));
  assert.ok(Math.abs(calcLRScore(h, { [iCo]: 'pos' }).totalLR - 2.2) < 0.001);
  assert.ok(Math.abs(calcLRScore(h, { [iCo]: 'neg' }).totalLR - 0.46) < 0.001);
  assert.ok(Math.abs(calcLRScore(h, { [iCl]: 'pos', [iCo]: 'pos', [iTt]: 'pos' }).totalLR - soloCluster) < 0.001);
});

test('cervical: disección, IVB, fractura tras traumatismo y cefalea de alarma son urgencias', () => {
  const qs = SYSTEMIC_SCREENING.cervical.sistemas.flatMap(s => s.preguntas);
  ['cv_ar1', 'cv_ar2', 'cv_ar3', 'cv_ar4'].forEach(id => assert.ok(qs.find(q => q.id === id)?.urgencia, id));
  withState({ region: 'cervical', sistemicoAnswers: { cv_ar1: 'NO', cv_ar2: 'SI', cv_ar3: 'NO', cv_ar4: 'NO' } }, () => {
    assert.equal(buildPhysiQPayload().ur.length, 1);
  });
});

test('cervical: ningún test multiplica por una LR− de 0; el cluster de Jull y el hielo no puntúan', () => {
  Object.values(HYPOTHESES).filter(h => h.region === 'cervical').forEach(h => {
    const r = Object.fromEntries(h.tests.map((_, i) => [i, 'neg']));
    assert.ok(calcLRScore(h, r).totalLR > 0, h.id);
  });
  const ce4 = HYPOTHESES.ce4, iCluster = ce4.tests.findIndex(t => t.name.startsWith('Cluster'));
  assert.equal(calcLRScore(ce4, { [iCluster]: 'pos' }).totalLR, 1);
  const ce5 = HYPOTHESES.ce5, iHielo = ce5.tests.findIndex(t => t.name.startsWith('Hielo'));
  assert.equal(ce5.tests[iHielo].tipo, 'pronostico');
  assert.equal(calcLRScore(ce5, { [iHielo]: 'pos' }).totalLR, 1);
});

test('cervical: el FRT puntúa solo positivo (un negativo no descarta una cervicogénica de C2–C3)', () => {
  const ce4 = HYPOTHESES.ce4, iFrt = ce4.tests.findIndex(t => t.name.startsWith('Test de Flexión-Rotación'));
  assert.ok(Math.abs(calcLRScore(ce4, { [iFrt]: 'pos' }).totalLR - 5) < 0.001);
  assert.equal(calcLRScore(ce4, { [iFrt]: 'neg' }).totalLR, 1);
});

test('rodilla: bursa séptica, aparato extensor, luxación y neurovascular son urgencias', () => {
  const qs = SYSTEMIC_SCREENING.rodilla.sistemas.flatMap(s => s.preguntas);
  ['r1', 'r_v2', 'r_i3', 'ro_t2', 'ro_t3', 'ro_t4'].forEach(id => assert.ok(qs.find(q => q.id === id)?.urgencia, id));
});

test('rodilla: los grupos de Décary absorben sus componentes; LCA confirma y descarta por separado', () => {
  const ro4 = HYPOTHESES.ro4, iConf = ro4.tests.findIndex(t => t.name.startsWith('Confirmar')),
    iDesc = ro4.tests.findIndex(t => t.name.startsWith('Descartar'));
  assert.ok(Math.abs(calcLRScore(ro4, { [iConf]: 'pos' }).totalLR - 17.5) < 0.001);
  assert.equal(calcLRScore(ro4, { [iConf]: 'neg' }).totalLR, 1);   // sin LR− publicada
  assert.ok(Math.abs(calcLRScore(ro4, { [iDesc]: 'neg' }).totalLR - 0.08) < 0.001);
  assert.equal(calcLRScore(ro4, { [iDesc]: 'pos' }).totalLR, 1);   // sin LR+ publicada
  const ro2 = HYPOTHESES.ro2, iTrau = ro2.tests.findIndex(t => t.name.startsWith('Combinación traumática')),
    iPalp = ro2.tests.findIndex(t => t.name.startsWith('Sensibilidad a la palpación'));
  assert.ok(Math.abs(calcLRScore(ro2, { [iTrau]: 'pos', [iPalp]: 'pos' }).totalLR - 8.9) < 0.001);
  // Criterios del ACR con las cifras de Peat 2006 (LR+ 1,6 · LR− 0,8): no puntúan, así que no
  // absorben a sus componentes — crepitación (2,23) y agrandamiento óseo (11,81) cuentan solos.
  const ro1 = HYPOTHESES.ro1, iAcr = ro1.tests.findIndex(t => t.name === 'Criterios clínicos del ACR');
  assert.equal(calcLRScore(ro1, { [iAcr]: 'pos' }).totalLR, 1);
  assert.equal(calcLRScore(ro1, { [iAcr]: 'neg' }).totalLR, 1);
  assert.ok(Math.abs(calcLRScore(ro1, { 0: 'pos', 1: 'pos', 2: 'pos', [iAcr]: 'pos' }).totalLR - 2.23 * 11.81) < 0.01);
  // Plica: la E de Kim 2007 sale solo de los controles con dolor lateral → hallazgo, no puntúa
  assert.equal(calcLRScore(HYPOTHESES.ro17, { 0: 'pos' }).totalLR, 1);
  assert.equal(calcLRScore(HYPOTHESES.ro17, { 0: 'neg' }).totalLR, 1);
});

test('hombro: solo h_g1 (ectópico) es urgencia; la bisagra reparte congelado, artrosis GH y luxación/fractura', () => {
  const qs = SYSTEMIC_SCREENING.hombro.sistemas.flatMap(s => s.preguntas);
  assert.equal(SYSTEMIC_SCREENING.hombro.urgencia, undefined);
  assert.deepEqual(qs.filter(q => q.urgencia).map(q => q.id), ['h_g1']);
  ['h_t1', 'h_i1', 'h_n1'].forEach(id => assert.ok(qs.find(q => q.id === id), id));
  const steps = CIF_TREES.hombro.steps, s2 = steps.find(s => s.id === 'h_step2');
  assert.deepEqual(s2.options.find(o => o.value === 'si').hypothesis, []);
  assert.deepEqual(steps.find(s => s.id === 'h_step2b').options.map(o => o.hypothesis[0]), ['h11', 'h10', 'h1']);
});

test('hombro: clusters del manguito (Park, Litaker) sin contar dos veces; AC de Chronopoulos y Walton', () => {
  const h3 = HYPOTHESES.h3, i = n => h3.tests.findIndex(t => t.name.startsWith(n));
  const iA = i('Cluster A, confirmar'), iAd = i('Cluster A, descartar'), iB = i('Cluster B'), iDrop = i('Drop Arm'), iLag = i('External Rotation Lag');
  assert.ok(Math.abs(calcLRScore(h3, { [iA]: 'pos' }).totalLR - 15.57) < 0.001);
  assert.equal(calcLRScore(h3, { [iA]: 'neg' }).totalLR, 1);                     // sin LR−: para eso está «descartar»
  assert.ok(Math.abs(calcLRScore(h3, { [iAd]: 'neg' }).totalLR - 0.16) < 0.001);
  assert.equal(calcLRScore(h3, { [iAd]: 'pos' }).totalLR, 1);
  // El cluster A absorbe drop arm, signo de retraso en RE y cluster B (la debilidad en RE va en los dos)
  assert.ok(Math.abs(calcLRScore(h3, { [iA]: 'pos', [iDrop]: 'pos', [iLag]: 'pos', [iB]: 'pos' }).totalLR - 15.57) < 0.001);
  assert.ok(Math.abs(calcLRScore(h3, { [iB]: 'pos' }).totalLR - 5.0) < 0.001); // validación, no la 9,84 de derivación
  const h7 = HYPOTHESES.h7;
  assert.ok(Math.abs(calcLRScore(h7, { 0: 'pos' }).totalLR - 0.77 / 0.21) < 0.01);
  // O'Brien (Chronopoulos frente a Walton, contradictorios), palpación y Paxinos (Walton, 10 controles): hallazgos
  ['Compresión activa', 'Palpación directa', 'Test de Paxinos', 'Paxinos + gammagrafía'].forEach(n => {
    const k = h7.tests.findIndex(t => t.name.startsWith(n));
    assert.ok(k >= 0, n);
    assert.equal(calcLRScore(h7, { [k]: 'pos' }).totalLR, 1, n);
    assert.equal(calcLRScore(h7, { [k]: 'neg' }).totalLR, 1, n);
  });
});

test('hombro: el O’Brien de SLAP no puntúa (Hegedus 2012: LR+ 1,06, IC con el 1)', () => {
  const k = HYPOTHESES.h5.tests.findIndex(t => t.name.startsWith('Test de O'));
  assert.equal(calcLRScore(HYPOTHESES.h5, { [k]: 'pos' }).totalLR, 1);
  assert.equal(calcLRScore(HYPOTHESES.h5, { [k]: 'neg' }).totalLR, 1);
});

test('hombro: LR de Hegedus 2012 en SAPS e inestabilidad; cada dirección por separado', () => {
  const lr = (h, n, r) => calcLRScore(HYPOTHESES[h], { [HYPOTHESES[h].tests.findIndex(t => t.name.startsWith(n))]: r }).totalLR;
  assert.ok(Math.abs(lr('h2', 'Arco doloroso', 'pos') - 2.25) < 0.001);
  assert.equal(lr('h2', 'Arco doloroso', 'neg'), 1);
  assert.equal(lr('h2', 'Test de Hawkins', 'pos'), 1);
  assert.ok(Math.abs(lr('h2', 'Test de Hawkins', 'neg') - 0.35) < 0.001);
  assert.ok(Math.abs(lr('h2', 'Test de Neer', 'neg') - 0.47) < 0.001);
  assert.ok(Math.abs(lr('h4', 'Test de Aprehensión', 'pos') - 17.21) < 0.001);
  assert.ok(Math.abs(lr('h4', 'Test de Aprehensión', 'neg') - 0.39) < 0.001);
  assert.equal(lr('h4', 'Test de Recolocación', 'pos'), 1);   // IC de las dos LR con el 1
  assert.equal(lr('h4', 'Test de Recolocación', 'neg'), 1);
  assert.equal(lr('h4', 'Test de Liberación', 'pos'), 1);     // IC de la LR+ con el 1
  assert.ok(Math.abs(lr('h4', 'Test de Liberación', 'neg') - 0.25) < 0.001);
});

test('hombro: las cifras nuevas de la tarjeta sin fuente verificada no puntúan', () => {
  // Clusters A/B del manguito, palpación AC, Paxinos + O'Brien: cifras solo en el criterio
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h7', 'h10', 'h11'].forEach(id => {
    HYPOTHESES[id].tests.filter(t => t.fuente?.startsWith('Tarjeta de consulta hombro')).forEach(t => {
      const i = HYPOTHESES[id].tests.indexOf(t);
      assert.equal(calcLRScore(HYPOTHESES[id], { [i]: 'pos' }).totalLR, 1, `${id}/${t.name}`);
      assert.equal(calcLRScore(HYPOTHESES[id], { [i]: 'neg' }).totalLR, 1, `${id}/${t.name}`);
    });
  });
});

test('tobillo y pie: cinco P, artritis infecciosa y debilidad simétrica con arreflexia son urgencias', () => {
  const qs = SYSTEMIC_SCREENING.tobillo_pie.sistemas.flatMap(s => s.preguntas);
  ['tp_t1', 'tp_i1', 'tp_n1'].forEach(id => assert.ok(qs.find(q => q.id === id)?.urgencia, id));
});

test('tobillo y pie: solo puntúan Thompson, hueco palpable, Ottawa (LR−) y Molloy', () => {
  const idx = (id, nombre) => HYPOTHESES[id].tests.findIndex(t => t.name === nombre);
  const lr = (id, nombre, r) => calcLRScore(HYPOTHESES[id], { [idx(id, nombre)]: r }).totalLR;
  const puntuan = {
    tp3: ['Thompson (Simmonds)', 'Hueco palpable'],
    tp5: ['Reglas de Ottawa de tobillo y de pie'],
    tp37: ['Regla de Ottawa de tobillo'],
    tp20: ['Signo de pinzamiento de Molloy'],
  };
  // Maffulli 1998 con las LR de Reiman 2014
  assert.equal(lr('tp3', 'Thompson (Simmonds)', 'pos'), 13.71);
  assert.equal(lr('tp3', 'Thompson (Simmonds)', 'neg'), 0.04);
  assert.equal(lr('tp3', 'Hueco palpable', 'pos'), 6.64);
  assert.equal(lr('tp3', 'Hueco palpable', 'neg'), 0.3);
  // Bachmann 2003: solo descarta (las dos reglas juntas); el positivo es hallazgo
  assert.equal(lr('tp5', 'Reglas de Ottawa de tobillo y de pie', 'neg'), 0.21);
  assert.equal(lr('tp5', 'Reglas de Ottawa de tobillo y de pie', 'pos'), 1);
  // Bachmann 2003: regla del tobillo sola, LR− 0,08; el positivo no puntúa
  assert.equal(lr('tp37', 'Regla de Ottawa de tobillo', 'neg'), 0.08);
  assert.equal(lr('tp37', 'Regla de Ottawa de tobillo', 'pos'), 1);
  // Molloy 2003: LR calculadas de S 94,8 % y E 88 %
  assert.ok(Math.abs(lr('tp20', 'Signo de pinzamiento de Molloy', 'pos') - 7.9) < 0.01);
  assert.ok(Math.abs(lr('tp20', 'Signo de pinzamiento de Molloy', 'neg') - 0.059) < 0.002);
  assert.equal(idx('tp20', 'Signo de pinzamiento de Molloy'), HYPOTHESES.tp20.tests.length - 1, 'test añadido al final');
  // Todo lo demás es hallazgo
  Object.values(HYPOTHESES).filter(h => h.region === 'tobillo_pie').forEach(h => {
    h.tests.forEach((t, i) => {
      if ((puntuan[h.id] || []).includes(t.name)) return;
      assert.equal(calcLRScore(h, { [i]: 'pos' }).totalLR, 1, `${h.id}/${t.name}`);
      assert.equal(calcLRScore(h, { [i]: 'neg' }).totalLR, 1, `${h.id}/${t.name}`);
    });
  });
});

test('tobillo y pie: todas las hipótesis se alcanzan desde el árbol', () => {
  const alcanzadas = new Set(CIF_TREES.tobillo_pie.steps.flatMap(s => s.options.flatMap(o => o.hypothesis)));
  const sinRama = Object.values(HYPOTHESES).filter(h => h.region === 'tobillo_pie' && !alcanzadas.has(h.id)).map(h => h.id);
  assert.deepEqual(sinRama, []);
});

// ── data/ por regiones ────────────────────────────────────────────────────────
console.log('\ndata/ por regiones');
const REGION_MODS = {};
for (const r of VALID_REGIONS) REGION_MODS[r] = await import(`../data/${r}.js`);

test('cada data/<region>.js exporta screening, tree y hypotheses, y data.js los reúne', () => {
  for (const [r, m] of Object.entries(REGION_MODS)) {
    assert.equal(SYSTEMIC_SCREENING[r], m.screening, r);
    assert.equal(CIF_TREES[r], m.tree, r);
    Object.keys(m.hypotheses).forEach(id => assert.equal(HYPOTHESES[id], m.hypotheses[id], `${r}/${id}`));
  }
});

test('ningún id de hipótesis se repite entre regiones (se sobrescribiría sin aviso)', () => {
  const total = Object.values(REGION_MODS).reduce((n, m) => n + Object.keys(m.hypotheses).length, 0);
  assert.equal(Object.keys(HYPOTHESES).length, total);
});

test('cada hipótesis está en el archivo de su región', () => {
  for (const [r, m] of Object.entries(REGION_MODS)) {
    Object.values(m.hypotheses).forEach(h => assert.equal(h.region, r, h.id));
  }
});


test('dosisFuente solo acompaña a una dosis escrita (nunca cita algo vacío)', () => {
  for (const h of Object.values(HYPOTHESES)) {
    if (h.dosisFuente !== undefined) {
      assert.ok(typeof h.dosisFuente === 'string' && h.dosisFuente.trim(), `${h.id}: dosisFuente vacía`);
      assert.ok(h.dosis && h.dosis.trim(), `${h.id}: dosisFuente sin dosis`);
    }
  }
});

test('hipótesis de derivación: texto fijo, sin fuente, y solo las decididas', () => {
  const derivar = Object.values(HYPOTHESES).filter(h => h.dosis === DOSIS_DERIVAR).map(h => h.id).sort();
  assert.deepEqual(derivar, ['ce8', 'h11', 'ro11', 'tp17', 'tp3', 'tp30', 'tp35', 'tp37', 'tp4', 'tp5', 'tp6']);
  derivar.forEach(id => assert.ok(!HYPOTHESES[id].dosisFuente, `${id}: una derivación no lleva fuente de dosis`));
});

// ── Modo breve ────────────────────────────────────────────────────────────────
console.log('\nmodo breve');

const LUMBAR_SIS = SYSTEMIC_SCREENING.lumbar.sistemas;

test('modo completo → sin pendientes, md "completo" y sin campo pe', () => {
  withState({}, () => {
    assert.deepEqual(getPendientesBreve(), []);
    const p = buildPhysiQPayload();
    assert.equal(p.md, 'completo');
    assert.ok(!('pe' in p));
  });
});

test('breve: sistemas con embudo en NO y sin responder salen como pendientes, cada uno en su lista', () => {
  const [a, b, ...resto] = LUMBAR_SIS;
  withState({ modo: 'breve', region: 'lumbar', sistemicoBreve: { [a.id]: 'NO', [b.id]: 'SI' } }, () => {
    const t = getPendientesBreve().map(p => p.texto);
    const embudo = t.find(x => x.startsWith('Cribado sistémico solo por embudo'));
    const sinCribar = t.find(x => x.startsWith('Sistemas sin cribar'));
    assert.ok(embudo.includes(a.nombre) && !embudo.includes(b.nombre), embudo);
    resto.forEach(s => assert.ok(sinCribar.includes(s.nombre), s.nombre));
    assert.ok(!sinCribar.includes(a.nombre) && !sinCribar.includes(b.nombre));
  });
});

test('breve: todos los sistemas con embudo en SÍ → ningún pendiente de cribado', () => {
  const todos = Object.fromEntries(LUMBAR_SIS.map(s => [s.id, 'SI']));
  withState({ modo: 'breve', region: 'lumbar', sistemicoBreve: todos }, () => {
    assert.ok(!getPendientesBreve().some(p => p.fase === 2));
  });
});

test('breve: irritabilidad directa → pendiente y payload «(estimada)»', () => {
  withState({ modo: 'breve', irritabilidadDirecta: true, irritabilidadNivel: 'Alta' }, () => {
    assert.ok(getPendientesBreve().some(p => p.fase === 3));
    assert.equal(buildPhysiQPayload().ir, 'Alta (estimada)');
  });
});

test('breve: hipótesis sin ningún test pos/neg → pendiente de confirmación; con uno hecho, no', () => {
  withState({ modo: 'breve', testResults: { h2: { 0: 'nd', 1: 'nd' } } }, () => {
    assert.ok(getPendientesBreve().some(p => p.fase === '4b'));
  });
  withState({ modo: 'breve', testResults: { h2: { 0: 'pos' } } }, () => {
    assert.ok(!getPendientesBreve().some(p => p.fase === '4b'));
  });
});

test('breve: notas, informe y payload llevan la línea de valoración no exhaustiva; completo, no', () => {
  const marca = 'Valoración inicial breve';
  withState({ modo: 'breve', testResults: { h2: {} } }, () => {
    const p = buildPhysiQPayload();
    assert.equal(p.md, 'breve');
    assert.ok(Array.isArray(p.pe) && p.pe.length > 0);
    assert.ok(buildContextSummaryText().includes(marca));
    const inf = buildInformeFisioterapiaText();
    assert.ok(inf.includes(marca));
    assert.ok(inf.includes('IMPRESIÓN CLÍNICA (hipótesis de trabajo, pendiente de confirmar)'));
  });
  withState({}, () => {
    assert.ok(!buildContextSummaryText().includes(marca));
    assert.ok(!buildInformeFisioterapiaText().includes(marca));
  });
});

test('embudo: toda pregunta con `urgencia` lleva sq2-urg (el CSS nunca la pliega) y ninguna otra', () => {
  for (const [region, data] of Object.entries(SYSTEMIC_SCREENING)) {
    for (const sis of data.sistemas) {
      const html = buildSistemaHTML(sis);
      assert.ok(html.includes(`data-embudo="${sis.id}"`), `${region}/${sis.id} sin embudo`);
      for (const q of sis.preguntas) {
        const m = html.match(new RegExp(`<div class="(sq2[^"]*)" id="sq2_${q.id}"`));
        assert.ok(m, `${region}/${q.id} no renderizada`);
        assert.equal(m[1].split(' ').includes('sq2-urg'), !!q.urgencia, `${region}/${q.id}`);
      }
    }
  }
});

test('testPuntua: LR útil sí; hallazgo, pronóstico y cluster sin regla útil, no', () => {
  assert.equal(testPuntua({}, { lr_pos: '6' }), true);
  assert.equal(testPuntua({}, { lr_neg: '0.2' }), true);
  assert.equal(testPuntua({}, { lr_pos: '1.2', lr_neg: '0.9' }), false);
  assert.equal(testPuntua({}, { lr_pos: '6', tipo: 'pronostico' }), false);
  assert.equal(testPuntua({ clusters: { c: { lr_pos: '4' } } }, { cluster: 'c' }), true);
  assert.equal(testPuntua({ clusters: { c: { lr_pos: '1.1' } } }, { cluster: 'c' }), false);
});

test('testPuntua coincide con calcLRScore: un test que no puntúa nunca cambia totalLR', () => {
  for (const hyp of Object.values(HYPOTHESES)) {
    hyp.tests.forEach((t, i) => {
      if (testPuntua(hyp, t) || t.cluster) return;
      for (const r of ['pos', 'neg']) {
        assert.equal(calcLRScore(hyp, { [i]: r }).totalLR, 1, `${hyp.id}[${i}] ${r}`);
      }
    });
  }
});

// ── Razonamiento del cribado (fase 2, «¿Por qué?») ───────────────────────────
// docs/razonamiento-cribado.md. Campo opcional por pregunta: si existe, `porque`
// y `peso` no vacíos, `fuentes` con claves del registro, y nada fuera del esquema.
console.log('\nrazonamiento del cribado');

const CAMPOS_RAZON = ['porque', 'peso', 'detalle', 'fuentes', 'citas', 'fisiologia'];
const textoCita = c => (typeof c === 'string' ? c : c.texto);
const preguntasConRazon = [];
{
  const vistas = new Set();
  for (const [region, data] of Object.entries(SYSTEMIC_SCREENING)) {
    for (const sis of data.sistemas) {
      for (const q of sis.preguntas) {
        if (!q.razonamiento || vistas.has(`${sis.id}.${q.id}`)) continue;
        vistas.add(`${sis.id}.${q.id}`);
        preguntasConRazon.push({ region, sis, q, r: q.razonamiento });
      }
    }
  }
}
const noVacio = x => typeof x === 'string' && x.trim().length > 0;

test('razonamiento: porque y peso no vacíos, detalle no vacío si existe, sin campos fuera del esquema', () => {
  for (const { region, q, r } of preguntasConRazon) {
    const donde = `${region}/${q.id}`;
    assert.ok(noVacio(r.porque), `${donde}: porque vacío`);
    assert.ok(noVacio(r.peso), `${donde}: peso vacío`);
    assert.ok(r.detalle === undefined || noVacio(r.detalle), `${donde}: detalle vacío`);
    const extra = Object.keys(r).filter(k => !CAMPOS_RAZON.includes(k));
    assert.deepEqual(extra, [], `${donde}: campos desconocidos`);
  }
});

test('razonamiento: fuentes no vacío y todas son claves de data/referencias.js', () => {
  for (const { region, q, r } of preguntasConRazon) {
    assert.ok(Array.isArray(r.fuentes) && r.fuentes.length > 0, `${region}/${q.id}: sin fuentes`);
    for (const f of r.fuentes) assert.ok(REFERENCIAS[f], `${region}/${q.id}: «${f}» no está en el registro`);
  }
});

test('razonamiento: cada cita completa empieza por una de sus fuentes, y cada fuente tiene su cita', () => {
  for (const { region, q, r } of preguntasConRazon) {
    if (!r.citas) continue;
    for (const c of r.citas.map(textoCita)) assert.ok(r.fuentes.some(f => c.startsWith(f)), `${region}/${q.id}: cita sin fuente: ${c}`);
    for (const f of r.fuentes) assert.ok(r.citas.map(textoCita).some(c => c.startsWith(f)), `${region}/${q.id}: fuente sin cita: ${f}`);
  }
});

test('razonamiento: una cita con enlace es { texto, url } y su url es la del registro', () => {
  for (const { region, q, r } of preguntasConRazon) {
    for (const c of r.citas || []) {
      if (typeof c === 'string') continue;
      assert.deepEqual(Object.keys(c).sort(), ['texto', 'url'], `${region}/${q.id}: cita con campos raros`);
      const clave = r.fuentes.find(f => c.texto.startsWith(f));
      assert.ok(/^https:\/\//.test(c.url), `${region}/${q.id}: url no https: ${c.url}`);
      assert.equal(c.url, REFERENCIAS[clave]?.url, `${region}/${q.id}: la url de «${clave}» no coincide con data/referencias.js`);
    }
  }
});

test('razonamiento: fisiologia = { pasos (3–6), nota?, metafora? }, solo con detalle (se ve en «Ampliar»)', () => {
  for (const { region, q, r } of preguntasConRazon) {
    const f = r.fisiologia;
    if (!f) continue;
    const donde = `${region}/${q.id}`;
    assert.ok(r.detalle, `${donde}: fisiologia sin detalle no se vería`);
    assert.deepEqual(Object.keys(f).filter(k => !['pasos', 'nota', 'metafora'].includes(k)), [], `${donde}: campos raros en fisiologia`);
    assert.ok(Array.isArray(f.pasos) && f.pasos.length >= 3 && f.pasos.length <= 6, `${donde}: 3–6 pasos`);
    for (const p of f.pasos) assert.ok(noVacio(p), `${donde}: paso vacío`);
    assert.ok(f.nota === undefined || noVacio(f.nota), `${donde}: nota vacía`);
    assert.ok(f.metafora === undefined || noVacio(f.metafora), `${donde}: metáfora vacía`);
  }
});

test('razonamiento: «¿Por qué?» solo en preguntas que lo tienen, «Ampliar» solo con detalle', () => {
  for (const [region, data] of Object.entries(SYSTEMIC_SCREENING)) {
    for (const sis of data.sistemas) {
      const html = buildSistemaHTML(sis);
      for (const q of sis.preguntas) {
        const ini = html.indexOf(`id="sq2_${q.id}"`);
        const fin = html.indexOf('id="sq2_', ini + 1);
        const bloque = html.slice(ini, fin === -1 ? undefined : fin);
        assert.equal(bloque.includes('class="razon"'), !!q.razonamiento, `${region}/${q.id}: ¿Por qué?`);
        assert.equal(bloque.includes(`abrirRazonamiento(this,'${sis.id}','${q.id}')`), !!q.razonamiento?.detalle, `${region}/${q.id}: Ampliar`);
      }
    }
  }
});

test('razonamiento: nunca entra en el payload, 📋 Notas ni 📄 Informe', () => {
  const muestra = preguntasConRazon.find(p => p.region !== 'comun' && SYSTEMIC_SCREENING[p.region]);
  if (!muestra) return;   // aún no hay ninguna pregunta con razonamiento
  const { region, q, r } = muestra;
  withState({ region, sistemicoAnswers: { [q.id]: 'SI' }, sistemicoAlerta: true }, () => {
    const textos = [JSON.stringify(buildPhysiQPayload()), buildContextSummaryText(), buildInformeFisioterapiaText()];
    assert.ok(JSON.stringify(buildPhysiQPayload()).includes(q.text.slice(0, 20)), 'la pregunta respondida SÍ sí va en el payload (control)');
    for (const t of textos) {
      assert.ok(!t.includes(r.porque.slice(0, 40)), 'porque filtrado a un resumen');
      assert.ok(!t.includes(r.peso.slice(0, 40)), 'peso filtrado a un resumen');
      if (r.fisiologia) assert.ok(!t.includes(r.fisiologia.pasos[0].slice(0, 40)), 'fisiología filtrada a un resumen');
    }
  });
});

test('razonamiento: los sistemas comunes son el mismo objeto en todas las regiones (se redactan una vez)', () => {
  const ids = ['transversal_endocrino', 'transversal_hematologico'];
  for (const id of ids) {
    const instancias = new Set(Object.values(SYSTEMIC_SCREENING).flatMap(d => d.sistemas.filter(s => s.id === id)));
    assert.ok(instancias.size <= 1, `${id}: ${instancias.size} copias distintas`);
  }
});

Object.assign(state, BASE_STATE);   // deja el modo en completo para lo que venga detrás

// ── Informe narrativo con IA (lib/informe-narrativo.js, informe-ia.js) ───────
console.log('\ninforme narrativo (standalone)');
const IN = await import('../lib/informe-narrativo.js');

test('prompt: estructura CIF de report, empieza por CONDICIÓN DE SALUD y cierra en SEGUIMIENTO FUNCIONAL', () => {
  withState({}, () => {
    const p = IN.buildNarrativePrompt(buildPhysiQPayload(), { conAudio: true });
    for (const sec of ['## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES', '## HISTORIA CLÍNICA Y EVOLUCIÓN',
      '## EVALUACIÓN DE FUNCIONES Y ESTRUCTURAS CORPORALES', '## CONCLUSIONES Y PLAN DE TRATAMIENTO', '## SEGUIMIENTO FUNCIONAL']) {
      assert.ok(p.includes(sec), `falta ${sec}`);
    }
    assert.ok(p.includes('{{TRANSCRIPT}}'), 'el worker necesita el hueco {{TRANSCRIPT}}');
    assert.ok(p.includes(`${IN.PALABRAS_INFORME} palabras`), 'presupuesto de extensión fijo');
    assert.ok(!p.includes('cabecera del documento'), 'aquí no hay cabecera: la identificación va aparte');
  });
});

test('prompt: lleva los datos de la valoración y las hipótesis (con sus subsecciones)', () => {
  withState({}, () => {
    const d = buildPhysiQPayload();
    const p = IN.buildNarrativePrompt(d, { conAudio: true });
    assert.ok(p.includes('DATOS DE VALORACIÓN ESTRUCTURADA'));
    assert.ok(p.includes('Dolor hombro derecho'), 'motivo de consulta');
    assert.ok(p.includes(d.h[0].name), 'hipótesis activa');
    assert.ok(p.includes('### Coherencia con hipótesis de valoración'));
  });
  withState({ activeHypotheses: [] }, () => {
    const p = IN.buildNarrativePrompt(buildPhysiQPayload(), { conAudio: true });
    assert.ok(!p.includes('### Coherencia con hipótesis de valoración'), 'sin hipótesis, sin esa subsección');
  });
});

test('prompt: sin audio pide redactar solo con los datos, y nunca inventar', () => {
  withState({}, () => {
    const sin = IN.buildNarrativePrompt(buildPhysiQPayload(), { conAudio: false });
    const con = IN.buildNarrativePrompt(buildPhysiQPayload(), { conAudio: true });
    assert.ok(sin.includes('No hay transcripción de la sesión'));
    assert.ok(!con.includes('No hay transcripción de la sesión'));
    assert.ok(sin.includes('No inventes') && con.includes('No inventes'));
  });
});

test('prompt: derivaciones, formulario previo, signos vitales y modo breve entran en el bloque de datos', () => {
  const d = { p: 'X', r: 'lumbar', d: '01/01/2026', h: [], br: [], sq: [], pn: {},
    ur: ['Cauda equina: derivar hoy'], dv: ['Claudicación vascular'],
    sv: { fc: 80, fr: null, spo2: 97, tas: 130, tad: 85 }, an: { talla: 170, peso: 70, imc: 24.2 },
    fp: [{ s: 'General', q: 'Cómo empezó', a: '«Al levantar una caja»' }], md: 'breve', pe: ['Tests sin hacer'] };
  const c = IN.contextoValoracion(d);
  for (const t of ['DERIVACIÓN URGENTE', 'Cauda equina', 'Claudicación vascular', 'FC 80 lpm', 'TA 130/85', 'IMC 24.2',
    'Al levantar una caja', 'inicial breve', 'Tests sin hacer']) assert.ok(c.includes(t), `falta «${t}»`);
  const vacio = IN.contextoValoracion({ h: [], br: [], sq: [], pn: {} });
  assert.ok(!vacio.includes('DERIVACIÓN') && !vacio.includes('Signos vitales') && !vacio.includes('Formulario previo'),
    'sin datos, sin bloques vacíos');
});

test('pista de Whisper por región, con default para lo desconocido', () => {
  assert.ok(IN.getWhisperPrompt('lumbar').includes('Columna lumbar'));
  assert.ok(IN.getWhisperPrompt('tobillo_pie').includes('Tobillo y pie'));
  assert.ok(IN.getWhisperPrompt('').startsWith('Fisioterapia musculoesquelética'));
  assert.ok(IN.getWhisperPrompt('inexistente').startsWith('Fisioterapia musculoesquelética'));
});

test('SSE: eventos completos, resto sin cerrar, bloques rotos ignorados', () => {
  const buf = 'event: transcript\ndata: {"text":"hola"}\n\nevent: report_chunk\ndata: {"text":"## A"}\n\nevent: basura\ndata: {no json}\n\nevent: report_chunk\ndata: {"te';
  const { eventos, resto } = IN.parseSSEBuffer(buf);
  assert.deepEqual(eventos.map(e => e.type), ['transcript', 'report_chunk']);
  assert.equal(eventos[0].data.text, 'hola');
  assert.ok(resto.startsWith('event: report_chunk'));
  assert.deepEqual(IN.parseSSEBlock('event: done\ndata: {"success":true}'), { type: 'done', data: { success: true } });
});

test('truncado: falta la última sección o acaba a mitad de frase', () => {
  assert.equal(IN.informeTruncado('## A\nTexto.\n## SEGUIMIENTO FUNCIONAL\nPendiente de reevaluaciones programadas.'), false);
  assert.equal(IN.informeTruncado('## A\nTexto.'), true);
  assert.equal(IN.informeTruncado('## SEGUIMIENTO FUNCIONAL\nPendiente de reev'), true);
  assert.equal(IN.informeTruncado(''), true);
});

const MD = `## CONDICIÓN DE SALUD
Párrafo con **negrita** y <script>x</script>.

### Factores Personales
Texto.

| Articulación | Rango |
|---|---|
| Hombro | 120° |
`;

test('markdown → texto: títulos en mayúsculas, tablas sin separador, sin **', () => {
  const t = IN.markdownATexto(MD);
  assert.ok(t.startsWith('CONDICIÓN DE SALUD\n'));
  assert.ok(t.includes('Párrafo con negrita'));
  assert.ok(!t.includes('**') && !t.includes('##') && !t.includes('---'));
  assert.ok(t.includes('Articulación | Rango') && t.includes('Hombro | 120°'));
});

test('markdown → HTML: escapa, títulos y tabla con cabecera', () => {
  const h = IN.markdownAHtml(MD);
  assert.ok(!h.includes('<script>') && h.includes('&lt;script&gt;'), 'el texto del modelo se escapa');
  assert.ok(h.includes('<h3>CONDICIÓN DE SALUD</h3>') && h.includes('<h4>Factores Personales</h4>'));
  assert.ok(h.includes('<th>Articulación</th>') && h.includes('<td>120°</td>'));
});

test('texto para compartir: identificación local + informe + pie, sin markdown', () => {
  const t = IN.textoParaCompartir(MD, { p: 'Ana Ruiz', d: '05/10/2026', r: 'tobillo_pie' }, r => r === 'tobillo_pie' ? 'Tobillo y pie' : r);
  assert.ok(t.startsWith('INFORME DE FISIOTERAPIA\nPaciente: Ana Ruiz\nFecha: 05/10/2026\nRegión valorada: Tobillo y pie'));
  assert.ok(t.includes('CONDICIÓN DE SALUD') && t.includes('redacción asistida por IA'));
  assert.ok(!t.includes('##'));
});

test('huella: cambia con la valoración, no con la fecha', () => {
  withState({}, () => {
    const a = buildPhysiQPayload();
    assert.equal(IN.huellaPayload(a), IN.huellaPayload({ ...a, d: '31/12/2099' }));
    assert.notEqual(IN.huellaPayload(a), IN.huellaPayload({ ...a, nr: a.nr + 1 }));
  });
});

test('errores de los servicios en español, con el original y la salida sin audio', () => {
  const casos = [
    ['Whisper: Your account is not active, please check your billing details on our website.', /OpenAI \(transcripción\).*no tiene saldo/, 'whisper'],
    ['Claude: Your credit balance is too low to access the Anthropic API.', /Anthropic \(redacción\).*no tiene saldo/, 'claude'],
    ['Whisper: Incorrect API key provided: sk-abc', /clave de OpenAI.*no es válida/, 'whisper'],
    ['Claude: Overloaded', /saturado/, 'claude'],
    ['Whisper: Invalid file format. Supported formats: [flac, m4a]', /audio no se ha podido procesar/, 'whisper'],
    ['Claude: Internal server error', /no responde ahora mismo/, 'claude'],
    ['Claude: something unexpected', /^No se ha podido redactar el informe \(Anthropic\)\.$/, 'claude'],
    ['Whisper: something unexpected', /^No se ha podido transcribir el audio \(OpenAI\)\.$/, 'whisper'],
  ];
  for (const [msg, re, servicio] of casos) {
    const e = IN.errorLegible(msg);
    assert.match(e.texto, re, msg);
    assert.equal(e.servicio, servicio);
    assert.equal(e.original, msg, 'el original se conserva');
    assert.equal(e.sinAudio, servicio === 'whisper', 'solo un fallo de transcripción sugiere generar sin audio');
  }
  // Un error de formato de Claude no es «audio no válido»
  assert.doesNotMatch(IN.errorLegible('Claude: invalid request format').texto, /audio/);
  // Los mensajes propios (ya en español, sin servicio delante) pasan tal cual
  const propio = IN.errorLegible('La verificación de seguridad ha fallado.');
  assert.equal(propio.texto, 'La verificación de seguridad ha fallado.');
  assert.equal(propio.servicio, null);
  assert.equal(propio.original, '');
});

test('extensión del audio según el tipo MIME', () => {
  assert.equal(IN.extensionAudio('audio/webm;codecs=opus'), 'webm');
  assert.equal(IN.extensionAudio('audio/mp4'), 'm4a');
  assert.equal(IN.extensionAudio('audio/mpeg'), 'mp3');
  assert.equal(IN.extensionAudio(''), 'webm');
});

test('informeIA nunca entra en el payload, 📋 Notas ni 📄 Informe', () => {
  withState({ informeIA: { texto: 'TEXTO-IA-CENTINELA', transcripcion: 'TRANSCRIPCION-CENTINELA', huella: 'x' } }, () => {
    const textos = [JSON.stringify(buildPhysiQPayload()), buildContextSummaryText(), buildInformeFisioterapiaText()];
    for (const t of textos) assert.ok(!t.includes('CENTINELA'), 'el informe narrativo se filtró a un resumen');
  });
  state.informeIA = null;
});

test('app.js solo carga informe-ia.js fuera del hub', () => {
  const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'app.js'), 'utf8');
  const montar = src.slice(src.indexOf('function _montarInformeIA'), src.indexOf('function _montarInformeIA') + 300);
  assert.ok(/if \(_enHub\(\)\) return;/.test(montar), '_montarInformeIA debe salir antes de importar dentro del hub');
  assert.ok(!/^import .*informe-ia/m.test(src), 'nunca import estático de informe-ia.js');
});

test('deploy-to-hub copia los archivos del informe narrativo', () => {
  const wf = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', '.github/workflows/deploy-to-hub.yml'), 'utf8');
  for (const f of ['informe-ia.js', 'grabadora.js', 'lib/informe-narrativo.js', 'lib/audio-store.js', 'lib/licencia-ia.js']) assert.ok(wf.includes(f), `falta ${f}`);
});

test('grabadora: app.js solo la carga fuera del hub', () => {
  const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'app.js'), 'utf8');
  const ini = src.slice(src.indexOf('function _iniciarGrabadora'), src.indexOf('function _iniciarGrabadora') + 200);
  assert.ok(/if \(_enHub\(\)\) return;/.test(ini), '_iniciarGrabadora debe salir antes de importar dentro del hub');
  assert.ok(!/^import .*grabadora/m.test(src), 'nunca import estático de grabadora.js');
});

test('grabadora: un reinicio llegado de otra pestaña no descarta el audio de este dispositivo', () => {
  const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'app.js'), 'utf8');
  const cuerpo = nombre => {
    const i = src.indexOf(`function ${nombre}(`);
    return src.slice(i, src.indexOf('\n}\n', i)).replace(/\/\/.*$/gm, '');   // sin comentarios
  };
  assert.ok(!/descartarTodo|_descartarAudioSesion/.test(cuerpo('_softResetApp')), '_softResetApp no puede tocar el audio (también corre por SESSION_RESET/SESSION_CLEAR remotos)');
  assert.ok(/_descartarAudioSesion\(\)/.test(cuerpo('resetApp')), 'reiniciar valoración (confirmado aquí) sí lo descarta');
  assert.ok(/_avisoAudioSesion\(\)/.test(cuerpo('resetApp')), 'y lo avisa en la confirmación');
  const borrar = src.slice(src.indexOf("} else if (st === 'delete') {"), src.indexOf("} else if (st === 'delete') {") + 1500);
  assert.ok(/_avisoAudioSesion\(\)/.test(borrar) && /_descartarAudioSesion\(\)/.test(borrar), 'borrar sesión: avisa y descarta');
});

// ── Licencia: motivo legible cuando /validate no responde (lib/licencia-ia.js) ─
console.log('\nlicencia del informe narrativo (motivo del error)');
{
  const L = await import('../lib/licencia-ia.js');
  const fetchReal = globalThis.fetch;
  const respuesta = (status, cuerpo = {}) => ({ ok: status >= 200 && status < 300, status,
    headers: { get: () => null }, json: async () => cuerpo });
  // fetch con CORS (primera llamada) y sin CORS (la sonda no-cors), por separado
  const caso = async (conCors, sinCors) => {
    globalThis.fetch = async (_url, opts = {}) => (opts.mode === 'no-cors' ? sinCors() : conCors());
    const estado = await L.comprobarLicencia(true);
    return { estado, motivo: L.detalleLicencia() };
  };
  const fallo = () => { throw new TypeError('Failed to fetch'); };
  const pruebas = [
    ['worker alcanzable pero sin respuesta legible → error del servidor', fallo, async () => ({ type: 'opaque' }), 'error-red', /responde, pero con un error/],
    ['ni siquiera la sonda llega → bloqueado o sin conexión', fallo, fallo, 'error-red', /bloqueador de anuncios/],
    ['429 → límite, no «sin licencia»', async () => respuesta(429), fallo, 'error-red', /Demasiadas comprobaciones/],
    ['500 legible → error con su código', async () => respuesta(500), fallo, 'error-red', /error \(500\)/],
  ];
  const resultados = [];
  for (const [nombre, conCors, sinCors, estado, motivo] of pruebas) resultados.push([nombre, await caso(conCors, sinCors), estado, motivo]);
  const real = await caso(async () => respuesta(200, { routes: { report: 'real' } }), fallo);
  globalThis.fetch = fetchReal;
  for (const [nombre, r, estado, motivo] of resultados) {
    test(`licencia: ${nombre}`, () => {
      assert.equal(r.estado, estado);
      assert.match(r.motivo, motivo);
    });
  }
  test('licencia: con respuesta válida el estado es el del worker', () => assert.equal(real.estado, 'real'));
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
