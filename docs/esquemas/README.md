# Esquemas imprimibles

Esquemas para tener a mano en consulta, **generados desde los datos de la app**: el script lee `data/` (`SYSTEMIC_SCREENING`, `CIF_TREES`, `HYPOTHESES`) y aplica las mismas reglas de LR que la fase 4b (`lrEfectiva` y `testPuntua` de `phase4b.js`). No hay textos escritos a mano, así que no se desfasan: si cambia el contenido clínico, basta con regenerarlos. No los usa la app y no se copian en `deploy-to-hub.yml`.

| Esquema | Fase | Formato | Archivo (lumbar) |
|---|---|---|---|
| Cribado sistémico: página 1, lo que se pregunta siempre en la región (caja de urgencia y sistemas); después, las condiciones especiales (posquirúrgico, hipermovilidad, lupus, embarazo…), cada una con la tarjeta de la fase 1 que la muestra y, en gris, cuándo aparece cada pregunta. Solo las preguntas de la región; URGENCIA en rojo y DERIVACIÓN (médica, no urgente) en naranja; criterio compuesto; leyenda como pie fijo de cada página; cada grupo a la mayor escala que cabe | 2 | A4 vertical | `cribado-lumbar.pdf` |
| Árbol de decisión CIF en flujo con flechas: pasos principales de izquierda a derecha, desvíos encima del paso del que salen, y bajo cada paso sus respuestas con la hipótesis que activan, la derivación o adónde llevan | 4 | A3 apaisado | `arbol-lumbar.pdf` |
| Árbol de decisión CIF para consultar en papel: el mismo flujo que el A3, maquetado compacto (no reducido) | 4 | A4, vertical o apaisado según la región | `arbol-a4-lumbar.pdf` |
| Confirmación: tests de cada hipótesis con su LR+/LR− y si puntúan, clústeres; elige A4 vertical o apaisado según dónde quede la letra más grande, con la leyenda como pie fijo | 4b | A4 | `confirmacion-lumbar.pdf` |
| Tiempos de recuperación de tejidos (`data/tejidos.js`), en dos hojas temáticas de una página: partes blandas (tendón, músculo, ligamento, menisco, nervio) y hueso, articulación y columna. Las barras del panel ⏱ de la app (color = gravedad, relleno = qué mide), la leyenda como pie fijo; no dependen de la región | ⏱ | A4 vertical | `tejidos-blandos.pdf`, `tejidos-hueso.pdf` |

Cada PDF va con su vista previa en PNG. En el repositorio están los de lumbar, hombro, cadera, rodilla, tobillo y pie, y codo; los de cualquier región se generan con el mismo script.

## QR a la guía de consulta

Cribado, árbol A4 y confirmación llevan arriba a la derecha de su primera página un QR («Porqués, fuentes e IA») a su página en la guía de consulta (`guia.html#<región>/<hoja>`, ver `CLAUDE.md`, «Guía de consulta»): el porqué de cada pregunta, paso y test con la misma numeración que la hoja, sus fuentes enlazadas y «Ampliar con IA». El QR lo genera `qr.mjs` (sin dependencias: modo byte, corrección M, versiones 1–10); se comprobó con un lector de QR (zxing) en las 21 direcciones y en las hojas ya maquetadas. Llevan QR las hojas de las 7 regiones.

Las dos hojas de tiempos de tejido (`node docs/esquemas/generar.mjs tejidos`, también con `todas todos`) llevan el suyo («Notas, fuentes e IA») a `guia.html#tejidos/<blandos|hueso>`: la misma gráfica que el panel ⏱ de la app con los grupos de esa hoja, la nota de cada fila y, al tocar una barra, su ficha con las fuentes enlazadas (sin «Este paciente» ni «Hoy»: la guía no tiene datos del paciente). Qué grupo va en cada hoja lo dice `HOJAS_TEJIDO` (`lib/esquemas.js`); un test falla si un grupo nuevo de `data/tejidos.js` no está en ninguna. Cada hoja se ajusta a una página a la mayor escala que cabe (hoy, partes blandas 0,85 y hueso 1,02). **Al cambiar `data/tejidos.js`, regenerarlas.**

**Qué entra en la guía** (decisión del usuario, 2026-10): solo lo que explica o completa una hoja impresa. Las herramientas de la app que no tienen hoja se quedan en la app; la pestaña Irritabilidad es la excepción, porque el árbol y la 4b dependen de ese nivel y en papel no se puede calcular.

## Cómo se generan

```
node docs/esquemas/generar.mjs                      # lumbar, los tres
node docs/esquemas/generar.mjs cervical             # otra región
node docs/esquemas/generar.mjs todas arbol          # un tipo, todas las regiones
node docs/esquemas/generar.mjs todas arbol-a4       # hoja A4 del árbol, todas las regiones
```

Necesita Playwright, como `tests/smoke.mjs` (si está instalado globalmente: `NODE_PATH=$(npm root -g) node docs/esquemas/generar.mjs`). Carga los módulos de la app con el mismo shim de DOM que `tests/unit.js` (`tests/dom-shim.mjs`).

En el árbol, las flechas las dibuja el navegador midiendo dónde ha quedado cada caja, así que el mismo diseño sirve para cualquier región: los pasos principales van en filas de hasta 4 (si hay más, la siguiente fila continúa debajo), y si una página se pasa de alto se reduce un poco o se abre otra (lumbar y codo: 1 página; hombro, cadera, cervical y rodilla: 2; tobillo y pie: 3). Las hipótesis van todas en el mismo color porque la app no las agrupa por familias.

Cribado y confirmación usan el mismo ajuste (`scriptAjuste`): cada página a la mayor escala que cabe; si no cabe ni a 0,75, se parte y las secciones se reparten para que las dos páginas admitan la letra más grande posible. Confirmación: rodilla (apaisado) y tobillo y pie en 2 páginas, el resto en 1 vertical.

La hoja A4 del árbol prueba seis distribuciones (A4 apaisado o vertical, con 2, 3 o 4 pasos por fila) y se queda con la que deja la letra más grande; cada página de más cuenta como 0,3 de escala menos, para que una hoja única gane salvo que la diferencia sea grande. En cada una busca la mayor escala con la que todo cabe (sin pasar de 1,15) y, con varias páginas, usa la misma en todas. Los desvíos se reparten el ancho que queda en su fila. La leyenda es el pie de cada página, siempre abajo del todo (en todas las páginas). Entre una fila y la siguiente no hay flechas largas sino dos conectores de texto, como en los diagramas de flujo: «Todas → sigue en el paso 3 ↓» al final de la fila y «↓ Paso 3: viene del paso 2» encima del paso (también cuando un desvío vuelve a un paso de otra fila: «→ sigue en el paso 3» dentro de su caja). El script imprime la distribución elegida y la escala (`DEBUG_A4=1` muestra las seis): con el QR: lumbar 1,00 y hombro 0,87 en 1 página vertical; codo 1,06, cervical 0,94, cadera 0,88, rodilla 0,86 y tobillo y pie 0,79 en 2 páginas verticales.

Qué no incluye a propósito: en la fase 2, las listas de banderas rojas y amarillas de cada sistema (repiten en gran parte las preguntas; están en la app); en la 4b, los criterios de cada test y sus fuentes (están en la app). En las regiones con más contenido, algunos esquemas ocupan 2–3 páginas.
