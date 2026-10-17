// Silueta de la fase 2 (data/siluetas.js, lib/silueta.js): un toque en una
// zona elige la región y el lado. Se ejecuta desde tests/unit.js.
import { assert, leer, test, VALID_REGIONS } from './comun.mjs';
const { SILUETAS } = await import('../../data/siluetas.js');
const S = await import('../../lib/silueta.js');

console.log('\nsilueta (fase 2)');

const PAREADAS = VALID_REGIONS.filter(r => r !== 'cervical' && r !== 'lumbar');

test('silueta: dos figuras, cada una con una zona por región y lado (cervical y lumbar sin lado)', () => {
  assert.deepEqual(Object.keys(SILUETAS).sort(), ['hombre', 'mujer']);
  for (const [nombre, fig] of Object.entries(SILUETAS)) {
    const claves = fig.zonas.map(z => `${z.region}|${z.lado}`).sort();
    const esperadas = [
      'cervical|', 'lumbar|',
      ...PAREADAS.flatMap(r => [`${r}|Derecho`, `${r}|Izquierdo`]),
    ].sort();
    assert.deepEqual(claves, esperadas, nombre);
    assert.ok(fig.contorno && fig.partes.length > 20 && fig.pelo.length >= 1, nombre);
  }
});

test('silueta: vista posterior, el lado izquierdo del paciente a la izquierda de la pantalla', () => {
  for (const [nombre, fig] of Object.entries(SILUETAS)) {
    const [x0, y0, w, h] = fig.caja;
    const centro = x0 + w / 2;
    for (const z of fig.zonas) {
      assert.ok(z.x > x0 && z.x < x0 + w && z.y > y0 && z.y < y0 + h, `${nombre} ${z.region} ${z.lado}: dentro del dibujo`);
      if (z.lado === 'Izquierdo') assert.ok(z.x < centro, `${nombre} ${z.region} izquierda`);
      if (z.lado === 'Derecho') assert.ok(z.x > centro, `${nombre} ${z.region} derecha`);
      if (!z.lado) assert.ok(Math.abs(z.x - centro) < w * 0.05, `${nombre} ${z.region} en la línea media`);
    }
  }
});

test('silueta: las dos figuras tienen la misma proporción (igual de altas en pantalla: cambiar de sexo no mueve lo de debajo)', () => {
  const { hombre, mujer } = SILUETAS;
  assert.ok(Math.abs(hombre.caja[2] / hombre.caja[3] - mujer.caja[2] / mujer.caja[3]) < 1e-9);
});

test('silueta: a la anchura del dibujo (280 px) las zonas de 44 px no se pisan', () => {
  const css = leer('styles.css');
  assert.match(css, /\.sil-lienzo \{[^}]*width: min\(280px, 100%\)/);
  assert.match(css, /\.sil-zona \{[^}]*width: 44px; height: 44px;/);
  for (const [nombre, fig] of Object.entries(SILUETAS)) {
    const k = 280 / fig.caja[2];
    fig.zonas.forEach((a, i) => fig.zonas.slice(i + 1).forEach(b => {
      const d = Math.hypot((a.x - b.x) * k, (a.y - b.y) * k);
      assert.ok(d >= 44, `${nombre}: ${a.region} ${a.lado} y ${b.region} ${b.lado} a ${d.toFixed(1)} px`);
    }));
  }
});

test('silueta: la figura sale del sexo, que es el mismo dato en las fases 1 y 2', () => {
  assert.equal(S.figuraSilueta('Mujer'), 'mujer');
  assert.equal(S.figuraSilueta('Hombre'), 'hombre');
  assert.equal(S.figuraSilueta(''), 'hombre', 'sin sexo indicado, la masculina');
  assert.equal(S.notaSexo(''), 'Sin indicar');
  assert.equal(S.notaSexo('Mujer'), '');
  const app = leer('app.js');
  assert.ok(!/_figuraElegida/.test(app), 'no hay figura elegida aparte del sexo');
  // El sexo de la silueta pasa por el botón de la fase 1 (mismo dato y reglas)
  assert.match(app, /function elegirSexoSilueta\(valor\) \{[\s\S]*?selectOption\('sexo', btn, valor\)/);
});

test('silueta: estado de cada zona y lado que queda al tocarla', () => {
  const rodI = { region: 'rodilla', lado: 'Izquierdo' }, rodD = { region: 'rodilla', lado: 'Derecho' };
  const lumbar = { region: 'lumbar', lado: '' };
  assert.equal(S.estadoZona(rodI, '', ''), 'off');
  assert.equal(S.estadoZona(rodI, 'rodilla', 'Izquierdo'), 'on');
  assert.equal(S.estadoZona(rodD, 'rodilla', 'Izquierdo'), 'off');
  assert.equal(S.estadoZona(rodD, 'rodilla', 'Bilateral'), 'on', 'bilateral marca las dos');
  assert.equal(S.estadoZona(rodD, 'rodilla', ''), 'region', 'región sin lado: las dos a medias');
  assert.equal(S.estadoZona(rodD, 'hombro', 'Derecho'), 'off');
  assert.equal(S.estadoZona(lumbar, 'lumbar', 'Central'), 'on');
  assert.equal(S.estadoZona(lumbar, 'lumbar', ''), 'on');
  // Las dos zonas de una región son casillas
  assert.equal(S.ladoAlTocar(rodI, '', ''), 'Izquierdo');
  assert.equal(S.ladoAlTocar(rodI, 'rodilla', ''), 'Izquierdo', 'región sin lado: marca ese lado');
  assert.equal(S.ladoAlTocar(rodD, 'rodilla', 'Izquierdo'), 'Bilateral', 'el otro lado se añade');
  assert.equal(S.ladoAlTocar(rodI, 'rodilla', 'Bilateral'), 'Derecho', 'tocar uno de bilateral lo quita');
  assert.equal(S.ladoAlTocar(rodI, 'rodilla', 'Izquierdo'), '', 'segundo toque: sin lado');
  assert.equal(S.ladoAlTocar(rodD, 'hombro', 'Bilateral'), 'Derecho', 'otra región: el lado de la zona');
  assert.equal(S.ladoAlTocar(lumbar, 'lumbar', 'Central'), 'Central', 'la misma región de columna conserva el lado');
  assert.equal(S.ladoAlTocar(lumbar, 'rodilla', 'Izquierdo'), '', 'otra región: sin lado');
});

test('silueta: el texto confirma región y lado concordados', () => {
  assert.deepEqual(S.textoElegida('', ''), { principal: 'Toca la región en la silueta', sub: 'Da igual si duele delante o detrás' });
  assert.deepEqual(S.textoElegida('rodilla', 'Izquierdo'), { principal: 'Rodilla (izquierda)', sub: '' });
  assert.deepEqual(S.textoElegida('hombro', 'Derecho'), { principal: 'Hombro (derecho)', sub: '' });
  assert.equal(S.textoElegida('codo', '').sub, 'Lado sin indicar (opcional)');
  assert.deepEqual(S.textoElegida('rodilla', 'Bilateral'), { principal: 'Rodilla (bilateral)', sub: 'Toca un lado para quitarlo' });
  assert.equal(S.textoElegida('lumbar', 'Bilateral').sub, '', 'en la columna no hay dos zonas que quitar');
});

test('silueta: cada zona es un botón con nombre que llama a una función expuesta en window', () => {
  const app = leer('app.js'), html = leer('index.html');
  assert.match(app, /tocarZonaSilueta, elegirSexoSilueta,/);
  for (const [nombre, fig] of Object.entries(SILUETAS)) {
    const h = S.siluetaHTML(fig, nombre);
    const botones = h.match(/<button type="button" class="sil-zona"[^>]*>/g) || [];
    assert.equal(botones.length, fig.zonas.length, nombre);
    for (const b of botones) {
      assert.match(b, /aria-label="[^"]+"/);
      assert.match(b, /onclick="tocarZonaSilueta\('[a-z_]+', '(Izquierdo|Derecho|)'\)"/);
    }
    for (const s of ['Mujer', 'Hombre']) assert.match(h, new RegExp(`data-sexo="${s}" aria-pressed="false" onclick="elegirSexoSilueta\\('${s}'\\)"`));
    assert.match(h, /role="group" aria-labelledby="silSexoEtq"/);
    assert.match(h, new RegExp(`data-figura="${nombre}"`));
    assert.match(h, /react-native-body-highlighter \(licencia MIT\)/);
    for (const z of fig.zonas) assert.ok(html.includes(`class="region-card" data-region="${z.region}"`), `lista: ${z.region}`);
  }
});

test('silueta: data/siluetas.js conserva el aviso de la licencia MIT del dibujo', () => {
  const datos = leer('data', 'siluetas.js');
  assert.match(datos, /Copyright \(c\) 2022 ELABBASSI Hicham/);
  assert.match(datos, /The above copyright notice and this permission notice shall be included/);
});
