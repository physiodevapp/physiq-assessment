# Fase 6 «Plan de tratamiento» — diseño

Estado: **L2 implementado y revisado por el usuario** (2026-10): la parte sin IA, solo en lumbar (piloto), como fase 6 opcional de la navegación. Código: `plan.js` (interfaz), `lib/plan-tratamiento.js` (funciones puras, con tests), `data/plan-tratamiento.js` (textos y fuentes). Tras la primera revisión se tomaron las decisiones 25–29, y tras revisar las frases de redacción propia, las 30–34 (abajo). Todas las frases de la fase, con su fuente o su tipo, están en `docs/plan-tratamiento-frases.md` (se regenera con `node tests/gen-frases-plan.mjs` y `tests/unit.js` falla si no está al día); el usuario las revisó y confirmó que, sin protocolo del cirujano, la fase 6 se comporta como la fase 5. La fase 6 nunca entra en el payload, las Notas ni el Informe, y a physiq-report se le anuncia como mucho la fase 5. L3–L5 sin empezar. Seguimiento en `MIGRATION_PLAN.md`, **Fase L**.

Qué es: una fase nueva tras los resultados (fase 5) que propone **una sesión de 50 minutos a tres niveles de carga** y **un plan de un mes** en dos variantes: **A**, 1 sesión por semana, y **B**, 2 sesiones por semana. Tiene una parte sin IA, construida con lo que la app ya sabe, y una capa opcional con IA que la detalla.

## Decisiones tomadas (2026-10)

1. **Las tres propuestas de sesión son la misma pauta a tres niveles de carga**, no tres enfoques distintos. **A** queda un escalón por debajo de lo que permiten la gravedad y la irritabilidad, **B** se ajusta a ellas y **C** sube un escalón. **C solo se genera con irritabilidad baja**; si no, la fase dice por qué (precisado por las decisiones 11–15). Diferenciar por enfoque (manual / activo / educación) obligaría a proponer abordajes que la pauta citada no cubre.
2. **Fase 6 con una parte sin IA, más una capa de IA opcional.** La parte sin IA (esqueleto de sesión y de mes) funciona también en el hub, sin licencia ni coste, y es comprobable con tests unitarios. La IA («✨ Detallar con IA») solo funciona en standalone y rellena huecos dentro de ese marco, nunca lo cambia.
3. **Lector: el fisio.** El plan de sesión y el del mes son para el fisio (lenguaje técnico, criterios de progresión, fuentes). La única salida para el paciente es el **programa domiciliario**, en lenguaje llano, como ya se separan `📄 Informe` y `📋 Notas`.
4. **La IA lee los datos, nunca el texto del informe IA.** Recibe el payload, los datos ampliados (`construirAmpliado()`) y, si existe, la **transcripción** ya guardada en `state.informeIA.transcripcion`. El informe es información de segunda mano: las revisiones (rondas 1–29, `docs/informe-ia.md`) encontraron lados, NRS y frecuencias inventados, y planificar sobre él los propagaría. Reusar la transcripción además evita volver a mandar el audio a Whisper.
5. **Con una derivación sin resolver no hay plan.** Ver «Bloqueos», abajo.
6. **Los modificadores por irritabilidad y los criterios de progresión genéricos solo se escriben desde una fuente leída**, que aporta el usuario (como los capítulos de Lluch 2020). Candidatas: el concepto de irritabilidad de Maitland y sus revisiones (p. ej. Barakatt 2009) y el marco SINSS; ninguna está hoy en `data/referencias.js`. Leídas Petersen 2021, Barakatt 2009 (×2), Zusman 1998 y Silbernagel 2007 (ver «Fuentes leídas»); con ellas se tomaron las decisiones 11–15, y L2 ya no está bloqueada.
7. **Hipótesis sin pauta (49 de 126).** Fase 6 da la estructura (bloques, reevaluación, PROM, pronóstico), pero la intervención dice «Pauta a criterio del fisio», y la IA tampoco la rellena. Es lo coherente con «nunca inventar una dosis».
8. **Volumen concreto propuesto por la IA cuando la guía no lo fija** (series, repeticiones, minutos): permitido solo como «Sugerencia de la IA, sin fuente en PhysiQ», visualmente separado de la pauta citada. El programa domiciliario no se puede compartir hasta marcar sus puntos de revisión como revisados.
9. **Fuera del payload y de physiq-report en la primera versión.** Se decide cuando el plan se haya usado en consulta.
10. **Una hipótesis por plan por defecto, y una segunda opcional.** Con dos, la intervención principal se reparte entre ambas y el plan avisa de que el tiempo por hipótesis baja.
11. **Los niveles dependen de gravedad × irritabilidad** (Petersen 2021). B toma el vigor y la extensión que SINSS da a esa combinación; A, un escalón menos; C, un escalón más, y **solo con irritabilidad baja** (con gravedad alta e irritabilidad baja SINSS permite llegar al límite pasivo, porque lo provocado cede rápido; con irritabilidad alta pide prudencia).
12. **La matriz de irritabilidad de la fase 3 no se toca ahora**: está en el piloto y su nivel va al payload (`ir`) y a physiq-report. Fase 6 separa las dos dimensiones solo para sí: **gravedad** = NRS de la fase 3 con los cortes de SINSS (0–3 / 4–7 / 8–10); **irritabilidad** = solo los ítems de la matriz que la miden (dolor en reposo, movimiento, tolerancia). Con el nivel elegido directamente (modo breve) o sin NRS, usa lo que haya y lo marca «estimado». El fisio ve las dos y puede cambiarlas. Revisar la matriz (sus cortes de NRS no son los de SINSS) es una tarea aparte.
13. **El miedo al movimiento no bloquea C**: con miedo «Sí» o riesgo psicosocial alto, fase 6 muestra un recordatorio de bandera amarilla (SINSS la incluye en «Naturaleza») y C sigue disponible. Lo leído no dice que haya que bajar la carga por el miedo; Zusman 1998 advierte, al contrario, contra confundir la prudencia del concepto de irritabilidad con una desconfianza indebida hacia el movimiento.
14. **Criterio de progresión**: el de la pauta de la hipótesis cuando lo trae (p. ej. una de cadera: hasta 4/10 durante la actividad y sin subir más de 2/10 a las 12–24 h, `data/cadera.js`; una de rodilla: ≤ 2/10 durante la actividad y a la mañana siguiente, `data/rodilla.js`); si no, el genérico de SINSS y Zusman: al principio lo mínimo que no recaiga, reintroducir lo que agravaba cuando baja la irritabilidad, progresar al ritmo de la curación y de los síntomas, y reevaluar dentro de la sesión y entre sesiones. El modelo de monitorización del dolor (Silbernagel 2007) **no** se usa como genérico: se estudió en tendinopatía aquílea de porción media; solo podría ofrecerse en tendinopatías cuya pauta no traiga criterio, y como lo que es.
15. **El nivel es orientativo**: fase 6 dice que el juicio de irritabilidad varía entre fisioterapeutas (Barakatt 2009: acuerdo del 71 %, kappa 0,39–0,44) y deja cambiar gravedad e irritabilidad.

## Punto de partida (medido en el código, 2026-10)

| Región | Hipótesis | Con pauta (`dosis` + `dosisFuente`) | Pauta vacía (`''`) | `DOSIS_DERIVAR` | Con `pronostico` |
|---|---|---|---|---|---|
| Hombro | 11 | 5 | 5 | 1 | 7 |
| Cadera | 19 | 9 | 10 | 0 | 12 |
| Cervical | 14 | 12 | 1 | 1 | 6 |
| Lumbar | 9 | 9 | 0 | 0 | 6 |
| Rodilla | 20 | 11 | 8 | 1 | 17 |
| Codo | 16 | 8 | 5 | 3 | 1 |
| Tobillo y pie | 37 | 9 | 20 | 8 | 34 |
| **Total** | **126** | **63** | **49** | **14** | **83** |

Tres consecuencias para el diseño:

- **Solo la mitad de las hipótesis tiene pauta.** En las 49 con `dosis: ''` la app ya dice que la pauta es decisión del fisio, y fase 6 no puede ser la puerta trasera que la invente (decisión 7).
- **Las pautas con fuente casi nunca fijan el volumen.** Las de lumbar, por ejemplo, terminan en «Ninguna fuente fija repeticiones… el volumen queda a criterio del clínico». Por eso los tres niveles de carga **no pueden ser números calculados** a partir de la pauta: son modificadores cualitativos de la misma pauta (ver «Sesión de 50 minutos»).
- **Lumbar es el piloto natural**: 9 de 9 hipótesis con pauta citada, y ya fue la región de referencia en Fase D y Fase I.

## Principios

1. **La seguridad manda sobre el plan.** Urgencias de fase 2 (`ur`), derivaciones del árbol (`dv`) sin resolver e hipótesis `DOSIS_DERIVAR` no marcadas como tratadas bloquean el plan. Fase 6 nunca rebaja ni oculta un aviso de las fases anteriores.
2. **Nada sin fuente se presenta como si la tuviera.** Lo que viene de la pauta citada se distingue siempre de lo que es organización de la sesión (orientativo, editable) y de lo que propone la IA (sugerencia, para revisar).
3. **El protocolo del cirujano manda** (mismo principio que `docs/posquirurgico.md`). Con mecanismo Post-quirúrgico, el plan sigue a `pq1` y las restricciones, con los mismos textos que la fase 5 (`lib/posquirurgico.js`): sin protocolo, «Restricciones pendientes de confirmar con el cirujano.»; con él, «Solo si es compatible con el protocolo del cirujano…» (decisión 31: como en la fase 5, las pautas de las demás hipótesis se muestran con ese aviso delante).
4. **Es una propuesta, no una prescripción.** El fisio elige, edita y firma. Proponer tratamiento va un paso más allá que redactar un informe, y la interfaz lo dice.
5. **Fuera del payload en la primera versión.** Ni `buildPhysiQPayload()`, ni `📋 Notas`, ni `📄 Informe` cambian. physiq-report no sabe nada de fase 6 (decisión 9).

## Flujo

### Entrada a la fase 6
- Botón «Plan de tratamiento →» en la barra inferior de fase 5, junto a «📤 Compartir». La fase no es obligatoria: la valoración está completa en fase 5.
- Nueva entrada en `PHASE_DEFS` (`{ n: 6, label: 'Plan de tratamiento', short: 'Fase 6' }`), `goToPhase(6)`, barra de fases y hoja móvil. `navStepClick` solo deja entrar con `resultsBuilt`.
- **Hipótesis a tratar**: el fisio elige una (y opcionalmente una segunda). Por defecto, la de mayor peso que no esté marcada como tratada ni sea `DOSIS_DERIVAR`. Con mecanismo Post-quirúrgico, `pq1` va primero (`hipotesisActivas()`).

### Bloqueos (antes que cualquier plan)
| Situación | Qué muestra fase 6 |
|---|---|
| Alguna urgencia de fase 2 (`ur`) | Alerta roja y **ningún plan**: «Derivación urgente pendiente» |
| Derivación del árbol (`dv`) sin marcar como resuelta | Alerta y ningún plan hasta resolverla |
| Hipótesis elegida con `DOSIS_DERIVAR` sin «Ya diagnosticada y tratada» | No se puede elegir; se explica por qué |
| Post-quirúrgico sin protocolo (`conProtocolo()` falso) | Plan solo con estructura genérica + «Restricciones pendientes de confirmar con el cirujano» |
| Modo breve con la hipótesis sin ningún test pos/neg | Plan permitido, con «Hipótesis de trabajo, pendiente de confirmar» arriba |

### Sesión de 50 minutos (parte sin IA)
Una plantilla por bloques, **orientativa y editable** (es organización de la sesión, no evidencia):

| Bloque | Minutos | Contenido |
|---|---|---|
| Reevaluación | 0–5 | Signo comparable (`signoComparable`), NRS |
| Educación | 5–12 | Lo que dice la pauta sobre información y autocuidado; con miedo al movimiento, más peso aquí |
| Intervención principal | 12–35 | La pauta de la hipótesis (`dosisRamas` → rama que encaja, si no `dosis` entera), con su `dosisFuente` |
| Programa domiciliario | 35–45 | Enseñar y comprobar lo que el paciente hará en casa |
| Cierre | 45–50 | Reevaluar el signo comparable, explicar qué vigilar hasta la próxima sesión |

Los tres niveles se construyen así, todos sobre la misma pauta:

| | Cuándo se genera | Modificador |
|---|---|---|
| **A — por debajo** | Siempre | Un escalón menos de vigor y extensión que B; más tiempo de educación |
| **B — ajustada** | Siempre | El vigor y la extensión que SINSS da a la gravedad × irritabilidad del paciente (decisión 11) |
| **C — por encima** | Solo con irritabilidad baja (decisión 11; el miedo al movimiento no la bloquea, decisión 13) | Un escalón más |

Escalones de vigor y extensión (Petersen 2021; cualitativos, ninguna fuente da minutos, series ni cargas): gravedad e irritabilidad altas → solo hasta el límite activo, muy limitado; gravedad alta e irritabilidad baja → hasta el límite pasivo; gravedad baja e irritabilidad alta → prudencia al acercarse al dolor; las dos bajas → más agresivo, sin exacerbaciones innecesarias. Al principio se evita lo que agrava (Petersen 2021) y se empieza por lo mínimo que no provoque recaída (Zusman 1998). Hoy la fase 3 ya muestra un texto por nivel («Proceder con precaución. Evitar técnicas de alta intensidad…»); fase 6 no debe reutilizarlo sin comprobar de dónde sale.

### Plan de un mes (parte sin IA)
| | Plan A — 1 sesión/semana | Plan B — 2 sesiones/semana |
|---|---|---|
| Sesiones | 4 | 8 |
| Reevaluación intermedia | Sesión 2 (semana 2) | Sesión 4 (semana 2) |
| Reevaluación final | Sesión 4, con el PROM de la hipótesis (`prom`) | Sesión 8, con el mismo PROM |
| Peso del programa domiciliario | Alto: es la mayor parte de la carga del mes | Medio |

- **Progresión por criterios, no por fechas** (decisión 14): el de la pauta si lo trae; si no, el genérico de SINSS y Zusman.
- **Pronóstico**: si `pronostico.horizonte` pasa de 4 semanas, el plan dice que es el primer mes de un proceso más largo. `pronostico.derivacion` («Cuándo reconsiderar o derivar») va a la reevaluación final como criterio explícito.
- **Post-quirúrgico**: el mes se sitúa en las semanas desde la cirugía (`semanasCirugia()`) y no adelanta nada que el protocolo no permita.

### Capa de IA (opcional, solo standalone)
- Botón «✨ Detallar con IA» en fase 6, con la misma licencia (`lib/licencia-ia.js`), Turnstile, streaming y errores legibles que «🎙 Informe con IA».
- **Entrada**: payload + datos ampliados + hipótesis elegida con su pauta, rama y fuente + el esqueleto ya construido + transcripción si existe. Si la valoración cambió después de generar el informe (la `huella` no coincide), se avisa de que la transcripción puede no corresponder.
- **Salida**: las tres sesiones con ejercicios concretos dentro de cada bloque, el mes A/B con su progresión y el programa domiciliario en lenguaje del paciente.
- **Reglas del prompt** (punto de partida, se ampliarán con revisiones reales como en `docs/informe-ia.md`): no cambiar el esqueleto ni los bloqueos; no atribuir a una fuente nada que no esté en la pauta; separar lo que es pauta citada de lo que es sugerencia propia; respetar restricciones del protocolo; con irritabilidad alta, nada de alta intensidad; no generar C si el esqueleto no la tiene.
- **Revisión automática** (como `lib/revision-informe.js`): puntos a revisar cuando el texto nombra fuentes que la pauta no cita, propone carga alta con irritabilidad alta, contradice una restricción, cambia lado/edad/sexo o planifica una hipótesis bloqueada. Cada regla, con el caso real que la motivó.
- **Worker**: hace falta una ruta o plantilla nueva en el worker de physiq-report (`workers/`), que no está en este repo. Sin audio no hay coste de Whisper.

### Compartir
Fase 6 tiene su propio «📤 Compartir» en la barra inferior, con el mismo patrón que fase 5 (hoja en móvil, diálogo centrado en escritorio): «Plan de sesión», «Plan del mes» (fisio) y «Programa domiciliario» (paciente). Con la capa de IA, el programa domiciliario muestra los puntos de revisión sin marcar, como «Informe clínico (IA)».

## Fuentes leídas para la decisión 6 (2026-10)

Leídas enteras desde PubMed Central (página del artículo; la API de texto completo no lo permite para esta revista). Aún no están en `data/referencias.js`: se añadirán cuando `data/` las cite, porque el test de referencias rechaza entradas que nada cita.

**Petersen, Thurmond y Jensen 2021.** *Severity, Irritability, Nature, Stage, and Stability (SINSS): A clinical perspective.* J Man Manip Ther 29(5):297–309. [PMC8491699](https://pmc.ncbi.nlm.nih.gov/articles/PMC8491699/) · DOI [10.1080/10669817.2021.1919284](https://doi.org/10.1080/10669817.2021.1919284). Tipo: perspectiva clínica (opinión experta con viñetas), no un estudio.
- SINSS sirve para decidir el **vigor** (fuerza o intensidad y complejidad de la técnica) y la **extensión** (profundidad en la resistencia, número de movimientos, magnitud) de la exploración y de la intervención, para no quedarse corto ni pasarse (tabla 2 y texto).
- **Gravedad e irritabilidad se combinan**, no se usa la irritabilidad sola. Cuatro combinaciones: gravedad alta + irritabilidad alta → solo hasta el límite activo; gravedad alta + irritabilidad baja → se puede llegar al límite pasivo, porque lo que se provoca cede rápido; gravedad baja + irritabilidad alta → prudencia al acercarse al límite de dolor, por el riesgo de exacerbación prolongada o dolor latente; las dos bajas → exploración y tratamiento más agresivos, evitando exacerbaciones innecesarias.
- Irritabilidad en tres niveles por la razón entre actividad que agrava y actividad o reposo que alivia: mínima ≥ 2:1, moderada 1:1, máxima ≥ 1:2 (con sueño: vuelve a dormirse en < 30 min en la moderada, > 30 min o con medicación en la máxima).
- Gravedad en tres niveles: mínima NRS 0–3, moderada 4–7, máxima 8–10, más impacto en las AVD, medicación y dolor nocturno.
- Intervención: al principio, evitar posiciones o actividades que agraven; empezar el movimiento respetando la curación sin provocar síntomas innecesariamente; **reintroducir lo que agravaba cuando baja la irritabilidad**. Reevaluar la respuesta dentro de cada sesión y entre sesiones (estabilidad); si no cambia, retroceder si el tejido sigue inflamado o progresar si la mejora se ha estancado.
- Estadio con otros cortes que la app: agudo < 3 semanas, subagudo 3–6, crónico > 6 (la app usa < 6 semanas y > 3 meses).

**Barakatt, Romano, Riddle, Beckett y Kravitz 2009.** *An Exploration of Maitland's Concept of Pain Irritability in Patients with Low Back Pain.* J Man Manip Ther 17(4):196–205. [PMC2813500](https://pmc.ncbi.nlm.nih.gov/articles/PMC2813500/) · DOI [10.1179/106698109791352175](https://doi.org/10.1179/106698109791352175). Transversal, 183 pacientes con lumbalgia, 27 fisios.
- Maitland: con dolor irritable, limitar el vigor de la exploración y de los ejercicios iniciales, para no exacerbar mientras se maximiza la movilidad.
- Lo que hicieron los fisios (descriptivo, no comparación de eficacia): con lumbalgia irritable dieron más terapia manual y menos ejercicio activo y estiramientos (aguda y crónica), y en la aguda más McKenzie y más agentes físicos. Sin diferencias en ejercicio con material, aeróbico ni ergonomía.
- **No está demostrado que juzgar la irritabilidad mejore los resultados** (texto de los autores). El Roland-Morris, los síntomas distales y la tolerancia a la flexión se asociaron con el juicio de irritabilidad.

**Barakatt, Romano, Riddle y Beckett 2009.** *The Reliability of Maitland's Irritability Judgments in Patients with Low Back Pain.* J Man Manip Ther 17(3):135–40. [PMC2762835](https://pmc.ncbi.nlm.nih.gov/articles/PMC2762835/) · DOI [10.1179/jmt.2009.17.3.135](https://doi.org/10.1179/jmt.2009.17.3.135). 80 pacientes, dos fisios cada uno.
- Acuerdo del 71 %, kappa 0,39 (todos) y 0,44 en los 48 cuyo dolor no cambió entre exploraciones (PABAK 0,43 y 0,50): fiabilidad entre baja y moderada. La irritabilidad es un juicio con margen.

**Zusman 1998.** *Irritability.* Man Ther 3(4):195–202 (PDF del usuario, leído entero). Revisión narrativa de los mecanismos, casi todos de ciencia básica y modelos animales.
- Definición operativa de Maitland (1977): una presentación irritable es aquella en la que muy poca actividad causa un dolor considerable que tarda mucho en ceder (p. 195).
- Estrategia: empezar con una intervención mínima que no provoque recaída inmediata ni posterior, y después ampliar con cuidado los parámetros del movimiento (carga tensil graduada), en gran parte por ensayo y error (p. 195).
- Advierte de no confundir esa gradación con una desconfianza indebida hacia el movimiento, la del «deja que el dolor te guíe» (p. 196).
- Mecanismos: sensibilización química periférica (inflamación no neurógena y neurógena) y central; el estímulo mecánico puede aumentar la inflamación y el dolor, a veces con retraso (pp. 195–200).
- El SDRC/CRPS-1 es «extremadamente irritable»: un estudio vio que el ejercicio activo empeoró todas sus variables (Veldman 1993, citado en p. 199). Relevante para `pq_sdrc` (cribado posquirúrgico).
- Conclusión: en la irritabilidad «aguda», al principio retener todo salvo lo esencial e introducir el movimiento progresivamente al ritmo de la curación y del descenso de los síntomas; la irritabilidad «estructural» (lesión de nervio periférico) tiene otra historia natural (pp. 200–201).

**Silbernagel, Thomeé, Eriksson y Karlsson 2007.** *Continued sports activity, using a pain-monitoring model, during rehabilitation in patients with Achilles tendinopathy: a randomized controlled study.* Am J Sports Med 35(6):897–906, DOI [10.1177/0363546506298279](https://doi.org/10.1177/0363546506298279) (PDF del usuario, leído entero). Ensayo aleatorizado, n = 38 (51 tendones), tendinopatía aquílea de porción media de más de 2 meses; se excluyó la insercional.
- Modelo de monitorización del dolor (de Thomeé 1997, modificado): durante el ejercicio, dolor hasta 5/10 (EVA); después, hasta 5/10 pero desaparecido a la mañana siguiente; dolor y rigidez sin aumentar de semana en semana (p. 899).
- Seguir corriendo y saltando con ese modelo no fue peor que el reposo activo durante 6 semanas; los dos grupos mejoraron igual (VISA-A-S 57 → 85 y 57 → 91 a 12 meses). «No se demostraron efectos negativos»: no prueba que sea mejor (pp. 897, 902).
- Programa común: ejercicios diarios por fases (1–2, 2–5, 3–12 semanas y hasta 6 meses), con series y repeticiones en la tabla 3.

**Maitland's Vertebral Manipulation, 7.ª ed., cap. 6 «Examination», pp. 97–170** (con una contribución de B. C. Edwards; PDF del capítulo aportado por el usuario, leído entero; el prefacio lo firman Hengeveld y Banks; confirmar autores y año en la portada antes de registrarlo). Libro de texto, opinión experta.
- Irritabilidad: poca actividad que causa mucho dolor que tarda en calmarse. Se valora con tres datos ligados a una actividad concreta: el vigor de la actividad que lo provoca, cuánto aumentan los síntomas y cuánto tardan en volver a su nivel previo (pp. 117, 101). Ejemplo de la plancha: si media hora de planchar obliga a parar pero el dolor cede en media hora y se puede volver a planchar, la irritabilidad es menor y permite la exploración completa y algo de tratamiento el primer día sin probable exacerbación; si no cede hasta después de una noche de sueño, la exploración y el tratamiento se adaptan para evitarla (p. 117).
- Gravedad: el dolor es «severo» si obliga a interrumpir la actividad por su intensidad. Un trastorno puede ser severo sin ser muy irritable (los síntomas ceden enseguida) y aun así pedir prudencia (pp. 101, 117). Irritabilidad y gravedad piden cuidado al explorar y **al progresar el tratamiento** (p. 117).
- Dos formas de llevar el movimiento: **«hasta el dolor»** (solo hasta donde empieza o aumenta el dolor, y quizá un poco más para ver cómo se comporta) cuando el cuadro es irritable o severo o su naturaleza pide prudencia, y **«hasta el límite»** con sobrepresión cuando no (pp. 101, 127–128).
- Estabilidad: si la gravedad o el lugar de los síntomas varían mucho de un día a otro, el trastorno es inestable; la exploración se modifica para no exacerbar, el tratamiento debe ser suave y la evaluación, máxima en cada sesión (pp. 101, 107).
- Hoja de planificación (tabla 6.8, p. 124): ¿dolor severo o latente?, ¿irritable? (movimiento que lo provoca, intensidad, tiempo hasta que cede), ¿la naturaleza pide prudencia? (patología, facilidad de exacerbación, personalidad), contraindicaciones, ¿exploración suave o moderadamente firme?, objetivos a corto y largo plazo, precauciones y consejo para prevenir recurrencias.
- Reevaluación: anotar con asterisco los datos que servirán para medir el cambio (pp. 100–101); la demostración funcional del paciente es un parámetro de control para reevaluar (p. 128); el comportamiento de los síntomas da hechos con los que medir el progreso («camina hasta la verja antes de que le duela la pierna», p. 116). A veces la evaluación completa solo es posible en la segunda sesión, cuando se ha visto la reacción a la primera («D más 1», p. 156).
- Dolor radicular: si es severo, exploración neurológica cuidadosa y tratamiento suave (p. 137); los cambios neurológicos se reevalúan al empezar cada sesión y su deterioro se comunica al médico (p. 136).
- Técnicas neurales: el slump rara vez es la primera técnica; si se usa con vigor, dejar 2–3 días entre sesiones y reevaluar a las 24 h, porque las estructuras del canal tardan más en recuperarse de las agujetas (p. 149).
- Calor local: el de un trastorno mecánico desaparece o disminuye mucho tras dos sesiones de movilización; el de una enfermedad activa no cambia en dos tratamientos, y eso puede indicar que el problema no es de fisioterapia (p. 151).
- Dolor nocturno que obliga a levantarse: investigar patología más seria (p. 117); ya lo cubre el cribado.

### Decisiones 16–19 (usuario, 2026-10; aceptadas como se propusieron)
16. **Citar a Maitland para las definiciones y los dos modos** («hasta el dolor» / «hasta el límite»), y a Petersen 2021 para la combinación de gravedad × irritabilidad. Los escalones A/B/C quedan igual (decisión 11).
17. **Estabilidad**: la fase 3 ya registra `estabilidad` (Mejora / Estable / Empeora). Con «Empeora», tratamiento suave, sin C, y evaluación en cada sesión (pp. 101, 107). Maitland habla de variación día a día, no de empeoramiento: se diría así.
18. **Bloque de reevaluación** de cada sesión: signo comparable (`signoComparable`) y la actividad que refiere el paciente como control; en la sesión 2, la reacción a la primera («D más 1»). Con una hipótesis radicular, exploración neurológica al empezar cada sesión, y deterioro → médico (p. 136).
19. **Movilización neural vigorosa**: ≥ 2–3 días entre sesiones y reevaluar a las 24 h (p. 149). Encaja con el plan B (2 sesiones/semana) si se espacian.

**Maitland's Vertebral Manipulation, 7.ª ed., cap. 8 «Selection of techniques», pp. 183–212, y cap. 9 «Application of techniques», pp. 213–228** (cap. 9 con contribución de B. C. Edwards; PDF aportado por el usuario, y la p. 224, que faltaba, en imagen; leídos enteros). Libro de texto, opinión experta, centrado en la **movilización pasiva y la manipulación vertebral**: no es una guía de dosificación de ejercicio.
- Lo que guía la técnica son los síntomas y signos con la historia del trastorno, no el nombre del diagnóstico (pp. 196–197). Para elegir hay que saber el diagnóstico, el pronóstico, la estabilidad actual, cómo afecta al paciente, si el dolor es «a lo largo del recorrido» o «al final del recorrido», si es severo o «de molestia», reciente o crónico, y las contraindicaciones (pp. 211–212).
- **Dos formas de aplicar la técnica** (p. 203):
  - Cuando el dolor manda (limita pronto o aparece a lo largo del recorrido) y la exacerbación debe evitarse: posición sin molestias, técnica cómoda, la mayor amplitud posible sin molestia, lenta y suave, y **corta al principio, hasta conocer la respuesta a las 48 h**. Grados I y II; al bajar el dolor, grado III (pp. 203, 218).
  - Cuando manda la rigidez y las estructuras no están debilitadas por trauma o enfermedad: al final del recorrido, firme, amplitud sobre todo pequeña con alguna grande, más rápida, ritmo algo «staccato», respetando la molestia (sobre todo si se suma), y más larga, intercalando movimientos activos. Grado IV, más firme cuanto más antiguos los cambios de tejido y **cuanto menos irritable fue la respuesta al tratamiento anterior** (p. 203); grado III suave para la molestia que deje (p. 218).
- Progresión en el dolor: primero la misma técnica, a la misma velocidad, hasta un grado controlado de molestia; después cambiar la posición hacia la dirección dolorosa (p. 206). Con dolor y rigidez a la vez, empezar por las técnicas del dolor; tratar el dolor entrando en la rigidez solo si fallan: molestia mínima, lenta y suave, parar si el dolor aumenta o aparece un dolor sordo, **no más de medio minuto antes de reevaluar**, y mejor hacer poco y usar la respuesta a las 24 h, que es «la evaluación más informativa» (pp. 207–208).
- Dolor referido: evitar provocarlo al principio del tratamiento (p. 188); si aparece después de la técnica, técnica suave, sesiones cortas, descanso y evaluación cuidadosa a las 24 h (p. 189); empezar en la parte indolora y evaluar justo después y a las 24 h (p. 218). Raíz nerviosa con síntomas severos: posición y movimiento que alivien, sin irritar; sin progreso, molestia mínima y controlada, poco en la primera sesión; si empeora, suspender la técnica (pp. 210–211). El dolor radicular severo puede tardar 7–10 días en notar mejoría (p. 217).
- **Primera sesión, menos tratamiento** que las siguientes, porque el primer estiramiento provoca más reacción, y **avisar al paciente de un posible aumento temporal** de síntomas; las siguientes dependen de la reacción a la anterior (p. 219).
- **Cantidad por sesión**: hay un óptimo; unas 3–4 movilizaciones de unos 30 s por articulación (la mitad si es muy dolorosa, más si los síntomas son mínimos) (p. 219); salvo síntomas mínimos, unas 4 movilizaciones entre evaluaciones, de 8 s a más de 2 min (p. 216). Evaluar antes, durante y después de cada técnica (pp. 213, 216).
- **Seguir o cambiar**: si una técnica no cambia nada, repetirla más firme; si sigue sin cambio, descartarla; si mejora, repetirla; si empeora, no repetirla (quizá más tarde y más suave) (pp. 213–214). Si se espera mejora rápida se cambia antes; si se espera lenta, no cambiar hasta usarla dos sesiones o más (p. 214); en los lentos los cambios no se esperan antes de 2–3 sesiones (p. 216). Con una mejora del 75 % o más en una sesión, no subir la dosis: mejor no hacer nada 48 h o repetir igual o menos (p. 216). La movilización que funciona debería mostrar una mejora marcada en 4–5 días (p. 220).
- **Sin mejoría**: si el tratamiento mantiene la molestia o no mejora en varias sesiones, suspenderlo temporalmente y reevaluar a los 7–14 días; si en 10–14 días no hay cambio, una pausa de 2 semanas, porque a veces la mejora aparece la tercera semana (pp. 219–220). Devolver al médico si los signos no siguen los patrones habituales o el paciente no mejora; no prolongar el tratamiento con mejoras mínimas (p. 223).
- Al principio, pedir al paciente que no cambie lo demás (medicación, actividades), para saber qué efecto tiene el tratamiento (p. 219).
- Manipulación: casi nunca al principio, nunca con una articulación muy dolorosa ni a través de un espasmo protector (pp. 201, 220, 222). Sin manipulación forzada con osteoporosis, artritis reumatoide, signos medulares, signos de dos raíces cervicales o alteraciones de vejiga, intestino o sensibilidad perineal; la movilización suave sí puede ser adecuada (pp. 222–223). Los cambios neurológicos no impiden movilizar con suavidad desde el principio (p. 223).
- Inestabilidad o hipermovilidad: una vez sin síntomas, ejercicios de estabilización; si la movilización agrava el dolor, sustituirla por ellos (p. 225).
- Página 224: si un paciente derivado tiene en realidad otra causa (la página empieza con la hemorragia subaracnoidea o el tumor cerebeloso como primer signo), devolverlo al médico en cuanto el dolor y los signos no mejoren con la movilización. **Vértigo**: vigilancia estrecha; puede tener origen cervical, normalmente solo cuando acompaña a una cefalea que la movilización alivia; probar con movimientos exploratorios antes de usar una técnica cervical, y **no usar ninguna técnica que produzca mareo**. **Hipermovilidad**: dos sentidos (laxitud ligamentosa general, o uno o más segmentos excesivamente móviles respecto a los vecinos); hipermóvil no es lo mismo que inestable (laxitud de los ligamentos de soporte que permite un movimiento anormal); una articulación hipermóvil dolorosa puede movilizarse, y sería la primera elección, pero no manipularse con fuerza; al tratar una articulación rígida vecina, evitar forzar la hipermóvil.
- Registro de cada sesión (tabla 9.3, p. 226): lo que refiere el paciente comparado con la sesión anterior (con sus palabras), cambios en los signos marcados, plan con su porqué, técnica, grado, nivel, repeticiones y efecto durante su aplicación, efecto después, y el plan para la siguiente. En los de progreso lento, comparar a la semana en vez de a las 24 h.

### Decisiones 20–24 (usuario, 2026-10; aceptadas como se propusieron)
20. **Los niveles A/B/C se describen con los dos modos de Maitland, solo para la parte de terapia manual** de la pauta: A = el dolor manda (grados I–II, corta, 48 h); B = progresar hacia una molestia controlada (grado III); C = la rigidez manda (grado IV, final del recorrido), solo con irritabilidad baja y si la rigidez domina. Para el ejercicio, Maitland no dice nada: ahí siguen la pauta y la decisión 14.
21. **Sesión 1 más ligera** que las siguientes y aviso al paciente de un posible aumento temporal de síntomas, en el plan y en el programa domiciliario (p. 219).
22. **Reglas de seguir o cambiar en el plan del mes**: no cambiar una técnica antes de 2 sesiones si se espera mejora lenta; con mejora ≥ 75 %, no subir la dosis; sin mejora marcada con movilización en 4–5 días, replantear; sin cambio en 10–14 días, pausa y reevaluación, o devolver al médico si no sigue los patrones habituales (pp. 214, 216, 219–220, 223). Con dolor radicular severo, avisar de que la mejoría puede tardar 7–10 días (p. 217).
23. **Plan A (1/semana)**: Maitland evalúa a las 24–48 h y pide sesiones lo bastante frecuentes para poder valorar el efecto (p. 219); con una a la semana, la comparación es semanal (tabla 9.3). El plan A lo dirá, y propondrá que el paciente anote cómo estuvo a las 24 h.
24. **Hoja de registro de la sesión** siguiendo la tabla 9.3: refiere el paciente / signos / plan y porqué / técnica, grado y efecto durante / efecto después / plan para la siguiente. Sirve también como formato de salida de la capa de IA.

### Decisiones 25–29 (usuario, 2026-10; revisión de L2, aceptadas como se propusieron)
25. **Cortes de irritabilidad asimétricos hacia lo prudente**: reposo + movimiento + tolerancia (0–2 cada uno) suman 0–6; 0–1 baja, 2–4 moderada, 5–6 alta (antes 0–2 / 3–5 / 6, que solo daba «alta» con los tres al máximo). Quedarse corto es el error peligroso, porque con irritabilidad baja aparecen C y los escalones firmes. Cuando el nivel de la fase 3 (matriz entera, con ítems de gravedad) difiere, la fase 6 muestra los dos y explica por qué. A la matriz le falta el dato central de Petersen y Maitland, cuánto tarda el dolor en calmarse: se apunta para L3 (sería cambiar la fase 3).
26. **Escalón de B**: irritabilidad alta → 1 siempre, también con gravedad mínima; moderada → 2, o 1 con gravedad máxima; baja → 3. **B nunca es 4**: el escalón firme exige que domine la rigidez, que la app no recoge, así que el 4 solo aparece como C, elegido a sabiendas.
27. **Sin NRS**: se mantiene la gravedad máxima, con enlace «Registrar NRS en la fase 3 →». La regla de los 7–10 días (radicular severo) solo sale con el NRS registrado de 8 o más, nunca con la máxima prudente ni con la elegida a mano.
28. **Hipótesis neurológicas por id, nunca por el nombre** (`data/plan-tratamiento.js`): exploración neurológica al empezar cada sesión (Maitland, cap. 6, p. 136) con `lu3` (dolor radicular), `lu4` (estenosis) y `lu5` (radiculopatía); regla de los 7–10 días solo con `lu3` y `lu5`. Un test exige que toda hipótesis de las regiones del plan con «radicul», «estenosis» o «neuro» en el nombre esté en la lista o descartada con motivo; en L3 cada región añade las suyas.
29. **Textos y minutos**: todas las frases del programa para casa viven en `TEXTOS_CASA`, con su fuente o «redacción propia», y se revisan en `docs/plan-tratamiento-frases.md`. Los minutos de los bloques llevan la etiqueta «Minutos orientativos» y son editables (aviso si no suman 50). «Cuándo parar» es un campo propio; si queda vacío se usa la variable de control de la fase 5 y, sin ninguna, la sección no sale y «📤 Compartir» pide confirmación antes de dar al paciente un programa sin criterio de parada.

### Decisiones 30–34 (usuario, 2026-10; revisión de las frases de redacción propia, aceptadas como se propusieron)
30. **El documento de frases separa lo que necesita criterio clínico**: cada texto que no cita fuente lleva un tipo (`TIPO_TEXTO`, `data/plan-tratamiento.js`): etiqueta, describe la app, decisión o principio de este documento, u organización de la sesión. «Redacción propia» queda solo para lo que afirma algo clínico sin fuente (hoy, una frase).
31. **Textos corregidos**: fuera «Sin propuesta C: B ya es el escalón más firme» (B nunca es 4, decisión 26) y el paréntesis «(Maitland no trata la dosis del ejercicio)» (solo se leyeron los caps. 6, 8 y 9); los avisos posquirúrgicos son los de la fase 5 (`TEXTO_SIN_PROTOCOLO`, `TEXTO_PAUTA_COMPATIBLE`), ya revisados; el anterior «solo estructura genérica, sin contenido de intervención» no describía lo que hace la fase.
32. **Plan bloqueado = sin programa para casa**: con una urgencia o una derivación, «📤 Compartir» no lo ofrece; esa conversación es en persona y la fase ya muestra la alerta roja.
33. **Programa para casa sin rellenos**: «Qué hacer» funciona como «Cuándo parar»; lo que esté vacío no sale y compartir pide confirmación («Programa incompleto»). «Si algo empeora mucho…» pasa a «Si empeoras claramente o notas algo nuevo, coméntalo con tu fisioterapeuta antes de la próxima sesión.»
34. **Red de seguridad con hipótesis neurológica** (`HIP_EXPLORACION_NEURO`): el programa para casa termina con «Si notas adormecimiento entre las piernas o alrededor del ano, o cambios al orinar o al hacer de vientre, ve a urgencias hoy mismo.», y el cierre de la sesión pide explicarlo y comprobar que lo ha entendido (Finucane 2020, sección 2, pp. 9–17, ya leído para la pregunta `l6`; los síntomas son los de su razonamiento). El cierre cita además a Maitland (cap. 9, p. 213 y tabla 9.3), y «Sigue siempre las indicaciones de tu cirujano» remite a la decisión posquirúrgica.

### Decisiones 11–15 (usuario, 2026-10)
Las cinco recomendaciones tras la lectura se aceptaron y están arriba, en «Decisiones tomadas».

### Referencia completa
Maitland GD; Hengeveld E, Banks K, English K (eds.). *Maitland's Vertebral Manipulation*. 7.ª ed. Edimburgo: Elsevier Butterworth-Heinemann; 2005. ISBN 978-0-7506-8806-2 (portada y página de créditos aportadas por el usuario). Clave prevista en `data/referencias.js`: `'Maitland 2005'`, que se añadirá cuando `data/` la cite (el test rechaza entradas que nada cita), igual que Petersen 2021, Barakatt 2009, Zusman 1998 y Silbernagel 2007.

### Pendiente de leer
- Nada para L2. Con una hipótesis de mareo cervicogénico (`ce13`), la regla «no usar ninguna técnica que produzca mareo» (p. 224) se añade al plan.

## Datos

```js
// state (propuesta)
planTratamiento: null | {
  hipotesis: ['lu2'],          // elegidas por el fisio
  nivel: 'B',                  // propuesta de sesión marcada: 'A' | 'B' | 'C'
  frecuencia: 'A',             // plan del mes: 'A' (1/semana) | 'B' (2/semana)
  sesion: 'primera',           // 'primera' | 'siguiente'
  gravedad: null, irritabilidad: null,  // cambiadas a mano (null = calculadas)
  notas: { sesion: '', mes: '', domiciliario: '', parar: '' },  // ediciones del fisio
  duraciones: {},              // minutos de cada bloque cambiados a mano
  ia: null | { texto, fecha, prompt, version, huella, revisados }
}
```

El esqueleto **no se guarda**: se recalcula a partir del estado, igual que los resúmenes. Se guarda solo lo que elige o escribe el fisio, y el resultado de la IA. Se borra con `resetApp()`/`_softResetApp()`. En la exportación `.json` entran las elecciones del fisio, pero no el resultado de la IA (`ia`), igual que `informeIA`.

## Código (previsión)

| Fichero | Qué |
|---|---|
| `lib/plan-tratamiento.js` | Funciones puras: bloqueos, hipótesis por defecto, esqueleto de sesión (A/B/C) y de mes (A/B). Unit-tested |
| `plan.js` | Render de fase 6, cargado con `import()` al entrar en la fase (como `formulario.js`) |
| `plan-ia.js` | Capa de IA, solo standalone, con `import()` (como `informe-ia.js`); nunca se descarga en el hub |
| `lib/revision-plan.js` | Revisión automática del texto de la IA |
| `index.html`, `app.js`, `data.js` | `#phase6`, `PHASE_DEFS`, navegación, `window` |
| `deploy-to-hub.yml` | Copiar los ficheros nuevos (el test de despliegue lo exige) |
| `tests/unit/plan.mjs`, `tests/smoke.mjs` | Bloqueos, esqueletos, nada en el payload; recorrido 1–6 en las 7 regiones, hub sin IA |

Hay que comprobar en physiq-report que un `SESSION_ASSESSMENT_PARTIAL` con `phase: '6'` no rompe su indicador de «incompleto».

## Orden de trabajo

1. **L1 — este documento** (hecho; decisiones 1–15 tomadas y fuentes leídas).
2. **L2 — parte sin IA en lumbar** (piloto): bloqueos, esqueleto, compartir. Prueba en consulta real.
3. **L3 — las 7 regiones.** Tobillo y pie (20 de 37 sin pauta) será la que más «pauta a criterio del fisio» muestre.
4. **L4 — capa de IA**, con la ruta nueva en el worker de physiq-report.
5. **L5 — revisión automática** con planes reales en los fixtures, como `tests/fixtures/informes/`.
