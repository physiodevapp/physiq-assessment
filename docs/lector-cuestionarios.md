# Lector de cuestionarios con foto

Estado (2026-10): **paso 1, medición**. La herramienta, la hoja de respuestas y el módulo puro están hechos. Hay una primera ronda con 2 hojas (PHQ-9 y ODI; ver «Mediciones»), que no basta para decidir nada. **La app no carga nada de esto** (test unitario). El paso 2 (integración) solo se hará si la medición supera el umbral y el usuario lo aprueba.

## Idea

Un botón «📷 Leer la hoja» dentro de la calculadora de cuestionarios (`docs/cuestionarios.md`, §8). La foto va a un modelo con visión, que lee las marcas y propone las respuestas. El fisioterapeuta ve cada ítem ya marcado y lo confirma o lo corrige; los dudosos salen destacados. La puntuación y la interpretación las sigue calculando `puntuar()` (`lib/cuestionarios.js`) con sus reglas de siempre: la IA nunca puntúa ni interpreta.

## Reglas que no se negocian (usuario, 2026-10)

- **Nada se puntúa sin que el fisioterapeuta confirme cada respuesta.** Una marca mal leída cambia la puntuación sin que se note.
- **Solo fuera del hub y con licencia «real»**, como el informe con IA. Con un aviso de privacidad: la foto sale del dispositivo hacia Anthropic a través del servidor de PhysiQ, y se pide que en ella no salga el nombre del paciente.
- **La foto no se guarda** en ningún sitio: ni en `state`, ni en IndexedDB, ni en el payload, ni en el `.json` exportado.
- **El lector devuelve solo el número de ítem y el valor marcado**, nunca el texto del cuestionario. Así lo impone el esquema de salida: ninguna cadena libre, todo valor en un `enum` (test unitario).
- **No se inventan reglas de puntuación ni umbrales.** Si un cuestionario no se puede leer bien, se queda sin lector.

## Decisiones

1. **Se fotografía una hoja de respuestas de PhysiQ, no el cuestionario oficial** (usuario, 2026-10). El paciente lee el texto validado en la hoja del titular y marca sus respuestas en una hoja generada desde `data/cuestionarios.js`.
   - **A favor:** no reproduce texto con derechos (solo el número del ítem, nuestra etiqueta corta y las casillas); es la misma hoja para todos los cuestionarios; y está pensada para leerse bien.
   - **En contra:** cambia la forma de pasar el cuestionario (dos papeles), y esa forma no está validada. Ver «Pendiente antes de usarla con pacientes».
2. **Las escalas visuales en mm o cm no se leen** (usuario, 2026-10). Medir milímetros en una foto inclinada no es fiable, y 5 mm de error cambian la puntuación. Por eso el iHOT-12 se queda sin hoja, y la EVA del ASES la apunta el fisioterapeuta en la app; la hoja lo dice en esa fila.
3. **Las fotos no entran en el repo** (usuario, 2026-10). Junto a la hoja pueden salir el texto de cuestionarios con licencia, letra, caras o metadatos. Se pasan a la herramienta con `--fotos`; en el repo solo quedan las respuestas correctas y las lecturas. Un test falla si aparece una imagen en `tests/fixtures/cuestionarios-foto/`.
4. **Las casillas se rotulan como el papel oficial** (usuario, 2026-10: «según el orden del papel oficial o lo que recomiendes»). Lo que se recomendó y se hizo: la casilla lleva lo mismo que el paciente ve en el cuestionario, para que no tenga que traducir nada.
   - **Número**, donde el papel imprime el número que el paciente rodea o marca (PHQ-2, PHQ-9, GAD-7, TSK-11, FABQ, PCS, CADC, Örebro, SPADI, PRTEE, DASH, LEFS, VISA-P, VISA-A). La hoja repite la leyenda de los números.
   - **Palabra**, donde el papel tiene columnas con palabras y sin números (WOMAC, HOS, FAAM y la función del ASES), en el orden del papel: en el HOS y el FAAM la primera columna es «Ninguna dificultad» / «Sin dificultad», que vale 4 (`hoja.orden: 'descendente'`). Como cada casilla dice la respuesta, aunque el orden de una hoja concreta fuera otro, el paciente no se equivoca de casilla.
   - **Letra de la posición** (A = la primera), donde cada ítem tiene sus propias frases o respuestas (ODI, NDI —su papel ya usa A–F— y KOOS, cuyas respuestas cambian de un ítem a otro). La hoja explica cómo se cuenta.
   - La casilla N/A lleva el rótulo del papel: «No responde» en el HOS, «No conduzco» en el ítem de conducir del NDI; el ODI no la lleva (quien no se identifica con ninguna frase deja la fila en blanco, y el fisioterapeuta pone N/A).
   - Se define en `hoja` (`data/cuestionarios.js`); no cambia cómo puntúa la calculadora. El lector devuelve el rótulo de la casilla y `casillasItem()` lo traduce al valor.
   - **Por comprobar con la hoja española de cada uno:** el orden de las columnas del HOS y del FAAM está tomado de su leyenda en la app (la primera, la de 4 puntos), no de la hoja; y que el PHQ, el GAD-7, el TSK-11, el DASH y el LEFS impriman los números en el papel.
5. **Umbral aceptado** (usuario, 2026-10). Lo comprueba `UMBRAL`, en `lib/lector-cuestionarios.js`; un cuestionario tiene lector solo si cumple las tres condiciones en la peor pasada:
   - menos del 0,5 % de ítems peligrosos;
   - ninguno peligroso en un ítem con alerta de seguridad (el 9 del PHQ-9);
   - como mucho el 15 % de los ítems a revisar.

## La hoja de respuestas

La genera `docs/esquemas/respuestas.mjs` y la imprime `node docs/esquemas/generar-respuestas.mjs [id|todos]`, que escribe `docs/esquemas/respuestas/<id>.pdf` y su `.png`. Hay 27 hojas: todos los cuestionarios de la calculadora menos el iHOT-12.

**Qué lleva:**

- Una fila por ítem: su número `n` en un recuadro oscuro, nuestra etiqueta corta y las casillas.
- Las casillas, rotuladas como el papel oficial (decisión 4):
  - escala: una casilla por número, por palabra o por letra de posición;
  - opciones y marcas múltiples: casillas numeradas desde 1, cada una con el texto corto de la opción;
  - sí/no: «Sí» y «No»;
  - N/A, con el rótulo del papel, en los ítems que lo admiten.
- La instrucción «No escribas tu nombre ni ningún otro dato en esta hoja».
- Cuatro marcas negras en las esquinas de cada página.
- Un pie con el cuestionario, la versión y la página.

**Versión:** `huellaHojaRespuestas()` resume las filas y las casillas (no la fuente ni la interpretación), y la hoja la imprime como «v. …». `docs/esquemas/respuestas/huellas.json` la guarda con la fecha de su último cambio (`{ huella, fecha }`, como `docs/esquemas/huellas.json`), y `node tests/unit.js` falla si cambian los ítems de un cuestionario sin regenerar su hoja.

**Dónde se descargan** (usuario, 2026-10): la página «Hojas para imprimir» de la guía (`guia.html#hojas`, que la app enlaza desde el panel de sesión) las lista al final, en «Hojas de respuestas del lector con foto (en prueba)», cada una con su «v.», su fecha y su PDF, bajo el aviso «En prueba: no las uses con pacientes». El despliegue copia `docs/esquemas/respuestas/` (PDF y `huellas.json`). La app no tiene ningún otro acceso, y el lector sigue sin estar en la app ni en la guía.

## El lector (`lib/lector-cuestionarios.js`)

Es un módulo puro, para que lo que se mida sea exactamente lo que después se integre.

- **Lo que se envía:** la foto (una por página, en orden) y `promptLectura(def)`, que describe cada fila con sus casillas.
- **La salida forzada:** `esquemaLectura(def)` es un objeto con una entrada por ítem, `{ estado, valor }`.
  - `estado` es `marcado`, `dudoso` (con la mejor lectura), `en_blanco` o `ilegible`.
  - `valor` solo admite el rótulo de una casilla (el número, la letra, la palabra, la posición de la opción, `si`/`no` o `na`), o `null`.
- **La foto:** se reduce a 1568 px de lado largo (`LADO_FOTO`) y se recodifica en JPEG, lo que quita el EXIF y aplica la orientación.
- **Validación:** `normalizarLectura()` trata como ilegible cualquier valor fuera de las casillas o cualquier combinación incoherente.
- **Paso a la calculadora:** `casillasItem()` da, para cada ítem, las casillas en el orden del papel con su rótulo y su valor; `propuestaConfirmacion()` pasa lo leído al formato de la calculadora y separa los dudosos y los pendientes.

## Protocolo de medición

Herramienta: `tools/leer-cuestionario.mjs`, como `tools/verificar-informe.mjs`. Casos: `tests/fixtures/cuestionarios-foto/`; su `LEEME.md` explica cómo prepararlos y el formato.

- **Hojas:** al menos 6 por cuestionario, con respuestas inventadas, por personas y con bolígrafos distintos. Incluyen a propósito casos difíciles: marca entre dos casillas, casilla tachada y vuelta a marcar, dos marcas, filas en blanco, y X, círculo y tic.
- **Fotos:** con dos o tres móviles, plana, inclinada, con sombra y doblada.
- **Cuestionarios:** uno o dos de cada tipo de hoja:

  | Tipo de hoja | Cuestionarios |
  |---|---|
  | Rejilla corta | PHQ-9, GAD-7, TSK-11 |
  | Rejilla larga, varias páginas | KOOS, DASH, WOMAC |
  | Escala 0–10 | SPADI, PRTEE, CADC |
  | Frase 0–5 | ODI, NDI |
  | Opciones con texto | CAIT, Kujala |
  | Sí/no | DN4, Roland-Morris |
  | Marcas múltiples y mezcla | Örebro |

- **Modelos:** `claude-haiku-5-5`, `claude-sonnet-5-5` y `claude-opus-5-5` (este, como techo). Hoy el worker usa modelos de la generación anterior (`claude-sonnet-4-5`, `claude-haiku-4-5`), así que en el paso 2 pasaría al elegido.
- **Pasadas:** 3 por foto (`--veces`); el veredicto usa la peor.
- **Clases de cada ítem** (`clasificarItem()`):

  | Clase | Qué es |
  |---|---|
  | ok | Leído bien; una fila en blanco dada como en blanco; una marca ambigua dada como dudosa o ilegible |
  | 🔴 peligroso | `marcado` con otro valor; una marca inventada en una fila en blanco; una marca ambigua dada por clara |
  | dudoso | El lector la marca como dudosa (acierte o no) |
  | pendiente | Ilegible, o una lectura incoherente |
  | omitido | Dada en blanco cuando había marca |

  «A revisar» es la suma de dudosos, pendientes y omitidos: los completa el fisioterapeuta a mano.
- **Coste por hoja:** con el `usage` real de cada respuesta.
- **Lo que imprime la herramienta:** cada hoja con sus 🔴 detallados; un resumen por cuestionario y modelo con la peor pasada y el veredicto ✓/✗; y el resultado por condición de la foto.
- **Aviso estadístico:** sin errores 🔴 en N ítems, la tasa real solo es menor que 3/N con un 95 % de confianza (regla del tres). Con 6 hojas de 9 ítems (54 lecturas por pasada), eso no prueba menos del 0,5 %. Si un cuestionario corto supera el umbral con pocas hojas, hay que añadir más antes de decidir.

```
node tools/leer-cuestionario.mjs --comprobar
ANTHROPIC_API_KEY=… node tools/leer-cuestionario.mjs --fotos ~/fotos-lector --guardar
node tools/leer-cuestionario.mjs --respuestas      # vuelve a puntuar sin gastar
```

## Mediciones

### Ronda 1 (2026-10-30): 2 hojas, sin decisión

- **Casos:** `phq9-01` (todo con X, plana, buena luz en la zona de las filas) y `odi-01` (poca luz, algo borrosa; fila 2 en blanco, 4 con la B rayada y X en D, 5 con tic, 6 con dos marcas, 8 entre dos casillas). Una foto de cada uno, móvil del usuario, con una sombra grande sobre la parte vacía de la hoja.
- **Ejecución:** `--modelo todos --veces 3 --guardar`; lecturas en `tests/fixtures/cuestionarios-foto/lecturas/`.

| Modelo | PHQ-9 (9 ítems) | ODI (10 ítems) | Coste por hoja |
|---|---|---|---|
| Haiku | ✓ · 0 🔴 · 0 % a revisar | **✗** · 1 🔴 (10 %) · 10 % a revisar | 0,0009 $ |
| Sonnet | ✓ · 0 🔴 · 0 % a revisar | ✓ · 0 🔴 · 0 % a revisar | 0,013 $ |
| Opus | ✓ · 0 🔴 · 0 % a revisar | ✓ · 0 🔴 · 0 % a revisar | 0,026 $ |

- **Único 🔴:** Haiku, pasada 2, ODI fila 8 (marca entre C y D): la dio por «D» clara; en las otras dos pasadas, «dudoso (D)».
- **Filas difíciles del ODI**, todos los modelos: la fila en blanco siempre en blanco; el tic, bien; la B rayada, D (Haiku, como dudoso); las dos marcas, siempre dudosas (con A o con C como mejor lectura); entre casillas, dudoso salvo el 🔴 de Haiku.
- **PHQ-9:** perfecto en las 9 pasadas, también el ítem 9 (alerta).
- **«A revisar» no cuenta las filas ambiguas** que el lector da por dudosas (`clasificarItem()` las cuenta como ok). Por eso Sonnet y Opus salen con un 0 % en el ODI aunque el fisioterapeuta revisaría a mano las filas 6 y 8 (20 % de la hoja). Si el umbral del 15 % debe incluirlas está pendiente de decidir (usuario).
- **Lectura, sin decidir:** con 9 y 10 ítems sin 🔴, por la regla del tres la tasa real solo queda por debajo de un 33 % y un 30 % al 95 %, lejos del 0,5 %. Haiku ya falla en una marca ambigua; Sonnet y Opus no se distinguen, y Sonnet cuesta la mitad.

## Pendiente antes de usarla con pacientes (decisiones del paso 2)

- **Comprobar con cada hoja española** lo que la decisión 4 deja «por comprobar» (orden del HOS y del FAAM; números impresos en el PHQ, el GAD-7, el TSK-11, el DASH y el LEFS). Si una difiere, se cambia su `hoja` y se regenera.
- **Validez del formato:** pasar el cuestionario con una hoja de respuestas aparte no es el formato validado. Es una decisión clínica pendiente.
- **Diseño del paso 2:** la ruta nueva del worker (physiq-report), el botón, la pantalla de confirmación, el aviso de privacidad, las pruebas y el smoke. Se explica al usuario antes de escribirlo.
