// Lector de cuestionarios con foto, fase de medición (lib/lector-cuestionarios.js,
// docs/esquemas/respuestas.mjs, tools/leer-cuestionario.mjs; docs/lector-cuestionarios.md).
// Se ejecuta desde tests/unit.js.
import { assert, leer, test, existsSync, readdirSync, join, RAIZ } from './comun.mjs';
const { CUESTIONARIOS } = await import('../../data.js');
const LC = await import('../../lib/lector-cuestionarios.js');
const { puntuar, NA } = await import('../../lib/cuestionarios.js');
const HR = await import('../../docs/esquemas/respuestas.mjs');

console.log('\nlector de cuestionarios con foto');

const def = id => CUESTIONARIOS.find(d => d.id === id);
// Todas las cadenas posibles del esquema están en un enum (el modelo no puede escribir texto libre)
function sinTextoLibre(esq, ruta = '') {
  if (Array.isArray(esq)) return esq.forEach((x, i) => sinTextoLibre(x, `${ruta}[${i}]`));
  if (!esq || typeof esq !== 'object') return;
  assert.notEqual(esq.type, 'string', `${ruta}: cadena libre`);
  if (esq.type === 'object') {
    assert.equal(esq.additionalProperties, false, `${ruta}: additionalProperties`);
    assert.deepEqual([...esq.required].sort(), Object.keys(esq.properties).sort(), `${ruta}: required`);
  }
  for (const [k, v] of Object.entries(esq)) if (k !== 'enum') sinTextoLibre(v, `${ruta}.${k}`);
}
// Lectura con todos los ítems en su primer valor (o «sí», o la primera opción)
const lecturaPrimera = d => ({ items: Object.fromEntries(LC.itemsLegibles(d).map(it => {
  const v = LC.valoresItem(d, it)[0];
  return [String(it.n), { estado: 'marcado', valor: it.tipo === 'marcas' ? [v] : v }];
})) });

test('lector: esquema de salida por cuestionario, sin texto libre y con una entrada por ítem legible', () => {
  for (const d of CUESTIONARIOS.filter(LC.tieneHojaRespuestas)) {
    const esq = LC.esquemaLectura(d);
    sinTextoLibre(esq, d.id);
    assert.deepEqual(Object.keys(esq.properties.items.properties), LC.itemsLegibles(d).map(it => String(it.n)), `${d.id}: ítems`);
  }
});

test('lector: las escalas visuales en mm o cm no se leen (iHOT-12 sin hoja; la EVA del ASES la apunta el fisio)', () => {
  assert.equal(LC.tieneHojaRespuestas(def('ihot12')), false);
  assert.ok(!('1' in LC.esquemaLectura(def('ases')).properties.items.properties));
  assert.match(LC.promptLectura(def('ases')), /Las filas 1 no se leen/);
  assert.ok(!HR.cuestionariosConHoja().some(d => d.id === 'ihot12'));
  assert.match(HR.htmlRespuestas(def('ases')), /Lo apunta el fisioterapeuta/);
});

test('lector: el prompt describe cada fila con sus casillas y pide no transcribir', () => {
  for (const d of CUESTIONARIOS.filter(LC.tieneHojaRespuestas)) {
    const p = LC.promptLectura(d);
    for (const it of LC.itemsLegibles(d)) assert.ok(p.includes(`- Fila ${it.n} (`), `${d.id} ${it.n}`);
    assert.match(p, /No transcribas nada del papel/);
    assert.match(p, /Ante la duda, siempre «dudoso»/);
  }
  assert.match(LC.promptLectura(def('koos'), { paginas: 3 }), /^Estas 3 fotos son las páginas/);
});

test('lector: una lectura fuera de las casillas o incoherente se trata como ilegible', () => {
  const d = def('phq9'), it = d.items[0];
  assert.deepEqual(LC.normalizarItem(d, it, { estado: 'marcado', valor: 2 }), { estado: 'marcado', valor: 2 });
  assert.equal(LC.normalizarItem(d, it, { estado: 'marcado', valor: 4 }).incoherente, true);
  assert.equal(LC.normalizarItem(d, it, { estado: 'marcado', valor: null }).incoherente, true);
  assert.equal(LC.normalizarItem(d, it, { estado: 'en_blanco', valor: 1 }).incoherente, true);
  assert.equal(LC.normalizarItem(d, it, { estado: 'marcado', valor: NA }).incoherente, true, 'sin N/A en el PHQ-9');
  assert.equal(LC.normalizarItem(d, it, undefined).estado, 'ilegible');
  const odi = def('odi');
  assert.deepEqual(LC.normalizarItem(odi, odi.items[0], { estado: 'marcado', valor: NA }), { estado: 'marcado', valor: NA });
  const ore = def('orebro'), zonas = ore.items.find(i => i.tipo === 'marcas');
  assert.equal(LC.normalizarItem(ore, zonas, { estado: 'marcado', valor: [1, 1] }).incoherente, true, 'marcas repetidas');
  assert.equal(LC.normalizarItem(ore, zonas, { estado: 'marcado', valor: [] }).incoherente, true);
  assert.deepEqual(LC.normalizarLectura(d, null)[1], { estado: 'ilegible', valor: null, incoherente: true });
});

test('lector: la lectura confirmada se puntúa igual que tocando la calculadora (la IA no puntúa)', () => {
  for (const d of CUESTIONARIOS.filter(LC.tieneHojaRespuestas)) {
    const lect = LC.normalizarLectura(d, lecturaPrimera(d));
    const { respuestas, dudosos, pendientes } = LC.propuestaConfirmacion(d, lect);
    assert.deepEqual([dudosos, pendientes], [[], []], d.id);
    // A mano: el primer valor de cada casilla, en el formato de la calculadora
    const aMano = Object.fromEntries(LC.itemsLegibles(d).map(it => [it.n, it.tipo === 'opciones' ? 0 : it.tipo === 'marcas' ? [0] : LC.valoresItem(d, it)[0]]));
    assert.deepEqual(respuestas, aMano, d.id);
    if (d.items.every(LC.itemLegible)) assert.ok(puntuar(d, respuestas).completo, `${d.id}: completo`);
  }
  const d = def('phq9');
  const p = LC.propuestaConfirmacion(d, LC.normalizarLectura(d, { items: { 1: { estado: 'dudoso', valor: 1 }, 2: { estado: 'en_blanco', valor: null } } }));
  assert.deepEqual(p.dudosos, [1]);
  assert.ok(p.pendientes.includes(2) && p.pendientes.includes(9));
});

test('lector: clases de la medición (el error peligroso es el leído mal y dado por bueno)', () => {
  const c = (correcta, estado, valor) => LC.clasificarItem(correcta, { estado, valor }).clase;
  assert.equal(c(2, 'marcado', 2), 'ok');
  assert.equal(c(2, 'marcado', 1), 'peligroso');
  assert.equal(c(2, 'dudoso', 1), 'dudoso');
  assert.equal(c(2, 'ilegible', null), 'pendiente');
  assert.equal(c(2, 'en_blanco', null), 'omitido');
  assert.equal(c('blanco', 'en_blanco', null), 'ok');
  assert.equal(c('blanco', 'marcado', 0), 'peligroso', 'marca inventada');
  assert.equal(c('blanco', 'ilegible', null), 'pendiente');
  assert.equal(c('ambiguo', 'dudoso', 1), 'ok');
  assert.equal(c('ambiguo', 'marcado', 1), 'peligroso', 'ambigua dada por clara');
  assert.equal(c([1, 3], 'marcado', [3, 1]), 'ok', 'marcas en cualquier orden');
  assert.equal(c([1, 3], 'marcado', [1]), 'peligroso');
  const d = def('phq9');
  const lect = LC.normalizarLectura(d, { items: { 9: { estado: 'marcado', valor: 0 } } });
  const cmp = LC.compararLectura(d, lect, { 9: 1 });
  assert.equal(cmp.peligrososAlerta, 1, 'ítem 9 del PHQ-9: alerta');
});

test('lector: umbral (peligrosos < 0,5 %, ninguno en ítems de alerta, a revisar ≤ 15 %)', () => {
  const cmp = (ok, peligroso, dudoso = 0, alerta = 0) => ({ cuenta: { ok, peligroso, dudoso, pendiente: 0, omitido: 0 }, peligrososAlerta: alerta });
  assert.equal(LC.resumirLecturas([cmp(996, 4)]).supera, true);
  assert.equal(LC.resumirLecturas([cmp(995, 5)]).supera, false);
  assert.equal(LC.resumirLecturas([cmp(999, 1, 0, 1)]).supera, false);
  assert.equal(LC.resumirLecturas([cmp(840, 0, 160)]).supera, false);
  assert.equal(LC.resumirLecturas([cmp(300, 0)]).cotaPeligrosos95, 0.01, 'regla del tres');
  assert.equal(LC.resumirLecturas([]).supera, false);
});

test('lector: validación de las respuestas correctas anotadas a mano', () => {
  const d = def('phq9');
  const bien = { 1: 0, 2: 1, 3: 'blanco', 4: 'ambiguo', 5: 3, 6: 0, 7: 0, 8: 0, 9: 0 };
  assert.deepEqual(LC.validarCorrectas(d, bien), []);
  assert.equal(LC.validarCorrectas(d, { ...bien, 1: 4 }).length, 1);
  assert.equal(LC.validarCorrectas(d, { ...bien, 10: 0 }).length, 1);
  const { 9: _, ...falta } = bien;
  assert.match(LC.validarCorrectas(d, falta)[0], /ítem 9: sin respuesta/);
});

test('lector: casos de medición válidos y sin fotos en el repo', () => {
  const dir = join(RAIZ, 'tests', 'fixtures', 'cuestionarios-foto');
  assert.ok(existsSync(join(dir, 'LEEME.md')));
  const archivos = readdirSync(dir, { recursive: true }).map(String);
  assert.deepEqual(archivos.filter(f => /\.(jpe?g|png|heic|webp|gif|tiff?)$/i.test(f)), [], 'las fotos no entran en el repo');
  for (const f of archivos.filter(f => /^[^/]+\.json$/.test(f))) {
    const c = JSON.parse(leer('tests', 'fixtures', 'cuestionarios-foto', f));
    const d = def(c.cuestionario);
    assert.ok(d && LC.tieneHojaRespuestas(d), `${f}: cuestionario`);
    assert.deepEqual(LC.validarCorrectas(d, c.correctas), [], f);
    assert.ok(Array.isArray(c.fotos) && c.fotos.length, `${f}: fotos`);
  }
});

test('hoja de respuestas: al día con data/cuestionarios.js, con todas las filas y pidiendo no escribir el nombre', () => {
  const guardadas = JSON.parse(leer('docs', 'esquemas', 'respuestas', 'huellas.json'));
  const actuales = HR.huellasRespuestas();
  const desfasadas = Object.keys(actuales).filter(k => guardadas[k] !== actuales[k]);
  assert.deepEqual(desfasadas, [], `Hojas de respuestas desfasadas: ${desfasadas.join(', ')}. Regenera con «node docs/esquemas/generar-respuestas.mjs <id>» y sube PDF, PNG y huellas.json`);
  assert.deepEqual(Object.keys(guardadas).sort(), Object.keys(actuales).sort());
  for (const id of Object.keys(actuales)) assert.ok(existsSync(join(RAIZ, 'docs', 'esquemas', 'respuestas', `${id}.pdf`)), `${id}.pdf`);
  for (const d of HR.cuestionariosConHoja()) {
    const html = HR.htmlRespuestas(d);
    assert.match(html, /No escribas tu nombre/);
    assert.ok(html.includes(`v. ${LC.huellaHojaRespuestas(d)}`), d.id);
    for (const it of d.items) assert.ok(html.includes(`data-n="${it.n}"`), `${d.id} ${it.n}`);
  }
  // La huella cambia si cambian las casillas, no si cambia otra cosa del cuestionario
  const d = def('phq9');
  assert.equal(LC.huellaHojaRespuestas({ ...d, fuente: 'otra' }), LC.huellaHojaRespuestas(d));
  assert.notEqual(LC.huellaHojaRespuestas({ ...d, escala: { min: 0, max: 4 } }), LC.huellaHojaRespuestas(d));
});

test('lector: la app no lo carga todavía (fase de medición)', () => {
  for (const f of ['app.js', 'index.html', 'informe-ia.js', 'lib/cuestionarios.js']) assert.ok(!leer(f).includes('lector-cuestionarios'), f);
});
