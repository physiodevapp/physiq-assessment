# Quistes de Tarlov (quistes perineurales sacros) — diseño

Estado: **las 7 recomendaciones aceptadas por el usuario (octubre 2026). Sin código todavía**: según la decisión 7, la implementación espera a leer StatPearls (Lim y Selbi 2023). Seguimiento en `MIGRATION_PLAN.md`, Fase P («Después del piloto»: Tarlov como contenido de lumbar, no como capa transversal).

Es la segunda «condición especial» después de la hipermovilidad (`docs/hipermovilidad.md`), pero con otra forma: el quiste de Tarlov es una lesión de una región (el sacro), no una condición que cambie la interpretación de todas las regiones. Por eso va en `data/lumbar.js` y no en `data/comun.js`.

## Fuentes leídas

Leídas enteras:

| Clave propuesta | Referencia | Cómo se leyó | Qué aporta |
|---|---|---|---|
| `Klepinowski 2021` | Klepinowski T, Orbik W, Sagan L. Global incidence of spinal perineural Tarlov's cysts and their morphological characteristics: a meta-analysis of 13,266 subjects. *Surg Radiol Anat* 2021;43(6):855–863. [doi:10.1007/s00276-020-02644-y](https://doi.org/10.1007/s00276-020-02644-y) | PMC8164596 | Prevalencia en imagen, sexo, nivel, proporción sintomática |
| `Murphy 2023` | Murphy K, Nasralla M, Pron G, Almohaimede K, Schievink W. Management of Tarlov cysts: an uncommon but potentially serious spinal column disease—review of the literature and experience with over 1000 referrals. *Neuroradiology* 2024;66(1):1–30 (publicado en línea en 2023). [doi:10.1007/s00234-023-03226-6](https://doi.org/10.1007/s00234-023-03226-6) | PMC10761484 | Clínica por cohortes (tablas 1–2), cribado, diagnóstico (RM sacra), tejido conectivo |
| `Baker 2018` | Baker M, Wilson M, Wallach S. Urogenital symptoms in women with Tarlov cysts. *J Obstet Gynaecol Res* 2018;44(9):1817–1823. [doi:10.1111/jog.13711](https://doi.org/10.1111/jog.13711) | PMC6150833 | Síntomas urogenitales y urodinámica en 65 mujeres |
| `Hulens 2018` | Hulens MA, Dankaerts W, Rasschaert R, Bruyninckx F, Willaert ML, Vereecke C, Vansant G. Can patients with symptomatic Tarlov cysts be differentiated from patients with specific low back pain based on comprehensive history taking? *Acta Neurochir (Wien)* 2018;160(4):839–844. [doi:10.1007/s00701-018-3494-z](https://doi.org/10.1007/s00701-018-3494-z) | PDF del usuario | **El único estudio con grupo control** (tabla 1) |
| `Paredes Mogica 2023` | Paredes Mogica JA, Feigenbaum F, Pilitsis JG, Schrot RJ, Oaklander AL, De EJB. Sacral Tarlov perineurial cysts: a systematic review of treatment options. *J Neurosurg Spine* 2024;40(3):375–388 (publicado en línea en 2023). [doi:10.3171/2023.9.SPINE23559](https://doi.org/10.3171/2023.9.SPINE23559) | PDF del usuario | Diagnóstico, manejo conservador (tabla 3), indicaciones de intervención rápida, tejido conectivo, algoritmo (fig. 4) |
| `Henderson 2017` | Henderson FC Sr, Austin C, Benzel E, et al. Neurological and spinal manifestations of the Ehlers–Danlos syndromes. *Am J Med Genet C Semin Med Genet* 2017;175(1):195–211. [doi:10.1002/ajmg.c.31549](https://doi.org/10.1002/ajmg.c.31549) | PDF del usuario | Tejido conectivo (EDS), patrones clínicos del quiste sintomático (pp. 206–207) |
| `Isono 1999` | Isono M, Hori S, Konishi Y, et al. Ehlers-Danlos syndrome associated with multiple spinal meningeal cysts—case report. *Neurol Med Chir (Tokyo)* 1999;39(5):380–383. [PubMed 10481443](https://pubmed.ncbi.nlm.nih.gov/10481443/) | PDF del usuario | Comprobar la cita de Paredes Mogica 2023 sobre el Ehlers-Danlos |
| `Hulens 2025` | Hulens M, Zajonc P, Bruyninckx F, et al. High prevalence of small-fiber neuropathy in patients with Tarlov cysts. *J Pain Res* 2025;18:2241–2263. [doi:10.2147/JPR.S513705](https://doi.org/10.2147/JPR.S513705) | PMC12050039 | Agravantes en 126 mujeres, SEDh en la cohorte |

Salvedades de lectura:
- **Klepinowski 2021** se contradice en dos cifras: prevalencia global 4,18 % (resumen, resultados) frente a 4,27 % (discusión), y mujeres 5,84 % frente a 3,03 % en hombres (resumen) frente a 7,01 % y 4,05 % (tabla 4). Se citan el 4,18 % del análisis principal y las cifras de la tabla 4, diciendo que es una prevalencia en RM (I² = 96 %).
- **Baker 2018**: el texto completo de PMC no trae las tablas; las cifras citadas están en el texto y en el resumen.
- **Hulens 2018**: estudio retrospectivo y exploratorio con 33 pacientes frente a 42 controles, sin cegar.
  - Solo entraron quistes de 15 mm o más, confirmados con electromiografía sacra; a los controles no se les hizo.
  - Las cifras son frecuencias de un estudio de casos y controles: no se convierten en LR, porque ese diseño las infla.
- **Las dos revisiones de tratamiento tiran en direcciones opuestas, y en las dos los autores practican lo que recomiendan**:
  - Murphy 2023 (neurorradiología intervencionista) pide como primera línea la aspiración con sellante de fibrina.
  - Paredes Mogica 2023 desaconseja esa técnica (p. 380) y recomienda la cirugía de envoltura, que hace Feigenbaum, uno de sus autores.
  - Por eso **PhysiQ no nombra ninguna técnica** (decisión 3) y de las dos usa solo la clínica, el diagnóstico y el manejo conservador.
- **Paredes Mogica 2023** habla de «asociaciones fuertes confirmadas» con el Ehlers-Danlos o el Marfan (p. 380), pero la referencia que da es Isono 1999: un solo caso. No se usa como dato (ver «Relación con la hipermovilidad»).
  - Es una mujer de 40 años con Ehlers-Danlos de tipo VI (cifoescoliótico, no el hipermóvil), con quistes meníngeos sacros múltiples que se extendían a la pelvis.
  - Sus propios autores escriben que la asociación entre quistes meníngeos y Ehlers-Danlos «no se ha encontrado» y que solo es «posible» (pp. 382–383).
- **Henderson 2017** es una revisión narrativa del grupo de trabajo del Consorcio Internacional sobre el Ehlers-Danlos, sin método sistemático.
  - Su sección sobre el quiste de Tarlov (pp. 206–207) apoya sus cifras en una revisión **no publicada** de 756 pacientes del Johns Hopkins, y no da porcentajes del resto.
  - Su primer autor es neurocirujano y cirujano de estos quistes, como Feigenbaum (Feigenbaum y Henderson 2006, ref. de su p. 207).
  - Se cita como descripción, sin dar sus porcentajes como dato propio.
- **Hulens 2025**: cuestionario propio sin validar, solo mujeres de una consulta de dolor, sin grupo control y sin comprobar que los quistes fueran sintomáticos. Sirve para decir «frecuente en estas pacientes», nunca para dar una sensibilidad.

**Pendientes:**
1. **Lim y Selbi 2023**, «Tarlov Cyst», StatPearls ([NBK582154](https://www.ncbi.nlm.nih.gov/books/NBK582154/), PMID 35881759). Bookshelf pide un reCAPTCHA y Europe PMC no sirve el capítulo, así que hace falta el PDF. **La implementación espera a leerlo (decisión 7).**
2. **Goodman 2018**: ¿menciona el quiste de Tarlov o el quiste perineural? Si no, basta con decirlo.
3. **Opcional**: **Marathe 2022**, Spinal manifestations of Ehlers-Danlos syndrome: a scoping review, *J Neurosurg Spine* 2022;37(6):783–793 ([doi:10.3171/2022.6.SPINE211011](https://doi.org/10.3171/2022.6.SPINE211011)). Con Henderson 2017 e Isono 1999 leídos ya no hace falta para la decisión 4.

## Lo que dicen las fuentes leídas

**Qué es.** Una dilatación llena de líquido cefalorraquídeo (LCR) de la vaina de una raíz sacra, casi siempre en la raíz sensitiva junto al ganglio de la raíz dorsal. En el sacro la presión del LCR es la más alta de la columna en bipedestación, y las raíces largas no tienen un agujero óseo que las contenga. Se acepta un mecanismo valvular: el LCR entra y le cuesta salir (Murphy 2023, «Anatomy and pathogenesis»; Paredes Mogica 2023, p. 375).

**Frecuencia en la RM** (Klepinowski 2021):
- 22 estudios con 13 266 personas: prevalencia del 4,18 % (IC 95 % 2,47–6,30), con una heterogeneidad enorme.
- 5,5 % en adultos y 0,5 % en niños; más en mujeres (7,0 % frente a 4,1 %, tabla 4).
- S2 es el nivel más frecuente (47 % de los quistes sacros); diámetro medio de 12 mm; el 43 % de quienes tienen uno tiene más.
- **Solo el 15,6 % de los quistes se correspondía con síntomas de compromiso neural**, y el dolor lumbar inespecífico no se atribuyó al quiste.
- La cifra depende de la RM:
  - del 1,3 % al 13,2 % según el estudio, más alta con RM sacra dedicada que con RM lumbar, que puede no llegar a verlos (Murphy 2023, tabla 1);
  - en una serie europea, alrededor del 1 % en RM cervicales y lumbares, del 5 % en torácicas y del 15 % en sacras (Paredes Mogica 2023, p. 377).

**Clínica.** Todas las cohortes son de pacientes derivados y tienen sesgo de selección.
- **Dolor**:
  - dolor lumbar o sacro (83–89 %) y de pierna (75–77 %) (Murphy 2023, tabla 2; Baker 2018; Hulens 2025);
  - coccigodinia, dolor perineal o genital, dispareunia;
  - el quiste afecta sobre todo a la raíz sensitiva: dolor crónico y síntomas sensitivos en la zona baja de la espalda, el sacro y la pelvis; menos a menudo en el borde lateral del pie (S1) o la cara posterior de la pierna (S2) (Paredes Mogica 2023, p. 377).
- **Lo que distingue del dolor lumbar de otra causa** (Hulens 2018, tabla 1; quiste sintomático frente a hernia, degeneración o espondiloartropatía; p ≤ 0,05):

  | Síntoma | Quiste sintomático | Control |
  |---|---|---|
  | Dolor anal | 57 % | 10 % |
  | Incontinencia fecal leve | 55 % | 7 % |
  | Vacilación al orinar | 38 % | 5 % |
  | Retención | 55 % | 17 % |
  | Frecuencia | 69 % | 38 % |
  | Dolor perineal | 24 % | 7 % |
  | Parestesia perineal | 24 % | 5 % |
  | Coccigodinia | 49 % | 17 % |
  | Dispareunia | 37 % | 5 % |
  | Empeora sentado | 100 % | 74 % |
  | Empeora con paseos largos | 75 % | 34 % |
  | Empeora al hacer fuerza | 84 % | 61 % |
  | **Alivia tumbado** | **90 %** | **63 %** |
  | Tuvo que dejar de trabajar | 54 % | 18 % |

  - **No distinguen**: el Valsalva (37 % frente a 29 %), el dolor nocturno (72 % frente a 76 %), la urgencia urinaria y la incontinencia urinaria. Los autores lo explican: el Valsalva sube la presión dentro del canal y también dentro del disco, así que agrava los dos.
  - En Hulens 2025 (sin control), el 93 % empeoraba sentada y el 62 % con Valsalva.
- **Vejiga, intestino y función sexual**:
  - urgencia (54 %) y frecuencia (48 %) urinarias, y urgencia con incontinencia en el 31 %, frente al 1–7 % de la población general (Baker 2018);
  - en la cohorte de Murphy (213 pacientes): vejiga 43 %, intestino 29 %, función sexual 43 %, tono del esfínter anal reducido 29 %;
  - las raíces S2–S4 llevan la inervación de la vejiga, el recto y los órganos sexuales, y una lesión de un solo lado puede dar síntomas en los dos (Paredes Mogica 2023, p. 377).
- **Signos** (cohorte de Murphy, en Murphy 2023, tabla 2):
  - aquíleo abolido (61 %), debilidad de la flexión plantar (41 %), hipoestesia S2 (64 %) y S3–S5 (46 %);
  - el pie caído es raro (2 de 213).
- **Patrones clínicos** (Henderson 2017, p. 207, sobre una revisión no publicada; sin cifras propias):
  - el más frecuente, dolor sacro que empeora sentado y de pie y mejora tumbado, con dolor pélvico y perineal en los dermatomas S2–S5 y ciática S1–S2;
  - un tercio con síntomas de vejiga e intestino y alteraciones sensitivas S2–S4, sin ciática;
  - **un grupo pequeño con disfunción de vejiga e intestino y pérdida sensitiva sacra, sin dolor.** La pregunta `l_u5` no lo recoge, porque pregunta por el dolor; ese paciente entra por `l6` si es nuevo y, si es antiguo, por la derivación que dice el razonamiento de `l6` (ver «Relación con la cauda equina»).
- **No hay ninguna prueba clínica con sensibilidad, especificidad ni LR.**

**Por qué se pasa por alto**:
- El informe de la RM da el quiste por incidental, y la RM lumbar no siempre cubre el sacro (Murphy 2023).
- La electromiografía y la conducción nerviosa de las piernas exploran sobre todo las raíces lumbares y suelen salir normales; la latencia terminal del pudendo explora S2–S4 (Paredes Mogica 2023, p. 377; Murphy 2023).
- No se pregunta por vejiga, intestino ni función sexual (Murphy 2023).

**Diagnóstico** (Murphy 2023, «Diagnosis»; Paredes Mogica 2023, p. 377):
- RM sin contraste, lumbar más **sacra dedicada**.
- Encontrar el quiste no basta: hay que comprobar que el dolor está en su zona y que los síntomas siguen los dermatomas de la raíz afectada.
- Hay que descartar antes otras causas; en mujeres con dolor pélvico, endometriosis, miomas, piriforme o masas ginecológicas (Murphy 2023).
- El tamaño del quiste no predice la lesión neural (Paredes Mogica 2023, p. 377).

**Manejo conservador e intervención rápida** (Paredes Mogica 2023, pp. 377–380, tabla 3, fig. 4):
- El quiste asintomático no se trata: se anota y se educa al paciente.
- En el sintomático se empieza por el manejo conservador.
- **Indicaciones raras de intervención rápida**: deterioro clínico rápido, fuga aguda de LCR, extensión intrapélvica o fractura sacra nueva.
- Educación:
  - evitar los picos de presión del LCR, como empujar con fuerza al defecar o levantar cargas máximas;
  - controlar la obesidad y el desacondicionamiento;
  - tratar desde el principio la hipertonía o la debilidad del suelo pélvico.
- La tabla 3 incluye el asiento y la ergonomía, la fisioterapia formal del suelo pélvico, el masaje y el TENS. **Ninguno está estudiado en el quiste de Tarlov**: la guía del manejo conservador sale de estudios del dolor neuropático y de los síntomas vesicales de otras causas (p. 378).
- En la única serie que lo midió, el manejo conservador (fisioterapia, antiinflamatorios y fármacos para el dolor neuropático) fracasó en 9 de 12 pacientes (Jiang 2017, citado en p. 377).
- Si el conservador falla: derivar a especialistas con experiencia quirúrgica en esta lesión (p. 385).

**Tejido conectivo**:
- La ectasia dural es frecuente en el síndrome de Marfan (63 % en una cohorte de 57) y se describe en el Ehlers-Danlos y en el Loeys-Dietz. **La frecuencia real de quistes de Tarlov en estos síndromes no se conoce: solo hay casos clínicos** (Murphy 2023).
- En la cohorte de Hulens 2025, el 10 % de las 126 mujeres tenía un SEDh diagnosticado, sin grupo control.
- Paredes Mogica 2023 lo da por asociación fuerte (p. 380), pero su única referencia es un caso (Isono 1999) cuyos autores dicen que la asociación no se había encontrado.
- Henderson 2017, escrito para el consenso internacional del Ehlers-Danlos, la llama «anecdótica», sin datos epidemiológicos (resumen). Pone entre lo que falta por investigar la prevalencia del quiste en el SEDh y en el EDS clásico (p. 207).
- En la revisión no publicada que cita Henderson, 16 de los 18 meningoceles sacros grandes con erosión ósea eran de mujeres con Marfan o Ehlers-Danlos (p. 207). Son meningoceles, no quistes de Tarlov típicos.
- Con trastornos genéticos del tejido conectivo, la cirugía tiene más riesgo de fuga de LCR (dura muy fina; p. 384).

## Dónde encaja en lumbar (decisión 1, aceptada)

| Sitio | Qué se hace |
|---|---|
| **Fase 2, pregunta nueva `l_u5`** | En `l_urogenital`, justo después de `l6`: el patrón crónico sacro-perineal |
| **Fase 2, `razonamiento` de `l6`** | Un párrafo en «Con qué se confunde»: un quiste de Tarlov conocido no explica un cambio nuevo |
| **Fase 4, `razonamiento` de `lu_step1c`** | Una frase en el «En detalle»: la exploración neurológica habitual de la pierna y la electromiografía no exploran S2–S4 (Murphy 2023; Paredes Mogica 2023) |
| Nada en | Banderas, árbol (opciones, pasos o navegación), hipótesis de la fase 4b, formulario previo (ya pregunta por sentado y por toser), fase 6, calculadora |

## Relación con la cauda equina (`l6`, urgencia)

El quiste de Tarlov y la cauda equina comparten justo los síntomas que activan la urgencia: periné, vejiga, intestino. Las fuentes separan los dos cuadros por el **tiempo**, no por el tipo de síntoma:
- Los síntomas del quiste son de larga evolución: 9,5 años de media en Hulens 2018.
- El razonamiento de `l6` ya dice, con Finucane 2020, que «lo que cuenta es el cambio».
- Un quiste grande, o varios, puede dar un síndrome de cola de caballo (Paredes Mogica 2023, resumen; Klepinowski 2021, «cauda equina crónica»).
- Las indicaciones de intervención rápida son el deterioro clínico rápido, una fuga aguda de LCR, la extensión intrapélvica o una fractura sacra nueva (Paredes Mogica 2023, p. 377).

Reglas:
1. **La pregunta de Tarlov nunca resta a `l6`.** `l6` conserva su `urgencia` y su `.sq2-urg`, y sigue visible en modo breve. La pregunta nueva no tiene `urgencia`.
2. El razonamiento de las dos lo dice igual: un síntoma de esfínteres o de silla de montar **nuevo o que empeora** es `l6`, aunque haya un quiste de Tarlov en una RM antigua. Un quiste conocido no explica un cambio nuevo, y un deterioro rápido con quiste conocido también es urgente.
3. La pregunta nueva pregunta por síntomas que el paciente **ya tenía**. Si el fisio duda, marca `l6`.
4. El párrafo nuevo de `l6` recoge el grupo sin dolor de Henderson 2017: la disfunción de vejiga o intestino con pérdida sensitiva sacra puede aparecer sin dolor. Si es nueva o empeora, es urgencia; si es antigua y nadie la ha estudiado, también merece valoración médica.

## Relación con la hipermovilidad (Fase P; decisión 4, aceptada)

**Ninguna regla automática.** La tarjeta «Hipermovilidad» no activa ni da peso a la pregunta de Tarlov, y la pregunta no toca `SIS_HIPERMOVILIDAD`, que es común a las 7 regiones.

Con Henderson 2017 e Isono 1999 leídos, la decisión se mantiene: la asociación no está medida.

El «En detalle» de `l_u5` lleva una frase sin cifras: el quiste y la ectasia dural se han descrito en trastornos hereditarios del tejido conectivo (Ehlers-Danlos, Marfan), pero su frecuencia en ellos no se conoce (Murphy 2023; Henderson 2017).

## Borrador de la pregunta `l_u5` (fase 2)

En `l_urogenital`, después de `l6`.

- **Texto**: «¿Tiene desde hace meses dolor en el sacro, el cóccix, el periné o el ano que empeora al estar sentado y se alivia tumbado, junto con molestias de orina, de heces o sexuales que ya tenía?»
  - No pregunta por el Valsalva ni por toser, que no distinguen (Hulens 2018).
- **Campos**: `alerta: true`, sin `urgencia` y sin `s1`. `anatomia` solo si Kenhub tiene artículo del sacro o de las raíces sacras (Fase K: comprobar el slug).
- **`derivacion`** (decisiones 2 y 3): «Dolor sacro-perineal crónico con síntomas de esfínteres o sexuales: derivación médica preferente (no urgente) para valorar una RM sacra dedicada.»
- **Por qué** (borrador): en el sacro la presión del LCR es la más alta de la columna en bipedestación, y las raíces largas no tienen un agujero óseo que las contenga. Su vaina puede dilatarse en un quiste junto al ganglio de la raíz dorsal. Al sentarse aumenta la presión en el quiste y al tumbarse baja: de ahí el dolor sacro o perineal y los síntomas de vejiga, intestino y función sexual de las raíces S2–S4 (Paredes Mogica 2023; Hulens 2018).
- **Cuánto pesa** (borrador): poco específico solo.
  - El 4 % de las RM tiene algún quiste, y solo uno de cada seis da síntomas (Klepinowski 2021).
  - En el único estudio con grupo control, sentarse agravaba el dolor en todos los que tenían un quiste sintomático, pero también en el 74 % de los que tenían una lumbalgia de otra causa. Lo que más los separaba eran el dolor anal, la incontinencia fecal leve, la vacilación o retención al orinar y el alivio al tumbarse; el Valsalva no los separaba (Hulens 2018).
  - Un «sí» es una derivación preferente al médico, no urgente. Si algo de vejiga, intestino o silla de montar es nuevo o empeora, es `l6`.
- **En detalle** (borrador):
  - frecuencia en la RM y su escasa relación con los síntomas (Klepinowski 2021);
  - la tabla de Hulens 2018 con sus limitaciones; Baker 2018 sobre la vejiga;
  - por qué se pasa por alto: RM lumbar, electromiografía y no preguntar (Murphy 2023; Paredes Mogica 2023);
  - diferencial en mujeres con dolor pélvico (Murphy 2023);
  - patrones clínicos, sin porcentajes (Henderson 2017);
  - tejido conectivo, sin cifras;
  - qué hacer con un «sí» y con un quiste ya conocido (decisión 6): educación para evitar los picos de presión al defecar y con cargas máximas, y suelo pélvico, sin evidencia propia del quiste (Paredes Mogica 2023, pp. 378 y 380).
- **Se revisa con StatPearls** antes de implementar.

## Decisiones (aceptadas por el usuario, octubre 2026)

1. **Pregunta en la fase 2**, más el párrafo en `l6` y la frase en `lu_step1c`. Nada en el árbol ni en la 4b.
2. **Campo nuevo y opcional `derivacion` en las preguntas de la fase 2**, que reutiliza lo que ya hace el árbol: alerta bajo la pregunta, fase 5, `📋 Notas` «🩺 DERIVACIÓN MÉDICA», `📄 Informe` «Se recomienda valoración médica» y `dv[]` en el payload, que physiq-report ya lee.
3. **Se deriva al médico**, de forma preferente y no urgente, para valorar una RM sacra dedicada. Sin nombrar especialista ni técnica de tratamiento: las dos revisiones se contradicen en la técnica.
4. **Hipermovilidad: ninguna regla automática**, solo una frase sin cifras.
5. **Zonas de sacro, cóccix y periné en la tarjeta «Síntomas» (Fase N)**: en otra sesión.
6. **Quiste ya conocido**: solo texto en el razonamiento de `l_u5`.
7. **No se implementa hasta leer StatPearls.** Hulens 2018 ya está leído.

## Cambios técnicos (cuando se implemente)

- `data/lumbar.js`:
  - pregunta `l_u5` con `razonamiento` y `derivacion`;
  - un párrafo en el `detalle` de `l6` y una frase en el `detalle` de `lu_step1c`.
  - Sin cambios en la navegación del árbol, así que el snapshot `tests/fixtures/cif-tree-navigation.json` no cambia.
- `data/referencias.js`: las fuentes que se citen (Klepinowski 2021, Murphy 2023, Baker 2018, Hulens 2018, Paredes Mogica 2023, Hulens 2025 y Henderson 2017; Isono 1999 solo si se cita) y StatPearls, y `node tests/gen-referencias.mjs`.
- `derivacion` en las preguntas de la fase 2:
  - código en `buildSistemaHTML` (`app.js`), la fase 5, `📋 Notas`, `📄 Informe` y `dv[]` del payload;
  - pruebas unitarias: aparece solo con «sí», nunca junto a `urgencia`, no cambia `ur[]` y llega a `dv[]`.
- `docs/razonamiento-banderas.md`: inventario de lumbar, si alguna bandera de `l_urogenital` pasa a enlazar `l_u5`.
- Pruebas:
  - unitarias: forma del razonamiento; `l6` sigue con `urgencia` y `.sq2-urg`; `l_u5` no tiene `urgencia`;
  - prueba de humo: `--solo banderas` y el cribado lumbar, incluida la alerta de `derivacion`.
