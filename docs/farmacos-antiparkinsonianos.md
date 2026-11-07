# Familia 14 de la guía de fármacos: antiparkinsonianos y agonistas dopaminérgicos — borrador

Estado: **escrita; decisiones 1–7 aceptadas por el usuario (noviembre 2026); la revisión del contenido de la familia, pendiente.** Ver «Escritura (noviembre 2026)» al final. Viene de la lista «Fuera de este diseño» de `docs/parkinson.md` («Los fármacos antiparkinsonianos como familia de la guía de fármacos»). El usuario la pidió el 2026-11. Se sigue el procedimiento por familia de `docs/farmacologia.md` (paso 2), con sus límites:
- nunca se propone cambiar, suspender ni ajustar la medicación;
- no hay interacciones;
- el fármaco concreto se consulta en CIMA;
- nada rebaja una urgencia.

Las pistas de abajo dicen **qué buscar**: no son contenido. Cada frase de la familia saldrá de una fuente leída en la sesión.

## Por qué una familia y no solo la tarjeta de Parkinson

- **Hay pacientes sin Parkinson que los toman.** El pramipexol, el ropinirol y la rotigotina también se recetan en el síndrome de piernas inquietas, y la amantadina tiene otros usos. Hoy sus efectos solo aparecen si se marca la tarjeta de Parkinson.
- **Qué gana el paciente marcado:** con contenido, la familia entra sola en «Fármacos que toma» (`familiasMarcables()`), con su chip, el filtro «Este paciente» de la guía, la línea de 📋 Notas, el bloque de la IA y, si se decide, el aviso de la fase 6.
- **Riesgo: el mismo contenido en dos sitios.** La tarjeta de Parkinson ya habla del on/off, la hipotensión ortostática, los ataques de sueño y la retirada de la medicación (`pk_d_medicacion`). Regla propuesta (decisión 3): la familia habla **del fármaco** y la tarjeta **de la enfermedad**. Ninguna copia frases de la otra; la tarjeta enlaza a la familia.

## Qué fármacos (ejemplos y CIMA)

Propuesta de `ejemplos`, todos con presentación en España; cada nombre de `cima` debe aparecer en `ejemplos` (test unitario):

| Grupo | Principios activos (`cima`) |
|---|---|
| Levodopa con inhibidor de la descarboxilasa | levodopa (con carbidopa o benserazida) |
| Agonistas dopaminérgicos | pramipexol, ropinirol, rotigotina, apomorfina |
| Inhibidores de la MAO-B | rasagilina, safinamida, selegilina |
| Inhibidores de la COMT | entacapona, opicapona |
| Otros | amantadina |
| Anticolinérgicos (decisión 2) | trihexifenidilo, biperideno |

## Pistas por apartado (qué buscar en las fuentes)

- **Dolor, inflamación y curación:** dolor y distonía en off o de fin de dosis (dolor que cambia con la toma); dolor con las discinesias.
- **Síntomas viscerales o secundarios:** náuseas, estreñimiento, edema de piernas (agonistas, amantadina), livedo reticularis (amantadina), discinesias, alucinaciones y confusión (más en mayores y con anticolinérgicos), retención urinaria y boca seca (anticolinérgicos).
- **Ejercicio:** hipotensión ortostática al empezar o subir la dosis; mareo y caídas; discinesias y equilibrio; entrenar en la fase on (sin repetir la línea de la tarjeta, decisión 3).
- **Sueño:** somnolencia diurna y ataques de sueño (agonistas), conducir; insomnio y pesadillas.
- **Cuándo consultar:** nunca aconsejar dejarlos; si los ha dejado o no puede tomarlos, el riesgo de la retirada brusca (enlaza con `pk_d_medicacion`); trastornos del control de impulsos (juego, compras, sexualidad, comida) con agonistas; alucinaciones o confusión nuevas; en piernas inquietas, el empeoramiento con el tratamiento (*augmentation*).

## Fuentes

**Ya en el registro** (leídas para la tarjeta de Parkinson; se reutiliza solo lo leído): `NICE NG71` (no retirar de golpe, 1.3.2–1.3.4; somnolencia, 1.5.1; hipotensión ortostática, 1.5.8; el control de impulsos habría que leerlo, si está), `Simonet 2019` (retirada, ataques de sueño, ortostatismo), `Keus 2014` (fluctuaciones, 6.7.2), `Osborne 2022`.

**StatPearls, en PDF del usuario** (NCBI pide reCAPTCHA desde el entorno):

| Capítulo | Enlace | Para qué |
|---|---|---|
| Levodopa (L-Dopa) | https://www.ncbi.nlm.nih.gov/books/NBK482140/ | Efectos adversos, fluctuaciones, discinesias, retirada |
| Dopamine Agonists | https://www.ncbi.nlm.nih.gov/books/NBK551686/ | Ataques de sueño, control de impulsos, edema, ortostatismo; uso en piernas inquietas |
| Carbidopa | https://www.ncbi.nlm.nih.gov/books/NBK554552/ | Solo si la de levodopa no cubre la combinación |
| Levodopa/Carbidopa/Entacapone Combination Therapy | https://www.ncbi.nlm.nih.gov/books/NBK599508/ | Inhibidores de la COMT (orina oscura, diarrea, discinesias) |
| Amantadine | https://www.ncbi.nlm.nih.gov/books/NBK499953/ | Edema, livedo reticularis, confusión |
| Monoamine Oxidase Inhibitors (MAOIs) | https://www.ncbi.nlm.nih.gov/books/NBK539848/ | Inhibidores de la MAO-B (el capítulo trata sobre todo los antidepresivos: leer solo lo de la MAO-B) |
| Anticholinergic Medications | https://www.ncbi.nlm.nih.gov/books/NBK555893/ | Solo con la decisión 2 en «sí» |
| Restless Legs Syndrome | https://www.ncbi.nlm.nih.gov/books/NBK430878/ | Uso de los agonistas fuera del Parkinson y *augmentation* |

Los imprescindibles son los dos primeros. Los demás, según las decisiones 1 y 2.

**Revisiones en PMC**: un agente en segundo plano busca y lee enteras 5–7 revisiones o guías de 2015 en adelante, como en las 13 familias (procedimiento, paso 1). Temas: efectos adversos de la levodopa y los agonistas, trastornos del control de impulsos, somnolencia y ataques de sueño, hipotensión ortostática por fármacos, retirada y síndrome de parkinsonismo-hiperpirexia.

## Decisiones para el usuario

1. **Nombre e id.** *Recomiendo* id `antiparkinsonianos`, nombre «Antiparkinsonianos y agonistas dopaminérgicos» (para que se reconozca también en las piernas inquietas), chip corto «Antiparkinsonianos». *Alternativa*: solo «Antiparkinsonianos».
2. **Anticolinérgicos (trihexifenidilo, biperideno).** *Recomiendo* incluirlos **solo si** una fuente leída los cubre en estos pacientes (confusión, caídas): casi no se usan ya en el Parkinson, pero sí en el parkinsonismo por antipsicóticos. Sin fuente, fuera.
3. **Relación con la tarjeta de Parkinson.** *Recomiendo* que la familia hable del fármaco y la tarjeta de la enfermedad, sin copiar frases. Además, un enlace «Fármacos del Parkinson →» en la tarjeta (con «Diagnosticado») y en su recuadro de la fase 5, que abra la guía en la familia (`abrirFarmacos({ familia: 'antiparkinsonianos' })`, como el anticoagulado).
4. **Chip derivado de la tarjeta.** *Recomiendo* **no** marcar el chip solo por marcar «Diagnosticado». La tarjeta no registra qué toma (no es como los corticoides del lupus), y deducirlo sería inventar un dato.
5. **Aviso de la fase 6** (`data/farmacos-paciente.js`). Se decide **al revisar la familia**, nunca antes (regla del paso 3). Con la tarjeta de Parkinson marcada, el aviso no debería repetir `AVISOS.parkinson`.
6. **Orden.** *Recomiendo* que sea la familia 14, al final (después de «Fármacos que tocan el hueso»). El test «las 13 familias… en su orden» pasa a 14 y el smoke `farmacos` también.
7. **Retirada brusca.** *Recomiendo* decirla como «no aconsejes dejarlos; si los ha dejado o no puede tomarlos, que contacte hoy con su médico», sin cifras de días ni de dosis, y dentro de los límites (nunca ajustar).

## Cambios técnicos previstos (si se aceptan)

- `data/farmacos.js`: la familia 14 con `ejemplos`, `cima`, los cinco `apartados` y `fuentes`. Fuentes nuevas en `data/referencias.js` y `node tests/gen-referencias.mjs`.
- `tests/unit/farmacos.mjs` y la sección `farmacos` de `tests/smoke.mjs`: 14 familias en orden.
- Con la decisión 3: enlace en `#cardParkinson` y `.pk-fase5` (`app.js`), un test unitario y el smoke `parkinson`.
- `data/farmacos-paciente.js`: entrada solo tras la revisión (decisión 5).
- Hoja `farmacos` y cuadernos regenerados (`node docs/esquemas/generar.mjs farmacos` y `cuadernos`): el test «hojas impresas al día» lo pedirá.
- physiq-report: nada (`fm` lleva el nombre corto, `n`).
- `docs/farmacologia.md` y `CLAUDE.md`: la familia 14 en la lista y su estado.

## Siguiente paso

1. ~~PDF de StatPearls del usuario~~: los ocho, leídos enteros (noviembre 2026).
2. ~~Lectura de las revisiones de PMC con un agente~~: siete leídas enteras.
3. ~~Escribir la familia~~: hecho.
4. ~~Decisiones 1–7~~: aceptadas por el usuario (noviembre 2026). Hechas también la 3 y la 5 (ver «Enlace y aviso»).
5. **Revisión del usuario** del contenido de la familia y del aviso.

## Enlace y aviso (noviembre 2026)

- **Decisión 3**: «Qué vigilar con su medicación: Fármacos del Parkinson →» en la tarjeta de Parkinson (solo con «Diagnosticado», dentro de `#pkDiagWrap`) y «Fármacos del Parkinson →» en su recuadro de la fase 5 (solo con «Diagnosticado»); los dos llaman a `abrirFarmacos({ familia: 'antiparkinsonianos' })`, como el anticoagulado. Humo: sección `parkinson` (abre la guía con solo esa familia desplegada; sin enlace con «Sospecha»).
- **Decisión 5**: entrada en `data/farmacos-paciente.js`: chip «Antiparkinsonianos», rótulo «Toma antiparkinsonianos o agonistas dopaminérgicos» y cuatro frases copiadas literales de la familia: los cambios de postura y las maniobras de contrapresión en la sesión (Fanciulli 2026; Fanciulli 2025), las caídas sin tropiezo (Fanciulli 2026), las comidas y la levodopa (Gandhi y Saadabadi 2023) y dormirse en la sesión y la conducción (Fanciulli 2025). No repite el aviso `parkinson` de la tarjeta (ejercicio, intensidad, on/off). `docs/plan-tratamiento-frases.md`, la hoja `farmacos` y los cuadernos, regenerados.

## Escritura (noviembre 2026)

**Decisiones** (las recomendaciones, aceptadas por el usuario en noviembre 2026):
- 1: id `antiparkinsonianos`, nombre «Antiparkinsonianos y agonistas dopaminérgicos». Chip corto «Antiparkinsonianos» (entra con la decisión 5).
- 2: el trihexifenidilo entra, con los efectos generales de los anticolinérgicos de Ghossein 2023 (boca seca, estreñimiento, retención de orina, visión borrosa, menos sudor, confusión en mayores, demencia). **El biperideno no aparece en ninguna fuente leída**, así que no está en `ejemplos` ni en CIMA. Ninguna fuente trata los anticolinérgicos en el Parkinson ni las caídas.
- 4: sin chip derivado de la tarjeta de Parkinson.
- 6: familia 14, al final.
- 7: «Nunca aconsejes dejarlos ni bajarlos», sin cifras de días ni de dosis.
- 3 y 5: hechas, ver «Enlace y aviso».

**Fuentes** (todas en `data/referencias.js`):
- StatPearls, PDF del usuario, leídos enteros: `Gandhi y Saadabadi 2023` (levodopa), `Leyden y Tadi 2023` (carbidopa), `Choi y Horner 2023` (agonistas), `Muranova y Shanina 2023` (levodopa, carbidopa y entacapona), `Chang y Ramphul 2023` (amantadina), `Patel y Saadabadi 2025` (IMAO; solo lo de la MAO-B), `Mansur 2023` (piernas inquietas), `Ghossein 2023` (anticolinérgicos).
- PMC, leídas enteras: `Fanciulli 2025` (guía alemana: dolor, sueño, hipotensión ortostática), `Fanciulli 2026` (hipotensión ortostática), `Koschel 2022` (retirada de la medicación), `Pötter-Nerger 2024 (guía)` (crisis acinética y síndromes de retirada; citada en la frase como «Pötter-Nerger 2024, guía»), `Scanferla y Djamshidian 2026` (conductas impulsivas), `Di Laudo 2023` (somnolencia), `Mogavero 2026` (piernas inquietas).
- Ya en el registro: `Pötter-Nerger 2024` (crisis acinética, leída para la tarjeta de Parkinson).
- Leída y no usada: Allen 2024 (dolor y su manejo no farmacológico en el Parkinson; trata el ejercicio, no los fármacos). Sin leer, solo resumen en PMC: Scanga 2023 (sueño) y la guía AASM 2025 de piernas inquietas.

**Discrepancia anotada en la guía**: los inhibidores de la MAO-B y la somnolencia (su capítulo de StatPearls advierte de ataques de sueño; Di Laudo 2023 los cuenta entre los que la reducen). Además, el capítulo de la levodopa pide tomarla con las comidas y, a la vez, lejos de las comidas con proteína: la guía solo dice lo segundo, como efecto sobre la absorción.

**Redacción propia** (sin fuente; se revisa):
- «Que lo tome no descarta una trombosis: las preguntas de la fase 2 siguen valiendo.»
- «Si la sesión no rinde igual según el día, pregunta a qué hora tomó la medicación.» y «Las fuentes leídas para esta familia no dan un horario para el ejercicio; lo que dice la guía de fisioterapia sobre la fase on está en la tarjeta de Parkinson.»
- «Es la pregunta de la tarjeta de Parkinson; con fiebre y rigidez, a urgencias.»
- Los «que lo sepa su neurólogo» y «coméntalo», que convierten lo que dicen las fuentes en cuándo consultar.

**Huecos** (sin fuente leída; la guía no los rellena): la curación de los tejidos; el horario del ejercicio respecto a la toma (solo la guía de fisioterapia, ya en la tarjeta); las discinesias como causa de caídas o lesión; los anticolinérgicos en el Parkinson (caídas, marcha, calor); el síndrome serotoninérgico con los inhibidores de la MAO-B (además, sería una interacción, fuera de los límites); pesadillas.

**Hecho además**: tests de orden (14 familias) en `tests/unit/farmacos.mjs` y la sección `farmacos` del humo; hoja `farmacos` y cuadernos regenerados; `docs/referencias.md` regenerado.
