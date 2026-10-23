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
| Bloque 2 — Mecanotransducción | Escrito (2026-10, Opus; lectura de fuentes con Sonnet), **pendiente de revisión del usuario**. 13 fuentes, ver «Bloque 2 — decisiones de nivel» |
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

### Pendiente para Opus (redacción y niveles)

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
