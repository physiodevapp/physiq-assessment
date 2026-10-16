// ============================================================
// PhysiQ-Assessment · lib/silueta.js
// Silueta de la fase 2 (vista posterior): un toque en una zona elige la región
// y el lado. Los datos (trazados y zonas) están en data/siluetas.js; app.js
// pinta (`_pintarSilueta()`) y responde a los toques (`tocarZonaSilueta()`).
// Puro.
// ============================================================

import { regionConLado } from './region.js';

// Figura que se dibuja: la elegida en la tarjeta con su botón, si la hay; si
// no, la del sexo de la fase 1 (sin sexo indicado, la masculina).
export function figuraSilueta(sexo, elegida = '') {
  if (elegida === 'mujer' || elegida === 'hombre') return elegida;
  return sexo === 'Mujer' ? 'mujer' : 'hombre';
}

// Estado de una zona con la región y el lado elegidos:
// 'on'     → es la región y el lado (o la zona sin lado de la columna; con
//            «Bilateral», las dos zonas de la región)
// 'region' → es la región, pero el lado no se ha indicado
// 'off'    → el resto
export function estadoZona(zona, region, lado) {
  if (!region || zona.region !== region) return 'off';
  if (!zona.lado) return 'on';
  if (lado === zona.lado || lado === 'Bilateral') return 'on';
  return lado ? 'off' : 'region';
}

// Lado que queda al tocar una zona: el de la zona; en la columna (zona sin
// lado), el que ya hubiera si es la misma región, y ninguno si es otra.
export function ladoAlTocar(zona, region, lado) {
  if (zona.lado) return zona.lado;
  return zona.region === region ? (lado || '') : '';
}

// Texto bajo el título: lo elegido, o qué hacer
export function textoElegida(region, lado) {
  if (!region) return { principal: 'Toca la zona en la silueta', sub: 'Un toque elige la región y el lado' };
  // Con lado, `sub` vacío: su línea queda reservada (CSS) para que la figura
  // no suba bajo el dedo al elegir el lado.
  return { principal: regionConLado(region, lado), sub: lado ? '' : 'Lado sin indicar (opcional)' };
}

// Texto junto al botón de la figura. Siempre hay uno (corto, dos líneas como
// mucho a 320 px), así que la figura no salta al cambiar. Si la figura se
// cambió con el botón y no coincide con la de la fase 1 (`cambiada`), dice que
// el dibujo no cambia el sexo registrado (que llega al informe con IA); sin
// sexo indicado, `enlace` pide el botón «Indicar sexo →»: se ofrece, nunca se
// rellena solo.
export function notaFigura(sexo, elegida) {
  const cambiada = !!elegida && elegida !== figuraSilueta(sexo);
  if (!cambiada) return { texto: sexo ? 'Según el sexo de la fase 1.' : 'Sin sexo en la fase 1.', enlace: false, cambiada };
  return {
    texto: sexo ? `Solo cambia el dibujo; en la fase 1 sigue «${sexo}».` : 'Solo cambia el dibujo.',
    enlace: !sexo,
    cambiada,
  };
}

const pct = n => `${Math.round(n * 1000) / 10}%`;

// HTML de la figura con sus zonas, sin nada seleccionado (app.js marca las
// zonas después, para no repintar el dibujo en cada toque). Las zonas se
// colocan en % del dibujo, así que siguen en su sitio a cualquier anchura.
export function siluetaHTML(fig, figura) {
  const [x0, y0, w, h] = fig.caja;
  const pos = (x, y) => `left:${pct((x - x0) / w)};top:${pct((y - y0) / h)}`;
  const zonas = fig.zonas.map(z => {
    const nombre = regionConLado(z.region, z.lado);
    return `<button type="button" class="sil-zona" data-region="${z.region}" data-lado="${z.lado}" style="${pos(z.x, z.y)}" aria-label="${nombre}" title="${nombre}" aria-pressed="false" onclick="tocarZonaSilueta('${z.region}', '${z.lado}')"><span class="sil-punto"></span></button>`;
  }).join('');
  const sin = fig.sinRegion.map(s =>
    `<span class="sil-sin-region" style="${pos(s.x, s.y)}" title="${s.nombre}: sin región en PhysiQ" aria-hidden="true"></span>`).join('');
  const trazos = fig.pelo.map(d => `<path class="sil-pelo" d="${d}"/>`).join('')
    + fig.partes.map(d => `<path class="sil-parte" d="${d}"/>`).join('');
  const [actual, otra] = figura === 'mujer' ? ['femenina', 'masculina'] : ['masculina', 'femenina'];
  return `<div class="sil-elegida" aria-live="polite"><span class="sil-elegida-texto"></span><span class="sil-elegida-sub"></span></div>
    <div class="sil-figura-fila">
      <button type="button" class="sil-figura" onclick="alternarFiguraSilueta()" aria-label="Figura ${actual}: cambiar a la ${otra}" title="Cambiar a la figura ${otra}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>
        ${actual[0].toUpperCase() + actual.slice(1)}
      </button>
      <p class="sil-nota"></p>
    </div>
    <div class="sil-lienzo" style="aspect-ratio:${w} / ${h}">
      <svg viewBox="${fig.caja.join(' ')}" aria-hidden="true" focusable="false"><path class="sil-contorno" d="${fig.contorno}"/>${trazos}</svg>
      <span class="sil-lado sil-lado-izq" aria-hidden="true">IZQ</span><span class="sil-lado sil-lado-der" aria-hidden="true">DER</span>
      ${sin}${zonas}
    </div>
    <p class="sil-pie">Vista posterior: el lado del paciente es el mismo que el tuyo. En gris punteado, zonas sin región en PhysiQ.
      <span class="sil-credito">Ilustración: react-native-body-highlighter (licencia MIT)</span></p>`;
}
