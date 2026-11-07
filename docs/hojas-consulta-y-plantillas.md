# Hojas de consulta, plantillas y hoja neurológica (dermatomas, miotomas, reflejos)

Estado: **decisiones 1–11 aceptadas por el usuario (noviembre 2026). Partes A y B implementadas (PR «Hojas de consulta y hoja neurológica»), con el cambio de la guía de añadir, quitar o mover hojas en vez de reimprimir el cuaderno entero (petición del usuario). Parte C (body chart) pendiente.** Fuentes leídas enteras: las seis de la tabla; extractos en el registro (`data/referencias.js`).

## Principio: el cuaderno es una guía de consulta, no un formulario

Decisión del usuario (noviembre 2026): las hojas del cuaderno se consultan, no se rellenan. Son el plano de cómo se valora («blueprint»): se imprimen una vez, viven en la carpeta y sirven para muchos pacientes. Lo que se rellena por paciente va aparte, como **plantilla para fotocopiar**, igual que ya va aparte la hoja del paciente.

Hoy dos hojas generales del cuaderno rompen esa regla: **Irritabilidad** (la matriz con casillas) y **Síntomas** (P1–P4 con huecos). El resto ya es de consulta.

Tres partes:

- **A.** Irritabilidad y Síntomas pasan a ser hojas de consulta.
- **B.** Una hoja general nueva: dermatomas, miotomas y reflejos.
- **C.** Plantillas para fotocopiar, fuera del cuaderno: el body chart por delante y por detrás, y, si se quieren, las versiones rellenables de A.

## A. Irritabilidad y Síntomas como hojas de consulta

### Irritabilidad (`htmlIrritabilidad()`, `docs/esquemas/hojas.mjs`)

- **Qué cambia:** la matriz se imprime como tabla de criterios, sin casillas. Cada fila (reposo, movimiento, tolerancia, tiempo en calmarse) tiene sus tres columnas de baja a alta con el texto `corto` de `ITEMS_IRRITABILIDAD`, que es el mismo de la app.
- **Lo que se queda:** la regla (`reglaIrritabilidad()`, ya compartida con la pestaña de la guía) y lo que implica cada nivel, con sus fuentes.
- **Pregunta clave en modo breve:** una línea con la de `TEXTOS_IRRITABILIDAD.pistaBreve` (el tiempo en calmarse), porque en consulta rápida es la que más pesa.
- **QR:** sigue llevando a `#irritabilidad`, la calculadora, que es donde se «rellena» si hace falta.

### Síntomas (`htmlSintomas()`)

- **Cara 1, qué preguntar de cada síntoma**, como lista y no como formulario:
  - P1: zona, lado (vacío = el de la región), profundidad, constante o intermitente, descripción con las palabras del paciente, NRS e irritabilidad.
  - P2–P4: lo mismo, más la relación con P1 (juntos, uno empeora el otro, independiente, no lo sabe) y la regla de qué síntoma dosifica en la fase 6 («el más irritable; si empatan, P1»).
  - Todo sale de `lib/sintomas.js` y `docs/sintomas-multiples.md`; no se escribe nada clínico nuevo.
- **Sin cara 2** (decisión del usuario, 2026-11): las zonas de cada región con sus pasos del árbol no se usaban en papel; quedan solo en la guía (`#sintomas`). La hoja conserva la única línea de seguridad, el recordatorio del periné de lumbar (cola de caballo, pregunta `l6`), literal de `data/lumbar.js`.
- **QR:** sigue llevando a `#sintomas`.

### Qué no cambia

- Las huellas de las dos hojas cambian (cambia lo impreso). «Hojas para imprimir» y el QR de la portada dirán que hay que sustituirlas, como con cualquier cambio. El orden de hojas del cuaderno no cambia, así que no hace falta reimprimir el cuaderno entero.

## B. Hoja general «Dermatomas, miotomas y reflejos»

### Para qué

Tener en la carpeta, sin buscarlo, qué explorar para cada raíz: dónde está su punto sensitivo, qué músculo la representa y qué reflejo la explora. Y, sobre todo, recordar dos cosas que cambian la decisión clínica:

1. **Raíz o nervio periférico.** Un territorio sensitivo que no sigue un dermatoma puede ser de un nervio periférico (es lo que muestra tu primera imagen). La hoja lo dice en una línea y la guía enlaza los territorios de los nervios.
2. **Signos de neurona motora superior.** Hiperreflexia, Hoffmann, Babinski o clonus no son una radiculopatía: se deriva. Se enlaza con las urgencias que la app ya tiene (mielopatía cervical, cola de caballo), sin escribir una regla nueva.

### Qué lleva

**Cara 1, la tabla.** Una fila por raíz, de C5 a S1 (más C2–C4 y T2–T12 solo con su punto sensitivo, en una tabla compacta aparte):

| Raíz | Punto sensitivo clave | Músculo clave | Reflejo |
|------|-----------------------|---------------|---------|
| C5 | (ISNCSCI) | Flexores del codo | Bicipital (C5–C6) |
| C6 | … | Extensores de la muñeca | Braquiorradial (C6) |
| C7 | … | Extensores del codo | Tricipital (C7) |
| C8 | … | Flexores profundos de los dedos | — |
| T1 | … | Abductor del meñique | — |
| L2 | … | Flexores de la cadera | — |
| L3 | … | Extensores de la rodilla | (Rotuliano, L3–L4) |
| L4 | … | Flexores dorsales del tobillo | Rotuliano (L4) |
| L5 | … | Extensor largo del dedo gordo | — |
| S1 | … | Flexores plantares del tobillo | Aquíleo (S1) |

Los músculos y puntos clave son los de la ISNCSCI (fuente 1). Los niveles de los reflejos son los de Zimmerman y Hubbard 2023: bicipital y braquiorradial C5–C6, tricipital C7–C8 (sobre todo C7), rotuliano L2–L4 (sobre todo L4), aquíleo S1; la hoja avisa de que el mismo capítulo da otros niveles para el rotuliano y el aquíleo. Si dos fuentes no coinciden en un nivel, la hoja da el de la ISNCSCI o el de la fuente de reflejos y lo dice; nunca se elige sin decirlo.

Debajo de la tabla:
- **Gradación:** cómo se puntúan la fuerza (0–5, NT) y la sensibilidad (0, 1, 2, NT, comparando con la cara), tal como la ISNCSCI.
- **Reflejos:** la escala de 0 a 4+, con la fuente de reflejos.
- **Recuadro rojo, «Signos de neurona motora superior: derivar»:** hiperreflexia, Hoffmann, Babinski, clonus de más de unas pocas batidas. Remite a las preguntas de urgencia que ya existen y no añade ninguna.

**Cara 2, sin dibujo propio** (decisión del usuario, 2026-11, que sustituye a la primera versión con puntos sobre la silueta: aportaba poca precisión).
- **Recomendada, la hoja oficial de ASIA:** gratuita y sin cuenta, con el dibujo de los puntos clave; se puede fotocopiar sin modificarla, así que se imprime aparte y se tiene junto a la hoja. Lleva un QR a su página (`ASIA_HOJA`, `data/neuro.js`: el PDF en español de la web de ASIA, REV 04/19, enlace dado por el usuario; su pie permite copiarlo libremente pero no alterarlo, así que el dibujo no se recorta).
- **QR a Kenhub** (artículos «Dermatomas» y «Miotomas» en español, comprobados): probado sin sesión (2026-11): el artículo y sus dibujos se ven enteros, algunas tablas de datos salen difuminadas y Kenhub puede mostrar un aviso para registrarse (gratis). Un QR es un enlace, no una imagen: la decisión 4 (ninguna imagen de Kenhub en el papel) se mantiene.
- **Puntos, no bandas** (decisión 3): la tabla da el punto clave de cada raíz, porque los mapas de bandas no coinciden entre autores (Lee 2008; Downs y Laporte 2011).
- La silueta (`siluetaPuntosSVG()`, `data/siluetas-hojas.js`) queda para el body chart de la parte C.

### La página de la guía (`guia.html#neuro`)

- El mismo contenido que la hoja, con «ⓘ Por qué y más» en cada raíz (por qué ese músculo y ese punto, cómo se explora y la técnica del reflejo), las citas tocables y «✨ IA».
- Un apartado **«Raíz o nervio periférico»** con los territorios cutáneos de los nervios del miembro superior e inferior, escritos (no dibujados) y enlazados a Kenhub.
- Enlaces a las hipótesis radiculares y a sus tests de la fase 4b en las páginas de confirmación de cervical y lumbar.
- Como el resto de la guía: en memoria, sin datos del paciente.

### Dónde va

- En `HOJAS_GENERALES`, después de Síntomas (decisión 5). Cambia la lista de hojas y el `ordenFecha` de todos los cuadernos, pero **no hace falta reimprimirlos enteros**: con la «cuaderno v.» de la portada, la guía dice qué hoja añadir y detrás de cuál, y qué sustituir (petición del usuario, 2026-11).
- QR → `guia.html#neuro`.

### La app

- Nada en la app en esta fase.
- Si lo quieres más adelante, el mismo contenido podría abrirse desde la fase 4b de las hipótesis radiculares, como enlace a la guía. Es otra decisión, no se incluye aquí.

## C. Plantillas para fotocopiar (fuera del cuaderno)

### Body chart por delante y por detrás

- **Qué es:** una hoja A4 con la silueta por delante y por detrás, solo el contorno y sin zonas marcadas, para dibujar encima los síntomas del paciente.
- **El dibujo:** las mismas siluetas de react-native-body-highlighter (MIT, con su aviso en la hoja). Grandes, centradas, con «DER» e «IZQ» del paciente en las dos vistas.
- **Qué lleva alrededor (decisión 7):**
  - Arriba: «Paciente / Fecha» con una línea, sin más campos.
  - Una leyenda corta de símbolos para dibujar: zona de dolor, zona de parestesias, zona de anestesia, y P1 / P2 / P3 / P4 para numerar los síntomas como en la app.
  - Los símbolos y su uso se toman de lo que ya está en el registro: Maitland 2005 y Hengeveld y Banks 2005 describen el body chart. Se leen esas páginas antes de escribir la leyenda; si no la fijan, la leyenda es «redacción propia» y se dice.
- **Dos versiones, hombre y mujer** (decisión 8), como la fase 2. El hueco para escribir es el mismo en las dos.
- **Sin QR** (decisión 9): es una plantilla, no una hoja de consulta. Lleva su «v.» y la autoría, como el resto.
- **Dónde se lista:** un grupo nuevo en «Hojas para imprimir», **«Plantillas para fotocopiar»**, con el PDF de cada una. No entra en los cuadernos, como la hoja del paciente.

### Versiones rellenables de Irritabilidad y Síntomas (opcional, decisión 6)

- Si las usas en papel, las versiones actuales (con casillas y huecos) pasan a ese mismo grupo, sin QR y fuera del cuaderno.
- Si no, se retiran.

## Fuentes

Todas se leen completas antes de escribir el texto que se apoya en ellas, y entran en `data/referencias.js` con su `revision`.

| # | Fuente | Para qué | Acceso |
|---|--------|----------|--------|
| 1 | Rupp et al. 2021, *International Standards for Neurological Classification of Spinal Cord Injury: Revised 2019*, Top Spinal Cord Inj Rehabil 27(2):1–22 (PMID 34108832, PMC8152171) | Puntos sensitivos y músculos clave; gradación de fuerza y sensibilidad | Gratis para leer, pero PMC solo lo tiene en PDF y la sesión no llega al PDF: **PDF del usuario**. © ASIA: ver «Derechos de la ISNCSCI» |
| 2 | Lee, McPhee y Stringer 2008, *An evidence-based approach to human dermatomes*, Clin Anat 21:363–73 (PMID 18470936) | Variabilidad y solapamiento de los dermatomas; por qué puntos y no bandas | No está en PMC: **PDF del usuario** |
| 3 | Downs y Laporte 2011, *Conflicting dermatome maps: educational and clinical implications*, JOSPT 41 (PMID 21628826) | Por qué los mapas no coinciden | No está en PMC: **PDF del usuario** |
| 4 | StatPearls, *Deep Tendon Reflexes* | Niveles de los reflejos, técnica, escala 0–4+ | **PDF del usuario** |
| 5 | StatPearls, *Dermatomes* y *Upper motor neuron lesions* (o el capítulo de exploración neurológica que tengas) | Signos de neurona motora superior; contraste de niveles | **PDF del usuario** |
| 6 | Maitland 2005 y Hengeveld y Banks 2005 (ya en el registro) | Leyenda del body chart | Ya leídos para la fase 6; se releen las páginas del body chart |
| 7 | Kenhub (con tu suscripción) | Solo enlaces desde la guía, nunca en el papel | Enlace |

### Derechos de la ISNCSCI

El folleto de la ISNCSCI lleva © ASIA 2019: «No part of this publication may be modified, reproduced… without prior written permission of ASIA». La única excepción es la hoja de exploración («worksheet»), que se puede fotocopiar sin modificarla. Por eso:

- **En la hoja de PhysiQ** no se copia ni su tabla ni su dibujo. Se da, con nuestras palabras y nuestro dibujo, qué punto y qué músculo explora cada raíz, citando la ISNCSCI como fuente. No es una opinión legal: si prefieres ir sobre seguro, se pide permiso a ASIA (decisión 11).
- **En la guía** se enlaza la hoja oficial de ASIA, sin modificar, para quien quiera usarla tal cual.
- La versión de Spinal Cord 2021 (PMC8737267) **no es la misma**: son cinco casos de clasificación, sin la lista de puntos ni de músculos. Se descarta como fuente de la tabla.

## Qué no hace

- **No diagnostica:** la hoja dice dónde explorar, no qué raíz está afectada. Un hallazgo aislado no decide nada.
- **No añade urgencias ni derivaciones nuevas.** Los signos de neurona motora superior remiten a las que ya existen.
- **No reproduce imágenes con derechos.** Ni Kenhub ni Wikimedia en el papel; el dibujo es nuestro, sobre siluetas MIT.
- **No escribe niveles sin fuente.** Lo que falte de leer queda como «pendiente de fuente» y no se imprime.
- **No guarda nada del paciente** en la guía ni en las plantillas.

## Decisiones para revisar

1. **El cuaderno solo lleva hojas de consulta.** Lo que se rellena va a «Plantillas para fotocopiar», fuera del cuaderno.
2. **Irritabilidad y Síntomas pasan a hojas de consulta** como se describe en A. Los QR siguen llevando a su calculadora y su página.
3. **Dermatomas como puntos clave de la ISNCSCI, no como bandas**, con una nota sobre su variabilidad.
4. **Ninguna imagen de Kenhub en el papel**, salvo permiso escrito de Kenhub. Si lo da, se cambia el dibujo.
5. **La hoja neurológica va en las hojas generales, después de Síntomas.** Cambia el orden de todos los cuadernos y obliga a reimprimirlos enteros una vez.
6. **Las versiones rellenables de Irritabilidad y Síntomas**: a «Plantillas para fotocopiar», o se retiran. Recomiendo retirarlas si no las usas, para no mantener dos versiones.
7. **Body chart con solo «Paciente / Fecha» y una leyenda corta de símbolos**, sin más campos.
8. **Body chart en dos versiones, hombre y mujer.** Alternativa: una sola, neutra, si prefieres no elegir al fotocopiar.
9. **Body chart sin QR.**
10. **Reflejos solo con fuente leída.** Hasta tener las fuentes 4 y 5, la columna de reflejos no se imprime.
11. **ISNCSCI con nuestras palabras y nuestro dibujo, citada**, sin copiar su tabla ni su figura, y la hoja oficial de ASIA enlazada desde la guía. Alternativa: pedir permiso a ASIA antes de imprimir.

## Orden

Para que reimprimas el cuaderno entero una sola vez:

1. **Lecturas:** tus PDF de las fuentes 1–5.
2. **Una sola PR, A + B:** Irritabilidad y Síntomas como consulta y la hoja neurológica con su página de la guía. Cuadernos regenerados una vez, con el nuevo `ordenFecha`.
3. **Otra PR, C:** el body chart y, si lo decides, las plantillas rellenables. No toca el cuaderno, así que no obliga a reimprimir nada.

Cada PR, con tu revisión antes de fusionar.
