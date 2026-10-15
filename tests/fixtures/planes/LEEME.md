# Planes detallados con IA reales (fase 6, «✨ Detallar con IA»)

Planes generados con la app y revisados por el usuario, como los informes de
`tests/fixtures/informes/`. Cada uno: la valoración exportada (`.json`, la del
paquete de revisión) y el plan tal como se generó (`.txt`, el markdown de la
IA). `tests/unit/plan-ia.mjs` («revisión del plan: planes reales») pasa cada
uno por `revisarPlan()` con el contexto de su valoración y fija la lista exacta
de puntos, así que una regla nueva o cambiada no puede perder un acierto ni
añadir un falso aviso sin que se vea.

| Plan | Valoración | Revisión | Qué enseñó |
|---|---|---|---|
| `andres-lumbar-plan-1.txt` | `valoracion-andres-molina-lumbar.json` (caso simulado de `tests/fixtures/casos/`, nivel B «Muy suave», plan A, con la transcripción del dictado) | Ronda 1 (2026-10) | La regla `independiente` daba cuatro falsos avisos por «zona lumbar» (la región, no la molestia lumbar derecha): ahora pide también el lado. El programa para casa repetía sin marca las cifras de la sesión: una cifra ya propuesta con la marca vale. Los números escritos («Una vez al día») también cuentan, y una línea repetida da un solo punto. Quedan 5 puntos reales: la dosis del slump cambia entre la sesión (3 × 30 s) y casa (10 × 3 s), y en casa van sin marca «una vez al día» y el descanso de 1 minuto. El prompt pide ahora la misma dosis en la sesión y en casa, y la marca también en casa. |
