# Tiempos de recuperación de tejidos

Consulta desde la cabecera (icono ⏱ `#tejidosBtn`, en cualquier fase, también en el hub). Lo pidió el usuario (2026-10) para tener a mano el diagrama de tiempos de recuperación que hasta ahora estaba en physiq-wiki («Tiempos de Tejido»), con ese mismo formato de referencia.

## Decisiones (usuario, 2026-10)

1. **Dónde**: un icono en la cabecera que abre el diagrama en una hoja inferior en móvil y en un diálogo centrado (hasta 760 px) en escritorio. Funciona igual que «✨ Preguntar a la IA»: el atrás, deslizar hacia abajo, tocar el velo y Escape lo cierran. A diferencia de ese, también está en el hub, porque no usa la red.
2. **Contenido**: la tabla del wiki corregida (ver abajo). La ampliación con más tejidos queda para más adelante, con fuente leída para cada fila.
3. **Línea «Hoy»**: con mecanismo Post-quirúrgico y semanas desde la cirugía (fecha o semanas aproximadas de la tarjeta «Cirugía», `semanasCirugia()`), una línea vertical marca dónde está el paciente. En los demás casos no se marca nada: la cronología es una categoría, no una fecha.

## Qué es solo consulta

El panel lee `state.mecanismo` y `state.cirugia` para pintar, nada más. No entra en el payload, en `📋 Notas`, en `📄 Informe` ni en el prompt del informe con IA. Lo comprueban `tests/unit/tejidos.mjs` (ningún módulo de resúmenes, informe o fases 4/4b lo importa) y el smoke test (el payload no lo contiene).

## Archivos

| Archivo | Qué hace |
|---|---|
| `data/tejidos.js` | `TIEMPOS_TEJIDO`: columnas del eje, gravedades, grupos y filas, fases de reparación, notas y fuente. Contenido clínico sin lógica; lo reexporta `data.js` |
| `lib/tejidos.js` | Funciones puras: `posicionDia()` (día → posición en el eje no lineal), `marcaHoy()`, `tiemposTejidoHTML()` |
| `app.js` | `abrirTiemposTejido()` / `cerrarTiemposTejido()` |
| `index.html` | Botón de la cabecera y `#tejidosOverlay` |
| `styles.css` | Bloque «Tiempos de recuperación de tejidos» y tokens `--tej-*` (tema claro y oscuro). El eje de tiempo (`.tej-eje`) es `sticky`: se queda fijo arriba al hacer scroll dentro del panel (petición del usuario, 2026-10). Bajo sus etiquetas lleva una tira fina con los colores de las fases de reparación (`.tej-eje-fase`; naranja, verde y azul, los mismos de la franja, cuyo borde también toma el color de cada fase), para que al hacer scroll se siga viendo en qué fase cae cada columna (petición del usuario, 2026-10). El icono de la cabecera es un cronograma, no un reloj, para no confundirlo con el chip «⏱ Breve» |

El eje no es lineal: tiene las 8 columnas del wiki (de 1–3 días a 2 años), todas del mismo ancho. Cada columna tiene `hasta` (su último día), y con eso se colocan la franja de fases y la línea «Hoy» dentro de la columna, de forma lineal entre su primer y su último día.

## Correcciones respecto al wiki

- **Un solo color por fila.** En el wiki, la versión de escritorio pintaba la rotura muscular de grado III y el esguince de grado III con dos intensidades, y la de móvil con una. Ahora cada fila tiene una sola gravedad: mínima, leve, moderada o grave/reconstrucción. Los rangos de columnas de las filas del wiki no cambian (un test lo fija).
- **«Tendinopatía / Ruptura» se separa en dos filas.** «Tendinopatía» conserva el rango del wiki, con una nota: no es un plazo de cicatrización, sino de adaptación a la carga. «Rotura / reparación de tendón» es nueva: va de 5–8 semanas a 2 años, según Wu 2017 (Wu, Nerlich y Docheva, *EFORT Open Rev* 2(7):332; acceso abierto, leído entero, 2026-10). Wu dice que la remodelación «empieza a las 6–8 semanas de la lesión y dura alrededor de 1–2 años, según la edad y el estado del paciente», y que el tendón curado no suele recuperar las propiedades mecánicas del sano. Es biología de la curación y no plazos de vuelta a la actividad, y así lo dice la nota de la fila. Al principio iba de 2–3 meses a 1 año, marcada «pendiente de fuente».
- **«Dolor inducido por ejercicio»** pasa a llamarse «Dolor muscular tardío (DOMS)». El wiki usaba los dos nombres según la pantalla.
- **Leyenda de colores.** El wiki no tenía.
- **Franja de fases de reparación**, nueva: inflamatoria (días 0–5), proliferativa (día 5 a semana 3) y remodelación (semana 3 a 1 año). La fuente es Wallace 2023 (StatPearls, «Wound Healing Phases»; PDF del usuario, leído entero, 2026-10). Ese capítulo habla de heridas de la piel, así que el panel lo presenta como modelo general, con un aviso de que en tendón, ligamento y hueso los tiempos varían. Del capítulo salen estos datos: inflamatoria «varios días»; colágeno nuevo «hacia los días 5–7»; proliferativa «varias semanas»; remodelación desde «la semana 3» y «hasta 12 meses»; resistencia máxima de una incisión a las 11–14 semanas, con una cicatriz de ~80 % de la resistencia original.
- **Notas generales**: los rangos dependen del paciente y de la carga; el dolor y la función no siguen por fuerza el calendario del tejido; en el paciente posquirúrgico manda el protocolo del cirujano.

## Pendiente

- **Fuente del wiki sin verificar** (`'Snyder-Mackler 2012'` en `data/referencias.js`). Es probablemente el cap. 3, «Developing Treatment Pathways», de Andrews, Harrelson y Wilk, *Physical Rehabilitation of the Injured Athlete*, 4.ª ed. (Elsevier, 2012). Coinciden el título y el año, pero no está confirmado que el capítulo sea de Snyder-Mackler. El usuario no tiene el libro (2026-10), así que las filas que la citan siguen siendo las del wiki sin verificar.
- **Fila nueva sin fuente**: va con `pendiente: true` hasta tener una fuente leída. Al añadirla: clave en el registro, en `fuentes` de la fila, quitar `pendiente` y ejecutar `node tests/gen-referencias.mjs`. Hoy ninguna fila está pendiente.
- **Revisar las gravedades.** El color de la fractura (moderada) y el del tendón vienen de la intensidad que usaba el wiki, que no tenía leyenda.
- **Ampliación** (opción descartada para la primera versión): cartílago y menisco (zona vascular y avascular), fractura de estrés, nervio periférico, y la ligamentización del injerto de LCA más allá del año.

## Filtro por tejido y subtipos (2026-10)

- **Filtro**: encima del diagrama, unas pastillas «Todos · Tendón · Músculo · Ligamento · Hueso» (`data-filtro-tejido`). El título de cada grupo («LIGAMENTO») también filtra, y si el grupo ya está filtrado vuelve a «Todos». El eje fijo, la tira y la franja de fases y la línea «Hoy» se ven con cualquier filtro. La elección se recuerda en el dispositivo (`localStorage['physiq-assessment-tejidos-filtro']`, con try/catch; es una preferencia de interfaz, como el tema). A 320 px las pastillas pasan a dos líneas sin cortarse.
- **Remodelación más allá del año**: la tira se cortaba al año (Wallace 2023: «hasta 12 meses»), pero la barra del tendón sigue hasta los 2 años. Ahora hay una cuarta fase, «Remodelación (tendón)», del año 1 al 2, que cita a Wu 2017 y lleva `tejido: 'tendón'`; se pinta más clara (`.tej-fase-parcial`) porque no vale para todos los tejidos.
- **Subtipos**: una fila puede llevar `subtipos`, con la misma forma que una fila; sin `gravedad`, toman la de la fila madre. Se pintan plegados bajo ella en un `<details>` («Ver N subtipos»). La estructura y su validación (`tests/unit/tejidos.mjs`) están hechas, pero no hay ningún subtipo todavía: cada uno necesita su propia fuente leída. Propuesta de qué subtipos abordar y en qué orden, con sus fuentes candidatas: `MIGRATION_PLAN.md`, **Fase J**.

## Fase J, 1: esguince lateral de tobillo (2026-10)

Cuatro subtipos bajo las filas de esguince del wiki: «Tobillo, ligamento lateral» en los grados I, II y III, y «Tobillo, reparación quirúrgica» bajo el grado III. Fuentes, en PDF del usuario y leídas enteras:

- **Bergman 2025** (StatPearls, «Acute Ankle Sprain», act. 2025-08-02). Apartados «Short-Term Prognosis» y «Return-to-Sport Timeline»: grado I, 1–2 semanas; grado II, 3–6; grado III, 6–12 o más, a veces con cirugía por inestabilidad persistente; tras la reparación, vuelta al juego hacia los 3–4 meses. Es la fuente de los rangos, porque es la única que gradúa.
- **Vuurberg 2018** (guía holandesa, BJSM; nueva en el registro). Tabla 7, que la guía de Martin reproduce como figura 2. No usa grados: vuelta completa al trabajo y al deporte a las 3–4 semanas en la «distorsión», a las 6–8 en la «rotura parcial o total» y a las 12–16 tras la cirugía. Va en la nota del grado II (contrasta con los 3–6 de Bergman) y en la reparación.
- **Martin 2021** (guía JOSPT). Del pronóstico solo se usa un dato: un 5–33 % sigue con dolor al año o más (nota del grado III).

Semanas → columnas del eje: 1–2 semanas = «4–14 d»; 3–6 = «3–4 s» y «5–8 s»; 6–12 = «5–8 s» y «2–3 m»; 12–16 = «2–3 m» y «3–6 m». Un test fija los cuatro rangos. El resumen plegable pasa a «Ver N subtipos», porque «de esguince grado iii» en minúsculas estropeaba el número romano. Revisado y aprobado por el usuario tal cual (2026-10): la barra del grado II sigue a Bergman y la reparación cuelga del grado III.

## Menisco, grupo propio (2026-10)

Decisión del usuario: el menisco irá como grupo propio («Menisco», con su pastilla en el filtro), no como subtipo de ligamento. Es fibrocartílago, con otra biología y otra vascularización, y sus tratamientos (conservador, meniscectomía, sutura) tienen plazos propios. El grupo se crea con su primera fila con fuente leída, nunca vacío. Fase J, fila 3.

## Filtro sin «Todos», en una fila (2026-10)

Decisión del usuario. Se quita la pastilla «Todos»: volver a tocar la pastilla activa la desmarca y se ven todos los tejidos, con la misma regla que el resto de grupos de opciones de la app (mecanismo, cronología, NRS). El título de cada grupo hace lo mismo. Las pastillas van en una sola fila que se desliza en horizontal cuando no caben (a 320 px, y cuando la Fase J añada grupos como nervio periférico), con un degradado en el lado por el que quedan más (`_bordesFiltroTejidos()`, `app.js`). Al abrir el panel con un filtro guardado, la pastilla activa queda a la vista. Se descartó un desplegable: escala igual de bien, pero esconde las opciones y cuesta un toque más. Si algún día hubiera más de unas 8 categorías, se replantea (agrupar, o desplegable).

## Leyenda de fases en vez de franja (2026-10)

La franja «Fases de reparación» llevaba el nombre de cada fase dentro de su tramo, y en móvil se cortaba («Inflama…», «Prolifera…»): inflamatoria y proliferativa ocupan una columna cada una, unos 45 px. Como la tira de colores del eje fijo ya muestra dónde cae cada fase, la franja se sustituye por una leyenda que se ajusta en líneas: muestra de color, nombre entero y rango corto (`rangoFase()`: «días 0–5», «día 5–sem. 3», «sem. 3–1 año», «1–2 años»). La tira dice dónde y la leyenda dice qué. El párrafo de debajo deja de repetir los rangos y se queda con la nota (modelo de la herida cutánea, resistencia del 80 %). La línea «Hoy» sigue en el eje y en cada barra. El wiki tiene la misma leyenda (decisión del usuario).

## Pruebas

- `node tests/unit.js`, tema «tiempos de tejido»: integridad de los datos, rangos del wiki fijados, `posicionDia`/`marcaHoy`, HTML (barras, «pendiente de fuente», línea «Hoy») y que no llegue a resúmenes ni informes.
- `node tests/smoke.mjs`, «⏱ Tiempos de recuperación»: diálogo en escritorio, «Hoy» a las 6 semanas por la UI real, Escape y velo, hoja inferior en móvil con atrás, cabecera y panel a 320 px, botón visible en el hub.
- La fuente cuenta en `docs/referencias.md` como uso «tiempos de tejido» (región «Todas (tiempos de tejido)»).
