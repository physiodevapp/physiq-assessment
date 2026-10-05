// ============================================================
// PhysiQ-Assessment · informe-ia.js
// Informe narrativo con IA — solo standalone (fuera del hub)
// ============================================================
//
// Tarjeta al final de la fase 5 (#informeIA): grabar o adjuntar el audio de la
// sesión, generar con el orquestador de physiq-report (Whisper + Claude) un
// informe narrativo CIF como el de PhysiQ-Report, y compartirlo o copiarlo.
// app.js lo carga con import() dinámico solo cuando la app NO está en el hub:
// dentro del hub ni se descarga. Las piezas puras (prompt, SSE, markdown)
// están en lib/informe-narrativo.js; el audio en IDB, en lib/audio-store.js.
//
// El modo lo decide el worker (/validate), nunca este cliente: sin licencia
// válida la tarjeta queda desactivada, y si una respuesta llega en modo demo
// se descarta — el informe de ejemplo del worker es de un paciente ficticio y
// no puede mezclarse con una valoración real.

import { state } from './state.js';
import { saveSession, showConfirmBanner, buildPhysiQPayload, nombreRegion, showToast } from './app.js';
import {
  ORCHESTRATOR_URL, TURNSTILE_SITEKEY, LICENSE_KEY_STORAGE, MAX_TOKENS_INFORME, MAX_AUDIO_BYTES,
  getWhisperPrompt, buildNarrativePrompt, huellaPayload, parseSSEBuffer, parseSSEBlock,
  informeTruncado, markdownAHtml, textoParaCompartir, extensionAudio,
} from './lib/informe-narrativo.js';
import { guardarTrozo, actualizarMeta, leerAudio, borrarAudio } from './lib/audio-store.js';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const $ = id => document.getElementById(id);

// ── Estado del módulo (no persiste: lo persistente es state.informeIA) ───────
let _root = null;
let _licencia = 'comprobando';   // 'comprobando' | 'real' | 'sin-licencia' | 'desactivado' | 'error-red'
let _validado = false;
let _mostrarClave = false;
let _claveMsg = '';
let _audio = null;               // { blob, meta, url, recuperado? }
let _grab = null;                // grabación en curso
let _consentido = false;
let _gen = null;                 // generación en curso: { texto, transcripcion, fase, ctrl }
let _turnstileToken = null;
let _turnstileWidget = null;
let _turnstileFallo = false;
let _turnstileCargando = false;

// ── Montaje ──────────────────────────────────────────────────────────────────
// Se llama en cada buildResults(): la primera vez pinta la tarjeta, comprueba
// la licencia y recupera un audio pendiente; las siguientes solo refrescan.
export function montarInformeIA(root) {
  if (!root) return;
  if (_root !== root || !root.firstChild) {
    _root = root;
    root.innerHTML = esqueleto();
    if (state.informeIA?.texto) $('iaGenerador').open = false;
    $('phase5')?.addEventListener('input', _refrescarHuellaDiferido);
    if (!_audio) leerAudio().then(a => {
      if (a && !_audio && !_grab) { _audio = { ...a, url: URL.createObjectURL(a.blob), recuperado: true }; pintar(); }
    });
  }
  if (!_validado) comprobarLicencia();
  pintar();
}

function esqueleto() {
  return `
  <div class="card ia-card">
    <div class="card-title ia-titulo">🎙 Informe narrativo <span class="ia-etiqueta">IA</span></div>
    <p class="ia-intro">Informe clínico narrativo (modelo CIF), como el de PhysiQ-Report, redactado a partir de los datos de esta valoración y, si lo añades, del audio de la sesión.</p>
    <div id="iaLicencia"></div>
    <div id="iaResultado"></div>
    <details id="iaGenerador" class="ia-generador" open>
      <summary id="iaGenSummary">Generar un informe nuevo</summary>
      <div id="iaAudio"></div>
      <div id="iaConsent"></div>
      <div class="alert alert-info ia-privacidad"><span class="alert-icon">🔒</span><div>Al generar, los datos de esta valoración y el audio (si lo hay) se envían a OpenAI (transcripción) y a Anthropic (redacción) a través del servidor de PhysiQ. Revisa el informe antes de compartirlo.</div></div>
      <div id="iaTurnstile" class="ia-turnstile"></div>
      <div id="iaTurnstileMsg"></div>
      <button class="btn btn-primary ia-btn-generar" id="iaGenerar" onclick="iaGenerar()" disabled>Generar informe</button>
    </details>
    <div id="iaProgreso"></div>
  </div>`;
}

function pintar() {
  if (!_root || !$('iaLicencia')) return;
  pintarLicencia();
  pintarResultado();
  pintarGenerador();
  pintarProgreso();
}

// ── Licencia ─────────────────────────────────────────────────────────────────
function claveGuardada() {
  try { return localStorage.getItem(LICENSE_KEY_STORAGE) || ''; } catch { return ''; }
}

// GET /validate → { routes: { report: 'real'|'demo' }, demoOnly }. Lo que
// importa es la ruta de informes; si el email está en demo, da igual aquí.
async function consultarModo(clave) {
  const res = await fetch(ORCHESTRATOR_URL + '/validate', { headers: clave ? { 'X-License-Key': clave } : {} });
  const j = await res.json().catch(() => ({}));
  const modo = j.routes?.report || res.headers.get('X-PhysiQ-Mode') || 'demo';
  if (modo === 'real') return 'real';
  return j.demoOnly ? 'desactivado' : 'sin-licencia';
}

async function comprobarLicencia() {
  _validado = true;
  _licencia = 'comprobando';
  pintar();
  try {
    _licencia = await consultarModo(claveGuardada());
  } catch {
    _licencia = 'error-red';
  }
  if (_licencia === 'real') cargarTurnstile();
  pintar();
}

function pintarLicencia() {
  const el = $('iaLicencia');
  if (_licencia === 'real') { el.innerHTML = ''; return; }
  if (_licencia === 'comprobando') {
    el.innerHTML = '<div class="ia-estado">Comprobando la licencia…</div>';
    return;
  }
  if (_licencia === 'error-red') {
    el.innerHTML = `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>No se ha podido comprobar la licencia. Revisa la conexión.
      <div class="ia-acciones"><button class="phase5-copy-btn" onclick="iaReintentarLicencia()">Reintentar</button></div></div></div>`;
    return;
  }
  if (_licencia === 'desactivado') {
    el.innerHTML = '<div class="alert alert-warning"><span class="alert-icon">⏸</span><div>La generación de informes está desactivada temporalmente en el servidor de PhysiQ.</div></div>';
    return;
  }
  el.innerHTML = `<div class="alert alert-info ia-licencia"><span class="alert-icon">🔑</span><div>
    <strong>Disponible con licencia PhysiQ.</strong>
    ${_mostrarClave ? `
      <div class="ia-clave">
        <input class="form-input" id="iaClaveInput" type="password" autocomplete="off" placeholder="Clave de licencia" onkeydown="if(event.key==='Enter')iaGuardarClave()">
        <button class="phase5-copy-btn" id="iaClaveBtn" onclick="iaGuardarClave()">Guardar</button>
      </div>
      ${_claveMsg ? `<div class="ia-clave-msg">${esc(_claveMsg)}</div>` : ''}`
    : `<div class="ia-acciones"><button class="phase5-copy-btn" onclick="iaMostrarClave()">Introducir clave</button></div>`}
  </div></div>`;
  if (_mostrarClave) setTimeout(() => $('iaClaveInput')?.focus(), 0);
}

function iaMostrarClave() { _mostrarClave = true; _claveMsg = ''; pintarLicencia(); }

// Solo se guarda si el worker la da por buena: una clave mala no debe pisar
// la que el hub tenga guardada en este navegador.
async function iaGuardarClave() {
  const clave = ($('iaClaveInput')?.value || '').trim();
  if (!clave) return;
  const btn = $('iaClaveBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Comprobando…'; }
  try {
    const modo = await consultarModo(clave);
    if (modo === 'real') {
      try { localStorage.setItem(LICENSE_KEY_STORAGE, clave); } catch {}
      _licencia = 'real'; _mostrarClave = false; _claveMsg = '';
      cargarTurnstile();
      showToast('✓ Licencia guardada', 'success');
      pintar();
      return;
    }
    _claveMsg = modo === 'desactivado' ? 'El servidor tiene la generación desactivada; inténtalo más tarde.' : 'Clave no válida.';
  } catch {
    _claveMsg = 'No se ha podido comprobar la clave. Revisa la conexión.';
  }
  pintarLicencia();
}

function iaReintentarLicencia() { comprobarLicencia(); }

// ── Turnstile ────────────────────────────────────────────────────────────────
// El worker lo exige en modo real. Se carga solo aquí, y solo con licencia.
function cargarTurnstile() {
  if (_turnstileWidget != null || _turnstileCargando) { pintarGenerador(); return; }
  _turnstileCargando = true;
  window.__iaTurnstileOnload = renderTurnstile;
  if (window.turnstile) { renderTurnstile(); return; }
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__iaTurnstileOnload';
  s.async = true;
  s.onerror = () => { _turnstileFallo = true; pintarGenerador(); };
  document.head.appendChild(s);
  // Un bloqueador puede impedir que llegue a pintarse: sin este aviso solo se
  // vería un botón desactivado sin explicación.
  setTimeout(() => { if (_turnstileWidget == null) { _turnstileFallo = true; pintarGenerador(); } }, 10000);
}

function renderTurnstile() {
  const box = $('iaTurnstile');
  if (!box || !window.turnstile || _turnstileWidget != null) return;
  try {
    _turnstileWidget = window.turnstile.render(box, {
      sitekey: TURNSTILE_SITEKEY,
      appearance: 'always',
      callback: t => { _turnstileToken = t; _turnstileFallo = false; pintarGenerador(); },
      'expired-callback': () => { _turnstileToken = null; pintarGenerador(); },
      'error-callback': () => { _turnstileToken = null; pintarGenerador(); },
    });
  } catch {
    _turnstileFallo = true;
  }
  pintarGenerador();
}

function consumirToken() {
  const t = _turnstileToken;
  _turnstileToken = null;
  if (window.turnstile && _turnstileWidget != null) { try { window.turnstile.reset(_turnstileWidget); } catch {} }
  return t;
}

// ── Resultado ────────────────────────────────────────────────────────────────
function pintarResultado() {
  const el = $('iaResultado');
  const inf = state.informeIA;
  if (!inf?.texto || _gen) { el.innerHTML = ''; return; }
  const fecha = inf.fecha ? new Date(inf.fecha).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '';
  el.innerHTML = `
    <div id="iaAvisoHuella"></div>
    <div class="ia-meta">Generado ${esc(fecha)} · ${inf.conAudio ? 'con audio de la sesión' : 'solo con los datos de la valoración'}</div>
    ${informeTruncado(inf.texto) ? '<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>El informe parece incompleto: la última sección no se ha generado. Puedes generarlo de nuevo.</div></div>' : ''}
    <div class="ia-informe">${markdownAHtml(inf.texto)}</div>
    ${inf.transcripcion && inf.conAudio ? `<details class="ia-transcripcion"><summary>Transcripción del audio</summary><div class="ia-transcripcion-texto">${esc(inf.transcripcion)}</div></details>` : ''}
    <div class="ia-acciones">
      <button class="phase5-copy-btn" onclick="iaCompartir()">📤 Compartir</button>
      <button class="phase5-copy-btn" onclick="iaCopiar()">Copiar</button>
      <button class="phase5-copy-btn ia-btn-descartar" onclick="iaDescartarInforme()">Descartar</button>
    </div>`;
  refrescarHuella();
}

function refrescarHuella() {
  const el = $('iaAvisoHuella');
  if (!el) return;
  const inf = state.informeIA;
  const cambio = inf?.huella && inf.huella !== huellaPayload(buildPhysiQPayload());
  el.innerHTML = cambio
    ? '<div class="alert alert-warning"><span class="alert-icon">✎</span><div>La valoración ha cambiado desde que se generó este informe. Genera uno nuevo si quieres que lo refleje.</div></div>'
    : '';
}
let _huellaTimer = null;
function _refrescarHuellaDiferido() {
  clearTimeout(_huellaTimer);
  _huellaTimer = setTimeout(refrescarHuella, 400);
}

function textoInforme() {
  return textoParaCompartir(state.informeIA?.texto || '', state.informeIA?.datos || buildPhysiQPayload(), nombreRegion);
}

function iaCompartir() {
  const text = textoInforme();
  if (navigator.share) {
    navigator.share({ title: 'Informe de fisioterapia — PhysiQ-Assessment', text }).catch(() => {});
  } else {
    iaCopiar();
  }
}

function iaCopiar() {
  navigator.clipboard.writeText(textoInforme())
    .then(() => showToast('✓ Informe narrativo copiado al portapapeles', 'success'))
    .catch(() => showToast('No se pudo copiar el informe.', 'warning'));
}

function iaDescartarInforme() {
  showConfirmBanner('Descartar informe narrativo', 'Se borrará el informe generado. Para tener otro habrá que generarlo de nuevo.', 'Descartar', () => {
    state.informeIA = null;
    saveSession();
    pintar();
  });
}

// ── Audio ────────────────────────────────────────────────────────────────────
const fmtTiempo = ms => {
  const s = Math.floor((ms || 0) / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};
const fmtMB = b => `${(b / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
const puedeGrabar = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

function duracionGrab() {
  if (!_grab) return 0;
  return _grab.acumulado + (_grab.pausado ? 0 : Date.now() - _grab.desde);
}

function pintarAudio() {
  const el = $('iaAudio');
  if (_grab) {
    el.innerHTML = `
      <div class="ia-grabando${_grab.pausado ? ' pausado' : ''}">
        <span class="ia-punto"></span>
        <span>${_grab.pausado ? 'En pausa' : 'Grabando'}</span>
        <span class="ia-crono" id="iaCrono">${fmtTiempo(duracionGrab())}</span>
      </div>
      <div class="ia-acciones">
        <button class="phase5-copy-btn" onclick="iaPausa()">${_grab.pausado ? '▶ Reanudar' : '⏸ Pausa'}</button>
        <button class="phase5-copy-btn" onclick="iaParar()">■ Parar</button>
        <button class="phase5-copy-btn ia-btn-descartar" onclick="iaDescartarGrabacion()">Descartar</button>
      </div>`;
    return;
  }
  if (_audio) {
    const m = _audio.meta || {};
    const grande = _audio.blob.size > MAX_AUDIO_BYTES;
    const etiqueta = m.origen === 'archivo'
      ? `📎 ${esc(m.nombre || 'Audio adjunto')}`
      : `🎧 Grabación${m.duracionMs ? ` de ${fmtTiempo(m.duracionMs)}` : ''}`;
    el.innerHTML = `
      <div class="ia-audio-info">${etiqueta} · ${fmtMB(_audio.blob.size)}${_audio.recuperado ? ' <span class="ia-recuperado">(recuperado)</span>' : ''}</div>
      <audio class="ia-reproductor" controls preload="metadata" src="${_audio.url}"></audio>
      ${grande ? `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>El audio supera los 25 MB que admite la transcripción. Usa un archivo más corto o comprimido.</div></div>` : ''}
      <div class="ia-acciones"><button class="phase5-copy-btn ia-btn-descartar" onclick="iaQuitarAudio()">Quitar audio</button></div>`;
    return;
  }
  el.innerHTML = `
    <div class="ia-audio-vacio">Audio de la sesión <span class="ia-opcional">(opcional)</span></div>
    <div class="ia-acciones">
      ${puedeGrabar() ? '<button class="phase5-copy-btn" onclick="iaGrabar()">● Grabar</button>' : ''}
      <button class="phase5-copy-btn" onclick="document.getElementById(\'iaArchivo\').click()">📎 Adjuntar audio</button>
      <input type="file" id="iaArchivo" accept="audio/*,.m4a,.mp3,.wav,.webm,.ogg,.mp4" hidden onchange="iaArchivo(this)">
    </div>`;
}

let _wakeLock = null;
function pedirWakeLock() {
  navigator.wakeLock?.request('screen').then(l => { _wakeLock = l; }).catch(() => {});
}
function soltarWakeLock() {
  _wakeLock?.release?.().catch(() => {});
  _wakeLock = null;
}
document.addEventListener('visibilitychange', () => {
  // El navegador suelta el wake lock al ocultar la página; al volver, se pide otra vez.
  if (document.visibilityState === 'visible' && _grab && !_grab.pausado) pedirWakeLock();
});

async function iaGrabar() {
  if (_grab || _gen) return;
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  } catch {
    showToast('No se ha podido acceder al micrófono. Revisa los permisos del navegador.', 'warning');
    return;
  }
  const tipos = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus'];
  const mime = tipos.find(t => window.MediaRecorder.isTypeSupported?.(t)) || '';
  let rec;
  try {
    rec = new MediaRecorder(stream, { ...(mime ? { mimeType: mime } : {}), audioBitsPerSecond: 32000 });
  } catch {
    stream.getTracks().forEach(t => t.stop());
    showToast('Este navegador no permite grabar audio.', 'warning');
    return;
  }
  await borrarAudio();
  quitarAudioLocal();
  const g = { rec, stream, partes: [], n: 0, desde: Date.now(), acumulado: 0, pausado: false, descartar: false, mime: rec.mimeType || mime, timer: null };
  const meta = () => ({ origen: 'grabacion', mime: g.mime, duracionMs: g.acumulado + (g.pausado ? 0 : Date.now() - g.desde), fecha: new Date().toISOString() });
  rec.ondataavailable = e => {
    if (!e.data?.size || g.descartar) return;
    g.partes.push(e.data);
    guardarTrozo(g.n++, e.data, meta());
  };
  rec.onstop = () => {
    clearInterval(g.timer);
    g.stream.getTracks().forEach(t => t.stop());
    soltarWakeLock();
    _grab = null;
    if (g.descartar || !g.partes.length) {
      borrarAudio();
    } else {
      const m = { ...meta(), duracionMs: g.acumulado, chunks: g.n };
      actualizarMeta(m);
      const blob = new Blob(g.partes, { type: g.mime });
      _audio = { blob, meta: m, url: URL.createObjectURL(blob) };
    }
    pintarGenerador();
  };
  // Trozos de 10 s: si la página se cierra, se pierde como mucho lo último.
  rec.start(10000);
  g.timer = setInterval(() => { const c = $('iaCrono'); if (c) c.textContent = fmtTiempo(duracionGrab()); }, 500);
  _grab = g;
  _consentido = false;
  pedirWakeLock();
  pintarGenerador();
}

function iaPausa() {
  if (!_grab) return;
  if (_grab.pausado) {
    _grab.rec.resume();
    _grab.desde = Date.now();
    _grab.pausado = false;
    pedirWakeLock();
  } else {
    _grab.rec.pause();
    _grab.acumulado += Date.now() - _grab.desde;
    _grab.pausado = true;
    soltarWakeLock();
  }
  pintarAudio();
}

function iaParar() {
  if (!_grab) return;
  if (!_grab.pausado) { _grab.acumulado += Date.now() - _grab.desde; _grab.pausado = true; }
  _grab.rec.stop();
}

function iaDescartarGrabacion() {
  showConfirmBanner('Descartar grabación', 'Se borrará el audio grabado hasta ahora.', 'Descartar', () => {
    if (!_grab) return;
    _grab.descartar = true;
    _grab.rec.stop();
  });
}

async function iaArchivo(input) {
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  await borrarAudio();
  quitarAudioLocal();
  const meta = { origen: 'archivo', nombre: file.name, mime: file.type || '', fecha: new Date().toISOString() };
  _audio = { blob: file, meta: { ...meta, chunks: 1 }, url: URL.createObjectURL(file) };
  _consentido = false;
  if (file.size <= MAX_AUDIO_BYTES) guardarTrozo(0, file, meta);
  pintarGenerador();
}

function quitarAudioLocal() {
  if (_audio?.url) URL.revokeObjectURL(_audio.url);
  _audio = null;
  _consentido = false;
}

function iaQuitarAudio() {
  showConfirmBanner('Quitar audio', 'Se borrará el audio de la sesión. El informe podrá generarse solo con los datos de la valoración.', 'Quitar', () => {
    quitarAudioLocal();
    borrarAudio();
    pintarGenerador();
  });
}

// ── Consentimiento y botón de generar ────────────────────────────────────────
function pintarConsent() {
  const el = $('iaConsent');
  if (!_audio || _grab) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <label class="ia-consent">
      <input type="checkbox" ${_consentido ? 'checked' : ''} onchange="iaConsent(this.checked)">
      <span>El paciente ha sido informado y consiente el envío del audio de la sesión para su transcripción.</span>
    </label>`;
}

function iaConsent(v) { _consentido = !!v; pintarBoton(); }

function motivoBloqueo() {
  if (_licencia !== 'real') return 'licencia';
  if (_gen) return 'generando';
  if (_grab) return 'Para la grabación antes de generar el informe.';
  if (_audio && _audio.blob.size > MAX_AUDIO_BYTES) return 'El audio supera los 25 MB.';
  if (_audio && !_consentido) return 'Marca el consentimiento del paciente para enviar el audio.';
  if (!_turnstileToken) return _turnstileFallo ? 'turnstile' : 'Completa la verificación de seguridad.';
  return '';
}

function pintarBoton() {
  const btn = $('iaGenerar');
  if (!btn) return;
  const motivo = motivoBloqueo();
  btn.disabled = !!motivo;
  btn.title = motivo && motivo.length > 12 ? motivo : '';
  btn.textContent = state.informeIA?.texto ? 'Generar de nuevo' : 'Generar informe';
  const msg = $('iaTurnstileMsg');
  if (msg) {
    msg.innerHTML = motivo === 'turnstile'
      ? '<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>No se ha podido cargar la verificación de seguridad. Desactiva el bloqueador de anuncios para esta página o revisa la conexión.</div></div>'
      : '';
  }
}

function pintarGenerador() {
  const det = $('iaGenerador');
  if (!det) return;
  const activo = _licencia === 'real' && !_gen;
  det.hidden = !activo;
  // Con un informe ya generado, generar otro queda plegado: es una acción de pago.
  // Se pliega al montar con un informe ya guardado y al terminar de generar
  // (iaGenerar); a partir de ahí lo abre o cierra quien lo usa.
  const hayInforme = !!state.informeIA?.texto;
  det.classList.toggle('con-resultado', hayInforme);
  if (!hayInforme || _grab || _audio) det.open = true;
  if (!activo) return;
  pintarAudio();
  pintarConsent();
  pintarBoton();
}

// ── Generación ───────────────────────────────────────────────────────────────
function pintarProgreso() {
  const el = $('iaProgreso');
  if (!_gen) { el.innerHTML = ''; return; }
  const fase = _gen.fase === 'transcribiendo' ? 'Transcribiendo el audio…' : 'Redactando el informe…';
  el.innerHTML = `
    <div class="ia-estado ia-progreso"><span class="ia-spinner"></span>${fase}</div>
    <div class="ia-informe ia-vista-previa" id="iaVistaPrevia">${markdownAHtml(_gen.texto)}</div>
    <div class="ia-acciones"><button class="phase5-copy-btn ia-btn-descartar" onclick="iaCancelar()">Cancelar</button></div>`;
}

let _vistaPendiente = false;
function refrescarVistaPrevia() {
  if (_vistaPendiente) return;
  _vistaPendiente = true;
  requestAnimationFrame(() => {
    _vistaPendiente = false;
    const v = $('iaVistaPrevia');
    if (v && _gen) v.innerHTML = markdownAHtml(_gen.texto);
  });
}

class ModoDemo extends Error {}

async function iaGenerar() {
  if (motivoBloqueo()) { pintarBoton(); return; }
  saveSession();   // vuelca al estado lo último escrito (notas del plan, etc.)
  const datos = buildPhysiQPayload();
  const conAudio = !!_audio;
  const fd = new FormData();
  if (conAudio) {
    const ext = extensionAudio(_audio.blob.type || _audio.meta?.mime);
    const nombre = _audio.meta?.origen === 'archivo' && _audio.meta?.nombre ? _audio.meta.nombre : `sesion.${ext}`;
    fd.append('file', _audio.blob, nombre);
  }
  fd.append('whisperHint', getWhisperPrompt(datos.r));
  fd.append('prompt', buildNarrativePrompt(datos, { conAudio, nombreRegion }));
  fd.append('maxTokens', String(MAX_TOKENS_INFORME));

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 300000);
  _gen = { texto: '', transcripcion: '', fase: conAudio ? 'transcribiendo' : 'redactando', ctrl };
  pintar();

  const token = consumirToken();
  const clave = claveGuardada();
  try {
    const res = await fetch(ORCHESTRATOR_URL, {
      method: 'POST',
      headers: { 'cf-turnstile-response': token || '', ...(clave ? { 'X-License-Key': clave } : {}) },
      body: fd,
      signal: ctrl.signal,
    });
    if (res.headers.get('X-PhysiQ-Mode') === 'demo' || res.status === 401) throw new ModoDemo();
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      if (res.status === 429) throw new Error(e.error?.message || 'Has alcanzado el límite de informes. Inténtalo más tarde.');
      if (res.status === 403) throw new Error('La verificación de seguridad ha fallado. Vuelve a completarla y genera de nuevo.');
      throw new Error(e.error?.message || `Error del servidor (${res.status})`);
    }
    await leerStream(res);
    if (!_gen.texto.trim()) throw new Error('El servidor no ha devuelto ningún informe.');

    state.informeIA = {
      texto: _gen.texto,
      transcripcion: conAudio ? _gen.transcripcion : '',
      fecha: new Date().toISOString(),
      conAudio,
      huella: huellaPayload(datos),
      datos: { p: datos.p, d: datos.d, r: datos.r },
    };
    saveSession();
    // Con el informe guardado, el audio ya no hace falta en el dispositivo.
    quitarAudioLocal();
    borrarAudio();
    const det = $('iaGenerador');
    if (det) det.open = false;
    showToast('✓ Informe narrativo generado', 'success');
  } catch (err) {
    if (err instanceof ModoDemo) {
      _licencia = 'sin-licencia';
      showToast('Este navegador no tiene una licencia PhysiQ válida.', 'warning');
    } else if (err.name === 'AbortError') {
      if (!_gen?.cancelado) showToast('Tiempo de espera agotado. Inténtalo de nuevo.', 'warning');
    } else {
      showToast(err.message || 'No se ha podido generar el informe.', 'warning');
    }
  } finally {
    clearTimeout(timer);
    ctrl.abort();   // suelta el stream si se salió antes de leerlo entero (p. ej. modo demo)
    _gen = null;
    pintar();
  }
}

async function leerStream(res) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  const procesar = ev => {
    if (ev.type === 'transcript') { _gen.transcripcion = ev.data.text ?? ''; _gen.fase = 'redactando'; pintarProgreso(); }
    else if (ev.type === 'report_chunk') { _gen.texto += ev.data.text ?? ''; refrescarVistaPrevia(); }
    else if (ev.type === 'error') throw new Error(ev.data.message || 'Error desconocido');
    else if (ev.type === 'done') return true;
    return false;
  };
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      const ev = buf.trim() ? parseSSEBlock(buf) : null;
      if (ev) procesar(ev);
      return;
    }
    buf += decoder.decode(value, { stream: true });
    const { eventos, resto } = parseSSEBuffer(buf);
    buf = resto;
    for (const ev of eventos) if (procesar(ev)) { reader.cancel().catch(() => {}); return; }
  }
}

function iaCancelar() {
  if (!_gen) return;
  _gen.cancelado = true;
  _gen.ctrl.abort();
}

// ── Reinicio ─────────────────────────────────────────────────────────────────
// Desde _softResetApp() (reiniciar valoración o borrar sesión): para y descarta
// la grabación, cancela la generación y borra el audio guardado. state.informeIA
// lo limpia app.js.
export function resetInformeIA() {
  if (_grab) { _grab.descartar = true; try { _grab.rec.stop(); } catch {} }
  if (_gen) { _gen.cancelado = true; _gen.ctrl.abort(); }
  quitarAudioLocal();
  borrarAudio();
  pintar();
}

// Exposed for inline onclick/onchange attributes in the HTML strings above.
Object.assign(window, {
  iaMostrarClave, iaGuardarClave, iaReintentarLicencia,
  iaGrabar, iaPausa, iaParar, iaDescartarGrabacion, iaArchivo, iaQuitarAudio, iaConsent,
  iaGenerar, iaCancelar, iaCompartir, iaCopiar, iaDescartarInforme,
});
