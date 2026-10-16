# Quistes de Tarlov (quistes perineurales sacros) — diseño

Estado: **propuesta, pendiente del visto bueno del usuario (octubre 2026). No hay código.** Seguimiento en `MIGRATION_PLAN.md`, Fase P («Después del piloto»: Tarlov como contenido de lumbar, no como capa transversal).

Es la segunda «condición especial» después de la hipermovilidad (`docs/hipermovilidad.md`), pero con otra forma: el quiste de Tarlov es una lesión de una región (el sacro), no una condición que cambie la interpretación de todas las regiones. Por eso va en `data/lumbar.js` y no en `data/comun.js`.

## Fuentes leídas en esta sesión

Leídas enteras (texto completo en PubMed Central, vía Europe PMC):

| Clave propuesta | Referencia | Qué aporta |
|---|---|---|
| `Klepinowski 2021` | Klepinowski T, Orbik W, Sagan L. Global incidence of spinal perineural Tarlov's cysts and their morphological characteristics: a meta-analysis of 13,266 subjects. *Surg Radiol Anat* 2021;43(6):855–863. [doi:10.1007/s00276-020-02644-y](https://doi.org/10.1007/s00276-020-02644-y) · PMC8164596 | Prevalencia en imagen, sexo, nivel, proporción sintomática |
| `Murphy 2023` | Murphy K, Nasralla M, Pron G, Almohaimede K, Schievink W. Management of Tarlov cysts: an uncommon but potentially serious spinal column disease—review of the literature and experience with over 1000 referrals. *Neuroradiology* 2024;66(1):1–30 (publicado en línea en 2023). [doi:10.1007/s00234-023-03226-6](https://doi.org/10.1007/s00234-023-03226-6) · PMC10761484 | Clínica por cohortes (tablas 1–2), cribado, diagnóstico (RM sacra), tratamiento, tejido conectivo |
| `Baker 2018` | Baker M, Wilson M, Wallach S. Urogenital symptoms in women with Tarlov cysts. *J Obstet Gynaecol Res* 2018;44(9):1817–1823. [doi:10.1111/jog.13711](https://doi.org/10.1111/jog.13711) · PMC6150833 | Síntomas urogenitales y urodinámica en 65 mujeres |
| `Hulens 2025` | Hulens M, Zajonc P, Bruyninckx F, et al. High prevalence of small-fiber neuropathy in patients with Tarlov cysts. *J Pain Res* 2025;18:2241–2263. [doi:10.2147/JPR.S513705](https://doi.org/10.2147/JPR.S513705) · PMC12050039 | Frecuencia de sentado y Valsalva como agravantes, SEDh en la cohorte |

Salvedades de lectura:
- Baker 2018: el texto completo de PMC no trae las tablas; las cifras citadas abajo están en el texto y en el resumen.
- Klepinowski 2021 se contradice en dos cifras: prevalencia global 4,18 % (resumen, resultados) frente a 4,27 % (discusión), y mujeres 5,84 % frente a 3,03 % en hombres (resumen) frente a 7,01 % y 4,05 % (tabla 4). Si se cita, se citan las de la tabla 4 y el 4,18 % del análisis principal, diciendo que es una prevalencia en RM (I² = 96 %).
- Murphy 2023 es de un grupo que hace la técnica que recomienda (aspiración y sellante de fibrina): se usa para clínica y diagnóstico, no para decidir el tratamiento.
- Hulens 2025: cuestionario propio sin validar, solo mujeres de una consulta de dolor, sin grupo control y sin comprobar que los quistes fueran sintomáticos. Sirve para decir «frecuente en estas pacientes», nunca para dar una sensibilidad.

**Necesito en PDF** (no están en texto completo abierto; no se cita nada de ellas hasta leerlas):

1. **Hulens 2018** — Hulens MA, et al. Can patients with symptomatic Tarlov cysts be differentiated from patients with specific low back pain based on comprehensive history taking? *Acta Neurochir (Wien)* 2018;160(4):839–844. [doi:10.1007/s00701-018-3494-z](https://doi.org/10.1007/s00701-018-3494-z). **Es la más importante**: el único estudio con grupo control (33 con quiste sintomático frente a 42 con lumbalgia o ciática de otra causa). Murphy 2023 (tabla 2) resume sus cifras (sentado 100 % frente a 74 %, paseos largos 75 % frente a 34 %, coccigodinia, dolor anal, incontinencia fecal leve…), pero no las doy por buenas sin leer el artículo.
2. **Lim y Selbi 2023** — «Tarlov Cyst», StatPearls (NCBI Bookshelf, PMID 35881759). La fuente de contraste habitual del proyecto; Bookshelf no es accesible desde la sesión.
3. **Paredes Mogica 2023** — Sacral Tarlov perineurial cysts: a systematic review of treatment options. *J Neurosurg Spine* 2024;40(3):375–388. [doi:10.3171/2023.9.SPINE23559](https://doi.org/10.3171/2023.9.SPINE23559). Su resumen dice que el 90 % son mujeres, que los trastornos del tejido conectivo como el Ehlers-Danlos «conllevan un riesgo considerable» y que un quiste grande o varios pueden dar un síndrome de cola de caballo. Lo necesito para las dos relaciones que pides (cauda equina y Fase P); sin él, esas frases no entran.
4. **Goodman 2018** (ya lo tienes en PDF): ¿menciona el quiste de Tarlov o el quiste perineural? Si sí, las páginas; si no, basta con decírmelo.
5. Opcionales, para la relación con la Fase P: **Henderson 2017** (Neurological and spinal manifestations of the Ehlers-Danlos syndromes, *Am J Med Genet C* 175(1):195–211, el mismo número que Malfait 2017) y **Marathe 2022** (Spinal manifestations of Ehlers-Danlos syndrome: a scoping review, *J Neurosurg Spine* 37(6):783–793).

## Lo que dicen las fuentes leídas

**Qué es.** Una dilatación llena de líquido cefalorraquídeo de la vaina de la raíz posterior, junto al ganglio de la raíz dorsal, casi siempre en el sacro, donde la presión hidrostática del LCR es mayor. Se acepta un mecanismo valvular: entra LCR y le cuesta salir (Murphy 2023, «Anatomy and pathogenesis»; Hulens 2025, discusión).

**Frecuencia en la RM** (Klepinowski 2021): 22 estudios, 13 266 personas. Prevalencia 4,18 % (IC 95 % 2,47–6,30), con heterogeneidad enorme; 5,5 % en adultos y 0,5 % en niños; más en mujeres (7,0 % frente a 4,1 %, tabla 4); S2 es el nivel más frecuente (47 % de los sacros); diámetro medio 12 mm; el 43 % de las personas tiene más de uno. **Solo el 15,6 % de los quistes se correspondía con síntomas de compromiso neural**, y el dolor lumbar inespecífico no se atribuyó al quiste. Murphy 2023 (tabla 1): del 1,3 % al 13,2 % según el estudio; más alta con RM sacra dedicada que con RM lumbar, que puede no llegar a verlos.

**Clínica** (cohortes de pacientes derivadas, todas con sesgo de selección; Murphy 2023, tabla 2; Baker 2018; Hulens 2025):
- Dolor lumbar o sacro (83–89 %), dolor de pierna (75–77 %), coccigodinia, dolor perineal o genital, dispareunia.
- **Peor al estar sentado**: 93 % (Hulens 2025); 62 % «al pasar a sentado o de pie» (Baker 2018). También de pie (87 %), con **Valsalva (62 %)** y con impactos como conducir por un firme irregular (74 %) (Hulens 2025, tabla 1). Mecanismo propuesto: al sentarse el LCR baja y sube la presión sacra; el Valsalva sube la presión del LCR (Hulens 2025, discusión).
- **Vejiga, intestino y función sexual**: urgencia (54 %) y frecuencia (48 %) urinarias, urgencia con incontinencia (31 %, frente a 1–7 % en la población general) (Baker 2018); en la cohorte de Murphy (213 pacientes), vejiga 43 %, intestino 29 %, sexual 43 %, tono del esfínter anal reducido 29 %.
- **Signos**: aquíleo abolido (61 %), debilidad de la flexión plantar (41 %), hipoestesia S2 (64 %) y S3–S5 (46 %) en la cohorte de Murphy; el pie caído es raro (2 de 213).
- **Nada de esto distingue por sí solo**: el estudio con grupo control es Hulens 2018 (pendiente de leer). Sentarse y el Valsalva también empeoran el dolor discal; no hay ninguna prueba clínica con sensibilidad, especificidad ni LR.

**Por qué se pasa por alto** (Murphy 2023): el informe de la RM lo da por incidental; la RM lumbar no siempre cubre el sacro; la electromiografía habitual explora L3–S1 y no S2–S4, donde están casi todos; y no se pregunta por vejiga, intestino y función sexual.

**Diagnóstico** (Murphy 2023, «Diagnosis» y «Recommendations»): RM lumbar más **RM sacra dedicada**, planos axial y sagital. Encontrar el quiste no basta: hay que comprobar que el dolor está en su zona y que los síntomas siguen los dermatomas de la raíz afectada, y descartar antes otras causas (en mujeres con dolor pélvico, endometriosis, miomas, piriforme, masas ginecológicas).

**Tratamiento** (Murphy 2023): conservador (analgésicos, neuromoduladores, fisioterapia) y, si falla y se confirma que el quiste es sintomático, aspiración con sellante de fibrina o cirugía. No hay ningún estudio de fisioterapia: solo un grupo de 12 pacientes «conservadores» en Jiang 2017, que se lee a través de Murphy (tabla 3) y no se puede citar como fuente propia.

**Tejido conectivo** (Murphy 2023; Hulens 2025): la ectasia dural es frecuente en el síndrome de Marfan (63 % en una cohorte de 57) y se describe en el Ehlers-Danlos y en el Loeys-Dietz, pero **la frecuencia real de quistes de Tarlov en estos síndromes no se conoce: solo hay casos clínicos** (Murphy 2023). En la cohorte de Hulens 2025, el 10 % de las 126 mujeres tenía un SEDh diagnosticado, sin grupo control.

## Dónde encaja en lumbar

Lo que se ha valorado, con la recomendación en cada caso:

| Sitio | Qué sería | Recomendación |
|---|---|---|
| **Fase 2, pregunta nueva** | Una pregunta en `l_urogenital`, justo después de `l6` (cauda equina), sobre el patrón crónico: dolor sacro, coccígeo o perineal que empeora sentado, con síntomas de vejiga, intestino o sexuales de larga evolución | **Sí.** Es donde el fisio ya pregunta por esfínteres, y ponerla al lado de `l6` deja clara la diferencia entre lo nuevo (urgencia) y lo crónico (derivación preferente) |
| **Fase 2, `razonamiento` de `l6`** | Un párrafo en «Con qué se confunde»: un quiste de Tarlov conocido no explica un cambio nuevo | **Sí.** Es lo más importante para la seguridad (ver «Relación con la cauda equina») |
| Fase 2, bandera roja o amarilla | Una línea en `banderasRojas`/`banderasAmarillas` de `l_urogenital` | **No.** No es una bandera roja, y la regla de la Fase M es enlazar antes que escribir: la pregunta ya lo cubre |
| **Fase 4, `razonamiento` de `lu_step1c`** | Una frase en el «En detalle»: la exploración neurológica habitual llega a S1, no a S2–S4 (sensibilidad perineal, reflejo anal) | **Sí, una frase** (Murphy 2023). No cambia ni la pregunta ni las opciones |
| Fase 4, opción o paso nuevo del árbol | Una opción «SACRO-PERINEAL» en `lu_step4`, o un `lu_step5` con `derivacion` | **No.** `lu_step4` es de elección única y el patrón puede convivir con un dolor discal o facetario; un paso nuevo añade una pregunta a todos los pacientes lumbares y cambia la navegación. La pregunta de la fase 2 lo cubre |
| Fase 4b, hipótesis nueva (`lu10`) | «Quiste de Tarlov sintomático», con `DOSIS_DERIVAR` | **No.** No hay ninguna prueba clínica con precisión publicada (la hipótesis no puntuaría nunca), el diagnóstico exige imagen y correlación, y una etiqueta «quiste de Tarlov» en la fase 5 se leería como diagnóstico |
| Formulario previo lumbar | Preguntas sobre sentado y toser | **Nada nuevo:** «Estando sentado un rato» y «Al toser, estornudar o hacer fuerza en el baño» ya están en `empeora` y salen como pista en `lu_step4` |
| Fase 3, zonas de síntomas (Fase N) | Zonas «Sacro o cóccix» y «Periné o genitales» | **Decisión 5** |
| Fase 6, red de seguridad | — | Nada: la de lumbar ya es la cauda equina |
| Calculadora de cuestionarios | Tarlov Cyst Quality of Life Scale | **No:** sin versión validada en España |

## Relación con la cauda equina (`l6`, urgencia)

El quiste de Tarlov y la cauda equina comparten justo los síntomas que activan la urgencia: periné, vejiga, intestino. Las fuentes leídas los separan por el **tiempo**, no por el tipo de síntoma:

- Los síntomas del quiste son de larga evolución: 9,5 años de media en la cohorte de Hulens que resume Murphy 2023; 6 años entre el inicio y la consulta en la de Marino (también a través de Murphy). El de `l6` ya dice, con Finucane 2020, que «lo que cuenta es el cambio».
- Klepinowski 2021 cuenta el «síndrome de cola de caballo crónico» entre los síntomas de compromiso neural que puede dar un quiste. Paredes Mogica 2023 lo dice en el resumen de un quiste grande o de varios (pendiente de leer).

Reglas que propongo:
1. **La pregunta de Tarlov nunca resta a `l6`.** `l6` conserva su `urgencia` y su `.sq2-urg`, y sigue visible en modo breve. La pregunta nueva no tiene `urgencia` y no cambia nada de `l6`.
2. El `razonamiento` de las dos lo dice igual: un síntoma de esfínteres o de silla de montar **nuevo o que empeora** es `l6`, aunque el paciente tenga un quiste de Tarlov en una RM antigua. Un quiste conocido no explica un cambio nuevo.
3. La pregunta nueva pregunta por síntomas de esfínteres **que ya tenía**, para que un «sí» no se confunda con un cambio agudo. Si el fisio duda, se marca `l6`.

## Relación con la hipermovilidad (Fase P)

- El vínculo con el tejido conectivo es plausible (ectasia dural) pero **no está medido**: solo hay casos clínicos y una cohorte sin control (Murphy 2023; Hulens 2025). Paredes Mogica 2023 habla de «riesgo considerable» en su resumen (pendiente de leer).
- Recomendación (**decisión 4**): **ninguna regla automática**. La tarjeta «Hipermovilidad» no activa ni da peso a la pregunta de Tarlov, y la pregunta no toca `SIS_HIPERMOVILIDAD`, que es común a las 7 regiones. Basta con una frase en el «En detalle» de la pregunta nueva: el quiste se describe en trastornos hereditarios del tejido conectivo, sin cifras de frecuencia.
- Con lo que hay hoy no se puede escribir ninguna línea en el recuadro de hipermovilidad de la fase 5.

## Borrador de la pregunta (fase 2)

En `l_urogenital`, después de `l6`. Id propuesto `l_u5`, siguiendo `l_u3a`, `l_u3b` y `l_u4`.

- **Texto**: «¿Tiene desde hace meses dolor en el sacro, el cóccix, el periné o los genitales que empeora al estar sentado, junto con molestias de orina, de heces o sexuales que ya tenía?»
- `alerta: true` (borde rojo de énfasis), sin `urgencia`, sin `s1`.
- `anatomia`: la raíz o el sacro, si Kenhub tiene artículo (Fase K: comprobar el slug antes).
- **Por qué** (borrador): en el sacro la presión del LCR es mayor, y la vaina de una raíz sacra puede dilatarse en un quiste junto al ganglio de la raíz dorsal. Al sentarse o hacer fuerza sube la presión y el quiste comprime la raíz: dolor sacro, perineal o en la pierna, y síntomas de vejiga, intestino o sexuales (Murphy 2023; Hulens 2025).
- **Cuánto pesa** (borrador): poco específico solo. El 4 % de las RM tiene algún quiste, y solo uno de cada seis da síntomas (Klepinowski 2021); sentarse y el Valsalva también empeoran el dolor discal. Lo que orienta es el conjunto crónico y sacro-perineal. Un «sí» es una derivación preferente al médico, no urgente, para valorar una RM sacra dedicada. Si algo de vejiga, intestino o silla de montar es nuevo o empeora, es `l6`.
- **En detalle** (borrador): frecuencia en la RM y su falta de relación con los síntomas (Klepinowski 2021); clínica de las cohortes (Murphy 2023, Baker 2018, Hulens 2025, con sus limitaciones); por qué se pasa por alto, la RM sacra y la correlación con los dermatomas (Murphy 2023); diferencial en mujeres con dolor pélvico (endometriosis, miomas, piriforme, masas; Murphy 2023); tejido conectivo, sin cifras (Murphy 2023); qué hacer con un «sí» y con un quiste ya conocido.
- Se revisa con Hulens 2018 y StatPearls cuando los lea, y el «cuánto pesa» se ajusta a lo que digan.

## Decisiones que tienes que tomar

1. **¿Pregunta en la fase 2, opción en el árbol o hipótesis?** Recomiendo **una pregunta en `l_urogenital`**, más el párrafo en `l6` y la frase en `lu_step1c`. Nada en el árbol ni en la 4b, por los motivos de la tabla de arriba.

2. **¿Qué hace un «sí» fuera de la fase 2?** Hoy, una respuesta «sí» sin `urgencia` solo enciende el aviso genérico y llega a `sq` (📋 Notas, payload). Una derivación preferente que no sale en la fase 5 ni en el 📄 Informe se pierde. Opciones:
   - a) Nada nuevo: la recomendación vive solo en el razonamiento.
   - b) Un campo nuevo y opcional `derivacion: '…'` en las preguntas de la fase 2, que reutiliza lo que ya hace el árbol: alerta bajo la pregunta, fase 5, 📋 Notas «🩺 DERIVACIÓN MÉDICA», 📄 Informe «Se recomienda valoración médica» y el payload `dv[]`, que physiq-report ya lee.

   **Recomiendo b)**. Es un mecanismo general (el criterio de Goodman de `l_espondilo` u otras preguntas podrían usarlo después), y el texto sería: «Dolor sacro-perineal crónico con síntomas de esfínteres o sexuales: derivación médica preferente (no urgente) para valorar una RM sacra dedicada».

3. **¿A quién se deriva?** Recomiendo **al médico de familia o al que deriva, no directamente a un especialista**, pidiendo una RM sacra dedicada (Murphy 2023). Murphy apunta a neurocirugía o columna y, si hay síntomas pélvicos, a ginecología o urología, pero en el sistema español la puerta es el médico. El texto no nombraría la técnica de tratamiento.

4. **Relación con la hipermovilidad.** Recomiendo **ninguna regla automática**: solo una frase sin cifras en el razonamiento. Se revisa cuando lea Paredes Mogica 2023 y, si me los pasas, Henderson 2017 y Marathe 2022.

5. **¿Zonas nuevas en la tarjeta «Síntomas» de lumbar (Fase N)?** Hoy no hay sacro, cóccix ni periné. Recomiendo **dejarlo para después**: afecta también a la cauda equina y a la sacroilíaca y merece su propia sesión, que tendría que cambiar `ZONAS_SINTOMA`, las `pasos` y las pruebas de la Fase N.

6. **¿Qué pasa con un paciente que trae un quiste de Tarlov en su RM?** Recomiendo **solo texto en el razonamiento** de la pregunta nueva: el quiste es frecuente y casi siempre incidental, así que ni explica por sí solo el dolor lumbar ni se descarta sin mirar si los síntomas siguen sus dermatomas y si hay esfínteres. Sin casilla ni estado nuevo.

7. **Fuentes.** Recomiendo **no implementar hasta leer Hulens 2018 y StatPearls**: la primera es el único estudio con grupo control, y la segunda es la fuente de contraste del proyecto. Con las cuatro leídas ya se puede escribir el razonamiento, pero el «cuánto pesa» quedaría sin el único dato comparativo.

## Cambios técnicos (cuando se apruebe)

- `data/lumbar.js`: pregunta `l_u5` con `razonamiento` (fuentes del registro), un párrafo en el `detalle` de `l6` y una frase en el `detalle` de `lu_step1c`. Sin cambios en la navegación del árbol, así que el snapshot de `tests/fixtures/cif-tree-navigation.json` no cambia.
- `data/referencias.js`: `Klepinowski 2021`, `Murphy 2023`, `Baker 2018`, `Hulens 2025` (y las que se lean después), y `node tests/gen-referencias.mjs`.
- `docs/razonamiento-banderas.md`: inventario de lumbar, si alguna bandera de `l_urogenital` pasa a enlazar la pregunta nueva.
- Solo con la decisión 2b: campo `derivacion` en las preguntas de la fase 2 (`buildSistemaHTML`, la fase 5, `📋 Notas`, `📄 Informe`, `dv[]` del payload), con pruebas unitarias: aparece solo con «sí», nunca con `urgencia` a la vez, y no cambia `ur[]`.
- Pruebas: unitarias (forma del razonamiento, `l6` sigue con `urgencia` y `.sq2-urg`, la pregunta nueva no tiene `urgencia`); prueba de humo `--solo banderas` y la sección de cribado lumbar.
