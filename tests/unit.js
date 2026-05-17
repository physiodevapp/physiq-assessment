'use strict';
const assert = require('assert').strict;
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ── DOM shim ─────────────────────────────────────────────────────────────────
function makeEl() {
  return {
    className: '', textContent: '', innerHTML: '', id: '',
    style: { cssText: '' },
    classList: { contains: () => false, add() {}, remove() {}, toggle() {} },
    querySelectorAll: () => [],
    querySelector:    () => null,
    closest:          () => null,
    addEventListener: () => {},
    getAttribute:     () => null,
    setAttribute:     () => {},
    remove:           () => {},
    appendChild:      () => {},
  };
}

const sandbox = vm.createContext({
  console,
  setTimeout,
  clearTimeout,
  btoa: s => Buffer.from(s, 'binary').toString('base64'),
  window: { innerWidth: 1024, addEventListener: () => {}, location: { href: '' } },
  document: {
    addEventListener:  () => {},
    getElementById:    () => makeEl(),
    querySelector:     () => makeEl(),
    querySelectorAll:  () => [],
    createElement:     () => makeEl(),
    body:              { appendChild: () => {} },
  },
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  IntersectionObserver: class { observe() {} unobserve() {} },
});

vm.runInContext(fs.readFileSync(path.join(ROOT, 'data.js'),  'utf-8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'app.js'),   'utf-8'), sandbox);

const run = code => vm.runInContext(code, sandbox);

// ── Test runner ───────────────────────────────────────────────────────────────
let passed = 0, failed = 0;
function test(name, fn) {
  try   { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.error(`  ✗ ${name}\n    ${e.message}`); failed++; }
}

// ── calcLRScore ───────────────────────────────────────────────────────────────
console.log('\ncalcLRScore');

test('all nd → Sin evaluar, totalLR=1', () => {
  sandbox.__hyp__  = { tests: [{ lr_pos: '3.7', lr_neg: '0.36' }, { lr_pos: '1.5', lr_neg: '0.5' }] };
  sandbox.__res__  = { 0: 'nd', 1: 'nd' };
  const r = run('calcLRScore(__hyp__, __res__)');
  assert.equal(r.label,      'Sin evaluar');
  assert.equal(r.colorClass, 'hyp-orange');
  assert.equal(r.totalLR,    1.0);
  assert.equal(r.evaluatedCount, 0);
});

test('one positive LR 3.7 → Peso moderado, hyp-orange', () => {
  sandbox.__hyp__ = { tests: [{ lr_pos: '3.7', lr_neg: '0.36' }] };
  sandbox.__res__ = { 0: 'pos' };
  const r = run('calcLRScore(__hyp__, __res__)');
  assert.equal(r.colorClass, 'hyp-orange');
  assert.ok(r.label.includes('Peso moderado'), `got: ${r.label}`);
  assert.ok(Math.abs(r.totalLR - 3.7) < 0.001);
});

test('one positive LR >= 5 → Peso alto, hyp-green', () => {
  sandbox.__hyp__ = { tests: [{ lr_pos: '6.0', lr_neg: '0.2' }] };
  sandbox.__res__ = { 0: 'pos' };
  const r = run('calcLRScore(__hyp__, __res__)');
  assert.equal(r.colorClass, 'hyp-green');
  assert.ok(r.label.includes('Peso alto'), `got: ${r.label}`);
});

test('one negative LR_neg 0.2 → Peso bajo, hyp-red', () => {
  sandbox.__hyp__ = { tests: [{ lr_pos: '3.7', lr_neg: '0.2' }] };
  sandbox.__res__ = { 0: 'neg' };
  const r = run('calcLRScore(__hyp__, __res__)');
  assert.equal(r.colorClass, 'hyp-red');
  assert.ok(r.label.includes('Peso bajo'), `got: ${r.label}`);
  assert.ok(Math.abs(r.totalLR - 0.2) < 0.001);
});

test('lr_pos null → fallback 1.5', () => {
  sandbox.__hyp__ = { tests: [{ lr_pos: null, lr_neg: null }] };
  sandbox.__res__ = { 0: 'pos' };
  const r = run('calcLRScore(__hyp__, __res__)');
  assert.ok(Math.abs(r.totalLR - 1.5) < 0.001);
});

test('lr_neg null → fallback 0.5', () => {
  sandbox.__hyp__ = { tests: [{ lr_pos: null, lr_neg: null }] };
  sandbox.__res__ = { 0: 'neg' };
  const r = run('calcLRScore(__hyp__, __res__)');
  assert.ok(Math.abs(r.totalLR - 0.5) < 0.001);
});

test('hasHighLR: pos LR=5 × neg LR=0.1 = 0.5 but still hyp-green', () => {
  sandbox.__hyp__ = { tests: [{ lr_pos: '5.0', lr_neg: null }, { lr_pos: null, lr_neg: '0.1' }] };
  sandbox.__res__ = { 0: 'pos', 1: 'neg' };
  const r = run('calcLRScore(__hyp__, __res__)');
  assert.ok(Math.abs(r.totalLR - 0.5) < 0.001);
  assert.equal(r.colorClass, 'hyp-green');
});

test('LR chain 3.7 × 2.6 → product correct and hyp-green', () => {
  sandbox.__hyp__ = { tests: [{ lr_pos: '3.7' }, { lr_pos: '2.6' }] };
  sandbox.__res__ = { 0: 'pos', 1: 'pos' };
  const r = run('calcLRScore(__hyp__, __res__)');
  assert.ok(Math.abs(r.totalLR - 3.7 * 2.6) < 0.001);
  assert.equal(r.colorClass, 'hyp-green');
});

test('one positive no LR values (default 1.5) → Peso moderado', () => {
  sandbox.__hyp__ = { tests: [{ lr_pos: null }] };
  sandbox.__res__ = { 0: 'pos' };
  const r = run('calcLRScore(__hyp__, __res__)');
  assert.equal(r.colorClass, 'hyp-orange');
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
  run(`Object.assign(state, ${JSON.stringify({ ...BASE_STATE, ...patch })})`);
  fn();
}

const REQUIRED_FIELDS = ['p', 'r', 'd', 'mo', 'me', 'cr', 'rp', 'nr', 'ir', 'na', 'si', 'br', 'sq', 'h', 'pn'];

test('all required fields present', () => {
  withState({}, () => {
    const p = run('buildPhysiQPayload()');
    for (const key of REQUIRED_FIELDS) {
      assert.ok(key in p, `missing field: ${key}`);
    }
  });
});

test('patient null → p = ""', () => {
  withState({ patient: null }, () => {
    assert.equal(run('buildPhysiQPayload().p'), '');
  });
});

test('severidad null → nr = 0', () => {
  withState({ severidad: null }, () => {
    assert.equal(run('buildPhysiQPayload().nr'), 0);
  });
});

test('banderasRojas all NO → br = []', () => {
  withState({ banderasRojas: { br1: 'NO', br2: 'NO', br3: 'NO', br4: 'NO' } }, () => {
    const br = run('buildPhysiQPayload().br');
    assert.equal(br.length, 0);
  });
});

test('banderasRojas br1+br3 SI → correct labels in br', () => {
  withState({ banderasRojas: { br1: 'SI', br2: 'NO', br3: 'SI', br4: 'NO' } }, () => {
    const br = run('buildPhysiQPayload().br');
    assert.equal(br.length, 2);
    assert.ok(br.includes('Sudor nocturno / Pérdida de peso inexplicada'));
    assert.ok(br.includes('Déficit neurológico progresivo'));
  });
});

test('hypothesis mapped with id, name, sc, lr, tr', () => {
  withState({}, () => {
    const h = run('buildPhysiQPayload().h');
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
    const [hyp] = run('buildPhysiQPayload().h');
    assert.equal(hyp.sc, 'Sin evaluar');
    assert.equal(hyp.lr, null);
  });
});

test('payload is JSON-serializable (no undefined)', () => {
  withState({}, () => {
    const p = run('buildPhysiQPayload()');
    assert.doesNotThrow(() => JSON.stringify(p));
    assert.ok(!JSON.stringify(p).includes('"undefined"'));
  });
});

test('base64 payload size < 4096 chars', () => {
  withState({}, () => {
    const size = run(`
      btoa(unescape(encodeURIComponent(JSON.stringify(buildPhysiQPayload())))).length
    `);
    assert.ok(size < 4096, `payload too large: ${size} chars`);
  });
});

// ── getSistemicoAffirmativeTexts ──────────────────────────────────────────────
console.log('\ngetSistemicoAffirmativeTexts');

test('empty answers → []', () => {
  withState({ sistemicoAnswers: {}, region: 'hombro' }, () => {
    assert.equal(run('getSistemicoAffirmativeTexts().length'), 0);
  });
});

test('region not set → []', () => {
  withState({ sistemicoAnswers: { 'hombro_cancer_q1': 'SI' }, region: '' }, () => {
    assert.equal(run('getSistemicoAffirmativeTexts().length'), 0);
  });
});

test('affirmative answer for known region returns non-empty array', () => {
  // Find a real question id from the hombro screening data
  const firstQid = run(`
    (() => {
      const sis = SYSTEMIC_SCREENING['hombro'];
      if (!sis || !sis.sistemas || !sis.sistemas[0].preguntas) return null;
      return sis.sistemas[0].preguntas[0].id;
    })()
  `);
  if (firstQid) {
    withState({ sistemicoAnswers: { [firstQid]: 'SI' }, region: 'hombro' }, () => {
      const texts = run('getSistemicoAffirmativeTexts()');
      assert.ok(Array.isArray(texts));
      assert.ok(texts.length > 0, 'expected at least one text for SI answer');
    });
  }
});

// ── data.js integrity: HYPOTHESES ────────────────────────────────────────────
console.log('\nHYPOTHESES data integrity');

const VALID_REGIONS = ['hombro', 'cadera', 'cervical', 'lumbar', 'rodilla', 'codo'];

test('all 50 hypotheses present', () => {
  const count = run('Object.keys(HYPOTHESES).length');
  assert.equal(count, 50);
});

test('every hypothesis has id, region, name, tests', () => {
  const missing = run(`
    JSON.stringify(
      Object.entries(HYPOTHESES)
        .filter(([, h]) => !h.id || !h.region || !h.name || !Array.isArray(h.tests))
        .map(([k]) => k)
    )
  `);
  assert.deepEqual(JSON.parse(missing), []);
});

test('every hypothesis id matches its key', () => {
  const mismatched = run(`
    JSON.stringify(
      Object.entries(HYPOTHESES)
        .filter(([k, h]) => h.id !== k)
        .map(([k, h]) => k + ' → id:' + h.id)
    )
  `);
  assert.deepEqual(JSON.parse(mismatched), []);
});

test('every hypothesis has a valid region', () => {
  const invalid = run(`
    JSON.stringify(
      Object.entries(HYPOTHESES)
        .filter(([, h]) => !${JSON.stringify(VALID_REGIONS)}.includes(h.region))
        .map(([k, h]) => k + ':' + h.region)
    )
  `);
  assert.deepEqual(JSON.parse(invalid), []);
});

test('no hypothesis has empty tests array', () => {
  const empty = run(`
    JSON.stringify(
      Object.entries(HYPOTHESES)
        .filter(([, h]) => !h.tests || h.tests.length === 0)
        .map(([k]) => k)
    )
  `);
  assert.deepEqual(JSON.parse(empty), []);
});

test('all tests have a name', () => {
  const missing = run(`
    JSON.stringify(
      Object.entries(HYPOTHESES).flatMap(([id, h]) =>
        h.tests
          .map((t, i) => ({ id, i, name: t.name }))
          .filter(({ name }) => !name)
          .map(({ id, i }) => id + '[' + i + ']')
      )
    )
  `);
  assert.deepEqual(JSON.parse(missing), []);
});

test('all lr_pos values are null or numeric string', () => {
  const invalid = run(`
    JSON.stringify(
      Object.entries(HYPOTHESES).flatMap(([id, h]) =>
        h.tests
          .map((t, i) => ({ id, i, v: t.lr_pos }))
          .filter(({ v }) => v !== null && v !== undefined && isNaN(parseFloat(v)))
          .map(({ id, i, v }) => id + '[' + i + '].lr_pos=' + v)
      )
    )
  `);
  assert.deepEqual(JSON.parse(invalid), [], 'non-numeric lr_pos values found');
});

test('all lr_neg values are null or numeric string', () => {
  const invalid = run(`
    JSON.stringify(
      Object.entries(HYPOTHESES).flatMap(([id, h]) =>
        h.tests
          .map((t, i) => ({ id, i, v: t.lr_neg }))
          .filter(({ v }) => v !== null && v !== undefined && isNaN(parseFloat(v)))
          .map(({ id, i, v }) => id + '[' + i + '].lr_neg=' + v)
      )
    )
  `);
  assert.deepEqual(JSON.parse(invalid), [], 'non-numeric lr_neg values found');
});

test('calcLRScore does not return NaN for any hypothesis with all-pos results', () => {
  const nanHyps = run(`
    JSON.stringify(
      Object.entries(HYPOTHESES)
        .filter(([, h]) => {
          const fakeResults = Object.fromEntries(h.tests.map((_, i) => [i, 'pos']));
          const { totalLR } = calcLRScore(h, fakeResults);
          return isNaN(totalLR) || totalLR <= 0;
        })
        .map(([k]) => k)
    )
  `);
  assert.deepEqual(JSON.parse(nanHyps), []);
});

// ── data.js integrity: SYSTEMIC_SCREENING ─────────────────────────────────────
console.log('\nSYSTEMIC_SCREENING data integrity');

test('all 6 regions present', () => {
  for (const r of VALID_REGIONS) {
    const exists = run(`typeof SYSTEMIC_SCREENING[${JSON.stringify(r)}] === 'object'`);
    assert.ok(exists, `missing region: ${r}`);
  }
});

test('every region has at least one sistema with at least one pregunta', () => {
  const empty = run(`
    JSON.stringify(
      ${JSON.stringify(VALID_REGIONS)}.filter(r => {
        const data = SYSTEMIC_SCREENING[r];
        if (!data || !Array.isArray(data.sistemas)) return true;
        return !data.sistemas.some(s => s.preguntas && s.preguntas.length > 0);
      })
    )
  `);
  assert.deepEqual(JSON.parse(empty), []);
});

test('all preguntas have id and text', () => {
  const missing = run(`
    JSON.stringify(
      ${JSON.stringify(VALID_REGIONS)}.flatMap(r => {
        const data = SYSTEMIC_SCREENING[r];
        if (!data) return [];
        return data.sistemas.flatMap((s, si) =>
          (s.preguntas || [])
            .filter(q => !q.id || !q.text)
            .map((q, qi) => r + '[' + si + '][' + qi + ']')
        );
      })
    )
  `);
  assert.deepEqual(JSON.parse(missing), []);
});

test('no duplicate pregunta IDs within a region', () => {
  const dupes = run(`
    JSON.stringify(
      ${JSON.stringify(VALID_REGIONS)}.flatMap(r => {
        const data = SYSTEMIC_SCREENING[r];
        if (!data) return [];
        const ids = data.sistemas.flatMap(s => (s.preguntas || []).map(q => q.id));
        const seen = new Set(), dupes = [];
        ids.forEach(id => { if (seen.has(id)) dupes.push(r + ':' + id); seen.add(id); });
        return dupes;
      })
    )
  `);
  assert.deepEqual(JSON.parse(dupes), []);
});

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
