# PhysiQ — Assessment

Musculoskeletal physiotherapy assessment assistant. Guides the clinician
through a structured 5-phase clinical workflow: triage, systemic screening,
SINSS, ICF decision tree, and hypothesis confirmation.

**[→ Open app](https://physiodevapp.github.io/physiq-assessment/)**

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

## Motivation

I'm a physiotherapist and developer. This tool was born from a real clinical
need: structured assessments in busy outpatient settings are often rushed or
inconsistent. PhysiQ-Assessment brings a standardised 5-phase workflow to the
consultation room, designed to be used live with patients.

## Clinical content

The screening questions, red flags, diagnostic tests and LR+/LR− values were
curated from peer-reviewed clinical literature and structured around the
clinical reasoning framework I use in daily practice.

The ICF decision tree for each region reflects real differential diagnosis
pathways built from clinical experience — not a generic checklist. Each
hypothesis maps to specific exploratory tests with documented sensitivity,
specificity and likelihood ratios.

### Primary references

- **Goodman, C.C. & Snyder, T.E.K.** — *Differential Diagnosis for Physical Therapists: Screening for Referral* (6th ed.). Elsevier. Core framework for systemic screening, organ-system red flags, and referral criteria.
- **Magee, D.J.** — *Orthopedic Physical Assessment* (7th ed.). Elsevier. Source for region-specific special tests, sensitivity/specificity values, and diagnostic likelihood ratios.
- **OpenEvidence** — [openevidence.com](https://www.openevidence.com). AI-assisted clinical evidence synthesis used to cross-reference and validate LR+/LR− values and screening criteria against current literature.

## Status

🧪 Pilot phase — currently in use across both my own private practice and
a physiotherapy clinic, gathering structured feedback to iterate on the
workflow and expand region coverage.

## Technical decisions

- **No frameworks** — the app runs on any device without installation or internet
  dependency beyond the initial load. A clinician can use it on a tablet mid-session.
- **data.js separated from logic** — clinical content (red flags, LR+/LR−, ICF tree)
  is isolated so it can be reviewed and updated by another physiotherapist without
  touching the application logic.
- **Single-file standalone version** — `physiq-assessment-standalone.html` allows offline use
  or sharing without a server.

## Development

Built with Claude Code as a coding assistant. The clinical architecture,
UX decisions, and all domain content are my own — the tool reflects how I
actually think through a musculoskeletal assessment, translated into a
structured interface.

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
