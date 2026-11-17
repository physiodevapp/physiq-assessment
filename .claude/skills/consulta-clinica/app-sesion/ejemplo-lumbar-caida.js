// Plan de EJEMPLO para la app de sesión (formato en LEEME.md). Caso genérico: edad y cifras no son de ningún paciente.
// soloSiCondicion: ítems que no se aplican mientras la fractura vertebral no esté descartada
// («sin terapia manual ni ejercicios con carga sobre la zona lumbar; solo educación,
// transferencias seguras y equilibrio sentado, sin dolor»).
globalThis.PLAN = {
  id: 'ejemplo-lumbar-caida',
  titulo: 'Sesión lumbar (ejemplo)',
  nombre: 'Lumbar tras caída · ejemplo',
  sesiones: 4,
  resumen: 'Paciente mayor · dolor lumbar tras caída de espaldas · deterioro cognitivo · riesgo alto de caída',
  tipo: 'Plan A: 1 sesión por semana de 50 min, 4 sesiones. Documento para el fisioterapeuta.',
  condicion: {
    corto: 'Fractura',
    titulo: 'Condición para aplicar este plan: fractura vertebral descartada.',
    pregunta: 'Fractura vertebral descartada',
    si: 'Sí, descartada',
    no: 'No o sin confirmar',
    reducido: 'Plan reducido: no apliques lo marcado como «No aplicar». Solo educación, transferencias seguras y equilibrio sentado, sin dolor. Pide valoración médica pronto (radiografía).',
    noAplicar: 'No aplicar: fractura sin descartar',
    noAplicado: 'no aplicado: fractura sin descartar',
    anexoSi: 'Sí: plan completo.',
    anexoNo: 'No (o sin confirmar): plan reducido.',
    siNo: 'Si no se puede descartar: sin terapia manual ni ejercicios con carga sobre la zona lumbar, y valoración médica pronto (radiografía). Mientras tanto, solo educación, transferencias seguras y equilibrio sentado, sin dolor.',
    urgencias: 'Urgencias hoy si hay debilidad, hormigueo o torpeza nuevas en las piernas, adormecimiento entre las piernas o cambios al orinar o hacer de vientre.'
  },
  antes: {
    titulo: 'Antes de empezar',
    corto: 'Antes',
    min: 5,
    sub: 'con la familia',
    items: [
      { id: 'a1', opciones: ['Rx sin fractura', 'Rx con fractura', 'Sin radiografía', 'No lo saben'], alertas: { 'Rx con fractura': 'Revisa «Antes de tratar»: con fractura, plan reducido y valoración médica.' }, nota: 'Diagnóstico y analgesia pautada', texto: 'Informe de Urgencias: ¿radiografía hecha?, ¿diagnóstico?, ¿qué analgesia le pautaron?' },
      { id: 'a2', opciones: ['Ya le pasaba antes', 'Es nuevo', 'No lo saben'], alertas: { 'Es nuevo': 'Si no lo explica el dolor, coméntalo con su médico.' }, texto: 'Desplazamiento a la izquierda: ¿ya se inclinaba o se caía hacia la izquierda antes de la caída? Si es nuevo y no lo explica el dolor, coméntalo con su médico.' },
      { id: 'a3', opciones: ['Sin cambios', 'Con cambios', 'No lo saben'], alertas: { 'Con cambios': 'Urgencias hoy si hay cambios al orinar o hacer de vientre.' }, texto: 'Continencia: ¿algún cambio al orinar o hacer de vientre desde la caída?' },
      { id: 'a4', multi: true, exclusivas: ['Ninguno de estos', 'No lo saben'], opciones: ['Opioides', 'Benzodiacepinas', 'Hipnóticos', 'Ninguno de estos', 'No lo saben'], nota: 'Resto de la medicación', texto: 'Medicación completa: sobre todo analgésicos opioides, benzodiacepinas e hipnóticos (aumentan el riesgo de caída).' },
      { id: 'a5', opciones: ['Ninguna más', '1 más', '2 o más', 'No lo saben'], nota: '¿Se levantó solo? ¿Perdió el conocimiento?', texto: 'Caídas: ¿cuántas en el último año?, ¿pudo levantarse solo?, ¿perdió el conocimiento?' },
      { id: 'a6', opciones: ['Caminaba solo', 'Con bastón', 'Con andador', 'Con ayuda de otra persona'], nota: 'Qué hacía solo', texto: 'Nivel previo: cómo caminaba y qué hacía solo antes de la caída (marca el objetivo realista).' },
      { id: 'a7', multi: true, exclusivas: ['Ninguna de las dos'], opciones: ['El dolor baja a la pierna', 'Le despierta por la noche', 'Ninguna de las dos'], nota: 'Fecha de la caída', texto: 'Fecha de la caída y si el dolor baja a la pierna o despierta por la noche.' }
    ]
  },
  bloques: [
    { id: 'b1', corto: 'Reeval.', nombre: 'Reevaluación', min: 5, grupos: [{ items: [
      { id: 'b1i1', corto: 'Cómo estuvo tras neuro (dolor, sueño, movilidad)', texto: 'Cómo estuvo tras la sesión de neuro: dolor, sueño, movilidad (pregunta también a la familia).' },
      { id: 'b1i2', corto: 'EVN en reposo y al levantarse', texto: 'EVN en reposo y al levantarse de la silla.' },
      { id: 'b1i3', corto: 'Signo comparable: extensión de cadera izq.', texto: 'Signo comparable: extensión de cadera izquierda (con dolor lumbar 8/10 en la valoración). Elige una posición que tolere.' },
      { id: 'b1i4', corto: 'Actividad de control: sentado → de pie', texto: 'Actividad de control: sentado → de pie (con apoyo de manos).' },
      { id: 'b1i5', corto: 'Neuro rápida de MMII (fuerza, sensibilidad, reflejos)', texto: 'Exploración neurológica rápida de miembros inferiores (fuerza, sensibilidad, reflejos), para tener la referencia.' }
    ] }] },
    { id: 'b2', corto: 'Educ.', nombre: 'Educación', min: 7, grupos: [{ items: [
      { id: 'b2i1', corto: 'El dolor es del golpe; moverse ayuda y no daña', texto: 'A él y al familiar: el dolor es del golpe, sin fractura; moverse ayuda y no daña.' },
      { id: 'b2i2', corto: 'Moverse con seguridad: agacharse, girar, altura', texto: 'Moverse con seguridad: doblar caderas y rodillas con la espalda recta al agacharse; girar dando pasos, sin torcer el tronco; cosas a la altura de la cintura, no en el suelo.' },
      { id: 'b2i3', corto: 'El ejercicio en casa es lo principal', texto: 'Explicar que el ejercicio en casa es la parte principal del plan.' }
    ] }] },
    { id: 'b3', corto: 'Interv.', nombre: 'Intervención principal', min: 23, grupos: [
      { titulo: 'a) Terapia manual (≈ 8 min)', items: [
        { id: 'b3i1', corto: 'Movilización lumbar grados I–II, sin dolor', texto: 'Movilización suave lumbar en posición cómoda (decúbito lateral si no tolera prono), sin provocar dolor: grados I–II.', soloSiCondicion: true },
        { id: 'b3i2', corto: '3–4 × 30 s por nivel; reevaluar tras cada una', texto: '3–4 movilizaciones de ≈ 30 s por nivel; la mitad si duele mucho. Reevaluar el signo comparable tras cada una.', soloSiCondicion: true },
        { id: 'b3i3', corto: 'Repetir lo que funcionó en neuro; sin thrust', texto: 'Si es lo que le funcionó en neuro, repítelo igual. Sin manipulación con thrust.', soloSiCondicion: true }
      ] },
      { titulo: 'b) Transferencias (≈ 7 min)', items: [
        { id: 'b3i4', corto: 'Tumbado → sentado, en bloque', texto: 'Tumbado → sentado: de lado, en bloque, empujando con el brazo, piernas fuera de la camilla. Camilla a la altura de su cama.' },
        { id: 'b3i5', corto: 'Sentado → de pie, desde silla alta', texto: 'Sentado → de pie: silla alta con brazos, pies atrás, inclinar el tronco desde la cadera. Que lo vea y practique el familiar.' }
      ] },
      { titulo: 'c) Equilibrio y función (≈ 8 min)', items: [
        { id: 'b3i6', corto: 'Equilibrio sentado sin respaldo', texto: 'Sentado sin respaldo: estrechar poco a poco la base y corregir la inclinación a la izquierda (espejo o mano como referencia).' },
        { id: 'b3i7', corto: 'De pie en barra: peso a la pierna derecha', texto: 'De pie con apoyo en barra: llevar el peso a la pierna derecha y volver; reducir la base de apoyo según tolere.', soloSiCondicion: true },
        { id: 'b3i8', corto: 'Sentarse y levantarse: 2 × 5, sin dolor fuerte', texto: 'Sentarse y levantarse desde una altura que pueda hacer sin dolor fuerte: 2 series de 5.', soloSiCondicion: true }
      ] }
    ] },
    { id: 'b4', corto: 'Domic.', nombre: 'Programa domiciliario', min: 10, grupos: [{ items: [
      { id: 'b4i1', corto: 'Enseñar y comprobar los 3 ejercicios', texto: 'Enseñar y comprobar 3 ejercicios (abajo), con el familiar delante y haciéndolos él.' },
      { id: 'b4i2', corto: 'Dar la hoja y la tabla de registro', texto: 'Dar una hoja sencilla y una tabla para anotar si lo ha hecho y cómo estuvo a las 24 h de la sesión.' }
    ] }] },
    { id: 'b5', corto: 'Cierre', fijo: true, nombre: 'Cierre', min: 5, grupos: [{ items: [
      { id: 'b5i1', corto: 'Reevaluar signo comparable y actividad de control', texto: 'Reevaluar el signo comparable y la actividad de control.' },
      { id: 'b5i2', corto: 'Qué vigilar hasta la próxima sesión', texto: 'Explicar qué vigilar hasta la próxima sesión: al levantarse, por la noche y tras los ejercicios.' },
      { id: 'b5i3', completo: true, texto: 'Red de seguridad (al familiar, y comprobar que lo ha entendido): dolor de espalda fuerte que empieza de golpe tras un esfuerzo pequeño → médico; si además debilidad u hormigueo en las piernas o cambios al orinar → urgencias.' }
    ] }] }
  ],
  medidas: [
    { id: 'm_evn_reposo', bloque: 'b1', etiqueta: 'EVN en reposo', tipo: 'evn' },
    { id: 'm_evn_levantarse', bloque: 'b1', etiqueta: 'EVN al levantarse de la silla', tipo: 'evn' },
    { id: 'm_sc_ini', bloque: 'b1', etiqueta: 'Signo comparable (extensión cadera izq.) · inicio', tipo: 'evn' },
    { id: 'm_sc_fin', inicio: 'm_sc_ini', bloque: 'b5', etiqueta: 'Signo comparable (extensión cadera izq.) · final', tipo: 'evn' },
    { id: 'm_ac_ini', bloque: 'b1', etiqueta: 'Actividad de control (sentado → de pie) · inicio', tipo: 'opciones', opciones: ['Sin ayuda', 'Con una mano', 'Con dos manos', 'No puede'] },
    { id: 'm_ac_fin', inicio: 'm_ac_ini', bloque: 'b5', etiqueta: 'Actividad de control (sentado → de pie) · final', tipo: 'opciones', opciones: ['Sin ayuda', 'Con una mano', 'Con dos manos', 'No puede'] },
    { id: 'm_neuro', bloque: 'b1', etiqueta: 'Exploración neurológica MMII', tipo: 'opciones', opciones: ['Sin alteraciones', 'Alterada'], nota: 'Qué está alterado', alertas: { 'Alterada': 'Anota qué está alterado: es la referencia para las próximas sesiones.' } }
  ],
  casa: {
    titulo: 'Programa para casa',
    sub: 'a diario, siempre con un familiar al lado',
    ejercicios: [
      { id: 'c1', nombre: '1. Sentarse y levantarse', dosis: '2 series de 5, 1–2 veces al día', como: 'Silla firme con brazos, contra la pared. Puede ayudarse con las manos.', soloSiCondicion: true },
      { id: 'c2', nombre: '2. Peso de un pie al otro', dosis: '1–2 min, 2 veces al día', como: 'De pie, frente a la encimera y agarrado. El familiar al lado.', soloSiCondicion: true },
      { id: 'c3', nombre: '3. Paseo acompañado', dosis: '5–10 min, 1–2 veces al día', como: 'Con bastón y acompañado, por casa o fuera. Parar si el dolor sube.', soloSiCondicion: true }
    ],
    nota: 'Anotar cada día: hecho / no hecho, y si al día siguiente estuvo igual, mejor o peor.'
  },
  progresion: {
    regla: 'Regla general: al principio, lo mínimo que no provoque recaída; progresar al ritmo de los síntomas, reevaluando en la sesión y entre sesiones. Con 1 sesión por semana, la carga del mes la pone el programa de casa.',
    columnas: ['Terapia manual', 'Equilibrio, función y fuerza', 'Casa'],
    filas: [
      { n: 1, etiqueta: '1 · mañana', celdas: ['Grados I–II, sin dolor. Repetir lo que funcionó.', 'Transferencias; equilibrio sentado; peso a la derecha con apoyo; sentarse-levantarse desde silla alta.', 'Los 3 ejercicios de arriba.'] },
      { n: 2, etiqueta: '2 · semana 2 (sesión intermedia)', celdas: ['Si mejoró: repetir igual. Si no cambió: un poco más firme. Si empeoró: no repetirla. Si el dolor baja: hasta donde empieza el dolor (grado II, luego III).', 'Pies más juntos con apoyo; pasos laterales en barra; giros dando pasos; bajar la altura de la silla.', 'Añadir pies juntos agarrado a la encimera (3 × 20–30 s). Revisar la tabla de casa.'] },
      { n: 3, etiqueta: '3 · semana 3', celdas: ['Menos tiempo: solo si sigue aportando.', 'Fuerza sin flexión con carga: puente glúteo si ya lo tolera, extensores de espalda suaves (boca arriba o de pie contra la pared). Marcha alargando la zancada y apoyando más tiempo en la derecha.', 'Subir repeticiones de sentarse-levantarse; paso adelante y atrás agarrado.'] },
      { n: 4, etiqueta: '4 · semana 4 (final)', celdas: ['Decidir si sigue haciendo falta.', 'Repetir las medidas de la valoración (abajo). Decidir: seguir, pausa o alta.', 'Ajustar el programa para el mes siguiente.'] }
    ]
  },
  seguir: [
    'Si una técnica no cambia nada, repetirla más firme; si sigue sin cambio, descartarla. Si mejora, repetirla; si empeora, no repetirla.',
    'Si se espera una mejora lenta, no cambiar una técnica antes de usarla 2 sesiones o más.',
    'Con una mejora del 75 % o más en una sesión, no subir la dosis.',
    'Sin cambio en 10–14 días: pausa y reevaluación. Devolver al médico si los signos no siguen el patrón habitual o no mejora.'
  ],
  durante: [
    'Sin manipulación con thrust en la columna ni en las costillas; la movilización suave sí.',
    'Sin flexión de tronco con carga; cuidado al pasar de tumbado a sentado y al darse la vuelta.',
    'Riesgo de caídas alto: plantear una valoración integral de caídas (casa, medicación, vista, supervisión) con su médico.',
    'Pedir al médico que valore el riesgo de fractura (densitometría): edad avanzada y una caída con dolor intenso.'
  ],
  comparar: { sesion: 4, filas: [
    { id: 'k1', medida: 'EVN lumbar (extensión cadera izq.)', inicial: '8/10' },
    { id: 'k2', medida: 'Berg', inicial: '30/56' },
    { id: 'k3', medida: 'Timed Up and Go', inicial: '30 s' },
    { id: 'k4', medida: '5 Sit-to-Stand', inicial: '24 s con bastón (sin apoyo: 1 rep.)' },
    { id: 'k5', medida: 'Velocidad de marcha (G-Walk)', inicial: '0,8 m/s' },
    { id: 'k6', medida: 'Cadencia', inicial: '120 pasos/min' },
    { id: 'k7', medida: 'Índice de simetría', inicial: '80 %' },
    { id: 'k8', medida: 'Giro 360°', inicial: '17 s (dcha.) · 13 s (izq.)' },
    { id: 'k9', medida: 'Puente glúteo', inicial: 'No realizado por dolor' }
  ] }
};
