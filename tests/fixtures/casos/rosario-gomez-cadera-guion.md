# Caso simulado: Rosario Gómez, prótesis de cadera (Fase G)

Caso de prueba para el paciente posquirúrgico. Cubre lo que no cubren los tres
casos posquirúrgicos de `tests/fixtures/informes/` (Pedro, Pablo y Carmen):

- **«Tratada con la cirugía» en una hipótesis que no es «Derivar»**: `ca1`
  (artrosis de cadera) tras la prótesis, el caso que motivó `pq1`.
- **Una complicación**: infección superficial de la herida, ya resuelta.
- **Cribado posquirúrgico positivo sin urgencia**: `pq_sdrc` en SÍ (y `ca_in3`,
  la cirugía previa de cadera, que tampoco es urgente).

Es una paciente inventada. No cierra la casilla «Probar con un caso real de
operado» de la Fase G: la prepara.

## Cómo usarlo

1. Abre la app fuera del hub (standalone) y, en el panel de sesión (icono de la
   persona), pulsa **⬆ Importar** y elige `valoracion-rosario-gomez-cadera.json`.
   Se carga en la fase 5.
2. Repasa la app con la lista «Qué comprobar en la app».
3. En la tarjeta «🎙 Informe con IA»: plantilla **Narrativo**, audio
   **Dictado del fisioterapeuta**. Graba desde el botón de la cabecera leyendo
   el guion de abajo en voz alta (o adjunta la grabación) y genera el informe.
4. Revisa el informe con la lista «Qué comprobar en el informe con IA» y los
   puntos de la revisión automática.
5. Descarga el **⬇ Paquete de revisión** y pásamelo para añadir el informe a
   `tests/fixtures/informes/` con sus puntos esperados, como los demás.

## Datos del caso

| Campo | Valor |
|---|---|
| Paciente | Rosario Gómez, 68 años, mujer |
| Región | Cadera izquierda |
| Cirugía | Prótesis total de cadera por artrosis, abordaje posterior, 8 sep 2026 (semana 5) |
| Protocolo | Escrito: precauciones de luxación hasta la semana 6 (no flexionar más de 90°, no cruzar las piernas, no girar la pierna hacia dentro); carga completa según tolerancia con bastón en la mano derecha; no conducir hasta la semana 6 |
| Complicaciones | Infección (superficial de la herida, resuelta) |
| Cribado | `pq_sdrc` SÍ, `ca_in3` SÍ; el resto NO |
| Fase 3 | NRS 4/10, irritabilidad moderada (matriz), nociceptiva, mejorando |
| Árbol | No lumbar/sacroilíaca → sin evento → perfil degenerativo (`ca1`) → intraarticular NO → cara externa: debilidad (`ca5`) → resto NO |
| Hipótesis | `pq1` (postoperatorio), `ca1` marcada «Tratada con la cirugía», `ca5` con Trendelenburg y dinamometría positivos |
| Psicosocial | Riesgo medio: miedo a que se le salga la prótesis |

## Guion del dictado

Léelo en primera persona, como fisioterapeuta, al final de la consulta:

> Rosario, 68 años, cadera izquierda. La operaron el 8 de septiembre de una
> prótesis total de cadera por artrosis, por vía posterior; hoy está en la
> quinta semana. Trae el protocolo escrito del cirujano: precauciones de
> luxación hasta la semana 6, que son no flexionar la cadera más de 90 grados,
> no cruzar las piernas y no girar la pierna hacia dentro; carga completa
> según tolerancia con el bastón en la mano derecha, y no conducir hasta la
> semana 6.
>
> En la segunda semana tuvo una infección superficial de la herida que le
> trató su médico de cabecera con antibiótico oral, y ya está resuelta. Hoy la
> herida está cerrada, sin enrojecimiento ni supuración.
>
> Lo que más le cuesta es caminar más de diez minutos, ponerse los calcetines
> y los zapatos, y las escaleras. Por la noche se despierta al cambiar de
> postura. Tiene miedo a que se le salga la prótesis, y por eso se mueve poco.
>
> Cuenta que desde hace unos diez días el pie izquierdo está a ratos más frío
> y amoratado que el derecho, que se le hincha al final del día y que le
> molesta el roce de la sábana en el tobillo. La pantorrilla está blanda, no
> está caliente y no le duele al apretarla, y no le falta el aire. No cumple
> todos los criterios de un síndrome de dolor regional complejo, pero lo dejo
> anotado para vigilarlo y se lo comentaré a su cirujano en la revisión.
>
> En la exploración, el Trendelenburg es positivo a la izquierda, y con el
> dinamómetro la abducción de la cadera izquierda da un 40 por ciento menos
> que la derecha. Al apoyarse sobre la pierna izquierda cae la pelvis del lado
> derecho y le duele la cara lateral de la cadera, un 4 sobre 10. No he hecho
> el FADDIR ni la flexión con rotación interna por las precauciones de
> luxación.
>
> Le he enseñado isométricos de glúteo medio tumbada boca arriba, 5
> repeticiones de 10 segundos, dos veces al día, después del desayuno y de la
> cena, y paseos de 10 minutos dos veces al día con el bastón en la mano
> derecha. También le he repasado las precauciones de luxación para levantarse
> de la silla y de la cama. La vuelvo a ver la semana que viene.

## Qué comprobar en la app

- **Fase 1**: la tarjeta «Cirugía» con intervención, fecha (semana 5), protocolo
  escrito, restricciones y la complicación «Infección».
- **Fase 2**: el cribado posquirúrgico aparece primero con cinco preguntas (sin
  la de síndrome compartimental, que no es de cadera). Con `pq_sdrc` y `ca_in3`
  en SÍ sale el aviso naranja, **no** el rojo «Derivación urgente hoy».
- **Fase 4b**: «Postoperatorio: Prótesis total de cadera…» es la primera
  hipótesis, sin tests. La artrosis (`ca1`) tiene marcado «Tratada con la
  cirugía», con sus tests plegados y la etiqueta «🏥 Diagnosticada y tratada».
  La debilidad de abductores (`ca5`) dice «⚪ Sin LR aplicable · 2/2 hallazgos
  compatibles».
- **Fase 5**: la caja «Paciente posquirúrgico» arriba; la artrosis sin
  «🚑 Derivación» ni pauta propia; la debilidad de abductores sin pauta (es
  decisión del clínico), con el aviso de compatibilidad con el protocolo del
  cirujano si alguna pauta lo lleva.
- **📋 Notas**: la línea «🏥 CIRUGÍA:» con el protocolo y la infección,
  «Cribado sistémico: POSITIVO ⚠️» y la artrosis como «🏥 Diagnosticada y
  tratada».
- **📄 Informe** (paciente/médico): el bloque «ANTECEDENTE QUIRÚRGICO», las dos
  preguntas del cribado en SÍ, la primera línea del PLAN sobre el protocolo y
  la artrosis como «(intervenida quirúrgicamente)».
- **⏱ Tiempos de recuperación**: la línea «Hoy» en la semana 5.
- **Desmarcar y volver a marcar** «Tratada con la cirugía» en `ca1`: sus tests
  vuelven a puntuar y se pliegan otra vez.

## Qué comprobar en el informe con IA

1. **Cirugía**: fecha, protocolo y restricciones tal como constan, una sola
   vez; la infección como complicación ya resuelta.
2. **Artrosis**: como antecedente (en Condición de Salud), no como hipótesis
   ni con derivación, y sin listar sus tests.
3. **Debilidad de abductores**: hipótesis de trabajo, con el Trendelenburg y la
   dinamometría (el 40 % solo si lo recoge del dictado).
4. **Pie frío y amoratado**: un hallazgo a vigilar que se comentará con el
   cirujano. No debe decir que tiene un síndrome de dolor regional complejo
   ni tratarlo como urgente.
5. **FADDIR**: el dictado dice que no se hizo, pero el árbol obliga a
   contestar el paso intraarticular y en los datos consta «NO — FADDIR y
   flexión-RI negativos». El informe **no** debe decir que fue negativo. Si lo
   dice, es una contradicción de los datos y no del modelo: el paso no tiene
   opción «no explorado».
6. **Plan**: los isométricos y los paseos, sin nada que contradiga las
   precauciones de luxación (sentadilla profunda, cruzar las piernas, rotación
   interna, conducir antes de la semana 6).
7. **NRS 4/10** sin inventarle un momento; **lado izquierdo**, **mujer de 68
   años** solo en Factores Personales.
8. **Miedo a luxar** como factor personal, sin exagerarlo.
