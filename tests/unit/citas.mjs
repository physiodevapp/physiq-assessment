// Citas tocables (lib/citas.js) y ficha flotante (ficha.js). Se ejecuta desde tests/unit.js.
import { assert, leer, test, HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, partirCitas, etiquetaCita, citasHTML,
  fichaCitaHTML, claveRegistro, MAX_ETIQUETA } from './comun.mjs';
const { REFERENCIAS } = await import('../../data/referencias.js');
const { ESCALONES, ESCALONES_PERIFERICOS, FUENTE_REGISTRO, FUENTE_RETROSPECTIVA } = await import('../../data/plan-tratamiento.js');
const { CUESTIONARIOS } = await import('../../data/cuestionarios.js');

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
