// Paciente posquirúrgico. Se ejecuta desde tests/unit.js.
import { assert, leer, test, HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, state, buildPhysiQPayload,
   buildInformeFisioterapiaText, buildContextSummaryText, getPendientesBreve, buildSistemaHTML,
   withState } from './comun.mjs';
const IN = await import('../../lib/informe-narrativo.js');
const IA = await import('../../informe-ia.js');

// ── Paciente posquirúrgico (docs/posquirurgico.md) ───────────────────────────
console.log('\npaciente posquirúrgico');
{
  const PQ = await import('../../lib/posquirurgico.js');
  const { esTratada, marcarTratada } = await import('../../phase4b.js');
  const { getDerivacionesArbol } = await import('../../phase4.js');
  const HOY = new Date(2026, 9, 6);   // 6 oct 2026
  const cir = (extra = {}) => ({ ...PQ.cirugiaVacia(), ...extra });
  const POSQ = (extra = {}) => ({ mecanismo: 'Post-quirúrgico', cirugia: cir(extra), derivacionResuelta: {} });
  const await_comun = await import('../../data/comun.js');

  test('semanas: desde la fecha (al vuelo), o las aproximadas sin fecha; nunca negativas', () => {
    assert.equal(PQ.semanasCirugia(cir({ fecha: '2026-08-25' }), HOY), 6);
    assert.equal(PQ.semanasCirugia(cir({ fecha: '2026-10-06' }), HOY), 0);
    assert.equal(PQ.semanasCirugia(cir({ fecha: '2026-12-01' }), HOY), 0);
    assert.equal(PQ.semanasCirugia(cir({ semanasAprox: 4 }), HOY), 4);
    assert.equal(PQ.semanasCirugia(cir({ fecha: '2026-09-29', semanasAprox: 20 }), HOY), 1, 'la fecha manda');
    assert.equal(PQ.semanasCirugia(cir(), HOY), null);
    assert.ok(!('semanas' in state.cirugia), 'las semanas calculadas no se guardan');
  });

  test('cq: solo con mecanismo Post-quirúrgico, con complicaciones y protocolo legibles', () => {
    const c = cir({ intervencion: 'PTR derecha', fecha: '2026-08-25', protocolo: 'Escrito', restricciones: 'Carga parcial',
      complicaciones: ['tvp', 'nervio'], complicacionOtra: 'Dehiscencia leve' });
    assert.equal(PQ.cirugiaPayload('Traumático', c, HOY), null);
    assert.deepEqual(PQ.cirugiaPayload('Post-quirúrgico', c, HOY),
      { iv: 'PTR derecha', fe: '25/08/2026', se: 6, pr: 'Escrito', re: 'Carga parcial', co: ['TVP / TEP', 'Lesión nerviosa', 'Dehiscencia leve'] });
    withState(POSQ({ intervencion: 'PTR' }), () => assert.equal(buildPhysiQPayload().cq.iv, 'PTR'));
    withState({ mecanismo: 'Insidioso', cirugia: cir({ intervencion: 'PTR' }), derivacionResuelta: {} }, () => {
      assert.ok(!('cq' in buildPhysiQPayload()), 'fuera del posquirúrgico, la tarjeta no viaja');
      assert.ok(!buildContextSummaryText().includes('CIRUGÍA'));
      assert.ok(!buildInformeFisioterapiaText().includes('ANTECEDENTE QUIRÚRGICO'));
    });
  });

  test('📋 Notas y 📄 Informe: cirugía, protocolo y plan supeditado', () => {
    withState(POSQ({ intervencion: 'Osteosíntesis de maléolo', protocolo: 'Verbal', restricciones: 'Sin carga 6 semanas' }), () => {
      const n = buildContextSummaryText(), i = buildInformeFisioterapiaText();
      assert.match(n, /🏥 CIRUGÍA: Osteosíntesis de maléolo · Protocolo: verbal · Restricciones: Sin carga 6 semanas/);
      assert.ok(!n.includes(PQ.TEXTO_SIN_PROTOCOLO));
      assert.match(i, /ANTECEDENTE QUIRÚRGICO\n  · Intervención: Osteosíntesis de maléolo/);
      assert.match(i, /PLAN DE TRATAMIENTO Y RECOMENDACIONES\n  · El tratamiento sigue el protocolo y las restricciones indicadas por el cirujano: Sin carga 6 semanas/);
    });
    for (const protocolo of ['', 'No hay']) {
      withState(POSQ({ intervencion: 'LCA', protocolo }), () => {
        assert.ok(buildContextSummaryText().includes(PQ.TEXTO_SIN_PROTOCOLO), `Notas, protocolo «${protocolo}»`);
        assert.match(buildInformeFisioterapiaText(), new RegExp(`RECOMENDACIONES\\n  · ${PQ.TEXTO_SIN_PROTOCOLO}\\.`));
      });
    }
  });

  test('modo breve: sin protocolo del cirujano es un pendiente (y lleva a la tarjeta)', () => {
    withState({ ...POSQ({ protocolo: 'No hay' }), modo: 'breve' }, () => {
      const p = getPendientesBreve().find(x => x.ancla === 'cardCirugia');
      assert.ok(p && p.fase === 1 && p.texto.includes(PQ.TEXTO_SIN_PROTOCOLO));
    });
    withState({ ...POSQ({ protocolo: 'Escrito' }), modo: 'breve' }, () => {
      assert.ok(!getPendientesBreve().some(x => x.ancla === 'cardCirugia'));
    });
    withState({ ...POSQ({ protocolo: 'No hay' }), modo: 'completo' }, () => assert.deepEqual(getPendientesBreve(), []));
  });

  test('«ya diagnosticada y tratada»: h11 sin derivación ni puntuación en payload, Notas, Informe y pendientes', () => {
    const patch = { ...POSQ({ intervencion: 'Osteosíntesis de húmero proximal', protocolo: 'Escrito' }),
      activeHypotheses: ['h11'], testResults: { h11: { 0: 'pos' } }, hypothesisScores: {}, modo: 'breve' };
    withState(patch, () => {
      assert.ok(!esTratada('h11'));
      marcarTratada('h11', true);
      assert.ok(esTratada('h11'));
      const p = buildPhysiQPayload();
      const h11 = p.h.find(x => x.id === 'h11');
      assert.equal(h11.dt, true);
      assert.equal(h11.sc, PQ.ETIQUETA_TRATADA);
      assert.ok(buildInformeFisioterapiaText().includes(`· ${HYPOTHESES.h11.name} (intervenida quirúrgicamente)`));
      assert.ok(!getPendientesBreve().some(x => x.fase === '4b'), 'sus tests no aplican: no son un pendiente');
      marcarTratada('h11', false);
      assert.ok(!esTratada('h11'));
      assert.ok(!('dt' in buildPhysiQPayload().h.find(x => x.id === 'h11')));
      assert.notEqual(state.hypothesisScores.h11.label, PQ.ETIQUETA_TRATADA, 'al desmarcar vuelve la puntuación de sus tests');
    });
    withState({ ...patch, mecanismo: 'Traumático' }, () => {
      marcarTratada('h11', true);
      assert.ok(buildInformeFisioterapiaText().includes(`· ${HYPOTHESES.h11.name} (diagnosticada y tratada)`), 'disponible sin cirugía');
    });
  });

  test('«ya diagnosticada y tratada»: sin Post-quirúrgico, solo hipótesis «Derivar»', () => {
    withState({ derivacionResuelta: {}, activeHypotheses: ['h2'], hypothesisScores: {} }, () => {
      marcarTratada('h2', true);
      assert.ok(!esTratada('h2'));
      assert.deepEqual(state.derivacionResuelta, {});
    });
  });

  // ── Hipótesis posquirúrgica genérica `pq1` (docs/posquirurgico.md, «Propuesta»)
  const P4B = await import('../../phase4b.js');
  const { HIP_POSQUIRURGICA } = await import('../../data.js');

  test('pq1: solo con Post-quirúrgico, la primera, fuera de HYPOTHESES y de ningún árbol', () => {
    assert.ok(!HYPOTHESES.pq1, 'no es una hipótesis regional');
    for (const t of Object.values(CIF_TREES)) for (const st of t.steps) for (const o of st.options) {
      assert.ok(!(o.hypothesis || []).includes('pq1'), `${st.id}: ningún árbol la activa`);
    }
    withState({ ...POSQ(), region: 'cadera', activeHypotheses: ['ca1', 'ca2'] }, () => {
      assert.deepEqual(P4B.hipotesisActivas(), ['pq1', 'ca1', 'ca2']);
      assert.deepEqual(state.activeHypotheses, ['ca1', 'ca2'], 'no se guarda en el estado del árbol');
    });
    withState({ mecanismo: 'Insidioso', region: 'cadera', activeHypotheses: ['ca1'] }, () => {
      assert.deepEqual(P4B.hipotesisActivas(), ['ca1']);
    });
    withState({ ...POSQ(), region: 'cadera', activeHypotheses: [] }, () => {
      assert.deepEqual(P4B.hipotesisActivas(), ['pq1'], 'también sin hipótesis del árbol');
    });
  });

  test('pq1: nombre con la intervención y PROM que la región ya usa', () => {
    withState({ ...POSQ({ intervencion: 'PTC derecha' }), region: 'cadera' }, () => {
      const h = P4B.hipotesis('pq1');
      assert.equal(h.name, 'Postoperatorio: PTC derecha');
      assert.deepEqual(h.tests, []);
      assert.equal(h.dosis, '');
    });
    withState({ ...POSQ(), region: 'cadera' }, () => assert.equal(P4B.hipotesis('pq1').name, PQ.NOMBRE_HIP_POSQ));
    assert.deepEqual(Object.keys(HIP_POSQUIRURGICA.promPorRegion).sort(), Object.keys(CIF_TREES).sort());
    for (const [r, prom] of Object.entries(HIP_POSQUIRURGICA.promPorRegion)) {
      assert.ok(Object.values(HYPOTHESES).some(h => h.region === r && h.prom === prom), `${r}: «${prom}» no es un PROM de la región`);
    }
  });

  test('pq1: en payload (pq), Notas e Informe la primera, sin puntuación ni pendiente en breve', () => {
    withState({ ...POSQ({ intervencion: 'PTR', protocolo: 'Escrito', restricciones: 'Carga parcial 4 semanas' }), region: 'rodilla',
      activeHypotheses: ['ro1'], testResults: { ro1: { 0: 'pos' } }, hypothesisScores: { ro1: { totalLR: 3, label: 'x' } }, modo: 'breve' }, () => {
      const p = buildPhysiQPayload();
      assert.deepEqual(p.h[0], { id: 'pq1', name: 'Postoperatorio: PTR', sc: PQ.ETIQUETA_HIP_POSQ, lr: null, tr: {}, pq: true });
      assert.equal(p.h[1].id, 'ro1');
      const inf = buildInformeFisioterapiaText();
      assert.ok(inf.includes('IMPRESIÓN CLÍNICA\n  · Postoperatorio: PTR\n'), 'la primera en la impresión clínica');
      assert.ok(!inf.includes('pendiente de confirmar)'), 'pq1 no deja la impresión «sin confirmar»');
      assert.ok(buildContextSummaryText().includes(`· Postoperatorio: PTR — ${PQ.ETIQUETA_HIP_POSQ}`));
      assert.ok(!getPendientesBreve().some(x => x.fase === '4b'));
      assert.equal(PQ.pautaHipPosq(p.cq), 'Seguir el protocolo del cirujano: Carga parcial 4 semanas');
    });
    withState({ ...POSQ(), region: 'rodilla', activeHypotheses: [] }, () => {
      assert.ok(PQ.pautaHipPosq(buildPhysiQPayload().cq).startsWith(PQ.TEXTO_SIN_PROTOCOLO));
    });
    withState({ mecanismo: 'Insidioso', region: 'rodilla', activeHypotheses: ['ro1'] }, () => {
      assert.ok(!buildPhysiQPayload().h.some(x => x.pq));
    });
  });

  test('«Tratada con la cirugía»: con Post-quirúrgico en cualquier hipótesis; deja de contar al cambiar el mecanismo', () => {
    withState({ ...POSQ({ intervencion: 'PTC' }), region: 'cadera', activeHypotheses: ['ca1'],
      testResults: { ca1: { 0: 'pos' } }, hypothesisScores: {} }, () => {
      assert.ok(P4B.casillaTratadaHTML('ca1').includes('Tratada con la cirugía'));
      marcarTratada('ca1', true);
      assert.ok(esTratada('ca1'));
      assert.equal(state.hypothesisScores.ca1.label, PQ.ETIQUETA_TRATADA);
      assert.ok(buildInformeFisioterapiaText().includes(`· ${HYPOTHESES.ca1.name} (intervenida quirúrgicamente)`));
      state.mecanismo = 'Insidioso';
      P4B.sincronizarTratadas();
      assert.ok(!esTratada('ca1'), 'sin Post-quirúrgico la marca no cuenta');
      assert.equal(P4B.casillaTratadaHTML('ca1'), '');
      assert.notEqual(state.hypothesisScores.ca1.label, PQ.ETIQUETA_TRATADA, 'vuelve la puntuación de sus tests');
      assert.ok(state.derivacionResuelta.ca1, 'la marca se conserva');
      state.mecanismo = 'Post-quirúrgico';
      P4B.sincronizarTratadas();
      assert.ok(esTratada('ca1'));
    });
  });

  test('pq1 en el informe con IA: condición de salud con el protocolo como pauta', () => {
    const c = IN.contextoValoracion({ p: 'X', br: [], sq: [], pn: {}, h: [{ name: 'Postoperatorio: PTC', pq: true }] }, r => r, null);
    assert.ok(c.includes('Postoperatorio: PTC (la cirugía es la condición de salud, no una hipótesis por confirmar)'));
    withState({ ...POSQ({ intervencion: 'PTC', protocolo: 'Verbal' }), region: 'cadera', activeHypotheses: ['ca1'],
      testResults: {}, hypothesisScores: {}, treeAnswers: {} }, () => {
      const a = IA.construirAmpliado();
      assert.equal(a.pautas[0].hipotesis, 'Postoperatorio: PTC');
      assert.equal(a.pautas[0].posquirurgica, true);
      assert.equal(a.pautas[0].prom, HIP_POSQUIRURGICA.promPorRegion.cadera);
      const t = IN.bloquesAmpliados(a).join('\n');
      assert.ok(t.includes('Postoperatorio: PTC:\n    · Pauta: Seguir el protocolo del cirujano.'));
    });
  });

  test('árbol: solo codo co_step1 FRACTURA es resoluble, y marcada sale de dv', () => {
    const resolubles = [];
    for (const [r, t] of Object.entries(CIF_TREES)) for (const st of t.steps) for (const o of st.options) {
      if (o.resoluble) { resolubles.push(`${r}/${st.id}/${o.value}`); assert.ok(o.derivacion, 'resoluble sin derivacion'); }
    }
    assert.deepEqual(resolubles, ['codo/co_step1/fractura']);
    withState({ region: 'codo', treeAnswers: { co_step1: 'fractura' }, derivacionResuelta: {} }, () => {
      assert.equal(getDerivacionesArbol().length, 1);
      state.derivacionResuelta.co_step1 = true;
      assert.deepEqual(getDerivacionesArbol(), []);
      assert.deepEqual(buildPhysiQPayload().dv, []);
      assert.ok(!buildInformeFisioterapiaText().includes('Se recomienda valoración médica'));
    });
    withState({ region: 'lumbar', treeAnswers: { lu_step2: 'vascular' }, derivacionResuelta: { lu_step2: true } }, () => {
      assert.equal(getDerivacionesArbol().length, 1, 'la claudicación vascular no se resuelve');
    });
  });

  test('preguntas de traumatismo: nota posquirúrgica solo en las decididas, visible por CSS', () => {
    const conNota = [];
    for (const [r, d] of Object.entries(SYSTEMIC_SCREENING)) for (const sis of d.sistemas) for (const q of sis.preguntas) {
      if (q.notaPosquirurgica) {
        conNota.push(q.id);
        const html = buildSistemaHTML(sis);
        assert.ok(html.includes(`<div class="nota-posq solo-posq">🏥 ${PQ.TEXTO_NOTA_TRAUMA}</div>`), `${r}/${q.id}`);
      }
    }
    assert.deepEqual(conNota.sort(), ['co_t1', 'co_t2', 'cv_ar3', 'h_t1', 'ro_t2', 'ro_t3', 'ro_t4', 'tp_t1']);
    const css = leer('styles.css');
    assert.match(css, /\.solo-posq \{ display: none; \}\nbody\.posquirurgico \.solo-posq \{ display: block; \}/);
  });

  test('informe con IA: bloque «Cirugía», regla del protocolo y hipótesis tratada sin derivar', () => {
    const d = { p: 'X', r: 'hombro', d: '01/01/2026', br: [], sq: [], pn: {},
      h: [{ name: 'Luxación Bloqueada o Fractura (→ Rx)', dt: true }],
      cq: { iv: 'Osteosíntesis', fe: '01/12/2025', se: 4, pr: '', re: '', co: [] } };
    const c = IN.contextoValoracion(d, r => r, null);
    assert.ok(c.includes('Cirugía (paciente posquirúrgico):\n  · Intervención: Osteosíntesis\n  · Fecha: 01/12/2025 (4 semanas)'));
    assert.ok(c.includes('restricciones pendientes de confirmar con el cirujano'));
    assert.ok(c.includes('Luxación Bloqueada o Fractura (diagnóstico ya confirmado y tratado por el médico: es un antecedente)'));
    assert.ok(!c.includes('no se deriva'), 'nada que invite a escribir «no se deriva»');
    const prompt = IN.PLANTILLAS.narrativo.prompt(d, { conAudio: false, nombreRegion: r => r, ampliado: null });
    assert.ok(prompt.includes('Paciente operado (si los datos incluyen «Cirugía»)'));
    assert.ok(prompt.includes('no está marcada como ya diagnosticada y tratada se deriva'));
    const t = IN.bloquesAmpliados({ pautas: [{ hipotesis: 'Fractura', derivar: false, tratada: true, operada: true, pauta: '', fuente: '', prom: '' }] }).join('\n');
    assert.ok(t.includes('Diagnóstico ya confirmado e intervenido: el plan sigue el protocolo del cirujano') && !t.includes('Derivar: sin tratamiento') && !t.includes('no se deriva'));
    withState({ ...POSQ({ intervencion: 'ORIF' }), region: 'hombro', activeHypotheses: ['h11'], testResults: { h11: { 0: 'pos' } },
      hypothesisScores: {}, derivacionResuelta: { h11: true }, treeAnswers: {} }, () => {
      const a = IA.construirAmpliado();
      assert.deepEqual(a.tests, [], 'los tests de una tratada no aplican');
      assert.deepEqual(a.pautas.filter(x => !x.posquirurgica).map(x => [x.derivar, x.tratada, x.operada]), [[false, true, true]]);
    });
  });

  test('informe con IA: el recorrido avisa cuando lo que «orienta a» ya está tratado', () => {
    withState({ ...POSQ({ intervencion: 'Clavo', protocolo: 'Verbal' }), region: 'hombro', activeHypotheses: ['h11'], testResults: {},
      hypothesisScores: {}, derivacionResuelta: { h11: true }, treeAnswers: { h_step2b: 'trauma' } }, () => {
      const a = IA.construirAmpliado();
      assert.equal(a.arbol.find(x => /Traumatismo previo/.test(x.respuesta))?.tratada, true);
      assert.match(IN.bloquesAmpliados(a).join('\n'), /orienta a: luxación bloqueada o fractura; Rx \(ya diagnosticada y tratada: es un antecedente\)/);
      state.derivacionResuelta = {};
      assert.ok(!IA.construirAmpliado().arbol.some(x => x.tratada), 'sin marcar, sin aviso');
    });
  });

  test('huella del informe con IA: las semanas desde la cirugía no la cambian; la intervención sí', () => {
    const base = { p: 'X', d: '01/01/2026', cq: { iv: 'PTR', fe: '', se: 4, pr: 'Escrito', re: '', co: [] } };
    assert.equal(IN.huellaPayload(base), IN.huellaPayload({ ...base, d: '15/01/2026', cq: { ...base.cq, se: 6 } }));
    assert.notEqual(IN.huellaPayload(base), IN.huellaPayload({ ...base, cq: { ...base.cq, iv: 'PTC' } }));
  });

  test('cribado posquirúrgico: el mismo sistema, el primero, en las 7 regiones; preguntas y urgencias decididas', () => {
    const { SIS_POSQUIRURGICO: SIS } = await_comun;
    for (const [r, d] of Object.entries(SYSTEMIC_SCREENING)) assert.equal(d.sistemas[0], SIS, r);
    assert.deepEqual(SIS.preguntas.map(q => q.id), ['pq_herida', 'pq_tvp', 'pq_tvp_ms', 'pq_tep', 'pq_compart', 'pq_sdrc', 'pq_nervio']);
    assert.deepEqual(SIS.preguntas.filter(q => q.urgencia).map(q => q.id), ['pq_herida', 'pq_tvp', 'pq_tvp_ms', 'pq_tep', 'pq_compart', 'pq_nervio']);
    const regiones = Object.keys(SYSTEMIC_SCREENING);
    for (const q of SIS.preguntas) (q.regiones || []).forEach(r => assert.ok(regiones.includes(r), `${q.id}: región ${r}`));
    // Cada región ve una sola pregunta de TVP
    for (const r of regiones) assert.equal(SIS.preguntas.filter(q => q.id.startsWith('pq_tvp') && (!q.regiones || q.regiones.includes(r))).length, 1, r);
    assert.ok(SIS.preguntas.every(q => q.razonamiento?.porque && q.razonamiento?.peso && q.razonamiento?.fuentes?.length), 'todas con razonamiento');
  });

  test('cribado posquirúrgico: solo cuenta con mecanismo Post-quirúrgico y con las preguntas de la región', () => {
    const urg = id => SYSTEMIC_SCREENING.hombro.sistemas[0].preguntas.find(q => q.id === id).urgencia;
    const base = { region: 'hombro', sistemicoAnswers: { pq_herida: 'SI', pq_tvp_ms: 'SI', pq_tvp: 'SI', pq_sdrc: 'SI' }, sistemicoAlerta: true };
    withState({ ...base, mecanismo: 'Traumático', cirugia: cir(), derivacionResuelta: {} }, () => {
      const p = buildPhysiQPayload();
      assert.deepEqual(p.ur, [], 'sin Post-quirúrgico no hay urgencias del sistema');
      assert.deepEqual(p.sq, []);
    });
    withState({ ...base, ...POSQ() }, () => {
      const p = buildPhysiQPayload();
      assert.deepEqual(p.ur, [urg('pq_herida'), urg('pq_tvp_ms')], 'hombro ve pq_tvp_ms, no pq_tvp');
      assert.equal(p.sq.length, 3, 'herida, TVP del brazo y SDRC');
    });
    withState({ ...base, ...POSQ(), region: 'lumbar' }, () => {
      const p = buildPhysiQPayload();
      assert.deepEqual(p.ur.length, 2, 'lumbar: herida y pq_tvp');
      assert.ok(!p.sq.some(t => t.includes('roce de la ropa')), 'el SDRC no se pregunta en lumbar');
    });
    withState({ ...base, ...POSQ(), modo: 'breve', sistemicoBreve: {} }, () => {
      assert.ok(getPendientesBreve().find(x => x.texto.startsWith('Sistemas sin cribar')).texto.includes('Posquirúrgico'));
    });
    withState({ ...base, mecanismo: 'Insidioso', cirugia: cir(), derivacionResuelta: {}, modo: 'breve', sistemicoBreve: {} }, () => {
      assert.ok(!getPendientesBreve().find(x => x.texto.startsWith('Sistemas sin cribar')).texto.includes('Posquirúrgico'));
    });
  });

  test('cribado posquirúrgico: el mecanismo repinta el cribado conservando las respuestas', () => {
    const src = leer('app.js');
    assert.match(src, /if \(groupId === 'mecanismo'\) \{\n    _pintarCirugiaUI\(\);[\s\S]{0,400}_repintarCribado\(\);/);
    const reparto = src.slice(src.indexOf('function _repintarCribado'), src.indexOf('function buildSistemicoQuestions'));
    assert.ok(reparto.indexOf('savedAnswers') < reparto.indexOf('buildSistemicoQuestions(state.region)'), 'guarda antes de repintar');
  });

  test('integración: window, tarjeta en index.html y deploy', () => {
    for (const f of ['updateCirugia', 'selectCirProtocolo', 'toggleCirComplicacion', 'toggleDiagnosticoTratado', 'toggleDerivacionArbolResuelta'])
      assert.equal(typeof window[f], 'function', f);
    const html = leer('index.html');
    assert.match(html, /<div class="card solo-posq" id="cardCirugia">/);
    const wf = leer('.github/workflows/deploy-to-hub.yml');
    assert.ok(wf.includes('lib/posquirurgico.js'));
  });
}
