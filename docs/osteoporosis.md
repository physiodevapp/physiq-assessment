# Osteoporosis o fragilidad ósea — diseño (borrador)

Estado: **borrador de diseño (octubre 2026), sin código. Aceptadas por el usuario las 14 recomendaciones** (ver «Decisiones aceptadas»). PDF de la decisión 13 en tandas: **tanda 1 leída** (Puentedura 2015 y Giangregorio 2014; **aceptados los cambios C1–C7 y la decisión 15**) y **tanda 2 leída** (Hadji 2026; **aceptados H1–H5**). Con eso están leídos los tres PDF mínimos de la decisión 13. **Tanda 4 leída** (Giangregorio 2015, Gibbs 2019, Kovacs y Ralston 2015, Hardcastle 2022 y Sherrington 2019), con 6 cambios (T1–T6) pendientes. **Tanda 3 leída** (Maitland 2005, cap. 9 entero): pasaje de la decisión 6 comprobado en la p. 223, con 2 cambios (M1 corrección; **M2 aceptado**). **Diseño cerrado: listo para implementar**; quedan solo PDF opcionales. Ver «Lectura de los PDF». Es la siguiente condición especial de la Fase P (`MIGRATION_PLAN.md`, «Próximas condiciones especiales»), después del trastorno mastocitario (`docs/mastocitaria.md`). Incluye la **osteoporosis asociada al embarazo y la lactancia** (PLO, por sus siglas en inglés), por el caso del usuario: una paciente que, tras el parto y probablemente por la lactancia, desarrolló una osteoporosis con fisuras en cuerpos vertebrales torácicos.

**Qué hay hoy en la app** (búsqueda de octubre 2026 en `data/` y `formularios/`):
- **Cribado de la fase 2**:
  - `l_e4` (lumbar, `l_espondilo`): «¿Tiene diagnóstico de osteoporosis, o ha tenido una fractura reciente ante un golpe menor o sin trauma aparente?», con razonamiento completo (Finucane 2020, Downie 2013). Es la única pregunta de osteoporosis de la app, y solo sale en lumbar.
  - `ca_os2` (cadera): corticoides prolongados, alcohol o lupus, para la osteonecrosis.
  - La nota «(Tener en cuenta la osteoporosis.)» de `h_t1` (hombro, caída).
  - `cv_ar3` (cervical, traumatismo en la persona mayor).
  - `tp_o2` (tobillo y pie, más de dos fracturas de estrés → densidad ósea).
- **Banderas**:
  - lumbar: «Fractura patológica ante trauma menor o fragilidad ósea» (`l_cancer`) y dos enlazadas a `l_e4` (`l_espondilo`);
  - cadera: la fractura de estrés del sacro, que ya nombra «osteoporosis, embarazo o posparto» (`ca_oseo`).
- **Lupus**: la tarjeta pregunta los corticoides en tramos (≤5 · >5–20 · >20 mg/día). Su línea de la 4b dice que con corticoides «el hueso es más frágil» (Yasir 2023; Goodman 2018, cap. 12, p. 445). `les_d_osteonecrosis` deriva la osteonecrosis.
- **Formulario previo lumbar**: «¿Está embarazada, o ha dado a luz en el último año?» (`embarazo`), enlazado como pista al paso `lu_step4`.
- **Panel de tiempos de tejido**: `fx_vertebral_compresion` («Vertebral por compresión, sin cirugía», Donnally 2025 · Margetis y Patel 2025 · Yuan 2016). Ninguna hipótesis la enlaza, así que nunca sale en «Este paciente».
- **Fase 6**: ningún aviso de osteoporosis. `docs/plan-tratamiento.md` ya recoge de Maitland 2005 (cap. 9, p. 223) «sin manipulación forzada con osteoporosis… la movilización suave sí puede ser adecuada», pero ese texto no llegó a ningún aviso (el aviso `manipulacionCervical` solo nombra los signos de dos raíces y los medulares).
- **Ninguna región torácica.** La silueta de la fase 2 dibuja la columna torácica punteada y sin toque. Una fractura vertebral torácica, la de la paciente del usuario, se valora hoy desde lumbar o cervical (ver «Fuera de este diseño»).

## Decisiones aceptadas (octubre 2026)

El usuario aceptó las 14 recomendaciones de «Decisiones»:

1. Entra, como capa transversal con documento propio.
2. **Forma 3**: tarjeta con «Diagnosticada» y «Sospecha» y su sistema en la fase 2.
3. «Sospecha» con la regla del NOGG (50 años o más y un factor) y los 6 factores elegidos; la app nunca calcula el FRAX.
4. `op_d_fractura` como `derivacion`, con «sin terapia manual ni carga en esa zona hasta entonces».
5. La derivación por corticoides sin protección ósea (`op_d_corticoides`).
6. Manipulación forzada fuera del plan de la fase 6 (Maitland 2005, cap. 9, p. 223), tras volver a comprobar el pasaje.
7. El campo `cargaOsea: true` en los tests de la tabla, con la línea de técnica.
8. El bloque de caídas con las preguntas de NICE NG249, sin puntuar riesgo. La velocidad de marcha, como medida opcional.
9. Ninguna regla automática con otras tarjetas; solo texto (recordatorio en el recuadro del lupus, mastocitosis sistémica).
10. La fractura vertebral en «Este paciente» del panel de tiempos, y la revisión de su nota en otra PR (Fase J).
11. Payload `op` y la PR de physiq-report después.
12. La PLO como causa dentro de la tarjeta; su sospecha en la futura «Embarazo y posparto»; mientras tanto, un párrafo en `l_e4` y la pista en la guía. La app nunca aconseja el destete, y lo de cargar al bebé va como extrapolación marcada.
13. Pedir en PDF Hadji 2026, Puentedura 2015 y Giangregorio 2014 como mínimo. El usuario los pasa en tandas.
14. Registrar solo las referencias que use el texto final.

## Lectura de los PDF (octubre 2026)

### Tanda 1: Puentedura 2015 y Giangregorio 2014

Leídos enteros en PDF del usuario, incluidas las tablas y sin la bibliografía. Las figuras de Puentedura 2015 (técnicas) se vieron solo por sus pies.

**Puentedura EJ, O'Grady WH. Safety of thrust joint manipulation in the thoracic spine: a systematic review.** *J Man Manip Ther* 2015;23(3):154–161 (clave propuesta `Puentedura 2015`).
- **Qué es**: una revisión sistemática de casos publicados de efectos adversos graves tras el thrust torácico (1950–2015). Son 10 casos en 7 artículos:
  - lesión de la médula en 7, neumotórax o hemotórax en 2 y fuga de LCR en 1;
  - entre los casos con lesión medular, un colapso de T4–T5 con compresión medular (mujer de 60 años) y una fractura de T4 con cáncer de pulmón (71 años) (tabla 3).
- **Tabla 1, contraindicaciones absolutas del thrust torácico**. Bajo «Bony issues»:
  - «Metabolic, e.g. osteomalacia, osteoporosis»;
  - «Iatrogenic, e.g. long-term corticosteroid medication»;
  - «Traumatic, e.g. fracture».
  
  Bajo «Vascular issues», «Bleeding diatheses, e.g. haemophilia, anticoagulant therapy».
- **Tabla 2, precauciones relativas**: «Minor osteoporosis», «Serious kyphosis and scoliosis», «Hypermobility or ligamentous laxity».
- **De dónde salen las dos tablas**: «have been identified to assist clinicians with decision-making» con la referencia 25 de los autores, Gatterbauer A. *Contraindications in osteopathy* (Viena, 2009), un trabajo de una escuela de osteopatía, no una guía. No lo he leído.
- **Qué dice el texto**: «Thrust joint manipulation should never be performed when contraindications or precautions are present». En la discusión: «The most common preexisting conditions were likely to be metabolic pathologies such as osteopenia or osteoporosis. These conditions are clear contraindications to TJM and should have been easily identifiable through a detailed patient history». Los mismos autores dicen antes que los casos no traían información suficiente para saber si había contraindicaciones, así que ese «likely» es una suposición.
- **Biomecánica** (introducción, citando otros estudios):
  - el pico de carga de un thrust posteroanterior torácico fue de 562,68 N (Gudavalli 2014);
  - la carga posteroanterior con la que se rompe en el laboratorio una vértebra torácica media fue de 479 N de media (200–728 N) (Sran 2004).
  
  Los autores dicen que esto «may raise some concerns about the strength and depth of TJM techniques in the thoracic spine».
- **Contradicción interna**: la tabla 1 pone la osteoporosis como contraindicación absoluta, y la tabla 2, la «minor osteoporosis» como precaución relativa; la discusión añade la osteopenia como «clear contraindication». El texto dice que tampoco se manipule con precauciones, así que en la práctica las tres llevan a lo mismo: sin thrust.
- **Coincide con Maitland 2005** (cap. 9, p. 223: sin manipulación forzada con osteoporosis) y es más estricto: no deja el thrust ni con una osteoporosis leve. Maitland deja abierta la movilización suave; Puentedura 2015 no habla de la movilización.

**Giangregorio LM, Papaioannou A, MacIntyre NJ, et al. Too Fit To Fracture: exercise recommendations for individuals with osteoporosis or osteoporotic vertebral fracture.** *Osteoporos Int* 2014;25(3):821–835 (clave propuesta `Giangregorio 2014`).
- **Qué es**: un consenso internacional con GRADE para mayores de 65 años con osteoporosis, con o sin fractura vertebral. Lo avalan Osteoporosis Canada, la National Osteoporosis Foundation y Osteoporosis Australia. «We strongly recommend» = fuerte; «We recommend» = condicional.
- **Calidad de la evidencia** (tabla 2):
  - caídas, alta con osteoporosis y moderada con fractura vertebral;
  - fracturas, muy baja;
  - densidad ósea, baja o muy baja;
  - daños, dolor y calidad de vida, muy baja;
  - movilidad, baja.
- **Recomendaciones** (tabla 4):
  - **fuerte**: un programa multicomponente con fuerza y equilibrio, con o sin fractura vertebral;
  - **condicional**: no hacer solo aeróbico, sin fuerza ni equilibrio;
  - con fractura vertebral, «Consultation with a physical therapist is recommended to ensure safe and appropriate exercise».
- **Fuerza** (texto y tabla 6):
  - al menos 2 días por semana;
  - un ejercicio por cada grupo muscular grande, 2 series de 8–12 repeticiones máximas;
  - quien empieza o tiene más riesgo, con menos intensidad;
  - «Resistance training machines should be avoided in individuals at high risk of vertebral fracture unless there is certainty that they can be used and adjusted with proper form», porque a menudo obligan a flexionar y girar el tronco;
  - «Slow, controlled movements are recommended»;
  - extensores de la columna y educación postural.
- **Equilibrio**, recomendación fuerte: «daily balance training … and aim to accumulate 2 h of balance training weekly (~15–20 min per day)». Puede hacerse en tramos o dentro de las actividades del día, de lo estático a lo dinámico, con algo donde apoyarse y en suelo blando (tabla 5).
- **Aeróbico**: 150–300 min por semana de intensidad moderada, mejor con carga. «For individuals at high risk of vertebral fracture, the risks associated with these exercise types [jumping, running], or vigorous exercise in general, may outweigh the benefits». No hacer ejercicio fuera con lluvia o hielo; tener un plan para hacerlo dentro.
- **Daños**: hay fracturas al girarse de boca arriba a boca abajo y al caerse una pesa sobre el pie, y más riesgo de fractura con «performing twisting movements too quickly during transitions between positions» o caminando con el suelo resbaladizo.
- **Precauciones para todos**: «all individuals with osteoporosis should learn how to move safely or take precautions when performing twisting or bending during transitions between movements, when working with loads, when performing movements that challenge balance, or when performing activities outdoors in slippery weather».
- **No habla de la terapia manual.** Solo cita, en la bibliografía, un ensayo piloto de ejercicio y terapia manual tras la fractura vertebral (Bennell 2010), sin comentarlo.

### Qué cambia en el diseño (propuestas; cada una con mi recomendación)

**C1. Sin thrust en la fase 6: dos fuentes en vez de una** (decisión 6).
- La regla pasa a citar Maitland 2005 (cap. 9, p. 223) y Puentedura 2015 (tabla 1 y discusión).
- El texto dirá «sin manipulación con thrust en la columna ni en las costillas; la movilización suave puede ser adecuada». Lo primero viene de las dos fuentes; lo segundo, solo de Maitland 2005.
- *Recomiendo el cambio.*

**C2. La línea `cargaOsea` gana un porqué** (decisión 7). En su «¿Por qué?», no en la línea:
> «Un empuje posteroanterior fuerte en la columna torácica puede llegar a la carga con la que se rompe una vértebra torácica en el laboratorio (Puentedura 2015, citando a Sran 2004).»

La línea de la 4b sigue siendo redacción propia. Las cifras son de cadáver y de thrust, no de los tests, así que solo van en el razonamiento. *Recomiendo el cambio.*

**C3. Equilibrio: a diario, unas 2 h por semana, para todos.**
- Giangregorio 2014 lo recomienda con fuerza: 15–20 min al día, hasta unas 2 h por semana.
- Brooke-Wavell 2022 pide «al menos dos veces por semana» para todos [C] y 3 h por semana a quien ya se cae [E].
- *Recomiendo*: «equilibrio a diario, 15–20 min (unas 2 h por semana; Giangregorio 2014); con caídas, 3 h por semana durante al menos 4 meses (Brooke-Wavell 2022)». Va en el recuadro de la fase 5, el aviso de la fase 6 y el resultado del bloque de caídas cuando no hay caídas. Ver la contradicción 12.

**C4. La torsión: suave, lenta y con cuidado en las transiciones.**
- Brooke-Wavell 2022 dice que es segura «if performed smoothly and comfortably» [C].
- Giangregorio 2014 recoge fracturas al girarse demasiado rápido entre posturas y pide precaución al girarse y agacharse en las transiciones y con cargas.
- No se contradicen: las dos piden suavidad.
- *Recomiendo*: «la torsión, suave y controlada; cuidado al pasar de tumbado a sentado o al darse la vuelta, y con peso en las manos (Brooke-Wavell 2022; Giangregorio 2014)». Ver la contradicción 6.

**C5. Fuerza: «2 series, hasta 3», movimientos lentos y controlados, y sin máquinas que obliguen a flexionar o girar el tronco si el riesgo de fractura vertebral es alto.**
- Las 2 series son de Giangregorio 2014; las 3, de Brooke-Wavell 2022.
- *Recomiendo el cambio*, en el recuadro de la fase 5 y el aviso de la fase 6.

**C6. Suelo resbaladizo.** Una línea en el aviso de la fase 6 y en el programa para casa: «con lluvia o hielo, el ejercicio mejor dentro de casa» (Giangregorio 2014). *Recomiendo el cambio.*

**C7. Con fractura vertebral, consultar al fisioterapeuta**: lo dicen las dos guías (Giangregorio 2014, tabla 4; Brooke-Wavell 2022, recuadro 1 [C]). Solo cambia la cita. *Recomiendo el cambio.*

**Decisión nueva 15. ¿El tope «sin thrust» también fuera de esta tarjeta?** Puentedura 2015 (tabla 1) pone como contraindicación absoluta del thrust torácico:
- los corticoides a largo plazo, sin dar una dosis;
- el tratamiento anticoagulante;
- y, como precaución relativa, la hipermovilidad.

La app ya tiene esos datos en otras tarjetas: la fila de corticoides y la casilla «anticoagulante o antiagregante» del lupus, y la tarjeta de hipermovilidad.
- *Recomiendo* aplicar el tope «sin thrust» de la fase 6 también con la tarjeta del lupus cuando los corticoides no estén en «No» o haya dosis altas previas, y con la casilla del antitrombótico.
  - No marca ninguna tarjeta ni cambia nada fuera del plan, así que no contradice la decisión 9.
  - Mi reserva: las tablas de Puentedura 2015 vienen de un trabajo de osteopatía (Gatterbauer 2009) que no he leído, y el antiagregante no está en su lista (solo el anticoagulante). Por eso propongo la casilla tal cual, sin separar el antiagregante, y que la tarjeta del anticoagulado lo revise.
- Con la hipermovilidad, *recomiendo* no tocar nada: Maitland 2005 ya dice que una articulación hipermóvil no se manipula con fuerza (`docs/plan-tratamiento.md`), y es una precaución relativa.
- *Alternativa*: dejar el tope solo para esta tarjeta y llevar el resto al diseño del paciente anticoagulado.

**Aceptados por el usuario (octubre 2026): C1–C7 y la decisión 15** (el tope «sin thrust» de la fase 6 también con la tarjeta del lupus cuando los corticoides no estén en «No» o haya dosis altas previas, y con la casilla del antitrombótico).

### Tanda 2: Hadji 2026

**Hadji P, Athanasiadis A, Brandi ML, et al. Pregnancy- and lactation-associated osteoporosis: a position statement of the IAPM, IOF, ECTS, ESCEO, IMS, and EMAS.** *Int J Gynaecol Obstet* 2026 (en línea antes de imprimir, pp. 1–13). [doi:10.1002/ijgo.71203](https://doi.org/10.1002/ijgo.71203) (clave propuesta `Hadji 2026`). Acceso abierto (CC BY).
- **Cómo se leyó**: PDF del usuario, entero salvo la bibliografía. Las figuras 2 (diagnóstico) y 3 (manejo), que son algoritmos, se miraron como imagen.
- **Qué es**: la declaración de posición de seis sociedades de obstetricia, hueso y menopausia. Es una revisión narrativa y **sin graduar**: «were not assessed or graded for level of evidence»; las recomendaciones de tratamiento «are not intended as formal evidence-based guidelines». Entre los autores están Zanchetta (Scioscia 2023) y Kyvernitakis (la serie de Fráncfort que citan Gak 2024 y Anagnostis 2024). Varios autores declaran honorarios de empresas de fármacos para la osteoporosis.

**Qué aporta al diseño**:
- **Sospecharla y derivar**: «Women with severe and persistent back pain during pregnancy or lactation should be referred for further specialist diagnostic procedures» (sección 5; fig. 2, primera casilla). Es la primera fuente leída que convierte la sospecha en una recomendación. Apoya directamente la pregunta de «Embarazo y posparto» (decisión 12).
- **La exploración**: la valoración inicial incluye «documentation of height for clinical signs of fracture». Los signos de fractura «might include a height loss of ≥3 cm». La embarazada con esos signos, a RM sin contraste. Es **un umbral distinto** del de la osteoporosis general (≥ 4 cm, Gregson 2025): ver la contradicción 1.
- **Dónde**: «Commonly, fractures occur in the thoracic and/or in the lumbar spine, indicating the need for evaluation of both». Confirma la contradicción 14 (no darla por lumbar).
- **El retraso**: «Many patients report multiple consultations before finally being correctly diagnosed with PLO». En la conclusión: «in the majority of cases, is identified late».
- **Cuándo y quién**: en el último trimestre y en la lactancia, sobre todo en el primer embarazo, «rarely in the second or third».
- **Factores de riesgo**:
  - menos actividad física antes y después de la pubertad, y menos movilidad en el embarazo (un estudio de casos y controles, 102 frente a 102);
  - problemas dentales en la infancia;
  - antecedentes familiares;
  - diabetes de tipo 1, artritis reumatoide, anorexia;
  - trastornos de la ovulación y tratamientos de fertilidad;
  - la **heparina de bajo peso molecular, «widely used in pregnancy»**, los corticoides y otros fármacos;
  - formas monogénicas (osteogénesis imperfecta; COL1A1, COL1A2, LRP5, WNT1), con estudio genético «if available».
- **La osteoporosis transitoria de cadera**: «is distinct from PLO» (edema localizado en la RM, no resorción del esqueleto; dolor de cadera, a menudo de un lado, que suele curar sola tras el parto). Ante dolor de cadera con alteración de la marcha en el embarazo, «should be considered as an alternative diagnosis». Toma partido en la contradicción 18, con Anagnostis 2024 y contra Gak 2024 y Carsote 2023.
- **El manejo** (sección 6 y fig. 3):
  - calcio de 1000 a 2000 mg/día y vitamina D de 1000 a 2000 UI/día;
  - **«Pain medication/physiotherapy, if necessary»**; en el texto, con una sola fractura, «pain medication and later physiotherapy can be employed, if necessary». **No dice qué fisioterapia** ni cuándo empezarla;
  - **el destete**: en el texto, «might be encouraged to consider limiting/stopping breastfeeding»; en la fig. 3, «Stop breastfeeding as soon as possible». Ver la contradicción 15;
  - fármacos solo de forma individual, fuera de ficha técnica y con anticoncepción; los bifosfonatos, mejor evitarlos, porque cruzan la placenta.
- **Pronóstico**:
  - en una cohorte de 107 mujeres con PLO, a los 6 años «almost 25% of these patients had sustained a subsequent fracture», más cuantas más fracturas al diagnóstico;
  - **si hay más riesgo en el siguiente embarazo «is still unclear»** (sección 7). Ver la contradicción 16;
  - la densidad suele volver a la de antes del embarazo al año del destete;
  - la lactancia, en general, no deja efectos negativos a largo plazo en el esqueleto.
- **Nada sobre ejercicio, carga, postura ni cómo coger al bebé.** La salvedad de lectura sigue en pie: lo que diga la app de eso es extrapolación.

### Qué cambia con la tanda 2 (propuestas; cada una con mi recomendación)

**H1. La pregunta de sospecha de «Embarazo y posparto» se apoya en Hadji 2026** (decisión 12). Borrador nuevo:
- Pregunta: «¿Tiene un dolor de espalda intenso y que no se le pasa, dorsal o lumbar, en el embarazo o desde el parto, o ha perdido 3 cm o más de altura?»
- `derivacion`: «Posible fractura vertebral por osteoporosis del embarazo o la lactancia: valoración médica especializada pronto. Hasta entonces, sin terapia manual ni carga en la espalda.»

Fuentes: Hadji 2026, secciones 4.3 y 5; Scioscia 2023. La segunda frase de la derivación es la misma de `op_d_fractura` (decisión 4). *Recomiendo el cambio.* Se aplica cuando se haga la tarjeta «Embarazo y posparto».

**H2. Mientras tanto, el párrafo de `l_e4`** (decisión 12) cita Hadji 2026: dolor de espalda intenso y persistente en el embarazo o la lactancia → valoración especializada. *Recomiendo el cambio.*

**H3. La línea de la PLO en la fase 5** queda así:
> «Con las fracturas consolidadas, a los 3–6 meses, actividad en carga y de fuerza razonable, sin excesos (Scioscia 2023). Fisioterapia cuando el dolor lo permita (Hadji 2026). Al coger y cargar al bebé, la misma bisagra de cadera (extrapolado de Brooke-Wavell 2022). La lactancia, los fármacos y otro embarazo los decide con su médico.»

*Recomiendo el cambio.* La de «puede repetirse en otro embarazo» se va, porque la declaración dice que no se sabe (H4).

**H4. Recurrencia: sin cifra y sin afirmar que se repite en otro embarazo.** El texto de la app (recuadro de la fase 5 y bloque de la IA) dirá:
> «Tras una PLO pueden aparecer nuevas fracturas, más si hubo varias al principio; si hay más riesgo en otro embarazo no está claro: que lo hable con su médico (Hadji 2026; Anagnostis 2024).»

*Recomiendo el cambio.*

**H5. La osteoporosis transitoria de cadera fuera de la PLO.** En «Embarazo y posparto» irá como diagnóstico aparte (Hadji 2026; Anagnostis 2024), no como forma de la PLO. *Recomiendo el cambio.*

### Tanda 3: Maitland 2005, cap. 9

**Maitland GD; Hengeveld E, Banks K, English K (eds.). *Maitland's Vertebral Manipulation*, 7.ª ed. Elsevier Butterworth-Heinemann, 2005. Cap. 9 «Application of techniques» (con B. C. Edwards), pp. 213–228** (ya registrada como `Maitland 2005`).
- **Cómo se leyó**: PDF del usuario, que es solo imagen. Lo he leído página a página. **Falta la p. 224** (vértigo e hipermovilidad), que no interviene en este diseño.
- **El pasaje de la decisión 6 está en la p. 223**, no en las pp. 222–223 como decía este documento (lo tomé de `docs/plan-tratamiento.md`, que agrupa varios temas de esas dos páginas). Apartado «Radiological changes», literal:
  - «Osteoporosis and rheumatoid arthritis are two conditions that should preclude forceful manipulation, yet both conditions can be present in a patient who has pain that can be relieved by mobilization.»
  - «There are no signs to warn the physiotherapist that an osteoporotic bone or diseased ligament is about to give way under the strain; therefore, forcible manipulation must never be used. However, it is wrong to preclude gentle mobilization.»
  - **Recuadro**: «Two techniques that should be performed with great care are cervical rotation in the presence of marked rheumatoid arthritis changes, and **rib pressure in the presence of osteoporosis**.»
  - «Rib pressures used to manipulate the costovertebral joints may fracture an osteoporotic rib.»
- **Contexto en las pp. 222–223** («Contraindications»):
  - el médico excluye de la manipulación, entre otras, la enfermedad de Paget, la artritis reumatoide, la osteomielitis, la espondilitis anquilosante y la malignidad;
  - «Some conditions may be contraindications to manipulation, but not necessarily to mobilizations»;
  - la gentileza de la movilización y la evaluación continua eliminan «most of the possible dangers».
- **Otros pasajes útiles**:
  - p. 217: la profundidad de la movilización la deciden el dolor, el espasmo, la resistencia y las «pathological contraindications»; con dolor fuerte, signos neurológicos o espasmo, técnica suave;
  - p. 220: la manipulación «is similar to a grade IV mobilization in amplitude and position in range» y solo cambia la velocidad; «In most clinical circumstances, symptoms can be relieved by mobilization without having to resort to manipulation»;
  - p. 225: «the dangers of manipulation increase as the strength of the technique increases».
- **Coincide con Puentedura 2015** (sin thrust con osteoporosis) y **añade dos cosas**:
  - que la movilización suave sí se puede hacer;
  - un cuidado concreto: **la presión sobre las costillas**.

### Qué cambia con la tanda 3 (propuestas)

**M1. Corrección de la cita**: «Maitland 2005, cap. 9, p. 223» en todo el documento (ya hecha) y en los textos de la app. No es una decisión. `docs/plan-tratamiento.md` dice «pp. 222–223» para un párrafo que mezcla varios temas; esa cita sigue siendo correcta para el conjunto.

**M2. La línea `cargaOsea` deja de ser solo redacción propia** (decisión 7). Texto propuesto:
> «Osteoporosis: este test carga el hueso, y no hay ningún signo que avise de que un hueso osteoporótico va a ceder (Maitland 2005, cap. 9, p. 223). Con una fractura vertebral reciente o sospechada en la zona, no lo hagas hasta que la valore el médico; si no, con fuerza progresiva y sin empujes bruscos.»

En los tests de la 1.ª costilla (`h9`, `ce10`) se añade: «La presión sobre las costillas puede romper una costilla osteoporótica: con mucho cuidado (ídem).»

La parte de la fractura vertebral sigue apoyándose en Downie 2013 y en la derivación de `op_d_fractura`. *Recomiendo el cambio.*

### Tanda 4: Giangregorio 2015, Gibbs 2019, Kovacs y Ralston 2015, Hardcastle 2022 y Sherrington 2019

Leídos enteros en PDF del usuario, con las tablas que salían mal en el texto comprobadas sobre la imagen. Los leyeron siete subagentes, y yo comprobé en el texto los pasajes que se usan abajo. Las ediciones *online first* (Giangregorio 2015, Kovacs y Ralston 2015, Hardcastle 2022) no traen la paginación de la revista: se citan por sección o tabla.

**Giangregorio LM, McGill S, Wark JD, et al. Too Fit To Fracture: outcomes of a Delphi consensus process on physical activity and exercise recommendations for adults with osteoporosis with or without vertebral fractures.** *Osteoporos Int* 2015;26(3):891–910 (clave propuesta `Giangregorio 2015`).
- **Qué es**: un Delphi de dos rondas, con una respuesta del 52 % y del 69 %, sin umbral de consenso fijado y con un acuerdo del 65 al 95 %. Parte de tres casos: osteoporosis por densitometría, una fractura vertebral, y varias fracturas con dolor e hipercifosis. Es opinión de expertos.
- **Fuerza**: al menos 2 días por semana, 8–12 repeticiones máximas, 1–3 series (se empieza con 1). Con fractura vertebral, la forma y la alineación antes que la intensidad.
- **Equilibrio**: a diario, unas 2 h por semana.
- **Aeróbico**: 150 min por semana; con fractura vertebral, moderado, no vigoroso.
- **Impacto**: con fractura vertebral, saltar o correr «may need to be avoided», sin dosis.
- **Flexión y torsión**: se evitan cuando son rápidas, repetidas, con carga o al final del recorrido, no en sí mismas. «Modify activities that flex (bending forward) or twist». Rechaza los límites de peso («lifting <10 lbs, no twisting») y propone la bisagra de cadera y girar dando pasos. «Avoid lowering or lifting from the floor – store at waist height».
- **Extensores**: isometrías diarias en posición neutra. **Se contradice**: 3–5 s en la tabla 4 y 5–10 s en el recuadro 2.
- **Talla**: «6 cm of historic height loss or 2-cm measured height loss» como motivo para pedir una radiografía. Es otro umbral más (contradicción 1).
- **Nada sobre terapia manual**, la fractura aguda ni el corsé. Con cualquier fractura vertebral, consultar al fisioterapeuta.

**Gibbs JC, MacIntyre NJ, Ponzano M, et al. Exercise for improving outcomes after osteoporotic vertebral fracture.** *Cochrane Database Syst Rev* 2019;7:CD008618 (clave propuesta `Gibbs 2019`).
- **Qué es**: 9 ensayos con 749 participantes (68 hombres), casi todos con la fractura crónica. Los ensayos **excluían las fracturas recientes o con dolor agudo**: Bennell 2010, por ejemplo, reclutó de 3 a 24 meses después de la fractura.
- **Resultados**:
  - el Timed Up and Go mejora 1,09 s (certeza moderada), que los autores no consideran clínicamente importante;
  - las nuevas fracturas, las caídas, el dolor, la función referida, la calidad de vida y los efectos adversos tienen certeza **muy baja** («We are uncertain» para el dolor).
- **Programas**: todos llevaban fortalecimiento, a menudo de los extensores; 2–3 sesiones por semana, supervisadas por un fisioterapeuta.
- **Efectos adversos del ejercicio**: «costal cartilage fracture, rib fracture» en un ensayo con ejercicios en prono y al darse la vuelta de boca arriba a boca abajo.
- **Terapia manual**: Bennell 2010 la combinaba con el ejercicio, el masaje y el vendaje. La revisión no describe la técnica ni le atribuye ningún efecto adverso.
- **Contradice a Gregson 2025 en el dolor**: el NOGG da «Physiotherapist supervised exercise following vertebral fracture improves pain and physical performance» con nivel Ib, y la Cochrane, con certeza muy baja. Coincide con Brooke-Wavell 2022 («still low»).
- **No dice nada** de cuándo empezar tras una fractura aguda ni del corsé.

**Kovacs CS, Ralston SH. Presentation and management of osteoporosis presenting in association with pregnancy or lactation.** *Osteoporos Int* 2015;26(9):2223–2241 (clave propuesta `Kovacs y Ralston 2015`).
- **Lo que interesa al fisio**, todo opinión de expertos:
  - «Reasonable (not excessive) weight-bearing and resistance physical activity should be encouraged to help maintain bone mass, fitness, and mobility»;
  - «Women who have fractured should also be counseled to avoid lifting heavy objects or other activities that may precipitate a fracture»;
  - tabla 4, para todas: «Early mobilization; avoid bedrest», «Avoid high risk activities that include sudden loads or risk of falls», «Supportive corset (temporary) for vertebral fracture pain».
- **La frase de Scioscia 2023 sale casi literal de aquí**, pero Kovacs y Ralston 2015 **no espera a la consolidación**: pide movilizar cuanto antes y no reposar en cama.
- **Lactancia**: «Consider avoiding lactation … or weaning baby» (tabla 4), más suave que la fig. 3 de Hadji 2026.
- **Recurrencia**: «Affected women should be reassured that vertebral fractures do not usually recur with subsequent pregnancies». Contradice a Hardcastle 2022 y a Hadji 2026 (contradicción 16).
- Cargar al niño aparece solo como factor de riesgo (tabla 1), sin consejo sobre cómo hacerlo.
- **Se contradice** con la vertebroplastia: el texto la pone en duda y la tabla 4 la incluye en los casos graves.

**Hardcastle SA. Pregnancy and lactation associated osteoporosis.** *Calcif Tissue Int* 2022;110(5):531–545 (clave propuesta `Hardcastle 2022`).
- «Other non-pharmacological treatment considerations include adequate analgesia for painful vertebral fractures, physiotherapy input and ensuring women are assisted in caring for their young babies if fractures are causing significant disability». No dice qué fisioterapia.
- El ejercicio en carga: datos «currently limited».
- **Recurrencia**: en 6 años, el 28 % volvió a quedarse embarazada, y de ellas el 20 % tuvo otra fractura; «not possible to confidently reassure» que no se repita.
- Las vértebras más vulnerables, de T11 a L4.
- La osteoporosis transitoria de cadera, aparte de la PLO (con la frontera difusa).

**Sherrington C, Fairhall NJ, Wallbank GK, et al. Exercise for preventing falls in older people living in the community.** *Cochrane Database Syst Rev* 2019;1:CD012424 (clave propuesta `Sherrington 2019`). Unas 450 páginas en cinco partes, entera.
- **Qué es**: 108 ensayos con 23.407 personas de 60 años o más que viven en la comunidad.
- **Resultados**:
  - el ejercicio reduce el número de caídas (RaR 0,77) y de personas que se caen (RR 0,85), con **certeza alta**;
  - el de equilibrio y funcional, también con certeza alta (RaR 0,76);
  - el multicomponente (equilibrio y fuerza), RaR 0,66, con certeza moderada;
  - las fracturas por caída, RR 0,73, con certeza baja;
  - la fuerza sola, el baile y caminar, con certeza muy baja: **caminar solo no está demostrado**;
  - más efecto si lo imparte un profesional sanitario (P = 0,04).
- **Osteoporosis**: no la analiza. Algunos ensayos se hicieron con osteoporosis (Smulders 2010, Carter 2002, Grahn Kronhed 2009, Madureira 2007, Liu-Ambrose 2004…) y ninguno describe fracturas causadas por el ejercicio. La única fractura atribuida al ejercicio en toda la revisión es una de estrés de la pelvis (Clemson 2012).
- **La cifra de «3 h por semana» no está en esta revisión.** Ni en el texto, ni en los análisis, ni en las tablas ni en los anexos. Solo tres ensayos comparan dosis, y la revisión no los agrupa. Brooke-Wavell 2022 y Gregson 2025 dan las 3 h con referencias que no he podido comprobar (sus listas bibliográficas no venían en el XML). Probablemente vienen de un metaanálisis anterior del mismo grupo (Sherrington 2017), que no he leído.
- **Errores internos**: un intervalo de confianza imposible («RaR 0.67, 95% CI 0.58 to 0.65»), un signo cambiado en el SF-36 y los efectos adversos de caminar.

**Una corrección de una nota de lectura**: un subagente dijo que el «up to 28%» de Anagnostis 2024 era una mala lectura. Comprobado en el texto, **no lo es**: sale de Laroche, donde 2 de 7 mujeres con otro embarazo recayeron (28 %). Otro 28 %, el de Kyvernitakis, es el de las que volvieron a quedarse embarazadas, de las que recayó el 20 % (6 de 30). Es una cifra de 7 casos; desde H4 la app no da ninguna.

### Qué cambia con la tanda 4 (propuestas; cada una con mi recomendación)

**T1. Moverse con seguridad**: el recuadro de la fase 5 y el aviso de la fase 6 añaden «girar dando pasos en vez de torcer el tronco» y «no levantar ni dejar cosas desde el suelo: guardarlas a la altura de la cintura» (Giangregorio 2015). *Recomiendo el cambio.*

**T2. El ejercicio tras la fractura vertebral, sin sobrevalorarlo.** La línea de la fase 5 decía «El ejercicio supervisado por un fisioterapeuta mejora el dolor y la función (… Gregson 2025)». Pasa a:
> «Tras una fractura vertebral, el ejercicio mejora algo la movilidad (certeza moderada); si mejora el dolor no se sabe (certeza muy baja), y los estudios se hicieron meses después de la fractura, no en la fase aguda (Gibbs 2019).»

Se queda «con dolor, empieza tumbado boca arriba» (Gregson 2025, condicional). *Recomiendo el cambio*: es la revisión sistemática más reciente y rebaja al NOGG.

**T3. Las transiciones** (C4) ganan un caso concreto:
> «En un ensayo, ejercicios en prono y darse la vuelta de boca arriba a boca abajo rompieron una costilla y un cartílago costal (Gibbs 2019).»

Va en el «¿Por qué?» del aviso, no en la línea. *Recomiendo el cambio.*

**T4. La línea de la PLO en la fase 5** (H3) queda así:
> «Movilízate pronto y sin reposo en cama; actividad en carga y de fuerza razonable, sin excesos, y sin cargar objetos pesados (Kovacs y Ralston 2015). Con las fracturas consolidadas, a los 3–6 meses, más carga y fuerza (Scioscia 2023). Fisioterapia cuando el dolor lo permita (Hadji 2026; Hardcastle 2022). Al coger y cargar al bebé, la misma bisagra de cadera (extrapolado de Brooke-Wavell 2022). Si las fracturas la limitan mucho, que tenga ayuda para cuidar del bebé (Hardcastle 2022). La lactancia, los fármacos y otro embarazo los decide con su médico.»

*Recomiendo el cambio.* Corrige que la versión anterior pareciera pedir esperar 3–6 meses para moverse.

**T5. Las «3 h por semana» de caídas, con su cita correcta.**
- Siguen citando a Brooke-Wavell 2022 [E] y Gregson 2025 (Ia), **nunca a Sherrington 2019**.
- Sherrington 2019 se cita para lo que sí dice: «el ejercicio de equilibrio y funcional reduce las caídas (certeza alta); caminar solo no ha demostrado reducirlas».
- *Recomiendo el cambio.* Si quieres apoyar las 3 h en su origen, el PDF sería Sherrington C, et al. Exercise to prevent falls in older adults: an updated systematic review and meta-analysis. *Br J Sports Med* 2017;51(24):1750–1758 ([doi:10.1136/bjsports-2016-096547](https://doi.org/10.1136/bjsports-2016-096547); identificadores comprobados en Europe PMC, sin texto abierto). No lo he leído.

**T6. Recurrencia (H4), sin cambios en el texto.** Con tres posturas distintas («should be reassured», «not possible to confidently reassure», «still unclear»), el texto de H4 («si hay más riesgo en otro embarazo no está claro») es el que las recoge todas. Añade las citas de Kovacs y Ralston 2015 y Hardcastle 2022 en el razonamiento. *Recomiendo esto.*

## Resumen

- **Entra en la Fase P.** Cambia la seguridad y la interpretación:
  - **Seguridad**: el hueso se rompe con cargas que no romperían un hueso sano. La fractura por fragilidad es «a low trauma fracture sustained from a fall from standing height or less» (Gregson 2025). Algunas técnicas y algunos tests ponen carga sobre la columna, las costillas o la pelvis.
  - **Interpretación**: un dolor de espalda brusco, sobre todo torácico, en una persona con factores de riesgo puede ser una fractura vertebral nueva (Gregson 2025, recomendación fuerte). La mayoría de las fracturas vertebrales «remain undiagnosed» (Gregson 2025; Kanis 2019).
- **El ejercicio está bien definido** en un consenso del Reino Unido que el NOGG hace suyo (Brooke-Wavell 2022):
  - fuerza progresiva 2–3 días por semana, hasta el peso que se levanta 8–12 veces, 3 series [evidencia];
  - impacto moderado la mayoría de los días, unos 50 impactos, solo sin fractura vertebral [consenso];
  - con fractura vertebral, impacto solo hasta caminar a paso ligero [consenso, «precautionary»];
  - equilibrio y fuerza para prevenir caídas;
  - evitar la flexión del tronco mantenida, repetida o al final del recorrido, sobre todo con carga [consenso; en el NOGG, nivel Ia para la flexión forzada repetida].
- **La terapia manual casi no tiene fuentes**:
  - de las fuentes leídas en esta sesión, ninguna guía la menciona;
  - solo Downie 2013 dice, en su introducción y con una referencia, que en la fractura vertebral está «contraindicated»;
  - y Maitland 2005 (cap. 9, p. 223; leído en la Fase L) dice «sin manipulación forzada con osteoporosis; la movilización suave sí puede ser adecuada».
  
  Cualquier regla de fuerza más fina sería redacción propia.
- **La PLO** es rara:
  - fracturas por fragilidad, casi siempre vertebrales y varias (4,4 de media), en el tercer trimestre o en los primeros meses de lactancia;
  - suele ser el primer embarazo;
  - el dolor se atribuye al embarazo o al posparto, y el diagnóstico se retrasa;
  - **ninguna fuente leída da un programa de fisioterapia**: solo «reasonable, but not excessive» actividad en carga y de resistencia cuando consolidan las fracturas, a los 3–6 meses (Scioscia 2023).
- **Mi recomendación**:
  - una tarjeta «Osteoporosis o fragilidad ósea» en la fase 1, con «Diagnosticada» y «Sospecha»;
  - un sistema propio en la fase 2 (una urgencia neurológica, cuatro derivaciones no urgentes y un bloque de caídas);
  - una línea de técnica en los tests de la 4b que cargan el hueso, sin tocar las LR;
  - el recuadro de la fase 5 con el ejercicio de Brooke-Wavell 2022;
  - el aviso y la red de seguridad de la fase 6, con la manipulación forzada fuera del plan (Maitland 2005);
  - payload `op` y physiq-report.
  
  La PLO va como **causa dentro de esta tarjeta**. Su sospecha va en la futura tarjeta «Embarazo y posparto» (decisión 12).

## Fuentes leídas enteras (octubre 2026)

Texto completo de PMC (XML JATS de la API de NCBI, con todas sus secciones y tablas) y la página de recomendaciones de NICE. Las figuras que solo existen como imagen no se vieron, salvo donde se indica. Las páginas de PMC no traen paginación: se cita por sección, recuadro, tabla o recomendación. Los DOI se comprobaron en Europe PMC.

**Cómo se leyeron**: cuatro subagentes de esta sesión leyeron enteras las 17 fuentes y devolvieron notas con el localizador y citas literales. Yo comprobé en el texto cada pasaje que usa este documento (búsqueda literal, octubre 2026). Las copias de trabajo y las notas están en el scratchpad, fuera del repositorio. Antes de implementar, cada pasaje que vaya a un texto de la app se vuelve a comprobar, como en los otros diseños.

### A. Osteoporosis: guías y consensos

| Clave propuesta | Referencia | Tipo | Qué aporta |
|---|---|---|---|
| `Gregson 2025` | Gregson CL, Armstrong DJ, Avgerinou C, et al. The 2024 UK clinical guideline for the prevention and treatment of osteoporosis. *Arch Osteoporos* 2025;20(1):119. [doi:10.1007/s11657-025-01588-3](https://doi.org/10.1007/s11657-025-01588-3) (PMC12417299) | Guía del NOGG (GRADE: fuerte o condicional; niveles Ia–IV), avalada por IOF y ESCEO. Sin las figuras 1–5 ni la lista de referencias; tablas aplanadas | Definición de fractura por fragilidad; pensar en una fractura vertebral ante un dolor de espalda agudo, «especially thoracic pain» (fuerte); cuándo buscarla (≥ 4 cm de talla, cifosis, corticoides, T ≤ −2,5; fuerte); corticoides ≥ 7,5 mg/día durante 3 meses = protección ósea a la vez y riesgo muy alto (fuerte); ejercicio en carga y de fuerza (fuerte); «repetitive forced spinal forward flexion exercises should be undertaken with care» (Ia); tras la fractura vertebral, fuerza progresiva con extensores (fuerte), empezar en descarga con dolor (condicional), ejercicio supervisado por fisioterapeuta (Ib), corsé de rutina «cannot be recommended» (Ia), déficit neurológico → cirugía de columna urgente; valoración de caídas a todos (fuerte), 3 h por semana (Ia); el LES en la tabla 3; dolor de muslo, ingle o cadera con antirresortivos → imagen del fémur (fuerte) |
| `Brooke-Wavell 2022` | Brooke-Wavell K, Skelton DA, Barker KL, et al. Strong, steady and straight: UK consensus statement on physical activity and exercise for osteoporosis. *Br J Sports Med* 2022;56(15):837–846. [doi:10.1136/bjsports-2021-104634](https://doi.org/10.1136/bjsports-2021-104634) (PMC9304091) | Consenso de expertos de la Royal Osteoporosis Society (cuatro fisioterapeutas en el grupo central); cada recomendación marcada [E] evidencia o [C] consenso. Sin la fig. 1 ni los suplementos (el apéndice V resume la evidencia de cada [E]) | La dosis: recuadros 1 (hueso), 2 (caídas) y 3 (moverse con seguridad y tras la fractura vertebral). Seguridad del ejercicio; «‘how to’ rather than ‘don’t do’»; el fisioterapeuta, sobre todo con fractura vertebral. El NOGG lo cita para la dosis |
| `Kanis 2019` | Kanis JA, Cooper C, Rizzoli R, Reginster JY; ESCEO e IOF. European guidance for the diagnosis and management of osteoporosis in postmenopausal women. *Osteoporos Int* 2019;30(1):3–44. [doi:10.1007/s00198-018-4704-5](https://doi.org/10.1007/s00198-018-4704-5) (PMC7026233) | Guía europea, sin graduar («guidance»). Sin las figuras 1–14; tablas aplanadas | Fracturas vertebrales sin diagnosticar; buscarlas con ≥ 4 cm de talla, cifosis, corticoides; corticoides > 5 mg durante ≥ 3 meses como factor de riesgo (tabla 4); causas secundarias (tabla 4), entre ellas la **mastocitosis sistémica**; mieloma por la intensidad del dolor óseo; «the amount of weight-bearing exercise that is optimal … is not known»; la inmovilidad hace perder hueso; fisioterapia tras la fractura. Solo trata la posmenopausia |
| `Laurent 2022` | Laurent MR, Goemaere S, Verroken C, et al. Prevention and treatment of glucocorticoid-induced osteoporosis in adults: consensus recommendations from the Belgian Bone Club. *Front Endocrinol* 2022;13:908727. [doi:10.3389/fendo.2022.908727](https://doi.org/10.3389/fendo.2022.908727) (PMC9219603) | Consenso con GRADE simplificado; sus autores dicen que no es una guía. Sin las referencias | Corticoides: pérdida ósea del 6–12 % en el primer año; el riesgo de fractura sube «within the first three to six months», antes de que baje la densidad; también con dosis < 5 mg mantenidas; tras retirarlos, el riesgo baja «after ~1 year»; infiltraciones epidurales repetidas y fractura vertebral; caídas en los 3 primeros meses; vigilar la compresión medular con la fractura vertebral desplazada hacia atrás; el lupus |

### B. Caídas y banderas rojas

| Clave propuesta | Referencia | Tipo | Qué aporta |
|---|---|---|---|
| `Montero-Odasso 2022` | Montero-Odasso M, van der Velde N, Martin FC, et al. World guidelines for falls prevention and management for older adults: a global initiative. *Age Ageing* 2022;51(9):afac205. [doi:10.1093/ageing/afac205](https://doi.org/10.1093/ageing/afac205) (PMC9523684) | Guía mundial (GRADE modificado, 96 expertos de 39 países). Sin la fig. 1 (algoritmo) ni los apéndices | Preguntar por caídas cada año (1A, y E); estratificación baja, intermedia y alta; velocidad de marcha < 0,8 m/s (1A); ejercicio de equilibrio y funcional ≥ 3 veces por semana, progresado al menos 12 semanas (1A); «General physical activity alone (e.g. walking) is unlikely to prevent falls»; quien tiene osteoporosis o una fractura de baja energía merece una valoración de caídas; preocupación por caerse (FES-I) |
| `NICE NG249` | NICE. Falls: assessment and prevention in older people and in people 50 and over at higher risk. NG249, 2025. [nice.org.uk/guidance/ng249](https://www.nice.org.uk/guidance/ng249) | Guía; leído el capítulo de recomendaciones (web) | A quién (≥ 65, o 50–64 con factores; la osteoporosis no está en su lista); no usar herramientas de predicción (1.1.1); qué hacer según las caídas (1.1.2–1.1.6); el programa de ejercicio (1.3.9–1.3.12); la valoración de la osteoporosis dentro de la valoración integral (1.2.2) |
| `Downie 2013` (ya registrada) | Downie A, et al. Red flags to screen for malignancy and fracture in patients with low back pain: systematic review. *BMJ* 2013;347:f7095 (PMC3898572) | Revisión sistemática. Sin las figuras 2–5 ni las tablas del apéndice, donde están casi todas las S, E y LR | Probabilidades posprueba: corticoides prolongados 33 %, contusión o abrasión 62 %, traumatismo grave 11 %, edad 2–9 %, tres banderas juntas 90 %; la osteoporosis «not evaluated»; la cifosis y el dolor torácico, «uninformative»; pedir imagen por una sola bandera es «unwise». **Única mención de la terapia manual** en todas las fuentes leídas: en la fractura vertebral «is contraindicated» (introducción, afirmación con referencia, no un resultado de la revisión) |
| `Finucane 2020` (ya registrada) | Finucane LM, et al. International Framework for Red Flags for Potential Serious Spinal Pathologies. IFOMPT, 2020 | Marco de consenso. **En esta sesión solo se pudo leer la traducción al portugués europeo** del GIFME/APFISIO (diciembre de 2020), la única que IFOMPT tiene hoy en su web; el original inglés se leyó en sesiones anteriores (está en el registro y en `l_e4`) | Sección 3 (fractura): dolor brusco toracolumbar tras un traumatismo menor (resbalar, tropezar, levantar algo desde la flexión, toser); el 70 % de las fracturas vertebrales son torácicas; fractura previa = 5,4 veces más riesgo; radiografía primero; no actuar por una sola bandera |

### C. Osteoporosis del embarazo y la lactancia (PLO)

| Clave propuesta | Referencia | Tipo | Qué aporta |
|---|---|---|---|
| `Qian 2021` | Qian Y, Wang L, Yu L, Huang W. Pregnancy- and lactation-associated osteoporosis with vertebral fractures: a systematic review. *BMC Musculoskelet Disord* 2021;22:926. [doi:10.1186/s12891-021-04776-7](https://doi.org/10.1186/s12891-021-04776-7) (PMC8567545) | Revisión sistemática de casos y series (65 artículos, 338 casos, solo vertebral), sin metaanálisis. Sin las figs. 4 y 5 (momento de inicio, niveles) | El 91,5 % del dolor, entre los 3 últimos meses del embarazo y los 3 primeros del posparto; 149 de 173 en el primer embarazo; 94,4 % con lactancia materna; 4,4 vértebras por paciente; T12–L2 lo más afectado; heparina en el 28,8 %, antecedentes familiares en el 33,1 %; vuelta al trabajo a más de 3 años |
| `Scioscia 2023` | Scioscia MF, Zanchetta MB. Recent insights into pregnancy and lactation-associated osteoporosis (PLO). *Int J Womens Health* 2023;15:1227–1238. [doi:10.2147/IJWH.S366254](https://doi.org/10.2147/IJWH.S366254) (PMC10404404) | Revisión narrativa de un grupo con cohorte propia | Fisiología (lactancia: −3 a −10 % de densidad en 2–6 meses, sobre todo lumbar; se recupera 6–12 meses tras el destete); dolor «often interpreted as a typical pregnancy or postpartum symptom»; factores de riesgo (tabla 1, con el **Ehlers-Danlos**); destete por consenso de expertos; **la única pauta de actividad**: con las fracturas consolidadas, a los 3–6 meses, actividad en carga y de resistencia «reasonable, but not excessive»; recurrencia |
| `Gak 2024` | Gak N, Abbara A, Dhillo WS, Keen R, Comninos AN. Current and future perspectives on pregnancy and lactation-associated osteoporosis. *Front Endocrinol* 2024;15:1494965. [doi:10.3389/fendo.2024.1494965](https://doi.org/10.3389/fendo.2024.1494965) (PMC11655223) | Minirrevisión narrativa | Incidencia (460 por millón de partos en Japón); dolor lumbar o pérdida de talla; el 59 % con dolor más de 3 años; les cuesta cuidar del recién nacido; variantes genéticas en el 50 % (LRP5, WNT1, COL1A1/A2); osteoporosis transitoria de cadera; recurrencia del 20 % en el embarazo siguiente, más con varias fracturas; «guidance regarding weight-bearing activities and mobility», sin decir cuál |
| `Anagnostis 2024` | Anagnostis P, Lampropoulou-Adamidou K, Bosdou JK, et al. Comparative effectiveness of therapeutic interventions in pregnancy and lactation-associated osteoporosis: a systematic review and meta-analysis. *J Clin Endocrinol Metab* 2024;109(3):879–901. [doi:10.1210/clinem/dgad548](https://doi.org/10.1210/clinem/dgad548) (PMC10876413) | Revisión sistemática (n = 451; metaanálisis con solo 2 estudios); excluye la osteoporosis transitoria de cadera | El 90,4 % de las fracturas en la lactancia (1–7 meses); 1 a 12 vértebras, **23 casos solo torácicos**; dolor, limitación y pérdida de talla; nuevas fracturas en el 14,2 %; recurrencia hasta el 28 % en el embarazo siguiente; más refracturas con varias fracturas al inicio (27 % frente a 10 %) |
| `Carsote 2023` | Carsote M, Turturea MR, Valea A, et al. Bridging the gap: pregnancy- and lactation-associated osteoporosis. *Diagnostics* 2023;13(9):1615. [doi:10.3390/diagnostics13091615](https://doi.org/10.3390/diagnostics13091615) (PMC10177839) | Revisión narrativa (836 casos en 12 estudios y 24 casos) | Factores de riesgo (también el lupus); solo el 4,4 % confirmado en las 4 primeras semanas de dolor; a los 6 meses, solo el 42 % podía cuidar sola del bebé; RM en el embarazo y DXA en la lactancia; una DXA normal no descarta; una fractura de estrés de tibia al reanudar la actividad física, «which should be done carefully» |
| `Weckerly 2026` | Weckerly ML, et al. Pregnancy and lactation associated osteoporosis of the hip: a systematic review. *Calcif Tissue Int* 2026;117(1):27. [doi:10.1007/s00223-026-01493-y](https://doi.org/10.1007/s00223-026-01493-y) (PMC12901228) | Revisión sistemática de cadera (149 casos) | La PLO de cadera (la antigua osteoporosis transitoria de cadera): el 94 % empieza en el embarazo; fisioterapia en el 30 %, carga modificada en el 40 %, sin resultados por tratamiento |
| `Sözen 2026` | Sözen M, Cantürk Z, Öz Gül Ö, et al. Real-world treatment outcomes in pregnancy and lactation-associated osteoporosis: a nationwide multicenter cohort study. *Front Endocrinol* 2026;17:1934166. [doi:10.3389/fendo.2026.1934166](https://doi.org/10.3389/fendo.2026.1934166) (PMC13626871) | Cohorte retrospectiva, 59 mujeres de 18 centros | Dolor de espalda en el 93,2 %; **localización torácica 31,4 %**, lumbar 21,6 %, toracolumbar 47,1 %; lactancia de 5 meses de mediana; recuperación de la densidad en todos los grupos; fisioterapia solo nombrada |

### Salvedades de lectura

- **Ninguna fuente leída dice nada de cómo cargar al bebé, la postura para amamantar ni la terapia manual en la PLO.** Lo que diga la app sobre eso será extrapolación de la osteoporosis general (Brooke-Wavell 2022), y lo dirá.
- **Finucane 2020**: solo se pudo releer en portugués. Lo que se cita de él (sección 3) coincide con lo que ya dice `l_e4`, que se escribió con el original inglés. Si se cita algo nuevo, se comprueba antes en el inglés (decisión 14).
- **Downie 2013**: casi todas las S, E y LR están en figuras y apéndices que no se pudieron leer. Solo se usan las cifras del texto.
- **Brooke-Wavell 2022** marca casi todo lo del impacto, lo de moverse con seguridad y lo de la fractura vertebral como **[C], consenso**. Solo la fuerza y la mayoría de las caídas son [E]. Los textos de la app lo dirán.
- **Las cifras de incidencia de la PLO** van de 4 a 460 por millón según la fuente y el denominador. No se usa ninguna en la app.

### No leídas enteras (no se citan)

Desde la sesión solo se llega a PMC y a NICE. Las editoriales (Springer, Wiley, Cochrane, OUP, JOSPT) y NCBI Bookshelf piden un captcha. **Si quieres alguna, pásame el PDF** y la leo entera antes de implementar (decisión 13). Por orden de utilidad:

| # | Fuente | Enlace | Para qué |
|---|---|---|---|
| 1 | ~~Hadji P, et al. Pregnancy- and lactation-associated osteoporosis: a position statement of the IAPM, IOF, ECTS, ESCEO, IMS, and EMAS.~~ *Int J Gynaecol Obstet* 2026 | [doi:10.1002/ijgo.71203](https://doi.org/10.1002/ijgo.71203) | **Leído entero** (tanda 2; ver «Lectura de los PDF») |
| 2 | ~~Puentedura EJ, O'Grady WH. Safety of thrust joint manipulation in the thoracic spine: a systematic review. *J Man Manip Ther* 2015;23(3):154–161~~ | [doi:10.1179/2042618615Y.0000000012](https://doi.org/10.1179/2042618615Y.0000000012) | **Leído entero** (tanda 1; ver «Lectura de los PDF») |
| 3 | ~~Giangregorio LM, et al. Too Fit To Fracture: exercise recommendations for individuals with osteoporosis or osteoporotic vertebral fracture. *Osteoporos Int* 2014;25(3):821–835~~ | [doi:10.1007/s00198-013-2523-2](https://doi.org/10.1007/s00198-013-2523-2) | **Leído entero** (tanda 1; ver «Lectura de los PDF») |
| 4 | ~~Giangregorio LM, et al. Too Fit To Fracture: outcomes of a Delphi consensus process on physical activity and exercise recommendations for adults with osteoporosis with or without vertebral fractures. *Osteoporos Int* 2015;26(3):891–910~~ | [doi:10.1007/s00198-014-2881-4](https://doi.org/10.1007/s00198-014-2881-4) | **Leído entero** (tanda 4; ver «Lectura de los PDF») |
| 5 | ~~Gibbs JC, et al. Exercise for improving outcomes after osteoporotic vertebral fracture. *Cochrane Database Syst Rev* 2019;7:CD008618~~ | [doi:10.1002/14651858.CD008618.pub3](https://doi.org/10.1002/14651858.CD008618.pub3) | **Leído entero** (tanda 4; ver «Lectura de los PDF») |
| 6 | ~~Kovacs CS, Ralston SH. Presentation and management of osteoporosis presenting in association with pregnancy or lactation. *Osteoporos Int* 2015;26(9):2223–2241~~ | [doi:10.1007/s00198-015-3149-3](https://doi.org/10.1007/s00198-015-3149-3) | **Leído entero** (tanda 4; ver «Lectura de los PDF») |
| 7 | Issa Z, et al. Pregnancy and lactation associated osteoporosis: a systematic review. *Calcif Tissue Int* 2026 | [doi:10.1007/s00223-026-01499-6](https://doi.org/10.1007/s00223-026-01499-6) | La revisión sistemática más reciente de la PLO (con Kovacs entre los autores) |
| 8 | ~~Sherrington C, et al. Exercise for preventing falls in older people living in the community. *Cochrane Database Syst Rev* 2019;1:CD012424~~ | [doi:10.1002/14651858.CD012424.pub2](https://doi.org/10.1002/14651858.CD012424.pub2) | **Leído entero** (tanda 4; ver «Lectura de los PDF») |
| 9 | ~~Hardcastle SA. Pregnancy and lactation associated osteoporosis. *Calcif Tissue Int* 2022;110(5):531–545~~ | [doi:10.1007/s00223-021-00815-6](https://doi.org/10.1007/s00223-021-00815-6) | **Leído entero** (tanda 4; ver «Lectura de los PDF») |
| 10 | Finucane 2020 en inglés (ya registrada) | [doi:10.2519/jospt.2020.9971](https://doi.org/10.2519/jospt.2020.9971) | Solo si se cita algo de él que no esté ya en `l_e4` |
| 11 | La guía española de la SEIOMM | — | No la he podido localizar desde la sesión. Opcional, por si prefieres apoyar los textos en una guía española |

**StatPearls** («Osteoporosis», NBK441901; y releer Donnally 2025, ya registrada) pide un captcha desde la sesión. No hace falta para este diseño.

## Contradicciones entre fuentes, y qué propongo elegir

### Osteoporosis

1. **Pérdida de talla para buscar una fractura vertebral.**
   - Gregson 2025: «≥ 4 cm», frente a la talla recordada de adulto joven o en medidas seriadas.
   - Kanis 2019: «≥ 4 cm» en un sitio y «> 4 cm» en otro.
   - Laurent 2022: «greater than 2 cm since baseline or 4 cm since young adulthood».
   
   **Propongo** 4 cm frente a su talla de joven (Gregson 2025), y 2 cm si hay una medida anterior (Laurent 2022). Las dos son compatibles.
   
   *Tras la tanda 2*: en la PLO, Hadji 2026 da como signo de fractura una pérdida de ≥ 3 cm. **Propongo** usar los 3 cm solo en la pregunta de la PLO (H1) y dejar `op_d_talla` como está.
2. **Umbral de corticoides.**
   - Gregson 2025: ≥ 7,5 mg/día de prednisolona durante 3 meses para la protección ósea inmediata y el riesgo muy alto (en la tabla 1 pone «> 7.5»); en el FRAX, cualquier dosis.
   - Kanis 2019: > 5 mg durante ≥ 3 meses como factor de riesgo.
   - Laurent 2022: ≥ 5 mg en el FRAX, y también pierden hueso con < 5 mg mantenidos.
   - Finucane 2020: > 5 o > 7,5 mg en el mismo texto.
   - Downie 2013: «prolonged», sin definir.
   - La tarjeta del lupus usa ≤ 5 · > 5–20 · > 20 (Fanouriakis 2024; Sammaritano 2025), así que no tiene un corte en 7,5.
   
   **Propongo** que la tarjeta pregunte «corticoides orales 3 meses o más» con un corte en 7,5 mg/día (Gregson 2025), y que el texto diga que con menos dosis también se pierde hueso (Laurent 2022). Nunca dar uno como «el» umbral, como en el lupus.
3. **El corsé.**
   - Gregson 2025: el uso de rutina «cannot be recommended» (Ia); con evidencia baja, 2 h al día durante 6 meses podría mejorar el dolor y la fuerza del tronco.
   - La fila `fx_vertebral_compresion` del panel de tiempos dice «Corsé de 4 a 12 semanas» (Donnally 2025).
   - Las fuentes de la PLO lo nombran sin evaluarlo.
   
   **Propongo** revisar la nota de esa fila con la guía (decisión 10). La app no pauta el corsé: es del médico.
4. **La vertebroplastia.** Kanis 2019 la plantea con dolor de 2–3 semanas, aunque admite «undue reliance on expert opinion». Gregson 2025 (Ia) y Laurent 2022 no la recomiendan de rutina. No es del fisio; solo afecta a la nota del panel.
5. **El impacto con fractura vertebral.** Brooke-Wavell 2022 lo limita a caminar a paso ligero como «precautionary measure because of theoretical (unproved) risks» [C]. El mismo texto dice que el ejercicio «does not need to be adapted … according to fracture risk or low BMD» y que caminar a paso ligero aumentó las fracturas en quien ya tenía riesgo de caerse. **Propongo** seguir el recuadro tal cual y decir que es una precaución sin pruebas, con la progresión individual que el mismo consenso permite.
6. **La torsión.** Brooke-Wavell 2022: «should be safe if performed smoothly and comfortably» [C]. Gregson 2025 no la nombra. **Propongo** no restringirla y sí la flexión con carga, que es lo que dicen las dos. *Tras la tanda 1*: Giangregorio 2014 recoge fracturas al girarse «too quickly during transitions» y pide precaución al girarse y agacharse en las transiciones y con cargas. No contradice a Brooke-Wavell 2022 (las dos piden suavidad); se añade la precaución (C4).
7. **La dosis de los extensores.** Brooke-Wavell 2022: 3–5 repeticiones mantenidas 3–5 s, dos veces por semana (o a diario con fractura vertebral) [C]. El mismo texto dice que en los ensayos «the higher the dose … the greater change». **Propongo** darla como punto de partida, con la progresión individual.
8. **La terapia manual.**
   - Gregson 2025, Brooke-Wavell 2022, Kanis 2019, Laurent 2022, Montero-Odasso 2022, NICE NG249 y Finucane 2020 no la mencionan.
   - Downie 2013 la llama «contraindicated» en la fractura vertebral, en una frase de su introducción con referencia.
   - Maitland 2005 (cap. 9, p. 223): sin manipulación forzada con osteoporosis; la movilización suave puede ser adecuada.
   
   **Propongo** usar solo esas dos (decisiones 6 y 7) y marcar lo demás como redacción propia.
9. **El valor de las banderas.** Downie 2013 y Finucane 2020 desaconsejan actuar por una sola bandera. Gregson 2025 pide pensar en la fractura vertebral ante un dolor agudo, «especially thoracic», con factores de riesgo (fuerte). No se contradicen: el NOGG combina el síntoma con los factores. **Propongo** que las preguntas combinen siempre el dolor nuevo con la osteoporosis conocida o sospechada, como ya hace `l_e4`.
10. **Las edades de más riesgo.** Para Downie 2013 (citando al ACP), hombres > 65 y mujeres > 75. Para Finucane 2020, mujeres > 65 y hombres > 75: al revés. **No se usa ninguna** en la app.

### Caídas

11. **A quién valorar y cómo.**
    - NICE NG249: ≥ 65, o 50–64 con factores (la osteoporosis no está en su lista); no usar herramientas de predicción (1.1.1).
    - Montero-Odasso 2022: preguntar cada año y estratificar con la velocidad de marcha < 0,8 m/s (1A).
    - Gregson 2025 y Montero-Odasso 2022: valorar las caídas en toda persona con osteoporosis o fractura por fragilidad.
    
    **Propongo** las preguntas comunes a las dos guías (caídas en el último año y sus criterios de gravedad), sin puntuar riesgo, y la velocidad de marcha como opcional.
12. **La dosis del ejercicio de caídas.**
    - Brooke-Wavell 2022: 3 h por semana durante al menos 4 meses, para quien ya se cae [E]; al menos dos veces por semana para los demás [C].
    - Gregson 2025: 3 h por semana o más (Ia).
    - Montero-Odasso 2022: ≥ 3 sesiones por semana, progresadas al menos 12 semanas (1A), sin horas.
    - NICE NG249: sin dosis.
    
    **Propongo** las 3 h por semana (Brooke-Wavell 2022; Gregson 2025) con las ≥ 3 sesiones y las 12 semanas (Montero-Odasso 2022). Son compatibles.
    
    *Tras la tanda 1*: Giangregorio 2014 recomienda con fuerza, para todos con osteoporosis, equilibrio a diario, 15–20 min (unas 2 h por semana). Es más que el «al menos dos veces por semana» [C] de Brooke-Wavell 2022 para quien no se cae. **Propongo** las 2 h por semana diarias para todos y las 3 h para quien ya se cae (C3).

### PLO

13. **Cuándo.** El 91,5 % del dolor en los 3 últimos meses del embarazo y los 3 primeros del posparto (Qian 2021). El 90,4 % de las fracturas en la lactancia, entre 1 y 7 meses (Anagnostis 2024). En Sözen 2026, 39 % en el tercer trimestre y 57,6 % en la lactancia. En la cadera, el 94 % en el embarazo (Weckerly 2026). **Propongo** decir «último trimestre o primeros meses de lactancia», sin cifra.
14. **Dónde.** Toracolumbar, T12–L2 (Qian 2021; Anagnostis 2024). Pero los casos solo torácicos no son raros: 23 en Anagnostis 2024 y el 31,4 % en Sözen 2026, más que el lumbar. **Propongo** no dar a entender que es lumbar: «columna dorsal o lumbar».
15. **El destete.**
    - «Expert consensus» y «as early as possible» (Scioscia 2023).
    - «Frequently recommended» (Gak 2024).
    - «The need for these treatments is uncertain» (Anagnostis 2024).
    - Carsote 2023 lo exige y, en la cirugía de cadera, recoge lo contrario.
    
    **Propongo** que la app no lo aconseje nunca: es una decisión médica. Solo puede decir que lo hable con su médico.
    
    *Tras la tanda 2*: la declaración de posición se contradice a sí misma: «might be encouraged to consider limiting/stopping breastfeeding» en el texto y «Stop breastfeeding as soon as possible» en la fig. 3 (Hadji 2026). Refuerza la propuesta.
16. **La recurrencia en el embarazo siguiente.** «Very infrequent» pero con un 20 % citado (Scioscia 2023); 20 % (Gak 2024); hasta el 28 % (Anagnostis 2024). Más riesgo con varias fracturas al inicio (Gak 2024; Anagnostis 2024). **Propongo** «puede repetirse en otro embarazo; que lo planifique con su médico», sin cifra. *Tras la tanda 2*: Hadji 2026 dice que si hay más riesgo en el siguiente embarazo «is still unclear», y da casi un 25 % de nuevas fracturas a los 6 años, más cuantas más fracturas al diagnóstico. **Propongo** cambiar el texto (H4).
17. **El dolor.** «Full recovery at 12 months» en la mayoría (Anagnostis 2024), frente al 59 % con dolor más de 3 años (Gak 2024; la misma serie citada por Anagnostis). **No se usa ninguna cifra.**
18. **La osteoporosis transitoria de cadera.** Una forma de la PLO para Gak 2024 y Carsote 2023, otra entidad para Anagnostis 2024, y la PLO de cadera con lesión ósea para Weckerly 2026. Para la app basta con que la PLO pueda dar dolor de cadera o ingle en el embarazo (decisión 12). *Tras la tanda 2*: Hadji 2026 la separa de la PLO («is distinct from PLO»), como Anagnostis 2024. **Propongo** tratarla aparte en «Embarazo y posparto» (H5).

## Criterio de entrada de la Fase P: sí entra

1. **Cambia la seguridad.**
   - **Fractura con poca carga**: en el hueso osteoporótico, una caída desde la propia altura o menos basta (Gregson 2025). Una fractura vertebral puede venir de resbalar, tropezar, levantar algo desde la flexión o toser (Finucane 2020, sección 3).
   - **Lo que hace el fisio**:
     - manipulación y movilización con fuerza: «sin manipulación forzada con osteoporosis» (Maitland 2005, cap. 9, p. 223);
     - tests que empujan la columna, las costillas o la pelvis;
     - ejercicio con flexión del tronco y carga: «repetitive forced spinal forward flexion exercises should be undertaken with care» (Gregson 2025, Ia).
   - **Las caídas**: la mayoría de las fracturas no vertebrales empiezan con una caída (Gregson 2025).
   - **Compresión medular** con una fractura vertebral desplazada hacia atrás (Laurent 2022); déficit neurológico → cirugía de columna urgente (Gregson 2025).
   - **Fractura atípica de fémur** con antirresortivos: dolor de muslo, ingle o cadera durante días o semanas antes (Gregson 2025, fuerte).
2. **Cambia la interpretación.**
   - Un dolor de espalda brusco, sobre todo torácico, con factores de riesgo puede ser una fractura vertebral nueva (Gregson 2025, fuerte). La mayoría pasan sin diagnosticar (Gregson 2025; Kanis 2019). En la PLO, el dolor se atribuye al embarazo o al posparto (Scioscia 2023; Carsote 2023).
   - Una cifosis o una pérdida de talla de 4 cm pueden ser fracturas que nadie ha visto (Gregson 2025).
3. **Cambia el ejercicio**: dosis propia, sobre todo con fractura vertebral (Brooke-Wavell 2022).

**Es capa transversal**: la osteoporosis sale en cualquier región, y la fractura vertebral torácica no tiene región propia en la app.

## Lo que importa al fisioterapeuta

### 1. Qué técnicas cambian

| Técnica | Qué dicen las fuentes | Qué propongo |
|---|---|---|
| **Manipulación con thrust** (columna, costillas) | Maitland 2005 (cap. 9, p. 223): sin manipulación forzada con osteoporosis. Downie 2013: en la fractura vertebral, la terapia manual «is contraindicated» (introducción, con referencia). Ninguna guía de osteoporosis la menciona | Fuera del plan de la fase 6 con la tarjeta marcada (decisión 6) |
| **Movilización con fuerza** (grados altos, posteroanteriores firmes) | Maitland 2005: la movilización suave «puede ser adecuada». Nada más leído | Movilización suave sí; sin fractura vertebral reciente o sospechada en la zona (Downie 2013). Lo que sea «suave» lo decide el fisio: no hay fuente que lo gradúe (decisión 7) |
| **Flexión del tronco con carga** (abdominales, «roll down», levantar desde la flexión) | Gregson 2025 (Ia): la flexión forzada repetida, «with care». Brooke-Wavell 2022 [C]: modificar o evitar la flexión mantenida, repetida o al final del recorrido, sobre todo con carga; enseñar la bisagra de cadera; «‘how to’ rather than ‘don’t do’» | En el recuadro de la fase 5 y el aviso de la fase 6 |
| **Torsión** | Brooke-Wavell 2022 [C]: «should be safe if performed smoothly and comfortably» | Sin restricción |
| **Impacto** (saltos, carrera) | Brooke-Wavell 2022 [C]: sin fractura vertebral, impacto moderado (≈ 50 impactos), sin caer desde altura; con fractura vertebral o fracturas múltiples por baja energía, solo hasta caminar a paso ligero | Según la tarjeta (fractura vertebral sí o no) |
| **Corsé** | Gregson 2025 (Ia): no de rutina | Lo decide el médico; la app no lo pauta |
| **Electroterapia** | Gregson 2025 (IIb): un ensayo pequeño de corriente interferencial en el dolor crónico tras la fractura | No entra |

**Tests de la fase 4b que cargan el hueso** (medidos en el código, octubre 2026). Ninguna fuente leída habla de la precisión ni de la seguridad de estos tests en la osteoporosis: la línea sería una regla de técnica, como la de la hipermovilidad.

| Región | Hipótesis | Test | Carga |
|---|---|---|---|
| Lumbar | `lu1` | Hipomovilidad segmentaria (PAIVM, posteroanterior sobre cada espinosa) | Empuje posteroanterior sobre la vértebra |
| Lumbar | `lu2` | Test de inestabilidad en prono | Ídem |
| Lumbar | `lu7` | PA unilateral dolorosa o con menos movilidad | Ídem |
| Lumbar | `lu8` | Distracción · thrust de muslo · compresión · thrust sacro · Gaenslen | Pelvis y sacro |
| Cadera | `ca10` | Compresión pélvica · cluster de Laslett · thigh thrust | Pelvis y sacro |
| Cervical | `ce1` | PAIVM C0–C3 | Empuje posteroanterior |
| Cervical | `ce3` | Spurling (compresión axial) | Compresión axial cervical |
| Hombro | `h6` | Spurling (compresión axial) | Ídem |
| Cervical / hombro | `ce10`, `h9` | Palpación posteroanterior de la 1.ª costilla | Costilla |
| Tobillo y pie | `tp8`, `tp9`; rodilla `ro15` | Saltos en la batería de carga | Impacto |

Los tests de fractura de los miembros (`tp17` compresión del calcáneo, `tp33` carga axial del metatarsiano, `ca_os1`) ya buscan una fractura: no necesitan la línea.

### 2. Las banderas

| Cuadro | Qué lo sugiere | Fuente | Qué hace hoy la app | Qué propongo |
|---|---|---|---|---|
| **Fractura vertebral nueva** | Dolor de espalda brusco, sobre todo torácico, tras un esfuerzo pequeño (levantar algo desde la flexión, toser, estornudar, resbalar), en alguien con osteoporosis o factores de riesgo; dolor a la palpación de la espinosa; más cifosis | Gregson 2025 (fuerte); Finucane 2020, sección 3, tablas 3.1–3.3; Downie 2013 | Solo `l_e4`, en lumbar | `derivacion`: valoración médica pronto (radiografía) y, hasta entonces, sin terapia manual ni ejercicio con carga en esa zona (decisión 4) |
| **Compresión medular o radicular** | Dolor de espalda con debilidad, hormigueo o torpeza nuevos en las piernas, o cambios al orinar | Gregson 2025 («urgent referral to spinal surgical services»); Laurent 2022 | `l6` (cola de caballo), solo en lumbar | `urgencia`: urgencias hoy |
| **Pérdida de talla o cifosis** | ≥ 4 cm frente a su talla de joven (o 2 cm desde una medida anterior), o una cifosis que aumenta | Gregson 2025 (fuerte); Kanis 2019; Laurent 2022 | Nada | `derivacion` no urgente: buscar fracturas vertebrales (VFA). Solo si no consta ya una fractura vertebral |
| **Fractura atípica de fémur** | Dolor de muslo, ingle o cadera sin explicación en alguien con bifosfonato o denosumab | Gregson 2025 (fuerte: «the femur should be imaged»; restringir la carga) | Nada | `derivacion` preferente, sin impacto ni carga en esa pierna hasta la imagen |
| **Corticoides sin protección ósea** | Corticoides orales ≥ 7,5 mg/día durante 3 meses o más, sin tratamiento para el hueso | Gregson 2025 (fuerte: empezar la protección ósea a la vez; muy alto riesgo, «refer urgently») | `ca_os2` en cadera, solo para la osteonecrosis | `derivacion` no urgente a su médico (decisión 5) |
| **Mieloma o metástasis** | Fractura con cáncer conocido, dolor nocturno o en reposo, pérdida de peso; dolor óseo muy intenso | Kanis 2019; Finucane 2020; Downie 2013 | `l_cancer` en lumbar y las de cáncer de cada región | Nada nuevo: siguen igual |

### 3. El ejercicio recomendado (carga y equilibrio)

Brooke-Wavell 2022, que el NOGG cita para la dosis (Gregson 2025). [E] = evidencia; [C] = consenso.

**Para todos** (recuadro 1):
- Fuerza 2–3 días por semana [E], progresiva, hasta el peso que se levanta 8–12 veces y hasta 3 series [E]. Empezar con poca intensidad cuidando la técnica [E].
- Todos los grupos musculares, también los de la espalda [C], evitando la flexión con carga.
- Actividad diaria, sin largos ratos sentado [C].

**Sin fractura vertebral ni fracturas múltiples por baja energía** (recuadro 1, todo [C]):
- Impacto moderado la mayoría de los días (pisotones, trote, saltos bajos), al menos 50 impactos por sesión (por ejemplo, 5 × 10), sin caer desde altura.

**Con fractura vertebral o fracturas múltiples por baja energía** (recuadro 1, todo [C]):
- Impacto solo hasta caminar a paso ligero, 150 min por semana (20 min al día): «precautionary measure because of theoretical (unproved) risks».
- Consejo individual de un fisioterapeuta para el impacto y la fuerza, al menos al empezar.

**Tras una fractura vertebral dolorosa** (recuadro 3, todo [C]; Gregson 2025):
- Consejo pronto sobre cómo moverse y levantar cosas, para reducir el miedo [C]; derivación a fisioterapia [C].
- Extensores de espalda a diario, con poca intensidad (resistencia), 3–5 repeticiones mantenidas 3–5 s [C]. Con dolor, empezar en descarga, por ejemplo tumbado boca arriba (Gregson 2025, condicional).
- Fuerza progresiva con extensores (Gregson 2025, fuerte). El ejercicio supervisado por un fisioterapeuta mejora el dolor y la función física (Gregson 2025, Ib).
- Respiración y suelo pélvico con cifosis importante [C]; hidroterapia [C].
- La evidencia es baja: «the level of evidence about exercise in those with vertebral fracture is still low» (Brooke-Wavell 2022).

**Moverse con seguridad** (recuadro 3, todo [C]):
- «Think straight»: la parte alta de la espalda recta al agacharse y levantar; bisagra de cadera.
- Modificar o evitar la flexión mantenida, repetida o al final del recorrido, sobre todo con carga; en Pilates, alternativas al «roll down» y al «curl up».
- Sin límites de kilos: enseñar a levantar, no prohibir.
- Extensores de espalda para la postura, al menos dos veces por semana.

**Seguridad del ejercicio**: en los ensayos se fracturó el 5,8 % de los grupos de ejercicio frente al 9,6 % de los de control, sin fracturas vertebrales sintomáticas con el impacto ni con la fuerza de intensidad moderada a alta (Brooke-Wavell 2022). Para Gregson 2025 (Ia), el riesgo de efectos adversos graves «is very low».

### 4. Las caídas

- **Preguntar** si se ha caído en el último año (Montero-Odasso 2022, 1A; NICE NG249, 1.1.2). A todos los que tienen osteoporosis o una fractura por fragilidad (Gregson 2025, fuerte; Montero-Odasso 2022).
- **Riesgo alto** si la caída fue con lesión que necesitó tratamiento, 2 o más caídas en el año, fragilidad, no pudo levantarse solo o perdió el conocimiento (NICE NG249, 1.1.3; Montero-Odasso 2022): **valoración integral de caídas** (derivar).
- **Una caída sin esos criterios**: valorar la marcha y el equilibrio (NICE NG249, 1.1.4). Con alteración, programa de ejercicio de caídas (1.1.5) y valorar los riesgos del hogar (mejor un terapeuta ocupacional).
- **El ejercicio**: equilibrio exigente y ejercicio funcional (levantarse de la silla, pasos), ≥ 3 sesiones por semana, progresado al menos 12 semanas (Montero-Odasso 2022, 1A), unas 3 h por semana durante al menos 4 meses (Brooke-Wavell 2022 [E]; Gregson 2025, Ia). Tai chi o fuerza progresiva añadidos (Montero-Odasso 2022, 1B). Caminar solo no basta.
- **La preocupación por caerse**: se pregunta y se trata con ejercicio (Montero-Odasso 2022, 1B). Quien evita moverse por miedo a caerse, al servicio de caídas (Brooke-Wavell 2022 [C]).
- **Antes de caminar a paso ligero**, equilibrio y fuerza en quien tiene riesgo de caerse (Brooke-Wavell 2022 [C]).
- La **velocidad de marcha** (< 0,8 m/s; Montero-Odasso 2022, 1A) frente a «no usar herramientas de predicción» (NICE NG249, 1.1.1): ver la contradicción 11.

## La osteoporosis asociada al embarazo y la lactancia (PLO)

### Qué es

- **Fracturas por fragilidad, casi siempre vertebrales**, en el tercer trimestre o en los primeros meses de lactancia (Scioscia 2023; Qian 2021; Anagnostis 2024).
  - Suele ser el primer embarazo: 149 de 173 casos (Qian 2021); «two-thirds» (Anagnostis 2024; Carsote 2023).
  - Varias vértebras a la vez: 4,4 de media (Qian 2021).
  - T12–L2 lo más afectado (Qian 2021; Anagnostis 2024), pero **los casos solo torácicos no son raros**: 23 en Anagnostis 2024, y la localización torácica (31,4 %) supera a la lumbar (21,6 %) en Sözen 2026. El caso del usuario encaja.
  - Menos a menudo, cadera, sacro, húmero o costillas (Gak 2024). En la cadera empieza casi siempre en el embarazo (Weckerly 2026).
- **Por qué**: en la lactancia, la mama libera PTHrP y bajan los estrógenos, y la densidad ósea cae un 3–10 % en 2–6 meses, sobre todo en la columna lumbar (Scioscia 2023). En la mayoría se recupera entre 6 y 12 meses después del destete (Scioscia 2023). La PLO aparece cuando un hueso ya débil no aguanta ese gasto: «PLO is caused by a prior condition that prevents the skeleton from successfully undergoing the challenge of pregnancy and lactation» (Scioscia 2023).
- **Factores de riesgo**, presentes en hasta el 80–85 % (Scioscia 2023):
  - antecedentes familiares de osteoporosis (un tercio; Qian 2021; Anagnostis 2024);
  - heparina en el embarazo (28,8 % en Qian 2021) y corticoides;
  - IMC bajo, poco calcio, déficit de vitamina D, tabaco, trastornos de la alimentación;
  - variantes genéticas (LRP5, WNT1, COL1A1/A2) en hasta el 50 % (Gak 2024; Anagnostis 2024);
  - entre otros, el **Ehlers-Danlos** (Scioscia 2023, tabla 1) y el **lupus** (Carsote 2023, con poca significación).
- **Cómo se presenta**:
  - dolor de espalda intenso; limitación; pérdida de talla (Anagnostis 2024; Gak 2024);
  - «often interpreted as a typical pregnancy or postpartum symptom. Thus, this condition is usually misdiagnosed» (Scioscia 2023);
  - en una encuesta, solo el 4,4 % se confirmó en las 4 primeras semanas de dolor (Carsote 2023);
  - a los 6 meses, solo el 42 % podía cuidar sola del bebé (Carsote 2023);
  - el 59 % sigue con dolor más de 3 años (Gak 2024).
- **Diagnóstico** (médico): RM en el embarazo, radiografía y DXA en la lactancia; una DXA normal no la descarta (Carsote 2023); descartar causas secundarias y, en algunos casos, estudio genético (Anagnostis 2024; Gak 2024).
- **Tratamiento** (médico): calcio y vitamina D; destete (ver la contradicción 15); fármacos en los casos graves (Scioscia 2023).
- **Pronóstico**:
  - la densidad se recupera en la mayoría (Sözen 2026; Scioscia 2023);
  - nuevas fracturas en el 14,2 % (Anagnostis 2024);
  - puede repetirse en otro embarazo (hasta el 28 %; Anagnostis 2024), más si hubo varias fracturas al inicio (27 % frente a 10 %; Anagnostis 2024; Gak 2024).

### Lo que importa al fisioterapeuta

- **Sospecharla**: un dolor de espalda intenso, dorsal o lumbar, en el último trimestre o en los primeros meses de lactancia, que no se parece al dolor de espalda del embarazo, o con pérdida de talla. Es el mismo patrón que la fractura vertebral de la osteoporosis general, en una mujer joven y en un momento en que el dolor se atribuye a otra cosa.
- **Con el diagnóstico**:
  - Los mismos principios que con cualquier fractura vertebral por fragilidad (ver arriba: sin manipulación forzada, sin flexión con carga, extensores en descarga con dolor).
  - **Actividad**: «when fractures consolidate, after 3 to 6 months, these patients should be encouraged to perform reasonable, but not excessive, weight-bearing and physical resistance activity» (Scioscia 2023). Reanudar la actividad «carefully» (Carsote 2023, tras una fractura de estrés de tibia al reanudarla).
  - **Cuidar del bebé**: ninguna fuente leída dice cómo cogerlo, cargarlo ni amamantar. Lo que diga la app sería **extrapolación** de Brooke-Wavell 2022 (la espalda recta y la bisagra de cadera al agacharse y levantar; enseñar a levantar, no prohibir), y lo dirá así (decisión 12).
  - **El destete**, los fármacos, el corsé y la planificación del siguiente embarazo son del médico. La app no los aconseja (contradicciones 15 y 16).

### ¿Subtipo de esta tarjeta o enlace con «Embarazo y posparto»?

**Recomiendo las dos cosas, cada una para lo suyo** (decisión 12):

1. **La PLO diagnosticada, como causa dentro de esta tarjeta.** Una mujer con PLO **tiene** una osteoporosis con fracturas por fragilidad. Necesita lo mismo que cualquier fractura vertebral por fragilidad: la técnica, el ejercicio, la red de seguridad. Además lleva unas líneas propias: la actividad tras la consolidación, cuidar del bebé, que el destete lo decide el médico y que puede repetirse en otro embarazo. Si fuese una tarjeta aparte, repetiría casi todo; si fuese solo un enlace a «Embarazo y posparto», ese contenido de seguridad quedaría en una tarjeta que la paciente ya no necesita cuando deja de lactar.
2. **La sospecha de PLO, en la futura tarjeta «Embarazo y posparto».** Lo que falla en la PLO es el retraso: el dolor se atribuye al embarazo (Scioscia 2023; Carsote 2023). Quien está embarazada o lactando y aún no tiene el diagnóstico no tendrá marcada la tarjeta de osteoporosis, así que la pregunta de sospecha tiene que estar donde sí lo estará: en «Embarazo y posparto». Allí iría una pregunta con `derivacion`: «¿Tiene un dolor de espalda intenso y nuevo, dorsal o lumbar, en el último trimestre o desde el parto, distinto del dolor de espalda del embarazo, o ha perdido altura?» → «Posible fractura vertebral por osteoporosis del embarazo o la lactancia: valoración médica pronto».
3. **Mientras no exista «Embarazo y posparto»**: un párrafo de texto en el razonamiento de `l_e4` (la PLO como causa de fractura por fragilidad en una mujer joven) y la pista en la fila de la guía de condiciones especiales. Nada de lógica nueva.

**La osteoporosis transitoria de cadera** (dolor de cadera o ingle brusco en el tercer trimestre) queda para «Embarazo y posparto». Hoy la cadera no tiene ninguna pregunta de ella; la bandera de la fractura de estrés del sacro (`ca_oseo`) ya nombra el embarazo y el posparto.

## Relaciones con lo que ya existe

### Lupus (corticoides, osteonecrosis)

- **Son cosas distintas.**
  - La osteonecrosis es muerte del hueso por falta de riego, con dolor profundo en carga de cadera, rodilla, hombro o tobillo (Matthews 2023), y ya la deriva `les_d_osteonecrosis`.
  - La osteoporosis es hueso frágil que se rompe con poca carga.
  
  Los corticoides causan las dos.
- **El lupus es factor de riesgo de fractura**: Gregson 2025 lo pone en la tabla 3 («systemic lupus erythematosus»), y en el lupus la dosis acumulada de corticoides contribuye a la osteoporosis (Laurent 2022).
- **Recomiendo ninguna regla automática** (decisión 9), como entre las otras tarjetas. La tarjeta del lupus no marca la de osteoporosis ni al revés.
- **Sí, como texto**: con la tarjeta del lupus en «corticoides > 5–20» o «> 20», o con «dosis altas», una línea en su recuadro de la fase 5: «Con corticoides mantenidos, pregunta por la osteoporosis y las fracturas por fragilidad; si las tiene, marca también la tarjeta «Osteoporosis o fragilidad ósea» (Gregson 2025; Laurent 2022)». Es solo un recordatorio, sin datos compartidos.
- **Los tramos no coinciden**: el lupus corta en 5 y 20 (guías del lupus), y la osteoporosis en 7,5 (Gregson 2025). Recomiendo no unificarlos. Cada tarjeta pregunta lo que pide su guía, y si las dos están marcadas el fisio contesta las dos filas.
- La línea de la 4b del lupus («el hueso es más frágil… antes de ejercicios resistidos o movilizaciones, ten en cuenta la densidad ósea») no cambia. Con las dos tarjetas marcadas saldrían las dos líneas; la de osteoporosis es más concreta.

### La fractura vertebral por compresión del panel de tiempos (`fx_vertebral_compresion`)

- Hoy no la enlaza ninguna hipótesis, así que nunca sale en «Este paciente».
- **Recomiendo** (decisión 10):
  - que la tarjeta con fractura vertebral la enseñe en «Este paciente». Es una regla nueva de `filasPaciente()`, por condición en vez de por hipótesis;
  - con la causa «embarazo o lactancia», una línea en la fila: el plazo es de la fractura osteoporótica de la persona mayor, y en la PLO el dolor puede durar mucho más (Gak 2024);
  - revisar la nota de la fila con Gregson 2025 por lo del corsé (contradicción 3) y la vertebroplastia (contradicción 4). Es otra PR, de la Fase J.

### Preguntas de cribado existentes sobre fractura o corticoides

| Pregunta o bandera | Región | Qué hace | Con la tarjeta |
|---|---|---|---|
| `l_e4` (osteoporosis o fractura ante un golpe menor) | Lumbar | Pregunta del cribado, con `alerta` | No cambia. Su razonamiento añade el párrafo de la PLO y «mira la tarjeta Osteoporosis». Con la tarjeta marcada, sigue saliendo (no se oculta: un SÍ marcado desaparecería de los datos) |
| Banderas de `l_espondilo` y `l_cancer` | Lumbar | Fractura por insuficiencia, fractura patológica | No cambian |
| `ca_os2` (corticoides, alcohol, lupus) | Cadera | Osteonecrosis | No cambia |
| Fractura de estrés del sacro (`ca_oseo`) | Cadera | Ya nombra osteoporosis, embarazo y posparto | No cambia |
| `h_t1` («Tener en cuenta la osteoporosis») | Hombro | Caída, fractura o luxación | No cambia |
| `cv_ar3` | Cervical | Traumatismo en la persona mayor | No cambia |
| `tp_o2` (> 2 fracturas de estrés → densidad ósea) | Tobillo y pie | Derivar | No cambia |
| `les_d_osteonecrosis`, `les_u_fiebre` | Lupus | Derivación y urgencia | No cambian |

**Garantía**, como en las otras tarjetas: marcar la tarjeta nunca quita ni rebaja una `urgencia` de ningún sistema, con prueba unitaria en las 7 regiones.

### El futuro «paciente anticoagulado o antiagregado»

- **Comparten la pregunta de la técnica**, por motivos distintos: en el anticoagulado, el hematoma; en la osteoporosis, la fractura. Las dos líneas de la 4b serían distintas y podrían salir juntas.
- **La heparina** en el embarazo es un factor de riesgo de la PLO (28,8 % en Qian 2021; la de bajo peso molecular, menos que la convencional, según Sözen 2026). Ni Gregson 2025 ni Laurent 2022 tratan los anticoagulantes como causa de osteoporosis.
- **Recomiendo ninguna regla automática** entre las dos, y que el diseño del anticoagulado lea este documento.

### Otras tarjetas

- **Trastorno mastocitario**: Kanis 2019 cuenta la **mastocitosis sistémica** entre lo que aparece al estudiar a quien parecía tener una osteoporosis primaria. Recomiendo una frase en el razonamiento de la pregunta de la tarjeta de osteoporosis, sin regla.
- **Hipermovilidad**: el Ehlers-Danlos está en la tabla de factores de riesgo de la PLO (Scioscia 2023), y Engelbert 2017 (p. 164) pide pensar en la osteogénesis imperfecta ante la fragilidad ósea con fracturas (`docs/hipermovilidad.md`). Solo texto, sin regla.
- **Disautonomía**: no hay relación en las fuentes leídas, salvo que las dos tarjetas hablan de caídas. Sin regla.
- **Posquirúrgico**: la cifoplastia o vertebroplastia previa no tiene plazos en las fuentes (ya lo dice el panel de tiempos).

## Formas posibles, de menos a más

| # | Forma | Qué añade | A favor | En contra |
|---|---|---|---|---|
| 0 | Nada | — | — | Sigue sin pregunta de osteoporosis fuera de lumbar, sin aviso en la fase 6 y sin dosis de ejercicio |
| 1 | **Solo texto** | Un párrafo de la PLO en `l_e4`; una línea de Maitland 2005 en el aviso de manipulación de la fase 6 | Sin lógica nueva | No llega a las otras 6 regiones ni a la fractura torácica; sin ejercicio ni caídas |
| 2 | **Tarjeta reducida, solo «Diagnosticada»** | Fase 1 con los datos de la tarjeta; línea en la 4b; recuadro en la fase 5; aviso y red en la fase 6 | Cubre al paciente que ya lo sabe, que es lo más frecuente | Sin las preguntas de la fase 2, la fractura nueva y la compresión medular solo se preguntan en lumbar |
| 3 | **Tarjeta con «Diagnosticada» y «Sospecha» y su sistema en la fase 2** | Lo de la 2 + el sistema propio (urgencia, derivaciones, caídas) y, con «Sospecha», la derivación para valorar el riesgo de fractura | Mismo patrón que la hipermovilidad, el POTS y el lupus. La sospecha tiene una regla medida: el NOGG pide valorar el riesgo (FRAX) a partir de los 50 años con un factor de riesgo (fuerte) | Una tarjeta más, con más filas que la de mastocitos |
| 4 | Forma 3 + reglas con otras tarjetas | Marcar la osteoporosis desde el lupus | — | Sin base; va contra la decisión 5 de `docs/pots.md` |

**Recomiendo la forma 3.** La «Sospecha» tiene aquí lo que le faltaba al trastorno mastocitario: una regla publicada que el fisio puede aplicar sin pruebas propias (edad, factores de riesgo) y que lleva a una derivación, no a un diagnóstico.

## Forma recomendada (forma 3), en borrador

Mismos principios que las otras condiciones:
- capa transversal;
- el árbol CIF y el motor de puntuación no se tocan;
- el fisio no diagnostica;
- la seguridad nunca se recorta;
- lo que no tiene fuente va marcado como redacción propia y es una decisión tuya.

### Fase 1 — tarjeta «Osteoporosis o fragilidad ósea» (`#cardOsteoporosis`)

- Va después de «Trastorno mastocitario o anafilaxia», antes de Cronología. No se pliega en modo breve.
- **Estados**: No consta (por defecto) · Diagnosticada · Sospecha. Un segundo toque desmarca.
- **Nota de la tarjeta** (redacción propia): «Márcala si le han diagnosticado una osteoporosis o ha tenido una fractura con un golpe pequeño o sin golpe (una caída desde su altura o menos). «Sospecha»: 50 años o más con algún factor de riesgo, o una mujer en el embarazo o la lactancia con un dolor de espalda nuevo e intenso.» La segunda parte depende de la decisión 12.
- **Con «Diagnosticada»**, cinco filas, cada una con «No lo sabe» y desmarcable:

| Fila | Opciones | Para qué | Fuente |
|---|---|---|---|
| **Causa o contexto** | Posmenopáusica o por la edad · Por corticoides · Asociada al embarazo o la lactancia · Otra causa · No lo sabe | Las líneas propias de la PLO y de los corticoides | Kanis 2019, tabla 4; Laurent 2022; PLO (arriba) |
| **Fracturas vertebrales** | Ninguna conocida · 1 · 2 o más; y una casilla «alguna en los 2 últimos años o aún le duele» | El impacto del ejercicio; el riesgo muy alto; el panel de tiempos | Brooke-Wavell 2022, recuadro 1; Gregson 2025 (muy alto riesgo: fractura vertebral en los 2 últimos años o ≥ 2) |
| **Otras fracturas por fragilidad** | Casilla: cadera, muñeca, húmero, pelvis u otra | «Fracturas múltiples por baja energía» del recuadro 1 | Brooke-Wavell 2022 |
| **Tratamiento para el hueso** | Ninguno · Bifosfonato o denosumab · Otro (teriparatida…) · No lo sabe | La fractura atípica de fémur | Gregson 2025, recomendación 12 de efectos adversos raros |
| **Corticoides orales 3 meses o más** | No · Menos de 7,5 mg/día · 7,5 mg/día o más · No lo sabe | La derivación por falta de protección ósea | Gregson 2025 (fuerte); Laurent 2022 |

- **Con «Sospecha»**: nada más en la tarjeta. La sospecha se trabaja en la fase 2.
- La clase `body.osteoporosis` muestra los elementos `.solo-op`. Un cambio vacía la 4b y repinta el cribado, como en las demás.

### Fase 2 — sistema «Osteoporosis» (`SIS_OSTEOPOROSIS`, `transversal_osteoporosis`, `soloOsteoporosis: true`)

Sexto sistema de las 7 regiones, tras el de mastocitos. Sin embudo en modo breve, y no cuenta como «sistema sin cribar». Ids con el prefijo `op_`.

**A. Urgencia** (con los dos estados; `urgencia`, `.sq2-urg`, nunca se pliega):

| id | Pregunta (borrador) | `urgencia` (borrador) | Fuente |
|---|---|---|---|
| `op_u_medula` | ¿Tiene un dolor de espalda nuevo con debilidad, hormigueo o torpeza en las piernas que va a más, o cambios al orinar o al hacer de vientre? | Posible compresión de la médula o de las raíces por una fractura vertebral: urgencias hoy. | Gregson 2025 («impending or existing neurological deficits, urgent referral to spinal surgical services»); Laurent 2022 |

En lumbar convive con `l6` (cola de caballo), igual que `les_u_neuro` del lupus: preguntan cosas parecidas desde motivos distintos, y ninguna se oculta.

**B. Derivaciones no urgentes** (`derivacion`; van a `dv[]` y no bloquean la fase 6):

| id | Pregunta (borrador) | `derivacion` (borrador) | Fuente | Con |
|---|---|---|---|---|
| `op_d_fractura` | ¿Le empezó de golpe un dolor de espalda, sobre todo en la zona dorsal, tras un esfuerzo pequeño (levantar algo agachado, toser, estornudar, resbalar), y no se le ha ido? | Posible fractura vertebral nueva: valoración médica pronto (radiografía). Hasta entonces, sin terapia manual ni ejercicios con carga sobre esa zona. | Gregson 2025 (fuerte); Finucane 2020, sección 3; Downie 2013 (la terapia manual) | Los dos estados |
| `op_d_talla` | ¿Ha perdido 4 cm o más de altura respecto a cuando era joven (o 2 cm desde la última vez que la midieron), o se le ha curvado más la espalda? | Posible fractura vertebral no diagnosticada: que su médico valore buscarla (radiografía o DXA lateral). | Gregson 2025 (fuerte); Kanis 2019; Laurent 2022 | Los dos estados, salvo que ya conste una fractura vertebral |
| `op_d_femur` | ¿Tiene un dolor de muslo, ingle o cadera sin explicación? | Con bifosfonato o denosumab, puede anunciar una fractura atípica de fémur: valoración médica pronto (imagen del fémur), sin impacto ni carga de esa pierna hasta entonces. | Gregson 2025 (fuerte) | Solo con «Bifosfonato o denosumab» |
| `op_d_corticoides` | (Sin pregunta: sale de la fila de la tarjeta) | Corticoides de 7,5 mg/día o más durante 3 meses o más, sin tratamiento para el hueso: que su médico valore la protección ósea. | Gregson 2025 (fuerte) | Con esa fila y «Ninguno» en tratamiento (decisión 5) |

**C. Sospecha: valorar el riesgo de fractura** (solo con «Sospecha»; un «sí» no es una bandera: va en `state.osteoporosis.factores`, como el cuestionario de la hipermovilidad). Factores que, a partir de los 50 años, piden valorar el riesgo de fractura (Gregson 2025, «A FRAX assessment should be performed in any postmenopausal woman or man age ≥ 50 years, with a clinical risk factor», fuerte; Kanis 2019, tabla 4):

| id | Factor (borrador) |
|---|---|
| `of1` | Una fractura con un golpe pequeño o sin golpe, desde los 50 años |
| `of2` | Corticoides orales 3 meses o más |
| `of3` | Su padre o su madre se rompió la cadera |
| `of4` | Menopausia antes de los 45 años |
| `of5` | Artritis reumatoide, lupus u otra enfermedad inflamatoria |
| `of6` | Dos caídas o más en el último año |

- **Resultado**, con la edad (`state.edadPaciente`, con aviso si falta):
  - **50 o más y algún factor**: «Que su médico valore el riesgo de fractura (FRAX y, si procede, densitometría) (Gregson 2025).»
  - **Menos de 50**: el NOGG no cubre a la mujer premenopáusica ni al hombre de menos de 50, y pide estudio especializado si hay fracturas por fragilidad (Gregson 2025, introducción). Con `of1`: «Fractura por fragilidad antes de los 50: valoración médica (causas secundarias).»
- La lista viene de las tablas de las guías, pero la selección de 6 factores es mía (decisión 3). La app nunca calcula el FRAX.

**D. Caídas** (con los dos estados; en `state.osteoporosis.caidas`, nunca en `sistemicoAnswers`):
- «¿Se ha caído en el último año?» No · 1 vez · 2 o más.
- Con alguna caída, las casillas de NICE NG249, 1.1.3: se lesionó y necesitó tratamiento · no pudo levantarse solo · perdió el conocimiento · fragilidad.
- **Resultado**:
  - 2 o más, o alguna casilla: «Riesgo alto de caídas: valoración integral de caídas (NICE NG249, 1.1.3; Montero-Odasso 2022).»
  - 1 caída sin casillas: «Valora la marcha y el equilibrio; si están alterados, programa de ejercicio de caídas (NICE NG249, 1.1.4–1.1.5).»
  - Ninguna: «Equilibrio y fuerza al menos dos veces por semana (Brooke-Wavell 2022).»
- La pérdida de conocimiento enlaza con `sx_sincope`, que ya está en cada región.
- Opcional (decisión 8): la velocidad de marcha con su corte de 0,8 m/s (Montero-Odasso 2022, 1A).

Cada pregunta lleva su `razonamiento` (Fase F) y cada bandera, su enlace (Fase M).

### Fases 3 y 4

**Sin cambios.** Las fuentes no dicen que la osteoporosis cambie la irritabilidad ni el árbol. La fractura vertebral nueva ya la recogen la derivación de la fase 2 y la línea de la 4b.

### Fase 4b — línea de técnica en los tests que cargan el hueso, sin tocar las LR

- **Campo opcional** `cargaOsea: true` en los tests de la tabla de arriba, como `laxitud`. Una prueba unitaria fija la lista.
- **Con la tarjeta activa**, bajo el «cuánto pesa» del test (redacción propia sobre Maitland 2005 y Downie 2013):
  > «Osteoporosis: este test carga el hueso. Con una fractura vertebral reciente o sospechada en la zona, no lo hagas hasta que la valore el médico; si no, con fuerza progresiva y sin empujes bruscos.»
- **Alternativa** (decisión 7): una sola línea general encima de las hipótesis, como la del lupus, sin campo por test.

### Fase 5 — recuadro «Osteoporosis» (`.op-fase5`, nunca se pliega)

Al principio, junto a los recuadros de las otras condiciones. Cada línea va pegada a su fuente:
- **Qué tiene**: causa, fracturas, tratamiento, corticoides, caídas.
- **Siempre (ejercicio)**: «Fuerza progresiva 2–3 días por semana, hasta el peso que levanta 8–12 veces y hasta 3 series, empezando suave con buena técnica; todos los grupos musculares, también la espalda, sin flexión con carga (Brooke-Wavell 2022, recuadro 1).»
- **Sin fractura vertebral**: «Impacto moderado la mayoría de los días: unos 50 impactos por sesión (pisotones, trote, saltos bajos), sin caer desde altura (Brooke-Wavell 2022, consenso).»
- **Con fractura vertebral o varias fracturas por fragilidad**: «Impacto solo hasta caminar a paso ligero, 150 min por semana, por precaución, sin pruebas de que más sea peligroso; consejo individual del fisioterapeuta al empezar (Brooke-Wavell 2022, consenso).»
- **Con fractura vertebral reciente o dolorosa**: «Extensores de espalda a diario, suaves, 3–5 repeticiones mantenidas 3–5 s; con dolor, empieza tumbado boca arriba. El ejercicio supervisado por un fisioterapeuta mejora el dolor y la función (Brooke-Wavell 2022, recuadro 3; Gregson 2025).»
- **Siempre (moverse)**: «Espalda recta al agacharse y levantar (bisagra de cadera); modifica la flexión mantenida, repetida o al final del recorrido, sobre todo con carga; la torsión suave sí. Enseña cómo, no prohíbas (Brooke-Wavell 2022, recuadro 3; Gregson 2025).»
- **Siempre (técnica)**: «Sin manipulación forzada; la movilización suave puede ser adecuada (Maitland 2005, cap. 9, p. 223).»
- **Siempre (seguridad)**: «Un dolor de espalda brusco tras un esfuerzo pequeño puede ser una fractura vertebral nueva: valoración médica; con debilidad u hormigueo en las piernas, urgencias (Gregson 2025).»
- **Caídas**: la línea del resultado del bloque D y, con riesgo, la dosis: «Equilibrio exigente y ejercicio funcional, 3 o más sesiones por semana, unas 3 h por semana durante al menos 4 meses (Montero-Odasso 2022; Brooke-Wavell 2022).»
- **Con bifosfonato o denosumab**: «Si aparece un dolor de muslo, ingle o cadera sin explicación, imagen del fémur antes de cargar (Gregson 2025).»
- **Con la PLO**: «Con las fracturas consolidadas, a los 3–6 meses, actividad en carga y de fuerza razonable, sin excesos (Scioscia 2023). Al coger y cargar al bebé, la misma bisagra de cadera (extrapolado de Brooke-Wavell 2022). El destete y otro embarazo los decide con su médico.»
- **Lo médico**: «Los fármacos, el calcio, la vitamina D y el corsé los indica el médico.»

### Fase 6 — plan de tratamiento

- **Aviso `osteoporosis`** en todas las regiones, con las líneas de ejercicio de la fase 5 según la tarjeta.
- **Sin manipulación forzada** (decisión 6): con la tarjeta marcada, el plan nunca sugiere un escalón con thrust en la columna ni en las costillas. Fuente: Maitland 2005, cap. 9, p. 223; se vuelve a comprobar en el PDF antes de implementar.
- **Red de seguridad** `RED_OSTEOPOROSIS`, con cualquier plan y la tarjeta en «Diagnosticada», para el cierre de la sesión y el programa para casa (borrador):
  > «Si te empieza de golpe un dolor de espalda fuerte tras un esfuerzo pequeño, para y que te vea el médico; si además notas debilidad u hormigueo en las piernas, o cambios al orinar, ve a urgencias.»
  
  Fuentes: Gregson 2025; Finucane 2020.
- **No cambian** el nivel A/B/C, la frecuencia ni la irritabilidad.
- Con el SÍ de `op_u_medula`, la fase 6 se bloquea como con cualquier urgencia. Las derivaciones `op_d_*` no la bloquean.

### Salidas

- **Payload `op`**, solo con la tarjeta activa (así la huella de los informes con IA anteriores no cambia).
  - Con «Diagnosticada»: `{ es, ca, fv, fv2, fo, tr, gc, cd }`: estado, causa, fracturas vertebrales, reciente o dolorosa, otras fracturas, tratamiento, corticoides, caídas.
  - Con «Sospecha»: `{ es, fs, cd }`: estado, factores y caídas.
  
  Las urgencias van a `ur[]` y las derivaciones a `dv[]`, como siempre. physiq-report lo leería con una copia literal de `bloqueOPIA()`, en otra PR.
- **📋 Notas**: «🦴 OSTEOPOROSIS: diagnosticada · por embarazo o lactancia · 3 fracturas vertebrales (recientes) · sin tratamiento para el hueso · 1 caída».
- **📄 Informe**:
  - Con «Diagnosticada», en antecedentes: «Osteoporosis (diagnosticada)», con las fracturas.
  - Con «Sospecha»: «Se recomienda que su médico valore el riesgo de fractura», **sin la palabra osteoporosis**, como en las otras sospechas.
- **Informe con IA**: bloque «Osteoporosis» en `contextoValoracion()`, sin citas. Con la sospecha: «no escribas que el paciente tiene osteoporosis». `lib/reglas-informe.js` no se toca.
- **Modo breve**:
  - con «Diagnosticada», las fracturas vertebrales sin contestar son un pendiente (cambian el ejercicio);
  - con «Sospecha», los factores sin contestar;
  - la urgencia siempre se ve.

### Guía de condiciones especiales

Una fila, después del trastorno mastocitario:
- **Nombre**: «Osteoporosis o fragilidad ósea».
- **Qué es** (redacción propia): «Hueso con menos masa y peor estructura, que se rompe con un golpe pequeño o sin golpe.»
- **Piensa en ella si**:
  - tiene 50 años o más y se rompió algo con una caída desde su altura (`of1`, `l_e4`);
  - toma corticoides orales desde hace 3 meses o más (`of2`, `ca_os2`);
  - está embarazada o lactando y tiene un dolor de espalda nuevo e intenso (decisión 12).
- **Añade**: sus urgencias y derivaciones en la fase 2, las caídas, una línea en los tests que cargan el hueso, el ejercicio y la red de seguridad del plan.
- **Fuentes**: Gregson 2025 · Brooke-Wavell 2022 · Scioscia 2023.

## Fuera de este diseño (apuntado, no resuelto)

- **La región torácica.** La app no tiene región torácica: la fractura vertebral torácica de la paciente del usuario se valoraría desde lumbar o cervical, sin árbol ni tests propios. La tarjeta es transversal y cubre la seguridad, pero no la valoración. Una región torácica sería un trabajo aparte, como cualquier región nueva (`CLAUDE.md`, `data/<region>.js`).
- **Una pregunta de osteoporosis en las 6 regiones sin `l_e4`.** Hoy solo lumbar pregunta por la osteoporosis a quien no tiene marcada ninguna tarjeta. Como la pregunta de síncope de la decisión 9 de `docs/pots.md`, es un hueco previo que se apunta en vez de taparlo aquí.
- **La osteoporosis transitoria de cadera** del embarazo: en «Embarazo y posparto».

## Decisiones (cada una con mi recomendación)

1. **¿Entra, como capa transversal con documento propio?** *Recomiendo sí a las dos.* Cambia la seguridad (fractura con poca carga, técnicas, caídas, compresión medular) y la interpretación del dolor de espalda brusco, y sale en cualquier región, también en la columna torácica, que no tiene región.
2. **¿Qué forma?** *Recomiendo la forma 3*: tarjeta con «Diagnosticada» y «Sospecha» y su sistema en la fase 2. *Alternativa*: la forma 2, solo «Diagnosticada», como el trastorno mastocitario.
3. **La «Sospecha» y sus 6 factores.** *Recomiendo* la regla del NOGG (50 años o más y un factor → que su médico valore el riesgo de fractura), con mi selección de 6 factores de sus tablas, y sin calcular nunca el FRAX. *Alternativa*: copiar la tabla 3 entera, más larga.
4. **`op_d_fractura` como `derivacion`, no como `urgencia`.** *Recomiendo `derivacion`* («valoración médica pronto») con «sin terapia manual ni carga en esa zona hasta entonces». Finucane 2020 pide una radiografía primero, sin urgencia, salvo los signos neurológicos, que ya cubre `op_u_medula`. *Alternativa*: `urgencia` «valoración médica hoy».
5. **La derivación por corticoides sin protección ósea** (`op_d_corticoides`). *Recomiendo sí*: la apoya una recomendación fuerte del NOGG y el fisio puede ser quien lo detecte. *Alternativa*: dejarla en el recuadro de la fase 5 como texto, sin `dv[]`.
6. **Manipulación forzada fuera del plan de la fase 6** con la tarjeta marcada (Maitland 2005, cap. 9, p. 223). *Recomiendo sí*, después de volver a comprobar el pasaje en el PDF de Maitland 2005 (lo leyó la Fase L). Es la única regla de técnica con fuente leída.
7. **La línea de la 4b.** *Recomiendo* el campo `cargaOsea: true` en los tests de la tabla, con la redacción propia de arriba. *Alternativa*: una sola línea general encima de las hipótesis, como el lupus. Dime también si quitas o añades tests de la lista.
8. **Las caídas.** *Recomiendo* el bloque con las preguntas de NICE NG249 (1.1.2–1.1.5), sin puntuar riesgo, y la dosis de Brooke-Wavell 2022 y Montero-Odasso 2022. ¿Añado la velocidad de marcha (< 0,8 m/s, Montero-Odasso 2022) como medida opcional, aunque NICE pida no usar herramientas de predicción?
9. **Ninguna regla automática** con el lupus, el anticoagulado, la hipermovilidad ni los mastocitos. Solo texto: la línea de recordatorio en el recuadro del lupus con corticoides, y la frase de la mastocitosis sistémica (Kanis 2019). *Recomiendo esto.*
10. **El panel de tiempos de tejido.** *Recomiendo*:
    - que la tarjeta con fractura vertebral enseñe `fx_vertebral_compresion` en «Este paciente», con una regla por condición;
    - revisar en otra PR (Fase J) la nota de esa fila con Gregson 2025 (corsé, vertebroplastia).
11. **Payload `op` y physiq-report.** *Recomiendo* el campo compacto, solo con la tarjeta activa, y la PR de physiq-report después.
12. **La PLO.** *Recomiendo*:
    - como **causa dentro de esta tarjeta** («Asociada al embarazo o la lactancia»), con sus líneas propias;
    - su **sospecha en la futura tarjeta «Embarazo y posparto»**, como `derivacion`;
    - mientras tanto, un párrafo en `l_e4` y la pista en la guía.
    
    Y dos confirmaciones:
    - la app nunca aconseja el destete (lo decide el médico);
    - lo de cargar al bebé va como extrapolación marcada, porque ninguna fuente lo trata.
    
    *Alternativa*: una tarjeta propia de la PLO, que repetiría casi todo lo de la osteoporosis.
13. **PDF que conviene pedir antes de implementar.** *Recomiendo* al menos:
    - Hadji 2026 (la declaración de posición sobre la PLO), que puede cambiar la decisión 12;
    - Puentedura 2015 (manipulación torácica), que puede afinar las decisiones 6 y 7;
    - Giangregorio 2014 (Too Fit To Fracture).
    
    Opcionales: Gibbs 2019, Kovacs y Ralston 2015, Issa 2026 y las páginas de Maitland 2005 que trae la Fase L, para volver a comprobar el pasaje (hecho: tanda 3, cap. 9, p. 223).
14. **Registro de referencias.** *Recomiendo* registrar solo las que use el texto final:
    - nuevas: `Gregson 2025`, `Brooke-Wavell 2022`, `Kanis 2019`, `Laurent 2022`, `Montero-Odasso 2022`, `NICE NG249`, `Scioscia 2023`, `Qian 2021`, `Anagnostis 2024`, `Carsote 2023`, `Gak 2024`, y `Sözen 2026` y `Weckerly 2026` si salen en algún texto;
    - reusadas: `Downie 2013`, `Finucane 2020`, `Maitland 2005`.
    
    Si un texto nuevo cita algo de Finucane 2020 que no esté ya en `l_e4`, se comprueba antes en el original inglés.

## Cambios técnicos previstos (si se aprueba la forma 3)

```js
osteoporosis: {
  estado: '',          // '' (no consta) | 'diagnosticada' | 'sospecha'
  causa: '',           // '' | 'edad' | 'corticoides' | 'plo' | 'otra' | 'ns'
  vertebrales: '',     // '' | '0' | '1' | '2' | 'ns'
  reciente: false,     // alguna vertebral en los 2 últimos años o aún dolorosa
  otras: false,        // otras fracturas por fragilidad
  tratamiento: '',     // '' | 'no' | 'antirresortivo' | 'otro' | 'ns'
  corticoides: '',     // '' | 'no' | 'b' (< 7,5) | 'a' (≥ 7,5) | 'ns'
  factores: {},        // { of1…of6: 'SI' | 'NO' } (Sospecha)
  caidas: null,        // null | { n: '0' | '1' | '2', lesion, suelo, conciencia, fragilidad }
}
```

- `lib/osteoporosis.js`, puro, con pruebas unitarias (`tests/unit/osteoporosis.mjs`):
  - estado normalizado y visibilidad;
  - el resultado de la sospecha (edad y factores);
  - el resultado de las caídas;
  - qué derivaciones salen;
  - payload `op`;
  - textos de 📋 Notas, 📄 Informe e IA (`bloqueOPIA()`);
  - pendientes del modo breve.
- `SIS_OSTEOPOROSIS` en `data/comun.js`, en las 7 regiones (después de `SIS_MASTOCITOS`), con razonamiento y banderas enlazadas.
- `cargaOsea: true` en los tests elegidos.
- `AVISOS_OSTEOPOROSIS` y `RED_OSTEOPOROSIS` en `data/plan-tratamiento.js`, y el tope del escalón; después, `node tests/gen-frases-plan.mjs`.
- La fila en `data/condiciones.js`; la regla por condición en `filasPaciente()` (`lib/tejidos.js`).
- Las referencias en `data/referencias.js`; después, `node tests/gen-referencias.mjs`.
- `_softResetApp()`, la restauración de sesión, exportar e importar, y `deploy-to-hub.yml` para `lib/osteoporosis.js`.
- **Pruebas**:
  - nada sin la tarjeta;
  - marcar la tarjeta no quita ni rebaja ninguna `urgencia` de ningún sistema en las 7 regiones;
  - `op` solo con la tarjeta;
  - la sospecha sin la palabra osteoporosis en el 📄 Informe;
  - la lista de `cargaOsea`;
  - sin manipulación en el plan;
  - el inventario de banderas;
  - `OP_CASOS`, el texto literal que copiará physiq-report;
  - sección `osteoporosis` de la prueba de humo, a 320 px y en el hub.

## Siguiente paso

1. ~~Tus decisiones (1–14)~~ Hecho: aceptadas las 14 recomendaciones.
2. Los PDF de la decisión 13, en tandas:
   - ~~tanda 1~~ hecho: Puentedura 2015 y Giangregorio 2014;
   - ~~tanda 2~~ hecho: Hadji 2026;
   - ~~imprescindible antes de implementar la decisión 6: Maitland 2005, cap. 9~~ hecho (tanda 3): el pasaje está en la p. 223;
   - opcionales: Giangregorio 2015, Gibbs 2019, Kovacs y Ralston 2015, Issa 2026, Sherrington 2019 y Hardcastle 2022.
3. ~~Tus decisiones sobre la tanda 1~~ Hecho: aceptados C1–C7 y la decisión 15. Aceptados también H1–H5 (tanda 2) y M2 (tanda 3), octubre 2026. Siguiente: la implementación.
   - La decisión 14 suma `Puentedura 2015`, `Giangregorio 2014` y `Hadji 2026` al registro, si los textos los citan.
4. La implementación, en la rama de trabajo, y tu revisión en la app antes de `main`.
5. physiq-report: leer `op` del payload, en otra PR.
