// Osteoporosis o fragilidad ósea (Fase P, docs/osteoporosis.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, HYPOTHESES, buildPhysiQPayload, buildInformeFisioterapiaText,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML, sistemasActivos, withState, VALID_REGIONS } from './comun.mjs';
const O = await import('../../lib/osteoporosis.js');
const IN = await import('../../lib/informe-narrativo.js');
const P = await import('../../lib/plan-tratamiento.js');
const PD = await import('../../data/plan-tratamiento.js');
const { SIS_OSTEOPOROSIS, SIS_MASTOCITOS } = await import('../../data/comun.js');
const { TIEMPOS_TEJIDO } = await import('../../data/tejidos.js');
const { filasPaciente } = await import('../../lib/tejidos.js');

console.log('\nosteoporosis o fragilidad ósea (Fase P)');

const op = (extra = {}) => ({ osteoporosis: { ...O.osteoporosisVacio(), ...extra, caidas: { ...O.caidasVacio(), ...(extra.caidas || {}) } } });
// Todo marcado, para probar que no cambia la seguridad de otros sistemas
const COMPLETO = { estado: 'diagnosticada', causa: 'corticoides', vertebrales: '2', reciente: true, otras: true,
  tratamiento: 'antirresortivo', corticoides: 'a', caidas: { n: '2', lesion: true } };

test('sistema común: la misma instancia en las 7 regiones, tras el de mastocitos, oculto sin la tarjeta', () => {
  for (const r of VALID_REGIONS) {
    const sis = SYSTEMIC_SCREENING[r].sistemas;
    assert.ok(sis.includes(SIS_OSTEOPOROSIS), r);
    assert.equal(sis.indexOf(SIS_OSTEOPOROSIS), sis.indexOf(SIS_MASTOCITOS) + 1, `${r}: justo después de mastocitos`);
    withState({ region: r, ...op() }, () => assert.ok(!sistemasActivos().some(s => s.soloOsteoporosis), `${r}: sin estado no se ve`));
    for (const estado of ['diagnosticada', 'sospecha']) {
      withState({ region: r, ...op({ estado }) }, () => assert.ok(sistemasActivos().some(s => s.soloOsteoporosis), `${r}: ${estado}`));
    }
  }
});

test('tarjeta de la fase 1: «Diagnosticada» y «Sospecha»; las filas solo con «Diagnosticada»', () => {
  const html = leer('index.html');
  const card = html.slice(html.indexOf('id="cardOsteoporosis"'), html.indexOf('id="cardCronologia"'));
  assert.ok(card.includes("selectOPEstado('diagnosticada')") && card.includes("selectOPEstado('sospecha')"));
  for (const [fila, opciones] of Object.entries(O.FILAS_OP)) {
    for (const v of Object.keys(opciones)) assert.ok(card.includes(`selectOPFila('${fila}','${v}')`), `${fila}/${v}`);
  }
  for (const k of O.CASILLAS_OP) assert.ok(card.includes(`toggleOPCasilla('${k}')`), k);
  assert.ok(card.includes('id="opDiagWrap" style="display:none"'));
});

test('fase 2: una urgencia y tres derivaciones; la talla solo sin fractura vertebral conocida y el fémur solo con antirresortivo', () => {
  assert.deepEqual(SIS_OSTEOPOROSIS.preguntas.map(q => q.id), ['op_u_medula', 'op_d_fractura', 'op_d_talla', 'op_d_femur']);
  assert.ok(SIS_OSTEOPOROSIS.preguntas[0].urgencia && !SIS_OSTEOPOROSIS.preguntas[0].derivacion);
  for (const q of SIS_OSTEOPOROSIS.preguntas.slice(1)) assert.ok(q.derivacion && !q.urgencia, q.id);
  const ids = estado => {
    let r;
    withState({ region: 'lumbar', ...op(estado) }, () => { r = sistemasActivos().find(s => s.soloOsteoporosis).preguntas.map(q => q.id); });
    return r;
  };
  assert.deepEqual(ids({ estado: 'sospecha' }), ['op_u_medula', 'op_d_fractura', 'op_d_talla']);
  assert.deepEqual(ids({ estado: 'diagnosticada', vertebrales: '1' }), ['op_u_medula', 'op_d_fractura']);
  assert.deepEqual(ids({ estado: 'diagnosticada', vertebrales: '0', tratamiento: 'antirresortivo' }), ['op_u_medula', 'op_d_fractura', 'op_d_talla', 'op_d_femur']);
  // Cada bandera, enlazada a su pregunta y con la misma visibilidad
  for (const b of [...SIS_OSTEOPOROSIS.banderasRojas, ...SIS_OSTEOPOROSIS.banderasAmarillas]) {
    const q = SIS_OSTEOPOROSIS.preguntas.find(x => x.id === b.pregunta);
    assert.ok(q, b.texto);
    assert.equal(b.op, q.op, b.pregunta);
  }
  withState({ region: 'lumbar', ...op({ estado: 'diagnosticada' }) }, () => {
    const html = buildSistemaHTML(sistemasActivos().find(s => s.soloOsteoporosis));
    assert.ok(!html.includes('data-embudo='), 'sin embudo');
    assert.ok(html.includes('id="sq2_op_u_medula"') && html.includes('sq2-urg'));
    assert.ok(html.includes('data-op-bloque'));
  });
  withState({ region: 'lumbar', ...op({ estado: 'sospecha' }), sistemicoAnswers: { op_u_medula: 'SI', op_d_fractura: 'SI' }, sistemicoAlerta: true }, () => {
    const p = buildPhysiQPayload();
    assert.ok(p.ur.includes(SIS_OSTEOPOROSIS.preguntas[0].urgencia));
    assert.ok(p.dv.includes(SIS_OSTEOPOROSIS.preguntas[1].derivacion));
  });
  // Sin la tarjeta, una respuesta guardada no cuenta
  withState({ region: 'lumbar', ...op(), sistemicoAnswers: { op_u_medula: 'SI' } }, () => {
    assert.ok(!(buildPhysiQPayload().ur || []).includes(SIS_OSTEOPOROSIS.preguntas[0].urgencia));
  });
});

test('seguridad: marcar la tarjeta nunca quita ni rebaja una urgencia de otro sistema', () => {
  for (const r of VALID_REGIONS) {
    const urgentes = SYSTEMIC_SCREENING[r].sistemas.filter(s => !Object.keys(s).some(k => /^solo[A-Z]/.test(k) && s[k] === true))
      .flatMap(s => s.preguntas).filter(q => q.urgencia);
    const respuestas = Object.fromEntries(urgentes.map(q => [q.id, 'SI']));
    const pinta = () => ({ ur: buildPhysiQPayload().ur, html: sistemasActivos().filter(s => !s.soloOsteoporosis).map(s => buildSistemaHTML(s)).join('') });
    let sin;
    withState({ region: r, ...op(), sistemicoAnswers: respuestas }, () => { sin = pinta(); });
    for (const extra of [COMPLETO, { estado: 'sospecha', factores: { of1: 'SI', of2: 'SI' } }]) {
      withState({ region: r, ...op(extra), sistemicoAnswers: respuestas }, () => {
        const con = pinta();
        assert.deepEqual(con.ur, sin.ur, `${r}: mismas urgencias`);
        assert.equal(con.html, sin.html, `${r}: los demás sistemas se pintan igual`);
      });
    }
  }
});

test('sospecha (decisión 3): 50 años o más y un factor → valorar el riesgo de fractura; nunca calcula el FRAX', () => {
  const r = (factores, edad) => O.resultadoSospecha({ ...O.osteoporosisVacio(), estado: 'sospecha', factores }, edad);
  assert.equal(r({}, 60), null, 'sin contestar');
  assert.equal(r({ of1: 'NO', of2: 'NO' }, 60), 'sinFactores');
  assert.equal(r({ of3: 'SI' }, 50), 'derivar');
  assert.equal(r({ of3: 'SI' }, 49), 'sinFactores');
  assert.equal(r({ of1: 'SI' }, 40), 'joven', 'fractura por fragilidad antes de los 50');
  assert.equal(r({ of2: 'SI' }, null), 'sinEdad');
  assert.equal(O.resultadoSospecha({ ...O.osteoporosisVacio(), estado: 'diagnosticada', factores: { of1: 'SI' } }, 70), null, 'solo con «Sospecha»');
  assert.equal(O.OP.factores.length, 6);
  assert.ok(O.OP.factoresFuente.includes('no calcula el FRAX'));
});

test('caídas (decisión 8, NICE NG249): alto con 2 o más o una casilla; sin puntuar', () => {
  const c = caidas => O.resultadoCaidas({ ...O.osteoporosisVacio(), estado: 'sospecha', caidas: { ...O.caidasVacio(), ...caidas } });
  assert.equal(c({}), null);
  assert.equal(c({ n: '0' }), 'no');
  assert.equal(c({ n: '1' }), 'una');
  assert.equal(c({ n: '2' }), 'alto');
  for (const k of O.CASILLAS_CAIDAS) assert.equal(c({ n: '1', [k]: true }), 'alto', k);
  assert.equal(O.resultadoCaidas({ ...O.osteoporosisVacio(), caidas: { ...O.caidasVacio(), n: '2' } }), null, 'sin la tarjeta, nada');
});

test('derivación por corticoides sin protección ósea (decisión 5): de la tarjeta, a `dv`, no al aviso de la fase 2', () => {
  const t = O.OP.textos.corticoides;
  withState({ region: 'lumbar', ...op({ estado: 'diagnosticada', corticoides: 'a', tratamiento: 'no' }) }, () => {
    assert.ok(buildPhysiQPayload().dv.includes(t));
    assert.equal(buildPhysiQPayload().op.dc, true);
  });
  for (const extra of [{ corticoides: 'a', tratamiento: 'antirresortivo' }, { corticoides: 'b', tratamiento: 'no' }, { corticoides: 'a', tratamiento: 'ns' }]) {
    withState({ region: 'lumbar', ...op({ estado: 'diagnosticada', ...extra }) }, () => assert.ok(!(buildPhysiQPayload().dv || []).includes(t), JSON.stringify(extra)));
  }
});

test('payload `op`: solo con la tarjeta marcada', () => {
  withState({ ...op() }, () => assert.ok(!('op' in buildPhysiQPayload()), 'sin estado, el payload no cambia'));
  withState({ ...op(COMPLETO) }, () => {
    assert.deepEqual(buildPhysiQPayload().op, { es: 'diagnosticada', ca: 'corticoides', fv: '2', fr: true, fo: true, tr: 'antirresortivo', gc: 'a', dc: false, cd: 'alto' });
  });
  withState({ ...op({ estado: 'sospecha', factores: { of1: 'SI', of2: 'NO' }, caidas: { n: '0' } }), edadPaciente: 67 }, () => {
    assert.deepEqual(buildPhysiQPayload().op, { es: 'sospecha', fs: 1, sr: 'derivar', cd: 'no' });
  });
});

test('📋 Notas, 📄 Informe (la sospecha sin la palabra osteoporosis) e informe con IA (sin fuentes)', () => {
  withState({ ...op(COMPLETO) }, () => {
    assert.match(buildContextSummaryText(), /🦴 OSTEOPOROSIS: diagnosticada · por corticoides · 2 o más fracturas vertebrales \(alguna reciente o dolorosa\)/);
    assert.match(buildInformeFisioterapiaText(), /OSTEOPOROSIS\n  · Osteoporosis \(diagnosticada\)\.\n  · Fracturas vertebrales\.\n  · Otras fracturas por fragilidad\./);
    const ctx = IN.contextoValoracion(buildPhysiQPayload());
    assert.ok(ctx.includes('Osteoporosis o fragilidad ósea (condición especial marcada por el fisioterapeuta):'));
    assert.ok(!/Gregson|Kanis|Laurent|Brooke-Wavell|Giangregorio|Gibbs|Maitland|Puentedura|Montero-Odasso|NICE|Sherrington|Downie|Finucane|Hadji|Scioscia|Kovacs|Hardcastle|Anagnostis/.test(ctx), 'el prompt no lleva las fuentes');
  });
  withState({ ...op({ estado: 'sospecha', factores: { of1: 'SI' }, caidas: { n: '2' } }), edadPaciente: 70 }, () => {
    const i = buildInformeFisioterapiaText();
    assert.ok(i.includes('RECOMENDACIÓN DE VALORACIÓN MÉDICA') && i.includes('Se recomienda que su médico valore el riesgo de fractura.'));
    assert.ok(!/osteoporosis/i.test(i), 'con la sospecha, el informe no dice osteoporosis');
    assert.ok(IN.contextoValoracion(buildPhysiQPayload()).includes('no escribas que el paciente tiene osteoporosis'));
  });
  withState({ ...op() }, () => {
    assert.ok(!buildContextSummaryText().includes('OSTEOPOROSIS'));
    assert.ok(!buildInformeFisioterapiaText().includes('OSTEOPOROSIS'));
  });
});

test('fase 4b (decisión 7 y M2): `cargaOsea` en la lista fijada; la línea, solo en la pantalla', () => {
  const lista = Object.values(HYPOTHESES).flatMap(h => h.tests.map((t, i) => (t.cargaOsea ? `${h.id}:${i}${t.cargaOsea === 'costilla' ? 'c' : ''}` : null))).filter(Boolean);
  assert.deepEqual(lista.sort(), ['ca10:0', 'ca10:3', 'ca10:4', 'ce10:0c', 'ce1:0', 'ce3:0', 'h6:0', 'h9:0c', 'lu1:1', 'lu2:1', 'lu7:1',
    'lu8:0', 'lu8:1', 'lu8:2', 'lu8:3', 'lu8:5', 'ro15:2', 'tp8:0', 'tp8:1', 'tp9:1']);
  for (const h of Object.values(HYPOTHESES)) for (const t of h.tests) assert.ok([undefined, true, 'costilla'].includes(t.cargaOsea), `${h.id}: ${t.name}`);
  const fase4b = leer('phase4b.js');
  assert.ok(fase4b.includes('test.cargaOsea && opActivo(state.osteoporosis)'));
  withState({ ...op(COMPLETO) }, () => {
    for (const k of ['tecnica4b', 'tecnica4bCostilla', 'tecnica4bPorque', 'nota']) {
      const frag = O.OP.textos[k].slice(0, 40);
      assert.ok(!JSON.stringify(buildPhysiQPayload()).includes(frag) && !buildContextSummaryText().includes(frag) && !buildInformeFisioterapiaText().includes(frag), k);
    }
  });
});

test('ninguna regla automática (decisión 9): el lupus no marca esta tarjeta; su recordatorio, solo en el recuadro', () => {
  const lupus = { estado: 'diagnosticado', corticoides: 'a', dosisAltas: 'SI', inmunosupresores: '', antifosfolipidos: '', osteonecrosis: false, raynaud: false, actividad: '', rasgos: {} };
  withState({ region: 'lumbar', ...op(), lupus }, () => {
    assert.ok(!sistemasActivos().some(s => s.soloOsteoporosis));
    assert.ok(!('op' in buildPhysiQPayload()));
    assert.ok(!IN.contextoValoracion(buildPhysiQPayload()).includes(O.OP.textos.lupus.slice(0, 40)), 'no va en el bloque del lupus que copia physiq-report');
  });
  assert.ok(leer('app.js').includes('...(_recordatorioOPLupus(d) ? [OP.textos.lupus] : [])'));
});

test('fase 6: avisos, red de la fractura vertebral y tope sin thrust (decisiones 6 y 15)', () => {
  const hs = [{ id: 'x', name: 'X', pauta: 'P.', derivar: false, tratada: false }];
  const base = { region: 'lumbar', hipotesis: hs, elegidas: ['x'], severidad: 5, irritabilidadNivel: 'Moderada', irritabilidad: {} };
  const sin = P.construirPlan(base);
  for (const k of ['osteoporosis', 'osteoporosisMoverse', 'sinThrustOsteoporosis', 'sinThrustLupus']) assert.ok(!sin.avisosHip.includes(PD.AVISOS[k]), k);
  assert.ok(!sin.sesion.cierre.includes(PD.TEXTOS_SESION.cierreFracturaVertebral));
  assert.deepEqual(sin.consejosCasa, []);
  for (const region of ['codo', 'lumbar', 'cervical']) {
    const con = P.construirPlan({ ...base, region, osteoporosis: { diagnosticada: true, impactoLimitado: true }, sinThrust: ['osteoporosis'] });
    for (const k of ['osteoporosis', 'osteoporosisMoverse', 'osteoporosisImpactoLimitado', 'sinThrustOsteoporosis']) assert.ok(con.avisosHip.includes(PD.AVISOS[k]), `${region}: ${k}`);
    assert.ok(con.sesion.cierre.includes(PD.TEXTOS_SESION.cierreFracturaVertebral), region);
    assert.ok(con.alarmasCasa.includes(PD.TEXTOS_CASA.alarmaFracturaVertebral.texto), region);
    assert.ok(P.textoDomiciliario(con, {}).includes(PD.TEXTOS_CASA.moverseOsteoporosis.texto), region);
  }
  // Con la sospecha: avisos de ejercicio y moverse, sin el del impacto ni la red (no se sabe si hay fracturas)
  const sospecha = P.construirPlan({ ...base, osteoporosis: { diagnosticada: false, impactoLimitado: false }, sinThrust: ['osteoporosis'] });
  assert.ok(!sospecha.avisosHip.includes(PD.AVISOS.osteoporosisImpacto) && !sospecha.avisosHip.includes(PD.AVISOS.osteoporosisImpactoLimitado));
  assert.ok(!sospecha.sesion.cierre.includes(PD.TEXTOS_SESION.cierreFracturaVertebral));
  // Decisión 15: el lupus con corticoides pone el tope sin marcar esta tarjeta (el
  // anticoagulante, desde su tarjeta: docs/anticoagulado.md, decisión 4)
  const lupus = P.construirPlan({ ...base, sinThrust: ['corticoides'] });
  assert.ok(lupus.avisosHip.includes(PD.AVISOS.sinThrustLupus) && !lupus.avisosHip.includes(PD.AVISOS.osteoporosis));
  const L = extra => ({ estado: 'diagnosticado', corticoides: '', dosisAltas: '', ...extra });
  assert.deepEqual(O.motivosSinThrust(O.osteoporosisVacio(), L({})), []);
  assert.deepEqual(O.motivosSinThrust(O.osteoporosisVacio(), L({ corticoides: 'no' })), []);
  assert.deepEqual(O.motivosSinThrust(O.osteoporosisVacio(), L({ corticoides: 'b' })), ['corticoides']);
  assert.deepEqual(O.motivosSinThrust(O.osteoporosisVacio(), L({ dosisAltas: 'SI' })), ['corticoides']);
  assert.deepEqual(O.motivosSinThrust(O.osteoporosisVacio(), L({ antitrombotico: true })), [], 'la casilla antigua del lupus ya no cuenta');
  assert.deepEqual(O.motivosSinThrust(O.osteoporosisVacio(), null, { estado: 'toma', toma: ['do'] }), ['anticoagulante']);
  assert.deepEqual(O.motivosSinThrust(O.osteoporosisVacio(), null, { estado: 'toma', toma: ['as', 'oa'] }), [], 'el antiagregante solo no');
  assert.deepEqual(O.motivosSinThrust(O.osteoporosisVacio(), { ...L({ corticoides: 'a' }), estado: 'sospecha' }), [], 'el lupus en sospecha no');
  assert.deepEqual(O.motivosSinThrust({ ...O.osteoporosisVacio(), estado: 'sospecha' }, null), ['osteoporosis']);
  assert.ok(leer('plan.js').includes('motivosSinThrust(state.osteoporosis, state.lupus, state.anticoagulado)'));
});

test('panel de tiempos (decisión 10): con fractura vertebral, «Este paciente» enseña la vertebral por compresión', () => {
  assert.deepEqual(TIEMPOS_TEJIDO.porCondicion.fracturaVertebral, ['fx_vertebral_compresion']);
  assert.deepEqual(filasPaciente(TIEMPOS_TEJIDO, [], { condiciones: ['fracturaVertebral'] }).ids, ['fx_vertebral_compresion']);
  assert.ok(leer('app.js').includes("condiciones: fracturaVertebral(op) ? ['fracturaVertebral'] : []"));
  assert.ok(O.fracturaVertebral({ ...O.osteoporosisVacio(), estado: 'diagnosticada', vertebrales: '1' }));
  assert.ok(!O.fracturaVertebral({ ...O.osteoporosisVacio(), estado: 'diagnosticada', vertebrales: '0' }));
  assert.ok(!O.fracturaVertebral({ ...O.osteoporosisVacio(), estado: 'sospecha', vertebrales: '2' }));
});

test('modo breve: fracturas vertebrales o factores sin registrar son pendientes; el sistema no tiene embudo', () => {
  withState({ ...op({ estado: 'diagnosticada' }), modo: 'breve', region: 'lumbar' }, () => {
    const t = getPendientesBreve().map(p => p.texto);
    assert.ok(t.includes('Fracturas vertebrales sin registrar (tarjeta «Osteoporosis o fragilidad ósea»)'));
    assert.ok(!t.some(x => /Osteoporosis(,|$)/.test(x)), 'no sale como sistema sin cribar');
  });
  withState({ ...op({ estado: 'sospecha' }), modo: 'breve', region: 'lumbar' }, () => {
    assert.ok(getPendientesBreve().some(p => p.texto === 'Factores de la sospecha de osteoporosis sin preguntar'));
  });
  withState({ ...op({ estado: 'diagnosticada', vertebrales: '0' }), modo: 'breve', region: 'lumbar' }, () => {
    assert.ok(!getPendientesBreve().some(p => p.texto.startsWith('Fracturas vertebrales')));
  });
  withState({ ...op({ estado: 'diagnosticada' }), modo: 'completo', region: 'lumbar' }, () => assert.deepEqual(getPendientesBreve(), []));
});

test('normalizar: sesiones anteriores y valores raros', () => {
  assert.deepEqual(O.normalizarOsteoporosis(undefined), O.osteoporosisVacio());
  assert.deepEqual(O.normalizarOsteoporosis({ estado: 'x', causa: 'z', vertebrales: 5, reciente: 'sí', factores: { of1: 'quizá', zz: 'SI' }, caidas: { n: 7, lesion: 1 } }), O.osteoporosisVacio());
  const v = O.normalizarOsteoporosis({ estado: 'diagnosticada', vertebrales: '1', reciente: true, factores: { of1: 'SI', zz: 'SI' }, caidas: { n: '1', suelo: true } });
  assert.equal(v.vertebrales, '1');
  assert.deepEqual(v.factores, { of1: 'SI' });
  assert.deepEqual(v.caidas, { ...O.caidasVacio(), n: '1', suelo: true });
});

test('se despliega y se expone: lib/osteoporosis.js en deploy-to-hub.yml; funciones de la tarjeta en window', () => {
  assert.ok(leer('.github', 'workflows', 'deploy-to-hub.yml').includes('lib/osteoporosis.js'));
  for (const f of ['selectOPEstado', 'selectOPFila', 'toggleOPCasilla', 'selectOPFactor', 'selectOPCaidas', 'toggleOPCaidaCasilla']) assert.equal(typeof globalThis[f], 'function', f);
});

// physiq-report (lib/payload.js, _bloqueOP) llevará una copia de bloqueOPIA()
// y su test fijará estos mismos textos: si cambian aquí, se copian allí.
export const OP_CASOS = {
  plo: [{es: 'diagnosticada', ca: 'plo', fv: '2', fr: true, fo: false, tr: 'no', gc: 'no', dc: false, cd: 'no'},
    "Osteoporosis o fragilidad ósea (condición especial marcada por el fisioterapeuta):\n  · Estado: diagnosticada\n  · Datos: asociada al embarazo o la lactancia; 2 o más fracturas vertebrales (alguna reciente o dolorosa); sin tratamiento para el hueso; sin corticoides; sin caídas en el último año\n  · Consideraciones para el plan: Fuerza progresiva 2–3 días por semana, hasta el peso que levanta 8–12 veces, en 2 series y hasta 3, empezando suave con buena técnica y movimientos lentos y controlados; todos los grupos musculares, también la espalda, sin flexión con carga. Si el riesgo de fractura vertebral es alto, sin máquinas que obliguen a flexionar o girar el tronco. Con fractura vertebral o varias fracturas por fragilidad: impacto solo hasta caminar a paso ligero, 150 min por semana, por precaución, sin pruebas de que más sea peligroso; consulta con el fisioterapeuta al empezar. Tras una fractura vertebral dolorosa: extensores de espalda a diario, suaves, 3–5 repeticiones mantenidas 3–5 s; con dolor, empieza tumbado boca arriba. El ejercicio mejora algo la movilidad (certeza moderada); si mejora el dolor no se sabe (certeza muy baja), y los estudios se hicieron meses después de la fractura, no en la fase aguda. Espalda recta al agacharse y levantar (bisagra de cadera); modifica la flexión mantenida, repetida o al final del recorrido, sobre todo con carga; la torsión, suave y controlada, mejor girando con pasos; cuidado al pasar de tumbado a sentado o al darse la vuelta, y con peso en las manos; no levantar ni dejar cosas en el suelo, sino guardarlas a la altura de la cintura. Enseña cómo, no prohíbas. Sin manipulación forzada; la movilización suave puede ser adecuada. Un dolor de espalda brusco tras un esfuerzo pequeño puede ser una fractura vertebral nueva: valoración médica; con debilidad u hormigueo en las piernas, urgencias. Osteoporosis del embarazo o la lactancia: que se movilice pronto y sin reposo en cama; actividad en carga y de fuerza razonable, sin excesos, y sin cargar objetos pesados. Con las fracturas consolidadas, a los 3–6 meses, más carga y fuerza. Fisioterapia cuando el dolor lo permita. Al coger y cargar al bebé, la misma bisagra de cadera. Si las fracturas la limitan mucho, que tenga ayuda para cuidar del bebé. La lactancia, los fármacos y otro embarazo los decide con su médico. Tras una osteoporosis del embarazo o la lactancia pueden aparecer nuevas fracturas, más si hubo varias al principio; si hay más riesgo en otro embarazo no está claro: que lo hable con su médico. Sin caídas: equilibrio a diario, 15–20 min. Los fármacos, el calcio, la vitamina D y el corsé los indica el médico."],
  corticoides: [{es: 'diagnosticada', ca: 'corticoides', fv: '0', fr: false, fo: true, tr: 'no', gc: 'a', dc: true, cd: 'alto'},
    "Osteoporosis o fragilidad ósea (condición especial marcada por el fisioterapeuta):\n  · Estado: diagnosticada\n  · Datos: por corticoides; sin fracturas vertebrales conocidas; otras fracturas por fragilidad; sin tratamiento para el hueso; corticoides de 7,5 mg/día o más; caídas: riesgo alto\n  · Consideraciones para el plan: Fuerza progresiva 2–3 días por semana, hasta el peso que levanta 8–12 veces, en 2 series y hasta 3, empezando suave con buena técnica y movimientos lentos y controlados; todos los grupos musculares, también la espalda, sin flexión con carga. Si el riesgo de fractura vertebral es alto, sin máquinas que obliguen a flexionar o girar el tronco. Con fractura vertebral o varias fracturas por fragilidad: impacto solo hasta caminar a paso ligero, 150 min por semana, por precaución, sin pruebas de que más sea peligroso; consulta con el fisioterapeuta al empezar. Equilibrio a diario, 15–20 min. Espalda recta al agacharse y levantar (bisagra de cadera); modifica la flexión mantenida, repetida o al final del recorrido, sobre todo con carga; la torsión, suave y controlada, mejor girando con pasos; cuidado al pasar de tumbado a sentado o al darse la vuelta, y con peso en las manos; no levantar ni dejar cosas en el suelo, sino guardarlas a la altura de la cintura. Enseña cómo, no prohíbas. Sin manipulación forzada; la movilización suave puede ser adecuada. Un dolor de espalda brusco tras un esfuerzo pequeño puede ser una fractura vertebral nueva: valoración médica; con debilidad u hormigueo en las piernas, urgencias. Corticoides de 7,5 mg/día o más durante 3 meses o más sin tratamiento para el hueso: que su médico valore la protección ósea. Riesgo alto de caídas: valoración integral de caídas. Ejercicio de caídas: equilibrio exigente y ejercicio funcional (levantarse de la silla, pasos), 3 o más sesiones por semana, progresado al menos 12 semanas, unas 3 h por semana durante al menos 4 meses. El equilibrio y el ejercicio funcional reducen las caídas; caminar solo no ha demostrado reducirlas. Los fármacos, el calcio, la vitamina D y el corsé los indica el médico."],
  sospecha: [{es: 'sospecha', fs: 2, sr: 'derivar', cd: 'una'},
    "Osteoporosis o fragilidad ósea (condición especial marcada por el fisioterapeuta):\n  · Estado: sospecha\n  · Datos: una caída en el último año\n  · Factores de riesgo de fractura: 2 de 6 «sí»\n  · Es una sospecha: no escribas que el paciente tiene osteoporosis; el diagnóstico es médico.\n  · Consideraciones para el plan: Que su médico valore el riesgo de fractura (FRAX y, si procede, densitometría). Una caída, sin lesión, sin quedarse en el suelo, sin pérdida de conocimiento y sin fragilidad: valora la marcha y el equilibrio; si están alterados, programa de ejercicio de caídas y revisión de los riesgos del hogar. La velocidad de marcha por debajo de 0,8 m/s indica más riesgo. Ejercicio de caídas: equilibrio exigente y ejercicio funcional (levantarse de la silla, pasos), 3 o más sesiones por semana, progresado al menos 12 semanas, unas 3 h por semana durante al menos 4 meses. El equilibrio y el ejercicio funcional reducen las caídas; caminar solo no ha demostrado reducirlas. Un dolor de espalda brusco tras un esfuerzo pequeño puede ser una fractura vertebral nueva: valoración médica; con debilidad u hormigueo en las piernas, urgencias."],
};

test('bloqueOPIA: el texto que physiq-report copiará, literal', () => {
  for (const [k, [d, esperado]] of Object.entries(OP_CASOS)) assert.equal(O.bloqueOPIA(d), esperado, k);
});
