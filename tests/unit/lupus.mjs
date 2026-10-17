// Lupus eritematoso sistémico (Fase P, docs/lupus.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, buildPhysiQPayload, buildInformeFisioterapiaText,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML, sistemasActivos, withState, VALID_REGIONS } from './comun.mjs';
const L = await import('../../lib/lupus.js');
const IN = await import('../../lib/informe-narrativo.js');
const P = await import('../../lib/plan-tratamiento.js');
const PD = await import('../../data/plan-tratamiento.js');
const { SIS_LUPUS } = await import('../../data/comun.js');

console.log('\nlupus (Fase P)');

const les = (extra = {}) => ({ lupus: { ...L.lupusVacio(), ...extra } });
const URG = ['les_u_fiebre', 'les_u_tvp', 'les_u_tep_ictus', 'les_u_pecho', 'les_u_dedos', 'les_u_neuro'];
const DER = ['les_d_osteonecrosis', 'les_d_debilidad', 'les_d_brote', 'les_d_rinon'];
// Todas las filas de la tarjeta marcadas, para probar que no cambian la seguridad
const COMPLETO = { estado: 'diagnosticado', corticoides: 'a', dosisAltas: 'SI', inmunosupresores: 'SI', antifosfolipidos: 'saf',
  antitrombotico: true, osteonecrosis: true, raynaud: true, actividad: 'brote' };

test('sistema común: la misma instancia en las 7 regiones, tras el de disautonomía, oculto sin la tarjeta', () => {
  for (const r of VALID_REGIONS) {
    const sis = SYSTEMIC_SCREENING[r].sistemas;
    assert.ok(sis.includes(SIS_LUPUS), r);
    assert.equal(sis.indexOf(SIS_LUPUS), sis.findIndex(s => s.soloDisautonomia) + 1, `${r}: justo después de disautonomía`);
    withState({ region: r, ...les() }, () => assert.ok(!sistemasActivos().some(s => s.soloLupus), `${r}: sin estado no se ve`));
    for (const estado of ['diagnosticado', 'sospecha']) {
      withState({ region: r, ...les({ estado }) }, () => assert.ok(sistemasActivos().some(s => s.soloLupus), `${r}: con ${estado} se ve`));
    }
  }
});

test('«Diagnosticado»: 6 urgencias sin plegar (sq2-urg), 4 derivaciones, sin embudo; banderas enlazadas a su pregunta', () => {
  assert.deepEqual(SIS_LUPUS.preguntas.filter(q => q.urgencia).map(q => q.id), URG);
  assert.deepEqual(SIS_LUPUS.preguntas.filter(q => q.derivacion).map(q => q.id), DER);
  SIS_LUPUS.preguntas.forEach(q => {
    assert.ok(!(q.urgencia && q.derivacion), q.id);
    assert.equal(q.les, 'diagnosticado', q.id);
    assert.ok(q.razonamiento?.porque && q.razonamiento?.peso && q.razonamiento?.fuentes?.length, `${q.id}: razonamiento`);
    assert.ok(!q.anatomia, `${q.id}: sistema compartido, sin Kenhub`);
  });
  assert.deepEqual(SIS_LUPUS.banderasRojas.map(f => f.pregunta), URG);
  assert.deepEqual(SIS_LUPUS.banderasAmarillas.map(f => f.pregunta), DER);
  withState({ ...les({ estado: 'diagnosticado' }), region: 'lumbar' }, () => {
    const sis = sistemasActivos().find(s => s.soloLupus);
    assert.deepEqual(sis.preguntas.map(q => q.id), [...URG, ...DER]);
    const html = buildSistemaHTML(sis);
    URG.forEach(id => assert.match(html, new RegExp(`class="sq2[^"]*sq2-urg[^"]*" id="sq2_${id}"`), id));
    DER.forEach(id => assert.ok(!new RegExp(`class="sq2[^"]*sq2-urg[^"]*" id="sq2_${id}"`).test(html), id));
    assert.ok(!html.includes('data-embudo='), 'sin embudo');
  });
});

test('«Sospecha»: sin urgencias ni derivaciones del sistema, solo el bloque de los rasgos', () => {
  withState({ ...les({ estado: 'sospecha' }), region: 'lumbar' }, () => {
    const sis = sistemasActivos().find(s => s.soloLupus);
    assert.deepEqual(sis.preguntas, []);
    assert.deepEqual(sis.banderasRojas, []);
    assert.ok(buildSistemaHTML(sis).includes('data-les-bloque'));
  });
});

test('urgencias y derivaciones: a ur y dv; con cualquier respuesta de los antifosfolípidos; sin la tarjeta, una respuesta guardada no cuenta', () => {
  const resp = { les_u_fiebre: 'SI', les_u_tvp: 'SI', les_d_rinon: 'SI' };
  for (const af of ['', 'no', 'apl', 'saf', 'ns']) {
    withState({ ...les({ estado: 'diagnosticado', antifosfolipidos: af }), region: 'codo', sistemicoAnswers: resp }, () => {
      const p = buildPhysiQPayload();
      assert.deepEqual(p.ur, [SIS_LUPUS.preguntas[0].urgencia, SIS_LUPUS.preguntas[1].urgencia], af);
      assert.ok(p.dv.includes(SIS_LUPUS.preguntas[9].derivacion), af);
    });
  }
  for (const extra of [les(), les({ estado: 'sospecha' })]) {
    withState({ ...extra, region: 'codo', sistemicoAnswers: resp }, () => {
      const p = buildPhysiQPayload();
      assert.deepEqual(p.ur, []);
      assert.ok(!p.dv.includes(SIS_LUPUS.preguntas[9].derivacion));
    });
  }
});

test('seguridad: marcar la tarjeta nunca quita ni rebaja una urgencia de otro sistema', () => {
  for (const r of VALID_REGIONS) {
    const urgentes = SYSTEMIC_SCREENING[r].sistemas.filter(s => !s.soloLupus && !s.soloDisautonomia && !s.soloPosquirurgico && !s.soloHipermovilidad)
      .flatMap(s => s.preguntas).filter(q => q.urgencia);
    const respuestas = Object.fromEntries(urgentes.map(q => [q.id, 'SI']));
    const pinta = () => ({ ur: buildPhysiQPayload().ur, html: sistemasActivos().filter(s => !s.soloLupus).map(s => buildSistemaHTML(s)).join('') });
    let sin;
    withState({ region: r, ...les(), sistemicoAnswers: respuestas }, () => { sin = pinta(); });
    for (const extra of [les({ estado: 'sospecha' }), les(COMPLETO)]) {
      withState({ region: r, ...extra, sistemicoAnswers: respuestas }, () => {
        const con = pinta();
        assert.deepEqual(con.ur, sin.ur, `${r}: mismas urgencias`);
        assert.equal(con.html, sin.html, `${r}: los demás sistemas se pintan igual`);
      });
    }
  }
});

test('rasgos de la sospecha: sin regla de puntos; lr6 (fármaco nuevo) no suma; fiebre de más de 38,3 °C', () => {
  assert.deepEqual(L.LES.rasgos.map(q => q.id), ['lr1', 'lr2', 'lr3', 'lr4', 'lr5', 'lr6']);
  assert.ok(L.LES.rasgos.find(q => q.id === 'lr5').texto.includes('38,3'));
  const s = { estado: 'sospecha', rasgos: { lr1: 'SI', lr2: 'NO', lr6: 'SI' } };
  assert.equal(L.siRasgos(s), 1);
  assert.equal(L.respondidosRasgos(s), 3);
  assert.ok(L.farmacoNuevo(s));
  assert.ok(L.rasgosVisibles(s) && !L.rasgosVisibles({ estado: 'diagnosticado' }));
  assert.deepEqual(L.lineasRecomendacionLES({ es: 'sospecha', rs: 1, fd: false }), [L.LES.textos.derivar]);
  assert.deepEqual(L.lineasRecomendacionLES({ es: 'sospecha', rs: 0, fd: true }), [L.LES.textos.sinRasgos, L.LES.textos.farmaco]);
});

test('payload `le`: solo con la tarjeta activa; con sus datos', () => {
  withState({ ...les() }, () => assert.ok(!('le' in buildPhysiQPayload()), 'sin estado, el payload no cambia'));
  withState({ ...les(COMPLETO) }, () => {
    assert.deepEqual(buildPhysiQPayload().le, { es: 'diagnosticado', gc: 'a', ga: 'si', is: 'si', af: 'saf', at: true, on: true, ry: true, av: 'brote' });
  });
  withState({ ...les({ estado: 'diagnosticado' }) }, () => {
    assert.deepEqual(buildPhysiQPayload().le, { es: 'diagnosticado', gc: null, ga: null, is: null, af: null, at: false, on: false, ry: false, av: null });
  });
  withState({ ...les({ estado: 'sospecha', rasgos: { lr1: 'SI', lr3: 'SI', lr6: 'NO' } }) }, () => {
    assert.deepEqual(buildPhysiQPayload().le, { es: 'sospecha', rs: 2, fd: false });
  });
  withState({ ...les({ estado: 'sospecha' }) }, () => assert.deepEqual(buildPhysiQPayload().le, { es: 'sospecha', rs: null, fd: false }));
});

test('📋 Notas, 📄 Informe (sin la palabra lupus con la sospecha) e informe con IA', () => {
  withState({ ...les(COMPLETO) }, () => {
    assert.match(buildContextSummaryText(), /🦋 LUPUS: diagnosticado · corticoides de más de 20 mg\/día · ha tomado dosis altas/);
    assert.match(buildInformeFisioterapiaText(), /LUPUS ERITEMATOSO SISTÉMICO\n  · Lupus eritematoso sistémico \(diagnosticado\), en tratamiento con corticoides e inmunosupresores\.\n  · Síndrome antifosfolípido\./);
    const ctx = IN.contextoValoracion(buildPhysiQPayload());
    assert.ok(ctx.includes('Lupus (condición especial marcada por el fisioterapeuta):'));
    assert.ok(!/Blaess|Frade|Parodis|Drosos|Gordon|Goodman|Rao y|Yasir|Kaneko|Matthews|Tektonidou|inferencia/.test(ctx), 'el prompt no lleva las fuentes');
  });
  withState({ ...les({ estado: 'sospecha', rasgos: { lr2: 'SI' } }) }, () => {
    const i = buildInformeFisioterapiaText();
    assert.match(i, /RECOMENDACIÓN DE VALORACIÓN MÉDICA\n  · Se recomienda valoración por su médico de atención primaria\./);
    assert.ok(!/lupus|LES\b/i.test(i), 'con la sospecha, el informe no nombra el lupus');
    assert.ok(IN.contextoValoracion(buildPhysiQPayload()).includes('no escribas que el paciente tiene un lupus'));
  });
  withState({ ...les() }, () => {
    assert.ok(!buildContextSummaryText().includes('LUPUS'));
    assert.ok(!buildInformeFisioterapiaText().includes('LUPUS'));
  });
});

test('fases 3 y 4b: notas solo en la pantalla, nunca en lo que se comparte', () => {
  const html = leer('index.html');
  assert.ok(html.includes('id="lesNotaNaturaleza"') && html.includes('id="lesNotaBrote"') && html.includes('id="cardLupus"'));
  assert.ok(leer('phase4b.js').includes('les-nota-4b'));
  withState({ ...les(COMPLETO) }, () => {
    for (const k of ['naturaleza', 'brote3', 'tecnica4b', 'tecnica4bAntitrombotico']) {
      const frag = L.LES.textos[k].slice(0, 40);
      assert.ok(!JSON.stringify(buildPhysiQPayload()).includes(frag) && !buildContextSummaryText().includes(frag) && !buildInformeFisioterapiaText().includes(frag), k);
    }
  });
});

test('fase 6: avisos y red de seguridad (fiebre, TVP e ictus) con «Diagnosticado»; los de brote, antitrombótico y Raynaud, según la tarjeta', () => {
  const hs = [{ id: 'x', name: 'X', pauta: 'P.', derivar: false, tratada: false }];
  const base = { region: 'codo', hipotesis: hs, elegidas: ['x'], severidad: 5, irritabilidadNivel: 'Moderada', irritabilidad: {} };
  const sin = P.construirPlan(base);
  assert.ok(!sin.avisosHip.includes(PD.AVISOS.lupus));
  assert.ok(!sin.sesion.cierre.includes(PD.TEXTOS_SESION.cierreFiebreLupus));
  const con = P.construirPlan({ ...base, lupus: { brote: false, antitrombotico: false, raynaud: false } });
  assert.ok(con.avisosHip.includes(PD.AVISOS.lupus));
  for (const k of ['lupusBrote', 'lupusAntitrombotico', 'lupusRaynaud']) assert.ok(!con.avisosHip.includes(PD.AVISOS[k]), k);
  for (const k of ['cierreFiebreLupus', 'cierreTVP', 'cierreIctusLupus']) assert.ok(con.sesion.cierre.includes(PD.TEXTOS_SESION[k]), k);
  for (const k of ['alarmaFiebreLupus', 'alarmaTVP', 'alarmaIctusLupus']) assert.ok(con.alarmasCasa.includes(PD.TEXTOS_CASA[k].texto), k);
  const todo = P.construirPlan({ ...base, lupus: { brote: true, antitrombotico: true, raynaud: true } });
  for (const k of ['lupusBrote', 'lupusAntitrombotico', 'lupusRaynaud']) assert.ok(todo.avisosHip.includes(PD.AVISOS[k]), k);
  // En rodilla la TVP ya está: no se repite
  const rod = P.construirPlan({ ...base, region: 'rodilla', lupus: { brote: false, antitrombotico: false, raynaud: false } });
  assert.equal(rod.sesion.cierre.filter(t => t === PD.TEXTOS_SESION.cierreTVP).length, 1);
  assert.ok(leer('plan.js').includes('lesDiagnosticado(state.lupus)'));
});

test('modo breve: corticoides sin registrar o rasgos sin preguntar son pendientes; el sistema no tiene embudo', () => {
  withState({ ...les({ estado: 'diagnosticado' }), modo: 'breve', region: 'lumbar' }, () => {
    const t = getPendientesBreve().map(p => p.texto);
    assert.ok(t.includes('Corticoides sin registrar (tarjeta «Lupus (LES)»)'));
    assert.ok(!t.some(x => x.includes('Lupus,') || x.endsWith('Lupus')), 'no sale como sistema sin cribar');
  });
  withState({ ...les({ estado: 'diagnosticado', corticoides: 'no' }), modo: 'breve', region: 'lumbar' }, () => {
    assert.ok(!getPendientesBreve().some(p => p.texto.startsWith('Corticoides')));
  });
  withState({ ...les({ estado: 'sospecha' }), modo: 'breve', region: 'lumbar' }, () => {
    assert.ok(getPendientesBreve().some(p => p.texto === 'Rasgos de la sospecha de lupus sin preguntar'));
  });
  withState({ ...les({ estado: 'diagnosticado' }), modo: 'completo', region: 'lumbar' }, () => assert.deepEqual(getPendientesBreve(), []));
});

test('normalizar: sesiones anteriores y valores raros', () => {
  assert.deepEqual(L.normalizarLupus(undefined), L.lupusVacio());
  assert.deepEqual(L.normalizarLupus({ estado: 'x', corticoides: 'z', antitrombotico: 'sí', rasgos: 3, actividad: 'mal' }), L.lupusVacio());
  assert.equal(L.normalizarLupus({ estado: 'diagnosticado', corticoides: 'b' }).corticoides, 'b');
});

test('se despliega y se expone: lib/lupus.js en deploy-to-hub.yml; funciones de la tarjeta en window', () => {
  assert.ok(leer('.github', 'workflows', 'deploy-to-hub.yml').includes('lib/lupus.js'));
  for (const f of ['selectLESEstado', 'selectLESFila', 'toggleLESCasilla', 'selectLESRasgo']) assert.equal(typeof globalThis[f], 'function', f);
});

// physiq-report (lib/payload.js, _bloqueLES) llevará una copia de bloqueLESIA()
// y su test fijará estos mismos textos: si cambian aquí, se copian allí.
export const LES_CASOS = {
  diagnosticado: [{ es: 'diagnosticado', gc: 'm', ga: 'si', is: 'si', af: 'saf', at: true, on: true, ry: true, av: 'brote' },
    "Lupus (condición especial marcada por el fisioterapeuta):\n  · Estado: diagnosticado\n  · Datos: corticoides de más de 5 hasta 20 mg/día; ha tomado dosis altas (más de 20 mg/día más de 4 semanas); inmunosupresores o biológicos; síndrome antifosfolípido con trombosis previa; anticoagulante o antiagregante; osteonecrosis o artropatía de Jaccoud conocidas; fenómeno de Raynaud; en brote, según su médico\n  · Consideraciones para el plan: Con el lupus inactivo o leve, llegar poco a poco a 150–300 min por semana de intensidad moderada (esfuerzo 5–6 sobre 10) y fuerza al menos 2 días. Sesiones con aeróbico y fuerza, 3–5 por semana; fuerza en 1–3 series de 8–12 repeticiones con 1–3 min de descanso; aeróbico de 20–30 min hasta 50, en tramos de 4 semanas; con calentamiento y vuelta a la calma. Supervisado por un fisioterapeuta. Puede reducir algo la fatiga, y la actividad del lupus probablemente no cambia. Antes de empezar, su médico valora si hay contraindicaciones; antes de ejercicio vigoroso, puede hacer falta un ECG o una prueba de esfuerzo. Con osteonecrosis o artropatía de Jaccoud, que lo valore un especialista antes de empezar. En brote, que su reumatólogo revalore las contraindicaciones antes de seguir; en un brote articular, no cargar las articulaciones inflamadas. Fotoprotección para prevenir brotes: protector solar de amplio espectro UVA y UVB, ropa que cubra, sombrero y gafas de sol, y evitar las horas de más sol. Evitar el ejercicio al sol con un índice UV por encima de 3. Raynaud: al aire libre, guantes o ropa contra el frío; evitar tocar superficies frías y secar bien la piel durante y después del ejercicio. Por lo mismo, cuidado con el frío local en manos y pies. Fiebre o malestar general nuevos: valoración médica hoy; con corticoides puede no haber fiebre. Antifosfolípidos: la actividad física se recomienda también con anticoagulantes. No sugerir suspender el anticoagulante: retirarlo desencadena el síndrome antifosfolípido catastrófico. Riesgo de osteonecrosis: un dolor profundo en carga de cadera, rodilla, hombro o tobillo → valoración médica. Si fuma, dejarlo: el tabaco aumenta la actividad del lupus y el riesgo cardiovascular. Los corticoides, los inmunosupresores y el anticoagulante los ajusta su reumatólogo."],
  diagnosticadoMinimo: [{ es: 'diagnosticado', gc: null, ga: null, is: null, af: null, at: false, on: false, ry: false, av: null },
    "Lupus (condición especial marcada por el fisioterapeuta):\n  · Estado: diagnosticado\n  · Consideraciones para el plan: Con el lupus inactivo o leve, llegar poco a poco a 150–300 min por semana de intensidad moderada (esfuerzo 5–6 sobre 10) y fuerza al menos 2 días. Sesiones con aeróbico y fuerza, 3–5 por semana; fuerza en 1–3 series de 8–12 repeticiones con 1–3 min de descanso; aeróbico de 20–30 min hasta 50, en tramos de 4 semanas; con calentamiento y vuelta a la calma. Supervisado por un fisioterapeuta. Puede reducir algo la fatiga, y la actividad del lupus probablemente no cambia. Antes de empezar, su médico valora si hay contraindicaciones; antes de ejercicio vigoroso, puede hacer falta un ECG o una prueba de esfuerzo. Fotoprotección para prevenir brotes: protector solar de amplio espectro UVA y UVB, ropa que cubra, sombrero y gafas de sol, y evitar las horas de más sol. Evitar el ejercicio al sol con un índice UV por encima de 3. Fiebre o malestar general nuevos: valoración médica hoy; con corticoides puede no haber fiebre. Si fuma, dejarlo: el tabaco aumenta la actividad del lupus y el riesgo cardiovascular. Los corticoides, los inmunosupresores y el anticoagulante los ajusta su reumatólogo."],
  sospecha: [{ es: 'sospecha', rs: 2, fd: true },
    "Lupus (condición especial marcada por el fisioterapeuta):\n  · Estado: sospecha\n  · Rasgos que justifican una valoración médica: 2 de 5 «sí»\n  · Es una sospecha: no escribas que el paciente tiene un lupus; el diagnóstico es médico.\n  · Consideraciones para el plan: Rasgos que pueden corresponder a una enfermedad inflamatoria sistémica: derivación preferente a su médico de atención primaria. El diagnóstico es médico y necesita analítica. Si empezó tras un fármaco nuevo, comentarlo con quien lo recetó."],
  sospechaSinRasgos: [{ es: 'sospecha', rs: 0, fd: false },
    "Lupus (condición especial marcada por el fisioterapeuta):\n  · Estado: sospecha\n  · Rasgos que justifican una valoración médica: 0 de 5 «sí»\n  · Es una sospecha: no escribas que el paciente tiene un lupus; el diagnóstico es médico.\n  · Consideraciones para el plan: Sin rasgos de la lista: la sospecha queda en tu juicio clínico."],
};
test('bloqueLESIA: el texto que physiq-report copiará, literal', () => {
  for (const [k, [d, esperado]] of Object.entries(LES_CASOS)) assert.equal(L.bloqueLESIA(d), esperado, k);
});
