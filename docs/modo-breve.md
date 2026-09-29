# Modo breve (consulta de aseguradora, 10 min) — diseño

Estado: **propuesta, sin implementar**. Hay decisiones clínicas abiertas (al final) que tiene que tomar el fisio antes de tocar código.

## Punto de partida (medido en el código, septiembre 2026)

| Región | Pasos del árbol CIF | Sistemas de cribado | Preguntas de cribado | De ellas con `urgencia` | Hipótesis | Tests |
|---|---|---|---|---|---|---|
| Hombro | 6 | 11 | 28 | 0 | 11 | 48 |
| Cadera | 9 | 8 | 29 | 3 | 19 | 70 |
| Cervical | 8 | 10 | 29 | 4 | 14 | 47 |
| Lumbar | 6 | 7 | 30 | 1 | 9 | 37 |
| Rodilla | 10 | 7 | 25 | 6 | 20 | 82 |
| Codo | 5 | 4 | 14 | 0 | 9 | 22 |
| Tobillo y pie | 13 | 8 | 25 | 3 | 36 | 119 |

Solo hay dos bloqueos para avanzar: elegir la región (`#btnContinuarSinss`) y completar el árbol (`#btnGoConfirm`). Las fases 1 y 3 no obligan a nada. Por tanto, lo que alarga la consulta no son las validaciones, sino el **volumen**: unas 25–30 preguntas de cribado y las tarjetas de tests de la 4b.

`alerta: true` está en casi todas las preguntas (p. ej. 28 de 28 en hombro), así que **no sirve** para filtrar un cribado reducido. Un cribado breve no puede sacarse de los datos actuales sin una decisión clínica nueva, o sin cambiar la forma de preguntar (ver fase 2).

## Principios

1. **La seguridad no se recorta.** Banderas rojas de fase 1, preguntas con `urgencia`, el recuadro `urgencia` de la región y la alerta de derivación funcionan igual que en el modo completo. Lo que se acorta es la exhaustividad, nunca el cribado de lo urgente.
2. **Transparencia.** Todo lo que el modo breve omite queda dicho en 📋 Notas, 📄 Informe y en el payload (`md: 'breve'`). Un informe breve no puede leerse como una valoración completa.
3. **Valoración por etapas, no valoración recortada.** Lo omitido queda como **pendiente** en la sesión y la siguiente consulta lo retoma. 10 minutos permiten un triaje seguro con una hipótesis de trabajo; la exhaustividad se completa en las sesiones de tratamiento.
4. **Sin contenido clínico nuevo inventado.** El modo breve reordena y pliega lo que ya existe. Donde haría falta una selección clínica (p. ej. «los 2 tests clave de cada hipótesis») se deja como decisión del fisio, no la elige el código.

## Flujo propuesto (presupuesto de tiempo orientativo)

### Selector de modo — fase 1, arriba
`Consulta completa` / `Consulta breve (10')`. Nuevo campo `state.modo: 'completo' | 'breve'` (por defecto `'completo'`, así que las sesiones antiguas no cambian). Se guarda en la sesión y viaja en el payload como `md`. Se puede cambiar en cualquier momento; al pasar de breve a completo simplemente aparece lo plegado.

### Fase 1 — triaje (≈ 2 min)
- Se queda: nombre, edad, motivo (con dictado y chips), mecanismo, cronología, las 4 banderas rojas y el riesgo psicosocial (un solo botón Bajo/Medio/Alto).
- Se pliega (tras «+ más datos»): signos vitales, antropometría y los tres ítems `psico_*`.
- Formulario previo: el botón sigue ahí, pero en breve no se espera rellenarlo en consulta (ver «Formulario previo», abajo).

### Fase 2 — cribado en embudo (≈ 2 min)
Lo que cambia es la forma de preguntar, no el contenido:
1. **Preguntas con `urgencia`** (`l6` cauda equina, `r1` artritis séptica, `r_v2` TVP…): siempre visibles, una a una, como hoy.
2. **Un «¿algo de esto?» por sistema**: cada sistema se muestra plegado con su título y sus `banderasRojas` como texto. Un solo SÍ/NO por sistema (7–11 clics por región). Con NO, el sistema queda contestado como «sin hallazgos (cribado breve)». Con SÍ, se despliegan sus preguntas completas, igual que hoy.
3. Hombro y codo no tienen preguntas de urgencia: solo usan el paso 2.

Así no hace falta elegir a mano un subconjunto de preguntas. Los sistemas en NO se marcan como cribados en embudo (`state.sistemicoBreve[sisId] = 'NO'`), no como si cada pregunta se hubiera respondido NO. El resumen distingue ambos casos.

### Fase 3 — SINSS mínimo (≈ 1 min)
- NRS: igual.
- Irritabilidad: en breve, un selector directo Baja/Moderada/Alta en lugar de la matriz de 5 filas; la matriz queda plegada. Hay que decidir si el nivel directo es válido o si se exige la matriz (decisión 2).
- Naturaleza, estadio y estabilidad: plegados y opcionales.

### Fase 4 — árbol CIF completo (≈ 2–3 min)
Se queda **entero**. Es el núcleo del razonamiento, y un árbol a medias activaría hipótesis equivocadas. Son 5–13 clics según la región; tobillo y pie, con 13, es el más largo. Las pistas del formulario previo se siguen viendo si existen.

### Fase 4b — confirmación opcional (≈ 1–2 min)
- Botón nuevo «Ver resultados sin confirmar →», visible solo en breve. Las hipótesis quedan como **hipótesis de trabajo sin confirmar**.
- Si se abre la 4b: por cada hipótesis activa se muestran primero los tests **que puntúan** (LR aplicable según `calcLRScore`: publicada, calculable, o por cluster). Los hallazgos van plegados. Es un criterio objetivo que ya existe en el código y no exige elegir tests a mano.
- Para no tener que abrir las 36 tarjetas de tobillo, se muestran por defecto las 2 primeras hipótesis activas y el resto plegadas.

### Fase 5 — cierre (≈ 1 min)
- Hipótesis de trabajo, derivación si la hay, PROM recomendado y dosis (o «a criterio del clínico»).
- **Pendientes para la próxima sesión**, generados automáticamente: sistemas cribados en embudo, tests de la 4b sin hacer, formulario previo vacío, matriz de irritabilidad sin completar.
- 📋 Notas y 📄 Informe añaden una línea fija: «Valoración inicial breve: cribado sistémico por sistemas y confirmación diagnóstica no exhaustivos; se completa en próximas sesiones». El informe al médico no debe parecer una valoración completa.

## Retomar en la siguiente sesión
Con la misma sesión abierta (mismo paciente, mismo navegador), un aviso en fase 1 («Valoración breve con N pendientes → completar») cambia a modo completo y lleva al primer pendiente. No hace falta nada nuevo: la sesión ya se restaura sola desde IndexedDB.

Límite real: IndexedDB es por dispositivo y por navegador. Si la siguiente sesión es en otro equipo, los pendientes no están, salvo en lo que haya llegado a physiq-report.

## Formulario previo en sala de espera
Es el mayor ahorro de tiempo posible (≈ 3–5 min), pero hoy lo rellena el fisio con el paciente delante (CLAUDE.md, «Formulario previo»). Que lo rellene el paciente en su móvil **no es viable sin backend**: su IndexedDB no llega al dispositivo del fisio. Opciones, de menos a más trabajo:
1. Formulario en papel en la sala de espera; el fisio solo transcribe lo que mueve el árbol (las `pistas`).
2. El paciente lo rellena en la tablet de la clínica, con la misma sesión y el mismo origen, antes de entrar.
3. Relleno remoto con sincronización. Necesita servidor y protección de datos de salud; queda fuera del alcance actual.

## Cambios técnicos (cuando se aprueben las decisiones)
- `state.js`: `modo`, `sistemicoBreve`. `buildPhysiQPayload()`: `md`, más la lista de pendientes.
- `app.js`: el selector de modo, clase `modo-breve` en `<body>` que pliega por CSS lo opcional (el mismo patrón que `.in-hub`), el embudo de `buildSistemicoQuestions`, el nivel directo de irritabilidad, los pendientes y las líneas de transparencia en los dos resúmenes.
- `phase4b.js`: orden «puntúan primero, hallazgos plegados» (se puede reutilizar la lógica de `calcLRScore`).
- `index.html`: botón «Ver resultados sin confirmar».
- Tests: unitarios para el embudo (un sistema en NO no genera respuestas por pregunta; una pregunta con `urgencia` nunca queda plegada) y el recorrido breve en `tests/smoke.mjs` para las 7 regiones.

## Decisiones abiertas (del fisio, no del código)
1. ¿El embudo por sistema (un SÍ/NO leyendo sus banderas rojas) es un cribado aceptable para 10 minutos, o se prefiere una lista corta elegida a mano por región (campo nuevo `breve: true` por pregunta)?
2. Irritabilidad: ¿vale el nivel directo, o se exige la matriz?
3. ¿El 📄 Informe breve debe llevar la línea «valoración no exhaustiva»? (Recomendado: sí.)
4. Formulario previo: ¿opción 1 o 2?
5. ¿Informe específico para la aseguradora (más corto, con hipótesis y número de sesiones propuesto)? El número de sesiones no está en ninguna fuente del repo: lo tendría que dar el fisio.
