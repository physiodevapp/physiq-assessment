// ============================================================
// PhysiQ-Assessment · data/farmacos.js
// Contenido de la guía de fármacos de la cabecera (docs/farmacologia.md,
// paso 2). Una fila por familia, no por fármaco suelto. Solo lleva
// `apartados` una familia escrita con fuentes leídas en la sesión y revisada
// por el usuario; las demás se listan como pendientes.
//
// Límites (docs/farmacologia.md): nunca proponer cambiar, suspender ni ajustar
// la medicación; sin interacciones entre fármacos; el tono es «vigila y
// consulta».
//
// Esquema de una familia con contenido:
//   { id, nombre, ejemplos,
//     apartados: { dolor, visceral, ejercicio, sueno, consultar }
//       // cada uno: { texto: string | string[], detalle?: string | string[] }
//       // las citas dentro de la frase («(Schug 2021)») se pintan como botones
//     fuentes: ['<clave de data/referencias.js>', …] }
// Nunca entra en el payload, los resúmenes ni el prompt del informe con IA.
// ============================================================

export const APARTADOS_FARMACO = [
  { id: 'dolor', titulo: 'Dolor, inflamación y curación' },
  { id: 'visceral', titulo: 'Síntomas viscerales o secundarios' },
  { id: 'ejercicio', titulo: 'Ejercicio' },
  { id: 'sueno', titulo: 'Sueño' },
  { id: 'consultar', titulo: 'Cuándo consultar con el médico o el farmacéutico' },
];

export const FAMILIAS_FARMACO = [
  // AINE (2026-10): cinco revisiones leídas enteras en PMC. Sin fuente leída
  // todavía para la presentación clínica de la úlcera (melena, dolor referido
  // a la espalda o al hombro) ni para el sueño: docs/farmacologia.md.
  {
    id: 'aine',
    nombre: 'AINE (antiinflamatorios no esteroideos)',
    ejemplos: 'Ibuprofeno, naproxeno, diclofenaco, dexketoprofeno, celecoxib, etoricoxib',
    apartados: {
      dolor: {
        texto: [
          'Alivian el dolor y, junto con el paracetamol, reducen la necesidad de opioides tras la cirugía (Schug 2021). Las fuentes leídas no estudian cuánto enmascaran la exploración; solo un caso describe que pudieron enmascarar los síntomas de una pericarditis en un corredor (Pannone y Abbott 2024). Anota si tomó una dosis antes de la sesión.',
          'Hueso: en humanos no hay pruebas sólidas de que retrasen la consolidación. Un metaanálisis asocia su uso con retraso o falta de consolidación (OR 2,07), pero con estudios de baja calidad y sin asociación con dosis bajas o tomas de menos de 2 semanas (Schug 2021).',
          'Tendón y ligamento: los datos en humanos son insuficientes y probablemente no perjudican, salvo quizá el celecoxib tras reparar el manguito rotador, con más roturas de nuevo en un ensayo de 180 pacientes (Schug 2021). En músculo y cartílago no hay estudios en humanos (Schug 2021).',
        ],
        detalle: [
          'En un ensayo pequeño (15 personas), los AINE atenuaron el aumento de síntesis de colágeno que produce el ejercicio en el tendón rotuliano (Pannone y Abbott 2024).',
          'Los coxibs (celecoxib, etoricoxib) protegen más las suturas intestinales, pero podrían ser peores para el hueso y las partes blandas; el propio autor lo considera especulativo por la calidad de los datos (Schug 2021).',
        ],
      },
      visceral: {
        texto: [
          'Estómago e intestino: la lesión de la mucosa es su principal limitación en el uso crónico. La gravedad depende sobre todo de la dosis y la duración, y el riesgo sube si ya hubo una complicación digestiva (Bindu 2020). Aumentan el riesgo de sangrado y perforación en el intestino en una medida similar a la del estómago (Papantoniou 2023). La lesión intestinal se manifiesta como anemia ferropénica, indigestión o dolor abdominal y, en lo grave, sangrado oculto o perforación (Bindu 2020).',
          'Riñón y tensión arterial: retienen sodio y agua, con edema a menudo sin síntomas, y pueden subir la tensión (Lucas 2019; Bindu 2020). La lesión renal es rara en personas sanas a dosis habituales; el riesgo se concentra en mayores, enfermedad renal, hepática o cardíaca, deshidratación y quien toma a la vez diuréticos o fármacos del sistema renina-angiotensina (Lucas 2019).',
        ],
        detalle: [
          'Corazón: su uso se asocia a peor salud cardiovascular, aunque se duda del riesgo coronario con dosis bajas durante pocos días. Las personas mayores tienen más riesgo de base de complicaciones cardiovasculares, digestivas, renales y hepáticas (Bindu 2020).',
          'Hígado: la lesión clínica es rara (1–10 casos por 100 000 prescripciones), más con diclofenaco y sulindaco; se presenta como hepatitis aguda con ictericia, náuseas y fiebre (Bindu 2020).',
          'Respiratorio: alrededor del 7 % de las personas con asma tiene broncoespasmo con la aspirina u otros AINE (Bindu 2020).',
        ],
      },
      ejercicio: {
        texto: [
          'Deshidratación y calor: el efecto de los AINE sobre el riñón empeora con deshidratación, poca perfusión renal o daño renal previo (Lucas 2019), y la deshidratación y el ejercicio intenso con calor reducen además el riego intestinal (Papantoniou 2023). Vigila la hidratación en sesiones largas o con calor.',
          'Resistencia: en maratón y ultrafondo las pruebas de daño son limitadas. Un ensayo con ibuprofeno 400 mg en una carrera por etapas vio más lesión renal aguda (22 de 42 frente a 16 de 47 con placebo), sin diferencia significativa, y la revisión aconseja precaución al tomarlos de forma preventiva, sin beneficio en el rendimiento (Pannone y Abbott 2024). Se desaconseja su uso habitual en deportistas, sobre todo antes de competir (Papantoniou 2023).',
          'Tensión arterial: pueden subir la tensión y restar efecto a los diuréticos, en torno a un 20 % (Lucas 2019; Bindu 2020).',
        ],
      },
      sueno: {
        texto: 'Las fuentes leídas no describen un efecto directo de los AINE sobre el sueño. Pendiente de una fuente que lo trate.',
      },
      consultar: {
        texto: [
          'Sangrado digestivo visible: parar toda actividad y buscar atención médica (Papantoniou 2023). El sangrado oculto con anemia necesita estudio (Papantoniou 2023).',
          'También edema, poca orina o proteinuria pocos días después de empezarlos (Lucas 2019); ictericia, náuseas y fiebre; subida de la tensión, sobre todo con enfermedad renal crónica; o broncoespasmo en una persona con asma (Bindu 2020).',
          'Las dudas sobre la dosis, la duración o la combinación con otros fármacos, al médico o al farmacéutico.',
        ],
      },
    },
    fuentes: ['Schug 2021', 'Bindu 2020', 'Lucas 2019', 'Papantoniou 2023', 'Pannone y Abbott 2024'],
  },
  // Corticoides (2026-10): seis revisiones o estudios leídos enteros en PMC y
  // la guía de Beuschlein 2024 por secciones. Sin fuente leída para que
  // enmascaren la fiebre, la fragilidad de la piel, el reposo o la carga tras
  // una infiltración ni el sangrado digestivo con AINE: docs/farmacologia.md.
  {
    id: 'corticoides',
    nombre: 'Corticoides',
    ejemplos: 'Prednisona, metilprednisolona, dexametasona; infiltraciones (triamcinolona, betametasona)',
    apartados: {
      dolor: {
        texto: [
          'Los efectos adversos dependen de la dosis y la duración, sobre todo con dosis altas, más de 2 semanas o más dosis por la tarde que por la mañana, aunque algunos estudios los describen tras una sola dosis o un ciclo corto (Pofi 2023). Cualquier vía puede tener efectos en todo el cuerpo, también la infiltración intraarticular (Pofi 2023).',
          'Infiltraciones: alivian el dolor durante semanas o meses, con el mayor efecto en las 2 primeras semanas, y en las 24–72 h siguientes puede haber dolor e hinchazón en el punto de la inyección. En las tendinopatías se asocian a peores resultados a largo plazo, sobre todo en la epicondilalgia lateral; la rotura del tendón tras la inyección parece poco frecuente (0,1–10 % según los estudios) (Grusky 2026).',
          'Hueso: la osteoporosis por glucocorticoides se debe sobre todo a una menor formación de hueso (Compston 2018).',
        ],
        detalle: [
          'Cartílago: en un ensayo, la triamcinolona intraarticular repetida en la rodilla redujo más el volumen de cartílago que el suero salino, y con dolor de cadera o rodilla sin artrosis previa cada infiltración se asoció a más riesgo de prótesis a los 5 años; otro estudio, con concentraciones fisiológicas, no encontró toxicidad sobre los condrocitos (Grusky 2026).',
          'Tras infiltraciones intraarticulares se han descrito fractura subcondral por insuficiencia (0,3 %), necrosis avascular (0,6–20,4 %) y destrucción rápida de la cadera (3–7 %). En el manguito rotador operado, una infiltración previa fue el factor de riesgo más constante de volver a operar (Grusky 2026).',
          'Una infiltración en los 3 meses previos a una prótesis de rodilla, cadera u hombro aumenta el riesgo de infección de la prótesis (Grusky 2026).',
        ],
      },
      visceral: {
        texto: [
          'Osteonecrosis: el primer síntoma es un dolor óseo persistente que limita el movimiento y empeora al cargar y con la actividad. Afecta sobre todo a la cabeza femoral, y también a rodilla, hombro, tobillo o mano, a menudo en varias zonas a la vez (Kaneko 2021). El riesgo sube con dosis altas, por encima de 30 mg/día de prednisona o equivalente (Pofi 2023).',
          'Fractura vertebral: es la fractura más característica de la osteoporosis por glucocorticoides (Compston 2018). Hasta un 20 % de los pacientes tiene una fractura por fragilidad en el primer año de tratamiento, sobre todo en la columna, el fémur proximal y las costillas (Pofi 2023).',
          'Miopatía: debilidad proximal (hombros, muslos) de inicio insidioso y sin dolor, con análisis y electromiograma habitualmente normales. En una cohorte apareció tras una mediana de 97 días; se preguntaba por dificultad para subir escaleras, salir de la bañera, levantarse del váter o mantener los brazos por encima de la cabeza (He 2025).',
          'Al bajar la dosis, hasta la mitad de los pacientes tiene un síndrome de retirada con dolor muscular y articular, debilidad, cansancio y alteraciones del sueño y del ánimo, sobre todo por debajo de 15 mg/día de prednisona; también puede reaparecer la enfermedad de base (Beuschlein 2024).',
        ],
        detalle: [
          'Infección: el riesgo sube desde el inicio. Con más de 5 mg/día durante más de 6 meses se duplica el riesgo de infección grave, que baja en los 6 meses siguientes a dejarlos; además atenúan la respuesta de los neutrófilos a los estímulos inflamatorios (Pofi 2023). La artritis séptica tras una infiltración es rara (0,03–0,08 %) (Grusky 2026).',
          'Glucosa: una sola dosis puede subir mucho la glucosa, con o sin diabetes previa, y el mayor efecto suele darse entre la 2.ª y la 4.ª semana (Pofi 2023; Soura 2026). Las infiltraciones intraarticulares e intramusculares también se han asociado a hiperglucemia (Soura 2026).',
          'En el lupus, las lesiones de osteonecrosis se detectaron en los primeros 5 meses de dosis altas, y más de la mitad de los pacientes estaba ya en fase avanzada cuando aparecieron los síntomas (Kaneko 2021).',
        ],
      },
      ejercicio: {
        texto: [
          'Fractura: el riesgo sube a los 3–6 meses de empezar y depende de la dosis (Compston 2018), incluso desde 2,5 mg/día; es mayor en los primeros meses, baja alrededor de un 30 % a los 6 meses de dejarlos y se normaliza a los 12 (Pofi 2023). La fractura aparece con una densidad ósea más alta que sin corticoides (Compston 2018). Las fuentes leídas no dan normas para la terapia manual ni para la carga: tenlo en cuenta al elegir técnicas de alta velocidad o carga axial intensa.',
          'El ejercicio adaptado a cada paciente y la prevención de caídas forman parte del manejo de la osteoporosis por glucocorticoides, aunque con pocas pruebas (Compston 2018). Las caídas pasaron de 1,6 a 2,8 por 100 personas-año al empezar los corticoides orales (He 2025).',
          'Miopatía: el ejercicio puede atenuarla según los estudios que cita una cohorte, en la que los síntomas mejoraron tras una mediana de 107 días; recomienda cribar las caídas en mayores de 50 años (He 2025).',
          'Glucosa: la actividad física forma parte del consejo para mantener el control glucémico (Soura 2026). En un paciente con diabetes, ten presente la subida pasajera de la glucosa tras una infiltración (Grusky 2026; Soura 2026).',
        ],
        detalle: 'Las fuentes leídas no dan un protocolo de reposo ni de carga del tendón tras una infiltración: sigue la indicación de quien la puso.',
      },
      sueno: {
        texto: [
          'La exposición prolongada a dosis altas se asocia a alteraciones del sueño, del ánimo y cognitivas; psicosis, manía, depresión o ansiedad aparecen en un 3–60 % según los estudios (Pofi 2023). Tras una infiltración puede aparecer insomnio, en general pasajero (Grusky 2026), y al bajar la dosis, alteraciones del sueño dentro del síndrome de retirada (Beuschlein 2024).',
        ],
        detalle: 'Tomar más dosis por la tarde que por la mañana se asocia a más efectos adversos (Pofi 2023); las fuentes leídas no estudian su efecto concreto sobre el sueño.',
      },
      consultar: {
        texto: [
          'Urgente: con corticoides actuales o recientes, por cualquier vía (también infiltraciones, inhalados o tópicos), hipotensión, colapso o síntomas abdominales agudos pueden ser una crisis suprarrenal, que puede ocurrir si se saltan dosis o con una gastroenteritis (Beuschlein 2024).',
          'Tras infiltraciones, sobre todo en los 2 meses siguientes o con varias en poco tiempo, hay que estar atento a síntomas de insuficiencia suprarrenal (Beuschlein 2024).',
          'Pronto: dolor óseo persistente que empeora al cargar, sobre todo en la cadera o la rodilla (Kaneko 2021); debilidad proximal nueva (He 2025); síntomas de hiperglucemia (Soura 2026).',
          'Nunca aconsejes bajar ni dejar los corticoides: tras un uso prolongado se retiran de forma pautada (Beuschlein 2024). Las dudas, al médico que los prescribe.',
        ],
      },
    },
    fuentes: ['Pofi 2023', 'Compston 2018', 'Kaneko 2021', 'Grusky 2026', 'He 2025', 'Beuschlein 2024', 'Soura 2026'],
  },
  // Anticoagulantes y antiagregantes (2026-10): ocho fuentes leídas enteras en
  // PMC, más Steffel 2021 (guía EHRA) y Antunes 2024 (StatPearls), PDF del
  // usuario. Ampliada con las fuentes de la condición especial «Paciente
  // anticoagulado o antiagregado» (docs/anticoagulado.md): hemartros, síndrome
  // compartimental, psoas, vaina de los rectos, golpe en la cabeza, técnicas
  // manuales, deporte, caídas y TVP. Sigue sin fuente leída el sueño:
  // docs/farmacologia.md.
  {
    id: 'antitromboticos',
    nombre: 'Anticoagulantes y antiagregantes',
    ejemplos: 'Acenocumarol, warfarina, apixabán, rivaroxabán, edoxabán, dabigatrán, heparinas; ácido acetilsalicílico, clopidogrel, prasugrel, ticagrelor',
    apartados: {
      dolor: {
        texto: [
          'Hematomas musculares espontáneos: aparecen en un 0,5–1,5 % de quienes toman anticoagulantes orales, sobre todo antivitamina K, con dolor muscular brusco, hinchazón y equimosis. Los sitios más frecuentes son el psoas, la vaina de los rectos y los músculos del muslo (vasto intermedio, aductores, sartorio) (Mameli 2025).',
          'Los favorecen la edad, un INR por encima de 3, tomar a la vez un antiagregante, la insuficiencia renal, una cirugía o un traumatismo recientes y el cáncer activo, y pueden bastar esfuerzos mínimos como una contracción muscular. Los benignos suelen resolverse en 2–6 semanas (Mameli 2025).',
          'Las fuentes leídas no dan datos sobre los tiempos de curación de los tejidos con estos fármacos.',
        ],
        detalle: 'Con warfarina, la actividad física regular se asoció a necesitar más dosis y a menos hemorragias (Muñoz 2022).',
      },
      visceral: {
        texto: [
          'Hematoma epidural espinal: raro pero urgente. Se presenta con dolor de cuello o espalda y déficit neurológico (debilidad de un lado o de ambos, alteración de la sensibilidad, de la vejiga o del intestino); dos de cada tres fueron cervicales o cervicotorácicos, y con debilidad de un lado puede parecer un ictus (Ghosh 2026).',
          'Los hematomas retroperitoneales y del iliopsoas tienen peor pronóstico. Una masa nueva no debe atribuirse sin más al anticoagulante: si no se resuelve en 2–3 semanas, mide más de 5 cm, es profunda o el dolor persiste o empeora, hay que estudiarla, porque puede haber un tumor debajo (Mameli 2025).',
          'Hematoma del psoas o retroperitoneal: da un cuadro variado (dolor abdominal, de cadera, de costado o lumbar, caída de la tensión y afectación del plexo lumbar) y por eso se diagnostica tarde (Lukies 2023); el muslo débil o adormecido por afectación del nervio femoral puede ser lo que lo delate, y solo un tercio de los sangrados abdominales tiene los síntomas clásicos (Sahu 2020).',
          'Hematoma de la vaina de los rectos: dolor brusco en la pared del abdomen con un bulto doloroso; lo favorecen la anticoagulación, la tos, la hipertensión, la edad y una cirugía abdominal previa (Liao 2021), y un caso con apixabán empezó tras una tos intensa (Hideyama 2023).',
          'Síndrome compartimental: un sangrado dentro de un compartimento cerrado da dolor desproporcionado, el compartimento tenso y dolor al estiramiento pasivo (Brooker 2020); el dolor al estiramiento pasivo es el signo precoz más sensible, y la parálisis, la palidez y la falta de pulso llegan tarde (Nemunaitis 2022).',
          'Sangrado digestivo alto: vómito con sangre roja o en «posos de café», heces negras y pegajosas (melena) o sangre roja por el ano si es rápido, y síntomas de la pérdida de sangre como mareo al levantarse, síncope, cansancio o debilidad. Un abdomen doloroso a la palpación con defensa o rebote sugiere perforación. El hierro, el bismuto y el regaliz también ponen las heces negras (Antunes 2024).',
          'Digestivo: el tubo digestivo es el lugar más frecuente de sangrado grave con anticoagulantes orales, alrededor del 40 %; la aspirina y otros AINE lesionan directamente la mucosa, los anticoagulantes no (Kurlander 2022). Los antidepresivos ISRS o IRSN aumentan el riesgo de sangrado grave y digestivo en quien toma anticoagulantes o antiagregantes (OR 1,3–1,5, certeza baja) (Nochaiwong 2022).',
        ],
        detalle: [
          'Con anticoagulantes, el síndrome compartimental ha aparecido tras un traumatismo de baja energía (Brooker 2020) y sin traumatismo (Nemunaitis 2022). El psoas sangró por la anticoagulación en 56 de 77 casos de una serie de UCI, con casos graves: el 44 % llegó en shock (Llitjos 2016).',
          'Hemartros: aparece en un 0–1,5 % de quienes toman anticoagulantes orales; no hay consenso sobre cómo manejarlo, y se aspira si el diagnóstico no está claro, para descartar una infección o una artritis por cristales (Dalrymple 2022).',
          'Con heparina en inyección, los moratones en el punto de inyección son frecuentes (Amaniyan 2020); un dolor brusco con bulto en la pared del abdomen no lo es (Liao 2021).',
          'Con ISRS o IRSN, el riesgo de sangrado grave fue algo mayor con los anticoagulantes directos (OR 1,72) que con los antivitamina K (OR 1,28). Los autores piden vigilar más a quien ya sangró o tiene úlcera, enfermedad hepática o renal o toma además AINE (Nochaiwong 2022).',
          'Tomar a la vez otro anticoagulante, antiagregantes (aspirina, clopidogrel, prasugrel, ticagrelor) o AINE aumenta el riesgo de sangrado con los anticoagulantes directos; los corticoides sistémicos figuran entre los factores que también lo aumentan (Steffel 2021). La aspirina con clopidogrel u otro antiagregante parecido multiplica por 2–3 la hemorragia digestiva alta, y en mayores de 75 años con antiagregantes y anticoagulantes llega hasta un 17 % al año (Antunes 2024).',
        ],
      },
      ejercicio: {
        texto: [
          'Punción seca: tomar antitrombóticos no es una contraindicación absoluta, no hay pruebas para aplazarla de forma sistemática y la medicación no debe suspenderse antes. Empieza por músculos superficiales observando cómo sangra, evita al principio los profundos que no se pueden comprimir y comprime unos 10–15 s en vez de unos 5 (Muñoz 2022).',
          'Acupuntura: complicaciones en un 0,003 % con una localización y una profundidad adecuadas; los sangrados graves se debieron a una punción demasiado profunda, y las agujas más gruesas sangran más (Muñoz 2022).',
          'Caídas: caerse no es una contraindicación para anticoagular, pero hay que reducir el riesgo de caídas y revisar los factores de sangrado modificables, sobre todo tomar a la vez antiagregantes; la guía aconseja ofrecer a todos estos pacientes una valoración y un programa de prevención de caídas (Steffel 2021).',
          'Golpes en la cabeza: tras un traumatismo craneal leve, los antiagregantes se asociaron a hemorragia intracraneal (OR 1,54). Los anticoagulantes no fueron significativos en ese metaanálisis; una posible explicación es que a estos pacientes se les hace siempre un TAC, y las guías piden cautela con todos los fármacos que afectan a la coagulación (Yang 2024). NICE pide derivar a urgencias a quien se golpea la cabeza y toma un anticoagulante o un antiagregante, salvo la aspirina sola, aunque no tenga otros síntomas (NICE NG232, 1.2.4); el sangrado tardío es raro, pero puede aparecer días después (Chenoweth 2018).',
          'Terapia manual: la única tabla específica de la columna torácica pone el thrust como contraindicación absoluta con tratamiento anticoagulante (Puentedura 2015), y otra, de la terapia manual cervical, como precaución (Hutting 2018); las dos son opinión de expertos y ninguna distingue fármacos ni da un INR. Un estudio de cohorte asoció la anticoagulación crónica a más lesión cerebral o medular tras la manipulación, sin probar la causa (Whedon 2015). Del masaje, la presión profunda y los estiramientos no hay normas: solo casos de sangrado tras un masajeador, un percutor o una sesión de estiramientos (Tominaga 2023; Kwon 2024; Kim 2026).',
          'Deporte de competición: con aspirina sola, sin límite; con doble antiagregación o anticoagulación plena, en los deportes de colisión o de impacto a alta velocidad los riesgos no compensan o se decide con el médico (Kim 2025). Fuera de la competición, las revisiones coinciden: actividades con poco riesgo de golpe, sí, y deportes de colisión, a decidir con el médico (Minardi 2024; Bavishi 2026).',
          'Embolia pulmonar: el ejercicio con el paciente anticoagulado es seguro, factible y mejora la capacidad de ejercicio y la calidad de vida, aunque faltan ensayos grandes (Xiang 2025). Tras una TVP, caminar pronto no aumentó la embolia en los estudios, con reservas sobre su calidad (Liu 2015).',
        ],
        detalle: [
          'Riesgo alto de caídas: caídas previas, debilidad de las piernas, mal equilibrio, deterioro cognitivo, hipotensión ortostática, psicofármacos, artritis grave o mareo; la guía propone también una puntuación con pruebas como la bipedestación en tándem, el paso alternante o levantarse de la silla (tabla 14) (Steffel 2021).',
          'La guía EHRA clasifica la inyección intramuscular, como una vacuna, entre las intervenciones de riesgo mínimo, con aguja fina y compresión firme 2–5 min; los cambios de la toma del anticoagulante los decide quien lo prescribe (Steffel 2021). No trata la punción seca.',
          'El riesgo de caídas no es por sí solo motivo para no anticoagular, porque las caídas rara vez causan un sangrado mayor (NICE NG196, 1.6.8); el riesgo absoluto de hemorragia intracraneal por una caída es bajo frente al de ictus, y lo indicado es entrenar fuerza, equilibrio y marcha y revisar la medicación con su médico (Mitchell 2023).',
          'Un consenso de expertos sobre instrumentos de tejidos blandos trata la anticoagulación como precaución (Cheatham 2025). En uno de los casos de sangrado, grave, se usó un percutor sobre el punto de inyección de la heparina (Kwon 2024).',
          'Kim 2025 da su regla solo para deportistas de competición y no dice qué anticoagulantes cuentan como plenos.',
        ],
      },
      sueno: {
        texto: 'Las fuentes leídas no describen efectos de los anticoagulantes ni de los antiagregantes sobre el sueño. En la embolia pulmonar, el ejercicio se asoció a mejor calidad del sueño (Xiang 2025).',
      },
      consultar: {
        texto: [
          'Urgente: dolor de cuello o espalda con debilidad, alteración de la sensibilidad o de la vejiga o el intestino (Ghosh 2026). Sangrado digestivo visible (vómito con sangre, melena), por urgencias (Antunes 2024). Golpe en la cabeza con anticoagulante o con un antiagregante que no sea la aspirina sola, a urgencias aunque se encuentre bien (NICE NG232, 1.2.4); se han descrito hemorragias intracraneales tardías tras caídas con anticoagulantes directos (Steffel 2021). Dolor fuerte de ingle, cadera o costado con el muslo débil o mareo (Lukies 2023), o una extremidad tensa con dolor desproporcionado (Brooker 2020).',
          'Pronto: hinchazón, dolor o un hematoma que no se resuelve, o una masa que sigue a las 2–3 semanas (Mameli 2025), o una articulación hinchada tras un golpe pequeño o sin golpe (Dalrymple 2022).',
          'Los sangrados menores (encías, nariz, pequeños hematomas) se comentan con quien lo prescribe; la guía pide no saltarse ninguna dosis sin consultarlo antes (Steffel 2021).',
          'Nunca aconsejes dejar ni saltarse el anticoagulante: no tomarlo bien se asocia a más ictus y muerte, más aún con los anticoagulantes directos por su vida media corta (Salmasi 2020), y tampoco hay que suspenderlo antes de la punción seca (Muñoz 2022). Las dudas, al médico que lo prescribe.',
          'Si el paciente toma alguno, marca la tarjeta «Paciente anticoagulado o antiagregado» en la fase 1: añade las preguntas de sangrado de la fase 2, una línea de técnica en la 4b, un recuadro en la fase 5 y los avisos y la red de seguridad del plan.',
        ],
      },
    },
    fuentes: ['Mameli 2025', 'Ghosh 2026', 'Antunes 2024', 'Kurlander 2022', 'Nochaiwong 2022', 'Muñoz 2022', 'Steffel 2021', 'Yang 2024', 'Xiang 2025', 'Salmasi 2020',
      'Lukies 2023', 'Sahu 2020', 'Llitjos 2016', 'Liao 2021', 'Hideyama 2023', 'Amaniyan 2020', 'Brooker 2020', 'Nemunaitis 2022', 'Dalrymple 2022',
      'NICE NG232', 'Chenoweth 2018', 'Puentedura 2015', 'Hutting 2018', 'Whedon 2015', 'Tominaga 2023', 'Kwon 2024', 'Kim 2026', 'Cheatham 2025',
      'Kim 2025', 'Minardi 2024', 'Bavishi 2026', 'Liu 2015', 'NICE NG196', 'Mitchell 2023'],
  },
  // Opioides (2026-10): seis fuentes en PMC, dos leídas en parte (Dowell 2022,
  // Sampaio-Cunha y Martins 2022; ver el registro). Sin fuente leída para los
  // signos clásicos de sobredosis (pupilas puntiformes, respiración lenta), los
  // efectos propios del tramadol (hiponatremia, hipoglucemia, convulsiones), la
  // retención urinaria, la curación de tejidos ni la terapia manual:
  // docs/farmacologia.md.
  {
    id: 'opioides',
    nombre: 'Opioides',
    ejemplos: 'Tramadol, tapentadol, codeína, morfina, oxicodona, fentanilo, buprenorfina',
    apartados: {
      dolor: {
        texto: [
          'En el dolor subagudo y crónico, frente a placebo, mejoran poco el dolor a corto plazo (0,79 puntos sobre 10), y la mejoría baja con el tiempo, de 1 punto a los 1–3 meses a unos 0,5 a los 3–6 meses; no hay ensayos con placebo más allá de 6 meses. Dos sociedades médicas estadounidenses desaconsejan los opioides, también el tramadol, para el dolor agudo por lesiones musculoesqueléticas (Dowell 2022).',
          'El ejercicio terapéutico reduce el dolor y mejora la función en la lumbalgia, la fibromialgia y la artrosis de cadera o rodilla, con beneficios que se mantienen 2–6 meses, y puede sumarse a la medicación (Dowell 2022).',
          'Hiperalgesia inducida por opioides: más sensibilidad al dolor por la propia exposición. Se distingue de la tolerancia porque el dolor mejora al bajar la dosis y empeora al subirla, y si no se piensa en ella se siguen subiendo dosis (Sampaio-Cunha y Martins 2022).',
        ],
        detalle: [
          'Parecen mejorar más la satisfacción con la atención que la intensidad del dolor, lo que la revisión relaciona con un efecto de enmascarar el dolor (Sampaio-Cunha y Martins 2022). Las fuentes leídas no dicen cuándo conviene valorar respecto a la toma.',
          'Frente a no tomarlos, se asocian a más trastorno por uso de opioides, sobredosis, muerte, fracturas, caídas e infarto (Dowell 2022).',
          'Las fuentes leídas no tratan su efecto sobre la curación de los tejidos.',
        ],
      },
      visceral: {
        texto: [
          'Estreñimiento, náuseas y dolor abdominal: frenan el tubo digestivo y producen náuseas, vómitos, dificultad para evacuar y dolor abdominal con espasmos o cólicos. El estreñimiento puede aparecer con dosis bajas y en cualquier momento, y no se reduce con el tiempo; en el dolor crónico no oncológico lo tiene un 41 %, náuseas un 32 % y somnolencia un 29 % (Camilleri 2017).',
          'Síndrome del intestino narcótico: dolor abdominal diario durante más de 3 meses con más de 100 mg/día de morfina o equivalente, que no mejora o empeora al subir la dosis. Ante síntomas digestivos hay que pensar siempre si pueden deberse al opioide (Camilleri 2017). En mayores, el estreñimiento puede llegar a impactación fecal y perforación (Dufort y Samaan 2021).',
          'Hormonas: hipogonadismo en un 63 % (casi todos varones) e insuficiencia suprarrenal en un 15 %, con cansancio, malestar, molestias abdominales, falta de apetito o hipotensión ortostática; revierten al reducir o retirar el opioide (De Vries 2020).',
          'Al dejarlos o bajar la dosis, el síndrome de abstinencia da dolor muscular, náuseas, diarrea, sudor, insomnio y ansiedad; con los de acción corta empieza a las 8–12 h y cede en 3–5 días (Dufort y Samaan 2021). El dolor también puede empeorar durante la retirada (Dowell 2022).',
        ],
        detalle: [
          'Síndrome serotoninérgico: el tramadol inhibe la recaptación de serotonina y noradrenalina, y el tramadol y el fentanilo son los opioides que más aparecen en los casos publicados. Da alteración mental, agitación, mioclonías, hiperreflexia, sudor, escalofríos, temblor, diarrea, falta de coordinación o fiebre, y puede ser mortal (Blyzniuk 2026).',
          'Hueso: en un estudio, la mitad de los varones que tomaban morfina tenía osteopenia y un 21 % osteoporosis (De Vries 2020).',
        ],
      },
      ejercicio: {
        texto: [
          'Mareo, somnolencia y caídas: frente a placebo dan más mareo y somnolencia (Dowell 2022). En mayores producen sedación, falta de coordinación, mareo y caídas, con más fracturas de cadera y no vertebrales (Dufort y Samaan 2021). La guía de los CDC pide en mayores de 65 vigilar el deterioro cognitivo, valorar el riesgo de caídas y usar el ejercicio para prevenir el estreñimiento (Dowell 2022).',
          'Subir la dosis deprisa aumenta la sedación y la depresión respiratoria. En trabajos de riesgo (conducir, maquinaria pesada, alturas), la guía pide valorar si el paciente puede hacerlos (Dowell 2022).',
          'Mantener o aumentar la actividad física, junto con el agua y la fibra, ayuda a prevenir el estreñimiento; durante una retirada pautada, la guía pide aprovechar al máximo los tratamientos del dolor sin fármacos (Dowell 2022).',
        ],
        detalle: 'Las fuentes leídas no dan normas de terapia manual en estos pacientes ni sobre el ejercicio en las horas siguientes a la toma.',
      },
      sueno: {
        texto: [
          'Pueden empeorar el sueño, y dormir mal baja el umbral del dolor y lleva a subir la dosis; en el dolor crónico también pueden mejorarlo al reducir el dolor (Langstengel y Yaggi 2022).',
          'Causan depresión respiratoria y apnea del sueño central según la dosis, y la mayoría de las muertes por opioides ocurren durante el sueño (Langstengel y Yaggi 2022). La apnea del sueño aumenta el riesgo de depresión respiratoria grave o sobredosis (Dowell 2022).',
        ],
        detalle: 'Tras una retirada pautada, algunos pacientes refieren insomnio, ansiedad, depresión y más dolor, sobre todo al principio (Dowell 2022).',
      },
      consultar: {
        texto: [
          'Urgente: confusión, sedación o habla arrastrada pueden anunciar una sobredosis, y la naloxona revierte la depresión respiratoria grave (Dowell 2022). Signos de síndrome serotoninérgico en quien toma tramadol con un antidepresivo (Blyzniuk 2026).',
          'Combinaciones que hay que comentar con quien prescribe: benzodiacepinas (casi cuadruplican el riesgo de muerte por sobredosis), gabapentina o pregabalina, relajantes musculares, otros sedantes y alcohol (Dowell 2022).',
          'Pronto: dolor abdominal nuevo o que empeora (Camilleri 2017); síntomas de abstinencia; dolor que aumenta pese a subir la dosis (Sampaio-Cunha y Martins 2022); cansancio, hipotensión al levantarse o problemas sexuales en tratamientos largos (De Vries 2020).',
          'Nunca aconsejes dejarlos ni bajarlos por tu cuenta: no deben retirarse de golpe, y una retirada rápida puede causar abstinencia, más dolor, malestar psicológico grave e ideas de suicidio; la retirada se planifica con quien los prescribe (Dowell 2022).',
        ],
      },
    },
    fuentes: ['Dowell 2022', 'Sampaio-Cunha y Martins 2022', 'Camilleri 2017', 'Dufort y Samaan 2021', 'De Vries 2020', 'Blyzniuk 2026', 'Langstengel y Yaggi 2022'],
  },
  { id: 'gabapentinoides', nombre: 'Gabapentinoides', ejemplos: 'Gabapentina, pregabalina' },
  { id: 'antidepresivos', nombre: 'Antidepresivos (ISRS, IRSN, tricíclicos)', ejemplos: 'Sertralina, escitalopram, duloxetina, venlafaxina, amitriptilina' },
  { id: 'sedantes', nombre: 'Benzodiacepinas y relajantes musculares', ejemplos: 'Diazepam, lorazepam, alprazolam, ciclobenzaprina, metocarbamol' },
  { id: 'estatinas', nombre: 'Estatinas', ejemplos: 'Atorvastatina, simvastatina, rosuvastatina' },
  { id: 'fluoroquinolonas', nombre: 'Fluoroquinolonas', ejemplos: 'Ciprofloxacino, levofloxacino, moxifloxacino' },
  { id: 'betabloqueantes', nombre: 'Betabloqueantes', ejemplos: 'Bisoprolol, atenolol, metoprolol, propranolol' },
  { id: 'antihipertensivos', nombre: 'Diuréticos y otros antihipertensivos', ejemplos: 'Hidroclorotiazida, furosemida, enalapril, losartán, amlodipino' },
  { id: 'antidiabeticos', nombre: 'Insulina y antidiabéticos', ejemplos: 'Insulina, metformina, sulfonilureas, inhibidores de SGLT2' },
  { id: 'hueso', nombre: 'Fármacos que tocan el hueso', ejemplos: 'Alendronato, zoledronato, denosumab, inhibidores de la aromatasa' },
];

export const TEXTOS_FARMACOS = {
  intro: 'Qué vigilar en la valoración y el tratamiento cuando el paciente toma estos fármacos: cómo cambian el dolor y la inflamación, qué síntomas pueden confundirse con dolor musculoesquelético, qué precauciones pide el ejercicio y cómo afectan al sueño.',
  limites: 'No es una guía para cambiar la medicación: cualquier duda sobre dosis, suspensión o interacciones entre fármacos se consulta con el médico o el farmacéutico.',
  pendientesTitulo: 'Pendientes de fuentes revisadas',
  pendientesNota: 'Mientras tanto puedes preguntar a la IA con un guion para fisioterapeutas (sin datos del paciente; PhysiQ no revisa la respuesta).',
  preguntar: 'Preguntar a la IA sobre fármacos →',
  pie: 'Cada familia se escribe con fuentes leídas y revisadas antes de publicarse. Toca una cita para ver la referencia.',
};
