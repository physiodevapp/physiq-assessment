# Entrena: juego para memorizar los árboles y los tests

Página propia, `entrena.html` (+ `entrena.js`, lógica pura en `lib/entrena.js`), instalable aparte
(`entrena.webmanifest`). Nació como prototipo en una página de claude.ai (2026-11) y se pasó al
repositorio cuando el usuario dio por bueno el formato. Todas las decisiones de abajo son del usuario
(2026-11), tomadas probando el prototipo en el móvil.

## Qué es y qué no es

- Para memorizar **las hojas impresas** del cuaderno: el árbol de decisión (fase 4) y la confirmación
  de hipótesis (fase 4b) de las 7 regiones, con su numeración (`etiquetaPaso`, `numeroHipotesis`).
- Lee los mismos datos que la app (`CIF_TREES`, `HYPOTHESES`) con módulos puros: si cambia un árbol o
  un test, el juego cambia con él, sin regenerar nada. Los destinos de cada respuesta los resuelve
  `resolveOptionTargets()` (lib/arbol.js), como la fase 4; lo que pesa cada test, `pesoTest()`.
- Nunca pide ni guarda datos del paciente. Guarda en `localStorage` solo el progreso de cada región
  (`physiq-entrena-<región>-v1`) y sus preferencias (`physiq-entrena-prefs`: región, sonido, retos de
  todas las regiones, nombres de Pasar el móvil), más el destino de la IA (`ampliar-ia.js`).
- No escribe texto clínico nuevo: los títulos de los pasos son su `tag` de la fase 4 y «qué busca» es
  la primera frase de su `razonamiento.porque` (los dos, revisados).

## Lo que se memoriza

Lo que se deduce leyendo no se pregunta en los modos rápidos (decisión 2026-11, tras ver que el
antiguo «Semáforo» se acertaba sin saberse el árbol): «NO → sin hipótesis» no entra. Se pregunta lo
propio del árbol: el orden de los pasos y qué busca cada uno, qué respuestas tiene cada paso, en qué
paso sale cada hipótesis, qué sale junto, dónde están las derivaciones y los desvíos (lumbar 1 → 1b).

## Modos

- **Hoy:** reto del día de la región (5 preguntas iguales todo el día, mantiene su racha) y de todas.
- **Rápidos:** Desliza (verdadero o falso, 60 s), Flechas (15 preguntas, 3 vidas; fallar una
  derivación cuesta 2), ¿En qué paso? (60 s; fallar dónde está una derivación resta 15), Muerte
  súbita, Mezcla de regiones (70 % árbol, 30 % tests).
- **Para pensar:** Encuentra el error, Completa el paso (solo el número; «Pista» enseña el título y
  entonces no cuenta para el récord), Caso (sigue el camino real, con desvíos), Detective inverso,
  Ordena el árbol, Hoja fantasma (4 niveles, cada uno se abre con el anterior perfecto), Parejas.
- **Fase 4b:** ¿De quién es este test? (las opciones falsas son hipótesis vecinas del árbol), Batería,
  Positivo si… (sin alias, pruebas complementarias ni criterios que solo repiten el nombre:
  `motivoFueraPositivo()`; sin el nombre del test en la opción: `criterioSinNombre()`), ¿Cuánto pesa?
  (solo en regiones con 8 o más tests que puntúan: hombro, lumbar, cadera y rodilla).
- **Con un compañero:** Pasar el móvil (misma pregunta por turnos; no cuenta para el progreso de nadie)
  y Duelo (mismas 10 preguntas con un número; un código de resultado de 9 caracteres con suma de
  control, `codigoResultado()`, compara pregunta a pregunta sin servidor).

Tiempo por pregunta según lo que hay que leer (`segundosLectura()`: 12 s + 1 s cada 40 caracteres,
hasta 30); los puntos por rapidez van en proporción a ese tiempo. Logros, medallas por región, racha,
sonidos (Web Audio, se pueden silenciar) y animaciones (desactivadas con «reducir movimiento»).

## Consultar sin salir

- **Hojas** de cada región: Esencia (el árbol en una línea y qué busca cada paso), Árbol y
  Confirmación, en «Papel» (la imagen de la hoja de `docs/esquemas`, la del cuaderno, con su PDF
  versionado por `huellas.json`) o «Texto» con buscador.
- **Ayuda 📖** en la barra de cada juego (menos Duelo y Pasar el móvil): qué busca cada paso, con el
  reloj parado; la partida sigue pero no cuenta para récords ni logros.
- **«✨ Ampliar con IA»** (`ampliar-ia.js`, el de la app) en los textos de los datos —hojas, preguntas,
  respuestas, hallazgos, tests, porqués— y nunca en la interfaz (títulos, botones, marcadores). Botón
  ✨ «Preguntar a la IA» con la región como único contexto.

## Navegación

Cada pantalla que no es el inicio añade una entrada al historial y cada ventana otra encima: Atrás (el
botón o el gesto del sistema) cierra la ventana o vuelve al inicio, nunca sale de la app desde un
juego; cerrar con su botón gasta su entrada. Deslizar desde el borde izquierdo (24 px, 90 px de
recorrido) hace lo mismo, con una flecha que sigue al dedo; no se activa en Safari de iPhone, que ya
tiene ese gesto, pero sí en la app instalada en iPhone, que no tiene Atrás.

## Instalación

`entrena.webmanifest` con su propio `scope` (`/physiq/assessment/entrena`) e icono: se instala como
una app aparte («Entrena») de la de valoración. Usa el service worker de la app (`sw.js`), que la deja
sin conexión tras la primera visita. Se llega desde la guía (el árbol y la confirmación de cada
región, y por tanto desde el QR de las hojas impresas, y su pie), desde el panel de sesión de la app
(«Entrena ↗», en la región de la valoración) y por `entrena.html#<región>`.

## Pruebas

`tests/unit/entrena.mjs` (datos de las 7 regiones contra la fase 4 y `pesoTest`, el filtro de
«Positivo si…», el código del duelo, el tiempo de lectura, que no importa módulos de la sesión y que
se despliega e instala aparte) y la sección `entrena` de `tests/smoke.mjs` (modos, Atrás, el gesto del
borde, la hoja «Papel», manifest y service worker, 320 px con letra grande).
