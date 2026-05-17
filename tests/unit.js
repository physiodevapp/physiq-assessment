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

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
