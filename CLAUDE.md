# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PhysiQ-Assessment is a musculoskeletal physiotherapy clinical assessment assistant. It guides clinicians through a structured 5-phase workflow (phases 1–4b–5, where 4b is a sub-phase of 4) using evidence-based screening, ICF decision trees, and diagnostic likelihood ratios. It is in active clinical pilot use.

**Deployment:** GitHub Pages — push to `main` deploys automatically.

## Development

No build step, no package manager, no dependencies. The app runs as static HTML/CSS/JS.

To develop locally, serve from the root with any HTTP server:
```
npx serve .
```
Or use VS Code Live Server. Open `index.html` directly in a browser also works for most features.

There are no linting or compilation commands. To run unit tests:
```
node tests/unit.js
```

## Formato de commits

Usar siempre este formato al hacer commits:

```
git commit -m "título corto en imperativo" -m "descripción cuando sea necesario"
```

- El primer `-m` es el título (máx ~72 caracteres)
- El segundo `-m` solo se incluye cuando hay contexto relevante que añadir
- Nunca usar `git commit` sin flags ni editores interactivos
- No añadir co-autoría (`Co-authored-by`) en ningún caso

## File Architecture

All source lives in the project root — there are no subdirectories.

| File | Role |
|------|------|
| `index.html` | DOM structure + all embedded CSS (2,200+ lines) |
| `app.js` | Application state, navigation logic, event handlers, UI rendering |
| `data.js` | All clinical content: screening systems, ICF trees, hypotheses, LR± values |
| `physiq-assessment-standalone.html` | Self-contained offline version (inline JS+CSS) for tablet distribution |

### Internal structure of `physiq-assessment-standalone.html`

```
physiq-assessment-standalone.html  (~5480 lines)
├── L1–220      Head + imports (Google Fonts: Outfit, DM Serif Display, DM Mono)
├── L220–1750   Full CSS (variables, components, responsive)
├── L1750–3850  HTML for all 6 phases + nav + bottom sheets
├── L3850–3900  Global `state` object declaration
├── L3900–4150  Navigation, phases, data collection
├── L4150–4600  Phase 2: systemic screening, accordions, observers
├── L4600–4800  Phase 4: CIF tree, renderStep, prune, rebuild
├── L4800–5000  Phase 4b: hypothesis cards, test results, scores
├── L5000–5200  Phase 5: buildSummary (full summary render)
└── L5200–5480  Mobile nav, actions sheet, confirm dialogs, DOMContentLoaded
```

## State Management

A single global `state` object in `app.js` holds the entire session. There is no reactive framework — UI updates are manual DOM manipulation triggered after state mutations.

`collectPhase3()` must be called before leaving Phase 3 to persist its inputs to state.

### Full state schema

```js
const state = {
  currentPhase: 1,
  maxVisitedIdx: 0,
  regionChanged: false,
  treeModified: false,

  // Phase 1
  patient: '',              // input #patientName (Phase 1, optional)
  motivoConsulta: '',       // textarea #motivoConsulta
  mecanismo: '',            // 'Traumático' | 'Insidioso' | 'Post-quirúrgico'
  cronologia: '',           // 'Agudo (<6 semanas)' | 'Subagudo' | 'Crónico (>3 meses)'
  banderasRojas: { br1:'NO', br2:'NO', br3:'NO', br4:'NO' },
  riesgoPsico: '',          // 'Bajo' | 'Medio' | 'Alto'
  psico_miedo: '',
  psico_autoef: '',
  psico_emocional: '',

  // Phase 2
  region: '',               // 'hombro'|'cadera'|'cervical'|'lumbar'|'rodilla'|'codo'
  sistemicoAnswers: {},     // { [questionId]: 'SI'|'NO' }
  sistemicoAlerta: false,   // true if any systemic question = 'SI'

  // Phase 3
  severidad: null,          // 0–10 (NRS)
  irritabilidad: { dolor, reposo, movimiento, discapacidad, tolerancia },
  irritabilidadNivel: '',   // 'Baja' | 'Moderada' | 'Alta'
  naturaleza: '',
  estadio: '',
  estabilidad: '',
  signoComparable: '',      // textarea #signoComparable

  // Phase 4
  activeHypotheses: [],     // ['ho1', 'ho2', ...] — IDs from HYPOTHESES
  treeAnswers: {},          // { [stepId]: value }
  stepsCompleted: [],

  // Phase 4b
  testResults: {},          // { [hypId]: { [testIdx]: 'pos'|'neg'|'nd' } }
  hypothesisScores: {},     // { [hypId]: { totalLR: number, label: string } }

  // Phase 5
  resultsBuilt: false,
  planNotes: {
    variableControl: '',
    ventanaRecuperacion: '',
    anclajeHabito: ''
  }
};
```

## Five-Phase Clinical Workflow

| Phase | DOM ID | Name | Key Logic |
|-------|--------|------|-----------|
| 1 | `#phase1` | Triage & Header | Red flag detection (`checkBanderasRojas`), psychosocial risk |
| 2 | `#phase2` | Systemic Screening | Region selection drives which organ systems render (`buildSistemicoQuestions`) |
| 3 | `#phase3` | SINSS | Irritability matrix syncs between desktop table and mobile cards (`syncIrritabMobile/Desktop`) |
| 4 | `#phase4` | ICF Decision Tree | `initCIFTree` / `renderStep` / `selectTreeOption` navigate the region-specific tree; `pruneTreeFrom` invalidates downstream branches |
| 4b | `#phase4b` | Hypothesis Confirmation | `setTestResult` + `recalcHypScore` update Bayesian posterior probabilities per test |
| 5 | `#phase5` | Results | `buildResults` / `buildSummary` generates the clinical summary from accumulated state |

Navigation is validated by `navStepClick` — users cannot skip phases with incomplete required data. Phase transitions use `goToPhase(n)` where n ∈ {1, 2, 3, 4, '4b', 5}.

## Clinical Data Structure (`data.js`)

**`SYSTEMIC_SCREENING`** — keyed by region (`hombro`, `cadera`, …). Each region maps to system objects (`SIS_CANCER`, `SIS_CARDIOVASCULAR`, etc.) containing:
- `banderasRojas` / `banderasAmarillas` — red/yellow flag arrays
- `preguntas` — screening questions with `alerta` and `s1` (severity) flags

**`CIF_TREES`** — keyed by region. Each tree is a map of step IDs → nodes with `question`, `options` (each option has `next` step ID and effects on `activeHypotheses`).

**`HYPOTHESES`** — keyed by hypothesis ID. Each entry: `{ id, region, name, prom, dosis, tests: [{name, sn, sp, lr_pos, lr_neg, criterio}] }`. The `lr_pos` and `lr_neg` values are used in Phase 4b Bayesian scoring.

When modifying clinical content, keep `data.js` isolated from logic — this separation allows physiotherapists to review domain content independently.

## UI Conventions

### CSS variables (`:root`)
`--bg`, `--surface`, `--surface2`, `--surface3`, `--border`, `--border2`, `--accent` (blue `#4f9cf9`), `--accent2` (green `#38d9a9`), `--text`, `--text2`, `--text3`, `--red`, `--green`, `--orange`

### Fonts
- Outfit — body text
- DM Serif Display — phase titles
- DM Mono — monospaced / labels

### Component classes
- `.option-btn` — single-select button groups (toggled via `selectOption`, `selectSQ`, etc.); active state uses class `selected`
- `.accordion-row` — collapsible system panels in Phase 2 (managed by `setupSisObserver`)
- `.hyp-card` — hypothesis test panels in Phase 4b (managed by `setupHypObserver`)
- `.card` / `.card-title` — standard card containers
- `.alert .alert-{danger|warning|info|success}` — inline alert banners
- Color coding: green = normal, orange = caution/yellow flag, red = alert/red flag

### Animations
- `fadeUp` — entry animations
- `pulse` — active indicators
- `IntersectionObserver` — contextual banners on scroll in Phase 2 and 4b

### Dialogs
Use `showConfirmBanner(title, text, actionLabel, callback)` — never use the native `confirm()`.

### Responsive layout
Mobile uses card layouts and bottom phase bar; desktop uses tables and horizontal nav.

The `physiq-assessment-standalone.html` file must be kept in sync with `index.html` + `app.js` + `data.js` when significant features change, as it is the offline distribution version.

## Export to PhysiQ

At the end of Phase 5, the app offers three export options:

- **Desktop (>768px):** three inline buttons in the nav bar — `🖨️ Imprimir`, `📋 Copiar contexto`, `📤 Generar en PhysiQ-Report`
- **Tablet/mobile (≤768px):** a `↑ Exportar` button that opens a bottom sheet (`#actionsSheet`) with the same three options, following the same pattern as the phase-navigation sheet

**Target URL:** `https://physiodevapp.github.io/physiq-report/`

### Key functions (`app.js`)

| Function | Purpose |
|---|---|
| `buildPhysiQPayload()` | Builds the minimum JSON payload from state |
| `exportToPhysiQ()` | Base64-encodes the payload and opens PhysiQ-Report in a new tab |
| `copyContextToClipboard()` | Copies a plain-text summary to clipboard; shows a toast via `showCopyFeedback()` |
| `toggleActionsSheet()` / `closeActionsSheet()` | Controls the mobile/tablet export bottom sheet |

**Payload fields:** `p` (patient), `r` (region), `d` (date), `mo` (motivo), `me` (mecanismo), `cr` (cronología), `rp` (riesgo psicosocial), `nr` (NRS), `ir` (irritabilidad), `na` (naturaleza), `si` (sistémico alert), `br` (banderas rojas), `h[]` (hypotheses with scores and test results), `pn` (plan notes).

> **Verification:** test payload size in DevTools: `btoa(unescape(encodeURIComponent(JSON.stringify(buildPhysiQPayload()))))` — target < 4 KB.

### Pending

_No pending tasks._
