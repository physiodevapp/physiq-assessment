'use strict';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import './dom-shim.mjs';

// Real ES modules, loaded only after the shims above are in place — app.js,
// phase4.js and phase4b.js touch `document`/`window` at module top level
// (e.g. app.js's _initHubIntegration() call).
const { HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, DOSIS_DERIVAR } = await import('../data.js');
const { calcLRScore, parseLR, testPuntua, etiquetaHipHTML } = await import('../phase4b.js');
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

test('etiquetaHipHTML: emoji aparte y salto tras «·»', () => {
  const h = etiquetaHipHTML('🟢 Peso alto (LR× 5.9) · 3/3 hallazgos compatibles');
  assert.ok(h.includes('<span class="hyp-etq-icono">🟢</span>'), h);
  assert.ok(h.includes('<span class="hyp-etq-parte">Peso alto (LR× 5.9) ·</span> <span class="hyp-etq-parte">3/3 hallazgos compatibles</span>'), h);
  assert.ok(etiquetaHipHTML('⚪ Sin LR aplicable').includes('<span class="hyp-etq-icono">⚪</span>'));
  const sin = etiquetaHipHTML('Sin evaluar');
  assert.ok(!sin.includes('hyp-etq-icono') && sin.includes('>Sin evaluar<'), sin);
  assert.ok(etiquetaHipHTML('<b>').includes('&lt;b&gt;'));
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
  cirugia:          { intervencion: '', fecha: '', semanasAprox: null, protocolo: '', restricciones: '', complicaciones: [], complicacionOtra: '' },
  derivacionResuelta: {},
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

// NRS sin marcar = «no registrado»: null en el payload (nunca un 0 por
// defecto, que llegaba a los resúmenes como dato) y un 0 marcado sigue siendo 0
const { contextoValoracion: ctxNRS } = await import('../lib/informe-narrativo.js');
test('severidad null → nr = null (no registrado); 0 marcado → 0', () => {
  withState({ severidad: null }, () => {
    const d = buildPhysiQPayload();
    assert.equal(d.nr, null);
    assert.ok('nr' in d, 'el campo sigue en el payload (contrato de physiq-report)');
    assert.ok(buildContextSummaryText().includes('NRS: no registrado'));
    const inf = buildInformeFisioterapiaText();
    assert.ok(!inf.includes('Intensidad del dolor') && !/null|undefined/.test(inf), 'el Informe omite la línea');
    assert.ok(ctxNRS(d).includes('NRS: no registrado'));
  });
  withState({ severidad: 0 }, () => {
    const d = buildPhysiQPayload();
    assert.equal(d.nr, 0);
    assert.ok(buildContextSummaryText().includes('NRS: 0/10'));
    assert.ok(buildInformeFisioterapiaText().includes('Intensidad del dolor referida: 0/10'));
    assert.ok(ctxNRS(d).includes('NRS: 0/10'));
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
  const firstQid = sis?.sistemas?.find(x => !x.soloPosquirurgico)?.preguntas?.[0]?.id || null;   // el posquirúrgico solo se ve con su mecanismo
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
  assert.ok(Math.abs(calcLRScore(h, r).totalLR - 2.13) < 0.001);
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

test('cadera: TVP, torsión testicular, fractura de estrés del cuello femoral y artritis séptica son urgencias (y ninguna otra)', () => {
  const qs = SYSTEMIC_SCREENING.cadera.sistemas.filter(s => !s.soloPosquirurgico).flatMap(s => s.preguntas);   // el posquirúrgico tiene su propio test
  assert.deepEqual(qs.filter(q => q.urgencia).map(q => q.id).sort(), ['ca_in1', 'ca_os1', 'ca_u3', 'ca_v2']);
  // ca_v2 junta TVP y calambres: la urgencia dice que los calambres solos no lo son,
  // y deriva hoy con cualquier Wells (NICE NG158, rec. 1.1.3 y 1.1.8)
  assert.match(qs.find(q => q.id === 'ca_v2').urgencia, /no los calambres solos/);
  assert.match(qs.find(q => q.id === 'ca_v2').urgencia, /1 o menos, dímero D/);
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

test('ca10: el cluster de Laslett puntúa con Saueressig 2021; thigh thrust y compresión solos no puntúan (Han 2023)', () => {
  const h = HYPOTHESES.ca10, iTt = h.tests.findIndex(t => t.name === 'Thigh thrust'),
    iCo = h.tests.findIndex(t => t.name === 'Test de Compresión Pélvica'),
    iCl = h.tests.findIndex(t => t.name.startsWith('Cluster de Laslett'));
  [iTt, iCo].forEach(i => {
    assert.equal(testPuntua(h, h.tests[i]), false, h.tests[i].name);
    ['pos', 'neg'].forEach(r => assert.equal(calcLRScore(h, { [i]: r }).totalLR, 1));
  });
  assert.ok(Math.abs(calcLRScore(h, { [iCl]: 'pos' }).totalLR - 2.13) < 0.001);
  assert.ok(Math.abs(calcLRScore(h, { [iCl]: 'neg' }).totalLR - 0.33) < 0.001);
  assert.ok(Math.abs(calcLRScore(h, { [iCl]: 'pos', [iCo]: 'pos', [iTt]: 'pos' }).totalLR - 2.13) < 0.001);
});

test('cervical: disección, IVB, fractura tras traumatismo y cefalea de alarma son urgencias', () => {
  const qs = SYSTEMIC_SCREENING.cervical.sistemas.filter(s => !s.soloPosquirurgico).flatMap(s => s.preguntas);   // el posquirúrgico tiene su propio test
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
  const qs = SYSTEMIC_SCREENING.rodilla.sistemas.filter(s => !s.soloPosquirurgico).flatMap(s => s.preguntas);   // el posquirúrgico tiene su propio test
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

test('hombro: urgencias: h_g1 (ectópico) y h_t1 (fractura o luxación); la bisagra reparte congelado, artrosis GH y luxación/fractura', () => {
  const qs = SYSTEMIC_SCREENING.hombro.sistemas.filter(s => !s.soloPosquirurgico).flatMap(s => s.preguntas);   // el posquirúrgico tiene su propio test
  assert.equal(SYSTEMIC_SCREENING.hombro.urgencia, undefined);
  assert.deepEqual(qs.filter(q => q.urgencia).map(q => q.id), ['h_g1', 'h_t1']);
  ['h_t1', 'h_i1', 'h_n1'].forEach(id => assert.ok(qs.find(q => q.id === id), id));
  const steps = CIF_TREES.hombro.steps, s2 = steps.find(s => s.id === 'h_step2');
  assert.deepEqual(s2.options.find(o => o.value === 'si').hypothesis, []);
  assert.deepEqual(steps.find(s => s.id === 'h_step2b').options.map(o => o.hypothesis[0]), ['h11', 'h10', 'h1']);
});

test('hombro: clusters del manguito (Park, Litaker) sin contar dos veces; ningún test de la AC puntúa', () => {
  const h3 = HYPOTHESES.h3, i = n => h3.tests.findIndex(t => t.name.startsWith(n));
  const iA = i('Cluster A, confirmar'), iAd = i('Cluster A, descartar'), iB = i('Cluster B'), iDrop = i('Drop Arm'), iLag = i('External Rotation Lag');
  assert.ok(Math.abs(calcLRScore(h3, { [iA]: 'pos' }).totalLR - 15.57) < 0.001);
  assert.equal(calcLRScore(h3, { [iA]: 'neg' }).totalLR, 1);                     // sin LR−: para eso está «descartar»
  assert.ok(Math.abs(calcLRScore(h3, { [iAd]: 'neg' }).totalLR - 0.16) < 0.001);
  assert.equal(calcLRScore(h3, { [iAd]: 'pos' }).totalLR, 1);
  // El cluster A absorbe drop arm, signo de retraso en RE y cluster B (la debilidad en RE va en los dos)
  assert.ok(Math.abs(calcLRScore(h3, { [iA]: 'pos', [iDrop]: 'pos', [iLag]: 'pos', [iB]: 'pos' }).totalLR - 15.57) < 0.001);
  assert.ok(Math.abs(calcLRScore(h3, { [iB]: 'pos' }).totalLR - 5.0) < 0.001); // validación, no la 9,84 de derivación
  // Retraso en RI: solo el positivo (LR− 0,04 de un estudio de 37 pacientes, no reproducida en otros)
  const iIR = i('Internal Rotation Lag');
  assert.ok(Math.abs(calcLRScore(h3, { [iIR]: 'pos' }).totalLR - 5.6) < 0.001);
  assert.equal(calcLRScore(h3, { [iIR]: 'neg' }).totalLR, 1);
  const h7 = HYPOTHESES.h7;
  // Aducción cruzada (Chronopoulos, casos y controles, frente a Cadogan 2013 en atención primaria: LR+ 0,86),
  // O'Brien (Chronopoulos frente a Walton, contradictorios), palpación y Paxinos (Walton, 10 controles): hallazgos
  ['Test de Aducción Cruzada', 'Compresión activa', 'Palpación directa', 'Test de Paxinos', 'Paxinos + gammagrafía'].forEach(n => {
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
  const qs = SYSTEMIC_SCREENING.tobillo_pie.sistemas.filter(s => !s.soloPosquirurgico).flatMap(s => s.preguntas);   // el posquirúrgico tiene su propio test
  ['tp_t1', 'tp_i1', 'tp_n1'].forEach(id => assert.ok(qs.find(q => q.id === id)?.urgencia, id));
  // TVP: derivar hoy con cualquier Wells (NICE NG158, rec. 1.1.3 y 1.1.8), igual que ca_v2 de cadera
  assert.match(qs.find(q => q.id === 'tp_v2').urgencia, /derivar hoy.*1 o menos, dímero D/);
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
  assert.deepEqual(derivar, ['ce8', 'co12', 'co14', 'co7', 'h11', 'ro11', 'tp17', 'tp3', 'tp30', 'tp35', 'tp37', 'tp4', 'tp5', 'tp6']);
  derivar.forEach(id => assert.ok(!HYPOTHESES[id].dosisFuente, `${id}: una derivación no lleva fuente de dosis`));
});

// ── Modo breve ────────────────────────────────────────────────────────────────
console.log('\nmodo breve');

const LUMBAR_SIS = SYSTEMIC_SCREENING.lumbar.sistemas.filter(s => !s.soloPosquirurgico);   // fuera del posquirúrgico no se ve

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
  const muestra = preguntasConRazon.find(p => p.region !== 'comun' && SYSTEMIC_SCREENING[p.region] && !p.sis.soloPosquirurgico);
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

test('conexión cortada al generar: pantalla apagada / segundo plano, no un error de la API', () => {
  const red = m => Object.assign(new TypeError(m), {});
  // Los textos reales de iOS, Chrome y Firefox
  for (const m of ['Load failed', 'Failed to fetch', 'network error', 'NetworkError when attempting to fetch resource.', 'The network connection was lost.']) {
    const e = IN.errorConexion(red(m), { seOculto: true });
    assert.equal(e?.texto, IN.TEXTO_CONEXION_SEGUNDO_PLANO, m);
    assert.equal(e.original, m);
    assert.equal(e.sinAudio, false);
  }
  assert.equal(IN.errorConexion(red('Failed to fetch')).texto, IN.TEXTO_CONEXION_PERDIDA);
  // No son cortes: errores de la API (Error, aunque hablen de conexión) y fallos de código
  assert.equal(IN.errorConexion(new Error('Claude: connection reset by peer'), { seOculto: true }), null);
  assert.equal(IN.errorConexion(new Error('Error del servidor (500)'), { seOculto: true }), null);
  assert.equal(IN.errorConexion(new TypeError("Cannot read properties of undefined (reading 'text')"), { seOculto: true }), null);
  assert.equal(IN.errorConexion(null), null);
});

test('fase 5: cabecera de hipótesis en dos filas (nombre; etiqueta debajo) y un solo 🏥 en el postoperatorio', () => {
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.equal((app.match(/_cabeceraHipHTML\(/g) || []).length, 3, 'definición + tarjeta normal + postoperatorio');
  assert.match(app, /_cabeceraHipHTML\(color, '', `🏥 \$\{_escHTML\(hyp\.name\)\}`, ETIQUETA_HIP_POSQ\.replace\(\/\^🏥\\s\*\/, ''\)/);
  const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.hyp5-cab \{ display: flex; align-items: flex-start;/, 'el punto se alinea con la primera línea');
});

test('borrar sesión usa el diálogo común y, si se cancela, vuelve al panel de sesión', () => {
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const f = app.slice(app.indexOf('function promptClearSession'), app.indexOf('function _borrarSesion'));
  assert.match(f, /closeSessionPanel\(\);[\s\S]*showConfirmBanner\('Borrar sesión',[\s\S]*'Borrar sesión', _borrarSesion,/);
  assert.match(f, /onCancel: \(\) => \{ if \(panelAbierto\) toggleSessionPanel\(\); \}/);
  assert.match(f, /_escHTML\(nombre\)/, 'el nombre del paciente se escapa');
  assert.doesNotMatch(app, /st === 'delete'/, 'el panel ya no pinta su propia confirmación');
  assert.match(app, /#sessionPanelClear'\)\.onclick = promptClearSession;/);
  // El campo del nombre sigue en el DOM: se vacía, o saveSession() lo devolvería al estado
  const borrar = app.slice(app.indexOf('function _borrarSesion'), app.indexOf('function _borrarSesion') + 800);
  assert.match(borrar, /state\.patient = '';[\s\S]*getElementById\('patientName'\)[\s\S]*campo\.value = '';/);
});

test('diálogos: el velo y Escape cierran como el botón de cerrar, nunca hacen la acción', () => {
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const f = app.slice(app.indexOf('function showConfirmBanner'), app.indexOf('// ─── SESSION PANEL'));
  // Velo: solo un toque que empieza y acaba en el velo, y llama a dismiss (no a onConfirm)
  assert.match(f, /pointerdown', e => \{ empiezaEnVelo = e\.target === overlay; \}/);
  assert.match(f, /click', e => \{ if \(e\.target === overlay && empiezaEnVelo\) cancelar\(\); \}/);
  // Escape cierra, y el listener se quita al cerrar o si otro código retira el diálogo
  assert.match(f, /e\.key === 'Escape'\) \{ e\.preventDefault\(\); cancelar\(\); \}/);
  // Cancelar a mano llama a opts.onCancel; el dismiss() devuelto (cierre desde el código) no
  assert.match(f, /const cancelar = \(\) => \{ if \(!overlay\.isConnected\) return; dismiss\(\); opts\.onCancel\?\.\(\); \};/);
  assert.match(f, /getElementById\('confirmCancel'\)\.onclick = cancelar;/);
  assert.match(f, /const dismiss = \(\) => \{\s*document\.removeEventListener\('keydown', alTeclado\);/);
  assert.match(f, /if \(!overlay\.isConnected\) \{ document\.removeEventListener\('keydown', alTeclado\); return; \}/);
  assert.equal((f.match(/onConfirm\(\)/g) || []).length, 1, 'solo el botón de acción confirma');
});

test('cancelar la generación pide confirmación y el diálogo se cierra solo si la generación acaba', () => {
  const src = readFileSync(new URL('../informe-ia.js', import.meta.url), 'utf8');
  const cancelar = src.slice(src.indexOf('function iaCancelar'), src.indexOf('function cancelarGeneracion'));
  assert.match(cancelar, /showConfirmBanner\('Cancelar la generación'[\s\S]*<span class="btn-text-full">Sí, cancelar<\/span><span class="btn-text-short">Cancelar<\/span>',\s*cancelarGeneracion, \{ cancelLabel: 'Seguir' \}\)/);
  assert.doesNotMatch(cancelar, /ctrl\.abort/, 'el botón ya no corta sin confirmar');
  const gen = src.slice(src.indexOf('async function iaGenerar'), src.indexOf('async function leerStream'));
  assert.match(gen, /finally \{[\s\S]*_cerrarDlgCancelar\?\.\(\);/);
  // showConfirmBanner: botón de cerrar configurable y cierre desde fuera idempotente
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(app, /\$\{opts\.cancelLabel \|\| 'Cancelar'\}/);
  assert.match(app, /if \(!overlay\.isConnected\) return;[\s\S]{0,1500}return dismiss;/);
});

test('transcripción sin voz: silencio o texto de relleno de Whisper', () => {
  // Lo que Whisper devuelve con un audio en silencio
  for (const t of ['', '   ', 'Subtítulos realizados por la comunidad de Amara.org',
    'Subtítulos realizados por la comunidad de Amara.org Subtítulos realizados por la comunidad de Amara.org',
    '¡Suscríbete! Gracias por ver el vídeo.', 'Thank you for watching.', 'Hola. Hola. Hola. Hola.',
    'Gracias por ver. Gracias por ver. Gracias por ver.'])
    assert.equal(IN.transcripcionSinVoz(t), true, t);
  // Una consulta real, aunque sea corta o acabe con relleno
  for (const t of ['Me duele la rodilla izquierda desde hace dos meses, sobre todo al correr.',
    'Buenos días, Lucía. Cuéntame qué te pasa. Me duele la rodilla. Subtítulos realizados por la comunidad de Amara.org',
    'Sí. No. Al bajar escaleras me duele por delante.'])
    assert.equal(IN.transcripcionSinVoz(t), false, t);
  assert.match(IN.TEXTO_SIN_VOZ, /micrófono/);
});

test('al generar: una transcripción sin voz corta antes de redactar y conserva el audio', () => {
  const src = readFileSync(new URL('../informe-ia.js', import.meta.url), 'utf8');
  const stream = src.slice(src.indexOf('async function leerStream'), src.indexOf('function iaCancelar'));
  // Solo con audio: sin audio la transcripción vacía es lo esperado
  assert.match(stream, /_gen\.conAudio && transcripcionSinVoz\(_gen\.transcripcion\)\) throw new SinVoz\(\)/);
  const gen = src.slice(src.indexOf('async function iaGenerar'), src.indexOf('async function leerStream'));
  const captura = gen.slice(gen.indexOf('} catch (err) {'), gen.lastIndexOf('} finally {'));
  assert.match(captura, /err instanceof SinVoz[\s\S]*texto: TEXTO_SIN_VOZ[^}]*sinAudio: true/);
  assert.ok(captura.length > 100);
  assert.doesNotMatch(captura, /quitarAudio/);
  // Sale por el catch sin guardar informe; el finally aborta el stream
  assert.match(gen, /finally \{[\s\S]*ctrl\.abort\(\)/);
});

test('grabadora: en el móvil se pausa al pasar a segundo plano y avisa al volver', () => {
  const src = readFileSync(new URL('../grabadora.js', import.meta.url), 'utf8');
  const vis = src.slice(src.indexOf("addEventListener('visibilitychange'"), src.indexOf("addEventListener('beforeunload'"));
  // Oculta: pausa solo grabando, sin pausa previa y sin ratón (móvil); en el ordenador no
  assert.match(vis, /if \(_grab && !_grab\.pausado && !conRaton\(\)\) \{ pausar\(\); _grab\.pausaAuto = true; \}/);
  // Visible: aviso solo si la pausó la app y sigue en pausa
  assert.match(vis, /if \(_grab\?\.pausaAuto\) \{[\s\S]*if \(_grab\.pausado\) showToast\('Grabación en pausa: la app pasó a segundo plano/);
});

const G_SILENCIO = await import('../grabadora.js');
test('grabadora: aviso de silencio solo grabando, antes al empezar que a media consulta', () => {
  const G = G_SILENCIO;
  assert.equal(G.silencioDetectado({ huboSonido: false, msSinSonido: G.SILENCIO_INICIO_MS - 500 }), false);
  assert.equal(G.silencioDetectado({ huboSonido: false, msSinSonido: G.SILENCIO_INICIO_MS }), true);
  assert.equal(G.silencioDetectado({ huboSonido: true, msSinSonido: G.SILENCIO_INICIO_MS }), false);
  assert.equal(G.silencioDetectado({ huboSonido: true, msSinSonido: G.SILENCIO_MS }), true);
  assert.ok(G.SILENCIO_MS > G.SILENCIO_INICIO_MS);
  const src = readFileSync(new URL('../grabadora.js', import.meta.url), 'utf8');
  const medir = src.slice(src.indexOf('function medirNivel'), src.indexOf('export function pausar'));
  assert.match(medir, /g\.pausado \|\| n\.ctx\.state !== 'running'\) return/, 'en pausa o sin medir, nunca avisa');
  assert.match(src, /rec\.onstop = \(\) => \{[\s\S]{0,80}pararNivel\(g\)/, 'el AudioContext se cierra con la grabación');
});

test('al generar: pantalla encendida, aviso visible y corte explicado sin borrar el audio', () => {
  const src = readFileSync(new URL('../informe-ia.js', import.meta.url), 'utf8');
  const gen = src.slice(src.indexOf('async function iaGenerar'), src.indexOf('async function leerStream'));
  assert.match(gen, /pedirWakeLockGen\(\);/);
  assert.match(gen, /finally \{[\s\S]*soltarWakeLockGen\(\);/);
  assert.match(gen, /errorConexion\(err, \{ seOculto: [^}]*\}\) \|\| errorLegible\(err\.message\)/);
  // El audio solo se quita tras guardar el informe, nunca en el catch
  const captura = gen.slice(gen.indexOf('} catch (err) {'), gen.lastIndexOf('} finally {'));
  assert.doesNotMatch(captura, /quitarAudio/);
  assert.match(src, /class="ia-nota-pantalla">Mantén la pantalla encendida/);
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

const IA = await import('../informe-ia.js');

test('datos ampliados: edad, fase 3, árbol, tests, criterios y pauta solo cuando hay datos', () => {
  const a = {
    edad: 52, signoComparable: 'Flexión lumbar', estabilidad: 'Empeorando',
    irritabilidad: { dolor: 'Alto', reposo: 'Sí', movimiento: 'Sí', discapacidad: 'Moderada', tolerancia: 'Baja' },
    psico: [{ q: 'Miedo al movimiento', a: 'Sí' }],
    criterios: [{ etiqueta: 'Dolor lumbar inflamatorio', positivas: 2, total: 4, nota: 'Valorar derivación' }],
    arbol: [{ pregunta: '¿SLR positivo?', respuesta: 'SÍ — SLR <60°' }],
    tests: [{ hipotesis: 'Radiculopatía', items: [{ test: 'Slump', resultado: 'positivo', cluster: 'Cluster de Laslett' }, { test: 'CPR Flynn', resultado: 'negativo', pronostico: true }] }],
    pautas: [{ hipotesis: 'Radiculopatía', derivar: false, pauta: 'Movilidad neural', fuente: 'NICE NG59', pronostico: { horizonte: '6-12 semanas', derivacion: 'Déficit progresivo' }, prom: 'ODI' },
             { hipotesis: 'Fractura', derivar: true, pauta: '', fuente: '', prom: '' }],
  };
  const t = IN.bloquesAmpliados(a).join('\n');
  // El horizonte del pronóstico no se envía: el informe lo convertía en plan (Daniel: ecografía «para valorar líquido…»)
  assert.ok(!t.includes('6-12 semanas') && !/· Pronóstico/.test(t), 'sin la línea «Pronóstico»');
  for (const x of ['Signo comparable', 'Flexión lumbar', 'Empeorando', 'tolerancia al estrés físico Baja', 'Miedo al movimiento → Sí',
    'Dolor lumbar inflamatorio (2/4)', '¿SLR positivo? → SÍ — SLR <60°', 'Slump: positivo (parte del cluster «Cluster de Laslett»)',
    'CPR Flynn: negativo (regla pronóstica', 'Pauta: Movilidad neural', 'Fuente: NICE NG59',
    'Cuándo reconsiderar o derivar (contexto para el fisioterapeuta: no es plan ni explicación al paciente): Déficit progresivo', 'seguimiento: ODI', 'Derivar: sin tratamiento']) assert.ok(t.includes(x), `falta «${x}»`);
  const vacio = { edad: null, signoComparable: '', estabilidad: '', irritabilidad: null, psico: [], criterios: [], arbol: [], tests: [], pautas: [] };
  assert.deepEqual(IN.bloquesAmpliados(vacio), [], 'sin datos, ningún bloque');
  assert.deepEqual(IN.bloquesAmpliados(null), []);
  const c = IN.contextoValoracion({ p: 'X', h: [], br: [], sq: [], pn: {} }, r => r, a);
  assert.match(c, /Edad: 52 años/);
  assert.ok(c.includes('Tests de confirmación realizados'));
  assert.doesNotMatch(IN.contextoValoracion({ p: 'X', h: [], br: [], sq: [], pn: {} }, r => r, vacio), /Edad:/);
});

test('plantillas: narrativo y ficha breve, por defecto según el tipo de consulta', () => {
  assert.equal(IN.plantillaPorDefecto('breve'), 'breve');
  assert.equal(IN.plantillaPorDefecto('completo'), 'narrativo');
  assert.equal(IN.plantillaPorDefecto(undefined), 'narrativo');
  const d = { p: 'X', r: 'lumbar', d: '01/01/2026', h: [], br: [], sq: [], pn: {} };
  const ficha = IN.PLANTILLAS.breve.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  for (const x of ['## PRESENTACIÓN CLÍNICA', '## HALLAZGOS Y CODIFICACIÓN CIF', '## OBJETIVOS Y PLAN', '{{TRANSCRIPT}}'])
    assert.ok(ficha.includes(x), `ficha: falta «${x}»`);
  assert.ok(!ficha.includes('## SEGUIMIENTO FUNCIONAL'));
  const narr = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.ok(narr.includes('## SEGUIMIENTO FUNCIONAL'));
  // Lo no explorado se dice una vez; la pauta de PhysiQ manda en las dos
  for (const p of [ficha, narr]) {
    assert.match(p, /UNA (sola )?vez/i, 'regla de «lo no explorado, una sola vez»');
    assert.match(p, /sin proponer dosis/);
  }
  assert.ok(IN.PLANTILLAS.breve.maxTokens < IN.PLANTILLAS.narrativo.maxTokens);
  assert.equal(IN.informeTruncado('## PRESENTACIÓN CLÍNICA\nA.\n## OBJETIVOS Y PLAN\nReevaluar en dos semanas.', 'breve'), false);
  assert.equal(IN.informeTruncado('## PRESENTACIÓN CLÍNICA\nA.\n## HALLAZGOS Y CODIFICACIÓN CIF\nB.', 'breve'), true);
});

test('prompt: el bloque de datos no lleva puntuaciones, notas del plan vacías ni nombres que inviten a citarlo', () => {
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', br: [], sq: [], dv: ['Sospecha de fractura: derivar'],
    h: [{ name: 'Síndrome subacromial', sc: '🟠 Peso moderado (LR× 2.0) · 2/2 hallazgos compatibles' }],
    pn: { variableControl: '', ventanaRecuperacion: '24 h', anclajeHabito: '  ' } };
  const amp = { edad: 52, signoComparable: '', estabilidad: '', irritabilidad: null, psico: [], criterios: [],
    arbol: [{ pregunta: '¿Traumatismo previo?', respuesta: 'SÍ' }], tests: [], pautas: [] };
  const ctx = IN.contextoValoracion(d, r => r, amp);
  assert.ok(ctx.includes('Síndrome subacromial'));
  for (const x of ['LR×', 'Peso moderado', 'hallazgos compatibles', 'Variable de control', 'Anclaje de hábito', 'árbol', 'Razonamiento clínico', 'Formulario previo'])
    assert.ok(!ctx.includes(x), `sin «${x}»`);
  assert.ok(ctx.includes('Recuperación entre sesiones: 24 h'), 'las notas con texto sí van, con etiqueta neutra');
  assert.ok(!ctx.includes('Ventana de recuperación'), 'sin el nombre del campo');
  assert.ok(ctx.includes('Hallazgos de la exploración'));
  assert.ok(!IN.contextoValoracion({ ...d, pn: {} }, r => r, null).includes('Notas del plan'), 'sin notas, sin bloque');
});

test('prompt: etiquetas internas limpias, IMC redondeado y comprobaciones de «Derivar»', () => {
  assert.equal(IN.limpiarEtiqueta('Luxación Bloqueada o Fractura (→ Rx)'), 'Luxación Bloqueada o Fractura');
  assert.equal(IN.limpiarEtiqueta('SÍ — Traumatismo previo → luxación bloqueada o fractura → Rx'), 'SÍ — Traumatismo previo — orienta a: luxación bloqueada o fractura; Rx');
  assert.equal(IN.limpiarEtiqueta('Gesto testigo (①) y medida objetiva (②)'), 'Gesto testigo y medida objetiva');
  assert.equal(IN.limpiarEtiqueta('Arco doloroso'), 'Arco doloroso');
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', br: [], sq: [], pn: {}, an: { talla: 171.2, peso: 64, imc: 21.83596820683029 },
    h: [{ name: 'Luxación Bloqueada o Fractura (→ Rx)' }] };
  const amp = { edad: null, signoComparable: '', estabilidad: '', irritabilidad: null, psico: [], criterios: [], arbol: [], pautas: [],
    tests: [
      { hipotesis: 'Luxación Bloqueada o Fractura (→ Rx)', derivar: true, items: [{ test: 'Fractura', resultado: 'negativo' }] },
      { hipotesis: 'Síndrome subacromial', items: [{ test: 'Arco doloroso', resultado: 'positivo' }] },
    ] };
  const ctx = IN.contextoValoracion(d, r => r, amp);
  assert.ok(ctx.includes('IMC 21.8') && !ctx.includes('21.835'), 'IMC con un decimal');
  assert.ok(!ctx.includes('(→') && !ctx.includes('①'), 'sin etiquetas internas');
  assert.match(ctx, /Luxación Bloqueada o Fractura — comprobaciones de una hipótesis que se deriva: .*un resultado negativo no la descarta/);
});

test('construirAmpliado: el gesto testigo no va y las hipótesis «Derivar» se marcan', () => {
  withState({ region: 'hombro', activeHypotheses: ['h11', 'h2'],
    testResults: { h11: { 0: 'neg' }, h2: { 0: 'pos', 5: 'pos' } } }, () => {
    const a = IA.construirAmpliado();
    const h11 = a.tests.find(t => t.hipotesis === HYPOTHESES.h11.name);
    const h2 = a.tests.find(t => t.hipotesis === HYPOTHESES.h2.name);
    assert.equal(h11.derivar, true);
    assert.ok(!('derivar' in h2));
    assert.ok(/^Gesto testigo/.test(HYPOTHESES.h2.tests[5].name), 'h2[5] sigue siendo el gesto testigo');
    assert.ok(!h2.items.some(i => /^Gesto testigo/.test(i.test)), 'el gesto testigo no va al prompt (no lleva valor)');
    assert.equal(h2.items.length, 1);
  });
});

test('construirAmpliado: iaPregunta / iaTexto del árbol sustituyen al texto de pantalla solo en el prompt', () => {
  withState({ region: 'cadera', treeAnswers: { ca_step1: 'no', ca_step2: 'no' }, activeHypotheses: [] }, () => {
    const arbol = IA.construirAmpliado().arbol;
    const r = arbol.map(x => x.respuesta).join('\n');
    assert.ok(!/cojera|rotación interna|síntomas mecánicos/.test(r), 'sin la cojera, la RI ni los síntomas mecánicos de las etiquetas');
    assert.ok(r.includes('NO — El dolor no parece referido desde la columna lumbar ni la sacroilíaca'));
    assert.ok(r.includes('NO — Perfil no degenerativo'));
  });
  withState({ region: 'rodilla', treeAnswers: { ro_step1b: 'no' }, activeHypotheses: [] }, () => {
    const p = IA.construirAmpliado().arbol[0].pregunta;
    assert.ok(p.startsWith('¿Algún criterio de Ottawa') && !/Pittsburgh|%|Seaberg/.test(p));
  });
});

test('prompt: ninguna línea de «Hallazgos de la exploración» lleva cifras de S/E, «veces» ni citas', () => {
  const mal = /%|\(unas? \d+ veces\)|\b(19|20)\d\d\b|\b[SE] ≈|\bLR\b/;
  for (const [r, t] of Object.entries(CIF_TREES)) for (const st of t.steps) {
    assert.ok(!mal.test(IN.limpiarEtiqueta(st.iaPregunta || st.question)), `${r}.${st.id}: pregunta`);
    for (const o of st.options) assert.ok(!mal.test(IN.limpiarEtiqueta(o.iaTexto || o.label)), `${r}.${st.id}.${o.value}: opción`);
  }
});

test('prompt: aviso de patrón en los hallazgos; recordatorio de discrepancias junto al formulario solo con audio', () => {
  const d = { p: 'X', r: 'rodilla', d: '01/01/2026', br: [], sq: [], pn: {}, h: [] };
  const amp = { arbol: [{ pregunta: '¿Mecanismo?', respuesta: 'SÍ — Trauma rotacional con síntomas de bloqueo o chasquidos' }],
    formulario: [{ g: 'sintomas', q: '¿Nota alguna de estas cosas?', a: 'Le falla o cede: No' }], tests: [], pautas: [], psico: [], criterios: [] };
  const sin = IN.contextoValoracion(d, r => r, amp);
  const con = IN.contextoValoracion(d, r => r, amp, { conAudio: true });
  assert.ok(sin.includes(IN.AVISO_HALLAZGOS) && con.includes(IN.AVISO_HALLAZGOS));
  assert.ok(!sin.includes(IN.RECORDATORIO_DISCREPANCIAS), 'sin audio no hay nada con qué discrepar');
  assert.ok(con.includes(IN.RECORDATORIO_DISCREPANCIAS));
  assert.ok(IN.buildNarrativePrompt(d, { conAudio: true, ampliado: amp }).includes(IN.RECORDATORIO_DISCREPANCIAS));
  assert.ok(IN.buildFichaBrevePrompt(d, { conAudio: true, ampliado: amp }).includes(IN.RECORDATORIO_DISCREPANCIAS));
  assert.ok(!IN.buildNarrativePrompt(d, { conAudio: false, ampliado: amp }).includes(IN.RECORDATORIO_DISCREPANCIAS));
  assert.match(IN.buildNarrativePrompt(d, { conAudio: true, dictado: true, ampliado: amp }), /«no la ha hecho»/, 'el dictado avisa del «he» → «ha» de Whisper');
});

const FM = await import('../formulario.js');
const ESQUEMAS_FP = [['comun', (await import('../formularios/comun.js')).default],
  ...await Promise.all(FM.REGIONES_CON_FORMULARIO.map(async r => [r, (await import(`../formularios/${r}.js`)).default]))];
await FM.cargarEsquemaRegion('hombro');
test('formulario para la IA: todo item lleva un grupo `ia` válido', () => {
  const esquemas = ESQUEMAS_FP;
  for (const [r, e] of esquemas) for (const sec of e.secciones) for (const it of sec.items)
    assert.ok(FM.GRUPOS_IA.includes(it.ia), `${r}.${it.id}: ia «${it.ia}»`);
  assert.deepEqual(IN.GRUPOS_FORMULARIO.map(([g]) => g), FM.GRUPOS_IA, 'mismos grupos en formulario.js y en el prompt');
});

test('formulario para la IA: agrupado por sección y sin «No sé» (ni filas de matriz)', () => {
  withState({ region: 'hombro', formularioPrevio: { comun: { evolucion: 'No sabría decir', despierta: 'Sí' }, regiones: { hombro: {
    provoca: { elevar: 'Sí', cruzar: 'No sé' }, nota: { fuerza: 'Sí', crujidos: 'No' },
    antecedentes: { tiroides: 'No sé' }, actividades: ['Nadar', 'No sabría decir'], lanza: 'No sabría decir' } } } }, () => {
    const f = FM.resumenFormularioIA();
    const txt = JSON.stringify(f);
    assert.ok(!/No sé|No sabría decir/.test(txt), 'sin «No sé»');
    assert.ok(!f.some(x => /tiroides|Si lanza|Desde que empezó/.test(x.q + x.a)), 'sin items que solo tenían «No sé»');
    const g = q => f.find(x => x.q.includes(q))?.g;
    assert.equal(g('¿Le aparece o le aumenta'), 'actividades');
    assert.equal(g('¿Nota alguna'), 'sintomas');
    assert.equal(g('¿Le despierta'), 'sintomas');
    assert.equal(g('En el trabajo'), 'contexto');
    const bloque = IN.bloqueFormulario(f);
    assert.ok(bloque.indexOf('Síntomas que refiere') < bloque.indexOf('Actividades y posturas'), 'grupos en orden');
    assert.match(bloque, /van en Limitaciones en las Actividades\):\n    · ¿Le aparece o le aumenta el dolor al…\? → Levantar el brazo, por delante o por un lado: Sí\n/);
    const amp = IA.construirAmpliado();
    assert.deepEqual(amp.formulario, f);
    // `iaTexto`: nombre clínico solo para la IA (tradujo la fila como «dedos en resorte»)
    state.formularioPrevio.regiones.hombro.antecedentes = { dupuytren: 'No' };
    assert.ok(FM.resumenFormularioIA().some(x => x.a === 'Contractura de Dupuytren (dedos que se quedan doblados hacia la palma): No'));
    assert.ok(FM.resumenFormularioPrevio().some(x => x.a === 'Dedos que se le quedan doblados hacia la palma: No'), 'el resumen normal sigue con el texto del papel');
    const ctx = IN.contextoValoracion(buildPhysiQPayload(), r => r, amp);
    assert.ok(ctx.includes('agrupado por la sección del informe'));
    assert.ok(!ctx.includes('(pregunta → respuesta):\n  · '), 'con datos ampliados no va el fp plano');
  });
});

test('prompt: discrepancias con otras palabras, lo referido no se borra, cada indicación a quien la dio (décima revisión)', () => {
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
    assert.ok(p.includes('También es una discrepancia cuando lo cuenta con otras palabras'));
    assert.ok(p.includes('no borra lo que refiere el paciente'));
    assert.ok(p.includes('Atribuye cada indicación a quien la dio'));
    assert.ok(p.includes('no lo uses para interpretar los hallazgos o los tests'));
    assert.ok(p.includes('No añadas coordinación, comunicación ni reevaluaciones con otros profesionales'));
    assert.ok(p.includes('La cirugía y sus restricciones no son factores ambientales'));
  }
  const n = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
  assert.ok(n.includes('la cirugía y las restricciones del cirujano no van aquí'), 'Factores Ambientales');
  assert.ok(n.includes('[Solo si hay cirugía: fecha, protocolo del cirujano'), 'Intervención Quirúrgica');
});

test('prompt: los ejemplos no son del caso y solo muestran la forma; estructura en orden (undécima revisión)', () => {
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
    assert.ok(p.includes('solo muestran la forma de escribir: nunca copies su contenido'));
    // Los ejemplos que se copiaron tal cual (Lucía, Pedro) ya no están
    assert.ok(!/despertares ocasionales|mano dormida|material de osteosíntesis/.test(p));
    assert.ok(p.includes('ni cambies ninguna de sección o de orden'));
    assert.ok(p.includes('No deduzcas la frecuencia ni la regularidad de una actividad'));
    assert.ok(p.includes('basta con una frase que lo supedite al protocolo del cirujano'));
    assert.ok(p.includes('«recorrido de la exploración»'), 'en la lista de fuentes que no se nombran');
  }
  const n = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
  assert.ok(n.includes('Intervención Quirúrgica y Cribado de Seguridad van dentro de HISTORIA CLÍNICA Y EVOLUCIÓN'));
  assert.ok(n.includes('Con cirugía, solo el diagnóstico que motivó la intervención'));
  assert.ok(n.includes('los hallazgos de movilidad van solo en Movilidad'));
  assert.ok(!/recorrido de la exploración y/.test(n), 'las instrucciones ya no usan el nombre del bloque');
});

test('prompt: sin ejemplos con género, tests con «o», picos sin reconciliar, Movilidad opcional (duodécima revisión)', () => {
  const d = { p: 'X', r: 'lumbar', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
    assert.ok(!/«sentada»|«sentado»|«la paciente»/.test(p), 'sin ejemplos con género que copiar');
    assert.ok(p.includes('no afirmes las dos'));
    assert.ok(p.includes('no cambies fechas ni circunstancias para que encajen'));
    assert.ok(p.includes('No añadas diagnósticos diferenciales que no estén en los datos'));
  }
  const n = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
  assert.ok(n.includes('### Movilidad\n[Solo si hay hallazgos de movilidad distintos del signo comparable'));
  assert.ok(n.includes('lo que no le empeora no se enumera aquí'));
});

test('prompt: siglas, cirujano una vez, notas sin nombre de campo, embudo (decimotercera revisión)', () => {
  const base = { p: 'X', r: 'tobillo_pie', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(base, { conAudio: true, nombreRegion: r => r, ampliado: null });
    assert.ok(p.includes('no desarrolles una sigla que los datos no desarrollan'));
    assert.ok(p.includes('y no lo repitas en ninguna otra parte (ni en la presentación, ni en lo pendiente, ni en los objetivos)'));
    assert.ok(p.includes('«en la conversación», «en consulta»'));
    assert.ok(p.includes('No atribuyas un síntoma a un mecanismo'));
  }
  const breve = { ...base, md: 'breve', cq: { iv: 'ORIF', fe: '30/07/2026', se: 10, pr: '', re: '', co: [] },
    pe: ['Cribado sistémico solo por embudo (sin preguntas una a una): Vascular', 'Formulario previo sin rellenar', 'Restricciones pendientes de confirmar con el cirujano (sin protocolo)'] };
  const c = IN.contextoValoracion(breve, r => r, null);
  assert.ok(!/Pendiente de completar:[\s\S]*cirujano/.test(c), 'con cirugía, la lista de pendientes no repite al cirujano');
  assert.ok(c.includes('Formulario previo sin rellenar'));
  assert.ok(c.includes('lo pendiente se dice solo en esa frase'));
  assert.match(c, /Cribado sistémico: sin hallazgos en el embudo \(cribado abreviado\)/);
  assert.match(IN.contextoValoracion({ ...base, md: 'breve', pe: ['Formulario previo sin rellenar'] }, r => r, null), /Cribado sistémico: Negativo/, 'sin embudo, como siempre');
  assert.match(IN.contextoValoracion({ ...base, pn: { variableControl: 'Dolor < 4/10', anclajeHabito: 'Tras el paseo' } }, r => r, null),
    /Indicaciones del fisioterapeuta para el plan:\n  · Para dosificar la carga: Dolor < 4\/10\n  · Cuándo hacer los ejercicios: Tras el paseo/);
});

test('tobillo: el KTW lleva su nombre (desarrolló la sigla como un test inexistente)', () => {
  assert.ok(HYPOTHESES.tp20.tests.some(t => t.name === 'KTW (rodilla a la pared)'));
  assert.ok(!Object.values(HYPOTHESES).some(h => h.tests.some(t => /\bKTW\b(?! \(rodilla a la pared\))/.test(t.name))), 'ningún test con la sigla sola');
});

test('prompt: derivación urgente sin pautas, cifras sin clasificar, psicosocial sin etiquetas diagnósticas (decimocuarta revisión)', () => {
  const a = { pautas: [{ hipotesis: 'Cefalea Cervicogénica', pauta: 'Biofeedback de 20 a 30 mmHg', fuente: 'APTA', prom: 'NDI', pronostico: { derivacion: 'El 30 % cumple criterios de migraña' } }] };
  const normal = IN.bloquesAmpliados(a).join('\n');
  assert.ok(normal.includes('Biofeedback de 20 a 30 mmHg'));
  const urg = IN.bloquesAmpliados(a, { urgente: true }).join('\n');
  assert.ok(!/mmHg|migraña|APTA/.test(urg), 'con derivación urgente no van pautas, fuentes ni pronóstico');
  assert.match(urg, /^Plan: derivación urgente\. La pauta de fisioterapia se decidirá después de la valoración médica/m);
  assert.ok(urg.includes('Escala recomendada para el seguimiento:\n  · Cefalea Cervicogénica: NDI'));
  const d = { p: 'X', r: 'cervical', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {}, ur: ['Cefalea con signos de alarma: derivación a urgencias hoy.'] };
  assert.ok(IN.contextoValoracion(d, r => r, a).includes('Plan: derivación urgente'), 'contextoValoracion pasa la urgencia');
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: true, nombreRegion: r => r, ampliado: null });
    assert.ok(p.includes('Con una derivación urgente no escribas ningún plan de tratamiento'));
    assert.ok(p.includes('No nombres los diagnósticos que el médico deberá descartar'));
    assert.ok(p.includes('se dan tal cual, sin clasificarlas'));
  }
  withState({ region: 'cervical', riesgoPsico: 'Alto', psico_miedo: 'Sí', psico_autoef: 'Dudoso', psico_emocional: 'Sí' }, () => {
    const t = IN.bloquesAmpliados(IA.construirAmpliado()).join('\n');
    assert.match(t, /Cribado psicosocial detallado:\n  · Miedo al movimiento → Sí\n  · Baja autoeficacia → Dudoso\n  · Componente emocional → Sí/);
    assert.ok(!/ansiedad|depresión|catastrofización/.test(t), 'sin etiquetas diagnósticas');
  });
});

test('formulario de hombro: «llevar la mano a la espalda» sin el sujetador para la IA', () => {
  withState({ region: 'hombro', formularioPrevio: { comun: {}, regiones: { hombro: { provoca: { espalda: 'Sí' } } } } }, () => {
    assert.ok(FM.resumenFormularioIA().some(x => x.a === 'Llevar la mano a la espalda: Sí'));
    assert.ok(FM.resumenFormularioPrevio().some(x => x.a.includes('(sujetador, bolsillo)')), 'el papel no cambia');
  });
});

test('prompt: «No sé» nunca como negación, sin negativos inventados, cada dato en su sección', () => {
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
    assert.match(p, /«No sé» o «No sabría decir»: no las menciones de ninguna forma; ni como negación/);
    assert.match(p, /No afirmes negativos que no estén en los datos/);
    assert.match(p, /no la apoya|no la apoyan/, 'coherencia: «Derivar» con comprobaciones negativas');
  }
  const narr = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.match(narr, /La intensidad y la irritabilidad van en Dolor/);
  assert.match(narr, /Las actividades que provocan el dolor van en Limitaciones/);
  assert.match(narr, /dilo aquí y solo aquí, como «no muestra hallazgos que sugieran…», sin nombrar estructuras ni síndromes que no estén en los datos/);
  assert.match(narr, /Si no las hay, describe los hallazgos sin mencionar que faltan mediciones/);
  assert.ok(!/Lo que se descarta de otra región/.test(narr), "la indicación ya no invita a «descartar»");
  assert.match(narr, /sin suponer cómo podría afectarle/);
  assert.match(narr, /por falta de mejoría \(aquí y solo aquí\)/);
  assert.ok(!narr.includes('plan y pauta, y al final el seguimiento'), 'en el narrativo el seguimiento tiene su propia sección');
});

test('prompt: sin fisiopatología inventada, ejemplos negativos en Limitaciones, criterio de reevaluación solo en Seguimiento', () => {
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
    assert.match(p, /No añadas causas, mecanismos, secuelas ni fases de curación o de recuperación que no estén en los datos/);
    assert.match(p, /tampoco atribuyas los hallazgos a secuelas ni a la evolución esperable/);
    assert.match(p, /Si hay protocolo \(escrito o verbal\), sigue sus restricciones tal como constan: no pidas confirmarlo/);
    assert.match(p, /Cada recomendación del plan aparece una sola vez/);
  }
  const narr = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.match(narr, /Si aquí aparece fuerza, crujidos, bloqueos.*está mal/);
  assert.match(narr, /ni frases para decir que algo no se hizo, no se midió o «no se dispone de…»/);
  assert.match(narr, /va en Seguimiento, aunque venga dentro del texto de la pauta/);
});

test('ficha breve: sin nombre en el texto, CIF solo b/d, reparto de palabras, y sin «lo no explorado dilo una vez»', () => {
  const d = { p: 'X', r: 'rodilla', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  const f = IN.PLANTILLAS.breve.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.match(f, /Tampoco escribas el nombre del paciente ni la fecha en ningún punto del texto/);
  assert.match(f, /elegidos SOLO de esta lista .*si ningún código de la lista encaja, no pongas código: b134 funciones del sueño; /);
  assert.match(f, /d4101 ponerse en cuclillas; d4102/);
  // Lista cerrada: códigos b/d con forma válida, sin repetidos, todos en el prompt de la ficha y ninguno en el narrativo
  const cods = IN.CODIGOS_CIF.map(([c]) => c);
  assert.equal(new Set(cods).size, cods.length, 'sin códigos repetidos');
  for (const [c, t] of IN.CODIGOS_CIF) {
    assert.match(c, /^[bd]\d{3,5}$/, c);
    assert.ok(t && f.includes(`${c} ${t}`), `${c} en el prompt`);
  }
  assert.ok(!IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null }).includes('b134 funciones del sueño'), 'el narrativo no lleva códigos');
  assert.match(f, /PRESENTACIÓN CLÍNICA \d+, HALLAZGOS Y CODIFICACIÓN CIF \d+, OBJETIVOS Y PLAN \d+/);
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
    assert.ok(!/dilo UNA sola vez, en una frase, donde se describe la exploración/.test(p), 'sin la regla que invitaba a «no se realizó…»');
    assert.match(p, /Lo que no consta \(mediciones, fuerza, escalas, pruebas no realizadas…\) no se menciona/);
  }
  // Modo breve: decir una vez que es breve y qué queda pendiente, sin dar por completo lo pendiente
  const ctx = IN.contextoValoracion({ ...d, md: 'breve', pe: ['Cribado sistémico solo por embudo'] }, r => r, null);
  assert.match(ctx, /Dilo UNA vez en el informe, en una frase, junto con lo que queda pendiente de completar/);
  assert.match(ctx, /Pendiente de completar:\n  · Cribado sistémico solo por embudo/);
});

test('sexo: opcional, en la cabecera del prompt y del informe compartido, con concordancia; nunca en el payload', () => {
  withState({ region: 'rodilla', sexo: 'Mujer', edadPaciente: 34 }, () => {
    const d = buildPhysiQPayload();
    assert.ok(!('sexo' in d) && !('sx' in d), 'el payload (contrato con physiq-report) no cambia');
    const amp = IA.construirAmpliado();
    assert.equal(amp.sexo, 'Mujer');
    assert.match(IN.contextoValoracion(d, r => r, amp), /Edad: 34 años · Sexo: mujer · Región/);
  });
  withState({ region: 'rodilla', sexo: '' }, () => {
    assert.match(IN.contextoValoracion(buildPhysiQPayload(), r => r, IA.construirAmpliado()), /Sexo: no consta \(no lo deduzcas del nombre; redacta sin marcar el género\)/, 'sin sexo, la línea lo dice');
    assert.ok(!/Sexo:/.test(IN.contextoValoracion(buildPhysiQPayload(), r => r, null)), 'sin datos ampliados (payload de report), sin línea');
  });
  assert.match(IN.textoParaCompartir('## A\nB.', { p: 'X', d: '01/01/2026', r: 'rodilla', ed: 34, sx: 'Mujer' }, r => 'Rodilla'), /Edad: 34 años\nSexo: Mujer/);
  const p = IN.PLANTILLAS.breve.prompt({ p: 'X', r: 'rodilla', d: '01/01/2026', h: [], br: [], sq: [], pn: {} }, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.match(p, /Si consta el sexo, concuerda el género con él.*si no consta, redacta sin marcar el género/);
});

test('prompt: sin datos personales deducidos, sin citar las notas del plan, derivación descartada sin mencionar', () => {
  const d = { p: 'X', r: 'hombro', d: '01/01/2026', h: [{ name: 'H' }], br: [], sq: [], pn: {} };
  for (const pl of Object.values(IN.PLANTILLAS)) {
    const p = pl.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
    assert.match(p, /edad, sexo y lado afectado \(derecho, izquierdo\) solo si constan en los datos; nunca los deduzcas/);
    assert.match(p, /ni como desconocimiento \(«desconoce si…»\)/);
    assert.match(p, /no escribas que «descartan» nada/);
    assert.match(p, /«notas del plan» ni el nombre de sus campos/);
    assert.match(p, /si indica que no procede .*no menciones esa derivación en ningún punto/);
  }
  const narr = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.match(narr, /NO escribas el nombre del paciente ni la fecha en ningún punto del texto/);
  assert.match(narr, /los síntomas que refiere o niega van en Dolor/);
  assert.match(narr, /sin nombrar los tests/);
});

test('prompt: reglas de la revisión con informes reales, en las dos plantillas', () => {
  const d = { p: 'X', r: 'lumbar', d: '01/01/2026', h: [], br: [], sq: [], pn: {} };
  for (const conAudio of [true, false]) {
    for (const [nombre, pl] of Object.entries(IN.PLANTILLAS)) {
      const p = pl.prompt(d, { conAudio, nombreRegion: r => r, ampliado: null });
      // El diagnóstico médico fijo contradecía al paciente cuando lo contaba
      assert.ok(!p.includes('no aportado'), `${nombre}: sin «Diagnóstico médico: no aportado» fijo`);
      // «Prevalecen los datos estructurados» hacía descartar o yuxtaponer lo que cuenta el paciente
      assert.ok(!p.includes('prevalecen los datos estructurados'), `${nombre}: sin la regla antigua de discrepancias`);
      assert.match(p, /Discrepancias:/, `${nombre}: regla de discrepancias`);
      assert.match(p, /No menciones de dónde sale cada dato/, `${nombre}: sin citar las fuentes`);
      assert.match(p, /Reglas pronósticas.*nunca las uses para reforzar ni descartar/, `${nombre}: regla pronóstica`);
      assert.match(p, /Derivaciones:.*UNA sola vez, al principio/, `${nombre}: derivación una vez, al principio del plan`);
      assert.match(p, /no decidas por tu cuenta si se espera/, `${nombre}: derivación no urgente sin decidir el momento`);
      assert.match(p, /Derivar».*aunque sus tests clínicos hayan salido negativos/, `${nombre}: «Derivar» se mantiene con tests negativos`);
      assert.match(p, /no cites cocientes de probabilidad/, `${nombre}: sin jerga de puntuación`);
      assert.match(p, /No crees secciones ni subsecciones/, `${nombre}: sin secciones inventadas`);
      assert.match(p, /no interpretes ni justifiques la discrepancia/, `${nombre}: discrepancias sin interpretar`);
      // El ejemplo antiguo («niega inicialmente…, aunque en consulta refiere…») se copiaba tal cual, fuente incluida
      assert.ok(!/niega inicialmente|en consulta refiere/.test(p), `${nombre}: el ejemplo no nombra la fuente`);
      assert.match(p, /no es una discrepancia: recógelo tal cual. No escribas que algo «no se menciona», «no se confirma»/, `${nombre}: lo que solo consta en una fuente no es discrepancia`);
      assert.match(p, /otra zona u otro lado.*UNA vez como algo que refiere el paciente.*nunca en Pruebas Clínicas.*No le añadas plan, seguimiento, prevención/, `${nombre}: el otro lado, referido y sin plan inventado`);
      assert.match(p, /no escribas que la «confirman»/, `${nombre}: los tests apoyan, no confirman`);
      assert.match(p, /«Cuándo reconsiderar o derivar» es contexto para el fisioterapeuta: no lo conviertas en acciones del plan, criterios de vuelta a la actividad/, `${nombre}: el pronóstico no se convierte en plan`);
    }
  }
  // Códigos CIF: limitados en la ficha (tiene sección propia); el narrativo, sin códigos
  const ficha = IN.PLANTILLAS.breve.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  const narr = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
  assert.match(ficha, /si ningún código de la lista encaja, no pongas código/, 'ficha: códigos CIF limitados');
  assert.match(narr, /sin códigos alfanuméricos/, 'narrativo: sin códigos CIF');
  // Narrativo de valoración inicial: fuera las subsecciones que solo producían «no se realizó…»
  for (const x of ['Función Cardiorrespiratoria', 'Control Motor', '#### Equilibrio', '6MWT', 'EQ-5D', 'Limitación Funcional Global'])
    assert.ok(!narr.includes(x), `narrativo: sin «${x}»`);
  assert.match(narr, /«\[solo si…\]» se omiten por completo, título incluido/);
  // El tope de tokens solo evita cortes: holgado respecto a las palabras pedidas (~1,6 tokens/palabra en español con códigos)
  for (const pl of Object.values(IN.PLANTILLAS)) assert.ok(pl.maxTokens >= pl.palabras * 3, `${pl.nombre}: tope de tokens holgado`);
});

test('texto para compartir: la edad va en la identificación', () => {
  assert.match(IN.textoParaCompartir('## A\nB.', { p: 'X', d: '01/01/2026', r: 'lumbar', ed: 47 }), /Edad: 47 años/);
  assert.doesNotMatch(IN.textoParaCompartir('## A\nB.', { p: 'X', d: '01/01/2026', r: 'lumbar' }), /Edad:/);
});

test('construirAmpliado: lee el estado de las cinco fases', () => {
  const lu = CIF_TREES.lumbar.steps[0];
  const lu8 = HYPOTHESES.lu8, lu1 = HYPOTHESES.lu1, ce8 = HYPOTHESES.ce8;
  withState({
    region: 'lumbar', edadPaciente: 33, signoComparable: ' Flexión ', estabilidad: 'Estable',
    irritabilidad: { dolor: 'Alto' }, irritabilidadDirecta: false,
    riesgoPsico: 'Alto', psico_miedo: 'Sí', psico_autoef: '', psico_emocional: 'No',
    treeAnswers: { [lu.id]: lu.options[0].value },
    activeHypotheses: ['lu8', 'lu1', 'ce8'],
    testResults: { lu8: { 0: 'pos', 1: 'nd' }, lu1: { 0: 'neg' } },
  }, () => {
    const a = IA.construirAmpliado();
    assert.equal(a.edad, 33);
    assert.equal(a.signoComparable, 'Flexión');
    assert.deepEqual(a.irritabilidad, { dolor: 'Alto' });
    assert.deepEqual(a.psico.map(x => x.a), ['Sí', 'No'], 'solo lo contestado');
    assert.deepEqual(a.arbol, [{ pregunta: lu.question, respuesta: lu.options[0].label }]);
    const t8 = a.tests.find(t => t.hipotesis === lu8.name);
    assert.equal(t8.items.length, 1, '«nd» no cuenta como realizado');
    assert.equal(t8.items[0].resultado, 'positivo');
    assert.equal(t8.items[0].cluster, lu8.clusters[lu8.tests[0].cluster].nombre);
    assert.equal(a.tests.find(t => t.hipotesis === lu1.name).items[0].pronostico, true);
    assert.ok(!a.tests.some(t => t.hipotesis === ce8.name), 'sin tests hechos, no aparece');
    const p8 = a.pautas.find(p => p.hipotesis === ce8.name);
    assert.equal(p8.derivar, true);
    assert.equal(p8.pauta, '', 'la pauta de derivar no se repite como texto');
    assert.equal(a.pautas.find(p => p.hipotesis === lu8.name).fuente, lu8.dosisFuente);
  });
  withState({ irritabilidad: { dolor: 'Alto' }, irritabilidadDirecta: true, riesgoPsico: 'Medio', psico_miedo: 'Sí' }, () => {
    const a = IA.construirAmpliado();
    assert.equal(a.irritabilidad, null, 'nivel elegido directamente: la matriz no se rellenó');
    assert.deepEqual(a.psico, [], 'el detalle psicosocial solo con riesgo Alto');
  });
});

test('construirAmpliado: criterio compuesto con la misma regla que la fase 2', () => {
  const sis = SYSTEMIC_SCREENING.lumbar.sistemas.find(s => s.criterioCompuesto);
  const c = sis.criterioCompuesto;
  const si = Object.fromEntries(c.ids.slice(0, c.minPositivas).map(id => [id, 'SI']));
  withState({ region: 'lumbar', edadPaciente: c.filtro.edadMax - 1, cronologia: c.filtro.evolucion, sistemicoAnswers: si }, () => {
    assert.deepEqual(IA.construirAmpliado().criterios.map(x => x.etiqueta), [c.etiqueta]);
  });
  withState({ region: 'lumbar', edadPaciente: c.filtro.edadMax, cronologia: c.filtro.evolucion, sistemicoAnswers: si }, () => {
    assert.deepEqual(IA.construirAmpliado().criterios, [], 'fuera del filtro de edad, no se cumple');
  });
});

test('el payload de physiq-report no cambia con los datos ampliados', () => {
  withState({ edadPaciente: 40, signoComparable: 'X', treeAnswers: {}, activeHypotheses: [] }, () => {
    const keys = Object.keys(buildPhysiQPayload());
    assert.ok(!keys.includes('ed') && !keys.includes('_ampliado'), 'ni edad ni datos ampliados en el payload');
  });
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
  // Todo lib/*.js que la app importa (estático o con import()) se despliega:
  // un fichero olvidado solo falla en producción (paquete de revisión: zip.js)
  const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
  const fuentes = [...readdirSync(raiz).filter(f => f.endsWith('.js')).map(f => [f, '']), ...readdirSync(join(raiz, 'lib')).filter(f => f.endsWith('.js')).map(f => [f, 'lib/'])];
  const usados = new Set();
  for (const [f, dir] of fuentes) {
    for (const m of readFileSync(join(raiz, dir, f), 'utf8').matchAll(/(?:from|import\()\s*'\.\/((?:lib\/)?[\w-]+\.js)'/g))
      usados.add(dir === 'lib/' ? `lib/${m[1]}` : m[1]);
  }
  for (const f of [...usados].filter(f => f.startsWith('lib/'))) assert.ok(wf.includes(f), `deploy-to-hub.yml no copia ${f}`);
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
  assert.ok(/_avisoAudioSesion\(\)/.test(cuerpo('promptClearSession')), 'borrar sesión: avisa en la confirmación');
  assert.ok(/_descartarAudioSesion\(\)/.test(cuerpo('_borrarSesion')), 'y descarta al confirmar');
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

// ── Lado afectado (fase 2) ─────────────────────────────────────────────────────
console.log('\nlado afectado');
const IN_INFORME = await import('../lib/informe-narrativo.js');
const { ladoTexto } = await import('../lib/region.js');
test('lado: viaja en el payload (la) y sale en 📋 Notas, 📄 Informe y el informe con IA', () => {
  withState({ region: 'hombro', lado: 'Derecho' }, () => {
    const d = buildPhysiQPayload();
    assert.equal(d.la, 'Derecho');
    assert.match(buildContextSummaryText(), /Región: Hombro \(derecho\)/);
    assert.match(buildInformeFisioterapiaText(), /Región valorada: Hombro \(derecho\)/);
    const IN2 = IN_INFORME;
    assert.match(IN2.buildNarrativePrompt(d, { conAudio: false, nombreRegion: r => r.charAt(0).toUpperCase() + r.slice(1) }), /Región valorada: Hombro \(derecho\)/);
    assert.match(IN2.textoParaCompartir('## A\nB.', { p: 'X', d: '01/01/2026', r: 'hombro', la: 'Derecho' }, r => 'Hombro'), /Región valorada: Hombro \(derecho\)/);
  });
  // Concordancia con la región: «Rodilla (izquierda)», no «(izquierdo)»
  withState({ region: 'rodilla', lado: 'Izquierdo' }, () => {
    assert.match(buildContextSummaryText(), /Región: Rodilla \(izquierda\)/);
    assert.match(buildInformeFisioterapiaText(), /Región valorada: Rodilla \(izquierda\)/);
    assert.equal(IN_INFORME.regionTexto(buildPhysiQPayload(), r => 'Rodilla'), 'Rodilla (izquierda)');
  });
  for (const [r, l, esperado] of [['cadera', 'Derecho', 'derecha'], ['lumbar', 'Izquierdo', 'izquierda'], ['cervical', 'Central', 'central'],
    ['rodilla', 'Bilateral', 'bilateral'], ['hombro', 'Izquierdo', 'izquierdo'], ['codo', 'Derecho', 'derecho'], ['tobillo_pie', 'Izquierdo', 'izquierdo']])
    assert.equal(ladoTexto(r, l), esperado, `${r} ${l}`);
  withState({ region: 'hombro', lado: '' }, () => {
    assert.equal(buildPhysiQPayload().la, '');
    assert.match(buildInformeFisioterapiaText(), /Región valorada: Hombro\n/);
  });
});

test('lado: el reinicio lo borra y «Central» solo existe en la columna', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="ladoWrap" hidden/);
  for (const v of ['Derecho', 'Izquierdo', 'Bilateral', 'Central']) assert.ok(html.includes(`selectOption('lado', this, '${v}')`), v);
  const src = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const reset = src.slice(src.indexOf('function _softResetApp()'), src.indexOf('function _softResetApp()') + 3000);
  assert.ok(reset.includes("state.lado = '';"), '_softResetApp borra el lado');
  assert.match(src, /const REGIONES_COLUMNA = \['cervical', 'lumbar'\]/);
  assert.match(src, /if \(state.lado === 'Central' && !columna\) state.lado = '';/);
});

// ── Exportar / importar la valoración (lib/valoracion-json.js) ────────────────
console.log('\nexportar / importar valoración');
{
  const VJ = await import('../lib/valoracion-json.js');
  const regiones = Object.keys(SYSTEMIC_SCREENING);
  const ahora = new Date(2026, 9, 6, 12, 0);
  const base = { ...JSON.parse(JSON.stringify(state)), patient: 'José Pérez', region: 'hombro', maxVisitedIdx: 5, currentPhase: 5,
    treeAnswers: { h_step1: 'trauma' }, testResults: { h11: { 0: 'neg' } }, planNotes: { variableControl: 'ROM', ventanaRecuperacion: '', anclajeHabito: '' },
    formularioPrevio: { comun: { desde_cuando: 'hace mes y medio' }, regiones: { hombro: { luxacion: 'No' } } },
    informeIA: { texto: 'informe viejo', datos: {} } };

  test('exportar → importar devuelve el mismo estado, sin el informe con IA', () => {
    const texto = JSON.stringify(VJ.exportarValoracion(base, ahora));
    const r = VJ.leerImportacion(texto, regiones);
    assert.ok(r.ok, r.error);
    const { informeIA, ...esperado } = base;
    assert.deepEqual(r.assessmentState, esperado);
    assert.equal(r.paciente, 'José Pérez');
    assert.ok(!('informeIA' in r.assessmentState) && !texto.includes('informe viejo'));
  });

  test('exportar: encabezado del archivo y nombre sin acentos', () => {
    const e = VJ.exportarValoracion(base, ahora);
    assert.equal(e.app, 'physiq-assessment');
    assert.equal(e.tipo, 'valoracion');
    assert.equal(e.version, VJ.VERSION);
    assert.equal(VJ.nombreArchivo('José Pérez', ahora), 'valoracion-jose-perez-2026-10-06.json');
    assert.equal(VJ.nombreArchivo('', ahora), 'valoracion-sin-nombre-2026-10-06.json');
    assert.equal(VJ.hayValoracion({ maxVisitedIdx: 0 }), false);
    assert.equal(VJ.hayValoracion(base), true);
  });

  test('importar: rechaza archivos que no son una valoración restaurable, sin lanzar', () => {
    const conEstado = cambios => JSON.stringify({ ...VJ.exportarValoracion(base, ahora), ...cambios });
    const conAS = cambios => JSON.stringify({ ...VJ.exportarValoracion(base, ahora), assessmentState: { ...base, ...cambios } });
    const casos = [
      ['no es JSON', 'hola', /JSON válido/],
      ['otra app', conEstado({ app: 'physiq-motion' }), /no es una valoración/],
      ['versión futura', conEstado({ version: VJ.VERSION + 1 }), /versión más nueva/],
      ['sin estado', conEstado({ assessmentState: null }), /no contiene/],
      ['sin pasar de la fase 1', conAS({ maxVisitedIdx: 0 }), /fase 1/],
      ['fase inválida', conAS({ currentPhase: 7 }), /fase guardada/],
      ['región desconocida', conAS({ region: 'muñeca' }), /región/],
    ];
    for (const [nombre, texto, error] of casos) {
      const r = VJ.leerImportacion(texto, regiones);
      assert.equal(r.ok, false, nombre);
      assert.match(r.error, error, nombre);
    }
  });

  test('importar: app.js bloquea saveSession() mientras importa y recarga para restaurar', () => {
    const src = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
    assert.match(src, /function saveSession\(\) \{\n  if \(_importando\) return;/, 'saveSession no debe pisar lo importado con el DOM anterior');
    const aplicar = src.slice(src.indexOf('async function _aplicarImportacion'), src.indexOf('function toggleSessionPanel'));
    assert.ok(aplicar.indexOf('_importando = true') < aplicar.indexOf('writeSession'), 'el bloqueo va antes de escribir');
    assert.ok(aplicar.indexOf('clearSession()') < aplicar.indexOf('writeSession'), 'sin restos de la sesión anterior');
    assert.match(aplicar, /location\.reload\(\)/);
    assert.ok(!/import .*valoracion-json/.test(src), 'el módulo se carga con import() solo al usarlo');
  });

  test('deploy: lib/valoracion-json.js se copia al hub', () => {
    const wf = readFileSync(new URL('../.github/workflows/deploy-to-hub.yml', import.meta.url), 'utf8');
    assert.ok(wf.includes('lib/valoracion-json.js'));
  });
}

// ── Paciente posquirúrgico (docs/posquirurgico.md) ───────────────────────────
console.log('\npaciente posquirúrgico');
{
  const PQ = await import('../lib/posquirurgico.js');
  const { esTratada, marcarTratada } = await import('../phase4b.js');
  const { getDerivacionesArbol } = await import('../phase4.js');
  const HOY = new Date(2026, 9, 6);   // 6 oct 2026
  const cir = (extra = {}) => ({ ...PQ.cirugiaVacia(), ...extra });
  const POSQ = (extra = {}) => ({ mecanismo: 'Post-quirúrgico', cirugia: cir(extra), derivacionResuelta: {} });
  const await_comun = await import('../data/comun.js');

  test('semanas: desde la fecha (al vuelo), o las aproximadas sin fecha; nunca negativas', () => {
    assert.equal(PQ.semanasCirugia(cir({ fecha: '2026-08-25' }), HOY), 6);
    assert.equal(PQ.semanasCirugia(cir({ fecha: '2026-10-06' }), HOY), 0);
    assert.equal(PQ.semanasCirugia(cir({ fecha: '2026-12-01' }), HOY), 0);
    assert.equal(PQ.semanasCirugia(cir({ semanasAprox: 4 }), HOY), 4);
    assert.equal(PQ.semanasCirugia(cir({ fecha: '2026-09-29', semanasAprox: 20 }), HOY), 1, 'la fecha manda');
    assert.equal(PQ.semanasCirugia(cir(), HOY), null);
    assert.ok(!('semanas' in state.cirugia), 'las semanas calculadas no se guardan');
  });

  test('cq: solo con mecanismo Post-quirúrgico, con complicaciones y protocolo legibles', () => {
    const c = cir({ intervencion: 'PTR derecha', fecha: '2026-08-25', protocolo: 'Escrito', restricciones: 'Carga parcial',
      complicaciones: ['tvp', 'nervio'], complicacionOtra: 'Dehiscencia leve' });
    assert.equal(PQ.cirugiaPayload('Traumático', c, HOY), null);
    assert.deepEqual(PQ.cirugiaPayload('Post-quirúrgico', c, HOY),
      { iv: 'PTR derecha', fe: '25/08/2026', se: 6, pr: 'Escrito', re: 'Carga parcial', co: ['TVP / TEP', 'Lesión nerviosa', 'Dehiscencia leve'] });
    withState(POSQ({ intervencion: 'PTR' }), () => assert.equal(buildPhysiQPayload().cq.iv, 'PTR'));
    withState({ mecanismo: 'Insidioso', cirugia: cir({ intervencion: 'PTR' }), derivacionResuelta: {} }, () => {
      assert.ok(!('cq' in buildPhysiQPayload()), 'fuera del posquirúrgico, la tarjeta no viaja');
      assert.ok(!buildContextSummaryText().includes('CIRUGÍA'));
      assert.ok(!buildInformeFisioterapiaText().includes('ANTECEDENTE QUIRÚRGICO'));
    });
  });

  test('📋 Notas y 📄 Informe: cirugía, protocolo y plan supeditado', () => {
    withState(POSQ({ intervencion: 'Osteosíntesis de maléolo', protocolo: 'Verbal', restricciones: 'Sin carga 6 semanas' }), () => {
      const n = buildContextSummaryText(), i = buildInformeFisioterapiaText();
      assert.match(n, /🏥 CIRUGÍA: Osteosíntesis de maléolo · Protocolo: verbal · Restricciones: Sin carga 6 semanas/);
      assert.ok(!n.includes(PQ.TEXTO_SIN_PROTOCOLO));
      assert.match(i, /ANTECEDENTE QUIRÚRGICO\n  · Intervención: Osteosíntesis de maléolo/);
      assert.match(i, /PLAN DE TRATAMIENTO Y RECOMENDACIONES\n  · El tratamiento sigue el protocolo y las restricciones indicadas por el cirujano: Sin carga 6 semanas/);
    });
    for (const protocolo of ['', 'No hay']) {
      withState(POSQ({ intervencion: 'LCA', protocolo }), () => {
        assert.ok(buildContextSummaryText().includes(PQ.TEXTO_SIN_PROTOCOLO), `Notas, protocolo «${protocolo}»`);
        assert.match(buildInformeFisioterapiaText(), new RegExp(`RECOMENDACIONES\\n  · ${PQ.TEXTO_SIN_PROTOCOLO}\\.`));
      });
    }
  });

  test('modo breve: sin protocolo del cirujano es un pendiente (y lleva a la tarjeta)', () => {
    withState({ ...POSQ({ protocolo: 'No hay' }), modo: 'breve' }, () => {
      const p = getPendientesBreve().find(x => x.ancla === 'cardCirugia');
      assert.ok(p && p.fase === 1 && p.texto.includes(PQ.TEXTO_SIN_PROTOCOLO));
    });
    withState({ ...POSQ({ protocolo: 'Escrito' }), modo: 'breve' }, () => {
      assert.ok(!getPendientesBreve().some(x => x.ancla === 'cardCirugia'));
    });
    withState({ ...POSQ({ protocolo: 'No hay' }), modo: 'completo' }, () => assert.deepEqual(getPendientesBreve(), []));
  });

  test('«ya diagnosticada y tratada»: h11 sin derivación ni puntuación en payload, Notas, Informe y pendientes', () => {
    const patch = { ...POSQ({ intervencion: 'Osteosíntesis de húmero proximal', protocolo: 'Escrito' }),
      activeHypotheses: ['h11'], testResults: { h11: { 0: 'pos' } }, hypothesisScores: {}, modo: 'breve' };
    withState(patch, () => {
      assert.ok(!esTratada('h11'));
      marcarTratada('h11', true);
      assert.ok(esTratada('h11'));
      const p = buildPhysiQPayload();
      const h11 = p.h.find(x => x.id === 'h11');
      assert.equal(h11.dt, true);
      assert.equal(h11.sc, PQ.ETIQUETA_TRATADA);
      assert.ok(buildInformeFisioterapiaText().includes(`· ${HYPOTHESES.h11.name} (intervenida quirúrgicamente)`));
      assert.ok(!getPendientesBreve().some(x => x.fase === '4b'), 'sus tests no aplican: no son un pendiente');
      marcarTratada('h11', false);
      assert.ok(!esTratada('h11'));
      assert.ok(!('dt' in buildPhysiQPayload().h.find(x => x.id === 'h11')));
      assert.notEqual(state.hypothesisScores.h11.label, PQ.ETIQUETA_TRATADA, 'al desmarcar vuelve la puntuación de sus tests');
    });
    withState({ ...patch, mecanismo: 'Traumático' }, () => {
      marcarTratada('h11', true);
      assert.ok(buildInformeFisioterapiaText().includes(`· ${HYPOTHESES.h11.name} (diagnosticada y tratada)`), 'disponible sin cirugía');
    });
  });

  test('«ya diagnosticada y tratada»: sin Post-quirúrgico, solo hipótesis «Derivar»', () => {
    withState({ derivacionResuelta: {}, activeHypotheses: ['h2'], hypothesisScores: {} }, () => {
      marcarTratada('h2', true);
      assert.ok(!esTratada('h2'));
      assert.deepEqual(state.derivacionResuelta, {});
    });
  });

  // ── Hipótesis posquirúrgica genérica `pq1` (docs/posquirurgico.md, «Propuesta»)
  const P4B = await import('../phase4b.js');
  const { HIP_POSQUIRURGICA } = await import('../data.js');

  test('pq1: solo con Post-quirúrgico, la primera, fuera de HYPOTHESES y de ningún árbol', () => {
    assert.ok(!HYPOTHESES.pq1, 'no es una hipótesis regional');
    for (const t of Object.values(CIF_TREES)) for (const st of t.steps) for (const o of st.options) {
      assert.ok(!(o.hypothesis || []).includes('pq1'), `${st.id}: ningún árbol la activa`);
    }
    withState({ ...POSQ(), region: 'cadera', activeHypotheses: ['ca1', 'ca2'] }, () => {
      assert.deepEqual(P4B.hipotesisActivas(), ['pq1', 'ca1', 'ca2']);
      assert.deepEqual(state.activeHypotheses, ['ca1', 'ca2'], 'no se guarda en el estado del árbol');
    });
    withState({ mecanismo: 'Insidioso', region: 'cadera', activeHypotheses: ['ca1'] }, () => {
      assert.deepEqual(P4B.hipotesisActivas(), ['ca1']);
    });
    withState({ ...POSQ(), region: 'cadera', activeHypotheses: [] }, () => {
      assert.deepEqual(P4B.hipotesisActivas(), ['pq1'], 'también sin hipótesis del árbol');
    });
  });

  test('pq1: nombre con la intervención y PROM que la región ya usa', () => {
    withState({ ...POSQ({ intervencion: 'PTC derecha' }), region: 'cadera' }, () => {
      const h = P4B.hipotesis('pq1');
      assert.equal(h.name, 'Postoperatorio: PTC derecha');
      assert.deepEqual(h.tests, []);
      assert.equal(h.dosis, '');
    });
    withState({ ...POSQ(), region: 'cadera' }, () => assert.equal(P4B.hipotesis('pq1').name, PQ.NOMBRE_HIP_POSQ));
    assert.deepEqual(Object.keys(HIP_POSQUIRURGICA.promPorRegion).sort(), Object.keys(CIF_TREES).sort());
    for (const [r, prom] of Object.entries(HIP_POSQUIRURGICA.promPorRegion)) {
      assert.ok(Object.values(HYPOTHESES).some(h => h.region === r && h.prom === prom), `${r}: «${prom}» no es un PROM de la región`);
    }
  });

  test('pq1: en payload (pq), Notas e Informe la primera, sin puntuación ni pendiente en breve', () => {
    withState({ ...POSQ({ intervencion: 'PTR', protocolo: 'Escrito', restricciones: 'Carga parcial 4 semanas' }), region: 'rodilla',
      activeHypotheses: ['ro1'], testResults: { ro1: { 0: 'pos' } }, hypothesisScores: { ro1: { totalLR: 3, label: 'x' } }, modo: 'breve' }, () => {
      const p = buildPhysiQPayload();
      assert.deepEqual(p.h[0], { id: 'pq1', name: 'Postoperatorio: PTR', sc: PQ.ETIQUETA_HIP_POSQ, lr: null, tr: {}, pq: true });
      assert.equal(p.h[1].id, 'ro1');
      const inf = buildInformeFisioterapiaText();
      assert.ok(inf.includes('IMPRESIÓN CLÍNICA\n  · Postoperatorio: PTR\n'), 'la primera en la impresión clínica');
      assert.ok(!inf.includes('pendiente de confirmar)'), 'pq1 no deja la impresión «sin confirmar»');
      assert.ok(buildContextSummaryText().includes(`· Postoperatorio: PTR — ${PQ.ETIQUETA_HIP_POSQ}`));
      assert.ok(!getPendientesBreve().some(x => x.fase === '4b'));
      assert.equal(PQ.pautaHipPosq(p.cq), 'Seguir el protocolo del cirujano: Carga parcial 4 semanas');
    });
    withState({ ...POSQ(), region: 'rodilla', activeHypotheses: [] }, () => {
      assert.ok(PQ.pautaHipPosq(buildPhysiQPayload().cq).startsWith(PQ.TEXTO_SIN_PROTOCOLO));
    });
    withState({ mecanismo: 'Insidioso', region: 'rodilla', activeHypotheses: ['ro1'] }, () => {
      assert.ok(!buildPhysiQPayload().h.some(x => x.pq));
    });
  });

  test('«Tratada con la cirugía»: con Post-quirúrgico en cualquier hipótesis; deja de contar al cambiar el mecanismo', () => {
    withState({ ...POSQ({ intervencion: 'PTC' }), region: 'cadera', activeHypotheses: ['ca1'],
      testResults: { ca1: { 0: 'pos' } }, hypothesisScores: {} }, () => {
      assert.ok(P4B.casillaTratadaHTML('ca1').includes('Tratada con la cirugía'));
      marcarTratada('ca1', true);
      assert.ok(esTratada('ca1'));
      assert.equal(state.hypothesisScores.ca1.label, PQ.ETIQUETA_TRATADA);
      assert.ok(buildInformeFisioterapiaText().includes(`· ${HYPOTHESES.ca1.name} (intervenida quirúrgicamente)`));
      state.mecanismo = 'Insidioso';
      P4B.sincronizarTratadas();
      assert.ok(!esTratada('ca1'), 'sin Post-quirúrgico la marca no cuenta');
      assert.equal(P4B.casillaTratadaHTML('ca1'), '');
      assert.notEqual(state.hypothesisScores.ca1.label, PQ.ETIQUETA_TRATADA, 'vuelve la puntuación de sus tests');
      assert.ok(state.derivacionResuelta.ca1, 'la marca se conserva');
      state.mecanismo = 'Post-quirúrgico';
      P4B.sincronizarTratadas();
      assert.ok(esTratada('ca1'));
    });
  });

  test('pq1 en el informe con IA: condición de salud con el protocolo como pauta', () => {
    const c = IN.contextoValoracion({ p: 'X', br: [], sq: [], pn: {}, h: [{ name: 'Postoperatorio: PTC', pq: true }] }, r => r, null);
    assert.ok(c.includes('Postoperatorio: PTC (la cirugía es la condición de salud, no una hipótesis por confirmar)'));
    withState({ ...POSQ({ intervencion: 'PTC', protocolo: 'Verbal' }), region: 'cadera', activeHypotheses: ['ca1'],
      testResults: {}, hypothesisScores: {}, treeAnswers: {} }, () => {
      const a = IA.construirAmpliado();
      assert.equal(a.pautas[0].hipotesis, 'Postoperatorio: PTC');
      assert.equal(a.pautas[0].posquirurgica, true);
      assert.equal(a.pautas[0].prom, HIP_POSQUIRURGICA.promPorRegion.cadera);
      const t = IN.bloquesAmpliados(a).join('\n');
      assert.ok(t.includes('Postoperatorio: PTC:\n    · Pauta: Seguir el protocolo del cirujano.'));
    });
  });

  test('árbol: solo codo co_step1 FRACTURA es resoluble, y marcada sale de dv', () => {
    const resolubles = [];
    for (const [r, t] of Object.entries(CIF_TREES)) for (const st of t.steps) for (const o of st.options) {
      if (o.resoluble) { resolubles.push(`${r}/${st.id}/${o.value}`); assert.ok(o.derivacion, 'resoluble sin derivacion'); }
    }
    assert.deepEqual(resolubles, ['codo/co_step1/fractura']);
    withState({ region: 'codo', treeAnswers: { co_step1: 'fractura' }, derivacionResuelta: {} }, () => {
      assert.equal(getDerivacionesArbol().length, 1);
      state.derivacionResuelta.co_step1 = true;
      assert.deepEqual(getDerivacionesArbol(), []);
      assert.deepEqual(buildPhysiQPayload().dv, []);
      assert.ok(!buildInformeFisioterapiaText().includes('Se recomienda valoración médica'));
    });
    withState({ region: 'lumbar', treeAnswers: { lu_step2: 'vascular' }, derivacionResuelta: { lu_step2: true } }, () => {
      assert.equal(getDerivacionesArbol().length, 1, 'la claudicación vascular no se resuelve');
    });
  });

  test('preguntas de traumatismo: nota posquirúrgica solo en las decididas, visible por CSS', () => {
    const conNota = [];
    for (const [r, d] of Object.entries(SYSTEMIC_SCREENING)) for (const sis of d.sistemas) for (const q of sis.preguntas) {
      if (q.notaPosquirurgica) {
        conNota.push(q.id);
        const html = buildSistemaHTML(sis);
        assert.ok(html.includes(`<div class="nota-posq solo-posq">🏥 ${PQ.TEXTO_NOTA_TRAUMA}</div>`), `${r}/${q.id}`);
      }
    }
    assert.deepEqual(conNota.sort(), ['co_t1', 'co_t2', 'cv_ar3', 'h_t1', 'ro_t2', 'ro_t3', 'ro_t4', 'tp_t1']);
    const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
    assert.match(css, /\.solo-posq \{ display: none; \}\nbody\.posquirurgico \.solo-posq \{ display: block; \}/);
  });

  test('informe con IA: bloque «Cirugía», regla del protocolo y hipótesis tratada sin derivar', () => {
    const d = { p: 'X', r: 'hombro', d: '01/01/2026', br: [], sq: [], pn: {},
      h: [{ name: 'Luxación Bloqueada o Fractura (→ Rx)', dt: true }],
      cq: { iv: 'Osteosíntesis', fe: '01/12/2025', se: 4, pr: '', re: '', co: [] } };
    const c = IN.contextoValoracion(d, r => r, null);
    assert.ok(c.includes('Cirugía (paciente posquirúrgico):\n  · Intervención: Osteosíntesis\n  · Fecha: 01/12/2025 (4 semanas)'));
    assert.ok(c.includes('restricciones pendientes de confirmar con el cirujano'));
    assert.ok(c.includes('Luxación Bloqueada o Fractura (diagnóstico ya confirmado y tratado por el médico: es un antecedente)'));
    assert.ok(!c.includes('no se deriva'), 'nada que invite a escribir «no se deriva»');
    const prompt = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
    assert.ok(prompt.includes('Paciente operado (si los datos incluyen «Cirugía»)'));
    assert.ok(prompt.includes('no está marcada como ya diagnosticada y tratada se deriva'));
    const t = IN.bloquesAmpliados({ pautas: [{ hipotesis: 'Fractura', derivar: false, tratada: true, operada: true, pauta: '', fuente: '', prom: '' }] }).join('\n');
    assert.ok(t.includes('Diagnóstico ya confirmado e intervenido: el plan sigue el protocolo del cirujano') && !t.includes('Derivar: sin tratamiento') && !t.includes('no se deriva'));
    withState({ ...POSQ({ intervencion: 'ORIF' }), region: 'hombro', activeHypotheses: ['h11'], testResults: { h11: { 0: 'pos' } },
      hypothesisScores: {}, derivacionResuelta: { h11: true }, treeAnswers: {} }, () => {
      const a = IA.construirAmpliado();
      assert.deepEqual(a.tests, [], 'los tests de una tratada no aplican');
      assert.deepEqual(a.pautas.filter(x => !x.posquirurgica).map(x => [x.derivar, x.tratada, x.operada]), [[false, true, true]]);
    });
  });

  test('informe con IA: el recorrido avisa cuando lo que «orienta a» ya está tratado', () => {
    withState({ ...POSQ({ intervencion: 'Clavo', protocolo: 'Verbal' }), region: 'hombro', activeHypotheses: ['h11'], testResults: {},
      hypothesisScores: {}, derivacionResuelta: { h11: true }, treeAnswers: { h_step2b: 'trauma' } }, () => {
      const a = IA.construirAmpliado();
      assert.equal(a.arbol.find(x => /Traumatismo previo/.test(x.respuesta))?.tratada, true);
      assert.match(IN.bloquesAmpliados(a).join('\n'), /orienta a: luxación bloqueada o fractura; Rx \(ya diagnosticada y tratada: es un antecedente\)/);
      state.derivacionResuelta = {};
      assert.ok(!IA.construirAmpliado().arbol.some(x => x.tratada), 'sin marcar, sin aviso');
    });
  });

  test('huella del informe con IA: las semanas desde la cirugía no la cambian; la intervención sí', () => {
    const base = { p: 'X', d: '01/01/2026', cq: { iv: 'PTR', fe: '', se: 4, pr: 'Escrito', re: '', co: [] } };
    assert.equal(IN.huellaPayload(base), IN.huellaPayload({ ...base, d: '15/01/2026', cq: { ...base.cq, se: 6 } }));
    assert.notEqual(IN.huellaPayload(base), IN.huellaPayload({ ...base, cq: { ...base.cq, iv: 'PTC' } }));
  });

  test('cribado posquirúrgico: el mismo sistema, el primero, en las 7 regiones; preguntas y urgencias decididas', () => {
    const { SIS_POSQUIRURGICO: SIS } = await_comun;
    for (const [r, d] of Object.entries(SYSTEMIC_SCREENING)) assert.equal(d.sistemas[0], SIS, r);
    assert.deepEqual(SIS.preguntas.map(q => q.id), ['pq_herida', 'pq_tvp', 'pq_tvp_ms', 'pq_tep', 'pq_compart', 'pq_sdrc', 'pq_nervio']);
    assert.deepEqual(SIS.preguntas.filter(q => q.urgencia).map(q => q.id), ['pq_herida', 'pq_tvp', 'pq_tvp_ms', 'pq_tep', 'pq_compart', 'pq_nervio']);
    const regiones = Object.keys(SYSTEMIC_SCREENING);
    for (const q of SIS.preguntas) (q.regiones || []).forEach(r => assert.ok(regiones.includes(r), `${q.id}: región ${r}`));
    // Cada región ve una sola pregunta de TVP
    for (const r of regiones) assert.equal(SIS.preguntas.filter(q => q.id.startsWith('pq_tvp') && (!q.regiones || q.regiones.includes(r))).length, 1, r);
    assert.ok(SIS.preguntas.every(q => q.razonamiento?.porque && q.razonamiento?.peso && q.razonamiento?.fuentes?.length), 'todas con razonamiento');
  });

  test('cribado posquirúrgico: solo cuenta con mecanismo Post-quirúrgico y con las preguntas de la región', () => {
    const urg = id => SYSTEMIC_SCREENING.hombro.sistemas[0].preguntas.find(q => q.id === id).urgencia;
    const base = { region: 'hombro', sistemicoAnswers: { pq_herida: 'SI', pq_tvp_ms: 'SI', pq_tvp: 'SI', pq_sdrc: 'SI' }, sistemicoAlerta: true };
    withState({ ...base, mecanismo: 'Traumático', cirugia: cir(), derivacionResuelta: {} }, () => {
      const p = buildPhysiQPayload();
      assert.deepEqual(p.ur, [], 'sin Post-quirúrgico no hay urgencias del sistema');
      assert.deepEqual(p.sq, []);
    });
    withState({ ...base, ...POSQ() }, () => {
      const p = buildPhysiQPayload();
      assert.deepEqual(p.ur, [urg('pq_herida'), urg('pq_tvp_ms')], 'hombro ve pq_tvp_ms, no pq_tvp');
      assert.equal(p.sq.length, 3, 'herida, TVP del brazo y SDRC');
    });
    withState({ ...base, ...POSQ(), region: 'lumbar' }, () => {
      const p = buildPhysiQPayload();
      assert.deepEqual(p.ur.length, 2, 'lumbar: herida y pq_tvp');
      assert.ok(!p.sq.some(t => t.includes('roce de la ropa')), 'el SDRC no se pregunta en lumbar');
    });
    withState({ ...base, ...POSQ(), modo: 'breve', sistemicoBreve: {} }, () => {
      assert.ok(getPendientesBreve().find(x => x.texto.startsWith('Sistemas sin cribar')).texto.includes('Posquirúrgico'));
    });
    withState({ ...base, mecanismo: 'Insidioso', cirugia: cir(), derivacionResuelta: {}, modo: 'breve', sistemicoBreve: {} }, () => {
      assert.ok(!getPendientesBreve().find(x => x.texto.startsWith('Sistemas sin cribar')).texto.includes('Posquirúrgico'));
    });
  });

  test('cribado posquirúrgico: el mecanismo repinta el cribado conservando las respuestas', () => {
    const src = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
    assert.match(src, /if \(groupId === 'mecanismo'\) \{\n    _pintarCirugiaUI\(\);[\s\S]{0,400}_repintarCribado\(\);/);
    const reparto = src.slice(src.indexOf('function _repintarCribado'), src.indexOf('function buildSistemicoQuestions'));
    assert.ok(reparto.indexOf('savedAnswers') < reparto.indexOf('buildSistemicoQuestions(state.region)'), 'guarda antes de repintar');
  });

  test('integración: window, tarjeta en index.html y deploy', () => {
    for (const f of ['updateCirugia', 'selectCirProtocolo', 'toggleCirComplicacion', 'toggleDiagnosticoTratado', 'toggleDerivacionArbolResuelta'])
      assert.equal(typeof window[f], 'function', f);
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    assert.match(html, /<div class="card solo-posq" id="cardCirugia">/);
    const wf = readFileSync(new URL('../.github/workflows/deploy-to-hub.yml', import.meta.url), 'utf8');
    assert.ok(wf.includes('lib/posquirurgico.js'));
  });
}

// ── Fase 5: pauta, pronóstico y tests sin hacer plegados ─────────────────────
console.log('\nfase 5 plegable');
{
  const { partirPrimeraFrase } = await import('../app.js');

  test('partirPrimeraFrase: corta en el primer punto seguido de mayúscula, no en «rec. 1.3.1» ni «p. ej.»', () => {
    assert.deepEqual(partirPrimeraFrase('Ejercicio terapéutico supervisado y progresivo (B). Tras la cirugía, más.'), { primera: 'Ejercicio terapéutico supervisado y progresivo (B).', resto: 'Tras la cirugía, más.' });
    assert.deepEqual(partirPrimeraFrase('Ejercicio adaptado, recomendación firme (rec. 1.3.1). Valorar sesiones.'), { primera: 'Ejercicio adaptado, recomendación firme (rec. 1.3.1).', resto: 'Valorar sesiones.' });
    assert.deepEqual(partirPrimeraFrase('Cargas (p. ej. sentadilla) progresivas.'), { primera: 'Cargas (p. ej. sentadilla) progresivas.', resto: '' });
    assert.deepEqual(partirPrimeraFrase('Una sola frase.'), { primera: 'Una sola frase.', resto: '' });
    // Menos de 40 caracteres: se le suma la siguiente frase
    assert.deepEqual(partirPrimeraFrase('Estadios I–II. Plantillas a medida y estiramientos. Además, fuerza.'),
      { primera: 'Estadios I–II. Plantillas a medida y estiramientos.', resto: 'Además, fuerza.' });
  });

  test('todas las pautas reales se parten sin perder texto y con una primera frase con contenido', () => {
    for (const h of Object.values(HYPOTHESES)) {
      if (!h.dosis || h.dosis === DOSIS_DERIVAR) continue;
      const { primera, resto } = partirPrimeraFrase(h.dosis);
      assert.equal(`${primera} ${resto}`.replace(/\s+/g, ' ').trim(), h.dosis.replace(/\s+/g, ' ').trim(), h.id);
      assert.ok(primera.length >= 40 || !resto, `${h.id}: primera frase demasiado corta («${primera}»)`);
    }
  });

  test('lo que es seguridad no se pliega: la pauta «Derivar» y la nota posquirúrgica quedan fuera del <details>', () => {
    const src = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
    assert.match(src, /!tratada && hyp\.dosis && hyp\.dosis !== DOSIS_DERIVAR\s*\? _pautaPlegableHTML/);
    const tarjeta = src.slice(src.indexOf('_pautaPlegableHTML(hyp.dosis'), src.indexOf('🧭 Pronóstico y derivación'));
    assert.match(tarjeta, /\}`\}\s*\$\{cq && !tratada[^\n]*TEXTO_PAUTA_COMPATIBLE/, 'la nota posquirúrgica va después del bloque de la pauta, no dentro');
    assert.match(src, /addEventListener\('beforeprint'[\s\S]{0,200}#phase5 details:not\(\[open\]\)/, 'al imprimir se despliega');
  });
}

// ── Versión desplegada (lib/version.js) ─────────────────────────────────────
console.log('\nversión desplegada');
{
  const V = await import('../lib/version.js');

  test('en el repo la versión es dev y no se compara con nada', () => {
    assert.equal(V.VERSION_SHA, 'dev');
    assert.equal(V.VERSION_FECHA, '');
    assert.equal(V.textoVersion(), 'dev');
    assert.equal(V.esVersionNueva({ sha: 'a1b2c3d' }), false);
  });

  test('textoVersion: sha y fecha local; sin fecha válida, solo el sha', () => {
    // El año solo cuando no es el actual
    assert.doesNotMatch(V.textoVersion('a1b2c3d', '2026-10-07T12:32:00Z', new Date('2026-12-01')), /2026/);
    assert.match(V.textoVersion('a1b2c3d', '2026-10-07T12:32:00Z', new Date('2026-12-01')), /^a1b2c3d · 7 oct/);
    assert.match(V.textoVersion('a1b2c3d', '2026-10-07T12:32:00Z', new Date('2027-01-02')), /^a1b2c3d · .*2026/);
    assert.equal(V.textoVersion('a1b2c3d', ''), 'a1b2c3d');
    assert.equal(V.textoVersion('a1b2c3d', 'basura'), 'a1b2c3d');
  });

  test('esVersionNueva: solo un sha válido y distinto del cargado', () => {
    assert.equal(V.esVersionNueva({ sha: 'ffffff0' }, 'a1b2c3d'), true);
    assert.equal(V.esVersionNueva({ sha: 'a1b2c3d' }, 'a1b2c3d'), false);
    for (const raro of [null, {}, { sha: '' }, { sha: 'dev' }, { sha: '<b>x</b>' }, { sha: 42 }])
      assert.equal(V.esVersionNueva(raro, 'a1b2c3d'), false, JSON.stringify(raro));
  });

  test('deploy: copia lib/version.js, sustituye las dos líneas y publica version.json', () => {
    const src = readFileSync(new URL('../lib/version.js', import.meta.url), 'utf8');
    assert.match(src, /^export const VERSION_SHA = 'dev';$/m, 'deploy-to-hub.yml busca esta línea exacta');
    assert.match(src, /^export const VERSION_FECHA = '';$/m, 'deploy-to-hub.yml busca esta línea exacta');
    const wf = readFileSync(new URL('../.github/workflows/deploy-to-hub.yml', import.meta.url), 'utf8');
    assert.ok(/cp lib\/[^\n]*lib\/version\.js[^\n]*physiq-hub\/assessment\/lib\//.test(wf), 'lib/version.js se copia al hub');
    assert.ok(wf.includes("s/^export const VERSION_SHA = 'dev';$/"));
    assert.ok(wf.includes("s/^export const VERSION_FECHA = '';$/"));
    assert.ok(wf.includes('physiq-hub/assessment/version.json'));
  });

  test('la comprobación no provoca un bucle de «Hay una versión nueva» tras recargar', () => {
    const src = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
    // version.json por su URL normal, como el código: un ?t= único lo traía
    // nuevo mientras lib/version.js seguía en caché
    assert.match(src, /fetch\('\.\/version\.json', \{ cache: 'no-store' \}\)/);
    assert.doesNotMatch(src, /version\.json\?t=/);
    // «Recargar» vuelve a pedir los archivos propios antes de recargar
    const rec = src.slice(src.indexOf('function recargarVersionNueva'), src.indexOf('function toggleSessionPanel'));
    assert.match(rec, /await _refrescarArchivosApp\(\);\s*location\.reload\(\);/);
    assert.match(src, /fetch\(u, \{ cache: 'reload' \}\)/);
    // y el panel ofrece comprobarlo a mano
    assert.match(src, /id="sessionVersionComprobar">Comprobar</);
    // con versión nueva, el mismo hueco: «Actualizar» en naranja, sin texto aparte
    assert.match(src, /session-version-btn-nueva" id="sessionVersionRecargar"[^>]*>Actualizar</);
    assert.doesNotMatch(src, /hay una más reciente/);
    // el aviso flotante usa la misma palabra que el panel
    assert.match(src, /id="versionAvisoRecargar">Actualizar</);
  });

  test('sw.js no sirve ni guarda version.json desde la caché', () => {
    const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
    assert.match(sw, /if \(url\.pathname\.endsWith\('\/version\.json'\)\) return;/);
  });
}

// ── Revisión automática del informe (lib/revision-informe.js) ────────────────
console.log('\npaquete de revisión del informe con IA');
{
  const Z = await import('../lib/zip.js');
  const PR = await import('../lib/paquete-revision.js');
  const await_VJ = await import('../lib/valoracion-json.js');
  const VJ_LEER = t => await_VJ.leerImportacion(t, Object.keys(SYSTEMIC_SCREENING));
  // Lector mínimo del zip «stored» para comprobar lo que escribe lib/zip.js
  const leerZip = bytes => {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const dec = new TextDecoder();
    const fin = bytes.length - 22;
    assert.equal(dv.getUint32(fin, true), 0x06054b50, 'fin del directorio central');
    const n = dv.getUint16(fin + 10, true);
    let p = dv.getUint32(fin + 16, true);
    const out = [];
    for (let i = 0; i < n; i++) {
      assert.equal(dv.getUint32(p, true), 0x02014b50, 'entrada central');
      assert.equal(dv.getUint16(p + 8, true) & 0x0800, 0x0800, 'nombres en UTF-8');
      const crc = dv.getUint32(p + 16, true), tam = dv.getUint32(p + 20, true), ln = dv.getUint16(p + 28, true), off = dv.getUint32(p + 42, true);
      const nombre = dec.decode(bytes.subarray(p + 46, p + 46 + ln));
      assert.equal(dv.getUint32(off, true), 0x04034b50, 'cabecera local');
      const ini = off + 30 + dv.getUint16(off + 26, true);
      const datos = bytes.subarray(ini, ini + tam);
      assert.equal(Z.crc32(datos), crc, `CRC de ${nombre}`);
      out.push({ nombre, texto: dec.decode(datos) });
      p += 46 + ln;
    }
    return out;
  };
  test('zip: los ficheros vuelven tal cual, con acentos en nombre y contenido y CRC correcto', () => {
    const f = [{ nombre: 'lucía-informe.txt', texto: 'Dolor en la ingle, ñandú\n' }, { nombre: 'vacio.txt', texto: '' }, { nombre: 'b.json', texto: '{"a":1}' }];
    assert.deepEqual(leerZip(Z.crearZip(f, new Date(2026, 9, 9, 10, 30))), f);
    assert.equal(Z.crc32(new TextEncoder().encode('123456789')), 0xCBF43926, 'CRC-32 de referencia');
  });
  const ahora = new Date(2026, 9, 9, 10, 30);
  const st = { ...JSON.parse(JSON.stringify(state)), patient: 'Daniel Ortega', region: 'cadera', maxVisitedIdx: 5, currentPhase: 5 };
  const inf = { texto: '## CONDICIÓN DE SALUD\n\nTexto.', transcripcion: 'Daniel refiere dolor.', fecha: '2026-10-09T08:00:00Z', conAudio: true, dictado: true,
    plantilla: 'narrativo', prompt: 'PROMPT EXACTO', version: 'abc1234', huella: 'x' };
  const puntos = [{ id: 'constantes', nivel: 'medio', mensaje: 'Clasifica las constantes.', cita: 'dentro de parámetros habituales' }, { id: 'urgencia', nivel: 'alto', mensaje: 'Falta la derivación.' }];
  test('paquete: nombres como en tests/fixtures/informes, comandos para reproducir y la valoración importable', () => {
    const { nombre, ficheros } = PR.ficherosPaquete({ inf, informe: 'INFORME DE FISIOTERAPIA\nPaciente: Daniel Ortega\n\nTexto.', state: { ...st, informeIA: inf }, puntos,
      comprobaciones: ['Cada indicación…'], nombrePlantilla: 'Narrativo', versionActual: 'def5678', ahora });
    assert.equal(nombre, 'revision-informe-daniel-ortega-2026-10-09.zip');
    assert.deepEqual(ficheros.map(f => f.nombre), ['info.txt', 'daniel-ortega-dictado-informe.txt', 'daniel-ortega-dictado-transcripcion.txt', 'revision.txt', 'valoracion-daniel-ortega.json', 'prompt.txt']);
    const de = n => ficheros.find(f => f.nombre === n).texto;
    assert.match(de('info.txt'), /node tools\/revisar-informe\.mjs valoracion-daniel-ortega\.json daniel-ortega-dictado-informe\.txt narrativo --transcripcion daniel-ortega-dictado-transcripcion\.txt/);
    assert.match(de('info.txt'), /node tools\/prompt-desde-json\.mjs valoracion-daniel-ortega\.json narrativo --dictado/);
    assert.match(de('info.txt'), /versión abc1234/);
    assert.match(de('info.txt'), /versión def5678/);
    assert.match(de('info.txt'), /Audio: dictado del fisioterapeuta/);
    assert.match(de('info.txt'), /2 puntos \(1 de nivel alto\)/);
    assert.equal(de('prompt.txt'), 'PROMPT EXACTO');
    const r = VJ_LEER(de('valoracion-daniel-ortega.json'));
    assert.ok(r.ok, r.error);
    assert.ok(!('informeIA' in r.assessmentState), 'sin el informe, como «⬇ Exportar»');
    assert.match(de('revision.txt'), /^\[MEDIO\] constantes: Clasifica las constantes\.\n   «dentro de parámetros habituales»/m, 'mismo formato que tools/revisar-informe.mjs');
    assert.match(de('revision.txt'), /ANTES DE COMPARTIR, COMPRUEBA\n- Cada indicación…/);
    assert.ok(leerZip(Z.crearZip(ficheros, ahora)).length === 6, 'el zip sale entero');
  });
  test('paquete: sin audio, sin prompt guardado (informe anterior) y sin puntos', () => {
    const viejo = { texto: 'T', fecha: '', conAudio: false, plantilla: 'breve' };
    const { ficheros } = PR.ficherosPaquete({ inf: viejo, informe: 'T', state: st, ahora });
    assert.deepEqual(ficheros.map(f => f.nombre), ['info.txt', 'daniel-ortega-sin-audio-ficha-breve.txt', 'revision.txt', 'valoracion-daniel-ortega.json']);
    const info = ficheros[0].texto;
    assert.match(info, /Prompt: no guardado/);
    assert.match(info, /no registrada/);
    assert.match(info, /revisar-informe\.mjs valoracion-daniel-ortega\.json daniel-ortega-sin-audio-ficha-breve\.txt breve\n/);
    assert.match(info, /prompt-desde-json\.mjs valoracion-daniel-ortega\.json breve\n/);
    assert.match(ficheros[2].texto, /sin incidencias/);
    assert.equal(PR.ficherosPaquete({ inf: { ...viejo, conAudio: true, transcripcion: 'Hola' }, informe: 'T', state: st, ahora }).ficheros[1].nombre, 'daniel-ortega-audio-ficha-breve.txt');
  });
  test('paquete: la tarjeta guarda el prompt y la versión al generar, y el botón está expuesto', () => {
    const src = readFileSync(new URL('../informe-ia.js', import.meta.url), 'utf8');
    assert.match(src, /prompt,\s+\/\/ el exacto que se envió/);
    assert.match(src, /version: VERSION_SHA,/);
    assert.match(src, /import\('\.\/lib\/zip\.js'\)/, 'zip con import() dinámico: solo al usarlo');
    assert.equal(typeof globalThis.iaPaqueteRevision, 'function');
  });
}

console.log('\nrevisión automática del informe con IA');
{
  const RI = await import('../lib/revision-informe.js');
  const base = { p: 'Pedro Flores', d: '07/10/2026', r: 'hombro', la: 'Derecho', nr: 4, br: [], sq: [], pn: { variableControl: 'Parar si supera 4/10.' }, md: 'completo',
    h: [{ name: 'Lesión Labral Superior (SLAP)' }, { name: 'Luxación Bloqueada o Fractura (→ Rx)', dt: true }, { name: 'Postoperatorio: clavo', pq: true }],
    fp: [{ s: 'Hombro', q: '¿Le han dicho alguna vez que tiene…?', a: 'Diabetes o el azúcar alto: No · Problemas de tiroides: No sé' }] };
  const amp = { edad: 52, sexo: 'Hombre', pautas: [] };
  const rev = (t, o = {}) => RI.revisarInforme(t, { datos: { ...base, ...o.datos }, ampliado: { ...amp, ...o.ampliado }, plantilla: o.plantilla || 'narrativo', transcripcion: o.transcripcion || '' });
  const ids = (t, o) => rev(t, o).map(p => p.id);
  const limpio = 'Paciente de 52 años con dolor en el hombro derecho de 4/10. La lesión labral superior queda apoyada por los tests.';

  test('revisión: un informe correcto no da puntos', () => {
    assert.deepEqual(rev(limpio), []);
  });
  test('revisión: derivaciones que faltan son de nivel alto y van primero', () => {
    const p = rev(limpio + ' Se recomienda descansar.', { datos: { ur: ['TVP: urgencias'] }, ampliado: { pautas: [{ hipotesis: 'Fractura', derivar: true }] } });
    assert.equal(p[0].nivel, 'alto');
    assert.ok(p.some(x => x.id === 'derivacion-urgente') && p.some(x => x.id === 'derivar-hipotesis'));
    assert.ok(!ids(limpio + ' Se deriva a urgencias hoy.', { datos: { ur: ['x'] } }).includes('derivacion-urgente'));
    assert.ok(!ids(limpio, { ampliado: { pautas: [{ hipotesis: 'Fractura', derivar: true, tratada: true }] } }).includes('derivar-hipotesis'), 'tratada: no se exige derivar');
  });
  test('revisión: lado, edad, sexo y NRS que contradicen la valoración', () => {
    assert.ok(ids('Dolor en el hombro izquierdo.').includes('lado'));
    assert.ok(ids('Hombro derecho.', { datos: { la: '' } }).includes('lado-no-consta'));
    assert.ok(!ids('Hombro derecho.', { datos: { la: '' }, transcripcion: 'me duele el derecho' }).includes('lado-no-consta'), 'lo dijo en consulta');
    assert.ok(ids('Paciente de 43 años.').includes('edad'));
    assert.ok(ids('Paciente de 43 años.', { ampliado: { edad: null } }).includes('edad-no-consta'));
    assert.ok(ids('Mujer de 52 años.').includes('sexo'));
    assert.ok(ids('Varón de 52 años.', { ampliado: { sexo: '' } }).includes('sexo-no-consta'));
    assert.ok(ids('Dolor de 6/10.').includes('nrs'));
    assert.ok(!ids('Dolor de 4 sobre 10 y control a 4/10.').includes('nrs'));
    // Un rango (irritabilidad «4-6/10») no valida el 6 suelto
    assert.ok(ids('Dolor de 6/10.', { datos: { ir: 'Media (4-6/10)' } }).includes('nrs'));
    // Con audio: el pico «un 8 de 10» (o «ocho de diez») dicho en la consulta vale
    assert.ok(!ids('Llega a 8 sobre 10 al correr.', { transcripcion: 'llega a un 8 de 10' }).includes('nrs'));
    assert.ok(!ids('Llega a 8/10 al correr.', { transcripcion: 'llega a un ocho de diez' }).includes('nrs'));
    assert.ok(ids('Llega a 9/10 al correr.', { transcripcion: 'llega a un 8 de 10' }).includes('nrs'));
    // …y la respuesta suelta tras «¿cuánto te duele de 0 a 10?» (Daniel: «llegó a un 7»)
    const tr10 = '¿Cuánto te duele de 0 a 10? Ahora un 4. El domingo pasado, después del partido, llegó a un 7. ¿Notas algún ruido?';
    assert.ok(!ids('Tras el partido llegó a 7 sobre 10.', { transcripcion: tr10 }).includes('nrs'));
    assert.ok(ids('Tras el partido llegó a 9 sobre 10.', { transcripcion: tr10 }).includes('nrs'));
    assert.ok(ids('Llega a 9/10.', { transcripcion: 'Me lo dijo un 9 de cada diez médicos.' }).includes('nrs'), 'sin la pregunta, «un 9» no cuenta');
    // El otro lado dicho en la consulta: punto medio a comprobar, no contradicción
    const otro = rev('También molestias en el hombro izquierdo.', { transcripcion: 'el izquierdo también me molesta' });
    assert.ok(otro.some(x => x.id === 'lado-otro' && x.nivel === 'medio') && !otro.some(x => x.id === 'lado'));
  });
  test('revisión: reglas de redacción (nombre, fecha, jerga, descarta, relleno, fuentes, secuelas)', () => {
    assert.ok(ids('Pedro Flores refiere dolor.').includes('nombre'));
    assert.ok(ids('Valorado el 07/10/2026.').includes('fecha'));
    assert.ok(ids('El test tiene un LR+ de 3.').includes('jerga'));
    assert.ok(ids('La exploración permite descartar origen cervical.').includes('descarta'));
    assert.ok(!ids('Las comprobaciones no la descartan.').includes('descarta'), '«no la descartan» es correcto');
    assert.ok(ids('No se dispone de goniometría.').includes('relleno'));
    assert.ok(!ids('No se identifican banderas rojas.').includes('relleno'), '«No se identifican» no es «No sé»');
    assert.ok(ids('Según el formulario, refiere dolor.').includes('fuentes'));
    assert.ok(ids('Según la variable de control, parar a 4/10.').includes('fuentes'));
    for (const f of ['Según el cuestionario inicial, refiere dolor.', 'Este dato no se confirma en la conversación clínica.',
      'Dolor al sentarse, aunque no se menciona en consulta.', 'Niega dolor nocturno, aunque en consulta refiere despertares.',
      'Sin dolor nocturno inicialmente referido.'])
      assert.ok(ids(f).includes('fuentes'), f);
    assert.ok(!ids('Acude a consulta por dolor en el hombro derecho.').includes('fuentes'), '«acude a consulta» es correcto');
    assert.ok(ids('La exploración confirma la hipótesis de lesión labral.').includes('confirma'));
    for (const f of ['Hipótesis de trabajo, pendiente de confirmar.', 'Restricciones a confirmar con el cirujano.',
      'La exploración confirma dolor anterior durante la sentadilla.', 'Los tests no confirman la hipótesis.'])
      assert.ok(!ids(f).includes('confirma'), f);
  });
  test('revisión: edad repetida y criterio de reconsiderar fuera de Seguimiento', () => {
    assert.ok(ids('Paciente de 52 años. ### Factores Personales Hombre de 52 años.').includes('repetido'));
    assert.ok(!ids(limpio).includes('repetido'));
    const fuera = '## CONCLUSIONES\nEjercicio. Si a las 12 semanas no mejora, reconsiderar el diagnóstico.\n## SEGUIMIENTO FUNCIONAL\nKujala.';
    assert.ok(ids(fuera).includes('seguimiento-fuera'));
    assert.ok(!ids('## CONCLUSIONES\nEjercicio.\n## SEGUIMIENTO FUNCIONAL\nSi no mejora en 12 semanas, reconsiderar.').includes('seguimiento-fuera'));
    assert.ok(!ids(fuera, { plantilla: 'breve' }).includes('seguimiento-fuera'), 'la ficha no tiene Seguimiento');
    assert.ok(ids('Hallazgos propios de la fase de consolidación.').includes('fisiopatologia'));
    assert.ok(ids('Secuelas esperables de la cirugía.').includes('fisiopatologia'));
  });
  test('revisión: «No sé» convertido en negativo', () => {
    const p = rev(limpio + ' No refiere diabetes ni problemas tiroideos.');
    const n = p.find(x => x.id === 'no-se');
    assert.ok(n && /tiroides/.test(n.mensaje), JSON.stringify(p));
    assert.ok(!ids(limpio + ' No refiere diabetes.').includes('no-se'), 'la diabetes sí se contestó «No»');
  });
  test('revisión: códigos CIF según la plantilla', () => {
    assert.ok(ids('Dolor (b28016) al correr (d4552).', { plantilla: 'breve' }).every(i => i !== 'cif'));
    assert.match(rev('Dolor al entrenar (e1101).', { plantilla: 'breve' }).find(x => x.id === 'cif').mensaje, /e1101/);
    assert.ok(ids('Dolor (b28016).', { plantilla: 'narrativo' }).includes('cif'), 'el narrativo no lleva códigos');
  });
  test('revisión: hipótesis sin nombrar (no las tratadas ni la posquirúrgica), modo breve y longitud', () => {
    const p = rev('Paciente de 52 años con dolor en el hombro derecho.');
    assert.match(p.find(x => x.id === 'hipotesis').mensaje, /Lesión Labral Superior \(SLAP\)/);
    assert.ok(!/Luxación|Postoperatorio/.test(p.find(x => x.id === 'hipotesis').mensaje));
    assert.ok(ids(limpio, { datos: { md: 'breve' } }).includes('breve'));
    assert.ok(!ids(limpio + ' Valoración breve; queda pendiente el cribado.', { datos: { md: 'breve' } }).includes('breve'));
    assert.ok(ids(limpio + ' palabra'.repeat(950), { plantilla: 'breve' }).includes('longitud'));
  });
  test('revisión: hallazgos atribuidos a la evolución esperable', () => {
    assert.ok(ids('La rigidez es coherente con la evolución esperable en el período posquirúrgico.').includes('atribucion'));
    assert.ok(ids('Restricción compatible con el período posquirúrgico.').includes('atribucion'));
    assert.ok(!ids('Restricción global de la movilidad pasiva, compatible con el contexto traumático previo.').includes('atribucion'), 'el trauma viene del recorrido');
  });
  test('revisión: discrepancia escrita en dos frases (y no cuando va en una)', () => {
    const p = rev('Describe episodios ocasionales de parestesia en la mano. Niega crujidos, bloqueos o parestesias intermitentes.');
    assert.match(p.find(x => x.id === 'discrepancia-separada')?.mensaje || '', /^Hormigueo/);
    assert.ok(ids('No refiere dolor en sedestación prolongada. La sedestación prolongada aumenta el dolor.').includes('discrepancia-separada'));
    assert.ok(!ids('Refiere que el dolor no le despierta por la noche, aunque también describe despertares ocasionales al girarse.').includes('discrepancia-separada'), 'las dos versiones juntas es lo correcto');
    assert.ok(!ids('No refiere hormigueo, aunque alguna noche nota la mano dormida.').includes('discrepancia-separada'));
    assert.ok(!ids('Dolor de 6/10 por la noche. Realiza la sentadilla sin dolor.').includes('discrepancia-separada'), '«sentadilla» no es sedestación');
  });
  test('revisión: fecha de la cirugía repetida', () => {
    const cq = { datos: { cq: { fe: '15/06/2026' } } };
    assert.ok(ids('Operado el 15 de junio de 2026. ### Intervención Quirúrgica Se realizó el 15/06/2026.', cq).includes('repetido'));
    assert.ok(!ids('Operado el 15 de junio de 2026. Revisión en noviembre.', cq).includes('repetido'));
    assert.ok(!ids('El 15 de junio y el 15 de junio.').includes('repetido'), 'sin cirugía no se mira');
  });
  test('revisión: síntoma copiado de un ejemplo (despertares) solo si no consta', () => {
    const t = 'Dolor de 4/10, aunque también describe despertares ocasionales al girarse en la cama.';
    const p = rev(t);
    assert.ok(p[0].id === 'inventado' && p[0].nivel === 'alto', JSON.stringify(p));
    assert.ok(!ids(t, { transcripcion: '¿Te despierta por la noche? Alguna noche sí.' }).includes('inventado'), 'lo dijo en consulta');
    assert.ok(!ids(t, { datos: { fp: [{ s: 'General', q: '¿Le despierta el dolor por la noche?', a: 'A veces' }] } }).includes('inventado'), 'lo contestó en el formulario');
  });
  test('revisión: secciones fuera del orden de la plantilla (solo narrativo)', () => {
    const bien = '## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES\nx\n### Factores Personales\nx\n## HISTORIA CLÍNICA Y EVOLUCIÓN\n### Intervención Quirúrgica\nx\n### Cribado de Seguridad\nx';
    assert.ok(!ids(bien).includes('estructura'));
    const mal = '## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES\n### Intervención Quirúrgica\nx\n### Cribado de Seguridad\nx\n## HISTORIA CLÍNICA Y EVOLUCIÓN\n### Presentación Inicial y Antecedentes\nx';
    assert.match(rev(mal).find(x => x.id === 'estructura')?.mensaje || '', /«Intervención Quirúrgica», «Cribado de Seguridad»/);
    assert.ok(!ids(mal, { plantilla: 'breve' }).includes('estructura'));
    // El texto copiado (sin #) también vale: los títulos son líneas enteras
    assert.ok(ids(mal.replace(/#+ /g, '')).includes('estructura'));
  });
  test('revisión: «cuestionario QuickDASH» no es una fuente; tratamientos negados y «escenario posquirúrgico»', () => {
    assert.ok(!ids('Se utilizará el cuestionario QuickDASH para medir la evolución.').includes('fuentes'));
    assert.ok(ids('Según el cuestionario inicial, refiere dolor.').includes('fuentes'));
    assert.ok(ids('El recorrido de la exploración muestra restricción.').includes('fuentes'));
    assert.ok(ids('No se refieren tratamientos específicos previos.').includes('relleno'));
    assert.ok(ids('El conjunto de hallazgos es coherente con el escenario posquirúrgico.').includes('atribucion'));
  });
  test('revisión: sin sexo registrado, el género no se marca', () => {
    const sin = { ampliado: { sexo: '' } };
    for (const f of ['Niega dolor al permanecer sentada.', 'Las preocupaciones de la paciente.', 'El paciente refiere dolor.'])
      assert.ok(ids(f, sin).includes('genero'), f);
    assert.ok(!ids('Su hermano fue operado de la columna. Paciente de 63 años.', sin).includes('genero'), 'un familiar operado o «Paciente de…» no marcan el género');
    assert.ok(!ids('Niega dolor al permanecer sentado.').includes('genero'), 'con sexo registrado no se mira');
  });
  test('revisión: «se deriva… para descartar» y «Cuestionario de Roland-Morris» no son fallos', () => {
    assert.ok(!ids('Se deriva al médico para valorar la circulación y descartar claudicación vascular.').includes('descarta'));
    assert.ok(ids('La exploración permite descartar origen cervical.').includes('descarta'));
    assert.ok(!ids('Se recomienda el Cuestionario de Discapacidad de Roland-Morris.').includes('fuentes'));
    assert.ok(!ids('Se usará el cuestionario de Oswestry.').includes('fuentes'));
    assert.ok(ids('Según el cuestionario inicial, refiere dolor.').includes('fuentes'));
  });
  test('revisión: «en la conversación», el formulario pendiente en modo breve y el cirujano repetido', () => {
    assert.ok(ids('En la conversación precisa que el dolor es de 4/10.').includes('fuentes'));
    const pend = 'Valoración breve: quedan pendientes el cribado detallado y el formulario previo.';
    assert.ok(!ids(pend, { datos: { md: 'breve' } }).includes('fuentes'), 'en modo breve, el formulario pendiente es un pendiente');
    assert.ok(ids(pend + ' La variable de control es el dolor.', { datos: { md: 'breve' } }).includes('fuentes'), 'sigue buscando después');
    assert.ok(ids(pend).includes('fuentes'), 'fuera de modo breve sigue contando');
    const cir = 'Pendiente de confirmar con el cirujano. Se supedita a lo que confirme el cirujano. Una vez confirmado con el cirujano, se progresará.';
    assert.match(rev(cir).find(x => x.id === 'repetido')?.mensaje || '', /cirujano aparece 3 veces/);
    assert.ok(!ids('Restricciones pendientes de confirmar con el cirujano. Ejercicio.').includes('repetido'));
  });
  test('revisión: plan con derivación urgente, diagnósticos que no constan e IMC clasificado', () => {
    const plan = '## CONCLUSIONES Y PLAN DE TRATAMIENTO\nSe deriva a urgencias hoy. Después, manipulación cervical y ejercicio terapéutico.\n## SEGUIMIENTO FUNCIONAL\nNDI.';
    const p = rev(plan, { datos: { ur: ['Cefalea con signos de alarma: derivación a urgencias hoy.'] } });
    assert.ok(p.some(x => x.id === 'plan-urgente' && x.nivel === 'alto'), JSON.stringify(p));
    assert.ok(!ids(plan).includes('plan-urgente'), 'sin derivación urgente, el plan es normal');
    assert.ok(!ids('## CONCLUSIONES Y PLAN DE TRATAMIENTO\nSe deriva a urgencias hoy; se retomará la valoración tras la valoración médica.', { datos: { ur: ['x'] } }).includes('plan-urgente'));
    assert.match(rev('Para descartar hemorragia subaracnoidea o patología intracraneal.').find(x => x.id === 'diagnostico')?.mensaje || '', /«hemorragia», «intracraneal»/);
    assert.ok(!ids('Antecedente de cáncer de mama.', { transcripcion: 'tuve un cáncer de mama' }).includes('diagnostico'), 'lo dijo en consulta');
    assert.ok(!ids('Requiere valoración médica urgente para descartar otras causas.').includes('descarta'), 'descartar en una frase de valoración médica es correcto');
    assert.ok(ids('IMC de 25,2 (normopeso).', { datos: { an: { imc: 25.2 } } }).includes('imc'));
    assert.ok(!ids('IMC de 25,2 (sobrepeso).', { datos: { an: { imc: 25.2 } } }).includes('imc'));
    assert.ok(!ids('IMC de 22 (normopeso).', { datos: { an: { imc: 22 } } }).includes('imc'));
  });
  test('revisión: «para descartar» algo que no consta y negativos en Limitaciones (decimoquinta revisión)', () => {
    const dx = ids(limpio + ' Si no mejora, ecografía para descartar bursitis o comunicación de la vaina.');
    assert.ok(dx.includes('descartar-inventado'));
    assert.ok(!dx.includes('descarta'), 'la misma frase no sale dos veces');
    assert.ok(!ids(limpio + ' Se pide ecografía para descartar bursitis.', { transcripcion: 'creo que es una bursitis' }).includes('descartar-inventado'), 'consta en la consulta');
    assert.ok(!ids(limpio + ' Se pedirá valoración para descartar otras causas de dolor persistente.').includes('descartar-inventado'), 'palabras genéricas');
    assert.ok(!ids(limpio + ' La exploración permite descartar origen cervical.').includes('descartar-inventado'), 'solo «para descartar»');
    const lim = '## ANÁLISIS DEL FUNCIONAMIENTO\n### Limitaciones en las Actividades\nLe cuesta chutar. No refiere limitación al caminar ni al calzarse.\n### Restricciones en la Participación\nFútbol.';
    assert.ok(ids(lim).includes('limitaciones-negativas'));
    assert.ok(ids(lim.replace('No refiere limitación al caminar ni al calzarse.', 'Niega dolor al toser.')).includes('limitaciones-negativas'));
    assert.ok(!ids(lim.replace('No refiere limitación al caminar ni al calzarse.', '')).includes('limitaciones-negativas'));
    assert.ok(!ids('### Dolor\nNiega dolor al toser.\n### Limitaciones en las Actividades\nLe cuesta chutar.\n### Restricciones en la Participación\nX.').includes('limitaciones-negativas'), 'en Dolor sí van');
    assert.ok(!ids(lim, { plantilla: 'breve' }).includes('limitaciones-negativas'));
  });
  test('prompt: tests con «o» marcados, pronóstico como contexto, tiempos e imagen (decimoquinta revisión)', () => {
    const b = IN.bloquesAmpliados({ tests: [{ hipotesis: 'Psoas', items: [
      { test: 'Palpación dolorosa supra o infrainguinal', resultado: 'positivo' },
      { test: 'Flexión resistida o extensión pasiva en Thomas modificado', resultado: 'negativo' },
      { test: 'Test de Thomas', resultado: 'positivo' }] }] }).join('\n');
    assert.match(b, /supra o infrainguinal: positivo \(positivo si se cumple al menos una de las alternativas: descríbelo con las mismas palabras, sin afirmar las dos\)/);
    assert.ok(!/Thomas modificado: negativo \(positivo si/.test(b), 'solo los positivos');
    assert.ok(!/Test de Thomas: positivo \(/.test(b), 'solo los que tienen alternativas');
    const p = IN.PLANTILLAS.narrativo.prompt({ p: 'X', h: [{ name: 'H' }] }, { conAudio: true });
    assert.match(p, /«hace X» se refiere al día de la consulta/);
    assert.match(p, /Pruebas de imagen y derivaciones: recógelas solo como las indicó el fisioterapeuta, sin añadir qué se busca con ellas/);
  });
  test('prompt: modo dictado — cabecera, quién habla y pista de Whisper (decimosexta revisión)', () => {
    const d = { p: 'X', h: [{ name: 'H' }] };
    for (const [k, pl] of Object.entries(IN.PLANTILLAS)) {
      const dic = pl.prompt(d, { conAudio: true, dictado: true });
      assert.match(dic, /DICTADO DEL FISIOTERAPEUTA \(transcripción de lo que narra el fisioterapeuta/, `${k}: cabecera del dictado`);
      assert.match(dic, /En él habla solo el fisioterapeuta: lo que dice en primera persona.*son sus hallazgos e indicaciones; lo que introduce con «refiere», «dice» o «comenta» es lo que refiere el paciente/, `${k}: quién habla`);
      assert.match(dic, /no la he hecho»\) no se hizo/, `${k}: lo no hecho no se describe`);
      const dia = pl.prompt(d, { conAudio: true });
      assert.ok(!/DICTADO/.test(dia) && /La transcripción complementa/.test(dia), `${k}: el diálogo no cambia`);
      assert.ok(!/DICTADO/.test(pl.prompt(d, { conAudio: false, dictado: true })), `${k}: sin audio no hay dictado`);
      assert.match(dic, /«dictado»/, `${k}: «dictado» entre las fuentes que no se nombran`);
    }
    assert.match(IN.getWhisperPrompt('cadera', { dictado: true }), /^Dictado de un fisioterapeuta.*Thomas modificado/);
    assert.ok(!/Dictado/.test(IN.getWhisperPrompt('cadera')), 'sin dictado, la pista de siempre');
    assert.match(IN.getWhisperPrompt('cadera'), /Ingle, dolor inguinal, psoas ilíaco, Thomas modificado/);
    assert.deepEqual(Object.keys(IN.MODOS_AUDIO), ['dialogo', 'dictado']);
  });
  test('formulario para la IA: en las matrices de actividades solo van las filas «Sí»', () => {
    const dir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'informes');
    const p = execFileSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), '..', 'tools', 'prompt-desde-json.mjs'), join(dir, 'valoracion-daniel-ortega-cadera.json'), 'narrativo'], { encoding: 'utf8' });
    assert.match(p, /Agacharse o sentarse en una silla baja: Sí/);
    assert.ok(!/Caminar: No/.test(p) && !/Cruzar las piernas: No/.test(p), 'los «No» de actividades no van');
    assert.match(p, /se engancha o se bloquea: No/, 'los «No» de síntomas sí van');
  });
  test('revisión: frecuencia inferida de una actividad («con regularidad», «de forma habitual»)', () => {
    const fq = (texto, fuente = '') => RI.frecuenciaInferida(texto, fuente);
    assert.equal(fq('Practica ciclismo de manera habitual.')?.actividad, 'el ciclismo');
    assert.equal(fq('Acude al gimnasio con regularidad.')?.actividad, 'el gimnasio');
    assert.equal(fq('Mantiene actividad física regular en bicicleta.')?.actividad, 'el ciclismo');
    assert.equal(fq('Practica carrera de forma regular.', '· ¿hace a menudo alguna de estas cosas? (puede marcar varias) → Correr'), null, 'el formulario da la frecuencia (pregunta y respuesta en la misma línea)');
    assert.equal(fq('Sale en bici con regularidad.', '¿Sales en bici? Sí, cada domingo.'), null, 'la consulta da la frecuencia');
    assert.ok(fq('Acude al gimnasio con regularidad.', 'Trabajo con los brazos por encima de la cabeza a menudo. El sábado, haciendo pesas en el gimnasio, me dio'), 'una frecuencia de otra actividad no vale');
    assert.equal(fq('La intensidad habitual del dolor es 6/10.'), null, 'sin actividad no cuenta');
    assert.equal(fq('Practica ciclismo.'), null, 'sin frecuencia no cuenta');
    assert.equal(fq('Dolor en condiciones habituales durante la carrera.'), null, '«condiciones habituales» no es una frecuencia');
    assert.ok(ids('Practica ciclismo de manera habitual.').includes('frecuencia'));
  });
  test('revisión: formulario contradicho, propiedades de un test, fallo articular separado', () => {
    const fp = [{ s: 'Rodilla', q: '¿Nota alguna de estas cosas?', a: 'Un chasquido o un clic que le duele: Sí · Le falla o cede: No' }];
    const rv = texto => RI.revisarInforme(texto, { datos: { p: 'X', r: 'cadera', d: '01/01/2026', br: [], sq: [], pn: {}, h: [], fp } }).map(p => p.id);
    assert.ok(rv('Refiere un chasquido por delante de la cadera que no le duele.').includes('formulario-contradicho'));
    assert.ok(!rv('Refiere un chasquido doloroso por delante de la cadera.').includes('formulario-contradicho'));
    assert.ok(!rv('Refiere un chasquido que le duele, aunque hoy dice que no le duele.').includes('formulario-contradicho'), 'las dos versiones en una frase');
    assert.ok(!rv('Refiere un chasquido al subir la pierna, y niega dolor en reposo.').includes('formulario-contradicho'), 'la negación es de otra cláusula');
    assert.ok(rv('El test de Thomas es el más específico.').includes('test-propiedades'));
    assert.ok(rv('Al pivotar nota que la rodilla se le iba. Niega que le falle o ceda.').includes('discrepancia-separada'));
    assert.ok(!rv('Niega mareo o inestabilidad. El test de inestabilidad en prono es positivo.').includes('discrepancia-separada'), '«inestabilidad» suelta no es un fallo articular');
    assert.ok(!rv('La flexión no la refuerza pero tampoco la descarta.').includes('descarta'));
  });
  test('revisión: informes reales (tests/fixtures/informes) dan los puntos esperados', () => {
    const dir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'informes');
    const herramienta = join(dirname(fileURLToPath(import.meta.url)), '..', 'tools', 'revisar-informe.mjs');
    const casos = [
      ['valoracion-lucia-romero-audio.json', 'lucia-audio-1-informe.txt', 'lucia-audio-transcripcion.txt', ['lado-otro', 'repetido', 'fuentes', 'discrepancia-separada']],
      ['valoracion-lucia-romero-audio.json', 'lucia-audio-2-informe.txt', 'lucia-audio-transcripcion.txt', ['lado-otro', 'confirma', 'repetido', 'seguimiento-fuera', 'limitaciones-negativas']],
      ['valoracion-lucia-romero-breve.json', 'lucia-ficha-breve-sin-audio.txt', null, ['fuentes']],
      ['valoracion-pedro-flores-audio.json', 'pedro-audio-1-informe.txt', 'pedro-audio-transcripcion.txt', ['atribucion', 'frecuencia', 'discrepancia-separada', 'repetido']],
      ['valoracion-pedro-flores-audio.json', 'pedro-audio-2-informe.txt', 'pedro-audio-transcripcion.txt', ['inventado', 'relleno', 'fuentes', 'atribucion', 'frecuencia', 'repetido', 'estructura']],
      ['valoracion-andrea-ruiz-lumbar.json', 'andrea-audio-1-informe.txt', 'andrea-audio-transcripcion.txt', ['genero', 'limitaciones-negativas']],
      ['valoracion-carmen-vidal-tobillo-breve.json', 'carmen-audio-1-ficha-breve.txt', 'carmen-audio-transcripcion.txt', ['relleno', 'fuentes', 'repetido']],
      ['valoracion-javier-soto-cervical.json', 'javier-audio-1-informe.txt', 'javier-audio-transcripcion.txt', ['plan-urgente', 'frecuencia', 'diagnostico', 'imc']],
      ['valoracion-daniel-ortega-cadera.json', 'daniel-audio-1-informe.txt', 'daniel-audio-transcripcion.txt', ['descartar-inventado', 'seguimiento-fuera', 'limitaciones-negativas', 'imagen-motivo']],
      ['valoracion-daniel-ortega-cadera.json', 'daniel-dictado-1-informe.txt', 'daniel-dictado-transcripcion.txt', ['lado-otro', 'formulario-contradicho', 'seguimiento-fuera', 'constantes', 'imagen-motivo']],
      ['valoracion-daniel-ortega-cadera.json', 'daniel-dictado-2-informe.txt', 'daniel-dictado-2-transcripcion.txt', ['lado-otro', 'no-se', 'formulario-contradicho', 'test-propiedades']],
      ['valoracion-marta-gil-rodilla.json', 'marta-dictado-1-informe.txt', 'marta-dictado-transcripcion.txt', ['lado-otro', 'seguimiento-fuera', 'frecuencia', 'discrepancia-separada']],
    ];
    for (const [json, informe, trans, esperados] of casos) {
      const args = [herramienta, join(dir, json), join(dir, informe)];
      if (trans) args.push('--transcripcion', join(dir, trans));
      const salida = execFileSync(process.execPath, args, { encoding: 'utf8' });
      const ids = [...salida.matchAll(/^\[(?:ALTO|MEDIO)\] ([\w-]+):/gm)].map(m => m[1]);
      assert.deepEqual(ids, esperados, `${informe}\n${salida}`);
    }
  });
  test('revisión: constantes clasificadas, motivo de la imagen añadido, «en caso de ausencia de mejoría» (decimosexta revisión)', () => {
    assert.ok(ids('Presenta signos vitales dentro de parámetros habituales, con una frecuencia cardíaca de 58 lpm.').includes('constantes'));
    assert.ok(ids('Paciente normotenso.').includes('constantes'));
    assert.ok(!ids('Frecuencia cardíaca de 58 lpm y tensión arterial de 120/80 mmHg.').includes('constantes'), 'las cifras solas no');
    const ecoInventada = 'Si no mejora, se solicitará una ecografía para valorar la presencia de líquido alrededor del tendón.';
    assert.ok(ids(ecoInventada, { transcripcion: 'Si en unas 6 semanas no mejora, pediremos una ecografía.' }).includes('imagen-motivo'));
    assert.ok(!ids(ecoInventada, { transcripcion: 'Pediremos una ecografía para ver si hay líquido.' }).includes('imagen-motivo'), 'el motivo lo dio el fisio');
    assert.ok(!ids('Se solicitará una ecografía.').includes('imagen-motivo'), 'sin motivo no cuenta');
    const seg = t => RI.revisarInforme(`## CONCLUSIONES Y PLAN DE TRATAMIENTO\n\n${t}\n\n## SEGUIMIENTO FUNCIONAL\n\nSe usará la HAGOS.`).map(p => p.id);
    assert.ok(seg('En caso de ausencia de mejoría en seis semanas, se solicitará ecografía.').includes('seguimiento-fuera'));
    assert.ok(seg('Si no mejora, se pedirá una ecografía.').includes('seguimiento-fuera'));
    assert.ok(!seg('La ausencia de mejoría con movimientos repetidos es compatible con origen facetario.').includes('seguimiento-fuera'), 'un hallazgo no es el criterio');
    assert.ok(ids('Según el dictado, refiere dolor.').includes('fuentes'), '«dictado» nombra la fuente');
  });
  test('revisión: «Antes de compartir, comprueba» — atribución y otra zona siempre; tests con «o» solo si se hicieron', () => {
    const sin = RI.comprobacionesManuales({ ampliado: { tests: [{ hipotesis: 'X', items: [{ test: 'Test de Neer', resultado: 'positivo' }] }] } });
    assert.equal(sin.length, 2);
    assert.match(sin[0], /atribuye a quien la dio/);
    assert.match(sin[1], /otra zona o el otro lado/);
    const con = RI.comprobacionesManuales({ ampliado: { tests: [
      { hipotesis: 'A', items: [{ test: 'PA unilateral dolorosa o con menos movilidad', resultado: 'positivo' }] },
      { hipotesis: 'B', items: [{ test: 'PA unilateral dolorosa o con menos movilidad', resultado: 'positivo' }] },
    ] } });
    assert.equal(con.length, 3);
    assert.equal((con[1].match(/«PA unilateral/g) || []).length, 1, 'cada test una sola vez');
    assert.equal(RI.comprobacionesManuales().length, 2, 'sin datos ampliados no rompe');
    const disc = RI.comprobacionesManuales({ formularioYAudio: true });
    assert.equal(disc.length, 3);
    assert.match(disc[2], /difiere del formulario previo.*las dos versiones/, 'con formulario y audio, las discrepancias');
  });
  test('revisión: cabecera y pie compartidos se quitan; cita la frase', () => {
    const t = RI.quitarCabeceraYPie('INFORME DE FISIOTERAPIA\nPaciente: Pedro Flores\nEdad: 52 años\nFecha: 07/10/2026\n\nTexto.\n\n—\nInforme generado con PhysiQ-Assessment el 07/10/2026 (redacción asistida por IA).');
    assert.equal(t, 'Texto.');
    assert.equal(RI.fraseEn('Uno. Dos tres. Cuatro.', 6), 'Dos tres.');
  });
  test('revisión: se pinta en la tarjeta, nunca en el payload ni en los resúmenes, y se despliega', () => {
    const src = readFileSync(new URL('../informe-ia.js', import.meta.url), 'utf8');
    assert.match(src, /import \{ revisarInforme, comprobacionesManuales \} from '\.\/lib\/revision-informe\.js';/);
    assert.match(src, /<div id="iaRevision"><\/div>/);
    assert.match(src, /catch \{ el\.innerHTML = ''; return; \}/, 'una regla rota no tumba la tarjeta');
    const wf = readFileSync(new URL('../.github/workflows/deploy-to-hub.yml', import.meta.url), 'utf8');
    assert.ok(/cp lib\/[^\n]*lib\/revision-informe\.js[^\n]*physiq-hub\/assessment\/lib\//.test(wf), 'lib/revision-informe.js se copia al hub');
    const appSrc = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
    assert.ok(!/revision-informe/.test(appSrc), 'app.js no la carga (solo la tarjeta, fuera del hub)');
  });
}

// ── Verificador con IA (capa 3, lib/verificacion-informe.js) ─────────────────
{
  const VI = await import('../lib/verificacion-informe.js');
  const RI = await import('../lib/revision-informe.js');
  const dir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'informes');
  const datos = { p: 'Ana Pérez', d: '8/10/2026', r: 'rodilla', la: 'Izquierdo', mo: 'Dolor al correr', nr: 5, h: [{ name: 'Dolor Patelofemoral' }] };

  test('verificación: el prompt lleva datos, transcripción e informe; sin audio lo dice; explica cada extracción', () => {
    const p = VI.promptVerificacion(datos, { transcripcion: 'Me duele al bajar escaleras.', informe: 'TEXTO DEL INFORME' });
    assert.match(p, /## DATOS DE VALORACIÓN ESTRUCTURADA/);
    assert.match(p, /Motivo de consulta: Dolor al correr/);
    assert.match(p, /TRANSCRIPCIÓN DE LA CONSULTA:\nMe duele al bajar escaleras\./);
    assert.match(p, /INFORME A REVISAR:\nTEXTO DEL INFORME/);
    assert.match(VI.promptVerificacion(datos, { informe: 'x' }), /No hubo audio/);
    for (const c of VI.CAMPOS_EXTRACCION) assert.match(p, new RegExp(`^- ${c}:`, 'm'), `el prompt explica ${c}`);
    assert.match(p, /No tienes que juzgar si el informe está bien/, 'extrae, no busca fallos');
    assert.match(p, /Lo que solo dice la transcripción consta; lo que viene de la pauta de PhysiQ consta/);
  });
  test('verificación: el esquema son las seis extracciones, todas obligatorias, y cabe en /verify', () => {
    const E = VI.ESQUEMA_VERIFICACION;
    assert.equal(E.type, 'object');
    assert.deepEqual(E.required, VI.CAMPOS_EXTRACCION);
    assert.deepEqual(Object.keys(E.properties), VI.CAMPOS_EXTRACCION);
    for (const c of VI.CAMPOS_EXTRACCION) {
      const it = E.properties[c].items;
      assert.equal(E.properties[c].type, 'array');
      assert.deepEqual(it.required, Object.keys(it.properties), `${c}: todos sus campos obligatorios`);
      if (c !== 'siglas') assert.ok(it.properties.cita, `${c} lleva cita`);
    }
    assert.ok(JSON.stringify(E).length < 10000, 'cabe en el límite de /verify');
    assert.ok(VI.MAX_TOKENS_VERIFICACION <= 4000, 'cabe en el límite de /verify');
  });
  test('verificación: los puntos se derivan de las extracciones en código', () => {
    const vacio = Object.fromEntries(VI.CAMPOS_EXTRACCION.map(c => [c, []]));
    assert.deepEqual(VI.listaPuntos(vacio), [], 'sin extracciones, sin puntos');
    const p = VI.puntosDeExtraccion({
      tests_alternativas: [
        { test: 'PA unilateral dolorosa o con menos movilidad', cita: 'reproduce dolor y se aprecia restricción', afirma_las_dos: true },
        { test: 'Otro (a o b)', cita: 'x', afirma_las_dos: false },
      ],
      indicaciones: [
        { cita: 'restringida por indicación médica', quien_la_dio: 'fisioterapeuta', evidencia: 'bici estática sí', atribuida_en_informe: 'médico', como_si_ya_lo_hiciera: false },
        { cita: 'tal como se le había indicado previamente', quien_la_dio: 'fisioterapeuta', evidencia: 'x', atribuida_en_informe: 'indicación previa', como_si_ya_lo_hiciera: false },
        { cita: 'Mantiene la actividad en bicicleta estática', quien_la_dio: 'fisioterapeuta', evidencia: 'x', atribuida_en_informe: 'sin atribuir', como_si_ya_lo_hiciera: true },
        { cita: 'sin coger peso según el cirujano', quien_la_dio: 'cirujano', evidencia: 'x', atribuida_en_informe: 'cirujano', como_si_ya_lo_hiciera: false },
      ],
      afirmaciones: [
        { cita: 'más que neurógeno', clase: 'interpretación', consta_en: 'no consta', evidencia: 'no consta' },
        { cita: 'parestesias', clase: 'síntoma', consta_en: 'transcripción', evidencia: 'se me duerme la mano' },
      ],
      siglas: [
        { sigla: 'KTW', cita: 'test de Kleiger-Torg-Weiss', desarrollo_en_informe: 'Kleiger-Torg-Weiss', desarrollo_en_datos: '' },
        { sigla: 'SLAP', cita: 'SLAP', desarrollo_en_informe: '', desarrollo_en_datos: '' },
      ],
      pronostico: [
        { cita: 'la lesión labral aislada es infrecuente', uso: 'interpretar tests' },
        { cita: 'Si a las 12 semanas no mejora', uso: 'seguimiento' },
      ],
      plan: [
        { cita: 'programa de ejercicio bilateral', elemento: 'otra zona o lado', origen: 'no consta', evidencia: 'no consta' },
        { cita: 'ejercicio de cuádriceps', elemento: 'técnica', origen: 'pauta de PhysiQ', evidencia: 'x' },
        { cita: 'el mismo programa para la otra rodilla', elemento: 'otra zona o lado', origen: 'fisioterapeuta' },
      ],
    });
    assert.deepEqual(p.map(x => `${x.tipo}:${x.nivel}`), [
      'lectura:alto', 'atribucion:alto', 'atribucion:alto', 'atribucion:medio',
      'no-respaldado:medio', 'lectura:alto', 'lectura:medio', 'plan:alto', 'plan:alto',
    ]);
    assert.match(p[1].mensaje, /la dio el fisioterapeuta y el informe la atribuye al médico/);
  });
  test('verificación: una lista ilegible invalida la respuesta; un array en texto se lee', () => {
    const vacio = Object.fromEntries(VI.CAMPOS_EXTRACCION.map(c => [c, []]));
    assert.equal(VI.validarPuntos({ ...vacio, plan: '[]' }, 'x').invalida, false);
    assert.equal(VI.validarPuntos({ ...vacio, plan: '[{"cita": "tipo "brazo muerto""}]' }, 'x').invalida, true);
    const { plan, ...sinPlan } = vacio;
    assert.equal(VI.validarPuntos(sinPlan, 'x').invalida, true, 'falta una lista');
  });
  test('verificación: un «contradice» con las dos versiones en una frase se descarta', () => {
    assert.ok(VI.discrepanciaUnida('No refiere hormigueo, aunque alguna noche nota la mano dormida.'));
    assert.ok(VI.discrepanciaUnida('Refiere que el dolor no le despierta por la noche, aunque también describe despertares.'));
    assert.ok(!VI.discrepanciaUnida('Niega dolor nocturno.'));
    assert.ok(!VI.discrepanciaUnida('Refiere dolor al correr, aunque mejora con reposo.'), 'sin negación antes');
    const inf = 'No refiere hormigueo, aunque alguna noche nota la mano dormida. Niega dolor nocturno.';
    const r = VI.validarPuntos({ puntos: [
      { tipo: 'contradice', nivel: 'alto', cita: 'No refiere hormigueo, aunque alguna noche nota la mano dormida', evidencia: 'x', mensaje: 'y' },
      { tipo: 'contradice', nivel: 'alto', cita: 'Niega dolor nocturno', evidencia: 'x', mensaje: 'y' },
    ] }, inf);
    assert.deepEqual(r.puntos.map(p => p.cita), ['Niega dolor nocturno']);
    assert.deepEqual(r.descartados.map(d => d.motivo), ['discrepancia-unida']);
  });
  test('verificación: la cita debe estar en el informe (markdown, comillas, espacios y «…» no cuentan)', () => {
    const inf = '## Dolor\nRefiere **dolor** «punzante»   al correr.\nNiega hormigueo en la pierna derecha.';
    assert.ok(VI.citaEnInforme('Refiere dolor "punzante" al correr', inf));
    assert.ok(VI.citaEnInforme('Refiere dolor «punzante» … hormigueo en la pierna', inf));
    assert.ok(!VI.citaEnInforme('Refiere dolor punzante al caminar', inf), 'una paráfrasis no vale');
    assert.ok(!VI.citaEnInforme('hormigueo en la pierna … Refiere dolor', inf), 'los trozos van en orden');
    assert.ok(!VI.citaEnInforme('', inf));
    assert.ok(!VI.citaEnInforme('dolor', inf), 'demasiado corta para comprobarla');
    assert.ok(VI.citaEnInforme('Niega hormigueo en la pierna', 'y niega hormigueo en la pierna.'), 'sin distinguir mayúsculas (cita media frase con mayúscula inicial)');
  });
  test('verificación: validarPuntos descarta citas inventadas, tipos raros y repetidos; la omisión no lleva cita', () => {
    const inf = 'Practica ciclismo de manera habitual. Refiere dolor al peinarse.';
    const { puntos, descartados } = VI.validarPuntos({ puntos: [
      { tipo: 'no-respaldado', nivel: 'medio', cita: 'Practica ciclismo de manera habitual', evidencia: 'No consta', mensaje: 'Frecuencia inferida' },
      { tipo: 'no-respaldado', nivel: 'medio', cita: 'Practica ciclismo de manera habitual.', evidencia: 'No consta', mensaje: 'Repetido' },
      { tipo: 'contradice', nivel: 'alto', cita: 'Refiere dolor al ducharse', evidencia: 'x', mensaje: 'Cita inventada' },
      { tipo: 'estilo', nivel: 'medio', cita: 'Refiere dolor al peinarse', evidencia: 'x', mensaje: 'Tipo fuera del esquema' },
      { tipo: 'omision', nivel: 'urgente', cita: 'algo que no está', evidencia: 'Me da miedo que se mueva el clavo', mensaje: 'Falta el miedo al clavo' },
      { tipo: 'atribucion', nivel: 'medio', cita: 'Refiere dolor al peinarse', evidencia: 'x', mensaje: '' },
    ] }, inf);
    assert.deepEqual(puntos.map(p => p.tipo), ['no-respaldado', 'omision']);
    assert.equal(puntos[1].cita, '', 'la omisión pierde la cita');
    assert.equal(puntos[1].nivel, 'medio', 'un nivel fuera del esquema pasa a medio');
    assert.deepEqual(descartados.map(d => d.motivo), ['cita', 'tipo', 'mensaje']);
    assert.deepEqual(VI.validarPuntos(null, inf).puntos, []);
    assert.equal(VI.validarPuntos(null, inf).invalida, true, 'sin lista: inválida (se repite la llamada)');
    assert.equal(VI.validarPuntos({ repaso: 'x', puntos: [] }, inf).invalida, false, 'lista vacía: válida');
    const comoTexto = VI.validarPuntos({ puntos: JSON.stringify([{ tipo: 'no-respaldado', nivel: 'medio', cita: 'Practica ciclismo de manera habitual', evidencia: 'x', mensaje: 'y' }]) }, inf);
    assert.equal(comoTexto.puntos.length, 1, '`puntos` como texto JSON se lee');
    assert.equal(comoTexto.invalida, false);
    assert.equal(VI.validarPuntos({ puntos: '[{"tipo": "contradice", "cita": "tipo "brazo muerto""}]' }, inf).invalida, true, 'texto con comillas sin escapar: inválida');
    const muchos = Array.from({ length: 20 }, (_, i) => ({ tipo: 'omision', nivel: 'medio', cita: '', evidencia: `dato ${i}`, mensaje: `falta ${i}` }));
    assert.equal(VI.validarPuntos({ puntos: muchos }, inf).puntos.length, VI.MAX_PUNTOS_VERIFICACION);
  });
  test('verificación: compararConEsperados separa aciertos, lo que ya marca la capa 1 y lo sin etiquetar', () => {
    const errores = [
      { id: 'bici', nivel: 'alto', fragmentos: ['restringida por indicación médica'] },
      { id: 'clavo', nivel: 'medio', claves: ['clavo'] },
      { id: 'otro', nivel: 'medio', fragmentos: ['nunca citado'] },
    ];
    const r = VI.compararConEsperados([
      { tipo: 'atribucion', cita: 'esta actividad se encuentra restringida por indicación médica hasta noviembre', mensaje: 'x', evidencia: '' },
      { tipo: 'omision', cita: '', mensaje: 'Falta el miedo', evidencia: 'que se me mueva el clavo' },
      { tipo: 'repetido', cita: 'La osteosíntesis se realizó el 15 de junio', mensaje: 'x', evidencia: '' },
      { tipo: 'no-respaldado', cita: 'Algo nuevo', mensaje: 'x', evidencia: '' },
    ], errores, ['La osteosíntesis se realizó el 15 de junio de 2026.']);
    assert.deepEqual(r.detectados.sort(), ['bici', 'clavo']);
    assert.deepEqual(r.fallados, ['otro']);
    assert.equal(r.redundantes.length, 1);
    assert.deepEqual(r.sinEtiquetar.map(p => p.cita), ['Algo nuevo']);
    // Con los puntos de la capa 1 (no solo sus citas), una frase distinta de la misma familia ya está cubierta
    const capa1 = [
      { id: 'plan-urgente', mensaje: 'x', cita: 'El abordaje incluirá manipulación cervical.' },
      { id: 'diagnostico', mensaje: 'Nombra diagnósticos que no están en los datos: «hemorragia».', cita: 'Otra frase.' },
      { id: 'repetido', mensaje: 'La edad (34 años) aparece 3 veces; va una sola vez, en Factores Personales.', cita: 'Paciente de sexo femenino, 34 años de edad.' },
      { id: 'discrepancia-separada', mensaje: 'Hormigueo: lo niega en una frase y lo describe en otra.', cita: 'Niega parestesias.' },
    ];
    const f = VI.compararConEsperados([
      { tipo: 'plan', cita: 'Se incorporará biofeedback a 20 mmHg', mensaje: 'x', evidencia: '' },
      { tipo: 'no-respaldado', cita: 'para descartar hemorragia subaracnoidea', mensaje: 'x', evidencia: '' },
      { tipo: 'contradice', cita: 'paciente de 34 años', mensaje: 'x', evidencia: '' },
      { tipo: 'no-respaldado', cita: 'Describe episodios ocasionales de parestesia en la mano', mensaje: 'x', evidencia: '' },
      { tipo: 'no-respaldado', cita: 'Refiere dolor de 7/10 al correr', mensaje: 'x', evidencia: '' },
    ], [], capa1);
    assert.equal(f.redundantes.length, 4, JSON.stringify(f.sinEtiquetar));
    assert.deepEqual(f.sinEtiquetar.map(p => p.cita), ['Refiere dolor de 7/10 al correr']);
    // Las claves de una omisión cuentan en otro tipo de punto si están todas
    const om = [{ id: 'clavo', nivel: 'medio', claves: ['clavo', 'miedo'] }];
    assert.deepEqual(VI.compararConEsperados([{ tipo: 'no-respaldado', cita: 'No manifiesta aprensión', mensaje: 'En consulta refiere miedo a que se mueva el clavo', evidencia: '' }], om).detectados, ['clavo']);
    assert.deepEqual(VI.compararConEsperados([{ tipo: 'no-respaldado', cita: 'x', mensaje: 'Refiere miedo al movimiento', evidencia: '' }], om).detectados, [], 'una sola clave no basta fuera de una omisión');
  });
  test('verificación: esperado-capa3.json cubre los informes reales y sus fragmentos están en cada informe', () => {
    const E = JSON.parse(readFileSync(join(dir, 'esperado-capa3.json'), 'utf8'));
    const enTabla = readFileSync(fileURLToPath(import.meta.url), 'utf8').match(/\['valoracion-[^\n]+/g).map(l => l.match(/'([\w-]+\.txt)'/)?.[1]).filter(Boolean);
    assert.deepEqual(E.informes.map(c => c.informe).sort(), [...new Set(enTabla)].sort(), 'los mismos informes que «revisión: informes reales»');
    const ids = new Set();
    for (const c of E.informes) {
      const texto = RI.quitarCabeceraYPie(readFileSync(join(dir, c.informe), 'utf8'));
      assert.ok(existsSync(join(dir, c.valoracion)), c.valoracion);
      if (c.transcripcion) assert.ok(existsSync(join(dir, c.transcripcion)), c.transcripcion);
      assert.ok(['narrativo', 'breve'].includes(c.plantilla));
      for (const e of c.errores) {
        assert.ok(!ids.has(e.id), `id repetido: ${e.id}`); ids.add(e.id);
        assert.ok(VI.TIPOS_VERIFICACION[e.tipo], `${e.id}: tipo ${e.tipo}`);
        assert.ok(['alto', 'medio'].includes(e.nivel), `${e.id}: nivel`);
        assert.ok((e.fragmentos || []).length || (e.claves || []).length, `${e.id}: sin fragmentos ni claves`);
        for (const f of e.fragmentos || []) assert.ok(VI.citaEnInforme(f, texto), `${e.id}: «${f}» no está en ${c.informe}`);
      }
    }
  });
  test('verificación: las respuestas guardadas (capa3/) se validan sin romper', () => {
    const dResp = join(dir, 'capa3');
    if (!existsSync(dResp)) return;
    const E = JSON.parse(readFileSync(join(dir, 'esperado-capa3.json'), 'utf8'));
    for (const f of readdirSync(dResp).filter(n => n.endsWith('.json'))) {
      const c = E.informes.find(x => f.startsWith(x.informe.replace(/\.txt$/, '') + '.'));
      assert.ok(c, `${f} no corresponde a ningún informe de esperado-capa3.json`);
      const r = JSON.parse(readFileSync(join(dResp, f), 'utf8'));
      const { puntos } = VI.validarPuntos(r.result, RI.quitarCabeceraYPie(readFileSync(join(dir, c.informe), 'utf8')));
      for (const p of puntos) assert.ok(p.tipo === 'omision' || p.cita, f);
    }
  });
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
