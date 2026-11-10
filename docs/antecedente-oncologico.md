# Antecedente de cáncer (superviviente) — diseño

Estado: **borrador de diseño (noviembre 2026), sin código.** Petición del usuario tras preparar una primera visita de un paciente de 81 años con un cáncer superado y desacondicionamiento físico, que quiere hacer ejercicio en el gimnasio. 14 decisiones para el usuario (ver «Decisiones»). Hasta que se acepten, nada de esto entra en `data/` ni en la app.

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

- **McNeish 2023** (J Geriatr Oncol, PMID 37776612): solo el resumen. Se cita solo para la asociación de la neuropatía con el equilibrio y las caídas, y con esa salvedad, o se lee entera antes de implementar (decisión 14).
- **Las tablas no llegaron** en Campbell 2019 (la de autorización médica por condición, basada en las guías NCCN) ni en Campbell 2022 (factores de riesgo de complicación esquelética). Hacen falta para cerrar las decisiones 5 y 6.

### Pendiente de leer (no se citan hasta leerlas)

- **NICE NG234** (metástasis vertebrales y compresión medular metastásica, 2023): síntomas que piden urgencia y plazo. Necesaria para la urgencia de la fase 2 (decisión 4). En la web de NICE.
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
- **Neuropatía**: el ejercicio no tiene pruebas sobre la neuropatía (Sturgeon 2023), pero sí los programas de caídas en general.

## Decisiones (cada una con mi recomendación)

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
11. **Precauciones del brazo con linfedema** (manguito de tensión, punciones, presión): prácticas extendidas sin fuente leída. *Recomiendo* no escribirlas hasta leer una fuente.
12. **Payload `on`** y copia en physiq-report. *Recomiendo* sí, con la misma forma que las demás (texto literal fijado en los dos repos).
13. **Bloque «Ejercicio en supervivientes de cáncer»** de la guía de ejercicio, después de la condición y enlazado desde ella. *Recomiendo* sí, en una sesión aparte, con Campbell 2019 y Schmitz 2019 como base y las afirmaciones por nivel.
14. **McNeish 2023**: leer entera antes de citarla o quitarla. *Recomiendo* leerla (está en PMC).

## PDF que necesito

- Guía ESC 2022 de cardio-oncología (Lyon 2022).
- Campbell 2019 y Campbell 2022 completos, con las tablas.

## Siguiente paso

1. El usuario decide sobre las 14 decisiones.
2. Leer NICE NG234 (web), McNeish 2023 (PMC) y los PDF.
3. Texto cerrado para revisión, como en las demás condiciones.
4. Implementación en una rama propia, con tests unitarios (`tests/unit/oncologico.mjs`, incluido «marcar la tarjeta nunca quita ni rebaja una urgencia de otro sistema») y su sección de la prueba de humo.
5. Bloque de la guía de ejercicio (decisión 13), en otra sesión.
