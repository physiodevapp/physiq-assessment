# Fase 6 · Frases para revisar

> Generado por `node tests/gen-frases-plan.mjs` a partir de `data/plan-tratamiento.js` y `lib/plan-tratamiento.js`. No lo edites a mano: cambia el texto en `data/plan-tratamiento.js` y regenera (`tests/unit.js` falla si no está al día).

Cómo revisarlo: marca cada casilla que valga tal cual y anota debajo las que haya que cambiar. «Redacción propia» = la frase no sale de ninguna fuente leída; son las que más necesitan tu revisión. Las cifras y páginas citadas están comprobadas contra las fuentes leídas (notas en `docs/plan-tratamiento.md`, «Fuentes leídas», en el razonamiento de la pregunta `l6` para Finucane 2020, en el de `cv3` para Margetis y Donnally 2025 y en el de `cv_ar1` y `cv_ar2` para Rushton 2023).

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
  ↳ fuente: Maitland 2005, cap. 9, p. 219  
  ↳ clave `primeraSesion`
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
- [ ] `ce2` no cuenta como neurológica: Disfunción neuromuscular cervical: déficit de control motor (coordinación, propiocepción), no compromiso de la raíz ni de la médula.  
  ↳ **decisión de diseño**
- [ ] Red de seguridad de lumbar: con una hipótesis neurológica, cierre `cierreNeuro` y casa `alarmaNeuro`.  
  ↳ **decisión de diseño** (los textos, con su fuente, en las secciones 1 y 6)
- [ ] Red de seguridad de cervical: con una hipótesis neurológica, cierre `cierreMedula` y casa `alarmaMedula`; con cualquier plan de la región, cierre `cierreArterial` y casa `alarmaArterial`.  
  ↳ **decisión de diseño** (los textos, con su fuente, en las secciones 1 y 6)
- [ ] Avisos con `ce13`: `AVISOS.vertigo` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ce3`: `AVISOS.manipulacionCervical` (sección 5).  
  ↳ **decisión de diseño**
- [ ] Avisos con `ce12`: `AVISOS.manipulacionCervical`, `AVISOS.sinTerapiaManualAguda` (sección 5).  
  ↳ **decisión de diseño**

## 3. Escalones de terapia manual

- [ ] «1 · Muy suave (Manda el dolor): Sin provocar dolor: posición cómoda y sin molestias, la mayor amplitud posible sin molestia, movimiento lento y suave (grados I y II). Corta al principio, hasta conocer la respuesta a las 48 h. Explorar solo hasta el límite activo.»  
  ↳ fuente: Maitland 2005, cap. 8, p. 203; cap. 9, p. 218 · Petersen 2021, tabla 2 y apartado de irritabilidad
- [ ] «2 · Suave (Manda el dolor): Hasta donde empieza el dolor, sin sobrepasarlo (grado II); cuando el dolor baje, grado III. Con prudencia al acercarse al dolor, por el riesgo de que tarde en ceder.»  
  ↳ fuente: Maitland 2005, cap. 6, p. 101; cap. 9, p. 218 · Petersen 2021, apartado de irritabilidad
- [ ] «3 · Moderada (Molestia controlada): Hasta una molestia controlada que no aumente mientras se aplica la técnica (grado III); si lo que se provoca cede enseguida, hasta el límite pasivo. Primero la misma técnica a la misma velocidad hacia la molestia; después, la posición hacia la dirección dolorosa.»  
  ↳ fuente: Maitland 2005, cap. 8, pp. 206–208 · Petersen 2021, apartado de irritabilidad
- [ ] «4 · Firme (Manda la rigidez): Solo si domina la rigidez y las estructuras no están debilitadas por un traumatismo o una enfermedad: al final del recorrido, técnica firme (grado IV), amplitud sobre todo pequeña con alguna grande, intercalando movimientos activos. Respetar la molestia, sobre todo si se va sumando; un grado III suave alivia la que deje.»  
  ↳ fuente: Maitland 2005, cap. 8, p. 203; cap. 9, p. 218

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
- [ ] «Cómo reaccionó a la sesión anterior, en sus palabras y comparado con antes («D más 1», Maitland 2005, cap. 6, p. 156; cap. 9, tabla 9.3).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Exploración neurológica al empezar; si empeora, comunicarlo al médico (Maitland 2005, cap. 6, p. 136).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Explicar la hipótesis y el plan, y lo que puede notar.»  
  ↳ organización de la sesión (orientativa, editable; no evidencia)
- [ ] «Avisar de un posible aumento temporal de los síntomas tras esta primera sesión (Maitland 2005, cap. 9, p. 219).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Primera sesión: menos tratamiento que en las siguientes, porque el primer estiramiento provoca más reacción (Maitland 2005, cap. 9, p. 219).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Evaluar antes, durante y después de cada técnica; unas 3–4 movilizaciones de unos 30 s por articulación, la mitad si duele mucho (Maitland 2005, cap. 9, pp. 213, 216 y 219).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Enseñar y comprobar lo que hará en casa.»  
  ↳ organización de la sesión (orientativa, editable; no evidencia)
- [ ] «Reevaluar el signo comparable y explicar qué vigilar hasta la próxima sesión (Maitland 2005, cap. 9, p. 213 y tabla 9.3, «Después»).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Red de seguridad: explicar qué síntomas exigen ir a urgencias (adormecimiento entre las piernas o alrededor del ano, cambios al orinar o al hacer de vientre) y comprobar que lo ha entendido (Finucane 2020, sección 2, pp. 9–17).»  
  ↳ fuente en el texto (Finucane 2020)
- [ ] «Red de seguridad: explicar qué síntomas exigen ir a urgencias (torpeza nueva en las manos, inestabilidad o piernas «pesadas» al caminar, cambios al orinar o al hacer de vientre) y comprobar que lo ha entendido (Margetis y Donnally 2025, anamnesis y exploración).»  
  ↳ fuente en el texto (Margetis y Donnally 2025)
- [ ] «Red de seguridad: explicar qué síntomas exigen ir a urgencias (dolor de cabeza o de cuello de golpe y distinto a cualquier otro, visión doble, dificultad para hablar o tragar, inestabilidad al caminar o caídas súbitas) y comprobar que lo ha entendido; los de una disección pueden llegar días después (Rushton 2023, tablas 1–2 y 6, pp. 9–12).»  
  ↳ fuente en el texto (Rushton 2023)

## 7. Plan de un mes

- [ ] «Plan A · 1 sesión por semana: 4 sesiones; reevaluación intermedia Sesión 2 (semana 2); final Sesión 4; programa domiciliario: Alto: es la mayor parte de la carga del mes.»  
  ↳ **organización orientativa**
- [ ] «Maitland evalúa la respuesta a las 24–48 h y pide sesiones lo bastante frecuentes para valorar el efecto; con una por semana la comparación es semanal (Maitland 2005, cap. 9, p. 219 y tabla 9.3). Pedir al paciente que anote cómo estuvo a las 24 h de cada sesión.»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Plan B · 2 sesiones por semana: 8 sesiones; reevaluación intermedia Sesión 4 (semana 2); final Sesión 8; programa domiciliario: Medio.»  
  ↳ **organización orientativa**
- [ ] «Con movilización neural vigorosa, dejar al menos 2–3 días entre sesiones y reevaluar a las 24 h (Maitland 2005, cap. 6, p. 149).»  
  ↳ fuente en el texto (Maitland 2005)
- [ ] «Si la pauta trae su propio criterio de progresión, ese manda. Si no: al principio lo mínimo que no provoque recaída; reintroducir lo que agravaba cuando baje la irritabilidad; progresar al ritmo de la curación y de los síntomas; reevaluar dentro de la sesión y entre sesiones (Petersen 2021; Zusman 1998).»  
  ↳ fuente en el texto (Petersen 2021, Zusman 1998)
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
- [ ] «Con dolor radicular severo, la mejoría puede tardar 7–10 días en notarse (Maitland 2005, cap. 9, p. 217).»  
  ↳ fuente en el texto (Maitland 2005)

## 8. Hoja de registro de cada sesión

Fuente: Maitland 2005, cap. 9, tabla 9.3, p. 226.

- [ ] «Refiere el paciente: cambios desde la sesión anterior, en sus palabras y comparados con antes»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3
- [ ] «Signos: cambios en los signos marcados»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3
- [ ] «Plan: técnica elegida y por qué»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3
- [ ] «Tratamiento: técnica, grado, nivel, repeticiones y efecto mientras se aplica»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3
- [ ] «Después: lo que refiere el paciente y los signos»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3
- [ ] «Para la siguiente sesión: qué cambiar y por qué»  
  ↳ fuente: Maitland 2005, cap. 9, tabla 9.3
