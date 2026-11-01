// ============================================================
// PhysiQ-Assessment · lector.js
// «📷 Leer la hoja de respuestas» de la calculadora de cuestionarios
// (paso 2 del lector con foto; docs/lector-cuestionarios.md, «Paso 2: diseño»)
// ============================================================
//
// Solo fuera del hub (app.js lo carga con import() y nunca dentro del iframe),
// solo con licencia «real» (lib/licencia-ia.js) y solo en los cuestionarios
// medidos (LECTOR_CUESTIONARIOS). La foto de la hoja de respuestas va al worker
// (POST /leer-hoja), que la lee con Sonnet y con Opus a la vez; aquí se combinan
// las dos lecturas con el código medido y el fisioterapeuta confirma fila a fila.
//
// Reglas que no se negocian (usuario, 2026-10):
//   - Nada se puntúa sin confirmar: lo confirmado se escribe en
//     state.cuestionarios[id].r como si se hubiera tocado a mano, y puntuar()
//     calcula lo de siempre. La IA nunca puntúa.
//   - Una fila en la que los dos lectores no coinciden, una dudosa, en blanco o
//     ilegible, y el ítem con alerta (9 del PHQ-9), nunca llegan marcados.
//   - La foto solo vive en memoria: nunca va a state, IndexedDB, el payload ni
//     el .json exportado. Se suelta al confirmar, cancelar o cerrar.

import { state } from './state.js';
import {
  tieneLector, peticionLectura, normalizarLectura, filasConfirmacion, elegidasIniciales,
  pendientesConfirmacion, respuestasConfirmadas, rotuloLectura, EN_BLANCO, MAX_FOTOS, LADO_FOTO,
} from './lib/lector-cuestionarios.js';
import { NA } from './lib/cuestionarios.js';
import { ORCHESTRATOR_URL } from './lib/informe-narrativo.js';
import { estadoLicencia, onLicencia, comprobarLicencia, marcarSinLicencia, claveGuardada } from './lib/licencia-ia.js';
import { crearTurnstile } from './lib/turnstile.js';

export const RUTA_LECTOR = '/leer-hoja';
const TIMEOUT_MS = 120000;

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Un solo lector montado a la vez: el del cuestionario abierto en la calculadora
let _m = null;

// cont: el hueco que deja app.js en el cuestionario; ctx: { saveSession, showToast, showConfirmBanner, repintar }
export function montarLector(cont, def, ctx) {
  desmontar();
  if (!cont || !tieneLector(def)) return;
  _m = {
    cont, def, ctx,
    paso: 'cerrado',           // cerrado · preparar · leyendo · confirmar
    consentido: false,
    fotos: [],                 // [{ data, nombre }] JPEG en base64, solo en memoria
    filas: null, elegidas: null,
    error: null, ctrl: null,
  };
  _m.turnstile = crearTurnstile({ caja: () => _m?.cont.querySelector('.lector-turnstile'), alCambiar: () => pintarBoton() });
  cont.innerHTML = '';
  _m.quitarOyente = onLicencia(() => pintar());
  cont.addEventListener('click', alClic);
  cont.addEventListener('change', alCambiar);
  comprobarLicencia();
  pintar();
}

export function desmontar() {
  if (!_m) return;
  _m.ctrl?.abort();
  _m.quitarOyente?.();
  _m.cont.removeEventListener('click', alClic);
  _m.cont.removeEventListener('change', alCambiar);
  _m.cont.innerHTML = '';
  _m = null;
}

// ── Pintar ───────────────────────────────────────────────────────────────────
// Tres partes: arriba y abajo se repintan; en medio, la caja de Turnstile, que
// no se toca nunca (repintarla perdería el widget y su token).
function pintar() {
  if (!_m) return;
  const { cont, paso } = _m;
  if (estadoLicencia() !== 'real') { cont.hidden = true; return; }
  cont.hidden = false;
  if (!cont.querySelector('.lector-turnstile')) cont.innerHTML = '<div class="lector-arriba"></div><div class="lector-turnstile" hidden></div><div class="lector-abajo"></div>';
  const arriba = cont.querySelector('.lector-arriba'), abajo = cont.querySelector('.lector-abajo');
  const ts = cont.querySelector('.lector-turnstile');
  cont.classList.toggle('lector-activo', paso !== 'cerrado');
  ts.hidden = paso !== 'preparar';
  abajo.innerHTML = '';
  if (paso === 'cerrado') {
    arriba.innerHTML = '<button type="button" class="lector-abrir" data-lector="preparar">📷 Leer la hoja de respuestas <span class="lector-prueba">(en prueba)</span></button>'
      + (_m.error ? errorHTML() : '');
    return;
  }
  if (paso === 'preparar') {
    [arriba.innerHTML, abajo.innerHTML] = prepararHTML();
    _m.turnstile.cargar(); pintarBoton(); return;
  }
  if (paso === 'leyendo') {
    arriba.innerHTML = '<div class="lector-caja"><div class="lector-estado" role="status">Leyendo la hoja con dos lectores… suele tardar 10–20 s.</div>'
      + '<button type="button" class="lector-sec" data-lector="cancelar">Cancelar</button></div>';
    return;
  }
  if (paso === 'confirmar') pintarConfirmacion();
}

function errorHTML() {
  return `<div class="alert alert-warning lector-error" role="alert"><span class="alert-icon">⚠️</span><div>${esc(_m.error)}</div></div>`;
}

function prepararHTML() {
  const { fotos, consentido } = _m;
  return ['<div class="lector-caja-arriba">'
    + '<div class="lector-titulo">📷 Leer la hoja de respuestas <span class="lector-prueba">(en prueba)</span></div>'
    + '<p class="lector-nota">Fotografía solo la <strong>hoja de respuestas de PhysiQ</strong>, entera y sin el cuestionario ni el nombre del paciente. Después revisarás fila a fila lo leído con la hoja en papel delante: nada cuenta hasta que lo confirmes.</p>'
    + `<label class="lector-consent"><input type="checkbox" data-lector-consent${consentido ? ' checked' : ''}> <span>La foto se envía a Anthropic a través del servidor de PhysiQ solo para leerla, y no se guarda en ningún sitio.</span></label>`
    + `<div class="lector-fotos">${fotos.map((f, i) => `<div class="lector-foto"><span>Página ${i + 1}</span><button type="button" class="lector-sec" data-lector-quitar="${i}">Quitar</button></div>`).join('')}</div>`
    + (fotos.length < MAX_FOTOS
      ? `<label class="lector-sec lector-elegir">${fotos.length ? '＋ Otra página' : 'Hacer o elegir la foto'}<input type="file" accept="image/*" capture="environment" data-lector-foto hidden></label>`
      : '')
    + (_m.error ? errorHTML() : '') + '</div>',
    '<div class="lector-caja-abajo"><div class="lector-acciones"><button type="button" class="btn-primary lector-leer" data-lector="leer">Leer la hoja</button>'
    + '<button type="button" class="lector-sec" data-lector="cerrar">Cancelar</button></div>'
    + '<div class="lector-motivo" aria-live="polite"></div></div>'];
}

// El botón «Leer» solo con consentimiento, una foto y el token de Turnstile
function pintarBoton() {
  const b = _m?.cont.querySelector('[data-lector="leer"]');
  if (!b) return;
  const motivo = !_m.consentido ? 'Marca el aviso de privacidad.'
    : !_m.fotos.length ? 'Añade la foto de la hoja.'
    : _m.turnstile.fallo() ? 'No se ha podido cargar la verificación de seguridad (un bloqueador de contenido puede impedirlo).'
    : !_m.turnstile.token() ? 'Completa la verificación de seguridad.' : '';
  b.disabled = !!motivo;
  const m = _m.cont.querySelector('.lector-motivo');
  if (m) m.textContent = motivo;
}

function filaHTML(f) {
  const el = _m.elegidas;
  const elegido = el[f.n];
  const sel = v => (JSON.stringify(elegido) === JSON.stringify(v) ? ' selected' : '');
  const [a, b] = f.lecturas.map(l => rotuloLectura(f, l));
  const estado = f.alerta
    ? `<span class="lector-aviso">⚠ Ítem de alerta: compruébalo siempre en el papel${f.tipo === 'coinciden' ? ` (los dos leen ${esc(a)})` : ''}.</span>`
    : f.tipo === 'coinciden' ? '<span class="lector-ok">✓ Leído</span>'
    : f.tipo === 'desacuerdo' ? `<span class="lector-aviso">⚠ Los lectores no coinciden: Lector 1: ${esc(a)} · Lector 2: ${esc(b)}. Elige la buena.</span>`
    : f.tipo === 'dudoso' ? `<span class="lector-aviso">⚠ Marca dudosa (lectura: ${esc(a)}). Elige la buena.</span>`
    : f.tipo === 'en_blanco' ? '<span class="lector-aviso">Leída en blanco: confírmalo o elige la respuesta.</span>'
    : '<span class="lector-aviso">No se ha podido leer: elige la respuesta.</span>';
  // En marcas múltiples, cada casilla alterna; en el resto, una sola
  const ops = f.casillas.map(c => {
    const v = f.tipoItem === 'marcas' ? null : c.valor;
    const on = f.tipoItem === 'marcas' ? Array.isArray(elegido) && elegido.includes(c.valor) : sel(v);
    return `<button type="button" class="cuest-op${on ? ' selected' : ''}" data-lector-op="${f.n}" data-valor="${esc(JSON.stringify(c.valor))}" aria-pressed="${on ? 'true' : 'false'}">${esc(c.rotulo)}</button>`;
  });
  if (f.na) ops.push(`<button type="button" class="cuest-op${sel(NA) ? ' selected' : ''}" data-lector-op="${f.n}" data-valor="${esc(JSON.stringify(NA))}" aria-pressed="${sel(NA) ? 'true' : 'false'}">${esc(f.na.rotulo)}</button>`);
  const blanco = elegido === EN_BLANCO;
  ops.push(`<button type="button" class="cuest-op lector-blanco${blanco ? ' selected' : ''}" data-lector-op="${f.n}" data-valor="${esc(JSON.stringify(EN_BLANCO))}" aria-pressed="${blanco ? 'true' : 'false'}">En blanco</button>`);
  return `<div class="lector-fila${f.n in el ? '' : ' lector-pendiente'}" data-lector-fila="${f.n}">`
    + `<div class="lector-fila-cab"><span class="cuest-item-n">${esc(f.n)}</span> ${esc(f.etiqueta)}</div>`
    + `<div class="lector-fila-estado">${estado}</div>`
    + `<div class="lector-ops">${ops.join('')}</div></div>`;
}

function pintarConfirmacion() {
  const { filas, elegidas, def } = _m;
  const faltan = pendientesConfirmacion(filas, elegidas);
  const habia = Object.keys(state.cuestionarios?.[def.id]?.r || {}).length > 0;
  _m.cont.querySelector('.lector-arriba').innerHTML = '<div class="lector-caja">'
    + '<div class="lector-titulo">Revisa lo leído</div>'
    + '<p class="lector-nota"><strong>Compara cada fila con la hoja en papel.</strong> Las marcadas con ✓ las han leído igual los dos lectores; el resto hay que elegirlas.'
    + (habia ? ' Al confirmar se sustituyen las respuestas que ya había.' : '') + '</p>'
    + `<div class="lector-filas">${filas.map(filaHTML).join('')}</div>`
    + `<div class="lector-faltan" aria-live="polite">${faltan.length ? `Faltan ${faltan.length} fila${faltan.length === 1 ? '' : 's'} por elegir.` : 'Todas las filas elegidas.'}</div>`
    + `<div class="lector-acciones"><button type="button" class="btn-primary" data-lector="confirmar"${faltan.length ? ' disabled' : ''}>Confirmar respuestas</button>`
    + '<button type="button" class="lector-sec" data-lector="cerrar">Cancelar</button></div>'
    + '</div>';
}

// ── Eventos ──────────────────────────────────────────────────────────────────
function alCambiar(e) {
  const t = e.target;
  if (t.matches?.('[data-lector-consent]')) { _m.consentido = t.checked; pintarBoton(); return; }
  if (t.matches?.('[data-lector-foto]')) {
    const archivo = t.files?.[0];
    t.value = '';
    if (archivo) prepararFoto(archivo);
  }
}

function alClic(e) {
  const t = e.target instanceof Element ? e.target : null;
  if (!t || !_m) return;
  const accion = t.closest('[data-lector]')?.dataset.lector;
  if (accion === 'preparar') { _m.error = null; _m.paso = 'preparar'; pintar(); _m.cont.scrollIntoView({ block: 'nearest' }); return; }
  if (accion === 'cerrar') { soltar(); _m.paso = 'cerrado'; pintar(); return; }
  if (accion === 'cancelar') { _m.ctrl?.abort(); return; }
  if (accion === 'leer') { leer(); return; }
  if (accion === 'confirmar') { confirmar(); return; }
  const quitar = t.closest('[data-lector-quitar]');
  if (quitar) { _m.fotos.splice(Number(quitar.dataset.lectorQuitar), 1); pintar(); return; }
  const op = t.closest('[data-lector-op]');
  if (op) elegir(Number(op.dataset.lectorOp), JSON.parse(op.dataset.valor));
}

// Un toque elige; otro sobre lo elegido lo quita (regla de la app). En marcas
// múltiples, cada casilla alterna; «En blanco» sustituye a las marcas.
function elegir(n, valor) {
  const f = _m.filas.find(x => x.n === n);
  if (!f) return;
  const el = _m.elegidas, actual = el[n];
  if (f.tipoItem === 'marcas' && valor !== EN_BLANCO && valor !== NA) {
    const lista = Array.isArray(actual) ? [...actual] : [];
    const i = lista.indexOf(valor);
    if (i >= 0) lista.splice(i, 1); else lista.push(valor);
    lista.sort((a, b) => a - b);
    if (lista.length) el[n] = lista; else delete el[n];
  } else if (JSON.stringify(actual) === JSON.stringify(valor)) delete el[n];
  else el[n] = valor;
  const nodo = _m.cont.querySelector(`[data-lector-fila="${n}"]`);
  if (nodo) nodo.outerHTML = filaHTML(f);
  const faltan = pendientesConfirmacion(_m.filas, el);
  const aviso = _m.cont.querySelector('.lector-faltan');
  if (aviso) aviso.textContent = faltan.length ? `Faltan ${faltan.length} fila${faltan.length === 1 ? '' : 's'} por elegir.` : 'Todas las filas elegidas.';
  const b = _m.cont.querySelector('[data-lector="confirmar"]');
  if (b) b.disabled = faltan.length > 0;
  _m.cont.querySelector(`[data-lector-fila="${n}"] [data-valor="${CSS.escape(JSON.stringify(valor))}"]`)?.focus({ preventScroll: true });
}

function confirmar() {
  const r = respuestasConfirmadas(_m.filas, _m.elegidas);
  if (!r) return;
  const { def, ctx } = _m;
  if (Object.keys(r).length) state.cuestionarios[def.id] = { r };
  else delete state.cuestionarios[def.id];
  soltar();
  ctx.saveSession?.();
  ctx.showToast?.('✓ Respuestas de la hoja confirmadas', 'success');
  ctx.repintar?.();   // vuelve a montar el cuestionario (y este lector, cerrado)
}

// La foto se suelta siempre: al confirmar, cancelar, cerrar o desmontar
function soltar() {
  if (!_m) return;
  _m.fotos = []; _m.filas = null; _m.elegidas = null; _m.consentido = false;
}

// ── Foto: reducir y recodificar en JPEG, como la medición ───────────────────
// createImageBitmap aplica la orientación del EXIF; el JPEG del canvas sale sin EXIF.
async function prepararFoto(archivo) {
  try {
    const bmp = await createImageBitmap(archivo, { imageOrientation: 'from-image' });
    const k = Math.min(1, LADO_FOTO / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close?.();
    if (!_m) return;
    _m.fotos.push({ data: c.toDataURL('image/jpeg', 0.85).split(',')[1] });
    _m.error = null;
  } catch {
    if (_m) _m.error = 'No se ha podido abrir la foto. Prueba con otra o hazla de nuevo.';
  }
  pintar();
}

// ── Lectura ─────────────────────────────────────────────────────────────────
async function leer() {
  const m = _m;
  if (!m || !m.consentido || !m.fotos.length || !m.turnstile.token()) return;
  const cuerpo = peticionLectura(m.def, m.fotos.map(f => f.data));
  const token = m.turnstile.consumir();
  const clave = claveGuardada();
  m.ctrl = new AbortController();
  const timer = setTimeout(() => m.ctrl?.abort(), TIMEOUT_MS);
  m.error = null;
  m.paso = 'leyendo';
  pintar();
  try {
    const res = await fetch(ORCHESTRATOR_URL + RUTA_LECTOR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'cf-turnstile-response': token || '', ...(clave ? { 'X-License-Key': clave } : {}) },
      body: JSON.stringify(cuerpo),
      signal: m.ctrl.signal,
    });
    if (res.headers.get('X-PhysiQ-Mode') === 'demo' || res.status === 401) {
      marcarSinLicencia();
      throw new Error('Este navegador no tiene una licencia PhysiQ válida.');
    }
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      if (res.status === 429) throw new Error(e.error?.message || 'Has alcanzado el límite de lecturas con IA. Inténtalo más tarde.');
      if (res.status === 403) throw new Error('La verificación de seguridad ha fallado. Vuelve a completarla y lee de nuevo.');
      throw new Error(e.error?.message || `Error del servidor (${res.status})`);
    }
    const datos = await res.json();
    if (_m !== m) return;   // se cerró o se cambió de cuestionario mientras tanto
    const a = normalizarLectura(m.def, datos.a?.salida), b = normalizarLectura(m.def, datos.b?.salida);
    m.filas = filasConfirmacion(m.def, a, b);
    m.elegidas = elegidasIniciales(m.filas);
    m.fotos = [];   // ya no hace falta: se suelta antes de confirmar
    m.paso = 'confirmar';
  } catch (e) {
    if (_m !== m) return;
    m.error = e.name === 'AbortError' ? 'Lectura cancelada.' : (e instanceof TypeError ? 'Se ha perdido la conexión. Vuelve a intentarlo.' : e.message);
    m.paso = 'preparar';
  } finally {
    clearTimeout(timer);
    if (_m === m) m.ctrl = null;
  }
  pintar();
}
