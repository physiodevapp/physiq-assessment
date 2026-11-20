// Entrena (entrena.html + entrena.js): el juego para memorizar los árboles (fase 4) y los
// tests de confirmación (fase 4b). La lógica pura está en lib/entrena.js.
// Se ejecuta desde tests/unit.js.
import { assert, leer, test, CIF_TREES, HYPOTHESES } from './comun.mjs';
const E = await import('../../lib/entrena.js');
const { etiquetaPaso, numeroHipotesis, ORDEN_REGIONES } = await import('../../lib/esquemas.js');
const { resolveOptionTargets } = await import('../../lib/arbol.js');
const { pesoTest } = await import('../../lib/tests-4b.js');

const DATOS = Object.fromEntries(ORDEN_REGIONES.map(r => [r, E.datosRegion(r, CIF_TREES, HYPOTHESES)]));
const test_ = (d, hid, i) => d.hyp[hid].tests[i];

test('entrena: cada región, con la numeración de su hoja y los destinos de la fase 4', () => {
  for (const r of ORDEN_REGIONES) {
    const tree = CIF_TREES[r], d = DATOS[r];
    assert.equal(d.steps.length, tree.steps.length, r);
    tree.steps.forEach((s, i) => {
      const p = d.steps[i];
      assert.equal(p.num, etiquetaPaso(s, i), `${r} ${s.id}`);
      assert.ok(p.tit, `${r} ${s.id}: sin título`);
      assert.equal(p.q, s.question);
      s.options.forEach((o, k) => assert.equal(p.opts[k].next, resolveOptionTargets(tree, i, o)[0]?.id || null, `${r} ${s.id} opción ${k}`));
    });
    // Toda hipótesis que sale del árbol está, con su número de la hoja y todos sus tests
    for (const s of d.steps) for (const o of s.opts) for (const h of o.h) {
      assert.ok(d.hyp[h], `${r}: falta ${h}`);
      assert.equal(d.hyp[h].n, numeroHipotesis(HYPOTHESES[h].num) || h.replace(/\D/g, ''));
      assert.equal(d.hyp[h].tests.length, HYPOTHESES[h].tests.length, h);
    }
  }
});

test('entrena: «cuánto pesa» sale de pesoTest(), como la app y la hoja de confirmación', () => {
  for (const r of ORDEN_REGIONES) for (const [hid, h] of Object.entries(DATOS[r].hyp))
    h.tests.forEach((x, i) => {
      assert.equal(x.p, pesoTest(HYPOTHESES[hid], HYPOTHESES[hid].tests[i], i));
      assert.equal(x.c, E.categoriaPeso(x.p));
    });
  // Lumbar tiene las seis categorías (por eso «¿Cuánto pesa?» se juega allí)
  const cats = new Set(Object.values(DATOS.lumbar.hyp).flatMap(h => h.tests.map(x => x.c)));
  for (const c of ['confirma', 'descarta', 'ambas', 'cluster', 'hallazgo', 'pronostico']) assert.ok(cats.has(c), c);
});

test('entrena: «Positivo si…» deja fuera alias, pruebas complementarias y criterios que solo repiten el nombre', () => {
  const nombre = (d, re) => Object.values(d.hyp).flatMap(h => h.tests).find(x => re.test(x.n));
  assert.equal(nombre(DATOS.codo, /Thomsen/).pz, false, 'alias de Cozen');
  assert.equal(nombre(DATOS.codo, /^RM con artrograma/).pz, false, 'imagen');
  assert.equal(nombre(DATOS.codo, /^Electrodiagn/).pz, false, 'complementaria');
  assert.equal(nombre(DATOS.lumbar, /^Edad > 48/).pz, false, 'anamnesis de Cook');
  assert.equal(nombre(DATOS.codo, /Gancho/).pz, true, 'Hook test');
  assert.equal(nombre(DATOS.lumbar, /inestabilidad en prono/).pz, true, 'técnica con su criterio');
  // Sin el nombre del test en la opción (PEPPER, SALT, Pivot shift…); el resto del criterio, intacto
  assert.ok(!/Posterior Elbow Pain/.test(nombre(DATOS.codo, /^PEPPER/).cj));
  assert.ok(!/^Pivot shift/.test(nombre(DATOS.codo, /pivote lateral/).cj));
  const tinel = nombre(DATOS.codo, /Tinel/);
  assert.equal(tinel.cj, tinel.crit);
  for (const r of ORDEN_REGIONES) assert.ok(Object.values(DATOS[r].hyp).flatMap(h => h.tests).filter(x => x.pz).length >= 20, r);
});

test('entrena: código de resultado del duelo (ida y vuelta, erratas y otra región)', () => {
  for (const r of ORDEN_REGIONES) {
    const c = E.codigoResultado(ORDEN_REGIONES, r, '4821', 0b1011001101, 287);
    assert.match(c, /^[0-9A-Z]{3}-[0-9A-Z]{3}-[0-9A-Z]{3}$/);
    assert.deepEqual(E.leerCodigo(ORDEN_REGIONES, c), { reg: r, codigo: '4821', bits: 0b1011001101, puntos: 287 });
    assert.deepEqual(E.leerCodigo(ORDEN_REGIONES, c.toLowerCase().replace(/-/g, ' ')), E.leerCodigo(ORDEN_REGIONES, c));
  }
  const c = E.codigoResultado(ORDEN_REGIONES, 'codo', '0042', 5, 999);
  assert.equal(E.leerCodigo(ORDEN_REGIONES, c).puntos, 511, 'los puntos se topan en 511');
  assert.equal(E.leerCodigo(ORDEN_REGIONES, c).codigo, '0042');
  let erratas = 0;
  for (let k = 0; k < c.length; k++) if (c[k] !== '-') { const m = c.slice(0, k) + (c[k] === 'Z' ? 'Y' : 'Z') + c.slice(k + 1); if (E.leerCodigo(ORDEN_REGIONES, m)) erratas++; }
  assert.ok(erratas <= 1, `erratas que pasan: ${erratas}`);
  assert.equal(E.leerCodigo(ORDEN_REGIONES, ''), null);
  assert.equal(E.leerCodigo(ORDEN_REGIONES, 'hola'), null);
});

test('entrena: filas de pasos iguales, tiempo según la lectura y azar con semilla', () => {
  assert.deepEqual([5, 6, 8, 9, 10, 13].map(E.columnasPasos), [5, 6, 4, 5, 5, 7]);
  assert.equal(E.segundosLectura(0), 12);
  assert.equal(E.segundosLectura(400), 22);
  assert.equal(E.segundosLectura(5000), 30);
  const a = E.mulberry32(E.semilla('diario-codo-2026-11-20')), b = E.mulberry32(E.semilla('diario-codo-2026-11-20'));
  assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
  assert.notEqual(E.semilla('duelo-codo-1234'), E.semilla('duelo-codo-1235'));
});

test('entrena: solo módulos puros, ningún dato del paciente y solo sus propias preferencias guardadas', () => {
  const js = leer('entrena.js'), lib = leer('lib', 'entrena.js');
  const imports = [...js.matchAll(/from '([^']+)'/g), ...js.matchAll(/import\('([^']+)'\)/g)].map(m => m[1]);
  for (const m of imports) assert.ok(!/\/(app|state|phase4b?|formulario|informe-ia|grabadora|plan)\.js$/.test(m), m);
  assert.ok(!/indexedDB|BroadcastChannel|\bstate\./.test(js + lib), 'no toca la sesión');
  assert.ok(!/localStorage/.test(lib), 'lib/entrena.js es pura');
  // Claves: el progreso de cada región y las preferencias del juego (más el destino de la IA, en ampliar-ia.js)
  const claves = [...js.matchAll(/'(physiq-[\w-]+)'/g)].map(m => m[1]);
  for (const k of claves) assert.ok(/^physiq-entrena-/.test(k), k);
});

test('entrena: avisa de una versión nueva como la app (lib/version.js y version.json sin caché), solo en su inicio', () => {
  const js = leer('entrena.js');
  assert.match(js, /from '\.\/lib\/version\.js'/);
  assert.match(js, /fetch\('\.\/version\.json', \{ cache: 'no-store' \}\)/);
  assert.match(js, /esVersionNueva\(publicada\)/);
  assert.ok(/function mostrarAvisoVersion\(\) \{\n  if \(!_versionNueva [^\n]*\|\| J \|\|/.test(js), 'nunca durante una partida');
});

test('entrena: se despliega, se instala aparte y la guía lo enlaza', () => {
  const deploy = leer('.github', 'workflows', 'deploy-to-hub.yml');
  for (const f of ['entrena.html', 'entrena.js', 'entrena.webmanifest', 'entrena.svg', 'lib/entrena.js', 'icons/entrena-192.png', 'icons/entrena-512.png'])
    assert.ok(deploy.includes(f), f);
  assert.match(deploy, /docs\/esquemas\/arbol-a4-\*\.png/);
  assert.match(deploy, /docs\/esquemas\/confirmacion-\*\.png/);
  const html = leer('entrena.html');
  assert.ok(html.includes('src="./entrena.js"') && html.includes('rel="manifest" href="entrena.webmanifest"'));
  const man = JSON.parse(leer('entrena.webmanifest'));
  assert.equal(man.start_url, '/physiq/assessment/entrena.html');
  assert.ok(man.start_url.startsWith(man.scope), 'start_url dentro de su scope');
  assert.notEqual(man.scope, JSON.parse(leer('manifest.json')).scope, 'scope propio: se instala como app aparte');
  assert.ok(man.icons.some(i => i.sizes === '512x512') && man.icons.some(i => i.sizes === '192x192'));
  assert.ok(leer('guia.js').includes('entrena.html#'), 'la guía enlaza el juego desde el árbol y la confirmación');
  assert.ok(leer('guia.js').includes('<a href="entrena.html">'), 'y desde su pie');
  assert.ok(/id="sessionEntrena" href="\.\/entrena\.html/.test(leer('app.js')), 'la app lo enlaza desde el panel de sesión');
});
