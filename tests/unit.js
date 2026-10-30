'use strict';
// Tests unitarios: `node tests/unit.js`. Cada tema está en tests/unit/<tema>.mjs
// (con lo común en tests/unit/comun.mjs); aquí solo se cargan en orden —el de
// la salida— y se imprime el resumen. Un tema nuevo: su archivo y una línea abajo.
import { cuenta } from './unit/comun.mjs';

for (const tema of [
  'puntuacion.mjs',
  'payload.mjs',
  'datos.mjs',
  'formulario.mjs',
  'cribado.mjs',
  'razonamiento.mjs',
  'informe-ia.mjs',
  'lado-y-exportar.mjs',
  'posquirurgico.mjs',
  'hipermovilidad.mjs',
  'disautonomia.mjs',
  'lupus.mjs',
  'mastocitos.mjs',
  'osteoporosis.mjs',
  'embarazo.mjs',
  'anticoagulado.mjs',
  'condiciones.mjs',
  'farmacos.mjs',
  'ejercicio.mjs',
  'farmacos-paciente.mjs',
  'fase5-y-version.mjs',
  'revision-informe.mjs',
  'verificacion.mjs',
  'tejidos.mjs',
  'anatomia.mjs',
  'cuestionarios.mjs',
  'lector-cuestionarios.mjs',
  'irritabilidad.mjs',
  'plan-tratamiento.mjs',
  'plan-ia.mjs',
  'sintomas.mjs',
  'citas.mjs',
  'silueta.mjs',
  'guia.mjs',
  'modo-guia.mjs',
]) await import(`./unit/${tema}`);

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${cuenta.passed + cuenta.failed} tests: ${cuenta.passed} passed, ${cuenta.failed} failed\n`);
if (cuenta.failed > 0) process.exit(1);
