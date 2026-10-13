// Revisión automática del informe y paquete de revisión. Se ejecuta desde tests/unit.js.
import { assert, readFileSync, execFileSync, join, RAIZ, TESTS, leer, test, SYSTEMIC_SCREENING,
   state, revisarArchivos, formatearPuntos } from './comun.mjs';
const IN = await import('../../lib/informe-narrativo.js');

// ── Revisión automática del informe (lib/revision-informe.js) ────────────────
console.log('\npaquete de revisión del informe con IA');
{
  const Z = await import('../../lib/zip.js');
  const PR = await import('../../lib/paquete-revision.js');
  const await_VJ = await import('../../lib/valoracion-json.js');
  const VJ_LEER = t => await_VJ.leerImportacion(t, Object.keys(SYSTEMIC_SCREENING));
  // Lector mínimo del zip «stored» para comprobar lo que escribe lib/zip.js
  const leerZip = bytes => {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const dec = new TextDecoder();
    const fin = bytes.length - 22;
    assert.equal(dv.getUint32(fin, true), 0x06054b50, 'fin del directorio central');
    const n = dv.getUint16(fin + 10, true);
    let p = dv.getUint32(fin + 16, true);
    const out = [];
    for (let i = 0; i < n; i++) {
      assert.equal(dv.getUint32(p, true), 0x02014b50, 'entrada central');
      assert.equal(dv.getUint16(p + 8, true) & 0x0800, 0x0800, 'nombres en UTF-8');
      const crc = dv.getUint32(p + 16, true), tam = dv.getUint32(p + 20, true), ln = dv.getUint16(p + 28, true), off = dv.getUint32(p + 42, true);
      const nombre = dec.decode(bytes.subarray(p + 46, p + 46 + ln));
      assert.equal(dv.getUint32(off, true), 0x04034b50, 'cabecera local');
      const ini = off + 30 + dv.getUint16(off + 26, true);
      const datos = bytes.subarray(ini, ini + tam);
      assert.equal(Z.crc32(datos), crc, `CRC de ${nombre}`);
      out.push({ nombre, texto: dec.decode(datos) });
      p += 46 + ln;
    }
    return out;
  };
  test('zip: los ficheros vuelven tal cual, con acentos en nombre y contenido y CRC correcto', () => {
    const f = [{ nombre: 'lucía-informe.txt', texto: 'Dolor en la ingle, ñandú\n' }, { nombre: 'vacio.txt', texto: '' }, { nombre: 'b.json', texto: '{"a":1}' }];
    assert.deepEqual(leerZip(Z.crearZip(f, new Date(2026, 9, 9, 10, 30))), f);
    assert.equal(Z.crc32(new TextEncoder().encode('123456789')), 0xCBF43926, 'CRC-32 de referencia');
  });
  const ahora = new Date(2026, 9, 9, 10, 30);
  const st = { ...JSON.parse(JSON.stringify(state)), patient: 'Daniel Ortega', region: 'cadera', maxVisitedIdx: 5, currentPhase: 5 };
  const inf = { texto: '## CONDICIÓN DE SALUD\n\nTexto.', transcripcion: 'Daniel refiere dolor.', fecha: '2026-10-09T08:00:00Z', conAudio: true, dictado: true,
    plantilla: 'narrativo', prompt: 'PROMPT EXACTO', version: 'abc1234', huella: 'x' };
  const puntos = [{ id: 'constantes', nivel: 'medio', mensaje: 'Clasifica las constantes.', cita: 'dentro de parámetros habituales' }, { id: 'urgencia', nivel: 'alto', mensaje: 'Falta la derivación.' }];
  test('paquete: nombres como en tests/fixtures/informes, comandos para reproducir y la valoración importable', () => {
    const { nombre, ficheros } = PR.ficherosPaquete({ inf, informe: 'INFORME DE FISIOTERAPIA\nPaciente: Daniel Ortega\n\nTexto.', state: { ...st, informeIA: inf }, puntos,
      comprobaciones: ['Cada indicación…'], nombrePlantilla: 'Narrativo', versionActual: 'def5678', ahora });
    assert.equal(nombre, 'revision-informe-daniel-ortega-2026-10-09.zip');
    assert.deepEqual(ficheros.map(f => f.nombre), ['info.txt', 'daniel-ortega-dictado-informe.txt', 'daniel-ortega-dictado-transcripcion.txt', 'revision.txt', 'valoracion-daniel-ortega.json', 'prompt.txt']);
    const de = n => ficheros.find(f => f.nombre === n).texto;
    assert.match(de('info.txt'), /node tools\/revisar-informe\.mjs valoracion-daniel-ortega\.json daniel-ortega-dictado-informe\.txt narrativo --transcripcion daniel-ortega-dictado-transcripcion\.txt/);
    assert.match(de('info.txt'), /node tools\/prompt-desde-json\.mjs valoracion-daniel-ortega\.json narrativo --dictado/);
    assert.match(de('info.txt'), /versión abc1234/);
    assert.match(de('info.txt'), /versión def5678/);
    assert.match(de('info.txt'), /Audio: dictado del fisioterapeuta/);
    assert.match(de('info.txt'), /2 puntos \(1 de nivel alto\)/);
    assert.equal(de('prompt.txt'), 'PROMPT EXACTO');
    const r = VJ_LEER(de('valoracion-daniel-ortega.json'));
    assert.ok(r.ok, r.error);
    assert.ok(!('informeIA' in r.assessmentState), 'sin el informe, como «⬇ Exportar»');
    assert.match(de('revision.txt'), /^\[MEDIO\] constantes: Clasifica las constantes\.\n   «dentro de parámetros habituales»/m, 'mismo formato que tools/revisar-informe.mjs');
    assert.match(de('revision.txt'), /ANTES DE COMPARTIR, COMPRUEBA\n- Cada indicación…/);
    assert.ok(leerZip(Z.crearZip(ficheros, ahora)).length === 6, 'el zip sale entero');
  });
  test('paquete: sin audio, sin prompt guardado (informe anterior) y sin puntos', () => {
    const viejo = { texto: 'T', fecha: '', conAudio: false, plantilla: 'breve' };
    const { ficheros } = PR.ficherosPaquete({ inf: viejo, informe: 'T', state: st, ahora });
    assert.deepEqual(ficheros.map(f => f.nombre), ['info.txt', 'daniel-ortega-sin-audio-ficha-breve.txt', 'revision.txt', 'valoracion-daniel-ortega.json']);
    const info = ficheros[0].texto;
    assert.match(info, /Prompt: no guardado/);
    assert.match(info, /no registrada/);
    assert.match(info, /revisar-informe\.mjs valoracion-daniel-ortega\.json daniel-ortega-sin-audio-ficha-breve\.txt breve\n/);
    assert.match(info, /prompt-desde-json\.mjs valoracion-daniel-ortega\.json breve\n/);
    assert.match(ficheros[2].texto, /sin incidencias/);
    assert.equal(PR.ficherosPaquete({ inf: { ...viejo, conAudio: true, transcripcion: 'Hola' }, informe: 'T', state: st, ahora }).ficheros[1].nombre, 'daniel-ortega-audio-ficha-breve.txt');
  });
  const RV = await import('../../lib/revision-informe.js');
  test('revisados: la clave es regla + frase citada; el recuento separa puntos, altos y comprobaciones', () => {
    const comprob = ['Atribución de cada indicación.', 'Otra zona o lado.'];
    const vacio = RV.resumenRevisados(puntos, comprob, undefined);
    assert.deepEqual([vacio.total, vacio.pendientes, vacio.altosPendientes, vacio.puntosPendientes, vacio.comprobacionesPendientes], [4, 4, 1, 2, 2]);
    const marcados = [RV.clavePunto(puntos[1]), RV.claveComprobacion(comprob[0])];
    const r = RV.resumenRevisados(puntos, comprob, marcados);
    assert.deepEqual([r.pendientes, r.altosPendientes, r.puntosPendientes, r.comprobacionesPendientes], [2, 0, 1, 1]);
    // La misma regla con otra frase es otro punto: no hereda la marca
    const otra = { ...puntos[0], cita: 'normotenso' };
    assert.notEqual(RV.clavePunto(otra), RV.clavePunto(puntos[0]));
    assert.equal(RV.resumenRevisados([otra], [], [RV.clavePunto(puntos[0])]).puntosPendientes, 1);
    // Sin cita (omisión): la clave usa el mensaje
    assert.equal(RV.clavePunto(puntos[1]), 'p|urgencia|Falta la derivación.');
  });
  test('revisados: el paquete marca lo revisado en revision.txt; un informe nuevo empieza sin marcas', () => {
    const conMarcas = { ...inf, revisados: [RV.clavePunto(puntos[0]), RV.claveComprobacion('Cada indicación…')] };
    const rev = PR.ficherosPaquete({ inf: conMarcas, informe: 'T', state: st, puntos, comprobaciones: ['Cada indicación…', 'Otra zona.'], ahora })
      .ficheros.find(f => f.nombre === 'revision.txt').texto;
    assert.match(rev, /marcados como revisados: 1/);
    assert.match(rev, /^\[MEDIO\] constantes: Clasifica las constantes\. \[revisado\]$/m);
    assert.match(rev, /^\[ALTO\] urgencia: Falta la derivación\.$/m);
    assert.match(rev, /^- Cada indicación… \[revisado\]$/m);
    assert.match(rev, /^- Otra zona\.$/m);
    const src = leer('informe-ia.js');
    const nuevo = src.slice(src.indexOf('state.informeIA = {'), src.indexOf('};', src.indexOf('state.informeIA = {')));
    assert.ok(nuevo && !/revisados/.test(nuevo), 'el informe recién generado no arrastra marcas');
    assert.equal(typeof globalThis.iaMarcarRevisado, 'function');
  });
  test('paquete: la tarjeta guarda el prompt y la versión al generar, y el botón está expuesto', () => {
    const src = leer('informe-ia.js');
    const nuevo = src.slice(src.indexOf('state.informeIA = {'), src.indexOf('};', src.indexOf('state.informeIA = {')));
    assert.match(nuevo, /\bprompt\b/, 'el prompt exacto que se envió');
    assert.match(nuevo, /version: VERSION_SHA\b/);
    assert.match(src, /import\('\.\/lib\/zip\.js'\)/, 'zip con import() dinámico: solo al usarlo');
    assert.equal(typeof globalThis.iaPaqueteRevision, 'function');
  });
}

console.log('\nrevisión automática del informe con IA');
{
  const RI = await import('../../lib/revision-informe.js');
  const base = { p: 'Pedro Flores', d: '07/10/2026', r: 'hombro', la: 'Derecho', nr: 4, br: [], sq: [], pn: { variableControl: 'Parar si supera 4/10.' }, md: 'completo',
    h: [{ name: 'Lesión Labral Superior (SLAP)' }, { name: 'Luxación Bloqueada o Fractura (→ Rx)', dt: true }, { name: 'Postoperatorio: clavo', pq: true }],
    fp: [{ s: 'Hombro', q: '¿Le han dicho alguna vez que tiene…?', a: 'Diabetes o el azúcar alto: No · Problemas de tiroides: No sé' }] };
  const amp = { edad: 52, sexo: 'Hombre', pautas: [] };
  const rev = (t, o = {}) => RI.revisarInforme(t, { datos: { ...base, ...o.datos }, ampliado: { ...amp, ...o.ampliado }, plantilla: o.plantilla || 'narrativo', transcripcion: o.transcripcion || '' });
  const ids = (t, o) => rev(t, o).map(p => p.id);
  const limpio = 'Paciente de 52 años con dolor en el hombro derecho de 4/10. La lesión labral superior queda apoyada por los tests.';

  test('revisión: un informe correcto no da puntos', () => {
    assert.deepEqual(rev(limpio), []);
  });
  test('revisión: derivaciones que faltan son de nivel alto y van primero', () => {
    const p = rev(limpio + ' Se recomienda descansar.', { datos: { ur: ['TVP: urgencias'] }, ampliado: { pautas: [{ hipotesis: 'Fractura', derivar: true }] } });
    assert.equal(p[0].nivel, 'alto');
    assert.ok(p.some(x => x.id === 'derivacion-urgente') && p.some(x => x.id === 'derivar-hipotesis'));
    assert.ok(!ids(limpio + ' Se deriva a urgencias hoy.', { datos: { ur: ['x'] } }).includes('derivacion-urgente'));
    assert.ok(!ids(limpio, { ampliado: { pautas: [{ hipotesis: 'Fractura', derivar: true, tratada: true }] } }).includes('derivar-hipotesis'), 'tratada: no se exige derivar');
  });
  test('revisión: lado, edad, sexo y NRS que contradicen la valoración', () => {
    assert.ok(ids('Dolor en el hombro izquierdo.').includes('lado'));
    assert.ok(ids('Hombro derecho.', { datos: { la: '' } }).includes('lado-no-consta'));
    assert.ok(!ids('Hombro derecho.', { datos: { la: '' }, transcripcion: 'me duele el derecho' }).includes('lado-no-consta'), 'lo dijo en consulta');
    assert.ok(ids('Paciente de 43 años.').includes('edad'));
    assert.ok(ids('Paciente de 43 años.', { ampliado: { edad: null } }).includes('edad-no-consta'));
    assert.ok(ids('Mujer de 52 años.').includes('sexo'));
    assert.ok(ids('Varón de 52 años.', { ampliado: { sexo: '' } }).includes('sexo-no-consta'));
    assert.ok(ids('Dolor de 6/10.').includes('nrs'));
    assert.ok(!ids('Dolor de 4 sobre 10 y control a 4/10.').includes('nrs'));
    // Un rango (irritabilidad «4-6/10») no valida el 6 suelto
    assert.ok(ids('Dolor de 6/10.', { datos: { ir: 'Media (4-6/10)' } }).includes('nrs'));
    // Con audio: el pico «un 8 de 10» (o «ocho de diez») dicho en la consulta vale
    assert.ok(!ids('Llega a 8 sobre 10 al correr.', { transcripcion: 'llega a un 8 de 10' }).includes('nrs'));
    assert.ok(!ids('Llega a 8/10 al correr.', { transcripcion: 'llega a un ocho de diez' }).includes('nrs'));
    assert.ok(ids('Llega a 9/10 al correr.', { transcripcion: 'llega a un 8 de 10' }).includes('nrs'));
    // …y la respuesta suelta tras «¿cuánto te duele de 0 a 10?» (Daniel: «llegó a un 7»)
    const tr10 = '¿Cuánto te duele de 0 a 10? Ahora un 4. El domingo pasado, después del partido, llegó a un 7. ¿Notas algún ruido?';
    assert.ok(!ids('Tras el partido llegó a 7 sobre 10.', { transcripcion: tr10 }).includes('nrs'));
    assert.ok(ids('Tras el partido llegó a 9 sobre 10.', { transcripcion: tr10 }).includes('nrs'));
    assert.ok(ids('Llega a 9/10.', { transcripcion: 'Me lo dijo un 9 de cada diez médicos.' }).includes('nrs'), 'sin la pregunta, «un 9» no cuenta');
    // El otro lado dicho en la consulta: punto medio a comprobar, no contradicción
    const otro = rev('También molestias en el hombro izquierdo.', { transcripcion: 'el izquierdo también me molesta' });
    assert.ok(otro.some(x => x.id === 'lado-otro' && x.nivel === 'medio') && !otro.some(x => x.id === 'lado'));
  });
  test('revisión: reglas de redacción (nombre, fecha, jerga, descarta, relleno, fuentes, secuelas)', () => {
    assert.ok(ids('Pedro Flores refiere dolor.').includes('nombre'));
    assert.ok(ids('Valorado el 07/10/2026.').includes('fecha'));
    assert.ok(ids('El test tiene un LR+ de 3.').includes('jerga'));
    assert.ok(ids('La exploración permite descartar origen cervical.').includes('descarta'));
    assert.ok(!ids('Las comprobaciones no la descartan.').includes('descarta'), '«no la descartan» es correcto');
    assert.ok(ids('No se dispone de goniometría.').includes('relleno'));
    assert.ok(!ids('No se identifican banderas rojas.').includes('relleno'), '«No se identifican» no es «No sé»');
    assert.ok(ids('Según el formulario, refiere dolor.').includes('fuentes'));
    assert.ok(ids('Según la variable de control, parar a 4/10.').includes('fuentes'));
    for (const f of ['Según el cuestionario inicial, refiere dolor.', 'Este dato no se confirma en la conversación clínica.',
      'Dolor al sentarse, aunque no se menciona en consulta.', 'Niega dolor nocturno, aunque en consulta refiere despertares.',
      'Sin dolor nocturno inicialmente referido.'])
      assert.ok(ids(f).includes('fuentes'), f);
    assert.ok(!ids('Acude a consulta por dolor en el hombro derecho.').includes('fuentes'), '«acude a consulta» es correcto');
    assert.ok(ids('La exploración confirma la hipótesis de lesión labral.').includes('confirma'));
    for (const f of ['Hipótesis de trabajo, pendiente de confirmar.', 'Restricciones a confirmar con el cirujano.',
      'La exploración confirma dolor anterior durante la sentadilla.', 'Los tests no confirman la hipótesis.'])
      assert.ok(!ids(f).includes('confirma'), f);
  });
  test('revisión: edad repetida y criterio de reconsiderar fuera de Seguimiento', () => {
    assert.ok(ids('Paciente de 52 años. ### Factores Personales Hombre de 52 años.').includes('repetido'));
    assert.ok(!ids(limpio).includes('repetido'));
    const fuera = '## CONCLUSIONES\nEjercicio. Si a las 12 semanas no mejora, reconsiderar el diagnóstico.\n## SEGUIMIENTO FUNCIONAL\nKujala.';
    assert.ok(ids(fuera).includes('seguimiento-fuera'));
    assert.ok(!ids('## CONCLUSIONES\nEjercicio.\n## SEGUIMIENTO FUNCIONAL\nSi no mejora en 12 semanas, reconsiderar.').includes('seguimiento-fuera'));
    assert.ok(!ids(fuera, { plantilla: 'breve' }).includes('seguimiento-fuera'), 'la ficha no tiene Seguimiento');
    assert.ok(ids('Hallazgos propios de la fase de consolidación.').includes('fisiopatologia'));
    assert.ok(ids('Secuelas esperables de la cirugía.').includes('fisiopatologia'));
  });
  test('revisión: «No sé» convertido en negativo', () => {
    const p = rev(limpio + ' No refiere diabetes ni problemas tiroideos.');
    const n = p.find(x => x.id === 'no-se');
    assert.ok(n && /tiroides/.test(n.mensaje), JSON.stringify(p));
    assert.ok(!ids(limpio + ' No refiere diabetes.').includes('no-se'), 'la diabetes sí se contestó «No»');
  });
  test('revisión: diagnóstico que «no cumple los criterios» propuesto como hipótesis adicional (ronda 32)', () => {
    const trans = 'No cumple todos los criterios de un síndrome de dolor regional complejo pero lo dejo anotado para vigilarlo.';
    const p = rev(limpio + '\n### Hipótesis adicionales a valorar\nPosible síndrome de dolor regional complejo en fase inicial.\n## SEGUIMIENTO FUNCIONAL\nReevaluar.', { transcripcion: trans }).find(x => x.id === 'hipotesis-no-cumple');
    assert.ok(p && /síndrome de dolor regional complejo/.test(p.mensaje), 'nombre con acentos en el mensaje');
    assert.ok(!ids(limpio + '\n## CONCLUSIONES\nLos cambios del pie se vigilarán y se comentarán con el cirujano.', { transcripcion: trans }).includes('hipotesis-no-cumple'), 'como hallazgo a vigilar, no salta');
    assert.ok(!ids(limpio + '\n### Hipótesis adicionales a valorar\nPosible síndrome de dolor regional complejo.').includes('hipotesis-no-cumple'), 'sin el «no cumple» en la consulta, no salta');
  });
  test('prompt: lo que «no cumple los criterios» no va en Hipótesis adicionales (ronda 32)', () => {
    const pr = IN.buildNarrativePrompt({ p: 'X', h: [{ name: 'Debilidad de abductores' }] }, { conAudio: true, dictado: true });
    assert.ok(pr.includes(IN.AVISO_NO_CUMPLE));
    assert.ok(pr.includes('no cumple los criterios de un diagnóstico no va aquí'));
  });
  test('revisión: «sin aumento del edema» es un criterio, no niega la hinchazón (ronda 31)', () => {
    const t = limpio + ' Refiere edema del pie al final del día. La carga se dosifica sin aumento del edema del pie al día siguiente.';
    assert.ok(!ids(t).includes('discrepancia-separada'), 'criterio de carga');
    assert.ok(ids(limpio + ' Refiere edema del pie al final del día. Niega hinchazón.').includes('discrepancia-separada'), 'la negación sigue contando');
  });
  test('revisión: «No sé» frente a las restricciones del cirujano (ronda 30)', () => {
    const fp = [{ s: 'Cadera', q: '¿Le aparece o le aumenta el dolor al…?', a: 'Caminar: Sí · Cruzar las piernas: No sé' }];
    const cq = { iv: 'Prótesis', fe: '', se: 5, pr: 'Escrito', re: 'Precauciones de luxación: no flexionar más de 90°, no cruzar las piernas', co: [] };
    const t = limpio + ' El protocolo indica no flexionar más de 90 grados, no cruzar las piernas.';
    assert.ok(!ids(t, { datos: { fp, cq } }).includes('no-se'), 'cita la restricción, no niega el síntoma');
    assert.ok(ids(t + ' Niega dolor al cruzar las piernas.', { datos: { fp, cq } }).includes('no-se'), 'la negación del síntoma sigue saliendo');
    assert.ok(ids(t, { datos: { fp } }).includes('no-se'), 'sin cirugía, la frase sigue contando');
  });
  test('revisión: códigos CIF según la plantilla', () => {
    assert.ok(ids('Dolor (b28016) al correr (d4552).', { plantilla: 'breve' }).every(i => i !== 'cif'));
    assert.match(rev('Dolor al entrenar (e1101).', { plantilla: 'breve' }).find(x => x.id === 'cif').mensaje, /e1101/);
    assert.ok(ids('Dolor (b28016).', { plantilla: 'narrativo' }).includes('cif'), 'el narrativo no lleva códigos');
  });
  test('revisión: hipótesis sin nombrar (no las tratadas ni la posquirúrgica), modo breve y longitud', () => {
    const p = rev('Paciente de 52 años con dolor en el hombro derecho.');
    assert.match(p.find(x => x.id === 'hipotesis').mensaje, /Lesión Labral Superior \(SLAP\)/);
    assert.ok(!/Luxación|Postoperatorio/.test(p.find(x => x.id === 'hipotesis').mensaje));
    assert.ok(ids(limpio, { datos: { md: 'breve' } }).includes('breve'));
    assert.ok(!ids(limpio + ' Valoración breve; queda pendiente el cribado.', { datos: { md: 'breve' } }).includes('breve'));
    assert.ok(ids(limpio + ' palabra'.repeat(950), { plantilla: 'breve' }).includes('longitud'));
  });
  test('revisión: hallazgos atribuidos a la evolución esperable', () => {
    assert.ok(ids('La rigidez es coherente con la evolución esperable en el período posquirúrgico.').includes('atribucion'));
    assert.ok(ids('Restricción compatible con el período posquirúrgico.').includes('atribucion'));
    assert.ok(!ids('Restricción global de la movilidad pasiva, compatible con el contexto traumático previo.').includes('atribucion'), 'el trauma viene del recorrido');
  });
  test('revisión: discrepancia escrita en dos frases (y no cuando va en una)', () => {
    const p = rev('Describe episodios ocasionales de parestesia en la mano. Niega crujidos, bloqueos o parestesias intermitentes.');
    assert.match(p.find(x => x.id === 'discrepancia-separada')?.mensaje || '', /^Hormigueo/);
    assert.ok(ids('No refiere dolor en sedestación prolongada. La sedestación prolongada aumenta el dolor.').includes('discrepancia-separada'));
    assert.ok(!ids('Refiere que el dolor no le despierta por la noche, aunque también describe despertares ocasionales al girarse.').includes('discrepancia-separada'), 'las dos versiones juntas es lo correcto');
    assert.ok(!ids('No refiere hormigueo, aunque alguna noche nota la mano dormida.').includes('discrepancia-separada'));
    assert.ok(!ids('Dolor de 6/10 por la noche. Realiza la sentadilla sin dolor.').includes('discrepancia-separada'), '«sentadilla» no es sedestación');
  });
  test('revisión: fecha de la cirugía repetida', () => {
    const cq = { datos: { cq: { fe: '15/06/2026' } } };
    assert.ok(ids('Operado el 15 de junio de 2026. ### Intervención Quirúrgica Se realizó el 15/06/2026.', cq).includes('repetido'));
    assert.ok(!ids('Operado el 15 de junio de 2026. Revisión en noviembre.', cq).includes('repetido'));
    assert.ok(!ids('El 15 de junio y el 15 de junio.').includes('repetido'), 'sin cirugía no se mira');
  });
  test('revisión: síntoma copiado de un ejemplo (despertares) solo si no consta', () => {
    const t = 'Dolor de 4/10, aunque también describe despertares ocasionales al girarse en la cama.';
    const p = rev(t);
    assert.ok(p[0].id === 'inventado' && p[0].nivel === 'alto', JSON.stringify(p));
    assert.ok(!ids(t, { transcripcion: '¿Te despierta por la noche? Alguna noche sí.' }).includes('inventado'), 'lo dijo en consulta');
    assert.ok(!ids(t, { datos: { fp: [{ s: 'General', q: '¿Le despierta el dolor por la noche?', a: 'A veces' }] } }).includes('inventado'), 'lo contestó en el formulario');
  });
  test('revisión: secciones fuera del orden de la plantilla (solo narrativo)', () => {
    const bien = '## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES\nx\n### Factores Personales\nx\n## HISTORIA CLÍNICA Y EVOLUCIÓN\n### Intervención Quirúrgica\nx\n### Cribado de Seguridad\nx';
    assert.ok(!ids(bien).includes('estructura'));
    const mal = '## CONDICIÓN DE SALUD Y FACTORES CONTEXTUALES\n### Intervención Quirúrgica\nx\n### Cribado de Seguridad\nx\n## HISTORIA CLÍNICA Y EVOLUCIÓN\n### Presentación Inicial y Antecedentes\nx';
    assert.match(rev(mal).find(x => x.id === 'estructura')?.mensaje || '', /«Intervención Quirúrgica», «Cribado de Seguridad»/);
    assert.ok(!ids(mal, { plantilla: 'breve' }).includes('estructura'));
    // El texto copiado (sin #) también vale: los títulos son líneas enteras
    assert.ok(ids(mal.replace(/#+ /g, '')).includes('estructura'));
  });
  test('revisión: «cuestionario QuickDASH» no es una fuente; tratamientos negados y «escenario posquirúrgico»', () => {
    assert.ok(!ids('Se utilizará el cuestionario QuickDASH para medir la evolución.').includes('fuentes'));
    assert.ok(ids('Según el cuestionario inicial, refiere dolor.').includes('fuentes'));
    assert.ok(ids('El recorrido de la exploración muestra restricción.').includes('fuentes'));
    assert.ok(ids('No se refieren tratamientos específicos previos.').includes('relleno'));
    assert.ok(ids('El conjunto de hallazgos es coherente con el escenario posquirúrgico.').includes('atribucion'));
  });
  test('revisión: sin sexo registrado, el género no se marca', () => {
    const sin = { ampliado: { sexo: '' } };
    for (const f of ['Niega dolor al permanecer sentada.', 'Las preocupaciones de la paciente.', 'El paciente refiere dolor.'])
      assert.ok(ids(f, sin).includes('genero'), f);
    assert.ok(!ids('Su hermano fue operado de la columna. Paciente de 63 años.', sin).includes('genero'), 'un familiar operado o «Paciente de…» no marcan el género');
    assert.ok(!ids('Niega dolor al permanecer sentado.').includes('genero'), 'con sexo registrado no se mira');
  });
  test('revisión: «se deriva… para descartar» y «Cuestionario de Roland-Morris» no son fallos', () => {
    assert.ok(!ids('Se deriva al médico para valorar la circulación y descartar claudicación vascular.').includes('descarta'));
    assert.ok(ids('La exploración permite descartar origen cervical.').includes('descarta'));
    assert.ok(!ids('Se recomienda el Cuestionario de Discapacidad de Roland-Morris.').includes('fuentes'));
    assert.ok(!ids('Se usará el cuestionario de Oswestry.').includes('fuentes'));
    assert.ok(ids('Según el cuestionario inicial, refiere dolor.').includes('fuentes'));
  });
  test('revisión: «en la conversación», el formulario pendiente en modo breve y el cirujano repetido', () => {
    assert.ok(ids('En la conversación precisa que el dolor es de 4/10.').includes('fuentes'));
    const pend = 'Valoración breve: quedan pendientes el cribado detallado y el formulario previo.';
    assert.ok(!ids(pend, { datos: { md: 'breve' } }).includes('fuentes'), 'en modo breve, el formulario pendiente es un pendiente');
    assert.ok(ids(pend + ' La variable de control es el dolor.', { datos: { md: 'breve' } }).includes('fuentes'), 'sigue buscando después');
    assert.ok(ids(pend).includes('fuentes'), 'fuera de modo breve sigue contando');
    const cir = 'Pendiente de confirmar con el cirujano. Se supedita a lo que confirme el cirujano. Una vez confirmado con el cirujano, se progresará.';
    assert.match(rev(cir).find(x => x.id === 'repetido')?.mensaje || '', /cirujano aparece 3 veces/);
    assert.ok(!ids('Restricciones pendientes de confirmar con el cirujano. Ejercicio.').includes('repetido'));
  });
  test('revisión: plan con derivación urgente, diagnósticos que no constan e IMC clasificado', () => {
    const plan = '## CONCLUSIONES Y PLAN DE TRATAMIENTO\nSe deriva a urgencias hoy. Después, manipulación cervical y ejercicio terapéutico.\n## SEGUIMIENTO FUNCIONAL\nNDI.';
    const p = rev(plan, { datos: { ur: ['Cefalea con signos de alarma: derivación a urgencias hoy.'] } });
    assert.ok(p.some(x => x.id === 'plan-urgente' && x.nivel === 'alto'), JSON.stringify(p));
    assert.ok(!ids(plan).includes('plan-urgente'), 'sin derivación urgente, el plan es normal');
    assert.ok(!ids('## CONCLUSIONES Y PLAN DE TRATAMIENTO\nSe deriva a urgencias hoy; se retomará la valoración tras la valoración médica.', { datos: { ur: ['x'] } }).includes('plan-urgente'));
    assert.match(rev('Para descartar hemorragia subaracnoidea o patología intracraneal.').find(x => x.id === 'diagnostico')?.mensaje || '', /«hemorragia», «intracraneal»/);
    assert.ok(!ids('Antecedente de cáncer de mama.', { transcripcion: 'tuve un cáncer de mama' }).includes('diagnostico'), 'lo dijo en consulta');
    assert.ok(!ids('Requiere valoración médica urgente para descartar otras causas.').includes('descarta'), 'descartar en una frase de valoración médica es correcto');
    assert.ok(ids('IMC de 25,2 (normopeso).', { datos: { an: { imc: 25.2 } } }).includes('imc'));
    assert.ok(!ids('IMC de 25,2 (sobrepeso).', { datos: { an: { imc: 25.2 } } }).includes('imc'));
    assert.ok(!ids('IMC de 22 (normopeso).', { datos: { an: { imc: 22 } } }).includes('imc'));
  });
  test('revisión: «para descartar» algo que no consta y negativos en Limitaciones (decimoquinta revisión)', () => {
    const dx = ids(limpio + ' Si no mejora, ecografía para descartar bursitis o comunicación de la vaina.');
    assert.ok(dx.includes('descartar-inventado'));
    assert.ok(!dx.includes('descarta'), 'la misma frase no sale dos veces');
    assert.ok(!ids(limpio + ' Se pide ecografía para descartar bursitis.', { transcripcion: 'creo que es una bursitis' }).includes('descartar-inventado'), 'consta en la consulta');
    assert.ok(!ids(limpio + ' Se pedirá valoración para descartar otras causas de dolor persistente.').includes('descartar-inventado'), 'palabras genéricas');
    assert.ok(!ids(limpio + ' La exploración permite descartar origen cervical.').includes('descartar-inventado'), 'solo «para descartar»');
    const lim = '## ANÁLISIS DEL FUNCIONAMIENTO\n### Limitaciones en las Actividades\nLe cuesta chutar. No refiere limitación al caminar ni al calzarse.\n### Restricciones en la Participación\nFútbol.';
    assert.ok(ids(lim).includes('limitaciones-negativas'));
    assert.ok(ids(lim.replace('No refiere limitación al caminar ni al calzarse.', 'Niega dolor al toser.')).includes('limitaciones-negativas'));
    assert.ok(!ids(lim.replace('No refiere limitación al caminar ni al calzarse.', '')).includes('limitaciones-negativas'));
    assert.ok(!ids('### Dolor\nNiega dolor al toser.\n### Limitaciones en las Actividades\nLe cuesta chutar.\n### Restricciones en la Participación\nX.').includes('limitaciones-negativas'), 'en Dolor sí van');
    assert.ok(!ids(lim, { plantilla: 'breve' }).includes('limitaciones-negativas'));
  });
  test('prompt: tests con «o» marcados, pronóstico como contexto, tiempos e imagen (decimoquinta revisión)', () => {
    const b = IN.bloquesAmpliados({ tests: [{ hipotesis: 'Psoas', items: [
      { test: 'Palpación dolorosa supra o infrainguinal', resultado: 'positivo' },
      { test: 'Flexión resistida o extensión pasiva en Thomas modificado', resultado: 'negativo' },
      { test: 'Test de Thomas', resultado: 'positivo' }] }] }).join('\n');
    assert.match(b, /supra o infrainguinal: positivo \(positivo si se cumple al menos una de las alternativas: descríbelo con las mismas palabras, sin afirmar las dos\)/);
    assert.ok(!/Thomas modificado: negativo \(positivo si/.test(b), 'solo los positivos');
    assert.ok(!/Test de Thomas: positivo \(/.test(b), 'solo los que tienen alternativas');
    const p = IN.PLANTILLAS.narrativo.prompt({ p: 'X', h: [{ name: 'H' }] }, { conAudio: true });
    assert.match(p, /«hace X» se refiere al día de la consulta/);
    assert.match(p, /Pruebas de imagen y derivaciones: recógelas solo como las indicó el fisioterapeuta, sin añadir qué se busca con ellas/);
  });
  test('prompt: modo dictado — cabecera, quién habla y pista de Whisper (decimosexta revisión)', () => {
    const d = { p: 'X', h: [{ name: 'H' }] };
    for (const [k, pl] of Object.entries(IN.PLANTILLAS)) {
      const dic = pl.prompt(d, { conAudio: true, dictado: true });
      assert.match(dic, /DICTADO DEL FISIOTERAPEUTA \(transcripción de lo que narra el fisioterapeuta/, `${k}: cabecera del dictado`);
      assert.match(dic, /En él habla solo el fisioterapeuta: lo que dice en primera persona.*son sus hallazgos e indicaciones; lo que introduce con «refiere», «dice» o «comenta» es lo que refiere el paciente/, `${k}: quién habla`);
      assert.match(dic, /«no la he hecho», «ese no lo he explorado»\) no se hizo y no aparece en el informe de ninguna forma: ni como realizado ni para decir que no se hizo/, `${k}: lo no hecho no se describe ni se dice que no se hizo (ronda 29)`);
      const dia = pl.prompt(d, { conAudio: true });
      assert.ok(!/DICTADO/.test(dia) && /La transcripción complementa/.test(dia), `${k}: el diálogo no cambia`);
      assert.ok(!/DICTADO/.test(pl.prompt(d, { conAudio: false, dictado: true })), `${k}: sin audio no hay dictado`);
      assert.match(dic, /«dictado»/, `${k}: «dictado» entre las fuentes que no se nombran`);
    }
    assert.match(IN.getWhisperPrompt('cadera', { dictado: true }), /^Dictado de un fisioterapeuta.*Thomas modificado/);
    assert.ok(!/Dictado/.test(IN.getWhisperPrompt('cadera')), 'sin dictado, la pista de siempre');
    assert.match(IN.getWhisperPrompt('cadera'), /Ingle, dolor inguinal, psoas ilíaco, Thomas modificado/);
    assert.deepEqual(Object.keys(IN.MODOS_AUDIO), ['dialogo', 'dictado']);
  });
  test('formulario para la IA: en las matrices de actividades solo van las filas «Sí»', () => {
    const dir = join(TESTS, 'fixtures', 'informes');
    const p = execFileSync(process.execPath, [join(RAIZ, 'tools', 'prompt-desde-json.mjs'), join(dir, 'valoracion-daniel-ortega-cadera.json'), 'narrativo'], { encoding: 'utf8' });
    assert.match(p, /Agacharse o sentarse en una silla baja: Sí/);
    assert.ok(!/Caminar: No/.test(p) && !/Cruzar las piernas: No/.test(p), 'los «No» de actividades no van');
    assert.match(p, /se engancha o se bloquea: No/, 'los «No» de síntomas sí van');
  });
  test('revisión: frecuencia inferida de una actividad («con regularidad», «de forma habitual»)', () => {
    const fq = (texto, fuente = '') => RI.frecuenciaInferida(texto, fuente);
    assert.equal(fq('Practica ciclismo de manera habitual.')?.actividad, 'el ciclismo');
    assert.equal(fq('Acude al gimnasio con regularidad.')?.actividad, 'el gimnasio');
    assert.equal(fq('Mantiene actividad física regular en bicicleta.')?.actividad, 'el ciclismo');
    assert.equal(fq('Practica carrera de forma regular.', '· ¿hace a menudo alguna de estas cosas? (puede marcar varias) → Correr'), null, 'el formulario da la frecuencia (pregunta y respuesta en la misma línea)');
    assert.equal(fq('Sale en bici con regularidad.', '¿Sales en bici? Sí, cada domingo.'), null, 'la consulta da la frecuencia');
    assert.ok(fq('Acude al gimnasio con regularidad.', 'Trabajo con los brazos por encima de la cabeza a menudo. El sábado, haciendo pesas en el gimnasio, me dio'), 'una frecuencia de otra actividad no vale');
    assert.equal(fq('La intensidad habitual del dolor es 6/10.'), null, 'sin actividad no cuenta');
    assert.equal(fq('Practica ciclismo.'), null, 'sin frecuencia no cuenta');
    assert.equal(fq('Dolor en condiciones habituales durante la carrera.'), null, '«condiciones habituales» no es una frecuencia');
    assert.ok(ids('Practica ciclismo de manera habitual.').includes('frecuencia'));
  });
  test('revisión: formulario contradicho, propiedades de un test, fallo articular separado', () => {
    const fp = [{ s: 'Rodilla', q: '¿Nota alguna de estas cosas?', a: 'Un chasquido o un clic que le duele: Sí · Le falla o cede: No' }];
    const rv = texto => RI.revisarInforme(texto, { datos: { p: 'X', r: 'cadera', d: '01/01/2026', br: [], sq: [], pn: {}, h: [], fp } }).map(p => p.id);
    assert.ok(rv('Refiere un chasquido por delante de la cadera que no le duele.').includes('formulario-contradicho'));
    assert.ok(!rv('Refiere un chasquido doloroso por delante de la cadera.').includes('formulario-contradicho'));
    assert.ok(!rv('Refiere un chasquido que le duele, aunque hoy dice que no le duele.').includes('formulario-contradicho'), 'las dos versiones en una frase');
    assert.ok(!rv('Refiere un chasquido al subir la pierna, y niega dolor en reposo.').includes('formulario-contradicho'), 'la negación es de otra cláusula');
    assert.ok(rv('El test de Thomas es el más específico.').includes('test-propiedades'));
    assert.ok(rv('Al pivotar nota que la rodilla se le iba. Niega que le falle o ceda.').includes('discrepancia-separada'));
    assert.ok(!rv('Niega mareo o inestabilidad. El test de inestabilidad en prono es positivo.').includes('discrepancia-separada'), '«inestabilidad» suelta no es un fallo articular');
    assert.ok(!rv('La flexión no la refuerza pero tampoco la descarta.').includes('descarta'));
    const conTr2 = (texto, transcripcion) => RI.revisarInforme(texto, { datos: { p: 'X', r: 'tobillo_pie', d: '01/01/2026', br: [], sq: [], pn: {}, h: [] }, transcripcion }).map(p => p.id);
    assert.ok(conTr2('Toma ibuprofeno.', 'Su médico de cabecera le dijo que dejara de correr.').includes('indicacion-omitida'));
    assert.ok(!conTr2('El médico de cabecera le indicó dejar de correr.', 'Su médico de cabecera le dijo que dejara de correr.').includes('indicacion-omitida'));
    assert.ok(rv('Signos vitales dentro de parámetros esperables.').includes('constantes'));
    assert.ok(rv('Se valorará una ecografía para una valoración más detallada.').includes('imagen-motivo'));
    assert.ok(rv('En consulta, comenta que nota el tendón hinchado.').includes('fuentes'));
    assert.ok(rv('Refiere que nota el tendón hinchado. Niega hinchazón en el pie.').includes('discrepancia-separada'), 'hinchazón');
    assert.ok(rv('En caso de no observarse mejoría en 12 semanas, se pedirá una ecografía.\n## SEGUIMIENTO FUNCIONAL\nVISA-A.').includes('seguimiento-fuera'));
    assert.ok(rv('El izquierdo, aspecto que no ha sido explorado.').includes('relleno'));
    const conTr = (texto, transcripcion) => RI.revisarInforme(texto, { datos: { p: 'X', r: 'tobillo_pie', d: '01/01/2026', br: [], sq: [], pn: {}, h: [], nr: 3 }, transcripcion }).map(p => p.id);
    assert.ok(!conTr('Los primeros pasos duelen (4/10).', 'Ahora el dolor está en un 2 sobre 10; corriendo llega a un 5 y por la mañana los primeros pasos a un 4.').includes('nrs'), '«un 4» tras una cifra «sobre 10»');
    assert.ok(conTr('Los primeros pasos duelen (7/10).', 'Ahora el dolor está en un 2 sobre 10; corriendo llega a un 5.').includes('nrs'), 'una cifra que no se dijo sigue saltando');
    assert.ok(rv('Niega episodios de fallo o de que la rodilla cede. Al pivotar, la rodilla se le iba.').includes('discrepancia-separada'), '«episodios de fallo», «la rodilla cede»');
    const conSexo = texto => RI.revisarInforme(texto, { datos: { p: 'X', r: 'rodilla', d: '01/01/2026', br: [], sq: [], pn: {}, h: [] }, ampliado: { sexo: 'Mujer' } }).map(p => p.id);
    assert.ok(conSexo('La persona atendida eleva la pierna extendida.').includes('genero'));
    assert.ok(!rv('La persona atendida eleva la pierna extendida.').includes('genero'), 'sin sexo registrado, la fórmula neutra es lo correcto');
  });
  {
    const dir = join(TESTS, 'fixtures', 'informes');
    const herramienta = join(RAIZ, 'tools', 'revisar-informe.mjs');
    const casos = [
      ['valoracion-lucia-romero-audio.json', 'lucia-audio-1-informe.txt', 'lucia-audio-transcripcion.txt', ['lado-otro', 'repetido', 'fuentes', 'discrepancia-separada']],
      ['valoracion-lucia-romero-audio.json', 'lucia-audio-2-informe.txt', 'lucia-audio-transcripcion.txt', ['lado-otro', 'confirma', 'repetido', 'seguimiento-fuera', 'limitaciones-negativas']],
      ['valoracion-lucia-romero-breve.json', 'lucia-ficha-breve-sin-audio.txt', null, ['fuentes']],
      ['valoracion-pedro-flores-audio.json', 'pedro-audio-1-informe.txt', 'pedro-audio-transcripcion.txt', ['atribucion', 'frecuencia', 'discrepancia-separada', 'repetido']],
      ['valoracion-pedro-flores-audio.json', 'pedro-audio-2-informe.txt', 'pedro-audio-transcripcion.txt', ['inventado', 'relleno', 'fuentes', 'atribucion', 'frecuencia', 'repetido', 'estructura']],
      ['valoracion-andrea-ruiz-lumbar.json', 'andrea-audio-1-informe.txt', 'andrea-audio-transcripcion.txt', ['genero', 'limitaciones-negativas']],
      ['valoracion-carmen-vidal-tobillo-breve.json', 'carmen-audio-1-ficha-breve.txt', 'carmen-audio-transcripcion.txt', ['relleno', 'fuentes', 'repetido']],
      ['valoracion-javier-soto-cervical.json', 'javier-audio-1-informe.txt', 'javier-audio-transcripcion.txt', ['plan-urgente', 'frecuencia', 'diagnostico', 'imc']],
      ['valoracion-daniel-ortega-cadera.json', 'daniel-audio-1-informe.txt', 'daniel-audio-transcripcion.txt', ['descartar-inventado', 'seguimiento-fuera', 'limitaciones-negativas', 'imagen-motivo']],
      ['valoracion-daniel-ortega-cadera.json', 'daniel-dictado-1-informe.txt', 'daniel-dictado-transcripcion.txt', ['lado-otro', 'formulario-contradicho', 'seguimiento-fuera', 'constantes', 'imagen-motivo']],
      ['valoracion-daniel-ortega-cadera.json', 'daniel-dictado-2-informe.txt', 'daniel-dictado-2-transcripcion.txt', ['lado-otro', 'no-se', 'formulario-contradicho', 'test-propiedades']],
      ['valoracion-marta-gil-rodilla.json', 'marta-dictado-1-informe.txt', 'marta-dictado-transcripcion.txt', ['lado-otro', 'seguimiento-fuera', 'relleno', 'frecuencia', 'discrepancia-separada']],
      ['valoracion-marta-gil-rodilla.json', 'marta-dictado-2-informe.txt', 'marta-dictado-2-transcripcion.txt', ['lado-otro', 'genero', 'seguimiento-fuera', 'relleno', 'discrepancia-separada']],
      ['valoracion-sergio-navarro-tobillo.json', 'sergio-dictado-1-informe.txt', 'sergio-dictado-transcripcion.txt', ['lado-otro', 'indicacion-omitida', 'seguimiento-fuera', 'relleno', 'discrepancia-separada']],
      ['valoracion-sergio-navarro-tobillo.json', 'sergio-dictado-2-informe.txt', 'sergio-dictado-2-transcripcion.txt', ['lado-otro', 'indicacion-omitida', 'descarta', 'repetido', 'fuentes', 'fisiopatologia', 'atribucion', 'constantes', 'imagen-motivo']],
      ['valoracion-rosa-martin-hombro.json', 'rosa-dictado-1-informe.txt', 'rosa-dictado-1-transcripcion.txt', ['lado-otro', 'genero', 'fuentes']],
      ['valoracion-tomas-ibanez-cervical.json', 'tomas-dictado-1-informe.txt', 'tomas-dictado-1-transcripcion.txt', ['nrs-omitido', 'relleno', 'fuentes']],
      ['valoracion-elena-castro-lumbar.json', 'elena-dictado-1-ficha-breve.txt', 'elena-dictado-1-transcripcion.txt', ['pronostica', 'nrs-omitido', 'estructura', 'relleno']],
      ['valoracion-elena-castro-lumbar.json', 'elena-dictado-2-ficha-breve.txt', 'elena-dictado-2-transcripcion.txt', ['pronostica', 'fuentes']],
      ['valoracion-elena-castro-lumbar.json', 'elena-dictado-3-ficha-breve.txt', 'elena-dictado-3-transcripcion.txt', []],
      ['valoracion-elena-castro-lumbar.json', 'elena-dictado-4-ficha-breve.txt', 'elena-dictado-4-transcripcion.txt', ['nrs-momento']],
      ['valoracion-elena-castro-lumbar.json', 'elena-dictado-5-ficha-breve.txt', 'elena-dictado-5-transcripcion.txt', ['nrs-omitido']],
      ['valoracion-andres-molina-codo.json', 'andres-dictado-1-informe.txt', 'andres-dictado-1-transcripcion.txt', ['nrs-momento', 'reconsiderar-copiado', 'seguimiento-fuera', 'relleno']],
      ['valoracion-pablo-serrano-rodilla.json', 'pablo-dictado-1-ficha-breve.txt', 'pablo-dictado-1-transcripcion.txt', ['nrs-momento', 'fisiopatologia']],
      ['valoracion-pablo-serrano-rodilla.json', 'pablo-dictado-2-ficha-breve.txt', 'pablo-dictado-2-transcripcion.txt', ['relleno']],
      ['valoracion-rosario-gomez-cadera.json', 'rosario-dictado-1-informe.txt', 'rosario-dictado-1-transcripcion.txt', ['lado-otro', 'descarta', 'confirma', 'atribucion', 'hipotesis-no-cumple', 'repetido']],
      ['valoracion-rosario-gomez-cadera.json', 'rosario-dictado-2-informe.txt', 'rosario-dictado-1-transcripcion.txt', ['lado-otro', 'descarta', 'hipotesis-no-cumple', 'diagnostico']],
      ['valoracion-rosario-gomez-cadera.json', 'rosario-dictado-3-informe.txt', 'rosario-dictado-1-transcripcion.txt', ['lado-otro', 'relleno']],
      ['valoracion-rosario-gomez-cadera-2.json', 'rosario-dictado-4-informe.txt', 'rosario-dictado-4-transcripcion.txt', ['lado-otro', 'atribucion', 'hipotesis-no-cumple']],
      ['valoracion-rosario-gomez-cadera-2.json', 'rosario-dictado-5-informe.txt', 'rosario-dictado-1-transcripcion.txt', ['lado-otro', 'relleno', 'repetido']],
    ];
    // En este mismo proceso (revisarArchivos(), lo que hace la herramienta),
    // no un `node` por informe; luego se deja `state` como estaba.
    const antes = structuredClone(state);
    const revisados = [];
    for (const [json, informe, trans, esperados] of casos) {
      const r = await revisarArchivos(join(dir, json), join(dir, informe), { transcripcion: trans ? readFileSync(join(dir, trans), 'utf8') : '' });
      revisados.push([informe, r, esperados]);
    }
    for (const k of Object.keys(state)) delete state[k];
    Object.assign(state, antes);
    test('revisión: informes reales (tests/fixtures/informes) dan los puntos esperados', () => {
      for (const [informe, r, esperados] of revisados)
        assert.deepEqual(r.puntos.map(p => p.id), esperados, `${informe}\n${formatearPuntos(r)}`);
    });
    // La línea de órdenes de la herramienta, con un caso: misma salida que la función
    const [json, informe, trans] = casos[0];
    const salida = execFileSync(process.execPath, [herramienta, join(dir, json), join(dir, informe), '--transcripcion', join(dir, trans)], { encoding: 'utf8' });
    test('revisión: tools/revisar-informe.mjs desde la línea de órdenes da lo mismo que revisarArchivos()', () => {
      assert.equal(salida, formatearPuntos(revisados[0][1]));
    });
  }
  test('prompt: aviso del cribado sin copiar la pregunta y EVN sin desarrollar (ronda 31)', () => {
    assert.match(IN.AVISO_SQ, /No copies ni parafrasees el texto de la pregunta/);
    assert.match(IN.NOTA_NRS, /sigla sin desarrollar/);
  });
  test('prompt: las preguntas del cribado en SÍ llevan el aviso de que no todas sus partes son hallazgos (ronda 30)', () => {
    const d = { p: 'X', si: true, sq: ['¿Tiene un dolor continuo, con sudoración o hinchazón?'] };
    for (const pr of [IN.buildNarrativePrompt(d, {}), IN.buildFichaBrevePrompt(d, {})])
      assert.ok(pr.includes(`Alertas sistémicas positivas (${IN.AVISO_SQ}):`), 'aviso junto a las preguntas');
    assert.ok(!IN.buildNarrativePrompt({ p: 'X', sq: [] }, {}).includes(IN.AVISO_SQ), 'sin preguntas en SÍ, sin aviso');
  });
  test('prompt: aviso de reglas pronósticas en la coherencia y NRS que debe constar (ronda 23)', () => {
    const d = { p: 'X', nr: 7, h: [{ name: 'Disfunción segmentaria' }] };
    for (const pr of [IN.buildNarrativePrompt(d, {}), IN.buildFichaBrevePrompt(d, {})]) {
      assert.ok(pr.includes(IN.AVISO_PRONOSTICA), 'aviso de Flynn donde se escribe el contraste');
      assert.ok(pr.includes(`NRS: 7/10 ${IN.NOTA_NRS}`));
    }
    assert.ok(IN.buildNarrativePrompt({ ...d, nr: null }, {}).includes('NRS: no registrado'));
    assert.ok(IN.buildNarrativePrompt(d, {}).includes('sin decir si se exploró o no'), 'otra zona: sin decir si se exploró');
  });
  test('revisión: Flynn como apoyo, NRS omitido, subapartados en la ficha, dolor nocturno (ronda 23)', () => {
    assert.ok(ids('La hipomovilidad y el cumplimiento de 4 criterios de Flynn apoyan la primera hipótesis.').includes('pronostica'));
    assert.ok(!ids('Cumple 4 de los 5 criterios de Flynn, lo que predice buena respuesta a la manipulación.').includes('pronostica'), 'presentada como pronóstica, bien');
    assert.ok(!ids('La regla de Flynn no apoya la hipótesis: es pronóstica.').includes('pronostica'), 'negada, bien');
    assert.ok(ids('Dolor actual de 4/10 y de 8/10 al agacharse.', { datos: { nr: 7 } }).includes('nrs-omitido'));
    assert.ok(!ids('Dolor de 7/10 en la valoración y de 4/10 ahora.', { datos: { nr: 7 } }).includes('nrs-omitido'));
    assert.ok(!ids('Refiere dolor al agacharse.', { datos: { nr: 7 } }).includes('nrs-omitido'), 'sin ninguna cifra no salta');
    const sub = 'HALLAZGOS\n\nCondición de Salud: Las hipótesis son dos.';
    assert.ok(ids(sub, { plantilla: 'breve' }).includes('estructura'));
    assert.ok(!ids(sub, { plantilla: 'narrativo' }).includes('estructura'), 'en el narrativo son subsecciones de verdad (otra regla)');
    const noct = 'No presenta dolor nocturno que le despierte. Toma un relajante muscular nocturno, que le permite dormir mejor.';
    assert.ok(!ids(noct).includes('discrepancia-separada'), 'un relajante nocturno no es dolor nocturno');
    assert.ok(ids('No presenta dolor nocturno. Refiere que el dolor por la noche le despierta dos veces.').includes('discrepancia-separada'));
  });
  test('prompt: las reglas pronósticas en un bloque propio, fuera de los tests de la hipótesis; NRS sin pistas de procedencia (ronda 24)', () => {
    const a = { tests: [
      { hipotesis: 'Disfunción segmentaria', items: [{ test: 'Regla de Flynn', resultado: 'positivo', pronostico: true }, { test: 'PAIVM', resultado: 'positivo' }] },
      { hipotesis: 'Solo pronóstico', items: [{ test: 'Regla de Hicks', resultado: 'positivo', pronostico: true }] }] };
    const bl = IN.bloquesAmpliados(a);
    const tests = bl.find(x => x.startsWith('Tests de confirmación'));
    const pron = bl.find(x => x.startsWith('Reglas pronósticas'));
    assert.ok(tests.includes('PAIVM: positivo') && !/Flynn|Hicks|Solo pronóstico/.test(tests), 'ninguna regla pronóstica entre los tests');
    assert.ok(pron.includes('· Regla de Flynn: positivo (regla pronóstica, no diagnóstica)') && pron.includes('· Regla de Hicks: positivo'));
    assert.ok(IN.AVISO_PRONOSTICA.includes('«regla pronóstica, no diagnóstica»'), 'el aviso remite a la marca que llevan las líneas');
    assert.ok(!/Disfunción segmentaria|Solo pronóstico/.test(pron), 'sin la hipótesis a la que pertenecía');
    const solo = IN.bloquesAmpliados({ tests: [a.tests[1]] });
    assert.ok(!solo.some(x => x.startsWith('Tests de confirmación')), 'sin tests diagnósticos, no hay bloque vacío');
    // Ronda 27: sin momento, el modelo se lo inventaba (Elena‑4, Andrés, Pablo: «en reposo»); ahora lleva el suyo
    assert.match(IN.NOTA_NRS, /EVN de N\/10 en la valoración/);
    assert.match(IN.NOTA_NRS, /sin atribuirle otro momento/);
    assert.ok(!/consulta/.test(IN.NOTA_NRS), 'sin «consulta» (Elena‑2 escribió «durante la consulta»)');
    assert.ok(ids('El dolor era de 7/10, aunque durante la consulta refirió un 4/10.').includes('fuentes'));
  });
  test('revisión: NRS con un momento que no tiene, plazo de «Cuándo reconsiderar» copiado, «no se observa ganancia» (ronda 26)', () => {
    assert.ok(ids('La intensidad del dolor en reposo es de 3/10.', { datos: { nr: 3 } }).includes('nrs-momento'));
    assert.ok(!ids('Dolor de 3/10; al estirar llega a 5/10.', { datos: { nr: 3 } }).includes('nrs-momento'), 'sin momento, bien');
    assert.ok(!ids('En reposo, 2/10; la intensidad registrada es 3/10.', { datos: { nr: 3 } }).includes('nrs-momento'), 'el momento es de otra cifra');
    assert.ok(!ids('En la última semana llegó a 8/10.', { datos: { nr: 8 }, transcripcion: 'Esta semana llegó a un 8 de 10.' }).includes('nrs-momento'), 'el audio da ese momento para esa cifra');
    const amp = { pautas: [{ hipotesis: 'Rigidez', pronostico: { derivacion: 'Si no mejora más tras 3–6 meses, valorar la cirugía.' } }] };
    assert.ok(ids('Si tras 3 a 6 meses no mejora, se valorará la cirugía.', { ampliado: amp }).includes('reconsiderar-copiado'));
    assert.ok(!ids('Si tras 3 a 6 meses no mejora, se valorará la cirugía.', { ampliado: amp, transcripcion: 'Si en 3 a 6 meses no mejora, lo veremos.' }).includes('reconsiderar-copiado'), 'lo dijo el fisio');
    assert.ok(!ids('Reevaluación en 6 semanas.', { ampliado: amp }).includes('reconsiderar-copiado'));
    const seg = x => RI.revisarInforme(`## CONCLUSIONES Y PLAN DE TRATAMIENTO\n\n${x}\n\n## SEGUIMIENTO FUNCIONAL\n\nSe usará el QuickDASH.`).map(p => p.id);
    assert.ok(seg('Si en 6 semanas no se observa ganancia de extensión, se comentará con el traumatólogo.').includes('seguimiento-fuera'));
  });
  test('revisión: la hinchazón con localización no es la hinchazón general; la nota del NRS no respalda momentos (ronda 27)', () => {
    const t = 'Niega bloqueos e hinchazón posterior. Se pautan ejercicios siempre que haya hinchazón leve al día siguiente.';
    assert.ok(!ids(t).includes('discrepancia-separada'), 'Pablo: «hinchazón posterior» frente a la general');
    assert.ok(ids('Niega hinchazón. Refiere que la rodilla está hinchada al final del día.').includes('discrepancia-separada'));
    assert.ok(ids('La EVN en reposo es de 2/10.', { datos: { nr: 2 } }).includes('nrs-momento'), 'la nota nombra «reposo», pero no lo respalda');
    assert.ok(!ids('EVN de 2/10 en la valoración.', { datos: { nr: 2 } }).includes('nrs-momento'));
  });
  test('revisión: «durante la consulta» solo es una fuente con un verbo de lo que cuenta el paciente (ronda 28)', () => {
    assert.ok(ids('El dolor era de 7/10, aunque durante la consulta refirió un 4/10.').includes('fuentes'), 'Elena‑2');
    assert.ok(!ids('Puente de glúteos, ejercicio enseñado durante la consulta de hoy.').includes('fuentes'), 'Pablo‑2: cuándo se hizo, no de dónde sale');
  });
  test('revisión: constantes clasificadas, motivo de la imagen añadido, «en caso de ausencia de mejoría» (decimosexta revisión)', () => {
    assert.ok(ids('Presenta signos vitales dentro de parámetros habituales, con una frecuencia cardíaca de 58 lpm.').includes('constantes'));
    assert.ok(ids('Paciente normotenso.').includes('constantes'));
    assert.ok(!ids('Frecuencia cardíaca de 58 lpm y tensión arterial de 120/80 mmHg.').includes('constantes'), 'las cifras solas no');
    const ecoInventada = 'Si no mejora, se solicitará una ecografía para valorar la presencia de líquido alrededor del tendón.';
    assert.ok(ids(ecoInventada, { transcripcion: 'Si en unas 6 semanas no mejora, pediremos una ecografía.' }).includes('imagen-motivo'));
    assert.ok(!ids(ecoInventada, { transcripcion: 'Pediremos una ecografía para ver si hay líquido.' }).includes('imagen-motivo'), 'el motivo lo dio el fisio');
    assert.ok(!ids('Se solicitará una ecografía.').includes('imagen-motivo'), 'sin motivo no cuenta');
    const seg = t => RI.revisarInforme(`## CONCLUSIONES Y PLAN DE TRATAMIENTO\n\n${t}\n\n## SEGUIMIENTO FUNCIONAL\n\nSe usará la HAGOS.`).map(p => p.id);
    assert.ok(seg('En caso de ausencia de mejoría en seis semanas, se solicitará ecografía.').includes('seguimiento-fuera'));
    assert.ok(seg('Si no mejora, se pedirá una ecografía.').includes('seguimiento-fuera'));
    assert.ok(!seg('La ausencia de mejoría con movimientos repetidos es compatible con origen facetario.').includes('seguimiento-fuera'), 'un hallazgo no es el criterio');
    assert.ok(ids('Según el dictado, refiere dolor.').includes('fuentes'), '«dictado» nombra la fuente');
  });
  test('revisión: «Antes de compartir, comprueba» — atribución y otra zona siempre; tests con «o» solo si se hicieron', () => {
    const sin = RI.comprobacionesManuales({ ampliado: { tests: [{ hipotesis: 'X', items: [{ test: 'Test de Neer', resultado: 'positivo' }] }] } });
    assert.equal(sin.length, 2);
    assert.match(sin[0], /atribuye a quien la dio/);
    assert.match(sin[1], /otra zona o el otro lado/);
    const con = RI.comprobacionesManuales({ ampliado: { tests: [
      { hipotesis: 'A', items: [{ test: 'PA unilateral dolorosa o con menos movilidad', resultado: 'positivo' }] },
      { hipotesis: 'B', items: [{ test: 'PA unilateral dolorosa o con menos movilidad', resultado: 'positivo' }] },
    ] } });
    assert.equal(con.length, 3);
    assert.equal((con[1].match(/«PA unilateral/g) || []).length, 1, 'cada test una sola vez');
    assert.equal(RI.comprobacionesManuales().length, 2, 'sin datos ampliados no rompe');
    const disc = RI.comprobacionesManuales({ formularioYAudio: true });
    assert.equal(disc.length, 3);
    assert.match(disc[2], /difiere del formulario previo.*las dos versiones/, 'con formulario y audio, las discrepancias');
  });
  test('revisión: cabecera y pie compartidos se quitan; cita la frase', () => {
    const t = RI.quitarCabeceraYPie('INFORME DE FISIOTERAPIA\nPaciente: Pedro Flores\nEdad: 52 años\nFecha: 07/10/2026\n\nTexto.\n\n—\nInforme generado con PhysiQ-Assessment el 07/10/2026 (redacción asistida por IA).');
    assert.equal(t, 'Texto.');
    assert.equal(RI.fraseEn('Uno. Dos tres. Cuatro.', 6), 'Dos tres.');
  });
  test('revisión: se pinta en la tarjeta, nunca en el payload ni en los resúmenes', () => {
    const src = leer('informe-ia.js');
    assert.match(src, /import \{ revisarInforme, comprobacionesManuales[^}]*\} from '\.\/lib\/revision-informe\.js';/);
    assert.match(src, /<div id="iaRevision"><\/div>/);
    assert.match(src, /catch \{ el\.innerHTML = '';( _rev\w+ = \[\];)? return; \}/, 'una regla rota no tumba la tarjeta');
    const appSrc = leer('app.js');
    assert.ok(!/revision-informe/.test(appSrc), 'app.js no la carga (solo la tarjeta, fuera del hub)');
  });
}
