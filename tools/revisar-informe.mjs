// Revisa un informe narrativo con IA contra su valoración exportada, con las
// mismas comprobaciones que la tarjeta (lib/revision-informe.js). Herramienta
// de revisión: sirve para calibrar las reglas con informes ya generados.
//   node tools/revisar-informe.mjs <valoracion.json> <informe.txt> [narrativo|breve] [--transcripcion <archivo.txt>]
// El informe puede ser el texto copiado o compartido desde la tarjeta: la
// cabecera local («INFORME DE FISIOTERAPIA», Paciente, Fecha…) y el pie se
// quitan antes de revisar, como en la app (que revisa el texto sin ellos).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import '../tests/dom-shim.mjs';
const { state } = await import('../state.js');
const app = await import('../app.js');
const ia = await import('../informe-ia.js');
const VJ = await import('../lib/valoracion-json.js');
const RI = await import('../lib/revision-informe.js');
// Estado recién cargado: cada revisión parte de él, para que un campo que una
// valoración exportada no trae (p. ej. `sexo` en las antiguas) no se quede con
// el valor de la anterior cuando tests/unit.js revisa varias en el mismo proceso.
const INICIAL = structuredClone(state);

// → { plantilla, puntos }. Lanza si el .json no es una valoración válida.
export async function revisarArchivos(archivo, archivoInforme, { plantilla: plantillaArg, transcripcion = '' } = {}) {
  const r = VJ.leerImportacion(readFileSync(archivo, 'utf8'));
  if (!r.ok) throw new Error(r.error);
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, structuredClone(INICIAL), r.assessmentState);
  await app.precargarFormularioPrevio();   // ver tools/prompt-desde-json.mjs

  const texto = RI.quitarCabeceraYPie(readFileSync(archivoInforme, 'utf8'));
  // Sin plantilla indicada: la ficha breve tiene sus tres secciones
  const plantilla = plantillaArg || (/HALLAZGOS Y CODIFICACI[OÓ]N CIF/i.test(texto) ? 'breve' : 'narrativo');
  const puntos = RI.revisarInforme(texto, {
    datos: app.buildPhysiQPayload(), ampliado: ia.construirAmpliado(), plantilla, transcripcion, nombreRegion: app.nombreRegion,
  });
  return { plantilla, puntos };
}

export function formatearPuntos({ plantilla, puntos }) {
  let s = `Plantilla: ${plantilla} · ${puntos.length ? `${puntos.length} puntos a revisar` : 'sin incidencias'}\n`;
  for (const p of puntos) {
    s += `\n[${p.nivel.toUpperCase()}] ${p.id}: ${p.mensaje}\n`;
    if (p.cita) s += `   «${p.cita}»\n`;
  }
  return s;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const iT = args.indexOf('--transcripcion');
  const transcripcion = iT >= 0 ? readFileSync(args.splice(iT, 2)[1], 'utf8') : '';
  const [archivo, archivoInforme, plantilla] = args;
  if (!archivo || !archivoInforme) {
    console.error('Uso: node tools/revisar-informe.mjs <valoracion.json> <informe.txt> [narrativo|breve] [--transcripcion <archivo.txt>]');
    process.exit(1);
  }
  try {
    process.stdout.write(formatearPuntos(await revisarArchivos(archivo, archivoInforme, { plantilla, transcripcion })));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  process.exit(0);
}
