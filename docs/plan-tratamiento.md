# Fase 6 «Plan de tratamiento» — diseño

Estado: **diseño, sin implementar** (2026-10). Nada de este documento está en el código todavía. Seguimiento en `MIGRATION_PLAN.md`, **Fase L**.

Qué es: una fase nueva tras los resultados (fase 5) que propone **una sesión de 50 minutos a tres niveles de carga** y **un plan de un mes** en dos variantes: **A**, 1 sesión por semana, y **B**, 2 sesiones por semana. Tiene una parte sin IA, construida con lo que la app ya sabe, y una capa opcional con IA que la detalla.

## Decisiones tomadas (2026-10)

1. **Las tres propuestas de sesión son la misma pauta a tres niveles de carga**, no tres enfoques distintos. **A** queda por debajo de la irritabilidad registrada, **B** se ajusta a ella y **C** sube un escalón. Con irritabilidad alta, o con miedo al movimiento alto, **C no se genera** y la fase dice por qué. La irritabilidad (SINSS, fase 3) es la variable que cambia la dosis de una sesión, y ya está registrada. Diferenciar por enfoque (manual / activo / educación) obligaría a proponer abordajes que la pauta citada no cubre.
2. **Fase 6 con una parte sin IA, más una capa de IA opcional.** La parte sin IA (esqueleto de sesión y de mes) funciona también en el hub, sin licencia ni coste, y es comprobable con tests unitarios. La IA («✨ Detallar con IA») solo funciona en standalone y rellena huecos dentro de ese marco, nunca lo cambia.
3. **Lector: el fisio.** El plan de sesión y el del mes son para el fisio (lenguaje técnico, criterios de progresión, fuentes). La única salida para el paciente es el **programa domiciliario**, en lenguaje llano, como ya se separan `📄 Informe` y `📋 Notas`.
4. **La IA lee los datos, nunca el texto del informe IA.** Recibe el payload, los datos ampliados (`construirAmpliado()`) y, si existe, la **transcripción** ya guardada en `state.informeIA.transcripcion`. El informe es información de segunda mano: las revisiones (rondas 1–29, `docs/informe-ia.md`) encontraron lados, NRS y frecuencias inventados, y planificar sobre él los propagaría. Reusar la transcripción además evita volver a mandar el audio a Whisper.
5. **Con una derivación sin resolver no hay plan.** Ver «Bloqueos», abajo.

## Punto de partida (medido en el código, 2026-10)

| Región | Hipótesis | Con pauta (`dosis` + `dosisFuente`) | Pauta vacía (`''`) | `DOSIS_DERIVAR` | Con `pronostico` |
|---|---|---|---|---|---|
| Hombro | 11 | 5 | 5 | 1 | 7 |
| Cadera | 19 | 9 | 10 | 0 | 12 |
| Cervical | 14 | 12 | 1 | 1 | 6 |
| Lumbar | 9 | 9 | 0 | 0 | 6 |
| Rodilla | 20 | 11 | 8 | 1 | 17 |
| Codo | 16 | 8 | 5 | 3 | 1 |
| Tobillo y pie | 37 | 9 | 20 | 8 | 34 |
| **Total** | **126** | **63** | **49** | **14** | **83** |

Tres consecuencias para el diseño:

- **Solo la mitad de las hipótesis tiene pauta.** En las 49 con `dosis: ''` la app ya dice que la pauta es decisión del fisio, y fase 6 no puede ser la puerta trasera que la invente (ver «Decisiones pendientes», 2).
- **Las pautas con fuente casi nunca fijan el volumen.** Las de lumbar, por ejemplo, terminan en «Ninguna fuente fija repeticiones… el volumen queda a criterio del clínico». Por eso los tres niveles de carga **no pueden ser números calculados** a partir de la pauta: son modificadores cualitativos de la misma pauta (ver «Sesión de 50 minutos»).
- **Lumbar es el piloto natural**: 9 de 9 hipótesis con pauta citada, y ya fue la región de referencia en Fase D y Fase I.

## Principios

1. **La seguridad manda sobre el plan.** Urgencias de fase 2 (`ur`), derivaciones del árbol (`dv`) sin resolver e hipótesis `DOSIS_DERIVAR` no marcadas como tratadas bloquean el plan. Fase 6 nunca rebaja ni oculta un aviso de las fases anteriores.
2. **Nada sin fuente se presenta como si la tuviera.** Lo que viene de la pauta citada se distingue siempre de lo que es organización de la sesión (orientativo, editable) y de lo que propone la IA (sugerencia, para revisar).
3. **El protocolo del cirujano manda** (mismo principio que `docs/posquirurgico.md`). Con mecanismo Post-quirúrgico, el plan sigue a `pq1` y las restricciones; sin protocolo, solo estructura genérica y «Restricciones pendientes de confirmar con el cirujano».
4. **Es una propuesta, no una prescripción.** El fisio elige, edita y firma. Proponer tratamiento va un paso más allá que redactar un informe, y la interfaz lo dice.
5. **Fuera del payload en la primera versión.** Ni `buildPhysiQPayload()`, ni `📋 Notas`, ni `📄 Informe` cambian. physiq-report no sabe nada de fase 6 (ver «Decisiones pendientes», 4).

## Flujo

### Entrada a la fase 6
- Botón «Plan de tratamiento →» en la barra inferior de fase 5, junto a «📤 Compartir». La fase no es obligatoria: la valoración está completa en fase 5.
- Nueva entrada en `PHASE_DEFS` (`{ n: 6, label: 'Plan de tratamiento', short: 'Fase 6' }`), `goToPhase(6)`, barra de fases y hoja móvil. `navStepClick` solo deja entrar con `resultsBuilt`.
- **Hipótesis a tratar**: el fisio elige una (y opcionalmente una segunda). Por defecto, la de mayor peso que no esté marcada como tratada ni sea `DOSIS_DERIVAR`. Con mecanismo Post-quirúrgico, `pq1` va primero (`hipotesisActivas()`).

### Bloqueos (antes que cualquier plan)
| Situación | Qué muestra fase 6 |
|---|---|
| Alguna urgencia de fase 2 (`ur`) | Alerta roja y **ningún plan**: «Derivación urgente pendiente» |
| Derivación del árbol (`dv`) sin marcar como resuelta | Alerta y ningún plan hasta resolverla |
| Hipótesis elegida con `DOSIS_DERIVAR` sin «Ya diagnosticada y tratada» | No se puede elegir; se explica por qué |
| Post-quirúrgico sin protocolo (`conProtocolo()` falso) | Plan solo con estructura genérica + «Restricciones pendientes de confirmar con el cirujano» |
| Modo breve con la hipótesis sin ningún test pos/neg | Plan permitido, con «Hipótesis de trabajo, pendiente de confirmar» arriba |

### Sesión de 50 minutos (parte sin IA)
Una plantilla por bloques, **orientativa y editable** (es organización de la sesión, no evidencia):

| Bloque | Minutos | Contenido |
|---|---|---|
| Reevaluación | 0–5 | Signo comparable (`signoComparable`), NRS |
| Educación | 5–12 | Lo que dice la pauta sobre información y autocuidado; con miedo al movimiento, más peso aquí |
| Intervención principal | 12–35 | La pauta de la hipótesis (`dosisRamas` → rama que encaja, si no `dosis` entera), con su `dosisFuente` |
| Programa domiciliario | 35–45 | Enseñar y comprobar lo que el paciente hará en casa |
| Cierre | 45–50 | Reevaluar el signo comparable, explicar qué vigilar hasta la próxima sesión |

Los tres niveles se construyen así, todos sobre la misma pauta:

| | Cuándo se genera | Modificador |
|---|---|---|
| **A — por debajo** | Siempre | Menos carga que la que la irritabilidad permite; más tiempo de educación |
| **B — ajustada** | Siempre | La que corresponde a la irritabilidad registrada |
| **C — por encima** | Solo con irritabilidad Baja y sin miedo al movimiento alto | Un escalón más de carga |

Los modificadores por irritabilidad necesitan una fuente leída antes de escribirse (ver «Decisiones pendientes», 1). Hoy la fase 3 ya muestra un texto por nivel («Proceder con precaución. Evitar técnicas de alta intensidad…»); fase 6 no debe reutilizarlo sin comprobar de dónde sale.

### Plan de un mes (parte sin IA)
| | Plan A — 1 sesión/semana | Plan B — 2 sesiones/semana |
|---|---|---|
| Sesiones | 4 | 8 |
| Reevaluación intermedia | Sesión 2 (semana 2) | Sesión 4 (semana 2) |
| Reevaluación final | Sesión 4, con el PROM de la hipótesis (`prom`) | Sesión 8, con el mismo PROM |
| Peso del programa domiciliario | Alto: es la mayor parte de la carga del mes | Medio |

- **Progresión por criterios, no por fechas.** Del tipo «subir la carga cuando el dolor durante el ejercicio y a las 24 h no empeore». Si la pauta de la hipótesis ya trae criterios, se usan los suyos; los genéricos necesitan fuente (ver «Decisiones pendientes», 1).
- **Pronóstico**: si `pronostico.horizonte` pasa de 4 semanas, el plan dice que es el primer mes de un proceso más largo. `pronostico.derivacion` («Cuándo reconsiderar o derivar») va a la reevaluación final como criterio explícito.
- **Post-quirúrgico**: el mes se sitúa en las semanas desde la cirugía (`semanasCirugia()`) y no adelanta nada que el protocolo no permita.

### Capa de IA (opcional, solo standalone)
- Botón «✨ Detallar con IA» en fase 6, con la misma licencia (`lib/licencia-ia.js`), Turnstile, streaming y errores legibles que «🎙 Informe con IA».
- **Entrada**: payload + datos ampliados + hipótesis elegida con su pauta, rama y fuente + el esqueleto ya construido + transcripción si existe. Si la valoración cambió después de generar el informe (la `huella` no coincide), se avisa de que la transcripción puede no corresponder.
- **Salida**: las tres sesiones con ejercicios concretos dentro de cada bloque, el mes A/B con su progresión y el programa domiciliario en lenguaje del paciente.
- **Reglas del prompt** (punto de partida, se ampliarán con revisiones reales como en `docs/informe-ia.md`): no cambiar el esqueleto ni los bloqueos; no atribuir a una fuente nada que no esté en la pauta; separar lo que es pauta citada de lo que es sugerencia propia; respetar restricciones del protocolo; con irritabilidad alta, nada de alta intensidad; no generar C si el esqueleto no la tiene.
- **Revisión automática** (como `lib/revision-informe.js`): puntos a revisar cuando el texto nombra fuentes que la pauta no cita, propone carga alta con irritabilidad alta, contradice una restricción, cambia lado/edad/sexo o planifica una hipótesis bloqueada. Cada regla, con el caso real que la motivó.
- **Worker**: hace falta una ruta o plantilla nueva en el worker de physiq-report (`workers/`), que no está en este repo. Sin audio no hay coste de Whisper.

### Compartir
Fase 6 tiene su propio «📤 Compartir» en la barra inferior, con el mismo patrón que fase 5 (hoja en móvil, diálogo centrado en escritorio): «Plan de sesión», «Plan del mes» (fisio) y «Programa domiciliario» (paciente). Con la capa de IA, el programa domiciliario muestra los puntos de revisión sin marcar, como «Informe clínico (IA)».

## Datos

```js
// state (propuesta)
planTratamiento: null | {
  hipotesis: ['lu2'],          // elegidas por el fisio
  nivel: 'B',                  // propuesta de sesión marcada: 'A' | 'B' | 'C'
  frecuencia: 'A',             // plan del mes: 'A' (1/semana) | 'B' (2/semana)
  notas: { sesion: '', mes: '', domiciliario: '' },  // ediciones del fisio
  ia: null | { texto, fecha, prompt, version, huella, revisados }
}
```

El esqueleto **no se guarda**: se recalcula a partir del estado, igual que los resúmenes. Se guarda solo lo que elige o escribe el fisio, y el resultado de la IA. Se borra con `resetApp()`/`_softResetApp()`. En la exportación `.json` entran las elecciones del fisio, pero no el resultado de la IA (`ia`), igual que `informeIA`.

## Código (previsión)

| Fichero | Qué |
|---|---|
| `lib/plan-tratamiento.js` | Funciones puras: bloqueos, hipótesis por defecto, esqueleto de sesión (A/B/C) y de mes (A/B). Unit-tested |
| `plan.js` | Render de fase 6, cargado con `import()` al entrar en la fase (como `formulario.js`) |
| `plan-ia.js` | Capa de IA, solo standalone, con `import()` (como `informe-ia.js`); nunca se descarga en el hub |
| `lib/revision-plan.js` | Revisión automática del texto de la IA |
| `index.html`, `app.js`, `data.js` | `#phase6`, `PHASE_DEFS`, navegación, `window` |
| `deploy-to-hub.yml` | Copiar los ficheros nuevos (el test de despliegue lo exige) |
| `tests/unit/plan.mjs`, `tests/smoke.mjs` | Bloqueos, esqueletos, nada en el payload; recorrido 1–6 en las 7 regiones, hub sin IA |

Hay que comprobar en physiq-report que un `SESSION_ASSESSMENT_PARTIAL` con `phase: '6'` no rompe su indicador de «incompleto».

## Orden de trabajo

1. **L1 — este documento** y las decisiones pendientes de abajo.
2. **L2 — parte sin IA en lumbar** (piloto): bloqueos, esqueleto, compartir. Prueba en consulta real.
3. **L3 — las 7 regiones.** Tobillo y pie (20 de 37 sin pauta) será la que más «pauta a criterio del fisio» muestre.
4. **L4 — capa de IA**, con la ruta nueva en el worker de physiq-report.
5. **L5 — revisión automática** con planes reales en los fixtures, como `tests/fixtures/informes/`.

## Decisiones pendientes

1. **Fuente de los modificadores por irritabilidad y de los criterios de progresión genéricos.** Hacen falta antes de L2; candidatas por leer: el concepto de irritabilidad de Maitland y sus revisiones (p. ej. Barakatt 2009) y el marco SINSS. Ninguna está hoy en `data/referencias.js`. **Recomendación**: que aportes el texto, como con los capítulos de Lluch 2020, y no escribir los modificadores hasta leerlo.
2. **Hipótesis sin pauta (49 de 126).** **Recomendación**: fase 6 da la estructura (bloques, reevaluación, PROM, pronóstico) pero el contenido de la intervención dice «Pauta a criterio del fisio», y la IA tampoco lo rellena. Es lo coherente con «nunca inventar una dosis».
3. **Volumen concreto propuesto por la IA cuando la guía no lo fija** (series, repeticiones, minutos). **Recomendación**: permitirlo solo como «Sugerencia de la IA, sin fuente en PhysiQ», visualmente separado de la pauta citada; y que el programa domiciliario no se pueda compartir hasta marcar sus puntos como revisados.
4. **Plan en el payload y en physiq-report.** **Recomendación**: no en la primera versión; decidirlo cuando el plan se haya usado en consulta.
5. **Una o dos hipótesis por plan.** **Recomendación**: una por defecto y una segunda opcional; con dos, la intervención principal se reparte y el plan avisa de que el tiempo por hipótesis baja.
