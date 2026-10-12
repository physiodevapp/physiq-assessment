# Hipermovilidad / Ehlers-Danlos — diseño

Estado: **decisiones cerradas (octubre 2026), sin implementar**. Primer caso de una capa de «condiciones especiales»: condiciones que cambian la **seguridad** o la **interpretación** de la valoración, no simples comorbilidades (criterio de entrada, para que no se convierta en un cajón de sastre). Seguimiento en `MIGRATION_PLAN.md`, Fase J.

Pendiente antes de escribir contenido clínico: **leer las fuentes en texto completo** (ver «Fuentes»). Desde la sesión de diseño solo se pudo leer el resumen en PubMed; Wiley devuelve 403 y la web de la Ehlers-Danlos Society no resuelve. Las cifras marcadas «(a verificar)» salen de memoria y no pueden pasar a `data/` sin leer el artículo.

## Decisiones tomadas (octubre 2026)

Aceptadas las cinco recomendaciones:

1. **Activación en la fase 1 con tres estados**: No consta · Diagnosticada · Sospecha. Si es «Diagnosticada», subtipo: hipermóvil (SEDh) o trastorno del espectro de la hipermovilidad (TEH) · vascular · otro · no lo sabe. El cribado de la fase 2 no se ofrece a todos los pacientes: solo aparece con la condición activada.
2. **Puntuación de la fase 4b, opción A**: las pruebas basadas en la laxitud llevan un aviso y su LR **no cambia**. No hay LR publicadas en población hipermóvil, así que anularlas o rebajarlas sería inventar un ajuste.
3. **Subtipo vascular, en dos niveles**:
   - **Urgencia** (`urgencia`, «Derivación urgente hoy»): dolor brusco e intenso en el tórax, el abdomen, el flanco o la espalda en un paciente con el subtipo vascular diagnosticado o sospechado, por posible disección o rotura arterial o de una víscera hueca.
   - **Derivación preferente**, sin urgencia: rasgos que hacen sospechar el subtipo vascular sin un cuadro agudo. Por ejemplo, muertes súbitas o roturas arteriales jóvenes en la familia, neumotórax espontáneo, piel fina y translúcida o hematomas extensos sin traumatismo. Redacción final según Byers 2017.
4. **POTS / disautonomía fuera del piloto.** Queda como siguiente paso, con su propia fuente.
5. **Fuentes**: Malfait 2017 (clasificación internacional), Hakim y Grahame 2003 (cuestionario de 5 preguntas), Byers 2017 (subtipo vascular) y Engelbert 2017 (fisioterapia en TEH/SEDh). Todas leídas enteras antes de redactar. Si el usuario aporta un capítulo de Lluch 2020 u otra fuente preferida, se añade.

## Principios

1. **Es una capa transversal, no una fase nueva.** Sigue el patrón del paciente posquirúrgico: tarjeta en la fase 1, sistema de cribado que solo aparece si se activa, avisos en la fase 4b y recuadro en la fase 5.
2. **El árbol CIF no se toca.** La hipermovilidad no es una hipótesis del árbol, sino una condición que cambia cómo se interpretan las demás. Ni navegación ni snapshot cambian.
3. **El motor de puntuación no se toca** (decisión 2).
4. **El fisio no diagnostica.** Con «Sospecha», el resultado se redacta como «patrón compatible con hipermovilidad generalizada → valorar derivación a reumatología o genética», como en el criterio de Goodman de lumbar, nunca como «probable SEDh».
5. **La seguridad no se recorta**, igual que en el modo breve: las preguntas del subtipo vascular nunca se pliegan.
6. **Sin contenido clínico inventado.** Las preguntas y los textos son un borrador hasta leer las fuentes y pasar la revisión clínica del usuario antes de `main`.

## Flujo propuesto

### Fase 1 — tarjeta «Hipermovilidad»
- Va justo después de Mecanismo de inicio y de la tarjeta Cirugía, antes de Cronología.
- No es obligatoria. «No consta» es el valor por defecto y no añade nada a ninguna fase.
- Con «Diagnosticada» o «Sospecha», añade la clase `body.hipermovilidad` (como `body.posquirurgico`). La clase muestra los elementos `.solo-hm` de las demás fases.
- En modo breve no se pliega: es la que decide si aparecen las preguntas del subtipo vascular.
- Si el formulario previo menciona «Ehlers-Danlos» o «hipermovilidad» en enfermedades, no se preselecciona nada. Como mucho, la pista «📝 Refiere el paciente» sobre la tarjeta.

### Fase 2 — sistema «Hipermovilidad»
Un sistema común nuevo en `data/comun.js` (p. ej. `SIS_HIPERMOVILIDAD`, id `transversal_hipermovilidad`). Es la misma instancia en las 7 regiones y lleva `soloHipermovilidad: true`, que `sistemasActivos()` resuelve igual que `soloPosquirurgico`. Contenido:

| Bloque | Cuándo | Contenido (borrador) |
|---|---|---|
| Cuestionario de 5 preguntas | Sospecha | Las cinco preguntas de Hakim y Grahame 2003 (sí/no). Según el resumen, **2 o más «sí»** detectan hipermovilidad con sensibilidad del 84 % y especificidad del 89 % (80 % en la cohorte de validación). Texto literal de las preguntas pendiente de leer el artículo |
| Escala de Beighton (0–9) | Sospecha (opcional con Diagnosticada) | Elemento nuevo: hoy la fase 2 solo tiene preguntas sí/no. Nueve casillas: meñique >90° en cada mano, pulgar al antebrazo en cada mano, codo >10° en cada lado, rodilla >10° en cada lado, y palmas al suelo con las rodillas extendidas. La suma se calcula, nunca se guarda (como el IMC). Puntos de corte por edad según Malfait 2017 **(a verificar)**: ≥6 antes de la pubertad, ≥5 desde la pubertad hasta los 50 años y ≥4 a partir de los 50. Usa `state.edadPaciente`, con el mismo aviso discreto que el criterio de Goodman cuando falta la edad |
| Resultado | Sospecha | Caja tipo `criterioCompuesto`: «patrón compatible con hipermovilidad generalizada (Beighton X/9; cuestionario Y/5) → valorar derivación a reumatología o genética». Solo es un hallazgo, no un criterio diagnóstico de SEDh (los criterios 2 y 3 de Malfait 2017 quedan fuera del alcance del fisio) |
| Subtipo vascular: urgencia | Diagnosticada vascular, o Sospecha | Una pregunta con `urgencia` y clase `.sq2-urg`, que nunca se pliega (decisión 3) |
| Subtipo vascular: sospecha | Sospecha, o Diagnosticada con subtipo «no lo sabe» | Preguntas de derivación preferente, sin `urgencia` (decisión 3) |

Cada pregunta lleva su `razonamiento` (Fase F) con las fuentes del registro.

### Fase 3 — SINSS
- No cambia la lógica.
- Una línea `.solo-hm` en la tarjeta Estabilidad: «en hipermovilidad generalizada, valora la estabilidad frente al lado sano y frente a lo que el paciente refiere (subluxaciones), no frente a la norma».
- Una línea en Naturaleza sobre el dolor generalizado. Ambas con fuente (Engelbert 2017).

### Fase 4 — árbol CIF
Sin cambios.

### Fase 4b — aviso en las pruebas de laxitud
- Campo nuevo y opcional en el test: `laxitud: true`. Marca las pruebas cuyo positivo depende de la laxitud, no de un síntoma.
- Con la condición activa, la tarjeta del test muestra bajo el «cuánto pesa»: *«Hipermovilidad: una laxitud bilateral puede ser normal en este paciente. Compara con el lado sano; cuenta como positivo si es asimétrica o reproduce su síntoma.»*
- El LR no cambia (decisión 2). Tampoco va en el payload ni en los resúmenes.

Candidatas medidas en el código (octubre 2026), para la revisión clínica del usuario. Una por una, porque no todas se basan solo en la laxitud:

| Región | Hipótesis | Test | LR hoy |
|---|---|---|---|
| Rodilla | `ro4` | Lachman | LR+ 5,72 / LR− 0,24 |
| Rodilla | `ro4` | Cajón anterior | LR+ 6,34 / LR− 0,20 |
| Rodilla | `ro4` | Pivot shift | LR+ 10,70 / LR− 0,56 |
| Rodilla | `ro4` | «Confirmar: … + Lachman positivo» | LR+ 17,5 |
| Rodilla | `ro9` | Cajón posterior a 90° | — |
| Rodilla | `ro10` | Varo forzado a unos 30° · cajón posterolateral | — |
| Hombro | `h4` | Inestabilidad multidireccional: surco + tests en una dirección | — |
| Cadera | `ca12` | Log roll | — |
| Codo | `co4` | Valgo estático (laxitud) | LR− 0,81 (no puntúa) |
| Codo | `co5` | Cajón posterolateral / pivote lateral · laxitud en varo | — |
| Codo | `co15` | Dolor y laxitud con el estrés en valgo | — |
| Tobillo y pie | `tp1` | Cajón anterior (a los 4–6 días) | — |
| Tobillo y pie | `tp21` | Cajón anterior: signo del surco · laxitud subastragalina | — |
| Tobillo y pie | `tp22` | Laxitud del LPAA y del LPC | — |

No llevan el aviso: aprensión, recolocación y sorpresa (el positivo es el síntoma), ni las pruebas de dolor. Las únicas que hoy multiplican son las de `ro4`. Lachman ya se valora frente al lado sano, así que el aviso refuerza lo que dice la técnica.

### Fase 5 e informes
- **Recuadro «Hipermovilidad»** al principio de la fase 5, como el de «Paciente posquirúrgico»:
  - estado y subtipo;
  - Beighton y cuestionario, si se hicieron;
  - consideraciones de carga, rango final y propiocepción, con fuente (Engelbert 2017);
  - con «Sospecha», la línea de derivación.
  - Nunca se pliega.
- **📋 Notas**: línea «🧬 HIPERMOVILIDAD: …».
- **📄 Informe** (paciente o médico): «Hipermovilidad articular generalizada (diagnosticada)», en antecedentes. Con «Sospecha», «se recomienda valoración por reumatología», sin la palabra Ehlers-Danlos.
- **Payload**: campo nuevo `hm`: `{ es, st, bt, cu }` (estado, subtipo, Beighton, cuestionario). Solo se añade si el estado no es «No consta». physiq-report tendrá que leerlo, igual que `cq` y `dt` (otro repositorio).
- **Informe con IA**: un bloque de datos «Hipermovilidad» en `construirAmpliado()`. `lib/reglas-informe.js` no se toca salvo que una revisión real lo pida, porque está compartido byte a byte con physiq-report.
- **Modo breve**: con «Sospecha», un Beighton sin hacer es un pendiente (`ancla: 'cardHipermovilidad'`).

## Estado y cambios técnicos (cuando se implemente)

```js
hipermovilidad: {
  estado: '',          // '' (no consta) | 'diagnosticada' | 'sospecha'
  subtipo: '',         // '' | 'hipermovil' | 'vascular' | 'otro' | 'ns'
  beighton: {},        // { menique_d, menique_i, pulgar_d, pulgar_i, codo_d, codo_i, rodilla_d, rodilla_i, tronco }: boolean
  cuestionario: {},    // { [preguntaId]: 'SI' | 'NO' }
}
```

- `lib/hipermovilidad.js`: funciones puras (suma de Beighton, punto de corte por edad, resultado, textos compartidos), con pruebas unitarias.
- Sistema `SIS_HIPERMOVILIDAD` en `data/comun.js`, añadido a las 7 regiones; `sistemasActivos()` lo filtra.
- Nuevo tipo de elemento en la fase 2 para la escala de Beighton (casillas que suman), solo en este sistema.
- Campo `laxitud: true` en los tests elegidos (`data/<región>.js`). Una prueba unitaria fija la lista, como la de `notaPosquirurgica`.
- Referencias nuevas en `data/referencias.js` y `node tests/gen-referencias.mjs`.
- `_softResetApp()`, restauración de sesión, exportar/importar (va dentro de `state`), `deploy-to-hub.yml` si se crea `lib/hipermovilidad.js`.
- Pruebas unitarias: nada sin la condición activa, `hm` en el payload, el aviso nunca en payload ni resúmenes, la pregunta urgente con `.sq2-urg`.
- Prueba de humo: la tarjeta, el sistema, el aviso en Lachman, el recuadro de la fase 5 y la prueba a 320 px.

## Fuentes

| Clave propuesta | Referencia | Uso | Estado |
|---|---|---|---|
| `Malfait 2017` | Malfait F, et al. The 2017 international classification of the Ehlers-Danlos syndromes. *Am J Med Genet C* 2017;175(1):8–26. [doi:10.1002/ajmg.c.31552](https://doi.org/10.1002/ajmg.c.31552) | Puntos de corte de Beighton por edad, criterios de SEDh, subtipos | Solo resumen; texto completo pendiente |
| `Hakim y Grahame 2003` | Hakim AJ, Grahame R. A simple questionnaire to detect hypermobility. *Int J Clin Pract* 2003;57(3):163–6. PMID 12723715 | Cuestionario de 5 preguntas, ≥2 «sí», S 84 % / E 89 % y 80 % | Solo resumen; texto completo pendiente (preguntas literales) |
| `Byers 2017` | Byers PH, et al. Diagnosis, natural history, and management in vascular Ehlers-Danlos syndrome. *Am J Med Genet C* 2017;175(1):40–47. [doi:10.1002/ajmg.c.31553](https://doi.org/10.1002/ajmg.c.31553) | Subtipo vascular: rasgos de sospecha, rotura arterial o visceral, «minimizar lesiones» | Solo resumen; texto completo pendiente |
| `Engelbert 2017` | Engelbert RHH, et al. The evidence-based rationale for physical therapy treatment of children, adolescents, and adults diagnosed with joint hypermobility syndrome/hypermobile Ehlers Danlos syndrome. *Am J Med Genet C* 2017;175(1):158–167. [doi:10.1002/ajmg.c.31545](https://doi.org/10.1002/ajmg.c.31545) | Valoración y tratamiento en fisioterapia (marco CIF); el resumen avisa de que la evidencia es «limitada en tamaño y calidad» | Solo resumen; texto completo pendiente |
| (opcional) Castori 2017 | Marco del trastorno del espectro de la hipermovilidad (TEH/HSD), mismo número de *Am J Med Genet C* | Terminología TEH frente a SEDh | Por localizar |

Ninguno está en PubMed Central. Para leerlos hace falta el PDF del usuario o una copia de acceso abierto.

## Siguiente paso

1. Leer las cuatro fuentes enteras (PDF del usuario) y corregir aquí lo marcado «(a verificar)».
2. Revisión clínica del usuario de: la lista de tests con `laxitud`, el texto del aviso, las preguntas del subtipo vascular y el recuadro de la fase 5.
3. Implementar en una sesión, en el orden fase 1 → fase 2 → fase 4b → fase 5 → informes.
