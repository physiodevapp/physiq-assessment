# Implantes con electrodos — diseño

Estado: **borrador de diseño (noviembre 2026), sin código. Aceptadas por el usuario las 19 recomendaciones (noviembre 2026)**; las 7–10 quedan abiertas a lo que digan los PDF. Viene de la decisión 22 de `docs/parkinson.md` y de la casilla «Otros implantes con electrodos» de `MIGRATION_PLAN.md` (Fase P). 19 decisiones (ver «Decisiones»). **Segunda pasada (noviembre 2026)**: Ghaly 2016, leída entera, confirma la diatermia y el ultrasonido con el estimulador medular y añade la decisión 19; ver «Segunda pasada». **PDF del usuario leídos (noviembre 2026)**: consenso EHRA 2022 y Houghton 2010; cambian las decisiones 7, 8, 9 y 14, precisan la 6 y añaden la 20 y la 21, pendientes del usuario (ver «Lectura de los PDF»). Los manuales de los fabricantes pasan a opcionales.

Reglas, como en las otras condiciones: solo fuentes leídas enteras en esta sesión; ninguna cifra, umbral ni referencia inventada; ninguna regla automática que no esté medida en las fuentes o decidida por el usuario; lo que no tiene fuente va marcado como **[propia]** (redacción propia) y es una decisión del usuario.

## Resumen (lo que hay que saber antes de leer lo demás)

- **El problema.** La FDA (2002) y Salud Canadá (2003) contraindican la **onda corta y las microondas**, térmicas o atérmicas, con **cualquier electrodo metálico implantado**: marcapasos y desfibriladores, implantes cocleares, estimuladores del crecimiento óseo, estimuladores medulares, cerebrales profundos y de otros nervios. Vale aunque el aparato esté apagado, aunque el electrodo esté desconectado o aunque solo quede un trozo de electrodo. Salud Canadá añade el **ultrasonido terapéutico** encima o cerca del implante o de sus electrodos. Hoy la app solo lo avisa con el estimulador cerebral profundo de la tarjeta del Parkinson. Un paciente con marcapasos o con estimulador medular no recibe ningún aviso, y 16 pautas nombran la electroterapia o el ultrasonido (unas para recomendarlos y otras para desaconsejarlos).
- **La electroterapia con marcapasos o desfibrilador** (TENS, interferenciales, electroestimulación neuromuscular) **sí tiene fuentes leídas en abierto**. El estudio más grande (Suhail Arain 2023, 107 desfibriladores modernos) vio interferencias en el 15,9 % de los pacientes, sobre todo con los electrodos en el tórax (14 % frente al 2,8 % en el cuello) y con más intensidad; concluye que **antes de usar TENS con un desfibrilador hay que probarlo bajo la supervisión de un especialista en dispositivos**. Hay casos de **descargas inapropiadas** del desfibrilador y de **inhibición del marcapasos** con TENS (Mohammad 2022). La revisión de Barmore 2022 resume el riesgo de la TENS para desfibriladores y marcapasos antiguos. La guía de referencia, el consenso EHRA de 2022 sobre interferencias por procedimientos médicos, está en PMC solo como PDF y no se ha podido leer: se pide.
- **Con los implantes que no son cardiacos** (estimulador medular, implante coclear, otros neuroestimuladores, estimulador del crecimiento óseo), **la electroterapia no tiene fuente leída**. Para el medular, Ghaly 2016 confirma que **no se usa onda corta, microondas ni ultrasonido terapéutico, esté encendido o apagado**, pero no dice nada de la TENS. Lo dicen los manuales de los fabricantes, que no son accesibles desde este entorno. Se piden en PDF. Hasta leerlos, la propuesta solo escribe la diatermia y el ultrasonido para ellos.
- **Propongo la forma 2**: una **tarjeta propia en la fase 1** («Implantes con electrodos», un solo estado «Lleva», chips de qué implante), **sin sistema de fase 2** (ninguna fuente leída da una pregunta de cribado propia), un recuadro de la fase 5, un aviso de la fase 6 en cualquier plan, payload, 📋 Notas, 📄 Informe (solo el antecedente) y bloque de la IA. El estimulador cerebral profundo pasa a ser **un solo dato** que se ve en las dos tarjetas (Parkinson e implantes), con la línea de técnicas escrita una sola vez.

## Qué hay hoy en la app

Búsqueda de noviembre 2026 en `data/`, `lib/` y `formularios/`:

- **Ninguna mención** de marcapasos, desfibrilador, implante coclear, estimulador medular ni neuroestimulador fuera de la tarjeta del Parkinson. El formulario del paciente no pregunta por aparatos implantados.
- **Tarjeta del Parkinson** (`docs/parkinson.md`, decisiones 14, 17, 20, 21 y 22): la fila «¿Lleva estimulador cerebral profundo?» (Sí · No · No lo sabe, `parkinson.estimulador`) y, con «Sí» o «No lo sabe», la línea roja `PK.textos.estimulador`: «Nada de onda corta ni microondas (riesgo de lesión cerebral grave o muerte aunque esté apagado, o retirado si quedan electrodos), ni ultrasonido, TENS, interferenciales ni otra electroestimulación, ni presión manual cerca de los cables (FDA 2002; Health Canada 2003; Keus 2014, 5.13)». Sale en la tarjeta, en el recuadro `.pk-fase5`, en la 4b (`cables4b`), en el aviso `parkinsonEstimulador` de la fase 6 (cualquier plan) y en el bloque de la IA (`reglaIA`, copiado en physiq-report como `_bloquePK`). Payload `pk.ec`.
- **Registro**: `FDA 2002 (diatermia)`, `Health Canada 2003 (diatermia)` y `Keus 2014` ya están, leídas enteras (la guía europea, en las partes que usa el Parkinson).
- **Pautas que nombran la técnica** (`dosis` y `dosisRamas` de `data/`; búsqueda literal de TENS, electroterapia o electroestimulación, ultrasonido, interferenciales, onda corta o microondas). La lista es la de la tarea y coincide:

| Hipótesis | Qué técnica | Cómo la nombra |
|---|---|---|
| `h1` capsulitis adhesiva | onda corta, ultrasonido, electroestimulación | **la admite** añadida al ejercicio (C) |
| `h2` pinzamiento subacromial, `h3` rotura del manguito | ultrasonido | la desaconseja (B) |
| `h10` artrosis glenohumeral, `ca1` artrosis de cadera, `ro1` artrosis de rodilla, `tp24` artrosis de tobillo o pie | TENS, ultrasonido, interferenciales, onda corta, electroterapia | la desaconsejan (NICE NG226) |
| `ca15` sensibilización central | TENS, ultrasonido, interferenciales | la desaconseja |
| `ce5` latigazo cervical | TENS | **la admite** (C) |
| `ro2` lesión meniscal | electroestimulación neuromuscular | **la admite** (B) |
| `ro3` dolor patelofemoral | ultrasonido, electroestimulación | la desaconseja (B) |
| `ro4` LCA | electroestimulación neuromuscular | **la recomienda** 6 a 8 semanas |
| `co1` epicondilalgia lateral | ultrasonido | sin recomendación |
| `tp1` esguince lateral agudo | ultrasonido | la desaconseja (A) |
| `tp8` tendinopatía del Aquiles | ultrasonido | la desaconseja como tratamiento aislado (C) |
| `tp26` dolor plantar del talón | ultrasonido | la desaconseja para potenciar el estiramiento (A) |

Cinco la proponen (`h1`, `ce5`, `ro2`, `ro4` y, en parte, `co1` sin recomendación); el resto la desaconseja. El fisio puede usarlas aunque la pauta no las nombre, por eso el aviso de la fase 6 sale en cualquier plan (como el `parkinsonEstimulador`, decisión 20 del Parkinson).

## Fuentes leídas

### Ya registradas (leídas enteras en la sesión del Parkinson; no se vuelven a citar con otra clave)

| Clave | Qué dice para este diseño |
|---|---|
| `FDA 2002 (diatermia)` | Onda corta y microondas, térmicas y atérmicas, **no deben usarse con ningún electrodo metálico implantado**, aunque el aparato esté apagado o el electrodo desconectado; tampoco si tuvo un implante, salvo certeza absoluta de que se retiraron el implante y todos los electrodos («a menudo se dejan»). No se sabe si hay distancia segura. Con el ultrasonido «no se espera esta interacción». Preguntar siempre por implantes antes de aplicarla. Lista: marcapasos y desfibriladores, implantes cocleares, estimuladores del crecimiento óseo, estimuladores medulares, cerebrales profundos y de otros nervios |
| `Health Canada 2003 (diatermia)` | Lo mismo (también si queda solo un trozo de electrodo) y **ultrasonido terapéutico contraindicado encima o cerca del implante o de sus electrodos**. Dirigida a fisioterapia |
| `Keus 2014` | Solo para el estimulador cerebral profundo (5.13): nada con componente eléctrico (onda corta, microondas, ultrasonido, TENS, interferenciales) y ninguna presión manual cerca de los cables |

### Nuevas, leídas enteras en esta sesión (texto completo de PMC, servicio BioC o la herramienta de PubMed)

| Clave propuesta | Referencia | Qué es | Qué dice |
|---|---|---|---|
| `Suhail Arain 2023` | Suhail Arain S, Cretnik A, et al. Risk of occurrence of electromagnetic interference from the application of transcutaneous electrical nerve stimulation on the sensing function of implantable defibrillators. *Europace* 2023;25(7):euad206. [doi:10.1093/europace/euad206](https://doi.org/10.1093/europace/euad206) (PMC10365842) | Estudio prospectivo de un centro, 107 pacientes con desfibrilador o resincronizador con desfibrilador de 4 fabricantes, TENS 80 Hz continua y 2 Hz en ráfagas, 1 min por prueba, con la terapia del desfibrilador desactivada y monitorización | **Interferencia en 17/107 (15,9 %)**: la más frecuente, latidos ventriculares falsos (14 %); ruido con paso a estimulación asíncrona (2,8 %); **anotación como TV/FV en 2 (1,9 %)**, intermitente, sin descarga. **Tórax 14 % frente a cuello 2,8 %** (P < 0,01), más con más intensidad (por debajo de 17 mA, ninguna, pero no lo dan como umbral seguro); frecuencia y modo no influyen. Una anotación de TV/FV fue en el cuello: «la distancia sola no basta». Limitaciones: 1 min frente a los 20 min reales; **no se probaron las extremidades**; los estudios anteriores daban un 53 % (Holmgren 2008) y un 75 % (Crevenna 2003). Conclusión: **«antes de usar TENS en pacientes con desfibrilador, deben someterse a una prueba bajo la supervisión de un especialista en dispositivos cardiacos»**, probando la intensidad máxima, las frecuencias, los modos y la orientación de los electrodos del sitio que se va a tratar. En los dependientes de marcapaso, la detección continua de latidos falsos puede inhibir la estimulación |
| `Mohammad 2022` | Mohammad S, Mayer C, Foisy M, Chen MS. Inappropriate implantable cardioverter-defibrillation detection of ventricular fibrillation induced by transcutaneous electrical nerve stimulation. *J Innov Card Rhythm Manag* 2022;13(5):5009–5012. [doi:10.19102/icrm.2022.130506](https://doi.org/10.19102/icrm.2022.130506) (PMC9154014) | Dos casos | Dos pacientes con desfibrilador que usaban TENS para el dolor lumbar en casa. Uno, ruido interpretado como FV sin descarga. El otro, dependiente de marcapaso: **1 estimulación antitaquicardia y 4 descargas inapropiadas, y la TENS inhibió la estimulación ventricular**. El riesgo parece menor con los electrodos lejos del aparato (p. ej., las piernas) y con baja frecuencia, pero los aparatos actuales aún interfieren. Lo ideal, aplicarla monitorizado y con las terapias del desfibrilador desactivadas; **«recomendamos que los pacientes con desfibrilador no usen aparatos de TENS en casa»** |
| `Barmore 2022` | Barmore W, Patel H, Voong C, Tarallo C. Effects of medically generated electromagnetic interference from medical devices on cardiac implantable electronic devices: a review. *World J Cardiol* 2022;14(8):446–453. [doi:10.4330/wjc.v14.i8.446](https://doi.org/10.4330/wjc.v14.i8.446) (PMC9453256) | Revisión narrativa | Las interferencias pueden inhibir el marcapaso (bradicardia, incluso parada) o dar descargas inapropiadas del desfibrilador. **Más riesgo con la TENS para desfibriladores y algunos marcapasos de generaciones anteriores**; casos de descarga con TENS en un desfibrilador subcutáneo (cuello, axila, espalda) y en uno transvenoso. Riesgo bajo entre estimulador medular o cerebral profundo y el dispositivo cardiaco (casos). Para que convivan, probar en el «peor escenario» y bajar la salida del estimulador al mínimo eficaz. Las recomendaciones del área son **opinión de expertos** |
| `Kim 2021` | Kim M, Park JK, et al. Neuromuscular electrical stimulation for a dysphagic stroke patient with cardiac pacemaker using magnet mode change: a case report. *World J Clin Cases* 2021;9(19):5313–5318. [doi:10.12998/wjcc.v9.i19.5313](https://doi.org/10.12998/wjcc.v9.i19.5313) (PMC8283601) | Un caso | Electroestimulación neuromuscular faríngea con marcapasos: **se retrasó hasta hablar con cardiología y con el fabricante**; la primera sesión, con el marcapasos reprogramado por el técnico y el cardiólogo presente; después, con un imán sobre el aparato y médico delante, ECG tras cada sesión. Cita (sin que se hayan leído) que la AHA aconseja no usar TENS en el tronco con marcapasos o desfibrilador y que la FDA pone los dispositivos eléctricos implantados como contraindicación de los estimuladores musculares |
| `Suarez-Fuster 2018` | Suarez-Fuster L, Oh C, et al. Transcutaneous electrical nerve stimulation electromagnetic interference in an implantable loop recorder. *J Arrhythm* 2018;34(1):96–97. [doi:10.1002/joa3.12009](https://doi.org/10.1002/joa3.12009) (PMC5828268) | Un caso | La TENS en casa hizo que un **Holter implantable** registrara una falsa fibrilación auricular. **No era contraindicación seguir con la TENS**; quien lee el registro tiene que saberlo para no tomar decisiones equivocadas |
| `Ghaly 2016` | Ghaly RF, Tverdohleb T, Candido KD, Knezevic NN. Do we need to establish guidelines for patients with neuromodulation implantable devices, including spinal cord stimulators undergoing nonspinal surgeries? *Surg Neurol Int* 2016;7:18. [doi:10.4103/2152-7806.176373](https://doi.org/10.4103/2152-7806.176373) (PMC4766801) | Dos casos y revisión narrativa (perioperatoria) | **«La diatermia por onda corta, microondas y ultrasonido terapéutico no debe usarse en pacientes con estimulador medular implantado»**: la energía pasa por el sistema y puede dar lesión grave del tejido e incluso la muerte, **esté encendido o apagado**. El manual de seguridad de la FDA (no leído) avisa de la diatermia, otros estimuladores implantados, la litotricia, la desfibrilación externa, la radioterapia y el ultrasonido de alta potencia. **Los movimientos repetidos de columna en algunos deportes o trabajos (levantamiento de pesas, construcción) pueden romper o desplazar los cables.** Con desfibrilador y neuroestimulador a la vez, probar los dos aparatos juntos. No hay guías ni consenso para estos pacientes; sin datos de la TENS |
| `Chen 2022 (electroterapia)` | Chen PY, et al. Clinical applications and consideration of interventions of electrotherapy for orthopedic and neurological rehabilitation. *J Chin Med Assoc* 2022;85(1):24–29 (PMC12755623). [doi:10.1097/JCMA.0000000000000634](https://doi.org/10.1097/JCMA.0000000000000634) | Revisión narrativa de electroterapia | «En general, los marcapasos, el embarazo y la epilepsia se consideran contraindicaciones de la electroestimulación»; los electrodos no se ponen en la cabeza, el cuello, el tórax ni el abdomen. **Sin fuente para esa frase**: solo como contraste (ver «Contradicciones») |

### Salvedades de lectura

- **No hay ningún ensayo ni guía de fisioterapia leída** sobre electroterapia y dispositivos cardiacos. Lo leído es un estudio de seguridad de un centro (Suhail Arain 2023), casos (Mohammad 2022, Kim 2021, Suarez-Fuster 2018) y dos revisiones narrativas (Barmore 2022, Chen 2022). Los consensos de cardiología y de fisioterapia que están en el origen (EHRA 2022, Houghton 2010, Digby 2009) no se han podido leer.
- **Suhail Arain 2023** probó solo TENS, en cuello y tórax, 1 minuto. No dice nada de las interferenciales, la electroestimulación neuromuscular ni las extremidades.
- **Lo que Kim 2021 atribuye a la AHA y a la FDA** (TENS en el tronco, estimuladores musculares) no se ha leído en su fuente: no se cita como AHA ni como FDA.
- **Leídas solo en parte, no se citan**: dos revisiones perioperatorias (PMC13266869, PMC11150116), que solo nombran la TENS y los neuroestimuladores como fuentes de interferencia, y una revisión de autocuidado tras el marcapasos (PMC12430239), que trata el hombro tras la implantación (no es de este diseño).
- **Descartadas por no ser de fisioterapia**: Frampton 2012 (PMC3954286), sobre la diatermia **quirúrgica** (bisturí eléctrico) con implante coclear: monopolar nunca en cabeza y cuello, bipolar a más de 2 cm (guía del British Cochlear Implant Group, no leída). No dice nada de la onda corta terapéutica y no se cita para ella. Una revisión de electroanalgesia (PMC11198869) no trata los implantes.
- **Houghton 2010** consta en Europe PMC como no abierta, con PDF solo desde el visor: sigue en «PDF que necesito».
- **Búsquedas**: PubMed (E-utilities) funcionó en esta sesión; el texto completo, por el servicio BioC de PMC o la herramienta de PubMed. Las webs de los fabricantes (medtronic.com, bostonscientific.com, cochlear.com, nevro.com) están bloqueadas por el proxy. El PDF del consenso EHRA en PMC pide una comprobación del navegador que no se ha intentado saltar.

## Contradicciones y huecos entre fuentes

1. **Ultrasonido con implante**: la FDA 2002 no espera interacción; Salud Canadá 2003 lo contraindica encima o cerca del implante o de los electrodos; Keus 2014 (cerebral profundo) y Ghaly 2016 (medular) lo excluyen sin zona. **Propuesta**: con cualquier implante, seguir a Salud Canadá (encima o cerca del implante y de sus electrodos); con el cerebral profundo y el medular, en ninguna zona (decisión 6).
2. **TENS con desfibrilador: prohibida o probada antes.** Mohammad 2022 aconseja no usarla en casa; Suhail Arain 2023 dice que los datos de la contraindicación general son antiguos y propone probarla antes, con un especialista en dispositivos; Chen 2022 pone el marcapasos como contraindicación sin fuente. Las tres coinciden en que **no la decide el fisioterapeuta solo**. **Propuesta**: con marcapasos o desfibrilador, ninguna electroterapia salvo que la unidad de dispositivos o cardiología la haya probado y autorizado para esa zona; nunca para usar en casa con desfibrilador (decisión 7).
3. **Distancia**: Mohammad 2022 cree el riesgo menor en las piernas; Suhail Arain 2023 no lo probó y vio una TV/FV en el cuello. **Propuesta**: decir que el riesgo es mayor en el tórax y cerca del aparato, sin dar las extremidades por seguras (decisión 8).
4. **Marcapasos sin cables y Holter implantable**: la FDA y Salud Canadá hablan de electrodos («leads»). Un marcapasos sin cables es un aparato metálico en el corazón sin electrodos; un Holter implantable no estimula. Ninguna fuente leída los trata para la diatermia. **Propuesta**: el marcapasos sin cables, como cualquier marcapasos **[propia]**, la opción prudente; el Holter implantable, fuera de la tarjeta, con solo una línea de Suarez-Fuster 2018 en la fila de la guía (decisión 4).
5. **Electroterapia con estimulador medular, coclear y otros neuroestimuladores**: sin fuente leída. Barmore 2022 solo trata la convivencia entre el neuroestimulador y el dispositivo cardiaco. **Propuesta**: no escribir nada de la electroterapia para ellos hasta leer los manuales (decisión 9).
6. **Presión manual cerca del aparato**: solo Keus 2014, y solo para el cerebral profundo. **Propuesta**: no extenderla a los demás sin fuente (decisión 10).

## Criterio de entrada de la Fase P: sí entra

- **Cambia la seguridad**: hay técnicas que pueden matar (diatermia) o descargar un desfibrilador e inhibir un marcapasos (electroterapia) en cualquier región, y hoy la app no lo pregunta salvo en el Parkinson.
- **Cambia la técnica**, no la interpretación: ningún test de la 4b cambia, pero sí el plan de 16 pautas y lo que el fisio puede añadir.
- **Es transversal**: sale en las 7 regiones y en cualquier edad (el estimulador medular es frecuente en el dolor lumbar persistente tras cirugía; el marcapasos, en los mayores).
- **Lo ve un fisioterapeuta**: elegir una técnica es la consulta.

No hay preguntas de cribado propias: lo que dicen las fuentes leídas es de técnica, no de banderas. Por eso la forma recomendada no lleva sistema de fase 2 (como el trastorno mastocitario, que solo tiene una derivación).

## Formas posibles, de menos a más

| # | Forma | Qué añade | A favor | En contra |
|---|---|---|---|---|
| 0 | Nada nuevo | — | — | Marcapasos, desfibriladores y estimuladores medulares sin ningún aviso |
| 1 | Solo texto | Fila en la guía de condiciones y una frase en el aviso común de la fase 6 | Sin lógica | No pregunta qué lleva; el aviso no puede decir qué técnica |
| 2 | **Tarjeta sin sistema** *(recomendada)* | Tarjeta con qué implante, recuadro de la fase 5, aviso de la fase 6, salidas | Todo lo que dicen las fuentes; el cerebral profundo, un solo dato | Una tarjeta más |
| 3 | Tarjeta y sistema | Lo anterior con preguntas de fase 2 (fallo del aparato, descarga del desfibrilador) | — | Sin fuente leída para esas preguntas; `sx_sincope` ya cubre el síncope de esfuerzo |
| 4 | Pregunta de cribado suelta | Una pregunta «¿Lleva algún aparato implantado?» en el sistema cardiovascular | Mínimo | No vale para el coclear ni el medular; las técnicas no salen en las fases 5 y 6 |

## Forma recomendada (forma 2), en borrador

Mismos principios que las otras condiciones: capa transversal; el árbol CIF y el motor de puntuación no se tocan; el fisio no diagnostica ni reprograma; la seguridad nunca se recorta y marcar la tarjeta **nunca quita ni rebaja una `urgencia` de ningún sistema** (prueba unitaria en las 7 regiones).

### Fase 1 — tarjeta «Implantes con electrodos» (`#cardImplantes`)

- **Sitio**: después de la tarjeta del Parkinson (decisión 1).
- **Título**: «Implantes con electrodos» (decisión 2).
- **Nota bajo el título** **[propia]**: «Márcala si lleva un aparato implantado con cables o electrodos, aunque esté apagado, o si se lo quitaron y no sabe si quedan cables. Pregúntalo siempre antes de usar agentes físicos.» (la última frase, de FDA 2002: «preguntar siempre por implantes antes de aplicarla»).
- **Estado**: un solo botón «Lleva» (segundo toque, se desmarca; sin «Sospecha»: lo lleva o no).
- **«¿Qué lleva?»**, chips de selección múltiple (decisión 3; nombres **[propia]**, ejemplos de FDA 2002):
  - Marcapasos (también sin cables o resincronizador)
  - Desfibrilador implantable (también subcutáneo)
  - Estimulador medular
  - Estimulador cerebral profundo (ver «Relación con la tarjeta del Parkinson»)
  - Implante coclear
  - Otro estimulador de nervios (sacro, vago, hipogloso, nervio periférico)
  - Estimulador del crecimiento óseo
  - Se lo quitaron, pueden quedar electrodos
  - No sabe cuál (excluye los demás, como «No lo sabe» del anticoagulado)
- **Nada marcado o «No sabe cuál»** = el caso prudente: salen todas las líneas, también la de la electroterapia de los cardiacos (decisión 5).
- **Línea roja nunca plegada**, con cualquier chip (decisión 6): «**Nada de onda corta ni microondas**, térmicas o atérmicas, en ninguna zona, aunque el aparato esté apagado o se haya retirado y queden electrodos; **ni ultrasonido encima o cerca del aparato o de sus cables**» (FDA 2002; Health Canada 2003).
- **Con marcapasos, desfibrilador, «No sabe cuál» o nada marcado**, segunda línea roja (decisión 7): «**Ninguna electroterapia** (TENS, interferenciales, electroestimulación) salvo que la unidad de dispositivos o cardiología la haya probado y autorizado para esa zona. Más riesgo en el tórax, cerca del aparato y con más intensidad. **Con desfibrilador, nunca para usar en casa**» (Suhail Arain 2023; Mohammad 2022; Barmore 2022; Kim 2021).
- **Con estimulador cerebral profundo**: la línea actual del Parkinson (Keus 2014), una sola vez (decisión 11).
- **Con estimulador medular**: la primera línea con «ni ultrasonido terapéutico en ninguna zona» (Ghaly 2016). La de los movimientos repetidos de columna va solo en el recuadro de la fase 5 (decisión 19).
- **Con estimulador medular, coclear, otro estimulador de nervios o del crecimiento óseo**: hasta leer los manuales, nada más de la electroterapia; debajo, en gris: «La electroterapia con este aparato: pendiente de los manuales del fabricante; consulta al equipo que lo implantó» **[propia]** (decisión 9).

### Fases 2, 3 y 4

Nada (forma 2). El síncope de esfuerzo ya es urgencia en las 7 regiones (`sx_sincope`). Las preguntas posquirúrgicas (`pq_*`) no cambian.

### Fase 4b

Nada: ningún test usa electroterapia ni diatermia. Con el cerebral profundo, la línea `cables4b` del Parkinson se queda como está (decisión 11).

### Fase 5 — recuadro «Implantes con electrodos» (`.ie-fase5`, nunca se pliega)

1. Lo que lleva, en una línea («Lleva: marcapasos · estimulador medular»).
2. La línea de la diatermia y el ultrasonido (decisión 6).
3. La de la electroterapia con marcapasos o desfibrilador (decisión 7).
4. Con el cerebral profundo, la del Parkinson (decisión 11).
5. Con el estimulador medular u otros, la nota gris de pendiente (decisión 9).
6. Con el estimulador medular: «Los movimientos repetidos de columna con carga (levantamiento de pesos, algunos trabajos) pueden romper o desplazar los cables: tenlo en cuenta al dosificar el ejercicio y pregunta si el equipo que lo implantó le puso límites» (Ghaly 2016; la segunda mitad, **[propia]**) (decisión 19).
7. Con una hipótesis activa cuya pauta propone la técnica (`h1`, `ce5`, `ro2`, `ro4`; lista fija con prueba unitaria, como `HIP_PUNCION_SECA` del anticoagulado): «La pauta de <hipótesis> propone <técnica>: con este implante, no» o «solo con autorización de cardiología» **[propia]** (decisión 12).

### Fase 6 — plan de tratamiento

- **Aviso `implantes`** en cualquier plan con la tarjeta marcada (como `parkinsonEstimulador`, decisión 20 del Parkinson): las líneas 2–5 del recuadro, sin la 6 (decisión 13).
- **Aviso por pauta**: con `h1`, `ce5`, `ro2` o `ro4` elegidas, la línea 7 (decisión 12).
- **Programa para casa**, solo con desfibrilador (decisión 14): «No uses un aparato de TENS en casa» (Mohammad 2022).
- **Sin red de seguridad nueva** ni tope de técnica nuevo: lo que cambia es la elección del agente físico, no un riesgo que el paciente deba vigilar (decisión 15).

### Salidas

- **Payload `ie`**, solo con la tarjeta marcada (la `huella` de los informes con IA anteriores no cambia): `{ es: 'lleva', ti: [...] }`, `ti` en el orden de la tarjeta, con `['mp','dai','em','ecp','ci','on','co','re','ns']`; `[]` sin registrar (decisión 16).
- **📋 Notas**: «⚡ IMPLANTES CON ELECTRODOS: marcapasos · estimulador medular · sin diatermia; electroterapia solo con autorización».
- **📄 Informe**: en antecedentes, «Portador de: marcapasos, estimulador medular» **sin técnicas** (como la decisión 17 del anticoagulado: el informe es para el paciente y su médico; las técnicas son del fisio).
- **Informe con IA**: `bloqueIEIA()` en `contextoValoracion()`, sin citas: lo de 📋 Notas más «No propongas onda corta ni microondas, ni ultrasonido sobre el aparato o sus cables; con marcapasos o desfibrilador, no propongas electroterapia salvo que conste la autorización de cardiología». `lib/reglas-informe.js` no se toca. **physiq-report**: una copia literal, `_bloqueIE` en su `lib/payload.js`, con `IE_CASOS` fijando el mismo texto en los dos repositorios, en otra PR.
- **Plan detallado con IA** (`promptPlan()`): el bloque de datos lleva `ie`, así que la regla llega también al plan; la revisión automática del plan (`lib/revision-plan.js`) añade un punto `alto` si el plan con IA propone diatermia, ultrasonido o electroterapia con la tarjeta marcada (decisión 17).
- **Modo breve**: «Implante con electrodos: qué lleva sin registrar» como pendiente (`ancla: 'cardImplantes'`), porque decide la electroterapia.

### Guía de condiciones especiales

Una fila, después del Parkinson (decisión 18):

- **Nombre**: «Implantes con electrodos».
- **Qué es** **[propia]**: «Aparatos implantados con cables que llevan corriente al corazón, la médula, el cerebro, un nervio o el oído. La onda corta y las microondas pueden calentar los cables y lesionar el tejido de alrededor; la electroterapia puede engañar a un marcapasos o un desfibrilador.»
- **Piensa en ella si**: lleva marcapasos o desfibrilador; le pusieron un estimulador para el dolor de espalda o de piernas; lleva un implante coclear; le quitaron un aparato y no sabe si quedan cables.
- **Al marcarla, añade**: las líneas rojas de la tarjeta, el recuadro de la fase 5 y el aviso de la fase 6.
- **Fuentes**: FDA 2002 · Health Canada 2003 · Suhail Arain 2023.
- **Línea aparte** (decisión 4): «Un Holter implantable no se marca: la TENS no le hace daño, pero puede registrar una falsa arritmia; avisa a quien lo lee» (Suarez-Fuster 2018).

### Hojas impresas y guía de consulta

- **Hoja `condiciones`**: la fila nueva («En papel: …», «Si la tiene, añade: …», «Plan (fase 6): …»).
- **Hoja `plan`**: el aviso `implantes`.
- **Hoja `fase1`**: si lista las tarjetas de condición, la nueva.
- **Guía** (`guia.html`): la fila de condiciones (`condicionesHTML`), una casilla en el formulario de `#plan` (`guia-plan.js`) y el recuadro de la fase 5 en `lib/guia-condiciones.js` con sus variantes por chip.
- Regenerar las hojas que pida «hojas impresas al día», su historial y los cuadernos. El cribado no cambia (sin sistema).

## Relación con la tarjeta del Parkinson

Hoy el cerebral profundo vive en la tarjeta del Parkinson, con «No lo sabe» y la línea de Keus 2014. Tres opciones:

| Opción | Qué pasa | A favor | En contra |
|---|---|---|---|
| A. Las dos, independientes | Cada tarjeta tiene su dato y su línea | Sin tocar el Parkinson | Marcar dos veces lo mismo; la línea sale dos veces en la fase 5 y la 6 |
| **B. Un solo dato, visible en las dos** *(recomendada)* | La fila del Parkinson y el chip «Estimulador cerebral profundo» son **el mismo campo** (como el sexo de las fases 1 y 2 o las caídas del Parkinson y la osteoporosis): «Sí» en una marca la otra. «No lo sabe» sigue solo en el Parkinson (el chip no tiene ese matiz) | Un dato, una línea | Código de sincronización |
| C. Solo en la nueva | La fila del Parkinson pasa a una línea con «Ir a la tarjeta →», como el anticoagulante del lupus | Un solo sitio | Quita la pregunta de donde el fisio la espera; «No lo sabe» se pierde |

Con B: la línea de Keus 2014 sale **una sola vez**, en el recuadro de los implantes, y el recuadro del Parkinson remite a él («Estimulador: ver Implantes con electrodos»); el aviso `parkinsonEstimulador` se sustituye por el de los implantes; `pk.ec` del payload **no cambia** (se sigue derivando de la fila), así que `_bloquePK` de physiq-report y su `PK_CASOS` no se tocan; la `reglaIA` del Parkinson se queda (es la misma regla que la de los implantes y no sobra si el fisio no marca la tarjeta nueva). Ninguna regla clínica nueva: es el mismo dato en dos sitios.

## Fuera de este diseño (apuntado, no resuelto)

- **Hombro tras implantar el marcapasos o el desfibrilador** (restricción de elevar el brazo las primeras semanas, hombro rígido): otra tarea, con sus fuentes; la revisión de PMC12430239 lo trata y no se ha leído entera.
- **Resonancia, bisturí eléctrico, litotricia**: no son técnicas de fisioterapia.
- **Asistencia ventricular (LVAD)** y **bombas de infusión implantadas** (sin electrodos): fuera.
- **Magnetoterapia, láser, ondas de choque y punción seca con corriente (electrólisis percutánea)** con implantes: ninguna fuente leída; se buscan en los PDF de Houghton 2010 y del consenso EHRA.

## Decisiones (cada una con mi recomendación; aceptadas las 19 por el usuario, noviembre 2026)

1. **Dónde se pregunta**: recomiendo **tarjeta propia en la fase 1, después del Parkinson**, sin sistema de fase 2 (forma 2). Una pregunta de cribado no sirve para el coclear ni el medular, y lo que cambia es la técnica.
2. **Nombre**: «Implantes con electrodos» (el del aviso de la FDA, «implanted leads»). Alternativa: «Aparatos implantados».
3. **Chips**: los 9 de la tarjeta. El marcapasos sin cables y el resincronizador, dentro de «Marcapasos»; el subcutáneo, dentro de «Desfibrilador».
4. **Marcapasos sin cables y Holter implantable**: recomiendo **el sin cables como cualquier marcapasos [propia]** y **el Holter implantable fuera de la tarjeta**, con su línea en la guía de condiciones (Suarez-Fuster 2018).
5. **Nada marcado o «No sabe cuál»**: recomiendo **todas las líneas**, la opción prudente (como «No lo sabe» del anticoagulado).
6. **Diatermia y ultrasonido, con cualquier implante**: recomiendo **onda corta y microondas en ninguna zona; ultrasonido no encima ni cerca del aparato o los cables** (FDA 2002; Health Canada 2003). Con el cerebral profundo (Keus 2014) y el medular (Ghaly 2016), ultrasonido terapéutico en ninguna zona.
7. **Electroterapia con marcapasos o desfibrilador**: recomiendo **ninguna salvo autorización de la unidad de dispositivos o cardiología, tras probarla para esa zona; con desfibrilador, nunca en casa** (Suhail Arain 2023; Mohammad 2022; Barmore 2022; Kim 2021). **Provisional hasta leer el consenso EHRA 2022** (PDF 1): si da otra regla, se cambia.
8. **Distancia**: recomiendo **decir que el riesgo es mayor en el tórax, cerca del aparato y con más intensidad**, sin dar ninguna zona por segura.
9. **Electroterapia con estimulador medular, coclear, otros neuroestimuladores y del crecimiento óseo**: recomiendo **no escribir nada hasta leer los manuales** (PDF 4–6); mientras, la nota gris «pendiente, consulta al equipo que lo implantó» **[propia]**. Alternativa: aplicarles la línea de los cardiacos sin fuente.
10. **Presión manual cerca del aparato**: recomiendo **solo con el cerebral profundo** (Keus 2014), sin extenderla.
11. **Relación con el Parkinson**: recomiendo **la opción B** (un solo dato visible en las dos tarjetas, línea una sola vez, `pk.ec` y `_bloquePK` sin cambios).
12. **Línea por pauta** (`h1`, `ce5`, `ro2`, `ro4`): recomiendo **sí**, en el recuadro de la fase 5 y como aviso de la fase 6, con lista fija y prueba unitaria que falle si una pauta nueva nombra la técnica.
13. **Aviso de la fase 6**: recomiendo **en cualquier plan con la tarjeta marcada**.
14. **Programa para casa con desfibrilador**: recomiendo **la frase «No uses un aparato de TENS en casa»** (Mohammad 2022).
15. **Red de seguridad y tope nuevos**: recomiendo **ninguno**.
16. **Payload `ie`**: recomiendo `{ es, ti }` solo con la tarjeta marcada, y la copia `_bloqueIE` en physiq-report en otra PR.
17. **Revisión del plan con IA**: recomiendo **un punto `alto`** en `lib/revision-plan.js` si propone diatermia, ultrasonido o electroterapia con la tarjeta marcada. Para el informe narrativo, nada (no propone técnicas).
18. **Formulario del paciente**: recomiendo **una pregunta nueva en `formularios/comun.js`** («¿Llevas algún aparato implantado: marcapasos, desfibrilador, estimulador o implante del oído?», Sí / No / No sé) como pista «📝 Refiere el paciente» sobre la tarjeta, que **nunca la marca**. Cambia la hoja impresa del formulario general. Alternativa: sin pregunta, solo la nota de la tarjeta.
19. **Movimientos repetidos de columna con estimulador medular** (Ghaly 2016, opinión de los autores, sin datos): recomiendo **una línea en el recuadro de la fase 5, solo para el fisio**, sin regla de dosis ni aviso en la fase 6. Alternativa: dejarla fuera hasta leer el manual del fabricante, que suele dar los límites tras la implantación.

## Cambios técnicos previstos (con las decisiones aceptadas)

- `data/comun.js`: `IMPLANTES` (tipos, textos de la tarjeta, del recuadro, del aviso, `reglaIA`, `HIP_AGENTE_FISICO` con `h1`, `ce5`, `ro2`, `ro4`). Sin sistema `transversal_*`.
- `lib/implantes.js` (puro): estado vacío y normalización, `esCardiaco()`, `lineasImplantes()`, `iePayload()`, `lineaNotasIE()`, `informeIE()`, `bloqueIEIA()`, `pendientesIE()`, `avisosPautaIE()`. Pruebas unitarias.
- `index.html` (`#cardImplantes`), `app.js` (`_pintarIEUI`, `selectIEEstado`, `toggleIETipo`, recuadro `.ie-fase5`, sincronización del cerebral profundo con `parkinson.estimulador`), `state.js` (`implantes: { estado, tipos }`), `_softResetApp()`, restauración de la sesión.
- `lib/resumenes.js`, `lib/informe-narrativo.js` (`contextoValoracion()`), `lib/plan-ia.js`, `lib/revision-plan.js`.
- `plan.js`, `lib/plan-tratamiento.js`, `data/plan-tratamiento.js` (aviso `implantes` y los de pauta; `parkinsonEstimulador` sustituido); `docs/plan-tratamiento-frases.md` regenerado.
- `data/condiciones.js` + `lib/condiciones.js` (fila; la prueba de la fila por sistema no aplica, sin `transversal_*`: se añade a mano, como el posquirúrgico).
- `formularios/comun.js` (decisión 18) y su hoja.
- `lib/esquemas.js`, `lib/guia-condiciones.js`, `guia-plan.js`, `docs/esquemas/hojas.mjs`; hojas, historial y cuadernos regenerados.
- `data/referencias.js`: `Suhail Arain 2023`, `Mohammad 2022`, `Barmore 2022`, `Kim 2021`, `Suarez-Fuster 2018`, `Ghaly 2016`, `Chen 2022 (electroterapia)` (`Chen 2022` ya existe) y las de los PDF si el texto final las usa; `docs/referencias.md` regenerado.
- `tests/unit/implantes.mjs` (incluida «marcar la tarjeta nunca quita ni rebaja una urgencia de otro sistema» y la lista fija de pautas) y una sección `implantes` en la prueba de humo; la del Parkinson, con la sincronización.
- `deploy-to-hub.yml`: `lib/implantes.js` (la prueba de los archivos importados lo exige).

## PDF que necesito

Desde el entorno llegan PubMed y el texto de PMC; las editoriales y los fabricantes están bloqueados, y el PDF de PMC pide una comprobación del navegador. Por orden de utilidad:

| # | Fuente | Enlace | Para qué |
|---|---|---|---|
| 1 | ✅ **Recibido y leído (noviembre 2026).** **Stühlinger M, Burri H, Vernooy K, et al.** EHRA consensus on prevention and management of interference due to medical procedures in patients with cardiac implantable electronic devices. *Europace* 2022;24(9):1512–1537 | [PMC11636572](https://pmc.ncbi.nlm.nih.gov/articles/PMC11636572/) · [doi:10.1093/europace/euac040](https://doi.org/10.1093/europace/euac040) | La guía de referencia de cardiología: qué dice de la TENS, la electroestimulación, la diatermia y el ultrasonido con marcapasos y desfibrilador, con su grado. Decide las decisiones 7 y 8 |
| 2 | ✅ **Recibido y leído (noviembre 2026).** **Houghton PE, Nussbaum EL, Hoens AM** (autores comprobados en el PDF). Electrophysical agents — contraindications and precautions: an evidence-based approach to clinical decision making in physical therapy. *Physiother Can* 2010;62(5):1–80 | [PMC3031347](https://pmc.ncbi.nlm.nih.gov/articles/PMC3031347/) · [doi:10.3138/ptc.62.5](https://doi.org/10.3138/ptc.62.5) | El consenso canadiense de fisioterapia: contraindicaciones de cada agente físico con dispositivos electrónicos implantados (también láser, magnetoterapia, ondas de choque si los trata) |
| 3 | **Digby GC, Daubney ME, Baggs J, Campbell D, Simpson CS, et al.** Physiotherapy and cardiac rhythm devices: a review of the current scope of practice. *Europace* 2009;11(7):850–859 | [doi:10.1093/europace/eup102](https://doi.org/10.1093/europace/eup102) | La revisión de fisioterapia y dispositivos cardiacos (opcional si llega el 1) |
| 4 | **Manual del médico de un estimulador medular**: Medtronic (Intellis o Inceptiv), Abbott (Proclaim o Eterna), Boston Scientific (WaveWriter) o Nevro (HFX); basta uno, el más usado en tu entorno | Bibliotecas de manuales: [manuals.medtronic.com](https://manuals.medtronic.com) · [manuals.eifu.abbott](https://manuals.eifu.abbott) · bostonscientific.com (sección «eLabeling») · nevro.com | La sección de diatermia, ultrasonido, TENS y otra electroterapia. Decide la decisión 9 para el medular |
| 5 | **Guía de procedimientos médicos de un implante coclear**: Cochlear («Nucleus Medical Procedures») o MED-EL («Medical Procedures for MED-EL Implant Systems») | En cochlear.com y medel.com, sección de profesionales | Lo mismo para el coclear |
| 6 | (Opcional) Manual de un estimulador de nervio sacro (Medtronic InterStim) o del vago (LivaNova) | manuals.medtronic.com · livanova.com | Lo mismo para «Otro estimulador de nervios» |

Para cada uno: el PDF entero o, si es un manual largo, solo las páginas de advertencias y precauciones («Warnings», «Precautions», «Medical procedures»).

## Lectura de los PDF (noviembre 2026)

El usuario subió el consenso EHRA de 2022 (PDF, 26 pp.) y el número especial de *Physiotherapy Canada* de 2010 (PDF, 83 pp.).

### Qué se leyó

| Clave propuesta | Referencia | Qué se leyó | Qué es |
|---|---|---|---|
| `Stühlinger 2022` | Stühlinger M, Burri H, Vernooy K, et al. EHRA consensus on prevention and management of interference due to medical procedures in patients with cardiac implantable electronic devices. *Europace* 2022;24(9):1512–1537. [doi:10.1093/europace/euac040](https://doi.org/10.1093/europace/euac040) | Antecedentes, método, tablas 1–5 (categorías, señales que interfieren, efectos, listas de comprobación), **la sección entera de TENS, electroestimulación muscular y estimulador medular** (pp. 1528–1530, con sus recomendaciones) y el inicio de «otros procedimientos». **No leídos**: electrocauterio, ablación, radioterapia, resonancia, endoscopia y el anexo de radiografías, que no son de fisioterapia | Consenso de 20 expertos de la EHRA más dos de cada sociedad (HRS, LAHRS, APHRS), revisión hasta junio 2021; tres categorías («should do this», «may be used», «should not be used»), que los autores dicen que no equivalen a las clases I–III ni a los niveles A–C de una guía |
| `Houghton 2010` | Houghton PE, Nussbaum EL, Hoens AM. Electrophysical agents — contraindications and precautions: an evidence-based approach to clinical decision making in physical therapy. *Physiother Can* 2010;62(5):1–80. [doi:10.3138/ptc.62.5](https://doi.org/10.3138/ptc.62.5) | Cap. 1 (propósito, método, definiciones), tabla 1 (resumen de las recomendaciones) y, de cada agente, la sección de dispositivos electrónicos: ultrasonido 3-6, electroestimulación 4-1, más 4-16 (tórax y corazón), 4-15 (cuello) y 4-17 (cabeza), onda corta 8-5 y 8-6, y las listas de láser, calor superficial y frío. **No leídos**: el resto de condiciones de cada agente, la guía de práctica segura (cap. 9) y los anexos | Consenso de fisioterapia: encuesta a 8 expertos de Canadá y EE. UU., 17 libros de texto, las guías de la APA (Australia) y de la CSP (Reino Unido) y revisión de la literatura hasta marzo 2008. **Contraindicación** = posible reacción grave (los autores la ponen aunque falte evidencia); **precaución**; **seguro**. Cada recomendación con su nivel de evidencia (bajo, moderado, fuerte). No trata las microondas |

### Qué dicen para este diseño

**Stühlinger 2022 (EHRA)**
1. En la tabla de señales que interfieren, la **electroestimulación terapéutica (TENS, estimulación muscular, estimulador medular) tiene incidencia alta** (más de 1 de cada 10) de sobredetección y de estimulación o terapia del desfibrilador inapropiadas. La **diatermia terapéutica**, incidencia baja (menos de 1 de cada 1000) de lo mismo. El consenso trata el funcionamiento del aparato, no el calentamiento de los cables, que es el riesgo de la FDA.
2. **Lo que más pesa es dónde se aplica la corriente**: lo más arriesgado es la aplicación bilateral, con el aparato dentro del flujo de corriente, cerca del dispositivo. El modo y el tipo de corriente, poco. Cualquier dispositivo puede verse afectado.
3. **Recomendaciones** («should do this»):
   - **La TENS y la otra electroestimulación, solo tras consultar a un especialista en dispositivos**.
   - **Lo más lejos posible del aparato**, y mejor **con los electrodos del mismo lado**.
   - **La primera sesión**: con marcapasos dependiente, con el electrograma y los marcadores vigilados por personal formado en dispositivos; con desfibrilador, bajo su vigilancia, con ECG continuo y un desfibrilador al lado.
   - **Si las pruebas no ven interacción, se puede seguir sin ese personal**, siempre que no cambien el sitio, los parámetros ni la programación del aparato. **Si cambian, se repite la prueba.**
   - Se anima a la telemonitorización. **La sesión se interrumpe enseguida si hay síntomas cardiacos**, y se reevalúa con el especialista.
   - El plan lo diseñan **juntos el fisioterapeuta y el centro de dispositivos**.
4. **Holter implantable**: sin medidas, salvo recuperar los registros, que pueden llenarse de artefactos.

**Houghton 2010**
1. **Ultrasonido (3-6)**, continuo o pulsado: **no directamente sobre el marcapasos u otro aparato electrónico** (desfibrilador, estimuladores), esté o no funcionando. **Solo si se sabe dónde están exactamente los componentes**, y vigilando al paciente si se aplica lejos de ellos. Evidencia baja: no se conocen efectos adversos publicados. Las alertas de lesión o muerte son de la **diatermia por ultrasonido**, que «no es un aparato que usen los fisioterapeutas». La CSP solo evita el ultrasonido térmico (continuo).
2. **Electroestimulación (4-1)**, TENS, electroestimulación neuromuscular y corriente pulsada de alto voltaje: **no aplicarla donde pueda alterar el funcionamiento** de un aparato electrónico implantado: marcapasos, desfibrilador, **neuroestimuladores medulares o cerebrales, estimuladores del crecimiento óseo**. Hacer un ECG durante la aplicación para ver si interfiere con el marcapasos o cambia la frecuencia cardiaca, y avisar a los médicos de que los artefactos de la TENS en el ECG no son arritmias. Evidencia moderada. Unos autores la contraindican solo sobre el aparato y otros en cualquier zona. En 51 pacientes con marcapasos a demanda, 20 aparatos de TENS en 4 o más zonas no dieron ninguna interferencia.
3. **Tórax (4-16)**: con marcapasos, evitar la TENS en la parte anterior del tórax; nada de electroestimulación de los intercostales. **Cabeza (4-17) y parte anterior del cuello (4-15)**: la electroestimulación está contraindicada en cualquier persona (tabla 1).
4. **Onda corta (8-6)**: **ninguna forma, térmica o no térmica, a menos de 3 m de una persona con un implante electrónico**, sea cual sea la zona o el aparato. Quitar los audífonos y cualquier aparato externo. Evidencia fuerte.
5. **Láser de baja intensidad, calor superficial y frío**: se pueden usar **sobre la zona de un aparato electrónico** (tabla 1 y listas de cada agente).

### Contradicciones nuevas

7. **Electroterapia con marcapasos o desfibrilador**: EHRA (2022) permite seguir tras una prueba sin interacción. Houghton (2010) la contraindica solo donde pueda alterar el aparato. Mohammad (2022) desaconseja la TENS en casa con desfibrilador. Suhail Arain (2023) coincide con EHRA. **Propuesta**: seguir a EHRA, el más reciente y el de los especialistas que hacen la prueba (decisión 7, cambiada).
8. **TENS en casa con desfibrilador**: Mohammad (2022), nunca. EHRA, posible tras la prueba si no cambian el sitio ni los parámetros. **Propuesta**: «no la uses en casa por tu cuenta; solo si tu unidad de marcapasos la ha probado contigo, en ese sitio y con esos parámetros» (decisión 14, cambiada).
9. **Ultrasonido con estimulador medular**: Ghaly (2016) lo excluye en cualquier zona. Houghton (2010) solo sobre el aparato, y aclara que las alertas son de la diatermia por ultrasonido, que no es de fisioterapia. Keus (2014, cerebral profundo) lo excluye sin zona. **Propuesta**: mantener la decisión 6 aceptada (en ninguna zona con el medular y el cerebral profundo), la opción prudente.
10. **Onda corta**: FDA y Salud Canadá, con cualquier electrodo implantado. Houghton añade **a menos de 3 m** de quien lleve un implante electrónico, aunque no sea quien recibe el tratamiento (decisión 20, nueva).

### Qué cambia en el diseño (propuestas; las decisiones aceptadas que cambian se marcan)

- **Decisión 7, cambiada.** Con marcapasos, desfibrilador, «No sabe cuál» o nada marcado: «**Electroterapia (TENS, interferenciales, electroestimulación), solo tras consultar a su unidad de marcapasos**, que valora el riesgo y vigila la primera sesión. Si no hubo interferencia, se puede seguir en el mismo sitio y con los mismos parámetros; si cambian, otra prueba. Para enseguida si nota síntomas cardiacos» (Stühlinger 2022; Suhail Arain 2023). Sustituye a «ninguna salvo autorización».
- **Decisión 8, cambiada.** «**Lo más lejos posible del aparato y con los dos electrodos del mismo lado**, sin que la corriente cruce el aparato; nunca en la parte anterior del tórax» (Stühlinger 2022; Houghton 2010, 4-16). Sustituye a «más riesgo en el tórax».
- **Decisión 9, cambiada.** Con estimulador medular, cerebral profundo, otro estimulador de nervios o del crecimiento óseo: «**Electroterapia, nunca donde pueda alterar el aparato**: ni encima ni cerca del aparato o de sus cables» (Houghton 2010, 4-1). Con el cerebral profundo sigue la línea de Keus 2014, más estricta. Con el implante coclear, la cabeza y el cuello ya están contraindicados para cualquiera (Houghton 2010, 4-15 y 4-17), y se aplica la misma frase. Desaparece la nota gris «pendiente de los manuales»; los manuales pasan a opcionales.
- **Decisión 6, precisión.** A la línea del ultrasonido se añade «**si no sabes por dónde van el aparato y los cables, no lo uses**» (Houghton 2010, 3-6).
- **Decisión 14, cambiada.** Programa para casa con desfibrilador: «No uses un aparato de TENS en casa por tu cuenta; solo si tu unidad de marcapasos lo ha probado contigo, en ese sitio y con esos parámetros» (Stühlinger 2022; Mohammad 2022).
- **Decisión 20, nueva: 3 m de la onda corta.** En la línea roja: «y que no esté a menos de 3 m de un aparato de onda corta encendido, aunque no sea para él» (Houghton 2010, 8-6). Lo recomiendo: es la única con evidencia fuerte y cambia cómo se organiza la sala.
- **Decisión 21, nueva: lo que sí se puede.** Una línea informativa en el recuadro de la fase 5: «El láser de baja intensidad, el calor superficial y el frío no tienen restricción por el implante» (Houghton 2010, tabla 1). Lo recomiendo, para no restringir de más.
- **Decisión 4, refuerzo.** El Holter implantable fuera de la tarjeta: EHRA no pide medidas, solo saber que los registros pueden tener artefactos.

### Registro

Entran `Stühlinger 2022` y `Houghton 2010`. Ninguno de los dos existe ya en `data/referencias.js`.

## Segunda pasada (noviembre 2026)

Búsqueda en PMC de fuentes en abierto para lo que se había pedido en PDF:

- **Consenso EHRA 2022 y Houghton 2010**: Europe PMC no da el texto (error 500) y el PDF de PMC pide la comprobación del navegador. Siguen pedidos.
- **Estimulador medular**: Ghaly 2016, leída entera (ver «Fuentes»). Cambia la decisión 6 (ultrasonido en ninguna zona) y añade la 19. La electroterapia sigue sin fuente: el manual del fabricante (PDF 4) sigue haciendo falta.
- **Implante coclear**: solo hay artículos de la diatermia quirúrgica (Frampton 2012), que no valen para la onda corta terapéutica. El PDF 5 sigue haciendo falta.

## Siguiente paso

1. ~~Tus decisiones (1–19)~~ Hecho: aceptadas las 19 recomendaciones (noviembre 2026).
2. ~~Los PDF 1 y 2~~ leídos (ver «Lectura de los PDF»). Pendiente: **tus decisiones sobre los cambios 6, 7, 8, 9 y 14 y las nuevas 20 y 21**. Los PDF 3–6 son ya opcionales (confirmar con un manual de fabricante lo que dice Houghton 2010 para el medular y el coclear). Con ellos, una tanda de lectura que puede cambiar las decisiones 7–10: si cambian, se proponen al usuario antes del texto cerrado.
3. Texto cerrado para revisión, con cada frase y su fuente, como en el Parkinson.
4. La implementación, la revisión en la app y, después, `_bloqueIE` en physiq-report.
