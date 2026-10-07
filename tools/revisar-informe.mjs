// Revisa un informe narrativo con IA contra su valoración exportada, con las
// mismas comprobaciones que la tarjeta (lib/revision-informe.js). Herramienta
// de revisión: sirve para calibrar las reglas con informes ya generados.
//   node tools/revisar-informe.mjs <valoracion.json> <informe.txt> [narrativo|breve] [--transcripcion <archivo.txt>]
// El informe puede ser el texto copiado o compartido desde la tarjeta: la
// cabecera local («INFORME DE FISIOTERAPIA», Paciente, Fecha…) y el pie se
// quitan antes de revisar, como en la app (que revisa el texto sin ellos).
import { readFileSync } from 'node:fs';
import '../tests/dom-shim.mjs';
const args = process.argv.slice(2);
const iT = args.indexOf('--transcripcion');
const transcripcion = iT >= 0 ? readFileSync(args.splice(iT, 2)[1], 'utf8') : '';
const [archivo, archivoInforme, plantillaArg] = args;
if (!archivo || !archivoInforme) {
  console.error('Uso: node tools/revisar-informe.mjs <valoracion.json> <informe.txt> [narrativo|breve] [--transcripcion <archivo.txt>]');
  process.exit(1);
}
const { state } = await import('../state.js');
const app = await import('../app.js');
const ia = await import('../informe-ia.js');
const VJ = await import('../lib/valoracion-json.js');
const RI = await import('../lib/revision-informe.js');
const r = VJ.leerImportacion(readFileSync(archivo, 'utf8'));
if (!r.ok) { console.error(r.error); process.exit(1); }
Object.assign(state, r.assessmentState);
await app.precargarFormularioPrevio();   // ver tools/prompt-desde-json.mjs

const texto = RI.quitarCabeceraYPie(readFileSync(archivoInforme, 'utf8'));
// Sin plantilla indicada: la ficha breve tiene sus tres secciones
const plantilla = plantillaArg || (/HALLAZGOS Y CODIFICACI[OÓ]N CIF/i.test(texto) ? 'breve' : 'narrativo');
const puntos = RI.revisarInforme(texto, {
  datos: app.buildPhysiQPayload(), ampliado: ia.construirAmpliado(), plantilla, transcripcion, nombreRegion: app.nombreRegion,
});
console.log(`Plantilla: ${plantilla} · ${puntos.length ? `${puntos.length} puntos a revisar` : 'sin incidencias'}`);
for (const p of puntos) {
  console.log(`\n[${p.nivel.toUpperCase()}] ${p.id}: ${p.mensaje}`);
  if (p.cita) console.log(`   «${p.cita}»`);
}
process.exit(0);
