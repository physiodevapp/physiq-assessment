// Verificador con IA (capa 3). Se ejecuta desde tests/unit.js.
import { assert, readFileSync, existsSync, readdirSync, join, TESTS, leer, test } from './comun.mjs';

// ── Verificador con IA (capa 3, lib/verificacion-informe.js) ─────────────────
{
  const VI = await import('../../lib/verificacion-informe.js');
  const RI = await import('../../lib/revision-informe.js');
  const dir = join(TESTS, 'fixtures', 'informes');
  const datos = { p: 'Ana Pérez', d: '8/10/2026', r: 'rodilla', la: 'Izquierdo', mo: 'Dolor al correr', nr: 5, h: [{ name: 'Dolor Patelofemoral' }] };

  test('verificación: el prompt lleva datos, transcripción e informe; sin audio lo dice; explica cada extracción', () => {
    const p = VI.promptVerificacion(datos, { transcripcion: 'Me duele al bajar escaleras.', informe: 'TEXTO DEL INFORME' });
    assert.match(p, /## DATOS DE VALORACIÓN ESTRUCTURADA/);
    assert.match(p, /Motivo de consulta: Dolor al correr/);
    assert.match(p, /TRANSCRIPCIÓN DE LA CONSULTA:\nMe duele al bajar escaleras\./);
    assert.match(p, /INFORME A REVISAR:\nTEXTO DEL INFORME/);
    assert.match(VI.promptVerificacion(datos, { informe: 'x' }), /No hubo audio/);
    for (const c of VI.CAMPOS_EXTRACCION) assert.match(p, new RegExp(`^- ${c}:`, 'm'), `el prompt explica ${c}`);
    assert.match(p, /No tienes que juzgar si el informe está bien/, 'extrae, no busca fallos');
    assert.match(p, /Lo que solo dice la transcripción consta; lo que viene de la pauta de PhysiQ consta/);
  });
  test('verificación: el esquema son las seis extracciones, todas obligatorias, y cabe en /verify', () => {
    const E = VI.ESQUEMA_VERIFICACION;
    assert.equal(E.type, 'object');
    assert.deepEqual(E.required, VI.CAMPOS_EXTRACCION);
    assert.deepEqual(Object.keys(E.properties), VI.CAMPOS_EXTRACCION);
    for (const c of VI.CAMPOS_EXTRACCION) {
      const it = E.properties[c].items;
      assert.equal(E.properties[c].type, 'array');
      assert.deepEqual(it.required, Object.keys(it.properties), `${c}: todos sus campos obligatorios`);
      if (c !== 'siglas') assert.ok(it.properties.cita, `${c} lleva cita`);
    }
    assert.ok(JSON.stringify(E).length < 10000, 'cabe en el límite de /verify');
    assert.ok(VI.MAX_TOKENS_VERIFICACION <= 4000, 'cabe en el límite de /verify');
  });
  test('verificación: los puntos se derivan de las extracciones en código', () => {
    const vacio = Object.fromEntries(VI.CAMPOS_EXTRACCION.map(c => [c, []]));
    assert.deepEqual(VI.listaPuntos(vacio), [], 'sin extracciones, sin puntos');
    const p = VI.puntosDeExtraccion({
      tests_alternativas: [
        { test: 'PA unilateral dolorosa o con menos movilidad', cita: 'reproduce dolor y se aprecia restricción', afirma_las_dos: true },
        { test: 'Otro (a o b)', cita: 'x', afirma_las_dos: false },
      ],
      indicaciones: [
        { cita: 'restringida por indicación médica', quien_la_dio: 'fisioterapeuta', evidencia: 'bici estática sí', atribuida_en_informe: 'médico', como_si_ya_lo_hiciera: false },
        { cita: 'tal como se le había indicado previamente', quien_la_dio: 'fisioterapeuta', evidencia: 'x', atribuida_en_informe: 'indicación previa', como_si_ya_lo_hiciera: false },
        { cita: 'Mantiene la actividad en bicicleta estática', quien_la_dio: 'fisioterapeuta', evidencia: 'x', atribuida_en_informe: 'sin atribuir', como_si_ya_lo_hiciera: true },
        { cita: 'sin coger peso según el cirujano', quien_la_dio: 'cirujano', evidencia: 'x', atribuida_en_informe: 'cirujano', como_si_ya_lo_hiciera: false },
      ],
      afirmaciones: [
        { cita: 'más que neurógeno', clase: 'interpretación', consta_en: 'no consta', evidencia: 'no consta' },
        { cita: 'parestesias', clase: 'síntoma', consta_en: 'transcripción', evidencia: 'se me duerme la mano' },
      ],
      siglas: [
        { sigla: 'KTW', cita: 'test de Kleiger-Torg-Weiss', desarrollo_en_informe: 'Kleiger-Torg-Weiss', desarrollo_en_datos: '' },
        { sigla: 'SLAP', cita: 'SLAP', desarrollo_en_informe: '', desarrollo_en_datos: '' },
      ],
      pronostico: [
        { cita: 'la lesión labral aislada es infrecuente', uso: 'interpretar tests' },
        { cita: 'Si a las 12 semanas no mejora', uso: 'seguimiento' },
      ],
      plan: [
        { cita: 'programa de ejercicio bilateral', elemento: 'otra zona o lado', origen: 'no consta', evidencia: 'no consta' },
        { cita: 'ejercicio de cuádriceps', elemento: 'técnica', origen: 'pauta de PhysiQ', evidencia: 'x' },
        { cita: 'el mismo programa para la otra rodilla', elemento: 'otra zona o lado', origen: 'fisioterapeuta' },
      ],
    });
    assert.deepEqual(p.map(x => `${x.tipo}:${x.nivel}`), [
      'lectura:alto', 'atribucion:alto', 'atribucion:alto', 'atribucion:medio',
      'no-respaldado:medio', 'lectura:alto', 'lectura:medio', 'plan:alto', 'plan:alto',
    ]);
    assert.match(p[1].mensaje, /la dio el fisioterapeuta y el informe la atribuye al médico/);
  });
  test('verificación: una lista ilegible invalida la respuesta; un array en texto se lee', () => {
    const vacio = Object.fromEntries(VI.CAMPOS_EXTRACCION.map(c => [c, []]));
    assert.equal(VI.validarPuntos({ ...vacio, plan: '[]' }, 'x').invalida, false);
    assert.equal(VI.validarPuntos({ ...vacio, plan: '[{"cita": "tipo "brazo muerto""}]' }, 'x').invalida, true);
    const { plan, ...sinPlan } = vacio;
    assert.equal(VI.validarPuntos(sinPlan, 'x').invalida, true, 'falta una lista');
  });
  test('verificación: un «contradice» con las dos versiones en una frase se descarta', () => {
    assert.ok(VI.discrepanciaUnida('No refiere hormigueo, aunque alguna noche nota la mano dormida.'));
    assert.ok(VI.discrepanciaUnida('Refiere que el dolor no le despierta por la noche, aunque también describe despertares.'));
    assert.ok(!VI.discrepanciaUnida('Niega dolor nocturno.'));
    assert.ok(!VI.discrepanciaUnida('Refiere dolor al correr, aunque mejora con reposo.'), 'sin negación antes');
    const inf = 'No refiere hormigueo, aunque alguna noche nota la mano dormida. Niega dolor nocturno.';
    const r = VI.validarPuntos({ puntos: [
      { tipo: 'contradice', nivel: 'alto', cita: 'No refiere hormigueo, aunque alguna noche nota la mano dormida', evidencia: 'x', mensaje: 'y' },
      { tipo: 'contradice', nivel: 'alto', cita: 'Niega dolor nocturno', evidencia: 'x', mensaje: 'y' },
    ] }, inf);
    assert.deepEqual(r.puntos.map(p => p.cita), ['Niega dolor nocturno']);
    assert.deepEqual(r.descartados.map(d => d.motivo), ['discrepancia-unida']);
  });
  test('verificación: la cita debe estar en el informe (markdown, comillas, espacios y «…» no cuentan)', () => {
    const inf = '## Dolor\nRefiere **dolor** «punzante»   al correr.\nNiega hormigueo en la pierna derecha.';
    assert.ok(VI.citaEnInforme('Refiere dolor "punzante" al correr', inf));
    assert.ok(VI.citaEnInforme('Refiere dolor «punzante» … hormigueo en la pierna', inf));
    assert.ok(!VI.citaEnInforme('Refiere dolor punzante al caminar', inf), 'una paráfrasis no vale');
    assert.ok(!VI.citaEnInforme('hormigueo en la pierna … Refiere dolor', inf), 'los trozos van en orden');
    assert.ok(!VI.citaEnInforme('', inf));
    assert.ok(!VI.citaEnInforme('dolor', inf), 'demasiado corta para comprobarla');
    assert.ok(VI.citaEnInforme('Niega hormigueo en la pierna', 'y niega hormigueo en la pierna.'), 'sin distinguir mayúsculas (cita media frase con mayúscula inicial)');
  });
  test('verificación: validarPuntos descarta citas inventadas, tipos raros y repetidos; la omisión no lleva cita', () => {
    const inf = 'Practica ciclismo de manera habitual. Refiere dolor al peinarse.';
    const { puntos, descartados } = VI.validarPuntos({ puntos: [
      { tipo: 'no-respaldado', nivel: 'medio', cita: 'Practica ciclismo de manera habitual', evidencia: 'No consta', mensaje: 'Frecuencia inferida' },
      { tipo: 'no-respaldado', nivel: 'medio', cita: 'Practica ciclismo de manera habitual.', evidencia: 'No consta', mensaje: 'Repetido' },
      { tipo: 'contradice', nivel: 'alto', cita: 'Refiere dolor al ducharse', evidencia: 'x', mensaje: 'Cita inventada' },
      { tipo: 'estilo', nivel: 'medio', cita: 'Refiere dolor al peinarse', evidencia: 'x', mensaje: 'Tipo fuera del esquema' },
      { tipo: 'omision', nivel: 'urgente', cita: 'algo que no está', evidencia: 'Me da miedo que se mueva el clavo', mensaje: 'Falta el miedo al clavo' },
      { tipo: 'atribucion', nivel: 'medio', cita: 'Refiere dolor al peinarse', evidencia: 'x', mensaje: '' },
    ] }, inf);
    assert.deepEqual(puntos.map(p => p.tipo), ['no-respaldado', 'omision']);
    assert.equal(puntos[1].cita, '', 'la omisión pierde la cita');
    assert.equal(puntos[1].nivel, 'medio', 'un nivel fuera del esquema pasa a medio');
    assert.deepEqual(descartados.map(d => d.motivo), ['cita', 'tipo', 'mensaje']);
    assert.deepEqual(VI.validarPuntos(null, inf).puntos, []);
    assert.equal(VI.validarPuntos(null, inf).invalida, true, 'sin lista: inválida (se repite la llamada)');
    assert.equal(VI.validarPuntos({ repaso: 'x', puntos: [] }, inf).invalida, false, 'lista vacía: válida');
    const comoTexto = VI.validarPuntos({ puntos: JSON.stringify([{ tipo: 'no-respaldado', nivel: 'medio', cita: 'Practica ciclismo de manera habitual', evidencia: 'x', mensaje: 'y' }]) }, inf);
    assert.equal(comoTexto.puntos.length, 1, '`puntos` como texto JSON se lee');
    assert.equal(comoTexto.invalida, false);
    assert.equal(VI.validarPuntos({ puntos: '[{"tipo": "contradice", "cita": "tipo "brazo muerto""}]' }, inf).invalida, true, 'texto con comillas sin escapar: inválida');
    const muchos = Array.from({ length: 20 }, (_, i) => ({ tipo: 'omision', nivel: 'medio', cita: '', evidencia: `dato ${i}`, mensaje: `falta ${i}` }));
    assert.equal(VI.validarPuntos({ puntos: muchos }, inf).puntos.length, VI.MAX_PUNTOS_VERIFICACION);
  });
  test('verificación: compararConEsperados separa aciertos, lo que ya marca la capa 1 y lo sin etiquetar', () => {
    const errores = [
      { id: 'bici', nivel: 'alto', fragmentos: ['restringida por indicación médica'] },
      { id: 'clavo', nivel: 'medio', claves: ['clavo'] },
      { id: 'otro', nivel: 'medio', fragmentos: ['nunca citado'] },
    ];
    const r = VI.compararConEsperados([
      { tipo: 'atribucion', cita: 'esta actividad se encuentra restringida por indicación médica hasta noviembre', mensaje: 'x', evidencia: '' },
      { tipo: 'omision', cita: '', mensaje: 'Falta el miedo', evidencia: 'que se me mueva el clavo' },
      { tipo: 'repetido', cita: 'La osteosíntesis se realizó el 15 de junio', mensaje: 'x', evidencia: '' },
      { tipo: 'no-respaldado', cita: 'Algo nuevo', mensaje: 'x', evidencia: '' },
    ], errores, ['La osteosíntesis se realizó el 15 de junio de 2026.']);
    assert.deepEqual(r.detectados.sort(), ['bici', 'clavo']);
    assert.deepEqual(r.fallados, ['otro']);
    assert.equal(r.redundantes.length, 1);
    assert.deepEqual(r.sinEtiquetar.map(p => p.cita), ['Algo nuevo']);
    // Con los puntos de la capa 1 (no solo sus citas), una frase distinta de la misma familia ya está cubierta
    const capa1 = [
      { id: 'plan-urgente', mensaje: 'x', cita: 'El abordaje incluirá manipulación cervical.' },
      { id: 'diagnostico', mensaje: 'Nombra diagnósticos que no están en los datos: «hemorragia».', cita: 'Otra frase.' },
      { id: 'repetido', mensaje: 'La edad (34 años) aparece 3 veces; va una sola vez, en Factores Personales.', cita: 'Paciente de sexo femenino, 34 años de edad.' },
      { id: 'discrepancia-separada', mensaje: 'Hormigueo: lo niega en una frase y lo describe en otra.', cita: 'Niega parestesias.' },
    ];
    const f = VI.compararConEsperados([
      { tipo: 'plan', cita: 'Se incorporará biofeedback a 20 mmHg', mensaje: 'x', evidencia: '' },
      { tipo: 'no-respaldado', cita: 'para descartar hemorragia subaracnoidea', mensaje: 'x', evidencia: '' },
      { tipo: 'contradice', cita: 'paciente de 34 años', mensaje: 'x', evidencia: '' },
      { tipo: 'no-respaldado', cita: 'Describe episodios ocasionales de parestesia en la mano', mensaje: 'x', evidencia: '' },
      { tipo: 'no-respaldado', cita: 'Refiere dolor de 7/10 al correr', mensaje: 'x', evidencia: '' },
    ], [], capa1);
    assert.equal(f.redundantes.length, 4, JSON.stringify(f.sinEtiquetar));
    assert.deepEqual(f.sinEtiquetar.map(p => p.cita), ['Refiere dolor de 7/10 al correr']);
    // Las claves de una omisión cuentan en otro tipo de punto si están todas
    const om = [{ id: 'clavo', nivel: 'medio', claves: ['clavo', 'miedo'] }];
    assert.deepEqual(VI.compararConEsperados([{ tipo: 'no-respaldado', cita: 'No manifiesta aprensión', mensaje: 'En consulta refiere miedo a que se mueva el clavo', evidencia: '' }], om).detectados, ['clavo']);
    assert.deepEqual(VI.compararConEsperados([{ tipo: 'no-respaldado', cita: 'x', mensaje: 'Refiere miedo al movimiento', evidencia: '' }], om).detectados, [], 'una sola clave no basta fuera de una omisión');
  });
  test('verificación: esperado-capa3.json cubre los informes reales y sus fragmentos están en cada informe', () => {
    const E = JSON.parse(readFileSync(join(dir, 'esperado-capa3.json'), 'utf8'));
    const enTabla = leer('tests', 'unit', 'revision-informe.mjs').match(/\['valoracion-[^\n]+/g).map(l => l.match(/'([\w-]+\.txt)'/)?.[1]).filter(Boolean);
    assert.deepEqual(E.informes.map(c => c.informe).sort(), [...new Set(enTabla)].sort(), 'los mismos informes que «revisión: informes reales»');
    const ids = new Set();
    for (const c of E.informes) {
      const texto = RI.quitarCabeceraYPie(readFileSync(join(dir, c.informe), 'utf8'));
      assert.ok(existsSync(join(dir, c.valoracion)), c.valoracion);
      if (c.transcripcion) assert.ok(existsSync(join(dir, c.transcripcion)), c.transcripcion);
      assert.ok(['narrativo', 'breve'].includes(c.plantilla));
      for (const e of c.errores) {
        assert.ok(!ids.has(e.id), `id repetido: ${e.id}`); ids.add(e.id);
        assert.ok(VI.TIPOS_VERIFICACION[e.tipo], `${e.id}: tipo ${e.tipo}`);
        assert.ok(['alto', 'medio'].includes(e.nivel), `${e.id}: nivel`);
        assert.ok((e.fragmentos || []).length || (e.claves || []).length, `${e.id}: sin fragmentos ni claves`);
        for (const f of e.fragmentos || []) assert.ok(VI.citaEnInforme(f, texto), `${e.id}: «${f}» no está en ${c.informe}`);
      }
    }
  });
  test('verificación: las respuestas guardadas (capa3/) se validan sin romper', () => {
    const dResp = join(dir, 'capa3');
    if (!existsSync(dResp)) return;
    const E = JSON.parse(readFileSync(join(dir, 'esperado-capa3.json'), 'utf8'));
    for (const f of readdirSync(dResp).filter(n => n.endsWith('.json'))) {
      const c = E.informes.find(x => f.startsWith(x.informe.replace(/\.txt$/, '') + '.'));
      assert.ok(c, `${f} no corresponde a ningún informe de esperado-capa3.json`);
      const r = JSON.parse(readFileSync(join(dResp, f), 'utf8'));
      const { puntos } = VI.validarPuntos(r.result, RI.quitarCabeceraYPie(readFileSync(join(dir, c.informe), 'utf8')));
      for (const p of puntos) assert.ok(p.tipo === 'omision' || p.cita, f);
    }
  });
}
