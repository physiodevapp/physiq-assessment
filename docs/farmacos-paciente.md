# Fármacos que toma el paciente — diseño del paso 3 de la farmacología

Estado: **borrador de diseño (octubre 2026), solo diseño: nada de código.** Pendiente de las decisiones del usuario (al final). Es el paso 3 de `docs/farmacologia.md` («Conectarla con el paciente»); los pasos 1 y 2 están hechos, y en el 2 hay siete familias revisadas por el usuario: AINE, corticoides, anticoagulantes y antiagregantes, opioides, gabapentinoides, antidepresivos, y benzodiacepinas y relajantes musculares.

Reglas de este diseño, las mismas de la línea «fármacos» y de las condiciones especiales:
- Solo se usa contenido de **familias ya revisadas**. No entra ninguna frase nueva con fuente: los avisos de la fase 6 son **frases literales** de `data/farmacos.js`, con su cita.
- Lo que no tiene fuente va marcado **[propia]** (redacción propia) y es una decisión del usuario.
- **Nunca** se propone cambiar, suspender ni ajustar la medicación. **Sin interacciones** entre fármacos: ninguna regla se activa por tener dos familias a la vez.
- **Ninguna regla automática** que no esté medida en las fuentes, tampoco entre tarjetas.
- Nada de esto reduce, esconde ni sustituye una urgencia o una pregunta de cribado de la fase 2.
- Nunca se escriben nombres de fármaco en texto libre en la tarjeta nueva.

## Resumen

- Una **tarjeta propia en la fase 1**, «Fármacos que toma», después de la del anticoagulado: chips de las familias **ya escritas** de la guía, sin texto libre.
- **Una sola fuente de datos por fármaco.** Los anticoagulantes y antiagregantes siguen viviendo en su tarjeta (aquí solo hay una línea con enlace). Los corticoides que ya registran el lupus y la osteoporosis se **muestran** en el chip, sin duplicar el dato ni crear reglas.
- **«Este paciente»** en la guía de fármacos, como en los tiempos de tejido.
- En la **fase 6**, un aviso por familia hecho solo de frases literales de la guía revisada, con su cita; sin topes, sin red de seguridad nueva y sin cambiar niveles.
- **Payload `fm`**, una línea en 📋 Notas y un bloque en el informe con IA (copiado en physiq-report como `_bloqueFM`). Nada en el 📄 Informe.
- Antes de usar la frase de la terapia manual de los corticoides, hay que **corregir la guía**: dice que las fuentes leídas no dan normas, pero Puentedura 2015 (ya en la app por el lupus y la osteoporosis) pone los corticoides a largo plazo como contraindicación absoluta del thrust torácico.

## Qué hay hoy en la app

Revisado en octubre de 2026 en `data/`, `lib/`, `formularios/`, `index.html` y `app.js`:

- **Guía de fármacos** (`data/farmacos.js`, `lib/farmacos.js`): 13 familias, 7 con `apartados`. `farmacosHTML()` es pura y no lee el `state`. `abrirFarmacos({ familia })` abre la guía con una familia desplegada (lo añadió el anticoagulado).
- **Formulario previo, cara común** (`formularios/comun.js`): el ítem `medicacion` («Medicación que toma ahora», **texto libre**, `ia: 'contexto'`, `informe: 'Medicación actual'`, `antecedente: true`). Ya llega al prompt de la IA por `fp` y al 📄 Informe como antecedente. Las `pistas` de la cara común se pueden atar a una tarjeta de la fase 1 (hoy `mecanismo` y `cronologia`).
- **Tarjetas que ya registran fármacos**:
  - **Anticoagulado** (`state.anticoagulado`, `{ estado: 'toma', toma: [...] }`): la familia «Anticoagulantes y antiagregantes» entera. Su diseño (`docs/anticoagulado.md`, decisión 15) ya dice que el paso 3 **debe reutilizar esta tarjeta** y no añadir un chip aparte.
  - **Lupus**: `corticoides` (No · ≤5 · >5–20 · >20 mg/día · no lo sabe), `dosisAltas`, `inmunosupresores`. Los corticoides activan el tope «sin thrust» (`motivosSinThrust()`, `sinThrustLupus`, Puentedura 2015, tabla 1).
  - **Osteoporosis**: `corticoides` (No · <7,5 · ≥7,5 mg/día, tres meses o más), `tratamiento` (`antirresortivo` = bifosfonato o denosumab). La derivación por corticoides sin protección ósea y la pregunta de la fractura atípica de fémur salen de aquí.
  - **Mastocitos**: `autoinyector` de adrenalina. No es una familia de la guía.
- **Fase 6** (`construirPlan()`, `lib/plan-tratamiento.js`): avisos por condición (`AVISOS_LUPUS`, `AVISOS_MASTOCITOS`, `AVISOS_ANTICOAGULADO`…) y redes de seguridad (`RED_*`). Los avisos son para el fisioterapeuta, no para el paciente. `docs/plan-tratamiento-frases.md` lista cada frase de la fase con su fuente (`node tests/gen-frases-plan.mjs`).
- **Informe con IA** (`contextoValoracion()`, `lib/informe-narrativo.js`): un bloque por condición (`bloqueACIA()`, `bloqueLESIA()`…), sin citas, con una copia literal en physiq-report fijada por un test en cada repo (`AC_CASOS`…).
- **Tiempos de tejido**: el chip «Este paciente» (`FILTRO_PACIENTE`, `filasPaciente()`), que no se guarda en `localStorage` y se apaga con un segundo toque.

### Una incoherencia encontrada al diseñar

La guía, en «Corticoides › Ejercicio», dice: «Las fuentes leídas no dan normas para la terapia manual ni para la carga: tenlo en cuenta al elegir técnicas de alta velocidad o carga axial intensa.» Pero la app ya usa **Puentedura 2015, tabla 1** («corticoides a largo plazo… contraindicación absoluta» del thrust torácico) en `sinThrustLupus` y en `sinThrustOsteoporosis`, y esa fuente está leída y en el registro. La frase se escribió con las fuentes de la familia y no tiene en cuenta las de las condiciones especiales. **No se puede llevar a la fase 6 tal cual** (decisión 6).

## Diseño propuesto

### 1. Fase 1 — tarjeta «Fármacos que toma» (`#cardFarmacos`)

- **Dónde**: después de «Paciente anticoagulado o antiagregado» y antes de Cronología, cerrando la serie de tarjetas de condiciones especiales. Queda junto a la tarjeta del anticoagulado, con la que enlaza. Es una tarjeta de la app, no parte del formulario previo: el formulario es una transcripción del papel, se carga con `import()` y empieza cerrado.
- **Chips multiselección** (`selected` + `aria-pressed`, patrón `.hm-subtipos`, sin hueco a 320 px), uno por familia **con `apartados`** salvo los antitrombóticos, con una etiqueta corta (`corto`, nuevo campo de `data/farmacos.js`) y los ejemplos de la familia en el `title`:
  - AINE · Corticoides · Opioides · Gabapentinoides · Antidepresivos · Benzodiacepinas o relajantes.
  - La lista sale de `familiasConContenido()`: cuando una familia pendiente se revise, su chip aparece solo (una prueba unitaria lo fija).
- **Anticoagulantes y antiagregantes**: no hay chip. Una línea con el estado de su tarjeta y un botón, como la del lupus: «Anticoagulantes y antiagregantes: tarjeta «Paciente anticoagulado o antiagregado» (marcada: antivitamina K · aspirina / sin marcar) · Ir a la tarjeta →» (`irATarjetaAC()`, que ya existe).
- **Corticoides registrados en otra tarjeta**: si el lupus diagnosticado tiene `corticoides` ≤5, >5–20 o >20, o la osteoporosis diagnosticada tiene `corticoides` <7,5 o ≥7,5, el chip de los corticoides se ve marcado, con «· tarjeta Lupus» o «· tarjeta Osteoporosis», y no se puede desmarcar desde aquí (para cambiarlo, la tarjeta). Es una vista del dato, no una regla clínica: el dato sigue en su tarjeta (decisión 4).
- **Nota de la tarjeta** [propia]: «Marca las familias que toma ahora; los corticoides, también si le han puesto una infiltración hace poco. Sirve para la guía de fármacos y para los avisos del plan; no cambia el cribado. No le digas que deje ni cambie ninguna medicación: las dudas, a quien la prescribe.»
- **«📝 Refiere el paciente»**: encima de la tarjeta, la respuesta de `medicacion` del formulario previo, con el mismo mecanismo que Mecanismo y Cronología (`pistas: { farmacos: ['c:medicacion'] }` en `formularios/comun.js`). Es solo un recordatorio: **nunca marca un chip** ni se analiza su texto (decisión 10).
- **Familias pendientes**: una línea pequeña [propia]: «Otras familias (estatinas, fluoroquinolonas, betabloqueantes…) aún no tienen guía revisada. Si tiene dudas, «✨ Preguntar a la IA» en modo «Fármacos».» En el hub, sin el enlace de la IA.
- **Enlace**: «Ver sus fármacos en la guía →», que abre la guía con «Este paciente» activo. Solo sale con alguna familia marcada.
- **Sin texto libre**, sin dosis, sin fechas y sin «desde cuándo»: ninguna de esas cosas cambia lo que hace la app.
- **Modo breve**: no se pliega y no crea pendientes (decisiones 8 y 9).
- Disponible también en el hub: no usa red.

### 2. Guía de fármacos — «Este paciente»

- Con alguna familia del paciente (chips de la tarjeta, corticoides de otra tarjeta, o la tarjeta del anticoagulado marcada), la guía se abre con un primer chip **«Este paciente»** activo, como en los tiempos de tejido: muestra solo esas familias, **desplegadas**, con una línea [propia] «Familias que toma según la fase 1: …».
- Un segundo toque muestra todas (la regla de la app). El filtro no se guarda en `localStorage`.
- Sin ninguna familia del paciente, no hay chip.
- `farmacosHTML()` sigue sin leer el `state`: recibe las familias como argumento (`farmacosHTML({ paciente: ['aine', 'antitromboticos'] })`); un auxiliar puro nuevo, `familiasPaciente({ farmacos, anticoagulado, lupus, osteoporosis })`, devuelve los ids con su origen («tarjeta», «tarjeta Lupus», «tarjeta Osteoporosis», «tarjeta Anticoagulado»). `app.js` lo llama al abrir, como `_pacienteTejidos()`.
- Una familia marcada que siga pendiente no puede darse con la decisión 2 recomendada; con la alternativa (las 13), saldría en «Este paciente» como «sin guía revisada todavía», con el botón de la IA.

### 3. Fase 6 — avisos

- **Un aviso por familia marcada** (incluidos los corticoides de otra tarjeta), junto a los avisos de las condiciones. Para el fisioterapeuta, como los demás avisos; no van al programa para casa.
- **Solo frases literales** de `data/farmacos.js`, con su cita. Para que no se puedan desviar del texto revisado, cada familia lleva un campo nuevo `plan: [...]` con las frases, y una prueba unitaria exige que **cada frase aparezca literal** en los `apartados` de su familia (como `tests/fixtures/criterios-4b.json` con los criterios de la 4b). Cambiar la guía obliga a revisar el aviso.
- Cada aviso empieza con un rótulo [propia]: «Toma <familia>:».
- **Una línea común**, una sola vez aunque haya varias familias [propia; resume las frases «Nunca aconsejes…» de cada familia, todas ya revisadas]: «No le digas que deje ni cambie la medicación: las dudas, a quien la prescribe.»
- **No cambian** el nivel A/B/C, la frecuencia, la irritabilidad, los escalones, el tope «sin thrust» ni la red de seguridad (decisiones 5, 13 y 14).
- **Anticoagulantes y antiagregantes**: nada nuevo. Los avisos, el tope y la red siguen saliendo de su tarjeta (`AVISOS_ANTICOAGULADO`, `RED_ANTICOAGULADO`).
- `docs/plan-tratamiento-frases.md` incluirá las frases nuevas (con «guía de fármacos, <familia>» como origen).
- El plan con IA («✨ Detallar con IA») las recibe sin más, porque `promptPlan()` envía los avisos del esqueleto.

**Frases propuestas** (todas copiadas de `data/farmacos.js`; la familia y el apartado entre corchetes):

| Familia | Frases para `plan` |
|---|---|
| AINE | «Deshidratación y calor: el efecto de los AINE sobre el riñón empeora con deshidratación, poca perfusión renal o daño renal previo (Lucas 2019), y la deshidratación y el ejercicio intenso con calor reducen además el riego intestinal (Papantoniou 2023). Vigila la hidratación en sesiones largas o con calor.» [ejercicio] · «Anota si tomó una dosis antes de la sesión.» [dolor; ya revisada como redacción propia] |
| Corticoides | «Fractura: el riesgo sube a los 3–6 meses de empezar y depende de la dosis (Compston 2018), incluso desde 2,5 mg/día; es mayor en los primeros meses, baja alrededor de un 30 % a los 6 meses de dejarlos y se normaliza a los 12 (Pofi 2023).» [ejercicio] · «Miopatía: el ejercicio puede atenuarla según los estudios que cita una cohorte, en la que los síntomas mejoraron tras una mediana de 107 días; recomienda cribar las caídas en mayores de 50 años (He 2025).» [ejercicio] · **la frase de la terapia manual, solo después de corregirla** (decisión 6) |
| Opioides | «Mareo, somnolencia y caídas: frente a placebo dan más mareo y somnolencia (Dowell 2022). En mayores producen sedación, falta de coordinación, mareo y caídas, con más fracturas de cadera y no vertebrales (Dufort y Samaan 2021).» [ejercicio] · «El ejercicio terapéutico reduce el dolor y mejora la función en la lumbalgia, la fibromialgia y la artrosis de cadera o rodilla, con beneficios que se mantienen 2–6 meses, y puede sumarse a la medicación (Dowell 2022).» [dolor] · «Mantener o aumentar la actividad física, junto con el agua y la fibra, ayuda a prevenir el estreñimiento; durante una retirada pautada, la guía pide aprovechar al máximo los tratamientos del dolor sin fármacos (Dowell 2022).» [ejercicio] · «Las fuentes leídas no dan normas de terapia manual en estos pacientes ni sobre el ejercicio en las horas siguientes a la toma.» [ejercicio, detalle; propia ya revisada] |
| Gabapentinoides | «Mareo, somnolencia y marcha: son las reacciones más frecuentes y las que más llevaron a abandonar la pregabalina; la mayoría fueron leves o moderadas, dependientes de la dosis y aparecieron en las 2 primeras semanas (Cross 2024).» [ejercicio] · «Mayores y función renal: ambos fármacos se eliminan por vía renal y el aclaramiento baja en los mayores y con disfunción renal, con más riesgo de reacciones adversas (Yasaei 2024; Cross 2024).» [ejercicio] · «Las fuentes leídas no dan normas de terapia manual en estos pacientes ni sobre el ejercicio en las horas siguientes a la toma.» [ejercicio, detalle; propia ya revisada] |
| Antidepresivos | «Mareo, ortostatismo y caídas: los tricíclicos se asociaron a mucha más hipotensión ortostática que el placebo (OR 6,30), y los ISRS no (Bhanu 2021). La amitriptilina da hipotensión ortostática, mareo y sedación (Thour 2026). La duloxetina puede dar hipotensión ortostática, caídas y síncope, sobre todo al empezar o al subir la dosis (Biswas 2026).» [ejercicio] · «Las fuentes leídas no dan normas de terapia manual ni de ejercicio con estos fármacos. El sangrado que estudian es el grave, digestivo o intracraneal, no los hematomas de las técnicas manuales.» [ejercicio; propia ya revisada] |
| Benzodiacepinas y relajantes | «Caídas y fracturas: las benzodiacepinas aumentan las caídas (OR 1,39–1,57) y se asocian con fuerza a la fractura de cadera; los hipnóticos Z, como el zolpidem, también aumentan las fracturas (OR 1,63). El riesgo es mayor las primeras semanas tras empezar y con el uso prolongado, por sedación, hipotensión ortostática, mareo, debilidad muscular, ataxia y problemas visuales (Capiau 2023).» [ejercicio] · «Equilibrio: el efecto depende de la dosis y es máximo en las primeras horas tras la toma; es mayor con dosis altas, con poco tiempo entre la toma y el despertar o con alcohol u otros sedantes, y la inestabilidad es más marcada en mayores (Capiau 2023).» [ejercicio] · «Las fuentes leídas no dan normas de terapia manual ni de dosificación del ejercicio con estos fármacos.» [ejercicio; propia ya revisada] |

Criterio de selección [propio]: lo que cambia la sesión o el plan (caídas, ortostatismo, momento de la toma, hidratación, fractura, miopatía, ejercicio como tratamiento) y lo que dice que no hay norma. Se dejan fuera los apartados de síntomas viscerales, sueño y «cuándo consultar», que están en la guía con un toque. La frase de las caídas de los corticoides (He 2025, «de 1,6 a 2,8 por 100 personas-año») y la de la glucosa tras una infiltración no se proponen: la primera repite la idea de la miopatía y la segunda depende de una diabetes que la app no registra. Son decisiones tuyas (decisión 12).

### 4. Fases 2, 3, 4 y 4b

- **Fase 2**: sin cambios. Marcar familias no añade, quita, pliega ni rebaja ninguna pregunta ni urgencia. Una prueba unitaria lo fija en las 7 regiones con todas las familias marcadas (como en las condiciones especiales).
- **Fases 3 y 4**: sin cambios. Ninguna fuente leída dice que estas familias cambien la irritabilidad o el árbol.
- **Fase 4b**: sin cambios (decisión 15). Las fuentes de la guía no dicen qué tests cambian; lo más cercano es «Las fuentes leídas no estudian cuánto enmascaran la exploración» (AINE) y «Las fuentes leídas no dicen cuándo conviene valorar respecto a la toma» (opioides).

### 5. Fase 5

Un recuadro corto «💊 Fármacos que toma» (decisión 15): la lista de familias con su origen, la línea común de la fase 6 y «Ver en la guía (este paciente) →». **Sin texto clínico**: el texto está en la guía, revisado, a un toque. No se pliega, porque es corto.

### 6. Salidas

- **Payload `fm`**: lista de ids que el fisioterapeuta marcó **en esta tarjeta** (`['aine', 'opioides']`), en el orden de la guía. Solo cuando hay alguno, para que la `huella` de los informes con IA anteriores no cambie (como `cu`). **No** lleva los antitrombóticos (ya van en `ac`) ni los corticoides de otra tarjeta (ya van en `le` y `op`): cada dato, una vez.
- **📋 Notas**: «💊 FÁRMACOS (familias): AINE · opioides». Con corticoides de otra tarjeta: «corticoides (tarjeta Lupus)». Va después de la línea del anticoagulado.
- **📄 Informe**: nada nuevo (decisión 16). La medicación ya sale como antecedente desde el formulario previo («Medicación actual»), y el médico la conoce.
- **Informe con IA**: `bloqueFMIA(fm)` en `contextoValoracion()`, después de `bloqueACIA()`, sin citas (decisión 17). Borrador:

  ```
  Fármacos que toma (familias registradas por el fisioterapeuta; sin dosis ni nombres):
    · AINE; opioides
    · No sugieras cambiar, suspender ni ajustar la medicación, ni comentes interacciones entre fármacos. No atribuyas los síntomas del paciente a un fármaco si el fisioterapeuta no lo ha dicho, y no añadas recomendaciones sobre la medicación que no estén en estos datos.
  ```

  Las reglas son [propia], copiadas del espíritu de `bloqueACIA()`. `lib/reglas-informe.js` no se toca. La revisión automática del informe (`lib/revision-informe.js`) no cambia: no hay ninguna regla nueva que comprobar en el texto.
- **physiq-report**: lee `fm` con una copia literal, `_bloqueFM`, en su `lib/payload.js`; `FM_CASOS` fija el mismo texto en los dos repositorios. En otra PR, después de la de physiq-assessment.
- **Sesión, exportar e importar**: `state.farmacos` se guarda con la sesión, entra en el `.json` exportado y lo vacía `_softResetApp()`. Al restaurar, `normalizarFarmacos()` quita ids desconocidos o de familias sin `apartados`.
- **Modo breve**: ningún pendiente (decisión 8).

## Cambios técnicos previstos (si se aprueba)

```js
farmacos: {
  toma: [],   // subconjunto de los ids de FAMILIAS_FARMACO con `apartados`, sin 'antitromboticos'
}
```

- `data/farmacos.js`: campos `corto` y `plan` por familia escrita (el esquema del encabezado se amplía); `TEXTOS_FARMACOS` con la nota, la línea de pendientes, la línea común y la del filtro.
- `lib/farmacos.js` (puro): `familiasMarcables()`, `familiasPaciente()`, `normalizarFarmacos()`, `fmPayload()`, `lineaNotasFM()`, `bloqueFMIA()`, `avisosFarmacos()`; `farmacosHTML({ paciente })` con el chip «Este paciente».
- `index.html`: `#cardFarmacos`. `app.js`: `_pintarFarmacosUI()`, `toggleFarmaco()`, el enlace a la guía, `_pacienteFarmacos()`, `_softResetApp()`, restaurar y exponer en `window`.
- `formularios/comun.js`: `pistas.farmacos = ['c:medicacion']`; `#fpPistas_farmacos` en la tarjeta.
- `lib/plan-tratamiento.js`: `construirPlan()` recibe `farmacos` (los ids de `familiasPaciente()` sin los antitrombóticos) y añade los avisos. Después, `node tests/gen-frases-plan.mjs`.
- `lib/informe-narrativo.js`: `bloqueFMIA()` en `contextoValoracion()`. `lib/resumenes.js`: la línea de 📋 Notas.
- `docs/farmacologia.md`: un paso más en el procedimiento por familia: al revisar una familia, decidir su `corto` y sus frases `plan` (o ninguna).
- **Pruebas**:
  - unitarias, en `tests/unit/farmacos.mjs`: los chips son las familias con `apartados` salvo los antitrombóticos; cada frase `plan` está literal en su familia y lleva cita o está en la lista de redacción propia; ninguna frase propone cambiar la medicación; `fm` solo con chips y solo los de la tarjeta; corticoides de lupus y de osteoporosis en `familiasPaciente()` pero no en `fm`; marcar todas las familias no cambia ninguna pregunta ni urgencia de la fase 2 en las 7 regiones; marcar dos familias no añade nada que no salga con cada una (sin interacciones); nada llega al 📄 Informe; `FM_CASOS`; `normalizarFarmacos()`; `farmacosHTML()` sigue sin leer el `state`;
  - humo, en la sección `farmacos`: la tarjeta a 320 px sin huecos, la línea y el botón del anticoagulado, el chip de corticoides desde el lupus, «Este paciente» en la guía (y su segundo toque), el recuadro de la fase 5, los avisos de la fase 6, y el hub.
- `deploy-to-hub.yml`: nada nuevo si todo va en ficheros que ya se copian.

## Fuera de este diseño (apuntado, no resuelto)

- **Las 6 familias pendientes**: entran solas en los chips cuando se revisen (betabloqueantes → dosificar por Borg, insulina → hipoglucemia, como apuntaba el paso 3 original), cada una con su `plan`.
- **«Fármacos que tocan el hueso»** (pendiente): cuando se revise, su chip se verá marcado desde la tarjeta de osteoporosis con `tratamiento: 'antirresortivo'`, igual que los corticoides.
- **Inmunosupresores del lupus** y **autoinyector de los mastocitos**: no son familias de la guía. Nada.
- **Dosis, vía y fechas**: ninguna regla las usa; los únicos umbrales con fuente ya están en las tarjetas del lupus y la osteoporosis.
- **Interacciones** y combinaciones: fuera por los límites de la línea; la guía ya las nombra dentro de cada familia («Combinaciones que hay que comentar con quien prescribe»).

## Decisiones (cada una con mi recomendación y la alternativa)

1. **Dónde va.** *Recomiendo* una tarjeta propia, `#cardFarmacos`, tras la del anticoagulado y antes de Cronología. *Alternativa*: dentro del formulario previo, junto a «Medicación que toma ahora» (pero el formulario es una transcripción del papel, empieza cerrado y se carga aparte).
2. **Qué familias se muestran.** *Recomiendo* solo las escritas (hoy 6 chips más la línea del anticoagulado); las pendientes aparecen solas al revisarse, y mientras tanto una línea remite a «✨ Preguntar a la IA». *Alternativa*: las 13, con las pendientes marcadas «sin guía revisada»; solo irían al payload, a 📋 Notas y a la IA como dato, sin aviso ni filtro, con el riesgo de que la IA rellene el hueco con consejos sin fuente.
3. **Anticoagulantes y antiagregantes.** *Recomiendo* una línea con el estado de su tarjeta y «Ir a la tarjeta →», el mismo patrón que se aceptó para el lupus (decisión 3 de `docs/anticoagulado.md`). *Alternativa*: un chip espejo que marque la tarjeta del anticoagulado (un solo dato, pero un control más que escribe en otra tarjeta y deja «qué toma» sin rellenar).
4. **Corticoides ya registrados en el lupus o la osteoporosis.** *Recomiendo* que el chip se vea marcado «· tarjeta Lupus/Osteoporosis», solo lectura, y que cuente para «Este paciente» y los avisos de la fase 6, sin crear ninguna regla ni duplicar el dato en el payload. *Alternativa*: chip independiente con una línea recordatorio («La tarjeta Lupus registra corticoides»).
5. **El chip de corticoides y el tope «sin thrust».** *Recomiendo* que el chip **no** active el tope: Puentedura 2015 habla de corticoides «a largo plazo», y el chip no sabe la duración; el tope sigue saliendo de las tarjetas del lupus y la osteoporosis. *Alternativa*: añadir al chip una subopción «tres meses o más» que active `sinThrustOsteoporosis`/`sinThrustLupus` (el umbral de tres meses es el de la tarjeta de osteoporosis; para el thrust sería redacción propia).
6. **La frase de la terapia manual de los corticoides en la guía.** *Recomiendo* corregir la guía en una revisión aparte, antes de llevarla a la fase 6: decir lo que dice Puentedura 2015, tabla 1 (contraindicación absoluta del thrust torácico con corticoides a largo plazo; tabla de una fuente de osteopatía no leída) y que la app lo aplica desde las tarjetas del lupus y la osteoporosis. Hasta entonces, esa frase no entra en `plan`. *Alternativa*: dejar la guía como está y no usar nunca esa frase.
7. **Qué cuenta como «toma corticoides».** *Recomiendo* «ahora, o una infiltración hace poco» [propia, sin plazo], porque la guía da efectos tras la infiltración (Grusky 2026; Beuschlein 2024: «sobre todo en los 2 meses siguientes»). *Alternativa*: solo «ahora».
8. **«Ninguno de estos» y modo breve.** *Recomiendo* que no haya chip «Ninguno» y que la tarjeta vacía no sea un pendiente del modo breve: es un dato opcional que no cambia la seguridad. *Alternativa*: un chip exclusivo «No toma ninguno de estos», para que 📋 Notas pueda decirlo, y un pendiente si no se marca nada.
9. **Plegado en modo breve.** *Recomiendo* no plegarla (una fila de chips). *Alternativa*: `.breve-opcional`.
10. **«📝 Refiere el paciente».** *Recomiendo* mostrar encima de la tarjeta la respuesta de «Medicación que toma ahora» del formulario previo, como recordatorio que nunca marca chips ni se analiza. Se mantiene ese ítem de texto libre: es del formulario en papel y ya llega al 📄 Informe como antecedente. *Alternativa*: no enlazarlos.
11. **«Este paciente» en la guía.** *Recomiendo* el chip que filtra y despliega, como en los tiempos de tejido, sin guardarlo. *Alternativa*: sin filtro; solo desplegar las familias del paciente y dejar las demás cerradas.
12. **Avisos de la fase 6.** *Recomiendo* un aviso por familia con las frases de la tabla, en un campo `plan` con prueba de literalidad, más la línea común [propia]. Revisa la selección: puedes quitar o añadir frases de la guía. *Alternativa*: un único aviso «Toma <familias>: revisa la guía de fármacos antes de la sesión», sin texto clínico.
13. **Combinaciones.** *Recomiendo* ninguna regla ni aviso por tener dos familias a la vez (sería una interacción). *Alternativa*: una línea genérica con dos o más familias sedantes (opioides, gabapentinoides, benzodiacepinas), que choca con los límites de la línea.
14. **Red de seguridad y niveles.** *Recomiendo* no añadir red de seguridad ni cambiar el nivel, la frecuencia o los escalones: los rótulos «Urgente» y «Pronto» de la guía son clasificación propia. *Alternativa*: llevar el «Urgente» de cada familia al cierre de la sesión.
15. **Fases 4b y 5.** *Recomiendo* nada en la 4b y, en la fase 5, el recuadro corto sin texto clínico con el enlace a la guía. *Alternativa*: nada en la fase 5, o una línea en la 4b («Anota si tomó un analgésico antes de explorar», [propia]).
16. **Salidas.** *Recomiendo* payload `fm` (solo los chips de esta tarjeta, solo si hay alguno), la línea de 📋 Notas y **nada en el 📄 Informe**. *Alternativa*: una línea «Tratamiento farmacológico referido (familias): …» en los antecedentes del 📄 Informe cuando el formulario previo no tenga la medicación.
17. **Informe con IA.** *Recomiendo* `bloqueFMIA()` con la lista y las reglas del borrador, sin las frases de la guía, y la copia `_bloqueFM` en physiq-report con `FM_CASOS`, en otra PR. *Alternativa*: añadir al bloque las frases `plan` sin citas, como hace `bloqueACIA()` con sus «consideraciones para la sesión».
18. **Redacción propia.** *Recomiendo* aceptar como redacción propia: la nota de la tarjeta, la línea de las familias pendientes, los rótulos «Toma <familia>:», la línea común de la fase 6, la línea «Familias que toma según la fase 1», el criterio de selección de frases y las reglas del bloque de IA. *Alternativa*: cambiar el texto que quieras antes de implementar.

## Siguiente paso

1. Tus decisiones (1–18).
2. Si aceptas la 6: corregir la frase de los corticoides en la guía (revisión aparte, sin fuentes nuevas: Puentedura 2015 ya está leída).
3. La implementación, en una rama propia, con la revisión del usuario en la app antes de `main`.
4. physiq-report: `_bloqueFM`, en otra PR.
