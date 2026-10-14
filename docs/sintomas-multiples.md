# Varios síntomas (P1–P4) — diseño

Estado: **decisiones cerradas (octubre 2026)**: el usuario aceptó las 9 decisiones y las propuestas de «Pendiente de decidir». **Paso 1 implementado en lumbar** (piloto), pendiente de probarlo en consulta. Seguimiento en `MIGRATION_PLAN.md`, Fase M.

## Decisiones tomadas (octubre 2026)
Aceptadas las 9 decisiones de abajo y, de «Pendiente de decidir»:
- **Zonas**: la tabla de abajo, como borrador; la de lumbar ya está en `data/lumbar.js` (`export const zonas`) y se revisa en consulta.
- **NRS de P1**: un solo valor, como hasta ahora.
- **Secundarios**: solo la nota libre, sin los chips de descripción.
- **«Hacer principal»**: sí, intercambiando los datos.

## Cómo quedó el paso 1 (lumbar)
- **Archivos**: `sintomas.js` (tarjeta, en la raíz, import estático desde `app.js`), `lib/sintomas.js` (puro: forma, payload y textos), `ZONAS_SINTOMA` en `data.js` (solo regiones con `zonas`). Sin zonas en la región, la tarjeta no se pinta y nada cambia.
- **Misma forma para P1 y los secundarios** (`sintomaVacio()`): así «Hacer principal» intercambia los objetos sin perder nada. Lo que P1 no muestra (NRS, irritabilidad, relación) o lo que un secundario no muestra (profundidad) se guarda igual. `descripcion` es «Descripción» en P1 y «Nota» en los secundarios.
- **«Hacer principal»** pide confirmación: el NRS y la irritabilidad del secundario pasan a las tarjetas de P1 (irritabilidad estimada, como en modo breve), los de P1 pasan al secundario, y **las relaciones con P1 se borran** (eran con el principal anterior). No se ofrece para «otra región».
- **Otra región**: solo dónde, lado, NRS y nota; sin irritabilidad, comportamiento ni relación (al marcarla se vacían).
- **Quitar** un secundario vacío no pregunta; con datos, pide confirmación.
- **Al cambiar de región** se borran, como el resto de la fase 3 (`resetPhase3UI()`).
- **Payload**: `z1` es un objeto, no texto: `{ z, la?, pr?, pa?, de? }` (zonas en texto, lado, profundidad, comportamiento, descripción). `ss[]`: `{ n, z, la?, nr, ir?, pa?, re?, de?, or? }`. Sin datos, no hay `z1` y `ss` es `[]`.
- **Revisión del informe con IA**: regla nueva `lado-sintoma` (medio) en vez de `lado`/`lado-otro` cuando un síntoma está en el otro lado o es bilateral; `lado-no-consta` no salta si algún síntoma tiene lado. El NRS de un secundario está en el bloque de datos, así que `nrs` lo acepta.

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
| Tobillo y pie | Tobillo lateral · Tobillo medial · Tobillo anterior · Tendón de Aquiles · Talón / planta · Antepié / dedos · Pantorrilla |

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
- **physiq-report** ignora `ss`/`z1` hasta que se actualice; actualizarlo es trabajo en ese repo, fuera de este diseño.

## Lo que lee cada sitio

- **Fase 5**: el resumen SINSS añade una línea por síntoma («P2 · Pierna bajo la rodilla (derecha) · NRS 3 · Irritabilidad baja · solo cuando P1 empeora»).
- **`📋 Notas`**: una línea «SÍNTOMAS:» con P1–P4 en formato compacto.
- **`📄 Informe`** (paciente/médico): en lenguaje llano, sin jerga («Refiere además dolor en la pierna derecha, menos intenso, que aparece cuando empeora el dolor lumbar»). La otra región, como «pendiente de valorar».
- **Informe con IA**: un bloque «Síntomas» numerado en los datos, y en `REGLAS_COMUNES` una regla para no mezclar intensidades ni comportamientos entre síntomas. El NRS de un secundario cuenta como «figura en la valoración» para la regla `nrs` (si no, daría un falso positivo). Siguiendo la costumbre del repo, **no se añaden reglas de revisión nuevas por adelantado**: solo cuando un informe real muestre el fallo (p. ej. un NRS cambiado de síntoma), con ese informe en `tests/fixtures/informes/`.
- **Fase 6**: decisión 7.
- **Árbol (fase 4)**: decisión 8. Las hipótesis no cambian.

## Pruebas

- **Unitarias** (`tests/unit/sintomas.mjs`, hechas en el paso 1): payload con y sin secundarios; sesiones antiguas; resúmenes; prompt; el NRS de un secundario no dispara la regla `nrs` y su lado no es una contradicción; nada de esto en el payload cuando está vacío. Pendientes para los pasos 3 y 4: los `pasos` de cada zona existen en su árbol; el plan elige el más irritable y desempata con P1.
- **Smoke** (sección `sintomas`, hecha en el paso 1): añadir hasta P4 y no más; quitar con y sin confirmación; «Hacer principal»; persistencia al recargar; fase 5; región sin zonas sin tarjeta; cabe a 320 px. Pendiente para el paso 3: la pista en el paso del árbol.

## Por pasos

1. **Tarjeta «Síntomas»** en la fase 3, estado, payload, resúmenes y bloque del prompt de la IA. Lumbar como piloto, para revisar las zonas y la ficha corta en consulta real.
2. **Zonas de las otras 6 regiones**, una por sesión, con tu revisión.
3. **Pistas en el árbol** (decisión 8), región a región, junto con el paso 2.
4. **Fase 6**: dosificación según el más irritable y aviso del síntoma independiente.
5. **Mapa dibujado** opcional sobre las mismas zonas, solo si después hace falta.

## Pendiente de decidir

- **Listas de zonas**: revisar la tabla de arriba, región a región.
- **NRS de P1**: ¿sigue siendo un solo valor, o pasa a ahora / peor / mejor? Propuesta: un solo valor, como ahora. Cambiarlo afecta a `nr`, a physiq-report y a las reglas `nrs-momento`, así que sería un cambio aparte.
- **Descripción en los secundarios**: ¿solo la nota libre, o también los chips de descripción de P1?
- **Orden**: ¿se puede convertir un secundario en P1 (botón «Hacer principal»)? Propuesta: sí, intercambiando los datos, porque a veces el paciente cambia de idea sobre qué le molesta más.
