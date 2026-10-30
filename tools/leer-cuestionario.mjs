// Mide el lector de cuestionarios con foto (lib/lector-cuestionarios.js;
// docs/lector-cuestionarios.md) con hojas de respuestas reales fotografiadas con
// el móvil: pasa cada foto por el modelo y compara lo leído con las respuestas
// correctas anotadas a mano (tests/fixtures/cuestionarios-foto/<caso>.json).
// Herramienta de medición: la app no la carga. Llama a la API de Anthropic
// directamente (no al worker, que pide Turnstile).
//
//   ANTHROPIC_API_KEY=… node tools/leer-cuestionario.mjs --fotos <carpeta> [--modelo haiku|sonnet|opus|todos]
//        [--veces N] [--caso <nombre>] [--cuestionario <id>] [--lado px] [--esfuerzo low|medium|high] [--guardar]
//   node tools/leer-cuestionario.mjs --respuestas        # sin API: puntúa las lecturas guardadas
//   node tools/leer-cuestionario.mjs --clave-por-proxy …  # la cabecera x-api-key la añade el proxy del entorno
//   node tools/leer-cuestionario.mjs --comprobar          # solo valida los archivos de respuestas correctas
//   … --casos <carpeta>                                   # otra carpeta de casos (por defecto, la de fixtures)
//
// Las fotos NO entran en el repo (decisión del usuario, 2026-10): fotografían el
// texto de cuestionarios con licencia junto a la hoja, y pueden llevar letra,
// caras o metadatos. Se pasan con --fotos; cada caso nombra las suyas.
// Antes de enviarla, cada foto se reduce a --lado px de lado largo (por defecto
// LADO_FOTO) y se vuelve a codificar en JPEG con Chromium, como lo haría la app:
// sale sin EXIF y con la orientación aplicada.
// --veces N (por defecto 3) pasa cada foto N veces; el veredicto usa la peor pasada.
// --guardar escribe cada lectura en tests/fixtures/cuestionarios-foto/lecturas/<caso>.<modelo>.<n>.json;
// --respuestas vuelve a puntuarlas sin gastar.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const AQUI = dirname(fileURLToPath(import.meta.url));
const { CUESTIONARIOS } = await import('../data/cuestionarios.js');
const LC = await import('../lib/lector-cuestionarios.js');

// Generación actual (precios por millón de tokens, entrada y salida, a 2026-10)
const MODELOS = { haiku: 'claude-haiku-5-5', sonnet: 'claude-sonnet-5-5', opus: 'claude-opus-5-5' };
const PRECIO = { haiku: [0.10, 0.50], sonnet: [2, 10], opus: [4, 20] };
const MAX_TOKENS = 16000;

const args = process.argv.slice(2);
const opcion = (nombre, porDefecto) => { const i = args.indexOf(nombre); return i >= 0 ? args[i + 1] : porDefecto; };
const soloRespuestas = args.includes('--respuestas');
const soloComprobar = args.includes('--comprobar');
const guardar = args.includes('--guardar');
const porProxy = args.includes('--clave-por-proxy');
const clave = process.env.ANTHROPIC_API_KEY;
const modeloArg = opcion('--modelo', 'todos');
const modelos = modeloArg === 'todos' ? Object.keys(MODELOS) : modeloArg.split(',');
if (modelos.some(m => !MODELOS[m])) { console.error(`Modelo desconocido: ${modeloArg} (haiku, sonnet, opus o todos)`); process.exit(1); }
const veces = Math.max(1, Number(opcion('--veces', 3)) || 1);
const lado = Number(opcion('--lado', LC.LADO_FOTO)) || LC.LADO_FOTO;
const esfuerzo = opcion('--esfuerzo', null);
const dirFotos = opcion('--fotos', process.env.PHYSIQ_FOTOS || null);
const soloCaso = opcion('--caso', null), soloCuest = opcion('--cuestionario', null);
// --casos <carpeta>: otra carpeta de casos (con su lecturas/), p. ej. para probar la herramienta
const DIR = opcion('--casos', join(AQUI, '..', 'tests', 'fixtures', 'cuestionarios-foto'));
const DIR_LECT = join(DIR, 'lecturas');

// ── Casos ────────────────────────────────────────────────────────────────────
const casos = (existsSync(DIR) ? readdirSync(DIR) : []).filter(f => f.endsWith('.json')).sort().map(f => {
  const c = JSON.parse(readFileSync(join(DIR, f), 'utf8'));
  return { ...c, caso: f.replace(/\.json$/, '') };
}).filter(c => (!soloCaso || c.caso === soloCaso) && (!soloCuest || c.cuestionario === soloCuest));
if (!casos.length) { console.error(`No hay casos en ${DIR}${soloCaso || soloCuest ? ' con ese filtro' : ''}. Formato: LEEME.md de esa carpeta.`); process.exit(1); }

let mal = false;
for (const c of casos) {
  const def = CUESTIONARIOS.find(d => d.id === c.cuestionario);
  if (!def) { console.error(`${c.caso}: cuestionario desconocido «${c.cuestionario}»`); mal = true; continue; }
  if (!LC.tieneHojaRespuestas(def)) { console.error(`${c.caso}: ${def.nombre} no tiene hoja de respuestas`); mal = true; continue; }
  c.def = def;
  const problemas = LC.validarCorrectas(def, c.correctas);
  for (const p of problemas) console.error(`${c.caso}: ${p}`);
  if (problemas.length) mal = true;
  if (!Array.isArray(c.fotos) || !c.fotos.length) { console.error(`${c.caso}: sin fotos`); mal = true; }
  const hoy = LC.huellaHojaRespuestas(def);
  if (c.version && c.version !== hoy) console.warn(`⚠ ${c.caso}: la hoja fotografiada es la v. ${c.version} y la de hoy, la v. ${hoy}: comprueba que las filas no han cambiado`);
}
if (mal) process.exit(1);
if (soloComprobar) { console.log(`${casos.length} caso${casos.length === 1 ? '' : 's'} correcto${casos.length === 1 ? '' : 's'}.`); process.exit(0); }
if (!soloRespuestas) {
  if (!clave && !porProxy) { console.error('Falta ANTHROPIC_API_KEY (o --clave-por-proxy si la añade el entorno, o --respuestas para puntuar las guardadas).'); process.exit(1); }
  if (!dirFotos) { console.error('Falta --fotos <carpeta> (las fotos no están en el repo).'); process.exit(1); }
}

// ── Fotos: reducir y recodificar con Chromium, como la app ──────────────────
let navegador = null;
async function prepararFoto(ruta) {
  if (!navegador) {
    const require = createRequire(process.cwd() + '/');
    let chromium;
    try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = require('playwright')); }
    navegador = await chromium.launch();
  }
  const tipo = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.heic': 'image/heic' }[extname(ruta).toLowerCase()];
  if (!tipo) throw new Error(`Formato de foto no admitido: ${ruta}`);
  const page = await navegador.newPage();
  try {
    return await page.evaluate(async ({ b64, tipo, lado }) => {
      const blob = await (await fetch(`data:${tipo};base64,${b64}`)).blob();
      const bmp = await createImageBitmap(blob, { imageOrientation: 'from-image' });
      const k = Math.min(1, lado / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas');
      c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      return { data: c.toDataURL('image/jpeg', 0.85).split(',')[1], ancho: c.width, alto: c.height };
    }, { b64: readFileSync(ruta).toString('base64'), tipo, lado });
  } finally { await page.close(); }
}

async function leer(modelo, def, fotos) {
  const t0 = Date.now();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(clave ? { 'x-api-key': clave } : {}), 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODELOS[modelo],
      max_tokens: MAX_TOKENS,
      output_config: { format: { type: 'json_schema', schema: LC.esquemaLectura(def) }, ...(esfuerzo ? { effort: esfuerzo } : {}) },
      messages: [{ role: 'user', content: [
        ...fotos.map(f => ({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: f.data } })),
        { type: 'text', text: LC.promptLectura(def, { paginas: fotos.length }) },
      ] }],
    }),
  });
  const out = await res.json();
  if (!res.ok) throw new Error(`Claude: ${out.error?.message || res.status}`);
  const texto = out.content?.find(b => b.type === 'text')?.text || '';
  let salida = null;
  try { salida = JSON.parse(texto); } catch { /* salida ilegible: todos los ítems, ilegibles */ }
  return { salida, stop: out.stop_reason, ms: Date.now() - t0, usage: { input: out.usage?.input_tokens ?? 0, output: out.usage?.output_tokens ?? 0 } };
}

const archivoLect = (c, m, n) => join(DIR_LECT, `${c.caso}.${m}.${n}.json`);
const guardadas = (c, m) => (existsSync(DIR_LECT) ? readdirSync(DIR_LECT) : [])
  .filter(f => new RegExp(`^${c.caso.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.${m}\\.\\d+\\.json$`).test(f))
  .sort((a, b) => Number(a.split('.').at(-2)) - Number(b.split('.').at(-2))).map(f => join(DIR_LECT, f));

// ── Medición ─────────────────────────────────────────────────────────────────
// res[modelo][cuestionario][pasada] = [comparación de cada caso]; extra: coste, tiempo, por condición
const res = {}, peligrosos = [], porCondicion = {};
for (const m of modelos) res[m] = {};

for (const c of casos) {
  const fotos = [];
  if (!soloRespuestas) {
    for (const f of c.fotos) {
      const ruta = join(dirFotos, f);
      if (!existsSync(ruta)) { console.error(`${c.caso}: no encuentro ${ruta}`); process.exit(1); }
      fotos.push(await prepararFoto(ruta));
    }
  }
  console.log(`\n━━ ${c.caso} · ${c.def.nombre} · ${c.fotos.length} foto${c.fotos.length === 1 ? '' : 's'}${c.condiciones?.length ? ` · ${c.condiciones.join(', ')}` : ''}`);
  for (const m of modelos) {
    const lecturas = [];
    if (soloRespuestas) {
      for (const f of guardadas(c, m)) lecturas.push(JSON.parse(readFileSync(f, 'utf8')));
      if (!lecturas.length) { console.log(`  [${m}] sin lecturas guardadas`); continue; }
    } else {
      for (let n = 1; n <= veces; n++) {
        let r;
        try { r = await leer(m, c.def, fotos); } catch (e) { console.log(`  [${m} #${n}] ERROR ${e.message}`); continue; }
        if (guardar) { mkdirSync(DIR_LECT, { recursive: true }); writeFileSync(archivoLect(c, m, n), JSON.stringify(r, null, 2) + '\n'); }
        lecturas.push(r);
      }
    }
    lecturas.forEach((r, k) => {
      const lectura = LC.normalizarLectura(c.def, r.salida);
      const cmp = LC.compararLectura(c.def, lectura, c.correctas);
      cmp.coste = r.usage ? (r.usage.input * PRECIO[m][0] + r.usage.output * PRECIO[m][1]) / 1e6 : 0;
      cmp.ms = r.ms || 0;
      cmp.incoherentes = Object.values(lectura).filter(l => l.incoherente).length;
      ((res[m][c.cuestionario] ??= [])[k] ??= []).push(cmp);
      for (const cond of c.condiciones?.length ? c.condiciones : ['(sin anotar)']) ((porCondicion[m] ??= {})[cond] ??= []).push(cmp);
      const q = cmp.cuenta;
      const avisos = [r.stop && r.stop !== 'end_turn' ? `⚠ ${r.stop}` : '', !r.salida ? '⚠ SALIDA ILEGIBLE' : '', cmp.incoherentes ? `${cmp.incoherentes} incoherentes` : ''].filter(Boolean).join(' · ');
      console.log(`  [${m} #${k + 1}] ok ${q.ok} · 🔴 ${q.peligroso} · dudosos ${q.dudoso} · ilegibles ${q.pendiente} · omitidos ${q.omitido}${cmp.coste ? ` · ${cmp.coste.toFixed(4)} $` : ''}${cmp.ms ? ` · ${(cmp.ms / 1000).toFixed(1)} s` : ''}${avisos ? ` · ${avisos}` : ''}`);
      for (const p of cmp.porItem.filter(p => p.clase === 'peligroso')) {
        peligrosos.push({ m, caso: c.caso, ...p });
        console.log(`    🔴 ítem ${p.n}: correcta ${JSON.stringify(p.correcta)}, leído ${JSON.stringify(p.lectura?.valor)} (${p.motivo})`);
      }
    });
  }
}
if (navegador) await navegador.close();

// ── Resumen por cuestionario y modelo (peor pasada) ─────────────────────────
const pct = x => `${(100 * x).toFixed(1).replace('.', ',')} %`;
const linea = s => `${s.hojas} hojas · ${s.items} ítems · 🔴 ${s.peligroso} (${pct(s.tasaPeligrosos)}${s.cotaPeligrosos95 != null ? `; < ${pct(s.cotaPeligrosos95)} al 95 %` : ''})${s.peligrososAlerta ? ` · 🔴 en ítem de alerta: ${s.peligrososAlerta}` : ''} · a revisar ${pct(s.tasaRevisar)} (dudosos ${s.dudoso}, ilegibles ${s.pendiente}, omitidos ${s.omitido})`;
console.log('\n━━ Resumen por cuestionario (veredicto con la peor pasada)');
console.log(`Umbral: 🔴 < ${pct(LC.UMBRAL.peligrosos)}, ninguno en ítems de alerta, a revisar ≤ ${pct(LC.UMBRAL.revisar)}.`);
for (const m of modelos) {
  let coste = 0, hojas = 0, ms = 0;
  for (const [id, pasadas] of Object.entries(res[m])) {
    const resumenes = pasadas.filter(Boolean).map(LC.resumirLecturas);
    for (const p of pasadas.filter(Boolean)) for (const cmp of p) { coste += cmp.coste; ms += cmp.ms; hojas++; }
    const peor = [...resumenes].sort((a, b) => b.tasaPeligrosos - a.tasaPeligrosos || b.peligrososAlerta - a.peligrososAlerta || b.tasaRevisar - a.tasaRevisar)[0];
    const nombre = CUESTIONARIOS.find(d => d.id === id).nombre;
    console.log(`  [${m}] ${nombre}: ${peor.supera ? '✓ SUPERA' : '✗ no supera'} · ${linea(peor)}${resumenes.length > 1 ? ` · ${resumenes.length} pasadas, ${resumenes.filter(s => s.supera).length} superan` : ''}`);
  }
  if (hojas) console.log(`  [${m}] coste medio ${(coste / hojas).toFixed(4)} $ por hoja${ms ? ` · ${(ms / hojas / 1000).toFixed(1)} s por hoja` : ''}`);
}
console.log('\n━━ Por condición de la foto (todas las pasadas)');
for (const m of modelos) for (const [cond, cmps] of Object.entries(porCondicion[m] || {})) console.log(`  [${m}] ${cond}: ${linea(LC.resumirLecturas(cmps))}`);
console.log('\n«a revisar» = dudosos + ilegibles + omitidos: el fisioterapeuta los completa a mano. 🔴 = leído mal y dado por bueno (el error peligroso).');
