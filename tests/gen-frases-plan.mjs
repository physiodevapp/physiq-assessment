// Regenera docs/plan-tratamiento-frases.md (textos de la fase 6 para revisar).
// tests/unit.js falla si no está al día: después de tocar data/plan-tratamiento.js
// ejecuta `node tests/gen-frases-plan.mjs` y comitea el archivo con el cambio.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const D = await import('../data/plan-tratamiento.js');
const P = await import('../lib/plan-tratamiento.js');
const { construirFrases } = await import('./frases-plan.mjs');

const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'plan-tratamiento-frases.md');
writeFileSync(outPath, construirFrases(D, P));
console.log(`Wrote ${outPath}`);
