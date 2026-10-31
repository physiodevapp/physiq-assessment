// Guía de consulta (guia.html + guia.js), su estructura compartida con los esquemas
// impresos (lib/esquemas.js) y el QR de cada hoja (docs/esquemas/qr.mjs).
// Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, CIF_TREES, HYPOTHESES } from './comun.mjs';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const ESQ = await import('../../lib/esquemas.js');
const T4B = await import('../../lib/tests-4b.js');
const ARBOL = await import('../../lib/arbol.js');
const P4B = await import('../../phase4b.js');
const P4 = await import('../../phase4.js');
const { qrMatriz } = await import('../../docs/esquemas/qr.mjs');
const { dolorInespecifico } = await import('../../lib/region.js');
const { TIEMPOS_TEJIDO } = await import('../../data/tejidos.js');
const HOJAS = await import('../../docs/esquemas/hojas.mjs');
const COND_DATOS = await import('../../data/condiciones.js');
const COND_LIB = await import('../../lib/condiciones.js');
const FARM = await import('../../data/farmacos.js');
const FARM_P = await import('../../data/farmacos-paciente.js');
const FARM_L = await import('../../lib/farmacos.js');
const IRR_DATOS = await import('../../data/irritabilidad.js');
const IRR_LIB = await import('../../lib/irritabilidad.js');
const EJ = await import('../../data/ejercicio.js');
const REGION_LIB = await import('../../lib/region.js');

console.log('\nguía de consulta (guia.js, lib/esquemas.js, QR de los esquemas)');

const importsDe = src => [...src.matchAll(/^import\s[^;]*?from\s+'([^']+)'|^import\s+'([^']+)'/gm)].map(m => m[1] || m[2]);

test('la guía solo carga módulos puros: nunca app.js, state.js ni phase4*.js (no puede tocar al paciente)', () => {
  const imp = importsDe(leer('guia.js'));
  assert.ok(imp.length > 0);
  for (const m of imp) assert.ok(!/\/(app|state|phase4b?)\.js$/.test(m), m);
  for (const f of ['lib/esquemas.js', 'lib/tests-4b.js', 'lib/arbol.js'])
    for (const m of importsDe(leer(f))) assert.ok(!/\/(app|state|phase4b?)\.js$/.test(m), `${f}: ${m}`);
  for (const f of ['guia.js', 'guia-calc.js']) assert.ok(!/localStorage\.setItem|indexedDB|BroadcastChannel/.test(leer(f)), `${f}: la guía no guarda nada`);
  for (const m of importsDe(leer('guia-calc.js'))) assert.ok(!/\/(app|state|phase4b?)\.js$/.test(m), `guia-calc.js: ${m}`);
  // Lo único que guarda: tema y tamaño de letra, por lib/apariencia.js (preferencias de pantalla, compartidas con la app)
  const ap = leer('lib', 'apariencia.js');
  assert.deepEqual([...ap.matchAll(/localStorage\.setItem\((\w+)/g)].map(m => m[1]).sort(), ['LETRA_KEY', 'THEME_KEY']);
  assert.ok(!/indexedDB|BroadcastChannel|import /.test(ap), 'apariencia.js no importa nada ni toca la sesión');
});

test('se despliega: guia.html, guia.js y todo lo que importan están en deploy-to-hub.yml', () => {
  const deploy = leer('.github', 'workflows', 'deploy-to-hub.yml');
  for (const f of ['guia.html', 'guia.js', 'guia-calc.js', 'lib/esquemas.js', 'lib/tests-4b.js', 'lib/arbol.js', 'lib/version.js', 'lib/region.js', 'lib/citas.js', 'ampliar-ia.js', 'ficha.js'])
    assert.ok(deploy.includes(f), f);
  assert.ok(leer('guia.html').includes('src="./guia.js"'));
});

test('phase4b.js y phase4.js reexportan lo que pasó a lib/ (los demás módulos no cambian)', () => {
  for (const k of ['LR_POS_MIN', 'LR_NEG_MAX', 'parseProporcion', 'parseLR', 'lrEfectiva', 'testPuntua', 'PESO_TEST', 'pesoTest', 'enlacesAnatomia', 'anatomiaLineaHTML', 'anatomiaPanelHTML', 'citasTest', 'calcLRScore', 'etiquetaHipHTML'])
    assert.equal(P4B[k], T4B[k], k);
  assert.equal(P4.resolveOptionTargets, ARBOL.resolveOptionTargets);
});

test('cribado de la guía y de la hoja: mismas preguntas, mismo orden; solo las de la región', () => {
  for (const region of Object.keys(CIF_TREES)) {
    const { siempre, especiales } = ESQ.sistemasCribado(SYSTEMIC_SCREENING, region);
    assert.equal(siempre.length + especiales.length, SYSTEMIC_SCREENING[region].sistemas.length, region);
    assert.ok(siempre.every(s => !ESQ.soloDeSistema(s)) && especiales.every(s => ESQ.soloDeSistema(s)), region);
    for (const s of [...siempre, ...especiales])
      for (const q of ESQ.preguntasDeRegion(s, region)) assert.ok(!q.regiones || q.regiones.includes(region), `${region} ${q.id}`);
  }
  // Toda condición «solo» de un sistema tiene su texto
  const solos = new Set(Object.values(SYSTEMIC_SCREENING).flatMap(r => r.sistemas.flatMap(s => Object.keys(s).filter(k => k.startsWith('solo')))));
  for (const k of solos) assert.ok(ESQ.CONDICION_SISTEMA[k], k);
});

test('cada paso del árbol tiene etiqueta única en su región (la de la hoja y la guía)', () => {
  for (const [region, tree] of Object.entries(CIF_TREES)) {
    const etq = tree.steps.map((s, i) => ESQ.etiquetaPaso(s, i));
    assert.equal(new Set(etq).size, etq.length, `${region}: ${etq}`);
  }
});

test('las direcciones del QR: #región/hoja que la guía entiende, de las 7 regiones', () => {
  const guia = leer('guia.js');
  for (const r of Object.keys(CIF_TREES)) for (const h of Object.keys(ESQ.HOJAS_GUIA)) {
    const u = ESQ.urlGuia(r, h);
    assert.ok(u.startsWith(ESQ.URL_GUIA + '#'), u);
    assert.equal(u.split('#')[1], `${r}/${h}`);
  }
  for (const h of Object.keys(ESQ.HOJAS_GUIA)) assert.ok(new RegExp(`\\b${h}: html`).test(guia), `la guía pinta «${h}»`);
  assert.equal(ESQ.URL_GUIA, 'https://physiodevapp.github.io/physiq/assessment/guia.html');
  // Anclas de cada elemento: las mismas ids que pinta la guía
  assert.ok(guia.includes('id="q-${q.id}"') && guia.includes('id="paso-${st.id}"') && guia.includes('id="test-${h.id}-${k}"'));
});

test('QR: tamaño por versión, buscadores en tres esquinas y siempre la misma matriz', () => {
  const buscador = (m, x, y) => [0, 6].every(d => m[y][x + d] && m[y + d][x]) && m[y + 3][x + 3] && !m[y + 1][x + 1];
  for (const [texto, lado] of [['A', 21], ['x'.repeat(60), 33], [ESQ.urlGuia('tobillo_pie', 'confirmacion'), 37]]) {
    const m = qrMatriz(texto), n = m.length;
    assert.equal(n, lado, texto.slice(0, 20));
    assert.ok(buscador(m, 0, 0) && buscador(m, n - 7, 0) && buscador(m, 0, n - 7), 'buscadores');
    assert.ok(m[n - 8][8], 'módulo oscuro fijo');
    assert.deepEqual(qrMatriz(texto), m);
  }
  assert.throws(() => qrMatriz('x'.repeat(300)));
});

test('sin hipótesis al final del árbol: un solo nombre por región en la 4b, la fase 5, la guía y los esquemas', () => {
  assert.equal(dolorInespecifico('lumbar'), 'dolor lumbar inespecífico');
  assert.equal(dolorInespecifico('cervical'), 'dolor cervical inespecífico');
  assert.equal(dolorInespecifico('hombro'), 'dolor de hombro inespecífico');
  assert.equal(dolorInespecifico('tobillo_pie'), 'dolor de tobillo y pie inespecífico');
  for (const f of ['phase4b.js', 'app.js', 'guia.js', 'docs/esquemas/hojas.mjs']) {
    const src = leer(...f.split('/'));
    assert.ok(src.includes('dolorInespecifico('), f);
    assert.ok(!/[Dd]olor (de )?\$\{[^}]*\} inespecífico/.test(src), `${f}: compone el nombre a mano`);
  }
});

test('hojas de tiempos de tejido: cada grupo de data/tejidos.js va en una sola de las dos hojas, y el QR abre su página en la guía', () => {
  const todos = Object.values(ESQ.HOJAS_TEJIDO).flatMap(h => h.grupos);
  assert.deepEqual([...todos].sort(), TIEMPOS_TEJIDO.grupos.map(g => g.id).sort(), 'un grupo nuevo necesita su hoja (lib/esquemas.js, HOJAS_TEJIDO)');
  assert.equal(new Set(todos).size, todos.length);
  for (const k of Object.keys(ESQ.HOJAS_TEJIDO)) {
    const d = ESQ.datosHojaTejido(TIEMPOS_TEJIDO, k);
    assert.deepEqual(d.grupos.map(g => g.id), ESQ.HOJAS_TEJIDO[k].grupos);
    assert.equal(d.columnas, TIEMPOS_TEJIDO.columnas);
    assert.ok(ESQ.urlTejidos(k).endsWith(`guia.html#tejidos/${k}`));
    assert.ok(qrMatriz(ESQ.urlTejidos(k)).length > 0);
  }
  const deploy = leer('.github', 'workflows', 'deploy-to-hub.yml');
  for (const f of ['lib/tejidos.js', 'data/']) assert.ok(deploy.includes(f), f);
});

test('hojas impresas al día: docs/esquemas/huellas.json coincide con lo que imprimirían los datos de hoy', () => {
  const H = HOJAS;
  const guardadas = JSON.parse(leer('docs', 'esquemas', 'huellas.json'));
  const actuales = H.huellasActuales();
  const desfasadas = Object.keys(actuales).filter(k => guardadas[k]?.huella !== actuales[k]);
  for (const [k, v] of Object.entries(guardadas)) assert.match(v.fecha || '', /^\d{4}-\d{2}-\d{2}$/, `${k}: fecha del último cambio`);
  assert.deepEqual(desfasadas, [], `Hojas desfasadas: ${desfasadas.join(', ')}. Regenera con «node docs/esquemas/generar.mjs todas todos» (o la región y el tipo) y sube los PDF, los PNG y huellas.json`);
  assert.deepEqual(Object.keys(guardadas).sort(), Object.keys(actuales).sort(), 'huellas.json tiene hojas que ya no existen');
  // La huella no depende de la fecha ni del QR (marcadores), solo de lo impreso
  const h = H.hojasImpresas()[0];
  const final = H.rematar(h.html(), { ruta: h.ruta, huella: actuales[h.clave], fecha: '1/1/2000' });
  assert.ok(!final.includes('<!--') || !/<!--(QR|HUELLA|FECHA)-->/.test(final));
  assert.ok(final.includes(`v. ${actuales[h.clave]}`));
  assert.equal(ESQ.urlGuia('lumbar', 'cribado', 'abc12345'), `${ESQ.URL_GUIA}?h=abc12345#lumbar/cribado`);
  assert.equal(ESQ.urlTejidos('hueso', 'abc12345'), `${ESQ.URL_GUIA}?h=abc12345#tejidos/hueso`);
  const deploy = leer('.github', 'workflows', 'deploy-to-hub.yml');
  assert.ok(deploy.includes('docs/esquemas/huellas.json') && deploy.includes('docs/esquemas/*.pdf'), 'huellas y PDF se despliegan para la guía');
});

test('hoja y página de condiciones especiales: todas las filas de data/condiciones.js, sin estado del paciente en la guía', () => {
  const { CONDICIONES } = COND_DATOS;
  const html = HOJAS.htmlCondiciones();
  for (const c of CONDICIONES) assert.ok(html.includes(c.nombre.replace(/&/g, '&amp;')), c.nombre);
  assert.ok(!/cardMecanismo|cardLupus/.test(html), 'dónde se marca: el título de la tarjeta, no su id');
  const guia = COND_LIB.condicionesHTML({ mecanismo: 'Post-quirúrgico', lupus: { estado: 'diagnosticado' } }, { guia: true });
  assert.ok(!guia.includes('cond-estado') && !guia.includes('irACondicion'), 'la guía no tiene paciente: sin etiqueta ni botón');
  assert.equal((guia.match(/class="cond-fila"/g) || []).length, CONDICIONES.length);
  assert.ok(COND_LIB.condicionesHTML({ mecanismo: 'Post-quirúrgico' }).includes('cond-estado-on'), 'la app sigue igual');
  assert.ok(HOJAS.hojasImpresas().some(h => h.clave === 'condiciones' && h.ruta === 'condiciones'));
});

test('hoja de fármacos: cada familia escrita con sus ejemplos y todas las frases de su aviso de la fase 6, literales', () => {
  const html = HOJAS.htmlFarmacos();
  const escH = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  for (const f of FARM.FAMILIAS_FARMACO.filter(x => x.apartados)) {
    assert.ok(html.includes(escH(f.nombre)) && html.includes(escH(f.ejemplos)), f.id);
    for (const frase of FARM_P.FAMILIAS_PACIENTE[f.id]?.plan || []) assert.ok(html.includes(escH(frase)), `${f.id}: ${frase.slice(0, 40)}`);
  }
  assert.ok(HOJAS.hojasImpresas().some(h => h.clave === 'farmacos' && h.ruta === 'farmacos'));
  assert.ok(!/onclick=/.test(FARM_L.farmacosHTML()) || FARM_L.familiasPendientes().length > 0, 'en la guía no queda ningún botón de la app');
});

test('hoja de irritabilidad: la matriz de data/irritabilidad.js, la misma regla que la guía y lo que implica cada nivel', () => {
  const html = HOJAS.htmlIrritabilidad();
  const { ITEMS_IRRITABILIDAD, TEXTOS_IRRITABILIDAD: T } = IRR_DATOS;
  for (const it of ITEMS_IRRITABILIDAD) for (const o of it.opciones) assert.ok(html.includes(o.valor), o.valor);
  for (const p of IRR_LIB.reglaIrritabilidad()) assert.ok(html.includes(p), p.slice(0, 30));
  for (const k of ['hastaLimite', 'hastaDolor', 'alta', 'margen']) assert.ok(html.includes(T[k]), k);
  assert.ok(leer('guia.js').includes('reglaIrritabilidad()'), 'la guía usa la misma regla');
  assert.ok(HOJAS.hojasImpresas().some(h => h.clave === 'irritabilidad' && h.ruta === 'irritabilidad'));
});

const F1 = await import('../../data/fase1.js');
const CALC = await import('../../guia-calc.js');
test('fase 1: los textos de data/fase1.js son los de la app (index.html), y la hoja y la guía los llevan todos', () => {
  const index = leer('index.html');
  const T = F1.TEXTOS_FASE1;
  for (const b of F1.BANDERAS_FASE1) assert.ok(index.includes(`>${b.texto}<`) && index.includes(`'${b.id}'`), b.id);
  for (const k of ['banderasAviso', 'psicoIntro', 'psicoAlto']) assert.ok(index.includes(T[k]), k);
  assert.ok(index.includes(T.banderaAlerta.replace(/^Bandera Roja Detectada\.\s*/, '')), 'banderaAlerta');
  for (const p of F1.PREGUNTAS_PSICO) assert.ok(index.includes(p.texto) && index.includes(`id="${p.id}"`), p.id);
  for (const n of F1.NIVELES_PSICO) assert.ok(index.includes(`selectPsico(this, '${n.valor}')`), n.valor);
  const hoja = HOJAS.htmlFase1(), guia = CALC.htmlFase1();
  for (const b of F1.BANDERAS_FASE1) { assert.ok(hoja.includes(b.texto), b.id); assert.ok(guia.includes(b.texto), b.id); }
  for (const p of F1.PREGUNTAS_PSICO) assert.ok(hoja.includes(p.texto) && hoja.includes(p.cuestionarios), p.id);
  assert.ok(HOJAS.hojasImpresas().some(h => h.clave === 'fase1' && h.ruta === 'fase1'));
  assert.equal(ESQ.HOJAS_GENERALES[0], 'fase1');
  assert.ok(/fase1: \{ titulo:/.test(leer('guia.js')), 'página #fase1 en la guía');
});

test('calculadoras de la guía: usan las reglas de la app y salen en el bloque de su condición', () => {
  const src = leer('guia-calc.js');
  for (const f of ['resultadoHAG(', 'reglaVascular(', 'resultadoPrueba(', 'reglaTA(']) assert.ok(src.includes(f), f);
  assert.deepEqual(Object.keys(CALC.CALC_SISTEMA).sort(), ['transversal_disautonomia', 'transversal_embarazo', 'transversal_hipermovilidad']);
  for (const id of Object.keys(CALC.CALC_SISTEMA)) assert.ok(SYSTEMIC_SCREENING.lumbar.sistemas.some(s => s.id === id), id);
  assert.ok(CALC.calcHipermovilidadHTML().includes('Beighton') && CALC.calcDisautonomiaHTML().includes('FC') && CALC.calcEmbarazoHTML().includes('TAS'));
});

test('número de hipótesis: la hoja y la guía pintan la cifra, nunca el carácter rodeado (ilegible desde el 10)', () => {
  assert.deepEqual(['①', '⑨', '⑩', '⑳', '㉑', '㉟', '㊱', '㊿', '', undefined].map(ESQ.numeroHipotesis), ['1', '9', '10', '20', '21', '35', '36', '50', '', '']);
  for (const h of Object.values(HYPOTHESES)) if (h.num) assert.match(ESQ.numeroHipotesis(h.num), /^\d+$/, `${h.id}: ${h.num}`);
  for (const r of Object.keys(CIF_TREES)) assert.ok(!/class="num">[\u2460-\u2473\u3251-\u325F\u32B1-\u32BF]/.test(HOJAS.htmlConfirmacion(r)), r);
});

test('orden anatómico de las regiones en papel y guía: las mismas que CIF_TREES, de arriba abajo', () => {
  assert.deepEqual([...ESQ.ORDEN_REGIONES].sort(), Object.keys(CIF_TREES).sort());
  assert.deepEqual(ESQ.ORDEN_REGIONES, ['cervical', 'hombro', 'codo', 'lumbar', 'cadera', 'rodilla', 'tobillo_pie']);
  const comp = ESQ.definicionCuadernos(ESQ.ORDEN_REGIONES, REGION_LIB.nombreRegion).find(l => l.clave === 'cuaderno-completo');
  assert.deepEqual(comp.secciones.slice(1).map(s => s.hojas[0]), ESQ.ORDEN_REGIONES.map(r => `cribado-${r}`));
  assert.ok(leer('guia.js').includes('const REGIONES = ORDEN_REGIONES'));
});

test('las hojas remiten a la guía (QR), no a la app, para lo que la guía ya tiene', () => {
  for (const r of Object.keys(CIF_TREES)) {
    assert.ok(!/están en la app|en la app\./.test(HOJAS.htmlCribado(r)), `cribado-${r}`);
    assert.ok(!/en la app\./.test(HOJAS.htmlConfirmacion(r)), `confirmacion-${r}`);
  }
  const cond = HOJAS.htmlCondiciones();
  assert.ok(!cond.includes('la app añade lo que necesita.') && cond.includes('En papel:'));
});

test('hoja de ejercicio para el paciente: todas las frases «Para explicárselo al paciente», literales, con título llano y sin QR', () => {
  const html = HOJAS.htmlEjercicioPaciente();
  const escH = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  for (const b of EJ.BLOQUES_EJERCICIO.filter(x => x.apartados?.paciente?.length)) {
    assert.ok(b.tituloPaciente && ['general', 'condicion'].includes(b.hojaPaciente), `${b.id}: título para el paciente y parte de la hoja`);
    assert.ok(html.includes(escH(b.tituloPaciente)), b.id);
    for (const f of b.apartados.paciente) assert.ok(html.includes(escH(f.t)), `${b.id}: ${f.t.slice(0, 40)}`);
  }
  const h = HOJAS.hojasImpresas().find(x => x.clave === 'ejercicio-paciente');
  assert.ok(h && h.ruta === null);
  const final = HOJAS.rematar(h.html(), { ruta: h.ruta, huella: 'abcd1234', fecha: '1/1/2000' });
  assert.ok(!final.includes('<svg') && final.includes('v. abcd1234'), 'sin QR, con su versión');
  assert.ok(leer('guia.js').includes("'ejercicio-paciente'"), 'listada en «Hojas para imprimir»');
});

test('guía, confirmación: cada hipótesis con su pauta y su pronóstico de data/, y la derivación siempre a la vista', () => {
  const src = leer('guia.js');
  assert.ok(src.includes('pautaHipHTML(h, region)') && src.includes('DOSIS_DERIVAR') && src.includes('TEXTO_PAUTA_COMPATIBLE'));
  assert.ok(/if \(h\.dosis === DOSIS_DERIVAR\) return `<div class="guia-urg">/.test(src), 'la derivación no va plegada');
});

test('la fecha impresa en las hojas es la de su último cambio de contenido (huellas.json), no la de generación', () => {
  const g = leer('docs', 'esquemas', 'generar.mjs');
  assert.ok(/fecha: fechaCorta\(HUELLAS\[clave\]\.fecha\)/.test(g));
});

test('cuadernos a doble cara al día: docs/esquemas/cuadernos.json lleva la versión actual de cada hoja que contienen', () => {
  const { nombreRegion } = REGION_LIB;
  const huellas = JSON.parse(leer('docs', 'esquemas', 'huellas.json'));
  const cuadernos = JSON.parse(leer('docs', 'esquemas', 'cuadernos.json'));
  const def = ESQ.definicionCuadernos(ESQ.ORDEN_REGIONES, nombreRegion);
  assert.deepEqual(Object.keys(cuadernos).sort(), def.map(l => l.clave).sort(), 'un cuaderno por definición (completo y uno por región)');
  for (const l of def) {
    const d = cuadernos[l.clave];
    const claves = l.secciones.flatMap(s => s.hojas);
    assert.deepEqual(Object.keys(d.hojas), claves, `${l.clave}: mismas hojas y en el mismo orden`);
    const desfasadas = claves.filter(k => d.hojas[k] !== huellas[k]?.huella);
    assert.deepEqual(desfasadas, [], `${l.clave}: hojas cambiadas sin regenerar el cuaderno (${desfasadas.join(', ')}). Regenera con «node docs/esquemas/generar.mjs cuadernos»`);
    assert.equal(d.paginas % 2, 0, `${l.clave}: número par de páginas (doble cara)`);
    const pdf = readFileSync(new URL(`../../docs/esquemas/${l.clave}.pdf`, import.meta.url));
    assert.equal(d.archivo, createHash('sha256').update(pdf).digest('hex').slice(0, 8), `${l.clave}: «archivo» es la huella del PDF guardado (el enlace de la guía la usa para no abrir una copia vieja)`);
    // Navegación (paginar.py): un enlace por fila del índice de la portada y marcadores del visor
    const texto = pdf.toString('latin1');
    assert.equal((texto.match(/\/Subtype \/Link/g) || []).length, claves.length, `${l.clave}: un enlace por hoja en el índice de la portada`);
    assert.ok(/\/Outlines/.test(texto) && /\/PageMode \/UseOutlines/.test(texto), `${l.clave}: con marcadores (sección → hoja)`);
    assert.ok(!claves.includes('ejercicio-paciente'), 'la hoja del paciente va aparte');
    // Colocación: en qué página empieza cada hoja (para los enlaces del índice y los marcadores). Cada hoja empieza
    // en impar y ocupa sus páginas redondeadas a par; tiene que cuadrar con los PDF de las hojas.
    assert.deepEqual(Object.keys(d.inicio || {}), claves, `${l.clave}: «inicio» de cada hoja, en orden. Regenera con «node docs/esquemas/generar.mjs cuadernos»`);
    let esperada = 3;
    for (const k of claves) {
      assert.equal(d.inicio[k], esperada, `${l.clave}: ${k} empieza en la página ${esperada} (regenera los cuadernos)`);
      const n = (readFileSync(new URL(`../../docs/esquemas/${k}.pdf`, import.meta.url)).toString('latin1').match(/\/Type\s*\/Page(?![s])/g) || []).length;
      esperada += n + (n % 2);
    }
    assert.equal(d.paginas, esperada - 1, `${l.clave}: páginas totales`);
    assert.match(d.ordenFecha || '', /^\d{4}-\d{2}-\d{2}$/, `${l.clave}: fecha del orden de hojas`);
    assert.ok(!('paginasPor' in d) && !('paginasFecha' in d), `${l.clave}: sin los campos de la numeración absoluta`);
  }
  assert.ok(leer('.github', 'workflows', 'deploy-to-hub.yml').includes('docs/esquemas/cuadernos.json'));
});

test('guía, fármacos: «¿Otro fármaco o duda?» usa el modo «Fármacos» de la app y no guarda el destino', () => {
  const src = leer('guia.js');
  assert.ok(src.includes("promptPregunta({ pregunta: q, tipo: 'farmacos' })") && src.includes('preguntaFarmacosHTML()'));
  assert.ok(!src.includes('guardarDestinoIA'), 'la guía no guarda nada');
});
