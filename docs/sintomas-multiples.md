# Varios síntomas (P1–P4) — diseño

Estado: **decisiones cerradas (octubre 2026)**: el usuario aceptó las 9 decisiones y las propuestas de «Pendiente de decidir» (hoy «Decidido», al final). **Paso 1 implementado en lumbar** (piloto). **Paso 2** completo: las 7 regiones tienen zonas, revisadas por el usuario (2026-10). **Paso 3** (pistas en el árbol) hecho en lumbar (revisado por el usuario, 2026-10) y cervical (revisados por el usuario, 2026-10) y hombro (revisados por el usuario, 2026-10) y codo (revisados por el usuario, 2026-10) y cadera (revisados por el usuario, 2026-10) y rodilla (revisados por el usuario, 2026-10) y tobillo y pie (revisados por el usuario, 2026-10): las 7 regiones tienen pistas. **Paso 5** (physiq-report) hecho y revisado por el usuario (2026-10). **Paso 4** (fase 6) hecho y revisado por el usuario (2026-10): ver «Cómo quedó el paso 4». Seguimiento en `MIGRATION_PLAN.md`, Fase N.

## Decisiones tomadas (octubre 2026)
Aceptadas las 9 decisiones de abajo y, de «Pendiente de decidir» (hoy «Decidido», al final):
- **Zonas**: la tabla de abajo, como borrador; la de lumbar ya está en `data/lumbar.js` (`export const zonas`) y se revisa en consulta.
- **NRS de P1**: un solo valor, como hasta ahora.
- **Secundarios**: solo la nota libre, sin los chips de descripción.
- **«Hacer principal»**: sí, intercambiando los datos.

## Cómo quedó el paso 1 (lumbar)
- **Archivos**: `sintomas.js` (tarjeta, en la raíz, import estático desde `app.js`), `lib/sintomas.js` (puro: forma, payload y textos), `ZONAS_SINTOMA` en `data.js` (solo regiones con `zonas`). Sin zonas en la región, la tarjeta no se pinta y nada cambia.
- **Misma forma para P1 y los secundarios** (`sintomaVacio()`): así «Hacer principal» intercambia los objetos sin perder nada. Lo que P1 no muestra (NRS, irritabilidad, relación) o lo que un secundario no muestra (profundidad) se guarda igual. `descripcion` es «Descripción» en P1 y «Nota» en los secundarios.
- **«Hacer principal»** pide confirmación: el NRS y la irritabilidad del secundario pasan a las tarjetas de P1 (irritabilidad estimada, como en modo breve), los de P1 pasan al secundario, y **las relaciones con P1 se borran** (eran con el principal anterior). Desde 2026-10 también se vacía la matriz de irritabilidad, por lo mismo, conservando el impacto en las actividades (decisión 104 de `docs/plan-tratamiento.md`). No se ofrece para «otra región».
- **Otra región**: solo dónde, lado, NRS y nota; sin irritabilidad, comportamiento ni relación (al marcarla se vacían).
- **Quitar** un secundario vacío no pregunta; con datos, pide confirmación.
- **Al cambiar de región** se borran, como el resto de la fase 3 (`resetPhase3UI()`).
- **Payload**: `z1` es un objeto, no texto: `{ z, la?, pr?, pa?, de? }` (zonas en texto, lado, profundidad, comportamiento, descripción). `ss[]`: `{ n, z, la?, nr, ir?, pa?, re?, de?, or? }`. Sin datos, no hay `z1` y `ss` es `[]`.
- **Revisión del informe con IA**: regla nueva `lado-sintoma` (medio) en vez de `lado`/`lado-otro` cuando un síntoma está en el otro lado o es bilateral; `lado-no-consta` no salta si algún síntoma tiene lado. El NRS de un secundario está en el bloque de datos, así que `nrs` lo acepta.

## Cómo quedó el paso 3 (lumbar)
- **Dato**: `pasos: ['<stepId>']` en cada zona de `export const zonas` (`data/lumbar.js`, con el porqué de cada paso en el comentario de encima). Una zona sin `pasos` no da pistas.
- **Qué sale**: en el recuadro «📝 Refiere el paciente» del paso, cada síntoma que tiene alguna zona ligada a ese paso, entero (todas sus zonas), con la misma línea que la fase 5: «Síntoma P1 (principal): Pierna por debajo de la rodilla · intermitente · NRS 3/10», «Síntoma P2: Zona lumbar · NRS 6/10 · solo cuando empeora P1». La otra región no sale nunca (no se valora hoy).
- **Un solo recuadro** con las respuestas del formulario previo ligadas al paso (primero) y los síntomas (después): el HTML del recuadro pasó de `formulario.js` a `lib/pistas.js` (`pistasHTML()`), que usan el formulario (fase 1) y `phase4.js`; `formulario.js` expone sus pistas del paso como datos (`window.fpPistasPaso`) y `phase4.js` las junta con `pistasSintomasPaso()` (`lib/sintomas.js`). Si el formulario no carga, salen solo los síntomas.
- **Siempre al día**: el árbol se repinta entero al entrar en la fase 4, así que un cambio en la fase 3 se ve al volver.
- **Nunca contesta el paso** (decisión 8): ni selecciona opciones ni toca `treeAnswers`; lo comprueba el smoke test.
- **Lumbar** (revisado por el usuario, 2026-10): lu_step1 (¿la pierna duele más que la espalda?) → zona lumbar, para comparar, y todo lo que baja por la pierna; lu_step1c (déficit) → muslo anterior, pierna y pie; lu_step2 (estenosis, glúteos y muslos) → glúteo, muslos y pierna; lu_step3 («sin dolor bajo la rodilla») → pierna y pie; lu_step4 (facetario «sin pasar de la rodilla», sacroilíaca, «revisar siempre cadera») → glúteo, ingle y pierna. lu_step1b (centralización) no lleva: se ve explorando.
- **Cervical** (revisado por el usuario, 2026-10): ce_step1 (mielopatía) → antebrazo y mano; ce_step3 (¿el brazo duele más que el cuello?) → cuello, para comparar, trapecio o escápula (referencia radicular C5–C8), hombro, brazo, antebrazo y mano; ce_step3b (radicular o radiculopatía) → brazo, antebrazo y mano, y cabeza por la opción «aura migrañosa»; ce_step4 (cefalea o base del cuello u hombro) → cuello, cabeza, trapecio o escápula, hombro; ce_step6 (dónde está la disfunción) → cuello, cabeza (C1–2) y zona dorsal (cervicotorácica). Sin pistas: ce_step2 (latigazo), ce_step4b (mareo), ce_step5 (dominio mecánico).
- **Hombro** (revisado por el usuario, 2026-10): h_step1 (cribado cervical y 1ª costilla) → cuello o trapecio, y por debajo del codo (el dolor subacromial no suele bajar del codo); h_step3 (¿dolor arriba o inestabilidad?) → hombro anterior y posterior; h_step4 (manguito) → hombro lateral (deltoides) y brazo hasta el codo; h_step5 (control escapular) → cuello o trapecio. Sin pistas: h_step2 y h_step2b (movilidad pasiva).
- **Codo** (revisado por el usuario, 2026-10): co_step1 (trauma, rotura muscular, menores) → codo anterior (bíceps distal), medial (lanzador joven) y lateral (7–12 años); co_step3 (síntomas neurales) → codo medial (cubital), antebrazo y mano; co_step4 (epicondilalgias) → codo lateral, medial y posterior; co_step5 (inestabilidad o bloqueo) → codo medial, lateral y posterior. Sin pistas: co_step2 (movilidad global).
- **Cadera** (revisado por el usuario, 2026-10): ca_step1 (¿referido de la columna o la sacroilíaca?) → zona lumbar y glúteo; ca_step1b (lesión aguda de ingle) → ingle; ca_step2 (perfil degenerativo) → ingle, muslo anterior y rodilla (referencia de la artrosis); ca_step3 (intraarticular) → ingle; ca_step4 (lateral) → cadera lateral; ca_step5 (posterior) → glúteo; ca_step6 (ingle, Doha) → ingle; ca_step7 (neuropático) → muslo anterior (meralgia) e ingle. Sin pistas: ca_step3b (Thomas).
- **Rodilla** (revisado por el usuario, 2026-10): ro_step1b (Ottawa) → rodilla anterior (rótula) y lateral (cabeza del peroné); ro_step2b (menor: cadera primero) → muslo; ro_step2c (referido de cadera o columna) → muslo y pierna; ro_step3 (¿dónde se concentra?) → rodilla anterior, medial y lateral; ro_step4/5/6/7 (persistente anterior, medial, lateral, posterior) → su zona, más la pierna en el lateral (nervio peroneo) y en el posterior (TVP, quiste roto). Sin pistas: ro_step1 (mecanismo) y ro_step2 (perfil por edad).
- **Tobillo y pie** (revisado por el usuario, 2026-10): tp_step2 (Ottawa, Thompson, Lisfranc, calcáneo) → tobillo lateral y medial, mediopié, Aquiles y talón; tp_step3 (mecanismo agudo) → tobillo lateral, anterior (sindesmosis) y medial (tibial posterior); tp_step4 (menores) → Aquiles y talón (Sever), mediopié (Köhler, Iselin), antepié (Freiberg); tp_step5 (no reproduce: origen proximal) → pantorrilla; tp_step6 (posterior) → Aquiles y pantorrilla; tp_step7/8/9 → tobillo medial, lateral y anterior; tp_step10 → talón o planta; tp_step11 → mediopié; tp_step12 → antepié o dedos; tp_step13 (dolor vago tras esguince) → tobillo lateral y anterior. Sin pistas: tp_step1 (¿traumatismo?). La zona «Mediopié» se añadió con este paso (usuario, 2026-10): sin ella el paso 11 no tenía zona.

## Cómo quedó el paso 4 (fase 6)
- **Regla** (decisión 7; en `docs/plan-tratamiento.md`, decisión 35): el plan se dosifica según el síntoma más irritable; a igualdad, P1; entre secundarios igual de irritables, el de número más bajo. `sintomaQueDosifica()` (`lib/plan-tratamiento.js`) recibe P1 (`severidad`, irritabilidad de siempre) y los secundarios del payload (`ss`).
- **Gravedad**: la del NRS de ese mismo síntoma; sin NRS, la máxima con el aviso de siempre. Su irritabilidad cuenta como estimada (elegida directamente).
- **No cuentan**: «otra región» (no se valora hoy) y un secundario sin irritabilidad. P1 sin irritabilidad cuenta como alta, la prudente, así que ningún secundario la supera.
- **Lo que se ve**: con algún secundario, la tarjeta «Gravedad e irritabilidad» dice «Según P2 · Pierna por debajo de la rodilla, el síntoma más irritable» o «Según P1 (principal)», y la gravedad calculada lleva el NRS de ese síntoma; si no es P1, el aviso `dosificaOtro` lo explica y el texto que se comparte dice «(según P2 · …, el síntoma más irritable)».
- **Independiente**: un secundario con relación «Independiente» añade el aviso «Un síntoma va independiente de P1: puede ser un segundo problema que este plan no trata. Valóralo aparte. (P2 · Ingle)», en la tarjeta de la sesión y en el texto que se comparte.
- **Lo elegido a mano** (gravedad e irritabilidad de la fase 6) sigue mandando.
- **Sin cita de Maitland**: la regla viene de este diseño, aceptado por el usuario; no se ha leído la página de Maitland que la recoge, así que los avisos no la citan.

## Por qué

En la anamnesis el paciente pinta en un mapa corporal las zonas que le duelen y a menudo no es una sola: lumbar y pierna, cuello y brazo, hombro y cuello. Para cada zona se pregunta la intensidad y el comportamiento (Maitland: P1, P2…). Ahora la fase 3 obliga a resumir todo en un solo NRS y un solo nivel de irritabilidad, así que se pierde información clínica. Además, lo que la app no recoge lo inventa el informe con IA, como pasó con el lado afectado hasta que se añadió el campo.

## Punto de partida (medido en el código, octubre 2026)

La fase 3 (`#phase3`, «Abordaje de la Sesión») tiene una sola tarjeta de cada: Severidad (EVN 0–10), Irritabilidad (matriz de 5 ítems o nivel directo en modo breve), Naturaleza, Estadio (solo lectura, viene de la cronología), Estabilidad y Signo comparable. No registra **dónde** está el dolor: la zona solo aparece en el motivo de consulta (texto libre) y en algunos ítems del formulario previo (irradiación a la pierna o al brazo).

Quién lee `severidad` e `irritabilidadNivel`:
- **Payload**: `nr` y `ir` (`buildPhysiQPayload()`, `app.js`), que también lee physiq-report.
- **Resúmenes**: fase 5, `📋 Notas` y `📄 Informe` (`lib/resumenes.js`).
- **Informe con IA**: línea «NRS: …» con `NOTA_NRS` (`lib/informe-narrativo.js`). Varias reglas de revisión dependen de ella (`lib/revision-informe.js`): `nrs` marca «una intensidad que no figura en la valoración», y luego están `nrs-omitido` y `nrs-momento`.
- **Fase 6**: `gravedadSINSS(severidad)` e `irritabilidadSINSS()` (`lib/plan-tratamiento.js`) eligen el escalón A/B/C.

## Principios

1. **No se rompe nada de lo que ya existe.** `severidad`, `irritabilidad`, `irritabilidadNivel` e `irritabilidadDirecta` siguen siendo los campos de **P1**. Los síntomas nuevos van en campos nuevos. Las sesiones antiguas, el payload `nr`/`ir`, physiq-report y las reglas de revisión siguen funcionando sin tocarlos.
2. **Una región se valora por sesión.** El cribado, el árbol, las hipótesis y los tests siguen siendo de `state.region`. Un síntoma en otra región se registra, pero no se valora.
3. **Rápido en consulta.** Solo P1 lleva el SINSS completo; los secundarios llevan una ficha corta que se rellena en segundos.
4. **La seguridad no se toca.** Nada de esto cambia el cribado de la fase 2, las urgencias ni las derivaciones del árbol.
5. **Sin contenido clínico inventado.** Las listas de zonas por región son un borrador para tu revisión, como las preguntas de la Fase F.

## Decisiones propuestas

1. **Hasta 4 síntomas: P1 es el principal, P2–P4 son secundarios.** No 3+3: con más de un «principal» no queda claro cuál manda, y 6 zonas suele ser un cuadro generalizado que pide otra lectura. Si hay una quinta zona, va en el texto libre de P4. Subir el límite más adelante es cambiar un número; bajarlo rompería sesiones guardadas.
2. **P1 = la fase 3 de ahora más la zona.** Se le añaden zona, profundidad, constante o intermitente y descripción. El resto (NRS, matriz de irritabilidad, naturaleza, estabilidad, signo comparable) sigue como está. Naturaleza, estadio y estabilidad son globales: describen el cuadro, no cada zona.
3. **Ficha corta para P2–P4**: zona (+ lado), NRS, irritabilidad directa (Baja/Moderada/Alta, como `selectIrritabDirecta` en modo breve), constante o intermitente, **relación con P1** y una nota libre opcional. Sin matriz de irritabilidad.
4. **Relación con P1, un campo cerrado en cada secundario.** Es lo que más valor clínico aporta:
   - **Van juntos**: aparecen y desaparecen con P1; probablemente misma fuente o dolor referido.
   - **Solo cuando P1 empeora**: dolor referido o periferalización, importante en columna.
   - **Independiente**: posible segundo problema.
   - **No lo sabe**.
5. **Otra región: se registra, no se valora.** En la lista de zonas hay una opción «Otra región (no valorada hoy)» con texto libre («rodilla derecha»). Cuenta dentro de los 4. No abre un segundo árbol. Los resúmenes dicen «Refiere también …, pendiente de valorar». Si hay que valorarla, se hace otra valoración.
6. **Zonas en lista, no mapa dibujado.** Chips de zona según la región, más texto libre. Se pueden enlazar con el árbol (decisión 8), son rápidos en móvil y se convierten en texto sin ambigüedad para los resúmenes y la IA. El mapa en papel sigue sirviendo para el paciente. Un mapa dibujado puede añadirse más adelante como vista sobre las mismas zonas (paso 4).
7. **El plan de la fase 6 se dosifica según el síntoma más irritable; a igualdad, P1.** Es la regla de Maitland. La gravedad se calcula con el NRS de ese mismo síntoma. La fase 6 lo dice («Dosificado según P2 · pierna, el más irritable») y avisa si algún síntoma es «Independiente»: hay un posible segundo problema que este plan no trata.
8. **Pistas en el árbol.** Una zona con pasos asociados (p. ej. lumbar «pierna por debajo de la rodilla» → paso de dolor radicular) muestra en ese paso el recuadro «📝» con el síntoma («P2: pierna bajo la rodilla, NRS 3, solo cuando P1 empeora»). Es un recordatorio, igual que las pistas del formulario previo: **nunca contesta el paso por sí sola**.
9. **Modo breve**: solo P1 con irritabilidad directa. Los secundarios se pueden añadir, pero no son obligatorios ni salen como pendientes.

## Flujo propuesto

### Fase 3 — tarjeta «Síntomas»
Primera tarjeta de la fase, por encima de Severidad:
- **P1** (siempre presente): chips de zona según la región, lado (por defecto el de la fase 2), superficial/profunda, constante/intermitente y descripción con micrófono y chips (`injectQuickInputBar`: «quemazón», «punzante», «sordo», «hormigueo», «adormecimiento»…). Debajo, las tarjetas de Severidad e Irritabilidad de siempre, con el título «… de P1» cuando hay más de un síntoma.
- **«+ Añadir síntoma»** (hasta P4): una tarjeta compacta por síntoma con los campos de la decisión 3 y un botón para quitarlo, que pide confirmación (`showConfirmBanner`) solo si el síntoma tiene datos.
- Con un solo síntoma la fase se ve casi igual que ahora: solo aparece la línea de la zona de P1.

Nada es obligatorio, como el resto de la fase 3. La fase sigue sin bloquear la navegación.

### Zonas por región (borrador para revisar)

| Región | Zonas |
|---|---|
| Lumbar | Zona lumbar · Glúteo · Ingle · Muslo anterior · Muslo posterior/lateral · Pierna por debajo de la rodilla · Pie |
| Cervical | Cuello · Cabeza · Trapecio / escápula · Hombro · Brazo · Antebrazo y mano · Zona dorsal |
| Hombro | Hombro anterior · Hombro lateral (deltoides) · Hombro posterior · Brazo hasta el codo · Por debajo del codo · Cuello / trapecio |
| Codo | Codo lateral · Codo medial · Codo posterior · Codo anterior · Antebrazo · Mano |
| Cadera | Ingle · Cadera lateral · Glúteo · Muslo anterior · Rodilla · Zona lumbar |
| Rodilla | Anterior / rótula · Medial · Lateral · Posterior (hueco poplíteo) · Muslo · Pierna |
| Tobillo y pie | Tobillo lateral · Tobillo medial · Tobillo anterior · Tendón de Aquiles · Talón / planta · Mediopié · Antepié / dedos · Pantorrilla |

Más **Otra región (no valorada hoy)** con texto libre en todas. Una zona puede llevar `pasos: ['<stepId>']` del árbol de su región (decisión 8), revisados uno a uno. Lugar propuesto: `export const zonas` en cada `data/<region>.js`, junto al cribado y al árbol, para que la revisión clínica de una región quede en un solo archivo.

## Estado y payload

```js
// state.js — P1 sigue en severidad / irritabilidad* de siempre; misma forma para todos (sintomaVacio())
sintomaPrincipal: { zonas: [], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: null, irritabilidad: '', relacion: '' },
sintomasSecundarios: [ /* hasta 3 (P2–P4), misma forma */ ],
```

- `relacion`: `'juntos' | 'empeora' | 'independiente' | 'nosabe' | ''`; `patron`: `'constante' | 'intermitente' | ''`; `profundidad`: `'superficial' | 'profunda' | ''`; `nrs: null` = no registrado (nunca un 0 por defecto, como `nr`).
- **Payload**: `z1` (P1, solo con datos) y `ss[]` (secundarios); forma exacta en «Cómo quedó el paso 1». `nr`/`ir` no cambian. Sin secundarios, `ss` es `[]`. Los campos vacíos se omiten.
- **Sesiones antiguas** sin estos campos: P1 sin zona y sin secundarios, todo funciona como ahora.
- `_softResetApp()` y `resetApp()` los vacían; la exportación/importación `.json` los lleva sin hacer nada aparte (van dentro de `state`).
- **physiq-report** (paso 5, hecho en 2026-10): su prompt (`buildClinicalContext()`, `lib/payload.js`) lleva el mismo bloque «Síntomas que refiere el paciente» que el informe con IA de aquí, justo después de la irritabilidad, y la insignia «Valoración importada» añade una línea «Síntomas: P1 … · P2 …» cuando hay más de uno. El bloque es una copia (`_bloqueSintomas`); un test en cada repo fija el mismo texto literal, así que un cambio aquí se copia allí. Valoraciones sin `z1`/`ss`: sin bloque, como antes.

## Lo que lee cada sitio

- **Fase 5**: el resumen SINSS añade una línea por síntoma («P2 · Pierna bajo la rodilla (derecha) · NRS 3 · Irritabilidad baja · solo cuando P1 empeora»).
- **`📋 Notas`**: una línea «SÍNTOMAS:» con P1–P4 en formato compacto.
- **`📄 Informe`** (paciente/médico): en lenguaje llano, sin jerga («Refiere además dolor: por debajo del codo (lado derecho), de intensidad 2/10, que aparece y desaparece con el dolor principal»; con «dolor:» y no «dolor en», porque hay zonas como «Por debajo del codo» que no admiten «en»). La otra región, como «pendiente de valorar».
- **Informe con IA**: un bloque «Síntomas» numerado en los datos, y en `REGLAS_COMUNES` una regla para no mezclar intensidades ni comportamientos entre síntomas. El NRS de un secundario cuenta como «figura en la valoración» para la regla `nrs` (si no, daría un falso positivo). Siguiendo la costumbre del repo, **no se añaden reglas de revisión nuevas por adelantado**: solo cuando un informe real muestre el fallo (p. ej. un NRS cambiado de síntoma), con ese informe en `tests/fixtures/informes/`.
- **Fase 6**: decisión 7.
- **Árbol (fase 4)**: decisión 8. Las hipótesis no cambian.

## Pruebas

- **Unitarias** (`tests/unit/sintomas.mjs`, hechas en el paso 1): payload con y sin secundarios; sesiones antiguas; resúmenes; prompt; el NRS de un secundario no dispara la regla `nrs` y su lado no es una contradicción; nada de esto en el payload cuando está vacío. Paso 3: los `pasos` de cada zona existen en su árbol y no se repiten; pistas solo de los síntomas con una zona ligada, nunca la otra región. Paso 4 (`tests/unit/plan-tratamiento.mjs`): el plan elige el más irritable y desempata con P1; otra región y sin irritabilidad no cuentan; aviso del independiente, también al compartir; con estado real.
- **Smoke** (sección `sintomas`, hecha en el paso 1): añadir hasta P4 y no más; quitar con y sin confirmación; «Hacer principal»; persistencia al recargar; fase 5; región sin zonas sin tarjeta; cabe a 320 px. Paso 3: la pista en el paso 1 lumbar, en el mismo recuadro que el formulario previo, sin la otra región y sin contestar el paso.

## Por pasos

1. **Tarjeta «Síntomas»** en la fase 3, estado, payload, resúmenes y bloque del prompt de la IA. Lumbar como piloto, para revisar las zonas y la ficha corta en consulta real.
2. **Zonas de las otras 6 regiones**, una por sesión, con tu revisión.
3. **Pistas en el árbol** (decisión 8), región a región, junto con el paso 2.
4. **Fase 6**: dosificación según el más irritable y aviso del síntoma independiente.
5. **Mapa dibujado** opcional sobre las mismas zonas, solo si después hace falta.

## Decidido (antes «Pendiente de decidir»)

Eran las preguntas abiertas del diseño; el usuario aceptó las propuestas (octubre 2026) y todo está implementado:

- **Listas de zonas**: revisadas región a región (paso 2) y con sus `pasos` del árbol (paso 3), las 7 regiones; tobillo y pie ganó la zona «Mediopié».
- **NRS de P1**: un solo valor, como hasta ahora. Pasar a ahora / peor / mejor afectaría a `nr`, a physiq-report y a las reglas `nrs-momento`, así que sería un cambio aparte.
- **Descripción en los secundarios**: solo la nota libre, sin los chips de descripción de P1.
- **Orden**: sí hay «Hacer principal», que intercambia los datos con P1 (ver «Cómo quedó el paso 1»).

## Propuesta: zonas sacra, coccígea y perineal en lumbar (decisión 5 de `docs/tarlov.md`)

Estado: **propuesta, pendiente del visto bueno del usuario (2026-10). No hay nada implementado.** Va aquí, y no en `docs/tarlov.md`, porque es un cambio de la Fase N: zonas, `pasos`, lado, fase 6 y pruebas de la tarjeta «Síntomas», que es donde se documentan las zonas de todas las regiones. El quiste de Tarlov es solo uno de sus tres motivos: también lo son la cauda equina y la sacroilíaca. `docs/tarlov.md` (decisión 5) remite aquí.

### Lo que hay hoy (medido en el código)
- Lumbar tiene 7 zonas (`data/lumbar.js`), todas con `pasos`; un test exige que **toda** zona de las 7 regiones tenga `pasos` (`tests/unit/sintomas.mjs`, «todas las zonas con pasos»).
- El lado de cada síntoma ya ofrece **Central** en lumbar y cervical (`sintomas.js`, `COLUMNA`). Con el lado de P1 vacío, la tarjeta dice «Sin marcar: el de la región»; los resúmenes no escriben ningún lado.
- Las pistas de síntomas solo salen en los pasos del árbol. **`lu_step1c` solo se pisa en la rama radicular** (`lu_step1` = SÍ; snapshot `tests/fixtures/cif-tree-navigation.json`), mientras que `lu_step4` se pisa siempre. Un paciente con dolor perineal sin dolor de pierna no vería nunca una pista en `lu_step1c`.
- Payload, `📋 Notas`, `📄 Informe`, el bloque de la IA y la copia de physiq-report (`_bloqueSintomas`) llevan el **nombre** de la zona como texto (`z`), nunca el id.
- `lado-sintoma` (`lib/revision-informe.js`): un síntoma Central no la dispara (bien), pero **sí silencia `lado-no-consta`** cuando la región no tiene lado, porque cuenta cualquier lado de síntoma. Fallo previo, pequeño.
- Fase 6: la red de seguridad de cola de caballo de lumbar (`RED_SEGURIDAD.lumbar.neuro`) solo sale con una hipótesis neurológica (`HIP_EXPLORACION_NEURO`).

### Zonas propuestas

| id | Nombre | `pasos` | Por qué (fuentes ya leídas en el repositorio) |
|---|---|---|---|
| `sacro` | Sacro | `lu_step1`, `lu_step4` | `lu_step1` compara pierna con espalda: el sacro es espalda, como la zona lumbar. `lu_step4`: dolor sacroilíaco en la zona de Fortin y dolor discal en la línea media (Lluch 2020, cap. 5.1, pp. 314–324, ya citado en su razonamiento) |
| `coxis` | Cóccix | ninguno | Ningún paso del árbol pregunta por él. Su valor es el registro, los resúmenes y la pregunta `l_u5` de la fase 2, que ya lo nombra (coccigodinia 49 % frente a 17 %, Hulens 2018, tabla 1). Necesita una excepción en el test de «todas las zonas con pasos» |
| `perine` | Periné, ano o genitales | `lu_step1c` | Su razonamiento ya dice que la exploración habitual no cubre S2–S4 y que con síntomas perineales hay que explorarlos aparte y repasar `l6` y `l_u5` (Murphy 2023; Paredes Mogica 2023, p. 377). Como `lu_step1c` solo sale en la rama radicular, no basta: ver «Recordatorio de la fase 2» |

Orden de los chips, de arriba abajo: Zona lumbar · Sacro · Cóccix · Glúteo · Ingle · Periné, ano o genitales · Muslo anterior · Muslo posterior o lateral · Pierna por debajo de la rodilla · Pie (10). Los ids son nuevos: las sesiones guardadas no cambian.

- **«Cóccix»** y no «coxis», como en `l_u5`.
- **Sacro y cóccix separados**, aunque se propusieron juntos: la línea de la pista dice el nombre de la zona, y en `lu_step4` «Sacro o cóccix» no diría si el dolor está en la zona de Fortin o en el cóccix, que no orienta a la sacroilíaca.
- **Periné, ano y genitales juntos**: son las mismas raíces (S2–S4; Paredes Mogica 2023, p. 377), la misma silla de montar de `l6` y los mismos pasos. Separarlos añadiría chips sin cambiar nada. Se nombra **el ano** porque el dolor anal es lo que más separaba el quiste sintomático de la lumbalgia de otra causa (57 % frente a 10 %, Hulens 2018, tabla 1) y porque `l_u5` lo pregunta; sin él, el fisio lo apuntaría en «Cóccix».

### Recordatorio de la fase 2 (mecanismo nuevo, pequeño)
Basta con texto en `lu_step1c` solo para la rama radicular. Para que el recordatorio llegue siempre, se propone un campo opcional en la zona:

```js
{ id: 'perine', nombre: 'Periné, ano o genitales', pasos: ['lu_step1c'], central: true,
  recordatorio: { preguntas: ['l6', 'l_u5'], texto: '…' } }
```

- **Dónde**: en la tarjeta «Síntomas» de la fase 3, bajo los chips del síntoma que tiene marcada esa zona, con «Ir a la pregunta →» (fase 2, desplegando el sistema y llevando a `l6`). No en la fase 2: cuando se marca la zona, la fase 2 ya está hecha.
- **Texto** (borrador, de los razonamientos de `l6` y `l_u5`, sin fuentes nuevas): «Si hay pérdida de sensibilidad en silla de montar o cambios al orinar o al hacer de vientre **nuevos o que van a más**, es la pregunta de cauda equina de la fase 2: urgencia hoy, aunque se conozca un quiste de Tarlov. Si son antiguos y el dolor empeora sentado y alivia tumbado, repasa la del quiste de Tarlov.» El dolor perineal solo, sin esos síntomas, no es `l6`, y el texto no dice que lo sea.
- **Cuándo**: solo mientras `l6` no esté en SÍ (con `l6` en SÍ la urgencia ya sale en todas partes). Nunca en «otra región».
- **Cómo se garantiza que nunca sustituye ni rebaja `l6`**:
  - una función pura (`recordatoriosZona()`, `lib/sintomas.js`) que solo lee `state.sistemicoAnswers` y devuelve texto; nunca escribe respuestas, `sistemicoAlerta`, `ur` ni `dv` (test unitario que lo compara antes y después);
  - el texto nombra primero la urgencia y nunca dice «descartada» ni «no urgente»;
  - `l6` conserva `urgencia` y `.sq2-urg` (tests de Tarlov ya existentes);
  - nunca en el payload, los resúmenes ni el prompt (test unitario, como el resto del razonamiento);
  - se ve también en modo breve y en el hub (no usa red).
- Sacro y cóccix no llevan recordatorio: `l_u5` ya los nombra en su texto y no son silla de montar.

### Lado
- Las tres zonas llevan `central: true`. **Sin preselección** (regla de la app): el fisio marca Central, o el lado si el paciente lo localiza a un lado (un quiste de un lado puede dar síntomas de los dos; Paredes Mogica 2023, p. 377).
- En P1, si todas sus zonas son centrales, el aviso «Sin marcar: el de la región (derecho)» se cambia por «Zona central: marca Central, o el lado si el paciente lo localiza», para que P1 no herede el lado de la pierna.
- `lado-sintoma` no cambia: un síntoma Central no es «el otro lado». Se corrige que un síntoma Central silencie `lado-no-consta`: solo cuentan Derecho, Izquierdo y Bilateral. Se comprueba que ningún informe real del fixture cambia de puntos.

### Qué cambia en cada sitio
- **Payload** (`z1`, `ss`): nada en la forma; los nombres nuevos van en `z`.
- **`📋 Notas` y `📄 Informe`**: nada en el código. El informe dirá «Localización del dolor principal: periné, ano o genitales» o «Refiere además dolor: cóccix (lado central)…».
- **Informe con IA**: sin cambios en `bloqueSintomasIA()` ni en `lib/reglas-informe.js`. Sin reglas de revisión nuevas por adelantado (costumbre del repositorio): solo si un informe real confunde el dolor perineal con la silla de montar.
- **Fase 6**: `sintomaQueDosifica()` no cambia (un síntoma perineal irritable puede dosificar como cualquier otro). Se propone que **una zona perineal marcada en lumbar añada la red de seguridad de cola de caballo** (`cierreNeuro`, `alarmaNeuro`; Finucane 2020, sección 2, ya leído), aunque no haya hipótesis neurológica. `plan.js` pasaría un indicador sacado de los ids, porque `ss` solo lleva nombres.
- **physiq-report**: nada. `_bloqueSintomas` copia el texto de las zonas tal cual y su test fija un caso con zonas que no cambian.

### Pruebas
- Unitarias (`tests/unit/sintomas.mjs`): las tres zonas y sus `pasos`; `coxis` como única excepción a «todas las zonas con pasos»; la pista de `perine` en `lu_step1c` y la de `sacro` en `lu_step4`; `recordatoriosZona()` solo con periné, no con `l6` en SÍ, nunca con otra región, sin tocar respuestas, `ur` ni `dv`; nada en payload, resúmenes ni prompt. `tests/unit/revision-informe.mjs`: Central no silencia `lado-no-consta` y los informes reales no cambian. `tests/unit/plan-tratamiento.mjs`: la red de cola de caballo con zona perineal y sin hipótesis neurológica.
- Humo (sección `sintomas`, y `fase6`): chips nuevos a 320 px sin desbordar; recordatorio al marcar periné, «Ir a la pregunta →» lleva a `l6`, desaparece con `l6` en SÍ; pista en `lu_step4` con sacro; aviso de zona central en P1. Prueba de humo completa antes de `main`.

### Decisiones para el usuario (con la recomendación)
1. **Sacro y cóccix, ¿juntos o separados?** Recomendación: separados («Sacro», «Cóccix»).
2. **Periné**: recomendación: una sola zona, «Periné, ano o genitales».
3. **`pasos`**: recomendación: sacro → `lu_step1` y `lu_step4`; cóccix → ninguno; periné → `lu_step1c`.
4. **Recordatorio de la fase 2**: recomendación: el mecanismo nuevo, solo en periné, con el texto del borrador y solo mientras `l6` no esté en SÍ.
5. **Lado**: recomendación: sin preselección, aviso propio en P1 y la corrección de `lado-no-consta`.
6. **Fase 6**: recomendación: la red de cola de caballo con zona perineal; la dosificación, sin cambios.
