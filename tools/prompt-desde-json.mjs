// Reproduce el prompt exacto del «🎙 Informe narrativo» a partir de una
// valoración exportada (.json del panel de sesión). Herramienta de revisión.
//   node tools/prompt-desde-json.mjs <valoracion.json> [narrativo|breve] [--audio]
import { readFileSync } from 'node:fs';
import '../tests/dom-shim.mjs';
const [archivo, plantilla = 'narrativo', ...resto] = process.argv.slice(2);
const conAudio = resto.includes('--audio');
const { state } = await import('../state.js');
const app = await import('../app.js');
const ia = await import('../informe-ia.js');
const IN = await import('../lib/informe-narrativo.js');
const VJ = await import('../lib/valoracion-json.js');
const r = VJ.leerImportacion(readFileSync(archivo, 'utf8'));
if (!r.ok) { console.error(r.error); process.exit(1); }
Object.assign(state, r.assessmentState);
const datos = app.buildPhysiQPayload();
console.log(IN.PLANTILLAS[plantilla].prompt(datos, { conAudio, nombreRegion: app.nombreRegion, ampliado: ia.construirAmpliado() }));
