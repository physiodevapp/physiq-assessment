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

## Paso 2 — Guía permanente por familia (infraestructura hecha; AINE, corticoides, anticoagulantes, opioides, gabapentinoides, antidepresivos, benzodiacepinas y estatinas revisadas por el usuario; fluoroquinolonas escritas, pendientes de revisión; 2026-10)

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
- `detalle` opcional, en «Ampliar ▾»;
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

**Procedimiento por familia** (el que se siguió con AINE, corticoides, anticoagulantes, opioides, gabapentinoides, antidepresivos, benzodiacepinas, estatinas y fluoroquinolonas):
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
| Gabapentinoides | **Revisada por el usuario** (2026-10) y en `main` | Giménez-Campos 2021, Meaadi 2023, Martínez 2023, McAnally 2020 y Hahn 2022 (enteros en PMC); Carvalho 2022 (en parte: resumen y secciones de gabapentina y pregabalina); Yasaei 2024 y Cross 2024 (StatPearls de gabapentina y pregabalina, PDF del usuario, enteros). Enke 2018 solo dio el resumen en PMC y no se cita | Sin fuente leída: caídas y fracturas en mayores (la guía lo dice); inflamación y curación de los tejidos; terapia manual y ejercicio tras la toma; mioclonías; sueño en pacientes con dolor musculoesquelético (Carvalho 2022 no incluye estudios en dolor para la pregabalina); texto completo de Enke 2018; cartas y estudios hallados y no leídos (PMID 42110637, 42702360, 42022252, 39388918). McAnally 2020 es una revisión narrativa favorable al fármaco: se cita como contrapunto. |
| Antidepresivos (ISRS, IRSN, tricíclicos) | **Revisada por el usuario** (2026-10) y en `main` | Enteras en PMC: Alam 2022, Bhanu 2021, Zhang 2026, Filippatos 2017, Wang 2018, Wichniak 2017, Horowitz 2023, De Filippis 2022 y Narayan 2024 (sin el material suplementario); releídas Nochaiwong 2022 y Blyzniuk 2026. PDF del usuario, enteros: StatPearls de amitriptilina (Thour 2026), duloxetina (Biswas 2026), ISRS (Chu y Wadhwa 2023), venlafaxina (Singh y Saadabadi 2024), tricíclicos (Moraczewski 2023), síndrome serotoninérgico (Simon 2024) y toxicidad de los tricíclicos (Waseem 2026); revisiones Cochrane de fibromialgia (Welsch 2018) y de lumbalgia (Ferraro 2025), de las que las tablas de estudios y los análisis solo se leyeron por encima. Birkinshaw 2023 (Cochrane, dolor crónico, metaanálisis en red) y Moore 2015 (Cochrane, amitriptilina en el dolor neuropático) solo dieron el resumen y no se citan | Sin fuente leída: efecto sobre la inflamación y la curación de los tejidos; si enmascaran signos en la exploración; terapia manual y hematomas (los metaanálisis estudian el sangrado grave, digestivo o intracraneal); ejercicio con calor y sudoración; conducción; cifras de hipotensión ortostática con IRSN (solo un HR de caídas de segunda mano, en Narayan 2024); efecto de la amitriptilina en la fibromialgia y en el dolor musculoesquelético; ISRS en el dolor, salvo la lumbalgia; síntomas «gripales» de la retirada y pautas de retirada; texto completo de Birkinshaw 2023, Henssler 2024 (incidencia de la retirada, Lancet Psychiatry) y Ferreira 2023 (BMJ), que no están en PMC. De Filippis 2022 da una medida conjunta mal definida («mean effect 0,98»), así que se cita sin cifra. La clave «De Filippis 2022» lleva la partícula en mayúscula, como «De Vries 2020». La revisión lumbar es de Ferraro; Ferreira es el tercer autor. |
| Benzodiacepinas y relajantes musculares | **Revisada por el usuario** (2026-10) y en `main` | Enteras en PMC: Cashin 2021, Wewege 2023 (sin figuras ni material suplementario), Oldfield 2024 (sin tablas suplementarias), Brunner 2025 (guía de retirada de ASAM; varias tablas no vinieron en el texto), Edinoff 2021, Capiau 2023, Hwang 2024, Kishi 2026 y Farishta 2024. PDF del usuario, enteros: StatPearls de benzodiacepinas (Bounds y Patel 2024), toxicidad de las benzodiacepinas (Kang 2023), tizanidina (Ghanavatian y Derian 2023), baclofeno (Ghanavatian y Derian 2024), toxicidad del baclofeno (Kershner 2026), ciclobenzaprina (Khan y Kahwaji 2023) y metocarbamol (Sibrack 2024). Leídos y no citados: Kirchlechner-Farkas 2026 (revisión mecanicista; lo útil lo cubren los StatPearls) y la guía de alternativas a Beers 2025 (sin sus tablas). Solo dieron el resumen y no se citan: Cashin 2023 (panorámica Cochrane), Messineo 2024 (hipnóticos y apnea) y una revisión de relajantes en el trastorno temporomandibular (Anesth Prog 2026) | Sin fuente leída: efecto sobre la inflamación y la curación de los tejidos; si enmascaran signos en la exploración; terapia manual; dosificación del ejercicio y momento de la sesión respecto a la toma (solo el inicio y el máximo del metocarbamol); cifras de accidentes de tráfico; benzodiacepinas en la ciática y en el dolor cervical; tiempo de aparición de la retirada del baclofeno oral y de la tizanidina; tioclocósido y tetrazepam; criterios de Beers 2023 completos (no están en PMC). |
| Estatinas | **Revisada por el usuario** (2026-10) y en `main` | Enteras en PMC: Stroes 2015 (consenso de la EAS; sin figuras ni la tabla de definiciones), Mach 2018, CTT 2022 (sin el apéndice), Epelde 2026, Mangone 2024, Yang y Qu 2018 y Broncel 2015. PDF del usuario, enteros: StatPearls de estatinas (Sizar 2024), rabdomiólisis (Rout 2025), atorvastatina (McIver y Siddique 2025) y simvastatina (Talreja y Cassagnol 2023). Leída y no citada: Vaezi 2025 (miopatía necrotizante; el número de pacientes del resumen y de los resultados no coincide). Solo dieron el resumen: Deichmann 2015 y Miller y Thyfault 2020. Fuera de PMC y no leídas: Teichtahl 2016 (tendinopatía), Katsiki 2020 (posicionamiento del ILEP sobre deportistas), Noyes y Thompson 2017, Warden 2022 (NLA), Newman 2019 (AHA), Densham 2024 (caídas) | Sin fuente leída: hueso, fracturas y caídas; si enmascaran signos; adaptaciones al entrenamiento (VO2máx, función mitocondrial con el entrenamiento); maratón y esfuerzos largos; dosificación del ejercicio; terapia manual; neuropatía periférica (solo citada como atribuida); calambres nocturnos; revisión sistemática de tendinopatía leída entera. Rout 2025 se contradice en el rango normal de la CK y en el porcentaje de orina oscura: no se citan esas cifras. La cifra de Mach 2018 sobre el efecto nocebo (2,03 % → 1,26 %) va en sentido contrario al esperado y no se cita. |
| Fluoroquinolonas | **Escrita, pendiente de revisión del usuario** (2026-10) | Enteras en PMC, leídas por un agente: Baggio y Ananda-Rajah 2021, Sangiorgio 2024 (sin tablas ni figuras), Wee 2021 (sin tablas), Barberán 2023 (sin títulos de sección; la última frase está cortada en PMC), Wierzbiński 2023, Rusu 2023 (sin figuras ni algunas tablas) y Duman 2025 (sin tablas ni figuras). PDF del usuario, enteros: Lewis y Cook 2014 (en PMC solo el resumen; anterior a 2015, admitida por ser la única fuente sobre rehabilitación y deportistas), StatPearls de ciprofloxacino (Thai 2023), levofloxacino (Podder 2024), moxifloxacino (Humma y Patel 2024) y disección de aorta (Levy 2024), la nota de la EMA (EMA/795349/2018) y la de la AEMPS (MUH(FV) 07/2023). Leídas y no citadas: Michalak 2017 (revisión especulativa sobre el mecanismo; dos listas vinieron vacías en PMC) y Kuula 2019 (uso de servicios sanitarios y costes) | Sin fuente leída: si enmascaran signos en la exploración; terapia manual; carga del tendón y vuelta al deporte en quien las toma sin síntomas; cómo se presenta el aneurisma de aorta sin disección; que el dolor aórtico se parezca a un dolor musculoesquelético (Levy 2024 no menciona las fluoroquinolonas); signos de la hipoglucemia; tiempo de aparición de la neuropatía en días y su evolución, más allá de «meses o años» o «irreversible»; cifras de artralgia y mialgia; frecuencia y duración del insomnio. Fuentes que se contradicen y quedan las dos: qué fluoroquinolona daña más el tendón (Duman 2025 y Rusu 2023: levofloxacino; Sangiorgio 2024: igual con levofloxacino y ciprofloxacino; Lewis y Cook 2014: el levofloxacino, el menos dañino); el peso de los corticoides (14 veces en Baggio y Ananda-Rajah 2021, 46 veces el Aquiles en Lewis y Cook 2014); la aorta (Wee 2021 la considera probable, Baggio y Ananda-Rajah 2021 contradictoria); la vigilancia del deportista (1 mes en la tabla de Lewis y Cook 2014, al menos 6 meses en su texto). No se citan: la OR combinada de Wee 2021, que difiere entre el resumen y el texto. |
| Las otras 4 | Pendientes | — | — |

**Redacción propia en las fluoroquinolonas** (sin cita, para la revisión):
- «Las fuentes leídas no tratan si enmascaran signos…», «…no dan normas de carga ni de vuelta al deporte… ni tratan la terapia manual» y «…no dan su frecuencia… ni cuánto dura» (sueño).
- **«Por eso, ante un dolor brusco y muy intenso en la espalda o el pecho en quien toma o ha tomado en los 2 últimos meses una fluoroquinolona, piensa en la aorta antes que en un origen mecánico.»** Une el riesgo aórtico (Wee 2021; los 2 meses, de Humma y Patel 2024) con la presentación de la disección (Levy 2024, que no menciona las fluoroquinolonas). Ninguna fuente lo dice así. Recomendación aceptada por el usuario (2026-10): se queda, como razonamiento («piensa en la aorta») y no como regla («no se trata como mecánico»).
- «…es una norma para esas personas, no para todas las que toman fluoroquinolonas» (las normas de esfuerzo de Levy 2024 son para un aneurisma conocido o una disección previa).
- Los rótulos «Urgente», «Sin esperar, con su médico» y «Pronto». **La clasificación es mía**:
  - «Urgente» para el dolor de posible disección (Levy 2024 sí pide atención urgente), la hinchazón de labios, cara o garganta (Humma y Patel 2024 la describe, sin plazo), las convulsiones (Thai 2023 las cita, sin plazo) y las ideas de suicidio, como en los antidepresivos (Wierzbiński 2023 pide comunicar los cambios de ánimo pronto).
  - La confusión y las alucinaciones van en «Sin esperar, con su médico» (Wierzbiński 2023 pide comunicarlas pronto; en 52 de 73 casos se resolvieron en 72 horas). Recomendación aceptada por el usuario (2026-10).
  - «Sin esperar, con su médico» sigue la lista de la EMA (2018), que pide contactar «at once».
  - «Pronto» para la lista de vigilancia de Podder 2024, que no da plazo.
- **La única familia en que las agencias piden al propio paciente que deje el fármaco**: la guía lo cuenta como instrucción de la EMA y la AEMPS al paciente, y dice al fisioterapeuta «Tu papel es reconocer estos signos y que contacte ese mismo día con su médico; no decidas tú sobre el antibiótico». Que siga o cambie lo decide su médico sí es de EMA 2018; «ese mismo día» traduce el «at once» de la EMA. Recomendación aceptada por el usuario (2026-10).
- El rótulo «Combinaciones que hay que comentar con quien prescribe»; las combinaciones y su riesgo sí son de las fuentes.
- «Las dudas, al médico o al farmacéutico.»

**Redacción propia en las estatinas** (sin cita, para la revisión):
- «Las fuentes leídas no tratan el hueso ni las fracturas…», «…no tratan la terapia manual, las caídas ni las adaptaciones al entrenamiento» y «…no tratan los calambres nocturnos».
- Los rótulos «Urgente» y «Pronto». Epelde 2026 pide valoración urgente para la debilidad objetiva, la orina oscura, el malestar general y el empeoramiento tras retirar la estatina, y así se clasifican. **Es mía** la clasificación como «Pronto» del dolor o la debilidad muscular nuevos sin explicación y de los síntomas de lesión hepática; las fuentes piden comunicarlos, sin plazo.
- «más aún tras un esfuerzo intenso, una de sus causas»: une el signo de alarma con la causa que da Rout 2025.
- El rótulo «Combinaciones que hay que comentar con quien prescribe»; las combinaciones y su riesgo sí son de las fuentes.
- «Nunca aconsejes dejarla ni bajar la dosis por tu cuenta… Las dudas, al médico o al farmacéutico.» Las opciones (pausa, cambio de dosis o de estatina) sí son de McIver y Siddique 2025 y Epelde 2026.
- Fuentes que se contradicen y quedan las dos: la coenzima Q10 (el panel de la EAS no la recomienda; un capítulo de StatPearls cita un metaanálisis que la apoya).

**Redacción propia en benzodiacepinas y relajantes musculares** (sin cita, para la revisión):
- «Las fuentes leídas no tratan su efecto sobre la inflamación…» y «Las fuentes leídas no dan normas de terapia manual ni de dosificación del ejercicio…».
- Los rótulos «Urgente» y «Pronto». **La clasificación es mía**:
  - «Urgente» para la sobredosis o la sedación extrema. Las fuentes llaman crítica a la depresión respiratoria, y Kershner 2026 pide atención inmediata con el baclofeno.
  - «Urgente» también para el síndrome serotoninérgico con ciclobenzaprina.
  - «Pronto» para el mareo, la inestabilidad, las caídas o la somnolencia nuevos, la confusión en un mayor, la bradicardia o la hipotensión con tizanidina, y la somnolencia o la confusión con baclofeno y enfermedad renal.
- «Respiración lenta o superficial o no responder» y «sedación extrema, habla arrastrada, ataxia»: los signos son de Bounds y Patel 2024 y Kang 2023 («respiratory depression», «coma-like, stuporous state»); la forma de decirlos para quien no es médico es mía.
- El rótulo «Combinaciones que hay que comentar con quien prescribe»; las combinaciones y su riesgo sí son de las fuentes.
- «Nunca aconsejes dejarlos ni bajarlos por tu cuenta… con quien los prescribe. Las dudas, al médico o al farmacéutico.» Que la retirada es gradual sí es de Brunner 2025 y Kershner 2026.
- «No se dejan de golpe» resume las recomendaciones de Brunner 2025 (no suspender bruscamente) y de los capítulos del baclofeno y la tizanidina.

**Redacción propia en los antidepresivos** (sin cita, para la revisión):
- Las frases «Las fuentes leídas no tratan su efecto sobre la inflamación…», «Las fuentes leídas no dan normas de terapia manual ni de ejercicio…» y «las fuentes leídas no estudian el ejercicio con calor ni la conducción».
- «El sangrado que estudian es el grave, digestivo o intracraneal, no los hematomas de las técnicas manuales». Describe lo que miden Alam 2022 y Nochaiwong 2022; no lo dicen ellos.
- Los rótulos «Urgente» y «Pronto» del apartado «Cuándo consultar». **La clasificación es mía**:
  - Las fuentes llaman grave o potencialmente mortal al síndrome serotoninérgico y a la sobredosis de tricíclicos, pero no dicen «urgente» pensando en un fisioterapeuta.
  - **También es mía la clasificación como «Urgente» de las ideas de suicidio o el empeoramiento del ánimo**, que las fuentes piden vigilar de cerca, **y de los signos de hemorragia digestiva**.
  - Es mía la clasificación como «Pronto» del mareo o las caídas nuevas, la posible hiponatremia, la tensión alta, los sangrados poco habituales y los síntomas de lesión hepática; para estos últimos Biswas 2026 sí pide valoración médica.
- El rótulo «Combinaciones que hay que comentar con quien prescribe»; las combinaciones y su riesgo sí son de las fuentes.
- «Nunca aconsejes dejarlos ni bajarlos por tu cuenta… con quien los prescribe. Las dudas, al médico o al farmacéutico.» Que se retiran de forma gradual sí es de Thour 2026 y Biswas 2026.
- «(cada fuente da un límite)»: el aviso de suicidio es para «menores de 24» (Thour 2026), «24 o menos» (Biswas 2026) y «hasta 25» (Chu y Wadhwa 2023).
- «Tensión alta en la consulta», para el aumento de tensión arterial que piden vigilar Singh y Saadabadi 2024 y Biswas 2026.

**Redacción propia en los gabapentinoides** (sin cita, para la revisión):
- Las frases «Las fuentes leídas no tratan/no cuantifican/no dan…» y «la revisión no incluye estudios…».
- Los rótulos «Urgente» y «Pronto» del apartado «Cuándo consultar»; **la clasificación como «Urgente» de la depresión nueva o las ideas de suicidio, la confusión y la respiración lenta es mía**: las fuentes piden vigilarlas, pero no las llaman urgentes.
- «Coméntalo con quien los prescribe» (uso indebido) y «Las dudas, al médico o al farmacéutico».
- «Nunca aconsejes dejarlos ni bajarlos por tu cuenta… se hace de forma gradual con quien los prescribe» (que la retirada es gradual sí es de Yasaei 2024 y Cross 2024; no se copian las pautas de días).
- La frase sobre el conducir sigue a Yasaei 2024 y Cross 2024 con palabras propias.

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
