// Mide la capa 3 (verificador con IA, lib/verificacion-informe.js) con los
// informes reales de tests/fixtures/informes/: los pasa por el modelo y compara
// lo que marca con los fallos conocidos de esperado-capa3.json. Herramienta de
// calibración: llama a la API de Anthropic directamente (no al worker, que pide
// Turnstile), con el mismo cuerpo que POST /verify de physiq-report.
//
//   ANTHROPIC_API_KEY=… node tools/verificar-informe.mjs [--modelo sonnet|haiku|ambos] [--informe <nombre.txt>] [--veces N] [--guardar]
//   node tools/verificar-informe.mjs --respuestas      # sin API: puntúa las respuestas guardadas
//   node tools/verificar-informe.mjs --clave-por-proxy # la cabecera x-api-key la añade el proxy
//                                                      # del entorno (secreto de red), no la variable
//
// --veces N pasa cada informe N veces (la respuesta varía de una llamada a otra:
// alguna sale vacía) y resume la media y la peor pasada.
// --guardar escribe cada respuesta en tests/fixtures/informes/capa3/<informe>.<modelo>.json
// (con --veces N: <informe>.<modelo>.<n>.json); --respuestas vuelve a puntuarlas sin
// gastar (útil tras cambiar la validación o las etiquetas).
// Una respuesta sin una lista de puntos legible (validarPuntos → invalida) se
// pide otra vez, una sola.
// Coste aproximado: ~0,04 $ por informe con Sonnet, ~0,015 $ con Haiku.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIR = join(AQUI, '..', 'tests', 'fixtures', 'informes');
const DIR_RESP = join(DIR, 'capa3');
// Los mismos que VERIFY_MODELS en physiq-report/workers/verify.js
const MODELOS = { sonnet: 'claude-sonnet-4-5', haiku: 'claude-haiku-4-5-20251001' };
const PRECIO = { sonnet: [3, 15], haiku: [1, 5] };   // $ por millón de tokens (entrada, salida)

const args = process.argv.slice(2);

// ── Modo interno: prompt y citas de la capa 1 de un informe (proceso aparte,
// porque `state` es único por proceso y cada valoración lo rellena entera) ──
if (args[0] === '--contexto') {
  const [, valoracion, informeArchivo, plantilla, transcripcionArchivo] = args;
  await import('../tests/dom-shim.mjs');
  const { state } = await import('../state.js');
  const app = await import('../app.js');
  const ia = await import('../informe-ia.js');
  const VJ = await import('../lib/valoracion-json.js');
  const RI = await import('../lib/revision-informe.js');
  const VI = await import('../lib/verificacion-informe.js');
  const r = VJ.leerImportacion(readFileSync(valoracion, 'utf8'));
  if (!r.ok) { console.error(r.error); process.exit(1); }
  Object.assign(state, r.assessmentState);
  await app.precargarFormularioPrevio();
  const informe = RI.quitarCabeceraYPie(readFileSync(informeArchivo, 'utf8'));
  const transcripcion = transcripcionArchivo ? readFileSync(transcripcionArchivo, 'utf8') : '';
  const datos = app.buildPhysiQPayload();
  const ampliado = ia.construirAmpliado();
  const prompt = VI.promptVerificacion(datos, { ampliado, nombreRegion: app.nombreRegion, transcripcion, informe, plantilla });
  const capa1 = RI.revisarInforme(informe, { datos, ampliado, plantilla, transcripcion, nombreRegion: app.nombreRegion });
  process.stdout.write(JSON.stringify({ prompt, informe, capa1: capa1.map(({ id, mensaje, cita }) => ({ id, mensaje, cita })) }));
  process.exit(0);
}

const VI = await import('../lib/verificacion-informe.js');
const opcion = (nombre, porDefecto) => { const i = args.indexOf(nombre); return i >= 0 ? args[i + 1] : porDefecto; };
const soloRespuestas = args.includes('--respuestas');
const guardar = args.includes('--guardar');
const modeloArg = opcion('--modelo', 'ambos');
const modelos = modeloArg === 'ambos' ? Object.keys(MODELOS) : [modeloArg];
if (modelos.some(m => !MODELOS[m])) { console.error(`Modelo desconocido: ${modeloArg} (sonnet, haiku o ambos)`); process.exit(1); }
const soloInforme = opcion('--informe', null);
const veces = Math.max(1, Number(opcion('--veces', 1)) || 1);
const clave = process.env.ANTHROPIC_API_KEY;
const porProxy = args.includes('--clave-por-proxy');
if (!soloRespuestas && !clave && !porProxy) { console.error('Falta ANTHROPIC_API_KEY (o --clave-por-proxy si la añade el entorno, o --respuestas para puntuar las guardadas).'); process.exit(1); }

const esperado = JSON.parse(readFileSync(join(DIR, 'esperado-capa3.json'), 'utf8'));
const casos = esperado.informes.filter(c => !soloInforme || c.informe === soloInforme);
if (!casos.length) { console.error(`No hay ningún informe «${soloInforme}» en esperado-capa3.json`); process.exit(1); }

function contexto(c) {
  const a = [fileURLToPath(import.meta.url), '--contexto', join(DIR, c.valoracion), join(DIR, c.informe), c.plantilla];
  if (c.transcripcion) a.push(join(DIR, c.transcripcion));
  return JSON.parse(execFileSync(process.execPath, a, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }));
}

async function llamar(modelo, prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(clave ? { 'x-api-key': clave } : {}), 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODELOS[modelo],
      max_tokens: VI.MAX_TOKENS_VERIFICACION,
      temperature: 0,   // misma respuesta para el mismo informe (con el valor por defecto, 1, un informe daba 0 puntos en una llamada y 6 en otra)
      tools: [{ name: 'resultado', description: 'Devuelve el resultado de la revisión.', input_schema: VI.ESQUEMA_VERIFICACION }],
      tool_choice: { type: 'tool', name: 'resultado' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const out = await res.json();
  if (!res.ok) throw new Error(`Claude: ${out.error?.message || res.status}`);
  const tool = out.content?.find(b => b.type === 'tool_use');
  return { result: tool?.input ?? {}, truncated: out.stop_reason === 'max_tokens', usage: { input: out.usage?.input_tokens ?? 0, output: out.usage?.output_tokens ?? 0 } };
}

const base = c => c.informe.replace(/\.txt$/, '');
const archivoResp = (c, m, n) => join(DIR_RESP, `${base(c)}.${m}${veces > 1 ? `.${n}` : ''}.json`);
// Guardadas: <informe>.<modelo>.json o <informe>.<modelo>.<n>.json, en orden
const guardadas = (c, m) => existsSync(DIR_RESP)
  ? readdirSync(DIR_RESP).filter(f => f === `${base(c)}.${m}.json` || new RegExp(`^${base(c)}\\.${m}\\.\\d+\\.json$`).test(f))
    .sort((a, b) => (Number(a.split('.').at(-2)) || 0) - (Number(b.split('.').at(-2)) || 0)).map(f => join(DIR_RESP, f))
  : [];

// Totales por modelo y por pasada (la pasada n = la n-ésima llamada de cada informe)
const nuevo = () => ({ errores: 0, detectados: 0, altos: 0, altosDetectados: 0, sinEtiquetar: 0, redundantes: 0, descartados: 0, invalidas: 0, vacias: 0, coste: 0, informes: 0 });
const pasadas = {};
for (const m of modelos) pasadas[m] = [];

for (const c of casos) {
  const ctx = contexto(c);
  console.log(`\n━━ ${c.informe} (${c.plantilla}${c.transcripcion ? ', con audio' : ''}) · ${c.errores.length} fallos conocidos`);
  for (const m of modelos) {
    const respuestas = [];
    if (soloRespuestas) {
      const fs = guardadas(c, m);
      if (!fs.length) { console.log(`  [${m}] sin respuesta guardada`); continue; }
      for (const f of fs) respuestas.push(JSON.parse(readFileSync(f, 'utf8')));
    } else {
      for (let n = 1; n <= veces; n++) {
        let resp;
        try {
          resp = await llamar(m, ctx.prompt);
          // Lista ilegible (p. ej. `puntos` como texto con comillas sin escapar): otra vez, una sola
          if (VI.validarPuntos(resp.result, ctx.informe).invalida) {
            const otra = await llamar(m, ctx.prompt);
            otra.reintento = true;
            otra.usage = { input: otra.usage.input + resp.usage.input, output: otra.usage.output + resp.usage.output };
            resp = otra;
          }
        } catch (e) { console.log(`  [${m}] ERROR ${e.message}`); continue; }
        if (guardar) { mkdirSync(DIR_RESP, { recursive: true }); writeFileSync(archivoResp(c, m, n), JSON.stringify(resp, null, 2) + '\n'); }
        respuestas.push(resp);
      }
    }
    respuestas.forEach((resp, k) => {
      const { puntos, descartados, invalida } = VI.validarPuntos(resp.result, ctx.informe);
      const cmp = VI.compararConEsperados(puntos, c.errores, ctx.capa1);
      const altos = c.errores.filter(e => e.nivel === 'alto');
      const coste = resp.usage ? (resp.usage.input * PRECIO[m][0] + resp.usage.output * PRECIO[m][1]) / 1e6 : 0;
      const r = (pasadas[m][k] ??= nuevo());
      r.informes++; r.errores += c.errores.length; r.detectados += cmp.detectados.length;
      r.altos += altos.length; r.altosDetectados += altos.filter(e => cmp.detectados.includes(e.id)).length;
      r.sinEtiquetar += cmp.sinEtiquetar.length; r.redundantes += cmp.redundantes.length; r.descartados += descartados.length; r.coste += coste;
      if (invalida) r.invalidas++;
      if (!invalida && !puntos.length) r.vacias++;
      const pas = respuestas.length > 1 ? ` #${k + 1}` : '';
      console.log(`  [${m}${pas}] detecta ${cmp.detectados.length}/${c.errores.length} · ${puntos.length} puntos (${cmp.sinEtiquetar.length} sin etiquetar, ${cmp.redundantes.length} ya en la capa 1, ${descartados.length} descartados por cita)${invalida ? ' · ⚠ RESPUESTA ILEGIBLE' : ''}${resp.reintento ? ' · (reintento)' : ''}${resp.truncated ? ' · ⚠ TRUNCADO' : ''}${coste ? ` · ${coste.toFixed(3)} $` : ''}`);
      if (cmp.fallados.length) console.log(`    no detecta: ${cmp.fallados.join(', ')}`);
      for (const p of cmp.sinEtiquetar) console.log(`    ? [${p.nivel}] ${p.tipo}: ${p.mensaje}${p.cita ? `\n      «${p.cita}»` : ''}`);
      for (const d of descartados) console.log(`    ✗ descartado (${d.motivo}): «${d.punto?.cita || ''}»`);
    });
  }
}

const pct = (a, b) => (b ? `${Math.round(100 * a / b)} %` : '—');
const linea = r => `detecta ${r.detectados}/${r.errores} (${pct(r.detectados, r.errores)}) · altos ${r.altosDetectados}/${r.altos} · sin etiquetar ${(r.sinEtiquetar / r.informes).toFixed(1)} por informe · ya en capa 1 ${r.redundantes} · descartados ${r.descartados} · vacías ${r.vacias} · ilegibles ${r.invalidas}${r.coste ? ` · ${r.coste.toFixed(2)} $ (${(r.coste / r.informes).toFixed(3)} $/informe)` : ''}`;
console.log('\n━━ Resumen');
for (const [m, ps] of Object.entries(pasadas)) {
  const hechas = ps.filter(Boolean);
  if (!hechas.length) continue;
  if (hechas.length === 1) { console.log(`  ${m}: ${linea(hechas[0])}`); continue; }
  hechas.forEach((r, k) => console.log(`  ${m} pasada ${k + 1}: ${linea(r)}`));
  const media = k => (hechas.reduce((s, r) => s + r[k], 0) / hechas.length);
  const fmt = x => (Number.isInteger(x) ? String(x) : x.toFixed(1));
  const r0 = hechas[0];
  console.log(`  ${m} MEDIA (${hechas.length} pasadas): detecta ${fmt(media('detectados'))}/${r0.errores} (${pct(media('detectados'), r0.errores)}) · altos ${fmt(media('altosDetectados'))}/${r0.altos} · sin etiquetar ${(media('sinEtiquetar') / r0.informes).toFixed(1)} por informe · ya en capa 1 ${fmt(media('redundantes'))} · vacías ${fmt(media('vacias'))} · ilegibles ${fmt(media('invalidas'))} · ${(hechas.reduce((s, r) => s + r.coste, 0) / hechas.reduce((s, r) => s + r.informes, 0)).toFixed(3)} $/informe`);
  // Peor pasada: menos altos detectados; a igualdad, menos detectados; luego más sin etiquetar
  const peor = [...hechas].sort((a, b) => a.altosDetectados - b.altosDetectados || a.detectados - b.detectados || b.sinEtiquetar - a.sinEtiquetar)[0];
  console.log(`  ${m} PEOR pasada (${hechas.indexOf(peor) + 1}): ${linea(peor)}`);
}
console.log('\nLos «sin etiquetar» hay que leerlos: pueden ser falsos positivos o fallos reales que no estaban en esperado-capa3.json (si lo son, añádelos).');
