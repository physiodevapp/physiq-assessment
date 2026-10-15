// Citas tocables (lib/citas.js) y ficha flotante (ficha.js). Se ejecuta desde tests/unit.js.
import { assert, leer, test, HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, partirCitas, etiquetaCita, citasHTML,
  fichaCitaHTML, claveRegistro, MAX_ETIQUETA, citasEnTexto, esReferencia } from './comun.mjs';
const { REFERENCIAS } = await import('../../data/referencias.js');
const { ESCALONES, ESCALONES_PERIFERICOS, FUENTE_REGISTRO, FUENTE_RETROSPECTIVA } = await import('../../data/plan-tratamiento.js');
const { CUESTIONARIOS } = await import('../../data/cuestionarios.js');
const PLAN = await import('../../data/plan-tratamiento.js');
const IRR = await import('../../data/irritabilidad.js');

console.log('\ncitas (lib/citas.js)');

test('partirCitas: por « · », y por «; » solo si sigue otra referencia, nunca dentro de paréntesis', () => {
  assert.deepEqual(partirCitas('George 2021, JOSPT (A; «should» A · B) · NICE NG59 (rec. 1.2.6)'),
    ['George 2021, JOSPT (A; «should» A · B)', 'NICE NG59 (rec. 1.2.6)']);
  assert.deepEqual(partirCitas('Maitland 2005, cap. 9, tabla 9.3, p. 226; Hengeveld y Banks 2005, cap. 9, pp. 243 y 246'),
    ['Maitland 2005, cap. 9, tabla 9.3, p. 226', 'Hengeveld y Banks 2005, cap. 9, pp. 243 y 246']);
  assert.deepEqual(partirCitas('Maitland 2005, cap. 8, p. 203; cap. 9, p. 218'), ['Maitland 2005, cap. 8, p. 203; cap. 9, p. 218']);
  assert.deepEqual(partirCitas(['Petersen 2021', 'Barakatt 2009 · Zusman 1998']), ['Petersen 2021', 'Barakatt 2009', 'Zusman 1998']);
  assert.deepEqual(partirCitas(''), []);
  assert.deepEqual(partirCitas(undefined), []);
});

test('etiquetaCita: autor y año, como mucho MAX_ETIQUETA caracteres', () => {
  assert.equal(etiquetaCita('George 2021, J Orthop Sports Phys Ther 51(11)'), 'George 2021');
  assert.equal(etiquetaCita('NICE NG59 (rec. 1.2.6 y 1.2.7)'), 'NICE NG59');
  assert.equal(etiquetaCita('Lluch 2020, cap. 3.1 (Struyf), p. 54'), 'Lluch 2020');
  assert.equal(etiquetaCita('Rango de 5 estudios; la técnica varía'), 'Rango de 5 estudios');
  const larga = etiquetaCita('Hoja con puntos por opción aportada por el usuario en la consulta');
  assert.ok(larga.length <= MAX_ETIQUETA && larga.endsWith('…'), larga);
});

test('citasHTML: un botón por cita, la cita entera escapada en data-cita y « · » entre ellas', () => {
  const h = citasHTML('Décary 2018 (PM&R; «n» = 279) · Kim 2001');
  assert.equal((h.match(/<button type="button" class="cita"/g) || []).length, 2);
  assert.ok(h.includes('data-cita="Décary 2018 (PM&amp;R; «n» = 279)"'));
  assert.ok(h.includes('<span class="cita-corta">Décary 2018</span>'));
  assert.ok(h.includes('<span class="cita-sep" aria-hidden="true"> · </span>'));
  assert.ok(h.includes('aria-expanded="false"'));
  assert.equal(citasHTML(''), '');
});

test('fichaCitaHTML: texto entero; del registro, título, publicación (si la cita no la lleva) y enlace', () => {
  const REF = {
    'Kim 2001': { titulo: 'Un título', publicacion: 'Spine 26:1', url: 'https://ej.org/kim' },
    'Ruiz 2010': { titulo: 'Otro', publicacion: 'BMJ 1:2', doi: '10.1/x' },
    'Maitland 2005': { titulo: 'Vertebral Manipulation', publicacion: 'Elsevier' },
  };
  assert.equal(fichaCitaHTML('Kim 2001 (Spine 26:1)', null), '<div class="cita-ficha-texto">Kim 2001 (Spine 26:1)</div>');
  const k = fichaCitaHTML('Kim 2001 (Spine 26:1)', REF);
  assert.ok(k.includes('Un título') && !k.includes('cita-ficha-pub') && k.includes('href="https://ej.org/kim"') && k.includes('target="_blank"'));
  const r = fichaCitaHTML('Ruiz 2010', REF);
  assert.ok(r.includes('<div class="cita-ficha-pub">BMJ 1:2</div>') && r.includes('href="https://doi.org/10.1/x"'));
  const m = fichaCitaHTML('Maitland 2005, cap. 9', REF);
  assert.ok(m.includes('Sin enlace') && !m.includes('<a '));
  assert.ok(fichaCitaHTML('Sin registro 1999', {}).includes('Sin enlace'));
});

// Todas las fuentes que se pintan como citas, con lo que se ve de cada una
function fuentesPintadas() {
  const out = [];
  for (const h of Object.values(HYPOTHESES)) {
    out.push(h.dosisFuente, h.pronostico?.fuente);
    for (const c of Object.values(h.clusters || {})) out.push(c.fuente);
    for (const t of h.tests) { out.push(t.fuente); if (t.razonamiento?.fuentes) out.push(t.razonamiento.fuentes); }
  }
  for (const reg of Object.values(SYSTEMIC_SCREENING)) {
    for (const s of reg.sistemas || []) for (const q of s.preguntas || []) if (q.razonamiento) out.push(q.razonamiento.fuentes);
  }
  for (const tree of Object.values(CIF_TREES)) for (const st of tree.steps) if (st.razonamiento) out.push(st.razonamiento.fuentes);
  for (const e of [...Object.values(ESCALONES), ...Object.values(ESCALONES_PERIFERICOS)]) out.push(e.citas);
  out.push(FUENTE_REGISTRO, FUENTE_RETROSPECTIVA);
  for (const c of Object.values(CUESTIONARIOS)) out.push(c.fuente);
  return out.filter(f => f && f.length);
}

test('cada cita de una referencia del registro se ve como su clave (autor y año)', () => {
  const malas = [];
  let n = 0;
  for (const f of fuentesPintadas()) {
    for (const c of partirCitas(f)) {
      n++;
      const k = claveRegistro(c, REFERENCIAS);
      if (!k) continue;
      const e = etiquetaCita(c);
      // 'Laslett 2005 (centralización)': la clave lleva un paréntesis para distinguirla
      if (e !== k && !k.startsWith(`${e} (`)) malas.push(`«${c.slice(0, 60)}» → «${e}» (clave «${k}»)`);
    }
  }
  assert.ok(n > 500, `solo ${n} citas: ¿cambió de dónde salen?`);
  assert.deepEqual(malas, []);
});

test('ninguna fuente se pinta entera en el texto de corrido: toda línea de fuente pasa por citasHTML', () => {
  const ficheros = ['app.js', 'phase4.js', 'phase4b.js', 'plan.js'];
  for (const f of ficheros) {
    leer(f).split('\n').forEach((l, i) => {
      if (/class="(test-source|razon-pie)"/.test(l)) assert.ok(l.includes('citasHTML('), `${f}:${i + 1} pinta una fuente sin citasHTML`);
    });
  }
  const cu = leer('lib', 'cuestionarios.js').split('\n').find(l => l.includes('cuest-fuente-et">Fuente'));
  assert.ok(cu.includes('citasHTML(def.fuente)'), 'cuestionarios: la fuente sin citasHTML');
});

test('ficha flotante: un solo controlador para citas y tiempos de tejido', () => {
  const app = leer('app.js');
  assert.ok(app.includes("from './ficha.js'"));
  assert.ok(!/position:\s*fixed/.test(app.slice(app.indexOf('function _alternarInfoBarra'), app.indexOf('function abrirTiemposTejido'))));
  assert.ok(/alternarFicha\(barra, _infoBarraHTML\(barra\), \{ id: 'tejInfo'/.test(app), 'la tarjeta de una barra usa la ficha común');
  const ficha = leer('ficha.js');
  assert.ok(ficha.includes("id: 'citaFicha'"));
  // se cierra al cambiar de fase y al cerrar los paneles
  assert.ok(/function goToPhase[\s\S]{0,600}cerrarFicha\(/.test(app));
  assert.ok(/function _closeAllOverlays\(\) \{\s*cerrarFicha\(/.test(app));
});

// ── Citas dentro de una frase (Fase O2) ──
const sinEtiquetas = h => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

test('citasEnTexto: cada cita entre paréntesis pasa a botón y el texto queda igual', () => {
  const t = 'La mitad si duele mucho (Maitland 2005, cap. 9, pp. 213, 216 y 219).';
  const h = citasEnTexto(t);
  assert.ok(h.includes('data-cita="Maitland 2005, cap. 9, pp. 213, 216 y 219"'));
  assert.ok(h.includes('<span class="cita-corta">Maitland 2005</span><span class="cita-resto">, cap. 9, pp. 213, 216 y 219</span>'));
  assert.equal(sinEtiquetas(h), t);
  const m = citasEnTexto('x (Petersen 2021; Maitland 2005, cap. 6, p. 117) y (acuerdo 71 %; Barakatt 2009) y (NICE NG59)');
  assert.equal((m.match(/class="cita"/g) || []).length, 4);
  assert.equal(sinEtiquetas(m), 'x (Petersen 2021; Maitland 2005, cap. 6, p. 117) y (acuerdo 71 %; Barakatt 2009) y (NICE NG59)');
  // nada que no empiece como una referencia
  for (const n of ['(MDT: C en la aguda)', '(D; NICE: no ofrecer)', '(grado B)', '(6 semanas, van Dijk 2016)', '(<em>Kim 2001</em>)', '(Petersen 2021 incluye las banderas amarillas)', 'sin paréntesis', '']) {
    assert.equal(citasEnTexto(n), n, n);
  }
  // HTML ya escapado: no se escapa dos veces
  assert.ok(citasEnTexto('(Décary 2018, PM&amp;R)').includes('data-cita="Décary 2018, PM&amp;R"'));
  assert.equal(citasEnTexto(null), '');
});

// Textos de corrido que se pintan con citasEnTexto: fase 6, irritabilidad de la fase 3, pautas y pronósticos
function textosConCitas() {
  const out = [];
  const walk = v => { if (typeof v === 'string') out.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
  walk(PLAN); walk(IRR.TEXTOS_IRRITABILIDAD);
  for (const h of Object.values(HYPOTHESES)) walk([h.dosis, h.dosisRamas, h.dosisComun, h.pronostico?.horizonte, h.pronostico?.derivacion]);
  return out;
}

test('citas dentro de una frase: cada una que se convierte es una referencia del registro (o «citado en» una)', () => {
  const malas = [];
  let n = 0;
  for (const t of textosConCitas()) {
    const h = citasEnTexto(t);
    for (const m of h.matchAll(/data-cita="([^"]*)"/g)) {
      n++;
      const c = m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"');
      const citadoEn = c.match(/, citado en (.*)$/);
      if (!claveRegistro(c, REFERENCIAS) && !(citadoEn && claveRegistro(citadoEn[1], REFERENCIAS))) malas.push(c);
    }
    assert.equal(sinEtiquetas(h), t.replace(/&quot;/g, '"'), `el texto cambia: ${t.slice(0, 80)}`);
  }
  assert.ok(n > 100, `solo ${n} citas en el texto: ¿cambió de dónde salen?`);
  assert.deepEqual(malas, []);
});

test('citas dentro de una frase: se pintan en la fase 6, la irritabilidad de la fase 3 y la pauta y el pronóstico de la fase 5', () => {
  const plan = leer('plan.js');
  assert.ok(plan.includes('const escC = t => citasEnTexto(esc(t));'));
  assert.ok(!/<textarea[^\n]*escC\(/.test(plan), 'nunca dentro de un <textarea>');
  assert.ok(!/(title|placeholder|aria-label)="\$\{escC\(/.test(plan), 'nunca en un atributo');
  const app = leer('app.js');
  for (const x of ['citasEnTexto(T.margen)', 'citasEnTexto(primera)', 'citasEnTexto(resto)', 'citasEnTexto(hyp.pronostico.derivacion)', 'citasEnTexto(o.texto)']) assert.ok(app.includes(x), x);
  assert.ok(esReferencia('NICE CG147') && esReferencia('Hengeveld y Banks 2005') && !esReferencia('van Dijk 2016') && !esReferencia('MDT: C'));
});
