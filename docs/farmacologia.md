# Farmacología para el fisioterapeuta

Diseño y estado de la línea «fármacos» (decisión del usuario, 2026-10). Léelo entero antes de trabajar en cualquiera de los tres pasos. Una sesión por paso o, en el paso 2, por familia de fármacos.

## Objetivo

Que el fisioterapeuta sepa **qué vigilar** de la medicación del paciente: cómo cambia el dolor y la inflamación (y si enmascara signos), qué síntomas viscerales o secundarios produce que imitan dolor musculoesquelético, qué precauciones pide el ejercicio y cómo afecta al sueño. Cada apartado termina en cuándo consultar con el médico o el farmacéutico.

## Límites (no cambian en ningún paso)

- **Nunca** se propone cambiar, suspender ni ajustar la medicación. El tono es «vigila y consulta».
- **No** hay interacciones entre fármacos. Son terreno del farmacéutico: no se mantienen en la app y la responsabilidad sería grande.
- El fármaco concreto se consulta en la ficha técnica de CIMA (AEMPS) con un enlace, igual que Kenhub en anatomía: no se copia su contenido.
- Nada de esto reduce, esconde ni sustituye una urgencia o una pregunta de cribado de la fase 2.

## Paso 1 — Modalidad «Fármacos» en «✨ Preguntar a la IA» (hecho, 2026-10)

Hay un selector «Pregunta libre / Fármacos» encima del texto del diálogo (`#preguntaTipos`). Cada vez que se abre el diálogo vuelve a «Pregunta libre» (`_preguntaTipo`, `app.js`). Con «Fármacos»:

- el *placeholder* pide fármacos o una duda;
- aparece bajo el texto `#preguntaGuion`, que dice lo que cubrirá la respuesta;
- la nota del diálogo dice que también se envía un guion.

El prompt lo construye `promptPregunta({ contexto, pregunta, tipo: 'farmacos' })` (`ampliar-ia.js`):

> «Soy fisioterapeuta. [Contexto: valoración de <región>.] Fármacos o duda: «…». » + `GUION_FARMACOS` (los cinco apartados y «No propongas cambiar, suspender ni ajustar la medicación.») + `INSTRUCCION_FUENTES` + «Incluye la ficha técnica (CIMA, AEMPS) cuando sea pertinente. Cita las fuentes con enlace.»

Se mantiene la regla de privacidad de «Preguntar a la IA»: lo único que sale del caso es la región (`_ctxPregunta()`). Los fármacos los escribe el fisioterapeuta y nunca se leen del `state`. Un test unitario fija que el tipo solo toma valores del propio diálogo.

Tests: unitarios en `tests/unit/razonamiento.mjs` («preguntar a la IA, modalidad «Fármacos»»); smoke en la sección `ia` (guion visible, prompt con región y guion sin datos del paciente, vuelta a «Pregunta libre» al reabrir, cabe a 320 px).

Límite conocido: la respuesta no tiene fuente revisada por PhysiQ. Sirve para resolver una duda puntual, pero no enseña qué preguntar si el fisioterapeuta no sabe que debe hacerlo. Para eso está el paso 2.

## Paso 2 — Guía permanente por familia (infraestructura hecha; AINE revisada por el usuario; 2026-10)

**Hecho**: es una herramienta de cabecera propia, como «Condiciones especiales».

| Pieza | Dónde |
|---|---|
| Icono `#farmBtn` (una cápsula) | Cabecera; en ≤768 px es la opción «Fármacos» de «Herramientas» (`herramientaElegir('farmacos')`) |
| Diálogo `#farmOverlay` / `#farmPanel` | Reutiliza `.cond-panel`; hoja inferior con atrás en móvil y diálogo centrado de hasta 560 px en ancho |
| Abrir y cerrar | `abrirFarmacos()` / `cerrarFarmacos()`, `_farmHistorial`, `_closeAllOverlays()` |
| Contenido | `data/farmacos.js`: `APARTADOS_FARMACO`, `FAMILIAS_FARMACO`, `TEXTOS_FARMACOS` |
| HTML | `lib/farmacos.js`: `farmacosHTML()`; es puro y no lee el `state` |

Disponible también en el hub, porque no usa red, aunque allí se ocultan los enlaces de IA. Se oculta al imprimir.

Cada familia con contenido es un `<details>` cerrado con sus ejemplos y los cinco apartados (`dolor`, `visceral`, `ejercicio`, `sueno`, `consultar`). Cada apartado tiene:
- `texto`, que siempre se ve;
- `detalle` opcional, en «Más detalle»;
- «✨ IA» por párrafo, con el contexto `ctxFarmaco(nombre)` de `ampliar-ia.js`;
- las citas dentro de la frase como botones (`citasEnTexto()`).

Las fuentes de la familia van al pie, como citas.

Las familias aún sin contenido se listan como «Pendientes de fuentes revisadas», con el botón «Preguntar a la IA sobre fármacos →» (`farmacosPreguntarIA()`). El botón cierra la guía y abre «✨ Preguntar a la IA» ya en la modalidad «Fármacos» (`abrirPreguntaIA({ tipo: 'farmacos' })`). En el hub está oculto.

Se ha cambiado algo fuera de la guía: el listener de clicks de `ampliar-ia.js` pasa a **captura**, como el de las citas (`ficha.js`). Los paneles de los diálogos de la cabecera cortan la propagación del click, y en burbuja «✨ IA» no funcionaba dentro de ellos. Mientras hay un diálogo abierto, la barra y el menú de «✨ IA» suben por encima del velo (`body:has(.session-panel-overlay.open)`, `styles.css`).

**Tests**:
- unitarios en `tests/unit/farmacos.mjs`:
  - las 13 familias en orden;
  - los cinco apartados;
  - las fuentes están en el registro;
  - cada cita de la frase es una fuente de su familia, y cada fuente se cita;
  - nunca proponer cambiar la medicación;
  - el HTML;
  - nada llega al payload ni a los resúmenes;
  - las funciones están expuestas en `window`;
- smoke en la sección `farmacos`.

Las fuentes cuentan en `docs/referencias.md` como «guía de fármacos» (`recogerCitas({ FARMACOS })`).

**Límites del diseño**:
- una fila por **familia**, no por fármaco suelto;
- solo con fuentes leídas en la sesión;
- revisión del usuario antes de `main`;
- sin enlace a CIMA por ahora: la red del entorno no llega a `cima.aemps.es` y no se ha podido comprobar la URL de búsqueda. No se inventa: queda pendiente hasta que alguien la verifique.

### Familias

**Familias propuestas** (aceptadas por el usuario, 2026-10), en este orden de trabajo:

1. AINE
2. Corticoides (enmascaran fiebre e infección, osteonecrosis, fractura por fragilidad, miopatía, insomnio, hiperglucemia)
3. Anticoagulantes y antiagregantes (hematoma, técnicas manuales, sangrado retroperitoneal que imita dolor lumbar o de cadera)
4. Opioides (enmascaran dolor, estreñimiento o dolor abdominal, mareo y caídas, apnea del sueño, hiperalgesia)
5. Gabapentinoides (mareo, somnolencia, edema, caídas)
6. Antidepresivos: ISRS, IRSN y tricíclicos (sangrado con AINE, hipotensión ortostática, sueño)
7. Benzodiacepinas y relajantes musculares (sedación, caídas, sueño)
8. Estatinas (mialgia, miopatía, rabdomiólisis: dolor muscular difuso que no es mecánico)
9. Fluoroquinolonas (tendinopatía y rotura del tendón de Aquiles, más con corticoides y en mayores)
10. Betabloqueantes (frecuencia cardíaca no válida para dosificar: usar Borg; hipotensión, pesadillas)
11. Diuréticos y otros antihipertensivos (deshidratación, hipopotasemia y calambres, ortostatismo)
12. Insulina y antidiabéticos (hipoglucemia con el ejercicio, SGLT2 y deshidratación)
13. Fármacos que tocan el hueso: bifosfonatos, denosumab, inhibidores de la aromatasa (fractura atípica de fémur con dolor de muslo, osteonecrosis, artralgias)

Lo que va entre paréntesis son solo **pistas de qué buscar**. No es contenido: cada frase de la guía sale de una fuente leída.

**Fuentes**: solo las leídas en la sesión. NCBI (StatPearls) pide reCAPTCHA desde la red del entorno, así que los capítulos de StatPearls solo pueden entrar como PDF aportado por el usuario, como en fases anteriores. Las revisiones de acceso abierto de PMC se leen enteras con el conector de PubMed. Se puede usar un agente que lea y devuelva citas literales con su sección, para no llenar el contexto. Cada fuente entra en `data/referencias.js` y se regenera `docs/referencias.md` (`node tests/gen-referencias.mjs`).

**Procedimiento por familia**:
1. Leer las fuentes.
2. Escribir `apartados` y `fuentes` en `data/farmacos.js`. Una frase sin fuente solo es admisible como consejo de redacción propia; se anota abajo.
3. Ejecutar `node tests/gen-referencias.mjs` y `node tests/unit.js`.
4. Ejecutar `node tests/smoke.mjs --solo farmacos`.
5. Revisión del usuario antes de `main`.
6. Anotar el estado aquí.

| Familia | Estado | Fuentes leídas | Huecos |
|---|---|---|---|
| AINE | **Revisada por el usuario** (2026-10) y en `main` | Schug 2021, Bindu 2020, Lucas 2019, Papantoniou 2023 y Pannone y Abbott 2024 (texto completo en PMC) | Presentación clínica de la úlcera (melena, hematemesis, dolor referido a la espalda o al hombro, úlcera «silente»): ninguna fuente leída la describe. Candidatas: «Malik 2023» (StatPearls, úlcera péptica, ya en el registro) y «Saad y Mathew 2025» (StatPearls, toxicidad de los AINE, ya en el registro), si el usuario aporta los PDF. Sueño: ninguna fuente lo trata, y la guía lo dice. |
| Las otras 12 | Pendientes | — | — |

**Redacción propia en los AINE** (consejos sin cita, para la revisión):
- «Anota si tomó una dosis antes de la sesión.»
- «Vigila la hidratación en sesiones largas o con calor.»
- «Las dudas sobre la dosis, la duración o la combinación con otros fármacos, al médico o al farmacéutico.»

**Decisión tomada**: va como herramienta propia en la cabecera, no como sección de «Condiciones especiales».

## Paso 3 — Conectarla con el paciente (pendiente, después del paso 2)

Unos chips «Familias que toma» en la fase 1, cerca de los antecedentes. Solo familias de la lista del paso 2, **nunca** nombres de fármaco en texto libre. Con ellos:

- un filtro «Este paciente» en la guía, como en los tiempos de tejido (`filasPaciente()`);
- avisos en la fase 6 (`construirPlan()`; por ejemplo, betabloqueante → dosificar por Borg; insulina → hipoglucemia; anticoagulante → técnicas manuales);
- una línea en el bloque de datos del informe con IA.

Toca el payload, `📋 Notas`, quizá el `📄 Informe` y physiq-report (copia del bloque, como `_bloqueHM`), así que necesita un diseño propio con el usuario antes de empezar. Lo de la fase 6 y el informe solo se escribe con fuentes del paso 2 ya revisadas.
