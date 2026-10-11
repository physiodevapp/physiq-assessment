// Payload (buildPhysiQPayload) y textos afirmativos del cribado. Se ejecuta desde tests/unit.js.
import { assert, test, SYSTEMIC_SCREENING, buildPhysiQPayload, buildInformeFisioterapiaText,
   getSistemicoAffirmativeTexts, buildContextSummaryText, withState } from './comun.mjs';

// ── buildPhysiQPayload ────────────────────────────────────────────────────────
console.log('\nbuildPhysiQPayload');

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
const { contextoValoracion: ctxNRS } = await import('../../lib/informe-narrativo.js');
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
