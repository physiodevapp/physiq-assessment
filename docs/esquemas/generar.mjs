// Esquemas imprimibles generados desde los datos de la app (no hay textos a mano:
// si cambia data/, se regeneran y no se desfasan).
//
//   node docs/esquemas/generar.mjs [region|todas] [cribado|arbol|confirmacion|todos]
//
// Por defecto: lumbar, todos. Escribe en docs/esquemas/<tipo>-<region>.pdf y .png.
//   cribado      → fase 2, A4 vertical: lo que se pregunta siempre y, aparte, las condiciones especiales
//   arbol        → fase 4, A3 apaisado: pasos del árbol CIF, respuestas e hipótesis que activan
//   arbol-a4     → el mismo árbol en A4 (vertical o apaisado, la distribución con letra más grande), para consultar en papel
//   confirmacion → fase 4b, A4 (vertical o apaisado, la de letra más grande): tests de cada hipótesis con sus LR y si puntúan
//
//   node docs/esquemas/generar.mjs tejidos | condiciones | farmacos | irritabilidad | ejercicio-paciente | sueltas
//   → tejidos-blandos y tejidos-hueso: los tiempos de recuperación de data/tejidos.js en dos A4
//     verticales temáticas (lib/esquemas.js, HOJAS_TEJIDO). También con «todas todos».
//   → condiciones: la guía de condiciones especiales (data/condiciones.js) en un A4 vertical.
//   → farmacos: qué vigilar en el plan por familia (los avisos de la fase 6), dos A4 como máximo.
//   → irritabilidad: la matriz de la fase 3 para marcar en papel, la regla y qué implica cada nivel.
//   → ejercicio-paciente: para dar al paciente, las frases «Para explicárselo al paciente» de cada bloque, sin QR.
//   «sueltas» = todas las que no son de una región.
// Necesita Playwright (como tests/smoke.mjs). Las reglas de LR son las de la app:
// importa lrEfectiva y testPuntua de lib/tests-4b.js (las mismas que usa phase4b.js).
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import '../../tests/dom-shim.mjs';

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const { CIF_TREES } = await import('../../data.js');
const { HOJAS_TEJIDO } = await import('../../lib/esquemas.js');
const { htmlCribado, htmlArbol, htmlConfirmacion, htmlTejidos, htmlCondiciones, htmlFarmacos, htmlIrritabilidad, htmlEjercicioPaciente, hojasImpresas, huellaHoja, rematar } = await import('./hojas.mjs');

const DIR = dirname(fileURLToPath(import.meta.url));
const require = createRequire(process.cwd() + '/');
let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = require('playwright')); }
const hoy = new Date().toLocaleDateString('es-ES');

// Huellas de las hojas impresas (docs/esquemas/huellas.json): se actualizan al generar cada una;
// tests/unit.js falla si no coinciden con los datos, y la guía las compara con la del papel.
const RUTA_HUELLAS = join(DIR, 'huellas.json');
// { clave: { huella, fecha } }: `fecha` (AAAA-MM-DD) es la del último cambio de contenido; regenerar
// sin cambios la deja como estaba. La lee la página «Hojas para imprimir» de la guía.
const HUELLAS = existsSync(RUTA_HUELLAS) ? JSON.parse(readFileSync(RUTA_HUELLAS, 'utf8')) : {};
const HOY_ISO = new Date().toISOString().slice(0, 10);
const fechaCorta = iso => { const [a, m, d] = iso.split('-').map(Number); return `${d}/${m}/${a}`; };   // como toLocaleDateString('es-ES')
const IMPRESAS = Object.fromEntries(hojasImpresas().map(h => [h.clave, h]));
// El HTML final de una hoja: si lleva QR, con su huella (la de su HTML canónico) y la fecha
function rematarHoja(clave, html) {
  const h = IMPRESAS[clave];
  if (!h) return html.replaceAll('<!--FECHA-->', hoy).replaceAll('<!--QR-->', '').replaceAll('<!--HUELLA-->', '');
  const huella = huellaHoja(h.html());
  if (HUELLAS[clave]?.huella !== huella) HUELLAS[clave] = { huella, fecha: HOY_ISO };
  // La fecha impresa es la del último cambio de contenido (la de «Hojas para imprimir»), no la de
  // generación: regenerar sin cambios no la mueve, y el papel y la lista dicen siempre lo mismo
  return rematar(html, { ruta: h.ruta, huella, fecha: fechaCorta(HUELLAS[clave].fecha) });
}
// ── Render ───────────────────────────────────────────────────────────────────
// [generador, apaisado, formato]
const TIPOS = { cribado: [htmlCribado, false, 'A4'], arbol: [htmlArbol, true, 'A3'], 'arbol-a4': [r => htmlArbol(r, { a4: true }), true, 'A4'], confirmacion: [htmlConfirmacion, true, 'A4'] };
const [regArg = 'lumbar', tipoArg = 'todos'] = process.argv.slice(2);
const regiones = regArg === 'todas' ? Object.keys(CIF_TREES) : CIF_TREES[regArg] ? [regArg] : [];
const tipos = tipoArg === 'todos' ? Object.keys(TIPOS) : [tipoArg];

const browser = await chromium.launch();

// Hoja A4 del árbol: prueba A4 apaisado y vertical con 2, 3 o 4 pasos por fila y se queda con la
// que deja la letra más grande; cada página de más resta (una hoja de consulta, cuantas menos, mejor).
const PENALIZA_PAGINA = 0.3;
async function mejorHojaA4(region, generar = (vertical, cols) => htmlArbol(region, { a4: true, vertical, cols }), colsPosibles = [2, 3, 4]) {
  const pruebas = [];
  for (const vertical of [false, true]) for (const cols of colsPosibles) {
    const html = generar(vertical, cols);
    if (!html) continue;
    const page = await browser.newPage({ viewport: vertical ? { width: 794, height: 1123 } : { width: 1123, height: 794 } });
    await page.setContent(`<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body>${html}</body></html>`);
    const { escala, paginas } = await page.evaluate(() => ({ escala: +(document.body.dataset.zmin || document.body.dataset.escala), paginas: document.querySelectorAll('.pagina').length }));
    await page.close();
    pruebas.push({ html, vertical, cols, escala, paginas, nota: escala - PENALIZA_PAGINA * (paginas - 1) });
  }
  const mejor = pruebas.reduce((a, b) => b.nota > a.nota + 0.005 ? b : a);
  if (process.env.DEBUG_A4) for (const p of pruebas) console.log(`   ${p.vertical ? 'vertical' : 'apaisado'} ${p.cols}/fila: ${p.paginas} pág · escala ${p.escala.toFixed(2)}`);
  return { html: mejor.html, apaisado: !mejor.vertical, elegida: ` · ${mejor.vertical ? 'vertical' : 'apaisado'}${colsPosibles.length > 1 ? `, ${mejor.cols} pasos por fila` : ''}` };
}

for (const region of regiones) {
  if (!CIF_TREES[region]) throw new Error(`Región desconocida: ${region}`);
  for (const tipo of tipos) {
    let [fn, apaisado, formato] = TIPOS[tipo];
    let html = fn(region), elegida = '';
    // Cada distribución se mide ya rematada (con el QR), que ocupa sitio en la cabecera
    if (tipo === 'arbol-a4') ({ html, apaisado, elegida } = await mejorHojaA4(region, (vertical, cols) => rematarHoja(`arbol-a4-${region}`, htmlArbol(region, { a4: true, vertical, cols }))));
    if (tipo === 'confirmacion') ({ html, apaisado, elegida } = await mejorHojaA4(region, vertical => rematarHoja(`confirmacion-${region}`, htmlConfirmacion(region, { vertical })), [2]));
    const px = formato === 'A3' ? [1587, 1123] : [1123, 794];
    html = rematarHoja(`${tipo}-${region}`, html);
    const page = await browser.newPage({ viewport: apaisado ? { width: px[0], height: px[1] } : { width: px[1], height: px[0] } });
    await page.setContent(`<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body>${html}</body></html>`);
    const base = join(DIR, `${tipo}-${region}`);
    await page.pdf({ path: `${base}.pdf`, format: formato, landscape: apaisado, printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({ path: `${base}.png`, fullPage: true });
    const paginas = (await page.pdf({ format: formato, landscape: apaisado, preferCSSPageSize: true })).toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length;
    const esc = await page.evaluate(() => document.body.dataset.escala);
    console.log(`${tipo}-${region}: ${paginas} página${paginas === 1 ? '' : 's'}${esc ? ` · escala ${esc}` : ''}${elegida}`);
    await page.close();
  }
}
// Hojas que no son de una región: una página A4 vertical cada una (las de tejidos, dos)
const SUELTAS = {
  tejidos: Object.keys(HOJAS_TEJIDO).map(h => [`tejidos-${h}`, () => htmlTejidos(h)]),
  condiciones: [['condiciones', htmlCondiciones]],
  farmacos: [['farmacos', htmlFarmacos]],
  irritabilidad: [['irritabilidad', htmlIrritabilidad]],
  'ejercicio-paciente': [['ejercicio-paciente', htmlEjercicioPaciente]],
};
for (const [grupo, hojas] of Object.entries(SUELTAS)) {
  if (regArg !== grupo && regArg !== 'sueltas' && !(regArg === 'todas' && tipoArg === 'todos')) continue;
  for (const [clave, fn] of hojas) {
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
    await page.setContent(`<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body>${rematarHoja(clave, fn())}</body></html>`);
    const base = join(DIR, clave);
    await page.pdf({ path: `${base}.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({ path: `${base}.png`, fullPage: true });
    const paginas = (await page.pdf({ format: 'A4', preferCSSPageSize: true })).toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length;
    console.log(`${clave}: ${paginas} página${paginas === 1 ? '' : 's'} · escala ${await page.evaluate(() => document.body.dataset.escala)}`);
    await page.close();
  }
}
await browser.close();
writeFileSync(RUTA_HUELLAS, JSON.stringify(Object.fromEntries(Object.entries(HUELLAS).sort()), null, 2) + '\n');
