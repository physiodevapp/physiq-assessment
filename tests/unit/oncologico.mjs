// Antecedente de cáncer (Fase P, docs/antecedente-oncologico.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, buildPhysiQPayload, buildInformeFisioterapiaText,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML, sistemasActivos, withState, VALID_REGIONS } from './comun.mjs';
const K = await import('../../lib/oncologico.js');
const IN = await import('../../lib/informe-narrativo.js');
const P = await import('../../lib/plan-tratamiento.js');
const PD = await import('../../data/plan-tratamiento.js');
const { REFERENCIAS } = await import('../../data/referencias.js');
const { SIS_ONCOLOGICO, SIS_PARKINSON } = await import('../../data/comun.js');

console.log('\nAntecedente de cáncer (Fase P)');

const on = (estado = '', extra = {}) => ({ oncologico: { ...K.oncologicoVacio(), estado, ...extra } });
const visibles = (estado, extra) => {
  let ids = [];
  withState({ region: 'lumbar', ...on(estado, extra) }, () => { ids = sistemasActivos().find(s => s.soloOncologico)?.preguntas.map(q => q.id) || []; });
  return ids;
};
const T = K.ON.textos;

test('sistema común: la misma instancia en las 7 regiones, tras el del Parkinson, oculto sin la tarjeta', () => {
  for (const r of VALID_REGIONS) {
    const sis = SYSTEMIC_SCREENING[r].sistemas;
    assert.equal(sis.indexOf(SIS_ONCOLOGICO), sis.indexOf(SIS_PARKINSON) + 1, `${r}: justo después del Parkinson`);
    withState({ region: r, ...on() }, () => assert.ok(!sistemasActivos().some(s => s.soloOncologico), `${r}: sin la tarjeta no se ve`));
    withState({ region: r, ...on('terminado') }, () => assert.ok(sistemasActivos().some(s => s.soloOncologico), `${r}: con la tarjeta se ve`));
  }
});

test('tarjeta: dos estados, después de la de implantes; chips con «No lo sabe» excluyente; filas que dependen de otras', () => {
  assert.deepEqual(Object.keys(K.ESTADOS_ON), ['terminado', 'tratamiento']);
  const html = leer('index.html');
  assert.ok(html.indexOf('id="cardImplantes"') < html.indexOf('id="cardOncologico"'), 'después de los implantes');
  assert.ok(html.indexOf('id="cardOncologico"') < html.indexOf('id="cardFarmacos"'), 'antes de los fármacos');
  for (const v of ['terminado', 'tratamiento']) assert.ok(html.includes(`selectONEstado('${v}')`));
  for (const [fila, ops] of [['metastasis', K.ON.metastasis], ['revision', K.ON.revision]]) for (const v of Object.keys(ops)) assert.ok(html.includes(`selectONFila('${fila}','${v}')`), `${fila}: ${v}`);
  assert.deepEqual(K.ON.canceres.map(x => x.id), ['mama', 'prostata', 'colorrectal', 'pulmon', 'hematologico', 'cabezaCuello', 'ginecologico', 'otro', 'ns']);
  assert.deepEqual(K.ON.tratamientos.map(x => x.id), ['cirugiaGanglios', 'quimio', 'cardiotoxico', 'rtCorazon', 'rtCuello', 'hormonal', 'inmuno', 'ns']);
  assert.deepEqual(K.ON.secuelas.map(x => x.id), ['neuropatia', 'linfedema', 'ostomia', 'fatiga', 'osteoporosis']);
  let v = K.alternarChip(on('terminado').oncologico, 'canceres', 'mama');
  v = K.alternarChip(v, 'canceres', 'ns');
  assert.deepEqual(v.canceres, ['ns'], '«No lo sabe» quita los demás');
  v = K.alternarChip(v, 'canceres', 'pulmon');
  assert.deepEqual(v.canceres, ['pulmon'], 'y al revés');
  // Dónde las metástasis, solo con «Sí»; miembro del linfedema, solo con «Linfedema»; revisión, solo con cardiotóxico o «No lo sabe»
  assert.deepEqual(K.normalizarOncologico({ estado: 'terminado', metastasis: 'ns', zonas: ['columna'] }).zonas, []);
  assert.deepEqual(K.normalizarOncologico({ estado: 'terminado', secuelas: [], linfedema: ['brazoIzquierdo'] }).linfedema, []);
  assert.equal(K.normalizarOncologico({ estado: 'terminado', tratamientos: ['quimio'], revision: 'no' }).revision, '');
  for (const tr of [['cardiotoxico'], ['rtCorazon'], ['ns']]) assert.ok(K.revisionVisible({ ...K.oncologicoVacio(), estado: 'terminado', tratamientos: tr }), tr[0]);
  assert.deepEqual(K.normalizarOncologico(undefined), K.oncologicoVacio());
  assert.deepEqual(K.normalizarOncologico({ estado: 'x', canceres: ['mama'] }), K.oncologicoVacio());
});

test('líneas rojas de la tarjeta: metástasis (con «Hasta confirmarlo:»), corazón, tensión en los dos brazos, ostomía', () => {
  const lin = extra => K.lineasTarjetaON({ ...K.oncologicoVacio(), estado: 'terminado', ...extra });
  assert.deepEqual(lin({}), []);
  assert.deepEqual(lin({ metastasis: 'si' }).map(l => l.texto), [T.metastasis]);
  assert.ok(lin({ metastasis: 'ns' })[0].texto.startsWith('Hasta confirmarlo: antes del ejercicio estructurado'));
  assert.deepEqual(lin({ metastasis: 'no' }), []);
  for (const revision of ['', 'no', 'ns']) assert.deepEqual(lin({ tratamientos: ['cardiotoxico'], revision }).map(l => l.clave), ['cardiaco'], revision || 'sin responder');
  assert.deepEqual(lin({ tratamientos: ['rtCorazon'], revision: 'si_normal' }), []);
  assert.deepEqual(lin({ tratamientos: ['rtCorazon'], revision: 'si_alterado' }).map(l => l.texto), [T.cardiacoAlterado]);
  assert.deepEqual(lin({ tratamientos: ['rtCuello'] }).map(l => l.texto), [T.tensionBrazos]);
  assert.deepEqual(lin({ secuelas: ['ostomia'] }).map(l => l.texto), [T.ostomiaTarjeta]);
  assert.ok(T.metastasis.includes('Campbell 2022, tabla 1') && T.cardiaco.includes('Gilchrist 2019') && T.tensionBrazos.includes('Gilchrist 2019'));
  // La osteoporosis solo enlaza su tarjeta (no la marca)
  const app = leer('app.js');
  assert.ok(app.includes("onclick=\"irATarjetaOP()\"") && app.includes("abrirFarmacos({ familia: 'hueso' })"));
});

test('fase 2: dos urgencias y tres derivaciones; quién ve cada una; sin embudo; banderas enlazadas', () => {
  assert.deepEqual(SIS_ONCOLOGICO.preguntas.filter(q => q.urgencia).map(q => q.id), ['on_u_medula', 'on_u_columna']);
  assert.deepEqual(SIS_ONCOLOGICO.preguntas.filter(q => q.derivacion).map(q => q.id), ['on_d_hueso', 'on_d_corazon', 'on_d_linfedema']);
  assert.match(SIS_ONCOLOGICO.preguntas[1].urgencia, /24 h/);
  assert.deepEqual(visibles('terminado'), ['on_u_medula', 'on_u_columna', 'on_d_hueso']);
  assert.ok(visibles('tratamiento', { tratamientos: ['cardiotoxico'] }).includes('on_d_corazon'));
  assert.ok(visibles('terminado', { tratamientos: ['rtCorazon'] }).includes('on_d_corazon'));
  assert.ok(!visibles('terminado', { tratamientos: ['ns'] }).includes('on_d_corazon'), 'solo con tratamiento cardiotóxico');
  assert.ok(visibles('terminado', { secuelas: ['linfedema'] }).includes('on_d_linfedema'));
  assert.ok(visibles('terminado', { tratamientos: ['cirugiaGanglios'] }).includes('on_d_linfedema'));
  const ids = new Set(SIS_ONCOLOGICO.preguntas.map(q => q.id));
  for (const b of [...SIS_ONCOLOGICO.banderasRojas, ...SIS_ONCOLOGICO.banderasAmarillas]) assert.ok(ids.has(b.pregunta), b.texto);
  for (const q of SIS_ONCOLOGICO.preguntas) assert.ok(q.razonamiento?.fuentes.every(f => REFERENCIAS[f]), q.id);
  withState({ region: 'lumbar', ...on('terminado') }, () => {
    const html = buildSistemaHTML(sistemasActivos().find(s => s.soloOncologico));
    assert.ok(!html.includes('data-embudo='), 'sin embudo');
  });
  withState({ region: 'lumbar', ...on('terminado'), sistemicoAnswers: { on_u_medula: 'SI', on_d_hueso: 'SI' }, sistemicoAlerta: true }, () => {
    const d = buildPhysiQPayload();
    assert.ok(d.ur.includes(SIS_ONCOLOGICO.preguntas[0].urgencia));
    assert.ok(d.dv.includes(SIS_ONCOLOGICO.preguntas[2].derivacion));
  });
  withState({ region: 'lumbar', ...on(), sistemicoAnswers: { on_u_medula: 'SI' } }, () => assert.deepEqual(buildPhysiQPayload().ur, []), 'sin la tarjeta no cuenta');
  // En modo breve las urgencias no se pliegan
  withState({ region: 'lumbar', ...on('terminado'), modo: 'breve' }, () => {
    const html = buildSistemaHTML(sistemasActivos().find(s => s.soloOncologico));
    assert.ok(/class="sq2[^"]*sq2-urg[^"]*" id="sq2_on_u_medula"/.test(html) && /class="sq2[^"]*sq2-urg[^"]*" id="sq2_on_u_columna"/.test(html));
  });
});

test('seguridad: marcar la tarjeta, todos los chips, nunca quita ni rebaja una urgencia de otro sistema', () => {
  const todo = {
    canceres: K.ON.canceres.filter(x => x.id !== 'ns').map(x => x.id), tratamientos: K.ON.tratamientos.filter(x => x.id !== 'ns').map(x => x.id),
    metastasis: 'si', zonas: K.ON.zonas.map(x => x.id), revision: 'no', secuelas: K.ON.secuelas.map(x => x.id), linfedema: K.ON.linfedema.map(x => x.id),
  };
  for (const r of VALID_REGIONS) {
    const urgentes = SYSTEMIC_SCREENING[r].sistemas.filter(s => !Object.keys(s).some(k => /^solo[A-Z]/.test(k) && s[k] === true))
      .flatMap(s => s.preguntas).filter(q => q.urgencia);
    const respuestas = Object.fromEntries(urgentes.map(q => [q.id, 'SI']));
    const pinta = () => ({ ur: buildPhysiQPayload().ur, html: sistemasActivos().filter(s => !s.soloOncologico).map(s => buildSistemaHTML(s)).join('') });
    let sin;
    withState({ region: r, ...on(), sistemicoAnswers: respuestas }, () => { sin = pinta(); });
    for (const extra of [{}, todo, { tratamientos: ['ns'], canceres: ['ns'], metastasis: 'ns' }]) {
      for (const estado of ['terminado', 'tratamiento']) {
        withState({ region: r, ...on(estado, extra), sistemicoAnswers: respuestas }, () => {
          const con = pinta();
          assert.deepEqual(con.ur, sin.ur, `${r} · ${estado}: mismas urgencias`);
          assert.equal(con.html, sin.html, `${r} · ${estado}: los demás sistemas se pintan igual`);
        });
      }
    }
  }
});

test('payload `on`: solo con la tarjeta; { es, cn, tr, mo, mz, rc, sc, li }', () => {
  withState({ ...on() }, () => assert.ok(!('on' in buildPhysiQPayload()), 'sin la tarjeta, el payload no cambia'));
  withState({ ...on('terminado', { canceres: ['mama', 'cabezaCuello'], tratamientos: ['quimio', 'cardiotoxico'], metastasis: 'si', zonas: ['columna'], revision: 'no', secuelas: ['linfedema', 'fatiga'], linfedema: ['brazoIzquierdo'] }) },
    () => assert.deepEqual(buildPhysiQPayload().on, { es: 'terminado', cn: ['mama', 'cabeza y cuello'], tr: ['quimio', 'cardiotoxico'], mo: 'si', mz: ['columna'], rc: 'no', sc: ['linfedema', 'fatiga'], li: ['brazoIzquierdo'] }));
  withState({ ...on('tratamiento') }, () => assert.deepEqual(buildPhysiQPayload().on, { es: 'tratamiento', cn: [], tr: [], mo: null, mz: [], rc: null, sc: [], li: [] }));
});

test('📋 Notas, 📄 Informe (solo el antecedente) e informe con IA (sin fuentes)', () => {
  const datos = { canceres: ['mama'], tratamientos: ['quimio', 'cardiotoxico', 'rtCorazon'], metastasis: 'no', revision: 'no', secuelas: ['neuropatia', 'fatiga'] };
  withState({ ...on('terminado', datos) }, () => {
    assert.ok(buildContextSummaryText().includes('🎗 ANTECEDENTE DE CÁNCER: mama · terminado · quimioterapia, antraciclinas o trastuzumab, radioterapia (corazón en el campo) · metástasis óseas: no · corazón revisado: no · secuelas: neuropatía, fatiga'));
    const i = buildInformeFisioterapiaText();
    assert.match(i, /ANTECEDENTE ONCOLÓGICO\n  · Antecedente de cáncer: mama \(tratamiento terminado\)\.\n  · Tratamientos recibidos: quimioterapia, antraciclinas o trastuzumab, radioterapia \(corazón en el campo\)\.\n  · Secuelas: neuropatía, fatiga\./);
    const bloque = i.slice(i.indexOf('ANTECEDENTE ONCOLÓGICO')).split('\n\n')[0];
    assert.ok(!/metástasis|corazón revisado|ejercicio|Campbell|Gilchrist|NICE/i.test(bloque), 'sin metástasis, revisión, ejercicio ni fuentes');
    const ctx = IN.contextoValoracion(buildPhysiQPayload());
    assert.ok(ctx.includes('Antecedente de cáncer (condición especial marcada por el fisioterapeuta):') && ctx.includes(T.iaCorazon));
    assert.ok(!/Campbell|Gilchrist|Schmitz|NICE NG234|McNeish/.test(ctx.slice(ctx.indexOf('Antecedente de cáncer (condición'))), 'el bloque no lleva las fuentes');
  });
  withState({ ...on() }, () => assert.ok(!buildContextSummaryText().includes('ANTECEDENTE DE CÁNCER') && !buildInformeFisioterapiaText().includes('ONCOLÓGICO')));
});

test('fase 5: líneas en su orden, condicionales, todas con fuente salvo las [propias] aprobadas', () => {
  const lin = (d = {}) => K.lineasRecomendacionON({ es: 'terminado', cn: [], tr: [], mo: null, mz: [], rc: null, sc: [], li: [], ...d });
  assert.deepEqual(lin(), [T.triaje, T.dosis, T.supervisado, T.vigilar]);
  assert.deepEqual(lin({ es: 'tratamiento', mo: 'si', tr: ['cardiotoxico'], sc: ['linfedema', 'ostomia', 'neuropatia'] }),
    [T.metastasis5, T.triaje, T.cardiotoxico5, T.dosis, T.supervisado, T.linfedema5, T.ostomia5, T.neuropatia5, T.enTratamiento, T.vigilar]);
  assert.ok(lin({ mo: 'ns' })[0].startsWith('Hasta confirmarlo: consulta con su equipo médico'));
  assert.ok(!lin({ mo: 'no' }).some(l => l.includes('equipo médico antes del ejercicio estructurado')));
  // Las tablas de Campbell 2019 y 2022 (PDF del usuario)
  assert.ok(T.metastasis5.includes('Campbell 2019, tabla 5') && T.metastasis5.includes('Campbell 2022, tabla 1') && T.metastasis4b.includes('Campbell 2019, tabla 5'));
  assert.ok(T.triaje.includes('Campbell 2019, tabla 4') && T.ostomia5.includes('Campbell 2019, tabla 5') && T.neuropatia5.includes('McNeish 2023'));
  // Todas las líneas citan una fuente del registro salvo las de redacción propia aprobada
  const PROPIAS = ['nota', 'ayudaTratamiento', 'duda', 'cardiacoAlterado', 'osteoporosis', 'hormonal', 'neuropatia4b', 'ligera', 'iaCorazon', 'iaMetastasis'];
  for (const [k, t] of Object.entries(T)) {
    if (PROPIAS.includes(k)) continue;
    assert.ok(Object.keys(REFERENCIAS).some(r => t.includes(r)), `${k}: sin fuente`);
  }
  assert.ok(leer('app.js').includes('_oncologicoResultadosHTML(onc)') && leer('app.js').includes('on-fase5'));
  assert.ok(leer('phase4b.js').includes('on-nota-4b') && leer('index.html').includes('id="onNotaFatiga"'));
});

test('fase 6: aviso con cualquier plan; metástasis y corazón según la tarjeta; red de seguridad', () => {
  const hs = ids => ids.map(id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false }));
  const base = { region: 'codo', hipotesis: hs(['x']), elegidas: ['x'], severidad: 5, irritabilidadNivel: 'Moderada', irritabilidad: {} };
  const onc = (x = {}) => ({ estado: 'terminado', metastasis: false, cardiotoxico: false, revisionCardiaca: '', linfedema: false, neuropatia: false, ...x });
  assert.ok(!P.construirPlan(base).avisosHip.includes(PD.AVISOS.oncologico));
  for (const region of ['codo', 'lumbar', 'rodilla']) {
    const con = P.construirPlan({ ...base, region, oncologico: onc() });
    assert.ok(con.avisosHip.includes(PD.AVISOS.oncologico), region);
    assert.ok(!con.avisosHip.includes(PD.AVISOS.oncologicoMetastasis) && !con.avisosHip.includes(PD.AVISOS.oncologicoCorazon), region);
    assert.ok(con.sesion.cierre.includes(PD.TEXTOS_SESION.cierreOncologico) && con.alarmasCasa.includes(PD.TEXTOS_CASA.alarmaOncologico.texto), region);
  }
  assert.ok(P.construirPlan({ ...base, oncologico: onc({ metastasis: true }) }).avisosHip.includes(PD.AVISOS.oncologicoMetastasis));
  for (const r of ['', 'no', 'ns']) assert.ok(P.construirPlan({ ...base, oncologico: onc({ cardiotoxico: true, revisionCardiaca: r }) }).avisosHip.includes(PD.AVISOS.oncologicoCorazon), r);
  for (const r of ['si_normal', 'si_alterado']) assert.ok(!P.construirPlan({ ...base, oncologico: onc({ cardiotoxico: true, revisionCardiaca: r }) }).avisosHip.includes(PD.AVISOS.oncologicoCorazon), r);
  // Sin tope de thrust propio
  assert.ok(!P.construirPlan({ ...base, oncologico: onc({ metastasis: true }) }).avisosHip.some(a => /thrust/i.test(a)));
  // Los avisos son las frases del recuadro, tal cual
  assert.ok(PD.AVISOS.oncologico.includes(T.dosis) && PD.AVISOS.oncologico.includes(T.supervisado));
  assert.ok(PD.AVISOS.oncologicoMetastasis.endsWith(T.metastasis5) && PD.AVISOS.oncologicoCorazon.includes(T.cardiotoxico5) && PD.AVISOS.oncologicoCorazon.endsWith(T.ligera));
  assert.ok(PD.TEXTOS_SESION.cierreOncologico.includes('NICE NG234, 1.3.2') && PD.TEXTOS_SESION.cierreOncologico.includes('NICE NG234, 1.3.3') && PD.TEXTOS_SESION.cierreOncologico.includes('NICE CG151'));
  assert.ok(leer('plan.js').includes('onActivo(state.oncologico)'));
});

test('modo breve: metástasis y revisión del corazón (con cardiotóxico) sin registrar son pendientes; sin embudo', () => {
  withState({ ...on('terminado'), modo: 'breve', region: 'lumbar' }, () => {
    const p = getPendientesBreve();
    assert.ok(p.some(x => x.texto.startsWith('Metástasis óseas sin registrar') && x.ancla === 'cardOncologico'));
    assert.ok(!p.some(x => x.texto.startsWith('Revisión del corazón')), 'sin cardiotóxico no se pide');
    assert.ok(!p.some(x => x.texto.startsWith('Sistemas sin cribar') && x.texto.includes('Antecedente de cáncer')));
  });
  withState({ ...on('terminado', { metastasis: 'no', tratamientos: ['cardiotoxico'] }), modo: 'breve', region: 'lumbar' }, () => {
    const p = getPendientesBreve();
    assert.ok(p.some(x => x.texto.startsWith('Revisión del corazón sin registrar')) && !p.some(x => x.texto.startsWith('Metástasis')));
  });
  withState({ ...on('terminado'), modo: 'completo', region: 'lumbar' }, () => assert.deepEqual(getPendientesBreve(), []));
});

test('registro: las fuentes del texto final están en data/referencias.js', () => {
  for (const k of ['Campbell 2019', 'Schmitz 2019', 'Campbell 2022', 'Gilchrist 2019', 'McNeish 2023', 'NICE NG234', 'NICE CG151', 'Montero-Odasso 2022', 'Downie 2013']) assert.ok(REFERENCIAS[k], k);
});

test('se despliega y se expone: lib/oncologico.js en deploy-to-hub.yml; funciones de la tarjeta en window', () => {
  assert.ok(leer('.github', 'workflows', 'deploy-to-hub.yml').includes('lib/oncologico.js'));
  for (const f of ['selectONEstado', 'selectONFila', 'toggleONChip', 'irATarjetaOP']) assert.equal(typeof globalThis[f], 'function', f);
});

// physiq-report (lib/payload.js, _bloqueON) llevará una copia de bloqueONIA()
// y su test fijará estos mismos textos: si cambian aquí, se copian allí.
const CABECERA = 'Antecedente de cáncer (condición especial marcada por el fisioterapeuta):';
export const ON_CASOS = {
  completo: [{ es: 'terminado', cn: ['mama'], tr: ['quimio', 'cardiotoxico'], mo: 'si', mz: ['columna', 'femur'], rc: 'no', sc: ['linfedema', 'fatiga'], li: ['brazoIzquierdo'] },
    `${CABECERA}\n  · Cáncer: mama\n  · Estado: tratamiento terminado\n  · Datos: quimioterapia, antraciclinas o trastuzumab; metástasis óseas: sí (columna, fémur); corazón revisado: no; secuelas: linfedema (brazo izquierdo), fatiga\n  · Con tratamiento cardiotóxico sin revisión cardiaca, no propongas ejercicio de intensidad moderada sin valoración previa.\n  · Con metástasis óseas, nada de movimientos rápidos o cargados al final del recorrido en la zona de la lesión.`],
  sinDatos: [{ es: 'tratamiento', cn: [], tr: [], mo: null, mz: [], rc: null, sc: [], li: [] },
    `${CABECERA}\n  · Cáncer: cáncer sin precisar\n  · Estado: en tratamiento`],
  revisado: [{ es: 'terminado', cn: ['próstata'], tr: ['hormonal', 'rtCorazon'], mo: 'no', mz: [], rc: 'si_normal', sc: [], li: [] },
    `${CABECERA}\n  · Cáncer: próstata\n  · Estado: tratamiento terminado\n  · Datos: terapia hormonal, radioterapia (corazón en el campo); metástasis óseas: no; corazón revisado: sí, normal`],
  dudaMetastasis: [{ es: 'tratamiento', cn: ['no sabe cuál'], tr: ['ns'], mo: 'ns', mz: [], rc: 'ns', sc: ['neuropatia'], li: [] },
    `${CABECERA}\n  · Cáncer: no sabe cuál\n  · Estado: en tratamiento\n  · Datos: tratamientos: no lo sabe; metástasis óseas: no lo sabe; corazón revisado: no lo sabe; secuelas: neuropatía\n  · Con metástasis óseas, nada de movimientos rápidos o cargados al final del recorrido en la zona de la lesión.`],
};
test('bloqueONIA: el texto que physiq-report copiará, literal', () => {
  for (const [k, [d, esperado]] of Object.entries(ON_CASOS)) assert.equal(K.bloqueONIA(d), esperado, k);
});
