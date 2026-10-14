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
| l_espondilo | R · Embarazo ectópico «(urgencia)» | C | `l_e8`, nueva y con `urgencia` (antes solo `l_e3`, sin ella; ver hallazgos) |
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

**Total: 38 banderas.** 21 C · 2 F1 · 8 P · 7 N (1 de exploración), contando ya `l_e8`.

### Sistemas compartidos (aparecen en otras regiones)

Se inventarían una vez: lo que se escriba para ellos vale en todas las regiones que los usan.

| Sistema | C | P | N | Sin pregunta |
|---|---|---|---|---|
| transversal_posquirurgico (9) | 9 | 0 | 0 | — (pero ver hallazgos: en lumbar se ocultan 4 de sus preguntas) |
| transversal_endocrino (10) | 3 (`end_1`, `end_2`, `end_3`) | 1 (`end_5`) | 6 | túnel carpiano bilateral, tormenta tiroidea, hipopotasemia por diuréticos, xantomas *expl.*, nódulos supraclaviculares o fiebre con corticoides, tendinitis calcificante bilateral de hombro |
| transversal_hematologico (9) | 5 (`hem_1`, `hem_2`, `hem_3` + `hem_5`, `hem_4` ×2) | 0 | 4 | dolor articular en hemofilia, palidez *expl.*, coiloniquia *expl.*, AINE crónicos |

Repaso de 2026-10 (sesión de los sistemas compartidos), contra el código: posquirúrgico tiene 9 banderas (`pq_nervio_col`). Cuatro «parciales» ya las explica el razonamiento de su pregunta y se enlazan (decisión del usuario): infección necrotizante en las 48–72 h → `pq_herida` (su «cuánto pesa» la describe, Zabaglo); yeso o vendaje que aprieta → `pq_sdrc` y `pq_compart` (este solo se ve en codo, rodilla y tobillo y pie); cambios de pelo, uñas, piel o temperatura → `end_3`; fiebre en la leucopenia → `hem_3` y la nueva `hem_5` (hallazgo 4). La confusión o sudoración en el diabético (parcial con `end_5`) lleva razonamiento propio: `end_5` no cubre la cetoacidosis ni qué hacer en la sesión. Codo no carga el sistema endocrino.

## Hallazgos fuera del «¿Por qué?»

1. **Embarazo ectópico sin pregunta urgente en lumbar.** Resuelto (decisión del usuario, 2026-10): `l_e8` en lumbar y `ca_u5` en cadera, con `urgencia` y razonamiento de NICE NG126 (1.4.1–1.4.8, releída en la sesión). Están separadas de `l_e3`/`ca_u4` (dolor ligado a la regla), que siguen sin urgencia porque un SÍ por una endometriosis conocida no justifica ir a urgencias. La bandera de lumbar enlaza `l_e8`.
2. **Banderas posquirúrgicas sin filtrar por región.** Resuelto: llevan `regiones`, igual que sus preguntas, y `sistemasActivos()` filtra preguntas y banderas. En lumbar y cervical ya no salen la compartimental, la nerviosa, la del SDRC ni la del yeso. Para la columna, `pq_nervio_col` (lumbar y cervical, con urgencia) y su bandera, decisión del usuario (2026-10): tras cirugía de columna el déficit nuevo es de raíz o médula (hematoma epidural), no de un nervio periférico.
3. **AINE crónicos** (l_gi y hematológico): sin pregunta nueva (recomendación aceptada). Cuando se escriba su razonamiento, que explique que dan más peso a las heces negras o a la anemia.
4. **Sepsis neutropénica sin pregunta urgente** (hematológico, todas las regiones). La bandera roja «fiebre en la leucopenia» solo enlazaba `hem_3`, que no tiene `urgencia`: un SÍ no encendía la alerta roja aunque su razonamiento pedía derivación inmediata (mismo patrón que el ectópico). Resuelto (decisión del usuario, 2026-10): `hem_5`, «¿Está recibiendo tratamiento contra el cáncer (quimioterapia o radioterapia) y se encuentra mal o tiene fiebre?», con `urgencia` y razonamiento de NICE CG151 (leída en la sesión: 1.3.1.1 sospecharla en todo paciente con tratamiento contra el cáncer que se encuentra mal; 1.3.1.2 derivación inmediata; urgencia médica, mortalidad del 2–21 %). `hem_3` sigue sin urgencia: las infecciones de repetición sin ese tratamiento no justifican ir a urgencias. CG151 habla solo del tratamiento contra el cáncer, así que la pregunta no incluye otros inmunosupresores.

## Diseño (implementado, 2026-10)

Una bandera es un texto o un objeto:

```js
{ texto: '…',
  regiones: ['codo', …],   // opcional: solo se ve en esas regiones (como `regiones` en una pregunta)
  pregunta: 'l2',          // o ['l_v1', 'l_v3']: ids del MISMO sistema; su ⓘ abre el «¿Por qué?» de esa pregunta
  fase1: 'br1',            // opcional: pinta «· fase 1» (también se pregunta en las banderas de la fase 1)
  razonamiento: { … } }    // opcional: el suyo, con la misma forma que el de una pregunta (porque, peso, detalle?, fisiologia?, fuentes, citas?)
```

- `pregunta` y `razonamiento` no van juntos: el «¿Por qué?» se escribe una sola vez (test unitario).
- Render: `banderaHTML()` (`app.js`) añade un ⓘ al final del texto solo si hay «¿Por qué?» que mostrar, es decir, `razonamiento` o una pregunta enlazada visible en la región. El ⓘ llama a `abrirRazonBandera()`, que abre el panel compartido del razonamiento (`abrirPanelRazon()`): lateral en escritorio y hoja inferior en móvil. Con `pregunta`, el panel muestra «Se pregunta así» + la pregunta + su razonamiento. Con `razonamiento` propio, el suyo. `razonCribadoPanelHTML()` pinta las secciones de los dos casos.
- La parte que no tiene fuente leída en la sesión se queda sin `razonamiento`: no se inventa.
- `tests/referencias.mjs` cuenta las `fuentes` de las banderas como «razonamiento fase 2».
- Tests: `tests/unit/razonamiento.mjs` (forma, ids en el mismo sistema, enlace visible en cada región, ⓘ solo con «¿Por qué?», inventario de lumbar); smoke `--solo banderas`.

## Estado de lumbar (2026-10)

- **Enlaces:** las 21 banderas que tienen pregunta en su sistema, más 3 con `fase1` (pérdida de peso ×2 → `br1`; dolor que no varía con la postura → `br4`).
- **Razonamiento propio** (fuentes leídas en la sesión: Finucane 2020, documento completo del marco IFOMPT; Downie 2013, texto completo en PMC; NICE NG12 y NG65 en nice.org.uk; después, PDF del usuario: Goodman 2018, caps. 6 y 10, y StatPearls «Acute Pyelonephritis» (Belyayeva 2024), «Aortoiliac Occlusive Disease» (Kimyaghalam 2024) y «Peripheral Arterial Disease» (Zemaitis 2026)):
  - Rojas, las 8 sin pregunta: pérdida de peso inexplicada (l_cancer), fractura patológica, percusión costovertebral (Goodman cap. 10, Belyayeva), masa testicular (NICE NG12 y, después, Goodman cap. 10, que explica su relación con el dolor lumbar), pérdida de peso o saciedad precoz (l_gi), uveítis o psoriasis, síndrome de Leriche (Kimyaghalam, Goodman cap. 6, Zemaitis), signos neurológicos con fiebre. Un test comprueba que ninguna roja propia de lumbar queda sin «¿Por qué?».
  - Amarillas: sin mejoría tras 1 mes (Downie), historia familiar de espondilitis anquilosante (NG65).
- **Pendientes de fuente:** ninguna roja.
- **Amarillas sin razonamiento:** dolor de espalda y abdominal al mismo nivel, AINE crónicos, dolor modificado por la ingesta, osteoporosis o corticoides, factores de riesgo cardiovascular, inmunosupresión.
- **Revisión clínica del usuario:** hecha (2026-10), incluidas las banderas y la pregunta `pq_nervio_col` añadidas después.

## Siguientes pasos

2. Sistemas compartidos (posquirúrgico, endocrino, hematológico): razonamiento propio de sus banderas sin pregunta, una vez para todas las regiones.
3. Resto de regiones, una por sesión: inventario, enlaces y razonamiento propio de las rojas.
4. Amarillas, al final o nunca si no aportan.
