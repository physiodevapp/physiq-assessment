#!/usr/bin/env node
// Construye la app de sesión de un plan.
//
//   node construir.mjs <plan.js> <salida.html> [--local]
//
// <plan.js> define globalThis.PLAN (formato en LEEME.md). Sin --local, <salida.html> es el cuerpo
// que se publica con la herramienta Artifact (el visor añade el <html>/<head>). Con --local es un
// documento completo para abrir con doble clic en el navegador.
// Antes de escribir nada comprueba el plan y para con la lista de problemas si los hay.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const [planRuta, salida, ...resto] = process.argv.slice(2);
if (!planRuta || !salida) {
  console.error('Uso: node construir.mjs <plan.js> <salida.html> [--local]');
  process.exit(2);
}
const local = resto.includes('--local');

const planTexto = fs.readFileSync(planRuta, 'utf8');
const ctx = { globalThis: {} };
ctx.globalThis = ctx;
vm.runInNewContext(planTexto, ctx, { filename: planRuta });
const P = ctx.PLAN;

const problemas = comprobar(P);
if (problemas.length) {
  console.error('El plan tiene problemas:\n- ' + problemas.join('\n- '));
  process.exit(1);
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let html = fs.readFileSync(path.join(aqui, 'plantilla.html'), 'utf8');
html = html.replace(/<title>[^<]*<\/title>/, '<title>' + esc(P.titulo) + '</title>');
// Reemplazo con función: el texto del plan puede llevar «$» y no debe interpretarse.
html = html.replace('/*PLAN*/', () => planTexto).replace('/*ANEXO*/', () => fs.readFileSync(path.join(aqui, 'anexo.js'), 'utf8'))
  .replace('/*AMPLIAR_IA*/', () => ampliarIA());
if (local) {
  html = '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
    + '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
    + '<style>:root{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'
    + '</head>\n<body>\n' + html + '\n</body>\n</html>\n';
}
fs.writeFileSync(salida, html);
console.log('Escrito ' + salida + ' (' + Math.round(html.length / 1024) + ' KB)');

// «Ampliar con IA»: el mismo ampliar-ia.js de la app (raíz del repo), no una copia, así un
// cambio del prompt o de los destinos llega también aquí. Es un módulo ES sin imports: se
// quitan los `export` y se envuelve para dejar solo globalThis.AmpliarIA. Sin `ia` en el
// plan no se incrusta nada.
function ampliarIA() {
  if (!P.ia) return '';
  const ruta = path.join(aqui, '..', '..', '..', '..', 'ampliar-ia.js');
  const src = fs.readFileSync(ruta, 'utf8');
  if (/^\s*import\b/m.test(src)) throw new Error('ampliar-ia.js importa módulos: no se puede incrustar.');
  const sinExport = src.replace(/^export (const|function|let) /gm, '$1 ');
  if (/^export\b/m.test(sinExport)) throw new Error('ampliar-ia.js tiene un export que construir.mjs no sabe quitar.');
  return 'globalThis.AmpliarIA = (() => {\n' + sinExport + '\nreturn { initAmpliarIA, iaParrafoHTML };\n})();';
}

function comprobar(P) {
  const e = [];
  if (!P) return ['El archivo no define globalThis.PLAN.'];
  for (const k of ['id', 'titulo', 'nombre', 'resumen', 'tipo']) if (!P[k]) e.push('Falta «' + k + '».');
  if (P.id && !/^[a-z0-9-]+$/.test(P.id)) e.push('«id» solo admite minúsculas, números y guiones (es la clave del guardado en el dispositivo).');
  if (/\b(paciente|nombre)\s*:/i.test(P.resumen || '')) e.push('«resumen» no debe llevar el nombre del paciente.');
  if (!Array.isArray(P.bloques) || !P.bloques.length) e.push('Faltan los «bloques» de la sesión.');
  if (!P.antes || !Array.isArray(P.antes.items)) e.push('Falta «antes» con sus «items».');
  if (!Array.isArray(P.medidas)) e.push('Falta «medidas» (puede ser una lista vacía).');
  if (!P.casa || !Array.isArray(P.casa.ejercicios)) e.push('Falta «casa» con sus «ejercicios».');
  if (!P.progresion || !Array.isArray(P.progresion.filas)) e.push('Falta «progresion» con sus «filas».');
  if (!Array.isArray(P.seguir) || !Array.isArray(P.durante)) e.push('Faltan «seguir» y «durante» (pueden ser listas vacías).');
  const ids = new Map();
  const anota = (id, donde) => { if (!id) { e.push('Hay un elemento sin «id» en ' + donde + '.'); return; } if (ids.has(id)) e.push('«' + id + '» se repite (' + ids.get(id) + ' y ' + donde + ').'); ids.set(id, donde); };
  (P.bloques || []).forEach(b => {
    anota(b.id, 'bloques');
    if (!b.nombre || !b.min) e.push('El bloque «' + b.id + '» necesita «nombre» y «min».');
    (b.grupos || []).forEach(g => (g.items || []).forEach(it => {
      anota(it.id, 'bloque ' + b.id);
      if (!it.texto) e.push('«' + it.id + '» no tiene «texto».');
      if (it.corto && it.corto.length > 60) e.push('El texto corto de «' + it.id + '» pasa de 60 caracteres.');
      if (it.soloSiCondicion && !P.condicion) e.push('«' + it.id + '» usa «soloSiCondicion» pero el plan no tiene «condicion».');
    }));
  });
  ((P.antes && P.antes.items) || []).forEach(it => {
    anota(it.id, 'antes');
    if (it.opciones) {
      for (const k of Object.keys(it.alertas || {})) if (!it.opciones.includes(k)) e.push('La alerta «' + k + '» de «' + it.id + '» no es una de sus opciones.');
      for (const k of it.exclusivas || []) if (!it.opciones.includes(k)) e.push('La opción exclusiva «' + k + '» de «' + it.id + '» no es una de sus opciones.');
    }
  });
  const bloquesIds = new Set((P.bloques || []).map(b => b.id));
  (P.medidas || []).forEach(m => {
    anota(m.id, 'medidas');
    if (!['evn', 'opciones', 'texto'].includes(m.tipo)) e.push('La medida «' + m.id + '» tiene un «tipo» que no existe (evn, opciones o texto).');
    if (m.tipo === 'opciones' && !(m.opciones || []).length) e.push('La medida «' + m.id + '» es de opciones pero no tiene «opciones».');
    if (!bloquesIds.has(m.bloque)) e.push('La medida «' + m.id + '» apunta a un bloque que no existe («' + m.bloque + '»).');
    if (m.inicio && !(P.medidas || []).some(x => x.id === m.inicio)) e.push('La medida «' + m.id + '» compara con «' + m.inicio + '», que no existe.');
  });
  ((P.casa && P.casa.ejercicios) || []).forEach(x => anota(x.id, 'casa'));
  if (P.condicion) for (const k of ['corto', 'titulo', 'pregunta', 'si', 'no', 'siNo', 'urgencias', 'reducido', 'noAplicar', 'noAplicado', 'anexoSi', 'anexoNo']) if (!P.condicion[k]) e.push('A «condicion» le falta «' + k + '».');
  if (P.comparar && (!P.comparar.sesion || !Array.isArray(P.comparar.filas))) e.push('«comparar» necesita «sesion» y «filas».');
  if (P.ia) {
    if (!P.ia.contexto || typeof P.ia.contexto !== 'string') e.push('«ia» necesita «contexto» (de qué va el plan, sin datos del paciente).');
    else if (/\b(paciente|nombre)\s*:/i.test(P.ia.contexto)) e.push('«ia.contexto» no debe llevar datos del paciente: sale en la pregunta a la IA.');
  }
  return e;
}
