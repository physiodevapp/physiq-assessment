// Calculadora de cuestionarios (📋 de la cabecera: data/cuestionarios.js,
// lib/cuestionarios.js, docs/cuestionarios.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, withState, buildPhysiQPayload, buildContextSummaryText, buildInformeFisioterapiaText, state } from './comun.mjs';
const { CUESTIONARIOS, GRUPOS_CUESTIONARIO } = await import('../../data.js');
const L = await import('../../lib/cuestionarios.js');
const IN = await import('../../lib/informe-narrativo.js');

console.log('\ncuestionarios');

const def = id => CUESTIONARIOS.find(d => d.id === id);
// Todos los ítems con el mismo valor
const todos = (id, v) => Object.fromEntries(def(id).items.map(it => [it.n, v]));

test('cuestionarios: ids únicos, grupo conocido, ítems numerados sin repetir, fuente y tipos válidos', () => {
  assert.equal(new Set(CUESTIONARIOS.map(d => d.id)).size, CUESTIONARIOS.length);
  const grupos = new Set(GRUPOS_CUESTIONARIO.map(g => g.id));
  for (const d of CUESTIONARIOS) {
    assert.ok(grupos.has(d.grupo), `${d.id}: grupo`);
    assert.ok(d.fuente && d.nombre && d.titulo, `${d.id}: nombre, título y fuente`);
    // Requisito del usuario: solo cuestionarios con validación española publicada
    assert.ok(/\b(19|20)\d\d\b/.test(d.validacionEs || ''), `${d.id}: sin validación española (validacionEs)`);
    assert.equal(new Set(d.items.map(it => it.n)).size, d.items.length, `${d.id}: ítems repetidos`);
    for (const it of d.items) {
      assert.ok(['escala', 'opciones', 'sino', 'marcas'].includes(it.tipo || 'escala'), `${d.id} ${it.n}: tipo`);
      assert.ok(it.t, `${d.id} ${it.n}: etiqueta`);
      if (it.tipo === 'opciones' || it.tipo === 'marcas') assert.ok(it.opciones?.length, `${d.id} ${it.n}: opciones`);
    }
    for (const s of d.subescalas || []) for (const n of s.items) assert.ok(d.items.some(it => it.n === n), `${d.id}: subescala ${s.id} con ítem ${n} inexistente`);
    for (const a of d.alertas || []) assert.ok(d.items.some(it => it.n === a.item), `${d.id}: alerta de un ítem inexistente`);
    // Sin interpretación publicada, la app lo dice en vez de inventarla
    assert.ok(d.interpretacion?.length || d.sinInterpretacion, `${d.id}: ni interpretación ni sinInterpretacion`);
  }
});

test('cuestionarios: las bandas de interpretación cubren todo el rango del total, sin huecos', () => {
  for (const d of CUESTIONARIOS) {
    const reglas = (d.interpretacion || []).filter(r => !r.si || (r.si.de || 'total') === 'total');
    if (!reglas.length || d.total === 'media') continue;
    const [min, max] = L.rangoPuntuacion(d, d.items.map(it => it.n));
    // Puntuaciones enteras: cada valor del rango cae en alguna regla
    for (let x = Math.ceil(min); x <= max; x++) {
      assert.ok(reglas.some(r => !r.si || ((r.si.min == null || x >= r.si.min) && (r.si.max == null || x <= r.si.max))), `${d.id}: ${x} sin interpretación`);
    }
  }
});

test('cuestionarios: el rango declarado coincide con el de los ítems', () => {
  for (const d of CUESTIONARIOS.filter(x => x.rango)) {
    const [min, max] = L.rangoPuntuacion(d, d.items.map(it => it.n));
    assert.equal(max, d.rango[1], `${d.id}: máximo`);
    assert.ok(d.rango[0] <= min, `${d.id}: mínimo`);
  }
});

test('PHQ-9: suma, bandas de Kroenke 2001 y alerta del ítem 9 aunque falten ítems', () => {
  const p = L.puntuar(def('phq9'), { 1: 2, 2: 2, 3: 1, 4: 2, 5: 1, 6: 1, 7: 1, 8: 1, 9: 0 });
  assert.equal(p.total, 11);
  assert.equal(p.interpretacion.etiqueta, 'Síntomas depresivos moderados');
  assert.deepEqual(p.alertas, []);
  for (const [t, et] of [[0, 'mínimos'], [4, 'mínimos'], [5, 'leves'], [9, 'leves'], [10, 'moderados'], [15, 'moderadamente graves'], [20, 'graves'], [27, 'graves']]) {
    const r = {}; let resto = t;
    def('phq9').items.forEach(it => { const v = Math.min(3, resto); r[it.n] = v; resto -= v; });
    assert.match(L.puntuar(def('phq9'), r).interpretacion.etiqueta, new RegExp(`${et}$`), `PHQ-9 = ${t}`);
  }
  const solo9 = L.puntuar(def('phq9'), { 9: 1 });
  assert.equal(solo9.completo, false);
  assert.equal(solo9.total, null);
  assert.equal(solo9.interpretacion, null);
  assert.equal(solo9.alertas.length, 1);
});

test('PHQ-2 y GAD-7: puntos de corte', () => {
  assert.equal(L.puntuar(def('phq2'), { 1: 1, 2: 2 }).interpretacion.etiqueta, 'Cribado positivo: completar el PHQ-9');
  assert.equal(L.puntuar(def('phq2'), { 1: 1, 2: 1 }).interpretacion.etiqueta, 'Cribado negativo');
  assert.equal(L.puntuar(def('gad7'), todos('gad7', 1)).interpretacion.etiqueta, 'Ansiedad leve');      // 7
  assert.equal(L.puntuar(def('gad7'), todos('gad7', 2)).interpretacion.etiqueta, 'Ansiedad moderada'); // 14
  assert.equal(L.puntuar(def('gad7'), todos('gad7', 3)).interpretacion.etiqueta, 'Ansiedad grave');    // 21
});

test('Örebro: zonas × 2 (máx. 10), categorías 1–10, ítems invertidos 10 − x y total sobre 210', () => {
  const r = { 5: [0, 1, 2, 3, 4, 5, 6], 6: 0, 7: 0 };
  for (let n = 8; n <= 25; n++) r[n] = 0;
  const d = def('orebro');
  // 7 zonas → 10 (tope); categorías 1 + 1; invertidos (12, 16, 17, 21–25) a 0 → 10 cada uno
  const invertidos = d.items.filter(it => it.invertir).map(it => it.n);
  assert.deepEqual(invertidos, [12, 16, 17, 21, 22, 23, 24, 25]);
  assert.equal(L.puntuar(d, r).total, 10 + 2 + invertidos.length * 10);
  assert.equal(L.valorItem(d, d.items[0], [0, 1]), 4);
});

test('S-LANSS: cada «sí» suma su peso; ≥ 12 compatible con dolor neuropático', () => {
  const d = def('slanss');
  assert.equal(L.puntuar(d, todos('slanss', 'si')).total, 24);
  const r = { ...todos('slanss', 'no'), 1: 'si', 2: 'si', 5: 'si' };    // 5 + 5 + 1
  assert.equal(L.puntuar(d, r).total, 11);
  assert.match(L.puntuar(d, r).interpretacion.etiqueta, /^No sugiere/);
  assert.match(L.puntuar(d, { ...r, 4: 'si' }).interpretacion.etiqueta, /^Compatible/);
});

test('DN4: ≥ 4 de 10', () => {
  const d = def('dn4');
  const r = { ...todos('dn4', 'no'), 1: 'si', 4: 'si', 5: 'si' };
  assert.match(L.puntuar(d, r).interpretacion.etiqueta, /^No sugiere/);
  assert.match(L.puntuar(d, { ...r, 8: 'si' }).interpretacion.etiqueta, /^Compatible/);
});

test('cuestionarios sin punto de corte: dan la puntuación y dicen que no hay interpretación', () => {
  const p = L.puntuar(def('tsk11'), todos('tsk11', 2));
  assert.equal(p.total, 22);
  assert.equal(p.interpretacion, null);
  assert.match(L.resultadoCuestionarioHTML(def('tsk11'), todos('tsk11', 2)), /Sin punto de corte consensuado/);
});

test('cuestionarios: valores fuera de rango o de tipo equivocado no cuentan como contestados', () => {
  const d = def('phq9');
  assert.equal(L.valorItem(d, d.items[0], 4), null);
  assert.equal(L.valorItem(d, d.items[0], '2'), null);
  assert.equal(L.valorItem(def('dn4'), def('dn4').items[0], true), null);
  assert.equal(L.valorItem(def('orebro'), def('orebro').items[0], []), null);
});

test('cuestionarios: payload `cu`, 📋 Notas y prompt de la IA; nunca en el 📄 Informe', () => {
  withState({ cuestionarios: { phq9: { r: { ...todos('phq9', 1), 9: 1 } }, gad7: { r: { 1: 2 } } } }, () => {
    const d = buildPhysiQPayload();
    assert.deepEqual(d.cu.map(c => c.id), ['phq9', 'gad7']);
    assert.equal(d.cu[0].v, '9/27');
    assert.equal(d.cu[0].i, 'Síntomas depresivos leves');
    assert.ok(d.cu[0].a?.length, 'alerta del ítem 9');
    assert.ok(d.cu[1].inc, 'el GAD-7 a medias va marcado');
    const notas = buildContextSummaryText();
    assert.match(notas, /Cuestionarios:\n {2}· PHQ-9: 9\/27 — Síntomas depresivos leves · ⚠️ Ítem 9 positivo/);
    assert.match(notas, /GAD-7: incompleto, 1 de 7 ítems/);
    const ctx = IN.contextoValoracion(d);
    assert.match(ctx, /PHQ-9: 9\/27 — Síntomas depresivos leves · Aviso: Ítem 9/);
    assert.doesNotMatch(ctx, /GAD-7/, 'un cuestionario a medias sin alerta no va al prompt');
    assert.doesNotMatch(buildInformeFisioterapiaText(), /PHQ|GAD|Cuestionario/i);
  });
  withState({ cuestionarios: {} }, () => {
    assert.ok(!('cu' in buildPhysiQPayload()), 'sin cuestionarios no hay `cu` (la huella de informes antiguos no cambia)');
  });
  state.cuestionarios = {};
});

test('cuestionarios: se vacían al reiniciar y se copian al hub', () => {
  assert.match(leer('app.js'), /state\.cuestionarios = \{\};/);
  const deploy = leer('.github/workflows/deploy-to-hub.yml');
  assert.match(deploy, /lib\/cuestionarios\.js/);
  assert.match(deploy, /cp data\/\*\.js/);
});

test('cuestionarios: el HTML escapa y pinta un botón por valor', () => {
  const html = L.formularioCuestionarioHTML(def('phq9'), { 1: 2 });
  assert.equal((html.match(/class="cuest-op[ "]/g) || []).length, 9 * 4);
  assert.equal((html.match(/cuest-op selected/g) || []).length, 1);
  assert.match(L.listaCuestionariosHTML(CUESTIONARIOS, GRUPOS_CUESTIONARIO, { phq9: { r: todos('phq9', 3) } }), /27\/27 · Síntomas depresivos graves/);
  assert.doesNotMatch(L.listaCuestionariosHTML([{ ...def('phq2'), titulo: '<b>x</b>' }], GRUPOS_CUESTIONARIO), /<b>x<\/b>/);
});

// Requisito del usuario (2026-10): el PROM que recomienda cada hipótesis (badge
// de las fases 4b y 5, pq1 incluida) solo puede ser un instrumento validado en
// castellano de España. Lista y validación de cada uno: docs/cuestionarios.md.
// Las escalas numéricas de dolor (NPRS, EVA) no son cuestionarios.
const PROM_VALIDADOS_ES = ['ODI', 'RMDQ', 'NDI', 'SPADI', 'ASES', 'DASH', 'PRTEE', 'WOMAC', 'iHOT-12', 'HOS', 'LEFS', 'KOOS', 'Kujala', 'VISA-P', 'VISA-A', 'FAAM', 'CAIT', 'IdFAI', 'NPRS', 'EVA'];
const { HYPOTHESES } = await import('../../data.js');
const { HIP_POSQUIRURGICA } = await import('../../data/comun.js');
test('PROM de las hipótesis: solo instrumentos validados en castellano de España', () => {
  const proms = [...Object.values(HYPOTHESES).map(h => [h.id, h.prom]), ...Object.entries(HIP_POSQUIRURGICA.promPorRegion).map(([r, p]) => [`pq1 ${r}`, p])];
  for (const [id, prom] of proms) {
    const nombres = prom.replace(/\([^)]*\)/g, '').replace(/\s+—\s+[^/]*/g, '').split(/\s+(?:\/|o)\s+/).map(x => x.trim()).filter(Boolean);
    for (const n of nombres) assert.ok(PROM_VALIDADOS_ES.some(v => n === v || n.startsWith(v + ' ')), `${id}: «${n}» no está validado en castellano de España`);
  }
});
