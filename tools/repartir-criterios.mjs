// Fase H (docs/razonamiento-tests.md), fase 1 de una región: repartir el
// `criterio` de cada test entre lo visible y `razonamiento.detalle`, sin
// reescribir nada. No lo carga la app.
//
//   node tools/repartir-criterios.mjs listar <región> [min]
//     Lista, por test con criterio de ≥ min caracteres (200 por defecto), sus
//     trozos numerados (cortados como en tests/criterios.mjs).
//
//   node tools/repartir-criterios.mjs aplicar <región> <plan.json>
//     plan = { "<hipótesis>#<índice>": { "k": [visibles], "r": [notas de mantenimiento], "x": [repiten «cuánto pesa»] } }
//     Los trozos que no están en k, r ni x van a razonamiento.detalle. En cada
//     salto entre trozos no consecutivos cierra la frase con punto y empieza
//     la siguiente en mayúscula. Los de r pasan a un comentario «Nota de
//     mantenimiento» encima del test y a `retiradas` de
//     tests/fixtures/criterios-4b.json. Los de x (frases que solo repiten el
//     veredicto que ya genera pesoTest()) van a `retiradas`, sin comentario.
//     Solo toca tests sin razonamiento.
//
// Después: node tests/unit.js («criterios 4b: nada se pierde»),
// node tests/gen-referencias.mjs y node tests/smoke.mjs.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import '../tests/dom-shim.mjs';
import { trozos } from '../tests/criterios.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const { HYPOTHESES } = await import('../data.js');
const [modo, region, arg] = process.argv.slice(2);
if (!['listar', 'aplicar'].includes(modo) || !region) {
  console.error('Uso: node tools/repartir-criterios.mjs listar <región> [min] | aplicar <región> <plan.json>');
  process.exit(1);
}

if (modo === 'listar') {
  const min = Number(arg || 200);
  for (const [hId, h] of Object.entries(HYPOTHESES)) {
    if (h.region !== region) continue;
    h.tests.forEach((t, i) => {
      if ((t.criterio || '').length < min || t.razonamiento) return;
      console.log(`\n== ${hId}#${i} ${t.name} [${t.criterio.length}]`);
      trozos(t.criterio).forEach((c, j) => console.log(`  ${j}) ${c}`));
    });
  }
  process.exit(0);
}

const esc = s => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
function unir(ch, idxs) {
  let out = '', prev = null;
  for (const i of idxs) {
    let c = ch[i];
    if (prev === null) c = cap(c);
    else if (i !== prev + 1) { out = out.replace(/[;:,]$/, '.') + ' '; c = cap(c); }
    else out += ' ';
    out += c; prev = i;
  }
  return out.replace(/[;:,]$/, '.');
}

const plan = JSON.parse(readFileSync(arg, 'utf8'));
const archivo = join(raiz, 'data', `${region}.js`);
const rutaFx = join(raiz, 'tests', 'fixtures', 'criterios-4b.json');
let src = readFileSync(archivo, 'utf8');
const fx = JSON.parse(readFileSync(rutaFx, 'utf8'));
for (const [clave, p] of Object.entries(plan)) {
  const [hId, idx] = clave.split('#');
  const t = HYPOTHESES[hId]?.tests[+idx];
  if (!t || HYPOTHESES[hId].region !== region) throw new Error(`${clave}: no es un test de ${region}`);
  if (t.razonamiento) throw new Error(`${clave}: ya tiene razonamiento`);
  const ch = trozos(t.criterio);
  const r = p.r || [], x = p.x || [];
  const det = ch.map((_, i) => i).filter(i => !p.k.includes(i) && !r.includes(i) && !x.includes(i));
  const nuevo = unir(ch, p.k);
  const detalle = det.length ? unir(ch, det) : '';
  const viejo = `criterio: '${esc(t.criterio)}'`;
  if (src.split(viejo).length !== 2) throw new Error(`${clave}: criterio no encontrado una sola vez en ${archivo}`);
  src = src.replace(viejo, `criterio: '${esc(nuevo)}'` + (detalle ? `, razonamiento: { detalle: '${esc(detalle)}' }` : ''));
  if (r.length) {
    const pos = src.indexOf(`criterio: '${esc(nuevo)}'`);
    const ini = src.lastIndexOf('\n', pos) + 1;
    const sangria = src.slice(ini).match(/^\s*/)[0];
    src = src.slice(0, ini) + `${sangria}// Nota de mantenimiento, retirada del criterio visible: «${r.map(i => ch[i]).join(' ')}»\n` + src.slice(ini);
    const k = `${hId}|${t.name}`;
    fx[k].retiradas = [...(fx[k].retiradas || []), ...r.map(i => ch[i])];
  }
  if (x.length) {
    const k = `${hId}|${t.name}`;
    fx[k].retiradas = [...(fx[k].retiradas || []), ...x.map(i => ch[i])];
  }
}
writeFileSync(archivo, src);
writeFileSync(rutaFx, JSON.stringify(fx, null, 1) + '\n');
console.log(`${Object.keys(plan).length} tests repartidos en data/${region}.js`);
