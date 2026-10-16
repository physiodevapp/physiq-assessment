# POTS (síndrome de taquicardia postural ortostática) y disautonomía — diseño

Estado: **propuesta (octubre 2026), pendiente del visto bueno del usuario. No hay código.**

Es la tercera condición especial de la Fase P (`MIGRATION_PLAN.md`), después de la hipermovilidad / Ehlers-Danlos (`docs/hipermovilidad.md`) y del quiste de Tarlov (`docs/tarlov.md`).

**Por qué un documento propio y no una sección de `docs/hipermovilidad.md`:**
- El POTS no es una variante de la hipermovilidad. Las fuentes hablan de una asociación, no de una causa:
  - en las consultas de POTS, entre el 20 y el 30 % cumple los criterios del SEDh o del TEH (Vernino 2021, §4; Raj 2022);
  - el 70–80 % restante no tiene hipermovilidad.
- Tiene su propia tarjeta, sus propias fuentes y su propio riesgo: el síncope cardiaco. Meterlo en la tarjeta de hipermovilidad haría que una de las dos condiciones activase la otra, que es justo lo que este diseño propone no hacer (decisión 5).
- `docs/hipermovilidad.md` lo dejó fuera del piloto (su decisión 4) y solo enlazará aquí.

## Lectura de las fuentes

### Leídas enteras en esta sesión (en abierto)

| Clave propuesta | Referencia | Cómo se leyó | Qué aporta |
|---|---|---|---|
| `Sheldon 2015` | Sheldon RS, Grubb BP, Olshansky B, et al. 2015 Heart Rhythm Society expert consensus statement on the diagnosis and treatment of postural tachycardia syndrome, inappropriate sinus tachycardia, and vasovagal syncope. *Heart Rhythm* 2015;12(6):e41–e63. [doi:10.1016/j.hrthm.2015.03.029](https://doi.org/10.1016/j.hrthm.2015.03.029) | PMC5267948 | Definición, estudio inicial, ejercicio (IIa, B-R), agravantes, pronóstico, síncope de esfuerzo |
| `Vernino 2021` | Vernino S, Bourne KM, Stiles LE, et al. Postural orthostatic tachycardia syndrome (POTS): State of the science and clinical care from a 2019 National Institutes of Health Expert Consensus Meeting – Part 1. *Auton Neurosci* 2021;235:102828. [doi:10.1016/j.autneu.2021.102828](https://doi.org/10.1016/j.autneu.2021.102828) | PMC8455420 | Criterios con duración ≥3 meses y exclusiones, comorbilidades (tabla 1), ejercicio (tabla 2), historia natural |
| `Raj 2021` | Raj SR, Bourne KM, Stiles LE, et al. Postural orthostatic tachycardia syndrome (POTS): Priorities for POTS care and research from a 2019 National Institutes of Health Expert Consensus Meeting – Part 2. *Auton Neurosci* 2021;235:102836. [doi:10.1016/j.autneu.2021.102836](https://doi.org/10.1016/j.autneu.2021.102836) | PMC8455430 | Contexto: pocos ensayos, la gravedad de los síntomas casi no se relaciona con la taquicardia. Aporta poco al diseño; **propongo no registrarla** |
| `Raj 2022` | Raj SR, Fedorowski A, Sheldon RS. Diagnosis and management of postural orthostatic tachycardia syndrome. *CMAJ* 2022;194(10):E378–E385. [doi:10.1503/cmaj.211373](https://doi.org/10.1503/cmaj.211373) | PMC8920526 | **La prueba de bipedestación activa paso a paso**, criterios (recuadro 2), diagnóstico diferencial (recuadro 3), taquicardia paroxística, ejercicio, atención primaria |
| `Plash 2013` | Plash WB, Diedrich A, Biaggioni I, et al. Diagnosing postural tachycardia syndrome: comparison of tilt testing compared with standing haemodynamics. *Clin Sci* 2013;124(2):109–114. [doi:10.1042/CS20120276](https://doi.org/10.1042/CS20120276) | PMC3478101 | Precisión de la bipedestación de 10 min con el corte de 30 lpm |
| `Fu 2010` | Fu Q, VanGundy TB, Galbreath MM, et al. Cardiac origins of the postural orthostatic tachycardia syndrome. *J Am Coll Cardiol* 2010;55(25):2858–2868. [doi:10.1016/j.jacc.2010.02.043](https://doi.org/10.1016/j.jacc.2010.02.043) | PMC2914315 | El programa de entrenamiento: tumbado o sentado primero y de pie en el 2.º–3.er mes |
| `Miller 2020` | Miller AJ, Stiles LE, Sheehan T, et al. Prevalence of hypermobile Ehlers-Danlos syndrome in postural orthostatic tachycardia syndrome. *Auton Neurosci* 2020;224:102637. [doi:10.1016/j.autneu.2020.102637](https://doi.org/10.1016/j.autneu.2020.102637) | PMC7282488 | La asociación con el SEDh, medida con los criterios de 2017, y sus límites |
| `NICE CG109` | NICE. Transient loss of consciousness ('blackouts') in over 16s. Clinical guideline CG109, 2010 (actualizada en 2023). [nice.org.uk/guidance/cg109](https://www.nice.org.uk/guidance/cg109) | Capítulo «Recommendations» entero, en la web | **Las banderas rojas del síncope** (1.1.4.2), el síncope de esfuerzo (1.3.2.1–1.3.2.2), qué decir mientras espera (1.5.4.3) |

Salvedades de lectura:
- **Páginas**: el texto de PMC no trae paginación. Las citas irán por sección, recuadro o tabla, como en los artículos de StatPearls.
- **Tablas**: las de Vernino 2021 se leyeron del XML de PMC. De Fu 2010, Miller 2020 y Plash 2013 no llegaron las tablas, solo lo que el texto dice de ellas. No hace falta ninguna cifra que esté solo en una tabla.
- **Sheldon 2015**: la definición dice «al ponerse de pie más de 30 segundos». No da tiempo de reposo previo, ni minutos de medida, ni duración mínima de los síntomas. Eso lo dan Raj 2022 y Vernino 2021 (≥3 meses). Dos recomendaciones de clase I salen sin nivel de evidencia en PMC.
- **Raj 2022** no trae ninguna lista de banderas rojas ni habla del síncope cardiaco. La única pista es la taquicardia paroxística supraventricular, que hay que considerar si la taquicardia empieza y acaba de golpe, no depende de la postura o se corta con un Valsalva (sección «What other disorders…»). Las banderas rojas del síncope salen de NICE CG109.
- **Plash 2013** es pequeño (15 pacientes y 15 controles), retrospectivo y con el paciente tumbado desde la noche anterior, que no es la práctica habitual.
- **Fu 2010** no tiene grupo control en la parte del entrenamiento. Además, a los pacientes se les animó a tomar más sal y agua y a elevar el cabecero de la cama, así que la mejora no se puede atribuir solo al ejercicio (sus propios autores lo dicen).
- **Miller 2020** reclutó en un congreso de pacientes, se fio del diagnóstico de POTS que traía cada uno y no tiene grupo control (ver «Relación con la hipermovilidad»).

### Que no están en abierto: necesito el PDF

No las cito hasta leerlas enteras. Por orden de importancia:

| Prioridad | Referencia | Para qué | Por qué la pido |
|---|---|---|---|
| **1 (imprescindible)** | Brignole M, Moya A, de Lange FJ, et al. 2018 ESC Guidelines for the diagnosis and management of syncope. *Eur Heart J* 2018;39(21):1883–1948. [doi:10.1093/eurheartj/ehy037](https://doi.org/10.1093/eurheartj/ehy037). Vale igual la versión en español: Guía ESC 2018 sobre el diagnóstico y tratamiento del síncope, *Rev Esp Cardiol* 2018;71(10):837.e1–e92 | Los rasgos de alto riesgo del síncope (en decúbito, palpitaciones antes del síncope, cardiopatía estructural), la bipedestación activa y la hipotensión ortostática | La tiene gratis la editorial, pero el proxy de la sesión bloquea la web de la ESC, la de OUP y la de la *Revista Española de Cardiología*. Sheldon 2015 remite a ella para todo el síncope |
| **2** | Hakim A, O'Callaghan C, De Wandele I, et al. Cardiovascular autonomic dysfunction in Ehlers-Danlos syndrome — hypermobile type. *Am J Med Genet C* 2017;175(1):168–174. [doi:10.1002/ajmg.c.31543](https://doi.org/10.1002/ajmg.c.31543) | La relación con el SEDh desde el lado de la hipermovilidad | Es del mismo número que Malfait, Byers y Engelbert 2017, que ya me pasaste |
| **3** | Raj SR, Guzman JC, Harvey P, et al. Canadian Cardiovascular Society position statement on POTS and related disorders of chronic orthostatic intolerance. *Can J Cardiol* 2020;36(3):357–372. [doi:10.1016/j.cjca.2019.12.024](https://doi.org/10.1016/j.cjca.2019.12.024) | Única con método GRADE. Raj 2022 sale de ella: la FC mínima en decúbito de 60 lpm y la nomenclatura | Raj 2022 la resume, pero no quiero citar sus recomendaciones de segunda mano |
| **4** | Sivakoti K, Cortez MM, Fedorowski A, et al. Postural orthostatic tachycardia syndrome (POTS) and dysautonomia: international multidisciplinary expert consensus. *Am J Med* 2026 (en prensa, agosto de 2026). [doi:10.1016/j.amjmed.2026.08.012](https://doi.org/10.1016/j.amjmed.2026.08.012) | Lo más reciente (Delphi, 31 enunciados). Según su resumen, trata la «disautonomía no POTS» de quien no llega a los 30 lpm | Para comprobar que no cambia los criterios antes de fijarlos en la app |
| 5 (opcional) | George SA, Bivens TB, Howden EJ, et al. The international POTS registry: evaluating the efficacy of an exercise training intervention in a community setting. *Heart Rhythm* 2016;13(4):943–950. [doi:10.1016/j.hrthm.2015.12.012](https://doi.org/10.1016/j.hrthm.2015.12.012) | El programa de Fu 2010 aplicado fuera del laboratorio (251 pacientes) | Solo he leído el resumen; con Fu 2010 y la tabla 2 de Vernino 2021 basta |
| 6 (opcional) | Freeman R, et al. Consensus statement on the definition of orthostatic hypotension, neurally mediated syncope and the postural tachycardia syndrome. *Clin Auton Res* 2011;21:69–72. [doi:10.1007/s10286-011-0119-5](https://doi.org/10.1007/s10286-011-0119-5) | La definición original de la hipotensión ortostática (≥20/10 mmHg a los 3 min) | Vernino 2021 y Raj 2022 ya dan los cortes |
| 7 (opcional) | Fedorowski A. Postural orthostatic tachycardia syndrome: clinical presentation, aetiology and management. *J Intern Med* 2019;285(4):352–366. [doi:10.1111/joim.12852](https://doi.org/10.1111/joim.12852) | Revisión; su resumen dice que «alrededor del 50 % se recupera solo en 1–3 años» | Solo leído el resumen; no se usa esa cifra sin leerla |

**Goodman 2018** (lo tienes): ¿trata el POTS o la hipotensión ortostática en algún sitio además del cap. 6, pp. 227 y 261, que ya citan las banderas de síncope de cervical y hombro? Si es así, dime las páginas.

## Lo que dicen las fuentes leídas (lo que usa el diseño)

**Definición** (Vernino 2021, §2; Raj 2022, recuadro 2; Sheldon 2015, sección 1). Tienen que cumplirse todos estos criterios:
- **FC**: sube de forma mantenida ≥30 lpm en los 10 min de bipedestación, o ≥40 lpm entre los 12 y los 19 años. Por debajo de los 12 años el POTS no está definido (Vernino 2021, §11).
- **Sin hipotensión ortostática**: la TAS no cae de forma mantenida 20 mmHg o más. Una hipotensión ortostática inicial, que se resuelve en los primeros 45 segundos de pie, no excluye el POTS (Raj 2022).
- **Intolerancia ortostática frecuente**: síntomas de pie que mejoran rápido al tumbarse. Aturdimiento, palpitaciones, temblor, debilidad generalizada, visión borrosa y cansancio.
- **Duración**: síntomas durante al menos 3 meses (Vernino 2021; Raj 2022). Sheldon 2015 no da una duración.
- **Sin otra causa de taquicardia sinusal**:
  - anemia o pérdida de sangre, deshidratación, fiebre, infección, dolor;
  - hipertiroidismo, feocromocitoma u otras endocrinopatías;
  - ansiedad primaria o pánico, hiperventilación, anorexia nerviosa;
  - fármacos que suben la FC (estimulantes, diuréticos, inhibidores de la recaptación de noradrenalina, anticolinérgicos) y drogas;
  - reposo prolongado en cama (Vernino 2021; Raj 2022, recuadro 3).
- La taquicardia de pie suele ser mayor por la mañana que por la tarde (Sheldon 2015; Raj 2022).

**La prueba de bipedestación activa** (Raj 2022, «How should patients be evaluated…»):
- Tumbado de 5 a 10 min, para que se equilibren los líquidos. Se mide la FC y la TA.
- Después, de pie, se mide la FC y la TA a los 1, 3, 5, 8 y 10 min, anotando los síntomas.
- **Positiva**: la FC sube ≥30 lpm (≥40 entre los 12 y los 19 años) en al menos 2 de las medidas de pie, y la TAS no cae más de 20 mmHg.
- Por la mañana es más sensible. Si la sospecha es alta y no llega al corte, se repite otro día, mejor por la mañana.
- La Canadian Cardiovascular Society pide además una FC mínima de 60 lpm tumbado (citada por Raj 2022; ver la prioridad 3).
- No hace falta mesa basculante: una bipedestación de 10 min suele bastar (Vernino 2021, §12).

**Cuánto pesa la prueba** (Plash 2013): con el corte de 30 lpm, la bipedestación de 10 min tuvo:
- una sensibilidad del 87 % y una especificidad del 67 %;
- es decir, uno de cada tres controles sanos superó el corte.

Los propios autores concluyen que el POTS es un diagnóstico clínico, que exige los síntomas y no solo la cifra.

**Lo que el fisio no puede descartar solo**: el estudio mínimo es médico. Incluye historia, exploración con los signos vitales ortostáticos, ECG de 12 derivaciones, analítica (hemograma, iones, función renal, ferritina, TSH, cortisol matutino) y a veces un Holter de 24 h para separar la taquicardia sinusal inapropiada (Raj 2022; Sheldon 2015, clase I para la historia, la exploración con signos ortostáticos y el ECG). Raj 2022 dice que esta evaluación se puede hacer en atención primaria.

**Taquicardia sinusal inapropiada**: FC en reposo de 100 lpm o más de forma constante, o una media de 24 h por encima de 90 lpm (Raj 2022).

**Taquicardia paroxística supraventricular** (Raj 2022), a considerar si la taquicardia:
- no depende siempre de la postura;
- empieza y acaba de golpe (en el POTS sube poco a poco);
- se corta con un Valsalva.

**El síncope**:
- En el POTS es más frecuente el presíncope que el desmayo, aunque muchos pacientes se desmayan alguna vez. El POTS y el síncope vasovagal pueden coexistir (Sheldon 2015).
- **Banderas rojas** (NICE CG109, 1.1.4.2): derivar con urgencia para valoración cardiovascular, revisada por el especialista **en 24 h**, a quien haya tenido una pérdida transitoria de conocimiento y además cualquiera de estas:
  - una alteración del ECG;
  - insuficiencia cardiaca (antecedente o signos);
  - **pérdida de conocimiento durante el esfuerzo**;
  - **antecedente familiar de muerte súbita cardiaca antes de los 40 años, o una cardiopatía hereditaria**;
  - **disnea nueva o sin explicación**;
  - un soplo cardiaco.
  
  Considerarlo también en mayores de 65 años con pérdida de conocimiento sin pródromos.
- **Síncope de esfuerzo** (NICE CG109, 1.3.2.1–1.3.2.2):
  - el que ocurre durante el ejercicio orienta a una arritmia;
  - el que ocurre justo al pararlo, a un vasovagal;
  - con síncope durante el ejercicio, prueba de esfuerzo urgente (en 7 días) y no hacer ejercicio hasta la valoración.
  
  Sheldon 2015 (sección 4) lo confirma en jóvenes: aunque lo más frecuente sigue siendo el vasovagal, el síncope de esfuerzo debe estudiarse por miocardiopatía o arritmia.
- **Mientras espera la valoración** (NICE CG109, 1.5.4.3): qué hacer si vuelve a pasar, modificar la actividad (evitar el esfuerzo si procede) y no conducir.
- **Hipotensión postural** (NICE CG109, 1.2.1, 1.5.4.2): se mide la TA tumbado y de pie. Su manejo es médico, sobre todo la revisión de los fármacos.

**Ejercicio**:
- **Recomendación**: un programa de ejercicio regular, estructurado y progresivo puede ser eficaz (Sheldon 2015, IIa, B-R). Debe ser supervisado y graduado, aeróbico, con algo de fuerza de muslos.
- **Al principio, sin estar de pie**: remo, bicicleta reclinada y natación (Sheldon 2015). Vernino 2021 (tabla 2) también lo dice.
- **Volumen**: aeróbico 30 min o más, 4 días por semana, con algo de fuerza de piernas (Vernino 2021, tabla 2).
- **Empeoramiento inicial**: al principio se encuentran peor hasta 6 semanas (Vernino 2021, tabla 2), o pueden no mejorar en un mes (Raj 2022). Hay que avisarlo.
- **El programa de Fu 2010**, en 3 meses:
  - al principio, 2–4 sesiones por semana de 30–45 min en bicicleta reclinada, remo o natación, sobre todo «base» (≈75–85 % de la FC máxima);
  - las sesiones de intensidad, una y luego dos por semana, siempre seguidas de una de recuperación;
  - **lo vertical se añade poco a poco, normalmente no antes del 2.º o 3.er mes**;
  - pesas de una a dos veces por semana.
  
  Resultados en los 19 que lo terminaron:
  - 10 de 19 dejaron de cumplir los criterios;
  - mejoró la calidad de vida;
  - abandonó el 24 % (6 de 25).
- **Agravantes**:
  - la deshidratación, el calor, el alcohol y el ejercicio (Sheldon 2015);
  - las comidas (Vernino 2021, §13).
- **Lo que es médico**: el agua, la sal, las prendas de compresión y los fármacos (Sheldon 2015; Vernino 2021, tabla 2; Raj 2022). El fisio no los pauta.

**Pronóstico**:
- No se conoce mortalidad (Sheldon 2015).
- Muchos mejoran con el tratamiento, pero la mayoría refiere síntomas crónicos con reagudizaciones (Vernino 2021, §3).
- No hay datos de la historia natural en adultos (Raj 2022).
- La gravedad de los síntomas casi no se corresponde con lo que sube la FC (Raj 2021, §5).

## Criterio de entrada de la Fase P: sí entra

1. **Cambia la seguridad**:
   - un desmayo que el paciente atribuye a «su POTS» puede ser cardiaco, y el POTS conocido no lo explica (NICE CG109);
   - la consulta de fisioterapia pone al paciente de pie, le hace esforzarse y le pauta ejercicio: el síncope de esfuerzo cambia lo que se puede hacer ese día (NICE CG109, 1.3.2.2).
2. **Cambia la interpretación**:
   - la poca tolerancia al esfuerzo, el cansancio y el empeoramiento durante días tras el ejercicio pueden ser intolerancia ortostática y desacondicionamiento, no irritabilidad del tejido;
   - el mareo de pie que mejora tumbado no es mareo cervicogénico (`ce13` es un diagnóstico de exclusión);
   - el ejercicio debe empezar sin estar de pie.

**Es capa transversal**, como la hipermovilidad, no contenido regional como Tarlov: no depende de la región y afecta a la valoración y al plan de todas.

## Principios (los mismos de la hipermovilidad)

1. **Capa transversal, no fase nueva**: tarjeta en la fase 1, sistema de la fase 2 que solo aparece si se activa, un aviso en la 4b, recuadro en la 5 y aviso en la 6.
2. **El árbol CIF y el motor de puntuación no se tocan.** Ni navegación, ni snapshot, ni LR.
3. **El fisio no diagnostica el POTS.** Ni «probable POTS» ni «POTS» con la sospecha. El resultado se redacta así: «aumento de la FC de X lpm al ponerse de pie, sin hipotensión ortostática: compatible con taquicardia ortostática → valoración médica». Exige síntomas de ≥3 meses y excluir otras causas, y eso lo hace el médico (Vernino 2021; Plash 2013).
4. **La seguridad no se recorta.** Las preguntas del síncope cardiaco nunca se pliegan, y en modo breve no hay embudo (como en la hipermovilidad). Marcar POTS nunca quita ni rebaja una `urgencia` de ningún sistema (ver «Seguridad»).
5. **Sin contenido clínico inventado.** Las preguntas y los textos de abajo son un borrador hasta tu revisión.

## Flujo propuesto

### Fase 1 — tarjeta «Disautonomía / POTS» (`#cardDisautonomia`)
- Va justo después de la tarjeta «Hipermovilidad», antes de Cronología.
- Tres estados, como la hipermovilidad: **No consta** (por defecto; no añade nada), **Diagnosticada** y **Sospecha**. Un segundo toque desmarca.
- Con «Diagnosticada», **cuál** (decisión 2): POTS · Hipotensión ortostática · Otra o no lo sabe.
- La clase `body.disautonomia` muestra los elementos `.solo-ds` de las demás fases.
- No se pliega en modo breve.
- Un cambio vacía la 4b (`_invalidar4b()`) y repinta el cribado (`_repintarCribado()`), igual que la hipermovilidad.
- **Los signos vitales de la fase 1 no se tocan**: su FC y su TA siguen siendo datos sueltos que ningún algoritmo lee. La prueba de bipedestación tiene sus propias medidas (decisión 4).

### Fase 2 — sistema «Disautonomía» (`SIS_DISAUTONOMIA`, `transversal_disautonomia`)
Sistema común en `data/comun.js`, la misma instancia en las 7 regiones, con `soloDisautonomia: true` (lo resuelve `sistemasActivos()` como `soloHipermovilidad`). Va tercero, después del posquirúrgico y de la hipermovilidad. Sin embudo en modo breve, y no sale como «sistema sin cribar».

**A. Banderas rojas del síncope** (con «Diagnosticada» y con «Sospecha»; `urgencia`, clase `.sq2-urg`, nunca se pliegan). Borrador sacado de NICE CG109, 1.1.4.2 y 1.3.2.2. Cada pregunta incluye el desmayo, porque NICE pide pérdida de conocimiento **más** el rasgo:

| id | Pregunta (borrador) | `urgencia` (borrador) |
|---|---|---|
| `ds_u_esfuerzo` | ¿Se ha desmayado alguna vez **mientras** hacía un esfuerzo (no justo al pararlo)? | Síncope durante el esfuerzo: valoración cardiológica en 24 h y sin ejercicio hasta entonces. |
| `ds_u_familia` | Si se ha desmayado: ¿algún familiar murió de forma súbita antes de los 40 años, o tiene una enfermedad del corazón hereditaria? | Síncope con antecedente familiar de muerte súbita o cardiopatía hereditaria: valoración cardiológica en 24 h. |
| `ds_u_corazon` | Si se ha desmayado: ¿le falta el aire de forma nueva o sin explicación, o le han dicho que tiene un soplo o insuficiencia cardiaca? | Síncope con disnea nueva, soplo o insuficiencia cardiaca: valoración cardiológica en 24 h. |

Con la ESC 2018 leída (prioridad 1) se valoraría una cuarta: «¿Se ha desmayado tumbado, o justo después de notar el corazón muy rápido de golpe?». NICE solo pide «considerar» el síncope sin pródromos en mayores de 65, y no la cito hasta leer la ESC.

**B. Derivación no urgente** (`derivacion`, el campo de Tarlov). Va a `dv[]` y no bloquea la fase 6:

| id | Pregunta (borrador) | `derivacion` (borrador) | Fuente |
|---|---|---|---|
| `ds_d_paroxistica` | ¿Le dan episodios en que el corazón se le dispara **de golpe** y se le para también de golpe, aunque esté sentado o tumbado? | Taquicardia de inicio y fin bruscos que no depende de la postura: valoración médica (descartar una taquicardia paroxística). | Raj 2022 |

**C. Sospecha: patrón de intolerancia ortostática** (solo con «Sospecha»). Un «sí» no es una bandera: como el cuestionario de la hipermovilidad, va en `state.disautonomia` y no en `sistemicoAnswers`.

| id | Pregunta (borrador) | Fuente |
|---|---|---|
| `io1` | Desde hace 3 meses o más, ¿estar de pie le da con frecuencia mareo o aturdimiento, palpitaciones, temblor, debilidad, visión borrosa o cansancio, y se le pasa rápido al tumbarse? | Vernino 2021, §2; Raj 2022, recuadro 2 |
| `io2` | ¿Le empeora con el calor, después de comer, con el alcohol o al deshidratarse? | Sheldon 2015; Vernino 2021, §13 |
| `io3` | ¿Toma algún fármaco que acelere el corazón (estimulantes, diuréticos, algunos antidepresivos) o ha estado mucho tiempo en cama? | Vernino 2021; Raj 2022, recuadro 3 (sirve para el diferencial, no suma a favor) |

La anemia, el hipertiroidismo y la pérdida de sangre ya los pregunta el cribado de cada región (sistemas endocrino y hematológico, `data/comun.js`). El razonamiento de `io1` lo recuerda en vez de repetir esas preguntas.

**D. Prueba de bipedestación activa** (elemento nuevo, como la escala de Beighton; botón «Hacer la prueba de bipedestación»). Protocolo de Raj 2022:
- Una casilla de reposo: «tumbado al menos 5 min» (sin cronómetro en el piloto; decisión 4).
- Una fila «Tumbado» con FC y TAS/TAD, y filas «De pie» a los 1, 3, 5, 8 y 10 min con FC, TAS/TAD y «síntomas» (sí/no).
- **Se calcula y nunca se guarda** (como el IMC):
  - ΔFC en cada medida de pie;
  - ¿hay al menos 2 medidas con ΔFC ≥ corte? (30, o 40 de 12 a 19 años: lo da `state.edadPaciente`, con el aviso discreto si falta);
  - ¿cae la TAS ≥20 mmHg de forma mantenida?
- **Resultado**, una caja como la de Beighton:
  - **«Compatible con taquicardia ortostática»**: ≥2 medidas por encima del corte y sin caída de la TAS. Texto: «Aumento de la FC de hasta X lpm al ponerse de pie, sin hipotensión ortostática. El POTS lo diagnostica el médico: exige síntomas de ≥3 meses y descartar otras causas. Derivación preferente a su médico.»
  - **«Caída de la TA al ponerse de pie»**: TAS −20 mmHg o más mantenida. Texto: «No es un POTS: hipotensión ortostática. Valoración médica (revisar los fármacos).» (NICE CG109, 1.2.1 y 1.5.4.2.)
  - **«No llega al corte»**: «Con una sospecha alta, repetir otro día, mejor por la mañana» (Raj 2022). Y «cuánto pesa»: en Plash 2013, uno de cada tres sanos superaba los 30 lpm.
  - **FC tumbado ≥100**: una línea aparte: «FC en reposo de 100 o más: comentarlo con su médico (taquicardia sinusal inapropiada u otra causa)» (Raj 2022).
- **Seguridad durante la prueba** (nota fija sobre las filas): quedarse al lado; si aparece un presíncope, sentarlo o tumbarlo y parar. La medida que falte no cuenta. Es redacción propia que se apoya en la definición (los síntomas mejoran al tumbarse); ninguna fuente leída describe cómo parar la prueba.
- **Precisión**: el razonamiento dice que la prueba orienta pero no diagnostica (Plash 2013) y que la mesa basculante no hace falta (Vernino 2021).

Cada pregunta y la prueba llevan su `razonamiento` (Fase F) con las fuentes del registro.

### Fase 3 — SINSS
- La lógica no cambia.
- Una línea `.solo-ds` bajo «Tolerancia al estrés físico»: «Con intolerancia ortostática, separa lo que limita estar de pie (mareo, palpitaciones) de lo que limita la carga del tejido; la matriz mide lo segundo.»
- Ninguna otra.

### Fase 4 — árbol CIF
- **Navegación, opciones y snapshot sin cambios.**
- Propuesta opcional (decisión 7): una frase `.solo-ds` en el paso `ce_step4b` (mareo, cervical): «El mareo al ponerse de pie que mejora rápido al tumbarse orienta a intolerancia ortostática, no a mareo cervicogénico» (Raj 2022, recuadro 2). `ce13` ya excluye «otras causas de mareo».

### Fase 4b — aviso general, sin tocar las LR
Ningún test pierde validez por el POTS: no hay ningún campo por test, a diferencia de la `laxitud` de la hipermovilidad. Con la tarjeta activa, una sola línea encima de las hipótesis (decisión 6): «Disautonomía: haz en decúbito o sentado lo que la técnica permita y, si aparece mareo de pie, vuelve a tumbarlo antes de seguir.» Es una regla de técnica, sin afirmar nada sobre la precisión.

### Fase 5 — recuadro «Disautonomía» (`.ds-fase5`, nunca se pliega)
Al principio, junto a los de «Paciente posquirúrgico» e «Hipermovilidad». Cada línea va pegada a su fuente:
- Estado (y cuál, si está diagnosticada); el resultado de la prueba de bipedestación, si se hizo.
- **Siempre**: «Ejercicio regular, estructurado y progresivo, al principio sin estar de pie (remo, bicicleta reclinada, natación), añadiendo lo vertical poco a poco (Sheldon 2015; Fu 2010). Puede encontrarse peor las primeras semanas (Vernino 2021).»
- **Siempre**: «Un desmayo durante el esfuerzo, con antecedente familiar de muerte súbita o con disnea nueva no lo explica la disautonomía: valoración cardiológica en 24 h (NICE CG109).» Línea fija, como la de signos sistémicos de la hipermovilidad.
- **Con «Sospecha» y la prueba compatible**: «Derivación preferente a su médico para confirmar el diagnóstico y descartar otras causas (Raj 2022).»
- **Con la caída de la TA**: la línea de la hipotensión ortostática.
- **El agua, la sal y la compresión no se pautan aquí**: «Las medidas de agua, sal y compresión las indica el médico» (decisión 8).

### Fase 6 — plan de tratamiento
- **Aviso `disautonomia`** en todas las regiones, como `AVISOS_POSQ_PERIFERICA`:
  - empezar el ejercicio sin estar de pie y pasar a lo vertical poco a poco;
  - evitar estar mucho rato de pie quieto en la sesión;
  - el calor y el esfuerzo lo agravan (Sheldon 2015; Fu 2010).
- **Red de seguridad propia** (`RED_SEGURIDAD`, con cualquier plan y la tarjeta activa), para el cierre de la sesión y el programa para casa: «Si se desmaya mientras hace ejercicio, pare y no vuelva a hacer ejercicio hasta que le vea el médico» (NICE CG109, 1.3.2.2 y 1.5.4.3).
- **El nivel A/B/C, la frecuencia y la irritabilidad no cambian.** El programa de Fu 2010 no se copia como pauta: es de un laboratorio y con sal y agua añadidas.
- Con un SÍ en una pregunta `urgencia` del sistema, la fase 6 se bloquea como con cualquier urgencia, sin código nuevo. `ds_d_paroxistica` no la bloquea, igual que `l_u5`.

## Relación con la hipermovilidad (decisión 5)

**Recomendación: ninguna regla automática**, como en Tarlov. Marcar una tarjeta no activa la otra ni le da peso. Motivos:
- **Miller 2020** es la única medida con los criterios de 2017, y tiene límites importantes:
  - el 31 % (28 de 91) de personas con POTS cumplía los del SEDh, y otro 24 % tenía hipermovilidad generalizada sin cumplirlos;
  - la muestra se reclutó en un congreso de pacientes y el POTS era autodeclarado;
  - no hubo control ni ecocardiograma;
  - de quienes decían tener un SEDh, solo el 56 % cumplía los criterios;
  - los autores hablan de asociación y dicen que no se conoce ningún mecanismo que los una.
- **Vernino 2021** da un 20–30 %, de muestras pequeñas o encuestas sin control. En la otra dirección, intolerancia ortostática y taquicardia en hasta el 40 % de personas con TEH o SEDh.
- **Raj 2022** dice que la calidad de esa evidencia es débil.
- **Sheldon 2015** solo propone un mecanismo (venas que se distienden más), sin cifras.
- **Fu 2010** excluyó a una paciente al diagnosticarle un Ehlers-Danlos, porque podía alterar el tamaño del corazón.

**Lo que sí propongo**, sin lógica:
- El razonamiento de `io1` lleva una frase con estas cifras y sus límites, y dice que la exploración del POTS incluye valorar la hipermovilidad (Raj 2022; Vernino 2021, §12), con un «mira la tarjeta Hipermovilidad» de texto.
- Con las dos tarjetas activas, la línea fija de la hipermovilidad («Si hay disautonomía… derivar al especialista», Engelbert 2017) se queda como está. No se toca su texto, porque physiq-report lo copia literal.
- Si llega Hakim 2017 (prioridad 2) se revisa el razonamiento, no la regla.

## Seguridad: qué separa el POTS de lo que exige derivar

| Cuadro | Lo que lo sugiere | Qué hace la app |
|---|---|---|
| **Síncope cardiaco** | Desmayo durante el esfuerzo, antecedente familiar de muerte súbita antes de los 40 o cardiopatía hereditaria, disnea nueva, soplo, insuficiencia cardiaca, ECG alterado (NICE CG109) | `urgencia`: valoración en 24 h |
| **Taquicardia paroxística supraventricular** | Inicio y fin bruscos, no depende de la postura, se corta con un Valsalva (Raj 2022) | `derivacion`, no urgente |
| **Hipotensión ortostática** | Cae la TAS ≥20 mmHg de pie (Raj 2022; NICE CG109) | Resultado de la prueba: valoración médica, no es POTS |
| **Hipovolemia o anemia** | Sangrado, deshidratación, palidez (Raj 2022, recuadro 3) | Ya la preguntan los sistemas hematológico y endocrino de cada región |
| **Taquicardia sinusal inapropiada** | FC en reposo ≥100 de forma constante (Raj 2022) | Línea en el resultado de la prueba |
| **POTS** | Síntomas de pie ≥3 meses que mejoran tumbado, ΔFC ≥30 sin hipotensión, sin otra causa | Sospecha → derivación preferente para confirmar |

Garantías, cada una con su prueba unitaria:
1. **Nada de la capa quita ni rebaja una `urgencia`.** La tarjeta solo **añade** un sistema. Para las mismas respuestas, `ur[]`, las clases `.sq2-urg` y las banderas de los demás sistemas salen iguales con la tarjeta activa o sin ella.
2. **Un POTS conocido no explica un síncope nuevo, distinto o de esfuerzo.** Lo dicen el razonamiento de las tres preguntas urgentes y la línea fija de la fase 5, con la misma lógica que el «un quiste conocido no explica un cambio nuevo» de Tarlov.
3. **Las preguntas urgentes salen con «Diagnosticada» y con «Sospecha»**: el diagnóstico no las quita.
4. **Las banderas de síncope de cervical y hombro no cambian.** Hoy son bandera sin pregunta («Síncope repentino sin mareo previo», Goodman 2018).
5. **Fuera de esta capa** (decisión 9): el síncope de esfuerzo y el antecedente de muerte súbita **solo se preguntan si el fisio marca la tarjeta**. A quien no la marca no se le pregunta, porque ninguna región tiene hoy una pregunta de síncope. Es un hueco previo a esta propuesta; lo apunto en vez de taparlo aquí.

## Salidas

- **Payload `ds`**, solo con la tarjeta activa, así que la huella de los informes con IA anteriores no cambia: `{ es, ti, pb, dfc, ho, ot, cs }`.
  - `es` estado; `ti` cuál (si está diagnosticada);
  - `pb` si se hizo la prueba; `dfc` ΔFC máxima mantenida;
  - `ho` hipotensión ortostática (true/false/null); `ot` compatible con taquicardia ortostática (true/false/null);
  - `cs` «sí» de las preguntas de sospecha.
  
  Las cifras de cada minuto no van al payload; sí al bloque de la IA como datos ampliados (decisión 10). Las urgencias van a `ur[]` y la derivación de `ds_d_paroxistica` a `dv[]`, como siempre, así que physiq-report las pinta sin cambios.
- **📋 Notas**: una línea «🫀 DISAUTONOMÍA: sospecha · bipedestación: +34 lpm a los 10 min, sin hipotensión ortostática · compatible con taquicardia ortostática → derivar a su médico».
- **📄 Informe** (paciente o médico):
  - con «Diagnosticada», en antecedentes: «Síndrome de taquicardia postural ortostática (diagnosticado)» o «Hipotensión ortostática (diagnosticada)»;
  - con «Sospecha» y la prueba compatible: «Aumento de la frecuencia cardiaca al ponerse de pie: se recomienda valoración médica», **sin la palabra POTS** (como «sin Ehlers-Danlos» con la sospecha de hipermovilidad).
- **Informe con IA**: bloque «Disautonomía» en `contextoValoracion()` (`bloqueDsIA()`), con las recomendaciones sin citas y, con la sospecha, «no escribas que el paciente tiene un POTS». `lib/reglas-informe.js` no se toca.
- **physiq-report**: copia literal `_bloqueDs()` en su `lib/payload.js` y un test en cada repositorio que fija el mismo texto, como `_bloqueHM`. Es otro repositorio y otra PR, después de esta.
- **Fase 6**: ni el aviso ni la red van al payload, como el resto de la fase.
- **Modo breve**: con «Sospecha», la prueba sin hacer es un pendiente (`ancla: 'cardDisautonomia'`). Las urgencias nunca están pendientes: siempre se ven.

## Decisiones que tienes que tomar

1. **¿Entra, y como capa transversal con documento propio?** *Recomiendo sí a las dos* (ver arriba).
2. **Tarjeta propia frente a ampliar la de hipermovilidad**, y qué se distingue con «Diagnosticada». *Recomiendo tarjeta propia* con POTS · Hipotensión ortostática · Otra o no lo sabe. La hipotensión ortostática tiene otro manejo, y otros nombres (síncope vasovagal, taquicardia sinusal inapropiada) no cambian nada en la app.
3. **Las tres preguntas del síncope cardiaco con `urgencia` («valoración cardiológica en 24 h»)**, que en la app sale como «Derivación urgente hoy». *Recomiendo `urgencia`*: NICE pide derivar con urgencia y revisión en 24 h, y `derivacion` (no urgente) se quedaría corta. El mensaje dice «en 24 h» para no exagerar.
4. **Prueba de bipedestación activa en la fase 2, con sus propias medidas.** *Recomiendo*:
   - el protocolo de Raj 2022 (tumbado 5–10 min; de pie 1, 3, 5, 8, 10 min);
   - sin cronómetro en el piloto, y sin rellenar nada desde los signos vitales de la fase 1 (esos se toman sentado y en otro momento);
   - con el resultado calculado y nunca guardado.
   
   Un cronómetro de 10 min con avisos sería la segunda versión.
5. **Relación con la hipermovilidad**: *recomiendo ninguna regla automática*, solo una frase en el razonamiento con las cifras de Miller 2020 y sus límites. Además, no tocar la línea de la hipermovilidad que copia physiq-report.
6. **Fase 4b**: *recomiendo una sola línea general de técnica*, sin campo por test y sin tocar las LR. La alternativa es no poner nada en la 4b.
7. **Frase en `ce_step4b` (mareo cervical)**: *recomiendo sí*, como texto `.solo-ds` sin tocar opciones ni navegación. La alternativa es dejarlo solo en el razonamiento de `io1`.
8. **Agua, sal y compresión**: *recomiendo no pautarlas* y decir solo que las indica el médico. Las tres fuentes las dan como tratamiento médico, con dosis distintas entre ellas (Vernino 2021 se contradice entre el texto y la tabla 2).
9. **El hueco del síncope fuera de la capa**: *recomiendo apuntarlo como trabajo aparte*, una pregunta de síncope en el sistema cardiovascular de cada región, con su revisión región a región como la Fase M. Así esta propuesta no cambia el cribado de quien no marca la tarjeta.
10. **Payload `ds` y physiq-report**: *recomiendo* el campo compacto de arriba, las cifras de cada minuto solo en el prompt, y la PR de physiq-report después.
11. **Fuentes**: *recomiendo no implementar hasta leer la ESC 2018* (prioridad 1, para la cuarta pregunta y para contrastar las tres de NICE) y **Sivakoti 2026** (prioridad 4, para comprobar que no cambia los criterios). Hakim 2017 y CCS 2020 mejorarían el razonamiento, pero no bloquean.
12. **Registro de referencias**: *recomiendo registrar* `Sheldon 2015`, `Vernino 2021`, `Raj 2022`, `Plash 2013`, `Fu 2010`, `Miller 2020` y `NICE CG109`, y las que lleguen en PDF; `Raj 2021` no, porque no se usa.

## Cambios técnicos previstos (cuando se apruebe)

```js
disautonomia: {
  estado: '',        // '' (no consta) | 'diagnosticada' | 'sospecha'
  tipo: '',          // '' | 'pots' | 'ho' | 'otra'
  sospecha: {},      // { io1, io2, io3: 'SI' | 'NO' }
  bipedestacion: null, // null = sin hacer | { reposo: bool, tumbado: { fc, tas, tad }, m1, m3, m5, m8, m10: { fc, tas, tad, sintomas } }
}
```

- `lib/disautonomia.js`, funciones puras con pruebas unitarias:
  - visibilidad por estado;
  - corte por edad;
  - ΔFC, «2 medidas por encima del corte», caída mantenida de la TAS, FC en reposo ≥100;
  - resultado;
  - payload `ds`;
  - textos de 📋 Notas, 📄 Informe e IA.
- `SIS_DISAUTONOMIA` en `data/comun.js`, en las 7 regiones; `sistemasActivos()` lo filtra con `soloDisautonomia`.
- El elemento de la prueba en la fase 2, pintado dos veces (panel y acordeón) como `[data-hm-bloque]`.
- `AVISOS_DISAUTONOMIA` y la red de seguridad en `data/plan-tratamiento.js`; `node tests/gen-frases-plan.mjs`.
- Referencias en `data/referencias.js` y `node tests/gen-referencias.mjs`.
- `_softResetApp()`, la restauración de sesión (`normalizarDisautonomia()`), exportar e importar (va dentro de `state`), y `deploy-to-hub.yml` para `lib/disautonomia.js`.
- Pruebas unitarias:
  - nada sin la tarjeta;
  - las garantías de seguridad 1 y 3;
  - las tres urgencias con `.sq2-urg`;
  - `ds` en el payload;
  - la prueba (cortes, 2 medidas, la TA, faltan datos);
  - nada de la fase 6 en el payload;
  - el aviso de la 4b nunca en los resúmenes;
  - el pendiente del modo breve.
- Prueba de humo, sección `disautonomia`:
  - la tarjeta, el sistema y las urgencias;
  - la prueba con un caso compatible, uno con hipotensión y uno por debajo del corte;
  - el recuadro de la fase 5 y el aviso de la fase 6;
  - todo a 320 px y en el hub.
  
  La completa, antes de `main`.
