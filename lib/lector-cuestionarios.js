// ============================================================
// PhysiQ-Assessment · lib/lector-cuestionarios.js
// Lector de cuestionarios con foto — fase de medición (docs/lector-cuestionarios.md)
// ============================================================
//
// Funciones puras, sin red ni DOM. Hoy solo las usan la herramienta de medición
// (tools/leer-cuestionario.mjs) y el generador de la hoja de respuestas
// (docs/esquemas/respuestas.mjs); la app no lo carga. Si la medición supera el
// umbral y el usuario lo aprueba, la app usará este mismo módulo, para que lo
// medido sea lo que se integra.
//
// La foto es de la HOJA DE RESPUESTAS de PhysiQ (decisión del usuario, 2026-10),
// no del cuestionario oficial: el paciente lee el texto validado en la hoja del
// titular y marca aquí. Cada fila lleva el número del ítem (`n` de
// data/cuestionarios.js), nuestra etiqueta corta y una casilla por respuesta,
// rotulada como en el papel oficial (casillasItem(); decisión del usuario, 2026-10):
//   escala   → por defecto, el número que el paciente rodea en el papel; con
//              `hoja.casillas` (data/cuestionarios.js), la palabra de la respuesta
//              o la letra de su posición (A = la primera), en el orden del papel
//   opciones → casillas 1..k, cada una con el texto corto de la opción
//   sino     → «Sí» y «No»
//   marcas   → casillas 1..k (se pueden marcar varias)
//   na: true → además, la casilla N/A (salvo `hoja.na: false`)
// El lector devuelve la CLAVE de la casilla marcada (el número, la letra, la
// palabra, la posición, 'si'/'no' o 'na'); casillasItem() la traduce al valor de
// la calculadora.
//   numero   → no se lee (milímetros de una escala visual: no es fiable en una
//              foto; decisión del usuario, 2026-10). La hoja dice que lo apunte
//              el fisioterapeuta.
//
// El modelo devuelve, por ítem, solo { estado, valor }: nunca texto libre, así
// que no puede transcribir el cuestionario. La IA nunca puntúa: la puntuación
// la sigue calculando puntuar() (lib/cuestionarios.js) con las respuestas que
// el fisioterapeuta confirme una a una.

import { NA } from './cuestionarios.js';

// Estados de la lectura de un ítem
//   marcado   → una marca clara en una casilla
//   dudoso    → hay marca, pero no está clara (entre dos casillas, dos marcas,
//               una tachada…): `valor` es la mejor lectura y se destaca
//   en_blanco → el paciente no marcó nada
//   ilegible  → no se ve (cortado, borroso, reflejo)
export const ESTADOS = ['marcado', 'dudoso', 'en_blanco', 'ilegible'];

// Lado largo de la foto que se envía (px). Las fotos se reducen y se vuelven a
// codificar en JPEG, lo que además quita los metadatos EXIF (pueden llevar la
// ubicación). La herramienta lo admite como opción (--lado) para comparar.
export const LADO_FOTO = 1568;

// Umbral para que un cuestionario tenga lector (aceptado por el usuario, 2026-10)
//   peligrosos: ítems leídos mal y dados por buenos (`marcado` con otro valor,
//               una marca inventada en un ítem en blanco, una marca ambigua dada
//               por clara): menos del 0,5 % en la peor pasada
//   alerta:     ninguno peligroso en un ítem con alerta de seguridad (PHQ-9, 9)
//   revisar:    dudosos + ilegibles + omitidos ≤ 15 %, para que compense
export const UMBRAL = { peligrosos: 0.005, revisar: 0.15, peligrososAlerta: 0 };

const tipoDe = it => it.tipo || 'escala';
const rango = (def, it) => ({ min: it.min ?? def.escala?.min ?? 0, max: it.max ?? def.escala?.max ?? 10 });

// Un ítem se puede leer en la hoja salvo los numéricos (escala visual en mm o cm)
export const itemLegible = it => tipoDe(it) !== 'numero';
export const itemsLegibles = def => def.items.filter(itemLegible);
// Un cuestionario tiene hoja de respuestas si le queda algún ítem que leer
export const tieneHojaRespuestas = def => itemsLegibles(def).length > 0;

// Texto de una opción (las de `opciones` son objetos { t, v }; las de `marcas`, cadenas)
const textoOpcion = o => (typeof o === 'string' ? o : o.t);
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Casillas de un ítem, en el orden del papel: { rotulo (lo que imprime la hoja),
// clave (lo que devuelve el lector y se anota como correcto), valor (la respuesta
// de la calculadora, lib/cuestionarios.js), texto? (el de la opción) }. Sin N/A.
export function casillasItem(def, it) {
  const tipo = tipoDe(it), hoja = def.hoja || {};
  if (tipo === 'escala') {
    const { min, max } = rango(def, it);
    const vals = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    if (hoja.orden === 'descendente') vals.reverse();
    if (hoja.casillas === 'letras') return vals.map((v, i) => ({ rotulo: LETRAS[i], clave: LETRAS[i], valor: v }));
    if (hoja.casillas === 'palabras') return vals.map(v => ({ rotulo: hoja.palabras[v], clave: hoja.palabras[v], valor: v }));
    return vals.map(v => ({ rotulo: String(v), clave: v, valor: v }));
  }
  if (tipo === 'opciones' || tipo === 'marcas') return it.opciones.map((o, i) => ({ rotulo: String(i + 1), clave: i + 1, valor: i, texto: textoOpcion(o) }));
  if (tipo === 'sino') return [{ rotulo: 'Sí', clave: 'si', valor: 'si' }, { rotulo: 'No', clave: 'no', valor: 'no' }];
  return [];
}
// Casilla N/A de un ítem que la admite (su rótulo: `hoja.na`, «N/A» por defecto), o null
export function casillaNA(def, it) {
  const rotulo = def.hoja?.na ?? 'N/A';
  return it.na && rotulo !== false ? { rotulo, clave: NA, valor: NA } : null;
}
// Claves que puede devolver el lector para un ítem (sin la de N/A)
export const valoresItem = (def, it) => casillasItem(def, it).map(c => c.clave);

// Etiqueta que la hoja imprime junto al número (KOOS «S1», HOS «1»…)
export const etiquetaFila = it => (it.etiquetaN && String(it.etiquetaN) !== String(it.n) ? `${it.etiquetaN} · ${it.t}` : it.t);

// ── Esquema de salida (output_config.format, json_schema) ────────────────────
// Un objeto por ítem, con su clave = `n`. `valor` solo admite lo que la casilla
// imprime, o null. Todo objeto con additionalProperties: false y sin cadenas
// libres: cada cadena posible está en un enum (test unitario).
export function esquemaLectura(def) {
  const props = {};
  for (const it of itemsLegibles(def)) {
    const vals = valoresItem(def, it);
    const na = !!casillaNA(def, it);
    const conNA = na ? [...vals, NA] : vals;
    const valor = tipoDe(it) === 'marcas'
      ? { anyOf: [{ type: 'array', items: { enum: vals } }, ...(na ? [{ enum: [NA] }] : []), { type: 'null' }] }
      : { anyOf: [{ enum: conNA }, { type: 'null' }] };
    props[String(it.n)] = {
      type: 'object', additionalProperties: false, required: ['estado', 'valor'],
      properties: { estado: { enum: ESTADOS }, valor },
    };
  }
  return {
    type: 'object', additionalProperties: false, required: ['items'],
    properties: { items: { type: 'object', additionalProperties: false, required: Object.keys(props), properties: props } },
  };
}

// ── Prompt ───────────────────────────────────────────────────────────────────
function describirItem(def, it) {
  const tipo = tipoDe(it), cas = casillasItem(def, it), hoja = def.hoja || {};
  const n = casillaNA(def, it);
  const na = n ? `; además una casilla «${n.rotulo}» (devuélvela como «na»)` : '';
  let casillas;
  if (tipo === 'escala' && hoja.casillas === 'letras') casillas = `casillas con las letras ${cas.map(c => c.clave).join(', ')}`;
  else if (tipo === 'escala' && hoja.casillas === 'palabras') casillas = `casillas rotuladas ${cas.map(c => `«${c.clave}»`).join(', ')}`;
  else if (tipo === 'escala') casillas = `casillas con los números ${cas.map(c => c.clave).join(', ')}`;
  else if (tipo === 'sino') casillas = 'casillas «Sí» (devuélvela como «si») y «No» (como «no»)';
  else {
    const ops = cas.map(c => `${c.clave} «${c.texto}»`).join(', ');
    casillas = `${tipo === 'marcas' ? 'puede marcar varias; ' : ''}casillas numeradas ${ops}`;
  }
  return `- Fila ${it.n} (${etiquetaFila(it)}): ${casillas}${na}.`;
}

export function promptLectura(def, { paginas = 1 } = {}) {
  const items = itemsLegibles(def);
  const fuera = def.items.filter(it => !itemLegible(it));
  return [
    `${paginas > 1 ? `Estas ${paginas} fotos son las páginas, en orden,` : 'Esta foto es'} de una hoja de respuestas de PhysiQ del cuestionario ${def.nombre} (${def.titulo}), rellenada a mano.`,
    'Cada fila empieza por su número en un recuadro oscuro, sigue una etiqueta corta y después las casillas. El paciente marca la casilla de su respuesta (con una X, un círculo, un tic o rellenándola).',
    '',
    'Para cada fila, devuelve solo:',
    '- estado «marcado» y el valor de la casilla, si hay una marca clara en una sola casilla. El valor es el rótulo impreso en la casilla: el número, la letra o la palabra, escrito exactamente como en la lista de abajo (en las opciones numeradas, su número);',
    '- estado «dudoso» y tu mejor lectura, si hay marca pero no está clara: entre dos casillas, en dos casillas sin que una esté tachada, tachada y vuelta a marcar de forma confusa, tenue, o cualquier otra duda. Ante la duda, siempre «dudoso»: una marca mal leída que des por clara cambia la puntuación sin que nadie lo note;',
    '- estado «en_blanco» y valor null, si la fila no tiene ninguna marca;',
    '- estado «ilegible» y valor null, si no se ve (cortada, borrosa, con reflejo, tapada).',
    'Una casilla tachada (con una raya o borrón encima) no cuenta como marcada. En las filas donde se pueden marcar varias casillas, el valor es la lista de todas las marcadas.',
    'No transcribas nada del papel: ni etiquetas, ni anotaciones, ni nombres. Solo el estado y el valor de cada fila.',
    '',
    'Filas de esta hoja:',
    ...items.map(it => describirItem(def, it)),
    ...(fuera.length ? ['', `Las filas ${fuera.map(it => it.n).join(', ')} no se leen (las apunta el fisioterapeuta): ignóralas.`] : []),
  ].join('\n');
}

// ── Validación y conversión ──────────────────────────────────────────────────
const igual = (a, b) => (Array.isArray(a) || Array.isArray(b)
  ? Array.isArray(a) && Array.isArray(b) && a.length === b.length && [...a].sort().every((x, i) => x === [...b].sort()[i])
  : a === b);

// Lectura de un ítem coherente con su dominio; si no, se trata como ilegible
// (la confirmación la pide igual) y se anota `incoherente`.
export function normalizarItem(def, it, x) {
  const vals = valoresItem(def, it);
  if (!x || !ESTADOS.includes(x.estado)) return { estado: 'ilegible', valor: null, incoherente: true };
  const { estado, valor } = x;
  if (estado === 'en_blanco' || estado === 'ilegible') return valor == null ? { estado, valor: null } : { estado: 'ilegible', valor: null, incoherente: true };
  const valido = valor === NA ? !!casillaNA(def, it)
    : tipoDe(it) === 'marcas' ? Array.isArray(valor) && valor.length > 0 && valor.every(v => vals.includes(v)) && new Set(valor).size === valor.length
    : vals.includes(valor);
  return valido ? { estado, valor } : { estado: 'ilegible', valor: null, incoherente: true };
}

// → { [n]: { estado, valor, incoherente? } } para todos los ítems legibles
export function normalizarLectura(def, salida) {
  const items = salida?.items || {};
  return Object.fromEntries(itemsLegibles(def).map(it => [it.n, normalizarItem(def, it, items[String(it.n)])]));
}

// Clave de la hoja → respuesta de la calculadora (lib/cuestionarios.js), con
// casillasItem(): número → número · letra o palabra → su valor · posición 1..k
// → índice 0..k-1 · [posiciones] → [índices] · 'na' → NA
export function aRespuesta(def, it, valor) {
  if (valor == null) return undefined;
  if (valor === NA) return NA;
  const cas = casillasItem(def, it);
  const de = clave => cas.find(c => c.clave === clave)?.valor;
  if (tipoDe(it) === 'marcas') return valor.map(de).sort((a, b) => a - b);
  return de(valor);
}

// Propuesta para la pantalla de confirmación: { respuestas, dudosos, pendientes }.
// Nada de esto se puntúa hasta que el fisioterapeuta confirme cada ítem.
export function propuestaConfirmacion(def, lectura) {
  const respuestas = {}, dudosos = [], pendientes = [];
  for (const it of itemsLegibles(def)) {
    const l = lectura[it.n];
    if (!l || l.estado === 'ilegible' || l.estado === 'en_blanco') { pendientes.push(it.n); continue; }
    respuestas[it.n] = aRespuesta(def, it, l.valor);
    if (l.estado === 'dudoso') dudosos.push(it.n);
  }
  return { respuestas, dudosos, pendientes };
}

// ── Comparación con las respuestas correctas ─────────────────────────────────
// Correcta de un ítem (anotada a mano): el valor de la casilla como lo imprime
// la hoja (número, 'si'/'no', posición 1..k, [posiciones], 'na'), 'blanco' o
// 'ambiguo' (una marca que ni quien la anota sabría leer).
//
// Clases:
//   ok         → leído bien, o en blanco leído en blanco, o ambiguo dado por dudoso o ilegible
//   peligroso  → `marcado` con otro valor; una marca inventada en un ítem en
//                blanco; un ítem ambiguo dado por claro
//   dudoso     → marcado como dudoso (acierta o no: `acierta`)
//   pendiente  → ilegible (o incoherente) cuando había respuesta: se escribe a mano
//   omitido    → en blanco cuando había marca: la app lo deja vacío y se escribe a mano
export function clasificarItem(correcta, l) {
  const { estado, valor } = l;
  if (correcta === 'blanco') {
    if (estado === 'en_blanco') return { clase: 'ok' };
    if (estado === 'ilegible') return { clase: 'pendiente' };
    return estado === 'dudoso' ? { clase: 'dudoso', acierta: false } : { clase: 'peligroso', motivo: 'inventada' };
  }
  if (correcta === 'ambiguo') {
    if (estado === 'dudoso' || estado === 'ilegible') return { clase: 'ok' };
    return estado === 'marcado' ? { clase: 'peligroso', motivo: 'ambigua-dada-por-clara' } : { clase: 'omitido' };
  }
  if (estado === 'marcado') return igual(valor, correcta) ? { clase: 'ok' } : { clase: 'peligroso', motivo: 'valor' };
  if (estado === 'dudoso') return { clase: 'dudoso', acierta: igual(valor, correcta) };
  if (estado === 'ilegible') return { clase: 'pendiente' };
  return { clase: 'omitido' };
}

// Respuesta correcta anotada a mano → la clave de su casilla. Admite el rótulo sin
// distinguir mayúsculas ni tildes («b», «muchisimo», «Sí»), y el número como texto.
const plano = x => String(x).normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
export function claveCorrecta(def, it, v) {
  if (v === 'blanco' || v === 'ambiguo' || v == null) return v;
  const claves = [...valoresItem(def, it), ...(casillaNA(def, it) ? [NA] : [])];
  const una = x => claves.find(c => plano(c) === plano(x)) ?? [...casillasItem(def, it), casillaNA(def, it)].find(c => c && plano(c.rotulo) === plano(x))?.clave;
  if (Array.isArray(v)) { const m = v.map(una); return m.every(x => x !== undefined) ? m : v; }
  return una(v) ?? v;
}

// → { porItem: [{ n, correcta, lectura, clase, … }], cuenta: { ok, peligroso, dudoso, pendiente, omitido }, peligrososAlerta }
export function compararLectura(def, lectura, correctas) {
  const alertas = new Set((def.alertas || []).map(a => a.item));
  const cuenta = { ok: 0, peligroso: 0, dudoso: 0, pendiente: 0, omitido: 0 };
  const porItem = [];
  let peligrososAlerta = 0, sinCorrecta = 0;
  for (const it of itemsLegibles(def)) {
    const correcta = claveCorrecta(def, it, correctas[String(it.n)]);
    if (correcta === undefined) { sinCorrecta++; continue; }
    const r = clasificarItem(correcta, lectura[it.n] || { estado: 'ilegible', valor: null });
    cuenta[r.clase]++;
    if (r.clase === 'peligroso' && alertas.has(it.n)) peligrososAlerta++;
    porItem.push({ n: it.n, correcta, lectura: lectura[it.n], ...r });
  }
  return { porItem, cuenta, peligrososAlerta, sinCorrecta };
}

// Suma de varias comparaciones (por cuestionario y pasada) y si supera el umbral
export function resumirLecturas(comparaciones) {
  const t = { ok: 0, peligroso: 0, dudoso: 0, pendiente: 0, omitido: 0, peligrososAlerta: 0, hojas: 0 };
  for (const c of comparaciones) {
    for (const k of Object.keys(c.cuenta)) t[k] += c.cuenta[k];
    t.peligrososAlerta += c.peligrososAlerta;
    t.hojas++;
  }
  const items = t.ok + t.peligroso + t.dudoso + t.pendiente + t.omitido;
  const tasaPeligrosos = items ? t.peligroso / items : 0;
  const tasaRevisar = items ? (t.dudoso + t.pendiente + t.omitido) / items : 0;
  // Con 0 errores en N ítems, la tasa real está por debajo de 3/N con un 95 % de confianza (regla del tres)
  const cotaPeligrosos95 = items ? (t.peligroso === 0 ? 3 / items : null) : null;
  const supera = items > 0 && tasaPeligrosos < UMBRAL.peligrosos && t.peligrososAlerta <= UMBRAL.peligrososAlerta && tasaRevisar <= UMBRAL.revisar;
  return { ...t, items, tasaPeligrosos, tasaRevisar, cotaPeligrosos95, supera };
}

// ── Huella de la hoja ────────────────────────────────────────────────────────
// Lo que una hoja impresa necesita para leerse bien: filas, tipos y casillas.
// La imprime la hoja («v. …») y la anota quien fotografía: si no coincide con la
// de hoy, la hoja es de otra versión y la medición avisa.
export function huellaHojaRespuestas(def) {
  const s = JSON.stringify([def.hoja?.nota || '', ...def.items.map(it => [it.n, tipoDe(it), itemLegible(it) ? casillasItem(def, it).map(c => [c.rotulo, c.valor, c.texto || '']) : null,
    casillaNA(def, it)?.rotulo || null, etiquetaFila(it)])]);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}

// Problemas de un archivo de respuestas correctas (para no medir con un fallo de anotación)
export function validarCorrectas(def, correctas) {
  const problemas = [];
  const legibles = new Map(itemsLegibles(def).map(it => [String(it.n), it]));
  for (const [k, v] of Object.entries(correctas || {})) {
    const it = legibles.get(k);
    if (!it) { problemas.push(`ítem ${k}: no existe o no se lee en la hoja`); continue; }
    if (v === 'blanco' || v === 'ambiguo') continue;
    if (normalizarItem(def, it, { estado: 'marcado', valor: claveCorrecta(def, it, v) }).incoherente) problemas.push(`ítem ${k}: valor ${JSON.stringify(v)} fuera de las casillas (${valoresItem(def, it).join(', ')})`);
  }
  for (const k of legibles.keys()) if (!(k in (correctas || {}))) problemas.push(`ítem ${k}: sin respuesta correcta (usa "blanco" si no tiene marca)`);
  return problemas;
}
