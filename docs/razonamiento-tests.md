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
6. **«Ampliar →»** (solo si hay `razonamiento`): abre el mismo panel de la fase 2 (`abrirPanelRazon()`, `app.js`; lateral sin velo en escritorio, bottom sheet con velo en móvil, atrás lo cierra). Secciones: Por qué (si hay), Cuánto pesa (la frase generada), En detalle (`razonamiento.detalle`, párrafos separados por `\n\n`), Fuentes (`razonamiento.citas`, o la `fuente` del test partida por « · »). Se cierra al cambiar de fase o al reconstruir las tarjetas.

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

## Salvaguarda: nada se pierde al recortar
`tests/fixtures/criterios-4b.json` guarda, para cada test (`<hipótesis>|<nombre>`), los trozos de su texto (cortados tras «.», «;» o «:»; `tests/criterios.mjs`). `tests/unit.js` («criterios 4b: nada se pierde») exige que cada trozo siga, literal, en el `criterio` o en `razonamiento.detalle` (sin distinguir mayúsculas ni el signo final, para poder cortar «…30°:» como «…30°.»), salvo los de `retiradas`. Añadir texto es libre. Si el test falla:
- una frase se perdió al mover texto → vuelve a ponerla;
- la quitaste o reescribiste a propósito (corrección clínica) → `node tests/gen-criterios-snapshot.mjs` y comitea la instantánea con el cambio;
- es una nota de mantenimiento → añádela a mano a `retiradas` de ese test, pon el comentario en `data/` y regenera.

## Procedimiento por región
**Fase 1 — recortar el criterio** (mover texto, sin buscar fuentes):
1. Listar los trozos de cada test de la región (`trozos()` de `tests/criterios.mjs`) y decidir qué se queda visible (técnica, positivo, avisos de consulta), qué va al detalle y qué es nota de mantenimiento.
2. Aplicar con cuidado de no reescribir: solo mover trozos, y como mucho añadir un sujeto al principio del detalle cuando el trozo empieza por «es…».
3. `node tests/unit.js` (incluye «nada se pierde»), `node tests/gen-referencias.mjs` (las menciones movidas salen como «en `razonamiento.detalle`») y `node tests/smoke.mjs`.
4. Tabla de revisión para el usuario (test · visible · al panel · retirado). No se fusiona hasta que la valide.

**Fase 2 — el «por qué»**, solo para los tests que puntúan (`testPuntua`), con los artículos completos (PDF del usuario cuando no sean de acceso abierto). Toda referencia nueva entra en `data/referencias.js` con su DOI verificado, como en la Fase F. Para hombro hay candidatos localizados en PubMed, leídos solo en resumen: Pappas 2006 (RM de las posiciones de Neer y Hawkins), Yamamoto 2009 (cadáver, Neer y Hawkins) y Hertel 1996 (signos de retraso); los dos primeros no coinciden en qué tendón contacta en Hawkins.
