# Síndrome de May-Thurner — borrador de diseño

Estado: **implementado (octubre 2026), pendiente de la revisión del usuario.** El usuario aceptó las 8 recomendaciones y aportó el PDF de Tsouknidas 2022, leído entero. Lo implementado, en «Implementación», al final.

Origen: la pregunta del usuario (2026-10) de si habría que añadir el May-Thurner, después de la congestión pélvica (`docs/congestion-pelvica.md`) y el cascanueces (`docs/mals-cascanueces.md`).

Es la **compresión de la vena ilíaca común izquierda** por la arteria ilíaca común derecha contra la quinta vértebra lumbar. El fisio no lo diagnostica. Lo que interesa a PhysiQ, como con el Tarlov y el cascanueces, es si **puede presentarse como un problema que parezca musculoesquelético** y qué hacer si lo sospecha.

## Fuentes leídas

Leídas enteras (notas por fuente, con las frases en inglés, en el scratchpad de la sesión):

| Clave propuesta | Referencia | Cómo se leyó | Qué aporta |
|---|---|---|---|
| `Mangla y Hamad 2024` | Mangla A, Hamad H. «May-Thurner Syndrome». StatPearls [Internet], NCBI Bookshelf, actualizado el 11 de marzo de 2024. [NBK554377](https://www.ncbi.nlm.nih.gov/books/NBK554377/) | Capítulo completo | Visión general: mecanismo, quién, clínica con y sin trombosis, diagnóstico, tratamiento. Nombra a los fisioterapeutas entre quienes deben conocerlo |
| `Poyyamoli 2021` | Poyyamoli S, et al. May-Thurner syndrome. *Cardiovasc Diagn Ther* 2021;11(5):1104–1111. [doi:10.21037/cdt.2020.03.07](https://doi.org/10.21037/cdt.2020.03.07) (PMC8569277) | PMC | La única que dice qué alivia la claudicación venosa: «relieved with rest and leg elevation» |
| `Radaideh 2019` | Radaideh Q, Patel NM, Shammas NW. Iliac vein compression: epidemiology, diagnosis and treatment. *Vasc Health Risk Manag* 2019;15:115–122. [doi:10.2147/VHRM.S203349](https://doi.org/10.2147/VHRM.S203349) (PMC6512954) | PMC | La compresión en personas sin síntomas (24 % en TC, citando a Kibbe 2004) y que no se busca sin síntomas |
| `Brinegar 2015` | Brinegar KN, et al. Iliac vein compression syndrome: clinical, imaging and pathologic findings. *World J Radiol* 2015;7(11):375–381. [doi:10.4329/wjr.v7.i11.375](https://doi.org/10.4329/wjr.v7.i11.375) (PMC4663376) | PMC | Cuándo sospecharlo; no hay criterios diagnósticos estandarizados |
| `Knuttinen 2017` | Knuttinen MG, et al. May-Thurner: diagnosis and endovascular management. *Cardiovasc Diagn Ther* 2017;7(Suppl 3):S159–S164. [doi:10.21037/cdt.2017.10.14](https://doi.org/10.21037/cdt.2017.10.14) (PMC5778514) | PMC | La descripción más concreta sin trombosis: peor con la actividad y al final del día, mejor por la mañana, «left shoe … tighter by the evening» |
| `Dunlap 2023` | Dunlap E, Fitzpatrick S, Nagarsheth K. Back pain and right leg swelling: unusual presentations of May-Thurner syndrome. *Cureus* 2023;15(3):e35984. [doi:10.7759/cureus.35984](https://doi.org/10.7759/cureus.35984) (PMC10083046) | PMC | La única que lo relaciona con dolor lumbar: 3 casos, sin describir el dolor |
| `Lim 2024` | Lim C, et al. Is the May-Thurner syndrome a major risk factor for deep vein thrombosis in total hip arthroplasty? *Clin Orthop Surg* 2024;16(1):34–40. [doi:10.4055/cios23128](https://doi.org/10.4055/cios23128) (PMC10825252) | PMC | Tras una prótesis de cadera, la TVP en la pierna izquierda aunque se operara la derecha (2 de 4 casos) |
| `Ormiston 2022` | Ormiston CK, et al. May-Thurner syndrome in patients with postural orthostatic tachycardia syndrome and Ehlers-Danlos syndrome: a case series. *Eur Heart J Case Rep* 2022;6(4):ytac161. [doi:10.1093/ehjcr/ytac161](https://doi.org/10.1093/ehjcr/ytac161) (PMC9131024) | PMC | 3 casos con Ehlers-Danlos hipermóvil y POTS; la asociación no está medida |

`Bruessel 2026` (ya en el registro, leída en la sesión del MALS) trata las compresiones vasculares abdominales en el Ehlers-Danlos y la hipermovilidad.

Salvedades de lectura:
- Todas las revisiones son narrativas, y varias firmadas por radiólogos intervencionistas con honorarios de fabricantes de stents.
- **Ninguna fuente da cifras de exactitud** (sensibilidad, especificidad o LR) de ningún síntoma o signo.
- **Ninguna compara la claudicación venosa con la neurógena** (estenosis lumbar) ni con la arterial.
- Contradicciones entre fuentes:
  - el sexo: mujeres el doble (StatPearls) frente a «both genders are equally affected» (Knuttinen 2017);
  - el TEP: más frecuente en mujeres (StatPearls) frente a «very low» (Poyyamoli 2021);
  - la cifra «2–5 %», aplicada a denominadores distintos.
- StatPearls y Knuttinen 2017 recomiendan el stent para la compresión de la ilíaca «external»; en el May-Thurner es la común. La frase parece copiada de una a otra.
- `Dunlap 2023` tiene erratas graves:
  - la edad media que da no cuadra con su tabla;
  - una de las tres pacientes no tiene dolor lumbar en esa tabla.
  Solo sirve como «está descrito».
- `Lim 2024`:
  - incluye solo a mayores de 65 años, pero dos de sus pacientes tienen 54 y 58;
  - define el síndrome de forma circular;
  - no tiene grupo control, así que no mide ningún riesgo.

Para separar la claudicación venosa de la neurógena hacía falta **Tsouknidas 2022** («Venous claudication: a scoping review», *Eur J Vasc Endovasc Surg* 64:535–543, [doi:10.1016/j.ejvs.2022.08.006](https://doi.org/10.1016/j.ejvs.2022.08.006)), que no está en abierto (decisión 6). El usuario aportó el PDF y está leído entero: ver «Tsouknidas 2022» abajo.

## Tsouknidas 2022

Tsouknidas I, Charisis N, Eklof B, Labropoulos N. Venous claudication: a scoping review of the pathophysiology and clinical importance. *Eur J Vasc Endovasc Surg* 2022;64(5):535–543. [doi:10.1016/j.ejvs.2022.08.006](https://doi.org/10.1016/j.ejvs.2022.08.006). PDF del usuario, leído entero (9 páginas, tablas y figuras).

- **El síntoma:**
  - un dolor «bursting or cramping» (de reventón o de calambre) en el muslo, la nalga o la pierna al caminar, a menudo con hinchazón;
  - empieza poco a poco y empeora, hasta obligar a parar (pp. 535 y 539);
  - se alivia con reposo y elevando la pierna, y tarda «up to 15 minutes» (p. 535) o «usually … 15 minutes or more» (p. 539): el propio artículo se contradice.
- **La causa:** casi siempre una obstrucción iliofemoral, a menudo tras una trombosis ilíaca o de la cava. Nombra la compresión de la vena ilíaca común izquierda (p. 537).
- **Frente a la claudicación arterial** (p. 539): calambre tras una distancia concreta, que cede quedándose de pie 1–2 minutos.
- **Frente a la neurógena** (pp. 539–540): cede con reposo, pero cambiando la postura de la espalda (menos lordosis).
- **Variante «neurogenic venous induced claudication»** (p. 540): es poco frecuente, y en ella elevar la pierna o mover la columna la empeora. No se lleva a la app.
- **Lo que no da:**
  - tabla comparativa: el diferencial es texto apoyado en otras referencias;
  - cifras de exactitud de ningún síntoma.
- **Calidad:** 29 estudios, todos observacionales.
- **Sobre la comparación del borrador:** el artículo no compara directamente lo que alivia cada tipo, así que no apoya la frase «más que con flexionar el tronco». Se sustituye por lo que sí dice de cada claudicación.
- **Erratas:**
  - años y números de pacientes distintos entre el texto y las tablas;
  - el diagrama de flujo no cuadra;
  - la cabecera dice «Systematic review», aunque es una scoping review.

## Qué dicen, en lo que importa a PhysiQ

- **La compresión es frecuente y casi siempre no da síntomas.** Varias fuentes la llaman «variante anatómica normal» (StatPearls, Radaideh 2019, Brinegar 2015). Radaideh 2019, citando a Kibbe 2004, da un 24 % en TC de personas sin síntomas, y añade: «imaging tests evaluating for the presence of ILVC in the general population are not warranted».
- **Quién:** sobre todo mujeres de 30 a 50 años (StatPearls; Poyyamoli 2021; Brinegar 2015). Knuttinen 2017 dice que afecta igual a ambos sexos.
- **Sin trombosis** (lo que más se parecería a un problema mecánico):
  - pierna izquierda hinchada, pesada o tensa, que empeora con la actividad y al final del día y mejora con reposo, elevación y durante la noche (StatPearls; Poyyamoli 2021; Knuttinen 2017);
  - con el tiempo, varices, pigmentación o úlceras;
  - «claudicación venosa», que todas nombran y solo Poyyamoli 2021 describe: se alivia con reposo y elevando la pierna.
- **Con trombosis:**
  - es la forma más reconocida: una TVP iliofemoral izquierda, a menudo tras cirugía, inmovilización, embarazo, posparto o anticonceptivos (StatPearls; Poyyamoli 2021);
  - tras una prótesis de cadera, puede aparecer en la pierna izquierda aunque se haya operado la derecha (Lim 2024, 2 de 4 casos).
- **Dolor lumbar:** solo 3 casos (Dunlap 2023), sin descripción del dolor. Ormiston 2022 describe dolor pélvico que irradia a la pierna.
- **Diagnóstico y tratamiento**, cosa del médico:
  - diagnóstico: el Doppler no basta para la pelvis; se usan TC, RM o IVUS, y no hay criterios estandarizados;
  - tratamiento: compresión y elevación si hay pocos síntomas; anticoagulación y stent si hay trombosis; stent si los síntomas son importantes.

## Qué tiene ya la app

- **La consecuencia peligrosa ya está cubierta.** Una TVP es urgencia en:
  - cadera (`ca_v2`);
  - el cribado posquirúrgico de todas las regiones de la pierna (`pq_tvp`, que ya pregunta por «una pantorrilla o una pierna», sin decir cuál);
  - el lupus (`les_u_tvp`).
- **Ya se nombra** como causa en el «¿Por qué?» de la congestión pélvica (`ca_u6`) y en el detalle del cascanueces (`l_u6`).
- **Lumbar** trata la claudicación vascular en dos sitios, y los dos describen la **arterial**:
  - el árbol (`lu_step2`), con la opción VASCULAR («los síntomas al caminar ceden con solo pararse de pie») y derivación médica;
  - el sistema vascular del cribado (`l_vascular`, preguntas `l_v1` y `l_v3`), con pulsos y temperatura.

  La claudicación venosa no se menciona en ningún sitio.

## Decisiones

Aceptadas las 8 recomendaciones (2026-10).

1. **Pregunta propia en el cribado: no.**
   - La compresión es una variante frecuente sin síntomas, y ningún síntoma tiene exactitud medida, así que una pregunta sería muy poco específica.
   - Su consecuencia urgente (la TVP) ya está preguntada.
   - Es el mismo criterio que con el MALS.

2. **Un párrafo sobre la claudicación venosa en el detalle de `lu_step2` (lumbar, fase 4): sí.**
   - Es el único hueco real: el paso compara la claudicación neurógena con la arterial y no dice nada de la venosa.
   - Borrador: «Hay también una claudicación **venosa**: la pierna se nota pesada, tensa o hinchada al caminar o al final del día, y se alivia con reposo y elevándola, más que con flexionar el tronco. Es poco frecuente; una causa es la compresión de la vena ilíaca izquierda (síndrome de May-Thurner), sobre todo en mujeres de 30 a 50 años. La compresión por sí sola es muy frecuente y no da síntomas; el diagnóstico es médico (Poyyamoli 2021; Knuttinen 2017; Mangla y Hamad 2024).»
   - No toca las opciones, las hipótesis ni la navegación del árbol, así que no cambia la instantánea de navegación.
   - Alternativa: ponerlo en el razonamiento de `l_v1` (fase 2), que ya habla de la arterial. *Recomiendo* `lu_step2`, porque es donde el clínico compara las claudicaciones.
   - «más que con flexionar el tronco» es la única frase que compara, y su apoyo es indirecto: la flexión alivia la neurógena según el propio `lu_step2`, y la elevación alivia la venosa según Poyyamoli. Si prefieres no compararlas sin una fuente que lo haga, la quito (ver la decisión 6).

3. **Una frase en el detalle de `pq_tvp` (cribado posquirúrgico): sí.**
   - Texto: «Tras una prótesis de cadera, la trombosis puede aparecer en la pierna contraria: en una serie de casos, la izquierda, aunque se operara la derecha, por una compresión de la vena ilíaca izquierda (Lim 2024). Por eso la pregunta es por cualquier pierna.»
   - No cambia la pregunta, que ya dice «una pierna».
   - Sirve para que el clínico no mire solo la pierna operada.
   - Lim 2024 es solo una serie de casos, y así lo dice la frase: no afirma ningún riesgo.

4. **Fila en la guía de condiciones especiales: no.** No habría pregunta a la que llevar, igual que el MALS (decisión 5 de la guía).

5. **Regla con la hipermovilidad o el POTS: no.**
   - Ormiston 2022 son 3 casos, y los propios autores dicen que la prevalencia de la asociación es desconocida.
   - No se añade nada a las tarjetas: se queda en este documento, como hicimos con el cascanueces.

6. **Pedir el PDF de Tsouknidas 2022:**
   - con él, el párrafo de la decisión 2 podría comparar la claudicación venosa con la neurógena y la arterial con una fuente que lo haga;
   - sin él, el párrafo se queda en describir la venosa;
   - *recomiendo* pedirlo, pero no esperarlo para implementar: si llega, se mejora el párrafo después.
   - Los demás PDF que no están en abierto no los necesito: Kibbe 2004 (la cifra original en personas sin síntomas), Khawer 2025 (un caso que se presentó como lumbalgia y radiculopatía) y Ogunlade 2026 (Ehlers-Danlos frente a controles). Las cifras que tenemos llegan citadas, y la app no daría ninguna.

7. **Registro de referencias:** añadir solo las que se citarían: `Poyyamoli 2021`, `Knuttinen 2017`, `Mangla y Hamad 2024` y `Lim 2024`. Dunlap 2023, Radaideh 2019, Brinegar 2015 y Ormiston 2022 se quedan en este documento.

8. **Fase 6:** nada. No hay hipótesis ni pauta del May-Thurner, y la red de seguridad de la TVP ya está donde la región la tiene.

## Implementación (octubre 2026)

- **Decisión 2** (`lu_step2`, lumbar, detalle del razonamiento): párrafo sobre la claudicación venosa, después del de la arterial. Texto final, ya con Tsouknidas 2022:

  > Hay también una claudicación venosa, menos frecuente: un dolor de reventón o de calambre en la nalga, el muslo o la pierna al caminar, a menudo con hinchazón, que obliga a parar y cede con reposo y elevando la pierna, a menudo tras 15 minutos o más; la arterial cede de pie en 1–2 minutos, y la neurógena pide cambiar la postura de la espalda (Tsouknidas 2022). Casi siempre se debe a una obstrucción de la vena ilíaca, tras una trombosis o por la compresión de la vena ilíaca izquierda (síndrome de May-Thurner), más frecuente en mujeres de 30 a 50 años; esa compresión, por sí sola, es frecuente y casi nunca da síntomas (Mangla y Hamad 2024). El diagnóstico es médico: con este patrón, valoración médica.

  - La frase «más que con flexionar el tronco» del borrador se quitó: Tsouknidas 2022 no compara directamente.
  - Las opciones, las hipótesis y la navegación del árbol no cambian.
- **Decisión 3** (`pq_tvp`, cribado posquirúrgico): una frase al final de su detalle, solo en la pregunta del miembro inferior (`pq_tvp_ms` sigue con el razonamiento compartido sin ella). Dice que tras una prótesis de cadera la trombosis puede salir en la pierna contraria (Lim 2024) y que es una serie de 4 casos sin grupo control.
- **Decisión 7** (registro): `Tsouknidas 2022`, `Mangla y Hamad 2024` y `Lim 2024`. Poyyamoli 2021 y Knuttinen 2017 al final no se citan: lo que iban a apoyar lo dice mejor Tsouknidas 2022. Se quedan en este documento con las demás. `docs/referencias.md` regenerado.
- **Decisiones 1, 4, 5 y 8:** nada que tocar.
- Pruebas: `node tests/unit.js` (647) y la prueba de humo completa, en verde. No hacía falta una prueba nueva: las del razonamiento del árbol y del cribado ya comprueban que cada fuente esté en el registro, que tenga su cita y que nada llegue al payload ni a los resúmenes.
