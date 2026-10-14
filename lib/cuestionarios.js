// ============================================================
// PhysiQ-Assessment · lib/cuestionarios.js
// Calculadora de cuestionarios (📊 de la cabecera): funciones puras
// ============================================================
//
// El paciente rellena el cuestionario en papel; el fisio toca en la app el
// valor de cada ítem y la app suma, aplica las reglas del cuestionario
// (ítems invertidos, ponderados, subescalas) y da la interpretación publicada
// cuando la hay. Las definiciones están en data/cuestionarios.js; aquí, el
// motor y el HTML, sin DOM ni estado global: abrirCuestionarios() (app.js) le
// pasa las respuestas. Los ítems se muestran con una etiqueta corta, no con el
// texto literal: la hoja en papel es la del paciente. Diseño y fuentes:
// docs/cuestionarios.md.
//
// Respuestas de un cuestionario: { [n]: valor }, según el tipo del ítem:
//   escala   → número (min..max); con `invertir`, puntúa max + min − valor
//   opciones → índice de la opción elegida; puntúa opciones[i].v
//   sino     → 'si' | 'no'; «sí» puntúa `peso` (1 por defecto)
//   marcas   → [índices marcados]; puntúa marcas × `porMarca`, hasta `max`

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Coma decimal, sin decimales sobrantes
export function numeroTexto(x) {
  if (x == null || !Number.isFinite(x)) return '—';
  return (Math.round(x * 10) / 10).toString().replace('.', ',');
}

// Rango del ítem: el suyo o el del cuestionario
function rangoItem(def, item) {
  return { min: item.min ?? def.escala?.min ?? 0, max: item.max ?? def.escala?.max ?? 10 };
}

// Puntuación de un ítem, o null si no está contestado
export function valorItem(def, item, r) {
  const tipo = item.tipo || 'escala';
  if (tipo === 'escala') {
    if (typeof r !== 'number' || !Number.isFinite(r)) return null;
    const { min, max } = rangoItem(def, item);
    if (r < min || r > max) return null;
    return item.invertir ? max + min - r : r;
  }
  if (tipo === 'opciones') {
    const op = Number.isInteger(r) ? item.opciones[r] : undefined;
    return op ? op.v : null;
  }
  if (tipo === 'sino') {
    if (r === 'si') return item.peso ?? 1;
    if (r === 'no') return 0;
    return null;
  }
  if (tipo === 'marcas') {
    if (!Array.isArray(r) || !r.length) return null;
    return Math.min(r.length * (item.porMarca ?? 1), item.max ?? Infinity);
  }
  return null;
}

// Mínimo y máximo posibles de un ítem (para el rango de las subescalas)
function extremosItem(def, item) {
  const tipo = item.tipo || 'escala';
  if (tipo === 'escala') { const { min, max } = rangoItem(def, item); return [min, max]; }
  if (tipo === 'opciones') { const v = item.opciones.map(o => o.v); return [Math.min(...v), Math.max(...v)]; }
  if (tipo === 'sino') return [0, item.peso ?? 1];
  if (tipo === 'marcas') return [item.porMarca ?? 1, item.max ?? (item.opciones.length * (item.porMarca ?? 1))];
  return [0, 0];
}

function calcular(valores, calculo) {
  const suma = valores.reduce((a, b) => a + b, 0);
  return calculo === 'media' ? suma / valores.length : suma;
}

// Rango [min, max] de una puntuación (total o subescala)
export function rangoPuntuacion(def, nums, calculo = 'suma') {
  const items = def.items.filter(it => nums.includes(it.n));
  const ext = items.map(it => extremosItem(def, it));
  const min = ext.reduce((a, [lo]) => a + lo, 0), max = ext.reduce((a, [, hi]) => a + hi, 0);
  return calculo === 'media' ? [min / items.length, max / items.length] : [min, max];
}

// La primera regla que se cumple; una regla sin `si` es la de por defecto
function interpretar(reglas, puntuaciones) {
  for (const regla of reglas || []) {
    const cond = regla.si;
    if (!cond) return regla;
    const x = puntuaciones[cond.de || 'total'];
    if (x == null) continue;
    if (cond.min != null && x < cond.min) continue;
    if (cond.max != null && x > cond.max) continue;
    return regla;
  }
  return null;
}

// → { contestados, faltan: [n], completo, total, subescalas: [{ id, nombre, valor, rango }],
//     interpretacion: { etiqueta, nivel } | null, alertas: [texto] }
// La puntuación y la interpretación solo con todos los ítems contestados
// (ningún cuestionario del piloto da una regla para ítems en blanco que
// hayamos leído en su fuente). Las alertas, en cambio, salen en cuanto se
// contesta el ítem: son de seguridad (p. ej., ítem 9 del PHQ-9).
export function puntuar(def, respuestas = {}) {
  const valores = {};
  for (const it of def.items) {
    const v = valorItem(def, it, respuestas[it.n]);
    if (v != null) valores[it.n] = v;
  }
  const faltan = def.items.filter(it => valores[it.n] == null).map(it => it.n);
  const completo = faltan.length === 0;
  const todos = def.items.map(it => it.n);
  const total = completo && def.total !== null
    ? calcular(todos.map(n => valores[n]), def.total || 'suma') : null;
  const subescalas = (def.subescalas || []).map(s => {
    const llenos = s.items.every(n => valores[n] != null);
    return {
      id: s.id, nombre: s.nombre,
      valor: llenos ? calcular(s.items.map(n => valores[n]), s.calculo || 'suma') : null,
      rango: rangoPuntuacion(def, s.items, s.calculo || 'suma'),
    };
  });
  const puntuaciones = { total };
  subescalas.forEach(s => { puntuaciones[s.id] = s.valor; });
  const regla = completo ? interpretar(def.interpretacion, puntuaciones) : null;
  const alertas = (def.alertas || [])
    .filter(a => { const v = valores[a.item]; return v != null && v >= (a.min ?? 1); })
    .map(a => a.texto);
  return {
    contestados: def.items.length - faltan.length, faltan, completo, total, subescalas,
    interpretacion: regla ? { etiqueta: regla.etiqueta, nivel: regla.nivel || 'medio' } : null,
    alertas,
  };
}

// «12/27» · «media 7,2 (0–10)»
export function totalTexto(def, p) {
  if (p.total == null) return null;
  const [min, max] = def.rango || rangoPuntuacion(def, def.items.map(it => it.n), def.total || 'suma');
  return def.total === 'media'
    ? `media ${numeroTexto(p.total)} (${numeroTexto(min)}–${numeroTexto(max)})`
    : `${numeroTexto(p.total)}/${numeroTexto(max)}`;
}
function subescalaTexto(s, media) {
  if (s.valor == null) return null;
  return media
    ? `${s.nombre}: media ${numeroTexto(s.valor)}`
    : `${s.nombre}: ${numeroTexto(s.valor)}/${numeroTexto(s.rango[1])}`;
}

// Una línea para 📋 Notas y el payload: «PHQ-9: 12/27 — depresión moderada»
// (o «incompleto, 7 de 9 ítems»), con las subescalas y las alertas.
export function resumenCuestionario(def, respuestas) {
  const p = puntuar(def, respuestas);
  if (!p.contestados) return null;
  const partes = [];
  if (p.completo) {
    const t = totalTexto(def, p);
    if (t) partes.push(t);
    const subs = p.subescalas
      .filter(s => s.valor != null && !def.subescalasOcultas)
      .map(s => subescalaTexto(s, (def.subescalas.find(x => x.id === s.id).calculo || 'suma') === 'media'));
    if (subs.length) partes.push(subs.join(', '));
  }
  return {
    id: def.id,
    n: def.nombre,
    v: p.completo ? partes.join(' · ') : `incompleto, ${p.contestados} de ${def.items.length} ítems`,
    ...(p.interpretacion ? { i: p.interpretacion.etiqueta } : {}),
    ...(p.alertas.length ? { a: p.alertas } : {}),
    ...(p.completo ? {} : { inc: true }),
  };
}

// Todos los cuestionarios empezados, en el orden de data/cuestionarios.js
export function resumenCuestionarios(defs, estado = {}) {
  return defs.map(def => estado[def.id] ? resumenCuestionario(def, estado[def.id].r || {}) : null).filter(Boolean);
}

// Texto de una línea del resumen (📋 Notas, prompt)
export function lineaCuestionario(c) {
  return `${c.n}: ${c.v}${c.i ? ` — ${c.i}` : ''}${c.a?.length ? ` · ⚠️ ${c.a.join(' · ')}` : ''}`;
}

// ── HTML ──────────────────────────────────────────────────────────────────

function estadoTexto(def, respuestas) {
  const p = puntuar(def, respuestas || {});
  if (!p.contestados) return { texto: 'Sin empezar', nivel: '' };
  if (!p.completo) return { texto: `${p.contestados} de ${def.items.length} ítems`, nivel: p.alertas.length ? 'alto' : '' };
  const t = totalTexto(def, p);
  return {
    texto: [t, p.interpretacion?.etiqueta].filter(Boolean).join(' · ') || 'Completo',
    nivel: p.alertas.length ? 'alto' : (p.interpretacion?.nivel || ''),
  };
}

// Lista de cuestionarios por grupo, con el estado de cada uno
export function listaCuestionariosHTML(defs, grupos, estado = {}) {
  return grupos.map(g => {
    const delGrupo = defs.filter(d => d.grupo === g.id);
    if (!delGrupo.length) return '';
    return `<section class="cuest-grupo"><h3 class="cuest-grupo-titulo">${esc(g.nombre)}</h3>${delGrupo.map(def => {
      const e = estadoTexto(def, estado[def.id]?.r);
      return `<button type="button" class="cuest-tarjeta" data-cuest="${esc(def.id)}">`
        + `<span class="cuest-tarjeta-nombre">${esc(def.nombre)}</span>`
        + `<span class="cuest-tarjeta-titulo">${esc(def.titulo)}</span>`
        + `<span class="cuest-tarjeta-estado${e.nivel ? ` cuest-nivel-${e.nivel}` : ''}">${esc(e.texto)}</span>`
        + '</button>';
    }).join('')}</section>`;
  }).join('') + '<p class="cuest-pie">Para puntuar la hoja que ha rellenado el paciente: los ítems aparecen con una etiqueta corta, en el mismo orden que en el papel.</p>';
}

// Caja del resultado (arriba del formulario, se repinta con cada toque)
export function resultadoCuestionarioHTML(def, respuestas = {}) {
  const p = puntuar(def, respuestas);
  const alertas = p.alertas.map(a => `<div class="cuest-alerta" role="alert">⚠️ ${esc(a)}</div>`).join('');
  if (!p.completo) {
    const faltan = p.faltan.length;
    return `<div class="cuest-res-linea"><span class="cuest-res-total">${p.contestados}/${def.items.length}</span>`
      + `<span class="cuest-res-falta">${faltan === def.items.length ? 'Toca el valor de cada ítem' : `Falta${faltan === 1 ? '' : 'n'} ${faltan} ítem${faltan === 1 ? '' : 's'}: ${p.faltan.join(', ')}`}</span></div>${alertas}`;
  }
  const media = s => (def.subescalas.find(x => x.id === s.id).calculo || 'suma') === 'media';
  const subs = p.subescalas.filter(s => s.valor != null)
    .map(s => `<li>${esc(subescalaTexto(s, media(s)))}</li>`).join('');
  const interp = p.interpretacion
    ? `<span class="cuest-res-interp cuest-nivel-${p.interpretacion.nivel}">${esc(p.interpretacion.etiqueta)}</span>`
    : `<span class="cuest-res-interp">${esc(def.sinInterpretacion || 'Sin punto de corte publicado')}</span>`;
  return `<div class="cuest-res-linea"><span class="cuest-res-total">${esc(totalTexto(def, p) || 'Completo')}</span>${interp}</div>`
    + (subs ? `<ul class="cuest-res-subs">${subs}</ul>` : '') + alertas;
}

function botonesItem(def, item, r) {
  const tipo = item.tipo || 'escala';
  const boton = (valor, texto, activo, extra = '') =>
    `<button type="button" class="cuest-op${activo ? ' selected' : ''}" data-valor="${esc(valor)}" aria-pressed="${activo}"${extra}>${texto}</button>`;
  if (tipo === 'escala') {
    const { min, max } = rangoItem(def, item);
    const ops = [];
    for (let v = min; v <= max; v++) ops.push(boton(v, v, r === v));
    return `<div class="cuest-ops cuest-ops-escala" style="--cuest-n:${max - min + 1}">${ops.join('')}</div>`;
  }
  if (tipo === 'opciones') {
    return `<div class="cuest-ops cuest-ops-texto">${item.opciones.map((o, i) => boton(i, esc(o.t), r === i)).join('')}</div>`;
  }
  if (tipo === 'sino') {
    return `<div class="cuest-ops cuest-ops-sino">${boton('si', 'Sí', r === 'si')}${boton('no', 'No', r === 'no')}</div>`;
  }
  if (tipo === 'marcas') {
    const marcadas = Array.isArray(r) ? r : [];
    return `<div class="cuest-ops cuest-ops-texto">${item.opciones.map((t, i) => boton(i, esc(t), marcadas.includes(i))).join('')}</div>`;
  }
  return '';
}

export function itemCuestionarioHTML(def, item, r) {
  const tipo = item.tipo || 'escala';
  const { min, max } = rangoItem(def, item);
  const anclas = tipo === 'escala' && item.anclas
    ? `<div class="cuest-anclas"><span>${min} ${esc(item.anclas[0])}</span><span>${max} ${esc(item.anclas[1])}</span></div>` : '';
  const nota = [
    item.invertir ? 'puntúa al revés' : '',
    tipo === 'marcas' ? `marca todas las que señale${item.porMarca ? `; ${item.porMarca} puntos cada una${item.max ? `, máximo ${item.max}` : ''}` : ''}` : '',
  ].filter(Boolean).join(' · ');
  return `<div class="cuest-item" data-item="${item.n}">`
    + `<div class="cuest-item-txt"><span class="cuest-item-n">${esc(item.etiquetaN ?? item.n)}</span>${esc(item.t)}${nota ? ` <span class="cuest-item-nota">(${esc(nota)})</span>` : ''}</div>`
    + botonesItem(def, item, r) + anclas + '</div>';
}

// Formulario de un cuestionario: volver, cabecera, resultado y los ítems
export function formularioCuestionarioHTML(def, respuestas = {}) {
  const secciones = [];
  let actual = null;
  for (const it of def.items) {
    if (it.seccion && it.seccion !== actual) { actual = it.seccion; secciones.push(`<h4 class="cuest-seccion">${esc(it.seccion)}</h4>`); }
    secciones.push(itemCuestionarioHTML(def, it, respuestas[it.n]));
  }
  const algo = Object.keys(respuestas).length > 0;
  return '<button type="button" class="cuest-volver" data-cuest-volver>← Cuestionarios</button>'
    + `<div class="cuest-cab"><div class="cuest-cab-nombre">${esc(def.nombre)}</div><div class="cuest-cab-titulo">${esc(def.titulo)}</div>`
    + (def.instrucciones ? `<p class="cuest-instr">${esc(def.instrucciones)}</p>` : '')
    + (def.leyenda ? `<p class="cuest-leyenda">${esc(def.leyenda)}</p>` : '') + '</div>'
    + `<div class="cuest-resultado" id="cuestResultado" aria-live="polite">${resultadoCuestionarioHTML(def, respuestas)}</div>`
    + `<div class="cuest-items">${secciones.join('')}</div>`
    + '<div class="cuest-fuente">'
    + (def.interpretacionTexto ? `<p>${esc(def.interpretacionTexto)}</p>` : '')
    + `<p><span class="cuest-fuente-et">Fuente</span> ${esc(def.fuente)}</p>`
    + (def.nota ? `<p class="cuest-nota">${esc(def.nota)}</p>` : '') + '</div>'
    + `<button type="button" class="cuest-borrar" data-cuest-borrar${algo ? '' : ' disabled'}>Borrar respuestas</button>`;
}
