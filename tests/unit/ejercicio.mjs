// Guía «Efectos del ejercicio» de la cabecera (docs/efectos-ejercicio.md). Se ejecuta desde tests/unit.js.
import { assert, leer, test, buildPhysiQPayload, buildInformeFisioterapiaText, buildContextSummaryText,
  withState, citasEnTexto, claveRegistro } from './comun.mjs';
const { NIVELES_EJERCICIO, APARTADOS_EJERCICIO, BLOQUES_EJERCICIO, TEXTOS_EJERCICIO, BLOQUE_POR_HIPOTESIS } = await import('../../data/ejercicio.js');
const { HYPOTHESES } = await import('../../data.js');
const E = await import('../../lib/ejercicio.js');
const { REFERENCIAS } = await import('../../data/referencias.js');
const HMX = await import('../../lib/hipermovilidad.js');

console.log('\nguía de efectos del ejercicio (cabecera)');

// Un bloque de prueba, correcto, para ejercitar los validadores y el HTML sin
// depender de que ya haya contenido real escrito
const muestra = () => ({
  id: 'prueba', titulo: 'Bloque de prueba', resumen: 'Solo para los tests',
  apartados: {
    que: [{ t: 'Frase de prueba sobre qué ocurre con el ejercicio.', nivel: 'mecanismo' }],
    evidencia: [
      { t: 'Frase de prueba con efecto medido en personas (Prueba 2020).', nivel: 'clinico' },
      { t: 'Frase de prueba con un mecanismo solo visto en ratas.', nivel: 'mecanismo' },
    ],
    consulta: [{ t: 'Frase de prueba sobre qué cambia en la consulta.', nivel: 'discutido' }],
    paciente: [{ t: 'Frase de prueba para explicárselo al paciente.', apoya: [0] }],
  },
  fuentes: ['Prueba 2020'],
});

test('los bloques de docs/efectos-ejercicio.md, en su orden (mioquinas dentro del antiinflamatorio), y los tres niveles', () => {
  assert.deepEqual(BLOQUES_EJERCICIO.map(b => b.id), ['hipoalgesia', 'mecanotransduccion', 'antiinflamatorio', 'centrales', 'ortostatica', 'hipermovilidad', 'embarazo']);
  for (const b of BLOQUES_EJERCICIO) assert.ok(b.titulo && b.resumen, b.id);
  assert.deepEqual(Object.keys(NIVELES_EJERCICIO), ['clinico', 'mecanismo', 'discutido']);
  for (const n of Object.values(NIVELES_EJERCICIO)) assert.ok(n.corto && n.explicacion.length > 20);
  assert.deepEqual(APARTADOS_EJERCICIO.map(a => a.id), ['que', 'evidencia', 'consulta', 'paciente']);
});

test('un bloque con contenido cumple el esquema y sus fuentes están en el registro', () => {
  for (const b of E.bloquesConContenido()) {
    assert.deepEqual(E.problemasBloque(b), [], b.id);
    for (const k of b.fuentes) assert.ok(REFERENCIAS[k], `${b.id}: «${k}» no está en data/referencias.js`);
  }
});

test('el validador acepta un bloque correcto y rechaza los fallos de nivel y de apoyo', () => {
  assert.deepEqual(E.problemasBloque(muestra()), []);
  const sinNivel = muestra(); sinNivel.apartados.evidencia[0].nivel = 'seguro';
  assert.ok(E.problemasBloque(sinNivel).some(p => /nivel «seguro» no existe/.test(p)));
  // decisión 4: una frase para el paciente no se apoya en mecanismo ni en discutido
  const enMecanismo = muestra(); enMecanismo.apartados.paciente[0].apoya = [1];
  assert.ok(E.problemasBloque(enMecanismo).some(p => /no es de nivel 'clinico'/.test(p)));
  const sinApoyo = muestra(); delete sinApoyo.apartados.paciente[0].apoya;
  assert.ok(E.problemasBloque(sinApoyo).some(p => /no dice en qué afirmación/.test(p)));
  const fantasma = muestra(); fantasma.apartados.paciente[0].apoya = [7];
  assert.ok(E.problemasBloque(fantasma).some(p => /no es de nivel 'clinico'/.test(p)));
  const vacio = muestra(); vacio.apartados.consulta = [];
  assert.ok(E.problemasBloque(vacio).some(p => /consulta: vacío/.test(p)));
  const sinFuentes = muestra(); sinFuentes.fuentes = [];
  assert.ok(E.problemasBloque(sinFuentes).some(p => /sin fuentes/.test(p)));
});

test('cada cita dentro de la frase es una fuente de su bloque', () => {
  for (const b of E.bloquesConContenido()) {
    const usadas = new Set();
    const textos = Object.values(b.apartados).flat().map(f => typeof f === 'string' ? f : f.t);
    for (const t of textos) {
      for (const m of citasEnTexto(t).matchAll(/data-cita="([^"]+)"/g)) {
        const clave = claveRegistro(m[1].replace(/&quot;/g, '"'), REFERENCIAS);
        assert.ok(clave && b.fuentes.includes(clave), `${b.id}: «${m[1]}» no es una de sus fuentes`);
        usadas.add(clave);
      }
    }
    for (const k of b.fuentes) assert.ok(usadas.has(k), `${b.id}: «${k}» está en fuentes pero no se cita`);
  }
});

test('límites: nunca dosifica por ti ni sustituye un tratamiento médico', () => {
  const prohibido = /\b(sustituye (a )?(la |el )?(medicaci|tratamiento m)|deja (la |el )?(medicaci|tratamiento)|no necesitas (medicaci|ir al m))/i;
  for (const b of E.bloquesConContenido()) {
    for (const f of Object.values(b.apartados).flat()) assert.ok(!prohibido.test(typeof f === 'string' ? f : f.t), `${b.id}: ${f.t ?? f}`);
  }
  assert.ok(/no sustituye a un tratamiento médico/.test(TEXTOS_EJERCICIO.limites));
});

test('el HTML: leyenda de niveles, chip pulsable por afirmación, «✨ IA» por párrafo y pendientes listados', () => {
  const vacia = E.ejercicioHTML();
  assert.equal((vacia.match(/class="ej-bloque"/g) || []).length, E.bloquesConContenido().length);
  for (const k of Object.keys(NIVELES_EJERCICIO)) assert.ok(vacia.includes(`ej-nivel-${k}`), k);
  for (const b of E.bloquesPendientes()) assert.ok(vacia.includes(b.titulo), b.id);
  // Con un bloque de prueba escrito: se pinta con sus chips, y el apartado «paciente» no lleva chip
  const b = BLOQUES_EJERCICIO.find(x => x.id === 'hipoalgesia');
  const antes = b.apartados;
  b.apartados = muestra().apartados; b.fuentes = ['Prueba 2020'];
  try {
    // Solo el bloque de prueba: los demás bloques escritos tienen sus propios chips
    const html = E.ejercicioHTML().split('data-bloque="hipoalgesia"')[1].split('data-bloque="')[0];
    assert.equal((html.match(/<button type="button" class="ej-nivel /g) || []).length, 4);   // que 1 + evidencia 2 + consulta 1
    assert.equal((html.match(/class="ia-parrafo"/g) || []).length, 5);                         // + 1 de paciente
    const paciente = 'data-apartado="paciente"' + html.split('data-apartado="paciente"')[1].split('</section>')[0];
    assert.ok(!paciente.includes('ej-nivel'), 'el apartado «paciente» no lleva chip de nivel');
    assert.ok(!html.includes('<li><strong>Hipoalgesia'), 'un bloque escrito deja de estar pendiente');
  } finally { delete b.apartados; delete b.fuentes; if (antes) b.apartados = antes; }
});

test('la guía no lee el estado del paciente ni llega al payload, los resúmenes o el prompt', () => {
  const src = leer('lib/ejercicio.js');
  assert.ok(!/\bstate\b/.test(src.replace(/\/\/.*$/gm, '')), 'lib/ejercicio.js no toca state');
  withState({ region: 'lumbar', patient: 'Paciente Prueba' }, () => {
    const salida = JSON.stringify(buildPhysiQPayload()) + buildInformeFisioterapiaText() + buildContextSummaryText();
    for (const b of BLOQUES_EJERCICIO) assert.ok(!salida.includes(b.titulo) && !salida.includes(b.resumen), b.id);
    for (const t of Object.values(TEXTOS_EJERCICIO)) assert.ok(!salida.includes(t), t);
  });
});

test('app: botón de cabecera, opción en «Herramientas», funciones expuestas, ficha de nivel y deploy', () => {
  const html = leer('index.html');
  assert.ok(html.includes('id="ejercicioBtn"') && html.includes('onclick="abrirEjercicio()"'));
  assert.ok(html.includes(`onclick="herramientaElegir('ejercicio')"`));
  assert.ok(html.includes('id="ejercicioOverlay"') && html.includes('onclick="cerrarEjercicio()"'));
  for (const fn of ['abrirEjercicio', 'cerrarEjercicio']) assert.equal(typeof globalThis[fn], 'function', fn);
  const app = leer('app.js');
  assert.ok(/ejercicio: abrirEjercicio/.test(app));
  assert.ok(/_ejercicioHistorial\) \{ cerrarEjercicio\(\{ desdeHistorial: true \}\)/.test(app), 'Atrás cierra la hoja');
  assert.ok(/cerrarEjercicio\(\{ sinHistorial: true \}\)/.test(app), '_closeAllOverlays la cierra');
  const deploy = leer('.github', 'workflows', 'deploy-to-hub.yml');
  assert.ok(deploy.includes('lib/ejercicio.js'), 'lib/ejercicio.js en el deploy (data/*.js ya se copia entero)');
});

test('enlace de la fase 6: alta → hipoalgesia, baja o moderada → mecanotransducción; sin nivel, como el plan (alta)', () => {
  const id = x => E.bloqueEjercicioParaIrritabilidad(x)?.id;
  assert.equal(id('alta'), 'hipoalgesia');
  assert.equal(id('moderada'), 'mecanotransduccion');
  assert.equal(id('baja'), 'mecanotransduccion');
  for (const sin of [null, undefined, '', 'Alta', 'otra']) assert.equal(id(sin), 'hipoalgesia', String(sin));
  // Solo enlaza un bloque ya escrito y que existe
  for (const k of ['alta', 'baja']) assert.ok(BLOQUES_EJERCICIO.some(b => b.id === id(k) && b.apartados));
});

test('enlace de la fase 6: sin bloque escrito no hay enlace', () => {
  const b = BLOQUES_EJERCICIO.find(x => x.id === 'hipoalgesia');
  const antes = b.apartados;
  delete b.apartados;
  try {
    assert.equal(E.bloqueEjercicioParaIrritabilidad('alta'), null);
    assert.equal(E.enlaceEjercicioHTML('alta'), '');
    assert.ok(E.enlaceEjercicioHTML('baja').includes("abrirEjercicio({ bloque: 'mecanotransduccion' })"), 'el otro bloque sigue enlazado');
  } finally { b.apartados = antes; }
});

test('enlace de la fase 6: ofrece también el otro bloque, sin cambiar el principal', () => {
  const alta = E.enlaceEjercicioHTML('alta');
  assert.ok(alta.includes('data-bloque-alternativo="mecanotransduccion"'));
  assert.ok(alta.indexOf('data-bloque-ejercicio="hipoalgesia"') < alta.indexOf('data-bloque-alternativo'));
  assert.ok(E.enlaceEjercicioHTML('baja').includes('data-bloque-alternativo="hipoalgesia"'));
  assert.ok(E.enlaceEjercicioHTML('moderada').includes('data-bloque-alternativo="hipoalgesia"'));
  assert.ok(!alta.includes('{titulo}'));
  const b = BLOQUES_EJERCICIO.find(x => x.id === 'mecanotransduccion');
  const antes = b.apartados;
  delete b.apartados;
  try { assert.ok(!E.enlaceEjercicioHTML('alta').includes('data-bloque-alternativo')); } finally { b.apartados = antes; }
});

test('enlace de la fase 6: «Efectos centrales» con riesgo psicosocial o cuestionario de ánimo con síntomas, «antiinflamatorio» solo con lupus', () => {
  assert.deepEqual(E.motivosEjercicio({}), { animo: false, reumatica: false, ortostatica: false, hipermovilidad: false, embarazo: false });
  assert.equal(E.motivosEjercicio({ riesgoPsico: 'Bajo' }).animo, false);
  assert.equal(E.motivosEjercicio({ riesgoPsico: 'Medio' }).animo, true);
  assert.equal(E.motivosEjercicio({ riesgoPsico: 'Alto' }).animo, true);
  // PHQ-9: incompleto no cuenta; mínimo (0) no; leve (9 puntos) sí
  const r = v => ({ r: Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i + 1, v(i)])) });
  assert.equal(E.motivosEjercicio({ cuestionarios: { phq9: { r: { 1: 3 } } } }).animo, false);
  assert.equal(E.motivosEjercicio({ cuestionarios: { phq9: r(() => 0) } }).animo, false);
  assert.equal(E.motivosEjercicio({ cuestionarios: { phq9: r(i => i < 8 ? 1 : 0) } }).animo, true);
  // Un cuestionario que no es de ánimo no cuenta
  assert.ok(!E.CUESTIONARIOS_ANIMO.includes('odi'));
  assert.equal(E.motivosEjercicio({ tarjetas: { lupus: { estado: 'diagnosticado' } } }).reumatica, true);
  assert.equal(E.motivosEjercicio({ tarjetas: { lupus: { estado: 'sospecha' } } }).reumatica, false);
  const sin = E.enlaceEjercicioHTML('alta');
  assert.ok(!sin.includes('data-bloque-extra'), 'sin motivo, solo los dos de la irritabilidad');
  const con = E.enlaceEjercicioHTML('alta', { animo: true, reumatica: true });
  assert.ok(con.includes('data-bloque-extra="centrales"') && con.includes('data-bloque-extra="antiinflamatorio"'));
  assert.ok(con.includes(TEXTOS_EJERCICIO.enlaceMotivoAnimo) && con.includes(TEXTOS_EJERCICIO.enlaceMotivoReumatica));
  assert.ok(con.indexOf('data-bloque-alternativo') < con.indexOf('data-bloque-extra'), 'los extra van después');
  assert.ok(E.enlaceEjercicioHTML('baja', { animo: true }).includes("abrirEjercicio({ bloque: 'centrales' })"));
});

test('enlace de los recuadros de la fase 5: lupus → antiinflamatorio, osteoporosis → mecanotransducción, disautonomía → ortostática, hipermovilidad y embarazo → su bloque, nada más', () => {
  const les = E.enlaceCondicionEjercicioHTML('lupus', { estado: 'diagnosticado' });
  assert.ok(les.includes('data-bloque-condicion="antiinflamatorio"') && les.includes("abrirEjercicio({ bloque: 'antiinflamatorio' })"));
  assert.ok(les.includes(TEXTOS_EJERCICIO.enlaceCondicionLupus));
  const op = E.enlaceCondicionEjercicioHTML('osteoporosis', { estado: 'sospecha' });
  assert.ok(op.includes('data-bloque-condicion="mecanotransduccion"') && op.includes(TEXTOS_EJERCICIO.enlaceCondicionOsteoporosis));
  const ds = E.enlaceCondicionEjercicioHTML('disautonomia', { estado: 'sospecha' });
  assert.ok(ds.includes('data-bloque-condicion="ortostatica"') && ds.includes(TEXTOS_EJERCICIO.enlaceCondicionDisautonomia));
  const hm = E.enlaceCondicionEjercicioHTML('hipermovilidad', { estado: 'diagnosticada', subtipo: 'hipermovil' });
  assert.ok(hm.includes('data-bloque-condicion="hipermovilidad"') && hm.includes(TEXTOS_EJERCICIO.enlaceCondicionHipermovilidad));
  for (const estado of ['embarazada', 'posparto']) {
    const em = E.enlaceCondicionEjercicioHTML('embarazo', { estado });
    assert.ok(em.includes('data-bloque-condicion="embarazo"') && em.includes(TEXTOS_EJERCICIO.enlaceCondicionEmbarazo), estado);
  }
  for (const c of ['mastocitos', 'anticoagulado', 'posquirurgico', '']) assert.equal(E.enlaceCondicionEjercicioHTML(c, { estado: 'diagnosticado' }), '', c);
  // Sin estado, nada
  for (const c of ['lupus', 'osteoporosis', 'disautonomia', 'hipermovilidad', 'embarazo']) assert.equal(E.enlaceCondicionEjercicioHTML(c), '', c);
  // La fase 5 pasa el estado del payload y no decide nada por su cuenta
  const app = leer('app.js');
  assert.ok(app.includes("enlaceCondicionEjercicioHTML('lupus', { estado: d.es })"));
  assert.ok(app.includes("enlaceCondicionEjercicioHTML('hipermovilidad', { estado: d.es, subtipo: d.st, vs: d.vs })"));
  assert.ok(app.includes("enlaceCondicionEjercicioHTML('embarazo', { estado: d.es })"));
  assert.ok(!/\? ''\s*:\s*enlaceCondicionEjercicioHTML|\? enlaceCondicionEjercicioHTML/.test(app), 'sin condiciones sueltas en app.js');
  for (const t of [TEXTOS_EJERCICIO.enlaceCondicionLupus, TEXTOS_EJERCICIO.enlaceCondicionOsteoporosis, TEXTOS_EJERCICIO.enlaceCondicionDisautonomia, TEXTOS_EJERCICIO.enlaceCondicionHipermovilidad,
    TEXTOS_EJERCICIO.enlaceMotivoOrtostatica, TEXTOS_EJERCICIO.enlaceMotivoHipermovilidad, TEXTOS_EJERCICIO.enlaceCondicionEmbarazo, TEXTOS_EJERCICIO.enlaceMotivoEmbarazo]) {
    for (const f of ['lib/resumenes.js', 'lib/lupus.js', 'lib/osteoporosis.js', 'lib/disautonomia.js', 'lib/hipermovilidad.js', 'lib/embarazo.js', 'informe-ia.js', 'lib/informe-narrativo.js']) assert.ok(!leer(f).includes(t), f);
  }
});

test('condiciones: una sola regla de estados para la fase 5 y la fase 6', () => {
  const R = E.condicionEnlazaEjercicio;
  // Lupus, solo diagnosticado
  assert.equal(R('lupus', { estado: 'diagnosticado' }), true);
  assert.equal(R('lupus', { estado: 'sospecha' }), false);
  // Disautonomía y osteoporosis, en los dos estados
  for (const c of ['disautonomia', 'osteoporosis']) for (const e of ['diagnosticada', 'sospecha']) assert.equal(R(c, { estado: e }), true, `${c} ${e}`);
  // Hipermovilidad: los dos estados, nunca con el subtipo vascular diagnosticado ni con la regla vascular cumplida
  for (const st of ['hipermovil', 'otro', 'ns', '']) assert.equal(R('hipermovilidad', { estado: 'diagnosticada', subtipo: st }), true, st);
  assert.equal(R('hipermovilidad', { estado: 'sospecha' }), true);
  assert.equal(R('hipermovilidad', { estado: 'diagnosticada', subtipo: 'vascular' }), false);
  assert.equal(R('hipermovilidad', { estado: 'sospecha', vs: true }), false);
  assert.equal(R('hipermovilidad', { estado: 'diagnosticada', subtipo: 'ns', vs: true }), false);
  // Embarazo: los dos estados, sin excepciones (propuesta del bloque 8)
  for (const e of ['embarazada', 'posparto']) assert.equal(R('embarazo', { estado: e }), true, e);
  for (const c of ['lupus', 'disautonomia', 'osteoporosis', 'hipermovilidad', 'embarazo', 'mastocitos']) assert.equal(R(c, {}), false, c);
});

test('condiciones: la fase 6 enlaza lo mismo que el recuadro de la fase 5 en cada estado', () => {
  const sinResp = {}, conVascular = { hm_s_familia: 'SI' };
  const casos = [];
  for (const estado of ['', 'diagnosticada', 'sospecha']) for (const subtipo of ['', 'hipermovil', 'vascular', 'otro', 'ns'])
    for (const resp of [sinResp, conVascular]) casos.push({ estado, subtipo, resp });
  for (const { estado, subtipo, resp } of casos) {
    const tarjeta = { ...HMX.hipermovilidadVacia(), estado, subtipo };
    const d = HMX.hmPayload(tarjeta, 40, resp);
    const f5 = !!d && E.enlaceCondicionEjercicioHTML('hipermovilidad', { estado: d.es, subtipo: d.st, vs: d.vs }) !== '';
    const f6 = E.motivosEjercicio({ tarjetas: { hipermovilidad: tarjeta }, respuestas: resp }).hipermovilidad;
    assert.equal(f6, f5, `hipermovilidad ${estado}/${subtipo}/${resp === conVascular ? 'vascular' : '-'}`);
  }
  // Con la regla vascular cumplida (un «sí» mayor), sin enlace en las dos fases
  const sosp = { ...HMX.hipermovilidadVacia(), estado: 'sospecha' };
  assert.equal(HMX.hmPayload(sosp, 40, conVascular).vs, true);
  assert.equal(E.motivosEjercicio({ tarjetas: { hipermovilidad: sosp }, respuestas: conVascular }).hipermovilidad, false);
  assert.equal(E.motivosEjercicio({ tarjetas: { hipermovilidad: sosp }, respuestas: sinResp }).hipermovilidad, true);
  for (const estado of ['', 'diagnosticada', 'sospecha']) {
    assert.equal(E.motivosEjercicio({ tarjetas: { disautonomia: { estado } } }).ortostatica, !!estado, `ds ${estado}`);
    assert.equal(E.motivosEjercicio({ tarjetas: { disautonomia: { estado } } }).ortostatica, E.enlaceCondicionEjercicioHTML('disautonomia', { estado }) !== '');
  }
  for (const estado of ['', 'diagnosticado', 'sospecha']) {
    assert.equal(E.motivosEjercicio({ tarjetas: { lupus: { estado } } }).reumatica, E.enlaceCondicionEjercicioHTML('lupus', { estado }) !== '', `lupus ${estado}`);
  }
  for (const estado of ['', 'embarazada', 'posparto']) {
    const em = E.motivosEjercicio({ tarjetas: { embarazo: { estado } } }).embarazo;
    assert.equal(em, !!estado, `embarazo ${estado}`);
    assert.equal(em, E.enlaceCondicionEjercicioHTML('embarazo', { estado }) !== '', `embarazo f5/f6 ${estado}`);
  }
});

test('enlace de la fase 6: ortostática con disautonomía e hipermovilidad con su tarjeta, cada una con su motivo', () => {
  const html = E.enlaceEjercicioHTML('alta', { ortostatica: true, hipermovilidad: true });
  assert.ok(html.includes('data-bloque-extra="ortostatica"') && html.includes("abrirEjercicio({ bloque: 'ortostatica' })"));
  assert.ok(html.includes('data-bloque-extra="hipermovilidad"') && html.includes("abrirEjercicio({ bloque: 'hipermovilidad' })"));
  assert.ok(html.includes(TEXTOS_EJERCICIO.enlaceMotivoOrtostatica) && html.includes(TEXTOS_EJERCICIO.enlaceMotivoHipermovilidad));
  // Orden: ánimo, lupus, disautonomía, hipermovilidad, embarazo
  const todo = E.enlaceEjercicioHTML('alta', { animo: true, reumatica: true, ortostatica: true, hipermovilidad: true, embarazo: true });
  assert.ok(todo.includes('data-bloque-extra="embarazo"') && todo.includes(TEXTOS_EJERCICIO.enlaceMotivoEmbarazo));
  const pos = ['centrales', 'antiinflamatorio', 'ortostatica', 'hipermovilidad', 'embarazo'].map(id => todo.indexOf(`data-bloque-extra="${id}"`));
  assert.ok(pos.every(p => p > 0) && pos.every((p, i) => !i || p > pos[i - 1]), pos.join(','));
  // La osteoporosis no añade línea: «Carga y adaptación» ya sale siempre
  assert.ok(!('osteoporosis' in E.motivosEjercicio({ tarjetas: { osteoporosis: { estado: 'diagnosticada' } } })));
  // Subtipo vascular diagnosticado: sin línea de hipermovilidad
  const vasc = E.motivosEjercicio({ tarjetas: { hipermovilidad: { ...HMX.hipermovilidadVacia(), estado: 'diagnosticada', subtipo: 'vascular' } } });
  assert.ok(!E.enlaceEjercicioHTML('alta', vasc).includes('data-bloque-extra="hipermovilidad"'));
});

test('enlace de la fase 6: el botón abre el bloque y nombra cuál es', () => {
  const html = E.enlaceEjercicioHTML('alta');
  assert.ok(html.includes('data-bloque-ejercicio="hipoalgesia"'));
  assert.ok(html.includes("onclick=\"abrirEjercicio({ bloque: 'hipoalgesia' })\""));
  assert.ok(html.includes(TEXTOS_EJERCICIO.enlaceEducacion));
  assert.ok(html.includes('Hipoalgesia inducida por el ejercicio'), 'la ayuda dice a qué bloque lleva');
  assert.ok(!html.includes('{titulo}'));
});

test('enlace de la fase 6: solo en el bloque «Educación», solo en pantalla y nunca en los textos del plan', () => {
  const plan = leer('plan.js');
  assert.equal((plan.match(/enlaceEjercicioHTML\(/g) || []).length, 1);
  assert.ok(/b\.id === 'educacion' \? lista\(s\.educacion, b\.titulo\) \+ enlaceEjercicioHTML\(plan\.irritabilidad, \{ \.\.\.motivosEjercicio\(.*hipotesis: plan\.hipotesis, cronologia: state\.cronologia \}\)/.test(plan));
  assert.ok(leer('styles.css').includes('@media print { .plan-ejercicio, .cond-ejercicio { display: none !important; } }'));
  // Los textos que se comparten salen de lib/ y data/ del plan, que no conocen la guía
  for (const f of [['lib', 'plan-tratamiento.js'], ['data', 'plan-tratamiento.js'], ['lib', 'plan-ia.js']]) {
    const src = leer(...f).replace(/\/\/.*$/gm, '');
    assert.ok(!/ejercicio\.js|explicárselo al paciente/.test(src), f.join('/'));
  }
  assert.ok(/typeof opts\?\.bloque === 'string'/.test(leer('app.js')), 'abrirEjercicio acepta { bloque }');
});
