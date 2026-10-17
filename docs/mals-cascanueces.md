# Síndrome del ligamento arcuato medio (MALS) y síndrome del cascanueces — borrador de diseño

Estado: **implementado (octubre 2026), pendiente de la revisión del usuario antes de `main`.** El usuario aceptó las 7 recomendaciones («Decisiones», al final) y aportó el PDF de Bruessel 2026; las 4 fuentes están leídas enteras. Seguimiento en `MIGRATION_PLAN.md`, Fase P («Después del piloto»).

Origen: la pregunta del usuario (2026-10) de si la app tiene en cuenta condiciones que pueden coexistir con el Ehlers-Danlos, como el SIBO, el MALS o el cascanueces. No las tenía. El SIBO queda fuera de este borrador: es un diagnóstico digestivo sin presentación musculoesquelética propia.

Son dos **síndromes de compresión vascular abdominal**: una arteria (el tronco celíaco en el MALS) o una vena (la renal izquierda en el cascanueces) comprimida por una estructura vecina. El fisio no los diagnostica. Lo que interesa a PhysiQ es si **pueden presentarse como un dolor que parezca musculoesquelético** y qué hacer si lo sospecha. Como el Tarlov, serían contenido de una región, no una capa transversal como la hipermovilidad o el POTS.

## Fuentes leídas

Leídas enteras:

| Clave propuesta | Referencia | Cómo se leyó | Qué aporta |
|---|---|---|---|
| `Bruessel 2026` | Bruessel P, Govender M, Frahm-Jensen G. The investigation and management of the abdominopelvic vascular compression syndromes in patients with Ehlers–Danlos syndrome and hypermobility spectrum disorder. *Vasc Health Risk Manag* 2026;22:592420. [doi:10.2147/VHRM.S592420](https://doi.org/10.2147/VHRM.S592420) | PDF del usuario (15 pp.), tablas incluidas; también en PMC13037643 | La única revisión sobre estas compresiones en el Ehlers-Danlos y la hipermovilidad: cuánta evidencia hay de la asociación |
| `Saleem 2023` | Saleem T, Katta S, Baril DT. «Celiac Artery Compression Syndrome». StatPearls [Internet], NCBI Bookshelf, actualizado el 26 de abril de 2023. [NBK470601](https://www.ncbi.nlm.nih.gov/books/NBK470601/) | Capítulo completo | MALS: mecanismo, clínica, diagnóstico, tratamiento y pronóstico |
| `Penfold 2024` | Penfold D, Leslie SW, Lotfollahzadeh S. «Nutcracker Syndrome and Left Renal Vein Entrapment». StatPearls [Internet], NCBI Bookshelf, actualizado el 7 de mayo de 2024. [NBK559189](https://www.ncbi.nlm.nih.gov/books/NBK559189/) | Capítulo completo | Cascanueces: mecanismo, frecuencia de cada síntoma, diagnóstico, complicaciones y tratamiento |
| `Mačionienė 2026` | Mačionienė E, Kerpauskienė A, Žakauskienė U, Vitkauskaitė M, Girčius R, Miglinas M. Nutcracker syndrome in 2026: a nephrologist-oriented diagnosis and management. *Clin Kidney J* 2026;19(5):sfag124. [doi:10.1093/ckj/sfag124](https://doi.org/10.1093/ckj/sfag124) | PMC13156603 (sin el contenido de su tabla 1 ni de las figuras) | Cascanueces: el dolor según la postura, el fenómeno en la imagen frente al síndrome, consenso Delphi 2025 |

Salvedades de lectura:
- **Bruessel 2026** se presenta como revisión sistemática PRISMA (62 estudios), pero:
  - casi todo son casos y series pequeñas, y no evalúa el riesgo de sesgo;
  - solo 6 estudios tratan estas compresiones en el Ehlers-Danlos o la hipermovilidad;
  - los autores son cirujanos vasculares y una reumatóloga, y proponen una guía de pruebas invasivas; declaran no tener conflictos de interés.
  - Las tablas 1 (clínica, pp. 5–6) y 2 (imagen, pp. 7–8) se comprobaron en el PDF: coinciden con lo que dice este documento.
  - Para el MALS da 40–60 años (tabla 1, p. 5); Saleem 2023 da 30–50. La app no cita edad.
  - Varias afirmaciones de la asociación se apoyan en la web de una clínica del Ehlers-Danlos (su ref. 8), no en un estudio.
- **Saleem 2023**: el capítulo de StatPearls se titula «Celiac Artery Compression Syndrome»; no hay ninguno titulado MALS.
  - Se contradice en el alivio tras la cirugía (60–70 % en «Prognosis», 75 % en el apartado del equipo) y en que la cirugía sea el único tratamiento.
  - Una errata llama «invasivas» a las pruebas no invasivas.
- **Penfold 2024** se contradice sobre la prueba de referencia: la angio-TC en «Pearls», el gradiente de presión por venografía en «Evaluation».
  - Dice que el dolor es «necesariamente izquierdo»; Mačionienė 2026 dice que puede ser derecho por las colaterales.
- **Mačionienė 2026** da dos rangos normales del ángulo aorta-mesentérica (38–65° y 45–90°).
  - Con Penfold 2024 no coinciden en el sexo (igual frente a más mujeres), en el umbral del gradiente (≥ 3 frente a ≥ 1–2 mmHg) ni en el stent (favorable frente a la cirugía abierta que prefiere el Delphi 2025).
- **Ninguna de las cuatro habla de fisioterapia ni de ejercicio terapéutico.**

## Lo que dicen las fuentes leídas

### MALS (Saleem 2023; Bruessel 2026, tabla 1)

- **Qué es**: el ligamento arcuato medio (la banda fibrosa que une los pilares del diafragma, a la altura de T12–L1) comprime el tronco celíaco. La compresión aumenta **en espiración**, cuando el diafragma sube (Saleem 2023, «Pathophysiology»).
  - El mecanismo del dolor no está claro: la isquemia sola no lo explica (suele haber colaterales), y se propone una irritación del plexo celíaco.
- **Clínica**: dolor **epigástrico**, típicamente **después de comer**, con náuseas, vómitos, diarrea y **pérdida de peso**. Suelen llegar tras tomar sin alivio inhibidores de la bomba de protones. A veces hay un soplo epigástrico.
  - Bruessel 2026 (tabla 1) añade el dolor **con el ejercicio** y el **alivio al inclinarse hacia delante**, y un soplo en el ~35 %.
  - **Saleem 2023 no menciona dolor de espalda, lumbar ni postural.**
- **A quién**: incidencia de 2/100 000; mujeres de 30–50 años (4:1). Pero la compresión se ve en la imagen en el **10–24 %** de algunas poblaciones, y solo una parte pequeña tiene síntomas (Saleem 2023, «Epidemiology»).
- **Diagnóstico**: de exclusión (endoscopia, ecografía, analítica…) más imagen: Doppler en espiración, angio-TC, y bloqueo del plexo celíaco como prueba de respuesta.
- **Tratamiento**: «no known medical treatment». Sección quirúrgica del ligamento, a menudo con neurólisis del plexo celíaco. Alivio en el 60–70 %. Predicen buena respuesta el **dolor tras el esfuerzo** y la respuesta al bloqueo previo.

### Cascanueces (Penfold 2024; Mačionienė 2026)

- **Qué es**: la vena renal izquierda queda comprimida entre la aorta y la arteria mesentérica superior (anterior, ~85–90 %) o, más raro, entre la aorta y la vértebra (posterior). La presión venosa sube y se abren colaterales (gonadales, lumbares, pélvicas).
  - «Fenómeno» es la compresión sin síntomas, una variante normal. «Síndrome» es cuando da síntomas.
- **Por qué importa la postura**: al ponerse de pie el intestino tira hacia abajo y cierra el ángulo, y aparecen o empeoran el **dolor en el flanco** y la proteinuria; **mejoran tumbado** (Mačionienė 2026, «Clinical presentation»).
  - Predisponen la **delgadez**, la pérdida de peso rápida, la **hiperlordosis lumbar intensa**, la ptosis renal, el estirón de la adolescencia y el embarazo (Penfold 2024, «Etiology»; Mačionienė 2026).
- **Clínica** (serie de 112 pacientes en Penfold 2024): hematuria 79 % (casi siempre microscópica), **dolor en el flanco izquierdo 38 %**, varicocele 36 %, proteinuria 31 %, anemia 13 %.
  - Mujeres: dolor pélvico que **empeora de pie**, dispareunia, dismenorrea, varices vulvares (congestión pélvica).
  - El dolor del flanco es sordo o continuo y puede ser la queja principal (Mačionienė 2026). Puede irradiar al abdomen, la cara interna del muslo o la ingle (Penfold 2024).
- **A quién**: personas jóvenes, altas y delgadas (picos en la 2.ª–3.ª década y en la edad media).
  - En 324 donantes sanos, el 30,5 % tenía un ángulo aorta-mesentérica bajo, pero **solo el 0,7 %** cumplía el criterio de compresión hemodinámica (Mačionienė 2026, «Epidemiology»). La prevalencia real se desconoce.
- **Diagnóstico**: clínica de más de 6 meses, exclusión de otras causas de hematuria y de dolor en el flanco (litiasis, tumor, nefropatías), y luego imagen. No hay patrón oro ni criterios validados (Delphi 2025, en Mačionienė 2026).
- **Complicaciones**: hematuria macroscópica que puede necesitar transfusión, anemia, trombosis de la vena renal, deterioro renal (raro) e infertilidad.
- **Tratamiento**: conservador primero (6 meses en el adulto con síntomas leves, 24 en menores de 18, según la guía ESVS que cita Penfold 2024). **Ganar peso** resuelve hasta el 30 % en pacientes delgados. Las medias de compresión pueden aliviar el dolor pélvico. Si fracasa: cirugía o stent.

### Relación con el Ehlers-Danlos y la hipermovilidad (Bruessel 2026)

- Los propios autores escriben que la asociación **«no está establecida formalmente»** y que **«falta evidencia científica sólida»** (introducción).
- Ningún estudio da la prevalencia de estas compresiones en el Ehlers-Danlos o la hipermovilidad («Results»).
- Su conclusión es una inferencia desde el mecanismo (el colágeno vascular), no una medida: «probablemente más alta que en la población general».
- Todas las cifras vienen de series ya seleccionadas y sin grupo control. Muchas van en sentido contrario (pacientes con POTS, MALS o congestión pélvica, no con Ehlers-Danlos).
  - En una serie quirúrgica de 169 pacientes con SEDh o TEH, el 72,8 % tenía más de una compresión.
  - En 12 pacientes con MALS, el 42 % tenía SEDh.
- Bruessel 2026 añade que estas compresiones pueden empeorar la intolerancia ortostática después de comer: se solapan con el POTS.
- **Saleem 2023, Penfold 2024 y Mačionienė 2026 no mencionan el Ehlers-Danlos ni la hipermovilidad.**

Es la misma situación que el Tarlov con el Ehlers-Danlos (decisión 4 de `docs/tarlov.md`): asociación descrita y plausible, sin medir.

## Qué ya cubre la app

En lumbar, fase 2:
- `l4` (cambios en el color de la orina o fiebre con el dolor de espalda) recoge la **hematuria visible**. Pero en el cascanueces suele ser microscópica, y el fisio no la ve.
- `l_u4` (dolor en el costado a oleadas hacia la ingle, con náuseas) es el cólico renal, el diferencial principal del dolor en el flanco del cascanueces.
- La bandera «Pérdida de peso inexplicada o saciedad precoz» (`l_gi`, enlazada a `br1` de la fase 1) recoge la pérdida de peso del MALS, aunque su razonamiento habla del cáncer.
- `l1` (el dolor cambia al evacuar o expulsar gases) es la pregunta visceral digestiva general.

En cervical, `cv_gi1` (el dolor de espalda empeora o mejora al comer) es lo más parecido al dolor posprandial, pero en otra región. **No hay región torácica**, que sería la natural para el MALS.

Con la tarjeta «Hipermovilidad» marcada, el recuadro de la fase 5 ya dice «Si hay disautonomía o síntomas digestivos o urinarios importantes, derivar al especialista» (Engelbert 2017, p. 165).

## Propuesta (los textos finales están en `data/lumbar.js`)

### MALS: solo texto, sin pregunta nueva (aceptada)

- Ninguna de las fuentes describe el MALS como dolor de espalda, y su incidencia es de 2/100 000. Una pregunta propia en lumbar tendría muy poco rendimiento.
- Propuesta: un párrafo «Con qué se confunde» en el `detalle` de la bandera de pérdida de peso de `l_gi`.
  - Contenido: dolor epigástrico después de comer, o con el esfuerzo, con pérdida de peso y sin respuesta a los antiácidos, en una mujer joven. Diagnóstico de exclusión que hace el médico. La compresión es frecuente en la imagen sin síntomas (Saleem 2023; Bruessel 2026).
- Lo que haga falta lo hace la derivación que ya pide esa bandera; no hace falta otra.

### Cascanueces: pregunta nueva en lumbar, con derivación preferente (aceptada)

Su dolor sí puede parecer musculoesquelético (flanco o lumbar, sordo, mejor tumbado), pero el alivio en decúbito no lo distingue de una lumbalgia mecánica. Lo que lo separa es lo que lo acompaña. Borrador:

- **Dónde**: `l_urogenital`, después de `l_u4` (su diferencial). Id propuesto: `l_u6`.
- **Texto** (borrador): «¿Tiene desde hace meses un dolor sordo en el costado o la zona lumbar izquierda que empeora de pie y mejora tumbado, y además le han visto sangre en la orina (aunque sea en un análisis), tiene varices en el escroto izquierdo o (mujeres) un dolor de pelvis que empeora de pie?»
  - Exige los dos componentes (el dolor postural **y** uno de los acompañantes), porque el dolor postural solo no distingue nada.
- **Campos**: `alerta: true`, sin `urgencia`, con `derivacion` (el campo que se añadió con el Tarlov).
- **`derivacion`** (borrador): «Dolor en el flanco postural con hematuria, varicocele o congestión pélvica (posible síndrome del cascanueces): derivación médica preferente, no urgente, para descartar otras causas y valorar un Doppler renal.»
  - Sin nombrar especialista ni técnica, como en el Tarlov: las fuentes no se ponen de acuerdo en cuál.
- **Por qué** (borrador): la vena renal izquierda pasa entre la aorta y la mesentérica superior. En personas delgadas el ángulo se cierra, y de pie más; la presión venosa sube y se abren colaterales en la pelvis, el escroto y la vejiga. Por eso duele de pie y mejora tumbado, y por eso se acompaña de sangre en la orina o de varices (Penfold 2024; Mačionienė 2026).
- **Cuánto pesa** (borrador): sin datos de exactitud; ningún estudio mide la pregunta.
  - La compresión en la imagen es frecuente (un ángulo bajo en el 30 % de donantes sanos) y el síndrome, raro (0,7 % con criterio hemodinámico; Mačionienė 2026).
  - Un SÍ pide una valoración médica preferente, no urgente.
  - **Sangre visible en la orina con anemia o mareo, o mucha cantidad, es otra cosa**: ya la recoge `l4`.
- **En detalle** (borrador): fenómeno frente a síndrome; frecuencia de cada síntoma (Penfold 2024); diferenciales (litiasis, tumor, nefropatía IgA); tratamiento conservador primero, incluida la ganancia de peso; la asociación descrita con el Ehlers-Danlos sin cifras (Bruessel 2026).

### Relación con la hipermovilidad: ninguna regla automática (aceptada)

- La tarjeta «Hipermovilidad» no activa ni da peso a estas preguntas, como en el Tarlov y el POTS.
- Solo una frase sin cifras en el «En detalle» de cada una: se han descrito con más frecuencia en el Ehlers-Danlos y la hipermovilidad, pero la asociación no está medida (Bruessel 2026).

### Lo que no se toca

- Árbol CIF, hipótesis y tests de la fase 4b, fase 6, calculadora.
- Cadera: el dolor pélvico de la congestión pélvica ya lo cubre en parte `ca_u4`. Se deja para después de lumbar.

## Decisiones (aceptadas por el usuario, octubre 2026)

1. **MALS**: solo un párrafo «Con qué se confunde» en la bandera de pérdida de peso de `l_gi`; sin pregunta propia.
2. **Cascanueces**: pregunta nueva `l_u6` con `derivacion` preferente, no urgente.
3. **`l_u6` exige los dos componentes**: el dolor postural **y** un acompañante (sangre en la orina, varicocele izquierdo o dolor pélvico que empeora de pie).
4. **Hipermovilidad**: ninguna regla automática; solo una frase sin cifras en el razonamiento de cada una.
5. **Cadera** (congestión pélvica): para otra sesión.
6. **Bruessel 2026**: el usuario aportó el PDF; las tablas se comprobaron en él.
7. **SIBO**: fuera.

## Implementación (octubre 2026)

- **`data/lumbar.js`**
  - **`l_u6`**, en `l_urogenital` justo después de `l_u4` (cólico renal, su diferencial): `alerta: true`, `anatomia: ['rinon']` (Kenhub no tiene un artículo propio de la vena renal comprobado; se enlaza el riñón, ya en el registro), `derivacion`, sin `urgencia`.
  - Su `razonamiento` completo: «¿Por qué?» (`porque`, `peso`), «Ampliar →» con un `detalle` de seis párrafos (fenómeno y síndrome, cómo se presenta, con qué se confunde, complicaciones, tratamiento, tejido conectivo), «Fisiología, paso a paso» con 5 pasos y una metáfora, y 3 fuentes con cita y enlace (Penfold 2024, Mačionienė 2026, Bruessel 2026).
  - **Bandera «Pérdida de peso inexplicada o saciedad precoz»** (`l_gi`): un párrafo «Con qué se confunde (raro)» al final de su `detalle` sobre el MALS, más dos fuentes (Saleem 2023, Bruessel 2026). Dice que ninguna de las dos fuentes lo describe como dolor de espalda y que la conducta con la bandera no cambia: derivar.
- **`data/referencias.js`**: las 4 referencias; `docs/referencias.md` regenerado.
- Nada nuevo en `app.js`: la derivación de `l_u6` usa el campo `derivacion` del Tarlov (mensaje 🩺 con SÍ, aviso «Derivación médica», fase 5, `📋 Notas`, `📄 Informe`, payload `dv[]`). physiq-report no necesita cambios: pinta `dv` con un texto genérico. La fase 6 no se bloquea, igual que con el Tarlov.
- **Pruebas**: `tests/unit/cribado.mjs` (la lista de preguntas con `derivacion` incluye `l_u6`; `l_u6` tras `l_u4`, en `dv` y no en `ur`; el MALS sin pregunta propia y ninguna de las dos ligada a la hipermovilidad), `tests/unit/anatomia.mjs` (26 preguntas lumbares con anatomía) y la sección `cascanueces` de `tests/smoke.mjs`.
