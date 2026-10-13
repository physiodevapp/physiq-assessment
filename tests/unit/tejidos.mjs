// Tiempos de recuperación de tejidos (panel ⏱ de la cabecera: data/tejidos.js,
// lib/tejidos.js, docs/tiempos-tejido.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, TIEMPOS_TEJIDO } from './comun.mjs';
const { posicionDia, marcaHoy, tiemposTejidoHTML, gruposVisibles, rangoFase } = await import('../../lib/tejidos.js');
const { REFERENCIAS } = await import('../../data/referencias.js');

console.log('\ntiempos de tejido');

const T = TIEMPOS_TEJIDO;
const filas = T.grupos.flatMap(g => g.filas);
const subtipos = filas.flatMap(f => f.subtipos || []);
const n = T.columnas.length;

test('tejidos: columnas con `hasta` creciente; filas con rango dentro del eje y gravedad conocida', () => {
  T.columnas.forEach((c, i) => assert.ok(c.hasta > (i ? T.columnas[i - 1].hasta : 0), `columna ${c.etiqueta}`));
  for (const f of filas) {
    assert.ok(Number.isInteger(f.desde) && Number.isInteger(f.hasta) && f.desde >= 0 && f.hasta < n && f.desde <= f.hasta, `rango de ${f.id}`);
    assert.ok(f.gravedad in T.gravedades, `gravedad de ${f.id}`);
  }
  assert.equal(new Set(filas.map(f => f.id)).size, filas.length, 'ids repetidos');
});

test('tejidos: toda fila tiene fuente del registro o va marcada `pendiente`; las fuentes existen en data/referencias.js', () => {
  for (const f of filas) {
    assert.ok(f.fuentes.length || f.pendiente === true, `${f.id}: sin fuente ni pendiente`);
    assert.ok(!(f.fuentes.length && f.pendiente), `${f.id}: con fuente y pendiente a la vez`);
    for (const k of f.fuentes) assert.ok(REFERENCIAS[k], `${f.id}: «${k}» no está en el registro`);
  }
  for (const f of T.fases) for (const k of f.fuentes) assert.ok(REFERENCIAS[k], `fase ${f.id}: «${k}» no está en el registro`);
});

test('tejidos: las fases de reparación son contiguas y caben en el eje', () => {
  T.fases.forEach((f, i) => {
    assert.ok(f.desdeDia < f.hastaDia, f.id);
    if (i) assert.equal(f.desdeDia, T.fases[i - 1].hastaDia, `${f.id} no empieza donde acaba la anterior`);
  });
  assert.equal(T.fases[0].desdeDia, 0);
  assert.ok(T.fases.at(-1).hastaDia <= T.columnas.at(-1).hasta);
});

test('tejidos: las filas que salen de la tabla del wiki conservan su rango (escritorio del wiki)', () => {
  // Índices de columna de la tabla «Tiempos de Tejido» de physiq-wiki (fb3acbf)
  const WIKI = { tendinopatia: [2, 5], doms: [0, 0], musculo_g1: [1, 2], musculo_g2: [2, 3], musculo_g3: [2, 4],
    ligamento_g1: [1, 2], ligamento_g2: [2, 4], ligamento_g3: [3, 5], injerto: [4, 6], fractura: [2, 5],
    // No es del wiki: de Wu 2017 (remodelación desde las 6–8 semanas, 1–2 años)
    tendon_rotura: [3, 7] };
  for (const [id, [a, b]] of Object.entries(WIKI)) {
    const f = filas.find(x => x.id === id);
    assert.deepEqual([f.desde, f.hasta], [a, b], id);
  }
});

test('posicionDia: bordes de columna, monotonía y extremos', () => {
  assert.equal(posicionDia(0, T.columnas), 0);
  assert.equal(posicionDia(-3, T.columnas), 0);
  T.columnas.forEach((c, i) => assert.ok(Math.abs(posicionDia(c.hasta, T.columnas) - (i + 1) / n) < 1e-9, c.etiqueta));
  assert.equal(posicionDia(5000, T.columnas), 1);
  let prev = -1;
  for (let d = 0; d <= 800; d += 1) { const p = posicionDia(d, T.columnas); assert.ok(p >= prev, `día ${d}`); prev = p; }
});

test('marcaHoy: semanas → posición y texto; sin semanas, nada', () => {
  assert.equal(marcaHoy(null, T.columnas), null);
  assert.equal(marcaHoy(undefined, T.columnas), null);
  const m = marcaHoy(6, T.columnas);   // 42 días: mitad de «5–8 semanas» (28–56)
  assert.ok(Math.abs(m.pos - 3.5 / n) < 1e-9);
  assert.equal(m.texto, 'Hoy · 6 semanas tras la cirugía');
  assert.equal(marcaHoy(1, T.columnas).texto, 'Hoy · 1 semana tras la cirugía');
  assert.equal(marcaHoy(0, T.columnas).pos, 0);
  assert.match(marcaHoy(200, T.columnas).texto, /fuera del eje/);
  assert.equal(marcaHoy(200, T.columnas).pos, 1);
});

test('tiemposTejidoHTML: una barra por fila, «pendiente de fuente» donde toca, línea «Hoy» solo posquirúrgico con semanas', () => {
  const sin = tiemposTejidoHTML(T);
  // una barra por fila y por subtipo (los subtipos van plegados, pero están en el HTML)
  assert.equal((sin.match(/class="tej-barra /g) || []).length, filas.length + subtipos.length);
  assert.ok(!sin.includes('class="tej-hoy"'));
  assert.ok(sin.includes('Con mecanismo Post-quirúrgico'));
  const pendientes = filas.filter(f => f.pendiente).length + (T.fases.some(f => !f.fuentes.length) ? 1 : 0);
  assert.equal((sin.match(/class="tej-pendiente"/g) || []).length, pendientes);
  // Sin mecanismo posquirúrgico, aunque haya semanas, no se marca nada
  assert.ok(!tiemposTejidoHTML(T, { semanas: 6 }).includes('class="tej-hoy"'));
  const posq = tiemposTejidoHTML(T, { posquirurgico: true, semanas: 6 });
  // una por fila (en el eje solo la etiqueta «Hoy»; la leyenda de fases no lleva línea)
  assert.equal((posq.match(/class="tej-hoy"/g) || []).length, filas.length + subtipos.length);
  assert.equal((posq.match(/class="tej-hoy-etq"/g) || []).length, 1);
  assert.ok(posq.includes('Hoy · 6 semanas tras la cirugía'));
  assert.ok(tiemposTejidoHTML(T, { posquirurgico: true }).includes('tarjeta «Cirugía»'));
  // Tira de fases en el eje fijo: una por fase, con su color
  assert.equal((sin.match(/class="tej-eje-fase tej-fase-/g) || []).length, T.fases.length);
  // Barras en su columna (grid-column de inicio y fin+1)
  const g2 = posq.match(/data-tejido="ligamento_g2".*?grid-column:(\d+) \/ (\d+)/);
  assert.deepEqual([+g2[1], +g2[2]], [3, 6]);
});

test('tiempos de tejido: solo consulta — ni payload, ni resúmenes, ni informe con IA lo importan', () => {
  for (const f of ['lib/resumenes.js', 'lib/informe-narrativo.js', 'informe-ia.js', 'phase4.js', 'phase4b.js', 'lib/revision-informe.js', 'lib/reglas-informe.js']) {
    assert.ok(!/tejidos|TIEMPOS_TEJIDO/.test(leer(f)), `${f} no debe leer los tiempos de tejido`);
  }
  // En app.js solo lo usa el panel
  const app = leer('app.js');
  const usos = [...app.matchAll(/TIEMPOS_TEJIDO|tiemposTejidoHTML/g)].length;
  assert.equal(usos, 4, 'import de data.js, import de lib/tejidos.js y la llamada en abrirTiemposTejido()');
  const cuerpo = app.slice(app.indexOf('function buildPhysiQPayload'), app.indexOf('function buildPhysiQPayload') + 6000);
  assert.ok(!/tejid/i.test(cuerpo));
});

test('tejidos: grupos con id único; subtipos (si los hay) con la forma de una fila, fuente o pendiente, y dentro del eje', () => {
  const ids = T.grupos.map(g => g.id);
  assert.ok(ids.every(Boolean) && new Set(ids).size === ids.length && !ids.includes('todos'), 'ids de grupo');
  for (const st of subtipos) {
    assert.ok(Number.isInteger(st.desde) && Number.isInteger(st.hasta) && st.desde >= 0 && st.hasta < n && st.desde <= st.hasta, `rango de ${st.id}`);
    assert.ok(!st.gravedad || st.gravedad in T.gravedades, `gravedad de ${st.id}`);
    assert.ok(st.fuentes.length || st.pendiente === true, `${st.id}: sin fuente ni pendiente`);
    for (const k of st.fuentes) assert.ok(REFERENCIAS[k], `${st.id}: «${k}» no está en el registro`);
  }
  const todos = [...filas, ...subtipos].map(f => f.id);
  assert.equal(new Set(todos).size, todos.length, 'ids de fila y subtipo repetidos');
});

test('tejidos: la remodelación del tendón sigue más allá del año (Wu 2017) y se pinta como parcial', () => {
  const f = T.fases.find(x => x.id === 'remodelacion_tendon');
  assert.deepEqual([f.desdeDia, f.hastaDia, f.fuentes], [365, 730, ['Wu 2017']]);
  assert.ok(f.tejido);
  const h = tiemposTejidoHTML(T);
  assert.ok(/tej-eje-fase tej-fase-remodelacion_tendon tej-fase-parcial/.test(h));
  assert.ok(/tej-fase-ley tej-fase-remodelacion_tendon tej-fase-parcial.*?Remodelación \(tendón\)<\/span><span class="tej-fase-rango">1–2 años</.test(h));
});

test('tiemposTejidoHTML: filtro por tejido sin «Todos»: tocar la pastilla activa (o el título del grupo) vuelve a todos', () => {
  assert.equal(gruposVisibles(T.grupos, 'todos').length, T.grupos.length);
  assert.equal(gruposVisibles(T.grupos, 'no-existe').length, T.grupos.length);
  assert.deepEqual(gruposVisibles(T.grupos, 'ligamento').map(g => g.id), ['ligamento']);
  const todos = tiemposTejidoHTML(T);
  // Una pastilla por grupo, ninguna «Todos» y ninguna activa
  assert.equal((todos.match(/class="tej-filtro-btn/g) || []).length, T.grupos.length);
  assert.ok(!todos.includes('>Todos<') && !todos.includes('tej-filtro-btn activo'));
  assert.ok(todos.includes('class="tej-filtro-btn" data-grupo="ligamento" data-filtro-tejido="ligamento" aria-pressed="false"'));
  assert.ok(todos.includes('class="tej-grupo" data-grupo="ligamento" data-filtro-tejido="ligamento"'));
  const lig = tiemposTejidoHTML(T, { filtro: 'ligamento' });
  const nLig = T.grupos.find(g => g.id === 'ligamento').filas.reduce((n, f) => n + 1 + (f.subtipos?.length || 0), 0);
  assert.equal((lig.match(/class="tej-barra /g) || []).length, nLig);
  // La activa lleva aria-pressed y, al tocarla otra vez, pone 'todos'
  assert.ok(lig.includes('class="tej-filtro-btn activo" data-grupo="ligamento" data-filtro-tejido="todos" aria-pressed="true"'));
  assert.ok(lig.includes('class="tej-grupo" data-grupo="ligamento" data-filtro-tejido="todos"'), 'el título del grupo filtrado vuelve a todos');
  // El eje, la leyenda de fases y la línea «Hoy» siguen con cualquier filtro
  assert.ok(lig.includes('tej-eje') && lig.includes('tej-fases'));
  assert.ok(tiemposTejidoHTML(T, { filtro: 'ligamento', posquirurgico: true, semanas: 6 }).includes('class="tej-hoy-etq"'));
});

test('tiemposTejidoHTML: los subtipos se pintan plegados bajo su fila, con la gravedad de la fila si no traen la suya', () => {
  const datos = structuredClone(T);
  const g2 = datos.grupos.find(g => g.id === 'ligamento').filas.find(f => f.id === 'ligamento_g2');
  g2.subtipos = [{ id: 'x_tobillo', nombre: 'Prueba tobillo', desde: 2, hasta: 3, fuentes: [], pendiente: true }];
  const h = tiemposTejidoHTML(datos);
  assert.ok(h.includes('<details class="tej-subtipos"><summary>Ver 1 subtipo</summary>'));
  assert.ok(/class="tej-fila tej-subfila" data-tejido="x_tobillo".*?tej-barra tej-moderada/.test(h));
  // Sin subtipos, nada
  assert.ok(!tiemposTejidoHTML(T).includes('tej-subtipos') || subtipos.length > 0);
});

test('tejidos: leyenda de fases con nombre entero y rango corto, una entrada por fase', () => {
  const h = tiemposTejidoHTML(T);
  assert.equal((h.match(/<li class="tej-fase-ley /g) || []).length, T.fases.length);
  for (const f of T.fases) assert.ok(h.includes(`<span class="tej-fase-nombre">${f.nombre}</span>`), f.id);
  assert.ok(h.includes('<span class="tej-fase-rango">días 0–5</span>') && h.includes('<span class="tej-fase-rango">sem. 3–1 año</span>'));
  assert.deepEqual([[0, 5], [5, 21], [21, 365], [365, 730]].map(([a, b]) => rangoFase(a, b)), ['días 0–5', 'día 5–sem. 3', 'sem. 3–1 año', '1–2 años']);
});

test('tejidos, Fase J 1: subtipos de esguince lateral de tobillo con los plazos de Bergman 2025 y Vuurberg 2018', () => {
  const st = Object.fromEntries(subtipos.filter(x => x.id.startsWith('tobillo_')).map(x => [x.id, x]));
  // Bergman 2025: I 1–2 sem → «4–14 d»; II 3–6 sem → «3–4 s»–«5–8 s»; III 6–12 sem → «5–8 s»–«2–3 m»;
  // reparación: 12–16 sem (Vuurberg 2018) / 3–4 meses (Bergman) → «2–3 m»–«3–6 m»
  assert.deepEqual([st.tobillo_lateral_g1.desde, st.tobillo_lateral_g1.hasta], [1, 1]);
  assert.deepEqual([st.tobillo_lateral_g2.desde, st.tobillo_lateral_g2.hasta], [2, 3]);
  assert.deepEqual([st.tobillo_lateral_g3.desde, st.tobillo_lateral_g3.hasta], [3, 4]);
  assert.deepEqual([st.tobillo_lateral_cirugia.desde, st.tobillo_lateral_cirugia.hasta], [4, 5]);
  for (const x of Object.values(st)) assert.ok(x.fuentes.includes('Bergman 2025') || x.fuentes.includes('Vuurberg 2018'), x.id);
  // Cada subtipo cae dentro (o casi) de su fila madre de grado: no se sale del rango del wiki por delante
  const madre = id => filas.find(f => f.subtipos?.some(x => x.id === id));
  for (const x of Object.values(st)) assert.ok(x.desde >= madre(x.id).desde, `${x.id} empieza antes que su fila`);
});

test('tejidos, Fase J 2: subtipos de rodilla (LCM grado I, LCA sin cirugía, LCA reconstruido) con sus fuentes', () => {
  const st = Object.fromEntries(subtipos.map(x => [x.id, x]));
  // Naqvi y Sherman 2023: LCM grado I, vuelta al juego en 10–14 días → «4–14 d»
  assert.deepEqual([st.rodilla_lcm_g1.desde, st.rodilla_lcm_g1.hasta, st.rodilla_lcm_g1.fuentes], [1, 1, ['Naqvi y Sherman 2023']]);
  // Evans 2023: sin cirugía, fase aguda + 12 semanas de fisioterapia → «3–4 s» a «2–3 m»
  assert.deepEqual([st.rodilla_lca_conservador.desde, st.rodilla_lca_conservador.hasta], [2, 4]);
  // Evans 2023: reconstruido, 6–12 meses de vuelta al deporte; injerto hasta 18 meses o más → «6m–1a» a «2a»
  assert.deepEqual([st.rodilla_lca_reconstruido.desde, st.rodilla_lca_reconstruido.hasta], [6, 7]);
  // Cuelgan de la fila que les toca: LCM de grado I, LCA sin cirugía de grado III, reconstruido del injerto
  const madre = id => filas.find(f => f.subtipos?.some(x => x.id === id)).id;
  assert.deepEqual(['rodilla_lcm_g1', 'rodilla_lca_conservador', 'rodilla_lca_reconstruido'].map(madre), ['ligamento_g1', 'ligamento_g3', 'injerto']);
  // Sin plazo en la fuente, no hay subtipo de LCM grado II ni III
  assert.ok(!subtipos.some(x => /lcm_g[23]/.test(x.id)));
});

test('tejidos, Fase J 3: grupo «Menisco» propio, con los plazos de Prill 2025 y Logerstedt 2018', () => {
  const g = T.grupos.find(x => x.id === 'menisco');
  assert.ok(g && g.filas.length, 'el grupo existe y no está vacío');
  // Va como grupo propio, entre ligamento y hueso; nada de menisco bajo ligamento
  assert.deepEqual(T.grupos.map(x => x.id), ['tendon', 'musculo', 'ligamento', 'menisco', 'hueso']);
  assert.ok(!T.grupos.find(x => x.id === 'ligamento').filas.flatMap(f => [f, ...(f.subtipos || [])]).some(f => /menisc/i.test(f.id)));
  const f = Object.fromEntries(g.filas.map(x => [x.id, x]));
  // Prill 2025: traumática, 12 semanas → «2–3 m»; degenerativa, 3–6 meses → «3–6 m»;
  // meniscectomía 4–12 semanas → «3–4 s» a «2–3 m»; sutura 6–9 meses → «6m–1a»
  assert.deepEqual([f.menisco_traumatica_conservador.desde, f.menisco_traumatica_conservador.hasta], [4, 4]);
  assert.deepEqual([f.menisco_degenerativa_conservador.desde, f.menisco_degenerativa_conservador.hasta], [5, 5]);
  assert.deepEqual([f.menisco_meniscectomia.desde, f.menisco_meniscectomia.hasta], [2, 4]);
  assert.deepEqual([f.menisco_sutura.desde, f.menisco_sutura.hasta], [6, 6]);
  for (const x of g.filas) assert.ok(x.fuentes.includes('Prill 2025') && !x.pendiente, x.id);
  // El filtro muestra solo el menisco
  const html = tiemposTejidoHTML(T, { filtro: 'menisco' });
  assert.equal((html.match(/class="tej-bloque"/g) || []).length, 1);
  assert.equal((html.match(/class="tej-barra /g) || []).length, g.filas.length);
});

test('tejidos, Fase J 4: subtipos de fractura por localización, con los plazos de sus capítulos de StatPearls', () => {
  const madre = filas.find(f => f.id === 'fractura');
  const st = Object.fromEntries(madre.subtipos.map(x => [x.id, x]));
  const rango = id => [st[id].desde, st[id].hasta];
  // 6–8 semanas → «5–8 s»: tobillo (Hermena y Slane 2025), Jones (Smidt y Massey 2023),
  // navicular por estrés (Gheewala 2023), rótula sin cirugía (Mabrouk y Pilson 2026)
  for (const id of ['fx_tobillo_estable', 'fx_tobillo_cirugia', 'fx_quinto_jones', 'fx_navicular_estres', 'fx_rotula_conservador']) assert.deepEqual(rango(id), [3, 3], id);
  // 3–6 y 4–6 semanas → «3–4 s» a «5–8 s»
  assert.deepEqual(rango('fx_quinto_avulsion'), [2, 3]);
  assert.deepEqual(rango('fx_metatarsianos'), [2, 3]);
  // Calcáneo: extraarticular 10–12 semanas → «2–3 m»; intraarticular 12–18 meses → «2a»
  assert.deepEqual(rango('fx_calcaneo_extra'), [4, 4]);
  assert.deepEqual(rango('fx_calcaneo_intra'), [7, 7]);
  // Meseta sin cirugía: 12 semanas a 16–20 → «2–3 m» a «3–6 m»; zona 3 hasta 20 semanas, igual
  assert.deepEqual(rango('fx_meseta_conservador'), [4, 5]);
  assert.deepEqual(rango('fx_quinto_estres'), [4, 5]);
  // Sin plazo en su capítulo, no se pintan: húmero proximal, rótula operada, navicular traumática
  assert.ok(!madre.subtipos.some(x => /humero|rotula_cirugia|navicular_trauma/.test(x.id)));
  for (const x of madre.subtipos) assert.ok(x.fuentes.length === 1 && x.nota, x.id);
});

test('tejidos, Fase J 5: fila «Fractura de estrés» con subtipos de bajo y alto riesgo (Hoenig 2023, Robertson y Wood 2017)', () => {
  const f = filas.find(x => x.id === 'fractura_estres');
  assert.ok(f && T.grupos.find(g => g.id === 'hueso').filas.includes(f), 'la fila está en hueso');
  const st = Object.fromEntries(f.subtipos.map(x => [x.id, x]));
  const col = id => [st[id].desde, st[id].hasta];
  // Hoenig 2023, días medios: 44 y 56 → «5–8 s»; 77–86 → «2–3 m»; 106–127 → «3–6 m»
  for (const id of ['estres_tibia_posteromedial', 'estres_perone']) assert.deepEqual(col(id), [3, 3], id);
  for (const id of ['estres_pubis', 'estres_metatarsianos', 'estres_femur_diafisis', 'estres_quinto']) assert.deepEqual(col(id), [4, 4], id);
  for (const id of ['estres_maleolo_medial', 'estres_cuello_femoral', 'estres_navicular']) assert.deepEqual(col(id), [5, 5], id);
  // Robertson y Wood 2017: tibia anterior, 7 meses → «6m–1a»
  assert.deepEqual(col('estres_tibia_anterior'), [6, 6]);
  // Alto riesgo (Robertson y Wood 2017) = grave; bajo riesgo hereda la gravedad de la fila
  for (const x of f.subtipos) assert.equal(x.gravedad === 'grave', /alto riesgo/.test(x.nombre), x.id);
  assert.ok(f.subtipos.every(x => x.desde >= f.desde && x.hasta <= f.hasta));
});

test('tejidos: toda fila y subtipo dice qué mide su barra (`mide`), y se pinta con su relleno o su marca', () => {
  const todas = filas.flatMap(f => [f, ...(f.subtipos || [])]);
  for (const x of todas) assert.ok(T.medidas[x.mide], `${x.id}: «mide» falta o no está en medidas`);
  for (const [k, m] of Object.entries(T.medidas)) assert.ok(['liso', 'rayado', 'contorno'].includes(m.relleno) && m.etiqueta, k);
  // Las que comparten relleno liso con la vuelta al deporte llevan marca, para no confundirse con ella
  for (const [k, m] of Object.entries(T.medidas)) if (k !== 'deporte' && m.relleno === 'liso') assert.ok(m.marca, `${k} sin marca`);
  // Clasificación revisada por el usuario (2026-10): las filas del wiki, sin especificar; la rotura de
  // tendón, biología; programas; protección (casi todas las fracturas por localización)
  const de = id => todas.find(x => x.id === id).mide;
  for (const id of ['tendinopatia', 'doms', 'musculo_g1', 'ligamento_g1', 'injerto', 'fractura']) assert.equal(de(id), 'sinEspecificar', id);
  assert.equal(de('tendon_rotura'), 'biologia');
  for (const id of ['rodilla_lca_conservador', 'menisco_traumatica_conservador', 'menisco_degenerativa_conservador']) assert.equal(de(id), 'programa', id);
  for (const id of ['fx_quinto_jones', 'fx_calcaneo_extra', 'fx_rotula_conservador', 'fx_meseta_cirugia']) assert.equal(de(id), 'proteccion', id);
  for (const id of ['tobillo_lateral_g1', 'menisco_sutura', 'fx_calcaneo_intra', 'estres_navicular']) assert.equal(de(id), 'deporte', id);
  const html = tiemposTejidoHTML(T);
  assert.equal((html.match(/class="tej-barra [^"]*tej-relleno-/g) || []).length, todas.length, 'cada barra con su relleno');
  assert.ok(/data-tejido="fx_quinto_jones"[^]*?tej-relleno-rayado/.test(html));
  assert.ok(html.includes('Qué mide la barra:'));
});

test('tejidos, Fase J 6: subtipos de Aquiles y manguito rotador bajo la rotura de tendón (Shamrock 2023, Thigpen 2016)', () => {
  const madre = filas.find(f => f.id === 'tendon_rotura');
  const st = Object.fromEntries((madre.subtipos || []).map(x => [x.id, x]));
  // Sin cirugía: bota hasta las 8–12 semanas → «5–8 s» a «2–3 m», protección
  assert.deepEqual([st.aquiles_conservador.desde, st.aquiles_conservador.hasta, st.aquiles_conservador.mide], [3, 4, 'proteccion']);
  // Reparado: impacto y vuelta al deporte desde los 6 meses → «6m–1a»
  assert.deepEqual([st.aquiles_cirugia.desde, st.aquiles_cirugia.hasta, st.aquiles_cirugia.mide], [6, 6, 'deporte']);
  for (const x of madre.subtipos.filter(x => x.id.startsWith('aquiles_'))) assert.deepEqual(x.fuentes, ['Shamrock 2023'], x.id);
  // Manguito rotador reparado (Thigpen 2016): protección hasta la 6.ª semana → «5–8 s»;
  // rehabilitación hasta las 20–26 semanas → «3–6 m», como programa
  assert.deepEqual([st.manguito_proteccion.desde, st.manguito_proteccion.hasta, st.manguito_proteccion.mide], [3, 3, 'proteccion']);
  assert.deepEqual([st.manguito_programa.desde, st.manguito_programa.hasta, st.manguito_programa.mide], [5, 5, 'programa']);
  for (const id of ['manguito_proteccion', 'manguito_programa']) assert.deepEqual(st[id].fuentes, ['Thigpen 2016'], id);
});

test('tejidos, Fase J 8: tendinopatías como duración del programa de carga, con la fuente de su pauta', () => {
  const madre = filas.find(f => f.id === 'tendinopatia');
  const st = Object.fromEntries(madre.subtipos.map(x => [x.id, x]));
  const de = id => [st[id].desde, st[id].hasta, st[id].fuentes[0]];
  // 12 semanas → «2–3 m»; 8 → «5–8 s»; 6–12 → 3–4; 6 semanas a 6 meses → 3–5
  assert.deepEqual(de('tendinopatia_rotuliana'), [4, 4, 'Ophey 2025']);
  assert.deepEqual(de('tendinopatia_aquilea_media'), [3, 5, 'Chimenti 2024']);
  assert.deepEqual(de('tendinopatia_aquilea_insercional'), [4, 4, 'Jonsson 2008']);
  assert.deepEqual(de('tendinopatia_isquios_proximal'), [4, 4, 'Rich 2025']);
  assert.deepEqual(de('tendinopatia_glutea'), [3, 3, 'Mellor 2018']);
  assert.deepEqual(de('epicondilalgia_lateral'), [3, 4, 'Lucado 2022']);
  assert.deepEqual(de('epicondilalgia_medial'), [4, 4, 'See 2026']);
  // No hay plazo de cicatrización: todas son duración del programa
  for (const x of madre.subtipos) assert.equal(x.mide, 'programa', x.id);
  // Lopes 2025 solo tiene leído el resumen: no se cita aquí
  assert.ok(!madre.subtipos.some(x => x.fuentes.includes('Lopes 2025')));
});

test('tejidos, Fase J 7: isquiotibiales por la clasificación BAMIC (Pollock 2016, Hollabaugh 2023, Macdonald 2019)', () => {
  const f = filas.find(x => x.id === 'isquios_bamic');
  assert.ok(f && T.grupos.find(g => g.id === 'musculo').filas.includes(f), 'la fila está en músculo');
  assert.ok(f.fuentes.includes('Pollock 2014'), 'Pollock 2014 define la escala');
  const st = Object.fromEntries(f.subtipos.map(x => [x.id, x]));
  const col = id => [st[id].desde, st[id].hasta];
  // Días medios hasta el entrenamiento completo, Pollock 2016 y Pollock 2022 (en Hollabaugh 2023):
  // 0 = 9–10 → «4–14d»; 1 = 12–18 → 1–2; 2a/2b = 19–25 → «3–4s»; 2c = 27–35 → 2–3; 3c = 51,5–84 → 3–4
  assert.deepEqual(col('isquios_g0'), [1, 1]);
  assert.deepEqual(col('isquios_g1'), [1, 2]);
  assert.deepEqual(col('isquios_g2ab'), [2, 2]);
  assert.deepEqual(col('isquios_g2c'), [2, 3]);
  assert.deepEqual(col('isquios_g3c'), [3, 4]);
  // Vuelta al entrenamiento completo: deporte; las «c» llevan la recurrencia de Pollock 2016
  for (const x of [f, ...f.subtipos]) assert.equal(x.mide, 'deporte', x.id);
  for (const id of ['isquios_g2c', 'isquios_g3c']) assert.ok(/Recayó/.test(st[id].nota), id);
  for (const x of f.subtipos) assert.ok(x.fuentes[0] === 'Pollock 2016' && x.nota, x.id);
  assert.equal(st.isquios_g3c.gravedad, 'grave');
  // Sin barra: 3a, 3b y grado 4 (sin lesiones o con una sola en las fuentes)
  assert.ok(!f.subtipos.some(x => /3a|3b|4/.test(x.nombre)));
  assert.ok(f.subtipos.every(x => x.desde >= f.desde && x.hasta <= f.hasta));
});
