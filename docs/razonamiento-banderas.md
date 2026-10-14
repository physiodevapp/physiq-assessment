# «¿Por qué?» de las banderas de fase 2 — inventario

Las banderas rojas y amarillas de cada sistema de fase 2 (`banderasRojas` / `banderasAmarillas` en `data/<región>.js`) son cadenas de texto. `buildSistemaHTML()` (`app.js`) las pinta como una lista de referencia, sin respuesta SÍ/NO, sin peso y sin pasar al payload. Antes de darles un «¿Por qué?» hay que saber cuántas ya tienen una pregunta del mismo sistema que lo explica, para enlazarla en lugar de escribir el razonamiento dos veces.

Clasificación de cada bandera:

- **C (cubierta):** una pregunta visible pregunta lo mismo y tiene `razonamiento`. Basta con enlazarla.
- **F1 (fase 1):** la cubre una bandera roja de fase 1 (`br1`–`br4`, `BR_LABELS` en `app.js`).
- **P (parcial):** una pregunta cubre solo una parte, o la pregunta está en otro sistema.
- **N (sin pregunta):** ninguna pregunta la cubre. Las marcadas con *expl.* son signos de exploración, no preguntas, y el «¿Por qué?» sería el único sitio donde explicarlas.

## Lumbar (piloto, 2026-10)

### Sistemas propios de lumbar

| Sistema | Bandera | Tipo | Cubre |
|---|---|---|---|
| l_cancer | R · Antecedentes de cáncer | C | `l2` |
| l_cancer | R · Dolor nocturno sin alivio postural | C | `l_on2` |
| l_cancer | R · Pérdida de peso inexplicada | F1 | `br1` (va junto con el sudor nocturno) |
| l_cancer | R · Fractura patológica ante trauma menor | P | `l_e4` (está en l_espondilo) |
| l_cancer | A · Sin mejoría tras 1 mes de tratamiento conservador | N | (la cronología de fase 1 lo aproxima) |
| l_urogenital | R · Hematuria | C | `l4` |
| l_urogenital | R · Percusión costovertebral positiva | N *expl.* | — |
| l_urogenital | R · Cauda equina | C | `l6` (urgencia) |
| l_urogenital | R · Masa testicular indolora | N | — |
| l_urogenital | A · Dolor constante que no varía con la postura | F1 | `br4` (también `l5d`) |
| l_urogenital | A · Fiebre y escalofríos | C | `l4` |
| l_urogenital | A · Cambios en la orina | C | `l4` |
| l_gi | R · Alivio al expulsar gases o defecar | C | `l1` |
| l_gi | R · Heces negras o sangre en heces | C | `l_gi2` |
| l_gi | R · Dolor nocturno de 0 a 3 h | C | `l_gi2` |
| l_gi | R · Pérdida de peso o saciedad precoz | P | `br1` (la saciedad precoz no se pregunta) |
| l_gi | A · Dolor de espalda y abdominal al mismo nivel | P | `l3` |
| l_gi | A · Uso crónico de AINE | N | — |
| l_gi | A · Dolor modificado por la ingesta o la defecación | P | `l1` (la ingesta no se pregunta) |
| l_espondilo | R · Rigidez matutina > 30 min | C | `l5` |
| l_espondilo | R · Dolor en la segunda mitad de la noche | C | `l_e2` |
| l_espondilo | R · Uveítis o psoriasis | N | — |
| l_espondilo | R · Fractura por insuficiencia | C | `l_e4` |
| l_espondilo | R · Embarazo ectópico «(urgencia)» | P | `l_e3`, **sin `urgencia`** (ver hallazgos) |
| l_espondilo | R · Fractura sacra por estrés | C | `l_e6` |
| l_espondilo | R · Espondilolistesis aguda | C | `l_e7` |
| l_espondilo | A · Dolor sacroilíaco alterno | C | `l5c` |
| l_espondilo | A · Dolor ligado al ciclo menstrual | C | `l_e3` |
| l_espondilo | A · Historia familiar de espondilitis anquilosante | N | — |
| l_espondilo | A · Osteoporosis o corticoides prolongados | P | `l_e4` (los corticoides no se preguntan) |
| l_espondilo | A · Engrosamiento óseo o deformidad (Paget) | C | `l_e5` |
| l_vascular | R · Aneurisma aórtico | C | `l_v2` |
| l_vascular | R · Claudicación vascular | C | `l_v1` + `l_v3` |
| l_vascular | R · Síndrome de Leriche | P | `l_v1` (la disfunción eréctil no se pregunta) |
| l_vascular | A · Factores de riesgo cardiovascular | N | — |
| l_infeccion | R · Infección (Lluch 2020) | C | `l_inf1` |
| l_infeccion | R · Signos neurológicos con fiebre | P | `l_inf1` + `l6` |
| l_infeccion | A · Diabetes, corticoides, insuficiencia renal o drogas | P | `l_inf1` (la insuficiencia renal y las drogas no se preguntan) |

**Total: 38 banderas.** 20 C · 2 F1 · 9 P · 7 N (1 de exploración).

### Sistemas compartidos (aparecen en otras regiones)

Se inventarían una vez: lo que se escriba para ellos vale en todas las regiones que los usan.

| Sistema | C | P | N | Sin pregunta |
|---|---|---|---|---|
| transversal_posquirurgico (8) | 6 | 2 | 0 | — (pero ver hallazgos: en lumbar se ocultan 4 de sus preguntas) |
| transversal_endocrino (10) | 2 (`end_1`, `end_2`) | 2 (`end_3`, `end_5`) | 6 | túnel carpiano bilateral, tormenta tiroidea, hipopotasemia por diuréticos, xantomas *expl.*, nódulos supraclaviculares o fiebre con corticoides, tendinitis calcificante bilateral de hombro |
| transversal_hematologico (9) | 4 (`hem_1`, `hem_2`, `hem_4` ×2) | 1 (`hem_3`) | 4 | dolor articular en hemofilia, palidez *expl.*, coiloniquia *expl.*, AINE crónicos |

## Hallazgos fuera del «¿Por qué?» (para decidir aparte)

1. **Embarazo ectópico sin pregunta urgente en lumbar.** La bandera dice «(urgencia)» y el `peso` de `l_e3` lo explica, pero `l_e3` no lleva `urgencia`. Un SÍ, por tanto, no dispara la alerta «Derivación urgente hoy». En hombro, la pregunta equivalente `h_g1` sí la lleva. Es una decisión clínica: no se ha cambiado nada.
2. **Las banderas posquirúrgicas no se filtran por región.** `sistemasActivos()` filtra las preguntas por `regiones`, pero no las banderas. Por eso en lumbar se ven las banderas de síndrome compartimental, lesión nerviosa, SDRC y yeso apretado, mientras que sus preguntas (`pq_compart`, `pq_nervio`, `pq_sdrc`) están ocultas, porque `PQ_MIEMBROS` no incluye lumbar ni cervical. Las opciones son añadir `regiones` a las banderas o confirmar que la lista se muestra entera a propósito.
3. **Los AINE crónicos aparecen en dos sistemas** (l_gi y hematológico) y ninguno lo pregunta.

## Propuesta (pendiente de decisión del usuario)

- **C:** convertir la cadena en `{ texto, pregunta: '<id>' }` y que la bandera muestre «→ ver pregunta», que abre el «¿Por qué?» de esa pregunta. Un test unitario comprobaría que el id existe en el mismo sistema, o en la región si la pregunta está en otro sistema. No hace falta escribir texto clínico nuevo.
- **F1:** enlace a la tarjeta de banderas de fase 1, o nada.
- **P y N:** `razonamiento` propio con el mismo formato que las preguntas (`docs/razonamiento-cribado.md`) y fuente leída. Primero las rojas y las de exploración.
- Las amarillas al final.

Volumen en lumbar: 22 banderas solo necesitan un enlace (20 C y 2 F1) y 16 necesitan texto (9 P y 7 N). En los sistemas compartidos, 15 más, que sirven para todas las regiones.
