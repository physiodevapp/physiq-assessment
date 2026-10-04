# Esquemas imprimibles

Esquemas para tener a mano en consulta, **generados desde los datos de la app**: el script lee `data/` (`SYSTEMIC_SCREENING`, `CIF_TREES`, `HYPOTHESES`) y aplica las mismas reglas de LR que la fase 4b (`lrEfectiva` y `testPuntua` de `phase4b.js`). No hay textos escritos a mano, así que no se desfasan: si cambia el contenido clínico, basta con regenerarlos. No los usa la app y no se copian en `deploy-to-hub.yml`.

| Esquema | Fase | Formato | Archivo (lumbar) |
|---|---|---|---|
| Cribado sistémico: sistemas y preguntas literales, urgencias en rojo, criterio compuesto | 2 | A4 vertical | `cribado-lumbar.pdf` |
| Árbol de decisión CIF: pasos, desvíos, respuestas e hipótesis que activan, derivaciones | 4 | A3 apaisado | `arbol-lumbar.pdf` |
| Confirmación: tests de cada hipótesis con su LR+/LR− y si puntúan, clústeres | 4b | A4 apaisado | `confirmacion-lumbar.pdf` |

Cada PDF va con su vista previa en PNG. En el repositorio solo están los de lumbar; los de cualquier región se generan con el mismo script.

## Cómo se generan

```
node docs/esquemas/generar.mjs                      # lumbar, los tres
node docs/esquemas/generar.mjs cervical             # otra región
node docs/esquemas/generar.mjs todas arbol          # un tipo, todas las regiones
```

Necesita Playwright, como `tests/smoke.mjs` (si está instalado globalmente: `NODE_PATH=$(npm root -g) node docs/esquemas/generar.mjs`). Carga los módulos de la app con el mismo shim de DOM que `tests/unit.js` (`tests/dom-shim.mjs`).

Qué no incluye a propósito: en la fase 2, las listas de banderas rojas y amarillas de cada sistema (repiten en gran parte las preguntas; están en la app); en la 4b, los criterios de cada test y sus fuentes (están en la app). En las regiones con más contenido, algunos esquemas ocupan 2–3 páginas.
