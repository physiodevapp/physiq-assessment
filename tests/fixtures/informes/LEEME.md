# Informes reales para calibrar la revisión automática

Informes generados por la tarjeta «🎙 Informe narrativo», copiados desde la app
(con la cabecera y el pie locales, que `tools/revisar-informe.mjs` quita), junto
con la valoración exportada y, si hubo audio, la transcripción. `tests/unit.js`
(«revisión: informes reales») pasa cada uno por `tools/revisar-informe.mjs` y
compara los puntos con los esperados: una regla nueva o cambiada no puede quitar
un acierto ni añadir un falso positivo sin que el test lo diga. Si el cambio es
intencionado, actualiza la tabla del test y esta.

| Informe | Valoración | Transcripción | Puntos esperados |
|---|---|---|---|
| `lucia-audio-1-informe.txt` (narrativo, 7/10, antes de #214 y #217) | `valoracion-lucia-romero-audio.json` | `lucia-audio-transcripcion.txt` | `lado-otro`, `repetido` (edad ×2), `fuentes`, `discrepancia-separada` (sedestación) |
| `lucia-audio-2-informe.txt` (narrativo, 8/10, después de #214) | `valoracion-lucia-romero-audio.json` | `lucia-audio-transcripcion.txt` | `lado-otro`, `confirma`, `repetido` (edad ×3), `seguimiento-fuera` |
| `lucia-ficha-breve-sin-audio.txt` (ficha breve, modo breve) | `valoracion-lucia-romero-breve.json` | — | `fuentes` («variable de control») |
| `pedro-audio-1-informe.txt` (narrativo, hombro posquirúrgico, 8/10, antes de #225) | `valoracion-pedro-flores-audio.json` | `pedro-audio-transcripcion.txt` | `atribucion`, `discrepancia-separada` (hormigueo), `repetido` (fecha de la cirugía) |
| `pedro-audio-2-informe.txt` (el mismo caso, 2.ª grabación, después de #225) | `valoracion-pedro-flores-audio.json` | `pedro-audio-transcripcion.txt` | `inventado` (despertares copiados del ejemplo), `relleno` (tratamientos previos negados), `fuentes` («el recorrido de la exploración»), `atribucion` («escenario posquirúrgico»), `repetido` (fecha de la cirugía), `estructura` (Intervención Quirúrgica y Cribado de Seguridad en la primera sección) |

Notas:
- `lucia-audio-transcripcion.txt` es la exacta de la 1.ª grabación; la de la 2.ª
  era casi idéntica (mismo guion) y vale la misma.
- `pedro-audio-transcripcion.txt` es la exacta de la 2.ª grabación; la de la
  1.ª (mismo guion) era casi idéntica y vale la misma.
- Lo que estos informes hacen mal y ninguna regla de texto puede ver (p. ej. en
  el de Pedro, el consejo de la bici del fisioterapeuta atribuido al cirujano)
  queda para la capa 3 (verificador con IA).
