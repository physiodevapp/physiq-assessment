# Agente Plaud → valoración — documento de diseño

Estado: **diseño aceptado** (2026-10): las 9 decisiones de abajo, todas según la recomendación. No hay código. Se empieza por la fase 1 (skill + MCP de Plaud + validador), después de las comprobaciones de «Por comprobar fuera de la app» (decisión 1); la fase 3 (agente automático) solo si la medición y el uso real de la fase 1 lo justifican.

Relación con lo que ya existe: es la continuación natural del modo guía (`docs/modo-guia.md`). Allí la grabadora solo aporta el **texto libre** y la lógica depende de toques. Aquí se propone que un agente proponga también los **toques**, a partir de la transcripción, para que el fisio solo revise y complete. Eso reabre dos cosas que el modo guía cerró a propósito: su principio 1 («la lógica clínica no se infiere nunca del audio») y su decisión 14 («sin transcripción de la grabadora en esta versión»). Este documento explica cómo hacerlo sin perder lo que esas dos reglas protegían.

## La idea

1. El fisio graba la consulta con Plaud. Plaud la transcribe en su nube, separando los hablantes.
2. En Claude (con el MCP de Plaud conectado), el fisio pide «la valoración de la grabación de hoy de las 10:30». Claude lee la transcripción y rellena **solo respuestas**: lo que el paciente dijo y lo que el fisio dijo en voz alta durante la exploración.
3. Un validador hecho con el propio código de la app recalcula todo lo derivado (hipótesis, puntuaciones, irritabilidad, urgencias, pendientes) y comprueba el archivo.
4. Claude entrega un `valoracion-<paciente>-<fecha>.json` (el mismo formato que «⬇ Exportar») y una **hoja de evidencias** con la frase de la transcripción que justifica cada respuesta.
5. El fisio lo abre en PhysiQ con «⬆ Importar», lo revisa con la hoja de evidencias delante, corrige y completa lo pendiente. Desde ahí, todo sigue como hoy: fase 5, «📤 Compartir», informe con IA, fase 6.

## Principios

1. **Claude extrae, el código decide.** Claude nunca calcula un nivel, una puntuación ni una hipótesis: escribe respuestas brutas. Todo campo derivado lo recalcula el validador con las funciones de la app (`nivelMatriz()`, el árbol de `phase4.js`, `calcLRScore()`…). Si Claude lo escribe, se descarta.
2. **Sin evidencia, sin respuesta.** Cada respuesta lleva su cita literal de la transcripción. Lo que no tiene cita se queda vacío.
3. **Silencio no es «No».** El archivo va siempre con `registro: 'guia'`, así que lo vacío es «no preguntado» (decisión 3 del modo guía) y sale en los pendientes, las urgencias arriba y en rojo.
4. **La seguridad nunca depende de una inferencia negativa.** Un SÍ mal puesto genera una derivación de más; un NO mal puesto oculta una urgencia. Por eso el agente puede proponer SÍ con cita, pero nunca escribe NO en una pregunta con `urgencia` ni en las banderas rojas br1–br4 (decisión 2).
5. **Nada se da por bueno sin el fisio.** El resultado es un borrador. No se comparte, no se envía al informe y no genera nada hasta que el fisio lo ha revisado en la app.
6. **Sin contenido clínico nuevo.** El agente usa las preguntas, pasos y tests de `data/` y `formularios/` tal como están. No añade preguntas ni reglas.
7. **La app no cambia para la fase 1 de este proyecto.** El `.json` de importación ya existe; el agente solo lo produce. Los cambios de app quedan para fases posteriores.

## Qué rellena el agente, campo a campo

Tres tipos de campo:

| Tipo | Qué significa | Quién lo escribe |
|---|---|---|
| **R · Respuesta** | Algo que se dijo en la consulta | El agente, con cita |
| **D · Derivado** | Se calcula a partir de las respuestas | El validador, nunca el agente |
| **F · Fuera** | No sale de la transcripción o no debe tocarse | Nadie: valor por defecto |

### Fase 1

| Campo | Tipo | Notas |
|---|---|---|
| `patient` | R | Del título de la grabación en Plaud o de lo que pida el fisio; si no, nombre automático del modo guía («Paciente DD/MM HH:MM») |
| `modo` | F | Lo elige el fisio al pedir la valoración («breve» o «completa»); por defecto `completo` |
| `registro` | F | Siempre `'guia'` |
| `motivoConsulta` | R | Texto con las palabras del paciente |
| `mecanismo`, `cronologia` | R | Solo si el relato lo deja claro; «hace dos meses» → Subagudo, pero «hace tiempo» → vacío |
| `cirugia` | R | Intervención, fecha, protocolo, restricciones, complicaciones; solo con mecanismo Post-quirúrgico |
| Tarjetas de condiciones especiales (`hipermovilidad`, `disautonomia`, `lupus`, `mastocitos`, `osteoporosis`, `embarazo`, `anticoagulado`) | R | Solo el estado «Diagnosticado/a» o «Toma» cuando el paciente lo dice; **nunca «Sospecha»**, que es un juicio del fisio (decisión 4) |
| `farmacos.toma` | R | Familias de la guía cuando el paciente nombra un fármaco de esa familia; sin texto libre, como en la app |
| `banderasRojas` br1–br4 | R | Solo SÍ, con cita (decisión 2) |
| `riesgoPsico`, `psico_*` | F | Es un juicio del fisio; se queda vacío |
| `edadPaciente`, `sexo` | R | Edad si se dice; sexo solo si se dice o es inequívoco en el relato («estoy embarazada»), nunca por la voz o el nombre |
| `signosVitales`, `antropometria` | R | Solo si el fisio los dice en voz alta |
| `formularioPrevio` | R | Las preguntas del formulario cuyo contenido aparece en la consulta; las de texto con las palabras del paciente |

### Fase 2

| Campo | Tipo | Notas |
|---|---|---|
| `region`, `lado` | R | Obligatorios para que el archivo sirva. Si no se pueden deducir con seguridad, el agente pregunta al fisio antes de seguir |
| `sistemicoAnswers` | R | SÍ con cita; NO solo con una respuesta explícita a esa pregunta (pregunta del fisio y respuesta del paciente, las dos citadas) y **nunca** en una pregunta con `urgencia` (decisión 2) |
| `sistemicoAlerta` | D | |
| `sistemicoBreve` (embudo) | F | Solo existe en modo breve y lo toca el fisio |
| Bloques de las condiciones (Beighton, bipedestación, factores, caídas, ánimo, suelo pélvico) | R / F | Beighton y bipedestación solo si el fisio dice cada maniobra o medida en voz alta; ánimo (`animo` del embarazo): **F**, nunca lo rellena el agente (preguntas `privada`, decisión 11 de `docs/embarazo-posparto.md`) |

### Fase 3

| Campo | Tipo | Notas |
|---|---|---|
| `severidad` (NRS) | R | Solo un número dicho («un 7»); nunca deducido de «me duele mucho» |
| `irritabilidad.*` | R | Cada fila de la matriz por separado, con su cita; la que no tenga, vacía |
| `irritabilidadNivel` | D | `nivelMatriz()`; `irritabilidadDirecta` siempre `false` |
| `naturaleza`, `estabilidad` | F | Juicio del fisio |
| `signoComparable` | R | Lo que el fisio dijo en voz alta (la frase ancla del modo guía) |
| `sintomaPrincipal`, `sintomasSecundarios` | R | Zonas (de `ZONAS_SINTOMA` de la región), lado, patrón, descripción; la relación con P1 solo si el paciente la cuenta |

### Fase 4 y 4b

| Campo | Tipo | Notas |
|---|---|---|
| `treeAnswers` | R | Paso a paso, en el orden del árbol: el agente pide al validador qué paso toca y qué opciones tiene, y responde solo si hay cita (decisión 3). El primer paso sin evidencia corta el recorrido: los siguientes quedan vacíos |
| `stepsCompleted`, `activeHypotheses` | D | Los recalcula el validador con la navegación del árbol |
| `testResults` | R | Solo tests que el fisio dijo en voz alta con su resultado («Slump positivo a la derecha»), emparejados por nombre con los tests de las hipótesis activas. Un test dicho que no pertenece a ninguna hipótesis activa va a la hoja de evidencias, no al archivo |
| `hypothesisScores` | D | `calcLRScore()` / `recalcHypScore()` |
| `derivacionResuelta` | F | «Ya diagnosticada y tratada» es una decisión del fisio |

### Fase 5 y 6

| Campo | Tipo | Notas |
|---|---|---|
| `planNotes` | R | Solo si el fisio los dice al final |
| `planTratamiento` | F | La fase 6 se hace en la app |
| `informeIA` | F | Se genera en la app después de revisar; nunca en el archivo |
| `cuestionarios` | F | Los rellena el fisio con la hoja en papel |
| `currentPhase`, `maxVisitedIdx`, `resultsBuilt` | D | El validador pone la fase más alta con datos (para que la importación funcione hace falta `maxVisitedIdx > 0`) |

## La hoja de evidencias

Un `.md` que acompaña al `.json`, pensado para leerlo al lado de la app:

1. **Arriba, lo que no se puede pasar por alto:** las urgencias sin preguntar (`getNoPreguntadas()`) y las que el agente marcó SÍ, cada una con su cita.
2. **Una línea por respuesta:** fase, campo legible («Fase 2 · ¿Ha perdido el control de la orina?»), valor y cita con su marca de tiempo de Plaud, para ir al audio si hace falta.
3. **Lo que el agente vio pero no puso:** tests dichos que no pertenecen a ninguna hipótesis activa, respuestas ambiguas, frases que contradicen otra respuesta («dice que no le despierta por la noche, pero luego que se levanta a las 4 por el dolor»).
4. **Pendientes:** la misma lista que la app (`getNoPreguntadas()`, y `getPendientesBreve()` en breve).
5. **Al final:** versión de la app con la que se validó (`VERSION_SHA`), grabación de Plaud de la que sale y fecha.

## Arquitectura

### Fase 1: skill + MCP de Plaud + validador (sin cambios en la app)

- **Dónde corre:** Claude Code (terminal, escritorio o en la nube) con este repo, porque el validador es Node y usa los módulos de la app. La app del móvil de Claude no puede ejecutarlo.
- **MCP de Plaud:** el oficial (ver «Por comprobar», punto 1).
- **Skill** (`.claude/skills/valoracion-plaud/SKILL.md`): el procedimiento, los principios de este documento y las reglas de extracción. Las reglas del prompt aprendidas en las revisiones de informes (`lib/reglas-informe.js`, `docs/informe-ia.md`) valen también aquí, sobre todo las de atribución (quién dijo qué) y las de no inventar.
- **Herramienta** `tools/agente-plaud.mjs`, con el mismo patrón que `tools/revisar-informe.mjs` (`tests/dom-shim.mjs` + los módulos reales):
  - `esquema <región>`: lo que se puede responder de esa región en texto legible para Claude (preguntas de cribado con su id, si son de urgencia, formulario previo, zonas de síntomas, filas de la matriz), sin los pasos del árbol.
  - `paso <archivo.json>`: el siguiente paso del árbol con sus opciones (`question`, `iaPregunta`, `textoOpcionIA()`), o «árbol completo».
  - `validar <archivo.json>`: lee con `leerImportacion()`, descarta lo que Claude no debía escribir (tipo D y F), recalcula lo derivado, comprueba ids y valores contra `data/`, y escribe el archivo final más los pendientes.
- **Entrega:** el `.json` y la hoja de evidencias en una carpeta que el fisio pueda abrir; el fisio lo importa en PhysiQ a mano.

### Fase 2: MCP propio de PhysiQ

Las mismas órdenes como herramientas de un servidor MCP, para usarlo desde Claude Desktop o claude.ai sin el repo. Exige sacar a `lib/` la lógica que hoy vive mezclada con el DOM en `app.js` (`sistemasActivos()`, `getNoPreguntadas()`, `getPendientesBreve()`, `buildPhysiQPayload()`). Es refactor, sin lógica nueva, y lo protegen los tests de siempre.

### Fase 3: agente automático y bandeja en la app

Al terminar una grabación en Plaud, el agente la procesa solo y en PhysiQ aparece «Valoración pendiente de revisar». Necesita guardar el borrador fuera del navegador (hoy todo vive en IndexedDB) y marcar en la app cada respuesta propuesta por el agente hasta que el fisio la confirme. Es la fase con más trabajo y más implicaciones de privacidad; solo si las fases 1 y 2 funcionan con consultas reales.

**Por qué no empezar directamente por aquí** (2026-10): el núcleo de la fase 3 (reglas de extracción, validador, medición) es el mismo que el de la fase 1, que no se tira: la fase 3 es la fase 1 más un disparador automático, un almacén en servidor y la bandeja en la app. Construir eso antes de saber si la extracción es lo bastante buena es invertir a ciegas (la capa 3 de revisión con IA se aparcó al medirla, `docs/informe-ia.md`). Además, guardar borradores clínicos fuera del navegador abre RGPD y alojamiento, que hoy no existen porque todo vive en IndexedDB; no está comprobado que Plaud avise al terminar una grabación; y sin el paso manual se pierde el momento en que el fisio elige qué grabación es de qué paciente. El paso manual de la fase 1 cuesta un minuto por consulta.

## Decisiones

Aceptadas por el fisio (2026-10), todas según la recomendación.

1. **Cuándo empezar.**
   - **Recomendado:** después de las comprobaciones de «Por comprobar», puntos 1–3. Si la transcripción de Plaud no separa bien los hablantes en la exploración, o su tratamiento de datos de salud no es aceptable, este proyecto no tiene sentido tal como está.
   - Alternativa: empezar ya con las transcripciones de Whisper de `tests/fixtures/informes/` para medir la extracción, y conectar Plaud después. Sirve para el validador y la medición, pero sin separación de hablantes los resultados serán peores que con Plaud.
2. **Cómo trata el agente el NO en el cribado.**
   - **Recomendado:** SÍ con cita; NO solo con pregunta y respuesta explícitas citadas, y nunca en preguntas con `urgencia` ni en br1–br4, que quedan vacías para que el fisio las toque. Es asimétrico a propósito (principio 4). Coste: el fisio sigue tocando las urgencias negativas (en lumbar, 6 regionales más las de los sistemas activos).
   - Alternativa A: NO con cita también en las urgencias. Menos toques, pero una mala atribución («no, no pierde orina» dicho por el fisio resumiendo) escondería una urgencia.
   - Alternativa B: el agente no rellena nada del cribado. Lo más seguro, pero se pierde gran parte del ahorro.
3. **Cómo recorre el árbol CIF.**
   - **Recomendado:** paso a paso con el validador (`paso`), deteniéndose en el primer paso sin evidencia. Así nunca se salta una rama ni elige una opción para llegar a una hipótesis. El fisio sigue desde ese paso en la app.
   - Alternativa: Claude propone el árbol entero de una vez y el validador comprueba que el camino existe. Más rápido, pero tiende a «completar» el árbol con lo plausible.
4. **Condiciones especiales.**
   - **Recomendado:** solo los estados diagnosticados que el paciente dice («tengo lupus», «tomo Sintrom»), nunca «Sospecha». Marcar una tarjeta activa sistemas de cribado con urgencias propias, que también quedan vacías.
   - Alternativa: proponer «Sospecha» en la hoja de evidencias, sin marcarla en el archivo. Compatible con la recomendada; se puede añadir.
5. **Tests de la 4b.**
   - **Recomendado:** solo los dichos en voz alta con su resultado y de una hipótesis activa. Un resultado ambiguo («algo de dolor con el Hawkins») va a la hoja de evidencias sin marcar.
   - Alternativa: también resultados deducidos del contexto. No: un positivo multiplica la probabilidad, y eso sí debe ser explícito.
6. **Qué Claude y qué cuenta.**
   - **Recomendado:** una cuenta con acuerdo de tratamiento de datos (plan Team/Enterprise de Anthropic o la API) y no una cuenta personal; en cualquier caso, con el uso de datos para entrenamiento desactivado. Ver «Por comprobar», punto 3.
   - Alternativa: cuenta personal durante la prueba con casos simulados, como el de Andrés (`tests/fixtures/casos/`), sin pacientes reales.
7. **Consentimiento.**
   - **Recomendado:** el consentimiento que pide hoy el modo guía al empezar a grabar se amplía: la grabación la transcribe Plaud y la procesa Claude para preparar el borrador. El texto lo revisa el fisio.
8. **Alcance del piloto.**
   - **Recomendado:** lumbar, como el modo guía, y modo completo. Lumbar tiene el árbol de referencia, el caso simulado de Andrés y la mayoría de transcripciones reales.
9. **Hoja de evidencias: dónde y en qué formato.**
   - **Recomendado:** un `.md` junto al `.json`, como en la fase 1 de arriba.
   - Alternativa: mostrarlas en la app, junto a cada respuesta. Mejor para revisar, pero es un cambio de app (fase 3).

## Cómo se mide si funciona

Antes de usarlo con pacientes. `tests/fixtures/informes/` ya tiene lo necesario: 25 transcripciones reales y 20 valoraciones exportadas, rellenadas a mano en la app. Esas valoraciones son la referencia.

1. **Extracción a ciegas:** para cada transcripción con su valoración, el agente genera el `.json` solo a partir de la transcripción.
2. **Comparación campo a campo** con la valoración real, con una herramienta nueva (como `tools/verificar-informe.mjs` para la capa 3):
   - **Errores graves (deben ser 0):** una urgencia o bandera roja en SÍ en la real que el agente dejó en NO; una región o lado equivocados.
   - **SÍ de más** en el cribado: cuántos, y si su cita los justifica (a veces la valoración real es la equivocada; la transcripción de Javier ya mostró un caso así, ver paso 6 de `docs/modo-guia.md`).
   - **Árbol:** hasta qué paso coincide; ninguna opción distinta de la real con cita insuficiente.
   - **Tests:** resultados que coinciden, que faltan y que sobran.
   - **Ahorro:** cuántas respuestas de la real quedaron ya rellenas y bien.
3. **Umbral propuesto** para pasar a consultas reales: 0 errores graves en todas; al menos el 70 % de las respuestas de la real rellenas y bien; como mucho 1 respuesta mal por valoración fuera de las graves. Lo decide el fisio.
4. Después, las primeras consultas reales grabadas con Plaud en modo guía, revisadas como los informes: cada fallo se convierte en una regla de la skill y un caso del test.

Las transcripciones de los fixtures son de Whisper y algunas en modo dictado, así que la medición será algo pesimista frente a Plaud en modo diálogo.

## Por comprobar fuera de la app (antes de decidir)

1. **El MCP de Plaud:** conectar el oficial a Claude y leer una grabación real. ¿Devuelve la transcripción completa con hablantes y marcas de tiempo? ¿Con qué identificador y título se elige una grabación?
2. **La transcripción:** en una consulta real, ¿separa bien fisio y paciente también durante la exploración (distancia, movimiento, ruido)? ¿Transcribe bien los nombres de los tests?
3. **Datos de salud:** el tratamiento de datos de Plaud (RGPD, contrato de encargado de tratamiento, dónde se guardan las grabaciones, si su IA las usa) y lo mismo para la cuenta de Claude que se vaya a usar. Pasa a ser la decisión 14 del modo guía.
4. **Su resumen automático:** si Plaud genera resúmenes o plantillas propias sobre la grabación, que el agente lea la transcripción y nunca el resumen, que es una interpretación de otra IA.

## Orden de trabajo y modelo para cada parte

| Paso | Qué | Modelo | Por qué |
|---|---|---|---|
| 0 | «Por comprobar», puntos 1–4 | — (lo hace el fisio) | Si fallan, cambia o se para el proyecto |
| 1 | `tools/agente-plaud.mjs` (`esquema`, `paso`, `validar`) con tests unitarios: lo derivado se recalcula, lo F se descarta, un NO en una urgencia se rechaza | **Opus** | Encontrar cada campo derivado y cada sitio donde una inferencia podría ocultar una urgencia |
| 2 | La skill y la herramienta de medición; medir con los fixtures | **Opus** | Criterio clínico en las reglas de extracción y en la lectura de los resultados |
| 3 | Revisión del fisio con los resultados de la medición | — | Decide si se prueba con consultas reales |
| 4 | Primeras consultas reales en lumbar; cada fallo, una regla y un caso | **Opus** | Como las rondas del informe con IA |
| 5 | Resto de regiones | **Sonnet** + revisión | Las reglas son las mismas; cambia el esquema, que sale de `data/` |
| 6 | Fase 2 (MCP propio, refactor a `lib/`) | **Sonnet** | Trabajo mecánico protegido por los tests existentes |
