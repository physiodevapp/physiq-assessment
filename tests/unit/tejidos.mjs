// Tiempos de recuperación de tejidos (panel ⏱ de la cabecera: data/tejidos.js,
// lib/tejidos.js, docs/tiempos-tejido.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, TIEMPOS_TEJIDO, HYPOTHESES } from './comun.mjs';
const { posicionDia, marcaHoy, tiemposTejidoHTML, gruposVisibles, rangoFase, buscarFila, infoBarraHTML, tieneBarra, fuentesTejidoHTML, filasPaciente, FILTRO_PACIENTE } = await import('../../lib/tejidos.js');
const { REFERENCIAS } = await import('../../data/referencias.js');

console.log('\ntiempos de tejido');

const T = TIEMPOS_TEJIDO;
const filas = T.grupos.flatMap(g => g.filas);
const subtipos = filas.flatMap(f => f.subtipos || []);
const n = T.columnas.length;
const conBarra = filas.filter(f => Number.isInteger(f.desde));

test('tejidos: columnas con `hasta` creciente; filas con rango dentro del eje y gravedad conocida', () => {
  T.columnas.forEach((c, i) => assert.ok(c.hasta > (i ? T.columnas[i - 1].hasta : 0), `columna ${c.etiqueta}`));
  for (const f of filas) {
    assert.ok(f.gravedad in T.gravedades, `gravedad de ${f.id}`);
    // Fila sin barra (sin `desde` ni `hasta`): solo como madre de subtipos, con una nota que lo explica
    if (!tieneBarra(f)) {
      assert.ok(f.desde === undefined && f.hasta === undefined && f.mide === undefined, `${f.id}: sin barra, pero con rango o medida`);
      assert.ok(f.subtipos?.length && /^Sin barra general: /.test(f.nota || ''), `${f.id}: sin barra necesita subtipos y la nota «Sin barra general: …»`);
      continue;
    }
    assert.ok(f.desde >= 0 && f.hasta < n && f.desde <= f.hasta, `rango de ${f.id}`);
  }
  assert.equal(new Set(filas.map(f => f.id)).size, filas.length, 'ids repetidos');
});

test('tejidos: toda fila tiene fuente del registro o va marcada `pendiente`; las fuentes existen en data/referencias.js', () => {
  for (const f of conBarra) {
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

test('tejidos: las cifras genéricas de la tabla del wiki (Snyder-Mackler 2012, nunca leída) ya no se pintan', () => {
  // Decisión del usuario (2026-10): las madres con subtipos quedan sin barra; las roturas
  // musculares de grado I–III, sin subtipos, se quitan y el grupo lo explica en su nota.
  for (const id of ['tendinopatia', 'ligamento_g1', 'ligamento_g2', 'ligamento_g3', 'injerto', 'fractura']) {
    assert.ok(!tieneBarra(filas.find(x => x.id === id)), id);
  }
  assert.ok(!filas.some(x => /^musculo_g/.test(x.id)), 'roturas musculares genéricas');
  assert.ok(/^Sin barra general por grados I–III/.test(T.grupos.find(g => g.id === 'musculo').nota));
  assert.ok(!JSON.stringify(T).includes('Snyder-Mackler'), 'ninguna cita a la tabla del wiki');
  assert.ok(!('sinEspecificar' in T.medidas), 'medida «sin especificar» sin barras que la usen');
  // DOMS: Wilke y Behringer 2021, máximo a los 1–3 días y varios días más → «1–3 d» a «4–14 d»
  const doms = filas.find(x => x.id === 'doms');
  assert.deepEqual([doms.desde, doms.hasta, doms.mide, doms.fuentes], [0, 1, 'evolucion', ['Wilke y Behringer 2021']]);
  // No es del wiki: de Wu 2017 (remodelación desde las 6–8 semanas, 1–2 años)
  const rotura = filas.find(x => x.id === 'tendon_rotura');
  assert.deepEqual([rotura.desde, rotura.hasta], [3, 7]);
  // Una fila sin barra se pinta con su nombre y su nota, sin botón ni línea «Hoy»
  const h = tiemposTejidoHTML(T, { posquirurgico: true, semanas: 6 });
  const fx = h.match(/<div class="tej-fila tej-sin-barra" data-tejido="fractura">.*?<\/div><\/div>/)[0];
  assert.ok(fx.includes('Sin barra general') && !fx.includes('tej-barra') && !fx.includes('tej-hoy'));
  assert.equal(infoBarraHTML(T, 'fractura'), '');
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
  assert.equal((sin.match(/class="tej-barra /g) || []).length, conBarra.length + subtipos.length);
  assert.ok(!sin.includes('class="tej-hoy"'));
  assert.ok(sin.includes('Con mecanismo Post-quirúrgico'));
  const pendientes = filas.filter(f => f.pendiente).length + (T.fases.some(f => !f.fuentes.length) ? 1 : 0);
  assert.equal((sin.match(/class="tej-pendiente"/g) || []).length, pendientes);
  // Sin mecanismo posquirúrgico, aunque haya semanas, no se marca nada
  assert.ok(!tiemposTejidoHTML(T, { semanas: 6 }).includes('class="tej-hoy"'));
  const posq = tiemposTejidoHTML(T, { posquirurgico: true, semanas: 6 });
  // una por fila (en el eje solo la etiqueta «Hoy»; la leyenda de fases no lleva línea)
  assert.equal((posq.match(/class="tej-hoy"/g) || []).length, conBarra.length + subtipos.length);
  assert.equal((posq.match(/class="tej-hoy-etq"/g) || []).length, 1);
  assert.ok(posq.includes('Hoy · 6 semanas tras la cirugía'));
  assert.ok(tiemposTejidoHTML(T, { posquirurgico: true }).includes('tarjeta «Cirugía»'));
  // Tira de fases en el eje fijo: una por fase, con su color
  assert.equal((sin.match(/class="tej-eje-fase tej-fase-/g) || []).length, T.fases.length);
  // Barras en su columna (grid-column de inicio y fin+1)
  const rot = posq.match(/data-tejido="tendon_rotura".*?grid-column:(\d+) \/ (\d+)/);
  assert.deepEqual([+rot[1], +rot[2]], [4, 9]);
});

test('tiempos de tejido: solo consulta — ni payload, ni resúmenes, ni informe con IA lo importan', () => {
  for (const f of ['lib/resumenes.js', 'lib/informe-narrativo.js', 'informe-ia.js', 'phase4.js', 'phase4b.js', 'lib/revision-informe.js', 'lib/reglas-informe.js']) {
    assert.ok(!/tejidos|TIEMPOS_TEJIDO/.test(leer(f)), `${f} no debe leer los tiempos de tejido`);
  }
  // En app.js solo lo usa el panel
  const app = leer('app.js');
  const usos = [...app.matchAll(/TIEMPOS_TEJIDO|tiemposTejidoHTML/g)].length;
  assert.equal(usos, 6, 'import de data.js, import de lib/tejidos.js, la llamada en abrirTiemposTejido(), la tarjeta de una barra y las filas del paciente');
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
  const nLig = T.grupos.find(g => g.id === 'ligamento').filas.reduce((n, f) => n + (tieneBarra(f) ? 1 : 0) + (f.subtipos?.length || 0), 0);
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
  // Cuelgan de la fila de su grado (las madres ya no tienen barra: la tabla del wiki no se pudo leer)
  const madre = id => filas.find(f => f.subtipos?.some(x => x.id === id)).id;
  assert.deepEqual(['tobillo_lateral_g1', 'tobillo_lateral_g2', 'tobillo_lateral_g3', 'tobillo_lateral_cirugia'].map(madre), ['ligamento_g1', 'ligamento_g2', 'ligamento_g3', 'ligamento_g3']);
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
  assert.deepEqual(T.grupos.map(x => x.id), ['tendon', 'musculo', 'ligamento', 'menisco', 'articulacion', 'columna', 'hueso', 'nervio']);
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
  for (const x of madre.subtipos) assert.ok(x.fuentes.length >= 1 && x.nota, x.id);
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
  const todas = filas.flatMap(f => [f, ...(f.subtipos || [])]).filter(tieneBarra);
  for (const x of todas) assert.ok(T.medidas[x.mide], `${x.id}: «mide» falta o no está en medidas`);
  for (const [k, m] of Object.entries(T.medidas)) assert.ok(['liso', 'rayado', 'contorno', 'punteado', 'degradado'].includes(m.relleno) && m.etiqueta, k);
  // Toda medida de la leyenda la usa alguna barra
  for (const k of Object.keys(T.medidas)) assert.ok(todas.some(x => x.mide === k), `medida «${k}» sin barras`);
  // Cada medida con su propio relleno: la barra misma dice qué mide (antes «biología» y «sin
  // especificar» compartían el liso con una etiqueta, y no se entendía; usuario, 2026-10)
  const rellenos = Object.values(T.medidas).map(m => m.relleno);
  assert.equal(new Set(rellenos).size, rellenos.length, 'rellenos repetidos');
  assert.equal(T.medidas.biologia.relleno, 'punteado');
  // Clasificación revisada por el usuario (2026-10): la rotura de tendón, biología; programas;
  // protección (casi todas las fracturas por localización); el DOMS, evolución natural
  const de = id => todas.find(x => x.id === id).mide;
  assert.equal(de('doms'), 'evolucion');
  assert.equal(de('tendon_rotura'), 'biologia');
  for (const id of ['rodilla_lca_conservador', 'menisco_traumatica_conservador', 'menisco_degenerativa_conservador']) assert.equal(de(id), 'programa', id);
  for (const id of ['fx_quinto_jones', 'fx_calcaneo_extra', 'fx_rotula_conservador', 'fx_meseta_cirugia']) assert.equal(de(id), 'proteccion', id);
  for (const id of ['tobillo_lateral_g1', 'menisco_sutura', 'fx_calcaneo_intra', 'estres_navicular']) assert.equal(de(id), 'deporte', id);
  const html = tiemposTejidoHTML(T);
  assert.equal((html.match(/class="tej-barra [^"]*tej-relleno-/g) || []).length, todas.length, 'cada barra con su relleno');
  assert.ok(/data-tejido="fx_quinto_jones"[^]*?tej-relleno-rayado/.test(html));
  assert.ok(html.includes('Relleno = qué mide la barra') && html.includes('Color = gravedad:'));
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

test('tejidos, Fase J 9: nervio periférico, neuropraxia con barra y axonotmesis como nota del grupo (1 mm/día)', () => {
  const g = T.grupos.find(x => x.id === 'nervio');
  assert.ok(g && g.tejido === 'Nervio periférico');
  // Neuropraxia: de días (deportistas, < 1 semana) a 3 meses → «1–3d» a «2–3m»
  const f = g.filas.find(x => x.id === 'nervio_neurapraxia');
  assert.deepEqual([f.desde, f.hasta, f.mide, f.gravedad], [0, 4, 'deporte', 'leve']);
  assert.ok(f.fuentes.includes('Sharma y Munakomi 2026'));
  // Axonotmesis: sin barra (depende de la distancia), solo la nota del grupo
  assert.equal(g.filas.length, 1);
  assert.ok(!g.filas.some(x => /axonotmesis/i.test(x.nombre)));
  assert.ok(/Axonotmesis/.test(g.nota) && /1 mm al día/.test(g.nota) && /3 meses/.test(g.nota) && /Neurotmesis/.test(g.nota));
  assert.ok(g.notaFuentes.length && g.notaFuentes.every(k => REFERENCIAS[k]), 'notaFuentes en el registro');
  const html = tiemposTejidoHTML(T, { filtro: 'nervio' });
  assert.ok(html.includes('class="tej-grupo-nota"') && html.includes('sin barra'));
  assert.equal((html.match(/class="tej-barra /g) || []).length, 1);
  // Grupos sin nota no pintan el párrafo
  assert.ok(!tiemposTejidoHTML(T, { filtro: 'hueso' }).includes('tej-grupo-nota'));
});

test('tejidos: fracturas de miembro superior (5.º metacarpiano, diáfisis de radio y cúbito, radio distal) con su fuente', () => {
  const st = Object.fromEntries(filas.find(f => f.id === 'fractura').subtipos.map(x => [x.id, x]));
  // Malik 2024: consolidación a las 4–6 semanas → «3–4s» a «5–8s»
  assert.deepEqual([st.fx_quinto_metacarpiano.desde, st.fx_quinto_metacarpiano.hasta, st.fx_quinto_metacarpiano.mide], [2, 3, 'proteccion']);
  assert.deepEqual(st.fx_quinto_metacarpiano.fuentes, ['Malik 2024']);
  // Small 2022: consolidación tras la cirugía hacia los 2–3 meses → «2–3m»
  assert.deepEqual([st.fx_antebrazo_cirugia.desde, st.fx_antebrazo_cirugia.hasta, st.fx_antebrazo_cirugia.mide], [4, 4, 'proteccion']);
  assert.deepEqual(st.fx_antebrazo_cirugia.fuentes, ['Small 2022']);
  // Mehta 2024 + Sayudo 2024: yeso 4–6 semanas (3–4 sin peor función) → «3–4s» a «5–8s»
  assert.deepEqual([st.fx_radio_distal_yeso.desde, st.fx_radio_distal_yeso.hasta, st.fx_radio_distal_yeso.mide], [2, 3, 'proteccion']);
  assert.deepEqual(st.fx_radio_distal_yeso.fuentes, ['Mehta 2024', 'Sayudo 2024']);
  // Mehta 2024: protección de días a semanas; fuerza desde las 6 semanas como tarde → «4–14d» a «5–8s»
  assert.deepEqual([st.fx_radio_distal_cirugia.desde, st.fx_radio_distal_cirugia.hasta, st.fx_radio_distal_cirugia.mide], [1, 3, 'proteccion']);
  assert.deepEqual(st.fx_radio_distal_cirugia.fuentes, ['Mehta 2024']);
});

test('tejidos: grupo «Articulación» — luxación anterior de hombro (protección) y capsulitis adhesiva (evolución natural)', () => {
  const g = T.grupos.find(x => x.id === 'articulacion');
  const f = Object.fromEntries(g.filas.map(x => [x.id, x]));
  // Pak 2023: cabestrillo de 1 a 6 semanas → «4–14d» a «5–8s»
  assert.deepEqual([f.hombro_luxacion_anterior.desde, f.hombro_luxacion_anterior.hasta, f.hombro_luxacion_anterior.mide], [1, 3, 'proteccion']);
  // Li 2025: de unos meses a 2–3 años → «2–3m» a «2a», evolución natural
  assert.deepEqual([f.capsulitis_adhesiva.desde, f.capsulitis_adhesiva.hasta, f.capsulitis_adhesiva.mide], [4, 7, 'evolucion']);
  assert.equal(T.medidas.evolucion.relleno, 'degradado');
});

test('tejidos: prótesis de rodilla y de cadera en «Articulación», como vuelta al deporte (Magan 2021, Jette 2020, Telang 2024, Pan 2024)', () => {
  const f = Object.fromEntries(T.grupos.find(x => x.id === 'articulacion').filas.map(x => [x.id, x]));
  // Magan 2021: 70 % a los 6 meses, 84 % al año → «3–6m» a «6m–1a»
  assert.deepEqual([f.protesis_rodilla.desde, f.protesis_rodilla.hasta, f.protesis_rodilla.mide], [5, 6, 'deporte']);
  assert.deepEqual(f.protesis_rodilla.fuentes, ['Magan 2021', 'Jette 2020']);
  // Telang 2024: la mitad en 3 meses, la mayoría en 6 → «2–3m» a «3–6m»
  assert.deepEqual([f.protesis_cadera.desde, f.protesis_cadera.hasta, f.protesis_cadera.mide], [4, 5, 'deporte']);
  assert.deepEqual(f.protesis_cadera.fuentes, ['Telang 2024', 'Pan 2024']);
});

test('tejidos: grupo «Columna» — lumbalgia aguda y radiculopatías lumbar y cervical, como evolución natural', () => {
  const f = Object.fromEntries(T.grupos.find(x => x.id === 'columna').filas.map(x => [x.id, x]));
  for (const id of ['lumbalgia_aguda', 'radiculopatia_lumbar', 'radiculopatia_cervical']) assert.equal(f[id].mide, 'evolucion', id);
  // Alexander 2024: la mitad en 1–2 semanas, el 90 % en 6–12 → «1–3d» a «2–3m»
  assert.deepEqual([f.lumbalgia_aguda.desde, f.lumbalgia_aguda.hasta], [0, 4]);
  // Davis 2024: la mayoría en 4–6 semanas; Konstantinou 2018: 55 % mejora al año → «3–4s» a «6m–1a»
  assert.deepEqual([f.radiculopatia_lumbar.desde, f.radiculopatia_lumbar.hasta], [2, 6]);
  // Margetis y Magnus 2025: > 85 % en 8–12 semanas; Wong 2014: completa a los 24–36 meses → «5–8s» a «2a»
  assert.deepEqual([f.radiculopatia_cervical.desde, f.radiculopatia_cervical.hasta], [3, 7]);
  assert.deepEqual(f.radiculopatia_cervical.fuentes, ['Margetis y Magnus 2025', 'Wong 2014']);
});

test('tejidos: codo (luxación posterior, cabeza de radio) y sindesmosis, con sus fuentes', () => {
  const art = Object.fromEntries(T.grupos.find(x => x.id === 'articulacion').filas.map(x => [x.id, x]));
  // Waymack y An 2023: férula 5–10 días, inestables hasta 3 semanas → «4–14d» a «3–4s»
  assert.deepEqual([art.codo_luxacion_posterior.desde, art.codo_luxacion_posterior.hasta, art.codo_luxacion_posterior.mide], [1, 2, 'proteccion']);
  const fx = Object.fromEntries(T.grupos.find(x => x.id === 'hueso').filas.find(f => f.id === 'fractura').subtipos.map(x => [x.id, x]));
  // Patiño y Saenz 2023: yeso o cabestrillo 2–3 semanas → «4–14d» a «3–4s»
  assert.deepEqual([fx.fx_cabeza_radio.desde, fx.fx_cabeza_radio.hasta, fx.fx_cabeza_radio.mide], [1, 2, 'proteccion']);
  const sin = T.grupos.find(x => x.id === 'ligamento').filas.find(f => f.id === 'sindesmosis');
  const st = Object.fromEntries(sin.subtipos.map(x => [x.id, x]));
  // Salameh 2022: 39 días sin cirugía → «5–8s»; 71 con cirugía → «2–3m»
  assert.deepEqual([st.sindesmosis_conservador.desde, st.sindesmosis_conservador.hasta], [3, 3]);
  assert.deepEqual([st.sindesmosis_cirugia.desde, st.sindesmosis_cirugia.hasta], [4, 4]);
  assert.deepEqual(sin.fuentes, ['Salameh 2022', 'Li y Sun 2026']);
});

test('tejidos: columna operada (artrodesis lumbar y cervical, prótesis de disco cervical) y fractura vertebral por compresión', () => {
  const f = Object.fromEntries(T.grupos.find(x => x.id === 'columna').filas.map(x => [x.id, x]));
  // Wang 2017: de 7 semanas a 11 meses → «5–8s» a «6m–1a»
  assert.deepEqual([f.artrodesis_lumbar.desde, f.artrodesis_lumbar.hasta, f.artrodesis_lumbar.mide], [3, 6, 'deporte']);
  // Health Quality Ontario 2019: trabajo a los 48 días con prótesis y 61 con artrodesis; Tumialán
  // 2010: servicio militar sin restricciones a las 10,3 y 16,5 semanas → «5–8s» a «2–3m» y «2–3m» a «3–6m»
  assert.deepEqual([f.protesis_disco_cervical.desde, f.protesis_disco_cervical.hasta], [3, 4]);
  assert.deepEqual([f.artrodesis_cervical.desde, f.artrodesis_cervical.hasta], [4, 5]);
  // Gornet 2011: 75 días; Tumialán 2010: 22,6 semanas → «2–3m» a «3–6m»
  assert.deepEqual([f.protesis_disco_lumbar.desde, f.protesis_disco_lumbar.hasta, f.protesis_disco_lumbar.mide], [4, 5, 'deporte']);
  const fx = Object.fromEntries(T.grupos.find(x => x.id === 'hueso').filas.find(r => r.id === 'fractura').subtipos.map(x => [x.id, x]));
  // Donnally 2025: corsé 4–12 semanas → «3–4s» a «2–3m»
  assert.deepEqual([fx.fx_vertebral_compresion.desde, fx.fx_vertebral_compresion.hasta, fx.fx_vertebral_compresion.mide], [2, 4, 'proteccion']);
});

test('tejidos: gemelo y sóleo por grado (Prakash 2018), recto femoral (Knapik 2023) y aductores (Forsythe 2025)', () => {
  const m = Object.fromEntries(T.grupos.find(x => x.id === 'musculo').filas.map(x => [x.id, x]));
  const g = Object.fromEntries(m.gemelo_soleo.subtipos.map(x => [x.id, x]));
  // 8, 17, 25 y 48 días → «4–14d», «3–4s», «3–4s», «5–8s»
  assert.deepEqual(['gemelo_g0', 'gemelo_g1', 'gemelo_g2', 'gemelo_g3'].map(id => g[id].desde), [1, 2, 2, 3]);
  const r = Object.fromEntries(m.recto_femoral_proximal.subtipos.map(x => [x.id, x]));
  // 11,7 semanas → «2–3m»; 22,1 → «3–6m»
  assert.deepEqual([r.recto_femoral_conservador.desde, r.recto_femoral_cirugia.desde], [4, 5]);
  // 14–20 días → «4–14d» a «3–4s»
  assert.deepEqual([m.aductores.desde, m.aductores.hasta, m.aductores.mide], [1, 2, 'deporte']);
});

test('tejidos: cada barra es un botón que abre su tarjeta (gravedad, qué mide, plazo), también la de un subtipo', () => {
  const h = tiemposTejidoHTML(T);
  const ids = [...h.matchAll(/<button type="button" class="tej-barra[^"]*" data-mide="[^"]*" data-barra="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, conBarra.length + subtipos.length);
  // Ni `title` (el tooltip del navegador taparía la tarjeta) ni role="img"
  assert.ok(!/class="tej-barra[^>]*(title=|role="img")/.test(h));
  for (const id of ids) assert.ok(infoBarraHTML(T, id).includes('tej-info-nombre'), id);
  assert.equal(infoBarraHTML(T, 'no_existe'), '');
  // Fila madre: sin línea de madre; gravedad, medida y plazo con las etiquetas de los datos
  const f = filas.find(x => x.subtipos?.length && x.mide === 'deporte' && x.desde !== x.hasta);
  const hf = infoBarraHTML(T, f.id);
  assert.ok(!hf.includes('tej-info-madre'));
  assert.ok(hf.includes(`tej-ley-muestra tej-${f.gravedad}"`) && hf.includes(`>${T.gravedades[f.gravedad]}<`));
  assert.ok(hf.includes(`tej-relleno-liso" aria-hidden="true"></span>${T.medidas.deporte.etiqueta}`));
  assert.ok(hf.includes(`De ${T.columnas[f.desde].etiqueta} a ${T.columnas[f.hasta].etiqueta}`));
  // Subtipo sin gravedad propia: la de su fila madre, y el nombre de la madre encima
  const datos = structuredClone(T);
  const g2 = datos.grupos.find(g => g.id === 'ligamento').filas.find(x => x.id === 'ligamento_g2');
  g2.subtipos = [{ id: 'x_sub', mide: 'proteccion', nombre: 'Prueba', desde: 2, hasta: 2, fuentes: [] }];
  assert.deepEqual([buscarFila(datos, 'x_sub').gravedad, buscarFila(datos, 'x_sub').madre.id], [g2.gravedad, 'ligamento_g2']);
  const hs = infoBarraHTML(datos, 'x_sub');
  assert.ok(hs.includes(`<div class="tej-info-madre">${g2.nombre}</div>`));
  assert.ok(hs.includes(`tej-ley-muestra tej-${g2.gravedad} tej-relleno-rayado"`));
  assert.ok(hs.includes(`>${T.columnas[2].etiqueta}</dd>`.replace(/^>./, c => c.toUpperCase())));
});

test('tejidos: la tarjeta de cada barra lista sus fuentes, enlazadas a la url o el DOI del registro; la nota de grupo, plegadas', () => {
  const todas = [...filas, ...subtipos].filter(tieneBarra);
  for (const f of todas) {
    const h = infoBarraHTML(T, f.id, REFERENCIAS);
    // Sin registro: la misma lista, sin enlaces (el registro llega con import())
    const sinRef = infoBarraHTML(T, f.id);
    assert.equal(h.includes('tej-info-fuentes'), f.fuentes.length > 0, f.id);
    assert.ok(!sinRef.includes('<a '), f.id);
    for (const k of f.fuentes) {
      const r = REFERENCIAS[k];
      const url = r.url || (r.doi ? `https://doi.org/${r.doi}` : null);
      assert.ok(url, `${f.id}: ${k} sin url ni DOI en el registro`);
      assert.ok(h.includes(`href="${url.replace(/&/g, '&amp;')}" target="_blank" rel="noopener noreferrer"`), `${f.id}: ${k}`);
      assert.ok(sinRef.includes(`<li>${k}</li>`), `${f.id}: ${k} sin registro`);
    }
  }
  assert.equal(fuentesTejidoHTML(['No existe 1900'], REFERENCIAS), '<li>No existe 1900</li>');
  // Nota de grupo con fuentes (nervio periférico): plegadas bajo la nota, con sus claves para enlazarlas después
  const g = T.grupos.find(x => x.notaFuentes?.length);
  const h = tiemposTejidoHTML(T, { filtro: g.id, REF: REFERENCIAS });
  assert.ok(h.includes(`<details class="tej-grupo-fuentes"><summary>Fuentes (${g.notaFuentes.length})</summary>`));
  assert.ok(h.includes(`data-claves="${g.notaFuentes.join('|')}"`));
  assert.equal((h.match(/tej-grupo-fuentes[\s\S]*?<\/details>/)[0].match(/class="tej-fuente-enlace"/g) || []).length, g.notaFuentes.length);
  assert.ok(!tiemposTejidoHTML(T, { filtro: g.id }).match(/tej-grupo-fuentes[\s\S]*?<\/details>/)[0].includes('<a '));
});

test('tejidos: porHipotesis — cada hipótesis existe y cada fila o subtipo también; «paciente» no es un grupo', () => {
  const html = leer('index.html');
  assert.ok(!T.grupos.some(g => g.id === FILTRO_PACIENTE));
  for (const [h, entradas] of Object.entries(T.porHipotesis)) {
    assert.ok(HYPOTHESES[h], `${h} no es una hipótesis`);
    assert.ok(entradas.length, `${h} sin filas`);
    for (const e of entradas) {
      const id = typeof e === 'string' ? e : e.id;
      assert.ok(buscarFila(T, id), `${h}: ${id} no es una fila ni un subtipo`);
      if (typeof e === 'string') continue;
      assert.deepEqual(Object.keys(e).filter(k => !['id', 'posq', 'mecanismo', 'cronologia', 'soloFila'].includes(k)), [], `${h}: ${id} claves`);
      if ('posq' in e) assert.equal(typeof e.posq, 'boolean', `${h}: ${id} posq`);
      // mecanismo y cronología: el texto exacto de un botón de la fase 1
      if ('mecanismo' in e) assert.ok(html.includes(`selectOption('mecanismo', this, '${e.mecanismo}')`), `${h}: mecanismo ${e.mecanismo}`);
      if ('cronologia' in e) assert.ok(html.includes(`selectOption('cronologia', this, '${e.cronologia}')`), `${h}: cronología ${e.cronologia}`);
      if ('soloFila' in e) assert.ok(e.soloFila === true && buscarFila(T, id).fila.subtipos?.length, `${h}: soloFila en una fila con subtipos`);
    }
  }
});

test('filasPaciente: según las hipótesis activas y el mecanismo; sin repetir; sin filas, vacío', () => {
  assert.deepEqual(filasPaciente(T, []), { ids: [], hipotesis: [], sinFilas: [], condiciones: [], soloFila: [] });
  assert.deepEqual(filasPaciente(T, ['h2']), { ids: [], hipotesis: [], sinFilas: ['h2'], condiciones: [], soloFila: [] }, 'pinzamiento subacromial: sin fila');
  // Por condición de una tarjeta (docs/osteoporosis.md, decisión 10): la fractura vertebral
  assert.deepEqual(filasPaciente(T, ['h2'], { condiciones: ['fracturaVertebral'] }),
    { ids: ['fx_vertebral_compresion'], hipotesis: [], sinFilas: ['h2'], condiciones: ['fracturaVertebral'], soloFila: [] });
  assert.deepEqual(filasPaciente(T, [], { condiciones: ['desconocida'] }).ids, []);
  assert.deepEqual(filasPaciente(T, ['ro4']).ids, ['rodilla_lca_conservador']);
  assert.deepEqual(filasPaciente(T, ['ro4'], { posquirurgico: true }).ids, ['rodilla_lca_reconstruido']);
  assert.deepEqual(filasPaciente(T, ['h3']).ids, [], 'manguito: solo reparado');
  const r = filasPaciente(T, ['lu3', 'lu1', 'lu5']);
  assert.deepEqual(r, { ids: ['radiculopatia_lumbar'], hipotesis: ['lu3', 'lu5'], sinFilas: ['lu1'], condiciones: [], soloFila: [] });
  // Lumbalgia inespecífica solo aguda; la luxación anterior solo traumática
  const agudo = filasPaciente(T, ['lu1', 'lu7'], { cronologia: 'Agudo (<6 semanas)' });
  assert.deepEqual([agudo.ids, agudo.hipotesis], [['lumbalgia_aguda'], ['lu1', 'lu7']]);
  assert.deepEqual(filasPaciente(T, ['lu1'], { cronologia: 'Crónico (>3 meses)' }).ids, []);
  assert.deepEqual(filasPaciente(T, ['h4'], { mecanismo: 'Traumático' }).ids, ['hombro_luxacion_anterior']);
  assert.deepEqual(filasPaciente(T, ['h4'], { mecanismo: 'Insidioso' }).ids, []);
  // co7: la fila de rotura de tendón sin sus subtipos
  assert.deepEqual(filasPaciente(T, ['co7']).soloFila, ['tendon_rotura']);
});

test('tiemposTejidoHTML: «Este paciente» solo con filas, primera pastilla, solo sus filas con los subtipos desplegados', () => {
  assert.ok(!tiemposTejidoHTML(T, { filtro: FILTRO_PACIENTE }).includes('Este paciente'), 'sin paciente no hay pastilla');
  const paciente = { ids: filasPaciente(T, ['tp1', 'tp8']).ids, nombres: ['Esguince', 'Aquiles'] };
  const todos = tiemposTejidoHTML(T, { paciente });
  assert.ok(/class="tej-filtro" [^>]*>\s*<button type="button" class="tej-filtro-btn tej-filtro-paciente" data-grupo="paciente" data-filtro-tejido="paciente"/.test(todos));
  assert.ok(!todos.includes('class="tej-paciente"'));
  const h = tiemposTejidoHTML(T, { paciente, filtro: FILTRO_PACIENTE });
  assert.ok(h.includes('tej-filtro-paciente activo" data-grupo="paciente" data-filtro-tejido="todos" aria-pressed="true"'));
  const barras = [...h.matchAll(/data-barra="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(barras.sort(), ['tendinopatia_aquilea_media', 'tobillo_lateral_g1', 'tobillo_lateral_g2', 'tobillo_lateral_g3'].sort());
  assert.ok(h.includes('<details class="tej-subtipos" open>'));
  assert.ok(h.includes('Según las hipótesis activas: Esguince · Aquiles.'));
  assert.deepEqual([...h.matchAll(/class="tej-bloque" data-grupo="([^"]+)"/g)].map(m => m[1]), ['tendon', 'ligamento']);
});

test('tiemposTejidoHTML: fila sin subtipos (soloFila) y aviso de las hipótesis sin plazo propio', () => {
  const r = filasPaciente(T, ['co7', 'h2']);
  const h = tiemposTejidoHTML(T, { paciente: { ...r, nombres: ['Bíceps'], sinPlazo: ['Subacromial'] }, filtro: FILTRO_PACIENTE });
  assert.deepEqual([...h.matchAll(/data-barra="([^"]+)"/g)].map(m => m[1]), ['tendon_rotura']);
  assert.ok(!h.includes('tej-subtipos'));
  assert.ok(h.includes('Según la hipótesis activa: Bíceps. Sin plazo propio en este panel: Subacromial.'));
  // Ninguna con fila: sin pastilla, todo el panel y una línea que lo dice
  const sin = tiemposTejidoHTML(T, { paciente: { ids: [], soloFila: [], nombres: [], sinPlazo: ['Subacromial', 'SLAP'] }, filtro: FILTRO_PACIENTE });
  assert.ok(!sin.includes('tej-filtro-paciente'));
  assert.ok(sin.includes('<p class="tej-paciente">Las hipótesis activas no tienen plazo propio en este panel: Subacromial · SLAP.</p>'));
  assert.ok(!tiemposTejidoHTML(T).includes('class="tej-paciente"'));
});
