# Fase 6 · Frases para revisar

> Generado por `node tests/gen-frases-plan.mjs` a partir de `data/plan-tratamiento.js` y `lib/plan-tratamiento.js`. No lo edites a mano: cambia el texto en `data/plan-tratamiento.js` y regenera (`tests/unit.js` falla si no está al día).

Cómo revisarlo: marca cada casilla que valga tal cual y anota debajo las que haya que cambiar. «Redacción propia» = la frase no sale de ninguna fuente leída; son las que más necesitan tu revisión. Las cifras y páginas citadas están comprobadas contra las fuentes leídas (notas en `docs/plan-tratamiento.md`, «Fuentes leídas», en el razonamiento de la pregunta `l6` para Finucane 2020, en el de `cv3` para Margetis y Donnally 2025 y en el de `cv_ar1` y `cv_ar2` para Rushton 2023, en el de `h_c4` para Goodman 2018, y en el de `co1` para Momodu y Savaliya 2023 y Pangia 2025).

Redacción propia: **1** frase.

## 1. Programa para casa (lo lee el paciente)

Va tal cual en «📤 Compartir → Programa para casa». «Qué hacer» y «Cuándo parar» los escribe el fisio (si «Cuándo parar» queda vacío, se usa la variable de control de la fase 5); lo que falte no sale, y compartir pide confirmación antes. «Cuándo hacerlo» y «Al día siguiente» usan las notas de la fase 5 si están rellenas. Las últimas frases (urgencias) son la red de seguridad de la región (sección 2): la neurológica solo con una hipótesis neurológica, la de siempre con cualquier plan de esa región. Con el plan bloqueado por una urgencia o una derivación no hay programa para casa.

- [ ] «PROGRAMA PARA CASA»  
  ↳ etiqueta  
  ↳ clave `titulo`
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
  ↳ fuente: Waheed 2023 (StatPearls, «Deep Venous Thrombosis») y NICE NG158, como en el razonamiento de r_v2: valoración médica en el día; Vyas 2024 (StatPearls, «Acute Pulmonary Embolism»), como en el de pq_tep: con falta de aire o dolor al respirar, 112; NICE NG89 pide explicar al paciente estos síntomas al alta tras una prótesis de rodilla  
  ↳ clave `alarmaTVP`
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
- [ ] Atrapamiento de un nervio periférico (sensibilidad y fuerza en su territorio al empezar cada sesión, `TEXTOS_SESION.reevaluacionNervio`; sin red de seguridad neurológica ni regla de días): `co8`, `co9`, `co13`, `ro19`.  
  ↳ **decisión de diseño** (decisión 65)
- [ ] `ce2` no cuenta como neurológica: Disfunción neuromuscular cervical: déficit de control motor (coordinación, propiocepción), no compromiso de la raíz ni de la médula.  
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
- [ ] Con `ce13`, la cantidad de terapia manual es la de su pauta: `TEXTOS_SESION.cantidadReid` (sección 6) en vez de la genérica.  
  ↳ **decisión de diseño** (decisión 41)
- [ ] Con `ce12` como hipótesis por defecto, el plan del mes empieza en B (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `co3` como hipótesis por defecto, el plan del mes empieza en B (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Con `ro15` como hipótesis por defecto, el plan del mes empieza en A (sección 7).  
  ↳ **decisión de diseño** (decisión 42)
- [ ] Avisos con `ce13`: `AVISOS.vertigo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ce3`: `AVISOS.manipulacionCervical` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ce12`: `AVISOS.manipulacionCervical`, `AVISOS.sinTerapiaManualAguda` (sección 5).  
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
- [ ] Con mecanismo Post-quirúrgico en una región periférica: `AVISOS.protesis` (sección 5).  
  ↳ **decisión de diseño** (decisión 47)
- [ ] Con mecanismo Post-quirúrgico en rodilla, además: `AVISOS.posqRodilla` (sección 5).  
  ↳ **decisión de diseño** (decisión 78)
- [ ] Familia de la terapia manual: columna (Maitland 2005) en lumbar y cervical; periférica (Hengeveld y Banks 2005) en hombro, codo, rodilla. Decide los escalones (sección 3), la cantidad por sesión (sección 6), la progresión y las reglas del mes (sección 7).  
  ↳ **decisión de diseño** (decisiones 43–46)
- [ ] `h6` usa la familia columna aunque su región sea periférica.  
  ↳ **decisión de diseño** (decisión 50)
- [ ] Con `h6`, además, cierre `cierreArterial` y casa `alarmaArterial`.  
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
- [ ] «A coincide con B: ya es el escalón más suave.»  
  ↳ describe la app (no afirma nada clínico)
- [ ] «Sin propuesta C: la irritabilidad no es baja (Petersen 2021; Maitland 2005, cap. 6, p. 117).»  
  ↳ fuente en el texto (Petersen 2021, Maitland 2005)
- [ ] «Sin propuesta C: los síntomas empeoran. Tratamiento suave y evaluación en cada sesión (Maitland 2005, cap. 6, pp. 101 y 107, que lo dice de los síntomas que varían mucho de un día a otro).»  
  ↳ fuente en el texto (Maitland 2005)

## 5. Avisos de la fase

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
- [ ] «La fase 3 calcula la irritabilidad con toda la matriz, que incluye ítems de gravedad (dolor y discapacidad); aquí solo cuentan reposo, movimiento y tolerancia.»  
  ↳ decisión 25 de docs/plan-tratamiento.md
- [ ] «Irritabilidad estimada (elegida directamente, sin la matriz).»  
  ↳ decisión 12 de docs/plan-tratamiento.md
- [ ] «Hipótesis de trabajo, pendiente de confirmar: no tiene ningún test hecho.»  
  ↳ describe la app (no afirma nada clínico)
- [ ] «Dos hipótesis: la intervención principal se reparte entre ambas y el tiempo de cada una baja.»  
  ↳ decisión 10 de docs/plan-tratamiento.md
- [ ] «No usar ninguna técnica cervical que produzca mareo; probar antes con movimientos exploratorios (Maitland 2005, cap. 9, p. 224).»  
  ↳ fuente en el texto (Maitland 2005)
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
- [ ] «Artrosis glenohumeral: mejor solo con movimientos accesorios; el posteroanterior, con la mayor amplitud posible (grado II o III); tras una reagudización, grado I al principio, con el objetivo de llegar a III− o III+ en todo el recorrido sin dolor; los fisiológicos de grado II también pueden servir (Hengeveld y Banks 2005, cap. 11, cuadro 11.11, p. 345). En una articulación con artrosis, grados II o III− también cuando lo que se trata es otra estructura (cap. 8, p. 224).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
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
- [ ] «Atrapamiento de un nervio en el codo: los escalones se refieren a la articulación. Para el nervio, movilizar las interfases que lo rodean y recuperar su deslizamiento y su tensión (Butler 2000, citado en Hengeveld y Banks 2005, cap. 12, p. 371); el anteroposterior y el longitudinal caudal de la cabeza del radio sirven como movilización de la interfase de un nervio radial mecanosensible (pp. 387–388). Los signos neurológicos se exploran pronto y no se empeoran con pruebas vigorosas (cap. 6, p. 158).»  
  ↳ fuente en el texto (Hengeveld y Banks 2005)
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
- [ ] «Dolor radicular cervical agudo: su pauta fija 2 sesiones por semana durante 6 semanas (12 sesiones), así que encaja con el plan B; con el plan A, el mes queda por debajo de esa pauta (Kuijper 2009).»  
  ↳ fuente en el texto (Kuijper 2009)
- [ ] «Rigidez del codo: los ensayos de estiramientos de contracción-relajación de su pauta usaron de 2 a 7 sesiones por semana durante 3 a 6 semanas, y la intensidad óptima no se conoce (Wistow 2025); con el plan A, el mes queda por debajo de lo estudiado.»  
  ↳ fuente en el texto (Wistow 2025)
- [ ] «Apofisitis del adolescente: su pauta usa 4 visitas en 12 semanas, con los padres, y el resto del trabajo es en casa (Rathleff 2020); el plan A ya queda por encima de esas visitas, y el programa para casa es el que lleva la carga.»  
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
