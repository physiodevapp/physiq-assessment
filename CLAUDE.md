# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PhysiQ-Assessment is a musculoskeletal physiotherapy clinical assessment assistant. It guides clinicians through a structured 5-phase workflow (phases 1–4b–5, where 4b is a sub-phase of 4) using evidence-based screening, ICF decision trees, and diagnostic likelihood ratios. It is in active clinical pilot use.

**Deployment:** Push to `main` triggers `deploy-to-hub.yml`, which copies the app files into the central PhysiQ hub repo (`physiodevapp/physiq`). The hub's own GitHub Pages deployment serves the app at `physiodevapp.github.io/physiq/assessment/`. There is no standalone Pages deployment for this repo — but the deployed copy at that URL is itself a complete, installable PWA independent of the hub (see "Standalone use" below); "no standalone Pages deployment" only means physiq-assessment doesn't have its *own* separate GitHub Pages site.

### Standalone use (without the hub)

`manifest.json` (`start_url`/`scope`: `/physiq/assessment/`, `display: standalone`, install icons) plus `sw.js` already make the deployed app fully installable on its own — no code changes needed. Open `https://physiodevapp.github.io/physiq/assessment/` directly (not through the hub) and use the browser's "Install app" / "Add to Home Screen"; it installs as its own icon, scoped to that path, separate from the hub's own installed PWA. `_initHubIntegration()` (`app.js`) no-ops cleanly outside an iframe (`window.self === window.top`), so nothing hub-specific blocks standalone use. What's unavailable standalone (both are hub-only by design, not bugs): the hub's audio recording widget, and the "navigate to physiq-report" hop from phase 5. In exchange, standalone phase 5 has its own **«🎙 Informe narrativo» card** (record/attach audio → narrative CIF report via the physiq-report orchestrator worker; see "Informe narrativo con IA (standalone)" below), which never loads in the hub. Phase 5's `#btnFinalizar` becomes "📤 Compartir informe" and shares the patient/GP report directly (`navigator.share()`, clipboard fallback) instead of the in-hub "Finalizar valoración" flow (see "Phase 5 and finalizarValoracion()" below); the "📄 Informe"/"📋 Notas" buttons also still work either way. Session data (IndexedDB, `BroadcastChannel`) is scoped per browser *origin*, not per path, so a standalone install and the hub-embedded copy share the same session data when used in the same browser.

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

**Bibliographic references (`docs/referencias.md` + `data/referencias.js`):** `docs/referencias.md` is a generated index of every reference cited in `data/` (`fuente` of tests and clusters, `pronostico.fuente`, `dosisFuente`, plus author–year mentions inside other texts), grouped by reference with where each one is used (region, hypothesis, test, app phase), a «Estado de revisión» worklist, the guía-de-consulta tarjetas each region cites, and the tests with no `fuente`. `data/referencias.js` is the central registry: one entry per reference, keyed by the short form the citations use (`'Hermans 2013'`, `'Maxwell y Sterling 2013'`, `'NICE NG226'`), holding what belongs to the reference rather than to each use — `publicacion`, `doi`, and `revision` (`null` = never reviewed, or `{ fecha: 'AAAA-MM', resultado }` = last search for newer literature and its outcome). The full citation text stays in each `fuente`, unchanged (it's what the clinician sees); the app never imports the registry. `node tests/unit.js` fails if a citation names a reference missing from the registry, if a registry entry is no longer cited, if a `revision` is malformed, or if `docs/referencias.md` is out of date — after changing any citation or the registry, run `node tests/gen-referencias.mjs` and commit the regenerated file with the change. The step-by-step review procedure (pick the first of «Estado de revisión», update every use listed for that reference reading the article itself, record `revision`) is at the top of `docs/referencias.md`. Logic in `tests/referencias.mjs`; the tarjeta/formulario footers it quotes (`TARJETAS`) are copied from guia-de-consulta by hand, since that repo isn't available to the tests. The guía-de-consulta tarjetas are extracts of regional clinical guides based on Lluch, López-Cubas, Jones, Jull, Hall y Lewis, *Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders* (ZERAPI, 2020) — registry entry `'Lluch 2020'` (`tarjetas: true`), which every «Tarjeta de consulta <región>» citation counts toward; the chapters the tarjeta footers cite (Struyf and Powell y Lewis, cap. 3; Fondevila Suárez, cap. 5) are chapters of that book. When the user supplies a regional chapter it is read in full and cited directly as `'Lluch 2020, cap. X (autor), pp.'` instead of the tarjeta (done for lumbar, cap. 5.1; cervical, caps. 5.3 and 5.3.1; hombro, caps. 3.1 and 3.1.1; cadera, cap. 4.1, subchapters 4.1.1–4.1.5; rodilla, cap. 4.2, which has no red-flag table; tobillo y pie, cap. 4.3, whose red-flag table is on p. 287; and codo, cap. 3.2 (Coombes y Bisset, pp. 81–103), which has no red-flag table and is cited directly, since codo has no tarjeta; see `docs/razonamiento-cribado.md`). A reference that `data/` cites without author–year gets `citadaComo: ['<texto>']` in the registry: Goodman, Heick y Lazaro, *Differential Diagnosis for Physical Therapists*, 6th ed., 2018 (`'Goodman 2018'`, cited as «Criterio de Goodman» in lumbar's `criterioCompuesto`).

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
| `data/referencias.js` | Central registry of bibliographic references (one entry per reference: `publicacion`, `doi`, `revision`). Not imported by the app — only by `tests/unit.js` and `tests/gen-referencias.mjs` (see "Bibliographic references" above) |
| `data/comun.js` | Cross-region screening systems (`SIS_ENDOCRINO`, `SIS_HEMATOLOGICO`), imported by each region file that uses them — the same object instance is shared, as before the split |
| `informe-ia.js` | Standalone-only phase 5 card «🎙 Informe narrativo»: Turnstile, audio status/attachment (recording lives in `grabadora.js`), call to the orchestrator worker, rendering and sharing. Loaded by `app.js` with dynamic `import()` only, and only outside the hub (see "Informe narrativo con IA (standalone)") |
| `grabadora.js` | Standalone-only session recording from the header (`#grabBtn`, any phase): MediaRecorder engine, header pill (tap = pause/resume, long press / trash = discard) + menu, automatic close (generate, 25 MB, mic cut, 20 min paused). Owns the session audio (recorded or attached in the card). Loaded by `app.js` with dynamic `import()` at startup, only outside the hub |
| `lib/licencia-ia.js` | One shared `/validate` check for the recorder and the card (`body.ia-licencia` when the worker says `real`); validates a typed key before storing it |
| `lib/informe-narrativo.js` | Pure functions for that card: the narrative prompt (adapted copy of physiq-report's), assessment context block, Whisper hints, SSE parsing, markdown → text/HTML, payload fingerprint. Unit-tested |
| `tools/prompt-desde-json.mjs` | Review tool, not loaded by the app: `node tools/prompt-desde-json.mjs <valoracion.json> [narrativo\|breve] [--audio]` prints the exact prompt the «🎙 Informe narrativo» card would send for an exported assessment — to tell prompt problems from data problems when reviewing a generated report |
| `lib/posquirurgico.js` | Pure functions for the post-surgical patient (see "Paciente posquirúrgico"): complication list, weeks since surgery, payload `cq`, shared texts. Unit-tested |
| `lib/valoracion-json.js` | Pure functions to export/import a whole assessment as `.json` (session panel): `exportarValoracion`, `nombreArchivo`, `leerImportacion` (validates app/tipo/version, phase, region). Loaded by `app.js` with dynamic `import()` only, when used (see "Session Persistence") |
| `lib/audio-store.js` | The session audio in IDB (`physiq` v3, store `audio`, keys `assessment-meta` / `assessment-chunk-<n>` — never `pending`, which is the hub recorder's) |
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
  cirugia: { intervencion, fecha, semanasAprox, protocolo, restricciones, complicaciones: [], complicacionOtra },
                            // tarjeta «Cirugía», only read with mecanismo Post-quirúrgico; weeks are computed from `fecha`, never stored
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
  // (no `estadio`: phase 3's Estadio card shows `cronologia` read-only — same categories, asked once in phase 1 — with a "Cambiar en la fase 1 →" link, `irACronologia()`, that goes to phase 1 and scrolls to `#cardCronologia`)
  estabilidad: '',
  signoComparable: '',      // textarea #signoComparable

  // Phase 4
  activeHypotheses: [],     // ['ho1', 'ho2', ...] — IDs from HYPOTHESES
  treeAnswers: {},          // { [stepId]: value }
  stepsCompleted: [],

  // Phase 4b
  testResults: {},          // { [hypId]: { [testIdx]: 'pos'|'neg'|'nd' } }
  hypothesisScores: {},     // { [hypId]: { totalLR: number, label: string } }
  derivacionResuelta: {},   // { [hypId | stepId]: true } — «Ya diagnosticada y tratada» (see "Paciente posquirúrgico")

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
  formularioPrevio: { comun: {}, regiones: { lumbar: {} } },

  // Informe narrativo con IA (standalone only) — never in the payload or summaries
  informeIA: null           // { texto, transcripcion, fecha, conAudio, huella, datos: { p, d, r } } | null
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
- `preguntas` — screening questions with `alerta` and `s1` flags. `s1` marks a question of the source's «screening rápido»; it has no effect at all — no chip (removed: it competed with the «Urgencia» chip and meant nothing actionable), no logic, not used by modo breve — and is kept only as source data (e.g. for a future hand-reviewed breve list). `alerta` only controls the red-border visual emphasis in Phase 2 (`buildSistemaHTML`) — the actual `sistemicoAlerta` banner fires on any `SI` answer regardless of this flag; it doesn't gate anything on its own.
- `urgencia` (optional, region level) — `{ titulo, lineas }`, literal from guía de consulta's `URGENCIA` for that region's card (lumbar, cadera, cervical, rodilla; hombro and codo have none). Rendered by `renderUrgenciaRegion()` as an open `<details>` box (`#urgenciaRegion`) at the top of the phase 2 screening, before the "no implica derivación automática" note.
- `preguntas[].urgencia` (optional string) — a SÍ on this question is an urgent referral, not a "watchful waiting" flag (`l6` cauda equina, `r1` artritis séptica, `r_v2` TVP, `h_g1` embarazo ectópico, among others): the row shows the message inline, a toast fires, `updateSistemicoAlert()` puts a red "Derivación urgente hoy" alert above the usual warning (or alone, if only urgent questions are positive), and `getUrgenciasActivas()` feeds payload field `ur[]` and the `📋 Notas` line.
- `criterioCompuesto` (optional) — a multi-question screening rule that can't be expressed by any single `alerta` flag (e.g. Goodman's 2-of-4 inflammatory-back-pain criterion on `l_espondilo`, lumbar): `{ ids: [...preguntaId], minPositivas: number, filtro: { edadMax, evolucion }, etiqueta, nota }`. `filtro.evolucion` matches against `state.cronologia` as a duration proxy (no separate duration field exists). `filtro.edadMax` matches against `state.edadPaciente` — a general demographic field collected in Phase 1 (`#edadPaciente`), not rendered anywhere in Phase 2. Evaluated by `evaluarCriterioCompuesto()`/`evaluarCriteriosCompuestos()` in `app.js`, rendered into a system-specific `#criterioCompuesto_<sisId>` container — a phrasing note, never a diagnosis ("patrón compatible con", not "probable"); shows a muted hint instead of the alert when `state.edadPaciente` hasn't been entered yet, since the criterion can't be evaluated without it. This is currently the only place `state.edadPaciente` is read, but the field is intentionally Phase 1-level (not scoped to `l_espondilo`) so any future Phase 2 screening rule can reuse it without relocating it again.

**`CIF_TREES`** — keyed by region. Each tree is a map of step IDs → nodes with `question`, `options` (each option has `next` step ID and effects on `activeHypotheses`). An option may carry `derivacion` (string): that answer asks for a medical referral that is not urgent-today (unlike phase 2 `urgencia`) — today lumbar `lu_step2` VASCULAR (claudicación vascular) and codo `co_step1` FRACTURA / LUXACIÓN (prueba de extensión del codo, Appelboam 2008). An option with `derivacion` may also carry `resoluble: true` (today only codo `co_step1` FRACTURA / LUXACIÓN; unit test pins it): it admits «Ya diagnosticada y tratada», and once marked its referral disappears everywhere. The tree keeps going; `getDerivacionesArbol()` (`phase4.js`) feeds a red alert under the step, at the top of «Árbol completado», at the top of phase 5, the `📋 Notas` line «🩺 DERIVACIÓN MÉDICA (árbol CIF)», the `📄 Informe` («Se recomienda valoración médica», under CRIBADO DE SEGURIDAD) and payload field `dv[]`.

**`HYPOTHESES`** — keyed by hypothesis ID. Each entry: `{ id, region, name, prom, dosis, pronostico?, clusters?, tests: [{name, sn, sp, lr_pos, lr_neg, criterio, fuente?, tipo?, cluster?, absorbe?}] }`. Optional fields: `pronostico: { horizonte, derivacion, fuente }` (rendered in phase 5 under the dose); `dosis` may be `''` (phase 5 then says it's the clinician's call — never invent one), or `DOSIS_DERIVAR` (`data/comun.js`, «Derivar: sin tratamiento de fisioterapia hasta el diagnóstico médico») for referral-first hypotheses (fractures, ruptures, dislocations, gout, cervical myelopathy: `ce8`, `co7`, `co12`, `co14`, `h11`, `ro11`, `tp3`–`tp6`, `tp17`, `tp30`, `tp35`, `tp37`; a unit test pins the list), which phase 5 titles «🚑 Derivación»; hypotheses that need referral only above some grade or sign keep `''`; `dosisFuente` cites where a filled `dosis` comes from (guideline/trial, shown under the dose in phase 5, whose heading then reads «Pauta de tratamiento» instead of «Dosis día 1 (baja fricción)», since a guideline recommendation isn't a day-1 prescription; a unit test forbids it without a `dosis`) — doses taken from a guideline keep its recommendation grade in parentheses, and say so when the guideline sets no volume (see `docs/dosis-pendientes-fuentes.md`); `fuente` is a short citation shown under the test.

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
- `.option-btn` — single-select button groups; active state uses class `selected`. Groups with no meaningful default (`selectOption`: mecanismo, cronología, naturaleza, estabilidad, psico_*; `selectPsico`: riesgoPsico) deselect back to `''` on a second click of the already-selected option. Groups that already default to a real value (`selectSQ`/`selectSistQ`, SI/NO screening — pre-selected `NO`) don't: there's no meaningful "unanswered" state to toggle back to, so switching to the other option is already a one-click undo.
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

## Theme

Dark (default of `:root`) and light, with a manual toggle (Sistema / Claro / Oscuro). `data-theme` on `<html>` is always the *resolved* theme; light overrides the CSS variables in `:root[data-theme="light"]` (`styles.css`), so new colors must be variables, never literals (the `--header-bg`, `--nav-bg`, `--hover-tint`, `--alert-*-text`, `--lime`… tokens exist for that). The choice lives in `localStorage` (exception to the no-localStorage rule: a synchronous per-device UI preference, read by the inline script in `index.html`'s `<head>` before first paint; the IDB session expires after 24h and is async). `applyTheme()`/`setThemePref()` (`app.js`) mirror that script and follow `prefers-color-scheme` live while the choice is "Sistema". **In the hub (`window.self !== window.top`) the app is always dark** and the theme button is hidden (`.in-hub .theme-btn`) — the stored choice is ignored there even though the origin is shared. The control is a header icon `#themeBtn` (`cycleThemePref()`: one tap cycles Sistema → Claro → Oscuro, the icon shows the current choice); it was deliberately kept out of the session panel (which is about the patient/session). Hidden in the hub. The header's 🌐 translate button (`.btn-translate`) is hidden outside the hub (`body:not(.in-hub)`): it only exists as a hint for the hub embed. Every overlay (phase sheet, session panel, formulario previo, confirm banner) uses the same `--scrim` (background, themed) and `--scrim-blur` (6px, same on mobile and desktop), and dialogs use `--modal-shadow` — a new modal must use those tokens, not its own `rgba(0,0,0,…)`/`blur()`. Not themed: `manifest.json` colors and iOS `black-translucent` status bar (static).

## Session Persistence

IDB (`lib/session.js`) is the persistence layer for session/clinical data — no localStorage for that. The single exception is the UI theme choice (`physiq-assessment-theme`, see "Theme").

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

**Export / import (`.json`)** — the session panel has «⬇ Exportar» and «⬆ Importar» under the patient field (two equal-width buttons that fit at 320 px, plus a one-line note that the file holds clinical data and the patient's name), meant for repeating tests with the same data (e.g. regenerating the narrative report after a prompt change). Export (enabled once past phase 1, `maxVisitedIdx > 0`) calls `saveSession()` to flush the DOM fields, then downloads `valoracion-<paciente>-<AAAA-MM-DD>.json` = `{ app, tipo, version, exportado, assessmentState }` — the whole `state`, patient name included, **without** `informeIA` (the point is to regenerate it) or the audio; on touch devices it uses the share sheet when `navigator.canShare({ files })`, otherwise an `<a download>`. Import (`#sessionImportFile`) validates with `leerImportacion()` (bad file → toast, nothing changes), asks with `showConfirmBanner` (mentions the audio via `_avisoAudioSesion()`), then `_aplicarImportacion()`: sets `_importando` (makes `saveSession()` a no-op, since the DOM still holds the old assessment and a `visibilitychange` during reload would otherwise overwrite the import), discards the session audio, `clearSession()` (no leftover `assessment`/`rom`), `writeSession({ patient, date, assessmentState })` and `location.reload()` — the existing startup restore does the rest. Unit tests cover the round trip and the rejections; the smoke test exports, clears, imports and checks the state comes back in phase 5, and that the buttons fit at 320 px.

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

**Payload fields:** `p` (patient), `r` (region), `d` (date), `mo` (motivo), `sv` (signos vitales: fc/fr/spo2/tas/tad), `an` (antropometría: talla/peso/imc — imc computed at build time, never stored in state), `me` (mecanismo), `cq` (cirugía, only with mecanismo Post-quirúrgico: `{ iv, fe, se, pr, re, co[] }` — intervención, fecha, semanas, protocolo, restricciones, complicaciones), `cr` (cronología), `rp` (riesgo psicosocial), `nr` (NRS), `ir` (irritabilidad), `na` (naturaleza), `si` (sistémico alert), `br` (banderas rojas), `sq` (systemic screening affirmative question texts), `ur[]` (urgent-referral messages of phase 2 questions answered SÍ), `dv[]` (medical-referral messages of CIF tree answers with `derivacion`), `h[]` (hypotheses with scores and test results; `dt: true` on a «Derivar» hypothesis marked «ya diagnosticada y tratada»), `pn` (plan notes), `md` (`'completo'`|`'breve'`), `pe[]` (modo breve only: pending items as text — see "Modo breve"), `fp[]` (formulario previo answers as readable `{ s, q, a }` — section, question, answer; also listed in `📋 Notas` in full; the patient/GP `📄 Informe` gets only the items marked `informe` in the schema — see "Formulario previo" below).

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

Pre-visit form transcribed from guía-de-consulta (`tools/plantilla_formularios.js` cara 1 + `data/formulario_<region>.js` cara 2) — question text kept literal; the paper header (name, date, age) is not repeated because phase 1 already has it. The physio fills it in PhysiQ, inline (no modal): the general half is a `<details class="fp-details">` card (`#fpDet_comun`) in phase 1 right after the motivo, and the regional half is its own `<details>` (`#fpDet_region`) in phase 2, after the urgency box and before the screening notes/systems — it is a *pre-visit* form, so it stays ahead of the red-flag questions, but separate from them. Both start closed and are painted on open (`fpToggle`, via `ontoggle`); `_refrescarInline()` repaints the open ones on region change, reset and session restore. Each summary shows its own counter (`#fpCont_comun`/`#fpCont_region`); titles use the `.card-title` style on one line («FORMULARIO PREVIO · GENERAL», «… · TOBILLO Y PIE» via `#fpNombreRegion`), with the counter on the right (below the title under 480px). A region without a `formularios/<region>.js` (today: codo) shows a warning alert inside its details instead of the form. `abrirFormularioPrevio('comun'|'region')` (exported to app.js) opens one and scrolls to it — used by "Completar pendientes →" in modo breve. Every `texto` item gets the same mic + chips bar as `motivoConsulta` (`injectQuickInputBar(fieldId, chips)`, exported from `app.js`); the chips come from the item's own `chips` in the schema. Answers linked through `pistas` show as a "📝 Refiere el paciente" box (dashed border — reserved for the patient's voice; free-text answers and option `detalle` text in italic «quotes», as a literal citation; option answers without quotes since they are the paper form's wording, not the patient's; the form tells the physio to write free text in the patient's own words (`.fp-literal-nota`)) inside the matching CIF step (`renderStep` → `window.fpPistasPasoHTML`) — a reminder only, never an automatic answer. The same box also shows in phase 1 on top of the Mecanismo de Inicio and Cronología cards (`#fpPistas_mecanismo`/`#fpPistas_cronologia`, from `formularios/comun.js`'s own `pistas`, painted by `_actualizarPistasFase1()` alongside the counters): phase 1's order is Motivo → Formulario previo → Mecanismo → Cronología → Signos vitales, so the patient's own account of onset ("1 · Cómo empezó") sits right above the clinician's classification of it. Never preselect those cards from the form — `desde_cuando` is free text and Post-quirúrgico has no counterpart. The `📄 Informe` (patient/GP, `buildInformeFisioterapiaText()`) never dumps the whole form: only items with `informe: '<etiqueta>'` in the schema go in, as `etiqueta: respuesta` lines under "SEGÚN REFIERE EL PACIENTE", or under "ANTECEDENTES REFERIDOS POR EL PACIENTE" when the item also has `antecedente: true` (enfermedades, operaciones, medicación). `informeFormularioPrevio()` (`formulario.js`) builds both lists: it skips "No sabría decir" and hidden (`mostrarSi`) items and joins consecutive items sharing a label into one line (actividad_1..3). Chosen per question with the clinician: common (onset date, prior episodes, trend, night pain, limited activities, treatments tried, health history), lumbar (leg radiation, weakness), cervical (arm radiation, weakness, headache, dizziness — yes/no only), hombro (previous dislocation), tobillo_pie (injury mechanism, previous sprains of the same ankle); cadera and rodilla send nothing region-specific. Never mark a `matriz` (unit test). The paper form's last box («prefiero comentarle en persona») is deliberately not in `formularios/comun.js`: the physio always fills the form with the patient present, so it added nothing and leaked a content-less confidence into `📋 Notas`/physiq-report; old sessions that stored `en_persona` are harmless — summaries only walk items that exist in the schema. Deploy: `formulario.js` and `formularios/` must be in `deploy-to-hub.yml`'s copy step.

## Paciente posquirúrgico

Design and the 8 clinical decisions: `docs/posquirurgico.md`. Common to the 7 regions, **no protocols per type of surgery**: the surgeon's protocol rules.

- **Tarjeta «Cirugía»** (`#cardCirugia`, phase 1, right after Mecanismo): shown only with mecanismo Post-quirúrgico, via `body.posquirurgico` (`_pintarCirugiaUI()`, CSS `.solo-posq`). Intervención (mic), fecha (or `semanasAprox` if unknown; `semanasCirugia()` computes weeks on the fly), protocolo Escrito / Verbal / No hay (`selectCirProtocolo`), restricciones (mic), complicaciones as a closed list + «otra» (`toggleCirComplicacion`; «Ninguna» is exclusive). Not folded in modo breve. Data survive a change of mecanismo but no summary reads them unless it's Post-quirúrgico.
- **Protocol rules the plan**: phase 5 opens with a «Paciente posquirúrgico» box (`_cirugiaResultadosHTML`); every guideline pauta gets «Solo si es compatible con el protocolo del cirujano…» (`TEXTO_PAUTA_COMPATIBLE`); `📋 Notas` gets a «🏥 CIRUGÍA:» line; `📄 Informe` an «ANTECEDENTE QUIRÚRGICO» block and a first PLAN line; the AI report a «Cirugía» data block plus a `REGLAS_COMUNES` rule. Without a protocol (`conProtocolo()` false: «No hay» or empty) all of them say «Restricciones pendientes de confirmar con el cirujano», and modo breve lists it as a pending item (`ancla: 'cardCirugia'`).
- **«Ya diagnosticada y tratada»** (any mecanismo — a cast-treated fracture or treated gout has the same problem): checkbox on every active `DOSIS_DERIVAR` hypothesis, in its 4b card and its phase 5 card (`casillaTratadaHTML`, `toggleDiagnosticoTratado`; `esTratada`/`marcarTratada` in `phase4b.js`). Marked: its tests fold and don't score (label `ETIQUETA_TRATADA`, answers kept), no «🚑 Derivación» in phase 5, no pending tests in breve, `dt: true` in the payload, «(intervenida quirúrgicamente)»/«(diagnosticada y tratada)» in the Informe, and the AI report neither refers it nor lists its tests. The same checkbox sits under a `resoluble` tree referral (`toggleDerivacionArbolResuelta`, `phase4.js`); a new answer on that step forgets the mark. Marking never hides a phase 2 urgency.
- **Trauma questions** (`notaPosquirurgica: true`: `h_t1`, `co_t1`, `co_t2`, `ro_t2`–`ro_t4`, `tp_t1`, `cv_ar3`; unit test pins the list): a `.nota-posq.solo-posq` line under the question, logic unchanged.
- **Pending (decision 2)**: the phase 2 post-surgical screening system (`SIS_POSQUIRURGICO`: wound, DVT, PE, compartment syndrome, CRPS, new neurological deficit) waits for the Goodman chapters the user will supply and their clinical review — no code yet.

## Informe narrativo con IA (standalone)

Only when the app runs **outside the hub** (`body:not(.in-hub)`): at the end of phase 5, `buildResults()` calls `_montarInformeIA()`, which `import()`s `informe-ia.js` and paints the card into `#informeIA`. In the hub it returns before the import (unit test), so the module is never even downloaded — there the narrative report is physiq-report's job. physiq-report itself is **not** modified: the card calls the existing orchestrator route `POST /` of the worker that lives in physiq-report's `workers/` (`ORCHESTRATOR_URL`), exactly as physiq-report does.

- **Licence** (`lib/licencia-ia.js`, shared with the recorder): at startup, `GET /validate` with `localStorage['physiq-license-key']` (the key the hub saves; shared per origin). The worker decides the mode, never the client: unless `routes.report === 'real'` the card is disabled («Disponible con licencia PhysiQ») with an «Introducir clave» link — the typed key is validated first and only stored if the worker says `real` (a bad key never overwrites the hub's). `demoOnly` → «desactivada temporalmente». When `/validate` gives no usable answer the card says «No se ha podido comprobar la licencia» plus the reason (`detalleLicencia()`): timeout, offline, HTTP 429/5xx (an error status is never read as «sin licencia»), or — since a failed `fetch` can't tell a blocker from a worker error without CORS headers — a second `mode: 'no-cors'` probe without the key: reachable → «el servidor responde, pero con un error», unreachable → blocker/network. One automatic retry after 1.5 s before showing it. A generation response with `X-PhysiQ-Mode: demo` is **discarded** and the card goes back to «sin licencia»: the worker's demo fixture is a fictional patient and must never sit next to a real assessment.
- **Turnstile** (required by the worker in real mode): script loaded only by this card, only once licensed (`?render=explicit`), same sitekey as physiq-report; one token per request, reset after use. `challenges.cloudflare.com` is network-only in `sw.js`.
- **Audio** (optional): recorded from the **header**, in any phase, since the consultation happens in phases 1–4b (`grabadora.js`, `#grabBtn` in `.header-right`; shown only with `body.ia-licencia`, or `body.grab-activa` while a recording runs). Kept in the header on purpose, not as a floating widget like the hub's: on mobile any floating position covers assessment content. One session = one recording, so there is **no manual «Parar»**: with no audio one tap starts recording; while recording it is a pill «● 12:34» / «⏸ 12:34» where **a tap pauses/resumes** (no menu) and **a long press** (`LARGO_MS` 600 ms, with a fill as feedback, `navigator.vibrate`, the OS context menu suppressed) asks to discard (`showConfirmBanner`, so an accidental long press deletes nothing); with a mouse (`@media (hover: hover) and (pointer: fine)`) a trash icon `#grabDescBtn` next to the pill does the same, and the first pause on touch shows the toast «mantén pulsado para descartar». The pause is made very visible (orange tint, blinking ⏸) and calls `requestData()` so what was recorded reaches IDB at once. The recording **closes itself** (and becomes the session audio): when «Generar informe» is pressed (`cerrarGrabacion()`, awaited by `iaGenerar`), at the 25 MB cap, when the system ends the mic track, and after `PAUSA_MAX_MS` (20 min) paused, to release the mic if the consultation ended without generating; the menu then says why (`_cierre`: `corte` marks the button orange, `pausa`/`tope` add a note). With a closed audio it shows a green dot and the menu offers «Ir al informe →» and «Descartar» (confirmation). The phase 5 card has no record or stop button: it shows the recording in progress (closed and used on «Generar»), the finished audio («Descartar audio»), or «📎 Adjuntar audio»; the consent checkbox already shows while recording, tied to `idAudio()` (same id while recording and once closed; a new recording or file needs consent again). `MediaRecorder` ~32 kbps, webm/mp4 as the browser supports, wake lock while recording; max 25 MB (Whisper). Chunks go to IDB every 10 s (`lib/audio-store.js`), so a reload doesn't lose it — it comes back as «(recuperado)». Guards: `beforeunload` warning while recording; a mic track `ended` by the system (call, iOS lock, another app) closes the recording keeping what was recorded and marks the button orange with an explanation in the menu, `mute` shows «⚠ Sin señal» (plus a toast); size-based (not time-based: iOS may ignore the bitrate) warning at 20 MB and automatic close just under 25 MB. Deleted once the report is generated, on «Quitar», and on the two resets **confirmed on this device** (`resetApp()` and «Borrar sesión», whose confirmation texts mention the audio — `_avisoAudioSesion()`); never from `_softResetApp()` itself, which also runs for resets relayed from another tab (unit test).
- **Consent**: with audio, a mandatory checkbox («El paciente ha sido informado y consiente…») — not persisted, asked again for every audio. A privacy note above the button says data and audio go to OpenAI and Anthropic through PhysiQ's server.
- **Prompt** (`PLANTILLAS` in `lib/informe-narrativo.js`): two templates, like physiq-report — **Narrativo** (`buildNarrativePrompt`, `MAX_TOKENS_INFORME` 7000 / `PALABRAS_INFORME` 2000, last section `SEGUIMIENTO FUNCIONAL`) and **Ficha breve** (`buildFichaBrevePrompt`, 2500 / 550, three sections ending in `OBJETIVOS Y PLAN`). A selector above the audio picks one; the default follows the consultation type (`plantillaPorDefecto(state.modo)`: ficha in modo breve), a manual choice lasts until reload; `informeTruncado(texto, plantilla)` checks that template's last section. Both are **adapted copies** of physiq-report's prompts (same CIF structure, sections and tone; report = clinical documentation, not the patient/GP «📄 Informe»). Differences, all deliberate: no «already in the document header» rule (here the identification is added locally by `textoParaCompartir()`), no blocks from other apps (except `rom` if present), fixed length, explicit instruction when there is no audio, shared `REGLAS_COMUNES` (describe only the tests done; a prognostic rule such as Flynn is never used as diagnostic support; what wasn't explored is said **once**; discrepancies: the clinician's results and classifications prevail, and when what the patient reports differs between the pre-visit form and the consultation both versions are stated once, neutrally, never silently picking one; never name the data sources («transcripción», «formulario», «PhysiQ»…); the plan follows PhysiQ's pauta without other doses, «Derivar» means the plan is referral; follow-up uses the recommended scale) and `reglaDerivacion()` (a referral is stated **once**, at the start of the plan section; for a non-urgent one the report presents the physio plan and doesn't decide whether to wait for the doctor unless the clinician said so), CIF codes only in the ficha (cap ~6, «better omit than guess»; the narrativo uses CIF terminology without codes — it ignored a cap and misapplied them), no fixed «Diagnóstico médico: no aportado» (the narrative's «Condición de Salud» subsection only appears when a medical diagnosis, surgery or imaging is mentioned), a narrative structure adapted to an initial assessment (no cardiorrespiratoria / control motor / equilibrio / scale examples such as 6MWT or EQ-5D, which only produced «no se realizó…» filler; optional subsections marked «[solo si…]» are dropped with their title; «Cribado de Seguridad» and «Pruebas Clínicas» subsections), rules against score jargon (no LR, weights or «X/Y hallazgos»), against transcribing the pre-visit answers question by question («contestó», «no sabría decir»), against invented sections and cross-references, and «Derivar» hypotheses are still referred when their clinical tests are negative (they don't rule out a fracture/dislocation/rupture) unless the clinician says otherwise, each datum assigned to one narrative section (intensity/irritability only in «Dolor», aggravating activities only in «Limitaciones», what rules out another region only in «Pruebas Clínicas», the no-improvement re-evaluation/referral criterion only in «Seguimiento»), «No sé»/«No sabría decir» answers omitted and never turned into a negation, no negatives the data doesn't contain, no speculation in «Restricciones», and coherence saying a «Derivar» hypothesis with negative checks is not supported but not ruled out, token ceilings well above the word budget (only there to avoid truncation; length is set by the word instruction), and a richer data block: `ur`/`dv` (referrals must appear), `fp`, vitals, modo breve — while hypotheses go **without** their phase 4b score label (`sc`), on-screen labels are cleaned by `limpiarEtiqueta()` («(→ Rx)», «①/②» removed, «A → B» → «A — orienta a: B»), IMC is rounded to one decimal, the «Gesto testigo (①) y medida objetiva (②)» item goes as a follow-up reference measure without a result (`referencia: true` in `construirAmpliado()`), the tests of a `DOSIS_DERIVAR` hypothesis are introduced as checks that don't rule it out (`derivar: true`; h11's items «Rx antes de nada», «Luxación bloqueada», «Fractura» are instructions rather than tests — pending a content review of `data/hombro.js`), plan notes only when they have text, and block names avoid «árbol» / «razonamiento clínico» / «formulario» so the model doesn't quote them — plus **datos ampliados** that `buildPhysiQPayload()` doesn't carry (and must not: it's physiq-report's contract, unit test) — `construirAmpliado()` (`informe-ia.js`) reads them from `state` and `bloquesAmpliados()` writes them, each block only when it has data: age, comparable sign, stability, irritability matrix (not when picked directly), detailed psychosocial answers (only with risk Alto), `criterioCompuesto` met (same rule as `evaluarCriterioCompuesto`), CIF tree path (question → option label), phase 4b tests done (pos/neg only, with cluster and «regla pronóstica»), and per active hypothesis the pauta (`dosis`/`DOSIS_DERIVAR`), `dosisFuente`, `pronostico` and `prom`. **Nothing keeps the copies in sync** (different repos): if physiq-report's prompts change, update `lib/informe-narrativo.js` by hand — its header lists the source of each piece.
- **Errors from the APIs**: the worker forwards them as «Whisper: …» (OpenAI) or «Claude: …» (Anthropic), in English. `errorLegible()` (`lib/informe-narrativo.js`) maps them by keyword families — no saldo/cuenta, clave inválida, saturado, audio no válido (Whisper only), servicio caído — to a Spanish message naming the service, with a generic per-service fallback; messages without that prefix are our own and pass unchanged. The card keeps it on screen (`#iaError`, until the next attempt or a reset) with the original text below, and for a transcription failure suggests generating without audio (the audio is kept). Unit-tested with the real API messages.
- **Result**: streamed (SSE `transcript` → `report_chunk` → `done`); while generating, the card shows a progress line (words, current section) and a closed «Ver mientras se escribe» `<details>` (no inner scroll box on mobile). Saved in `state.informeIA` (with `plantilla`; persisted with the session like everything else — i.e. only when there's a patient name), rendered folded: a `<details id="iaResultadoDet">` whose summary shows template, date, con/sin audio and word count, with the escaped HTML report and the transcript (closed `<details>`) inside; truncation/huella warnings and the actions stay outside, always visible: and «📤 Compartir» (`navigator.share`, clipboard fallback) / «Copiar» as plain text with a local header (patient, date, age, region) and a «redacción asistida por IA» footer. `huella` (FNV of the payload plus the datos ampliados, minus the date) shows «La valoración ha cambiado desde que se generó este informe» when phase 1–5 data changes afterwards. Never part of `buildPhysiQPayload()`, `📋 Notas` or `📄 Informe` (unit test).
- Tests: `tests/unit.js` («informe narrativo») covers the pure functions and the guarantees above (`tests/dom-shim.mjs` stubs `fetch` so the startup licence check never hits the network); `tests/smoke.mjs` runs the whole card with the worker and Turnstile mocked by `page.route` (no API cost), records from the header with Chromium's fake microphone across all phases (touch: tap/long press; mouse: trash; «Generar» closes and uses the recording), and checks that inside an iframe none of these modules is requested. Not automatable: a real phone microphone, iOS/mp4, the system interrupting the mic, and the 20-min pause close — test those by hand.

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

**Fase F — physiological rationale for phase 2 screening questions** (`razonamiento` field: inline «¿Por qué?» + detail in a side panel on desktop / bottom sheet on mobile; sources Goodman + StatPearls + Finucane/Rushton/Cochrane/NICE; clinical review by the user before `main`). Also one region per session: read `docs/razonamiento-cribado.md` in full and the Fase F table in `MIGRATION_PLAN.md` before starting. Implemented: optional `razonamiento: { porque, peso, detalle?, fisiologia?, fuentes, citas? }` on any phase 2 question (`fisiologia: { pasos, nota?, metafora? }` = «Fisiología, paso a paso» in the detail panel; a citation may be `{ texto, url }`, with `url` equal to the registry's) (`fuentes` = keys of `data/referencias.js`, counted by `tests/referencias.mjs` as «razonamiento fase 2»; `citas` = full citation with chapter/pages, each starting with its key). Rendered by `razonamientoInlineHTML()` in `buildSistemaHTML()` (`app.js`) as a closed `<details class="razon">`; «Ampliar →» calls `abrirRazonamiento(btn, sisId, qId)`, which fills `#razonPanel` (`index.html`): a side panel without scrim on desktop, a bottom sheet with `--scrim` on mobile (pushes a history entry so Back closes it, hides the hub widget). Never part of the payload or the summaries (unit test).

## Sibling repos

The hub at `physiodevapp.github.io/physiq/` is the primary entry point for the ecosystem.

| Repo | Hub path | Role |
|------|----------|------|
| physiq-motion | /physiq/motion/ | Joint ROM measurement |
| physiq-report | /physiq/report/ | Audio transcription + Claude report generation |
