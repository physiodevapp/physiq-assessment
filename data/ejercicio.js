// ============================================================
// PhysiQ-Assessment · data/ejercicio.js
// Contenido de la guía «Efectos del ejercicio» de la cabecera
// (docs/efectos-ejercicio.md). Un bloque por tema, no por molécula. Solo lleva
// `apartados` un bloque escrito con fuentes leídas en la sesión y revisado por
// el usuario; los demás se listan como pendientes.
//
// Límites (docs/efectos-ejercicio.md): solo lectura; nunca una regla de
// dosificación automática; nunca sustituye a un tratamiento médico; nada de
// esto llega al payload, los resúmenes ni el prompt del informe con IA.
//
// Esquema de un bloque con contenido:
//   { id, titulo, resumen,
//     apartados: {
//       que:       [{ t, nivel }],   // qué ocurre
//       evidencia: [{ t, nivel }],   // hasta dónde llega lo demostrado
//       consulta:  [{ t, nivel }],   // qué cambia en la dosis o la decisión (solo si una fuente leída lo dice)
//       paciente:  [{ t, apoya: [i, …] }],   // para explicárselo; `apoya` = índices de `evidencia`
//       detalle?:  string | string[] },      // «Ampliar ▾»
//     fuentes: ['<clave de data/referencias.js>', …] }
// `nivel` es una clave de NIVELES_EJERCICIO. Una frase de `paciente` solo se
// apoya en afirmaciones de `evidencia` con nivel 'clinico' (decisión 4);
// `problemasBloque()` (lib/ejercicio.js) lo comprueba y un test lo exige.
// Las citas dentro de la frase («(Naugle 2012)») se pintan como botones.
// ============================================================

// Tres niveles (decisión 3 de docs/efectos-ejercicio.md). Lo visto solo en
// animales o in vitro es 'mecanismo' y la frase lo dice.
export const NIVELES_EJERCICIO = {
  clinico: {
    corto: 'Clínico',
    explicacion: 'Efecto medido en personas sobre un resultado que importa (dolor, función).',
  },
  mecanismo: {
    corto: 'Mecanismo',
    explicacion: 'Solo el mecanismo (una molécula en sangre, un cambio en el tejido), sin efecto clínico demostrado. Si solo se ha visto en animales o in vitro, la frase lo dice.',
  },
  discutido: {
    corto: 'Discutido',
    explicacion: 'Fuentes leídas que se contradicen: se dicen las dos.',
  },
};

export const APARTADOS_EJERCICIO = [
  { id: 'que', titulo: 'Qué ocurre' },
  { id: 'evidencia', titulo: 'Hasta dónde llega lo demostrado' },
  { id: 'consulta', titulo: 'Qué cambia en la consulta' },
  { id: 'paciente', titulo: 'Para explicárselo al paciente' },
];

// Los cinco bloques, en orden de trabajo. `resumen` es solo la pista de qué
// cubrirá; no es contenido (cada frase saldrá de una fuente leída).
export const BLOQUES_EJERCICIO = [
  // Hipoalgesia (2026-10): cuatro fuentes leídas enteras en PMC. Sin leer
  // (sin texto abierto): Rice 2019 (J Pain) y Wewege y Jones 2021 (J Pain),
  // que no encuentra efecto con el isométrico; docs/efectos-ejercicio.md.
  { id: 'hipoalgesia', titulo: 'Hipoalgesia inducida por el ejercicio',
    resumen: 'Ejercicio local y a distancia, qué pasa en el dolor crónico y con la sensibilización central, y qué implica para la dosis y los brotes',
    apartados: {
      que: [
        { t: 'Una sola sesión de ejercicio reduce durante un rato la sensibilidad al dolor: en el laboratorio, el umbral de dolor a la presión sube un 15–20 % frente al reposo, y el efecto dura de 5 a 30 minutos (Vaegter y Jones 2020). Se mide sobre dolor provocado en el laboratorio, no sobre el dolor del paciente.', nivel: 'mecanismo' },
        { t: 'En personas sanas lo producen el ejercicio aeróbico, el isométrico y el de fuerza dinámica, con efectos de moderados a grandes, más constantes con estímulos de presión que con calor o frío (Naugle 2012).', nivel: 'mecanismo' },
        { t: 'Se atribuye sobre todo a la inhibición descendente del dolor por los sistemas opioide y endocannabinoide, pero en humanos los resultados son equívocos: los antagonistas opioides la aumentan, la reducen o no la cambian, y el apoyo más constante viene de estudios en animales (Naugle 2012; Vaegter y Jones 2020).', nivel: 'discutido' },
      ],
      evidencia: [
        { t: 'Ejercicio regular en dolor crónico: mejora algo la intensidad del dolor y la función física, con efectos de pequeños a moderados que no se repiten en todas las revisiones; la calidad de la evidencia es baja (Geneen 2017, 21 revisiones Cochrane, 381 estudios).', nivel: 'clinico' },
        { t: 'En esas revisiones el ejercicio no empeoró el dolor. Los efectos adversos más comunes fueron agujetas o dolor muscular, que cedieron en unas semanas; solo una cuarta parte de los estudios los registró, así que pueden estar infravalorados (Geneen 2017).', nivel: 'clinico' },
        { t: 'En dolor crónico, la respuesta a una sesión es variable: hipoalgesia, ninguna o incluso hiperalgesia. La hiperalgesia es más frecuente en el dolor generalizado (fibromialgia, latigazo cervical) y en quien tiene mucha sensibilidad al dolor en todo el cuerpo (Vaegter y Jones 2020; Naugle 2012).', nivel: 'mecanismo' },
        { t: 'Ejercitar una zona que no duele puede dar hipoalgesia donde la zona dolorosa no la da: en la mialgia de hombro, el ejercicio con la pierna la produjo y con el hombro doloroso no; en la artrosis de rodilla, la fuerza del tren superior subió el umbral de dolor y la del inferior no (Vaegter y Jones 2020).', nivel: 'mecanismo' },
      ],
      consulta: [
        { t: 'Si ejercitar la zona dolorosa aumenta el dolor, se puede empezar por zonas que no duelen y por ejercicio de baja intensidad, como caminar. Los autores lo proponen como algo que «puede merecer la pena considerar», no como resultado de ensayos (Vaegter y Jones 2020).', nivel: 'mecanismo' },
        { t: 'En la fibromialgia, la intensidad que elige el paciente dio más hipoalgesia que una intensidad prescrita del 60–75 % de la frecuencia cardiaca máxima (Vaegter y Jones 2020; Naugle 2012).', nivel: 'mecanismo' },
        { t: 'No hay una dosis óptima demostrada: un reanálisis de 75 ensayos no encontró una relación clara entre la dosis de ejercicio y el alivio del dolor (Polaski 2019), y la revisión Cochrane no puede orientar el contenido del programa (Geneen 2017).', nivel: 'clinico' },
        { t: 'Muchos pacientes con dolor crónico esperan más dolor tras el ejercicio, y las expectativas negativas se asociaron a menos hipoalgesia; los autores proponen preguntar por creencias y expectativas antes de prescribirlo. Parte de esos datos aún no está publicada (Vaegter y Jones 2020).', nivel: 'mecanismo' },
      ],
      paciente: [
        { t: 'Hacer ejercicio con regularidad suele ayudar algo con el dolor y a moverse mejor. No es un efecto grande ni igual para todo el mundo.', apoya: [0] },
        { t: 'Al empezar es normal notar agujetas o algo más de dolor muscular. Suele pasar en unas semanas, y en los estudios el ejercicio no empeoró el dolor.', apoya: [1] },
      ],
      detalle: [
        'Casi todos los estudios de la hipoalgesia son pequeños (50 personas o menos) y muchos no tienen grupo control, así que probablemente sobrestiman el efecto (Vaegter y Jones 2020). Pocos comparan con una condición de reposo, y los que lo hacen dan efectos bastante menores (Naugle 2012).',
        'En sanos, el efecto isométrico fue mayor con contracciones largas (5 minutos o más) y de intensidad moderada (40–50 % de la contracción máxima), y el aeróbico con más intensidad y más de 10 minutos; son pocos estudios y sin confirmar (Naugle 2012).',
        'No se ha estudiado si la hipoalgesia tras una sesión predice cómo le irá al paciente con el ejercicio regular, y no se sabe cómo reduce el dolor el entrenamiento (Vaegter y Jones 2020).',
        'El catastrofismo se asoció en algunos estudios a menos hipoalgesia, pero no en todos, y el miedo al dolor o la ansiedad apenas se relacionan; la influencia de los factores cognitivos parece limitada (Vaegter y Jones 2020).',
        'Un modelo estadístico predice más alivio con más sesiones por semana, pero los propios autores lo presentan como una predicción para diseñar ensayos, no como un resultado (Polaski 2019).',
      ],
    },
    fuentes: ['Naugle 2012', 'Vaegter y Jones 2020', 'Geneen 2017', 'Polaski 2019'] },
  { id: 'mecanotransduccion', titulo: 'Carga y adaptación del tejido (mecanotransducción)',
    resumen: 'Tendón, hueso, cartílago y músculo: cómo la carga se convierte en adaptación y por qué el reposo absoluto no repara' },
  { id: 'antiinflamatorio', titulo: 'Efecto antiinflamatorio sistémico',
    resumen: 'La IL-6 que libera el músculo al contraerse, su diferencia con la de la inflamación, y qué se sabe en dolor musculoesquelético' },
  { id: 'mioquinas', titulo: 'El músculo como órgano endocrino: otras mioquinas',
    resumen: 'Concepto y estado real de cada mioquina; puede quedar como párrafo del bloque anterior si sus fuentes dan casi solo mecanismo' },
  { id: 'centrales', titulo: 'Efectos centrales',
    resumen: 'Sueño, estado de ánimo y autoeficacia' },
];

export const TEXTOS_EJERCICIO = {
  intro: 'Qué hace el ejercicio en el cuerpo y hasta dónde llega lo que se sabe. Sirve para decidir la dosis y para explicárselo al paciente sin prometer más de lo demostrado.',
  limites: 'Es una guía de lectura: no dosifica por ti, no cambia el plan y no sustituye a un tratamiento médico. Cada afirmación lleva su nivel de evidencia.',
  nivelesTitulo: 'Nivel de cada afirmación',
  pendientesTitulo: 'Pendientes de fuentes revisadas',
  pendientesNota: 'Se escriben de uno en uno, solo con fuentes leídas por completo.',
  pie: 'Contenido de apoyo para el fisioterapeuta. No se guarda ni se comparte con el informe.',
};
