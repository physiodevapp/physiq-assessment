// Guía de condiciones especiales (docs/condiciones-especiales.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, buildPhysiQPayload, buildInformeFisioterapiaText,
  buildContextSummaryText, withState, state, VALID_REGIONS } from './comun.mjs';
const { CONDICIONES, TEXTOS_CONDICIONES } = await import('../../data/condiciones.js');
const C = await import('../../lib/condiciones.js');
const { REFERENCIAS } = await import('../../data/referencias.js');
const { SIS_HIPERMOVILIDAD, SIS_DISAUTONOMIA, SIS_LUPUS, SIS_MASTOCITOS, SIS_OSTEOPOROSIS } = await import('../../data/comun.js');

console.log('\ncondiciones especiales (guía de la cabecera)');

const fila = id => CONDICIONES.find(c => c.id === id);
const html = leer('index.html');

test('orden de las filas (decisión 2): transversales de la más frecuente a la menos, luego lumbar y cadera', () => {
  assert.deepEqual(CONDICIONES.map(c => c.id), ['posquirurgico', 'hipermovilidad', 'disautonomia', 'lupus', 'mastocitos', 'osteoporosis', 'tarlov', 'cascanueces', 'congestionPelvica']);
  assert.deepEqual(CONDICIONES.filter(c => c.region).map(c => c.region), ['lumbar', 'lumbar', 'cadera']);
});

test('cada sistema transversal que solo se ve al marcarlo tiene su fila (una condición nueva añade la suya)', () => {
  const PORCLAVE = { soloPosquirurgico: 'posquirurgico', soloHipermovilidad: 'hipermovilidad', soloDisautonomia: 'disautonomia', soloLupus: 'lupus', soloMastocitos: 'mastocitos', soloOsteoporosis: 'osteoporosis' };
  const claves = new Set(Object.values(SYSTEMIC_SCREENING).flatMap(r => r.sistemas)
    .flatMap(s => Object.keys(s).filter(k => /^solo[A-Z]/.test(k) && s[k] === true)));
  for (const k of claves) {
    assert.ok(PORCLAVE[k], `${k}: sistema especial sin fila en data/condiciones.js`);
    assert.ok(fila(PORCLAVE[k]), k);
  }
});

test('cada pista sale de una pregunta que existe (cuestionario, sospecha, rasgos o cribado de su región)', () => {
  const ids = new Set([
    ...SIS_HIPERMOVILIDAD.hipermovilidad.cuestionario.map(q => q.id),
    ...SIS_DISAUTONOMIA.disautonomia.sospecha.map(q => q.id),
    ...SIS_LUPUS.lupus.rasgos.map(q => q.id),
    ...SIS_MASTOCITOS.preguntas.map(q => q.id),
    ...SIS_OSTEOPOROSIS.osteoporosis.factores.map(q => q.id),
    'l_e4',   // la pista del embarazo y la lactancia sale de la pregunta de lumbar (docs/osteoporosis.md, decisión 12)
  ]);
  for (const c of CONDICIONES) {
    assert.ok(c.pistas.length >= 1 && c.pistas.length <= 3, `${c.id}: 1 a 3 pistas`);
    for (const p of c.pistas) {
      for (const id of p.de) {
        const enRegion = c.region && SYSTEMIC_SCREENING[c.region].sistemas.some(s => s.preguntas.some(q => q.id === id));
        assert.ok(ids.has(id) || enRegion, `${c.id}: «${id}» no existe`);
      }
    }
    // Solo el posquirúrgico no tiene pista clínica que citar (su definición es el mecanismo)
    if (c.id !== 'posquirurgico') assert.ok(c.pistas.every(p => p.de.length), `${c.id}: pista sin pregunta de origen`);
  }
});

test('cada fuente es una clave del registro que ya cita la pregunta de la que sale la pista', () => {
  const citaDe = id => {
    const sueltas = { cq: SIS_HIPERMOVILIDAD.hipermovilidad.cuestionarioFuente, io: SIS_DISAUTONOMIA.disautonomia.sospechaFuente, lr: SIS_LUPUS.lupus.rasgosFuente, of: SIS_OSTEOPOROSIS.osteoporosis.factoresFuente };
    const pre = id.slice(0, 2);
    if (sueltas[pre]) return sueltas[pre];
    const q = Object.values(SYSTEMIC_SCREENING).flatMap(r => r.sistemas).flatMap(s => s.preguntas).find(x => x.id === id);
    return [...(q?.razonamiento?.fuentes || []), q?.razonamiento?.porque, q?.razonamiento?.peso].join(' ');
  };
  for (const c of CONDICIONES) {
    const textos = c.pistas.flatMap(p => p.de).map(citaDe).join(' ');
    for (const f of c.fuentes) {
      assert.ok(REFERENCIAS[f], `${c.id}: «${f}» no está en el registro`);
      assert.ok(textos.includes(f) || (c.id === 'hipermovilidad' && textos.includes(f.split(' ')[0])), `${c.id}: «${f}» no la cita la pregunta de origen`);
    }
  }
});

test('cada destino existe: la tarjeta de la fase 1 o la pregunta del cribado de su región', () => {
  for (const c of CONDICIONES) {
    if (c.destino.tarjeta) assert.ok(html.includes(`id="${c.destino.tarjeta}"`), `${c.id}: #${c.destino.tarjeta}`);
    else assert.ok(SYSTEMIC_SCREENING[c.region].sistemas.some(s => s.preguntas.some(q => q.id === c.destino.pregunta)), `${c.id}: ${c.destino.pregunta}`);
  }
});

test('estado de las transversales con cada valor de su tarjeta', () => {
  const e = (id, patch) => C.estadoCondicion(fila(id), { ...state, ...patch });
  assert.deepEqual(e('posquirurgico', { mecanismo: '' }), { texto: 'No marcado', marcada: false });
  assert.deepEqual(e('posquirurgico', { mecanismo: 'Post-quirúrgico' }), { texto: 'Marcado', marcada: true });
  assert.deepEqual(e('posquirurgico', { mecanismo: 'Traumático' }), { texto: 'No marcado', marcada: false });
  const hm = (estado, subtipo = '') => e('hipermovilidad', { hipermovilidad: { estado, subtipo } }).texto;
  assert.equal(hm(''), 'No consta');
  assert.equal(hm('sospecha'), 'Sospecha');
  assert.equal(hm('diagnosticada'), 'Diagnosticada');
  assert.equal(hm('diagnosticada', 'vascular'), 'Diagnosticada (vascular)');
  assert.equal(hm('diagnosticada', 'hipermovil'), 'Diagnosticada (hipermóvil)');
  assert.equal(hm('diagnosticada', 'ns'), 'Diagnosticada');
  const ds = (estado, tipo = '') => e('disautonomia', { disautonomia: { estado, tipo } }).texto;
  assert.equal(ds(''), 'No consta');
  assert.equal(ds('sospecha'), 'Sospecha');
  assert.equal(ds('diagnosticada', 'pots'), 'Diagnosticada (POTS)');
  assert.equal(ds('diagnosticada', 'ho'), 'Diagnosticada (hipotensión ortostática)');
  assert.equal(ds('diagnosticada', 'otra'), 'Diagnosticada');
  const le = estado => e('lupus', { lupus: { estado } });
  assert.deepEqual(le(''), { texto: 'No consta', marcada: false });
  assert.deepEqual(le('sospecha'), { texto: 'Sospecha', marcada: true });
  assert.deepEqual(le('diagnosticado'), { texto: 'Diagnosticado', marcada: true });
  assert.deepEqual(e('mastocitos', { mastocitos: { estado: '' } }), { texto: 'No consta', marcada: false });
  assert.deepEqual(e('mastocitos', { mastocitos: { estado: 'diagnosticado' } }), { texto: 'Diagnosticado', marcada: true });
  assert.equal(C.estadoCondicion(fila('mastocitos'), { mecanismo: '' }).texto, 'No consta');
  const op = estado => e('osteoporosis', { osteoporosis: { estado } });
  assert.deepEqual(op(''), { texto: 'No consta', marcada: false });
  assert.deepEqual(op('sospecha'), { texto: 'Sospecha', marcada: true });
  assert.deepEqual(op('diagnosticada'), { texto: 'Diagnosticada', marcada: true });
  assert.equal(C.estadoCondicion(fila('osteoporosis'), { mecanismo: '' }).texto, 'No consta');
  // Sesiones antiguas sin las tarjetas
  assert.equal(C.estadoCondicion(fila('lupus'), { mecanismo: '' }).texto, 'No consta');
});

test('filas de región (Tarlov, cascanueces, congestión pélvica): «Sí» solo con la pregunta marcada en su región, nunca un «No» (decisión 4)', () => {
  for (const id of ['tarlov', 'cascanueces', 'congestionPelvica']) {
    const reg = fila(id).region, otra = reg === 'lumbar' ? 'cadera' : 'lumbar';
    const q = fila(id).destino.pregunta;
    const e = patch => C.estadoCondicion(fila(id), { ...state, ...patch });
    assert.equal(e({ region: reg, sistemicoAnswers: {} }), null, id);
    assert.equal(e({ region: reg, sistemicoAnswers: { [q]: 'NO' } }), null, id);
    assert.deepEqual(e({ region: reg, sistemicoAnswers: { [q]: 'SI' } }), { texto: 'Sí', marcada: true }, id);
    assert.equal(e({ region: otra, sistemicoAnswers: { [q]: 'SI' } }), null, `${id}: respuesta antigua de otra región`);
  }
});

test('las filas de región se ven siempre, pero su botón solo navega con su región (decisión 3)', () => {
  for (const r of VALID_REGIONS.concat([''])) {
    const h = C.condicionesHTML({ ...state, region: r });
    for (const c of CONDICIONES) assert.ok(h.includes(`data-condicion="${c.id}"`), `${r || 'sin región'}: ${c.id}`);
    const tarlov = h.slice(h.indexOf('data-condicion="tarlov"'));
    if (r === 'lumbar') assert.ok(tarlov.includes(`onclick="irACondicion('tarlov')"`) && !tarlov.slice(0, tarlov.indexOf('</section>')).includes('disabled'));
    else assert.ok(tarlov.slice(0, tarlov.indexOf('</section>')).includes('disabled>Elige lumbar en la fase 2'), r);
    const cp = h.slice(h.indexOf('data-condicion="congestionPelvica"'));
    const cpFila = cp.slice(0, cp.indexOf('</section>'));
    if (r === 'cadera') assert.ok(cpFila.includes(`onclick="irACondicion('congestionPelvica')"`) && !cpFila.includes('disabled'));
    else assert.ok(cpFila.includes('disabled>Elige cadera en la fase 2'), r);
    assert.ok(h.includes(`onclick="irACondicion('lupus')"`), `${r}: las transversales navegan siempre`);
  }
});

test('el diálogo: aviso del diagnóstico, apartados «Solo en lumbar» y «Solo en cadera», fuentes como citas y sin fila para el MALS', () => {
  const h = C.condicionesHTML({ ...state, region: 'lumbar' });
  assert.ok(h.includes(TEXTOS_CONDICIONES.diagnostico) && h.includes(TEXTOS_CONDICIONES.pie));
  assert.ok(h.indexOf('Solo en lumbar') > h.indexOf('data-condicion="lupus"') && h.indexOf('Solo en lumbar') < h.indexOf('data-condicion="tarlov"'));
  assert.ok(h.indexOf('Solo en cadera') > h.indexOf('data-condicion="cascanueces"') && h.indexOf('Solo en cadera') < h.indexOf('data-condicion="congestionPelvica"'));
  assert.ok(h.includes('class="cita') && h.includes('data-cita="Aringer 2019"'));
  assert.ok(!h.slice(h.indexOf('data-condicion="posquirurgico"'), h.indexOf('data-condicion="hipermovilidad"')).includes('class="cita'), 'el posquirúrgico no cita nada');
  assert.ok(!/MALS|arcuato/i.test(h), 'MALS sin fila (decisión 5)');
});

test('pintar el diálogo no cambia la valoración (no marca nada)', () => {
  withState({ region: 'lumbar', mecanismo: 'Insidioso' }, () => {
    const antes = JSON.stringify(state);
    C.condicionesHTML(state);
    for (const c of CONDICIONES) C.estadoCondicion(c, state);
    assert.equal(JSON.stringify(state), antes);
  });
});

test('nada de la guía llega al payload, a 📋 Notas ni al 📄 Informe', () => {
  withState({ region: 'lumbar', mecanismo: 'Post-quirúrgico', hipermovilidad: { estado: 'sospecha' } }, () => {
    const salidas = [JSON.stringify(buildPhysiQPayload()), buildContextSummaryText(), buildInformeFisioterapiaText()].join('\n');
    for (const c of CONDICIONES) {
      assert.ok(!salidas.includes(c.que), `${c.id}: «qué es»`);
      for (const p of c.pistas) assert.ok(!salidas.includes(p.texto), `${c.id}: pista`);
    }
    assert.ok(!salidas.includes(TEXTOS_CONDICIONES.intro));
  });
});

test('entrada: icono en la cabecera (brújula), opción en «Herramientas» y el diálogo', () => {
  assert.ok(/id="condBtn"[^>]*onclick="abrirCondiciones\(\)"/.test(html));
  assert.ok(html.includes(`onclick="herramientaElegir('condiciones')"`));
  assert.ok(html.includes('id="condOverlay"') && html.includes('id="condCuerpo"'));
  const css = leer('styles.css');
  assert.ok(/\.app-header \.cond-btn[^{]*\{ display: none; \}/.test(css), 'en móvil va dentro de «Herramientas»');
  assert.ok(leer('.github/workflows/deploy-to-hub.yml').includes('lib/condiciones.js'));
});
