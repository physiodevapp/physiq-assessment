// Historial de versiones de cada hoja impresa: docs/esquemas/historial/<clave>.json, una lista
// de versiones (la última, la actual) con lo impreso de cada elemento (elementosHoja(), hojas.mjs).
// Con él la guía dice qué cambió entre la versión del papel (el ?h= del QR) y la actual
// (lib/cambios-hojas.js). Lo escribe generar.mjs al rematar cada hoja; tests/unit.js falla si la
// última versión no es la de huellas.json o no coincide con lo que imprimirían los datos de hoy.
//
//   node docs/esquemas/historial.mjs   → añade la versión actual de cada hoja que aún no la tenga
//     (sin navegador; solo si su huella es la de huellas.json, es decir, si la hoja está generada).
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DIR = join(dirname(fileURLToPath(import.meta.url)), 'historial');
// Versiones que se guardan de cada hoja: un papel más antiguo dice «anterior al registro de cambios»
export const MAX_VERSIONES = 15;
export const rutaHistorial = clave => join(DIR, `${clave}.json`);
export const leerHistorial = clave => (existsSync(rutaHistorial(clave)) ? JSON.parse(readFileSync(rutaHistorial(clave), 'utf8')) : []);

// Añade la versión (si no es ya la última). `elementos` = elementosHoja(html canónico); null en una
// versión antigua de la que solo se sabe la huella (la guía la reconoce, pero no detalla qué cambió).
export function registrarVersion(clave, { huella, fecha }, elementos) {
  const lista = leerHistorial(clave);
  if (lista.at(-1)?.huella === huella) return false;
  lista.push({ huella, fecha, ...(elementos || {}) });
  mkdirSync(DIR, { recursive: true });
  writeFileSync(rutaHistorial(clave), JSON.stringify(lista.slice(-MAX_VERSIONES)) + '\n');
  escribirIndice();
  return true;
}
// historial/indice.json: { huella: clave } de todas las versiones guardadas. La guía lo lee para
// saber de qué hoja es el papel (el ?h= del QR), aunque se haya recargado en otra pestaña.
export const RUTA_INDICE = join(DIR, 'indice.json');
export function indiceHistorial() {
  const indice = {};
  for (const f of readdirSync(DIR).filter(f => f.endsWith('.json') && f !== 'indice.json').sort()) {
    const clave = f.slice(0, -5);
    for (const v of JSON.parse(readFileSync(join(DIR, f), 'utf8'))) indice[v.huella] = clave;
  }
  return Object.fromEntries(Object.entries(indice).sort());
}
// docs/esquemas/cuadernos-historial.json: { huella: { clave, fecha, hojas } } de cada versión de
// cada cuaderno (huella = huellaCuaderno(hojas), la «cuaderno v.» de su portada y el ?c= de su QR).
// Con ella la guía dice exactamente qué hojas de una copia impresa han cambiado. Nunca se recorta:
// un cuaderno impreso hace meses también tiene que reconocerse.
export const RUTA_CUADERNOS_HISTORIAL = join(DIR, '..', 'cuadernos-historial.json');
export const leerCuadernosHistorial = () => (existsSync(RUTA_CUADERNOS_HISTORIAL) ? JSON.parse(readFileSync(RUTA_CUADERNOS_HISTORIAL, 'utf8')) : {});
export function registrarCuaderno(huella, { clave, fecha, hojas }) {
  const h = leerCuadernosHistorial();
  if (h[huella]) return false;
  h[huella] = { clave, fecha, hojas };
  writeFileSync(RUTA_CUADERNOS_HISTORIAL, JSON.stringify(Object.fromEntries(Object.entries(h).sort())) + '\n');
  return true;
}
function escribirIndice() { writeFileSync(RUTA_INDICE, JSON.stringify(indiceHistorial()) + '\n'); }

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { hojasImpresas, huellaHoja, elementosHoja } = await import('./hojas.mjs');
  const HUELLAS = JSON.parse(readFileSync(join(DIR, '..', 'huellas.json'), 'utf8'));
  for (const h of hojasImpresas()) {
    const html = h.html(), huella = huellaHoja(html);
    if (HUELLAS[h.clave]?.huella !== huella) { console.log(`${h.clave}: sin generar (regenera la hoja con generar.mjs)`); continue; }
    if (registrarVersion(h.clave, HUELLAS[h.clave], elementosHoja(html))) console.log(`${h.clave}: v. ${huella}`);
  }
}
