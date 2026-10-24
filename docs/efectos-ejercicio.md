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
4. **El músculo como órgano endocrino: otras mioquinas.** Concepto general y estado real de cada una (por ejemplo, irisina, con la medición en humanos discutida). Bloque corto y muy etiquetado. Si las fuentes leídas dan casi solo afirmaciones de `mecanismo`, se queda en un párrafo dentro del bloque 3 (decisión 2). **Así se hizo (2026-10)**: ver «Mioquinas, dentro del bloque 3».
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

   Después, unos pocos casos por hipótesis donde aporte de verdad (por ejemplo, tendinopatías → tendón), en una tabla escrita a mano como `HIP_PUNCION_SECA`, nunca deducida. **Hecho (2026-10)**: `BLOQUE_POR_HIPOTESIS`, ver «Por hipótesis» en «Enlace de la fase 6».
3. Enlaces de lectura desde las tarjetas donde el mecanismo es central (osteoporosis → mecanotransducción ósea; lupus; disautonomía). Sin reglas automáticas. **Hecho (2026-10) para osteoporosis y lupus**, desde sus recuadros de la fase 5 (ver «Desde los recuadros de la fase 5»); disautonomía, desde su recuadro, con el bloque 6 escrito para ella (2026-10).

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
5. **Enlace desde «Educación» de la fase 6, por irritabilidad** (alta → bloque 1; baja o moderada → bloque 2). Los casos por hipótesis, más adelante y pocos (hechos, 2026-10).
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
| Tabla hipótesis → bloque | **Opus** | Es una decisión clínica por hipótesis |
| Revisión final antes de `main` | **Usuario** | Como en el resto de guías |

## Estado

| Paso | Estado |
|---|---|
| Diseño (este documento) | Aceptado por el usuario (2026-10) |
| Infraestructura (herramienta, tests, smoke) | Hecha (2026-10, Sonnet): `data/ejercicio.js`, `lib/ejercicio.js`, `#ejercicioBtn` / `#ejercicioOverlay`, `abrirEjercicio()`, tests `tests/unit/ejercicio.mjs`, smoke `ejercicio`; los cinco bloques sin contenido, listados como pendientes |
| Bloque 1 — Hipoalgesia | Escrito (2026-10, Opus; lectura de fuentes con Sonnet) y **revisado por el usuario** (2026-10). Fuentes leídas enteras: Naugle 2012, Vaegter y Jones 2020, Geneen 2017 y Polaski 2019 (PMC); Rice 2019 y Wewege y Jones 2021 (PDF del usuario) |
| Bloque 2 — Mecanotransducción | Escrito (2026-10, Opus; lectura de fuentes con Sonnet) y **revisado por el usuario** (2026-10). 13 fuentes, ver «Bloque 2 — decisiones de nivel» |
| Bloque 3 — Antiinflamatorio sistémico | Escrito (2026-10, Opus; lectura de fuentes con Sonnet) y **revisado por el usuario** (2026-10): frases para el paciente solo en enfermedades reumáticas inflamatorias y bloque separado del de mioquinas. 9 fuentes, ver «Bloque 3 — decisiones de nivel» |
| Bloque 4 — Otras mioquinas | Unido al bloque 3 (2026-10, Opus; lectura de fuentes con Sonnet) y **revisado por el usuario** (2026-10): todo era `mecanismo` o `discutido` (decisión 2). El bloque 3 pasa a llamarse «Efecto antiinflamatorio y mioquinas». 5 fuentes, ver «Mioquinas, dentro del bloque 3» |
| Bloque 5 — Efectos centrales | Escrito (2026-10, Opus; lectura de fuentes con Sonnet) y **revisado por el usuario** (2026-10). 8 fuentes, ver «Bloque 5 — decisiones de nivel». Con él no queda ningún bloque pendiente y la guía deja de pintar «Pendientes de fuentes revisadas» |
| Bloque 6 — Intolerancia ortostática (POTS) | Escrito (2026-10, Opus; lectura de fuentes con Sonnet) y **revisado por el usuario** (2026-10). Añadido después del diseño, a petición del usuario, para enlazar la tarjeta de disautonomía. 7 fuentes, ver «Bloque 6 — decisiones de nivel» |
| Bloque 7 — Hipermovilidad (SEDh / TEH) | Escrito (2026-10, Opus; lectura de fuentes con Sonnet) y **revisado por el usuario** (2026-10). Propuesta aceptada antes de leer, ver «Bloque 7 — propuesta»; 14 fuentes, ver «Bloque 7 — decisiones de nivel» |
| Bloque 8 — Embarazo y posparto | Propuesta **aceptada por el usuario** con las recomendaciones (2026-10): un bloque, enlace en los dos estados sin excepciones, sin `lu8` ni `ca10` en la tabla. Lectura hecha (2026-10, Sonnet): 9 fuentes en PMC y 8 PDF del usuario. Escrito (2026-10, Opus) y enlazado desde la tarjeta (textos aceptados por el usuario, 2026-10), **revisado por el usuario** (2026-10). Ver «Bloque 8 — lectura de fuentes» y «Bloque 8 — decisiones de nivel» |
| Bloque 9 — Trastorno mastocitario y anafilaxia | Propuesta (2026-10, Opus), **pendiente de decisión del usuario**, sin fuentes nuevas leídas. Recomendación: no hacerlo (decisión 2), porque con lo leído nada sobre el ejercicio llega a `clinico`. Ver «Bloque 9 — propuesta» |
| Enlace desde «Educación» de la fase 6 | Hecho (2026-10, Sonnet; los enlaces a «Efectos centrales» y «antiinflamatorio», Opus) y **revisado por el usuario** (2026-10): `enlaceEjercicioHTML()` / `bloqueEjercicioParaIrritabilidad()` en `lib/ejercicio.js`, `abrirEjercicio({ bloque })` en `app.js`; por irritabilidad (alta → hipoalgesia, baja o moderada → mecanotransducción). La tabla por hipótesis (`BLOQUE_POR_HIPOTESIS`, Opus), también hecha y **revisada por el usuario** (2026-10) |
| Enlace desde los recuadros de la fase 5 | Hecho (2026-10, Opus) y **revisado por el usuario** (2026-10): `enlaceCondicionEjercicioHTML()`; lupus diagnosticado → antiinflamatorio, osteoporosis → mecanotransducción |
| Condiciones también en la fase 6 | Hecho (2026-10, Opus) y **revisado por el usuario** (2026-10): disautonomía → ortostática e hipermovilidad → su bloque, en «Educación», con la misma regla de estados que el recuadro (`CONDICION_EJERCICIO`, `condicionEnlazaEjercicio()`); la hipermovilidad deja de enlazarse también con la regla de sospecha vascular cumplida, en las dos fases. Ver «Una sola regla de estados» |

## Mantenimiento de los enlaces por hipótesis y por condición

`BLOQUE_POR_HIPOTESIS` (`data/ejercicio.js`) y `CONDICION_EJERCICIO` (`lib/ejercicio.js`) se escriben a mano: un enlace solo existe si la frase para el paciente del bloque, o la fuente de esa frase, trata ese cuadro. Esa relación cambia cuando cambia cualquiera de los dos lados, así que se revisa **cada vez** que ocurra una de estas cosas, en la misma sesión y antes de `main`:

1. **Cambia la pauta de una hipótesis**: su `dosis` o su `dosisFuente` (por la revisión mensual de fuentes, por una región nueva o por una corrección). Si la fuente nueva trata el cuadro como tendinopatía, dolor crónico, artrosis de cadera o rodilla, o enfermedad reumática inflamatoria, la hipótesis puede entrar en la tabla; si la fuente que la justificaba se va, puede salir (por ejemplo, `h2` está por Desmeules 2025).
2. **Se añade una hipótesis** a una región.
3. **Se escribe o se cambia un bloque**, sobre todo sus frases para el paciente o la fuente en que se apoyan (lo que cubre Geneen 2017 decidió la ampliación de 2026-10).
4. **Se añade una condición especial**, o un bloque que trate una que hoy no tiene enlace.
5. **Al añadir un bloque, revisar qué condiciones especiales deberían enlazarlo, en el recuadro de la fase 5 y en el bloque «Educación» de la fase 6.**

Cómo: mirar las hipótesis afectadas con el criterio de «Por hipótesis» y «Ampliación por hipótesis» (abajo), leer la fuente de la pauta si hace falta y proponer al usuario las altas y bajas antes de tocar la tabla. Los tests de `tests/unit/ejercicio.mjs` fijan las exclusiones deliberadas, así que una baja o un alta de una de ellas obliga a cambiar el test a propósito.

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

## Bloque 2 — lectura de fuentes (2026-10, Sonnet)

Solo lectura: nada escrito en `data/` ni en el registro de referencias todavía (las entradas del registro se escriben con el bloque, porque su `revision` resume lo leído). Las citas literales las devolvieron agentes Sonnet; todas en inglés y con la sección. Lo que no vino en el texto de PMC (tablas, figuras, suplementos, números de cita) no se cita.

| Tema | Fuente | PMC | Estado de lectura |
|---|---|---|---|
| Marco | Khan y Scott 2009, BJSM 43:247–252 | PMC2662433 | Entera, sin figuras. Texto corto de opinión y explicación; solo un ensayo (n = 21, radio distal) y una serie de casos |
| Tendón | Bohm, Mersmann y Arampatzis 2015, Sports Med Open 1:7 | PMC4532714 | Entera. 27 estudios, 264 adultos sanos de 18–50 años; rigidez, módulo y área; muestras de 6–15 |
| Tendón | Lazarczuk et al. 2022, Sports Med 52:2405 | PMC9474511 | Entera. 61 estudios, 763 participantes, calidad PEDro mediana 4/8; solo tendón sano del miembro inferior |
| Tendón | McCrum et al. 2018, Front Physiol 9:150 | PMC5835978 | Entera. Envejecimiento y carga; el desuso solo aparece en una frase de la introducción |
| Tendón | Magnusson y Kjaer 2019, J Physiol 597:1283 | PMC6395417 | **No leída**: texto vacío dos veces, solo el resumen. Probablemente la que trataba el desuso del tendón |
| Músculo | Lim et al. 2022, Med Sci Sports Exerc 54:1546 | PMC9390238 | Entera. Revisión narrativa de mecanismos; no da dosis |
| Músculo | Franchi, Reeves y Narici 2017, Front Physiol 8:447 | PMC5495834 | Entera, con tablas. Excéntrico frente a concéntrico |
| Hueso | Hart et al. 2020, J Musculoskelet Neuronal Interact 20:347 | PMC7493450 | Entera; la tabla 2 sin valores |
| Hueso | Harding y Beck 2017, Sports 5:29 | PMC5968984 | Entera; sin tablas ni figuras |
| Hueso (clínica) | Howe et al. 2011, Cochrane CD000333 | PMC12744941 | **Solo el resumen** (texto vacío). 43 ensayos, 4320 mujeres posmenopáusicas |
| Cartílago | Coburn et al. 2023, Sports Med Open 9:56 | PMC10348990 | Entera. Solo cambios agudos con resonancia (40 estudios); certeza GRADE muy baja |
| Cartílago | Gardashli et al. 2024, Front Bioeng Biotechnol 12:1401207 | PMC11228341 | Leídas las secciones 3–7 (las 1–2 solo barridas). Revisión narrativa de artrosis postraumática, sobre todo animal e in vitro |
| Cartílago | Song y Meng 2026, Medicine 105:e48913 | PMC13225549 | Entera, pero **no usarla para sostener afirmaciones**: ECA no registrado, efectos muy grandes, sus cifras del resumen no coinciden con su tabla 6 |
| Desuso | Reyes et al. 2026, Exp Physiol | PMC13618863 | Entera. Revisión narrativa de reposo en cama, sobre todo músculo y hueso; el texto da dos fechas de búsqueda distintas |
| Desuso | Chen, Guo y Zhou 2025, Front Physiol 16:1694891 | PMC12660080 | Entera, con tablas. Metaanálisis de entrenamiento de fuerza en reposo en cama a −6° (18 estudios, 297 sanos); algunas cifras internas no cuadran (ver abajo) |

**Descartadas o sin texto**: Marusic 2021 (revisión sistemática de reposo en cama, PMC8325614, solo resumen), Lau 2022 (PMC8961781, localizada, no leída), Coburn 2022 (sin PMC), Savage 2025 (observacional, no leída), Whitten 2026 (solo roedores) y otras que el agente de búsqueda motivó una a una.

### Avisos de lectura (para quien redacte)

- **Tendón**: todo es tejido sano, medido en rigidez, módulo y área; **ninguna fuente mide dolor ni función ni estudia una tendinopatía**, y Lazarczuk avisa de no extrapolar. Las dos revisiones discrepan: Bohm 2015 da efecto con intensidad relativa alta (más del 70 % de la contracción máxima, 27 intervenciones frente a 5 con baja), y Lazarczuk 2022 no encuentra diferencia significativa entre intensidades relativas, pero sí con una deformación alta del tendón (~5 %), que salió de solo tres estudios. Candidato a `discutido`. En mayores la adaptación es menor (Lazarczuk).
- **Músculo**: Lim 2022 trata mecanismos, no dosis, y no hay cifras de dosis-respuesta en esa fuente. Khan y Scott basan la parte de músculo en estudios animales.
- **Hueso**: lo clínico depende de Howe 2011, solo con el resumen: efecto pequeño sobre la densidad ósea de mujeres posmenopáusicas (cadera, 1,03 % menos de pérdida con fuerza progresiva; columna, 3,2 % menos con ejercicio combinado). **Discrepancia interna sobre fracturas**: el abstract dice que no hay efecto (OR 0,61; IC 0,23–1,64) y el resumen en lenguaje sencillo habla de una reducción pequeña que puede ser azar; hay que recogerla. Sin texto completo no se cita nada más de Howe.
- **Cartílago**: Coburn 2023 mide cambios agudos (0–5 % de grosor o volumen tras caminar, saltar o flexiones de rodilla, que se recuperan en 15–90 minutos); no mide adaptación crónica ni dolor. Para dolor y función con ejercicio en artrosis no hay fuente fiable leída (Song 2026 descartada). Gardashli sostiene la hipótesis de una respuesta «en U» (extremos de carga o descarga perjudiciales) con datos sobre todo animales e in vitro: nivel `mecanismo` como mucho.
- **Desuso**: no hay fuente abierta leída para tendón ni cartílago humanos. Para músculo y hueso, Reyes 2026 (narrativa) y Chen 2025 (metaanálisis en voluntarios sanos jóvenes, mayoría varones, que no incluye pacientes ni inmovilización de una extremidad). Chen: cifras a comprobar antes de citar (IC de la fuerza en mujeres que no contiene su estimación; dos subgrupos con la misma g = 0,90). Reyes: las vías de señalización las marcan los propios autores como correlacionales en humanos.
- **La afirmación «el reposo absoluto no repara»**: ninguna fuente leída la estudia como tal. Lo más cercano es la pérdida de masa y densidad ósea en reposo en cama en voluntarios (Reyes 2026) y la frase de introducción de McCrum 2018 sobre tendón. Se redacta como desuso en reposo en cama, no como reposo tras lesión.

### Lo que quedaba para Opus (redacción y niveles)

Hecho: ver «Bloque 2 — decisiones de nivel». Se deja la lista como registro.


1. Decidir qué entra y con qué nivel; apoyarse en lo anterior y en las citas literales de esta sesión.
2. Frases para el paciente: solo con afirmaciones `clinico`. Con lo leído, las candidatas son pocas (el hueso, vía Howe, con el matiz de las fracturas); si no hay base clínica suficiente, el bloque puede quedar sin frase para el paciente en algún tema, pero `problemasBloque()` exige al menos una: decidir si se cambia esa regla o se escribe solo la del hueso.
3. Registrar en `data/referencias.js` solo las fuentes que se citen, con su `revision`, y regenerar `docs/referencias.md`.
4. Si el usuario aporta Magnusson y Kjaer 2019, Howe 2011 (texto completo) o Marusic 2021, releer antes de escribir esos apartados.

## Bloque 2 — decisiones de nivel (2026-10, Opus)

Fuentes añadidas tras la primera lectura: Magnusson y Kjaer 2019 y Howe 2011 (las dos en PDF del usuario, leídas enteras; Howe en dos partes). Citadas en el bloque: Khan y Scott 2009, Hart 2020, Lazarczuk 2022, Magnusson y Kjaer 2019, Franchi 2017, Lim 2022, Harding y Beck 2017, Reyes 2026, Chen 2025, Howe 2011, Bohm 2015, Coburn 2023 y Gardashli 2024. No citadas: McCrum 2018 (su dato de desuso es una frase de introducción, cubierto ahora por Magnusson y Kjaer) y Song y Meng 2026 (descartada por fiabilidad).

- **La densidad ósea va como `mecanismo`**, no como `clinico`: es un resultado del tejido, y la propia revisión Cochrane (Howe 2011) no encuentra efecto significativo sobre las fracturas. Lo `clinico` del hueso es la frase de las fracturas (17 frente a 24 en 4 ensayos, OR 0,61; IC 0,23–1,64), con el matiz del ejercicio combinado (un ensayo con el 89 % del peso).
- **Fuerza y función son `clinico`**: la pérdida con 10 días de reposo en cama en mayores (Reyes 2026, citando a Kortebein), el mantenimiento con fuerza durante el reposo en voluntarios sanos jóvenes (Chen 2025, GRADE alta para volumen y fuerza) y la ganancia de fuerza de las personas mayores con menos hipertrofia (Lim 2022).
- **Tendinopatía, `clinico`**: carga eficaz y excéntrico aislado no superior (Magnusson y Kjaer 2019, revisión narrativa que resume ensayos). Todo lo demás del tendón es tejido sano medido en rigidez, módulo y área: `mecanismo`.
- **Intensidad para el tendón, `discutido`**: Bohm 2015 (más efecto por encima del 70 %) frente a Lazarczuk 2022 (sin diferencia por intensidad relativa; sí con deformación alta, tres estudios).
- **Cartílago, solo `mecanismo`**: cambios agudos de 0–5 % que se recuperan en minutos (Coburn 2023, certeza muy baja). La respuesta «en U» (Gardashli 2024) va en «Ampliar», marcada como apoyada sobre todo en animales e in vitro. No hay fuente fiable leída sobre dolor o función del cartílago con ejercicio.
- **El `resumen` del bloque cambia** de «por qué el reposo absoluto no repara» a «qué pasa cuando se deja de cargar»: ninguna fuente leída estudia el reposo tras una lesión como tal; lo que hay es desuso en reposo en cama, inmovilización y descarga.
- **Frases para el paciente**: tres, cada una apoyada solo en afirmaciones `clinico` (fuerza y desuso; tendón que duele; fuerza con la edad). Ninguna sobre el hueso: con fracturas no demostradas, una frase para el paciente sobre «huesos más fuertes» prometería más de lo que hay.

## Bloque 3 — decisiones de nivel (2026-10, Opus)

Fuentes leídas enteras: en PMC, Nara y Watanabe 2021, Messier 2013, Balchin 2022, Silva 2024 y Zeng 2021; en PDF del usuario, Petersen y Pedersen 2005, Pedersen y Febbraio 2012, Gleeson 2011, Benatti y Pedersen 2015 y Ho 2013 (este último, propuesto por el usuario en lugar de los metaanálisis sin texto completo). No citadas: Pedersen, Steensberg y Schjerling 2001 (en PMC solo llegó el resumen) y Zeng 2021 (casi todo el mecanismo en ratas; los propios autores dicen que se conoce poco). Sin texto completo y no usadas: Khalafi 2023 y Hejazi 2022.

- **La IL-6 muscular y su efecto en una sesión, `mecanismo`**: humanos (infusión de IL-6, endotoxina en voluntarios sanos), con parte del mecanismo en células y ratones; nunca medido sobre el dolor.
- **Marcadores en reposo con el ejercicio regular, `discutido`**: las revisiones narrativas dicen que la IL-6 basal baja con el entrenamiento aeróbico (Pedersen y Febbraio 2012); los ensayos leídos no lo ven (Silva 2024, Ho 2013), aunque sí bajan el TNF-α y la PCR.
- **Que el efecto agudo explique el beneficio a largo plazo, `mecanismo`** (hipótesis): Petersen y Pedersen 2005 dicen que no está demostrado y Gleeson 2011 que no se sabe cuánto pesa cada mecanismo.
- **IDEA (Messier 2013), `mecanismo`**: la inflamación bajó con la pérdida de peso, no con el ejercicio solo, y no había grupo sin intervención; no permite atribuir el alivio del dolor a una menor inflamación. Una frase del texto («increased… inflammation» en el grupo de ejercicio) no casa con su tabla y no se cita.
- **Enfermedades reumáticas inflamatorias, `clinico`**: función y fuerza mejoran sin brotes ni subida de PCR o VSG (Benatti y Pedersen 2015, «preliminar» según los autores); una sesión no empeoró el dolor en la artritis reumatoide (Balchin 2022, sin conclusión firme). Es la única población con resultados clínicos.
- **Dolor musculoesquelético común: sin evidencia directa**, dicho en el propio bloque.
- **Frases para el paciente**: dos, solo para enfermedades reumáticas inflamatorias. Ninguna para el dolor musculoesquelético común, y el «Ampliar» explica por qué: decirle que el ejercicio «desinflama» prometería más de lo demostrado. Así el bloque cumple la regla de «al menos una frase para el paciente» sin relajarla.
- **Infecciones en deportistas de élite, `mecanismo`**: asociación con cargas muy altas que los autores atribuyen en parte al estado antiinflamatorio, junto a otros factores (Gleeson 2011).

## Mioquinas, dentro del bloque 3 (2026-10, Opus)

Fuentes leídas enteras en PMC: Severinsen y Pedersen 2020, Bettariga 2024, Jedrychowski 2015, Albrecht 2015 y Cosio 2021 (más Pedersen y Febbraio 2012, ya leída para el bloque 3). Ninguna afirmación llega a `clinico`: ninguna fuente mide dolor, función, fuerza ni cognición atribuidos a una mioquina concreta en personas. Por eso, como prevé la decisión 2, no hay bloque propio: el 3 se llama «Efecto antiinflamatorio y mioquinas» y lleva:

- **Qué ocurre** (`mecanismo`): más de 650 mioquinas, función conocida en un 5 %; **la IL-6 es con diferencia la más estudiada** y casi todo lo demostrado en humanos es suyo (petición del usuario: decirlo así); las demás, sobre todo en animales o células.
- **Evidencia**: una sesión sube poco la irisina y la SPARC, y nada significativo el resto (Bettariga 2024, `mecanismo`); la irisina, `discutido` (Jedrychowski 2015 la mide por espectrometría de masas; Albrecht 2015 invalida los kits ELISA; Cosio 2021 no ve aumento significativo con fuerza y pide cautela con los ELISA); ninguna mioquina con efecto clínico medido.
- **Consulta** (`mecanismo`): no elegir un ejercicio por una mioquina, ni explicarlo como «libera hormonas que…».
- **Ampliar**: BDNF (sale del cerebro, no del músculo), catepsina B (no se sabe si media efectos cognitivos), el ensayo con tocilizumab (la IL-6 media la pérdida de grasa visceral del entrenamiento) y las limitaciones de medida.
- **Frases para el paciente**: ninguna nueva; las dos del bloque 3 no cambian.

## Bloque 5 — decisiones de nivel (2026-10, Opus)

Fuentes leídas enteras en PMC por dos agentes Sonnet (sin suplementos ni figuras): Noetel 2024 y Singh 2023 (ánimo), Haller 2026 (lumbalgia crónica con síntomas depresivos), Pérez-Romero 2026 (fibromialgia, ánimo), Xie 2021 (sueño en adultos sin enfermedad), Hudson 2025 (sueño en fibromialgia), Lima 2023 (mediadores en artrosis de rodilla) y, por palabras clave, las partes psicológicas, de sueño y de calidad de vida de Geneen 2017 (ya leída entera para el bloque 1).

- **`clinico`**: síntomas depresivos en la depresión mayor (Noetel 2024: efecto moderado frente a control activo, confianza CINeMA baja o muy baja, lo dice la frase) y en población general y enfermedades crónicas, artritis incluida (Singh 2023, revisiones de calidad críticamente baja, también dicho); la intensidad (más efecto cuanto más intensa, pero la ligera ya cuenta); el sueño referido en adultos sin enfermedad (Xie 2021), con la salvedad de que en actigrafía solo mejora la eficiencia.
- **`discutido`**: el ánimo en el dolor musculoesquelético crónico (Geneen 2017 variable, Pérez-Romero 2026 favorable pero descriptiva, Haller 2026 con 5 ensayos y certeza muy baja) y el sueño en la fibromialgia (Hudson 2025: unas modalidades mejoran con certeza baja, otras no concluyentes, el mente-cuerpo acuático peor que el placebo; Geneen 2017 sin datos de sueño).
- **`mecanismo`**: los mecanismos neurobiológicos (ninguna revisión los mide), la autoeficacia como mediador (Lima 2023: dos ensayos en artrosis de rodilla, uno de dieta y ejercicio; en el de ejercicio solo, texto y tabla se contradicen; mediador y resultado medidos a la vez) y que ánimo y dolor no se pueden separar (Haller 2026).
- **Consulta**: el ejercicio junto a la psicoterapia y los antidepresivos, no en su lugar (Noetel 2024, comparación en parte indirecta); empezar con actividad ligera; menos abandonos con fuerza y yoga; no prometer más horas de sueño; no explicar la mejoría por la autoeficacia como un hecho.
- **Frases para el paciente**: dos, sobre el ánimo (apoya en depresión, población general e intensidad) y sobre el sueño referido. Ninguna sobre ánimo o sueño en su dolor musculoesquelético en concreto, porque ahí está `discutido`; lo dice el «Ampliar».
- **Fuera**: la sensibilización central va en el bloque 1 (decisión 2). Lee 2015 (autoeficacia como mediador entre dolor y discapacidad, sin ejercicio) y los análisis de mediación de educación o terapia cognitivo-funcional no se usan: no miden el ejercicio.

## Bloque 6 — decisiones de nivel (2026-10, Opus)

Añadido tras cerrar los cinco bloques previstos (usuario, 2026-10): ninguno trataba la disautonomía, y lo que el ejercicio hace en el POTS es un mecanismo propio. La dosis no se repite aquí: es la del recuadro de la fase 5 y el aviso de la fase 6 de la tarjeta (`docs/pots.md`).

Fuentes leídas enteras por un agente Sonnet: Fu y Levine 2015, Cortez 2025, Hogwood 2025, Ziaks 2024 y Yanagimoto 2025 (PMC, sin figuras ni tablas salvo en Yanagimoto) y Kwok 2025 (PDF del usuario). George 2016 ya estaba leída entera para la tarjeta.

- **`clinico`, con certeza baja**: el único ensayo aleatorizado con criterios actuales (Wheatley-Guy 2023, tal como lo recoge Kwok 2025: mejoran la intolerancia ortostática y los síntomas vasomotores del COMPASS-31 y el componente físico del SF-36, no la puntuación total; riesgo de sesgo alto) y la calidad de vida antes y después en los 4 estudios que la midieron (Cortez 2025, sin GRADE). Que la sal y el agua acompañaban al ejercicio, también `clinico`: es un hecho de los estudios, que los autores señalan.
- **`discutido`**: dejar de cumplir el criterio de frecuencia cardiaca (53–71 % de quienes completaron 3–6 meses, en estudios sin aleatorizar, con sal y agua y, en George 2016, con el 59 % de abandono; 4 semanas no lo cambian en adolescentes, Yanagimoto 2025), cuánto pesa la evidencia (Hogwood 2025 frente a Cortez 2025 y Kwok 2025) y la explicación cardiaca (corazón pequeño y volumen bajo, Fu y Levine 2015) frente a la de Hogwood 2025 (gasto conservado, el suero no ayuda, respuesta exagerada de la frecuencia y la respiración).
- **`mecanismo`**: lo que el entrenamiento cambia en el corazón y el volumen de sangre (estudios de un solo grupo, sin normalizar), lo que sigue sin aclarar, y las pautas prácticas: empezar tumbado y pasar a de pie (lo hacen los programas, ningún ensayo lo compara), la propuesta de Ziaks 2024 sin validar, el malestar postesfuerzo (opinión de expertos).
- **Para el paciente**: una sola frase, sobre tolerar estar de pie y la parte física de la calidad de vida, que dice que no mejora todos los síntomas. Ninguna sobre «curarse» ni sobre dejar de cumplir criterios.
- **Erratas de las fuentes**: el resumen de PubMed de Yanagimoto 2025 tiene cifras cambiadas; se usan las del cuerpo del texto. Las revisiones clasifican de forma distinta los mismos estudios (Wheatley-Guy 2023 ensayo en Cortez y Kwok, cohorte en Yanagimoto); se sigue a Cortez y Kwok.

## Bloque 7 — propuesta (aceptada por el usuario, 2026-10)

«Ejercicio en la hipermovilidad (SEDh / TEH)», con el patrón del bloque 6: el recuadro de hipermovilidad de la fase 5 solo dice «ejercicio graduado» (Engelbert 2017) y ningún bloque trataba el tema. La dosis no se repite: es la del recuadro.

**Decisiones**:

1. **Alcance: SEDh y TEH.** El subtipo vascular queda fuera, con una sola línea que remite a Byers 2017 en el recuadro. Motivo: los ensayos que sostendrían las afirmaciones `clinico` (Liaghat, Spanhove, Bale, Susanne) excluyen o no incluyen el subtipo vascular, y su mensaje principal (la fuerza con carga alta se tolera) choca con lo que Byers 2017 (p. 42) pide para él (cargas ligeras, nada isométrico, intensidad que permita conversar); el riesgo ahí es arterial, no articular. Mezclarlos en un bloque invitaría a aplicar al vascular lo probado en el hipermóvil.
2. **Enlace desde el recuadro `.hm-fase5`** (`CONDICION_EJERCICIO`), en los dos estados, salvo con el subtipo vascular diagnosticado.
3. **Sin entrada en `BLOQUE_POR_HIPOTESIS`** (la hipermovilidad es una condición, no una hipótesis) y **sin aviso nuevo en la fase 6** (hoy solo `disautonomiaHM`; sería otro paso). Después (2026-10, usuario): la fase 6 enlaza el bloque desde «Educación» con la misma regla que el recuadro; es un enlace de lectura, no un aviso.
4. **Fuentes**: las de PMC, leídas por un agente Sonnet; Reychler 2021, Liaghat 2025 y Smith 2013, en PDF del usuario.

**Fuentes candidatas** (sin leer; pistas, no contenido):

| Fuente | PMC | Para qué |
|---|---|---|
| Liaghat 2022, BJSM 56:1269 | PMC9626913 | Ensayo de hombro, carga alta frente a baja, 16 semanas (n = 100) |
| Liaghat 2024, BJSM | PMC10982631 | Seguimiento a 1 año |
| Liaghat 2025, Scand J Pain, [doi:10.1515/sjpain-2024-0072](https://doi.org/10.1515/sjpain-2024-0072) | No (PDF) | Trayectoria del dolor y dolor provocado por el ejercicio |
| Christensen 2026, Physiother Res Int | PMC12997522 | Cambio de fuerza frente a síntomas |
| Spanhove 2022, Disabil Rehabil | No | Inestabilidad multidireccional, dos programas en casa (n = 21); a través de las revisiones si no hay texto |
| Bale 2019, Pediatr Rheumatol | PMC6325876 | Niños: multidisciplinar frente a atención habitual (n = 119) |
| Susanne 2024, Clin Rehabil | PMC11776353 | Muñeca: estabilización frente a órtesis (n = 169) |
| Buryk-Iggers 2022, Arch Rehabil Res Clin Transl | PMC9214343 | Revisión sistemática, 10 estudios |
| Reychler 2021, Am J Med Genet A, [doi:10.1002/ajmg.a.62393](https://doi.org/10.1002/ajmg.a.62393) | No (PDF) | Revisión sistemática, 6 ensayos |
| Coussens 2022, J Musculoskelet Neuronal Interact | PMC8919651 | Fuerza y masa muscular en SEDh / TEH |
| Smith 2013, Rheumatol Int, [doi:10.1007/s00296-013-2790-4](https://doi.org/10.1007/s00296-013-2790-4) | No (PDF) | Metaanálisis de propiocepción |
| Engelbert 2017 | Ya leída | Marco: carga graduada, ninguna modalidad mejor |

Descartadas: Møller 2014 (3 pacientes, SED clásico), Tudini 2024 (vendaje), Benistan 2023 (prendas de compresión), revisiones narrativas (Carroll 2023, Tofts 2023).

## Bloque 7 — decisiones de nivel (2026-10, Opus)

Fuentes leídas enteras por agentes Sonnet: en PMC, Liaghat 2022, Liaghat 2024, Christensen 2026, Bale 2019, Lindholm 2024 (en PubMed figura como «Susanne L»: nombre y apellido invertidos), Buryk-Iggers 2022 y Coussens 2022 (sin algunas tablas y figuras); en PDF del usuario, Liaghat 2025, Smith 2013, Reychler 2021, Spanhove 2022 y Brittain 2023. Engelbert 2017 y Byers 2017 ya estaban leídas para la tarjeta. **Palmer 2016** (piloto de viabilidad, HTA) no se usa: en PMC solo llegó el resumen, y el NIHR y Europe PMC no respondieron desde la sesión. Pacey 2013 (niños, ejercicio de rodilla en rango hipermóvil o hasta la extensión neutra) se cita a través de Reychler 2021, que lo recoge con sus datos.

- **El ensayo de hombro es de TEH, no de SEDh**: «none with hypermobile Ehlers-Danlos Syndrome» (Liaghat 2022); los autores no saben si vale para el SEDh, sin supervisión o con más dolor de partida (Liaghat 2025). El bloque lo dice en «Qué cambia en la consulta».
- **`clinico`**: la fuerza con carga alta mejora la función algo más a las 16 semanas, por debajo de la diferencia mínima importante, y al año sin diferencia (Liaghat 2022, 2024); el dolor provocado por la sesión, bajo y sin diferencia entre cargas, con más agujetas y cefaleas pasajeras (Liaghat 2025, 2022); ningún tipo de ejercicio mejor que otro (Spanhove 2022, Lindholm 2024, Pacey vía Reychler 2021, Engelbert 2017); en niños, nada añadido a la atención habitual (Bale 2019); efectos adversos por debajo del 1 % (Buryk-Iggers 2022). También `clinico`, como hecho de los estudios (precedente del bloque 6, la sal y el agua): que ninguno incluye el subtipo vascular.
- **`discutido`**: cuánto pesa la evidencia de conjunto. Los resúmenes de Reychler 2021 («sea cual sea la intervención», calidad de vida «sistemáticamente» mejor) y de Brittain 2023 («eficaces», «evidencia fuerte» por niveles de Oxford, no GRADE) dicen más que sus datos; Buryk-Iggers 2022 no permite afirmaciones definitivas.
- **`mecanismo`**: el déficit de fuerza (Coussens 2022, transversal) y de propiocepción de la rodilla (Smith 2013, casos y controles), sin demostrar que causen los síntomas; la estabilidad activa como justificación de la carga, no medida (la fuerza no cambió entre grupos, Liaghat 2022, y explica poco de la mejoría, Christensen 2026); la regla de dolor de 5 sobre 10 (usada, no comparada) y la preferencia por la cadena cerrada para empezar (lo que eligieron, Spanhove 2022).
- **Para el paciente**: dos frases, sobre la fuerza graduada (no suele aumentar el dolor, mejoría moderada, agujetas que pasan) y sobre que no hay un ejercicio «especial». Ninguna sobre «estabilizar» o «proteger» la articulación, que solo llega a `mecanismo`.
- **Subtipo vascular**: fuera del bloque (decisión 1 de la propuesta). Una frase remite a la pauta de Byers 2017 del recuadro, y el recuadro no enlaza el bloque con ese subtipo.
- **Erratas de las fuentes** (en el registro de cada una): Liaghat 2025 da p = 0,614 en el resumen y 0,138 en el texto; Reychler 2021 da una mediana de calidad que no sale de su tabla; Lindholm 2024 no cuadra los números de asignación; Spanhove 2022 tiene un Beighton medio por debajo de los cortes de 2017.

## Bloque 8 — propuesta (aceptada por el usuario con las recomendaciones, 2026-10)

«Ejercicio en el embarazo y el posparto», con el patrón de los bloques 6 y 7. La tarjeta «Embarazo o posparto» (`docs/embarazo-posparto.md`) ya da la dosis, las contraindicaciones, los signos para parar, el supino, la vuelta a correr, la diástasis y el suelo pélvico (recuadro `.em-fase5`, avisos `embarazo`, `posparto`, `lactancia`, `terapiaManualEmbarazo` y `sacroiliacaEmbarazo`). Le falta lo que da esta guía: **por qué** se recomienda moverse y **hasta dónde llega lo demostrado** en lo que importa al fisioterapeuta. Hoy es una de las condiciones «sin enlace» (ver «Desde los recuadros de la fase 5»). Nada de esto está escrito ni leído: solo la propuesta.

### 1. Alcance

**Recomiendo un solo bloque, con las frases de cada periodo marcadas en la propia frase** («En el embarazo…», «Tras el parto…»):

- La tarjeta es una, con dos estados, y la regla de enlace (`CONDICION_EJERCICIO`) es más simple con un bloque.
- El posparto, con lo ya leído, daría un bloque flojo: casi todo es suelo pélvico y diástasis (Beamish 2025, Gluppe 2021, Woodley 2020) y consensos Delphi, que no llegan a `clinico` (ver 3).
- *Alternativa*: dos bloques («embarazo» y «posparto»). Solo si las fuentes nuevas del posparto (ánimo, dolor lumbopélvico) dan para un `evidencia` propio.

**Qué explica el bloque** (y no da el recuadro):

| Apartado | Contenido previsto |
|---|---|
| `que` | Qué cambia en el cuerpo con el embarazo que importe al ejercicio (gasto cardiaco y volumen de sangre, retorno venoso boca arriba, centro de gravedad) y qué hace el ejercicio sobre eso; tras el parto, el suelo pélvico y la pared abdominal |
| `evidencia` | El ejercicio y el dolor lumbopélvico, el suelo pélvico y los escapes, el ánimo, la diástasis y la seguridad para el embarazo, cada uno con su nivel |
| `consulta` | Por qué la dosis del recuadro y no otra: que los ensayos excluyen los embarazos con contraindicaciones (como el bloque 7 dice del subtipo vascular), que la diástasis no es un motivo para no ejercitarse, que las reglas de vuelta a correr son consenso y no ensayo. **Sin repetir cifras de dosis**: remite al recuadro |
| `paciente` | Dos o tres frases, solo sobre afirmaciones `clinico` (ver 3) |
| `detalle` | Los resultados obstétricos (diabetes gestacional, preeclampsia, peso, tipo de parto), si se leen, solo como contexto |

**Qué queda fuera**:

- **Lo obstétrico**: diagnosticar una contraindicación, la frecuencia cardiaca del feto, objetivos de peso, prevenir la diabetes gestacional o la preeclampsia como mensaje del fisioterapeuta (son de la matrona, el obstetra o el médico). Como mucho, en «Ampliar», dicho como resultado de los estudios y no como consejo.
- **El suelo pélvico especializado**: la dosis del entrenamiento (8 × 3 al día de NG123), la exploración por tacto, el prolapso y la incontinencia anal. Lo decide la fisioterapia de suelo pélvico (decisión 12 de `docs/embarazo-posparto.md`).
- **La lactancia y la leche**: solo la línea de Davenport 2025 que ya está en el aviso (contradicción 13 de la tarjeta).
- **El aborto o la interrupción reciente** y la muñeca y mano: fuera de la tarjeta, fuera del bloque.

### 2. Fuentes

**Ya leídas enteras para la tarjeta** (en el registro). Solo las que aportan efecto o mecanismo; las que solo dan dosis o contraindicaciones no hacen falta aquí:

| Fuente | Para qué afirmación | Cómo |
|---|---|---|
| Liddle y Pennick 2015 (Cochrane, es la del dolor lumbopélvico en el embarazo) | Ejercicio de 8–12 semanas: menos mujeres con dolor lumbar y pélvico (RR 0,66, moderada); el dolor pélvico solo no mejora con ejercicio en grupo (baja). Solo embarazo | Tal cual. Comprobar si hay una actualización posterior a 2015 (no lo sé) |
| Woodley 2020 (Cochrane) | El suelo pélvico estructurado en el embarazo, sin escapes, los previene (moderada al final del embarazo, alta a los 3–6 meses del parto); ofrecido a todas tras el parto, sin efecto claro; como tratamiento, incierto | Tal cual; la frase ya está en el bloque de suelo pélvico de la fase 2, se reutiliza su redacción |
| Beamish 2025 | Tras el parto, el suelo pélvico reduce la incontinencia un 37 % (moderada); el ejercicio abdominal reduce la distancia entre rectos ~0,5 cm; el curl-up la reduce al instante y el transverso la aumenta | Tal cual. Con Woodley, la contradicción 8 de la tarjeta pasa a `discutido` |
| Gluppe 2021 y Sperstad 2016 | Diástasis: certeza muy baja para programas concretos; se resuelve sola en buena parte durante el primer año; la leve no se asocia al dolor lumbopélvico | Tal cual |
| ACOG 2020 | Mecanismo del supino (retorno venoso desde la semana 20) y adaptaciones del embarazo; ejercicio en el agua para el dolor lumbar | Opinión de comité, sin grados: solo `mecanismo` o `consulta` |
| Mottola 2018 | El marco con GRADE y, si se releen esos pasajes, la certeza que da a cada resultado (dolor, ánimo, seguridad) | La certeza de cada resultado sale de sus metaanálisis acompañantes: mejor leer esos (abajo). El PDF no está en el repositorio: habría que pasarlo otra vez |
| Vleeming 2008 y Burani 2023 | Ejercicio individualizado en el dolor de cintura pélvica (nivel C); el miedo-evitación entre los predictores de persistencia | Burani es una asociación, no un efecto del ejercicio: `mecanismo` |
| Evenson 2024 | Que la evidencia del posparto es «sparse» | Para el `evidencia` del posparto |
| Davenport 2025, Christopher 2024, Deering 2024 | Que las reglas del posparto y de la vuelta a correr son consenso Delphi | Solo para decir de dónde salen; sus cifras ya están en el recuadro y no se repiten |
| Singh 2023 (bloque 5, ya registrada) | Si su revisión paraguas recoge a embarazadas y puérperas, el ánimo | Comprobar en el texto ya registrado; no lo recuerdo con seguridad |

No sirven aquí: Hall 2016 y Clinton 2017 (terapia manual, no ejercicio), Bull 2020 (recomendaciones, sin los perfiles GRADE), las NICE (derivación y programas, ya en la tarjeta), RCOG 2015.

**Candidatas nuevas, sin leer** (pistas, no contenido; títulos de memoria, a comprobar al buscarlas):

| Pista | Para qué | Acceso |
|---|---|---|
| Los metaanálisis que acompañan a Mottola 2018 en el mismo número del *Br J Sports Med* (2018–2019, Davenport, Ruchat y colaboradores): ejercicio y dolor lumbar, pélvico y lumbopélvico en el embarazo; ejercicio prenatal y depresión o ansiedad prenatal y posnatal; ejercicio prenatal e incontinencia; ejercicio prenatal y mortalidad fetal; resultados neonatales | La certeza GRADE de cada resultado; la seguridad para el embarazo | El *BJSM* los publicó en acceso abierto, pero **no sé si están en PMC**: el agente lo comprueba; los que no, en PDF |
| Una revisión de ejercicio en la depresión posparto (p. ej., Poyatos-León 2017, *Birth*; sin comprobar) | El ánimo tras el parto | Por comprobar; probablemente PDF |
| La Cochrane de ejercicio para prevenir la diabetes gestacional | Solo para «Ampliar» (fuera de lo que dice el fisioterapeuta) | Cochrane: PDF. **Recomiendo no pedirla**: no cambia nada de la consulta |
| Una fuente sobre la relaxina y la laxitud articular | Solo si se quiere desmontar la idea de «no estirar porque la relaxina afloja»; sin fuente leída, no entra | Por localizar |

**Recomiendo**: leer primero los metaanálisis acompañantes del dolor lumbopélvico, del ánimo, de la incontinencia y de la seguridad, y decidir con ellos si hace falta algo más del posparto.

### 3. Niveles esperados (antes de leer; pueden cambiar)

- **`clinico`**:
  - En el embarazo, el ejercicio estructurado hace menos probable el dolor lumbar y pélvico (Liddle y Pennick 2015, moderada); el dolor pélvico solo, sin mejoría demostrada (baja). Es una sola fuente con resultados distintos por desenlace, no `discutido`.
  - El suelo pélvico estructurado en el embarazo, en mujeres sin escapes, los previene (Woodley 2020).
  - El ánimo prenatal o posnatal, si los metaanálisis acompañantes lo miden.
  - La seguridad: que el ejercicio sin contraindicaciones no se asocia a más pérdidas del embarazo ni partos prematuros, si se lee la fuente y con su certeza.
  - Como hecho de los estudios (precedente de la sal y el agua del bloque 6, y del subtipo vascular del bloque 7): que los ensayos excluyen los embarazos con contraindicaciones.
- **`mecanismo`**:
  - Las adaptaciones del embarazo y el retorno venoso boca arriba (ACOG 2020).
  - **La distancia entre rectos**: es una medida del tejido, como la densidad ósea en el bloque 2. Que el ejercicio abdominal la reduzca ~0,5 cm (Beamish 2025) no dice nada del dolor ni de la función; el curl-up que la reduce al instante y el transverso que la aumenta, tampoco.
  - Que la diástasis leve no se asocie al dolor lumbopélvico (Sperstad 2016) y el miedo-evitación como predictor (Burani 2023): asociaciones en cohortes, no efectos del ejercicio.
  - Las reglas de consenso (vuelta a correr, parar y caminar con escapes): usadas, no comparadas, como la regla de 5 sobre 10 del bloque 7. La frase dice «consenso de expertos».
- **`discutido`**:
  - El suelo pélvico ofrecido a todas tras el parto: Beamish 2025 (−37 %, moderada) frente a Woodley 2020 (sin efecto claro, moderada). Se dicen las dos, y que NICE supervisa solo a las de riesgo.
  - La diástasis y los abdominales: en el embarazo, evitar el curl es opinión de expertos (Mottola 2018); tras el parto, los datos dicen que lo reduce (Gluppe 2021, Beamish 2025). No es exactamente una contradicción (distinto periodo): la frase lo explica así.
  - Cuánto pesa la evidencia del posparto en conjunto («sparse», Evenson 2024).

**Frases para el paciente que podrían sostenerse** (borrador; se reescriben con lo leído):

1. «Hacer ejercicio pensado para ti durante el embarazo hace menos probable que te duela la espalda o la pelvis; si ya te duele, no siempre lo quita.» (apoya: Liddle y Pennick 2015)
2. «Entrenar el suelo pélvico desde el embarazo ayuda a tener menos escapes de orina al final del embarazo y después del parto.» (apoya: Woodley 2020)
3. Una sobre la seguridad o el ánimo, solo si alguna fuente nueva la sostiene en `clinico`.

Ninguna sobre «cerrar la diástasis», «un parto más fácil», «proteger al bebé», «tonificar» ni «recuperar la figura».

### 4. Enlaces

**Recuadro de la fase 5 y «Educación» de la fase 6, en los dos estados (embarazada y posparto), con la misma regla** (`CONDICION_EJERCICIO`):

```js
embarazo: { id: 'embarazo', ayuda: 'enlaceCondicionEmbarazo', motivo: 'embarazo', ayudaPlan: 'enlaceMotivoEmbarazo',
  enlaza: ({ estado }) => !!estado },
```

La fase 5 lee `es` del payload `em`; la fase 6, `state.embarazo.estado` (`datosCondicionEjercicio()` no necesita nada más; `plan.js` pasa la tarjeta en `tarjetas.embarazo`). Textos borrador, para aceptarlos después de leer las fuentes:

- Fase 5: «Por qué se recomienda moverse y hasta dónde llega lo demostrado en el dolor lumbopélvico y el suelo pélvico; la dosis sigue siendo la de este recuadro.»
- Fase 6: «Por el embarazo o el posparto: sus frases para el paciente hablan del dolor de espalda y pelvis y de los escapes, sin prometer más; la dosis es la del aviso de este plan.»

**Sin excepción por estado ni por urgencias** (*recomiendo*): la tarjeta no guarda las contraindicaciones de Mottola (tabla 2; solo texto, T4), así que no hay dato para una regla, y las urgencias de la fase 2 ya bloquean la fase 6. El bloque lo cubre con su primera frase de `consulta` («los ensayos solo incluyen embarazos sin contraindicaciones; con una, el recuadro»). *Alternativa*: no enlazar desde la fase 5 con una urgencia del sistema `transversal_embarazo` en `ur`. Sería la primera condición con esa excepción.

**`lu8` y `ca10` no entran en `BLOQUE_POR_HIPOTESIS`** (*recomiendo*):

- La tabla es por hipótesis, sin mirar las tarjetas: la sacroilíaca de una persona que no está embarazada mandaría a este bloque.
- Para hacerlo bien haría falta una entrada `{ bloque, condicion: 'embarazo' }`, otro mecanismo, para ganar solo el orden (principal en vez de «También»): con la tarjeta marcada, el enlace ya sale.
- La pauta específica de la sacroilíaca en el embarazo ya va en `sacroiliacaEmbarazo` (Vleeming 2008).

**Otras condiciones** (punto 5 de «Mantenimiento»): ninguna. La osteoporosis con causa PLO no se enlaza a este bloque: el bloque no hablará del hueso (eso es «Carga y adaptación»), y no hay reglas entre tarjetas (decisión 14 de la tarjeta). Hipermovilidad, disautonomía, lupus, anticoagulado y mastocitos: ninguna fuente leída los cruza con el ejercicio en el embarazo.

### 5. Riesgos de redacción

- **Exceso de promesa**: «el ejercicio previene la diabetes gestacional o la preeclampsia» (no es mensaje del fisioterapeuta, y como mucho va en «Ampliar»); «cierra la diástasis» (es `mecanismo`, ~0,5 cm); «previene el prolapso» (ninguna fuente leída); «todas necesitan un programa de suelo pélvico tras el parto» (`discutido`; NICE solo a las de riesgo).
- **Consejos que no son del fisioterapeuta**: frecuencia cardiaca objetivo, controles del feto, ganancia de peso, la leche. Diagnosticar una contraindicación: el bloque remite al recuadro y a su equipo obstétrico.
- **Contradicciones con el recuadro y los avisos**, que mandan:
  - supino: solo si se marea o se encuentra mal (Mottola 2018), nunca «no boca arriba desde el primer trimestre»;
  - el posparto sin autorización médica de rutina (Davenport 2025): ninguna frase de «consulte con su médico antes de empezar»;
  - el curl en el embarazo: el recuadro sigue a Mottola (evitarlo, opinión de expertos); el bloque no lo permite, solo explica por qué tras el parto los datos son otros;
  - la vuelta a correr: no antes de 3 semanas (Christopher 2024); ningún otro plazo;
  - el suelo pélvico: la frase de Woodley con la misma redacción que el bloque de la fase 2 (`sueloEvidencia`).
- **Mezclar periodos**: Liddle y Pennick es solo embarazo; Beamish, solo posparto. Cada frase dice el suyo.
- **Repetir la dosis**: ni 150 minutos, ni la «talk test», ni los días; el bloque explica y el recuadro dosifica.
- **Un Delphi no es `clinico`**, aunque venga en *BJSM* y con mucho acuerdo.

### Después de aceptarla (sesiones siguientes, según «Modelo por etapa»)

1. Lectura de fuentes (Sonnet, agente): citas literales con su sección; las que no estén en PMC, en PDF del usuario; el PDF de Mottola 2018 otra vez si hace falta.
2. Decisiones de nivel y redacción (Opus), en «Bloque 8 — decisiones de nivel».
3. Registro en `data/referencias.js` (solo las citadas, con su `revision`) y `node tests/gen-referencias.mjs` (Sonnet).
4. Enlaces (`CONDICION_EJERCICIO`, `TEXTOS_EJERCICIO`, `plan.js`, `_embarazoResultadosHTML()`), con los textos de las líneas de motivo propuestos antes de escribirlos.
5. Tests unitarios (`tests/unit/ejercicio.mjs`: regla por estado, fase 5 = fase 6, orden de las líneas) y `node tests/smoke.mjs --solo ejercicio,embarazo,fase6`.
6. Este documento y `CLAUDE.md` al día (embarazo sale de «Sin enlace»). Sin fusionar hasta la revisión del usuario.

## Bloque 8 — lectura de fuentes (2026-10, Sonnet; primera tanda)

Solo lectura: nada escrito en `data/` ni en el registro. Dos agentes Sonnet devolvieron citas literales en inglés con su sección; las notas completas están en el scratchpad de la sesión, fuera del repositorio. Lo que no viene en el texto de PMC (figuras, tablas suplementarias, perfiles GRADE) no se cita.

| Tema | Fuente | PMC | Estado de lectura |
|---|---|---|---|
| Suelo pélvico y diástasis (posparto) | Beamish 2025 (ya registrada) | PMC12013572 | Entera, sin tablas de características ni GRADE. 65 estudios, n = 21 334 |
| Diástasis (posparto) | Gluppe 2021 (ya registrada) | PMC8721086 | Entera. 7 ECA, n = 381 |
| Diástasis (cohorte) | Sperstad 2016 (ya registrada) | PMC5013086 | Entera, con tablas. 300 primíparas, 178 al año |
| Dolor de cintura pélvica persistente | Burani 2023 (ya registrada) | PMC10744457 | Entera. 10 cohortes, sin metaanálisis ni GRADE |
| Guías del posparto | Evenson 2024 (ya registrada) | PMC11184298 | Entera, sin las tablas con las citas de cada guía |
| Ánimo, población general y perinatal | Singh 2023 (ya registrada, bloque 5) | PMC10579187 | Entera. Fila «Pregnancy/postpartum» de su tabla 2 |
| Ánimo, embarazo y posparto | Dipietro 2019, Med Sci Sports Exerc (revisión paraguas del comité de la guía de EE. UU.) | PMC6527310 | Entera. Sin GRADE; autores truncados en PubMed, completarlos al citar |
| Ánimo posparto tras ejercicio prenatal | Hicks 2024, Arch Womens Ment Health | PMC12122183 | Entera. **No usar sus cifras** (ver abajo) |
| Dolor lumbopélvico posparto | Özyurt 2025, BMC Womens Health | PMC12231622 | Entera. 37 ECA, 1739 mujeres. **Solo su conclusión cualitativa** (ver abajo) |

**Sin texto completo** (solo el resumen de PubMed; sirven para decidir qué pedir, no para citar):

| Fuente | DOI | Qué dice el resumen |
|---|---|---|
| Deprato 2025, *Br J Sports Med* 59(8):550–561, ánimo posparto | 10.1136/bjsports-2024-108478 | 35 estudios, GRADE; depresión SMD −0,52 (−0,80 a −0,24; 19 ECA), certeza moderada |
| Ruchat 2025, *Br J Sports Med* 59(8):594–604, dolor musculoesquelético posparto | 10.1136/bjsports-2024-108488 | Ejercicio solo: dolor lumbopélvico −2,21/10 (4 ECA, n = 210), certeza moderada |
| Mladenovic 2026, *Braz J Phys Ther*, ejercicio en el dolor lumbopélvico del embarazo (31 ECA, GRADE) | 10.1016/j.bjpt.2026.101605 | Tiene PMCID (PMC13380804), pero solo llegan el resumen y los *highlights*: reintentar o PDF. A corto plazo no mejor que la atención obstétrica (baja); a 6–12 semanas, mejor (moderada) |
| Lu 2026, *J Pain*, dolor de cintura pélvica en el embarazo (11 ECA) | 10.1016/j.jpain.2026.106401 | Dolor y función mejoran, certeza moderada |
| Las seis compañeras de Mottola 2018 (*Br J Sports Med* 2018–2019) | Las de dolor lumbopélvico (10.1136/bjsports-2018-099400), ánimo (…-099697), incontinencia (…-099780), mortalidad fetal (…-099773), daños maternos (…-099821) y supino (…-099919) | Ni PMC ni Europe PMC; bjsm.bmj.com responde 403 desde la sesión |

**Comprobado**: la Cochrane del dolor lumbopélvico del embarazo (CD001139) no tiene versión posterior a la de 2015 (Liddle y Pennick 2015, ya leída). Relaxina y laxitud articular: nada en una búsqueda; queda fuera, como prevé la propuesta.

### Avisos de lectura (para quien redacte)

- **Beamish 2025**:
  - suelo pélvico tras el parto e incontinencia urinaria: OR 0,59 (0,39–0,89; 8 ECA, n = 2005; I² 71 %), certeza moderada (rebajada solo por indirecta); el «37 %» del resumen es el de solo suelo pélvico (OR 0,63; 0,41–0,97; 7 ECA). Mujeres con y sin síntomas, medido al terminar la intervención;
  - la gravedad de la incontinencia no cambia (muy baja); incontinencia anal y prolapso, sin efecto significativo (el OR 0,44 del prolapso es un solo ensayo, que los autores piden no generalizar);
  - distancia entre rectos −0,52 cm en reposo (baja) y −0,47 cm con la cabeza levantada (moderada); el resumen y el texto no dan la misma certeza;
  - en agudo, el curl-up la reduce y el transverso la aumenta; el efecto crónico de cada ejercicio no se puede separar;
  - **no mide dolor, función ni calidad de vida ligados a la diástasis**, y no hay ensayos de ejercicio general (aeróbico o de fuerza) sobre estos desenlaces. Sin efectos adversos en el texto.
- **Gluppe 2021**: certeza muy baja para cualquier programa; el transverso, −0,63 cm en dos pilotos (n = 30), que los autores piden no llevar a guías; sin efecto sobre el dolor lumbar ni la disfunción del suelo pélvico; el suelo pélvico «should not be discouraged» con diástasis; *highlights* «low» frente a resumen «very low».
- **Sperstad 2016**: la «no difference» de dolor lumbopélvico con diástasis es 45,6 % frente a 32,5 % (p = 0,10) en 178 mujeres: dicho como «no se vio una asociación clara en un estudio pequeño», no como «la diástasis no duele». Casi toda leve. Erratas en el texto (un IC que no contiene su OR).
- **Burani 2023**: el ejercicio no se estudia como predictor ni como protector. El miedo-evitación pesa poco (OR 1,06 por punto del FABQ); el catastrofismo, «weak or contradictory». Una «OR = 23» sin respaldo en los resultados.
- **Evenson 2024**: guías «variable and based on sparse research evidence»; solo Australia y el Reino Unido usaron GRADE; los beneficios que citan son peso, depresión y ánimo, **no el dolor**. Descriptiva: no estima efectos.
- **Ánimo (Singh 2023, Dipietro 2019)**:
  - Singh 2023, fila «Pregnancy/postpartum»: 3 revisiones, 43 ECA, 3364 participantes, SMD mediana −0,59 (IQR −0,63 a −0,40); solo posparto, −0,49. Sin GRADE y con la confianza AMSTAR-2 de casi todas las revisiones «critically low» (lo que ya dice el bloque 5). Su frase de que los mayores beneficios son en embarazadas y puérperas no la sostiene su tabla;
  - Dipietro 2019: «strong evidence» de una relación inversa entre actividad física y síntomas depresivos en el posparto, por la escala del comité de EE. UU., no GRADE; el propio texto dice que no se sabe si es independiente de la medicación o del apoyo social.
  - Con eso, el ánimo en el posparto llega a `clinico` con certeza baja dicha en la frase, como en el bloque 5. Deprato 2025 (con GRADE) lo afinaría.
- **Hicks 2024**: un «effect size 7,59» sin unidad e imposible en la EPDS, «causality» en la discusión y recuentos que no cuadran. No se usa.
- **Özyurt 2025**: marca «High» con riesgo de sesgo e inconsistencia graves (I² 92 %), y calcula con diferencias antes-después, no entre grupos; texto y tabla discrepan. Solo vale su conclusión: «inadequate to draw strong conclusions». El dolor lumbopélvico del posparto queda sin afirmación `clinico` hasta tener Ruchat 2025.

### Para la segunda tanda (PDF del usuario, por prioridad)

1. Deprato 2025 (ánimo posparto, GRADE).
2. La compañera de Mottola 2018 del dolor lumbopélvico en el embarazo (10.1136/bjsports-2018-099400).
3. Ruchat 2025 (dolor musculoesquelético posparto, GRADE).
4. La compañera de mortalidad fetal (10.1136/bjsports-2018-099773): es la base de una frase de seguridad para el paciente; sin ella no habrá frase de seguridad.
5. Opcionales: Mladenovic 2026 (si el texto no llega al reintentar), la compañera del ánimo prenatal (…-099697), las de daños maternos (…-099821) y supino (…-099919), Lu 2026.

**Lo que ya se puede escribir sin la segunda tanda**: las afirmaciones del embarazo sobre el dolor lumbopélvico (Liddle y Pennick 2015) y el suelo pélvico (Woodley 2020), las del posparto sobre la incontinencia y la diástasis (Beamish 2025, Gluppe 2021, Sperstad 2016), el ánimo con certeza baja (Singh 2023, Dipietro 2019) y los límites (Evenson 2024, Burani 2023). Faltarían el dolor lumbopélvico del posparto, la seguridad para el embarazo y una certeza mejor para el ánimo.

## Bloque 8 — lectura de fuentes, segunda tanda (2026-10, Sonnet)

Ocho PDF del usuario, leídos enteros por tres agentes Sonnet, con citas literales y página; figuras contrastadas sobre el PDF. **No se han leído los suplementos en línea** (figuras S y perfiles GRADE completos): lo que solo está ahí no se cita. Notas completas en el scratchpad de la sesión.

| Clave propuesta | Fuente | Estudios | Para qué |
|---|---|---|---|
| `Davenport 2019 (dolor lumbopélvico)` | Davenport, Marchand, Mottola et al., *Br J Sports Med* 2019;53:90–98, doi:10.1136/bjsports-2018-099400 | 32 (23 ECA) | Dolor lumbar, pélvico y lumbopélvico en el embarazo y el posparto |
| `Davenport 2018 (ánimo)` | Davenport, McCurdy, Mottola et al., *Br J Sports Med* 2018;52:1376–1385, doi:10.1136/bjsports-2018-099697 | 52 (26 ECA) | Depresión y ansiedad, prenatal y posnatal |
| `Davenport 2018 (incontinencia)` | Davenport, Nagpal, Mottola et al., *Br J Sports Med* 2018;52:1397–1404, doi:10.1136/bjsports-2018-099780 | 24 (18 ECA) | Incontinencia urinaria en el embarazo y el posparto |
| `Davenport 2019 (mortalidad fetal)` | Davenport, Kathol, Mottola et al., *Br J Sports Med* 2019;53(2):108–115, doi:10.1136/bjsports-2018-099773 (PDF de la versión en línea de 2018) | 46 (30 ECA) | Aborto y muerte perinatal |
| `Davenport 2019 (daños maternos)` | Davenport, Ruchat, Sobierajski et al., *Br J Sports Med* 2019;53:99–107, doi:10.1136/bjsports-2018-099821 | 113 (79 ECA) | Daños maternos, parto |
| `Mottola 2019` | Mottola, Nagpal, Bgeginski et al., *Br J Sports Med* 2019;53(2):82–89, doi:10.1136/bjsports-2018-099919 (PDF de la versión en línea de 2018) | 7 (3 ECA) | Ejercicio en supino. No es la guía canadiense (`Mottola 2018`) |
| `Deprato 2025` | Deprato, Ruchat, Ali et al., *Br J Sports Med* 2025;59(8):550–561, doi:10.1136/bjsports-2024-108478 (PDF de la versión en línea de 2024) | 35 (26 ECA) | Depresión y ansiedad en el posparto |
| `Ruchat 2025` | Ruchat, Beamish, Pellerin et al., *Br J Sports Med* 2025;59:594–604, doi:10.1136/bjsports-2024-108488 | 37 (23 ECA) | Dolor musculoesquelético en el posparto |

Las claves con paréntesis siguen el precedente de `'Laslett 2005 (centralización)'`: hay varias Davenport del mismo año.

### Avisos de lectura (para quien redacte)

- **Dolor lumbopélvico en el embarazo: contradicción.** Liddle y Pennick 2015: el ejercicio de 8–12 semanas reduce cuántas mujeres tienen dolor lumbar y pélvico (RR 0,66, moderada). `Davenport 2019 (dolor lumbopélvico)`: no lo reduce (OR 0,78; 0,60–1,02; 12 ECA; muy baja), pero baja su intensidad (SMD −1,03; −1,58 a −0,48; 10 ECA; I² 92 %; muy baja), con un estudio extremo (SMD −5,34) sin análisis de sensibilidad y mujeres contadas dos veces en las figuras. Sus autores lo llaman «effective treatment» con certeza muy baja. **Va como `discutido`**; la frase para el paciente 1 de la propuesta no se sostiene tal cual. Sin datos de discapacidad ni de daños. En el posparto, tras ejercitarse en el embarazo, sin efecto (OR 0,89; 3 ECA; baja).
- **Dolor lumbopélvico en el posparto** (`Ruchat 2025`, mujeres que ya tienen dolor): el conjunto, −1,35/10 (low, I² 90 %), que los autores llaman «not clinically significant»; solo ejercicio, −2,21/10 (−3,33 a −1,08; 4 ECA, n = 210; moderada), y con cointervención, nada (p = 0,001 entre subgrupos); discapacidad SMD −0,93 (low). El IC del «solo ejercicio» cruza su propio umbral clínico de 2 puntos, hay controles contados dos veces y los grupos control también mejoran solos: el efecto es acelerar la mejoría. Conclusión de los autores: el fortalecimiento del tronco reduce el dolor y la discapacidad. Sin efectos adversos informados. Candidato a `clinico` con la certeza baja del conjunto dicha en la frase.
- **Ánimo en el embarazo** (`Davenport 2018 (ánimo)`): solo ejercicio, todos supervisados, reduce los síntomas depresivos (SMD −0,38; 13 ECA; moderada; «small») y la probabilidad de superar el corte de depresión de una escala (OR 0,33; 5 ECA; moderada); con cointervención (dieta, etc.), nada; el conjunto, muy baja. El ejercicio en el embarazo **no** cambia el ánimo tras el parto (SMD 0,05). Sin efecto sobre la ansiedad. «Supervisado» y «solo ejercicio» están confundidos. La dosis por metarregresión no es una comparación de dosis: no se usa.
- **Ánimo en el posparto** (`Deprato 2025`): solo ejercicio, síntomas depresivos SMD −0,52 (−0,80 a −0,24; 19 ECA; moderada) y probabilidad de depresión OR 0,55 (0,32–0,95; 4 ECA, n = 303; «high» en resultados, «moderate» en el resumen, que contradice su propia regla de imprecisión: se usa moderada); con cointervención, nada significativo; ansiedad SMD −0,25 (2 ECA; baja). El suelo pélvico solo no mejora el ánimo. Más efecto si empieza en las 12 primeras semanas, pero es una comparación entre estudios, confundida con la depresión de partida: no se escribe como consejo. **Ninguna comparación con antidepresivos ni psicoterapia**: su «alternativa… comparable a los tratamientos convencionales» viene de otras referencias y no se usa; el bloque dice «junto a», como el bloque 5. Sin efectos adversos informados («safe» sin datos).
  - Con Deprato 2025 sobra Dipietro 2019 (sin GRADE) y Singh 2023 queda como apoyo; Hicks 2024 sigue fuera.
- **Incontinencia** (`Davenport 2018 (incontinencia)`): menos probabilidad de escapes en el embarazo (OR 0,50; 15 ECA; baja) y tras el parto (OR 0,63; 10 ECA; moderada), sobre todo en mujeres sin escapes de partida (prevención). «Not effective in treating» se apoya en un solo estudio estimable y una diferencia de subgrupos no significativa: es falta de datos, no falta de efecto. **Ningún estudio mide el ejercicio sin suelo pélvico**, así que el efecto es del suelo pélvico, no del ejercicio general. Una cohorte (n = 10 098) ve más escapes con ejercicio casi diario (OR 1,21 a 6 semanas; 1,63 a 6 meses): asociación, muy baja, que el resumen omite; va en «Ampliar». Coincide con Woodley 2020 (prevención) y no contradice a Beamish 2025.
- **Seguridad del embarazo** (`Davenport 2019 (mortalidad fetal)`): aborto OR 0,88 (0,63–1,21; 23 ECA) y muerte perinatal OR 0,86 (0,49–1,52; 13 ECA), certeza **muy baja**, con IC que no descartan un aumento; todos los ensayos empezaron después de la semana 8, de intensidad moderada y aeróbicos. Los autores dicen «safe» con esa certeza. Lo más que se puede escribir: «en los estudios, el ejercicio sin contraindicaciones no aumentó el riesgo de aborto ni de muerte perinatal, con certeza muy baja». Una frase para el paciente sobre seguridad apoyada en eso se decide en las decisiones de nivel: es `clinico` (desenlace que importa, medido en personas) pero con certeza muy baja.
- **Daños y parto** (`Davenport 2019 (daños maternos)`): rotura prematura de membranas sin diferencia (4 ECA; muy baja); parto instrumental menos con solo ejercicio (OR 0,76; moderada; el «24 %» de los autores es ese subgrupo y es un OR, no un riesgo); cesárea OR 0,87 (baja) por los ensayos con cointervención, aunque el resumen dice que no cambia. Lesiones, caídas y diástasis: «no significant associations» sin cifras en el texto principal. Resultados obstétricos: solo, si acaso, en «Ampliar» (propuesta, punto 1).
- **Supino** (`Mottola 2019`): «insufficient evidence to ascertain whether maternal exercise in the supine position is safe or should be avoided». Solo 4 estudios de una sesión con 12–27 mujeres; en los ensayos, 2–5 minutos por clase. Sin recomendación práctica. Sostiene el recuadro (cambiar de posición solo con síntomas, Mottola 2018 rec. 6) y no permite escribir «no hay que evitarlo» ni «hay que evitarlo». Siete de nueve guías nacionales lo desaconsejan, «primarily based on expert opinion» (España, no).

**Queda sin fuente**: el efecto del ejercicio general (no de suelo pélvico) sobre la incontinencia, la relaxina y las lesiones o caídas con cifras. **Opcionales sin pedir**: Mladenovic 2026 y Lu 2026 (dolor de cintura pélvica del embarazo; no cambiarían el `discutido`, que ya tiene dos revisiones enfrentadas).

## Bloque 8 — decisiones de nivel (2026-10, Opus)

Bloque `embarazo`, «Ejercicio en el embarazo y el posparto», en `data/ejercicio.js`, con 20 fuentes (9 nuevas en el registro: las seis de la guía canadiense, `Deprato 2025`, `Ruchat 2025` y `Evenson 2024`, que se leyó para la tarjeta pero no se citó). Enlaces aparte, con sus textos aceptados por el usuario (2026-10): ver «Desde los recuadros de la fase 5» y «Fase 6, líneas nuevas». Las fechas de publicación de las tres de 2018 en línea son las definitivas de PubMed (2019;53(2)): `Davenport 2019 (mortalidad fetal)`, `Davenport 2019 (daños maternos)` y `Mottola 2019` (sin sufijo: no coincide con otra clave).

- **`discutido`**: el dolor lumbopélvico del embarazo (Liddle y Pennick 2015, moderada, frente a `Davenport 2019 (dolor lumbopélvico)`, muy baja), el suelo pélvico ofrecido a todas tras el parto (Woodley 2020 frente a Beamish 2025) y cuánto pesa lo del posparto en conjunto (Evenson 2024 frente a Deprato 2025 y Ruchat 2025).
- **`clinico`**: el dolor lumbopélvico tras el parto en quien ya lo tiene (Ruchat 2025: solo ejercicio −2,2/10, moderada; conjunto, baja; los controles también mejoran), el ánimo en el embarazo (solo ejercicio supervisado, moderada; nada después del parto ni en la ansiedad) y tras el parto (Deprato 2025, moderada; sin comparación con tratamientos), los escapes con suelo pélvico en el embarazo (Woodley 2020; `Davenport 2018 (incontinencia)`) y la seguridad (aborto y muerte perinatal sin aumento, certeza muy baja, dicho en la frase). También `clinico`, como hechos de los estudios (precedente de los bloques 6 y 7): que solo incluyen embarazos sin contraindicaciones, que el efecto desaparece con cointervenciones y que ningún estudio mide el ejercicio general sin suelo pélvico.
- **`mecanismo`**: el supino (retorno venoso, ACOG 2020; cambios agudos en pocos estudios de una sesión, Mottola 2019, que no permite prohibirlo ni darlo por seguro), la diástasis (distancia entre rectos, como la densidad ósea del bloque 2; su relación con el dolor, una diferencia no significativa en 178 mujeres), la recomendación de no dejar el ejercicio con diástasis (Gluppe 2021, certeza baja; Davenport 2025) y las reglas de vuelta a correr (consenso Delphi, como la regla de 5 sobre 10 del bloque 7).
- **Para el paciente**: tres frases — ánimo en el embarazo y el posparto («es un apoyo… no sustituye a su tratamiento»), suelo pélvico en el embarazo antes de los escapes, y el dolor de espalda o pelvis tras el parto («ayuda a que mejore antes; suele mejorar también con el tiempo»). **Ninguna sobre el dolor del embarazo** (`discutido`), **ni sobre la seguridad**: es `clinico` pero con certeza muy baja y resultados que no descartan un aumento; una frase para la paciente («no aumenta el riesgo») se oiría como «es seguro», que es más de lo que dicen los datos. La tranquilidad la da el recuadro, con la recomendación de Mottola 2018.
- **Sin dosis**: ni minutos, ni días, ni MET (las metarregresiones de dosis de `Davenport 2018 (ánimo)` y Deprato 2025 comparan estudios distintos, no dosis). La dosis sigue siendo la del recuadro y los avisos.
- **No usadas**: Singh 2023 y Dipietro 2019 (las supera Deprato 2025), Hicks 2024 y Özyurt 2025 (cifras no fiables), Burani 2023 (no estudia el ejercicio), y la cesárea y el parto instrumental, solo en «Ampliar».

## Bloque 9 — propuesta (pendiente de decisión del usuario, 2026-10)

«Ejercicio en el trastorno mastocitario y la anafilaxia», con el patrón de las propuestas 7 y 8. Solo la propuesta: no se ha leído ninguna fuente nueva ni se ha escrito contenido. Se apoya en lo leído para la tarjeta (`docs/mastocitaria.md`, «Fuentes leídas enteras», tabla C y «Comprobación de pasajes»).

**Recomendación: no hacer el bloque** (decisión 2 del diseño). Con lo ya leído, lo más probable es que **ninguna afirmación sobre el ejercicio como tratamiento llegue a `clinico`**, y entonces el bloque no tendría frases para el paciente. Lo poco que podría llegar a `clinico` (los cofactores en provocaciones controladas) es materia del alergólogo, y el aviso de la fase 6 ya dice lo que le toca al fisioterapeuta. El razonamiento, punto por punto:

### 1. ¿Merece un bloque? Qué explicaría que no esté ya dicho

Lo que ya dicen la tarjeta, el recuadro `.ma-fase5` y el aviso `mastocitos` sobre el ejercicio:

- **Tarjeta**: el ejercicio y «un alimento con el ejercicio» son dos de los desencadenantes que se marcan.
- **Recuadro de la fase 5**: qué hacer ante una anafilaxia, desmayo vasovagal o anafilaxia, «evita en la sesión lo que ya le ha provocado episodios; no hace falta evitar una lista de todos los descritos» (Brockow 2021). No habla del ejercicio en sí.
- **Aviso `mastocitos`**: que traiga el autoinyector; nada de termoterapia ni crioterapia si el calor o el frío le han dado episodios; «No hace falta dejar el ejercicio: en la anafilaxia por ejercicio, las guías piden mantenerlo, acompañado y con el autoinyector a mano (Srisuwatchari 2023, tabla 2; extenderlo a la mastocitosis es una inferencia)»; si un alimento con el ejercicio le ha dado episodios, no tomarlo en las horas de antes y después.
- **Red `RED_MASTOCITOS`**: la conducta ante una anafilaxia, para la sesión y para casa.

Lo que un bloque podría añadir (y no está):

| Apartado | Contenido posible | Qué nivel alcanzaría con lo leído |
|---|---|---|
| `que` | Qué es la anafilaxia inducida por el ejercicio y su forma dependiente de un alimento: suele empezar en los primeros 30 min; basta una actividad cotidiana (caminar, subir escaleras); el mismo ejercicio la da un día y otro no según los cofactores: comida previa, AINE, alcohol, calor o frío, infección, falta de sueño, fase premenstrual (Pravettoni 2016; Srisuwatchari 2023; Cardona 2020, fig. 3 y tabla 5) | Descripción en revisiones narrativas y en un documento de posición sin grados: como mucho `mecanismo`, como el malestar postesfuerzo del bloque 6 |
| `evidencia` | Con qué frecuencia el ejercicio desencadena episodios en la mastocitosis: el 63 % lo nombra en una encuesta de síntomas (Hamilton 2018) y ninguna anafilaxia por ejercicio en la serie española (González-de-Olano 2017, fig. 1) | `discutido`: las dos fuentes cuentan cosas distintas (síntomas referidos frente a anafilaxias), como ya anota la contradicción 4 de la tarjeta |
| `evidencia` | Si el ejercicio regular es seguro o útil en la mastocitosis | **Ninguna fuente leída lo estudia.** No conozco ningún ensayo; no lo he comprobado (ver 2) |
| `evidencia` | Por qué el ejercicio activa los mastocitos (osmolaridad, redistribución del flujo, permeabilidad intestinal y absorción del alérgeno) | Hipótesis citadas en Pravettoni 2016 y Srisuwatchari 2023: `mecanismo`, en parte solo en animales o in vitro |
| `consulta` | Que el calentamiento corporal de la sesión (ejercicio intenso, sala caliente) cuenta como cofactor; que preguntar por la comida y los AINE de las horas previas es parte del interrogatorio del alergólogo | Las dos cosas ya están, en esencia, en el aviso y en la tabla de desencadenantes de la tarjeta |
| `paciente` | — | Ninguna frase se sostiene: no hay afirmación `clinico` sobre el ejercicio en estas personas (ver 3) |

Fuera, se haga o no: la conducta ante una anafilaxia (es del recuadro), el diagnóstico de la anafilaxia por ejercicio, las pruebas de provocación, qué alimento evitar y cuántas horas antes (lo decide el alergólogo; el aviso solo recuerda lo que «se lo han dicho»), la premedicación con antihistamínicos o cromoglicato, y el autoinyector (recetarlo o no).

### 2. Fuentes

**Ya leídas para la tarjeta** (en el registro salvo Pravettoni 2016 y Hamilton 2018, que se leyeron pero no se citan):

| Fuente | Qué afirmación daría | Nivel posible |
|---|---|---|
| Srisuwatchari 2023 (revisión narrativa, PMC10606284) | Basta actividad cotidiana; mantener el ejercicio regular, acompañado, con autoinyector; sin el alimento 4–6 h antes y 1–4 h después (tabla 2) | Recomendación sin datos comparativos: `mecanismo` en el sentido del diseño («usada, no comparada», como la regla de 5 sobre 10 del bloque 7). Solo para la forma dependiente de alimentos |
| Pravettoni 2016 (revisión narrativa, PMC5089823) | Inicio en los primeros 30 min; cofactores; tumbado con las piernas elevadas | `mecanismo`; la posición ya está en el recuadro |
| Cardona 2020 (WAO, sin grados) | Ejercicio, frío y calor como activación directa (fig. 2); cofactores (fig. 3, tabla 5) | `mecanismo` |
| Valent 2020; Valent 2022 (CIE-10-MC) | Ejercicio y aspirina o alcohol como cofactores; «physical stimuli such as exercise, vibration, or temperature» pueden contribuir a un SAMA | `mecanismo` |
| Muraro 2022 (EAACI, GRADE) | Autoinyector con anafilaxia previa por ejercicio (recuadro 4); identificar los cofactores no alérgicos en el plan (recuadro 5) | Son del alergólogo; sin certeza propia para el ejercicio |
| Hamilton 2018 y González-de-Olano 2017 | El ejercicio como desencadenante en encuestas (63 %) frente a anafilaxias registradas (0 %) | `discutido` |
| Brockow 2021 (niños) | «Physical effort» como cofactor; evitar solo lo que ya le dio reacciones | `mecanismo`, con la salvedad de la población pediátrica |
| Lee y Picard 2025 | Episodios provocados por ejercicio, calor o estrés; AINE en las 6 h previas | `mecanismo` |

**Candidatas nuevas, sin leer** (pistas, no contenido; títulos y años de memoria, a comprobar):

| Pista | Para qué | Acceso |
|---|---|---|
| Christensen MJ et al., provocación con trigo y cofactores (ejercicio, aspirina, alcohol), *J Allergy Clin Immunol Pract* (~2019) | La única pista que podría dar un `clinico` de daño: cuánto aumenta cada cofactor la probabilidad de reacción en personas con alergia al trigo | Probablemente **no** en PMC: PDF |
| Feldweg AM, anafilaxia por ejercicio dependiente de alimentos en consulta, *J Allergy Clin Immunol Pract* (~2017) | Marco de manejo | Probablemente PDF |
| Giannetti MP, revisión de la anafilaxia inducida por el ejercicio, *Curr Allergy Asthma Rep* (~2018) | Epidemiología y cofactores | **No sé** si está en PMC |
| Una búsqueda de ensayos o cohortes de ejercicio o actividad física en la mastocitosis (calidad de vida, tolerancia) | Lo único que podría sostener una frase para el paciente | **No sé si existe ninguno**; si no aparece nada, la conclusión no cambia |

Ninguna de las pistas apunta a un ensayo sobre el beneficio o la seguridad del ejercicio regular en la mastocitosis o el SAMA.

### 3. Niveles esperados (antes de leer; pueden cambiar)

- **`clinico`**: ninguno sobre el efecto del ejercicio. Como mucho, y solo si se leyera Christensen (o equivalente) entero: que en la alergia al trigo dependiente de cofactores, el ejercicio, la aspirina y el alcohol aumentan las reacciones en provocación controlada. Es un dato diagnóstico del alergólogo, de una población estrecha, y no cambia la dosis del fisioterapeuta.
- **`mecanismo`**: qué es la anafilaxia inducida por el ejercicio, su relación con el tiempo, los cofactores descritos y las hipótesis de por qué ocurre; las recomendaciones de manejo («mantener el ejercicio», acompañado, horas sin el alimento), que son opinión de expertos.
- **`discutido`**: cuánto desencadena el ejercicio en la mastocitosis (63 % en encuesta frente a 0 % de anafilaxias en la serie española).
- **Para el paciente**: **ninguna frase**. «Puede seguir haciendo ejercicio» se apoyaría solo en opinión de expertos (y en una inferencia desde otra enfermedad), y el test de la decisión 4 lo impide con razón; «el ejercicio es seguro en la mastocitosis» sería más de lo que dice ninguna fuente.

Un bloque así sería todo `mecanismo` salvo un `discutido`, sin frases para el paciente: exactamente el caso de la decisión 2. A diferencia de las mioquinas, no hay un bloque padre donde fundirlo (ninguno trata la anafilaxia).

### 4. Enlaces, si aun así se hace

Con la misma regla de `CONDICION_EJERCICIO`, que ya da la fase 5 (payload `ma`) y la fase 6 (`state.mastocitos`):

```js
mastocitos: { id: 'mastocitario', ayuda: 'enlaceCondicionMastocitos', motivo: 'mastocitario', ayudaPlan: 'enlaceMotivoMastocitario',
  enlaza: ({ estado, desencadenantes }) => estado === 'diagnosticado' && (desencadenantes.ejercicio || desencadenantes.alimento) },
```

- **Solo «Diagnosticado»** (la tarjeta no tiene otro estado).
- **Recomendaría solo con «Ejercicio o esfuerzo» o «Un alimento con el ejercicio» marcados**, no con todos los tipos ni con el riesgo alto: es donde el bloque trataría el caso del paciente. Con todos los tipos se mandaría a leer sobre la anafilaxia por ejercicio a quien nunca la ha tenido, que es la puerta a evitar el ejercicio sin motivo (riesgo 5b). Obligaría a que `datosCondicionEjercicio()` pase los desencadenantes (hoy pasa `estado`, `subtipo` y `vs`) y la fase 5 los lea de `ma.de` (texto) o del `state`.
- Fase 6: la misma regla, como línea «También» tras la del embarazo.
- Ninguna entrada en `BLOQUE_POR_HIPOTESIS` (es una condición, no una hipótesis), y ninguna otra condición especial la enlazaría (punto 5 de «Mantenimiento»): la hipermovilidad y el POTS no tienen relación demostrada (Lee y Picard 2025; Valdez 2026), y la tarjeta prohíbe la regla automática (decisión 5 de `docs/mastocitaria.md`).

### 5. Riesgos

- **Contradecir el aviso**. El aviso dice «no hace falta dejar el ejercicio»; un bloque sin `clinico` tendría que decir que eso es opinión de expertos e inferencia desde otra enfermedad. Es verdad (el propio aviso ya lo dice), pero repetirlo con chips de `mecanismo` en una guía titulada «Efectos del ejercicio» debilita el mensaje que la tarjeta quiere dar.
- **Invitar a evitar el ejercicio sin motivo**. Un bloque entero sobre el ejercicio como desencadenante de la anafilaxia, enlazado desde una condición que no siempre lo incluye, se leería como «el ejercicio es peligroso aquí». Las sociedades piden evitar solo lo que ya dio reacciones (Brockow 2021), y la serie española no recoge ninguna anafilaxia por ejercicio en la mastocitosis (González-de-Olano 2017).
- **Consejos del alergólogo**: horas de ayuno, qué alimento, premedicación, provocaciones, receta del autoinyector. El bloque tendría que remitirlos todos, y entonces casi no queda contenido propio.
- **Repetir el recuadro**: la conducta ante una anafilaxia ya está, con sus fuentes, en el recuadro, la red y el aviso.

### Qué propongo en su lugar

1. **No hacer el bloque 9** y dejar anotado, en «Desde los recuadros de la fase 5», por qué el trastorno mastocitario sigue sin enlace: ningún bloque podría tener una frase `clinico` sobre el ejercicio en estas personas.
2. **Opcional, como cambio de la tarjeta y no de esta guía** (`docs/mastocitaria.md`): si se quiere que el fisioterapeuta sepa qué es la anafilaxia por ejercicio, una línea en el aviso `mastocitos` o en el recuadro, con fuentes ya leídas y comprobadas: «suele empezar en los primeros 30 minutos de ejercicio, y el mismo ejercicio puede dar la reacción un día y otro no según lo que haya comido, los AINE, el alcohol o el calor (Pravettoni 2016; Cardona 2020, tabla 5)». Habría que registrar Pravettoni 2016 y regenerar `docs/plan-tratamiento-frases.md`. Es una decisión aparte; no la he hecho.
3. Si aun así quieres el bloque, primero leer Christensen (o la provocación con cofactores equivalente) y hacer una búsqueda de ejercicio en la mastocitosis: solo si aparece algo `clinico` sobre el ejercicio en estas personas tiene sentido seguir, con los enlaces del punto 4.

### Después de decidir (sesiones siguientes, según «Modelo por etapa»)

- **Si se acepta no hacerlo**: anotarlo en «Estado» y en «Desde los recuadros de la fase 5»; `CLAUDE.md` no cambia (el trastorno mastocitario ya figura entre las condiciones sin bloque).
- **Si se hace**: lectura con un agente que devuelve citas literales (Sonnet; las que no estén en PMC, en PDF del usuario); decisiones de nivel y redacción (Opus); registro en `data/referencias.js` y `node tests/gen-referencias.mjs`; enlaces con sus líneas de motivo, propuestas antes de escribirlas; tests unitarios (regla por desencadenante, fase 5 = fase 6, orden de las líneas); `node tests/smoke.mjs --solo ejercicio,mastocitos,fase6`; este documento y `CLAUDE.md` al día (el trastorno mastocitario sale de «Sin enlace»). Sin fusionar hasta la revisión del usuario.


## Enlace de la fase 6 (2026-10, Sonnet)

- **Dónde**: en el bloque «Educación» de la sesión del plan (`plan.js`), bajo sus frases: un botón «Para explicárselo al paciente →» y una línea que dice a qué bloque lleva («Abre «<título>», el bloque que corresponde a la irritabilidad elegida.»). Texto en `TEXTOS_EJERCICIO` (`data/ejercicio.js`), no en `data/plan-tratamiento.js`, para no tocar las frases del plan ni `docs/plan-tratamiento-frases.md`.
- **Qué bloque**: el nivel efectivo que ya usa el plan (`plan.irritabilidad`: el elegido, o el calculado de la fase 3, o «alta» si no hay registro, que es lo prudente). Alta → hipoalgesia; baja o moderada → carga y adaptación del tejido. Si el bloque no estuviera escrito, no hay enlace (`bloqueEjercicioParaIrritabilidad()`). Debajo, un segundo enlace discreto «También: «<título>» →» al otro bloque (`bloqueEjercicioAlternativo()`): la regla ordena, no esconde contenido (con irritabilidad alta la carga sigue importando, p. ej. en una tendinopatía). Es una regla de lectura, no clínica: ninguna fuente dice qué explicación toca según la irritabilidad.
- **Otros bloques** (usuario, 2026-10): no dependen de la irritabilidad sino de un dato de la valoración, y salen como más líneas «También: «<título>» →» con su motivo debajo (`motivosEjercicio()`, `lib/ejercicio.js`). «Efectos centrales» con riesgo psicosocial medio o alto en la fase 1, o un PHQ-2, PHQ-9 o GAD-7 de la calculadora completo con síntomas (banda distinta de la mínima o del cribado negativo): sus frases para el paciente son de ánimo y sueño. «Efecto antiinflamatorio y mioquinas» solo con lupus diagnosticado: sus frases para el paciente solo valen en las enfermedades reumáticas inflamatorias, y en el dolor musculoesquelético común el bloque dice que no hay evidencia, así que enlazarlo ahí invitaría a decir «el ejercicio desinflama». También regla de lectura, no clínica.
- **Cómo abre**: `abrirEjercicio({ bloque })` abre la guía con ese bloque desplegado (y los demás plegados) y desplazada hasta él; una clave que no es de un bloque escrito solo abre la guía. En móvil sigue siendo una hoja con Atrás, como siempre.
- **Solo lectura**: no cambia el nivel ni el plan, no marca nada y no entra en los textos que se comparten (plan de sesión, del mes, programa para casa, plan con IA: salen de `lib/` y `data/` del plan, que no conocen la guía; un test lo fija). No se imprime (`.plan-ejercicio`).
- **Tests**: `tests/unit/ejercicio.mjs` (la elección por irritabilidad, sin bloque no hay enlace, el HTML, que solo está en «Educación» y que los textos del plan no lo nombran) los motivos de los otros bloques; y, en la sección smoke `fase6`, el enlace con alta y con baja, que abre su bloque (y solo ese), que Escape cierra y que con riesgo psicosocial alto enlaza también «Efectos centrales».
- **Por hipótesis** (2026-10, Opus; **revisado por el usuario**, 2026-10; el dolor patelofemoral, la banda iliotibial, el dolor plantar del talón y el dolor inguinal del aductor y del psoas se miraron y quedan fuera: sus fuentes no los tratan como tendinopatía): `BLOQUE_POR_HIPOTESIS` (`data/ejercicio.js`), escrita a mano, solo donde una frase para el paciente del bloque habla justo de esa hipótesis. El pinzamiento subacromial (`h2`, añadido a petición del usuario, 2026-10: su guía, Desmeules 2025, la fuente de su pauta, lo incluye en la tendinopatía del manguito y recomienda como tratamiento inicial el ejercicio activo o de fuerza, A; la inclusión se apoya en esa guía, no en Magnusson y Kjaer 2019, la fuente de la frase del bloque) y las tendinopatías (`ca4`, `ca9`, `ro5`, `co1`, `co2`, `co10`, `tp8`, `tp9`, `tp11`, `tp14`, `tp15`, `tp19`) → «Carga y adaptación del tejido» («en un tendón que duele, el ejercicio con carga es el tratamiento principal»); el dolor cervical crónico inespecífico e idiopático, el latigazo y la sensibilización central (`ce7`, `ce14`, `ce5`, `ca15`) → «Hipoalgesia» (ejercicio regular en dolor crónico; respuesta variable en el latigazo y el dolor generalizado). Fuera, a propósito: la rotura del manguito (`h3`: la guía excluye la rotura completa y `h3` agrupa parcial y completa), la artrosis (encaja en los dos), lo que se deriva (roturas, fracturas, luxaciones) y el resto. Regla (`bloqueEjercicioParaPlan()`): si todas las hipótesis elegidas que están en la tabla apuntan al mismo bloque, ese es el principal y la línea de ayuda las nombra («…el bloque que corresponde a «Tendinopatía Rotuliana»»); si ninguna está o apuntan a bloques distintos, manda la irritabilidad, como antes. El secundario sigue siendo el otro de los dos. Un test exige que toda hipótesis de la tabla exista y que las de «Carga y adaptación» sean tendinopatías; el smoke `fase6-codo` lo comprueba con `co1`.
- **Ampliación por hipótesis** (2026-10, Opus; **revisado por el usuario**, 2026-10): se comprobó en el texto completo qué cubren las 21 revisiones Cochrane de Geneen 2017, la fuente de la frase para el paciente de «Hipoalgesia» (artrosis de cadera y de rodilla, dolor patelofemoral, lumbalgia crónica inespecífica, trastornos mecánicos crónicos del cuello, artritis reumatoide, fibromialgia y otros). Entran en «Hipoalgesia»: la artrosis de cadera y de rodilla (`ca1`, `ro1`; antes fuera «porque encajaba en los dos», pero «Carga y adaptación» no tiene frase para el paciente sobre el cartílago), el dolor patelofemoral (`ro3`) y, **solo con cronología «Crónico (>3 meses)»**, la lumbalgia mecánica (`lu1`, `lu2`, `lu6`, `lu7`, `lu9`) y la cervicalgia mecánica (`ce1`, `ce2`, `ce6`, `ce9`, `ce11`), porque la frase habla de dolor crónico y esas hipótesis también salen en cuadros agudos: una entrada puede ser `{ bloque, cronologia }` (`bloqueDeHipotesis()`, `lib/ejercicio.js`; `plan.js` pasa `state.cronologia`). Siguen fuera: la artrosis de hombro y de tobillo o pie (Geneen no las cubre), las radiculares y la estenosis, la sacroilíaca, la cefalea cervicogénica, el mareo y las lesiones agudas con desuso (la frase del desuso viene del reposo en cama en voluntarios sanos). Ninguna hipótesis encaja en «antiinflamatorio», «Efectos centrales» u «Ortostática».
- **Desde los recuadros de la fase 5** (2026-10, **revisado por el usuario**): `enlaceCondicionEjercicioHTML()` (`lib/ejercicio.js`) pinta «Efectos del ejercicio: «…» →» con una línea que dice por qué, solo en pantalla (oculto al imprimir) y nunca en lo que se comparte ni en el prompt. Solo dos condiciones tienen un bloque que les corresponda:
  - **Lupus, solo con «Diagnosticado»** → «Efecto antiinflamatorio y mioquinas»: sus frases clínicas y para el paciente son para las enfermedades reumáticas inflamatorias, lupus incluido.
  - **Osteoporosis, en los dos estados** → «Carga y adaptación del tejido», como lectura para el fisioterapeuta: en el hueso el bloque solo llega a `mecanismo` (la densidad mejora algo) y dice que no está demostrado que el ejercicio reduzca las fracturas; no tiene frase para el paciente sobre el hueso. La pauta de ejercicio sigue siendo la del propio recuadro, con sus fuentes.
  - **Disautonomía, en los dos estados** (2026-10, con el bloque 6, **revisado por el usuario**) → «Ejercicio en la intolerancia ortostática (POTS)»: por qué los programas empiezan tumbado y hasta dónde llega lo demostrado; la dosis sigue siendo la del recuadro.
  - **Hipermovilidad, en los dos estados, salvo con el subtipo vascular diagnosticado** (2026-10, con el bloque 7, **revisado por el usuario**) → «Ejercicio en la hipermovilidad (SEDh / TEH)»: si se puede cargar con fuerza y cuánto dolor provoca. Con el subtipo vascular no hay enlace: sus ensayos no lo incluyen y su pauta es la de Byers 2017, que ya lleva el recuadro. **Tampoco con la regla de sospecha del subtipo vascular cumplida** (`vs`; usuario, 2026-10): hasta que genética conteste el paciente puede tener el subtipo vascular, y el mensaje de carga alta del bloque no vale para él; el recuadro, en ese caso, no muestra la línea de Byers (`docs/hipermovilidad.md`), así que nada lo equilibraría. Vuelve solo cuando la sospecha se desmarca.
  - **Embarazo o posparto, en los dos estados, sin excepciones** (2026-10, con el bloque 8; textos aceptados por el usuario) → «Ejercicio en el embarazo y el posparto»: «Por qué se recomienda moverse y hasta dónde llega lo demostrado en el dolor de espalda y pelvis, el ánimo y los escapes; la dosis sigue siendo la de este recuadro.» Sin excepción por urgencias ni contraindicaciones: la tarjeta no las guarda y las urgencias ya bloquean la fase 6; la primera frase de `consulta` del bloque lo cubre.
  - Sin enlace: trastorno mastocitario, anticoagulado y posquirúrgico (ningún bloque trata su tema).
- **Una sola regla de estados para las fases 5 y 6** (2026-10, Opus, a petición del usuario; **revisado por el usuario**, 2026-10): `CONDICION_EJERCICIO` (`lib/ejercicio.js`) guarda por condición su bloque, la línea del recuadro y, si sale también en la fase 6, su `motivo` y su línea «También»; `condicionEnlazaEjercicio(condicion, { estado, subtipo, vs })` es la regla. La fase 5 la llama con su payload (`es`, `st`, `vs`) a través de `enlaceCondicionEjercicioHTML()`; la fase 6, con las tarjetas del `state` a través de `motivosEjercicio({ riesgoPsico, cuestionarios, tarjetas, respuestas })` (`datosCondicionEjercicio()` calcula `vs` con `reglaVascular()`, como `hmPayload()`). Un test recorre todas las combinaciones de estado, subtipo y regla vascular y exige el mismo resultado en las dos fases.
  - **Fase 6, líneas nuevas** (textos aceptados por el usuario, 2026-10), en este orden tras «Efectos centrales» y «antiinflamatorio»:
    - disautonomía, en los dos estados → «Ejercicio en la intolerancia ortostática (POTS)»: «Por la disautonomía: su frase para el paciente habla de tolerar estar de pie, sin prometer que mejoren todos los síntomas; la dosis es la del aviso de este plan.»
    - hipermovilidad, en los dos estados, salvo subtipo vascular diagnosticado o sospecha vascular cumplida → «Ejercicio en la hipermovilidad (SEDh / TEH)»: «Por la hipermovilidad: sus frases para el paciente dicen que la fuerza graduada no suele aumentar el dolor y que no hay un ejercicio «especial»; vienen de ensayos sin el subtipo vascular.»
    - embarazo o posparto, en los dos estados (2026-10, bloque 8) → «Ejercicio en el embarazo y el posparto»: «Por el embarazo o el posparto: sus frases para el paciente hablan del ánimo, de los escapes y del dolor de espalda o pelvis tras el parto, sin prometer más; la dosis es la del aviso de este plan.» `lu8` y `ca10` no entran en `BLOQUE_POR_HIPOTESIS` (propuesta del bloque 8, punto 4).
  - **Osteoporosis no sale en la fase 6**: «Carga y adaptación del tejido» ya está siempre allí, como principal o como «También».
  - Tests: `tests/unit/ejercicio.mjs` (regla por estado, subtipo vascular y sospecha vascular sin enlace, fase 5 = fase 6, orden y textos) y las secciones smoke `fase6` (las dos líneas, que abren su bloque, y sin la de hipermovilidad con la sospecha cumplida o el vascular diagnosticado) y `hipermovilidad` (sin enlace con dos rasgos menores; con él al quitar uno).
