// Trastorno mastocitario o anafilaxia (Fase P, docs/mastocitaria.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, SYSTEMIC_SCREENING, buildPhysiQPayload, buildInformeFisioterapiaText,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML, sistemasActivos, withState, VALID_REGIONS } from './comun.mjs';
const M = await import('../../lib/mastocitos.js');
const IN = await import('../../lib/informe-narrativo.js');
const P = await import('../../lib/plan-tratamiento.js');
const PD = await import('../../data/plan-tratamiento.js');
const { SIS_MASTOCITOS } = await import('../../data/comun.js');

console.log('\ntrastorno mastocitario o anafilaxia (Fase P)');

const ma = (extra = {}) => ({ mastocitos: { ...M.mastocitosVacio(), ...extra } });
// Todo marcado, para probar que no cambia la seguridad de otros sistemas
const COMPLETO = { estado: 'diagnosticado', tipo: 'mastocitosis', anafilaxia: 'SI', autoinyector: 'NO',
  desencadenantes: { calor: true, roce: true }, otro: 'frutos secos' };

test('sistema común: la misma instancia en las 7 regiones, tras el del lupus, oculto sin la tarjeta', () => {
  for (const r of VALID_REGIONS) {
    const sis = SYSTEMIC_SCREENING[r].sistemas;
    assert.ok(sis.includes(SIS_MASTOCITOS), r);
    assert.equal(sis.indexOf(SIS_MASTOCITOS), sis.findIndex(s => s.soloLupus) + 1, `${r}: justo después del lupus`);
    withState({ region: r, ...ma() }, () => assert.ok(!sistemasActivos().some(s => s.soloMastocitos), `${r}: sin estado no se ve`));
    withState({ region: r, ...ma({ estado: 'diagnosticado' }) }, () => assert.ok(sistemasActivos().some(s => s.soloMastocitos), `${r}: con la tarjeta se ve`));
  }
});

test('solo «Diagnosticado» (decisión 2): sin «Sospecha» en el estado ni en la tarjeta', () => {
  assert.deepEqual(Object.keys(M.ESTADOS_MA), ['diagnosticado']);
  assert.equal(M.normalizarMastocitos({ estado: 'sospecha' }).estado, '');
  const html = leer('index.html');
  const card = html.slice(html.indexOf('id="cardMastocitos"'), html.indexOf('id="cardOsteoporosis"'));
  assert.ok(card.includes("selectMAEstado('diagnosticado')") && !/sospecha/i.test(card));
});

test('fase 2: una sola derivación no urgente, sin urgencias ni embudo; la bandera enlazada a su pregunta', () => {
  assert.deepEqual(SIS_MASTOCITOS.preguntas.map(q => q.id), ['ma_d_episodios']);
  const q = SIS_MASTOCITOS.preguntas[0];
  assert.ok(q.derivacion && !q.urgencia, 'derivación, nunca urgencia');
  assert.deepEqual(SIS_MASTOCITOS.banderasRojas, []);
  assert.deepEqual(SIS_MASTOCITOS.banderasAmarillas.map(b => b.pregunta), ['ma_d_episodios']);
  withState({ region: 'lumbar', ...ma({ estado: 'diagnosticado' }) }, () => {
    const html = buildSistemaHTML(sistemasActivos().find(s => s.soloMastocitos));
    assert.ok(!html.includes('data-embudo='), 'sin embudo');
    assert.ok(!html.includes('sq2-urg'));
  });
  withState({ region: 'lumbar', ...ma({ estado: 'diagnosticado' }), sistemicoAnswers: { ma_d_episodios: 'SI' }, sistemicoAlerta: true }, () => {
    assert.ok(buildPhysiQPayload().dv.includes(q.derivacion));
    assert.ok(!buildPhysiQPayload().ur.includes(q.derivacion));
  });
  // Sin la tarjeta, una respuesta guardada no cuenta
  withState({ region: 'lumbar', ...ma(), sistemicoAnswers: { ma_d_episodios: 'SI' } }, () => {
    assert.ok(!(buildPhysiQPayload().dv || []).includes(q.derivacion));
  });
});

test('seguridad: marcar la tarjeta nunca quita ni rebaja una urgencia de otro sistema', () => {
  for (const r of VALID_REGIONS) {
    const urgentes = SYSTEMIC_SCREENING[r].sistemas.filter(s => !Object.keys(s).some(k => /^solo[A-Z]/.test(k) && s[k] === true))
      .flatMap(s => s.preguntas).filter(q => q.urgencia);
    const respuestas = Object.fromEntries(urgentes.map(q => [q.id, 'SI']));
    const pinta = () => ({ ur: buildPhysiQPayload().ur, html: sistemasActivos().filter(s => !s.soloMastocitos).map(s => buildSistemaHTML(s)).join('') });
    let sin;
    withState({ region: r, ...ma(), sistemicoAnswers: respuestas }, () => { sin = pinta(); });
    withState({ region: r, ...ma(COMPLETO), sistemicoAnswers: respuestas }, () => {
      const con = pinta();
      assert.deepEqual(con.ur, sin.ur, `${r}: mismas urgencias`);
      assert.equal(con.html, sin.html, `${r}: los demás sistemas se pintan igual`);
    });
  }
});

test('nivel de alerta (decisiones 11 y 16): riesgo alto con mastocitosis, SAMA o anafilaxia previa', () => {
  const r = extra => M.riesgoAltoMA({ ...M.mastocitosVacio(), estado: 'diagnosticado', ...extra });
  assert.ok(r({ tipo: 'mastocitosis' }) && r({ tipo: 'sama' }) && r({ tipo: 'soloAnafilaxia' }));
  assert.ok(r({ tipo: 'otro', anafilaxia: 'SI' }) && r({ tipo: 'ns', anafilaxia: 'SI' }));
  assert.ok(!r({ tipo: 'otro' }) && !r({ tipo: 'ns' }) && !r({ tipo: 'otro', anafilaxia: 'NS' }) && !r({}));
  assert.ok(!M.riesgoAltoMA({ ...M.mastocitosVacio(), tipo: 'mastocitosis' }), 'sin la tarjeta marcada, nada');
  const t = M.MA.textos;
  const lineas = d => M.lineasRecomendacionMA(d);
  // El protocolo y el desmayo, siempre; el riesgo alto, solo con su nivel
  for (const d of [{ ti: 'otro', an: 'no', ai: 'si', de: [] }, { ti: 'mastocitosis', an: 'si', ai: 'si', de: [] }]) {
    for (const k of ['queHacer', 'desmayo', 'despues', 'protocolo']) assert.ok(lineas(d).includes(t[k]), `${d.ti}: ${k}`);
  }
  assert.ok(!lineas({ ti: 'otro', an: 'no', ai: 'si', de: [] }).includes(t.riesgoAlto));
  assert.ok(lineas({ ti: 'sama', an: null, ai: 'si', de: [] }).includes(t.riesgoAlto));
  assert.ok(lineas({ ti: 'mastocitosis', an: 'no', ai: 'si', de: [] }).includes(t.mastocitosis));
  assert.ok(!lineas({ ti: 'sama', an: 'si', ai: 'si', de: [] }).includes(t.mastocitosis));
  // Sin autoinyector (decisión 15) y con desencadenantes
  assert.ok(lineas({ ti: 'otro', an: 'no', ai: 'no', de: [] }).includes(t.sinAutoinyector));
  assert.ok(lineas({ ti: 'otro', an: 'no', ai: 'sinReceta', de: [] }).includes(t.sinAutoinyector));
  assert.ok(!lineas({ ti: 'otro', an: 'no', ai: 'si', de: [] }).includes(t.sinAutoinyector));
  assert.ok(lineas({ ti: 'otro', an: 'no', ai: 'si', de: ['calor'] }).includes(t.desencadenantes));
});

test('textos de la decisión 14 y la 13: «si no puede, ayúdale» y el desmayo vasovagal, con sus fuentes', () => {
  const t = M.MA.textos;
  assert.ok(t.queHacer.includes('si no puede, ayúdale a ponérselo si la normativa de tu país lo permite'));
  assert.ok(t.queHacer.includes('112') && t.queHacer.includes('sin levantarlo de golpe'));
  assert.ok(t.desmayo.includes('RCUK 2021, tabla 3'));
  assert.ok(t.sinAutoinyector.includes('RCUK 2021, 8.6') && t.sinAutoinyector.includes('Muraro 2022, recuadro 4'));
});

test('payload `ma`: solo con la tarjeta marcada; «solo anafilaxia» implica la anafilaxia previa', () => {
  withState({ ...ma() }, () => assert.ok(!('ma' in buildPhysiQPayload()), 'sin estado, el payload no cambia'));
  withState({ ...ma(COMPLETO) }, () => {
    assert.deepEqual(buildPhysiQPayload().ma, { es: 'diagnosticado', ti: 'mastocitosis', an: 'si', ai: 'no', de: ['calor', 'roce o presión en la piel', 'frutos secos'] });
  });
  withState({ ...ma({ estado: 'diagnosticado' }) }, () => {
    assert.deepEqual(buildPhysiQPayload().ma, { es: 'diagnosticado', ti: null, an: null, ai: null, de: [] });
  });
  withState({ ...ma({ estado: 'diagnosticado', tipo: 'soloAnafilaxia', anafilaxia: 'NO', autoinyector: 'sinReceta' }) }, () => {
    assert.deepEqual(buildPhysiQPayload().ma, { es: 'diagnosticado', ti: 'soloAnafilaxia', an: 'si', ai: 'sinReceta', de: [] });
  });
});

test('📋 Notas, 📄 Informe (nunca convierte «otro» en un SAMA) e informe con IA (sin fuentes)', () => {
  withState({ ...ma(COMPLETO) }, () => {
    assert.match(buildContextSummaryText(), /💉 MASTOCITOS: mastocitosis · anafilaxia previa · no lleva autoinyector · desencadenantes: calor, roce o presión en la piel, frutos secos/);
    assert.match(buildInformeFisioterapiaText(), /TRASTORNO MASTOCITARIO O ANAFILAXIA\n  · Mastocitosis \(diagnosticada\)\.\n  · Anafilaxia previa\.\n  · En las sesiones se evita lo que le ha provocado episodios: calor, roce o presión en la piel, frutos secos\./);
    const ctx = IN.contextoValoracion(buildPhysiQPayload());
    assert.ok(ctx.includes('Trastorno mastocitario o anafilaxia (condición especial marcada por el fisioterapeuta):'));
    assert.ok(!/RCUK|NICE|Muraro|Cardona|Valent|Valdez|Lee y Picard|Brockow|Muñoz|Gülen|González-de-Olano|Srisuwatchari/.test(ctx), 'el prompt no lleva las fuentes');
  });
  withState({ ...ma({ estado: 'diagnosticado', tipo: 'otro' }) }, () => {
    const i = buildInformeFisioterapiaText();
    assert.ok(i.includes('Trastorno mastocitario (diagnosticado).') && !/activación mastocitaria/i.test(i));
  });
  withState({ ...ma() }, () => {
    assert.ok(!buildContextSummaryText().includes('MASTOCITOS'));
    assert.ok(!buildInformeFisioterapiaText().includes('TRASTORNO MASTOCITARIO'));
  });
});

test('fase 4b y texto de hipermovilidad y POTS: solo en la pantalla, nunca en lo que se comparte; sin regla automática', () => {
  assert.ok(leer('phase4b.js').includes('ma-nota-4b'));
  const app = leer('app.js');
  assert.equal(app.split('MA.textos.asociacion').length - 1, 2, 'la línea de la asociación, en el bloque de hipermovilidad y en el de disautonomía');
  withState({ ...ma(COMPLETO) }, () => {
    for (const k of ['tecnica4b', 'asociacion', 'nota']) {
      const frag = M.MA.textos[k].slice(0, 40);
      assert.ok(!JSON.stringify(buildPhysiQPayload()).includes(frag) && !buildContextSummaryText().includes(frag) && !buildInformeFisioterapiaText().includes(frag), k);
    }
  });
  // Ninguna regla automática (decisión 5): marcar la hipermovilidad o la disautonomía no marca esta tarjeta ni muestra su sistema
  withState({ region: 'lumbar', ...ma(), hipermovilidad: { estado: 'sospecha', subtipo: '', beighton: null, cuestionario: {} },
    disautonomia: { estado: 'sospecha', tipo: '', sospecha: {}, bipedestacion: null } }, () => {
    assert.ok(!sistemasActivos().some(s => s.soloMastocitos));
    assert.ok(!('ma' in buildPhysiQPayload()));
  });
});

test('fase 6: aviso y red de seguridad de la anafilaxia con la tarjeta, en cualquier región', () => {
  const hs = [{ id: 'x', name: 'X', pauta: 'P.', derivar: false, tratada: false }];
  const base = { region: 'codo', hipotesis: hs, elegidas: ['x'], severidad: 5, irritabilidadNivel: 'Moderada', irritabilidad: {} };
  const sin = P.construirPlan(base);
  assert.ok(!sin.avisosHip.includes(PD.AVISOS.mastocitos));
  assert.ok(!sin.sesion.cierre.includes(PD.TEXTOS_SESION.cierreAnafilaxia));
  for (const region of ['codo', 'lumbar', 'rodilla']) {
    const con = P.construirPlan({ ...base, region, mastocitos: true });
    assert.ok(con.avisosHip.includes(PD.AVISOS.mastocitos), region);
    assert.ok(con.sesion.cierre.includes(PD.TEXTOS_SESION.cierreAnafilaxia), region);
    assert.ok(con.alarmasCasa.includes(PD.TEXTOS_CASA.alarmaAnafilaxia.texto), region);
  }
  assert.ok(leer('plan.js').includes('maActivo(state.mastocitos)'));
});

test('modo breve: el autoinyector sin registrar es un pendiente; el sistema no tiene embudo', () => {
  withState({ ...ma({ estado: 'diagnosticado' }), modo: 'breve', region: 'lumbar' }, () => {
    const t = getPendientesBreve().map(p => p.texto);
    assert.ok(t.includes('Autoinyector sin registrar (tarjeta «Trastorno mastocitario o anafilaxia»)'));
    assert.ok(!t.some(x => x.includes('Trastorno mastocitario o anafilaxia,') || x.endsWith('Trastorno mastocitario o anafilaxia')), 'no sale como sistema sin cribar');
  });
  withState({ ...ma({ estado: 'diagnosticado', autoinyector: 'SI' }), modo: 'breve', region: 'lumbar' }, () => {
    assert.ok(!getPendientesBreve().some(p => p.texto.startsWith('Autoinyector')));
  });
  withState({ ...ma({ estado: 'diagnosticado' }), modo: 'completo', region: 'lumbar' }, () => assert.deepEqual(getPendientesBreve(), []));
});

test('normalizar: sesiones anteriores y valores raros', () => {
  assert.deepEqual(M.normalizarMastocitos(undefined), M.mastocitosVacio());
  assert.deepEqual(M.normalizarMastocitos({ estado: 'x', tipo: 'z', anafilaxia: 'quizá', autoinyector: 1, desencadenantes: { calor: 'sí', lava: true }, otro: 3 }), M.mastocitosVacio());
  const v = M.normalizarMastocitos({ estado: 'diagnosticado', tipo: 'sama', desencadenantes: { calor: true, lava: true } });
  assert.equal(v.tipo, 'sama');
  assert.deepEqual(v.desencadenantes, { calor: true });
});

test('se despliega y se expone: lib/mastocitos.js en deploy-to-hub.yml; funciones de la tarjeta en window', () => {
  assert.ok(leer('.github', 'workflows', 'deploy-to-hub.yml').includes('lib/mastocitos.js'));
  for (const f of ['selectMAEstado', 'selectMAFila', 'toggleMADesencadenante', 'updateMAOtro']) assert.equal(typeof globalThis[f], 'function', f);
});

// physiq-report (lib/payload.js, _bloqueMA) llevará una copia de bloqueMAIA()
// y su test fijará estos mismos textos: si cambian aquí, se copian allí.
const QUE_HACER = 'Si en la sesión aparecen ronchas, hinchazón, falta de aire, mareo o un desmayo: para, quédate con él y llama al 112; que se ponga su autoinyector en la cara externa del muslo (si no puede, ayúdale a ponérselo si la normativa de tu país lo permite) y, si no mejora, a los 5 minutos el segundo. Tumbado (sentado si le cuesta respirar; de lado si pierde el conocimiento y respira) y sin levantarlo de golpe aunque mejore. Puede no haber ronchas. Un desmayo vasovagal mejora enseguida al tumbarlo, con el pulso lento. Si no se recupera rápido tumbado, o tiene el pulso rápido, ronchas o le cuesta respirar, trátalo como una anafilaxia.';
const DESPUES = 'Tras una anafilaxia, aunque se recupere, lo tiene que ver un médico: puede repetirse en las horas siguientes sin nueva exposición.';
const CABECERA = 'Trastorno mastocitario o anafilaxia (condición especial marcada por el fisioterapeuta):';
const CRONICOS = '  · No relaciones sus síntomas crónicos (dolor, cansancio) con el trastorno mastocitario: solo los episodios bruscos en varios sistemas lo son.';
export const MA_CASOS = {
  mastocitosis: [{ es: 'diagnosticado', ti: 'mastocitosis', an: 'si', ai: 'no', de: ['calor', 'roce o presión en la piel'] },
    `${CABECERA}\n  · Datos: mastocitosis; anafilaxia previa; no lleva autoinyector; desencadenantes: calor, roce o presión en la piel\n${CRONICOS}\n  · Consideraciones para la sesión: ${QUE_HACER} Tiene más riesgo de anafilaxia que la población general: que lleve su autoinyector siempre y lo traiga a cada sesión. En la mastocitosis, la anafilaxia suele empezar con calor brusco, palpitaciones, mareo y desmayo, a menudo sin ronchas. Tras una anafilaxia, las guías indican llevar autoinyector (salvo si fue por un fármaco fácil de evitar), y también con una mastocitosis sistémica y cualquier reacción previa: que su médico lo valore. Evita en la sesión lo que ya le ha provocado episodios; no hace falta evitar una lista de todos los descritos. ${DESPUES}`],
  otroSinAnafilaxia: [{ es: 'diagnosticado', ti: 'otro', an: 'no', ai: 'si', de: [] },
    `${CABECERA}\n  · Datos: otro trastorno mastocitario; lleva autoinyector\n${CRONICOS}\n  · Consideraciones para la sesión: ${QUE_HACER} ${DESPUES}`],
  minimo: [{ es: 'diagnosticado', ti: null, an: null, ai: null, de: [] },
    `${CABECERA}\n  · Datos: trastorno mastocitario\n${CRONICOS}\n  · Consideraciones para la sesión: ${QUE_HACER} ${DESPUES}`],
};
test('bloqueMAIA: el texto que physiq-report copiará, literal', () => {
  for (const [k, [d, esperado]] of Object.entries(MA_CASOS)) assert.equal(M.bloqueMAIA(d), esperado, k);
});
