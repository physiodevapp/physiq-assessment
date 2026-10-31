// Contenido de los esquemas imprimibles (lo maqueta e imprime generar.mjs, con Playwright).
// Sin navegador: tests/unit.js calcula aquí la huella de cada hoja impresa para avisar si
// cambian los datos y la hoja no se ha regenerado, y guia.js la compara con la del papel.
//
// Cada hoja se construye con tres marcadores (QR, huella, fecha) que pone rematar(); la
// huella es la del HTML con los marcadores, así que solo cambia si cambia lo impreso.
import '../../tests/dom-shim.mjs';
import { readFileSync } from 'node:fs';

const { SYSTEMIC_SCREENING, CIF_TREES, HYPOTHESES, ZONAS_SINTOMA } = await import('../../data.js');
const SINT = await import('../../lib/sintomas.js');
const PLAN = await import('../../data/plan-tratamiento.js');
const { lrEfectiva, testPuntua } = await import('../../lib/tests-4b.js');
const { resolveOptionTargets } = await import('../../lib/arbol.js');
const { CONDICION_SISTEMA, condicionPregunta, soloDeSistema, preguntasDeRegion, sistemasCribado, pasosPrincipales, etiquetaPaso, urlGuia } = await import('../../lib/esquemas.js');
const { numeroHipotesis } = await import('../../lib/esquemas.js');
const { HOJAS_TEJIDO, urlTejidos, urlRuta, datosHojaTejido } = await import('../../lib/esquemas.js');
const { TIEMPOS_TEJIDO } = await import('../../data/tejidos.js');
const { posicionDia, tieneBarra } = await import('../../lib/tejidos.js');
const { dolorInespecifico } = await import('../../lib/region.js');
const { qrSVG } = await import('./qr.mjs');
const { CONDICIONES, TEXTOS_CONDICIONES } = await import('../../data/condiciones.js');
const { ITEMS_IRRITABILIDAD, ITEM_IMPACTO, TEXTOS_IRRITABILIDAD } = await import('../../data/irritabilidad.js');
const { reglaIrritabilidad } = await import('../../lib/irritabilidad.js');
const { BANDERAS_FASE1, TEXTOS_FASE1, NIVELES_PSICO, PREGUNTAS_PSICO, RESPUESTAS_PSICO } = await import('../../data/fase1.js');
const { BLOQUES_EJERCICIO, TEXTOS_EJERCICIO } = await import('../../data/ejercicio.js');
const { FAMILIAS_FARMACO, TEXTOS_FARMACOS } = await import('../../data/farmacos.js');
const { FAMILIAS_PACIENTE, TEXTOS_FARMACOS_PACIENTE } = await import('../../data/farmacos-paciente.js');
const { nombreRegion } = await import('../../lib/region.js');
const POSQ = await import('../../lib/posquirurgico.js');
const { HIP_POSQUIRURGICA } = await import('../../data/comun.js');
const { ORDEN_REGIONES } = await import('../../lib/esquemas.js');
// Formulario del paciente: la cara común y la de cada región (los mismos esquemas que pinta formulario.js)
const FORMULARIOS = { comun: (await import('../../formularios/comun.js')).default };
for (const r of ORDEN_REGIONES) FORMULARIOS[r] = (await import(`../../formularios/${r}.js`)).default;
const { numerosFormulario, refsPasoFormulario, textoRefs } = await import('../../lib/formulario-numeros.js');

// 100 px: con la huella en la dirección el QR tiene 49 módulos; aun a la escala mínima (0,75–0,8)
// queda impreso en unos 21 mm, 0,43 mm por módulo, que un móvil lee sin acercarse mucho.
const QR_PX = 100;
const QR = '<!--QR-->', HUELLA = '<!--HUELLA-->', FECHA = '<!--FECHA-->';

// Autoría, en el pie de todas las hojas (decisión del usuario, 2026-10): quién responde del
// contenido, de dónde sale y qué licencia tiene. CC BY-NC-ND: se puede copiar y repartir citando
// la autoría, pero no venderla ni repartirla modificada (una copia retocada seguiría pareciendo
// la original). Cambiarla cambia todas las hojas: regenerarlas.
export const AUTORIA = 'PhysiQ · Edu Gamboa, fisioterapeuta · physiodevapp.github.io/physiq · © 2026 · CC BY-NC-ND 4.0';
const AUTORIA_HTML = `<span class="autoria">${AUTORIA}</span>`;

export const NOMBRES = { hombro: 'Hombro', cadera: 'Cadera', cervical: 'Cervical', lumbar: 'Lumbar', rodilla: 'Rodilla', codo: 'Codo', tobillo_pie: 'Tobillo y pie' };
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmtLR = n => n >= 10 ? n.toFixed(0) : n.toFixed(n < 1 ? 2 : 1);   // igual que phase4b.js
// QR a la página de esta hoja en la guía de consulta (guia.html): el porqué de cada elemento, sus fuentes e IA
// (marcadores: el QR, la huella y la fecha los pone rematar(); así la huella no depende de ellos)
const qrGuia = (region, hoja) => `<div class="qr-guia">${QR}<span>${hoja === 'confirmacion' ? 'Porqués, IA y calculadora' : 'Porqués, fuentes e IA'}</span>${HUELLA}</div>`;

const CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Helvetica, Arial, sans-serif; color: #1f2937; font-size: 10.5px; line-height: 1.35; }
  h1 { font-size: 20px; margin: 0 0 2px; } .sub { color: #6b7280; margin-bottom: 8px; }
  .aviso { border: 1.5px solid #d0342c; background: #fde8e8; color: #b42318; border-radius: 8px; padding: 6px 10px; font-weight: bold; margin-bottom: 8px; }
  .aviso div { font-weight: normal; }
  .pie { color: #6b7280; font-size: 9px; margin-top: 8px; }
  .chip { display: inline-block; border-radius: 10px; padding: 0 6px; font-size: 9px; font-weight: bold; }
  .urg { background: #d0342c; color: #fff; } .alerta { background: #fff1dc; color: #9a5b00; }
  .cab-hoja { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 6px; }
  .cab-txt { flex: 1; min-width: 0; }
  .qr-guia { flex: none; text-align: center; font-size: 8.5px; color: #4b5563; line-height: 1.15; width: 100px; }
  .qr-guia svg { display: block; }
  .autoria { display: block; color: #6b7280; }
  .qr-huella { display: block; margin-top: 2px; font-family: monospace; font-size: 7.5px; color: #6b7280; }
  .num { display: inline-block; min-width: 18px; height: 18px; border-radius: 9px; background: #7c4ddb; color: #fff; text-align: center; font-weight: bold; font-size: 10px; line-height: 18px; padding: 0 4px; }
`;

// Ajuste de páginas de lista (cribado, confirmación): cada .pagina con su .pie-fijo; si una
// no cabe ni a la escala mínima, sus últimas secciones (sel) pasan a una página de continuación;
// después, cada grupo de páginas (data-grupo) a la mayor escala que cabe, la misma en todo el grupo.
function scriptAjuste(W, H, sel) {
  return `<script>
  (() => {
    const W = ${W}, H = ${H}, MIN = 0.75, SEL = '${sel}';
    const escala = (p, z) => { p.style.width = (W / z) + 'px'; p.style.height = 'auto'; p.style.zoom = z;
      p.style.paddingBottom = (p.querySelector('.pie-fijo').offsetHeight + 24) + 'px'; };
    const cabe = (p, z) => { escala(p, z); return p.scrollHeight * z <= H; };
    // Una página que no cabe ni a la escala mínima pasa su último sistema a una página de continuación
    const pags = [...document.querySelectorAll('.pagina')];
    for (let k = 0; k < pags.length; k++) {
      const p = pags[k];
      while (!cabe(p, MIN) && p.querySelectorAll(SEL).length > 1) {
        let sig = pags[k + 1];
        if (!sig || sig.dataset.grupo !== p.dataset.grupo || !sig.dataset.continua) {
          sig = document.createElement('div'); sig.className = p.className; sig.dataset.grupo = p.dataset.grupo; sig.dataset.continua = 1;
          sig.innerHTML = '<div class="grupo">' + (p.querySelector('.grupo, h1').textContent) + ' (continuación)</div><div class="cols"></div>';
          sig.appendChild(p.querySelector('.pie-fijo').cloneNode(true));
          p.after(sig); pags.splice(k + 1, 0, sig);
        }
        const cols = p.querySelector('.cols');
        sig.querySelector('.cols').prepend(cols.lastElementChild);
      }
    }
    const mejorZ = p => { let lo = 0.5, hi = 1.3; for (let i = 0; i < 14; i++) { const z = (lo + hi) / 2; if (cabe(p, z)) lo = z; else hi = z; } return lo; };
    // Reparto equilibrado: mientras la página llena admita menos escala que su continuación,
    // pasa su última sección a la siguiente (si así no empeora la peor de las dos, se queda)
    for (let k = 0; k + 1 < pags.length; k++) {
      const p = pags[k], sig = pags[k + 1];
      if (!sig.dataset.continua || sig.dataset.grupo !== p.dataset.grupo) continue;
      for (;;) {
        const antes = Math.min(mejorZ(p), mejorZ(sig));
        if (mejorZ(p) >= mejorZ(sig) || p.querySelectorAll(SEL).length < 2) break;
        const el = p.querySelector('.cols').lastElementChild;
        sig.querySelector('.cols').prepend(el);
        if (Math.min(mejorZ(p), mejorZ(sig)) <= antes) { p.querySelector('.cols').appendChild(el); break; }
      }
    }
    // La mayor escala que cabe; las páginas de un mismo grupo, con la misma
    const zs = pags.map(mejorZ);
    const grupos = [...new Set(pags.map(p => p.dataset.grupo))];
    const esc = {};
    for (const g of grupos) esc[g] = Math.min(...pags.map((p, i) => p.dataset.grupo === g ? zs[i] : 9));
    pags.forEach(p => { const z = esc[p.dataset.grupo]; escala(p, z); p.style.height = (H / z) + 'px'; });
    document.body.dataset.escala = grupos.length > 1 ? grupos.map(g => g + ' ' + esc[g].toFixed(2)).join(' · ') : esc[grupos[0]].toFixed(2);
    document.body.dataset.zmin = Math.min(...Object.values(esc)); document.body.dataset.paginas = pags.length;
  })();
  </script>`;
}

// ── Fase 2 · cribado ─────────────────────────────────────────────────────────
// A4 vertical. Página 1: lo que se pregunta siempre en la región. Después, las
// condiciones especiales (solo con su tarjeta o el mecanismo marcados en la fase 1),
// cada pregunta con la condición que la muestra. Cada página a la mayor escala que
// cabe; la leyenda es el pie fijo de cada página.
export function htmlCribado(region) {
  const sc = SYSTEMIC_SCREENING[region];
  const seccion = s => {
    const preguntas = preguntasDeRegion(s, region);
    const idx = Object.fromEntries(preguntas.map((q, i) => [q.id, i + 1]));
    const conds = preguntas.map(condicionPregunta);
    // Si todas las preguntas comparten condición, va una sola vez en la cabecera
    const comun = conds.length && conds.every(c => c && c === conds[0]) ? conds[0] : '';
    const solo = soloDeSistema(s);
    const cab = solo ? `<div class="cond-sis">Solo con ${esc(CONDICION_SISTEMA[solo])}${comun ? ` · ${esc(comun)}` : ''}</div>` : '';
    const crit = s.criterioCompuesto
      ? `<div class="crit"><b>${esc(s.criterioCompuesto.etiqueta)}</b> — ${s.criterioCompuesto.minPositivas} o más de las preguntas ${s.criterioCompuesto.ids.map(id => idx[id]).join(', ')}${s.criterioCompuesto.filtro?.edadMax ? ` · edad ≤ ${s.criterioCompuesto.filtro.edadMax}` : ''}${s.criterioCompuesto.filtro?.evolucion ? ` · evolución: ${esc(s.criterioCompuesto.filtro.evolucion)}` : ''}</div>` : '';
    return `<section class="sis"><h2>${esc(s.icon || '')} ${esc(s.nombre)}</h2>${cab}<ol>${preguntas.map((q, k) => `
      <li class="${q.urgencia ? 'qurg' : q.derivacion ? 'qder' : ''}">${esc(q.text)}${q.urgencia ? ' <span class="chip urg">URGENCIA</span>' : q.derivacion ? ' <span class="chip der">DERIVACIÓN</span>' : ''}${conds[k] && !comun ? ` <span class="cond">${esc(conds[k])}</span>` : ''}</li>`).join('')}</ol>${crit}</section>`;
  };
  const { siempre, especiales } = sistemasCribado(SYSTEMIC_SCREENING, region);
  const urg = sc.urgencia ? `<div class="aviso">${esc(sc.urgencia.titulo)}${sc.urgencia.lineas.map(l => `<div>· ${esc(l)}</div>`).join('')}</div>` : '';
  const pie = `<div class="pie-fijo">
      <span class="ley"><span class="chip urg">URGENCIA</span> derivar hoy</span>
      <span class="ley"><span class="chip der">DERIVACIÓN</span> valoración médica, no urgente</span>
      <span class="ley"><span class="cond">gris</span> cuándo aparece la pregunta</span>
      <span class="txt">Un SÍ aislado no implica derivación automática (salvo URGENCIA y DERIVACIÓN): evaluar en el contexto clínico. Las preguntas son las de la app, literales; las banderas rojas y amarillas, las zonas de dolor referido y el impacto en el descanso y el ejercicio de cada sistema, en la guía (QR).</span>
      <span class="gen">Generado desde los datos de la app el ${FECHA}. ${AUTORIA_HTML}</span></div>`;
  const W = 794, H = 1123;
  return `<style>${CSS}
    @page { size: A4 portrait; margin: 0; }
    body { font-size: 10.5px; }
    .pagina { position: relative; width: ${W}px; height: ${H}px; padding: 18px 24px; overflow: hidden; page-break-after: always; }
    .pagina:last-child { page-break-after: auto; }
    h1 { font-size: 19px; } .sub { font-size: 10px; margin-bottom: 6px; }
    .aviso { font-size: 10.5px; padding: 5px 9px; }
    .grupo { font-size: 14px; margin: 0 0 3px; color: #1f2937; }
    .grupo-sub { color: #6b7280; font-size: 10px; margin-bottom: 8px; }
    .cols { column-count: 2; column-gap: 10px; }
    .sis { break-inside: avoid; border: 1.5px solid #3567d6; border-radius: 8px; padding: 6px 8px; margin: 0 0 8px; background: #fbfdff; }
    .especial .sis { border-color: #7c4ddb; background: #fcfaff; }
    .sis h2 { font-size: 12px; margin: 0 0 3px; color: #1e3a8a; }
    .especial .sis h2 { color: #5b21b6; }
    .cond-sis { font-size: 9.5px; color: #5b21b6; font-weight: bold; margin-bottom: 4px; }
    ol { margin: 0; padding-left: 18px; } li { margin-bottom: 3px; }
    li.qurg { color: #b42318; font-weight: bold; }
    li.qder { color: #9a4a00; }
    .chip.der { background: #f59e0b; color: #fff; }
    .cond { display: inline-block; font-size: 8.5px; font-weight: normal; font-style: italic; color: #4b5563; background: #f1f5f9; border-radius: 6px; padding: 0 5px; }
    .crit { margin-top: 4px; border-top: 1px dashed #94a3b8; padding-top: 4px; font-size: 9.5px; }
    .pie-fijo { position: absolute; left: 24px; right: 24px; bottom: 12px; display: flex; flex-wrap: wrap; align-items: center; gap: 3px 14px; border-top: 1px solid #cbd5e1; padding-top: 5px; font-size: 9.5px; }
    .pie-fijo .ley { display: inline-flex; align-items: center; gap: 4px; }
    .pie-fijo .txt { flex: 1 1 100%; color: #374151; }
    .pie-fijo .gen { color: #6b7280; font-size: 8.5px; }
  </style>
  <div class="pagina" data-grupo="siempre">
    <div class="cab-hoja"><div class="cab-txt">
    <h1>Cribado sistémico · ${NOMBRES[region]}</h1>
    <div class="sub">PhysiQ-Assessment · fase 2. Lo que se pregunta siempre en ${NOMBRES[region].toLowerCase()}.${especiales.length ? ' Las condiciones especiales, en la página siguiente.' : ''} El porqué de cada pregunta, sus fuentes y «Ampliar con IA», en la guía de consulta (QR).</div>
    </div>${qrGuia(region, 'cribado')}</div>
    ${urg}
    <div class="cols">${siempre.map(seccion).join('')}</div>
    ${pie}
  </div>
  ${especiales.length ? `<div class="pagina especial" data-grupo="especiales">
    <div class="grupo">Condiciones especiales · ${NOMBRES[region]}</div>
    <div class="grupo-sub">Solo se preguntan si el paciente tiene la condición (en la app, su tarjeta de la fase 1 marcada, o el mecanismo «Post-quirúrgico»). La escala de Beighton, la sospecha del subtipo vascular, la prueba de bipedestación y la regla de la tensión en el embarazo se calculan en la guía (QR).</div>
    <div class="cols">${especiales.map(seccion).join('')}</div>
    ${pie}
  </div>` : ''}
  ${scriptAjuste(W, H, '.sis')}`;
}

// ── Fase 4 · árbol ───────────────────────────────────────────────────────────
// Diseño de flujo (A3 apaisado): los pasos principales en columnas de izquierda a
// derecha (4 por banda; si hay más, la banda siguiente continúa debajo), los
// desvíos encima del paso del que salen, y debajo de cada paso sus respuestas con
// la hipótesis que activan. Las flechas se dibujan en el navegador, midiendo
// dónde ha quedado cada caja, así que sirven para el árbol de cualquier región.
const POR_BANDA = 4;
const CSS_A4 = `
    body { font-size: 10px; }
    .pagina { padding: 18px 24px 14px; }
    h1 { font-size: 19px; } .sub { font-size: 10.5px; margin-bottom: 5px; }
    .aviso { font-size: 10.5px; padding: 4px 8px; margin-bottom: 6px; }
    .banda { padding-left: 22px; padding-right: 30px; margin-bottom: 26px; } /* a la derecha pasan las flechas que bajan */
    .grid, .drow { column-gap: 40px; }
    .drow { margin-bottom: 26px; }
    .dgrupo { padding-left: 40px; }
    .dnota { font-size: 9.5px; margin-bottom: 2px; }
    .dcajas { gap: 40px; }
    .paso { border-width: 2px; border-radius: 10px; padding: 6px 8px; }
    .paso.desv { width: auto; flex: 1 1 0; min-width: 0; }
    .cab { gap: 6px; }
    .badge { min-width: 22px; height: 22px; border-radius: 11px; font-size: 11px; padding: 0 4px; }
    .preg { font-size: 13px; line-height: 1.25; }
    .dops { margin-top: 5px; gap: 3px; font-size: 11.5px; }
    .dop .hip, .dop .nada, .dop .der { padding: 1px 5px; font-size: 11px; }
    .dop .nb { margin-top: -1.1px; }
    .resp { margin-top: 8px; }
    .rt { display: none; }
    .op { grid-template-columns: 1fr 14px 1fr; margin-bottom: 5px; }
    .opt { border-width: 1px; border-radius: 7px; padding: 3px 6px; }
    .opt b { font-size: 11.5px; } .opt span { font-size: 10px; line-height: 1.2; }
    .fl { font-size: 12px; }
    .hip { gap: 4px; border-width: 1.5px; border-radius: 7px; padding: 3px 5px; font-size: 11px; line-height: 1.2; margin: 1px 0; }
    .nb { min-width: 18px; height: 18px; border-radius: 9px; font-size: 9.5px; padding: 0 3px; margin-top: -2.95px; }
    .der { border-width: 1.5px; border-radius: 7px; padding: 3px 5px; font-size: 9.5px; margin: 1px 0; }
    .der span { font-size: 9.5px; line-height: 1.2; }
    .ruta { border-width: 1.5px; border-radius: 7px; padding: 3px 6px; font-size: 9.5px; }
    .nada { border-width: 1px; border-radius: 7px; padding: 3px 6px; font-size: 10px; }
    .final { display: none; }
    .final-a4 { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 14px; border-top: 1px solid #cbd5e1; padding-top: 6px; font-size: 10px; }
    .final-a4 .ley { display: inline-flex; align-items: center; gap: 5px; }
    .final-a4 .ley i { display: inline-block; width: 18px; height: 11px; border-radius: 3px; border: 1.5px solid; }
    .final-a4 .txt { flex: 1 1 420px; }
    .final-a4 .pie { margin: 0; font-size: 8.5px; }
    .final-a4.pie-fijo { position: absolute; left: 24px; right: 24px; bottom: 14px; }
    .continua { font-size: 10px; margin-top: -8px; }
    .conecta { font-size: 10.5px; font-weight: bold; color: #3567d6; }
    .conecta-sale { text-align: right; margin-top: 2px; }
    .conecta-entra { margin: 0 0 5px; }
    .conecta-vuelta { margin-top: 5px; }
`;
const numHip = h => (h.id.match(/\d+/) || [''])[0];

export function htmlArbol(region, { a4 = false, vertical = false, cols = POR_BANDA } = {}) {
  // A4: la misma maqueta en una hoja más pequeña, compacta (no reducida) para leerla de un vistazo
  const W = a4 ? (vertical ? 794 : 1123) : 1587, H = a4 ? (vertical ? 1123 : 794) : 1122;
  const tree = CIF_TREES[region];
  const steps = tree.steps, ids = steps.map(s => s.id);
  const principales = pasosPrincipales(tree);
  const destinos = i => steps[i].options.map(o => resolveOptionTargets(tree, i, o)[0]?.id ?? null);
  const corto = o => o.label.split('—')[0].trim();
  const detalle = o => o.label.split('—').slice(1).join('—').trim();
  const lab = id => etiquetaPaso(steps[ids.indexOf(id)], ids.indexOf(id));

  // Grupos de desvío: cadenas de pasos no principales que salen de un paso principal
  const grupos = [];
  ids.forEach((id, i) => {
    if (!principales.has(id)) return;
    const porDestino = {};
    steps[i].options.forEach((o, k) => { const t = destinos(i)[k]; if (t && !principales.has(t)) (porDestino[t] ||= []).push(corto(o)); });
    Object.entries(porDestino).forEach(([ini, todas]) => {
      const etiquetas = [...new Set(todas)];
      const cadena = [ini];
      let actual = ini;
      for (;;) {
        const j = ids.indexOf(actual);
        const sig = destinos(j).find(t => t && !principales.has(t) && !cadena.includes(t));
        if (!sig) break;
        cadena.push(sig); actual = sig;
      }
      const ult = ids.indexOf(cadena[cadena.length - 1]);
      const vuelta = destinos(ult).find(t => t && principales.has(t)) ?? null;
      grupos.push({ entrada: id, etiquetas, cadena, vuelta });
    });
  });

  const resultado = o => {
    const hips = o.hypothesis.map(h => HYPOTHESES[h]).filter(Boolean)
      .map(h => `<div class="hip"><span class="nb">${numHip(h)}</span><span>${esc(h.name)}</span></div>`).join('');
    const der = o.derivacion ? `<div class="der"><b>Derivación médica</b><span>${esc(o.derivacion)}</span></div>` : '';
    return hips + der || '<div class="nada">sin hipótesis</div>';
  };
  const cajaPaso = (id, desvio) => {
    const i = ids.indexOf(id), st = steps[i];
    const lineas = desvio ? `<div class="dops">${st.options.map(o => `<div class="dop"><b>${esc(corto(o))}</b> → ${resultado(o)}</div>`).join('')}</div>${vueltaDesvio(id)}` : '';
    // Preguntas del formulario del paciente que tocan este paso (lo que la app pone en «📝 Refiere el paciente»)
    const fp = textoRefs(refsPasoFormulario(FORMULARIOS.comun, FORMULARIOS[region], id));
    return `<div class="paso${desvio ? ' desv' : ''}" id="box_${id}"><div class="cab"><span class="badge">${esc(lab(id))}</span><span class="preg">${esc(st.question)}${fp ? ` <span class="fpref">📝 ${fp}</span>` : ''}</span></div>${lineas}</div>`;
  };
  const respuestas = (id, sigPrincipal) => {
    const i = ids.indexOf(id);
    return `<div class="resp"><div class="rt">Respuestas</div>${steps[i].options.map((o, k) => {
      // Si la respuesta no sigue al siguiente paso principal, se dice adónde va
      const t = destinos(i)[k];
      const ruta = t && t !== sigPrincipal ? `<div class="ruta">→ ${principales.has(t) ? 'paso' : 'desvío'} ${esc(lab(t))}</div>` : '';
      const res = o.hypothesis.length || o.derivacion || !ruta ? resultado(o) : '';
      return `<div class="op"><div class="opt"><b>${esc(corto(o))}</b>${detalle(o) ? `<span>${esc(detalle(o))}</span>` : ''}</div><div class="fl">→</div><div class="res">${res}${ruta}</div></div>`;
    }).join('')}</div>`;
  };

  const M = ids.filter(id => principales.has(id));
  const bandas = [];
  // Bandas equilibradas: 5 pasos → 3 + 2, no 4 + 1
  const porFila = a4 ? cols : POR_BANDA;
  const nBandas = Math.ceil(M.length / porFila), porBanda = Math.ceil(M.length / nBandas);
  // En A4, tantas columnas como pasos por banda: sin columna vacía, más ancho para el texto
  const COLS = a4 ? porBanda : POR_BANDA;
  // Una cadena de desvíos más larga que las columnas no cabe en su fila: esta distribución no sirve
  if (grupos.some(g => g.cadena.length > COLS)) return null;
  for (let k = 0; k < M.length; k += porBanda) bandas.push(M.slice(k, k + porBanda));
  // Datos para dibujar las flechas en el navegador
  const flechas = [];
  M.forEach((id, k) => {
    if (k === M.length - 1) return;
    const i = ids.indexOf(id);
    const directas = steps[i].options.filter((o, j) => destinos(i)[j] === M[k + 1]).map(corto);
    if (directas.length) flechas.push({ tipo: 'sig', de: id, a: M[k + 1], txt: directas.length === steps[i].options.length ? 'todas' : directas.join(' / ') });
  });
  grupos.forEach(g => {
    flechas.push({ tipo: 'entra', de: g.entrada, a: g.cadena[0], txt: g.etiquetas.join(' / ') });
    g.cadena.slice(1).forEach((id, k) => flechas.push({ tipo: 'cadena', de: g.cadena[k], a: id }));
    if (g.vuelta) flechas.push({ tipo: 'vuelve', de: g.cadena[g.cadena.length - 1], a: g.vuelta, entrada: g.entrada });
  });

  // A4: entre una fila y la siguiente, en lugar de una flecha larga, dos conectores de texto
  const bandaDe = id => bandas.findIndex(bb => bb.includes(id));
  // (también la vuelta de un desvío a un paso de otra fila)
  const bandaOrigen = f => bandaDe(f.tipo === 'vuelve' ? f.entrada : f.de);
  const saltos = a4 ? flechas.filter(f => (f.tipo === 'sig' || f.tipo === 'vuelve') && bandaOrigen(f) !== bandaDe(f.a)) : [];
  const conectorSale = b => saltos.filter(f => f.tipo === 'sig' && bandaDe(f.de) === b).map(f => `<div class="conecta conecta-sale">${esc(f.txt === 'todas' ? 'Todas' : f.txt)} → sigue en el paso ${esc(lab(f.a))} ↓</div>`).join('');
  const vueltaDesvio = id => saltos.filter(f => f.tipo === 'vuelve' && f.de === id).map(f => `<div class="conecta conecta-vuelta">→ sigue en el paso ${esc(lab(f.a))}</div>`).join('');
  const conectorEntra = b => { const de = saltos.filter(f => bandaDe(f.a) === b);
    return de.length ? `<div class="conecta conecta-entra">↓ Paso ${esc(lab(de[0].a))}: viene del paso ${de.map(f => esc(lab(f.de))).join(' o del ')}</div>` : ''; };
  const htmlBandas = bandas.map((banda, b) => {
    const gruposBanda = grupos.filter(g => banda.includes(g.entrada));
    const filasDesvio = gruposBanda.map(g => {
      const col = banda.indexOf(g.entrada) + 1;
      const inicio = Math.max(1, Math.min(col, COLS - g.cadena.length + 1));
      return `<div class="drow"><div class="dgrupo" style="grid-column:${inicio} / ${COLS + 1}"><div class="dnota">Desvío desde el paso ${esc(lab(g.entrada))} si «${esc(g.etiquetas.join('» o «'))}»</div><div class="dcajas">${g.cadena.map(id => cajaPaso(id, true)).join('')}</div></div></div>`;
    }).join('');
    return `<div class="banda" data-banda="${b}">${conectorEntra(b)}${filasDesvio}
      <div class="grid">${banda.map(id => cajaPaso(id, false)).join('')}</div>
      <div class="grid">${banda.map(id => respuestas(id, M[M.indexOf(id) + 1])).join('')}</div>${conectorSale(b)}</div>`;
  }).join('');


  return `<style>${CSS}
    @page { size: ${a4 ? 'A4' : 'A3'} ${vertical ? 'portrait' : 'landscape'}; margin: 0; }
    body { font-size: 12px; }
    .pagina { position: relative; width: ${W}px; height: ${H}px; padding: 34px 40px; overflow: hidden; page-break-after: always; }
    .pagina:last-child { page-break-after: auto; }
    h1 { font-size: 28px; } .sub { font-size: 14px; }
    .aviso { font-size: 14px; }
    .banda { position: relative; padding-left: 34px; margin-bottom: 26px; }
    .grid { display: grid; grid-template-columns: repeat(${COLS}, 1fr); column-gap: 70px; }
    .drow { display: grid; grid-template-columns: repeat(${COLS}, 1fr); column-gap: 70px; margin-bottom: 44px; }
    .dgrupo { padding-left: 60px; }
    .dnota { font-size: 11.5px; font-style: italic; font-weight: bold; color: #6b7280; margin-bottom: 4px; }
    .dcajas { display: flex; gap: 70px; align-items: flex-start; }
    .paso { border: 2.5px solid #3567d6; background: #eaf1ff; border-radius: 14px; padding: 10px 12px; }
    .paso.desv { width: 330px; }
    .cab { display: flex; gap: 9px; align-items: flex-start; }
    /* line-height 1: la cifra, centrada en el círculo por su propia caja, no por la línea del párrafo */
    .badge { flex: none; min-width: 32px; height: 32px; border-radius: 16px; background: #3567d6; color: #fff; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; padding: 0 5px; line-height: 1; }
    .preg { font-size: 15.5px; font-weight: bold; line-height: 1.3; }
    .fpref { font-size: 0.72em; font-weight: normal; color: #475569; white-space: nowrap; }
    .dops { margin-top: 8px; display: grid; gap: 4px; font-size: 11.5px; }
    .dop { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
    .dop .hip, .dop .nada, .dop .der { padding: 2px 6px; font-size: 11px; }
    /* En los desvíos el nombre cabe en una línea: círculo centrado en la píldora */
    .dop .hip { align-items: center; } .dop .nb { margin-top: -1.5px; }
    .dop .der span { display: none; }
    .resp { margin-top: 14px; }
    .rt { font-size: 11.5px; font-weight: bold; color: #6b7280; margin-bottom: 4px; }
    .op { display: grid; grid-template-columns: 1fr 20px 1.05fr; align-items: center; margin-bottom: 7px; }
    .ruta { border: 2px solid #3567d6; color: #3567d6; background: #fff; border-radius: 10px; padding: 5px 8px; font-weight: bold; font-size: 12px; margin: 2px 0; }
    .opt { background: #f8fafc; border: 1.5px solid #94a3b8; border-radius: 10px; padding: 5px 9px; }
    .opt b { display: block; font-size: 13px; } .opt span { display: block; font-size: 10.5px; color: #6b7280; line-height: 1.25; }
    .fl { text-align: center; color: #475569; font-weight: bold; font-size: 15px; }
    /* El círculo, centrado en la primera línea del nombre (no por la línea base: con la hoja escalada, el
       redondeo dejaba unos círculos medio píxel más arriba que otros). margin-top = (alto de línea − círculo) / 2, menos el desfase de la letra (medido) */
    .hip { display: flex; gap: 6px; align-items: flex-start; text-align: left; background: #f1e9ff; border: 2px solid #7c4ddb; border-radius: 10px; padding: 5px 8px; font-weight: bold; font-size: 12px; line-height: 1.25; margin: 2px 0; }
    .nb { flex: none; min-width: 24px; height: 24px; border-radius: 12px; background: #7c4ddb; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; padding: 0 4px; line-height: 1; margin-top: -5px; }
    .der { background: #fde8e8; border: 2px solid #d0342c; color: #b42318; border-radius: 10px; padding: 5px 8px; font-size: 12px; margin: 2px 0; }
    .der span { display: block; font-size: 10px; color: #7a271a; font-weight: normal; }
    .nada { border: 1.5px dashed #94a3b8; border-radius: 10px; padding: 7px 8px; color: #6b7280; text-align: center; background: #fff; }
    .final { display: grid; grid-template-columns: 1fr 1.6fr 1.2fr; gap: 14px; margin-top: 6px; }
    .final > div { border-radius: 12px; padding: 10px 12px; font-size: 12.5px; }
    .ley div { display: flex; align-items: center; gap: 8px; margin: 3px 0; }
    .ley i { display: inline-block; width: 26px; height: 16px; border-radius: 5px; border: 2px solid; }
    svg.flechas { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; }
    .continua { font-size: 12px; font-weight: bold; color: #3567d6; text-align: right; margin-top: -14px; }
    .final-a4 { display: none; }
    ${a4 ? CSS_A4 : ''}
  </style>
  <div class="pagina" id="pag0">
    <div class="cab-hoja"><div class="cab-txt">
    <h1>${esc(tree.title || `Árbol de decisión · ${NOMBRES[region]}`)}</h1>
    <div class="sub">PhysiQ-Assessment · fase 4 · ${NOMBRES[region]}. Cada respuesta puede sumar una hipótesis; se acumulan y todas se confirman con tests en la fase 4b.${a4 ? ' El porqué de cada paso, sus fuentes y «Ampliar con IA», en la guía de consulta (QR).' : ''}</div>
    </div>${a4 ? qrGuia(region, 'arbol') : ''}</div>
    <div class="aviso">REQUISITO PREVIO · Banderas rojas (fase 1) y cribado sistémico (fase 2). Si hay una urgencia, derivar: este árbol no se aplica.</div>
    ${htmlBandas}
    <div class="final" id="final">
      <div class="ley" style="border:1.5px solid #cbd5e1;"><b>Leyenda</b>
        <div><i style="background:#eaf1ff;border-color:#3567d6"></i>Pregunta del árbol</div>
        <div><i style="background:#f1e9ff;border-color:#7c4ddb"></i>Hipótesis que activa la respuesta</div>
        <div><i style="background:#fde8e8;border-color:#d0342c"></i>Derivación médica (el recorrido sigue)</div>
        <div><i style="background:#fff;border-color:#94a3b8;border-style:dashed"></i>Sin hipótesis</div>
        <div>📝 Formulario del paciente (G general, R región)</div></div>
      <div style="border:1.5px dashed #94a3b8; background:#f8fafc;"><b>Al terminar sin ninguna hipótesis activa</b><br>La app propone trabajar con «${dolorInespecifico(region)}», revisar los factores psicosociales (fase 1 y SINSS) y reconsiderar las respuestas. Si el cuadro es crónico y el riesgo psicosocial es alto, sugiere considerar también sensibilización central.</div>
      <div style="border:1.5px solid #64748b; background:#f1f5f9;"><b>Fase 4b · confirmar</b><br>Cada hipótesis activa se confirma o descarta con sus tests: ver el esquema de confirmación de ${NOMBRES[region].toLowerCase()}.<div class="pie">Generado desde los datos de la app el ${FECHA}. ${AUTORIA_HTML}</div></div>
    </div>
    <div class="final-a4" id="final-a4">
      <span class="ley"><i style="background:#eaf1ff;border-color:#3567d6"></i>Pregunta</span>
      <span class="ley"><i style="background:#f1e9ff;border-color:#7c4ddb"></i>Hipótesis que activa</span>
      <span class="ley"><i style="background:#fde8e8;border-color:#d0342c"></i>Derivación (el recorrido sigue)</span>
      <span class="ley"><i style="background:#fff;border-color:#94a3b8;border-style:dashed"></i>Sin hipótesis</span>
      <span class="txt"><b>Sin ninguna hipótesis al final:</b> ${dolorInespecifico(region)}; revisar psicosociales y respuestas. <b>Fase 4b:</b> confirmar cada hipótesis con sus tests.</span>
      <span class="pie">Generado desde los datos de la app el ${FECHA}. ${AUTORIA_HTML}</span>
    </div>
  </div>
  <script>
  (() => {
    const FLECHAS = ${JSON.stringify(flechas)};
    // A4: la leyenda es el pie de cada página, fijo abajo; se saca del flujo y se reserva su sitio
    const pie = ${a4} ? document.getElementById('final-a4') : null;
    const reserva = pie ? pie.offsetHeight + 12 : 0;
    if (pie) pie.remove();
    const ALTO = ${H} - ${a4 ? 18 : 34} - reserva;
    // Reparte las bandas en páginas: si una no cabe, pasa a una página nueva
    const pags = [document.getElementById('pag0')];
    let pag = pags[0];
    for (const el of [...pag.querySelectorAll('.banda'), ...(${a4} ? [] : [document.getElementById('final')])]) {
      if (el.parentElement !== pag) pag.appendChild(el);
      // No cabe y en la página ya hay otra banda antes que ella: a una página nueva
      const otras = [...pag.querySelectorAll('.banda')].filter(x => x !== el && (x.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)).length;
      // Si se pasa poco (≤ 15 %), se queda y la página se reduce después
      if ((el.offsetTop + el.offsetHeight) > ALTO * ${a4 ? 1.35 : 1.15} && otras > 0) {
        const nueva = document.createElement('div'); nueva.className = 'pagina'; nueva.id = 'pag' + pags.length;
        document.body.insertBefore(nueva, pag.nextSibling); pags.push(nueva); pag = nueva;
        pag.appendChild(el);
      }
    }
    // Una página que aun así se pasa de alto (una banda muy larga) se reduce lo justo
    // Ninguna caja se sale por la derecha (medido en pantalla, ya con el zoom)
    const cabeAncho = p => { const lim = p.getBoundingClientRect().right - 8;
      return [...p.querySelectorAll('.paso, .op, .opt, .hip, .nada, .der, .ruta')].every(e => e.getBoundingClientRect().right <= lim); };
    if (pie) pags.forEach((p, k) => { const c = k ? pie.cloneNode(true) : pie; c.removeAttribute('id'); c.classList.add('pie-fijo'); p.appendChild(c); });
    // El pie cambia de alto según el ancho de la página: se le deja su sitio cada vez que cambia la escala
    const escala = (p, z) => { p.style.width = (${W} / z) + 'px'; p.style.height = 'auto'; p.style.zoom = z;
      const f = p.querySelector('.pie-fijo'); if (f) p.style.paddingBottom = (f.offsetHeight + 26) + 'px'; };
    for (const p of pags) {
      if (${a4}) {
        // A4: la mayor escala (también por encima de 1) con la que la página cabe entera, para no dejar hueco
        let lo = 0.5, hi = 1.15;
        for (let k = 0; k < 14; k++) { const z = (lo + hi) / 2; escala(p, z); if (p.scrollHeight * z <= ${H} && cabeAncho(p)) lo = z; else hi = z; }
        p._z = lo;
        continue;
      }
      const alto = p.scrollHeight;
      p._z = alto > ${H} ? ${H} / alto : 1;
      if (p._z < 1) { p.style.width = (${W} / p._z) + 'px'; p.style.height = (${H} / p._z) + 'px'; p.style.zoom = p._z; }
    }
    // A4 con varias páginas: todas con la misma escala (la de la que menos admite), para que la letra no cambie de una a otra
    if (${a4}) { const z = Math.min(...pags.map(p => p._z)); for (const p of pags) { p._z = z; escala(p, z); p.style.height = (${H} / z) + 'px'; } document.body.dataset.escala = z.toFixed(2); }
    const NS = 'http://www.w3.org/2000/svg';
    for (const p of pags) {
      const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'flechas');
      svg.setAttribute('width', 3000); svg.setAttribute('height', 3000);
      svg.innerHTML = '<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#475569"/></marker></defs>';
      p.appendChild(svg); p._svg = svg;
    }
    const caja = id => { const e = document.getElementById('box_' + id); const p = e.closest('.pagina'); const r = e.getBoundingClientRect(), rp = p.getBoundingClientRect();
      const z = p._z || 1; // con zoom, las medidas del navegador vienen escaladas; el SVG vive dentro de la página sin escalar
      return { p, x: (r.left - rp.left) / z, y: (r.top - rp.top) / z, w: r.width / z, h: r.height / z, banda: e.closest('.banda') }; };
    const linea = (svg, pts, txt, tx, ty) => {
      const d = document.createElementNS(NS, 'path');
      d.setAttribute('d', 'M' + pts.map(q => q.join(' ')).join(' L'));
      d.setAttribute('fill', 'none'); d.setAttribute('stroke', '#475569'); d.setAttribute('stroke-width', '${a4 ? 1.8 : 2.5}'); d.setAttribute('stroke-linejoin', 'round'); d.setAttribute('marker-end', 'url(#ah)');
      svg.appendChild(d);
      if (txt) { const t = document.createElementNS(NS, 'text'); t.setAttribute('x', tx); t.setAttribute('y', ty); t.setAttribute('text-anchor', 'middle');
        t.setAttribute('font-size', '${a4 ? 10 : 12}'); t.setAttribute('font-weight', 'bold'); t.setAttribute('fill', '#475569'); t.setAttribute('font-family', 'Helvetica, Arial, sans-serif'); t.textContent = txt; svg.appendChild(t); }
    };
    for (const f of FLECHAS) {
      const a = caja(f.de), b = caja(f.a);
      if (${a4} && f.tipo === 'vuelve' && a.banda !== b.banda) continue; // ya está el conector de texto
      if (${a4} && f.tipo === 'sig' && a.banda !== b.banda) { // ya está el conector de texto
        const n = a.banda.querySelector('.conecta-sale');
        if (a.p !== b.p && n && !n.dataset.pag) { n.dataset.pag = 1; n.textContent = n.textContent.replace(' ↓', ', en la página siguiente →'); }
        continue; }
      if (a.p !== b.p) { // cambia de página: una nota en lugar de la flecha
        if (!a.banda.querySelector('.continua')) { const n = document.createElement('div'); n.className = 'continua'; n.textContent = 'continúa en la página siguiente →'; a.banda.appendChild(n); }
        continue; }
      const svg = a.p._svg;
      if (f.tipo === 'sig' && a.banda === b.banda) {
        const y = a.y + Math.min(a.h / 2, 40);
        linea(svg, [[a.x + a.w, y], [b.x - 4, y]], f.txt, (a.x + a.w + b.x) / 2, y - 7);
      } else if (f.tipo === 'sig') { // salto de banda: baja por el hueco y entra por la izquierda
        const fondo = (a.banda.getBoundingClientRect().bottom - a.p.getBoundingClientRect().top) / (a.p._z || 1) + 12;
        const y = b.y + Math.min(b.h / 2, 40);
        linea(svg, [[a.x + a.w, a.y + 30], [a.x + a.w + 22, a.y + 30], [a.x + a.w + 22, fondo], [b.x - 22, fondo], [b.x - 22, y], [b.x - 4, y]], f.txt, a.x + a.w + ${a4 ? 16 : 40}, fondo - 6);
        if (${a4}) svg.lastChild.setAttribute('text-anchor', 'end');
      } else if (f.tipo === 'entra') {
        const x0 = a.x + 26, y1 = b.y + Math.min(b.h / 2, 34);
        const xe = b.x > x0 ? b.x - 4 : b.x + b.w + 4;
        linea(svg, [[x0, a.y], [x0, y1], [xe, y1]], f.txt, x0 - ${a4 ? 6 : 16}, (a.y + y1) / 2);
        if (${a4}) svg.lastChild.setAttribute('text-anchor', 'end');
      } else if (f.tipo === 'cadena') {
        const y = a.y + Math.min(a.h / 2, 34);
        linea(svg, [[a.x + a.w, y], [b.x - 4, y]]);
      } else if (f.tipo === 'vuelve') {
        const y0 = a.y + Math.min(a.h / 2, 34), xr = a.x + a.w + 26, yb = b.y - 16, xb = b.x + b.w / 2;
        linea(svg, [[a.x + a.w, y0], [xr, y0], [xr, yb], [xb, yb], [xb, b.y - 4]]);
      }
    }
  })();
  </script>`;
}

// ── Fase 4b · confirmación ───────────────────────────────────────────────────
function lrTxt(t) {
  const lr = lrEfectiva(t);
  const cuenta = t.tipo !== 'pronostico';   // un test pronóstico nunca entra en la puntuación
  const f = (v, o, util) => v == null ? '—' : `<span class="${util && cuenta ? 'util' : 'debil'}">${o === 'calculada' ? '≈' : ''}${fmtLR(v)}</span>`;
  return [f(lr.pos, lr.origenPos, lr.posUtil), f(lr.neg, lr.origenNeg, lr.negUtil)];
}
export function htmlConfirmacion(region, { vertical = false } = {}) {
  const W = vertical ? 794 : 1123, H = vertical ? 1123 : 794;
  const hyps = Object.values(HYPOTHESES).filter(h => h.region === region);
  const bloques = hyps.map(h => {
    const clusters = Object.entries(h.clusters || {}).map(([cid, c]) => {
      const n = h.tests.filter(t => t.cluster === cid).length;
      const lr = lrEfectiva(c);
      const reglas = [lr.posUtil ? `≥${c.umbralPos} de ${n} positivos → LR+ ${fmtLR(lr.pos)}` : '', lr.negUtil && c.umbralNeg != null ? `${c.umbralNeg === 0 ? 'ninguno' : `≤${c.umbralNeg}`} de ${n} positivos (todos hechos) → LR− ${fmtLR(lr.neg)}` : ''].filter(Boolean).join(' · ');
      return `<tr class="cl"><td colspan="4">🧩 <b>${esc(c.nombre)}</b>: ${reglas || 'sin LR aplicable'}</td></tr>`;
    }).join('');
    const filas = h.tests.map(t => {
      const [pos, neg] = t.cluster ? ['', ''] : lrTxt(t);
      const papel = t.tipo === 'pronostico' ? 'pronóstico' : t.cluster ? 'en clúster' : testPuntua(h, t) ? '<b class="si">puntúa</b>' : 'hallazgo';
      return `<tr><td>${esc(t.name)}</td><td class="c">${pos}</td><td class="c">${neg}</td><td class="c">${papel}</td></tr>`;
    }).join('');
    return `<section class="hyp"><h2><span class="num">${esc(numeroHipotesis(h.num))}</span> ${esc(h.name)}</h2>
      <table><thead><tr><th>Test</th><th>LR+</th><th>LR−</th><th>Papel</th></tr></thead><tbody>${clusters}${filas}</tbody></table></section>`;
  }).join('');
  return `<style>${CSS}
    @page { size: A4 ${vertical ? 'portrait' : 'landscape'}; margin: 0; }
    body { font-size: 10px; }
    .pagina { position: relative; width: ${W}px; height: ${H}px; padding: 18px 24px; overflow: hidden; page-break-after: always; }
    .pagina:last-child { page-break-after: auto; }
    h1, .grupo { font-size: 19px; font-weight: bold; margin: 0 0 6px; }
    .cols { column-count: 2; column-gap: 10px; }
    .hyp { break-inside: avoid; border: 1.5px solid #7c4ddb; border-radius: 8px; padding: 5px 7px; margin: 0 0 7px; }
    /* El número, centrado en la primera línea del nombre: margin-top = (alto de línea − círculo) / 2 (medido) */
    .hyp h2 { font-size: 12px; line-height: 1.25; margin: 0 0 3px; display: flex; gap: 5px; align-items: flex-start; }
    .hyp h2 .num { flex: none; margin-top: -2.2px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 8.5px; color: #6b7280; border-bottom: 1px solid #cbd5e1; }
    td { border-bottom: 1px solid #eef2f7; padding: 1px 2px; vertical-align: top; }
    td.c, th:not(:first-child) { text-align: center; white-space: nowrap; width: 52px; }
    .util { font-weight: bold; color: #0f7a55; } .debil { color: #9ca3af; } b.si { color: #0f7a55; }
    tr.cl td { background: #f6f1ff; }
    .pie-fijo { position: absolute; left: 24px; right: 24px; bottom: 12px; border-top: 1px solid #cbd5e1; padding-top: 5px; font-size: 9.5px; color: #374151; }
    .pie-fijo .gen { color: #6b7280; font-size: 8.5px; margin-top: 2px; }
  </style>
  <div class="pagina" data-grupo="hipotesis">
    <div class="cab-hoja"><div class="cab-txt">
    <h1>Confirmación de hipótesis · ${NOMBRES[region]}</h1>
    <div class="sub">PhysiQ-Assessment · fase 4b. Los tests de cada hipótesis, sus LR y si puntúan. El criterio de cada test, por qué se hace, sus fuentes, «Ampliar con IA» y una calculadora que puntúa cada hipótesis con los tests que marques, en la guía de consulta (QR).</div>
    </div>${qrGuia(region, 'confirmacion')}</div>
    <div class="cols">${bloques}</div>
    <div class="pie-fijo">LR en <b class="util">verde</b>: multiplica la puntuación (LR+ ≥ 2 o LR− ≤ 0,5); en <span class="debil">gris</span>: no informativa, cuenta como hallazgo. «≈» = calculada de S y E. <b class="si">puntúa</b>: puede mover la puntuación · hallazgo: sin LR aplicable · en clúster: solo cuenta con su clúster 🧩 · pronóstico: no entra en la puntuación. Criterio completo de cada test, fuentes y calculadora de la puntuación, en la guía (QR).
      <div class="gen">PhysiQ-Assessment · fase 4b · ${NOMBRES[region]}. Generado desde los datos de la app el ${FECHA}. ${AUTORIA_HTML}</div></div>
  </div>
  ${scriptAjuste(W, H, '.hyp')}`;
}

// ── Tiempos de recuperación de tejidos (A4 vertical, una hoja por tema) ──────
// Las mismas barras que el panel ⏱ de la app (lib/tejidos.js): columna de inicio a fin
// del eje no lineal, color = gravedad, relleno = qué mide. Las notas y las fuentes de
// cada barra no caben: van en la guía (QR). Una sola página, a la mayor escala que cabe.
const COLOR_GRAVEDAD = { minima: 'rgba(234,120,30,.35)', leve: 'rgba(234,120,30,.55)', moderada: 'rgba(214,72,36,.8)', grave: 'rgba(176,26,26,.9)' };
const RELLENO = {
  liso: '', contorno: 'background:none!important;box-shadow:inset 0 0 0 1.6px currentColor;',
  rayado: 'background-image:repeating-linear-gradient(135deg,transparent 0 3px,#fff 3px 4.6px);',
  punteado: 'background-image:radial-gradient(#fff 1px,transparent 1.3px);background-size:4.5px 4.5px;',
  degradado: 'background-image:linear-gradient(90deg,transparent 35%,#fff 100%);',
};
const COLOR_FASE = ['#a16207', '#16a34a', '#2563eb', '#93c5fd'];
export function htmlTejidos(hoja) {
  const T = datosHojaTejido(TIEMPOS_TEJIDO, hoja), n = T.columnas.length;
  const barra = (f, g) => {
    const c = COLOR_GRAVEDAD[g] || COLOR_GRAVEDAD.leve, r = RELLENO[T.medidas[f.mide]?.relleno] || '';
    return `<div class="pista">${'<i></i>'.repeat(n)}<b style="left:${f.desde * 100 / n}%;width:${(f.hasta - f.desde + 1) * 100 / n}%;background:${c};color:${c};${r}"></b></div>`;
  };
  const filas = T.grupos.map(g => `<div class="grupo">${esc(g.tejido)}</div>` + g.filas.map(f => {
    const conBarra = tieneBarra(f);
    return `<div class="fila${conBarra ? '' : ' sin'}"><span class="nom">${esc(f.nombre)}</span>${conBarra ? barra(f, f.gravedad)
      : `<span class="nota">${f.subtipos?.length ? 'Sin barra general: ver los subtipos' : 'Sin barra: ver la guía (QR)'}</span>`}</div>`
      + (f.subtipos || []).filter(tieneBarra).map(st => `<div class="fila subfila"><span class="nom">${esc(st.nombre)}</span>${barra(st, st.gravedad || f.gravedad)}</div>`).join('');
  }).join('') + (g.nota ? `<div class="nota-grupo">${esc(g.nota)}</div>` : '')).join('');
  const fases = T.fases.map((f, k) => {
    const a = posicionDia(f.desdeDia, T.columnas) * 100, b = posicionDia(f.hastaDia, T.columnas) * 100;
    return `<b style="left:${a}%;width:${b - a}%;background:${COLOR_FASE[k]}"></b>`;
  }).join('');
  const muestra = estilo => `<i class="m" style="${estilo}"></i>`;
  const W = 794, H = 1123;
  return `<style>
    ${CSS}
    @page { size: A4; margin: 0; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .pagina { width: ${W}px; height: ${H}px; padding: 34px 38px 0; display: flex; flex-direction: column; overflow: hidden; }
    .cuerpo { flex: 1 1 auto; min-height: 0; }
    .fila { display: grid; grid-template-columns: 34% 1fr; align-items: center; min-height: 16px; border-bottom: 1px solid #eef2f7; }
    .fila .nom { font-size: 10px; padding-right: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .fila.subfila .nom { padding-left: 12px; color: #4b5563; font-size: 9.5px; }
    .fila.sin .nom { font-weight: bold; } .nota { font-size: 8.5px; color: #94a3b8; font-style: italic; }
    .nota-grupo { font-size: 8.5px; color: #64748b; font-style: italic; padding: 2px 0 1px; }
    .pista { position: relative; height: 12px; display: grid; grid-template-columns: repeat(${n}, 1fr); }
    .pista i { border-left: 1px solid #e2e8f0; font-style: normal; }
    .pista b { position: absolute; top: 1px; bottom: 1px; border-radius: 3px; }
    .eje { border-bottom: 1.5px solid #94a3b8; } .eje .pista { height: 15px; }
    .eje .pista i { font-size: 9px; color: #475569; padding-left: 3px; font-family: monospace; }
    .fases-t { font-size: 9px !important; color: #64748b; } .tira { height: 7px; } .tira b { top: 0; bottom: 0; border-radius: 0; }
    .grupo { font-size: 10.5px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #2563eb; margin-top: 7px; border-bottom: 1.5px solid #bfdbfe; padding-bottom: 1px; }
    .pie-fijo { flex: none; border-top: 1.5px solid #cbd5e1; padding: 6px 0 14px; font-size: 9px; color: #334155; display: flex; flex-direction: column; gap: 3px; }
    .m { display: inline-block; width: 15px; height: 8px; border-radius: 2px; vertical-align: middle; margin: 0 3px 0 8px; }
  </style>
  <div class="pagina">
    <div class="cab-hoja"><div class="cab-txt"><h1>Tiempos de recuperación · ${esc(HOJAS_TEJIDO[hoja].titulo)}</h1>
      <div class="sub">Referencia general, no un plazo para este paciente: cada barra dice qué mide (vuelta al deporte, protección, programa…), y con cirugía manda el protocolo del cirujano. La nota y las fuentes de cada barra, en la guía (QR).</div></div>
      <div class="qr-guia">${QR}<span>Notas, fuentes e IA</span>${HUELLA}</div></div>
    <div class="fila eje"><span class="nom"></span><div class="pista">${T.columnas.map(c => `<i>${esc(c.corta)}</i>`).join('')}</div></div>
    <div class="fila"><span class="nom fases-t">Fases de reparación</span><div class="pista tira">${fases}</div></div>
    <div class="cuerpo">${filas}</div>
    <div class="pie-fijo">
      <span><b>Color = gravedad:</b>${Object.entries(T.gravedades).map(([k, v]) => muestra(`background:${COLOR_GRAVEDAD[k]}`) + esc(v)).join('')}</span>
      <span><b>Relleno = qué mide:</b>${Object.entries(T.medidas).filter(([, m]) => !m.marca).map(([, m]) => muestra(`background:#7c8796;color:#7c8796;${RELLENO[m.relleno]}`) + esc(m.etiqueta)).join('')}</span>
      <span><b>Fases de reparación:</b>${T.fases.map((f, k) => muestra(`background:${COLOR_FASE[k]}`) + esc(f.nombre)).join('')} · Eje no lineal: cada columna ocupa lo mismo.</span>
      <span class="pie">Generado desde los datos de la app (data/tejidos.js) el ${FECHA}. La otra hoja: ${esc(Object.entries(HOJAS_TEJIDO).filter(([k]) => k !== hoja).map(([, h]) => h.titulo).join(''))}. ${AUTORIA_HTML}</span>
    </div>
  </div>
  <script>
  (() => {
    // La mayor escala a la que todo cabe en la página (el pie siempre abajo)
    const p = document.querySelector('.pagina'), c = p.querySelector('.cuerpo');
    const cabe = z => { p.style.zoom = z; p.style.width = (${W} / z) + 'px'; p.style.height = (${H} / z) + 'px'; return c.scrollHeight <= c.clientHeight + 1; };
    let lo = 0.6, hi = 1.5; for (let i = 0; i < 14; i++) { const z = (lo + hi) / 2; if (cabe(z)) lo = z; else hi = z; }
    cabe(lo); document.body.dataset.escala = lo.toFixed(2);
  })();
  </script>`;
}

// ── Hojas de una página (condiciones, fármacos, irritabilidad) ───────────────
// Página A4 vertical con cabecera (título, subtítulo, QR), cuerpo y pie fijo abajo;
// el script la deja a la mayor escala a la que el cuerpo cabe.
const CSS_UNA = `
  @page { size: A4; margin: 0; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pagina { width: 794px; height: 1123px; padding: 34px 38px 0; display: flex; flex-direction: column; overflow: hidden; }
  .cuerpo { flex: 1 1 auto; min-height: 0; }
  .pie-fijo { flex: none; border-top: 1.5px solid #cbd5e1; padding: 6px 0 14px; font-size: 9px; color: #334155; display: flex; flex-direction: column; gap: 3px; }
`;
function paginaUna({ titulo, sub, qr, cuerpo, pie, css = '' }) {
  return `<style>${CSS}${CSS_UNA}${css}</style>
  <div class="pagina">
    <div class="cab-hoja"><div class="cab-txt"><h1>${titulo}</h1><div class="sub">${sub}</div></div>
      <div class="qr-guia">${QR}<span>${qr}</span>${HUELLA}</div></div>
    <div class="cuerpo">${cuerpo}</div>
    <div class="pie-fijo">${pie}</div>
  </div>
  <script>
  (() => {
    const p = document.querySelector('.pagina'), c = p.querySelector('.cuerpo');
    const cabe = z => { p.style.zoom = z; p.style.width = (794 / z) + 'px'; p.style.height = (1123 / z) + 'px'; return c.scrollHeight <= c.clientHeight + 1; };
    let lo = 0.6, hi = 1.5; for (let i = 0; i < 14; i++) { const z = (lo + hi) / 2; if (cabe(z)) lo = z; else hi = z; }
    cabe(lo); document.body.dataset.escala = lo.toFixed(2);
  })();
  </script>`;
}

// Título de una tarjeta de la fase 1 (index.html): dónde se marca cada condición, sin copiarlo a mano
const INDEX_HTML = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
function tituloTarjeta(id) {
  const i = INDEX_HTML.indexOf(`id="${id}"`);
  const m = i < 0 ? null : /class="card-title"[^>]*>([^<]+)</.exec(INDEX_HTML.slice(i, i + 1500));
  return m ? m[1].trim() : id;
}

// ── Condiciones especiales (la guía de la cabecera, data/condiciones.js) ─────
export function htmlCondiciones() {
  const T = TEXTOS_CONDICIONES;
  // En papel: dónde están sus preguntas; en la app: dónde se marca. Las que tienen calculadora
  // en el cribado de la guía (guia-calc.js, CALC_SISTEMA) lo dicen
  const CON_CALCULADORA = ['hipermovilidad', 'disautonomia', 'embarazo'];
  // Lo que la guía añade a la hoja de cribado de cada condición (lib/guia-condiciones.js)
  const CON_BLOQUES = ['disautonomia', 'lupus', 'osteoporosis', 'embarazo'];
  const enGuia = c => c.id === 'posquirurgico' ? '; la tarjeta «Cirugía», en la hoja de fase 1' : `; ${[CON_BLOQUES.includes(c.id) ? 'sus otras preguntas' : '', CON_CALCULADORA.includes(c.id) ? 'la calculadora' : '', 'las líneas de la exploración', 'las recomendaciones'].filter(Boolean).join(', ').replace(/, ([^,]+)$/, ' y $1')}, en la guía (QR)`;
  const donde = c => c.destino?.tarjeta
    ? `En papel: su bloque en la página 2 de la hoja de cribado${enGuia(c)} · En la app: fase 1, tarjeta «${esc(tituloTarjeta(c.destino.tarjeta))}»${c.id === 'posquirurgico' ? ' → Post-quirúrgico' : ''}${c.enPlan ? ` · Plan (fase 6): ${esc(c.enPlan)}, en la guía (Plan de tratamiento) o en la app` : ''}`
    : `En papel: su pregunta en la hoja de cribado de ${esc(nombreRegion(c.region).toLowerCase())} · En la app: fase 2, la misma pregunta`;
  const tarjeta = c => `<section class="cond">
    <h2>${esc(c.nombre)}</h2>
    <p class="que">${esc(c.que)}</p>
    <div class="piensa">${esc(c.piensa)}</div>
    <ul>${c.pistas.map(p => `<li>${esc(p.texto)}</li>`).join('')}</ul>
    <p class="anade"><b>Si la tiene, añade:</b> ${esc(c.anade)}</p>
    <p class="donde">${donde(c)}</p>
  </section>`;
  const transversales = CONDICIONES.filter(c => !c.region);
  // Las de una sola región, juntas en una fila de tres, con la región en su cabecera
  const deRegion = CONDICIONES.filter(c => c.region);
  const cuerpo = `<div class="rejilla">${transversales.map(tarjeta).join('')}</div>`
    + (deRegion.length ? `<div class="grupo-reg">${esc(T.grupoRegion.replace('{region}', 'una región'))}</div>
      <div class="rejilla rejilla-3">${deRegion.map(c => tarjeta(c).replace('<h2>', `<h2><span class="reg">${esc(nombreRegion(c.region))}</span>`)).join('')}</div>` : '');
  return paginaUna({
    titulo: esc(T.titulo),
    sub: `Situaciones que cambian el cribado y el plan. Si una encaja, pregunta su bloque de la página 2 de la hoja de cribado (en la app, márcala y añade lo que necesita). Si el paciente ya tiene el diagnóstico, cuenta siempre con ella.`,
    qr: 'Qué es, fuentes e IA',
    cuerpo,
    pie: `<span>${esc(T.pie)} Las fuentes de cada condición, en la guía (QR).</span><span class="pie">Generado desde los datos de la app (data/condiciones.js) el ${FECHA}. ${AUTORIA_HTML}</span>`,
    css: `
      .rejilla { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .cond { border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 7px 9px; break-inside: avoid; }
      .cond h2 { font-size: 12.5px; margin: 0 0 2px; color: #1e3a8a; }
      .que { margin: 0 0 4px; color: #374151; }
      .piensa { font-weight: bold; font-size: 10px; color: #7c4ddb; }
      .cond ul { margin: 1px 0 4px; padding-left: 15px; } .cond li { margin: 0; }
      .anade { margin: 0 0 3px; color: #4b5563; font-size: 9.5px; }
      .donde { margin: 0; font-size: 9.5px; color: #1f2937; background: #eef2ff; border-radius: 4px; padding: 2px 6px; display: inline-block; }
      .rejilla-3 { grid-template-columns: 1fr 1fr 1fr; }
      .reg { display: inline-block; font-size: 8.5px; font-weight: bold; text-transform: uppercase; letter-spacing: .5px; color: #fff; background: #2563eb; border-radius: 6px; padding: 0 5px; margin-right: 5px; vertical-align: 1px; }
      .grupo-reg { font-size: 10.5px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #2563eb; margin: 10px 0 5px; border-bottom: 1.5px solid #bfdbfe; padding-bottom: 1px; }`,
  });
}

// ── Hojas de varias páginas (fármacos): tarjetas en dos columnas que pasan de página ──
// El script reparte las tarjetas por orden (cada una entera en su columna) y busca la mayor
// escala con la que caben en `maxPaginas`; la cabecera con el QR, solo en la primera.
function paginasVarias({ titulo, tituloCont, sub, qr, tarjetas, pie, css = '', maxPaginas = 2 }) {
  return `<style>${CSS}${CSS_UNA}
    .pagina + .pagina { break-before: page; }
    .cuerpo { column-count: 2; column-gap: 12px; column-fill: auto; overflow: hidden; }
    .tarjeta { break-inside: avoid; margin-bottom: 8px; }
    .cont { font-size: 15px; font-weight: bold; margin: 0 0 6px; color: #475569; }
    ${css}</style>
  <div id="tarjetas" hidden>${tarjetas.join('')}</div>
  <template id="tCab"><div class="cab-hoja"><div class="cab-txt"><h1>${titulo}</h1><div class="sub">${sub}</div></div>
    <div class="qr-guia">${QR}<span>${qr}</span>${HUELLA}</div></div></template>
  <template id="tPie"><div class="pie-fijo">${pie}</div></template>
  <script>
  (() => {
    const fuente = document.getElementById('tarjetas'), MAX = ${maxPaginas};
    const todas = [...fuente.children];
    const nueva = (n, z) => {
      const p = document.createElement('div'); p.className = 'pagina';
      p.innerHTML = (n === 1 ? document.getElementById('tCab').innerHTML : '<div class="cont">${tituloCont}</div>')
        + '<div class="cuerpo"></div>' + document.getElementById('tPie').innerHTML;
      p.style.zoom = z; p.style.width = (794 / z) + 'px'; p.style.height = (1123 / z) + 'px';
      document.body.appendChild(p); return p.querySelector('.cuerpo');
    };
    const desborda = c => c.scrollWidth > c.clientWidth + 1;
    const repartir = z => {
      document.querySelectorAll('.pagina').forEach(p => p.remove());
      let n = 1, c = nueva(1, z);
      for (const t of todas) {
        c.appendChild(t);
        if (desborda(c)) { if (c.children.length === 1 || n >= MAX) return false; n++; c = nueva(n, z); c.appendChild(t); if (desborda(c)) return false; }
      }
      return true;
    };
    let lo = 0.55, hi = 1.4; for (let i = 0; i < 14; i++) { const z = (lo + hi) / 2; if (repartir(z)) lo = z; else hi = z; }
    repartir(lo); document.body.dataset.escala = lo.toFixed(2);
  })();
  </script>`;
}

// ── Fármacos: qué vigilar en el plan (data/farmacos.js + data/farmacos-paciente.js) ──
// Por familia, sus ejemplos y las frases del aviso de la fase 6 (copiadas literales de la
// guía, con su cita). La guía completa de cada familia, en el QR. Los antitrombóticos no
// tienen aviso propio: los cubre su tarjeta de la fase 1.
export function htmlFarmacos() {
  const fichas = FAMILIAS_FARMACO.filter(f => f.apartados).map(f => {
    const fp = FAMILIAS_PACIENTE[f.id];
    const cuerpo = fp?.plan?.length
      ? `<ul>${fp.plan.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`
      : f.id === 'antitromboticos'
        ? `<p class="remite">Se marcan en su propia tarjeta de la fase 1, «${esc(tituloTarjeta('cardAnticoagulado'))}», que añade su cribado, sus avisos y su red de seguridad (ver también la hoja de condiciones especiales).</p>`
        : '<p class="remite">Sin aviso para el plan: ver la guía (QR).</p>';
    return `<section class="tarjeta farm"><h2>${esc(f.nombre)}</h2><p class="ej">${esc(f.ejemplos)}</p>${cuerpo}</section>`;
  });
  return paginasVarias({
    titulo: 'Fármacos: qué vigilar en el plan',
    tituloCont: 'Fármacos: qué vigilar en el plan (cont.)',
    sub: `${esc(TEXTOS_FARMACOS_PACIENTE.lineaComun)} Aquí, lo que cambia el plan de tratamiento; cómo afecta cada familia al dolor, los síntomas viscerales, el ejercicio y el sueño, y su ficha técnica (CIMA), en la guía (QR).`,
    qr: 'Guía completa e IA',
    tarjetas: fichas,
    pie: `<span>${esc(TEXTOS_FARMACOS.limites)}</span><span class="pie">Generado desde los datos de la app (data/farmacos.js, data/farmacos-paciente.js) el ${FECHA}. ${AUTORIA_HTML}</span>`,
    css: `
      .farm { border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 6px 9px; }
      .farm h2 { font-size: 12px; margin: 0 0 1px; color: #1e3a8a; }
      .ej { margin: 0 0 3px; font-size: 9px; color: #6b7280; font-style: italic; }
      .farm ul { margin: 0; padding-left: 14px; } .farm li { margin: 0 0 2px; }
      .remite { margin: 0; color: #4b5563; }`,
  });
}

// ── Irritabilidad (fase 3): la matriz para marcar en papel, la regla y qué implica cada nivel ──
export function htmlIrritabilidad() {
  const T = TEXTOS_IRRITABILIDAD;
  const filas = ITEMS_IRRITABILIDAD.map(it => `<tr><th>${esc(it.nombre)}${it.ayuda ? `<div class="ayuda">${esc(it.ayuda)}</div>` : ''}</th>
    ${it.opciones.map((o, i) => `<td><span class="caja"></span><span class="n">${i}</span> ${esc(o.valor)}</td>`).join('')}</tr>`).join('');
  const nivel = (n, clase, textos) => `<div class="nivel ${clase}"><b>${n}</b>${textos.map(t => `<p>${esc(t)}</p>`).join('')}</div>`;
  return paginaUna({
    titulo: 'Irritabilidad (fase 3)',
    sub: `La misma matriz y la misma regla que la app (fases 3 y 6). Marca una casilla por fila. ${esc(T.pistaBreve)}`,
    qr: 'Calculadora e IA',
    cuerpo: `<table class="matriz"><thead><tr><th></th><th>0</th><th>1</th><th>2</th></tr></thead><tbody>${filas}</tbody></table>
      <div class="regla"><h2>Cómo se calcula</h2>${reglaIrritabilidad().map(p => `<p>${p}</p>`).join('')}
        <div class="calc"><span>Suelo (tiempo en calmarse): ____</span><span>Reposo + movimiento + tolerancia = ____ → ____</span><span><b>Nivel</b> (el más alto): ____</span></div></div>
      <h2 class="t-niveles">Qué implica cada nivel</h2>
      <div class="niveles">${nivel('Baja', 'baja', [T.hastaLimite])}${nivel('Moderada', 'moderada', [T.hastaDolor])}${nivel('Alta', 'alta', [T.hastaDolor, T.alta])}</div>
      <p class="margen">${esc(T.margen)} ${esc(T.incompleta)}</p>`,
    pie: `<span>El impacto en las actividades (${ITEM_IMPACTO.opciones.map(o => esc(o.valor).toLowerCase()).join(' · ')}) es gravedad: se anota aparte, junto al NRS.</span><span class="pie">Generado desde los datos de la app (data/irritabilidad.js, lib/irritabilidad.js) el ${FECHA}. ${AUTORIA_HTML}</span>`,
    css: `
      body { font-size: 11.5px; }
      .matriz { width: 100%; border-collapse: collapse; margin: 4px 0 12px; }
      .matriz th, .matriz td { border: 1.5px solid #cbd5e1; padding: 8px 8px; text-align: left; vertical-align: top; }
      .matriz thead th { background: #eef2ff; text-align: center; font-size: 11px; color: #3730a3; padding: 4px; }
      .matriz tbody th { width: 30%; font-size: 12.5px; }
      .ayuda { font-weight: normal; font-size: 9.5px; color: #6b7280; margin-top: 3px; }
      .caja { display: inline-block; width: 13px; height: 13px; border: 1.6px solid #475569; border-radius: 3px; vertical-align: -2px; margin-right: 4px; }
      .n { display: inline-block; min-width: 15px; height: 15px; border-radius: 8px; background: #7c4ddb; color: #fff; text-align: center; font-size: 9.5px; font-weight: bold; line-height: 15px; margin-right: 3px; }
      h2 { font-size: 14px; margin: 0 0 5px; color: #1e3a8a; }
      .regla { border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; margin-bottom: 12px; } .regla p { margin: 0 0 5px; }
      .calc { display: flex; flex-wrap: wrap; gap: 6px 22px; margin-top: 6px; padding-top: 6px; border-top: 1px dashed #cbd5e1; font-size: 11px; }
      .niveles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .nivel { border-radius: 8px; padding: 8px 10px; border: 1.5px solid; } .nivel b { font-size: 13px; } .nivel p { margin: 4px 0 0; font-size: 10.5px; }
      .nivel.baja { border-color: #16a34a; background: #f0fdf4; } .nivel.baja b { color: #15803d; }
      .nivel.moderada { border-color: #ea580c; background: #fff7ed; } .nivel.moderada b { color: #c2410c; }
      .nivel.alta { border-color: #dc2626; background: #fef2f2; } .nivel.alta b { color: #b91c1c; }
      .margen { color: #4b5563; font-size: 10px; margin: 10px 0 0; }`,
  });
}

// ── El ejercicio, para el paciente (data/ejercicio.js) ───────────────────────
// Las frases «Para explicárselo al paciente» de cada bloque, literales (todas se apoyan en
// afirmaciones de nivel clínico: lo comprueba problemasBloque), bajo el título en lenguaje
// llano de su bloque; las de una condición, aparte. Sin QR: la guía es para el fisioterapeuta.
// Lleva su versión («v.»), así que la prueba de hojas desfasadas la cubre igual.
export function htmlEjercicioPaciente() {
  const T = TEXTOS_EJERCICIO;
  const escritos = BLOQUES_EJERCICIO.filter(b => b.apartados?.paciente?.length);
  const bloque = b => `<section class="bloque"><h2>${esc(b.tituloPaciente || b.titulo)}</h2>
    <ul>${b.apartados.paciente.map(f => `<li>${esc(f.t)}</li>`).join('')}</ul></section>`;
  const generales = escritos.filter(b => b.hojaPaciente !== 'condicion');
  const condiciones = escritos.filter(b => b.hojaPaciente === 'condicion');
  return `<style>${CSS}${CSS_UNA}
    body { font-size: 13px; line-height: 1.45; }
    h1 { font-size: 24px; } .sub { font-size: 12.5px; color: #4b5563; margin-bottom: 12px; }
    .bloque { margin-bottom: 12px; break-inside: avoid; }
    .bloque h2 { font-size: 15px; margin: 0 0 4px; color: #1e3a8a; }
    .bloque ul { margin: 0; padding-left: 18px; } .bloque li { margin: 0 0 4px; }
    .grupo-c { font-size: 13px; font-weight: bold; letter-spacing: .5px; text-transform: uppercase; color: #2563eb; margin: 16px 0 8px; border-bottom: 1.5px solid #bfdbfe; padding-bottom: 2px; }
    .condiciones { display: grid; grid-template-columns: 1fr 1fr; gap: 0 18px; }
    .condiciones .bloque h2 { font-size: 13.5px; } .condiciones .bloque { font-size: 12px; }
    .mis { border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 8px 12px 10px; margin-top: 10px; }
    .mis h2 { font-size: 14px; margin: 0 0 4px; color: #1e3a8a; }
    .linea { border-bottom: 1px solid #94a3b8; height: 26px; }
    .pie-v .qr-huella { display: inline; margin-left: 4px; }
    .pie-v .autoria { display: inline; }
    .su-fisio { font-size: 12px; color: #1f2937; margin: 4px 0 2px; }
  </style>
  <div class="pagina">
    <h1>${esc(T.hojaPacienteTitulo)}</h1>
    <div class="sub">${esc(T.hojaPacienteIntro)}</div>
    <div class="cuerpo">
      ${generales.map(bloque).join('')}
      ${condiciones.length ? `<div class="grupo-c">${esc(T.hojaPacienteCondiciones)}</div><div class="condiciones">${condiciones.map(bloque).join('')}</div>` : ''}
      <div class="mis"><h2>${esc(T.hojaPacienteMisEjercicios)}</h2>${'<div class="linea"></div>'.repeat(5)}</div>
      <div style="height:12px"></div>
    </div>
    <div class="pie-fijo"><span>${esc(T.hojaPacientePie)}</span><span class="su-fisio">Su fisioterapeuta: ______________________________</span><span class="pie pie-v">${AUTORIA_HTML} · ${FECHA} ${HUELLA}</span></div>
  </div>
  <script>
  (() => {
    const p = document.querySelector('.pagina'), c = p.querySelector('.cuerpo');
    const cabe = z => { p.style.zoom = z; p.style.width = (794 / z) + 'px'; p.style.height = (1123 / z) + 'px'; return c.scrollHeight <= c.clientHeight + 1; };
    let lo = 0.6, hi = 1.3; for (let i = 0; i < 14; i++) { const z = (lo + hi) / 2; if (cabe(z)) lo = z; else hi = z; }
    cabe(lo); document.body.dataset.escala = lo.toFixed(2);
  })();
  </script>`;
}

// ── Formulario del paciente en papel (formularios/*.js) ─────────────────────
// Para dar al paciente: la cara común o la de una región, con las preguntas tal cual las
// tiene la app (en tú: en la app las hace el fisio). Una casilla por opción, una fila por línea
// de las matrices, la escala 0–10 y líneas para el texto libre. Sin QR (la guía es para el
// fisioterapeuta) y fuera de los cuadernos; lleva su versión («v.») como las demás. Tantas
// páginas como haga falta, a tamaño de lectura fijo: el paciente no tiene que forzar la vista.
export function htmlFormularioPaciente(id) {
  const f = FORMULARIOS[id];
  const num = numerosFormulario(f, id === 'comun' ? 'G' : 'R');
  const textoDe = {};
  for (const sec of f.secciones) for (const it of sec.items) textoDe[it.id] = it.texto;
  const caja = '<span class="caja"></span>';
  const opcion = o => `<span class="op">${caja}${esc(o)}</span>`;
  const lineas = n => '<div class="linea"></div>'.repeat(Math.max(1, n || 2));
  let condPrevia = '';
  const item = it => {
    const clave = it.mostrarSi ? JSON.stringify(it.mostrarSi) : '';
    const repetida = clave && clave === condPrevia; condPrevia = clave;
    const cond = it.mostrarSi && !repetida ? `<div class="si">Responde lo siguiente solo si en «${esc(textoDe[it.mostrarSi.id] || it.mostrarSi.id)}» has marcado ${it.mostrarSi.valores.map(v => `«${esc(v)}»`).join(' o ')}:</div>` : '';
    const ayuda = it.ayuda ? `<div class="ayuda">${esc(it.ayuda)}</div>` : '';
    let r = '';
    if (it.tipo === 'unica' || it.tipo === 'multi') {
      r = `<div class="ops">${it.opciones.map(opcion).join('')}</div>`;
      if (it.detalle) r += `<div class="detalle">${esc(it.detalle.etiqueta)} ${lineas(1)}</div>`;
    } else if (it.tipo === 'escala') {
      const nums = []; for (let n = it.min; n <= it.max; n++) nums.push(`<span class="esc-n">${caja}${n}</span>`);
      r = `<div class="escala">${nums.join('')}</div><div class="extremos"><span>${esc(it.min)} = ${esc(it.extremos?.[0])}</span><span>${esc(it.max)} = ${esc(it.extremos?.[1])}</span></div><div class="ops">${opcion('No sabría decir')}</div>`;
    } else if (it.tipo === 'matriz') {
      r = `<table class="mtz"><thead><tr><th></th>${it.opciones.map(o => `<th>${esc(o)}</th>`).join('')}</tr></thead><tbody>${it.filas.map(fl => `<tr><td>${esc(fl.texto)}</td>${it.opciones.map(() => `<td class="c">${caja}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    } else if (it.tipo === 'texto') r = lineas(it.lineas);
    return `<div class="it">${cond}<div class="q"><span class="nq">${num[it.id]}</span>${esc(it.texto)}</div>${ayuda}${r}</div>`;
  };
  // Unidad de reparto: cada pregunta; el título de la sección va pegado a su primera pregunta
  const piezas = f.secciones.flatMap(sec => sec.items.map((it, i) => `<div class="pieza">${i === 0 ? `<h2>${esc(sec.titulo)}</h2>` : ''}${item(it)}</div>`));
  const titulo = id === 'comun' ? 'Antes de empezar: cómo te encuentras' : `Antes de empezar: ${nombreRegion(id).toLowerCase()}`;
  const sub = 'Marca con una cruz lo que mejor te describa. Si algo no lo sabes, marca «No sabría decir» o «No sé». No hace falta que respondas a todo: lo repasaremos juntos en la consulta.';
  return `<style>${CSS}${CSS_UNA}
    .pagina { padding: 34px 44px 0; } .pagina + .pagina { break-before: page; }
    body { font-size: 13px; line-height: 1.4; }
    h1 { font-size: 22px; margin: 0 0 4px; } .sub { font-size: 12px; color: #374151; margin-bottom: 4px; }
    .fecha { font-size: 12px; margin: 6px 0 10px; }
    .cont { font-size: 13px; font-weight: bold; color: #475569; margin: 0 0 8px; }
    .cuerpo { overflow: hidden; }
    h2 { font-size: 14px; color: #1e3a8a; margin: 10px 0 6px; border-bottom: 1.5px solid #bfdbfe; padding-bottom: 2px; }
    .it { margin: 0 0 10px; } .q { font-weight: 600; } .nq { color: #1e3a8a; margin-right: 6px; font-variant-numeric: tabular-nums; } .ayuda { font-size: 11.5px; color: #4b5563; font-style: italic; }
    .si { font-size: 11.5px; color: #1e40af; font-weight: 600; margin: 2px 0 4px; }
    .caja { display: inline-block; width: 12px; height: 12px; border: 1.5px solid #334155; border-radius: 2px; margin-right: 5px; vertical-align: -2px; flex: none; }
    .ops { display: flex; flex-wrap: wrap; gap: 4px 18px; margin-top: 3px; } .op { display: inline-flex; align-items: baseline; }
    .detalle { display: flex; gap: 6px; align-items: flex-end; margin-top: 3px; font-size: 12px; } .detalle .linea { flex: 1; }
    .linea { border-bottom: 1px solid #94a3b8; height: 24px; }
    .escala { display: flex; gap: 14px; margin-top: 4px; } .esc-n { display: inline-flex; align-items: baseline; }
    .extremos { display: flex; justify-content: space-between; font-size: 11px; color: #4b5563; margin: 2px 0; }
    .mtz { border-collapse: collapse; margin-top: 4px; width: 100%; } .mtz th { font-size: 11px; font-weight: 600; padding: 2px 6px; text-align: center; }
    .mtz td { border-top: 1px solid #e5e7eb; padding: 3px 6px; } .mtz td.c { text-align: center; width: 64px; } .mtz td.c .caja { margin: 0; }
    .pie-v .qr-huella { display: inline; margin-left: 4px; } .pie-v .autoria { display: inline; }
  </style>
  <div id="piezas" hidden>${piezas.join('')}</div>
  <template id="tCab"><h1>${esc(titulo)}</h1><div class="sub">${esc(sub)}</div><div class="fecha">Fecha: ____________________</div></template>
  <template id="tPie"><div class="pie-fijo"><span class="pie pie-v">Formulario del paciente · ${esc(id === 'comun' ? 'General' : nombreRegion(id))} · ${AUTORIA_HTML} · ${FECHA} ${HUELLA}</span></div></template>
  <script>
  (() => {
    const todas = [...document.getElementById('piezas').children];
    const nueva = n => {
      const p = document.createElement('div'); p.className = 'pagina';
      p.innerHTML = (n === 1 ? document.getElementById('tCab').innerHTML : '<div class="cont">${esc(titulo)} (cont.)</div>') + '<div class="cuerpo"></div>' + document.getElementById('tPie').innerHTML;
      document.body.appendChild(p); return p.querySelector('.cuerpo');
    };
    let n = 1, c = nueva(1);
    for (const t of todas) { c.appendChild(t); if (c.scrollHeight > c.clientHeight + 1 && c.children.length > 1) { n++; c = nueva(n); c.appendChild(t); } }
    document.body.dataset.escala = '1.00';
  })();
  </script>`;
}
export const FORMULARIOS_PACIENTE = ['comun', ...ORDEN_REGIONES];

// ── Cuadernos (portada con índice y página en blanco; los monta generar.mjs) ──
// `secciones`: [{ titulo, filas: [{ nombre, huella, pagina }] }]. Una página; el QR lleva a
// «Hojas para imprimir», donde se comprueba la versión de cada hoja.
export function htmlPortadaCuaderno({ titulo, portada = {}, secciones, fecha, ordenFecha, huella }) {
  const filas = secciones.map(sec => `<tr class="sec"><td colspan="3">${esc(sec.titulo)}</td></tr>`
    + sec.filas.map(f => `<tr data-pag="${f.pagina}"><td>${esc(f.nombre)}</td><td class="v">v. ${esc(f.huella)}</td><td class="p">${f.paginas} pág.</td></tr>`).join('')).join('');
  return `<style>${CSS}${CSS_UNA}
    .pagina { padding: 28px 28px 0; }
    .banda { background: #1e3a8a; color: #fff; border-radius: 12px; padding: 34px 32px 30px; display: flex; justify-content: space-between; gap: 24px; align-items: flex-end; margin-bottom: 22px; }
    .marca { font-family: monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #bfdbfe; }
    h1 { font-size: 56px; line-height: 1.05; margin: 14px 0 8px; color: #fff; }
    .tit2 { font-size: 15px; color: #dbeafe; line-height: 1.4; }
    .banda .qr-guia { background: #fff; border-radius: 8px; padding: 8px 8px 6px; width: auto; color: #374151; }
    .info { padding: 0 20px; margin-bottom: 14px; }
    .nota { font-size: 11px; color: #374151; line-height: 1.5; }
    .indice { font-family: monospace; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #6b7280; margin: 0 20px 2px; }
    .cuerpo { padding: 0 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
    td { padding: 3px 4px; border-bottom: 1px solid #e5e7eb; } .v { font-family: monospace; font-size: 10px; color: #6b7280; width: 90px; } .p { text-align: right; width: 56px; color: #6b7280; }
    tr.sec td { font-weight: bold; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; font-size: 10.5px; padding-top: 10px; border-bottom: 1.5px solid #bfdbfe; }
  </style>
  <div class="pagina">
    <div class="banda"><div><div class="marca">PhysiQ-Assessment · Cuaderno de consulta</div><h1>${esc(portada.titulo || titulo)}</h1>
      ${portada.subtitulo ? `<div class="tit2">${esc(portada.subtitulo)}</div>` : ''}</div>
      <div class="qr-guia">${QR}<span>Hojas para imprimir</span></div></div>
    <div class="info"><div class="nota">Para imprimir <b>a doble cara</b>: cada hoja empieza en la cara delantera de su propio papel (hay páginas en blanco a propósito) y numera sus páginas por sí misma, abajo en la esquina exterior («Cribado · Lumbar 1/2»). Cada hoja lleva su versión («v.») y su QR a la guía de consulta. Si una hoja cambia, «Hojas para imprimir» lo dice: imprímela (su PDF suelto, o sus páginas de este cuaderno) y sustitúyela junto con esta portada; las demás no cambian aunque ocupe más o menos papel. Solo si allí la fecha de «orden de hojas» es posterior a la de aquí (se añadió, quitó o movió una hoja) hay que reimprimir el cuaderno entero.<br>Último cambio de contenido: <b>${esc(fecha)}</b> · orden de hojas desde: <b>${esc(ordenFecha || fecha)}</b> · cuaderno v. ${esc(huella)}</div></div>
    <div class="indice">Índice</div>
  <div class="cuerpo"><table>${filas}</table></div>
    <div class="pie-fijo">${AUTORIA_HTML}</div>
  </div>
  <script>
  (() => {
    const p = document.querySelector('.pagina'), c = p.querySelector('.cuerpo');
    const cabe = z => { p.style.zoom = z; p.style.width = (794 / z) + 'px'; p.style.height = (1123 / z) + 'px'; return c.scrollHeight <= c.clientHeight + 1; };
    let lo = 0.6, hi = 1.2; for (let i = 0; i < 14; i++) { const z = (lo + hi) / 2; if (cabe(z)) lo = z; else hi = z; }
    cabe(lo); document.body.dataset.escala = lo.toFixed(2);
  })();
  </script>`;
}
export const HTML_PAGINA_BLANCA = `<style>@page { size: A4; margin: 0; } body { margin: 0; font-family: Helvetica, Arial, sans-serif; }
  .b { width: 794px; height: 1123px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 40px; box-sizing: border-box; color: #9ca3af; font-size: 9px; }</style>
  <div class="b">Página en blanco a propósito (impresión a doble cara)</div>`;
// Una página por cada página del cuaderno, transparente, con su pie abajo en la esquina exterior
// (impar a la derecha, par a la izquierda): la hoja a la que pertenece y su página dentro de ella
// («Cribado · Lumbar 1/2»); vacía en la portada y en las blancas. paginar.py la superpone al
// contenido, reducido para dejar libre esa franja. Sin número absoluto: así una hoja que crece no
// cambia el número de las demás (decisión del usuario, 2026-10).
export function htmlNumerosCuaderno(total, numeradas) {
  const paginas = Array.from({ length: total }, (_, i) => {
    const n = i + 1, p = numeradas.get(n);
    return `<div class="np">${p ? `<div class="num ${n % 2 ? 'der' : 'izq'}"><span class="sec">${esc(p.hoja)}</span><b>${p.n}/${p.de}</b></div>` : ''}</div>`;
  }).join('');
  return `<style>@page { size: A4; margin: 0; } html, body { margin: 0; background: transparent; font-family: Helvetica, Arial, sans-serif; }
    .np { width: 794px; height: 1123px; position: relative; page-break-after: always; break-after: page; overflow: hidden; }
    .np:last-child { page-break-after: auto; break-after: auto; }
    .num { position: absolute; bottom: 20px; display: flex; align-items: baseline; gap: 8px; font-size: 11px; color: #111827; }
    .num.der { right: 40px; } .num.izq { left: 40px; flex-direction: row-reverse; }
    .num .sec { font-size: 9px; color: #6b7280; letter-spacing: .5px; text-transform: uppercase; }
    .num b { font-size: 12px; }</style>${paginas}`;
}
// La QR de la portada: «Hojas para imprimir», sin huella (cada hoja lleva la suya)
export const rematarPortada = (html, url) => html.replaceAll(QR, qrSVG(url, QR_PX));
// Huella del cuaderno: la de las versiones de sus hojas, en orden
export const huellaCuaderno = huellas => fnv(Object.entries(huellas).map(([k, v]) => `${k}:${v}`).join('|'));

// ── Fase 1: banderas rojas generales y riesgo psicosocial (data/fase1.js) ─────
// Lo mismo que la tarjeta de la app, para marcar en papel; el QR abre su calculadora.
export function htmlFase1() {
  const T = TEXTOS_FASE1;
  const caja = '<span class="caja"></span>';
  const banderas = BANDERAS_FASE1.map((b, i) => `<tr><td class="n">${i + 1}</td><td>${esc(b.texto)}</td><td class="c">${caja} Sí</td><td class="c">${caja} No</td></tr>`).join('');
  const preguntas = PREGUNTAS_PSICO.map(p => `<tr><td>${esc(p.texto)}<div class="sug">Si «Sí» o «Dudoso»: ${esc(p.cuestionarios)}</div></td>${RESPUESTAS_PSICO.map(r => `<td class="c">${caja} ${esc(r)}</td>`).join('')}</tr>`).join('');
  return paginaUna({
    titulo: 'Fase 1',
    sub: 'Lo mismo que la fase 1 de la app, para marcar en papel: mecanismo, cronología, la tarjeta «Cirugía», banderas rojas y riesgo psicosocial. Las banderas de cada sistema van con el cribado de la región (en la guía, QR de su hoja de cribado); el motivo y lo que cuenta el paciente, en el formulario del paciente.',
    qr: 'Calculadora e IA',
    cuerpo: `<div class="mc"><div><b>Mecanismo de inicio:</b> ${['Traumático', 'Insidioso', POSQ.MECANISMO_POSQUIRURGICO].map(m => `<span>${caja} ${esc(m)}</span>`).join('')}</div>
      <div><b>Cronología:</b> ${['Agudo (<6 semanas)', 'Subagudo', 'Crónico (>3 meses)'].map(m => `<span>${caja} ${esc(m)}</span>`).join('')}</div></div>
      <div class="cir"><h2>🏥 Cirugía (con mecanismo «${esc(POSQ.MECANISMO_POSQUIRURGICO)}»)</h2>
        <div class="cir-f"><span>Intervención: <i class="lin"></i></span><span>Fecha (o semanas aprox.): <i class="lin c"></i></span></div>
        <div class="cir-ops"><b>Protocolo del cirujano:</b>${POSQ.PROTOCOLOS.map(p => `<span class="op">${caja} ${esc(p)}</span>`).join('')}</div>
        <div class="cir-f"><span>Restricciones: <i class="lin"></i></span></div>
        <div class="cir-ops"><b>Complicaciones:</b>${POSQ.COMPLICACIONES.map(c => `<span class="op">${caja} ${esc(c.label)}</span>`).join('')}<span class="op">${caja} Otra: <i class="lin c"></i></span></div>
        <p class="cir-n">Añade: las preguntas de complicaciones del cribado (fase 2) y la hipótesis «${esc(POSQ.NOMBRE_HIP_POSQ)}», siempre la primera y sin tests: ${esc(POSQ.TEXTO_PAUTA_POSQ)}; sin protocolo, «${esc(POSQ.TEXTO_SIN_PROTOCOLO)}». Cada pauta de las demás hipótesis: ${esc(POSQ.TEXTO_PAUTA_COMPATIBLE)}</p></div>
      <h2>🚩 Banderas rojas</h2><p class="aviso-g">${esc(T.banderasAviso)}</p>
      <table class="t">${banderas}</table>
      <p class="si-pos"><b>Con alguna «Sí»:</b> ${esc(T.banderaAlerta.replace(/^Bandera Roja Detectada\.\s*/, ''))}</p>
      <h2>🧠 Riesgo psicosocial</h2><p>${esc(T.psicoIntro)}:</p>
      <div class="niveles">${NIVELES_PSICO.map(n => `<span>${caja} ${n.emoji} ${esc(n.valor)}</span>`).join('')}</div>
      <p>${T.herramienta}</p>
      <h3>Con riesgo alto</h3><p>${esc(T.psicoAlto)}</p>
      <table class="t">${preguntas}</table>`,
    pie: `<span>Un SÍ en una bandera roja no exige derivación inmediata salvo emergencia clara: interpretar en el contexto clínico.</span><span class="pie">Generado desde los datos de la app (data/fase1.js) el ${FECHA}. ${AUTORIA_HTML}</span>`,
    css: `
      .cuerpo h2 { font-size: 15px; margin: 6px 0 4px; color: #1e3a8a; } .cuerpo h3 { font-size: 12.5px; margin: 10px 0 2px; }
      .cuerpo p { margin: 0 0 6px; font-size: 11.5px; }
      .aviso-g { color: #4b5563; }
      .t { width: 100%; border-collapse: collapse; margin: 2px 0 8px; font-size: 12px; }
      .t td { border-bottom: 1px solid #e5e7eb; padding: 6px 4px; vertical-align: top; }
      .t td.n { width: 18px; font-weight: bold; color: #7c4ddb; } .t td.c { width: 74px; white-space: nowrap; }
      .caja { display: inline-block; width: 12px; height: 12px; border: 1.5px solid #334155; border-radius: 2px; vertical-align: -2px; margin-right: 3px; }
      .sug { font-size: 10px; color: #6b7280; margin-top: 2px; }
      .si-pos { border-left: 3px solid #d0342c; padding: 4px 8px; background: #fde8e8; }
      .niveles { display: flex; gap: 24px; font-size: 12.5px; margin: 4px 0 8px; }
      .mc { font-size: 12px; margin: 0 0 8px; display: grid; gap: 4px; } .mc span { margin-left: 12px; }
      .cir { border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 6px 10px; margin: 0 0 8px; }
      .cir h2 { margin-top: 0 !important; } .cir-f { display: flex; gap: 18px; font-size: 12px; margin: 5px 0; flex-wrap: wrap; } .cir-f > span { flex: 1 1 auto; display: flex; align-items: flex-end; gap: 4px; }
      .lin { flex: 1; min-width: 120px; border-bottom: 1px solid #94a3b8; height: 14px; display: inline-block; } .lin.c { flex: 0 0 110px; min-width: 110px; }
      .cir-ops { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 14px; font-size: 12px; margin: 5px 0; } .cir-ops .op { white-space: nowrap; display: inline-flex; align-items: baseline; gap: 3px; }
      .cir-n { font-size: 10.5px !important; color: #4b5563; margin: 4px 0 0 !important; }`,
  });
}

// ── Síntomas (fase 3): P1–P4 para marcar en papel y las zonas de cada región ──
// Lo que la tarjeta «Síntomas» de la app registra (lib/sintomas.js) y, en la segunda página, las
// zonas de cada región con los pasos del árbol donde la app las recuerda (`pasos`), los recordatorios
// de zona y la red neurológica. QR → guia.html#sintomas.
export function htmlSintomas() {
  const caja = '<span class="caja"></span>';
  const ops = (lista) => lista.map(o => `<span class="op">${caja} ${esc(o)}</span>`).join('');
  const lin = (et, c = '') => `<div class="f"><span>${et}</span><i class="lin${c}"></i></div>`;
  const tarjeta = n => {
    const p1 = n === 1;
    return `<section class="s"><h2>P${n}${p1 ? ' · síntoma principal' : ''}</h2>
      ${lin('Zona:')}${p1 ? '' : `<div class="f">${ops(['Otra región (no valorada hoy)'])}</div>`}
      <div class="f"><b>Lado</b>${ops(['Derecho', 'Izquierdo', 'Bilateral', 'Central'])}</div>
      <div class="f">${ops(SINT.PROFUNDIDADES)}<span class="sep"></span>${ops(SINT.PATRONES)}</div>
      <div class="f"><b>NRS</b> <i class="lin c"></i>/10 ${p1 ? '<span class="nota">(su irritabilidad: hoja de irritabilidad)</span>' : `<b class="ml">Irritabilidad</b>${ops(SINT.NIVELES_IRRITABILIDAD)}`}</div>
      ${p1 ? `<div class="f"><b>Cómo es</b>${ops(SINT.CHIPS_DESCRIPCION)}</div>` : `<div class="f"><b>Con P1</b>${ops(Object.values(SINT.RELACIONES).map(r => r.boton))}</div>`}
      ${lin(p1 ? 'Descripción:' : 'Nota:')}</section>`;
  };
  const regiones = ORDEN_REGIONES.filter(r => ZONAS_SINTOMA[r]?.length).map(r => {
    const steps = CIF_TREES[r].steps;
    const paso = id => { const i = steps.findIndex(st => st.id === id); return i < 0 ? null : etiquetaPaso(steps[i], i); };
    const filas = ZONAS_SINTOMA[r].map(z => `<tr><td>${esc(z.nombre)}${z.central ? ' <span class="nota">(central)</span>' : ''}</td><td>${(z.pasos || []).map(paso).filter(Boolean).join(', ') || '—'}</td></tr>`
      + (z.recordatorio ? `<tr class="rec"><td colspan="2">⚠️ ${esc(z.recordatorio.texto)}</td></tr>` : '')).join('');
    return `<section class="r"><h3>${esc(nombreRegion(r))}</h3><table><thead><tr><th>Zona</th><th>Pasos</th></tr></thead><tbody>${filas}</tbody></table></section>`;
  }).join('');
  return `<style>${CSS}${CSS_UNA}
    .pagina + .pagina { break-before: page; }
    .cuerpo h2 { font-size: 13.5px; margin: 0 0 6px; color: #1e3a8a; }
    .ss { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .s { border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 8px 10px; font-size: 11.5px; }
    .f { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; margin: 6px 0; }
    .op { white-space: nowrap; display: inline-flex; align-items: baseline; gap: 3px; } .sep { width: 6px; } .ml { margin-left: 8px; }
    .caja { display: inline-block; width: 11px; height: 11px; border: 1.5px solid #334155; border-radius: 2px; vertical-align: -1px; }
    .lin { flex: 1; min-width: 80px; border-bottom: 1px solid #94a3b8; height: 13px; display: inline-block; } .lin.c { flex: 0 0 40px; min-width: 40px; }
    .nota { color: #6b7280; font-size: 10px; }
    .reglas { margin-top: 10px; font-size: 11px; color: #374151; } .reglas li { margin-bottom: 3px; }
    .rs { column-count: 2; column-gap: 16px; }
    .r { break-inside: avoid; margin-bottom: 10px; } .r h3 { font-size: 12.5px; margin: 0 0 3px; color: #1e3a8a; }
    .r table { width: 100%; border-collapse: collapse; font-size: 10.5px; } .r th { text-align: left; color: #6b7280; font-weight: 600; font-size: 9.5px; }
    .r td { border-top: 1px solid #e5e7eb; padding: 2px 3px; vertical-align: top; } .r td:last-child { white-space: nowrap; width: 70px; }
    .r tr.rec td { font-size: 9.5px; color: #b42318; white-space: normal; }
    .cont { font-size: 15px; font-weight: bold; margin: 0 0 8px; }
    .pie-v .qr-huella { display: inline; margin-left: 4px; }</style>
  <div class="pagina">
    <div class="cab-hoja"><div class="cab-txt"><h1>Síntomas (fase 3)</h1><div class="sub">Lo que registra la tarjeta «Síntomas» de la app: el principal (P1) y hasta tres más. Las zonas de cada región y los pasos del árbol donde importan, en la página 2.</div></div>
      <div class="qr-guia">${QR}<span>Zonas y pasos</span>${HUELLA}</div></div>
    <div class="cuerpo"><div class="ss">${[1, 2, 3, 4].map(tarjeta).join('')}</div>
      <ul class="reglas">
        <li>Un síntoma en otra región («no valorada hoy») solo lleva lado, NRS y una nota: no entra en el árbol.</li>
        <li>La zona de un síntoma recuerda, en los pasos del árbol de la página 2, lo que refiere el paciente: nunca contesta el paso.</li>
        <li>En la app, el plan de la fase 6 se dosifica por el síntoma más irritable (P1 si empatan) y avisa de un síntoma «Independiente» de P1.</li>
      </ul></div>
    <div class="pie-fijo"><span class="pie">Generado desde los datos de la app (data/&lt;región&gt;.js, lib/sintomas.js) el ${FECHA}. ${AUTORIA_HTML}</span></div>
  </div>
  <div class="pagina"><div class="cont">Zonas de cada región y pasos del árbol donde la app las recuerda</div>
    <div class="cuerpo"><div class="rs">${regiones}</div></div>
    <div class="pie-fijo"><span class="pie pie-v">Síntomas (fase 3) · ${AUTORIA_HTML} · ${FECHA} ${HUELLA}</span></div></div>`;
}

// ── Plan de tratamiento (fase 6): el contenido fijo del que la app elige ──────
// data/plan-tratamiento.js tal cual: cómo se elige el escalón, los escalones de las dos familias,
// la sesión de 50 min, los planes del mes, la progresión, seguir o cambiar y la red de seguridad de
// cada región y condición. La selección la hace la guía (QR → #plan) con la función de la app.
export function htmlPlanHoja() {
  const t = PLAN.TEXTOS_SESION;
  const esc2 = x => esc(x);
  const lista = arr => `<ul>${arr.map(x => `<li>${esc2(x)}</li>`).join('')}</ul>`;
  const escalones = (E, titulo) => `<section class="tarjeta pl"><h2>${esc2(titulo)}</h2>${Object.entries(E).map(([n, x]) =>
    `<p><b>${n} · ${esc2(x.nombre)}</b> <span class="modo">(${esc2(x.modo)})</span> ${esc2(x.texto)} <span class="cit">(${esc2(x.citas.join('; '))})</span></p>`).join('')}</section>`;
  const red = (k) => t[k] ? `<li>${esc2(t[k])}</li>` : '';
  const redRegion = r => {
    const rs = PLAN.RED_SEGURIDAD[r] || {};
    const siempre = [].concat(rs.siempre || []).map(x => red(x.cierre)).join('');
    const neuro = rs.neuro ? red(rs.neuro.cierre).replace('<li>', '<li><i>Con hipótesis neurológica:</i> ') : '';
    return `<p class="reg"><b>${esc2(nombreRegion(r))}</b></p><ul>${siempre}${neuro}</ul>`;
  };
  const conds = [['Lupus', PLAN.RED_LUPUS], ['Disautonomía', [PLAN.RED_DISAUTONOMIA]], ['Trastorno mastocitario o anafilaxia', [PLAN.RED_MASTOCITOS]], ['Osteoporosis', [PLAN.RED_OSTEOPOROSIS]],
    ['Embarazo', [PLAN.RED_EMBARAZO]], ['Posparto', [PLAN.RED_POSPARTO]], ['Anticoagulado o antiagregado', [PLAN.RED_ANTICOAGULADO]]];
  const tarjetas = [
    `<section class="tarjeta pl"><h2>Cómo se elige el escalón (B)</h2>
      <p>Gravedad por la NRS: 0–3 mínima · 4–7 moderada · 8–10 máxima. Irritabilidad: la de la hoja de irritabilidad (sin registrar, alta).</p>
      <table class="t"><tr><th>Irritabilidad</th><th>Escalón B</th></tr><tr><td>Alta</td><td>1</td></tr><tr><td>Moderada</td><td>1 con gravedad máxima; si no, 2</td></tr><tr><td>Baja</td><td>3</td></tr></table>
      <p><b>A</b>: un escalón por debajo de B (no hay A por debajo del 1). <b>C</b>: un escalón por encima de B, solo con irritabilidad baja y síntomas que no empeoran. ${esc2(PLAN.TEXTO_NIVELES.sinC.irritabilidad)}</p>
      <p><b>Familia</b>: columna (${PLAN.REGIONES_COLUMNA_PLAN.map(r => esc2(nombreRegion(r).toLowerCase())).join(', ')}, y las hipótesis ${Object.keys(PLAN.FAMILIA_HIP).join(', ')}) o periférica (las demás regiones).</p>
      <p class="cit">La propuesta completa para un paciente, con sus hipótesis y condiciones: guía (QR).</p></section>`,
    escalones(PLAN.ESCALONES, 'Escalones · columna (Maitland 2005)'),
    escalones(PLAN.ESCALONES_PERIFERICOS, 'Escalones · periféricas (Hengeveld y Banks 2005)'),
    `<section class="tarjeta pl"><h2>Sesión de ${PLAN.MINUTOS_SESION} min</h2>
      <p>${PLAN.BLOQUES_SESION.map(b => `${esc2(b.titulo)} ${b.duracion}′`).join(' · ')} <span class="cit">(organización de la sesión, no evidencia)</span></p>
      <p><b>Reevaluación:</b> ${esc2(t.reevaluacionBase)} En las siguientes: ${esc2(t.reevaluacionSiguiente.charAt(0).toLowerCase() + t.reevaluacionSiguiente.slice(1))}</p>
      <p><b>Educación:</b> ${esc2(t.educacionBase)} ${esc2(t.educacionPrimera)}</p>
      <p><b>Primera sesión:</b> ${esc2(t.primeraSesion)}</p>
      <p><b>Cantidad (columna):</b> ${esc2(t.cantidad)}</p><p><b>Cantidad (periféricas):</b> ${esc2(t.cantidadPeriferica)}</p>
      <p><b>Domiciliario:</b> ${esc2(t.domiciliario)} <b>Cierre:</b> ${esc2(t.cierre)}</p></section>`,
    `<section class="tarjeta pl"><h2>Plan del mes</h2>${['A', 'B'].map(k => { const m = PLAN.PLANES_MES[k]; return `<p><b>${esc2(m.nombre)}</b>: ${m.sesiones} sesiones; reevaluación intermedia ${esc2(m.intermedia.toLowerCase())}, final ${esc2(m.final.toLowerCase())}; programa domiciliario: ${esc2(m.domiciliario.toLowerCase())}</p>${lista(m.notas)}`; }).join('')}</section>`,
    `<section class="tarjeta pl"><h2>Progresión</h2><p>${esc2(PLAN.PROGRESION_GENERICA)}</p><p><b>Periféricas:</b> ${esc2(PLAN.PROGRESION_PERIFERICA)}</p></section>`,
    `<section class="tarjeta pl"><h2>Seguir o cambiar · columna</h2>${lista(PLAN.REGLAS_MES)}</section>`,
    `<section class="tarjeta pl"><h2>Seguir o cambiar · periféricas</h2>${lista(PLAN.REGLAS_MES_PERIFERICAS)}</section>`,
    `<section class="tarjeta pl"><h2>Red de seguridad por región (cierre de la sesión)</h2>${ORDEN_REGIONES.map(redRegion).join('')}</section>`,
    `<section class="tarjeta pl"><h2>Red de seguridad por condición especial</h2>${conds.map(([n, l]) => `<p class="reg"><b>${esc2(n)}</b></p><ul>${l.map(x => red(x.cierre)).join('')}</ul>`).join('')}</section>`,
  ];
  return paginasVarias({
    titulo: 'Plan de tratamiento (fase 6)',
    tituloCont: 'Plan de tratamiento (cont.)',
    sub: 'El contenido fijo del que la app elige el plan (data/plan-tratamiento.js), con su fuente. La propuesta para un paciente concreto (escalón, avisos de sus hipótesis y condiciones, red de seguridad), en la guía (QR). Es una propuesta: decide el fisioterapeuta.',
    qr: 'Calcular el plan',
    tarjetas,
    maxPaginas: 3,
    pie: `<span class="pie">Generado desde los datos de la app (data/plan-tratamiento.js) el ${FECHA}. ${AUTORIA_HTML}</span>`,
    css: `
      .pl { border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 6px 9px; }
      .pl h2 { font-size: 12px; margin: 0 0 3px; color: #1e3a8a; } .pl p { margin: 0 0 4px; } .pl ul { margin: 0 0 4px; padding-left: 14px; } .pl li { margin: 0 0 2px; }
      .modo, .cit { color: #6b7280; } .reg { margin: 4px 0 1px !important; }
      .t { border-collapse: collapse; margin: 3px 0 5px; } .t th, .t td { border: 1px solid #cbd5e1; padding: 2px 6px; text-align: left; }`,
  });
}

// ── Huella de cada hoja impresa ──────────────────────────────────────────────
// FNV-1a de 32 bits, en hexadecimal (8 caracteres): basta para distinguir versiones.
export function fnv(texto) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) { h ^= texto.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}

// Las hojas que llevan QR, con su clave (= nombre de archivo), la dirección de la guía y su
// HTML canónico (el árbol y la confirmación eligen su distribución con el navegador; la
// huella se calcula siempre con la distribución por defecto, que tiene el mismo contenido).
export function hojasImpresas() {
  const hojas = [];
  for (const region of Object.keys(CIF_TREES)) {
    hojas.push({ clave: `cribado-${region}`, ruta: `${region}/cribado`, html: () => htmlCribado(region) });
    hojas.push({ clave: `arbol-a4-${region}`, ruta: `${region}/arbol`, html: () => htmlArbol(region, { a4: true }) });
    hojas.push({ clave: `confirmacion-${region}`, ruta: `${region}/confirmacion`, html: () => htmlConfirmacion(region) });
  }
  for (const hoja of Object.keys(HOJAS_TEJIDO)) hojas.push({ clave: `tejidos-${hoja}`, ruta: `tejidos/${hoja}`, html: () => htmlTejidos(hoja) });
  hojas.push({ clave: 'condiciones', ruta: 'condiciones', html: htmlCondiciones });
  hojas.push({ clave: 'farmacos', ruta: 'farmacos', html: htmlFarmacos });
  hojas.push({ clave: 'irritabilidad', ruta: 'irritabilidad', html: htmlIrritabilidad });
  hojas.push({ clave: 'sintomas', ruta: 'sintomas', html: htmlSintomas });
  hojas.push({ clave: 'plan', ruta: 'plan', html: htmlPlanHoja });
  hojas.push({ clave: 'fase1', ruta: 'fase1', html: htmlFase1 });
  hojas.push({ clave: 'ejercicio-paciente', ruta: null, html: htmlEjercicioPaciente, paciente: true });
  for (const id of FORMULARIOS_PACIENTE) hojas.push({ clave: `formulario-${id}`, ruta: null, html: () => htmlFormularioPaciente(id), paciente: true });
  return hojas;
}
export const huellaHoja = html => fnv(html);
export function huellasActuales() {
  return Object.fromEntries(hojasImpresas().map(h => [h.clave, huellaHoja(h.html())]));
}
// Pone los marcadores: el QR a la guía con la huella (?h=), la huella visible y la fecha
export function rematar(html, { ruta, huella, fecha }) {
  // Sin ruta (la hoja del paciente) no hay QR, solo la versión
  return html.replaceAll(QR, ruta ? qrSVG(urlRuta(ruta, huella), QR_PX) : '').replaceAll(HUELLA, `<span class="qr-huella">v. ${huella}</span>`).replaceAll(FECHA, fecha);
}
