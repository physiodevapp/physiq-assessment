'use strict';
import assert from 'node:assert/strict';

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

// `window` IS `globalThis`: modules do `window.x = y` (or `Object.assign(window, {...})`)
// to expose things for inline onclick/oninput attributes — aliasing window to
// globalThis means those assignments land as real globals here too, so this file
// can just `await import(...)` the real source files and read their exports back.
globalThis.window = globalThis;
globalThis.innerWidth = 1024;
globalThis.addEventListener = () => {};
globalThis.scrollTo = () => {};
globalThis.location = { search: '', href: '' };
globalThis.history = { replaceState() {}, pushState() {}, go() {} };
globalThis.btoa = s => Buffer.from(s, 'binary').toString('base64');
globalThis.BroadcastChannel = class { constructor() {} postMessage() {} set onmessage(_) {} };
globalThis.document = {
  addEventListener:  () => {},
  getElementById:    () => makeEl(),
  querySelector:     () => makeEl(),
  querySelectorAll:  () => [],
  createElement:     () => makeEl(),
  body:              { appendChild: () => {}, style: {}, classList: { add() {}, remove() {}, contains: () => false } },
};
// Node defines a read-only global `navigator`; override it with a configurable one.
Object.defineProperty(globalThis, 'navigator', {
  value: { serviceWorker: { register: () => Promise.resolve() }, clipboard: { writeText: () => Promise.resolve() } },
  writable: true,
  configurable: true,
});
globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };

// Real ES modules, loaded only after the shims above are in place — app.js,
// phase4.js and phase4b.js touch `document`/`window` at module top level
// (e.g. app.js's _initHubIntegration() call).
const { HYPOTHESES, SYSTEMIC_SCREENING } = await import('../data.js');
const { calcLRScore } = await import('../phase4b.js');
const { buildPhysiQPayload, getSistemicoAffirmativeTexts } = await import('../app.js');
const { state } = await import('../state.js');

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

test('lr_pos null → fallback 1.5', () => {
  const hyp = { tests: [{ lr_pos: null, lr_neg: null }] };
  const res = { 0: 'pos' };
  const r = calcLRScore(hyp, res);
  assert.ok(Math.abs(r.totalLR - 1.5) < 0.001);
});

test('lr_neg null → fallback 0.5', () => {
  const hyp = { tests: [{ lr_pos: null, lr_neg: null }] };
  const res = { 0: 'neg' };
  const r = calcLRScore(hyp, res);
  assert.ok(Math.abs(r.totalLR - 0.5) < 0.001);
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

test('one positive no LR values (default 1.5) → Peso moderado', () => {
  const hyp = { tests: [{ lr_pos: null }] };
  const res = { 0: 'pos' };
  const r = calcLRScore(hyp, res);
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

test('all 50 hypotheses present', () => {
  assert.equal(Object.keys(HYPOTHESES).length, 50);
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

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
