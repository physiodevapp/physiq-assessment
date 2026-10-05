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
| ce12 | Dolor radicular | ✅ **Hecho** | Kuijper 2009, BMJ 339:b3883 (acceso abierto en PMC) · Blanpied 2017, JOSPT 47(7):A1–A83 (versión publicada, orthopt.org) | Kuijper: 12 sesiones en 6 semanas, sin terapia manual, ejercicio graduado + casa diario; o collarín semirrígido 3 + 3 semanas. La lista de ejercicios está en el apéndice web de BMJ (bloqueado): pedirla si se quiere concretar. Guía: agudo C, crónico B (tracción intermitente combinada) |
| ce13 | Mareo cervicogénico | ✅ **Hecho** | Reid 2014, Phys Ther 94(4):466–476 (PDF del usuario; doble ciego frente a placebo, n = 86) | Población: mareo crónico ≥3 meses con dolor o rigidez cervical. SNAG (6 rep., autoSNAG 6 rep./día) o Maitland (3 × 30 s por nivel, hasta 3 niveles, + movilidad 3 rep./dirección/día); 2–6 sesiones en 6 semanas |
| ce14 | Idiopático | ✅ **Hecho** (2026-10) | Blanpied 2017 (PDF del usuario), categoría «dolor de cuello con déficit de movilidad» | Recomendación por fase con su grado (agudo B/C, subagudo B/C, crónico B/C); la guía no fija volumen y lo dice |
| ce1–ce7, ce9, ce11 | Con cifras sin fuente | ✅ **Revisadas** (2026-10) | Blanpied 2017; Lluch 2020, cap. 5.3, p. 378 en `ce2` y `ce4` | Tenían repeticiones, segundos, «% CVM» y «20–22 mmHg» sin fuente desde el primer commit; ninguna cifra está en la guía. Reescritas como `lu1`–`lu4`: recomendación de la categoría de Blanpied con su grado, sin cifras, con `dosisFuente`. `ce2` y `ce4` añaden cómo dosificar el entrenamiento craneocervical (Lluch 2020: nivel inferior al fallo del test, apoyos de 5–10 s) |
| ce8 | Mielopatía | C · Derivación | Blanpied 2017 (solo un dato de nivel IV, no recomendación) | `DOSIS_DERIVAR` (decisión del usuario) |
| ce10 | Disfunción de 1.ª costilla | D | — | `dosis: ''` (decisión del usuario): ninguna fuente, y Blanpied 2017 no encontró beneficio de los ejercicios respiratorios en el dolor de cuello crónico, que era la pauta anterior |

## Rodilla (`ro8`–`ro20`)
| Id | Hipótesis | Tipo | Fuente a pedir | Qué comprobar |
|---|---|---|---|---|
| ro8 | LCM | A/B | Logerstedt 2017, JOSPT 47(11):A1–47, *Knee Ligament Sprain Revision 2017* | Ortesis, carga y progresión por grado I–III |
| ro9 | LCP | A/B | Logerstedt 2017 | Ídem. Las lesiones combinadas van a derivación |
| ro10 | LLE y esquina posterolateral | C (grado III) / B | Logerstedt 2017 | Las de grado III o combinadas suelen ser quirúrgicas: comprobar lo que dice la guía |
| ro11 | Fracturas (rótula, meseta) | C | — | Derivar. Sin dosis de fisioterapia hasta la pauta traumatológica |
| ro12 | Inestabilidad rotuliana | B | ESSKA 2024, consenso formal sobre la primera luxación de rótula, parte 2 (KSSTA, acceso libre) | Fragmento: ninguna ortesis es superior a no llevarla (solo quizá, muy poco tiempo, en fase aguda y sin limitar el rango); movilidad activa y fuerza precoces; sin diferencia en las reluxaciones entre carga parcial y total. Copiar sus afirmaciones literales |
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
| h1 | Capsulitis adhesiva | ✅ **Hecho** (2026-10) · B | Kelley 2013, JOSPT 43(5):A1–A31 · Salamh 2025, J Man Manip Ther 33(4):309–320 (PDF del usuario) | Pauta por irritabilidad (Kelley: educación B, estiramientos B, movilización C, infiltración + ejercicio A). **Conflicto:** Kelley admite movilización de baja intensidad en la irritabilidad alta (C) y modalidades (C); el consenso Delphi de 2025 considera ineficaz la terapia manual en la fase precoz (93 %) y el masaje, frío, electroestimulación y ultrasonido (también el calor en la fase precoz). Prevalece el consenso, más reciente, y se dice. Ninguna fuente fija volumen |
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

## Tobillo y pie (`tp1`–`tp36`)
| Id | Hipótesis | Tipo | Fuente a pedir | Qué comprobar |
|---|---|---|---|---|
| tp1 | Esguince lateral agudo | ✅ **Hecho** | Martin 2021, JOSPT 51(4):CPG1–CPG80 (versión publicada, orthopt.org) | En `data/tobillo_pie.js` con los grados. La guía dice expresamente que no se puede recomendar modalidad ni volumen de ejercicio; el único número es la inmovilización ≤10 días en los graves |
| tp2 | Sindesmosis | C/B | — | Las inestables van a derivación. Pedir consenso (p. ej. BJSM) si se quiere pauta conservadora |
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
| tp33 | Fractura de marcha (cuello del metatarsiano) | B | Warden 2014 | Bajo riesgo: carga modificada y vuelta progresiva. Copiar el criterio de progresión |
| tp34 | Neuroma de Morton | D | — | — |
| tp35 | Gota | C | — | Derivación médica. No es competencia de fisioterapia tratar la crisis |
| tp36 | Apofisitis pediátricas (Sever, Iselin, Köhler, Freiberg) | B (por analogía) | Rathleff 2020 (Osgood) | Solo por analogía: no hay ensayo para Sever. Si se usa, decirlo. Köhler y Freiberg van a derivación |

## Cadera (`ca11`–`ca19`)
**ca16 (aductor)**: ✅ **Hecho** con Hölmich 1999, Lancet 353:439–443 (PDF del usuario; ensayo aleatorizado, n = 68): programa activo de 8–12 semanas en dos módulos, con las series del panel 1 del artículo.

El resto **nunca se ha buscado** (2026-10): no hay tipo asignado. Pendiente de una sesión propia (Fase E de `MIGRATION_PLAN.md`).

| Id | Hipótesis | Tipo | Fuente a pedir | Qué comprobar |
|---|---|---|---|---|
| ca11 | Lesión aguda de ingle | sin buscar | — | — |
| ca12 | Ligamento redondo e inestabilidad | sin buscar | — | — |
| ca13 | Condropatía de cadera | sin buscar | — | — |
| ca14 | Neuropatías de cadera e ingle | sin buscar | — | — |
| ca15 | Sensibilización central | sin buscar | — | — |
| ca17 | Dolor inguinal relacionado con el psoas ilíaco | sin buscar | — | — |
| ca18 | Dolor inguinal relacionado con el canal inguinal | sin buscar | — | — |
| ca19 | Dolor inguinal relacionado con el pubis | sin buscar | — | — |

## Resumen
- **Hechas (septiembre 2026, textos completos leídos):** tp1, tp8, tp9, tp14, tp21, tp26, ce12, ce13, ro15 y ca16, con `dosisFuente`.
- **Con fuente de pauta, a falta del PDF de pago (A):** ninguna.
- **Derivación antes que dosis (C), hecho:** ce8 (mielopatía, 2026-10), h11, ro11, tp3–tp6, tp17, tp30 y tp35 llevan `DOSIS_DERIVAR` («Derivar: sin tratamiento de fisioterapia hasta el diagnóstico médico», texto decidido por el usuario). Las que solo se derivan según el grado o un signo (ro10, tp2, tp23, ro14, ro16, ro19, tp25, tp32) siguen con `dosis: ''`.
- **Recomendación de guía sin pauta numérica (B), pendientes:** `ro8`, `ro9`, `ro10` (sin grado III) con Logerstedt 2017; `ro12` (ESSKA 2024), `tp2`, `tp33` (Warden 2014), `tp36` (por analogía con Rathleff 2020). Se rellenan como `tp1`/`tp8`: lo que recomienda la guía, con su grado y diciendo que no fija volumen.
- **Sin buscar:** cadera `ca11`–`ca15`, `ca17`–`ca19`.
- **Sin evidencia de dosis específica (D):** `h10`, `ro13`, `ro17`, `ro18`, `ro20`, `tp7`, `tp10`–`tp13`, `tp15`, `tp16`, `tp18`–`tp20`, `tp22`, `tp24`, `tp27`–`tp29`, `tp31`, `tp34`. `dosis: ''` es lo correcto y no conviene rellenarlo.

## Para cerrar esto
Hay dos caminos: que el usuario aporte los PDF (como se hizo en cadera y rodilla), o permitir en la red del entorno `pubmed.ncbi.nlm.nih.gov`, `pmc.ncbi.nlm.nih.gov`, `www.jospt.org` y `www.orthopt.org`. Luego, una región por sesión, siguiendo la Fase D.
