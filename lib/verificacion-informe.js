// ============================================================
// PhysiQ-Assessment · lib/verificacion-informe.js
// Revisión del informe narrativo con IA («capa 3»): un segundo modelo lee los
// datos de la valoración, la transcripción y el informe generado, y devuelve
// los fallos que las reglas de texto de lib/revision-informe.js (capa 1) no
// pueden ver — una afirmación sin respaldo, una indicación atribuida a quien
// no la dio, una sigla desarrollada en un test que no existe…
//
// Funciones puras, sin DOM ni red: el prompt, el esquema de la respuesta, la
// validación de lo que devuelve el modelo y la comparación con los fallos
// conocidos de los informes reales (tests/fixtures/informes/esperado-capa3.json).
// La llamada la hace el worker de physiq-report (POST /verify), que fuerza la
// respuesta al esquema con tool use; aquí viven el prompt y el esquema para
// poder iterarlos sin redesplegar el worker. Medición: tools/verificar-informe.mjs.
// ============================================================
import { contextoValoracion, regionTexto } from './informe-narrativo.js';
import { PATRONES_CAPA1, sinAcentos } from './revision-informe.js';

export const TIPOS_VERIFICACION = {
  'no-respaldado': 'Sin respaldo',
  'contradice': 'Contradice los datos',
  'atribucion': 'Atribución',
  'lectura': 'Lectura alterada',
  'omision': 'Omisión',
  'repetido': 'Repetido',
  'plan': 'Plan',
};
export const MAX_PUNTOS_VERIFICACION = 12;
export const MAX_TOKENS_VERIFICACION = 4000;

// ── Esquema: extracciones, no puntos ─────────────────────────────────────────
// El modelo no «busca fallos» (en la ronda 2 leía el informe para darlo por
// bueno: «PA unilateral dolorosa con restricción», «comprobada mención a
// rodilla derecha»). Rellena una lista por familia de fallo, con hechos
// concretos y citas, y los puntos se derivan aquí, en código
// (puntosDeExtraccion). Cada lista puede ir vacía.
const QUIEN = ['fisioterapeuta', 'cirujano', 'médico', 'paciente', 'pauta de PhysiQ', 'no consta'];
const CONSTA = ['datos', 'transcripción', 'pauta de PhysiQ', 'no consta'];
const cita = { type: 'string', description: 'Fragmento mínimo copiado letra a letra del informe (20 palabras como mucho).' };
const evidencia = { type: 'string', description: 'Copia literal y corta (15 palabras como mucho) de donde consta en los datos o la transcripción, o «no consta».' };
const lista = (description, properties) => ({
  type: 'array', description,
  items: { type: 'object', properties, required: Object.keys(properties) },
});
export const CAMPOS_EXTRACCION = ['tests_alternativas', 'indicaciones', 'afirmaciones', 'siglas', 'pronostico', 'plan'];
export const ESQUEMA_VERIFICACION = {
  type: 'object',
  properties: {
    tests_alternativas: lista('Cada test de los datos cuyo nombre da alternativas con «o» y que el informe describe.', {
      test: { type: 'string', description: 'Nombre del test tal como viene en los datos.' },
      cita,
      afirma_las_dos: { type: 'boolean', description: 'true si el informe afirma las dos alternativas (p. ej. «dolorosa y con menos movilidad»).' },
    }),
    indicaciones: lista('Cada indicación, restricción o consejo del informe (plan, restricciones, actividades permitidas o prohibidas).', {
      cita,
      quien_la_dio: { type: 'string', enum: QUIEN, description: 'Quién la dio según los datos o la transcripción.' },
      evidencia,
      atribuida_en_informe: { type: 'string', enum: ['fisioterapeuta', 'cirujano', 'médico', 'indicación previa', 'sin atribuir'], description: 'A quién la atribuye el informe («indicación previa» si dice que ya se le había indicado antes).' },
      como_si_ya_lo_hiciera: { type: 'boolean', description: 'true si el informe la presenta como algo que el paciente ya hace, no como un consejo.' },
    }),
    afirmaciones: lista('Cada actividad, participación, síntoma, causa o interpretación que el informe afirma y que no está literal en los datos.', {
      cita,
      clase: { type: 'string', enum: ['actividad', 'participación', 'síntoma', 'interpretación'] },
      consta_en: { type: 'string', enum: CONSTA, description: 'Dónde consta lo mismo (también con otras palabras), o «no consta».' },
    }),
    siglas: lista('Cada sigla del informe.', {
      sigla: { type: 'string' },
      cita,
      desarrollo_en_informe: { type: 'string', description: 'Cómo la desarrolla el informe, o «» si no la desarrolla.' },
      desarrollo_en_datos: { type: 'string', description: 'Cómo la desarrollan los datos o la transcripción, o «» si no la desarrollan.' },
    }),
    pronostico: lista('Cada frase del informe que usa el texto de «Pronóstico» o «Cuándo reconsiderar o derivar» de los datos.', {
      cita,
      uso: { type: 'string', enum: ['interpretar tests', 'explicado al paciente', 'plan', 'seguimiento'], description: 'Para qué lo usa el informe.' },
    }),
    plan: lista('Cada técnica, dosis, plazo u objetivo del plan del informe.', {
      cita,
      elemento: { type: 'string', enum: ['técnica', 'dosis', 'plazo', 'objetivo', 'otra zona o lado'], description: '«otra zona o lado» si va dirigido a una zona o lado distinto del valorado.' },
      origen: { type: 'string', enum: ['pauta de PhysiQ', 'fisioterapeuta', 'no consta'] },
    }),
  },
  required: CAMPOS_EXTRACCION,
};

const SIN_AUDIO = '(No hubo audio: el informe debe basarse solo en los datos de la valoración.)';

// El bloque de datos es el mismo que recibió el modelo que escribió el informe
// (contextoValoracion, con los datos ampliados): el revisor juzga contra lo
// mismo que tenía delante el redactor.
export function promptVerificacion(data, { ampliado = null, nombreRegion = r => r, transcripcion = '', informe = '', plantilla = 'narrativo' } = {}) {
  const ficha = plantilla === 'breve';
  return `Eres un fisioterapeuta que extrae datos de un informe clínico. Otro modelo ha redactado el informe de abajo a partir de los DATOS DE LA VALORACIÓN y de la TRANSCRIPCIÓN de la consulta. No tienes que juzgar si el informe está bien: rellena las listas que se piden con lo que encuentres, frase a frase, y con citas literales.

PACIENTE: ${data?.p || '—'} | Región valorada: ${regionTexto(data, nombreRegion)} | Plantilla: ${ficha ? 'ficha breve' : 'informe narrativo'}

${contextoValoracion(data, nombreRegion, ampliado)}

TRANSCRIPCIÓN DE LA CONSULTA:
${(transcripcion || '').trim() || SIN_AUDIO}

---

INFORME A REVISAR:
${informe.trim()}

---

QUÉ EXTRAER (una lista por campo; vacía si no hay nada):
- tests_alternativas: recorre los tests de los datos; por cada uno cuyo nombre da alternativas con «o» («dolorosa o con menos movilidad»), busca cómo lo describe el informe (en cualquier sección, también en conclusiones), cítalo y di si afirma las dos alternativas a la vez.
- indicaciones: cada indicación, restricción o consejo que da el informe (qué hacer, qué evitar, qué actividad sí o no, hasta cuándo). Busca en los datos y en la transcripción quién la dio de verdad (el fisioterapeuta en la consulta, el cirujano, el médico; la pauta de PhysiQ) y a quién se la atribuye el informe («por indicación médica», «según el cirujano», «como se le había indicado previamente»). Marca si el informe la escribe como algo que el paciente ya hace («mantiene la bici estática») en lugar de como un consejo.
- afirmaciones: cada actividad, participación (trabajo, deporte, ocio), síntoma, causa o interpretación («sugiere afectación inflamatoria», «más que neurógeno», «relacionado con ansiedad») que el informe afirma y que no está con esas palabras en los datos. Di dónde consta lo mismo, aunque sea con otras palabras («se me duerme la mano» → parestesias consta en la transcripción), o «no consta». Lo que solo dice la transcripción consta; lo que viene de la pauta de PhysiQ consta.
- siglas: cada sigla del informe (KTW, SLAP, ODI…), cómo la desarrolla el informe y cómo la desarrollan los datos o la transcripción. Un desarrollo que no aparece en los datos se copia igual: tú solo extraes.
- pronostico: cada frase del informe que usa el texto de «Pronóstico» o de «Cuándo reconsiderar o derivar» de los datos, y para qué: interpretar los tests (p. ej. «la lesión aislada es infrecuente» junto a tests positivos), explicárselo al paciente («se informa a la paciente de…»), el plan o el seguimiento.
- plan: cada técnica, dosis, plazo u objetivo de la sección del plan, y de dónde sale: de la pauta de PhysiQ, de lo que dijo el fisioterapeuta (en la transcripción o en sus indicaciones para el plan) o «no consta». Marca «otra zona o lado» lo que va dirigido a una zona o lado distinto del valorado.

FORMATO (sé breve: la respuesta tiene un límite de longitud y si se corta se pierde entera):
- Cada «cita» es el fragmento mínimo del informe que identifica lo extraído, copiado letra a letra, sin cambiar ni una tilde, de 20 palabras como mucho.
- Cada «evidencia» es una copia literal y corta (15 palabras como mucho) de los datos o de la transcripción; si no consta, «no consta».
- En «afirmaciones» no repitas lo que ya esté en «indicaciones» o en «plan».
- Una paráfrasis fiel o un redondeo cuenta como que consta («ocho semanas» por «dos meses», «leve» por «un poco»).`;
}

// ── Validación de la respuesta ───────────────────────────────────────────────
// Para comparar citas: sin markdown, comillas unificadas y espacios colapsados.
export function normalizarCita(t) {
  return String(t || '')
    .replace(/\*\*|__|^#+\s*/gm, '')
    .replace(/[«»“”"]/g, '"').replace(/[‘’']/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// ¿Está la cita, letra a letra, en el informe? Admite que el modelo la acorte
// con «…» o «...»: cada trozo (de 8 caracteres o más) debe estar, en orden.
// Sin distinguir mayúsculas: al citar media frase el modelo pone mayúscula
// inicial («Test de Kleiger-Torg-Weiss» por «…un test de Kleiger-Torg-Weiss»).
export function citaEnInforme(cita, informe) {
  const inf = normalizarCita(informe).toLowerCase();
  const trozos = normalizarCita(cita).toLowerCase().split(/\s*(?:…|\.\.\.)\s*/).map(s => s.trim()).filter(s => s.length >= 8);
  if (!trozos.length) return false;
  let desde = 0;
  for (const t of trozos) {
    const i = inf.indexOf(t, desde);
    if (i < 0) return false;
    desde = i + t.length;
  }
  return true;
}

// Una lista de la respuesta. A veces el modelo manda un array como texto con
// el JSON dentro (y alguna vez con comillas sin escapar, que lo rompen): se
// lee si se puede; si no, null.
function leerLista(v) {
  if (typeof v === 'string') { try { v = JSON.parse(v); } catch { return null; } }
  return Array.isArray(v) ? v : null;
}

const PERSONAS = ['fisioterapeuta', 'cirujano', 'médico'];
const no = v => !v || /^no consta$/i.test(String(v).trim());
// Extracciones → puntos { tipo, nivel, cita, evidencia, mensaje }. Las reglas
// son de código: el modelo solo extrae.
export function puntosDeExtraccion(r) {
  const out = [];
  const add = (tipo, nivel, c, evidencia, mensaje) => out.push({ tipo, nivel, cita: c || '', evidencia: evidencia || '', mensaje });
  for (const t of r.tests_alternativas || [])
    if (t?.afirma_las_dos === true)
      add('lectura', 'alto', t.cita, `Test: ${t.test}`, `El test «${t.test}» da alternativas («o») y el informe afirma las dos.`);
  for (const x of r.indicaciones || []) {
    if (!x) continue;
    const quien = x.quien_la_dio, atr = x.atribuida_en_informe;
    if (atr === 'indicación previa' && quien !== 'no consta' && quien !== 'paciente')
      add('atribucion', 'alto', x.cita, x.evidencia, `La indicación la dio ${quien === 'pauta de PhysiQ' ? 'la pauta' : `el ${quien}`} en esta valoración y el informe dice que ya se le había indicado antes.`);
    else if (PERSONAS.includes(atr) && PERSONAS.includes(quien) && atr !== quien)
      add('atribucion', 'alto', x.cita, x.evidencia, `La indicación la dio el ${quien} y el informe la atribuye al ${atr}.`);
    else if (PERSONAS.includes(atr) && atr !== 'fisioterapeuta' && quien === 'no consta')
      add('atribucion', 'alto', x.cita, x.evidencia, `El informe atribuye al ${atr} una indicación que no consta.`);
    if (x.como_si_ya_lo_hiciera === true)
      add('atribucion', 'medio', x.cita, x.evidencia, 'Un consejo escrito como algo que el paciente ya hace.');
  }
  for (const a of r.afirmaciones || [])
    if (a && a.consta_en === 'no consta')
      add('no-respaldado', a.clase === 'síntoma' ? 'alto' : 'medio', a.cita, '', `${a.clase ? a.clase[0].toUpperCase() + a.clase.slice(1) : 'Afirmación'} que no consta en los datos ni en la consulta.`);
  for (const g of r.siglas || [])
    if (g && String(g.desarrollo_en_informe || '').trim() && !String(g.desarrollo_en_datos || '').trim())
      add('lectura', 'alto', g.cita, `Sigla: ${g.sigla}`, `Desarrolla la sigla ${g.sigla} como «${g.desarrollo_en_informe}», que no aparece en los datos.`);
  for (const q of r.pronostico || [])
    if (q && (q.uso === 'interpretar tests' || q.uso === 'explicado al paciente'))
      add('lectura', 'medio', q.cita, '', q.uso === 'interpretar tests'
        ? 'Usa el pronóstico o «Cuándo reconsiderar» para interpretar los tests; es para el fisioterapeuta.'
        : 'Explica al paciente el pronóstico o «Cuándo reconsiderar»; es para el fisioterapeuta.');
  // Plan para otra zona o lado: siempre, sea cual sea el origen que dé el
  // modelo (la pauta nunca lo cubre, y en Lucía‑1 atribuyó al fisioterapeuta
  // un programa «bilateral» que nadie dijo)
  for (const x of r.plan || []) {
    if (!x) continue;
    if (x.elemento === 'otra zona o lado')
      add('plan', 'alto', x.cita, '', 'Plan para otra zona o lado distinto del valorado: comprueba que lo indicó el fisioterapeuta.');
    else if (x.origen === 'no consta')
      add('plan', 'medio', x.cita, '', `${x.elemento ? x.elemento[0].toUpperCase() + x.elemento.slice(1) : 'Elemento'} del plan que no viene de la pauta ni del fisioterapeuta.`);
  }
  return out;
}

// La lista de puntos de la respuesta: los `puntos` de una respuesta antigua
// (rondas 1 y 2, capa3/ronda-*), o los derivados de las extracciones. null si
// algo no se puede leer (quien llama repite la llamada una vez).
export function listaPuntos(resultado) {
  if (!resultado || typeof resultado !== 'object') return null;
  if ('puntos' in resultado) return leerLista(resultado.puntos);
  const ext = {};
  for (const k of CAMPOS_EXTRACCION) {
    if (resultado[k] === undefined) return null;
    const l = leerLista(resultado[k]);
    if (!l) return null;
    ext[k] = l;
  }
  return puntosDeExtraccion(ext);
}

// «No refiere hormigueo, aunque alguna noche nota la mano dormida»: las dos
// versiones en una frase es lo que pide la regla de discrepancias, no una
// contradicción (lo marcaba en las tres pasadas de Lucía‑2).
export function discrepanciaUnida(c) {
  const t = sinAcentos(c);
  const m = /\b(aunque|pero|si bien|sin embargo)\b/.exec(t);
  return !!m && PATRONES_CAPA1.negacion.test(t.slice(0, m.index));
}

// Lo que devuelve el modelo → puntos válidos. Filtro antialucinación: un punto
// cuya cita no está en el informe se descarta (salvo una omisión, que no la
// tiene). Fuera también los «contradice» que ya dan las dos versiones en una
// frase. Sin repetidos y como mucho MAX_PUNTOS_VERIFICACION. `invalida`: la
// respuesta no traía listas legibles (ver listaPuntos).
export function validarPuntos(resultado, informe) {
  const leida = listaPuntos(resultado);
  const lista = leida || [];
  const vistos = new Set();
  const validos = [];
  const descartados = [];
  for (const p of lista) {
    if (!p || typeof p !== 'object' || !TIPOS_VERIFICACION[p.tipo]) { descartados.push({ punto: p, motivo: 'tipo' }); continue; }
    const nivel = p.nivel === 'alto' ? 'alto' : 'medio';
    const cita = String(p.cita || '').trim();
    const mensaje = String(p.mensaje || '').trim();
    if (!mensaje) { descartados.push({ punto: p, motivo: 'mensaje' }); continue; }
    if (p.tipo !== 'omision' && !citaEnInforme(cita, informe)) { descartados.push({ punto: p, motivo: 'cita' }); continue; }
    if (p.tipo === 'contradice' && discrepanciaUnida(cita)) { descartados.push({ punto: p, motivo: 'discrepancia-unida' }); continue; }
    const clave = `${p.tipo}|${(normalizarCita(cita) || normalizarCita(mensaje)).replace(/[.,;:…\s]+$/, '')}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    validos.push({ tipo: p.tipo, nivel, cita: p.tipo === 'omision' ? '' : cita, evidencia: String(p.evidencia || '').trim(), mensaje });
  }
  // Los de nivel alto primero, para que el tope no los corte
  validos.sort((a, b) => (a.nivel === b.nivel ? 0 : a.nivel === 'alto' ? -1 : 1));
  return { puntos: validos.slice(0, MAX_PUNTOS_VERIFICACION), descartados, invalida: !leida };
}

// ── Medición contra los fallos conocidos ─────────────────────────────────────
// `errores` = los de un informe en esperado-capa3.json: { id, nivel, fragmentos?, claves? }.
// Un error cuenta como detectado si algún punto lo cita (la cita contiene uno de
// sus fragmentos, o al revés) o, en una omisión, si el mensaje o la evidencia
// contienen una de sus claves. Los puntos que ya cubre la capa 1 (`capa1`: sus
// puntos { id, mensaje, cita }, o solo sus citas) cuentan aparte: no son
// aciertos nuevos ni falsos positivos. El resto queda «sin etiquetar»: hay que
// leerlos a mano (puede ser un fallo real que no estaba en la lista).
const casa = (a, b) => {
  const x = normalizarCita(a).replace(/…$/, '').toLowerCase();
  const y = normalizarCita(b).replace(/…$/, '').toLowerCase();
  if (!x || !y) return false;
  return x.includes(y) || (x.length >= 12 && y.includes(x));
};

// ¿Cubre el punto `c` de la capa 1 el punto `p` de la capa 3, aunque citen
// frases distintas? La capa 1 marca una regla una vez (una frase); la capa 3
// puede señalar cada aparición. Por familia de regla:
const FAMILIAS_CAPA1 = {
  'plan-urgente': p => p.tipo === 'plan',
  diagnostico: (p, c, tn) => PATRONES_CAPA1.diagnostico.test(tn),
  atribucion: (p, c, tn, t) => PATRONES_CAPA1.atribucion.test(t),
  fuentes: (p, c, tn, t) => PATRONES_CAPA1.fuentes.test(t),
  frecuencia: (p, c, tn) => PATRONES_CAPA1.frecuencia.test(tn),
  imc: (p, c, tn) => /normopeso|sobrepeso|obesidad/.test(tn),
  'discrepancia-separada': (p, c, tn) => {
    const s = PATRONES_CAPA1.sintomas.find(([nombre]) => String(c.mensaje || '').startsWith(nombre));
    return !!s && s[1].test(tn);
  },
  repetido: (p, c, tn) => {
    const m = String(c.mensaje || '');
    const edad = /La edad \((\d+) años\)/.exec(m);
    if (edad) return new RegExp(`\\b${edad[1]} anos\\b`).test(tn);
    if (/fecha de la cirug/.test(m)) return p.tipo === 'repetido' && /\b\d{1,2} de [a-z]+ de \d{4}\b|\d{1,2}\/\d{1,2}\/\d{4}/.test(tn);
    if (/cirujano/.test(m)) return p.tipo === 'repetido' && /cirujano/.test(tn);
    return false;
  },
};
function cubiertoPorCapa1(p, capa1) {
  const t = p.cita || '';
  const tn = sinAcentos(t);
  return capa1.some(c => {
    const cita = typeof c === 'string' ? c : c?.cita;
    if (p.cita && cita && (casa(p.cita, cita) || casa(cita, p.cita))) return true;
    const f = typeof c === 'object' && c && FAMILIAS_CAPA1[c.id];
    return !!(f && p.cita && f(p, c, tn, t));
  });
}

export function compararConEsperados(puntos, errores, capa1 = []) {
  const detectados = new Set();
  const redundantes = [];
  const sinEtiquetar = [];
  for (const p of puntos) {
    let acierto = false;
    for (const e of errores) {
      const porCita = p.cita && (e.fragmentos || []).some(f => casa(p.cita, f));
      // Claves de una omisión: en una omisión basta una; en otro tipo de punto
      // (el miedo al clavo señalado sobre la frase de «aprensión») deben estar todas
      const texto = `${p.mensaje} ${p.evidencia} ${p.cita || ''}`;
      const claves = e.claves || [];
      const porClave = claves.length > 0 && (p.tipo === 'omision' ? claves.some(c => casa(texto, c)) : claves.every(c => casa(texto, c)));
      if (porCita || porClave) { detectados.add(e.id); acierto = true; }
    }
    if (acierto) continue;
    if (cubiertoPorCapa1(p, capa1)) redundantes.push(p);
    else sinEtiquetar.push(p);
  }
  const fallados = errores.filter(e => !detectados.has(e.id));
  return { detectados: [...detectados], fallados: fallados.map(e => e.id), redundantes, sinEtiquetar };
}
