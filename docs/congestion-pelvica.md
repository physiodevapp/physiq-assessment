# Síndrome de congestión pélvica — diseño

Estado: **implementado (octubre 2026), pendiente de la revisión del usuario antes de `main`.** El usuario aceptó las 10 recomendaciones («Decisiones», al final) y aportó en PDF StatPearls (Kuo 2025), Hanna 2024 y el informe completo de Champaneria 2016; las 8 fuentes están leídas enteras. Lo implementado, en «Implementación», al final. Seguimiento en `MIGRATION_PLAN.md`, Fase P («Después del piloto»).

Origen: decisión 5 de `docs/mals-cascanueces.md`. El cascanueces se implementó en lumbar (`l_u6`) y su pregunta ya recoge, como acompañante, el dolor de pelvis que empeora de pie. La congestión pélvica sin cascanueces quedaba para cadera, donde `ca_u4` cubre en parte el dolor pélvico ginecológico.

Es un **trastorno venoso pélvico**: venas ováricas o ilíacas internas dilatadas, con reflujo o con una obstrucción más arriba, que dan dolor pélvico crónico. El fisio no lo diagnostica. Lo que interesa a PhysiQ, igual que con el Tarlov y el cascanueces, es si **puede presentarse como un dolor que parezca de cadera, ingle o sacroilíaca** y qué hacer si lo sospecha. Sería contenido de cadera, no una capa transversal.

## Fuentes leídas

Leídas enteras:

| Clave propuesta | Referencia | Cómo se leyó | Qué aporta |
|---|---|---|---|
| `Bruessel 2026` (ya en el registro) | Bruessel P, Govender M, Frahm-Jensen G. The investigation and management of the abdominopelvic vascular compression syndromes in patients with Ehlers–Danlos syndrome and hypermobility spectrum disorder. *Vasc Health Risk Manag* 2026;22:592420. [doi:10.2147/VHRM.S592420](https://doi.org/10.2147/VHRM.S592420) | Releído en PMC13037643 en esta sesión (el PDF del usuario se leyó en la sesión del MALS) | La congestión pélvica como consecuencia del cascanueces y del May-Thurner; las cifras de la asociación con el Ehlers-Danlos y la hipermovilidad |
| `Bałabuszek 2022` | Bałabuszek K, Toborek M, Pietura R. Comprehensive overview of the venous disorder known as pelvic congestion syndrome. *Ann Med* 2022;54(1):22–36. [doi:10.1080/07853890.2021.2014556](https://doi.org/10.1080/07853890.2021.2014556) | PMC8725876 (sin las figuras) | Revisión narrativa completa: anatomía, factores de riesgo, clínica, diagnóstico (con la tabla 1 de diferenciales, que incluye la cadera y la sacroilíaca), tratamiento |
| `Shelkey 2014` | Shelkey J, Huang C, Karpa K, Singh H, Silvis M. Case report: pelvic congestion syndrome as an unusual etiology for chronic hip pain in 2 active, middle-age women. *Sports Health* 2014;6(2):145–148. [doi:10.1177/1941738113481940](https://doi.org/10.1177/1941738113481940) | PMC3931334 | Dos corredoras con dolor de cadera crónico, exploración de cadera normal y fracaso de la fisioterapia |
| `Dos Santos 2016` | Dos Santos SJ, Whiteley MS. Pelvic congestion syndrome masquerading as osteoarthritis of the hip. *SAGE Open Med Case Rep* 2016;4:2050313X16683630. [doi:10.1177/2050313X16683630](https://doi.org/10.1177/2050313X16683630) | PMC5153020 | Dos mujeres diagnosticadas de artrosis de cadera con radiografía casi normal; el dolor desapareció al tratar el reflujo pélvico |
| `Kuo 2025` | Kuo CH, Martingano DJ, Singh P. «Pelvic Congestion Syndrome». StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025. [NBK560790](https://www.ncbi.nlm.nih.gov/books/NBK560790/) | PDF del usuario (9 pp.) | Fuente de contraste: clínica, exploración, diagnóstico, manejo conservador (con fisioterapia del suelo pélvico), tratamiento invasivo, diferenciales |
| `Hanna 2024` | Hanna J, Bruinsma J, Barns M, Hanna M, Boulos B, Ponosh S. Pelvic congestion syndrome: not all pelvic pain is gynaecological. *Aust J Gen Pract* 2024;53(12 Suppl):S41–S44. [doi:10.31128/AJGP-07-23-6889](https://doi.org/10.31128/AJGP-07-23-6889) | PDF del usuario (4 pp.) | Para atención primaria: la cifra del 30–40 % que cita Bruessel 2026, la clínica, y que el Doppler de las venas pélvicas hay que pedirlo expresamente |
| `Champaneria 2016` | Champaneria R, Shah L, Moss J, Gupta JK, Birch J, Middleton LJ, Daniels JP. The relationship between pelvic vein incompetence and chronic pelvic pain in women: systematic reviews of diagnosis and treatment effectiveness. *Health Technol Assess* 2016;20(5):1–108. [doi:10.3310/hta20050](https://doi.org/10.3310/hta20050) | PDF del usuario en dos partes (138 pp.), los 8 capítulos; las tablas de los estudios incluidos y las estrategias de búsqueda (apéndice 1), por encima | **La única revisión sistemática independiente** (programa HTA del NIHR): definiciones, asociación con el dolor, exactitud de la imagen, embolización, encuestas. Es el contrapeso de todas las demás |
| `Peker 2020` | Peker A, Camkerten GT, Balci A, Akin IB, Altay C, Can G. Increased prevalence of pelvic venous congestion sign on sacroiliac MRI in women with clinically suspected sacroiliitis. *North Clin Istanb* 2020;7(6):551–556. [doi:10.14744/nci.2020.48030](https://doi.org/10.14744/nci.2020.48030) | PMC7754859 | 727 RM de mujeres de 18–50 años con dolor: el signo de congestión venosa en el 30 % de las RM sacroilíacas frente al 17 % de las de cadera |


Salvedades de lectura:
- **Casi todas las fuentes las firman quienes tratan la congestión pélvica con embolización**, y todas la recomiendan:
  - Bałabuszek 2022 es de un servicio de radiología intervencionista: habla de «nuestro centro» y da su preferencia por un tipo de espiral («en nuestra opinión»).
  - Dos Santos 2016 es de una unidad venosa especializada con más de 1500 embolizaciones, que considera la ecografía transvaginal la prueba de referencia «según nuestra unidad».
  - Hanna 2024 declara «Competing interests: None» y no tiene financiación, pero su autor sénior es un cirujano vascular con consulta privada propia, presenta la embolización como «gold standard» y la cifra del retraso diagnóstico (hasta 4 años) la toma del informe de una clínica privada de varices (The Whiteley Clinic, el mismo grupo que Dos Santos 2016). Según el propio artículo, un coautor es arquitecto y otro figura con títulos de economía en una facultad de medicina.
  - Kuo 2025 (StatPearls): los tres autores declaran no tener relaciones económicas relevantes. Es el único texto que no firma quien emboliza, pero su introducción también da la embolización como más eficaz que el tratamiento médico y el quirúrgico.
  - Bruessel 2026 son cirujanos vasculares y una reumatóloga, y declaran no tener conflictos.
  - En el texto de PMC que se leyó de Bałabuszek 2022, Dos Santos 2016 y Shelkey 2014 no viene la declaración de conflictos de interés: queda por comprobar en los PDF.
  - Por eso **PhysiQ no nombraría ningún tratamiento** (como en el Tarlov, decisión 3) y usaría de estas fuentes solo la clínica y el diagnóstico.
- **Champaneria 2016** (leído entero):
  - Financiado por el NIHR. Conflicto declarado: Moss, radiólogo intervencionista, es miembro del panel de procedimientos intervencionistas del programa HTA. Los demás autores son de una unidad de ensayos clínicos, un ginecólogo y la presidenta de una asociación de pacientes con dolor pélvico.
  - **No puede afirmarse que el reflujo de las venas pélvicas sea la causa del dolor pélvico crónico** en mujeres sin otra patología (cap. 4 y 8): seis estudios de casos y controles, de calidad desigual, con poblaciones y definiciones distintas y sin emparejar por partos; tres dan odds ratios de 31 a 117 y los dos más pequeños no llegan a significación.
  - **No hay ningún criterio diagnóstico común** (cap. 3): de 33 estudios, solo dos usaban el dolor tras estar mucho de pie como criterio, y los signos clínicos más citados eran las varices atípicas del muslo, la vulva o la nalga. Propone una puntuación de 20 puntos que no está validada (sus umbrales son «opinión de los autores»): el dolor tras estar mucho de pie y las varices del muslo, la nalga o la vulva valen 2 puntos cada uno, la dispareunia y la dismenorrea 1.
  - **Su consejo de buena práctica** (cap. 8, «Implications for health care»): preguntar si el dolor empeora después de estar de pie y si mejora al tumbarse, y anotar las varices de la vulva y de las piernas. No hace ninguna recomendación clínica más, porque la evidencia no da para ello.
  - Embolización (cap. 6): solo un ensayo aleatorizado, de baja validez interna, y 21 series de casos (1308 mujeres); calidad GRADE «muy baja»; mejoría importante en el 75 % (IC 95 % 64–85 %) a las 4–8 semanas en seis series; probable sesgo de publicación. Los radiólogos encuestados esperaban una mejoría importante solo en el 38 %.
  - En la encuesta a especialistas en dolor pélvico, pocos usaban la fisioterapia, «lo que no sorprende, porque para el dolor pélvico crónico en general hay poca evidencia de las intervenciones no quirúrgicas ni farmacológicas» (cap. 7).
- **Shelkey 2014 y Dos Santos 2016 son 4 casos en total**, sin grupo control. Prueban que la presentación como dolor de cadera existe, no con qué frecuencia.
- **Peker 2020** es retrospectivo y solo de imagen: no sabe qué mujeres tenían de verdad una congestión pélvica sintomática, ni en qué momento del ciclo se hizo la RM, y no tiene grupo control de mujeres sanas. Sus autores lo dicen. El signo de congestión en la RM sacroilíaca no se asociaba a tener o no una sacroileítis activa.
- **Hanna 2024** es una revisión clínica breve, sin método sistemático. Su 30–40 % (en el dolor pélvico crónico sin otra causa) se apoya en Beard 1984 y en una revisión de resultados de la embolización (Brown 2018). **No menciona la cadera, la espalda ni la sacroilíaca.**
- **Kuo 2025 (StatPearls)** tiene erratas y se contradice:
  - en «Epidemiology» dice que no se ha descrito en mujeres después de la menopausia, y en «Pathophysiology» que hay casos aislados que lo sugieren con fuerza;
  - da como «prevalencia de la congestión pélvica» el 6–27 % que Bałabuszek 2022 da para el dolor pélvico crónico, y en otro apartado un 2,1–24 % entre los 18 y los 50 años;
  - atribuye el May-Thurner a la arteria ilíaca «interna» derecha (las demás fuentes: la ilíaca común);
  - en la introducción la embolización es más eficaz que la cirugía, y en «Prognosis» cita un estudio de 277 pacientes (Gavrilov) en el que la resección de la vena gonadal alivió más que la embolización.
  - **Es la única fuente que nombra la fisioterapia**: el tratamiento médico de primera línea «a menudo se combina» con fisioterapia del suelo pélvico y terapia cognitivo-conductual, y hasta el 70 % se controla así, con pocos estudios a largo plazo (una sola referencia).
- **Penfold 2024** (el capítulo de StatPearls del cascanueces, leído entero en la sesión del MALS) no se ha podido reabrir aquí (NCBI pide un captcha). Lo que dice de la congestión pélvica se toma de `docs/mals-cascanueces.md`: dolor de pelvis que empeora de pie, dispareunia, dismenorrea y varices vulvares, y las medias de compresión como posible alivio.

### Contradicciones entre las fuentes

- **Cuántas mujeres con dolor pélvico crónico la tienen**: 10–30 % (Dos Santos 2016), «hasta el 30 %» según algunos autores (Bałabuszek 2022), «cerca del 30 %» (Kuo 2025), 30–40 % de las que no tienen otra causa (Hanna 2024, citado por Bruessel 2026). Champaneria 2016 no da una cifra y dice que la prevalencia del reflujo varía muchísimo entre estudios.
- **Venas dilatadas sin síntomas**: alrededor del 10 % de las mujeres tiene venas pélvicas dilatadas (Peker 2020; Shelkey 2014, que añade que más de la mitad acabaría con síntomas); las varices ováricas dan síntomas «solo hasta en el 59 %» (Bałabuszek 2022). La prevalencia en la población femenina general va del «hasta un 6 %» (Shelkey 2014) al 15 % entre los 18 y los 50 años (citado en Peker 2020).
- **Relación con la regla**: «típicamente no cíclico, aunque suele empeorar alrededor de la regla» (Dos Santos 2016); cíclico o no (Hanna 2024); empeora antes y durante la regla (Bałabuszek 2022; Kuo 2025); en el segundo caso de Shelkey 2014, el dolor no tenía relación con la regla.
- **Edad**: de los 20 a los 45 años, y cada vez más en jóvenes sin partos (Hanna 2024); antes de la menopausia y nunca después (Kuo 2025, «Epidemiology»), aunque el mismo capítulo admite casos aislados después; una de las pacientes de Dos Santos 2016 tenía 53 años.
- **El estudio de Beard** (dolor tras las relaciones más dolor a la palpación del punto ovárico: sensibilidad del 94 %, especificidad del 77 %): 35 pacientes en 1988 según Bałabuszek 2022, 57 mujeres según Kuo 2025; Hanna 2024 cita un trabajo de Beard de 1984. Champaneria 2016 aclara que es Beard 1988: 68 mujeres con dolor pélvico crónico y 36 controles sin dolor, de las que 35 tenían reflujo (cap. 1 y 4).
- **Partos**: casi todas las fuentes dan la multiparidad como factor de riesgo; Champaneria 2016 recoge una serie con el 63 % de nulíparas y concluye que los partos solos no pueden ser el factor determinante (cap. 1).
- **Venas dilatadas sin síntomas**, con cifras: en donantes de riñón sin dolor, reflujo de la vena ovárica izquierda en el 10, 17, 18, 38 y 47 % según el estudio; en otra serie de donantes con varices ováricas, el 41 % no tenía dolor pélvico (Champaneria 2016, cap. 4).
- **Laparoscopia**: puede no verla en el 80–90 % (Bałabuszek 2022); en el 20 % de las laparoscopias por dolor pélvico crónico se encuentra congestión (Kuo 2025).
- **Prueba de referencia**: la flebografía (Bałabuszek 2022; Hanna 2024; Kuo 2025; Champaneria 2016, como confirmación) o la ecografía transvaginal con Doppler (Dos Santos 2016, su propia unidad). El diámetro de la vena solo acierta el reflujo en el 56 % (el grupo de Dos Santos, citado en Bałabuszek 2022), y los umbrales cambian entre estudios.
- **La postura en la imagen, en sentidos opuestos**: tumbada, la RM, la TC o la ecografía pueden no ver las varices, que se llenan de pie (Shelkey 2014; Hanna 2024; Kuo 2025, que por eso da a la flebo-RM una especificidad baja); en cambio, la compresión de la vena renal (cascanueces) parece más intensa tumbada, y Bałabuszek 2022 cree que por eso se sobrediagnostica (55 % de estenosis significativa en decúbito supino frente a 10 % en decúbito lateral izquierdo). Bruessel 2026 sí da el cascanueces como causa de congestión pélvica.
- **Compresión**: Penfold 2024 dice que las medias pueden aliviar el dolor pélvico; según el estudio de Gavrilov que cita Bałabuszek 2022, unos pantalones de compresión de clase II sí lo aliviaron y las medias no.

## Lo que dicen las fuentes leídas

### Qué es (Bałabuszek 2022; Bruessel 2026; Dos Santos 2016)

- La sangre del útero y los ovarios sale por las venas ováricas y las ilíacas internas. Si sus válvulas faltan o no cierran, la sangre refluye, las venas pélvicas se dilatan y se forman varices.
  - En el 15 % de las mujeres la vena ovárica no tiene válvulas, más a menudo la izquierda; cuando las tiene, no cierran en el 40 % de la izquierda y el 35 % de la derecha (Bałabuszek 2022).
  - La izquierda es más larga y desemboca en la vena renal izquierda, y le cuesta más vaciarse de pie: por eso predomina el lado izquierdo (Bałabuszek 2022).
- También puede ser **secundaria a una obstrucción más arriba**: la compresión de la vena ilíaca común izquierda (May-Thurner) o de la vena renal izquierda (cascanueces) (Dos Santos 2016; Bałabuszek 2022; Bruessel 2026). Bruessel 2026 da un cascanueces en hasta el 18 % de las pacientes con congestión pélvica.
  - El grado de compresión de la ilíaca en la RM no se relaciona con los síntomas, y es frecuente sin síntomas (Bałabuszek 2022).
- El dolor se atribuye a la distensión de la pared venosa, a la inflamación (sustancia P, CGRP) y a que las venas dilatadas pueden comprimir nervios cercanos (Bałabuszek 2022).
- **Hormonas y embarazo**: los estrógenos dilatan las venas; en el embarazo el flujo de las venas ováricas aumenta hasta 60 veces y la dilatación puede durar meses tras el parto. Los síntomas suelen desaparecer tras la menopausia (Bałabuszek 2022; Shelkey 2014).

### A quién (Bałabuszek 2022; Shelkey 2014)

- Mujeres **antes de la menopausia, a menudo con varios partos**.
- Factores de riesgo: varios embarazos, varices en las piernas, tratamiento con estrógenos, antecedentes familiares de dolor pélvico, cirugía pélvica previa, levantar pesos o estar mucho tiempo de pie (Bałabuszek 2022).
- Suele tener un peso normal más que obesidad (Bałabuszek 2022, citando a Nanavati).

### Cómo se presenta

- **Dolor**: sordo, de peso o «que tira», uni- o bilateral, a veces pulsátil (Bałabuszek 2022; Shelkey 2014; Dos Santos 2016).
  - **Empeora al estar mucho de pie, al caminar o sentada mucho rato, con lo que aumenta la presión abdominal (levantar pesos) y a lo largo del día; mejora tumbada** (Bałabuszek 2022).
  - Dolor durante las relaciones y, sobre todo, **un dolor sordo que dura después** (Bałabuszek 2022; Shelkey 2014). En la endometriosis el dolor suele ser con la penetración profunda (Osman, citado en Bałabuszek 2022), pero falta investigación para separarlos.
  - **De forma atípica, el dolor puede estar en el abdomen, la zona lumbar, las caderas o las piernas** (Bałabuszek 2022).
- **Varices atípicas**: en la vulva (24–40 % de las pacientes), en la cara interna y posterior del muslo, en la nalga, suprapúbicas o perineales (Bałabuszek 2022). Hasta el 80 % tiene alguna insuficiencia venosa de las piernas, y las varices de las piernas operadas recidivan si no se trata el origen pélvico (Bałabuszek 2022). Pueden ser el único síntoma.
- **Otros**: vejiga irritable, urgencia, intestino irritable, hemorroides, pesadez de piernas, dolor de cabeza (Bałabuszek 2022; Dos Santos 2016; Bruessel 2026).
- Kuo 2025 añade que el dolor **puede cambiar de lado**, que empeora con los cambios de postura y con cada embarazo, y que es más intenso al final del día. Hanna 2024: varices visibles en la vulva, la vagina, la nalga, el periné o las piernas.
- **Ver varices y dolor a la vez no quiere decir que una cosa cause la otra**: las venas pélvicas dilatadas e incompetentes son frecuentes en mujeres sin síntomas (Kuo 2025, «History and Physical»; Hanna 2024, citando la revisión sistemática de Tu 2010).

### Como dolor de cadera o sacroilíaco

- **Shelkey 2014** (medicina deportiva): dos corredoras de 39 y 40 años, con 2 y 4 partos.
  - Caso 1: 15 años de dolor de cadera izquierda, más dolor lumbar y de pierna irradiado. Fisioterapia y antiinflamatorios con un alivio mínimo.
  - Caso 2: 2 años de dolor de cadera derecha hacia la ingle, sin relación con la regla. Sin alivio con fisioterapia, infiltración de puntos gatillo ni infiltración de la bursa trocantérea.
  - **En las dos, la exploración de la cadera era normal**: movilidad completa, pruebas de choque femoroacetabular, rodamiento y FABER negativos; en la segunda el dolor no se reproducía. Sin varices en las piernas.
  - El diagnóstico llegó por la RM (venas parauterinas dilatadas). Mejoraron a los 6–8 meses de embolizar la vena ovárica izquierda y volvieron a correr.
- **Dos Santos 2016**: dos mujeres de 53 y 40 años, con 2 y 3 partos, diagnosticadas de artrosis de cadera izquierda con cambios mínimos en la radiografía. Tenían además sensación de que la pelvis tiraba, peor con la regla, vejiga e intestino irritables, y varices en las piernas. El dolor de cadera desapareció casi enseguida al tratar el reflujo.
  - Sus autores concluyen que se piense en ella ante un dolor de cadera con una radiografía casi normal, **sobre todo si hay otros síntomas de congestión pélvica**.
- **Peker 2020**: el signo de congestión venosa estaba en el 30 % de las RM sacroilíacas pedidas por sospecha de sacroileítis (desde reumatología, rehabilitación y traumatología) frente al 17 % de las RM de cadera (p < 0,001), y solo el 11,5 % de las sacroilíacas tenía una sacroileítis activa. Los autores sugieren que la congestión pélvica pueda simular una sacroileítis; el estudio no puede demostrarlo.
- **Hanna 2024 y Kuo 2025 no hablan de la cadera.** Entre los diferenciales musculoesqueléticos dan el dolor miofascial de la pared abdominal, la mialgia del suelo pélvico, la fibromialgia y la coccigodinia.
- **Bałabuszek 2022, tabla 1**: entre los cuadros que se parecen a la congestión pélvica están la patología de la cadera, la sacroilíaca, el piriforme, la inflamación del psoas, la miofascial, la mialgia del suelo pélvico, la hernia discal y las neuralgias ilioinguinal, genitofemoral y pudenda. Es decir: **lo que el fisio trata es su diferencial**.

### Diagnóstico (Bałabuszek 2022; Hanna 2024; Kuo 2025; Champaneria 2016)

- **El Doppler de las venas ováricas y pélvicas no forma parte de una ecografía pélvica normal: quien sospecha la congestión tiene que pedirlo expresamente** (Hanna 2024). Por eso la derivación lo nombra.

- No hay criterios diagnósticos aceptados por todos (Champaneria 2016). Ver las venas dilatadas en la imagen apoya el diagnóstico, pero no lo hace (Bałabuszek 2022).
- Primero la ecografía (transvaginal o abdominal, con Doppler y con Valsalva); después la RM o la TC; la flebografía, invasiva, solo si se va a tratar.
- La laparoscopia diagnóstica puede no verla en el 80–90 % (posición de Trendelenburg y presión del gas).
- La sensibilidad al presionar el punto ovárico más el dolor tras las relaciones daban una sensibilidad del 94 % y una especificidad del 77 % en un estudio de 1988 con 35 pacientes (Beard, citado en Bałabuszek 2022 y Shelkey 2014); un estudio posterior dio a la sensibilidad del punto ovárico un 87 % de sensibilidad y solo un 37 % de especificidad. Es exploración ginecológica, no del fisio.

### Tratamiento (solo para el contexto; PhysiQ no lo nombraría)

- Médico (hormonal, venotónicos, antiinflamatorios), compresión, embolización de las venas, stent si hay una obstrucción (Bałabuszek 2022). La embolización alivia a cerca del 75 % al principio, pero los estudios son series de casos (Champaneria 2016, resumen).
- **Solo Kuo 2025 nombra la fisioterapia**: la del suelo pélvico, junto con el tratamiento médico y la terapia cognitivo-conductual, como manejo conservador de primera línea, sin estudios de su eficacia propia. Ninguna fuente habla de ejercicio. En Shelkey 2014, la fisioterapia había fracasado antes del diagnóstico, y en el segundo caso se retomó después de la embolización.

### Relación con el Ehlers-Danlos y la hipermovilidad (Bruessel 2026)

- Sin cifra de prevalencia de la congestión pélvica en el Ehlers-Danlos o la hipermovilidad. Bruessel 2026 dice que la asociación no está establecida formalmente.
- En una serie de pacientes con congestión pélvica, el 18 % tenía «piel laxa o articulaciones laxas», el 6 % un Ehlers-Danlos y el 9 % un POTS, **sin grupo control**.
- Un estudio retrospectivo sin cegar de 52 mujeres con Ehlers-Danlos o hipermovilidad tratadas de la insuficiencia venosa pélvica (Smith, citado en Bruessel 2026).
- El remanso venoso del POTS podría causar o empeorar la congestión pélvica, pero no se sabe en qué proporción.
- **Bałabuszek 2022, Shelkey 2014, Dos Santos 2016 y Peker 2020 no mencionan el Ehlers-Danlos ni la hipermovilidad.**

Es la misma situación que el Tarlov, el MALS y el cascanueces: asociación descrita y plausible, sin medir.

### Banderas rojas propias

**Ninguna de las fuentes leídas describe una complicación urgente de la congestión pélvica en sí.** Lo urgente sería lo que puede acompañarla:
- el May-Thurner predispone a la trombosis venosa profunda ilíaca o ilio-femoral (Bruessel 2026): una pierna entera hinchada de golpe ya la recoge `ca_v2` (TVP, urgencia; su `detalle` incluye «toda la pierna hinchada» de la escala de Wells);
- el embarazo ectópico, si el dolor pélvico es nuevo y hay un retraso de la regla: `ca_u5` (urgencia).

## Qué ya cubre la app

En **cadera**, fase 2, `ca_urogenital`:
- **`ca_u4`** («(Mujeres) ¿El dolor de ingle o pelvis se relaciona con la regla, con las relaciones sexuales, o tiene flujo o sangrado inusual?», `alerta`, sin `urgencia` ni `derivacion`).
  - Recoge parte del patrón: el dolor ligado a la regla o a las relaciones.
  - **No recoge** el dolor que no sigue el ciclo pero empeora de pie y mejora tumbada (el segundo caso de Shelkey 2014), ni las varices atípicas.
  - Su `detalle` ya tiene un párrafo «Banderas del dolor pélvico (Goodman)»: difuso, que empeora al aumentar la presión abdominal (estar de pie, caminar, toser, las relaciones) y al final del día, y mejora al tumbarse. **Es el patrón de la congestión pélvica, sin nombrarla.** Sus fuentes son Goodman 2018, Consoli y Carlson 2026 (endometriosis) y Jenkins y Vadakekut 2025 (enfermedad inflamatoria pélvica).
  - Su razonamiento termina con «derivar», pero sin el campo `derivacion`: un SÍ no llega a `dv[]` ni a «🩺 DERIVACIÓN MÉDICA».
- **`ca_u5`**: el embarazo ectópico, con urgencia.
- La bandera «Denominador común: dolor atípico, sin relación clara con la carga, nocturno o con síntomas no musculoesqueléticos» (razonamiento propio, Goodman 2018) ya pide pensar en lo visceral ante un dolor que no se comporta como mecánico, y lista la endometriosis y los quistes ováricos.

En **cadera**, fase 2, `ca_vascular`: `ca_v2` (TVP, urgencia) recoge la trombosis que puede dar el May-Thurner. Ninguna pregunta habla de varices pélvicas ni del May-Thurner.

En **lumbar**, fase 2, `l_u6` (cascanueces): el dolor de pelvis que empeora de pie es uno de sus tres acompañantes, y su `detalle` ya describe la congestión pélvica como consecuencia del cascanueces y nombra el May-Thurner como compresión que puede coexistir.

**La congestión pélvica no tiene ninguna pregunta propia** en ninguna región, y como síndrome solo aparece en el razonamiento de `l_u6`.

## ¿Aporta algo al fisio?

Sí, aunque con una evidencia muy floja:
- **Puede parecer un dolor de cadera, de ingle o sacroilíaco** (4 casos publicados, uno de ellos con 15 años de evolución, y un estudio de imagen), en mujeres jóvenes y activas, y **la fisioterapia fracasa** (Shelkey 2014).
- **Lo que la distingue de una causa mecánica** no es un test, sino un patrón:
  - la exploración de la cadera es normal o no reproduce el dolor (Shelkey 2014), o la radiografía es casi normal (Dos Santos 2016);
  - el dolor es de peso, empeora con estar de pie y a lo largo del día y mejora tumbada;
  - y se acompaña de algo que no es de la cadera: varices en la vulva, el muslo o la nalga, un dolor que dura después de las relaciones, la relación con la regla, vejiga o intestino irritables.
  - Ninguna fuente da la exactitud de este patrón.
- **Qué hacer ante la sospecha**: derivación médica preferente, no urgente, para descartar otras causas (endometriosis y el resto de la tabla 1 de Bałabuszek 2022) y valorar una ecografía pélvica con Doppler. No es una urgencia.
- **Riesgo de sobrediagnóstico**: venas dilatadas sin síntomas en alrededor del 10 % de las mujeres y causalidad no demostrada (Champaneria 2016). La pregunta no debe hacer que el fisio atribuya a las venas un dolor de cadera con una exploración positiva.

## Propuesta

### Pregunta nueva `ca_u6` en `ca_urogenital`, con derivación preferente (recomendada)

`ca_u4` cubre el dolor ligado a la regla y a las relaciones. Lo que falta es el patrón postural con algo que lo acompañe, que es lo que tenían las pacientes con dolor de cadera. Como en `l_u6`, la pregunta pide las dos cosas, porque el dolor que mejora tumbada no distingue nada solo.

- **Dónde**: `ca_urogenital`, justo después de `ca_u4` (su pregunta hermana) y antes de `ca_u5` (ectópico). Id propuesto: `ca_u6`.
- **Texto** (borrador): «(Mujeres) ¿Tiene desde hace meses un dolor sordo o de peso en la pelvis, la ingle o la cadera que empeora al estar mucho rato de pie o al final del día y mejora tumbada, y además tiene varices en la vulva, el periné, la cara interna o de detrás del muslo o la nalga, o un dolor que le dura horas después de las relaciones sexuales?»
- **Campos**: `alerta: true`, sin `urgencia`, con `derivacion`, sin `s1`. `anatomia: ['organos_reproductores_femeninos']` (clave ya en `data/anatomia.js`; Kenhub no tiene un artículo comprobado de las venas ováricas).
- **`derivacion`** (borrador): «Dolor pélvico, de ingle o de cadera que empeora de pie y mejora tumbada, con varices de origen pélvico o dolor tras las relaciones (posible síndrome de congestión pélvica): derivación médica preferente, no urgente, para descartar otras causas y valorar una ecografía pélvica con Doppler de las venas pélvicas, que hay que pedir expresamente.»
  - Sin nombrar especialista ni tratamiento, como en el Tarlov y el cascanueces.
  - «Que hay que pedir expresamente» viene de Hanna 2024: el Doppler venoso no va incluido en una ecografía pélvica normal. Si se quiere más corto, se puede quitar.
- **Por qué** (borrador): las venas de los ovarios y las ilíacas internas drenan el útero y los ovarios; si sus válvulas no cierran, o si hay una vena comprimida más arriba (la renal en el cascanueces, la ilíaca en el May-Thurner), la sangre refluye y las venas de la pelvis se dilatan. De pie la gravedad las llena más y tumbada se vacían: por eso el dolor es de peso, aumenta con estar de pie y a lo largo del día y mejora al tumbarse. Las venas de la pelvis se comunican con las de la vulva, el muslo y la nalga, y por eso aparecen varices en sitios poco habituales. El dolor puede notarse en la ingle o la cadera (Bałabuszek 2022; Hanna 2024; Dos Santos 2016).
- **Cuánto pesa** (borrador): sin datos de exactitud; ningún estudio mide esta pregunta.
  - Venas pélvicas dilatadas sin síntomas son frecuentes (alrededor del 10 % de las mujeres; Peker 2020; Kuo 2025), ver varices y dolor a la vez no demuestra que una cosa cause la otra (Kuo 2025), y que el reflujo cause el dolor no está demostrado (Champaneria 2016). Por eso la pregunta pide el dolor postural y un acompañante.
  - Como dolor de cadera solo hay casos publicados: en dos corredoras la exploración de la cadera era normal y la fisioterapia no funcionó (Shelkey 2014); en otras dos se había diagnosticado una artrosis con la radiografía casi normal (Dos Santos 2016).
  - Un SÍ con una exploración de cadera que reproduce claramente el dolor no lo explica todo: valorar las dos cosas.
  - Un SÍ pide una valoración médica preferente, no urgente. Un dolor pélvico nuevo con retraso de la regla es `ca_u5`; una pierna entera hinchada de golpe es `ca_v2`.
- **En detalle** (borrador, seis párrafos):
  1. *Quién*: mujeres antes de la menopausia (20–45 años en Hanna 2024), a menudo con varios partos, aunque también jóvenes sin partos; tras la menopausia suele desaparecer, y las fuentes no se ponen de acuerdo en si puede darse después (Hanna 2024; Kuo 2025). Factores de riesgo (Bałabuszek 2022).
  2. *Cómo se presenta*: el dolor y lo que lo empeora; las varices atípicas (vulva 24–40 %); vejiga e intestino irritables; el dolor tras las relaciones frente al de la endometriosis, con la salvedad de que falta investigación (Bałabuszek 2022). La relación con la regla varía entre fuentes (Dos Santos 2016; Shelkey 2014).
  3. *Con qué se confunde*: la tabla 1 de Bałabuszek 2022 (cadera, sacroilíaca, piriforme, psoas, suelo pélvico, neuralgias); en la RM sacroilíaca pedida por sospecha de sacroileítis, el signo de congestión era casi el doble de frecuente que en la de cadera (Peker 2020, solo imagen); la endometriosis y el resto de `ca_u4`.
  4. *Compresiones de arriba*: puede deberse a un cascanueces o a un May-Thurner (Dos Santos 2016; Bruessel 2026); el May-Thurner predispone a la trombosis venosa ilíaca (`ca_v2`).
  5. *Qué hacer con un SÍ*: derivar. El manejo conservador que describe StatPearls combina fármacos con fisioterapia del suelo pélvico y terapia cognitivo-conductual, sin estudios de su eficacia propia (Kuo 2025); el fisio no trata las venas ni prescribe compresión.
  6. *Tejido conectivo*: se ha descrito con más frecuencia en el Ehlers-Danlos y la hipermovilidad, pero la asociación no está medida (Bruessel 2026). Sin cifras.
  - Diagnóstico: lo hace el médico, empezando por la ecografía; ver las venas no basta (Bałabuszek 2022).
- **«Fisiología, paso a paso»** (decisión 9): 4 pasos, sin metáfora: válvulas que faltan o no cierran (o una vena comprimida más arriba) → reflujo y venas dilatadas → de pie la gravedad las llena y tumbada se vacían → colaterales hacia la vulva, el periné, el muslo y la nalga (Bałabuszek 2022; Kuo 2025; Hanna 2024).

### `ca_u4`: un párrafo que remite a `ca_u6` (recomendada)

- Al final del párrafo «Banderas del dolor pélvico (Goodman)» de su `detalle`, una frase: «Si además hay varices en la vulva, el muslo o la nalga, o un dolor que dura después de las relaciones, piensa en una congestión pélvica: la pregunta siguiente» (Bałabuszek 2022).
- Sin cambiar el texto ni los campos de `ca_u4`.

### Alternativa: solo texto en `ca_u4`, sin pregunta nueva

- Un párrafo «Congestión pélvica» en el `detalle` de `ca_u4`, como el MALS en `l_gi`.
- Más prudente con una evidencia tan floja (4 casos y causalidad no demostrada), pero el dolor postural que no sigue la regla no tendría ninguna pregunta que lo recoja, y el SÍ no llegaría a `dv[]`.

### Relación con la hipermovilidad: ninguna regla automática (recomendada)

- La tarjeta «Hipermovilidad» no activaría ni daría peso a `ca_u6`, como en el Tarlov, el MALS, el cascanueces y el POTS.
- Solo la frase sin cifras del párrafo 5 del «En detalle».

### Lo que no se toca

- Árbol CIF de cadera, hipótesis y tests de la fase 4b, fase 6 (ninguna fuente da pautas de fisioterapia), calculadora, tarjeta «Síntomas».
- `l_u6` (lumbar): ya recoge la congestión pélvica del cascanueces.
- Lumbar y sacroilíaca: Peker 2020 es solo de imagen; no justifica una pregunta en lumbar.
- Hombres: el trastorno venoso pélvico del hombre es el varicocele, que ya entra por `ca_u2` (cadera) y `l_u6` (lumbar).

## Fuentes

Las 8 fuentes están leídas enteras: cinco en PubMed Central y tres en PDF del usuario (Kuo 2025, Hanna 2024 y Champaneria 2016, octubre 2026). Champaneria 2016 no cambia ninguna decisión: su consejo de buena práctica (preguntar si el dolor empeora de pie y mejora tumbada, y mirar las varices) es justo lo que pide `ca_u6`, y su conclusión sobre la causalidad va al «Cuánto pesa».

Opcionales, no leídos: Lemos 2016 (*Int Urogynecol J*, atrapamiento vascular del plexo sacro con ciática cíclica), Berthelot 2022 (*Joint Bone Spine*, congestión venosa y radiculopatías), Meissner 2021 (clasificación SVP de los trastornos venosos pélvicos). No hacen falta para las decisiones.

## Decisiones (aceptadas por el usuario, octubre 2026)

1. **¿Pregunta nueva o solo texto?** Recomendación: **pregunta nueva `ca_u6`** con `derivacion` preferente, no urgente, en `ca_urogenital` tras `ca_u4`. Es lo que distingue el patrón postural no cíclico que tenían las pacientes con dolor de cadera, y un SÍ llega a `dv[]`, a la fase 5 y a los resúmenes. La alternativa (solo un párrafo en `ca_u4`) es más prudente pero deja ese patrón sin pregunta.
2. **Dos componentes**: el dolor postural (peor de pie o al final del día, mejor tumbada) **y** un acompañante (varices atípicas o dolor que dura tras las relaciones). Recomendación: sí, como `l_u6`. No incluir la relación con la regla como acompañante, porque ya la pregunta `ca_u4`.
3. **Solo mujeres, sin límite de edad**. Recomendación: «(Mujeres)», como `ca_u4`; el «Cuánto pesa» dice que tras la menopausia es rara. Un límite de edad dejaría fuera a la mujer de 53 años de Dos Santos 2016.
4. **Texto de la derivación**: médica preferente, no urgente, para descartar otras causas y valorar una ecografía pélvica con Doppler, sin nombrar especialista ni tratamiento. Recomendación: sí; casi todas las fuentes son de quien emboliza.
5. **`ca_u4`**: una frase que remite a `ca_u6`, sin cambiar su texto ni sus campos. Recomendación: sí. Aparte, y fuera de esta tarea: `ca_u4` dice «derivar» en su razonamiento pero no tiene `derivacion`; se puede revisar en otra sesión con sus propias fuentes (la enfermedad inflamatoria pélvica pide una derivación rápida, no preferente).
6. **Bandera roja propia**: ninguna. La trombosis del May-Thurner ya es `ca_v2` y el ectópico `ca_u5`; el razonamiento de `ca_u6` remite a las dos. Recomendación: sí.
7. **Hipermovilidad**: ninguna regla automática; solo una frase sin cifras (Bruessel 2026). Recomendación: sí, como en el Tarlov, el MALS y el cascanueces.
8. **Lumbar y sacroilíaca**: nada. Peker 2020 solo es imagen y `l_u6` ya recoge la congestión del cascanueces. Recomendación: no tocar lumbar.
9. **«Fisiología, paso a paso»**: opcional. Recomendación: sí, 4 pasos y sin metáfora, para que `ca_u6` tenga el mismo nivel que `l_u6`.
10. **No se implementa hasta leer enteras StatPearls, Hanna 2024 y Champaneria 2016** (en PDF del usuario), como la decisión 7 del Tarlov. Recomendación: sí; Champaneria 2016 es la que puede cambiar el «Cuánto pesa». StatPearls y Hanna 2024, leídos (2026-10): no cambian ninguna decisión; añaden «que hay que pedir expresamente» a la derivación, el periné a las varices y el párrafo «Qué hacer con un SÍ». Champaneria 2016, leído (2026-10): tampoco cambia ninguna decisión. **Cumplida.**

## Implementación (octubre 2026)

- **`data/cadera.js`**
  - **`ca_u6`**, en `ca_urogenital` entre `ca_u4` (dolor ligado a la regla o a las relaciones) y `ca_u5` (embarazo ectópico): `alerta: true`, `anatomia: ['organos_reproductores_femeninos']`, `derivacion` (texto de la decisión 4, con «que hay que pedir expresamente»), sin `urgencia`, sin `hm`.
  - Su `razonamiento`: «¿Por qué?» (`porque`, `peso`), «Ampliar →» con un `detalle` de seis párrafos (quién, cómo se presenta, con qué se confunde, venas comprimidas más arriba, qué hacer con un SÍ, tejido conectivo), «Fisiología, paso a paso» con 4 pasos y sin metáfora (decisión 9), y 8 fuentes con cita y enlace.
  - **`ca_u4`**: una frase al final de «Banderas del dolor pélvico (Goodman)» que remite a la pregunta siguiente, y Bałabuszek 2022 en sus fuentes. Sin cambios en su texto ni en sus campos (decisión 5).
- **`data/referencias.js`**: 7 referencias nuevas (Champaneria 2016, Bałabuszek 2022, Kuo 2025, Hanna 2024, Shelkey 2014, Dos Santos 2016, Peker 2020); Bruessel 2026 ya estaba. `docs/referencias.md` regenerado.
- Nada nuevo en `app.js`: la derivación usa el campo `derivacion` del Tarlov (mensaje 🩺 con SÍ, aviso «Derivación médica», fase 5, `📋 Notas`, `📄 Informe`, payload `dv[]`). physiq-report no necesita cambios: pinta `dv` con un texto genérico. La fase 6 no se bloquea. En modo breve queda bajo el embudo del sistema, como `l_u6`, porque no es una urgencia.
- **Pruebas**: `tests/unit/cribado.mjs` (la lista de preguntas con `derivacion` incluye `ca_u6`; su posición, campos y fuentes; en `dv` y no en `ur`; ninguna regla con la hipermovilidad; la derivación no nombra la embolización), `tests/unit/anatomia.mjs` (24 preguntas de cadera con anatomía) y la sección `congestion-pelvica` de `tests/smoke.mjs`.

