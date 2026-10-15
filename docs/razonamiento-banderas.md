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
| transversal_hematologico (9) | 6 (`hem_1`, `hem_2`, `hem_3` + `hem_5`, `hem_4` ×2, `hem_6`) | 0 | 3 | palidez *expl.*, coiloniquia *expl.*, AINE crónicos |

Repaso de 2026-10 (sesión de los sistemas compartidos), contra el código: posquirúrgico tiene 9 banderas (`pq_nervio_col`). Cuatro «parciales» ya las explica el razonamiento de su pregunta y se enlazan (decisión del usuario): infección necrotizante en las 48–72 h → `pq_herida` (su «cuánto pesa» la describe, Zabaglo); yeso o vendaje que aprieta → `pq_sdrc` y `pq_compart` (este solo se ve en codo, rodilla y tobillo y pie); cambios de pelo, uñas, piel o temperatura → `end_3`; fiebre en la leucopenia → `hem_3` y la nueva `hem_5` (hallazgo 4). La confusión o sudoración en el diabético (parcial con `end_5`) lleva razonamiento propio: `end_5` no cubre la cetoacidosis ni qué hacer en la sesión. Codo no carga el sistema endocrino.

## Cadera (2026-10)

45 banderas en sus 6 sistemas propios (33 rojas, 12 amarillas), todas texto sin enlace antes de esta sesión. Repasadas una a una contra el texto completo del razonamiento de cada pregunta: muchas «parciales» por el texto de la pregunta están cubiertas por su razonamiento (p. ej., la masa testicular por `ca_u2`, el signo del psoas por `c4`, la claudicación que empeora de golpe por `c2`).

- **Enlazadas (36), más `fase1: 'br1'` en la pérdida de peso:**
  - ca_cancer: dolor óseo en carga o fractura patológica y dolor nocturno → `ca_on2`; cáncer previo → `c5`; masa en muslo o glúteo → `ca_on3`; masas o ganglios que crecen → `ca_on3` + `ca_on4`; adenopatía inguinal → `ca_on4`; pérdida de peso → `ca_on3` (y `br1`).
  - ca_vascular: claudicación y claudicación que empeora de golpe → `c2`; calambres nocturnos y TVP → `ca_v2`; Leriche y enfermedad arterial → `c2` + `ca_v3`; dolor isquémico en reposo → `ca_v3`.
  - ca_urogenital: hematuria, pielonefritis y ardor al orinar → `c3`; masa testicular y dolor de ingle que no cambia con la cadera → `ca_u2`; litiasis, prostatitis, epididimitis, torsión → `c3` + `ca_u2` + `ca_u3`; ginecológicas y cánceres pélvicos → `ca_u4` + `ca_u2` + `c3`.
  - ca_gi: alivio al defecar, signo del psoas, fiebre con dolor abdominal y distensión → `c4`; apendicitis, Crohn, diverticulitis, cáncer digestivo → `c4` + `ca_gi2`; hernia → `ca_gi3`; AINE crónicos → `ca_gi2`.
  - ca_oseo: fracturas de estrés del cuello femoral, de rama púbica o diáfisis, y perfil de riesgo → `ca_os1`; osteonecrosis → `ca_os2`; lesiones del desarrollo → `ca_os3` + `ca_os4`; avulsión → `ca_os3`; antecedente de EFCF, Perthes o displasia → `ca_os4`.
  - ca_inflam: artritis séptica, osteomielitis, absceso del psoas → `ca_in1`; AR y espondilitis → `ca_in2`.
- **Razonamiento propio (6):** las 5 rojas sin pregunta (factores de riesgo de malignidad, tumores óseos primarios, «denominador común» urogenital, ascitis y fractura de estrés del acetábulo o del sacro) y la amarilla de la edad de más de 50 años. El del aneurisma aórtico se escribió para la bandera y pasó a su pregunta, `ca_v4`. Ninguna roja de cadera queda sin «¿Por qué?» (test del inventario).
- **Amarillas de antecedente familiar de cáncer y de la VSG** (después, 2026-10, con Lluch 2020, cap. 4.1, PDF escaneado del usuario, leído página a página): razonamiento propio. Con el mismo capítulo, la bandera de malignidad explica ya la VSG y el hematocrito (p. 146) y la de fracturas de estrés, el acetábulo (tabla 2, pp. 147 y 149). Ninguna bandera de cadera queda sin «¿Por qué?».
- **Fuentes leídas en la sesión:** Goodman 2018, cap. 16 (las partes de las banderas: causas, cáncer, fracturas de estrés, vascular, ascitis, derivación), cap. 6 (aneurisma de aorta abdominal y oclusión arterial aguda), cap. 13 (tumores óseos y sarcomas de partes blandas) y cap. 15 (fracturas del sacro), PDF del usuario; NICE NG12 (sarcomas) y NG156 (aneurisma) en nice.org.uk; Downie 2013 (texto completo, Europe PMC) y el resumen de Henschke 2013; StatPearls en PDF del usuario: Limaiem 2023, Hosseinzadeh 2024 y Goosenberg 2025, nuevos, y Jayarangaiah 2023, Dookie y Joseph 2023, Durer 2024, May y Marappa-Ganeshan 2023 y Shaw 2025, releídos. Lluch 2020, cap. 4.1, se leyó al final (ver arriba).
- **Conflictos entre fuentes:** edad del condrosarcoma, «más de 40 años» (Goodman 2018) frente a «la mayoría, más de 50» (Limaiem 2023): mismo nivel, gana la más reciente. Las cifras de malignidad (Downie, Henschke) son de dolor lumbar: se dice en el texto que no hay estudios en la cadera. Lluch (p. 146) da una sensibilidad del 100 % a la combinación de edad, falta de mejoría, pérdida de peso y cáncer previo; Henschke 2013 (revisión Cochrane) no encontró estudios de combinaciones: prevalece la revisión (regla 1) y la cifra de Lluch no se usa.
- **Revisión clínica del usuario:** hecha (2026-10), incluidas las preguntas urgentes `ca_v4` y `ca_v5`.
- **Enlaces parciales que se quedan así:** la avulsión en el adulto mayor (descartar metástasis) está en la bandera de masas de ca_cancer pero la explica `ca_os3`, de otro sistema; la variz de la safena (bandera de Leriche) no la explica ninguna pregunta.
- **Huecos de seguridad, resueltos (decisión del usuario, 2026-10):** dos preguntas urgentes nuevas en ca_vascular. `ca_v4` (aneurisma roto, «llamar al 112»): el razonamiento escrito para la bandera del aneurisma pasa a la pregunta y la bandera la enlaza. `ca_v5` (isquemia aguda, «urgencias hoy»; Goodman cap. 6, tabla 6.7 y «Guidelines for Immediate Medical Attention»): la bandera de la claudicación que empeora de golpe enlaza `c2` + `ca_v5`. `c2` sigue sin urgencia. Lo que se detectó:
  - Aneurisma aórtico: ninguna pregunta de cadera lo pregunta (lumbar tiene `l_v2`). NICE NG156 pide pensar en una rotura ante un dolor abdominal o de espalda nuevo con colapso, sobre todo con aneurisma conocido, más de 60 años, tabaco o hipertensión, y Goodman cap. 16 lista el dolor de ingle brusco con dolor abdominal o lumbar entre sus señales. Recomendación: pregunta urgente en ca_vascular.
  - Isquemia aguda: Goodman (cap. 6, «Guidelines for Immediate Medical Attention») pide comunicar de inmediato el empeoramiento brusco de la claudicación (tromboembolia; las 6 P de inicio en menos de una hora). `c2` lo explica en su razonamiento, pero no tiene `urgencia`. Recomendación: pregunta urgente aparte en ca_vascular, sin tocar `c2` (la claudicación estable no es urgente).

## Cervical (2026-10)

40 banderas en sus 8 sistemas propios (31 rojas, 9 amarillas), todas texto sin enlace antes de esta sesión. Repasadas contra el razonamiento completo de cada pregunta.

- **Enlazadas (35), más `fase1: 'br1'` en la pérdida de peso y `fase1: 'br4'` en el dolor que no cambia con la postura (renal, sin pregunta):**
  - cv_cancer: cáncer previo, edad de más de 50 con inicio insidioso, fracaso tras 1 mes y ganglios duros → `cv4`; dolor nocturno → `cv1`; pérdida de peso → `cv5` (y `br1`); tumor vertebral → `cv1` + `cv4` + `cv5`.
  - cv_cardio: cuello o mandíbula con sudor y angina de más de 20 min → `cv2`; «Cardiaco» de la tarjeta → `cv2` + `cv_c2`; amarilla del esfuerzo de piernas → `cv_c2`.
  - cv_pulmonar: dolor al toser, fiebre y sudores, tabaquismo y cáncer con metástasis pulmonar → `cv_p1`; hemoptisis, tos y disnea → `cv_p1` + `cv_p2`.
  - cv_renal: esfínteres → `cv3`; hematuria, fiebre y escalofríos, color u olor de la orina → `cv_r2`.
  - cv_gi: comidas o evacuación y saciedad → `cv_gi1`; dolor nocturno con antiácidos, heces negras y AINE → `cv_gi2`.
  - cv_arterial: disección → `cv_ar1`; insuficiencia vertebrobasilar → `cv_ar2`; fractura o inestabilidad traumática → `cv_ar3`; cefalea con signos de alarma y otras cefaleas secundarias → `cv_ar4`.
  - cv_neuro: inestabilidad alta no traumática → `cv_n1`; distonía → `cv_n2`; Grisel → `cv_n3`.
  - cv_inflam: infección → `cv_in1`; artritis inflamatoria → `cv_in2`.
- **Razonamiento propio (2), con Goodman 2018 ya leído en la sesión:** síncope sin aviso (cap. 6, pp. 227 y 261: válvulas o arritmia, derivar todo síncope sin explicación; no es urgencia por sí solo) y, en amarillas, dolor de espalda y abdominal al mismo nivel (cap. 8, pp. 303–305 y 326).
- **Amarilla del dolor que no cambia con la postura** (después, 2026-10): solo marcaba `br4`, sin pregunta en cv_renal. Razonamiento propio con Goodman cap. 10, p. 362 (el dolor renal no cambia con la postura; el seudorrenal, frecuente en la columna cervical y torácica, sí), cap. 13, p. 488 (el dolor de un tumor de la columna no se alivia al tumbarse) y cap. 14, p. 564 (derivar un dolor constante que no depende de la actividad). Ninguna bandera de cervical queda sin «¿Por qué?».
- **Razonamiento propio de las 2 rojas que faltaban** (PDF del usuario, leídos en la sesión): percusión de Murphy (Goodman cap. 10, pp. 362–363 y 377: percusión suave frente a presión con el pulgar, dolor pseudorrenal frecuente en la columna cervical y torácica, valor diagnóstico nunca validado, derivar sobre todo con infección urinaria reciente; Belyayeva 2024: tríada, signos de sepsis, formas complicadas) y mielopatía cervical (Margetis y Donnally 2025: mecanismo, síntomas con sus porcentajes, exploración, RM, precaución con las movilizaciones pasivas forzadas; Goodman cap. 14, pp. 531 y 564: signos, combinación flexión de dedos + Hoffmann + Babinski, derivar ante déficit nuevo o progresivo). La mielopatía no se enlaza a `cv3` aunque su razonamiento la explique: está en otro sistema (renal) y una bandera solo enlaza preguntas del suyo. Ninguna roja de cervical queda sin «¿Por qué?»; sin él solo queda la amarilla del dolor que no cambia con la postura, que marca `br4` de la fase 1.
- **Pregunta nueva `cv_n4`, sin urgencia (decisión del usuario, 2026-10):** ninguna pregunta de cv_neuro preguntaba por la torpeza de manos o la marcha, los síntomas más frecuentes de la mielopatía (Margetis y Donnally); solo llegaba por `cv3` (esfínteres, tardío) y por la hipótesis `ce8` del árbol. El razonamiento escrito para la bandera de la mielopatía pasa a `cv_n4` y la bandera la enlaza.
- **Hueco de seguridad, resuelto (decisión del usuario, 2026-10):** `cv2` (dolor de cuello o mandíbula con sudor, náuseas u opresión) no tenía `urgencia`, aunque su propio «cuánto pesa» dice que es una urgencia si está pasando ahora. Pregunta urgente nueva `cv_c3` en cv_cardio, solo para el episodio en curso (más de 20 minutos, no cede al parar, o con sudor frío, náuseas, vómitos o falta de aire → «llamar al 112»), con razonamiento de Goodman cap. 6, pp. 236 (signos del infarto) y 260 («Guidelines for Immediate Medical Attention»). `cv2` sigue sin urgencia: un antecedente de esos síntomas pide derivar, no el 112. Las banderas de cuello o mandíbula con sudores y de angina de más de 20 minutos enlazan `cv2` + `cv_c3`. Hombro tiene la misma bandera y probablemente el mismo hueco: se mirará en su sesión.
- **Revisión clínica del usuario:** hecha (2026-10), incluidas `cv_c3` y `cv_n4`.

## Hombro (2026-10)

41 banderas en sus 9 sistemas propios (26 rojas, 15 amarillas), todas texto sin enlace antes de esta sesión. Repasadas contra el razonamiento completo de cada pregunta; hombro (piloto de la Fase F) tiene razonamientos largos, que cubren casi todas.

- **Enlazadas (36), más `fase1: 'br1'` en la pérdida de peso:**
  - h_cancer: cáncer previo y ganglios duros → `h3`; dolor nocturno → `h4`; pérdida de peso → `h6` (y `br1`); Pancoast → `h3` + `h4`; tumor (Lluch) → `h3` + `h4` + `h6`.
  - h_cardio: esfuerzo sin mover el brazo → `h1`; sudores o náuseas y angina de más de 20 minutos → `h2` + `h_c4`; amarilla de acostarse o falta de aire → `h_c3`.
  - h_pulmonar: toser y autoferulización → `h5`; hemoptisis, tabaco y cáncer con metástasis pulmonar → `h_p3`; disnea → `h_p2`.
  - h_renal: Murphy, hematuria, fiebre y escalofríos, cambios de la orina y cálculos → `h_r1`; dolor que no cambia con ninguna postura → `h_r2`.
  - h_gine: ectópico, hombro izquierdo súbito con hipotensión y sangrado vaginal → `h_g1`; ciclo menstrual y EIP → `h_g2`.
  - h_gi: hombro derecho que no responde y estatinas, AINE o alcohol → `h_gi1` + `h_gi2` + `h_gi3`; ictericia → `h_gi2`; grasas y saciedad → `h_gi1`; rotura esplénica → `h_gi4`.
  - h_trauma → `h_t1`; h_infeccion → `h_i1`; h_neuro → `h_n1`.
- **Razonamiento propio (5), con Goodman 2018 leído en la sesión:** síncope sin aviso (cap. 6, pp. 227 y 261; el mismo texto que cervical) y, en amarillas, edad de más de 50 con dolor insidioso (cap. 13, p. 465: el factor de riesgo de cáncer más importante), debilidad muscular proximal idiopática (cap. 13, p. 476: neuromiopatía carcinomatosa, preguntas funcionales), betabloqueantes o IECA (cap. 6, pp. 259–260) y exposición ambiental u ocupacional (cap. 13, p. 468). Ninguna bandera de hombro queda sin «¿Por qué?».
- **Huecos de seguridad, resueltos con la recomendación que el usuario aceptó («adelante con tus recomendaciones», 2026-10):**
  - Cardiaco, igual que cervical: `h2` no tiene `urgencia` aunque su «cuánto pesa» dice que es una urgencia si está pasando ahora. Pregunta urgente nueva `h_c4` («llamar al 112»), con el texto y las fuentes de `cv_c3` (Goodman cap. 6, pp. 236 y 260). `h2` sigue sin urgencia.
  - Rotura de bazo: la bandera roja del signo de Kehr no tenía pregunta (el razonamiento de `h_g1` lo menciona, pero es del sistema ginecológico). Pregunta urgente nueva `h_gi4` en h_gi (dolor de hombro izquierdo tras un golpe en el costado o el abdomen, constante o con mareo → «a urgencias hoy»), con razonamiento de Goodman cap. 8, pp. 311–312 (signo de Kehr; caso 8.5, futbolista con bazo roto) y 325 (derivación inmediata con sospecha de sangrado retroperitoneal, traumatismo y Kehr positivo). Anatomía: diafragma (el bazo no tiene entrada en `data/anatomia.js`).
- **Revisión clínica del usuario:** hecha (2026-10), incluidas `h_c4` y `h_gi4`.

## Rodilla (2026-10)

23 banderas en sus 5 sistemas propios (20 rojas, 3 amarillas), todas texto sin enlace antes de esta sesión (tres amarillas estaban en una sola línea; se pasaron a varias para poder enlazarlas). Rodilla ya tenía preguntas propias para casi cada bandera de la tarjeta (Fase D), así que casi todas se enlazan.

- **Enlazadas (21):**
  - ro_vascular: claudicación → `r_v1`; signos de TVP y escala de Wells → `r_v2`; pseudotromboflebitis → `r_v3`.
  - ro_infecciosa: fiebre con articulación caliente, artritis séptica e inicio muy agudo con la articulación bloqueada → `r1`; bursitis prerrotuliana séptica → `r_i3`; amarilla de infección reciente → `r_i2`.
  - ro_oncologico: dolor nocturno y amarilla de 10–30 años con dolor óseo → `r2`; masa → `r3`; cáncer previo o menos de 25 años y tumor (apofisitis) → `r2` + `r3`.
  - ro_trauma: fractura de rótula o meseta → `ro_t1`; aparato extensor → `ro_t2`; luxación → `ro_t3`; compromiso neurovascular → `ro_t4`; peroneo común → `ro_t5`; osteocondral inestable → `ro_t6`.
  - ro_pediatrico: epifisiólisis o Perthes → `ro_p1`.
- **Razonamiento propio (2), con Goodman 2018 leído en la sesión:** calambres nocturnos en la pantorrilla (cap. 6, p. 254: el dolor isquémico se describe como calambre sin espasmo; cap. 16, p. 624: causas de los calambres, entre ellas la oclusión arterial y la claudicación neurógena) y, en amarillas, dolor en reposo que mejora al colgar la pierna (cap. 6, pp. 228, 254 y 262: dolor isquémico en reposo de la enfermedad arterial avanzada; si empieza de golpe, tromboembolia, comunicar de inmediato). Ninguna bandera de rodilla queda sin «¿Por qué?».
- **Huecos de seguridad:** ninguno. Las rojas que piden urgencias (TVP, artritis séptica, bursitis séptica, aparato extensor, luxación, compromiso neurovascular) ya tenían pregunta con `urgencia`.
- **Pregunta urgente nueva `r_v4`, isquemia aguda de la pierna (recomendación aceptada por el usuario, 2026-10):** el mismo texto, urgencia y razonamiento que `ca_v5` de cadera (Goodman cap. 6, pp. 254 y 260; cap. 16, p. 636). Hasta entonces solo la cubría `ro_t4`, tras un traumatismo. El razonamiento se comparte desde `data/comun.js` (`RAZON_ISQUEMIA_AGUDA`) y un test comprueba que es el mismo objeto; la bandera de la claudicación enlaza `r_v1` + `r_v4`.
- **Revisión clínica del usuario:** hecha (2026-10).

## Codo (2026-10)

15 banderas en sus 4 sistemas propios (11 rojas, 4 amarillas), todas texto sin enlace antes de esta sesión (dos amarillas en una sola línea, pasadas a varias). Codo no usa el sistema endocrino compartido sino uno propio, `co_endocrino`, con preguntas de codo.

- **Enlazadas (12):**
  - co_trauma: no estira el codo tras una caída → `co_t1`; deformidad o mano dormida, fría o pálida, y pronación dolorosa (su razonamiento la explica) → `co_t2`.
  - co_vascular: Raynaud → `co4a` + `co4a_uni` + `co4a_prog`; debilidad progresiva → `co3`; amarilla de parestesias en el 4.º y 5.º dedo → `co4b`.
  - co_infecciosa: fiebre con codo caliente, inicio muy agudo con impotencia funcional y amarilla de infección reciente → `co1` (la amarilla, parcial: `co1` recoge las infecciones de la piel y las úlceras entre los factores de riesgo).
  - co_endocrino: túnel carpiano bilateral → `co_e1`; debilidad proximal y fatiga, y amarilla de cambios de cabello, uñas, piel o tolerancia a la temperatura → `co_e2a` (la miastenia, `co_e2b`, está en co_vascular y no se puede enlazar).
- **Razonamiento propio (3):**
  - Síntomas vasculares en un codo operado: Goodman cap. 6, p. 254 (tabla 6.7: la cirugía vascular, los procedimientos arteriales y el traumatismo, factores de riesgo de la oclusión arterial aguda; las «6 P») y cap. 16, p. 624 (síndrome compartimental por un yeso). Remite al cribado posquirúrgico, que con mecanismo Post-quirúrgico pregunta por el síndrome compartimental y la TVP del brazo.
  - Xantomas en tendones extensores y, en amarillas, tendinitis calcificante bilateral del hombro: el mismo razonamiento que el sistema endocrino compartido, ya revisado. Para no duplicarlo, `data/comun.js` lo exporta como `RAZON_XANTOMAS` y `RAZON_CALCIFICANTE`, y un test comprueba que es el mismo objeto.
- **Hueco de seguridad, resuelto (decisión del usuario, 2026-10):** la bandera roja de la artritis séptica enlazaba `co1`, que no tenía `urgencia`, aunque su razonamiento la llama emergencia ortopédica y pide derivación sin demora; en rodilla (`r1`) y cadera (`ca_in1`) es urgente. `co1` lleva ahora «Sospecha de artritis séptica o de bursitis séptica del olécranon: derivación hoy.» (la bursitis séptica también es derivación el mismo día en rodilla, `r_i3`).
- **Revisión clínica del usuario:** hecha (2026-10).

## Tobillo y pie (2026-10)

15 banderas rojas en sus 6 sistemas propios, sin amarillas, todas texto sin enlace antes de esta sesión. Cada una tiene una pregunta propia (Fase D) cuyo razonamiento la explica (comprobado por términos clave: 5.º metatarsiano y Jones, Lisfranc, calcáneo, tibial posterior y FHL, gota, mononeuritis, claudicación neurógena…), así que todas se enlazan y ninguna necesita razonamiento propio.

- **Enlazadas (15):**
  - tp_trauma: compartimental y compromiso neurovascular → `tp_t1`; rotura del Aquiles → `tp_t3`; Lisfranc → `tp_t4` + `tp_t1`; calcáneo → `tp_t4`; 5.º metatarsiano → `tp_t2`; tibial posterior o FHL → `tp_t5`.
  - tp_oseo: fractura de estrés de alto riesgo o múltiple → `tp_o1` + `tp_o2`.
  - tp_infecciosa: artritis infecciosa → `tp_i1`; artritis inflamatoria → `tp_i2`.
  - tp_oncologico: osteoma osteoide → `tp_c2`; malignidad o infección → `tp_c1`.
  - tp_vascular: claudicación → `tp_v1`; TVP (Wells) → `tp_v2`.
  - tp_neuro: neuropatía sistémica → `tp_n1` + `tp_n2`; SDRC → `tp_n3`.
- **Huecos de seguridad:** ninguno. Las rojas que piden urgencias (síndrome compartimental, artritis infecciosa, TVP, neuropatía desmielinizante aguda) ya tenían pregunta con `urgencia`; la rotura del Aquiles y Lisfranc o calcáneo son derivación preferente, como dicen sus preguntas.
- **Revisión clínica del usuario:** hecha (2026-10).

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
- **Amarillas que faltaban, enlazadas (2026-10):** dolor de espalda y abdominal al mismo nivel → `l1` + `l3`; AINE crónicos → `l_gi2`; dolor modificado por la ingesta o la defecación → `l1` + `l_gi2`; osteoporosis o corticoides → `l_e4`; mayor con factores de riesgo cardiovascular → `l_v1` + `l_v2` + `l_v3`; inmunosupresión → `l_inf1`; y el dolor constante que no varía con la postura, además de `br4`, → `l4` (su razonamiento explica que el dolor renal no cambia con la postura y el seudorrenal sí). Comprobado por términos clave en el razonamiento de cada pregunta. Ninguna bandera de lumbar queda sin «¿Por qué?» (test del inventario).
- **Revisión clínica del usuario:** hecha (2026-10), incluidas las banderas y la pregunta `pq_nervio_col` añadidas después.

## Estado de los sistemas compartidos (2026-10)

- **Enlaces:** las 13 banderas con pregunta en su sistema, más cuatro parciales que su pregunta ya explicaba (infección necrotizante → `pq_herida`; yeso → `pq_sdrc` + `pq_compart`; pelo, uñas, piel y temperatura → `end_3`; fiebre en la leucopenia → `hem_3` + `hem_5`), y el dolor nuevo en la hemofilia → `hem_6` (hallazgo 5).
- **Razonamiento propio (10):** endocrino, las 6 rojas sin pregunta (túnel carpiano bilateral, tormenta tiroidea, confusión o sudoración en el diabético, hipopotasemia por diuréticos, xantomas, nódulos supraclaviculares o fiebre con corticoides) y la amarilla de tendinitis calcificante bilateral; hematológico, las amarillas de palidez, coiloniquia y AINE crónicos. El razonamiento escrito para la hemofilia pasó a su pregunta, `hem_6`. Ninguna bandera de los tres sistemas queda sin «¿Por qué?» (test del inventario).
- **Preguntas nuevas, con urgencia:** `hem_5`, sepsis neutropénica (hallazgo 4), y `hem_6`, sangrado articular o muscular en la hemofilia (hallazgo 5).
- **Fuentes leídas en la sesión:** Goodman 2018, cap. 5 entero, cap. 11 (las partes de cada bandera, los criterios de derivación y los puntos clave) y cap. 8, pp. 306 y 314–317 (PDF del usuario); NICE CG151 en nice.org.uk; la guía WFH 2020 (PDF del usuario: principios 5 y 6, caps. 7.1–7.2 y 10.4); y 17 capítulos de StatPearls en PDF del usuario: Pokhrel 2022, Mathew y Thoppil 2022, Lizzo 2025, Castro y Sharma 2025, Bell y Saleh 2026, Hodgens y Sharman 2023, Regalla y Killeen 2026, Hanif 2026, Saad y Mathew 2025 y Punnapuzha 2023, nuevos, y Sevy 2023, Farmer y Matto 2026, Awidi y Babiker 2026, Killeen y Cardenas 2025, Malik 2023, Antunes 2024 y Rout 2024, ya registrados y releídos.
- **Conflictos entre fuentes y cómo se resolvieron:**
  - Hemofilia: Goodman pone el dolor nuevo entre los motivos de derivación, no de atención inmediata; la guía WFH pide tratar con factor de inmediato. Prevalece la WFH (guía de práctica clínica; regla 1).
  - Tormenta tiroidea: fiebre de 40–41 °C y pulso por encima de 140 (Pokhrel 2022) en lugar de «hasta 40,7 °C» (Goodman 2018), y cetoacidosis por encima de 250 mg/dL (Lizzo 2025) en lugar de 300 (Goodman): mismo nivel, gana la más reciente (regla 2).
  - Hipopotasemia: Goodman considera peligroso cualquier potasio por debajo de 3,5; Castro y Sharma 2025, más reciente, clasifica 3,0–3,5 como leve, a menudo sin síntomas. Se usa Castro y se mantiene de Goodman solo la recomendación de consultar antes del ejercicio (regla 2).
  - Sepsis neutropénica: NICE CG151 (fiebre de más de 38 °C) prevalece sobre la definición de Punnapuzha (38,3 °C una vez, o 38 °C durante una hora), que no se cita para ese dato (regla 1).
  - Túnel carpiano: Goodman trata todo síntoma bilateral como bandera roja, y Sevy dice que el bilateral es frecuente. No se contradicen: se dicen las dos cosas, y lo que pesa son los signos acompañantes.
- **Revisión clínica del usuario:** hecha (2026-10), incluidas las preguntas `hem_5` y `hem_6` y el texto nuevo de la bandera de xantomas.

### Hallazgos de esta sesión

5. **Hemofilia sin pregunta urgente.** La WFH pide tratar de inmediato el sangrado articular o muscular, y considera urgencia musculoesquelética el compromiso neurovascular. Ninguna pregunta dispara la alerta. Resuelto (decisión del usuario, 2026-10): `hem_6`, pregunta urgente en hematológico, «(Si tiene hemofilia u otro trastorno hereditario de la coagulación) ¿Tiene un dolor nuevo en una articulación o un músculo, con hormigueo o tirantez, hinchazón, calor o dificultad para moverla?», con una urgencia que pida tratarlo hoy según su pauta y su unidad de hemofilia, y urgencias si hay hormigueo, adormecimiento o pérdida de fuerza, o dolor en la ingle o el abdomen.
6. **Texto de la bandera de xantomas.** «Xantomas eruptivos en tendones extensores» mezclaba dos tipos que StatPearls (Bell y Saleh 2026) distingue: los eruptivos (pápulas en la piel, triglicéridos muy altos, riesgo de pancreatitis) y los tendinosos (nódulos en los tendones, hipercolesterolemia). Cambiado (decisión del usuario, 2026-10) a «Xantomas: pápulas amarillentas en las caras de extensión (eruptivos) o nódulos en los tendones extensores o el Aquiles (tendinosos)».
7. **Tormenta tiroidea, hipoglucemia, cetoacidosis e hipopotasemia:** sin pregunta nueva. Son signos que se ven en la consulta, no algo que se pregunte, y el razonamiento dice qué hacer en el momento.

## Siguientes pasos

Fase M cerrada (2026-10): las banderas rojas y amarillas de los sistemas compartidos y de las siete regiones tienen su «¿Por qué?» (enlace a su pregunta o razonamiento propio), con un test de inventario por región. Una bandera nueva necesita lo mismo: enlace si su sistema tiene una pregunta que la explica, razonamiento propio con fuente leída si no, y actualizar el test de su región.
