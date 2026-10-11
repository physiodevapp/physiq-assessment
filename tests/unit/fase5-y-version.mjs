// Fase 5 plegable y versión desplegada. Se ejecuta desde tests/unit.js.
import { assert, leer, test, HYPOTHESES, CIF_TREES, DOSIS_DERIVAR, withState } from './comun.mjs';
const IA = await import('../../informe-ia.js');
const P = await import('../../lib/pauta.js');

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
      assert.match(HYPOTHESES[id].pronostico.derivacion, /[Dd]erivar[^.]*(no mejoran|persisten|siguen siendo intensos)/, `${id}: el criterio está en el pronóstico`);
    }
    // co3: el criterio es de cirugía, no de derivación (Andrés, codo)
    assert.ok(!/cirugía/.test(HYPOTHESES.co3.dosis), 'co3: sin criterios de cirugía en la pauta');
    assert.match(HYPOTHESES.co3.pronostico.derivacion, /no mejora más tras 3–6 meses[^.]*cirugía/);
  });

  test('pauta: la fase 5 pone delante la rama del caso y el informe con IA recibe solo esa', () => {
    withState({ region: 'rodilla', mecanismo: 'Traumático', activeHypotheses: ['ro2'], treeAnswers: { ro_step1: 'menisco', ro_step5: 'menisco' }, testResults: {} }, () => {
      const p = IA.construirAmpliado().pautas.find(x => x.hipotesis === HYPOTHESES.ro2.name);
      assert.ok(p.pauta.startsWith('Rotura traumática'), p.pauta.slice(0, 40));
      assert.ok(!/electroestimulación|Tras una meniscectomía/.test(p.pauta));
    });
    withState({ region: 'rodilla', mecanismo: '', activeHypotheses: ['ro2'], treeAnswers: {}, testResults: {} }, () => {
      assert.equal(IA.construirAmpliado().pautas.find(x => x.hipotesis === HYPOTHESES.ro2.name).pauta, HYPOTHESES.ro2.dosis);
    });
    const src = leer('app.js');
    assert.match(src, /function _pautaConRamasHTML\(hyp\)[\s\S]{0,300}if \(!r\) return _pautaPlegableHTML\(hyp\.dosis, hyp\.dosisFuente\)/, 'sin rama, como antes');
    assert.match(src, /Para este caso: \$\{r\.rama\.titulo\}/);
    assert.match(src, /<details class="pauta-otras">/);
  });

  test('lo que es seguridad no se pliega: la pauta «Derivar» y la nota posquirúrgica quedan fuera del <details>', () => {
    const src = leer('app.js');
    assert.match(src, /!tratada && hyp\.dosis && hyp\.dosis !== DOSIS_DERIVAR\s*\? _pautaConRamasHTML\(hyp\)/);
    const tarjeta = src.slice(src.indexOf('? _pautaConRamasHTML(hyp)'), src.indexOf('🧭 Pronóstico y derivación'));
    assert.match(tarjeta, /\}`\}\s*\$\{cq && !tratada[^\n]*TEXTO_PAUTA_COMPATIBLE/, 'la nota posquirúrgica va después del bloque de la pauta, no dentro');
    assert.match(src, /addEventListener\('beforeprint'[\s\S]{0,200}#phase5 details:not\(\[open\]\)/, 'al imprimir se despliega');
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
