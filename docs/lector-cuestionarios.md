# Lector de cuestionarios con foto

Estado (2026-10): **paso 1, medición**. La herramienta, la hoja de respuestas y el módulo puro están hechos, pero no hay ninguna medición todavía: faltan las fotos. **La app no carga nada de esto** (test unitario). El paso 2 (integración) solo se hará si la medición supera el umbral y el usuario lo aprueba.

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
4. **Umbral aceptado** (usuario, 2026-10). Lo comprueba `UMBRAL`, en `lib/lector-cuestionarios.js`; un cuestionario tiene lector solo si cumple las tres condiciones en la peor pasada:
   - menos del 0,5 % de ítems peligrosos;
   - ninguno peligroso en un ítem con alerta de seguridad (el 9 del PHQ-9);
   - como mucho el 15 % de los ítems a revisar.

## La hoja de respuestas

La genera `docs/esquemas/respuestas.mjs` y la imprime `node docs/esquemas/generar-respuestas.mjs [id|todos]`, que escribe `docs/esquemas/respuestas/<id>.pdf` y su `.png`. Hay 27 hojas: todos los cuestionarios de la calculadora menos el iHOT-12.

**Qué lleva:**

- Una fila por ítem: su número `n` en un recuadro oscuro, nuestra etiqueta corta y las casillas.
- Las casillas, según el tipo de ítem, con los mismos valores que la calculadora:
  - escala: una casilla por número;
  - opciones y marcas múltiples: casillas numeradas desde 1, cada una con el texto corto de la opción;
  - sí/no: «Sí» y «No»;
  - N/A, en los ítems que lo admiten.
- La instrucción «No escribas tu nombre ni ningún otro dato en esta hoja».
- Cuatro marcas negras en las esquinas de cada página.
- Un pie con el cuestionario, la versión y la página.

**Versión:** `huellaHojaRespuestas()` resume las filas y las casillas (no la fuente ni la interpretación), y la hoja la imprime como «v. …». `docs/esquemas/respuestas/huellas.json` la guarda, y `node tests/unit.js` falla si cambian los ítems de un cuestionario sin regenerar su hoja.

## El lector (`lib/lector-cuestionarios.js`)

Es un módulo puro, para que lo que se mida sea exactamente lo que después se integre.

- **Lo que se envía:** la foto (una por página, en orden) y `promptLectura(def)`, que describe cada fila con sus casillas.
- **La salida forzada:** `esquemaLectura(def)` es un objeto con una entrada por ítem, `{ estado, valor }`.
  - `estado` es `marcado`, `dudoso` (con la mejor lectura), `en_blanco` o `ilegible`.
  - `valor` solo admite lo que la casilla imprime, o `null`.
- **La foto:** se reduce a 1568 px de lado largo (`LADO_FOTO`) y se recodifica en JPEG, lo que quita el EXIF y aplica la orientación.
- **Validación:** `normalizarLectura()` trata como ilegible cualquier valor fuera de las casillas o cualquier combinación incoherente.
- **Paso a la calculadora:** `propuestaConfirmacion()` pasa lo leído al formato de la calculadora (posición → índice) y separa los dudosos y los pendientes.

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

## Pendiente antes de usarla con pacientes (decisiones del paso 2)

- **Cómo pasa el paciente su respuesta del cuestionario oficial a la casilla.** Las casillas usan los valores de la calculadora, que no siempre son el orden del papel oficial:
  - en el HOS, la primera respuesta del papel («ninguna dificultad») vale 4;
  - en el ODI y el NDI, la casilla es la posición de la frase (0–5);
  - en el KOOS, la posición de la casilla.

  Para medir la lectura da igual (las respuestas son inventadas), pero con pacientes hay que decidir cuestionario a cuestionario cómo se rotulan las casillas para que no se equivoquen.
- **Validez del formato:** pasar el cuestionario con una hoja de respuestas aparte no es el formato validado. Es una decisión clínica pendiente.
- **Diseño del paso 2:** la ruta nueva del worker (physiq-report), el botón, la pantalla de confirmación, el aviso de privacidad, las pruebas y el smoke. Se explica al usuario antes de escribirlo.
