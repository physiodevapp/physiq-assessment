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
| `styles.css` | Bloque «Tiempos de recuperación de tejidos» y tokens `--tej-*` (tema claro y oscuro) |

El eje no es lineal: tiene las 8 columnas del wiki (de 1–3 días a 2 años), todas del mismo ancho. Cada columna tiene `hasta` (su último día), y con eso se colocan la franja de fases y la línea «Hoy» dentro de la columna, de forma lineal entre su primer y su último día.

## Correcciones respecto al wiki

- **Un solo color por fila.** En el wiki, la versión de escritorio pintaba la rotura muscular de grado III y el esguince de grado III con dos intensidades, y la de móvil con una. Ahora cada fila tiene una sola gravedad: mínima, leve, moderada o grave/reconstrucción. Los rangos de columnas de las filas del wiki no cambian (un test lo fija).
- **«Tendinopatía / Ruptura» se separa en dos filas.** «Tendinopatía» conserva el rango del wiki, con una nota: no es un plazo de cicatrización, sino de adaptación a la carga. «Rotura / reparación de tendón» es nueva (de 2–3 meses a 1 año) y va marcada «pendiente de fuente».
- **«Dolor inducido por ejercicio»** pasa a llamarse «Dolor muscular tardío (DOMS)». El wiki usaba los dos nombres según la pantalla.
- **Leyenda de colores.** El wiki no tenía.
- **Franja de fases de reparación**, nueva: inflamatoria (días 0–5), proliferativa (día 5 a semana 3) y remodelación (semana 3 a 1 año). Es orientativa y va marcada «pendiente de fuente».
- **Notas generales**: los rangos dependen del paciente y de la carga; el dolor y la función no siguen por fuerza el calendario del tejido; en el paciente posquirúrgico manda el protocolo del cirujano.

## Pendiente

- **Localizar y leer la fuente del wiki** (`'Snyder-Mackler 2012'` en `data/referencias.js`, sin publicación). Hasta entonces, las filas que la citan son las del wiki sin verificar. Una búsqueda solo encontró un capítulo «Developing Treatment Pathways», sin año ni cifras a la vista.
- **Fuente para la rotura de tendón y para la franja de fases.** StatPearls «Wound Healing Phases» (Wallace, Basehore y Zito, NBK470443) es candidata para las fases; no se pudo leer desde este entorno porque NCBI Bookshelf pide verificación. Al añadir una fuente: clave en el registro, en `fuentes` de la fila o fase, quitar `pendiente`, y ejecutar `node tests/gen-referencias.mjs`.
- **Revisar las gravedades.** El color de la fractura (moderada) y el del tendón vienen de la intensidad que usaba el wiki, que no tenía leyenda.
- **Ampliación** (opción descartada para la primera versión): cartílago y menisco (zona vascular y avascular), fractura de estrés, nervio periférico, y la ligamentización del injerto de LCA más allá del año.

## Pruebas

- `node tests/unit.js`, tema «tiempos de tejido»: integridad de los datos, rangos del wiki fijados, `posicionDia`/`marcaHoy`, HTML (barras, «pendiente de fuente», línea «Hoy») y que no llegue a resúmenes ni informes.
- `node tests/smoke.mjs`, «⏱ Tiempos de recuperación»: diálogo en escritorio, «Hoy» a las 6 semanas por la UI real, Escape y velo, hoja inferior en móvil con atrás, cabecera y panel a 320 px, botón visible en el hub.
- La fuente cuenta en `docs/referencias.md` como uso «tiempos de tejido» (región «Todas (tiempos de tejido)»).
