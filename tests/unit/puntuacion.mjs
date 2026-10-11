// Puntuación de la fase 4b (calcLRScore). Se ejecuta desde tests/unit.js.
import { assert, test, HYPOTHESES, calcLRScore, parseLR, etiquetaHipHTML } from './comun.mjs';

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
