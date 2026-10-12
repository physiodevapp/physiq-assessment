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

La inmovilización tras la cirugía (2–4 semanas) no se pinta: la frase del capítulo está mal redactada y mezcla los dos tratamientos. El **manguito rotador reparado** queda pendiente de su fuente, el consenso de la ASSET (Thigpen 2016, J Shoulder Elbow Surg, sin acceso abierto).

Pendiente de revisión por el usuario.

## Qué mide cada barra (2026-10)

Decisión del usuario. Las fuentes dan plazos de cosas distintas, y antes solo la nota lo decía, así que barras como la de la fractura de Jones (6–8 semanas sin carga) y la del 5.º metatarsiano por estrés (82 días hasta volver al deporte) parecían comparables. Cada fila y cada subtipo lleva ahora `mide`, que es una clave de `medidas` (`data/tejidos.js`). El color sigue siendo la gravedad, porque un segundo código de color daría 4 × 4 combinaciones ilegibles; la medida va en el relleno:

| `mide` | Relleno | Dónde |
|---|---|---|
| `deporte` (vuelta al deporte o a la función) | liso | esguince de tobillo, LCM grado I, LCA reconstruido, meniscectomía, sutura, tobillo estable, calcáneo intraarticular, meseta sin cirugía, toda la fractura de estrés |
| `proteccion` (inmovilización o descarga) | rayado | el resto de fracturas por localización |
| `programa` (duración del programa) | contorno | LCA sin cirugía, rotura de menisco traumática y lesión degenerativa |
| `biologia` | liso + etiqueta «biología» | rotura de tendón (Wu 2017) |
| `sinEspecificar` | liso + etiqueta «sin especificar» | las filas del wiki (Snyder-Mackler 2012) |

La clasificación sale de las citas que ya estaban en los comentarios; no se ha releído ninguna fuente. Debajo de la leyenda de gravedad, «Qué mide la barra» muestra cada relleno en gris neutro y las dos etiquetas. En el wiki es igual. En su tabla de móvil solo se ven los rellenos, porque el nombre corto de la barra no tiene sitio para la etiqueta. Un test unitario obliga a que todas las filas y subtipos lleven `mide` y fija la clasificación.

Revisado y aprobado por el usuario tal cual (2026-10). Eso incluye los tres casos dudosos: tobillo operada como protección (la fuente da la carga completa, no la vuelta al deporte), meseta tibial sin cirugía como vuelta a la función (la barra llega a la función completa) y 5.º metatarsiano zona 3 como protección (hasta 20 semanas de inmovilización).

## Filtro sin «Todos», en una fila (2026-10)

Decisión del usuario. Se quita la pastilla «Todos»: volver a tocar la pastilla activa la desmarca y se ven todos los tejidos, con la misma regla que el resto de grupos de opciones de la app (mecanismo, cronología, NRS). El título de cada grupo hace lo mismo. Las pastillas van en una sola fila que se desliza en horizontal cuando no caben (a 320 px, y cuando la Fase J añada grupos como nervio periférico), con un degradado en el lado por el que quedan más (`_bordesFiltroTejidos()`, `app.js`). Al abrir el panel con un filtro guardado, la pastilla activa queda a la vista. Se descartó un desplegable: escala igual de bien, pero esconde las opciones y cuesta un toque más. Si algún día hubiera más de unas 8 categorías, se replantea (agrupar, o desplegable).

## Leyenda de fases en vez de franja (2026-10)

La franja «Fases de reparación» llevaba el nombre de cada fase dentro de su tramo, y en móvil se cortaba («Inflama…», «Prolifera…»): inflamatoria y proliferativa ocupan una columna cada una, unos 45 px. Como la tira de colores del eje fijo ya muestra dónde cae cada fase, la franja se sustituye por una leyenda que se ajusta en líneas: muestra de color, nombre entero y rango corto (`rangoFase()`: «días 0–5», «día 5–sem. 3», «sem. 3–1 año», «1–2 años»). La tira dice dónde y la leyenda dice qué. El párrafo de debajo deja de repetir los rangos y se queda con la nota (modelo de la herida cutánea, resistencia del 80 %). La línea «Hoy» sigue en el eje y en cada barra. El wiki tiene la misma leyenda (decisión del usuario).

## Pruebas

- `node tests/unit.js`, tema «tiempos de tejido»: integridad de los datos, rangos del wiki fijados, `posicionDia`/`marcaHoy`, HTML (barras, «pendiente de fuente», línea «Hoy») y que no llegue a resúmenes ni informes.
- `node tests/smoke.mjs`, «⏱ Tiempos de recuperación»: diálogo en escritorio, «Hoy» a las 6 semanas por la UI real, Escape y velo, hoja inferior en móvil con atrás, cabecera y panel a 320 px, botón visible en el hub.
- La fuente cuenta en `docs/referencias.md` como uso «tiempos de tejido» (región «Todas (tiempos de tejido)»).
