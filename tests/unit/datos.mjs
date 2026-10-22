// Integridad de data/: hipótesis, árboles CIF, referencias, motor de la fase 4, cribado. Se ejecuta desde tests/unit.js.
import { assert, readFileSync, join, TESTS, leer, test, HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, TIEMPOS_TEJIDO,
   calcLRScore, testPuntua, state, rebuildHypotheses, pruneTreeFrom, resolveOptionTargets,
   VALID_REGIONS } from './comun.mjs';

// ── data.js integrity: HYPOTHESES ────────────────────────────────────────────
console.log('\nHYPOTHESES data integrity');

test('all 126 hypotheses present', () => {
  assert.equal(Object.keys(HYPOTHESES).length, 126);
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
    join(TESTS, 'fixtures', 'cif-tree-navigation.json'),
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

const { construirReferencias, recogerCitas, problemasRegistro } = await import('../referencias.mjs');
const { REFERENCIAS } = await import('../../data/referencias.js');
const PLAN_TRATAMIENTO = await import('../../data/plan-tratamiento.js');
const IRRITABILIDAD = await import('../../data/irritabilidad.js');
const { CONDICIONES } = await import('../../data/condiciones.js');
const { FAMILIAS_FARMACO: FARMACOS } = await import('../../data/farmacos.js');
const { BLOQUES_EJERCICIO: EJERCICIO } = await import('../../data/ejercicio.js');
const problemas = problemasRegistro(recogerCitas({ HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, TIEMPOS_TEJIDO, PLAN_TRATAMIENTO, IRRITABILIDAD, CONDICIONES, FARMACOS, EJERCICIO, REFERENCIAS, testPuntua }), REFERENCIAS);

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
  const actual = leer('docs', 'referencias.md');
  const esperado = construirReferencias({ HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, TIEMPOS_TEJIDO, PLAN_TRATAMIENTO, IRRITABILIDAD, CONDICIONES, FARMACOS, EJERCICIO, REFERENCIAS, testPuntua });
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
