# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PhysiQ-Assessment is a musculoskeletal physiotherapy clinical assessment assistant. It guides clinicians through a structured 5-phase workflow using evidence-based screening, ICF decision trees, and diagnostic likelihood ratios. It is in active clinical pilot use.

**Deployment:** GitHub Pages — push to `main` deploys automatically.

## Development

No build step, no package manager, no dependencies. The app runs as static HTML/CSS/JS.

To develop locally, serve from the root with any HTTP server:
```
npx serve .
```
Or use VS Code Live Server. Open `index.html` directly in a browser also works for most features.

There are no linting, test, or compilation commands.

## File Architecture

All source lives in the project root — there are no subdirectories.

| File | Role |
|------|------|
| `index.html` | DOM structure + all embedded CSS (2,200+ lines) |
| `app.js` | Application state, navigation logic, event handlers, UI rendering |
| `data.js` | All clinical content: screening systems, ICF trees, hypotheses, LR± values |
| `physiq-v-standalone.html` | Self-contained offline version (inline JS+CSS) for tablet distribution |

## State Management

A single global `state` object in `app.js` holds the entire session. There is no reactive framework — UI updates are manual DOM manipulation triggered after state mutations.

Key state fields:
- `currentPhase` — active phase (1–5, or `'4b'`)
- `maxVisitedIdx` — controls which nav steps are accessible
- `regionChanged`, `treeModified` — invalidation flags that trigger nav warnings
- Phase-specific fields: `region`, `activeHypotheses`, `treeAnswers`, `testResults`, `hypothesisScores`, etc.

`collectPhase3()` must be called before leaving Phase 3 to persist its inputs to state.

## Five-Phase Clinical Workflow

| Phase | Name | Key Logic |
|-------|------|-----------|
| 1 | Triage & Header | Red flag detection (`checkBanderasRojas`), psychosocial risk |
| 2 | Systemic Screening | Region selection drives which organ systems render (`buildSistemicoQuestions`) |
| 3 | SINSS | Irritability matrix syncs between desktop table and mobile cards (`syncIrritabMobile/Desktop`) |
| 4 | ICF Decision Tree | `initCIFTree` / `renderStep` / `selectTreeOption` navigate the region-specific tree; `pruneTreeFrom` invalidates downstream branches |
| 4b | Hypothesis Confirmation | `setTestResult` + `recalcHypScore` update Bayesian posterior probabilities per test |
| 5 | Results | `buildResults` generates the clinical summary from accumulated state |

Navigation is validated by `navStepClick` — users cannot skip phases with incomplete required data.

## Clinical Data Structure (`data.js`)

**`SYSTEMIC_SCREENING`** — keyed by region (`hombro`, `cadera`, …). Each region maps to system objects (`SIS_CANCER`, `SIS_CARDIOVASCULAR`, etc.) containing:
- `banderasRojas` / `banderasAmarillas` — red/yellow flag arrays
- `preguntas` — screening questions with `alerta` and `s1` (severity) flags

**`CIF_TREES`** — keyed by region. Each tree is a map of step IDs → nodes with `question`, `options` (each option has `next` step ID and effects on `activeHypotheses`).

**`HYPOTHESES`** — keyed by hypothesis ID. Each entry contains an array of `tests`, where each test has `lr_pos` and `lr_neg` (likelihood ratios used in Phase 4b Bayesian scoring).

When modifying clinical content, keep data.js isolated from logic — this separation allows physiotherapists to review the domain content independently.

## UI Conventions

- `.option-btn` — single-select button groups (toggled via `selectOption`, `selectSQ`, etc.)
- `.accordion-row` — collapsible system panels in Phase 2 (managed by `setupSisObserver`)
- `.hyp-card` — hypothesis test panels in Phase 4b (managed by `setupHypObserver`)
- Color coding: green = normal, orange = caution/yellow flag, red = alert/red flag
- Responsive: mobile uses card layouts and bottom phase bar; desktop uses tables and horizontal nav

The `physiq-v-standalone.html` file must be kept in sync with `index.html` + `app.js` + `data.js` when significant features change, as it is the offline distribution version.
