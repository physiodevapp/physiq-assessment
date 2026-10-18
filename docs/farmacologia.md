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

## Paso 2 — Guía permanente por familia (pendiente)

Será una herramienta de cabecera propia, como «Condiciones especiales» (`data/condiciones.js` y `lib/condiciones.js` sirven de modelo):

- icono en la cabecera y opción en «Herramientas» en ≤768 px;
- también en el hub, porque no usa red;
- hoja inferior con atrás en móvil y diálogo centrado en ancho;
- se cierra con `_closeAllOverlays()`.

Habrá una fila por **familia**, no por fármaco suelto. Cada fila tiene siempre los mismos cinco apartados: dolor/inflamación, visceral/secundario, ejercicio, sueño y cuándo consultar. Cada apartado lleva el «ⓘ ¿Por qué?», «Ampliar →» (`abrirPanelRazon()`), el «✨ IA» por párrafo (`data-ia-ctx`, con un `ctxFarmaco()` nuevo en `ampliar-ia.js`) y las citas tocables (`citasHTML()`/`citasEnTexto()`). Lleva también un enlace «Buscar en CIMA ↗» a la búsqueda por principio activo.

**Familias propuestas** (aceptadas por el usuario, 2026-10), en este orden de trabajo:

1. AINE (dolor epigástrico o úlcera que se refiere a dorsal u hombro, riesgo renal y cardiovascular, efecto sobre la curación de tejido)
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
13. Antirresortivos y fármacos que tocan hueso: bifosfonatos, denosumab, inhibidores de la aromatasa (fractura atípica de fémur con dolor de muslo, osteonecrosis, artralgias)

**Fuentes**: solo las leídas en la sesión, como en las Fases F, H y M. Candidatas: Goodman 2018 (ya está en el registro y tiene apartados de fármacos por sistema), los capítulos de StatPearls de cada familia, NICE y las fichas técnicas de CIMA. Cada fuente entra en `data/referencias.js` y se regenera `docs/referencias.md` (`node tests/gen-referencias.mjs`). Ciccone, *Pharmacology in Rehabilitation*, solo si el usuario aporta el libro.

**Procedimiento por familia**: leer las fuentes, escribir la fila en `data/farmacos.js`, test unitario (los cinco apartados, `fuentes` del registro, nada en payload, resúmenes ni prompt del informe), sección smoke y revisión del usuario antes de `main`. Se anota aquí el estado de cada familia.

| Familia | Estado |
|---|---|
| — | ninguna empezada |

**Decisión pendiente**: si va como herramienta propia (recomendado) o como sección dentro de «Condiciones especiales». El usuario aceptó el orden y las recomendaciones, así que de momento va como herramienta propia.

## Paso 3 — Conectarla con el paciente (pendiente, después del paso 2)

Unos chips «Familias que toma» en la fase 1, cerca de los antecedentes. Solo familias de la lista del paso 2, **nunca** nombres de fármaco en texto libre. Con ellos:

- un filtro «Este paciente» en la guía, como en los tiempos de tejido (`filasPaciente()`);
- avisos en la fase 6 (`construirPlan()`; por ejemplo, betabloqueante → dosificar por Borg; insulina → hipoglucemia; anticoagulante → técnicas manuales);
- una línea en el bloque de datos del informe con IA.

Toca el payload, `📋 Notas`, quizá el `📄 Informe` y physiq-report (copia del bloque, como `_bloqueHM`), así que necesita un diseño propio con el usuario antes de empezar. Lo de la fase 6 y el informe solo se escribe con fuentes del paso 2 ya revisadas.
