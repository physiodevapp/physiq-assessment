// «Anatomía»: enlaces a Kenhub de los tests de la fase 4b y de las preguntas
// de cribado de la fase 2 (data/anatomia.js, `anatomia` en cada test o
// pregunta, docs/anatomia-kenhub.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, HYPOTHESES, SYSTEMIC_SCREENING, buildTestItem, buildSistemaHTML, buildPhysiQPayload,
  buildContextSummaryText, buildInformeFisioterapiaText, withState } from './comun.mjs';
const { ESTRUCTURAS, KENHUB_BASE, KENHUB_BASE_ES } = await import('../../data/anatomia.js');
const { enlacesAnatomia, anatomiaLineaHTML } = await import('../../phase4b.js');
const IA = await import('../../informe-ia.js');
const IN = await import('../../lib/informe-narrativo.js');

console.log('\nanatomía (Kenhub, fases 2 y 4b)');

const TODOS = Object.entries(HYPOTHESES).flatMap(([hId, h]) => h.tests.map((t, i) => ({ hId, h, t, i })));
const CON = TODOS.filter(x => x.t.anatomia);
// Preguntas de cribado (los sistemas transversales son el mismo objeto en
// varias regiones: se cuentan una vez)
const PREGUNTAS = [];
for (const [region, data] of Object.entries(SYSTEMIC_SCREENING)) {
  for (const sis of data.sistemas) for (const q of sis.preguntas) {
    if (!PREGUNTAS.some(p => p.sis === sis && p.q === q)) PREGUNTAS.push({ region, sis, q });
  }
}
const PREG_CON = PREGUNTAS.filter(p => p.q.anatomia);

test('anatomía: cada estructura tiene nombre, slug inglés y, si existe, slug español (minúsculas y guiones)', () => {
  assert.equal(KENHUB_BASE, 'https://www.kenhub.com/en/library/anatomy/');
  assert.equal(KENHUB_BASE_ES, 'https://www.kenhub.com/es/library/anatomia-es/');
  const slug = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  for (const [id, e] of Object.entries(ESTRUCTURAS)) {
    assert.match(id, /^[a-z_]+$/, `clave ${id}`);
    assert.ok(e.nombre?.trim(), `${id}: sin nombre`);
    assert.match(e.kenhub, slug, `${id}: slug inglés`);
    if ('kenhubEs' in e) assert.match(e.kenhubEs, slug, `${id}: slug español`);
    assert.deepEqual(Object.keys(e).filter(k => !['nombre', 'kenhub', 'kenhubEs', 'nota'].includes(k)), [], `${id}: campos fuera del esquema`);
  }
});

test('anatomía: enlaza la versión en español si existe y, si no, la inglesa marcada «EN»', () => {
  for (const [id, e] of Object.entries(ESTRUCTURAS)) {
    const [l] = enlacesAnatomia({ anatomia: [id] });
    assert.equal(l.url, e.kenhubEs ? KENHUB_BASE_ES + e.kenhubEs : KENHUB_BASE + e.kenhub, id);
    assert.equal(l.ingles, !e.kenhubEs, id);
  }
  // Sin versión en español en Kenhub (comprobado con el hreflang del artículo
  // inglés, 2026-10). Hombro: la bursa y los dos ligamentos; rodilla: meniscos,
  // LCA, patelofemoral, pata de ganso, tibioperonea, peroneo común y dos venas.
  assert.deepEqual(Object.keys(ESTRUCTURAS).filter(id => !ESTRUCTURAS[id].kenhubEs), [
    'bursa_subacromial', 'ligamento_coracoacromial', 'ligamento_coracohumeral',
    'menisco_medial', 'menisco_lateral', 'lca', 'art_patelofemoral', 'pata_ganso', 'art_tibioperonea',
    'nervio_peroneo_comun', 'venas_miembro_inferior', 'vena_poplitea',
  ]);
  const html = anatomiaLineaHTML({ anatomia: ['supraespinoso', 'bursa_subacromial'] });
  assert.match(html, />Supraespinoso ↗<\/a>/);
  assert.match(html, /title="Abrir en Kenhub \(sin versión en español\)">Bursa subacromial <span class="anat-idioma">EN<\/span> ↗<\/a>/);
});

test('anatomía: `anatomia` de un test es una lista no vacía de claves de ESTRUCTURAS, sin repetir artículo', () => {
  for (const { hId, t } of CON) {
    assert.ok(Array.isArray(t.anatomia) && t.anatomia.length, `${hId} «${t.name}»: lista vacía`);
    for (const id of t.anatomia) assert.ok(ESTRUCTURAS[id], `${hId} «${t.name}»: «${id}» no está en data/anatomia.js`);
    const urls = enlacesAnatomia(t).map(e => e.url);
    assert.equal(new Set(urls).size, urls.length, `${hId} «${t.name}»: dos estructuras con el mismo artículo`);
  }
});

test('anatomía: `anatomia` de una pregunta de cribado: claves de ESTRUCTURAS, sin repetir artículo, solo con razonamiento', () => {
  for (const { region, q } of PREG_CON) {
    assert.ok(Array.isArray(q.anatomia) && q.anatomia.length, `${region}/${q.id}: lista vacía`);
    for (const id of q.anatomia) assert.ok(ESTRUCTURAS[id], `${region}/${q.id}: «${id}» no está en data/anatomia.js`);
    const urls = enlacesAnatomia(q).map(e => e.url);
    assert.equal(new Set(urls).size, urls.length, `${region}/${q.id}: dos estructuras con el mismo artículo`);
    assert.ok(q.razonamiento, `${region}/${q.id}: la anatomía va dentro del «¿Por qué?», sin razonamiento no se ve`);
  }
});

test('anatomía: nunca en los sistemas transversales (mismo objeto en todas las regiones; decisión del usuario, 2026-10)', () => {
  for (const { sis, q } of PREGUNTAS) {
    if (sis.id.startsWith('transversal_')) assert.ok(!q.anatomia, `${sis.id}/${q.id}`);
  }
});

test('anatomía: toda estructura del registro la usa algún test o alguna pregunta', () => {
  const usadas = new Set([...CON.flatMap(x => x.t.anatomia), ...PREG_CON.flatMap(p => p.q.anatomia)]);
  for (const id of Object.keys(ESTRUCTURAS)) assert.ok(usadas.has(id), `«${id}» no la usa ningún test ni pregunta`);
});

test('anatomía: cribado de hombro con anatomía en las preguntas cuya derivación explica una estructura', () => {
  const con = PREG_CON.filter(p => p.region === 'hombro').map(p => p.q.id);
  assert.deepEqual(con, ['h3', 'h1', 'h2', 'h_c3', 'h5', 'h_p2', 'h_p3', 'h_r1', 'h_g1', 'h_g2', 'h_gi1', 'h_gi2', 'h_gi3', 'h_t1', 'h_n1']);
  // Sin estructura concreta: dolor nocturno, peso, dolor constante, sistémico
  const sin = PREGUNTAS.filter(p => p.region === 'hombro' && !p.sis.id.startsWith('transversal_') && !p.q.anatomia).map(p => p.q.id);
  assert.deepEqual(sin, ['h4', 'h6', 'h_r2', 'h_i1']);
});

test('anatomía: rodilla, todos los tests salvo el gesto testigo; cribado sin anatomía solo en el dolor nocturno (r2)', () => {
  const sin = TODOS.filter(x => x.h.region === 'rodilla' && !x.t.anatomia);
  assert.ok(sin.length && sin.every(x => x.t.name.startsWith('Gesto testigo')), sin.map(x => `${x.hId}/${x.i}`).join(' '));
  assert.equal(sin.length, 20);
  const con = PREG_CON.filter(p => p.region === 'rodilla').map(p => p.q.id);
  assert.deepEqual(con, ['r_v1', 'r_v2', 'r_v3', 'r1', 'r_i2', 'r_i3', 'r3', 'r4', 'ro_t1', 'ro_t2', 'ro_t3', 'ro_t4', 'ro_t5', 'ro_t6', 'ro_p1']);
  const sinQ = PREGUNTAS.filter(p => p.region === 'rodilla' && !p.sis.id.startsWith('transversal_') && !p.q.anatomia).map(p => p.q.id);
  assert.deepEqual(sinQ, ['r2']);
});

test('fase 2: «Anatomía» dentro del «¿Por qué?» de la pregunta, solo si la tiene, con sus enlaces', () => {
  for (const [region, data] of Object.entries(SYSTEMIC_SCREENING)) {
    for (const sis of data.sistemas) {
      const html = buildSistemaHTML(sis);
      for (const q of sis.preguntas) {
        const ini = html.indexOf(`id="sq2_${q.id}"`);
        const fin = html.indexOf('id="sq2_', ini + 1);
        const bloque = html.slice(ini, fin === -1 ? undefined : fin);
        assert.equal(bloque.includes('class="test-anat"'), !!q.anatomia, `${region}/${q.id}`);
        for (const e of enlacesAnatomia(q)) assert.ok(bloque.includes(`href="${e.url}" target="_blank"`), `${region}/${q.id}: ${e.url}`);
        if (q.anatomia) {
          const razon = bloque.slice(bloque.indexOf('class="razon-cuerpo"'));
          assert.ok(razon.indexOf('class="test-anat"') > 0 && razon.indexOf('class="test-anat"') < razon.indexOf('class="razon-pie"'), `${region}/${q.id}: antes del pie de fuentes`);
        }
      }
    }
  }
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
      assert.ok(e.url.startsWith(e.ingles ? KENHUB_BASE : KENHUB_BASE_ES));
    }
  }
  const supra = HYPOTHESES.h3.tests[0];
  assert.match(anatomiaLineaHTML(supra), /Anatomía<\/span> <a class="anat-enlace" href="https:\/\/www\.kenhub\.com\/es\/library\/anatomia-es\/musculo-supraespinoso"[^>]*>Supraespinoso ↗<\/a>/);
  // La nota de una estructura sin artículo propio va en el title
  assert.match(anatomiaLineaHTML(HYPOTHESES.h5.tests[0]), /title="Abrir en Kenhub · Sin artículo propio/);
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
      assert.ok(!/kenhub|supraspinatus|supraespinoso-|Supraespinoso ↗|Labrum glenoideo|anatomia/i.test(txt), 'anatomía filtrada a un resumen o al prompt');
    }
  });
  // Fase 2: con todas las preguntas con anatomía respondidas SÍ
  const sistemicoAnswers = Object.fromEntries(PREG_CON.filter(p => p.region === 'hombro').map(p => [p.q.id, 'SI']));
  withState({ region: 'hombro', sistemicoAnswers, sistemicoAlerta: true }, () => {
    const d = buildPhysiQPayload();
    assert.ok(JSON.stringify(d).includes(PREG_CON[0].q.text.slice(0, 20)), 'control: la pregunta respondida SÍ va en el payload');
    const prompt = IN.buildNarrativePrompt(d, { conAudio: false }) + IN.bloquesAmpliados(IA.construirAmpliado()).join('\n');
    for (const txt of [JSON.stringify(d), buildContextSummaryText(), buildInformeFisioterapiaText(), prompt]) {
      assert.ok(!/kenhub|nervio-frenico|Nervio frénico ↗|anatomia/i.test(txt), 'anatomía de la fase 2 filtrada a un resumen o al prompt');
    }
  });
});
