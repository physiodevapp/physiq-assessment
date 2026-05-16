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

There are no linting, test, or compilation commands.

## File Architecture

All source lives in the project root — there are no subdirectories.

| File | Role |
|------|------|
| `index.html` | DOM structure + all embedded CSS (2,200+ lines) |
| `app.js` | Application state, navigation logic, event handlers, UI rendering |
| `data.js` | All clinical content: screening systems, ICF trees, hypotheses, LR± values |
| `physiq-v-standalone.html` | Self-contained offline version (inline JS+CSS) for tablet distribution |

### Internal structure of `physiq-v-standalone.html`

```
physiq-v-standalone.html  (~5262 lines)
├── L1–220      Head + imports (Google Fonts: Outfit, DM Serif Display, DM Mono)
├── L220–1700   Full CSS (variables, components, responsive)
├── L1700–3806  HTML for all 6 phases + nav + contextual banners
├── L3807–3856  Global `state` object declaration
├── L3857–4108  Navigation, phases, data collection
├── L4109–4563  Phase 2: systemic screening, accordions, observers
├── L4564–4748  Phase 4: CIF tree, renderStep, prune, rebuild
├── L4749–4950  Phase 4b: hypothesis cards, test results, scores
├── L4951–5131  Phase 5: buildSummary (full summary render)
└── L5132–5262  Mobile nav, confirm dialogs, DOMContentLoaded
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

> **Note:** There is no `patient` field in the current state — Phase 1 does not collect patient name. If needed for export payloads, add a `patient` field to state and an input in the Phase 1 UI.

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

The `physiq-v-standalone.html` file must be kept in sync with `index.html` + `app.js` + `data.js` when significant features change, as it is the offline distribution version.

## Planned Integration: Export to PhysiQ

At the end of Phase 5, add a **"Generar informe CIF-AFTA"** button that opens the PhysiQ report app with assessment data pre-loaded via URL param (`?v=<base64>`).

**Target:** `https://physiodevapp.github.io/physiq-report/`

### Functions to implement

**`buildPhysiQPayload()`** — builds the minimum payload from state:

```js
function buildPhysiQPayload() {
  return {
    p:  state.patient ?? '',
    r:  state.region,
    d:  new Date().toLocaleDateString('es-ES'),
    mo: state.motivoConsulta,
    me: state.mecanismo,
    cr: state.cronologia,
    rp: state.riesgoPsico,
    nr: state.severidad ?? 0,
    ir: state.irritabilidadNivel,
    na: state.naturaleza,
    si: state.sistemicoAlerta,
    br: Object.values(state.banderasRojas).includes('SI'),
    h:  state.activeHypotheses.map(id => ({
          id,
          name: HYPOTHESES[id]?.name ?? id,
          sc:   state.hypothesisScores[id]?.label ?? 'Sin evaluar',
          lr:   state.hypothesisScores[id]?.totalLR ?? null,
          tr:   state.testResults[id] ?? {}
        })),
    pn: state.planNotes
  };
}
```

**`exportToPhysiQ()`** — encodes and opens PhysiQ:

```js
function exportToPhysiQ() {
  const payload = buildPhysiQPayload();
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  window.open(`https://physiodevapp.github.io/physiq-report/?v=${encoded}`, '_blank');
}
```

**`copyContextToClipboard()`** — plain-text fallback:

```js
function copyContextToClipboard() {
  const d = buildPhysiQPayload();
  const hyps = (d.h || []).map(h => `  · ${h.name} — ${h.sc}`).join('\n');
  const text = `VALORACIÓN PhysiQ-V
Región: ${d.r} · NRS: ${d.nr}/10 · Irritabilidad: ${d.ir}
Cribado sistémico: ${d.si ? 'POSITIVO ⚠️' : 'Negativo'}
Hipótesis:
${hyps}
Variable control: ${d.pn?.variableControl || '—'}
Ventana recuperación: ${d.pn?.ventanaRecuperacion || '—'}
Anclaje hábito: ${d.pn?.anclajeHabito || '—'}`;
  navigator.clipboard.writeText(text).then(() => {
    showCopyFeedback();
  });
}
```

### Where to add the buttons (Phase 5)

At the end of `buildSummary()` (~L4951 in standalone), after the plan notes block and before the timestamp:

```js
container.innerHTML += `
<div style="margin-top:1.5rem; display:flex; flex-direction:column; gap:10px;">
  <button class="btn btn-primary" onclick="exportToPhysiQ()" style="background:linear-gradient(135deg,#4fc3a1,#3db38d);">
    📋 Generar informe CIF-AFTA en PhysiQ
  </button>
  <button class="btn btn-secondary" onclick="copyContextToClipboard()" style="font-size:0.85rem;">
    📋 Copiar contexto clínico
  </button>
</div>`;
```

> **Verification:** test payload size in DevTools: `btoa(unescape(encodeURIComponent(JSON.stringify(buildPhysiQPayload()))))` — target < 4 KB.

### Pending integration tasks

- [ ] Add `patient` field to `state` and an input in the Phase 1 UI
- [ ] Implement `buildPhysiQPayload()` in the main JS block
- [ ] Implement `exportToPhysiQ()` with the correct physiq-report URL
- [ ] Implement `copyContextToClipboard()` with visual feedback (`showCopyFeedback`)
- [ ] Add the two buttons at the end of `buildSummary()` in Phase 5
- [ ] Verify `buildSummary()` is called with complete state before rendering the buttons
- [ ] Test payload in Chrome DevTools and verify size < 4 KB
