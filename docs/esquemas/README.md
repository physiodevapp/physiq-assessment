# Esquemas imprimibles

Esquemas para tener a mano en consulta, **generados desde los datos de la app**: el script lee `data/` (`SYSTEMIC_SCREENING`, `CIF_TREES`, `HYPOTHESES`) y aplica las mismas reglas de LR que la fase 4b (`lrEfectiva` y `testPuntua` de `phase4b.js`). No hay textos escritos a mano, así que no se desfasan: si cambia el contenido clínico, basta con regenerarlos. No los usa la app y no se copian en `deploy-to-hub.yml`.

| Esquema | Fase | Formato | Archivo (lumbar) |
|---|---|---|---|
| Cribado sistémico: página 1, lo que se pregunta siempre en la región (caja de urgencia y sistemas); después, las condiciones especiales (posquirúrgico, hipermovilidad, lupus, embarazo…), cada una con la tarjeta de la fase 1 que la muestra y, en gris, cuándo aparece cada pregunta. Solo las preguntas de la región; URGENCIA en rojo y DERIVACIÓN (médica, no urgente) en naranja; criterio compuesto; leyenda como pie fijo de cada página; cada grupo a la mayor escala que cabe | 2 | A4 vertical | `cribado-lumbar.pdf` |
| Árbol de decisión CIF en flujo con flechas: pasos principales de izquierda a derecha, desvíos encima del paso del que salen, y bajo cada paso sus respuestas con la hipótesis que activan, la derivación o adónde llevan | 4 | A3 apaisado | `arbol-lumbar.pdf` |
| Árbol de decisión CIF para consultar en papel: el mismo flujo que el A3, maquetado compacto (no reducido) | 4 | A4, vertical o apaisado según la región | `arbol-a4-lumbar.pdf` |
| Confirmación: tests de cada hipótesis con su LR+/LR− y si puntúan, clústeres | 4b | A4 apaisado | `confirmacion-lumbar.pdf` |

Cada PDF va con su vista previa en PNG. En el repositorio están los de lumbar, hombro, cadera, rodilla, tobillo y pie, y codo; los de cualquier región se generan con el mismo script.

## Cómo se generan

```
node docs/esquemas/generar.mjs                      # lumbar, los tres
node docs/esquemas/generar.mjs cervical             # otra región
node docs/esquemas/generar.mjs todas arbol          # un tipo, todas las regiones
node docs/esquemas/generar.mjs todas arbol-a4       # hoja A4 del árbol, todas las regiones
```

Necesita Playwright, como `tests/smoke.mjs` (si está instalado globalmente: `NODE_PATH=$(npm root -g) node docs/esquemas/generar.mjs`). Carga los módulos de la app con el mismo shim de DOM que `tests/unit.js` (`tests/dom-shim.mjs`).

En el árbol, las flechas las dibuja el navegador midiendo dónde ha quedado cada caja, así que el mismo diseño sirve para cualquier región: los pasos principales van en filas de hasta 4 (si hay más, la siguiente fila continúa debajo), y si una página se pasa de alto se reduce un poco o se abre otra (lumbar y codo: 1 página; hombro, cadera, cervical y rodilla: 2; tobillo y pie: 3). Las hipótesis van todas en el mismo color porque la app no las agrupa por familias.

La hoja A4 del árbol prueba seis distribuciones (A4 apaisado o vertical, con 2, 3 o 4 pasos por fila) y se queda con la que deja la letra más grande; cada página de más cuenta como 0,3 de escala menos, para que una hoja única gane salvo que la diferencia sea grande. En cada una busca la mayor escala con la que todo cabe (sin pasar de 1,15) y, con varias páginas, usa la misma en todas. Los desvíos se reparten el ancho que queda en su fila. La leyenda es el pie de cada página, siempre abajo del todo (en todas las páginas). Entre una fila y la siguiente no hay flechas largas sino dos conectores de texto, como en los diagramas de flujo: «Todas → sigue en el paso 3 ↓» al final de la fila y «↓ Paso 3: viene del paso 2» encima del paso (también cuando un desvío vuelve a un paso de otra fila: «→ sigue en el paso 3» dentro de su caja). El script imprime la distribución elegida y la escala (`DEBUG_A4=1` muestra las seis): lumbar 1,04, hombro 0,90 y codo 0,83 en 1 página vertical; cadera 0,90 y rodilla 0,88 en 2 páginas verticales; cervical 0,98 en 2 apaisadas y tobillo y pie 0,79 en 2 verticales.

Qué no incluye a propósito: en la fase 2, las listas de banderas rojas y amarillas de cada sistema (repiten en gran parte las preguntas; están en la app); en la 4b, los criterios de cada test y sus fuentes (están en la app). En las regiones con más contenido, algunos esquemas ocupan 2–3 páginas.
