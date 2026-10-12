# «¿Por qué?» de los pasos del árbol CIF (fase 4)

Proyecto de contenido y de interfaz: que cada paso del árbol CIF de la fase 4 explique **por qué se hace esa pregunta en ese punto**, es decir, qué separa y hacia dónde apunta cada respuesta. Hoy el árbol dice *qué* preguntar, pero no *por qué*. Es el mismo sistema de las fases 2 (`docs/razonamiento-cribado.md`) y 4b (`docs/razonamiento-tests.md`), adaptado al árbol. Es material de apoyo al clínico: nunca entra en el payload, en los resúmenes (`📋 Notas`, `📄 Informe`) ni en el prompt del informe con IA.

**Una región por sesión.** El estado por región está en `MIGRATION_PLAN.md`, Fase I. El piloto es lumbar, que tiene 6 pasos y es la región de referencia. El diseño de abajo es una propuesta para validar con el usuario en el piloto; lo que él decida se apunta aquí.

## Diseño propuesto (2026-10, a validar en el piloto)

En cada paso del árbol (`renderStep`, `phase4.js`), de arriba abajo:

1. La pregunta del paso, como siempre.
2. **«ⓘ ¿Por qué esta pregunta?»** (`<details class="razon">` cerrado, el mismo estilo que en las fases 2 y 4b), debajo de la pregunta y antes de las opciones. Contenido (`razonamiento.porque`, 1–3 frases):
   - qué hipótesis separa el paso;
   - por qué va en este punto del orden (p. ej., lo radicular antes que lo mecánico);
   - qué implica cada respuesta.

   Al pie, las fuentes (claves del registro). **Solo con fuente leída; sin fuente, no hay campo** y no se pinta nada.
3. **«Ampliar →»** (solo con `detalle`): abre el panel compartido (`abrirPanelRazon()`, `app.js`) con Por qué, En detalle y Fuentes, cada fuente con su «Abrir ↗» a la `url` o al DOI del registro.
4. Las opciones, sin cambios.

Una explicación **por paso, no por opción**, para no llenar de texto los botones. Si una opción necesita aclaración, va dentro del «por qué» del paso.

**«✨ IA»** (`ampliar-ia.js`) viene incluido: basta con poner `data-ia-ctx` en el `.razon-cuerpo` del paso y pasar `ia` a `abrirPanelRazon()`. Hace falta un `ctxArbol(region, pregunta)` nuevo en `ampliar-ia.js`, con su test, al lado de `ctxCribado` y `ctxTest`.

### Esquema (`data/<región>.js`, en cada paso de `tree`)
```js
razonamiento: {
  porque:   string,               // con fuente leída; si no, no existe
  detalle?: string,               // párrafos separados por \n\n (panel «Ampliar»)
  fuentes:  [clave],              // claves de data/referencias.js
  citas?:   [string | { texto, url }],  // cita completa con capítulo/páginas, cada una empezando por su clave
}
```
No cambia `question`, `iaPregunta`, `options`, `next` ni lo que activa cada opción: la navegación y las hipótesis quedan igual.

## Implementado en el piloto (lumbar, 2026-10)
- `razonamientoPasoHTML(step, region)` (`phase4.js`), llamado desde `renderStep`: el `<details class="razon">` entre la pregunta y las opciones (antes del recuadro «📝 Refiere el paciente»), con las claves de las fuentes al pie y «Ampliar →» si hay `detalle`. Estilo de las fases 2 y 4b; en `styles.css`, la pregunta cede su margen inferior al `<details>`.
- `abrirRazonamientoPaso(btn, stepId)` (`phase4.js`, expuesta en `window`): el panel compartido (`abrirPanelRazon()`) con Por qué, En detalle y Fuentes (`citas`, o las claves de `fuentes`), enlazadas con `enlaceCita()` y `registroReferencias()` de `phase4b.js`. «↺ Reiniciar árbol» lo cierra; cambiar de fase también, como siempre.
- `ctxArbol(region, pregunta)` (`ampliar-ia.js`): contexto de «✨ IA» con `iaPregunta` si existe (la pregunta sin la instrucción para el fisioterapeuta).
- `tests/referencias.mjs` cuenta `razonamiento.fuentes` de los pasos como «razonamiento fase 4».
- Tests unitarios: forma del campo y fuentes en el registro; «¿Por qué?» solo en pasos que lo tienen y «Ampliar» solo con `detalle`; contexto IA con `iaPregunta`; un marcador en todos los pasos de las 7 regiones no llega al payload, a `📋 Notas`, a `📄 Informe`, a los datos ampliados ni a los dos prompts del informe con IA. Smoke (`checkArbolRazon`, lumbar `lu_step1`): el `<details>` va entre la pregunta y las opciones, se abre sin contestar el paso, «✨ IA» lleva el contexto del paso, «Ampliar» abre el panel (lateral sin velo, se contesta con él abierto; sheet con velo a 390 px que atrás cierra sin salir de la fase 4). El recorrido del árbol del smoke pulsa solo `.option-group .option-btn`.

## Decisiones del piloto (lumbar, 2026-10, validadas por el usuario)
- El diseño propuesto se queda tal cual: un «¿Por qué esta pregunta?» por paso, entre la pregunta y las opciones, con «Ampliar →» solo si hay `detalle`.
- Cuando el artículo dice más de lo que sostienen sus cifras, se escribe lo que sostienen las cifras (Fritz 2005: el texto dice que con hipomovilidad la inestabilidad es «improbable», pero el 57 % de los inestables tenía algún segmento hipomóvil; se cita la falta de hipomovilidad como lo que mejor la predice, especificidad 0,95).
- Lo que el árbol dice y ninguna fuente leída respalda no se comenta en el «por qué» ni se cambia en la pregunta (lumbar: «sensación de "fallo"» en `lu_step3`; «peor que el dolor de espalda» en `lu_step1`, que Lluch no usa como criterio radicular y Petersen 2017 solo recoge en la regla de estenosis de Cook).
- Si una fuente habla de una población más amplia que la del paso, el «por qué» lo dice (`lu_step1b`: la revisión sobre centralización que recoge Delitto 2012 es de dolor de columna en general, no solo radicular).
- Una guía extensa se puede citar por las secciones leídas enteras, diciendo cuáles en la cita (George 2021: resumen de recomendaciones y sistemas de clasificación).

## Decisiones de cervical (2026-10, validadas por el usuario)
- Lo que el árbol dice sin respaldo en ninguna fuente leída no se comenta ni se cambia: «y es peor que el del cuello» (`ce_step3`); «reciente» (`ce_step2`); «hombro/escápula» en la opción de la 1.ª costilla (`ce_step4`: el Delphi habla de la base del cuello, la zona cervicotorácica y el trapecio, y no establece que el cuadro exista); las opciones fuerza, resistencia y postural (`ce_step5`), que la guía de la APTA no separa de la coordinación del movimiento, y «lordosis reducida».
- Si los criterios de una opción no definen el cuadro, el «por qué» dice qué son: en `ce_step2`, el movimiento muy reducido y la hiperalerta son rasgos más marcados en el latigazo, y la hiperalerta tiene valor pronóstico.
- FRT: entre la guía de la APTA (estudios aislados, sensibilidad 0,90–0,95) y el metaanálisis de Demont 2022 (0,83 y 0,83, certeza moderada), del mismo nivel, gana el más reciente. El corte se da como varía según la fuente (menos de 30° o 10° de asimetría en Lluch, menos de 32° en la guía), con las medias del metaanálisis.
- Contribución del cuello en la migraña: el capítulo de cefalea de Lluch (más reciente, narrativo) y Jull 2007 (anterior, estudio con voluntarios) no coinciden; se dicen los dos (regla 3 de conflictos).
- Si una revisión resume mal un estudio primario leído, se citan las cifras del original (Jiang 2024 resume la regla de Cook y Brown 2010 como «ninguno o solo uno»; el artículo dice ninguno de cinco).
- Una opción que la fuente matiza se deja igual y el matiz va en el detalle: el aura (`ce_step3b`) también puede empezar después de la cefalea o darse sin ella (ICHD-3); la cefalea cervicogénica «unilateral» (`ce_step4`) es un rasgo orientativo, y en Getsoian 2020 solo el 20 % de los que respondieron al bloqueo la tenía.
- Una clasificación extensa (ICHD-3) se cita por las secciones leídas, como las guías.

## Decisiones de hombro (2026-10, validadas por el usuario)
- Conflictos con Lluch 2020, resueltos por la regla 1 (gana la fuente de más peso): en la acromioclavicular, Paxinos + O’Brien no tienen «sensibilidad y especificidad >90 %» como dice Struyf citando a Krill 2018, sino 0,11/0,96 positivos los dos y 0,82/0,46 positivo uno (se citan las cifras de Krill); en la inestabilidad anterior, aprensión, recolocación y sorpresa no superan el 72 % de sensibilidad (Hegedus 2012: 0,65, 0,65 y 0,82); en el SLAP, la compresión activa se queda en 0,67/0,37 sin el estudio original, y el «por qué» solo dice que ningún test sirve.
- Hawkins-Kennedy negativo para descartar la tendinopatía del manguito: entre la guía de 2025 (Desmeules, razón de verosimilitud negativa 0,25, B) y las revisiones anteriores (Hegedus 0,35, Hermans 0,51), del mismo nivel, gana la más reciente (regla 2).
- Fiabilidad de la observación escapular: la guía de 2025 (A) concluye que ningún instrumento ni test para medir el movimiento dinámico de la escápula es lo bastante fiable para recomendarlo; prevalece sobre el acuerdo del 75–82 % del consenso de Kibler 2013 (regla 1), que no se cita para ese dato. Es la misma lectura que la ficha 4b de `h8`.
- La discinesia no es un diagnóstico (Kibler 2013): el «por qué» de `h_step5` lo dice sin cambiar la opción que activa `h8`.
- La 1.ª costilla (`h_step1`) se trata como en cervical: los criterios de la opción son opinión de expertos de un Delphi que no establece que el cuadro exista.
- El Spurling es sobre todo un test de radiculopatía (Blanpied 2017); en el detalle de `h_step1` se dice así, sin cambiar la opción, que habla de dolor cervical referido al hombro.
- Lo que el árbol dice sin respaldo en ninguna fuente leída no se comenta ni se cambia: «compresión axial» (`h_step1`); «"Pop"» en la opción de inestabilidad y «dolor profundo» en la de labrum (`h_step3`). Dos matices van en el texto sin tocar la opción: el dolor subacromial da dolor **o** debilidad (Lluch), frente al «sin debilidad marcada» de `h_step4`; la asimetría escapular es frecuente en personas sanas (Kibler), frente a la «asimetría visual» de `h_step5`.
- Un estudio primario que solo se conoce a través de una fuente leída se cita como recogido por ella (Roberts 2019, en Salamh 2025 y Lluch; Hickey 2018, en Lluch).

## Decisiones de cadera (2026-10, validadas por el usuario)
- Conflicto entre guías del mismo nivel en `ca_step2`: NICE NG226 (2022; desde los 45 años, rigidez matutina de 30 minutos como máximo) frente a la guía de la APTA (Koc 2025, grado A; mayores de 50 años, rigidez de menos de 1 hora, rotación interna de menos de 24°). Gana la más reciente (regla 2), aunque la APTA reafirme en 2025 una recomendación de 2017 porque su nueva búsqueda no encontró nada que la cambiara: el texto sigue a la APTA y NICE no se cita. El «≥45 años» de la opción viene de NICE y queda sin respaldo en el texto; la opción no se toca.
- Cifras del cluster sacroilíaco (`ca_step1`): las del metaanálisis de Saueressig 2021 (sensibilidad 0,83, especificidad 0,59, certeza muy baja), no las de los estudios originales que da Lluch (85–94 % y 79 %), por la regla 1. «Rara vez coexiste» se limita al dolor discógeno, que es lo que dice Laslett 2008; Lluch lo extiende a cualquier otra estructura.
- Si un capítulo resume mal el estudio original leído, se cita el original: los «síntomas mecánicos dolorosos» con sensibilidad 100 % y especificidad 85 % de Lluch son en Narvani 2003 solo el chasquido, en 4 roturas (`ca_step3`); la entidad inguinal se define como en el acuerdo de Doha (dolor en la región del canal **y** palpación dolorosa), no con la «o» de la tabla de Lluch (`ca_step6`).
- Thomas (`ca_step3b`): las cifras de Lluch (89 % y 92 %) salen de una sola serie de 59 pacientes con alto riesgo de sesgo (McCarthy y Busconi 1995, recogida por Reiman 2015), y Narvani 2003, posterior y más pequeño, solo lo vio positivo en 1 de 4 roturas. Con dos estudios pequeños del mismo nivel, se dan los dos datos y la conclusión de que el Thomas no confirma nada.
- Un estudio del que solo se ha leído el resumen de los autores se cita diciéndolo (Brown 2004, fuente de las cifras de cojera y rotación interna que da Lluch).
- Lo que el árbol dice sin respaldo en ninguna fuente leída no se comenta ni se cambia: la «rotación interna <24°» con los 45 años (`ca_step2`), la tendinopatía de isquiotibiales de `ca_step5` (solo la mencionan Lluch y Carro) y las cifras de los tests laterales de Lluch, que no se usan sin leer la revisión más reciente (Kinsella 2024).

## Reglas
- **Fuentes**: las mismas que en las fases F y H, con el mismo orden de prioridad (más peso de evidencia y, a igual peso, la más actual). Para cada región, primero el capítulo de Lluch 2020 que ya está leído (lumbar: cap. 5.1, Fondevila Suárez). Después, las guías y revisiones que el paso ya cita o en las que se basa, leídas enteras (PDF del usuario cuando no sean de acceso abierto). Toda referencia nueva entra en `data/referencias.js` con su DOI verificado, y después se ejecuta `node tests/gen-referencias.mjs`.
- **No inventar**: si la fuente no explica por qué el paso va en ese orden, no se dice. Se puede explicar qué separa el paso sin justificar el orden.
- **Tono**: el de las fases 2 y 4b. Frases cortas, para el clínico, sin jerga de puntuación (LR, pesos), que en el árbol no aplica.
- **Nunca en el payload, los resúmenes ni el prompt del informe con IA**: el prompt sigue leyendo solo `question`/`iaPregunta` y las opciones. Lo comprueba un test unitario.

## Procedimiento por región
1. Leer el árbol de la región en `data/<región>.js` y, para cada paso, qué hipótesis activan sus opciones.
2. Leer las fuentes (Lluch 2020 de la región y lo que cite cada paso) y redactar `porque`, más `detalle` si hay material.
3. `node tests/unit.js` (incluye la instantánea de navegación del árbol, que no debe cambiar), `node tests/gen-referencias.mjs` y `node tests/smoke.mjs`.
4. Tabla de revisión para el usuario (paso · pregunta · por qué · fuentes). No se fusiona hasta que la valide.

**Solo en el piloto (lumbar)**, además: el campo en `renderStep`, el `<details>` y el «Ampliar», `ctxArbol` en `ampliar-ia.js`, los tests (unitario: razonamiento solo en pasos que lo tienen, nunca en payload/resúmenes/prompt, fuentes en el registro; smoke: el «¿Por qué?» se abre sin marcar ninguna opción, «Ampliar» abre el panel, «✨ IA» lleva el contexto del árbol) y la actualización de `CLAUDE.md`.
