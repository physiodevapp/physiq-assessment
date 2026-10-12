// «Anatomía» de los tests de la fase 4b: enlaces a Kenhub (data/anatomia.js,
// `anatomia` en cada test, docs/anatomia-kenhub.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, HYPOTHESES, buildTestItem, buildPhysiQPayload,
  buildContextSummaryText, buildInformeFisioterapiaText, withState } from './comun.mjs';
const { ESTRUCTURAS, KENHUB_BASE } = await import('../../data/anatomia.js');
const { enlacesAnatomia, anatomiaTestHTML } = await import('../../phase4b.js');
const IA = await import('../../informe-ia.js');
const IN = await import('../../lib/informe-narrativo.js');

console.log('\nanatomía (Kenhub, fase 4b)');

const TODOS = Object.entries(HYPOTHESES).flatMap(([hId, h]) => h.tests.map((t, i) => ({ hId, h, t, i })));
const CON = TODOS.filter(x => x.t.anatomia);

test('anatomía: cada estructura tiene nombre y slug de Kenhub (minúsculas y guiones); la base es la biblioteca en inglés', () => {
  assert.equal(KENHUB_BASE, 'https://www.kenhub.com/en/library/anatomy/');
  for (const [id, e] of Object.entries(ESTRUCTURAS)) {
    assert.match(id, /^[a-z_]+$/, `clave ${id}`);
    assert.ok(e.nombre?.trim(), `${id}: sin nombre`);
    assert.match(e.kenhub, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${id}: slug`);
    assert.deepEqual(Object.keys(e).filter(k => !['nombre', 'kenhub', 'nota'].includes(k)), [], `${id}: campos fuera del esquema`);
  }
});

test('anatomía: `anatomia` de un test es una lista no vacía de claves de ESTRUCTURAS, sin repetir artículo', () => {
  for (const { hId, t } of CON) {
    assert.ok(Array.isArray(t.anatomia) && t.anatomia.length, `${hId} «${t.name}»: lista vacía`);
    for (const id of t.anatomia) assert.ok(ESTRUCTURAS[id], `${hId} «${t.name}»: «${id}» no está en data/anatomia.js`);
    const urls = t.anatomia.map(id => ESTRUCTURAS[id].kenhub);
    assert.equal(new Set(urls).size, urls.length, `${hId} «${t.name}»: dos estructuras con el mismo artículo`);
  }
});

test('anatomía: toda estructura del registro la usa algún test', () => {
  const usadas = new Set(CON.flatMap(x => x.t.anatomia));
  for (const id of Object.keys(ESTRUCTURAS)) assert.ok(usadas.has(id), `«${id}» no la usa ningún test`);
});

test('anatomía: hombro (piloto) la tiene en todos los tests salvo los genéricos (gesto testigo, identificadores de consenso)', () => {
  const sin = TODOS.filter(x => x.h.region === 'hombro' && !x.t.anatomia).map(x => `${x.hId}/${x.i}`);
  assert.deepEqual(sin, ['h1/3', 'h1/5', 'h2/5', 'h3/9', 'h4/5', 'h5/3', 'h7/5']);
});

test('tarjeta del test: «Anatomía» con un enlace por estructura (pestaña nueva, noopener), solo si el test la tiene', () => {
  for (const { hId, t, i } of TODOS) {
    const html = buildTestItem(hId, t, i);
    assert.equal(html.includes('class="test-anat"'), !!t.anatomia, `${hId} «${t.name}»`);
    for (const e of enlacesAnatomia(t)) {
      assert.ok(html.includes(`href="${e.url}" target="_blank" rel="noopener noreferrer"`), `${hId} «${t.name}»: ${e.url}`);
      assert.ok(e.url.startsWith(KENHUB_BASE));
    }
  }
  const supra = HYPOTHESES.h3.tests[0];
  assert.match(anatomiaTestHTML(supra), /Anatomía<\/span> <a class="anat-enlace" href="https:\/\/www\.kenhub\.com\/en\/library\/anatomy\/supraspinatus-muscle"[^>]*>Supraespinoso ↗<\/a>/);
  // La nota de una estructura sin artículo propio va en el title
  assert.match(anatomiaTestHTML(HYPOTHESES.h5.tests[0]), /title="Abrir en Kenhub · Sin artículo propio/);
});

test('anatomía: oculta en el hub y al imprimir (CSS)', () => {
  const css = leer('styles.css');
  assert.ok(css.includes('.in-hub .test-anat, .in-hub .razon-anatomia { display: none; }'));
  assert.match(css, /@media print \{ \.test-anat \{ display: none; \} \}/);
});

test('anatomía: nunca entra en el payload, 📋 Notas, 📄 Informe ni el prompt del informe con IA', () => {
  const ids = ['h2', 'h3', 'h5'];
  const testResults = Object.fromEntries(ids.map(id => [id, Object.fromEntries(HYPOTHESES[id].tests.map((_, i) => [i, 'pos']))]));
  withState({ region: 'hombro', activeHypotheses: ids, testResults }, () => {
    const d = buildPhysiQPayload();
    const prompt = IN.buildNarrativePrompt(d, { conAudio: false }) + IN.bloquesAmpliados(IA.construirAmpliado()).join('\n');
    for (const txt of [JSON.stringify(d), buildContextSummaryText(), buildInformeFisioterapiaText(), prompt]) {
      assert.ok(!/kenhub|supraspinatus|Supraespinoso ↗|Labrum glenoideo|anatomia/i.test(txt), 'anatomía filtrada a un resumen o al prompt');
    }
  });
});
