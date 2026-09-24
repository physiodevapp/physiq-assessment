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

- [x] Añadir una sección `QUICK_PHRASES` (o nombre similar) en `data.js` con frases clínicas predefinidas por campo/contexto — mantiene la separación contenido/lógica del proyecto.
- [x] Componente de "chips" reutilizando el estilo visual de `.option-btn`: tocar un chip inserta/añade texto en el campo; el texto sigue siendo editable después.
- [x] Botón de dictado por voz junto a cada campo de texto libre, usando `SpeechRecognition`/`webkitSpeechRecognition` (API nativa del navegador, sin dependencias nuevas), con fallback silencioso si no está soportado (Safari/iOS tiene soporte limitado).
- [x] Aplicar a los 5 campos listados arriba.
- [x] CSS: variante "chip" en fila con scroll horizontal, sin invadir el espacio vertical del layout móvil de cada fase.
- [ ] Probar en dispositivo móvil real (o emulación de Chrome DevTools) el flujo completo intentando no usar el teclado físico.

**Notas / decisiones:**
- Implementado en `app.js` (`renderQuickInputBar`, `injectQuickInputBar`, `initQuickInputBars`, `appendQuickPhrase`, `toggleDictation`), `data.js` (`QUICK_PHRASES`) y `styles.css` (`.quick-input-bar`, `.chip-row`, `.chip-btn`, `.mic-btn`).
- `motivoConsulta` y `signoComparable` son estáticos en `index.html`; la barra de chips/mic se inyecta en `DOMContentLoaded` vía `initQuickInputBars()` (evita duplicar contenido en el HTML estático). Los 3 campos de notas de plan (fase 5) se generan dinámicamente en `buildResults()`, así que ahí se invoca `renderQuickInputBar(fieldId)` directamente en el template.
- Insertar un chip o dictar despacha un evento `input` nativo sobre el `<textarea>`, así que el `oninput` existente de cada campo (que actualiza `state` y llama `saveSession()`) se dispara sin duplicar lógica — ningún campo necesitó tocarse dos veces.
- El botón de micrófono solo se renderiza si `window.SpeechRecognition || window.webkitSpeechRecognition` existe en tiempo de render (fallback silencioso real: el botón ni aparece en navegadores sin soporte, en vez de aparecer y fallar al pulsar).
- Verificado con Playwright (Chromium headless) contra `npx serve .`: los 5 campos renderizan sus chips, el click en un chip actualiza el `<textarea>` y el `state` correspondiente (incluido `state.planNotes.*`), y el layout se ve correcto en viewport móvil (420px). Pendiente solo la prueba manual en dispositivo/DevTools real mencionada arriba.
- Dictado por voz: en pruebas reales en Android, el motor de reconocimiento del dispositivo no da una entrada nueva por palabra — cada resultado "final" repite la frase completa dicha hasta el momento (`"esto"`, `"esto es"`, `"esto es una"`, ...). `onresult` no debe sumar entradas de `e.results` (ni por `resultIndex` ni recorriendo todo el array); solo debe mirar la última entrada de cada evento y compararla, palabra a palabra, con lo ya mostrado — si la extiende, sustituye; si es una frase distinta, añade. Ver `toggleDictation` en `app.js`.
- Chips: cada chip se deshabilita (`.used`, atenuado) en cuanto su frase ya está presente en el campo (evita duplicar si se toca dos veces o si el dictado ya insertó lo mismo), y se reactiva si el usuario borra esa frase. Cuidado si se vuelve a tocar `buildResults()`: cualquier `container.innerHTML += ...` posterior a donde se engancha el listener de sincronización lo destruye (reparsea y reconstruye el subárbol) — el enganche debe ir siempre después del último `innerHTML +=` de la función.

---

## Fuera de alcance de este plan

Se discutió también **aislar el motor de fase 4/4b de los datos clínicos** (esquema documentado + validación runtime + tests de regresión del motor, para que añadir nuevos tests/criterios sea solo editar `data.js` sin riesgo de romper `phase4.js`/`phase4b.js`). Queda pendiente de decisión; retomar como Fase C si se decide abordarla.
