// Guía de consulta (guia.html + guia.js), su estructura compartida con los esquemas
// impresos (lib/esquemas.js) y el QR de cada hoja (docs/esquemas/qr.mjs).
// Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, CIF_TREES, HYPOTHESES } from './comun.mjs';
const ESQ = await import('../../lib/esquemas.js');
const T4B = await import('../../lib/tests-4b.js');
const ARBOL = await import('../../lib/arbol.js');
const P4B = await import('../../phase4b.js');
const P4 = await import('../../phase4.js');
const { qrMatriz } = await import('../../docs/esquemas/qr.mjs');
const { dolorInespecifico } = await import('../../lib/region.js');
const { TIEMPOS_TEJIDO } = await import('../../data/tejidos.js');
const HOJAS = await import('../../docs/esquemas/hojas.mjs');

console.log('\nguía de consulta (guia.js, lib/esquemas.js, QR de los esquemas)');

const importsDe = src => [...src.matchAll(/^import\s[^;]*?from\s+'([^']+)'|^import\s+'([^']+)'/gm)].map(m => m[1] || m[2]);

test('la guía solo carga módulos puros: nunca app.js, state.js ni phase4*.js (no puede tocar al paciente)', () => {
  const imp = importsDe(leer('guia.js'));
  assert.ok(imp.length > 0);
  for (const m of imp) assert.ok(!/\/(app|state|phase4b?)\.js$/.test(m), m);
  for (const f of ['lib/esquemas.js', 'lib/tests-4b.js', 'lib/arbol.js'])
    for (const m of importsDe(leer(f))) assert.ok(!/\/(app|state|phase4b?)\.js$/.test(m), `${f}: ${m}`);
  assert.ok(!/localStorage\.setItem|indexedDB|BroadcastChannel/.test(leer('guia.js')), 'la guía no guarda nada');
});

test('se despliega: guia.html, guia.js y todo lo que importan están en deploy-to-hub.yml', () => {
  const deploy = leer('.github', 'workflows', 'deploy-to-hub.yml');
  for (const f of ['guia.html', 'guia.js', 'lib/esquemas.js', 'lib/tests-4b.js', 'lib/arbol.js', 'lib/version.js', 'lib/region.js', 'lib/citas.js', 'ampliar-ia.js', 'ficha.js'])
    assert.ok(deploy.includes(f), f);
  assert.ok(leer('guia.html').includes('src="./guia.js"'));
});

test('phase4b.js y phase4.js reexportan lo que pasó a lib/ (los demás módulos no cambian)', () => {
  for (const k of ['LR_POS_MIN', 'LR_NEG_MAX', 'parseProporcion', 'parseLR', 'lrEfectiva', 'testPuntua', 'PESO_TEST', 'pesoTest', 'enlacesAnatomia', 'anatomiaLineaHTML', 'anatomiaPanelHTML', 'citasTest', 'calcLRScore', 'etiquetaHipHTML'])
    assert.equal(P4B[k], T4B[k], k);
  assert.equal(P4.resolveOptionTargets, ARBOL.resolveOptionTargets);
});

test('cribado de la guía y de la hoja: mismas preguntas, mismo orden; solo las de la región', () => {
  for (const region of Object.keys(CIF_TREES)) {
    const { siempre, especiales } = ESQ.sistemasCribado(SYSTEMIC_SCREENING, region);
    assert.equal(siempre.length + especiales.length, SYSTEMIC_SCREENING[region].sistemas.length, region);
    assert.ok(siempre.every(s => !ESQ.soloDeSistema(s)) && especiales.every(s => ESQ.soloDeSistema(s)), region);
    for (const s of [...siempre, ...especiales])
      for (const q of ESQ.preguntasDeRegion(s, region)) assert.ok(!q.regiones || q.regiones.includes(region), `${region} ${q.id}`);
  }
  // Toda condición «solo» de un sistema tiene su texto
  const solos = new Set(Object.values(SYSTEMIC_SCREENING).flatMap(r => r.sistemas.flatMap(s => Object.keys(s).filter(k => k.startsWith('solo')))));
  for (const k of solos) assert.ok(ESQ.CONDICION_SISTEMA[k], k);
});

test('cada paso del árbol tiene etiqueta única en su región (la de la hoja y la guía)', () => {
  for (const [region, tree] of Object.entries(CIF_TREES)) {
    const etq = tree.steps.map((s, i) => ESQ.etiquetaPaso(s, i));
    assert.equal(new Set(etq).size, etq.length, `${region}: ${etq}`);
  }
});

test('las direcciones del QR: #región/hoja que la guía entiende, de las 7 regiones', () => {
  const guia = leer('guia.js');
  for (const r of Object.keys(CIF_TREES)) for (const h of Object.keys(ESQ.HOJAS_GUIA)) {
    const u = ESQ.urlGuia(r, h);
    assert.ok(u.startsWith(ESQ.URL_GUIA + '#'), u);
    assert.equal(u.split('#')[1], `${r}/${h}`);
  }
  for (const h of Object.keys(ESQ.HOJAS_GUIA)) assert.ok(new RegExp(`\\b${h}: html`).test(guia), `la guía pinta «${h}»`);
  assert.equal(ESQ.URL_GUIA, 'https://physiodevapp.github.io/physiq/assessment/guia.html');
  // Anclas de cada elemento: las mismas ids que pinta la guía
  assert.ok(guia.includes('id="q-${q.id}"') && guia.includes('id="paso-${st.id}"') && guia.includes('id="test-${h.id}-${k}"'));
});

test('QR: tamaño por versión, buscadores en tres esquinas y siempre la misma matriz', () => {
  const buscador = (m, x, y) => [0, 6].every(d => m[y][x + d] && m[y + d][x]) && m[y + 3][x + 3] && !m[y + 1][x + 1];
  for (const [texto, lado] of [['A', 21], ['x'.repeat(60), 33], [ESQ.urlGuia('tobillo_pie', 'confirmacion'), 37]]) {
    const m = qrMatriz(texto), n = m.length;
    assert.equal(n, lado, texto.slice(0, 20));
    assert.ok(buscador(m, 0, 0) && buscador(m, n - 7, 0) && buscador(m, 0, n - 7), 'buscadores');
    assert.ok(m[n - 8][8], 'módulo oscuro fijo');
    assert.deepEqual(qrMatriz(texto), m);
  }
  assert.throws(() => qrMatriz('x'.repeat(300)));
});

test('sin hipótesis al final del árbol: un solo nombre por región en la 4b, la fase 5, la guía y los esquemas', () => {
  assert.equal(dolorInespecifico('lumbar'), 'dolor lumbar inespecífico');
  assert.equal(dolorInespecifico('cervical'), 'dolor cervical inespecífico');
  assert.equal(dolorInespecifico('hombro'), 'dolor de hombro inespecífico');
  assert.equal(dolorInespecifico('tobillo_pie'), 'dolor de tobillo y pie inespecífico');
  for (const f of ['phase4b.js', 'app.js', 'guia.js', 'docs/esquemas/hojas.mjs']) {
    const src = leer(...f.split('/'));
    assert.ok(src.includes('dolorInespecifico('), f);
    assert.ok(!/[Dd]olor (de )?\$\{[^}]*\} inespecífico/.test(src), `${f}: compone el nombre a mano`);
  }
});

test('hojas de tiempos de tejido: cada grupo de data/tejidos.js va en una sola de las dos hojas, y el QR abre su página en la guía', () => {
  const todos = Object.values(ESQ.HOJAS_TEJIDO).flatMap(h => h.grupos);
  assert.deepEqual([...todos].sort(), TIEMPOS_TEJIDO.grupos.map(g => g.id).sort(), 'un grupo nuevo necesita su hoja (lib/esquemas.js, HOJAS_TEJIDO)');
  assert.equal(new Set(todos).size, todos.length);
  for (const k of Object.keys(ESQ.HOJAS_TEJIDO)) {
    const d = ESQ.datosHojaTejido(TIEMPOS_TEJIDO, k);
    assert.deepEqual(d.grupos.map(g => g.id), ESQ.HOJAS_TEJIDO[k].grupos);
    assert.equal(d.columnas, TIEMPOS_TEJIDO.columnas);
    assert.ok(ESQ.urlTejidos(k).endsWith(`guia.html#tejidos/${k}`));
    assert.ok(qrMatriz(ESQ.urlTejidos(k)).length > 0);
  }
  const deploy = leer('.github', 'workflows', 'deploy-to-hub.yml');
  for (const f of ['lib/tejidos.js', 'data/']) assert.ok(deploy.includes(f), f);
});

test('hojas impresas al día: docs/esquemas/huellas.json coincide con lo que imprimirían los datos de hoy', () => {
  const H = HOJAS;
  const guardadas = JSON.parse(leer('docs', 'esquemas', 'huellas.json'));
  const actuales = H.huellasActuales();
  const desfasadas = Object.keys(actuales).filter(k => guardadas[k]?.huella !== actuales[k]);
  for (const [k, v] of Object.entries(guardadas)) assert.match(v.fecha || '', /^\d{4}-\d{2}-\d{2}$/, `${k}: fecha del último cambio`);
  assert.deepEqual(desfasadas, [], `Hojas desfasadas: ${desfasadas.join(', ')}. Regenera con «node docs/esquemas/generar.mjs todas todos» (o la región y el tipo) y sube los PDF, los PNG y huellas.json`);
  assert.deepEqual(Object.keys(guardadas).sort(), Object.keys(actuales).sort(), 'huellas.json tiene hojas que ya no existen');
  // La huella no depende de la fecha ni del QR (marcadores), solo de lo impreso
  const h = H.hojasImpresas()[0];
  const final = H.rematar(h.html(), { guia: h.guia, huella: actuales[h.clave], fecha: '1/1/2000' });
  assert.ok(!final.includes('<!--') || !/<!--(QR|HUELLA|FECHA)-->/.test(final));
  assert.ok(final.includes(`v. ${actuales[h.clave]}`));
  assert.equal(ESQ.urlGuia('lumbar', 'cribado', 'abc12345'), `${ESQ.URL_GUIA}?h=abc12345#lumbar/cribado`);
  assert.equal(ESQ.urlTejidos('hueso', 'abc12345'), `${ESQ.URL_GUIA}?h=abc12345#tejidos/hueso`);
  const deploy = leer('.github', 'workflows', 'deploy-to-hub.yml');
  assert.ok(deploy.includes('docs/esquemas/huellas.json') && deploy.includes('docs/esquemas/*.pdf'), 'huellas y PDF se despliegan para la guía');
});
