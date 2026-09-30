# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PhysiQ-Assessment is a musculoskeletal physiotherapy clinical assessment assistant. It guides clinicians through a structured 5-phase workflow (phases 1–4b–5, where 4b is a sub-phase of 4) using evidence-based screening, ICF decision trees, and diagnostic likelihood ratios. It is in active clinical pilot use.

**Deployment:** Push to `main` triggers `deploy-to-hub.yml`, which copies the app files into the central PhysiQ hub repo (`physiodevapp/physiq`). The hub's own GitHub Pages deployment serves the app at `physiodevapp.github.io/physiq/assessment/`. There is no standalone Pages deployment for this repo — but the deployed copy at that URL is itself a complete, installable PWA independent of the hub (see "Standalone use" below); "no standalone Pages deployment" only means physiq-assessment doesn't have its *own* separate GitHub Pages site.

### Standalone use (without the hub)

`manifest.json` (`start_url`/`scope`: `/physiq/assessment/`, `display: standalone`, install icons) plus `sw.js` already make the deployed app fully installable on its own — no code changes needed. Open `https://physiodevapp.github.io/physiq/assessment/` directly (not through the hub) and use the browser's "Install app" / "Add to Home Screen"; it installs as its own icon, scoped to that path, separate from the hub's own installed PWA. `_initHubIntegration()` (`app.js`) no-ops cleanly outside an iframe (`window.self === window.top`), so nothing hub-specific blocks standalone use. What's unavailable standalone (both are hub-only by design, not bugs): the audio recording widget, and the "navigate to physiq-report" hop from phase 5 — phase 5's `#btnFinalizar` becomes "📤 Compartir informe" and shares the patient/GP report directly (`navigator.share()`, clipboard fallback) instead of the in-hub "Finalizar valoración" flow (see "Phase 5 and finalizarValoracion()" below); the "📄 Informe"/"📋 Notas" buttons also still work either way. Session data (IndexedDB, `BroadcastChannel`) is scoped per browser *origin*, not per path, so a standalone install and the hub-embedded copy share the same session data when used in the same browser.

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

**Browser smoke test** (`tests/smoke.mjs`, optional dev tool — not a project dependency, needs Playwright available separately): launches the real app with Playwright and checks the things `tests/unit.js` can't — that every ES module actually loads (200, no broken `import` across `app.js`/`state.js`/`data.js`/`data/*.js`/`phase4.js`/`phase4b.js`/`lib/session.js`), no console/page errors, and a full click-through of phases 1–5 (one golden path per region — always the first option at each CIF tree step, not every branch — but for **all 7 regions**, since each has its own `CIF_TREES` entry with a different step count/branches) plus the mobile "☰ Fases" button via the real UI. Run it after any change touching module structure, `window` exposure, or navigation — and always after editing `CIF_TREES` for any region, since this is the only check that exercises real rendering (`renderStep`/`checkTreeComplete`/`showTreeComplete`), which `tests/unit.js` cannot (see below):
```
npx serve . &
node tests/smoke.mjs                # add http://localhost:PORT if not :3000
```
If Playwright isn't resolvable via a normal `import`, it also tries `createRequire` so a global-only install (found via `NODE_PATH`) still works — Node's ESM resolver ignores `NODE_PATH` on its own.

**Editing `CIF_TREES` (adding/reorganizing a region's decision tree):** inserting or reordering a `step` inside a region's array can silently change which step an *untouched* option falls through to — `next: null` resolves positionally to `steps[idx+1]` (see the schema comment above `CIF_TREES` in `data.js`; each region's tree is `export const tree` in `data/<region>.js`). `node tests/unit.js` guards this with a checked-in navigation snapshot (`tests/fixtures/cif-tree-navigation.json`). After editing a tree: run `node tests/unit.js`; if it fails on "CIF tree navigation regression", read the diff and confirm every changed entry is an intended part of your edit, not collateral from reordering `steps[]`; only then run `node tests/gen-cif-snapshot.mjs` to regenerate the fixture (see that file's header), re-run `node tests/unit.js` to confirm, and commit the regenerated fixture together with the `data/<region>.js` change. Full rationale in `MIGRATION_PLAN.md`, Fase C.

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

Source lives in the project root, plus `lib/` (session IDB helper), `data/` (clinical content, one file per region) and `formularios/` (one form schema per file).

| File | Role |
|------|------|
| `index.html` | DOM structure only (~530 lines) |
| `styles.css` | All CSS — variables, layout, components, responsive breakpoints (~1852 lines) |
| `state.js` | The global `state` object — its own module so every other file can import a single shared instance |
| `app.js` | Application logic, navigation, event handlers, UI rendering (phases 1–3, 5) — the module root |
| `phase4.js` | Phase 4 algorithm: CIF decision tree (`initCIFTree`, `renderStep`, `selectTreeOption`, `pruneTreeFrom`, `rebuildHypotheses`, `checkTreeComplete`, `showTreeComplete`) |
| `phase4b.js` | Phase 4b algorithm: hypothesis scoring (`buildHypothesisCards`, `setTestResult`, `calcLRScore`, `recalcHypScore`, accordion observer) |
| `data.js` | Aggregator: imports `data/<region>.js` and exports `SYSTEMIC_SCREENING`, `CIF_TREES`, `HYPOTHESES` in the same shape as always (no consumer changed), plus the non-regional UI constants (`NRS_*`, `PHASE_DEFS`, `QUICK_PHRASES`, `PHASE_NAV_IDS`) and the schema comments for the three clinical objects |
| `data/<region>.js` | All clinical content of one region: `export const screening` (phase 2), `tree` (phase 4), `hypotheses` (phase 4b). Adding a region = new file + add it to `REGIONES` in `data.js` (+ `VALID_REGIONS` in `tests/unit.js`, `REGIONS` in `tests/smoke.mjs`) |
| `data/comun.js` | Cross-region screening systems (`SIS_ENDOCRINO`, `SIS_HEMATOLOGICO`), imported by each region file that uses them — the same object instance is shared, as before the split |
| `formulario.js` | Formulario previo engine (lo rellena el fisio): renders any schema from `formularios/`, stores answers, builds the summary (`resumenFormularioPrevio`) and the per-step hints for the CIF tree (`pistasPaso`). Loaded by `app.js` with dynamic `import()` only — never statically — so a missing file can't break the app |
| `formularios/comun.js` | Cara 1 of the pre-visit form (common to every region). Pure data, plus `pistas: { mecanismo, cronologia }` — keyed by phase 1 card instead of CIF step (see "Formulario previo") |
| `formularios/<region>.js` | Cara 2 for one region (today `lumbar.js`, `cadera.js`, `cervical.js`, `rodilla.js`, `hombro.js` and `tobillo_pie.js`). Pure data (items may carry `informe: '<etiqueta>'` to reach the patient/GP report), plus `pistas: { <stepId>: ['c:<id>' \| 'r:<id>' \| 'r:<id>.<fila>'] }` linking answers to that region's `CIF_TREES` steps. When adding one, also add the region to `REGIONES_CON_FORMULARIO` in `formulario.js` (unit tests validate every listed schema and its pistas) |

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
  modo: 'completo',         // 'completo' | 'breve' — see "Modo breve"; survives resetApp() like the patient name
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
  edadPaciente: null,       // years; input #edadPaciente — general demographic, read by any phase (currently only criterioCompuesto, phase 2)
  signosVitales: { fc:null, fr:null, spo2:null, tas:null, tad:null },  // optional; no algorithm reads these yet — captured for future evolutivo/trend tracking only
  antropometria: { talla:null, peso:null },  // optional, same rationale; imc is never persisted — see calcImc() in app.js

  // Phase 2
  region: '',               // 'hombro'|'cadera'|'cervical'|'lumbar'|'rodilla'|'codo'|'tobillo_pie'
  sistemicoAnswers: {},     // { [questionId]: 'SI'|'NO' }
  sistemicoAlerta: false,   // true if any systemic question = 'SI'
  sistemicoBreve: {},       // modo breve only: { [sisId]: 'SI'|'NO' } — per-system embudo answer

  // Phase 3
  severidad: null,          // 0–10 (NRS)
  irritabilidad: { dolor, reposo, movimiento, discapacidad, tolerancia },
  irritabilidadNivel: '',   // 'Baja' | 'Moderada' | 'Alta'
  irritabilidadDirecta: false, // true when the level was picked directly (modo breve), not computed from the matrix
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
  },

  // Formulario previo (formulario.js) — answers keyed by item id; per-region
  // answers kept separately so changing region never loses them.
  // unica → string · multi → string[] · escala → number|'ns' · matriz → { fila: valor }
  // texto → string · `<id>__detalle` → free text of an option with `detalle`
  formularioPrevio: { comun: {}, regiones: { lumbar: {} } }
};
```

## Five-Phase Clinical Workflow

| Phase | DOM ID | Name | Key Logic | File |
|-------|--------|------|-----------|------|
| 1 | `#phase1` | Triage & Header | Red flag detection (`checkBanderasRojas`), psychosocial risk | `app.js` |
| 2 | `#phase2` | Systemic Screening | Region selection drives which organ systems render (`buildSistemicoQuestions`) | `app.js` |
| 3 | `#phase3` | SINSS | Irritability matrix syncs between desktop table and mobile cards (`syncIrritabMobile/Desktop`) | `app.js` |
| 4 | `#phase4` | ICF Decision Tree | `initCIFTree` / `renderStep` / `selectTreeOption` navigate the region-specific tree; `pruneTreeFrom` invalidates downstream branches. Clicking a step's already-selected option again un-answers just that step (deletes `treeAnswers[stepId]`, prunes everything after it, leaves the step itself rendered with nothing selected) instead of requiring "↺ Reiniciar árbol" to back up one step | `phase4.js` |
| 4b | `#phase4b` | Hypothesis Confirmation | `setTestResult` + `recalcHypScore` update Bayesian posterior probabilities per test | `phase4b.js` |
| 5 | `#phase5` | Results | `buildResults` / `buildSummary` generates the clinical summary from accumulated state | `app.js` |

Navigation is validated by `navStepClick` — users cannot skip phases with incomplete required data. Phase transitions use `goToPhase(n)` where n ∈ {1, 2, 3, 4, '4b', 5}.

## Clinical Data Structure (`data.js`)

**`SYSTEMIC_SCREENING`** — keyed by region (`hombro`, `cadera`, …). Each region maps to system objects (`SIS_CANCER`, `SIS_CARDIOVASCULAR`, etc.) containing:
- `banderasRojas` / `banderasAmarillas` — red/yellow flag arrays
- `preguntas` — screening questions with `alerta` and `s1` (severity) flags. `alerta` only controls the red-border visual emphasis in Phase 2 (`buildSistemaHTML`) — the actual `sistemicoAlerta` banner fires on any `SI` answer regardless of this flag; it doesn't gate anything on its own.
- `urgencia` (optional, region level) — `{ titulo, lineas }`, literal from guía de consulta's `URGENCIA` for that region's card (lumbar, cadera, cervical, rodilla; hombro and codo have none). Rendered by `renderUrgenciaRegion()` as an open `<details>` box (`#urgenciaRegion`) at the top of the phase 2 screening, before the "no implica derivación automática" note.
- `preguntas[].urgencia` (optional string) — a SÍ on this question is an urgent referral, not a "watchful waiting" flag (`l6` cauda equina, `r1` artritis séptica, `r_v2` TVP): the row shows the message inline, a toast fires, `updateSistemicoAlert()` puts a red "Derivación urgente hoy" alert above the usual warning (or alone, if only urgent questions are positive), and `getUrgenciasActivas()` feeds payload field `ur[]` and the `📋 Notas` line.
- `criterioCompuesto` (optional) — a multi-question screening rule that can't be expressed by any single `alerta` flag (e.g. Goodman's 2-of-4 inflammatory-back-pain criterion on `l_espondilo`, lumbar): `{ ids: [...preguntaId], minPositivas: number, filtro: { edadMax, evolucion }, etiqueta, nota }`. `filtro.evolucion` matches against `state.cronologia` as a duration proxy (no separate duration field exists). `filtro.edadMax` matches against `state.edadPaciente` — a general demographic field collected in Phase 1 (`#edadPaciente`), not rendered anywhere in Phase 2. Evaluated by `evaluarCriterioCompuesto()`/`evaluarCriteriosCompuestos()` in `app.js`, rendered into a system-specific `#criterioCompuesto_<sisId>` container — a phrasing note, never a diagnosis ("patrón compatible con", not "probable"); shows a muted hint instead of the alert when `state.edadPaciente` hasn't been entered yet, since the criterion can't be evaluated without it. This is currently the only place `state.edadPaciente` is read, but the field is intentionally Phase 1-level (not scoped to `l_espondilo`) so any future Phase 2 screening rule can reuse it without relocating it again.

**`CIF_TREES`** — keyed by region. Each tree is a map of step IDs → nodes with `question`, `options` (each option has `next` step ID and effects on `activeHypotheses`).

**`HYPOTHESES`** — keyed by hypothesis ID. Each entry: `{ id, region, name, prom, dosis, pronostico?, clusters?, tests: [{name, sn, sp, lr_pos, lr_neg, criterio, fuente?, tipo?, cluster?, absorbe?}] }`. Optional fields: `pronostico: { horizonte, derivacion, fuente }` (rendered in phase 5 under the dose); `dosis` may be `''` (phase 5 then says it's the clinician's call — never invent one); `dosisFuente` cites where a filled `dosis` comes from (guideline/trial, shown under the dose in phase 5, whose heading then reads «Pauta de tratamiento» instead of «Dosis día 1 (baja fricción)», since a guideline recommendation isn't a day-1 prescription; a unit test forbids it without a `dosis`) — doses taken from a guideline keep its recommendation grade in parentheses, and say so when the guideline sets no volume (see `docs/dosis-pendientes-fuentes.md`); `fuente` is a short citation shown under the test.

### Phase 4b scoring (`calcLRScore`, `phase4b.js`)
There are **no default LRs**: a test with no usable LR never multiplies (the old `|| 1.5` / `|| 0.5` fallbacks were removed on purpose — they gave weight to tests with no evidence behind them). Rules:
1. Published `lr_pos`/`lr_neg` if present; otherwise computed from `sn`/`sp` when both are a single number (`LR+ = S/(1−E)`, `LR− = (1−S)/E`, badge says "(calc.)"). S/E ranges (`'52–70%'`, `'~40%'`, `'>90%'`) are not computed. An LR range (`'2.9–4.9'`) uses the bound closest to 1 (conservative). `lr_pos`/`lr_neg` must be an LR, never other text (a unit test enforces it: `'97% VPP'` was once stored as an LR− and multiplied by 97).
2. Each direction is judged separately: LR+ multiplies only if ≥ 2 (`LR_POS_MIN`), LR− only if ≤ 0.5 (`LR_NEG_MAX`). Otherwise the result is a *clinical finding*: LR = 1, counted in the label as `X/Y hallazgos compatibles`.
3. `cluster: '<id>'` on a test → it never multiplies alone; `hyp.clusters[id] = { nombre, umbralPos, lr_pos, umbralNeg, lr_neg, fuente }` does: LR+ when positives ≥ `umbralPos`; LR− only when *every* member was done and positives ≤ `umbralNeg`.
4. `tipo: 'pronostico'` (e.g. Flynn's manipulation CPR) never enters the diagnostic score.
5. With no applicable LR the label is `⚪ Sin LR aplicable · X/Y hallazgos compatibles` (`hyp-neutral`), never "Peso bajo".
6. `absorbe: [idx]` — when a composite test (e.g. RAPIDH) contributes an LR, the listed component tests (the SLR it contains) stop multiplying, so the same evidence isn't counted twice.

When modifying clinical content, keep `data/` isolated from logic — this separation allows physiotherapists to review domain content independently. The content used to live in a single `data.js`; it was split **by region** (not by domain) once each region started getting its own guía-de-consulta integration: one file per region keeps diffs and reviews scoped to that region, avoids merge conflicts between sessions working on different regions, and mirrors `formularios/<region>.js`. The split was a pure move (verified by comparing `JSON.stringify` of every `data.js` export before and after: byte-identical). `data.js` still exports the same objects, so code outside `data/` never needs to know about the split. Hypothesis ids are global: a unit test fails if two region files reuse one (`Object.assign` would silently overwrite it). `data/*.js` are static imports — if one is missing from `deploy-to-hub.yml`'s copy step the deployed app breaks entirely, which the smoke test's module check would also catch locally.

## UI Conventions

### CSS variables (`:root`)
`--bg`, `--surface`, `--surface2`, `--surface3`, `--border`, `--border2`, `--accent` (blue `#4f9cf9`), `--accent2` (green `#38d9a9`), `--text`, `--text2`, `--text3`, `--red`, `--green`, `--orange`

### Fonts
- Outfit — body text
- DM Serif Display — phase titles
- DM Mono — monospaced / labels

### Component classes
- `.option-btn` — single-select button groups; active state uses class `selected`. Groups with no meaningful default (`selectOption`: mecanismo, cronología, naturaleza, estadio, estabilidad, psico_*; `selectPsico`: riesgoPsico) deselect back to `''` on a second click of the already-selected option. Groups that already default to a real value (`selectSQ`/`selectSistQ`, SI/NO screening — pre-selected `NO`) don't: there's no meaningful "unanswered" state to toggle back to, so switching to the other option is already a one-click undo.
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
- `selectSQ`, `selectPsico`, `selectOption`, `updateEdadPaciente`, `updateVital` — phase 1 inputs
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

Reaching phase 5 (`buildResults()`) renders the summary HTML but does **not** emit the assessment payload. The assessment is only considered **complete** when the clinician explicitly presses `#btnFinalizar` — labeled **"Finalizar valoración →"** in-hub, **"📤 Compartir informe"** standalone (`buildResults()` sets the label each render, keyed off `document.body.classList.contains('in-hub')` — the same signal `_initHubIntegration()` sets).

`finalizarValoracion()` flow (both contexts, always):
1. `buildPhysiQPayload()` — builds payload including `pn: state.planNotes` with the filled plan notes
2. `writeSession({ assessment: payload, patient, date })` — writes the complete payload to IDB. Always runs, hub or not: `physiq-report` reads this from IDB on its own load independent of ever receiving the broadcast below, so this is never wasted even standalone.
3. Emits `SESSION_ASSESSMENT` via BroadcastChannel → if the hub/physiq-report happens to be open right now, its "completo" badge updates live; if nothing is listening (standalone with nothing else open), this is a harmless no-op.

Then it branches on hub context:
- **In-hub:** button shows "✓ Enviado al informe" for 3s, then re-activates (re-pressable if notes are edited).
- **Standalone:** no report app around to relay to, so it shares the patient/GP report (`buildInformeFisioterapiaText()` — *not* the clinician shorthand) via `navigator.share()` instead; falls back to `navigator.clipboard.writeText()` + a toast when Web Share isn't supported (e.g. desktop browsers).

Plan notes fields in phase 5: `variableControl`, `ventanaRecuperacion`, `anclajeHabito` — not mandatory, included in payload as `pn`.

## Key functions (`app.js`)

| Function | Purpose |
|---|---|
| `buildPhysiQPayload()` | Builds the minimum JSON payload from state |
| `finalizarValoracion()` | Writes complete assessment to IDB, emits `SESSION_ASSESSMENT`, and (standalone only) shares/copies the summary |
| `buildContextSummaryText()` | Builds the plain-text **clinician shorthand** summary used by `copyContextToClipboard()` — dense, includes LR/score jargon, meant for the clinician's own use or `physiq-report` |
| `copyContextToClipboard()` | Copies the clinician shorthand summary to clipboard; shows a toast via `showCopyFeedback()` |
| `getPendientesBreve()` | Modo breve: what was left undone, `[{ texto, fase }]`; `[]` in completo (see "Modo breve") |
| `buildInformeFisioterapiaText()` | Builds a **patient/GP-facing** physiotherapy report from the same payload — plain language, no NRS/LR jargon or emoji, hypothesis names only (no scores); meant to be pasted as-is into a letterhead template and handed to the patient |
| `copyInformeFisioterapia()` | Copies that patient/GP report to clipboard (`📄 Informe` button, phase 5, next to `📋 Notas`) |

**Payload fields:** `p` (patient), `r` (region), `d` (date), `mo` (motivo), `sv` (signos vitales: fc/fr/spo2/tas/tad), `an` (antropometría: talla/peso/imc — imc computed at build time, never stored in state), `me` (mecanismo), `cr` (cronología), `rp` (riesgo psicosocial), `nr` (NRS), `ir` (irritabilidad), `na` (naturaleza), `si` (sistémico alert), `br` (banderas rojas), `sq` (systemic screening affirmative question texts), `ur[]` (urgent-referral messages of phase 2 questions answered SÍ), `h[]` (hypotheses with scores and test results), `pn` (plan notes), `md` (`'completo'`|`'breve'`), `pe[]` (modo breve only: pending items as text — see "Modo breve"), `fp[]` (formulario previo answers as readable `{ s, q, a }` — section, question, answer; also listed in `📋 Notas` in full; the patient/GP `📄 Informe` gets only the items marked `informe` in the schema — see "Formulario previo" below).

**Two different summaries, two different audiences** — both live in phase 5's header (`.phase5-copy-btn`, `styles.css`), both work regardless of hub context: `📋 Notas` is the clinician's own dense shorthand (`buildContextSummaryText()`); `📄 Informe` is the patient/GP-facing report (`buildInformeFisioterapiaText()`), reworded from the same data but stripped of internal scoring language. Both buttons show a fuller "Copiar informe"/"Copiar notas" label ≥481px and collapse to the single-word `📄 Informe`/`📋 Notas` under 480px (`.btn-text-full`/`.btn-text-short`, plus `flex-wrap` on the header row) so the pair doesn't overflow next to the phase title on narrow phones. When adding a new clinical field to one, consider whether the other needs it too — they diverge in *tone*, not in what data exists. Navigation to physiq-report is handled by the hub; standalone, `#btnFinalizar`'s share action reuses `buildInformeFisioterapiaText()` too (see "Phase 5 and finalizarValoracion()" above) — it's the same patient/GP report as `📄 Informe`, just pushed through `navigator.share()` instead of the clipboard.

## Modo breve

Consultation type chosen at the top of phase 1 (`#modoConsulta`, `selectModo()`): **Completa** (default; old sessions without `modo` stay completo) or **Breve (10')** for insurer visits. Design and the 5 clinical decisions behind it: `docs/modo-breve.md`. Rule that never bends: **breve never hides a safety item** — phase 1 red flags, questions with `urgencia`, the region `urgencia` box, the urgent-referral alert and the full CIF tree work exactly as in completo. Breve only folds optional fields and makes the gaps explicit.

- `body.modo-breve` (set by `_pintarModoUI()`) drives everything visual via CSS: `.breve-opcional` is hidden (vitals except age, `psico_*`, the irritability matrix, naturaleza/estadio/estabilidad), `.breve-only`/`.breve-only-inline` are shown. `toggleBreveVerTodo()` (`body.breve-ver-todo`, view-only, not persisted) shows everything again, including the folded phase 2 questions — that's how pending items get completed without leaving breve.
- **Phase 2 embudo**: `buildSistemaHTML` adds one SÍ/NO per system (`[data-embudo]`, `selectEmbudo()`) read against that system's `banderasRojas`, and wraps the questions in `.sis-body`. With the embudo not in SÍ, CSS hides every `.sq2` **except `.sq2-urg`** (questions with `urgencia`) — a unit test checks every urgent question carries that class and no other does, and the smoke test checks it in a real browser. NO is refused while the system has any SÍ answer; a SÍ answer flips an embudo NO to SÍ. Unanswered questions stay `'NO'` as always — `sistemicoBreve` is what tells "asked one by one" from "screened by embudo".
- **Phase 3**: `selectIrritabDirecta()` sets `irritabilidadNivel` directly and `irritabilidadDirecta: true`; touching the matrix (`_usarMatrizIrritabilidad()`) switches back to the computed level. Summaries say "(estimada)".
- **Phase 4**: `#btnSinConfirmar` ("Resultados sin confirmar →", breve only) goes to phase 5 skipping 4b; greyed out by CSS while `#btnGoConfirm` is disabled (`#btnGoConfirm:disabled ~ #btnSinConfirmar`), so no change to `phase4.js`.
- **Phase 4b**: `buildTestList()` lists first the tests that can move the score (`testPuntua()` — same rules as `calcLRScore`, a unit test cross-checks both) and folds the rest in `<details class="breve-hallazgos">`. Visual order only: every test keeps its index in `state.testResults`.
- **Pending items**: `getPendientesBreve()` → `[{ texto, fase }]` (systems by embudo, systems not screened, estimated irritability, active hypotheses with no pos/neg test, empty formulario previo); `[]` in completo. Shown in phase 1 (`#brevePendientes`, once past phase 2, with "Completar pendientes →"), at the top of phase 5, in `📋 Notas`, and in the payload (`pe`).
- **Transparency**: `TEXTO_VALORACION_BREVE` goes into phase 5, `📋 Notas` and `📄 Informe` in breve, always (decision 3 of the design); the Informe's "IMPRESIÓN CLÍNICA" says "(hipótesis de trabajo, pendiente de confirmar)" when tests are pending. Switching breve → completo with pending items asks for confirmation, because from then on the summaries stop saying the assessment was brief.

## Formulario previo

Pre-visit form transcribed from guía-de-consulta (`tools/plantilla_formularios.js` cara 1 + `data/formulario_<region>.js` cara 2) — question text kept literal; the paper header (name, date, age) is not repeated because phase 1 already has it. The physio fills it in PhysiQ: phase 1 card "📝 Formulario Previo" (opens on the General tab; Region tab once a region is chosen) and a button at the top of phase 2's screening once a region is picked — both use the same `.fp-open-region` full-width pill with the emoji inside the button label (`📝 Formulario previo general` / `📝 Formulario previo de la región`), so the two entry points read as the same action; phase 1's card additionally wraps it with the explanatory text (phase 2's doesn't need it — its label already says "de la región") and `#fpContador` underneath. Every `texto` item gets the same mic + chips bar as `motivoConsulta` (`injectQuickInputBar(fieldId, chips)`, exported from `app.js`); the chips come from the item's own `chips` in the schema. Answers linked through `pistas` show as a "📝 Refiere el paciente" box (dashed border — reserved for the patient's voice; free-text answers and option `detalle` text in italic «quotes», as a literal citation; option answers without quotes since they are the paper form's wording, not the patient's; the form modal tells the physio to write free text in the patient's own words) inside the matching CIF step (`renderStep` → `window.fpPistasPasoHTML`) — a reminder only, never an automatic answer. The same box also shows in phase 1 on top of the Mecanismo de Inicio and Cronología cards (`#fpPistas_mecanismo`/`#fpPistas_cronologia`, from `formularios/comun.js`'s own `pistas`, painted by `_actualizarPistasFase1()` alongside `#fpContador`): phase 1's order is Motivo → Formulario previo → Mecanismo → Cronología → Signos vitales, so the patient's own account of onset ("1 · Cómo empezó") sits right above the clinician's classification of it. Never preselect those cards from the form — `desde_cuando` is free text and Post-quirúrgico has no counterpart. The `📄 Informe` (patient/GP, `buildInformeFisioterapiaText()`) never dumps the whole form: only items with `informe: '<etiqueta>'` in the schema go in, as `etiqueta: respuesta` lines under "SEGÚN REFIERE EL PACIENTE", or under "ANTECEDENTES REFERIDOS POR EL PACIENTE" when the item also has `antecedente: true` (enfermedades, operaciones, medicación). `informeFormularioPrevio()` (`formulario.js`) builds both lists: it skips "No sabría decir" and hidden (`mostrarSi`) items and joins consecutive items sharing a label into one line (actividad_1..3). Chosen per question with the clinician: common (onset date, prior episodes, trend, night pain, limited activities, treatments tried, health history), lumbar (leg radiation, weakness), cervical (arm radiation, weakness, headache, dizziness — yes/no only), hombro (previous dislocation), tobillo_pie (injury mechanism, previous sprains of the same ankle); cadera and rodilla send nothing region-specific. Never mark a `matriz` (unit test). The paper form's last box («prefiero comentarle en persona») is deliberately not in `formularios/comun.js`: the physio always fills the form with the patient present, so it added nothing and leaked a content-less confidence into `📋 Notas`/physiq-report; old sessions that stored `en_persona` are harmless — summaries only walk items that exist in the schema. Deploy: `formulario.js` and `formularios/` must be in `deploy-to-hub.yml`'s copy step.

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

See `MIGRATION_PLAN.md` for a living checklist covering the ES modules migration (Fase A), mobile-friendly text input improvements (Fase B), the phase 4/4b engine isolation (Fase C) and **Fase D — integrating guía de consulta region by region** (step-by-step procedure + per-region status; lumbar is the reference implementation). One region per session: start any region work by reading Fase D. Check it for current progress before starting related work; update its checkboxes and notes as steps are completed.

## Sibling repos

The hub at `physiodevapp.github.io/physiq/` is the primary entry point for the ecosystem.

| Repo | Hub path | Role |
|------|----------|------|
| physiq-motion | /physiq/motion/ | Joint ROM measurement |
| physiq-report | /physiq/report/ | Audio transcription + Claude report generation |
