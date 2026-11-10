# Antecedente de cáncer (superviviente) — diseño

Estado: **borrador de diseño (noviembre 2026), sin código; aceptadas por el usuario las 14 recomendaciones (noviembre 2026).** Petición del usuario tras preparar una primera visita de un paciente de 81 años con un cáncer superado y desacondicionamiento físico, que quiere hacer ejercicio en el gimnasio. **Texto cerrado aprobado por el usuario (noviembre 2026)**, con los cambios de NICE NG234 (PDF del usuario, leído en sus capítulos 1.2, 1.3, 1.6 y 1.12; ver «Lectura de NICE NG234»). En implementación.

Reglas, como en las otras condiciones de la Fase P: solo fuentes leídas enteras (en esta sesión o en una anterior, con su nota en `data/referencias.js`); ninguna cifra, umbral ni referencia inventada; ninguna regla automática que no esté medida en las fuentes o decidida por el usuario; lo que no tiene fuente va marcado como **[propia]** y es una decisión del usuario.

## Resumen (lo que hay que saber antes de leer lo demás)

- **El hueco.** La app pregunta a todos por un antecedente de cáncer en el cribado de cada región (sistemas `*_cancer`: `l2`, `cv4`, `h3`…), pero solo como **bandera roja de malignidad**: un «sí» pide buscar el resto (dolor nocturno, pérdida de peso, ganglios). No hay nada para el paciente que **ya tuvo un cáncer, lo tiene tratado y viene a hacer ejercicio**: qué tratamientos cambian la seguridad, qué secuelas cambian la prescripción y qué dosis se recomienda. Tampoco hay ninguna pregunta de **compresión medular metastásica**.
- **Qué cambia la seguridad**, según las fuentes leídas:
  - **Metástasis óseas**: consulta con el equipo médico antes del ejercicio estructurado; evitar movimientos rápidos o cargados al final del recorrido en la zona de la lesión; progresar despacio si no aumenta el dolor (Campbell 2022).
  - **Tratamientos cardiotóxicos** (antraciclinas, trastuzumab, radioterapia con el corazón en el campo), sobre todo con 60 años o más al tratarse: más riesgo cardiaco tardío. La AHA propone valorar la seguridad cardiopulmonar con prueba de esfuerzo, o una marcha de 6 min, antes de la rehabilitación cardio-oncológica (Gilchrist 2019).
  - **Neuropatía por quimioterapia**: peor equilibrio y más caídas en mayores (McNeish 2023, solo resumen); sin pruebas suficientes del efecto del ejercicio sobre ella (Sturgeon 2023).
  - **Radioterapia de mediastino o cuello**: medir la tensión en los dos brazos (Gilchrist 2019).
  - **En tratamiento activo**: la sepsis neutropénica ya está en la app (`hem_5`, NICE CG151).
- **Qué cambia la prescripción**: para la fatiga hace falta intensidad moderada (la baja apenas la reduce); dosis de Campbell 2019 (aeróbico moderado ≥ 3 veces/semana, ≥ 30 min, ≥ 8–12 semanas; fuerza ≥ 2 veces/semana, ≥ 2 series de 8–15 repeticiones a ≥ 60 % de 1RM); el linfedema del brazo tras cáncer de mama tolera fuerza progresiva supervisada; con secuelas o deterioro, programa supervisado por un profesional sanitario (Schmitz 2019).
- **Propongo una condición especial** con la forma de las demás (tarjeta en la fase 1, sistema de la fase 2 que solo aparece con ella, línea en la 4b, recuadro en la 5, aviso y red en la 6, payload, salidas), y **después** un bloque «Ejercicio en supervivientes de cáncer» de la guía «Efectos del ejercicio», enlazado desde el recuadro y la fase 6, como se hizo con el Parkinson (decisión 13 de `docs/parkinson.md`).

## Por qué condición especial y no solo un bloque de la guía de ejercicio

- **La guía de ejercicio no puede hacerlo**: es de solo lectura, nunca marca nada, nunca da una regla de dosificación y nunca llega al payload, a las salidas ni al prompt (`docs/efectos-ejercicio.md`). Lo que pide este paciente es justo lo contrario: preguntas que cambian la seguridad (metástasis óseas, tratamientos cardiotóxicos, compresión medular), avisos en el plan y una red de seguridad. Eso solo lo hace una condición especial.
- **El bloque sí aporta**, pero como lectura: qué hace el ejercicio en la fatiga, la calidad de vida y la función, con el nivel de cada afirmación (`clinico`, `mecanismo`, `discutido`) y frases para explicárselo al paciente. Por eso va después y enlazado, no en lugar de la condición.

## Qué hay hoy en la app

Búsqueda de noviembre 2026 en `data/`:

- **Sistemas `*_cancer` de cada región** (fase 2, para todos los pacientes): antecedente de cáncer (`l2` lumbar, `cv4` cervical, `h3` hombro…; en lumbar, LR+ 15,3 en atención primaria, Downie 2013), dolor nocturno (`l_on2`, `cv1`), pérdida de peso (`cv5`, más del 5 % en 6 meses), ganglios duros y fijos (bandera de hombro). Se quedan como están: son cribado de malignidad para todos.
- **`hem_5`** (sistema hematológico, todas las regiones): en tratamiento contra el cáncer y se encuentra mal o tiene fiebre → urgencia, posible sepsis neutropénica (NICE CG151). **`hem_3`**: infecciones de repetición, pesa en quien recibe quimioterapia.
- **Guía de fármacos, familia de fármacos del hueso** (`data/farmacos.js`): inhibidores de la aromatasa (pérdida de hueso, dolor articular, Irwin 2015; dejarlos se asocia a más recaídas, Hyder 2021), denosumab y bifosfonatos (dolor de muslo o ingle → imagen del fémur; el denosumab no se retrasa).
- **Nada sobre**: compresión medular metastásica, metástasis óseas como condición, cardiotoxicidad tardía, linfedema, neuropatía por quimioterapia, ostomía, ni la dosis de ejercicio en supervivientes.

## Fuentes leídas

### Ya registradas (no se vuelven a citar con otra clave)

- **Downie 2013**, BMJ (PMC3898572): «history of cancer» sube la probabilidad de malignidad al 7–33 %. Registrada (pregunta `l2`).
- **NICE CG151** (sepsis neutropénica, `hem_5`). **Goodman 2018** (sistemas de cáncer). **Finucane 2020** (marco de banderas rojas). **Montero-Odasso 2022** (caídas). Fármacos del hueso: **Fong y Patel 2026**, **Hadji 2025**, **Irwin 2015**, **Hyder 2021**, **Gregson 2025**.

### Nuevas, leídas enteras por un agente en esta sesión (texto completo de PMC, sin las tablas)

- **Campbell 2019** — Campbell KL, Winters-Stone KM, Wiskemann J, et al. Exercise Guidelines for Cancer Survivors: Consensus Statement from International Multidisciplinary Roundtable. Med Sci Sports Exerc. 2019;51(11):2375-90. PMID 31626055, PMC8576825, doi:10.1249/MSS.0000000000002116.
  - Dosis general: «moderate intensity aerobic training at least 3 times per week, for at least 30 minutes, for at least 8–12 weeks. The addition of resistance training … at least 2 times per week, using at least 2 sets of 8–15 repetitions at least 60% of one repetition maximum».
  - Fatiga: el aeróbico moderado 3 veces/semana la reduce; «the effect for low intensity training was weak».
  - Autorización: «no assessments are required to start low intensity aerobic training (i.e., walking or cycling), resistance training with gradual progression, or a flexibility program in most survivors»; los criterios de las enfermedades no oncológicas se siguen aplicando.
  - Linfedema (cáncer de mama): programa progresivo supervisado 2–3 veces/semana, «start low, progress slow», seguro; no se traslada sin más a otros cánceres.
  - Caídas: razonable usar los programas habituales de prevención de caídas. Hueso: fuerza con impacto «may not be safe» con osteoporosis o metástasis óseas en cadera o columna.
  - Tolerancia: ajustar la dosis «even if this means dropping below recommended training volumes».
- **Schmitz 2019** — Schmitz KH, Campbell AM, Stuiver MM, et al. Exercise is medicine in oncology. CA Cancer J Clin. 2019;69(6):468-84. PMID 31617590, PMC7896280, doi:10.3322/caac.21579. Modelo evaluar–aconsejar–derivar; con secuelas, deterioro físico o neuropatía, mejor un programa supervisado por un profesional sanitario.
- **Campbell 2022** — Campbell KL, Cormie P, Weller S, et al. Exercise Recommendation for People With Bone Metastases. JCO Oncol Pract. 2022;18(5):e697-e709. PMID 34990293, PMC9810134, doi:10.1200/OP.21.00454. Valorar el riesgo de complicación esquelética antes; consulta (no «autorización») con el equipo médico; evitar movimientos rápidos o cargados al final del recorrido en la zona de la lesión; cargas bajas y progresar despacio sin aumento del dolor; prevenir caídas.
- **Gilchrist 2019** — Gilchrist SC, Barac A, Ades PA, et al. Cardio-Oncology Rehabilitation to Manage Cardiovascular Outcomes in Cancer Patients and Survivors (AHA). Circulation. 2019;139(21):e997-e1012. PMID 30955352, PMC7603804, doi:10.1161/CIR.0000000000000679. Grupos de más riesgo cardiaco (siguiendo a ASCO); supervivientes a 5 años con 1,3–3,6 veces más mortalidad cardiovascular; prueba de esfuerzo (o marcha de 6 min) antes de la rehabilitación cardio-oncológica; tensión en los dos brazos tras radioterapia de mediastino o cuello; Borg 4–6 (0–10).
- **Sturgeon 2023** — Sturgeon KM, Kok DE, Kleckner IR, et al. Updated systematic review of the effects of exercise on understudied health outcomes in cancer survivors. Cancer Med. 2023;12(24):22278-92. PMID 38018376, PMC10757127, doi:10.1002/cam4.6753. Neuropatía: «insufficient evidence»; caídas: resultados mixtos, sin daño.

### Salvedades de lectura

- **McNeish 2023** (J Geriatr Oncol, PMID 37776612, PMC10841675): **leída entera por un agente (noviembre 2026), sin tablas.** Cambia lo que se esperaba: en 50 supervivientes tratados con quimioterapia (88 % mujeres, 62 % cáncer de mama), la neuropatía autodeclarada **no** se asoció a las caídas («CIPN (p=0.41)…were not significantly associated with falls»); sí lo hizo la función ejecutiva (tiempo de reacción). Se cayó el 34 % en el último año. Limitaciones: un centro, transversal, muestra pequeña, neuropatía sin exploración. No sirve para decir que la neuropatía causa caídas; sí para decir que el riesgo de caídas en estos pacientes es alto y no depende solo de la neuropatía (decisión 14, resuelta).
- **Las tablas no llegaron** en Campbell 2019 (la de autorización médica por condición, basada en las guías NCCN) ni en Campbell 2022 (factores de riesgo de complicación esquelética). Hacen falta para cerrar las decisiones 5 y 6.

### Pendiente de leer (no se citan hasta leerlas)

- **NICE NG234** (metástasis vertebrales y compresión medular metastásica, 2023): síntomas que piden urgencia y plazo. Necesaria para la urgencia de la fase 2 (decisión 4). **Leída (PDF del usuario, noviembre 2026)**: ver «Lectura de NICE NG234».
- **Lyon 2022** (guía ESC de cardio-oncología, Eur Heart J 43(41):4229-361, doi:10.1093/eurheartj/ehac244): sin acceso abierto ni resumen en PubMed. PDF del usuario.
- **Tablas de Campbell 2019 y Campbell 2022**: PDF del usuario.
- **Hipercalcemia maligna** (confusión, sed, estreñimiento): fuente por elegir (StatPearls en NCBI Bookshelf es accesible). Solo si se acepta la decisión 7.
- **Linfedema y celulitis** (urgencia de un miembro rojo y caliente con linfedema): fuente por elegir. Solo si se acepta la decisión 8.

## Criterio de entrada de la Fase P: sí entra

1. **Cambia la seguridad**: metástasis óseas (fractura patológica, compresión medular), riesgo cardiaco tardío por el tratamiento, caídas por neuropatía, sepsis en tratamiento activo (ya en la app), tensión en los dos brazos tras radioterapia de cuello o mediastino.
2. **Cambia la interpretación**: un dolor óseo nuevo no se lee igual; la fatiga del cáncer es un objetivo del ejercicio, no solo un síntoma que frena; la fuerza de prensión y el equilibrio pueden estar bajos por la neuropatía.
3. **Es capa transversal**: cualquier región, cualquier motivo de consulta.

## Principios (los de la Fase P)

1. **Capa transversal, no fase nueva.** El árbol CIF y el motor de puntuación no se tocan.
2. **El fisio no diagnostica ni estadifica el cáncer**, ni ajusta la medicación oncológica (como en la guía de fármacos: nunca aconsejar dejar la terapia hormonal).
3. **La seguridad no se recorta**: urgencias nunca plegadas, sin embudo en modo breve, y marcar la tarjeta nunca quita ni rebaja una `urgencia` de otro sistema (test unitario, como en las demás).
4. **Los sistemas `*_cancer` de cada región no cambian**: siguen siendo el cribado de malignidad de todos los pacientes. La tarjeta no los duplica.
5. **Ninguna regla automática con otras tarjetas**: la osteoporosis por inhibidores de la aromatasa o los corticoides se sugiere, no se marca; la anticoagulación va en su tarjeta.

## Forma propuesta (borrador)

### Fase 1 — tarjeta «Antecedente de cáncer» (`#cardOncologico`)

Después de la de implantes con electrodos.

- **Estado** (decisión 1): «Tratamiento terminado» · «En tratamiento» (incluida la terapia hormonal de mantenimiento). Nada marcado = no consta; segundo toque borra.
- **Qué cáncer** (chips, decisión 2): mama · próstata · colorrectal · pulmón · hematológico · cabeza y cuello · ginecológico · otro · no lo sabe. Sin texto libre.
- **Tratamientos** (chips): cirugía con ganglios extirpados · quimioterapia · antraciclinas o trastuzumab · radioterapia con el corazón en el campo (tórax, mama izquierda, mediastino) · radioterapia de cuello · terapia hormonal · inmunoterapia · no lo sabe. Los dos de radioterapia son los que cambian algo (Gilchrist 2019); el resto se registra para el informe.
- **Metástasis óseas**: No · Sí (dónde, chips: columna · pelvis o cadera · fémur · otras) · No lo sabe.
- **Revisión del corazón tras el tratamiento** (solo con antraciclinas o trastuzumab o radioterapia con el corazón en el campo): Sí, normal · Sí, alterada · No · No lo sabe.
- **Secuelas** (chips): neuropatía · linfedema (miembro) · ostomía · fatiga · osteoporosis. Con «osteoporosis», una línea que lleva a su tarjeta (sin marcarla).
- **Líneas de la tarjeta** (nunca plegadas):
  - Metástasis óseas «Sí» o «No lo sabe» → «Consulta con su equipo médico antes del ejercicio estructurado» (Campbell 2022).
  - Tratamiento cardiotóxico sin revisión del corazón, o «No lo sabe» → «Pide una valoración cardiaca antes del ejercicio moderado» (Gilchrist 2019; redacción y umbral, decisión 5).
  - Radioterapia de cuello o mediastino → «Mide la tensión en los dos brazos» (Gilchrist 2019).

### Fase 2 — sistema «Antecedente de cáncer» (`SIS_ONCOLOGICO`, `transversal_oncologico`)

Solo con la tarjeta marcada, sin embudo en modo breve.

- **Urgencia** (decisión 4, pendiente de NICE NG234): dolor de espalda o cuello nuevo con debilidad, torpeza al andar, adormecimiento o cambios en la vejiga o el intestino → posible compresión medular metastásica, urgencias hoy. Se cruza en el razonamiento con `l6` (cauda equina), `op_u_medula` y `ac_u_espinal`, sin repetirlas.
- **Derivaciones no urgentes**:
  - Dolor óseo nuevo y persistente, que no cambia con la postura o empeora de noche → su oncólogo o médico pronto (razonamiento enlazado a `l2`, `l_on2`, Downie 2013).
  - Síntomas cardiacos nuevos (ahogo, tobillos hinchados, palpitaciones) tras tratamiento cardiotóxico → cardiología (Gilchrist 2019).
  - Hinchazón nueva o que aumenta en un miembro con ganglios extirpados → su médico (decisión 8; fuente pendiente si se quiere urgencia por celulitis).
- **Opcional, decisión 7**: hipercalcemia (confusión, sed, estreñimiento) en metástasis óseas, si se lee una fuente.

### Fase 3

Una línea bajo la matriz de irritabilidad (decisión 9): la fatiga del cáncer no se trata como irritabilidad; se dosifica con la tolerancia de la sesión anterior (Campbell 2019, ajustar la dosis aunque baje del volumen recomendado).

### Fase 4b

Una línea encima de las tarjetas, sin tocar las LR (decisión 10):

- Con metástasis óseas: «Sin movimientos rápidos ni cargados al final del recorrido en la zona de la lesión» (Campbell 2022). Sin thrust en la zona **[propia, decisión 10]**.
- Con neuropatía: las pruebas de sensibilidad y equilibrio pueden estar alteradas por ella; compara con la línea base.
- Con linfedema: **[propia]** sin manguito de tensión ni presión mantenida en ese brazo (decisión 11: hay prácticas extendidas sin fuente leída; no se escribe sin ella).

### Fase 5 — recuadro «Antecedente de cáncer» (`.on-fase5`, nunca se pliega)

- Dosis de Campbell 2019 (aeróbico y fuerza), con «para la fatiga hace falta intensidad moderada; la baja apenas la reduce».
- Programa supervisado por un profesional sanitario con secuelas o deterioro físico (Schmitz 2019).
- Metástasis óseas: consulta médica, qué evitar, progresar sin aumento del dolor, prevenir caídas (Campbell 2022).
- Tratamiento cardiotóxico: grupos de riesgo, valoración cardiopulmonar antes del ejercicio moderado (Gilchrist 2019).
- Linfedema del brazo tras cáncer de mama: fuerza progresiva supervisada, empezar bajo (Campbell 2019); en otros cánceres, sin trasladarlo.
- Neuropatía: equilibrio y prevención de caídas (Campbell 2019; Sturgeon 2023; Montero-Odasso 2022).
- Terapia hormonal: enlace a la familia de fármacos del hueso de la guía de fármacos.
- Con «Sí» en `hem_5`, la urgencia de siempre arriba.

### Fase 6 — plan de tratamiento

- Aviso `oncologico` (dosis, ajuste por tolerancia, programa supervisado) y `oncologicoMetastasis` (qué evitar en la zona de la lesión) con metástasis óseas.
- Red de seguridad `RED_ONCOLOGICO`: síntomas de compresión medular → urgencias; dolor óseo nuevo → su médico; en tratamiento, fiebre o malestar → urgencias o teléfono de oncología.
- Bloque «Ejercicio en supervivientes de cáncer» de la guía de ejercicio (decisión 13), enlazado como los de lupus o Parkinson.

### Salidas

- Payload `on` (decisión 12): estado, cáncer (como texto), tratamientos, metástasis óseas, revisión cardiaca, secuelas.
- 📋 Notas «🎗 ANTECEDENTE DE CÁNCER: …». 📄 Informe «ANTECEDENTE ONCOLÓGICO» (solo el antecedente y las secuelas, sin técnicas). Bloque de la IA `bloqueONIA()` con su copia `_bloqueON` en physiq-report y casos que fijan el texto en los dos repositorios.
- Pendientes del modo breve: metástasis óseas sin registrar; revisión cardiaca sin registrar con tratamiento cardiotóxico.

### Guía de condiciones especiales y hojas

- Fila `oncologico` en `data/condiciones.js` («Márcala si…», sus preguntas y fuentes). Hojas `condiciones`, cribado de las 7 regiones y plan regeneradas con sus cuadernos.

## Contradicciones y huecos entre fuentes

- **Autorización**: Campbell 2019 no pide pruebas para empezar ejercicio ligero en la mayoría; Gilchrist 2019 pide prueba de esfuerzo antes de la rehabilitación cardio-oncológica en los grupos de riesgo. No se contradicen (poblaciones distintas), pero hay que decidir a quién se aplica cada una en la tarjeta (decisión 5).
- **Intensidad inicial**: Campbell 2019 da la dosis objetivo (≥ 60 % de 1RM); en un paciente desacondicionado y mayor, el punto de partida queda por debajo. El consenso no da un punto de partida numérico en el texto leído **[propia: «empezar por debajo y llegar en semanas»]**.
- **Linfedema fuera del cáncer de mama**: sin datos (Campbell 2019 lo dice).
- **Neuropatía y caídas**: se repite que la neuropatía por quimioterapia causa caídas, pero en el único estudio leído no se asoció (McNeish 2023); el ejercicio tampoco tiene pruebas sobre la neuropatía (Sturgeon 2023). Lo que sí sostienen las fuentes es aplicar los programas de caídas habituales (Campbell 2019; Sturgeon 2023).

## Decisiones (cada una con mi recomendación; aceptadas las 14 por el usuario, noviembre 2026)

1. **Estados**: «Tratamiento terminado» y «En tratamiento» (con la terapia hormonal dentro de «En tratamiento»). *Recomiendo* los dos: en tratamiento activo cambian la sepsis y la fatiga; la terapia hormonal dura 5–10 años y la toman muchos supervivientes.
2. **Tipo de cáncer como chips, sin texto libre.** *Recomiendo* chips: el texto libre no cambia nada en la app y arriesga datos identificables.
3. **Nombre**: «Antecedente de cáncer». *Recomiendo* este frente a «Superviviente de cáncer», que no todos los pacientes aceptan para sí.
4. **Urgencia de compresión medular metastásica** en la fase 2. *Recomiendo* sí, tras leer NICE NG234: es la complicación grave que hoy la app no pregunta en ninguna parte.
5. **Valoración cardiaca antes del ejercicio moderado** con tratamiento cardiotóxico y sin revisión posterior (o «No lo sabe»). *Recomiendo* sí, como línea de la tarjeta y no como bloqueo del plan, hasta leer la guía ESC 2022 (PDF), que puede precisar a quién y con qué prueba.
6. **Metástasis óseas: consulta médica** antes del ejercicio estructurado, como línea de la tarjeta y aviso del plan. *Recomiendo* sí (Campbell 2022, recomendación 2); la tabla de factores de riesgo, cuando llegue el PDF, solo añade detalle.
7. **Hipercalcemia** en el sistema de la fase 2. *Recomiendo* no por ahora: es sobre todo del cáncer avanzado, y la confusión ya lleva a urgencias por otros sistemas. Se puede añadir con una fuente leída.
8. **Linfedema que aumenta**: derivación no urgente; **celulitis** sobre linfedema como urgencia solo si se lee una fuente. *Recomiendo* así.
9. **Línea de la fatiga en la fase 3.** *Recomiendo* sí: evita que una fatiga alta se lea como irritabilidad alta y frene el ejercicio que la trata.
10. **Sin thrust en la zona de una metástasis ósea**: no está en las fuentes leídas (Campbell 2022 habla de movimientos rápidos o cargados al final del recorrido). *Recomiendo* escribirlo como **[propia]** con tu visto bueno, o leer una fuente de terapia manual antes.
11. **Precauciones del brazo con linfedema** (manguito de tensión, punciones, presión): prácticas extendidas sin fuente leída. *Recomiendo* no escribirlas hasta leer una fuente. **Respondida en parte** con la tabla 5 de Campbell 2019 (noviembre 2026): la manga de compresión durante el ejercicio, según prefiera el paciente (no hay pruebas a favor ni en contra); el manguito de tensión, las punciones y la presión siguen sin escribirse.
12. **Payload `on`** y copia en physiq-report. *Recomiendo* sí, con la misma forma que las demás (texto literal fijado en los dos repos).
13. **Bloque «Ejercicio en supervivientes de cáncer»** de la guía de ejercicio, después de la condición y enlazado desde ella. *Recomiendo* sí, en una sesión aparte, con Campbell 2019 y Schmitz 2019 como base y las afirmaciones por nivel.
14. **McNeish 2023**: leer entera antes de citarla o quitarla. *Recomiendo* leerla (está en PMC).

## PDF que necesito

- Guía ESC 2022 de cardio-oncología (Lyon 2022).

## Siguiente paso

1. ~~El usuario decide sobre las 14 decisiones.~~ Aceptadas las 14 recomendaciones (noviembre 2026).
2. ~~Leer McNeish 2023~~ (hecho). Leer NICE NG234 (texto o PDF del usuario: la web bloquea la descarga) y los PDF.
3. Texto cerrado para revisión: escrito abajo (noviembre 2026), pendiente de la aprobación del usuario; la urgencia de compresión medular queda abierta hasta leer NICE NG234.
4. Implementación en una rama propia, con tests unitarios (`tests/unit/oncologico.mjs`, incluido «marcar la tarjeta nunca quita ni rebaja una urgencia de otro sistema») y su sección de la prueba de humo.
5. Bloque de la guía de ejercicio (decisión 13), en otra sesión.

## Texto cerrado para revisión (noviembre 2026)

Con las 14 decisiones aceptadas. Lo que va entre comillas es el texto que verá el clínico; **[propia]** marca redacción sin fuente que el usuario aprueba aquí. Manda sobre las secciones de borrador. La urgencia de compresión medular (decisión 4) se cerró con NICE NG234.

### Fase 1 — tarjeta «Antecedente de cáncer» (`#cardOncologico`, después de la de implantes)

- Nota bajo el título: «Márcala si ha tenido un cáncer, aunque esté curado. No sustituye a la pregunta del cribado de cada región, que se hace a todos.» **[propia]**
- Estado (`selectONEstado`, segundo toque borra): «Tratamiento terminado» · «En tratamiento». Ayuda bajo «En tratamiento»: «Incluye la terapia hormonal de mantenimiento (anastrozol, letrozol, exemestano, tamoxifeno, o para la próstata).» **[propia]**
- «¿Qué cáncer?» (chips, varios): Mama · Próstata · Colorrectal · Pulmón · Hematológico · Cabeza y cuello · Ginecológico · Otro · No lo sabe («No lo sabe» excluye los demás).
- «¿Qué tratamientos recibió?» (chips): Cirugía con ganglios extirpados · Quimioterapia · Antraciclinas o trastuzumab · Radioterapia con el corazón en el campo (tórax, mama izquierda, mediastino) · Radioterapia del cuello o del mediastino · Terapia hormonal · Inmunoterapia · No lo sabe.
- «¿Metástasis en los huesos?»: No · Sí · No lo sabe. Con «Sí», «¿Dónde?» (chips): Columna · Pelvis o cadera · Fémur · Otras.
- «¿Le revisaron el corazón después del tratamiento?» (solo con «Antraciclinas o trastuzumab», «Radioterapia con el corazón en el campo» o «No lo sabe» en tratamientos): Sí, normal · Sí, alterado · No · No lo sabe.
- «Secuelas» (chips): Neuropatía (hormigueo o adormecimiento en pies o manos) · Linfedema · Ostomía · Fatiga · Osteoporosis. Con «Linfedema», «¿Dónde?»: Brazo derecho · Brazo izquierdo · Pierna derecha · Pierna izquierda.
- Líneas rojas de la tarjeta (nunca plegadas):
  - Metástasis óseas «Sí» o «No lo sabe»: «Antes del ejercicio estructurado, consulta con su equipo médico (Campbell 2022).» Con «No lo sabe», empieza por «Hasta confirmarlo:».
  - Tratamiento cardiotóxico (antraciclinas o trastuzumab, o radioterapia con el corazón en el campo) con revisión «No», «No lo sabe» o sin responder: «Recibió un tratamiento que puede dañar el corazón años después. Pide una valoración cardiaca antes del ejercicio de intensidad moderada (Gilchrist 2019).» Con «Sí, alterado»: «Sigue los límites de su cardiólogo; si no los tienes, pídeselos antes del ejercicio moderado.» **[propia, la segunda]**
  - Radioterapia del cuello o del mediastino: «Mide la tensión en los dos brazos: la radioterapia puede estrechar la arteria de un lado (Gilchrist 2019).»
  - Osteoporosis en secuelas: «Si tiene osteoporosis, marca también su tarjeta.» con «Ir a la tarjeta →» (no la marca).
  - Terapia hormonal: «Qué vigilar con estos fármacos →», abre la guía de fármacos en la familia de fármacos del hueso.
- `_pintarONUI()` pone `body.oncologico`; un cambio vacía la 4b (`_invalidar4b()`) y repinta el cribado.

### Fase 2 — sistema «Antecedente de cáncer» (`SIS_ONCOLOGICO`, `transversal_oncologico`, `soloOncologico: true`, sin embudo)

- **`on_u_medula`, urgencia** (NICE NG234, 1.3.2 y recuadro 1): «¿Tiene, desde hace poco, dificultad para andar, debilidad en brazos o piernas, adormecimiento u hormigueo, un dolor que baja por un brazo o una pierna, o cambios al orinar o en el control del intestino?» → «Posible compresión medular por metástasis: urgencia oncológica, a urgencias hoy sin demora.» Razonamiento: NG234 1.3.2 («Treat this as an oncological emergency») y recuadro 1 (síntomas y signos de compresión medular); enlazado a `l6`, `op_u_medula` y `ac_u_espinal`, sin repetirlas.
- **`on_u_columna`, urgencia en 24 h** (NICE NG234, 1.3.3 y recuadro 1; sustituye a la derivación `on_d_hueso` del borrador): «¿Tiene un dolor de espalda o de cuello nuevo o que ha cambiado, que es intenso y no cede, va a más, empeora al estar de pie, sentado o al moverse, al toser, estornudar o hacer fuerza en el baño, le despierta por la noche, o le da calambres en las piernas al caminar?» → «Dolor de columna con rasgos de metástasis en alguien con cáncer: valoración por su oncología en 24 h.» Razonamiento: NG234 1.3.3 (consejo del coordinador en 24 h) y 1.3.6 (con dolor lumbar ya estudiado y sin metástasis, explicar qué vigilar y consultar con urgencia si cambia o empeora: por eso «nuevo o que ha cambiado»); el dolor localizado a la presión es un hallazgo de la exploración y va en el razonamiento; enlaza con `l2` (Downie 2013) y `l_on2`/`cv1`.
- **`on_d_hueso`, derivación** (fuera de la columna): «¿Tiene un dolor nuevo en otro hueso (cadera, muslo, brazo, costillas) que no se le pasa?» → «Dolor óseo nuevo con antecedente de cáncer: que lo valore pronto su oncólogo o su médico.» **[propia]**: NG234 trata solo la columna.
- **`on_d_corazon`, derivación** (solo con tratamiento cardiotóxico): «¿Tiene desde hace poco más falta de aire, los tobillos más hinchados o palpitaciones?» → «Síntomas cardiacos tras un tratamiento que puede dañar el corazón: a cardiología antes del ejercicio moderado (Gilchrist 2019).»
- **`on_d_linfedema`, derivación** (solo con «Linfedema» o «Cirugía con ganglios extirpados»): «¿Se le ha hinchado más el brazo o la pierna, o le ha aparecido hinchazón nueva?» → «Linfedema nuevo o que aumenta: que lo valore su médico o su fisioterapeuta de linfedema.» **[propia; decisión 8]** Sin urgencia de celulitis hasta leer una fuente.
- Banderas del sistema, cada una enlazada a su pregunta. Sin hipercalcemia (decisión 7).
- Pendientes del modo breve: «Metástasis óseas sin registrar» y, con tratamiento cardiotóxico, «Revisión del corazón sin registrar».

### Fase 3

`#onNotaFatiga`, bajo la matriz de irritabilidad, con la tarjeta marcada y «Fatiga» en secuelas: «La fatiga del cáncer no es irritabilidad: el ejercicio moderado la reduce, y el suave apenas (Campbell 2019). Dosifica por cómo toleró la sesión anterior.»

### Fase 4b

Línea encima de las tarjetas (`.on-nota-4b`), sin tocar las LR:
- Con metástasis óseas «Sí» o «No lo sabe»: «Metástasis óseas: sin movimientos rápidos ni cargados al final del recorrido en la zona de la lesión (Campbell 2022), y sin thrust en esa zona.» (la última parte, **[propia, decisión 10]**).
- Con «Neuropatía»: «Neuropatía: las pruebas de sensibilidad y equilibrio pueden salir alteradas por ella; compáralas con su línea base.» **[propia]**
- Nada sobre el brazo con linfedema (decisión 11).

### Fase 5 — recuadro «Antecedente de cáncer» (`.on-fase5`, nunca se pliega)

Cabecera con los datos de la tarjeta. Líneas, en este orden (cada una con su fuente al lado, botón de cita):
1. Metástasis óseas: «Consulta con su equipo médico antes del ejercicio estructurado. Evita los movimientos rápidos o cargados al final del recorrido en la zona de la lesión; empieza con cargas bajas y progresa despacio mientras no aumente el dolor; prevén las caídas (Campbell 2022).»
2. Tratamiento cardiotóxico: «Más riesgo cardiaco tardío, sobre todo con 60 años o más al tratarse: los supervivientes a 5 años tienen 1,3–3,6 veces más mortalidad cardiovascular. Antes del ejercicio moderado, valoración cardiopulmonar (prueba de esfuerzo, o marcha de 6 minutos como alternativa) (Gilchrist 2019).»
3. Dosis: «Objetivo: aeróbico moderado al menos 3 veces por semana, al menos 30 minutos, al menos 8–12 semanas; y fuerza al menos 2 veces por semana, al menos 2 series de 8–15 repeticiones al 60 % de 1RM o más. Para la fatiga hace falta intensidad moderada; la suave apenas la reduce. Si no lo tolera, baja la dosis aunque quede por debajo (Campbell 2019).»
4. «Con secuelas o deterioro físico, mejor un programa supervisado por un profesional sanitario que uno comunitario (Schmitz 2019).»
5. Linfedema del brazo: «Tras un cáncer de mama, la fuerza progresiva supervisada de grandes grupos musculares, 2–3 veces por semana, empezando bajo y subiendo despacio, es segura; en el linfedema de otros cánceres no hay datos (Campbell 2019).»
6. Neuropatía o caídas: «Aplica los programas de prevención de caídas habituales (Campbell 2019; Montero-Odasso 2022). En supervivientes tratados con quimioterapia, la neuropatía no se asoció a las caídas en el único estudio leído, y sí la función ejecutiva (McNeish 2023).»
7. Terapia hormonal: «Qué vigilar con estos fármacos →» (guía de fármacos, fármacos del hueso).
8. En tratamiento: «Si se encuentra mal o tiene fiebre, a urgencias o al teléfono de 24 horas de oncología (NICE CG151).»
8 bis. Siempre: «Explícale qué cambios vigilar (dolor de espalda nuevo o que empeora, debilidad, adormecimiento, cambios al orinar) y que consulte con urgencia si aparecen (NICE NG234, 1.3.6).»
9. Enlace al bloque de la guía de ejercicio (decisión 13), cuando exista.

### Fase 6

- `construirPlan({ oncologico })` (null o `{ estado, metastasis, cardiotoxico, revisionCardiaca, linfedema, neuropatia }`):
  - Aviso `oncologico` (cualquier plan): líneas 3 y 4 del recuadro.
  - Aviso `oncologicoMetastasis` (metástasis «Sí» o «No lo sabe»): línea 1.
  - Aviso `oncologicoCorazon` (cardiotóxico sin revisión, o «No lo sabe»): línea 2, con «Hasta tener la valoración, intensidad ligera.» **[propia]**
  - Sin tope de thrust propio salvo la línea de la 4b.
- Red de seguridad `RED_ONCOLOGICO`: «Dificultad para andar, debilidad, adormecimiento, dolor que baja por un brazo o una pierna, o cambios al orinar o en el intestino → urgencias hoy (NICE NG234, 1.3.2). Dolor de espalda o cuello nuevo, intenso, que va a más o le despierta por la noche → su oncología en 24 h (NICE NG234, 1.3.3). En tratamiento, fiebre o malestar → urgencias o teléfono de oncología (NICE CG151).»

### Salidas

- Payload `on` (solo con la tarjeta marcada): `{ es, cn[], tr[], mo, mz[], rc, sc[], li[] }` — estado, cánceres (texto), tratamientos, metástasis óseas, dónde, revisión cardiaca, secuelas, miembro del linfedema.
- 📋 Notas: «🎗 ANTECEDENTE DE CÁNCER: mama · terminado · quimioterapia, antraciclinas o trastuzumab, radioterapia (corazón en el campo) · metástasis óseas: no · corazón revisado: no · secuelas: neuropatía, fatiga».
- 📄 Informe: «ANTECEDENTE ONCOLÓGICO» con el cáncer, los tratamientos y las secuelas; sin técnicas ni recomendaciones de ejercicio.
- Bloque de la IA `bloqueONIA()` (sin citas): los datos de la tarjeta y «Con tratamiento cardiotóxico sin revisión cardiaca, no propongas ejercicio de intensidad moderada sin valoración previa. Con metástasis óseas, nada de movimientos rápidos o cargados al final del recorrido en la zona de la lesión.» `ON_CASOS` fija el texto; copia `_bloqueON` en physiq-report.

### Guía de condiciones especiales y hojas

- Fila `oncologico`: «Qué es: haber tenido un cáncer, aunque esté curado; los tratamientos y sus secuelas cambian el ejercicio.» «Piensa en ella si: ha tenido un cáncer o toma terapia hormonal tras uno.» «Al marcarla, añade: preguntas de metástasis óseas, corazón y linfedema; recuadro con la dosis de ejercicio; avisos y red de seguridad del plan.» Fuentes: Campbell 2019, Campbell 2022, Gilchrist 2019, Schmitz 2019.
- Hojas regeneradas: `condiciones`, cribado de las 7 regiones, `plan`, y sus cuadernos.

### Tests

- `tests/unit/oncologico.mjs`: visibilidad por estado y chips; líneas rojas; «marcar la tarjeta, todos los chips, nunca quita ni rebaja una urgencia de otro sistema»; payload; `ON_CASOS`; nada de la tarjeta en el 📄 Informe salvo el antecedente; ninguna línea sin fuente fuera de las marcadas **[propia]**.
- Prueba de humo, sección `oncologico`.
- Referencias nuevas en `data/referencias.js`: Campbell 2019, Schmitz 2019, Campbell 2022, Gilchrist 2019, Sturgeon 2023, McNeish 2023, NICE NG234 (la clave `Campbell 2020` ya existe y es otro trabajo: estas llevan su año, sin choque) y `docs/referencias.md` regenerado.

## Lectura de NICE NG234 (noviembre 2026)

PDF del usuario (NICE, «Spinal metastases and metastatic spinal cord compression», NG234, publicada el 6 de septiembre de 2023; sustituye a la CG75). Leídos los capítulos 1.2 (información), 1.3 (reconocimiento), 1.6 (movilización) y 1.12 (rehabilitación).

- **Recuadro 1**, factores que sugieren metástasis vertebrales o compresión medular: cáncer pasado, actual o sospechado; dolor con rasgos de metástasis («severe unremitting back pain», «progressive back pain», «mechanical pain (aggravated by standing, sitting or moving)», «back pain aggravated by straining (for example, coughing, sneezing or bowel movements)», «night-time back pain disturbing sleep», «localised tenderness», «claudication (muscle pain or cramping in the legs when walking or exercising)»); síntomas y signos de compresión medular («bladder or bowel dysfunction», «gait disturbance or difficulty walking», «limb weakness», «neurological signs of spinal cord or cauda equina compression», «numbness, paraesthesia or sensory loss», «radicular pain»).
- **1.3.2**: cáncer pasado o actual con síntomas o signos de compresión medular → contacto inmediato, «Treat this as an oncological emergency».
- **1.3.3**: cáncer pasado o actual con dolor de rasgos de metástasis → consejo del coordinador «within 24 hours».
- **1.3.6**: con cáncer y dolor lumbar sin evidencia clínica de metástasis (por ejemplo, imagen previa), explicar qué cambios vigilar y que consulte con urgencia si cambian o empeoran.
- **1.2.2**: que sepan a quién llamar si aparecen síntomas nuevos o empeoran.
- **1.6.2–1.6.4** (movilización tras una compresión medular, en el hospital): vigilar continuamente los síntomas neurológicos y el dolor; si aumentan, volver a la posición en la que ceden y revaluar la estabilidad. Fuera del ámbito de la consulta; no se escribe en la app.
- **1.12.1**: ofrecer rehabilitación desde el diagnóstico, con profesionales sanitarios.

**Qué cambia**: la urgencia de compresión medular queda cerrada (1.3.2); el dolor de columna con rasgos de metástasis pasa de derivación «pronto» a urgencia en 24 h (`on_u_columna`, 1.3.3); se añade la línea 8 bis del recuadro (1.3.6) y la red de seguridad lleva los dos plazos. El dolor óseo fuera de la columna sigue como derivación **[propia]**.

## Lectura de las tablas de Campbell 2019 y 2022 (noviembre 2026)

PDF del usuario de los dos consensos, leídos con sus tablas (las notas del registro dicen ahora «PDF del usuario leído, incluidas las tablas»). Se aplicaron al implementar, aprobados por el usuario, con las mismas reglas.

- **Campbell 2019, tabla 4** (triaje adaptado de la NCCN): sin comorbilidad, ninguna valoración médica más antes del ejercicio; con neuropatía periférica, artritis o problemas musculoesqueléticos, hueso frágil o linfedema, valoración médica recomendada, adaptar el ejercicio a lo que se encuentre y valorar derivar a personal formado (incluye fisioterapeutas); con cirugía de pulmón o abdomen, ostomía, enfermedad cardiopulmonar, ataxia, fatiga extrema, déficit nutricional grave, empeoramiento (por ejemplo, del linfedema) o metástasis óseas, valoración y autorización médica previas y derivación a personal formado.
- **Campbell 2019, tabla 5** (precauciones por secuela): hueso frágil o metástasis óseas, sin impactos, sin flexión ni extensión extremas del tronco, sin flexión ni extensión del tronco con carga y sin giros bruscos, prevenir las caídas y, si refiere dolor, que lo valore el equipo médico antes de seguir; ostomía, vaciar la bolsa antes, fuerza con poca resistencia y progresión lenta, sin Valsalva, adaptar los ejercicios de tronco que den presión o abombamiento, y más riesgo de deshidratación con ileostomía; neuropatía periférica, valorar estabilidad, equilibrio y marcha antes, bicicleta estática o agua mejor que caminar si afecta a la estabilidad (o cinta con barandillas), máquinas mejor que pesos libres, mancuernas recubiertas o guantes acolchados; linfedema, la manga de compresión durante el ejercicio según prefiera (pruebas insuficientes); mayores, valorar condición física y función antes de empezar.
- **Campbell 2022, tabla 1, DR3** (89 % de acuerdo): con metástasis óseas, la orientación médica antes de un programa estructurado es imprescindible con lesiones inestables o de estabilidad desconocida, dolor óseo o su tratamiento en los últimos 3 meses, o una fractura por la enfermedad en el último año; «con precaución» se definió sobre todo (47 %) como empezar con movimiento activo sin carga y progresar despacio si no aumenta el dolor ni aparecen síntomas.

**Qué cambia**: una línea nueva del recuadro de la fase 5, tras la de metástasis, con el triaje de la tabla 4, y una línea roja de la tarjeta con «Ostomía»; la línea de metástasis de la tarjeta y la 1 del recuadro dicen cuándo la consulta es imprescindible (DR3) y la 1 cómo empezar; la lista de qué evitar de la tabla 5 entra en la línea de la 4b, en la 1 del recuadro y en el aviso `oncologicoMetastasis`, con «si refiere dolor óseo, que lo valore su equipo médico antes de seguir»; línea propia de la ostomía en el recuadro (sustituye a la frase [propia] del borrador); la 6 (neuropatía) pasa a la tabla 5 más los programas de caídas y McNeish 2023; la 5 (linfedema) añade la manga de compresión; la 4 (programa supervisado) añade la valoración de la condición física y la función antes de empezar. Sturgeon 2023 deja de citarse en el texto final y sale del registro hasta que se use.

