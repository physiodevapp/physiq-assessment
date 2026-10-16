# Hipermovilidad / Ehlers-Danlos — diseño

Estado: **decisiones cerradas (octubre 2026), fuentes leídas, recomendaciones de revisión aceptadas (ver «Revisión del borrador»), implementado (octubre 2026; ver «Implementación»), pendiente de revisión del usuario antes de `main`**. Primer caso de una capa de «condiciones especiales»: condiciones que cambian la **seguridad** o la **interpretación** de la valoración, no simples comorbilidades (criterio de entrada, para que no se convierta en un cajón de sastre). Seguimiento en `MIGRATION_PLAN.md`, Fase P.

Fuentes leídas enteras en PDF del usuario (octubre 2026): Malfait 2017 (pp. 8–26), Byers 2017 (pp. 40–47) y Engelbert 2017 (pp. 158–167). Hakim y Grahame 2003 no se ha leído entero: no está en PubMed Central, PubMed no le da DOI ([PMID 12723715](https://pubmed.ncbi.nlm.nih.gov/12723715/)) y la editorial no es accesible desde la sesión. No hace falta: Malfait 2017 reproduce el cuestionario en su tabla III (p. 17), así que se cita Malfait (ver «Fuentes»).

## Decisiones tomadas (octubre 2026)

Aceptadas las cinco recomendaciones:

1. **Activación en la fase 1 con tres estados**: No consta · Diagnosticada · Sospecha. Si es «Diagnosticada», subtipo: hipermóvil (SEDh) o trastorno del espectro de la hipermovilidad (TEH) · vascular · otro · no lo sabe. El cribado de la fase 2 no se ofrece a todos los pacientes: solo aparece con la condición activada.
2. **Puntuación de la fase 4b, opción A**: las pruebas basadas en la laxitud llevan un aviso y su LR **no cambia**. No hay LR publicadas en población hipermóvil, así que anularlas o rebajarlas sería inventar un ajuste. Ver la salvedad sobre la fuente del aviso en la sección de la fase 4b.
3. **Subtipo vascular, en dos niveles**:
   - **Urgencia** (`urgencia`, «Derivación urgente hoy»): cuadro agudo compatible con disección o rotura arterial, rotura de colon o fístula carótido-cavernosa en un paciente con el subtipo vascular diagnosticado o sospechado (Byers 2017, pp. 43–45; borrador en la fase 2).
   - **Derivación preferente**, sin urgencia: rasgos que hacen sospechar el subtipo vascular sin un cuadro agudo (Malfait 2017, p. 16; Byers 2017, p. 41).
4. **POTS / disautonomía fuera del piloto.** Queda como siguiente paso. Engelbert 2017 (p. 165) pide derivar al especialista cuando hay signos sistémicos importantes, entre ellos la disautonomía cardíaca; esa línea sí puede ir en el recuadro de la fase 5.
5. **Fuentes**: Malfait 2017, Byers 2017 y Engelbert 2017, leídas enteras. Hakim y Grahame 2003, a través de la tabla III de Malfait 2017.

## Revisión del borrador (octubre 2026)

Aceptadas las cinco recomendaciones de la revisión; ya están aplicadas en las secciones de cada fase:

1. **Aviso de laxitud**: solo como regla de técnica, sin afirmar nada sobre la precisión de las pruebas. Se apoya únicamente en la definición de HAG (Malfait 2017, p. 17). Si aparece una fuente sobre la precisión en personas hiperlaxas, se añade.
2. **Cuestionario**: traducción casi literal, con «abrirse de piernas del todo (spagat)» en la 3 y «hiperlaxa, “de goma”» en la 5. El razonamiento dice que es una traducción propia, no validada; si existe una versión española validada, se usa esa.
3. **Subtipo vascular**:
   - La urgencia se parte en tres preguntas, cada una con su mensaje.
   - Las preguntas de sospecha llevan una regla: basta un «sí» en antecedentes familiares o en una rotura propia; para el resto hacen falta 2 o más «sí».
   - Las varices llevan el matiz de Malfait (antes de los 30 años y, en una mujer, sin embarazos previos).
4. **Tests con `laxitud`**: todos los de la tabla menos las dos pruebas compuestas de `ro4`: 16 tests en 5 regiones.
5. **Recuadro de la fase 5**:
   - Líneas pegadas a la fuente; lo de las 24 h, «(observado en niños)».
   - La línea de actividad del subtipo vascular, solo con ese subtipo diagnosticado.
   - La derivación por signos sistémicos, como línea fija.
   - La TA, fuera del piloto.

## Lo que dicen las fuentes (lo que usa el diseño)

**Malfait 2017** (clasificación internacional):
- Puntos de corte de Beighton para la hipermovilidad articular generalizada (HAG) en el SEDh: **≥6 en niños prepúberes y adolescentes, ≥5 en hombres y mujeres púberes hasta los 50 años y ≥4 por encima de los 50** (p. 17).
- Si la puntuación queda **1 punto por debajo** del corte de su edad y sexo **y** el cuestionario de 5 preguntas es positivo (al menos 2 «sí»), se puede diagnosticar HAG (p. 17). El cuestionario no está validado en niños.
- Tabla III (p. 17): las cinco preguntas, adaptadas de Hakim y Grahame 2003. Dos o más «sí» sugieren hipermovilidad, con una sensibilidad del 80–85 % y una especificidad del 80–90 %.
- Las cinco maniobras de Beighton, con goniómetro y cada lado por separado (fig. 2, p. 15):
  - meñique: MCF en hiperextensión de más de 90°, con la palma y el antebrazo apoyados y el codo a 90°;
  - pulgar: se lleva pasivamente hasta tocar el antebrazo;
  - codo: hiperextensión de más de 10°;
  - rodilla: recurvatum de más de 10°, de pie;
  - tronco: palmas planas en el suelo con las rodillas extendidas.
  
  Máximo 9 puntos.
- Una limitación adquirida (cirugía, artrodesis lumbar…) se puntúa **negativa** si hoy no se puede hacer, aunque antes sí se pudiera. Beighton es un método de cribado y la «HAG probable» no sustituye a la HAG (p. 18).
- El diagnóstico de SEDh exige los criterios 1, 2 y 3 (pp. 17–19). El 2 y el 3 (rasgos sistémicos, antecedentes familiares, exclusión de otros trastornos) quedan fuera de lo que decide el fisio. **Con un trastorno adquirido del tejido conectivo (lupus, artritis reumatoide…), el SEDh exige los rasgos A y B, y el dolor crónico o la inestabilidad no cuentan** (p. 19): relevante para la idea inicial del lupus.
- Subtipo vascular (p. 16): criterios mayores y menores. Un antecedente familiar, una rotura o disección arterial antes de los 40 años, una rotura de sigma sin causa o un neumotórax espontáneo, junto con otros rasgos compatibles, deben llevar a estudiarlo.
- Malfait cita la taquicardia postural ortostática y la disautonomía entre las manifestaciones sistémicas del SEDh, pero fuera de los criterios (p. 19).

**Byers 2017** (subtipo vascular):
- Rasgos que deben hacer sospecharlo sin una rotura previa (p. 41):
  - hematomas inusuales sin causa;
  - acrogeria;
  - neumotórax recurrente;
  - pie zambo;
  - varices precoces;
  - rasgos faciales característicos, con ojos prominentes.
  
  El neumotórax espontáneo aparece en el 12 %, a menudo como primera manifestación (p. 44).
- Signos agudos:
  - **disección arterial**: dolor por el desgarro, por la distensión de la pared o por isquemia distal; sobre todo en las arterias iliacas y femorales, mesentéricas y celiaca, renales, la aorta y las arterias de los miembros (p. 43);
  - **rotura de colon**: dolor en crescendo rápido, sin alivio, casi siempre en la fosa iliaca izquierda (p. 44);
  - **fístula carótido-cavernosa**, urgencia médica: zumbido brusco en la sien, ojo rojo, dolor alrededor del ojo y protrusión del globo (p. 45);
  - disección coronaria con infarto (p. 44).
- Actividad física (p. 42), lo más útil para la pauta:
  - se desaconsejan los deportes de colisión y el **ejercicio isométrico**;
  - intensidad que permita conversar;
  - buen control de la respiración al levantar peso;
  - pesos ligeros para mantener tono y fuerza, no para ganar masa;
  - resistencia ligera para proteger hombro, cadera y rodilla;
  - aeróbico suave o moderado en piscina, bicicleta estática, elíptica o cinta amortiguada;
  - evitar las aceleraciones y deceleraciones bruscas.
- Mantener la presión arterial en rango normal (pp. 40 y 43). Encaja con la TA de signos vitales de la fase 1; ver «Ideas no decididas».

**Engelbert 2017** (fisioterapia en el TEH/SEDh; evidencia «limitada en tamaño y calidad», p. 159):
- El **dolor que empeora con la actividad** es un rasgo distintivo. En niños, el dolor aparece en las 24 h siguientes al ejercicio (p. 160).
- Hay hiperalgesia generalizada (sensibilización central) y un componente neuropático predominante en la mitad de los adultos. Pide un manejo del dolor adaptado (pp. 160 y 162–163).
- Hay déficit de propiocepción, fuerza y equilibrio. El 95 % de las pacientes de un estudio se habían caído en el último año (p. 163).
- Tratamiento:
  - **prescripción de ejercicio cuidadosamente graduada**, apoyada en la teoría del aprendizaje motor, para evitar lesiones y sobreentrenamiento;
  - criterios NSCA y ACSM;
  - vuelta gradual al deporte vigilando la recuperación;
  - las modalidades activas son las recomendadas (p. 165);
  - las terapias se aplican con cuidado para no exacerbar el dolor, por la sensibilización periférica y central (pp. 164–165).
- Hay alguna evidencia de que el ejercicio mejora el TEH/SEDh, pero ninguna convincente a favor de un tipo concreto (p. 164).
- En adultos, un único ECA: propiocepción, equilibrio y pliometría reducen el dolor de rodilla (Sahin 2008, citado en p. 164).
- Diagnóstico diferencial (p. 164):
  - fragilidad ósea con fracturas → osteogénesis imperfecta;
  - hábito marfanoide → Marfan / Loeys-Dietz;
  - otros SED;
  - debilidad progresiva → causa neurológica;
  - enfermedades reumáticas.
- Derivar al especialista si hay disautonomía cardíaca o síntomas digestivos o urinarios importantes (p. 165).
- Los deportes de contacto se han propuesto como factor de riesgo de lesión de rodilla en la HAG (p. 162).

## Principios

1. **Es una capa transversal, no una fase nueva.** Sigue el patrón del paciente posquirúrgico: tarjeta en la fase 1, sistema de cribado que solo aparece si se activa, avisos en la fase 4b y recuadro en la fase 5.
2. **El árbol CIF no se toca.** La hipermovilidad no es una hipótesis del árbol, sino una condición que cambia cómo se interpretan las demás. Ni navegación ni snapshot cambian.
3. **El motor de puntuación no se toca** (decisión 2).
4. **El fisio no diagnostica.** El resultado se redacta como «hipermovilidad articular generalizada (Beighton X/9) → valorar derivación a reumatología o genética». Nunca «probable SEDh»: el SEDh exige los criterios 2 y 3 (Malfait 2017, p. 17).
5. **La seguridad no se recorta**, igual que en el modo breve: las preguntas del subtipo vascular nunca se pliegan.
6. **Sin contenido clínico inventado.** Las preguntas y los textos de este documento son un borrador hasta la revisión clínica del usuario antes de `main`. Las traducciones del cuestionario son propias.

## Flujo propuesto

### Fase 1 — tarjeta «Hipermovilidad»
- Va justo después de Mecanismo de inicio y de la tarjeta Cirugía, antes de Cronología.
- No es obligatoria. «No consta» es el valor por defecto y no añade nada a ninguna fase.
- Con «Diagnosticada» o «Sospecha», añade la clase `body.hipermovilidad` (como `body.posquirurgico`). La clase muestra los elementos `.solo-hm` de las demás fases.
- En modo breve no se pliega: es la que decide si aparecen las preguntas del subtipo vascular.
- Si el formulario previo menciona «Ehlers-Danlos» o «hipermovilidad» en enfermedades, no se preselecciona nada.

### Fase 2 — sistema «Hipermovilidad»
Un sistema común nuevo en `data/comun.js` (p. ej. `SIS_HIPERMOVILIDAD`, id `transversal_hipermovilidad`). Es la misma instancia en las 7 regiones y lleva `soloHipermovilidad: true`, que `sistemasActivos()` resuelve igual que `soloPosquirurgico`.

**Cuestionario de 5 preguntas** (con «Sospecha»; sí/no). Malfait 2017, tabla III, p. 17; traducción propia, no validada (el razonamiento lo dice):
1. ¿Puede ahora (o pudo alguna vez) apoyar las palmas de las manos en el suelo sin doblar las rodillas?
2. ¿Puede ahora (o pudo alguna vez) doblar el pulgar hasta tocar el antebrazo?
3. De niño o niña, ¿entretenía a sus amigos contorsionando el cuerpo en posturas raras, o podía abrirse de piernas del todo (spagat)?
4. De niño o adolescente, ¿se le salió el hombro o la rótula más de una vez?
5. ¿Se considera una persona hiperlaxa, «de goma», o con las articulaciones muy flexibles?

Dos o más «sí» = cuestionario positivo.

**Escala de Beighton** (con «Sospecha»; opcional con «Diagnosticada»):
- Es un elemento nuevo, porque hoy la fase 2 solo tiene preguntas sí/no. Lleva nueve casillas con las maniobras de Malfait 2017, fig. 2: meñique, pulgar, codo y rodilla de cada lado, y tronco.
- La suma se calcula y nunca se guarda (como el IMC).
- El punto de corte por edad lo da `state.edadPaciente`, con el mismo aviso discreto que el criterio de Goodman cuando falta la edad. Malfait da cortes por «edad y sexo», pero los números que publica solo dependen de la edad.
- Una nota bajo la escala avisa de que una limitación adquirida puntúa negativa (p. 18).

**Resultado** (caja tipo `criterioCompuesto`). Hay HAG si:
- Beighton ≥ el corte de su edad, o
- Beighton = corte − 1 y cuestionario positivo.

Texto: «hipermovilidad articular generalizada (Beighton X/9; cuestionario Y/5) → valorar derivación a reumatología o genética». Si no se cumple: «sin hipermovilidad generalizada según Beighton». Nunca un diagnóstico de SEDh.

**Subtipo vascular: urgencia** (con el subtipo vascular diagnosticado, o con «Sospecha»). Tres preguntas con `urgencia` y clase `.sq2-urg`, que nunca se pliegan. Borrador sacado de Byers 2017, pp. 43–45:

| id | Pregunta (borrador) | `urgencia` | Fuente |
|---|---|---|---|
| `hm_v_dolor` | ¿Ha tenido de forma brusca un dolor intenso, que va a más, en el abdomen, el flanco, la espalda, el pecho o un brazo o una pierna? | Posible disección o rotura arterial, o rotura de colon: urgencias hoy | Byers 2017, pp. 43–44 |
| `hm_v_ojo` | ¿Ha notado de repente un zumbido en la sien, con el ojo rojo, dolorido o más saltón? | Posible fístula carótido-cavernosa: urgencia médica, hoy | Byers 2017, p. 45 |
| `hm_v_aire` | ¿Le ha faltado el aire de forma brusca, o le duele el pecho al respirar? | Posible neumotórax: urgencias hoy | Byers 2017, p. 44 |

**Subtipo vascular: sospecha** (con «Sospecha», o con «Diagnosticada» y subtipo «otro» o «no lo sabe»; sin `urgencia`, derivación preferente a genética). Borrador sacado de Malfait 2017, p. 16, y Byers 2017, pp. 41 y 45:

| id | Pregunta (borrador) | Peso |
|---|---|---|
| `hm_s_familia` | ¿Algún familiar de primer grado con SED vascular, o con una rotura o disección arterial antes de los 40 años? | Mayor |
| `hm_s_rotura` | ¿Ha tenido una rotura arterial o una rotura de intestino sin causa conocida? | Mayor |
| `hm_s_neumo` | ¿Ha tenido algún neumotórax espontáneo? | Menor |
| `hm_s_piel` | ¿Le salen hematomas sin golpes, en sitios poco habituales (mejillas, espalda), o tiene la piel fina y translúcida, con las venas muy visibles? | Menor |
| `hm_s_varices` | ¿Tuvo varices antes de los 30 años (y, si es mujer, sin haber estado embarazada)? | Menor |

**Regla** (`reglaVascular()`, `lib/hipermovilidad.js`): derivación preferente con un «sí» mayor, o con 2 o más «sí» en total. Motivo: Malfait (p. 16) pide estudiar el subtipo ante un antecedente familiar, una rotura o disección arterial antes de los 40 años o una rotura de sigma sin causa; el neumotórax espontáneo, solo «con otros rasgos compatibles», y también pide considerar el estudio ante «una combinación de los otros rasgos menores». Un solo «sí» menor se muestra como hallazgo, sin derivación.

Cada pregunta lleva su `razonamiento` (Fase F) con las fuentes del registro.

### Fase 3 — SINSS
- No cambia la lógica.
- Una línea `.solo-hm` en la tarjeta Estabilidad: «valora la estabilidad frente al lado sano y frente a las subluxaciones que refiere, no frente a la norma».
- Una línea en Naturaleza: «dolor que empeora con la actividad y posible hiperalgesia generalizada» (Engelbert 2017, pp. 160 y 163).

### Fase 4 — árbol CIF
Sin cambios.

### Fase 4b — aviso en las pruebas de laxitud
- Campo nuevo y opcional en el test: `laxitud: true`. Marca las pruebas cuyo positivo depende de la laxitud, no de un síntoma.
- Con la condición activa, la tarjeta del test muestra bajo el «cuánto pesa»: *«Hipermovilidad: compara siempre con el lado sano y anota si la laxitud es simétrica. Cuenta como positivo una laxitud asimétrica o que reproduzca su síntoma.»*
- El LR no cambia (decisión 2). Tampoco va en el payload ni en los resúmenes.

**Fuente del aviso**: ninguna de las tres fuentes leídas habla de la validez de las pruebas de laxitud en la hipermovilidad. Por eso el aviso es solo una regla de técnica y no afirma nada sobre la precisión (decisión de la revisión). Se apoya en la definición: la HAG es una laxitud generalizada (Malfait 2017, p. 17). Si aparece una fuente sobre la precisión de Lachman o del cajón en personas hiperlaxas, se añade.

Tests que llevan `laxitud: true`: todos los de la tabla (16 tests en 5 regiones; algunas filas tienen dos) **menos las dos pruebas compuestas de `ro4`** («Confirmar…» y «Descartar…»). En ellas la laxitud es solo una parte, y el aviso ya sale en el Lachman. El pivot shift y el cajón posterolateral o pivote lateral del codo sí lo llevan: su positivo es una subluxación, que depende de la laxitud, y el aviso deja contar como positivo el que reproduce el síntoma.

Candidatas medidas en el código (octubre 2026):

| Región | Hipótesis | Test | LR hoy |
|---|---|---|---|
| Rodilla | `ro4` | Lachman | LR+ 5,72 / LR− 0,24 |
| Rodilla | `ro4` | Cajón anterior | LR+ 6,34 / LR− 0,20 |
| Rodilla | `ro4` | Pivot shift | LR+ 10,70 / LR− 0,56 |
| Rodilla | `ro4` | «Confirmar: … + Lachman positivo» (**sin aviso**: prueba compuesta) | LR+ 17,5 |
| Rodilla | `ro4` | «Descartar: …» (**sin aviso**: prueba compuesta) | LR− 0,08 |
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

No llevan el aviso: aprensión, recolocación y sorpresa (el positivo es el síntoma), ni las pruebas de dolor. Las únicas que hoy multiplican son las de `ro4`.

### Fase 5 e informes
**Recuadro «Hipermovilidad»** al principio de la fase 5, como el de «Paciente posquirúrgico». Nunca se pliega. Cada línea, pegada a su fuente. Contenido (borrador):
- Estado y subtipo; Beighton y cuestionario, si se hicieron.
- **Siempre**: «Ejercicio graduado; vigila la carga para asegurar la recuperación (Engelbert 2017, p. 165). El dolor empeora con la actividad y puede aparecer en las 24 h siguientes (observado en niños; Engelbert 2017, p. 160).»
- **Siempre**: «Si hay disautonomía o síntomas digestivos o urinarios importantes, derivar al especialista» (Engelbert 2017, p. 165). Línea fija, sin pregunta.
- **Solo con el subtipo vascular diagnosticado** (no con «no lo sabe»): «Evitar deportes de colisión, ejercicio isométrico y aceleraciones bruscas; intensidad que permita conversar, control de la respiración al levantar peso y cargas ligeras» (Byers 2017, p. 42). Aplicarla a quien probablemente tiene el subtipo hipermóvil le quitaría ejercicio útil.
- **Con «Sospecha» y HAG**: la línea de derivación a reumatología o genética.
- **Con la regla de sospecha del subtipo vascular cumplida**: la línea de derivación preferente a genética.

**Salidas**:
- **📋 Notas**: línea «🧬 HIPERMOVILIDAD: …».
- **📄 Informe** (paciente o médico): «Hipermovilidad articular generalizada (diagnosticada)», en antecedentes. Con «Sospecha» y HAG, «se recomienda valoración por reumatología», sin la palabra Ehlers-Danlos.
- **Payload**: campo nuevo `hm`: `{ es, st, bt, cu }` (estado, subtipo, Beighton, cuestionario). Solo se añade si el estado no es «No consta». physiq-report tendrá que leerlo, igual que `cq` y `dt` (otro repositorio).
- **Informe con IA**: un bloque de datos «Hipermovilidad» en `construirAmpliado()`. `lib/reglas-informe.js` no se toca salvo que una revisión real lo pida.
- **Modo breve**: con «Sospecha», un Beighton sin hacer es un pendiente (`ancla: 'cardHipermovilidad'`).

## Ideas no decididas
- **TA en el subtipo vascular** (fuera del piloto, decisión de la revisión): Byers 2017 pide mantener la presión arterial en rango normal (pp. 40 y 43). La fase 1 ya recoge la TA (`signosVitales`), pero ningún algoritmo la lee. Se podría avisar en la fase 5 si la TAS es alta y el subtipo es vascular.
- **Versión española validada del cuestionario**: no comprobado si existe; si existe, sustituye a la traducción propia.
- **Lupus**: Malfait 2017 (p. 19) muestra que el lupus y el SEDh interactúan en el diagnóstico. Si más adelante se añade el lupus como condición especial, la tarjeta podría tener en cuenta las dos.

## Estado y cambios técnicos (cuando se implemente)

```js
hipermovilidad: {
  estado: '',          // '' (no consta) | 'diagnosticada' | 'sospecha'
  subtipo: '',         // '' | 'hipermovil' | 'vascular' | 'otro' | 'ns'
  beighton: {},        // { menique_d, menique_i, pulgar_d, pulgar_i, codo_d, codo_i, rodilla_d, rodilla_i, tronco }: boolean
  cuestionario: {},    // { cq1…cq5: 'SI' | 'NO' }
}
```

- `lib/hipermovilidad.js`: funciones puras (suma de Beighton, corte por edad, regla del «1 por debajo + cuestionario», resultado, textos compartidos), con pruebas unitarias.
- Sistema `SIS_HIPERMOVILIDAD` en `data/comun.js`, añadido a las 7 regiones; `sistemasActivos()` lo filtra.
- Nuevo tipo de elemento en la fase 2 para la escala de Beighton (casillas que suman), solo en este sistema.
- Campo `laxitud: true` en los tests elegidos (`data/<región>.js`). Una prueba unitaria fija la lista, como la de `notaPosquirurgica`.
- Referencias nuevas en `data/referencias.js` (`Malfait 2017`, `Byers 2017`, `Engelbert 2017`) y `node tests/gen-referencias.mjs`.
- `_softResetApp()`, restauración de sesión, exportar/importar (va dentro de `state`), `deploy-to-hub.yml` si se crea `lib/hipermovilidad.js`.
- Pruebas unitarias: nada sin la condición activa, `hm` en el payload, el aviso nunca en payload ni resúmenes, la pregunta urgente con `.sq2-urg`.
- Prueba de humo: la tarjeta, el sistema, el aviso en Lachman, el recuadro de la fase 5 y la prueba a 320 px.

## Fuentes

| Clave | Referencia | Uso | Estado |
|---|---|---|---|
| `Malfait 2017` | Malfait F, et al. The 2017 international classification of the Ehlers-Danlos syndromes. *Am J Med Genet C* 2017;175(1):8–26. [doi:10.1002/ajmg.c.31552](https://doi.org/10.1002/ajmg.c.31552) | Beighton (fig. 2, cortes, limitación adquirida), cuestionario (tabla III), criterios del SEDh, subtipo vascular | Leído entero (PDF del usuario) |
| `Byers 2017` | Byers PH, et al. Diagnosis, natural history, and management in vascular Ehlers-Danlos syndrome. *Am J Med Genet C* 2017;175(1):40–47. [doi:10.1002/ajmg.c.31553](https://doi.org/10.1002/ajmg.c.31553) | Rasgos de sospecha, signos agudos, actividad física | Leído entero (PDF del usuario) |
| `Engelbert 2017` | Engelbert RHH, et al. The evidence-based rationale for physical therapy treatment of children, adolescents, and adults diagnosed with joint hypermobility syndrome/hypermobile Ehlers Danlos syndrome. *Am J Med Genet C* 2017;175(1):158–167. [doi:10.1002/ajmg.c.31545](https://doi.org/10.1002/ajmg.c.31545) | Presentación clínica, principios de tratamiento, diagnóstico diferencial, derivación | Leído entero (PDF del usuario) |
| (no se registra) | Hakim AJ, Grahame R. A simple questionnaire to detect hypermobility. *Int J Clin Pract* 2003;57(3):163–6. [PMID 12723715](https://pubmed.ncbi.nlm.nih.gov/12723715/) | Origen del cuestionario | Solo resumen; se cita a través de Malfait 2017, tabla III |
| (opcional) Castori 2017 | Marco del trastorno del espectro de la hipermovilidad, mismo número de *Am J Med Genet C* (citado en Malfait 2017, p. 9) | Terminología TEH frente a SEDh | Por localizar; no imprescindible |

## Implementación (octubre 2026)

Hecho según este documento, con estas concreciones:

- **Contenido clínico** en `data/comun.js` (`SIS_HIPERMOVILIDAD`): las 8 preguntas con su razonamiento (fuentes `Malfait 2017` y `Byers 2017`, nuevas en `data/referencias.js` junto a `Engelbert 2017`), las 3 banderas rojas enlazadas a las urgencias, y en `hipermovilidad` el cuestionario, las maniobras de Beighton, los cortes y los textos con sus citas. Es el segundo sistema de las 7 regiones (tras el posquirúrgico).
- **Lógica pura** en `lib/hipermovilidad.js`: visibilidad por estado y subtipo (`elementoHMVisible`), puntos y corte de Beighton, regla del punto por debajo, regla vascular, payload `hm` y textos de 📋 Notas, 📄 Informe e informe con IA.
- **Cortes por edad**: la pubertad no se deduce de la edad, así que hasta los 17 años se aplica el corte de 6 (Malfait agrupa a los adolescentes con los prepúberes), de 18 a 50 el de 5 y por encima de 50 el de 4. La pantalla muestra el corte y el grupo para que el fisio lo valore.
- **Sin embudo**: el sistema de hipermovilidad no tiene el embudo del modo breve; lo activó el fisio a propósito y sus pocas preguntas se hacen siempre. No sale como «sistema sin cribar».
- **Escala de Beighton**: botón «Hacer la escala de Beighton»; hasta entonces no puntúa (`beighton: null`), y con la sospecha es un pendiente del modo breve. Una casilla sin marcar puntúa 0.
- **Payload `hm`**: `{ es, st, bt, co, cu, hag, vs }` (estado, subtipo, puntos de Beighton, corte, «sí» del cuestionario, hipermovilidad generalizada, regla vascular cumplida). Solo con la tarjeta activa, así que la huella de los informes con IA anteriores no cambia. physiq-report lo lee con una copia de `bloqueHMIA()` (`_bloqueHM`, su `lib/payload.js`; un test en cada repositorio fija el mismo texto literal: un cambio aquí se copia allí).
- **Informe con IA**: bloque «Hipermovilidad» en `contextoValoracion()` (`lib/informe-narrativo.js`), con las recomendaciones sin las citas (el informe no debe nombrar fuentes) y, con la sospecha, «no escribas que el paciente tiene un síndrome de Ehlers-Danlos». `lib/reglas-informe.js` no se ha tocado.
- **📄 Informe**: bloque «HIPERMOVILIDAD ARTICULAR»; con la sospecha solo dice que se recomienda valoración (reumatología o genética), sin nombrar el Ehlers-Danlos.
- **Pruebas**: `tests/unit/hipermovilidad.mjs` (visibilidad, urgencias, Beighton y cortes, regla del punto por debajo, regla vascular, payload, resúmenes y prompt, lista de los 16 tests y aviso, pendiente del modo breve) y la sección `hipermovilidad` de `tests/smoke.mjs`.

## Siguiente paso

1. **Revisión del usuario en la app** antes de `main`: tarjeta de la fase 1, sistema de la fase 2 (razonamientos incluidos), aviso de la 4b y recuadro de la fase 5.
2. **physiq-report**: leer `hm` del payload (otro repositorio).
3. Después del piloto: POTS / disautonomía; otras condiciones (lupus; Tarlov como contenido de lumbar).
