// Embarazo o posparto (Fase P, docs/embarazo-posparto.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, HYPOTHESES, buildPhysiQPayload, buildInformeFisioterapiaText,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML, sistemasActivos, withState, VALID_REGIONS,
  getSistemicoAffirmativeTexts } from './comun.mjs';
const E = await import('../../lib/embarazo.js');
const IN = await import('../../lib/informe-narrativo.js');
const P = await import('../../lib/plan-tratamiento.js');
const PD = await import('../../data/plan-tratamiento.js');
const { SIS_EMBARAZO, SIS_OSTEOPOROSIS } = await import('../../data/comun.js');

console.log('\nembarazo o posparto (Fase P)');

const em = (extra = {}) => ({ embarazo: { ...E.embarazoVacio(), ...extra } });
const ids = (extra, sv) => {
  let r;
  withState({ region: 'lumbar', ...em(extra), ...(sv ? { signosVitales: sv } : {}) }, () => {
    r = sistemasActivos().find(s => s.soloEmbarazo)?.preguntas.map(q => q.id) || [];
  });
  return r;
};
// Hace N semanas (para la fecha del parto)
const haceSemanas = n => { const d = new Date(Date.now() - n * 7 * 86400000); return d.toISOString().slice(0, 10); };

test('sistema común: la misma instancia en las 7 regiones, tras el de osteoporosis, oculto sin la tarjeta', () => {
  for (const r of VALID_REGIONS) {
    const sis = SYSTEMIC_SCREENING[r].sistemas;
    assert.ok(sis.includes(SIS_EMBARAZO), r);
    assert.equal(sis.indexOf(SIS_EMBARAZO), sis.indexOf(SIS_OSTEOPOROSIS) + 1, `${r}: justo después de osteoporosis`);
    withState({ region: r, ...em() }, () => assert.ok(!sistemasActivos().some(s => s.soloEmbarazo), `${r}: sin estado no se ve`));
    for (const estado of ['embarazada', 'posparto']) {
      withState({ region: r, ...em({ estado }) }, () => assert.ok(sistemasActivos().some(s => s.soloEmbarazo), `${r}: ${estado}`));
    }
  }
});

test('tarjeta de la fase 1: «Embarazada» y «Posparto», sus campos y el plegado con sexo «Hombre»', () => {
  const html = leer('index.html');
  const card = html.slice(html.indexOf('id="cardEmbarazo"'), html.indexOf('id="cardCronologia"'));
  assert.ok(html.indexOf('id="cardOsteoporosis"') < html.indexOf('id="cardEmbarazo"'), 'después de la osteoporosis');
  for (const v of ['embarazada', 'posparto']) assert.ok(card.includes(`selectEMEstado('${v}')`), v);
  for (const c of ["updateEM('semanas'", "updateEM('fecha'", "updateEM('semanasAprox'"]) assert.ok(card.includes(c), c);
  for (const v of Object.keys(E.EM.partos)) assert.ok(card.includes(`selectEMFila('parto','${v}')`), v);
  for (const v of Object.keys(E.EM.familiar)) assert.ok(card.includes(`selectEMFila('familiar','${v}')`), v);
  for (const v of Object.keys(E.EM.lactancia)) assert.ok(card.includes(`selectEMFila('lactancia','${v}')`), v);
  for (const k of E.CASILLAS_EM) assert.ok(card.includes(`toggleEMCasilla('${k}')`), k);
  assert.ok(card.includes('id="emHombre"') && card.includes('emVerTarjeta()'));
  assert.ok(leer('app.js').includes("const plegada = state.sexo === 'Hombre' && !emActivo(em) && !_emVerHombre;"));
});

test('fase 2: cada pregunta por estado y semanas; sin las semanas, salen todas las del estado', () => {
  assert.deepEqual(ids({ estado: 'embarazada', semanas: 10 }), ['em_u_parto', 'em_u_tev', 'em_u_corazon', 'em_u_autolesion', 'em_d_plo']);
  assert.deepEqual(ids({ estado: 'embarazada', semanas: 14 }), ['em_u_sangrado', 'em_u_parto', 'em_u_tev', 'em_u_corazon', 'em_u_autolesion', 'em_d_plo']);
  assert.deepEqual(ids({ estado: 'embarazada', semanas: 30 }),
    ['em_u_preeclampsia', 'em_u_sangrado', 'em_u_movimientos', 'em_u_parto', 'em_u_tev', 'em_u_corazon', 'em_u_autolesion', 'em_d_plo']);
  assert.deepEqual(ids({ estado: 'embarazada' }), ids({ estado: 'embarazada', semanas: 30 }), 'sin semanas, todas');
  assert.deepEqual(ids({ estado: 'posparto', fecha: haceSemanas(1) }),
    ['em_u_preeclampsia', 'em_u_sangrado_pp', 'em_u_infeccion', 'em_u_tev', 'em_u_corazon', 'em_u_perine', 'em_u_incontinencia', 'em_u_psicosis', 'em_u_autolesion', 'em_d_plo', 'em_d_fractura', 'em_d_mama']);
  assert.deepEqual(ids({ estado: 'posparto', semanasAprox: 10 }),
    ['em_u_preeclampsia', 'em_u_sangrado_pp', 'em_u_tev', 'em_u_corazon', 'em_u_perine', 'em_u_incontinencia', 'em_u_psicosis', 'em_u_autolesion', 'em_d_plo', 'em_d_mama']);
  // La PLO ya confirmada en la tarjeta de la osteoporosis: su sospecha no sale (H1)
  withState({ region: 'lumbar', ...em({ estado: 'posparto', semanasAprox: 10 }), osteoporosis: { estado: 'diagnosticada', causa: 'plo', vertebrales: '', reciente: false, otras: false, tratamiento: '', corticoides: '', factores: {}, caidas: { n: '', lesion: false, suelo: false, conciencia: false, fragilidad: false } } }, () => {
    assert.ok(!sistemasActivos().find(s => s.soloEmbarazo).preguntas.some(q => q.id === 'em_d_plo'));
  });
  // Cada bandera, enlazada a su pregunta y con la misma visibilidad
  for (const b of [...SIS_EMBARAZO.banderasRojas, ...SIS_EMBARAZO.banderasAmarillas]) {
    const q = SIS_EMBARAZO.preguntas.find(x => x.id === b.pregunta);
    assert.ok(q, b.texto);
    assert.deepEqual(b.em, q.em, b.pregunta);
  }
  // Urgencias y derivaciones
  for (const q of SIS_EMBARAZO.preguntas) assert.ok(q.id.startsWith('em_u_') ? q.urgencia && !q.derivacion : q.derivacion && !q.urgencia, q.id);
  withState({ region: 'lumbar', ...em({ estado: 'embarazada', semanas: 30 }) }, () => {
    const html = buildSistemaHTML(sistemasActivos().find(s => s.soloEmbarazo));
    assert.ok(!html.includes('data-embudo='), 'sin embudo');
    assert.ok(html.includes('data-em-bloque') && html.includes('sq2-urg'));
  });
  // Sin la tarjeta, una respuesta guardada no cuenta
  const u = SIS_EMBARAZO.preguntas.find(q => q.id === 'em_u_tev').urgencia;
  withState({ region: 'lumbar', ...em(), sistemicoAnswers: { em_u_tev: 'SI' } }, () => assert.ok(!(buildPhysiQPayload().ur || []).includes(u)));
  withState({ region: 'lumbar', ...em({ estado: 'embarazada' }), sistemicoAnswers: { em_u_tev: 'SI' } }, () => assert.ok(buildPhysiQPayload().ur.includes(u)));
});

test('U1: la trombosis y la embolia también en el embarazo, con los síntomas del RCOG y sin escalas para descartarla', () => {
  const q = SIS_EMBARAZO.preguntas.find(x => x.id === 'em_u_tev');
  assert.deepEqual(q.em, { embarazo: {}, posparto: {} });
  assert.ok(q.razonamiento.fuentes.includes('RCOG 2015'));
  assert.ok(q.razonamiento.peso.includes('el dímero D no sirve para descartarla'));
  assert.ok(q.razonamiento.detalle.includes('medias de compresión'));
});

test('privadas (decisión 11): el ánimo y la psicosis no van a `sq` (informe ni prompt); solo su urgencia', () => {
  const priv = SIS_EMBARAZO.preguntas.filter(q => q.privada).map(q => q.id);
  assert.deepEqual(priv, ['em_u_psicosis', 'em_u_autolesion']);
  withState({ region: 'lumbar', ...em({ estado: 'posparto', semanasAprox: 3, animo: { w1: 'SI', w2: 'SI' } }), sistemicoAnswers: { em_u_autolesion: 'SI', em_u_psicosis: 'SI' } }, () => {
    const p = buildPhysiQPayload();
    assert.ok(!getSistemicoAffirmativeTexts().some(t => /hacerse daño|cambios bruscos/.test(t)));
    assert.equal(p.ur.length, 2);
    const todo = JSON.stringify(p) + buildContextSummaryText() + buildInformeFisioterapiaText() + IN.contextoValoracion(p);
    for (const a of E.EM.animo) assert.ok(!todo.includes(a.texto), a.id);
    assert.ok(!('animo' in p.em));
  });
});

test('regla de la tensión (decisión 5, NICE NG201): ≥ 160/110 urgencia; primera ≥ 140/90 desde la semana 20, derivación', () => {
  const r = (extra, sv) => E.reglaTA({ ...E.embarazoVacio(), ...extra }, sv);
  assert.equal(r({ estado: 'embarazada', semanas: 12 }, { tas: 165, tad: 80 }), 'grave', 'la grave, en cualquier semana');
  assert.equal(r({ estado: 'embarazada', semanas: 25 }, { tas: 120, tad: 112 }), 'grave');
  assert.equal(r({ estado: 'embarazada', semanas: 25 }, { tas: 142, tad: 80 }), 'alta');
  assert.equal(r({ estado: 'embarazada', semanas: 25 }, { tas: 130, tad: 90 }), 'alta');
  assert.equal(r({ estado: 'embarazada', semanas: 18 }, { tas: 145, tad: 80 }), null, 'antes de la 20, no');
  assert.equal(r({ estado: 'embarazada' }, { tas: 145, tad: 80 }), 'sinSemanas');
  assert.equal(r({ estado: 'embarazada', semanas: 25 }, { tas: 139, tad: 89 }), null);
  assert.equal(r({ estado: 'embarazada', semanas: 25 }, { tas: null, tad: null }), null);
  assert.equal(r({ estado: 'posparto' }, { tas: 170, tad: 115 }), null, 'solo con «Embarazada»');
  withState({ region: 'lumbar', ...em({ estado: 'embarazada', semanas: 30 }), signosVitales: { fc: null, fr: null, spo2: null, tas: 165, tad: 100 } }, () => {
    assert.ok(buildPhysiQPayload().ur.includes(E.EM.textos.taGrave));
  });
  withState({ region: 'lumbar', ...em({ estado: 'embarazada', semanas: 30 }), signosVitales: { fc: null, fr: null, spo2: null, tas: 145, tad: 85 } }, () => {
    const p = buildPhysiQPayload();
    assert.ok(p.dv.includes(E.EM.textos.taAlta) && !p.ur.includes(E.EM.textos.taGrave));
  });
});

test('suelo pélvico (decisión 12) y riesgo de NICE NG210 1.3.12', () => {
  const v = E.embarazoVacio();
  assert.equal(E.riesgoSuelo({ ...v, estado: 'embarazada', semanas: 22, familiar: 'SI' }), true);
  assert.equal(E.riesgoSuelo({ ...v, estado: 'embarazada', semanas: 18, familiar: 'SI' }), false, 'desde la semana 20');
  for (const extra of [{ parto: 'instrumental' }, { esfinter: true }, { occipitoposterior: true }]) {
    assert.equal(E.riesgoSuelo({ ...v, estado: 'posparto', ...extra }), true, JSON.stringify(extra));
  }
  assert.equal(E.riesgoSuelo({ ...v, estado: 'posparto', parto: 'cesarea' }), false);
  const d = E.emPayload({ ...v, estado: 'posparto', semanasAprox: 6, parto: 'cesarea', suelo: { sp1: 'SI', sp2: 'SI', sp3: 'NO' } });
  const l = E.lineasRecomendacionEM(d);
  assert.ok(l.includes(E.EM.textos.sueloCon) && l.includes(E.EM.textos.sueloHeces));
});

test('payload `em`: solo con la tarjeta marcada; nunca el ánimo', () => {
  withState({ ...em() }, () => assert.ok(!('em' in buildPhysiQPayload()), 'sin estado, el payload no cambia'));
  withState({ ...em({ estado: 'embarazada', semanas: 24, familiar: 'SI', animo: { w1: 'SI' } }) }, () => {
    assert.deepEqual(buildPhysiQPayload().em, { es: 'embarazada', sg: 24, fp: 'SI', sp: null, rs: true });
  });
  withState({ ...em({ estado: 'posparto', semanasAprox: 8, parto: 'instrumental', esfinter: true, lactancia: 'SI', suelo: { sp1: 'SI' } }) }, () => {
    assert.deepEqual(buildPhysiQPayload().em, { es: 'posparto', ss: 8, tp: 'instrumental', oa: true, op: false, la: 'SI', sp: { o: true, h: false, b: false }, rs: true });
  });
});

test('📋 Notas, 📄 Informe e informe con IA (sin fuentes)', () => {
  withState({ ...em({ estado: 'posparto', semanasAprox: 6, parto: 'cesarea', lactancia: 'SI', suelo: { sp1: 'SI' } }) }, () => {
    assert.match(buildContextSummaryText(), /🤱 POSPARTO: 6 semanas desde el parto · cesárea · da el pecho · suelo pélvico: escapes de orina · fisioterapia de suelo pélvico/);
    assert.match(buildInformeFisioterapiaText(), /POSPARTO\n  · Posparto: 6 semanas desde el parto \(cesárea\)\.\n  · Se recomienda fisioterapia de suelo pélvico\./);
    const ctx = IN.contextoValoracion(buildPhysiQPayload());
    assert.ok(ctx.includes('Posparto (condición especial marcada por el fisioterapeuta):'));
    assert.ok(!/Mottola|ACOG|Davenport|Bull|NICE|Simonds|Vleeming|Hall|Clinton|Liddle|Christopher|Deering|Sperstad|Gluppe|Beamish|Burani|RCOG/.test(ctx), 'el prompt no lleva las fuentes');
  });
  withState({ ...em({ estado: 'embarazada', semanas: 30 }) }, () => {
    assert.ok(buildContextSummaryText().includes('🤰 EMBARAZO: 30 semanas de gestación'));
    assert.ok(buildInformeFisioterapiaText().includes('EMBARAZO\n  · Embarazo de 30 semanas.'));
  });
  withState({ ...em() }, () => {
    assert.ok(!buildContextSummaryText().includes('EMBARAZO') && !buildContextSummaryText().includes('POSPARTO'));
  });
});

test('fase 4b: la línea del supino desde la semana 20 (T1) y la del Gaenslen en el posparto (T10), sin tocar las LR', () => {
  const v = E.embarazoVacio();
  assert.equal(E.lineaSupino({ ...v, estado: 'embarazada', semanas: 19 }), '');
  assert.equal(E.lineaSupino({ ...v, estado: 'embarazada', semanas: 20 }), E.EM.textos.supino);
  assert.equal(E.lineaSupino({ ...v, estado: 'embarazada' }), E.EM.textos.supino, 'sin semanas, sale');
  assert.equal(E.lineaSupino({ ...v, estado: 'posparto' }), '');
  assert.equal(E.lineaGaenslen({ ...v, estado: 'posparto', semanasAprox: 2 }), E.EM.textos.gaensMenos4);
  assert.equal(E.lineaGaenslen({ ...v, estado: 'posparto', semanasAprox: 6 }), E.EM.textos.gaensMas4);
  assert.equal(E.lineaGaenslen({ ...v, estado: 'embarazada' }), '');
  const lista = Object.values(HYPOTHESES).flatMap(h => h.tests.map((t, i) => (t.gaenslen ? `${h.id}:${i}` : null))).filter(Boolean);
  assert.deepEqual(lista.sort(), ['ca10:3', 'lu8:5']);
  const f = leer('phase4b.js');
  assert.ok(f.includes('test.gaenslen && emPosparto(state.embarazo)') && f.includes('const supino = lineaSupino(state.embarazo);'));
});

test('fase 5: la línea de la sacroilíaca (T8) en lu8 y ca10, y el recuadro nunca plegado', () => {
  const a = leer('app.js');
  assert.ok(a.includes("const SACROILIACAS_EM = ['lu8', 'ca10'];"));
  assert.ok(a.includes('<div class="alert alert-info em-fase5"'));
  const emb = E.lineasRecomendacionEM({ es: 'embarazada', sg: 30, fp: null, sp: null, rs: false });
  for (const k of ['dosisEmb', 'supinoEmb', 'pararEmb', 'contraindicaciones', 'terapiaManual', 'diastasisEmb']) assert.ok(emb.includes(E.EM.textos[k]), k);
  const pp = E.lineasRecomendacionEM({ es: 'posparto', ss: 6, tp: 'cesarea', oa: false, op: false, la: 'NO', sp: null, rs: false });
  for (const k of ['vueltaPp', 'relativasPp', 'noContraPp', 'correrPp', 'diastasisPp', 'thrustPp']) assert.ok(pp.includes(E.EM.textos[k]), k);
  assert.ok(!pp.includes(E.EM.textos.lactanciaPp), 'la lactancia solo si da el pecho');
});

test('seguridad: marcar la tarjeta nunca quita ni rebaja una urgencia de otro sistema', () => {
  for (const r of VALID_REGIONS) {
    const urgentes = SYSTEMIC_SCREENING[r].sistemas.filter(s => !Object.keys(s).some(k => /^solo[A-Z]/.test(k) && s[k] === true))
      .flatMap(s => s.preguntas).filter(q => q.urgencia);
    const respuestas = Object.fromEntries(urgentes.map(q => [q.id, 'SI']));
    const pinta = () => ({ ur: buildPhysiQPayload().ur, html: sistemasActivos().filter(s => !s.soloEmbarazo).map(s => buildSistemaHTML(s)).join('') });
    let sin;
    withState({ region: r, ...em(), sistemicoAnswers: respuestas }, () => { sin = pinta(); });
    for (const extra of [{ estado: 'embarazada', semanas: 30, familiar: 'SI' }, { estado: 'posparto', semanasAprox: 1, parto: 'cesarea', esfinter: true }]) {
      withState({ region: r, ...em(extra), sistemicoAnswers: respuestas }, () => {
        const con = pinta();
        assert.deepEqual(con.ur, sin.ur, `${r}: mismas urgencias`);
        assert.equal(con.html, sin.html, `${r}: los demás sistemas se pintan igual`);
      });
    }
  }
});

test('fase 6: avisos de su estado, la sacroilíaca con lu8 o ca10 y la red; sin tope de thrust (decisión 8)', () => {
  const hs = [{ id: 'lu8', name: 'SI', pauta: 'P.', derivar: false, tratada: false }];
  const base = { region: 'lumbar', hipotesis: hs, elegidas: ['lu8'], severidad: 5, irritabilidadNivel: 'Moderada', irritabilidad: {} };
  const sin = P.construirPlan(base);
  for (const k of ['embarazo', 'posparto', 'terapiaManualEmbarazo', 'sacroiliacaEmbarazo']) assert.ok(!sin.avisosHip.includes(PD.AVISOS[k]), k);
  const emb = P.construirPlan({ ...base, embarazo: { estado: 'embarazada', lactancia: false } });
  for (const k of ['embarazo', 'terapiaManualEmbarazo', 'sacroiliacaEmbarazo']) assert.ok(emb.avisosHip.includes(PD.AVISOS[k]), k);
  assert.ok(!emb.avisosHip.includes(PD.AVISOS.sinThrustOsteoporosis) && !emb.avisosHip.includes(PD.AVISOS.sinThrustLupus));
  assert.ok(emb.sesion.cierre.includes(PD.TEXTOS_SESION.cierreEmbarazo));
  assert.ok(emb.alarmasCasa.includes(PD.TEXTOS_CASA.alarmaEmbarazo.texto));
  const pp = P.construirPlan({ ...base, region: 'codo', hipotesis: [{ ...hs[0], id: 'x' }], elegidas: ['x'], embarazo: { estado: 'posparto', lactancia: true } });
  for (const k of ['posparto', 'lactancia', 'terapiaManualEmbarazo']) assert.ok(pp.avisosHip.includes(PD.AVISOS[k]), k);
  assert.ok(!pp.avisosHip.includes(PD.AVISOS.sacroiliacaEmbarazo), 'sin sacroilíaca elegida');
  assert.ok(pp.sesion.cierre.includes(PD.TEXTOS_SESION.cierrePosparto) && !pp.sesion.cierre.includes(PD.TEXTOS_SESION.cierreEmbarazo));
  assert.ok(leer('plan.js').includes("embarazo: emActivo(state.embarazo) ? { estado: state.embarazo.estado, lactancia: state.embarazo.lactancia === 'SI' } : null"));
});

test('modo breve: semanas o fecha del parto sin registrar son pendientes; el sistema no tiene embudo', () => {
  withState({ ...em({ estado: 'embarazada' }), modo: 'breve', region: 'lumbar' }, () => {
    const t = getPendientesBreve().map(p => p.texto);
    assert.ok(t.includes('Semanas de gestación sin registrar (tarjeta «Embarazo o posparto»)'));
    assert.ok(!t.some(x => /Embarazo y posparto(,|$)/.test(x)), 'no sale como sistema sin cribar');
  });
  withState({ ...em({ estado: 'posparto' }), modo: 'breve', region: 'lumbar' }, () => {
    assert.ok(getPendientesBreve().some(p => p.texto === 'Fecha del parto sin registrar (tarjeta «Embarazo o posparto»)'));
  });
  withState({ ...em({ estado: 'embarazada', semanas: 20 }), modo: 'breve', region: 'lumbar' }, () => {
    assert.ok(!getPendientesBreve().some(p => p.texto.startsWith('Semanas de gestación')));
  });
});

test('normalizar: sesiones anteriores y valores raros', () => {
  assert.deepEqual(E.normalizarEmbarazo(undefined), E.embarazoVacio());
  assert.deepEqual(E.normalizarEmbarazo({ estado: 'x', semanas: -3, familiar: 'quizá', parto: 'z', esfinter: 'sí', lactancia: 1, animo: { w1: 'tal vez', zz: 'SI' }, suelo: { sp9: 'SI' } }), E.embarazoVacio());
  const v = E.normalizarEmbarazo({ estado: 'posparto', semanasAprox: '6', esfinter: true, animo: { w1: 'SI' }, suelo: { sp2: 'NO', x: 'SI' } });
  assert.equal(v.semanasAprox, 6);
  assert.deepEqual(v.animo, { w1: 'SI' });
  assert.deepEqual(v.suelo, { sp2: 'NO' });
});

test('se despliega y se expone: lib/embarazo.js en deploy-to-hub.yml; funciones de la tarjeta en window', () => {
  assert.ok(leer('.github', 'workflows', 'deploy-to-hub.yml').includes('lib/embarazo.js'));
  for (const f of ['selectEMEstado', 'updateEM', 'selectEMFila', 'toggleEMCasilla', 'selectEMBloque', 'emVerTarjeta', 'pintarTarjetaEmbarazo']) assert.equal(typeof globalThis[f], 'function', f);
});

// physiq-report (lib/payload.js, _bloqueEM) llevará una copia de bloqueEMIA()
// y su test fijará estos mismos textos: si cambian aquí, se copian allí.
export const EM_CASOS = {
  embarazada: [{"es":"embarazada","sg":30,"fp":"SI","sp":{"o":true,"h":false,"b":false},"rs":true},
    "Embarazo (condición especial marcada por el fisioterapeuta):\n  · Datos: 30 semanas de gestación; familiar de primer grado con disfunción del suelo pélvico; suelo pélvico: escapes de orina\n  · Consideraciones para el plan: Activa durante todo el embarazo si no hay contraindicación: al menos 150 min por semana de intensidad moderada (puede hablar, no cantar), repartidos en 3 días o más, con aeróbico y fuerza; si no llega, empezar poco a poco. Sin buceo, deportes de contacto, riesgo de caída ni bicicleta en movimiento; sin calor excesivo y bien hidratada; la intensidad alta, solo supervisada; si la maniobra de Valsalva le marea, sin aguantar la respiración. Boca arriba: si se marea, tiene náuseas o se encuentra mal, cambiar de posición; desde la semana 20 puede bajar el retorno venoso. Parar el ejercicio y consultar si aparece: sangrado vaginal, pérdida de líquido, contracciones regulares y dolorosas, dolor de vientre, dolor en el pecho, falta de aire que no cede en reposo, mareo que no cede, dolor de cabeza, debilidad que afecta al equilibrio, o dolor o hinchazón de pantorrilla. Con una contraindicación absoluta (rotura de la bolsa, parto prematuro, sangrado persistente sin explicar, placenta previa después de la semana 28, preeclampsia, cuello del útero incompetente, crecimiento fetal restringido, embarazo de trillizos o más, diabetes tipo 1, hipertensión o tiroides sin controlar, u otra enfermedad cardiovascular, respiratoria o sistémica grave), solo las actividades de la vida diaria; con una relativa, que hable con su obstetra o matrona antes de un ejercicio moderado o intenso. Dolor lumbar o de cintura pélvica: ejercicio o cinturón lumbopélvico no rígido. En el embarazo, el ejercicio de 8–12 semanas reduce el dolor lumbar y pélvico, pero en el dolor solo pélvico no mejora más que la atención habitual. La terapia manual no tiene base para ser el tratamiento principal ni para usarse sola: como mucho, para probar el alivio en pocas sesiones. Del thrust en el embarazo hay un solo ensayo piloto, con 15 mujeres en decúbito lateral y sin efectos adversos, recogido en la revisión Cochrane, y la guía de fisioterapia lo deja a criterio del clínico: no basta para decir que sea seguro. Fisioterapia de suelo pélvico: programa supervisado de al menos 3 meses. Suelo pélvico a diario, con la técnica aprendida. Con diástasis en el embarazo, la guía canadiense aconseja consejo de fisioterapia y evitar los abdominales tipo curl."],
  posparto: [{"es":"posparto","ss":6,"tp":"cesarea","oa":false,"op":false,"la":"SI","sp":null,"rs":false},
    "Posparto (condición especial marcada por el fisioterapeuta):\n  · Datos: 6 semanas desde el parto; cesárea; da el pecho\n  · Consideraciones para el plan: Volver a la actividad de forma gradual, guiada por los síntomas; no hace falta una autorización médica de rutina y la vuelta puede empezar antes de las 6 semanas. Tras la cesárea, cuando se sienta recuperada. La misma dosis que en el embarazo: 150 min por semana, con fuerza. Durante el primer año, que consulte con su médico antes del ejercicio moderado o intenso si tiene: tensión de más de 140/90, dolor en el pecho, falta de aire en reposo, mareo o pérdida de conocimiento, síntomas neurológicos, dolor o hinchazón de pantorrilla, sangrado vaginal sin regla, dolor abdominal intenso, anemia o cansancio excesivo, fiebre, o síntomas de la cesárea que empeoran con el ejercicio; casi siempre podrá seguir activa, adaptando. No son contraindicaciones: el dolor lumbar, el de cintura pélvica (sin consenso entre los encuestados; lo decidieron los autores), la incontinencia, el prolapso leve o moderado y la diástasis. Si da el pecho, mejor dar el pecho o sacarse leche antes del ejercicio, por comodidad. Volver a correr: no antes de 3 semanas y con las heridas del parto, también la cesárea, completamente curadas; el momento es individual, sin plazo fijo de 6 o 12 semanas. Antes, caminar 30 min y tareas de impacto sin síntomas. Con síntomas leves de suelo pélvico puede correr adaptando; con síntomas graves, valoración especializada primero. Si aparecen escapes, peso o presión vaginal al correr, parar y caminar. En el posparto, ejercicio individualizado con enfoque biopsicosocial y cribado del miedo-evitación; el tratamiento, antes de los 3 meses. Predicen que persista: dolor intenso, muchas pruebas de provocación positivas, dolor lumbopélvico previo, discapacidad alta, neuroticismo y miedo-evitación. La terapia manual no tiene base para ser el tratamiento principal ni para usarse sola: como mucho, para probar el alivio en pocas sesiones. Del thrust en el embarazo hay un solo ensayo piloto, con 15 mujeres en decúbito lateral y sin efectos adversos, recogido en la revisión Cochrane, y la guía de fisioterapia lo deja a criterio del clínico: no basta para decir que sea seguro. En el posparto, el thrust no está indicado con articulaciones simétricas. Suelo pélvico a diario, con la técnica aprendida. Diástasis: no hay un corte de consenso; la leve no se asocia a dolor lumbopélvico; se resuelve sola en buena parte durante el primer año; el ejercicio abdominal la reduce poco, y no hay que prohibir el curl ni el suelo pélvico."],
  riesgo: [{"es":"posparto","ss":2,"tp":"instrumental","oa":true,"op":false,"la":"NO","sp":{"o":false,"h":false,"b":false},"rs":true},
    "Posparto (condición especial marcada por el fisioterapeuta):\n  · Datos: 2 semanas desde el parto; parto vaginal instrumental; lesión del esfínter anal; no da el pecho\n  · Consideraciones para el plan: Volver a la actividad de forma gradual, guiada por los síntomas; no hace falta una autorización médica de rutina y la vuelta puede empezar antes de las 6 semanas. Tras la cesárea, cuando se sienta recuperada. La misma dosis que en el embarazo: 150 min por semana, con fuerza. Durante el primer año, que consulte con su médico antes del ejercicio moderado o intenso si tiene: tensión de más de 140/90, dolor en el pecho, falta de aire en reposo, mareo o pérdida de conocimiento, síntomas neurológicos, dolor o hinchazón de pantorrilla, sangrado vaginal sin regla, dolor abdominal intenso, anemia o cansancio excesivo, fiebre, o síntomas de la cesárea que empeoran con el ejercicio; casi siempre podrá seguir activa, adaptando. No son contraindicaciones: el dolor lumbar, el de cintura pélvica (sin consenso entre los encuestados; lo decidieron los autores), la incontinencia, el prolapso leve o moderado y la diástasis. Volver a correr: no antes de 3 semanas y con las heridas del parto, también la cesárea, completamente curadas; el momento es individual, sin plazo fijo de 6 o 12 semanas. Antes, caminar 30 min y tareas de impacto sin síntomas. Con síntomas leves de suelo pélvico puede correr adaptando; con síntomas graves, valoración especializada primero. Si aparecen escapes, peso o presión vaginal al correr, parar y caminar. En el posparto, ejercicio individualizado con enfoque biopsicosocial y cribado del miedo-evitación; el tratamiento, antes de los 3 meses. Predicen que persista: dolor intenso, muchas pruebas de provocación positivas, dolor lumbopélvico previo, discapacidad alta, neuroticismo y miedo-evitación. La terapia manual no tiene base para ser el tratamiento principal ni para usarse sola: como mucho, para probar el alivio en pocas sesiones. Del thrust en el embarazo hay un solo ensayo piloto, con 15 mujeres en decúbito lateral y sin efectos adversos, recogido en la revisión Cochrane, y la guía de fisioterapia lo deja a criterio del clínico: no basta para decir que sea seguro. En el posparto, el thrust no está indicado con articulaciones simétricas. Sin síntomas, pero con riesgo (familiar de primer grado con disfunción desde la semana 20, parto instrumental, occipitoposterior o lesión del esfínter anal): puede beneficiarse de un programa supervisado de 3 meses. Suelo pélvico a diario, con la técnica aprendida. Diástasis: no hay un corte de consenso; la leve no se asocia a dolor lumbopélvico; se resuelve sola en buena parte durante el primer año; el ejercicio abdominal la reduce poco, y no hay que prohibir el curl ni el suelo pélvico."],
};

test('bloqueEMIA: el texto que physiq-report copiará, literal', () => {
  for (const [k, [d, esperado]] of Object.entries(EM_CASOS)) assert.equal(E.bloqueEMIA(d), esperado, k);
});
