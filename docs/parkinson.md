# Enfermedad de Parkinson — diseño

Estado: **borrador de diseño (noviembre 2026), sin código. Aceptadas por el usuario las 16 recomendaciones (noviembre 2026)** (ver «Decisiones»). **PDF del usuario leídos** (noviembre 2026; ver «Lectura de los PDF»): resuelven las decisiones 14 y 15. **Aceptadas también las decisiones 17–23** (noviembre 2026). **Texto cerrado aprobado por el usuario (noviembre 2026)**, con sus recomendaciones de redacción propia incluidas (ver «Texto cerrado para revisión»). **Implementado (noviembre 2026, rama `claude/parkinson-condicion`)**: ver «Implementación» al final. `_bloquePK` hecho en physiq-report (physiq-report#101). **Revisado por el usuario en la app (noviembre 2026).** Fuentes en abierto leídas en esta sesión: 8 (ver «Fuentes leídas»). Faltan PDF del usuario para cerrar dos puntos de seguridad (ver «Pendiente de leer»).

Es una posible condición especial de la Fase P (`MIGRATION_PLAN.md`). Va después de la hipermovilidad, el POTS, el lupus, el trastorno mastocitario, la osteoporosis, el embarazo y el paciente anticoagulado. Si se hace la tarjeta, la guía de condiciones especiales (`docs/condiciones-especiales.md`) tiene que añadir su fila. Lo exige un test unitario para todo sistema `transversal_*` con `soloX: true`.

**Qué hay hoy en la app**: nada. Ningún archivo de `data/`, `lib/` ni `formularios/` menciona el Parkinson, la estimulación cerebral profunda ni la diatermia (búsqueda de noviembre 2026). El temblor solo aparece como síntoma de otras causas: hipertiroidismo, hipoglucemia y efectos de fármacos.

## Resumen

- **Entra en la Fase P**: cambia la **seguridad** (crisis acinética, retirada de la medicación, estimulador cerebral profundo, hipotensión ortostática, caídas y fracturas) y la **interpretación** (rigidez, dolor y hombro congelado, fluctuaciones on/off que cambian lo que se mide).
- **Forma propuesta**, la de las otras condiciones: tarjeta en la fase 1 («Diagnosticado» y, en la decisión 2, «Sospecha»), sistema `SIS_PARKINSON` en la fase 2, una línea en la 4b, recuadro en la 5, avisos y red en la 6. **El árbol CIF y el motor de puntuación no se tocan.**
- **El fisio no diagnostica el Parkinson.** Con «Sospecha», el resultado es «derivar pronto y sin tratar a un especialista» (NICE NG71, 1.2.2), nunca «probable Parkinson».
- **Dos puntos de seguridad necesitan fuente antes de implementar**: la diatermia con estimulador cerebral profundo (aviso de la FDA de 2002 y etiquetado del fabricante, que no se han podido abrir desde este entorno) y la sesión en fase «on» (guía europea KNGF/ParkinsonNet, que no está en abierto).

## Fuentes leídas

### Enteras o en las partes que usa el diseño, en abierto (PMC o web)

| Clave propuesta | Referencia | Cómo se leyó | Qué aporta |
|---|---|---|---|
| `Osborne 2022` | Osborne JA, Botkin R, Colon-Semenza C, et al. Physical therapist management of Parkinson disease: a clinical practice guideline from the American Physical Therapy Association. *Phys Ther* 2022;102(4):pzab302. [doi:10.1093/ptj/pzab302](https://doi.org/10.1093/ptj/pzab302) | PMC9046970. Leídos: introducción, métodos, tabla 1, y de cada recomendación la propia recomendación, beneficios, riesgos, «intentional vagueness» y exclusiones; buenas prácticas (estimulación cerebral profunda, atención experta) y no-recomendaciones. Del resto de cada «Rationale», solo el aeróbico y la fuerza | **Única guía de fisioterapia graduada leída.** Ejercicio aeróbico (moderado a alto, ≥3 días/semana, 30–40 min), fuerza (1–2 días/semana, 80 % 1RM), equilibrio (2–3/semana, 16–30 h en 5–10 semanas), marcha (20–60 min, 3–5 días/semana, 4–12 semanas), estímulos externos. FC atenuada → usar también el esfuerzo percibido. Bicicleta antes que cinta con congelación de la marcha. Lo ganado se pierde si se deja. Estudios casi solo en Hoehn y Yahr 1–3. **Tiene versión en español** (suplemento 1) |
| `NICE NG71` | NICE. Parkinson's disease in adults. NICE guideline NG71, 2017. [nice.org.uk/guidance/ng71](https://www.nice.org.uk/guidance/ng71) | Capítulo «Recommendations», en la web | Sospechar ante temblor, rigidez, lentitud, problemas de equilibrio o de la marcha (1.2.1); **derivar pronto y sin tratar** al especialista (1.2.2); **no retirar la medicación de golpe** ni dejar que falle por mala absorción (gastroenteritis, cirugía abdominal), por riesgo de acinesia aguda o síndrome neuroléptico maligno (1.3.2–1.3.4); hipotensión ortostática: revisar fármacos (1.5.8); somnolencia diurna y ataques de sueño (1.5.1); fisioterapia específica con equilibrio o función motora alterados (1.7.2–1.7.3); logopedia con problemas para tragar (1.7.8); vitamina D (1.7.13) |
| `Simonet 2019` | Simonet C, Tolosa E, Camara A, Valldeoriola F. Emergencies and critical issues in Parkinson's disease. *Pract Neurol* 2020;20(1):15–25. [doi:10.1136/practneurol-2018-002075](https://doi.org/10.1136/practneurol-2018-002075) | PMC7029239, entero | Síndrome de parkinsonismo-hiperpirexia (incidencia 0,3 %, mortalidad 4 %) y sus desencadenantes (tabla 1: retirada o cambio de medicación, mala absorción, infección, traumatismo, deshidratación, calor); off graves con dolor, sudor y taquicardia; discinesias graves con caídas y fracturas; síndrome serotoninérgico; **hipotensión ortostática sintomática (~10 %)** con síncope, caídas y lesiones; ataques de sueño; disfagia y neumonía por aspiración; **caídas en el 50–60 %**, fracturas como complicación más frecuente; **estimulación cerebral profunda**: reaparición brusca del parkinsonismo, discinesias o conductas anómalas → contactar con el centro implantador; la interrupción de la estimulación puede dar un cuadro parecido a la hiperpirexia; riesgo de suicidio tras la cirugía, sobre todo el primer año |
| `Pötter-Nerger 2024` | Pötter-Nerger M, Schrader C, Jost WH, et al. The akinetic crisis in Parkinson's disease — the upper end of a spectrum of subacute akinetic states. *J Neural Transm* 2024;131(10):1199–1207. [doi:10.1007/s00702-024-02817-8](https://doi.org/10.1007/s00702-024-02817-8) | PMC11489269, entero | **Crisis acinética**: rigidez y acinesia que empeoran en 2–3 días y no responden a la levodopa, fiebre alta, alteración de la conciencia en la mitad, disfagia y síntomas autonómicos; mortalidad del 4–23 %. Desencadenante más frecuente: **infecciones** (respiratoria, urinaria); también cambio o retirada de la medicación, traumatismos, caídas y fracturas, cirugía, calor y deshidratación. Es el extremo grave de un espectro de empeoramientos subagudos, que son frecuentes |
| `Wang 2022` | Wang JY, Huang JF, Zhu SG, et al. Parkinsonism-hyperpyrexia syndrome and dyskinesia-hyperpyrexia syndrome in Parkinson's disease: two cases and literature review. *J Parkinsons Dis* 2022;12(6):1727–1735. [doi:10.3233/JPD-223362](https://doi.org/10.3233/JPD-223362) | PMC9535593, leído el resumen y la discusión | Confirma la retirada brusca de la medicación dopaminérgica como causa frecuente. No aporta nada que no esté en las dos anteriores; **no se propone registrar** |
| `LeWitt 2020` | LeWitt PA, Kymes S, Hauser RA. Parkinson disease and orthostatic hypotension in the elderly: recognition and management of risk factors for falls. *Aging Dis* 2020;11(3):679–691. [doi:10.14336/AD.2019.0805](https://doi.org/10.14336/AD.2019.0805) | PMC7220277, entero | Hipotensión ortostática en el 47–58 % de los pacientes con Parkinson; definición (≥20/10 mmHg en 3 min); **cómo medirla**: 5 min tumbado y de pie con medida al minuto 1 y al 3; en la neurogénica la FC casi no sube; diez preguntas de cribado (tabla 3); caídas al levantarse → sospechar hipotensión ortostática; **maniobras físicas** (cruzar las piernas tensando, inclinarse hacia delante, ponerse en cuclillas) (tabla 4); doble riesgo de caídas y fracturas |
| `Tan 2014` | Tan L, Wang Y, Zhou L, et al. Parkinson's disease and risk of fracture: a meta-analysis of prospective cohort studies. *PLoS One* 2014;9(4):e94379. [doi:10.1371/journal.pone.0094379](https://doi.org/10.1371/journal.pone.0094379) | PMC3979831, resumen y resultados | Riesgo de fractura HR 2,66 (IC 95 % 2,10–3,36), 6 cohortes, 69 387 participantes, calidad moderada |
| `Gadgaard 2024` | Gadgaard NR, Veres K, Henderson VW, et al. Frozen shoulder and the risk of Parkinson's disease: a Danish registry-based cohort study. *Clin Epidemiol* 2024;16:447–459. [doi:10.2147/CLEP.S463571](https://doi.org/10.2147/CLEP.S463571) | PMC11216321, resumen y discusión | Tras un hombro congelado, Parkinson en el 1,51 % a 22 años frente al 1,03 % de la población (HR 1,94 el primer año), **pero igual que tras un dolor lumbar** (HR 0,89–1,01). Riesgo absoluto bajo |
| `Paggou 2023` | Paggou D, Stefanis L, Chronopoulos E, et al. Shoulder dysfunction in Parkinson disease: review of clinical, imaging findings and contributing factors. *J Musculoskelet Neuronal Interact* 2023;23(2):263–280. | PMC10233223, resumen, tabla 1 y discusión | Dolor de hombro, hombro congelado y **asimetría del braceo** pueden preceder a los signos cardinales (Riley 1989: hombro congelado en el 12,7 % frente al 1,7 %, y primer síntoma en al menos el 8 %); se asocian a rigidez, temblor y bradicinesia del mismo lado; fracturas por caídas y osteoporosis |

### Salvedades de lectura

- **Osborne 2022**:
  - Solo ensayos aleatorizados de 1994 a junio de 2020.
  - Casi todos los estudios son en Hoehn y Yahr 1–3; la guía avisa de que no se generalizan a los estadios 4–5.
  - **No hace recomendación sobre la estimulación cerebral profunda** (no hay estudios; «best practice»: hace falta investigar) ni sobre los factores de riesgo.
  - Las dosis vienen de su apartado «Intentional Vagueness»: son lo que usaron «muchos estudios», no una dosis óptima establecida. Se dirán así.
- **Simonet 2019**: revisión narrativa de neurólogos, sin grados de evidencia. Los fármacos y dosis que da son del médico y **no van a la app**.
- **Pötter-Nerger 2024**: revisión narrativa. La crisis completa es rara (0,3 % al año); los empeoramientos subagudos sin fiebre son frecuentes. La app no puede distinguir uno de otro, y no hace falta: los dos se derivan.
- **LeWitt 2020**: revisión con financiación de la industria (droxidopa). Sus fármacos, la sal y los litros de agua son del médico y **no van a la app**. Solo se usan la definición, cómo medirla, las preguntas de cribado y las maniobras físicas, que son técnica del fisio.
- **Tan 2014**: solo 6 cohortes, de calidad moderada (sus propios autores).
- **Gadgaard 2024**: el riesgo de Parkinson tras un hombro congelado no es mayor que tras un dolor lumbar. **No se usa como regla** («hombro congelado → sospechar Parkinson»), solo como contexto (decisión 7).
- **Paggou 2023**: revisión narrativa con estudios pequeños, sobre todo de casos y controles.
- **NICE NG71**: buena parte de las recomendaciones citadas son de 2006 (marcadas [2006]).

### Pendiente de leer (no se citan hasta leerlas)

| Fuente | Por qué hace falta | Cómo conseguirla |
|---|---|---|
| **Guía europea de fisioterapia en la enfermedad de Parkinson** (Keus SHJ, Munneke M, Graziano M, et al. KNGF/ParkinsonNet, 2014) | La guía de fisioterapia de referencia en Europa. Seguramente da la evaluación por estadios, las fluctuaciones on/off y en qué fase citar la sesión, las estrategias de movimiento y los estímulos | PDF del usuario (se descarga de parkinsonnet.com; no está en PMC) |
| **Aviso de la FDA sobre la diatermia y los electrodos implantados** (Public Health Notification, 19 dic 2002) o **el etiquetado del estimulador** (Medtronic, Abbott, Boston Scientific) | Base de la línea más seria de la tarjeta: **no aplicar diatermia** (onda corta, microondas; también ultrasonido terapéutico según el fabricante) **con un estimulador cerebral profundo implantado, aunque esté apagado o retirado si quedan los electrodos**. La búsqueda web lo describe (lesiones cerebrales graves y muertes), pero los dominios (webharvest.gov, health.ucdavis.edu, recalls-rappels.canada.ca) **no son accesibles desde este entorno**. Sin leerlo, la línea no se escribe | PDF del usuario, o abrir el entorno a esos dominios |
| Torsney KM, et al. Bone health in Parkinson's disease: a systematic review and meta-analysis. *J Neurol Neurosurg Psychiatry* 2014;85(10):1159–1166 | Osteoporosis (OR 2,61) además de fractura | Repositorio de UCL (en abierto) o PDF del usuario |
| ~~Una revisión del dolor en el Parkinson~~ | **Leída**: Buhmann 2020 (ver «Dolor: Buhmann 2020») | — |
| Ernst M, et al. Physical exercise for people with Parkinson's disease: a systematic review and network meta-analysis. *Cochrane Database Syst Rev* 2024;4:CD013856.pub3. [doi:10.1002/14651858.CD013856.pub3](https://doi.org/10.1002/14651858.CD013856.pub3) | Metaanálisis en red más reciente sobre tipos de ejercicio. Si se escribe un bloque en la guía «Efectos del ejercicio» | **En abierto en PMC (PMC11001292)**: no hace falta PDF; se lee al escribir el bloque (decisión 13) |
| Validación española de un cuestionario específico (PDQ-39 o PDQ-8) | Regla del proyecto: solo cuestionarios validados en español de España (`docs/cuestionarios.md`) | Comprobar antes de añadir nada a la calculadora (decisión 12) |

**Las búsquedas de esta sesión**: la búsqueda de PubMed (E-utilities) y la de Europe PMC devolvían errores 500/503 (noviembre 2026). Los textos completos se leyeron por identificador desde PMC (servicio BioC) y las fuentes se localizaron con búsqueda web. Conviene repetir una búsqueda sistemática en PubMed cuando vuelva, sobre todo para la diatermia (casos publicados, p. ej. Nutt 2001 en *Neurology*) y la fisioterapia con estimulador cerebral profundo.

## Lectura de los PDF (noviembre 2026)

El usuario subió cinco documentos: el aviso de la FDA (PDF), el aviso de Salud Canadá (página guardada), la guía europea KNGF/ParkinsonNet (dos PDF), Torsney 2014 y la Cochrane de 2024 (cuatro PDF).

### Qué se leyó

| Clave propuesta | Referencia | Qué se leyó | Qué aporta |
|---|---|---|---|
| `FDA 2002 (diatermia)` | FDA Public Health Notification: Diathermy interactions with implanted leads and implanted systems with leads. 19 dic 2002 | Entero (3 pp.) | Dos muertes de pacientes con **estimulador cerebral profundo** tras diatermia (una tras cirugía oral, otra para una escoliosis), por lesión cerebral donde estaban los electrodos. **Onda corta y microondas, en modo térmico y atérmico, no deben usarse con ningún electrodo metálico implantado**, aunque el aparato esté apagado y aunque el electrodo ya no esté conectado; tampoco si tuvo un implante, salvo certeza absoluta de que se retiraron el implante y todos los electrodos («a menudo se dejan»). No se sabe si hay una distancia segura. **Con el ultrasonido «no se espera esta interacción».** Preguntar siempre por implantes antes de aplicarla. Otros implantes con electrodos: marcapasos y desfibriladores, implantes cocleares, estimuladores del crecimiento óseo, estimuladores medulares y de otros nervios |
| `Health Canada 2003 (diatermia)` | Health Canada. Important safety information regarding diathermy therapy in patients with implanted leads and implanted systems with leads. Notice to Hospitals, 2 abr 2003 (RA-17000480) | Entero | Lo mismo que la FDA (onda corta y microondas contraindicadas con cualquier electrodo, aunque esté apagado o desconectado, o quede solo un trozo de electrodo) y **añade: ultrasonido terapéutico contraindicado encima o cerca del implante o de sus electrodos**. La dirige expresamente a fisioterapia. Cita a Nutt 2001 (*Neurology* 56:1384–1386) como caso original |
| `Keus 2014` | Keus SHJ, Munneke M, Graziano M, et al. European Physiotherapy Guideline for Parkinson's disease. KNGF/ParkinsonNet, 2014 | Parte 1 (pp. 1–100): índice, cap. 1.2 (límites, comorbilidad, exclusiones), 3.2–3.4 (medicación, fluctuaciones, neurocirugía), 5.11 (riesgo de caída), **5.13 (banderas rojas y naranjas)**, 6.4.6–6.4.9 (vibración, masaje, dolor, respiratorio), **6.7.2–6.7.5** (fluctuaciones, dolor y fatiga, cuándo parar), 6.8.3 (estadio final) y el inicio del cap. 7. **No leídos**: caps. 2, 4, 5.1–5.10 y 5.12, 6.1–6.4.5 y 6.5–6.6 (intervenciones de ejercicio y estrategias de movimiento), la tabla 7 completa y la parte 2 (apéndices, entre ellos el 12 de efectos adversos de la medicación) | Ver «Qué aporta la guía europea» |
| `Torsney 2014` | Torsney KM, Noyce AJ, Doherty KM, et al. Bone health in Parkinson's disease: a systematic review and meta-analysis. *J Neurol Neurosurg Psychiatry* 2014;85(10):1159–1166. [doi:10.1136/jnnp-2013-307307](https://doi.org/10.1136/jnnp-2013-307307) | Entero (8 pp.) | 23 estudios. **Osteoporosis OR 2,61** (1,69–4,03) y **fractura OR 2,28** (1,83–2,83) frente a controles; más en mujeres. Densidad mineral menor en cadera, columna lumbar y cuello femoral. **La cadera es el 50 % de las fracturas** (caídas de lado o hacia atrás con la marcha arrastrando los pies). **Las fracturas vertebrales pueden pasar desapercibidas** porque la postura encorvada se da por esperada |
| `Ernst 2024` | Ernst M, Folkerts AK, Gollan R, et al. Physical exercise for people with Parkinson's disease: a systematic review and network meta-analysis. *Cochrane Database Syst Rev* 2024;4:CD013856. [doi:10.1002/14651858.CD013856.pub3](https://doi.org/10.1002/14651858.CD013856.pub3) | Solo el resumen (pp. 1–3 de la parte 1). **El resto se lee entero al escribir el bloque de la guía de ejercicio** (decisión 13) | 154 ensayos, 7837 participantes, casi todos con enfermedad leve a moderada y sin deterioro cognitivo importante. **Casi todos los tipos de ejercicio son mejores que no hacer nada, con poca diferencia entre ellos**: «el tipo exacto podría ser secundario». La danza y el entrenamiento de marcha, equilibrio y función, con efecto moderado en los signos motores (confianza moderada). Seguridad muy incierta: lo más notificado, **caídas** (18 estudios) y dolor (10) |


### Qué aporta la guía europea (Keus 2014)

1. **Banderas rojas (5.13)**: impedimentos que exigen aconsejar consulta médica.
   - **Estimulador cerebral profundo**: no usar nada con un componente eléctrico, porque puede afectar a la batería si está lo bastante cerca del tórax: **onda corta, microondas, ultrasonido y electroestimulación, como la TENS o las interferenciales**. Y **«ninguna presión manual cerca de los cables»**. Cita su ref. 462 (no leída).
   - **Complicaciones motoras complejas**: on-off impredecibles, discinesias graves y distonía en off (calambres o espasmos dolorosos).
   - **Alteraciones mentales graves**: ilusiones, alucinaciones y trastornos del control de impulsos (tomar medicación de más sin receta, actividades repetitivas, juego, comida o sexo compulsivos).
   - Dolor torácico, arritmias o cambios irregulares de la tensión durante el ejercicio; diabetes tipo 2 mal controlada; enfermedad sistémica aguda; cardiopatías graves (lista larga, de las guías de entrenamiento).
2. **Banderas naranjas (5.13)**: influyen en la evaluación o la elección de la intervención.
   - Parkinsonismos atípicos; deterioro cognitivo, psicosis, depresión o demencia; inactividad previa (empezar bajo y subir poco a poco); fatiga intensa (repartir los ejercicios, más descansos); miedo a caer o a moverse; alteraciones visuales; dolor y fatiga.
   - **Con congelación de la marcha y rigidez axial intensa, la hidroterapia siempre supervisada de forma individual.**
   - Betabloqueantes (la FC no sirve para la intensidad), diabetes con insulina (hipoglucemia hasta 72 h después del ejercicio intenso), saturación ≥ 90 % en la neumopatía.
   - **Errata de la guía**: pone «Hypotension: a resting systolic blood pressure ≥200 mmHg or diastolic ≥115 mmHg», que es hipertensión. **No se usa.**
3. **Fluctuaciones (6.7.2)**: en off responde peor, por la medicación, no por la cognición. **La capacidad física se entrena mejor en on.** Las estrategias se enseñan primero en on, pero si se necesitan en off hay que acabar practicándolas en off. Si el fisio ve fluctuaciones o mala adherencia a la medicación, aconseja hablarlo con el neurólogo.
4. **Medicación (3.2)**: la adherencia suele ser baja (muchas tomas, deterioro cognitivo, dificultad para tragar). El fisio no la cambia; apoya que lo hable con quien la prescribe.
5. **Neurocirugía (3.3)**: el estimulador puede mejorar o empeorar la marcha y el equilibrio; complicaciones de la estimulación: ansiedad, depresión, impulsividad y suicidio.
6. **Dolor (6.4.8 y 6.7.3)**: no hay ensayos de fisioterapia para el dolor en el Parkinson. **Si el dolor no tiene que ver con la medicación**, la fisioterapia puede estar indicada: educación, miedo y dolor, seguir activo, progresión por tiempo y no por dolor, TENS y terapia manual (ninguna evaluada en el Parkinson); aplicar las guías generales del dolor. Aconsejar que hable del dolor con quien le receta, por si ajustar la medicación lo reduce.
7. **Vibración de cuerpo entero (6.4.6)**: **recomendación fuerte en contra**, por seguridad.
8. **Masaje de puntos gatillo (6.4.7)**: recomendación débil a favor, solo para el efecto que percibe el paciente y siempre combinado con otra intervención.
9. **Cuándo parar el ejercicio (6.7.5)**: cansancio y sudor son normales; parar y consultar con náuseas, opresión o dolor torácico de más de unos minutos, falta de aire inusual (más de 40 respiraciones por minuto), fatiga o disnea intensas, mareo, palpitaciones, dolor, sudor frío, o una bajada de la TAS de más de 10 mmHg durante el ejercicio si se mide.
10. **Riesgo de caída (5.11)**: el modelo de tres pasos (caídas y congelación del formulario previo de la guía más la velocidad en 10 m) da un riesgo a 6 meses del 17, 51 y 85 %. Factores: congelación, demencia o deterioro cognitivo leve, incontinencia urinaria, pérdida del braceo, años desde el diagnóstico, entorno y medicación.
11. **Estadio final (6.8.3)**: Hoehn y Yahr 5. Prevenir úlceras y contracturas, postura, cambios de posición, formar a cuidadores, avisar enseguida de cambios en la piel.
12. **Comorbilidad (1.2.2)**: la mayoría tiene varias enfermedades; más fracturas, sobre todo con demencia.
13. **Exclusiones (1.2.3)**: suelo pélvico, a fisioterapia especializada.

### Contradicciones nuevas

6. **Ultrasonido con estimulador**: la FDA 2002 no espera la interacción; Salud Canadá 2003 lo contraindica encima o cerca del implante o de los electrodos; Keus 2014 lo desaconseja sin matizar la zona. **Propuesta**: seguir a Keus 2014, la más prudente y la única de fisioterapia (decisión 17).
7. **TENS e interferenciales con estimulador**: ni la FDA ni Salud Canadá hablan de ellas (no son diatermia); Keus 2014 las pone como bandera roja. La misma guía propone la TENS para el dolor en el Parkinson, **sin estimulador**. **Propuesta**: con estimulador, ninguna electroterapia; sin estimulador, nada cambia (decisión 17).
8. **Implantes con electrodos que no son de Parkinson** (marcapasos, estimulador medular, implante coclear): la contraindicación de la diatermia es la misma (FDA 2002; Health Canada 2003), y hoy la app no pregunta por ellos en ninguna parte. **Propuesta**: fuera de este diseño, apuntado como tarea aparte (decisión 22).

### Qué cambia en el diseño

- **Decisión 14 resuelta**: la línea de la diatermia ya tiene fuente y se escribe (ver la línea 9 nueva del recuadro).
- **Decisión 15 resuelta**: la guía europea confirma la tarjeta y cambia varias líneas:
  - **Recuadro de la fase 5**:
    - Línea 5 (on/off): «La capacidad física se entrena mejor en on; las estrategias se aprenden en on y, si hacen falta en off, se practican también en off. Valora y reevalúa en la misma fase y anótala» (Keus 2014, 6.7.2; Osborne 2022).
    - Línea 9 (estimulador): «**Con estimulador cerebral profundo: nada de onda corta ni microondas** (riesgo de lesión cerebral grave o muerte, aunque esté apagado o retirado si quedan electrodos), **ni ultrasonido, TENS, interferenciales ni otra electroestimulación, ni presión manual cerca de los cables**» (FDA 2002; Health Canada 2003; Keus 2014, 5.13).
    - **Línea nueva 11 (vibración)**: «No uses plataformas de vibración de cuerpo entero» (Keus 2014, 6.4.6, recomendación fuerte en contra).
    - **Línea nueva 12 (hidroterapia)**: «Con congelación de la marcha y rigidez axial intensa, hidroterapia solo con supervisión individual» (Keus 2014, 5.13).
    - **Línea nueva 13 (dolor)**: «Si el dolor no sigue a la medicación, trátalo como en las guías generales del dolor; si cambia con las tomas o con el off, que lo hable con quien le receta» (Keus 2014, 6.4.8 y 6.7.3).
    - Línea 7 (hueso), ampliada: osteoporosis OR 2,61 y fractura OR 2,28; la cadera es la mitad de las fracturas, y **las vertebrales pasan desapercibidas tras la postura encorvada** (Torsney 2014; Tan 2014).
  - **Fase 2**:
    - **Pregunta nueva `pk_d_complicaciones`**: «¿Tiene periodos off que no sabe prever, movimientos involuntarios fuertes o calambres dolorosos en off?» → `derivacion` a su neurólogo (Keus 2014, 5.13).
    - **Pregunta nueva `pk_d_mental`**: alucinaciones o conductas compulsivas nuevas (tomar medicación de más, juego, compras, comida) → `derivacion` (Keus 2014, 5.13; Simonet 2019). Para la decisión 18: puede ir `privada: true`, como el ánimo del embarazo.
  - **Fase 6**:
    - La red de seguridad suma los criterios de parada de Keus 2014, 6.7.5 (decisión 19).
    - El aviso `parkinsonEstimulador` sale **en cualquier plan con estimulador**, no solo con las pautas que nombran electroterapia: 16 hipótesis la nombran hoy (h1, h2, h3, h10, ca1, ca15, ce5, ro1–ro4, co1, tp1, tp8, tp24, tp26), unas para recomendarla y otras para no hacerlo, y además el fisio puede usarla sin que la pauta la nombre (decisión 20).
  - **Fase 4b**: con estimulador, añadir «sin presión manual cerca de los cables» a la línea de la 4b (Keus 2014, 5.13; decisión 21). Los cables van del cráneo, por detrás de la oreja y el cuello, a la batería bajo la clavícula: los tests cervicales y de hombro con presión ahí. **Redacción propia** del trayecto, pendiente de una fuente que lo describa.
- **Decisión 13** (bloque de ejercicio): la Cochrane ya está; se lee entera en ese paso.

### Decisiones nuevas (cada una con mi recomendación; aceptadas las 7 por el usuario, noviembre 2026)

17. **Qué técnicas se prohíben con estimulador**: recomiendo **seguir a Keus 2014**: ni onda corta ni microondas (FDA y Salud Canadá: lesión grave o muerte), **ni ultrasonido, TENS, interferenciales ni otra electroestimulación, ni presión manual cerca de los cables**. Es la más prudente y la única fuente de fisioterapia.
18. **Alucinaciones y conductas compulsivas** (`pk_d_mental`): recomiendo **incluirla como `derivacion` y `privada: true`**, para que el texto no llegue al 📄 Informe ni al prompt.
19. **Criterios de parada de Keus 2014** en la red de seguridad de la fase 6: recomiendo **sí, solo los que el paciente puede notar**: náuseas, dolor u opresión en el pecho de más de unos minutos, falta de aire inusual, mareo, palpitaciones o sudor frío. La bajada de la TAS, solo en el recuadro de la fase 5, para el fisio.
20. **Aviso del estimulador en la fase 6**: recomiendo que salga **en cualquier plan con estimulador marcado**.
21. **Presión manual cerca de los cables**: recomiendo **la línea de la 4b sin el trayecto** («ninguna presión manual cerca de los cables del estimulador»), hasta tener una fuente que describa el recorrido.
22. **Otros implantes con electrodos** (marcapasos, estimulador medular, implante coclear): recomiendo **apuntarlo como tarea aparte**, fuera del Parkinson: la contraindicación de la diatermia vale para cualquiera, y la app no lo pregunta en ninguna parte.
23. **Registro**: entran `FDA 2002 (diatermia)`, `Health Canada 2003 (diatermia)`, `Keus 2014` y `Torsney 2014` si el texto final los usa (decisión 16). `Ernst 2024`, con el bloque de ejercicio.

## Dolor: Buhmann 2020 (noviembre 2026)

| Clave propuesta | Referencia | Cómo se leyó |
|---|---|---|
| `Buhmann 2020` | Buhmann C, Kassubek J, Jost WH. Management of pain in Parkinson's disease. *J Parkinsons Dis* 2020;10(s1):S37–S48. [doi:10.3233/JPD-202069](https://doi.org/10.3233/JPD-202069) | PMC7592654, entero |

Lo que usa el diseño:
- El dolor afecta al **68–95 %**, en todos los estadios. En torno a la mitad se relaciona con artrosis de columna o articulaciones, amplificada por la acinesia y la rigidez, aunque la gravedad motora y el dolor no se correlacionan bien.
- **El dolor musculoesquelético de un solo lado, como un «síndrome hombro-brazo», es una presentación precoz típica de la acinesia y la rigidez, y a menudo pasa desapercibido.** El 5,5 % refiere el dolor como primer síntoma. Coincide con Paggou 2023 y no cambia la decisión 7: sigue sin regla automática, pero entra en el «Piensa en ella si:» de la guía de condiciones especiales.
- El dolor más frecuente es el espinal-paravertebral, luego el articular y el musculoesquelético; más en mujeres. El neuropático es minoritario.
- **Muchos pacientes no cuentan el dolor porque no lo relacionan con el Parkinson**: hay que preguntarlo.
- **Dolor «en percha»** (cuello y hombros) con la hipotensión ortostática, a veces con cefalea. Coincide con la pregunta 6 de cribado de LeWitt 2020 («¿dolor de cuello al estar de pie?»). Entra en `pk_d_ortostatica`.
- La base del tratamiento es optimizar la medicación (cuando el dolor sigue al off, a las discinesias o a la distonía); eso es del médico. Los pacientes valoran la **fisioterapia como especialmente eficaz** frente al dolor musculoesquelético, sin datos de técnicas concretas. En la camptocormia dolorosa, el foco es la fisioterapia.
- Clasificación de Ford (musculoesquelético, radicular o neuropático, distónico, acatisia, central). La única escala validada para el Parkinson es la KPPS; **no se añade** a la calculadora sin validación española comprobada (decisión 12).
- Los fármacos y dosis de la revisión no van a la app.

## Texto cerrado para revisión (noviembre 2026)

**Aprobado por el usuario (noviembre 2026).** Redacción final, con las 23 decisiones aplicadas. Cada frase lleva su fuente o «redacción propia». Al implementar se copia tal cual a `data/comun.js` (sistema y textos de la tarjeta) y `data/plan-tratamiento.js`.

### Fase 1 — tarjeta «Parkinson»

- **Título**: «Parkinson».
- **Nota bajo el título** (redacción propia): «Márcala si tiene diagnóstico de enfermedad de Parkinson, o «Sospecha» si tiene temblor, rigidez, lentitud o problemas de equilibrio o de marcha sin diagnosticar.»
- **Estado**: «Diagnosticado» · «Sospecha».
- **Con «Diagnosticado»**:
  - «Estadio (Hoehn y Yahr), si lo sabe»: 1–2 · 3 · 4–5 · No lo sabe.
  - «¿Tiene fluctuaciones on/off?»: Sí · No · No lo sabe.
  - Solo con fluctuaciones = Sí: «Ahora está en»: On · Off · No sabría decir. Debajo: «Anótalo: lo que mides cambia con la fase» (Osborne 2022; Keus 2014, 6.7.2).
  - «¿Se le congela la marcha?»: Sí · No.
  - «¿Lleva estimulador cerebral profundo?»: Sí · No · No lo sabe. Con «Sí», en rojo y nunca plegada: «**Nada de onda corta ni microondas** (riesgo de lesión cerebral grave o muerte aunque esté apagado, o retirado si quedan electrodos), **ni ultrasonido, TENS, interferenciales ni otra electroestimulación, ni presión manual cerca de los cables**» (FDA 2002; Health Canada 2003; Keus 2014, 5.13). Con «No lo sabe», la misma línea precedida de «Hasta confirmarlo:» (redacción propia, la opción prudente).
  - Las caídas: el bloque de caídas de la osteoporosis (NICE NG249), reutilizado en el sistema de la fase 2 (decisión 8).
- **Con «Sospecha»**: solo la nota «Deriva pronto y sin tratar a un especialista: no lo diagnostiques» (NICE NG71, 1.2.2).

### Fase 2 — `SIS_PARKINSON` («Parkinson», icono 🧠)

Preguntas, cada una con su `razonamiento` (porque, peso y fuentes) de lo leído:

| Id | Texto de la pregunta | Tipo y mensaje | Se muestra |
|---|---|---|---|
| `pk_u_crisis` | «En los últimos días, ¿está mucho más rígido o inmóvil que de costumbre y además tiene fiebre, está confuso, suda mucho o le cuesta tragar?» | `urgencia`: «Posible crisis acinética (síndrome de parkinsonismo-hiperpirexia): urgencias hoy» (Pötter-Nerger 2024; Simonet 2019) | Diagnosticado |
| `pk_d_medicacion` | «¿Ha dejado de tomar su medicación del Parkinson, o no puede tomarla o retenerla (vómitos, diarrea, no puede tragar, una cirugía)?» | `derivacion`: «Contactar hoy con su neurólogo o médico: la medicación no se debe retirar de golpe» (NICE NG71, 1.3.2) | Diagnosticado |
| `pk_d_estimulador` | «¿Han vuelto de golpe el temblor, la rigidez o la lentitud, o tiene movimientos involuntarios fuertes o cambios de conducta nuevos?» | `derivacion`: «Contactar hoy con el centro que le implantó el estimulador» (Simonet 2019) | Estimulador = Sí |
| `pk_d_complicaciones` | «¿Tiene periodos off que no sabe prever, movimientos involuntarios fuertes o calambres dolorosos cuando está en off?» | `derivacion`: «Consultar a su neurólogo: el ajuste de la medicación puede reducirlos» (Keus 2014, 5.13 y 3.2) | Diagnosticado |
| `pk_d_mental` | «¿Ve cosas que no están, o tiene conductas nuevas que no puede controlar (tomar medicación de más, juego, compras, comida)?» | `derivacion` y `privada: true`: «Consultar a su médico» (Keus 2014, 5.13; Simonet 2019) | Diagnosticado |
| `pk_d_ortostatica` | «¿Se marea, ve borroso, nota las piernas flojas o le duele el cuello y los hombros al estar de pie, y se le pasa al sentarse o tumbarse?» | `derivacion`: «Medir la tensión tumbado y de pie, y comentarlo con su médico» (LeWitt 2020, tabla 3; Buhmann 2020; NICE NG71, 1.5.8) | Los dos |
| `pk_d_tragar` | «¿Tose o se atraganta al comer o beber, o ha tenido infecciones respiratorias seguidas?» | `derivacion`: «Consultar a su médico: valoración de la deglución» (Simonet 2019; NICE NG71, 1.7.8) | Diagnosticado |
| `pk_d_sueno` | «¿Se queda dormido de repente durante el día, sin poder evitarlo?» | `derivacion`: «Consultar a su médico; no conducir mientras tanto» (NICE NG71, 1.5.1; Simonet 2019) | Diagnosticado |
| `pk_d_sospecha` | «Temblor, rigidez, lentitud, problemas de equilibrio o de la marcha, sin diagnóstico» | `derivacion`: «Derivar pronto y sin tratar a un especialista en trastornos del movimiento» (NICE NG71, 1.2.1–1.2.2) | Sospecha |

Cambios respecto al borrador:
- `pk_u_medicacion` y `pk_u_estimulador` pasan a `pk_d_*`: son `derivacion` hoy, y la urgencia es `pk_u_crisis` (decisión 3).
- `pk_d_complicaciones` y `pk_d_mental` son nuevas (Keus 2014).
- `pk_d_ortostatica` añade el dolor «en percha».

Bloques del sistema (`[data-pk-bloque]`):
- **Tensión tumbado y de pie** (decisión 10): la prueba de bipedestación de `lib/disautonomia.js`, con su reloj, reducida a tumbado y minutos 1 y 3, y la regla de hipotensión ortostática (≥ 20 mmHg de TAS o ≥ 10 de TAD), sin la del POTS (LeWitt 2020). Se abre con «Hacer la medida», como en la disautonomía. No marca la tarjeta de disautonomía.
- **Caídas**: el de la osteoporosis (NICE NG249, sin puntuar), con las mismas preguntas y el mismo estado si las dos tarjetas están marcadas.

Banderas del sistema, cada una enlazada a su pregunta (Fase M): crisis acinética → `pk_u_crisis`; retirada de la medicación → `pk_d_medicacion`; fallo del estimulador → `pk_d_estimulador`.

### Fase 3

`#pkNotaDolor` (`.solo-pk`), bajo la matriz de irritabilidad: «Pregunta por el dolor aunque no lo cuente: muchos no lo relacionan con el Parkinson. Anota si está en on u off, y si el dolor cambia con las tomas, que lo hable con quien le receta» (Buhmann 2020; Keus 2014, 6.7.2 y 6.7.3).

### Fase 4b

`.pk-nota-4b`, encima de las tarjetas:
- Siempre: «La rigidez limita la movilidad pasiva y el temblor puede tapar la respuesta: compara con el otro lado y anota si está en on u off» (redacción propia sobre Osborne 2022 y Paggou 2023; Keus 2014, 6.7.2).
- Con estimulador = Sí o «No lo sabe»: «Sin presión manual cerca de los cables del estimulador» (Keus 2014, 5.13; decisión 21).

### Fase 5 — recuadro «Parkinson» (`.pk-fase5`, nunca se pliega)

Con «Diagnosticado»:
1. **Estimulador** (solo con Sí o «No lo sabe», primera línea y en rojo): la misma frase de la tarjeta.
2. **Ejercicio**: «Con lo que usaron los ensayos, sin una dosis óptima establecida: aeróbico moderado a alto, al menos 3 días por semana, 30–40 min; fuerza progresiva 1–2 días por semana; equilibrio 2–3 veces por semana; marcha 20–60 min, 3–5 días por semana, 4–12 semanas. Lo ganado se pierde si se deja» (Osborne 2022). «Casi cualquier tipo de ejercicio ayuda; el tipo importa menos que hacerlo» (Ernst 2024).
3. **Intensidad**: «La FC puede subir menos de lo esperado: vigila también el esfuerzo percibido» (Osborne 2022). «Si estaba inactivo, empieza bajo y sube poco a poco» (Keus 2014, 5.13).
4. **Congelación o riesgo de caída**: «Bicicleta antes que cinta; usa estímulos externos (auditivos o visuales) para la marcha» (Osborne 2022). «Hidroterapia solo con supervisión individual» (Keus 2014, 5.13).
5. **On/off**: «La capacidad física se entrena mejor en on; las estrategias se aprenden en on y, si hacen falta en off, se practican también en off. Valora y reevalúa en la misma fase y anótala» (Keus 2014, 6.7.2; Osborne 2022).
6. **Hoehn y Yahr 4–5** (solo con ese estadio): «Las pautas se estudiaron sobre todo en estadios 1–3» (Osborne 2022). Con 4–5 se añade: «En cama o silla: prevenir úlceras y contracturas, postura, cambios de posición y formar a los cuidadores en las transferencias» (Keus 2014, 6.8.3).
7. **Hipotensión ortostática**: «Levantarse en dos tiempos; maniobras físicas: cruzar las piernas tensando, inclinarse hacia delante, ponerse en cuclillas. Fármacos, sal y agua, con su médico» (LeWitt 2020, tabla 4).
8. **Hueso y caídas**: «Osteoporosis y fracturas, más del doble que sin Parkinson; la cadera es la mitad de las fracturas y las vertebrales pasan desapercibidas tras la postura encorvada. Valora la tarjeta de osteoporosis» (Torsney 2014; Tan 2014).
9. **Dolor**: «Si el dolor no sigue a la medicación, trátalo como en las guías generales del dolor, con progresión por tiempo y no por dolor; si cambia con las tomas o con el off, que lo hable con quien le receta» (Keus 2014, 6.4.8 y 6.7.3; Buhmann 2020).
10. **Vibración**: «No uses plataformas de vibración de cuerpo entero» (Keus 2014, 6.4.6: recomendación fuerte en contra).
11. **Ataques de sueño** (con `pk_d_sueno` = SÍ): «No le dejes solo en la bicicleta o la cinta» (redacción propia sobre Simonet 2019).
12. **Cuándo parar** (para el fisio): «Parar y consultar con náuseas, dolor u opresión torácica de más de unos minutos, falta de aire inusual, mareo, palpitaciones, sudor frío o si la TAS baja más de 10 mmHg durante el ejercicio» (Keus 2014, 6.7.5).
13. **Fisioterapia con experiencia en Parkinson**: «Las guías recomiendan fisioterapia con experiencia en Parkinson» (NICE NG71, 1.7.2–1.7.3; Osborne 2022).

Con «Sospecha»: solo la derivación de `pk_d_sospecha`.

### Fase 6

- **Aviso `parkinson`** (cualquier región, con «Diagnosticado»): las líneas 2, 3 y 5 del recuadro.
- **Aviso `parkinsonEstimulador`** (estimulador = Sí o «No lo sabe», en cualquier plan; decisión 20): la frase del estimulador.
- **Aviso `parkinsonVibracion`**: la línea 10, solo en el plan, sin condición de hipótesis.
- **Red de seguridad `RED_PARKINSON`** (decisión 19), escrita para el paciente:
  - «Si en los próximos días está mucho más rígido o inmóvil con fiebre, confusión o mucho sudor, o no puede tomar su medicación: a urgencias» (Pötter-Nerger 2024; NICE NG71, 1.3.2).
  - «Para el ejercicio y consulta si nota náuseas, dolor u opresión en el pecho que dura más de unos minutos, falta de aire fuera de lo normal, mareo, palpitaciones o sudor frío» (Keus 2014, 6.7.5).
- Sin tope de thrust propio (decisión 9).

### Salidas

- `📋 Notas`: «🧠 PARKINSON: diagnosticado · H&Y 3 · fluctuaciones (valorado en on) · congelación · estimulador cerebral profundo».
- `📄 Informe`: «ENFERMEDAD DE PARKINSON» con estadio, fluctuaciones y estimulador (sin técnicas), o con «Sospecha» «RECOMENDACIÓN DE VALORACIÓN MÉDICA»: «Se recomienda valoración por un especialista en trastornos del movimiento» (sin la palabra Parkinson).
- Bloque de la IA `bloquePKIA()`, sin citas: lo de 📋 Notas más la regla «Con estimulador cerebral profundo, no propongas diatermia, ultrasonido ni electroestimulación». `PK_CASOS` fija el texto para `_bloquePK` de physiq-report.
- Payload `pk`: con «Diagnosticado» `{ es, hy, fl, fa, cg, ec }`; con «Sospecha» `{ es }`. Nunca `pk_d_mental` en texto (es `privada`).
- Modo breve, pendientes: «Estimulador cerebral profundo sin registrar» (es lo que cambia las técnicas) y, con fluctuaciones, «Fase on/off sin registrar».

### Guía de condiciones especiales

Fila `parkinson`:
- **Qué es** (redacción propia): «Enfermedad neurológica que da lentitud, rigidez, temblor y problemas de equilibrio, y que se trata con medicación que hay que tomar a sus horas.»
- **Piensa en ella si:**
  - «Tiene temblor, rigidez, lentitud o problemas de marcha sin diagnóstico» (`pk_d_sospecha`).
  - «Un dolor de hombro o brazo de un lado con rigidez o menos braceo» (Buhmann 2020; Paggou 2023).
  - «Ya tiene el diagnóstico y viene por otro dolor».
- **Al marcarla, añade:** las preguntas de la fase 2, la medida de la tensión de pie, la línea del estimulador, el recuadro de la fase 5 y los avisos de la fase 6.

### Otras tareas que salen de aquí (fuera de esta condición)

- **Otros implantes con electrodos** (decisión 22): marcapasos, desfibrilador, estimulador medular, implante coclear. La diatermia está contraindicada con cualquiera (FDA 2002; Health Canada 2003), y la app no lo pregunta en ninguna parte. Va como casilla aparte en `MIGRATION_PLAN.md`.
- **Bloque «Ejercicio en el Parkinson»** de la guía de ejercicio (decisión 13), con la Cochrane leída entera.

## Criterio de entrada de la Fase P: sí entra

1. **Cambia la seguridad**:
   - **La crisis acinética** (síndrome de parkinsonismo-hiperpirexia): empeoramiento en días de la rigidez y la inmovilidad, con fiebre, confusión o sudor. Mortalidad del 4–23 % (Pötter-Nerger 2024; Simonet 2019). Puede llegar a la consulta como «está mucho más rígido y le duele todo».
   - **La medicación que se retira o no se absorbe** (vómitos, diarrea, cirugía, no puede tragar) desencadena esa crisis (NICE NG71, 1.3.2; Simonet 2019, tabla 1).
   - **El estimulador cerebral profundo**: si deja de funcionar, el parkinsonismo reaparece de golpe, y puede llegar a un cuadro parecido a la hiperpirexia (Simonet 2019). La diatermia es la contraindicación grave de la consulta de fisioterapia (pendiente de fuente).
   - **Hipotensión ortostática** en el 47–58 % (LeWitt 2020), sintomática en ~10 % (Simonet 2019), con síncope y caídas al levantarse de la camilla.
   - **Caídas** en el 50–60 % (Simonet 2019) y **fracturas** con un riesgo 2,66 veces mayor (Tan 2014). Cambia la carga ósea y el thrust, como en la osteoporosis.
   - **Ataques de sueño** y somnolencia con los agonistas dopaminérgicos (Simonet 2019; NICE NG71, 1.5.1): un paciente que se duerme en la camilla o en la bicicleta estática.
2. **Cambia la interpretación**:
   - **La rigidez** limita la movilidad pasiva y la del tronco (Osborne 2022, flexibilidad). No es una restricción capsular.
   - **El dolor** es frecuente y en parte sigue a la medicación: el off se acompaña de dolor, sudor y taquicardia (Simonet 2019).
   - **El hombro doloroso o congelado** y la asimetría del braceo pueden ser lo primero (Paggou 2023), aunque el riesgo absoluto es bajo (Gadgaard 2024).
   - **On u off cambia lo que se mide**: los resultados de las pruebas y del ejercicio son distintos en una fase y otra (Osborne 2022). Una reevaluación tiene que anotar en qué fase se hizo.
   - **La FC sube menos** con el esfuerzo por la disautonomía: la intensidad se vigila también con el esfuerzo percibido (Osborne 2022).

**Es capa transversal**, como las otras de la Fase P, no contenido de una región.

## Principios (los de la Fase P)

1. **Capa transversal, no fase nueva**: tarjeta en la fase 1, sistema de la fase 2 que solo aparece con la tarjeta marcada, línea en la 4b, recuadro en la 5 y avisos en la 6.
2. **El árbol CIF y el motor de puntuación no se tocan.**
3. **El fisio no diagnostica el Parkinson**, ni ajusta la medicación (como en la guía de fármacos): nunca «tome más», «no tome» ni «cambie la hora».
4. **La seguridad no se recorta**: las urgencias nunca se pliegan, sin embudo en modo breve, y marcar la tarjeta nunca quita ni rebaja una `urgencia` de otro sistema (test unitario, como en las demás).
5. **Sin contenido clínico inventado**: cada frase sale de una fuente leída o se marca «redacción propia» para tu revisión.
6. **Ninguna regla automática con otras tarjetas** (decisión 9): ni con la de disautonomía, ni con la de osteoporosis, ni con la de fármacos.

## Forma propuesta (borrador)

### Fase 1 — tarjeta «Parkinson» (`#cardParkinson`)

Después de la del paciente anticoagulado.

- **Estado**: «Diagnosticado» y, si se acepta la decisión 2, «Sospecha». Nada marcado = no consta; un segundo toque lo borra.
- Con «Diagnosticado», filas de botones (segundo toque borra), cada una con su porqué:
  - **Estadio de Hoehn y Yahr, si lo sabe**: 1–2 · 3 · 4–5 · no lo sabe. Porque la evidencia de las pautas es casi toda de 1–3 (Osborne 2022), y en 4–5 el recuadro lo dice (decisión 4).
  - **Fluctuaciones on/off**: No · Sí · No lo sabe (Simonet 2019; Osborne 2022).
  - **Fase ahora**: On · Off · No sabría decir. Solo se pinta con fluctuaciones = Sí. Para anotar en qué fase se hace la valoración (decisión 5).
  - **Congelación de la marcha**: Sí · No (Osborne 2022: bicicleta antes que cinta; estímulos externos).
  - **Caídas en el último año**: reutiliza las preguntas de NICE NG249 que ya usa la osteoporosis (decisión 8).
  - **Estimulador cerebral profundo**: No · Sí · No lo sabe. Con «Sí», la línea de la diatermia (pendiente de fuente) y la pregunta de la fase 2 del estimulador.
  - **Otros dispositivos**: bomba de apomorfina o de levodopa intestinal (chips). Opcional (decisión 6).
- Con «Sospecha»: solo la línea de derivación (fase 2).
- `_pintarPKUI()` pone `body.parkinson`; un cambio vacía la 4b (`_invalidar4b()`) y repinta el cribado (`_repintarCribado()`), como en las demás.

### Fase 2 — sistema «Parkinson» (`SIS_PARKINSON`, `transversal_parkinson`)

`soloParkinson: true`, sin embudo en modo breve. Borrador de preguntas, cada una con su `razonamiento` de las fuentes leídas:

| Id propuesto | Pregunta (borrador) | Tipo | Estado | Fuente |
|---|---|---|---|---|
| `pk_u_crisis` | «En los últimos días, ¿está mucho más rígido o inmóvil que de costumbre y además tiene fiebre, está confuso, suda mucho o le cuesta tragar?» | `urgencia` (hoy, urgencias hospitalarias) | Diagnosticado | Pötter-Nerger 2024; Simonet 2019 |
| `pk_u_medicacion` | «¿Ha dejado de tomar su medicación del Parkinson, o no la puede tomar o retener (vómitos, diarrea, no puede tragar, una cirugía), y está peor?» | `urgencia` o `derivacion` (decisión 3) | Diagnosticado | NICE NG71, 1.3.2; Simonet 2019, tabla 1 |
| `pk_u_estimulador` | «Con el estimulador cerebral: ¿han vuelto de golpe el temblor, la rigidez o la lentitud, o tiene movimientos involuntarios fuertes o cambios de conducta nuevos?» | `derivacion` hoy al centro implantador; `urgencia` si se suma lo de `pk_u_crisis` (decisión 3) | Con estimulador = Sí | Simonet 2019 |
| `pk_d_ortostatica` | «¿Se marea, ve borroso o nota las piernas flojas al ponerse de pie, y se le pasa al sentarse o tumbarse?» | `derivacion` (no urgente), con el bloque de medida (decisión 10) | Los dos | LeWitt 2020, tabla 3; NICE NG71, 1.5.8 |
| `pk_d_tragar` | «¿Tose o se atraganta al comer o beber, o ha tenido infecciones respiratorias seguidas?» | `derivacion` (médico, logopedia) | Diagnosticado | Simonet 2019; NICE NG71, 1.7.8 |
| `pk_d_sueno` | «¿Se queda dormido de repente durante el día, sin poder evitarlo?» | `derivacion` | Diagnosticado | Simonet 2019; NICE NG71, 1.5.1 |
| `pk_d_sospecha` | Con «Sospecha»: «Temblor, rigidez, lentitud, problemas de equilibrio o de la marcha sin diagnóstico» | `derivacion` preferente, «pronto y sin tratar» al especialista | Sospecha | NICE NG71, 1.2.1–1.2.2 |

- **El síncope ya está** en cada región (`sx_sincope`, urgente; `docs/pots.md`, decisión 9). No se repite; `pk_d_ortostatica` cubre el mareo al ponerse de pie sin desmayo.
- **El ánimo y el riesgo de suicidio tras la cirugía del estimulador** (Simonet 2019) se dejan fuera por ahora (decisión 11). Si entran, irían como en el embarazo: `privada: true`, la urgencia en `ur` y nunca el texto de la pregunta en `sq`.
- **Bloque de medida** `[data-pk-bloque]` (decisión 10): la medida de la tensión tumbado y de pie de LeWitt 2020 (5 min tumbado, de pie al minuto 1 y al 3; ≥20/10 mmHg). Opción A: reutilizar la prueba de bipedestación de la disautonomía (`lib/disautonomia.js`, con reloj), solo con los minutos 1 y 3 y sin la regla del POTS. Opción B: solo el texto de cómo medirla, sin tabla.

### Fase 3 — SINSS

Una línea `.solo-pk` bajo la matriz de irritabilidad: «Anota si está en on u off: el dolor y la tolerancia cambian con la medicación» (Simonet 2019; Osborne 2022). La irritabilidad no cambia de regla.

### Fase 4 — árbol CIF

Sin cambios. La sospecha de Parkinson desde el hombro (Paggou 2023) **no** va como pista del árbol (decisión 7).

### Fase 4b — una línea general, sin tocar las LR

`.pk-nota-4b` encima de las tarjetas: «La rigidez limita la movilidad pasiva y el temblor puede enmascarar la respuesta: compara con el otro lado y anota si está en on u off» (redacción propia sobre Osborne 2022 y Paggou 2023; pendiente de la guía KNGF). Con estimulador, nada en la 4b: la diatermia no es un test.

Para los tests que cargan hueso, ya existe `cargaOsea` en la osteoporosis. **No se activa con el Parkinson** (decisión 9): la línea del recuadro sugiere valorar la tarjeta de osteoporosis.

### Fase 5 — recuadro «Parkinson» (`.pk-fase5`, nunca se pliega)

Borrador de líneas, cada una con su fuente:

1. **Ejercicio, con lo que usaron los ensayos** (no una dosis óptima establecida; Osborne 2022): aeróbico moderado a alto, al menos 3 días/semana, 30–40 min; fuerza progresiva 1–2 días/semana; equilibrio 2–3 veces/semana; marcha 20–60 min, 3–5 días/semana, 4–12 semanas. Lo ganado se pierde si se deja.
2. **Intensidad**: la FC puede subir menos; vigila también el esfuerzo percibido (Osborne 2022).
3. **Con congelación de la marcha o riesgo de caída**: bicicleta antes que cinta; estímulos externos (auditivos o visuales) para la marcha (Osborne 2022).
4. **Hoehn y Yahr 4–5**: «Las pautas se estudiaron sobre todo en estadios 1–3» (Osborne 2022).
5. **On/off**: haz la valoración y la reevaluación en la misma fase y anótala (Osborne 2022). Si se lee la guía KNGF: citar la sesión en fase «on».
6. **Hipotensión ortostática**: levantarse en dos tiempos; maniobras físicas (cruzar las piernas tensando, inclinarse hacia delante, ponerse en cuclillas) (LeWitt 2020, tabla 4). Los fármacos, la sal y el agua son del médico.
7. **Caídas y hueso**: riesgo de fractura 2,66 veces mayor (Tan 2014); valora la tarjeta de osteoporosis y la prudencia con el thrust (redacción propia; decisión 9).
8. **Ataques de sueño**: no le dejes solo en la bicicleta o la cinta si se duerme de golpe (redacción propia sobre Simonet 2019).
9. **Con estimulador**: **no apliques diatermia** (onda corta, microondas, ultrasonido terapéutico) aunque esté apagado. **Pendiente de fuente: no se escribe sin leer el aviso de la FDA o el etiquetado.** La electroterapia (TENS) queda pendiente de la misma lectura.
10. **Fisioterapia con experiencia en Parkinson**: NICE NG71 (1.7.2–1.7.3) y Osborne 2022 (buena práctica) la recomiendan.

Salidas, como las demás:
- `📋 Notas`: «🧠 PARKINSON:» (estado, Hoehn y Yahr, fluctuaciones, fase de la valoración, estimulador).
- `📄 Informe`: «ENFERMEDAD DE PARKINSON» (diagnosticado) o «RECOMENDACIÓN DE VALORACIÓN MÉDICA» (sospecha, **sin la palabra Parkinson**, como en el lupus y la osteoporosis).
- Bloque de la IA `bloquePKIA()` sin citas, con su `PK_CASOS` para la copia de physiq-report (`_bloquePK`).
- Payload `pk`: `{ es, hy, fl, fa, cg, ec, dp }` (estado, Hoehn y Yahr, fluctuaciones, fase de la valoración, congelación, estimulador, otros dispositivos). Solo con la tarjeta marcada, para no cambiar la `huella` de los informes antiguos.

### Fase 6 — plan de tratamiento

- **Aviso `parkinson`** (cualquier región): las líneas 1–3 y 5 del recuadro, más «sesión en la misma fase on/off que la reevaluación».
- **Aviso `parkinsonEstimulador`**: la diatermia (pendiente de fuente).
- **Red de seguridad `RED_PARKINSON`**: si en los días siguientes está mucho más rígido o inmóvil con fiebre o confusión, o deja de poder tomar la medicación → urgencias (Pötter-Nerger 2024; NICE NG71, 1.3.2).
- **Sin tope de thrust propio** (decisión 9): el tope lo pone la tarjeta de osteoporosis si se marca.
- Programa para casa: ejercicio regular a largo plazo (Osborne 2022: lo ganado se pierde si se deja).

### Guía de condiciones especiales

Fila `parkinson`: «qué es», «Piensa en ella si:» (temblor, rigidez, lentitud o problemas de marcha sin diagnóstico; paciente con Parkinson que viene por otro dolor), «Al marcarla, añade:», fuentes y botón a `#cardParkinson`.

### Guía «Efectos del ejercicio»

Un bloque «Ejercicio en el Parkinson» tendría fuentes clínicas (Osborne 2022 y la Cochrane de 2024, pendiente). Se propone como paso aparte (decisión 13), con el procedimiento de `docs/efectos-ejercicio.md`.

## Contradicciones y huecos entre fuentes

1. **Dosis del ejercicio**: Osborne 2022 da lo que usaron los ensayos, pero dice que la dosis óptima no está determinada. **Propuesta**: citarla como «lo que usaron los ensayos».
2. **Alta frente a moderada intensidad**: un ensayo de fase II solo vio menos empeoramiento motor con la alta, pero las comparaciones directas no encontraron diferencias (Osborne 2022). **Propuesta**: «moderada a alta», sin preferir una.
3. **Ejercicio y caídas**: Osborne 2022 da menos caídas con fuerza y equilibrio; Simonet 2019 dice que la mayoría de los estudios no muestran un beneficio constante en la prevención de caídas. **Propuesta**: no prometer menos caídas en el texto al paciente; sí recomendar el equilibrio.
4. **Hombro congelado como señal precoz**: Paggou 2023 lo propone; Gadgaard 2024 no encuentra más riesgo que tras un dolor lumbar. **Propuesta**: ninguna regla (decisión 7).
5. **Estimulación cerebral profunda y fisioterapia**: Osborne 2022 no encontró estudios. **Propuesta**: solo seguridad (diatermia, fallo del estimulador), ninguna pauta propia.

## Decisiones (cada una con mi recomendación; aceptadas las 16 por el usuario, noviembre 2026)

1. **¿Hacer la condición especial?** Recomiendo **sí**, con la forma propuesta.
2. **¿Estado «Sospecha»?** Recomiendo **sí**: NICE NG71 (1.2.1–1.2.2) da qué síntomas y qué hacer (derivar pronto y sin tratar). Con «Sospecha» solo sale la derivación, nunca la palabra Parkinson en el 📄 Informe.
3. **Retirada de la medicación y fallo del estimulador**: ¿`urgencia` o `derivacion`? Recomiendo **`derivacion` hoy** al equipo que le lleva (neurología o centro implantador), y **`urgencia`** solo cuando además hay fiebre, confusión, sudor o no puede tragar (`pk_u_crisis`). Así se separa lo que puede esperar a una llamada de lo que va a urgencias.
4. **Hoehn y Yahr en la tarjeta**: recomiendo **sí, opcional** («no lo sabe» válido). Solo cambia una línea del recuadro.
5. **Fase on/off de la valoración**: recomiendo **sí**, solo con fluctuaciones marcadas.
6. **Bombas de apomorfina o de levodopa intestinal**: recomiendo **no por ahora**. Las fuentes leídas solo dan sus complicaciones médicas, nada para el fisio.
7. **Hombro congelado → sospecha de Parkinson**: recomiendo **ninguna regla**. Como mucho, un párrafo en el razonamiento de un paso del árbol de hombro, en otra sesión (Gadgaard 2024: riesgo absoluto bajo e igual que tras dolor lumbar).
8. **Caídas**: recomiendo **reutilizar el bloque de caídas de la osteoporosis** (NICE NG249, sin puntuar), en vez de escribir otro.
9. **Hueso y thrust**: recomiendo **ninguna regla automática** con la osteoporosis. Una línea en el recuadro sugiere valorar esa tarjeta (Tan 2014). Coherente con las demás condiciones.
10. **Hipotensión ortostática**: recomiendo la **opción A**, reutilizar la prueba de bipedestación de la disautonomía con los minutos 1 y 3, sin la regla del POTS. No se marca la tarjeta de disautonomía: en el Parkinson la hipotensión es neurogénica, no un POTS.
11. **Ánimo y riesgo de suicidio tras el estimulador**: recomiendo **dejarlo fuera de esta versión**, apuntado en «Fuera de este diseño».
12. **Cuestionario específico** (PDQ-39 o PDQ-8): recomiendo **no añadir ninguno** hasta comprobar una validación en español de España.
13. **Bloque en la guía «Efectos del ejercicio»**: recomiendo **sí, como paso aparte**, después de leer la Cochrane de 2024.
14. **Línea de la diatermia**: recomiendo **no implementar la tarjeta sin ella**. Pido el aviso de la FDA de 2002 o el manual de un estimulador (Medtronic, Abbott o Boston Scientific) en PDF, y comprobar si dice algo de la TENS.
15. **Guía europea KNGF**: recomiendo **leerla antes de implementar**. Es la guía de fisioterapia de referencia en Europa y puede cambiar las líneas on/off, de evaluación y de estrategias de movimiento.
16. **Registrar en `data/referencias.js`** solo las fuentes que use el texto final (como en las demás).

## Fuera de este diseño (apuntado, no resuelto)

- Parkinsonismos atípicos (atrofia multisistémica, parálisis supranuclear progresiva) y parkinsonismo por fármacos. Osborne 2022 los excluye.
- El ánimo, la psicosis y los trastornos del control de impulsos (Simonet 2019): del médico.
- La disfagia más allá de derivar: es de logopedia (NICE NG71, 1.7.8).
- Los fármacos antiparkinsonianos como familia de la guía de fármacos (`docs/farmacologia.md`): habría que proponerla aparte, con sus fuentes.

## Cambios técnicos previstos (si se aceptan las decisiones)

- `state.parkinson` + normalización en `lib/parkinson.js` (puro, con tests): visibilidad, pendientes de modo breve, `pkPayload`, textos de 📋 Notas, 📄 Informe e IA.
- `SIS_PARKINSON` en `data/comun.js`, añadido a los 7 `data/<región>.js`; `soloParkinson` en `sistemasActivos()`.
- Tarjeta en `index.html` y `app.js` (`_pintarPKUI`, `selectPKEstado`, `selectPKFila`), expuesta en `window`.
- Recuadro de la fase 5, aviso y red de la fase 6 (`data/plan-tratamiento.js`, regenerar `docs/plan-tratamiento-frases.md`).
- Fila en `data/condiciones.js`; hojas impresas afectadas (cribado de las 7 regiones, `condiciones`, `plan`) regeneradas con sus cuadernos.
- `tests/unit/parkinson.mjs` (incluida «marcar la tarjeta nunca quita ni rebaja una urgencia de otro sistema») y sección de humo `parkinson`.
- physiq-report: `_bloquePK` con `PK_CASOS`.

## Siguiente paso

1. ~~Tus decisiones 1–16~~: aceptadas las 16 recomendaciones (noviembre 2026).
2. ~~PDF del usuario~~: leídos (noviembre 2026; ver «Lectura de los PDF»).
3. ~~Decisiones 17–23 del usuario~~: aceptadas (noviembre 2026).
4. ~~Revisión del dolor y texto cerrado~~: hecho (ver «Dolor: Buhmann 2020» y «Texto cerrado para revisión»).
5. ~~Revisión del usuario del texto cerrado~~: aprobado (noviembre 2026).
6. ~~**Implementación**~~: hecha (noviembre 2026; ver «Implementación»). `_bloquePK` hecho en physiq-report (physiq-report#101). **Revisado por el usuario en la app (noviembre 2026).**

## Implementación (noviembre 2026)

Rama `claude/parkinson-condicion`. Lo implementado es el «Texto cerrado para revisión», con las frases copiadas tal cual y su fuente.

**Archivos**
- `data/comun.js`: `SIS_PARKINSON` (`transversal_parkinson`, `soloParkinson: true`, icono 🧠), después del anticoagulado en los 7 `data/<región>.js`. Cada pregunta y bandera lleva `pk`: `'diagnosticado'`, `'estimulador'` (estimulador en «Sí») o `'sospecha'`; sin `pk` (solo `pk_d_ortostatica`), con los dos estados. `parkinson` guarda las filas, la medida de la tensión y los textos (`PK.textos`).
- `lib/parkinson.js` (puro): estado vacío y normalización, `elementoPKVisible()`, `resultadoTension()` (TAS −20 o TAD −10 al minuto 1 o 3), `resultadoCaidasPK()`, `pendientesPK()`, `pkPayload()`, `datosPK()`, `lineaEstimulador()`, `lineasRecomendacionPK()`, `lineaNotasPK()`, `informePK()`, `bloquePKIA()`.
- `app.js`: tarjeta (`_pintarPKUI`, `selectPKEstado`, `selectPKFila`), bloque de la fase 2 (`[data-pk-bloque]`: medida de la tensión y caídas), reloj (`pkRelojEmpezar`/`pkRelojParar`, el de la disautonomía con los minutos 1 y 3: `estadoReloj(reloj, ahora, minutos)` en `lib/disautonomia.js` acepta ahora los minutos), recuadro `.pk-fase5`.
- `phase4b.js` (`.pk-nota-4b`), `index.html` (`#cardParkinson`, `#pkNotaDolor`), `lib/resumenes.js`, `lib/informe-narrativo.js`, `plan.js`, `lib/plan-tratamiento.js`, `data/plan-tratamiento.js`, `data/condiciones.js` + `lib/condiciones.js`, `lib/esquemas.js`, `lib/guia-condiciones.js`, `guia-plan.js`, `docs/esquemas/hojas.mjs`, `data/guia.js` (`CONTRASTE_URGENCIAS.pk_u_crisis`), `data/referencias.js`.

**Decisiones de implementación** (sin cambiar nada clínico):
- **Caídas compartidas** (decisión 8): el bloque es el mismo de la osteoporosis (`_caidasBloqueHTML()`), con `state.parkinson.caidas`. Con las dos tarjetas marcadas, cada respuesta se escribe en las dos y, al marcar una con la otra ya marcada, la que no tiene respuestas toma las de la otra (`_sincronizarCaidas()`).
- **Payload `pk`**: exactamente `{ es, hy, fl, fa, cg, ec }` o `{ es }`. Las caídas y la respuesta de los ataques de sueño no van al payload: el recuadro de la fase 5 las lee aparte (`_datosRecuadroPK()`), así que `bloquePKIA()` (y `_bloquePK` de physiq-report) solo depende del payload.
- **Líneas condicionales del recuadro**: la 4 (congelación o riesgo de caída) sale con congelación «Sí» o con alguna caída en el último año; la 6, solo con Hoehn y Yahr 4–5 (las dos frases juntas); la 11, con `pk_d_sueno` en SÍ; el resto, siempre con «Diagnosticado». Con «Sospecha», solo la derivación de `pk_d_sospecha`.
- **Estimulador «No lo sabe»**: la línea de la tarjeta, del recuadro y de la 4b sale también, con «Hasta confirmarlo:» delante; la pregunta de la fase 2 sobre el fallo del estimulador, solo con «Sí». El aviso `parkinsonEstimulador` de la fase 6, con «Sí» o «No lo sabe».
- **Red de la fase 6** (`RED_PARKINSON`, dos entradas): el programa para casa lleva las dos frases del texto cerrado pasadas a «tú», como las demás alarmas («Si en los próximos días estás mucho más rígido…, ve a urgencias», «Para el ejercicio y consulta si notas…»; recomendación aceptada por el usuario, noviembre 2026); el cierre de la sesión, «Red de seguridad (Parkinson): explicar que…» con las mismas frases en tercera persona.
- **Razonamiento de las preguntas**: «por qué» y «cuánto pesa» redactados solo con lo que este documento recoge de cada fuente. `pk_d_sospecha` lleva además un «En detalle» con el dolor de hombro o brazo de un lado (Buhmann 2020; Paggou 2023), del que sale la segunda pista de la guía de condiciones; sin regla (decisión 7).
- **Registro**: `Osborne 2022`, `NICE NG71`, `Simonet 2019` (publicada en 2020; la clave es la del diseño), `Pötter-Nerger 2024`, `LeWitt 2020`, `Keus 2014`, `Buhmann 2020`, `FDA 2002 (diatermia)` y `Health Canada 2003 (diatermia)` (con `citadaComo` sin el paréntesis), `Torsney 2014`, `Tan 2014`, `Ernst 2024` y `Paggou 2023`. Fuera, porque el texto no las usa: `Wang 2022` y `Gadgaard 2024`.
- **Urgencia en la transcripción**: `pk_u_crisis` tiene su entrada en `CONTRASTE_URGENCIAS` (rigidez o inmovilidad nuevas junto a fiebre, confusión, sudor o dificultad para tragar).
- **Hojas impresas**: el cribado de las 7 regiones pasa de 2 a 3 páginas; la hoja de condiciones y la del plan (red por condición) cambian. Sin cambio del orden de los cuadernos.

**Guía de consulta** (`guia.html`): el sistema sale en el cribado de cada región, con su bloque de caídas, el recuadro de la fase 5 y las líneas de la 4b (`lib/guia-condiciones.js`); la fila de la guía de condiciones; dos casillas en el formulario de `#plan` (`guia-plan.js`); y la **calculadora de la tensión tumbado y de pie** (`calcParkinsonHTML()`, `#calc-parkinson`, `guia-calc.js`), con la regla de `resultadoTension()` y el reloj de la prueba de bipedestación con los minutos 1 y 3 (un solo reloj a la vez para las dos calculadoras). Las hojas de cribado y de condiciones dicen que se calcula en la guía (QR).

**Pruebas**: `tests/unit/parkinson.mjs` (incluida «marcar la tarjeta nunca quita ni rebaja una urgencia de otro sistema», con los dos estados y todas las filas) y la sección de humo `parkinson`.

**Para revisar en la app**: la tarjeta con «Diagnosticado» y con «Sospecha»; la línea roja del estimulador con «Sí» y con «No lo sabe»; el sistema de la fase 2 (preguntas, medida de la tensión con su reloj, caídas, también con la tarjeta de osteoporosis marcada); la nota de la fase 3 y la de la 4b; el recuadro de la fase 5; los avisos y la red de la fase 6 (con las dos alarmas del programa para casa ya en «tú»); 📋 Notas, 📄 Informe y la fila de la guía de condiciones especiales.
