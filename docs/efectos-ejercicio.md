# Efectos fisiológicos del ejercicio

Diseño aceptado por el usuario (2026-10; decisiones 1–6 al final). Todavía no hay código ni contenido. Léelo entero antes de empezar cualquier bloque.

## Objetivo

Que el fisioterapeuta tenga a mano, con fuentes revisadas, **qué hace el ejercicio en el cuerpo y hasta dónde llega lo que se sabe**. Sirve para dos cosas:

1. **Decidir**: por qué una dosis y no otra (por ejemplo, ejercicio a distancia de la zona dolorosa cuando la irritabilidad es alta, o carga progresiva en una tendinopatía).
2. **Explicárselo al paciente**: con frases que no prometan más de lo demostrado.

## Qué hay hoy en la app (revisado 2026-10)

Nada trata la fisiología del ejercicio en sí. Lo más cercano:

| Pieza | Qué cubre | Por qué no basta |
|---|---|---|
| Guía de fármacos, apartado «Ejercicio» (`data/farmacos.js`) | Cómo cambia cada fármaco el ejercicio | El sentido contrario: no explica qué hace el ejercicio |
| Fase 6, bloque «Educación» (`data/plan-tratamiento.js`) | «Explicar la hipótesis y el plan» y avisar de una reacción tras la primera sesión | No explica por qué funciona |
| «Fisiología paso a paso» (fase 2) | Por qué se hace una pregunta de cribado | Otro tema |
| ⏱ Tiempos de recuperación | Cuánto tarda en repararse un tejido | No dice qué estímulo produce la carga |
| ✨ Preguntar a la IA | Cualquier duda | Sin fuente revisada; no enseña lo que no se sabe preguntar |

## Límites (no cambian en ningún bloque)

- **Solo fuentes leídas en la sesión**, como en el resto de guías. Las fuentes candidatas de abajo no se han leído.
- **Cada afirmación lleva su nivel** (decisión 3), porque en este campo abunda la divulgación exagerada («el ejercicio es un antiinflamatorio»):
  - `clinico`: efecto medido en personas sobre un resultado que importa (dolor, función).
  - `mecanismo`: solo el mecanismo (una molécula en sangre, un cambio en el tejido), sin efecto clínico demostrado. Si solo se ha visto en animales o in vitro, la frase lo dice.
  - `discutido`: hay fuentes leídas que se contradicen; se dicen las dos.
- **Nunca** se convierte en una regla de dosificación automática ni cambia el plan, las hipótesis o el cribado. Es de lectura.
- **Nunca** va al payload, a `📋 Notas`, al `📄 Informe` ni al prompt del informe con IA (test unitario, como en las demás guías).
- Ninguna frase dice que el ejercicio sustituye a un tratamiento médico.

## Bloques propuestos, en orden de trabajo

Ordenados por cuánto cambian una decisión en consulta, no por lo llamativos que son.

1. **Hipoalgesia inducida por el ejercicio.** Qué es; diferencia entre ejercicio local y a distancia; por qué puede faltar o invertirse en el dolor crónico; qué implica para la dosis y para los brotes tras ejercitarse.
2. **Mecanotransducción: tendón, hueso, cartílago y músculo.** Cómo la carga se convierte en adaptación del tejido; por qué el reposo absoluto no repara; relación con las tarjetas de osteoporosis y con las tendinopatías.
3. **Efecto antiinflamatorio sistémico.** La IL-6 que libera el músculo al contraerse y la cascada que sigue; diferencia con la IL-6 de la inflamación; qué se sabe y qué no en dolor musculoesquelético.
4. **El músculo como órgano endocrino: otras mioquinas.** Concepto general y estado real de cada una (por ejemplo, irisina, con la medición en humanos discutida). Bloque corto y muy etiquetado. Si las fuentes leídas dan casi solo afirmaciones de `mecanismo`, se queda en un párrafo dentro del bloque 3 (decisión 2).
5. **Efectos centrales.** Sueño, estado de ánimo y autoeficacia. La sensibilización central va en el bloque 1, para no repetirla (decisión 2).

Cada bloque tiene la misma estructura (propuesta):

| Apartado | Contenido |
|---|---|
| `que` | Qué ocurre, en dos o tres frases |
| `evidencia` | Hasta dónde llega lo demostrado, con la etiqueta de nivel de cada afirmación |
| `consulta` | Qué cambia en la dosis o en la decisión (solo si alguna fuente leída lo dice) |
| `paciente` | Una o dos frases para explicárselo al paciente: redacción propia, solo donde hay una afirmación `clinico` que la respalde y sin decir más que ella (decisión 4) |
| `detalle` | Opcional, en «Ampliar ▾» |

## Dónde encaja en la app (propuesta)

1. **Herramienta de cabecera «Efectos del ejercicio»**, con el patrón de la guía de fármacos (`data/farmacos.js` + `lib/farmacos.js`):
   - `data/ejercicio.js` (contenido) y `lib/ejercicio.js` (HTML puro, no lee el `state`);
   - icono propio; en ≤768 px, una opción más de «Herramientas»;
   - hoja inferior con atrás en móvil y diálogo centrado en ancho;
   - un `<details>` por bloque, «✨ IA» por párrafo, citas pulsables (`citasEnTexto()`);
   - la etiqueta de nivel, visible como un chip pequeño al final de la frase, pulsable como las citas, con una línea que explica qué significa (decisión 3);
   - disponible también en el hub (no usa red), sin los enlaces de IA;
   - fuentes en `data/referencias.js`, contadas en `docs/referencias.md` como «guía de efectos del ejercicio».
2. **Fase 6, bloque «Educación»** (decisión 5): un enlace «Para explicárselo al paciente →» que abre la guía en el bloque que toca, elegido **por irritabilidad**, que ya está calculada (`irritabilidadSINSS()`):
   - alta → bloque 1, hipoalgesia (ejercicio a distancia; puede fallar en el dolor crónico);
   - baja o moderada → bloque 2, mecanotransducción.

   Más adelante, unos pocos casos por hipótesis donde aporte de verdad (por ejemplo, tendinopatías → tendón), en una tabla escrita a mano como `HIP_PUNCION_SECA`, nunca deducida. Se hace cuando estén los bloques 1 y 2.
3. **Más adelante**, enlaces de lectura desde las tarjetas donde el mecanismo es central (osteoporosis → mecanotransducción ósea; lupus; disautonomía). Sin reglas automáticas.

## Fuentes candidatas (sin leer)

Pistas para localizar, **no contenido**. Cada una se lee entera antes de escribir una frase; si no está en acceso abierto, solo entra como PDF aportado por el usuario.

- Hipoalgesia: Naugle 2012 (metaanálisis, J Pain); Rice 2019 (estado de la cuestión, J Pain); trabajos de Vaegter sobre ejercicio local y a distancia.
- Mecanotransducción: Khan y Scott 2009 (BJSM, «Mechanotherapy»); Magnusson y Kjaer 2019 (J Physiol, tendón).
- Efecto antiinflamatorio y mioquinas: Pedersen y Febbraio 2008 (Physiol Rev) y 2012 (Nat Rev Endocrinol); Gleeson 2011 (Nat Rev Immunol).
- Irisina, la discusión: Albrecht 2015 (Sci Rep) frente a Jedrychowski 2015 (Cell Metab).

## Decisiones aceptadas (usuario, 2026-10)

1. **Herramienta de cabecera propia.** No encaja en ninguna guía actual; en móvil es una opción más de «Herramientas». Se copia el patrón de la guía de fármacos.
2. **Los cinco bloques, en ese orden.** El 4 se queda en un párrafo dentro del 3 si sus fuentes dan casi solo mecanismo; la sensibilización central va en el 1, no en el 5.
3. **Tres etiquetas de nivel, visibles**: `clinico`, `mecanismo` (con «solo en animales» en la frase cuando toque) y `discutido`. Chip pequeño al final de la frase, pulsable, con su explicación.
4. **Apartado `paciente`**, solo donde lo respalda una afirmación `clinico` y sin decir más que ella. Un test unitario comprueba que ninguna frase para el paciente se apoya solo en `mecanismo` o `discutido`.
5. **Enlace desde «Educación» de la fase 6, por irritabilidad** (alta → bloque 1; baja o moderada → bloque 2). Los casos por hipótesis, más adelante y pocos.
6. **Orden de trabajo**:
   - primera sesión: la infraestructura, con la herramienta y los cinco bloques como «Pendientes de fuentes», más tests unitarios y sección smoke;
   - después, un bloque por sesión, con las fuentes leídas por un agente que devuelve citas literales, y revisión del usuario antes de `main`;
   - el enlace de la fase 6, cuando estén los bloques 1 y 2.

## Modelo por etapa (recomendación aceptada, 2026-10)

El criterio: Sonnet donde hay un patrón que copiar y tests que detectan el fallo; Opus donde el error es clínico y ningún test lo ve.

| Etapa | Modelo | Por qué |
|---|---|---|
| Infraestructura (herramienta, tests, smoke) | **Sonnet** | Replica la guía de fármacos; los bloques van vacíos, sin juicio clínico; los tests cazan los fallos típicos |
| Localizar y leer las fuentes de un bloque | **Sonnet** (agente) | Solo extrae citas literales con su sección |
| Decidir qué entra y con qué etiqueta (`clinico` / `mecanismo` / `discutido`) | **Opus** | Hay que ver cuándo una revisión dice más de lo que demuestran sus estudios |
| Redactar el contenido y las frases para el paciente | **Opus** | Un exceso de promesa no lo detecta ningún test |
| Registrar las fuentes (`data/referencias.js`) y regenerar `docs/referencias.md` | **Sonnet** | Mecánico; los tests comprueban el registro |
| Enlace desde «Educación» de la fase 6 | **Sonnet** | Código sobre `irritabilidadSINSS()`, con tests; el texto del enlace es fijo |
| Tabla hipótesis → bloque (más adelante) | **Opus** | Es una decisión clínica por hipótesis |
| Revisión final antes de `main` | **Usuario** | Como en el resto de guías |

## Estado

| Paso | Estado |
|---|---|
| Diseño (este documento) | Aceptado por el usuario (2026-10) |
| Infraestructura (herramienta, tests, smoke) | Hecha (2026-10, Sonnet): `data/ejercicio.js`, `lib/ejercicio.js`, `#ejercicioBtn` / `#ejercicioOverlay`, `abrirEjercicio()`, tests `tests/unit/ejercicio.mjs`, smoke `ejercicio`; los cinco bloques sin contenido, listados como pendientes |
| Bloque 1 — Hipoalgesia | Escrito (2026-10, Opus; lectura de fuentes con Sonnet), **pendiente de revisión del usuario**. Fuentes leídas enteras: Naugle 2012, Vaegter y Jones 2020, Geneen 2017 y Polaski 2019 (PMC); Rice 2019 y Wewege y Jones 2021 (PDF del usuario) |
| Bloque 2 — Mecanotransducción | No empezado |
| Bloque 3 — Antiinflamatorio sistémico | No empezado |
| Bloque 4 — Otras mioquinas | No empezado |
| Bloque 5 — Efectos centrales | No empezado |
| Enlace desde «Educación» de la fase 6 | No empezado (tras los bloques 1 y 2) |

## Infraestructura hecha (2026-10)

| Pieza | Dónde |
|---|---|
| Icono `#ejercicioBtn` (pulso) | Cabecera; en ≤768 px es la opción «Efectos del ejercicio» de «Herramientas» (`herramientaElegir('ejercicio')`), entre Fármacos y Tiempos de recuperación |
| Diálogo `#ejercicioOverlay` / `#ejercicioPanel` | Reutiliza `.cond-panel`; hoja inferior con atrás en móvil, diálogo centrado de hasta 560 px en ancho |
| Abrir y cerrar | `abrirEjercicio()` / `cerrarEjercicio()`, `_ejercicioHistorial`, `_closeAllOverlays()` (`app.js`) |
| Contenido | `data/ejercicio.js`: `NIVELES_EJERCICIO`, `APARTADOS_EJERCICIO`, `BLOQUES_EJERCICIO`, `TEXTOS_EJERCICIO` (esquema de un bloque en la cabecera del archivo) |
| HTML | `lib/ejercicio.js`: `ejercicioHTML()` (puro, no lee el `state`), `problemasBloque()` (validador del esquema), `nivelHTML()` / `nivelFichaHTML()` |
| Chip de nivel | `<button class="ej-nivel">` al final de cada frase salvo en «paciente»; abre la ficha flotante común (`ficha.js`, `#ejNivelFicha`) con su explicación; listener en captura, como las citas |
| «✨ IA» por párrafo | Contexto `ctxEjercicio(titulo)` (`ampliar-ia.js`) |
| Fuentes | `recogerCitas({ EJERCICIO })` (`tests/referencias.mjs`) las cuenta en `docs/referencias.md` como «guía de efectos del ejercicio» |

**Cómo se escribe un bloque**: se añade `apartados` y `fuentes` a su entrada de `BLOQUES_EJERCICIO`; deja de estar pendiente solo. `node tests/unit.js` exige que cada frase tenga un `nivel` que exista, que cada frase de `paciente` indique en qué `evidencia` se apoya (`apoya`) y que todas sean de nivel `clinico`, y que las citas de dentro de la frase sean fuentes del bloque y estén en el registro; después `node tests/gen-referencias.mjs`.

**Tests**: unitarios en `tests/unit/ejercicio.mjs` (con un bloque de prueba, para no depender de que haya contenido real); smoke en la sección `ejercicio` (el bloque de prueba se escribe solo en la página).

## Bloque 1 — Hipoalgesia: decisiones de nivel (2026-10)

- Todo lo medido tras una sesión es dolor provocado en el laboratorio (sobre todo el umbral de dolor a la presión), no el dolor del paciente: va como `mecanismo`, aunque sea en humanos.
- El efecto por tipo de ejercicio en sanos va como `discutido`: Naugle 2012 (con estudios sin control) da efecto grande al isométrico; Wewege y Jones 2021 (solo ensayos aleatorizados con control de reposo) no le encuentra efecto, y atribuye la diferencia al diseño. Lo mismo la intensidad elegida frente a prescrita: un estudio en fibromialgia (Vaegter y Jones 2020; Naugle 2012) frente a «casi sin diferencia» (Rice 2019).
- Los mecanismos van como `discutido`: opioides equívocos en humanos; endocannabinoides con más acuerdo entre humanos y animales (Rice 2019).
- Lo único `clinico` es el ejercicio regular en dolor crónico (Geneen 2017: efecto de pequeño a moderado, inconsistente, calidad baja; no empeoró el dolor; agujetas que ceden) y la falta de una dosis óptima demostrada (Polaski 2019; Geneen 2017). Las dos frases para el paciente se apoyan solo en eso.
- «Empezar por zonas que no duelen o por baja intensidad» va en «Qué cambia en la consulta» como `mecanismo` y con la cautela literal de los autores: sale de laboratorio, no de ensayos clínicos (Vaegter y Jones 2020; Rice 2019).
- Sensibilización central: la hipoalgesia falla más con sensibilidad al dolor generalizada o modulación condicionada deficiente, dado como preliminar (Rice 2019). La educación en neurociencia del dolor para los brotes tras el ejercicio va como propuesta de los autores, sin demostrar en dolor crónico.
- Factores psicológicos: asociados a la hipoalgesia en sanos, no en dolor crónico (Rice 2019); se dice así, sin generalizar.
- No se ha escrito que la hipoalgesia de una sesión prediga el resultado del ejercicio regular: solo hay datos preliminares (Rice 2019); va en «Ampliar».
