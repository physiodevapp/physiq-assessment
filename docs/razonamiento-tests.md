# «¿Por qué?» de los tests de la fase 4b

Proyecto de contenido y de interfaz: que la tarjeta de cada test de la fase 4b muestre en primer plano solo lo que hace falta con las manos en el paciente, y que la evidencia y el porqué queden a un toque. Es el mismo sistema de la fase 2 (`docs/razonamiento-cribado.md`), adaptado: en la fase 2 faltaba información; en la 4b sobraba en primer plano (el `criterio` mezclaba técnica, discusión de la evidencia y notas de mantenimiento). Material de apoyo al clínico: nunca entra en el payload, ni en `📋 Notas`, ni en `📄 Informe` (test unitario).

**Una región por sesión.** Estado por región: `MIGRATION_PLAN.md`, Fase H. Maqueta con la que se decidió el diseño (2026-10): cuatro tests de hombro, hoy frente a propuesta.

## Diseño decidido con el usuario (2026-10)

Tarjeta del test, de arriba abajo:

1. Nombre y badges (S, E, LR), como siempre.
2. **«Cuánto pesa», siempre visible** (`.test-peso`): una frase **generada**, no escrita, por `pesoTest()` (`phase4b.js`) con las mismas reglas que `calcLRScore`, así que no puede contradecir la puntuación (test unitario sobre los 484 tests contra `testPuntua`). Frases (`PESO_TEST`): sirve para confirmar y para descartar / para confirmar / para descartar; sin LR aplicable; LR por debajo del umbral; regla pronóstica; puntúa dentro del cluster; cluster sin LR. Un test que forma parte de un compuesto con `absorbe` añade «No suma aparte si puntúa «<compuesto>»». Sustituye a la etiqueta «Sin LR publicada · cuenta como hallazgo clínico». Dos frases, sin graduar la intensidad («algo», «mucho»): se añadirá la gradación solo si se queda corta, y entonces con los cortes clásicos de LR y su referencia en el registro.
3. **`criterio` corto**: técnica y criterio de positivo, más los avisos que hacen falta junto al paciente (p. ej. «No usar en hombro congelado: …», «Solo con la Rx ya hecha»). En un cluster, la técnica de cada componente se queda: es lo que se hace.
4. **«ⓘ ¿Por qué?»** (`razonamiento.porque`, `<details>` cerrado, mismo estilo que la fase 2): qué carga el test y por qué un resultado significa lo que significa. **Solo con fuente leída; sin fuente, no hay campo** y no se pinta nada.
5. Fuente: con «Ampliar», solo autor y año (`fuenteCorta()`); sin «Ampliar», la cita entera, como antes.
6. **«Ampliar →»** (solo si hay `razonamiento`): abre el mismo panel de la fase 2 (`abrirPanelRazon()`, `app.js`; lateral sin velo en escritorio, bottom sheet con velo en móvil, atrás lo cierra). Secciones: Por qué (si hay), Cuánto pesa (la frase generada), En detalle (`razonamiento.detalle`, párrafos separados por `\n\n`), Fuentes (`razonamiento.citas`, o la `fuente` del test partida por « · »), cada una con «Abrir ↗» a la `url` del registro o a su DOI (`enlaceCita()`; el registro se carga con `import()` al abrir el primer panel; un test exige que cada cita de un test con `razonamiento` empiece por una clave del registro). Se cierra al cambiar de fase o al reconstruir las tarjetas.

### Esquema (`data/<región>.js`, en cada test)
```js
razonamiento: {
  porque?:  string,   // con fuente leída; si no, no existe
  detalle?: string,   // lo que sobraba del criterio, movido sin reescribir
  fuentes?: [clave],  // claves de data/referencias.js (como en la fase 2) — para el «por qué»
  citas?:   [string | { texto, url }],
}
```
`peso` no existe: se calcula. Nada de esto cambia `sn`, `sp`, `lr_pos`, `lr_neg`, `cluster`, `absorbe` ni la puntuación.

### Notas de mantenimiento
Lo que solo explica una decisión de datos («S y E solo aquí, para que no se recalcule la LR−», «el VPP que figuraba aquí no tenía fuente y se ha quitado») sale del texto visible y pasa a un comentario `// Nota de mantenimiento, retirada del criterio visible: «…»` encima del test en `data/<región>.js`, y a `retiradas` de ese test en la instantánea.

### Frases que repiten «cuánto pesa»
Las frases escritas a mano que solo dan el veredicto que ya genera `pesoTest()` («Sirve para descartar; un positivo es solo un hallazgo», «un negativo no descarta», «no puntúa», «Cuenta como hallazgo.») se quitan del detalle (decisión del usuario, 2026-10, al revisar hombro): el panel ya muestra la frase generada justo encima. Van a `retiradas` de la instantánea, sin comentario en `data/`. Se quedan las que dan una razón («Evidencia contradictoria, así que no puntúa», «Solo puntúa positivo: la LR− tan baja no se reproduce…», «Los dos intervalos incluyen el 1») y «Sin S ni E», que explica por qué no hay LR.

## Salvaguarda: nada se pierde al recortar
`tests/fixtures/criterios-4b.json` guarda, para cada test (`<hipótesis>|<nombre>`), los trozos de su texto (cortados tras «.», «;» o «:»; `tests/criterios.mjs`). `tests/unit.js` («criterios 4b: nada se pierde») exige que cada trozo siga, literal, en el `criterio` o en `razonamiento.detalle` (sin distinguir mayúsculas ni el signo final, para poder cortar «…30°:» como «…30°.»), salvo los de `retiradas`. Añadir texto es libre. Si el test falla:
- una frase se perdió al mover texto → vuelve a ponerla;
- la quitaste o reescribiste a propósito (corrección clínica) → `node tests/gen-criterios-snapshot.mjs` y comitea la instantánea con el cambio;
- es una nota de mantenimiento → añádela a mano a `retiradas` de ese test, pon el comentario en `data/` y regenera.

## Procedimiento por región
**Fase 1 — recortar el criterio** (mover texto, sin buscar fuentes):
1. Listar los trozos de cada test de la región (`node tools/repartir-criterios.mjs listar <región>`) y decidir qué se queda visible (técnica, positivo, avisos de consulta), qué va al detalle, qué es nota de mantenimiento y qué solo repite «cuánto pesa» (se quita).
2. Aplicar con `node tools/repartir-criterios.mjs aplicar <región> <plan.json>` (plan: `{ "<hipótesis>#<índice>": { "k": [trozos visibles], "r": [notas de mantenimiento], "x": [frases que solo repiten «cuánto pesa»] } }`; el resto va al detalle; los de `x` van a `retiradas`, sin comentario). Solo mueve trozos; a mano, como mucho, añadir un sujeto al principio del detalle cuando el trozo empieza por «es…».
3. `node tests/unit.js` (incluye «nada se pierde»), `node tests/gen-referencias.mjs` (las menciones movidas salen como «en `razonamiento.detalle`») y `node tests/smoke.mjs`.
4. Tabla de revisión para el usuario (test · visible · al panel · retirado). No se fusiona hasta que la valide.

**Fase 2 — el «por qué»**, empezando por los tests que puntúan (`testPuntua`), con los artículos completos (PDF del usuario cuando no sean de acceso abierto); un test que no puntúa también lo lleva si su fuente ya está leída. Toda referencia nueva entra en `data/referencias.js` con su DOI verificado, como en la Fase F. Cada test lleva `porque` (1–3 frases, lo que dice la fuente, sin rellenar lo que no explica), `fuentes` (claves del registro, que se ven al pie del «¿Por qué?») y `citas` (cita completa con páginas, que el panel añade a las de la `fuente` del test); lo que la fuente aporta además (técnica original, cifras de la serie, falsos positivos y negativos) se añade como párrafo nuevo del `detalle`. `tests/referencias.mjs` cuenta estos usos como «razonamiento 4b». Conflictos entre fuentes: la misma regla que en la Fase F (`docs/razonamiento-cribado.md`).

Hecho en hombro (2026-10), con 6 artículos en PDF del usuario leídos enteros: arco doloroso (Kessel y Watson 1977), Hawkins y Neer (Yamamoto 2009, Pappas 2006), los dos signos de retraso (Hertel 1996), aprehensión y recolocación (Speer 1994) y sorpresa (Gross y Distefano 1997). Después, con el cap. 3.1 de Lluch 2020 (PDF del usuario, pp. 53–54, 57–59, 61, 63–64, 66–67 y 69–70), la rotación externa resistida (p. 54: el dolor del SAPS se reproduce con los tests resistidos y la mecanosensibilidad impide localizar la estructura). Los clusters A y B de rotura siguen sin «por qué»: el capítulo (p. 66) solo los enumera con sus LR. Decisiones del usuario al revisarlo (2026-10): en Hawkins y Neer prevalece Yamamoto 2009 (cadáver) sobre Pappas 2006 (RM en sanos), del mismo nivel y anterior, en qué tendón contacta con el arco; el criterio visible del test de sorpresa sigue al estudio original (Gross y Distefano 1997); un test que no puntúa puede llevar «por qué» si su fuente ya está leída (recolocación).

Rodilla, fase 1 (2026-10): 33 de 90 tests repartidos con la clave `x` (19 frases retiradas) y 2 notas de mantenimiento. Decisiones del usuario al revisarlo: un test sin técnica en el criterio (Thessaly, Thomas) se queda así hasta que una fuente leída la dé en la fase 2; una frase que mezcla la definición de un cluster con sus cifras, o un aviso de seguridad con el veredicto (Ottawa: «obliga a la radiografía»), se queda visible entera; y cuando el texto del panel contradice la LR guardada, manda la regla de los rangos (pivot shift: LR− 0,56, el extremo del IC más cercano a 1, en vez de 0,48).

Rodilla, fase 2 (2026-10), con el cap. 4.2 de Lluch 2020 (pp. 191–225) y 12 artículos en PDF del usuario leídos enteros: crepitación (Schiphof 2014), agrandamiento óseo (Zhang 2010), McMurray y palpación de la interlínea (McMurray 1942; la segunda también con Lluch, p. 209, y Décary 2018, PM&R), los dos grupos de desgarro meniscal (Décary 2018, PM&R), Thessaly (Karachalios 2005), sentadilla (Lluch, p. 194), Lachman y cajón anterior (Butler 1980, Torg 1976), pivot shift (Matsumoto 1990), lever sign (Lelli 2016), los dos grupos del LCA (Lluch, pp. 206–207, y Décary 2018, PLoS One), valgo forzado del LCM (Lluch, p. 208) y regla de Ottawa (Stiell 1995 y 1996). Un test sin técnica en el criterio la recibe de la fuente original leída (Thessaly, con su aviso de seguridad). Un capítulo de libro sirve de fuente del «por qué» cuando explica el mecanismo (LCM, sentadilla), aunque sus cifras se tomen del artículo original: el cap. 4.2 da al grupo «confirmar» del LCA la S de otro grupo de Décary (0,58 en vez de 0,82). Después, con dos PDF más del usuario: la combinación de tests clínicos del menisco (Solomon 2001) y los dos grupos de Décary del dolor femoropatelar (Décary 2018, Arch Phys Med Rehabil). Cuando el artículo no explica el mecanismo de cada criterio, el «por qué» de un grupo de reglas da la definición del cuadro y por qué esos datos discriminan según los autores (coincidencia con el consenso, edad de la cohorte), sin inventar el resto. Solo la restricción de movilidad de `ro1` sigue sin «por qué».
