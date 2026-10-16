// Urgencias de la fase 2, data/ por regiones, modo breve. Se ejecuta desde tests/unit.js.
import { assert, test, HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, DOSIS_DERIVAR, calcLRScore,
   testPuntua, buildPhysiQPayload, buildInformeFisioterapiaText, buildContextSummaryText,
   getPendientesBreve, buildSistemaHTML, withState, VALID_REGIONS } from './comun.mjs';
import { SIS_ENDOCRINO, SIS_HEMATOLOGICO } from '../../data/comun.js';

// ── Urgencias de región (fase 2) ─────────────────────────────────────────────
console.log('\nurgencias fase 2');

test('urgencia de región: título y líneas no vacías', () => {
  for (const [r, d] of Object.entries(SYSTEMIC_SCREENING)) {
    if (!d.urgencia) continue;
    assert.ok(d.urgencia.titulo && d.urgencia.lineas?.length, r);
    d.urgencia.lineas.forEach(l => assert.ok(typeof l === 'string' && l.trim(), r));
  }
  assert.ok(SYSTEMIC_SCREENING.lumbar.urgencia.titulo.includes('CAUDA EQUINA'));
});

test('l6 (cauda equina) es una pregunta de urgencia y entra en el payload', () => {
  const l6 = SYSTEMIC_SCREENING.lumbar.sistemas.flatMap(s => s.preguntas).find(q => q.id === 'l6');
  assert.ok(l6.urgencia);
  withState({ region: 'lumbar', sistemicoAnswers: { l6: 'SI' } }, () => {
    assert.deepEqual(buildPhysiQPayload().ur, [l6.urgencia]);
  });
  withState({ region: 'lumbar', sistemicoAnswers: { l6: 'NO' } }, () => {
    assert.deepEqual(buildPhysiQPayload().ur, []);
  });
});

test('lu8: la regla SI es 3 de 5 tests de provocación (como la tarjeta lumbar)', () => {
  const h = HYPOTHESES.lu8;
  assert.equal(h.tests.filter(t => t.cluster === 'laslett').length, 5);
  assert.equal(h.clusters.laslett.umbralPos, 3);
  const r = Object.fromEntries(h.tests.map((t, i) => [i, 'nd']));
  h.tests.forEach((t, i) => { if (t.cluster) r[i] = 'neg'; });
  [0, 1, 2].forEach(i => { r[i] = 'pos'; });
  assert.ok(Math.abs(calcLRScore(h, r).totalLR - 2.13) < 0.001);
});

test('árbol CIF: `derivacion` de una opción es texto no vacío; lumbar VASCULAR la lleva', () => {
  for (const [r, tree] of Object.entries(CIF_TREES)) {
    tree.steps.forEach(st => st.options.forEach(o => {
      if ('derivacion' in o) assert.ok(typeof o.derivacion === 'string' && o.derivacion.trim(), `${r}/${st.id}/${o.value}`);
    }));
  }
  const vasc = CIF_TREES.lumbar.steps.find(s => s.id === 'lu_step2').options.find(o => o.value === 'vascular');
  assert.ok(vasc.derivacion?.includes('derivación médica'));
});

test('árbol CIF: VASCULAR entra en payload (dv), 📋 Notas y 📄 Informe; otra respuesta no', () => {
  const msg = CIF_TREES.lumbar.steps.find(s => s.id === 'lu_step2').options.find(o => o.value === 'vascular').derivacion;
  withState({ region: 'lumbar', treeAnswers: { lu_step1: 'no', lu_step2: 'vascular' } }, () => {
    assert.deepEqual(buildPhysiQPayload().dv, [msg]);
    assert.ok(buildContextSummaryText().includes(`🩺 DERIVACIÓN MÉDICA: ${msg}`));
    const inf = buildInformeFisioterapiaText();
    assert.ok(inf.includes('Se recomienda valoración médica') && inf.includes(msg));
  });
  withState({ region: 'lumbar', treeAnswers: { lu_step1: 'no', lu_step2: 'si' } }, () => {
    assert.deepEqual(buildPhysiQPayload().dv, []);
    assert.ok(!buildContextSummaryText().includes('DERIVACIÓN MÉDICA'));
    assert.ok(!buildInformeFisioterapiaText().includes('Se recomienda valoración médica'));
  });
});

// ── `derivacion` en preguntas de la fase 2 (quiste de Tarlov, docs/tarlov.md) ──
test('cribado: `derivacion` es texto no vacío, nunca junto a `urgencia`; hoy solo l_u5 (quiste de Tarlov) la lleva', () => {
  const todas = Object.values(SYSTEMIC_SCREENING).flatMap(r => r.sistemas).flatMap(s => s.preguntas);
  const con = [...new Set(todas.filter(q => 'derivacion' in q).map(q => q.id))];
  assert.deepEqual(con, ['l_u5']);
  todas.filter(q => 'derivacion' in q).forEach(q => {
    assert.ok(typeof q.derivacion === 'string' && q.derivacion.trim(), q.id);
    assert.ok(!q.urgencia, `${q.id}: derivacion y urgencia a la vez`);
  });
});

test('l_u5 (Tarlov): SÍ entra en dv, 📋 Notas y 📄 Informe, no en ur; l6 sigue siendo la urgencia', () => {
  const qs = SYSTEMIC_SCREENING.lumbar.sistemas.find(s => s.id === 'l_urogenital').preguntas;
  const u5 = qs.find(q => q.id === 'l_u5'), l6 = qs.find(q => q.id === 'l6');
  assert.equal(qs.indexOf(u5), qs.indexOf(l6) + 1, 'l_u5 va justo después de l6');
  assert.ok(l6.urgencia && !l6.derivacion);
  assert.ok(u5.razonamiento.porque && u5.razonamiento.peso && u5.razonamiento.detalle && u5.razonamiento.fisiologia);
  withState({ region: 'lumbar', sistemicoAnswers: { l_u5: 'SI' } }, () => {
    const d = buildPhysiQPayload();
    assert.deepEqual(d.dv, [u5.derivacion]);
    assert.deepEqual(d.ur, []);
    assert.ok(buildContextSummaryText().includes(`🩺 DERIVACIÓN MÉDICA: ${u5.derivacion}`));
    const inf = buildInformeFisioterapiaText();
    assert.ok(inf.includes('Se recomienda valoración médica') && inf.includes(u5.derivacion));
  });
  withState({ region: 'lumbar', sistemicoAnswers: { l_u5: 'NO' } }, () => {
    assert.deepEqual(buildPhysiQPayload().dv, []);
  });
  // Con una derivación del árbol, primero la del cribado
  const vasc = CIF_TREES.lumbar.steps.find(s => s.id === 'lu_step2').options.find(o => o.value === 'vascular').derivacion;
  withState({ region: 'lumbar', sistemicoAnswers: { l_u5: 'SI' }, treeAnswers: { lu_step1: 'no', lu_step2: 'vascular' } }, () => {
    assert.deepEqual(buildPhysiQPayload().dv, [u5.derivacion, vasc]);
  });
});

test('l_u5 (Tarlov): pinta su mensaje 🩺, sin la clase de urgencia', () => {
  withState({ region: 'lumbar' }, () => {
    const html = buildSistemaHTML(SYSTEMIC_SCREENING.lumbar.sistemas.find(s => s.id === 'l_urogenital'));
    const fila = html.slice(html.indexOf('id="sq2_l_u5"') - 60, html.indexOf('id="sq2_l_u3a"'));
    assert.ok(fila.includes('sq2-deriv-msg') && !fila.includes('sq2-urg'));
    assert.ok(/class="sq2[^"]*sq2-urg[^"]*" id="sq2_l6"/.test(html));
  });
});

test('lumbar: cauda equina (l6) y ectópico (l_e8) son urgencias (y ninguna otra); el dolor ligado a la regla (l_e3) no', () => {
  const qs = SYSTEMIC_SCREENING.lumbar.sistemas.filter(s => !s.id.startsWith('transversal_')).flatMap(s => s.preguntas);
  assert.deepEqual(qs.filter(q => q.urgencia).map(q => q.id).sort(), ['l6', 'l_e8']);
  // La bandera roja del ectópico dice «urgencia»: tiene que haber una pregunta que la dispare
  const sis = SYSTEMIC_SCREENING.lumbar.sistemas.find(s => s.id === 'l_espondilo');
  const ect = sis.banderasRojas.find(f => /ectópico.*urgencia/i.test(f.texto || f));
  assert.equal(ect?.pregunta, 'l_e8');
  withState({ region: 'lumbar', sistemicoAnswers: { l_e8: 'SI' } }, () => {
    assert.equal(buildPhysiQPayload().ur.length, 1);
  });
});

test('sistemas compartidos (endocrino, hematológico): solo la sepsis neutropénica (hem_5) y el sangrado en la hemofilia (hem_6) son urgencia; las infecciones de repetición (hem_3) y el sangrado fácil (hem_1) no', () => {
  const qs = [SIS_ENDOCRINO, SIS_HEMATOLOGICO].flatMap(s => s.preguntas);
  assert.deepEqual(qs.filter(q => q.urgencia).map(q => q.id), ['hem_5', 'hem_6']);
  assert.match(qs.find(q => q.id === 'hem_6').urgencia, /hemofilia.*hoy.*urgencias/);
  assert.equal(SIS_HEMATOLOGICO.banderasRojas.find(b => /hemofilia/.test(b.texto) && /dolor/.test(b.texto)).pregunta, 'hem_6');
  assert.match(qs.find(q => q.id === 'hem_5').urgencia, /sepsis neutropénica.*urgencias hoy/);
  // La bandera de fiebre en la leucopenia tiene una pregunta que dispara la urgencia
  const f = SIS_HEMATOLOGICO.banderasRojas.find(b => /leucopenia/.test(b.texto || b));
  assert.deepEqual(f.pregunta, ['hem_3', 'hem_5']);
  // y sale en todas las regiones que cargan el sistema hematológico
  for (const r of VALID_REGIONS) assert.ok(SYSTEMIC_SCREENING[r].sistemas.includes(SIS_HEMATOLOGICO), r);
});

test('cadera: TVP, torsión testicular, ectópico, fractura de estrés del cuello femoral, artritis séptica, aneurisma roto e isquemia aguda son urgencias (y ninguna otra)', () => {
  const qs = SYSTEMIC_SCREENING.cadera.sistemas.filter(s => !s.id.startsWith('transversal_')).flatMap(s => s.preguntas);   // el posquirúrgico tiene su propio test
  assert.deepEqual(qs.filter(q => q.urgencia).map(q => q.id).sort(), ['ca_in1', 'ca_os1', 'ca_u3', 'ca_u5', 'ca_v2', 'ca_v4', 'ca_v5']);
  // ca_v2 junta TVP y calambres: la urgencia dice que los calambres solos no lo son,
  // y deriva hoy con cualquier Wells (NICE NG158, rec. 1.1.3 y 1.1.8)
  assert.match(qs.find(q => q.id === 'ca_v2').urgencia, /no los calambres solos/);
  assert.match(qs.find(q => q.id === 'ca_v2').urgencia, /1 o menos, dímero D/);
  withState({ region: 'cadera', sistemicoAnswers: { ca_os1: 'SI', ca_in1: 'NO', ca_u3: 'NO' } }, () => {
    assert.equal(buildPhysiQPayload().ur.length, 1);
  });
});

test('cadera: ningún test multiplica por una LR− de 0; Thomas y FADDIR no puntúan; trocantéreo según Kinsella 2024', () => {
  Object.values(HYPOTHESES).filter(h => h.region === 'cadera').forEach(h => {
    const r = Object.fromEntries(h.tests.map((_, i) => [i, 'neg']));
    assert.ok(calcLRScore(h, r).totalLR > 0, h.id);
  });
  // Thomas (S/E calculadas por Reiman 2015 sobre una serie de casos) y FADDIR (agrupado con probabilidad
  // previa del 90 %; Pålsson 2020 en FAIS) son hallazgos en SIFA y en labrum.
  for (const id of ['ca2', 'ca3']) {
    const h = HYPOTHESES[id];
    h.tests.forEach((t, i) => {
      if (t.name !== 'Test de Thomas' && !t.name.includes('FADDIR')) return;
      for (const r of ['pos', 'neg']) assert.equal(calcLRScore(h, { [i]: r }).totalLR, 1, `${id} ${t.name} ${r}`);
    });
  }
  // Síndrome trocantéreo: palpación × abducción resistida reproducen la secuencia de Kinsella 2024
  // (59 % → 96 % con las dos positivas, → 14 % con las dos negativas); la derotación es hallazgo.
  const ca4 = HYPOTHESES.ca4, iPal = ca4.tests.findIndex(t => t.name.startsWith('Palpación')),
    iAbd = ca4.tests.findIndex(t => t.name.startsWith('Test de Abducción')),
    iDer = ca4.tests.findIndex(t => t.name.startsWith('Derotación'));
  assert.ok(Math.abs(calcLRScore(ca4, { [iPal]: 'pos', [iAbd]: 'pos' }).totalLR - 2.42 * 6.09) < 0.001);
  assert.ok(Math.abs(calcLRScore(ca4, { [iPal]: 'neg', [iAbd]: 'neg' }).totalLR - 0.25 * 0.45) < 0.001);
  assert.equal(calcLRScore(ca4, { [iDer]: 'pos' }).totalLR, 1);
});

test('ca1: los criterios ACR no puntúan (cifras de la muestra de desarrollo); la RI disminuida puntúa sola', () => {
  const h = HYPOTHESES.ca1, iAcr = h.tests.findIndex(t => t.name.startsWith('Criterios clínicos ACR'));
  assert.equal(calcLRScore(h, { [iAcr]: 'pos' }).totalLR, 1);
  assert.equal(calcLRScore(h, { [iAcr]: 'neg' }).totalLR, 1);
  assert.ok(Math.abs(calcLRScore(h, { 0: 'pos', 2: 'pos', [iAcr]: 'pos' }).totalLR - 3.2) < 0.001);
});

test('ca10: el cluster de Laslett puntúa con Saueressig 2021; thigh thrust y compresión solos no puntúan (Han 2023)', () => {
  const h = HYPOTHESES.ca10, iTt = h.tests.findIndex(t => t.name === 'Thigh thrust'),
    iCo = h.tests.findIndex(t => t.name === 'Test de Compresión Pélvica'),
    iCl = h.tests.findIndex(t => t.name.startsWith('Cluster de Laslett'));
  [iTt, iCo].forEach(i => {
    assert.equal(testPuntua(h, h.tests[i]), false, h.tests[i].name);
    ['pos', 'neg'].forEach(r => assert.equal(calcLRScore(h, { [i]: r }).totalLR, 1));
  });
  assert.ok(Math.abs(calcLRScore(h, { [iCl]: 'pos' }).totalLR - 2.13) < 0.001);
  assert.ok(Math.abs(calcLRScore(h, { [iCl]: 'neg' }).totalLR - 0.33) < 0.001);
  assert.ok(Math.abs(calcLRScore(h, { [iCl]: 'pos', [iCo]: 'pos', [iTt]: 'pos' }).totalLR - 2.13) < 0.001);
});

test('cervical: disección, IVB, fractura tras traumatismo, cefalea de alarma y episodio cardiaco en curso son urgencias', () => {
  const qs = SYSTEMIC_SCREENING.cervical.sistemas.filter(s => !s.soloPosquirurgico && !s.soloHipermovilidad).flatMap(s => s.preguntas);   // el posquirúrgico tiene su propio test
  ['cv_ar1', 'cv_ar2', 'cv_ar3', 'cv_ar4', 'cv_c3'].forEach(id => assert.ok(qs.find(q => q.id === id)?.urgencia, id));
  withState({ region: 'cervical', sistemicoAnswers: { cv_ar1: 'NO', cv_ar2: 'SI', cv_ar3: 'NO', cv_ar4: 'NO' } }, () => {
    assert.equal(buildPhysiQPayload().ur.length, 1);
  });
  // cv2 (síntomas cardiacos acompañantes, también pasados) no es urgente; cv_c3 (episodio en curso) sí
  assert.ok(!qs.find(q => q.id === 'cv2').urgencia);
  assert.deepEqual(qs.filter(q => q.urgencia && !q.id.startsWith('hem_')).map(q => q.id).sort(), ['cv_ar1', 'cv_ar2', 'cv_ar3', 'cv_ar4', 'cv_c3']);   // hem_5 y hem_6, test de los compartidos
});

test('cervical: ningún test multiplica por una LR− de 0; el cluster de Jull y el hielo no puntúan', () => {
  Object.values(HYPOTHESES).filter(h => h.region === 'cervical').forEach(h => {
    const r = Object.fromEntries(h.tests.map((_, i) => [i, 'neg']));
    assert.ok(calcLRScore(h, r).totalLR > 0, h.id);
  });
  const ce4 = HYPOTHESES.ce4, iCluster = ce4.tests.findIndex(t => t.name.startsWith('Cluster'));
  assert.equal(calcLRScore(ce4, { [iCluster]: 'pos' }).totalLR, 1);
  const ce5 = HYPOTHESES.ce5, iHielo = ce5.tests.findIndex(t => t.name.startsWith('Hielo'));
  assert.equal(ce5.tests[iHielo].tipo, 'pronostico');
  assert.equal(calcLRScore(ce5, { [iHielo]: 'pos' }).totalLR, 1);
});

test('cervical: el FRT puntúa solo positivo (un negativo no descarta una cervicogénica de C2–C3)', () => {
  const ce4 = HYPOTHESES.ce4, iFrt = ce4.tests.findIndex(t => t.name.startsWith('Test de Flexión-Rotación'));
  assert.ok(Math.abs(calcLRScore(ce4, { [iFrt]: 'pos' }).totalLR - 5) < 0.001);
  assert.equal(calcLRScore(ce4, { [iFrt]: 'neg' }).totalLR, 1);
});

test('rodilla: bursa séptica, aparato extensor, luxación y neurovascular son urgencias', () => {
  const qs = SYSTEMIC_SCREENING.rodilla.sistemas.filter(s => !s.soloPosquirurgico && !s.soloHipermovilidad).flatMap(s => s.preguntas);   // el posquirúrgico tiene su propio test
  ['r1', 'r_v2', 'r_v4', 'r_i3', 'ro_t2', 'ro_t3', 'ro_t4'].forEach(id => assert.ok(qs.find(q => q.id === id)?.urgencia, id));
});

test('codo y rodilla: artritis séptica (co1) e isquemia aguda (r_v4, el mismo razonamiento que ca_v5) son urgencias', () => {
  const preg = r => SYSTEMIC_SCREENING[r].sistemas.flatMap(s => s.preguntas);
  assert.deepEqual(preg('codo').filter(q => q.urgencia && !q.id.startsWith('hem_') && !q.id.startsWith('pq_') && !q.id.startsWith('hm_')).map(q => q.id), ['co_t1', 'co_t2', 'co1']);
  assert.equal(preg('rodilla').find(q => q.id === 'r_v4').razonamiento, preg('cadera').find(q => q.id === 'ca_v5').razonamiento);
});

test('rodilla: los grupos de Décary absorben sus componentes; LCA confirma y descarta por separado', () => {
  const ro4 = HYPOTHESES.ro4, iConf = ro4.tests.findIndex(t => t.name.startsWith('Confirmar')),
    iDesc = ro4.tests.findIndex(t => t.name.startsWith('Descartar'));
  assert.ok(Math.abs(calcLRScore(ro4, { [iConf]: 'pos' }).totalLR - 17.5) < 0.001);
  assert.equal(calcLRScore(ro4, { [iConf]: 'neg' }).totalLR, 1);   // sin LR− publicada
  assert.ok(Math.abs(calcLRScore(ro4, { [iDesc]: 'neg' }).totalLR - 0.08) < 0.001);
  assert.equal(calcLRScore(ro4, { [iDesc]: 'pos' }).totalLR, 1);   // sin LR+ publicada
  const ro2 = HYPOTHESES.ro2, iTrau = ro2.tests.findIndex(t => t.name.startsWith('Combinación traumática')),
    iPalp = ro2.tests.findIndex(t => t.name.startsWith('Sensibilidad a la palpación'));
  assert.ok(Math.abs(calcLRScore(ro2, { [iTrau]: 'pos', [iPalp]: 'pos' }).totalLR - 8.9) < 0.001);
  // Criterios del ACR con las cifras de Peat 2006 (LR+ 1,6 · LR− 0,8): no puntúan, así que no
  // absorben a sus componentes — crepitación (2,23) y agrandamiento óseo (11,81) cuentan solos.
  const ro1 = HYPOTHESES.ro1, iAcr = ro1.tests.findIndex(t => t.name === 'Criterios clínicos del ACR');
  assert.equal(calcLRScore(ro1, { [iAcr]: 'pos' }).totalLR, 1);
  assert.equal(calcLRScore(ro1, { [iAcr]: 'neg' }).totalLR, 1);
  assert.ok(Math.abs(calcLRScore(ro1, { 0: 'pos', 1: 'pos', 2: 'pos', [iAcr]: 'pos' }).totalLR - 2.23 * 11.81) < 0.01);
  // Plica: la E de Kim 2007 sale solo de los controles con dolor lateral → hallazgo, no puntúa
  assert.equal(calcLRScore(HYPOTHESES.ro17, { 0: 'pos' }).totalLR, 1);
  assert.equal(calcLRScore(HYPOTHESES.ro17, { 0: 'neg' }).totalLR, 1);
});

test('hombro: urgencias: episodio cardiaco en curso (h_c4), ectópico (h_g1), rotura de bazo (h_gi4) y fractura o luxación (h_t1); la bisagra reparte congelado, artrosis GH y luxación/fractura', () => {
  const qs = SYSTEMIC_SCREENING.hombro.sistemas.filter(s => !s.id.startsWith('transversal_')).flatMap(s => s.preguntas);   // el posquirúrgico tiene su propio test
  assert.equal(SYSTEMIC_SCREENING.hombro.urgencia, undefined);
  assert.deepEqual(qs.filter(q => q.urgencia).map(q => q.id), ['h_c4', 'h_g1', 'h_gi4', 'h_t1']);
  assert.ok(!qs.find(q => q.id === 'h2').urgencia);   // síntomas cardiacos acompañantes, también pasados: derivar, no el 112
  ['h_t1', 'h_i1', 'h_n1'].forEach(id => assert.ok(qs.find(q => q.id === id), id));
  const steps = CIF_TREES.hombro.steps, s2 = steps.find(s => s.id === 'h_step2');
  assert.deepEqual(s2.options.find(o => o.value === 'si').hypothesis, []);
  assert.deepEqual(steps.find(s => s.id === 'h_step2b').options.map(o => o.hypothesis[0]), ['h11', 'h10', 'h1']);
});

test('hombro: clusters del manguito (Park, Litaker) sin contar dos veces; ningún test de la AC puntúa', () => {
  const h3 = HYPOTHESES.h3, i = n => h3.tests.findIndex(t => t.name.startsWith(n));
  const iA = i('Cluster A, confirmar'), iAd = i('Cluster A, descartar'), iB = i('Cluster B'), iDrop = i('Drop Arm'), iLag = i('External Rotation Lag');
  assert.ok(Math.abs(calcLRScore(h3, { [iA]: 'pos' }).totalLR - 15.57) < 0.001);
  assert.equal(calcLRScore(h3, { [iA]: 'neg' }).totalLR, 1);                     // sin LR−: para eso está «descartar»
  assert.ok(Math.abs(calcLRScore(h3, { [iAd]: 'neg' }).totalLR - 0.16) < 0.001);
  assert.equal(calcLRScore(h3, { [iAd]: 'pos' }).totalLR, 1);
  // El cluster A absorbe drop arm, signo de retraso en RE y cluster B (la debilidad en RE va en los dos)
  assert.ok(Math.abs(calcLRScore(h3, { [iA]: 'pos', [iDrop]: 'pos', [iLag]: 'pos', [iB]: 'pos' }).totalLR - 15.57) < 0.001);
  assert.ok(Math.abs(calcLRScore(h3, { [iB]: 'pos' }).totalLR - 5.0) < 0.001); // validación, no la 9,84 de derivación
  // Retraso en RI: solo el positivo (LR− 0,04 de un estudio de 37 pacientes, no reproducida en otros)
  const iIR = i('Internal Rotation Lag');
  assert.ok(Math.abs(calcLRScore(h3, { [iIR]: 'pos' }).totalLR - 5.6) < 0.001);
  assert.equal(calcLRScore(h3, { [iIR]: 'neg' }).totalLR, 1);
  const h7 = HYPOTHESES.h7;
  // Aducción cruzada (Chronopoulos, casos y controles, frente a Cadogan 2013 en atención primaria: LR+ 0,86),
  // O'Brien (Chronopoulos frente a Walton, contradictorios), palpación y Paxinos (Walton, 10 controles): hallazgos
  ['Test de Aducción Cruzada', 'Compresión activa', 'Palpación directa', 'Test de Paxinos', 'Paxinos + gammagrafía'].forEach(n => {
    const k = h7.tests.findIndex(t => t.name.startsWith(n));
    assert.ok(k >= 0, n);
    assert.equal(calcLRScore(h7, { [k]: 'pos' }).totalLR, 1, n);
    assert.equal(calcLRScore(h7, { [k]: 'neg' }).totalLR, 1, n);
  });
});

test('hombro: el O’Brien de SLAP no puntúa (Hegedus 2012: LR+ 1,06, IC con el 1)', () => {
  const k = HYPOTHESES.h5.tests.findIndex(t => t.name.startsWith('Test de O'));
  assert.equal(calcLRScore(HYPOTHESES.h5, { [k]: 'pos' }).totalLR, 1);
  assert.equal(calcLRScore(HYPOTHESES.h5, { [k]: 'neg' }).totalLR, 1);
});

test('hombro: LR de Hegedus 2012 en SAPS e inestabilidad; cada dirección por separado', () => {
  const lr = (h, n, r) => calcLRScore(HYPOTHESES[h], { [HYPOTHESES[h].tests.findIndex(t => t.name.startsWith(n))]: r }).totalLR;
  assert.ok(Math.abs(lr('h2', 'Arco doloroso', 'pos') - 2.25) < 0.001);
  assert.equal(lr('h2', 'Arco doloroso', 'neg'), 1);
  assert.equal(lr('h2', 'Test de Hawkins', 'pos'), 1);
  assert.ok(Math.abs(lr('h2', 'Test de Hawkins', 'neg') - 0.35) < 0.001);
  assert.ok(Math.abs(lr('h2', 'Test de Neer', 'neg') - 0.47) < 0.001);
  assert.ok(Math.abs(lr('h4', 'Test de Aprehensión', 'pos') - 17.21) < 0.001);
  assert.ok(Math.abs(lr('h4', 'Test de Aprehensión', 'neg') - 0.39) < 0.001);
  assert.equal(lr('h4', 'Test de Recolocación', 'pos'), 1);   // IC de las dos LR con el 1
  assert.equal(lr('h4', 'Test de Recolocación', 'neg'), 1);
  assert.equal(lr('h4', 'Test de Liberación', 'pos'), 1);     // IC de la LR+ con el 1
  assert.ok(Math.abs(lr('h4', 'Test de Liberación', 'neg') - 0.25) < 0.001);
});

test('hombro: las cifras nuevas de la tarjeta sin fuente verificada no puntúan', () => {
  // Clusters A/B del manguito, palpación AC, Paxinos + O'Brien: cifras solo en el criterio
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h7', 'h10', 'h11'].forEach(id => {
    HYPOTHESES[id].tests.filter(t => t.fuente?.startsWith('Tarjeta de consulta hombro')).forEach(t => {
      const i = HYPOTHESES[id].tests.indexOf(t);
      assert.equal(calcLRScore(HYPOTHESES[id], { [i]: 'pos' }).totalLR, 1, `${id}/${t.name}`);
      assert.equal(calcLRScore(HYPOTHESES[id], { [i]: 'neg' }).totalLR, 1, `${id}/${t.name}`);
    });
  });
});

test('tobillo y pie: cinco P, artritis infecciosa y debilidad simétrica con arreflexia son urgencias', () => {
  const qs = SYSTEMIC_SCREENING.tobillo_pie.sistemas.filter(s => !s.soloPosquirurgico && !s.soloHipermovilidad).flatMap(s => s.preguntas);   // el posquirúrgico tiene su propio test
  ['tp_t1', 'tp_i1', 'tp_n1'].forEach(id => assert.ok(qs.find(q => q.id === id)?.urgencia, id));
  // TVP: derivar hoy con cualquier Wells (NICE NG158, rec. 1.1.3 y 1.1.8), igual que ca_v2 de cadera
  assert.match(qs.find(q => q.id === 'tp_v2').urgencia, /derivar hoy.*1 o menos, dímero D/);
});

test('tobillo y pie: solo puntúan Thompson, hueco palpable, Ottawa (LR−) y Molloy', () => {
  const idx = (id, nombre) => HYPOTHESES[id].tests.findIndex(t => t.name === nombre);
  const lr = (id, nombre, r) => calcLRScore(HYPOTHESES[id], { [idx(id, nombre)]: r }).totalLR;
  const puntuan = {
    tp3: ['Thompson (Simmonds)', 'Hueco palpable'],
    tp5: ['Reglas de Ottawa de tobillo y de pie'],
    tp37: ['Regla de Ottawa de tobillo'],
    tp20: ['Signo de pinzamiento de Molloy'],
  };
  // Maffulli 1998 con las LR de Reiman 2014
  assert.equal(lr('tp3', 'Thompson (Simmonds)', 'pos'), 13.71);
  assert.equal(lr('tp3', 'Thompson (Simmonds)', 'neg'), 0.04);
  assert.equal(lr('tp3', 'Hueco palpable', 'pos'), 6.64);
  assert.equal(lr('tp3', 'Hueco palpable', 'neg'), 0.3);
  // Beckenkamp 2017 (bivariante), estudios con radiografía a todos: solo descarta
  // (las dos reglas juntas, LR− 0,082); el positivo es hallazgo
  assert.equal(lr('tp5', 'Reglas de Ottawa de tobillo y de pie', 'neg'), 0.082);
  assert.equal(lr('tp5', 'Reglas de Ottawa de tobillo y de pie', 'pos'), 1);
  // Beckenkamp 2017: regla del tobillo sola, LR− 0,030; el positivo no puntúa
  assert.equal(lr('tp37', 'Regla de Ottawa de tobillo', 'neg'), 0.03);
  assert.equal(lr('tp37', 'Regla de Ottawa de tobillo', 'pos'), 1);
  // Molloy 2003: LR calculadas de S 94,8 % y E 88 %
  assert.ok(Math.abs(lr('tp20', 'Signo de pinzamiento de Molloy', 'pos') - 7.9) < 0.01);
  assert.ok(Math.abs(lr('tp20', 'Signo de pinzamiento de Molloy', 'neg') - 0.059) < 0.002);
  assert.equal(idx('tp20', 'Signo de pinzamiento de Molloy'), HYPOTHESES.tp20.tests.length - 1, 'test añadido al final');
  // Todo lo demás es hallazgo
  Object.values(HYPOTHESES).filter(h => h.region === 'tobillo_pie').forEach(h => {
    h.tests.forEach((t, i) => {
      if ((puntuan[h.id] || []).includes(t.name)) return;
      assert.equal(calcLRScore(h, { [i]: 'pos' }).totalLR, 1, `${h.id}/${t.name}`);
      assert.equal(calcLRScore(h, { [i]: 'neg' }).totalLR, 1, `${h.id}/${t.name}`);
    });
  });
});

test('tobillo y pie: todas las hipótesis se alcanzan desde el árbol', () => {
  const alcanzadas = new Set(CIF_TREES.tobillo_pie.steps.flatMap(s => s.options.flatMap(o => o.hypothesis)));
  const sinRama = Object.values(HYPOTHESES).filter(h => h.region === 'tobillo_pie' && !alcanzadas.has(h.id)).map(h => h.id);
  assert.deepEqual(sinRama, []);
});

// ── data/ por regiones ────────────────────────────────────────────────────────
console.log('\ndata/ por regiones');
const REGION_MODS = {};
for (const r of VALID_REGIONS) REGION_MODS[r] = await import(`../../data/${r}.js`);

test('cada data/<region>.js exporta screening, tree y hypotheses, y data.js los reúne', () => {
  for (const [r, m] of Object.entries(REGION_MODS)) {
    assert.equal(SYSTEMIC_SCREENING[r], m.screening, r);
    assert.equal(CIF_TREES[r], m.tree, r);
    Object.keys(m.hypotheses).forEach(id => assert.equal(HYPOTHESES[id], m.hypotheses[id], `${r}/${id}`));
  }
});

test('ningún id de hipótesis se repite entre regiones (se sobrescribiría sin aviso)', () => {
  const total = Object.values(REGION_MODS).reduce((n, m) => n + Object.keys(m.hypotheses).length, 0);
  assert.equal(Object.keys(HYPOTHESES).length, total);
});

test('cada hipótesis está en el archivo de su región', () => {
  for (const [r, m] of Object.entries(REGION_MODS)) {
    Object.values(m.hypotheses).forEach(h => assert.equal(h.region, r, h.id));
  }
});


test('dosisFuente solo acompaña a una dosis escrita (nunca cita algo vacío)', () => {
  for (const h of Object.values(HYPOTHESES)) {
    if (h.dosisFuente !== undefined) {
      assert.ok(typeof h.dosisFuente === 'string' && h.dosisFuente.trim(), `${h.id}: dosisFuente vacía`);
      assert.ok(h.dosis && h.dosis.trim(), `${h.id}: dosisFuente sin dosis`);
    }
  }
});

test('hipótesis de derivación: texto fijo, sin fuente, y solo las decididas', () => {
  const derivar = Object.values(HYPOTHESES).filter(h => h.dosis === DOSIS_DERIVAR).map(h => h.id).sort();
  assert.deepEqual(derivar, ['ce8', 'co12', 'co14', 'co7', 'h11', 'ro11', 'tp17', 'tp3', 'tp30', 'tp35', 'tp37', 'tp4', 'tp5', 'tp6']);
  derivar.forEach(id => assert.ok(!HYPOTHESES[id].dosisFuente, `${id}: una derivación no lleva fuente de dosis`));
});

// ── Modo breve ────────────────────────────────────────────────────────────────
console.log('\nmodo breve');

const LUMBAR_SIS = SYSTEMIC_SCREENING.lumbar.sistemas.filter(s => !s.soloPosquirurgico && !s.soloHipermovilidad);   // fuera del posquirúrgico no se ve

test('modo completo → sin pendientes, md "completo" y sin campo pe', () => {
  withState({}, () => {
    assert.deepEqual(getPendientesBreve(), []);
    const p = buildPhysiQPayload();
    assert.equal(p.md, 'completo');
    assert.ok(!('pe' in p));
  });
});

test('breve: sistemas con embudo en NO y sin responder salen como pendientes, cada uno en su lista', () => {
  const [a, b, ...resto] = LUMBAR_SIS;
  withState({ modo: 'breve', region: 'lumbar', sistemicoBreve: { [a.id]: 'NO', [b.id]: 'SI' } }, () => {
    const t = getPendientesBreve().map(p => p.texto);
    const embudo = t.find(x => x.startsWith('Cribado sistémico solo por embudo'));
    const sinCribar = t.find(x => x.startsWith('Sistemas sin cribar'));
    assert.ok(embudo.includes(a.nombre) && !embudo.includes(b.nombre), embudo);
    resto.forEach(s => assert.ok(sinCribar.includes(s.nombre), s.nombre));
    assert.ok(!sinCribar.includes(a.nombre) && !sinCribar.includes(b.nombre));
  });
});

test('breve: todos los sistemas con embudo en SÍ → ningún pendiente de cribado', () => {
  const todos = Object.fromEntries(LUMBAR_SIS.map(s => [s.id, 'SI']));
  withState({ modo: 'breve', region: 'lumbar', sistemicoBreve: todos }, () => {
    assert.ok(!getPendientesBreve().some(p => p.fase === 2));
  });
});

test('breve: irritabilidad directa → pendiente y payload «(estimada)»', () => {
  withState({ modo: 'breve', irritabilidadDirecta: true, irritabilidadNivel: 'Alta' }, () => {
    assert.ok(getPendientesBreve().some(p => p.fase === 3));
    assert.equal(buildPhysiQPayload().ir, 'Alta (estimada)');
  });
});

test('breve: hipótesis sin ningún test pos/neg → pendiente de confirmación; con uno hecho, no', () => {
  withState({ modo: 'breve', testResults: { h2: { 0: 'nd', 1: 'nd' } } }, () => {
    assert.ok(getPendientesBreve().some(p => p.fase === '4b'));
  });
  withState({ modo: 'breve', testResults: { h2: { 0: 'pos' } } }, () => {
    assert.ok(!getPendientesBreve().some(p => p.fase === '4b'));
  });
});

test('breve: notas, informe y payload llevan la línea de valoración no exhaustiva; completo, no', () => {
  const marca = 'Valoración inicial breve';
  withState({ modo: 'breve', testResults: { h2: {} } }, () => {
    const p = buildPhysiQPayload();
    assert.equal(p.md, 'breve');
    assert.ok(Array.isArray(p.pe) && p.pe.length > 0);
    assert.ok(buildContextSummaryText().includes(marca));
    const inf = buildInformeFisioterapiaText();
    assert.ok(inf.includes(marca));
    assert.ok(inf.includes('IMPRESIÓN CLÍNICA (hipótesis de trabajo, pendiente de confirmar)'));
  });
  withState({}, () => {
    assert.ok(!buildContextSummaryText().includes(marca));
    assert.ok(!buildInformeFisioterapiaText().includes(marca));
  });
});

test('embudo: toda pregunta con `urgencia` lleva sq2-urg (el CSS nunca la pliega) y ninguna otra', () => {
  for (const [region, data] of Object.entries(SYSTEMIC_SCREENING)) {
    for (const sis of data.sistemas) {
      const html = buildSistemaHTML(sis);
      // El sistema de hipermovilidad (Fase P) no tiene embudo: sus preguntas se hacen siempre
      assert.equal(html.includes(`data-embudo="${sis.id}"`), !sis.soloHipermovilidad, `${region}/${sis.id} embudo`);
      for (const q of sis.preguntas) {
        const m = html.match(new RegExp(`<div class="(sq2[^"]*)" id="sq2_${q.id}"`));
        assert.ok(m, `${region}/${q.id} no renderizada`);
        assert.equal(m[1].split(' ').includes('sq2-urg'), !!q.urgencia, `${region}/${q.id}`);
      }
    }
  }
});

test('testPuntua: LR útil sí; hallazgo, pronóstico y cluster sin regla útil, no', () => {
  assert.equal(testPuntua({}, { lr_pos: '6' }), true);
  assert.equal(testPuntua({}, { lr_neg: '0.2' }), true);
  assert.equal(testPuntua({}, { lr_pos: '1.2', lr_neg: '0.9' }), false);
  assert.equal(testPuntua({}, { lr_pos: '6', tipo: 'pronostico' }), false);
  assert.equal(testPuntua({ clusters: { c: { lr_pos: '4' } } }, { cluster: 'c' }), true);
  assert.equal(testPuntua({ clusters: { c: { lr_pos: '1.1' } } }, { cluster: 'c' }), false);
});

test('testPuntua coincide con calcLRScore: un test que no puntúa nunca cambia totalLR', () => {
  for (const hyp of Object.values(HYPOTHESES)) {
    hyp.tests.forEach((t, i) => {
      if (testPuntua(hyp, t) || t.cluster) return;
      for (const r of ['pos', 'neg']) {
        assert.equal(calcLRScore(hyp, { [i]: r }).totalLR, 1, `${hyp.id}[${i}] ${r}`);
      }
    });
  }
});
