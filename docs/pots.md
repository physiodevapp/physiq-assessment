# POTS (síndrome de taquicardia postural ortostática) y disautonomía — diseño

Estado: **las 12 recomendaciones, aceptadas por el usuario (octubre 2026); implementado (ver «Implementación»), con la revisión del usuario dada por hecha (octubre 2026). La decisión 9 (pregunta de síncope en cada región) también está hecha.** Todas las fuentes están leídas enteras: las que están en abierto y los PDF del usuario.

Es la tercera condición especial de la Fase P (`MIGRATION_PLAN.md`), después de la hipermovilidad / Ehlers-Danlos (`docs/hipermovilidad.md`) y del quiste de Tarlov (`docs/tarlov.md`).

**Por qué un documento propio y no una sección de `docs/hipermovilidad.md`:**
- El POTS no es una variante de la hipermovilidad. Las fuentes hablan de asociación, no de causa:
  - en las consultas de POTS, entre el 20 y el 30 % cumple los criterios del SEDh o del TEH (Vernino 2021; Raj 2022; Raj 2020, tabla 4: 25 %);
  - del 70 al 80 % restante no tiene hipermovilidad.
- Tiene su propia tarjeta, sus propias fuentes y su propio riesgo: el síncope cardiaco.
- Meterlo en la tarjeta de hipermovilidad haría que una condición activase la otra, que es justo lo que este diseño propone no hacer (decisión 5).
- `docs/hipermovilidad.md` lo dejó fuera del piloto (su decisión 4) y solo enlazará aquí.

## Fuentes leídas

### Enteras, en abierto (PMC o web)

| Clave propuesta | Referencia | Cómo se leyó | Qué aporta |
|---|---|---|---|
| `Sheldon 2015` | Sheldon RS, Grubb BP, Olshansky B, et al. 2015 Heart Rhythm Society expert consensus statement on the diagnosis and treatment of postural tachycardia syndrome, inappropriate sinus tachycardia, and vasovagal syncope. *Heart Rhythm* 2015;12(6):e41–e63. [doi:10.1016/j.hrthm.2015.03.029](https://doi.org/10.1016/j.hrthm.2015.03.029) | PMC5267948 | Definición, ejercicio (IIa, B-R), agravantes, pronóstico, síncope de esfuerzo en jóvenes |
| `Vernino 2021` | Vernino S, Bourne KM, Stiles LE, et al. Postural orthostatic tachycardia syndrome (POTS): State of the science and clinical care from a 2019 National Institutes of Health Expert Consensus Meeting – Part 1. *Auton Neurosci* 2021;235:102828. [doi:10.1016/j.autneu.2021.102828](https://doi.org/10.1016/j.autneu.2021.102828) | PMC8455420 | Criterios con ≥3 meses y exclusiones, comorbilidades (tabla 1), ejercicio (tabla 2), historia natural |
| `Raj 2022` | Raj SR, Fedorowski A, Sheldon RS. Diagnosis and management of postural orthostatic tachycardia syndrome. *CMAJ* 2022;194(10):E378–E385. [doi:10.1503/cmaj.211373](https://doi.org/10.1503/cmaj.211373) | PMC8920526 | Prueba de bipedestación con sus minutos (1, 3, 5, 8, 10), diferencial (recuadro 3), taquicardia paroxística, atención primaria |
| `Plash 2013` | Plash WB, Diedrich A, Biaggioni I, et al. Diagnosing postural tachycardia syndrome: comparison of tilt testing compared with standing haemodynamics. *Clin Sci* 2013;124(2):109–114. [doi:10.1042/CS20120276](https://doi.org/10.1042/CS20120276) | PMC3478101 | Precisión de la bipedestación de 10 min con el corte de 30 lpm |
| `Fu 2010` | Fu Q, VanGundy TB, Galbreath MM, et al. Cardiac origins of the postural orthostatic tachycardia syndrome. *J Am Coll Cardiol* 2010;55(25):2858–2868. [doi:10.1016/j.jacc.2010.02.043](https://doi.org/10.1016/j.jacc.2010.02.043) | PMC2914315 | Programa de entrenamiento original (laboratorio) |
| `Miller 2020` | Miller AJ, Stiles LE, Sheehan T, et al. Prevalence of hypermobile Ehlers-Danlos syndrome in postural orthostatic tachycardia syndrome. *Auton Neurosci* 2020;224:102637. [doi:10.1016/j.autneu.2020.102637](https://doi.org/10.1016/j.autneu.2020.102637) | PMC7282488 | La asociación con el SEDh, medida con los criterios de 2017, y sus límites |
| `NICE CG109` | NICE. Transient loss of consciousness ('blackouts') in over 16s. Clinical guideline CG109, 2010 (actualizada en 2023). [nice.org.uk/guidance/cg109](https://www.nice.org.uk/guidance/cg109) | Capítulo «Recommendations», en la web | Banderas rojas del síncope (1.1.4.2), síncope de esfuerzo (1.3.2.1–1.3.2.2), qué decir mientras espera (1.5.4.3) |
| (no se registra) | Raj SR, Bourne KM, Stiles LE, et al. … Part 2. *Auton Neurosci* 2021;235:102836. [doi:10.1016/j.autneu.2021.102836](https://doi.org/10.1016/j.autneu.2021.102836) | PMC8455430 | Solo contexto (pocos ensayos; la gravedad de los síntomas casi no se relaciona con la taquicardia). No se usa |

### Enteras, en PDF del usuario (octubre 2026)

| Clave propuesta | Referencia | Qué aporta |
|---|---|---|
| `Brignole 2018` | Brignole M, Moya A, de Lange FJ, et al. 2018 ESC Guidelines for the diagnosis and management of syncope. *Eur Heart J* 2018;39(21):1883–1948. [doi:10.1093/eurheartj/ehy037](https://doi.org/10.1093/eurheartj/ehy037) | **Rasgos de alto riesgo del síncope (tabla 6, pp. 1897–1898)**, rasgos de síncope cardiaco (tabla 5, p. 1895), bipedestación activa y criterios de hipotensión ortostática y de POTS (p. 1902), síncope de esfuerzo (p. 1911) |
| `Raj 2020` | Raj SR, Guzman JC, Harvey P, et al. Canadian Cardiovascular Society position statement on postural orthostatic tachycardia syndrome (POTS) and related disorders of chronic orthostatic intolerance. *Can J Cardiol* 2020;36(3):357–372. [doi:10.1016/j.cjca.2019.12.024](https://doi.org/10.1016/j.cjca.2019.12.024) | **Única con GRADE.** Protocolo de la bipedestación (recomendación 4), FC de referencia de 60 lpm, ejercicio (recomendación 14), el fisioterapeuta en el equipo, taquicardia postural de otra causa (tabla 5) |
| `Sivakoti 2026` | Sivakoti K, Cortez MM, Fedorowski A, et al. Postural orthostatic tachycardia syndrome (POTS) and dysautonomia: international multidisciplinary expert consensus. *Am J Med* 2026 (en prensa). [doi:10.1016/j.amjmed.2026.08.012](https://doi.org/10.1016/j.amjmed.2026.08.012) | Comprueba que los criterios no cambian (tabla 1). Una prueba negativa no descarta la disautonomía (enunciado 10). Ejercicio tumbado o sentado adaptado al malestar postesfuerzo (enunciado 16) |
| `Hakim 2017` | Hakim A, O'Callaghan C, De Wandele I, et al. Cardiovascular autonomic dysfunction in Ehlers–Danlos syndrome—hypermobile type. *Am J Med Genet C* 2017;175C:168–174. [doi:10.1002/ajmg.c.31543](https://doi.org/10.1002/ajmg.c.31543) | La relación con el SEDh desde su lado. Preparación de la prueba (p. 171). **Adaptación del ejercicio con intolerancia ortostática (p. 172)** |
| `George 2016` | George SA, Bivens TB, Howden EJ, et al. The international POTS registry: evaluating the efficacy of an exercise training intervention in a community setting. *Heart Rhythm* 2016;13(4):943–950. [doi:10.1016/j.hrthm.2015.12.012](https://doi.org/10.1016/j.hrthm.2015.12.012) | El programa de 3 meses fuera del laboratorio, mes a mes (tabla 2). Abandono del 59 %. Pide implicar a fisioterapeutas |
| `Fedorowski 2019` | Fedorowski A. Postural orthostatic tachycardia syndrome: clinical presentation, aetiology and management. *J Intern Med* 2019;285(4):352–366. [doi:10.1111/joim.12852](https://doi.org/10.1111/joim.12852) | Presentación clínica (tabla 2, incluido el dolor musculoesquelético), el 30–50 % se desmaya, ergometría si se desmaya con el ejercicio. **No se usa** su «el 50 % se recupera solo en 1–3 años» (ver salvedades) |

### Salvedades de lectura
- **Páginas**:
  - Los textos de PMC no traen paginación; se citan por sección, recuadro o tabla.
  - George 2016 y Fedorowski 2019 llegaron como manuscrito aceptado, sin las páginas de la revista. Se citan por sección y tabla.
  - Sivakoti 2026 está en prensa: páginas 1–13 del PDF.
  - Los dos PDF de Fedorowski son el mismo artículo.
- **No se leyeron**: los anexos web de la ESC 2018, que no venían en el PDF (la técnica de la bipedestación, la definición de la hipotensión ortostática inicial y la diferida), ni el material suplementario de Raj 2020. No hacen falta.
- **Discrepancias entre fuentes, y qué se elige**:
  - **Criterio de «FC por encima de 120» sin subir 30 lpm**: lo aceptan la ESC 2018 (p. 1902) y Fedorowski 2019, y Raj 2020 lo quita («la mayoría ya cumple el aumento de 30, y el resto encaja mejor en una taquicardia sinusal inapropiada», pp. 360–361). Las demás fuentes no lo usan. **Se usa solo el aumento** (decisión 4).
  - **Duración de los síntomas**: ≥3 meses en Vernino 2021, Raj 2020, Raj 2022 y Sivakoti 2026. George 2016 pedía 6 meses, y Fedorowski 2019 da 6 meses avisando de que es discutido. **Se usan 3 meses.**
  - **Hipotensión ortostática**: ≥20 mmHg de TAS o ≥10 mmHg de TAD en los 3 primeros minutos (Raj 2020; Hakim 2017). La ESC 2018 añade una TAS por debajo de 90 (p. 1901). **Se usan los tres.**
  - **Antecedente familiar de muerte súbita**: NICE CG109 lo da como bandera roja con el síncope. La ESC 2018 lo pone como rasgo menor, de alto riesgo solo con cardiopatía estructural o ECG alterado (tabla 6). El fisio no puede saber ni lo uno ni lo otro, así que **se sigue a NICE**, que es la más prudente (decisión 3).
- **George 2016** sale en PubMed como «ensayo aleatorizado», pero no lo es:
  - es un registro observacional sin grupo control (sus propios autores, limitaciones);
  - solo completó el programa el 41 %, y las cifras de remisión (71 %) son de quienes lo terminaron;
  - el 40 % de los abandonos fue porque era «demasiado difícil».
- **Fedorowski 2019**:
  - su «alrededor del 50 % se recupera solo en 1–3 años» sale de una cohorte de **adolescentes** (Bhatia 2016, su ref. 67). No se usa para adultos;
  - su 20–50 % de solapamiento con el síndrome de fatiga crónica y el Ehlers-Danlos mezcla las dos condiciones.
- **Sivakoti 2026**:
  - es un Delphi de una sola ronda con un panel elegido por el grupo núcleo; sus autores reconocen el riesgo de «consenso artificial»;
  - dice que «disautonomía no POTS» es un término provisional que **no** respaldan para la práctica clínica (pp. 2 y 11);
  - no trae nada sobre banderas rojas.
- **Hakim 2017** es consenso de expertos. Sus propios autores dicen que la evidencia en el SEDh es de nivel IV y que no hay ensayos.
- **Plash 2013**:
  - es pequeño (15 pacientes y 15 controles) y retrospectivo;
  - el paciente estaba tumbado desde la noche anterior, que no es la práctica habitual.
- **Fu 2010**:
  - el entrenamiento no tiene grupo control;
  - los pacientes además tomaban más sal y agua y elevaban el cabecero de la cama, así que la mejora no es solo del ejercicio.
- **Miller 2020**:
  - reclutó en un congreso de pacientes, sin grupo control;
  - el POTS era autodeclarado.

## Lo que dicen las fuentes (lo que usa el diseño)

**Definición**: tienen que cumplirse todos los criterios (Vernino 2021, §2; Raj 2022, recuadro 2; Raj 2020, tabla 1 y §3.2; Sivakoti 2026, tabla 1).
- **FC**: sube de forma mantenida ≥30 lpm en los 10 min de bipedestación, o ≥40 lpm entre los 12 y los 19 años.
  - «Mantenida» = en al menos 2 medidas seguidas separadas al menos 1 min, después del primer minuto (Raj 2020, recomendación 4, fuerte, evidencia moderada).
  - Por debajo de los 12 años el POTS no está definido (Vernino 2021, §11).
- **Sin hipotensión ortostática** mantenida. Una hipotensión inicial de menos de 1 min no excluye el POTS (Raj 2020).
- **Intolerancia ortostática** predominante: síntomas de pie que mejoran al tumbarse. Aturdimiento, palpitaciones, temblor, debilidad, visión borrosa, cansancio.
- **Duración**: al menos 3 meses.
- **Sin otra causa de taquicardia** (Vernino 2021; Raj 2022, recuadro 3; Raj 2020, tabla 5: la «taquicardia postural de otra causa» excluye el POTS):
  - hipovolemia o sangrado, anemia, fiebre, infección, dolor;
  - endocrinopatías;
  - ansiedad o pánico;
  - fármacos (estimulantes, IRSN, tricíclicos, entre otros) y drogas;
  - reposo prolongado en cama.
- **FC de referencia** (Raj 2020, p. 363): si la FC tumbado es menor de 60, se toma 60. Así, de pie tiene que llegar al menos a 90 lpm (100 en adolescentes).
- La taquicardia de pie suele ser mayor por la mañana (Sheldon 2015; Raj 2022).
- **Sivakoti 2026 confirma estos criterios** y añade dos cosas:
  - una prueba que no llega al corte no descarta una disautonomía (enunciado 10, 100 %);
  - a quien tiene el cuadro sin llegar al corte lo llama, de forma provisional, «disautonomía no POTS». Raj 2020 lo llama «síntomas posturales sin taquicardia».

**La prueba de bipedestación activa**:

| Paso | Qué se hace | Fuente |
|---|---|---|
| Preparación | Habitación tranquila, a 20–24 °C; vaciar la vejiga antes | Hakim 2017, p. 171 |
| Reposo | Tumbado al menos 5 min (5–10 según Raj 2022) | Raj 2020, rec. 4 (fuerte, moderada) |
| Medidas | FC y TA tumbado; de pie, a los 1, 3, 5, 8 y 10 min, anotando los síntomas | Raj 2022 |
| Positiva | FC ≥30 lpm sobre la de reposo (≥40 de 12 a 19 años) en al menos 2 medidas seguidas después del primer minuto, sin hipotensión ortostática | Raj 2020, rec. 4; Raj 2022 |
| Hipotensión ortostática | Caída de la TAS ≥20 o de la TAD ≥10 en los 3 primeros minutos, o TAS por debajo de 90 | Raj 2020; Hakim 2017; Brignole 2018, p. 1902 |
| Medida dudosa | Si solo la última medida supera el corte, repetir 1 min después | Raj 2020, p. 361 |
| Material | Manguito (manual o automático) y pulso, o un pulsioxímetro o reloj para la FC | Raj 2020, p. 365 |
| No llega al corte con sospecha alta | Repetir otro día, mejor por la mañana; no descarta una disautonomía | Raj 2022; Sivakoti 2026 |

- **Lo que no hace falta**: la mesa basculante, de forma rutinaria (Raj 2020, rec. 8; Vernino 2021, §12).
- **Cuánto pesa la prueba** (Plash 2013): con el corte de 30 lpm, la bipedestación de 10 min tuvo una sensibilidad del 87 % y una especificidad del 67 %. Uno de cada tres controles sanos superó el corte. Por eso los criterios exigen también los síntomas.

**Quién hace el diagnóstico**: el médico de atención primaria, con la historia, la exploración con los signos ortostáticos, un ECG de 12 derivaciones y una analítica (hemograma, iones, función renal, ferritina, TSH y cortisol matutino). Con eso basta en la mayoría (Raj 2020, recs. 3, 6 y 30). Se deriva a una consulta especializada si hay dudas o no responde al tratamiento (rec. 31).

**Taquicardia sinusal inapropiada**: FC en reposo de más de 100 lpm, con una media de 24 h por encima de 90 (Raj 2020, §3.8; Raj 2022).

**Taquicardia paroxística supraventricular** (Raj 2022), a considerar si la taquicardia:
- no depende siempre de la postura;
- empieza y acaba de golpe;
- se corta con un Valsalva.

**El síncope**:
- Del 30 al 50 % de las personas con POTS se desmaya alguna vez (Fedorowski 2019). El POTS y el síncope vasovagal pueden coexistir (Sheldon 2015).
- **Rasgos de alto riesgo** (Brignole 2018, tabla 6, pp. 1897–1898). Cualquiera exige una valoración intensiva y temprana, y no se puede dar el alta desde urgencias (fig. 6, p. 1899):
  - **Mayores** en el episodio:
    - dolor torácico, disnea, dolor abdominal o cefalea nuevos;
    - **síncope durante el esfuerzo o tumbado**;
    - **palpitaciones bruscas seguidas enseguida del síncope**.
  - **Mayores** en la historia: cardiopatía estructural o coronaria grave.
  - **Mayores** en la exploración:
    - TAS por debajo de 90 sin explicación;
    - signos de sangrado digestivo;
    - bradicardia persistente por debajo de 40 en vigilia, sin entrenamiento;
    - soplo sistólico no diagnosticado.
  - **Menores**, de alto riesgo solo con cardiopatía estructural o ECG alterado:
    - sin pródromos o con un pródromo de menos de 10 s;
    - antecedente familiar de muerte súbita a edad joven;
    - síncope sentado.
- **NICE CG109 (1.1.4.2)**: derivar con urgencia para una valoración cardiovascular revisada **en 24 h** si hay pérdida de conocimiento con cualquiera de estos:
  - alteración del ECG;
  - insuficiencia cardiaca;
  - **pérdida de conocimiento durante el esfuerzo**;
  - **antecedente familiar de muerte súbita cardiaca antes de los 40 o cardiopatía hereditaria**;
  - **disnea nueva o sin explicación**;
  - soplo cardiaco.
  
  Considerarlo también en mayores de 65 sin pródromos.
- **Síncope de esfuerzo**:
  - **durante** el ejercicio orienta a una causa cardiaca; **justo después**, casi siempre a un reflejo (Brignole 2018, p. 1911; NICE CG109, 1.3.2.1);
  - con síncope durante el ejercicio: ergometría urgente y no hacer ejercicio hasta la valoración (NICE CG109, 1.3.2.2; Brignole 2018, I, C; Fedorowski 2019, tabla 4).
- **Lo que orienta a benigno** (Brignole 2018, tablas 5 y 6):
  - un pródromo típico (calor, sudor, náuseas);
  - estar mucho rato de pie o en sitios calurosos o llenos de gente;
  - durante o después de comer;
  - al levantarse;
  - años de episodios iguales sin cardiopatía.
- **Mientras espera la valoración** (NICE CG109, 1.5.4.3): qué hacer si se repite, modificar la actividad (evitar el esfuerzo si procede) y no conducir.

**Ejercicio**:
- **Recomendación**:
  - Raj 2020, rec. 14 (fuerte, evidencia moderada): «entrenamiento físico, al menos al principio en posición semirreclinada, en todas las estrategias de tratamiento». Puede aliviar los síntomas, mejorar la calidad de vida y lograr la remisión en una parte de los pacientes;
  - Sheldon 2015: IIa, B-R.
- **Volumen y tiempos** (Raj 2020, p. 368):
  - al menos 4 días por semana, sesiones de al menos 30 min;
  - aeróbico con algo de fuerza de piernas;
  - remo, bicicleta reclinada o natación se toleran mejor que lo vertical;
  - algunos tardan **4–6 semanas** en notar mejoría.
  
  Vernino 2021 (tabla 2) añade que al principio se encuentran peor hasta 6 semanas.
- **Cómo progresar**:
  - en Fu 2010 y en George 2016 lo vertical (bicicleta normal, cinta, elíptica) se añade al final del 2.º mes o al principio del 3.º;
  - George 2016 da el programa mes a mes (tabla 2), por zonas de esfuerzo percibido (base, umbral, recuperación), con meses «previos» más cortos para quien no puede con el primero.
- **Adaptaciones con intolerancia ortostática** (Hakim 2017, p. 172, en el SEDh):
  - aeróbico con un componente de resistencia local en las piernas, como la bicicleta reclinada o la natación;
  - **mejor dinámico que isométrico**: el isométrico provoca maniobras de Valsalva que bajan la TA (Byers 2017 también desaconseja el isométrico, en el subtipo vascular);
  - mejor tumbado; el agua ayuda, pero una piscina demasiado caliente se tolera mal;
  - unos 30 min, 2–3 veces por semana, al 75 % de la FC máxima estimada, adaptado a la discapacidad;
  - no comer en la hora anterior;
  - terminar con una vuelta a la calma suave para evitar una caída brusca de la TA;
  - adaptar el ejercicio a la hipermovilidad, la inestabilidad y las lesiones.
- **Personalizar** según los síntomas, la capacidad y el malestar postesfuerzo (Sivakoti 2026, enunciado 16).
- **El fisioterapeuta** está en el equipo multidisciplinar (Raj 2020, p. 366). George 2016 pide implicar a los fisioterapeutas (ninguna fuente da la supervisión como recomendación).
- **Agravantes**:
  - la deshidratación, el calor, el alcohol y el ejercicio (Sheldon 2015);
  - las comidas (Vernino 2021; Hakim 2017);
  - el Valsalva al levantar peso o al defecar (Hakim 2017, p. 171);
  - levantarse de golpe, sobre todo por la mañana (Fedorowski 2019, tabla 5).
- **Lo que es médico** (Raj 2020, recs. 11–13 y 15–20; Brignole 2018; Vernino 2021): el agua, la sal, las prendas de compresión, retirar fármacos y los fármacos para el POTS.
- **Maniobras de contrapresión**: las recomiendan la ESC 2018 (IIa, en la hipotensión ortostática y el síncope reflejo con pródromo), Raj 2020 («cuando tiene síntomas») y Fedorowski 2019. La ESC las enseña en la unidad de síncope con biorretroalimentación.

**Pronóstico**:
- No se conoce mortalidad atribuible (Sheldon 2015; Raj 2020).
- Muchos mejoran con el tratamiento, pero la mayoría tiene síntomas crónicos con reagudizaciones (Vernino 2021).
- No hay datos de la historia natural en adultos (Raj 2022). La cifra del 50 % de recuperación es de adolescentes.

## Criterio de entrada de la Fase P: sí entra

1. **Cambia la seguridad**:
   - un desmayo que el paciente atribuye a «su POTS» puede ser cardiaco, y un POTS conocido no lo explica (Brignole 2018; NICE CG109);
   - la consulta de fisioterapia pone al paciente de pie, le hace esforzarse y le pauta ejercicio: un síncope durante el esfuerzo cambia lo que se puede hacer ese día.
2. **Cambia la interpretación**:
   - la poca tolerancia al esfuerzo, el cansancio, el dolor muscular y el empeoramiento tras el ejercicio pueden ser intolerancia ortostática y desacondicionamiento, no irritabilidad del tejido;
   - el mareo de pie que mejora tumbado no es mareo cervicogénico;
   - el ejercicio debe empezar semirreclinado.

**Es capa transversal**, como la hipermovilidad, no contenido regional como Tarlov.

## Principios (los mismos de la hipermovilidad)

1. **Capa transversal, no fase nueva**: tarjeta en la fase 1, sistema de la fase 2 que solo aparece si se activa, aviso en la 4b, recuadro en la 5 y aviso en la 6.
2. **El árbol CIF y el motor de puntuación no se tocan.**
3. **El fisio no diagnostica el POTS.** Nunca «POTS» ni «probable POTS» con la sospecha. El resultado se redacta como «aumento de la FC de X lpm al ponerse de pie, sin hipotensión ortostática: compatible con taquicardia ortostática → su médico de atención primaria».
4. **La seguridad no se recorta.** Las preguntas del síncope cardiaco nunca se pliegan, y en modo breve no hay embudo. Marcar la tarjeta nunca quita ni rebaja una `urgencia` de ningún sistema.
5. **Sin contenido clínico inventado.** Las preguntas y los textos de abajo son un borrador hasta tu revisión.

## Flujo propuesto

### Fase 1 — tarjeta «Disautonomía / POTS» (`#cardDisautonomia`)
- Va justo después de «Hipermovilidad», antes de Cronología.
- Estados: **No consta** (por defecto) · **Diagnosticada** · **Sospecha**. Un segundo toque desmarca.
- Con «Diagnosticada», **cuál** (decisión 2): POTS · Hipotensión ortostática · Otra o no lo sabe.
- La clase `body.disautonomia` muestra los elementos `.solo-ds`.
- No se pliega en modo breve.
- Un cambio vacía la 4b (`_invalidar4b()`) y repinta el cribado (`_repintarCribado()`).
- **Los signos vitales de la fase 1 no se tocan.** La prueba tiene sus propias medidas (decisión 4).

### Fase 2 — sistema «Disautonomía» (`SIS_DISAUTONOMIA`, `transversal_disautonomia`)
- Sistema común en `data/comun.js`, la misma instancia en las 7 regiones, con `soloDisautonomia: true`.
- Va tercero, después del posquirúrgico y de la hipermovilidad.
- Sin embudo en modo breve, y no cuenta como «sistema sin cribar».

**A. Banderas rojas del síncope** (con «Diagnosticada» y con «Sospecha»; `urgencia`, clase `.sq2-urg`, nunca se pliegan). Cada pregunta incluye el desmayo, porque las dos guías piden pérdida de conocimiento **más** el rasgo.

| id | Pregunta (borrador) | `urgencia` (borrador, decisión 3) | Fuente |
|---|---|---|---|
| `ds_u_esfuerzo` | ¿Se ha desmayado alguna vez **mientras** hacía un esfuerzo (no justo al pararlo)? | Síncope durante el esfuerzo: valoración médica urgente (en 24 h) y sin ejercicio hasta entonces. | Brignole 2018, tabla 6 y p. 1911; NICE CG109, 1.1.4.2 y 1.3.2.2 |
| `ds_u_tumbado` | ¿Se ha desmayado estando tumbado, o justo después de notar de golpe el corazón muy rápido? | Síncope tumbado o tras palpitaciones bruscas: valoración médica urgente (en 24 h). | Brignole 2018, tabla 6 (rasgos mayores) |
| `ds_u_corazon` | Si se ha desmayado: ¿tenía a la vez dolor en el pecho o falta de aire nuevos, o le han dicho que tiene un soplo, insuficiencia cardiaca u otra enfermedad del corazón? | Síncope con síntomas o enfermedad del corazón: valoración médica urgente (en 24 h). | Brignole 2018, tabla 6; NICE CG109, 1.1.4.2 |
| `ds_u_familia` | Si se ha desmayado: ¿algún familiar murió de forma súbita antes de los 40 años, o tiene una enfermedad del corazón hereditaria? | Síncope con antecedente familiar de muerte súbita o cardiopatía hereditaria: valoración cardiológica en 24 h. | NICE CG109, 1.1.4.2 (en la ESC 2018, rasgo menor: ver salvedades) |

**B. Derivación no urgente** (`derivacion`, el campo de Tarlov). Va a `dv[]` y no bloquea la fase 6:

| id | Pregunta (borrador) | `derivacion` (borrador) | Fuente |
|---|---|---|---|
| `ds_d_paroxistica` | ¿Le dan episodios en que el corazón se le dispara **de golpe** y se le para también de golpe, aunque esté sentado o tumbado, sin desmayarse? | Taquicardia de inicio y fin bruscos que no depende de la postura: valoración médica (descartar una taquicardia paroxística). | Raj 2022 |

**C. Sospecha: patrón de intolerancia ortostática** (solo con «Sospecha»). Un «sí» no es una bandera: como el cuestionario de la hipermovilidad, va en `state.disautonomia` y no en `sistemicoAnswers`.

| id | Pregunta (borrador) | Fuente |
|---|---|---|
| `io1` | Desde hace 3 meses o más, ¿estar de pie le da con frecuencia mareo o aturdimiento, palpitaciones, temblor, debilidad, visión borrosa o cansancio, y se le pasa al tumbarse? | Vernino 2021, §2; Raj 2020, §3.2.2; Raj 2022, recuadro 2 |
| `io2` | ¿Le empeora con el calor, después de comer, con el alcohol, al hacer fuerza o al levantarse de golpe? | Sheldon 2015; Hakim 2017, p. 171; Fedorowski 2019, tabla 5 |
| `io3` | ¿Toma algún fármaco que acelere el corazón (estimulantes, algunos antidepresivos), ha estado mucho tiempo en cama o ha perdido sangre o líquidos hace poco? | Raj 2020, tabla 5 y §6.1; Vernino 2021. Sirve para el diferencial («taquicardia postural de otra causa»); no suma a favor |

La anemia, el hipertiroidismo y el sangrado ya los pregunta cada región (sistemas endocrino y hematológico); el razonamiento de `io3` lo recuerda.

**D. Prueba de bipedestación activa**. Es un elemento nuevo, como la escala de Beighton, con el botón «Hacer la prueba de bipedestación».
- **Arriba, la preparación** como lista de casillas: tumbado al menos 5 min, habitación templada y vejiga vacía (Hakim 2017; Raj 2020).
- **Filas**:
  - «Tumbado», con FC y TAS/TAD;
  - «De pie» a los 1, 3, 5, 8 y 10 min, con FC, TAS/TAD y síntomas (sí/no).
- **Se calcula y nunca se guarda** (como el IMC):
  - la FC de referencia: la de tumbado, o 60 si es menor (Raj 2020);
  - el aumento de la FC en cada medida;
  - si hay 2 medidas seguidas por encima del corte después del primer minuto (30, o 40 de 12 a 19 años, según `state.edadPaciente`, con aviso si falta);
  - si hay hipotensión ortostática: TAS −20 o TAD −10 en los minutos 1–3, o TAS por debajo de 90.
- **Resultado**, una caja como la de Beighton:
  - **«Compatible con taquicardia ortostática»**: «Aumento de la FC de hasta X lpm al ponerse de pie, sin hipotensión ortostática. El POTS lo diagnostica el médico: exige síntomas de 3 meses o más y descartar otras causas. Derivación preferente a su médico de atención primaria» (Raj 2020, rec. 30).
  - **«Caída de la TA al ponerse de pie»**: «Hipotensión ortostática: no es un POTS. Valoración médica, con revisión de los fármacos» (Brignole 2018; NICE CG109, 1.5.4.2).
  - **«No llega al corte»**: «No descarta una disautonomía. Con una sospecha alta, repetir otro día, mejor por la mañana» (Sivakoti 2026; Raj 2022). Y «cuánto pesa» (Plash 2013).
  - **Solo la última medida supera el corte**: «Repite la medida 1 min después» (Raj 2020).
  - **FC tumbado por encima de 100**: «comentarlo con su médico: taquicardia sinusal inapropiada u otra causa» (Raj 2020; Raj 2022).
  - **TAS por debajo de 90 en reposo**: «TAS por debajo de 90: si se ha desmayado, es un rasgo de alto riesgo (Brignole 2018, tabla 6)».
- **Seguridad durante la prueba** (nota fija):
  - quedarse al lado;
  - si aparece un presíncope, sentarlo o tumbarlo y parar; las medidas que falten no cuentan.
  
  Redacción propia: ninguna fuente leída dice cómo interrumpir la prueba.

Cada pregunta y la prueba llevan su `razonamiento` (Fase F) con las fuentes del registro.

### Fase 3 — SINSS
- La lógica no cambia.
- Una línea `.solo-ds` bajo «Tolerancia al estrés físico»: «Con intolerancia ortostática, separa lo que limita estar de pie (mareo, palpitaciones) de lo que limita la carga del tejido; la matriz mide lo segundo.»
- La debilidad, el dolor muscular y la intolerancia al esfuerzo forman parte del cuadro (Fedorowski 2019, tabla 2; Raj 2020, tabla 1).

### Fase 4 — árbol CIF
- Navegación, opciones y snapshot sin cambios.
- Opcional (decisión 7): una frase `.solo-ds` en `ce_step4b` (mareo, cervical): «El mareo al ponerse de pie que mejora al tumbarse orienta a intolerancia ortostática, no a mareo cervicogénico» (Raj 2022; Raj 2020).

### Fase 4b — una línea general, sin tocar las LR
Con la tarjeta activa, una línea sobre las hipótesis (decisión 6): «Disautonomía: haz en decúbito o sentado lo que la técnica permita, evita mantener una contracción isométrica o un Valsalva prolongado y, si aparece mareo de pie, vuelve a tumbarlo antes de seguir» (Hakim 2017, pp. 171–172). Es una regla de técnica, sin nada sobre la precisión de los tests.

### Fase 5 — recuadro «Disautonomía» (`.ds-fase5`, nunca se pliega)
Al principio, junto a «Paciente posquirúrgico» e «Hipermovilidad». Cada línea va pegada a su fuente:
- Estado (y cuál, si está diagnosticada) y el resultado de la prueba, si se hizo.
- **Siempre (ejercicio)**: «Ejercicio regular, al principio semirreclinado (remo, bicicleta reclinada, natación) y lo vertical poco a poco; al menos 4 días por semana, sesiones de al menos 30 min (Raj 2020, rec. 14). La mejoría puede tardar 4–6 semanas y al principio puede encontrarse peor (Raj 2020; Vernino 2021).»
- **Siempre (seguridad)**: «Un desmayo durante el esfuerzo, tumbado, tras palpitaciones bruscas o con síntomas del corazón no lo explica la disautonomía: valoración médica urgente (Brignole 2018; NICE CG109).»
- **Con «Sospecha» y la prueba compatible**: «Derivación preferente a su médico de atención primaria para confirmar el diagnóstico y descartar otras causas (Raj 2020, rec. 30).»
- **Con la caída de la TA**: la línea de la hipotensión ortostática.
- **Lo médico**: «El agua, la sal, la compresión y los fármacos los indica el médico» (decisión 8).

### Fase 6 — plan de tratamiento
- **Aviso `disautonomia`** en todas las regiones, como `AVISOS_POSQ_PERIFERICA`, con las adaptaciones de Hakim 2017 (p. 172) y Raj 2020 (rec. 14):
  - empezar semirreclinado, tumbado o en el agua (no muy caliente), y añadir lo vertical poco a poco;
  - mejor dinámico que isométrico;
  - no comer en la hora anterior;
  - terminar con una vuelta a la calma suave;
  - no estar mucho rato de pie quieto en la sesión;
  - con hipermovilidad, adaptarlo también a la inestabilidad.
- **Red de seguridad propia** (`RED_SEGURIDAD`, con cualquier plan y la tarjeta activa), para el cierre de la sesión y el programa para casa: «Si se desmaya mientras hace ejercicio, pare y no vuelva a hacer ejercicio hasta que le vea el médico» (NICE CG109, 1.3.2.2 y 1.5.4.3; Brignole 2018, p. 1911).
- **No cambian** el nivel A/B/C, la frecuencia ni la irritabilidad. El programa de George 2016 no se copia como pauta: es de 3 meses, con sal y agua añadidas y con un 59 % de abandonos.
- Con un SÍ urgente del sistema, la fase 6 se bloquea como con cualquier urgencia. `ds_d_paroxistica` no la bloquea.

## Relación con la hipermovilidad (decisión 5)

**Recomendación: ninguna regla automática**, como en Tarlov. Ni activar la otra tarjeta ni darle peso. Ninguna fuente pide cribar una condición en la otra:
- **Miller 2020**: 31 % de SEDh con los criterios de 2017, en un congreso de pacientes, sin control y con el POTS autodeclarado. Sus autores no conocen ningún mecanismo que los una.
- **Vernino 2021, Raj 2022 y Raj 2020 (tabla 4)**: 20–30 % (25 % en la tabla de Raj 2020), con evidencia «débil». En la otra dirección, intolerancia ortostática y taquicardia en hasta el 40 % de personas con TEH o SEDh.
- **Hakim 2017**: no hay ningún estudio de cohortes de la disfunción autonómica en el SEDh, la relación causal no está clara y la evidencia es de nivel IV (p. 169).
- **Raj 2020**: con un SEDh, el POTS es un «POTS plus» y puede tener otro pronóstico (p. 358).
- **Sivakoti 2026**: el POTS puede ser primario o asociado al SEDh (enunciado 7).

**Lo que sí se propone, sin lógica:**
- El razonamiento de `io1` lleva estas cifras con sus límites.
- La exploración del POTS incluye valorar la hipermovilidad (Raj 2022; Vernino 2021, §12): una frase con «mira la tarjeta Hipermovilidad».
- Con las dos tarjetas activas, el aviso de la fase 6 añade «adaptarlo a la hipermovilidad y la inestabilidad» (Hakim 2017).
- La línea fija de la hipermovilidad («Si hay disautonomía… derivar al especialista») no se toca, porque physiq-report la copia literal.

## Seguridad: qué separa el POTS de lo que exige derivar

| Cuadro | Lo que lo sugiere | Qué hace la app |
|---|---|---|
| **Síncope cardiaco** | Síncope durante el esfuerzo o tumbado; palpitaciones bruscas y síncope; dolor torácico o disnea nuevos; cardiopatía; soplo; antecedente familiar de muerte súbita (Brignole 2018, tablas 5–6; NICE CG109) | `urgencia`: valoración médica urgente (24 h) |
| **Taquicardia paroxística** | Inicio y fin bruscos, no postural, se corta con un Valsalva (Raj 2022) | `derivacion`, no urgente |
| **Hipotensión ortostática** | TAS −20 o TAD −10 en 3 min, o TAS por debajo de 90 (Brignole 2018; Raj 2020) | Resultado de la prueba: valoración médica |
| **Hipovolemia, anemia, sangrado** | Sangrado, deshidratación, palidez (Raj 2020, tabla 5) | Ya lo preguntan los sistemas hematológico y endocrino; `io3` |
| **Taquicardia sinusal inapropiada** | FC en reposo por encima de 100 (Raj 2020) | Línea en el resultado de la prueba |
| **Taquicardia postural de otra causa** | Fármacos, reposo en cama, hipovolemia (Raj 2020) | `io3` y el texto del resultado |
| **POTS** | Síntomas de pie de 3 meses o más que mejoran tumbado, aumento de ≥30 lpm mantenido sin hipotensión, sin otra causa | Sospecha → su médico de atención primaria |

**Garantías**, cada una con su prueba unitaria:
1. **Nada de la capa quita ni rebaja una `urgencia`.** La tarjeta solo añade un sistema. Para las mismas respuestas, `ur[]`, las clases `.sq2-urg` y las banderas de los demás sistemas salen iguales con la tarjeta o sin ella.
2. **Un POTS conocido no explica un síncope de alto riesgo.** Lo dicen el razonamiento de las cuatro preguntas urgentes y la línea fija de la fase 5, como el «un quiste conocido no explica un cambio nuevo» de Tarlov. La ESC lo apoya: la mera presencia de una enfermedad no implica que el síncope venga de ella (p. 1925).
3. **Las preguntas urgentes salen con «Diagnosticada» y con «Sospecha».**
4. **Las banderas de síncope de cervical y hombro no cambian.** «Síncope repentino sin mareo previo» (Goodman 2018) sigue igual.
5. **Fuera de esta capa** (decisión 9): el síncope de alto riesgo solo se pregunta si el fisio marca la tarjeta. Ninguna región tiene hoy una pregunta de síncope; es un hueco previo que se apunta en vez de taparlo aquí.

## Salidas

- **Payload `ds`**, solo con la tarjeta activa, así que la huella de los informes con IA anteriores no cambia: `{ es, ti, pb, dfc, ho, ot, cs }`.
  - `es` estado; `ti` cuál (si está diagnosticada);
  - `pb` si se hizo la prueba; `dfc` el aumento de FC mantenido máximo;
  - `ho` hipotensión ortostática; `ot` compatible con taquicardia ortostática (true/false/null);
  - `cs` los «sí» de la sospecha.
  
  Las cifras de cada minuto van solo al prompt de la IA (decisión 10). Las urgencias van a `ur[]` y la derivación a `dv[]`, como siempre.
- **📋 Notas**: «🫀 DISAUTONOMÍA: sospecha · bipedestación: +34 lpm mantenidos, sin hipotensión ortostática · compatible con taquicardia ortostática → su médico».
- **📄 Informe**:
  - con «Diagnosticada», en antecedentes: «Síndrome de taquicardia postural ortostática (diagnosticado)» o «Hipotensión ortostática (diagnosticada)»;
  - con «Sospecha» y la prueba compatible: «Aumento de la frecuencia cardiaca al ponerse de pie: se recomienda valoración médica», **sin la palabra POTS**.
- **Informe con IA**: bloque «Disautonomía» (`bloqueDsIA()`) en `contextoValoracion()`, sin citas, y con la sospecha: «no escribas que el paciente tiene un POTS». `lib/reglas-informe.js` no se toca.
- **physiq-report**: copia literal `_bloqueDs()` en su `lib/payload.js` y un test en cada repositorio fija el mismo texto, como `_bloqueHM`. Va en otra PR, después de esta.
- **Modo breve**: con «Sospecha», la prueba sin hacer es un pendiente (`ancla: 'cardDisautonomia'`). Las urgencias siempre se ven.

## Decisiones (aceptadas por el usuario, octubre 2026: las 12 recomendaciones)

1. **¿Entra, y como capa transversal con documento propio?** *Recomiendo sí a las dos.*
2. **Tarjeta propia** con POTS · Hipotensión ortostática · Otra o no lo sabe. *Recomiendo tarjeta propia*, separada de la de hipermovilidad.
3. **Las cuatro preguntas del síncope con `urgencia`**, con el mensaje «valoración médica urgente (en 24 h)». En la app salen como «Derivación urgente hoy».
   - *Recomiendo `urgencia`*: la ESC pide no dar el alta y valorar pronto a quien tiene un rasgo de alto riesgo, y NICE pide revisión en 24 h.
   - *Recomiendo seguir a NICE con el antecedente familiar* (urgencia), aunque la ESC lo considere menor sin cardiopatía ni ECG alterado, que el fisio no puede comprobar.
4. **Prueba de bipedestación con sus propias medidas.** *Recomiendo*:
   - el reposo y las 2 medidas seguidas de Raj 2020, los minutos de Raj 2022 y la preparación de Hakim 2017;
   - la FC de referencia de 60;
   - la hipotensión con los criterios de la ESC (incluida la TAS por debajo de 90);
   - **sin** el criterio de «FC por encima de 120» que Raj 2020 retiró;
   - sin cronómetro en el piloto y sin rellenar nada desde los signos vitales de la fase 1.
5. **Hipermovilidad**: *recomiendo ninguna regla automática*. Solo el texto del razonamiento y, con las dos tarjetas activas, la adaptación del aviso de la fase 6.
6. **Fase 4b**: *recomiendo una línea general de técnica*, sin campo por test y sin tocar las LR.
7. **Frase en `ce_step4b`**: *recomiendo sí*, como texto `.solo-ds` sin tocar opciones ni navegación.
8. **Agua, sal y compresión**: *recomiendo no pautarlas*, solo decir que las indica el médico. Las fuentes las dan como tratamiento médico, con dosis distintas (2–3 L y 8–12 g de sal según la fuente).
9. **El hueco del síncope fuera de la capa**: *recomiendo un trabajo aparte*, una pregunta de síncope en el sistema cardiovascular de cada región con su revisión región a región. Ahora sí hay fuentes leídas para hacerlo (Brignole 2018; NICE CG109).
10. **Payload `ds` y physiq-report**: *recomiendo* el campo compacto, las cifras de cada minuto solo en el prompt y la PR de physiq-report después.
11. **Maniobras de contrapresión** (cruzar las piernas, tensar los músculos, ponerse en cuclillas): *recomiendo nombrarlas solo en el razonamiento*, no en el plan. La ESC las enseña con biorretroalimentación en una unidad de síncope, y en el POTS solo hay recomendación como consejo (Raj 2020).
12. **Registro de referencias**: *recomiendo registrar*:
    - `Sheldon 2015`, `Vernino 2021`, `Raj 2022`, `Raj 2020`, `Brignole 2018`, `Sivakoti 2026`;
    - `Plash 2013`, `Fu 2010`, `George 2016`, `Miller 2020`, `Hakim 2017`, `Fedorowski 2019`;
    - `NICE CG109`.
    
    No registrar `Raj 2021` (Part 2), que no se usa.

## Cambios técnicos previstos

```js
disautonomia: {
  estado: '',          // '' (no consta) | 'diagnosticada' | 'sospecha'
  tipo: '',            // '' | 'pots' | 'ho' | 'otra'
  sospecha: {},        // { io1, io2, io3: 'SI' | 'NO' }
  bipedestacion: null, // null = sin hacer | { prep: {...}, tumbado: { fc, tas, tad }, m1, m3, m5, m8, m10: { fc, tas, tad, sintomas } }
}
```

- `lib/disautonomia.js`, funciones puras con pruebas unitarias:
  - visibilidad por estado;
  - corte por edad;
  - FC de referencia (mínimo 60);
  - «2 medidas seguidas después del primer minuto»;
  - hipotensión (−20/−10 en los minutos 1–3, o TAS por debajo de 90);
  - FC en reposo por encima de 100;
  - resultado;
  - payload `ds`;
  - textos de 📋 Notas, 📄 Informe e IA.
- `SIS_DISAUTONOMIA` en `data/comun.js` en las 7 regiones; `sistemasActivos()` lo filtra con `soloDisautonomia`.
- El elemento de la prueba en la fase 2, pintado dos veces (panel y acordeón) como `[data-hm-bloque]`.
- `AVISOS_DISAUTONOMIA` y la red de seguridad en `data/plan-tratamiento.js`; después, `node tests/gen-frases-plan.mjs`.
- Las 13 referencias en `data/referencias.js`; después, `node tests/gen-referencias.mjs`.
- `_softResetApp()`, la restauración de sesión (`normalizarDisautonomia()`), exportar e importar, y `deploy-to-hub.yml` para `lib/disautonomia.js`.
- Pruebas unitarias:
  - nada sin la tarjeta;
  - las garantías 1 y 3;
  - las 4 urgencias con `.sq2-urg`;
  - `ds` en el payload;
  - la prueba: cortes por edad, FC de referencia, 2 medidas seguidas, la última sola, la hipotensión con sus tres criterios y los datos que faltan;
  - nada de la fase 6 en el payload;
  - el aviso de la 4b nunca en los resúmenes;
  - el pendiente del modo breve.
- Prueba de humo, sección `disautonomia`:
  - la tarjeta, el sistema y las urgencias;
  - la prueba con un caso compatible, uno con hipotensión, uno por debajo del corte y uno con FC en reposo de 55;
  - el recuadro de la fase 5 y el aviso de la fase 6;
  - 320 px y el hub.
  
  La completa, antes de `main`.

## Implementación (octubre 2026)

Hecho según las 12 recomendaciones, con estas concreciones:

- **Datos** (`data/comun.js`, `SIS_DISAUTONOMIA`):
  - las 5 preguntas con su razonamiento y sus banderas enlazadas (Fase M);
  - en `disautonomia`, el patrón de sospecha, el protocolo de la prueba y los textos con sus citas.
  
  Es el tercer sistema de las 7 regiones. Las 13 referencias, en `data/referencias.js` (sin `Raj 2021`).
- **Lógica pura** (`lib/disautonomia.js`, `resultadoPrueba()`):
  - la FC de referencia es la de tumbado, o 60 si es menor;
  - el corte es de 30 lpm, o de 40 entre los 12 y los 19 años; por debajo de 12 no se interpreta;
  - «2 medidas seguidas» se mira en los minutos 3, 5, 8 y 10, sin el primer minuto. Si solo supera el corte la última, el resultado es «repetir»;
  - la hipotensión ortostática cuenta a partir del minuto 3 (TAS −20, TAD −10 o TAS por debajo de 90) y manda sobre el aumento de la FC;
  - sin edad, la prueba no se interpreta, como la escala de Beighton.
- **La prueba en la pantalla**:
  - las cifras se escriben sin repintar el bloque, para no perder el foco;
  - se copian a la otra copia del sistema (panel o acordeón) y solo se repinta el resultado.
- **Payload `ds`**: `{ es, ti, pb, dfc, ho, ot, cs }`, solo con la tarjeta activa. `ho` y `ot` valen `null` mientras la prueba no tenga un resultado concluyente (sin hacer, a medias, sin edad o «repetir»).
- **Lo que no se dice**:
  - el 📄 Informe nunca escribe «POTS» con la sospecha: usa el bloque «RESPUESTA AL PONERSE DE PIE»;
  - con «hipotensión ortostática» diagnosticada no sale la pauta de ejercicio del POTS, pero sí las adaptaciones de Hakim 2017.
- **Fase 6**: el aviso cita Fu 2010 y George 2016 para el paso a lo vertical («hacia el final del 2.º mes»). Con las dos tarjetas activas sale además la adaptación a la hipermovilidad.
- **Fase 4**: la nota de `ce_step4b` sale al pintar el paso. Si se marca la tarjeta con el árbol ya respondido, no aparece hasta que el paso se vuelve a pintar.
- **Pruebas**:
  - unitarias en `tests/unit/disautonomia.mjs`; entre ellas, que marcar la tarjeta no cambia las urgencias ni el pintado de ningún otro sistema en las 7 regiones;
  - el inventario de banderas de los sistemas compartidos (`tests/unit/razonamiento.mjs`);
  - la sección `disautonomia` de la prueba de humo, que pasó, igual que la prueba completa.
- **physiq-report**: pendiente, en otra PR. Copiar `bloqueDsIA()` como `_bloqueDs()` en su `lib/payload.js`, con los casos de `DS_CASOS` (`tests/unit/disautonomia.mjs`) fijados en su test.

## Decisión 9: pregunta de síncope en cada región (octubre 2026)

Hecho. Antes, a quien no tenía marcada la tarjeta nadie le preguntaba por el síncope de alto riesgo.

- **La pregunta** es `PREGUNTA_SINCOPE` (`sx_sincope`, `data/comun.js`): «Si se ha desmayado alguna vez: ¿fue mientras hacía un esfuerzo, estando tumbado, justo después de notar de golpe el corazón muy rápido, o con dolor en el pecho o falta de aire nuevos? ¿O algún familiar suyo murió de forma súbita antes de los 40 años?».
  - Reúne en una sola pregunta los rasgos de alto riesgo de Brignole 2018 (tabla 6) y de NICE CG109 (1.1.4.2).
  - Lleva `urgencia` («valoración médica urgente (en 24 h) y sin ejercicio hasta entonces»), así que nunca se pliega en modo breve.
  - Su razonamiento cita Brignole 2018, NICE CG109 y Sheldon 2015, y remite a la tarjeta «Disautonomía / POTS».
- **Dónde va**: la misma instancia, al final del sistema vascular o cardiovascular de cada región (`l_vascular`, `cv_cardio`, `h_cardio`, `co_vascular`, `ca_vascular`, `ro_vascular`, `tp_vascular`).
- **Sin anatomía**: se trata como las preguntas compartidas, que no llevan enlace a Kenhub para no salir igual en todas las regiones.
- **Convive con las 4 preguntas detalladas** del sistema de disautonomía. No se oculta al marcar la tarjeta: si se ocultara, un SÍ ya marcado desaparecería de `ur`.
- **Las banderas «Síncope repentino sin mareo previo»** de cervical y hombro (Goodman 2018) siguen con su razonamiento propio. Hablan del síncope sin pródromos, que la pregunta no recoge entero (en la ESC es un rasgo menor).

## Reloj de la prueba de bipedestación (octubre 2026)

Hecho a propuesta del usuario. Antes, el fisio llevaba los tiempos con otro reloj mientras estaba de pie al lado del paciente. Las medidas solo valen en su minuto: el criterio exige 2 medidas seguidas después del primer minuto (Raj 2020, rec. 4).

- **Dónde**: dentro de la prueba, entre la nota de seguridad y la tabla (`[data-ds-reloj]`, en las dos copias del bloque, panel y acordeón).
- **Dos tramos, cada uno con su botón**:
  - «Empezar reposo tumbado (5 min)»: cuenta los 5 minutos de la casilla de preparación y, al cumplirse, avisa de que toca la medida tumbado.
  - «Se pone de pie»: pone el reloj a 0:00, dice cuál es la siguiente medida y cuánto falta, y avisa en los minutos 1, 3, 5, 8 y 10. Al minuto 11 la prueba queda terminada y el reloj se para solo.
- **Aviso en cada marca**: la fila que toca se resalta (etiqueta y casillas, en las dos copias), la pantalla baja hasta ella si no se ve, un pitido corto y una vibración donde la haya (en iPhone no hay vibración desde una web). El pitido solo funciona porque lo arranca el toque en el botón. Cada marca avisa una sola vez, y las ya pasadas no vuelven a sonar al recargar.
- **«toma a las 3:40»**: si la primera FC de una fila se escribe a más de 30 s de su minuto, lo indica junto a la fila. No bloquea nada.
- **«Parar»** (y «Cerrar el reloj» al terminar): quita el reloj y deja las cifras. Encaja con la nota de seguridad: si hay que sentar o tumbar al paciente, las medidas que faltan no cuentan.
- **Nunca rellena ni cierra filas**: el fisio decide qué anota.
- **Técnica**:
  - El tiempo se calcula desde la hora en que se pulsó (`reloj.inicio`), no contando segundos. Una pantalla apagada o la app en segundo plano no lo desajustan.
  - Mientras corre, la pantalla se mantiene encendida (wake lock, como al generar el informe con IA).
  - Cada segundo solo cambian los textos; los botones se sustituyen solo al cambiar de tramo, para que un toque en «Parar» no se pierda.
  - Un reloj de hace más de 30 minutos ya no es de esta prueba y no se muestra.
- **Datos**: `bipedestacion.reloj = { fase, inicio, tomas }`, guardado con la sesión. Nunca va al payload, ni a 📋 Notas o 📄 Informe, ni a las cifras del informe con IA. No sale al imprimir.
- **Código y pruebas**: `estadoReloj()`, `tomaFueraDeTiempo()` y `RELOJ` en `lib/disautonomia.js`; la interfaz es `dsRelojEmpezar()` / `dsRelojParar()` en `app.js`. Hay pruebas unitarias («reloj: …» en `tests/unit/disautonomia.mjs`) y la sección `ds-reloj` de la prueba de humo (reloj del navegador simulado).

## Siguiente paso

Ninguno pendiente del POTS. physiq-report ya lee `ds` (physiq-report#92): `_bloqueDs()` es una copia literal de `bloqueDsIA()` sin citas, y `DS_CASOS` fija el mismo texto en un test en cada repositorio.
