// Disautonomía / POTS (Fase P, docs/pots.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, buildPhysiQPayload, buildInformeFisioterapiaText,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML, sistemasActivos, withState, VALID_REGIONS } from './comun.mjs';
const D = await import('../../lib/disautonomia.js');
const IN = await import('../../lib/informe-narrativo.js');
const P = await import('../../lib/plan-tratamiento.js');
const PD = await import('../../data/plan-tratamiento.js');
const { notaDsPasoHTML } = await import('../../phase4.js');
const SIS_DISAUTONOMIA_MOD = await import('../../data/comun.js');
const { SIS_DISAUTONOMIA } = SIS_DISAUTONOMIA_MOD;

console.log('\ndisautonomía / POTS (Fase P)');

const ds = (extra = {}) => ({ disautonomia: { ...D.disautonomiaVacia(), ...extra } });
const URG = ['ds_u_esfuerzo', 'ds_u_tumbado', 'ds_u_corazon', 'ds_u_familia'];
// Prueba: tumbado y los 5 minutos de pie a partir de listas de FC (y TAS)
const prueba = (fc0, fcs, { tas0 = 120, tas = [], sint = [] } = {}) => {
  const b = { ...D.pruebaVacia(), tumbado: { fc: fc0, tas: tas0, tad: 75 } };
  DS_MIN.forEach((m, i) => { b[`m${m}`] = { fc: fcs[i], tas: tas[i] ?? tas0, tad: 75, ...(sint[i] ? { sintomas: true } : {}) }; });
  return b;
};
const DS_MIN = D.DS.prueba.minutos;

test('sistema común: la misma instancia en las 7 regiones, tras el de hipermovilidad, oculto sin la tarjeta', () => {
  assert.deepEqual(DS_MIN, [1, 3, 5, 8, 10]);
  for (const r of VALID_REGIONS) {
    const sis = SYSTEMIC_SCREENING[r].sistemas;
    assert.ok(sis.includes(SIS_DISAUTONOMIA), r);
    assert.equal(sis.indexOf(SIS_DISAUTONOMIA), sis.findIndex(s => s.soloHipermovilidad) + 1, `${r}: justo después de hipermovilidad`);
    withState({ region: r, ...ds() }, () => assert.ok(!sistemasActivos().some(s => s.soloDisautonomia), `${r}: sin estado no se ve`));
    withState({ region: r, ...ds({ estado: 'sospecha' }) }, () => assert.ok(sistemasActivos().some(s => s.soloDisautonomia), `${r}: con la sospecha se ve`));
  }
});

test('urgencias: las 4 del síncope con `urgencia`, sin plegar (sq2-urg), con los dos estados; la paroxística con `derivacion`', () => {
  assert.deepEqual(SIS_DISAUTONOMIA.preguntas.filter(q => q.urgencia).map(q => q.id), URG);
  const parox = SIS_DISAUTONOMIA.preguntas.find(q => q.id === 'ds_d_paroxistica');
  assert.ok(parox.derivacion && !parox.urgencia);
  for (const estado of ['sospecha', 'diagnosticada']) {
    withState({ ...ds({ estado }), region: 'lumbar' }, () => {
      const sis = sistemasActivos().find(s => s.soloDisautonomia);
      assert.deepEqual(sis.preguntas.map(q => q.id), [...URG, 'ds_d_paroxistica'], estado);
      const html = buildSistemaHTML(sis);
      URG.forEach(id => assert.match(html, new RegExp(`class="sq2[^"]*sq2-urg[^"]*" id="sq2_${id}"`), id));
      assert.ok(!html.includes('data-embudo='), 'sin embudo');
      assert.ok(html.includes('data-ds-bloque'));
      assert.ok(html.indexOf('data-ds-bloque') > html.indexOf('sq2_ds_d_paroxistica'), 'la sospecha y la prueba, después de las preguntas');
    });
  }
  withState({ ...ds({ estado: 'sospecha' }), region: 'lumbar', sistemicoAnswers: { ds_u_esfuerzo: 'SI', ds_d_paroxistica: 'SI' } }, () => {
    const p = buildPhysiQPayload();
    assert.deepEqual(p.ur, [SIS_DISAUTONOMIA.preguntas[0].urgencia]);
    assert.ok(p.dv.includes(SIS_DISAUTONOMIA.preguntas[4].derivacion));
  });
  withState({ ...ds(), region: 'lumbar', sistemicoAnswers: { ds_u_esfuerzo: 'SI' } }, () => {
    assert.deepEqual(buildPhysiQPayload().ur, [], 'sin la tarjeta activa, una respuesta guardada no cuenta');
  });
  // Las banderas enlazan sus preguntas (Fase M)
  assert.deepEqual(SIS_DISAUTONOMIA.banderasRojas.map(f => f.pregunta), URG);
  assert.deepEqual(SIS_DISAUTONOMIA.banderasAmarillas.map(f => f.pregunta), ['ds_d_paroxistica']);
});

test('seguridad: marcar la tarjeta nunca quita ni rebaja una urgencia de otro sistema', () => {
  for (const r of VALID_REGIONS) {
    const urgentes = SYSTEMIC_SCREENING[r].sistemas.filter(s => !s.soloDisautonomia && !s.soloPosquirurgico && !s.soloHipermovilidad)
      .flatMap(s => s.preguntas).filter(q => q.urgencia);
    const respuestas = Object.fromEntries(urgentes.map(q => [q.id, 'SI']));
    let sin, con, htmlSin, htmlCon;
    withState({ region: r, ...ds(), sistemicoAnswers: respuestas }, () => {
      sin = buildPhysiQPayload().ur;
      htmlSin = sistemasActivos().filter(s => !s.soloDisautonomia).map(s => buildSistemaHTML(s)).join('');
    });
    withState({ region: r, ...ds({ estado: 'sospecha' }), sistemicoAnswers: respuestas }, () => {
      con = buildPhysiQPayload().ur;
      htmlCon = sistemasActivos().filter(s => !s.soloDisautonomia).map(s => buildSistemaHTML(s)).join('');
    });
    assert.deepEqual(con, sin, `${r}: mismas urgencias`);
    assert.equal(htmlCon, htmlSin, `${r}: los demás sistemas se pintan igual`);
  }
});

test('sx_sincope (decisión 9): la misma pregunta urgente en el sistema vascular o cardiovascular de las 7 regiones, sin la tarjeta y con ella', () => {
  const { PREGUNTA_SINCOPE } = SIS_DISAUTONOMIA_MOD;
  const HOST = { lumbar: 'l_vascular', cervical: 'cv_cardio', hombro: 'h_cardio', codo: 'co_vascular', cadera: 'ca_vascular', rodilla: 'ro_vascular', tobillo_pie: 'tp_vascular' };
  assert.ok(PREGUNTA_SINCOPE.urgencia && !PREGUNTA_SINCOPE.derivacion);
  for (const r of VALID_REGIONS) {
    const sis = SYSTEMIC_SCREENING[r].sistemas.filter(s => s.preguntas.includes(PREGUNTA_SINCOPE));
    assert.deepEqual(sis.map(s => s.id), [HOST[r]], `${r}: una sola vez, en su sistema vascular o cardiovascular`);
    for (const extra of [ds(), ds({ estado: 'sospecha' })]) {
      withState({ region: r, ...extra, sistemicoAnswers: { sx_sincope: 'SI' } }, () => {
        const activo = sistemasActivos().find(s => s.id === HOST[r]);
        assert.ok(activo.preguntas.includes(PREGUNTA_SINCOPE), `${r}: se ve`);
        assert.match(buildSistemaHTML(activo), /class="sq2[^"]*sq2-urg[^"]*" id="sq2_sx_sincope"/, `${r}: nunca se pliega`);
        assert.ok(buildPhysiQPayload().ur.includes(PREGUNTA_SINCOPE.urgencia), `${r}: va a ur`);
      });
    }
  }
});

test('patrón de sospecha: solo con «Sospecha»; la tercera (otra causa) no suma', () => {
  assert.deepEqual(D.DS.sospecha.map(q => q.id), ['io1', 'io2', 'io3']);
  const s = { estado: 'sospecha', sospecha: { io1: 'SI', io2: 'NO', io3: 'SI' } };
  assert.equal(D.siSospecha(s), 1);
  assert.equal(D.respondidasSospecha(s), 3);
  assert.ok(D.otraCausa(s));
  assert.ok(D.sospechaVisible(s));
  assert.ok(!D.sospechaVisible({ estado: 'diagnosticada' }));
});

test('prueba: corte por edad (30 adultos, 40 de 12 a 19; sin definir por debajo de 12)', () => {
  assert.equal(D.cortePrueba(null), null);
  assert.ok(D.cortePrueba(11).menor12);
  assert.equal(D.cortePrueba(12).corte, 40);
  assert.equal(D.cortePrueba(19).corte, 40);
  assert.equal(D.cortePrueba(20).corte, 30);
  assert.equal(D.resultadoPrueba(null, 30).estado, 'sin-hacer');
  assert.equal(D.resultadoPrueba(prueba(70, [95, 102, 104, 99, 101]), 10).estado, 'menor12');
  assert.equal(D.resultadoPrueba(prueba(70, [95, 102, 104, 99, 101]), null).estado, 'sin-edad');
});

test('prueba: 2 medidas seguidas después del primer minuto; el primer minuto no cuenta; la última sola pide repetir', () => {
  const r = D.resultadoPrueba(prueba(70, [95, 102, 104, 99, 101], { sint: [0, 1] }), 30);
  assert.equal(r.estado, 'compatible');
  assert.equal(r.dfc, 32);   // min(32, 34) = 32 en 3–5 min
  assert.ok(r.sintomas);
  // Mismas cifras con 16 años: corte 40
  assert.equal(D.resultadoPrueba(prueba(70, [95, 102, 104, 99, 101]), 16).estado, 'no-corte');
  // Solo en el minuto 1: no cuenta (taquicardia inicial)
  assert.equal(D.resultadoPrueba(prueba(70, [110, 90, 92, 91, 90]), 30).estado, 'no-corte');
  // Una medida suelta por encima en medio: no es mantenida
  assert.equal(D.resultadoPrueba(prueba(70, [90, 101, 92, 101, 92]), 30).estado, 'no-corte');
  // Solo la última: repetir 1 min después (Raj 2020)
  assert.equal(D.resultadoPrueba(prueba(70, [85, 90, 92, 95, 102]), 30).estado, 'repetir');
  // Faltan medidas
  const b = prueba(70, [95, null, null, null, 101]);
  assert.equal(D.resultadoPrueba(b, 30).estado, 'repetir');
  assert.equal(D.resultadoPrueba(prueba(null, [95, 102, 104, 99, 101]), 30).estado, 'incompleta');
});

test('prueba: FC de referencia de 60 si la de tumbado es menor (Raj 2020)', () => {
  const r = D.resultadoPrueba(prueba(55, [80, 88, 89, 88, 88]), 30);
  assert.equal(r.referencia, 60);
  assert.equal(r.estado, 'no-corte', '88 − 60 = 28: no llega, aunque 88 − 55 = 33');
  assert.equal(D.resultadoPrueba(prueba(55, [80, 90, 91, 90, 90]), 30).estado, 'compatible');
});

test('prueba: hipotensión ortostática desde el minuto 3 (TAS −20, TAD −10 o TAS < 90); manda sobre el aumento', () => {
  const ho = (tas, tas0 = 120) => D.resultadoPrueba(prueba(70, [95, 102, 104, 99, 101], { tas0, tas }), 30).estado;
  assert.equal(ho([95, 118, 118, 118, 118]), 'compatible', 'una caída solo en el minuto 1 (hipotensión inicial) no excluye el POTS');
  assert.equal(ho([118, 100, 118, 118, 118]), 'ho', 'TAS −20 en el minuto 3');
  assert.equal(ho([110, 110, 110, 110, 89], 105), 'ho', 'TAS por debajo de 90');
  const b = prueba(70, [95, 102, 104, 99, 101]);
  b.m5.tad = 64;
  assert.equal(D.resultadoPrueba(b, 30).estado, 'ho', 'TAD −11');
  const r = D.resultadoPrueba(prueba(105, [130, 140, 140, 140, 140], { tas0: 85 }), 30);
  assert.ok(r.reposoAlta && r.tasBaja, 'FC tumbado > 100 y TAS tumbado < 90');
});

test('payload `ds`: solo con la tarjeta activa; con sus datos', () => {
  withState({ ...ds() }, () => assert.ok(!('ds' in buildPhysiQPayload()), 'sin estado, el payload no cambia'));
  withState({ ...ds({ estado: 'sospecha', sospecha: { io1: 'SI', io2: 'SI' }, bipedestacion: prueba(70, [95, 102, 104, 99, 101]) }), edadPaciente: 30 }, () => {
    assert.deepEqual(buildPhysiQPayload().ds, { es: 'sospecha', ti: '', pb: true, dfc: 32, ho: false, ot: true, cs: 2 });
  });
  withState({ ...ds({ estado: 'diagnosticada', tipo: 'pots' }) }, () => {
    assert.deepEqual(buildPhysiQPayload().ds, { es: 'diagnosticada', ti: 'pots', pb: false, dfc: null, ho: null, ot: null, cs: null });
  });
  withState({ ...ds({ estado: 'diagnosticada' }) }, () => assert.equal(buildPhysiQPayload().ds.ti, 'otra'));
  // Las cifras de cada minuto nunca van al payload
  withState({ ...ds({ estado: 'sospecha', bipedestacion: prueba(70, [95, 102, 104, 99, 101]) }), edadPaciente: 30 }, () => {
    assert.ok(!JSON.stringify(buildPhysiQPayload()).includes('"m10"'));
  });
});

test('📋 Notas, 📄 Informe (sin la palabra POTS con la sospecha) e informe con IA', () => {
  withState({ ...ds({ estado: 'sospecha', bipedestacion: prueba(70, [95, 102, 104, 99, 101]) }), edadPaciente: 30 }, () => {
    const n = buildContextSummaryText(), i = buildInformeFisioterapiaText();
    assert.match(n, /🫀 DISAUTONOMÍA: sospecha · bipedestación activa: aumento de la FC de 32 lpm mantenido, sin hipotensión ortostática/);
    assert.match(i, /RESPUESTA AL PONERSE DE PIE\n  · Aumento de la frecuencia cardiaca al ponerse de pie: se recomienda valoración médica\./);
    assert.ok(!/POTS|taquicardia postural/i.test(i), 'con la sospecha, el informe no nombra el POTS');
    const ctx = IN.contextoValoracion(buildPhysiQPayload());
    assert.ok(ctx.includes('Disautonomía (condición especial marcada por el fisioterapeuta):'));
    assert.ok(ctx.includes('no escribas que el paciente tiene un POTS'));
    assert.ok(!/Raj|Hakim|Brignole|NICE|Sheldon|Vernino/.test(ctx), 'el prompt no lleva las fuentes');
  });
  withState({ ...ds({ estado: 'diagnosticada', tipo: 'pots' }) }, () => {
    assert.match(buildInformeFisioterapiaText(), /DISAUTONOMÍA\n  · Síndrome de taquicardia postural ortostática \(diagnosticado\)\./);
  });
  withState({ ...ds({ estado: 'diagnosticada', tipo: 'ho' }) }, () => {
    assert.ok(!D.lineasRecomendacionDs(buildPhysiQPayload().ds).includes(D.DS.textos.ejercicio), 'con hipotensión ortostática, sin la pauta del POTS');
  });
  withState({ ...ds() }, () => {
    assert.ok(!buildContextSummaryText().includes('DISAUTONOMÍA'));
    assert.ok(!buildInformeFisioterapiaText().includes('PONERSE DE PIE'));
  });
  // Cifras de cada medida: solo en los datos ampliados del prompt
  const a = IN.bloquesAmpliados({ bipedestacion: D.medidasPruebaTexto(prueba(70, [95, 102, 104, 99, 101], { sint: [0, 1] })) }).join('\n');
  assert.ok(a.includes('Tumbado: FC 70 lpm, TA 120/75 mmHg · De pie 1 min: FC 95 lpm') && a.includes('De pie 3 min: FC 102 lpm, TA 120/75 mmHg (con síntomas)'));
  assert.equal(D.medidasPruebaTexto(null), '');
});

test('fases 3, 4 y 4b: notas solo con la tarjeta; el árbol solo en el paso del mareo de cervical', () => {
  assert.ok(leer('index.html').includes('id="dsNotaTolerancia"'));
  withState({ ...ds({ estado: 'sospecha' }), region: 'cervical' }, () => {
    assert.ok(notaDsPasoHTML('ce_step4b').includes('intolerancia ortostática'));
    assert.equal(notaDsPasoHTML('ce_step1'), '');
  });
  withState({ ...ds(), region: 'cervical' }, () => assert.equal(notaDsPasoHTML('ce_step4b'), ''));
  // Ninguna nota llega a lo que se comparte
  withState({ ...ds({ estado: 'sospecha' }) }, () => {
    for (const k of ['tecnica4b', 'mareoCervical', 'tolerancia']) {
      const frag = D.DS.textos[k].slice(0, 40);
      assert.ok(!JSON.stringify(buildPhysiQPayload()).includes(frag) && !buildContextSummaryText().includes(frag), k);
    }
  });
});

test('fase 6: aviso y red de seguridad del síncope con la tarjeta; con hipermovilidad, la adaptación', () => {
  const hs = [{ id: 'x', name: 'X', pauta: 'P.', derivar: false, tratada: false }];
  const base = { region: 'lumbar', hipotesis: hs, elegidas: ['x'], severidad: 5, irritabilidadNivel: 'Moderada', irritabilidad: {} };
  const sin = P.construirPlan(base);
  assert.ok(!sin.avisosHip.includes(PD.AVISOS.disautonomia));
  assert.ok(!sin.sesion.cierre.includes(PD.TEXTOS_SESION.cierreSincope));
  const con = P.construirPlan({ ...base, disautonomia: true });
  assert.ok(con.avisosHip.includes(PD.AVISOS.disautonomia));
  assert.ok(!con.avisosHip.includes(PD.AVISOS.disautonomiaHM));
  assert.ok(con.sesion.cierre.includes(PD.TEXTOS_SESION.cierreSincope));
  assert.ok(con.alarmasCasa.includes(PD.TEXTOS_CASA.alarmaSincope.texto));
  assert.ok(P.construirPlan({ ...base, disautonomia: true, hipermovilidad: true }).avisosHip.includes(PD.AVISOS.disautonomiaHM));
  assert.ok(!P.construirPlan({ ...base, hipermovilidad: true }).avisosHip.includes(PD.AVISOS.disautonomiaHM));
});

test('modo breve: la prueba sin hacer con la sospecha es un pendiente; el sistema no tiene embudo', () => {
  withState({ ...ds({ estado: 'sospecha' }), modo: 'breve', region: 'lumbar' }, () => {
    const t = getPendientesBreve().map(p => p.texto);
    assert.ok(t.includes('Prueba de bipedestación sin hacer (sospecha de disautonomía)'));
    assert.ok(!t.some(x => x.includes('Disautonomía')), 'no sale como sistema sin cribar');
  });
  withState({ ...ds({ estado: 'diagnosticada' }), modo: 'breve', region: 'lumbar' }, () => {
    assert.ok(!getPendientesBreve().some(p => p.texto.startsWith('Prueba de bipedestación')), 'diagnosticada: la prueba es opcional');
  });
});

test('normalizar: sesiones anteriores y valores raros', () => {
  assert.deepEqual(D.normalizarDisautonomia(undefined), D.disautonomiaVacia());
  assert.deepEqual(D.normalizarDisautonomia({ estado: 'x', tipo: 'y', sospecha: 3, bipedestacion: 5 }), D.disautonomiaVacia());
  const n = D.normalizarDisautonomia({ estado: 'sospecha', bipedestacion: { tumbado: { fc: 70 } } });
  assert.equal(n.bipedestacion.tumbado.fc, 70);
  assert.deepEqual(n.bipedestacion.m10, {});
});

test('se despliega: lib/disautonomia.js en deploy-to-hub.yml', () => {
  assert.ok(leer('.github', 'workflows', 'deploy-to-hub.yml').includes('lib/disautonomia.js'));
});

// physiq-report (lib/payload.js, _bloqueDs) lleva una copia de bloqueDsIA() y
// su test fija estos mismos textos: si cambian aquí, se copian allí (casos y
// textos) y en su _TEXTOS_DS.
export const DS_CASOS = {
  sospecha: [{ es: 'sospecha', ti: '', pb: true, dfc: 32, ho: false, ot: true, cs: 2 },
    'Disautonomía (condición especial marcada por el fisioterapeuta):\n  · Estado: sospecha\n  · Prueba de bipedestación activa: aumento de la FC de 32 lpm mantenido, sin hipotensión ortostática (compatible con taquicardia ortostática)\n  · Patrón de intolerancia ortostática: 2 de 2 «sí»\n  · Es una sospecha: no escribas que el paciente tiene un POTS; el diagnóstico es médico.\n  · Consideraciones para el plan: Ejercicio regular, al principio semirreclinado (remo, bicicleta reclinada, natación) y lo vertical poco a poco; al menos 4 días por semana, sesiones de al menos 30 min. La mejoría puede tardar 4–6 semanas y al principio puede encontrarse peor. Mejor ejercicio dinámico que isométrico (el isométrico provoca maniobras de Valsalva que bajan la tensión), no comer en la hora anterior y terminar con una vuelta a la calma suave. Aumento de la FC al ponerse de pie sin hipotensión ortostática: derivación preferente a su médico de atención primaria para confirmar el diagnóstico y descartar otras causas. Un desmayo durante el esfuerzo, tumbado, tras palpitaciones bruscas o con síntomas del corazón no lo explica la disautonomía: valoración médica urgente. El agua, la sal, las prendas de compresión y los fármacos los indica el médico.'],
  ho: [{ es: 'sospecha', ti: '', pb: true, dfc: null, ho: true, ot: false, cs: null },
    'Disautonomía (condición especial marcada por el fisioterapeuta):\n  · Estado: sospecha\n  · Prueba de bipedestación activa: caída de la tensión (hipotensión ortostática)\n  · Es una sospecha: no escribas que el paciente tiene un POTS; el diagnóstico es médico.\n  · Consideraciones para el plan: Ejercicio regular, al principio semirreclinado (remo, bicicleta reclinada, natación) y lo vertical poco a poco; al menos 4 días por semana, sesiones de al menos 30 min. La mejoría puede tardar 4–6 semanas y al principio puede encontrarse peor. Mejor ejercicio dinámico que isométrico (el isométrico provoca maniobras de Valsalva que bajan la tensión), no comer en la hora anterior y terminar con una vuelta a la calma suave. Caída de la tensión al ponerse de pie: hipotensión ortostática, no un POTS. Valoración médica, con revisión de los fármacos. Un desmayo durante el esfuerzo, tumbado, tras palpitaciones bruscas o con síntomas del corazón no lo explica la disautonomía: valoración médica urgente. El agua, la sal, las prendas de compresión y los fármacos los indica el médico.'],
  pots: [{ es: 'diagnosticada', ti: 'pots', pb: false, dfc: null, ho: null, ot: null, cs: null },
    'Disautonomía (condición especial marcada por el fisioterapeuta):\n  · Estado: diagnosticada (POTS)\n  · Consideraciones para el plan: Ejercicio regular, al principio semirreclinado (remo, bicicleta reclinada, natación) y lo vertical poco a poco; al menos 4 días por semana, sesiones de al menos 30 min. La mejoría puede tardar 4–6 semanas y al principio puede encontrarse peor. Mejor ejercicio dinámico que isométrico (el isométrico provoca maniobras de Valsalva que bajan la tensión), no comer en la hora anterior y terminar con una vuelta a la calma suave. Un desmayo durante el esfuerzo, tumbado, tras palpitaciones bruscas o con síntomas del corazón no lo explica la disautonomía: valoración médica urgente. El agua, la sal, las prendas de compresión y los fármacos los indica el médico.'],
  diagHO: [{ es: 'diagnosticada', ti: 'ho', pb: true, dfc: 12, ho: false, ot: false, cs: null },
    'Disautonomía (condición especial marcada por el fisioterapeuta):\n  · Estado: diagnosticada (hipotensión ortostática)\n  · Prueba de bipedestación activa: no llega al corte (aumento mantenido de 12 lpm)\n  · Consideraciones para el plan: Mejor ejercicio dinámico que isométrico (el isométrico provoca maniobras de Valsalva que bajan la tensión), no comer en la hora anterior y terminar con una vuelta a la calma suave. Un desmayo durante el esfuerzo, tumbado, tras palpitaciones bruscas o con síntomas del corazón no lo explica la disautonomía: valoración médica urgente. El agua, la sal, las prendas de compresión y los fármacos los indica el médico.'],
};
test('bloqueDsIA: el texto que physiq-report copia, literal', () => {
  for (const [k, [d, esperado]] of Object.entries(DS_CASOS)) assert.equal(D.bloqueDsIA(d), esperado, k);
});

// ── Reloj de la prueba (docs/pots.md, «Reloj») ───────────────
test('reloj: reposo de 5 min, luego la fila de tumbado', () => {
  const r = { fase: 'reposo', inicio: 1_000_000, tomas: {} };
  assert.equal(D.estadoReloj(null, 0), null);
  const a = D.estadoReloj(r, r.inicio + 125_000);
  assert.equal(a.cumplido, false); assert.equal(a.restante, 175); assert.equal(a.fila, null); assert.equal(a.marcas, 0);
  const b = D.estadoReloj(r, r.inicio + 300_000);
  assert.equal(b.cumplido, true); assert.equal(b.fila, 'tumbado'); assert.equal(b.marcas, 1);
  assert.equal(D.textoTiempo(125), '2:05'); assert.equal(D.textoTiempo(-3), '0:00');
});

test('reloj: de pie, la fila que toca va del minuto de medida al siguiente', () => {
  const r = { fase: 'pie', inicio: 0, tomas: {} };
  const en = s => D.estadoReloj(r, s * 1000);
  assert.equal(en(30).fila, null); assert.deepEqual([en(30).proxima.fila, en(30).proxima.en], ['m1', 30]); assert.equal(en(30).marcas, 0);
  assert.equal(en(60).fila, 'm1'); assert.equal(en(60).marcas, 1);
  assert.equal(en(179).fila, 'm1'); assert.equal(en(180).fila, 'm3'); assert.equal(en(180).proxima.fila, 'm5');
  assert.equal(en(479).fila, 'm5'); assert.equal(en(480).fila, 'm8');
  assert.equal(en(600).fila, 'm10'); assert.equal(en(600).proxima, null); assert.equal(en(600).marcas, 5); assert.equal(en(600).terminado, false);
  assert.equal(en(660).terminado, true); assert.equal(en(660).fila, null);
  // Un reloj de hace más de 30 min ya no es de esta prueba
  assert.equal(en(31 * 60).caducado, true);
  // El tiempo sale de `inicio`: una pantalla apagada no lo desajusta
  assert.equal(D.estadoReloj(r, 245_500).s, 245.5);
});

test('reloj: una toma se señala solo si está a más de 30 s de su minuto', () => {
  assert.equal(D.tomaFueraDeTiempo('m3', 200), null);
  assert.equal(D.tomaFueraDeTiempo('m3', 210), null);
  assert.equal(D.tomaFueraDeTiempo('m3', 220), 220);
  assert.equal(D.tomaFueraDeTiempo('m3', 140), 140);
  assert.equal(D.tomaFueraDeTiempo('tumbado', 500), null);
  assert.equal(D.tomaFueraDeTiempo('m3', undefined), null);
});

test('reloj: no cambia el payload, los resúmenes ni las cifras del informe con IA', () => {
  const sinReloj = prueba(70, [95, 102, 104, 99, 101], { sint: [0, 1] });
  const conReloj = { ...sinReloj, reloj: { fase: 'pie', inicio: Date.now() - 200_000, tomas: { m1: 75, m3: 220 } } };
  const base = { edadPaciente: 30, region: 'lumbar', patient: 'X' };
  const salida = b => withState({ ...base, ...ds({ estado: 'sospecha', bipedestacion: b }) }, () => {
    const p = buildPhysiQPayload(); delete p.d;
    return JSON.stringify([p, buildContextSummaryText().replace(/\d{1,2}\/\d{1,2}\/\d{4}/g, ''), buildInformeFisioterapiaText().replace(/\d{1,2}\/\d{1,2}\/\d{4}/g, ''), D.medidasPruebaTexto(b)]);
  });
  assert.equal(salida(conReloj), salida(sinReloj));
  // y la normalización de sesiones lo conserva
  assert.deepEqual(D.normalizarDisautonomia({ estado: 'sospecha', bipedestacion: conReloj }).bipedestacion.reloj, conReloj.reloj);
});

test('reloj: botones en window y fuera de la impresión', () => {
  assert.equal(typeof globalThis.dsRelojEmpezar, 'function');
  assert.equal(typeof globalThis.dsRelojParar, 'function');
  assert.match(leer('styles.css'), /@media print \{ \.ds-reloj \{ display: none; \} \}/);
});
