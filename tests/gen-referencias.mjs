'use strict';
// Regenera docs/referencias.md (todas las referencias bibliográficas de data/
// y dónde se usan). tests/unit.js falla si el archivo no está al día: después
// de tocar cualquier `fuente`, `dosisFuente` o `pronostico.fuente` en
// data/<región>.js, o el registro data/referencias.js, ejecuta
// `node tests/gen-referencias.mjs` y comitea el archivo junto con el cambio.
// Lógica en tests/referencias.mjs.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import './dom-shim.mjs';

const datos = await import('../data.js');
const { REFERENCIAS } = await import('../data/referencias.js');
const PLAN_TRATAMIENTO = await import('../data/plan-tratamiento.js');
const IRRITABILIDAD = await import('../data/irritabilidad.js');
const { CONDICIONES } = await import('../data/condiciones.js');
const { FAMILIAS_FARMACO: FARMACOS } = await import('../data/farmacos.js');
const { BLOQUES_EJERCICIO: EJERCICIO } = await import('../data/ejercicio.js');
const { testPuntua } = await import('../phase4b.js');
const { construirReferencias } = await import('./referencias.mjs');

const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'referencias.md');
writeFileSync(outPath, construirReferencias({ ...datos, PLAN_TRATAMIENTO, IRRITABILIDAD, CONDICIONES, FARMACOS, EJERCICIO, REFERENCIAS, testPuntua }));
console.log(`Wrote ${outPath}`);
