# Síndrome de May-Thurner (compresión de la vena ilíaca común izquierda) — borrador de diseño

Estado: **borrador, sin implementar (octubre 2026).** Pendiente de que el usuario acepte las decisiones (al final) y aporte en PDF las fuentes que no se han podido abrir desde la sesión («Fuentes pendientes»). Seguimiento en `MIGRATION_PLAN.md`, Fase P («Después del piloto»).

Origen: la congestión pélvica (`docs/congestion-pelvica.md`) y el cascanueces (`docs/mals-cascanueces.md`) ya nombran el May-Thurner como compresión venosa que puede causarlos o acompañarlos, sin pregunta ni razonamiento propios.

Es un **síndrome de compresión venosa**: la arteria ilíaca común derecha cruza por delante de la vena ilíaca común izquierda y la aplasta contra la quinta vértebra lumbar. También se llama síndrome de Cockett, síndrome de compresión de la vena ilíaca o, cuando no hay trombo, lesión venosa ilíaca no trombótica (NIVL en inglés). La compresión sin síntomas es frecuente; el «síndrome» es cuando da síntomas. Tiene dos formas muy distintas:
- **trombótica**: una trombosis venosa profunda (TVP) ilio-femoral izquierda, con la pierna entera hinchada; es una urgencia y la app ya la pregunta como TVP;
- **no trombótica**: hinchazón crónica, pesadez y dolor de la pierna izquierda que empeoran al caminar o de pie (claudicación venosa), varices, y a veces dolor pélvico (congestión pélvica secundaria) o lumbar.

Lo que interesa a PhysiQ, como con el Tarlov, el cascanueces y la congestión pélvica, es si **puede parecer un dolor musculoesquelético** y qué hacer si se sospecha.

## Fuentes leídas

Leídas enteras en esta sesión (PubMed Central):

| Clave propuesta | Referencia | Cómo se leyó | Qué aporta |
|---|---|---|---|
| `Bruessel 2026` (ya en el registro) | Bruessel P, Govender M, Frahm-Jensen G. The investigation and management of the abdominopelvic vascular compression syndromes in patients with Ehlers–Danlos syndrome and hypermobility spectrum disorder. *Vasc Health Risk Manag* 2026;22:592420. [doi:10.2147/VHRM.S592420](https://doi.org/10.2147/VHRM.S592420) | Releído entero en PMC13037643 (el PDF del usuario se leyó en la sesión del MALS) | Tabla 1 (factores de riesgo y clínica del May-Thurner), imagen (tabla 2), manejo, la asociación con el Ehlers-Danlos, la hipermovilidad y el POTS |
| `Villalba 2024` | Villalba LM, Bayat I, Dubenec S, Puckridge P, Thomas S, Varcoe R, Vasudevan T, Tripathi R. Review of the literature supporting international clinical practice guidelines on iliac venous stenting and their applicability to Australia and New Zealand practice. *J Vasc Surg Venous Lymphat Disord* 2024;12(5):101843. [doi:10.1016/j.jvsv.2024.101843](https://doi.org/10.1016/j.jvsv.2024.101843) | PMC11523375 | Resume las recomendaciones de las guías (ESVS 2022, SVS/AVF 2020, AVLS 2015…): a quién se trata, que **a quien no tiene síntomas no se le pone stent**, la claudicación venosa como indicación, y que la evidencia es débil |
| `Dunlap 2023` | Dunlap E, Fitzpatrick S, Nagarsheth K. Back pain and right leg swelling: unusual presentations of May-Thurner syndrome. *Cureus* 2023;15(3):e35984. [doi:10.7759/cureus.35984](https://doi.org/10.7759/cureus.35984) | PMC10083046 | Tres mujeres con dolor lumbar y del flanco **derechos** con una compresión izquierda |
| `Lim 2024` | Lim C, Roh YH, Kim DW, Nam KW. Is the May-Thurner syndrome a major risk factor for deep vein thrombosis in total hip arthroplasty? *Clin Orthop Surg* 2024;16(1):34–40. [doi:10.4055/cios23128](https://doi.org/10.4055/cios23128) | PMC10825252 | TVP tras prótesis de cadera: 4 de 5 tenían May-Thurner, todas en la **pierna izquierda**, también tras operar la cadera derecha, a los 24–54 días |
| `Khan 2026b` (clave por decidir: `Khan 2026` ya es otra referencia) | Khan ARS, Gupta Y, Samuel B, et al. May–Thurner syndrome: an under-recognized etiology of deep vein thrombosis (DVT). *Health Sci Rep* 2026;9(3):e72189. [doi:10.1002/hsr2.72189](https://doi.org/10.1002/hsr2.72189) | PMC13097371 | Revisión narrativa de internistas, sin conflictos: clínica (claudicación venosa que alivia con reposo y la pierna en alto), diagnóstico, complicaciones |

Ya leídas enteras en sesiones anteriores, solo por lo que dicen del May-Thurner (releídas en PMC en esta sesión las dos primeras):
- **Bałabuszek 2022** (PMC8725876): el May-Thurner puede causar una congestión pélvica secundaria; el grado de compresión en la RM no se relaciona con los síntomas y la compresión es frecuente con y sin síntomas (Costa 2020 y Aurshina, citados); poner un stent en la ilíaca sin embolizar las venas gonadales alivia la congestión pélvica del May-Thurner en el 16,6 % en un estudio, y otro da una resolución completa en el 56 %.
- **Dos Santos 2016** (PMC5153020): el May-Thurner y el cascanueces pueden dar congestión y reflujo por debajo de la compresión, y hay que descartarlos antes de embolizar.
- **Champaneria 2016** (PDF del usuario, sesión de la congestión pélvica): lo recoge como posible causa de la congestión pélvica (así lo cita el `detalle` de `ca_u6`).

Salvedades de lectura:
- **Casi todas las fuentes las firman quienes ponen stents**, como en la congestión pélvica:
  - Villalba 2024 son cirujanos vasculares que ponen stents venosos; declaran «Disclosures: None». Su propia conclusión dice que el interés «de los médicos y de la industria» ha crecido mucho, y la tabla III lista las fechas de aprobación de cada stent comercial. Entre sus revisores están Frahm-Jensen (autor de Bruessel 2026) y Larkin (autora de Larkin 2026, «Fuentes pendientes»).
  - Dunlap 2023: cirujanos vasculares que pusieron el stent (marca y medida en la tabla); declaran no tener conflictos.
  - Bruessel 2026: cirujanos vasculares y una reumatóloga; declaran no tener conflictos.
  - Lim 2024 son traumatólogos, sin conflictos; sus pacientes se trataron con trombectomía y angioplastia.
  - Khan 2026b son internistas, sin conflictos ni financiación. Es la única que no firma quien interviene, pero es una revisión floja: llama «arterias» a las venas con stent, y dice que la ecografía Doppler es la prueba de referencia de la TVP proximal y en otro párrafo que solo ve la ilíaca común en el 47 %.
  - Por eso **PhysiQ no nombraría ningún tratamiento** (como en el Tarlov, decisión 3, y la congestión pélvica, decisión 4).
- **Villalba 2024 reconoce que la evidencia es débil** («the current level of evidence is considered weak»), a pesar de las recomendaciones fuertes de varias sociedades: solo cita un ensayo aleatorizado publicado (Rossi 2017) de stent frente a tratamiento médico. Recoge que la ESVS 2022 da una recomendación IIa B al stent en la obstrucción sintomática grave y la claudicación venosa, y **ninguna** al dolor pélvico.
- **Dunlap 2023** son 3 casos de un año, retrospectivos, sin grupo control, y no explican por qué una compresión izquierda daría dolor derecho. Su resumen dice que las tres tenían dolor lumbar y del flanco derechos; su tabla 1 no lo pone en la primera (dolor e hinchazón de las dos piernas).
- **Lim 2024** son 5 TVP en 492 prótesis (4 con May-Thurner), retrospectivo y sin TC de los que no tuvieron TVP: no puede decir cuánto aumenta el riesgo. Sus autores proponen buscar la compresión antes de operar, sin datos que lo apoyen.
- **Bruessel 2026** da como factores de riesgo del May-Thurner la escoliosis, la degeneración lumbar, la protrusión discal, la espondilolistesis y los osteofitos (tabla 1, todos con la misma referencia, su ref. 11). No hay cifras. Se citaría como descripción, no como dato.
- **Khan 2026b** da 20–30 años; Bruessel 2026, 20–40; Dunlap 2023, citando a «Khan et al.» (otro artículo), 20–50.
- **La forma trombótica tiene más literatura que la no trombótica**, y casi toda la de la no trombótica viene de series de stents.

### Contradicciones entre las fuentes

- **Cuántas TVP explica**: el 2–3 % de todas las TVP de la pierna, y solo 1–3 de cada 1000 personas con la compresión hacen una TVP (Lim 2024, citando a otros); el 31 % de las TVP ilio-femorales (Dunlap 2023, citando un estudio). No se contradicen (unas son todas las TVP, otras solo las ilio-femorales), pero dicen cosas muy distintas si se cita una sola.
- **Compresión sin síntomas**: el 22 % de 430 cadáveres en el estudio original de May y Thurner (Lim 2024); en personas sin síntomas, dos tercios con más del 25 % de compresión y casi una cuarta parte con más del 50 % (Kibbe 2004, citado en Dunlap 2023; sin leer, «Fuentes pendientes»). Bałabuszek 2022: el grado de compresión en la RM no se relaciona con los síntomas.
- **Qué compresión cuenta**: las guías piden más del 50 % medido por ecografía intravascular para tratar (Villalba 2024); la RM no lo relaciona con los síntomas (Bałabuszek 2022). La prueba de referencia es la flebografía con presiones (Bruessel 2026) o la ecografía intravascular (Dunlap 2023; Villalba 2024).
- **El lado**: casi siempre la pierna izquierda (todas); compresiones derechas por variantes anatómicas (Khan 2026b; Dunlap 2023) y síntomas derechos con compresión izquierda (Dunlap 2023, 3 casos).
- **El stent y el dolor pélvico**: alivio en el 16,6 % frente a resolución completa en el 56 % (los dos en Bałabuszek 2022); el resumen de Larkin 2026 da cerca del 80 % (sin leer entero).
- **La ecografía Doppler**: primera prueba (Bruessel 2026; Villalba 2024) frente a que ve la ilíaca común solo en el 47 % y depende del explorador y del peso (Khan 2026b).

## Lo que dicen las fuentes leídas

### Qué es (Bruessel 2026; Khan 2026b; Lim 2024)

- La arteria ilíaca común derecha cruza por delante de la vena ilíaca común izquierda y la aprieta contra la quinta vértebra lumbar. La vena izquierda va más horizontal que la derecha, y por eso es la que se comprime (Khan 2026b).
- El latido de la arteria lesiona la pared de la vena: se engrosa y forma bandas fibrosas dentro («espolones», descritos por May y Thurner en 1957). La vena se estrecha y el retorno de la sangre de la pierna izquierda se frena (Bruessel 2026; Khan 2026b; Lim 2024).
- Con el retorno frenado, la sangre se estanca y la pared está dañada: dos de los tres factores de la tríada de Virchow. Por eso predispone a la TVP ilio-femoral izquierda (Lim 2024).

### A quién (Bruessel 2026, tabla 1; Khan 2026b)

- Más en mujeres (2:1, Khan 2026b) y jóvenes (20–40 años en Bruessel 2026).
- Factores de riesgo (Bruessel 2026, tabla 1): ser mujer, varios partos, el posparto, los anticonceptivos orales; y la escoliosis, la degeneración lumbar, la protrusión discal, la espondilolistesis y los osteofitos (sin cifras).
- Tras una prótesis de cadera, en mayores de 65 (Lim 2024): las 4 con TVP y May-Thurner eran mujeres de 54–72 años.

### Cómo se presenta

- **La mayoría no tiene síntomas** (Khan 2026b; Bruessel 2026; Lim 2024).
- **Forma trombótica** (la más frecuente entre las que dan síntomas, Khan 2026b): hinchazón brusca de la pierna izquierda entera, con dolor; puede dar una embolia pulmonar (Khan 2026b; Bruessel 2026). Tras una prótesis de cadera: dolor e hinchazón del muslo izquierdo, de golpe y empeorando rápido (Lim 2024).
- **Forma crónica no trombótica** (Khan 2026b; Bruessel 2026, tabla 1):
  - hinchazón, dolor y pesadez de la pierna izquierda, a veces en episodios;
  - **claudicación venosa**: dolor de la pierna al caminar que se alivia con el reposo y **con la pierna en alto** (Khan 2026b);
  - varices, sobre todo las que vuelven después de tratarlas; cambios de color de la piel, úlceras; tromboflebitis superficiales de repetición;
  - congestión pélvica (Bruessel 2026; Bałabuszek 2022).
- **Como dolor lumbar** (Dunlap 2023): tres mujeres de 41–67 años con dolor lumbar y del flanco derechos y dolor o hinchazón de las piernas; una tenía un Ehlers-Danlos. Mejoraron al tratar la compresión izquierda. Es la única fuente leída que lo describe como dolor de espalda.

### Diagnóstico (Bruessel 2026; Khan 2026b; Villalba 2024)

- Lo hace el médico: Doppler venoso primero (pensado para la TVP; puede no ver bien la ilíaca), después TC o RM venosa, y la flebografía o la ecografía intravascular si se va a tratar.
- Ver la compresión en la imagen no basta: es frecuente sin síntomas, y las guías no recomiendan tratar a quien no los tiene (Villalba 2024, recomendación IIIC).

### Tratamiento (solo para el contexto; PhysiQ no lo nombraría)

- Con TVP: anticoagulación, y a menudo quitar el trombo y poner un stent (Bruessel 2026; Khan 2026b).
- Sin TVP y con síntomas importantes: stent (Villalba 2024; Bruessel 2026), con evidencia débil (Villalba 2024).
- **Ninguna fuente leída habla de fisioterapia ni de ejercicio.**

### Relación con el Ehlers-Danlos, la hipermovilidad y el POTS (Bruessel 2026)

- Sin cifra de prevalencia del May-Thurner en el Ehlers-Danlos o la hipermovilidad. La asociación «no está establecida formalmente».
- En una serie quirúrgica de 169 pacientes con Ehlers-Danlos hipermóvil o hipermovilidad, el 72,8 % tenía más de una compresión (sin desglosar el May-Thurner).
- En un estudio, el 69 % de los pacientes con POTS tenía una compresión de la ilíaca común izquierda de más del 50 %; en otro, el 77 % de 73 pacientes con POTS tenía una compresión venosa pélvica (ilíaca, renal o las dos). Bruessel 2026 no dice si había grupo control.
- Uno de los 3 casos de Dunlap 2023 tenía un Ehlers-Danlos.
- **Dunlap 2023 (salvo ese caso), Lim 2024, Khan 2026b y Villalba 2024 no mencionan el Ehlers-Danlos ni la hipermovilidad.**

Es la misma situación que el Tarlov, el MALS, el cascanueces y la congestión pélvica: asociación descrita y plausible, sin medir.

### Banderas rojas propias

- **La TVP ilio-femoral** (pierna izquierda entera hinchada, de golpe) y **la embolia pulmonar**: urgentes. Ya las preguntan las preguntas de TVP de cada región y `pq_tvp`/`pq_tep` (ver abajo).
- Ninguna fuente leída describe una urgencia propia de la forma no trombótica.

## Qué ya cubre la app

**Cadera**, fase 2:
- `ca_v2` (urgencia): «¿Nota hinchazón, enrojecimiento y calor en la **pantorrilla** o experimenta calambres nocturnos frecuentes?». Su `detalle` tiene la escala de Wells con «toda la pierna hinchada», pero **el texto de la pregunta solo nombra la pantorrilla**. Una TVP ilio-femoral se presenta con el muslo o la pierna entera hinchados (Lim 2024): el texto no la recoge. `docs/congestion-pelvica.md` (decisión 6) decía que «una pierna entera hinchada de golpe ya la recoge `ca_v2`»: solo es verdad por su `detalle`.
- `c2` (claudicación vascular arterial): el dolor que aparece tras 5–10 minutos y cede **casi de inmediato** al parar. Su `detalle` separa la claudicación arterial de la neurógena, pero **no nombra la venosa**.
- `ca_v3` (dolor isquémico en reposo que mejora con la pierna colgando): lo contrario de lo venoso, que mejora con la pierna en alto.
- `ca_u6` (congestión pélvica): su `porque` y su `detalle` ya nombran el May-Thurner como causa, dicen que predispone a la trombosis de la vena ilíaca y remiten a la pregunta de la TVP.

**Lumbar**, fase 2:
- `l_u6` (cascanueces): su `detalle` nombra el May-Thurner como compresión que puede coexistir.
- `l_vascular`: `l_v1` (claudicación que cede al pararse de pie) y `l_v3` (pie frío, pulsos débiles), los dos arteriales; su `detalle` compara la vascular con la neurógena, sin la venosa. **Lumbar no tiene pregunta de TVP propia**: solo `pq_tvp` con mecanismo posquirúrgico.

**Rodilla**: `r_v2` (urgencia) pregunta la **pantorrilla** hinchada, caliente y más roja; Wells en su `detalle`.

**Tobillo y pie**: `tp_v2` (urgencia) ya dice «la pantorrilla **o toda la pierna**», pero solo tras inmovilización, férula, encamamiento o cirugía.

**Posquirúrgico** (las 7 regiones, con mecanismo Post-quirúrgico): `pq_tvp` (urgencia) dice «una pantorrilla **o una pierna**», sin lado: ya recoge la TVP izquierda tras operar la cadera derecha de Lim 2024. Su `detalle` no la menciona.

**El May-Thurner no tiene ninguna pregunta propia** y solo aparece en el razonamiento de `ca_u6` y `l_u6`. **La claudicación venosa no aparece en ninguna región.**

## ¿Aporta algo al fisio?

Poco, y sobre todo por la forma trombótica:
- **Forma trombótica**: es la que importa, porque es urgente. Las preguntas de TVP ya existen; lo que falta es que **la de cadera y la de rodilla nombren la pierna entera, no solo la pantorrilla**, y que el razonamiento explique por qué una TVP de la pierna izquierda en una mujer joven (posparto, anticonceptivos) o tras una prótesis de cadera, incluso de la derecha, puede empezar en la ilíaca.
- **Forma no trombótica**:
  - **Sí puede parecer musculoesquelética**: dolor de la pierna al caminar (que puede tomarse por una claudicación arterial o neurógena, o por un problema de cadera o rodilla) y, en 3 casos, dolor lumbar.
  - **Lo que la distingue** no es un test, sino un patrón: la pierna (casi siempre la izquierda) **hinchada y pesada**, peor al caminar, de pie y a lo largo del día, que **mejora con la pierna en alto** y tarda en aliviarse; con varices, sobre todo si vuelven tras tratarlas. La claudicación arterial cede en 1–5 minutos solo con quedarse de pie (`c2`, `l_v1`), y la neurógena mejora al sentarse o inclinarse hacia delante. Ninguna fuente leída da la exactitud de ese patrón.
  - **Qué hacer ante la sospecha**: valoración médica preferente, no urgente. Pero **una pierna hinchada sin explicación ya pide valoración médica** por muchas otras causas (insuficiencia venosa, linfedema, una masa pélvica que comprima la vena, insuficiencia cardiaca), y el fisio no tiene que poner nombre a la causa.
  - **Riesgo de sobrediagnóstico y de tratamiento de más**: la compresión es frecuente sin síntomas, el grado de compresión no se relaciona con los síntomas, y la evidencia del tratamiento es débil y viene casi toda de quien pone stents. Una pregunta que nombre el May-Thurner puede empujar a buscar una compresión en un dolor de cadera o lumbar que tiene otra causa.

## Propuesta

### A. Texto en razonamientos existentes y la pierna entera en dos preguntas de TVP (recomendada)

1. **`ca_v2` (cadera) y `r_v2` (rodilla): que el texto nombre también la pierna entera**, como ya hacen `tp_v2` y `pq_tvp`. Borradores:
   - `ca_v2`: «¿Nota hinchazón, enrojecimiento y calor en la pantorrilla **o en toda la pierna**, o experimenta calambres nocturnos frecuentes?». Su `urgencia` diría «Si son la pantorrilla **o la pierna** hinchada, caliente o dolorosa (no los calambres solos)…».
   - `r_v2`: «¿Tiene la pantorrilla **o toda la pierna** hinchada, caliente y más rojiza que la otra (posible TVP)?».
   - Sin cambiar `urgencia`, `alerta` ni el sistema. No es una pregunta nueva ni duplica nada: cubre la TVP ilio-femoral, sea o no un May-Thurner.
2. **Un párrafo «May-Thurner» en el `detalle` de `ca_v2`** (borrador): «Si la que se hincha es toda la pierna izquierda, sobre todo el muslo, la trombosis puede empezar en la vena ilíaca: la arteria ilíaca derecha la comprime contra la columna (síndrome de May-Thurner). Es más frecuente en mujeres jóvenes, tras el parto o con anticonceptivos (Bruessel 2026; Khan 2026b). Tras una prótesis de cadera, en una serie de 5 TVP, 4 tenían esta compresión, y todas en la pierna izquierda, también tras operar la derecha (Lim 2024). La conducta es la misma: derivar hoy.» Una frase igual, más corta, en el `detalle` de `r_v2` y de `tp_v2`.
3. **Una frase en el `detalle` de `pq_tvp`**: «Tras una prótesis de cadera, la TVP puede aparecer en la pierna izquierda aunque se haya operado la derecha, por una compresión de la vena ilíaca izquierda (Lim 2024, serie pequeña).»
4. **Un párrafo «Claudicación venosa» en «Con qué se confunde» de `c2` (cadera) y de `l_v1` (lumbar)** (borrador): «La claudicación venosa también duele al caminar, pero la pierna está hinchada y pesada, el dolor tarda en ceder al parar y se alivia con el reposo y la pierna en alto, no solo quedándose de pie. Se debe a una obstrucción de las venas de la pelvis, como la compresión de la vena ilíaca izquierda (May-Thurner), a menudo tras una trombosis (Khan 2026b; Villalba 2024). Pulsos normales. No es urgente si la hinchazón no es nueva: pide una valoración médica.»
5. **`ca_u6` y `l_u6`**: sin cambios; ya lo nombran.

Fuentes nuevas para el registro (`data/referencias.js`): Villalba 2024, Lim 2024, Khan 2026b; Dunlap 2023 solo si se cita en algún párrafo (ver decisión 5); Bruessel 2026 ya está. Más las de «Fuentes pendientes» que cambien algún texto.

### B. Alternativa: pregunta nueva con `derivacion` en `ca_vascular`

- **Dónde**: `ca_vascular`, tras `ca_v3`. Id propuesto: `ca_v6`.
- **Texto** (borrador): «¿Tiene desde hace meses una pierna (casi siempre la izquierda) hinchada y pesada, que empeora al caminar o al final del día y mejora al ponerla en alto, a veces con varices que han vuelto después de tratarlas?»
- **`derivacion`** (borrador): «Hinchazón crónica de una pierna con pesadez o dolor al caminar que mejora en alto (posible obstrucción venosa, como la compresión de la vena ilíaca o síndrome de May-Thurner): derivación médica preferente, no urgente, para descartar otras causas y valorar una ecografía Doppler venosa. Si la hinchazón es nueva o brusca, es la pregunta de la trombosis.»
- **Por qué no la recomiendo**: el patrón es de una pierna hinchada, que el paciente consulta como tal, no como un dolor de cadera o lumbar, y la conducta (que lo vea un médico) no depende de sospechar el May-Thurner. Solo 3 casos lo describen como dolor de espalda, de un equipo que pone stents. Una pregunta que nombre la compresión puede llevar a buscarla en la imagen, donde es frecuente sin síntomas, en un paciente cuyo dolor tiene otra causa. Se podría reconsiderar si StatPearls, la ESVS 2022 o Larkin 2026 cambian el cuadro.

### Relación con la hipermovilidad y el POTS: ninguna regla automática (recomendada)

- Las tarjetas «Hipermovilidad» y «Disautonomía / POTS» no activarían ni darían peso a nada de esto, como en el Tarlov, el MALS, el cascanueces y la congestión pélvica.
- Si se elige la alternativa B, una frase sin cifras en su `detalle`: se ha descrito con más frecuencia en el Ehlers-Danlos, la hipermovilidad y el POTS, pero la asociación no está medida (Bruessel 2026). Con la propuesta A, ninguna frase: un párrafo de TVP no es el sitio.

### Lo que no se toca

- Árbol CIF, hipótesis y tests de la fase 4b, fase 6 (ninguna fuente da pautas de fisioterapia), calculadora, tarjeta «Síntomas».
- `ca_u6` y `l_u6`: ya lo nombran.
- Lumbar sin pregunta de TVP propia: queda fuera de esta tarea (ver decisión 7).
- Hombro, codo y cervical: no aplica (la compresión afecta a la pierna).

## Fuentes pendientes

No se han podido abrir desde la sesión. **No se cita nada de ellas hasta leerlas enteras**; lo que se ha visto es solo el resumen.

Imprescindibles (pedidas al usuario en PDF):
1. **StatPearls** — Mangla A, Hamad H. «May-Thurner Syndrome». StatPearls [Internet], NCBI Bookshelf, actualizado el 11 de marzo de 2024. [NBK554377](https://www.ncbi.nlm.nih.gov/books/NBK554377/). NCBI pide un captcha, como con el cascanueces. Fuente de contraste, como Kuo 2025 en la congestión pélvica. Su resumen dice que la compresión es tan frecuente que algunos la consideran una variante normal y que hasta dos tercios de las TVP ilio-femorales tienen espolones.
2. **ESVS 2022** — De Maeseneer MG, Kakkos SK, Aherne T, et al. European Society for Vascular Surgery (ESVS) 2022 Clinical Practice Guidelines on the Management of Chronic Venous Disease of the Lower Limbs. *Eur J Vasc Endovasc Surg* 2022;63(2):184–267. [doi:10.1016/j.ejvs.2021.12.024](https://doi.org/10.1016/j.ejvs.2021.12.024). En abierto (CC BY), pero el dominio de la revista está bloqueado desde la sesión. **Es la guía**; bastaría el capítulo de la obstrucción venosa profunda (y la definición de claudicación venosa). Villalba 2024 solo la resume.
3. **Kibbe 2004** — Kibbe MR, Ujiki M, Goodwin AL, Eskandari M, Yao J, Matsumura J. Iliac vein compression in an asymptomatic patient population. *J Vasc Surg* 2004;39(5):937–943. [doi:10.1016/j.jvs.2003.12.032](https://doi.org/10.1016/j.jvs.2003.12.032). En abierto, mismo bloqueo. Es la cifra de la compresión sin síntomas que citan todas.
4. **Larkin 2026** — Larkin TA, Neasey M, Horsley B, Keys T, Villalba LM. Differences in clinical presentation of chronic pelvic pain caused by iliac vein obstruction impacts referral pathway, time to diagnosis, and post-stenting pain resolution. *Eur J Vasc Endovasc Surg* 2026 (en prensa). [doi:10.1016/j.ejvs.2026.10.013](https://doi.org/10.1016/j.ejvs.2026.10.013). De pago. Según el resumen, 113 mujeres con dolor pélvico por obstrucción ilíaca: el ejercicio y estar de pie lo desencadenaban, más de dos tercios tenían dolor de pierna, y las que habían pasado por al menos dos especialistas tenían más dolor lumbar y tardaron 8,5 años en llegar al diagnóstico. Es la que más puede cambiar la decisión 1. Firma Villalba, que pone stents.

Opcionales:
- **Harbin MM, Lutsey PL.** May-Thurner syndrome: history of understanding and need for defining population prevalence. *J Thromb Haemost* 2020;18(3):534–542. [doi:10.1111/jth.14707](https://doi.org/10.1111/jth.14707). Epidemiólogas, sin stents de por medio; en abierto pero en un dominio bloqueado.
- **Kaltenmeier CT, et al.** Systematic review of May-Thurner syndrome with emphasis on gender differences. *J Vasc Surg Venous Lymphat Disord* 2018;6(3):399–407. [doi:10.1016/j.jvsv.2017.11.006](https://doi.org/10.1016/j.jvsv.2017.11.006). La única revisión sistemática del síndrome (174 artículos, 1569 pacientes; solo casos publicados).
- **Khawer A, et al.** Recurrent deep vein thrombosis and pulmonary embolism in a patient with May-Thurner syndrome presenting as low back pain and radiculopathy. *BMJ Case Rep* 2025;18(12):e270176. [doi:10.1136/bcr-2025-270176](https://doi.org/10.1136/bcr-2025-270176). Un caso de una consulta de dolor (rehabilitación): dolor lumbar irradiado a las dos piernas con una pierna hinchada nueva.
- **ACR Appropriateness Criteria® Nonthrombotic Iliac Vein Lesion.** *J Am Coll Radiol* 2026. [doi:10.1016/j.jacr.2026.01.021](https://doi.org/10.1016/j.jacr.2026.01.021). Criterios de imagen de radiología.

No se ha encontrado ninguna revisión sistemática independiente sobre la compresión ilíaca no trombótica como la de Champaneria 2016 para la congestión pélvica. La revisión Cochrane «Angioplasty or stenting for deep venous thrombosis» (2025, PMC11837241, solo el resumen en PMC) trata la TVP aguda, no la compresión sin trombo, y su evidencia es «muy incierta» (2 ensayos, 134 participantes): no se cita.

## Decisiones pendientes (con mi recomendación)

1. **¿Pregunta nueva o solo texto?** Recomendación: **solo texto (propuesta A)**, sin pregunta propia del May-Thurner. Lo urgente (la TVP) ya tiene pregunta; la forma crónica se presenta como una pierna hinchada, que ya pide valoración médica sin poner nombre a la causa; la compresión es frecuente sin síntomas y casi toda la literatura es de quien pone stents. La alternativa B (`ca_v6` con `derivacion` preferente) queda escrita por si las fuentes pendientes cambian el cuadro.
2. **`ca_v2` y `r_v2`: añadir «o toda la pierna» al texto** (y «o la pierna» a la `urgencia` de `ca_v2`). Recomendación: **sí**. Es el hueco real que deja ver el May-Thurner: una TVP ilio-femoral hincha el muslo o la pierna entera, y el texto de las dos preguntas solo nombra la pantorrilla. Lo hacen ya `tp_v2` y `pq_tvp`, y «toda la pierna hinchada» es un punto de Wells (NICE NG158), ya en sus `detalle`. Corrige de paso lo que decía la decisión 6 de `docs/congestion-pelvica.md`. Hay que repasar la prueba de humo y los informes reales de `tests/fixtures/informes/` por si alguno copia el texto de la pregunta (`sq` lleva el texto de las preguntas con SÍ).
3. **Párrafo «May-Thurner» en el `detalle` de `ca_v2`, y una frase en `r_v2`, `tp_v2` y `pq_tvp`** (la TVP izquierda tras operar la cadera derecha, Lim 2024). Recomendación: **sí**, sin cambiar la conducta (derivar hoy).
4. **Párrafo «Claudicación venosa» en «Con qué se confunde» de `c2` y `l_v1`.** Recomendación: **sí**, pero **solo después de leer StatPearls y la ESVS 2022**: la única definición leída es una frase de Khan 2026b, la fuente más floja.
5. **Dolor lumbar** (Dunlap 2023, 3 casos, dolor derecho con compresión izquierda): Recomendación: **no citarlo** en ningún razonamiento lumbar. Son 3 casos sin explicación del mecanismo, de quien pone el stent, con una incoherencia entre el resumen y la tabla. Se reconsidera si Larkin 2026 o Khawer 2025, leídos enteros, dan algo más sólido.
6. **Sin tratamiento ni especialista**: ninguna mención al stent, la angioplastia o la trombólisis, como en el Tarlov y la congestión pélvica. Recomendación: **sí**.
7. **Lumbar sin pregunta de TVP propia** (solo `pq_tvp` con mecanismo posquirúrgico): fuera de esta tarea. Recomendación: **revisarlo en otra sesión con sus propias fuentes** (NICE NG158); el dolor lumbar con una pierna hinchada nueva de Khawer 2025 es justo ese caso.
8. **Hipermovilidad y POTS**: ninguna regla automática con las tarjetas; con la propuesta A, ninguna frase. Recomendación: **sí**, como en el Tarlov, el MALS, el cascanueces y la congestión pélvica: Bruessel 2026 no da ninguna cifra del May-Thurner en el Ehlers-Danlos y las del POTS no dicen si había grupo control.
9. **Clave de Khan 2026 en el registro**: `Khan 2026` ya es la revisión de prótesis de disco lumbar. Recomendación: **`Khan 2026b`** (o, si se prefiere no usar letras, citarla como «Khan y Ahmad 2026», primer y último autor, que es quien firma como autor de correspondencia).
10. **No se implementa hasta leer enteras StatPearls, la ESVS 2022 y Kibbe 2004**, y Larkin 2026 si se puede (en PDF del usuario), como la decisión 7 del Tarlov y la 10 de la congestión pélvica. Recomendación: **sí**. La decisión 2 no depende de ellas y podría implementarse antes si el usuario lo prefiere.
