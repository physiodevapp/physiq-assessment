// Regenera tests/fixtures/criterios-4b.json: los trozos del `criterio` de
// cada test de la fase 4b (ver tests/criterios.mjs). tests/unit.js falla si
// un trozo ya no está en el criterio ni en `razonamiento.detalle`.
//
// Ejecútalo SOLO después de que `node tests/unit.js` falle en «criterios 4b:
// nada se pierde» y de haber leído cada frase que lista: si la quitaste o la
// reescribiste a propósito (una corrección clínica), regenera; si se perdió
// al mover texto al detalle, vuelve a ponerla. Para retirar una nota de
// mantenimiento (pasa a un comentario en data/), añádela a mano a
// `retiradas` de ese test antes de regenerar: se conserva.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import './dom-shim.mjs';
import { instantanea } from './criterios.mjs';

const { HYPOTHESES } = await import('../data.js');
const ruta = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'criterios-4b.json');
const anterior = existsSync(ruta) ? JSON.parse(readFileSync(ruta, 'utf8')) : {};
const snap = instantanea(HYPOTHESES, anterior);
writeFileSync(ruta, JSON.stringify(snap, null, 1) + '\n');
console.log(`criterios-4b.json: ${Object.keys(snap).length} tests`);
