// ============================================================
// Modo guía con grabadora externa (docs/modo-guia.md): textos.
// Solo datos. Lo pinta app.js; la lógica pura está en lib/modo-guia.js.
// ============================================================

// Campos de texto de la fase 1 y 3 que en modo guía no se teclean: en su lugar
// va la frase para decir en voz alta (decisión 4). `id` = el <textarea>; la
// respuesta sale solo del audio. `ancla`: además se sugiere decir el resultado
// en voz alta (decisión 5). Las frases las revisa el fisio (paso 3 del plan) y se dicen de «tú» al paciente (decisión del fisio, 2026-10).
// `ia`: grupo del informe con IA al que va la respuesta (los de GRUPOS_FORMULARIO
// de lib/informe-narrativo.js, más 'exploracion'); `iaTexto`: cómo se nombra en el
// prompt cuando la frase no es una pregunta al paciente.
export const VERBALES = {
  motivoConsulta: { frase: '¿Qué te trae por aquí? ¿Qué te pasa y desde cuándo?', ia: 'historia' },
  signoComparable: {
    frase: 'Dilo en voz alta cuando lo encuentres: el movimiento que reproduce sus síntomas.',
    ancla: 'Ej.: «Flexión de hombro a 100º con dolor 6 sobre 10»',
    ia: 'exploracion',
    iaTexto: 'Signo comparable: el movimiento que reproduce los síntomas (lo dice el fisioterapeuta durante la exploración)'
  },
  cirIntervencion: { frase: '¿Qué operación te hicieron y cuándo?', ia: 'historia', soloPosq: true },
  cirRestricciones: { frase: '¿Qué restricciones o protocolo te ha dado el cirujano?', ia: 'historia', soloPosq: true }
};

export const TEXTOS_GUIA = {
  // Decisión 13: el consentimiento se pide al empezar a grabar, para que quede en el audio
  consentimiento: 'Al empezar a grabar, informa al paciente y pídele su consentimiento: así queda en el audio.',
  // Tarjeta «🎙 Informe con IA» en modo guía
  informeConAudio: 'Registro con la app como guía: los textos libres (motivo, historia, antecedentes, signo comparable…) no se escribieron. El informe los toma del audio de la consulta.',
  informeSinAudio: 'Registro con la app como guía y sin audio: el informe solo tendrá lo que marcaste con botones. Lo que se preguntó de palabra no constará. Adjunta el audio de la grabadora con «📎 Adjuntar audio».',
  preguntado: 'Preguntado',
  anclaTest: 'Dilo en voz alta al marcarlo',
  cambioAGuia: 'Las respuestas «NO» que no marcaste a propósito se quedan sin responder: no se sabe si se preguntaron. Las respuestas «SÍ» se mantienen.',
  cambioATeclado: 'Las preguntas sin responder pasarán a «NO», como en el modo con teclado.'
};

// Decisión 6 (docs/modo-guia.md): contraste de la transcripción con las preguntas
// de urgencia. Si en la consulta aparece uno de estos patrones y la pregunta está
// en NO o sin responder, la revisión automática del informe lo señala (nunca
// marca nada). Patrones sobre el texto en minúsculas y sin acentos. Redactados
// desde la pregunta y su clínica, sin consultas reales en modo guía: afinar con
// ellas. Cada patrón apunta al dato rojo concreto, no al tema: en una consulta de
// fisioterapia se habla todo el rato de golpes, caídas, hinchazón y «no puedo
// mover…», y eso solo no es una urgencia (ni las luxaciones previas del hombro,
// que pregunta su formulario).
// Falsos positivos medidos con tests/fixtures/informes (todas las preguntas sin
// responder): con las 6 de lumbar, 2 de 25 transcripciones daban aviso, las dos
// «la pantorrilla está blanda, no está caliente»; por eso el hueco entre la parte
// del cuerpo y el adjetivo no puede contener una negación (HUECO).
const HUECO = n => `(?:(?!\\bno\\b|\\bni\\b|\\bsin\\b)[^.?!]){0,${n}}`;

// Compartidos entre regiones: la misma clínica con su pregunta en cada una
const TVP = [
  `(?:pantorrilla|gemelo|pierna)${HUECO(30)}(?:hinchad|inflamad|caliente)`,
  `(?:hinchad|inflamad)${HUECO(20)}(?:pantorrilla|gemelo)`,
  'trombosis|trombo\\b'
];
const ECTOPICO = [
  '(?:retraso|falta) de la regla',
  'no me (?:ha )?(?:bajado|venido) la regla',
  '(?:sangrado|manchado) vaginal',
  'sangro (?:fuera de la regla|sin tener la regla)'
];
const FIEBRE = ['fiebre', 'febricula', 'escalofrios', 'tiritona'];
const CARDIACO = [
  'dolor (?:en el|de) pecho',
  'opresion en el pecho',
  'me aprieta el pecho',
  'infarto|angina'
];
const ISQUEMIA = [
  `(?:pierna|pie)${HUECO(20)}(?:fri[ao]s?|palid[ao]s?|helad[ao]s?)`,
  'no (?:noto|siento) el pie',
  'sin pulso|no (?:hay|tiene|le noto|se nota) pulso'
];

export const CONTRASTE_URGENCIAS = {
  // ── Lumbar (piloto, paso 4) y las de todas las regiones ──
  l6: {
    tema: 'síntomas de cauda equina (esfínteres o sensibilidad en silla de montar)',
    patrones: [
      'incontinencia',
      'se me escap\\w* (?:el |la )?(?:pis|orina|caca|heces)',
      'no (?:puedo|consigo|soy capaz de) (?:orinar|hacer pis|mear)',
      'me cuesta (?:orinar|hacer pis|mear)',
      'retencion de orina|retengo (?:la )?orina',
      'no (?:noto|siento) (?:cuando|las ganas de) (?:orino|orinar|hacer pis|ir al bano)',
      'silla de montar',
      `(?:dormid[oa]s?|acorchad[oa]s?|insensible|sin sensibilidad)${HUECO(40)}(?:entre las piernas|genitales|perine|zona genital|el ano|la zona del culo)`,
      `(?:entre las piernas|genitales|perine|zona genital|el ano)${HUECO(30)}(?:dormid|acorchad|insensib|sin sensibilidad)`
    ]
  },
  l_e8: { tema: 'un posible embarazo ectópico (retraso de la regla o sangrado vaginal)', patrones: ECTOPICO },
  l_v4: { tema: 'una pierna o pantorrilla hinchada, caliente o dolorosa (posible TVP)', patrones: TVP },
  sx_sincope: {
    tema: 'un desmayo o pérdida de conocimiento',
    patrones: ['desmay\\w*', 'perd\\w* (?:el )?conocimiento', 'sincope', 'me quede inconsciente']
  },
  hem_5: {
    tema: 'un tratamiento contra el cáncer (quimioterapia o radioterapia)',
    patrones: ['quimio\\w*', 'radioterapia', 'tratamiento (?:oncologico|contra el cancer)']
  },
  hem_6: { tema: 'la hemofilia u otro trastorno de la coagulación', patrones: ['hemofili\\w*', 'von willebrand'] },

  // ── Cadera ──
  ca_v2: { tema: 'una pierna o pantorrilla hinchada, caliente o enrojecida (posible TVP)', patrones: TVP },
  ca_v4: {
    tema: 'un dolor súbito, intenso y desgarrador (posible aneurisma o disección)',
    patrones: ['desgarrador', 'como si me (?:desgarr|rasg)\\w*', 'aneurisma', 'diseccion (?:de|aortica)']
  },
  ca_v5: { tema: 'una pierna fría, pálida o sin pulso de repente (posible isquemia)', patrones: ISQUEMIA },
  ca_u3: {
    tema: 'un dolor de testículo con hinchazón (posible torsión)',
    patrones: [`testicul\\w*${HUECO(30)}(?:hinchad|inflamad)`, `(?:hinchad|inflamad)${HUECO(20)}testicul`, 'torsion testicular']
  },
  ca_u5: { tema: 'un posible embarazo ectópico (retraso de la regla o sangrado vaginal)', patrones: ECTOPICO },
  ca_os1: {
    tema: 'una posible fractura de estrés',
    patrones: ['fractura (?:de|por) (?:estres|fatiga|sobrecarga)']
  },
  ca_in1: { tema: 'fiebre o malestar general (posible artritis séptica)', patrones: FIEBRE },

  // ── Cervical ──
  cv_c3: { tema: 'un dolor u opresión en el pecho (posible origen cardiaco)', patrones: CARDIACO },
  cv_ar1: {
    tema: 'signos de disección arterial o ictus (dolor de cabeza nuevo, párpado caído, torpeza)',
    patrones: [
      'parpado caido|se me cae el parpado',
      'pupila (?:mas )?(?:pequena|chica)|pupilas? (?:distintas?|diferentes?)',
      '(?:no puedo|me cuesta) mover (?:la cara|la lengua|los ojos)',
      'torpe(?:za)? al (?:andar|caminar)'
    ]
  },
  cv_ar2: {
    tema: 'signos de insuficiencia vertebrobasilar (visión doble, dificultad para hablar o tragar, caídas súbitas)',
    patrones: [
      'vision doble|veo doble|diplopia',
      '(?:me cuesta|dificultad para|no puedo) (?:hablar|tragar)',
      'disartria|disfagia',
      'me caigo (?:de repente|de golpe|sin perder)',
      `(?:hormigue\\w*|dormid[oa]|acorchad[oa])${HUECO(20)}(?:alrededor de la boca|los labios)`,
      'ronquera'
    ]
  },
  cv_ar3: {
    tema: 'un traumatismo cervical importante (sujetarse la cabeza, caída de cabeza)',
    patrones: ['me (?:tengo que )?sujet\\w* la cabeza|tengo que sujetar(?:me)? la cabeza', 'me aguanto la cabeza', 'caida de cabeza|me tire de cabeza|zambull\\w*']
  },
  cv_ar4: {
    tema: 'un dolor de cabeza nuevo, súbito o con fiebre',
    patrones: [
      'el peor dolor de cabeza',
      'dolor de cabeza (?:muy fuerte )?(?:de golpe|subito|repentino|como nunca|distinto)',
      'cefalea en trueno',
      'rigidez de nuca',
      ...FIEBRE
    ]
  },

  // ── Rodilla ──
  r_v2: { tema: 'una pierna o pantorrilla hinchada, caliente o enrojecida (posible TVP)', patrones: TVP },
  r_v4: { tema: 'una pierna fría, pálida o sin pulso de repente (posible isquemia)', patrones: ISQUEMIA },
  r1: { tema: 'fiebre con la rodilla hinchada (posible artritis séptica)', patrones: FIEBRE },
  r_i3: {
    tema: 'una bursitis prerrotuliana caliente y roja (posible infección)',
    patrones: [`(?:delante de la rotula|encima de la rotula|bolsa de la rotula)${HUECO(30)}(?:roj|caliente|hinchad)`, 'bursitis (?:infectada|septica)']
  },
  ro_t2: {
    tema: 'no poder levantar la pierna estirada tras el traumatismo (posible rotura del aparato extensor)',
    patrones: [
      'no (?:puedo|consigo|soy capaz de) levantar la pierna (?:estirada|recta)',
      'no (?:puedo|consigo) (?:mantener|tener) la rodilla (?:estirada|recta)'
    ]
  },
  ro_t3: {
    tema: 'un traumatismo de alta energía de la rodilla (posible luxación)',
    patrones: ['salpicadero', 'la rodilla se me (?:fue|doblo) hacia atras', 'luxacion de (?:la )?rodilla', 'se me salio la rodilla']
  },
  ro_t4: { tema: 'el pie o la pierna fríos, pálidos o sin pulso tras el traumatismo', patrones: ISQUEMIA },

  // ── Hombro ──
  h_c4: { tema: 'un dolor u opresión en el pecho (posible origen cardiaco)', patrones: CARDIACO },
  h_g1: { tema: 'un posible embarazo ectópico (retraso de la regla o sangrado vaginal)', patrones: ECTOPICO },
  h_gi4: {
    tema: 'un golpe en el costado o el abdomen (posible lesión del bazo)',
    patrones: ['golpe (?:en|contra) el (?:costado|abdomen)', 'me golpee (?:el costado|las costillas|la tripa)', '(?:golpe (?:con|contra)|me di con|me golpee con) el volante', 'bazo']
  },
  h_t1: {
    tema: 'un hombro deformado tras una caída (posible fractura o luxación aguda)',
    patrones: ['hombro (?:deformado|hundido)', 'deformidad']
  },

  // ── Tobillo y pie ──
  tp_t1: { tema: 'el pie frío, pálido o sin pulso tras la lesión (posible síndrome compartimental o lesión vascular)', patrones: [...ISQUEMIA, 'dolor desproporcionado'] },
  tp_i1: { tema: 'fiebre con una articulación hinchada (posible artritis séptica)', patrones: FIEBRE },
  tp_v2: { tema: 'una pierna o pantorrilla hinchada, caliente o dolorosa (posible TVP)', patrones: TVP },
  tp_n1: {
    tema: 'debilidad en las dos piernas que va a más (posible Guillain-Barré)',
    patrones: [
      `(?:debilidad|flojera|pierdo fuerza|perdiendo fuerza)${HUECO(30)}(?:las dos piernas|ambas piernas)`,
      `(?:las dos piernas|ambas piernas)${HUECO(30)}(?:debiles|flojas|sin fuerza)`
    ]
  },

  // ── Codo ──
  co_t1: {
    tema: 'no poder estirar del todo el codo tras un golpe o una caída (prueba de extensión del codo)',
    patrones: ['no (?:puedo|consigo|soy capaz de) (?:estirar|extender) (?:del todo |bien )?el (?:codo|brazo)']
  },
  co_t2: {
    tema: 'un codo deformado, o la mano fría o pálida, tras un golpe',
    patrones: ['codo (?:deformado|hundido)', `mano${HUECO(20)}(?:fri[ao]|palid[ao]|helad[ao])`]
  },
  co1: { tema: 'fiebre con el codo caliente y rojo (posible artritis séptica)', patrones: FIEBRE }
};
