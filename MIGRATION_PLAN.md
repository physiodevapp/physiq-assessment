# Plan de migración: SPA modular (Fase A) + inputs mobile-friendly (Fase B)

Este documento es una checklist viva para completar en sesiones sucesivas de Claude Code. Marcar los pasos conforme se completen y añadir notas de decisiones o problemas encontrados directamente bajo cada fase.

**Contexto y restricción no negociable:** physiq-assessment sigue siendo un satélite embebido vía iframe en el hub PhysiQ (ver sección "Hub integration" en `CLAUDE.md`). Ningún paso de este plan debe romper ese contrato: detección de iframe (`.in-hub`), `postMessage` al padre, mensajes de `BroadcastChannel('physiq-session')`, ni el pipeline `deploy-to-hub.yml` (que sigue copiando ficheros estáticos sin build step). "SPA" aquí se refiere solo a cómo se organiza el código *dentro* del iframe, no a cómo se integra con el hub.

Orden recomendado: **Fase B primero** (bajo riesgo, sin impacto arquitectónico), luego **Fase A** (más extensa, tocar los 4 ficheros a la vez).

---

## Fase A — Migración a ES Modules (sin build step)

Objetivo: reorganizar `app.js` / `phase4.js` / `phase4b.js` / `data.js` en módulos ES explícitos (`import`/`export`) en lugar de variables globales compartidas, sin introducir bundler ni dependencias.

- [ ] Revisar cómo carga `tests/unit.js` los ficheros actuales (globals vs `require`) y planear su adaptación a ESM antes de tocar código fuente.
- [ ] `data.js`: añadir `export` a `SYSTEMIC_SCREENING`, `CIF_TREES`, `HYPOTHESES`.
- [ ] `phase4.js`: `import { CIF_TREES } from './data.js'`; exportar `initCIFTree`, `renderStep`, `selectTreeOption`, `pruneTreeFrom`, `rebuildHypotheses`, `checkTreeComplete`, `showTreeComplete`.
- [ ] `phase4b.js`: `import { HYPOTHESES } from './data.js'`; exportar `buildHypothesisCards`, `setTestResult`, `calcLRScore`, `recalcHypScore`.
- [ ] Extraer `state` a un módulo propio (`state.js`) importado por todos, en vez de variable global implícita.
- [ ] `lib/session.js`: confirmar que exporta `writeSession`, `readSession`, `clearSession`; importarlos explícitamente donde se usan.
- [ ] `app.js` pasa a ser el módulo raíz: importa del resto, mantiene `saveSession`, `showConfirmBanner`, `paintNav` y el bootstrapping/listeners de eventos.
- [ ] `index.html`: sustituir los 4 `<script>` por uno solo, `<script type="module" src="./app.js"></script>`.
- [ ] Adaptar `tests/unit.js` al nuevo esquema de módulos; `node tests/unit.js` debe seguir pasando.
- [ ] Probar en local (`npx serve .`) y, crítico, **embebido en el iframe del hub** (physiodevapp/physiq) antes de cerrar la fase — verificar que `.in-hub`, `postMessage`, y los mensajes de `BroadcastChannel` se comportan igual que antes.
- [ ] Confirmar que `deploy-to-hub.yml` no necesita cambios.

**Notas / decisiones:** _(vacío por ahora)_

---

## Fase B — Inputs de texto mobile-friendly

Objetivo: reducir la dependencia del teclado físico en los campos de texto libre en móvil, sin eliminar la opción de escribir a mano.

Campos afectados: `#motivoConsulta`, `#signoComparable` (fase 3), y las notas de plan en fase 5 (`variableControl`, `ventanaRecuperacion`, `anclajeHabito`).

- [ ] Añadir una sección `QUICK_PHRASES` (o nombre similar) en `data.js` con frases clínicas predefinidas por campo/contexto — mantiene la separación contenido/lógica del proyecto.
- [ ] Componente de "chips" reutilizando el estilo visual de `.option-btn`: tocar un chip inserta/añade texto en el campo; el texto sigue siendo editable después.
- [ ] Botón de dictado por voz junto a cada campo de texto libre, usando `SpeechRecognition`/`webkitSpeechRecognition` (API nativa del navegador, sin dependencias nuevas), con fallback silencioso si no está soportado (Safari/iOS tiene soporte limitado).
- [ ] Aplicar a los 5 campos listados arriba.
- [ ] CSS: variante "chip" en fila con scroll horizontal, sin invadir el espacio vertical del layout móvil de cada fase.
- [ ] Probar en dispositivo móvil real (o emulación de Chrome DevTools) el flujo completo intentando no usar el teclado físico.

**Notas / decisiones:** _(vacío por ahora)_

---

## Fuera de alcance de este plan

Se discutió también **aislar el motor de fase 4/4b de los datos clínicos** (esquema documentado + validación runtime + tests de regresión del motor, para que añadir nuevos tests/criterios sea solo editar `data.js` sin riesgo de romper `phase4.js`/`phase4b.js`). Queda pendiente de decisión; retomar como Fase C si se decide abordarla.
