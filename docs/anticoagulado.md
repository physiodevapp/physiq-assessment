# Paciente anticoagulado o antiagregado — diseño e implementación

Estado: **implementado (octubre 2026) y revisado por el usuario en la app**, con las 20 recomendaciones de «Decisiones» aceptadas. **Tanda 1 de PDF** (Hutting 2018, Kim 2025 AHA/ACC y Rhim 2025): ver «Lectura de los PDF (tanda 1)». **Tanda 2** (los opcionales, octubre 2026): ver «Lectura de los PDF (tanda 2)», al final; con ella no queda ningún PDF pendiente. Las secciones de borrador se conservan como registro histórico: donde no coinciden, manda «Implementación».

Reglas, como en las otras condiciones: solo fuentes leídas enteras; ninguna cifra, umbral ni referencia inventada; ninguna regla automática que no esté medida en las fuentes; lo que no tiene fuente va marcado como **[propia]** (redacción propia) y es una decisión tuya.

**Cómo se leyó.** Seis lectores en paralelo leyeron las fuentes nuevas (texto completo de PMC y de nice.org.uk, convertido a texto) y guardaron cada texto en el scratchpad de la sesión, fuera del repositorio. Yo comprobé con una búsqueda literal que cada cita entre comillas «“…”» de este documento está en el texto de la fuente a la que se atribuye (NICE usa espacios y guiones no separables: se normalizaron). Las cifras que van en prosa salen de los mismos textos. Ninguna fuente nueva es de fisioterapia: casi todo lo que hay sobre técnicas son **casos clínicos y consensos de expertos**, y cuando el documento dice «las fuentes no dicen…» es porque lo busqué y no está.

## Resumen (lo que hay que saber antes de leer lo demás)

- **No hay ninguna guía, graduada y específica, de qué técnica de fisioterapia es segura con un anticoagulante o un antiagregante.** Lo más cercano son dos tablas de expertos que no coinciden: una de contraindicaciones del thrust torácico (Puentedura 2015, anticoagulante como contraindicación absoluta, con una fuente de osteopatía que no está disponible) y otra que pone el anticoagulante como **precaución** de la terapia manual cervical (Hutting 2018, opinión de los autores, con la tabla tomada de una revisión de casos de 2012 y del marco IFOMPT de 2013). Ninguna distingue entre antivitamina K, anticoagulantes directos, heparinas o antiagregantes, y ninguna da un INR límite.
- **Donde las fuentes sí son claras es en las banderas rojas de sangrado y en el golpe en la cabeza.** NICE NG232 pone el golpe en la cabeza con anticoagulante o antiagregante (salvo la aspirina sola) como motivo para derivar a urgencias; los casos y series describen cómo se presentan el hematoma epidural espinal, el hematoma del psoas, el de la vaina de los rectos y el síndrome compartimental.
- **La app ya tiene la mitad de las piezas** (casilla del lupus, tope «sin thrust», guía de fármacos, preguntas de TVP y de hematoma epidural posquirúrgico, sistema hematológico) y no tiene ninguna pregunta sobre el golpe en la cabeza.
- **Propongo la forma 3** (tarjeta con qué toma, sistema de fase 2 con 6 urgencias y 1 derivación, una línea en la 4b, recuadro de la fase 5, avisos y red de la fase 6), con el tope «sin thrust» solo para el **anticoagulante** (no para el antiagregante solo: ninguna fuente lo respalda) y **absorbiendo la casilla del lupus** en vez de duplicarla.

## Qué hay hoy en la app

Búsqueda de octubre 2026 en `data/`, `formularios/`, `lib/`, `tests/` y la guía de fármacos:

- **Lupus** (`docs/lupus.md`, Fase P):
  - la tarjeta tiene la casilla «Toma anticoagulante o antiagregante (aspirina)» (`lupus.antitrombotico`), que va al payload como `le.at`, al 📋 Notas («anticoagulante o antiagregante») y a `lupusAntitrombotico`;
  - la línea de la 4b `tecnica4bAntitrombotico`: «Con anticoagulante o antiagregante, precaución con lo que tenga riesgo de golpe (Blaess 2024, rec. 3).» Solo sale con la casilla;
  - el aviso de la fase 6 `lupusAntitrombotico` (la misma frase de Blaess 2024);
  - `lupus.antifosfolipidos` con la fila «SAF con trombosis previa» y la línea de la fase 5 «no sugerir suspender el anticoagulante: retirarlo desencadena el síndrome antifosfolípido catastrófico (Tektonidou 2019, rec. 12)».
- **Tope «sin thrust»** (`motivosSinThrust(op, lupus)`, `lib/osteoporosis.js`; decisión 15 de `docs/osteoporosis.md`): con la tarjeta de osteoporosis marcada, o con el lupus diagnosticado con corticoides o con la casilla del antitrombótico, el plan de la fase 6 saca `sinThrustOsteoporosis` o `sinThrustLupus`. El texto de `sinThrustLupus` cita Puentedura 2015, tabla 1 («corticoides a largo plazo y tratamiento anticoagulante, contraindicaciones absolutas»). **Es el único sitio de la app donde un antitrombótico cambia la técnica**, y mezcla anticoagulante y antiagregante en una sola casilla; la propia decisión 15 dejó escrito «que la tarjeta del anticoagulado lo revise», porque el antiagregante no está en la tabla de Puentedura.
- **Guía de fármacos** (`data/farmacos.js`, familia `antitromboticos`; `docs/farmacologia.md`): ya escrita, revisada por el usuario y ampliada con dos PDF (Steffel 2021, Antunes 2024), **pendiente de revisar lo añadido**. Cubre el hematoma muscular (Mameli 2025), el hematoma epidural espinal (Ghosh 2026), el sangrado digestivo, los antidepresivos, la punción seca y la acupuntura (Muñoz 2022), las caídas y la valoración (Steffel 2021), el golpe en la cabeza (Yang 2024) y la adherencia (Salmasi 2020). Sus propios huecos, anotados en `docs/farmacologia.md`, son: hemartros, síndrome compartimental, signos del hematoma del iliopsoas, hematoma de la vaina de los rectos, masaje y manipulación vertebral, deportes de contacto, protocolo o TAC tras un golpe en la cabeza y caminar pronto tras una TVP. **Casi todos están cubiertos por las fuentes nuevas de este documento.**
- **Cribado de la fase 2**:
  - `hem_1` (moretones fáciles; su razonamiento nombra los anticoagulantes, la aspirina y los AINE), `hem_4` (heces negras, sangre en orina, tos o vómito con sangre) y `hem_6` (hemartros o hematoma muscular en la **hemofilia**, con urgencia; dice que los anticoagulantes también pueden causar hemartros). Son del sistema hematológico, que sale con cualquier región.
  - La pregunta de AINE y sangrado digestivo (`data/comun.js`) pone los anticoagulantes y la aspirina entre los factores de riesgo.
  - Rodilla: `ro` de hemartros nombra los anticoagulantes como causa; cadera: el aneurisma de aorta nombra los anticoagulantes; cervical: el hematoma epidural «con anticoagulantes o tras una punción».
  - **Posquirúrgico**: `pq_tvp` / `pq_tvp_ms` (TVP), `pq_tep`, `pq_compart` (síndrome compartimental, solo codo, rodilla y tobillo y pie, «fasciotomía idealmente en las primeras 6 horas») y `pq_nervio_col` (hematoma epidural tras cirugía de columna). La profilaxis de NICE NG89 (HBPM o aspirina tras prótesis) ya está en el razonamiento del posquirúrgico.
  - **Embarazo**: `em_u_tev`, con la frase «Si se pincha heparina, trátala como a una persona anticoagulada» en su `detalle`.
  - **No hay ninguna pregunta sobre un golpe en la cabeza** fuera de las banderas de la región cervical, que hablan de disección y conmoción.
- **Osteoporosis** (`docs/osteoporosis.md`): la heparina en el embarazo figura como factor de riesgo de la osteoporosis asociada al embarazo y la lactancia (Hadji 2026; cifras de Qian 2021 y Sözen 2026 solo en ese documento). Ninguna regla.
- **Pautas con técnicas que importan aquí** (las hipótesis de `data/` cuya pauta *menciona* la técnica; algunas la mencionan para **desaconsejarla**, como las que siguen a NICE, así que no son una lista de lo que el plan propone):
  - thrust o manipulación: 16 (hombro `h2` y `h6`, cervical `ce1`, `ce3`, `ce4`, `ce7`, `ce12`, `ce14`, lumbar `lu1`, `lu5`–`lu9`, codo `co1`, tobillo y pie `tp21`);
  - punción seca o acupuntura: 13 (`h6`, `h10`, `ca1`, `ca15`, `ce1`, `ce7`, `ce14`, `lu9`, `ro1`, `ro3`, `co1`, `tp24`, `tp26`), entre ellas la de `ca1`, que cita la guía de la APTA de 2025 para los puntos gatillo del **psoas ilíaco**;
  - ondas de choque: 4 (`h2`, `ca9`, `ca19`, `ro6`); fricción: 1 (`ro6`).
- **Nada más**: ni preguntas de golpe en la cabeza, ni hematoma epidural espontáneo, ni hematoma del psoas o de la pared abdominal, ni síndrome compartimental fuera del posquirúrgico, ni líneas de técnica (punción seca, ondas de choque, presión profunda, estiramientos) para quien toma estos fármacos, ni nada sobre el deporte de contacto.

## Fuentes leídas

Leídas con su texto completo (cuerpo y tablas; no las figuras-imagen ni los suplementos ni las listas de referencias). «Nivel» es el que declara la propia fuente, o el tipo de estudio. Las claves son propuestas; las que ya están en el registro van marcadas **(registro)**.

### A. Golpe en la cabeza y caídas

| Clave propuesta | Qué es | Nivel | Qué aporta |
|---|---|---|---|
| `NICE NG232` | NICE, *Head injury: assessment and early management*, NG232 (2023, cambios menores hasta 2025). Capítulos de recomendaciones y de justificación | Guía; el verbo da la fuerza («do» fuerte, «consider» débil) | Golpe en la cabeza con anticoagulante o antiagregante (salvo aspirina sola) → urgencias (1.2.3, 1.2.4); TC «consider» en las 8 h (1.5.13); consejo al alta (1.10.9) |
| `NICE NG196` | NICE, *Atrial fibrillation*, NG196 (2021) | Guía | No retirar el anticoagulante solo por la edad o las caídas (1.6.8); vigilar los factores de sangrado (1.2.3) |
| `Chenoweth 2018` | Cohorte prospectiva, JAMA Surg, n = 859, ≥ 55 años | Observacional | Hemorragia tardía 0,3 %; 2 de las 3 a los días 3 y 5 |
| `Puzio 2021` | RS y metaanálisis, J Am Coll Surg, 12 estudios, 5289 pacientes, anticoagulantes directos | Observacional (sin ECA) | Hemorragia tardía ≈ 2,4 % con anticoagulantes directos y 2,3 % con warfarina, casi siempre sin consecuencias clínicas |
| `Hughes 2021` | Cohorte, J Emerg Trauma Shock, n = 388 | Observacional | Hemorragia tardía igual con warfarina y con anticoagulantes directos; ninguna después de 48 h (con TC de rutina) |
| `Capsoni 2025` | Cohorte multicéntrica, Scand J Trauma Resusc Emerg Med, n = 1596 | Observacional | Vómitos y síntomas nuevos durante la observación como factores |
| `Mason 2017` | Estudio AHEAD, BMJ Open, n = 3534, warfarina | Observacional | El INR no predice el resultado adverso si se cuentan los demás factores; a más síntomas, más riesgo |
| `Colombo 2021` | RS y metaanálisis, 16 estudios, antiagregantes | Observacional | Aspirina sola frente a doble antiagregación |
| `Wiegele 2019` | Consenso austriaco, Crit Care | Opinión de expertos, sin GRADE | Ingreso de 24 h con anticoagulante oral y TC normal |
| `Mitchell 2023` | Revisión narrativa, Eur Geriatr Med | Narrativa | Caídas y anticoagulación; prevención de caídas |
| `NICE NG249` **(registro)** | Caídas, ya leída entera | Guía | No menciona los anticoagulantes |

### B. Hematomas y sangrados (banderas)

| Clave propuesta | Qué es | Nivel | Qué aporta |
|---|---|---|---|
| `Peng 2022` | Cohorte retrospectiva multicéntrica, Neurology, n = 105, hematoma epidural espinal espontáneo | Observacional | Dolor brusco en el 79 %; déficit sin dolor en el 21 %; cirugía en las primeras 12 h |
| `Albrecht 2024` | Serie de 20 hematomas espinales espontáneos, Acta Neurochir | Casos | Intervalo sin dolor de minutos a días; 55 % con anticoagulante o antiagregante |
| `Pozza 2023` | RS de casos de hematoma tras anestesia neuraxial | Casos (por analogía) | Signos de alarma y plazo (8 h) tras una técnica |
| `Alkhudari 2016`, `Choi 2017` | Casos de hematoma epidural tras infiltración (este, con cilostazol) | Caso clínico | Cómo empieza tras una infiltración |
| `Sahu 2020` | Caso con minirrevisión: neuropatía femoral por hematoma retroperitoneal con apixabán | Caso clínico | Solo un tercio tiene la tríada clásica |
| `Lukies 2023` | Casos y controles, 54 hemorragias retroperitoneales espontáneas, CardioVasc Intervent Radiol | Observacional | Presentación heterogénea; manejo conservador eficaz |
| `Llitjos 2016` | Cohorte de UCI, 77 hematomas del iliopsoas, Ann Intensive Care | Observacional (casos graves) | Shock 44 %, síntomas compresivos 25 %, equimosis 29 % |
| `Liao 2021`, `Ben Ismail 2026`, `Hideyama 2023`, `Yale 2020` | Hematoma de la vaina de los rectos: revisión narrativa, dos casos y una carta | Bajo | Presentación, signos de Fothergill y Carnett, mortalidad ≈ 4 % |
| `Liu 2025 (hematoma de pared abdominal)` | Caso de hematoma de pared abdominal por HBPM (la clave `Liu 2025` ya está en el registro para otra obra) | Caso clínico | Shock hemorrágico tras HBPM subcutánea |
| `Amaniyan 2020` | RS y metaanálisis del frío tras la inyección de heparina | ECA y cuasiexperimentales | Frecuencia del moretón local (en la introducción, de segunda mano) |
| `Dalrymple 2022` | Revisión retrospectiva de 31 hemartros de rodilla con anticoagulantes orales | Observacional | Frecuencia, manejo, aspirar si hay duda |
| `Brooker 2020`, `Nemunaitis 2022`, `Ogrodnik 2021` | Síndrome compartimental con anticoagulantes: dos casos con apixabán y una RS de 19 casos del miembro superior | Casos | Dolor desproporcionado, dolor al estiramiento pasivo, fasciotomía |
| `Bahit 2017` | Análisis post hoc de ARISTOTLE (n = 18 140), Heart | Moderado | Dónde sangran los sangrados no mayores; no son «menores» sin más |
| `Tran 2025` | Guía australiana y neozelandesa de anticoagulantes directos, Intern Med J | Consenso con GRADE | Definición de sangrado y manejo |
| `Mameli 2025`, `Ghosh 2026` **(registro)** | Ya leídas: hematoma muscular espontáneo y hematoma epidural con anticoagulantes directos | — | Lo que dice `data/farmacos.js` |

### C. Técnicas manuales y otras modalidades

| Clave propuesta | Qué es | Nivel | Qué aporta |
|---|---|---|---|
| `Whedon 2015` | Cohorte retrospectiva de Medicare, 6 669 603 personas de 66–99 años, Spine | Observacional (nivel 3 según el propio artículo) | Anticoagulación crónica y lesión cerebral o medular tras manipulación (OR 2,17); «precaución» |
| `Chen 2019` | Caso de hematoma epidural cervical, BMC Musculoskelet Disord; su tabla 3 reproduce la de Hutting 2018 | Caso clínico | Sin anticoagulante ni alteración de la coagulación en el paciente; menciona que algunos casos publicados tomaban anticoagulantes orales |
| `Hutting 2018` | Artículo profesional, *Musculoskelet Sci Pract* (manuscrito aceptado; PDF del usuario, leído entero) | Opinión de los autores («“This article presents the authors’ personal opinions”») | Tabla 2: «Anticoagulant therapy» y «Blood clotting disorders / alterations in blood properties» como **precauciones** de la terapia manual cervical |
| `Cooper 2019` | Caso de hematoma epidural con autorrotación cervical, warfarina, INR 7,84 | Caso clínico | «Precaución» con las técnicas con torsión |
| `El Mraiedh 2026` | Caso: apixabán y fisioterapia cervical el mismo día, hematoma C1–T8 | Caso clínico | Sin causalidad demostrable |
| `Liu 2021` | Tres casos más 18 publicados de hematoma tras manipulación | Casos | «Tres» de los 18 con anticoagulante, sin tabla que lo verifique |
| `Swait 2017` | Revisión de alcance de 250 artículos sobre riesgos de la manipulación | Sin graduar | Resume a Whedon |
| `Rushton 2023` **(registro)** | Marco IFOMPT cervical (el PDF de ifompt.org, 42 páginas; la versión JOSPT es de pago) | Consenso | **No dice nada de antitrombóticos** |
| `Cheatham 2025` | Delphi de 24 expertos sobre instrumentos de tejidos blandos (IASTM), Healthcare | «Nivel 4» según los autores | «Medications that thin blood» como precaución |
| `Bartsch 2021` | Delphi de 37 expertos sobre el rodillo de espuma, J Clin Med | Delphi | El ítem de los anticoagulantes estaba en las primeras rondas y no figura en el consenso final |
| `Tominaga 2023`, `Kwon 2024`, `Kim 2026` | Casos: masajeador cervical con aspirina; percutor sobre la inyección de heparina; estiramientos y movilización con warfarina | Casos | Señal, no tasa |
| `Muñoz 2022` **(registro)**, `Waterway 2026`, `Malfait 2024`, `McCulloch 2015`, `de Valois 2024` | Punción seca y acupuntura | Narrativa, Delphi de 9 expertos (nivel V), alcance, RS, opinión | Ninguna es de punción seca en pacientes antitrombotizados |
| `Tenforde 2022`, `Rhim 2025`, `Gao 2026`, `De la Corte-Rodríguez 2023` | Ondas de choque | Opinión, Delphi de 41 expertos (consenso ≥ 75 %), narrativas | Se contradicen; el Delphi no alcanzó consenso |
| `Uson 2021`, `Tarar 2023`, `Tarar 2021`, `Lago-Deibe 2022`, `Galli 2026` | Infiltración e inyección; manejo del sangrado | Recomendaciones EULAR (LE 3, GR C), RS, ECA, narrativa | Infiltrar con anticoagulante: riesgo bajo, sin contraindicación absoluta |
| `Puentedura 2015` **(registro)** | Ya leída (osteoporosis) | — | Tabla 1: anticoagulante, contraindicación absoluta del thrust torácico |

### D. Ejercicio, deporte y otras modalidades

| Clave propuesta | Qué es | Nivel | Qué aporta |
|---|---|---|---|
| `Kim 2025` | Declaración científica AHA/ACC de deporte competitivo con cardiopatías, JACC 2025 (PDF del usuario, leída entera) | Consenso, sin clase ni nivel | Deportes de colisión según antitrombótico, **solo para deportistas de competición** |
| `Minardi 2024`, `Moll 2018`, `D'Ascenzi 2025`, `Bavishi 2026` | Anticoagulación en deportistas: cuatro revisiones | Narrativas / educativa de la ASH | «Solo reflejan consenso de expertos»; sin datos de sangrado por deporte |
| `Gaviglio 2026` | Seguridad del entrenamiento con restricción de flujo (BFR) | Narrativa | **No lista antitrombóticos**; sí TVP previa y síndrome antifosfolípido |
| `Liu 2015` | Metaanálisis de reposo frente a deambulación en la TVP, PLoS One | Metaanálisis con un problema de calidad (el estimador global es incoherente: p = 0,22 con un IC que excluye el 0) | La deambulación precoz no aumentó la embolia |
| `NICE NG158`, `NICE NG89` **(registro)** | Enfermedad tromboembólica y profilaxis | Guías | NG158 solo dice que se informe de «actividades como el deporte»; NG89: duraciones de profilaxis |
| `Xiang 2025` **(registro)** | Ejercicio tras embolia pulmonar | RS | Seguro y factible |

### E. Fármacos

| Clave propuesta | Qué es | Qué aporta |
|---|---|---|
| `Witt 2016` | Guía de consenso del Anticoagulation Forum sobre la warfarina en la TEV (J Thromb Thrombolysis) | INR objetivo 2,0–3,0; la combinación con antiagregantes aumenta el sangrado |
| `Savioli 2020`, `André 2024` | Cohortes de traumatismo craneal con warfarina o anticoagulantes directos | INR > 3 y hemorragia (n pequeño); hemorragia tardía clínicamente relevante < 1 por mil |
| `Ohgushi 2016`, `Sapapsap 2022`, `Gerfer 2024` | INR y riesgo; INR de las válvulas mecánicas | **Se contradicen** (ver abajo) |
| `Pfeilschifter 2022`, `Skaistis 2015`, `Wang 2020 (sangrado con anticoagulantes directos)` | Anticoagulantes directos frente a antivitamina K: hemorragia (la clave `Wang 2020` ya está en el registro para otra obra) | Menos hemorragia intracraneal con los directos |
| `Cheng 2022`, `Yin 2019`, `García Rodríguez 2016` | Antiagregantes y traumatismo craneal; duración de la doble antiagregación; aspirina a dosis baja | Doble antiagregación peor que simple |
| `Holm 2021`, `Lee 2024`, `Meinert 2026`, `Wong 2025` | Combinaciones con antiagregantes y AINE | Más sangrado; todas observacionales |
| `NICE NG185`, `NICE NG128` | Síndrome coronario agudo, ictus | Qué toma cada paciente |

### Leídas solo en parte, o con cifras internamente incoherentes (no se citan sin avisar)

- **`Kim 2025` (AHA/ACC)**: ya no es parcial: con el PDF del usuario se leyó entera y la tabla 3 se comprobó sobre la imagen (ver «Lectura de los PDF (tanda 1)»). Queda abierta una ambigüedad del propio documento: qué anticoagulantes entran en la «anticoagulación plena».
- **`NICE NG89`**: las recomendaciones de ortopedia, antiagregantes, anticoagulantes y trauma, línea a línea; el resto (embarazo incluido) por búsqueda. Solo se cita lo leído.
- **`Whedon 2015`**: la fila de la tabla 3 de «cualquier lesión» da «OR 1,69» con un intervalo (0,20–2,36) que no puede ser de ese OR: probable errata. Solo se cita el OR 2,17 (1,15–4,07) de lesión cerebral o medular.
- **`Savioli 2020`**: el resumen da un 7,5 % de hemorragia en los controles y la tabla un 6,51 %; el 27 % con INR > 3 sale de unos 26 pacientes.
- **`McCulloch 2015`** (acupuntura): su «0,003 %» no cuadra con su propia aritmética (1 de 3974 es ≈ 0,025 %): no se cita esa cifra.
- **`Tarar 2023`**: la tabla 4 no cuadra con el texto sobre la aspirina; no se citan cifras de esa discusión.
- **Descargadas pero no citables**: Pham 2025, Patterson 2019, Daniels 2026, Bargeri 2023, World Falls 2022 (no habla de anticoagulantes), Spyrou 2025, Cochrane 2021 de la inyección lenta de heparina (solo el resumen), Muñoz 2022 por segunda vez (la lectura entera es la del lector de punción seca).

### Lo que no se pudo leer (no se cita; ver «PDF que necesito»)

Kranenburg 2017, Hawk 2017, las guías ASRA de 2018 y de 2025, las guías suizas y de la APTA de punción seca, la guía ESC de fibrilación auricular de 2024, la ESC de cardiología del deporte de 2020, la ESVS de 2021, y las definiciones originales de sangrado mayor de la ISTH. (Hutting 2018, Kim 2025 y Rhim 2025 llegaron como PDF del usuario y están leídas.)

## Lo que dicen de verdad las fuentes

### 1. Golpe en la cabeza

- **Derivar.** NICE NG232 manda a los servicios comunitarios y a los de consejo a distancia que deriven a urgencias a quien se ha dado un golpe en la cabeza si hay, entre otros factores, «“current anticoagulant or antiplatelet (except aspirin monotherapy) treatment”» (NICE NG232, 1.2.4; igual en 1.2.3). La lista no nombra a los fisioterapeutas: es lo más cercano que hay para ellos **[inferencia mía]**. La revisión de julio de 2023 aclaró que el factor es «uno u otro» fármaco (anticoagulante o antiagregante).
- **TC.** «“consider doing a CT head scan: within 8 hours of the injury”» (NICE NG232, 1.5.13; verbo «consider»), para quien toma anticoagulantes (antivitamina K, anticoagulantes directos, heparinas) o antiagregantes salvo la aspirina sola y no tiene otra indicación de TC. La justificación dice que no había evidencia suficiente para hacerla de rutina: «“not strong enough to recommend using anticoagulation status as a sole indicator for admission”» (NICE NG232, justificación).
- **Hemorragia tardía.** Es rara y casi siempre sin consecuencias, pero existe y puede tardar: «“in 2 of the 3 patients the delayed traumatic intracranial hemorrhage occurred 3 days and 5 days after the initial cranial CT scan”» (Chenoweth 2018); «“ICH can occur days or weeks after trauma, meaning that no protocol will be fully effective.”» (Wiegele 2019). La cifra depende de cómo se busque: de 0,3 % con seguimiento clínico (Chenoweth 2018) a ≈ 2–4 % repitiendo la TC de rutina (Puzio 2021; Hughes 2021; Capsoni 2025); ni la cirugía ni la muerte fueron lo habitual (Capsoni 2025, Hughes 2021).
- **Aviso al alta.** «“a responsible adult should stay with the person for the first 24 hours after their injury”» y «“some people may appear to make a quick recovery but later have difficulties or complications”» (NICE NG232, 1.10.9). Síntomas de alarma tardía que cita el comité: «“severe headache, drowsiness and vomiting”» (NICE NG232, justificación de 1.10.6). Los estudios añaden los vómitos (Capsoni 2025) y la amnesia (Mason 2017).
- **Antiagregantes y fármacos.**
  - Yang 2024 (ya en la guía de fármacos): antiagregantes OR 1,54, anticoagulantes no significativos.
  - Colombo 2021: aspirina sola 0,22 %, doble antiagregación 2,64 % (la diferencia aspirina frente a doble, p = 0,04; datos de ticagrelor y prasugrel «muy escasos»).
  - NICE excluye la aspirina sola porque el riesgo es bajo: se podría dar el alta sin TC tras decidirlo con el paciente.
- **INR.** El INR **no** predice el resultado con GCS 15 una vez contados los demás factores (Mason 2017); la relación INR–hemorragia con más de 3 viene de una sola cohorte pequeña (Savioli 2020).
- **Contradicción**: ingresar 24 h con la TC normal (Wiegele 2019, consenso sin GRADE) frente a no ingresar solo por estar anticoagulado (NICE NG232). **Para el fisio no cambia nada**: ambas mandan a un servicio de urgencias.

### 2. Hematoma epidural espinal

- Es raro y no es solo un efecto de los anticoagulantes (en Albrecht 2024, 11 de 20 tomaban anticoagulante o antiagregante; en Peng 2022, 21 de 105: warfarina 12, rivaroxabán 1, aspirina 8). Ghosh 2026 (ya en la app): con anticoagulantes directos, dolor de cuello o espalda con déficit neurológico.
- **Presentación.** Dolor brusco e intenso en el 79 % (Peng 2022), pero «“Twenty-two (21.0%) cases suffered from severe neurologic deficits without significant pain at the onset”» (Peng 2022). Puede haber un intervalo sin dolor: «“This pain may be followed, in some instances, by a pain-free interval lasting from minutes to days”» (Albrecht 2024). «“The presence of painful paraparesis should direct attention toward a potential spinal pathology”» (Albrecht 2024).
- **Tras una infiltración o una técnica**: dolor que empeora, debilidad nueva, alteración de la vejiga o el intestino; se pide RM urgente (Pozza 2023, por analogía con la anestesia neuraxial; Alkhudari 2016; Choi 2017, con cilostazol).
- **Plazo.** «“most authors consider that surgery performed within 12 hours after the onset of symptoms is associated with better outcomes”» (Peng 2022); Pozza 2023 y Choi 2017 dicen 8 h. **Se contradicen** entre sí y con un metaanálisis que Peng cita, según el cual la gravedad del déficit y los anticoagulantes importan «pero no el intervalo»: lo único que se puede decir es «cuanto antes».
- **Manipulación.** Hay casos publicados tras manipulación cervical (Cooper 2019, warfarina con INR 7,84; El Mraiedh 2026, apixabán y fisioterapia cervical el mismo día) y otros **sin** anticoagulante (Chen 2019, INR 0,98; Huang 2015, con una malformación vascular), de modo que el fármaco no es condición necesaria. Nadie da una incidencia («“the exact incidence has not been reported”», Liu 2021).

### 3. Hematoma del psoas y retroperitoneal

- **Presentación heterogénea y diagnóstico tardío**: «“commonly delayed diagnosis due to heterogeneous presenting clinical features, such as abdominal pain, hip pain, flank/back pain, haemodynamic decline, and lumbar plexus neuropathy”» (Lukies 2023, introducción). «“only 1/3rd of the patients of abdominal bleeding will have the classical symptoms”» (Sahu 2020, discusión). En la serie de UCI de Llitjos 2016 (con sesgo hacia lo grave): shock 44 %, síntomas compresivos como parálisis nerviosa o isquemia 25 %, equimosis abdominal 29 %, hallazgo incidental 14 %.
- **Neuropatía femoral** como signo (Sahu 2020: cadera derecha dolorida, adormecimiento y debilidad del miembro, sin traumatismo, con apixabán y una caída de la hemoglobina). La conclusión de los autores: hacer una exploración neurológica completa a quien está anticoagulado y consulta por esto.
- **Urgencia.** Todas las fuentes hablan de manejo hospitalario (reversión, observación, a veces embolización). Lukies 2023 encontró que el manejo conservador funcionó incluso con inestabilidad; ninguna fuente dice qué hacer desde la consulta de fisioterapia: **la urgencia «hoy» es [propia]**.
- **Huecos**: los signos de Grey Turner y Cullen en el retroperitoneo y la flexión antiálgica de la cadera no están en ninguna fuente leída; la revisión sistemática de neuropatía femoral por hematoma retroperitoneal (209 pacientes) es de pago.
- Ya en la guía de fármacos (Mameli 2025): psoas, vaina de los rectos y muslo; masa que no se resuelve en 2–3 semanas, de más de 5 cm o profunda, a estudiar por si hay un tumor debajo.

### 4. Hematoma de la vaina de los rectos

- «“the mass did not cross the midline (positive Fothergill's sign)”» (Ben Ismail 2026); dolor brusco que empeora con el movimiento o al contraer el abdomen; se asocia a la tos (Hideyama 2023: tras una tos intensa, con apixabán), a las inyecciones intraabdominales y a la anticoagulación supraterapéutica (Ben Ismail 2026; Liao 2021). Mortalidad: «“The overall mortality rate for RSH is estimated at approximately 4%”» (Ben Ismail 2026).
- Entre el 56 y el 83 % se maneja con tratamiento conservador en el hospital (Liao 2021).
- **Con heparina inyectable**: los moratones en el punto de inyección son frecuentes («“it is estimated that 26% to 90% of low-molecular-weight heparin injections cause bruising at the injection site”», Amaniyan 2020, introducción; cifra de segunda mano, de 2013). El hematoma de pared abdominal con shock, «“scarcely observed and reported”» (Liu 2025 (hematoma de pared abdominal), un caso), es otra cosa: dolor intenso que pasa de molestia a insoportable en horas. Ninguna fuente leída define el tamaño o la evolución que separan lo esperable de lo que no lo es.

### 5. Síndrome compartimental

- «“Cardinal features include pain out of proportion to the injury with tense compartments and pain on passive stretch”» (Brooker 2020, un caso en el muslo con apixabán tras un traumatismo de baja energía). «“Pain out of proportion and pain with passive stretch are the most common early findings of ACS, with the latter being the most sensitive clinical finding”» (Nemunaitis 2022). La parálisis, la palidez y la falta de pulsos son tardías.
- Con anticoagulantes: tres de 19 casos no traumáticos de brazo y mano de una revisión (Ogrodnik 2021); un caso tras fisioterapia con warfarina (Kim 2026, abajo). «“Compartment syndrome can occur following low energy trauma”» (Brooker 2020).
- **Urgencia**: las tres fuentes lo tratan como emergencia quirúrgica con fasciotomía inmediata. Los umbrales de presión que dan **no coinciden** (30 mmHg absolutos o diferencial, frente a 40 mmHg o a 30 mmHg de la diastólica): no se usan, los mide el hospital.

### 6. Hemartros

- «“The incidence of haemarthrosis associated with warfarin and NOACs ranges from 0 to 1.5% of patients”» (Dalrymple 2022, rodilla atraumática). Manejo habitual: reposo, hielo, compresión y elevación, interrumpir el anticoagulante si se puede y aspirar; «“Our recommendation, and current practice in our institution, is to aspirate if the diagnosis is unclear in order to exclude infection or a crystal arthropathy”». «“There is currently no consensus on the management of haemarthrosis in patients on oral anticoagulants”».
- Es un diagnóstico de exclusión. Nada sobre antiagregantes, golpes leves ni otras articulaciones. La recomendación EULAR de infiltraciones (Uson 2021, LE 3, GR C) dice que tomar antitrombóticos «no es contraindicación» salvo riesgo alto de sangrado, con cifras de sangrado de 0–2 %.

### 7. Otros sangrados

- Los sangrados **no mayores** de los anticoagulantes sangran por: «“haematuria (16.4%), epistaxis (14.8%), gastrointestinal (13.3%), haematoma (11.5%) and bruising/ecchymosis (10.1%)”» (Bahit 2017, apixabán y warfarina en fibrilación auricular). Y «“non-major bleeding, including minor bleeding, might not be minor”» (Bahit 2017): el sangrado clínicamente relevante no mayor aumentó el riesgo de sangrado mayor y de muerte después.
- **Conducta general** (Tran 2025, guía de anticoagulantes directos): «“The anticoagulant should be ceased at least temporarily in all patients presenting with significant bleeding”»; los sangrados menores, con medidas locales. Eso lo decide el médico, no el fisio.
- Ya cubiertos por la app: melena, hematemesis y perforación (guía de fármacos, Antunes 2024; `hem_4`).

### 8. Técnica: lo que las fuentes dicen y con qué nivel

**8.1 Manipulación con thrust**

| Fuente | Qué dice | Nivel |
|---|---|---|
| Puentedura 2015 (tabla 1) | «Bleeding diatheses, e.g. haemophilia, anticoagulant therapy»: **contraindicación absoluta** del thrust torácico. El antiagregante no está. La tabla sale de un trabajo de osteopatía (Gatterbauer 2009) que no se ha leído | Revisión de casos; la tabla es de un trabajo no disponible |
| Hutting 2018 (tabla 2; la reproduce Chen 2019) | «Anticoagulant therapy» y «Blood clotting disorders / alterations in blood properties» en la columna de **precauciones** de la terapia manual cervical; las contraindicaciones son otras (fractura aguda, inestabilidad, mielopatía aguda, insuficiencia vertebrobasilar…). La tabla sale de Puentedura 2012 (una revisión de 134 casos) y del marco IFOMPT de 2013, ninguno leído. Dice «“Cervical spine manual therapy should not be performed when contraindications or unexplained red flags are present”» y, en la conclusión, «“in the event of other contraindications or risk factors for possible serious adverse events, cervical spine manipulation or mobilisation should not be performed”»: no aclara qué hacer con una precaución | Opinión de los autores; solo cervical |
| Whedon 2015 | «“Chiropractic physicians should exercise caution with regard to the provision of SM in older patients with coagulation defects, inflammatory spondylopathy, osteoporosis, aortic aneurysm & dissection, or long term use of anticoagulant therapy.”» Con «“Long-term use of anticoagulant therapy was associated with increased likelihood of brain or spinal cord injury (OR 2.17, 95% CI 1.15–4.07).”» Los propios autores: «“there is insufficient empirical evidence to positively identify many of these conditions as risk factors for injury due to SM”». No separa regiones, fármacos ni dosis, y no comprueba que la lesión fuera por la manipulación | Cohorte retrospectiva de reclamaciones; no causal |
| Cooper 2019 | «“we advise that SMT and exercises or stretches that apply significant torque to the cervical spine should be cautioned in patients with known coagulopathy.”» «“A report of one case should not suggest causality.”» «“His international normalized ratio (INR) was 7.84”» (sobreanticoagulado) | Opinión de autores de un caso |
| Rushton 2023 (marco IFOMPT cervical) | No menciona anticoagulantes, antiagregantes ni «coagul»: ni a favor ni en contra | Consenso |

No hay datos de incidencia, ni por INR, ni por fármaco, ni de lumbar ni de periféricas. «“practitioners should also understand INR does not apply to patients on non-vitamin K oral anticoagulants”» (Cooper 2019): lo único sobre diferencias entre fármacos.

**8.2 Presión profunda, fricción, masaje, tracción, estiramientos**

- **Ninguna guía ni revisión.** Hay dos Delphi de otras técnicas: instrumentos de tejidos blandos (IASTM), donde «Medications that thin blood» es una **precaución** de grado B (acuerdo de 60–69 %; Cheatham 2025, «nivel 4»); y el rodillo de espuma, donde un ítem sobre los anticoagulantes estaba en las primeras rondas y **no figura entre las seis condiciones del consenso final** (Bartsch 2021; los autores no explican por qué).
- **Casos**, con las salvedades de sus autores:
  - masajeador cervical y aspirina, hematoma epidural cervical con cuadriplejía transitoria; los autores no lo atribuyen a la aspirina y dicen que «“even relatively light external forces can cause traumatic SEH”» (Tominaga 2023);
  - percutor sobre el punto de inyección de heparina, hematoma de la vaina de los rectos y muerte: «“Use of handheld deep-tissue percussive massage devices should be considered as a cause of or contributor to RSHs, particularly in patients who are receiving anticoagulation therapy.”» pero «“Although the role of a percussive device in the development of an RSH in this patient is uncertain, we feel it may have been at least a contributing factor.”» (Kwon 2024: COVID grave, doble anticoagulación);
  - warfarina con INR 2,57, síndrome compartimental del antebrazo tras fisioterapia; según la paciente, «estiramientos y movilización»; «“a direct causal relationship between the physiotherapy intervention and the development of compartment syndrome cannot be established based on a single case report”» y «“Detailed information regarding the specific physical therapy modality was unavailable”» (Kim 2026).
- **Estiramientos intensos, tracción, fricción profunda**: nada leído, salvo lo anterior.

**8.3 Punción seca y acupuntura**

- **No existe ningún estudio de punción seca en pacientes antitrombotizados.** «“There are no studies comparing the incidence and prevalence of adverse events associated with DN in subjects taking antithrombotics and subjects who do not take these medications.”» (Muñoz 2022, §10). Lo que concluye lo extrapola de la electromiografía, la acupuntura, la toxina botulínica y la biopsia: «“taking antithrombotic medication should not be considered an absolute contraindication for DN techniques”» (Muñoz 2022, §11).
- El consenso de expertos de Waterway 2026 (Delphi de 9 fisioterapeutas, «nivel V») dice lo mismo («“antithrombotic medication use alone should not be considered an absolute contraindication when appropriate precautions are implemented and individual bleeding risk is thoroughly assessed”») **y cita a Muñoz 2022 como único respaldo**: no es evidencia independiente. Define «“significant bleeding risk”» como contraindicación absoluta sin decir qué es.
- **Contradicción**: la guía suiza, según Malfait 2024 (de segunda mano), la trata como contraindicación absoluta para la anticoagulación y relativa para los antiagregantes («“In the Swiss guidelines, anticoagulation therapy is stated as an absolute contra-indication whereas taking antithrombotic medication is a relative contra-indication.”»); cuatro de los estudios con ictus de esa revisión la excluyeron, que es un criterio de los autores y no un hallazgo.
- **Consejos prácticos de Muñoz 2022** (de los autores, sin cita que los apoye): «“initially avoid DN in deeper muscles until its safety has been established with more superficial muscles”» y «“for patients taking anticoagulants the pressure should be applied for about 10–15 seconds”» (frente a unos 5 s). La APTA, citada por Muñoz, pide evitar los músculos profundos que no se pueden comprimir.
- **INR**: Muñoz **no da ningún INR límite** para la punción seca; el único valor numérico es de la toxina botulínica (INR ≤ 2,6 con aguja de 27 G o más fina, según Muñoz), de series pequeñas. Trasladarlo sería una decisión vuestra. **Tanda 2:** en Boulias 2018 la cifra de consenso es INR ≤ 3,5 (músculos profundos de la pierna, aguja de 25 G o más fina); el 2,6 es la media de una serie que cita (Schrader) y el 27 G solo una opción de su primera ronda.
- Acupuntura (McCulloch 2015, RS de nivel bajo): los sangrados graves fueron por agujas demasiado profundas o por mezclas de pautas anticoagulantes; las cifras de frecuencia de esa revisión no cuadran (ver «Leídas solo en parte»).

**8.4 Ondas de choque**

- **El Delphi más reciente, Rhim 2025** (41 expertos de 13 países, consenso ≥ 75 %): **no alcanzó consenso** sobre si las ondas de choque focalizadas o radiales pueden aplicarse mientras el paciente toma anticoagulantes («“Focused ESWT can be performed while the patient is on direct anticoagulants.”»: acuerdo del 66,7 %; radiales, 67,6 %; «direct anticoagulants» no se define). La coagulopatía y la anticoagulación aparecen solo como **respuestas libres** de algunos expertos (la coagulopatía, como contraindicación absoluta; la anticoagulación, como relativa), no como enunciados votados. Sí hay consenso en que el hematoma es un efecto adverso posible (90,5 % con las focalizadas y 92,5 % con las radiales).
- «“Regarding anticoagulation use or clotting disorders, ESWT should be used judiciously in these instances, given that one of the common adverse effects is hematoma formation.”» y «“it is difficult to ascertain the safety of ESWT in these cases as they are not included in research studies”» (Tenforde 2022; la tabla 9 la pone entre las «consideraciones importantes», no entre las contraindicaciones; la coagulopatía importante es relativa solo con alta energía).
- Las otras dos fuentes se contradicen: «“Among the usual contraindications of shock wave treatment are anticoagulant treatment or disorders that favors bleeding”» (De la Corte-Rodríguez 2023, texto, mientras que su tabla solo pone las coagulopatías mal controladas); «“Historically, anticoagulant therapy was considered an absolute contraindication to ESWT because of the theoretical risk of hematoma formation.”» y hoy relativa (Gao 2026, que atribuye a Tenforde frases que Tenforde no dice). **Ninguna aporta un estudio con anticoagulados.**

**8.5 Inyecciones**

- Infiltración articular: «“IAT is not a contraindication in people with clotting/bleeding disorders or taking antithrombotic medications, unless bleeding risk is high.”» (Uson 2021, recomendación 8, acuerdo del 89 %, LE 3, GR C). Riesgo de sangrado periprocedimiento de 0 a 2 % en siete estudios observacionales. Tarar 2023 (warfarina) y Tarar 2021 (anticoagulantes directos), de calidad baja, apuntan a lo mismo.
- Inyección intramuscular: el único ECA es de vacuna antitetánica con acenocumarol, con INR en rango (6 hematomas en total: sin potencia, y sus autores advierten que no se puede extrapolar a los anticoagulantes directos; Lago-Deibe 2022). La guía EHRA, ya leída, pone la inyección intramuscular de una vacuna entre las intervenciones de riesgo mínimo (guía de fármacos).

### 9. Ejercicio, deporte y otras modalidades

- **Deportes de colisión y contacto**: consenso de expertos y sin datos. «“the guideline recommendations for OAT in athletes only reflect expert consensus and common-sense considerations”» (Minardi 2024); «“there are no in-depth studies or case studies regarding the increased frequency and severity of bleeding events during sports practice in athletes on anticoagulation therapy”» (D'Ascenzi 2025); «“Current anticoagulation management in athletes relies heavily on expert opinion and extrapolation from non-athletic populations”» (Bavishi 2026).
- **AHA/ACC 2025** (Kim 2025, leída entera) es la única que gradúa por deporte y por antitrombótico, y **solo para deportistas de competición** (el texto añade que también puede aplicarse a «“high-level recreational sports”» de quien encaje en la descripción del atleta competitivo, y que para los masters, «“these clinical considerations are not applicable to older individuals engaged in recreational physical activity”»). Define la «anticoagulación plena» como warfarina o inhibidores directos de la trombina y la «parcial» como doble antiagregación («“Full anticoagulation is defined as a medical regimen including warfarin or direct thrombin inhibitors”»; **no nombra los anti-Xa**: apixabán, rivaroxabán, edoxabán) y dice que «“Risks of bleeding are likely higher if the participant is on full anticoagulation (eg, warfarin or direct thrombin inhibitor) versus dual antiplatelet therapy.”» Su tabla 3 (comprobada sobre la imagen) reparte los deportes en cuatro grupos: sin colisión o a baja velocidad (tiro con arco, golf, natación, tenis, voleibol, carrera de fondo…): pueden participar con anticoagulación plena, parcial o aspirina sola; colisiones o impactos impredecibles a velocidad moderada (baloncesto, fútbol, béisbol…): «“After SDM, these competitive sports may be reasonable for athletes receiving full anticoagulation or partial anticoagulation”»; impactos impredecibles a alta velocidad (ciclismo, esquí alpino, equitación, kayak…) y colisiones rutinarias (fútbol americano, boxeo, hockey sobre hielo, rugby, lucha…): con anticoagulación plena, los riesgos «generally outweigh benefits»; con la parcial, «may outweigh benefits… SDM recommended». **Con aspirina sola: «“Athletes receiving aspirin monotherapy can participate in these competitive sports.”», en los cuatro grupos.** Los masters (tabla 14): «“Masters athletes who require antiplatelet monotherapy can participate in all competitive sports.”»; con doble antiagregación o anticoagulación plena, «the risks of some competitive sports involving collisions or impacts likely outweigh benefits»; la suspensión temporal del anticoagulante «“can be considered with SDM”», pero «data establishing the safety of this approach are lacking». Bavishi 2026 clasifica los deportes de otro modo (baloncesto y fútbol «alto», kayak «bajo en aguas tranquilas») y su tabla es propia, sin fuente.
- **Antiagregante simple y deporte**: «controvertido» para D'Ascenzi 2025 y sin límite para Kim 2025 (aspirina sola, en los cuatro grupos de la tabla 3; masters con antiagregación en monoterapia, todos los deportes). Kim 2025 no dice si «monoterapia» incluye clopidogrel, ticagrelor o prasugrel solos, y para esa frase cita un artículo cuyo título trata de AINE y riesgo cardiovascular en el fútbol americano (solo el título; no se ha leído).
- **Ejercicio común** (caminar, nadar, fuerza): ninguna fuente da intensidad, carga ni estiramientos. «Los deportes de bajo riesgo se permiten» (Bavishi 2026; Minardi 2024); el ejercicio tras una embolia pulmonar es seguro (Xiang 2025, ya en la app); el de después de una TVP es seguro (Bavishi 2026, que cita una revisión, y Liu 2015, con las salvedades de calidad de arriba y de «no aplicable a todas las TVP agudas, sobre todo proximales»). NICE NG158 solo manda informar «“how anticoagulants may affect activities such as sports and travel”» (1.5.1) y no dice cómo.
- **Entrenamiento con restricción de flujo (BFR)**: ninguna fuente lista los anticoagulantes ni los antiagregantes; sí la TVP previa, el síndrome antifosfolípido y las trombofilias (Gaviglio 2026, que es una narrativa y su tabla de puntos «una ayuda», no una guía). Quien está anticoagulado por esas causas queda excluido por la causa, no por el fármaco **[inferencia mía]**.
- **Otras modalidades** (calor, ultrasonido, electroterapia, magnetoterapia, vendajes compresivos): ninguna fuente abierta.
- **Rehabilitación con HBPM tras una prótesis**: ninguna recomendación de técnica o de ejercicio durante la profilaxis (NICE NG89 solo dice «movilizar cuanto antes» y las duraciones).

### 10. Caídas

- «“Do not withhold anticoagulation solely because of a person's age or their risk of falls.”» (NICE NG196, 1.6.8), con la razón del comité: «“falls are rarely a cause of major haemorrhage”». Mitchell 2023 (narrativa): las caídas pueden aumentar la hemorragia intracraneal, pero «“the absolute risk is relatively low compared to the risk of ischaemic stroke and venous thromboembolism”».
- Hay que revisar la medicación y prevenir las caídas (Steffel 2021, ya en la app; Mitchell 2023: fuerza, equilibrio y marcha, ayudas, entorno, calzado). NICE NG249 (caídas) y las guías mundiales no hablan de anticoagulantes.
- **No hay ninguna fuente que demuestre que el ejercicio de equilibrio reduce el sangrado grave por caídas en anticoagulados.**

### 11. Diferencias entre fármacos (solo las que las fuentes justifican)

| Diferencia | Qué dice y con qué nivel | ¿Cambia algo en la app? |
|---|---|---|
| **INR** (solo antivitamina K) | Objetivo 2,0–3,0 para la TEV y el síndrome antifosfolípido: «“The goal INR range is between 2.0 and 3.0; risk for clotting is higher when INRs are less than 2.0, risk for bleeding is higher when INRs are greater than 3.0”» (Witt 2016, consenso). Válvula mecánica: 2,5–3,5 (Sapapsap 2022) frente a 2–3 «sin factores de riesgo» y 1,5–2,0 en una válvula concreta (Gerfer 2024). Mayor sangrado con INR ≥ 3 en una serie pequeña (Ohgushi 2016, japoneses mayores, IC enormes). **Ninguna fuente da un INR de alarma para el fisio** | **No**: la app no pone ningún número de INR. Solo el texto «con antivitamina K, el INR no mide a los anticoagulantes directos» (Cooper 2019; Witt 2016) |
| **Anticoagulantes directos** | Menos hemorragia intracraneal que la warfarina (Pfeilschifter 2022; Skaistis 2015; Wang 2020, de calidad desigual); no tienen «INR»; tras un traumatismo, la hemorragia tardía es parecida (Puzio 2021; Hughes 2021). Vida media: lo que dice la guía EHRA, ya leída | No |
| **Heparinas** | Profilaxis posquirúrgica (NG89: HBPM 10–28 días tras prótesis de cadera, 14 en rodilla, un mes tras una fractura frágil de cadera, pelvis o fémur), tratamiento de la TEV (NG158: al menos 3 meses) y embarazo (Witt 2016: HBPM, no warfarina ni anticoagulantes directos). Duración del efecto: ninguna fuente | **Solo** como contexto de «cuánto tiempo»; ninguna regla |
| **Antiagregantes** | Aspirina sola: la excluye NICE de la regla de la cabeza y la deja libre AHA/ACC 2025; Puentedura 2015 no la incluye. Clopidogrel, prasugrel y ticagrelor: NICE los incluye en la regla de la cabeza; ticagrelor y prasugrel, «datos muy escasos» (Colombo 2021). **Doble antiagregación**: más sangrado que la simple (Yin 2019; Colombo 2021: 2,64 % frente a 0,22 %; Cheng 2022: peor resultado funcional en un estudio incluido); «la anticoagulación plena» sangra más que la doble para AHA/ACC 2025 | **Sí**, en tres cosas: la regla de la cabeza (NICE), el tope «sin thrust» (solo anticoagulante) y la frase del deporte |
| **Combinaciones** | «“Combining antiplatelet therapy with any type of anticoagulant increases bleeding risk”» (Witt 2016); con AINE, HR 1,66 de hemorragia digestiva (Lee 2024, pero «AINE» incluye aquí la aspirina y no separa antivitamina K y anticoagulantes directos); NICE NG196 manda vigilar y modificar los factores de sangrado: antiagregantes, ISRS y AINE (1.2.3) | Solo texto («coméntalo con quien lo prescribe»), nunca «cámbialo» |
| **Corticoides con anticoagulantes** | Ninguna fuente leída da un aumento de riesgo (Steffel 2021, ya en la app, los cita entre los factores) | No |

**¿Cambia el riesgo de la fisioterapia según el fármaco?** Ninguna de las fuentes lo compara. Las diferencias entre fármacos que existen son de hemorragia intracraneal tras un traumatismo, no de técnicas. Extrapolarlas a la técnica **no tiene respaldo**.

## Lectura de los PDF (tanda 1)

Tres PDF que pasó el usuario, leídos enteros. Hutting 2018 (manuscrito aceptado, 7 páginas de texto) y Rhim 2025 los leí yo; Kim 2025 (50 páginas) lo leyeron dos lectores, uno por mitad, y yo comprobé sobre la imagen de las páginas la tabla 3, el ámbito (p. 3) y el texto de los antitrombóticos de los masters (p. 35), porque la extracción de texto mezcla las dos columnas. Cada cita entre comillas de abajo está en el texto del PDF.

### Hutting 2018

**Hutting N, Kerry R, Coppieters MW, Scholten-Peeters GGM. Considerations to improve the safety of cervical spine manual therapy.** *Musculoskelet Sci Pract* 2018;33:41–45 ([doi:10.1016/j.msksp.2017.11.003](https://doi.org/10.1016/j.msksp.2017.11.003)); clave propuesta `Hutting 2018`.
- **Qué es**: un artículo profesional, con la declaración «“This article presents the authors’ personal opinions”». No es una guía ni una revisión sistemática.
- **La tabla 2** («“Contraindications and precautions to perform cervical spine manual therapy (Puentedura et al., 2012; Rushton et al., 2013)”»): en la columna de **precauciones**, entre otras, «Vascular disease», «Blood clotting disorders / alterations in blood properties» y «**Anticoagulant therapy**», junto a la osteoporosis, el uso prolongado de esteroides y la hipermovilidad. Las contraindicaciones son otras: fractura aguda, inestabilidad, mielopatía aguda, insuficiencia vertebrobasilar, cirugía reciente…
- **De dónde sale la tabla**: de Puentedura 2012 (una revisión de 134 casos de acontecimientos adversos tras manipulación cervical, que el texto cita) y del marco IFOMPT de 2013. Ninguno está leído. Es la misma familia de fuentes que la tabla de Puentedura 2015 (una revisión de casos posterior, del torácico), pero **no la misma tabla**: la de 2015 sale de un trabajo de osteopatía.
- **Cómo usarla el propio texto**: «“Cervical spine manual therapy should not be performed when contraindications or unexplained red flags are present”». Y de la movilización: «“The contraindications discussed in the IFOMPT Framework also apply in case of mobilisation or exercises”», aunque «puede que varíen». En la conclusión, algo ambiguo: «“in the event of other contraindications or risk factors for possible serious adverse events, cervical spine manipulation or mobilisation should not be performed”». **Nunca dice qué hacer con una precaución.**
- **Otras frases del texto**: «“There is no clear evidence that any one technique has a higher risk compared to the other techniques”» y «“knowledge is lacking on possible serious adverse events after mobilisation”». No habla de antiagregantes, de la columna torácica ni de la lumbar, ni distingue fármacos.
- **El marco IFOMPT cervical posterior** (Rushton 2023, ya leído) no menciona los anticoagulantes en ningún punto. Hutting 2018 es anterior.

### Kim 2025 (AHA/ACC), leída entera

**Kim JH, Baggish AL, Levine BD, et al. Clinical considerations for competitive sports participation for athletes with cardiovascular abnormalities.** *J Am Coll Cardiol* 2025;85(10):1059–1108 ([doi:10.1016/j.jacc.2024.12.025](https://doi.org/10.1016/j.jacc.2024.12.025)); clave propuesta `Kim 2025`. Declaración científica sin clase ni nivel de evidencia: da «consideraciones clínicas» para decidir con el paciente («“this is not an article outlining “disqualification recommendations,” but rather a compendium of clinical considerations”»).
- **Tabla 3** (p. 1066, comprobada sobre la imagen): cuatro columnas por tipo de colisión o impacto. Para cada columna, una recomendación por antitrombótico.

| Grupo (deportes de ejemplo de la tabla) | Anticoagulación plena | Parcial (doble antiagregación) | Aspirina sola |
|---|---|---|---|
| 1. Sin colisión o a baja velocidad (tiro con arco, golf, natación, tenis, voleibol, carrera de fondo, halterofilia…) | Pueden participar | Pueden participar | Puede participar |
| 2. Colisiones o impactos impredecibles a velocidad moderada (baloncesto, fútbol, béisbol, esgrima, gimnasia, buceo…) | «May be reasonable» tras decidir con el paciente | «May be reasonable» tras decidir con el paciente | Puede participar |
| 3. Impactos impredecibles a alta velocidad (esquí alpino, ciclismo, hípica, kayak, escalada…) | «Generally outweigh benefits» | «May outweigh benefits; SDM recommended» | Puede participar |
| 4. Colisiones rutinarias a velocidad moderada o alta (fútbol americano, boxeo, hockey sobre hielo, lacrosse, artes marciales, rugby, lucha) | «Generally outweigh benefits» | «May outweigh benefits; SDM recommended» | Puede participar |

- **Definiciones** (pie de la tabla 3): «“Full anticoagulation is defined as a medical regimen including warfarin or direct thrombin inhibitors. Partial anticoagulation is defined as a medical regimen including dual antiplatelet therapy.”» **No nombra los inhibidores del factor Xa** (apixabán, rivaroxabán, edoxabán) ni las heparinas, y la tabla 14 y la tabla 15 hablan de «full oral anticoagulation» sin definirla: no se sabe si los anti-Xa cuentan como plenos. La doble antiagregación solo se define (aspirina y clopidogrel) en la tabla 7, en una nota sobre la enfermedad de Kawasaki.
- **El texto** (p. 1067): «“Risks of bleeding while on anticoagulants are determined both by the likelihood of trauma and the physics of the traumatic event.”» y «“Risks of bleeding are likely higher if the participant is on full anticoagulation (eg, warfarin or direct thrombin inhibitor) versus dual antiplatelet therapy.”»
- **Masters** (≥ 35 años; tabla 14 y texto, pp. 1091 y 1093): «“Masters athletes who require antiplatelet monotherapy can participate in all competitive sports.”»; con doble antiagregación o anticoagulación oral plena, el tratamiento «should be based on established clinical guidelines» y los riesgos de los deportes de colisión o impacto «likely outweigh benefits»; «“temporary discontinuation of oral anticoagulation can be considered with SDM”», pero «“data establishing the safety of this approach are lacking”». Esta suspensión también se cita en la embolia pulmonar (tabla 15) como «in rare circumstances».
- **Embolia pulmonar y TVP** (tabla 15): quien tenga síntomas «should not participate in competitive sports until they undergo prompt and comprehensive diagnostic evaluation»; con anticoagulación plena, «“The risks of bleeding likely outweigh benefits in some competitive sports”».
- **Fibrilación auricular** (tabla 11): «“Anticoagulation for young competitive athletes with AF should be guided by standard risk algorithms.”» La decisión de anticoagular queda fuera del documento.
- **Alcance** (p. 1061): deportistas de competición («“individuals who participate in organized team or individual sports that require regular competition against others…”»); el texto puede aplicarse a «“high-level recreational sports (eg, regular marathon runners, triathletes, cyclists, CrossFit enthusiasts) who fulfill the general description of the competitive athlete”» y no está pensado «“directly”» para otras poblaciones activas. Para los masters: «“these clinical considerations are not applicable to older individuals engaged in recreational physical activity”» (pp. 1089 y 1092). **No da nada para la actividad recreativa o terapéutica habitual, ni para caídas, inyecciones o terapia manual.**
- **Ambigüedades del propio documento**:
  - el texto dice que la tabla 3 identifica deportes de riesgo «prohibitivo» para «any type of anticoagulation therapy», pero la tabla da a la aspirina sola «can participate» en los cuatro grupos;
  - «generally outweigh» no está en el vocabulario de su propia tabla 1 (que tiene «likely outweigh» y «may outweigh»);
  - para la monoterapia antiagregante de los masters cita un artículo cuyo título trata de AINE y riesgo cardiovascular en el fútbol americano (solo el título; no se ha leído);
  - no dice si «monoterapia antiagregante» incluye clopidogrel, ticagrelor o prasugrel solos;
  - los grupos 3 y 4 reciben la misma recomendación aunque difieren en el mecanismo del trauma;
  - la tabla solo trata el sangrado traumático.

### Rhim 2025 (Delphi de ondas de choque)

**Rhim HC, Singh M, Maffulli N, et al. Recommendations for use of extracorporeal shockwave therapy in sports medicine: an international modified Delphi study.** *Br J Sports Med* 2025;59:1287–1301 ([doi:10.1136/bjsports-2024-109082](https://doi.org/10.1136/bjsports-2024-109082)); clave propuesta `Rhim 2025`. Delphi de tres rondas con 41 expertos de 13 países, consenso fijado a priori en ≥ 75 % (consenso en 69 de 118 enunciados).
- **Anticoagulación**: no hubo consenso sobre «“Focused ESWT can be performed while the patient is on direct anticoagulants.”» (acuerdo del 66,7 %, neutral 15,4 %, desacuerdo 17,9 %) ni sobre el mismo enunciado para las ondas radiales (67,6 %, 10,8 %, 21,6 %). El texto: «“Experts failed to reach consensus on when to discontinue NSAIDs before initiating shockwave or pressure wave therapy, or whether focused shockwave or radial pressure wave therapy can be performed while patients are on direct anticoagulants”». **«Direct anticoagulants» no se define** (probablemente los anticoagulantes directos, pero no lo dice).
- **Contraindicaciones** (tabla 7): la coagulopatía figura como respuesta libre de contraindicación **absoluta** (radial y focalizada) y la anticoagulación como respuesta libre de contraindicación **relativa**; son comentarios de algunos expertos, no enunciados votados. Sí hay consenso en la contraindicación del cáncer activo cerca de la zona y, para las focalizadas, del pulmón en la zona.
- **Efectos adversos** (tabla 8): consenso en que incluyen el hematoma («“haematoma formation”»), la equimosis, la irritación nerviosa y el dolor local.
- Los AINE, «avoid throughout the duration» del tratamiento; no entra en esta condición.

### Qué cambia en el diseño (propuestas, aplicadas ya al texto de arriba)

- **W1. Hutting 2018 sustituye a Chen 2019 como fuente de la «precaución cervical».** Ya se cita directamente (con su tabla y sus límites); Chen 2019 queda solo como caso clínico. *Recomiendo el cambio.*
- **W2. Las dos tablas del thrust son opinión de expertos**: la torácica (Puentedura 2015) y la cervical (Hutting 2018), de regiones distintas y con distinto grado, y ninguna se apoya en datos de anticoagulados. **No cambia el tope de la decisión 4** (anticoagulante: sí; antiagregante solo: no), pero el «¿Por qué?» lo dirá así, sin llamar «contraindicación» a lo que otra tabla llama «precaución». La decisión 5 queda con esta información.
- **W3. Ondas de choque: «sin consenso» (Rhim 2025), no «relativa».** El Delphi más reciente no avala ni la contraindicación ni el permiso; la contradicción 6 queda resuelta por la fuente mejor (más expertos, consenso definido a priori). Tenforde 2022 se queda como la «consideración importante» del mismo grupo.
- **W4. Deporte: ya hay una regla con fuente (Kim 2025), pero solo para competición.** La decisión 13 pasa de «sin deporte hasta leer el PDF» a «citar la regla, no copiar la lista, decir que es para competición y que no define los anti-Xa». La **aspirina sola sin límite** coincide con la regla de la cabeza de NICE (la excluye) y con el tope de la decisión 4 (no la incluye): tres fuentes distintas, el mismo criterio.
- **W5. «Suspender el anticoagulante para hacer deporte» es una medida que Kim 2025 considera «con decisión compartida» y sin datos de seguridad.** La app **nunca** lo sugiere (sigue la línea fija de «no dejar ni saltarse una dosis»); solo puede decir que es del médico.
- **Nada de esto toca la fase 2** (las 6 urgencias y la derivación), las fases 3 y 4, la 4b, el payload ni la red de seguridad.

## Contradicciones entre fuentes, y qué propongo elegir

1. **Thrust: contraindicación absoluta o precaución.** Puentedura 2015 (absoluta, torácica; la tabla viene de un trabajo de osteopatía no disponible) frente a Hutting 2018 (precaución, cervical; opinión de los autores con la tabla tomada de una revisión de casos de 2012 y del marco de 2013), Cooper 2019 («cautioned») y Whedon 2015 («caution»). **Las dos tablas son opinión de expertos**, de regiones distintas y con grado distinto, y ninguna se apoya en datos de anticoagulados. Los resultados de Whedon y los casos no son de columna torácica. *Propongo* **mantener el tope «sin thrust» de la fase 6 solo para el anticoagulante** (es lo que la app ya hace desde la decisión 15 y lo que dice la única tabla específica de la columna torácica), **decirlo con su contradicción** en el «¿Por qué?» y en el recuadro, y hablar de «precaución» en lo cervical y en el resto de regiones. *Alternativa*: sin tope, solo texto de precaución (más acorde con el nivel de evidencia).
2. **Antiagregante y thrust.** Ninguna fuente de manipulación lo incluye. *Propongo* que el antiagregante solo **no** active el tope; sí la línea de precaución del lupus (Blaess 2024, rec. 3). Esto **cambia** lo que hoy hace la casilla del lupus (decisión 4).
3. **Golpe en la cabeza: observar 24 h (Wiegele 2019) o no ingresar solo por anticoagulación (NICE NG232).** No cambia el papel del fisio (derivar). *Propongo NICE NG232*: guía de 2023 con revisión de evidencia frente a un consenso de 2019 sin GRADE.
4. **Incidencia de la hemorragia tardía** (0,3 % a ≈ 4 % según el método). *Propongo* decir «rara, y puede aparecer pasados varios días» y no dar una cifra única; las cifras irán en el `detalle`, con el método.
5. **Plazo para operar el hematoma epidural (8 h, 12 h, o ninguno demostrado).** *Propongo* «urgencias ya, cuanto antes» sin número en la urgencia, y la cifra de Peng 2022 en el razonamiento con su contradicción. **Tanda 2:** Vastani 2023 (295 casos operados publicados) asocia operar antes de 12 h a mejor resultado (OR 2,44), sin probar otros plazos; ninguna fuente sostiene las 8 h. La urgencia sigue sin horas.
6. **Ondas de choque: absoluta (De la Corte-Rodríguez 2023), relativa (Gao 2026), consideración (Tenforde 2022) o sin consenso (Rhim 2025).** Ninguna tiene datos con anticoagulados. *Propongo* decir lo que dice el Delphi más reciente: **sin consenso** sobre aplicarlas con anticoagulantes (66,7–67,6 % de acuerdo, por debajo del 75 %), con el hematoma como efecto posible por consenso, y Tenforde 2022 como «consideración importante, sin datos»; ni «contraindicada» ni «permitida». *Alternativa*: solo Tenforde 2022.
7. **Punción seca: contraindicación absoluta (guía suiza, de segunda mano) o no (Muñoz 2022 y Waterway 2026, que depende de la primera).** *Propongo* decir que ni existe un estudio ni hay un consenso independiente, y recoger los consejos de Muñoz como «práctica de los autores».
8. **INR de la válvula mecánica** (2,5–3,5; 2–3; 1,5–2,0). *Propongo* no dar ningún INR en la app.
9. **Deportes**: AHA/ACC 2015 (evitar el contacto) frente a 2025 (graduado por deporte, por antitrombótico y con decisión compartida) frente a la tabla propia de Bavishi 2026. Con Kim 2025 leída entera, *propongo* **citar su regla sin copiar la lista de deportes**: con aspirina sola, sin límite; con doble antiagregación o anticoagulante, los deportes sin colisión o a baja velocidad, bien, y los de colisión rutinaria o impacto de alta velocidad, desaconsejados o a decidir con el médico; y **decir que es para deportistas de competición** (y recreativos de alto nivel que lo parezcan) y que no define qué anticoagulantes cuentan como «plenos».
10. **Aviso del síndrome compartimental**: umbrales de presión distintos. *Propongo* no dar ninguno.
11. **Nada en la app sobre reducir caídas como si evitara el sangrado.** No hay fuente: la línea de caídas solo dice no retirar el anticoagulante (NG196) y entrenar equilibrio y fuerza (Mitchell 2023).

## Criterio de entrada de la Fase P: sí entra

- **Cambia la seguridad**: hay banderas rojas propias que hoy ninguna región pregunta (golpe en la cabeza, hematoma epidural espontáneo, hematoma del psoas y de la pared abdominal, síndrome compartimental fuera del posquirúrgico) y la app ya aplica un tope de técnica a una casilla suelta del lupus.
- **Cambia la técnica**: thrust, punción seca, ondas de choque, presión profunda y deporte de contacto (aunque con nivel de evidencia bajo).
- **Es transversal**: sale en las 7 regiones y en cualquier edad.
- **Lo ve un fisioterapeuta**: golpes en la cabeza, hematomas, dolores desproporcionados y el momento de elegir una técnica son cosas de la consulta.

## Relaciones con lo que ya existe

- **Casilla del lupus** (`lupus.antitrombotico`). *Recomiendo* **una sola fuente de datos**: la tarjeta nueva. En la tarjeta del lupus, la casilla se sustituye por una línea «Anticoagulante o antiagregante: tarjeta “Paciente anticoagulado o antiagregado” (marcada / sin marcar)» con un botón que va a ella (como `irACondicion()`); `le.at` del payload se **deriva** de la tarjeta nueva (physiq-report y las sesiones guardadas no cambian) y las sesiones antiguas con la casilla en «sí» se **migran** al restaurarlas a una tarjeta marcada con «No lo sabe qué toma» (es migración de datos, no una regla clínica). La línea de la 4b y el aviso del lupus (`tecnica4bAntitrombotico`, `lupusAntitrombotico`) se sustituyen por los de la tarjeta nueva, para que no salgan dos veces. *Alternativa*: mantener las dos casillas independientes (más sencillo, pero el fisio tendría que marcar dos veces lo mismo).
- **Osteoporosis y `motivosSinThrust()`**. El motivo `'antitrombotico'` pasa a leer la tarjeta nueva y a llamarse `'anticoagulante'` (decisión 4). La heparina en el embarazo como factor de la osteoporosis asociada al embarazo no genera ninguna regla (solo el texto que ya tiene). Ninguna regla automática entre las dos tarjetas.
- **Embarazo o posparto**. `em_u_tev`: su frase «Si se pincha heparina, trátala como a una persona anticoagulada» se cambia por un enlace («marca la tarjeta Paciente anticoagulado o antiagregado»); la embarazada con heparina (HBPM es el tratamiento de la TEV en el embarazo, Witt 2016) marca la tarjeta con «Heparina». Ninguna regla automática.
- **Posquirúrgico**. La profilaxis con HBPM o aspirina tras una prótesis (NICE NG89) hace que un paciente sea «anticoagulado o antiagregado» durante semanas. Ninguna fuente lee la duración como cambio de técnica, así que **no hay regla**: el texto de la tarjeta recuerda marcarla. `pq_tvp`, `pq_tep`, `pq_compart` y `pq_nervio_col` siguen como están; las preguntas nuevas dicen en su razonamiento que son su equivalente con anticoagulante sin operación.
- **Sistema hematológico**. `hem_1`, `hem_4` y `hem_6` siguen como están (con la tarjeta marcada, `hem_6` sigue siendo la pregunta de la hemofilia). *Recomiendo* una línea nueva en el razonamiento de `hem_1` y de `hem_4`: «con la tarjeta marcada, también pueden ser el efecto del fármaco; derivar los sangrados que no son menores (Tran 2025; Bahit 2017)». Nada de rebajar su urgencia.
- **Artritis séptica** (`r1`, `co1`, `tp_i1`, `ca_in1`) y **hemartros de rodilla**: siguen igual; con la tarjeta marcada, una línea en su razonamiento («con anticoagulante, también puede ser un hemartros: ante la duda se aspira para descartar infección, Dalrymple 2022»).
- **Hipermovilidad vascular, disautonomía, mastocitos**: ninguna fuente leída los relaciona con los antitrombóticos. Ninguna regla.
- **Lupus**: el síndrome antifosfolípido y el anticoagulante: la línea de la fase 5 de Tektonidou 2019 ya existe y se queda. Ninguna regla automática entre las tarjetas.
- **Guía de fármacos** (`data/farmacos.js`, familia `antitromboticos`):
  - la tarjeta enlaza con ella («Fármacos: anticoagulantes y antiagregantes» abre la guía ya en esa familia: hoy `abrirFarmacos()` no lo admite, **cambio pequeño de código**);
  - **su texto queda desfasado** por estas fuentes y habrá que actualizarlo al implementar (otra revisión del usuario): «Tras un golpe en la cabeza, valoración médica» pasa a citar NICE NG232; «Las fuentes leídas no tratan el masaje, la manipulación vertebral ni los deportes de contacto» deja de ser cierto; los huecos de `docs/farmacologia.md` (hemartros, síndrome compartimental, iliopsoas, vaina de los rectos, TAC, TVP) se rellenan o se reducen;
  - **el paso 3 de la farmacología** (chips «Familias que toma» de la fase 1) **debe reutilizar esta tarjeta** como la familia «anticoagulantes y antiagregantes», y no añadir un chip aparte.

## Formas posibles, de menos a más

| # | Forma | Qué añade | A favor | En contra |
|---|---|---|---|---|
| 0 | Nada nuevo | — | — | La app sigue sin preguntar el golpe en la cabeza ni el hematoma, con una casilla suelta en el lupus que decide el thrust |
| 1 | **Solo texto** | Una fila en la guía de condiciones, líneas en los razonamientos de `hem_1`, `hem_4`, `l6`, `em_u_tev` y en la guía de fármacos, y un recuadro en la fase 5 | Sin lógica nueva | No pregunta nada; las banderas de la cabeza y del hematoma no salen; la casilla del lupus sigue aislada |
| 2 | **Tarjeta sin sistema** | La tarjeta (qué toma), línea de la 4b, recuadro de la fase 5, avisos y red de la fase 6, y el tope «sin thrust» desde ella | Absorbe la casilla del lupus y el tope; mínimo código | **Sin preguntas**: las banderas que no están en ninguna región (cabeza, espinal, psoas, pared, compartimental) no se preguntan |
| 3 | **Tarjeta y sistema** *(recomendada)* | Lo anterior más `SIS_ANTICOAGULADO` en la fase 2 (6 urgencias y 1 derivación con fuentes) | Es lo que cambia la seguridad; mismo patrón que lupus, osteoporosis y embarazo | Una tarjeta y un sistema más |
| 4 | Forma 3 y reglas con otras tarjetas | Marcarla desde el lupus, el embarazo o el posquirúrgico | — | Sin base en las fuentes; va contra la decisión 14 del embarazo y la 5 de `docs/pots.md` |

## Forma recomendada (forma 3), en borrador

Mismos principios que las otras condiciones: capa transversal, el árbol CIF y el motor de puntuación no se tocan, el fisio no diagnostica ni prescribe, la seguridad nunca se recorta y marcar la tarjeta **nunca quita ni rebaja una `urgencia` de ningún sistema** (prueba unitaria en las 7 regiones).

### Fase 1 — tarjeta «Paciente anticoagulado o antiagregado» (`#cardAnticoagulado`)

- Va después de «Embarazo o posparto», antes de Cronología. No se pliega en modo breve.
- **Estado único**: No consta (por defecto) · **Toma** (un segundo toque desmarca). Sin «Sospecha» ni «Diagnosticado»: el fisio solo registra lo que el paciente toma.
- **Con «Toma», una fila de chips multiselección** (`selected` + `aria-pressed`, como las complicaciones de la cirugía), «¿Qué toma?»:
  - **Antivitamina K** (acenocumarol, warfarina);
  - **Anticoagulante directo** (apixabán, rivaroxabán, edoxabán, dabigatrán);
  - **Heparina** (en inyección);
  - **Aspirina**;
  - **Otro antiagregante** (clopidogrel, prasugrel, ticagrelor…);
  - **No lo sabe**.
- De los chips salen dos grupos derivados (`anticoagulante` = antivitamina K, directo o heparina; `antiagregante` = aspirina u otro) y la **doble antiagregación** (aspirina y otro antiagregante), que no se pregunta aparte. «No lo sabe» se trata como el caso más cauteloso (anticoagulante) **[propia]** para el tope y la pregunta de la cabeza (decisión 2).
- **Nota de la tarjeta** [propia]: «Márcala si toma anticoagulantes o antiagregantes, también si es solo por una operación o una trombosis reciente. No le digas que lo deje ni que se salte una dosis: las dudas, a quien se lo receta.» Sin motivo, fecha, INR ni nombres de fármaco en texto libre: ninguna de esas cosas cambia lo que hace la app.
- **Enlaces**: «Fármacos: anticoagulantes y antiagregantes» (la guía) y «Lupus»: si el lupus está diagnosticado, un recordatorio sin marcar nada.
- La clase `body.anticoagulado` muestra los elementos `.solo-ac` de las demás fases. Un cambio vacía la 4b y repinta el cribado.

### Fase 2 — sistema «Anticoagulado o antiagregado» (`SIS_ANTICOAGULADO`, `transversal_anticoagulado`, `soloAnticoagulado: true`)

- Octavo sistema de las 7 regiones, tras el de embarazo. Sin embudo en modo breve y no cuenta como «sistema sin cribar». Ids con el prefijo `ac_`. Cada pregunta tiene `ac` (`anticoagulante` / `antiagregante` / `cabeza` / `todos`) para la visibilidad.
- Las urgencias nunca se pliegan (`.sq2-urg`). Los textos son un borrador; **«hoy», «ya» y el 112 son redacción propia** (las fuentes hablan de manejo hospitalario y no dicen cuánta prisa tiene el fisio).

**A. Urgencias**

| id | Pregunta (borrador) | Se ve con | `urgencia` (borrador) | Fuente |
|---|---|---|---|---|
| `ac_u_cabeza` | ¿Se ha dado un golpe en la cabeza en los últimos días, aunque pareciera leve? | Anticoagulante, antiagregante distinto de la aspirina sola, o «no lo sabe» | Golpe en la cabeza con anticoagulante o antiagregante: que lo valore un servicio de urgencias hoy, aunque se encuentre bien; el sangrado puede aparecer días después. | NICE NG232, 1.2.3, 1.2.4, 1.5.13; Chenoweth 2018; Wiegele 2019 |
| `ac_u_cabeza_tardia` | Desde un golpe en la cabeza (de hace días o semanas): ¿tiene un dolor de cabeza fuerte o que va a más, vómitos repetidos, somnolencia, confusión o cambios de conducta, o debilidad, torpeza al hablar o cambios de visión nuevos? | Cualquier fármaco de la tarjeta | Posible sangrado intracraneal tardío: urgencias ya; 112 si está muy adormilado, confuso o con debilidad. | NICE NG232, 1.9.13, justificación de 1.10.6; Capsoni 2025; Chenoweth 2018 |
| `ac_u_espinal` | ¿Le ha empezado de golpe un dolor fuerte de cuello o de espalda con debilidad, hormigueo o adormecimiento en brazos o piernas, o cambios al orinar o al hacer de vientre? (Puede empezar por la debilidad, sin dolor fuerte.) | Anticoagulante o antiagregante | Posible hematoma epidural espinal: urgencias ya, 112; cuanto antes se opera, mejor. | Peng 2022; Albrecht 2024; Pozza 2023; Ghosh 2026 |
| `ac_u_psoas` | ¿Le ha empezado un dolor fuerte en la ingle, la cadera, el costado o la zona lumbar baja, con el muslo débil o adormecido, o con mareo, palidez o sudor frío? (Con un golpe pequeño o sin golpe.) | Anticoagulante | Posible hematoma profundo (del psoas o retroperitoneal): urgencias hoy; con mareo, palidez o tensión baja, 112. | Lukies 2023; Sahu 2020; Llitjos 2016; Mameli 2025 |
| `ac_u_pared` | ¿Le ha salido de golpe, tras toser, un esfuerzo o una inyección de heparina, un dolor fuerte en la pared de la barriga con un bulto, que empeora al mover o tensar el abdomen? | Anticoagulante | Posible hematoma de la vaina de los rectos: valoración médica hoy; con mareo o dolor que va a más, urgencias. | Ben Ismail 2026; Hideyama 2023; Liao 2021; Liu 2025 (hematoma de pared abdominal) |
| `ac_u_compartimental` | ¿Tiene un brazo, antebrazo, mano, muslo o pierna muy hinchado y tenso, con un dolor desproporcionado que va a más y que empeora al estirar pasivamente los dedos de la mano o del pie? (Tras un golpe pequeño, un esfuerzo o sin causa.) | Anticoagulante o antiagregante | Posible síndrome compartimental por sangrado: urgencias ahora; no hay que esperar a que falten el pulso o el movimiento. | Brooker 2020; Nemunaitis 2022; Ogrodnik 2021; Kim 2026 |

- `ac_u_espinal` se cruza con `l6` (cola de caballo), `op_u_medula` y `pq_nervio_col`; `ac_u_compartimental` con `pq_compart`. **No se repiten ni se sustituyen**: cada una lleva en su razonamiento la referencia a las otras, y las dos pueden estar en SÍ.
- El golpe en la cabeza de quien toma **solo aspirina** no sale en `ac_u_cabeza` (NICE NG232, 1.2.4 la excluye); su razonamiento lo dice y recuerda que el comité admite el alta sin TC tras decidirlo con la persona.
- **TVP, TEP y sangrado digestivo**: ya están en `r_v2`, `l_v4`, `pq_tvp`, `em_u_tev`, `hem_4` y la pregunta de AINE; no se repiten.

**B. Derivación no urgente** (`derivacion`; va a `dv[]` y no bloquea la fase 6)

| id | Pregunta (borrador) | `derivacion` (borrador) | Fuente |
|---|---|---|---|
| `ac_d_hematoma` | ¿Tiene un hematoma grande o que crece, un bulto nuevo en un músculo, o una articulación hinchada tras un golpe pequeño o sin golpe? | Valoración médica pronto: un hematoma que no se resuelve en 2–3 semanas, de más de 5 cm o profundo, o con dolor que persiste, hay que estudiarlo; una articulación hinchada con anticoagulante puede ser un hemartros, y ante la duda se aspira para descartar infección. Si hay fiebre, calor y rojez, ya hay otra pregunta urgente. | Mameli 2025 (ya en la app); Dalrymple 2022 |

Cada pregunta lleva su `razonamiento` (Fase F) y cada bandera, su enlace (Fase M). **No hay bloque de preguntas con respuestas guardadas** (ni cuestionario, ni caídas, ni INR): el sistema solo tiene preguntas de SÍ/NO.

### Fases 3 y 4

**Sin cambios.** Las fuentes no dicen que los antitrombóticos cambien la irritabilidad ni el árbol.

### Fase 4b — una línea general, sin tocar las LR

Con la tarjeta marcada, una línea encima de las hipótesis (`.ac-nota-4b`), como las de lupus y mastocitos. Sin campo por test: ninguna fuente dice qué tests sangran, y las pruebas de provocación casi nunca son la causa. Borrador:

> «Anticoagulado o antiagregado: precaución con lo que tenga riesgo de golpe (Blaess 2024, rec. 3); un esfuerzo mecánico pequeño puede dar un sangrado importante (Kim 2026, un caso). Si durante la exploración aparece un dolor desproporcionado, una hinchazón tensa o un hematoma que crece, para y deriva.»

La última frase es redacción propia, apoyada en Brooker 2020. Con el lupus diagnosticado, esta línea **sustituye** la `tecnica4bAntitrombotico`, para que no salgan dos.

### Fase 5 — recuadro «Anticoagulado o antiagregado» (`.ac-fase5`, nunca se pliega)

Al principio, junto a los recuadros de las otras condiciones. Cada línea, pegada a su fuente; lo que no tiene fuente lo dice.

- **Qué toma**: «antivitamina K · aspirina».
- **Siempre (lo médico)**: «No sugieras dejar el anticoagulante ni saltarse una dosis: se asocia a más ictus y muerte (Salmasi 2020), y la guía EHRA pide no saltarse ninguna sin consultar (Steffel 2021). Las dudas, a quien lo receta.» (Las dos fuentes ya están en la guía de fármacos.)
- **Siempre (golpe en la cabeza)**: la línea de NICE NG232 (1.2.4) con la que se pregunta en la fase 2, y el consejo de acompañante de 24 h y de que puede aparecer después (1.10.9). El golpe y los síntomas tardíos salen aquí aunque no se haya contestado nada.
- **Con anticoagulante (técnica manual)**: «El thrust: la única tabla específica lo pone como contraindicación absoluta en la columna torácica (Puentedura 2015, tabla 1), y otra, opinión de los autores, como precaución en la cervical (Hutting 2018). Un estudio de cohorte lo asocia a más lesión cerebral o medular, sin probar causa (Whedon 2015). De la movilización, el masaje y los estiramientos no hay ninguna norma: solo casos de sangrado tras ellos (Kim 2026; Tominaga 2023; Kwon 2024).»
- **Con antiagregante solo**: «Ninguna fuente de manipulación lo trata como contraindicación. Precaución con lo que tenga riesgo de golpe (Blaess 2024, rec. 3).»
- **Punción seca**: «No existe ningún estudio de punción seca con antitrombóticos. Una revisión narrativa y un consenso de expertos que depende de ella dicen que no es una contraindicación absoluta (Muñoz 2022; Waterway 2026); la guía suiza, de segunda mano, sí para la anticoagulación (Malfait 2024). Práctica de los autores de Muñoz 2022: empezar por músculos superficiales y comprimir 10–15 s; evitar al principio los profundos que no se pueden comprimir. Sin INR límite.»
- **Ondas de choque**: «Sin consenso entre expertos sobre aplicarlas con anticoagulantes; el hematoma es un efecto posible (Rhim 2025). Consideración importante y sin datos con anticoagulados (Tenforde 2022).»
- **Ejercicio**: «Los deportes de bajo riesgo de golpe, bien; los de colisión, desaconsejados, y es decisión del médico (consenso de expertos: Minardi 2024; Bavishi 2026; en deportistas de competición, la tabla 3 de Kim 2025: con aspirina sola sin límite, y con doble antiagregación o anticoagulante los deportes de colisión o impacto de alta velocidad, desaconsejados o a decidir con el médico). Tras una embolia pulmonar el ejercicio es seguro (Xiang 2025) y, tras una TVP, caminar pronto no aumentó la embolia en los estudios (Liu 2015, con reservas). Ninguna fuente da intensidad ni carga.»
- **Caídas**: «No retirar el anticoagulante solo por el riesgo de caídas (NICE NG196, 1.6.8); entrenar equilibrio y fuerza, y revisar la medicación con su médico (Mitchell 2023). No hay evidencia de que el ejercicio de equilibrio reduzca el sangrado por caídas.»
- **Banderas de sangrado**: la lista de las preguntas de la fase 2 (espinal, psoas, pared, compartimental, hematoma que no se resuelve) con su fuente.
- **Con heparina inyectable**: «Los moratones en el punto de inyección son frecuentes (Amaniyan 2020, de segunda mano); un dolor nuevo e intenso en la pared de la barriga no lo es (Liu 2025 (hematoma de pared abdominal), un caso).»
- **Con AINE, ISRS o corticoides a la vez**: «Aumentan el riesgo de sangrado (NICE NG196, 1.2.3; Nochaiwong 2022): coméntalo con quien los receta.» Nunca «cámbialo».

### Fase 6 — plan de tratamiento

- **Aviso `anticoagulado`** en todas las regiones, con la línea de la 4b y la de la técnica de la fase 5.
- **Tope «sin thrust»** (decisión 4): con anticoagulante (incluido «No lo sabe»), `motivosSinThrust()` devuelve `'anticoagulante'` y el plan saca `sinThrustAnticoagulante`, que cita Puentedura 2015 (tabla 1) y dice que Hutting 2018 (opinión de los autores) lo trata como precaución en la cervical. Los escalones nunca proponen grado V, así que el tope es el aviso. Con antiagregante solo, el aviso de precaución, sin tope.
- **Avisos por hipótesis** (`AVISOS_HIP`, por id, con listas que fija una prueba unitaria): `anticoaguladoPuncion` para las hipótesis cuya pauta **recomienda** la punción seca y `anticoaguladoOndas` para las de las ondas de choque (4); las listas se hacen a mano, porque varias pautas solo la mencionan para desaconsejarla.
- **Antes de cada técnica** [propia]: «Pregunta si desde la última sesión se ha dado un golpe o ha notado un hematoma o un dolor nuevos.»
- **Red de seguridad `RED_ANTICOAGULADO`** (con cualquier plan y la tarjeta marcada), para el cierre de la sesión y el programa para casa (borrador, redacción propia sobre las fuentes de las urgencias): «Si te das un golpe en la cabeza, aunque te encuentres bien, ve hoy a urgencias; si en los días siguientes tienes un dolor de cabeza fuerte que va a más, vómitos, somnolencia o confusión, llama al 112. Si te empieza de golpe un dolor fuerte de cuello o espalda con debilidad, hormigueo o cambios al orinar, urgencias ya. Un dolor muy fuerte en la ingle, la cadera o la barriga con mareo, o un brazo o una pierna muy hinchados, tensos y con un dolor desproporcionado, también. No dejes ni te saltes tu anticoagulante sin hablarlo antes con tu médico.»
- **No cambian** el nivel A/B/C, la frecuencia ni la irritabilidad. Con un SÍ urgente del sistema, la fase 6 se bloquea como con cualquier urgencia; la derivación no.

### Salidas

- **Payload `ac`**, solo con la tarjeta marcada (la huella de los informes con IA anteriores no cambia): `{ es, ti }` (estado, `ti` = lista de `['vk','do','hp','as','oa','ns']`). Las urgencias van a `ur[]` y la derivación a `dv[]`. **`le.at`** se deriva de la tarjeta (compatibilidad con physiq-report).
- **📋 Notas**: «🩸 ANTICOAGULADO/ANTIAGREGADO: antivitamina K · aspirina».
- **📄 Informe**: en antecedentes, «Tratamiento anticoagulante (antivitamina K)» o «Tratamiento antiagregante»; **sin** nombres de fármaco ni recomendaciones de técnica, que son del fisio. Las derivaciones salen como siempre.
- **Informe con IA**: bloque `bloqueACIA()` en `contextoValoracion()`, sin citas, con «no sugieras suspender ni ajustar el tratamiento; no atribuyas los síntomas del paciente al fármaco sin que el fisio lo haya dicho». `lib/reglas-informe.js` no se toca. physiq-report lo leería con una copia literal (`_bloqueAC`; `AC_CASOS` fija el texto en los dos repositorios), en otra PR.
- **Modo breve**: «qué toma» sin registrar con la tarjeta marcada es un pendiente (`ancla: 'cardAnticoagulado'`), porque decide la regla de la cabeza y el tope. Las urgencias se ven siempre.

### Guía de condiciones especiales

Una fila, después del embarazo o posparto:
- **Nombre**: «Paciente anticoagulado o antiagregado».
- **Qué es** (redacción propia): «Quien toma fármacos para que la sangre no coagule o las plaquetas no se peguen: sangra con más facilidad y un golpe o una técnica pueden dar un hematoma que no se ve.»
- **Piensa en ella si**: toma acenocumarol, warfarina, apixabán, rivaroxabán, edoxabán, dabigatrán o heparina; toma aspirina, clopidogrel, prasugrel o ticagrelor; le han puesto inyecciones de heparina tras una operación o una trombosis.
- **Añade**: la pregunta del golpe en la cabeza y de los hematomas en la fase 2, la línea de técnica de las fases 4b, 5 y 6, y la red de seguridad del plan.
- **Fuentes**: NICE NG232 · Steffel 2021 · Muñoz 2022.

## Cambios técnicos previstos (si se aprueba la forma 3)

```js
anticoagulado: {
  estado: '',          // '' (no consta) | 'toma'
  toma: [],            // subconjunto de ['vk', 'do', 'hp', 'as', 'oa', 'ns']
                       // vk = antivitamina K, do = anticoagulante directo, hp = heparina,
                       // as = aspirina, oa = otro antiagregante, ns = no lo sabe
}
```

- `lib/anticoagulado.js` (puro, con pruebas unitarias en `tests/unit/anticoagulado.mjs`): estado vacío y normalizado, `esAnticoagulante()`, `esAntiagregante()`, `dobleAntiagregacion()`, visibilidad (`elementoACVisible()`: la pregunta de la cabeza con anticoagulante, antiagregante distinto de la aspirina sola o «no lo sabe»), payload `ac`, textos de 📋 Notas, 📄 Informe e IA (`bloqueACIA()`), pendientes del modo breve y migración de `lupus.antitrombotico`.
- `SIS_ANTICOAGULADO` en `data/comun.js`, en las 7 regiones (después de `SIS_EMBARAZO`), con razonamiento y banderas enlazadas a su pregunta (Fase M); `sistemasActivos()` lo filtra con `soloAnticoagulado` y `elementoACVisible`, y el embudo de `app.js` lo excluye (como `soloEmbarazo`).
- **Lupus**: se quita la casilla del `CASILLAS_LES` de `lib/lupus.js`, se deja la línea con el enlace y `lePayload()` toma `at` de la tarjeta nueva.
- **`motivosSinThrust(op, lupus, ac)`** (`lib/osteoporosis.js`) y el aviso `sinThrustAnticoagulante`; `construirPlan()` toma `anticoagulado`.
- `AVISOS_ANTICOAGULADO`, `RED_ANTICOAGULADO` y las listas por hipótesis en `data/plan-tratamiento.js`; después, `node tests/gen-frases-plan.mjs`.
- La fila en `data/condiciones.js` (una prueba unitaria falla si un `transversal_*` con `soloX: true` no tiene fila).
- **Guía de fármacos**: `abrirFarmacos({ familia: 'antitromboticos' })` y la actualización de los textos (otra revisión del usuario).
- Las referencias en `data/referencias.js`; después, `node tests/gen-referencias.mjs`.
- `_softResetApp()`, la restauración de sesión, exportar e importar, y `deploy-to-hub.yml` para `lib/anticoagulado.js`.
- **Pruebas**: nada sin la tarjeta; marcar la tarjeta (con todos los chips) no quita ni rebaja ninguna `urgencia` de ningún sistema en las 7 regiones; `ac` solo con la tarjeta; `le.at` coincide con la tarjeta; la regla de la cabeza por fármaco (aspirina sola no, clopidogrel sí, «no lo sabe» sí); el tope «sin thrust» solo con anticoagulante; las listas de hipótesis de punción seca y ondas de choque; la sesión antigua con la casilla del lupus migra; ninguna línea de este recuadro llega al payload ni a los resúmenes salvo lo previsto; el inventario de banderas de los sistemas compartidos; `AC_CASOS`; sección `anticoagulado` de la prueba de humo (tarjeta con sus chips, el sistema, las urgencias, la línea de la 4b, el recuadro de la fase 5, el aviso y la red de la fase 6, 320 px y el hub).

## Fuera de este diseño (apuntado, no resuelto)

- **Un INR o una fecha** de control en la tarjeta: ninguna fuente le da uso al fisio.
- **El motivo del tratamiento** (fibrilación auricular, válvula mecánica, stent, TVP, ictus, síndrome antifosfolípido): no cambia lo que hace la app, que ya dice que nunca se aconseja dejarlo.
- **Una lista de deportes** permitidos y desaconsejados: Kim 2025 la da para deportistas de competición, pero la app no es de competición; se cita la regla, no se copia la lista (decisión 13).
- **Una pregunta de hemartros propia**: el hemartros ya se cubre con `ac_d_hematoma`, la artritis séptica y la pregunta de rodilla.
- **Qué hacer si el paciente sangra en la sesión** (compresión local, a quién llamar): ninguna fuente leída lo da para el fisio; Tran 2025 solo trata el sangrado «significativo» desde el médico.
- **Otros sangrados** (epistaxis, hematuria, hemoptisis, hemorragia ocular, sangrado ginecológico): ya los recoge `hem_4` y la lista de Bahit 2017 va solo al razonamiento.
- **Un bloque de caídas propio** con las preguntas de NICE NG249: ver decisión 14.
- **El paso 3 de la farmacología**: debe reutilizar esta tarjeta (ver «Relaciones»).

## Decisiones (cada una con mi recomendación)

**Aceptadas por el usuario las 20 recomendaciones (2026-10).** La 4 cambia lo que hoy hace la casilla del lupus (el tope «sin thrust» deja de aplicarse al antiagregante solo); la 3 absorbe esa casilla en la tarjeta nueva.

1. **¿Entra, con documento propio, y qué forma?** *Recomiendo* sí y la forma 3 (tarjeta y sistema). *Alternativa*: la forma 2, sin sistema (perdería las banderas, que son lo que ninguna región pregunta hoy).
2. **La tarjeta**: estado único «Toma» y una fila de chips multiselección (antivitamina K, anticoagulante directo, heparina, aspirina, otro antiagregante, no lo sabe), sin motivo, INR ni nombres. «No lo sabe» se trata como anticoagulante. *Recomiendo* esto. *Alternativa*: añadir «motivo» y «desde cuándo» (más lento y sin efecto medible) o tratar «no lo sabe» solo como dato.
3. **La casilla del lupus**: *recomiendo* una única fuente de datos, la tarjeta nueva, con enlace desde el lupus, `le.at` derivado y migración de las sesiones antiguas. *Alternativa*: dos casillas independientes.
4. **El tope «sin thrust» de la fase 6**: *recomiendo* aplicarlo solo con el **anticoagulante** (Puentedura 2015, tabla 1), con su contradicción dicha en el texto, y dejar el antiagregante solo con el aviso de precaución (Blaess 2024). **Esto cambia el comportamiento actual de la casilla del lupus**, que hoy aplica el tope también al antiagregante. *Alternativa*: mantener el tope con cualquier antitrombótico (como hoy) o quitarlo del todo y dejar solo la precaución (la evidencia es de nivel muy bajo).
5. **El texto del thrust**: *recomiendo* decir que la única tabla específica (columna torácica, absoluta, de una fuente no disponible) y la de consenso (cervical, precaución), y que ninguna distingue entre fármacos ni da un INR; «precaución» para lo cervical y las demás regiones, marcado como extrapolación fuera de la torácica. *Alternativa*: sin matices («contraindicado»).
6. **Las dos preguntas del golpe en la cabeza** (`ac_u_cabeza` con la regla de NICE y `ac_u_cabeza_tardia` con los síntomas), con «hoy» y «ya/112» como redacción propia. *Recomiendo* esto. *Alternativa*: una sola pregunta; o `derivacion` en vez de `urgencia` para quien toma aspirina sola (con NICE, esa persona ni se pregunta).
7. **La urgencia del hematoma epidural espinal** (`ac_u_espinal`) con «urgencias ya» sin cifra de horas, y su relación con `l6`, `op_u_medula` y `pq_nervio_col` solo en el razonamiento. *Recomiendo* esto.
8. **Hematoma del psoas y de la pared abdominal** como dos urgencias (`ac_u_psoas` «hoy», `ac_u_pared` «hoy»), con el 112 solo con signos de shock (redacción propia). *Recomiendo* esto. *Alternativa*: fundirlas en una pregunta (menos preguntas, peor para marcar cuál es).
9. **Síndrome compartimental** (`ac_u_compartimental`, «ahora») en las 7 regiones, sin umbrales de presión. *Recomiendo* esto; `pq_compart` queda como está.
10. **Hematoma que no se resuelve o articulación hinchada** como una sola `derivacion` (`ac_d_hematoma`), sin pregunta de hemartros aparte (la artritis séptica y la de rodilla ya existen). *Recomiendo* esto.
11. **Fase 4b**: una línea general, sin campo por test y con la última frase como redacción propia. *Recomiendo* esto. *Alternativa*: nada.
12. **Punción seca, ondas de choque, presión profunda y estiramientos**: *recomiendo* **solo texto** (recuadro de la fase 5 y avisos de la fase 6 por hipótesis, con las listas fijadas por una prueba), diciendo que no hay estudios y quién se contradice, y sin ninguna regla automática ni INR. *Alternativa*: un tope «sin punción seca» con anticoagulante, apoyado en una guía suiza que no se ha leído y que Muñoz 2022 y Waterway 2026 contradicen. El Delphi de Rhim 2025 no alcanzó consenso sobre las ondas de choque con anticoagulantes, así que tampoco hay base para un tope ahí.
13. **Ejercicio y deporte**: *recomiendo* **solo texto**: la regla de Kim 2025 (aspirina sola sin límite; doble antiagregación o anticoagulante, no los deportes de colisión o impacto de alta velocidad; solo para deportistas de competición; sin definir qué anticoagulantes son «plenos»), sin copiar su lista de deportes ni la tabla propia de Bavishi 2026, y sin nada de BFR (ninguna fuente lista los antitrombóticos). *Alternativa*: no decir nada de deporte.
14. **Caídas**: *recomiendo* **solo texto** (no retirar el anticoagulante por las caídas, entrenar equilibrio y fuerza, sin prometer que baje el sangrado). *Alternativa*: mostrar con las dos tarjetas el bloque de caídas de NICE NG249 que ya existe en la osteoporosis (más código y un acoplamiento entre tarjetas).
15. **Guía de fármacos y paso 3**: *recomiendo* enlazar la guía desde la tarjeta (con la pequeña ampliación de `abrirFarmacos()`), actualizar su texto de los antitrombóticos en otra revisión tuya y que el paso 3 reutilice esta tarjeta como la familia «anticoagulantes y antiagregantes».
16. **Diferencias entre fármacos**: *recomiendo* limitarlas a las cuatro que las fuentes justifican (la regla de la cabeza distingue la aspirina sola; el tope solo con anticoagulante; la frase del deporte con la aspirina sola; «el INR no mide a los anticoagulantes directos») y **no dar ningún INR**. *Alternativa*: añadir «INR en rango» como dato de la tarjeta (sin fuente que lo ligue a ninguna regla).
17. **Salidas**: payload `ac` (`{ es, ti }`), 📋 Notas, 📄 Informe sin recomendaciones, bloque de IA sin citas, pendiente del modo breve y la copia `_bloqueAC` en physiq-report en otra PR. *Recomiendo* esto.
18. **Registro**: solo las referencias que use el texto final. Nuevas propuestas: `NICE NG232`, `NICE NG196`, `Chenoweth 2018`, `Wiegele 2019`, `Capsoni 2025`, `Puzio 2021`, `Mitchell 2023`, `Peng 2022`, `Albrecht 2024`, `Pozza 2023`, `Sahu 2020`, `Lukies 2023`, `Llitjos 2016`, `Liao 2021`, `Ben Ismail 2026`, `Hideyama 2023`, `Liu 2025 (hematoma de pared abdominal)`, `Amaniyan 2020`, `Dalrymple 2022`, `Brooker 2020`, `Nemunaitis 2022`, `Ogrodnik 2021`, `Bahit 2017`, `Tran 2025`, `Whedon 2015`, `Hutting 2018`, `Chen 2019`, `Cooper 2019`, `Kim 2026`, `Tominaga 2023`, `Kwon 2024`, `Cheatham 2025`, `Waterway 2026`, `Malfait 2024`, `Tenforde 2022`, `Rhim 2025`, `Uson 2021`, `Witt 2016`, `Kim 2025`, `Minardi 2024`, `Bavishi 2026`, `Liu 2015`, `Colombo 2021`, `Yin 2019`, `Lee 2024`. Reusadas: `Puentedura 2015`, `Muñoz 2022`, `Mameli 2025`, `Ghosh 2026`, `Steffel 2021`, `Salmasi 2020`, `Nochaiwong 2022`, `Xiang 2025`, `Blaess 2024`, `Tektonidou 2019`, `Rushton 2023`, `NICE NG158`, `NICE NG89`, `NICE NG249`. **Claves que chocan** con otras ya registradas: `Liu 2025` (se llamará `Liu 2025 (hematoma de pared abdominal)`) y `Wang 2020` (si se usa la de anticoagulantes directos, `Wang 2020 (sangrado con anticoagulantes directos)`).
19. **Relación con las otras tarjetas**: *recomiendo* **ninguna regla automática** (posquirúrgico, embarazo, osteoporosis, lupus, hipermovilidad, mastocitos); solo textos y enlaces.
20. **Los PDF**: los tres primeros (Hutting 2018, Kim 2025 y Rhim 2025) **ya están leídos**; los demás de «PDF que necesito» son opcionales y sin ellos se puede implementar con lo leído.

## PDF que necesito

En el entorno solo llegan PMC, NICE y NCBI Bookshelf (que pide reCAPTCHA); las editoriales (Elsevier, OUP, AHA) están bloqueadas. Recibidos y leídos: Hutting 2018, Kim 2025 y Rhim 2025 (ver «Lectura de los PDF (tanda 1)»). Los que faltan, por orden de utilidad:

| # | Fuente | Enlace | Para qué |
|---|---|---|---|
| 1 | ~~Corrección (tanda 2): el DOI de 2025 que figuraba aquí es de la guía ASRA de anestesia regional (Kopp 2025, 5.ª ed.), no de esta; leída igualmente.~~ **Narouze S, et al.** ASRA, *Interventional spine and pain procedures in patients on antiplatelet and anticoagulant medications* (2.ª ed.). *Reg Anesth Pain Med* 2018;43(3):225–262 | [doi:10.1097/AAP.0000000000000700](https://doi.org/10.1097/AAP.0000000000000700) | Riesgo de las infiltraciones y las punciones profundas por fármaco; la versión de 2025 (Kopp SL et al., [doi:10.1136/rapm-2024-105766](https://doi.org/10.1136/rapm-2024-105766)) sería la actual |
| 2 | **Van Gelder IC, et al.** 2024 ESC Guidelines for the management of atrial fibrillation. *Eur Heart J* 2024 | [doi:10.1093/eurheartj/ehae176](https://doi.org/10.1093/eurheartj/ehae176) | Caídas y anticoagulación, INR y actividad física con la guía de referencia (hoy solo NICE NG196) |
| 3 | **Pelliccia A, et al.** 2020 ESC Guidelines on sports cardiology and exercise in patients with cardiovascular disease. *Eur Heart J* 2021 | [doi:10.1093/eurheartj/ehaa605](https://doi.org/10.1093/eurheartj/ehaa605) | Lo que dice sobre el deporte de contacto con anticoagulación y el ejercicio |
| 4 | **Kakkos SK, et al.** ESVS 2021 Clinical Practice Guidelines on the management of venous thrombosis. *Eur J Vasc Endovasc Surg* 2021 | [doi:10.1016/j.ejvs.2020.09.023](https://doi.org/10.1016/j.ejvs.2020.09.023) | Movilización y compresión tras una TVP, que NICE NG158 no trata |
| 5 | Revisiones de hematoma espinal espontáneo en quien toma antiagregantes o anticoagulantes: *World Neurosurg* 2024 ([PMID 38278210](https://pubmed.ncbi.nlm.nih.gov/38278210/)) y el metaanálisis pronóstico de *Neurosurg Rev* 2022 ([PMID 36538111](https://pubmed.ncbi.nlm.nih.gov/36538111/)) | | El plazo para operar (contradicción 5) y los antiagregantes |
| 6 | **Hawk C, et al.** Best practices for chiropractic care for older adults. *J Manipulative Physiol Ther* 2017;40(4):217–229, y **Kranenburg HA, et al.** *Musculoskelet Sci Pract* 2017;28:32–38 | [doi:10.1016/j.jmpt.2017.02.001](https://doi.org/10.1016/j.jmpt.2017.02.001); [doi:10.1016/j.msksp.2017.01.008](https://doi.org/10.1016/j.msksp.2017.01.008) | Si dan una recomendación con grado sobre los anticoagulantes y la manipulación (opcionales) |
| 7 | **Boulias C, et al.** Delphi de la toxina botulínica en pacientes anticoagulados. *Arch Phys Med Rehabil* 2018;99:2183–2189 | [doi:10.1016/j.apmr.2018.04.023](https://doi.org/10.1016/j.apmr.2018.04.023) | El único consenso de infiltración intramuscular con INR, aguja y ecografía (opcional) |
| 8 | Guía suiza de punción seca segura (Bachmann 2014) y el documento de la APTA sobre la punción seca ([myopainseminars.com, PDF](https://www.myopainseminars.com/wp-content/uploads/2022/02/DryNeedling_ClinicalPracticeEducationalResourcePaper1.pdf)) y las guías de seguridad de la AACP (2017) | | La formulación literal de «abnormal bleeding tendency» y si la anticoagulación es absoluta o relativa (decisión 12; opcionales) |
| 9 | **Schulman S, Kearon C** (J Thromb Haemost 2005;3:692–694) y **Kaatz S, et al.** (J Thromb Haemost 2015, [PMID 26764429](https://pubmed.ncbi.nlm.nih.gov/26764429/)) | | Las definiciones originales de sangrado mayor y clínicamente relevante no mayor (opcionales) |

## Siguiente paso

1. ~~Tus decisiones (1–20)~~ Hecho: aceptadas las 20 recomendaciones (2026-10).
2. ~~Los PDF 1–3 (Hutting 2018, Kim 2025, Rhim 2025)~~ hecho; los demás de «PDF que necesito» son opcionales.
3. ~~La implementación~~ hecha (ver «Implementación») y revisada por el usuario en la app (2026-10). La actualización de la guía de fármacos va aparte, con su propia revisión.
4. physiq-report: leer `ac` del payload, en otra PR.

## Implementación (2026-10)

Hecha según la forma 3 y las 20 decisiones aceptadas. Revisada por el usuario en la app (2026-10).

- **Datos**: `SIS_ANTICOAGULADO` en `data/comun.js` (octavo sistema de las 7 regiones, tras el embarazo), con las 6 urgencias y la derivación de la tabla, su `razonamiento` (Fase F) y sus banderas enlazadas (Fase M); `anticoagulado.tipos` (los chips) y `anticoagulado.textos` (nota, línea de la 4b, líneas de la fase 5). Las referencias nuevas, en `data/referencias.js`.
- **Lógica pura**: `lib/anticoagulado.js` (grupos, visibilidad, migración de la casilla del lupus, pendiente, payload `ac`, textos de 📋 Notas, 📄 Informe e IA).
- **Fase 1**: `#cardAnticoagulado`, después del embarazo; enlace «Fármacos: anticoagulantes y antiagregantes» (`abrirFarmacos({ familia: 'antitromboticos' })`, que abre la guía con esa familia desplegada). En la tarjeta del lupus, la casilla se sustituye por una línea con «Ir a la tarjeta →».
- **Fase 4b**: `.ac-nota-4b`; la frase del anticoagulante del lupus (`tecnica4bAntitrombotico`) desaparece.
- **Fase 5**: `.ac-fase5`, nunca plegado.
- **Fase 6**: avisos `anticoagulado`, `anticoaguladoPuncion` y `anticoaguladoOndas`, `sinThrustAnticoagulante`, `RED_ANTICOAGULADO`; `sinThrustLupus` queda solo para los corticoides y `lupusAntitrombotico` desaparece.
- **Listas por hipótesis** (decisión 12), leídas en las pautas: punción seca en `h6`, `ce1`, `ce7`, `ce14` (JOSPT de cuello, B), `lu9` (C), `co1` (B), `ca1` (APTA 2025, A), `ca15` (NICE NG193, 1.2.5) y `tp26` (B); ondas de choque en `h2` (tendinopatía calcificada, C), `ca9` (el grupo de comparación del ensayo), `ca19` y `ro6`. Fuera, porque solo la nombran para no ofrecerla: `h10`, `ro1`, `ro3`, `tp24`. Una prueba unitaria falla si una pauta nueva nombra cualquiera de las dos sin estar en una lista.
- **Redacción propia** (marcada así en el diseño y aceptada): la última frase de la línea de la 4b, «Antes de cada técnica, pregunta…» del aviso de la fase 6, el texto de la red de seguridad (con sus fuentes en `TEXTOS_CASA.alarmaAnticoagulado.fuente`), «hoy», «ya» y el 112 de las urgencias, y «No lo sabe» tratado como anticoagulante.
- **Referencias del diseño que no se citan en la app**: Ben Ismail 2026, El Mraiedh 2026 y Liu 2025 (hematoma de pared abdominal) se quedaron fuera del texto de `ac_u_pared` porque el detector de citas de `tests/referencias.mjs` no reconoce apellidos compuestos y `Liu 2025` ya es otra clave del registro; la pregunta se apoya en Liao 2021, Hideyama 2023, Yale 2020 y Amaniyan 2020. Pozza 2023 tampoco entra en `ac_u_espinal` (la apoyan Peng 2022, Albrecht 2024 y Ghosh 2026).
- **Pruebas**: `tests/unit/anticoagulado.mjs` (sistema, visibilidad por fármaco, seguridad de las urgencias de los demás sistemas, tope, lupus y migración, payload, resúmenes, fase 5, fase 6, listas, modo breve, `AC_CASOS`) y la sección `anticoagulado` de `tests/smoke.mjs`.
- **physiq-report**: `_bloqueAC` en physiodevapp/physiq-report#97. **Guía de fármacos**: ampliada con estas fuentes y revisada por el usuario (2026-10).

## Lectura de los PDF (tanda 2, octubre 2026)

PDF del usuario, leídos enteros por seis lectores (sin las listas de referencias); yo comprobé en el texto cada cita que usa la app. Todo aceptado por el usuario (2026-10). **No cambian el payload `ac` ni `bloqueACIA()`** (`AC_CASOS` igual): solo el recuadro de la fase 5, dos razonamientos de la fase 2 y dos avisos de la fase 6.

| Fuente | Lo que aporta | Dónde va |
|---|---|---|
| `Pelliccia 2020` (guía ESC de cardiología del deporte) | Con anticoagulante por fibrilación auricular, deportes de contacto directo o con riesgo de traumatismo «not recommended», de competición o no (clase III; nivel A en la tabla de la sección, C en la resumen); con doble antiagregación, «should avoid sports with bodily collision». Nada de heparina, TVP ni válvulas mecánicas | X1, `deporte` (fase 5) |
| `van Gelder 2024` (guía ESC de fibrilación auricular) | «Bleeding risk factors are rarely a reason to withdraw or withhold OAC»; el exceso de alcohol como factor de sangrado; programa de ejercicio adaptado (I B) sin dosis. **No habla de caídas** | X2 `caidas` y `otrosFarmacos`; X3 `ejercicio` |
| `Kakkos 2021` (guía ESVS de trombosis venosa) | Tratamiento ambulatorio (rec. 13, I A); compresión 30–40 mmHg en 24 h (rec. 31, I A); medias por debajo de la rodilla contra el síndrome postrombótico (rec. 32, IIa A); sin compresión con arteriopatía grave o insuficiencia cardiaca grave. Sin pautas de ejercicio | X4, línea nueva `trasTVP` (fase 5) |
| `Vastani 2023`, `Kumar 2024` (hematoma espinal espontáneo) | Antes de 12 h, mejor resultado (OR 2,44, P = 0,006), sin otros plazos; el 19 % sin dolor de espalda al empezar; los antiagregantes no fueron factor de riesgo en Vastani (27 % en Kumar, sin grupo de comparación) | X5, razonamiento de `ac_u_espinal`; la pregunta sigue con cualquier antitrombótico (`ac: 'todos'`) |
| `Kopp 2025` (guía ASRA de anestesia regional) | Bloqueos superficiales sin suspender el fármaco; profundos no compresibles como los neuroaxiales (I C). No habla de punción seca | X6, `puncion` (por analogía, dicho así) |
| `APTA 2013` (punción seca) | Anticoagulación entre las **precauciones** («must be needled with caution»), no contraindicaciones; evitar los profundos no compresibles (psoas, pterigoideo lateral) | `puncion` y aviso `anticoaguladoPuncion` |
| `Boulias 2018` (Delphi de toxina botulínica) | INR ≤ 3,5 en la pierna profunda, aguja ≤ 25 G; no suspender ni ajustar el anticoagulante. Es inyección, no punción seca | `puncion` y aviso `anticoaguladoPuncion` («sin INR límite» para la punción seca) |
| `Hawk 2017` (consenso de quiropráctica en mayores) | Informar del riesgo de moratón o sangrado antes de las técnicas de partes blandas con anticoagulantes (≥ 80 %, sin grado). Nada sobre el thrust | `tejidosBlandos` y aviso `anticoagulado` |
| `Schulman 2005`, `Kaatz 2015` (definiciones de la ISTH) | El sangrado articular con síntomas es sangrado mayor en los ensayos; el clínicamente relevante no mayor, el que lleva a una valoración en persona | razonamiento de `ac_d_hematoma` (la derivación no cambia) |
| Kranenburg 2017 | Sin ninguna mención de anticoagulantes; no se cita | — |

**Fuera de este cambio**: la trombosis del brazo por esfuerzo (Paget-Schroetter) y la trombosis superficial (un 25 % ya llega al sistema profundo al diagnosticarla, Kakkos 2021): encajarían en el cribado vascular de hombro y de las regiones de la pierna, en otra sesión.

## Tanda 3 (octubre 2026): ejercicio tras una TVP

Origen: la propuesta del bloque 10 de la guía de ejercicio (`docs/efectos-ejercicio.md`, «Bloque 10 — propuesta» y «Bloque 10 — decisión»). El bloque no se hace, y sus recomendaciones 2 y 3 cambian esta tarjeta. **No cambian el payload `ac` ni `bloqueACIA()`** (`AC_CASOS` igual), ni la fase 2, ni ninguna regla: solo dos textos. Pendiente de revisión del usuario.

| Fuente | Lectura | Lo que aporta | Dónde va |
|---|---|---|---|
| `Jasionowska 2022` (revisión sistemática del ejercicio en el síndrome postrombótico) | Entera en PMC (PMC9720701), cada cita comprobada | Un solo ensayo (Kahn 2011, 39 personas, TVP de media hace 3–4 años): calidad de vida +4,6 (IC 0,54–8,7), gravedad −2,0 (IC −4,6 a 0,6), sin efectos adversos; certeza muy baja | `trasTVP` |
| `Cosmi 2022` (consenso VAS del síndrome postrombótico) | Entera en PMC (PMC8907532) | Medias apropiadas para prevenir tras TVP iliofemoral o poplítea, con estudios que se contradicen; en la de la pantorrilla, solo para los síntomas. Opinión de expertos | `trasTVP` |
| `Steiner 2026` (revisión sistemática de ejercicio en los 3 primeros meses tras TEV) | PDF del usuario, entero sin suplemento | 4 ECA, 250 personas, uno tras TVP; sin problemas de seguridad, sin beneficio claro; 3 de 4 con riesgo de sesgo alto, sin GRADE | `trasTVP` |

- **`trasTVP`** (fase 5): tras la frase de las medias, «los estudios de las medias para prevenirlo se contradicen, y en la trombosis de la pantorrilla solo son para los síntomas (Cosmi 2022, consenso de expertos)»; tras «La guía no da pautas de ejercicio», las frases de Steiner 2026 (con «siempre con el anticoagulante» y «solo uno tras una TVP») y de Jasionowska 2022 (síndrome «ya establecido», «certeza muy baja»).
- **`RED_ANTICOAGULADO`** (fase 6, `alarmaAnticoagulado` y `cierreAnticoagulado`): una frase condicional en el texto, como `trasTVP` (la tarjeta no guarda el motivo; decisión 2 sin cambios). Dice que, si lo toma por una trombosis, la falta de aire brusca, el dolor en el pecho al respirar o la tos con sangre piden el 112, y la pierna que se hincha más, se calienta o duele más pide médico hoy. Redacción propia sobre las fuentes y los niveles de `pq_tep` (112) y `pq_tvp` (derivar hoy): Vyas 2024 y NICE NG158. Regenerado `docs/plan-tratamiento-frases.md`.
- **Leídas solo con el resumen y no citadas**: Kahn 2011 (el ensayo, PMC3017252), Anderson 2009 (deambulación, PMC2787576) y Ortel 2020 (ASH, PMC7556153), con texto vacío en PMC; la de *Phys Sportsmed* 2020, sin texto. Ninguna Cochrane de ejercicio en el síndrome postrombótico aparece en PubMed.

