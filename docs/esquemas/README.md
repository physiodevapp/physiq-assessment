# Esquemas imprimibles

Esquemas para tener a mano en consulta, **generados desde los datos de la app**: el script lee `data/` (`SYSTEMIC_SCREENING`, `CIF_TREES`, `HYPOTHESES`) y aplica las mismas reglas de LR que la fase 4b (`lrEfectiva` y `testPuntua` de `phase4b.js`). No hay textos escritos a mano, así que no se desfasan: si cambia el contenido clínico, basta con regenerarlos. No los usa la app y no se copian en `deploy-to-hub.yml`.

| Esquema | Fase | Formato | Archivo (lumbar) |
|---|---|---|---|
| Cribado sistémico: sistemas y preguntas literales, urgencias en rojo, criterio compuesto | 2 | A4 vertical | `cribado-lumbar.pdf` |
| Árbol de decisión CIF en flujo con flechas: pasos principales de izquierda a derecha, desvíos encima del paso del que salen, y bajo cada paso sus respuestas con la hipótesis que activan, la derivación o adónde llevan | 4 | A3 apaisado | `arbol-lumbar.pdf` |
| Confirmación: tests de cada hipótesis con su LR+/LR− y si puntúan, clústeres | 4b | A4 apaisado | `confirmacion-lumbar.pdf` |

Cada PDF va con su vista previa en PNG. En el repositorio están los de lumbar, hombro, cadera y rodilla; los de cualquier región se generan con el mismo script.

## Cómo se generan

```
node docs/esquemas/generar.mjs                      # lumbar, los tres
node docs/esquemas/generar.mjs cervical             # otra región
node docs/esquemas/generar.mjs todas arbol          # un tipo, todas las regiones
```

Necesita Playwright, como `tests/smoke.mjs` (si está instalado globalmente: `NODE_PATH=$(npm root -g) node docs/esquemas/generar.mjs`). Carga los módulos de la app con el mismo shim de DOM que `tests/unit.js` (`tests/dom-shim.mjs`).

En el árbol, las flechas las dibuja el navegador midiendo dónde ha quedado cada caja, así que el mismo diseño sirve para cualquier región: los pasos principales van en filas de hasta 4 (si hay más, la siguiente fila continúa debajo), y si una página se pasa de alto se reduce un poco o se abre otra (lumbar y codo: 1 página; hombro, cadera, cervical y rodilla: 2; tobillo y pie: 3). Las hipótesis van todas en el mismo color porque la app no las agrupa por familias.

Qué no incluye a propósito: en la fase 2, las listas de banderas rojas y amarillas de cada sistema (repiten en gran parte las preguntas; están en la app); en la 4b, los criterios de cada test y sus fuentes (están en la app). En las regiones con más contenido, algunos esquemas ocupan 2–3 páginas.
