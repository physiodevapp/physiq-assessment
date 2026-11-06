// Parkinson (Fase P, docs/parkinson.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, buildPhysiQPayload, buildInformeFisioterapiaText,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML, sistemasActivos, withState, VALID_REGIONS } from './comun.mjs';
const K = await import('../../lib/parkinson.js');
const O = await import('../../lib/osteoporosis.js');
const D = await import('../../lib/disautonomia.js');
const IN = await import('../../lib/informe-narrativo.js');
const P = await import('../../lib/plan-tratamiento.js');
const PD = await import('../../data/plan-tratamiento.js');
const { REFERENCIAS } = await import('../../data/referencias.js');
const { SIS_PARKINSON, SIS_ANTICOAGULADO } = await import('../../data/comun.js');

console.log('\nParkinson (Fase P)');

const pk = (estado = '', extra = {}) => ({ parkinson: { ...K.parkinsonVacio(), estado, ...extra } });
const visibles = (estado, extra) => {
  let ids = [];
  withState({ region: 'lumbar', ...pk(estado, extra) }, () => { ids = sistemasActivos().find(s => s.soloParkinson)?.preguntas.map(q => q.id) || []; });
  return ids;
};
const DIAG = ['pk_u_crisis', 'pk_d_medicacion', 'pk_d_complicaciones', 'pk_d_mental', 'pk_d_ortostatica', 'pk_d_tragar', 'pk_d_sueno'];

test('sistema común: la misma instancia en las 7 regiones, tras el del anticoagulado, oculto sin la tarjeta', () => {
  for (const r of VALID_REGIONS) {
    const sis = SYSTEMIC_SCREENING[r].sistemas;
    assert.ok(sis.includes(SIS_PARKINSON), r);
    assert.equal(sis.indexOf(SIS_PARKINSON), sis.indexOf(SIS_ANTICOAGULADO) + 1, `${r}: justo después del anticoagulado`);
    withState({ region: r, ...pk() }, () => assert.ok(!sistemasActivos().some(s => s.soloParkinson), `${r}: sin la tarjeta no se ve`));
    withState({ region: r, ...pk('sospecha') }, () => assert.ok(sistemasActivos().some(s => s.soloParkinson), `${r}: con la tarjeta se ve`));
  }
});

test('tarjeta: «Diagnosticado» y «Sospecha», después de la del anticoagulado; filas y fase solo con fluctuaciones', () => {
  assert.deepEqual(Object.keys(K.ESTADOS_PK), ['diagnosticado', 'sospecha']);
  const html = leer('index.html');
  assert.ok(html.indexOf('id="cardAnticoagulado"') < html.indexOf('id="cardParkinson"'), 'después del anticoagulado');
  assert.ok(html.indexOf('id="cardParkinson"') < html.indexOf('id="cardFarmacos"'), 'antes de los fármacos');
  for (const [fila, ops] of Object.entries(K.FILAS_PK)) for (const v of Object.keys(ops)) assert.ok(html.includes(`selectPKFila('${fila}','${v}')`), `${fila}: ${v}`);
  assert.ok(!K.faseVisible({ estado: 'diagnosticado', fluctuaciones: 'NO' }) && K.faseVisible({ estado: 'diagnosticado', fluctuaciones: 'SI' }));
  assert.equal(K.normalizarParkinson({ estado: 'x', estadio: '9' }).estado, '');
  assert.equal(K.normalizarParkinson({ estado: 'diagnosticado', estadio: '9' }).estadio, '');
  assert.deepEqual(K.normalizarParkinson(undefined), K.parkinsonVacio());
});

test('fase 2: una urgencia y ocho derivaciones; quién ve cada una; sin embudo; banderas enlazadas', () => {
  assert.deepEqual(SIS_PARKINSON.preguntas.filter(q => q.urgencia).map(q => q.id), ['pk_u_crisis']);
  assert.equal(SIS_PARKINSON.preguntas.filter(q => q.derivacion).length, 8);
  assert.deepEqual(visibles('diagnosticado').sort(), [...DIAG].sort(), 'sin estimulador');
  assert.ok(visibles('diagnosticado', { estimulador: 'SI' }).includes('pk_d_estimulador'));
  assert.ok(!visibles('diagnosticado', { estimulador: 'NS' }).includes('pk_d_estimulador'), 'la pregunta del estimulador, solo con «Sí»');
  assert.deepEqual(visibles('sospecha').sort(), ['pk_d_ortostatica', 'pk_d_sospecha']);
  const ids = new Set(SIS_PARKINSON.preguntas.map(q => q.id));
  for (const b of [...SIS_PARKINSON.banderasRojas, ...SIS_PARKINSON.banderasAmarillas]) assert.ok(ids.has(b.pregunta), b.texto);
  withState({ region: 'lumbar', ...pk('diagnosticado') }, () => {
    const html = buildSistemaHTML(sistemasActivos().find(s => s.soloParkinson));
    assert.ok(!html.includes('data-embudo='), 'sin embudo');
    assert.ok(html.includes('data-pk-bloque'), 'bloque de la tensión y las caídas');
  });
  withState({ region: 'lumbar', ...pk('diagnosticado'), sistemicoAnswers: { pk_u_crisis: 'SI', pk_d_medicacion: 'SI' }, sistemicoAlerta: true }, () => {
    const d = buildPhysiQPayload();
    assert.ok(d.ur.includes(SIS_PARKINSON.preguntas[0].urgencia));
    assert.ok(d.dv.includes(SIS_PARKINSON.preguntas.find(q => q.id === 'pk_d_medicacion').derivacion));
  });
  withState({ region: 'lumbar', ...pk(), sistemicoAnswers: { pk_u_crisis: 'SI' } }, () => assert.deepEqual(buildPhysiQPayload().ur, []), 'sin la tarjeta no cuenta');
});

test('pk_d_mental es `privada`: su texto nunca llega a `sq`, al 📄 Informe ni al prompt; su derivación sí', () => {
  const q = SIS_PARKINSON.preguntas.find(x => x.id === 'pk_d_mental');
  assert.equal(q.privada, true);
  withState({ region: 'lumbar', ...pk('diagnosticado'), sistemicoAnswers: { pk_d_mental: 'SI' }, sistemicoAlerta: true }, () => {
    const d = buildPhysiQPayload();
    assert.ok(!JSON.stringify(d.sq).includes('Ve cosas'));
    assert.ok(d.dv.includes(q.derivacion));
    assert.ok(!buildInformeFisioterapiaText().includes('Ve cosas') && !IN.contextoValoracion(d).includes('Ve cosas'));
  });
});

test('seguridad: marcar la tarjeta (con todo marcado) nunca quita ni rebaja una urgencia de otro sistema', () => {
  for (const r of VALID_REGIONS) {
    const urgentes = SYSTEMIC_SCREENING[r].sistemas.filter(s => !Object.keys(s).some(k => /^solo[A-Z]/.test(k) && s[k] === true))
      .flatMap(s => s.preguntas).filter(q => q.urgencia);
    const respuestas = Object.fromEntries(urgentes.map(q => [q.id, 'SI']));
    const pinta = () => ({ ur: buildPhysiQPayload().ur, html: sistemasActivos().filter(s => !s.soloParkinson).map(s => buildSistemaHTML(s)).join('') });
    let sin;
    withState({ region: r, ...pk(), sistemicoAnswers: respuestas }, () => { sin = pinta(); });
    for (const extra of [{}, { estadio: '45', fluctuaciones: 'SI', fase: 'off', congelacion: 'SI', estimulador: 'SI' }]) {
      for (const estado of ['diagnosticado', 'sospecha']) {
        withState({ region: r, ...pk(estado, extra), sistemicoAnswers: respuestas }, () => {
          const con = pinta();
          assert.deepEqual(con.ur, sin.ur, `${r} · ${estado}: mismas urgencias`);
          assert.equal(con.html, sin.html, `${r} · ${estado}: los demás sistemas se pintan igual`);
        });
      }
    }
  }
});

test('tensión tumbado y de pie (decisión 10): minutos 1 y 3, ≥ 20 de TAS o ≥ 10 de TAD, sin la regla del POTS', () => {
  assert.deepEqual(K.FILAS_TENSION, ['tumbado', 'm1', 'm3']);
  assert.equal(K.resultadoTension(null).estado, 'sin-hacer');
  assert.equal(K.resultadoTension({ tumbado: { tas: 130 } }).estado, 'incompleta');
  assert.equal(K.resultadoTension({ tumbado: { tas: 130, tad: 80 }, m1: { tas: 112, tad: 74 }, m3: { tas: 115, tad: 75 } }).estado, 'no-ho');
  assert.equal(K.resultadoTension({ tumbado: { tas: 130, tad: 80 }, m1: { tas: 110 } }).estado, 'ho', 'TAS −20 al minuto 1');
  assert.equal(K.resultadoTension({ tumbado: { tas: 130, tad: 80 }, m3: { tad: 70 } }).estado, 'ho', 'TAD −10 al minuto 3');
  // Una FC que sube mucho no es hipotensión (la regla del POTS no está)
  assert.equal(K.resultadoTension({ tumbado: { tas: 130, tad: 80, fc: 60 }, m1: { tas: 128, tad: 80, fc: 110 }, m3: { tas: 128, tad: 80, fc: 115 } }).estado, 'no-ho');
  // El reloj de la disautonomía con los minutos 1 y 3: termina un minuto después del 3
  const reloj = { fase: 'pie', inicio: 0, tomas: {} };
  assert.equal(D.estadoReloj(reloj, 200 * 1000, SIS_PARKINSON.parkinson.tension.minutos).fila, 'm3');
  assert.equal(D.estadoReloj(reloj, 241 * 1000, SIS_PARKINSON.parkinson.tension.minutos).terminado, true);
  assert.equal(D.estadoReloj(reloj, 241 * 1000).terminado, false, 'el de la disautonomía sigue hasta el minuto 10');
  // No marca la tarjeta de disautonomía ni va al payload
  withState({ ...pk('diagnosticado', { tension: { tumbado: { tas: 130 }, m1: { tas: 100 } } }) }, () => {
    const d = buildPhysiQPayload();
    assert.ok(!('ds' in d) && !JSON.stringify(d.pk).includes('130'));
  });
});

test('caídas (decisión 8): el bloque de la osteoporosis, con las mismas respuestas si las dos tarjetas están marcadas', () => {
  assert.equal(K.resultadoCaidasPK({ estado: 'sospecha', caidas: { n: '2' } }), 'alto');
  assert.equal(K.resultadoCaidasPK({ estado: '', caidas: { n: '2' } }), null);
  withState({ region: 'lumbar', ...pk('diagnosticado'), osteoporosis: { ...O.osteoporosisVacio(), estado: 'diagnosticada' } }, () => {
    globalThis.selectOPCaidas('1');
    assert.equal(globalThis.state.parkinson.caidas.n, '1');
    assert.equal(globalThis.state.osteoporosis.caidas.n, '1');
    globalThis.toggleOPCaidaCasilla('suelo');
    assert.ok(globalThis.state.parkinson.caidas.suelo && globalThis.state.osteoporosis.caidas.suelo);
  });
  withState({ region: 'lumbar', ...pk('diagnosticado') }, () => {
    globalThis.selectOPCaidas('0');
    assert.equal(globalThis.state.parkinson.caidas.n, '0');
    assert.equal(globalThis.state.osteoporosis.caidas.n, '', 'sin la tarjeta de osteoporosis, no se toca');
  });
});

test('payload `pk`: solo con la tarjeta; { es, hy, fl, fa, cg, ec } o { es }; la fase solo con fluctuaciones', () => {
  withState({ ...pk() }, () => assert.ok(!('pk' in buildPhysiQPayload()), 'sin la tarjeta, el payload no cambia'));
  withState({ ...pk('sospecha', { estadio: '3' }) }, () => assert.deepEqual(buildPhysiQPayload().pk, { es: 'sospecha' }));
  withState({ ...pk('diagnosticado', { estadio: '3', fluctuaciones: 'SI', fase: 'on', congelacion: 'SI', estimulador: 'SI' }) },
    () => assert.deepEqual(buildPhysiQPayload().pk, { es: 'diagnosticado', hy: '3', fl: 'SI', fa: 'on', cg: 'SI', ec: 'SI' }));
  withState({ ...pk('diagnosticado', { fluctuaciones: 'NO', fase: 'on' }) },
    () => assert.deepEqual(buildPhysiQPayload().pk, { es: 'diagnosticado', hy: null, fl: 'NO', fa: null, cg: null, ec: null }));
});

test('📋 Notas, 📄 Informe (con «Sospecha», sin la palabra Parkinson) e informe con IA (sin fuentes)', () => {
  withState({ ...pk('diagnosticado', { estadio: '3', fluctuaciones: 'SI', fase: 'on', congelacion: 'SI', estimulador: 'SI' }) }, () => {
    assert.match(buildContextSummaryText(), /🧠 PARKINSON: diagnosticado · H&Y 3 · fluctuaciones \(valorado en on\) · congelación · estimulador cerebral profundo/);
    const i = buildInformeFisioterapiaText();
    assert.match(i, /ENFERMEDAD DE PARKINSON\n  · Enfermedad de Parkinson \(diagnosticada\)\.\n  · Estadio de Hoehn y Yahr: 3\.\n  · Fluctuaciones on\/off; valorado en fase on\.\n  · Lleva un estimulador cerebral profundo\./);
    const bloque = i.slice(i.indexOf('ENFERMEDAD DE PARKINSON')).split('\n\n')[0];
    assert.ok(!/onda corta|TENS|ultrasonido|Keus|FDA/i.test(bloque), 'sin técnicas');
    const ctx = IN.contextoValoracion(buildPhysiQPayload());
    assert.ok(ctx.includes('Parkinson (condición especial marcada por el fisioterapeuta):'));
    assert.ok(ctx.includes(SIS_PARKINSON.parkinson.textos.reglaIA));
    assert.ok(!/Osborne|Keus|NICE NG71|FDA|Health Canada|LeWitt/.test(ctx.slice(ctx.indexOf('Parkinson (condición'))), 'el bloque no lleva las fuentes');
  });
  withState({ ...pk('sospecha') }, () => {
    const i = buildInformeFisioterapiaText();
    assert.match(i, /RECOMENDACIÓN DE VALORACIÓN MÉDICA\n  · Se recomienda valoración por un especialista en trastornos del movimiento\./);
    assert.ok(!/parkinson/i.test(i), 'con la sospecha, sin la palabra Parkinson');
  });
  withState({ ...pk() }, () => assert.ok(!buildContextSummaryText().includes('PARKINSON') && !buildInformeFisioterapiaText().includes('PARKINSON')));
});

test('fase 5: el estimulador primero (también «No lo sabe», con «Hasta confirmarlo:»); líneas condicionales', () => {
  const t = K.PK.textos;
  const lin = (d = {}) => K.lineasRecomendacionPK({ es: 'diagnosticado', ...d });
  assert.equal(lin({ ec: 'SI' })[0], t.estimulador);
  assert.ok(lin({ ec: 'NS' })[0].startsWith('Hasta confirmarlo: nada de onda corta'));
  assert.ok(!lin({ ec: 'NO' }).some(l => l.includes('onda corta')));
  for (const k of ['ejercicio', 'intensidad', 'onOff', 'ortostatica', 'hueso', 'dolor5', 'vibracion', 'parar', 'experiencia']) assert.ok(lin().includes(t[k]), k);
  assert.ok(!lin().includes(t.congelacion) && lin({ cg: 'SI' }).includes(t.congelacion) && lin({ cd: 'alto' }).includes(t.congelacion));
  assert.ok(!lin().some(l => l.includes(t.cama)) && lin({ hy: '45' }).some(l => l.includes(t.estadios) && l.includes(t.cama)));
  assert.ok(!lin().includes(t.sueno) && lin({ sn: true }).includes(t.sueno));
  const sosp = K.lineasRecomendacionPK({ es: 'sospecha' });
  assert.equal(sosp.length, 1);
  assert.ok(sosp[0].startsWith('Derivar pronto y sin tratar a un especialista en trastornos del movimiento'));
  assert.ok(leer('app.js').includes('_parkinsonResultadosHTML(pk)') && leer('app.js').includes('pk-fase5'));
  assert.ok(leer('phase4b.js').includes('pk-nota-4b') && leer('index.html').includes('id="pkNotaDolor"'));
});

test('fase 6: avisos y red con «Diagnosticado»; el del estimulador en cualquier plan con él (decisión 20)', () => {
  const hs = ids => ids.map(id => ({ id, name: id, pauta: 'P.', derivar: false, tratada: false }));
  const base = { region: 'codo', hipotesis: hs(['x']), elegidas: ['x'], severidad: 5, irritabilidadNivel: 'Moderada', irritabilidad: {} };
  const sin = P.construirPlan(base);
  assert.ok(!sin.avisosHip.includes(PD.AVISOS.parkinson));
  for (const region of ['codo', 'lumbar', 'rodilla']) {
    const con = P.construirPlan({ ...base, region, parkinson: { estimulador: false } });
    assert.ok(con.avisosHip.includes(PD.AVISOS.parkinson) && con.avisosHip.includes(PD.AVISOS.parkinsonVibracion), region);
    assert.ok(!con.avisosHip.includes(PD.AVISOS.parkinsonEstimulador), region);
    assert.ok(con.sesion.cierre.includes(PD.TEXTOS_SESION.cierreCrisisParkinson) && con.sesion.cierre.includes(PD.TEXTOS_SESION.cierreEjercicioParkinson), region);
    assert.ok(con.alarmasCasa.includes(PD.TEXTOS_CASA.alarmaCrisisParkinson.texto) && con.alarmasCasa.includes(PD.TEXTOS_CASA.alarmaEjercicioParkinson.texto), region);
    assert.ok(P.construirPlan({ ...base, region, parkinson: { estimulador: true } }).avisosHip.includes(PD.AVISOS.parkinsonEstimulador), region);
  }
  // Sin tope de thrust propio (decisión 9)
  assert.ok(!P.construirPlan({ ...base, parkinson: { estimulador: true } }).avisosHip.some(a => /thrust/i.test(a)));
  // Los avisos son las frases de la tarjeta, tal cual
  const t = K.PK.textos;
  assert.ok(PD.AVISOS.parkinson.includes(t.ejercicio) && PD.AVISOS.parkinson.includes(t.intensidad) && PD.AVISOS.parkinson.includes(t.onOff));
  assert.ok(PD.AVISOS.parkinsonEstimulador.endsWith(t.estimulador.slice(1)));
  assert.ok(leer('plan.js').includes('pkDiagnosticado(state.parkinson)'));
});

test('modo breve: estimulador y fase on/off sin registrar son pendientes; el sistema no tiene embudo', () => {
  withState({ ...pk('diagnosticado'), modo: 'breve', region: 'lumbar' }, () => {
    const p = getPendientesBreve();
    assert.ok(p.some(x => x.texto.startsWith('Estimulador cerebral profundo sin registrar') && x.ancla === 'cardParkinson'));
    assert.ok(!p.some(x => x.texto.startsWith('Fase on/off')), 'sin fluctuaciones, la fase no se pide');
    assert.ok(!p.some(x => x.texto.includes('Parkinson') && x.texto.startsWith('Sistemas sin cribar')));
  });
  withState({ ...pk('diagnosticado', { estimulador: 'NO', fluctuaciones: 'SI' }), modo: 'breve', region: 'lumbar' }, () => {
    const p = getPendientesBreve();
    assert.ok(p.some(x => x.texto.startsWith('Fase on/off sin registrar')) && !p.some(x => x.texto.startsWith('Estimulador')));
  });
  withState({ ...pk('sospecha'), modo: 'breve', region: 'lumbar' }, () => assert.ok(!getPendientesBreve().some(x => x.ancla === 'cardParkinson')));
  withState({ ...pk('diagnosticado'), modo: 'completo', region: 'lumbar' }, () => assert.deepEqual(getPendientesBreve(), []));
});

test('registro (decisión 23): las fuentes del texto final están en data/referencias.js', () => {
  for (const k of ['Osborne 2022', 'NICE NG71', 'Simonet 2019', 'Pötter-Nerger 2024', 'LeWitt 2020', 'Keus 2014', 'Buhmann 2020',
    'FDA 2002 (diatermia)', 'Health Canada 2003 (diatermia)', 'Torsney 2014', 'Tan 2014', 'Ernst 2024', 'Paggou 2023']) assert.ok(REFERENCIAS[k], k);
  assert.ok(!REFERENCIAS['Wang 2022'] && !REFERENCIAS['Gadgaard 2024'], 'las que el texto no usa, fuera');
});

test('se despliega y se expone: lib/parkinson.js en deploy-to-hub.yml; funciones de la tarjeta en window', () => {
  assert.ok(leer('.github', 'workflows', 'deploy-to-hub.yml').includes('lib/parkinson.js'));
  for (const f of ['selectPKEstado', 'selectPKFila', 'pkTensionHacer', 'pkTensionQuitar', 'updatePKTension', 'pkRelojEmpezar', 'pkRelojParar']) assert.equal(typeof globalThis[f], 'function', f);
});

// physiq-report (lib/payload.js, _bloquePK) llevará una copia de bloquePKIA()
// y su test fijará estos mismos textos: si cambian aquí, se copian allí.
const CABECERA = 'Parkinson (condición especial marcada por el fisioterapeuta):';
export const PK_CASOS = {
  completo: [{ es: 'diagnosticado', hy: '3', fl: 'SI', fa: 'on', cg: 'SI', ec: 'SI' },
    `${CABECERA}\n  · Estado: diagnosticado\n  · Datos: H&Y 3; fluctuaciones (valorado en on); congelación; estimulador cerebral profundo\n  · Con estimulador cerebral profundo, no propongas diatermia, ultrasonido ni electroestimulación.`],
  sinDatos: [{ es: 'diagnosticado', hy: null, fl: null, fa: null, cg: null, ec: 'NO' },
    `${CABECERA}\n  · Estado: diagnosticado`],
  estimuladorDuda: [{ es: 'diagnosticado', hy: '45', fl: 'NO', fa: null, cg: 'NO', ec: 'NS' },
    `${CABECERA}\n  · Estado: diagnosticado\n  · Datos: H&Y 4–5; sin fluctuaciones; estimulador cerebral profundo: no lo sabe\n  · Con estimulador cerebral profundo, no propongas diatermia, ultrasonido ni electroestimulación.`],
  sospecha: [{ es: 'sospecha' },
    `${CABECERA}\n  · Estado: sospecha\n  · Es una sospecha: no escribas que el paciente tiene Parkinson; el diagnóstico es médico. Recomienda la valoración por un especialista en trastornos del movimiento.`],
};
test('bloquePKIA: el texto que physiq-report copiará, literal', () => {
  for (const [k, [d, esperado]] of Object.entries(PK_CASOS)) assert.equal(K.bloquePKIA(d), esperado, k);
});
