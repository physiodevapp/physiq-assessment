# Razonamiento fisiológico de las preguntas de cribado (fase 2)

Proyecto de contenido: que cada pregunta de cribado sistémico de la fase 2 explique **por qué tiene sentido hacerla** (mecanismo fisiológico) y **cuánto pesa una respuesta SÍ** (valor diagnóstico real). Es material de apoyo al clínico: nunca entra en el payload, ni en `📋 Notas`, ni en `📄 Informe`.

**Una región por sesión/chat.** Checklist y estado por región: `MIGRATION_PLAN.md`, Fase F. Este documento recoge el diseño y las reglas; léelo entero antes de empezar una región.

## Diseño decidido con el usuario (2026-10)

### Dos niveles de contenido
- **Nivel 1 — inline, para la consulta.** Un `<details>` nativo `ⓘ ¿Por qué?` bajo el texto de la pregunta, cerrado por defecto, sin tocar los botones SÍ/NO. 2–3 líneas en dos partes:
  - **Por qué**: el mecanismo (vía del dolor referido, dolor que no depende de la carga, signo sistémico…).
  - **Cuánto pesa**: qué significa un SÍ. Muchas banderas rojas aisladas son poco específicas (dolor nocturno, edad); decirlo evita sobrerreaccionar y es coherente con el «no implica derivación automática» de la fase 2.
  - Termina con la fuente corta (`— Goodman 2018`) y un enlace **«Ampliar →»** si hay nivel 2.
- **Nivel 2 — detalle ampliado, fuera del flujo** (para que el scroll de la fase 2 no crezca):
  - **Escritorio**: panel lateral derecho **sin velo** (se puede seguir contestando SÍ/NO con él abierto). Pulsar «Ampliar» en otra pregunta cambia el contenido del panel, no lo cierra y abre.
  - **Móvil**: bottom sheet (~85 % de alto) con `--scrim`; la cabecera del sheet repite el texto de la pregunta para no perder el contexto.
  - Contenido: mecanismo detallado, con qué se confunde / qué lo diferencia, y las fuentes completas.
- Estilo: barra lateral fina en `--accent`, texto en `--text2`. **No** usar el borde discontinuo, que está reservado al «📝 Refiere el paciente».
- En modo breve sigue disponible (cerrado, sin coste de tiempo).

### Implementación (primera sesión, junto con lumbar)
- Campo opcional por pregunta en `data/<región>.js` / `data/comun.js`:
  ```js
  razonamiento: {
    porque: '…',          // nivel 1
    peso: '…',            // nivel 1
    detalle: '…',         // nivel 2 (opcional; sin él no hay «Ampliar»)
    fuentes: ['Goodman 2018', 'Finucane 2020'], // claves de data/referencias.js
    citas: ['Goodman 2018 — …, cap. 14, pp. 534–535.']  // opcional: cita completa (capítulo, páginas) de cada fuente
  }
  ```
  `citas` se añadió en la primera sesión para que el nivel 2 muestre «las fuentes completas» con capítulo y página sin que la app importe el registro: cada cita empieza por su clave de `fuentes` y cada clave tiene su cita (lo comprueba `tests/unit.js`).
  Opcional a propósito: una pregunta sin respaldo verificable se queda sin razonamiento antes que con uno inventado.
- Render en `buildSistemaHTML()` (`app.js`). El panel/sheet reutiliza los patrones existentes (hoja «☰ Fases», panel de sesión) y sus tokens (`--scrim`, `--scrim-blur`, `--modal-shadow`); colores solo con variables (tema claro). Al abrir el sheet: `PHYSIQ_WIDGET_HIDE`/`SHOW` al hub como los demás modales, Escape y gestión de foco, y el botón atrás en móvil cierra el sheet en vez de cambiar de fase (`_historyDepth`). Funciones llamadas desde `onclick` inline → al bloque `window` de `app.js`.
- `tests/referencias.mjs`: extraer también `razonamiento.fuentes` como citas (para que el registro y `docs/referencias.md` las cuenten); regenerar con `node tests/gen-referencias.mjs`.
- Unit tests: forma del campo (`porque` y `peso` no vacíos si existe; `fuentes` no vacío y todas en el registro).

### Implementado (primera sesión, 2026-10)
- `razonamientoInlineHTML()`, `abrirRazonamiento()` y `cerrarRazonamiento()` en `app.js`; marcado del panel (`#razonPanel`, `#razonScrim`) en `index.html`; estilos `.razon*` al final de `styles.css`.
- Escritorio (> 768 px): panel lateral fijo a la derecha, sin velo; `body.razon-abierto` aparta el contenido. Otro «Ampliar» cambia el contenido sin cerrar. Escape cierra y devuelve el foco al botón que lo abrió.
- Móvil (≤ 768 px): bottom sheet al 85 % con `--scrim`, `PHYSIQ_WIDGET_HIDE`/`SHOW`, arrastrar hacia abajo para cerrar, y una entrada en el historial (`{ phase, razon: true }`) para que el botón atrás cierre el sheet sin cambiar de fase; al cerrarlo con × o el velo se retira esa entrada (`history.back()`, ignorado en el `popstate`).
- Se cierra solo al cambiar de fase, al repintar el cribado (cambio de región) y cuando el hub oculta el satélite (`_closeAllOverlays`).
- `tests/referencias.mjs` recoge `razonamiento.fuentes` por clave (efecto «razonamiento fase 2»; los sistemas comunes cuentan una vez, como región «Todas»). `tests/unit.js`: forma, claves en el registro, citas↔fuentes, render del «¿Por qué?»/«Ampliar» y que nada llega al payload ni a los resúmenes. `tests/smoke.mjs`: escritorio y 390 px en lumbar.

### Acceso a las fuentes desde la sesión (2026-10)
El proxy de la sesión en la nube bloquea JOSPT, orthodiv.org, los repositorios universitarios, NICE, Cochrane Library, BMJ, OUP y LWW, y NCBI Bookshelf (StatPearls) responde con reCAPTCHA. Sí funciona el texto completo de los artículos de acceso abierto de PMC vía la API de Europe PMC (`https://www.ebi.ac.uk/europepmc/webservices/rest/<PMCID>/fullTextXML`). En lumbar se usaron Goodman (PDF del usuario), Downie 2013, Henschke 2013 (resumen de los autores), Fairbank 2011 y Cabre 2022. **Pendiente para la revisión de lumbar**: Finucane 2020 (pedir el PDF al usuario) y StatPearls como contraste; si llegan, revisar los «cuánto pesa» de lumbar con ellos.
- Smoke test: abrir un «¿Por qué?» y un «Ampliar» en lumbar, a 390 px y en escritorio.
- El componente queda reutilizable (p. ej. explicar los tests de la fase 4b más adelante).

## Fuentes y reglas

| Nivel | Fuente principal | Contraste |
|---|---|---|
| 1 · Por qué | **Goodman** (el usuario tiene el libro) | StatPearls |
| 1 · Cuánto pesa | **Finucane 2020** (columna) · **Rushton 2020** (cervical) · **Cochrane** · **NICE** | Goodman |
| 2 · Mecanismo ampliado | **StatPearls** (NCBI Bookshelf, fechado por capítulo) | Goodman |

- **Goodman**: el registro tiene la 6.ª ed. (`'Goodman 2018'`). En la primera sesión, confirmar con el usuario qué edición tiene; si es la 7.ª, entrada nueva en `data/referencias.js` y citar esa. Goodman es de pago: **pedir al usuario las páginas** del capítulo de cada región y sistema (PDF o fotos) al empezar la región. Redactar con palabras propias y citar; no copiar el texto.
- **Edición confirmada: 6.ª (2018)**, la que ya está en el registro como `'Goodman 2018'`; no hace falta entrada nueva. Índice (el usuario lo aportó, 2026-10) y qué capítulo pedir para cada sistema de PhysiQ en la tabla «Capítulos de Goodman por región» de abajo.
- **Finucane 2020 / Rushton 2020** son marcos de la columna: valen para lumbar y cervical. En las regiones periféricas (hombro, cadera, rodilla, codo, tobillo y pie) el «cuánto pesa» sale de NICE (CKS de artritis séptica, NG158 de TVP…), Cochrane cuando exista y Goodman.
- **Nunca escribir de memoria.** Cada afirmación sale de una fuente leída en la sesión. Si el proxy bloquea el texto completo, pedir el PDF al usuario; un resumen de terceros no basta para dar una cifra.
- Cifras de precisión diagnóstica (S/E/LR) solo con fuente, igual que en la Fase D.
- Toda referencia nueva entra en `data/referencias.js` con `revision: null`.
- **Revisión clínica obligatoria antes de `main`**: al terminar la región, entregar al usuario una tabla compacta (pregunta · porque · peso · fuentes) para revisar en ~10 min. La región no se fusiona hasta que la valide; sus correcciones se aplican en la misma rama.

## Capítulos de Goodman 2018 por región

Índice de la 6.ª ed.: 1 Introducción al cribado (1) · 2 Entrevista (30) · **3 Tipos de dolor y patrones de dolor visceral (90)** · 4 Exploración física (147) · **5 Hematológico (213)** · **6 Cardiovascular (224)** · **7 Pulmonar (272)** · **8 Gastrointestinal (302)** · **9 Hepático y biliar (337)** · **10 Urogenital (360)** · **11 Endocrino y metabólico (387)** · **12 Inmunológico (428)** · **13 Cáncer (463)** · **14 Cabeza, cuello y espalda (521)** · **15 Sacro, sacroilíaca y pelvis (579)** · **16 Cuadrante inferior: glúteo, cadera, ingle, muslo y pierna (611)** · 17 Tórax, mamas y costillas (647) · **18 Hombro y extremidad superior (685)**.

Pedir primero el **capítulo regional** (agrupa el cribado de esa zona sistema por sistema) y de los capítulos de sistema **solo las páginas** de las preguntas que el regional no cubra; no hacen falta capítulos enteros. El **cap. 3** (mecanismos del dolor referido visceral) sirve a todas las regiones: pedir sus páginas sobre dolor referido una sola vez, en la primera sesión.

| Región | Capítulo regional | Sistemas de PhysiQ → capítulo de sistema |
|---|---|---|
| Lumbar | 14 (espalda) + 15 | cáncer 13 · urogenital 10 · GI 8 · espondiloartropatías/ginecológico 12 y 15 · vascular 6 |
| Comunes (`data/comun.js`) | — | endocrino 11 · hematológico 5 |
| Cervical | 14 (cabeza y cuello) | cáncer 13 · cardio 6 · pulmonar 7 · renal 10 · GI 8 · arterial/cefalea 14 y 6 · médula 14 · inflamatoria 12 |
| Hombro | 18 | cáncer 13 · cardio 6 · pulmonar 7 · renal 10 · ginecológico 17 · GI/hepático 8 y 9 · infección 12 · neurológico 18 |
| Cadera | 16 | cáncer 13 · vascular 6 · urogenital 10 · GI 8 · óseo 16 · inflamatoria 12 |
| Rodilla | 16 (solo en parte) | vascular 6 · infecciosa 12 · oncológico/hematológico 13 y 5 |
| Tobillo y pie | — | vascular 6 · infecciosa 12 · oncológico 13 |
| Codo | 18 | vascular 6 · infecciosa 12 · endocrino 11 |

**Rodilla, tobillo y pie** no tienen capítulo regional propio en Goodman, y los sistemas traumático, pediátrico, fractura de estrés y neurológico periférico apenas aparecen. En esas regiones el peso recae en StatPearls, NICE y Cochrane, y Goodman queda como contraste solo donde cubre la pregunta.

## Procedimiento por región
1. Leer este documento y la Fase F de `MIGRATION_PLAN.md`.
2. Pedir al usuario las páginas de Goodman según la tabla «Capítulos de Goodman 2018 por región».
3. Para cada sistema de `screening.sistemas`: buscar y leer las fuentes abiertas (StatPearls, Finucane/Rushton, Cochrane, NICE), redactar `razonamiento` de cada pregunta.
4. Registrar las referencias nuevas; `node tests/gen-referencias.mjs`; `node tests/unit.js`; `node tests/smoke.mjs`; revisar a mano a 390 px y en escritorio.
5. Tabla de revisión para el usuario; aplicar correcciones; PR; marcar la región en la Fase F.

Los sistemas transversales de `data/comun.js` (`SIS_ENDOCRINO`, `SIS_HEMATOLOGICO`) aparecen en todas las regiones: se hacen una sola vez, en la primera sesión.
