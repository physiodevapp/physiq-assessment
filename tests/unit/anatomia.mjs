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
  // LCA, patelofemoral, pata de ganso, tibioperonea, peroneo común y dos venas;
  // codo: radiocubital proximal y cuatro músculos del antebrazo; cervical:
  // atlantoaxial, semiespinoso de la cabeza y suboccipitales; cadera: labrum,
  // trocánter mayor, cuadrado femoral, isquiotibiales, aductores y tres nervios;
  // lumbar: canal vertebral, cola de caballo y multífido; tobillo y pie: LPAA,
  // cuatro articulaciones, cuboides, cuñas, metatarsianos, arcos, Aquiles, tres músculos, fascias y la pedia.
  assert.deepEqual(Object.keys(ESTRUCTURAS).filter(id => !ESTRUCTURAS[id].kenhubEs), [
    'bursa_subacromial', 'ligamento_coracoacromial', 'ligamento_coracohumeral',
    'menisco_medial', 'menisco_lateral', 'lca', 'art_patelofemoral', 'pata_ganso', 'art_tibioperonea',
    'nervio_peroneo_comun', 'venas_miembro_inferior', 'vena_poplitea',
    'art_radiocubital_proximal', 'extensor_radial_corto_carpo', 'flexor_radial_carpo',
    'flexor_largo_pulgar', 'flexor_profundo_dedos',
    'art_atlantoaxial', 'semiespinoso_cabeza', 'suboccipitales',
    'labrum_acetabular', 'trocanter_mayor', 'cuadrado_femoral', 'isquiotibiales', 'aductores_cadera',
    'nervio_femorocutaneo', 'nervio_ilioinguinal', 'nervio_iliohipogastrico',
    'canal_vertebral', 'cola_caballo', 'multifido',
    'lpaa', 'art_subastragalina', 'art_mediotarsiana', 'art_tarsometatarsianas', 'art_mtf',
    'cuboides', 'cuneiformes', 'metatarsianos', 'arcos_pie', 'aquiles', 'flexor_largo_primer_dedo',
    'peroneo_largo', 'peroneo_corto', 'fascias_pierna_pie', 'arteria_pedia',
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
  assert.deepEqual(con, ['h3', 'h1', 'h2', 'h_c3', 'h_c4', 'h5', 'h_p2', 'h_p3', 'h_r1', 'h_g1', 'h_g2', 'h_gi1', 'h_gi2', 'h_gi3', 'h_gi4', 'h_t1', 'h_n1']);
  // Sin estructura concreta: dolor nocturno, peso, dolor constante, sistémico
  const sin = PREGUNTAS.filter(p => p.region === 'hombro' && !p.sis.id.startsWith('transversal_') && !p.q.anatomia).map(p => p.q.id);
  assert.deepEqual(sin, ['h4', 'h6', 'h_r2', 'h_i1']);
});

test('anatomía: rodilla, todos los tests salvo el gesto testigo; cribado sin anatomía solo en el dolor nocturno (r2)', () => {
  const sin = TODOS.filter(x => x.h.region === 'rodilla' && !x.t.anatomia);
  assert.ok(sin.length && sin.every(x => x.t.name.startsWith('Gesto testigo')), sin.map(x => `${x.hId}/${x.i}`).join(' '));
  assert.equal(sin.length, 20);
  const con = PREG_CON.filter(p => p.region === 'rodilla').map(p => p.q.id);
  assert.deepEqual(con, ['r_v1', 'r_v2', 'r_v3', 'r_v4', 'r1', 'r_i2', 'r_i3', 'r3', 'r4', 'ro_t1', 'ro_t2', 'ro_t3', 'ro_t4', 'ro_t5', 'ro_t6', 'ro_p1']);
  const sinQ = PREGUNTAS.filter(p => p.region === 'rodilla' && !p.sis.id.startsWith('transversal_') && !p.q.anatomia).map(p => p.q.id);
  assert.deepEqual(sinQ, ['r2']);
});

test('anatomía: codo, todos los tests (no tiene filas de gesto testigo); cribado sin anatomía en las preguntas sin estructura concreta', () => {
  assert.deepEqual(TODOS.filter(x => x.h.region === 'codo' && !x.t.anatomia).map(x => `${x.hId}/${x.i}`), []);
  const con = PREG_CON.filter(p => p.region === 'codo').map(p => p.q.id);
  assert.deepEqual(con, ['co_t1', 'co_t2', 'co4a_uni', 'co4b', 'co3', 'co1', 'co_e1']);
  // Raynaud bilateral y su evolución, miastenia, dolor constante, debilidad proximal
  const sinQ = PREGUNTAS.filter(p => p.region === 'codo' && !p.sis.id.startsWith('transversal_') && !p.q.anatomia).map(p => p.q.id);
  assert.deepEqual(sinQ, ['co4a', 'co4a_prog', 'co_e2b', 'co2', 'co_e2a']);
});

test('anatomía: cervical, sin anatomía solo las filas genéricas (①/②, pronóstico, tabla de cefaleas); cribado sin ella en 4 preguntas', () => {
  // ① gesto testigo / ② medida objetiva, factores pronósticos del latigazo (riesgo,
  // hiperalerta, hiperalgesia al frío), tabla orientativa de cefaleas, fatiga funcional
  assert.deepEqual(TODOS.filter(x => x.h.region === 'cervical' && !x.t.anatomia).map(x => `${x.hId}/${x.i}`),
    ['ce3/5', 'ce4/4', 'ce5/1', 'ce5/2', 'ce5/3', 'ce5/5', 'ce11/1', 'ce12/1', 'ce12/2', 'ce13/2', 'ce14/0']);
  const con = PREG_CON.filter(p => p.region === 'cervical').map(p => p.q.id);
  assert.equal(con.length, 18);
  // Dolor nocturno, peso, cefalea de cambio brusco (arterias cerebrales), artritis inflamatoria de otras articulaciones
  const sinQ = PREGUNTAS.filter(p => p.region === 'cervical' && !p.sis.id.startsWith('transversal_') && !p.q.anatomia).map(p => p.q.id);
  assert.deepEqual(sinQ, ['cv1', 'cv5', 'cv_ar4', 'cv_in2']);
});

test('anatomía: cadera, sin anatomía solo las filas genéricas (longitud de paso, IMC, sensibilización central); cribado sin ella en 1 pregunta', () => {
  assert.deepEqual(TODOS.filter(x => x.h.region === 'cadera' && !x.t.anatomia).map(x => `${x.hId}/${x.i}`),
    ['ca3/7', 'ca13/3', 'ca15/0', 'ca15/1', 'ca15/2', 'ca15/3', 'ca15/4']);
  const con = PREG_CON.filter(p => p.region === 'cadera').map(p => p.q.id);
  assert.equal(con.length, 23);   // + ca_v4 (aorta) y ca_v5 (femoral, poplítea), Fase M
  // Pérdida de peso o bulto nuevo
  const sinQ = PREGUNTAS.filter(p => p.region === 'cadera' && !p.sis.id.startsWith('transversal_') && !p.q.anatomia).map(p => p.q.id);
  assert.deepEqual(sinQ, ['ca_on3']);
});

test('anatomía: lumbar, sin anatomía solo las filas genéricas (regla de Flynn, edad, criterios miofasciales); cribado completo', () => {
  // Flynn es una regla pronóstica; los tres criterios miofasciales no nombran un músculo
  assert.deepEqual(TODOS.filter(x => x.h.region === 'lumbar' && !x.t.anatomia).map(x => `${x.hId}/${x.i}`),
    ['lu1/0', 'lu4/4', 'lu9/0', 'lu9/1', 'lu9/2']);
  const con = PREG_CON.filter(p => p.region === 'lumbar').map(p => p.q.id);
  assert.equal(con.length, 25);
  const sinQ = PREGUNTAS.filter(p => p.region === 'lumbar' && !p.sis.id.startsWith('transversal_') && !p.q.anatomia).map(p => p.q.id);
  assert.deepEqual(sinQ, []);
});

test('anatomía: tobillo y pie, todos los tests salvo el gesto testigo y dos filas genéricas; cribado sin ella en 5 preguntas', () => {
  // «Suele estar sistémicamente bien» (gota) y «No carga cuatro pasos» (fractura maleolar)
  const sin = TODOS.filter(x => x.h.region === 'tobillo_pie' && !x.t.anatomia);
  assert.deepEqual(sin.filter(x => !x.t.name.startsWith('Gesto testigo')).map(x => `${x.hId}/${x.i}`), ['tp35/1', 'tp37/1']);
  assert.equal(sin.length, 37);
  const con = PREG_CON.filter(p => p.region === 'tobillo_pie').map(p => p.q.id);
  assert.equal(con.length, 11);
  // Varias fracturas de estrés (RED-S), artritis inflamatoria, síntomas generales, osteoma osteoide, SDRC
  const sinQ = PREGUNTAS.filter(p => p.region === 'tobillo_pie' && !p.sis.id.startsWith('transversal_') && !p.q.anatomia).map(p => p.q.id);
  assert.deepEqual(sinQ, ['tp_o2', 'tp_i2', 'tp_c1', 'tp_c2', 'tp_n3']);
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
