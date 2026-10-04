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
  Campos opcionales añadidos después (2026-10):
  ```js
  fisiologia: {
    pasos: ['…', '…', '…'],  // 3–6 pasos: del mecanismo al síntoma que cuenta el paciente
    nota: '…',              // opcional: lo que la fuente leída no explica
    metafora: '…'           // opcional: una frase divulgativa, siempre después de los pasos
  },
  citas: ['…', { texto: 'Clave Año — …', url: 'https://…' }]  // la url, la del registro
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
El usuario añadió dominios a la red del entorno. Funcionan: Finucane 2020 (documento completo IFOMPT en `www.orthodiv.org/wp-content/uploads/2021/08/International-Framework-for-Red-Flags-Serious-Spinal-Pathology-2020.pdf`), `www.nice.org.uk` y el texto completo de los artículos de acceso abierto de PMC vía la API de Europe PMC (`https://www.ebi.ac.uk/europepmc/webservices/rest/<PMCID>/fullTextXML`). **No funcionan aunque el dominio esté permitido**, porque responden con una comprobación anti-bots (Cloudflare o reCAPTCHA): `www.jospt.org`, `www.cochranelibrary.com`, `www.statpearls.com` y NCBI Bookshelf (`www.ncbi.nlm.nih.gov/books`, donde vive StatPearls). Para StatPearls o una revisión Cochrane completa, pedir el PDF al usuario (abrir el capítulo y guardarlo como PDF con la fecha de «Last Update» visible).

En lumbar se usaron Goodman (PDF del usuario), Finucane 2020, Downie 2013, Henschke 2013 (resumen de los autores), Fairbank 2011, Cabre 2022 y cinco capítulos de StatPearls en PDF del usuario: Rider y Marra 2023 (cola de caballo), Lassiter 2024 (dolor inflamatorio), Anastasopoulou y Gillespie 2026 (Paget), May y Marappa-Ganeshan 2023 (fracturas de estrés) y Margetis y Gillis 2025 (espondilolistesis). Para «Fisiología, paso a paso», 20 capítulos más de StatPearls en PDF del usuario: siete «Physiology» (Rowe 2023, Kaur 2025, Hantzidiamantis 2024, Chen 2023, Rhodes 2022, King y Lowery 2023, Sanvictores 2023), Shahid 2023 (tiroides), LaPelusa y Dave 2023 (hemostasia), Denault y Launico 2026 (plaquetas), Rout 2024 (neutropenia), Jayarangaiah 2023 (metástasis ósea), Gill 2025 (cistitis), Leslie 2024 (nicturia), Consoli y Carlson 2026 (endometriosis), Malik 2023 (úlcera péptica), Antunes 2024 (hemorragia digestiva alta), Zemaitis 2026 (enfermedad arterial periférica), Munakomi 2023 (estenosis de canal y claudicación neurógena) y Shaw 2025 (aneurisma de aorta abdominal). Clave de un capítulo de StatPearls: autores (o primer autor si son tres o más) y el año de su última actualización.

En cervical (2026-10): Goodman caps. 3, 6, 7, 8, 10, 12, 13 y 14 (PDF del usuario); Rushton 2023, el marco IFOMPT cervical, en PDF del usuario: no está en PMC y `www.ifompt.org` responde 403 desde la red del entorno. Por Europe PMC se leyeron Feller 2024 (banderas rojas en las guías de dolor de cuello), Barcelos 2014 y Budha 2025 (síndrome de Grisel); Finucane 2020 sigue accesible en `orthodiv.org`, aunque a veces corta la primera conexión. StatPearls (PDF del usuario): los cinco ya registrados que se reutilizan (Jayarangaiah, Sanvictores, Malik, Antunes, Lassiter) y 24 nuevos. Para buscar el título exacto, los autores, el NBK y la fecha de un capítulo antes de pedirlo, sirve la API de Europe PMC (`query=TITLE:"…" AND PUBLISHER:"StatPearls"`, `resultType=core`), aunque la fecha buena es la del PDF.

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
- **La tarjeta de consulta no es fuente del razonamiento; el libro en que se basa, sí** (decisión del usuario, 2026-10, en cervical). Lo que solo dice la tarjeta (banderas rojas, recuadro de urgencia) se queda allí, copiado literalmente, y el razonamiento no lo repite si ninguna fuente leída lo respalda. Si el usuario aporta el capítulo regional de Lluch 2020 (la tabla 1 de banderas rojas de cada capítulo es el origen de la tarjeta), se lee entero y se cita como `'Lluch 2020'` con capítulo, autores y páginas. En cervical: caps. 5.3 (Jull y Falla, pp. 365–384) y 5.3.1 (cefalea, pp. 397–411), PDF escaneado del usuario. En lumbar: cap. 5.1 (Fondevila Suárez, pp. 295–326), PDF escaneado del usuario; también sustituye a la tarjeta en las citas de los pronósticos y tests de la fase 4b.
- Toda referencia nueva entra en `data/referencias.js` con `revision: null`.
- **Fisiología, paso a paso** (sección del nivel 2; piloto 2026-10 en `end_2`, `end_4`, `hem_2`, `l1`, `l4`, `l5`, `l_e5`, extendido después a las 30 preguntas de lumbar y comunes, y a las 2 que lumbar añadió después, `l_inf1` y `l_u4`): una cadena causal de 3–6 pasos que va del mecanismo al síntoma, cada paso respaldado por una fuente leída. Fuente principal: los capítulos «Physiology, …» de StatPearls (PDF del usuario). Las moléculas solo entran si explican el síntoma. Si la fuente no explica un eslabón, se dice en `nota` en vez de rellenarlo.
- **La metáfora es un extra, nunca sustituye a la información** (decisión del usuario): una sola frase, después de los pasos y marcada con 💡; no añade nada que los pasos no digan; nada alarmista (el clínico puede repetirla al paciente). No va en el nivel 1.
- **Enlaces**: solo en las fuentes del nivel 2. Texto completo en PMC si es de acceso abierto, si no el DOI; StatPearls, su página de NCBI Bookshelf; Goodman, sin enlace (libro de pago). La url vive en `data/referencias.js` (`url`) y la cita la repite; `tests/unit.js` comprueba que coinciden. Además, toda referencia que tenga DOI lo lleva en el campo `doi` del registro (verificado en Europe PMC: autor, año, revista y volumen o páginas), aunque su enlace sea a PMC o a Bookshelf: es el identificador más estable si un día cambia la web.
- **Conflictos entre fuentes: prevalece la más actual** (decisión del usuario, 2026-10). Si dos fuentes leídas dicen cosas distintas sobre el mismo dato, se usa la de fecha más reciente: la edición del libro, o la «última actualización» en StatPearls. La otra no se cita para ese dato. El conflicto y cómo se resolvió se dicen en la entrega de la tabla de revisión, para que el usuario pueda corregirlo. Ejemplo: en `l_e5`, el sexo en el Paget sale de StatPearls (2026), igual en hombres y mujeres, y no de Goodman (2018), más frecuente en hombres de más de 70 años. Esta regla es para conflictos entre fuentes; cuando el choque es con un texto que ya estaba en `data/` (como la bandera de fractura sacra), decide el usuario.
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
