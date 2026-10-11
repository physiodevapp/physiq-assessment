// Lado afectado, exportar / importar la valoración. Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, state, buildPhysiQPayload,
   buildInformeFisioterapiaText, buildContextSummaryText, withState } from './comun.mjs';

// ── Lado afectado (fase 2) ─────────────────────────────────────────────────────
console.log('\nlado afectado');
const IN_INFORME = await import('../../lib/informe-narrativo.js');
const { ladoTexto } = await import('../../lib/region.js');
test('lado: viaja en el payload (la) y sale en 📋 Notas, 📄 Informe y el informe con IA', () => {
  withState({ region: 'hombro', lado: 'Derecho' }, () => {
    const d = buildPhysiQPayload();
    assert.equal(d.la, 'Derecho');
    assert.match(buildContextSummaryText(), /Región: Hombro \(derecho\)/);
    assert.match(buildInformeFisioterapiaText(), /Región valorada: Hombro \(derecho\)/);
    const IN2 = IN_INFORME;
    assert.match(IN2.buildNarrativePrompt(d, { conAudio: false, nombreRegion: r => r.charAt(0).toUpperCase() + r.slice(1) }), /Región valorada: Hombro \(derecho\)/);
    assert.match(IN2.textoParaCompartir('## A\nB.', { p: 'X', d: '01/01/2026', r: 'hombro', la: 'Derecho' }, r => 'Hombro'), /Región valorada: Hombro \(derecho\)/);
  });
  // Concordancia con la región: «Rodilla (izquierda)», no «(izquierdo)»
  withState({ region: 'rodilla', lado: 'Izquierdo' }, () => {
    assert.match(buildContextSummaryText(), /Región: Rodilla \(izquierda\)/);
    assert.match(buildInformeFisioterapiaText(), /Región valorada: Rodilla \(izquierda\)/);
    assert.equal(IN_INFORME.regionTexto(buildPhysiQPayload(), r => 'Rodilla'), 'Rodilla (izquierda)');
  });
  for (const [r, l, esperado] of [['cadera', 'Derecho', 'derecha'], ['lumbar', 'Izquierdo', 'izquierda'], ['cervical', 'Central', 'central'],
    ['rodilla', 'Bilateral', 'bilateral'], ['hombro', 'Izquierdo', 'izquierdo'], ['codo', 'Derecho', 'derecho'], ['tobillo_pie', 'Izquierdo', 'izquierdo']])
    assert.equal(ladoTexto(r, l), esperado, `${r} ${l}`);
  withState({ region: 'hombro', lado: '' }, () => {
    assert.equal(buildPhysiQPayload().la, '');
    assert.match(buildInformeFisioterapiaText(), /Región valorada: Hombro\n/);
  });
});

test('lado: el reinicio lo borra y «Central» solo existe en la columna', () => {
  const html = leer('index.html');
  assert.match(html, /id="ladoWrap" hidden/);
  for (const v of ['Derecho', 'Izquierdo', 'Bilateral', 'Central']) assert.ok(html.includes(`selectOption('lado', this, '${v}')`), v);
  const src = leer('app.js');
  const reset = src.slice(src.indexOf('function _softResetApp()'), src.indexOf('function _softResetApp()') + 3000);
  assert.ok(reset.includes("state.lado = '';"), '_softResetApp borra el lado');
  assert.match(src, /const REGIONES_COLUMNA = \['cervical', 'lumbar'\]/);
  assert.match(src, /if \(state.lado === 'Central' && !columna\) state.lado = '';/);
});

// ── Exportar / importar la valoración (lib/valoracion-json.js) ────────────────
console.log('\nexportar / importar valoración');
{
  const VJ = await import('../../lib/valoracion-json.js');
  const regiones = Object.keys(SYSTEMIC_SCREENING);
  const ahora = new Date(2026, 9, 6, 12, 0);
  const base = { ...JSON.parse(JSON.stringify(state)), patient: 'José Pérez', region: 'hombro', maxVisitedIdx: 5, currentPhase: 5,
    treeAnswers: { h_step1: 'trauma' }, testResults: { h11: { 0: 'neg' } }, planNotes: { variableControl: 'ROM', ventanaRecuperacion: '', anclajeHabito: '' },
    formularioPrevio: { comun: { desde_cuando: 'hace mes y medio' }, regiones: { hombro: { luxacion: 'No' } } },
    informeIA: { texto: 'informe viejo', datos: {} } };

  test('exportar → importar devuelve el mismo estado, sin el informe con IA', () => {
    const texto = JSON.stringify(VJ.exportarValoracion(base, ahora));
    const r = VJ.leerImportacion(texto, regiones);
    assert.ok(r.ok, r.error);
    const { informeIA, ...esperado } = base;
    assert.deepEqual(r.assessmentState, esperado);
    assert.equal(r.paciente, 'José Pérez');
    assert.ok(!('informeIA' in r.assessmentState) && !texto.includes('informe viejo'));
  });

  test('exportar: encabezado del archivo y nombre sin acentos', () => {
    const e = VJ.exportarValoracion(base, ahora);
    assert.equal(e.app, 'physiq-assessment');
    assert.equal(e.tipo, 'valoracion');
    assert.equal(e.version, VJ.VERSION);
    assert.equal(VJ.nombreArchivo('José Pérez', ahora), 'valoracion-jose-perez-2026-10-06.json');
    assert.equal(VJ.nombreArchivo('', ahora), 'valoracion-sin-nombre-2026-10-06.json');
    assert.equal(VJ.hayValoracion({ maxVisitedIdx: 0 }), false);
    assert.equal(VJ.hayValoracion(base), true);
  });

  test('importar: rechaza archivos que no son una valoración restaurable, sin lanzar', () => {
    const conEstado = cambios => JSON.stringify({ ...VJ.exportarValoracion(base, ahora), ...cambios });
    const conAS = cambios => JSON.stringify({ ...VJ.exportarValoracion(base, ahora), assessmentState: { ...base, ...cambios } });
    const casos = [
      ['no es JSON', 'hola', /JSON válido/],
      ['otra app', conEstado({ app: 'physiq-motion' }), /no es una valoración/],
      ['versión futura', conEstado({ version: VJ.VERSION + 1 }), /versión más nueva/],
      ['sin estado', conEstado({ assessmentState: null }), /no contiene/],
      ['sin pasar de la fase 1', conAS({ maxVisitedIdx: 0 }), /fase 1/],
      ['fase inválida', conAS({ currentPhase: 7 }), /fase guardada/],
      ['región desconocida', conAS({ region: 'muñeca' }), /región/],
    ];
    for (const [nombre, texto, error] of casos) {
      const r = VJ.leerImportacion(texto, regiones);
      assert.equal(r.ok, false, nombre);
      assert.match(r.error, error, nombre);
    }
  });

  test('importar: app.js bloquea saveSession() mientras importa y recarga para restaurar', () => {
    const src = leer('app.js');
    assert.match(src, /function saveSession\(\) \{\n  if \(_importando\) return;/, 'saveSession no debe pisar lo importado con el DOM anterior');
    const aplicar = src.slice(src.indexOf('async function _aplicarImportacion'), src.indexOf('function toggleSessionPanel'));
    assert.ok(aplicar.indexOf('_importando = true') < aplicar.indexOf('writeSession'), 'el bloqueo va antes de escribir');
    assert.ok(aplicar.indexOf('clearSession()') < aplicar.indexOf('writeSession'), 'sin restos de la sesión anterior');
    assert.match(aplicar, /location\.reload\(\)/);
    assert.ok(!/import .*valoracion-json/.test(src), 'el módulo se carga con import() solo al usarlo');
  });

  test('deploy: lib/valoracion-json.js se copia al hub', () => {
    const wf = leer('.github/workflows/deploy-to-hub.yml');
    assert.ok(wf.includes('lib/valoracion-json.js'));
  });
}
