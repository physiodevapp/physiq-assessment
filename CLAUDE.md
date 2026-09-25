# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PhysiQ-Assessment is a musculoskeletal physiotherapy clinical assessment assistant. It guides clinicians through a structured 5-phase workflow (phases 1–4b–5, where 4b is a sub-phase of 4) using evidence-based screening, ICF decision trees, and diagnostic likelihood ratios. It is in active clinical pilot use.

**Deployment:** Push to `main` triggers `deploy-to-hub.yml`, which copies the app files into the central PhysiQ hub repo (`physiodevapp/physiq`). The hub's own GitHub Pages deployment serves the app at `physiodevapp.github.io/physiq/assessment/`. There is no standalone Pages deployment for this repo.

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

## Pull request format

- PR body: plain description only — no `🤖 Generated with Claude Code` line, no session URLs, no co-authorship footers

## File Architecture

All source lives in the project root — there are no subdirectories.

| File | Role |
|------|------|
| `index.html` | DOM structure only (~530 lines) |
| `styles.css` | All CSS — variables, layout, components, responsive breakpoints (~1852 lines) |
| `state.js` | The global `state` object — its own module so every other file can import a single shared instance |
| `app.js` | Application logic, navigation, event handlers, UI rendering (phases 1–3, 5) — the module root |
| `phase4.js` | Phase 4 algorithm: CIF decision tree (`initCIFTree`, `renderStep`, `selectTreeOption`, `pruneTreeFrom`, `rebuildHypotheses`, `checkTreeComplete`, `showTreeComplete`) |
| `phase4b.js` | Phase 4b algorithm: hypothesis scoring (`buildHypothesisCards`, `setTestResult`, `calcLRScore`, `recalcHypScore`, accordion observer) |
| `data.js` | All clinical content: screening systems, ICF trees, hypotheses, LR± values |

### ES Modules

`index.html` loads a single `<script type="module" src="./app.js"></script>` — no bundler, no build step. `app.js` is the module root: it `import`s `state` from `state.js`, data from `data.js`, and the public functions it needs from `phase4.js`/`phase4b.js`/`lib/session.js`; `phase4.js` and `phase4b.js` import back `state`, `saveSession`, `showConfirmBanner` and (for `phase4.js`) `paintNav` from `app.js` — this import cycle is safe because those bindings are only ever called from event handlers, never at module-evaluation time.

Every file that defines functions referenced from an inline `onclick`/`oninput` attribute (in `index.html`'s static markup, or in HTML strings built by `app.js`/`phase4.js`/`phase4b.js`) must also assign them onto `window` — inline handler attributes are parsed by the browser and resolved against the global scope, never a module's private scope. `state.js` does the same for `state` itself (`oninput="state.foo=this.value"` needs `window.state`). Each file does this in one block near the bottom (`window.x = x` or `Object.assign(window, {...})`, commented `// Exposed for inline onclick...`) — when adding a new function that's called from an inline attribute anywhere in the codebase, add it to that file's block too, or the handler will silently fail (`ReferenceError` swallowed by the inline-handler call, or simply "nothing happens" on click).

`tests/unit.js` loads the real files via dynamic `import()` after setting up DOM/`window`/`navigator` shims on `globalThis` (see the file for the exact shim set) — `globalThis.window = globalThis`, so the `window.x = x` exposure lines above also land as real globals the test file can read back. `package.json` sets `"type": "module"` so Node treats `.js` files as ES modules (still no bundler, no dependencies).

`styles.css` is intentionally kept as a single file (~1852 lines) even though it spans multiple concerns (base tokens, layout, per-phase components, responsive breakpoints). Splitting it by concern or by phase would scatter rules without a clear seam — CSS variables like `--accent` and `--surface` are used everywhere, so any split would introduce cross-file dependencies immediately. A single file also makes it trivial to grep any class and know exactly where to edit it.

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

| Phase | DOM ID | Name | Key Logic | File |
|-------|--------|------|-----------|------|
| 1 | `#phase1` | Triage & Header | Red flag detection (`checkBanderasRojas`), psychosocial risk | `app.js` |
| 2 | `#phase2` | Systemic Screening | Region selection drives which organ systems render (`buildSistemicoQuestions`) | `app.js` |
| 3 | `#phase3` | SINSS | Irritability matrix syncs between desktop table and mobile cards (`syncIrritabMobile/Desktop`) | `app.js` |
| 4 | `#phase4` | ICF Decision Tree | `initCIFTree` / `renderStep` / `selectTreeOption` navigate the region-specific tree; `pruneTreeFrom` invalidates downstream branches | `phase4.js` |
| 4b | `#phase4b` | Hypothesis Confirmation | `setTestResult` + `recalcHypScore` update Bayesian posterior probabilities per test | `phase4b.js` |
| 5 | `#phase5` | Results | `buildResults` / `buildSummary` generates the clinical summary from accumulated state | `app.js` |

Navigation is validated by `navStepClick` — users cannot skip phases with incomplete required data. Phase transitions use `goToPhase(n)` where n ∈ {1, 2, 3, 4, '4b', 5}.

## Clinical Data Structure (`data.js`)

**`SYSTEMIC_SCREENING`** — keyed by region (`hombro`, `cadera`, …). Each region maps to system objects (`SIS_CANCER`, `SIS_CARDIOVASCULAR`, etc.) containing:
- `banderasRojas` / `banderasAmarillas` — red/yellow flag arrays
- `preguntas` — screening questions with `alerta` and `s1` (severity) flags

**`CIF_TREES`** — keyed by region. Each tree is a map of step IDs → nodes with `question`, `options` (each option has `next` step ID and effects on `activeHypotheses`).

**`HYPOTHESES`** — keyed by hypothesis ID. Each entry: `{ id, region, name, prom, dosis, tests: [{name, sn, sp, lr_pos, lr_neg, criterio}] }`. The `lr_pos` and `lr_neg` values are used in Phase 4b Bayesian scoring.

When modifying clinical content, keep `data.js` isolated from logic — this separation allows physiotherapists to review domain content independently. `data.js` is intentionally kept as a single unified file (~1668 lines) even though it covers three distinct domains (`SYSTEMIC_SCREENING`, `CIF_TREES`, `HYPOTHESES`): splitting it would fragment the "single source of clinical content" property without meaningful benefit.

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

`saveSession()` flushes DOM fields into `state` (patient, motivoConsulta, signoComparable), then calls `writeSession({ patient, date, assessmentState: { ...state } })` only if `state.patient` is non-empty. Navigating phases without a patient name does not write to IDB; `SESSION_ASSESSMENT_PARTIAL` is still emitted by `goToPhase()` for real-time report sync.

**Ghost-write protection** — two guards prevent a stale `writeSession` from recreating a deleted session:
- `_sessionGen` (integer) — incremented on every clear. Captured before the async `writeSession` call; if `_sessionGen !== gen` at resolve time, `clearSession()` is called to undo the stale write.
- `_sessionCleared` (boolean) — set `true` synchronously on clear; blocks `saveSession()` from starting a new write until `state.patient` is non-empty, then resets to `false`.

**On startup:** `readSession()` checks for `session.assessmentState.maxVisitedIdx > 0`. If found, silently restores all state via `_restoreSessionDOM()` and `goToPhase(targetPhase)`. No prompt. Note: `assessmentState` is only persisted when a patient name is set, so startup restoration only applies to prior sessions where a patient name was entered.

**Session button** in the header (`#sessionBtn`) is a person-silhouette SVG icon. `[×]` triggers `promptClearSession()` → `showConfirmBanner` → `_softResetApp()` + `goToPhase(1)` + `clearSession()`.

**`↺ Reiniciar valoración completa`** (header button, calls `resetApp()`) resets all clinical data (phases 1–5) but **preserves `state.patient` and `#patientName`** — the patient identity survives a clinical reset, consistent with the pattern in physiq-motion, physiq-force, and physiq-balance where "borrar mediciones" never clears the patient name.

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

physiq-assessment runs inside an iframe in the PhysiQ hub. On load (`_initHubIntegration()` in `app.js` — moved there from an inline `<script>` in `index.html` during the ES modules migration, since it needs direct access to module-scoped state like `_historyDepth`):

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

## In-progress migration plan

See `MIGRATION_PLAN.md` for a living checklist covering the ES modules migration (Fase A) and mobile-friendly text input improvements (Fase B), meant to be completed incrementally across sessions. Check it for current progress before starting related work; update its checkboxes and notes as steps are completed.

## Sibling repos

The hub at `physiodevapp.github.io/physiq/` is the primary entry point for the ecosystem.

| Repo | Hub path | Role |
|------|----------|------|
| physiq-motion | /physiq/motion/ | Joint ROM measurement |
| physiq-report | /physiq/report/ | Audio transcription + Claude report generation |
