// Formulario previo. Se ejecuta desde tests/unit.js.
import { assert, test, CIF_TREES, state, buildPhysiQPayload, buildInformeFisioterapiaText,
   precargarFormularioPrevio } from './comun.mjs';

// ── Formulario previo: esquemas (formularios/*.js) y lectura (formulario.js) ──
console.log('\nformulario previo');

const { default: FP_COMUN } = await import('../../formularios/comun.js');
const fpMod = await import('../../formulario.js');
const FP_REGIONES = {};
for (const r of fpMod.REGIONES_CON_FORMULARIO) FP_REGIONES[r] = (await import(`../../formularios/${r}.js`)).default;
const FP_TIPOS = ['unica', 'multi', 'escala', 'matriz', 'texto'];
await fpMod.cargarEsquemaRegion('lumbar');   // test() es síncrono: precargar aquí
await fpMod.cargarEsquemaRegion('tobillo_pie');
await precargarFormularioPrevio();              // app.js carga formulario.js con import() dinámico

function fpItems(esq) { return esq.secciones.flatMap(s => s.items); }

for (const esq of [FP_COMUN, ...Object.values(FP_REGIONES)]) {
  test(`formulario ${esq.id}: ids únicos, tipos válidos, opciones y mostrarSi coherentes`, () => {
    const items = fpItems(esq);
    const ids = items.map(i => i.id);
    assert.equal(new Set(ids).size, ids.length, 'ids duplicados');
    items.forEach(it => {
      assert.ok(FP_TIPOS.includes(it.tipo), `${it.id}: tipo ${it.tipo}`);
      if (it.tipo === 'unica' || it.tipo === 'multi') assert.ok(it.opciones?.length, `${it.id}: sin opciones`);
      if (it.tipo === 'matriz') assert.ok(it.filas?.length && it.opciones?.length, `${it.id}: matriz incompleta`);
      if (it.detalle) assert.ok(it.opciones.includes(it.detalle.opcion), `${it.id}: detalle.opcion`);
      if (it.informe) {
        assert.ok(typeof it.informe === 'string' && it.informe.trim(), `${it.id}: informe vacío`);
        assert.notEqual(it.tipo, 'matriz', `${it.id}: informe en matriz`);
      }
      if (it.mostrarSi) {
        const ref = items.find(x => x.id === it.mostrarSi.id);
        assert.ok(ref, `${it.id}: mostrarSi → ${it.mostrarSi.id}`);
        it.mostrarSi.valores.forEach(v => assert.ok(ref.opciones.includes(v), `${it.id}: mostrarSi valor ${v}`));
      }
    });
  });
}

for (const [region, esq] of Object.entries(FP_REGIONES)) {
  test(`formulario ${region}: cada pista apunta a un paso del árbol y a una pregunta existente`, () => {
    const pasos = new Set(CIF_TREES[region].steps.map(s => s.id));
    for (const [paso, refs] of Object.entries(esq.pistas || {})) {
      assert.ok(pasos.has(paso), `paso ${paso} no existe en CIF_TREES.${region}`);
      refs.forEach(ref => {
        const [pref, rest] = ref.split(':');
        const [id, fila] = rest.split('.');
        const it = fpItems(pref === 'c' ? FP_COMUN : esq).find(x => x.id === id);
        assert.ok(it, `${ref}: pregunta inexistente`);
        if (fila) assert.ok(it.filas?.some(f => f.id === fila), `${ref}: fila inexistente`);
      });
    }
  });
}

test('resumen y pistas: solo respuestas visibles, con detalle y filas de matriz', () => {
  state.region = 'lumbar';
  state.formularioPrevio = {
    comun: { inicio: 'Poco a poco', primera_vez: 'Sí', episodio_previo: 'oculto: primera_vez ≠ No' },
    regiones: { lumbar: { pierna_hasta: 'Por debajo de la rodilla', empeora: { caminando: 'Sí' }, postura_alivio: 'Sí', postura_alivio__detalle: 'Sentado inclinado' } },
  };
  const r = fpMod.resumenFormularioPrevio();
  assert.ok(r.some(x => x.a === 'Poco a poco'));
  assert.ok(!r.some(x => x.a.startsWith('oculto')), 'mostrarSi no respetado');
  assert.ok(r.some(x => x.a === 'Sí — Sentado inclinado'));
  assert.ok(r.some(x => x.a === 'Caminando: Sí'));
  const p = fpMod.pistasPaso('lu_step2');
  assert.deepEqual(p, [{ q: 'Caminando', a: 'Sí' }]);
  assert.deepEqual(fpMod.pistasPaso('lu_step3').map(x => x.a), ['Poco a poco', 'Sí']);
});

test('formulario comun: pistas de la fase 1 apuntan a una tarjeta con hueco y a una pregunta existente', () => {
  const campos = Object.keys(FP_COMUN.pistas || {});
  assert.deepEqual(campos, ['mecanismo', 'cronologia', 'farmacos']);
  campos.forEach(campo => FP_COMUN.pistas[campo].forEach(ref => {
    assert.ok(ref.startsWith('c:'), `${ref}: la cara común solo puede apuntar a sí misma`);
    assert.ok(fpItems(FP_COMUN).some(x => x.id === ref.slice(2)), `${ref}: pregunta inexistente`);
  }));
});

test('pistas fase 1: solo lo respondido y visible, con detalle', () => {
  state.formularioPrevio = {
    comun: { desde_cuando: 'hace 5 semanas', desencadenante: 'Sí', desencadenante__detalle: 'una caída', primera_vez: 'Sí', episodio_previo: 'oculto' },
    regiones: {},
  };
  assert.deepEqual(fpMod.pistasFase1('mecanismo').map(x => x.a), ['Sí — una caída']);
  assert.deepEqual(fpMod.pistasFase1('cronologia').map(x => x.a), ['hace 5 semanas']);
  assert.deepEqual(fpMod.pistasFase1('inexistente'), []);
  // Solo lo escrito con palabras del paciente va como cita (texto libre o detalle)
  assert.deepEqual(fpMod.pistasFase1('mecanismo').map(x => x.cita), ['una caída']);
  assert.deepEqual(fpMod.pistasFase1('cronologia').map(x => x.cita), ['hace 5 semanas']);
  state.formularioPrevio.comun.inicio = 'De golpe';
  assert.ok(!fpMod.pistasFase1('mecanismo').find(x => x.a === 'De golpe').cita, 'una opción no es cita');
});

test('informe: antecedentes marcados; «prefiero comentarlo en persona» no existe en PhysiQ', () => {
  const comun = fpItems(FP_COMUN);
  assert.ok(!comun.some(i => i.id === 'en_persona'), 'en_persona se quitó a propósito (ver cabecera de formularios/comun.js)');
  assert.deepEqual(comun.filter(i => i.antecedente).map(i => i.id), ['enfermedades', 'operaciones', 'medicacion']);
  comun.filter(i => i.antecedente).forEach(i => assert.ok(i.informe, i.id));
});

test('informe: solo lo marcado, con su etiqueta, sin «No sabría decir» y actividades unidas', () => {
  state.region = 'lumbar';
  state.formularioPrevio = {
    comun: {
      inicio: 'Poco a poco', evolucion: 'A peor', despierta: 'ns',
      actividad_1: 'Conducir', actividad_2: 'Dormir', probado: ['Reposo', 'Medicación'],
      medicacion: 'Ibuprofeno 600', en_persona: ['Hay algo relacionado con esta molestia que prefiero comentarle en persona.'],
    },
    regiones: { lumbar: { pierna_hasta: 'Hasta la rodilla', pierna_lado: 'Derecha', cambia_lado: 'Sí', empeora: { caminando: 'Sí' } } },
  };
  const inf = fpMod.informeFormularioPrevio();
  assert.deepEqual(inf.historia, [
    { q: 'Evolución desde el inicio', a: 'A peor' },
    { q: 'Actividades limitadas', a: 'Conducir; Dormir' },
    { q: 'Tratamientos ya probados', a: 'Reposo, Medicación' },
    { q: 'Dolor irradiado a la pierna', a: 'Hasta la rodilla' },
    { q: 'Pierna afectada', a: 'Derecha' },
  ]);
  assert.deepEqual(inf.antecedentes, [{ q: 'Medicación actual', a: 'Ibuprofeno 600' }]);
  const txt = buildInformeFisioterapiaText();
  assert.ok(txt.includes('SEGÚN REFIERE EL PACIENTE\n  · Evolución desde el inicio: A peor'), txt);
  assert.ok(txt.includes('ANTECEDENTES REFERIDOS POR EL PACIENTE\n  · Medicación actual: Ibuprofeno 600'));
  assert.ok(!txt.includes('en persona'));
  assert.ok(!fpMod.resumenFormularioPrevio().some(x => x.a.includes('en persona')), 'respuesta antigua de en_persona');
  state.formularioPrevio = { comun: {}, regiones: {} };
  assert.ok(!buildInformeFisioterapiaText().includes('SEGÚN REFIERE'), 'sin respuestas no sale la sección');
});

test('informe tobillo y pie: mecanismo y torceduras previas, nada más de la cara 2', () => {
  state.region = 'tobillo_pie';
  state.formularioPrevio = {
    comun: {},
    regiones: { tobillo_pie: {
      que_paso: ['Se me torció el tobillo hacia dentro, apoyando el borde de fuera del pie', 'No sabría decir'],
      torceduras: 'Varias veces', chasquido: 'Sí', provoca: { correr: 'Sí' },
    } },
  };
  assert.deepEqual(fpMod.informeFormularioPrevio().historia, [
    { q: 'Cómo se lesionó', a: 'Se me torció el tobillo hacia dentro, apoyando el borde de fuera del pie' },
    { q: 'Torceduras previas del mismo tobillo', a: 'Varias veces' },
  ]);
  state.formularioPrevio = { comun: {}, regiones: {} };
});

test('payload lleva fp con el resumen del formulario', () => {
  const pl = buildPhysiQPayload();
  assert.ok(Array.isArray(pl.fp));
  state.formularioPrevio = { comun: {}, regiones: {} };
});
