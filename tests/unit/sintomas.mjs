// Varios síntomas (P1–P4) de la fase 3: docs/sintomas-multiples.md. Se ejecuta desde tests/unit.js.
import { assert, leer, test, state, buildPhysiQPayload, buildInformeFisioterapiaText, buildContextSummaryText, withState } from './comun.mjs';

console.log('\nsíntomas (P1–P4)');
const S = await import('../../lib/sintomas.js');
const { ZONAS_SINTOMA, CIF_TREES } = await import('../../data.js');
const IN = await import('../../lib/informe-narrativo.js');
const RI = await import('../../lib/revision-informe.js');

const vacio = S.sintomaVacio;
const P1 = { ...vacio(), zonas: ['lumbar', 'gluteo'], profundidad: 'Profunda', patron: 'Constante', descripcion: 'sordo' };
const P2 = { ...vacio(), zonas: ['pierna'], lado: 'Derecho', nrs: 3, irritabilidad: 'Baja', patron: 'Intermitente', relacion: 'empeora' };
const OTRA = { ...vacio(), otraRegion: true, zonaLibre: 'Rodilla', lado: 'Izquierdo', nrs: 4 };
const conSintomas = (patch, fn) => withState({ region: 'lumbar', lado: 'Derecho', severidad: 7, irritabilidadNivel: 'Moderada',
  sintomaPrincipal: P1, sintomasSecundarios: [P2, OTRA], ...patch }, fn);

test('síntomas: zonas en las regiones hechas (lumbar, cervical, hombro, codo, cadera, rodilla), ids únicos y no vacíos', () => {
  assert.deepEqual(Object.keys(ZONAS_SINTOMA).sort(), ['cadera', 'cervical', 'codo', 'hombro', 'lumbar', 'rodilla']);
  for (const [r, zonas] of Object.entries(ZONAS_SINTOMA)) {
    assert.ok(CIF_TREES[r], r);
    const ids = zonas.map(z => z.id);
    assert.equal(new Set(ids).size, ids.length, `${r}: ids repetidos`);
    zonas.forEach(z => assert.ok(z.id && z.nombre, `${r}: ${JSON.stringify(z)}`));
  }
});

test('síntomas: sesiones antiguas sin los campos se normalizan; como mucho 3 secundarios', () => {
  const st = {};
  S.normalizarSintomas(st);
  assert.deepEqual(st.sintomaPrincipal, vacio());
  assert.deepEqual(st.sintomasSecundarios, []);
  const st2 = { sintomasSecundarios: [{ nrs: 2 }, {}, {}, {}, {}] };
  S.normalizarSintomas(st2);
  assert.equal(st2.sintomasSecundarios.length, S.MAX_SECUNDARIOS);
  assert.equal(st2.sintomasSecundarios[0].nrs, 2);
  assert.deepEqual(st2.sintomasSecundarios[0].zonas, []);
});

test('síntomas: sin datos, el payload no lleva z1 y ss es []; nr / ir siguen siendo de P1', () => {
  withState({ region: 'lumbar' }, () => {
    const d = buildPhysiQPayload();
    assert.ok(!('z1' in d));
    assert.deepEqual(d.ss, []);
  });
  // Un secundario añadido pero vacío no cuenta
  withState({ region: 'lumbar', sintomasSecundarios: [vacio()] }, () => assert.deepEqual(buildPhysiQPayload().ss, []));
  conSintomas({}, () => {
    const d = buildPhysiQPayload();
    assert.equal(d.nr, 7);
    assert.equal(d.ir, 'Moderada');
    assert.deepEqual(d.z1, { z: 'Zona lumbar, glúteo', pr: 'Profunda', pa: 'Constante', de: 'sordo' });
    assert.deepEqual(d.ss, [
      { n: 2, z: 'Pierna por debajo de la rodilla', la: 'Derecho', nr: 3, ir: 'Baja', pa: 'Intermitente', re: 'empeora' },
      { n: 3, z: 'Rodilla', la: 'Izquierdo', nr: 4, or: true },
    ]);
  });
});

test('síntomas: 📋 Notas lleva la línea SÍNTOMAS con P1–P3', () => {
  conSintomas({}, () => {
    const t = buildContextSummaryText();
    assert.match(t, /SÍNTOMAS: P1 Zona lumbar, glúteo · profunda · constante · «sordo» \| P2 Pierna por debajo de la rodilla · lado derecho · NRS 3\/10 · irritabilidad baja · intermitente · solo cuando empeora P1 \| P3 Rodilla \(otra región, no valorada hoy\) · lado izquierdo · NRS 4\/10/);
  });
  withState({ region: 'lumbar' }, () => assert.doesNotMatch(buildContextSummaryText(), /SÍNTOMAS/));
});

test('síntomas: 📄 Informe en lenguaje llano (sin P1, NRS ni irritabilidad), la otra región «pendiente de valorar»', () => {
  conSintomas({}, () => {
    const t = buildInformeFisioterapiaText();
    assert.match(t, /Localización del dolor principal: zona lumbar, glúteo, constante/);
    assert.match(t, /Refiere además dolor: pierna por debajo de la rodilla \(lado derecho\), de intensidad 3\/10, que aparece cuando empeora el dolor principal/);
    assert.match(t, /Refiere también dolor: rodilla \(lado izquierdo\), pendiente de valorar/);
    const bloque = t.split('VALORACIÓN')[1].split('CRIBADO')[0];
    assert.doesNotMatch(bloque.split('Intensidad del dolor referida')[0], /\bP\d\b|NRS|irritab/i);
  });
});

test('síntomas: el prompt de la IA numera los síntomas y pide no mezclarlos; la otra región sin hipótesis ni plan', () => {
  conSintomas({}, () => {
    const t = IN.contextoValoracion(buildPhysiQPayload());
    assert.match(t, /Síntomas que refiere el paciente \(mapa corporal\):\n  · P1 \(principal; el NRS y la irritabilidad de arriba son los suyos\): Zona lumbar/);
    assert.match(t, /  · P2: Pierna por debajo de la rodilla · lado derecho · NRS 3\/10/);
    assert.match(t, /no atribuyas a uno la intensidad/);
    assert.match(t, /no se exploró: menciónalo solo como pendiente de valorar/);
    // Después de la irritabilidad, que es de P1
    assert.ok(t.indexOf('Irritabilidad:') < t.indexOf('Síntomas que refiere'));
  });
  withState({ region: 'lumbar' }, () => assert.doesNotMatch(IN.contextoValoracion(buildPhysiQPayload()), /Síntomas que refiere/));
  conSintomas({ sintomasSecundarios: [P2] }, () => assert.doesNotMatch(IN.contextoValoracion(buildPhysiQPayload()), /no se exploró/));
});

test('síntomas: revisión — el NRS de un secundario figura en la valoración; su lado no es una contradicción', () => {
  conSintomas({}, () => {
    const datos = buildPhysiQPayload();
    const ids = RI.revisarInforme('El dolor de la pierna (3/10) aparece al empeorar el lumbar (7/10); también refiere dolor en la rodilla izquierda.', { datos }).map(p => p.id);
    assert.ok(!ids.includes('nrs'), ids.join());
    assert.ok(!ids.includes('lado'), ids.join());
    assert.ok(ids.includes('lado-sintoma'), ids.join());
    // Sin síntomas en el otro lado, la regla de siempre
    const sinOtro = { ...datos, ss: datos.ss.filter(s => !s.or) };
    assert.ok(RI.revisarInforme('Dolor en la pierna izquierda.', { datos: sinOtro }).some(p => p.id === 'lado'));
    assert.ok(RI.revisarInforme('Dolor de 5/10.', { datos }).some(p => p.id === 'nrs'));
  });
});

test('síntomas: cervical — zonas en payload y 📋 Notas (región con lado «Central»)', () => {
  withState({ region: 'cervical', lado: 'Central', severidad: 6, irritabilidadNivel: 'Moderada',
    sintomaPrincipal: { ...vacio(), zonas: ['cuello', 'trapecio'] },
    sintomasSecundarios: [{ ...vacio(), zonas: ['antebrazo_mano'], lado: 'Derecho', nrs: 4, relacion: 'empeora' }] }, () => {
    const d = buildPhysiQPayload();
    assert.deepEqual(d.z1, { z: 'Cuello, trapecio o escápula' });
    assert.equal(d.ss[0].z, 'Antebrazo y mano');
    assert.match(buildContextSummaryText(), /SÍNTOMAS: P1 Cuello, trapecio o escápula \| P2 Antebrazo y mano · lado derecho · NRS 4\/10/);
  });
});

test('síntomas: hombro — zonas en payload, 📋 Notas y 📄 Informe', () => {
  withState({ region: 'hombro', lado: 'Derecho', severidad: 5, irritabilidadNivel: 'Baja',
    sintomaPrincipal: { ...vacio(), zonas: ['hombro_lat'], patron: 'Intermitente' },
    sintomasSecundarios: [{ ...vacio(), zonas: ['bajo_codo'], nrs: 2, relacion: 'juntos' }] }, () => {
    const d = buildPhysiQPayload();
    assert.deepEqual(d.z1, { z: 'Hombro lateral (deltoides)', pa: 'Intermitente' });
    assert.equal(d.ss[0].z, 'Por debajo del codo');
    assert.match(buildContextSummaryText(), /SÍNTOMAS: P1 Hombro lateral \(deltoides\) · intermitente \| P2 Por debajo del codo · NRS 2\/10 · aparece y desaparece con P1/);
    assert.match(buildInformeFisioterapiaText(), /Refiere además dolor: por debajo del codo, de intensidad 2\/10, que aparece y desaparece con el dolor principal/);
  });
});

test('síntomas: codo — zonas en payload y 📋 Notas', () => {
  withState({ region: 'codo', lado: 'Izquierdo', severidad: 4, irritabilidadNivel: 'Baja',
    sintomaPrincipal: { ...vacio(), zonas: ['codo_lat'], profundidad: 'Profunda' },
    sintomasSecundarios: [{ ...vacio(), zonas: ['antebrazo', 'mano'], nrs: 3, relacion: 'independiente' }] }, () => {
    const d = buildPhysiQPayload();
    assert.deepEqual(d.z1, { z: 'Codo lateral', pr: 'Profunda' });
    assert.equal(d.ss[0].z, 'Antebrazo, mano');
    assert.match(buildContextSummaryText(), /SÍNTOMAS: P1 Codo lateral · profunda \| P2 Antebrazo, mano · NRS 3\/10 · independiente de P1/);
  });
});

test('síntomas: cadera — zonas en payload, 📋 Notas y 📄 Informe', () => {
  withState({ region: 'cadera', lado: 'Derecho', severidad: 6, irritabilidadNivel: 'Moderada',
    sintomaPrincipal: { ...vacio(), zonas: ['ingle'], patron: 'Intermitente' },
    sintomasSecundarios: [{ ...vacio(), zonas: ['rodilla'], nrs: 3, relacion: 'juntos' }] }, () => {
    const d = buildPhysiQPayload();
    assert.deepEqual(d.z1, { z: 'Ingle', pa: 'Intermitente' });
    assert.equal(d.ss[0].z, 'Rodilla');
    assert.match(buildContextSummaryText(), /SÍNTOMAS: P1 Ingle · intermitente \| P2 Rodilla · NRS 3\/10 · aparece y desaparece con P1/);
    assert.match(buildInformeFisioterapiaText(), /Localización del dolor principal: ingle, intermitente/);
  });
});

test('síntomas: rodilla — zonas en payload, 📋 Notas y 📄 Informe', () => {
  withState({ region: 'rodilla', lado: 'Izquierdo', severidad: 5, irritabilidadNivel: 'Baja',
    sintomaPrincipal: { ...vacio(), zonas: ['rodilla_ant'], patron: 'Intermitente' },
    sintomasSecundarios: [{ ...vacio(), zonas: ['rodilla_post'], nrs: 2, relacion: 'nosabe' }] }, () => {
    const d = buildPhysiQPayload();
    assert.deepEqual(d.z1, { z: 'Rodilla anterior (rótula)', pa: 'Intermitente' });
    assert.equal(d.ss[0].z, 'Rodilla posterior (hueco poplíteo)');
    assert.match(buildContextSummaryText(), /SÍNTOMAS: P1 Rodilla anterior \(rótula\) · intermitente \| P2 Rodilla posterior \(hueco poplíteo\) · NRS 2\/10 · relación con P1 no conocida/);
    assert.match(buildInformeFisioterapiaText(), /Refiere además dolor: rodilla posterior \(hueco poplíteo\), de intensidad 2\/10\n/);
  });
});

test('síntomas: la tarjeta y el módulo existen y van en el despliegue', () => {
  assert.match(leer('index.html'), /id="cardSintomas" hidden/);
  const dep = leer('.github/workflows/deploy-to-hub.yml');
  assert.match(dep, / sintomas\.js /);
  assert.match(dep, /lib\/sintomas\.js/);
});

// Que state quede como lo dejó el test (los siguientes temas parten de withState)
state.sintomasSecundarios = [];
