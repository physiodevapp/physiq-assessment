# Modo guía con grabadora externa — documento marco

Estado: **diseño aceptado** (2026-10): las 14 decisiones de abajo, todas según la recomendación. No hay código. Antes de programar, hacer las comprobaciones de «Por comprobar fuera de la app». Piloto: **lumbar**, solo standalone.

## Decisiones tomadas (octubre 2026)
1. Sesión sin nombre: **nombre automático** («Paciente 10:42», editable).
2. Números: **teclado numérico propio** (0–9 en una hoja inferior), no tramos.
3. En modo guía, **sin marcar = «no preguntado»**, nunca «NO»; el cierre lo lista con las urgencias arriba; nunca bloquea.
4. Preguntas de texto: **frase corta para decir en voz alta** + enunciado plegado + check opcional «preguntado»; solo las que aportan al informe.
5. **Frases ancla sugeridas** en los tests de 4b y el signo comparable, sin obligar.
6. **Regla sin IA** que contrasta la transcripción con las 6 urgencias de lumbar; solo avisa.
7. Audio por **«📎 Adjuntar audio»**, sin integración con la grabadora.
8. **`registro` independiente de `modo`** (breve y guía se combinan).
9. Prompt con la **lista de preguntas de la guía y la regla «no consta»**.
10. **Pistas del formulario sin cambios** (solo lo tocado).
11. **Restricciones de la cirugía sin cambios** («pendientes de confirmar» si no se escriben).
12. Piloto: **lumbar, solo standalone**.
13. **Casilla de consentimiento** + recordatorio al empezar a grabar.
14. **Sin transcripción de la grabadora** en esta versión (pendiente de su política de datos de salud).

## La idea

El fisio graba toda la consulta (entrevista y exploración) con una grabadora de clip externa (p. ej. Plaud NotePin S) y usa la app como **guía**: qué preguntar, qué explorar, qué falta. No teclea nada. Solo toca los botones de los que depende la lógica de la app (cribado, urgencias, árbol CIF, tests, condiciones especiales). Al terminar, adjunta el audio a la tarjeta «🎙 Informe con IA» de la fase 5, que redacta el informe a partir de los botones y de la transcripción.

Reparto de papeles:

| Quién | Qué hace |
|---|---|
| La grabadora | Graba todo: el relato del paciente, las preguntas, lo que el fisio dice durante la exploración |
| La app | Guía el orden y recoge **solo** lo que mueve la lógica, con un toque |
| El informe con IA | Une los botones (datos estructurados) con la transcripción (relato) |

## Por qué así y no «todo por audio»

Lo que sabemos de las revisiones de informes (`docs/informe-ia.md`):
- Whisper no separa voces. En modo diálogo la IA atribuyó al paciente cosas que dijo el fisio, y al revés; el modo dictado lo corrigió.
- La capa 3 de verificación con IA (extraer datos del texto libre y compararlos) detectó un 32 % de los fallos conocidos y quedó aparcada.
- En 29 rondas, la mayoría de los fallos fueron datos inventados o mal colocados que sí estaban estructurados.

Por eso la lógica clínica (urgencias, derivaciones, criterio compuesto, árbol, puntuación por LR) **no se infiere nunca del audio**. Sigue dependiendo de toques explícitos, como hoy. El audio sustituye solo al **texto libre**, que es lo que más tiempo cuesta en consulta y lo que la IA ya redacta bien.

## Principios

1. **La seguridad no depende del audio.** Una urgencia solo salta si alguien toca SÍ. El audio puede *avisar* de una posible discrepancia (decisión 6), nunca marcar ni desmarcar.
2. **Sin marcar no es «No».** En modo guía, una pregunta sin tocar es «no preguntada», no «NO» (decisión 3).
3. **Nada bloquea.** Como en el modo breve, la app no impide avanzar; lo que falta se dice en el cierre, en los resúmenes y en el payload.
4. **Lo que no está en el audio no consta.** La IA no rellena respuestas plausibles a las preguntas de la guía (decisión 9).
5. **Misma app, misma sesión.** El modo guía es una forma de registrar sobre el mismo `state`, no una app ni un estado aparte. Todo lo que hoy funciona (resúmenes, payload, fase 6, export `.json`) sigue igual.
6. **Sin contenido clínico nuevo.** La guía reordena y presenta lo que ya existe en `data/` y `formularios/`; no añade preguntas.

## Los tres niveles de cada campo

| Nivel | Qué significa | Cómo se registra |
|---|---|---|
| **A · Toque obligatorio** | Mueve la lógica de seguridad o el razonamiento (urgencias, derivaciones, árbol, región, lado) | Botón. Si queda sin tocar, sale como pendiente en el cierre, arriba y en rojo si es una urgencia |
| **B · Toque opcional** | Mueve algo, pero no de seguridad (NRS, irritabilidad, resultado de tests, chips) | Botón. Sin tocar = no registrado, como hoy |
| **C · Pregunta verbal** | Hoy es texto libre | Desaparece la caja; queda la pregunta como **apunte para decirla en voz alta**, con un check opcional «preguntado». La respuesta sale solo del audio |
| **D · Número con teclado de toques** | Número que mueve lógica (edad, semanas, TA) | Teclado numérico propio de la app (botones 0–9 grandes), no el teclado del sistema |

## Clasificación de lumbar, campo a campo

### Fase 1

| Campo | Hoy | Nivel | Notas |
|---|---|---|---|
| Nombre del paciente `#patientName` | texto | — | Ver decisión 1 (sin nombre no se guarda la sesión) |
| Modo de consulta | botón | B | Sin cambios |
| Motivo de consulta `#motivoConsulta` | texto | C | «¿Qué le trae por aquí?» |
| Formulario previo, cara 1 | mixto | ver abajo | |
| Mecanismo | botón | A | Las pistas del formulario se ven si existen |
| Cronología | botón | A | La usa `criterioCompuesto` (`l_espondilo`) |
| Cirugía: intervención, restricciones, «otra» complicación | texto | C | Con mecanismo Post-quirúrgico. Sin restricciones escritas, la app seguirá diciendo «Restricciones pendientes de confirmar con el cirujano» aunque estén en el audio (ver decisión 11) |
| Cirugía: fecha / semanas | fecha / número | D | Línea «Hoy» de los tiempos de tejido |
| Cirugía: protocolo, complicaciones (chips) | botón | B | |
| Tarjetas de condiciones especiales (estado, filas, chips) | botón | A | Activan sistemas de cribado con urgencias |
| Mastocitos «otro desencadenante» | texto | C | |
| Embarazo: semanas, semanas posparto | número | D | Visibilidad de preguntas y regla de TA |
| Embarazo: fecha del parto | fecha | D | |
| Fármacos que toma (chips) | botón | B | |
| Banderas rojas br1–br4 | SÍ/NO | A | Hoy vienen en NO: ver decisión 3 |
| Riesgo psicosocial, `psico_*` | botón | B | |
| Edad `#edadPaciente` | número | D | La usan el criterio de Goodman (`edadMax: 45`), el corte de Beighton y la regla de osteoporosis |
| Sexo | botón | B | |
| Signos vitales y antropometría | número | D (TA) / C (resto) | La TA solo mueve lógica con la tarjeta de embarazo; el resto puede decirse en voz alta |

### Formulario previo

- **Cara 1 (común):** todo lo que es `unica`/`multi`/`escala` queda como botones (B). Las preguntas `texto` (`desde_cuando`, `episodio_previo`, `actividad_1..3`, `probado_sirvio`, `enfermedades`, `operaciones`, `medicacion`) y los `detalle` de las opciones pasan a C.
- **Cara 2 (lumbar):** igual. `deporte`, `algo_mas` y los `detalle` de `postura_alivio` y `traumatismo` pasan a C. La matriz `empeora` queda en B.
- Las `pistas` de los pasos del árbol siguen funcionando con lo que se haya tocado. Lo que esté solo en el audio no aparece en «📝 Refiere el paciente»: es un recordatorio, no una respuesta (decisión 10).

### Fase 2

| Campo | Hoy | Nivel | Notas |
|---|---|---|---|
| Región y lado (silueta) | botón | A | |
| Preguntas con `urgencia` (`l6`, `l_e8`, `l_v4`, `sx_sincope`, `hem_5`, `hem_6` y las de los sistemas condicionales) | SÍ/NO | A | Las más importantes del modo. Ver decisiones 3 y 6 |
| Preguntas con `derivacion` (`l_u5`, `l_u6`) | SÍ/NO | A | |
| Resto de preguntas de cribado (39 fijas en lumbar, en 8 sistemas) | SÍ/NO | A | Con el embudo por sistema del modo breve, si se combina (decisión 8) |
| Bloques de las condiciones especiales (cuestionario de hipermovilidad, Beighton, prueba de bipedestación, factores de osteoporosis, caídas, ánimo y suelo pélvico) | botón / número | B / D | La prueba de bipedestación lleva FC y TA por minuto (D) |
| Notas de cribado | texto | C | |

### Fase 3

| Campo | Hoy | Nivel | Notas |
|---|---|---|---|
| NRS | botón | B | |
| Matriz de irritabilidad o nivel directo | botón | B | |
| Impacto en las actividades | botón | B | |
| Naturaleza, estabilidad | botón | B | |
| Signo comparable `#signoComparable` | texto | C | Muy útil decirlo en voz alta durante la exploración: «flexión a 40º con dolor 6» |
| Síntomas: zonas, lado, profundidad, patrón, relación | botón | B | |
| Síntomas: descripción | texto | C | |

### Fase 4 y 4b

Todo son botones: opciones del árbol (A) y resultados pos/neg/nd de los tests (B). No cambia nada salvo la presentación. Los tests son el mejor sitio para las **frases ancla** (decisión 5).

### Fase 5 y 6

- Notas del plan (`variableControl`, `ventanaRecuperacion`, `anclajeHabito`): C.
- Fase 6: las elecciones son botones; las notas, C.
- La tarjeta del informe con IA: el audio entra por «📎 Adjuntar audio» (decisión 7).

## Decisiones

Cada una con la recomendación primero.

1. **Sesión sin nombre.** Hoy `saveSession()` solo guarda si hay nombre, así que una recarga perdería la valoración.
   - **Recomendado:** al entrar en modo guía, si no hay nombre, poner uno automático («Paciente 10:42», editable después). Así se guarda como cualquier otra sesión y el export `.json` funciona.
   - Alternativa: guardar sin nombre solo en modo guía. Cambia una regla que hoy protege contra sesiones fantasma (`_sessionCleared`); más riesgo.
2. **Números sin teclado.** Edad, semanas, fechas y TA.
   - **Recomendado:** un teclado numérico propio, con botones grandes 0–9 y «Borrar», en una hoja inferior. Son toques, no escritura, y valen para cualquier número.
   - Alternativa: tramos de edad con botones. Se pierde precisión: los cortes de las reglas no coinciden (Goodman < 45, Beighton ≤ 50 / > 50, osteoporosis ≥ 50).
3. **«Sin marcar» = «no preguntado».** Hoy las preguntas SÍ/NO vienen en NO y las banderas rojas br1–br4 también.
   - **Recomendado:** en modo guía, empiezan sin respuesta. El cierre (fase 5, `📋 Notas`, payload `pe`) lista lo no preguntado, con las urgencias arriba y en rojo. Nunca bloquea. Para que un NO conste, se toca NO. Sin esto, olvidar un toque guardaría un NO falso que nadie ve.
   - Hay que repasar todo lo que hoy lee `'NO'` por defecto (alerta sistémica, `ur`, `sq`, embudo, pendientes): «sin respuesta» nunca cuenta como positivo.
4. **Preguntas de texto como apunte verbal.** Desaparece la caja de texto y queda la pregunta.
   - **Recomendado:** una frase corta para decir en voz alta («¿Cómo empezó?»), con el enunciado completo plegado, y un check opcional «preguntado» que no da la respuesta. El fisio no tiene que leerla literal. Solo las preguntas que aportan al informe; si la guía se alarga, no se usa.
   - Las frases cortas se escriben a mano por región, en `formularios/` (campo nuevo, p. ej. `verbal`), y las revisa el fisio.
5. **Frases ancla en la exploración.**
   - **Recomendado:** en los tests de 4b y en el signo comparable, sugerir decir el resultado en voz alta al marcarlo («Slump positivo a la derecha», «flexión 40º, dolor 6»). Es dictado intercalado: reduce el problema de quién dijo qué sin tener que dictar todo al final. Solo una sugerencia visual; no cambia la lógica.
6. **Contrastar la transcripción con los botones.**
   - **Recomendado:** una regla nueva de la revisión automática (`lib/revision-informe.js`, capa 1, sin IA): por cada pregunta de urgencia, una familia de palabras clave. Si la transcripción las contiene y la pregunta está en NO o sin responder, «punto a revisar» de nivel `alto` con la frase citada. Empezar por las urgencias de lumbar (`l6`, `l_e8`, `l_v4`, `sx_sincope`, `hem_5`, `hem_6`) y medir falsos positivos con informes reales antes de ampliar.
   - Nunca marca nada: solo avisa.
7. **Entrada del audio.**
   - **Recomendado:** usar «📎 Adjuntar audio» tal cual (acepta mp3, m4a, wav, webm, ogg, mp4). Nada de integración directa con la grabadora.
   - Pendiente de comprobar con un archivo real exportado (ver «Por comprobar»): formato, tamaño y si una consulta de 45–60 min cabe en los 25 MB de Whisper. Si no cabe, hay que comprimir o trocear, y eso es trabajo en el worker de physiq-report, no aquí.
   - Modo de audio: «Consulta (diálogo)», con las frases ancla. Dictar un resumen al final sigue siendo posible.
8. **Relación con el modo breve.**
   - **Recomendado:** son independientes. `modo` sigue siendo `completo | breve` (cuánto se explora); un campo nuevo (p. ej. `state.registro: 'teclado' | 'guia'`) dice cómo se registra. Se puede hacer una consulta breve en modo guía. Viaja en el payload para que physiq-report sepa que el texto libre está en el audio.
9. **Regla de prompt «no consta».**
   - **Recomendado:** en modo guía, el prompt del informe incluye la lista de preguntas verbales de la guía, cada una con su sección (`ia: 'historia' | 'sintomas' | 'actividades' | 'contexto'`) y si se marcó «preguntado». Regla: buscar la respuesta en la transcripción; si no está, «no consta». Nunca deducirla de los botones ni de lo habitual.
   - Es una regla del prompt de PhysiQ, no de `lib/reglas-informe.js` (compartido con physiq-report), salvo que physiq-report también adopte el modo.
10. **Pistas del formulario en el árbol.**
    - **Recomendado:** sin cambios. Solo muestran lo tocado. No se intenta extraer del audio para rellenarlas.
11. **Datos de texto que hoy cambian textos de seguridad.** Las restricciones de la cirugía y su protocolo deciden la frase «Restricciones pendientes de confirmar con el cirujano»; la intervención da nombre a `pq1`.
    - **Recomendado:** sin cambios en la lógica. En modo guía, el protocolo se marca con botón (ya lo es) y las restricciones quedan en el audio; la app seguirá diciendo «pendientes de confirmar» si no se escriben. Es lo prudente: la app no sabe lo que dijo el audio.
12. **Alcance del piloto.**
    - **Recomendado:** lumbar, solo standalone (el informe con IA solo existe fuera del hub). Las demás regiones, cuando lumbar esté revisado con consultas reales.
13. **Consentimiento.**
    - **Recomendado:** la casilla obligatoria de la tarjeta se mantiene. Además, la guía empieza con un recordatorio: informar al paciente y pedir consentimiento al empezar a grabar, que queda en el audio. Grabar la exploración entera no es lo mismo que grabar un rato de entrevista.
14. **Transcripción de la propia grabadora** (Plaud transcribe y separa interlocutores en su nube).
    - **Recomendado:** no en esta versión. Resolvería el problema de quién dijo qué, pero el audio clínico pasaría por un tercero. Antes hay que revisar su tratamiento de datos de salud (RGPD, contrato de encargo de tratamiento). Se puede retomar como entrada opcional de «transcripción ya hecha».

## Cómo se mide si funciona

Con lo que ya existe en `tests/fixtures/informes/` y `lib/revision-informe.js`:
- Informes en modo guía frente a formulario + audio, misma región: ¿menos puntos a revisar? ¿Menos «no consta» indebidos?
- Cuántas preguntas de urgencia quedan sin responder al cierre en consultas reales.
- Falsos positivos de la regla de la decisión 6.
- Tiempo de consulta y si el fisio usa la guía o la abandona.

Si los informes no mejoran, la guía es solo comodidad. Si mejoran, es la forma natural de usar la app standalone.

## Por comprobar fuera de la app (antes de programar)

1. Exportar de la grabadora el audio de una consulta real y ver formato, bitrate y tamaño. ¿Cabe una consulta de 45–60 min en 25 MB?
2. Adjuntar ese archivo en la tarjeta tal cual y ver si Whisper lo transcribe bien, sobre todo durante la exploración (distancia, ruido, movimiento).
3. Si se quiere usar la transcripción de la grabadora (decisión 14): su política de datos de salud.

## Orden de trabajo y modelo para cada parte

Una parte por sesión. Opus donde hay riesgo clínico o hay que encontrar cada sitio que lee un dato; Sonnet para el trabajo mecánico, con este documento como guía.

| Paso | Qué | Modelo | Por qué |
|---|---|---|---|
| 0 | Comprobar el audio de la grabadora («Por comprobar», puntos 1 y 2) | — (lo hace el fisio) | Si no cabe en 25 MB, antes hay que resolver la compresión o el troceo en el worker de physiq-report, y cambia el orden |
| 1 ✅ | Decisión 3: «sin marcar» = «no preguntado», con sus tests (hecho 2026-10, ver «Paso 1: lo implementado») | **Opus** | Hoy mucha lógica da por hecho el `'NO'` por defecto (alerta sistémica, `ur`, `sq`, embudo, pendientes, condiciones especiales, resúmenes). Un sitio olvidado podría ocultar una urgencia. Es la base del resto |
| 2 ✅ | Vista guía (`modo-guia`, `registro`), nombre automático, teclado numérico, apuntes verbales con check «preguntado», frases ancla, payload, tests unitarios y sección del smoke test (hecho 2026-10, ver «Paso 2: lo implementado») | **Sonnet** | Presentación y datos siguiendo patrones que ya existen (`modo-breve`) |
| 3 ✅ | Frases cortas `verbal` en `formularios/comun.js` y `formularios/lumbar.js` (hecho 2026-10, revisado: se dicen de «tú», ver «Paso 3») | **Sonnet** + revisión del fisio | Redacción breve de preguntas que ya existen |
| 4 ✅ (falta calibrar) | Decisión 6 (regla de urgencias contra la transcripción) y decisión 9 (lista de preguntas y regla «no consta» en el prompt), más el consentimiento (13) y el aviso de la tarjeta (hecho 2026-10, ver «Paso 4»; calibrar con el primer informe real grabado en modo guía) | **Opus** | Criterio clínico y calibración con informes reales |
| 5 ✅ | El resto de regiones: frases `verbal` de sus formularios y sus preguntas de urgencia contra la transcripción (hecho 2026-10, ver «Paso 5») | **Opus** | Criterio clínico en los patrones |
| 6 ✅ (falta calibrar) | Las urgencias de las condiciones especiales contra la transcripción (hecho 2026-10, ver «Paso 6») | **Opus** | Criterio clínico, como el paso 4 |

## Paso 1: lo implementado (decisión 3)

Sin selector todavía (es del paso 2): el modo se activa con `state.registro = 'guia'`.
- `state.registro`: `'teclado'` (por defecto; las sesiones antiguas se normalizan a él al restaurar) | `'guia'`. Sobrevive a «Reiniciar» como `modo`.
- En guía, `buildSistemicoQuestions()` no rellena `sistemicoAnswers` con NO y el botón NO no viene marcado; `banderasRojasIniciales()` da `''` a br1–br4. `_pintarBanderasRojas()` repinta los botones de la fase 1 al restaurar y al reiniciar (antes, tras «Reiniciar», quedaba marcado el botón de la sesión anterior).
- Todo lo que cuenta positivos ya leía solo `'SI'` (alerta, `ur`, `dv`, `sq`, `br`, criterio compuesto, regla vascular de hipermovilidad, recordatorio del periné, guía de condiciones): una pregunta sin respuesta nunca es positiva. Un test unitario falla si algún módulo compara esas respuestas con `!== 'NO'`.
- `getNoPreguntadas()` → urgencias sin responder (siempre, también en breve), banderas rojas sin responder y, por sistema, cuántas preguntas faltan (en breve, las no urgentes de un sistema sin embudo en SÍ ya las cubren sus pendientes). Las `privada` del embarazo nunca dan su texto.
- Salidas: payload `np` (solo si hay algo, así la huella de los informes ya generados no cambia); fase 5 abre con un aviso rojo, nunca plegado, de urgencias y banderas sin preguntar, y aparte el resto; `📋 Notas` «Cribado sistémico: sin positivos en lo preguntado (incompleto)» + «❔ SIN PREGUNTAR:»; `📄 Informe` «…en las preguntas realizadas; el cribado no se completó en esta sesión»; prompt del informe con IA: «Negativas en lo preguntado», cribado «incompleto» y la lista con la instrucción de no presentarla como negativa.
- Criterio de Goodman: con preguntas del criterio sin responder que aún podrían cumplirlo, dice que aún no se puede aplicar en vez de callar.
- En modo teclado no cambia nada: todo empieza en NO y `np` nunca aparece.
- Tests: `tests/unit/modo-guia.mjs`; smoke, sección `modo-guia`.
- physiq-report aún no lee `np` (campo nuevo y opcional: lo ignora).

## Paso 2: lo implementado (decisiones 1, 2, 4, 5, 8)

- **Selector «Cómo se registra»** (`#registroConsulta`, fase 1, bajo «Tipo de consulta»): «Teclado» / «🎙 Guía (grabadora)» (`selectRegistro()`). Solo fuera del hub (`.in-hub .registro-bloque` oculto; una sesión restaurada en el hub vuelve a `'teclado'`). `body.modo-guia` lo gobierna todo por CSS (`.solo-guia`).
- **Cambiar de registro a mitad** (`_aplicarRegistro()`): a «Guía», los NO que no se marcaron a propósito quedan sin responder (no se sabe si se preguntaron) y los SÍ se mantienen; de vuelta a «Teclado», lo sin responder pasa a NO. Pasada la fase 1 pregunta antes (`showConfirmBanner`). Repinta el cribado y vacía la 4b.
- **Nombre automático** (decisión 1): al pasar a guía sin nombre, o al avanzar de la fase 1 sin nombre, «Paciente HH:MM» (`nombreAuto()`), editable. «Borrar sesión» deja `maxVisitedIdx` en 0, así que no se rehace sola.
- **Frases en voz alta** (decisión 4): `data/guia.js` (`VERBALES`: motivo, signo comparable, intervención y restricciones de la cirugía) y las preguntas `texto` del formulario previo (`it.verbal || it.texto`; el campo `verbal` corto lo escribe el paso 3). Con la caja vacía se sustituye por la frase + check «Preguntado» (`state.preguntado`, no da la respuesta); con texto ya escrito la caja se queda, nunca se esconde un dato.
- **Teclado numérico** (decisión 2): en los números de la fase 1 (edad, constantes, talla y peso, semanas de cirugía y de embarazo) el teclado del sistema no se abre (`inputmode="none"`) y sale una hoja con 0–9, coma decimal donde el campo la admite, ⌫, Borrar y Listo. Respeta el `max` del campo y dispara `input`/`blur`, así que corren los manejadores de siempre. Los números de otras tarjetas (prueba de bipedestación, calculadora) no cambian.
- **Frases ancla** (decisión 5): cada test de la 4b lleva «🎙 Dilo en voz alta al marcarlo: «Slump, positivo a la derecha»» (solo en guía; con el lado de la fase 2); el signo comparable lleva un ejemplo.
- **Payload** `rg: 'guia'` (solo en guía, para no cambiar la huella de lo demás).
- **Fuera de este paso**: la lista de preguntas verbales y la regla «no consta» en el prompt (decisión 9) y el contraste con la transcripción (decisión 6), que son del paso 4; las frases cortas `verbal` de los formularios, del paso 3. Las pantallas de Atrás del móvil no cierran el teclado numérico (se cierra con Listo, el velo o Escape).
- Tests: `tests/unit/modo-guia.mjs`; smoke, sección `modo-guia` (390 px el selector, la frase, el teclado, y 1280 px el cribado, las frases ancla y la fase 5).

## Paso 3: las frases cortas (decisión 4)

Campo nuevo `verbal` en las preguntas `texto` y en el `detalle` de una opción (`detalle: { opcion, etiqueta, verbal }`) de `formularios/comun.js` y `formularios/lumbar.js`. Solo se lee en modo guía, con la caja vacía (`textareaOVerbal()`, `formulario.js`); sin `verbal` sale el enunciado literal del papel. Nunca llega a los resúmenes, al payload ni al prompt (test unitario). Reglas que fija un test: pregunta completa con «¿…?», como mucho 75 caracteres y **de «tú»** al paciente (decisión del fisio: más cercano; nunca «le», «su», «usted»). Las demás regiones siguen sin `verbal` (su formulario sale con el enunciado) hasta que lumbar esté revisado con consultas reales.

| Pregunta | Frase corta |
|---|---|
| `desde_cuando` | ¿Desde cuándo te pasa? |
| `desencadenante` (detalle) | ¿Qué fue lo que lo desencadenó? |
| `episodio_previo` | ¿Cuándo fue la última vez que te pasó y cuánto te duró? |
| `actividad_1` | ¿Qué es lo que más has dejado de hacer, o haces peor, por esto? |
| `actividad_2` | ¿Qué otra cosa te cuesta? |
| `actividad_3` | ¿Y una tercera cosa que te cueste? |
| `probado_sirvio` | ¿Te sirvió de algo lo que has probado? |
| `enfermedades` | ¿Qué enfermedades importantes tienes o has tenido? |
| `operaciones` | ¿Te han operado alguna vez? ¿Cuándo? |
| `medicacion` | ¿Qué medicación tomas ahora? |
| `postura_alivio` (detalle, lumbar) | ¿Qué postura o movimiento te lo alivia? |
| `traumatismo` (detalle, lumbar) | ¿Qué golpe, caída u operación de columna tuviste? |
| `deporte` (lumbar) | ¿Haces algún deporte o actividad repetitiva? ¿Cuál y cuántos días? |
| `algo_mas` (lumbar) | ¿Algo más que quieras contarme o que te preocupe? |

Las de la fase 1 y 3 (motivo, signo comparable, cirugía) viven en `data/guia.js` (`VERBALES`) y se revisan igual.

## Paso 4: lo implementado (decisiones 6, 9 y 13)

Hecho sin el Plaud; lo que depende de una grabación real queda en «Pendiente con la grabadora».

- **Consentimiento (13):** al pasar a «Guía», un aviso («Al empezar a grabar, informa al paciente y pídele su consentimiento: así queda en el audio») y la misma frase bajo el selector. La casilla de consentimiento de la tarjeta del informe sigue igual.
- **Tarjeta del informe:** en modo guía dice que los textos libres están en el audio; sin audio, lo dice como advertencia (el informe solo tendría lo marcado con botones).
- **Prompt (9):** la lista de preguntas hechas de palabra cuya caja quedó vacía (fase 1 y 3 y formulario previo; solo las visibles y la cirugía solo en posquirúrgico), agrupadas por la sección del informe y con «(marcada como preguntada)». Regla con audio: buscar cada respuesta en la transcripción; si no está, omitirla, sin deducirla y sin «no refiere», «niega» ni «no consta». Sin audio: omitirlas todas. Fuera del modo guía el prompt no cambia.
- **Urgencias contra la transcripción (6):** si en la consulta se habla de lo que pregunta una de las 6 urgencias de lumbar y esa pregunta está en NO o sin responder, un punto a revisar de nivel alto, con la frase de la consulta. Se salta lo que va dentro de una pregunta (el fisio preguntando) y lo negado. Funciona también en modo teclado (ahí el NO es por defecto). Medido con las 25 transcripciones reales de `tests/fixtures/informes/`, con todas las preguntas sin responder: 2 avisos falsos al principio («la pantorrilla está blanda, no está caliente»), 0 tras corregirlo.

### Pendiente con la grabadora

- Formato, tamaño y transcripción del audio del Plaud (25 MB).
- Calibrar los patrones de las urgencias y ampliarlos a las demás regiones con consultas reales en modo guía.
- Revisar con un informe real si la regla del prompt hace que la IA omita bien lo que no está en la transcripción, sin inventar ni llenar de «no consta».

## Paso 5: el resto de regiones (2026-10)

A petición del fisio, antes de revisar lumbar con consultas reales (cambia la decisión 12, que dejaba las demás regiones para después). El resto del modo guía ya era de las 7 regiones; solo faltaban dos piezas regionales:

- **Frases cortas (de «tú»):** las 6 preguntas de texto de los formularios de cadera (deporte; el «¿Cuál?» de un problema de cadera de pequeño), hombro (deporte; «¿Cuándo fue la última vez que se te salió?») y codo (deporte; «¿Cuánto tiempo te lo inmovilizaron?»). Cervical, rodilla y tobillo y pie no tienen preguntas de texto. El test de frases (presencia, «¿…?», 75 caracteres, tuteo) cubre ya los 8 formularios.
- **Urgencias contra la transcripción:** las 30 preguntas de urgencia regionales de las otras 6 regiones, con patrones que apuntan al dato rojo concreto y no al tema (golpes, caídas, hinchazón y «no puedo mover…» son lo habitual en consulta; las luxaciones previas del hombro las pregunta su formulario). TVP, ectópico, fiebre, dolor torácico e isquemia comparten patrones entre regiones. Un test exige una entrada por cada pregunta de urgencia regional (ni más ni menos) y un ejemplo detectado por pregunta, más frases habituales que no deben saltar. Con las 36 preguntas sin responder y de cualquier región sobre las 25 transcripciones reales: 0 avisos. Nuevo: una negación justo después («Fiebre, no») también lo descarta.
- **Fuera:** las urgencias de los sistemas de las condiciones especiales, hechas en el paso 6.

## Paso 6: las urgencias de las condiciones especiales (2026-10)

- **Qué:** las 39 preguntas de urgencia de los sistemas que solo se ven con su tarjeta de la fase 1 marcada, también en `CONTRASTE_URGENCIAS` (`data/guia.js`): posquirúrgico (7), hipermovilidad (3), disautonomía (4), lupus (6), osteoporosis (1), embarazo o posparto (12) y anticoagulado o antiagregado (6). El trastorno mastocitario no tiene ninguna. Solo cuentan con la tarjeta marcada: `respuestasUrgentes()` lee `sistemasActivos()`, como el resto del cribado.
- **Familias nuevas** compartidas entre tarjetas: falta de aire brusca o tos con sangre (`AIRE`; solo con «de golpe/de repente», porque al subir escaleras o en el embarazo es lo habitual), ictus (`ICTUS`), síndrome compartimental (`COMPARTIMENTAL`), esfínteres (`ESFINTERES`, que ahora usa también `l6`), síntomas nerviosos nuevos desde la operación y desmayo (`DESMAYO`), más el brazo hinchado junto a la TVP. Una frase puede dar dos puntos (la TVP regional y la de su tarjeta, por ejemplo): son dos preguntas distintas, y cada una está sin marcar.
- **Las dos `privada`** del embarazo (psicosis posparto e ideas de autolesión) llevan un tema genérico, «un posible problema de salud mental urgente tras el parto», nunca el texto de su pregunta (decisión 11 de `docs/embarazo-posparto.md`; test).
- **Medido** con las 75 preguntas sin responder sobre las 25 transcripciones reales: solo avisa en la de Javier, que cuenta «me dio de golpe un dolor de cabeza muy fuerte, el peor de mi vida». Es un verdadero positivo: su `cv_ar4` está en SÍ, y una cefalea así es también una alarma en el embarazo y con anticoagulantes. El patrón de `cv_ar4` no la reconocía y se amplió («de golpe … dolor de cabeza», «el peor de mi vida»). El test fija esos tres avisos y ninguno más, comprueba que con su `cv_ar4` en SÍ no hay aviso, y exige un ejemplo detectado por pregunta, más frases habituales que no deben saltar (falta de aire al subir escaleras, dedos blancos con el frío que se pasan, «desde la operación estoy mucho mejor»…).
- **Pendiente:** calibrarlo con consultas reales de pacientes con alguna de estas tarjetas.

## Cambios técnicos (cuando se acepten las decisiones)

Orientativo, para estimar:
- `state.js`: `registro`; respuestas sin valor por defecto en modo guía (decisión 3); check «preguntado» por pregunta verbal.
- `app.js`: clase `modo-guia` en `<body>` que oculta por CSS las cajas de texto y muestra los apuntes verbales (mismo patrón que `modo-breve`); nombre automático; teclado numérico; cierre con lo no preguntado; payload.
- `formularios/comun.js` y `formularios/lumbar.js`: frases cortas `verbal`.
- `lib/informe-narrativo.js`: lista de preguntas de la guía y regla «no consta».
- `lib/revision-informe.js`: regla de urgencias contra transcripción, con informes reales en los fixtures.
- Tests: unitarios (sin respuesta nunca cuenta como positivo; ninguna urgencia queda oculta; nada del modo cambia el payload fuera de él) y una sección del smoke test que recorra lumbar sin teclear.
