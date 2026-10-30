// Hoja de respuestas de PhysiQ para el lector de cuestionarios con foto
// (docs/lector-cuestionarios.md). Sin navegador: aquí solo se construye el HTML;
// lo imprime generar-respuestas.mjs con Playwright.
//
// Decisión del usuario (2026-10): el paciente lee el cuestionario oficial (texto
// validado, hoja del titular) y marca sus respuestas en esta hoja, generada desde
// data/cuestionarios.js. La hoja no reproduce el texto con derechos: solo el
// número de cada ítem, nuestra etiqueta corta y una casilla por valor, en el
// mismo dominio que la calculadora (lib/lector-cuestionarios.js). Cuatro marcas
// negras en las esquinas de cada página (en los márgenes) ayudan a encuadrar la foto. Pide no
// escribir el nombre del paciente.
import '../../tests/dom-shim.mjs';

const { CUESTIONARIOS } = await import('../../data/cuestionarios.js');
const LC = await import('../../lib/lector-cuestionarios.js');

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tipoDe = it => it.tipo || 'escala';

export const cuestionariosConHoja = () => CUESTIONARIOS.filter(LC.tieneHojaRespuestas);

const CSS = `
  @page { size: A4; margin: 15mm 13mm 15mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font-family: Helvetica, Arial, sans-serif; color: #111827; font-size: 11px; line-height: 1.3; }
  h1 { font-size: 19px; margin: 0; } .sub { color: #4b5563; margin: 2px 0 6px; }
  .instr { border: 1.5px solid #111827; border-radius: 6px; padding: 6px 9px; margin-bottom: 6px; }
  .instr b { font-size: 12px; }
  .privado { color: #b42318; font-weight: bold; }
  .leyenda { color: #374151; margin-bottom: 8px; }
  .seccion { font-weight: bold; font-size: 12px; margin: 10px 0 2px; padding-bottom: 2px; border-bottom: 1px solid #9ca3af; break-after: avoid; }
  .fila { display: flex; align-items: center; gap: 10px; padding: 5px 0; border-bottom: 1px solid #e5e7eb; break-inside: avoid; }
  .num { flex: none; min-width: 26px; height: 26px; border-radius: 4px; background: #111827; color: #fff; font-weight: bold; font-size: 13px; text-align: center; line-height: 26px; padding: 0 4px; }
  .etq { flex: 0 0 34%; color: #374151; font-size: 10px; }
  .casillas { flex: 1; display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: flex-end; }
  .cas { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 10px; font-weight: bold; }
  .cas-palabra { width: 52px; text-align: center; font-size: 9px; line-height: 1.15; justify-content: flex-end; }
  .caja { width: 22px; height: 22px; border: 1.8px solid #111827; border-radius: 3px; background: #fff; }
  .op { display: flex; align-items: center; gap: 5px; font-size: 10px; max-width: 100%; }
  .op .n { font-weight: bold; min-width: 12px; text-align: right; }
  .op-lista { flex-direction: column; align-items: flex-start; gap: 4px; }
  .na { margin-left: 2px; padding-left: 8px; border-left: 1px dashed #9ca3af; }
  .fuera { color: #6b7280; font-style: italic; font-size: 10px; }
`;

// Casilla de un valor: el número o el texto encima y la caja vacía debajo
const casilla = (txt, palabra = false) => `<span class="cas${palabra ? ' cas-palabra' : ''}"><span>${esc(txt)}</span><span class="caja"></span></span>`;
const casillaOpcion = (i, txt) => `<span class="op"><span class="n">${i}</span><span class="caja"></span><span>${esc(txt)}</span></span>`;

// Casillas de una fila, rotuladas como el papel oficial (LC.casillasItem)
function casillasFila(def, it) {
  const tipo = tipoDe(it);
  if (!LC.itemLegible(it)) return '<span class="fuera">Lo apunta el fisioterapeuta en la app (no se lee en la foto)</span>';
  const cas = LC.casillasItem(def, it);
  let html;
  if (tipo === 'escala' || tipo === 'sino') html = cas.map(c => casilla(c.rotulo, def.hoja?.casillas === 'palabras' && tipo === 'escala')).join('');
  else {
    const largas = cas.some(c => c.texto.length > 22) || cas.length > 6;
    html = `<span class="casillas ${largas ? 'op-lista' : ''}">${cas.map(c => casillaOpcion(c.rotulo, c.texto)).join('')}</span>`;
    if (tipo === 'marcas') html = `<span class="fuera">Puede marcar varias</span>${html}`;
  }
  const na = LC.casillaNA(def, it);
  if (na) html += `<span class="na">${casilla(na.rotulo, na.rotulo.length > 4)}</span>`;
  return html;
}

// Bajo las instrucciones: con casillas numeradas, la leyenda de los números (la
// del papel); con letras, cómo se cuenta la posición; con palabras, nada (cada
// casilla ya dice la respuesta)
function leyendaHoja(def) {
  const h = def.hoja?.casillas;
  const txt = h === 'letras' ? def.hoja.nota : h === 'palabras' ? 'Marca la casilla con la misma respuesta que elegiste en el cuestionario.' : def.leyenda;
  return txt ? `<div class="leyenda">${esc(txt)}</div>` : '';
}

export function htmlRespuestas(def) {
  const huella = LC.huellaHojaRespuestas(def);
  let seccion = null;
  const filas = def.items.map(it => {
    const cab = it.seccion && it.seccion !== seccion ? `<div class="seccion">${esc((seccion = it.seccion))}</div>` : '';
    return `${cab}<div class="fila" data-n="${it.n}"><span class="num">${it.n}</span><span class="etq">${esc(LC.etiquetaFila(it))}</span><span class="casillas">${casillasFila(def, it)}</span></div>`;
  }).join('');
  return `<style>${CSS}</style>
  <h1>Hoja de respuestas · ${esc(def.nombre)}</h1>
  <div class="sub">${esc(def.titulo)} · PhysiQ · v. ${huella}</div>
  <div class="instr"><b>Lee cada pregunta en el cuestionario y marca aquí con una X la casilla de tu respuesta, en la fila con el mismo número.</b>
    Una sola casilla por fila, salvo donde dice que puedes marcar varias. Si te equivocas, tacha la casilla y marca la buena.
    <div class="privado">No escribas tu nombre ni ningún otro dato en esta hoja.</div></div>
  ${leyendaHoja(def)}
  ${filas}`;
}

// Cabecera y pie de cada página (displayHeaderFooter de Playwright), en los márgenes:
// las cuatro marcas de las esquinas y, abajo, cuestionario, versión y página
const marca = '<span style="display:block;width:6mm;height:6mm;background:#000;-webkit-print-color-adjust:exact;print-color-adjust:exact"></span>';
const banda = medio => `<div style="width:100%;padding:0 6mm;display:flex;justify-content:space-between;align-items:center;font-family:Helvetica,Arial,sans-serif;font-size:8px;color:#4b5563">${marca}${medio}${marca}</div>`;
export const cabeceraRespuestas = () => banda('<span></span>');
export function pieRespuestas(def) {
  return banda(`<span>PhysiQ · Hoja de respuestas ${esc(def.nombre)} · v. ${LC.huellaHojaRespuestas(def)} · página <span class="pageNumber"></span> de <span class="totalPages"></span></span>`);
}

export const huellasRespuestas = () => Object.fromEntries(cuestionariosConHoja().map(d => [d.id, LC.huellaHojaRespuestas(d)]));
