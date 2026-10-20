# Fase 6 · Frases para revisar

> Generado por `node tests/gen-frases-plan.mjs` a partir de `data/plan-tratamiento.js` y `lib/plan-tratamiento.js`. No lo edites a mano: cambia el texto en `data/plan-tratamiento.js` y regenera (`tests/unit.js` falla si no está al día).

Cómo revisarlo: marca cada casilla que valga tal cual y anota debajo las que haya que cambiar. «Redacción propia» = la frase no sale de ninguna fuente leída; son las que más necesitan tu revisión. Las cifras y páginas citadas están comprobadas contra las fuentes leídas (notas en `docs/plan-tratamiento.md`, «Fuentes leídas», en el razonamiento de la pregunta `l6` para Finucane 2020, en el de `cv3` para Margetis y Donnally 2025 y en el de `cv_ar1` y `cv_ar2` para Rushton 2023, en el de `h_c4` para Goodman 2018, y en el de `co1` para Momodu y Savaliya 2023 y Pangia 2025).

Redacción propia: **35** frases.

## 1. Programa para casa (lo lee el paciente)

Va tal cual en «📤 Compartir → Programa para casa». «Qué hacer» y «Cuándo parar» los escribe el fisio (si «Cuándo parar» queda vacío, se usa la variable de control de la fase 5); lo que falte no sale, y compartir pide confirmación antes. «Cuándo hacerlo» y «Al día siguiente» usan las notas de la fase 5 si están rellenas. Las últimas frases (urgencias) son la red de seguridad de la región (sección 2): la neurológica solo con una hipótesis neurológica, la de siempre con cualquier plan de esa región. Con el plan bloqueado por una urgencia o una derivación no hay programa para casa.

- [ ] «PROGRAMA PARA CASA»  
  ↳ etiqueta  
  ↳ clave `titulo`
- [ ] «Si tienes fiebre o escalofríos, o te encuentras mal de una forma nueva, ve hoy mismo al médico: con tu tratamiento, una infección puede dar poca fiebre.»  
  ↳ fuente: Rao y Mikdashi 2023, «Proposed Steps» (la fiebre en el lupus es infecciosa mientras no se demuestre lo contrario); Yasir 2023, «Adverse Effects» (los corticoides pueden quitar la fiebre)  
  ↳ clave `alarmaFiebreLupus`
- [ ] «Si te salen ronchas, se te hincha la boca, te falta el aire, te mareas o te desmayas, para, ponte el autoinyector y llama al 112. Túmbate (siéntate si te cuesta respirar) y no te levantes de golpe aunque te encuentres mejor.»  
  ↳ fuente: RCUK 2021, apartados 4.4 y 5.1.1; NICE NG258, recomendación 1.1.14 (docs/mastocitaria.md)  
  ↳ clave `alarmaAnafilaxia`
- [ ] «Si de golpe notas debilidad o adormecimiento de un lado del cuerpo, dificultad para hablar o pérdida de visión, llama al 112, aunque se te pase.»  
  ↳ fuente: Goodman 2018, cap. 12, p. 445 (enfermedad cerebrovascular, frecuente en el lupus); Drosos 2022, p. 773; Rout 2024 (síndrome antifosfolípido), «Deterrence and Patient Education» (enseñar los síntomas del AIT)  
  ↳ clave `alarmaIctusLupus`
- [ ] «Si te empieza de golpe un dolor de espalda fuerte tras un esfuerzo pequeño, para y que te vea el médico; si además notas debilidad u hormigueo en las piernas, o cambios al orinar, ve a urgencias.»  
  ↳ fuente: Gregson 2025 (pensar en una fractura vertebral ante un dolor de espalda agudo; derivación urgente con déficit neurológico); Finucane 2020, sección 3 (docs/osteoporosis.md)  
  ↳ clave `alarmaFracturaVertebral`
- [ ] «Al agacharte o levantar algo, dobla las caderas y las rodillas con la espalda recta. Para girarte, da pasos en vez de torcer el tronco. Guarda lo que uses a la altura de la cintura, no en el suelo. Con lluvia o hielo, haz el ejercicio dentro de casa.»  
  ↳ fuente: Brooke-Wavell 2022, recuadro 3; Giangregorio 2015; Giangregorio 2014 (docs/osteoporosis.md)  
  ↳ clave `moverseOsteoporosis`
- [ ] «Si tienes un dolor de cabeza fuerte, ves borroso, te duele mucho bajo las costillas o se te hinchan de golpe la cara o las manos, que te vea hoy tu matrona o tu médico. Si notas que el bebé se mueve menos, llama a tu maternidad a cualquier hora. Si sangras, pierdes líquido por la vagina o tienes contracciones regulares y dolorosas, para y llama a tu maternidad.»  
  ↳ fuente: NICE NG133, 1.1.1 (síntomas de preeclampsia); NICE NG201, 1.2.34 (movimientos fetales); Mottola 2018, recuadro 2 (motivos para parar y consultar) (docs/embarazo-posparto.md)  
  ↳ clave `alarmaEmbarazo`
- [ ] «Si sangras de golpe o mucho, tienes fiebre o escalofríos, un flujo que huele mal, una pierna hinchada y dolorosa, te falta el aire, te duele el pecho o tienes un dolor de cabeza fuerte, pide que te vea un médico hoy.»  
  ↳ fuente: NICE NG194, 1.2.4 (síntomas que piden consulta médica sin demora tras el parto) (docs/embarazo-posparto.md)  
  ↳ clave `alarmaPosparto`
- [ ] «Si te das un golpe en la cabeza, aunque te encuentres bien, ve hoy a urgencias; si en los días siguientes tienes un dolor de cabeza fuerte que va a más, vómitos, somnolencia o confusión, llama al 112. Si te empieza de golpe un dolor fuerte de cuello o espalda con debilidad, hormigueo o cambios al orinar, ve a urgencias ya. Un dolor muy fuerte en la ingle, la cadera o la barriga con mareo, o un brazo o una pierna muy hinchados, tensos y con un dolor desproporcionado, también. No dejes ni te saltes tu anticoagulante sin hablarlo antes con tu médico.»  
  ↳ fuente: Redacción propia sobre NICE NG232, 1.2.4 y 1.10.9 (golpe en la cabeza); Peng 2022 (hematoma epidural espinal); Lukies 2023 (hematoma del psoas); Brooker 2020 (síndrome compartimental); Steffel 2021 (no saltarse dosis) (docs/anticoagulado.md)  
  ↳ clave `alarmaAnticoagulado`
- [ ] «Si te desmayas mientras haces ejercicio, para y no vuelvas a hacer ejercicio hasta que te vea el médico.»  
  ↳ fuente: NICE CG109, recomendaciones 1.3.2.2 y 1.5.4.3: con un síncope durante el ejercicio, no hacer ejercicio hasta la valoración; Brignole 2018, p. 1911 (docs/pots.md)  
  ↳ clave `alarmaSincope`
- [ ] «Qué hacer:»  
  ↳ etiqueta  
  ↳ clave `queHacer`
- [ ] «Cuándo hacerlo:»  
  ↳ etiqueta  
  ↳ clave `cuandoHacerlo`
- [ ] «Cuándo parar:»  
  ↳ etiqueta  
  ↳ clave `cuandoParar`
- [ ] «Al día siguiente:»  
  ↳ etiqueta  
  ↳ clave `alDiaSiguiente`
- [ ] «Fíjate en cómo estás a las 24 horas y anótalo para la próxima sesión.»  
  ↳ fuente: Maitland 2005, cap. 9, p. 219 y tabla 9.3 (respuesta a las 24–48 h)  
  ↳ clave `alDiaSiguienteDefecto`
- [ ] «Después de esta primera sesión puedes notar un aumento temporal de las molestias.»  
  ↳ fuente: Maitland 2005, cap. 9, p. 219; Hengeveld y Banks 2005, cap. 9, p. 243  
  ↳ clave `primeraSesion`
- [ ] «Si las molestias aumentan, apunta qué estabas haciendo y qué te ayudó.»  
  ↳ fuente: Hengeveld y Banks 2005, cap. 9, p. 247 (registro escrito por el paciente)  
  ↳ clave `anotarAumento`
- [ ] «Sigue siempre las indicaciones de tu cirujano.»  
  ↳ fuente: decisión posquirúrgica: el protocolo del cirujano manda (docs/posquirurgico.md; principio 3 de docs/plan-tratamiento.md)  
  ↳ clave `cirujano`
- [ ] «Si empeoras claramente o notas algo nuevo, coméntalo con tu fisioterapeuta antes de la próxima sesión.»  
  ↳ **redacción propia**  
  ↳ clave `empeora`
- [ ] «Si notas adormecimiento entre las piernas o alrededor del ano, o cambios al orinar o al hacer de vientre, ve a urgencias hoy mismo.»  
  ↳ fuente: Finucane 2020, sección 2 (síndrome de cola de caballo), pp. 9–17: explicar al paciente qué vigilar y qué hacer (red de seguridad)  
  ↳ clave `alarmaNeuro`
- [ ] «Si notas torpeza nueva en las manos (al abrocharte o al escribir), inestabilidad o las piernas pesadas al caminar, o cambios al orinar o al hacer de vientre, ve a urgencias hoy mismo.»  
  ↳ fuente: Margetis y Donnally 2025 (StatPearls, «Cervical Myelopathy»: anamnesis y exploración), como en el razonamiento de cv3: con signos nuevos o que van a más, la derivación es urgente  
  ↳ clave `alarmaMedula`
- [ ] «Si notas dolor u opresión en el pecho, el hombro, el brazo, el cuello, la mandíbula o la espalda que no se pasa al parar en unos 20 minutos, o que te viene con sudor frío, náuseas, vómitos o falta de aire, llama al 112.»  
  ↳ fuente: Goodman 2018, cap. 6, pp. 236 y 260, como en el razonamiento de h_c4: un infarto puede doler solo en el hombro o el brazo; intervención médica inmediata si el dolor no cede en 20 minutos o viene con náuseas, vómitos o sudor  
  ↳ clave `alarmaCardiaca`
- [ ] «Si el codo se te pone rojo, caliente e hinchado, aunque no tengas fiebre, ve hoy mismo al médico o a urgencias.»  
  ↳ fuente: Momodu y Savaliya 2023 (StatPearls, «Septic Arthritis») y Pangia 2025 (StatPearls, «Olecranon Bursitis»), como en el razonamiento de co1: la artritis séptica es una emergencia y la fiebre solo aparece en el 40–60 %; en la bursitis séptica del olécranon, enrojecimiento en el 83 %, calor en el 84 % y fiebre en el 38 %  
  ↳ clave `alarmaInfeccion`
- [ ] «Si la rodilla, o la zona de delante de la rótula, se te pone roja, caliente e hinchada, aunque no tengas fiebre, ve hoy mismo al médico o a urgencias.»  
  ↳ fuente: Momodu y Savaliya 2023 (StatPearls, «Septic Arthritis») y Truong 2023 (StatPearls, «Septic Bursitis»), como en el razonamiento de r1 y r_i3: la rodilla es la articulación más afectada en el adulto, la artritis séptica es una urgencia y la fiebre solo aparece en el 40–60 %; en la bursitis séptica la fiebre puede faltar  
  ↳ clave `alarmaInfeccionRodilla`
- [ ] «Si se te hincha la pantorrilla, o la notas caliente, más roja o dolorida que la otra, ve hoy mismo al médico o a urgencias. Si además te falta el aire de repente o te duele el pecho al respirar, llama al 112.»  
  ↳ fuente: Waheed 2023 (StatPearls, «Deep Venous Thrombosis») y NICE NG158, como en el razonamiento de r_v2: valoración médica en el día; Vyas 2024 (StatPearls, «Acute Pulmonary Embolism»), como en el de pq_tep: con falta de aire o dolor al respirar, 112; NICE NG89 pide explicar al paciente estos síntomas al alta tras una prótesis de rodilla o de cadera (profilaxis de 14 días tras la de rodilla, 28 tras la de cadera y un mes tras una fractura de cadera, como en el razonamiento de pq_tvp)  
  ↳ clave `alarmaTVP`
- [ ] «Si el dolor de la ingle o de la cadera va a más al apoyar el peso o con la actividad, y empieza a dolerte también de noche, deja la actividad que lo empeora (correr, saltar) y ve hoy mismo al médico.»  
  ↳ fuente: Lluch 2020, Goodman 2018 y May y Marappa-Ganeshan 2023, como en el razonamiento de ca_os1 y el recuadro de urgencia de cadera: la fractura de estrés del cuello femoral es de alto riesgo y, si se sigue cargando, puede completarse y desplazarse; dolor que empeora con la carga y aparece de noche; derivación urgente, y una radiografía negativa no la descarta  
  ↳ clave `alarmaFracturaEstres`
- [ ] «Si la cadera te empieza a doler mucho, hasta el punto de no poder apoyar la pierna, y tienes fiebre o te encuentras mal en general, ve hoy mismo a urgencias. Si tienes una prótesis y aparece un dolor nuevo que no se calma en reposo y sigue de noche, sobre todo después de una infección, ve al médico.»  
  ↳ fuente: Momodu y Savaliya 2023 (StatPearls, «Septic Arthritis») y Goodman 2018, como en el razonamiento de ca_in1 (artritis séptica: urgencias hoy; la fiebre solo aparece en el 40–60 %) y de ca_in3 (prótesis con una infección reciente y dolor nuevo, o dolor que no cede en reposo y sigue de noche: derivación médica)  
  ↳ clave `alarmaInfeccionCadera`
- [ ] «Si un dolor del pie o del tobillo empieza poco a poco, va a más al apoyar o con la actividad, no mejora al calentar y te molesta también por la noche, deja la actividad que lo empeora (correr, saltar) y ve al médico.»  
  ↳ fuente: May y Marappa-Ganeshan 2023 y Lluch 2020, como en el razonamiento de tp_o1: presentación típica de una fractura de estrés; algunas del pie son de alto riesgo (navicular, base del 5.º metatarsiano); la radiografía tarda 2–3 semanas en mostrarla; derivar para confirmarla con imagen  
  ↳ clave `alarmaFracturaEstresPie`
- [ ] «Si el tobillo o una articulación del pie se te pone hinchada, caliente y muy dolorosa y tienes fiebre o te encuentras mal en general, ve hoy mismo a urgencias. Aunque no tengas fiebre, si se pone así de golpe, ve hoy mismo al médico.»  
  ↳ fuente: Momodu y Savaliya 2023 (StatPearls, «Septic Arthritis») y Goodman 2018, como en el razonamiento de tp_i1 y el recuadro de urgencia de tobillo y pie: artritis infecciosa, urgencia hoy; la fiebre solo aparece en el 40–60 %, y la gota se le parece y solo el líquido articular las separa  
  ↳ clave `alarmaInfeccionTobillo`
- [ ] «Si de repente notas como un golpe o una patada detrás del tobillo o de la pantorrilla, a veces con un chasquido, y desde entonces cojeas o no puedes ponerte de puntillas sobre esa pierna, deja los ejercicios y ve al médico sin esperar a la próxima sesión.»  
  ↳ fuente: Lluch 2020 y Shamrock 2023, como en el razonamiento de tp_t3 (la tendinopatía previa es factor de riesgo; camina sorprendentemente bien, y entre el 20 y el 25 % se toman al principio por un esguince; derivación preferente); Hengeveld y Banks 2005, cap. 16, cuadro 16.5, p. 565 (cuidado con la rotura completa, prueba de Thompson)  
  ↳ clave `alarmaRoturaAquiles`
- [ ] «Si te empieza de golpe un dolor de cabeza o de cuello distinto a cualquiera que hayas tenido, o notas visión doble, dificultad para hablar o tragar, inestabilidad al caminar o caídas sin perder el conocimiento, ve a urgencias hoy mismo.»  
  ↳ fuente: Rushton 2023 (marco IFOMPT cervical), tablas 1–2 y 6, pp. 9–12, como en el razonamiento de cv_ar1 y cv_ar2: disección arterial e insuficiencia vertebrobasilar; los síntomas neurológicos pueden llegar días después  
  ↳ clave `alarmaArterial`

## 2. Reglas de decisión (no son frases, pero deciden qué sale)

- [ ] Gravedad por NRS: 0–3 mínima, 4–7 moderada, 8–10 máxima.  
  ↳ fuente: Petersen 2021, tabla 2
- [ ] Irritabilidad: suma de reposo + movimiento + tolerancia de la matriz (0–2 cada uno), 0–1 baja, 2–4 moderada, 5–6 alta.  
  ↳ **decisión de diseño** (cortes asimétricos hacia lo prudente; revisión clínica 2026-10)
- [ ] Sin NRS: gravedad máxima (prudente), con enlace para registrarlo en la fase 3.  
  ↳ **decisión de diseño**

- [ ] Escalón de la propuesta B (A = B − 1, mínimo 1; C = B + 1 solo con irritabilidad baja y síntomas que no empeoran):

| Irritabilidad | Gravedad máxima | Gravedad moderada | Gravedad mínima |
|---|---|---|---|
| Baja | B 3 (C 4) | B 3 (C 4) | B 3 (C 4) |
| Moderada | B 1 | B 2 | B 2 |
| Alta | B 1 | B 1 | B 1 |

  ↳ Petersen 2021 (combinación gravedad × irritabilidad); concreción en escalones: **decisión de diseño** (revisión clínica 2026-10: alta siempre 1, B nunca 4).

- [ ] Exploración neurológica al empezar cada sesión: `lu3`, `lu4`, `lu5`, `ce3`, `ce12`.  
  ↳ fuente: Maitland 2005, cap. 6, p. 136
- [ ] Regla de los 7–10 días: `lu3`, `lu5`, `ce3`, `ce12`, solo con NRS registrado de 8 o más.  
  ↳ fuente: Maitland 2005, cap. 9, p. 217
- [ ] Atrapamiento de un nervio periférico (sensibilidad y fuerza en su territorio al empezar cada sesión, `TEXTOS_SESION.reevaluacionNervio`; sin red de seguridad neurológica ni regla de días): `co8`, `co9`, `co13`, `ro19`, `ca7`, `ca14`, `tp12`, `tp16`, `tp28`, `tp34`.  
  ↳ **decisión de diseño** (decisión 65)
- [ ] `ce2` no cuenta como neurológica: Disfunción neuromuscular cervical: déficit de control motor (coordinación, propiocepción), no compromiso de la raíz ni de la médula.  
  ↳ **decisión de diseño**
- [ ] `ca6` no cuenta como neurológica: Disfunción de control neuromuscular de cadera: déficit de control motor (activación, coordinación), no compromiso de un nervio ni de la raíz.  
  ↳ **decisión de diseño**
- [ ] Red de seguridad de lumbar: con una hipótesis neurológica, cierre `cierreNeuro` y casa `alarmaNeuro`.  
  ↳ **decisión de diseño** (los textos, con su fuente, en las secciones 1 y 6)
- [ ] Red de seguridad de cervical: con una hipótesis neurológica, cierre `cierreMedula` y casa `alarmaMedula`; con cualquier plan de la región, cierre `cierreArterial` y casa `alarmaArterial`.  
  ↳ **decisión de diseño** (los textos, con su fuente, en las secciones 1 y 6)
- [ ] Red de seguridad de hombro: con cualquier plan de la región, cierre `cierreCardiaco` y casa `alarmaCardiaca`.  
  ↳ **decisión de diseño** (los textos, con su fuente, en las secciones 1 y 6)
- [ ] Red de seguridad de codo: con cualquier plan de la región, cierre `cierreInfeccion` y casa `alarmaInfeccion`.  
  ↳ **decisión de diseño** (los textos, con su fuente, en las secciones 1 y 6)
- [ ] Red de seguridad de rodilla: con cualquier plan de la región, cierre `cierreInfeccionRodilla` y casa `alarmaInfeccionRodilla`; con cualquier plan de la región, cierre `cierreTVP` y casa `alarmaTVP`.  
  ↳ **decisión de diseño** (los textos, con su fuente, en las secciones 1 y 6)
- [ ] Red de seguridad de cadera: con cualquier plan de la región, cierre `cierreFracturaEstres` y casa `alarmaFracturaEstres`; con cualquier plan de la región, cierre `cierreInfeccionCadera` y casa `alarmaInfeccionCadera`; con cualquier plan de la región, cierre `cierreTVP` y casa `alarmaTVP`.  
  ↳ **decisión de diseño** (los textos, con su fuente, en las secciones 1 y 6)
- [ ] Red de seguridad de tobillo_pie: con cualquier plan de la región, cierre `cierreFracturaEstresPie` y casa `alarmaFracturaEstresPie`; con cualquier plan de la región, cierre `cierreInfeccionTobillo` y casa `alarmaInfeccionTobillo`; con cualquier plan de la región, cierre `cierreTVP` y casa `alarmaTVP`.  
  ↳ **decisión de diseño** (los textos, con su fuente, en las secciones 1 y 6)
- [ ] Con `ce13`, la cantidad de terapia manual es la de su pauta: `TEXTOS_SESION.cantidadReid` (sección 6) en vez de la genérica.  
  ↳ **decisión de diseño** (decisión 41)
- [ ] Con `h8` como hipótesis por defecto, el plan del mes empieza en B (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `ce12` como hipótesis por defecto, el plan del mes empieza en B (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `co3` como hipótesis por defecto, el plan del mes empieza en B (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `ro15` como hipótesis por defecto, el plan del mes empieza en A (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `ca1` como hipótesis por defecto, el plan del mes empieza en A (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `ca4` como hipótesis por defecto, el plan del mes empieza en B (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `ca9` como hipótesis por defecto, el plan del mes empieza en A (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `ca11` como hipótesis por defecto, el plan del mes empieza en B (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `ca16` como hipótesis por defecto, el plan del mes empieza en B (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `tp14` como hipótesis por defecto, el plan del mes empieza en A (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `tp21` como hipótesis por defecto, el plan del mes empieza en B (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `tp36` como hipótesis por defecto, el plan del mes empieza en A (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Avisos con `ce13`: `AVISOS.vertigo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ce3`: `AVISOS.manipulacionCervical`, `AVISOS.neuralRadicular` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ce12`: `AVISOS.manipulacionCervical`, `AVISOS.sinTerapiaManualAguda`, `AVISOS.neuralRadicular` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `lu3`: `AVISOS.neuralRadicular` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `lu5`: `AVISOS.neuralRadicular` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `h1`: `AVISOS.capsulitisPrecoz`, `AVISOS.capsulitisEstadios` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `h4`: `AVISOS.inestabilidad` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `h10`: `AVISOS.artrosis` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `co1`: `AVISOS.epicondilalgiaLateral` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `co2`: `AVISOS.epicondilalgiaMedial` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `co3`: `AVISOS.rigidezCodo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `co4`: `AVISOS.inestabilidadCodo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `co5`: `AVISOS.inestabilidadCodo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `co6`: `AVISOS.radiohumeral` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `co8`: `AVISOS.nervioCodo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `co9`: `AVISOS.nervioCodo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `co13`: `AVISOS.nervioCodo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `co15`: `AVISOS.esqueletoInmaduro` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `co16`: `AVISOS.esqueletoInmaduro` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro1`: `AVISOS.artrosisRodilla` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro2`: `AVISOS.menisco` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro3`: `AVISOS.patelofemoral` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro4`: `AVISOS.ligamentoRodilla` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro9`: `AVISOS.ligamentoRodilla` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro8`: `AVISOS.ligamentoRodilla`, `AVISOS.esguinceReciente` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro10`: `AVISOS.ligamentoRodilla`, `AVISOS.esguinceReciente` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro5`: `AVISOS.cargaRodilla` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro6`: `AVISOS.cargaRodilla` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro12`: `AVISOS.rotulaInestable` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro15`: `AVISOS.apofisitis` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro18`: `AVISOS.tibioperonea` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ro19`: `AVISOS.nervioPeroneo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca1`: `AVISOS.artrosisCadera` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca2`: `AVISOS.pinzamientoCadera` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca3`: `AVISOS.pinzamientoCadera` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca4`: `AVISOS.tendinopatiaGlutea` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca7`: `AVISOS.gluteoProfundo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca9`: `AVISOS.cargaCadera` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca11`: `AVISOS.ingleAguda`, `AVISOS.ingleDeportiva` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca12`: `AVISOS.inestabilidadCadera` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca14`: `AVISOS.nervioCadera` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca15`: `AVISOS.sensibilizacionCentral` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca16`: `AVISOS.cargaCadera`, `AVISOS.ingleDeportiva` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca17`: `AVISOS.cargaCadera`, `AVISOS.ingleDeportiva` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca18`: `AVISOS.ingleDeportiva` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ca19`: `AVISOS.ingleDeportiva` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp1`: `AVISOS.esguinceTobillo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp2`: `AVISOS.sindesmosis` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp8`: `AVISOS.aquiles`, `AVISOS.monitorizacionDolor` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp9`: `AVISOS.aquiles`, `AVISOS.aquilesInsercional` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp10`: `AVISOS.aquiles` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp12`: `AVISOS.nervioTobillo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp16`: `AVISOS.nervioTobillo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp28`: `AVISOS.nervioTobillo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp14`: `AVISOS.tibialPosterior` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp21`: `AVISOS.inestabilidadTobillo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp24`: `AVISOS.artrosisTobillo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp26`: `AVISOS.talon` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp33`: `AVISOS.fracturaEstresMetatarsiano` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp34`: `AVISOS.morton` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `tp36`: `AVISOS.apofisitisPie` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Con mecanismo Post-quirúrgico en una región periférica: `AVISOS.protesis` (sección 5).  
  ↳ **decisión de diseño** (decisión 47)
- [ ] Con mecanismo Post-quirúrgico en rodilla, además: `AVISOS.posqRodilla` (sección 5).  
  ↳ **decisión de diseño** (decisión 78)
- [ ] Con mecanismo Post-quirúrgico en cadera, además: `AVISOS.posqCadera` (sección 5).  
  ↳ **decisión de diseño** (decisión 78)
- [ ] Con mecanismo Post-quirúrgico en tobillo_pie, además: `AVISOS.posqTobillo` (sección 5).  
  ↳ **decisión de diseño** (decisión 78)
- [ ] Familia de la terapia manual: columna (Maitland 2005) en lumbar y cervical; periférica (Hengeveld y Banks 2005) en hombro, codo, rodilla, cadera, tobillo_pie. Decide los escalones (sección 3), la cantidad por sesión (sección 6), la progresión y las reglas del mes (sección 7).  
  ↳ **decisión de diseño** (decisiones 43–46)
- [ ] `h6` usa la familia columna aunque su región sea periférica.  
  ↳ **decisión de diseño** (decisión 50)
- [ ] `ca10` usa la familia columna aunque su región sea periférica.  
  ↳ **decisión de diseño** (decisión 50)
- [ ] Con `h6`, además, cierre `cierreArterial` y casa `alarmaArterial`.  
  ↳ **decisión de diseño** (decisión 50)
- [ ] Con `tp8`, además, cierre `cierreRoturaAquiles` y casa `alarmaRoturaAquiles`.  
  ↳ **decisión de diseño** (decisión 50)
- [ ] Con `tp9`, además, cierre `cierreRoturaAquiles` y casa `alarmaRoturaAquiles`.  
  ↳ **decisión de diseño** (decisión 50)

## 3. Escalones de terapia manual

Columna (lumbar, cervical):

- [ ] «1 · Muy suave (Manda el dolor): Sin provocar dolor: posición cómoda y sin molestias, la mayor amplitud posible sin molestia, movimiento lento y suave (grados I y II). Corta al principio, hasta conocer la respuesta a las 48 h. Explorar solo hasta el límite activo.»  
  ↳ fuente: Maitland 2005, cap. 8, p. 203; cap. 9, p. 218 · Petersen 2021, tabla 2 y apartado de irritabilidad
- [ ] «2 · Suave (Manda el dolor): Hasta donde empieza el dolor, sin sobrepasarlo (grado II); cuando el dolor baje, grado III. Con prudencia al acercarse al dolor, por el riesgo de que tarde en ceder.»  
  ↳ fuente: Maitland 2005, cap. 6, p. 101; cap. 9, p. 218 · Petersen 2021, apartado de irritabilidad
- [ ] «3 · Moderada (Molestia controlada): Hasta una molestia controlada que no aumente mientras se aplica la técnica (grado III); si lo que se provoca cede enseguida, hasta el límite pasivo. Primero la misma técnica a la misma velocidad hacia la molestia; después, la posición hacia la dirección dolorosa.»  
  ↳ fuente: Maitland 2005, cap. 8, pp. 206–208 · Petersen 2021, apartado de irritabilidad
- [ ] «4 · Firme (Manda la rigidez): Solo si domina la rigidez y las estructuras no están debilitadas por un traumatismo o una enfermedad: al final del recorrido, técnica firme (grado IV), amplitud sobre todo pequeña con alguna grande, intercalando movimientos activos. Respetar la molestia, sobre todo si se va sumando; un grado III suave alivia la que deje.»  
  ↳ fuente: Maitland 2005, cap. 8, p. 203; cap. 9, p. 218

Regiones periféricas:

- [ ] «1 · Muy suave (Manda el dolor): Sin provocar dolor: un accesorio en posición indolora y apoyada antes que un fisiológico, con la mayor amplitud posible sin molestia y oscilaciones lentas y suaves (grados I y II). Mejor quedarse corto al principio, hasta conocer la irritabilidad. Explorar solo hasta el límite activo.»  
  ↳ fuente: Hengeveld y Banks 2005, cap. 7, p. 176; cap. 8, p. 192 · Petersen 2021, tabla 2 y apartado de irritabilidad
- [ ] «2 · Suave (Manda el dolor): Hasta donde empieza el dolor, sin sobrepasarlo: con dolor a lo largo del recorrido, de grado II− a III+. Con prudencia al acercarse al dolor, por el riesgo de que tarde en ceder.»  
  ↳ fuente: Hengeveld y Banks 2005, cap. 6, p. 148; cap. 7, tabla 7.2, p. 176 · Petersen 2021, apartado de irritabilidad
- [ ] «3 · Moderada (Molestia controlada): Entrar en una molestia controlada, de un 10–20 % de su intensidad máxima, que no aumente mientras se aplica la técnica (grado III); si lo que se provoca cede enseguida, hasta el límite pasivo.»  
  ↳ fuente: Hengeveld y Banks 2005, cap. 8, pp. 192–194 · Petersen 2021, apartado de irritabilidad
- [ ] «4 · Firme (Manda la rigidez): Solo si domina la rigidez: al límite del recorrido, estiramiento oscilatorio de grado IV que progresa a IV+ y IV++, con ritmo «staccato», alternando fisiológicos y accesorios. Nunca técnicas firmes con ligamentos debilitados por una enfermedad (p. ej., artritis reumatoide), ni empujar a través de un espasmo.»  
  ↳ fuente: Hengeveld y Banks 2005, cap. 7, pp. 174–176; cap. 8, pp. 197, 203 y 224–225

## 4. Propuestas A, B y C

- [ ] «Un escalón por debajo de B»  
  ↳ describe la app (no afirma nada clínico)
- [ ] «Ajustada a la gravedad y la irritabilidad»  
  ↳ describe la app (no afirma nada clínico)
- [ ] «Un escalón por encima de B»  
  ↳ describe la app (no afirma nada clínico)
- [ ] «Una sola propuesta: B es la que se ajusta a esta gravedad e irritabilidad, y ya es el escalón más suave. A sería uno menos y no lo hay.»  
  ↳ describe la app (no afirma nada clínico)
- [ ] «Sin propuesta C: la irritabilidad no es baja (Petersen 2021; Maitland 2005, cap. 6, p. 117).»  
  ↳ fuente en el texto (Petersen 2021, Maitland 2005)
- [ ] «Sin propuesta C: los síntomas empeoran. Tratamiento suave y evaluación en cada sesión (Maitland 2005, cap. 6, pp. 101 y 107, que lo dice de los síntomas que varían mucho de un día a otro).»  
  ↳ fuente en el texto (Maitland 2005)

## 5. Avisos de la fase

- [ ] «Disautonomía: empezar el ejercicio semirreclinado, tumbado o en el agua (no muy caliente) y añadir lo vertical poco a poco (Raj 2020, rec. 14; en Fu 2010 y George 2016, hacia el final del 2.º mes); mejor dinámico que isométrico, no comer en la hora anterior y terminar con una vuelta a la calma suave (Hakim 2017, p. 172). Evitar estar mucho rato de pie quieto en la sesión (Raj 2020, p. 367). La mejoría puede tardar 4–6 semanas (Raj 2020, p. 368).»  
  ↳ fuente en el texto (Raj 2020, Fu 2010, George 2016, Hakim 2017)
- [ ] «Trastorno mastocitario o anafilaxia: que traiga su autoinyector a cada sesión (NICE NG258, 1.1.16); evitar lo que ya le ha provocado episodios, no una lista de todos los descritos (Brockow 2021). Si el calor o el frío se los han provocado, sin termoterapia ni crioterapia y con la sala templada (Muñoz 2024). No hace falta dejar el ejercicio: en la anafilaxia por ejercicio, las guías piden mantenerlo, acompañado y con el autoinyector a mano (Srisuwatchari 2023, tabla 2; extenderlo a la mastocitosis es una inferencia). Si un alimento con el ejercicio le ha dado episodios, no tomarlo en las horas de antes y después del ejercicio (Srisuwatchari 2023, tabla 2).»  
  ↳ fuente en el texto (NICE NG258, Brockow 2021, Muñoz 2024, Srisuwatchari 2023)
- [ ] «Lupus: intensidad moderada, con aeróbico y fuerza, individualizada y supervisada por un fisioterapeuta (Blaess 2024, recs. 9, 11 y 14); antes de empezar, su médico valora las contraindicaciones (Blaess 2024, rec. 10). Fotoprotección para prevenir brotes (Parodis 2024, rec. LES 2) y evitar el ejercicio al sol con un índice UV por encima de 3 (opinión de los autores de Frade 2023).»  
  ↳ **redacción propia**
- [ ] «Lupus en brote o peor sin valorar: que su reumatólogo revalore las contraindicaciones antes de seguir (Blaess 2024, rec. 4); en un brote articular, no cargar las articulaciones inflamadas (Blaess 2024, rec. 5).»  
  ↳ **redacción propia**
- [ ] «Osteoporosis: fuerza progresiva 2–3 días por semana, hasta el peso que levanta 8–12 veces, en 2 series y hasta 3, con movimientos lentos y controlados, sin flexión con carga; si el riesgo de fractura vertebral es alto, sin máquinas que obliguen a flexionar o girar el tronco (Brooke-Wavell 2022, recuadro 1; Giangregorio 2014). Equilibrio a diario, 15–20 min (Giangregorio 2014).»  
  ↳ **redacción propia**
- [ ] «Embarazo: actividad de intensidad moderada (puede hablar, no cantar), con aeróbico y fuerza; sin contacto ni riesgo de caída; si se marea, tiene náuseas o se encuentra mal boca arriba, ponerla de lado; parar si sangra, pierde líquido, tiene contracciones regulares y dolorosas, dolor de vientre o de pecho, o falta de aire o mareo que no ceden (Mottola 2018; ACOG 2020).»  
  ↳ **redacción propia**
- [ ] «Posparto: vuelta gradual guiada por los síntomas, sin autorización médica de rutina; consultar antes con su médico con tensión de más de 140/90, dolor en el pecho, falta de aire en reposo, mareo o sangrado sin regla; el dolor lumbar o de cintura pélvica, la incontinencia y la diástasis no contraindican el ejercicio (Davenport 2025). Con síntomas de suelo pélvico, fisioterapia de suelo pélvico (NICE NG210, 1.6.14).»  
  ↳ **redacción propia**
- [ ] «Da el pecho: mejor dar el pecho o sacarse leche antes del ejercicio, por comodidad (Davenport 2025).»  
  ↳ **redacción propia**
- [ ] «Embarazo o posparto: la terapia manual, como complemento y nunca sola; como mucho, para probar el alivio en pocas sesiones (Hall 2016; Simonds 2022; Vleeming 2008, nivel D). Del thrust en el embarazo solo hay un ensayo piloto de 15 mujeres sin efectos adversos (Liddle y Pennick 2015): no basta para decir que sea seguro.»  
  ↳ **redacción propia**
- [ ] «Sacroilíaca en el embarazo o el posparto: primero información (no es peligroso y probablemente mejorará) y ejercicio individualizado, o estabilización individualizada tras el parto (Vleeming 2008, nivel C); el cinturón, para probar el alivio por periodos cortos (Vleeming 2008, nivel D; NICE NG201, 1.4.15).»  
  ↳ **redacción propia**
- [ ] «Osteoporosis sin fractura vertebral: impacto moderado la mayoría de los días, unos 50 impactos por sesión, sin caer desde altura (Brooke-Wavell 2022, consenso).»  
  ↳ **redacción propia**
- [ ] «Osteoporosis con fractura vertebral o varias fracturas por fragilidad: impacto solo hasta caminar a paso ligero, por precaución (Brooke-Wavell 2022, consenso; Giangregorio 2014).»  
  ↳ **redacción propia**
- [ ] «Osteoporosis: enseñar a moverse con seguridad, sin prohibir: bisagra de cadera al agacharse y levantar; la torsión, suave y mejor girando con pasos; no levantar ni dejar cosas en el suelo (Brooke-Wavell 2022, recuadro 3; Giangregorio 2015). Cuidado al pasar de tumbado a sentado o al darse la vuelta: en un ensayo, ejercicios en prono y darse la vuelta de boca arriba a boca abajo rompieron una costilla y un cartílago costal (Gibbs 2019). Con lluvia o hielo, el ejercicio mejor dentro de casa (Giangregorio 2014).»  
  ↳ **redacción propia**
- [ ] «Osteoporosis: sin manipulación con thrust en la columna ni en las costillas; la movilización suave puede ser adecuada (Maitland 2005, cap. 9, p. 223; Puentedura 2015, tabla 1). Los escalones no proponen grado V; si la pauta de una hipótesis incluye manipulación, aquí no se aplica.»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Lupus con corticoides mantenidos: sin manipulación con thrust en la columna torácica (Puentedura 2015, tabla 1: corticoides a largo plazo, contraindicación absoluta). Si la pauta de una hipótesis incluye manipulación, aquí no se aplica.»  
  ↳ **redacción propia**
- [ ] «Anticoagulado o antiagregado: precaución con lo que tenga riesgo de golpe (lo recomiendan para el lupus: Blaess 2024, rec. 3); un esfuerzo mecánico pequeño puede dar un sangrado importante (Kim 2026, un caso). De la movilización, el masaje, la presión profunda y los estiramientos no hay ninguna norma con anticoagulantes, solo casos de sangrado (Tominaga 2023; Kwon 2024; Kim 2026). Antes de cada técnica, pregunta si desde la última sesión se ha dado un golpe o ha notado un hematoma o un dolor nuevos. No le digas que deje el fármaco ni que se salte una dosis (Steffel 2021).»  
  ↳ **redacción propia**
- [ ] «Anticoagulante: sin manipulación con thrust en la columna torácica (Puentedura 2015, tabla 1: contraindicación absoluta); en la cervical, otra tabla lo trata como precaución (Hutting 2018, opinión de los autores). Las dos son opinión de expertos y ninguna distingue fármacos ni da un INR. Los escalones no proponen grado V; si la pauta de una hipótesis incluye manipulación, aquí no se aplica.»  
  ↳ **redacción propia**
- [ ] «Anticoagulado o antiagregado, y la pauta incluye punción seca: no existe ningún estudio con antitrombóticos; una revisión narrativa y un consenso que se apoya en ella dicen que no es una contraindicación absoluta (Muñoz 2022; Waterway 2026), y según otra revisión la guía suiza sí la trata así con la anticoagulación (Malfait 2024). Práctica de los autores de la primera: empezar por músculos superficiales viendo cómo sangra, evitar al principio los profundos que no se pueden comprimir y comprimir 10–15 s (Muñoz 2022). Sin INR límite.»  
  ↳ **redacción propia**
- [ ] «Anticoagulado o antiagregado, y la pauta incluye ondas de choque: sin consenso entre expertos sobre aplicarlas con anticoagulantes, y el hematoma es un efecto posible (Rhim 2025); se consideran un factor importante a valorar, sin datos con anticoagulados (Tenforde 2022).»  
  ↳ **redacción propia**
- [ ] «Lupus con Raynaud: al aire libre, guantes o ropa contra el frío; evitar tocar superficies frías y secar bien la piel durante y después del ejercicio (Blaess 2024, rec. 2). Por lo mismo, cuidado con el frío local en manos y pies (inferencia, sin fuente propia).»  
  ↳ **redacción propia**
- [ ] «Disautonomía con hipermovilidad: adaptar además el ejercicio a la hipermovilidad, la inestabilidad y las lesiones (Hakim 2017, p. 172).»  
  ↳ fuente en el texto (Hakim 2017)
- [ ] «Nivel orientativo: el juicio de irritabilidad varía entre fisioterapeutas (acuerdo del 71 %, kappa 0,39–0,44; Barakatt 2009). Puedes cambiar la gravedad y la irritabilidad.»  
  ↳ fuente en el texto (Barakatt 2009)
- [ ] «Es una propuesta, no una prescripción: la decide y la firma el fisioterapeuta.»  
  ↳ principio 4 de docs/plan-tratamiento.md
- [ ] «Los escalones se refieren a la terapia manual de la pauta. Para el ejercicio, la dosis es la de la pauta.»  
  ↳ decisión 20 de docs/plan-tratamiento.md
- [ ] «Bandera amarilla (miedo al movimiento o riesgo psicosocial alto): tenlo presente al educar y al progresar. No bloquea la propuesta C (Petersen 2021 incluye las banderas amarillas en la «naturaleza» del cuadro).»  
  ↳ fuente en el texto (Petersen 2021)
- [ ] «Sin NRS registrado: se toma la gravedad más alta, que es la opción prudente. Cámbiala si la conoces, o registra el NRS en la fase 3.»  
  ↳ decisión 27 de docs/plan-tratamiento.md
- [ ] «Irritabilidad calculada con la matriz de la fase 3 incompleta (falta el tiempo en calmarse u otra fila): puede quedarse corta. Complétala o cámbiala aquí si la conoces.»  
  ↳ decisión 101 de docs/plan-tratamiento.md
- [ ] «Sin irritabilidad registrada en la fase 3: se toma la alta, que es la opción prudente. Cámbiala si la conoces, o completa la matriz en la fase 3.»  
  ↳ decisión 101 de docs/plan-tratamiento.md
- [ ] «Irritabilidad estimada (elegida directamente, sin la matriz).»  
  ↳ decisión 12 de docs/plan-tratamiento.md
- [ ] «Hipótesis de trabajo, pendiente de confirmar: no tiene ningún test hecho.»  
  ↳ describe la app (no afirma nada clínico)
- [ ] «Dos hipótesis: la intervención principal se reparte entre ambas y el tiempo de cada una baja.»  
  ↳ decisión 10 de docs/plan-tratamiento.md
- [ ] «No usar ninguna técnica cervical que produzca mareo; probar antes con movimientos exploratorios (Maitland 2005, cap. 9, p. 224).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Técnicas neurales (p. ej., el slump): rara vez son la primera técnica. Si se usan con vigor, dejar 2–3 días entre sesiones y reevaluar a las 24 h, porque las estructuras del canal tardan más en recuperarse de las agujetas (Maitland 2005, cap. 6, p. 149). En fase aguda o irritable, deslizadores antes que tensores, con el resto del cuerpo descargado y antes de provocar el síntoma; dosificar por tiempo o repeticiones, no por el dolor, y progresar primero en repeticiones; si no mejora en 2–3 sesiones, cambiar de técnica (Butler 2000, pp. 379–381, 387 y 391). Si es irritable, empezar lejos de la zona de síntomas, con oscilaciones lentas de gran amplitud (grado II) en series de unos 20–30 s, reevaluando y aumentando el número de series; mantener la posición solo si no es irritable, como mucho 10 s, y lo provocado debe ceder a los pocos segundos de soltar (Butler 1991, pp. 188–189 y 192–193).»  
  ↳ fuente en el texto (Maitland 2005, Butler 2000, Butler 1991)
- [ ] «Sin manipulación forzada con signos de dos raíces cervicales o signos medulares; la movilización suave sí puede ser adecuada, y los cambios neurológicos no impiden movilizar con suavidad desde el principio (Maitland 2005, cap. 9, pp. 222–223).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «En la fase aguda (menos de 1 mes) la pauta de Kuijper 2009 es sin terapia manual: ahí los escalones no se aplican. La movilización o manipulación entra en la fase crónica (Blanpied 2017, B).»  
  ↳ fuente en el texto (Kuijper 2009, Blanpied 2017)
- [ ] «Capsulitis con irritabilidad alta (fase precoz dolorosa): la guía admite movilización glenohumeral de baja intensidad en rangos sin dolor (Kelley 2013, C), pero un consenso posterior no considera eficaz la terapia manual en esa fase (93 % del panel) y sí la información y tranquilizar (100 %) (Salamh 2025). Con irritabilidad baja (fase rígida), el consenso sí la considera eficaz (85 %).»  
  ↳ fuente en el texto (Kelley 2013, Salamh 2025)
- [ ] «Capsulitis por estadio. 1, muy dolorosa: accesorios de grado I y II con el brazo bien apoyado en una posición neutra e indolora, reevaluando la respuesta de los síntomas más que el movimiento; si a las 2–3 sesiones los síntomas bajan, más amplitud y una pequeña molestia. 2, dolorosa y rígida: accesorios en posición neutra e indolora, y en la resistencia si lo que se queda antes no funciona; cuando la flexión llega a 100–120°, movimientos lentos hacia el cuadrante, primero de grado III− y después de grado IV a IV+, con un III− amplio para aliviar las molestias del tratamiento. 3, solo rigidez: grado IV+ fisiológicos y accesorios al límite, intercalando grado III; si el hombro está muy limitado, la movilización sirve poco (Hengeveld y Banks 2005, cap. 11, cuadro 11.9, pp. 342–343).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Inestabilidad: en el hombro, movimientos accesorios o fisiológicos de grado II para estimular la propiocepción antes del entrenamiento de la estabilidad funcional; la rigidez se moviliza en la columna y en las articulaciones claviculares (Hengeveld y Banks 2005, cap. 11, cuadro 11.12, p. 347). La rotación lateral con presión fuerte, con mucho cuidado, por la palanca y la torsión sobre el húmero y la cápsula (p. 314).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Artrosis glenohumeral: mejor solo con movimientos accesorios; el posteroanterior, con la mayor amplitud posible (grado II o III); tras una reagudización, grado I al principio, con el objetivo de llegar a III− o III+ en todo el recorrido sin dolor; los fisiológicos de grado II también pueden servir (Hengeveld y Banks 2005, cap. 11, cuadro 11.11, p. 345). En una articulación con artrosis, grados II o III− también cuando lo que se trata es otra estructura (cap. 8, p. 224). NICE solo considera la terapia manual en la artrosis de cadera o rodilla, y siempre junto al ejercicio (NICE NG226, rec. 1.3.6): en el hombro, si se usa, que sea dentro de un programa de ejercicio y sabiendo que la guía no la respalda.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, NICE NG226)
- [ ] «Si la cirugía fue una prótesis: sobre todo accesorios cerca de la línea articular, sin palancas largas que muevan el hueso alrededor del implante; si el ejercicio activo ya cumple el objetivo, la movilización pasiva sobra (Hengeveld y Banks 2005, cap. 10, p. 269).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Epicondilalgia lateral: la base de la pauta es el ejercicio, con su propia dosis; la terapia manual es un complemento para aliviar pronto el dolor, y los escalones solo se refieren a ella (Hengeveld y Banks 2005, cap. 12, cuadro 12.6, p. 392, que cita a Vicenzino 2003). Si el movimiento pasivo del codo es completo e indoloro, la movilización pasiva no tiene sitio; con signos articulares, se tratan primero ellos solos, hasta ver cómo progresa, y después, si hace falta, también el componente tendinoso (p. 390). Las técnicas preferidas son la extensión-aducción de grado IV a IV+ y los accesorios al límite, sobre todo el anteroposterior y el posteroanterior de la cabeza del radio en pronación (cuadro 12.6, p. 392). El codo se sobretrata con facilidad (p. 393). Si no evoluciona, mirar también la columna cervical y torácica y el hombro (pp. 361 y 369).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Epicondilalgia medial: la pauta es de ejercicio excéntrico, con su propia dosis, y no incluye terapia manual; el cap. 12 de Peripheral no trae un perfil propio de la medial (solo la nombra entre los cuadros por sobrecarga; Hengeveld y Banks 2005, cap. 12, p. 390). Los escalones, solo si la exploración encuentra signos articulares en el codo.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Codo rígido y doloroso: primero, técnicas para el dolor hasta tener clara la irritabilidad; después, estirar en cualquier dirección mientras la progresión no empeore el patrón del dolor. Para estirar: fisiológicos de grado IV o IV− si el dolor es mínimo; accesorios de grado IV o IV− con la articulación sostenida al límite del recorrido fisiológico; intercalar los dos; y un grado II+ o III− en la mayor amplitud posible para aliviar las molestias del tratamiento. Un estiramiento juicioso y controlado (grados III y IV) es poco probable que cause una miositis osificante (Hengeveld y Banks 2005, cap. 12, pp. 390 y 393).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Inestabilidad del codo: la pauta es de fortalecimiento y control, y en la posterolateral evita la carga axial en extensión y supinación (Quzli 2025). El cap. 12 de Peripheral no trae un perfil de inestabilidad del codo; por la regla general de no usar técnicas firmes con ligamentos debilitados (Hengeveld y Banks 2005, cap. 8, pp. 224–225), sin técnicas firmes al final del recorrido que tensen el ligamento insuficiente: el valgo (extensión-abducción) en la medial; la extensión con supinación en la posterolateral.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Quzli 2025)
- [ ] «Dolor radiohumeral intraarticular (plica): con patología intraarticular, de grado II− a III o III− (Hengeveld y Banks 2005, cap. 7, tabla 7.2, p. 176); si duele mucho, el movimiento longitudinal cefálico del radio cuando alivia el dolor (cap. 12, p. 389).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Atrapamiento de un nervio en el codo: los escalones se refieren a la articulación. Para el nervio, movilizar las interfases que lo rodean y recuperar su deslizamiento y su tensión (Butler 2000, pp. 380 y 400); el anteroposterior y el longitudinal caudal de la cabeza del radio sirven como movilización de la interfase de un nervio radial mecanosensible (Hengeveld y Banks 2005, cap. 12, pp. 387–388). Los signos neurológicos se exploran pronto y no se empeoran con pruebas vigorosas (cap. 6, p. 158).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Butler 2000)
- [ ] «Codo en crecimiento (apofisitis o avulsión del epicóndilo medial, enfermedad de Panner u osteocondritis del capítulo): ninguna fuente leída trata la movilización pasiva del codo con el esqueleto inmaduro (el cap. 12 de Peripheral solo nombra la osteocondritis disecante; Hengeveld y Banks 2005, cap. 12, p. 390), y la pauta del lanzador joven es de descanso y ajuste de las cargas (Lluch 2020, cap. 3.2, p. 94). Los escalones de terapia manual no se aplican.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Lluch 2020)
- [ ] «Artrosis de rodilla: la terapia manual, solo junto al ejercicio (NICE NG226, rec. 1.3.6). Movimientos accesorios al final del recorrido y a lo largo de él, con amplitudes grandes, y progresar a la compresión si hace falta; si el problema es estable, también fisiológicos, sobre todo las combinaciones en extensión (Hengeveld y Banks 2005, cap. 15, cuadro 15.2, p. 517). En una reagudización, el anteroposterior y el posteroanterior de la tibia en grados I y II (pp. 507–508); la extensión en grado III, para el dolor y la rigidez a lo largo del recorrido (p. 500). En una articulación con artrosis, grados II o III− también cuando lo que se trata es otra estructura (cap. 8, p. 224).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, NICE NG226)
- [ ] «Menisco: un bloqueo verdadero es un tope súbito a la extensión completa (suele faltar unos 30°) con la flexión completa conservada, y al final de la extensión se nota un tope elástico con espasmo; puede deberse a una rotura de menisco o a un cuerpo libre (Hengeveld y Banks 2005, cap. 15, p. 490). Si se sospecha una rotura de menisco, puede hacer falta consultar al médico antes de seguir con el tratamiento (p. 491). La terapia manual solo está en la pauta de la lesión degenerativa (Prill 2025, B); en la rotura traumática y tras la meniscectomía la pauta es de ejercicio, y los escalones se refieren a la terapia manual. La rotación de la tibia forma parte de la rehabilitación tras una meniscectomía (p. 504).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Prill 2025)
- [ ] «Dolor patelofemoral: la base es el ejercicio de su pauta; la terapia manual, nunca aislada (Willy 2019, A), y los escalones solo se refieren a ella. Cuando el movimiento de la rótula duele, las primeras sesiones, extremadamente suaves: mejor quedarse corto y comprobarlo en la siguiente que descubrir que se hizo de más (Hengeveld y Banks 2005, cap. 15, p. 499). Con mucho dolor, accesorios suaves y amplios, antes del punto donde empieza; después, en otras posiciones de flexión y de flexión-abducción, y más adelante con compresión; puede hacer falta estirar el retináculo lateral (cuadro 15.3, p. 518). La primera vez que se usa la compresión de la rótula, no más de 20 s, y valorar al día siguiente (p. 510).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Willy 2019)
- [ ] «Lesión de un ligamento de la rodilla: si se sospecha una rotura completa, puede hacer falta consultar al médico antes de seguir con el tratamiento (Hengeveld y Banks 2005, cap. 15, p. 491). La rotación medial de la tibia corresponde a la restricción del cruzado anterior, y la lateral, a la del colateral medial y el cruzado posterior (p. 504); el colateral medial se explora con la abducción y el lateral con la aducción, a 30° y 0° de flexión (p. 497), y con un colateral roto el recorrido es excesivo y el tope, «blando» (p. 505). Por la regla general de no usar técnicas firmes con ligamentos debilitados (cap. 8, pp. 224–225), sin técnicas firmes al final del recorrido en la dirección que tensa el ligamento lesionado. Los movimientos lateral y medial de la tibia ayudan a recuperarse de una lesión de un colateral (p. 509).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Esguince de un colateral. Si es reciente: movimientos lentos y pequeños, en grupos de unos 5, solo hasta una molestia mínima, y reevaluar a las 24 h; si duele más, más suave; si hay más recorrido y menos dolor, más profundo; el estiramiento suave, para la resistencia del tejido, desde el 5.º–6.º día. Si ya es una rigidez periarticular crónica: estiramientos más firmes, hasta un «pinchazo» momentáneo, pocos (4–6) y sin sostenerlos, y repetirlos en casa (Hengeveld y Banks 2005, cap. 8, p. 220).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Tendinopatía rotuliana o banda iliotibial: la base es la carga progresiva de su pauta, con su propia dosis, y los escalones solo se refieren a la terapia manual (en la banda iliotibial, la pauta la admite como complemento del fortalecimiento). Si a la vez hay signos articulares, el cap. 15 recomienda tratar primero esos, con las pruebas isométricas que provocan el dolor como parámetro de reevaluación (Hengeveld y Banks 2005, cap. 15, p. 494).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Rótula inestable: la base es el ejercicio de su pauta (Balcarek 2025), y los escalones se refieren a la terapia manual. Procurar que los movimientos pasivos sean indoloros y estirar el retináculo lateral (Hengeveld y Banks 2005, cap. 15, cuadro 15.4, p. 519). En la subluxación recurrente, el movimiento lateral de la rótula puede provocar dolor y la sensación de que se va a salir, y el paciente frena cualquier intento más contrayendo el cuádriceps (aprensión; p. 498).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Balcarek 2025)
- [ ] «Apofisitis del adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson): la pauta es de carga progresiva y una escalera de actividad guiada por el dolor, sin terapia manual (Rathleff 2020). Ninguna fuente leída trata la movilización pasiva de la rodilla con el esqueleto inmaduro (el cap. 15 de Peripheral solo nombra la hinchazón dolorosa de la tuberosidad tibial en el Osgood-Schlatter; Hengeveld y Banks 2005, cap. 15, p. 496). Los escalones de terapia manual no se aplican.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Rathleff 2020)
- [ ] «Tibioperonea proximal: a menudo no es fácil saber si es la responsable; suele aclararse con técnicas más fuertes, con compresión, comparando con el otro lado, y si aparece un signo comparable, ese movimiento es el que se usa para tratar. Al principio, firme pero no vigoroso; los síntomas que se provoquen deben ir al ritmo del movimiento y ceder enseguida al parar. Cuando la responsable es ella, suele responder muy deprisa a movilizaciones de gran intensidad (Hengeveld y Banks 2005, cap. 15, p. 499).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Neuropatía del peroneo común: los escalones se refieren a la articulación. El anteroposterior y el posteroanterior de la cabeza del peroné ayudan a recuperarse de un atrapamiento del nervio peroneo en la cabeza del peroné; el posteroanterior también puede hacerse en supino con la pierna en algo de elevación de la pierna recta (Hengeveld y Banks 2005, cap. 15, pp. 515–516). Para explorar el nervio, la elevación de la pierna recta con inversión del pie (cuadro 15.1, p. 492), y a la palpación puede doler junto a la cabeza del peroné (p. 497). Los signos neurológicos se exploran pronto y no se empeoran con pruebas vigorosas (cap. 6, p. 158).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Tras una cirugía de rodilla: el libro empieza a movilizar con el anteroposterior y el posteroanterior de la tibia en grados I y II tras una prótesis u otra intervención (Hengeveld y Banks 2005, cap. 15, pp. 507–508), y la rotación de la tibia forma parte de la rehabilitación tras una meniscectomía o una fractura de meseta tibial (p. 504). Siempre dentro del protocolo del cirujano.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Artrosis de cadera: la terapia manual, siempre junto al ejercicio (NICE NG226, rec. 1.3.6), adaptando la técnica y la fuerza a la morfología de la cadera y a la irritabilidad (Koc 2025, F). Movimientos accesorios al final del recorrido y, si hay movilidad suficiente, en posiciones dentro del recorrido, sobre todo en flexión-aducción (F/Ad); amplitudes grandes alternadas con las de final de recorrido; los síntomas menores pueden responder a la compresión intermitente añadida (Hengeveld y Banks 2005, cap. 14, cuadro 14.3, p. 476). Para calmar una reagudización, la F/Ad de grado II o III (p. 469); el longitudinal caudal alivia mucho la cadera dolorosa y sirve en la artrosis que migra hacia arriba y en la tensión capsular (p. 464), y el lateral, en la que migra hacia dentro (p. 462). En la artrosis de tipo sistémico, la movilización puede aliviar, pero es esencial el manejo reumatológico (cuadro 14.3, p. 476). En una articulación con artrosis, grados II o III− también cuando lo que se trata es otra estructura (cap. 8, p. 224).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, NICE NG226, Koc 2025)
- [ ] «Pinzamiento femoroacetabular o labrum: la pauta evita los ejercicios y los rangos que reproducen el pinzamiento (Enseki 2023). La técnica principal del cap. 14, la flexión-aducción (F/Ad), con compresión o rotación medial añadidas, lleva justo a esa posición (Hengeveld y Banks 2005, cap. 14, pp. 457–460). En la rotura del labrum, el capítulo describe dolor y aprensión con la flexión, la aducción y la rotación interna (rotura anterosuperior) o con la hiperextensión, la abducción y la rotación externa (posteroinferior), y la provocación de los síntomas con la compresión axial; según el dolor, movimientos pasivos suaves con accesorios antes de la posición dolorosa (cuadro 14.5, p. 478). Sin técnicas firmes ni compresión en las posiciones que reproducen el pinzamiento.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Enseki 2023)
- [ ] «Ligamento redondo e inestabilidad: la pauta evita los ejercicios y las actividades que provoquen síntomas o carguen en exceso las estructuras capsuloligamentosas (Enseki 2023). El cap. 14 de Peripheral no trae un perfil de inestabilidad de la cadera; por la regla general de no usar técnicas firmes con ligamentos debilitados (Hengeveld y Banks 2005, cap. 8, pp. 224–225), sin técnicas firmes al final del recorrido que estiren la cápsula, como el movimiento lateral y el longitudinal caudal, que el capítulo usa para la tensión capsular (cap. 14, pp. 462 y 464).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Enseki 2023)
- [ ] «Tendinopatía glútea: la base es la educación y el ejercicio de su pauta, con su propia dosis; la pauta no incluye terapia manual, y los escalones solo se refieren a ella (Mellor 2018). El cap. 14 la trata como «bursitis trocantérea» (Hengeveld y Banks 2005, cap. 14, cuadro 14.6, p. 479): cruzar las piernas y tumbarse sobre ese lado reproducen los síntomas, y pide tratar a la vez los signos lumbares y de la cadera que la acompañen. Su estiramiento del tensor de la fascia lata y de la cintilla iliotibial choca con la pauta, que lo evita porque comprime los tendones contra el trocánter: manda la pauta.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Mellor 2018)
- [ ] «Tendinopatía o lesión muscular: la base es la carga o el ejercicio de su pauta, con su propia dosis, y los escalones solo se refieren a la terapia manual. Si a la vez hay signos articulares, el cap. 14 recomienda tratar primero esos y usar como parámetro de reevaluación las pruebas isométricas que reproducen los síntomas (Hengeveld y Banks 2005, cap. 14, p. 454).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Lesión aguda de ingle: la pauta es de ejercicio, sin agentes físicos ni punción seca, y los escalones solo se refieren a la terapia manual; el tratamiento manual de tejidos blandos no se hacía sobre la zona dolorosa, y fuera de ella, hasta 5 min si la tensión del aductor limitaba los ejercicios (Serner 2020).»  
  ↳ fuente en el texto (Serner 2020)
- [ ] «Dolor inguinal del deportista: el cap. 14 pide considerar como fuente, además de la cadera, la columna lumbar y la torácica, la sacroilíaca y el sistema neurodinámico, y en la zona, las tendinopatías del aductor largo, el psoas ilíaco, el recto femoral y el recto abdominal, la osteítis de pubis, las fracturas de estrés de la pelvis, la inestabilidad del pubis, el atrapamiento de los nervios ilioinguinal y obturador, la hernia inguinal y la patología genitourinaria. En la tendinitis, el movimiento pasivo de la cadera suele ser normal y lo preferido son las técnicas de tejidos blandos; en la fase aguda, reposo, frío y compresión unas 48 h, y después aumentar con suavidad el estiramiento y la contracción dentro de lo indoloro (Hengeveld y Banks 2005, cap. 14, cuadro 14.4, pp. 476–477).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Síndrome glúteo profundo: los escalones se refieren a la articulación. El posteroanterior del trocánter mayor puede servir en el síndrome piriforme (Hengeveld y Banks 2005, cap. 14, p. 465); el nervio ciático se palpa a medio camino entre el trocánter mayor y la tuberosidad isquiática (p. 457) y se explora con la elevación de la pierna recta y el slump (cuadro 14.2, p. 451). Los signos neurológicos se exploran pronto y no se empeoran con pruebas vigorosas (cap. 6, p. 158).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Neuropatías de cadera e ingle: los escalones se refieren a la articulación. En la meralgia parestésica (nervio cutáneo femoral lateral), el slump en decúbito lateral con extensión y aducción de la cadera puede provocar los síntomas, y la palpación profunda justo por debajo de la espina ilíaca anterosuperior, reproducirlos; es esencial tratar a la vez los signos lumbares y de la cadera, la movilización neurodinámica respetando los síntomas, y aconsejar sobre la ropa ajustada y la pérdida de peso; según algunos autores, en muchos casos se resuelve sola en 2 años (Hengeveld y Banks 2005, cap. 14, cuadro 14.7, p. 480). Para los nervios obturador e ilioinguinal, variantes del slump en decúbito lateral y de las pruebas del nervio femoral (pp. 451 y 455; cuadro 14.4, p. 477). Los signos neurológicos se exploran pronto y no se empeoran con pruebas vigorosas (cap. 6, p. 158).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Sensibilización central: con hiperalgesia secundaria, los grados I y II solos no alivian el dolor y los III y IV pueden aumentar la sensibilización, y el tratamiento local tiene poco efecto duradero (Hengeveld y Banks 2005, cap. 10, recuadro 10.3, pp. 264–265). NICE no incluye la terapia manual entre lo que recomienda para el dolor crónico primario: pone primero el ejercicio supervisado en grupo (NICE NG193, rec. 1.2.1).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, NICE NG193)
- [ ] «Tras una cirugía de cadera: el cap. 14 no trata la prótesis; el movimiento lateral sirve para recuperar el recorrido tras una fractura del fémur o de la región acetabular (Hengeveld y Banks 2005, cap. 14, p. 462). Su técnica principal, la flexión-aducción (F/Ad), con compresión o rotación medial añadidas, lleva la cadera a flexión y aducción (pp. 457–460): si el cirujano ha pautado precauciones de luxación, comprobar antes que las respeta. Siempre dentro del protocolo del cirujano.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Esguince lateral de tobillo: en la fase aguda, reposo, compresión (vendaje o tobillera) y elevación o muletas; contracciones y movimientos desde unos 3 días, al principio en los rangos libres de resistencia, y después movilización pasiva suave dentro de la resistencia, control muscular y sentido de posición articular (Hengeveld y Banks 2005, cap. 16, cuadro 16.4, pp. 564–565). Si es reciente, movimientos lentos y pequeños, en grupos de unos 5, solo hasta una molestia mínima, y reevaluar a las 24 h; el estiramiento suave, desde el 5.º–6.º día (cap. 8, p. 220). Movimientos accesorios en distintas posiciones del retropié; la flexión dorsal y plantar con compresión de la talocrural, solo si hay un trastorno intraarticular y no antes del comienzo de la remodelación tardía, hacia las 6–8 semanas (cuadro 16.4). La tibioperonea inferior suele afectarse en los traumatismos fuertes y se pasa por alto (p. 541). Si está implicado el nervio peroneo superficial, los síntomas pueden durar más y ser urentes (cuadro 16.4; p. 529).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Lesión de la sindesmosis: la pauta no incluye terapia manual, y mientras duran la descarga y la bota (6 semanas, van Dijk 2016) los escalones no se aplican. La sindesmosis impide que la tibia y el peroné se separen con la carga, y en la flexión dorsal el peroné se desplaza hacia fuera (Hengeveld y Banks 2005, cap. 16, p. 527); la rotación lateral del astrágalo en la mortaja lleva el peroné hacia atrás (pp. 544–545): por la regla general de no usar técnicas firmes con ligamentos debilitados (cap. 8, pp. 224–225), sin técnicas firmes al final de la flexión dorsal ni de la rotación lateral del astrágalo mientras el ligamento cura.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, van Dijk 2016)
- [ ] «Tendinopatía del Aquiles: la base es la carga de su pauta, con su propia dosis, y es ejercicio (en casa o en consulta), no un número de sesiones; los escalones solo se refieren a la terapia manual. El cap. 16 trata los signos articulares del retropié (tibioperonea distal y tobillo), moviliza el arco del pie si se puede y la columna lumbar si está relacionada, y más adelante integra el tratamiento neurodinámico (nervios sural y tibial posterior) si lo está; la flexión dorsal y la eversión suelen provocar los síntomas. Cuidado con la rotura completa: prueba de Thompson (Hengeveld y Banks 2005, cap. 16, cuadro 16.5, pp. 565–566).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Porción media del Aquiles: su pauta pide la carga más alta que se tolere, sin fijar un criterio de dolor. Uno estudiado precisamente aquí: durante el ejercicio, dolor de hasta 5/10; después, hasta 5/10 pero desaparecido a la mañana siguiente; y el dolor y la rigidez, sin aumentar de semana en semana. En ese ensayo, seguir corriendo y saltando con este modelo no fue peor que el reposo activo; no prueba que sea mejor (Silbernagel 2007; no incluyó la insercional).»  
  ↳ fuente en el texto (Silbernagel 2007)
- [ ] «Tendinopatía insercional: la pauta evita cargar el tendón en flexión dorsal, que lo comprime contra el calcáneo (Jonsson 2008; Pringels 2025). Por lo mismo, sin técnicas firmes al final de la flexión dorsal (inferencia de la pauta; la flexión dorsal suele provocar los síntomas, Hengeveld y Banks 2005, cap. 16, cuadro 16.5, p. 565).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Jonsson 2008, Pringels 2025)
- [ ] «Tendinopatía del tibial posterior: la base son las plantillas, el estiramiento y el ejercicio de su pauta, con su propia dosis y sin dolor en el tendón (Kulig 2009); los escalones solo se refieren a la terapia manual. La vaina se explora con resistencia en todo el recorrido y palpando: puede aumentar los síntomas y notarse crepitación (Hengeveld y Banks 2005, cap. 16, p. 535). La tenosinovitis del tibial posterior es una de las causas del síndrome del túnel del tarso: explorar también el nervio tibial posterior (p. 525).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Kulig 2009)
- [ ] «Inestabilidad crónica del tobillo: la terapia manual de la pauta (movilizaciones graduadas y movilización con movimiento, en carga y sin carga, para la flexión dorsal y el equilibrio dinámico) va junto al ejercicio (Martin 2021, A y B); la manipulación que también recoge la guía no está en los escalones, porque la app no propone grado V (Hengeveld y Banks 2005, cap. 8, p. 198). El cap. 16 incluye las inestabilidades recurrentes en el perfil del esguince, con la pérdida del control muscular y del sentido de posición articular como factores (cuadro 16.4, p. 564), y el equilibrio monopodal es una prueba esencial tras un traumatismo (p. 533).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Martin 2021)
- [ ] «Dolor plantar del talón: la terapia manual articular de la pauta (sobre todo la flexión dorsal talocrural) y de tejidos blandos va con el estiramiento y el resto del núcleo (Koc 2023, A). En el caso clínico del cap. 16, un «espolón» resultó un componente neural (nervio tibial posterior mecanosensible, muy irritable): técnicas articulares locales, accesorios del calcáneo en flexión dorsal y eversión, siempre antes del dolor, y la movilización neurodinámica solo cuando el dolor dominaba menos (Hengeveld y Banks 2005, cap. 16, pp. 570–574). El nervio plantar puede dar síntomas con un espolón (p. 529).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Koc 2023)
- [ ] «Nervios del tobillo y el pie: los escalones se refieren a la articulación. El cap. 16 relaciona el nervio sural con la tendinopatía del Aquiles, el tibial posterior con el túnel del tarso y el nervio plantar con el dolor del talón (Hengeveld y Banks 2005, cap. 16, p. 529). Pruebas neurodinámicas: elevación de la pierna recta o slump con flexión plantar e inversión (peroneos superficial y profundo), con abducción del retropié y flexión dorsal (tibial posterior) o con aducción del retropié y flexión dorsal (sural) (p. 538, figura 16.11). En el túnel del tarso, la fuerza de los músculos de los nervios plantares y la sensibilidad de la planta (p. 538); puede deberse a una tenosinovitis del tibial posterior, un traumatismo, el sobreuso o un esguince del ligamento medial (p. 525). Con un nervio mecanosensible e irritable, primero técnicas articulares locales antes del dolor, y la movilización neurodinámica cuando el dolor domine menos (caso clínico 16.1, pp. 571–574). Los signos neurológicos se exploran pronto y no se empeoran con pruebas vigorosas (cap. 6, p. 158).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Neuroma de Morton o bursitis intermetatarsiana: los escalones se refieren a la articulación. El cap. 16 relaciona los nervios intermetatarsianos con el arco transverso aplanado (neuralgia de Morton) y los palpa en la planta entre las cabezas del 3.º y el 4.º y del 4.º y el 5.º metatarsianos (Hengeveld y Banks 2005, cap. 16, pp. 529 y 539); los movimientos intermetatarsianos sirven en la metatarsalgia por disfunción de esas articulaciones (p. 563), y en las deformidades del antepié, la movilización con automovilizaciones y la actividad de la musculatura intrínseca (p. 541). Si es una bursitis y no el nervio, la exploración del nervio de cada sesión sobra.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Artrosis de tobillo o pie: el cap. 16 no trae un perfil de artrosis. Con un trastorno intraarticular, grado III con movimientos amplios hasta el límite (Hengeveld y Banks 2005, cap. 16, p. 541), y la compresión del retropié para los trastornos intraarticulares estables y menores (p. 547). En una articulación con artrosis, grados II o III− también cuando lo que se trata es otra estructura (cap. 8, p. 224). NICE, en cambio, solo considera la terapia manual en la artrosis de cadera o rodilla, y siempre junto al ejercicio (NICE NG226, rec. 1.3.6): en tobillo o pie, si se usa, que sea dentro de un programa de ejercicio y sabiendo que la guía no la respalda.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, NICE NG226)
- [ ] «Fractura de estrés de un metatarsiano: la pauta es dejar de correr, modificar la actividad guiándose por el dolor y volver con un programa graduado (Warden 2014). Ninguna fuente leída trata la terapia manual sobre una fractura de estrés que consolida: los escalones no se aplican en el foco. Las técnicas intermetatarsianas sirven sobre todo tras la fase de inmovilización, con el pie rígido (Hengeveld y Banks 2005, cap. 16, pp. 562–563).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Warden 2014)
- [ ] «Apofisitis del pie en crecimiento (Sever, Iselin): la pauta, por analogía con la de Osgood-Schlatter, es de carga progresiva y una escalera de actividad guiada por el dolor, sin terapia manual (Rathleff 2020). Ninguna fuente leída trata la movilización pasiva del pie con el esqueleto inmaduro (el cap. 16 de Peripheral no lo trata). Los escalones de terapia manual no se aplican.»  
  ↳ fuente en el texto (Rathleff 2020)
- [ ] «Tras una cirugía de tobillo o pie: el cap. 16 no trata la cirugía. Tras una inmovilización el pie puede quedar rígido (Hengeveld y Banks 2005, cap. 16, p. 528), y entonces sirven las técnicas intermetatarsianas (pp. 562–563); el sentido de posición articular puede disminuir tras un traumatismo, y el equilibrio monopodal es una prueba esencial (p. 533). Siempre dentro del protocolo del cirujano.»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Las dos hipótesis se tratan en zonas distintas (columna y articulación periférica): los escalones y las reglas del mes son los de la principal; la cantidad por sesión y la progresión, las de cada una.»  
  ↳ decisión 50 de docs/plan-tratamiento.md
- [ ] «Dosificado según el síntoma más irritable de la fase 3, no según P1 (a igualdad de irritabilidad, manda P1). La gravedad es la de su NRS.»  
  ↳ decisión 35 de docs/plan-tratamiento.md
- [ ] «Un síntoma va independiente de P1: puede ser un segundo problema que este plan no trata. Valóralo aparte.»  
  ↳ decisión 35 de docs/plan-tratamiento.md
- [ ] «Solo si es compatible con el protocolo del cirujano; donde difieran, prevalece el protocolo.»  
  ↳ texto de la fase 5 (`TEXTO_PAUTA_COMPATIBLE`, lib/posquirurgico.js), ya revisado: posquirúrgico con protocolo
- [ ] «Restricciones pendientes de confirmar con el cirujano.»  
  ↳ texto de la fase 5 (`TEXTO_SIN_PROTOCOLO`, lib/posquirurgico.js), ya revisado: posquirúrgico sin protocolo

Fármacos que toma (tarjeta de la fase 1, `data/farmacos-paciente.js`): un aviso por familia, con su rótulo (redacción propia) y frases copiadas literales de la guía de fármacos ya revisada (`data/farmacos.js`; una prueba lo exige). La línea común sale una vez si hay alguno.

- [ ] «Toma AINE:»  
  ↳ **redacción propia** (rótulo del aviso de `aine`)
- [ ] «Deshidratación y calor: el efecto de los AINE sobre el riñón empeora con deshidratación, poca perfusión renal o daño renal previo (Lucas 2019), y la deshidratación y el ejercicio intenso con calor reducen además el riego intestinal (Papantoniou 2023). Vigila la hidratación en sesiones largas o con calor.»  
  ↳ guía de fármacos, familia `aine` (texto revisado; su cita va dentro)
- [ ] «Anota si tomó una dosis antes de la sesión.»  
  ↳ guía de fármacos, familia `aine` (texto revisado; su cita va dentro)
- [ ] «Toma corticoides:»  
  ↳ **redacción propia** (rótulo del aviso de `corticoides`)
- [ ] «Fractura: el riesgo sube a los 3–6 meses de empezar y depende de la dosis (Compston 2018), incluso desde 2,5 mg/día; es mayor en los primeros meses, baja alrededor de un 30 % a los 6 meses de dejarlos y se normaliza a los 12 (Pofi 2023).»  
  ↳ guía de fármacos, familia `corticoides` (texto revisado; su cita va dentro)
- [ ] «Infección: quien toma corticoides puede no dar los signos y síntomas habituales de una infección, porque frenan la respuesta inflamatoria y la fiebre, y eso retrasa reconocerla (Yasir 2023; Liu 2013).»  
  ↳ guía de fármacos, familia `corticoides` (texto revisado; su cita va dentro)
- [ ] «Miopatía: el ejercicio puede atenuarla según los estudios que cita una cohorte, en la que los síntomas mejoraron tras una mediana de 107 días; recomienda cribar las caídas en mayores de 50 años (He 2025).»  
  ↳ guía de fármacos, familia `corticoides` (texto revisado; su cita va dentro)
- [ ] «Terapia manual: una revisión de casos de efectos adversos del thrust torácico pone la medicación con corticoides a largo plazo, sin definir la dosis ni la duración, entre las contraindicaciones absolutas del thrust en la columna torácica; su tabla sale de un trabajo de una escuela de osteopatía, no de una guía (Puentedura 2015). En el plan de tratamiento, la app quita el thrust con la tarjeta «Osteoporosis o fragilidad ósea» y cuando la tarjeta «Lupus (LES)» registra corticoides o dosis altas previas. Las fuentes leídas no dan normas para la carga ni para el resto de la terapia manual: tenlo en cuenta al elegir carga axial intensa.»  
  ↳ guía de fármacos, familia `corticoides` (texto revisado; su cita va dentro)
- [ ] «Toma opioides:»  
  ↳ **redacción propia** (rótulo del aviso de `opioides`)
- [ ] «Mareo, somnolencia y caídas: frente a placebo dan más mareo y somnolencia (Dowell 2022). En mayores producen sedación, falta de coordinación, mareo y caídas, con más fracturas de cadera y no vertebrales (Dufort y Samaan 2021).»  
  ↳ guía de fármacos, familia `opioides` (texto revisado; su cita va dentro)
- [ ] «El ejercicio terapéutico reduce el dolor y mejora la función en la lumbalgia, la fibromialgia y la artrosis de cadera o rodilla, con beneficios que se mantienen 2–6 meses, y puede sumarse a la medicación (Dowell 2022).»  
  ↳ guía de fármacos, familia `opioides` (texto revisado; su cita va dentro)
- [ ] «Mantener o aumentar la actividad física, junto con el agua y la fibra, ayuda a prevenir el estreñimiento; durante una retirada pautada, la guía pide aprovechar al máximo los tratamientos del dolor sin fármacos (Dowell 2022).»  
  ↳ guía de fármacos, familia `opioides` (texto revisado; su cita va dentro)
- [ ] «Las fuentes leídas no dan normas de terapia manual en estos pacientes ni sobre el ejercicio en las horas siguientes a la toma.»  
  ↳ guía de fármacos, familia `opioides` (texto revisado; su cita va dentro)
- [ ] «Toma gabapentinoides:»  
  ↳ **redacción propia** (rótulo del aviso de `gabapentinoides`)
- [ ] «Mareo, somnolencia y marcha: son las reacciones más frecuentes y las que más llevaron a abandonar la pregabalina; la mayoría fueron leves o moderadas, dependientes de la dosis y aparecieron en las 2 primeras semanas (Cross 2024).»  
  ↳ guía de fármacos, familia `gabapentinoides` (texto revisado; su cita va dentro)
- [ ] «Mayores y función renal: ambos fármacos se eliminan por vía renal y el aclaramiento baja en los mayores y con disfunción renal, con más riesgo de reacciones adversas (Yasaei 2024; Cross 2024).»  
  ↳ guía de fármacos, familia `gabapentinoides` (texto revisado; su cita va dentro)
- [ ] «Las fuentes leídas no dan normas de terapia manual en estos pacientes ni sobre el ejercicio en las horas siguientes a la toma.»  
  ↳ guía de fármacos, familia `gabapentinoides` (texto revisado; su cita va dentro)
- [ ] «Toma antidepresivos:»  
  ↳ **redacción propia** (rótulo del aviso de `antidepresivos`)
- [ ] «Mareo, ortostatismo y caídas: los tricíclicos se asociaron a mucha más hipotensión ortostática que el placebo (OR 6,30), y los ISRS no (Bhanu 2021). La amitriptilina da hipotensión ortostática, mareo y sedación (Thour 2026). La duloxetina puede dar hipotensión ortostática, caídas y síncope, sobre todo al empezar o al subir la dosis (Biswas 2026).»  
  ↳ guía de fármacos, familia `antidepresivos` (texto revisado; su cita va dentro)
- [ ] «Las fuentes leídas no dan normas de terapia manual ni de ejercicio con estos fármacos. El sangrado que estudian es el grave, digestivo o intracraneal, no los hematomas de las técnicas manuales.»  
  ↳ guía de fármacos, familia `antidepresivos` (texto revisado; su cita va dentro)
- [ ] «Toma benzodiacepinas o relajantes musculares:»  
  ↳ **redacción propia** (rótulo del aviso de `sedantes`)
- [ ] «Caídas y fracturas: las benzodiacepinas aumentan las caídas (OR 1,39–1,57) y se asocian con fuerza a la fractura de cadera; los hipnóticos Z, como el zolpidem, también aumentan las fracturas (OR 1,63). El riesgo es mayor las primeras semanas tras empezar y con el uso prolongado, por sedación, hipotensión ortostática, mareo, debilidad muscular, ataxia y problemas visuales (Capiau 2023).»  
  ↳ guía de fármacos, familia `sedantes` (texto revisado; su cita va dentro)
- [ ] «Equilibrio: el efecto depende de la dosis y es máximo en las primeras horas tras la toma; es mayor con dosis altas, con poco tiempo entre la toma y el despertar o con alcohol u otros sedantes, y la inestabilidad es más marcada en mayores (Capiau 2023).»  
  ↳ guía de fármacos, familia `sedantes` (texto revisado; su cita va dentro)
- [ ] «Las fuentes leídas no dan normas de terapia manual ni de dosificación del ejercicio con estos fármacos.»  
  ↳ guía de fármacos, familia `sedantes` (texto revisado; su cita va dentro)
- [ ] «Toma estatinas:»  
  ↳ **redacción propia** (rótulo del aviso de `estatinas`)
- [ ] «Al empezar un programa de ejercicio, las molestias pueden deberse al propio ejercicio y no a la estatina, y llevar a dejarla por error; ese pequeño aumento de riesgo no es motivo para abandonar el ejercicio ni la estatina sin valoración médica (Mangone 2024). Desaconsejar el ejercicio por tomar estatina puede aumentar el riesgo cardiovascular: el ejercicio moderado no debe desaconsejarse, mientras que el esfuerzo intenso y no habitual puede subir la CK e interactuar con la estatina (Epelde 2026).»  
  ↳ guía de fármacos, familia `estatinas` (texto revisado; su cita va dentro)
- [ ] «Rabdomiólisis por esfuerzo: el ejercicio extenuante, sobre todo sin entrenamiento, levantar mucho peso o hacerlo con mucho calor, y la deshidratación pueden causarla, igual que la inmovilización prolongada (Rout 2025).»  
  ↳ guía de fármacos, familia `estatinas` (texto revisado; su cita va dentro)
- [ ] «Mayores: por encima de 65 años la concentración de atorvastatina es mayor y el riesgo de miopatía también (McIver y Siddique 2025). Las fuentes leídas no tratan la terapia manual, las caídas ni las adaptaciones al entrenamiento.»  
  ↳ guía de fármacos, familia `estatinas` (texto revisado; su cita va dentro)
- [ ] «Toma o ha tomado fluoroquinolonas:»  
  ↳ **redacción propia** (rótulo del aviso de `fluoroquinolonas`)
- [ ] «Cuándo: puede empezar en las primeras horas o los 2 primeros días de tratamiento y hasta varios meses después de terminarlo (EMA 2018).»  
  ↳ guía de fármacos, familia `fluoroquinolonas` (texto revisado; su cita va dentro)
- [ ] «Ante dolor o hinchazón de un tendón, durante el tratamiento o después, la EMA pide reposo de la zona y contacto inmediato con el médico (EMA 2018); otras revisiones piden reducir la carga del tendón y no ejercitar la zona afectada (Rusu 2023), con analgesia y fisioterapia (Baggio y Ananda-Rajah 2021).»  
  ↳ guía de fármacos, familia `fluoroquinolonas` (texto revisado; su cita va dentro)
- [ ] «Rehabilitación: puede responder mal a los programas excéntricos habituales, al menos al principio. Se propone en dos fases: primero soporte y protección, para que el tendón se recupere de la lesión química, y después carga progresiva (Lewis y Cook 2014). Una revisión cita proteger el tendón el primer mes (alza de talón, ortesis, muletas) y reducir la carga del Aquiles de 6 semanas a 6 meses (Rusu 2023).»  
  ↳ guía de fármacos, familia `fluoroquinolonas` (texto revisado; su cita va dentro)
- [ ] «Toma betabloqueantes:»  
  ↳ **redacción propia** (rótulo del aviso de `betabloqueantes`)
- [ ] «La frecuencia cardíaca no sirve para dosificar el ejercicio: la bajan en todo el rango de intensidades, la frecuencia máxima ya no se puede estimar y las zonas de frecuencia dejan de corresponder al esfuerzo real; un cambio de dosis o de cumplimiento la vuelve a cambiar (Mitchell 2025). Con 100 mg de metoprolol, la frecuencia fue unos 40 latidos por minuto más baja al mismo esfuerzo percibido (Mitchell 2025).»  
  ↳ guía de fármacos, familia `betabloqueantes` (texto revisado; su cita va dentro)
- [ ] «Usa el esfuerzo percibido (escala de Borg de 6 a 20): en un ensayo, su relación con el consumo de oxígeno se mantuvo con el fármaco (Mitchell 2025), y una guía europea recoge que sirve cuando la frecuencia cardíaca no se puede usar. Como referencia, 12–13 es intensidad moderada y 14–16 alta (Hansen 2022).»  
  ↳ guía de fármacos, familia `betabloqueantes` (texto revisado; su cita va dentro)
- [ ] «Las fuentes no coinciden en cuánto fiarse del Borg: la guía europea lo quiere solo como complemento de un método objetivo, como la prueba de esfuerzo, y advierte que los betabloqueantes pueden dificultar su interpretación (Hansen 2022); el ensayo que lo apoya es de 13 jóvenes sanos con una sola dosis (Mitchell 2025). Si su cardiólogo le ha dado una intensidad a partir de una prueba de esfuerzo, esa manda.»  
  ↳ guía de fármacos, familia `betabloqueantes` (texto revisado; su cita va dentro)
- [ ] «Por el mareo y la hipotensión (Ez Eddin 2025; Farzam y Jan 2023), cuida los cambios de postura y el final de la sesión. Las fuentes leídas no tratan la terapia manual, el ejercicio con calor ni la sudoración en el esfuerzo.»  
  ↳ guía de fármacos, familia `betabloqueantes` (texto revisado; su cita va dentro)
- [ ] «Caídas: en mayores de 55 años, los no selectivos, como el propranolol, se asociaron a más caídas (HR 1,22; IC 95 % 1,01–1,48) y los selectivos no (HR 0,92; 0,83–1,01). Ese estudio miró el uso mantenido, no el comienzo, cuando otros estudios vieron más caídas por hipotensión (Ham 2017).»  
  ↳ guía de fármacos, familia `betabloqueantes` (texto revisado; su cita va dentro)
- [ ] «Toma diuréticos u otros antihipertensivos:»  
  ↳ **redacción propia** (rótulo del aviso de `antihipertensivos`)
- [ ] «Caídas: en mayores con salud compleja, el riesgo de caer subió un 35–50 % en los 30 días siguientes a empezar un antihipertensivo, y otros estudios lo vieron también al añadir otro o al subir la dosis (Jödicke 2023). Los ensayos no hallaron más caídas, pero sí más hipotensión y síncope (Albasri 2021), y excluyen a los más frágiles (McEvoy 2024). En esas semanas, cuida los cambios de postura y el equilibrio.»  
  ↳ guía de fármacos, familia `antihipertensivos` (texto revisado; su cita va dentro)
- [ ] «Hipotensión ortostática: una caída de 20 mmHg de la sistólica o de 10 de la diastólica al ponerse de pie, medida al minuto y a los 3 minutos tras 5 minutos sentado o tumbado (McEvoy 2024). Los diuréticos la provocan más; los IECA, los ARA II y los dihidropiridínicos, menos, y sobre todo en las 2 primeras semanas tras empezar o subir la dosis (McEvoy 2024). Empeora al levantarse, tras el ejercicio y con calor (Ringer 2025).»  
  ↳ guía de fármacos, familia `antihipertensivos` (texto revisado; su cita va dentro)
- [ ] «Para prevenirla: levantarse por fases (tumbado, sentado, de pie), beber lo suficiente, y cruzar las piernas o tensar los músculos de piernas y caderas al ponerse de pie (Ringer 2025; McEvoy 2024). Si hay riesgo de caer, ejercicio supervisado, como la bicicleta reclinada o la natación (Ringer 2025).»  
  ↳ guía de fármacos, familia `antihipertensivos` (texto revisado; su cita va dentro)
- [ ] «Calor: en mayores, los diuréticos de asa, los IECA y los ARA II se asociaron a más ingresos por golpe de calor o deshidratación, también sin ola de calor (Layton 2020).»  
  ↳ guía de fármacos, familia `antihipertensivos` (texto revisado; su cita va dentro)
- [ ] «Toma insulina u otros antidiabéticos:»  
  ↳ **redacción propia** (rótulo del aviso de `antidiabeticos`)
- [ ] «Riesgo de hipoglucemia con el ejercicio: lo tiene quien usa insulina o sulfonilureas. Con metformina, gliptinas, GLP-1, gliflozinas o pioglitazona solos no hace falta tomar hidratos por el ejercicio; combinados con insulina o sulfonilureas, sí hay riesgo (Kanaley 2022; Colberg 2016). Con insulina o sulfonilureas, que traiga hidratos de absorción rápida y su medidor de glucosa, y glucagón si tiende a hipoglucemias graves (Kanaley 2022; Riddell 2017).»  
  ↳ guía de fármacos, familia `antidiabeticos` (texto revisado; su cita va dentro)
- [ ] «Glucemia antes de empezar: el objetivo es 90–250 mg/dL (5,0–13,9 mmol/L) (Colberg 2016). Por debajo de 90 mg/dL, hidratos antes de empezar (Colberg 2016; Riddell 2017). Por encima de 250 mg/dL hay que mirar las cetonas: con cetonas moderadas o altas no se hace ejercicio; sin ellas, ejercicio ligero o moderado si se encuentra bien e hidratado, y el intenso cuando baje de 250 (Colberg 2016; Kanaley 2022). Una hipoglucemia grave en las 24 horas previas contraindica el ejercicio (Riddell 2017).»  
  ↳ guía de fármacos, familia `antidiabeticos` (texto revisado; su cita va dentro)
- [ ] «Durante: en la diabetes tipo 1, la hipoglucemia aparece en la mayoría dentro de los 45 minutos de ejercicio aeróbico (Riddell 2017). Después: aparece sobre todo 6–15 horas más tarde, aunque el riesgo dura hasta 48 horas (Colberg 2016), y el ejercicio largo e intenso lo aumenta con insulina o sulfonilureas (Kanaley 2022).»  
  ↳ guía de fármacos, familia `antidiabeticos` (texto revisado; su cita va dentro)
- [ ] «Lugar de inyección: la insulina se pone en una zona que no vaya a trabajar, porque el ejercicio acelera su absorción, y el calor ambiente también (Adolfsson 2022). Las fuentes leídas no tratan el masaje, el calor local ni la terapia manual sobre una zona recién inyectada.»  
  ↳ guía de fármacos, familia `antidiabeticos` (texto revisado; su cita va dentro)
- [ ] «Gliflozinas: el ejercicio, solo si se encuentra bien, aunque la glucosa no esté muy alta, por la cetoacidosis con glucosa normal (Kanaley 2022); por la pérdida de volumen y el mareo (Tentolouris 2019), cuida la hidratación y los cambios de postura.»  
  ↳ guía de fármacos, familia `antidiabeticos` (texto revisado; su cita va dentro)
- [ ] «Hipoglucemia en la sesión: para el ejercicio y que se mida la glucosa (Moser 2020; Costello 2023). Con 70 mg/dL (3,9 mmol/L) o menos, 15 g de hidratos de absorción rápida, mejor glucosa (tabletas, zumo, refresco), sin grasa ni proteína; volver a medir a los 15 minutos y repetir si sigue baja, la regla «15-15»; cuando se recupere, que coma algo, porque con insulina o sulfonilureas puede repetirse (ADA 2025; Costello 2023). Si bajó de 54 mg/dL, no se reanuda el ejercicio (Moser 2020).»  
  ↳ guía de fármacos, familia `antidiabeticos` (texto revisado; su cita va dentro)
- [ ] «Toma fármacos que tocan el hueso:»  
  ↳ **redacción propia** (rótulo del aviso de `hueso`)
- [ ] «Pronto, con imagen del fémur: un dolor de muslo, ingle o cadera sin explicación con bifosfonato o denosumab. La guía británica pide imagen del fémur (radiografía del fémur entero, gammagrafía o resonancia) y, si hay fractura atípica, también del otro (Gregson 2025). Hasta entonces, sin impacto ni carga de esa pierna.»  
  ↳ guía de fármacos, familia `hueso` (texto revisado; su cita va dentro)
- [ ] «Tras una infusión de zoledronato, los 3 primeros días pueden traer fiebre y dolor muscular (Alaranji y Reilly 2025): si la sesión cae en esos días, tenlo en cuenta al dosificar y al interpretar los síntomas.»  
  ↳ guía de fármacos, familia `hueso` (texto revisado; su cita va dentro)
- [ ] «Inhibidores de la aromatasa: en un ensayo con 121 mujeres inactivas con dolor articular, fuerza supervisada 2 días por semana (6 ejercicios, 3 series de 8–12 repeticiones, subiendo el peso tras dos sesiones haciendo 12 repeticiones en cada serie) y 150 minutos semanales de aeróbico, del 50 % al 60–80 % de la frecuencia cardíaca máxima en el primer mes, durante 12 meses, bajaron el peor dolor 1,6 puntos (29 %), frente a una subida del 3 % con los cuidados habituales, sin efectos adversos (Irwin 2015). El beneficio más claro llegó a los 12 meses (Irwin 2015).»  
  ↳ guía de fármacos, familia `hueso` (texto revisado; su cita va dentro)
- [ ] «No le digas que deje ni cambie la medicación: las dudas, a quien la prescribe.»  
  ↳ **redacción propia** (resume las frases «Nunca aconsejes…» de cada familia; decisión 18 de docs/farmacos-paciente.md)

## 6. Sesión de 50 minutos

Minutos orientativos y editables en la fase 6 (organización de la sesión, no evidencia).

- [ ] «Reevaluación: 5 min (0–5)»  
  ↳ **organización orientativa**
- [ ] «Educación: 7 min (5–12)»  
  ↳ **organización orientativa**
- [ ] «Intervención principal: 23 min (12–35)»  
  ↳ **organización orientativa**
- [ ] «Programa domiciliario: 10 min (35–45)»  
  ↳ **organización orientativa**
- [ ] «Cierre: 5 min (45–50)»  
  ↳ **organización orientativa**
- [ ] «Red de seguridad (lupus): explicar que la fiebre, los escalofríos o un malestar general nuevos piden ir hoy mismo al médico, y que con su tratamiento una infección puede dar poca fiebre; comprobar que lo ha entendido (Rao y Mikdashi 2023; Yasir 2023).»  
  ↳ **redacción propia**
- [ ] «Red de seguridad (trastorno mastocitario o anafilaxia): explicar que, si le salen ronchas, se le hincha la boca, le falta el aire, se marea o se desmaya, debe parar, ponerse el autoinyector y llamar al 112, tumbado y sin levantarse de golpe aunque mejore, y comprobar que lo ha entendido (RCUK 2021, apartados 4.4 y 5.1.1; NICE NG258, 1.1.14).»  
  ↳ fuente en el texto (RCUK 2021, NICE NG258)
- [ ] «Red de seguridad (lupus): explicar que la debilidad o el adormecimiento de un lado, la dificultad para hablar o la pérdida de visión de golpe piden llamar al 112, aunque se pasen (Goodman 2018, cap. 12, p. 445; Drosos 2022, p. 773).»  
  ↳ fuente en el texto (Goodman 2018)
- [ ] «Red de seguridad (osteoporosis): explicar que un dolor de espalda fuerte que empieza de golpe tras un esfuerzo pequeño pide parar y que le vea el médico, y que si además nota debilidad u hormigueo en las piernas, o cambios al orinar, debe ir a urgencias (Gregson 2025; Finucane 2020, sección 3).»  
  ↳ fuente en el texto (Finucane 2020)
- [ ] «Red de seguridad (embarazo): explicar que el dolor de cabeza fuerte, la visión borrosa, el dolor fuerte bajo las costillas o la hinchazón brusca de la cara o las manos piden que la vea un profesional hoy; que si nota que el bebé se mueve menos llame a su maternidad a cualquier hora, y que si sangra, pierde líquido o tiene contracciones regulares y dolorosas, pare y llame (NICE NG133, 1.1.1; NICE NG201, 1.2.34; Mottola 2018, recuadro 2).»  
  ↳ **redacción propia**
- [ ] «Red de seguridad (posparto): explicar que un sangrado brusco o muy abundante, la fiebre o los escalofríos, el flujo maloliente, la pierna hinchada y dolorosa, la falta de aire, el dolor en el pecho o un dolor de cabeza fuerte piden consulta médica sin demora, y comprobar que lo ha entendido (NICE NG194, 1.2.4).»  
  ↳ **redacción propia**
- [ ] «Red de seguridad (anticoagulado o antiagregado): explicar que un golpe en la cabeza, aunque se encuentre bien, pide ir a urgencias, y que un dolor de cabeza fuerte, vómitos, somnolencia o confusión en los días siguientes piden llamar al 112; que un dolor fuerte de cuello o espalda con debilidad u hormigueo, un dolor muy fuerte en la ingle, la cadera o la barriga con mareo, o un brazo o una pierna muy hinchados y tensos con un dolor desproporcionado piden urgencias; y que no deje ni se salte el fármaco sin hablarlo con su médico (NICE NG232, 1.2.4 y 1.10.9; Peng 2022; Lukies 2023; Brooker 2020; Steffel 2021).»  
  ↳ **redacción propia**
- [ ] «Red de seguridad (disautonomía): explicar que, si se desmaya mientras hace ejercicio, debe parar y no volver a hacer ejercicio hasta que le vea el médico, y comprobar que lo ha entendido (NICE CG109, 1.3.2.2 y 1.5.4.3; Brignole 2018, p. 1911).»  
  ↳ fuente en el texto (NICE CG109, Brignole 2018)
- [ ] «Signo comparable y la actividad que el paciente refiere como control (Maitland 2005, cap. 6, pp. 100–101 y 128).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Cómo reaccionó a la sesión anterior, en sus palabras y comparado con antes («D más 1», Maitland 2005, cap. 6, p. 156; cap. 9, tabla 9.3; Hengeveld y Banks 2005, cap. 9, p. 246).»  
  ↳ fuente en el texto (Maitland 2005, Hengeveld y Banks 2005)
- [ ] «Exploración neurológica al empezar; si empeora, comunicarlo al médico (Maitland 2005, cap. 6, p. 136).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Sensibilidad y fuerza en el territorio del nervio al empezar, sin empeorarlas con pruebas vigorosas (Hengeveld y Banks 2005, cap. 6, p. 158; cap. 12, cuadro 12.6, p. 392); si empeoran, comunicarlo al médico (Maitland 2005, cap. 6, p. 136).»  
  ↳ fuente en el texto (Maitland 2005, Hengeveld y Banks 2005)
- [ ] «Explicar la hipótesis y el plan, y lo que puede notar.»  
  ↳ organización de la sesión (orientativa, editable; no evidencia)
- [ ] «Avisar de un posible aumento temporal de los síntomas tras esta primera sesión (Maitland 2005, cap. 9, p. 219; Hengeveld y Banks 2005, cap. 9, p. 243).»  
  ↳ fuente en el texto (Maitland 2005, Hengeveld y Banks 2005)
- [ ] «Primera sesión: menos tratamiento que en las siguientes, porque el primer estiramiento provoca más reacción (Maitland 2005, cap. 9, p. 219).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Evaluar antes, durante y después de cada técnica; unas 3–4 movilizaciones de unos 30 s por articulación, la mitad si duele mucho (Maitland 2005, cap. 9, pp. 213, 216 y 219).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Evaluar antes, durante y después de cada técnica. Con dolor: técnicas de 30 s a 2 min, una o dos veces, lentas y suaves. Con rigidez: unos 2 min de estiramiento oscilatorio, alternando fisiológicos y accesorios al límite, 3–4 veces en la sesión inicial; de media, 4–5 min por articulación cada vez. Con dolor y rigidez, estirar 3 o más veces, 1–2 min cada una (Hengeveld y Banks 2005, cap. 5, pp. 97–102; cap. 7, p. 175; cap. 8, pp. 192, 197–198 y 201).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Mareo cervicogénico: el volumen es el de su pauta, que manda sobre la cantidad genérica: SNAG de Mulligan, 6 repeticiones (sin síntomas en la primera sesión); o movilización de Maitland de hasta 3 niveles cervicales altos, normalmente 3 aplicaciones de 30 s por nivel (Reid 2014).»  
  ↳ fuente en el texto (Reid 2014)
- [ ] «Enseñar y comprobar lo que hará en casa.»  
  ↳ organización de la sesión (orientativa, editable; no evidencia)
- [ ] «Reevaluar el signo comparable y explicar qué vigilar hasta la próxima sesión: al levantarse, en el trabajo o la actividad, por la noche y tras los ejercicios (Maitland 2005, cap. 9, p. 213 y tabla 9.3, «Después»; Hengeveld y Banks 2005, cap. 9, p. 243).»  
  ↳ fuente en el texto (Maitland 2005, Hengeveld y Banks 2005)
- [ ] «Red de seguridad: explicar qué síntomas exigen ir a urgencias (adormecimiento entre las piernas o alrededor del ano, cambios al orinar o al hacer de vientre) y comprobar que lo ha entendido (Finucane 2020, sección 2, pp. 9–17).»  
  ↳ fuente en el texto (Finucane 2020)
- [ ] «Red de seguridad: explicar qué síntomas exigen ir a urgencias (torpeza nueva en las manos, inestabilidad o piernas «pesadas» al caminar, cambios al orinar o al hacer de vientre) y comprobar que lo ha entendido (Margetis y Donnally 2025, anamnesis y exploración).»  
  ↳ fuente en el texto (Margetis y Donnally 2025)
- [ ] «Red de seguridad: explicar qué síntomas exigen llamar al 112 (dolor u opresión en el pecho, el hombro, el brazo, el cuello, la mandíbula o la espalda que no se pasa al parar en unos 20 minutos, o que viene con sudor frío, náuseas, vómitos o falta de aire) y comprobar que lo ha entendido (Goodman 2018, cap. 6, pp. 236 y 260, como en el razonamiento de h_c4).»  
  ↳ fuente en el texto (Goodman 2018)
- [ ] «Red de seguridad: explicar qué síntomas exigen ir hoy mismo al médico o a urgencias (el codo se pone rojo, caliente e hinchado, aunque no haya fiebre) y comprobar que lo ha entendido (Momodu y Savaliya 2023; Pangia 2025, como en el razonamiento de co1).»  
  ↳ fuente en el texto (Momodu y Savaliya 2023, Pangia 2025)
- [ ] «Red de seguridad: explicar qué síntomas exigen ir hoy mismo al médico o a urgencias (la rodilla, o la zona de delante de la rótula, se pone roja, caliente e hinchada, aunque no haya fiebre) y comprobar que lo ha entendido (Momodu y Savaliya 2023; Truong 2023, como en el razonamiento de r1 y r_i3).»  
  ↳ fuente en el texto (Momodu y Savaliya 2023, Truong 2023)
- [ ] «Red de seguridad: explicar qué síntomas exigen ir hoy mismo al médico o a urgencias (la pantorrilla hinchada, caliente, más roja o dolorida que la otra) y cuáles, llamar al 112 (falta de aire de repente o dolor en el pecho al respirar), y comprobar que lo ha entendido (Waheed 2023; NICE NG158; Vyas 2024, como en el razonamiento de r_v2 y pq_tep).»  
  ↳ fuente en el texto (Waheed 2023, NICE NG158, Vyas 2024)
- [ ] «Red de seguridad: explicar qué síntomas exigen dejar la actividad que lo empeora e ir hoy mismo al médico (dolor de ingle o de cadera que va a más al apoyar el peso o con la actividad y aparece también de noche: posible fractura de estrés del cuello del fémur, que una radiografía negativa no descarta) y comprobar que lo ha entendido (Lluch 2020; Goodman 2018; May y Marappa-Ganeshan 2023, como en el razonamiento de ca_os1).»  
  ↳ fuente en el texto (Goodman 2018, Lluch 2020, May y Marappa-Ganeshan 2023)
- [ ] «Red de seguridad: explicar qué síntomas exigen ir hoy mismo a urgencias (la cadera duele mucho, hasta no poder apoyar la pierna, con fiebre o malestar general) y, con una prótesis, cuáles piden ir al médico (un dolor nuevo que no cede en reposo y sigue de noche, sobre todo tras una infección), y comprobar que lo ha entendido (Momodu y Savaliya 2023; Goodman 2018, como en el razonamiento de ca_in1 y ca_in3).»  
  ↳ fuente en el texto (Goodman 2018, Momodu y Savaliya 2023)
- [ ] «Red de seguridad: explicar qué síntomas piden dejar la actividad que lo empeora e ir al médico (un dolor del pie o del tobillo que empieza poco a poco, va a más con la carga o la actividad, no mejora al calentar y molesta por la noche: posible fractura de estrés, que la radiografía tarda 2–3 semanas en mostrar) y comprobar que lo ha entendido (May y Marappa-Ganeshan 2023; Lluch 2020, como en el razonamiento de tp_o1).»  
  ↳ fuente en el texto (Lluch 2020, May y Marappa-Ganeshan 2023)
- [ ] «Red de seguridad: explicar qué síntomas exigen ir hoy mismo a urgencias (el tobillo o una articulación del pie hinchada, caliente y muy dolorosa, con fiebre o malestar general) y cuáles, hoy mismo al médico (lo mismo de golpe, aunque no haya fiebre), y comprobar que lo ha entendido (Momodu y Savaliya 2023; Goodman 2018, como en el razonamiento de tp_i1).»  
  ↳ fuente en el texto (Goodman 2018, Momodu y Savaliya 2023)
- [ ] «Red de seguridad: explicar qué síntomas piden dejar los ejercicios e ir al médico sin esperar a la próxima sesión (un golpe o una patada de repente detrás del tobillo o de la pantorrilla, a veces con un chasquido, y desde entonces cojear o no poder ponerse de puntillas) y comprobar que lo ha entendido (Lluch 2020; Shamrock 2023, como en el razonamiento de tp_t3; Hengeveld y Banks 2005, cap. 16, cuadro 16.5, p. 565).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005, Lluch 2020, Shamrock 2023)
- [ ] «Red de seguridad: explicar qué síntomas exigen ir a urgencias (dolor de cabeza o de cuello de golpe y distinto a cualquier otro, visión doble, dificultad para hablar o tragar, inestabilidad al caminar o caídas súbitas) y comprobar que lo ha entendido; los de una disección pueden llegar días después (Rushton 2023, tablas 1–2 y 6, pp. 9–12).»  
  ↳ fuente en el texto (Rushton 2023)

## 7. Plan de un mes

- [ ] «Plan A · 1 sesión por semana: 4 sesiones; reevaluación intermedia Sesión 2 (semana 2); final Sesión 4; programa domiciliario: Alto: es la mayor parte de la carga del mes.»  
  ↳ **organización orientativa**
- [ ] «Maitland evalúa la respuesta a las 24–48 h y pide sesiones lo bastante frecuentes para valorar el efecto; con una por semana la comparación es semanal (Maitland 2005, cap. 9, p. 219 y tabla 9.3). Pedir al paciente que anote cómo estuvo a las 24 h de cada sesión y, si las molestias aumentan, qué estaba haciendo y qué le ayudó (Hengeveld y Banks 2005, cap. 9, p. 247).»  
  ↳ fuente en el texto (Maitland 2005, Hengeveld y Banks 2005)
- [ ] «Plan B · 2 sesiones por semana: 8 sesiones; reevaluación intermedia Sesión 4 (semana 2); final Sesión 8; programa domiciliario: Medio.»  
  ↳ **organización orientativa**
- [ ] «Con movilización neural vigorosa, dejar al menos 2–3 días entre sesiones y reevaluar a las 24 h (Maitland 2005, cap. 6, p. 149).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Discinesia escapular: el programa estándar de su pauta fueron 16 sesiones, 2 por semana durante 8 semanas (Kamonseki 2022), así que encaja con el plan B; con el plan A, el mes queda por debajo de lo estudiado.»  
  ↳ fuente en el texto (Kamonseki 2022)
- [ ] «Dolor radicular cervical agudo: su pauta fija 2 sesiones por semana durante 6 semanas (12 sesiones), así que encaja con el plan B; con el plan A, el mes queda por debajo de esa pauta (Kuijper 2009).»  
  ↳ fuente en el texto (Kuijper 2009)
- [ ] «Rigidez del codo: los ensayos de estiramientos de contracción-relajación de su pauta usaron de 2 a 7 sesiones por semana durante 3 a 6 semanas, y la intensidad óptima no se conoce (Wistow 2025); con el plan A, el mes queda por debajo de lo estudiado.»  
  ↳ fuente en el texto (Wistow 2025)
- [ ] «Apofisitis del adolescente: su pauta usa 4 visitas en 12 semanas, con los padres, y el resto del trabajo es en casa (Rathleff 2020); el plan A ya queda por encima de esas visitas, y el programa para casa es el que lleva la carga.»  
  ↳ fuente en el texto (Rathleff 2020)
- [ ] «Artrosis de cadera: la guía da de 1 a 5 sesiones de ejercicio por semana durante 5–16 semanas (A), y la terapia manual, de 1 a 3 veces por semana durante 6–12 semanas, siempre junto al ejercicio (Koc 2025): los dos planes caben en esos márgenes, y el mes es el comienzo de un programa más largo.»  
  ↳ fuente en el texto (Koc 2025)
- [ ] «Tendinopatía glútea: su pauta son 14 sesiones individuales en 8 semanas, casi 2 por semana, con la abducción contra resistencia en consulta 2 veces por semana (Mellor 2018), así que encaja con el plan B; con el plan A, el mes queda por debajo de esa pauta.»  
  ↳ fuente en el texto (Mellor 2018)
- [ ] «Tendinopatía proximal de isquiotibiales: su pauta usa 6 sesiones en 12 semanas (las semanas 0, 1, 2, 3, 6 y 12), así que el primer mes son 4, una por semana, como el plan A (Rich 2025).»  
  ↳ fuente en el texto (Rich 2025)
- [ ] «Lesión aguda de ingle: su pauta se hizo con sesiones individuales supervisadas, ofrecidas 5 días por semana (los ejercicios de ingle, 3 de ellos); las lesiones de grado 0–2 en la RM necesitaron una mediana de 10 sesiones en unas 2–4 semanas, y las de grado 3, de 40 (Serner 2020): incluso el plan B queda por debajo de lo estudiado.»  
  ↳ fuente en el texto (Serner 2020)
- [ ] «Dolor inguinal de larga evolución relacionado con el aductor: su pauta son 3 sesiones supervisadas por semana, de unos 90 min y en grupos de 2–4, durante 8–12 semanas, con el módulo I en casa los días intermedios (Hölmich 1999): incluso el plan B queda por debajo de esa pauta.»  
  ↳ fuente en el texto (Hölmich 1999)
- [ ] «Tendinopatía del tibial posterior: su pauta son 12 semanas de ejercicio en casa, dos veces al día, con una revisión semanal de 30 min durante 10 semanas (Kulig 2009), así que encaja con el plan A; el programa para casa es el que lleva la carga.»  
  ↳ fuente en el texto (Kulig 2009)
- [ ] «Inestabilidad crónica del tobillo: el protocolo concreto de su pauta son 12 sesiones supervisadas, 3 por semana durante 4 semanas (McKeon 2008): incluso el plan B queda por debajo de lo estudiado. La guía no fija una dosis (Martin 2021).»  
  ↳ fuente en el texto (Martin 2021, McKeon 2008)
- [ ] «Apofisitis del pie en crecimiento: su pauta, por analogía con la de Osgood-Schlatter, usa 4 visitas en 12 semanas, con los padres, y el resto del trabajo es en casa (Rathleff 2020); el plan A ya queda por encima de esas visitas, y el programa para casa es el que lleva la carga.»  
  ↳ fuente en el texto (Rathleff 2020)
- [ ] «Si la pauta trae su propio criterio de progresión, ese manda. Si no: al principio lo mínimo que no provoque recaída; reintroducir lo que agravaba cuando baje la irritabilidad; progresar al ritmo de la curación y de los síntomas; reevaluar dentro de la sesión y entre sesiones (Petersen 2021; Zusman 1998).»  
  ↳ fuente en el texto (Petersen 2021, Zusman 1998)
- [ ] «Terapia manual en una articulación periférica: empezar con un accesorio en posición indolora y apoyada; pasar a movimientos fisiológicos cuando el recorrido activo supere el 60 % del normal (con dolor y rigidez, el 60 % del recorrido rígido disponible) y, hasta el 75 %, quedarse antes del punto donde empieza el dolor; después, entrar en una molestia controlada (un 10–20 % de su intensidad máxima), y movimientos fisiológicos amplios cuando el dolor solo aparezca en el último 40 % del recorrido. Si no está claro si domina el dolor o la rigidez, tratar primero el dolor; con dudas al pasar a fisiológicos, repetir unas sesiones más los accesorios, y si empeora, volver a ellos (Hengeveld y Banks 2005, cap. 8, pp. 192–196 y 200).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)

Reglas de seguir o cambiar, columna:

- [ ] «Si una técnica no cambia nada, repetirla más firme; si sigue sin cambio, descartarla. Si mejora, repetirla; si empeora, no repetirla (Maitland 2005, cap. 9, pp. 213–214).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Si se espera una mejora lenta, no cambiar una técnica antes de usarla dos sesiones o más (Maitland 2005, cap. 9, pp. 214 y 216).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Con una mejora del 75 % o más en una sesión, no subir la dosis: esperar 48 h o repetir igual o menos (Maitland 2005, cap. 9, p. 216).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «La movilización que funciona debería mostrar una mejora marcada en 4–5 días (Maitland 2005, cap. 9, p. 220).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Sin cambio en 10–14 días, pausa y reevaluación a los 7–14 días; devolver al médico si los signos no siguen los patrones habituales o el paciente no mejora (Maitland 2005, cap. 9, pp. 219–220 y 223).»  
  ↳ fuente en el texto (Maitland 2005)

Reglas de seguir o cambiar, regiones periféricas:

- [ ] «Si mejora o no cambia, repetir la misma técnica; si empeora, la misma con menos amplitud y más lejos del dolor (Hengeveld y Banks 2005, cap. 8, p. 192).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «No cambiar una técnica demasiado pronto: puede hacer falta repetirla hasta la 2.ª visita, y a veces aplicarla dos veces antes de juzgarla (Hengeveld y Banks 2005, cap. 8, pp. 191 y 206).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Revisión retrospectiva cada 4 sesiones, y entre la 3.ª y la 4.ª sesión, un pronóstico explícito (Hengeveld y Banks 2005, cap. 5, p. 106; cap. 8, p. 233).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
- [ ] «Si se estanca, pausa de unas 2 semanas; si mejoró, 2–3 semanas más sin tratamiento o el alta; si sigue igual, 4–5 sesiones más y otra pausa (Hengeveld y Banks 2005, cap. 5, pp. 106–108; Maitland 2005, cap. 9, pp. 219–220). Devolver al médico si los signos no siguen los patrones habituales o el paciente no mejora (Maitland 2005, cap. 9, p. 223).»  
  ↳ fuente en el texto (Maitland 2005, Hengeveld y Banks 2005)
- [ ] «Con dolor radicular severo, la mejoría puede tardar 7–10 días en notarse (Maitland 2005, cap. 9, p. 217).»  
  ↳ fuente en el texto (Maitland 2005)

Qué comparar en las reevaluaciones intermedia y final (fuente: Hengeveld y Banks 2005, cap. 9, p. 246):

- [ ] «Bienestar general, comparado con unas sesiones antes»  
  ↳ fuente: Hengeveld y Banks 2005, cap. 9, p. 246
- [ ] «Síntomas y nivel de actividad, comparados»  
  ↳ fuente: Hengeveld y Banks 2005, cap. 9, p. 246
- [ ] «Efecto de cada intervención hasta ahora (exploración y movimientos pasivos)»  
  ↳ fuente: Hengeveld y Banks 2005, cap. 9, p. 246
- [ ] «Efecto de las indicaciones, recomendaciones y ejercicios»  
  ↳ fuente: Hengeveld y Banks 2005, cap. 9, p. 246
- [ ] «Qué ha aprendido el paciente y qué le ha sido más útil»  
  ↳ fuente: Hengeveld y Banks 2005, cap. 9, p. 246
- [ ] «Objetivos de la siguiente fase del tratamiento, acordados con el paciente»  
  ↳ fuente: Hengeveld y Banks 2005, cap. 9, p. 246

## 8. Hoja de registro de cada sesión

Fuente: Maitland 2005, cap. 9, tabla 9.3, p. 226; Hengeveld y Banks 2005, cap. 9, pp. 243 y 246.

- [ ] «Refiere el paciente: lo primero, su opinión sobre la sesión anterior, en sus palabras y comparada con antes»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3, p. 226; Hengeveld y Banks 2005, cap. 9, pp. 243 y 246
- [ ] «Signos: cambios en los signos marcados, también comparados con antes»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3, p. 226; Hengeveld y Banks 2005, cap. 9, pp. 243 y 246
- [ ] «Plan: técnica elegida y por qué»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3, p. 226; Hengeveld y Banks 2005, cap. 9, pp. 243 y 246
- [ ] «Tratamiento: posición del paciente y de la articulación, técnica (con su inclinación), nivel en la columna, grado, ritmo, duración (repeticiones o tiempo) y respuesta mientras se aplica»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3, p. 226; Hengeveld y Banks 2005, cap. 9, pp. 243 y 246
- [ ] «Después: lo que refiere el paciente y los signos»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3, p. 226; Hengeveld y Banks 2005, cap. 9, pp. 243 y 246
- [ ] «Indicaciones dadas: información, ejercicios y avisos»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3, p. 226; Hengeveld y Banks 2005, cap. 9, pp. 243 y 246
- [ ] «Para la siguiente sesión: qué cambiar y por qué»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3, p. 226; Hengeveld y Banks 2005, cap. 9, pp. 243 y 246
