# Paciente posquirúrgico — diseño

Estado: **decisiones cerradas (octubre 2026)**. Implementado, incluido el cribado posquirúrgico de la fase 2 (sistema `transversal_posquirurgico` en `data/comun.js`), **pendiente de la revisión clínica antes de `main`** y con el síndrome compartimental aún sin pregunta (falta releer su fuente).

Cribado implementado, con diferencias respecto al diseño original:
- Seis preguntas: `pq_herida`, `pq_tvp` (cadera, rodilla, tobillo y pie, lumbar, cervical), `pq_tvp_ms` (hombro y codo: piernas o el brazo operado), `pq_tep`, `pq_sdrc` y `pq_nervio` (estas dos, solo en las 5 regiones de extremidad).
- **`pq_nervio` lleva `urgencia`**, al contrario de lo decidido («sin urgencia»): la guía del Royal College of Physicians (Goebel 2018, p. 13) pide que el cirujano revise con urgencia un dolor quemante en el territorio de un nervio tras una operación ortopédica. Se aplica la fuente; el usuario confirmó mantener la urgencia (octubre 2026). En lumbar y cervical no se pregunta: la fuente habla de nervios periféricos, y la cola de caballo y la mielopatía ya tienen sus preguntas.
- **Síndrome compartimental sin pregunta todavía**: su fuente (Torlincasi 2023, StatPearls) se leyó en otra sesión, y lo leído en otra sesión no cuenta. Falta el PDF.
- Conflicto de cifras resuelto por la regla de fuentes: la frecuencia de la infección de la herida sale de NICE NG125 («al menos el 5 %»), guía, y no de Zabaglo 2024 («0,5–3 %»), StatPearls. Común a las 7 regiones; sin pautas por tipo de cirugía.

## Decisiones tomadas (octubre 2026)
Aceptadas las ocho recomendaciones:
1. **Tarjeta «Cirugía»**: intervención en texto libre; fecha exacta, o semanas aproximadas si el paciente no la recuerda; protocolo Escrito / Verbal / No hay más restricciones en texto libre; complicaciones en lista cerrada (ninguna, infección, TVP/TEP, lesión nerviosa, SDRC, reintervención) más «otra» en texto. Sin campo de lado ni de carga permitida (la carga va en restricciones).
2. **Cribado posquirúrgico**: herida (con urgencia) y TVP (con urgencia) en las 7 regiones; la TVP pregunta siempre por las piernas, y en hombro y codo añade el brazo operado. TEP con urgencia (112). Síndrome compartimental en codo, rodilla y tobillo y pie. SDRC sin urgencia, en las 5 regiones de extremidad. Se añade «déficit neurológico nuevo desde la operación», derivación al cirujano sin urgencia. Fuentes: ver «Fuentes» en la sección de la fase 2, más abajo. **Pendiente**: redacción final y razonamientos tras leer las fuentes, y revisión clínica antes de `main`.
3. **Ventanas temporales**: las preguntas se muestran siempre; la ventana va en la ayuda.
4. **Preguntas de traumatismo** (`h_t1`, `co_t1`, `co_t2`, `ro_t2`–`ro_t4`, `tp_t1`, `cv_ar3`): nota posquirúrgica, sin tocar su lógica.
5. **«Ya diagnosticada y tratada»**: disponible siempre, no solo con Post-quirúrgico; pliega y anula los tests de esa hipótesis; vale para la `derivacion` de `co_step1` y no para `lu_step2`. Regla añadida: marcarla nunca silencia las urgencias de la fase 2.
6. **Pautas de las guías** en el posquirúrgico: se muestran, con la nota «solo si es compatible con el protocolo del cirujano».
7. **Sin protocolo**: aviso en la fase 5, línea «pendiente de confirmar con el cirujano» en los informes y pendiente en modo breve.
8. **Payload**: se añaden `cq` (cirugía) y `dt` (en `h[]`, hipótesis diagnosticada y tratada).

---

Diseño original:

## Punto de partida (medido en el código, octubre 2026)

**«Post-quirúrgico» no hace nada.** `state.mecanismo` solo se muestra: resumen de la fase 5, payload `me`, 📋 Notas y la línea «Mecanismo de inicio» del 📄 Informe. Ninguna función lo lee para decidir algo. Lo único relacionado con la cirugía es el ítem `operaciones` del formulario previo (`formularios/comun.js`, texto libre, `informe` + `antecedente`), que ya aparece como pista «📝 Refiere el paciente» sobre la tarjeta Mecanismo.

**Hipótesis «Derivar» (`DOSIS_DERIVAR`): 14, en 5 regiones.** Cadera y lumbar no tienen ninguna. Opciones del árbol que llevan a ellas y que un operado contesta «SÍ» por su propia historia:

| Región | Paso | Opción | Hipótesis |
|---|---|---|---|
| Hombro | `h_step2b` | Traumatismo previo → luxación bloqueada o fractura | `h11` |
| Cervical | `ce_step1`, `ce_step3b` | Signos de mielopatía | `ce8` |
| Rodilla | `ro_step1`, `ro_step1b` | Fractura / Ottawa positivo | `ro11` |
| Codo | `co_step1` | Rotura distal del bíceps · niño | `co7`, `co14` |
| Codo | `co_step4` | Cara posterior | `co12` |
| Tobillo y pie | `tp_step2` | Ottawa de tobillo / de pie, Thompson, Lisfranc, caída sobre el talón | `tp37`, `tp5`, `tp3`, `tp4` |
| Tobillo y pie | `tp_step3`, `tp_step7`–`tp_step12` | Tibial posterior, fracturas de estrés, 5.º MT, gota | `tp6`, `tp17`, `tp30`, `tp4`, `tp5`, `tp35` |

Las reglas de Ottawa están validadas en el traumatismo agudo, no en una fractura ya operada: un tobillo con osteosíntesis duele a la palpación del maléolo y da «Ottawa positivo» sin que haya nada que derivar.

**Derivaciones del árbol que no son hipótesis** (`derivacion`, payload `dv[]`): codo `co_step1` FRACTURA / LUXACIÓN («el codo no llega a estirarse del todo») y lumbar `lu_step2` VASCULAR. La primera es lo esperable en un codo operado.

**Preguntas de urgencia de la fase 2 que se refieren a un traumatismo** y que un operado puede cumplir por la cirugía misma: `h_t1` (pierde movilidad del brazo), `co_t1` (no estira el codo), `co_t2`, `ro_t2` (no levanta la pierna estirada: lo normal en las primeras semanas tras una prótesis o un LCA), `ro_t3`, `ro_t4`, `tp_t1`, `cv_ar3` (apenas mueve el cuello). Un SÍ dispara «Derivación urgente hoy».

**Lo posquirúrgico que ya existe en el cribado**, repartido y sin pensar en el operado:
- TVP: `ca_v2`, `r_v2`, `tp_v2` (con `urgencia`). Hombro, codo, cervical y lumbar no tienen.
- Infección: `r1`, `ca_in1`, `tp_i1`, `l_inf1` (esta menciona «le han operado hace poco») y la de hombro. Ninguna pregunta por la herida.
- Síndrome compartimental: solo `tp_t1`, limitado a la lesión del mediopié.
- SDRC: no hay nada.

## Principios

1. **La seguridad no se recorta**, igual que en el modo breve: ninguna pregunta con `urgencia` se oculta ni cambia de lógica por ser posquirúrgico. Lo que se añade es contexto y un cribado propio.
2. **El cirujano manda.** El plan y los tres informes se supeditan a su protocolo y a sus restricciones. PhysiQ no propone cargas, rangos ni plazos por tipo de cirugía.
3. **Sin contenido clínico inventado.** Las preguntas nuevas del cribado son un borrador mío. Llevan fuentes leídas (las de la sección de la fase 2) y pasan por tu revisión antes de `main`, como en la Fase F.
4. **Lo diagnosticado no se vuelve a derivar.** Una fractura ya operada no debe pedir radiografía en ningún sitio, pero el marcado lo hace el fisio de forma explícita; el código no lo deduce del mecanismo.

## Flujo propuesto

### Fase 1 — tarjeta «Cirugía»
Aparece justo debajo de Mecanismo de inicio cuando este es Post-quirúrgico, y desaparece si se cambia. Los datos no se borran al cambiar el mecanismo, pero mientras no sea Post-quirúrgico ningún resumen los usa (como las respuestas regionales del formulario previo). Campos (decisión 1):
- **Intervención**: texto libre con micrófono y chips (`injectQuickInputBar`), por ejemplo «osteosíntesis de maléolo peroneo», «PTR derecha», «reconstrucción del LCA».
- **Fecha de la cirugía**: se guarda la fecha y se calculan las semanas al mostrarla, nunca se guardan (igual que el IMC). Si el paciente no recuerda la fecha, se aceptan las semanas aproximadas.
- **Protocolo del cirujano**: Escrito / Verbal / No hay. Al lado, texto libre para restricciones (carga, rango, inmovilización, precauciones, plazos).
- **Complicaciones**: texto libre (o lista cerrada, decisión 1).

No es obligatoria (la fase 1 no bloquea nada). Si el protocolo está en «No hay» o vacío, la fase 5 lo avisa: «confirmar restricciones con el cirujano» (decisión 7). En modo breve la tarjeta **no se pliega**, porque el plan depende de ella.

### Fase 2 — sistema «Cribado posquirúrgico»
Un sistema común nuevo (`SIS_POSQUIRURGICO` en `data/comun.js`, la misma instancia en las 7 regiones, como `SIS_ENDOCRINO`) que solo se pinta con mecanismo Post-quirúrgico, el primero de la lista. Borrador de preguntas para tu revisión (texto, `urgencia`, regiones y fuentes, decisión 2):

| id | Pregunta (borrador) | `urgencia` | Regiones |
|---|---|---|---|
| `pq_herida` | ¿La herida está más roja, caliente o hinchada, supura, se ha abierto, o ha tenido fiebre o escalofríos desde la operación? | Sí: posible infección del sitio quirúrgico, contactar hoy con el cirujano o urgencias | Todas |
| `pq_tvp` | ¿Tiene la pantorrilla o toda la pierna (o el brazo) hinchada, caliente o dolorosa desde la operación? | Sí: posible TVP, derivar hoy (NICE NG158, Wells) | ¿Todas, o solo cadera, rodilla, tobillo y pie y lumbar? |
| `pq_tep` | ¿Le falta el aire de forma repentina, le duele el pecho al respirar o ha tosido sangre? | Sí: posible TEP, urgencias (112) | ¿Incluir? |
| `pq_compart` | ¿El dolor es desproporcionado, va a más pese a la analgesia y aumenta al estirarle los dedos, con la zona tensa, hormigueo o dedos fríos o pálidos? | Sí: posible síndrome compartimental, urgencias hoy | Codo, rodilla, tobillo y pie (¿cadera?) |
| `pq_sdrc` | ¿Tiene un dolor continuo, desproporcionado para la cirugía, con cambios de color, temperatura, sudoración o hinchazón, o le molesta el roce de la ropa? | No: SDRC, derivación médica no urgente; el tratamiento sigue | Todas |

En el SDRC propongo **no** poner `urgencia`: un SÍ enciende la alerta sistémica habitual y el razonamiento remite a los criterios de Budapest. Las tres primeras urgencias llevan la clase `sq2-urg`, así que en modo breve nunca se pliegan.

Fuentes (cambiadas en octubre de 2026: el Goodman no trata en un apartado propio el SDRC ni la infección de la herida quirúrgica, así que se usan fuentes gratuitas): ya leídas y en el registro, Waheed 2023 (StatPearls, TVP), NICE NG158 (Wells), Torlincasi 2023 (StatPearls, síndrome compartimental) y Guthmiller 2025 (StatPearls, SDRC, con los criterios de Budapest); nuevas, StatPearls *Surgical Site Infections* (NBK560533) y *Pulmonary Embolism* (NBK560551), en PDF del usuario porque NCBI no se puede leer desde el entorno; NICE NG125 como complemento de la infección (sobre todo prevención); la guía del Royal College of Physicians sobre el SDRC (2.ª ed., 2018), opcional. El déficit neurológico nuevo no tiene fuente gratuita general: se apoya en lo ya leído de cada región (Lluch y los capítulos regionales) o se aplaza. No se cita nada sin haberlo leído. Cada pregunta lleva `razonamiento` con el formato de la Fase F (`docs/razonamiento-cribado.md`).

**Ventanas temporales** (decisión 3): el riesgo de TVP se cuenta hasta 12 semanas (Wells: «cirugía mayor en 12 semanas») y el síndrome compartimental es de los primeros días. Propongo mostrar siempre las cinco preguntas y escribir la ventana en el texto de ayuda, sin filtrar por semanas: filtrar escondería una pregunta de seguridad por un dato que puede estar mal.

**Preguntas de traumatismo existentes** (`h_t1`, `co_t1`, `co_t2`, `ro_t2`–`ro_t4`, `tp_t1`, `cv_ar3`; decisión 4): no cambian de lógica. Con mecanismo Post-quirúrgico, propongo una nota bajo cada una: «En el operado, lo que cuenta es el cambio respecto a lo esperable según el protocolo, no el déficit que ya deja la cirugía».

### Fase 4 — árbol CIF
Sin cambios en `CIF_TREES` ni en `phase4.js`. El árbol se recorre igual. Si una rama lleva a una hipótesis «Derivar», se marca en la fase 4b (abajo). Hueco que asumo en esta versión: no hay una hipótesis de «rehabilitación posquirúrgica», así que en cadera y lumbar el árbol da las hipótesis mecánicas habituales y el plan las supedita al protocolo.

Las `derivacion` del árbol (`co_step1` FRACTURA / LUXACIÓN) se marcan igual que las hipótesis (decisión 5).

### Fase 4b — «Ya diagnosticada y tratada»
En la tarjeta de cada hipótesis activa con `DOSIS_DERIVAR` aparece una casilla **«Ya diagnosticada y tratada»** (nuevo `state.derivacionResuelta = { [hypId]: true }`). Con ella marcada:
- Los tests de esa hipótesis se pliegan con la nota «diagnóstico ya confirmado: tests no aplicables» y no puntúan (decisión 5). Lo que ya esté contestado se guarda, pero no multiplica.
- **Fase 5**: el título pasa de «🚑 Derivación» a «🏥 Diagnosticada y tratada», y en lugar de `DOSIS_DERIVAR` dice «Seguir el protocolo del cirujano» más sus restricciones.
- **📋 Notas**: la hipótesis sale con «(diagnosticada y tratada)» y sin tests ni puntuación.
- **📄 Informe**: en IMPRESIÓN CLÍNICA, «<nombre> (intervenida quirúrgicamente)», o «(diagnosticada y tratada)» si no hay cirugía. Nunca «Se recomienda valoración médica» por ella.
- **Informe con IA**: `construirAmpliado()` manda `derivar: false` y la pauta del protocolo. La regla actual («Derivar se mantiene aunque los tests salgan negativos») pasa a excluir las marcadas, y `reglaDerivacion()` no la cuenta.

La casilla no depende del mecanismo (decisión 5): una fractura tratada con yeso, una gota en tratamiento o una mielopatía ya operada tienen el mismo problema. Lo que sí depende de Post-quirúrgico es el punto 4.

### Fase 5 e informes — supeditados al protocolo
Con mecanismo Post-quirúrgico:
- **Fase 5**: un recuadro arriba, «Paciente posquirúrgico · <intervención> · <N> semanas · Protocolo: <escrito/verbal/no hay>», con las restricciones y las complicaciones. Las pautas de las guías se siguen mostrando, debajo y con la nota «Solo si es compatible con el protocolo del cirujano; donde difieran, prevalece el protocolo» (decisión 6). Si no hay protocolo, aviso: «Confirmar restricciones con el cirujano antes de progresar carga o rango».
- **📋 Notas**: línea «🏥 CIRUGÍA:» con intervención, fecha y semanas, protocolo, restricciones y complicaciones.
- **📄 Informe**: bloque «ANTECEDENTE QUIRÚRGICO» tras el motivo (intervención, fecha, semanas), y en PLAN la primera línea: «El tratamiento sigue el protocolo y las restricciones indicadas por el cirujano: …», o «pendiente de confirmar con el cirujano» si no hay protocolo. El ítem `operaciones` del formulario sigue saliendo en antecedentes, porque es la voz del paciente.
- **Informe con IA** (`lib/informe-narrativo.js`): bloque de datos «Cirugía» y regla nueva en `REGLAS_COMUNES`: el plan se supedita al protocolo, no propone nada que contradiga sus restricciones, y si no hay protocolo lo dice una vez. La copia en physiq-report no se entera (ver decisión 8).

## Cambios técnicos (cuando cierres las decisiones)
- `state.js`: `cirugia: { intervencion, fecha, semanasAprox, protocolo, restricciones, complicaciones }` (`semanasAprox` solo se usa cuando no hay fecha; las semanas desde una fecha se calculan siempre al mostrarlas) y `derivacionResuelta: {}`. Ambos sobreviven al guardado y a la exportación; `resetApp()` los limpia.
- `index.html` + `app.js`: tarjeta «Cirugía» (mostrar u ocultar desde `selectOption('mecanismo')`, restaurar en `_restoreSessionDOM()`), recuadro de la fase 5, líneas de 📋 Notas y 📄 Informe, y el sistema posquirúrgico en `buildSistemicoQuestions`, condicionado al mecanismo. Al cambiar el mecanismo con respuestas en ese sistema, se repinta la fase 2 (las respuestas se conservan).
- `data/comun.js`: `SIS_POSQUIRURGICO` con `razonamiento`; `data/referencias.js` y `docs/referencias.md` regenerado con las fuentes nuevas.
- `phase4b.js`: casilla «Ya diagnosticada y tratada»; `calcLRScore` ignora sus tests; `getPendientesBreve()` no la cuenta como hipótesis sin test.
- `phase4.js`: marcar resueltas las `derivacion` del árbol (si lo decides así) y que `getDerivacionesArbol()` las salte.
- `informe-ia.js` + `lib/informe-narrativo.js`: bloque «Cirugía», `derivar` por hipótesis y las reglas; `huella` incluye los datos nuevos.
- Payload (decisión 8): `cq` (cirugía) y `dt: true` en las entradas de `h[]` marcadas.
- Tests: unitarios (el sistema solo aparece con Post-quirúrgico; sus preguntas con `urgencia` llevan `sq2-urg`; una hipótesis marcada no sale en «Derivación» en ninguno de los cuatro sitios ni puntúa; las semanas no se persisten; sin protocolo → aviso) y smoke (recorrido posquirúrgico en las 7 regiones, con hombro `h_step2b` → `h11` marcada).

## Decisiones abiertas (del fisio, no del código)
1. **Tarjeta «Cirugía»**: ¿bastan los campos de arriba? ¿Complicaciones en texto libre o en lista cerrada (infección, TVP, lesión nerviosa, reintervención, otra)? ¿Fecha exacta, semanas aproximadas o las dos? ¿Falta algo, como el lado o si se hizo con carga permitida?
2. **Cribado posquirúrgico**: redacción de las cinco preguntas, cuáles llevan `urgencia` y con qué mensaje, y a qué regiones se aplica cada una (TVP en el miembro superior, TEP sí/no, síndrome compartimental en cadera). ¿Se añade «déficit neurológico nuevo desde la operación» (nervio axilar en hombro, peroneo en rodilla, C5 en cervical)? La cola de caballo ya la cubre `l6`. Y qué capítulos de Goodman leer.
3. **Ventanas temporales**: mostrar siempre las preguntas con la ventana en el texto (recomendado) o filtrarlas por semanas.
4. **Preguntas de traumatismo**: ¿nota posquirúrgica bajo `h_t1`, `co_t1`, `ro_t2`, etc. (recomendado), o dejarlas como están?
5. **«Ya diagnosticada y tratada»**: ¿disponible siempre (recomendado) o solo con Post-quirúrgico? ¿Pliega y anula sus tests (recomendado)? ¿Vale también para las `derivacion` del árbol (`co_step1` sí, `lu_step2` vascular no)?
6. **Pautas de las guías** en el posquirúrgico: mostrarlas con la nota de compatibilidad (recomendado) u ocultarlas y dejar solo el protocolo.
7. **Sin protocolo del cirujano**: ¿aviso en la fase 5 y línea «pendiente de confirmar» en los informes (recomendado), o además como pendiente en el modo breve?
8. **physiq-report**: ¿añadir `cq` y `dt` al payload (recomendado, aditivo; physiq-report los ignora hasta que se actualice su prompt), o mantener el contrato y que el posquirúrgico solo llegue al informe con IA de aquí?
