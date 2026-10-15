// Matriz de irritabilidad de la fase 3 (data/irritabilidad.js,
// lib/irritabilidad.js; decisiones 99–104 de docs/plan-tratamiento.md). Se
// ejecuta desde tests/unit.js.
import { assert, leer, test, state, withState, buildPhysiQPayload, buildContextSummaryText, buildInformeFisioterapiaText, getPendientesBreve } from './comun.mjs';
const I = await import('../../lib/irritabilidad.js');
const DI = await import('../../data/irritabilidad.js');
const P = await import('../../lib/plan-tratamiento.js');
const IN = await import('../../lib/informe-narrativo.js');
const { REFERENCIAS } = await import('../../data/referencias.js');

console.log('\nirritabilidad (matriz de la fase 3)');

const M = (reposo = '', movimiento = '', tolerancia = '', calma = '') => ({ reposo, movimiento, tolerancia, calma, discapacidad: '' });
const MIN = 'Cede en minutos', HORAS = 'Tarda horas', NOCHE = 'No cede hasta tras una noche';

test('irritabilidad: cuatro ítems, el último el tiempo en calmarse con tres opciones (minutos, horas, día siguiente)', () => {
  assert.deepEqual(DI.ITEMS_IRRITABILIDAD.map(i => i.clave), ['reposo', 'movimiento', 'tolerancia', 'calma']);
  const calma = DI.ITEMS_IRRITABILIDAD.at(-1);
  assert.deepEqual(calma.opciones.map(o => o.valor), [MIN, HORAS, NOCHE]);
  assert.deepEqual(calma.opciones.map(o => o.corto), ['Minutos', 'Horas', 'Día siguiente']);
  assert.match(calma.ayuda, /Petersen 2021/);
  for (const it of [...DI.ITEMS_IRRITABILIDAD, DI.ITEM_IMPACTO]) {
    assert.equal(it.opciones.length, 3, it.clave);
    assert.equal(new Set(it.opciones.map(o => o.valor)).size, 3, it.clave);
  }
  assert.equal(DI.ITEM_IMPACTO.clave, 'discapacidad', 'el impacto conserva la clave de las sesiones antiguas');
  assert.ok(!DI.ITEMS_IRRITABILIDAD.some(i => i.clave === 'dolor' || i.clave === 'discapacidad'), 'nivel de dolor y discapacidad no son irritabilidad (decisión 100)');
});

test('irritabilidad: el tiempo en calmarse marca el suelo y reposo + movimiento + tolerancia solo lo suben (cortes 0–1, 2–4, 5–6)', () => {
  const n = (...a) => I.nivelMatriz(M(...a)).nivel;
  assert.equal(n('Ausente', 'Al final del rango con SP', 'Alta', MIN), 'baja');
  assert.equal(n('Ausente', 'Al final del rango con SP', 'Alta', HORAS), 'moderada', 'suelo moderado');
  assert.equal(n('Ausente', 'Al final del rango con SP', 'Alta', NOCHE), 'alta', 'suelo alto');
  assert.equal(n('Intermitente', 'Al final del rango', 'Alta', MIN), 'moderada', 'los otros suben (2)');
  assert.equal(n('Presente', 'Antes del final del rango', 'Moderada', MIN), 'alta', 'los otros suben (5)');
  assert.equal(n('Presente', 'Antes del final del rango', 'Moderada', HORAS), 'alta');
  assert.equal(n('Intermitente', 'Al final del rango con SP', 'Alta', HORAS), 'moderada', 'los otros nunca bajan el suelo');
  // Sin el tiempo en calmarse (sesiones antiguas): los cortes de la decisión 25
  assert.equal(n('Ausente', 'Al final del rango con SP', 'Alta'), 'baja');
  assert.equal(n('Intermitente', 'Al final del rango', 'Alta'), 'moderada');
  assert.equal(n('Presente', 'Antes del final del rango', 'Baja'), 'alta');
});

test('irritabilidad: sin preselección; nada contestado → no registrada; lo que falta se dice', () => {
  assert.deepEqual(I.nivelMatriz(M()), { nivel: null, incompleta: true, sinCalma: true });
  assert.deepEqual(I.nivelMatriz({}), { nivel: null, incompleta: true, sinCalma: true });
  assert.deepEqual(I.nivelMatriz(undefined), { nivel: null, incompleta: true, sinCalma: true });
  assert.deepEqual(I.nivelMatriz(M('', '', '', HORAS)), { nivel: 'moderada', incompleta: true, sinCalma: false });
  assert.deepEqual(I.nivelMatriz(M('Ausente', 'Al final del rango con SP', 'Alta')), { nivel: 'baja', incompleta: true, sinCalma: true });
  assert.deepEqual(I.nivelMatriz(M('Ausente', 'Al final del rango con SP', 'Alta', MIN)), { nivel: 'baja', incompleta: false, sinCalma: false });
  // El dolor y la discapacidad de las sesiones antiguas no cuentan
  assert.equal(I.nivelMatriz({ dolor: 'Alta (≥7/10)', discapacidad: 'Alta', reposo: 'Ausente', movimiento: 'Al final del rango con SP', tolerancia: 'Alta' }).nivel, 'baja');
  assert.deepEqual(I.matrizVacia('Alta'), { reposo: '', movimiento: '', tolerancia: '', calma: '', discapacidad: 'Alta' });
  // Estado inicial: nada marcado, nivel no registrado
  const st = leer('state.js');
  assert.match(st, /irritabilidad: \{ reposo: '', movimiento: '', tolerancia: '', calma: '', discapacidad: '' \}/);
  assert.match(st, /irritabilidadNivel: null/);
  assert.ok(!/irritab-btn selected/.test(leer('index.html')), 'ningún botón de la matriz viene marcado');
});

test('irritabilidad: la fase 3 y la fase 6 dan el mismo nivel con cualquier matriz', () => {
  const vals = it => ['', ...it.opciones.map(o => o.valor)];
  const [r, m, t, c] = DI.ITEMS_IRRITABILIDAD.map(vals);
  let n = 0;
  for (const a of r) for (const b of m) for (const d of t) for (const e of c) {
    const matriz = M(a, b, d, e);
    assert.equal(P.irritabilidadSINSS({ irritabilidad: matriz }).nivel, I.nivelMatriz(matriz).nivel, JSON.stringify(matriz));
    n++;
  }
  assert.equal(n, 256);
  // La fase 3 calcula con la misma función
  assert.match(leer('app.js'), /function calcIrritabilidad\(\) \{[\s\S]*?nivelMatriz\(state\.irritabilidad\)/);
});

test('irritabilidad: textos del resumen con fuente (los dos modos de Maitland), citas del registro', () => {
  const T = DI.TEXTOS_IRRITABILIDAD;
  assert.match(T.hastaLimite, /hasta el límite/);
  assert.match(T.hastaDolor, /hasta el dolor/);
  for (const k of ['hastaLimite', 'hastaDolor', 'alta']) assert.match(T[k], /Maitland 2005.*Hengeveld y Banks 2005/, k);
  assert.match(T.margen, /Barakatt 2009/);
  for (const k of DI.FUENTES_IRRITABILIDAD) assert.ok(REFERENCIAS[k], `${k} no está en el registro`);
  const app = leer('app.js');
  for (const viejo of ['técnicas más agresivas', 'Evitar técnicas de alta intensidad', 'Priorizar técnicas pasivas']) assert.ok(!app.includes(viejo), `queda «${viejo}»`);
  // Baja → hasta el límite; moderada y alta → hasta el dolor; alta añade la adaptación
  assert.match(app, /nivel === 'Baja' \? T\.hastaLimite : T\.hastaDolor/);
  assert.match(app, /if \(nivel === 'Alta'\) textos\.push\(T\.alta\)/);
});

test('irritabilidad: la matriz se pinta desde los datos, una vista repinta la otra y el segundo toque vacía', () => {
  const app = leer('app.js');
  assert.match(app, /data-key="\$\{clave\}" data-valor="\$\{o\.valor\}" onclick="selectIrritab\(this\)"/);
  assert.match(app, /state\.irritabilidad\[key\] = state\.irritabilidad\[key\] === valor \? '' : valor;/);
  assert.ok(!/selectIrritabSync|syncIrritab(Mobile|Desktop)/.test(app + leer('index.html')), 'sin la sincronización antigua por el texto del onclick');
  assert.equal(typeof window.selectIrritab, 'function');
  const html = leer('index.html');
  for (const id of ['irritabTabla', 'irritabTarjetas', 'impactoActividades', 'irritabPistaBreve']) assert.ok(html.includes(`id="${id}"`), id);
});

test('irritabilidad: «Hacer principal» vacía la matriz y conserva el impacto en las actividades', () => {
  const s = leer('sintomas.js');
  assert.match(s, /state\.irritabilidadDirecta = true;\s*\n(?:\s*\/\/.*\n)*\s*state\.irritabilidad = matrizVacia\(state\.irritabilidad\?\.discapacidad \|\| ''\);/);
});

test('irritabilidad: no registrada → payload null, Notas «no registrada», Informe sin la línea, prompt «no registrada»', () => {
  withState({ irritabilidadNivel: null, irritabilidadDirecta: false, irritabilidad: M() }, () => {
    const d = buildPhysiQPayload();
    assert.equal(d.ir, null);
    assert.match(buildContextSummaryText(), /Irritabilidad: no registrada/);
    assert.ok(!buildInformeFisioterapiaText().includes('Irritabilidad del cuadro'));
    assert.ok(!buildInformeFisioterapiaText().includes('VALORACIÓN\n\n'), 'sin línea vacía en su lugar');
    assert.match(IN.buildNarrativePrompt(d, { ampliado: null }), /Irritabilidad: no registrada/);
  });
  withState({ irritabilidadNivel: 'Moderada', irritabilidadDirecta: false, irritabilidad: M('Ausente', 'Al final del rango con SP', 'Alta', HORAS) }, () => {
    const d = buildPhysiQPayload();
    assert.equal(d.ir, 'Moderada', 'mismo formato de siempre: physiq-report no cambia');
    assert.ok(!('ic' in d) && !JSON.stringify(d).includes(HORAS), 'el tiempo en calmarse no va al payload (decisión 103)');
    assert.match(buildInformeFisioterapiaText(), /Irritabilidad del cuadro: Moderada\n/);
  });
});

test('irritabilidad: modo breve — sin registrar o estimada, pendiente; pista del dato clave', () => {
  withState({ modo: 'breve', region: '', irritabilidadNivel: null, irritabilidadDirecta: false }, () => {
    assert.ok(getPendientesBreve().some(p => p.texto === 'Irritabilidad sin registrar'));
  });
  withState({ modo: 'breve', region: '', irritabilidadNivel: 'Alta', irritabilidadDirecta: true }, () => {
    const t = getPendientesBreve().map(p => p.texto);
    assert.ok(t.includes('Irritabilidad estimada sin la matriz') && !t.includes('Irritabilidad sin registrar'));
  });
  withState({ modo: 'completo', irritabilidadNivel: null }, () => assert.deepEqual(getPendientesBreve(), []));
  assert.match(DI.TEXTOS_IRRITABILIDAD.pistaBreve, /cuánto tarda en calmarse/);
});
