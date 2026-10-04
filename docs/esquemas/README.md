# Esquemas imprimibles

Esquemas para tener a mano en consulta. **No los usa la app**: son documentación, fuera de `deploy-to-hub.yml`.

| Esquema | Fase | Formato | Archivos |
|---|---|---|---|
| Árbol de decisión CIF · región lumbar | 4 | A3 apaisado | `arbol-lumbar.pdf` (imprimir), `arbol-lumbar.svg` (vectorial), `arbol-lumbar.png` (vista previa) |

## Cómo se generan

Los textos y las posiciones están escritos a mano en el script de cada esquema (no se leen de `data/`), comprobados contra el contenido de la app: en el árbol lumbar, contra `CIF_TREES.lumbar` (`data/lumbar.js`) y su navegación real (`tests/fixtures/cif-tree-navigation.json`). **Si cambia el contenido de la app, hay que actualizar el script a mano** y regenerar:

```
python3 docs/esquemas/arbol-lumbar.py      # escribe arbol-lumbar.svg y arbol-lumbar.html
node docs/esquemas/render.mjs arbol-lumbar # escribe arbol-lumbar.pdf y arbol-lumbar.png (necesita Playwright)
```

El esquema refleja lo que hace la app, incluidos los dos finales sin hipótesis (recorrido sin patrón → «dolor lumbar inespecífico»; respuesta VASCULAR → derivación médica, que el recorrido no corta).
