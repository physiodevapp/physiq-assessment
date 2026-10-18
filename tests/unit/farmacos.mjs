// Guía de fármacos de la cabecera (docs/farmacologia.md, paso 2). Se ejecuta desde tests/unit.js.
import { assert, leer, test, buildPhysiQPayload, buildInformeFisioterapiaText, buildContextSummaryText,
  withState, state, citasEnTexto, claveRegistro } from './comun.mjs';
const { APARTADOS_FARMACO, FAMILIAS_FARMACO, TEXTOS_FARMACOS } = await import('../../data/farmacos.js');
const F = await import('../../lib/farmacos.js');
const { REFERENCIAS } = await import('../../data/referencias.js');

console.log('\nguía de fármacos (cabecera)');

const textos = a => [].concat(a.texto, a.detalle ?? []);

test('las 13 familias de docs/farmacologia.md, en su orden', () => {
  assert.deepEqual(FAMILIAS_FARMACO.map(f => f.id), ['aine', 'corticoides', 'antitromboticos', 'opioides', 'gabapentinoides',
    'antidepresivos', 'sedantes', 'estatinas', 'fluoroquinolonas', 'betabloqueantes', 'antihipertensivos', 'antidiabeticos', 'hueso']);
  for (const f of FAMILIAS_FARMACO) assert.ok(f.nombre && f.ejemplos, f.id);
  assert.deepEqual(APARTADOS_FARMACO.map(a => a.id), ['dolor', 'visceral', 'ejercicio', 'sueno', 'consultar']);
});

test('una familia con contenido tiene los cinco apartados y fuentes del registro', () => {
  const con = F.familiasConContenido();
  assert.ok(con.length >= 1, 'al menos una familia escrita');
  for (const f of con) {
    for (const a of APARTADOS_FARMACO) {
      const ap = f.apartados[a.id];
      assert.ok(ap && textos(ap).every(t => typeof t === 'string' && t.length > 20), `${f.id}.${a.id}`);
    }
    assert.deepEqual(Object.keys(f.apartados).sort(), APARTADOS_FARMACO.map(a => a.id).sort(), f.id);
    assert.ok(f.fuentes.length > 0, f.id);
    for (const k of f.fuentes) assert.ok(REFERENCIAS[k], `${f.id}: «${k}» no está en data/referencias.js`);
  }
});

test('cada cita dentro de la frase es una fuente de esa familia (y se pinta como botón)', () => {
  for (const f of F.familiasConContenido()) {
    const usadas = new Set();
    for (const ap of Object.values(f.apartados)) {
      for (const t of textos(ap)) {
        const html = citasEnTexto(t);
        for (const m of html.matchAll(/data-cita="([^"]+)"/g)) {
          const clave = claveRegistro(m[1].replace(/&quot;/g, '"'), REFERENCIAS);
          assert.ok(clave && f.fuentes.includes(clave), `${f.id}: «${m[1]}» no es una de sus fuentes`);
          usadas.add(clave);
        }
      }
    }
    for (const k of f.fuentes) assert.ok(usadas.has(k), `${f.id}: «${k}» está en fuentes pero no se cita en ningún apartado`);
  }
});

test('límites: nunca propone cambiar, suspender ni ajustar la medicación', () => {
  const prohibido = /\b(suspend[ea]|retir[ae]|deja de tomar|baja la dosis|sube la dosis|ajusta la dosis|cambia el fármaco|sustituye)\b/i;
  for (const f of F.familiasConContenido()) {
    for (const ap of Object.values(f.apartados)) for (const t of textos(ap)) assert.ok(!prohibido.test(t), `${f.id}: ${t}`);
  }
  assert.ok(/médico o el farmacéutico/.test(TEXTOS_FARMACOS.limites));
});

test('el HTML: una <details> por familia con contenido, «✨ IA» por párrafo con contexto, pendientes listadas', () => {
  const html = F.farmacosHTML();
  const con = F.familiasConContenido();
  assert.equal((html.match(/class="farm-familia"/g) || []).length, con.length);
  assert.equal((html.match(/data-ia-ctx="/g) || []).length, con.length);
  const parrafos = con.reduce((n, f) => n + Object.values(f.apartados).reduce((m, a) => m + textos(a).length, 0), 0);
  assert.equal((html.match(/class="ia-parrafo"/g) || []).length, parrafos);
  for (const f of F.familiasPendientes()) assert.ok(html.includes(f.nombre), f.id);
  assert.ok(html.includes('onclick="farmacosPreguntarIA()"'));
});

test('la guía no lee el estado del paciente ni llega al payload, los resúmenes o el prompt', () => {
  const src = leer('lib/farmacos.js');
  assert.ok(!/\bstate\b/.test(src.replace(/\/\/.*$/gm, '')), 'lib/farmacos.js no toca state');
  withState({ region: 'lumbar', patient: 'Paciente Prueba' }, () => {
    const salida = JSON.stringify(buildPhysiQPayload()) + buildInformeFisioterapiaText() + buildContextSummaryText();
    for (const f of F.familiasConContenido()) {
      for (const ap of Object.values(f.apartados)) for (const t of textos(ap)) assert.ok(!salida.includes(t.slice(0, 40)), t);
    }
  });
  assert.ok(state);
});

test('app: botón de cabecera, opción en «Herramientas» y funciones expuestas en window', () => {
  const html = leer('index.html');
  assert.ok(html.includes('id="farmBtn"') && html.includes('onclick="abrirFarmacos()"'));
  assert.ok(html.includes(`onclick="herramientaElegir('farmacos')"`));
  assert.ok(html.includes('id="farmOverlay"') && html.includes('onclick="cerrarFarmacos()"'));
  for (const fn of ['abrirFarmacos', 'cerrarFarmacos', 'farmacosPreguntarIA']) assert.equal(typeof globalThis[fn], 'function', fn);
  assert.ok(/farmacos: abrirFarmacos/.test(leer('app.js')));
});
