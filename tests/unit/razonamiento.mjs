// «¿Por qué?» del cribado y de los tests, «Ampliar con IA». Se ejecuta desde tests/unit.js.
import { assert, readFileSync, join, TESTS, leer, test, HYPOTHESES, SYSTEMIC_SCREENING, testPuntua,
   pesoTest, PESO_TEST, buildTestItem, lrEfectiva, fuenteCorta, claveRegistro, enlaceCita,
   citasTest, state, buildPhysiQPayload, buildInformeFisioterapiaText, buildContextSummaryText,
   buildSistemaHTML, BASE_STATE, withState } from './comun.mjs';
const { REFERENCIAS } = await import('../../data/referencias.js');

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

// ── «¿Por qué?» de los tests de la fase 4b (docs/razonamiento-tests.md) ─────
console.log('\nrazonamiento de los tests (fase 4b)');
const { frasesPerdidas } = await import('../criterios.mjs');
const SNAP_CRITERIOS = JSON.parse(readFileSync(join(TESTS, 'fixtures', 'criterios-4b.json'), 'utf8'));
const TODOS_TESTS = Object.entries(HYPOTHESES).flatMap(([hId, h]) => h.tests.map((t, i) => ({ hId, h, t, i })));

test('criterios 4b: nada se pierde al recortar (cada frase sigue en el criterio o en razonamiento.detalle)', () => {
  const { perdidas, sinSnap, sobrantes } = frasesPerdidas(HYPOTHESES, SNAP_CRITERIOS);
  const msg = [
    ...perdidas.map(p => `  perdida en ${p.test}: «${p.frase}»`),
    ...sinSnap.map(k => `  sin instantánea: ${k}`),
    ...sobrantes.map(k => `  instantánea de un test que ya no existe: ${k}`),
  ];
  assert.equal(msg.length, 0, `\n${msg.join('\n')}\n  Si el cambio es a propósito: node tests/gen-criterios-snapshot.mjs (ver su cabecera)`);
});

test('razonamiento de un test: solo porque / detalle / fuentes / citas, textos no vacíos', () => {
  for (const { hId, t } of TODOS_TESTS) {
    const r = t.razonamiento;
    if (!r) continue;
    const extra = Object.keys(r).filter(k => !['porque', 'detalle', 'fuentes', 'citas'].includes(k));
    assert.deepEqual(extra, [], `${hId} «${t.name}»: campos fuera del esquema`);
    assert.ok(r.porque || r.detalle, `${hId} «${t.name}»: razonamiento vacío`);
    for (const k of ['porque', 'detalle']) if (k in r) assert.ok(typeof r[k] === 'string' && r[k].trim(), `${hId} «${t.name}»: ${k} vacío`);
    // «Cuánto pesa» se genera (pesoTest): no se escribe a mano
    assert.ok(!('peso' in r), `${hId} «${t.name}»: peso no va en data/`);
  }
});

test('«¿Por qué?» de un test: con fuentes del registro, y cada cita empieza por una de ellas y cada fuente tiene su cita', () => {
  for (const { hId, t } of TODOS_TESTS) {
    const r = t.razonamiento;
    if (!r?.porque) { assert.ok(!r?.fuentes && !r?.citas, `${hId} «${t.name}»: fuentes sin «por qué»`); continue; }
    assert.ok(r.fuentes?.length, `${hId} «${t.name}»: «por qué» sin fuentes`);
    for (const k of r.fuentes) assert.ok(REFERENCIAS[k], `${hId} «${t.name}»: ${k} no está en el registro`);
    const textos = (r.citas || []).map(c => (typeof c === 'string' ? c : c.texto));
    for (const c of textos) assert.ok(r.fuentes.some(k => c.startsWith(k)), `${hId} «${t.name}»: «${c}» no empieza por una de sus fuentes`);
    for (const k of r.fuentes) assert.ok(textos.some(c => c.startsWith(k)), `${hId} «${t.name}»: ${k} sin cita completa`);
  }
});

test('pesoTest: coherente con la puntuación en los 484 tests (testPuntua)', () => {
  const suman = new Set([PESO_TEST.ambos, PESO_TEST.pos, PESO_TEST.neg, PESO_TEST.cluster]);
  for (const { hId, h, t, i } of TODOS_TESTS) {
    const frase = pesoTest(h, t, i);
    const base = Object.values(PESO_TEST).find(v => frase.startsWith(v));
    assert.ok(base, `${hId} «${t.name}»: frase desconocida «${frase}»`);
    assert.equal(suman.has(base), testPuntua(h, t), `${hId} «${t.name}»: «${frase}» frente a testPuntua`);
    if (!t.cluster && t.tipo !== 'pronostico') {
      const lr = lrEfectiva(t);
      if (base === PESO_TEST.pos) assert.ok(lr.posUtil && !lr.negUtil, `${hId} «${t.name}»`);
      if (base === PESO_TEST.neg) assert.ok(lr.negUtil && !lr.posUtil, `${hId} «${t.name}»`);
    }
  }
});

test('pesoTest: casos sueltos y `absorbe`', () => {
  assert.equal(pesoTest({ tests: [] }, { lr_pos: '6', lr_neg: '0.2' }, 0), PESO_TEST.ambos);
  assert.equal(pesoTest({ tests: [] }, { lr_neg: '0.35', lr_pos: '1.8' }, 0), PESO_TEST.neg);
  assert.equal(pesoTest({ tests: [] }, {}, 0), PESO_TEST.sinLR);
  assert.equal(pesoTest({ tests: [] }, { lr_pos: '1.3', lr_neg: '0.64' }, 0), PESO_TEST.debil);
  assert.equal(pesoTest({ tests: [] }, { lr_pos: '6', tipo: 'pronostico' }, 0), PESO_TEST.pronostico);
  const hyp = { tests: [{ name: 'SLR', lr_neg: '0.3' }, { name: 'RAPIDH: compuesto', lr_pos: '5', absorbe: [0] }] };
  assert.equal(pesoTest(hyp, hyp.tests[0], 0), `${PESO_TEST.neg} No suma aparte si puntúa «RAPIDH».`);
  assert.equal(pesoTest(hyp, hyp.tests[1], 1), PESO_TEST.pos);
});

test('tarjeta del test: «cuánto pesa» siempre, «Ampliar» solo con razonamiento, sin la etiqueta «Sin LR publicada»', () => {
  for (const { hId, h, t, i } of TODOS_TESTS) {
    const html = buildTestItem(hId, t, i);
    assert.ok(html.includes(`<div class="test-peso">${pesoTest(h, t, i)}</div>`), `${hId} «${t.name}»: falta el peso`);
    assert.equal(html.includes(`abrirRazonamientoTest(this,'${hId}',${i})`), !!t.razonamiento, `${hId} «${t.name}»: Ampliar`);
    assert.equal(html.includes('class="razon"'), !!t.razonamiento?.porque, `${hId} «${t.name}»: ¿Por qué?`);
    assert.ok(!html.includes('stat-badge no-data'), `${hId} «${t.name}»: badge redundante`);
    // con «Ampliar», autor y año en la tarjeta (la cita entera, en el panel); sin él, la cita entera
    if (t.fuente) assert.ok(html.includes(t.razonamiento ? fuenteCorta(t.fuente) : t.fuente), `${hId} «${t.name}»: fuente`);
  }
});

test('fuenteCorta: autor y año de cada cita', () => {
  assert.equal(fuenteCorta('Hegedus 2012 (Br J Sports Med 46:964–978; tabla 3) · Zhao 2024 (BMC, tabla 3)'), 'Hegedus 2012 · Zhao 2024');
  assert.equal(fuenteCorta('Lluch 2020, cap. 3.1 (Struyf), p. 54'), 'Lluch 2020, cap. 3.1');
});

test('fuentes del panel: cada cita de un test con razonamiento se resuelve en el registro y se enlaza con su url o su DOI', () => {
  for (const { hId, t } of TODOS_TESTS) {
    if (!t.razonamiento) continue;
    for (const c of citasTest(t)) {
      const texto = typeof c === 'string' ? c : c.texto;
      const k = claveRegistro(texto, REFERENCIAS);
      assert.ok(k, `${hId} «${t.name}»: «${texto}» no empieza por ninguna clave del registro`);
      const r = REFERENCIAS[k];
      const e = enlaceCita(texto, REFERENCIAS);
      if (r.url) assert.equal(e.url, r.url);
      else if (r.doi) assert.equal(e.url, `https://doi.org/${r.doi}`);
      else assert.equal(e, texto, 'sin url ni DOI, sin enlace');
    }
  }
  assert.equal(claveRegistro('Malik y Herron 2023 (StatPearls)', { 'Malik 2023': {}, 'Malik y Herron 2023': {} }), 'Malik y Herron 2023');
  assert.equal(claveRegistro('Kim 20011', { 'Kim 2001': {} }), null);
});

test('razonamiento de los tests: nunca entra en el payload, 📋 Notas ni 📄 Informe', () => {
  const muestra = TODOS_TESTS.find(x => x.t.razonamiento?.detalle && x.h.region === 'hombro');
  if (!muestra) return;
  const { hId, h, t, i } = muestra;
  withState({ region: h.region, activeHypotheses: [hId], testResults: { [hId]: { [i]: 'pos' } } }, () => {
    for (const txt of [JSON.stringify(buildPhysiQPayload()), buildContextSummaryText(), buildInformeFisioterapiaText()]) {
      assert.ok(!txt.includes(t.razonamiento.detalle.slice(0, 40)), 'detalle filtrado a un resumen');
    }
  });
});

test('hombro y rodilla: criterio visible corto (≤ 600 caracteres; los clusters llevan la técnica de cada componente)', () => {
  for (const { hId, h, t } of TODOS_TESTS) {
    if (!['hombro', 'rodilla'].includes(h.region)) continue;
    assert.ok(t.criterio.length <= 600, `${hId} «${t.name}»: ${t.criterio.length} caracteres`);
  }
});

// ── Ampliar con IA (ampliar-ia.js) ───────────────────────────────────────────
console.log('\nampliar con IA (razonamiento de fases 2 y 4b)');
const ampliarIA = await import('../../ampliar-ia.js');

test('ampliar con IA: el prompt lleva el contexto, el fragmento y la frase de fuentes literal', () => {
  const { promptIA, ctxCribado, ctxTest, INSTRUCCION_FUENTES } = ampliarIA;
  assert.equal(INSTRUCCION_FUENTES, 'Busca información solo en fuentes científicas o académicas como PubMed, revistas científicas, libros de medicina o fisiología o fuentes institucionales universitarias.');
  const p = promptIA({ contexto: ctxCribado('tobillo_pie', '¿Dolor <b>nocturno</b>?'), texto: '  La  isquemia\n produce dolor. ' });
  assert.ok(p.includes('la pregunta de cribado de banderas rojas «¿Dolor nocturno?» (región tobillo y pie)'), p);
  assert.ok(p.includes('«La isquemia produce dolor.»'), p);
  assert.ok(p.includes(INSTRUCCION_FUENTES) && p.endsWith('Cita las fuentes con enlace.'), p);
  assert.equal(ctxTest('hombro', 'Hawkins-Kennedy', 'Tendinopatía del manguito'), 'el test clínico «Hawkins-Kennedy» para la hipótesis «Tendinopatía del manguito» (región hombro)');
  assert.equal(ctxTest(undefined, 'Hawkins-Kennedy'), 'el test clínico «Hawkins-Kennedy»');
});

test('ampliar con IA: fragmento recortado, URLs de Perplexity y Google (modo IA) codificadas', () => {
  const { recortarTextoIA, MAX_TEXTO_IA, urlIA, promptIA } = ampliarIA;
  const largo = recortarTextoIA('palabra '.repeat(300));
  assert.ok(largo.length <= MAX_TEXTO_IA + 1 && largo.endsWith('palabra…'), largo.slice(-20));
  const q = promptIA({ contexto: '', texto: 'a & b? «c» 100%' });
  assert.equal(urlIA('perplexity', q), `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}`);
  assert.equal(urlIA('google', q), `https://www.google.com/search?udm=50&q=${encodeURIComponent(q)}`);
  assert.equal(urlIA('otro', q), urlIA('perplexity', q), 'destino desconocido → Perplexity');
  // el prompt más largo posible cabe en la URL
  assert.ok(urlIA('google', promptIA({ contexto: 'x'.repeat(200), texto: 'á'.repeat(5000) })).length < 8000);
});

test('ampliar con IA: destino por defecto Perplexity; cada destino explica su ventaja', () => {
  const { destinoIA, DESTINOS_IA } = ampliarIA;
  assert.equal(destinoIA(), 'perplexity');
  assert.deepEqual(Object.keys(DESTINOS_IA), ['perplexity', 'google']);
  for (const d of Object.values(DESTINOS_IA)) assert.ok(d.nombre && d.ventaja.length > 40);
});

test('ampliar con IA: el módulo no importa nada (no puede leer datos del paciente)', () => {
  const src = leer('ampliar-ia.js');
  assert.ok(!/^\s*import\b/m.test(src) && !/\bimport\(/.test(src), 'ampliar-ia.js no importa módulos');
  assert.ok(!/\bstate\b/.test(src.replace(/\/\/.*$/gm, '')), 'ampliar-ia.js no toca state');
  assert.equal(ampliarIA.attrIA('«a» "b" <c> & d'), '«a» &quot;b&quot; &lt;c&gt; &amp; d');
});

test('ampliar con IA: solo el razonamiento lleva data-ia-ctx y «✨ IA» (fase 2 y tarjetas 4b)', () => {
  const cuenta = (h, t) => h.split(t).length - 1;
  for (const [region, data] of Object.entries(SYSTEMIC_SCREENING)) {
    withState({ region }, () => {
      for (const sis of data.sistemas) {
        const html = buildSistemaHTML(sis);
        const n = sis.preguntas.filter(q => q.razonamiento).length;
        assert.equal(cuenta(html, 'data-ia-ctx='), n, `${region}/${sis.id}`);
        assert.equal(cuenta(html, 'class="ia-parrafo"'), n, `${region}/${sis.id}`);
      }
    });
  }
  for (const { hId, t, i } of TODOS_TESTS) {
    const html = buildTestItem(hId, t, i);
    const n = t.razonamiento?.porque ? 1 : 0;
    assert.equal(cuenta(html, 'data-ia-ctx='), n, `${hId} «${t.name}»`);
    assert.equal(cuenta(html, 'class="ia-parrafo"'), n, `${hId} «${t.name}»`);
  }
});

Object.assign(state, BASE_STATE);   // deja el modo en completo para lo que venga detrás
