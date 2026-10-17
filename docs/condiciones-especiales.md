# Guía de condiciones especiales

Estado: **implementado y fusionado (octubre 2026); la revisión del usuario se dio por hecha al fusionar.** El usuario aceptó las recomendaciones generales (botón en la cabecera, incluir el posquirúrgico, empezar solo con el botón) y las 8 decisiones del final. Seguimiento en `MIGRATION_PLAN.md`, Fase P.

## Para qué

La app tiene capas que solo se activan si el clínico las marca: el paciente posquirúrgico, la hipermovilidad / Ehlers-Danlos, la disautonomía / POTS y el lupus. Lumbar tiene además dos preguntas de condiciones poco conocidas (quiste de Tarlov y síndrome del cascanueces). Si el clínico no sabe que existen, o no piensa en ellas, no las marca, y la app no añade sus urgencias, sus avisos ni su red de seguridad.

El diálogo no enseña dónde están: enseña **cuándo pensar en ellas**, en lenguaje llano, y lleva a la tarjeta o la pregunta con un toque. Debe leerse en menos de un minuto.

## Qué no hace (reglas fijas)

- **Nunca marca nada.** Solo lleva a la tarjeta o a la pregunta; marcar es siempre decisión del clínico.
- **No diagnostica ni puntúa.** Sus pistas son una ayuda para recordar, no un criterio.
- **No salta solo.** Se abre desde la cabecera, cuando el clínico quiere.
- **No deja rastro clínico.** Nada va al payload, a 📋 Notas, al 📄 Informe ni al prompt de la IA; no guarda nada en la sesión.
- **No escribe contenido clínico nuevo.** Cada pista resume una pregunta que la app ya tiene, con la fuente que esa pregunta ya cita. Si una pista necesitara una fuente nueva, se lee entera antes, como siempre.

## Cómo se ve

### Entrada

- **Escritorio:** un icono más en la cabecera, sin borde, como los de tiempos de tejido y cuestionarios (decisión 1, el dibujo).
- **Móvil (≤768 px):** una opción más en «Herramientas», que ya agrupa los iconos que no caben. Se abre con el mismo patrón que las demás herramientas (`herramientaElegir('condiciones')`): Atrás la cierra y sigue en la fase.
- **En el hub también**, porque no usa la red. Oculto al imprimir.

### El diálogo

El mismo patrón que «⏱ Tiempos de recuperación» y la calculadora: hoja inferior con asa en móvil (deslizar, Atrás, velo o Escape la cierran) y diálogo centrado en pantallas anchas (hasta unos 560 px).

```
Condiciones especiales                                    [×]
Situaciones que cambian el cribado y el plan. Si una encaja,
márcala y la app añade lo que necesita.
Si el paciente ya tiene el diagnóstico, márcala siempre.

┌─────────────────────────────────────────────────────────┐
│ Paciente posquirúrgico                  [No marcado]    │
│ Le han operado de la zona que consulta.                 │
│ Piensa en ello si:                                      │
│  · el problema empezó o sigue tras una operación aquí   │
│ Añade: tarjeta «Cirugía» con el protocolo del cirujano, │
│ preguntas de complicaciones y el plan supeditado.       │
│                              [Ir a Mecanismo de inicio →]│
└─────────────────────────────────────────────────────────┘
┌ Hipermovilidad / Ehlers-Danlos          [Sospecha]      ┐
│ …                                                       │
└─────────────────────────────────────────────────────────┘
  (Disautonomía / POTS · Lupus)

SOLO EN LUMBAR
┌ Quiste de Tarlov                        [Sin responder] ┐
│ …                                [Ir a la pregunta →]   │
└─────────────────────────────────────────────────────────┘
  (Síndrome del cascanueces)

Esta lista orienta: no diagnostica ni marca nada por ti.
```

Cada fila:
1. **Nombre** y, a la derecha, su **estado** (una etiqueta pequeña; ver «Estado de cada fila»).
2. **Una línea en lenguaje llano** que diga qué es.
3. **«Piensa en ella si:»** con 2 o 3 pistas cortas, tomadas de las preguntas que la app ya tiene.
4. **«Añade:»** una línea con lo que cambia en la app al marcarla (resumen de la nota que ya lleva su tarjeta).
5. **Un botón** que cierra el diálogo, lleva a la fase y resalta el destino (`flash-destacar`, como `irACronologia()`):
   - condiciones transversales → la tarjeta en la fase 1;
   - el posquirúrgico → la tarjeta «Mecanismo de inicio», donde se elige «Post-quirúrgico»;
   - Tarlov y cascanueces → la pregunta en la fase 2 (`irAPreguntaCribado()`, que ya existe).
6. **Fuentes** al final, como citas que se pueden tocar (`citasHTML()`), las mismas que cita la pregunta de la que sale cada pista.

Al pulsar la fila entera no pasa nada: solo el botón navega, para que leer no te saque del diálogo.

## Contenido de cada fila

Las pistas resumen preguntas existentes; entre corchetes, de dónde sale cada una. «Redacción propia» = texto de la app que no afirma nada clínico nuevo.

### Paciente posquirúrgico

- **Qué es:** «Le han operado de la zona que consulta.» [redacción propia]
- **Piensa en ello si:**
  - el problema empezó o sigue tras una operación de esta zona. [definición de «Post-quirúrgico» en `docs/posquirurgico.md`]
- **Añade:** tarjeta «Cirugía» con el protocolo del cirujano, preguntas de complicaciones en la fase 2 (herida, trombosis, embolia…), la hipótesis «Postoperatorio» y el plan supeditado al protocolo. [resumen de `docs/posquirurgico.md`]
- **Botón:** «Ir a Mecanismo de inicio →».
- **Fuentes:** ninguna (no hay pista clínica que citar).

### Hipermovilidad / Ehlers-Danlos

- **Qué es:** «Articulaciones mucho más flexibles de lo normal; a veces, una enfermedad del tejido conectivo.» [redacción propia]
- **Piensa en ella si:**
  - se considera una persona «de goma» o muy flexible; [`cq5`]
  - se le salió el hombro o la rótula más de una vez de niño o adolescente; [`cq4`]
  - llega con las palmas al suelo sin doblar las rodillas, o con el pulgar al antebrazo. [`cq1`, `cq2`]
- **Añade:** su cribado en la fase 2 (cuestionario, escala de Beighton, sospecha del subtipo vascular), un aviso en los tests de laxitud y consideraciones para el plan. [nota de la tarjeta]
- **Botón:** «Ir a la tarjeta →» (`#cardHipermovilidad`).
- **Fuentes:** Malfait 2017 (tabla III, adaptado del cuestionario de Hakim y Grahame). [`cuestionarioFuente`]

### Disautonomía / POTS

- **Qué es:** «El cuerpo no se adapta bien a estar de pie: el corazón se acelera o baja la tensión.» [redacción propia]
- **Piensa en ella si:**
  - desde hace 3 meses o más, estar de pie le da mareo, palpitaciones o cansancio que se pasan al tumbarse; [`io1`]
  - le empeora con el calor, después de comer o al levantarse de golpe. [`io2`]
- **Añade:** las preguntas del desmayo de alto riesgo y la prueba de bipedestación en la fase 2, y consideraciones para el ejercicio y el plan. [nota de la tarjeta]
- **Botón:** «Ir a la tarjeta →» (`#cardDisautonomia`).
- **Fuentes:** Vernino 2021 · Raj 2020 · Sheldon 2015 · Hakim 2017 · Fedorowski 2019. [`sospechaFuente`]

### Lupus (LES)

- **Qué es:** «Enfermedad autoinmune que puede dar dolor en varias articulaciones, problemas de piel y fiebre.» [redacción propia]
- **Piensa en él si:**
  - tiene dolor e hinchazón, o rigidez por la mañana de 30 minutos o más, en 2 o más articulaciones, sobre todo de las manos; [`lr1`]
  - le sale una erupción en la cara que empeora con el sol; [`lr2`]
  - tiene llagas en la boca que vuelven, se le cae el pelo o tiene fiebre sin infección. [`lr3`, `lr5`]
- **Añade:** con «Diagnosticado», sus urgencias y derivaciones en la fase 2 y consideraciones para el ejercicio y el plan; con «Sospecha», los rasgos que justifican una valoración médica. [nota de la tarjeta]
- **Botón:** «Ir a la tarjeta →» (`#cardLupus`).
- **Fuentes:** Aringer 2019. [`rasgosFuente`]

### Solo en lumbar: quiste de Tarlov

- **Qué es:** «Quiste de una raíz nerviosa del sacro; a menudo no da síntomas.» [resumen de `docs/tarlov.md`]
- **Piensa en él si:**
  - desde hace meses le duele el sacro, el cóccix o el periné, peor sentado y mejor tumbado; [`l_u5`]
  - con molestias de orina, de heces o sexuales que ya tenía. [`l_u5`]
- **Añade:** una derivación médica preferente, no urgente, para valorar una RM sacra. [`derivacion` de `l_u5`]
- **Botón:** «Ir a la pregunta →».
- **Fuentes:** Paredes Mogica 2023 · Hulens 2018 · Klepinowski 2021: las del razonamiento de `l_u5` que respaldan las pistas (por qué empeora sentado y mejora tumbado, y los síntomas de S2–S4) y la línea «qué es» (solo uno de cada seis quistes da síntomas). Las otras cinco de `l_u5` tratan del diagnóstico y el tratamiento.
- **Añadido al implementar:** el «Añade» recuerda que, si algo de vejiga, intestino o silla de montar es nuevo o empeora, no es esto sino la pregunta de la cola de caballo, urgente (lo dice el «cuánto pesa» de `l_u5`).

### Solo en lumbar: síndrome del cascanueces

- **Qué es:** «Una vena del riñón izquierdo queda pinzada entre dos arterias.» [resumen de `docs/mals-cascanueces.md`]
- **Piensa en él si:**
  - desde hace meses tiene un dolor sordo en el costado o la zona lumbar izquierda, peor de pie y mejor tumbado; [`l_u6`]
  - y le han encontrado sangre en la orina, o tiene varices en el escroto izquierdo, o (en mujeres) dolor de pelvis que empeora de pie. [`l_u6`]
- **Añade:** una derivación médica preferente, no urgente, para descartar otras causas. [`derivacion` de `l_u6`]
- **Botón:** «Ir a la pregunta →».
- **Fuentes:** Penfold 2024 · Mačionienė 2026, de las de `l_u6`. Bruessel 2026 se queda fuera: trata la asociación con el Ehlers-Danlos, que no está en la fila.

### Solo en cadera: síndrome de congestión pélvica

Añadida después de fusionar la guía (2026-10, petición del usuario): la pregunta `ca_u6` entró a la vez que la guía (`docs/congestion-pelvica.md`).

- **Qué es:** «Venas de la pelvis dilatadas que se llenan al estar de pie; el dolor puede notarse en la ingle o la cadera.» [resumen del «¿Por qué?» de `ca_u6`]
- **Piensa en él si:**
  - en una mujer, desde hace meses, hay un dolor sordo o de peso en la pelvis, la ingle o la cadera, peor de pie o al final del día y mejor tumbada, [`ca_u6`]
  - y varices en la vulva, el periné, el muslo o la nalga, o un dolor que dura horas después de las relaciones sexuales. [`ca_u6`]
- **Añade:** una derivación médica preferente, no urgente, para descartar otras causas. Recuerda que un dolor pélvico nuevo con retraso de la regla no es esto, sino la pregunta urgente del embarazo ectópico (lo dice el «cuánto pesa» de `ca_u6`).
- **Botón:** «Ir a la pregunta →»; con otra región, «Elige cadera en la fase 2».
- **Fuentes:** Bałabuszek 2022 · Champaneria 2016 · Dos Santos 2016, las que cita el «¿Por qué?» de `ca_u6` para el mecanismo y la presentación como dolor de cadera.

El apartado y el botón de las filas de región salen del nombre de la región (`grupoRegion`, `sinRegion` en `data/condiciones.js`), así que una región nueva no necesita textos propios.

## Estado de cada fila

Una etiqueta pequeña, leída del `state` cada vez que se abre el diálogo:

| Fila | Etiquetas |
|---|---|
| Posquirúrgico | «Marcado» (mecanismo Post-quirúrgico) · «No marcado» |
| Hipermovilidad | «Diagnosticada» (+ subtipo si consta) · «Sospecha» · «No consta» |
| Disautonomía | «Diagnosticada» (+ tipo) · «Sospecha» · «No consta» |
| Lupus | «Diagnosticado» · «Sospecha» · «No consta» |
| Tarlov, cascanueces, congestión pélvica | «Sí» con la pregunta marcada y su región elegida; nada en otro caso (decisión 4) |

Las marcadas llevan el color de acento; «No consta» va en gris, sin color de alarma: no marcar es lo normal.

## Implementación (octubre 2026)

- `data/condiciones.js`: el texto de cada fila (qué es, pistas, «Añade», destino y fuentes), separado de la lógica como el resto del contenido clínico. Las pistas citan los ids de las preguntas de las que salen.
- `lib/condiciones.js` (puro): la etiqueta de estado de cada fila a partir del `state`, qué filas se ven según la región, y el HTML del diálogo. Con pruebas unitarias.
- `app.js`: `abrirCondiciones()` / `cerrarCondiciones()` con el patrón de las demás herramientas (hoja con historial en móvil, `_closeAllOverlays()`), `irACondicion(k)` (fase 1 + desplazamiento + `flash-destacar`, o `irAPreguntaCribado()` para las de lumbar) y la opción en `herramientaElegir()`.
  - En móvil la hoja tiene su entrada en el historial: `irACondicion()` la cierra con `history.back()` y navega solo cuando ese atrás ha llegado (`cerrarCondiciones({ despues })` → `_trasPop`, que el manejador de `popstate` ejecuta). Navegar antes juntaba dos movimientos del historial a la vez.
  - La tarjeta «Mecanismo de inicio» lleva ahora `id="cardMecanismo"`, el destino del posquirúrgico.
- `index.html`: el icono de la cabecera, la opción en «Herramientas» y el overlay.
- `tests/referencias.mjs`: contar sus citas como «condiciones especiales», para que `docs/referencias.md` sepa dónde se usan.
- **Pruebas unitarias:**
  - cada pista nombra una pregunta que existe, y cada fuente es una clave del registro o una cita de esa pregunta;
  - cada destino (`#cardHipermovilidad`, `l_u5`…) existe;
  - el estado de cada fila con cada combinación de la tarjeta;
  - nada del diálogo entra en el payload, 📋 Notas, 📄 Informe ni el prompt;
  - **abrir y cerrar el diálogo no cambia `state`** (no marca nada).
- **Prueba de humo**, sección `condiciones`:
  - abrir desde la cabecera (escritorio) y desde «Herramientas» (móvil);
  - cada botón lleva a su destino y lo resalta;
  - el estado cambia al marcar una tarjeta;
  - Atrás y Escape cierran sin cambiar de fase;
  - cabe a 320 px sin desbordar;
  - en el hub también aparece.
- Documentación: `CLAUDE.md`, `MIGRATION_PLAN.md` (Fase P) y este documento.
- **Mantenimiento:** una condición especial nueva (la congestión pélvica, si se hace) añade su fila aquí. Una prueba unitaria lo recordará: cada sistema `transversal_*` con `soloX` necesita una fila.

## Decisiones

Aceptadas las 8 recomendaciones (2026-10).

1. **Dibujo del icono.** *Recomiendo* una brújula (orientar), dibujada en línea como los demás iconos de la cabecera. Descarto:
   - la «ⓘ», que ya significa «¿Por qué?» en el razonamiento;
   - una bandera, que en la app significa bandera roja;
   - la estrella, que es la IA.
2. **Orden de las filas.** *Recomiendo* este:
   1. posquirúrgico, la más frecuente;
   2. hipermovilidad;
   3. disautonomía;
   4. lupus;
   5. aparte, bajo «Solo en lumbar», Tarlov y cascanueces.
3. **Tarlov y cascanueces fuera de lumbar.** *Recomiendo* mostrarlos siempre, en su apartado «Solo en lumbar», para que el clínico aprenda que existen. Con otra región elegida, su botón dice «Elige lumbar en la fase 2» y no navega. Ocultarlos fuera de lumbar escondería justo lo que el diálogo quiere enseñar.
4. **Estado de Tarlov y cascanueces.** El cribado guarda «NO» por defecto, así que no se distingue «preguntado y no» de «sin preguntar». *Recomiendo* mostrar solo «Sí» cuando está marcada y nada en otro caso, sin inventar un «No».
5. **El MALS.** No tiene pregunta propia: es un párrafo en la bandera de pérdida de peso de lumbar. *Recomiendo* no darle fila: no hay nada que marcar ni a dónde llevar al clínico.
6. **Aviso de novedad.** Un punto en el icono hasta la primera vez que se abre en ese dispositivo ayudaría a descubrirlo, pero es un aviso más en una cabecera ya llena. *Recomiendo* no ponerlo en esta primera versión, coherente con «empezar solo con el botón». Se puede añadir si ves que no se usa.
7. **Fuentes en cada fila.** *Recomiendo* mostrarlas como citas que se pueden tocar, al final de cada fila, siguiendo la regla de la app (todo texto con fuente la muestra).
8. **«Qué es» en redacción propia.** Las cuatro líneas «Qué es» de las transversales no tienen fuente: describen la condición en palabras llanas sin afirmar cifras ni criterios. *Recomiendo* dejarlas así y marcarlas como redacción propia en este documento. La alternativa sería quitarlas y dejar solo el nombre y las pistas.
