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

## Paso 2 — Guía permanente por familia (infraestructura hecha; AINE, corticoides, anticoagulantes y opioides revisadas por el usuario; 2026-10)

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

**Procedimiento por familia** (el que se siguió con AINE, corticoides, anticoagulantes y opioides):
1. **Leer las fuentes con un agente** (herramienta Agent, en segundo plano), para no llenar el contexto de la sesión:
   - El agente carga las herramientas de PubMed con ToolSearch (`select:mcp__PubMed__search_articles,mcp__PubMed__get_full_text_article,mcp__PubMed__get_article_metadata,mcp__PubMed__convert_article_ids`).
   - Busca 5–7 revisiones, guías o metaanálisis de 2015 en adelante con texto completo en PMC y los lee enteros.
   - Devuelve citas literales en inglés con su sección, por cada uno de los cinco apartados (dolor, inflamación y curación; síntomas viscerales o secundarios; ejercicio y terapia manual; sueño; cuándo consultar).
   - Devuelve también, por cada fuente, los autores, título, revista, DOI y PMCID; qué leyó solo en parte; lo que es inferencia suya, marcado; y los huecos sin fuente.
   - En el encargo se le dan los temas concretos de la familia: las pistas entre paréntesis de la lista de abajo.
2. **Pedir al usuario los PDF que falten.** StatPearls y las guías sin PMC solo entran así: NCBI pide reCAPTCHA desde el entorno. Los PDF llegan a `/root/.claude/uploads/<sesión>/`; se pasan a texto con `pdftotext -layout` y un segundo agente los lee enteros y devuelve las citas para los huecos.
3. **Escribir** `apartados` y `fuentes` en `data/farmacos.js`, con las citas dentro de la frase («(Autor año)»).
   - Comprobar antes con `citasEnTexto()` que cada clave nueva se reconoce: una clave que empieza por minúscula («de Vries») no se reconoce.
   - Una frase sin fuente solo es admisible como consejo de redacción propia, y se anota abajo.
   - Lo que no tiene fuente leída se dice en la guía («Las fuentes leídas no…») y en la tabla de abajo; nunca se rellena.
4. **Añadir las fuentes al registro** (`data/referencias.js`, encima de `'Kaneko 2021'`). Su nota dice cómo se leyeron (PMC entero, en parte, PDF del usuario) y para qué familia.
5. **Ejecutar** `node tests/gen-referencias.mjs` y `node tests/unit.js`.
6. **Actualizar el smoke**: la sección `farmacos` de `tests/smoke.mjs` comprueba el orden de las familias escritas y una familia pendiente; hay que actualizar las dos cosas. Después, con `npx serve . &`, ejecutar `node tests/smoke.mjs --solo farmacos` y, antes de `main`, `node tests/smoke.mjs` entero.
7. **Abrir la PR sin fusionar**: el usuario revisa el contenido clínico antes de `main`. Al fusionarla, marcar la familia como revisada aquí y en CLAUDE.md («Farmacología para el fisioterapeuta»).
8. **Anotar el estado aquí**: fuentes, huecos y frases de redacción propia.

| Familia | Estado | Fuentes leídas | Huecos |
|---|---|---|---|
| AINE | **Revisada por el usuario** (2026-10) y en `main` | Schug 2021, Bindu 2020, Lucas 2019, Papantoniou 2023 y Pannone y Abbott 2024 (texto completo en PMC) | Presentación clínica de la úlcera (melena, hematemesis, dolor referido a la espalda o al hombro, úlcera «silente»): ninguna fuente leída la describe. Candidatas: «Malik 2023» (StatPearls, úlcera péptica, ya en el registro) y «Saad y Mathew 2025» (StatPearls, toxicidad de los AINE, ya en el registro), si el usuario aporta los PDF. Sueño: ninguna fuente lo trata, y la guía lo dice. |
| Corticoides | **Revisada por el usuario** (2026-10) y en `main` | Pofi 2023, Compston 2018, Kaneko 2021 (releído), Grusky 2026, He 2025 y Soura 2026, enteros en PMC; Beuschlein 2024 (guía ESE/Endocrine Society de insuficiencia suprarrenal por glucocorticoides), leída por secciones | Sin fuente leída: que enmascaren la fiebre o los signos inflamatorios (solo «atenúan la respuesta de los neutrófilos», Pofi 2023); fragilidad de la piel y hematomas con corticoides sistémicos; reposo y carga del tendón tras una infiltración, y número máximo de infiltraciones (la guía ASRA de Benzon 2026 no está en PMC); sangrado digestivo al combinarlos con AINE; normas de terapia manual o carga en la osteoporosis por glucocorticoides; texto completo de la guía ACR 2022 de osteoporosis por glucocorticoides (Humphrey 2023, no está en PMC). Candidatas si el usuario aporta los PDF: «Yasir 2023» y «Hodgens y Sharman 2023» (StatPearls, ya en el registro), Humphrey 2023, Benzon 2026. |
| Anticoagulantes y antiagregantes | **Revisada por el usuario** (2026-10) y en `main`; ampliada con los PDF del usuario y, después, con las fuentes de la condición especial «Paciente anticoagulado o antiagregado» (`docs/anticoagulado.md`), revisado también por el usuario (2026-10) | Mameli 2025, Ghosh 2026, Kurlander 2022, Nochaiwong 2022, Muñoz 2022, Yang 2024, Xiang 2025 y Salmasi 2020 (PMC); Steffel 2021 (guía práctica EHRA, PDF del usuario, leída entera salvo las figuras-imagen 1, 3, 9 y 11–15 y los colores de las tablas 5–9; la corrección euab157 solo cambia la financiación) y Antunes 2024 (StatPearls, PDF del usuario, releído) | Añadido con los PDF: presentación del sangrado digestivo alto y perforación, heces negras que no son melena, antiagregantes combinados y edad (Antunes 2024); caídas y su valoración, no saltarse dosis sin consultar, AINE, antiagregantes y corticoides como factores de sangrado, hemorragia intracraneal tardía tras caídas, inyección intramuscular (Steffel 2021). Añadido con las fuentes de `docs/anticoagulado.md` (2026-10; leídas enteras en esa sesión, cada cita comprobada): hematoma del psoas o retroperitoneal (Lukies 2023, Sahu 2020, Llitjos 2016), de la vaina de los rectos (Liao 2021, Hideyama 2023), síndrome compartimental (Brooker 2020, Nemunaitis 2022), hemartros (Dalrymple 2022), moratones de la heparina (Amaniyan 2020), golpe en la cabeza (NICE NG232, Chenoweth 2018), thrust y manipulación (Puentedura 2015, Hutting 2018, Whedon 2015), masaje, percutor y estiramientos (Tominaga 2023, Kwon 2024, Kim 2026, Cheatham 2025), deporte (Kim 2025, Minardi 2024, Bavishi 2026), caídas (NICE NG196, Mitchell 2023) y caminar tras una TVP (Liu 2015). Siguen sin fuente leída: cifras de corticoides más anticoagulantes; sueño. |
| Opioides | **Revisada por el usuario** (2026-10) y en `main` | Dowell 2022 (guía de los CDC, leída en parte: recomendaciones 5, 8 y 11 enteras y el apartado de dolor subagudo y crónico; 1, 2, 4, 6 y 7 por palabras clave), Sampaio-Cunha y Martins 2022 (en parte), Camilleri 2017, Dufort y Samaan 2021, De Vries 2020, Blyzniuk 2026 y Langstengel y Yaggi 2022, en PMC. Cashin 2023 (panorámica Cochrane de la lumbalgia) solo dio el resumen y no se cita | Sin fuente leída: signos clásicos de sobredosis (pupilas puntiformes, respiración lenta o ausente, no responder); efectos propios del tramadol (hiponatremia, hipoglucemia, convulsiones); retención urinaria; curación de tejidos y fracturas; terapia manual; ejercicio tras la toma; programa de ejercicio durante la retirada; sueño con uso analgésico prescrito (Langstengel y Yaggi trata el trastorno por uso); ensayo OPAL (no es de acceso abierto). La clave «De Vries 2020» lleva la partícula en mayúscula para que `citasEnTexto()` la reconozca. |
| Las otras 9 | Pendientes | — | — |

**Redacción propia en los opioides** (sin cita, para la revisión):
- «Las fuentes leídas no dicen cuándo conviene valorar respecto a la toma.» y las otras frases de «no tratan».
- «Nunca aconsejes dejarlos ni bajarlos por tu cuenta» (el resto de la frase es de Dowell 2022).
- Los rótulos «Urgente», «Pronto» y «Combinaciones que hay que comentar con quien prescribe».

**Redacción propia en anticoagulantes y antiagregantes** (sin cita, para la revisión):
- «Si el paciente toma alguno, marca la tarjeta «Paciente anticoagulado o antiagregado» en la fase 1…» (enlace con la condición especial).
- «Kim 2025 da su regla solo para deportistas de competición y no dice qué anticoagulantes cuentan como plenos.» (lectura del propio artículo, sin cita aparte).
- «Las fuentes leídas no dan datos sobre los tiempos de curación de los tejidos con estos fármacos.»
- «Tras un golpe en la cabeza, valoración médica» (la razón, «las guías piden cautela con todos estos fármacos», sí es de Yang 2024).
- «Nunca aconsejes dejar ni saltarse el anticoagulante… Las dudas, al médico que lo prescribe.» (lo de en medio sí es de Salmasi 2020 y Muñoz 2022).
- Los rótulos «Urgente» y «Pronto».

**Redacción propia en los corticoides** (sin cita, para la revisión):
- «Las fuentes leídas no dan normas para la terapia manual ni para la carga: tenlo en cuenta al elegir técnicas de alta velocidad o carga axial intensa.»
- «Las fuentes leídas no dan un protocolo de reposo ni de carga del tendón tras una infiltración: sigue la indicación de quien la puso.»
- «Nunca aconsejes bajar ni dejar los corticoides… Las dudas, al médico que los prescribe.» (la segunda mitad, «tras un uso prolongado se retiran de forma pautada», sí es de Beuschlein 2024).
- Los rótulos «Urgente» y «Pronto» del apartado «Cuándo consultar».

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
