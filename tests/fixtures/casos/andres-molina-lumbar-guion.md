# Caso simulado: Andrés Molina, dolor radicular lumbar (Fase L, L4)

Caso de prueba para la capa de IA de la fase 6 («✨ Detallar con IA», L4), la
parte sin IA de la fase 6 y el informe con IA. Es
un paciente inventado. Cubre lo que el prompt del plan tiene que respetar:

- **Dolor radicular** (`lu3`, en `HIP_EXPLORACION_NEURO` y `HIP_RADICULARES`):
  exploración neurológica al empezar cada sesión y red de seguridad de cola de
  caballo en el programa para casa.
- **Varios síntomas, y el que dosifica no es P1**: P2 (glúteo) es más irritable
  que P1, así que el plan sale con irritabilidad alta y el escalón B más suave
  (1), sin propuesta C.
- **Un síntoma independiente** (P3, zona lumbar derecha): el plan debe decir
  que no lo trata.
- **La matriz nueva** completa, con el tiempo en calmarse («Tarda horas»).
- **Una pauta que no fija volumen** (la de `lu3`) y que habla de la
  centralización, cuando el paciente **no** centraliza: la IA no debe dar por
  hecho que centraliza ni inventar una preferencia direccional.
- **Una segunda hipótesis** (`lu6`, discogénico) sin elegir por defecto: el
  plan es de `lu3` salvo que el fisio añada `lu6`.

## Cómo usarlo

1. Abre la app fuera del hub (standalone) y, en el panel de sesión (icono de la
   persona), pulsa **⬆ Importar** y elige
   `valoracion-andres-molina-lumbar.json`. Se carga en la fase 5.
2. **Plan sin IA**: pulsa «Plan de tratamiento (opcional) →» y comprueba lo de
   «Qué debe salir en la fase 6».
3. **Con L4**: en la fase 6, «✨ Detallar con IA», al final de la página. Si quieres
   probarlo con transcripción, genera antes el informe con IA en la fase 5
   (plantilla **Narrativo**, audio **Dictado del fisioterapeuta**, leyendo el
   guion de abajo): el plan reutiliza la transcripción guardada.
4. Revisa el resultado con «Qué comprobar en el plan con IA» y pásame lo que
   salga («📤 Compartir → Plan detallado (IA)», con los puntos de la revisión)
   para convertirlo en fixture, como los informes de `tests/fixtures/informes/`.

## Datos del caso

| Campo | Valor |
|---|---|
| Paciente | Andrés Molina, 42 años, hombre |
| Región | Lumbar, lado izquierdo |
| Mecanismo y cronología | Insidioso · Agudo (< 6 semanas): 3 semanas |
| Banderas rojas y cribado | Todo NO; riesgo psicosocial bajo |
| P1 | Muslo posterior y pierna por debajo de la rodilla (izquierda), profunda, intermitente, «como una corriente que baja hasta la pantorrilla»; NRS 6/10 |
| Matriz (P1) | Reposo intermitente · movimiento antes del final del rango · tolerancia moderada · **tiempo en calmarse: tarda horas** → irritabilidad **moderada** (completa) |
| Impacto en las actividades | Moderado |
| P2 | Glúteo izquierdo, profunda, intermitente, NRS 5/10, irritabilidad **alta**, va junto con P1 («sentado se le carga y no se le pasa hasta el día siguiente») |
| P3 | Zona lumbar derecha, intermitente, NRS 3/10, irritabilidad baja, **independiente** de P1 («molestia antigua al final del día de pie») |
| Naturaleza · estabilidad | Neuropática · Estable |
| Signo comparable | Slump izquierdo: reproduce el dolor de la pantorrilla con la rodilla a 20° de la extensión completa; mejora al soltar la flexión cervical |
| Árbol | Pierna peor que espalda (SLR / Slump) → **no centraliza** → sin déficit neurológico → no estenosis → sin patrón agudo ni inestable → discogénico |
| Hipótesis | `lu3` Dolor radicular lumbar (SLR ipsilateral +, SLR contralateral −, Slump +; 2/3 hallazgos) · `lu6` Discogénico (centralización −, preferencia direccional −) |
| Notas del plan (fase 5) | Variable de control: «Para si el dolor baja más abajo de la pantorrilla o aparece hormigueo en el pie.» · ventana de recuperación: «Debes estar como antes de los ejercicios; si no, haz la mitad la próxima vez.» · anclaje: «Después de desayunar». Van tal cual al programa para casa («Cuándo parar», «Al día siguiente», «Cuándo hacerlo»), así que están escritas para el paciente (antes decían «tiempo sentado… (hoy, 20 min)» y «24 h tras la sesión», que en el programa para casa no se entendían) |

## Guion del dictado

Léelo en primera persona, como fisioterapeuta, al final de la consulta:

> Andrés Molina, 42 años. Viene por dolor en la pierna izquierda que le baja
> por detrás del muslo hasta la pantorrilla, como una corriente, desde hace
> tres semanas. Empezó sin un golpe ni un esfuerzo concreto; recuerda que esa
> semana pasó muchas horas conduciendo. El dolor de la pierna es peor que el
> de la espalda: la pierna la pone en un 6 sobre 10.
>
> Lo que más le cuesta es estar sentado: a los veinte minutos de conducir le
> aparece el dolor de la pantorrilla, y cuando se levanta tarda un par de
> horas en volver a como estaba. En reposo le molesta a ratos. Al agacharse le
> duele antes de llegar al final del movimiento. Aguanta caminar media hora
> sin que le empeore. Por la noche no le despierta.
>
> Además tiene dolor en el glúteo izquierdo, que le aparece y se le va junto
> con el de la pierna; lo pone en un 5, y cuando ha estado mucho rato sentado se le
> carga y no se le pasa hasta el día siguiente. Y aparte, en el lado derecho
> de la zona lumbar, una molestia antigua, de un 3, que le sale al final del
> día si ha estado mucho de pie; dice que no tiene nada que ver con lo de
> ahora.
>
> Le he preguntado por pérdida de fuerza en las piernas, por adormecimiento en
> la zona del periné o entre las piernas y por cambios al orinar o al hacer de
> vientre, y no tiene nada de eso. Ni fiebre, ni pérdida de peso, ni
> antecedentes de cáncer.
>
> En la exploración, la elevación de la pierna recta izquierda reproduce el
> dolor de la pantorrilla a unos 45 grados; la del lado derecho no le provoca
> nada en la pierna izquierda. El Slump izquierdo reproduce su dolor y mejora
> al soltar la flexión del cuello. La exploración neurológica es normal: fuerza
> por miotomas, reflejos rotuliano y aquíleo y sensibilidad, iguales en los dos
> lados. Con extensiones repetidas de pie el dolor de la pierna no cambia; no
> centraliza, y tampoco encuentro una dirección que lo alivie.
>
> Trabaja en una oficina, sentado casi toda la jornada, y conduce unos cuarenta
> minutos para ir y otros tantos para volver. Jugaba al pádel dos veces por
> semana y lo ha dejado desde que empezó esto. Quiere poder conducir y
> trabajar sentado sin que le baje el dolor, y volver al pádel. Toma
> ibuprofeno cuando le duele más y dice que le ayuda poco. Puede hacer los
> ejercicios en casa por la mañana, después de desayunar.

Primera prueba (ronda 33, `tests/fixtures/informes/andres-lumbar-dictado-1-*`):
el glúteo iba como «constante» y «va junto con P1», que se contradicen (P1 es
intermitente), y el informe escribió las dos cosas. Corregido: P2 es intermitente.

## Qué debe salir en la fase 6 (sin IA)

- «Según **P2 · Glúteo**, el síntoma más irritable»; gravedad moderada (NRS
  5/10) e irritabilidad **alta (estimada)**, con el aviso de que se dosifica
  por un síntoma que no es P1.
- A y B «Muy suave» (escalón 1), **sin propuesta C** («la irritabilidad no es
  baja»).
- Aviso del síntoma independiente: «(P3 · Zona lumbar)».
- Hipótesis por defecto: **Dolor radicular lumbar**; «Dolor lumbar
  discogénico», disponible como segunda.
- Reevaluación con el signo comparable y **exploración neurológica al empezar**
  (Maitland 2005, cap. 6, p. 136).
- Programa para casa con la red de seguridad de **cola de caballo**.
- **Sin** la regla de los 7–10 días: solo sale con un NRS registrado de 8 o
  más.

## Qué comprobar en el plan con IA

- **No cambia el esqueleto**: escalón 1 en A y B, sin sesión C, minutos y
  bloques como la parte sin IA; dosifica por el glúteo (irritabilidad alta), no
  por la pierna.
- **Nada de técnicas firmes**: con irritabilidad alta, sin grados III–IV, sin
  thrust ni movilización neural vigorosa; si propone movilización neural,
  suave y avisando de reevaluar a las 24 h (Maitland 2005, cap. 6, p. 149).
- **No inventa la centralización**: el paciente no centraliza ni tiene
  preferencia direccional. Si cita la parte McKenzie de la pauta, debe decir
  que hoy no hay dirección que alivie, no prescribir extensiones «porque
  centraliza».
- **Separa lo citado de lo sugerido**: series, repeticiones o minutos que la
  pauta no fija van como «Sugerencia de la IA, sin fuente en PhysiQ»; no
  atribuye volúmenes a NICE, a Maitland ni a otra fuente.
- **P3 no se trata**: lo menciona como posible segundo problema, sin
  ejercicios para él.
- **Exploración neurológica cada sesión** y, en el programa para casa, la red
  de cola de caballo en lenguaje llano.
- **Primera sesión más ligera** y aviso de un posible aumento temporal de
  síntomas.
- **Datos sin inventar**: lado izquierdo, 42 años, hombre; ningún NRS que no
  esté en los datos (6, 5 y 3); nada de déficit neurológico (la exploración es
  normal), ni de fiebre o pérdida de peso.
- **Usa el contexto del dictado** sin inventar más: conducir y estar sentado
  como actividades a graduar, el pádel como objetivo a largo plazo (no en el
  primer mes con irritabilidad alta), los ejercicios después de desayunar.
- **No usa `lu6`** salvo que se elija como segunda hipótesis.
