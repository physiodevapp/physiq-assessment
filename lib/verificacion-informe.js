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
import { CODIGOS_CIF, contextoValoracion, regionTexto } from './informe-narrativo.js';
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
export const MAX_TOKENS_VERIFICACION = 3000;

export const ESQUEMA_VERIFICACION = {
  type: 'object',
  properties: {
    repaso: {
      type: 'string',
      description: 'Antes de los puntos: una línea corta por sección del informe («Título: lo que has comprobado»), sin repetir los puntos.',
    },
    puntos: {
      type: 'array',
      description: 'Fallos encontrados, el más importante primero. Vacío si no hay ninguno.',
      items: {
        type: 'object',
        properties: {
          tipo: { type: 'string', enum: Object.keys(TIPOS_VERIFICACION) },
          nivel: { type: 'string', enum: ['alto', 'medio'] },
          cita: { type: 'string', description: 'Fragmento copiado letra a letra del informe (una frase o menos). Vacío solo en una omisión.' },
          evidencia: { type: 'string', description: 'Lo que dicen los datos o la transcripción, copiado literal; o «No consta en los datos ni en la transcripción».' },
          mensaje: { type: 'string', description: 'Qué está mal, en una frase, para el fisioterapeuta.' },
        },
        required: ['tipo', 'nivel', 'cita', 'evidencia', 'mensaje'],
      },
    },
  },
  required: ['repaso', 'puntos'],
};

const SIN_AUDIO = '(No hubo audio: el informe debe basarse solo en los datos de la valoración.)';

// El bloque de datos es el mismo que recibió el modelo que escribió el informe
// (contextoValoracion, con los datos ampliados): el revisor juzga contra lo
// mismo que tenía delante el redactor.
export function promptVerificacion(data, { ampliado = null, nombreRegion = r => r, transcripcion = '', informe = '', plantilla = 'narrativo' } = {}) {
  const ficha = plantilla === 'breve';
  const codigos = ficha
    ? `\n- Códigos CIF: cada código debe corresponder exactamente al hallazgo al que acompaña, según su término: ${CODIGOS_CIF.map(([c, t]) => `${c} ${t}`).join('; ')}. Un código pegado a algo que su término no describe es «contradice».`
    : '';
  return `Eres un fisioterapeuta revisor. Otro modelo ha redactado el informe clínico de abajo a partir de los DATOS DE LA VALORACIÓN y de la TRANSCRIPCIÓN de la consulta. Tu tarea es encontrar en el informe los errores de contenido que importan clínicamente, comparándolo frase a frase con esas dos fuentes. No reescribas el informe ni opines sobre su estilo.

PACIENTE: ${data?.p || '—'} | Región valorada: ${regionTexto(data, nombreRegion)} | Plantilla: ${ficha ? 'ficha breve' : 'informe narrativo'}

${contextoValoracion(data, nombreRegion, ampliado)}

TRANSCRIPCIÓN DE LA CONSULTA:
${(transcripcion || '').trim() || SIN_AUDIO}

---

INFORME A REVISAR:
${informe.trim()}

---

QUÉ BUSCAR (un punto por fallo, con su tipo):
- no-respaldado: un síntoma, dato, causa, actividad afectada, antecedente, acción de seguimiento o coordinación con otros profesionales, mecanismo o interpretación («sugiere afectación inflamatoria», «más que neurógeno») que no está en los datos, ni en la transcripción, ni en la pauta de PhysiQ. Una paráfrasis o el término clínico de lo que dijo el paciente («se me duerme la mano» → parestesias) sí está respaldado.
- contradice: algo que choca con los datos o con la transcripción (un valor, un resultado de test, el lado, una clasificación del fisioterapeuta, algo que no corresponde al sexo del paciente).
- atribucion: algo atribuido a quien no lo dijo (una indicación del fisioterapeuta en la consulta puesta como del cirujano o del médico, o como algo «ya indicado previamente»); un consejo escrito como algo que el paciente ya hace; un hallazgo atribuido a una causa o a la evolución esperable de la lesión o la cirugía sin que conste.
- lectura: un dato de los datos leído mal: un test cuyo nombre da alternativas («dolorosa o con menos movilidad») descrito afirmando las dos; los componentes de un test agrupado o de un criterio presentados como hallazgos uno a uno cuando solo consta el resultado global; una sigla desarrollada en un nombre que no aparece en los datos; dos cifras distintas del paciente (formulario y consulta) reconciliadas cambiando fechas o circunstancias; el texto de «Pronóstico» o «Cuándo reconsiderar o derivar» usado para interpretar los hallazgos o explicado al paciente como parte del plan.
- omision: algo de los datos o de la transcripción que el informe debía recoger y falta: una derivación, un síntoma o una preocupación que el paciente refiere en la consulta, un resultado de test. Solo si es clínicamente relevante. En una omisión, «cita» va vacía y «evidencia» copia el dato omitido.
- repetido: el mismo dato concreto (una cifra, una restricción, una derivación, un hallazgo) escrito en tres o más sitios, o dos veces en secciones donde no toca. Un resumen breve en las conclusiones no cuenta.
- plan: en el plan, una técnica, dosis, plazo u objetivo que no viene de la pauta de PhysiQ ni de lo que indicó el fisioterapeuta.

REGLAS QUE EL INFORME DEBÍA CUMPLIR (te sirven para juzgar):
- Prevalecen los resultados y clasificaciones del fisioterapeuta; si lo que refiere el paciente cambia entre el formulario y la consulta, el informe debe dar las dos versiones una vez, juntas. Una frase que da las dos versiones unidas por «aunque», «pero» o «si bien» («No refiere hormigueo, aunque alguna noche nota la mano dormida»; «El dolor no le despierta, aunque describe despertares ocasionales al girarse») es justo lo que pide esta regla: no es una contradicción ni una discrepancia.
- La transcripción es una fuente tan válida como los datos: lo que solo consta en ella (una cifra de dolor, una fecha, lo que dijo el médico según el paciente, un test hecho en la consulta aunque no figure en «Tests de confirmación realizados») está respaldado. Lo que solo consta en una de las dos fuentes se recoge tal cual: no es un error que falte en la otra.
- La pauta de PhysiQ es fuente del plan: una técnica, un plazo, la educación o un criterio que estén en ella están respaldados aunque el fisioterapeuta no los diga en la consulta.
- Los tests «apoyan» o «son compatibles» con una hipótesis; el pronóstico y «Cuándo reconsiderar o derivar» son para el fisioterapeuta, no para interpretar los tests ni para el paciente.
- Las cifras (IMC, tensión, frecuencia cardíaca) van sin clasificar.${codigos}

NO SEÑALES (ya lo comprueba otro sistema, o no es un error):
- Estilo, orden de las secciones, longitud, sinónimos, frases de enlace sin contenido clínico.
- Que nombre las fuentes («formulario», «transcripción», «en consulta refiere»…), jerga de puntuaciones, «confirma», «descarta», «No sé», edad, sexo o lado que falten o sobren, la edad o la fecha de la cirugía repetidas, el nombre o la fecha, términos con género cuando el sexo no consta.
- Con una derivación urgente: que el plan proponga tratamiento o que se nombren diagnósticos graves («hemorragia», «intracraneal»…).
- Una frecuencia («con regularidad», «de forma habitual») añadida a una actividad; atribuir los hallazgos a la «evolución esperable»; «confirmar con el cirujano» repetido.
- Una discrepancia dada en una sola frase con las dos versiones (ver arriba).
- Nada que sí esté en los datos, en la transcripción o en la pauta de PhysiQ, aunque lo diga con otras palabras. Una paráfrasis fiel o un redondeo no es un error («ocho semanas» por «dos meses», «leve» por «un poco», «ocasional» por «alguna noche», «ha consolidado» por «ha soldado bien»).
- Dudas: si no estás seguro de que sea un error, no lo señales.

FORMATO:
- «repaso»: antes de los puntos, recorre el informe sección a sección: una línea corta por sección («Título: lo que has comprobado»). No repitas ahí los puntos.
- «cita»: copia el fragmento del informe letra a letra, sin cambiar ni una tilde, de una frase como máximo; si el fallo se repite, cita la primera aparición y dilo en el mensaje.
- «evidencia»: copia literal del dato o de la transcripción que lo contradice, o «No consta en los datos ni en la transcripción».
- «nivel»: «alto» solo si puede cambiar una decisión clínica o confundir a otro profesional (un síntoma, diagnóstico o resultado inventado o contradicho, una restricción o indicación mal atribuida, una derivación omitida); «medio» en lo demás.
- Como máximo ${MAX_PUNTOS_VERIFICACION} puntos, el más importante primero. Si no hay errores, devuelve la lista vacía.`;
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

// La lista de puntos de la respuesta. A veces el modelo manda `puntos` como
// texto con el JSON dentro (y alguna vez con comillas sin escapar, que lo
// rompen): se lee si se puede; si no, la respuesta es inválida (null) y quien
// llama repite la llamada una vez.
export function listaPuntos(resultado) {
  let p = resultado?.puntos;
  if (typeof p === 'string') { try { p = JSON.parse(p); } catch { return null; } }
  return Array.isArray(p) ? p : null;
}

// Lo que devuelve el modelo → puntos válidos. Filtro antialucinación: un punto
// cuya cita no está en el informe se descarta (salvo una omisión, que no la
// tiene). Sin repetidos y como mucho MAX_PUNTOS_VERIFICACION. `invalida`: la
// respuesta no traía una lista legible (ver listaPuntos).
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
    const clave = `${p.tipo}|${(normalizarCita(cita) || normalizarCita(mensaje)).replace(/[.,;:…\s]+$/, '')}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    validos.push({ tipo: p.tipo, nivel, cita: p.tipo === 'omision' ? '' : cita, evidencia: String(p.evidencia || '').trim(), mensaje });
  }
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
      const porClave = p.tipo === 'omision' && (e.claves || []).some(c => casa(`${p.mensaje} ${p.evidencia}`, c));
      if (porCita || porClave) { detectados.add(e.id); acierto = true; }
    }
    if (acierto) continue;
    if (cubiertoPorCapa1(p, capa1)) redundantes.push(p);
    else sinEtiquetar.push(p);
  }
  const fallados = errores.filter(e => !detectados.has(e.id));
  return { detectados: [...detectados], fallados: fallados.map(e => e.id), redundantes, sinEtiquetar };
}
