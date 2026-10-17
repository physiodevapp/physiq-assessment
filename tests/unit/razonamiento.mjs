// «¿Por qué?» del cribado, del árbol CIF y de los tests, «Ampliar con IA». Se ejecuta desde tests/unit.js.
import { assert, readFileSync, join, TESTS, leer, test, HYPOTHESES, SYSTEMIC_SCREENING, testPuntua,
   pesoTest, PESO_TEST, buildTestItem, lrEfectiva, claveRegistro, enlaceCita, citasHTML, citasEnTexto,
   citasTest, state, buildPhysiQPayload, buildInformeFisioterapiaText, buildContextSummaryText,
   buildSistemaHTML, sistemasActivos, textoBandera, razonBanderaHTML, BASE_STATE, withState, VALID_REGIONS } from './comun.mjs';
const { REFERENCIAS } = await import('../../data/referencias.js');

// ── Razonamiento del cribado (fase 2, «¿Por qué?») ───────────────────────────
// docs/razonamiento-cribado.md. Campo opcional por pregunta: si existe, `porque`
// y `peso` no vacíos, `fuentes` con claves del registro, y nada fuera del esquema.
console.log('\nrazonamiento del cribado');

const CAMPOS_RAZON = ['porque', 'peso', 'detalle', 'fuentes', 'citas', 'fisiologia'];
const textoCita = c => (typeof c === 'string' ? c : c.texto);
const preguntasConRazon = [];
{
  const vistas = new Set();
  for (const [region, data] of Object.entries(SYSTEMIC_SCREENING)) {
    for (const sis of data.sistemas) {
      for (const q of sis.preguntas) {
        if (!q.razonamiento || vistas.has(`${sis.id}.${q.id}`)) continue;
        vistas.add(`${sis.id}.${q.id}`);
        preguntasConRazon.push({ region, sis, q, r: q.razonamiento });
      }
      // Banderas con razonamiento propio: mismas reglas de forma y fuentes
      for (const campo of ['banderasRojas', 'banderasAmarillas']) {
        (sis[campo] || []).forEach((f, i) => {
          if (typeof f === 'string' || !f.razonamiento || vistas.has(`${sis.id}.${campo}.${i}`)) return;
          vistas.add(`${sis.id}.${campo}.${i}`);
          preguntasConRazon.push({ region, sis, q: { id: `${campo}[${i}]` }, r: f.razonamiento, bandera: true });
        });
      }
    }
  }
}
const noVacio = x => typeof x === 'string' && x.trim().length > 0;

test('razonamiento: porque y peso no vacíos, detalle no vacío si existe, sin campos fuera del esquema', () => {
  for (const { region, q, r } of preguntasConRazon) {
    const donde = `${region}/${q.id}`;
    assert.ok(noVacio(r.porque), `${donde}: porque vacío`);
    assert.ok(noVacio(r.peso), `${donde}: peso vacío`);
    assert.ok(r.detalle === undefined || noVacio(r.detalle), `${donde}: detalle vacío`);
    const extra = Object.keys(r).filter(k => !CAMPOS_RAZON.includes(k));
    assert.deepEqual(extra, [], `${donde}: campos desconocidos`);
  }
});

test('razonamiento: fuentes no vacío y todas son claves de data/referencias.js', () => {
  for (const { region, q, r } of preguntasConRazon) {
    assert.ok(Array.isArray(r.fuentes) && r.fuentes.length > 0, `${region}/${q.id}: sin fuentes`);
    for (const f of r.fuentes) assert.ok(REFERENCIAS[f], `${region}/${q.id}: «${f}» no está en el registro`);
  }
});

test('razonamiento: cada cita completa empieza por una de sus fuentes, y cada fuente tiene su cita', () => {
  for (const { region, q, r } of preguntasConRazon) {
    if (!r.citas) continue;
    for (const c of r.citas.map(textoCita)) assert.ok(r.fuentes.some(f => c.startsWith(f)), `${region}/${q.id}: cita sin fuente: ${c}`);
    for (const f of r.fuentes) assert.ok(r.citas.map(textoCita).some(c => c.startsWith(f)), `${region}/${q.id}: fuente sin cita: ${f}`);
  }
});

test('razonamiento: una cita con enlace es { texto, url } y su url es la del registro', () => {
  for (const { region, q, r } of preguntasConRazon) {
    for (const c of r.citas || []) {
      if (typeof c === 'string') continue;
      assert.deepEqual(Object.keys(c).sort(), ['texto', 'url'], `${region}/${q.id}: cita con campos raros`);
      const clave = r.fuentes.find(f => c.texto.startsWith(f));
      assert.ok(/^https:\/\//.test(c.url), `${region}/${q.id}: url no https: ${c.url}`);
      assert.equal(c.url, REFERENCIAS[clave]?.url, `${region}/${q.id}: la url de «${clave}» no coincide con data/referencias.js`);
    }
  }
});

test('razonamiento: fisiologia = { pasos (3–6), nota?, metafora? }, solo con detalle (se ve en «Ampliar»)', () => {
  for (const { region, q, r } of preguntasConRazon) {
    const f = r.fisiologia;
    if (!f) continue;
    const donde = `${region}/${q.id}`;
    assert.ok(r.detalle, `${donde}: fisiologia sin detalle no se vería`);
    assert.deepEqual(Object.keys(f).filter(k => !['pasos', 'nota', 'metafora'].includes(k)), [], `${donde}: campos raros en fisiologia`);
    assert.ok(Array.isArray(f.pasos) && f.pasos.length >= 3 && f.pasos.length <= 6, `${donde}: 3–6 pasos`);
    for (const p of f.pasos) assert.ok(noVacio(p), `${donde}: paso vacío`);
    assert.ok(f.nota === undefined || noVacio(f.nota), `${donde}: nota vacía`);
    assert.ok(f.metafora === undefined || noVacio(f.metafora), `${donde}: metáfora vacía`);
  }
});

// ── Banderas de fase 2 (docs/razonamiento-banderas.md) ───────────────────────
// Una bandera es un texto o { texto, regiones?, pregunta?, fase1?, razonamiento? }.
const CAMPOS_BANDERA = ['texto', 'regiones', 'pregunta', 'fase1', 'razonamiento', 'hm'];
const todasBanderas = [];
for (const [region, data] of Object.entries(SYSTEMIC_SCREENING))
  for (const sis of data.sistemas)
    for (const campo of ['banderasRojas', 'banderasAmarillas'])
      (sis[campo] || []).forEach((f, i) => todasBanderas.push({ region, sis, campo, i, f }));

test('banderas: texto o { texto, regiones?, pregunta?, fase1?, razonamiento? } sin campos raros; pregunta o razonamiento, no los dos', () => {
  for (const { region, sis, campo, i, f } of todasBanderas) {
    const donde = `${region}/${sis.id}.${campo}[${i}]`;
    if (typeof f === 'string') { assert.ok(noVacio(f), `${donde}: vacía`); continue; }
    assert.deepEqual(Object.keys(f).filter(k => !CAMPOS_BANDERA.includes(k)), [], `${donde}: campos raros`);
    assert.ok(noVacio(f.texto), `${donde}: sin texto`);
    assert.ok(!(f.pregunta && f.razonamiento), `${donde}: pregunta y razonamiento a la vez (el «¿Por qué?» se escribe una vez)`);
    assert.ok(f.regiones === undefined || (f.regiones.length && f.regiones.every(r => VALID_REGIONS.includes(r))), `${donde}: regiones`);
    assert.ok(f.fase1 === undefined || ['br1', 'br2', 'br3', 'br4'].includes(f.fase1), `${donde}: fase1`);
    for (const id of [].concat(f.pregunta || [])) {
      const q = sis.preguntas.find(p => p.id === id);
      assert.ok(q, `${donde}: la pregunta ${id} no está en el mismo sistema`);
      assert.ok(q.razonamiento, `${donde}: ${id} no tiene razonamiento que enlazar`);
    }
  }
});

test('banderas: en cada región, una bandera con `pregunta` siempre enlaza a una pregunta visible (y las de regiones ajenas no se ven)', () => {
  for (const region of VALID_REGIONS) {
    withState({ region, mecanismo: 'Post-quirúrgico' }, () => {
      for (const sis of sistemasActivos(region)) {
        for (const campo of ['banderasRojas', 'banderasAmarillas']) {
          for (const f of sis[campo] || []) {
            if (typeof f === 'string') continue;
            assert.ok(!f.regiones || f.regiones.includes(region), `${region}/${sis.id}: «${f.texto}» no debería verse`);
            if (f.pregunta) assert.ok(razonBanderaHTML(sis, f), `${region}/${sis.id}: «${f.texto}» enlaza a una pregunta que aquí no se ve`);
          }
        }
      }
    });
  }
});

test('banderas: ⓘ solo cuando hay «¿Por qué?», que despliega por qué y cuánto pesa; «Ampliar →» solo con más; «· fase 1» con fase1; el panel enlazado repite la pregunta y su razonamiento', () => {
  for (const { sis, campo, f } of todasBanderas) {
    if (typeof f !== 'string' && f.regiones) continue;   // se comprueban por región arriba
    const html = buildSistemaHTML({ ...sis, banderasRojas: campo === 'banderasRojas' ? [f] : [], banderasAmarillas: campo === 'banderasAmarillas' ? [f] : [] });
    const tiene = !!razonBanderaHTML(sis, f);
    assert.equal(html.includes('toggleRazonBandera('), tiene, `«${textoBandera(f)}»: ⓘ`);
    // Nivel 1 bajo la bandera (Por qué + Cuánto pesa); «Ampliar →» solo si el panel tiene más
    const rs = typeof f === 'string' ? [] : f.razonamiento ? [f.razonamiento]
      : sis.preguntas.filter(q => [].concat(f.pregunta || []).includes(q.id) && q.razonamiento).map(q => q.razonamiento);
    for (const r of rs) assert.ok(html.includes(citasEnTexto(r.porque)) && html.includes(citasEnTexto(r.peso)), `«${textoBandera(f)}»: por qué y cuánto pesa`);
    assert.equal(html.includes('abrirRazonBandera('), rs.some(r => r.detalle || r.fisiologia), `«${textoBandera(f)}»: Ampliar`);
    assert.equal(html.includes('class="flag-fase1"'), !!f.fase1, `«${textoBandera(f)}»: fase 1`);
  }
  const sis = SYSTEMIC_SCREENING.lumbar.sistemas.find(s => s.id === 'l_espondilo');
  const ect = sis.banderasRojas.find(f => f.pregunta === 'l_e8');
  const panel = razonBanderaHTML(sis, ect);
  const q = sis.preguntas.find(p => p.id === 'l_e8');
  assert.ok(panel.includes(q.text) && panel.includes(q.razonamiento.porque) && panel.includes('NICE NG126'));
});

test('banderas: lumbar, cada bandera enlazada según el inventario (docs/razonamiento-banderas.md)', () => {
  const enlaces = SYSTEMIC_SCREENING.lumbar.sistemas.filter(s => !s.id.startsWith('transversal_'))
    .flatMap(s => [...s.banderasRojas, ...s.banderasAmarillas]).filter(f => typeof f !== 'string');
  assert.equal(enlaces.filter(f => f.pregunta).length, 28);
  assert.deepEqual(enlaces.filter(f => f.fase1).map(f => f.fase1), ['br1', 'br4', 'br1']);
  // Razonamiento propio: las 8 rojas sin pregunta y 2 amarillas
  const propias = SYSTEMIC_SCREENING.lumbar.sistemas.filter(s => !s.id.startsWith('transversal_')).flatMap(s => [
    ...s.banderasRojas.filter(f => f.razonamiento).map(f => `R ${f.texto.split(' ').slice(0, 2).join(' ')}`),
    ...s.banderasAmarillas.filter(f => f.razonamiento).map(f => `A ${f.texto.split(' ').slice(0, 2).join(' ')}`)]);
  assert.deepEqual(propias, ['R Pérdida de', 'R Fractura patológica', 'A Dolor lumbar', 'R Prueba de', 'R Masa testicular',
    'R Pérdida de', 'R Síntomas oculares', 'A Historia familiar', 'R Síndrome de', 'R Signos neurológicos']);
  // Ninguna bandera propia de lumbar sin «¿Por qué?» (las amarillas, enlazadas en 2026-10)
  const sinPorque = SYSTEMIC_SCREENING.lumbar.sistemas.filter(s => !s.id.startsWith('transversal_'))
    .flatMap(s => [...s.banderasRojas, ...s.banderasAmarillas]).filter(f => typeof f === 'string' || (!f.pregunta && !f.razonamiento));
  assert.deepEqual(sinPorque.map(textoBandera), []);
});

test('banderas: cadera, cada bandera enlazada según el inventario (docs/razonamiento-banderas.md)', () => {
  const propios = SYSTEMIC_SCREENING.cadera.sistemas.filter(s => !s.id.startsWith('transversal_'));
  const banderas = propios.flatMap(s => [...s.banderasRojas, ...s.banderasAmarillas]);
  assert.equal(banderas.length, 45);
  assert.equal(banderas.filter(f => f.pregunta).length, 37);
  assert.deepEqual(banderas.filter(f => f.fase1).map(f => f.fase1), ['br1']);
  // Razonamiento propio: las 5 rojas sin pregunta (el aneurisma pasó a ca_v4) y 3 amarillas; ninguna sin «¿Por qué?»
  const propias = propios.flatMap(s => [...s.banderasRojas, ...s.banderasAmarillas]).filter(f => f.razonamiento).map(f => f.texto.split(' ').slice(0, 2).join(' '));
  assert.deepEqual(propias, ['Factores de', 'Tumores óseos', 'Edad >50', 'Antecedente familiar', 'Denominador común:', 'Líquido en', 'Fractura de', 'VSG como']);
  const sinPorque = propios.flatMap(s => [...s.banderasRojas.map(f => ['R', f]), ...s.banderasAmarillas.map(f => ['A', f])])
    .filter(([, f]) => typeof f === 'string' || (!f.pregunta && !f.razonamiento)).map(([t, f]) => `${t} ${textoBandera(f).split(' ').slice(0, 2).join(' ')}`);
  assert.deepEqual(sinPorque, []);
});

test('banderas: cervical, cada bandera enlazada según el inventario (docs/razonamiento-banderas.md)', () => {
  const propios = SYSTEMIC_SCREENING.cervical.sistemas.filter(s => !s.id.startsWith('transversal_'));
  const banderas = propios.flatMap(s => [...s.banderasRojas, ...s.banderasAmarillas]);
  assert.equal(banderas.length, 40);
  assert.equal(banderas.filter(f => f.pregunta).length, 36);
  assert.deepEqual(banderas.filter(f => f.fase1).map(f => f.fase1), ['br1', 'br4']);
  const propias = banderas.filter(f => f.razonamiento).map(f => f.texto.split(' ').slice(0, 2).join(' '));
  assert.deepEqual(propias, ['Síncope repentino', 'Prueba de', 'Dolor que', 'Dolor de']);   // la mielopatía, en cv_n4
  // «Dolor que no cambia…» marca la fase 1 (br4) y lleva su propio razonamiento
  const sinPorque = propios.flatMap(s => [...s.banderasRojas.map(f => ['R', f]), ...s.banderasAmarillas.map(f => ['A', f])])
    .filter(([, f]) => typeof f === 'string' || (!f.pregunta && !f.razonamiento)).map(([t, f]) => `${t} ${textoBandera(f).split(' ').slice(0, 2).join(' ')}`);
  assert.deepEqual(sinPorque, []);
});

test('banderas: hombro, cada bandera enlazada o con razonamiento propio según el inventario (docs/razonamiento-banderas.md)', () => {
  const propios = SYSTEMIC_SCREENING.hombro.sistemas.filter(s => !s.id.startsWith('transversal_'));
  const banderas = propios.flatMap(s => [...s.banderasRojas, ...s.banderasAmarillas]);
  assert.equal(banderas.length, 41);
  assert.equal(banderas.filter(f => f.pregunta).length, 36);
  assert.deepEqual(banderas.filter(f => f.fase1).map(f => f.fase1), ['br1']);
  const propias = banderas.filter(f => f.razonamiento).map(f => f.texto.split(' ').slice(0, 2).join(' '));
  assert.deepEqual(propias, ['Edad >50', 'Debilidad muscular', 'Síncope repentino', 'Uso de', 'Exposición a']);
  assert.deepEqual(banderas.filter(f => typeof f === 'string' || (!f.pregunta && !f.razonamiento)), []);
  // El signo de Kehr por rotura de bazo y las cardiacas tienen pregunta urgente (h_gi4, h_c4)
  const kehr = propios.find(s => s.id === 'h_gi').banderasRojas.find(f => /esplénica/.test(f.texto));
  assert.equal(kehr.pregunta, 'h_gi4');
});

test('banderas: rodilla, cada bandera enlazada o con razonamiento propio según el inventario (docs/razonamiento-banderas.md)', () => {
  const propios = SYSTEMIC_SCREENING.rodilla.sistemas.filter(s => !s.id.startsWith('transversal_'));
  const banderas = propios.flatMap(s => [...s.banderasRojas, ...s.banderasAmarillas]);
  assert.equal(banderas.length, 23);
  assert.equal(banderas.filter(f => f.pregunta).length, 21);
  assert.deepEqual(banderas.filter(f => f.fase1).map(f => f.fase1), []);
  const propias = banderas.filter(f => f.razonamiento).map(f => f.texto.split(' ').slice(0, 2).join(' '));
  assert.deepEqual(propias, ['Calambres nocturnos', 'Dolor en']);
  assert.deepEqual(banderas.filter(f => typeof f === 'string' || (!f.pregunta && !f.razonamiento)), []);
});

test('banderas: codo, cada bandera enlazada o con razonamiento propio según el inventario (docs/razonamiento-banderas.md)', () => {
  const propios = SYSTEMIC_SCREENING.codo.sistemas.filter(s => !s.id.startsWith('transversal_'));
  const banderas = propios.flatMap(s => [...s.banderasRojas, ...s.banderasAmarillas]);
  assert.equal(banderas.length, 15);
  assert.equal(banderas.filter(f => f.pregunta).length, 12);
  const propias = banderas.filter(f => f.razonamiento).map(f => f.texto.split(' ').slice(0, 2).join(' '));
  assert.deepEqual(propias, ['Síntomas vasculares', 'Xantomas en', 'Tendinitis calcificante']);
  assert.deepEqual(banderas.filter(f => typeof f === 'string' || (!f.pregunta && !f.razonamiento)), []);
  // Xantomas y tendinitis calcificante: el mismo razonamiento que el sistema endocrino compartido (codo tiene el suyo)
  const end = SYSTEMIC_SCREENING.lumbar.sistemas.find(s => s.id === 'transversal_endocrino');
  const codoEnd = propios.find(s => s.id === 'co_endocrino');
  assert.equal(codoEnd.banderasRojas.find(f => /Xantomas/.test(f.texto)).razonamiento, end.banderasRojas.find(f => /Xantomas/.test(f.texto)).razonamiento);
  assert.equal(codoEnd.banderasAmarillas.find(f => /calcificante/.test(f.texto)).razonamiento, end.banderasAmarillas.find(f => /calcificante/.test(f.texto)).razonamiento);
});

test('banderas: tobillo y pie, cada bandera enlazada según el inventario (docs/razonamiento-banderas.md)', () => {
  const propios = SYSTEMIC_SCREENING.tobillo_pie.sistemas.filter(s => !s.id.startsWith('transversal_'));
  const banderas = propios.flatMap(s => [...s.banderasRojas, ...s.banderasAmarillas]);
  assert.equal(banderas.length, 15);
  assert.equal(banderas.filter(f => f.pregunta).length, 15);
  assert.deepEqual(banderas.filter(f => typeof f === 'string' || (!f.pregunta && !f.razonamiento)), []);
});

test('banderas: sistemas compartidos, cada bandera enlazada o con razonamiento propio según el inventario (docs/razonamiento-banderas.md)', () => {
  const corto = f => f.texto.split(' ').slice(0, 2).join(' ');
  const resumen = sis => [...sis.banderasRojas.map(f => ['R', f]), ...sis.banderasAmarillas.map(f => ['A', f])]
    .map(([t, f]) => typeof f === 'string' ? `${t} ${f.split(' ').slice(0, 2).join(' ')} · —`
      : `${t} ${corto(f)} · ${f.pregunta ? [].concat(f.pregunta).join('+') : f.razonamiento ? 'propio' : '—'}`);
  const sis = id => SYSTEMIC_SCREENING.lumbar.sistemas.concat(SYSTEMIC_SCREENING.rodilla.sistemas).find(s => s.id === id);
  assert.deepEqual(resumen(sis('transversal_posquirurgico')), ['R Herida más · pq_herida', 'R En las · pq_herida', 'R Pierna hinchada, · pq_tvp+pq_tvp_ms',
    'R Falta de · pq_tep', 'R Dolor desproporcionado · pq_compart', 'R Dolor quemante, · pq_nervio', 'R Tras una · pq_nervio_col',
    'A Dolor continuo · pq_sdrc', 'A Yeso o · pq_sdrc+pq_compart']);
  assert.deepEqual(resumen(sis('transversal_endocrino')), ['R Síndrome del · propio', 'R Signos de · propio', 'R Confusión, letargo · propio',
    'R Signos de · propio', 'R Xantomas: pápulas · propio', 'R Nódulos palpables · propio',
    'A Debilidad muscular · end_1', 'A Periartritis o · propio', 'A Cambios inexplicables · end_3', 'A Polidipsia y · end_2']);
  assert.deepEqual(resumen(sis('transversal_hematologico')), ['R Sangrado espontáneo, · hem_1', 'R Heces negras/alquitranadas · hem_4',
    'R Episodios nuevos · hem_6', 'R Hemoptisis (toser · hem_4', 'R Fiebre alta, · hem_3+hem_5',
    'A Palidez en · propio', 'A Uñas cóncavas · propio', 'A Disnea rápida, · hem_2', 'A Uso crónico · propio']);
  assert.deepEqual(resumen(sis('transversal_disautonomia')), ['R Síncope durante · ds_u_esfuerzo', 'R Síncope tumbado, · ds_u_tumbado',
    'R Síncope con · ds_u_corazon', 'R Síncope con · ds_u_familia', 'A Taquicardia que · ds_d_paroxistica']);
});

test('razonamiento: «¿Por qué?» solo en preguntas que lo tienen, «Ampliar» solo con detalle', () => {
  for (const [region, data] of Object.entries(SYSTEMIC_SCREENING)) {
    for (const sis of data.sistemas) {
      const html = buildSistemaHTML(sis);
      for (const q of sis.preguntas) {
        const ini = html.indexOf(`id="sq2_${q.id}"`);
        const fin = html.indexOf('id="sq2_', ini + 1);
        const bloque = html.slice(ini, fin === -1 ? undefined : fin);
        assert.equal(bloque.includes('class="razon"'), !!q.razonamiento, `${region}/${q.id}: ¿Por qué?`);
        assert.equal(bloque.includes(`abrirRazonamiento(this,'${sis.id}','${q.id}')`), !!q.razonamiento?.detalle, `${region}/${q.id}: Ampliar`);
      }
    }
  }
});

test('razonamiento: nunca entra en el payload, 📋 Notas ni 📄 Informe', () => {
  const muestra = preguntasConRazon.find(p => !p.bandera && p.region !== 'comun' && SYSTEMIC_SCREENING[p.region] && !p.sis.soloPosquirurgico && !p.sis.soloHipermovilidad && !p.sis.soloDisautonomia);
  if (!muestra) return;   // aún no hay ninguna pregunta con razonamiento
  const { region, q, r } = muestra;
  withState({ region, sistemicoAnswers: { [q.id]: 'SI' }, sistemicoAlerta: true }, () => {
    const textos = [JSON.stringify(buildPhysiQPayload()), buildContextSummaryText(), buildInformeFisioterapiaText()];
    assert.ok(JSON.stringify(buildPhysiQPayload()).includes(q.text.slice(0, 20)), 'la pregunta respondida SÍ sí va en el payload (control)');
    for (const t of textos) {
      assert.ok(!t.includes(r.porque.slice(0, 40)), 'porque filtrado a un resumen');
      assert.ok(!t.includes(r.peso.slice(0, 40)), 'peso filtrado a un resumen');
      if (r.fisiologia) assert.ok(!t.includes(r.fisiologia.pasos[0].slice(0, 40)), 'fisiología filtrada a un resumen');
    }
  });
});

test('razonamiento: los sistemas comunes son el mismo objeto en todas las regiones (se redactan una vez)', () => {
  const ids = ['transversal_endocrino', 'transversal_hematologico'];
  for (const id of ids) {
    const instancias = new Set(Object.values(SYSTEMIC_SCREENING).flatMap(d => d.sistemas.filter(s => s.id === id)));
    assert.ok(instancias.size <= 1, `${id}: ${instancias.size} copias distintas`);
  }
});

// ── «¿Por qué?» de los tests de la fase 4b (docs/razonamiento-tests.md) ─────
console.log('\nrazonamiento de los tests (fase 4b)');
const { frasesPerdidas } = await import('../criterios.mjs');
const SNAP_CRITERIOS = JSON.parse(readFileSync(join(TESTS, 'fixtures', 'criterios-4b.json'), 'utf8'));
const TODOS_TESTS = Object.entries(HYPOTHESES).flatMap(([hId, h]) => h.tests.map((t, i) => ({ hId, h, t, i })));

test('criterios 4b: nada se pierde al recortar (cada frase sigue en el criterio o en razonamiento.detalle)', () => {
  const { perdidas, sinSnap, sobrantes } = frasesPerdidas(HYPOTHESES, SNAP_CRITERIOS);
  const msg = [
    ...perdidas.map(p => `  perdida en ${p.test}: «${p.frase}»`),
    ...sinSnap.map(k => `  sin instantánea: ${k}`),
    ...sobrantes.map(k => `  instantánea de un test que ya no existe: ${k}`),
  ];
  assert.equal(msg.length, 0, `\n${msg.join('\n')}\n  Si el cambio es a propósito: node tests/gen-criterios-snapshot.mjs (ver su cabecera)`);
});

test('razonamiento de un test: solo porque / detalle / fuentes / citas, textos no vacíos', () => {
  for (const { hId, t } of TODOS_TESTS) {
    const r = t.razonamiento;
    if (!r) continue;
    const extra = Object.keys(r).filter(k => !['porque', 'detalle', 'fuentes', 'citas'].includes(k));
    assert.deepEqual(extra, [], `${hId} «${t.name}»: campos fuera del esquema`);
    assert.ok(r.porque || r.detalle, `${hId} «${t.name}»: razonamiento vacío`);
    for (const k of ['porque', 'detalle']) if (k in r) assert.ok(typeof r[k] === 'string' && r[k].trim(), `${hId} «${t.name}»: ${k} vacío`);
    // «Cuánto pesa» se genera (pesoTest): no se escribe a mano
    assert.ok(!('peso' in r), `${hId} «${t.name}»: peso no va en data/`);
  }
});

test('«¿Por qué?» de un test: con fuentes del registro, y cada cita empieza por una de ellas y cada fuente tiene su cita', () => {
  for (const { hId, t } of TODOS_TESTS) {
    const r = t.razonamiento;
    if (!r?.porque) { assert.ok(!r?.fuentes && !r?.citas, `${hId} «${t.name}»: fuentes sin «por qué»`); continue; }
    assert.ok(r.fuentes?.length, `${hId} «${t.name}»: «por qué» sin fuentes`);
    for (const k of r.fuentes) assert.ok(REFERENCIAS[k], `${hId} «${t.name}»: ${k} no está en el registro`);
    const textos = (r.citas || []).map(c => (typeof c === 'string' ? c : c.texto));
    for (const c of textos) assert.ok(r.fuentes.some(k => c.startsWith(k)), `${hId} «${t.name}»: «${c}» no empieza por una de sus fuentes`);
    for (const k of r.fuentes) assert.ok(textos.some(c => c.startsWith(k)), `${hId} «${t.name}»: ${k} sin cita completa`);
  }
});

test('pesoTest: coherente con la puntuación en los 484 tests (testPuntua)', () => {
  const suman = new Set([PESO_TEST.ambos, PESO_TEST.pos, PESO_TEST.neg, PESO_TEST.cluster]);
  for (const { hId, h, t, i } of TODOS_TESTS) {
    const frase = pesoTest(h, t, i);
    const base = Object.values(PESO_TEST).find(v => frase.startsWith(v));
    assert.ok(base, `${hId} «${t.name}»: frase desconocida «${frase}»`);
    assert.equal(suman.has(base), testPuntua(h, t), `${hId} «${t.name}»: «${frase}» frente a testPuntua`);
    if (!t.cluster && t.tipo !== 'pronostico') {
      const lr = lrEfectiva(t);
      if (base === PESO_TEST.pos) assert.ok(lr.posUtil && !lr.negUtil, `${hId} «${t.name}»`);
      if (base === PESO_TEST.neg) assert.ok(lr.negUtil && !lr.posUtil, `${hId} «${t.name}»`);
    }
  }
});

test('pesoTest: casos sueltos y `absorbe`', () => {
  assert.equal(pesoTest({ tests: [] }, { lr_pos: '6', lr_neg: '0.2' }, 0), PESO_TEST.ambos);
  assert.equal(pesoTest({ tests: [] }, { lr_neg: '0.35', lr_pos: '1.8' }, 0), PESO_TEST.neg);
  assert.equal(pesoTest({ tests: [] }, {}, 0), PESO_TEST.sinLR);
  assert.equal(pesoTest({ tests: [] }, { lr_pos: '1.3', lr_neg: '0.64' }, 0), PESO_TEST.debil);
  assert.equal(pesoTest({ tests: [] }, { lr_pos: '6', tipo: 'pronostico' }, 0), PESO_TEST.pronostico);
  const hyp = { tests: [{ name: 'SLR', lr_neg: '0.3' }, { name: 'RAPIDH: compuesto', lr_pos: '5', absorbe: [0] }] };
  assert.equal(pesoTest(hyp, hyp.tests[0], 0), `${PESO_TEST.neg} No suma aparte si puntúa «RAPIDH».`);
  assert.equal(pesoTest(hyp, hyp.tests[1], 1), PESO_TEST.pos);
});

test('tarjeta del test: «cuánto pesa» siempre, «Ampliar» solo con razonamiento, sin la etiqueta «Sin LR publicada»', () => {
  for (const { hId, h, t, i } of TODOS_TESTS) {
    const html = buildTestItem(hId, t, i);
    assert.ok(html.includes(`<div class="test-peso">${pesoTest(h, t, i)}</div>`), `${hId} «${t.name}»: falta el peso`);
    assert.equal(html.includes(`abrirRazonamientoTest(this,'${hId}',${i})`), !!t.razonamiento, `${hId} «${t.name}»: Ampliar`);
    assert.equal(html.includes('class="razon"'), !!t.razonamiento?.porque, `${hId} «${t.name}»: ¿Por qué?`);
    assert.ok(!html.includes('stat-badge no-data'), `${hId} «${t.name}»: badge redundante`);
    // la fuente, como citas tocables (lib/citas.js): autor y año, la cita entera en la ficha
    if (t.fuente) assert.ok(html.includes(citasHTML(t.fuente)), `${hId} «${t.name}»: fuente`);
  }
});

test('fuentes del panel: cada cita de un test con razonamiento se resuelve en el registro y se enlaza con su url o su DOI', () => {
  for (const { hId, t } of TODOS_TESTS) {
    if (!t.razonamiento) continue;
    for (const c of citasTest(t)) {
      const texto = typeof c === 'string' ? c : c.texto;
      const k = claveRegistro(texto, REFERENCIAS);
      assert.ok(k, `${hId} «${t.name}»: «${texto}» no empieza por ninguna clave del registro`);
      const r = REFERENCIAS[k];
      const e = enlaceCita(texto, REFERENCIAS);
      if (r.url) assert.equal(e.url, r.url);
      else if (r.doi) assert.equal(e.url, `https://doi.org/${r.doi}`);
      else assert.equal(e, texto, 'sin url ni DOI, sin enlace');
    }
  }
  assert.equal(claveRegistro('Malik y Herron 2023 (StatPearls)', { 'Malik 2023': {}, 'Malik y Herron 2023': {} }), 'Malik y Herron 2023');
  assert.equal(claveRegistro('Kim 20011', { 'Kim 2001': {} }), null);
});

test('razonamiento de los tests: nunca entra en el payload, 📋 Notas ni 📄 Informe', () => {
  const muestra = TODOS_TESTS.find(x => x.t.razonamiento?.detalle && x.h.region === 'hombro');
  if (!muestra) return;
  const { hId, h, t, i } = muestra;
  withState({ region: h.region, activeHypotheses: [hId], testResults: { [hId]: { [i]: 'pos' } } }, () => {
    for (const txt of [JSON.stringify(buildPhysiQPayload()), buildContextSummaryText(), buildInformeFisioterapiaText()]) {
      assert.ok(!txt.includes(t.razonamiento.detalle.slice(0, 40)), 'detalle filtrado a un resumen');
    }
  });
});

test('hombro y rodilla: criterio visible corto (≤ 600 caracteres; los clusters llevan la técnica de cada componente)', () => {
  for (const { hId, h, t } of TODOS_TESTS) {
    if (!['hombro', 'rodilla'].includes(h.region)) continue;
    assert.ok(t.criterio.length <= 600, `${hId} «${t.name}»: ${t.criterio.length} caracteres`);
  }
});

// ── Ampliar con IA (ampliar-ia.js) ───────────────────────────────────────────
console.log('\nampliar con IA (razonamiento de fases 2 y 4b)');
const ampliarIA = await import('../../ampliar-ia.js');

test('ampliar con IA: el prompt lleva el contexto, el fragmento y la frase de fuentes literal', () => {
  const { promptIA, ctxCribado, ctxTest, INSTRUCCION_FUENTES } = ampliarIA;
  assert.equal(INSTRUCCION_FUENTES, 'Busca información solo en fuentes científicas o académicas como PubMed, revistas científicas, libros de medicina o fisiología o fuentes institucionales universitarias.');
  const p = promptIA({ contexto: ctxCribado('tobillo_pie', '¿Dolor <b>nocturno</b>?'), texto: '  La  isquemia\n produce dolor. ' });
  assert.ok(p.includes('la pregunta de cribado de banderas rojas «¿Dolor nocturno?» (región tobillo y pie)'), p);
  assert.ok(p.includes('«La isquemia produce dolor.»'), p);
  assert.ok(p.includes(INSTRUCCION_FUENTES) && p.endsWith('Cita las fuentes con enlace.'), p);
  assert.equal(ctxTest('hombro', 'Hawkins-Kennedy', 'Tendinopatía del manguito'), 'el test clínico «Hawkins-Kennedy» para la hipótesis «Tendinopatía del manguito» (región hombro)');
  assert.equal(ctxTest(undefined, 'Hawkins-Kennedy'), 'el test clínico «Hawkins-Kennedy»');
});

test('ampliar con IA: fragmento recortado, URLs de Perplexity y Google (modo IA) codificadas', () => {
  const { recortarTextoIA, MAX_TEXTO_IA, urlIA, promptIA } = ampliarIA;
  const largo = recortarTextoIA('palabra '.repeat(300));
  assert.ok(largo.length <= MAX_TEXTO_IA + 1 && largo.endsWith('palabra…'), largo.slice(-20));
  const q = promptIA({ contexto: '', texto: 'a & b? «c» 100%' });
  assert.equal(urlIA('perplexity', q), `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}`);
  assert.equal(urlIA('google', q), `https://www.google.com/search?udm=50&q=${encodeURIComponent(q)}`);
  assert.equal(urlIA('otro', q), urlIA('perplexity', q), 'destino desconocido → Perplexity');
  // el prompt más largo posible cabe en la URL
  assert.ok(urlIA('google', promptIA({ contexto: 'x'.repeat(200), texto: 'á'.repeat(5000) })).length < 8000);
});

test('ampliar con IA: destino por defecto Perplexity; cada destino explica su ventaja; Claude avisa de la cuenta', () => {
  const { destinoIA, DESTINOS_IA, DESTINO_IA_DEFECTO, NOTA_CUENTAS, urlIA } = ampliarIA;
  assert.equal(destinoIA(), 'perplexity');
  assert.deepEqual(Object.keys(DESTINOS_IA), ['perplexity', 'google', 'claude']);
  for (const d of Object.values(DESTINOS_IA)) assert.ok(d.nombre && d.ventaja.length > 40);
  // Claude pide sesión: nunca por defecto, y su ventaja y la nota lo dicen
  assert.ok(DESTINOS_IA.claude.cuenta && !DESTINOS_IA[DESTINO_IA_DEFECTO].cuenta);
  assert.ok(/cuenta/.test(DESTINOS_IA.claude.ventaja), DESTINOS_IA.claude.ventaja);
  assert.equal(NOTA_CUENTAS, 'Perplexity y Google son gratis y sin cuenta; Claude pide cuenta (gratuita). Todas permiten seguir preguntando.');
  assert.equal(urlIA('claude', 'a & b?'), `https://claude.ai/new?q=${encodeURIComponent('a & b?')}`);
});

test('preguntar a la IA: pregunta libre con los mismos añadidos, la región como único contexto', () => {
  const { promptPregunta, INSTRUCCION_FUENTES, MAX_TEXTO_IA } = ampliarIA;
  assert.equal(promptPregunta({ contexto: 'hombro', pregunta: '  ¿Hawkins o\n Neer? ' }),
    `Soy fisioterapeuta. Contexto: valoración de hombro. Mi pregunta: «¿Hawkins o Neer?». ${INSTRUCCION_FUENTES} Cita las fuentes con enlace.`);
  // Sin región (fase 1): sin contexto; sin el enfoque fisiológico del razonamiento
  const sin = promptPregunta({ contexto: '', pregunta: 'Dosis de excéntricos' });
  assert.ok(sin.startsWith('Soy fisioterapeuta. Mi pregunta: «Dosis de excéntricos».'), sin);
  assert.ok(!/fisiopatología|fragmento/.test(sin), sin);
  assert.ok(promptPregunta({ contexto: '', pregunta: 'p '.repeat(1000) }).length < MAX_TEXTO_IA + 300);
});

test('preguntar a la IA: el contexto es solo la región, nada del estado del paciente', () => {
  const src = leer('app.js');
  const ctx = src.match(/const _ctxPregunta = \(\) => ([^;]+);/);
  assert.ok(ctx, 'existe _ctxPregunta');
  assert.equal(ctx[1].trim(), "(state.region ? nombreRegion(state.region).toLowerCase() : '')");
  // promptPregunta solo se llama con ese contexto y el texto del diálogo
  const llamadas = src.match(/promptPregunta\(\{[^}]*\}\)/g) || [];
  assert.ok(llamadas.length > 0 && llamadas.every(l => l === 'promptPregunta({ contexto: _ctxPregunta(), pregunta: q })'), llamadas.join(' | '));
});

test('ampliar con IA: el módulo no importa nada (no puede leer datos del paciente)', () => {
  const src = leer('ampliar-ia.js');
  assert.ok(!/^\s*import\b/m.test(src) && !/\bimport\(/.test(src), 'ampliar-ia.js no importa módulos');
  assert.ok(!/\bstate\b/.test(src.replace(/\/\/.*$/gm, '')), 'ampliar-ia.js no toca state');
  assert.equal(ampliarIA.attrIA('«a» "b" <c> & d'), '«a» &quot;b&quot; &lt;c&gt; &amp; d');
});

test('ampliar con IA: solo el razonamiento lleva data-ia-ctx y «✨ IA» (fase 2 y tarjetas 4b)', () => {
  const cuenta = (h, t) => h.split(t).length - 1;
  for (const [region, data] of Object.entries(SYSTEMIC_SCREENING)) {
    withState({ region }, () => {
      for (const sis of data.sistemas) {
        const html = buildSistemaHTML(sis);
        const n = sis.preguntas.filter(q => q.razonamiento).length;
        // y el «¿Por qué?» de las banderas: un contenedor por bandera, un «✨ IA» por cada «Por qué»
        const porBandera = [...(sis.banderasRojas || []), ...(sis.banderasAmarillas || [])]
          .map(f => typeof f === 'string' ? 0 : f.razonamiento ? 1
            : sis.preguntas.filter(q => [].concat(f.pregunta || []).includes(q.id) && q.razonamiento).length);
        const nb = porBandera.filter(Boolean).length, np = porBandera.reduce((a, b) => a + b, 0);
        assert.equal(cuenta(html, 'data-ia-ctx='), n + nb, `${region}/${sis.id}`);
        assert.equal(cuenta(html, 'class="ia-parrafo"'), n + np, `${region}/${sis.id}`);
      }
    });
  }
  for (const { hId, t, i } of TODOS_TESTS) {
    const html = buildTestItem(hId, t, i);
    const n = t.razonamiento?.porque ? 1 : 0;
    assert.equal(cuenta(html, 'data-ia-ctx='), n, `${hId} «${t.name}»`);
    assert.equal(cuenta(html, 'class="ia-parrafo"'), n, `${hId} «${t.name}»`);
  }
});

Object.assign(state, BASE_STATE);   // deja el modo en completo para lo que venga detrás

// ── «¿Por qué esta pregunta?» de los pasos del árbol (fase 4) ────────────────
// docs/razonamiento-arbol.md. Campo opcional por paso: porque + fuentes del
// registro (+ detalle, citas); nunca en el payload, los resúmenes ni el prompt.
console.log('\nrazonamiento del árbol CIF (fase 4)');
const { CIF_TREES } = await import('../../data.js');
const { razonamientoPasoHTML } = await import('../../phase4.js');
const IA = await import('../../informe-ia.js');
const IN = await import('../../lib/informe-narrativo.js');
const PASOS_CON_RAZON = Object.entries(CIF_TREES).flatMap(([region, t]) => t.steps.filter(s => s.razonamiento).map(step => ({ region, step, r: step.razonamiento })));

test('razonamiento del árbol: solo porque / detalle / fuentes / citas; porque y fuentes no vacíos, todas en el registro', () => {
  for (const { region, step, r } of PASOS_CON_RAZON) {
    const k = `${region}/${step.id}`;
    for (const c of Object.keys(r)) assert.ok(['porque', 'detalle', 'fuentes', 'citas'].includes(c), `${k}: campo «${c}» fuera del esquema`);
    assert.ok(noVacio(r.porque), `${k}: porque vacío`);
    if ('detalle' in r) assert.ok(noVacio(r.detalle), `${k}: detalle vacío`);
    assert.ok(Array.isArray(r.fuentes) && r.fuentes.length > 0, `${k}: sin fuentes`);
    for (const f of r.fuentes) assert.ok(REFERENCIAS[f], `${k}: «${f}» no está en el registro`);
    if (!r.citas) continue;
    for (const c of r.citas.map(textoCita)) assert.ok(r.fuentes.some(f => c.startsWith(f)), `${k}: cita sin fuente: ${c}`);
    for (const f of r.fuentes) assert.ok(r.citas.map(textoCita).some(c => c.startsWith(f)), `${k}: fuente sin cita: ${f}`);
    for (const c of r.citas.filter(c => typeof c !== 'string')) {
      assert.deepEqual(Object.keys(c).sort(), ['texto', 'url'], `${k}: cita con campos raros`);
      assert.equal(c.url, REFERENCIAS[r.fuentes.find(f => c.texto.startsWith(f))]?.url, `${k}: url distinta de la del registro`);
    }
  }
});

test('razonamiento del árbol: «¿Por qué esta pregunta?» solo en pasos que lo tienen, «Ampliar» solo con detalle, contexto IA del paso', () => {
  const cuenta = (h, t) => h.split(t).length - 1;
  for (const [region, t] of Object.entries(CIF_TREES)) {
    for (const step of t.steps) {
      const html = razonamientoPasoHTML(step, region);
      const r = step.razonamiento;
      assert.equal(html.includes('class="razon"'), !!r, `${region}/${step.id}: ¿Por qué?`);
      assert.equal(html.includes(`abrirRazonamientoPaso(this,'${step.id}')`), !!r?.detalle, `${region}/${step.id}: Ampliar`);
      assert.equal(cuenta(html, 'data-ia-ctx='), r ? 1 : 0, `${region}/${step.id}: data-ia-ctx`);
      assert.equal(cuenta(html, 'class="ia-parrafo"'), r ? 1 : 0, `${region}/${step.id}: «✨ IA»`);
    }
  }
  // Con un razonamiento de prueba: el contexto usa iaPregunta (sin la instrucción para el fisio)
  const paso = { ...CIF_TREES.lumbar.steps.find(s => s.id === 'lu_step4'), razonamiento: { porque: 'x', detalle: 'y', fuentes: ['Lluch 2020'] } };
  const html = razonamientoPasoHTML(paso, 'lumbar');
  assert.ok(html.includes(ampliarIA.attrIA(ampliarIA.ctxArbol('lumbar', '¿Qué patrón encaja mejor?'))), 'contexto con iaPregunta');
  assert.ok(!html.includes('Revisar siempre cadera'), 'sin la instrucción de la pregunta en el contexto');
});

test('razonamiento del árbol: nunca entra en el payload, 📋 Notas, 📄 Informe ni el prompt del informe con IA', () => {
  // Marcador en todos los pasos de todas las regiones (con o sin razonamiento
  // real), recorrido completo por la primera opción, y nada debe filtrarse.
  const MARCA = 'MARCA-RAZONAMIENTO-ARBOL';
  const guardados = new Map();
  for (const t of Object.values(CIF_TREES)) for (const s of t.steps) {
    guardados.set(s, s.razonamiento);
    s.razonamiento = { porque: `${MARCA} porque`, detalle: `${MARCA} detalle`, fuentes: ['Lluch 2020'], citas: [`Lluch 2020 ${MARCA}`] };
  }
  try {
    for (const [region, t] of Object.entries(CIF_TREES)) {
      const treeAnswers = Object.fromEntries(t.steps.map(s => [s.id, s.options[0].value]));
      const activeHypotheses = [...new Set(t.steps.flatMap(s => s.options[0].hypothesis))];
      withState({ region, treeAnswers, activeHypotheses }, () => {
        const payload = buildPhysiQPayload();
        const ampliado = IA.construirAmpliado();
        const textos = [JSON.stringify(payload), buildContextSummaryText(), buildInformeFisioterapiaText(), JSON.stringify(ampliado),
          IN.buildNarrativePrompt(payload, { conAudio: false, ampliado }), IN.buildFichaBrevePrompt(payload, { conAudio: false, ampliado })];
        assert.ok(textos[3].includes(t.steps[0].iaPregunta || t.steps[0].question.slice(0, 20)), `${region}: control, la pregunta sí va en el prompt`);
        for (const x of textos) assert.ok(!x.includes(MARCA), `${region}: razonamiento del árbol filtrado`);
      });
    }
  } finally {
    for (const [s, r] of guardados) { if (r === undefined) delete s.razonamiento; else s.razonamiento = r; }
  }
});

test('ampliar con IA: ctxArbol nombra el paso del árbol y la región', () => {
  assert.equal(ampliarIA.ctxArbol('tobillo_pie', '¿Dolor <b>medial</b>?'), 'el paso del árbol de decisión clínica (modelo CIF) «¿Dolor medial?» (región tobillo y pie)');
  assert.equal(ampliarIA.ctxArbol(undefined, '¿X?'), 'el paso del árbol de decisión clínica (modelo CIF) «¿X?»');
});

Object.assign(state, BASE_STATE);
