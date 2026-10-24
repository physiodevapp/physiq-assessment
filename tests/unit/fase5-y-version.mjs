// Fase 5 plegable y versión desplegada. Se ejecuta desde tests/unit.js.
import { assert, leer, test, HYPOTHESES, CIF_TREES, DOSIS_DERIVAR, withState } from './comun.mjs';
const IA = await import('../../informe-ia.js');
const P = await import('../../lib/pauta.js');
const IA_N = await import('../../lib/informe-narrativo.js');

// ── Fase 5: pauta, pronóstico y tests sin hacer plegados ─────────────────────
console.log('\nfase 5 plegable');
{
  const { partirPrimeraFrase } = await import('../../app.js');

  test('partirPrimeraFrase: corta en el primer punto seguido de mayúscula, no en «rec. 1.3.1» ni «p. ej.»', () => {
    assert.deepEqual(partirPrimeraFrase('Ejercicio terapéutico supervisado y progresivo (B). Tras la cirugía, más.'), { primera: 'Ejercicio terapéutico supervisado y progresivo (B).', resto: 'Tras la cirugía, más.' });
    assert.deepEqual(partirPrimeraFrase('Ejercicio adaptado, recomendación firme (rec. 1.3.1). Valorar sesiones.'), { primera: 'Ejercicio adaptado, recomendación firme (rec. 1.3.1).', resto: 'Valorar sesiones.' });
    assert.deepEqual(partirPrimeraFrase('Cargas (p. ej. sentadilla) progresivas.'), { primera: 'Cargas (p. ej. sentadilla) progresivas.', resto: '' });
    assert.deepEqual(partirPrimeraFrase('Una sola frase.'), { primera: 'Una sola frase.', resto: '' });
    // Menos de 40 caracteres: se le suma la siguiente frase
    assert.deepEqual(partirPrimeraFrase('Estadios I–II. Plantillas a medida y estiramientos. Además, fuerza.'),
      { primera: 'Estadios I–II. Plantillas a medida y estiramientos.', resto: 'Además, fuerza.' });
  });

  test('todas las pautas reales se parten sin perder texto y con una primera frase con contenido', () => {
    for (const h of Object.values(HYPOTHESES)) {
      if (!h.dosis || h.dosis === DOSIS_DERIVAR) continue;
      const { primera, resto } = partirPrimeraFrase(h.dosis);
      assert.equal(`${primera} ${resto}`.replace(/\s+/g, ' ').trim(), h.dosis.replace(/\s+/g, ' ').trim(), h.id);
      assert.ok(primera.length >= 40 || !resto, `${h.id}: primera frase demasiado corta («${primera}»)`);
    }
  });

  test('pauta por situación (lib/pauta.js): las ramas solo reparten frases de `dosis` y se eligen por el árbol o el mecanismo', () => {
    const conRamas = Object.values(HYPOTHESES).filter(h => h.dosisRamas);
    assert.deepEqual(conRamas.map(h => h.id), ['ro2'], 'hoy solo ro2 (decisión del usuario, 2026-10)');
    for (const h of conRamas) {
      const partes = [...h.dosisRamas.map(r => r.texto), h.dosisComun || ''];
      const enRamas = partes.flatMap(P.frasesPauta);
      for (const f of enRamas) assert.ok(h.dosis.includes(f), `${h.id}: «${f.slice(0, 60)}…» no está en dosis`);
      for (const f of P.frasesPauta(h.dosis).filter(f => f.length >= 20))
        assert.ok(enRamas.includes(f), `${h.id}: «${f.slice(0, 60)}…» de dosis no está en ninguna rama`);
      for (const r of h.dosisRamas) {
        assert.ok(r.titulo && r.texto && (r.si?.mecanismo || r.si?.arbol), `${h.id}: rama incompleta`);
        for (const [paso, valor] of Object.entries(r.si.arbol || {})) {
          const st = CIF_TREES[h.region].steps.find(s => s.id === paso);
          const op = st?.options.find(o => o.value === valor);
          assert.ok(op && op.hypothesis.includes(h.id), `${h.id}: ${paso}=${valor} debe existir y activar la hipótesis`);
        }
      }
    }
    const ro2 = HYPOTHESES.ro2;
    assert.equal(P.ramaPauta(ro2, { mecanismo: 'Traumático', treeAnswers: { ro_step1: 'menisco', ro_step5: 'menisco' } }).rama.titulo, 'Rotura traumática, sin cirugía', 'la del paso 1 manda');
    assert.equal(P.ramaPauta(ro2, { mecanismo: 'Insidioso', treeAnswers: { ro_step6: 'menisco' } }).rama.titulo, 'Lesión degenerativa, sin cirugía');
    assert.equal(P.ramaPauta(ro2, { mecanismo: 'Post-quirúrgico', treeAnswers: { ro_step1: 'menisco' } }).rama.titulo, 'Tras una meniscectomía parcial');
    assert.equal(P.ramaPauta(ro2, { mecanismo: '', treeAnswers: {} }), null, 'sin rama que encaje, la pauta entera');
    assert.ok(P.ramaPauta(ro2, { treeAnswers: { ro_step1: 'menisco' } }).texto.endsWith(ro2.dosisComun));
    assert.ok(!/electroestimulación/i.test(P.ramaPauta(ro2, { treeAnswers: { ro_step1: 'menisco' } }).texto), 'la traumática no lleva la electroestimulación');
  });

  test('pauta: los criterios de «derivar si no mejora» van en «Cuándo reconsiderar o derivar», no en la pauta', () => {
    for (const id of ['ro2', 'h2', 'ce3']) {
      assert.ok(!/\bderivar\b[^.]*\b(no mejora|persisten|siguen siendo)/i.test(HYPOTHESES[id].dosis), `${id}: sin criterio de no mejoría en la pauta`);
      assert.match(HYPOTHESES[id].pronostico.derivacion, /[Dd]erivar[^.]*(no mejoran|persisten|siguen siendo intensos)|(no mejoran|persisten|siguen siendo intensos)[^.]*derivar/, `${id}: el criterio está en el pronóstico`);
    }
    // co3: el criterio es de cirugía, no de derivación (Andrés, codo)
    assert.ok(!/cirugía/.test(HYPOTHESES.co3.dosis), 'co3: sin criterios de cirugía en la pauta');
    assert.match(HYPOTHESES.co3.pronostico.derivacion, /no mejora más tras 3–6 meses[^.]*cirugía/);
  });

  test('pronóstico: cada cosa en su apartado (seguimiento, a tener en cuenta, reconsiderar o derivar); las 7 regiones', () => {
    const CLAVES = ['horizonte', 'seguimiento', 'notas', 'derivacion', 'fuente'];
    for (const h of Object.values(HYPOTHESES)) {
      for (const k of Object.keys(h.pronostico || {})) assert.ok(CLAVES.includes(k), `${h.id}: pronostico.${k} no existe`);
    }
    // Aquiles (Lluch 2020, cap. 4.3): el seguimiento y las notas ya no van bajo «derivar si»
    for (const id of ['tp8', 'tp9', 'tp10', 'tp11']) {
      const p = HYPOTHESES[id].pronostico;
      assert.match(p.seguimiento, /^VISA-A una vez al mes/, id);
      assert.equal(p.derivacion, 'hay dolor nocturno, que apunta a otro diagnóstico.', id);
      assert.ok(!p.horizonte && !/VISA-A|bursa/.test(p.derivacion), id);
      assert.equal(/bursa retrocalcánea/.test(p.notas), id === 'tp9', `${id}: la bursa, solo en la insercional`);
    }
    // Rodilla (Lluch 2020, cap. 4.2): «reconsiderar o derivar» solo en ro2 (criterios de Prill 2025) y ro20 (tromboflebitis);
    // la imagen, la patogenia y los diferenciales, en «a tener en cuenta»
    const RO = ['ro1', 'ro2', 'ro3', 'ro4', 'ro5', 'ro6', 'ro8', 'ro9', 'ro10', 'ro11', 'ro12', 'ro13', 'ro14', 'ro15', 'ro18', 'ro19', 'ro20'];
    for (const id of RO) {
      const p = HYPOTHESES[id].pronostico;
      assert.ok(p.notas, `${id}: sin notas`);
      assert.equal(!!p.derivacion, id === 'ro2' || id === 'ro20', `${id}: derivación solo con criterio`);
      assert.ok(!/\b(RM|ecografía|radiografía)\b/.test(p.horizonte || ''), `${id}: la imagen no es un pronóstico`);
    }
    assert.match(HYPOTHESES.ro2.pronostico.derivacion, /^persisten [^.]*derivar al traumatólogo \(Prill 2025, grado C\)\.$/);
    assert.equal(HYPOTHESES.ro20.pronostico.derivacion, 'hay duda con una tromboflebitis.');
    assert.match(HYPOTHESES.ro5.pronostico.seguimiento, /VISA-P/);
    assert.ok(!/LLE/.test(HYPOTHESES.ro9.pronostico.notas), 'ro9: lo del LLE, solo en ro10');
    assert.match(HYPOTHESES.ro10.pronostico.notas, /lesión aislada del LLE es rara/, 'ro10: p. 216');
    assert.ok(!/95 %/.test(HYPOTHESES.ro10.pronostico.notas), 'ro10: el 95 % es del LCP (p. 221)');
    // Cadera (Lluch 2020, cap. 4.1): ningún criterio para reconsiderar o derivar; la imagen, la epidemiología
    // y los diferenciales, en «a tener en cuenta»; el texto común del dolor inguinal (ca16–ca19), en cada una
    const CA = ['ca1', 'ca2', 'ca3', 'ca4', 'ca11', 'ca12', 'ca13', 'ca14', 'ca16', 'ca17', 'ca18', 'ca19'];
    for (const id of CA) {
      const p = HYPOTHESES[id].pronostico;
      assert.ok(p.notas, `${id}: sin notas`);
      assert.ok(!p.derivacion, `${id}: sin derivación`);
      // Seguimiento: solo el criterio de fuerza para volver al deporte (pp. 172–173), en ca11 y ca16–ca19
      assert.equal(!!p.seguimiento, ['ca11', 'ca16', 'ca17', 'ca18', 'ca19'].includes(id), `${id}: seguimiento`);
      if (p.seguimiento) assert.match(p.seguimiento, /^Volver al deporte con un déficit de fuerza menor del 10–20 % respecto al lado sano o al valor previo/, id);
      assert.ok(!/déficit de fuerza/.test(p.notas), `${id}: el criterio de fuerza, en el seguimiento`);
      assert.ok(!/\b(RM|artro-RM|artro-TC|ecografía|radiografía|EMG)\b/i.test(p.horizonte || ''), `${id}: la imagen no es un pronóstico`);
    }
    for (const id of ['ca16', 'ca17', 'ca18', 'ca19']) {
      const p = HYPOTHESES[id].pronostico;
      assert.equal(p.horizonte, 'Con AINE y reposo el dolor se reduce, pero suele volver al retomar el deporte.', id);
      assert.match(p.seguimiento, /, porque la debilidad de cadera aumenta el riesgo de lesión de ingle\.$/, id);
      // La imagen, la de cada una: la sínfisis solo en aductor y pubis, la vaina en el psoas, la hernia en el canal
      assert.equal(/sínfisis/.test(p.notas), id === 'ca16' || id === 'ca19', `${id}: sínfisis`);
      assert.equal(/vaina sinovial/.test(p.notas), id === 'ca17', `${id}: vaina`);
      assert.equal(/hernia/.test(p.notas), id === 'ca18', `${id}: hernia`);
      // p. 177: la hendidura secundaria y los cortes para la inserción son del aductor; el edema de la sínfisis, de los dos
      assert.equal(/hendidura secundaria|inserción del aductor/.test(p.notas), id === 'ca16', `${id}: hendidura`);
    }
    assert.match(HYPOTHESES.ca4.pronostico.notas, /empezar en el glúteo menor y extenderse hacia atrás al glúteo medio/, 'ca4: p. 179');
    assert.match(HYPOTHESES.ca14.pronostico.notas, /alivio del dolor con un bloqueo nervioso diagnóstico/, 'ca14: p. 172');
    assert.ok(!/debilidad de cadera/.test(HYPOTHESES.ca11.pronostico.seguimiento), 'ca11: lo de la debilidad, solo en el dolor inguinal de larga evolución');
    // Hombro (Lluch 2020, caps. 3.1 y 3.1.1): «reconsiderar o derivar» solo en h1 (psicología), h2 (no mejora en
    // 12 semanas, Desmeules 2025) y h11 (traumatismo y rigidez: radiografía); sin seguimiento; la imagen, en «a tener en cuenta»
    const HO = ['h1', 'h2', 'h3', 'h4', 'h5', 'h7', 'h11'];
    for (const id of HO) {
      const p = HYPOTHESES[id].pronostico;
      assert.ok(p.notas, `${id}: sin notas`);
      assert.ok(!p.seguimiento, `${id}: sin seguimiento`);
      assert.equal(!!p.derivacion, ['h1', 'h2', 'h11'].includes(id), `${id}: derivación solo con criterio`);
      assert.equal(!!p.horizonte, ['h1', 'h3', 'h4'].includes(id), `${id}: horizonte`);
      assert.ok(!/\b(Rx|RM|artro-RM|ecografía|radiografía)\b/.test(p.horizonte || ''), `${id}: la imagen no es un pronóstico`);
      assert.ok(!/→/.test(`${p.horizonte || ''} ${p.notas} ${p.derivacion || ''}`), `${id}: sin flechas`);
      if (p.derivacion) assert.match(p.derivacion, /^[a-záéíóú]/, `${id}: continúa «Reconsiderar o derivar si:»`);
    }
    assert.match(HYPOTHESES.h1.pronostico.derivacion, /^no te ves con confianza o competencia para abordar los aspectos psicosociales del dolor: derivar a tiempo[^.]*psicología\.$/, 'h1: p. 72');
    assert.match(HYPOTHESES.h1.pronostico.horizonte, /autoeficacia baja frente al dolor predice una peor evolución/, 'h1: factor pronóstico (p. 71)');
    assert.match(HYPOTHESES.h2.pronostico.derivacion, /^no mejora en un máximo de 12 semanas[^.]*\(Desmeules 2025, grado F\)\.$/);
    assert.match(HYPOTHESES.h3.pronostico.notas, /^La RM es la prueba de imagen de referencia: en la rotura completa/, 'h3: p. 67');
    assert.match(HYPOTHESES.h1.pronostico.notas, /diabetes, con cifras descritas de hasta el 30 %/, 'h1: p. 69');
    assert.match(HYPOTHESES.h1.pronostico.notas, /Es raro que vuelva en el mismo hombro, pero se han documentado casos en el otro \(6–34 %\)/, 'h1: p. 69');
    assert.ok(!/dosificar/.test(HYPOTHESES.h2.pronostico.notas), 'h2: «hay que dosificar» no está en la p. 54');
    assert.match(HYPOTHESES.h11.pronostico.derivacion, /radiografía\. No explorar más hasta tenerla\.$/);
    // Cervical (tarjeta de consulta cervical): «reconsiderar o derivar» solo en ce3 (médula; no mejora, Blanpied 2017),
    // ce4 (revisar ATM y otras cefaleas), ce13 (urgencias) y ce14 (banderas rojas); sin seguimiento; la imagen, en «a tener en cuenta»
    const CE = ['ce3', 'ce4', 'ce5', 'ce12', 'ce13', 'ce14'];
    for (const id of CE) {
      const p = HYPOTHESES[id].pronostico;
      assert.ok(p.notas, `${id}: sin notas`);
      assert.ok(!p.seguimiento, `${id}: sin seguimiento`);
      assert.equal(!!p.derivacion, ['ce3', 'ce4', 'ce13', 'ce14'].includes(id), `${id}: derivación solo con criterio`);
      assert.equal(!!p.horizonte, ['ce5', 'ce14'].includes(id), `${id}: horizonte`);
      assert.ok(!/\b(RM|EMG|radiografía|imagen)\b/i.test(p.horizonte || ''), `${id}: la imagen no es un pronóstico`);
      assert.ok(!/→/.test(`${p.horizonte || ''} ${p.notas} ${p.derivacion || ''}`), `${id}: sin flechas`);
      if (p.derivacion) assert.match(p.derivacion, /^[a-záéíóú]/, `${id}: continúa «Reconsiderar o derivar si:»`);
    }
    assert.match(HYPOTHESES.ce3.pronostico.derivacion, /^hay cualquier duda de afectación medular\./);
    // Lluch 2020, cap. 5.3, pp. 370–371 y 383: lo «súbito» de la disección es la cefalea o el dolor de cuello, no el mareo
    assert.match(HYPOTHESES.ce13.pronostico.derivacion, /^hay visión doble verdadera[^.]*cefalea o un dolor de cuello súbito[^.]*disección arterial: derivar a urgencias\.$/);
    assert.ok(!/mareo súbito/.test(HYPOTHESES.ce13.pronostico.derivacion), 'ce13: el mareo no es lo súbito');
    for (const id of ['ce5', 'ce13']) assert.match(HYPOTHESES[id].pronostico.notas, /sistema vestibular o de una conmoción \(traumatismo craneoencefálico leve\)/, `${id}: pp. 370–371`);
    assert.match(HYPOTHESES.ce14.pronostico.derivacion, /derivar de inmediato para valoración médica\.$/, 'ce14: p. 382');
    assert.ok(!/urgencias|disección/.test(HYPOTHESES.ce13.pronostico.notas), 'ce13: las urgencias, en «reconsiderar o derivar»');
    assert.ok(!/aura/.test(HYPOTHESES.ce3.pronostico.derivacion), 'ce3: el aura es un diferencial, no un criterio');
    // Lumbar (Lluch 2020, cap. 5.1): «reconsiderar o derivar» solo en lu3 (RM), lu4 (progresión neurológica),
    // lu5 (cirugía) y lu7 (radiofrecuencia, NICE NG59); sin seguimiento; la imagen y los diferenciales, en «a tener en cuenta»
    const LU = ['lu3', 'lu4', 'lu5', 'lu6', 'lu7', 'lu8'];
    for (const id of LU) {
      const p = HYPOTHESES[id].pronostico;
      assert.ok(p.notas, `${id}: sin notas`);
      assert.ok(!p.seguimiento, `${id}: sin seguimiento`);
      assert.equal(!!p.derivacion, ['lu3', 'lu4', 'lu5', 'lu7'].includes(id), `${id}: derivación solo con criterio`);
      assert.equal(!!p.horizonte, id !== 'lu5', `${id}: horizonte`);
      assert.ok(!/\b(RM|EMG|electromiograma|radiología|imagen)\b/i.test(p.horizonte || ''), `${id}: la imagen no es un pronóstico`);
      assert.ok(!/→/.test(`${p.horizonte || ''} ${p.notas} ${p.derivacion || ''}`), `${id}: sin flechas`);
      if (p.derivacion) assert.match(p.derivacion, /^[a-záéíóú]/, `${id}: continúa «Reconsiderar o derivar si:»`);
    }
    assert.match(HYPOTHESES.lu3.pronostico.derivacion, /: está indicada la RM\.$/);
    assert.match(HYPOTHESES.lu5.pronostico.derivacion, /: es una indicación absoluta de cirugía\.$/, 'lu5: p. 311');
    assert.match(HYPOTHESES.lu3.pronostico.horizonte, /65 % se ha recuperado por completo en seguimientos a 1, 4 y 10 años/, 'lu3: p. 308');
    assert.match(HYPOTHESES.lu4.pronostico.derivacion, /: puede estar indicada la cirugía\.$/, 'lu4: p. 314');
    assert.match(HYPOTHESES.lu8.pronostico.notas, /tres veces más frecuente con PRPPP/, 'lu8: p. 322');
    assert.ok(!/persist/.test(HYPOTHESES.lu8.pronostico.notas), 'lu8: los predictores son del PRPPP, no de que persista');
    assert.match(HYPOTHESES.lu7.pronostico.derivacion, /NICE recomienda considerar derivar para valorar una denervación por radiofrecuencia/);
    for (const id of ['lu4', 'lu7']) assert.ok(!/infiltraciones/.test(HYPOTHESES[id].pronostico.derivacion), `${id}: no ofrecer infiltraciones no es un criterio`);
    // Codo (Siemensma 2023): co3 solo tiene criterios de cirugía, ya en su sitio; escritos como continuación
    const co3 = HYPOTHESES.co3.pronostico;
    assert.deepEqual(Object.keys(co3).sort(), ['derivacion', 'fuente'], 'co3: solo derivación');
    assert.match(co3.derivacion, /^no mejora más tras 3–6 meses de tratamiento adecuado: valorar la cirugía\. Si lo que limita es el hueso/);
    // Tobillo y pie (Lluch 2020, cap. 4.3): los textos que la tarjeta repetía en varias hipótesis, cada uno en la suya;
    // sin seguimiento; «reconsiderar o derivar» solo con un criterio
    const TP = ['tp1', 'tp2', 'tp3', 'tp4', 'tp5', 'tp7', 'tp12', 'tp14', 'tp15', 'tp16', 'tp17', 'tp18', 'tp19', 'tp20', 'tp21', 'tp22',
      'tp23', 'tp24', 'tp25', 'tp26', 'tp27', 'tp28', 'tp29', 'tp30', 'tp31', 'tp32', 'tp33', 'tp34', 'tp36', 'tp37'];
    const TP_DERIV = ['tp1', 'tp2', 'tp7', 'tp14', 'tp15', 'tp17', 'tp19', 'tp24', 'tp26', 'tp30', 'tp31', 'tp32', 'tp33'];
    const TP_HORIZ = ['tp1', 'tp5', 'tp7', 'tp14', 'tp15', 'tp17', 'tp22', 'tp30', 'tp32', 'tp33', 'tp36', 'tp37'];
    for (const id of TP) {
      const p = HYPOTHESES[id].pronostico;
      assert.equal(!!p.notas, id !== 'tp2', `${id}: notas`);
      assert.ok(!p.seguimiento, `${id}: sin seguimiento`);
      assert.equal(!!p.derivacion, TP_DERIV.includes(id), `${id}: derivación solo con criterio`);
      assert.equal(!!p.horizonte, TP_HORIZ.includes(id), `${id}: horizonte`);
      assert.ok(!/\b(RM|TC|radiografía|ecografía|imagen)\b/i.test(p.horizonte || ''), `${id}: la imagen no es un pronóstico`);
      assert.ok(!/→/.test(`${p.horizonte || ''} ${p.notas || ''} ${p.derivacion || ''}`), `${id}: sin flechas`);
      if (p.derivacion) assert.match(p.derivacion, /^[a-záéíóú]/, `${id}: continúa «Reconsiderar o derivar si:»`);
    }
    const txt = id => Object.values(HYPOTHESES[id].pronostico).join(' ');
    assert.ok(!/Lisfranc|calcáneo|Jones/.test(txt('tp3')), 'tp3: solo el Aquiles');
    assert.ok(!/Aquiles|calcáneo|Jones/.test(txt('tp4')), 'tp4: solo Lisfranc');
    assert.ok(!/Lisfranc|Aquiles/.test(txt('tp5')), 'tp5: solo las fracturas del pie');
    for (const id of ['tp12', 'tp16', 'tp28']) assert.equal(/neurodinámica/.test(txt(id)), id === 'tp12', `${id}: lo del sural, solo en tp12`);
    for (const id of ['tp18', 'tp20', 'tp22']) assert.equal(/osteofitos/.test(txt(id)), id === 'tp20', `${id}: el pinzamiento anterior, solo en tp20`);
    for (const id of ['tp23', 'tp25']) assert.equal(/coalicion|12,7/.test(txt(id)), id === 'tp23', `${id}: la coalición, solo en tp23`);
    for (const id of ['tp26', 'tp27']) assert.equal(/espolón|atrapamiento/.test(txt(id)), id === 'tp26', `${id}: la fasciopatía, solo en tp26`);
    for (const id of ['tp29', 'tp31', 'tp34']) assert.equal(/gota/.test(txt(id)), id === 'tp31', `${id}: la gota, solo en tp31`);
    assert.ok(!/tres números/.test(txt('tp21')), 'tp21: no está en la p. 261');
    assert.match(HYPOTHESES.tp12.pronostico.notas, /lo que lleva a considerar el diagnóstico diferencial/, 'tp12: p. 244, lo aleatorio es del sural');
    // El informe con IA recibe el seguimiento con su nombre y no las notas (como el horizonte)
    const a = { pautas: [{ hipotesis: 'Tendinopatía insercional', pauta: 'Excéntrico', pronostico: HYPOTHESES.tp9.pronostico }] };
    const t = IA_N.bloquesAmpliados(a).join('\n');
    assert.ok(t.includes('Seguimiento sugerido (contexto para el fisioterapeuta): VISA-A una vez al mes'));
    assert.ok(t.includes('Cuándo reconsiderar o derivar (contexto para el fisioterapeuta: no es plan ni explicación al paciente): hay dolor nocturno'));
    assert.ok(!t.includes('bursa'), 'las notas no van al informe');
    // Fase 5 y fase 6 las pintan con su etiqueta
    assert.ok(leer('app.js').includes('<strong>Reconsiderar o derivar si:</strong>') && leer('app.js').includes('<strong>A tener en cuenta:</strong>'));
    assert.ok(leer('plan.js').includes('`Seguimiento: ${p.seguimiento}`'));
  });

  test('pauta: el informe con IA recibe solo la rama del caso; sin rama, la pauta entera', () => {
    withState({ region: 'rodilla', mecanismo: 'Traumático', activeHypotheses: ['ro2'], treeAnswers: { ro_step1: 'menisco', ro_step5: 'menisco' }, testResults: {} }, () => {
      const p = IA.construirAmpliado().pautas.find(x => x.hipotesis === HYPOTHESES.ro2.name);
      assert.ok(p.pauta.startsWith('Rotura traumática'), p.pauta.slice(0, 40));
      assert.ok(!/electroestimulación|Tras una meniscectomía/.test(p.pauta));
    });
    withState({ region: 'rodilla', mecanismo: '', activeHypotheses: ['ro2'], treeAnswers: {}, testResults: {} }, () => {
      assert.equal(IA.construirAmpliado().pautas.find(x => x.hipotesis === HYPOTHESES.ro2.name).pauta, HYPOTHESES.ro2.dosis);
    });
    // Lo que pinta la fase 5 («Para este caso», ramas plegadas) lo comprueba el
    // smoke («Fase 5: pauta por situación…»)
  });
}

// ── Versión desplegada (lib/version.js) ─────────────────────────────────────
console.log('\nversión desplegada');
{
  const V = await import('../../lib/version.js');

  test('en el repo la versión es dev y no se compara con nada', () => {
    assert.equal(V.VERSION_SHA, 'dev');
    assert.equal(V.VERSION_FECHA, '');
    assert.equal(V.textoVersion(), 'dev');
    assert.equal(V.esVersionNueva({ sha: 'a1b2c3d' }), false);
  });

  test('textoVersion: sha y fecha local; sin fecha válida, solo el sha', () => {
    // El año solo cuando no es el actual
    assert.doesNotMatch(V.textoVersion('a1b2c3d', '2026-10-07T12:32:00Z', new Date('2026-12-01')), /2026/);
    assert.match(V.textoVersion('a1b2c3d', '2026-10-07T12:32:00Z', new Date('2026-12-01')), /^a1b2c3d · 7 oct/);
    assert.match(V.textoVersion('a1b2c3d', '2026-10-07T12:32:00Z', new Date('2027-01-02')), /^a1b2c3d · .*2026/);
    assert.equal(V.textoVersion('a1b2c3d', ''), 'a1b2c3d');
    assert.equal(V.textoVersion('a1b2c3d', 'basura'), 'a1b2c3d');
  });

  test('esVersionNueva: solo un sha válido y distinto del cargado', () => {
    assert.equal(V.esVersionNueva({ sha: 'ffffff0' }, 'a1b2c3d'), true);
    assert.equal(V.esVersionNueva({ sha: 'a1b2c3d' }, 'a1b2c3d'), false);
    for (const raro of [null, {}, { sha: '' }, { sha: 'dev' }, { sha: '<b>x</b>' }, { sha: 42 }])
      assert.equal(V.esVersionNueva(raro, 'a1b2c3d'), false, JSON.stringify(raro));
  });

  test('deploy: copia lib/version.js, sustituye las dos líneas y publica version.json', () => {
    const src = leer('lib/version.js');
    assert.match(src, /^export const VERSION_SHA = 'dev';$/m, 'deploy-to-hub.yml busca esta línea exacta');
    assert.match(src, /^export const VERSION_FECHA = '';$/m, 'deploy-to-hub.yml busca esta línea exacta');
    const wf = leer('.github/workflows/deploy-to-hub.yml');
    assert.ok(/cp lib\/[^\n]*lib\/version\.js[^\n]*physiq-hub\/assessment\/lib\//.test(wf), 'lib/version.js se copia al hub');
    assert.ok(wf.includes("s/^export const VERSION_SHA = 'dev';$/"));
    assert.ok(wf.includes("s/^export const VERSION_FECHA = '';$/"));
    assert.ok(wf.includes('physiq-hub/assessment/version.json'));
  });

  test('la comprobación no provoca un bucle de «Hay una versión nueva» tras recargar', () => {
    const src = leer('app.js');
    // version.json por su URL normal, como el código: un ?t= único lo traía
    // nuevo mientras lib/version.js seguía en caché
    assert.match(src, /fetch\('\.\/version\.json', \{ cache: 'no-store' \}\)/);
    assert.doesNotMatch(src, /version\.json\?t=/);
    // «Recargar» vuelve a pedir los archivos propios antes de recargar
    const rec = src.slice(src.indexOf('function recargarVersionNueva'), src.indexOf('function toggleSessionPanel'));
    assert.match(rec, /await _refrescarArchivosApp\(\);\s*location\.reload\(\);/);
    assert.match(src, /fetch\(u, \{ cache: 'reload' \}\)/);
    // y el panel ofrece comprobarlo a mano
    assert.match(src, /id="sessionVersionComprobar">Comprobar</);
    // con versión nueva, el mismo hueco: «Actualizar» en naranja, sin texto aparte
    assert.match(src, /session-version-btn-nueva" id="sessionVersionRecargar"[^>]*>Actualizar</);
    assert.doesNotMatch(src, /hay una más reciente/);
    // el aviso flotante usa la misma palabra que el panel
    assert.match(src, /id="versionAvisoRecargar">Actualizar</);
  });

  test('sw.js no sirve ni guarda version.json desde la caché', () => {
    const sw = leer('sw.js');
    assert.match(sw, /if \(url\.pathname\.endsWith\('\/version\.json'\)\) return;/);
  });
}
