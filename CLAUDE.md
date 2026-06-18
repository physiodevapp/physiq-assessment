# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PhysiQ-Assessment is a musculoskeletal physiotherapy clinical assessment assistant. It guides clinicians through a structured 5-phase workflow (phases 1–4b–5, where 4b is a sub-phase of 4) using evidence-based screening, ICF decision trees, and diagnostic likelihood ratios. It is in active clinical pilot use.

**Deployment:** GitHub Pages — push to `main` deploys automatically. The hub (`physiodevapp.github.io/physiq/`) is the primary entry point; this app is also accessible standalone.

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

## Commit format

Always use this format when committing:

```
git commit -m "short imperative title" -m "description when needed"
```

- First `-m` is the title (max ~72 characters)
- Second `-m` is only included when there is relevant context to add
- Never use `git commit` without flags or interactive editors
- **Never add co-authorship** (`Co-authored-by`) under any circumstance

## File Architecture

All source lives in the project root — there are no subdirectories.

| File | Role |
|------|------|
| `index.html` | DOM structure + all embedded CSS (2,200+ lines) |
| `app.js` | Application state, navigation logic, event handlers, UI rendering |
| `data.js` | All clinical content: screening systems, ICF trees, hypotheses, LR± values |

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
Use `showConfirmBanner(title, text, actionLabel, callback)` — never use the native `confirm()` or `alert()`.

## Session Persistence

IDB (`lib/session.js`) is the only persistence layer — no localStorage.

**Write triggers in `saveSession()`** (called on every phase transition, `visibilitychange`, and all state-mutating handlers):
- `selectSQ`, `selectPsico`, `selectOption` — phase 1 inputs
- `applyRegionChange`, `selectSistQ` — phase 2 inputs
- `selectNRS`, `selectIrritab`, `selectIrritabSync` — phase 3 inputs
- `selectTreeOption` — phase 4 CIF tree
- `setTestResult` — phase 4b test results

`saveSession()` flushes DOM fields into `state` (patient, motivoConsulta, signoComparable), then calls `writeSession({ patient, date, assessmentState: { ...state } })` if `state.patient` is non-empty or `state.maxVisitedIdx > 0`.

**Ghost-write protection** — two guards prevent a stale `writeSession` from recreating a deleted session:
- `_sessionGen` (integer) — incremented on every clear. Captured before the async `writeSession` call; if `_sessionGen !== gen` at resolve time, `clearSession()` is called to undo the stale write.
- `_sessionCleared` (boolean) — set `true` synchronously on clear; blocks `saveSession()` from starting a new write until genuine data appears (`state.patient` non-empty or `maxVisitedIdx > 0`), then resets to `false`.

**On startup:** `readSession()` checks for `session.assessmentState.maxVisitedIdx > 0`. If found, silently restores all state via `_restoreSessionDOM()` and `goToPhase(targetPhase)`. No prompt.

**Session button** in the header (`#sessionBtn`) is a person-silhouette SVG icon. `[×]` triggers `promptClearSession()` → `showConfirmBanner` → `_softResetApp()` + `goToPhase(1)` + `clearSession()`.

### Responsive layout
Mobile uses card layouts and bottom phase bar; desktop uses tables and horizontal nav.

## BroadcastChannel protocol

All satellites use `const _sessionCh = new BroadcastChannel('physiq-session')`.

Messages emitted by physiq-assessment:

| Type | When | Payload |
|------|------|---------|
| `SESSION_PATIENT` | after each IDB write or reset | `{ patient: string }` |
| `SESSION_ASSESSMENT_PARTIAL` | on every `goToPhase()` call | `{ phase: string, region: string \| null }` |
| `SESSION_ASSESSMENT` | in `finalizarValoracion()` only | `{ assessment: buildPhysiQPayload() }` |
| `SESSION_CLEAR` | after `promptClearSession()` full clear | — |

`SESSION_ASSESSMENT_PARTIAL` is emitted **before** `saveSession()` in `goToPhase()`, synchronously, for all phases including phase 5. physiq-report uses this to display an "incompleto" badge in real time.

## Phase 5 and finalizarValoracion()

Reaching phase 5 (`buildResults()`) renders the summary HTML but does **not** emit the assessment payload. The assessment is only considered **complete** when the clinician explicitly presses **"Finalizar valoración →"**.

`finalizarValoracion()` flow:
1. `buildPhysiQPayload()` — builds payload including `pn: state.planNotes` with the filled plan notes
2. `writeSession({ assessment: payload, patient, date })` — writes the complete payload to IDB
3. Emits `SESSION_ASSESSMENT` via BroadcastChannel → physiq-report updates to "completo" badge
4. Button shows "✓ Enviado al informe" for 3s, then re-activates (re-pressable if notes are edited)

Plan notes fields in phase 5: `variableControl`, `ventanaRecuperacion`, `anclajeHabito` — not mandatory, included in payload as `pn`.

## Key functions (`app.js`)

| Function | Purpose |
|---|---|
| `buildPhysiQPayload()` | Builds the minimum JSON payload from state |
| `finalizarValoracion()` | Writes complete assessment to IDB and emits `SESSION_ASSESSMENT` |
| `copyContextToClipboard()` | Copies a plain-text summary to clipboard; shows a toast via `showCopyFeedback()` |

**Payload fields:** `p` (patient), `r` (region), `d` (date), `mo` (motivo), `me` (mecanismo), `cr` (cronología), `rp` (riesgo psicosocial), `nr` (NRS), `ir` (irritabilidad), `na` (naturaleza), `si` (sistémico alert), `br` (banderas rojas), `h[]` (hypotheses with scores and test results), `pn` (plan notes).

**Copy context:** a discrete `📋 Copiar` button in phase 5 calls `copyContextToClipboard()` — the only export action remaining in the satellite UI. Navigation to physiq-report is handled by the hub.

## Audio recording

Audio recording was removed from this satellite entirely. The `RecorderEngine` lives in the PhysiQ hub (`physiq/index.html`) and persists across all satellites. The hub widget (bottom-center, z-index 300) controls start/pause/stop/discard and saves audio to IDB key `'pending'` in the `physiq` database. The hub broadcasts recorder state via `BroadcastChannel('physiq-recorder')`; satellites can listen if they need to react to recording state.

## Hub integration

physiq-assessment runs inside an iframe in the PhysiQ hub. On load:

```js
if (window.self !== window.top) {
  document.body.classList.add('in-hub');
  document.querySelector('.logo-main').addEventListener('click', () => {
    window.parent.postMessage({ type: 'PHYSIQ_GO_HOME' }, '*');
  });
}
```

CSS `.in-hub .logo-main` adds a `‹` back-arrow hint. When running in-hub, clicking the logo navigates back to the hub home.

`showConfirmBanner` sends `{ type: 'PHYSIQ_WIDGET_HIDE' }` to the parent when opening and `{ type: 'PHYSIQ_WIDGET_SHOW' }` when closing, so the hub recorder widget is hidden during modals.

Navigation to physiq-report from phase 5 is the hub's responsibility. physiq-assessment does not call `window.open`.

## Sibling repos

The hub at `physiodevapp.github.io/physiq/` is the primary entry point for the ecosystem.

| Repo | Hub path | Role |
|------|----------|------|
| physiq-motion | /physiq/motion/ | Joint ROM measurement |
| physiq-report | /physiq/report/ | Audio transcription + Claude report generation |
