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

## Estado

| Paso | Estado |
|---|---|
| Diseño (este documento) | Aceptado por el usuario (2026-10) |
| Infraestructura (herramienta, tests, smoke) | No empezada |
| Bloque 1 — Hipoalgesia | No empezado |
| Bloque 2 — Mecanotransducción | No empezado |
| Bloque 3 — Antiinflamatorio sistémico | No empezado |
| Bloque 4 — Otras mioquinas | No empezado |
| Bloque 5 — Efectos centrales | No empezado |
| Enlace desde «Educación» de la fase 6 | No empezado (tras los bloques 1 y 2) |
