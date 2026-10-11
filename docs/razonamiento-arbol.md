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
