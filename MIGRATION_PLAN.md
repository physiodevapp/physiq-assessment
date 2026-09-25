# Plan de migración: SPA modular (Fase A) + inputs mobile-friendly (Fase B)

Este documento es una checklist viva para completar en sesiones sucesivas de Claude Code. Marcar los pasos conforme se completen y añadir notas de decisiones o problemas encontrados directamente bajo cada fase.

**Contexto y restricción no negociable:** physiq-assessment sigue siendo un satélite embebido vía iframe en el hub PhysiQ (ver sección "Hub integration" en `CLAUDE.md`). Ningún paso de este plan debe romper ese contrato: detección de iframe (`.in-hub`), `postMessage` al padre, mensajes de `BroadcastChannel('physiq-session')`, ni el pipeline `deploy-to-hub.yml` (que sigue copiando ficheros estáticos sin build step). "SPA" aquí se refiere solo a cómo se organiza el código *dentro* del iframe, no a cómo se integra con el hub.

Orden recomendado: **Fase B primero** (bajo riesgo, sin impacto arquitectónico), luego **Fase A** (más extensa, tocar los 4 ficheros a la vez).

---

## Fase A — Migración a ES Modules (sin build step)

Objetivo: reorganizar `app.js` / `phase4.js` / `phase4b.js` / `data.js` en módulos ES explícitos (`import`/`export`) en lugar de variables globales compartidas, sin introducir bundler ni dependencias.

- [x] Revisar cómo carga `tests/unit.js` los ficheros actuales (globals vs `require`) y planear su adaptación a ESM antes de tocar código fuente.
- [x] `data.js`: añadir `export` a `SYSTEMIC_SCREENING`, `CIF_TREES`, `HYPOTHESES` (y también `PHASE_DEFS`, `NRS_LABELS`, `NRS_CLASSES`, `QUICK_PHRASES`, que también se comparten entre ficheros).
- [x] `phase4.js`: `import { CIF_TREES, HYPOTHESES } from './data.js'` (`HYPOTHESES` hacía falta también, para `showTreeComplete`); exportar `initCIFTree`, `renderStep`, `selectTreeOption`, `pruneTreeFrom`, `rebuildHypotheses`, `checkTreeComplete`, `showTreeComplete` (y `restoreCIFTree`, `resetCIFTree` de paso, para una API de módulo completa).
- [x] `phase4b.js`: `import { HYPOTHESES } from './data.js'`; exportar `buildHypothesisCards`, `setTestResult`, `calcLRScore`, `recalcHypScore` (y el resto de funciones del fichero).
- [x] Extraer `state` a un módulo propio (`state.js`) importado por todos, en vez de variable global implícita.
- [x] `lib/session.js`: confirmar que exporta `writeSession`, `readSession`, `clearSession`; importarlos explícitamente donde se usan (también `updateSession`, usado en `app.js`).
- [x] `app.js` pasa a ser el módulo raíz: importa del resto, mantiene `saveSession`, `showConfirmBanner`, `paintNav` y el bootstrapping/listeners de eventos.
- [x] `index.html`: sustituir los 4 `<script>` por uno solo, `<script type="module" src="./app.js"></script>`.
- [x] Adaptar `tests/unit.js` al nuevo esquema de módulos; `node tests/unit.js` debe seguir pasando.
- [x] Probar en local (`npx serve .`) y, crítico, **embebido en el iframe del hub** (simulado con un iframe local) antes de cerrar la fase — verificado que `.in-hub`, `postMessage`, y la navegación por fases se comportan igual que antes.
- [x] Confirmar que `deploy-to-hub.yml` no necesita cambios (sigue copiando ficheros estáticos tal cual — el nuevo `package.json`/`state.js` se copian igual que cualquier otro fichero).

**Notas / decisiones:**
- **El hallazgo más importante de la fase, no anticipado por el checklist original:** decenas de atributos `onclick`/`oninput` inline (en `index.html` y en HTML generado dinámicamente por `app.js`/`phase4.js`/`phase4b.js`) referencian funciones y `state` directamente por nombre. Esos atributos los resuelve el navegador contra el **scope global**, nunca contra el scope privado de un módulo — así que convertir estos ficheros en módulos ES reales (`type="module"`) rompía silenciosamente los ~35 nombres referenciados así (`selectOption`, `goToPhase`, `setTestResult`, `state`, etc.), sin ningún error visible más allá de "el botón no hace nada". Solución: cada fichero, además de sus `export`, también hace `window.x = x` (o `Object.assign(window, {...})`) para esos nombres concretos, en un bloque al final comentado `// Exposed for inline onclick...`. `state.js` hace lo mismo con `window.state = state`. Esto significa que la modularización es "interna" (dependencias explícitas vía `import`/`export` entre ficheros) pero el árbol de eventos inline sigue apoyándose en globals explícitos — reescribir los ~35 `onclick=` a `addEventListener` habría sido un cambio de alcance mucho mayor, no descrito en este plan, y no se ha hecho.
- Se auditó exhaustivamente con `grep` cada `onclick=`/`oninput=`/`onchange=` de los 4 ficheros (estático y generado dinámicamente) para construir la lista completa antes de tocar código — ver el propio historial de commits de esta fase para el detalle exacto por fichero.
- Dependencia circular intencional: `app.js` importa `initCIFTree` de `phase4.js` y `buildHypothesisCards`/`teardownHypObserver`/`restoreHypObserver` de `phase4b.js`; `phase4.js`/`phase4b.js` importan `state`, `saveSession`, `showConfirmBanner` (y `paintNav`, solo `phase4.js`) de vuelta desde `app.js`. Es seguro porque ninguna de esas referencias se invoca en tiempo de evaluación del módulo, solo dentro de manejadores de eventos que se disparan después de que todo el grafo de módulos ya ha terminado de cargar.
- El `<script>` inline al final de `index.html` (detección de iframe del hub, `postMessage`, reconstrucción del historial al reaparecer) se trasladó a `app.js` como `_initHubIntegration()`, porque leía y escribía `_historyDepth`/`_pendingBackNav` — variables privadas del módulo que, de haberse quedado en un `<script>` aparte, habrían necesitado exponerse también en `window`, con riesgo real de desincronización entre "la copia de `window`" y "la copia interna de `app.js`".
- `tests/unit.js` se reescribió para usar `await import('../fichero.js')` en vez de `vm.runInContext` + un helper `run('código como string')`. Los shims de DOM/`window`/`navigator` ahora se asignan directamente sobre `globalThis` **antes** de los `import()` dinámicos (los `import` estáticos deben preceder a cualquier otra sentencia, así que no sirven aquí). Como `window === globalThis` en el shim, los `window.x = x` de cada fichero también dejan `x` disponible como global real en el test. Se añadió `package.json` con solo `{"private":true,"type":"module"}` (sin dependencias) para que Node trate los `.js` como ESM.
- Verificado con Playwright: recorrido completo por las 6 fases a través de la UI real (clics reales en botones con `onclick`, no solo llamadas directas a funciones), simulación de iframe del hub (`.in-hub`, `postMessage` al pulsar el logo), y ciclo completo de persistencia de sesión (escribir con nombre de paciente, recargar, restaurar fase/datos desde IndexedDB) — todo sin errores de consola.

---

## Fase B — Inputs de texto mobile-friendly

Objetivo: reducir la dependencia del teclado físico en los campos de texto libre en móvil, sin eliminar la opción de escribir a mano.

Campos afectados: `#motivoConsulta`, `#signoComparable` (fase 3), y las notas de plan en fase 5 (`variableControl`, `ventanaRecuperacion`, `anclajeHabito`).

- [x] Añadir una sección `QUICK_PHRASES` (o nombre similar) en `data.js` con frases clínicas predefinidas por campo/contexto — mantiene la separación contenido/lógica del proyecto.
- [x] Componente de "chips" reutilizando el estilo visual de `.option-btn`: tocar un chip inserta/añade texto en el campo; el texto sigue siendo editable después.
- [x] Botón de dictado por voz junto a cada campo de texto libre, usando `SpeechRecognition`/`webkitSpeechRecognition` (API nativa del navegador, sin dependencias nuevas), con fallback silencioso si no está soportado (Safari/iOS tiene soporte limitado).
- [x] Aplicar a los 5 campos listados arriba.
- [x] CSS: variante "chip" en fila con scroll horizontal, sin invadir el espacio vertical del layout móvil de cada fase.
- [x] Probar en dispositivo móvil real (o emulación de Chrome DevTools) el flujo completo intentando no usar el teclado físico.

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
