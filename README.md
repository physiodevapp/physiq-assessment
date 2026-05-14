# PhysiQ-V

Asistente de valoración en fisioterapia musculoesquelética. Guía al
fisioterapeuta a través de un flujo clínico estructurado en 5 fases:
triage, cribado sistémico, SINSS, árbol CIF y confirmación de hipótesis.

**[→ Abrir aplicación](https://TU_USUARIO.github.io/physiq-v/)**

---

## Fases del flujo clínico

| Fase | Descripción |
|------|-------------|
| 1 — Triage y Cabecera | Datos demográficos, mecanismo, cronología, riesgo psicosocial, banderas rojas |
| 2 — Cribado Sistémico | Screening por región corporal y sistema orgánico |
| 3 — SINSS | Naturaleza del dolor, estadio, irritabilidad, signo comparable, NRS |
| 4 — Algoritmo CIF | Árbol de decisión diagnóstica por región |
| 4b — Confirmación de Hipótesis | Tests exploratorios con LR+/LR− |
| 5 — Resultados | Resumen clínico, hipótesis prioritarias, plan de tratamiento |

Regiones disponibles: hombro, cadera, cervical, lumbar, rodilla, codo.

## Stack

SPA en HTML/CSS/JS puro, sin frameworks ni dependencias de build.
Única dependencia externa: Google Fonts (DM Serif Display, DM Mono, Outfit).

```
index.html   → HTML estructural + CSS completo
data.js      → Constantes clínicas (screening, hipótesis, árbol CIF)
app.js       → State, lógica de navegación y event handlers
```

## Correr en local

```bash
npx serve .
# o Live Server en VS Code
```

## Aviso clínico

El contenido clínico (banderas rojas, preguntas de screening, tests
diagnósticos con LR+/LR−) proviene de documentación clínica validada.
No modificar sin revisión de un fisioterapeuta clínico.
