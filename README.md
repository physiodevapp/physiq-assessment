# PhysiQ-V

Musculoskeletal physiotherapy assessment assistant. Guides the clinician
through a structured 5-phase clinical workflow: triage, systemic screening,
SINSS, ICF decision tree, and hypothesis confirmation.

**[→ Open app](https://physiodevapp.github.io/physiq-v/)**

---

## Clinical workflow

| Phase | Description |
|-------|-------------|
| 1 — Triage & Header | Demographics, mechanism, timeline, psychosocial risk, red flags |
| 2 — Systemic Screening | Screening by body region and organ system |
| 3 — SINSS | Pain nature, stage, irritability, comparable sign, NRS |
| 4 — ICF Algorithm | Region-specific diagnostic decision tree |
| 4b — Hypothesis Confirmation | Exploratory tests with LR+/LR− |
| 5 — Results | Clinical summary, priority hypotheses, treatment plan |

Available regions: shoulder, hip, cervical, lumbar, knee, elbow.

## Stack

Pure HTML/CSS/JS SPA — no frameworks, no build step.
Single external dependency: Google Fonts (DM Serif Display, DM Mono, Outfit).

```
index.html   → HTML structure + full CSS
data.js      → Clinical constants (screening, hypotheses, ICF tree)
app.js       → State, navigation logic and event handlers
```

## Run locally

```bash
npx serve .
# or Live Server in VS Code
```

## Clinical disclaimer

Clinical content (red flags, screening questions, diagnostic tests with
LR+/LR−) is derived from validated clinical documentation.
Do not modify without review by a licensed physiotherapist.
