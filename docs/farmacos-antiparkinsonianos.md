# Familia 14 de la guía de fármacos: antiparkinsonianos y agonistas dopaminérgicos — borrador

Estado: **borrador de diseño (noviembre 2026). Solo diseño, sin código.** Viene de la lista «Fuera de este diseño» de `docs/parkinson.md` («Los fármacos antiparkinsonianos como familia de la guía de fármacos»). El usuario la pidió el 2026-11. Se sigue el procedimiento por familia de `docs/farmacologia.md` (paso 2), con sus límites:
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

1. Decisiones 1–7 del usuario.
2. PDF de StatPearls del usuario (como mínimo, levodopa y agonistas dopaminérgicos).
3. Lectura de las revisiones de PMC con un agente.
4. Escribir la familia, PR sin fusionar y revisión del usuario.
