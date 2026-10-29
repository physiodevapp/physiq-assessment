# Casos de medición del lector de cuestionarios con foto

Respuestas correctas de hojas de respuestas reales, rellenadas a mano y fotografiadas con el móvil, para medir el lector con `tools/leer-cuestionario.mjs` (diseño y protocolo: `docs/lector-cuestionarios.md`).

**Las fotos no van aquí** (decisión del usuario, 2026-10): se pasan con `--fotos <carpeta>`. Un test unitario falla si esta carpeta contiene una imagen.

## Cómo preparar un caso

1. Imprime la hoja de respuestas del cuestionario: `docs/esquemas/respuestas/<id>.pdf`.
2. Rellénala con **respuestas inventadas**, nunca las de un paciente real, y sin nombre. Incluye a propósito casos difíciles: una marca entre dos casillas, una casilla tachada y otra marcada, dos marcas sin tachar, filas en blanco, y marcas con X, con círculo y con tic. Cambia de bolígrafo y de persona.
3. Haz la foto (o una por página) y anota las condiciones.
4. Escribe `<caso>.json` en esta carpeta. El nombre del archivo es el nombre del caso.

```json
{
  "cuestionario": "phq9",
  "version": "6bd71bcd",
  "fotos": ["phq9-01.jpg"],
  "condiciones": ["móvil A", "plana", "buena luz"],
  "correctas": { "1": 2, "2": 1, "3": "blanco", "4": "ambiguo", "5": 0, "6": 3, "7": 1, "8": 0, "9": 0 }
}
```

- `version`: la «v.» impresa en la hoja. Si no coincide con la de hoy, la herramienta avisa.
- `fotos`: los archivos, por orden de página, relativos a la carpeta de `--fotos`.
- `condiciones`: etiquetas libres, para ver el resultado por condición. Sugeridas: el móvil, `plana` o `inclinada`, `buena luz` o `sombra`, `doblada`.
- `correctas`: una entrada por cada fila que se lee, con su número (la `n` impresa en el recuadro oscuro) como clave:
  - escala: el número de la casilla (`2`);
  - opciones: la posición impresa junto a la casilla, empezando en 1 (`3`);
  - sí/no: `"si"` o `"no"`;
  - marcas múltiples: la lista de posiciones (`[1, 4]`);
  - N/A: `"na"`;
  - fila sin marca: `"blanco"`;
  - marca que ni tú sabrías leer: `"ambiguo"`. Lo correcto para ella es que el lector diga «dudoso».

Las filas que no se leen (escalas visuales en mm o cm) no llevan entrada.

Comprueba los casos sin gastar con `node tools/leer-cuestionario.mjs --comprobar`.

## Lecturas guardadas

Con `--guardar`, cada lectura del modelo queda en `lecturas/<caso>.<modelo>.<n>.json`, y `--respuestas` las vuelve a puntuar sin llamar a la API.
