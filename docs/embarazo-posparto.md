# Embarazo y posparto — diseño (borrador)

Estado: **borrador de diseño (octubre 2026), sin código.** Decisiones 1–16 aceptadas por el usuario (2026-10). Tanda 1 de PDF leída (siete fuentes, sección E); sus cambios (T1–T12, «Cambios por la tanda 1 de PDF») están pendientes de ti. Sigue sin leer la guía del RCOG de la trombosis (ver «No leídas»). Es la siguiente condición especial de la Fase P (`MIGRATION_PLAN.md`, «Próximas condiciones especiales»), después de la osteoporosis (`docs/osteoporosis.md`), que dejó para esta tarjeta la sospecha de la osteoporosis del embarazo y la lactancia (decisión 12 y cambio H1 de aquel documento) y la osteoporosis transitoria de cadera (H5).

Reglas, como en las otras condiciones: solo fuentes leídas enteras; ninguna cifra, umbral ni referencia inventada; ninguna regla automática que no esté medida en las fuentes; lo que no tiene fuente va marcado como redacción propia y es una decisión tuya.

## Qué hay hoy en la app

Búsqueda de octubre 2026 en `data/`, `formularios/` y la guía de condiciones:

- **Embarazo ectópico**, tres preguntas urgentes:
  - `l_e8` (lumbar, `l_espondilo`) y `ca_u5` (cadera, `ca_urogenital`): «(Mujeres en edad fértil) ¿Tiene un dolor de pelvis, abdomen bajo o espalda [ingle, en cadera], nuevo o intenso, junto con un retraso de la regla, un sangrado vaginal inesperado, o mareo o desmayo?» (NICE NG126).
  - `h_g1` (hombro, `h_gine`): dolor de hombro súbito con dolor pélvico, sangrado o mareo intenso (signo de Kehr).
- **Dolor sacroilíaco (`lu8`)**:
  - su pronóstico ya habla del dolor de cintura pélvica del embarazo: «>54 % en el último trimestre, 25 % posparto… Recaída del 85 % en el siguiente embarazo… Cribar depresión posparto (×3)» (Lluch 2020, cap. 5.1, p. 322);
  - su pauta empieza por la manipulación con thrust de la sacroilíaca.
- **Cadera**:
  - la bandera de la fractura de estrés del sacro (`ca_oseo`) nombra «embarazo o posparto»;
  - el paso `ca_step6` tiene la opción «PÚBICO — Palpación dolorosa de la sínfisis»;
  - el texto del árbol de cadera nombra el embarazo como factor de la meralgia parestésica;
  - la congestión pélvica (`ca_u6`) aparece tras embarazos.
- **Formulario previo lumbar**: «¿Está embarazada, o ha dado a luz en el último año?» (`embarazo`), enlazado como pista al paso `lu_step4`.
- **Osteoporosis** (`docs/osteoporosis.md`):
  - la causa «Asociada al embarazo o la lactancia» existe en la tarjeta;
  - la sospecha de la PLO quedó para esta tarjeta (H1, con Hadji 2026);
  - mientras tanto, un párrafo en el «Ampliar» de `l_e4` y la pista de la guía de condiciones («está embarazada o dando el pecho y tiene un dolor de espalda nuevo, intenso y que no se pasa»).
- **Tobillo y pie**: las reglas de Ottawa no se aplican a embarazadas (texto de los tests y del árbol). No cambia nada.
- **Calculadora de cuestionarios**: tiene PHQ-2, PHQ-9 y GAD-7. Las preguntas de Whooley que pide NICE CG192 son los dos ítems del PHQ-2 en forma de sí o no. No tiene la EPDS.
- **Signos vitales de la fase 1**: FC, FR, SpO₂, TAS y TAD, opcionales, que hoy no lee ningún algoritmo.
- **Nada más**: ninguna tarjeta, ninguna bandera de preeclampsia, trombosis del embarazo o del posparto, sepsis puerperal, miocardiopatía periparto ni salud mental perinatal, ninguna línea de ejercicio y nada sobre la posición en la camilla.

## Fuentes leídas enteras (octubre 2026)

Cuatro lectores de esta sesión leyeron las fuentes y devolvieron notas con cita literal y localizador. Yo comprobé en el texto cada pasaje que usa este documento (búsqueda literal; NICE usa espacios y guiones no separables). Las copias de trabajo y las notas están en el scratchpad, fuera del repositorio.

### A. Banderas rojas

| Clave propuesta | Fuente | Qué aporta |
|---|---|---|
| `NICE NG133` | *Hypertension in pregnancy* (2019, actualizada 17-04-2023), recomendaciones enteras | Síntomas de preeclampsia → ver a un profesional «immediately» (1.1.1); definiciones de hipertensión (≥ 140/90) y grave («over 160 … over 110»); en el posparto, preguntar por cefalea intensa y dolor epigástrico (1.5.15); el mismo consejo de ejercicio que a las demás embarazadas (1.1.7) |
| `NICE NG201` | *Antenatal care* (2021), recomendaciones enteras | Primera hipertensión ≥ 140/90 desde 20+0 semanas → atención especializada en 24 h (1.2.26); ≥ 160/110 → el mismo día (1.2.27); menos movimientos fetales desde 24+0 → maternidad a cualquier hora (1.2.34); sangrado sin explicación desde la semana 13 → revisión hospitalaria (1.4.17); **dolor de cintura pélvica → considerar derivar a fisioterapia para consejo de ejercicio o cinturón lumbopélvico no rígido (1.4.15)**; no dormir boca arriba desde la semana 28 (1.3.25) |
| `NICE NG194` | *Postnatal care* (2021, actualizada 09-06-2026), recomendaciones enteras | La lista de síntomas posparto que piden consulta médica «without delay» (1.2.4: sangrado, infección, TEV, dolor torácico, cefalea, mastitis); dehiscencia perineal → maternidad el mismo día (1.2.20); «All healthcare professionals should ensure appropriate referral if there are concerns» (1.2.6); la fisioterapia como destino a las 6–8 semanas (1.2.7) |
| `NICE NG255` | *Suspected sepsis in pregnant or recently pregnant people* (2025), caps. 1.1–1.6 | Embarazo y hasta 6 semanas tras el parto, aborto o interrupción = grupo de alto riesgo (1.2.1); criterios de alto riesgo de la tabla 1 (FR ≥ 25, TAS ≤ 90, FC > 130, alteración mental nueva…) → urgencias, «usually 999 ambulance» (1.6.1); la FC basal del embarazo es 10–15 lpm mayor (1.4.4) |
| `NICE CG192` | *Antenatal and postnatal mental health* (2014, actualizada 2020), secs. 1.1–1.7 | Los profesionales con contacto regular en el embarazo y el primer año tras el parto deben considerar las dos preguntas de depresión y el GAD-2 (1.5.4, 1.5.8); positiva → EPDS o PHQ-9, o al médico de cabecera (1.5.5); GAD-2 ≥ 3 → GAD-7 o al médico de cabecera (1.5.6); psicosis posparto de inicio brusco → valoración inmediata, en 4 h (1.5.12); riesgo de autolesión → ayuda según el riesgo y avisar al médico de cabecera (1.6.5) |
| `Hameed 2023` | AIM Consensus Bundle on Cardiac Conditions in Obstetric Care, *Obstet Gynecol* 2023;141(2):253–263 (PMC9838734). Sin la figura 1, que es una imagen | Disnea, palpitaciones o dolor torácico en el embarazo o el posparto → valorar miocardiopatía periparto (elemento 2); signos de evento cardiaco inminente (box 3: disnea en reposo, ortopnea, FC en reposo ≥ 120, TAS ≥ 160, FR ≥ 30, SpO₂ ≤ 94 %); hasta 12 meses tras el parto |
| `Sambola 2024` | Consenso de la ESC sobre urgencias cardiacas en la mujer, *Eur Heart J Open* 2024;4(2):oeae011 (PMC11020263) | Miocardiopatía periparto hasta 6 meses tras el parto; ingreso urgente |
| `NICE NG158` (ya registrada) | Solo su ámbito | **No cubre a la embarazada.** El puerperio entra como TEV «provocada» |

### B. Ejercicio y actividad física

| Clave propuesta | Fuente | Qué aporta |
|---|---|---|
| `Bull 2020` | OMS 2020, *Br J Sports Med* 2020;54(24):1451–1462 (PMC7719906). Sin el documento completo ni los perfiles GRADE | Embarazo y posparto: al menos 150 min/semana de aeróbico moderado, aeróbico y fuerza variados (fuerte); quien ya hacía vigoroso puede seguir; limitar el sedentarismo. Notas de la tabla 4: suelo pélvico a diario, sin calor excesivo, sin contacto ni riesgo alto de caída, **sin actividades en supino «after the first trimester»**, signos de alarma nombrados pero no enumerados, vuelta gradual tras el parto (con un profesional si fue cesárea) |
| `Evenson 2024` | Revisión de alcance de 22 guías nacionales de posparto (incluida España), *J Sport Health Sci* 2024;13(4):472–483 (PMC11184298) | Lo que dice cada guía (no la guía leída): ≥ 150 min/semana, fuerza 2 días; plazos de 4–6 a 6–8 semanas, y 8–12 tras cesárea en Catar; España, suelo pélvico a diario; evidencia «sparse» |
| `Davenport 2025` | Delphi internacional de contraindicaciones posparto, *Br J Sports Med* 2025;59(8):527–538 (PMC12013588). Base de la guía canadiense de posparto de 2025 | Ya no se pide autorización médica rutinaria; la vuelta gradual puede empezar antes de 6 semanas; lista de contraindicaciones relativas durante el primer año (TVP, miocardiopatía, TA > 140/90, dolor torácico, mareo, sangrado, anemia, fiebre…) → al médico de atención primaria; **el dolor lumbar, el de cintura pélvica, la incontinencia, el prolapso leve o moderado y la diástasis no contraindican**; con dolor lumbopélvico, ejercicio individualizado y cribado de miedo-evitación; con incontinencia o prolapso, derivar a fisioterapia de suelo pélvico |

### C. Dolor lumbar y de cintura pélvica

| Clave propuesta | Fuente | Qué aporta |
|---|---|---|
| `Hall 2016` | Revisión sistemática con metaanálisis de terapias manuales en el dolor lumbar y pélvico del embarazo, *Medicine* 2016;95(38):e4723 (PMC5044890) | La terapia manual mejora el dolor frente a la atención habitual y la relajación, **pero no frente a la simulación**; «did not find sufficient evidence to recommend»; solo 3 estudios informaron de seguridad; nada sobre el thrust ni las posiciones |
| `Burani 2023` | Revisión sistemática de predictores del dolor de cintura pélvica persistente, *Medicina* 2023;59(12):2123 (PMC10744457) | Predictores de persistencia: dolor intenso, muchas pruebas de provocación positivas, dolor lumbopélvico previo, discapacidad alta, neuroticismo, miedo-evitación; la diástasis y el tipo de parto no se asocian |

### D. Suelo pélvico, cesárea y diástasis

| Clave propuesta | Fuente | Qué aporta |
|---|---|---|
| `NICE NG210` | *Pelvic floor dysfunction* (2021), recomendaciones enteras y la justificación de la prevención | Animar a todas a entrenar el suelo pélvico (1.3.9, 1.3.11); programa supervisado de 3 meses desde la semana 20 con un familiar de primer grado con disfunción, y en el posparto tras parto instrumental, occipitoposterior o lesión del esfínter anal (1.3.12); lo supervisa un fisioterapeuta o profesional con formación (1.3.15); tratar la incontinencia de esfuerzo o mixta, también en el embarazo, con al menos 3 meses (1.6.14) |
| `NICE NG123` | *Urinary incontinence and pelvic organ prolapse* (2019), solo 1.3.4, 1.3.17–1.4.10 y 1.7.2–1.7.6 | La dosis: al menos 8 contracciones 3 veces al día (1.4.5); comprobar la contracción por tacto (1.3.4); criterios de derivación a especialista (1.3.20) |
| `NICE NG192` | *Caesarean birth* (2021), recomendaciones y apéndice A | Conducir, cargar, ejercicio y relaciones sexuales «when they feel they have fully recovered» (1.7.8), sin plazos; signos de infección de la herida (1.7.4); síntomas respiratorios o pantorrilla hinchada y dolorosa por posible TEV (1.7.7) |
| `Beamish 2025` | Revisión sistemática con metaanálisis y GRADE del ejercicio posparto, *Br J Sports Med* 2025;59(8):562–575 (PMC12013572) | El suelo pélvico reduce la incontinencia urinaria un 37 % (certeza moderada); el ejercicio abdominal reduce la distancia entre rectos unos 0,5 cm (baja o moderada); el curl-up la reduce al instante y la contracción del transverso la aumenta; sin consenso sobre el corte |
| `Gluppe 2021` | Revisión sistemática del ejercicio en la diástasis posparto, *Braz J Phys Ther* 2021;25(6):664–675 (PMC8721086) | Certeza muy baja para recomendar programas concretos; no desaconsejar el suelo pélvico con diástasis; se resuelve sola hasta al menos 12 meses |
| `Sperstad 2016` | Cohorte de 300 primíparas, *Br J Sports Med* 2016;50(17):1092–1096 (PMC5013086) | Diástasis por palpación (≥ 2 dedos): 60 % a las 6 semanas y 32,6 % a los 12 meses; la leve no se asocia a dolor lumbopélvico |

**Leídas pero que no propongo citar**: Kaufmann 2022 (TC en adultos no obstétricos: solo confirma que no hay un corte de diástasis) y Selman 2022 (comentario clínico sobre la vuelta a correr: opinión de expertos con incoherencias internas entre el texto y las tablas).

### Salvedades de lectura

- **Las posiciones de tratamiento en la camilla** (prono, supino) no las trata ninguna fuente. El supino aparece solo para el ejercicio (OMS, Mottola 2018, ACOG 804) y para el sueño (NG201).
- **El thrust en el embarazo**: un solo ensayo piloto de 15 mujeres (Peterson 2012, citado en la Cochrane de 2015) y la opinión graduada C de Clinton 2017. Ver T7.
- **Los síntomas de la trombosis en la embarazada**: no están en ninguna fuente leída como criterio de derivación. NG158 la excluye y la guía del RCOG sigue sin leer. ACOG 804 solo pone el dolor o la hinchazón de pantorrilla entre los signos para parar el ejercicio. En el posparto sí están (NG194, NG192).
- **La Cochrane de Woodley 2020**: solo el resumen. No se cita.
- **Tanda 1 (sección E)**: en Simonds 2022 las tablas 11, 12 y 14 salieron desordenadas en la extracción; ninguna cita de este documento sale de ellas. Las LR que calcula Clinton 2017 (con SPSS, a partir de otros estudios) no se proponen para la puntuación.

### E. Tanda 1 de PDF (octubre 2026)

Siete PDF que pasó el usuario, leídos enteros: Mottola 2018 yo; los otros seis, cuatro lectores, con notas de cita literal y página. Yo comprobé en el texto cada pasaje que usa este documento.

| Clave propuesta | Fuente | Qué aporta |
|---|---|---|
| `Mottola 2018` | Guía canadiense 2019 de actividad física en el embarazo (SOGC/CSEP), *Br J Sports Med* 2018;52:1339–1346, doi:10.1136/bjsports-2018-100056, con GRADE | Todas sin contraindicación, activas (fuerte); ≥ 150 min/semana de intensidad moderada en ≥ 3 días (fuerte); aeróbico y fuerza (fuerte); suelo pélvico a diario, con instrucción de la técnica (débil). **Supino (rec. 6, débil, muy baja, sobre todo opinión de expertos): solo si se marea, tiene náuseas o se encuentra mal boca arriba, cambiar de posición.** Tabla 2: contraindicaciones absolutas (rotura de membranas, parto prematuro, sangrado vaginal persistente sin explicar, placenta previa > 28 semanas, preeclampsia, cuello incompetente, CIR, embarazo múltiple de alto orden, diabetes tipo 1, hipertensión o tiroides no controladas, otra enfermedad cardiovascular, respiratoria o sistémica grave) y relativas. Box 2, «Reasons to stop physical activity and consult a healthcare provider»: falta de aire excesiva y persistente que no cede en reposo, dolor torácico intenso, contracciones regulares y dolorosas, sangrado vaginal, pérdida persistente de líquido por la vagina, mareo o desvanecimiento persistente que no cede en reposo. Opinión de expertos: sin buceo, sin contacto ni riesgo de caída, sin bicicleta en movimiento, sin calor excesivo, intensidad alta solo supervisada, «talk test», evitar la apnea si la maniobra de Valsalva marea; **con diástasis, consejo de fisioterapia y evitar los abdominales tipo curl** |
| `ACOG 804` | ACOG Committee Opinion 804, *Obstet Gynecol* 2020;135(4):e178–e188 (sin grados: opinión de comité). **Sin lista de contraindicaciones** (comprobado en el PDF: solo dice que son pocas) | Supino: «Maintaining a supine position during exercise after 20 weeks of gestation may result in decreased venous return» (p. e179); «avoid long periods of lying flat on their backs» (p. e182). Box 3, signos para parar el ejercicio: sangrado vaginal, dolor abdominal, contracciones regulares y dolorosas, pérdida de líquido amniótico, disnea antes del esfuerzo, mareo, cefalea, dolor torácico, debilidad muscular que afecta al equilibrio, **dolor o hinchazón de pantorrilla**. Tabla 3: 30–60 min, 3–4 días o más, Borg 12–14. Dolor lumbar: ejercicio en el agua como alternativa (p. e183). Reposo en cama: no de rutina, riesgo de TEV (p. e183–e184). Posparto: vuelta gradual «as soon as medically safe», suelo pélvico desde el posparto inmediato, el curl y el «drawing-in» reducen la diástasis, dar el pecho antes |
| `Vleeming 2008` | Guía europea del dolor de cintura pélvica, *Eur Spine J* 2008;17:794–819 (búsqueda hasta 2004) | Prevalencia en el embarazo «close to 20%» (p. 800); el dolor «rapidly declines to 7% during the first 3 months» (p. 800); banderas rojas: «no difference between LBP and PGP» (p. 798). Tests recomendados (nivel D): P4, FABER, palpación del ligamento dorsal largo, Gaenslen, palpación de la sínfisis, Trendelenburg modificado y ASLR, sin clúster. Tratamiento: «We recommend individualized exercises in pregnancy» (C); en el posparto, estabilización individualizada dentro de un tratamiento multifactorial (C). **Manipulación (D, p. 810): «There is no evidence to recommend manipulation or mobilisation for PGP… may be used to test for symptomatic relief, but should only be applied for a few treatments».** Cinturón (D): para probar el alivio, por periodos cortos. No recomienda: reposo, masaje como único tratamiento, electroterapia, escuela de espalda |
| `Clinton 2017` | Guía APTA del dolor de cintura pélvica antes del parto, *J Womens Health Phys Ther* 2017;41(2):102–125, doi:10.1097/JWH.0000000000000081 (búsqueda hasta 2012; aquí «D» = evidencia contradictoria) | Terapia manual (C): «may or may not utilize manual therapy techniques including high-velocity, low-amplitude manipulations… little to no reported evidence of adverse effects in the healthy antepartum population» (p. 103). Cinturón y ejercicio: D (contradictoria). Banderas propias del dolor de cintura pélvica: desprendimiento de placenta, dolor referido de una infección urinaria (p. 111); «femoral neck stress fracture due to transient osteoporosis» |
| `Simonds 2022` | Guía APTA del dolor de cintura pélvica en el posparto, *J Womens Health Phys Ther* 2022;46(1):E1–E38, doi:10.1097/JWH.0000000000000236 (posparto = hasta 2 años) | **Gaenslen (P, buena práctica): «PTs should not perform Gaenslen's test in the first 4 weeks postpartum or beyond 4 weeks postpartum in the presence of PS pain»** (p. E6). **Fractura de estrés (A): derivar a imagen «within 2 weeks of delivery» con dolor intenso, apoyo imposible o reducido, cojera, dolor brusco en sacroilíaca, nalga, zona lumbar o sínfisis, o que alivia tumbada** (pp. E4–E5). Fiebre, sangrado intenso, abdomen hinchado como un globo o pérdida continua de heces u orina: «immediate physician referral» (p. E10). EPDS ≥ 10, derivar; ideas de suicidio (ítem 10) → «immediate referral to the emergency department». Cinturón (A) y terapia manual (A), nunca solos; el thrust (Al-Sayegh 2010: sin efectos adversos, un 19 % en el primer mes tras el parto) «not indicated in the presence of symmetrical joints» (tabla 9). Diástasis: cribarla en todas, sin relación demostrada con el dolor de cintura pélvica |
| `Liddle y Pennick 2015` | Cochrane, intervenciones para el dolor lumbar y pélvico del embarazo, CD001139.pub4 (búsqueda 19-01-2015, 34 ECA, 5121 mujeres; nada del posparto) | Ninguna conclusión con certeza alta. Ejercicio de 8–12 semanas: menos mujeres con dolor lumbar y pélvico (RR 0,66, moderada). Dolor pélvico solo: el ejercicio en grupo no mejora frente a la atención habitual (baja). Osteopatía: mejor que la atención habitual, «but not more than usual prenatal care plus placebo» (moderada). **El único ensayo con thrust (Peterson 2012, piloto, dolor lumbar): 15 mujeres con thrust en decúbito lateral, «Some post-treatment soreness… but no adverse effects occurred as a result of the interventions»** (baja). Efectos adversos «minor and transient» cuando se registraron |
| `Deering 2024` | Delphi internacional de vuelta a correr tras el parto, *Br J Sports Med* 2024;58:183–195, doi:10.1136/bjsports-2023-107490 (consenso ≥ 75 %) | Diseña el programa, no la aptitud (esa está en Christopher 2023, no leída). Dosificar importa más que las semanas (92,9 %); sin plazo mínimo. Con escapes, peso o presión vaginal, parar y caminar (86,9 %), aunque los autores dicen que no hay pruebas de que eso proteja. Fractura de estrés en deportistas que dan el pecho: «~3%… 43% of BSIs were sacral» (p. 186) |

### No leídas (no se citan)

Si quieres alguna, pásame el PDF y la leo entera antes de cerrar el diseño. Por orden de utilidad:

| # | Fuente | Enlace | Para qué |
|---|---|---|---|
| 3 | RCOG Green-top Guideline 37b (2015), tromboembolismo en el embarazo y el puerperio: manejo agudo | [rcog.org.uk](https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/thrombosis-and-embolism-during-pregnancy-and-the-puerperium-acute-management-green-top-guideline-no-37b/) | **Imprescindible**: síntomas de TVP y TEP en la embarazada y qué hacer ante la sospecha. Sin ella, la TVP del embarazo solo tiene el «dolor o hinchazón de pantorrilla» de ACOG 804 como signo para parar el ejercicio (T9) |
| 7 | Christopher 2023, Delphi de aptitud para volver a correr tras el parto, *Br J Sports Med* | [doi:10.1136/bjsports-2023-107489](https://doi.org/10.1136/bjsports-2023-107489) | Opcional: los criterios para empezar a correr (caminar 30 min sin síntomas, pruebas). Deering 2024 solo diseña el programa |
| 8 | Bauersachs 2019, posición de la ESC sobre la miocardiopatía periparto, *Eur J Heart Fail* | [doi:10.1002/ejhf.1493](https://doi.org/10.1002/ejhf.1493) | Opcional: Hameed 2023 y Sambola 2024 ya cubren lo que necesita el fisio |
| 9 | Woodley 2020, Cochrane del suelo pélvico en el embarazo y el posparto | [doi:10.1002/14651858.CD007471.pub4](https://doi.org/10.1002/14651858.CD007471.pub4) | Opcional: matiza a Beamish 2025 (contradicción 8) |

Leídas en la tanda 1 (sección E): 1 Mottola 2018, 2 ACOG 804, 4 Vleeming 2008, 5 Clinton 2017 y Simonds 2022, 6 Liddle y Pennick 2015, 7 Deering 2024.

**En acceso abierto y aún sin leer** (puedo leerlas sin PDF si te interesan):
- la guía práctica de la diástasis de sínfisis periparto, *J Clin Med* 2021 ([doi:10.3390/jcm10112443](https://doi.org/10.3390/jcm10112443));
- Bergström 2017, dolor de cintura pélvica 12 años tras el parto ([doi:10.1186/s12891-017-1760-5](https://doi.org/10.1186/s12891-017-1760-5));
- el consenso Asia-Pacífico de ejercicio en el embarazo y el posparto ([doi:10.1136/bmjsem-2020-000967](https://doi.org/10.1136/bmjsem-2020-000967)).

## Contradicciones entre fuentes, y qué propongo elegir

1. **El supino.**
   - La OMS: evitar las actividades en supino «after the first trimester» (notas de la tabla 4, sin grado propio).
   - NG201: no dormir boca arriba desde la semana 28 (1.3.25), por su relación con la muerte fetal.
   - Hablan de cosas distintas (ejercicio y sueño), y ninguna de las dos habla de la camilla.
   - *Propongo* el aviso de la OMS para el ejercicio y la fase 4b, marcado como extrapolación a la exploración (decisión 7). La guía canadiense podría afinarlo (PDF 1).
2. **La hipertensión grave**: «160/110 mmHg or higher» (NG201 1.2.27) frente a «over 160 … over 110» (NG133). *Propongo NG201*, que es la que lleva la acción (derivar el mismo día).
3. **Hasta cuándo es «posparto».**
   - Sepsis: 6 semanas (NG255).
   - Miocardiopatía periparto: 6 meses (Sambola 2024) o 12 meses (Hameed 2023).
   - Salud mental y contraindicaciones del ejercicio: el primer año (CG192 1.5.8; Davenport 2025).
   - *Propongo* que la tarjeta dure **12 meses tras el parto** y que cada pregunta lleve su plazo (decisión 3).
4. **Cuándo volver a la actividad tras el parto.**
   - OMS: «gradually», sin plazo.
   - NG192: tras la cesárea, cuando se sienta recuperada.
   - Las guías nacionales (Evenson 2024): de 4–6 a 6–8 semanas, y 8–12 tras la cesárea en Catar.
   - Davenport 2025: la vuelta gradual puede empezar antes de las 6 semanas, sin autorización médica rutinaria.
   - Los propios revisores dicen que es evidencia escasa. *Propongo* no dar plazos: vuelta gradual y guiada por síntomas, con la lista de contraindicaciones de Davenport.
5. **Contraindicaciones absolutas o relativas.** En el Delphi, los encuestados votaron como absolutas la pérdida de conciencia, los síntomas neurológicos, la sospecha de TVP y la enfermedad renal; los autores las pasaron a relativas. *Propongo* que la sospecha de TVP no sea una contraindicación sino una **urgencia** (NG194 1.2.4), y el resto, contraindicaciones relativas que piden consultar con su médico.
6. **El dolor de cintura pélvica como no contraindicación** no alcanzó consenso entre los encuestados (73,7 %); lo decidieron los autores. El dolor lumbar sí (86,1 %). *Propongo* citarlo así, con esa salvedad.
7. **La terapia manual.**
   - Hall 2016: mejora frente a no tratar, pero no frente a la simulación, y no la recomienda.
   - La Cochrane (solo el resumen) ve beneficio en estudios aislados.
   - Vleeming 2008 (no leída entera) no la recomienda (nivel D).
   - Las tres coinciden en que no hay base para que sea el tratamiento principal. *Propongo* ese texto, sin prohibirla (decisión 8).
8. **El suelo pélvico tras el parto.**
   - Beamish 2025: −37 % de incontinencia, certeza moderada.
   - La Cochrane de 2020 (solo el resumen): el enfoque poblacional «is not likely to reduce UI».
   - NICE: animar a todas y supervisar solo a las de riesgo (NG210 1.3.12).
   - *Propongo seguir a NICE*, que ya concilia ambas.
9. **La diástasis.**
   - No hay un corte de consenso: ≥ 2 dedos, > 2 cm, > 22 mm, o normal hasta 34 mm.
   - La creencia clínica «transverso sí, abdominales no» choca con los datos: el curl-up reduce la distancia al instante y el transverso la aumenta (Gluppe 2021; Beamish 2025).
   - *Propongo* no dar un corte ni prohibir ejercicios, y decir lo que dicen las fuentes (decisión 10).
10. **Persistencia del dolor de cintura pélvica a los 3 meses**: 7 % (Vleeming, no leída entera) frente a «about 1/3» (Burani 2023, introducción, citando otros estudios). Probablemente miden cosas distintas. *Propongo* no dar cifras de persistencia y quedarse con los predictores de Burani.
11. **El TEV tras la cesárea**: NG192 avisa de que el riesgo puede ser mayor (1.7.7), pero su apéndice A lo da como «likely to be similar». Para la app no cambia nada: los síntomas de TEV son urgencia con cualquier tipo de parto.
12. **La carga pesada con prolapso**: NG123 aconseja minimizarla (1.7.2) y la justificación de NG210 cita un estudio favorable a las pesas con suelo pélvico. *Propongo* no decir nada de la carga con prolapso y remitir a fisioterapia de suelo pélvico.
13. **Lactancia y ejercicio**:
    - algunas guías nacionales hablan del sabor de la leche por el ácido láctico (Evenson 2024, de segunda mano);
    - Davenport 2025 solo aconseja dar el pecho antes, por comodidad;
    - Australia gradúa «very low» que el ejercicio no afecte a la leche.
    - *Propongo* solo lo de Davenport.

## Criterio de entrada de la Fase P: sí entra

- **Cambia la seguridad**: hay banderas rojas propias (preeclampsia, TEV, sepsis puerperal, miocardiopatía periparto, psicosis posparto, sangrado), que hoy ninguna región pregunta salvo el embarazo ectópico.
- **Cambia la técnica y el ejercicio**: el supino, el calor, los deportes de contacto, el suelo pélvico y la vuelta a la actividad.
- **Cambia la interpretación**: el dolor de espalda intenso y persistente puede ser una osteoporosis del embarazo (H1), y la diástasis o la incontinencia no son contraindicaciones.
- **Es transversal**: lumbar, cadera (sínfisis, sacro, ingle), y cualquier región en una mujer embarazada o que ha dado a luz.
- **El fisio ve a la paciente de forma regular**, que es lo que CG192 1.5.8 pide para las preguntas de salud mental.

## Lo que importa al fisioterapeuta

### 1. Las banderas rojas

| Bandera | Cuándo | Acción y urgencia | Fuente |
|---|---|---|---|
| Cefalea intensa, problemas de visión, dolor intenso bajo las costillas, vómitos, hinchazón brusca de cara, manos o pies | Embarazo desde la semana 20; posparto | Ver a un profesional sanitario **inmediatamente** | NG133 1.1.1 y 1.5.15 |
| TA ≥ 140/90 por primera vez | Desde 20+0 semanas | Atención especializada **en 24 h** | NG201 1.2.26 |
| TA ≥ 160/110 | Desde 20+0 semanas | **El mismo día** | NG201 1.2.27 |
| Sangrado vaginal sin explicación | Desde la semana 13 | Revisión hospitalaria | NG201 1.4.17 |
| Dolor pélvico o abdominal con retraso de la regla, sangrado o mareo | Embarazo inicial | Urgente: ya lo cubren `l_e8`, `ca_u5`, `h_g1` | NICE NG126 |
| Nota menos movimientos del bebé | Desde 24+0 semanas | Maternidad **a cualquier hora** | NG201 1.2.34 |
| Sangrado brusco o muy abundante, o que aumenta, o con coágulos o restos | Posparto | Consulta médica **sin demora** | NG194 1.2.4 y 1.2.13 |
| Dolor abdominal, pélvico o perineal, fiebre, escalofríos o flujo maloliente | Posparto | **Sin demora**; con criterios de alto riesgo de sepsis, urgencias (112) | NG194 1.2.4; NG255 1.6.1 |
| Pierna hinchada y dolorosa, o falta de aire | Posparto (en el embarazo: pendiente del PDF 3) | **Sin demora** | NG194 1.2.4; NG192 1.7.7 |
| Dolor torácico; disnea, palpitaciones | Embarazo y posparto | Sin demora; con signos de evento inminente (disnea en reposo, ortopnea, FC ≥ 120, TAS ≥ 160, FR ≥ 30, SpO₂ ≤ 94 %), urgente | NG194 1.2.4; Hameed 2023, elemento 2 y box 3 |
| Herida perineal que se abre | Posparto | Maternidad **el mismo día** | NG194 1.2.20 |
| Herida de cesárea con más dolor, rojez, supuración o separación | Posparto | Revisión médica; con fiebre, la línea de la infección | NG192 1.7.4 |
| Inicio brusco de síntomas de psicosis | Posparto, sobre todo las 2 primeras semanas | Salud mental **en 4 h** | CG192 1.5.11–1.5.12 |
| Riesgo de autolesión o suicidio | Embarazo y primer año | Ayuda según el riesgo y avisar al médico de cabecera | CG192 1.6.5 |
| Dolor de espalda intenso y persistente | Embarazo o lactancia | Valoración especializada (posible osteoporosis del embarazo) | Hadji 2026, sección 5 (H1 de `docs/osteoporosis.md`) |

### 2. Lo que no es bandera roja, pero sí deriva

- **Ánimo y ansiedad.** Las dos preguntas de Whooley (los ítems del PHQ-2 como sí o no) y el GAD-2 (CG192 1.5.4 y 1.5.8). Con un sí, el PHQ-9 de la calculadora o el médico de cabecera (1.5.5); con GAD-2 ≥ 3, el GAD-7 o el médico de cabecera (1.5.6).
- **Síntomas de suelo pélvico** (incontinencia urinaria o anal, bulto vaginal, dolor). Fisioterapia de suelo pélvico: programa supervisado de al menos 3 meses (NG210 1.6.14; Davenport 2025). Hay criterios de derivación a especialista: incontinencia fecal asociada, sospecha neurológica, fístula… (NG123 1.3.20).
- **Riesgo de disfunción del suelo pélvico.** Con parto instrumental, occipitoposterior o lesión del esfínter anal, programa supervisado de 3 meses en el posparto. Embarazadas desde la semana 20 con un familiar de primer grado con disfunción, lo mismo (NG210 1.3.12).
- **Contraindicaciones relativas al ejercicio en el posparto** (Davenport 2025): consulta con su médico de atención primaria, y en la mayoría de los casos sigue la actividad, adaptada.

### 3. El ejercicio

- **Embarazo** (OMS 2020, fuerte):
  - al menos 150 min/semana de aeróbico moderado, aeróbico y fuerza variados;
  - quien ya hacía actividad vigorosa puede seguir;
  - limitar el sedentarismo;
  - suelo pélvico a diario;
  - sin calor excesivo con humedad, hidratada, sin contacto ni riesgo alto de caída ni altitud;
  - sin actividades en supino tras el primer trimestre;
  - más allá de la recomendación o en competición, con supervisión especializada.
  - Los signos de alarma para parar, pendientes del PDF 1.
- **Posparto**:
  - la misma dosis, con vuelta gradual (OMS 2020) y sin autorización médica rutinaria (Davenport 2025);
  - tras la cesárea, cuando se sienta recuperada (NG192 1.7.8);
  - con la lista de contraindicaciones relativas (Davenport 2025);
  - si da el pecho, mejor antes del ejercicio (Davenport 2025).
- **Dolor lumbar o de cintura pélvica**:
  - consejo de ejercicio o cinturón lumbopélvico no rígido (NG201 1.4.15);
  - en el posparto, ejercicio individualizado con enfoque biopsicosocial, y cribar el miedo-evitación (Davenport 2025; los predictores de persistencia de Burani 2023 incluyen el miedo-evitación);
  - la terapia manual no tiene base para ser el tratamiento principal (Hall 2016).
- **Diástasis**:
  - sin un corte de consenso;
  - la leve no se asocia a dolor lumbopélvico (Sperstad 2016);
  - el ejercicio abdominal la reduce poco (Beamish 2025);
  - no prohibir el curl-up ni el suelo pélvico (Gluppe 2021);
  - se resuelve sola en buena parte durante el primer año.

### 4. La técnica

- **El thrust**: ninguna fuente leída lo estudia en el embarazo (salvedad de lectura). La pauta de `lu8` empieza por él (decisión 8).
- **El supino**: la OMS lo desaconseja en el ejercicio tras el primer trimestre. Los tests de la 4b en supino son breves, pero ninguna fuente habla de ellos (decisión 7).

## Relaciones con lo que ya existe

- **Embarazo ectópico** (`l_e8`, `ca_u5`, `h_g1`):
  - siguen como están, en sus regiones y sin la tarjeta (las de lumbar y cadera son para «mujeres en edad fértil», y quien tiene un ectópico puede no saber aún que está embarazada);
  - *recomiendo* no repetirlas en el sistema nuevo y añadir solo una línea en su razonamiento: «con la tarjeta Embarazo marcada, piensa también en ella».
- **Osteoporosis del embarazo y la lactancia** (`docs/osteoporosis.md`, H1):
  - la pregunta de sospecha va en este sistema, como `derivacion`: «¿Tiene un dolor de espalda intenso y que no se le pasa, dorsal o lumbar, en el embarazo o desde el parto, o ha perdido 3 cm o más de altura?» (Hadji 2026, secciones 4.3 y 5);
  - con la tarjeta de osteoporosis marcada con la causa PLO, ya no sale (la sospecha está confirmada);
  - el párrafo de `l_e4` y la pista de la guía se quedan.
- **La osteoporosis transitoria de cadera** (H5):
  - Hadji 2026 la separa de la PLO y pide considerarla ante dolor de cadera con alteración de la marcha en el embarazo;
  - *recomiendo* una línea en el razonamiento de la pregunta de la PLO, sin pregunta propia: la única fuente leída que la trata es Hadji 2026, que no dice cómo derivarla.
- **La sacroilíaca (`lu8`)**: su pronóstico cita a Lluch 2020; *recomiendo* no tocarlo y añadir los predictores de Burani en el recuadro de la fase 5.
- **La fractura de estrés del sacro** (`ca_oseo`) y la **sínfisis** (`ca_step6`): no cambian.
- **Signos vitales de la fase 1**: con la tarjeta en «Embarazada» y 20 semanas o más, la TA registrada se lee con los umbrales de NG201 (decisión 5). La regla es automática y está medida en la fuente.
- **Calculadora**: el PHQ-2, el PHQ-9 y el GAD-7 ya están. *Recomiendo* el enlace «Calcular» desde las preguntas de ánimo, sin añadir la EPDS, que necesitaría su validación española leída (otra tarea).
- **Formulario previo lumbar**: su pregunta `embarazo` («Sí») pasa a ser también una pista sobre la tarjeta, sin marcarla.
- **Las otras tarjetas**:
  - lupus y embarazo (antifosfolípidos), hipermovilidad y disautonomía: ninguna fuente leída los relaciona;
  - *recomiendo ninguna regla automática*, como en las demás.
- **Sexo**: la tarjeta tiene sentido en mujeres. *Recomiendo* que se vea siempre (el sexo es opcional) y que, con «Hombre», salga plegada con una línea (decisión 2).

## Formas posibles, de menos a más

0. **Nada nuevo**: solo la guía de condiciones.
1. **Solo texto**: una fila en la guía de condiciones y un recuadro en la fase 5.
2. **Tarjeta sin sistema**: la tarjeta con «Embarazada» y «Posparto», el recuadro de la fase 5 y los avisos de la fase 6.
3. **Tarjeta y sistema** *(recomendada)*: lo anterior más un sistema en la fase 2 con sus banderas por estado y semanas, el bloque de suelo pélvico y ánimo, la regla de la TA y la línea de la 4b.
4. **Dos tarjetas** (embarazo y posparto separadas): repetiría casi todo.

## Forma recomendada (forma 3), en borrador

### Fase 1 — tarjeta «Embarazo o posparto» (`#cardEmbarazo`)

- Va después de «Osteoporosis o fragilidad ósea», antes de Cronología. No se pliega en modo breve.
- **Estados**: No consta (por defecto) · Embarazada · Posparto (hasta 12 meses). Un segundo toque desmarca.
- **Con «Embarazada»**:
  - **Semanas de gestación** (número). Decide qué preguntas salen (13, 20, 24, 28).
  - **Familiar de primer grado con problemas de suelo pélvico** (sí, no o no lo sabe): para el programa supervisado desde la semana 20 (NG210 1.3.12).
- **Con «Posparto»**:
  - **Fecha del parto**, o semanas aproximadas si no la sabe; las semanas se calculan, como en la tarjeta «Cirugía».
  - **Tipo de parto**: vaginal · vaginal instrumental (fórceps o ventosa) · cesárea · no lo sabe.
  - **Casillas en chips**: lesión del esfínter anal · bebé boca arriba en el expulsivo (occipitoposterior). Las dos, para NG210 1.3.12.
  - **Da el pecho**: sí o no (para la línea de Davenport).
- **Nota de la tarjeta** (redacción propia): «Márcala si está embarazada o ha dado a luz en el último año. Las preguntas de la fase 2 dependen de las semanas.»
- `body.embarazo`; un cambio vacía la 4b y repinta el cribado, como en las demás.

### Fase 2 — sistema «Embarazo y posparto» (`SIS_EMBARAZO`, `transversal_embarazo`, `soloEmbarazo: true`)

- Séptimo sistema de las 7 regiones, tras el de osteoporosis.
- Sin embudo en modo breve, y no cuenta como «sistema sin cribar».
- Ids con el prefijo `em_`.
- **Visibilidad por estado y semanas**, en un campo `em`: `'embarazo'`, `'posparto'`, `'ambos'`, más `desde`/`hasta` en semanas.

**A. Urgencias** (`urgencia`, `.sq2-urg`, nunca se pliegan):

| id | Pregunta (borrador) | Cuándo | `urgencia` (borrador) | Fuente |
|---|---|---|---|---|
| `em_u_preeclampsia` | ¿Tiene dolor de cabeza fuerte, ve borroso o destellos, dolor fuerte justo debajo de las costillas, vómitos, o se le han hinchado de golpe la cara, las manos o los pies? | Embarazo ≥ 20 semanas; posparto | Posibles síntomas de preeclampsia: que la vea un profesional sanitario ya, hoy. | NG133 1.1.1 y 1.5.15 |
| `em_u_sangrado` | ¿Ha tenido un sangrado vaginal que no le han explicado? | Embarazo ≥ 13 semanas | Sangrado vaginal sin explicación en el embarazo: valoración hospitalaria hoy. | NG201 1.4.17 (decisión 4: «hoy» es mío) |
| `em_u_movimientos` | ¿Nota que el bebé se mueve menos de lo habitual? | Embarazo ≥ 24 semanas | Menos movimientos fetales: que llame a su maternidad ahora, a cualquier hora. | NG201 1.2.34 |
| `em_u_sangrado_pp` | ¿Tiene un sangrado vaginal brusco o muy abundante, que va a más, o expulsa coágulos o restos? | Posparto | Posible hemorragia o restos tras el parto: consulta médica sin demora, hoy. | NG194 1.2.4 y 1.2.13 |
| `em_u_infeccion` | ¿Tiene fiebre o escalofríos, o dolor de vientre, pelvis o periné, o un flujo que huele mal? | Posparto | Posible infección tras el parto: consulta médica sin demora, hoy; si está muy mal, confusa, respira muy rápido o le falta el aire, urgencias (112). | NG194 1.2.4; NG255 1.2.1 y 1.6.1 |
| `em_u_tev` | ¿Tiene una pierna hinchada y dolorosa, o le falta el aire? | Posparto (embarazo: pendiente del PDF 3) | Posible trombosis o embolia: consulta médica sin demora, hoy; con falta de aire o dolor en el pecho, urgencias (112). | NG194 1.2.4; NG192 1.7.7 (el «112» es mío: decisión 4) |
| `em_u_corazon` | ¿Tiene dolor en el pecho, palpitaciones, o le falta el aire en reposo o al tumbarse? | Ambos | Posible problema cardiaco del embarazo o el posparto: valoración médica urgente hoy. | NG194 1.2.4; Hameed 2023, elemento 2 y box 3 |
| `em_u_perine` | ¿Se le ha abierto la herida del periné o la de la cesárea, o tiene más dolor, rojez o supuración en ella? | Posparto | Herida abierta o infectada: a su maternidad hoy. | NG194 1.2.20; NG192 1.7.4 |
| `em_u_psicosis` | (Se pregunta al acompañante si hace falta) ¿Ha notado cambios bruscos: confusión, ideas extrañas, euforia o mucha agitación desde el parto? | Posparto | Posible psicosis posparto: valoración por salud mental urgente (en 4 h). | CG192 1.5.11–1.5.12 |

**B. Derivaciones no urgentes** (`derivacion`):

| id | Pregunta (borrador) | Cuándo | `derivacion` (borrador) | Fuente |
|---|---|---|---|---|
| `em_d_plo` | ¿Tiene un dolor de espalda intenso y que no se le pasa, dorsal o lumbar, en el embarazo o desde el parto, o ha perdido 3 cm o más de altura? | Ambos (no con la tarjeta de osteoporosis en PLO) | Posible fractura vertebral por osteoporosis del embarazo o la lactancia: valoración médica especializada pronto. Hasta entonces, sin terapia manual ni carga en la espalda. | Hadji 2026, secciones 4.3 y 5; Scioscia 2023 (H1) |
| `em_d_mama` | ¿Tiene un pecho rojo e hinchado desde hace más de 24 horas, aunque se lo haya tratado? | Posparto | Posible mastitis: consulta médica. | NG194 1.2.4 |

**C. Ánimo** (un bloque como el cuestionario de la hipermovilidad; las respuestas van a `state.embarazo`, nunca a `sistemicoAnswers`):
- Las dos preguntas de depresión (CG192 1.5.4), con «Calcular PHQ-2 / PHQ-9 / GAD-7».
- Con un «sí»: «Valora el PHQ-9 o que lo vea su médico de cabecera (NICE CG192, 1.5.5).»
- Una pregunta de riesgo: «¿Ha pensado en hacerse daño?». Con un «sí», la línea de CG192 1.6.5: es una **urgencia** si hay plan, y la redacción es tuya (decisión 11).

**D. Suelo pélvico** (bloque, los dos estados):
- Tres preguntas, sin puntuar:
  - escapes de orina;
  - escapes de gases o heces;
  - bulto o peso en la vagina.
- **Resultado**:
  - con alguno: «Fisioterapia de suelo pélvico: programa supervisado de al menos 3 meses (NICE NG210, 1.6.14). Con escapes de heces, valoración médica también (NICE NG123, 1.3.20).»
  - sin síntomas, pero con factores de riesgo de la tarjeta: «Puede beneficiarse de un programa supervisado de 3 meses (NICE NG210, 1.3.12).»
  - siempre: «Suelo pélvico a diario (OMS 2020).»

**E. Regla de la tensión arterial** (decisión 5):
- Con la tarjeta en «Embarazada», 20 semanas o más, y TAS/TAD en los signos vitales de la fase 1:
  - ≥ 160/110 → **urgencia** «TA de 160/110 o más en el embarazo: valoración el mismo día (NICE NG201, 1.2.27).»;
  - ≥ 140/90 → **derivación** «Primera TA de 140/90 o más desde la semana 20: valoración especializada en 24 h, si no la tiene ya en seguimiento (NICE NG201, 1.2.26).»
- La primera va a `ur[]` y la segunda a `dv[]`, como la de los corticoides de la osteoporosis: salen de la tarjeta y de las constantes, no de una pregunta.

Cada pregunta lleva su `razonamiento` (Fase F) y cada bandera su enlace (Fase M).

### Fases 3 y 4

**Sin cambios.** Las fuentes leídas no dicen que el embarazo cambie la irritabilidad ni el árbol. La pista del formulario lumbar sigue en `lu_step4`.

### Fase 4b — línea del supino, sin tocar las LR (decisión 7)

- Con la tarjeta en «Embarazada» y más de 13 semanas, en los tests que se hacen en decúbito supino (un campo `supino: true`, con una lista fijada por una prueba unitaria): «Embarazada: evita mantenerla boca arriba mucho rato; si se marea, de lado (extrapolado de la OMS 2020, para el ejercicio).»
- *Alternativa*: una sola línea encima de las hipótesis, como el lupus.
- Sin línea del thrust: no hay fuente (decisión 8).

### Fase 5 — recuadro «Embarazo o posparto» (`.em-fase5`, nunca se pliega)

- **Qué tiene**: semanas, tipo de parto, factores de suelo pélvico, lactancia.
- **Embarazo**: la dosis de la OMS y sus precauciones; «Los signos para parar el ejercicio, con su matrona o su médico» hasta tener el PDF 1.
- **Posparto**: vuelta gradual, sin autorización rutinaria; las contraindicaciones relativas de Davenport, que piden consultar con su médico; tras cesárea, cuando se sienta recuperada; si da el pecho, antes del ejercicio.
- **Dolor lumbopélvico**: ejercicio o cinturón no rígido (NG201); en el posparto, ejercicio individualizado y cribar el miedo-evitación (Davenport 2025); los predictores de persistencia (Burani 2023); la terapia manual no tiene base para ser el tratamiento principal (Hall 2016).
- **No son contraindicaciones**: el dolor lumbar, el de cintura pélvica, la incontinencia, el prolapso leve o moderado y la diástasis (Davenport 2025).
- **Diástasis**, si hay posparto: las líneas de Sperstad, Beamish y Gluppe.
- **Suelo pélvico**: el resultado del bloque D.

### Fase 6 — plan de tratamiento

- **Aviso `embarazo`** en todas las regiones: la dosis y las precauciones del ejercicio, el supino, y la terapia manual como complemento.
- **Aviso `posparto`**: la vuelta gradual, las contraindicaciones relativas, el suelo pélvico y la lactancia.
- **Red de seguridad**, para el cierre y el programa para casa:
  - **`RED_EMBARAZO`**: «Si tienes un dolor de cabeza fuerte, ves borroso, te duele mucho bajo las costillas o se te hinchan de golpe la cara o las manos, llama a tu matrona o ve a urgencias hoy. Si notas que el bebé se mueve menos, llama a tu maternidad a cualquier hora.»
  - **`RED_POSPARTO`**: la lista de NG194 1.2.4 en lenguaje llano.
- **No cambian** el nivel A/B/C, la frecuencia ni la irritabilidad.
- Las urgencias de la fase 2 bloquean la fase 6 como siempre. Las derivaciones no.

### Salidas

- **Payload `em`**, solo con la tarjeta marcada:
  - con «Embarazada»: `{ es, sg, fp }` (estado, semanas, familiar con disfunción);
  - con «Posparto»: `{ es, ss, tp, oa, op, la }` (semanas desde el parto, tipo, esfínter anal, occipitoposterior, lactancia);
  - más `sp`, los síntomas de suelo pélvico.
  - Las urgencias van a `ur[]` y las derivaciones a `dv[]`. physiq-report lo leería con una copia de `bloqueEMIA()`, en otra PR.
- **📋 Notas**: «🤰 EMBARAZO: 32 semanas…» o «🤱 POSPARTO: 6 semanas · cesárea · da el pecho…».
- **📄 Informe**: «EMBARAZO» o «POSPARTO», con lo que tiene y las recomendaciones que lleve. Las respuestas de ánimo nunca van al informe (decisión 11).
- **Informe con IA**: bloque sin citas. Las respuestas de ánimo tampoco van al prompt, salvo la derivación si la hubo (decisión 11).
- **Modo breve**: las semanas sin registrar son un pendiente (deciden las preguntas). Las urgencias se ven siempre.

### Guía de condiciones especiales

- **Nombre**: «Embarazo o posparto».
- **Qué es** (redacción propia): «El embarazo y el primer año tras el parto cambian las banderas rojas, la posición y el ejercicio.»
- **Márcala si**: está embarazada; ha dado a luz en el último año.
- **Fuentes**: NICE NG201 · NICE NG194 · Bull 2020.

## Fuera de este diseño (apuntado, no resuelto)

- **La EPDS** en la calculadora: necesita su validación española leída.
- **La vuelta a correr y al impacto** con plazos y criterios: pendiente de Deering 2024 (PDF 7).
- **El aborto o la interrupción reciente**: NG255 los incluye en el grupo de riesgo de sepsis, pero la tarjeta no los pregunta. *Recomiendo* dejarlo fuera, salvo que lo quieras.
- **La región de muñeca y mano** (túnel carpiano y De Quervain del embarazo y el posparto): la app no tiene esa región.

## Cambios por la tanda 1 de PDF (T1–T12)

**Aceptadas por el usuario las 12 recomendaciones (2026-10).** Cambian el borrador de arriba; se aplican al reescribirlo tras la tanda 2.

- **T1. El supino de la 4b (cambia la decisión 7).** La guía canadiense, con GRADE, no pone semanas: solo cambiar de posición si se marea, tiene náuseas o se encuentra mal boca arriba (Mottola 2018, rec. 6, débil). ACOG 804 lo sitúa desde la semana 20 («may result in decreased venous return»). La OMS («after the first trimester») no da su base. *Recomiendo* la línea desde la semana 20 y sin prohibir: «Embarazada de 20 semanas o más: no la dejes mucho rato boca arriba y, si se marea, tiene náuseas o se encuentra mal, ponla de lado (Mottola 2018; ACOG 804).» Ni las fuentes de ejercicio ni las de fisioterapia hablan de la camilla: Clinton 2017 hace todos sus tests en supino sin avisar.
- **T2. Signos para parar el ejercicio en el embarazo**, en el recuadro de la fase 5, el aviso de la fase 6 y la red `RED_EMBARAZO`. Son la unión del box 2 de Mottola 2018 (parar y consultar) y el box 3 de ACOG 804 (parar). *Recomiendo* esta lista: sangrado vaginal; pérdida de líquido; contracciones regulares y dolorosas; dolor de vientre; dolor en el pecho; falta de aire que no cede en reposo; mareo que no cede; dolor de cabeza; debilidad que afecta al equilibrio; dolor o hinchazón de pantorrilla.
- **T3. Una urgencia nueva en el embarazo, `em_u_parto`**: «¿Tiene contracciones regulares y dolorosas, o le sale líquido por la vagina?» → «Posible parto prematuro o rotura de la bolsa: que llame a su maternidad ahora.» Mottola 2018 lo pone entre los motivos para parar y consultar «immediately» (box 1 y box 2). La redacción de la urgencia es mía. *Recomiendo* sí.
- **T4. Contraindicaciones del ejercicio en el embarazo** (Mottola 2018, tabla 2), solo como texto en la fase 5 y la 6, sin preguntas en la fase 2, porque son diagnósticos que ya tiene su equipo obstétrico:
  - con una absoluta, solo las actividades de la vida diaria;
  - con una relativa, que hable con su obstetra o matrona antes de un ejercicio moderado o intenso.
  *Recomiendo* esto.
- **T5. La dosis del embarazo pasa a la guía canadiense** (graduada), con la OMS como apoyo:
  - ≥ 150 min/semana de intensidad moderada, en ≥ 3 días;
  - aeróbico y fuerza;
  - «talk test»;
  - intensidad alta solo supervisada;
  - sin apnea si la maniobra de Valsalva le marea;
  - sin buceo, contacto, riesgo de caída ni bicicleta en movimiento.
  
  ACOG 804 (Borg 12–14) no aporta nada que cambie esto. *Recomiendo* esto.
- **T6. La diástasis en el embarazo.**
  - Mottola 2018 aconseja, por opinión de expertos, consejo de fisioterapia y evitar los abdominales tipo curl.
  - En el posparto, ACOG 804, Gluppe 2021 y Beamish 2025 dicen que el curl reduce la distancia entre rectos.
  - *Recomiendo* que la decisión 10 («sin ejercicios prohibidos») se quede para el posparto. En el embarazo, citar a Mottola tal cual, con «(opinión de expertos)».
- **T7. El texto del thrust (cambia la frase de la decisión 8; sigue sin tope automático).**
  - *Recomiendo*, en la fase 5 y la 6: «La terapia manual no tiene base para ser el tratamiento principal ni para usarse sola (Hall 2016; Simonds 2022): como mucho, para probar el alivio en pocas sesiones (Vleeming 2008, nivel D). Del thrust en el embarazo hay un solo ensayo piloto, con 15 mujeres en decúbito lateral y sin efectos adversos (Peterson 2012, en Liddle y Pennick 2015), y la guía de fisioterapia lo deja a criterio del clínico (Clinton 2017, grado C): no basta para decir que sea seguro.»
  - En el posparto, añadir: «el thrust no está indicado con articulaciones simétricas (Simonds 2022)».
- **T8. La sacroilíaca (`lu8`) con la tarjeta marcada.** Su pauta empieza por el thrust, y Vleeming 2008 no lo recomienda en el dolor de cintura pélvica. *Recomiendo* no tocar la pauta general de `lu8` y añadir, con la tarjeta marcada, una línea en su tarjeta de la fase 5 y un aviso en la fase 6:
  - en el embarazo, primero información («not dangerous… will probably improve») y ejercicio individualizado (Vleeming 2008, C);
  - en el posparto, estabilización individualizada (C);
  - el cinturón, para probar el alivio por periodos cortos (D; NG201 1.4.15);
  - el texto de T7.
- **T9. La TVP del embarazo** (pendiente del RCOG 37b).
  - Hasta tenerlo, *recomiendo* que `em_u_tev` siga solo en el posparto.
  - En el embarazo, el dolor o la hinchazón de pantorrilla entra solo en los signos para parar el ejercicio de T2 (ACOG 804).
  - *Alternativa*: activar `em_u_tev` también en el embarazo con ACOG 804, que no dice cuánta urgencia.
- **T10. Gaenslen en el posparto** (Simonds 2022, P, buena práctica). Con «Posparto» y menos de 4 semanas, una línea en el test Gaenslen de `lu8`: «Posparto de menos de 4 semanas: no hagas el Gaenslen; tampoco después si duele la sínfisis (Simonds 2022).» Con un campo `gaenslen: true` en ese test, fijado por una prueba. Es una regla de técnica; no toca las LR ni el clúster de Laslett. *Recomiendo* sí.
- **T11. Fractura de estrés en el posparto**, derivación nueva `em_d_fractura`, solo hasta 2 semanas tras el parto (Simonds 2022, A): «¿Desde el parto tiene un dolor intenso o brusco en la sacroilíaca, la nalga, la zona lumbar o el pubis, le cuesta apoyar o cojea, o se le alivia tumbada?» → «Posible fractura de estrés de la pelvis tras el parto: derivar para pruebas de imagen.» Además, en el razonamiento:
  - «femoral neck stress fracture due to transient osteoporosis» (Clinton 2017), que apoya la línea de H5;
  - el sacro en las deportistas que dan el pecho (Deering 2024).
  *Recomiendo* sí.
- **T12. Ánimo, fuentes y Deering.**
  - **Ideas de suicidio:** pasan a tener fuente. Simonds 2022 deriva a urgencias ante cualquier idea de suicidio. *Recomiendo* citarla en la urgencia de la decisión 11 en vez de mi redacción.
  - **EPDS:** sigue fuera hasta leer su validación española.
  - **Simonds 2022, «immediate physician referral»** (fiebre, sangrado intenso, abdomen hinchado como un globo, pérdida continua de heces u orina):
    - fiebre y sangrado ya están en `em_u_infeccion` y `em_u_sangrado_pp`;
    - *recomiendo* añadir a esta última el abdomen hinchado;
    - la pérdida **continua** de heces u orina pasa a urgencia, aparte de los escapes del bloque D.
  - **Correr:** sin plazos (decisión 13). *Recomiendo* una línea en el posparto: «La vuelta a correr se dosifica por síntomas, no por semanas; con escapes, peso o presión vaginal, parar y caminar (Deering 2024, consenso Delphi).»
- **Registro:** nuevas claves `Mottola 2018`, `ACOG 804`, `Vleeming 2008`, `Clinton 2017`, `Simonds 2022`, `Liddle y Pennick 2015` y `Deering 2024`. «Peterson 2012» se cita como secundaria («en Liddle y Pennick 2015»), sin entrada propia.

## Decisiones (cada una con mi recomendación)

**Aceptadas por el usuario las 16 recomendaciones (2026-10).** La 7, la 8, la 10, la 11 y la 13 pueden cambiar con T1, T6, T7, T9 y T12.

1. **¿Entra, con documento propio, y qué forma?** *Recomiendo* sí y la forma 3. *Alternativa*: la forma 2, sin sistema en la fase 2 (perdería las banderas, que son lo más importante).
2. **Una tarjeta con dos estados**, «Embarazada» y «Posparto». Con «Hombre» en el sexo, plegada con una línea. *Recomiendo* esto. *Alternativa*: ocultarla del todo con «Hombre».
3. **El posparto dura 12 meses** en la tarjeta, y cada pregunta lleva su plazo: sepsis 6 semanas (NG255), miocardiopatía hasta 12 meses (Hameed 2023), ánimo el primer año (CG192). *Recomiendo* esto.
4. **Las urgencias de la tabla A, con la redacción del borrador.** «Sin demora» (NG194) e «immediately» (NG133) los traduzco como «hoy», y añado el 112 solo con signos de gravedad. El 112 de la TVP con disnea o dolor torácico y el «hoy» del sangrado del embarazo son redacción mía. *Recomiendo* aceptarlos.
5. **La regla de la TA de la fase 1**, con los umbrales de NG201 (≥ 140/90 → 24 h; ≥ 160/110 → el mismo día), solo con «Embarazada» y 20 semanas o más. *Recomiendo* sí: es la única regla automática y está medida en la fuente. *Alternativa*: solo texto en el recuadro.
6. **La miocardiopatía periparto como urgencia** (`em_u_corazon`), con Hameed 2023 y Sambola 2024. *Recomiendo* sí, sin pedir Bauersachs 2019.
7. **La línea del supino en la 4b**: campo `supino` en los tests en decúbito supino, con más de 13 semanas, marcada como extrapolación de la OMS. *Recomiendo* esto. *Alternativa*: una línea general encima de las hipótesis.
8. **El thrust en el embarazo.** Ninguna fuente leída lo estudia. *Recomiendo* no poner tope automático, como sí hace la osteoporosis, y añadir una línea de texto en la fase 5 y en la 6: «La terapia manual no tiene base para ser el tratamiento principal (Hall 2016); sobre el thrust en el embarazo no hay datos de seguridad en las fuentes leídas.» *Alternativa*: tope «sin thrust» por prudencia, como redacción propia. Puede cambiar con Vleeming 2008 y Clinton 2017 (PDF 4 y 5).
9. **La osteoporosis del embarazo** (`em_d_plo`) aquí, como `derivacion`, y la transitoria de cadera solo en su razonamiento. *Recomiendo* esto (cumple H1 y H5).
10. **La diástasis**: sin corte ni ejercicios prohibidos, con las líneas de Sperstad, Beamish y Gluppe. *Recomiendo* esto.
11. **El ánimo.** Las dos preguntas de CG192 y el enlace al PHQ-9 y al GAD-7; la psicosis y el riesgo de autolesión, como urgencias. Las respuestas no van al 📄 Informe ni al prompt, solo la derivación si la hubo. *Recomiendo* esto. *Alternativa*: dejar el ánimo fuera y solo nombrarlo en la fase 5.
12. **El bloque de suelo pélvico** con las tres preguntas y los programas de NG210, sin dar la dosis (8 × 3 al día de NG123) en la app, porque eso lo decide el fisioterapeuta de suelo pélvico. *Recomiendo* esto.
13. **Ningún plazo para volver al ejercicio ni para correr** hasta tener Deering 2024. *Recomiendo* esto.
14. **Ninguna regla automática con las otras tarjetas.** *Recomiendo* esto.
15. **Los PDF.** *Recomiendo* al menos el 1 (Mottola 2018), el 3 (RCOG 37b) y el 4 (Vleeming 2008) antes de implementar. Opcionales: ACOG 804, Clinton 2017 y 2022, la Cochrane de 2015 y Deering 2024.
16. **Registro de referencias**: solo las que use el texto final. Nuevas: `NICE NG133`, `NICE NG201`, `NICE NG194`, `NICE NG255`, `NICE CG192`, `NICE NG210`, `NICE NG123`, `NICE NG192`, `Bull 2020`, `Evenson 2024`, `Davenport 2025`, `Hall 2016`, `Burani 2023`, `Beamish 2025`, `Gluppe 2021`, `Sperstad 2016`, `Hameed 2023` y `Sambola 2024`. Reusadas: `NICE NG126`, `NICE NG158`, `Hadji 2026` y `Scioscia 2023`.

## Siguiente paso

1. Tus decisiones (1–16).
2. Los PDF de la decisión 15, en tandas, y lo que cambien.
3. La implementación, en la rama de trabajo, y tu revisión en la app antes de `main`.
4. physiq-report: leer `em` del payload, en otra PR.
