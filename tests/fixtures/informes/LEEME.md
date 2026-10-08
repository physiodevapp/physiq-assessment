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
| `lucia-audio-2-informe.txt` (narrativo, 8/10, después de #214) | `valoracion-lucia-romero-audio.json` | `lucia-audio-transcripcion.txt` | `lado-otro`, `confirma`, `repetido` (edad ×3), `seguimiento-fuera`, `limitaciones-negativas` («No refiere aumento del dolor al caminar…») |
| `lucia-ficha-breve-sin-audio.txt` (ficha breve, modo breve) | `valoracion-lucia-romero-breve.json` | — | `fuentes` («variable de control») |
| `pedro-audio-1-informe.txt` (narrativo, hombro posquirúrgico, 8/10, antes de #225) | `valoracion-pedro-flores-audio.json` | `pedro-audio-transcripcion.txt` | `atribucion`, `frecuencia` («actividad física regular en bicicleta»), `discrepancia-separada` (hormigueo), `repetido` (fecha de la cirugía) |
| `andrea-audio-1-informe.txt` (narrativo, lumbar, sin sexo registrado, derivación médica del árbol, después de #228) | `valoracion-andrea-ruiz-lumbar.json` | `andrea-audio-transcripcion.txt` | `genero` («sentada», «la paciente» sin sexo registrado), `limitaciones-negativas` («Niega dolor al toser…» en Limitaciones) |
| `carmen-audio-1-ficha-breve.txt` (ficha breve con audio, tobillo posquirúrgico sin protocolo, modo breve, después de #230) | `valoracion-carmen-vidal-tobillo-breve.json` | `carmen-audio-transcripcion.txt` | `relleno` (los tests pendientes repetidos fuera de su frase), `fuentes` («En la conversación»), `repetido` (el cirujano, 3 veces) |
| `javier-audio-1-informe.txt` (narrativo, cervical, derivación urgente, riesgo psicosocial alto, después de #233) | `valoracion-javier-soto-cervical.json` | `javier-audio-transcripcion.txt` | `plan-urgente` (plan con dosis pese a la urgencia), `frecuencia` («Acude al gimnasio con regularidad»), `diagnostico` («neoplásicos», «intracraneal», «hemorragia»), `imc` («normopeso» con 25,2) |
| `pedro-audio-2-informe.txt` (el mismo caso, 2.ª grabación, después de #225) | `valoracion-pedro-flores-audio.json` | `pedro-audio-transcripcion.txt` | `inventado` (despertares copiados del ejemplo), `relleno` (tratamientos previos negados), `fuentes` («el recorrido de la exploración»), `atribucion` («escenario posquirúrgico»), `frecuencia` («Practica ciclismo de manera habitual»), `repetido` (fecha de la cirugía), `estructura` (Intervención Quirúrgica y Cribado de Seguridad en la primera sección) |
| `daniel-audio-1-informe.txt` (narrativo, cadera, dolor inguinal del psoas, primer informe de cadera, después de #240) | `valoracion-daniel-ortega-cadera.json` | `daniel-audio-transcripcion.txt` | `descartar-inventado` («ecografía para descartar bursitis»), `seguimiento-fuera`, `limitaciones-negativas` |

Notas:
- `lucia-audio-transcripcion.txt` es la exacta de la 1.ª grabación; la de la 2.ª
  era casi idéntica (mismo guion) y vale la misma.
- `pedro-audio-transcripcion.txt` es la exacta de la 2.ª grabación; la de la
  1.ª (mismo guion) era casi idéntica y vale la misma.
- `daniel-audio-transcripcion.txt` está copiada de la captura de la app. Whisper
  cambió el sentido de «puedes correr suave en línea recta, y chutar todavía
  no» («¿Puedes correr… y chutar todavía? No.»), así que el informe restringe
  también la carrera: no es un fallo del modelo.
- Lo que estos informes hacen mal y ninguna regla de texto puede ver (p. ej. en
  el de Pedro, el consejo de la bici del fisioterapeuta atribuido al cirujano)
  queda para la capa 3 (verificador con IA).

## Capa 3 (verificador con IA)

`esperado-capa3.json` lista, por informe, los fallos conocidos que la capa 1 no
detecta (sacados de las revisiones de cada ronda), con fragmentos literales del
informe. `tools/verificar-informe.mjs` pasa los informes por el verificador y
mide cuántos detecta; con `--guardar` deja cada respuesta en `capa3/`, que
`tests/unit.js` valida sin llamar a la API y `--respuestas` vuelve a puntuar.
Con `--veces N` pasa cada informe N veces (`capa3/<informe>.<modelo>.<n>.json`)
y resume la media y la peor pasada: la respuesta cambia mucho de una llamada a
otra. `capa3/ronda-1/` guarda la primera medición (una pasada de Sonnet y una
de Haiku) y `capa3/ronda-2/` la segunda (Sonnet ×3, prompt «busca fallos»
calibrado), para comparar; `--respuestas` las sigue leyendo.

Desde la ronda 3 el verificador no busca fallos: rellena seis listas de
extracción (tests con «o», indicaciones y quién las dio, afirmaciones sin
respaldo literal, siglas, uso del pronóstico, origen de cada elemento del plan)
y los puntos se derivan en código. Las repeticiones, omisiones, códigos CIF,
componentes de un criterio y cifras reconciliadas quedan fuera por diseño: 11
de los 29 fallos de `esperado-capa3.json`. Ronda 3 (Sonnet ×3, `temperature: 0`, respuestas en
`capa3/`): detecta de media 9,3/29 (32 %), 3/4 altos en las tres pasadas y 3,4
puntos sin etiquetar por informe (4,5 en la peor). No cumple el criterio
acordado (≥ 50 %, 3/4 altos, ≤ 1 sin etiquetar por informe): la capa 3 queda
aparcada.

Cuando una regla de la capa 1 pasa a cubrir un fallo, ese fallo sale de
`esperado-capa3.json` (la lista es lo que la capa 1 no ve): así salieron las
frecuencias inferidas de Pedro y Javier al crear la regla `frecuencia`. Las de
Lucía («corre de forma regular») se quitaron porque no son un fallo: el
formulario dice «¿hace a menudo…? → Correr».
Al añadir un informe a la tabla de arriba, añádelo también a
`esperado-capa3.json` (un test exige que estén los mismos).
