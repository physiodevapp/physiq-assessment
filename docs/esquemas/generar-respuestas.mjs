// Hojas de respuestas del lector de cuestionarios con foto (respuestas.mjs).
//
//   node docs/esquemas/generar-respuestas.mjs [id|todos]
//
// Escribe docs/esquemas/respuestas/<id>.pdf y .png, y la huella de cada una en
// docs/esquemas/respuestas/huellas.json, { id: { huella, fecha } } como docs/esquemas/huellas.json
// (`fecha`: la del último cambio de contenido; la lee «Hojas para imprimir» de la guía)
// (tests/unit.js falla si no coincide con
// data/cuestionarios.js: al cambiar los ítems de un cuestionario, regenerar su hoja).
// Necesita Playwright, como generar.mjs.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';

const { cuestionariosConHoja, htmlRespuestas, cabeceraRespuestas, pieRespuestas, huellasRespuestas } = await import('./respuestas.mjs');

const DIR = join(dirname(fileURLToPath(import.meta.url)), 'respuestas');
const require = createRequire(process.cwd() + '/');
let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = require('playwright')); }

const arg = process.argv[2] || 'todos';
const defs = cuestionariosConHoja().filter(d => arg === 'todos' || d.id === arg);
if (!defs.length) { console.error(`Sin hoja de respuestas: ${arg} (${cuestionariosConHoja().map(d => d.id).join(', ')})`); process.exit(1); }
mkdirSync(DIR, { recursive: true });

const browser = await chromium.launch();
for (const def of defs) {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.setContent(`<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body>${htmlRespuestas(def)}</body></html>`);
  const base = join(DIR, def.id);
  const pdf = await page.pdf({ path: `${base}.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: cabeceraRespuestas(), footerTemplate: pieRespuestas(def) });
  await page.emulateMedia({ media: 'print' });
  await page.screenshot({ path: `${base}.png`, fullPage: true });
  const paginas = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length;
  console.log(`${def.id}: ${paginas} página${paginas === 1 ? '' : 's'}`);
  await page.close();
}
await browser.close();

const ruta = join(DIR, 'huellas.json');
const guardadas = existsSync(ruta) ? JSON.parse(readFileSync(ruta, 'utf8')) : {};
const actuales = huellasRespuestas();
const hoy = new Date().toISOString().slice(0, 10);
for (const d of defs) if (guardadas[d.id]?.huella !== actuales[d.id]) guardadas[d.id] = { huella: actuales[d.id], fecha: hoy };
writeFileSync(ruta, JSON.stringify(Object.fromEntries(Object.entries(guardadas).filter(([k]) => k in actuales).sort()), null, 2) + '\n');
