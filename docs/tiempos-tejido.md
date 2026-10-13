# Tiempos de recuperación de tejidos

Consulta desde la cabecera (icono ⏱ `#tejidosBtn`, en cualquier fase, también en el hub). Lo pidió el usuario (2026-10) para tener a mano el diagrama de tiempos de recuperación que hasta ahora estaba en physiq-wiki («Tiempos de Tejido»), con ese mismo formato de referencia.

## Decisiones (usuario, 2026-10)

1. **Dónde**: un icono en la cabecera que abre el diagrama en una hoja inferior en móvil y en un diálogo centrado (hasta 760 px) en escritorio. Funciona igual que «✨ Preguntar a la IA»: el atrás, deslizar hacia abajo, tocar el velo y Escape lo cierran. A diferencia de ese, también está en el hub, porque no usa la red.
2. **Contenido**: la tabla del wiki corregida (ver abajo). La ampliación con más tejidos queda para más adelante, con fuente leída para cada fila.
3. **Línea «Hoy»**: con mecanismo Post-quirúrgico y semanas desde la cirugía (fecha o semanas aproximadas de la tarjeta «Cirugía», `semanasCirugia()`), una línea vertical marca dónde está el paciente. En los demás casos no se marca nada: la cronología es una categoría, no una fecha.

## Qué es solo consulta

El panel lee `state.mecanismo` y `state.cirugia` para pintar, nada más. No entra en el payload, en `📋 Notas`, en `📄 Informe` ni en el prompt del informe con IA. Lo comprueban `tests/unit/tejidos.mjs` (ningún módulo de resúmenes, informe o fases 4/4b lo importa) y el smoke test (el payload no lo contiene).

## Archivos

| Archivo | Qué hace |
|---|---|
| `data/tejidos.js` | `TIEMPOS_TEJIDO`: columnas del eje, gravedades, grupos y filas, fases de reparación, notas y fuente. Contenido clínico sin lógica; lo reexporta `data.js` |
| `lib/tejidos.js` | Funciones puras: `posicionDia()` (día → posición en el eje no lineal), `marcaHoy()`, `tiemposTejidoHTML()` |
| `app.js` | `abrirTiemposTejido()` / `cerrarTiemposTejido()` |
| `index.html` | Botón de la cabecera y `#tejidosOverlay` |
| `styles.css` | Bloque «Tiempos de recuperación de tejidos» y tokens `--tej-*` (tema claro y oscuro). El eje de tiempo (`.tej-eje`) es `sticky`: se queda fijo arriba al hacer scroll dentro del panel (petición del usuario, 2026-10). Bajo sus etiquetas lleva una tira fina con los colores de las fases de reparación (`.tej-eje-fase`; naranja, verde y azul, los mismos de la franja, cuyo borde también toma el color de cada fase), para que al hacer scroll se siga viendo en qué fase cae cada columna (petición del usuario, 2026-10). El icono de la cabecera es un cronograma, no un reloj, para no confundirlo con el chip «⏱ Breve» |

El eje no es lineal: tiene las 8 columnas del wiki (de 1–3 días a 2 años), todas del mismo ancho. Cada columna tiene `hasta` (su último día), y con eso se colocan la franja de fases y la línea «Hoy» dentro de la columna, de forma lineal entre su primer y su último día.

## Correcciones respecto al wiki

- **Un solo color por fila.** En el wiki, la versión de escritorio pintaba la rotura muscular de grado III y el esguince de grado III con dos intensidades, y la de móvil con una. Ahora cada fila tiene una sola gravedad: mínima, leve, moderada o grave/reconstrucción. Los rangos de columnas de las filas del wiki no cambian (un test lo fija).
- **«Tendinopatía / Ruptura» se separa en dos filas.** «Tendinopatía» conserva el rango del wiki, con una nota: no es un plazo de cicatrización, sino de adaptación a la carga. «Rotura / reparación de tendón» es nueva: va de 5–8 semanas a 2 años, según Wu 2017 (Wu, Nerlich y Docheva, *EFORT Open Rev* 2(7):332; acceso abierto, leído entero, 2026-10). Wu dice que la remodelación «empieza a las 6–8 semanas de la lesión y dura alrededor de 1–2 años, según la edad y el estado del paciente», y que el tendón curado no suele recuperar las propiedades mecánicas del sano. Es biología de la curación y no plazos de vuelta a la actividad, y así lo dice la nota de la fila. Al principio iba de 2–3 meses a 1 año, marcada «pendiente de fuente».
- **«Dolor inducido por ejercicio»** pasa a llamarse «Dolor muscular tardío (DOMS)». El wiki usaba los dos nombres según la pantalla.
- **Leyenda de colores.** El wiki no tenía.
- **Franja de fases de reparación**, nueva: inflamatoria (días 0–5), proliferativa (día 5 a semana 3) y remodelación (semana 3 a 1 año). La fuente es Wallace 2023 (StatPearls, «Wound Healing Phases»; PDF del usuario, leído entero, 2026-10). Ese capítulo habla de heridas de la piel, así que el panel lo presenta como modelo general, con un aviso de que en tendón, ligamento y hueso los tiempos varían. Del capítulo salen estos datos: inflamatoria «varios días»; colágeno nuevo «hacia los días 5–7»; proliferativa «varias semanas»; remodelación desde «la semana 3» y «hasta 12 meses»; resistencia máxima de una incisión a las 11–14 semanas, con una cicatriz de ~80 % de la resistencia original.
- **Notas generales**: los rangos dependen del paciente y de la carga; el dolor y la función no siguen por fuerza el calendario del tejido; en el paciente posquirúrgico manda el protocolo del cirujano.

## Pendiente

- **Fuente del wiki sin verificar** (`'Snyder-Mackler 2012'` en `data/referencias.js`). Es probablemente el cap. 3, «Developing Treatment Pathways», de Andrews, Harrelson y Wilk, *Physical Rehabilitation of the Injured Athlete*, 4.ª ed. (Elsevier, 2012). Coinciden el título y el año, pero no está confirmado que el capítulo sea de Snyder-Mackler. El usuario no tiene el libro (2026-10), así que las filas que la citan siguen siendo las del wiki sin verificar.
- **Fila nueva sin fuente**: va con `pendiente: true` hasta tener una fuente leída. Al añadirla: clave en el registro, en `fuentes` de la fila, quitar `pendiente` y ejecutar `node tests/gen-referencias.mjs`. Hoy ninguna fila está pendiente.
- **Revisar las gravedades.** El color de la fractura (moderada) y el del tendón vienen de la intensidad que usaba el wiki, que no tenía leyenda.
- **Ampliación** (opción descartada para la primera versión): cartílago y menisco (zona vascular y avascular), fractura de estrés, nervio periférico, y la ligamentización del injerto de LCA más allá del año.

## Filtro por tejido y subtipos (2026-10)

- **Filtro**: encima del diagrama, unas pastillas «Todos · Tendón · Músculo · Ligamento · Hueso» (`data-filtro-tejido`). El título de cada grupo («LIGAMENTO») también filtra, y si el grupo ya está filtrado vuelve a «Todos». El eje fijo, la tira y la franja de fases y la línea «Hoy» se ven con cualquier filtro. La elección se recuerda en el dispositivo (`localStorage['physiq-assessment-tejidos-filtro']`, con try/catch; es una preferencia de interfaz, como el tema). A 320 px las pastillas pasan a dos líneas sin cortarse.
- **Remodelación más allá del año**: la tira se cortaba al año (Wallace 2023: «hasta 12 meses»), pero la barra del tendón sigue hasta los 2 años. Ahora hay una cuarta fase, «Remodelación (tendón)», del año 1 al 2, que cita a Wu 2017 y lleva `tejido: 'tendón'`; se pinta más clara (`.tej-fase-parcial`) porque no vale para todos los tejidos.
- **Subtipos**: una fila puede llevar `subtipos`, con la misma forma que una fila; sin `gravedad`, toman la de la fila madre. Se pintan plegados bajo ella en un `<details>` («Ver N subtipos»). La estructura y su validación (`tests/unit/tejidos.mjs`) están hechas, pero no hay ningún subtipo todavía: cada uno necesita su propia fuente leída. Propuesta de qué subtipos abordar y en qué orden, con sus fuentes candidatas: `MIGRATION_PLAN.md`, **Fase J**.

## Fase J, 1: esguince lateral de tobillo (2026-10)

Cuatro subtipos bajo las filas de esguince del wiki: «Tobillo, ligamento lateral» en los grados I, II y III, y «Tobillo, reparación quirúrgica» bajo el grado III. Fuentes, en PDF del usuario y leídas enteras:

- **Bergman 2025** (StatPearls, «Acute Ankle Sprain», act. 2025-08-02). Apartados «Short-Term Prognosis» y «Return-to-Sport Timeline»: grado I, 1–2 semanas; grado II, 3–6; grado III, 6–12 o más, a veces con cirugía por inestabilidad persistente; tras la reparación, vuelta al juego hacia los 3–4 meses. Es la fuente de los rangos, porque es la única que gradúa.
- **Vuurberg 2018** (guía holandesa, BJSM; nueva en el registro). Tabla 7, que la guía de Martin reproduce como figura 2. No usa grados: vuelta completa al trabajo y al deporte a las 3–4 semanas en la «distorsión», a las 6–8 en la «rotura parcial o total» y a las 12–16 tras la cirugía. Va en la nota del grado II (contrasta con los 3–6 de Bergman) y en la reparación.
- **Martin 2021** (guía JOSPT). Del pronóstico solo se usa un dato: un 5–33 % sigue con dolor al año o más (nota del grado III).

Semanas → columnas del eje: 1–2 semanas = «4–14 d»; 3–6 = «3–4 s» y «5–8 s»; 6–12 = «5–8 s» y «2–3 m»; 12–16 = «2–3 m» y «3–6 m». Un test fija los cuatro rangos. El resumen plegable pasa a «Ver N subtipos», porque «de esguince grado iii» en minúsculas estropeaba el número romano. Revisado y aprobado por el usuario tal cual (2026-10): la barra del grado II sigue a Bergman y la reparación cuelga del grado III.

## Fase J, 2: ligamentos de rodilla (2026-10)

Tres subtipos. Fuentes, en PDF del usuario y leídas enteras:

- **Naqvi y Sherman 2023** (StatPearls, «Medial Collateral Ligament Knee Injury»; nueva en el registro). Grado I: «return to play within ten to 14 days» → subtipo «Rodilla, ligamento colateral medial» bajo el grado I, en «4–14 d». El grado II tiene «more variable timelines» y se decide por criterios (fuerza igual en las dos piernas, sin dolor al valgo). El grado III se trata con o sin cirugía, sin plazo. Esos dos no se pintan: no hay rango que poner.
- **Evans 2023** (StatPearls, «Anterior Cruciate Ligament Knee Injury»; nueva). Sin cirugía (baja demanda, sin giros ni saltos, roturas parciales): «12 weeks of supervised physiotherapy» tras la fase aguda. Se pinta de «3–4 s» a «2–3 m», bajo el grado III, con la nota de que es la duración del programa y no cicatrización. Reconstruido: vuelta a la actividad o al deporte a los 6–12 meses de media, y el injerto «up to 18 months or more» en incorporarse. Se pinta de «6m–1a» a «2a», bajo «Injerto».
- **Logerstedt 2017** (guía JOSPT). No da plazos: la vuelta al deporte es por criterios. Al año, sin derrame, sin inestabilidad y con IKDC > 93 %, la vuelta al deporte es «more than 14 times more likely» (PLR = 14,54). Solo va en la nota del reconstruido.

Revisado y aprobado por el usuario tal cual (2026-10), incluida la barra del LCA sin cirugía como duración del programa.

## Menisco, grupo propio (2026-10)

Decisión del usuario: el menisco irá como grupo propio («Menisco», con su pastilla en el filtro), no como subtipo de ligamento. Es fibrocartílago, con otra biología y otra vascularización, y sus tratamientos (conservador, meniscectomía, sutura) tienen plazos propios. El grupo se crea con su primera fila con fuente leída, nunca vacío. Fase J, fila 3.

## Fase J, 3: menisco (2026-10)

Grupo `menisco`, entre ligamento y hueso. El wiki no tenía fila de menisco, así que no hay fila madre: cada fila es un tratamiento y no lleva subtipos. «Conservador» se parte en dos filas porque la fuente separa la rotura traumática de la lesión degenerativa, con plazos y grados distintos. Fuentes, en PDF del usuario:

- **Prill 2025** (consenso formal EU-US de rehabilitación del menisco, parte II; leído entero):
  - Rotura traumática con rodilla estable: un programa de 12 semanas de ejercicio neuromuscular supervisado da resultados parecidos a la cirugía (grado B). Se pinta en «2–3 m» como duración del programa, no como cicatrización. La nota añade que las roturas de la raíz o radiales agudas pueden beneficiarse de cirugía precoz (es de la discusión, sin grado).
  - Lesión degenerativa: la fisioterapia es el primer tratamiento (grado A), durante 3–6 meses antes de plantear la cirugía. Se pinta en «3–6 m».
  - Vuelta al deporte: 4–12 semanas tras la meniscectomía parcial («3–4 s» a «2–3 m») y 6–9 meses tras la sutura («6m–1a»), ambos de grado C. En los estudios, la vuelta al juego tras una sutura aislada va de 3,3 a 10 meses.
- **Logerstedt 2018** (guía JOSPT de menisco y cartílago; leídos el pronóstico y las intervenciones):
  - Tras la meniscectomía, los menores de 30 años y los deportistas de élite vuelven antes de 2 meses (54 días en Kim) y los mayores de 30 hacia los 3 meses (89 días). Los déficits de los primeros 6 meses pueden tardar hasta 2 años en resolverse.
  - Tras la sutura, carga progresiva precoz y vuelta progresiva precoz a la actividad (grado C).

Gravedad: moderada en las tres primeras filas y grave en la sutura. Revisado y aprobado por el usuario tal cual (2026-10).

## Fase J, 4: fracturas por localización (2026-10)

Doce subtipos bajo la fila «Fractura», sacados de los 8 capítulos de StatPearls del registro (PDF del usuario, releídos enteros). Casi ninguno da el tiempo de consolidación completa: dan el de inmovilización, descarga o vuelta a la función, y la nota de cada subtipo dice cuál.

| Subtipo | Barra | Fuente y plazo |
|---|---|---|
| Tobillo, estable sin cirugía | 5–8 s | Hermena y Slane 2025: función previa a las 6–8 semanas |
| Tobillo, operada | 5–8 s | Ídem: carga completa a las 6–8 semanas; la recuperación completa, más larga y sin plazo |
| 5.º metatarsiano, avulsión (zona 1) | 3–4 s a 5–8 s | Smidt y Massey 2023: carga según tolerancia en 3–6 semanas |
| 5.º metatarsiano, Jones (zona 2) sin cirugía | 5–8 s | Ídem: 6–8 semanas sin carga |
| 5.º metatarsiano, estrés (zona 3) | 2–3 m a 3–6 m | Ídem: hasta 20 semanas |
| Otros metatarsianos, no desplazadas | 3–4 s a 5–8 s | Agrawal y Tiwari 2023: 4–6 semanas de yeso de marcha |
| Calcáneo, extraarticular | 2–3 m | Seaman y Bergman 2026: 10–12 semanas de inmovilización |
| Calcáneo, intraarticular desplazada | 2 a (grave) | Ídem: recuperación de 12–18 meses |
| Navicular, por estrés | 5–8 s | Gheewala 2023: 6–8 semanas de inmovilización |
| Rótula, sin cirugía | 5–8 s | Mabrouk y Pilson 2026: 6–8 semanas en extensión |
| Meseta tibial, sin cirugía | 2–3 m a 3–6 m | Malik y Herron 2023: consolidación hasta las 12 semanas, función a las 16–20 o más |
| Meseta tibial, operada | 2–3 m (grave) | Ídem: 6 semanas sin carga y 6 de carga parcial |

No se pintan, porque su capítulo no da plazo: el húmero proximal (Pencle y Varacallo 2023: solo péndulos a los 10–14 días), la rótula operada y la fractura traumática del navicular. Las fracturas por estrés del 5.º metatarsiano y del navicular van aquí porque su capítulo es el de la localización; la fila general «Fractura de estrés» (fila 5) queda para May y Marappa-Ganeshan 2023.

Al releer el registro apareció un error de la Fase J 1: la nota de los plazos del esguince de tobillo estaba en Agrawal y Tiwari 2023, no en Bergman 2025. Corregido.

Revisado y aprobado por el usuario tal cual (2026-10).

## Fase J, 5: fractura de estrés (2026-10)

Fila nueva «Fractura de estrés» en hueso («5–8 s» a «6m–1a», moderada), con 10 subtipos por localización. Fuentes, en PDF del usuario, leídas enteras:

- **Hoenig 2023** (Br J Sports Med; revisión sistemática y metaanálisis de 76 estudios, nueva en el registro): tiempo medio de vuelta al deporte por localización, de las tablas 1A y 1B del suplemento. Tibia posteromedial 44 días, peroné 56, pubis 77, metatarsianos 1.º–4.º 78, 5.º metatarsiano 82, diáfisis femoral 86, maléolo medial 106, cuello femoral 107 y navicular 127. También da la tasa de vuelta y de complicaciones. De la tibia anterior no hay tiempo agrupado.
- **Robertson y Wood 2017** (World J Orthop; revisión narrativa de acceso abierto, nueva en el registro): la lista de alto riesgo (tibia anterior, base del 5.º metatarsiano, maléolo medial, cuello femoral lateral, navicular y sesamoideos) y la tibia anterior incompleta, con vuelta al deporte a los 7 meses con o sin cirugía.
- **May y Marappa-Ganeshan 2023** (StatPearls): solo la regla general, que va en la nota de la fila. En bajo riesgo, 2–6 semanas de reposo relativo o descarga y vuelta gradual; en alto riesgo no da plazo.

Cada subtipo lleva «(bajo riesgo)» o «(alto riesgo)» en el nombre; los de alto riesgo, en color grave. La barra es la vuelta al deporte media, no la consolidación. El navicular y el 5.º metatarsiano también salen en «Fractura» con el plazo de inmovilización de su capítulo (Fase J, 4), y la nota del navicular lo dice. Los sesamoideos y el astrágalo no se pintan: Hoenig no da tiempo agrupado para ellos.

Revisado y aprobado por el usuario tal cual (2026-10).

## Fase J, 6: Aquiles (2026-10)

Dos subtipos bajo «Rotura / reparación de tendón». La fuente es **Shamrock 2023** (StatPearls, «Achilles Tendon Rupture», PDF del usuario leído entero).

- **Aquiles sin cirugía**: barra rayada de protección, de «5–8 s» a «2–3 m». Sigue el programa funcional de Glazebrook y Rubinger que cita el capítulo: 0–2 semanas sin carga, después bota con alzas y carga progresiva, y la bota se retira entre las 8 y las 12 semanas. La nota recoge la rerrotura: del 10 al 40 % en estudios antiguos, frente al 1–2 % con cirugía; la evidencia de nivel 1 más reciente no encuentra diferencia.
- **Aquiles reparado**: barra lisa de vuelta al deporte, en «6m–1a». El capítulo da ejercicio de bajo impacto los primeros 6 meses y de alto impacto después, hacia la vuelta al deporte. En deportistas profesionales, más del 30 % no vuelve a jugar.

La inmovilización tras la cirugía (2–4 semanas) no se pinta: la frase del capítulo está mal redactada y mezcla los dos tratamientos.

Revisado y aprobado por el usuario tal cual (2026-10), incluido no pintar la inmovilización tras la cirugía.

**Manguito rotador reparado** (2026-10). La fuente es **Thigpen 2016**, el consenso de la ASSET tras la reparación artroscópica (PDF del usuario, leído entero, nuevo en el registro). Es nivel V, opinión de expertos, con grado SORT en algunas recomendaciones. Lleva dos subtipos bajo la rotura de tendón:

- **Protección**, barra rayada en «5–8 s»: 2 semanas de inmovilización estricta y movilidad pasiva protegida hasta la 6.ª semana, con grado A en roturas pequeñas o medianas; 6 semanas de inmovilización si preocupa la cicatrización. A las 6 semanas la reparación conserva solo el 19–30 % de su resistencia normal.
- **Rehabilitación**, barra de contorno (programa) en «3–6 m»: movilidad activa desde la 6.ª semana, fuerza desde la 12.ª y fortalecimiento avanzado de la 20.ª a la 26.ª, solo para alta demanda. El trabajo específico de deporte o trabajo puede empezar hacia los 4–5 meses, y el tendón no se acerca a su resistencia normal hasta los 6 meses como pronto.

Revisado y aprobado por el usuario tal cual (2026-10).

## Fase J, 7: isquiotibiales por la clasificación BAMIC (2026-10)

La escala de la fila «Rotura grado I–III» no encaja con la de las fuentes: las lesiones de isquiotibiales se gradúan con la British Athletics Muscle Injury Classification (BAMIC), que va del 0 al 4 por la RM y añade la localización («a» miofascial, «b» unión miotendinosa, «c» dentro del tendón). Por eso no son subtipos de los grados I–III, sino una fila nueva en «Músculo», «Isquiotibiales (clasificación BAMIC)», con sus propios subtipos. Todos son `deporte` (días hasta volver al entrenamiento completo). PDF del usuario, leídos enteros: Pollock 2014 (la clasificación, sin plazos), Pollock 2016 (tabla 3), Hollabaugh 2023 (revisión sistemática; su tabla 1 recoge los días de Pollock 2022, que no se ha leído en el original) y Macdonald 2019 (tabla 3, plazos aproximados del programa de British Athletics).

| Subtipo | Barra | Días medios hasta el entrenamiento completo |
|---|---|---|
| Grado 0 (RM normal) | «4–14d» | 10 (Pollock 2016); 9 (Pollock 2022) |
| Grado 1a/1b | «4–14d» a «3–4s» | 18 y 18; 12 y 17; programa de una 1a, días 5–10 |
| Grado 2a/2b | «3–4s» | 25 y 21; 19 y 19; programa de una 2b, días 14–28 |
| Grado 2c | «3–4s» a «5–8s» | 27; 35. Recaída del 63 % (Pollock 2016) |
| Grado 3c | «5–8s» a «2–3m» | 84 (40–128); 51,5; programa de una 3c, semanas 6–9. Recaída del 57 % |

Sin barra: 3a y 3b (ninguna lesión y una sola en Pollock 2016) y grado 4, rotura completa (ninguna). Hollabaugh 2023 atribuye a Macdonald 2019 «hasta 3 semanas» en «a», «4 a 8» en «b» y «2 a 4 meses» en «c», pero esas cifras no están en el artículo de Macdonald, así que no se usan. Los datos son de atletas de élite con RM en la primera semana, y la nota de la fila lo dice. Beattie 2023 (metaanálisis b frente a c) no se ha conseguido y no se cita.

Revisado y aprobado por el usuario tal cual (2026-10).

## Ampliación: fracturas de miembro superior (2026-10)

A propuesta del usuario, tras cerrar la Fase J. Dos subtipos nuevos bajo «Fractura», los dos `proteccion`: **5.º metacarpiano (del boxeador), sin cirugía** («3–4s» a «5–8s»: consolidación clínica y radiográfica a las 4–6 semanas; Malik 2024) y **diáfisis de radio y cúbito, operada** («2–3m»: consolidación hacia los 2–3 meses, y entonces la mayoría de las actividades; Small 2022). El **radio distal** del adulto no tiene plazo en su capítulo de StatPearls (Corsino 2023 solo los da para niños), así que sale de la guía APTA (Mehta 2024) y de un metaanálisis de la duración del yeso (Sayudo 2024), en dos subtipos `proteccion`: **sin cirugía (yeso)**, «3–4s» a «5–8s» (yeso 4–6 semanas; 3–4 semanas dieron mejor función que 5–6, sin más complicaciones), y **operada**, «4–14d» a «5–8s» (férula de días a semanas; movilidad activa en las 3 primeras semanas, grado A, y fortalecimiento submáximo desde la 2.ª, grado B; el enfoque clásico espera 4–6 semanas).

## Ampliación: grupo «Articulación» y medida «evolución natural» (2026-10)

Grupo nuevo «Articulación», para lo que afecta a la cápsula o a la articulación entera y no a un ligamento aislado. **Luxación anterior de hombro** (`proteccion`, «4–14d» a «5–8s»): cabestrillo de 1 a 6 semanas, también tras la cirugía, sin pruebas de qué plazo o posición es mejor (Pak y Kim 2023); la nota da la recidiva en jóvenes y la vuelta al nivel previo con y sin reparación de Bankart (Abdel Khalik 2025, metaanálisis, que cita a Buss 2004 para los 10 días en temporada). **Capsulitis adhesiva** («2–3m» a «2a»): de unos meses a 2–3 años, con sus tres fases en la nota (Li 2025). Como no es una lesión que cicatriza, sino lo que dura la enfermedad hasta resolverse, lleva una medida nueva, `evolucion` («Evolución natural (hasta que se resuelve)»), con relleno `degradado`, que también servirá para la lumbalgia.

**Prótesis** (bloque 1 de la ampliación; los dos artículos de Pasqualini 2023 no estaban disponibles), dos filas más en «Articulación», las dos `deporte`: **prótesis total de rodilla** («3–6m» a «6m–1a»: vuelve al deporte el 19 % a los 3 meses, el 70 % a los 6 y el 84 % al año; Magan 2021, metaanálisis; la guía APTA, Jette 2020, aporta el inicio de la fisioterapia en 24 horas y la fuerza de alta intensidad en la 1.ª semana, pero no plazos) y **prótesis total de cadera** («2–3m» a «3–6m»: la mayoría vuelve en 6 meses y la mitad en 3; los cirujanos permiten el deporte a las 6–12 semanas o a los 3 meses; Telang 2024, revisión sistemática).

La prótesis de cadera añade la **vuelta al trabajo** de Pan 2024 (metaanálisis de la vía anterior directa, PDF del usuario): 30–60 % a los 3 meses y 87 % al año, con pocos datos.

## Ampliación: grupo «Columna» (2026-10)

Bloque 8 de la ampliación. Grupo nuevo «Columna», entre «Articulación» y «Hueso», con tres filas `evolucion` (lo que tarda en resolverse el cuadro, no un plazo de cicatrización): **lumbalgia aguda inespecífica** («1–3d» a «2–3m»: la mitad se resuelve en 1–2 semanas y el 90 % en 6–12; Alexander 2024 y Margetis y Singh 2025, StatPearls), **radiculopatía lumbar (ciática)** («3–4s» a «6m–1a»: la mayoría en 4–6 semanas, Davis 2024; en atención primaria solo el 55 % ha mejorado la discapacidad al año, Konstantinou 2018, cohorte ATLAS; tras discectomía, 73 % sin dolor de pierna al año, Alexander 2024) y **radiculopatía cervical** («5–8s» a «2a»: más del 85 % de las agudas en 8–12 semanas, Margetis y Magnus 2025; recuperación completa a los 24–36 meses en el 83 %, Wong 2014, revisión sistemática). El grupo servirá también para la columna operada (bloque 2).

## Ampliación: codo y sindesmosis (2026-10)

Bloques 5 y 6 de la ampliación, PDF del usuario leídos enteros. **Luxación posterior de codo (simple)**, en «Articulación», `proteccion` («4–14d» a «3–4s»): férula a 90° de 5 a 10 días y luego movilidad activa; las inestables, hasta 3 semanas (Waymack y An 2023, StatPearls). **Cabeza de radio, sin cirugía**, subtipo de «Fractura», `proteccion` («4–14d» a «3–4s»): yeso o cabestrillo 2–3 semanas en las no desplazadas o poco desplazadas (Patiño y Saenz 2023, StatPearls). **Esguince de la sindesmosis**, fila nueva en «Ligamento», `deporte`, con dos subtipos: sin cirugía («5–8s», 39 días de media) y operada («2–3m», 71 días), de Salameh 2022 (metaanálisis, 1133 esguinces), con la tasa de vuelta del 96 % y la equivalencia de la sutura dinámica de Li y Sun 2026 (metaanálisis, deportistas de élite).

**Gemelo y recto femoral no se pintan**: el capítulo de StatPearls del gemelo (Hsu y Chang 2023) no da plazos, y Hollabaugh 2023 agrupa la vuelta al deporte por grado BAMIC con todos los músculos juntos (isquiotibiales, cuádriceps, gemelo y sóleo), sin un tiempo por músculo. Quedan pendientes de una fuente con plazos por músculo.

## Ampliación: columna operada (2026-10)

Bloque 2 de la ampliación, PDF del usuario leídos. Tres filas `deporte` (vuelta al trabajo, no consolidación) en «Columna»: **artrodesis lumbar** («5–8s» a «6m–1a»: 7 semanas mínimamente invasiva y 11 abierta en un mismo estudio, de 3 a 11 meses según técnica y serie; Wang 2017; movilización el mismo día y fisioterapia desde el 2.º, Cui 2026; ejercicio, mejor con terapia cognitivo-conductual, hasta 6 meses, Bogaert 2022), **prótesis de disco cervical** («5–8s», mediana de 48 días) y **artrodesis cervical anterior** («2–3m», 61 días), las dos de Health Quality Ontario 2019. La **prótesis de disco lumbar** no se pinta: Khan 2026 solo compara con la artrodesis, sin plazos absolutos agrupados (lo dice la nota de la artrodesis). **Fractura vertebral por compresión, sin cirugía**, subtipo de «Fractura», `proteccion` («3–4s» a «2–3m»): corsé de 4 a 12 semanas (Donnally 2025); los síntomas suelen ceder en 4–6 semanas y la **vertebroplastia/cifoplastia** queda para el dolor que no cede, sin plazo de recuperación en su capítulo (Margetis y Patel 2025), así que tampoco se pinta.

Después, con PDF del usuario: la **prótesis de disco lumbar** sí se pinta («2–3m» a «3–6m»: vuelta al trabajo a los 75 días de mediana frente a 96 con artrodesis, Gornet 2011; cerca del 70 % vuelve al deporte en 6 meses, Siepe 2007; servicio militar sin restricciones a las 22,6 semanas, Tumialán 2010; a los 5 años, resultados parecidos a la artrodesis, Patel 2026, y Khan 2026 pasa a esta fila). Tumialán 2010 alarga las filas cervicales hasta el trabajo físico exigente (prótesis, 10,3 semanas: «5–8s» a «2–3m»; artrodesis, 16,5: «2–3m» a «3–6m»). La **vertebroplastia/cifoplastia** sigue sin barra: no hay plazo de recuperación; la nota de la fractura vertebral añade, de Yuan 2016 (metaanálisis, leído en PMC), que alivian el dolor en el postoperatorio inmediato y mejoran la función frente al tratamiento conservador, pero frente a la inyección simulada el dolor es igual.

## Ampliación: gemelo y sóleo, recto femoral y aductores (2026-10)

Con PDF del usuario buscados para tener plazos por músculo (Hsu y Chang 2023 no daba plazos y Hollabaugh 2023 mezcla músculos), tres filas `deporte` en «Músculo»: **gemelo y sóleo**, con cuatro subtipos por la gradación de Prakash 2018 según la lesión del tejido conectivo en la RM (grado 0, 8 días; 1, 17; 2, 25; 3, 48), más el sóleo de Pedret 2015 (29 días; aponeurosis central 44, lateral 19), la lesión de la aponeurosis de Green 2020 (19 frente a 31 días) y la revisión de Pedret 2026 (decidir por criterios, no por plazos); **recto femoral, rotura completa o avulsión proximal** (Knapik 2023), sin cirugía («2–3m», 11,7 semanas) y operado («3–6m», 22,1 semanas); y **aductores** («4–14d» a «3–4s», 14–20 días en futbolistas profesionales; Forsythe 2025).

Con esto quedan hechos todos los bloques de la ampliación.

## Fase J, 9: nervio periférico (2026-10)

Grupo nuevo «Nervio periférico». Decisión del usuario: una barra para la neuropraxia y la axonotmesis como nota, porque su plazo depende de la distancia que tiene que crecer el nervio y una barra fija engañaría. Para eso los grupos admiten `nota` (texto bajo el título del grupo) con sus fuentes en `notaFuentes`, que `tests/referencias.mjs` cuenta como «Nota del grupo». PDF del usuario, leídos enteros: Sharma y Munakomi 2026 («Neurapraxia»), Hall 2026 («Axonotmesis») y Nadi 2026 («Peripheral Nerve Injury»), los tres de StatPearls; Robinson 2022 (Muscle Nerve) y Menorca 2013 (Hand Clin, manuscrito de autor).

| Qué | Cómo | Fuente |
|---|---|---|
| Neuropraxia (Sunderland I) | barra «1–3d» a «2–3m», leve, `deporte` (vuelta a la función) | De días a semanas (Nadi); la mitad de las de deporte, menos de 1 semana fuera, y casi todas antes de los 3 meses (Sharma y Munakomi; Robinson, tabla 1) |
| Axonotmesis (Sunderland II–IV) | nota del grupo, sin barra | Cruza la lesión en 8–15 días y luego ≈1 mm/día, más rápido en aplastamientos, jóvenes y segmentos proximales (Robinson); 0,5–3 mm/día (Nadi); 1–3 y 1–2 (Hall); 2–3 proximal y 1–2 distal (Menorca). Músculo reinervable 1 año (Hall, Menorca) a 18–24 meses (Robinson); la recuperación motora se estanca a los 18–24 meses (Robinson). Sin recuperación a los 3 meses, derivar (Hall, «rule of 3s»; Nadi, 3–4 meses) |
| Neurotmesis (Sunderland V) | en la misma nota | No se recupera sin cirugía (Nadi, Robinson) |

Ashley y Lui 2023 («Physiology, Nerve», ya en el registro) no se cita: su PDF no estaba en esta sesión y las otras cinco fuentes cubren lo necesario.

Revisado y aprobado por el usuario tal cual (2026-10).

## Fase J, 8: tendinopatías (2026-10)

La tendinopatía no tiene un plazo de cicatrización. Lo que hay es la duración de los programas de carga, así que los 7 subtipos bajo «Tendinopatía» van con contorno («programa»). Cada uno sale de la fuente de la pauta de su hipótesis, ya leída entera en sesiones anteriores.

| Subtipo | Barra | Fuente (hipótesis) |
|---|---|---|
| Rotuliana | «2–3 m» | Ophey 2025 (ro5): resistencia progresiva de cuádriceps durante al menos 12 semanas |
| Aquílea, porción media | «5–8 s» a «3–6 m» | Chimenti 2024 (tp8): de 6 semanas a 6 meses sin diferencias; VISA-A a las 12 semanas |
| Aquílea, insercional | «2–3 m» | Jonsson 2008 y Pringels 2025 (tp9): 12 semanas |
| Isquiotibiales, proximal | «2–3 m» | Rich 2025 (ca9): 6 sesiones en 12 semanas |
| Glútea | «5–8 s» | Mellor 2018 (ca4): 14 sesiones en 8 semanas; éxito del 77 % a las 8 semanas y del 79 % al año |
| Epicondilalgia lateral | «5–8 s» a «2–3 m» | Lucado 2022 (co1): 6–12 semanas |
| Epicondilalgia medial | «2–3 m» | See 2026 (co2): los estudios, 12 semanas |

Lopes 2025 (Cochrane, rotuliana) no se cita, porque de ella solo está leído el resumen. La fila madre sigue siendo la del wiki, sin especificar qué mide.

Revisado y aprobado por el usuario tal cual (2026-10).

## Qué mide cada barra (2026-10)

Decisión del usuario. Las fuentes dan plazos de cosas distintas, y antes solo la nota lo decía, así que barras como la de la fractura de Jones (6–8 semanas sin carga) y la del 5.º metatarsiano por estrés (82 días hasta volver al deporte) parecían comparables. Cada fila y cada subtipo lleva ahora `mide`, que es una clave de `medidas` (`data/tejidos.js`). El color sigue siendo la gravedad, porque un segundo código de color daría 4 × 4 combinaciones ilegibles; la medida va en el relleno:

| `mide` | Relleno | Dónde |
|---|---|---|
| `deporte` (vuelta al deporte o a la función) | liso | esguince de tobillo, LCM grado I, LCA reconstruido, meniscectomía, sutura, tobillo estable, calcáneo intraarticular, meseta sin cirugía, toda la fractura de estrés, isquiotibiales (BAMIC) |
| `proteccion` (inmovilización o descarga) | rayado | el resto de fracturas por localización |
| `programa` (duración del programa) | contorno | LCA sin cirugía, rotura de menisco traumática y lesión degenerativa |
| `biologia` | liso + etiqueta «biología» | rotura de tendón (Wu 2017) |
| `sinEspecificar` | liso + etiqueta «sin especificar» | las filas del wiki (Snyder-Mackler 2012) |

La clasificación sale de las citas que ya estaban en los comentarios; no se ha releído ninguna fuente. Debajo de la leyenda de gravedad, «Qué mide la barra» muestra cada relleno en gris neutro y las dos etiquetas. En el wiki es igual. En su tabla de móvil solo se ven los rellenos, porque el nombre corto de la barra no tiene sitio para la etiqueta. Un test unitario obliga a que todas las filas y subtipos lleven `mide` y fija la clasificación.

Revisado y aprobado por el usuario tal cual (2026-10). Eso incluye los tres casos dudosos: tobillo operada como protección (la fuente da la carga completa, no la vuelta al deporte), meseta tibial sin cirugía como vuelta a la función (la barra llega a la función completa) y 5.º metatarsiano zona 3 como protección (hasta 20 semanas de inmovilización).

## Un relleno por medida y leyenda en dos partes (2026-10)

El usuario no entendía «sin especificar»: la etiqueta iba tras el nombre, pero la barra se pintaba lisa, igual que «Vuelta al deporte». Tampoco la leyenda: las muestras de relleno eran grises y en el diagrama las barras salen en el color de su gravedad. Cambios (decisión del usuario): cada medida tiene su propio relleno (`punteado` para biología de la reparación; `tenue`, relleno claro con borde discontinuo, para sin especificar) y desaparecen las etiquetas; la leyenda dice «Color = gravedad:» y «Relleno = qué mide la barra (en el color de su gravedad):». Un test unitario exige que no haya dos medidas con el mismo relleno. Copiado en physiq-wiki.

## Filtro sin «Todos», en una fila (2026-10)

Decisión del usuario. Se quita la pastilla «Todos»: volver a tocar la pastilla activa la desmarca y se ven todos los tejidos, con la misma regla que el resto de grupos de opciones de la app (mecanismo, cronología, NRS). El título de cada grupo hace lo mismo. Las pastillas van en una sola fila que se desliza en horizontal cuando no caben (a 320 px, y cuando la Fase J añada grupos como nervio periférico), con un degradado en el lado por el que quedan más (`_bordesFiltroTejidos()`, `app.js`). Al abrir el panel con un filtro guardado, la pastilla activa queda a la vista. Se descartó un desplegable: escala igual de bien, pero esconde las opciones y cuesta un toque más. Si algún día hubiera más de unas 8 categorías, se replantea (agrupar, o desplegable).

## Leyenda de fases en vez de franja (2026-10)

La franja «Fases de reparación» llevaba el nombre de cada fase dentro de su tramo, y en móvil se cortaba («Inflama…», «Prolifera…»): inflamatoria y proliferativa ocupan una columna cada una, unos 45 px. Como la tira de colores del eje fijo ya muestra dónde cae cada fase, la franja se sustituye por una leyenda que se ajusta en líneas: muestra de color, nombre entero y rango corto (`rangoFase()`: «días 0–5», «día 5–sem. 3», «sem. 3–1 año», «1–2 años»). La tira dice dónde y la leyenda dice qué. El párrafo de debajo deja de repetir los rangos y se queda con la nota (modelo de la herida cutánea, resistencia del 80 %). La línea «Hoy» sigue en el eje y en cada barra. El wiki tiene la misma leyenda (decisión del usuario).

## Pruebas

- `node tests/unit.js`, tema «tiempos de tejido»: integridad de los datos, rangos del wiki fijados, `posicionDia`/`marcaHoy`, HTML (barras, «pendiente de fuente», línea «Hoy») y que no llegue a resúmenes ni informes.
- `node tests/smoke.mjs`, «⏱ Tiempos de recuperación»: diálogo en escritorio, «Hoy» a las 6 semanas por la UI real, Escape y velo, hoja inferior en móvil con atrás, cabecera y panel a 320 px, botón visible en el hub.
- La fuente cuenta en `docs/referencias.md` como uso «tiempos de tejido» (región «Todas (tiempos de tejido)»).
