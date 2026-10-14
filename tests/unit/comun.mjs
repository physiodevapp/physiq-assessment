// Común a tests/unit/*.mjs: shims del DOM, módulos reales de la app, el
// mini-runner y los ayudantes que usan varios temas. Lo importa cada tema;
// el orden y el resumen los lleva tests/unit.js.
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import '../dom-shim.mjs';
export { assert, readFileSync, existsSync, readdirSync, execFileSync, createHash, join };

export const TESTS = join(dirname(fileURLToPath(import.meta.url)), '..');   // tests/
export const RAIZ = join(TESTS, '..');                                        // raíz del repo
export const leer = (...ruta) => readFileSync(join(RAIZ, ...ruta), 'utf8');

// Real ES modules, loaded only after the shims above are in place — app.js,
// phase4.js and phase4b.js touch `document`/`window` at module top level
// (e.g. app.js's _initHubIntegration() call).
export const { HYPOTHESES, SYSTEMIC_SCREENING, CIF_TREES, DOSIS_DERIVAR, TIEMPOS_TEJIDO } = await import('../../data.js');
export const { calcLRScore, parseLR, testPuntua, etiquetaHipHTML, pesoTest, PESO_TEST, buildTestItem, lrEfectiva, fuenteCorta, claveRegistro, enlaceCita, citasTest } = await import('../../phase4b.js');
export const { buildPhysiQPayload, buildInformeFisioterapiaText, getSistemicoAffirmativeTexts, precargarFormularioPrevio,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML } = await import('../../app.js');
export const { state } = await import('../../state.js');
export const { rebuildHypotheses, pruneTreeFrom, resolveOptionTargets } = await import('../../phase4.js');
// Se importa aquí, antes de que ningún test toque `state`: guarda el estado
// recién cargado como punto de partida de cada revisión («informes reales»).
export const { revisarArchivos, formatearPuntos } = await import('../../tools/revisar-informe.mjs');

// ── Test runner ───────────────────────────────────────────────────────────────
export const cuenta = { passed: 0, failed: 0 };
export function test(name, fn) {
  try   { fn(); console.log(`  ✓ ${name}`); cuenta.passed++; }
  catch (e) { console.error(`  ✗ ${name}\n    ${e.message}`); cuenta.failed++; }
}

// ── Estado de partida (lo usan payload, cribado, razonamiento, informe…) ───────
export const BASE_STATE = {
  modo:             'completo',
  sistemicoBreve:   {},
  irritabilidadDirecta: false,
  maxVisitedIdx:    5,
  patient:          'Juan García',
  region:           'hombro',
  motivoConsulta:   'Dolor hombro derecho',
  mecanismo:        'Insidioso',
  cronologia:       'Crónico (>3 meses)',
  riesgoPsico:      'Bajo',
  severidad:        7,
  irritabilidadNivel: 'Moderada',
  naturaleza:       'Mecánica',
  sistemicoAlerta:  false,
  banderasRojas:    { br1: 'NO', br2: 'NO', br3: 'NO', br4: 'NO' },
  sistemicoAnswers: {},
  activeHypotheses: ['h2'],
  hypothesisScores: { h2: { totalLR: 3.7, label: '🟠 Peso moderado (LR× 3.7)', colorClass: 'hyp-orange' } },
  testResults:      { h2: { 0: 'pos', 1: 'neg' } },
  planNotes:        { variableControl: '', ventanaRecuperacion: '', anclajeHabito: '' },
  cirugia:          { intervencion: '', fecha: '', semanasAprox: null, protocolo: '', restricciones: '', complicaciones: [], complicacionOtra: '' },
  derivacionResuelta: {},
  sintomaPrincipal: { zonas: [], zonaLibre: '', lado: '', otraRegion: false, profundidad: '', patron: '', descripcion: '', nrs: null, irritabilidad: '', relacion: '' },
  sintomasSecundarios: [],
};

export function withState(patch, fn) {
  Object.assign(state, { ...BASE_STATE, ...patch });
  fn();
}

export const VALID_REGIONS = ['hombro', 'cadera', 'cervical', 'lumbar', 'rodilla', 'codo', 'tobillo_pie'];
