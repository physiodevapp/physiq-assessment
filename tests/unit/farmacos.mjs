// Guía de fármacos de la cabecera (docs/farmacologia.md, paso 2). Se ejecuta desde tests/unit.js.
import { assert, leer, test, buildPhysiQPayload, buildInformeFisioterapiaText, buildContextSummaryText,
  withState, state, citasEnTexto, claveRegistro } from './comun.mjs';
const { APARTADOS_FARMACO, FAMILIAS_FARMACO, TEXTOS_FARMACOS } = await import('../../data/farmacos.js');
const F = await import('../../lib/farmacos.js');
const IA = await import('../../informe-ia.js');
const IN = await import('../../lib/informe-narrativo.js');
const { familiasMarcables } = await import('../../lib/farmacos-paciente.js');
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
  // Sin familias pendientes no hay bloque de pendientes (ni su atajo a la IA)
  const conPendientes = F.familiasPendientes().length > 0;
  assert.equal(html.includes('class="farm-pendientes"'), conPendientes);
  assert.equal(html.includes('onclick="farmacosPreguntarIA()"'), conPendientes);
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

test('CIMA: cada familia lista solo principios activos que nombra en sus ejemplos', () => {
  for (const f of F.familiasConContenido()) {
    assert.ok(Array.isArray(f.cima) && f.cima.length > 0, f.id);
    assert.equal(new Set(f.cima).size, f.cima.length, `${f.id}: repetido`);
    for (const n of f.cima) {
      assert.equal(n, n.toLowerCase().trim(), `${f.id}: «${n}» en minúscula y sin espacios sobrantes`);
      assert.ok(f.ejemplos.toLowerCase().includes(n), `${f.id}: «${n}» no está en sus ejemplos`);
    }
  }
});

test('CIMA: la URL es la de búsqueda verificada más el nombre codificado, y nada más', () => {
  assert.match(F.CIMA_BUSQUEDA, /^https:\/\/cima\.aemps\.es\//);
  assert.equal(F.urlCima('ibuprofeno'), F.CIMA_BUSQUEDA + 'ibuprofeno');
  assert.equal(F.urlCima('ácido acetilsalicílico'), F.CIMA_BUSQUEDA + '%C3%A1cido%20acetilsalic%C3%ADlico');
  assert.equal(F.urlCima('a&b=c#d'), F.CIMA_BUSQUEDA + 'a%26b%3Dc%23d');
  for (const f of F.familiasConContenido()) for (const n of f.cima) {
    const u = F.urlCima(n);
    assert.ok(!/[\s&#]/.test(u.slice(F.CIMA_BUSQUEDA.length)), u);
    assert.equal(decodeURIComponent(u.slice(F.CIMA_BUSQUEDA.length)), n);
  }
});

test('CIMA: un enlace por principio activo, en otra pestaña y sin iframe; fuera del cuerpo con «✨ IA»', () => {
  const html = F.farmacosHTML();
  assert.ok(!/<iframe/i.test(html));
  for (const f of F.familiasConContenido()) {
    const bloque = html.slice(html.indexOf(`data-familia="${f.id}"`)).split('</details>')[0];
    const enlaces = [...bloque.matchAll(/<a class="anat-enlace farm-cima-enlace" href="([^"]+)" target="_blank" rel="noopener noreferrer"/g)].map(m => m[1].replace(/&amp;/g, '&'));
    assert.deepEqual(enlaces, f.cima.map(F.urlCima), f.id);
    assert.ok(bloque.indexOf('farm-cima') < bloque.indexOf('data-ia-ctx'), `${f.id}: la línea CIMA va antes del cuerpo con «✨ IA»`);
  }
  const css = leer('styles.css');
  assert.ok(css.includes('.in-hub .farm-cima { display: block; }'), 'visible también en el hub');
});

test('CIMA: nunca entra en el payload, 📋 Notas, 📄 Informe ni el prompt del informe con IA', () => {
  const toma = familiasMarcables().map(f => f.id);
  assert.ok(toma.length > 0);
  withState({ region: 'lumbar', patient: 'Paciente Prueba', farmacos: { toma } }, () => {
    const d = buildPhysiQPayload();
    assert.ok(Array.isArray(d.fm) && d.fm.length === toma.length, 'control: las familias marcadas van en el payload');
    const prompt = IN.buildNarrativePrompt(d, { conAudio: false }) + IN.bloquesAmpliados(IA.construirAmpliado()).join('\n');
    for (const txt of [JSON.stringify(d), buildContextSummaryText(), buildInformeFisioterapiaText(), prompt]) {
      assert.ok(!/cima\.aemps|Ficha técnica \(CIMA\)|farm-cima/i.test(txt), 'CIMA filtrado a un resumen o al prompt');
      assert.ok(!txt.includes(F.CIMA_BUSQUEDA), 'URL de CIMA filtrada');
    }
  });
});

test('app: botón de cabecera, opción en «Herramientas» y funciones expuestas en window', () => {
  const html = leer('index.html');
  assert.ok(html.includes('id="farmBtn"') && html.includes('onclick="abrirFarmacos()"'));
  assert.ok(html.includes(`onclick="herramientaElegir('farmacos')"`));
  assert.ok(html.includes('id="farmOverlay"') && html.includes('onclick="cerrarFarmacos()"'));
  for (const fn of ['abrirFarmacos', 'cerrarFarmacos', 'farmacosPreguntarIA']) assert.equal(typeof globalThis[fn], 'function', fn);
  assert.ok(/farmacos: abrirFarmacos/.test(leer('app.js')));
});
