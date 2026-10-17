# Trastornos de la activación mastocitaria (MCAD) — borrador de diseño

Estado: **borrador, sin código (octubre 2026). Pendiente de las decisiones del usuario** (ver «Decisiones», cada una con mi recomendación). Posible condición especial de la Fase P (`MIGRATION_PLAN.md`), después de la hipermovilidad (`docs/hipermovilidad.md`), el POTS (`docs/pots.md`) y el lupus (`docs/lupus.md`). La guía de condiciones especiales (`docs/condiciones-especiales.md`) tendría que añadir su fila si se hace una tarjeta.

**Enfoque** (decidido con el usuario, octubre 2026): el diseño parte del paraguas de los **trastornos de la activación mastocitaria** (MCAD, por sus siglas en inglés), no del síndrome de activación mastocitaria (SAMA) solo. Lo que cambia la sesión es el **riesgo de anafilaxia**, y ese riesgo está descrito para cada variante del paraguas (mastocitosis, SAMA con sus variantes, α-triptasemia hereditaria como agravante), no para el SAMA aislado. La primera versión de este borrador partía del SAMA; el documento conserva su nombre de archivo.

**Qué hay hoy en la app**: nada. Ningún archivo de `data/`, `lib/` ni `formularios/` habla de anafilaxia, alergias, mastocitos, histamina ni autoinyector (búsqueda de octubre 2026). Es un hueco previo, más amplio que el SAMA: una anafilaxia en la sala puede darla cualquier paciente (ver «Fuera de este diseño»).

## Resumen

- **El paraguas.** En la clasificación del ECNM/AIM, ajustada a la CIE-10, los trastornos de la activación mastocitaria incluyen el SAMA, «an MCAD where all MCAS criteria are fulfilled», y los trastornos «otros o no especificados», para la activación local, leve o crónica que no cumple los criterios (Valent 2022, tabla 1, nota). El SAMA tiene cinco variantes, cada una con su riesgo de anafilaxia estimado: primaria o clonal (mastocitosis), secundaria (alergia), combinada, con α-triptasemia hereditaria e idiopática (Valent 2022, tabla 2; Castells 2024, tabla II).
- **La sigla no significa lo mismo para todos.** Para el ECNM/AIM, «MCAD» es *mast cell activation disorder*, el paraguas de arriba. Para el grupo de los criterios amplios es *mast cell activation disease*, un espectro «the bulk of which is likely MCAS» con sus propios criterios (Afrin 2017, introducción). Un «MCAD» en el informe de un paciente puede venir de cualquiera de los dos.
- **El SAMA, definido con rigor, es raro.** Con los criterios del consenso ECNM/AIM hacen falta episodios graves y recurrentes en dos o más sistemas, una subida de la triptasa medida durante el episodio y una respuesta a los fármacos antimediadores (Valent 2019; Valent 2022). Menos del 5 % de los derivados por sospecha los cumple (Castells 2024).
- **Hay dos «consensos» enfrentados.** Los criterios amplios (Afrin y Molderings, el llamado «consenso-2») cuentan muchos síntomas crónicos e inespecíficos y llegan a atribuir el cuadro hasta al 17 % de la población (Lee y Picard 2025, describiendo el consenso-2, que no se ha podido leer). Los del ECNM/AIM los rechazan por inespecíficos.
- **La relación con la hipermovilidad y el POTS no está medida.** No hay ningún estudio con grupo control que use criterios de consenso. La frecuencia del SAMA en el POTS va del 2 % al 87 % en la misma cohorte según el criterio que se aplique (Yao 2025). La α-triptasemia hereditaria, que parecía unir los tres cuadros, no está aumentada ni en la hipermovilidad (Vazquez 2022) ni en el POTS (Huang 2024), y su descubridor atribuye la asociación inicial a sesgos de reclutamiento (Lyons 2025).
- **Lo que importa al fisio** es la seguridad: reconocer una anafilaxia en la consulta y actuar, y conocer los desencadenantes que la sesión puede poner (ejercicio, calor, frío, roce, presión, vibración, estrés, AINE).
- **Mi recomendación** (decisión 1): una tarjeta reducida, «Trastorno mastocitario o anafilaxia», **solo con «Diagnosticado», sin «Sospecha»**, que pregunte **qué diagnóstico concreto** tiene dentro del paraguas y **si ha tenido alguna anafilaxia**. El nivel de alerta lo dan esas dos respuestas, no la etiqueta. Además, una línea de texto en los razonamientos de hipermovilidad y POTS, y **ninguna regla automática** con esas tarjetas.

## El paraguas: trastornos de la activación mastocitaria

### Qué incluye (ECNM/AIM)

La activación mastocitaria (MCA) puede ser local, sistémica leve, sistémica grave o sistémica crónica (Valent 2022, tabla 1). La clasificación pone cada forma en su sitio:

| Dentro del paraguas | Qué es | Riesgo de anafilaxia estimado | Fuente |
|---|---|---|---|
| **SAMA primario o clonal** | Cumple los criterios del SAMA y los mastocitos son clonales (KIT D816V); casi siempre hay una mastocitosis cutánea o sistémica | +++ (grave) | Valent 2022, tabla 2; Castells 2024, tabla II |
| **SAMA secundario** | Cumple los criterios; hay una alergia IgE u otra hipersensibilidad que lo explica; mastocitos normales | ++ (alto) | Ídem |
| **SAMA combinado o mixto** | Cumple los criterios y tiene dos o más de: mastocitosis, alergia clara, predisposición genética (α-triptasemia) | +++ (grave); el «complejo de alto riesgo» es α-triptasemia + mastocitosis + alergia a himenópteros | Ídem; Valent 2022, «Predisposing genetic variants» |
| **SAMA con α-triptasemia hereditaria** | Cumple los criterios, sin alergia ni mastocitosis, con α-triptasemia | De + a +++ según el número de copias; Valent 2022 duda de que exista una forma «pura» | Ídem (tabla 2, nota ****) |
| **SAMA idiopático** | Cumple los criterios sin ninguna de las causas anteriores | + (aumentado) | Ídem |
| **MCAD «otro»** | Activación sistémica grave que no llega a los criterios (por ejemplo, la triptasa sube pero no hasta la fórmula); «cannot be called MCAS»; a menudo hay una alergia IgE | Sin cifra en las fuentes leídas | Valent 2022, «Clinical manifestations» |
| **MCAD «no especificado»** | Activación local o leve, o crónica (fatiga, síntomas neuropsiquiátricos, diarrea crónica); el diagnóstico «remains descriptive» | Sin cifra; no se describe como de riesgo | Valent 2022, tabla 1 y su nota |

**Fuera del paraguas por sí solos**: la α-triptasemia hereditaria («per se … is not diagnostic for MCAS»; en portadores sin alergia ni mastocitosis la anafilaxia es «very low», Valent 2022) y una alergia IgE sin más (Valent 2022). La mastocitosis es una neoplasia propia (criterios de la OMS) que **puede** dar un SAMA primario; muchas personas con mastocitosis sistémica no tienen síntomas durante años (Valent 2022).

**Lo que dice la mastocitosis sobre la anafilaxia**, con independencia de que se haya etiquetado como SAMA: aparece en el 22–49 % de los adultos con mastocitosis sistémica (Gülen 2023; González-de-Olano 2017), a menudo como mareo y desmayo sin ronchas.

### Qué significa para la app

- **La etiqueta sola no basta.** «MCAD» abarca desde una mastocitosis con anafilaxias hasta una activación crónica sin riesgo descrito, y además la sigla tiene dos significados. Por eso la tarjeta pregunta el **diagnóstico concreto** y si ha tenido **alguna anafilaxia**, y el recuadro de la fase 5 sube el tono solo con mastocitosis, SAMA o anafilaxia previa (decisión 11).
- **El protocolo de qué hacer ante una anafilaxia es el mismo para todos** (Valent 2022, fig. 3: «the patient is treated for acute anaphylaxis regardless of the etiology»). Puede salir con cualquier marca de la tarjeta sin exagerar nada: es primeros auxilios.
- **Los desencadenantes son individuales** en todo el paraguas (Brockow 2021): se preguntan siempre, sea cual sea el diagnóstico.

## Fuentes leídas enteras

Todas en esta sesión (octubre 2026): texto completo de PMC (XML JATS o página web) con todas sus secciones y tablas, y el PDF oficial de NICE. No se vieron las figuras que solo existen como imagen salvo donde se indica, ni la mayoría de los suplementos. Las páginas de PMC no traen paginación: se cita por sección, tabla o recomendación.

### A. Definición, criterios y la controversia

| Clave propuesta | Referencia | Tipo | Qué aporta |
|---|---|---|---|
| `Akin 2010` | Akin C, Valent P, Metcalfe DD. Mast cell activation syndrome: proposed diagnostic criteria. *J Allergy Clin Immunol* 2010;126(6):1099–1104.e4. [doi:10.1016/j.jaci.2010.08.035](https://doi.org/10.1016/j.jaci.2010.08.035) (PMC3753019) | Propuesta original (NIH/NIAID). Sin las tablas E1–E4 del repositorio en línea | Criterios con exclusión de otras causas (tabla II); la respuesta a fármacos «cannot be used alone»; opioides, AINE y «physical and emotional stimuli» como desencadenantes; no todo SAMA tiene anafilaxia |
| `Valent 2018` | Valent P, Akin C, Bonadonna P, et al. Mast cell activation syndrome: importance of consensus criteria and call for research. *J Allergy Clin Immunol* 2018;142(3):1008–1010. [doi:10.1016/j.jaci.2018.06.004](https://doi.org/10.1016/j.jaci.2018.06.004) (PMC7115848) | Carta del grupo de consenso | Sobrediagnóstico y su daño («unjustified anxiety and fear»); tabla 1: EDS y POTS por debajo del 1 % de eventos que cumplen SAMA (estimación de expertos) |
| `Valent 2019` | Valent P, Akin C, Bonadonna P, et al. Proposed diagnostic algorithm for patients with suspected mast cell activation syndrome. *J Allergy Clin Immunol Pract* 2019;7(4):1125–1133.e1. [doi:10.1016/j.jaip.2019.01.006](https://doi.org/10.1016/j.jaip.2019.01.006) (PMC6643056) | Consenso ECNM/AIM (manuscrito aceptado). Sin la fig. 2 ni la tabla S1 | Criterios A + B + C (tabla I), la fórmula 20 % + 2 ng/mL, variantes (tabla II), especificidad de cada síntoma (tabla III); hipermovilidad y disautonomía «not necessarily related»; «overt MCAS is an unusual condition» |
| `Valent 2020` | Valent P, Akin C, Nedoszytko B, et al. Diagnosis, classification and management of mast cell activation syndromes (MCAS) in the era of personalized medicine. *Int J Mol Sci* 2020;21(23):9030. [doi:10.3390/ijms21239030](https://doi.org/10.3390/ijms21239030) (PMC7731385) | Revisión del grupo ECNM/AIM; leídas también las tablas S1–S3 | Síntomas crónicos inespecíficos «do not fulfill» los criterios (§2); qué mediadores valen (tabla 3); imitadores (tabla 4); cofactores (ejercicio, aspirina, alcohol); llevar dos o más autoinyectores |
| `Valent 2022` | Valent P, Hartmann K, Bonadonna P, et al. Mast cell activation syndromes: Collegium Internationale Allergologicum update 2022. *Int Arch Allergy Immunol* 2022;183(7):693–705. [doi:10.1159/000524532](https://doi.org/10.1159/000524532) (PMC9393812) | Actualización de consenso | **El paraguas MCAD** según la CIE-10 (tabla 1, nota: el SAMA es el MCAD que cumple todos los criterios; lo local o leve, «other or unspecified MCAD»); cinco variantes del SAMA (tabla 2) y condiciones predisponentes (tabla 3); el «complejo de alto riesgo» (α-triptasemia + mastocitosis + alergia a himenópteros); la anafilaxia se trata igual sea cual sea la variante (fig. 3, leyenda); cofactores, estímulos físicos y urticaria por vibración. No menciona ni EDS ni POTS |
| `Valent 2024` | Valent P, Akin C, Arock M. Reversible elevation of tryptase over the individual's baseline… *Curr Allergy Asthma Rep* 2024;24(3):133–141. [doi:10.1007/s11882-024-01124-2](https://doi.org/10.1007/s11882-024-01124-2) (PMC10960756) | Revisión de posicionamiento | Triptasa normal y α-triptasemia hereditaria (4–7,5 % de la población, «cannot be regarded as a biomarker of anaphylaxis or MCAS»); no aplicar los criterios sin síntomas o con síntomas leves |
| `Castells 2024` | Castells M, Giannetti MP, Hamilton MJ, et al. Mast cell activation syndrome: current understanding and research needs. *J Allergy Clin Immunol* 2024;154(2):255–263. [doi:10.1016/j.jaci.2024.05.025](https://doi.org/10.1016/j.jaci.2024.05.025) (PMC11881543) | Informe de un taller del NIH (incluye alergólogos, autonómicos y EDS). Sin las figs. 1–3 | Tabla II, «Classification of MCA disorders», con el **riesgo de anafilaxia estimado de cada variante** (de + a +++). El texto más equilibrado: menos del 5 % de los derivados cumple criterios estrictos; datos a favor y en contra de la relación con POTS y EDS; eficacia de los fármacos en esos cuadros «yet to be confirmed»; la disautonomía puede imitar la activación mastocitaria |
| `Lee y Picard 2025` | Lee E, Picard M. Diagnosis and management of mast cell activation syndrome (MCAS) in Canada: a practical approach. *Allergy Asthma Clin Immunol* 2025;21:49. [doi:10.1186/s13223-025-00998-9](https://doi.org/10.1186/s13223-025-00998-9) (PMC12639879) | Revisión práctica en la revista de la sociedad canadiense de alergia; sigue ECNM/AIM, respaldado por la AAAAI | Tabla 1: lo que sugiere y lo que **no** sugiere SAMA (POTS, hipermovilidad o SEDh, fatiga, cefalea, niebla mental, dolor articular, síntomas no episódicos); única fuente leída que describe el consenso-2 (de segunda mano); ejercicio, calor y estrés como desencadenantes; AINE en las 6 h previas; adrenalina autoinyectable |
| `Afrin 2017` | Afrin LB, Self S, Menk J, Lazarchick J. Characterization of mast cell activation syndrome. *Am J Med Sci* 2017;353(3):207–215. [doi:10.1016/j.amjms.2016.12.013](https://doi.org/10.1016/j.amjms.2016.12.013) (PMC5341697) | Serie de casos de un centro (413 pacientes), sin comparador. Sin las tablas suplementarias | Fuente primaria de la postura de criterios amplios, y de su uso de «MCAD» como «MC activation disease» (introducción): síntomas «chronic/recurrent», cromogranina A y heparina como marcadores, rechazo de la fórmula del 20 % + 2; mediana de 20 síntomas, dermografismo en el 76 %, EDS III en el 4 %, POTS en el 10 %, triptasa alta solo en el 16 % |
| `Hamilton 2018` | Hamilton MJ. Nonclonal mast cell activation syndrome: a growing body of evidence. *Immunol Allergy Clin North Am* 2018;38(3):469–481. [doi:10.1016/j.iac.2018.04.002](https://doi.org/10.1016/j.iac.2018.04.002) (PMC6049091) | Revisión narrativa, posición intermedia | Desencadenantes en una encuesta (calor 82 %, estrés 81 %, ejercicio 63 %, alcohol 54 %, fármacos 53 %, olores 48 %); POTS y SEDh como «asociados» (recuadro), sin datos propios |

### B. Relación con la hipermovilidad y el POTS

| Clave propuesta | Referencia | Tipo | Qué aporta |
|---|---|---|---|
| `Yao 2025` | Yao L, Subramaniam K, Raja K, et al. Association of POTS, hypermobility spectrum disorders, and MCAS in young patients; prevalence, overlap and response to therapy depends on the definition. *Front Neurol* 2025;16:1513199. [doi:10.3389/fneur.2025.1513199](https://doi.org/10.3389/fneur.2025.1513199) (PMC12063504) | Revisión retrospectiva de historias, 5 centros, 100 pacientes con POTS de 8–25 años; **sin grupo control**. Sin el suplementario | La misma cohorte da un SAMA del 2 % (criterio estricto; ninguno con triptasa basal y en brote), del 41 % (consenso-2 con laboratorio; en el 61 % de ellos por un solo valor) o del 87 % (criterio clínico). El autor de correspondencia firma el consenso-2 |
| `Kohno 2021` | Kohno R, Cannom DS, Olshansky B, et al. Mast cell activation disorder and postural orthostatic tachycardia syndrome: a clinical association. *J Am Heart Assoc* 2021;10(17):e021002. [doi:10.1161/JAHA.121.021002](https://doi.org/10.1161/JAHA.121.021002) (PMC8649306) | Serie de dos centros, 69 pacientes con POTS, sin controles sanos | Mediadores alterados en el 42 % (sobre todo histamina; triptasa alta solo en el 9 %), con muestras sin relación con los brotes; los autores dicen que no permite estimar prevalencia |
| `Lyons 2016` | Lyons JJ, Yu X, Hughes JD, et al. Elevated basal serum tryptase identifies a multisystem disorder associated with increased TPSAB1 copy number. *Nat Genet* 2016;48:1564–1569. [doi:10.1038/ng.3696](https://doi.org/10.1038/ng.3696) (PMC5397297) | Estudio genético de familias derivadas al NIH. Sin el suplementario | Descubrimiento de la α-triptasemia hereditaria; hipermovilidad (Beighton ≥ 4) en el 28 % de una cohorte de centro especializado, sin controles propios; no se diagnosticó SAMA |
| `Vazquez 2022` | Vazquez M, Chovanec J, Kim J, et al. Hereditary alpha-tryptasemia modifies clinical phenotypes among individuals with congenital hypermobility disorders. *HGG Adv* 2022;3(2):100094. [doi:10.1016/j.xhgg.2022.100094](https://doi.org/10.1016/j.xhgg.2022.100094) (PMC8917312) | Genotipado de 266 pacientes con TEH, SEDh o anomalías axiales | α-triptasemia hereditaria en el 4,9 %, igual que en la población (4,4–7,5 %): «not associated» con estos trastornos. No evalúa el SAMA |
| `Huang 2024` | Huang J, Imam K, Criado JR, et al. Hereditary alpha-tryptasemia in patients with postural orthostatic tachycardia syndrome. *J Allergy Clin Immunol Pract* 2024;12(2):528–529.e1. [doi:10.1016/j.jaip.2023.10.043](https://doi.org/10.1016/j.jaip.2023.10.043) (PMC10922344) | Carta de investigación, 493 pacientes con POTS por mesa basculante | Como mucho un 7,2 % con triptasa basal de 8 o más, frente al 6 % poblacional: «not increased» |
| `Lyons 2025` | Lyons JJ. Appraisal of the evidence linking hereditary α-tryptasemia with mast cell disorders, hypermobility and dysautonomia. *Allergy Asthma Proc* 2025;46(1):4–10. [doi:10.2500/aap.2025.46.240088](https://doi.org/10.2500/aap.2025.46.240088) (PMC11809510) | Revisión narrativa del autor del hallazgo de 2016. Sin las tablas 1 y 2 (imágenes) | La asociación inicial con la hipermovilidad y la disautonomía fue «likely a result of recruitment and ascertainment biases»; la α-triptasemia sí agrava las reacciones mastocitarias |
| `Monaco 2022` | Monaco A, Choi D, Uzun S, Maitland A, Riley B. Association of mast-cell-related conditions with hypermobile syndromes: a review of the literature. *Immunol Res* 2022;70(4):419–431. [doi:10.1007/s12026-022-09280-1](https://doi.org/10.1007/s12026-022-09280-1) (PMC9022617) | Revisión narrativa no sistemática | Recoge las cifras publicadas (24 % de SAMA diagnosticado en 98 pacientes con EDS; 9 % en una encuesta de POTS); reconoce que «no current evidence exists that directly links the two conditions», pero concluye que los mastocitos son «crucial» en el EDS (contradicción interna) |
| `Kulin 2026` | Kulin D, Fairlie T, Shah A, et al. Gastrointestinal symptoms and systemic comorbidities in patients with POTS: a systematic review and meta-analysis. *Neurogastroenterol Motil* 2026;38(4):e70305. [doi:10.1111/nmo.70305](https://doi.org/10.1111/nmo.70305) (PMC13062037) | Revisión sistemática con metaanálisis (PROSPERO). Sin los forest plots ni los suplementos | SAMA en el 36,3 % del POTS (IC 17,8–60,0; 3 estudios; I² 93 %), con datos sobre todo autodeclarados y sin grupo control; los autores califican la evidencia de «low» |

**Releídas para este tema** (ya en el registro): `Vernino 2021` (comorbilidades y tabla 1: «trastorno de activación mastocitaria» en el 9 % de una encuesta autodeclarada; «accurate data on the frequency of MCAS in POTS is not available»), `Raj 2022` (tabla 1, el mismo 9 %; calidad de la evidencia «weak»). `Raj 2021` (Part 2), que no está en el registro, solo pide más estudio.

### C. Anafilaxia y desencadenantes

| Clave propuesta | Referencia | Tipo | Qué aporta |
|---|---|---|---|
| `Cardona 2020` | Cardona V, Ansotegui IJ, Ebisawa M, et al. World Allergy Organization anaphylaxis guidance 2020. *World Allergy Organ J* 2020;13(10):100472. [doi:10.1016/j.waojou.2020.100472](https://doi.org/10.1016/j.waojou.2020.100472) (PMC7607509) | Documento de posición de la WAO, sin grados. Leídas también las figs. 1–5 | Criterios clínicos (tabla 2, fig. 1); la piel falta en el 10–20 %; ejercicio, frío, calor y sol como activación directa (fig. 2); cofactores (fig. 3, tabla 5); qué hacer primero, dosis, posición (fig. 4); reacción bifásica; autoinyector; la mastocitosis aumenta el riesgo y la anafilaxia puede ser su primera manifestación |
| `NICE NG258` | NICE. Anaphylaxis: assessment and referral after emergency treatment. NG258, 2026 (sustituye a CG134). [nice.org.uk/guidance/ng258](https://www.nice.org.uk/guidance/ng258) | Guía; PDF oficial completo (19 pp.) | Descripción clínica (1.1.1); horas de observación según el riesgo (1.1.7–1.1.9); reacción bifásica hasta 72 h; tras usar el autoinyector, tumbarse (o sentarse si cuesta respirar) y «should not stand up or change position suddenly, even if they feel better» (1.1.14); dos autoinyectores y llevarlos siempre (1.1.15–1.1.16) |
| `Gülen 2023` | Gülen T. A puzzling mast cell trilogy: anaphylaxis, MCAS, and mastocytosis. *Diagnostics* 2023;13(21):3307. [doi:10.3390/diagnostics13213307](https://doi.org/10.3390/diagnostics13213307) (PMC10647312) | Revisión narrativa | Criterios NIAID/FAAN 2006 (tabla 2); en la mastocitosis, episodios con calor, palpitaciones, mareo e hipotensión que acaban en síncope, a menudo **sin urticaria**; desencadenantes (esfuerzo, frío, calor, venenos, alcohol, infecciones, AINE, estrés); signo de Darier al frotar la piel lesionada |
| `González-de-Olano 2017` | González-de-Olano D, Álvarez-Twose I. Insights in anaphylaxis and clonal mast cell disorders. *Front Immunol* 2017;8:792. [doi:10.3389/fimmu.2017.00792](https://doi.org/10.3389/fimmu.2017.00792) (PMC5502410) | Revisión de la Red Española de Mastocitosis (REMA) | Anafilaxia en el 22–49 % de los adultos con mastocitosis sistémica; el desencadenante más frecuente es la picadura de himenóptero y el ejercicio aparece en el **0 %** de su serie (fig. 1); mareo o síncope sin síntomas cutáneos |
| `Brockow 2021` | Brockow K, Plata-Nazar K, Lange M, et al. Mediator-related symptoms and anaphylaxis in children with mastocytosis. *Int J Mol Sci* 2021;22(5):2684. [doi:10.3390/ijms22052684](https://doi.org/10.3390/ijms22052684) (PMC7962052) | Revisión (población pediátrica) | «Heat, cold, vibration, stress, sun, physical effort» como cofactores; roce de la piel y agua fría como desencadenantes en las series (tabla 1); provocar el signo de Darier con suavidad; evitar los desencadenantes clásicos y los que ya provocaron una reacción en ese paciente, no una lista exhaustiva |
| `Bonadonna 2022` | Bonadonna P, Olivieri F, Jarkvist J, et al. Non-steroidal anti-inflammatory drug-induced anaphylaxis infrequent in 388 patients with mastocytosis: a two-center retrospective cohort study. *Front Allergy* 2022;3:1071807. [doi:10.3389/falgy.2022.1071807](https://doi.org/10.3389/falgy.2022.1071807) (PMC9760711) | Cohorte retrospectiva de dos centros | Hipersensibilidad a AINE en el 11,3 % y anafilaxia en el 2,8 %; con tolerancia previa conocida pueden seguir tomándolos; el paracetamol lo toleraron todos |
| `Pravettoni 2016` | Pravettoni V, Incorvaia C. Diagnosis of exercise-induced anaphylaxis: current insights. *J Asthma Allergy* 2016;9:191–198. [doi:10.2147/JAA.S109105](https://doi.org/10.2147/JAA.S109105) (PMC5089823) | Revisión narrativa | Anafilaxia inducida por ejercicio: empieza en los primeros 30 min, cofactores (comida, AINE, calor, frío, menstruación); colocar tumbado con las piernas elevadas para evitar el «empty-ventricle syndrome» |
| `Srisuwatchari 2023` | Srisuwatchari W, Kanchanaphoomi K, Nawiboonwong J, et al. Food-dependent exercise-induced anaphylaxis: a distinct form of food allergy. *Foods* 2023;12(20):3768. [doi:10.3390/foods12203768](https://doi.org/10.3390/foods12203768) (PMC10606284) | Revisión narrativa | Basta actividad cotidiana (caminar, subir escaleras); manejo (tabla 2): no comer el alimento 4–6 h antes ni 1–4 h después del ejercicio, **mantener el ejercicio regular**, hacerlo acompañado y llevar el autoinyector |
| `Muñoz 2024` | Muñoz M, Kiefer LA, Pereira MP, Bizjak M, Maurer M. New insights into chronic inducible urticaria. *Curr Allergy Asthma Rep* 2024;24(8):457–469. [doi:10.1007/s11882-024-01160-y](https://doi.org/10.1007/s11882-024-01160-y) (PMC11297124) | Revisión narrativa (GA²LEN/UCARE) | Estímulos físicos de la urticaria inducible (tabla 1): roce, presión mantenida (lesiones a las 4–6 h), frío (anafilaxia por frío en el 4–47 %; el agua es el desencadenante más común), calor, vibración, calentamiento corporal activo o pasivo. Trata la urticaria, no el SAMA |

### Salvedades de lectura

- **Leídas por subagentes**: las fuentes las leyeron enteras tres agentes de esta sesión, que devolvieron notas con su localizador y citas literales. Antes de implementar, **cada pasaje que se use en un texto de la app se vuelve a comprobar en la fuente** (como en los otros diseños). Las copias de trabajo están fuera del repositorio.
- **Valent 2019** se leyó como manuscrito aceptado, sin la fig. 2.
- **Las fuentes que defienden los criterios amplios**, Afrin 2017 y Yao 2025, tienen como autor a un firmante del consenso-2. Las del ECNM/AIM declaran honorarios de empresas de fármacos para la mastocitosis y royalties del análisis de la triptasa. Ninguno de los dos bandos está libre de conflictos.
- **Discrepancias internas** en las fuentes: Yao 2025 (37 % en el resumen, 41 casos en el texto), Kohno 2021 (11 o 12 pacientes con dos o más mediadores alterados), Kulin 2026 («3 studies» o «3/4»), Cardona 2020 (la fig. 1 pone «3 %» donde el texto dice 30 % para la caída de la TAS; el texto y la fig. 4 no coinciden en la posición). Ninguna cifra de estas se usaría en la app.
- **Los PDF del usuario** ya leídos para la hipermovilidad y el POTS (Malfait 2017, Hakim 2017, Raj 2020, Engelbert 2017) **no se han vuelto a mirar** buscando los mastocitos: no se pueden abrir desde la sesión. Si alguno dice algo del SAMA, se añade.

### No leídas enteras (no se citan)

| Fuente | Motivo |
|---|---|
| Valent P, et al. Definitions, criteria and global classification of mast cell disorders… *Int Arch Allergy Immunol* 2012;157:215–225 (PMC3224511) | PMC sin licencia abierta; solo la portada. Su contenido lo recogen Valent 2019 y 2020 |
| Afrin LB, et al. Diagnosis of mast cell activation syndrome: a global «consensus-2». *Diagnosis* 2021;8(2):137–152 | De pago. **Solo se conoce por la descripción de Lee y Picard 2025**: si se cita su postura, es a través de ellos |
| Valent P, et al. Global classification of mast cell activation disorders: an ICD-10-CM-adjusted proposal of the ECNM-AIM Consortium. *J Allergy Clin Immunol Pract* 2022;10(8):1941–1950 | De pago (su umbral urinario, solo a través de Lee y Picard). **Es la fuente central del paraguas MCAD** (la propuesta de clasificación ajustada a la CIE-10-MC). Hoy el paraguas se apoya en Valent 2022 (CIA), que la resume, y en Castells 2024. **Conviene pedirla en PDF** antes de implementar (decisión 9) |
| Gülen T, et al. *J Allergy Clin Immunol Pract* 2021;9(11):3918–3928 | De pago |
| Weiler CR, et al. AAAAI Mast Cell Disorders Committee Work Group Report. *J Allergy Clin Immunol* 2019 | Editor bloqueado desde la sesión |
| Kohn A, Chang C. *Clin Rev Allergy Immunol* 2020;58:273–297 | De pago. Por su resumen, es crítica con la asociación |
| Seneviratne SL, Maitland A, Afrin L. Mast cell disorders in Ehlers-Danlos syndrome. *Am J Med Genet C* 2017;175:226–236 | Wiley devuelve 403 desde la sesión. Es del mismo número que Malfait 2017: **conviene pedirla en PDF** (ver decisión 9) |
| Farley M, et al. *Ann Allergy Asthma Immunol* 2025;135:97–102 | De pago. Revisión sistemática que, por su resumen, no encuentra pruebas de la relación con criterios estrictos: **la fuente crítica más importante; conviene pedirla en PDF** |
| Valdez JA, et al. Lack of evidence for increased MCAS prevalence in POTS and/or hEDS. *J Allergy Clin Immunol Pract* 2026 | De pago, sin resumen disponible. Conviene pedirla en PDF |
| Shibao C, et al. *Hypertension* 2005;45:385–390; Wang E, et al. *Allergy Asthma Proc* 2021;42:243–246 | Sin texto abierto; solo se conocen por cómo las citan otras |
| Resuscitation Council UK. Emergency treatment of anaphylaxis, 2021 | La web no es accesible desde la sesión. NICE NG258 recoge sus horas de observación. **Conviene pedirla en PDF** (la guía de referencia en el Reino Unido para la primera respuesta) |
| Muraro A, et al. EAACI guidelines: anaphylaxis (2021 update). *Allergy* 2022;77:357–377 | Wiley y los repositorios devuelven 403. Conviene pedirla en PDF: es la guía europea |
| Golden DBK, et al. Anaphylaxis: a 2023 practice parameter update (AAAAI/ACAAI) | De pago |
| StatPearls (Anaphylaxis, NBK482124; mastocitosis) | NCBI Bookshelf pide reCAPTCHA desde la sesión |
| Valent P. *Clin Exp Allergy* 2014 (PMC4603355) | Manuscrito sin sus tablas |

## Contradicciones entre fuentes, y qué propongo elegir

1. **Qué es un SAMA.**
   - ECNM/AIM (Valent 2019, 2020, 2022; Lee y Picard 2025): episodios graves, recurrentes, en dos o más sistemas, con subida de la triptasa en el episodio y respuesta a los fármacos. Fatiga, cefalea, niebla mental o dolor articular no cuentan.
   - Criterios amplios (Afrin 2017; consenso-2 según Lee y Picard 2025; Hamilton 2018): síntomas crónicos o intermitentes, una lista larga, otros mediadores (cromogranina A, heparina) y la respuesta al tratamiento como apoyo.
   - Castells 2024 (taller del NIH) cuela niebla mental, cefalea y fatiga en su tabla I «adaptada de Valent», que los textos de Valent excluyen.
   - **La sigla**: «mast cell activation disorder» para el ECNM/AIM (Valent 2022; Castells 2024; Akin 2010, glosario) y «MC activation disease» para Afrin 2017, que lo usa como un espectro casi todo SAMA con sus criterios amplios.
   - **Propongo** seguir al ECNM/AIM, como hacen las sociedades de alergia (Lee y Picard 2025, respaldado por la AAAAI). La app no lo diagnostica ni lo puntúa, así que la elección solo afecta al texto: nunca dar a entender que una lista de síntomas crónicos «sugiere» un SAMA, y **no fiarse de la etiqueta «MCAD»**: preguntar el diagnóstico concreto y si ha tenido anafilaxia.
2. **Frecuencia en el POTS.** 9 % en una encuesta autodeclarada (Vernino 2021; Raj 2022), 36 % en un metaanálisis con datos autodeclarados (Kulin 2026), 42 % con mediadores fuera de brote (Kohno 2021), del 2 % al 87 % según el criterio (Yao 2025). **Propongo no dar ninguna cifra** en la app: depende del criterio, no del paciente.
3. **α-triptasemia hereditaria.** Lyons 2016 la asocia a hipermovilidad y disautonomía; Vazquez 2022, Huang 2024 y Lyons 2025 lo descartan. **Se sigue a las posteriores**, que incluyen al propio autor.
4. **El ejercicio como desencadenante en la mastocitosis.** Lo nombran Gülen 2023, Brockow 2021, Lee y Picard 2025 y la encuesta de Hamilton 2018 (63 %); en la serie de la REMA, ninguna anafilaxia fue por ejercicio (González-de-Olano 2017). No se contradicen del todo: las encuestas recogen síntomas por mediadores, la REMA solo anafilaxias. **Propongo** decir que el ejercicio puede desencadenar síntomas en algunas personas y que lo que cuenta es lo que ya le ha pasado a ese paciente (Brockow 2021), sin prohibir el ejercicio (Srisuwatchari 2023 pide mantenerlo en la anafilaxia por ejercicio).
5. **AINE.** Cardona 2020 y Gülen 2023 los listan como desencadenantes; Bonadonna 2022 encuentra pocas anafilaxias y dice que quien ya los toleraba puede seguir. **Propongo** preguntar si ya ha reaccionado a alguno, sin recomendar ni desaconsejar fármacos (son del médico).
6. **Posición en la anafilaxia.**
   - Texto de Cardona 2020: tumbado; sentado si le cuesta respirar; embarazada semirreclinada sobre el lado izquierdo; inconsciente en posición de recuperación; elevar las piernas es «controversial».
   - Fig. 4 de Cardona 2020, Pravettoni 2016, Gülen 2023, Brockow 2021 y Srisuwatchari 2023: elevar las piernas.
   - NICE NG258: tumbado, o sentado si le cuesta respirar; no ponerse de pie ni cambiar de postura de golpe.
   - **Propongo** lo que todas comparten: tumbado (sentado si le cuesta respirar, sobre el lado izquierdo si está embarazada) y **no levantarlo ni sentarlo de golpe**, sin afirmar nada sobre elevar las piernas.
7. **Horas de observación.** NICE NG258: 2, 6 o 12 h según el riesgo; Srisuwatchari 2023: 4–8 h; Cardona 2020: sin cifra. **No le toca al fisio**: la app solo diría que tras una anafilaxia tiene que verlo un médico aunque se encuentre bien (las fuentes coinciden en que hay reacciones bifásicas).
8. **Cuántos autoinyectores.** Dos (NICE NG258; Valent 2020), «one or more» (Cardona 2020). Lo indica el médico; la app solo pregunta si lo lleva.

## Criterio de entrada de la Fase P

El criterio es que la condición cambie la **seguridad** o la **interpretación** de la valoración.

1. **Cambia la seguridad: sí**, pero no por el SAMA en sí, sino por la anafilaxia.
   - En la mastocitosis la anafilaxia es mucho más frecuente (22–49 % de los adultos; Gülen 2023; González-de-Olano 2017) y a menudo se presenta como mareo, hipotensión o síncope **sin urticaria** (Gülen 2023; González-de-Olano 2017; Lee y Picard 2025). La piel falta también en el 10–20 % de todas las anafilaxias (Cardona 2020).
   - Un desmayo en la camilla de alguien con mastocitosis puede ser una anafilaxia y no un síncope vasovagal: cambia lo que se hace en ese momento.
   - La sesión pone desencadenantes conocidos: ejercicio, calor, frío, roce, presión mantenida, vibración y estrés (Cardona 2020, fig. 2; Brockow 2021; Gülen 2023; Muñoz 2024).
2. **Cambia la interpretación: poco.** Con criterios estrictos, el SAMA no explica el dolor musculoesquelético, la fatiga ni la intolerancia ortostática (Lee y Picard 2025, tabla 1; Valent 2020). Decir lo contrario sería apoyarse en los criterios amplios.

**Por variante del paraguas**:

| Diagnóstico del paciente | ¿Cambia la seguridad? |
|---|---|
| Mastocitosis (cutánea o sistémica) | Sí: anafilaxia en el 22–49 % de los adultos con mastocitosis sistémica, a menudo sin ronchas |
| SAMA, cualquier variante | Sí: por definición ha tenido episodios graves, «usually in form of anaphylaxis» (Valent 2022); riesgo de + a +++ según la variante (Castells 2024, tabla II) |
| Anafilaxia previa, sin trastorno mastocitario diagnosticado | Sí: puede repetirse (Cardona 2020; NICE NG258); la anafilaxia idiopática obliga a descartar un trastorno mastocitario (Cardona 2020) |
| MCAD «otro» | Probablemente sí (activación sistémica grave que no llega a los criterios), sin cifra en las fuentes leídas |
| MCAD «no especificado» o etiqueta sin más detalle | No está descrito: activación local, leve o crónica. Solo importan sus desencadenantes |
| α-triptasemia hereditaria sola | Riesgo «very low» sin alergia ni mastocitosis (Valent 2022, tabla 2, nota) |

**Entra, pero con una forma más pequeña que las otras condiciones** (ver «Formas posibles»), y con el nivel de alerta según el diagnóstico concreto y la anafilaxia previa, no según la etiqueta.

## Lo que importa al fisioterapeuta

### 1. La anafilaxia en la consulta, como urgencia

**Reconocerla** (Cardona 2020, tabla 2 y fig. 1; NICE NG258, 1.1.1):
- Empieza de forma brusca, en minutos o pocas horas.
- Piel o mucosas (ronchas por todo el cuerpo, picor o rojez, hinchazón de labios, lengua o úvula) **más** dificultad para respirar, tensión baja o sus consecuencias (desmayo, flojedad, incontinencia) o síntomas digestivos intensos.
- O, tras algo a lo que ya ha reaccionado, tensión baja, broncoespasmo o afectación de la laringe (estridor, cambio de voz) **aunque no haya ronchas**.
- En la mastocitosis, el cuadro típico es calor brusco, palpitaciones, mareo y caída de la tensión que acaba en desmayo, con poca o ninguna afectación de la piel (Gülen 2023).

**Qué hacer** (Cardona 2020, «Acute treatment» y fig. 4; NICE NG258, 1.1.14):
1. Parar la sesión y retirar el desencadenante si lo hay.
2. **Llamar al 112** a la vez.
3. **Adrenalina intramuscular en la cara anterolateral del muslo** cuanto antes: si el paciente lleva su autoinyector, que se lo ponga, o ayudarle (ver la salvedad de abajo). Si los síntomas siguen, se repite a los 5–15 min (Cardona 2020).
4. **Tumbado**; sentado si le cuesta respirar; sobre el lado izquierdo si está embarazada; en posición de recuperación si pierde el conocimiento. **No ponerlo de pie ni sentarlo de golpe, aunque se encuentre mejor** (NICE NG258, 1.1.14; Cardona 2020, fig. 4: «fatality can occur within seconds if patient stands or sits suddenly»).
5. Anotar la hora de inicio y de cada dosis (Cardona 2020, fig. 4; NICE NG258, 1.1.2).
6. Tras el episodio, **lo tiene que ver un médico aunque se haya recuperado**: puede repetirse en las horas siguientes sin nueva exposición (reacción bifásica, hasta 72 h; NICE NG258).

**Salvedad: quién pone la adrenalina.** Ninguna fuente leída dice qué puede hacer un fisioterapeuta con el autoinyector del paciente. Cardona 2020 y NICE NG258 hablan del paciente que se lo pone y de los «profesionales sanitarios» en general. Lo que diga la app sobre ayudarle a ponérselo es una **decisión del usuario** que depende de la normativa y del protocolo de su centro (decisión 6), no algo que las fuentes resuelvan.

### 2. Los desencadenantes que pone la sesión

| Desencadenante | Dónde aparece en la sesión | Fuente |
|---|---|---|
| Ejercicio y esfuerzo | Ejercicio terapéutico, pruebas de esfuerzo; en la anafilaxia por ejercicio, en los primeros 30 min | Cardona 2020 (fig. 2, cofactor); Lee y Picard 2025; Pravettoni 2016; Hamilton 2018 (encuesta) |
| Calor y calentamiento corporal | Termoterapia, infrarrojos, agua caliente, sala caliente, ejercicio intenso | Cardona 2020 (fig. 2); Lee y Picard 2025; Gülen 2023; Muñoz 2024 (urticaria colinérgica y por calor) |
| Frío | Crioterapia, hielo, agua fría (el agua es el desencadenante más común de la urticaria por frío) | Cardona 2020 (fig. 2); Gülen 2023; Brockow 2021; Muñoz 2024 |
| Roce y fricción de la piel | Masaje, fricción transversa, técnicas instrumentales sobre la piel | Brockow 2021 (tabla 1: «skin rubbing»; el signo de Darier, «gently»); Muñoz 2024 (dermografismo) |
| Presión mantenida | Vendajes, taping, apoyo prolongado en la camilla, ventosas; lesiones a las 4–6 h, cuando ya se ha ido | Muñoz 2024 (urticaria por presión retardada) |
| Vibración | Plataformas, pistolas y aparatos de vibración | Brockow 2021; Valent 2022 (urticaria vibratoria); Muñoz 2024 |
| Estrés emocional | La consulta misma, una técnica que da miedo | Cardona 2020 (fig. 3); Gülen 2023; Lee y Picard 2025 |
| AINE | Si los ha tomado en las 6 h previas a un episodio (preguntarlo) | Lee y Picard 2025; Bonadonna 2022 (riesgo bajo si ya los toleraba) |
| Alcohol, infección, privación de sueño, fase premenstrual | Cofactores: el mismo ejercicio puede dar la reacción un día y otro no | Cardona 2020 (fig. 3, tabla 5); Pravettoni 2016 |
| Látex, clorhexidina | Guantes, desinfectante | Cardona 2020 («Elicitors»; alergia IgE, no específica del SAMA) |

**Cómo usarlo** (Brockow 2021): no evitar una lista exhaustiva, sino los desencadenantes que ya le han dado una reacción a ese paciente. La app lo preguntaría así: «¿qué le ha provocado episodios?», y adaptaría la sesión a esa respuesta, sin prohibir el ejercicio (Srisuwatchari 2023: mantener el ejercicio regular, acompañado y con el autoinyector a mano).

## Relación con la hipermovilidad y el POTS

**Recomendación: ninguna regla automática**, como entre la hipermovilidad y el POTS (decisión 5 de `docs/pots.md`). Ni activar una tarjeta desde otra, ni darle peso, ni sugerir «piensa en un SAMA» al marcar la hipermovilidad o el POTS.

**Por qué**:
- **No está medida.** No hay ningún estudio con grupo control que use criterios de consenso (Yao 2025, Kohno 2021, Lyons 2016 y Kulin 2026 carecen de controles o los toman de la bibliografía). Monaco 2022, que defiende la relación, admite que no hay pruebas directas.
- **La cifra depende del criterio, no del paciente**: del 2 % al 87 % en la misma cohorte (Yao 2025).
- **El puente genético no se sostiene** (Vazquez 2022; Huang 2024; Lyons 2025).
- **Las sociedades de alergia lo dicen expresamente**: el POTS, la hipermovilidad y el SEDh están entre lo que «no sugiere» un SAMA, y la asociación «never been demonstrated» en pacientes que cumplan con claridad los criterios ECNM/AIM (Lee y Picard 2025). Valent 2019: hipermovilidad y disautonomía «not necessarily related». Castells 2024: la disautonomía puede imitar la activación mastocitaria, y la eficacia de los fármacos antimediadores en esos cuadros «has yet to be confirmed».
- **Etiquetar tiene un coste**: ansiedad, tratamientos innecesarios y diagnósticos retrasados (Valent 2018; Castells 2024; Monaco 2022, sobre las pruebas innecesarias).

**Lo que sí se propone, solo como texto** (forma 1, abajo): una línea en el razonamiento de la hipermovilidad y otra en el del POTS que diga que se ha descrito la asociación, que no está medida con criterios estrictos y que un SAMA de verdad se presenta como episodios bruscos y graves en varios sistemas, no como síntomas crónicos.

Si en el futuro un estudio controlado con criterios ECNM/AIM la mide (Farley 2025 y Valdez 2026, aún sin leer, apuntan a lo contrario), se revisa.

## Formas posibles, de menos a más

| # | Forma | Qué añade | A favor | En contra |
|---|---|---|---|---|
| 0 | Nada | — | Sin riesgo de sobrediagnóstico | Sigue el hueco de la anafilaxia en un paciente que ya tiene el diagnóstico |
| 1 | **Solo texto en los razonamientos** de hipermovilidad y POTS | Una línea en el «¿Por qué?» de `cq5` (hipermovilidad) y en `disautonomia.hipermovilidad` / el de `io1` (POTS) | Responde a lo que el clínico habrá oído; no cambia nada de la lógica ni del payload; corrige la idea de la «tríada» | No ayuda en la sesión al paciente que sí tiene mastocitosis |
| 2 | **Forma 1 + tarjeta reducida «Trastorno mastocitario o anafilaxia», solo «Diagnosticado»** | Fase 1: tarjeta con el diagnóstico concreto dentro del paraguas, si ha tenido anafilaxia, si lleva autoinyector y qué le desencadena los episodios. Fase 4b: una línea de técnica. Fase 5: recuadro con qué hacer ante una anafilaxia y los desencadenantes de ese paciente. Fase 6: aviso y red de seguridad. Fila en la guía de condiciones especiales | Cubre la seguridad donde el riesgo está medido (mastocitosis, anafilaxia previa); sin «Sospecha», la app no fabrica diagnósticos | Una tarjeta más en la fase 1 |
| 3 | Tarjeta completa con «Diagnosticado» y «Sospecha», como las demás | Lo de la 2 + un patrón de sospecha en la fase 2 que lleve a una derivación | Mismo patrón que las otras tres | El fisio no tiene ninguna prueba que hacer; los criterios piden la triptasa en el episodio; un patrón de síntomas sería justo el criterio amplio que las sociedades rechazan; riesgo de sobrediagnóstico documentado (Valent 2018) |
| 4 | Forma 2 + regla con la hipermovilidad y el POTS | Sugerir la tarjeta al marcar las otras | — | Sin base (ver «Relación»); va contra la decisión 5 de `docs/pots.md` |

**Recomiendo la forma 2.** Detalle abajo.

## Forma recomendada (forma 2), en borrador

Mismos principios que las otras condiciones: capa transversal, el árbol CIF y el motor de puntuación no se tocan, el fisio no diagnostica, la seguridad nunca se recorta, sin contenido clínico inventado (lo que no tiene fuente va marcado como redacción propia y es una decisión tuya).

### Fase 1 — tarjeta «Trastorno mastocitario o anafilaxia» (`#cardMastocitos`)

- Va después de «Lupus (LES)», antes de Cronología. No se pliega en modo breve.
- **Estados: No consta (por defecto) · Diagnosticado.** Sin «Sospecha» (decisión 2).
- Con «Diagnosticado», **qué le han diagnosticado** (decisión 3), una sola opción, de más a menos concreta:
  - Mastocitosis (cutánea o sistémica);
  - Síndrome de activación mastocitaria (SAMA), cualquier variante;
  - Otro trastorno mastocitario («MCAD» u otro nombre, sin más detalle);
  - Ninguno: solo ha tenido una anafilaxia (incluida la inducida por ejercicio);
  - No lo sabe.
- **¿Ha tenido alguna anafilaxia?** Sí · No · No lo sabe. Es la pregunta que pesa: con «Sí» el recuadro de la fase 5 sube el tono aunque el diagnóstico sea «otro» o «no lo sabe» (decisión 11). Con «Ninguno: solo anafilaxia» se marca sola.
- **¿Lleva el autoinyector de adrenalina?** Sí · No · No le han recetado.
- **¿Qué le ha provocado episodios?** Casillas: ejercicio · calor · frío · roce o presión en la piel · vibración · estrés · algún AINE · alimentos (con el ejercicio) · picaduras · otro (texto). Brockow 2021: lo que cuenta es lo que ya le ha pasado a ese paciente.
- La clase `body.mastocitos` muestra los elementos `.solo-ma`. Un cambio vacía la 4b, como las demás.
- **Nota fija de la tarjeta** (redacción propia, decisión 4): «Márcala si un médico le ha diagnosticado un trastorno mastocitario o si ha tenido una anafilaxia. Pregunta qué le dijeron exactamente: “MCAD” puede significar cosas distintas según quién lo diagnostique. Los síntomas crónicos (cansancio, dolor, niebla mental) no bastan para sospecharlo (Lee y Picard 2025, tabla 1).»
- **La α-triptasemia hereditaria sola** no tiene opción propia: sin alergia ni mastocitosis, el riesgo de anafilaxia es «very low» (Valent 2022, tabla 2, nota). Si además ha tenido anafilaxia, lo recoge esa pregunta (decisión 12).

### Fase 2 — sin sistema propio

- La tarjeta no añade preguntas de cribado: la anafilaxia es un suceso **de la sesión**, no una respuesta del cribado. Las preguntas de urgencia de la fase 2 tratan de lo que ya ha pasado.
- **Opcional (decisión 7)**: una pregunta con `derivacion`, no urgente, para quien tiene la tarjeta marcada y refiere episodios **nuevos** o más graves sin valorar: «¿Ha tenido desde su última revisión episodios bruscos con ronchas, hinchazón, falta de aire, mareo o desmayo?» → «Episodios nuevos sin valorar: que los valore su alergólogo». Fuente: Cardona 2020 (tras una anafilaxia, derivar al alergólogo; pasaje a comprobar), NICE NG258 (que lo vea un especialista tras el tratamiento urgente; pasaje a comprobar).

### Fases 3 y 4

Sin cambios. No hay ninguna fuente que diga que el SAMA cambia la irritabilidad o el árbol, y decirlo sería apoyarse en los criterios amplios.

### Fase 4b — una línea general, sin tocar las LR

Con la tarjeta activa, una línea encima de las hipótesis (como `.ds-nota-4b` y `.les-nota-4b`):

> «Trastorno mastocitario: el roce, la presión mantenida, el calor, el frío y la vibración pueden desencadenar síntomas; haz las maniobras con suavidad y evita lo que ya le ha provocado episodios (Brockow 2021; Muñoz 2024).»

### Fase 5 — recuadro «Trastorno mastocitario o anafilaxia» (`.ma-fase5`, nunca se pliega)

Al principio, junto a los recuadros de las otras condiciones. Cada línea, pegada a su fuente:
- Qué tiene, si lleva el autoinyector y sus desencadenantes.
- **Siempre (qué hacer)**: «Si en la sesión aparecen ronchas, hinchazón, falta de aire, mareo o un desmayo, para, llama al 112 y que se ponga su autoinyector en la cara externa del muslo. Tumbado (sentado si le cuesta respirar) y sin levantarlo de golpe aunque mejore. Puede faltar la piel (Cardona 2020; NICE NG258, 1.1.14).»
- **Siempre (después)**: «Tras una anafilaxia, aunque se recupere, lo tiene que ver un médico: puede repetirse en las horas siguientes (NICE NG258).»
- **Riesgo alto** (mastocitosis, SAMA o anafilaxia previa «Sí»; decisión 11): «Tiene más riesgo de anafilaxia que la población general. Que traiga su autoinyector a cada sesión (Castells 2024, tabla II; Cardona 2020, tabla 8).»
- **Con la mastocitosis**: «En la mastocitosis la anafilaxia suele empezar con calor, palpitaciones, mareo y desmayo, a menudo sin ronchas (Gülen 2023; González-de-Olano 2017).»
- **Con «otro trastorno» o «no lo sabe» y sin anafilaxia previa**: solo las líneas de siempre y sus desencadenantes, sin la de riesgo alto: el riesgo de esa etiqueta no está descrito (Valent 2022, tabla 1).
- **Sin autoinyector o «no le han recetado»**: «Que su médico valore si necesita un autoinyector (Valent 2020; NICE NG258, 1.1.15).» Redacción a revisar.
- **Con sus desencadenantes**: la lista que marcó, con «evita estos en la sesión».

### Fase 6 — plan de tratamiento

- **Aviso `mastocitos`** en todas las regiones:
  - que traiga el autoinyector a cada sesión (Cardona 2020, tabla 8; NICE NG258, 1.1.16);
  - empezar el ejercicio por debajo de lo que le ha dado síntomas y subir poco a poco; **mantener el ejercicio regular**, no evitarlo (Srisuwatchari 2023, para la anafilaxia por ejercicio; extenderlo a la mastocitosis es una inferencia que hay que marcar como tal);
  - si le ha dado episodios con el calor o el frío, sin termoterapia ni crioterapia y con la sala templada (Muñoz 2024; Brockow 2021);
  - sin comer el alimento implicado en las horas de antes y después del ejercicio, si se lo han dicho (Srisuwatchari 2023, tabla 2);
  - el programa para casa, acompañado y con el autoinyector a mano (Srisuwatchari 2023; Cardona 2020, tabla 8).
- **Red de seguridad** `RED_MASTOCITOS` (con cualquier plan y la tarjeta activa), para la sesión y el programa para casa: «Si le salen ronchas, se le hincha la boca, le falta el aire, se marea o se desmaya, pare, póngase el autoinyector y llame al 112; túmbese y no se levante de golpe (Cardona 2020; NICE NG258).»
- No cambian el nivel A/B/C, la frecuencia ni la irritabilidad.

### Salidas

- **Payload `ma`**, solo con la tarjeta activa (así la huella de los informes con IA anteriores no cambia): `{ es, ti, an, ai, de[] }` (estado, diagnóstico, anafilaxia previa, autoinyector, desencadenantes). physiq-report lo leería con una copia literal de `bloqueMAIA()`, como `_bloqueHM`, `_bloqueDs` y `_bloqueLES`, en otra PR.
- **📋 Notas**: «⚠️ MASTOCITOS: mastocitosis · anafilaxia previa · lleva autoinyector · desencadenantes: calor, roce».
- **📄 Informe**: en antecedentes, el diagnóstico tal como lo marcó el fisio («Mastocitosis (diagnosticada)», «Trastorno mastocitario (diagnosticado)») y «Anafilaxia previa» si la hubo, y los desencadenantes que se evitan en la sesión. Nunca convierte «otro trastorno» en «SAMA».
- **Informe con IA**: bloque «Trastorno mastocitario» en `contextoValoracion()`, sin citas, con «no relaciones sus síntomas crónicos con el trastorno mastocitario». `lib/reglas-informe.js` no se toca.
- **Modo breve**: el autoinyector sin responder es un pendiente.

### Guía de condiciones especiales

Una fila, después del lupus:
- **Nombre de la fila**: «Trastorno mastocitario o anafilaxia».
- **Qué es** (redacción propia): «Los mastocitos liberan sustancias que pueden dar reacciones alérgicas graves (anafilaxia), a veces sin causa clara. Incluye la mastocitosis y el síndrome de activación mastocitaria.»
- **Piensa en ella si**: «ya le han diagnosticado una mastocitosis o un trastorno o síndrome de activación mastocitaria»; «ha tenido una anafilaxia, también con el ejercicio». No hay pistas de sospecha, por coherencia con la decisión 2.
- **Añade**: qué hacer ante una anafilaxia, sus desencadenantes en la sesión y la red de seguridad del plan.
- **Fuentes**: Valent 2022 · Cardona 2020 · Lee y Picard 2025.

### Forma 1 — el texto de los razonamientos (en la forma 1 sola o con la 2)

Borrador, para el razonamiento de `cq5` (hipermovilidad) y para `disautonomia.hipermovilidad` (POTS):

> «Se ha descrito que algunas personas con hipermovilidad o POTS tienen también un síndrome de activación mastocitaria, pero la asociación no está medida: no hay estudios con grupo control que usen los criterios de consenso, y la cifra va del 2 % al 87 % en la misma cohorte según el criterio (Yao 2025; Lee y Picard 2025). Un síndrome de activación mastocitaria se presenta como episodios bruscos y graves en varios sistemas a la vez (ronchas, hinchazón, falta de aire, mareo o desmayo), no como cansancio o dolor crónicos (Valent 2019).»

Una frase para el `detalle`, si hay sitio: la α-triptasemia hereditaria no está aumentada ni en la hipermovilidad ni en el POTS (Vazquez 2022; Huang 2024; Lyons 2025).

## Fuera de este diseño (apuntado, no resuelto)

- **La anafilaxia en cualquier paciente.** La app no tiene hoy nada para una anafilaxia en la consulta de alguien sin la tarjeta (por ejemplo, la primera reacción al látex, o la primera anafilaxia por ejercicio). Como la pregunta de síncope de la decisión 9 de `docs/pots.md`, es un hueco previo que se apunta en vez de taparlo aquí. Podría ser una pregunta en el formulario previo («alergias graves, ¿lleva autoinyector?») o un texto de seguridad general. Trabajo aparte.
- **Las urticarias físicas** (frío, presión, vibración) sin trastorno mastocitario: Muñoz 2024 las describe, y la urticaria por frío puede dar anafilaxia en el agua. Quedan fuera salvo que el usuario quiera ampliar la tarjeta a «urticaria inducible».

## Decisiones (cada una con mi recomendación)

1. **¿Qué forma?** *Recomiendo la forma 2*: la forma 1 (texto) más la tarjeta reducida solo con «Diagnosticado». Si prefieres empezar por lo mínimo, la forma 1 sola es segura y no cierra la puerta a la 2.
2. **Sin «Sospecha».** *Recomiendo no tenerla*: el fisio no tiene ninguna prueba que hacer, los criterios exigen la triptasa en el episodio y un patrón de síntomas sería el criterio amplio que las sociedades de alergia rechazan (Lee y Picard 2025; Valent 2018). Es la primera condición sin «Sospecha»; la guía de condiciones especiales lo reflejaría.
3. **Qué incluye la tarjeta.** *Recomiendo* el paraguas entero en una sola tarjeta, con el diagnóstico concreto como opción (mastocitosis · SAMA · otro trastorno mastocitario · ninguno, solo anafilaxia · no lo sabe): lo que cambia la sesión es el riesgo de anafilaxia, y la tarjeta lo gradúa con el diagnóstico y la anafilaxia previa.
4. **La nota de la tarjeta** («márcala si…; pregunta qué le dijeron exactamente»). *Recomiendo sí*, para que no se marque por síntomas crónicos y para que la etiqueta «MCAD» no se tome por un SAMA. Es redacción propia con la fuente de la tabla 1 de Lee y Picard 2025.
5. **Ninguna regla con la hipermovilidad y el POTS.** *Recomiendo* ninguna, con solo el texto de la forma 1.
6. **Quién pone la adrenalina.** Ninguna fuente lo resuelve para el fisio. *Recomiendo* el texto «que se ponga su autoinyector» y que tú decidas si añadir «o ayúdale a ponérselo», según la normativa y el protocolo de tu centro.
7. **Pregunta de derivación por episodios nuevos (fase 2).** *Recomiendo sí*, como `derivacion` no urgente, después de comprobar en Cardona 2020 y NICE NG258 el pasaje exacto de la derivación al especialista.
8. **Desencadenantes como casillas, no como texto libre.** *Recomiendo casillas* (salen en el recuadro de la fase 5 y en el aviso de la fase 6) más un «otro» libre.
9. **Fuentes que conviene pedir en PDF** antes de implementar: **Valent 2022 (ECNM/AIM, propuesta ajustada a la CIE-10-MC)**, la fuente central del paraguas; Resuscitation Council UK 2021 (la primera respuesta en el Reino Unido), EAACI 2021 (la guía europea), Farley 2025 y Valdez 2026 (las críticas con la asociación) y Seneviratne 2017 (del mismo número que Malfait 2017). *Recomiendo* al menos RCUK 2021 y EAACI 2021, para que el «qué hacer» se apoye en guías y no solo en la WAO y en NICE.
10. **Registro de referencias.** *Recomiendo* registrar solo las que use el texto final. Con la forma 2: `Valent 2019`, `Valent 2020`, `Valent 2022`, `Castells 2024`, `Lee y Picard 2025`, `Yao 2025`, `Vazquez 2022`, `Huang 2024`, `Lyons 2025`, `Cardona 2020`, `NICE NG258`, `Gülen 2023`, `González-de-Olano 2017`, `Brockow 2021`, `Muñoz 2024`, `Srisuwatchari 2023`, y `Bonadonna 2022` si sale la línea de los AINE. Las demás quedan en este documento como lectura de contexto.

11. **Nivel de alerta por diagnóstico y anafilaxia previa.** *Recomiendo* que la línea de riesgo alto del recuadro de la fase 5 salga con mastocitosis, SAMA o anafilaxia previa «Sí», y no con «otro trastorno» o «no lo sabe» sin anafilaxia: el riesgo de esas etiquetas no está descrito (Valent 2022, tabla 1) y la sigla «MCAD» se usa con criterios distintos (Afrin 2017). El protocolo de qué hacer ante una anafilaxia sale siempre que la tarjeta esté marcada: es el mismo para todas las variantes (Valent 2022, fig. 3). *Alternativa más prudente*: la línea de riesgo alto con cualquier marca.
12. **α-triptasemia hereditaria.** *Recomiendo* no darle opción propia en la tarjeta: sola, el riesgo de anafilaxia es «very low» y no es un trastorno mastocitario (Valent 2022, tabla 2, nota). Con alergia, mastocitosis o anafilaxia previa, ya lo recogen esas respuestas.

## Cambios técnicos previstos (si se aprueba la forma 2)

```js
mastocitos: {
  estado: '',          // '' (no consta) | 'diagnosticado'
  tipo: '',            // '' | 'mastocitosis' | 'sama' | 'otro' | 'soloAnafilaxia' | 'ns'
  anafilaxia: '',      // '' | 'SI' | 'NO' | 'NS' — 'SI' fijo con tipo 'soloAnafilaxia'
  autoinyector: '',    // '' | 'SI' | 'NO' | 'sinReceta'
  desencadenantes: {}, // { ejercicio, calor, frio, roce, vibracion, estres, aine, alimentos, picaduras: true }
  otro: '',            // texto libre
}
```

- `lib/mastocitos.js`, puro: estado normalizado, nivel de alerta (`riesgoAltoMA()`: mastocitosis, SAMA o anafilaxia previa), payload `ma`, textos de 📋 Notas, 📄 Informe e IA (`bloqueMAIA()`), pendiente del modo breve. Con pruebas unitarias (`tests/unit/mastocitos.mjs`).
- Contenido en `data/comun.js` (textos de la tarjeta, recuadro, línea de la 4b) y en `data/plan-tratamiento.js` (aviso y `RED_MASTOCITOS`; luego `node tests/gen-frases-plan.mjs`).
- Fila en `data/condiciones.js`. La prueba que exige una fila por sistema `transversal_*` con `soloX` no la cubre (no hay sistema): añadir la fila a mano y una prueba propia.
- Las referencias en `data/referencias.js` y `node tests/gen-referencias.mjs`.
- `_softResetApp()`, restauración de sesión, exportar e importar, `deploy-to-hub.yml` para `lib/mastocitos.js`.
- Pruebas unitarias: nada sin la tarjeta; marcar la tarjeta no quita ni rebaja ninguna `urgencia` de ningún sistema; `ma` solo con la tarjeta; el texto de la forma 1 nunca va al payload ni a los resúmenes.
- Prueba de humo, sección `mastocitos`: la tarjeta, la línea de la 4b, el recuadro de la fase 5, el aviso y la red de la fase 6, 320 px y el hub.
- physiq-report: `_bloqueMA()` en otra PR, con un caso fijado en un test en cada repositorio.

## Siguiente paso

1. Tus decisiones (sobre todo la 1, la 2, la 6 y la 11).
2. Si eliges la forma 2: pedir en PDF las fuentes de la decisión 9 y volver a comprobar en la fuente cada pasaje que use el texto final.
3. Después, la implementación, en una PR con tu revisión antes de `main`.
