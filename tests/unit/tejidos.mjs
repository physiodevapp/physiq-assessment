// Tiempos de recuperación de tejidos (panel ⏱ de la cabecera: data/tejidos.js,
// lib/tejidos.js, docs/tiempos-tejido.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, TIEMPOS_TEJIDO } from './comun.mjs';
const { posicionDia, marcaHoy, tiemposTejidoHTML } = await import('../../lib/tejidos.js');
const { REFERENCIAS } = await import('../../data/referencias.js');

console.log('\ntiempos de tejido');

const T = TIEMPOS_TEJIDO;
const filas = T.grupos.flatMap(g => g.filas);
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
  assert.equal((sin.match(/class="tej-barra /g) || []).length, filas.length);
  assert.ok(!sin.includes('class="tej-hoy"'));
  assert.ok(sin.includes('Con mecanismo Post-quirúrgico'));
  const pendientes = filas.filter(f => f.pendiente).length + (T.fases.some(f => !f.fuentes.length) ? 1 : 0);
  assert.equal((sin.match(/class="tej-pendiente"/g) || []).length, pendientes);
  // Sin mecanismo posquirúrgico, aunque haya semanas, no se marca nada
  assert.ok(!tiemposTejidoHTML(T, { semanas: 6 }).includes('class="tej-hoy"'));
  const posq = tiemposTejidoHTML(T, { posquirurgico: true, semanas: 6 });
  // franja de fases + una por fila (en el eje solo la etiqueta «Hoy»)
  assert.equal((posq.match(/class="tej-hoy"/g) || []).length, filas.length + 1);
  assert.equal((posq.match(/class="tej-hoy-etq"/g) || []).length, 1);
  assert.ok(posq.includes('Hoy · 6 semanas tras la cirugía'));
  assert.ok(tiemposTejidoHTML(T, { posquirurgico: true }).includes('tarjeta «Cirugía»'));
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
