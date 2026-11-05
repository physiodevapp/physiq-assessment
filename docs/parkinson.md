# Enfermedad de Parkinson — diseño

Estado: **borrador de diseño (noviembre 2026), sin código. Aceptadas por el usuario las 16 recomendaciones (noviembre 2026)** (ver «Decisiones»). Pedidos los PDF de las decisiones 14 y 15. Fuentes en abierto leídas en esta sesión: 8 (ver «Fuentes leídas»). Faltan PDF del usuario para cerrar dos puntos de seguridad (ver «Pendiente de leer»).

Es una posible condición especial de la Fase P (`MIGRATION_PLAN.md`). Va después de la hipermovilidad, el POTS, el lupus, el trastorno mastocitario, la osteoporosis, el embarazo y el paciente anticoagulado. Si se hace la tarjeta, la guía de condiciones especiales (`docs/condiciones-especiales.md`) tiene que añadir su fila. Lo exige un test unitario para todo sistema `transversal_*` con `soloX: true`.

**Qué hay hoy en la app**: nada. Ningún archivo de `data/`, `lib/` ni `formularios/` menciona el Parkinson, la estimulación cerebral profunda ni la diatermia (búsqueda de noviembre 2026). El temblor solo aparece como síntoma de otras causas: hipertiroidismo, hipoglucemia y efectos de fármacos.

## Resumen

- **Entra en la Fase P**: cambia la **seguridad** (crisis acinética, retirada de la medicación, estimulador cerebral profundo, hipotensión ortostática, caídas y fracturas) y la **interpretación** (rigidez, dolor y hombro congelado, fluctuaciones on/off que cambian lo que se mide).
- **Forma propuesta**, la de las otras condiciones: tarjeta en la fase 1 («Diagnosticado» y, en la decisión 2, «Sospecha»), sistema `SIS_PARKINSON` en la fase 2, una línea en la 4b, recuadro en la 5, avisos y red en la 6. **El árbol CIF y el motor de puntuación no se tocan.**
- **El fisio no diagnostica el Parkinson.** Con «Sospecha», el resultado es «derivar pronto y sin tratar a un especialista» (NICE NG71, 1.2.2), nunca «probable Parkinson».
- **Dos puntos de seguridad necesitan fuente antes de implementar**: la diatermia con estimulador cerebral profundo (aviso de la FDA de 2002 y etiquetado del fabricante, que no se han podido abrir desde este entorno) y la sesión en fase «on» (guía europea KNGF/ParkinsonNet, que no está en abierto).

## Fuentes leídas

### Enteras o en las partes que usa el diseño, en abierto (PMC o web)

| Clave propuesta | Referencia | Cómo se leyó | Qué aporta |
|---|---|---|---|
| `Osborne 2022` | Osborne JA, Botkin R, Colon-Semenza C, et al. Physical therapist management of Parkinson disease: a clinical practice guideline from the American Physical Therapy Association. *Phys Ther* 2022;102(4):pzab302. [doi:10.1093/ptj/pzab302](https://doi.org/10.1093/ptj/pzab302) | PMC9046970. Leídos: introducción, métodos, tabla 1, y de cada recomendación la propia recomendación, beneficios, riesgos, «intentional vagueness» y exclusiones; buenas prácticas (estimulación cerebral profunda, atención experta) y no-recomendaciones. Del resto de cada «Rationale», solo el aeróbico y la fuerza | **Única guía de fisioterapia graduada leída.** Ejercicio aeróbico (moderado a alto, ≥3 días/semana, 30–40 min), fuerza (1–2 días/semana, 80 % 1RM), equilibrio (2–3/semana, 16–30 h en 5–10 semanas), marcha (20–60 min, 3–5 días/semana, 4–12 semanas), estímulos externos. FC atenuada → usar también el esfuerzo percibido. Bicicleta antes que cinta con congelación de la marcha. Lo ganado se pierde si se deja. Estudios casi solo en Hoehn y Yahr 1–3. **Tiene versión en español** (suplemento 1) |
| `NICE NG71` | NICE. Parkinson's disease in adults. NICE guideline NG71, 2017. [nice.org.uk/guidance/ng71](https://www.nice.org.uk/guidance/ng71) | Capítulo «Recommendations», en la web | Sospechar ante temblor, rigidez, lentitud, problemas de equilibrio o de la marcha (1.2.1); **derivar pronto y sin tratar** al especialista (1.2.2); **no retirar la medicación de golpe** ni dejar que falle por mala absorción (gastroenteritis, cirugía abdominal), por riesgo de acinesia aguda o síndrome neuroléptico maligno (1.3.2–1.3.4); hipotensión ortostática: revisar fármacos (1.5.8); somnolencia diurna y ataques de sueño (1.5.1); fisioterapia específica con equilibrio o función motora alterados (1.7.2–1.7.3); logopedia con problemas para tragar (1.7.8); vitamina D (1.7.13) |
| `Simonet 2019` | Simonet C, Tolosa E, Camara A, Valldeoriola F. Emergencies and critical issues in Parkinson's disease. *Pract Neurol* 2020;20(1):15–25. [doi:10.1136/practneurol-2018-002075](https://doi.org/10.1136/practneurol-2018-002075) | PMC7029239, entero | Síndrome de parkinsonismo-hiperpirexia (incidencia 0,3 %, mortalidad 4 %) y sus desencadenantes (tabla 1: retirada o cambio de medicación, mala absorción, infección, traumatismo, deshidratación, calor); off graves con dolor, sudor y taquicardia; discinesias graves con caídas y fracturas; síndrome serotoninérgico; **hipotensión ortostática sintomática (~10 %)** con síncope, caídas y lesiones; ataques de sueño; disfagia y neumonía por aspiración; **caídas en el 50–60 %**, fracturas como complicación más frecuente; **estimulación cerebral profunda**: reaparición brusca del parkinsonismo, discinesias o conductas anómalas → contactar con el centro implantador; la interrupción de la estimulación puede dar un cuadro parecido a la hiperpirexia; riesgo de suicidio tras la cirugía, sobre todo el primer año |
| `Pötter-Nerger 2024` | Pötter-Nerger M, Schrader C, Jost WH, et al. The akinetic crisis in Parkinson's disease — the upper end of a spectrum of subacute akinetic states. *J Neural Transm* 2024;131(10):1199–1207. [doi:10.1007/s00702-024-02817-8](https://doi.org/10.1007/s00702-024-02817-8) | PMC11489269, entero | **Crisis acinética**: rigidez y acinesia que empeoran en 2–3 días y no responden a la levodopa, fiebre alta, alteración de la conciencia en la mitad, disfagia y síntomas autonómicos; mortalidad del 4–23 %. Desencadenante más frecuente: **infecciones** (respiratoria, urinaria); también cambio o retirada de la medicación, traumatismos, caídas y fracturas, cirugía, calor y deshidratación. Es el extremo grave de un espectro de empeoramientos subagudos, que son frecuentes |
| `Wang 2022` | Wang JY, Huang JF, Zhu SG, et al. Parkinsonism-hyperpyrexia syndrome and dyskinesia-hyperpyrexia syndrome in Parkinson's disease: two cases and literature review. *J Parkinsons Dis* 2022;12(6):1727–1735. [doi:10.3233/JPD-223362](https://doi.org/10.3233/JPD-223362) | PMC9535593, leído el resumen y la discusión | Confirma la retirada brusca de la medicación dopaminérgica como causa frecuente. No aporta nada que no esté en las dos anteriores; **no se propone registrar** |
| `LeWitt 2020` | LeWitt PA, Kymes S, Hauser RA. Parkinson disease and orthostatic hypotension in the elderly: recognition and management of risk factors for falls. *Aging Dis* 2020;11(3):679–691. [doi:10.14336/AD.2019.0805](https://doi.org/10.14336/AD.2019.0805) | PMC7220277, entero | Hipotensión ortostática en el 47–58 % de los pacientes con Parkinson; definición (≥20/10 mmHg en 3 min); **cómo medirla**: 5 min tumbado y de pie con medida al minuto 1 y al 3; en la neurogénica la FC casi no sube; diez preguntas de cribado (tabla 3); caídas al levantarse → sospechar hipotensión ortostática; **maniobras físicas** (cruzar las piernas tensando, inclinarse hacia delante, ponerse en cuclillas) (tabla 4); doble riesgo de caídas y fracturas |
| `Tan 2014` | Tan L, Wang Y, Zhou L, et al. Parkinson's disease and risk of fracture: a meta-analysis of prospective cohort studies. *PLoS One* 2014;9(4):e94379. [doi:10.1371/journal.pone.0094379](https://doi.org/10.1371/journal.pone.0094379) | PMC3979831, resumen y resultados | Riesgo de fractura HR 2,66 (IC 95 % 2,10–3,36), 6 cohortes, 69 387 participantes, calidad moderada |
| `Gadgaard 2024` | Gadgaard NR, Veres K, Henderson VW, et al. Frozen shoulder and the risk of Parkinson's disease: a Danish registry-based cohort study. *Clin Epidemiol* 2024;16:447–459. [doi:10.2147/CLEP.S463571](https://doi.org/10.2147/CLEP.S463571) | PMC11216321, resumen y discusión | Tras un hombro congelado, Parkinson en el 1,51 % a 22 años frente al 1,03 % de la población (HR 1,94 el primer año), **pero igual que tras un dolor lumbar** (HR 0,89–1,01). Riesgo absoluto bajo |
| `Paggou 2023` | Paggou D, Stefanis L, Chronopoulos E, et al. Shoulder dysfunction in Parkinson disease: review of clinical, imaging findings and contributing factors. *J Musculoskelet Neuronal Interact* 2023;23(2):263–280. | PMC10233223, resumen, tabla 1 y discusión | Dolor de hombro, hombro congelado y **asimetría del braceo** pueden preceder a los signos cardinales (Riley 1989: hombro congelado en el 12,7 % frente al 1,7 %, y primer síntoma en al menos el 8 %); se asocian a rigidez, temblor y bradicinesia del mismo lado; fracturas por caídas y osteoporosis |

### Salvedades de lectura

- **Osborne 2022**:
  - Solo ensayos aleatorizados de 1994 a junio de 2020.
  - Casi todos los estudios son en Hoehn y Yahr 1–3; la guía avisa de que no se generalizan a los estadios 4–5.
  - **No hace recomendación sobre la estimulación cerebral profunda** (no hay estudios; «best practice»: hace falta investigar) ni sobre los factores de riesgo.
  - Las dosis vienen de su apartado «Intentional Vagueness»: son lo que usaron «muchos estudios», no una dosis óptima establecida. Se dirán así.
- **Simonet 2019**: revisión narrativa de neurólogos, sin grados de evidencia. Los fármacos y dosis que da son del médico y **no van a la app**.
- **Pötter-Nerger 2024**: revisión narrativa. La crisis completa es rara (0,3 % al año); los empeoramientos subagudos sin fiebre son frecuentes. La app no puede distinguir uno de otro, y no hace falta: los dos se derivan.
- **LeWitt 2020**: revisión con financiación de la industria (droxidopa). Sus fármacos, la sal y los litros de agua son del médico y **no van a la app**. Solo se usan la definición, cómo medirla, las preguntas de cribado y las maniobras físicas, que son técnica del fisio.
- **Tan 2014**: solo 6 cohortes, de calidad moderada (sus propios autores).
- **Gadgaard 2024**: el riesgo de Parkinson tras un hombro congelado no es mayor que tras un dolor lumbar. **No se usa como regla** («hombro congelado → sospechar Parkinson»), solo como contexto (decisión 7).
- **Paggou 2023**: revisión narrativa con estudios pequeños, sobre todo de casos y controles.
- **NICE NG71**: buena parte de las recomendaciones citadas son de 2006 (marcadas [2006]).

### Pendiente de leer (no se citan hasta leerlas)

| Fuente | Por qué hace falta | Cómo conseguirla |
|---|---|---|
| **Guía europea de fisioterapia en la enfermedad de Parkinson** (Keus SHJ, Munneke M, Graziano M, et al. KNGF/ParkinsonNet, 2014) | La guía de fisioterapia de referencia en Europa. Seguramente da la evaluación por estadios, las fluctuaciones on/off y en qué fase citar la sesión, las estrategias de movimiento y los estímulos | PDF del usuario (se descarga de parkinsonnet.com; no está en PMC) |
| **Aviso de la FDA sobre la diatermia y los electrodos implantados** (Public Health Notification, 19 dic 2002) o **el etiquetado del estimulador** (Medtronic, Abbott, Boston Scientific) | Base de la línea más seria de la tarjeta: **no aplicar diatermia** (onda corta, microondas; también ultrasonido terapéutico según el fabricante) **con un estimulador cerebral profundo implantado, aunque esté apagado o retirado si quedan los electrodos**. La búsqueda web lo describe (lesiones cerebrales graves y muertes), pero los dominios (webharvest.gov, health.ucdavis.edu, recalls-rappels.canada.ca) **no son accesibles desde este entorno**. Sin leerlo, la línea no se escribe | PDF del usuario, o abrir el entorno a esos dominios |
| Torsney KM, et al. Bone health in Parkinson's disease: a systematic review and meta-analysis. *J Neurol Neurosurg Psychiatry* 2014;85(10):1159–1166 | Osteoporosis (OR 2,61) además de fractura | Repositorio de UCL (en abierto) o PDF del usuario |
| Una revisión del **dolor en el Parkinson** (clasificación de Ford o la mecanicista de Mylius; p. ej. Tai y Lin 2020, PMC8302194; Buhmann 2020, PMC7592654) | Qué tipos de dolor ve el fisio (musculoesquelético, distónico, radicular, central) y cuáles cambian con la medicación. Para la fase 3 y la 4b | En abierto en PMC; se leen al cerrar las decisiones |
| Ernst M, et al. Physical exercise for people with Parkinson's disease: a systematic review and network meta-analysis. *Cochrane Database Syst Rev* 2024;4:CD013856.pub3. [doi:10.1002/14651858.CD013856.pub3](https://doi.org/10.1002/14651858.CD013856.pub3) | Metaanálisis en red más reciente sobre tipos de ejercicio. Si se escribe un bloque en la guía «Efectos del ejercicio» | **En abierto en PMC (PMC11001292)**: no hace falta PDF; se lee al escribir el bloque (decisión 13) |
| Validación española de un cuestionario específico (PDQ-39 o PDQ-8) | Regla del proyecto: solo cuestionarios validados en español de España (`docs/cuestionarios.md`) | Comprobar antes de añadir nada a la calculadora (decisión 12) |

**Las búsquedas de esta sesión**: la búsqueda de PubMed (E-utilities) y la de Europe PMC devolvían errores 500/503 (noviembre 2026). Los textos completos se leyeron por identificador desde PMC (servicio BioC) y las fuentes se localizaron con búsqueda web. Conviene repetir una búsqueda sistemática en PubMed cuando vuelva, sobre todo para la diatermia (casos publicados, p. ej. Nutt 2001 en *Neurology*) y la fisioterapia con estimulador cerebral profundo.

## Criterio de entrada de la Fase P: sí entra

1. **Cambia la seguridad**:
   - **La crisis acinética** (síndrome de parkinsonismo-hiperpirexia): empeoramiento en días de la rigidez y la inmovilidad, con fiebre, confusión o sudor. Mortalidad del 4–23 % (Pötter-Nerger 2024; Simonet 2019). Puede llegar a la consulta como «está mucho más rígido y le duele todo».
   - **La medicación que se retira o no se absorbe** (vómitos, diarrea, cirugía, no puede tragar) desencadena esa crisis (NICE NG71, 1.3.2; Simonet 2019, tabla 1).
   - **El estimulador cerebral profundo**: si deja de funcionar, el parkinsonismo reaparece de golpe, y puede llegar a un cuadro parecido a la hiperpirexia (Simonet 2019). La diatermia es la contraindicación grave de la consulta de fisioterapia (pendiente de fuente).
   - **Hipotensión ortostática** en el 47–58 % (LeWitt 2020), sintomática en ~10 % (Simonet 2019), con síncope y caídas al levantarse de la camilla.
   - **Caídas** en el 50–60 % (Simonet 2019) y **fracturas** con un riesgo 2,66 veces mayor (Tan 2014). Cambia la carga ósea y el thrust, como en la osteoporosis.
   - **Ataques de sueño** y somnolencia con los agonistas dopaminérgicos (Simonet 2019; NICE NG71, 1.5.1): un paciente que se duerme en la camilla o en la bicicleta estática.
2. **Cambia la interpretación**:
   - **La rigidez** limita la movilidad pasiva y la del tronco (Osborne 2022, flexibilidad). No es una restricción capsular.
   - **El dolor** es frecuente y en parte sigue a la medicación: el off se acompaña de dolor, sudor y taquicardia (Simonet 2019).
   - **El hombro doloroso o congelado** y la asimetría del braceo pueden ser lo primero (Paggou 2023), aunque el riesgo absoluto es bajo (Gadgaard 2024).
   - **On u off cambia lo que se mide**: los resultados de las pruebas y del ejercicio son distintos en una fase y otra (Osborne 2022). Una reevaluación tiene que anotar en qué fase se hizo.
   - **La FC sube menos** con el esfuerzo por la disautonomía: la intensidad se vigila también con el esfuerzo percibido (Osborne 2022).

**Es capa transversal**, como las otras de la Fase P, no contenido de una región.

## Principios (los de la Fase P)

1. **Capa transversal, no fase nueva**: tarjeta en la fase 1, sistema de la fase 2 que solo aparece con la tarjeta marcada, línea en la 4b, recuadro en la 5 y avisos en la 6.
2. **El árbol CIF y el motor de puntuación no se tocan.**
3. **El fisio no diagnostica el Parkinson**, ni ajusta la medicación (como en la guía de fármacos): nunca «tome más», «no tome» ni «cambie la hora».
4. **La seguridad no se recorta**: las urgencias nunca se pliegan, sin embudo en modo breve, y marcar la tarjeta nunca quita ni rebaja una `urgencia` de otro sistema (test unitario, como en las demás).
5. **Sin contenido clínico inventado**: cada frase sale de una fuente leída o se marca «redacción propia» para tu revisión.
6. **Ninguna regla automática con otras tarjetas** (decisión 9): ni con la de disautonomía, ni con la de osteoporosis, ni con la de fármacos.

## Forma propuesta (borrador)

### Fase 1 — tarjeta «Parkinson» (`#cardParkinson`)

Después de la del paciente anticoagulado.

- **Estado**: «Diagnosticado» y, si se acepta la decisión 2, «Sospecha». Nada marcado = no consta; un segundo toque lo borra.
- Con «Diagnosticado», filas de botones (segundo toque borra), cada una con su porqué:
  - **Estadio de Hoehn y Yahr, si lo sabe**: 1–2 · 3 · 4–5 · no lo sabe. Porque la evidencia de las pautas es casi toda de 1–3 (Osborne 2022), y en 4–5 el recuadro lo dice (decisión 4).
  - **Fluctuaciones on/off**: No · Sí · No lo sabe (Simonet 2019; Osborne 2022).
  - **Fase ahora**: On · Off · No sabría decir. Solo se pinta con fluctuaciones = Sí. Para anotar en qué fase se hace la valoración (decisión 5).
  - **Congelación de la marcha**: Sí · No (Osborne 2022: bicicleta antes que cinta; estímulos externos).
  - **Caídas en el último año**: reutiliza las preguntas de NICE NG249 que ya usa la osteoporosis (decisión 8).
  - **Estimulador cerebral profundo**: No · Sí · No lo sabe. Con «Sí», la línea de la diatermia (pendiente de fuente) y la pregunta de la fase 2 del estimulador.
  - **Otros dispositivos**: bomba de apomorfina o de levodopa intestinal (chips). Opcional (decisión 6).
- Con «Sospecha»: solo la línea de derivación (fase 2).
- `_pintarPKUI()` pone `body.parkinson`; un cambio vacía la 4b (`_invalidar4b()`) y repinta el cribado (`_repintarCribado()`), como en las demás.

### Fase 2 — sistema «Parkinson» (`SIS_PARKINSON`, `transversal_parkinson`)

`soloParkinson: true`, sin embudo en modo breve. Borrador de preguntas, cada una con su `razonamiento` de las fuentes leídas:

| Id propuesto | Pregunta (borrador) | Tipo | Estado | Fuente |
|---|---|---|---|---|
| `pk_u_crisis` | «En los últimos días, ¿está mucho más rígido o inmóvil que de costumbre y además tiene fiebre, está confuso, suda mucho o le cuesta tragar?» | `urgencia` (hoy, urgencias hospitalarias) | Diagnosticado | Pötter-Nerger 2024; Simonet 2019 |
| `pk_u_medicacion` | «¿Ha dejado de tomar su medicación del Parkinson, o no la puede tomar o retener (vómitos, diarrea, no puede tragar, una cirugía), y está peor?» | `urgencia` o `derivacion` (decisión 3) | Diagnosticado | NICE NG71, 1.3.2; Simonet 2019, tabla 1 |
| `pk_u_estimulador` | «Con el estimulador cerebral: ¿han vuelto de golpe el temblor, la rigidez o la lentitud, o tiene movimientos involuntarios fuertes o cambios de conducta nuevos?» | `derivacion` hoy al centro implantador; `urgencia` si se suma lo de `pk_u_crisis` (decisión 3) | Con estimulador = Sí | Simonet 2019 |
| `pk_d_ortostatica` | «¿Se marea, ve borroso o nota las piernas flojas al ponerse de pie, y se le pasa al sentarse o tumbarse?» | `derivacion` (no urgente), con el bloque de medida (decisión 10) | Los dos | LeWitt 2020, tabla 3; NICE NG71, 1.5.8 |
| `pk_d_tragar` | «¿Tose o se atraganta al comer o beber, o ha tenido infecciones respiratorias seguidas?» | `derivacion` (médico, logopedia) | Diagnosticado | Simonet 2019; NICE NG71, 1.7.8 |
| `pk_d_sueno` | «¿Se queda dormido de repente durante el día, sin poder evitarlo?» | `derivacion` | Diagnosticado | Simonet 2019; NICE NG71, 1.5.1 |
| `pk_d_sospecha` | Con «Sospecha»: «Temblor, rigidez, lentitud, problemas de equilibrio o de la marcha sin diagnóstico» | `derivacion` preferente, «pronto y sin tratar» al especialista | Sospecha | NICE NG71, 1.2.1–1.2.2 |

- **El síncope ya está** en cada región (`sx_sincope`, urgente; `docs/pots.md`, decisión 9). No se repite; `pk_d_ortostatica` cubre el mareo al ponerse de pie sin desmayo.
- **El ánimo y el riesgo de suicidio tras la cirugía del estimulador** (Simonet 2019) se dejan fuera por ahora (decisión 11). Si entran, irían como en el embarazo: `privada: true`, la urgencia en `ur` y nunca el texto de la pregunta en `sq`.
- **Bloque de medida** `[data-pk-bloque]` (decisión 10): la medida de la tensión tumbado y de pie de LeWitt 2020 (5 min tumbado, de pie al minuto 1 y al 3; ≥20/10 mmHg). Opción A: reutilizar la prueba de bipedestación de la disautonomía (`lib/disautonomia.js`, con reloj), solo con los minutos 1 y 3 y sin la regla del POTS. Opción B: solo el texto de cómo medirla, sin tabla.

### Fase 3 — SINSS

Una línea `.solo-pk` bajo la matriz de irritabilidad: «Anota si está en on u off: el dolor y la tolerancia cambian con la medicación» (Simonet 2019; Osborne 2022). La irritabilidad no cambia de regla.

### Fase 4 — árbol CIF

Sin cambios. La sospecha de Parkinson desde el hombro (Paggou 2023) **no** va como pista del árbol (decisión 7).

### Fase 4b — una línea general, sin tocar las LR

`.pk-nota-4b` encima de las tarjetas: «La rigidez limita la movilidad pasiva y el temblor puede enmascarar la respuesta: compara con el otro lado y anota si está en on u off» (redacción propia sobre Osborne 2022 y Paggou 2023; pendiente de la guía KNGF). Con estimulador, nada en la 4b: la diatermia no es un test.

Para los tests que cargan hueso, ya existe `cargaOsea` en la osteoporosis. **No se activa con el Parkinson** (decisión 9): la línea del recuadro sugiere valorar la tarjeta de osteoporosis.

### Fase 5 — recuadro «Parkinson» (`.pk-fase5`, nunca se pliega)

Borrador de líneas, cada una con su fuente:

1. **Ejercicio, con lo que usaron los ensayos** (no una dosis óptima establecida; Osborne 2022): aeróbico moderado a alto, al menos 3 días/semana, 30–40 min; fuerza progresiva 1–2 días/semana; equilibrio 2–3 veces/semana; marcha 20–60 min, 3–5 días/semana, 4–12 semanas. Lo ganado se pierde si se deja.
2. **Intensidad**: la FC puede subir menos; vigila también el esfuerzo percibido (Osborne 2022).
3. **Con congelación de la marcha o riesgo de caída**: bicicleta antes que cinta; estímulos externos (auditivos o visuales) para la marcha (Osborne 2022).
4. **Hoehn y Yahr 4–5**: «Las pautas se estudiaron sobre todo en estadios 1–3» (Osborne 2022).
5. **On/off**: haz la valoración y la reevaluación en la misma fase y anótala (Osborne 2022). Si se lee la guía KNGF: citar la sesión en fase «on».
6. **Hipotensión ortostática**: levantarse en dos tiempos; maniobras físicas (cruzar las piernas tensando, inclinarse hacia delante, ponerse en cuclillas) (LeWitt 2020, tabla 4). Los fármacos, la sal y el agua son del médico.
7. **Caídas y hueso**: riesgo de fractura 2,66 veces mayor (Tan 2014); valora la tarjeta de osteoporosis y la prudencia con el thrust (redacción propia; decisión 9).
8. **Ataques de sueño**: no le dejes solo en la bicicleta o la cinta si se duerme de golpe (redacción propia sobre Simonet 2019).
9. **Con estimulador**: **no apliques diatermia** (onda corta, microondas, ultrasonido terapéutico) aunque esté apagado. **Pendiente de fuente: no se escribe sin leer el aviso de la FDA o el etiquetado.** La electroterapia (TENS) queda pendiente de la misma lectura.
10. **Fisioterapia con experiencia en Parkinson**: NICE NG71 (1.7.2–1.7.3) y Osborne 2022 (buena práctica) la recomiendan.

Salidas, como las demás:
- `📋 Notas`: «🧠 PARKINSON:» (estado, Hoehn y Yahr, fluctuaciones, fase de la valoración, estimulador).
- `📄 Informe`: «ENFERMEDAD DE PARKINSON» (diagnosticado) o «RECOMENDACIÓN DE VALORACIÓN MÉDICA» (sospecha, **sin la palabra Parkinson**, como en el lupus y la osteoporosis).
- Bloque de la IA `bloquePKIA()` sin citas, con su `PK_CASOS` para la copia de physiq-report (`_bloquePK`).
- Payload `pk`: `{ es, hy, fl, fa, cg, ec, dp }` (estado, Hoehn y Yahr, fluctuaciones, fase de la valoración, congelación, estimulador, otros dispositivos). Solo con la tarjeta marcada, para no cambiar la `huella` de los informes antiguos.

### Fase 6 — plan de tratamiento

- **Aviso `parkinson`** (cualquier región): las líneas 1–3 y 5 del recuadro, más «sesión en la misma fase on/off que la reevaluación».
- **Aviso `parkinsonEstimulador`**: la diatermia (pendiente de fuente).
- **Red de seguridad `RED_PARKINSON`**: si en los días siguientes está mucho más rígido o inmóvil con fiebre o confusión, o deja de poder tomar la medicación → urgencias (Pötter-Nerger 2024; NICE NG71, 1.3.2).
- **Sin tope de thrust propio** (decisión 9): el tope lo pone la tarjeta de osteoporosis si se marca.
- Programa para casa: ejercicio regular a largo plazo (Osborne 2022: lo ganado se pierde si se deja).

### Guía de condiciones especiales

Fila `parkinson`: «qué es», «Piensa en ella si:» (temblor, rigidez, lentitud o problemas de marcha sin diagnóstico; paciente con Parkinson que viene por otro dolor), «Al marcarla, añade:», fuentes y botón a `#cardParkinson`.

### Guía «Efectos del ejercicio»

Un bloque «Ejercicio en el Parkinson» tendría fuentes clínicas (Osborne 2022 y la Cochrane de 2024, pendiente). Se propone como paso aparte (decisión 13), con el procedimiento de `docs/efectos-ejercicio.md`.

## Contradicciones y huecos entre fuentes

1. **Dosis del ejercicio**: Osborne 2022 da lo que usaron los ensayos, pero dice que la dosis óptima no está determinada. **Propuesta**: citarla como «lo que usaron los ensayos».
2. **Alta frente a moderada intensidad**: un ensayo de fase II solo vio menos empeoramiento motor con la alta, pero las comparaciones directas no encontraron diferencias (Osborne 2022). **Propuesta**: «moderada a alta», sin preferir una.
3. **Ejercicio y caídas**: Osborne 2022 da menos caídas con fuerza y equilibrio; Simonet 2019 dice que la mayoría de los estudios no muestran un beneficio constante en la prevención de caídas. **Propuesta**: no prometer menos caídas en el texto al paciente; sí recomendar el equilibrio.
4. **Hombro congelado como señal precoz**: Paggou 2023 lo propone; Gadgaard 2024 no encuentra más riesgo que tras un dolor lumbar. **Propuesta**: ninguna regla (decisión 7).
5. **Estimulación cerebral profunda y fisioterapia**: Osborne 2022 no encontró estudios. **Propuesta**: solo seguridad (diatermia, fallo del estimulador), ninguna pauta propia.

## Decisiones (cada una con mi recomendación; aceptadas las 16 por el usuario, noviembre 2026)

1. **¿Hacer la condición especial?** Recomiendo **sí**, con la forma propuesta.
2. **¿Estado «Sospecha»?** Recomiendo **sí**: NICE NG71 (1.2.1–1.2.2) da qué síntomas y qué hacer (derivar pronto y sin tratar). Con «Sospecha» solo sale la derivación, nunca la palabra Parkinson en el 📄 Informe.
3. **Retirada de la medicación y fallo del estimulador**: ¿`urgencia` o `derivacion`? Recomiendo **`derivacion` hoy** al equipo que le lleva (neurología o centro implantador), y **`urgencia`** solo cuando además hay fiebre, confusión, sudor o no puede tragar (`pk_u_crisis`). Así se separa lo que puede esperar a una llamada de lo que va a urgencias.
4. **Hoehn y Yahr en la tarjeta**: recomiendo **sí, opcional** («no lo sabe» válido). Solo cambia una línea del recuadro.
5. **Fase on/off de la valoración**: recomiendo **sí**, solo con fluctuaciones marcadas.
6. **Bombas de apomorfina o de levodopa intestinal**: recomiendo **no por ahora**. Las fuentes leídas solo dan sus complicaciones médicas, nada para el fisio.
7. **Hombro congelado → sospecha de Parkinson**: recomiendo **ninguna regla**. Como mucho, un párrafo en el razonamiento de un paso del árbol de hombro, en otra sesión (Gadgaard 2024: riesgo absoluto bajo e igual que tras dolor lumbar).
8. **Caídas**: recomiendo **reutilizar el bloque de caídas de la osteoporosis** (NICE NG249, sin puntuar), en vez de escribir otro.
9. **Hueso y thrust**: recomiendo **ninguna regla automática** con la osteoporosis. Una línea en el recuadro sugiere valorar esa tarjeta (Tan 2014). Coherente con las demás condiciones.
10. **Hipotensión ortostática**: recomiendo la **opción A**, reutilizar la prueba de bipedestación de la disautonomía con los minutos 1 y 3, sin la regla del POTS. No se marca la tarjeta de disautonomía: en el Parkinson la hipotensión es neurogénica, no un POTS.
11. **Ánimo y riesgo de suicidio tras el estimulador**: recomiendo **dejarlo fuera de esta versión**, apuntado en «Fuera de este diseño».
12. **Cuestionario específico** (PDQ-39 o PDQ-8): recomiendo **no añadir ninguno** hasta comprobar una validación en español de España.
13. **Bloque en la guía «Efectos del ejercicio»**: recomiendo **sí, como paso aparte**, después de leer la Cochrane de 2024.
14. **Línea de la diatermia**: recomiendo **no implementar la tarjeta sin ella**. Pido el aviso de la FDA de 2002 o el manual de un estimulador (Medtronic, Abbott o Boston Scientific) en PDF, y comprobar si dice algo de la TENS.
15. **Guía europea KNGF**: recomiendo **leerla antes de implementar**. Es la guía de fisioterapia de referencia en Europa y puede cambiar las líneas on/off, de evaluación y de estrategias de movimiento.
16. **Registrar en `data/referencias.js`** solo las fuentes que use el texto final (como en las demás).

## Fuera de este diseño (apuntado, no resuelto)

- Parkinsonismos atípicos (atrofia multisistémica, parálisis supranuclear progresiva) y parkinsonismo por fármacos. Osborne 2022 los excluye.
- El ánimo, la psicosis y los trastornos del control de impulsos (Simonet 2019): del médico.
- La disfagia más allá de derivar: es de logopedia (NICE NG71, 1.7.8).
- Los fármacos antiparkinsonianos como familia de la guía de fármacos (`docs/farmacologia.md`): habría que proponerla aparte, con sus fuentes.

## Cambios técnicos previstos (si se aceptan las decisiones)

- `state.parkinson` + normalización en `lib/parkinson.js` (puro, con tests): visibilidad, pendientes de modo breve, `pkPayload`, textos de 📋 Notas, 📄 Informe e IA.
- `SIS_PARKINSON` en `data/comun.js`, añadido a los 7 `data/<región>.js`; `soloParkinson` en `sistemasActivos()`.
- Tarjeta en `index.html` y `app.js` (`_pintarPKUI`, `selectPKEstado`, `selectPKFila`), expuesta en `window`.
- Recuadro de la fase 5, aviso y red de la fase 6 (`data/plan-tratamiento.js`, regenerar `docs/plan-tratamiento-frases.md`).
- Fila en `data/condiciones.js`; hojas impresas afectadas (cribado de las 7 regiones, `condiciones`, `plan`) regeneradas con sus cuadernos.
- `tests/unit/parkinson.mjs` (incluida «marcar la tarjeta nunca quita ni rebaja una urgencia de otro sistema») y sección de humo `parkinson`.
- physiq-report: `_bloquePK` con `PK_CASOS`.

## Siguiente paso

1. ~~Tus decisiones 1–16~~: aceptadas las 16 recomendaciones (noviembre 2026).
2. PDF pedidos al usuario (noviembre 2026; los dominios no son accesibles desde este entorno):
   - Decisión 14: aviso de la FDA de 2002 sobre diatermia y electrodos implantados, o el manual del médico de un estimulador cerebral profundo (contraindicaciones y advertencias).
   - Decisión 15: guía europea de fisioterapia KNGF/ParkinsonNet 2014 (guía completa, no solo las tarjetas de consulta rápida).
   - Opcional: Torsney 2014.
3. Con eso: leer en PMC las revisiones del dolor y la Cochrane de 2024, cerrar el texto y pedir la revisión al usuario antes de escribir código.
