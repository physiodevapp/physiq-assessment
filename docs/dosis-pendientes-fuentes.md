# Dosis pendientes — mapa de fuentes (septiembre 2026)

**Actualización:** con la red abierta ya se han leído los textos completos de las guías de tobillo y pie (ver «Resumen»). Lo demás sigue sin copiarse a `data/`.

**Nada de esto se ha copiado a `data/`** (salvo lo marcado ✅ Hecho). El proxy de la sesión bloqueó todos los textos completos: PubMed, PMC, jospt.org, orthopt.org, bjsm.bmj.com y los espejos de PDF. Solo se pudieron leer títulos y fragmentos del buscador. Por la regla de la Fase D («nunca dar una cifra por buena desde un resumen de terceros»), este documento **localiza la fuente correcta de cada hipótesis y dice qué hay que comprobar en el PDF**. No propone dosis para pegar.

Leyenda:
- **A — Hay fuente con pauta.** Guía de práctica clínica o ensayo con protocolo. Pedir el PDF y copiar la pauta literal con `fuente`.
- **B — Hay recomendación sin pauta numérica.** La guía dice qué hacer, pero no series ni semanas. La dosis sería «principio + a criterio del clínico», citando la guía.
- **C — Hipótesis de derivación.** Lo primero no es una dosis de fisioterapia, sino derivar o descargar hasta la pauta médica. Propuesta: en lugar de `dosis: ''`, un texto de derivación (decisión del usuario, porque cambia lo que dice la fase 5).
- **D — No se encontró evidencia de dosis específica.** Se queda en `dosis: ''` («a criterio del clínico»), que es lo honesto.

«Fragmento» quiere decir que el dato solo se ha visto en el resumen o el fragmento del buscador. Está sin verificar.

## Lumbar (`lu1`–`lu9`)

`lu1`–`lu4` no eran pendientes (tenían dosis), pero sus cifras no tenían fuente: ✅ revisadas en 2026-10 con George 2021, NICE NG59 y Munakomi 2023 (ver Fase E en `MIGRATION_PLAN.md`).

| Id | Hipótesis | Tipo | Fuente a pedir | Qué comprobar |
|---|---|---|---|---|
| lu5 | Radiculopatía (déficit neurológico) | B | George 2021 (PMC10508241) · NICE NG59 | ✅ Hecho (2026-10): textos completos leídos. Ejercicio (B), movilización articular y neural (B), sin tracción (D; NICE: no ofrecer), terapia manual solo con ejercicio (NICE 1.2.7). Grado deducido del verbo con la tabla de la guía. Ninguna fija volumen |
| lu6 | Discogénico | B | George 2021 · NICE NG59 | ✅ Hecho (2026-10): recomendaciones para la lumbalgia en general (aguda y crónica, incluido MDT), diciendo que no son específicas del origen discogénico |
| lu7 | Facetario | B | George 2021 · NICE NG59 | ✅ Hecho (2026-10): recomendaciones para la lumbalgia en general (sin MDT), diciendo que no son específicas del dolor facetario. NICE 1.3.1–1.3.3 (radiofrecuencia tras bloqueo de rama medial positivo; no infiltraciones) va en `pronostico.derivacion` |
| lu8 | Sacroilíaca | B | Al-Subahi 2017 (PMC5599847) · NICE NG59 | ✅ Hecho (2026-10). **Corrección:** el fragmento anterior («ejercicio y técnicas de energía muscular > movilización») era erróneo; el texto completo concluye que la manipulación parece más eficaz que el ejercicio, el vendaje neuromuscular o el reposo, y no habla de energía muscular. Calidad baja o media, sin volumen reproducible; manipulación siempre junto a ejercicio (NICE 1.2.7, más reciente) |
| lu9 | Miofascial | B | George 2021 · NICE NG59 | ✅ Hecho (2026-10): recomendaciones para la lumbalgia en general (masaje/partes blandas B, punción seca C solo como complemento, ejercicio y movilización A), diciendo que no son específicas del dolor miofascial |

## Cervical (`ce1`–`ce14`)
| Id | Hipótesis | Tipo | Fuente a pedir | Qué comprobar |
|---|---|---|---|---|
| ce12 | Dolor radicular | ✅ **Hecho** | Kuijper 2009, BMJ 339:b3883 (acceso abierto en PMC) · Blanpied 2017, JOSPT 47(7):A1–A83 (versión publicada, orthopt.org) | Kuijper: 12 sesiones en 6 semanas, sin terapia manual, ejercicio graduado + casa diario; o collarín semirrígido 3 + 3 semanas. La lista de ejercicios está en el apéndice web de BMJ (bloqueado): pedirla si se quiere concretar. Guía: agudo C, crónico B (tracción intermitente combinada). Revisado 2026-10 (PMC): a los 6 meses no hubo diferencias con esperar (añadido a la pauta) |
| ce13 | Mareo cervicogénico | ✅ **Hecho** | Reid 2014, Phys Ther 94(4):466–476 (PDF del usuario; doble ciego frente a placebo, n = 86) | Población: mareo crónico ≥3 meses con dolor o rigidez cervical. SNAG (6 rep., autoSNAG 6 rep./día) o Maitland (3 × 30 s por nivel, hasta 3 niveles, + movilidad 3 rep./dirección/día); 2–6 sesiones en 6 semanas |
| ce14 | Idiopático | ✅ **Hecho** (2026-10) | Blanpied 2017 (PDF del usuario), categoría «dolor de cuello con déficit de movilidad» | Recomendación por fase con su grado (agudo B/C, subagudo B/C, crónico B/C); la guía no fija volumen y lo dice |
| ce1–ce7, ce9, ce11 | Con cifras sin fuente | ✅ **Revisadas** (2026-10) | Blanpied 2017; Lluch 2020, cap. 5.3, p. 378 en `ce2` y `ce4` | Tenían repeticiones, segundos, «% CVM» y «20–22 mmHg» sin fuente desde el primer commit; ninguna cifra está en la guía. Reescritas como `lu1`–`lu4`: recomendación de la categoría de Blanpied con su grado, sin cifras, con `dosisFuente`. `ce2` y `ce4` añaden cómo dosificar el entrenamiento craneocervical (Lluch 2020: nivel inferior al fallo del test, apoyos de 5–10 s). Revisión de referencias de cervical (2026-10): Blanpied releída entera; en `ce11` se añade que la guía da el programa en casa de resistencia de flexores como beneficio frente al aeróbico (p. A29) y, con el mismo estudio, como sin beneficio frente a aeróbico más estiramientos (p. A30) |
| ce8 | Mielopatía | C · Derivación | Blanpied 2017 (solo un dato de nivel IV, no recomendación) | `DOSIS_DERIVAR` (decisión del usuario) |
| ce10 | Disfunción de 1.ª costilla | D | — | `dosis: ''` (decisión del usuario): ninguna fuente, y Blanpied 2017 no encontró beneficio de los ejercicios respiratorios en el dolor de cuello crónico, que era la pauta anterior |

## Rodilla (`ro1`–`ro20`)

`ro1`–`ro7` tenían series, repeticiones y segundos sin fuente desde el primer commit: ✅ revisadas en 2026-10, con los textos completos (o la parte indicada) leídos en esta sesión. Como en lumbar, cervical y hombro, se reescriben con la recomendación de la guía y su grado, sin cifras que la guía no da.

| Id | Hipótesis | Tipo | Fuente a pedir | Qué comprobar |
|---|---|---|---|---|
| ro1 | Artrosis | ✅ **Hecho** (2026-10) · B | NICE NG226 (nice.org.uk, sin actualizar desde 2022) | Ejercicio terapéutico adaptado («offer»), supervisado y con educación («consider»), pérdida de peso, terapia manual solo con ejercicio, sin acupuntura, punción seca ni electroterapia, ayudas para la marcha, ortesis solo en casos concretos. Sin volumen |
| ro2 | Menisco | ✅ **Hecho** (2026-10) · B | Logerstedt 2018, JOSPT 48(2):A1–A50 (PDF de orthopt.org) | Movilidad, fuerza de rodilla y cadera y neuromuscular (B); tras meniscectomía, supervisado + casa (B) y electroestimulación (B). Centrada en el posoperatorio; sin volumen |
| ro3 | Dolor femoropatelar | ✅ **Hecho** (2026-10) · B | Ophey 2025, KSSTA 33:457–469 (guía holandesa, PMC) · Willy 2019, JOSPT 49(9):CPG1–CPG95 (PDF del usuario) | Ejercicio de cuádriceps y/o cadera 6–12 semanas, ajustado al dolor; de Willy se suma lo que no choca (sin punción seca ni terapia manual aislada, A; sin agentes físicos ni biofeedback, B; carrera C; educación F). **Conflicto:** Willy admite vendaje (B) y ortesis plantar prefabricada (A) con el ejercicio desde el inicio y desaconseja rodilleras (B); la holandesa, más reciente y del mismo nivel, los deja para cuando el ejercicio no basta. Willy: la dosis óptima no se conoce |
| ro4 | LCA | ✅ **Hecho** (2026-10) · B | Logerstedt 2017, JOSPT 47(11):A1–A47 (PDF de orthopt.org) | Reeducación neuromuscular con fuerza (A), ortesis funcional en la insuficiencia (C); el resto, y el único volumen (2–3 veces por semana, 6–10 meses, A), es tras la reconstrucción |
| ro5 | Tendinopatía rotuliana | ✅ **Hecho** (2026-10) · B | Ophey 2025 · Lopes 2025 (Cochrane, resumen) | Plan en cuatro fases, fuerza progresiva ≥12 semanas (resistencia pesada y lenta; isométricos si hay dolor reactivo), cinta infrarrotuliana si no mejora. Certeza muy baja; la Cochrane no puede asegurar el efecto. La pauta anterior (isométricos 5 × 45 s) no tenía fuente |
| ro6 | Cintilla iliotibial | ✅ **Hecho** (2026-10) · B | Sanchez-Alvarado 2024, Front Sports Act Living (revisión sistemática, PMC) | Fortalecimiento de abductores de cadera, 4–8 semanas, mejor con terapia manual u ondas de choque. Evidencia baja, solo corredores, sin guía |
| ro7 | Pata de ganso | ✅ D | — | No se encontró ninguna guía ni revisión de fisioterapia: `dosis: ''` (la pauta anterior no tenía fuente) |
| ro8 | LCM | ✅ **Hecho** (2026-10) · B | Logerstedt 2017 | Reeducación neuromuscular con fuerza (A); ortesis en la lesión grave (F). Sin volumen |
| ro9 | LCP | ✅ **Hecho** (2026-10) · B | Logerstedt 2017 | Ídem; ortesis en la lesión aguda (F) |
| ro10 | LLE y esquina posterolateral | ✅ **Hecho** (2026-10) · B | Logerstedt 2017 | Ídem; ortesis en la lesión de la esquina posterolateral (F). La guía no trata cuándo operar las de grado III o combinadas |
| ro11 | Fracturas (rótula, meseta) | C | — | Derivar. Sin dosis de fisioterapia hasta la pauta traumatológica |
| ro12 | Inestabilidad rotuliana | ✅ **Hecho** (2026-10) · B | Balcarek 2025, KSSTA 33(12):4197–4206 (consenso formal ESSKA, parte 2; texto completo en PMC) | Conservador solo con riesgo de recidiva bajo y sin lesión osteocondral (C); ortesis sin ventaja, como mucho muy breve y sin limitar el rango (B); ejercicio guiado siempre (C); recidiva ≥25 %, hasta 70 % en jóvenes (B). La parte 2 no habla de carga parcial frente a total (el fragmento anterior no se confirma) |
| ro13 | Grasa de Hoffa | D | — | — |
| ro14 | Bursitis pre e infrarrotuliana | C/D | — | Si hay sospecha séptica, derivar (ya está en el cribado de rodilla) |
| ro15 | Osgood-Schlatter / SLJ | ✅ **Hecho** (solo Osgood) | Rathleff 2020, Orthop J Sports Med 8(4) (acceso abierto en PMC; apéndice 1 descargado) | Es una **serie de casos, nivel 4**, sin grupo control (no una cohorte comparativa). **Excluyó el Sinding-Larsen-Johansson**: la dosis lo dice. Pauta completa del apéndice: isométricos y puente 4 semanas, 3 niveles de fuerza y escalera de 11 escalones con dolor ≤2/10 |
| ro16 | Lesión osteocondral | C/D | — | Si es inestable, derivar |
| ro17 | Plica | D | — | — |
| ro18 | Tibioperonea proximal | D | — | — |
| ro19 | Nervio peroneo común | C/D | — | Déficit motor progresivo → derivar |
| ro20 | Quiste de Baker | D | — | Diferencial con TVP (ya lo cubre el cribado, `r_v2`) |

## Hombro (`h1`–`h11`)

`h1`–`h9` tenían series, repeticiones, «% CVM» y grados sin fuente desde el primer commit: ✅ revisadas en 2026-10 (ver Fase E en `MIGRATION_PLAN.md`).

| Id | Hipótesis | Tipo | Fuente a pedir | Qué comprobar |
|---|---|---|---|---|
| h1 | Capsulitis adhesiva | ✅ **Hecho** (2026-10) · B | Kelley 2013, JOSPT 43(5):A1–A31 · Salamh 2025, J Man Manip Ther 33(4):309–320 (PDF del usuario) | Pauta por irritabilidad (Kelley: educación B, estiramientos B, movilización C, infiltración + ejercicio A). **Conflicto:** Kelley admite movilización de baja intensidad en la irritabilidad alta (C) y modalidades (C); el consenso Delphi de 2025 considera ineficaz la terapia manual en la fase precoz (93 %) y el masaje, frío, electroestimulación y ultrasonido (también el calor en la fase precoz). Como el consenso es posterior pero de menor nivel de evidencia que la guía, se presentan las dos (regla de conflictos en `docs/razonamiento-cribado.md`). Ninguna fuente fija volumen |
| h2 | Pinzamiento subacromial | ✅ **Hecho** (2026-10) · B | Desmeules 2025, JOSPT 55(4):235–274 (PDF del usuario; incluye el SAPS en la tendinopatía del manguito) | Educación C, ejercicio activo A (carga alta no mejor que baja; supervisado no mejor que en casa), terapia manual B, vendaje D, sin ultrasonido B, ergonomía C, imagen y derivación a las 12 semanas F. Sin volumen |
| h3 | Rotura del manguito | ✅ **Hecho** (2026-10) · B (parcial) / D (completa) | Desmeules 2025 · Alentorn-Geli 2026 | Desmeules incluye la rotura parcial y excluye la completa. La completa queda a criterio del clínico; tras una luxación anterior es indicación quirúrgica (consenso ESSKA-ESA, B) |
| h4 | Inestabilidad GH | ✅ **Hecho** (2026-10) · B | Alentorn-Geli 2026, KSSTA 34:3040–3051 (consenso ESSKA-ESA, parte 2; PDF del usuario) | Solo la anterior traumática: cabestrillo para el dolor y movilización precoz (C), rehabilitación siempre (D), recidiva → cirugía, preparación (C), vuelta al deporte con criterios, 6–16 semanas (C). La posterior y la multidireccional no las trata: a criterio del clínico |
| h5 | SLAP | ✅ D | — | Ninguna guía ni consenso con pauta de fisioterapia (Lluch 2020, cap. 3.1, pp. 63–64: no hay hallazgo específico y no siempre se trata). `dosis: ''` |
| h6 | Cervical con dolor referido al hombro | ✅ **Hecho** (2026-10) · B | Blanpied 2017 (PDF del usuario) | Categoría «dolor de cuello con déficit de movilidad», que incluye el dolor referido a la cintura escapular; misma pauta que `ce1` |
| h7 | Acromioclavicular | ✅ D | — | Sin guía de fisioterapia. Lluch 2020 (p. 61) solo menciona la infiltración ecoguiada de corticoide, que es médica. `dosis: ''` |
| h8 | Discinesia escapular | ✅ D | — | Sin guía. Lluch 2020 (pp. 53–54): no se ha demostrado que la discinesia cause el dolor. `dosis: ''` |
| h9 | Disfunción de 1.ª costilla | ✅ D | — | Igual que `ce10`: ninguna fuente, y Blanpied 2017 (p. A29) no encontró beneficio de los ejercicios respiratorios en el dolor de cuello crónico, que era la pauta anterior. `dosis: ''` |
| h10 | Artrosis GH | D (sin ensayos) | AAOS 2020, *Management of Glenohumeral Joint Osteoarthritis* (guía) · revisión sistemática de 2026 sobre intervenciones dirigidas por fisioterapeutas (Shoulder & Elbow, doi 10.1177/17585732261450961) | Fragmento de la revisión: «no hay ensayos publicados sobre intervenciones de fisioterapia en artrosis GH con tratamiento no quirúrgico», solo en el postoperatorio. Conclusión: `dosis: ''` es correcto; se puede citar en el criterio la ausencia de evidencia |
| h11 | Luxación bloqueada o fractura | C | — | Ya dice «→ Rx». Propuesta: dosis «Derivar para radiografía; sin tratamiento de fisioterapia hasta el diagnóstico» |

## Tobillo y pie (`tp1`–`tp37`)
| Id | Hipótesis | Tipo | Fuente a pedir | Qué comprobar |
|---|---|---|---|---|
| tp1 | Esguince lateral agudo | ✅ **Hecho** | Martin 2021, JOSPT 51(4):CPG1–CPG80 (versión publicada, orthopt.org) | En `data/tobillo_pie.js` con los grados. La guía dice expresamente que no se puede recomendar modalidad ni volumen de ejercicio; el único número es la inmovilización ≤10 días en los graves |
| tp2 | Sindesmosis | ✅ **Hecho** (2026-10) | van Dijk 2016, KSSTA 24(4):1217–27 (consenso ESSKA-AFAS, nivel IV; PDF del usuario, leído entero con su compañero de clasificación, KSSTA 24(4):1200–16) | Solo la estable (deltoideo íntegro): 3 semanas sin carga, bota de marcha 3 semanas y propiocepción desde el fin de la descarga. La inestable se deriva (cirugía). El usuario aceptó un consenso de cirujanos de nivel IV como fuente (2026-10) |
| tp3 | Rotura del Aquiles | C | — | Derivar. El tratamiento funcional frente a la cirugía lo decide traumatología |
| tp4 | Lisfranc | C | — | Derivar |
| tp5 | Fracturas (5.º MT, calcáneo) | C | — | Derivar |
| tp6 | Luxación del tibial posterior | C | — | Derivar |
| tp7 | Pinzamiento posterior | D | — | — |
| tp8 | Aquiles, porción media | ✅ **Hecho** | Chimenti 2024, JOSPT 54(12):CPG1–CPG32 (versión publicada, orthopt.org) | **Corrección:** la guía de 2024 dice **al menos 3 veces por semana** (grado E), no 2: el «2» del fragmento era la recomendación de 2018 (grado F). Frecuencia, sesiones y duración no parecen cambiar el resultado |
| tp9 | Aquiles insercional | ✅ **Hecho** (evidencia baja) | Jonsson 2008, BJSM 42:746–749 (PDF del usuario; piloto sin grupo control) | Excéntrico sin dorsiflexión, rodilla extendida, 3 × 15 dos veces al día, 7 días/semana, 12 semanas, con dolor permitido y carga en mochila |
| tp10 | Vaina del Aquiles | D | — | — |
| tp11 | Plantar delgado | D | — | — |
| tp12 | Nervio sural | D | — | — |
| tp13 | Bursitis calcánea superficial | D | — | — |
| tp14 | Tendinopatía del tibial posterior | ✅ **Hecho** | Kulig 2009, Phys Ther 89(1):26–37 (PDF del usuario; ensayo aleatorizado, n = 36) | Plantillas + estiramiento 3 × 30 s 2/día + aducción resistida del pie con flexión plantar 3 × 15 2/día, 12 semanas. Ojo: usó un aparato de muelles específico (TibPost Loader); la dosis lo dice |
| tp15 | Flexor largo del primer dedo | D | — | — |
| tp16 | Túnel del tarso | D | — | — |
| tp17 | Fractura de estrés (maléolo medial, astrágalo, calcáneo) | C | Warden 2014, JOSPT 44(10):749–765 | Clasificación de alto y bajo riesgo: el maléolo medial es de alto riesgo, así que derivar y descargar. Copiar la pauta de vuelta a la carrera solo para las de bajo riesgo |
| tp18 | Seno del tarso | D | — | — |
| tp19 | Peroneos | D | — | — |
| tp20 | Pinzamiento anterior | D | — | — |
| tp21 | Inestabilidad crónica | ✅ **Hecho** | Martin 2021 · Liu 2025 · McKeon 2008, Med Sci Sports Exerc 40(10):1810–1819 (PDF del usuario) | La guía no fija dosis; Liu, orientativo; McKeon da el protocolo concreto (12 sesiones de 20 min en 4 semanas, saltos a estabilización con 7 niveles) |
| tp22 | Sinovitis postraumática | D | — | — |
| tp23 | Coalición tarsiana | C | — | Derivar si hay rigidez o espasmo peroneo |
| tp24 | Artrosis de tobillo o pie | D | — | — |
| tp25 | Osteocondritis del astrágalo | C/D | — | — |
| tp26 | Dolor plantar crónico del talón | ✅ **Hecho** | Koc 2023, JOSPT 53(12):CPG1–CPG39 (versión publicada: `Heel_Pain_Plantar_Fasciitis_revision_2023_1_.pdf` en orthopt.org) | **Ojo:** `Heel_Pain_Plantar_Fasciitis_Revision_2023.pdf` en orthopt.org es el **borrador** para revisión y difiere (p. ej. ejercicio C en el borrador, B en la publicada). Parámetros de la tabla de intervención: vendaje 1 a ≤6 semanas, férula nocturna 1–3 meses, láser 2–3 puntos con dosis por punto, punción seca 1–6 sesiones. La dosis del estiramiento no está establecida |
| tp27 | Almohadilla grasa del talón | D | — | — |
| tp28 | Atrapamiento nervioso del talón | D | — | — |
| tp29 | Calcaneocuboidea y cubometatarsiana | D | — | — |
| tp30 | Fractura de estrés del mediopié | C | Warden 2014 | El navicular es de alto riesgo: derivar y descargar |
| tp31 | 1.ª metatarsofalángica | D | — | — |
| tp32 | Base del 2.º metatarsiano | C/D | Warden 2014 | Es de alto riesgo si se trata de fractura de estrés |
| tp33 | Fractura de marcha (cuello del metatarsiano) | ✅ **Hecho** (2026-10) | Warden 2014, JOSPT 44(10):749–65 (comentario clínico, nivel 5; PDF del usuario, leído entero) | Diáfisis del 2.º–4.º MT = bajo riesgo (tabla 1). Fase 1 de actividad modificada guiada por el dolor y factores de riesgo; fase 2 con el programa graduado de carrera de su tabla 3 |
| tp34 | Neuroma de Morton | D | — | — |
| tp35 | Gota | C | — | Derivación médica. No es competencia de fisioterapia tratar la crisis |
| tp36 | Apofisitis pediátricas (Sever, Iselin, Köhler, Freiberg) | ✅ **Hecho** (2026-10, por analogía) | Rathleff 2020 (Osgood; PDF y apéndice 1 del usuario) | Solo las apofisitis, y la pauta dice que es por analogía y que los ejercicios del estudio son de rodilla. Köhler y Freiberg (osteocondrosis) quedan fuera de la pauta |
| tp37 | Fractura de tobillo (maleolar) | C | — | Derivación médica para radiografía (Ottawa de tobillo positiva) |

## Cadera (`ca1`–`ca19`)
Sesión de 2026-10 (textos completos de acceso abierto leídos en Europe PMC y nice.org.uk; JOSPT y BMJ/BJSM bloqueados por el proxy). `ca1`–`ca10` tenían dosis con cifras sin fuente desde el primer commit (como `lu1`–`lu4` y `ce1`–`ce14`): se reescriben las que tienen fuente y se vacían las que no (decisión del usuario).

| Id | Hipótesis | Tipo | Fuente | Estado |
|---|---|---|---|---|
| ca1 | Artrosis | A | Koc 2025 (guía APTA, revisión 2025; sustituye a Cibulka 2017) + NICE NG226 | ✅ Grados APTA y dosis (ejercicio 1–5/semana, 30–120 min, 5–16 semanas); donde chocan (punción seca, ultrasonido) se dan las dos posturas (2026-10) |
| ca2 | SIFA | B | Enseki 2023 (guía APTA) + consenso de Zúrich + Griffin 2018 + Kemp 2026 (PhysioFIRST) | ✅ Multimodal (B) con sus grados, al menos 3 meses; sin series |
| ca3 | Labrum | B | Enseki 2023 + consenso de Zúrich + Kemp 2020 | ✅ Multimodal (B, recomendado en particular para SIFA y labrum), al menos 3 meses |
| ca4 | Tendinopatía glútea | A | Mellor 2018 (LEAP) + Mellor 2016 (protocolo) | ✅ Pauta completa de 8 semanas |
| ca5 | Debilidad de abductores | D | — | Vaciada (era un déficit, no un diagnóstico; cifras sin fuente) |
| ca6 | Control neuromuscular | D | — | Vaciada (ídem) |
| ca7 | Síndrome glúteo profundo | D | — | Vaciada: solo casos clínicos |
| ca8 | Pinzamiento isquiofemoral | D | — | Vaciada: solo casos clínicos (Ma 2025, comentario a un caso) |
| ca9 | Tendinopatía proximal de isquiotibiales | B | Rich 2025 | ✅ Programa progresivo con reintroducción de la compresión; sin series en el artículo |
| ca10 | Sacroilíaca | D | — | Vaciada: nada de acceso abierto |
| ca11 | Lesión aguda de ingle | A (solo aductor) | Serner 2020 | ✅ Por criterios; series en un apéndice no consultado; flexores sin pauta |
| ca12 | Ligamento redondo e inestabilidad | B (extrapolada) | Enseki 2023 | ✅ La precaución capsuloligamentosa de la guía como dato principal; multimodal por extrapolación; sin evidencia específica |
| ca13 | Condropatía de cadera | D | — | Vacía a propósito: Enseki 2023 la incluye en su alcance pero no dice nada propio (decisión del usuario) |
| ca14 | Neuropatías de cadera e ingle | D | — | Sin fuente de fisioterapia (meralgia: revisiones de tratamiento médico) |
| ca15 | Sensibilización central | D | — | Sin fuente |
| ca16 | Aductor (largo plazo) | A | Hölmich 1999 | ✅ Hecho antes (PDF del usuario) |
| ca17 | Psoas ilíaco | B | Vandeputte 2026 (revisión sistemática) | ✅ Contenido de las series de casos, sin volumen |
| ca18 | Canal inguinal | D | — | Sin fuente (la Cochrane de 2025 sobre dolor inguinal es solo un protocolo) |
| ca19 | Pubis | D | — | Sin fuente |

Después, con los PDF del usuario (guía APTA de artrosis de cadera de Cibulka 2017, guía APTA de dolor de cadera no artrósico de Enseki 2023 y consenso de Zúrich del IHiPRN), `ca1`–`ca3` ganan grados de recomendación.

## Codo (`co1`–`co16`)

`co1`–`co9` tenían series, repeticiones, «% de esfuerzo» y ángulos sin fuente desde el primer commit: ✅ revisadas en 2026-10, como `h1`–`h9`. Leídos en la sesión: Lucado 2022 (PDF completo de orthopt.org), Wistow 2025, Siemensma 2023, Biz 2019, Quzli 2025, Lubiatowski 2020 y Natroshvili 2023 (texto completo en Europe PMC); Caliandro 2025 (Cochrane), Cascia 2019 y Bateman 2025 (solo el resumen: el texto completo no es accesible); Rinkel 2013, See 2026 y Zwerus 2018 (PDF del usuario).

| Id | Hipótesis | Tipo | Fuente | Estado |
|---|---|---|---|---|
| co1 | Epicondilalgia lateral | ✅ **Hecho** (2026-10) · B | Lucado 2022, JOSPT 52(12):CPG1–CPG111 (guía APTA) | Ejercicio resistido de extensores (B) con terapia manual (B); 3 × 15 durante 6–12 semanas, la única cifra que da la guía (evidencia moderada y opinión de expertos); movilización local (B), punción seca (B), vendaje rígido (B) y el resto con su grado |
| co2 | Epicondilalgia medial | ✅ **Hecho** (2026-10) · B | See 2026, Complement Ther Med 98:103364 (revisión sistemática) | Excéntrico de flexores y pronadores dentro de un programa multimodal; certeza GRADE baja a muy baja. Los protocolos de los estudios (3 × 5 al día 12 semanas a 3 × 10 dos veces al día) se dan como lo que usaron, no como recomendación |
| co3 | Rigidez del codo | ✅ **Hecho** (2026-10) · B | Wistow 2025 (revisión sistemática) · Siemensma 2023 (revisión narrativa) | Hold-relax en la rigidez precoz, férula en la persistente; conservador si la causa es de partes blandas, cirugía si es ósea. Las cifras de uso de la férula son opinión de Siemensma y lo dice |
| co4 | Ligamento colateral cubital | ✅ **Hecho** (2026-10) · B | Biz 2019 · Cascia 2019 (revisiones sistemáticas de nivel IV) | Rehabilitación ≥3 meses de entrada; componentes de los programas en lanzadores; sin volumen |
| co5 | Inestabilidad rotatoria posterolateral | ✅ **Hecho** (2026-10) · sin ensayos | Rinkel 2013 · Quzli 2025 (revisión narrativa) | Sin ensayos (Rinkel); la prueba conservadora de 4–6 semanas es opinión de una revisión narrativa y la dosis lo dice |
| co6 | Plica radiocapitelar | ✅ **Hecho** (2026-10) · sin evidencia de eficacia | Lubiatowski 2020 (revisión narrativa) | Conservador de entrada por consenso, sin datos de cuál ni de su eficacia; artroscopia si fracasa |
| co7 | Rotura distal del bíceps | ✅ C · Derivación | — | `DOSIS_DERIVAR` (decisión del usuario, 2026-10); solo había cohortes retrospectivas |
| co8 | Neuropatía cubital | ✅ **Hecho** (2026-10) · B | Caliandro 2025 (Cochrane) · Rinkel 2013 · Bateman 2025 | Información sobre posturas que evitar; ortesis, deslizamiento neural e información sola sin diferencias; férula nocturna con evidencia insuficiente. **Conflicto:** Natroshvili 2023 (revisión sistemática de series sin control) da mejoría en el 89 % con férula; Bateman 2025, del mismo nivel y más reciente, concluye que la evidencia es insuficiente (certeza muy baja): prevalece Bateman y Natroshvili no se cita |
| co9 | Neuropatía radial (túnel radial / NIP) | ✅ D | Rinkel 2013 (ningún ensayo) | `dosis: ''`: Rinkel no encontró ningún ensayo del túnel radial. La pauta anterior no tenía fuente |
| co10 | Tendinopatía o rotura del tríceps | D | — | Hipótesis nueva (2026-10, Lluch 2020, cap. 3.2): sin fuente de pauta, `dosis: ''` |
| co11 | Pinzamiento posterior o posteromedial | D | — | Ídem |
| co12 | Fractura de estrés del olécranon | ✅ C · Derivación | — | `DOSIS_DERIVAR` (decisión del usuario, 2026-10) |
| co13 | Neuropatía del mediano (pronador / interóseo anterior) | D | — | Hipótesis nueva: `dosis: ''` |
| co14 | Pronación dolorosa | ✅ C · Derivación | — | `DOSIS_DERIVAR` (decisión del usuario, 2026-10): Lluch pide descartar fractura o infección |
| co15 | Codo de la liga infantil | ✅ **Hecho** (2026-10) · opinión | Lluch 2020, cap. 3.2, p. 94 | Detectar y tratar pronto la lesión del cartílago de crecimiento y ajustar las cargas con descanso y recuperación; sin pauta de ejercicio |
| co16 | Panner / osteocondritis disecante del capítulo | D | — | Hipótesis nueva: `dosis: ''` |

## Resumen
- **Hechas (septiembre 2026, textos completos leídos):** tp1, tp8, tp9, tp14, tp21, tp26, ce12, ce13, ro15 y ca16, con `dosisFuente`. Octubre 2026: ca1–ca4, ca9, ca11, ca12 y ca17.
- **Con fuente de pauta, a falta del PDF de pago (A):** ninguna.
- **Derivación antes que dosis (C), hecho:** ce8 (mielopatía, 2026-10), co7 (rotura distal del bíceps, 2026-10), co12 (fractura de estrés del olécranon) y co14 (pronación dolorosa, 2026-10), h11, ro11, tp3–tp6, tp17, tp30, tp35 y tp37 (fractura maleolar, 2026-10) llevan `DOSIS_DERIVAR` («Derivar: sin tratamiento de fisioterapia hasta el diagnóstico médico», texto decidido por el usuario). Las que solo se derivan según el grado o un signo (ro10, tp23, ro14, ro16, ro19, tp25, tp32) siguen con `dosis: ''`; tp2 tiene ya pauta para la lesión estable y dice que la inestable se deriva (2026-10).
- **Recomendación de guía sin pauta numérica (B), hechas (2026-10):** `ro8`, `ro9`, `ro10` (sin grado III) con Logerstedt 2017; `ro12` (ESSKA 2024), `tp2` (van Dijk 2016), `tp33` (Warden 2014), `tp36` (por analogía con Rathleff 2020). Se rellenan como `tp1`/`tp8`: lo que recomienda la guía, con su grado y diciendo que no fija volumen.
- **Sin evidencia de dosis específica (D):** `ca5`–`ca8`, `co9`–`co11`, `co13`, `co16`, `ca10`, `ca13`–`ca15`, `ca18`, `ca19`, `h10`, `ro13`, `ro17`, `ro18`, `ro20`, `tp7`, `tp10`–`tp13`, `tp15`, `tp16`, `tp18`–`tp20`, `tp22`, `tp24`, `tp27`–`tp29`, `tp31`, `tp34`. `dosis: ''` es lo correcto y no conviene rellenarlo.

## Para cerrar esto
Hay dos caminos: que el usuario aporte los PDF (como se hizo en cadera y rodilla), o permitir en la red del entorno `pubmed.ncbi.nlm.nih.gov`, `pmc.ncbi.nlm.nih.gov`, `www.jospt.org` y `www.orthopt.org`. Luego, una región por sesión, siguiendo la Fase D.
