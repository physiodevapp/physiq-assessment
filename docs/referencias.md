# Referencias bibliográficas

> **Archivo generado — no editar a mano.** Sale de `data/` y del registro `data/referencias.js` con
> `node tests/gen-referencias.mjs`; `node tests/unit.js` falla si no está al día.

Todas las referencias que cita el contenido clínico de la app y dónde se usa cada una.
Las citas viven en `data/<región>.js`: `fuente` de cada test y de cada cluster (se ve en la fase 4b,
bajo el test), `pronostico.fuente` y `dosisFuente` (fase 5, bajo el pronóstico y la pauta).
También se recogen las menciones a un estudio dentro de otros textos (el `criterio` de un test, la `dosis`).
Lo que es de la referencia y no de cada uso (revista, DOI, última revisión) vive en el registro
`data/referencias.js`, una entrada por referencia.

## Resumen

- **88** referencias de literatura, con **175** usos.
- **6** tarjetas de consulta (repo guia-de-consulta), con **296** usos, basadas en Lluch 2020.
- **12** de 89 referencias del registro revisadas. Ver «Estado de revisión».
- **105** de 426 tests sin `fuente` (0 de ellos puntúan en la fase 4b). Ver «Tests sin fuente».

## Cómo revisar una referencia

1. Coge la primera de «Estado de revisión» (sin revisar y que mueve la puntuación, primero).
2. Busca si hay literatura más reciente o mejor (revisión sistemática, guía de práctica clínica).
3. Si no hay nada mejor: en `data/referencias.js`, pon a esa referencia
   `revision: { fecha: 'AAAA-MM', resultado: 'Sin cambios: <qué se buscó>' }`.
4. Si la hay: en su tabla de usos (sección 2) tienes cada test, cluster, pronóstico o pauta que la cita.
   En cada uno, cambia la `fuente` y las cifras (`sn`, `sp`, `lr_pos`, `lr_neg`) en `data/<región>.js`,
   leyendo el artículo, nunca un resumen de terceros. Añade la referencia nueva al registro con su
   `revision`; si la antigua deja de citarse, bórrala del registro (la prueba lo exige).
5. `node tests/gen-referencias.mjs` y `node tests/unit.js`, y comitea `data/` junto con este archivo.
   Cambiar un LR cambia la puntuación de la fase 4b: dilo en el mensaje del commit.

Columna «Fase»: dónde lo ve el clínico. «4b · cita bajo el test» quiere decir que esa referencia respalda
las cifras (S, E, LR) del test; que el test puntúe o no depende de las reglas de `calcLRScore` (ver CLAUDE.md).
Columna «Cita»: número de la forma de citar (lista «Citada como») que usa esa fila.

## Estado de revisión

Orden de trabajo: primero las nunca revisadas, luego las revisadas hace más tiempo. Dentro de cada grupo,
primero las que mueven la puntuación de la fase 4b, luego pauta y pronóstico (fase 5), y las más antiguas antes.
«Afecta a»: «puntuación 4b» = respalda un test o cluster que puntúa; «test 4b sin puntuar» = el test se ve
pero no mueve la puntuación; «cribado fase 2» = respalda un criterio que dispara una alerta de derivación;
«texto» = solo se menciona.

| Referencia | Afecta a | Usos | Última revisión |
|---|---|---|---|
| [McCarthy y Busconi 1995](#mccarthy-y-busconi-1995) | puntuación 4b · test 4b sin puntuar | 2 | **sin revisar** |
| [Maffulli 1998](#maffulli-1998) | puntuación 4b · texto | 4 | **sin revisar** |
| [Devillé 2000](#devillé-2000) | puntuación 4b | 2 | **sin revisar** |
| [Litaker 2000](#litaker-2000) | puntuación 4b | 1 | **sin revisar** |
| [Solomon 2001](#solomon-2001) | puntuación 4b · texto | 3 | **sin revisar** |
| [Bachmann 2003](#bachmann-2003) | puntuación 4b · texto | 2 | **sin revisar** |
| [Molloy 2003](#molloy-2003) | puntuación 4b · texto | 2 | **sin revisar** |
| [Chronopoulos 2004](#chronopoulos-2004) | puntuación 4b · test 4b sin puntuar · texto | 3 | **sin revisar** |
| [Fritz 2005](#fritz-2005) | puntuación 4b · test 4b sin puntuar | 2 | **sin revisar** |
| [Park 2005](#park-2005) | puntuación 4b | 2 | **sin revisar** |
| [Hancock 2007](#hancock-2007) | puntuación 4b | 1 | **sin revisar** |
| [Kastelein 2008](#kastelein-2008) | puntuación 4b | 1 | **sin revisar** |
| [Lequesne 2008](#lequesne-2008) | puntuación 4b · test 4b sin puntuar | 2 | **sin revisar** |
| [Majlesi 2008](#majlesi-2008) | puntuación 4b | 1 | **sin revisar** |
| [Suri 2010](#suri-2010) | puntuación 4b | 2 | **sin revisar** |
| [Zhang 2010](#zhang-2010) | puntuación 4b | 3 | **sin revisar** |
| [Cook 2011](#cook-2011) | puntuación 4b | 1 | **sin revisar** |
| [Hegedus 2012](#hegedus-2012) | puntuación 4b · test 4b sin puntuar · texto | 9 | **sin revisar** |
| [Apelby-Albrecht 2013](#apelby-albrecht-2013) | puntuación 4b | 1 | **sin revisar** |
| [Hermans 2013](#hermans-2013) | puntuación 4b · test 4b sin puntuar | 6 | **sin revisar** |
| [Nunes 2013](#nunes-2013) | puntuación 4b | 1 | **sin revisar** |
| [Reiman 2014](#reiman-2014) | puntuación 4b · test 4b sin puntuar · texto | 6 | **sin revisar** |
| [Reiman 2015](#reiman-2015) | puntuación 4b · test 4b sin puntuar | 6 | **sin revisar** |
| [Smith 2015](#smith-2015) | puntuación 4b | 2 | **sin revisar** |
| [Genevay 2017](#genevay-2017) | puntuación 4b | 1 | **sin revisar** |
| [Grimaldi 2017](#grimaldi-2017) | puntuación 4b · test 4b sin puntuar | 2 | **sin revisar** |
| [Décary 2018](#décary-2018) | puntuación 4b | 4 | **sin revisar** |
| [Park 2019](#park-2019) | puntuación 4b · test 4b sin puntuar | 2 | **sin revisar** |
| [Campbell 2020](#campbell-2020) | puntuación 4b | 2 | **sin revisar** |
| [Getsoian 2020](#getsoian-2020) | puntuación 4b | 1 | **sin revisar** |
| [Saueressig 2021](#saueressig-2021) | puntuación 4b | 1 | **sin revisar** |
| [Demont 2022](#demont-2022) | puntuación 4b · test 4b sin puntuar | 2 | **sin revisar** |
| [Gomes 2022](#gomes-2022) | puntuación 4b · texto | 2 | **sin revisar** |
| [Paquin 2022](#paquin-2022) | puntuación 4b | 1 | **sin revisar** |
| [Han 2023](#han-2023) | puntuación 4b · test 4b sin puntuar | 4 | **sin revisar** |
| [Thoomes 2026](#thoomes-2026) | puntuación 4b · test 4b sin puntuar | 4 | **sin revisar** |
| [Goodman 2018](#goodman-2018) | cribado fase 2 | 1 | **sin revisar** |
| [Hölmich 1999](#hölmich-1999) | pauta | 1 | **sin revisar** |
| [Jonsson 2008](#jonsson-2008) | pauta | 1 | **sin revisar** |
| [McKeon 2008](#mckeon-2008) | pauta · texto | 2 | **sin revisar** |
| [Kuijper 2009](#kuijper-2009) | pauta | 1 | **sin revisar** |
| [Kulig 2009](#kulig-2009) | pauta | 1 | **sin revisar** |
| [Reid 2014](#reid-2014) | pauta | 1 | **sin revisar** |
| [Blanpied 2017](#blanpied-2017) | pauta | 1 | **sin revisar** |
| [Rathleff 2020](#rathleff-2020) | pauta | 1 | **sin revisar** |
| [Martin 2021](#martin-2021) | pauta | 2 | **sin revisar** |
| [Koc 2023](#koc-2023) | pauta | 1 | **sin revisar** |
| [Chimenti 2024](#chimenti-2024) | pauta | 1 | **sin revisar** |
| [Liu 2025](#liu-2025) | pauta | 1 | **sin revisar** |
| [Lluch 2020](#1-tarjetas-de-consulta) | pronóstico · test 4b sin puntuar | 296 | **sin revisar** |
| [Katz 1995](#katz-1995) | test 4b sin puntuar | 1 | **sin revisar** |
| [van Dijk 1996](#van-dijk-1996) | test 4b sin puntuar · texto | 2 | **sin revisar** |
| [Kim 2001](#kim-2001) | test 4b sin puntuar | 1 | **sin revisar** |
| [Zaslav 2001](#zaslav-2001) | test 4b sin puntuar | 1 | **sin revisar** |
| [Flynn 2002](#flynn-2002) | test 4b sin puntuar | 1 | **sin revisar** |
| [Kim 2004](#kim-2004) | test 4b sin puntuar | 1 | **sin revisar** |
| [Walton 2004](#walton-2004) | test 4b sin puntuar · texto | 5 | **sin revisar** |
| [Laslett 2006](#laslett-2006) | test 4b sin puntuar | 1 | **sin revisar** |
| [Dorf 2007](#dorf-2007) | test 4b sin puntuar | 1 | **sin revisar** |
| [Jull 2007](#jull-2007) | test 4b sin puntuar | 1 | **sin revisar** |
| [Kim 2007](#kim-2007) | test 4b sin puntuar · texto | 2 | **sin revisar** |
| [Warden 2007](#warden-2007) | test 4b sin puntuar | 1 | **sin revisar** |
| [Appelboam 2008](#appelboam-2008) | test 4b sin puntuar · texto | 2 | **sin revisar** |
| [Park 2008](#park-2008) | test 4b sin puntuar | 1 | **sin revisar** |
| [Lucas 2009](#lucas-2009) | test 4b sin puntuar | 1 | **sin revisar** |
| [Maxwell y Sterling 2013](#maxwell-y-sterling-2013) | test 4b sin puntuar | 1 | **sin revisar** |
| [Mahadevan 2015](#mahadevan-2015) | test 4b sin puntuar · texto | 2 | **sin revisar** |
| [Sman 2015](#sman-2015) | test 4b sin puntuar · texto | 4 | **sin revisar** |
| [Dobbs 2016](#dobbs-2016) | test 4b sin puntuar | 1 | **sin revisar** |
| [Tawa 2017](#tawa-2017) | test 4b sin puntuar | 2 | **sin revisar** |
| [Netterström-Wedin 2021](#netterström-wedin-2021) | test 4b sin puntuar · texto | 4 | **sin revisar** |
| [Karanasios 2022](#karanasios-2022) | test 4b sin puntuar | 2 | **sin revisar** |
| [Pitcher 2024](#pitcher-2024) | test 4b sin puntuar · texto | 2 | **sin revisar** |
| [Williams 2025](#williams-2025) | test 4b sin puntuar | 1 | **sin revisar** |
| [Hutchison 2013](#hutchison-2013) | texto | 1 | **sin revisar** |
| [Großterlinden 2016](#großterlinden-2016) | texto | 1 | **sin revisar** |
| [Frey 2017](#frey-2017) | texto | 1 | **sin revisar** |
| [Narvani 2003](#narvani-2003) | puntuación 4b · test 4b sin puntuar · texto | 3 | 2026-10 · Sin cambios: chasquido S 100 %, E 85 % y «Thomas ni sensible ni específico» comprobados en el resumen. |
| [Metcalfe 2019](#metcalfe-2019) | puntuación 4b · test 4b sin puntuar | 5 | 2026-10 · Sin cambios: texto completo leído (PMC7583647); S, E, LR+ y LR− con sus IC coinciden en los cinco usos. Es la revisión más reciente sobre exploración clínica de la artrosis de cadera. |
| [Pålsson 2020](#pålsson-2020) | puntuación 4b | 1 | 2026-10 · Sin cambios: texto completo leído (PMC7511272); RI en neutro S 29 % (13–44), E 94 % (86–100), kappa 0,43. El mismo estudio da para el FADIR S 80 %, E 24 % (ver Reiman 2015). |
| [Wong 2022](#wong-2022) | puntuación 4b · test 4b sin puntuar | 2 | 2026-10 · Sin cambios: solo describe la técnica, no aporta cifras. |
| [NICE NG226](#nice-ng226) | test 4b sin puntuar | 2 | 2026-10 · Sin cambios: solo respalda el diagnóstico clínico (edad ≥45, dolor con la actividad, rigidez matutina ausente o ≤30 min), sin S ni E; no puntúa. No se pudo abrir nice.org.uk (bloqueado por la red) para comprobar si hay actualización. |
| [Altman 1991](#altman-1991) | test 4b sin puntuar · texto | 2 | 2026-10 · S 86 % / E 75 % del árbol clínico comprobadas en el resumen, pero son de la muestra de desarrollo; en atención primaria los criterios no se sostienen (Bierma-Zeinstra 1999, Reijman 2004) y no hay S/E de ese ámbito. Los criterios ACR de cadera (ca1) pasan a hallazgo, sin puntuar. |
| [Bierma-Zeinstra 1999](#bierma-zeinstra-1999) | test 4b sin puntuar · texto | 2 | 2026-10 · Solo resumen leído (PubMed 10332979): el texto completo no es accesible. No da S ni E de los criterios clínicos. |
| [Reijman 2004](#reijman-2004) | test 4b sin puntuar · texto | 2 | 2026-10 · Solo resumen leído: en PMC (PMC1754907) el cuerpo es un PDF escaneado que no se pudo descargar. |
| [Peat 2006](#peat-2006) | test 4b sin puntuar | 1 | 2026-10 · Texto completo leído (PMC1798313, tabla 3). Más recientes en la misma dirección, solo resumen: Miguel 2019 (Clin Rheumatol) y Wang 2024 (Arthritis Care Res). |
| [Adib 2023](#adib-2023) | test 4b sin puntuar | 2 | 2026-10 · Sin cambios: S y E del Arlington y del twist comprobadas en el resumen; siguen como hallazgo. El mismo estudio da para el FADIR S 43 %, E 56 % (ver Reiman 2015). |
| [Halliwell 2026](#halliwell-2026) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: S 94 %, E 100 %, AUC 0,879 comprobadas en el resumen; sigue como hallazgo. |
| [Altman 1986](#altman-1986) | texto | 2 | 2026-10 · Sustituida por Peat 2006 en los criterios del ACR de rodilla (ro1): su S 95 % / E 69 % sale de la muestra de desarrollo, no del ámbito de un fisio. Solo queda citada como contexto en el texto del test. |

## 1. Tarjetas de consulta

Autores: Lluch, López-Cubas, Jones, Jull, Hall y Lewis  
Título: *Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders*  
Publicación: ZERAPI  
DOI: —  
Última revisión: **sin revisar**  
Nota: Base de las guías clínicas de cada región, de las que son extracto las tarjetas de consulta (repo guia-de-consulta). Los capítulos que citan los pies de las tarjetas (Struyf y Powell y Lewis, cap. 3, en hombro; Fondevila Suárez, cap. 5, en lumbar) son de este libro.

Las tarjetas de consulta están en el repo [physiodevapp/guia-de-consulta](https://github.com/physiodevapp/guia-de-consulta),
en `data/tarjeta_<región>.js`. Son extractos de las **guías clínicas** de cada región, basadas en Lluch 2020
(arriba). En `data/` se citan como «Tarjeta de consulta <región>». Los pies de cada tarjeta (abajo, literales)
dicen de qué apartados de la guía clínica sale cada cara.

### Tarjeta de consulta hombro

Archivo: `guia-de-consulta/data/tarjeta_hombro.js` · formulario previo: `guia-de-consulta/data/formulario_hombro.js`

De dónde sale (pies de la tarjeta):

- Guía clínica de hombro, ap. 1 y 4 · Struyf · Powell y Lewis, cap. 3 — Ficha de primera visita, bloques 0, 3 y 4
- Guía clínica de hombro, ap. 5 y 6 · las filas ① y ② son propuestas de la guía, no proceden del capítulo · cuestionarios validados citados en el ap. 6: SPADI, DASH, ASES, SST, Constant

Formulario previo, cara 2 (`formularios/hombro.js`): Hoja 2 de 2 · versión 1 — Preguntas discriminantes: guía clínica de hombro, ap. 3 (Dupuytren, trabajo y cambios de carga: ap. 5).

Citada como:

1. Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)
2. Tarjeta de consulta hombro (guía clínica de hombro, ap. 5 y 6)

| Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|
| h1 · Capsulitis Adhesiva | Test «Restricción equivalente activa y pasiva (criterio de Bunker)» | 4b · cita bajo el test | 1 |
| h1 · Capsulitis Adhesiva | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h1 · Capsulitis Adhesiva | Pronóstico | 5 · cita del pronóstico | 2 |
| h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Regla clínica de SAPS» | 4b · cita bajo el test | 1 |
| h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Pronóstico | 5 · cita del pronóstico | 2 |
| h3 · Rotura del Manguito Rotador | Test «Inspección» | 4b · cita bajo el test | 1 |
| h3 · Rotura del Manguito Rotador | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h3 · Rotura del Manguito Rotador | Pronóstico | 5 · cita del pronóstico | 2 |
| h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Anterior: aprensión, recolocación y sorpresa en conjunto» | 4b · cita bajo el test | 1 |
| h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Posterior: Jerk, Kim y signo de pinzamiento posterior agrupados» | 4b · cita bajo el test | 1 |
| h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Pronóstico | 5 · cita del pronóstico | 2 |
| h5 · Lesión Labral Superior (SLAP) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h5 · Lesión Labral Superior (SLAP) | Pronóstico | 5 · cita del pronóstico | 2 |
| h7 · Artropatía Acromioclavicular | Test «Movilidad pasiva sin restricción; posible escalón» | 4b · cita bajo el test | 1 |
| h7 · Artropatía Acromioclavicular | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h7 · Artropatía Acromioclavicular | Pronóstico | 5 · cita del pronóstico | 2 |
| h10 · Artrosis Glenohumeral | Test «Mayor edad + crepitación con rigidez activa = pasiva» | 4b · cita bajo el test | 1 |
| h11 · Luxación Bloqueada o Fractura (→ Rx) | Test «Rx antes de nada» | 4b · cita bajo el test | 1 |
| h11 · Luxación Bloqueada o Fractura (→ Rx) | Test «Luxación bloqueada» | 4b · cita bajo el test | 1 |
| h11 · Luxación Bloqueada o Fractura (→ Rx) | Test «Fractura» | 4b · cita bajo el test | 1 |
| h11 · Luxación Bloqueada o Fractura (→ Rx) | Test «Test de aprensión ósea y percusión olécranon-manubrio» | 4b · cita bajo el test | 1 |

### Tarjeta de consulta cadera

Archivo: `guia-de-consulta/data/tarjeta_cadera.js` · formulario previo: `guia-de-consulta/data/formulario_cadera.js`

De dónde sale (pies de la tarjeta):

- Guía clínica de cadera e ingle, ap. 1 y 4 — Ficha de primera visita, bloques 0, 3 y 4
- Guía clínica de cadera e ingle, ap. 5 · las filas ① y ② son propuestas de la guía, no proceden del capítulo
- Guía clínica de cadera e ingle, ap. 5 y 6 · entidades de Doha y filas Imagen, Cuidado y Pronóstico

Formulario previo, cara 2 (`formularios/cadera.js`): Hoja 2 de 2 · versión 2 — Preguntas discriminantes: guía clínica de cadera e ingle, ap. 3 (deporte y antecedentes: ap. 1 y 6).

Citada como:

1. Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 5 y 6)
2. Tarjeta de consulta cadera (guía clínica de cadera e ingle, ap. 3)
3. Tarjeta de consulta cadera (entidades de Doha)

| Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|
| ca1 · Artrosis de Cadera | Pronóstico | 5 · cita del pronóstico | 1 |
| ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Dolor inguinal» | 4b · cita bajo el test | 2 |
| ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Pronóstico | 5 · cita del pronóstico | 1 |
| ca3 · Desgarro del Labrum Acetabular | Test «Longitud de paso» | 4b · cita bajo el test | 2 |
| ca3 · Desgarro del Labrum Acetabular | Pronóstico | 5 · cita del pronóstico | 1 |
| ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Pronóstico | 5 · cita del pronóstico | 1 |
| ca11 · Lesión Aguda de Ingle | Test «Palpación del grupo sospechoso (primero)» | 4b · cita bajo el test | 2 |
| ca11 · Lesión Aguda de Ingle | Pronóstico | 5 · cita del pronóstico | 1 |
| ca12 · Ligamento Redondo e Inestabilidad | Test «Log roll» | 4b · cita bajo el test | 2 |
| ca12 · Ligamento Redondo e Inestabilidad | Pronóstico | 5 · cita del pronóstico | 1 |
| ca13 · Condropatía de Cadera | Test «Cribado intraarticular y Thomas positivos» | 4b · cita bajo el test | 2 |
| ca13 · Condropatía de Cadera | Pronóstico | 5 · cita del pronóstico | 1 |
| ca14 · Neuropatías de Cadera e Ingle | Test «Tinel del femorocutáneo (meralgia)» | 4b · cita bajo el test | 2 |
| ca14 · Neuropatías de Cadera e Ingle | Pronóstico | 5 · cita del pronóstico | 1 |
| ca15 · Sensibilización Central | Test «Dolor multifocal, referido y extenso» | 4b · cita bajo el test | 2 |
| ca16 · Dolor Inguinal Relacionado con el Aductor | Test «Palpación dolorosa de aductores + squeeze doloroso» | 4b · cita bajo el test | 3 |
| ca16 · Dolor Inguinal Relacionado con el Aductor | Pronóstico | 5 · cita del pronóstico | 1 |
| ca17 · Dolor Inguinal Relacionado con el Psoas Ilíaco | Test «Palpación dolorosa supra o infrainguinal» | 4b · cita bajo el test | 3 |
| ca17 · Dolor Inguinal Relacionado con el Psoas Ilíaco | Pronóstico | 5 · cita del pronóstico | 1 |
| ca18 · Dolor Inguinal Relacionado con el Canal Inguinal | Test «Dolor en la región del canal + palpación dolorosa del canal, sin hernia palpable» | 4b · cita bajo el test | 3 |
| ca18 · Dolor Inguinal Relacionado con el Canal Inguinal | Pronóstico | 5 · cita del pronóstico | 1 |
| ca19 · Dolor Inguinal Relacionado con el Pubis | Test «Palpación dolorosa de la sínfisis y el hueso adyacente» | 4b · cita bajo el test | 3 |
| ca19 · Dolor Inguinal Relacionado con el Pubis | Pronóstico | 5 · cita del pronóstico | 1 |

### Tarjeta de consulta cervical

Archivo: `guia-de-consulta/data/tarjeta_cervical.js` · formulario previo: `guia-de-consulta/data/formulario_cervical.js`

De dónde sale (pies de la tarjeta):

- Guía clínica cervical, ap. 1 y 4 — Ficha de primera visita, bloques 0, 3 y 4
- Guía clínica cervical, ap. 5 y 6 · las filas ① y ② son propuestas de la guía, no proceden del capítulo

Formulario previo, cara 2 (`formularios/cervical.js`): Hoja 2 de 2 · versión cervical — Preguntas discriminantes: guía clínica cervical, ap. 3. Ficha de primera visita: ejes 2 a 6 y bloque 4.

Citada como:

1. Tarjeta de consulta cervical (guía clínica cervical, ap. 5)
2. Tarjeta de consulta cervical (guía clínica cervical, ap. 5 y 6)
3. Tarjeta de consulta cervical (guía clínica cervical, bloque 4, tabla orientativa)
4. Maxwell y Sterling 2013 (Man Ther 18:172–174; 62 con latigazo crónico, grado II–III, 124 lados del cuello; referencia: umbral de dolor al frío ≥13 °C con termotest; orden de los tests no aleatorizado). Tarjeta de consulta cervical (guía clínica cervical, ap. 5)

| Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|
| ce3 · Radiculopatía Cervical | Test «Exploración neurológica: sensibilidad, fuerza y reflejos del miembro superior» | 4b · cita bajo el test | 1 |
| ce3 · Radiculopatía Cervical | Test «Fuerza del grupo débil con dinamómetro de mano (② medida objetiva)» | 4b · cita bajo el test | 1 |
| ce3 · Radiculopatía Cervical | Pronóstico | 5 · cita del pronóstico | 2 |
| ce4 · Cefalea Cervicogénica | Test «Examen manual cervical alto» | 4b · cita bajo el test | 1 |
| ce4 · Cefalea Cervicogénica | Test «Rasgos de cervicogénica frente a migraña y tensional (tabla orientativa)» | 4b · cita bajo el test | 3 |
| ce4 · Cefalea Cervicogénica | Pronóstico | 5 · cita del pronóstico | 2 |
| ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Test «Hielo sobre la nuca (hiperalgesia al frío)» | 4b · cita bajo el test | 4 |
| ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Test «Reposición articular (si hay mareo o inestabilidad)» | 4b · cita bajo el test | 1 |
| ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Test «Rotación cervical activa sentado (② medida objetiva)» | 4b · cita bajo el test | 1 |
| ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Pronóstico | 5 · cita del pronóstico | 2 |
| ce12 · Dolor Radicular Cervical | Test «ULNT1 (sesgo mediano) con diferenciación estructural» | 4b · cita bajo el test | 1 |
| ce12 · Dolor Radicular Cervical | Test «Movilidad cervical que dispara el dolor de brazo» | 4b · cita bajo el test | 1 |
| ce12 · Dolor Radicular Cervical | Test «Grados de extensión de codo en el ULNT1 (② medida objetiva)» | 4b · cita bajo el test | 1 |
| ce12 · Dolor Radicular Cervical | Test «Rasgos neuropáticos (quemazón o descargas)» | 4b · cita bajo el test | 1 |
| ce12 · Dolor Radicular Cervical | Pronóstico | 5 · cita del pronóstico | 2 |
| ce13 · Mareo Cervicogénico | Test «Descartar lo vascular (5 D y 3 N, disección)» | 4b · cita bajo el test | 1 |
| ce13 · Mareo Cervicogénico | Test «Sentido de posición articular (error de reposición)» | 4b · cita bajo el test | 1 |
| ce13 · Mareo Cervicogénico | Test «Movimiento o postura que desencadena el mareo (① gesto testigo)» | 4b · cita bajo el test | 1 |
| ce13 · Mareo Cervicogénico | Pronóstico | 5 · cita del pronóstico | 2 |
| ce14 · Dolor Cervical Idiopático | Test «Tarea provocadora (① gesto testigo)» | 4b · cita bajo el test | 1 |
| ce14 · Dolor Cervical Idiopático | Test «Movilidad activa en los tres planos y las tres regiones» | 4b · cita bajo el test | 1 |
| ce14 · Dolor Cervical Idiopático | Test «Test de flexión-rotación (FRT) si es craneocervical» | 4b · cita bajo el test | 1 |
| ce14 · Dolor Cervical Idiopático | Test «Extensión-rotación» | 4b · cita bajo el test | 1 |
| ce14 · Dolor Cervical Idiopático | Test «Examen manual segmentario» | 4b · cita bajo el test | 1 |
| ce14 · Dolor Cervical Idiopático | Pronóstico | 5 · cita del pronóstico | 2 |

### Tarjeta de consulta lumbar

Archivo: `guia-de-consulta/data/tarjeta_lumbar.js` · formulario previo: `guia-de-consulta/data/formulario_lumbar.js`

De dónde sale (pies de la tarjeta):

- Guía clínica lumbar, ap. 1 y 4 · Fondevila Suárez, cap. 5 — Ficha de primera visita, bloques 0, 3 y 4
- Guía clínica lumbar, ap. 5 y 6 · las filas ① y ② son propuestas de la guía, no proceden del capítulo

Formulario previo, cara 2 (`formularios/lumbar.js`): Hoja 2 de 2 · versión lumbar — Preguntas discriminantes: guía clínica lumbar, ap. 3 y 6. Ficha de primera visita: ejes 2 a 6 y bloque 4.

Citada como:

1. Tarjeta de consulta lumbar (guía clínica lumbar, ap. 6)

| Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|
| lu3 · Dolor Radicular Lumbar | Pronóstico | 5 · cita del pronóstico | 1 |
| lu4 · Estenosis Espinal / Claudicación Neurogénica | Pronóstico | 5 · cita del pronóstico | 1 |
| lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Pronóstico | 5 · cita del pronóstico | 1 |
| lu6 · Dolor Lumbar Discogénico | Pronóstico | 5 · cita del pronóstico | 1 |
| lu7 · Dolor Lumbar Facetario | Pronóstico | 5 · cita del pronóstico | 1 |
| lu8 · Dolor de la Articulación Sacroilíaca | Pronóstico | 5 · cita del pronóstico | 1 |

### Tarjeta de consulta rodilla

Archivo: `guia-de-consulta/data/tarjeta_rodilla.js` · formulario previo: `guia-de-consulta/data/formulario_rodilla.js`

De dónde sale (pies de la tarjeta):

- Guía clínica de rodilla, ap. 1 y anexo A2–A3 · lo marcado (anexo) no procede del capítulo — Ficha de primera visita, bloques 0 y 3
- Guía clínica de rodilla, ap. 4 — Ficha de primera visita, bloque 4
- Guía clínica de rodilla, ap. 5 y anexo A1 · las filas ① y ② son propuestas de la guía, no proceden del capítulo
- Guía clínica de rodilla, ap. 5, 6 y anexo A4 · filas Imagen, Cuidado y Pronóstico

Formulario previo, cara 2 (`formularios/rodilla.js`): Hoja 2 de 2 · versión 1 — Preguntas discriminantes: guía clínica de rodilla, ap. 3 (trabajo de rodillas: ap. 5–6; rigidez <30 min: ap. 5).

Citada como:

1. Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5)
2. Tarjeta de consulta rodilla (guía clínica de rodilla, ap. 5 y 6)

| Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|
| ro1 · Artrosis de Rodilla | Test «Rango disminuido, hinchazón persistente, debilidad de cuádriceps» | 4b · cita bajo el test | 1 |
| ro1 · Artrosis de Rodilla | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro1 · Artrosis de Rodilla | Pronóstico | 5 · cita del pronóstico | 2 |
| ro2 · Lesión Meniscal | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro2 · Lesión Meniscal | Pronóstico | 5 · cita del pronóstico | 2 |
| ro3 · Dolor Patelofemoral (Síndrome) | Test «Palpación alrededor de la FR, sobre todo de las facetas» | 4b · cita bajo el test | 1 |
| ro3 · Dolor Patelofemoral (Síndrome) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro3 · Dolor Patelofemoral (Síndrome) | Pronóstico | 5 · cita del pronóstico | 2 |
| ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Pronóstico | 5 · cita del pronóstico | 2 |
| ro5 · Tendinopatía Rotuliana | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro5 · Tendinopatía Rotuliana | Pronóstico | 5 · cita del pronóstico | 2 |
| ro6 · Síndrome de la Banda Iliotibial | Test «Palpación a lo largo de la cintilla» | 4b · cita bajo el test | 1 |
| ro6 · Síndrome de la Banda Iliotibial | Test «Step-down lateral» | 4b · cita bajo el test | 1 |
| ro6 · Síndrome de la Banda Iliotibial | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro6 · Síndrome de la Banda Iliotibial | Pronóstico | 5 · cita del pronóstico | 2 |
| ro7 · Bursitis de la Pata de Ganso | Test «Flexión de rodilla en carga y palpación de la pata de ganso» | 4b · cita bajo el test | 1 |
| ro7 · Bursitis de la Pata de Ganso | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro8 · Lesión del Ligamento Colateral Medial (LCM) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro8 · Lesión del Ligamento Colateral Medial (LCM) | Pronóstico | 5 · cita del pronóstico | 2 |
| ro9 · Lesión del Ligamento Cruzado Posterior (LCP) | Test «Cajón posterior a 90° de flexión» | 4b · cita bajo el test | 1 |
| ro9 · Lesión del Ligamento Cruzado Posterior (LCP) | Test «Signo del sag posterior» | 4b · cita bajo el test | 1 |
| ro9 · Lesión del Ligamento Cruzado Posterior (LCP) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro9 · Lesión del Ligamento Cruzado Posterior (LCP) | Pronóstico | 5 · cita del pronóstico | 2 |
| ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Test «Hinchazón y equimosis laterales; palpación dolorosa del ligamento» | 4b · cita bajo el test | 1 |
| ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Test «Varo forzado a unos 30° de flexión» | 4b · cita bajo el test | 1 |
| ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Test «Marcha con empuje en varo» | 4b · cita bajo el test | 1 |
| ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Pronóstico | 5 · cita del pronóstico | 2 |
| ro11 · Fracturas (Rótula o Meseta Tibial) | Test «Regla de Ottawa antes de nada» | 4b · cita bajo el test | 1 |
| ro11 · Fracturas (Rótula o Meseta Tibial) | Test «Rótula: dolor localizado, escalón, dolor con extensión resistida» | 4b · cita bajo el test | 1 |
| ro11 · Fracturas (Rótula o Meseta Tibial) | Test «Meseta: dolor exquisito sobre el foco y función neurovascular» | 4b · cita bajo el test | 1 |
| ro11 · Fracturas (Rótula o Meseta Tibial) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro11 · Fracturas (Rótula o Meseta Tibial) | Pronóstico | 5 · cita del pronóstico | 2 |
| ro12 · Inestabilidad Rotuliana | Test «Tests de estrés tibiofemoral normales» | 4b · cita bajo el test | 1 |
| ro12 · Inestabilidad Rotuliana | Test «Movilidad rotuliana excesiva» | 4b · cita bajo el test | 1 |
| ro12 · Inestabilidad Rotuliana | Test «Test de aprensión» | 4b · cita bajo el test | 1 |
| ro12 · Inestabilidad Rotuliana | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro12 · Inestabilidad Rotuliana | Pronóstico | 5 · cita del pronóstico | 2 |
| ro13 · Síndrome de la Grasa de Hoffa | Test «Observación: genu recurvatum» | 4b · cita bajo el test | 1 |
| ro13 · Síndrome de la Grasa de Hoffa | Test «Test de Hoffa» | 4b · cita bajo el test | 1 |
| ro13 · Síndrome de la Grasa de Hoffa | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro13 · Síndrome de la Grasa de Hoffa | Pronóstico | 5 · cita del pronóstico | 2 |
| ro14 · Bursitis Pre e Infrarrotuliana | Test «Fiebre >37,7 °C (séptica → urgencia)» | 4b · cita bajo el test | 1 |
| ro14 · Bursitis Pre e Infrarrotuliana | Test «Hinchazón en la propia bursa y arrodillarse intolerable» | 4b · cita bajo el test | 1 |
| ro14 · Bursitis Pre e Infrarrotuliana | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro14 · Bursitis Pre e Infrarrotuliana | Pronóstico | 5 · cita del pronóstico | 2 |
| ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Test «Cadera primero» | 4b · cita bajo el test | 1 |
| ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Test «Palpación de la tuberosidad tibial o del polo inferior de la rótula» | 4b · cita bajo el test | 1 |
| ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Test «Sentadillas, escaleras, step-down, saltos y extensión resistida» | 4b · cita bajo el test | 1 |
| ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Pronóstico | 5 · cita del pronóstico | 2 |
| ro16 · Lesión Osteocondral | Test «Palpación de la zona afectada» | 4b · cita bajo el test | 1 |
| ro16 · Lesión Osteocondral | Test «Marcha antiálgica» | 4b · cita bajo el test | 1 |
| ro16 · Lesión Osteocondral | Test «Signos de inestabilidad: derrame y bloqueo» | 4b · cita bajo el test | 1 |
| ro16 · Lesión Osteocondral | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro17 · Plica Sinovial Medial | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro18 · Disfunción de la Articulación Tibioperonea Proximal | Test «Presión directa sobre la cabeza del peroné y movilidad accesoria» | 4b · cita bajo el test | 1 |
| ro18 · Disfunción de la Articulación Tibioperonea Proximal | Test «Movimiento de rodilla con isquiotibiales en tensión y movimiento de tobillo» | 4b · cita bajo el test | 1 |
| ro18 · Disfunción de la Articulación Tibioperonea Proximal | Test «Cabeza del peroné prominente, hipermovilidad o luxación» | 4b · cita bajo el test | 1 |
| ro18 · Disfunción de la Articulación Tibioperonea Proximal | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro18 · Disfunción de la Articulación Tibioperonea Proximal | Pronóstico | 5 · cita del pronóstico | 2 |
| ro19 · Neuropatía del Nervio Peroneo Común | Test «Marcha en steppage» | 4b · cita bajo el test | 1 |
| ro19 · Neuropatía del Nervio Peroneo Común | Test «Sensibilidad en la cara lateral inferior de la pierna y el dorso del pie» | 4b · cita bajo el test | 1 |
| ro19 · Neuropatía del Nervio Peroneo Común | Test «Fuerza de eversión y de flexión dorsal de tobillo y dedos» | 4b · cita bajo el test | 1 |
| ro19 · Neuropatía del Nervio Peroneo Común | Test «Tinel cerca de la cabeza del peroné» | 4b · cita bajo el test | 1 |
| ro19 · Neuropatía del Nervio Peroneo Común | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro19 · Neuropatía del Nervio Peroneo Común | Pronóstico | 5 · cita del pronóstico | 2 |
| ro20 · Quiste Poplíteo (Baker) | Test «Signos de patología meniscal o condral» | 4b · cita bajo el test | 1 |
| ro20 · Quiste Poplíteo (Baker) | Test «Signo de Foucher» | 4b · cita bajo el test | 1 |
| ro20 · Quiste Poplíteo (Baker) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro20 · Quiste Poplíteo (Baker) | Pronóstico | 5 · cita del pronóstico | 2 |

### Tarjeta de consulta tobillo y pie

Archivo: `guia-de-consulta/data/tarjeta_tobillo_pie.js` · formulario previo: `guia-de-consulta/data/formulario_tobillo_pie.js`

De dónde sale (pies de la tarjeta):

- Guía clínica de tobillo y pie, ap. 1 y anexo A1 · lo marcado (anexo) no procede del capítulo — Ficha de primera visita, bloques 0 y 3
- Guía clínica de tobillo y pie, ap. 4 — Ficha de primera visita, bloque 4
- Guía clínica de tobillo y pie, ap. 5 · las filas ① y ② son propuestas de la guía, no proceden del capítulo
- Guía clínica de tobillo y pie, ap. 5, 6 y anexo A2 · filas Imagen, Cuidado y Pronóstico

Formulario previo, cara 2 (`formularios/tobillo_pie.js`): Hoja 2 de 2 · versión 1 — Preguntas discriminantes: guía clínica de tobillo y pie, ap. 3 (carga y calzado: ap. 6; rigidez: ap. 3 y 5).

Citada como:

1. Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5)
2. Tarjeta de consulta tobillo y pie (ap. 5); van Dijk 1996 (J Bone Joint Surg Br 78-B(6))
3. Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)
4. Tarjeta de consulta tobillo y pie (ap. 5); Sman 2015 (Br J Sports Med, publicado en línea en 2013); Netterström-Wedin 2021 (Phys Ther Sport 49:214–26)
5. Tarjeta de consulta tobillo y pie (ap. 5); Reiman 2014 (J Athl Train 49:820–9)
6. Tarjeta de consulta tobillo y pie (ap. 5); Mahadevan 2015 (J Foot Ankle Surg 54:549–53); Pitcher 2024 (Foot Ankle Orthop 9(4))

| Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|
| tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «Reglas de Ottawa (si no carga)» | 4b · cita bajo el test | 1 |
| tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «LPAA: palpar y estirar» | 4b · cita bajo el test | 1 |
| tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «LPC: palpar y estirar» | 4b · cita bajo el test | 1 |
| tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «Cajón anterior (a los 4–6 días)» | 4b · cita bajo el test | 2 |
| tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp1 · Esguince Lateral Agudo (LPAA y LPC) | Pronóstico | 5 · cita del pronóstico | 3 |
| tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» | 4b · cita bajo el test | 4 |
| tp2 · Lesión de la Sindesmosis | Test «Squeeze test» | 4b · cita bajo el test | 4 |
| tp2 · Lesión de la Sindesmosis | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp2 · Lesión de la Sindesmosis | Pronóstico | 5 · cita del pronóstico | 3 |
| tp3 · Rotura del Aquiles | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp3 · Rotura del Aquiles | Pronóstico | 5 · cita del pronóstico | 3 |
| tp4 · Lesión de Lisfranc | Test «Neurovascular y cinco P» | 4b · cita bajo el test | 1 |
| tp4 · Lesión de Lisfranc | Test «Equimosis plantar» | 4b · cita bajo el test | 1 |
| tp4 · Lesión de Lisfranc | Test «Dolor en todo el ancho del mediopié» | 4b · cita bajo el test | 1 |
| tp4 · Lesión de Lisfranc | Test «1.º y 2.º MT en direcciones opuestas» | 4b · cita bajo el test | 1 |
| tp4 · Lesión de Lisfranc | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp4 · Lesión de Lisfranc | Pronóstico | 5 · cita del pronóstico | 3 |
| tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «5.º MT: dolor en la base» | 4b · cita bajo el test | 1 |
| tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Calcáneo: talón doloroso con equimosis» | 4b · cita bajo el test | 1 |
| tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Pronóstico | 5 · cita del pronóstico | 3 |
| tp6 · Luxación del Tibial Posterior | Test «Hinchazón y equimosis perimaleolar medial» | 4b · cita bajo el test | 1 |
| tp6 · Luxación del Tibial Posterior | Test «Resalte con la flexión dorsal y plantar» | 4b · cita bajo el test | 1 |
| tp6 · Luxación del Tibial Posterior | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp7 · Pinzamiento Posterior del Tobillo | Test «Test de pinzamiento posterior» | 4b · cita bajo el test | 1 |
| tp7 · Pinzamiento Posterior del Tobillo | Test «Hinchazón y dolor por detrás del astrágalo» | 4b · cita bajo el test | 1 |
| tp7 · Pinzamiento Posterior del Tobillo | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp7 · Pinzamiento Posterior del Tobillo | Pronóstico | 5 · cita del pronóstico | 3 |
| tp8 · Tendinopatía del Aquiles, Porción Media | Test «Batería progresiva de carga» | 4b · cita bajo el test | 5 |
| tp8 · Tendinopatía del Aquiles, Porción Media | Test «Descarga en el salto» | 4b · cita bajo el test | 1 |
| tp8 · Tendinopatía del Aquiles, Porción Media | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp8 · Tendinopatía del Aquiles, Porción Media | Pronóstico | 5 · cita del pronóstico | 3 |
| tp9 · Tendinopatía Insercional del Aquiles | Test «Dolor con carga y flexión dorsal» | 4b · cita bajo el test | 1 |
| tp9 · Tendinopatía Insercional del Aquiles | Test «Salto con el talón elevado frente a aterrizaje» | 4b · cita bajo el test | 1 |
| tp9 · Tendinopatía Insercional del Aquiles | Test «ETM monopodal sobre plano inclinado» | 4b · cita bajo el test | 1 |
| tp9 · Tendinopatía Insercional del Aquiles | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp9 · Tendinopatía Insercional del Aquiles | Pronóstico | 5 · cita del pronóstico | 3 |
| tp10 · Afectación de la Vaina del Aquiles | Test «Crepitación en flexión plantar y dorsal» | 4b · cita bajo el test | 1 |
| tp10 · Afectación de la Vaina del Aquiles | Test «ETM en rango amplio» | 4b · cita bajo el test | 1 |
| tp10 · Afectación de la Vaina del Aquiles | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp10 · Afectación de la Vaina del Aquiles | Pronóstico | 5 · cita del pronóstico | 3 |
| tp11 · Tendinopatía del Plantar Delgado | Test «ETM sobre un step en todo el rango» | 4b · cita bajo el test | 1 |
| tp11 · Tendinopatía del Plantar Delgado | Test «Marcha descalzo» | 4b · cita bajo el test | 1 |
| tp11 · Tendinopatía del Plantar Delgado | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp11 · Tendinopatía del Plantar Delgado | Pronóstico | 5 · cita del pronóstico | 3 |
| tp12 · Neuropatía del Nervio Sural | Test «Tinel a lo largo del sural» | 4b · cita bajo el test | 1 |
| tp12 · Neuropatía del Nervio Sural | Test «Palpación en prono con flexión dorsal pasiva» | 4b · cita bajo el test | 1 |
| tp12 · Neuropatía del Nervio Sural | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp12 · Neuropatía del Nervio Sural | Pronóstico | 5 · cita del pronóstico | 3 |
| tp13 · Bursitis Calcánea Superficial | Test «Dolor superficial e hinchazón a la presión» | 4b · cita bajo el test | 1 |
| tp13 · Bursitis Calcánea Superficial | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp14 · Tendinopatía del Tibial Posterior | Test «Dolor retromaleolar medial» | 4b · cita bajo el test | 1 |
| tp14 · Tendinopatía del Tibial Posterior | Test «Inversión resistida» | 4b · cita bajo el test | 1 |
| tp14 · Tendinopatía del Tibial Posterior | Test «ETM: el retropié va a varo» | 4b · cita bajo el test | 1 |
| tp14 · Tendinopatía del Tibial Posterior | Test ««Demasiados dedos»» | 4b · cita bajo el test | 1 |
| tp14 · Tendinopatía del Tibial Posterior | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp14 · Tendinopatía del Tibial Posterior | Pronóstico | 5 · cita del pronóstico | 3 |
| tp15 · Tendinopatía del Flexor Largo del Primer Dedo (FHL) | Test «Flexoextensión del primer dedo en flexión plantar completa» | 4b · cita bajo el test | 1 |
| tp15 · Tendinopatía del Flexor Largo del Primer Dedo (FHL) | Test «Crepitación e hinchazón en la vaina» | 4b · cita bajo el test | 1 |
| tp15 · Tendinopatía del Flexor Largo del Primer Dedo (FHL) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp15 · Tendinopatía del Flexor Largo del Primer Dedo (FHL) | Pronóstico | 5 · cita del pronóstico | 3 |
| tp16 · Síndrome del Túnel del Tarso | Test «Tinel a lo largo del túnel» | 4b · cita bajo el test | 1 |
| tp16 · Síndrome del Túnel del Tarso | Test «Hinchazón en el túnel o la subastragalina posterior» | 4b · cita bajo el test | 1 |
| tp16 · Síndrome del Túnel del Tarso | Test «Explorar el FHL» | 4b · cita bajo el test | 1 |
| tp16 · Síndrome del Túnel del Tarso | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp16 · Síndrome del Túnel del Tarso | Pronóstico | 5 · cita del pronóstico | 3 |
| tp17 · Fractura de Estrés del Tobillo (Maléolo Medial, Astrágalo, Calcáneo) | Test «Dolor óseo a la palpación» | 4b · cita bajo el test | 1 |
| tp17 · Fractura de Estrés del Tobillo (Maléolo Medial, Astrágalo, Calcáneo) | Test «Calcáneo: compresión medial y lateral a la vez» | 4b · cita bajo el test | 1 |
| tp17 · Fractura de Estrés del Tobillo (Maléolo Medial, Astrágalo, Calcáneo) | Test «Astrágalo: hinchazón en el seno del tarso o posterior» | 4b · cita bajo el test | 1 |
| tp17 · Fractura de Estrés del Tobillo (Maléolo Medial, Astrágalo, Calcáneo) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp17 · Fractura de Estrés del Tobillo (Maléolo Medial, Astrágalo, Calcáneo) | Pronóstico | 5 · cita del pronóstico | 3 |
| tp18 · Síndrome del Seno del Tarso | Test «Palpación del seno del tarso» | 4b · cita bajo el test | 1 |
| tp18 · Síndrome del Seno del Tarso | Test «Estrés en inversión de la subastragalina o KTW con pronación» | 4b · cita bajo el test | 1 |
| tp18 · Síndrome del Seno del Tarso | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp18 · Síndrome del Seno del Tarso | Pronóstico | 5 · cita del pronóstico | 3 |
| tp19 · Tendinopatía de los Peroneos | Test «Dolor retromaleolar lateral» | 4b · cita bajo el test | 1 |
| tp19 · Tendinopatía de los Peroneos | Test «Subluxación de los peroneos» | 4b · cita bajo el test | 1 |
| tp19 · Tendinopatía de los Peroneos | Test «Crepitación e hinchazón» | 4b · cita bajo el test | 1 |
| tp19 · Tendinopatía de los Peroneos | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp19 · Tendinopatía de los Peroneos | Pronóstico | 5 · cita del pronóstico | 3 |
| tp20 · Pinzamiento Anterior del Tobillo | Test «KTW» | 4b · cita bajo el test | 1 |
| tp20 · Pinzamiento Anterior del Tobillo | Test «Palpación anterior» | 4b · cita bajo el test | 1 |
| tp20 · Pinzamiento Anterior del Tobillo | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp20 · Pinzamiento Anterior del Tobillo | Pronóstico | 5 · cita del pronóstico | 3 |
| tp21 · Inestabilidad Crónica del Tobillo | Test «Hinchazón articular» | 4b · cita bajo el test | 1 |
| tp21 · Inestabilidad Crónica del Tobillo | Test «Cajón anterior: signo del surco» | 4b · cita bajo el test | 1 |
| tp21 · Inestabilidad Crónica del Tobillo | Test «Laxitud subastragalina» | 4b · cita bajo el test | 1 |
| tp21 · Inestabilidad Crónica del Tobillo | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp21 · Inestabilidad Crónica del Tobillo | Pronóstico | 5 · cita del pronóstico | 3 |
| tp22 · Sinovitis Postraumática | Test «Hinchazón y dolor a la palpación» | 4b · cita bajo el test | 1 |
| tp22 · Sinovitis Postraumática | Test «Laxitud del LPAA y del LPC» | 4b · cita bajo el test | 1 |
| tp22 · Sinovitis Postraumática | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp22 · Sinovitis Postraumática | Pronóstico | 5 · cita del pronóstico | 3 |
| tp23 · Coalición Tarsiana | Test «Movilidad subastragalina y mediotarsiana» | 4b · cita bajo el test | 1 |
| tp23 · Coalición Tarsiana | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp23 · Coalición Tarsiana | Pronóstico | 5 · cita del pronóstico | 3 |
| tp24 · Artrosis de Tobillo o Pie | Test «Perfil clínico» | 4b · cita bajo el test | 1 |
| tp24 · Artrosis de Tobillo o Pie | Test «Palpación de la interlínea» | 4b · cita bajo el test | 1 |
| tp24 · Artrosis de Tobillo o Pie | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp24 · Artrosis de Tobillo o Pie | Pronóstico | 5 · cita del pronóstico | 3 |
| tp25 · Osteocondritis Disecante del Astrágalo | Test «Palpación de la cúpula astragalina en flexión plantar» | 4b · cita bajo el test | 1 |
| tp25 · Osteocondritis Disecante del Astrágalo | Test «Hinchazón, derrame, crepitación» | 4b · cita bajo el test | 1 |
| tp25 · Osteocondritis Disecante del Astrágalo | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp25 · Osteocondritis Disecante del Astrágalo | Pronóstico | 5 · cita del pronóstico | 3 |
| tp26 · Dolor Plantar Crónico del Talón | Test «Palpación de la tuberosidad medial del calcáneo» | 4b · cita bajo el test | 1 |
| tp26 · Dolor Plantar Crónico del Talón | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp26 · Dolor Plantar Crónico del Talón | Pronóstico | 5 · cita del pronóstico | 3 |
| tp27 · Síndrome de la Almohadilla Grasa del Talón | Test «Palpación posterolateral del talón» | 4b · cita bajo el test | 1 |
| tp27 · Síndrome de la Almohadilla Grasa del Talón | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp27 · Síndrome de la Almohadilla Grasa del Talón | Pronóstico | 5 · cita del pronóstico | 3 |
| tp28 · Atrapamiento Nervioso del Talón | Test «Tinel en el calcáneo medial» | 4b · cita bajo el test | 1 |
| tp28 · Atrapamiento Nervioso del Talón | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp28 · Atrapamiento Nervioso del Talón | Pronóstico | 5 · cita del pronóstico | 3 |
| tp29 · Lesión Calcaneocuboidea y Cubometatarsiana | Test «Aguda: palpación calcaneocuboidea» | 4b · cita bajo el test | 1 |
| tp29 · Lesión Calcaneocuboidea y Cubometatarsiana | Test «Gradual: interlíneas del cuboides» | 4b · cita bajo el test | 1 |
| tp29 · Lesión Calcaneocuboidea y Cubometatarsiana | Test «Carga del antepié e inicio de la ETM» | 4b · cita bajo el test | 1 |
| tp29 · Lesión Calcaneocuboidea y Cubometatarsiana | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp29 · Lesión Calcaneocuboidea y Cubometatarsiana | Pronóstico | 5 · cita del pronóstico | 3 |
| tp30 · Fractura de Estrés del Mediopié (Navicular, Cuboides, Cuñas) | Test «Punto N» | 4b · cita bajo el test | 1 |
| tp30 · Fractura de Estrés del Mediopié (Navicular, Cuboides, Cuñas) | Test «Dolor puntual sobre cuboides o cuñas» | 4b · cita bajo el test | 1 |
| tp30 · Fractura de Estrés del Mediopié (Navicular, Cuboides, Cuñas) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp30 · Fractura de Estrés del Mediopié (Navicular, Cuboides, Cuñas) | Pronóstico | 5 · cita del pronóstico | 3 |
| tp31 · Lesión de la 1.ª Metatarsofalángica | Test «Equimosis e hinchazón en la interlínea» | 4b · cita bajo el test | 1 |
| tp31 · Lesión de la 1.ª Metatarsofalángica | Test «Rango de la 1.ª MTF frente al lado sano» | 4b · cita bajo el test | 1 |
| tp31 · Lesión de la 1.ª Metatarsofalángica | Test «Dolor sobre los sesamoideos» | 4b · cita bajo el test | 1 |
| tp31 · Lesión de la 1.ª Metatarsofalángica | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp31 · Lesión de la 1.ª Metatarsofalángica | Pronóstico | 5 · cita del pronóstico | 3 |
| tp32 · Dolor en la Base del 2.º Metatarsiano | Test «Palpación de la base del 2.º MT y de Lisfranc» | 4b · cita bajo el test | 1 |
| tp32 · Dolor en la Base del 2.º Metatarsiano | Test «Estrés frente a sinovitis» | 4b · cita bajo el test | 1 |
| tp32 · Dolor en la Base del 2.º Metatarsiano | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp33 · Fractura de Estrés del Cuello de un Metatarsiano (Fractura de Marcha) | Test «Dolor puntual sobre el cuello» | 4b · cita bajo el test | 1 |
| tp33 · Fractura de Estrés del Cuello de un Metatarsiano (Fractura de Marcha) | Test «Carga axial del MT» | 4b · cita bajo el test | 1 |
| tp33 · Fractura de Estrés del Cuello de un Metatarsiano (Fractura de Marcha) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp33 · Fractura de Estrés del Cuello de un Metatarsiano (Fractura de Marcha) | Pronóstico | 5 · cita del pronóstico | 3 |
| tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» | 4b · cita bajo el test | 6 |
| tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Diferencial del antepié» | 4b · cita bajo el test | 1 |
| tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Pronóstico | 5 · cita del pronóstico | 3 |
| tp35 · Gota | Test «Articulación roja, hinchada y muy dolorosa» | 4b · cita bajo el test | 1 |
| tp35 · Gota | Test «Sistémicamente bien» | 4b · cita bajo el test | 1 |
| tp35 · Gota | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp36 · Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg) | Test «Sever: inserción del Aquiles (8–12 años)» | 4b · cita bajo el test | 1 |
| tp36 · Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg) | Test «Iselin: base del 5.º MT (8–13 años)» | 4b · cita bajo el test | 1 |
| tp36 · Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg) | Test «Navicular: apofisitis del tibial posterior o Köhler» | 4b · cita bajo el test | 1 |
| tp36 · Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg) | Test «Freiberg: cabeza del 2.º–4.º MT (14–18 años)» | 4b · cita bajo el test | 1 |
| tp36 · Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg) | Pronóstico | 5 · cita del pronóstico | 3 |

## 2. Literatura científica

Orden alfabético. Un mismo «Autor Año» puede agrupar dos artículos distintos (p. ej. dos de Décary 2018):
la lista «Citada como» los distingue.

[Adib 2023](#adib-2023) · [Altman 1986](#altman-1986) · [Altman 1991](#altman-1991) · [Apelby-Albrecht 2013](#apelby-albrecht-2013) · [Appelboam 2008](#appelboam-2008) · [Bachmann 2003](#bachmann-2003) · [Bierma-Zeinstra 1999](#bierma-zeinstra-1999) · [Blanpied 2017](#blanpied-2017) · [Campbell 2020](#campbell-2020) · [Chimenti 2024](#chimenti-2024) · [Chronopoulos 2004](#chronopoulos-2004) · [Cook 2011](#cook-2011) · [Décary 2018](#décary-2018) · [Demont 2022](#demont-2022) · [Devillé 2000](#devillé-2000) · [Dobbs 2016](#dobbs-2016) · [Dorf 2007](#dorf-2007) · [Flynn 2002](#flynn-2002) · [Frey 2017](#frey-2017) · [Fritz 2005](#fritz-2005) · [Genevay 2017](#genevay-2017) · [Getsoian 2020](#getsoian-2020) · [Gomes 2022](#gomes-2022) · [Goodman 2018](#goodman-2018) · [Grimaldi 2017](#grimaldi-2017) · [Großterlinden 2016](#großterlinden-2016) · [Halliwell 2026](#halliwell-2026) · [Han 2023](#han-2023) · [Hancock 2007](#hancock-2007) · [Hegedus 2012](#hegedus-2012) · [Hermans 2013](#hermans-2013) · [Hölmich 1999](#hölmich-1999) · [Hutchison 2013](#hutchison-2013) · [Jonsson 2008](#jonsson-2008) · [Jull 2007](#jull-2007) · [Karanasios 2022](#karanasios-2022) · [Kastelein 2008](#kastelein-2008) · [Katz 1995](#katz-1995) · [Kim 2001](#kim-2001) · [Kim 2004](#kim-2004) · [Kim 2007](#kim-2007) · [Koc 2023](#koc-2023) · [Kuijper 2009](#kuijper-2009) · [Kulig 2009](#kulig-2009) · [Laslett 2006](#laslett-2006) · [Lequesne 2008](#lequesne-2008) · [Litaker 2000](#litaker-2000) · [Liu 2025](#liu-2025) · [Lucas 2009](#lucas-2009) · [Maffulli 1998](#maffulli-1998) · [Mahadevan 2015](#mahadevan-2015) · [Majlesi 2008](#majlesi-2008) · [Martin 2021](#martin-2021) · [Maxwell y Sterling 2013](#maxwell-y-sterling-2013) · [McCarthy y Busconi 1995](#mccarthy-y-busconi-1995) · [McKeon 2008](#mckeon-2008) · [Metcalfe 2019](#metcalfe-2019) · [Molloy 2003](#molloy-2003) · [Narvani 2003](#narvani-2003) · [Netterström-Wedin 2021](#netterström-wedin-2021) · [NICE NG226](#nice-ng226) · [Nunes 2013](#nunes-2013) · [Pålsson 2020](#pålsson-2020) · [Paquin 2022](#paquin-2022) · [Park 2005](#park-2005) · [Park 2008](#park-2008) · [Park 2019](#park-2019) · [Peat 2006](#peat-2006) · [Pitcher 2024](#pitcher-2024) · [Rathleff 2020](#rathleff-2020) · [Reid 2014](#reid-2014) · [Reijman 2004](#reijman-2004) · [Reiman 2014](#reiman-2014) · [Reiman 2015](#reiman-2015) · [Saueressig 2021](#saueressig-2021) · [Sman 2015](#sman-2015) · [Smith 2015](#smith-2015) · [Solomon 2001](#solomon-2001) · [Suri 2010](#suri-2010) · [Tawa 2017](#tawa-2017) · [Thoomes 2026](#thoomes-2026) · [van Dijk 1996](#van-dijk-1996) · [Walton 2004](#walton-2004) · [Warden 2007](#warden-2007) · [Williams 2025](#williams-2025) · [Wong 2022](#wong-2022) · [Zaslav 2001](#zaslav-2001) · [Zhang 2010](#zhang-2010)

### Adib 2023

Publicación: Am J Sports Med 51(4):1007–14  
DOI: 10.1177/03635465221149748  
Última revisión: 2026-10 · Sin cambios: S y E del Arlington y del twist comprobadas en el resumen; siguen como hallazgo. El mismo estudio da para el FADIR S 43 %, E 56 % (ver Reiman 2015).

Citada como:

1. Adib 2023 (Am J Sports Med; retrospectivo, evaluado por el autor de los tests; referencia: artro-RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Arlington» | 4b · cita bajo el test | 1 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Torsión/Twist» | 4b · cita bajo el test | 1 |

### Altman 1986

Publicación: Arthritis Rheum 29(8):1039–49  
DOI: 10.1002/art.1780290816  
Última revisión: 2026-10 · Sustituida por Peat 2006 en los criterios del ACR de rodilla (ro1): su S 95 % / E 69 % sale de la muestra de desarrollo, no del ámbito de un fisio. Solo queda citada como contexto en el texto del test.  
Nota: Texto completo no consultado (Wiley, de pago): el resumen de PubMed no da S ni E.

Citada como:

1. Hallazgo: la S 95 % / E 69 % que figuraba son de los criterios clínicos de artrosis de rodilla (Altman 1986), no de cadera. El criterio más parecido para cadera es el diagnóstico clínico de NICE (edad >45, dolor con la actividad, sin rigidez matutina o ≤30 min), que no aporta sensibilidad ni especificidad. Rigidez matutina <60 min ausente sí orienta en contra (LR− 0,22–0,65).
2. Dolor de rodilla la mayoría de los días del mes previo MÁS al menos 3 de — edad >50, rigidez <30 min, crepitación, dolor óseo a la palpación, aumento de tamaño óseo, sin calor palpable. Son criterios de clasificación: la S 95 % / E 69 % que figuraba sale de la muestra en la que se crearon (pacientes de reumatología, frente a artritis reumatoide y otras causas; Altman 1986). En población de 50 años o más con dolor de rodilla caen a S 41 % · E 75 % (LR+ 1,6 · LR− 0,8): casi no cambian la probabilidad. Reflejan sobre todo la artrosis avanzada: si no se cumplen, no la descartes. No puntúa, así que el criterio combinado, la crepitación y el agrandamiento óseo cuentan por separado.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca1 · Artrosis de Cadera | Test «Criterio clínico combinado: Edad ≥45 + dolor en actividad + rigidez <1h» (en `criterio`) | 4b · mención en el texto | 1 |
| Rodilla | ro1 · Artrosis de Rodilla | Test «Criterios clínicos del ACR» (en `criterio`) | 4b · mención en el texto | 2 |

### Altman 1991

Publicación: Arthritis Rheum 34(5):505–14  
DOI: 10.1002/art.1780340502  
Última revisión: 2026-10 · S 86 % / E 75 % del árbol clínico comprobadas en el resumen, pero son de la muestra de desarrollo; en atención primaria los criterios no se sostienen (Bierma-Zeinstra 1999, Reijman 2004) y no hay S/E de ese ámbito. Los criterios ACR de cadera (ca1) pasan a hallazgo, sin puntuar.  
Nota: Texto completo no consultado (Wiley, de pago): la «validación cruzada S 83 %, E 68 %» que citaba la app no está en el resumen y se ha quitado.

Citada como:

1. Dolor de cadera y, además: (1) RI ≥15°, dolor en la RI, rigidez matutina ≤60 min y edad >50 años; o bien (2) RI <15° y VSG ≤45 mm/h (sin VSG: flexión ≤115°). La tarjeta cita solo la rama (1). En la muestra en la que se crearon (201 pacientes con dolor de cadera, frente a artritis reumatoide, espondiloartropatía y otras causas) daban S 86 % · E 75 % (Altman 1991), pero no puntúa: en atención primaria, en pacientes de 50 años o más, los criterios clínicos no concuerdan con los criterios del ACR que incluyen radiografía (kappa ≤ 0,11; Bierma-Zeinstra 1999), y una revisión los da por poco fiables en ese ámbito (Reijman 2004). La rotación interna disminuida, que forma parte del árbol, sí tiene cifras de atención primaria y puntúa sola.
2. Altman 1991 (Arthritis Rheum 34:505–14, criterios ACR; n = 201 con dolor de cadera, controles con dolor de cadera de otra causa). En atención primaria: Bierma-Zeinstra 1999 (J Rheumatol 26:1129–33; n = 227 de 50 años o más, derivados a radiografía por su médico de cabecera) y Reijman 2004 (Ann Rheum Dis 63:226–32, revisión sistemática de definiciones de artrosis de cadera)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca1 · Artrosis de Cadera | Test «Criterios clínicos ACR (árbol de clasificación)» (en `criterio`) | 4b · mención en el texto | 1 |
| Cadera | ca1 · Artrosis de Cadera | Test «Criterios clínicos ACR (árbol de clasificación)» | 4b · cita bajo el test | 2 |

### Apelby-Albrecht 2013

Publicación: —  
DOI: —  
Última revisión: **sin revisar**  
Nota: Citado a través de Thoomes 2026.

Citada como:

1. Thoomes 2026 (BMC Musculoskelet Disord, actualización de la revisión sistemática de 2018; metaanálisis de Apelby-Albrecht 2013 y Grondin, tabla 4)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce3 · Radiculopatía Cervical | Test «Combinación de 4 ULNT (ULNT1 y ULNT2a mediano, ULNT2b radial, ULNT3 cubital)» | 4b · cita bajo el test | 1 |

### Appelboam 2008

Publicación: BMJ 337:a2428  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Extensión completa, flexión, pronación y supinación comparadas con el lado sano. Sin cifras para capsulitis: la «S 99 %» que tenía es del test de extensión del codo para descartar fractura tras traumatismo (Appelboam 2008: no extender del todo el codo → radiografía; S 96,8 %), otra condición.
2. Appelboam 2008 (BMJ 337:a2428), solo como aclaración: su cifra es para fractura, no para capsulitis

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co3 · Capsulitis Adhesiva del Codo (Rigidez Post-traumática) | Test «Test de ROM activo en 4 direcciones» (en `criterio`) | 4b · mención en el texto | 1 |
| Codo | co3 · Capsulitis Adhesiva del Codo (Rigidez Post-traumática) | Test «Test de ROM activo en 4 direcciones» | 4b · cita bajo el test | 2 |

### Bachmann 2003

Publicación: BMJ 326:417  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. TOBILLO → radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. PIE → radiografía si dolor en el mediopié Y alguno: dolor óseo en la base del 5.º MT · en el navicular · no carga cuatro pasos. Solo descarta: Bachmann 2003 (27 estudios, 15 581 pacientes) da LR− 0,08 aplicando solo la regla del tobillo o solo la del pie, pero 0,21 (IC 95 % 0,12–0,38) en los estudios que aplican las dos juntas, que es como se usan aquí (se toma la más prudente). El positivo es un hallazgo: en adultos, LR+ 1,47 (IC 1,11–1,93; Gomes 2022).
2. Bachmann 2003 (BMJ 326:417); Gomes 2022 (BMC Musculoskelet Disord 23:885)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Reglas de Ottawa de tobillo y de pie» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Reglas de Ottawa de tobillo y de pie» | 4b · cita bajo el test | 2 |

### Bierma-Zeinstra 1999

Publicación: J Rheumatol 26(5):1129–33  
DOI: —  
Última revisión: 2026-10 · Solo resumen leído (PubMed 10332979): el texto completo no es accesible. No da S ni E de los criterios clínicos.

Citada como:

1. Dolor de cadera y, además: (1) RI ≥15°, dolor en la RI, rigidez matutina ≤60 min y edad >50 años; o bien (2) RI <15° y VSG ≤45 mm/h (sin VSG: flexión ≤115°). La tarjeta cita solo la rama (1). En la muestra en la que se crearon (201 pacientes con dolor de cadera, frente a artritis reumatoide, espondiloartropatía y otras causas) daban S 86 % · E 75 % (Altman 1991), pero no puntúa: en atención primaria, en pacientes de 50 años o más, los criterios clínicos no concuerdan con los criterios del ACR que incluyen radiografía (kappa ≤ 0,11; Bierma-Zeinstra 1999), y una revisión los da por poco fiables en ese ámbito (Reijman 2004). La rotación interna disminuida, que forma parte del árbol, sí tiene cifras de atención primaria y puntúa sola.
2. Altman 1991 (Arthritis Rheum 34:505–14, criterios ACR; n = 201 con dolor de cadera, controles con dolor de cadera de otra causa). En atención primaria: Bierma-Zeinstra 1999 (J Rheumatol 26:1129–33; n = 227 de 50 años o más, derivados a radiografía por su médico de cabecera) y Reijman 2004 (Ann Rheum Dis 63:226–32, revisión sistemática de definiciones de artrosis de cadera)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca1 · Artrosis de Cadera | Test «Criterios clínicos ACR (árbol de clasificación)» (en `criterio`) | 4b · mención en el texto | 1 |
| Cadera | ca1 · Artrosis de Cadera | Test «Criterios clínicos ACR (árbol de clasificación)» | 4b · cita bajo el test | 2 |

### Blanpied 2017

Publicación: J Orthop Sports Phys Ther 47(7):A1–A83  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Kuijper 2009, BMJ 339:b3883 (ensayo aleatorizado, n = 205; la lista de ejercicios está en su apéndice web, no revisado) · Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce12 · Dolor Radicular Cervical | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Campbell 2020

Publicación: Am J Sports Med 48:2819–2827  
DOI: —  
Última revisión: **sin revisar**  
Nota: Recoge los datos de Roedl (sin año en la cita).

Citada como:

1. Roedl, recogido en Campbell 2020 (Am J Sports Med 48:2819–2827, revisión sistemática; 144 pacientes, referencia intraoperatoria, positivo con apertura ≥1,0 mm frente al lado sano; para rotura completa, umbral de 2,5 mm: S 95 %, E 89 %)
2. Roedl, recogido en Campbell 2020 (Am J Sports Med 48:2819–2827, revisión sistemática; 144 pacientes, referencia intraoperatoria; la misma precisión que la ecografía convencional en esa cohorte; otros estudios de la revisión, S 81–100 %, E 91–100 %)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Ecografía dinámica con estrés en valgo» | 4b · cita bajo el test | 1 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «RM con artrograma» | 4b · cita bajo el test | 2 |

### Chimenti 2024

Publicación: J Orthop Sports Phys Ther 54(12):CPG1–CPG32  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Chimenti 2024, J Orthop Sports Phys Ther 54(12):CPG1–CPG32 (guía de práctica clínica APTA; letra = grado de la recomendación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp8 · Tendinopatía del Aquiles, Porción Media | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Chronopoulos 2004

Publicación: Am J Sports Med  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Chronopoulos 2004 (Am J Sports Med; 35 lesiones AC crónicas aisladas frente a 580 controles quirúrgicos)
2. Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6).
3. Chronopoulos 2004 (Am J Sports Med) y Walton 2004 (J Bone Joint Surg Am)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h7 · Artropatía Acromioclavicular | Test «Test de Aducción Cruzada (Cross-body Adduction)» | 4b · cita bajo el test | 1 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» (en `criterio`) | 4b · mención en el texto | 2 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» | 4b · cita bajo el test | 3 |

### Cook 2011

Publicación: —  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Cook 2011 (n = 1448). 4 de 5: S 6 %, E 98 %; ninguno: S 96 %

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Cluster «Cluster de Cook (anamnesis y observación)» | 4b · cita del cluster | 1 |

### Décary 2018

Publicación: PLoS One · PM&R (dos artículos)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Dos artículos distintos con la misma clave: la cita de cada uso dice la revista.

Citada como:

1. Décary 2018 (PM&R; n = 279, 35 roturas traumáticas; referencia: diagnóstico compuesto de médico experto con RM)
2. Décary 2018 (PM&R; n = 279, 45 roturas degenerativas; referencia: diagnóstico compuesto de médico experto con RM)
3. Décary 2018 (PLoS One; n = 279, 22 roturas completas; referencia: diagnóstico compuesto de médico experto con RM)
4. Décary 2018 (PLoS One; n = 279, 43 roturas parciales o completas; referencia: diagnóstico compuesto de médico experto con RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro2 · Lesión Meniscal | Test «Combinación traumática: traumatismo + dolor medial o difuso + palpación de la interlínea medial» | 4b · cita bajo el test | 1 |
| Rodilla | ro2 · Lesión Meniscal | Test «Combinación degenerativa: inicio progresivo + dolor medial aislado + uno de tres» | 4b · cita bajo el test | 2 |
| Rodilla | ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test «Confirmar: mecanismo de pivote + derrame inmediato + Lachman positivo» | 4b · cita bajo el test | 3 |
| Rodilla | ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test «Descartar: sin mecanismo de pivote ni chasquido + Lachman o pivot shift negativos (si se cumple, marcar «Negativo»)» | 4b · cita bajo el test | 4 |

### Demont 2022

Publicación: Musculoskelet Sci Pract  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Demont 2022 (Musculoskelet Sci Pract, metaanálisis, 4 estudios, n = 182; frente a cefalea facetaria cervical baja, migraña, cefaleas concomitantes o asintomáticos; certeza moderada. S IC 95 %: 70–92 %; E IC 95 %: 71–91 %; LR+ IC 2,6–9,5; LR− IC 0,1–0,4; 4 estudios de cohorte prospectivos de Hall y Ogince, 2007–2010; riesgo de sesgo por la selección de pacientes). FRT normal en cervicogénica de C2–C3/C3–C4: Getsoian 2020 (BMJ Open, bloqueos diagnósticos controlados), citado en Demont 2022. Precauciones: Paquin 2022 (Arch Physiother 12:26, artículo de opinión)
2. Jull 2007 (Cephalalgia 27:793–802, parte 1; 18 cervicogénicas frente a 22 migrañas, 33 tensionales y 57 controles, n = 130; tabla 3). Riesgo de sesgo alto según Demont 2022 (PROBAST)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce4 · Cefalea Cervicogénica | Test «Test de Flexión-Rotación Cervical (CFRT)» | 4b · cita bajo el test | 1 |
| Cervical | ce4 · Cefalea Cervicogénica | Test «Cluster: ROM cervical + PAIVM + CCFT» | 4b · cita bajo el test | 2 |

### Devillé 2000

Publicación: —  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Devillé 2000 (revisión sistemática; referencia: cirugía)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «Test de Elevación de Pierna Recta (SLR) ipsilateral» | 4b · cita bajo el test | 1 |
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «SLR Contralateral (Lasègue cruzado)» | 4b · cita bajo el test | 1 |

### Dobbs 2016

Publicación: Manual Therapy  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Katz 1995, datos citados en Dobbs 2016 (Manual Therapy; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Test de extensión lumbar de 30 s» | 4b · cita bajo el test | 1 |

### Dorf 2007

Publicación: J Hand Surg Am 32:882–886  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Karanasios 2022 (J Hand Ther 35:541–551; revisión sistemática, 24 estudios, 97 % con riesgo de sesgo alto o incierto; solo 2 estudios de exploración física). Estudio de origen, casi con seguridad: Dorf 2007 (J Hand Surg Am 32:882–886; retrospectivo, 81 pacientes; una diferencia del 8 % entre flexión y extensión distinguió el brazo afectado del sano con un 83 % de precisión)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Reducción de fuerza de prensión (diferencia 5-10% entre posiciones)» | 4b · cita bajo el test | 1 |

### Flynn 2002

Publicación: —  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Flynn 2002 (regla pronóstica: probabilidad de éxito con manipulación del 45 % al 95 %)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu1 · Disfunción Segmentaria Lumbosacra (Déficit de Movilidad) | Test «Regla de Predicción Clínica de Flynn (4/5 criterios)» | 4b · cita bajo el test | 1 |

### Frey 2017

Publicación: —  
DOI: —  
Última revisión: **sin revisar**  
Nota: Citado a través de Netterström-Wedin 2021.

Citada como:

1. Palpación del LTPAI (la más sensible). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: la palpación del LTPAI sola da resultados contradictorios (Frey 2017: S 95 %, E 86 %; Großterlinden 2016: S 43 %, E 52 %; recogidos en Netterström-Wedin 2021). La LR− 0,28 (IC 0,09–0,89) de Sman 2015 es de otra cosa: dolor en cualquiera de cinco estructuras de la sindesmosis (S 92 %, E 29 %).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» (en `criterio`) | 4b · mención en el texto | 1 |

### Fritz 2005

Publicación: —  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Fritz 2005 (IC 95 % del LR+: 1,8–10,6)
2. Fritz 2005 (referencia: inestabilidad radiológica)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu2 · Inestabilidad Espinal Lumbar (Déficit de Coordinación) | Test «Flexión lumbar ≥ 53° o ausencia de hipomovilidad en la exploración segmentaria» | 4b · cita bajo el test | 1 |
| Lumbar | lu2 · Inestabilidad Espinal Lumbar (Déficit de Coordinación) | Test «Test de inestabilidad en prono» | 4b · cita bajo el test | 2 |

### Genevay 2017

Publicación: —  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Genevay 2017

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «Criterios RAPIDH (5 criterios)» | 4b · cita bajo el test | 1 |

### Getsoian 2020

Publicación: BMJ Open  
DOI: —  
Última revisión: **sin revisar**  
Nota: Citado a través de Demont 2022.

Citada como:

1. Demont 2022 (Musculoskelet Sci Pract, metaanálisis, 4 estudios, n = 182; frente a cefalea facetaria cervical baja, migraña, cefaleas concomitantes o asintomáticos; certeza moderada. S IC 95 %: 70–92 %; E IC 95 %: 71–91 %; LR+ IC 2,6–9,5; LR− IC 0,1–0,4; 4 estudios de cohorte prospectivos de Hall y Ogince, 2007–2010; riesgo de sesgo por la selección de pacientes). FRT normal en cervicogénica de C2–C3/C3–C4: Getsoian 2020 (BMJ Open, bloqueos diagnósticos controlados), citado en Demont 2022. Precauciones: Paquin 2022 (Arch Physiother 12:26, artículo de opinión)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce4 · Cefalea Cervicogénica | Test «Test de Flexión-Rotación Cervical (CFRT)» | 4b · cita bajo el test | 1 |

### Gomes 2022

Publicación: BMC Musculoskelet Disord 23:885  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. TOBILLO → radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. PIE → radiografía si dolor en el mediopié Y alguno: dolor óseo en la base del 5.º MT · en el navicular · no carga cuatro pasos. Solo descarta: Bachmann 2003 (27 estudios, 15 581 pacientes) da LR− 0,08 aplicando solo la regla del tobillo o solo la del pie, pero 0,21 (IC 95 % 0,12–0,38) en los estudios que aplican las dos juntas, que es como se usan aquí (se toma la más prudente). El positivo es un hallazgo: en adultos, LR+ 1,47 (IC 1,11–1,93; Gomes 2022).
2. Bachmann 2003 (BMJ 326:417); Gomes 2022 (BMC Musculoskelet Disord 23:885)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Reglas de Ottawa de tobillo y de pie» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Reglas de Ottawa de tobillo y de pie» | 4b · cita bajo el test | 2 |

### Goodman 2018

Autores: Goodman, Heick y Lazaro  
Título: *Differential Diagnosis for Physical Therapists: Screening for Referral*  
Publicación: Elsevier, 6.ª edición  
DOI: —  
Última revisión: **sin revisar**  
Nota: El cribado de fase 2 lo cita sin año («Criterio de Goodman (cap. 14)»).

Citada como:

1. Criterio de Goodman (cap. 14): 2 de 4 → sensibilidad 70%, especificidad 81%; 3 de 4 → especificidad cercana al 100%. No es un diagnóstico.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | `sistemas.3.criterioCompuesto.nota` | 2 · criterio compuesto del cribado | 1 |

### Grimaldi 2017

Publicación: Br J Sports Med  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Grimaldi 2017 (BJSM; n = 65 con dolor lateral de cadera, referencia: RM); LR− IC 95 %: 0,20–0,93
2. Grimaldi 2017 (BJSM; n = 65 con dolor lateral de cadera, referencia: RM). Lequesne 2008: S 100 %, E 97,3 %, frente a caderas sin dolor

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Palpación del trocánter mayor / tendón glúteo» | 4b · cita bajo el test | 1 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Apoyo Monopodal <30 segundos (Single-Leg Stance)» | 4b · cita bajo el test | 2 |

### Großterlinden 2016

Publicación: —  
DOI: —  
Última revisión: **sin revisar**  
Nota: Citado a través de Netterström-Wedin 2021.

Citada como:

1. Palpación del LTPAI (la más sensible). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: la palpación del LTPAI sola da resultados contradictorios (Frey 2017: S 95 %, E 86 %; Großterlinden 2016: S 43 %, E 52 %; recogidos en Netterström-Wedin 2021). La LR− 0,28 (IC 0,09–0,89) de Sman 2015 es de otra cosa: dolor en cualquiera de cinco estructuras de la sindesmosis (S 92 %, E 29 %).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» (en `criterio`) | 4b · mención en el texto | 1 |

### Halliwell 2026

Publicación: Arthroscopy 42(4):745–52  
DOI: 10.1002/arj.70074  
Última revisión: 2026-10 · Sin cambios: S 94 %, E 100 %, AUC 0,879 comprobadas en el resumen; sigue como hallazgo.

Citada como:

1. Halliwell 2026 (Arthroscopy; retrospectivo, 224 pacientes con SIFA operados; referencia: artroscopia)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Combinación FADDIR + FABER + Elevación pierna recta resistida» | 4b · cita bajo el test | 1 |

### Han 2023

Publicación: eClinicalMedicine  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Han 2023 (eClinicalMedicine, revisión sistemática, 4 estudios; LR+ IC 95 %: 1,44–6,50; referencia: discografía). Antes: Hancock 2007, LR+ 2,8
2. Laslett 2006 (no replica a Revel; referencia: doble bloqueo); Han 2023 (eClinicalMedicine, revisión sistemática: Revel inconsistente, no agrupable)
3. Han 2023 (eClinicalMedicine, revisión sistemática, 2 estudios; LR+ IC 95 %: 1,89–3,07)
4. Han 2023 (eClinicalMedicine, revisión sistemática, 6 estudios; LR+ IC 95 %: 1,50–3,98, LR− 0,21–0,47; referencia: bloqueo anestésico). Misma regla que la tarjeta lumbar: 3 de 5 positivos. Saueressig 2021 (JOSPT, metaanálisis, 5 estudios): LR+ 2,13, LR− 0,33, certeza muy baja (GRADE); descarta mejor de lo que confirma

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu6 · Dolor Lumbar Discogénico | Test «Centralización con movimientos repetidos» | 4b · cita bajo el test | 1 |
| Lumbar | lu7 · Dolor Lumbar Facetario | Test «Dolor en extensión, inclinación o rotación hacia el lado del dolor» | 4b · cita bajo el test | 2 |
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Test «Ausencia de dolor lumbar en la línea media» | 4b · cita bajo el test | 3 |
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Cluster «Tests de provocación SI (3 de 5)» | 4b · cita del cluster | 4 |

### Hancock 2007

Publicación: —  
DOI: —  
Última revisión: **sin revisar**  
Nota: Cifra anterior, sustituida por Han 2023 (se menciona en la cita).

Citada como:

1. Han 2023 (eClinicalMedicine, revisión sistemática, 4 estudios; LR+ IC 95 %: 1,44–6,50; referencia: discografía). Antes: Hancock 2007, LR+ 2,8

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu6 · Dolor Lumbar Discogénico | Test «Centralización con movimientos repetidos» | 4b · cita bajo el test | 1 |

### Hegedus 2012

Publicación: Br J Sports Med 46:964–978  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Hegedus 2012 (Br J Sports Med; metaanálisis, tabla 3)
2. En supino, brazo elevado a 120° y en rotación externa máxima, codo a 90° y antebrazo en supinación; el paciente flexiona el codo contra resistencia. Positivo si esa flexión resistida provoca dolor. La LR+ alta es del estudio de sus creadores (S 89,7 %, E 96,9 %, n = 127, 15–52 años, excluidos luxación y hombro rígido); en los dos estudios independientes recogidos por Hegedus 2012, S 30–55 % y E 53–78 %, y la revisión concluye que hay «menos optimismo». Cuenta como hallazgo: la LR+ 26 solo se sostiene en el estudio de sus creadores.
3. Kim 2001 (Arthroscopy 17:160–164) · Hegedus 2012 (Br J Sports Med 46:964–978, tabla 2)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Arco doloroso» | 4b · cita bajo el test | 1 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Hawkins-Kennedy» | 4b · cita bajo el test | 1 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Neer» | 4b · cita bajo el test | 1 |
| Hombro | h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Test de Aprehensión» | 4b · cita bajo el test | 1 |
| Hombro | h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Test de Recolocación (Jobe)» | 4b · cita bajo el test | 1 |
| Hombro | h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Test de Liberación/Release/Surprise» | 4b · cita bajo el test | 1 |
| Hombro | h5 · Lesión Labral Superior (SLAP) | Test «Test de O'Brien (Active Compression)» | 4b · cita bajo el test | 1 |
| Hombro | h5 · Lesión Labral Superior (SLAP) | Test «Biceps Load Test II» (en `criterio`) | 4b · mención en el texto | 2 |
| Hombro | h5 · Lesión Labral Superior (SLAP) | Test «Biceps Load Test II» | 4b · cita bajo el test | 3 |

### Hermans 2013

Publicación: JAMA 310:837–847  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 2, patología del manguito)
2. Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 2)
3. Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 2, rotura completa)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Resistencia a Rotación Externa» | 4b · cita bajo el test | 1 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Test de Lata Vacía (Empty Can)» | 4b · cita bajo el test | 2 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Test de Lata Llena (Full Can)» | 4b · cita bajo el test | 1 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «External Rotation Lag Sign» | 4b · cita bajo el test | 3 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Internal Rotation Lag Sign» | 4b · cita bajo el test | 3 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Drop Arm Test» | 4b · cita bajo el test | 1 |

### Hölmich 1999

Publicación: Lancet 353:439–443  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Hölmich 1999, Lancet 353:439–443 (ensayo aleatorizado, n = 68, frente a fisioterapia pasiva)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca16 · Dolor Inguinal Relacionado con el Aductor | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Hutchison 2013

Publicación: —  
DOI: —  
Última revisión: **sin revisar**  
Nota: Citado a través de Reiman 2014.

Citada como:

1. Batería progresiva: ETM bipodal → monopodal → saltos bipodales → monopodales, hasta reproducir; dolor localizado (1–2 dedos). EVA en cada escalón. Aquiles: la palpación no ayuda al diagnóstico. No puntúa: la única cifra de estos gestos es de Hutchison 2013 (estudio piloto, 10 tendinopatías; en Reiman 2014): ETM monopodal S 22 %, E 93 %, LR+ 3,14; salto S 43 %, E 87 %, LR+ 3,31, sin intervalo de confianza publicado.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp8 · Tendinopatía del Aquiles, Porción Media | Test «Batería progresiva de carga» (en `criterio`) | 4b · mención en el texto | 1 |

### Jonsson 2008

Publicación: Br J Sports Med 42:746–749  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Jonsson 2008, Br J Sports Med 42:746–749 (estudio piloto sin grupo control, n = 27, 34 tendones, diagnóstico con ecografía)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp9 · Tendinopatía Insercional del Aquiles | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Jull 2007

Publicación: Cephalalgia 27:793–802  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Jull 2007 (Cephalalgia 27:793–802, parte 1; 18 cervicogénicas frente a 22 migrañas, 33 tensionales y 57 controles, n = 130; tabla 3). Riesgo de sesgo alto según Demont 2022 (PROBAST)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce4 · Cefalea Cervicogénica | Test «Cluster: ROM cervical + PAIVM + CCFT» | 4b · cita bajo el test | 1 |

### Karanasios 2022

Publicación: J Hand Ther 35:541–551  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Karanasios 2022 (J Hand Ther 35:541–551; revisión sistemática, 24 estudios, 97 % con riesgo de sesgo alto o incierto; solo 2 estudios de exploración física)
2. Karanasios 2022 (J Hand Ther 35:541–551; revisión sistemática, 24 estudios, 97 % con riesgo de sesgo alto o incierto; solo 2 estudios de exploración física). Estudio de origen, casi con seguridad: Dorf 2007 (J Hand Surg Am 32:882–886; retrospectivo, 81 pacientes; una diferencia del 8 % entre flexión y extensión distinguió el brazo afectado del sano con un 83 % de precisión)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Test de Cozen (extensión resistida de muñeca)» | 4b · cita bajo el test | 1 |
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Reducción de fuerza de prensión (diferencia 5-10% entre posiciones)» | 4b · cita bajo el test | 2 |

### Kastelein 2008

Publicación: Am J Med  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Kastelein 2008 (Am J Med; n = 134, 35 con lesión del LCM; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro8 · Lesión del Ligamento Colateral Medial (LCM) | Test «Valgo forzado a 30° de flexión + mecanismo de la entrevista» | 4b · cita bajo el test | 1 |

### Katz 1995

Publicación: —  
DOI: —  
Última revisión: **sin revisar**  
Nota: Citado a través de Dobbs 2016.

Citada como:

1. Katz 1995, datos citados en Dobbs 2016 (Manual Therapy; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Test de extensión lumbar de 30 s» | 4b · cita bajo el test | 1 |

### Kim 2001

Publicación: Arthroscopy 17:160–164  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Kim 2001 (Arthroscopy 17:160–164) · Hegedus 2012 (Br J Sports Med 46:964–978, tabla 2)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h5 · Lesión Labral Superior (SLAP) | Test «Biceps Load Test II» | 4b · cita bajo el test | 1 |

### Kim 2004

Publicación: —  
DOI: —  
Última revisión: **sin revisar**  
Nota: Solo para la técnica del test.

Citada como:

1. Kim 2007 (Arthroscopy; 172 rodillas, referencia: artroscopia); técnica: Kim 2004

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro17 · Plica Sinovial Medial | Test «Test de provocación de la plica rotuliana medial» | 4b · cita bajo el test | 1 |

### Kim 2007

Publicación: Arthroscopy  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Es la mejor forma de diagnosticarlo en consulta. Técnica (test MPP): supino, rodilla extendida; presión con el pulgar sobre la porción inferomedial de la femororrotuliana y, manteniéndola, flexionar a 90°. Positivo: dolor en extensión que desaparece o disminuye mucho a 90°; comparar con el otro lado. Kim 2007 da S 89,5 % · E 88,7 % frente a artroscopia (la tarjeta redondea a S 0,90 · E 0,89 · LR+ 8,18 · LR− 0,11), pero no puntúa: toda la especificidad sale de los controles con dolor en la interlínea lateral. En el grupo con dolor anteromedial, las 13 rodillas sin plica patológica (7 pinzamientos de franjas sinoviales de la grasa de Hoffa, 5 sinovitis localizadas, 1 lesión de cartílago) dieron el test positivo: E 0 de 13 en el diagnóstico diferencial real. Además, nivel III, no consecutivos y test hecho por su autor sin cegamiento. Cuenta como hallazgo compatible.
2. Kim 2007 (Arthroscopy; 172 rodillas, referencia: artroscopia); técnica: Kim 2004

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro17 · Plica Sinovial Medial | Test «Test de provocación de la plica rotuliana medial» (en `criterio`) | 4b · mención en el texto | 1 |
| Rodilla | ro17 · Plica Sinovial Medial | Test «Test de provocación de la plica rotuliana medial» | 4b · cita bajo el test | 2 |

### Koc 2023

Publicación: J Orthop Sports Phys Ther 53(12):CPG1–CPG39  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Koc 2023, J Orthop Sports Phys Ther 53(12):CPG1–CPG39 (guía de práctica clínica APTA; letra = grado de la recomendación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp26 · Dolor Plantar Crónico del Talón | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Kuijper 2009

Publicación: BMJ 339:b3883  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Kuijper 2009, BMJ 339:b3883 (ensayo aleatorizado, n = 205; la lista de ejercicios está en su apéndice web, no revisado) · Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce12 · Dolor Radicular Cervical | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Kulig 2009

Publicación: Phys Ther 89(1):26–37  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Kulig 2009, Phys Ther 89(1):26–37 (ensayo aleatorizado, n = 36: plantillas + estiramiento, con o sin ejercicio concéntrico o excéntrico)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp14 · Tendinopatía del Tibial Posterior | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Laslett 2006

Publicación: —  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Laslett 2006 (no replica a Revel; referencia: doble bloqueo); Han 2023 (eClinicalMedicine, revisión sistemática: Revel inconsistente, no agrupable)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu7 · Dolor Lumbar Facetario | Test «Dolor en extensión, inclinación o rotación hacia el lado del dolor» | 4b · cita bajo el test | 1 |

### Lequesne 2008

Publicación: Arthritis Rheum  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Grimaldi 2017 (BJSM; n = 65 con dolor lateral de cadera, referencia: RM). Lequesne 2008: S 100 %, E 97,3 %, frente a caderas sin dolor
2. Lequesne 2008 (Arthritis Rheum; estudio único, n = 17 con SDTM refractario de 13 meses de media; referencia: RM). La E se midió en 38 caderas sin dolor, lo que probablemente la sobrestima

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Apoyo Monopodal <30 segundos (Single-Leg Stance)» | 4b · cita bajo el test | 1 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Derotación externa resistida» | 4b · cita bajo el test | 2 |

### Litaker 2000

Publicación: J Am Geriatr Soc  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Litaker 2000 (J Am Geriatr Soc; n = 448 derivados a artrografía, 67 % con rotura; tabla 4, grupo de validación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h3 · Rotura del Manguito Rotador | Test «Cluster B: debilidad en RE + edad ≥65 (puntuación de Litaker ≥4)» | 4b · cita bajo el test | 1 |

### Liu 2025

Publicación: BMC Sports Sci Med Rehabil 17:335  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Martin 2021, J Orthop Sports Phys Ther 51(4):CPG1–CPG80 (guía de práctica clínica APTA; letra = grado de la recomendación) · Liu 2025, BMC Sports Sci Med Rehabil 17:335 (metaanálisis de dosis) · McKeon 2008, Med Sci Sports Exerc 40(10):1810–1819 (ensayo aleatorizado, n = 31)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp21 · Inestabilidad Crónica del Tobillo | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Lucas 2009

Publicación: —  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Lucas 2009 (revisión sistemática de fiabilidad)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu9 · Síndrome de Dolor Miofascial Lumbar | Test «Banda tensa palpable» | 4b · cita bajo el test | 1 |

### Maffulli 1998

Publicación: Am J Sports Med 26:266–70  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Thompson: prono, pie fuera de la camilla; al comprimir la pantorrilla el tobillo no se mueve → S 96 % · E 93 % → derivación preferente. Maffulli 1998: 133 roturas confirmadas en cirugía y 28 controles con lesión posterior sin rotura (26 negativos; 2 dudosos contados como falsos positivos). LR de Reiman 2014 con esos datos: LR+ 13,71 (IC 95 % 3,54–51,24), LR− 0,04 (0,02–0,10). Límite: la especificidad sale de solo 28 controles.
2. Maffulli 1998 (Am J Sports Med 26:266–70); LR: Reiman 2014 (J Athl Train 49:820–9)
3. Hueco palpable, que se pierde con el tiempo. Maffulli 1998 (paciente despierto): S 73 %, E 89 %; LR de Reiman 2014: LR+ 6,64 (IC 95 % 2,32–19,91), LR− 0,30 (0,23–0,40). Es otro test que Thompson, pero en el mismo paciente: si los dos son positivos, el peso conjunto puede estar algo sobrestimado.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp3 · Rotura del Aquiles | Test «Thompson (Simmonds)» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp3 · Rotura del Aquiles | Test «Thompson (Simmonds)» | 4b · cita bajo el test | 2 |
| Tobillo y pie | tp3 · Rotura del Aquiles | Test «Hueco palpable» (en `criterio`) | 4b · mención en el texto | 3 |
| Tobillo y pie | tp3 · Rotura del Aquiles | Test «Hueco palpable» | 4b · cita bajo el test | 2 |

### Mahadevan 2015

Publicación: J Foot Ankle Surg 54:549–53  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Dolor a la palpación directa del espacio (sobre todo 3.º–4.º); posible chasquido al palpar mientras se comprimen los metatarsianos. No puntúa: la compresión pulgar-índice del espacio (Mahadevan 2015) tiene S 96 %, pero su especificidad sale de un solo pie sin Morton; el chasquido de Mulder da LR+ 2,19 (IC 0,45–10,60; Dando, en Pitcher 2024).
2. Tarjeta de consulta tobillo y pie (ap. 5); Mahadevan 2015 (J Foot Ankle Surg 54:549–53); Pitcher 2024 (Foot Ankle Orthop 9(4))

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» | 4b · cita bajo el test | 2 |

### Majlesi 2008

Publicación: —  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Majlesi 2008 (estudio único; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «Test de Slump» | 4b · cita bajo el test | 1 |

### Martin 2021

Publicación: J Orthop Sports Phys Ther 51(4):CPG1–CPG80  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Martin 2021, J Orthop Sports Phys Ther 51(4):CPG1–CPG80 (guía de práctica clínica APTA; letra = grado de la recomendación)
2. Martin 2021, J Orthop Sports Phys Ther 51(4):CPG1–CPG80 (guía de práctica clínica APTA; letra = grado de la recomendación) · Liu 2025, BMC Sports Sci Med Rehabil 17:335 (metaanálisis de dosis) · McKeon 2008, Med Sci Sports Exerc 40(10):1810–1819 (ensayo aleatorizado, n = 31)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Tobillo y pie | tp21 · Inestabilidad Crónica del Tobillo | Pauta de tratamiento | 5 · cita de la pauta | 2 |

### Maxwell y Sterling 2013

Publicación: Man Ther 18:172–174  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Maxwell y Sterling 2013 (Man Ther 18:172–174; 62 con latigazo crónico, grado II–III, 124 lados del cuello; referencia: umbral de dolor al frío ≥13 °C con termotest; orden de los tests no aleatorizado). Tarjeta de consulta cervical (guía clínica cervical, ap. 5)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Test «Hielo sobre la nuca (hiperalgesia al frío)» | 4b · cita bajo el test | 1 |

### McCarthy y Busconi 1995

Publicación: Can J Surg  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. McCarthy y Busconi 1995 (Can J Surg; estudio único, n = 59 con dolor de cadera refractario; referencia: artroscopia, rotura labral), LR calculadas en Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med)
2. McCarthy y Busconi 1995 (Can J Surg; estudio único, n = 59 con dolor de cadera refractario; referencia: artroscopia, rotura labral), LR calculadas en Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med). En contra: Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test de Thomas» | 4b · cita bajo el test | 1 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Thomas» | 4b · cita bajo el test | 2 |

### McKeon 2008

Publicación: Med Sci Sports Exerc 40(10):1810–1819  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Ejercicio propioceptivo y neuromuscular para la estabilidad postural dinámica y la estabilidad percibida (A). Terapia manual —movilizaciones graduadas, manipulación y movilización con movimiento en carga y sin carga— para la dorsiflexión en carga y el equilibrio dinámico a corto plazo (A); se puede combinar con el ejercicio (B). Tobillera o vendaje nunca como tratamiento único (B). La guía no fija dosis. Orientativo (metaanálisis de 26 ensayos, análisis de subgrupos exploratorio, certeza de muy baja a moderada): terapia manual 1–2 veces por semana durante 4 semanas o menos para el CAIT; entrenamiento multimodal 1–2 veces por semana durante 5–8 semanas para el FAAM. Protocolo concreto con ensayo (McKeon 2008, adultos jóvenes): 12 sesiones supervisadas de unos 20 min, 3 por semana durante 4 semanas: saltos a estabilización monopodal en 4 direcciones (10 por dirección), salto con alcance (5), saltos no anticipados siguiendo una secuencia, y equilibrio monopodal con ojos abiertos y cerrados. 7 niveles por tarea (saltos de 46, 69 y 91 cm, primero con ayuda de los brazos y luego con las manos en la cadera; al final, desde una plataforma de 15 cm); se sube de nivel tras 10 repeticiones sin error (5 en el salto con alcance). Mejoró la función autorreferida (FADI) y el equilibrio frente a no entrenar.
2. Martin 2021, J Orthop Sports Phys Ther 51(4):CPG1–CPG80 (guía de práctica clínica APTA; letra = grado de la recomendación) · Liu 2025, BMC Sports Sci Med Rehabil 17:335 (metaanálisis de dosis) · McKeon 2008, Med Sci Sports Exerc 40(10):1810–1819 (ensayo aleatorizado, n = 31)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp21 · Inestabilidad Crónica del Tobillo | Dosis (en el texto) | 5 · mención en el texto | 1 |
| Tobillo y pie | tp21 · Inestabilidad Crónica del Tobillo | Pauta de tratamiento | 5 · cita de la pauta | 2 |

### Metcalfe 2019

Publicación: JAMA 322(23):2323–33  
DOI: 10.1001/jama.2019.19413  
Última revisión: 2026-10 · Sin cambios: texto completo leído (PMC7583647); S, E, LR+ y LR− con sus IC coinciden en los cinco usos. Es la revisión más reciente sobre exploración clínica de la artrosis de cadera.

Citada como:

1. NICE NG226 (2022). Metcalfe 2019 (JAMA) para la rigidez matutina
2. Metcalfe 2019 (JAMA, Rational Clinical Examination: 6 estudios, 1110 pacientes; referencia: radiografía simple); LR+ IC 95 %: 3,0–6,0; LR− IC 0,11–0,54
3. Metcalfe 2019 (JAMA, Rational Clinical Examination: 6 estudios, 1110 pacientes; referencia: radiografía simple); LR+ IC 95 %: 1,7–6,0; LR− IC 0,31–0,60
4. Metcalfe 2019 (JAMA, Rational Clinical Examination: 6 estudios, 1110 pacientes; referencia: radiografía simple); 72 pacientes, LR+ IC 95 %: 1,3–29
5. Metcalfe 2019 (JAMA, Rational Clinical Examination: 6 estudios, 1110 pacientes; referencia: radiografía simple); LR+ IC 95 %: 2,4–8,4

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca1 · Artrosis de Cadera | Test «Criterio clínico combinado: Edad ≥45 + dolor en actividad + rigidez <1h» | 4b · cita bajo el test | 1 |
| Cadera | ca1 · Artrosis de Cadera | Test «Aducción de cadera disminuida» | 4b · cita bajo el test | 2 |
| Cadera | ca1 · Artrosis de Cadera | Test «Rotación Interna disminuida (<24°)» | 4b · cita bajo el test | 3 |
| Cadera | ca1 · Artrosis de Cadera | Test «Dolor posterior con sentadilla profunda» | 4b · cita bajo el test | 4 |
| Cadera | ca1 · Artrosis de Cadera | Test «Debilidad de abductores» | 4b · cita bajo el test | 5 |

### Molloy 2003

Publicación: J Bone Joint Surg Br 85-B(3)  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Pulgar sobre la gotera anterolateral con el pie en flexión plantar y, sin soltar, llevar a flexión dorsal completa. Positivo si la maniobra combinada provoca dolor o aumenta el que daba la presión sola. Molloy 2003, 73 pacientes con artroscopia: 37 verdaderos positivos, 4 falsos positivos (adherencias, artrosis), 2 falsos negativos, 30 verdaderos negativos → S 94,8 %, E 88 % (LR calculadas). Límites: todos ya iban a artroscopia (sin inestabilidad mecánica), el mismo cirujano exploraba y decidía operar, y valida el pinzamiento sinovial anterolateral, no el óseo.
2. Molloy 2003 (J Bone Joint Surg Br 85-B(3))

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp20 · Pinzamiento Anterior del Tobillo | Test «Signo de pinzamiento de Molloy» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp20 · Pinzamiento Anterior del Tobillo | Test «Signo de pinzamiento de Molloy» | 4b · cita bajo el test | 2 |

### Narvani 2003

Publicación: Knee Surg Sports Traumatol Arthrosc 11(6):403–8  
DOI: 10.1007/s00167-003-0390-7  
Última revisión: 2026-10 · Sin cambios: chasquido S 100 %, E 85 % y «Thomas ni sensible ni específico» comprobados en el resumen.

Citada como:

1. Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)
2. Si la sospecha persiste. Supino con ambas caderas en flexión completa; se sujeta la contralateral en flexión y la afectada se lleva a extensión completa fuera del borde de la camilla. Positivo: dolor conocido, bloqueo, chasquido o enganche (en el estudio: chasquido palpable o dolor). Si la cadera no llega a neutro, indica acortamiento de flexores, no lesión labral. Evidencia contradictoria: en McCarthy y Busconi, S 89 %, E 92 % (LR− 0,12); en Narvani 2003 solo fue positivo en 1 de 4 roturas (S 25 %). Por eso puntúa el LR+ pero un Thomas negativo no descarta.
3. McCarthy y Busconi 1995 (Can J Surg; estudio único, n = 59 con dolor de cadera refractario; referencia: artroscopia, rotura labral), LR calculadas en Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med). En contra: Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Chasquido doloroso» | 4b · cita bajo el test | 1 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Thomas» (en `criterio`) | 4b · mención en el texto | 2 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Thomas» | 4b · cita bajo el test | 3 |

### Netterström-Wedin 2021

Publicación: Phys Ther Sport 49:214–26  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Palpación del LTPAI (la más sensible). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: la palpación del LTPAI sola da resultados contradictorios (Frey 2017: S 95 %, E 86 %; Großterlinden 2016: S 43 %, E 52 %; recogidos en Netterström-Wedin 2021). La LR− 0,28 (IC 0,09–0,89) de Sman 2015 es de otra cosa: dolor en cualquiera de cinco estructuras de la sindesmosis (S 92 %, E 29 %).
2. Tarjeta de consulta tobillo y pie (ap. 5); Sman 2015 (Br J Sports Med, publicado en línea en 2013); Netterström-Wedin 2021 (Phys Ther Sport 49:214–26)
3. squeeze test (la más específica). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: Sman 2015 (RM de referencia) da S 26 %, E 88 %, LR+ 2,15 (IC 0,86–5,39); agrupado en Netterström-Wedin 2021 (4 estudios, 428 participantes), S 32 %, E 85 %, LR+ 3,16 (IC 0,95–10,49), LR− 0,77. Los dos intervalos de la LR+ cruzan el 1.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» | 4b · cita bajo el test | 2 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Squeeze test» (en `criterio`) | 4b · mención en el texto | 3 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Squeeze test» | 4b · cita bajo el test | 2 |

### NICE NG226

Publicación: Guía NICE (2022)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: solo respalda el diagnóstico clínico (edad ≥45, dolor con la actividad, rigidez matutina ausente o ≤30 min), sin S ni E; no puntúa. No se pudo abrir nice.org.uk (bloqueado por la red) para comprobar si hay actualización.

Citada como:

1. NICE NG226 (2022). Metcalfe 2019 (JAMA) para la rigidez matutina
2. NICE NG226 (2022)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca1 · Artrosis de Cadera | Test «Criterio clínico combinado: Edad ≥45 + dolor en actividad + rigidez <1h» | 4b · cita bajo el test | 1 |
| Rodilla | ro1 · Artrosis de Rodilla | Test «Criterio combinado: Edad ≥45 + dolor en actividad + rigidez <30 min» | 4b · cita bajo el test | 2 |

### Nunes 2013

Publicación: Phys Ther Sport 14:54–9  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Nunes 2013 (Phys Ther Sport 14:54–9; revisión sistemática con metaanálisis, 5 estudios, 2 de buena calidad)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro3 · Dolor Patelofemoral (Síndrome) | Test «Dolor anterior durante sentadilla» | 4b · cita bajo el test | 1 |

### Pålsson 2020

Publicación: Knee Surg Sports Traumatol Arthrosc 28(10):3382–92  
DOI: 10.1007/s00167-020-06005-5  
Última revisión: 2026-10 · Sin cambios: texto completo leído (PMC7511272); RI en neutro S 29 % (13–44), E 94 % (86–100), kappa 0,43. El mismo estudio da para el FADIR S 80 %, E 24 % (ver Reiman 2015).

Citada como:

1. Pålsson 2020 (Knee Surg Sports Traumatol Arthrosc; 69 caderas de 63 pacientes derivados a atención especializada, 35 con SIFA; referencia: síntomas + morfología cam/pincer + respuesta a infiltración intraarticular). S IC 95 %: 13–44 %; E IC 86–100 %

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Rotación Interna de cadera en posición neutra <24°» | 4b · cita bajo el test | 1 |

### Paquin 2022

Publicación: Arch Physiother 12:26  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Demont 2022 (Musculoskelet Sci Pract, metaanálisis, 4 estudios, n = 182; frente a cefalea facetaria cervical baja, migraña, cefaleas concomitantes o asintomáticos; certeza moderada. S IC 95 %: 70–92 %; E IC 95 %: 71–91 %; LR+ IC 2,6–9,5; LR− IC 0,1–0,4; 4 estudios de cohorte prospectivos de Hall y Ogince, 2007–2010; riesgo de sesgo por la selección de pacientes). FRT normal en cervicogénica de C2–C3/C3–C4: Getsoian 2020 (BMJ Open, bloqueos diagnósticos controlados), citado en Demont 2022. Precauciones: Paquin 2022 (Arch Physiother 12:26, artículo de opinión)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce4 · Cefalea Cervicogénica | Test «Test de Flexión-Rotación Cervical (CFRT)» | 4b · cita bajo el test | 1 |

### Park 2005

Publicación: J Bone Joint Surg Am  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Park 2005 (J Bone Joint Surg Am; n = 552 operados con artroscopia, 215 roturas completas; tabla V)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h3 · Rotura del Manguito Rotador | Test «Cluster A, confirmar: arco doloroso + drop arm + debilidad en RE, los tres positivos» | 4b · cita bajo el test | 1 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Cluster A, descartar: arco doloroso, drop arm y debilidad en RE, los tres negativos (si se cumple, marcar «Negativo»)» | 4b · cita bajo el test | 1 |

### Park 2008

Publicación: Arch Phys Med Rehabil 89:738–742  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Park 2008 (Arch Phys Med Rehabil 89:738–742; prospectivo, un solo radiólogo)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co2 · Tendinopatía Medial (Epicondilalgia Medial / Codo de Golfista) | Test «Ecografía (si se dispone de informe)» | 4b · cita bajo el test | 1 |

### Park 2019

Publicación: Medicine 98:e15497  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Park 2019 (Medicine 98:e15497): punto de máximo dolor en la línea radiocapitelar en 20 de 24
2. Park 2019 (Medicine 98:e15497; retrospectivo, n = 24 frente a 56)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co6 · Pinzamiento Posterolateral por Plica Radiocapitelar | Test «Dolor posterolateral en línea articular radiocapitelar a la palpación» | 4b · cita bajo el test | 1 |
| Codo | co6 · Pinzamiento Posterolateral por Plica Radiocapitelar | Test «Test de plica radiocapitelar posterolateral» | 4b · cita bajo el test | 2 |

### Peat 2006

Publicación: Ann Rheum Dis 65(10):1363–7  
DOI: 10.1136/ard.2006.051482  
Última revisión: 2026-10 · Texto completo leído (PMC1798313, tabla 3). Más recientes en la misma dirección, solo resumen: Miguel 2019 (Clin Rheumatol) y Wang 2024 (Arthritis Care Res).

Citada como:

1. Peat 2006 (Ann Rheum Dis 65:1363–7; transversal en población general, 788 personas de 50 años o más con dolor de rodilla; formato en árbol de los criterios; referencia: síntomas casi diarios + artrosis radiográfica; tabla 3: S IC 95 %: 35–47 %, E IC 95 %: 71–78 %)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro1 · Artrosis de Rodilla | Test «Criterios clínicos del ACR» | 4b · cita bajo el test | 1 |

### Pitcher 2024

Publicación: Foot Ankle Orthop 9(4)  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Dolor a la palpación directa del espacio (sobre todo 3.º–4.º); posible chasquido al palpar mientras se comprimen los metatarsianos. No puntúa: la compresión pulgar-índice del espacio (Mahadevan 2015) tiene S 96 %, pero su especificidad sale de un solo pie sin Morton; el chasquido de Mulder da LR+ 2,19 (IC 0,45–10,60; Dando, en Pitcher 2024).
2. Tarjeta de consulta tobillo y pie (ap. 5); Mahadevan 2015 (J Foot Ankle Surg 54:549–53); Pitcher 2024 (Foot Ankle Orthop 9(4))

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» | 4b · cita bajo el test | 2 |

### Rathleff 2020

Publicación: Orthop J Sports Med 8(4):2325967120911106  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Rathleff 2020, Orthop J Sports Med 8(4):2325967120911106 (serie de casos, n = 51, 10–14 años, sin grupo control: nivel de evidencia 4; pauta de su apéndice 1)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Reid 2014

Publicación: Phys Ther 94(4):466–476  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Reid 2014, Phys Ther 94(4):466–476 (ensayo aleatorizado doble ciego frente a placebo, n = 86)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce13 · Mareo Cervicogénico | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Reijman 2004

Publicación: Ann Rheum Dis 63(3):226–32  
DOI: 10.1136/ard.2003.010348  
Última revisión: 2026-10 · Solo resumen leído: en PMC (PMC1754907) el cuerpo es un PDF escaneado que no se pudo descargar.

Citada como:

1. Dolor de cadera y, además: (1) RI ≥15°, dolor en la RI, rigidez matutina ≤60 min y edad >50 años; o bien (2) RI <15° y VSG ≤45 mm/h (sin VSG: flexión ≤115°). La tarjeta cita solo la rama (1). En la muestra en la que se crearon (201 pacientes con dolor de cadera, frente a artritis reumatoide, espondiloartropatía y otras causas) daban S 86 % · E 75 % (Altman 1991), pero no puntúa: en atención primaria, en pacientes de 50 años o más, los criterios clínicos no concuerdan con los criterios del ACR que incluyen radiografía (kappa ≤ 0,11; Bierma-Zeinstra 1999), y una revisión los da por poco fiables en ese ámbito (Reijman 2004). La rotación interna disminuida, que forma parte del árbol, sí tiene cifras de atención primaria y puntúa sola.
2. Altman 1991 (Arthritis Rheum 34:505–14, criterios ACR; n = 201 con dolor de cadera, controles con dolor de cadera de otra causa). En atención primaria: Bierma-Zeinstra 1999 (J Rheumatol 26:1129–33; n = 227 de 50 años o más, derivados a radiografía por su médico de cabecera) y Reijman 2004 (Ann Rheum Dis 63:226–32, revisión sistemática de definiciones de artrosis de cadera)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca1 · Artrosis de Cadera | Test «Criterios clínicos ACR (árbol de clasificación)» (en `criterio`) | 4b · mención en el texto | 1 |
| Cadera | ca1 · Artrosis de Cadera | Test «Criterios clínicos ACR (árbol de clasificación)» | 4b · cita bajo el test | 2 |

### Reiman 2014

Publicación: J Athl Train 49:820–9  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Thompson: prono, pie fuera de la camilla; al comprimir la pantorrilla el tobillo no se mueve → S 96 % · E 93 % → derivación preferente. Maffulli 1998: 133 roturas confirmadas en cirugía y 28 controles con lesión posterior sin rotura (26 negativos; 2 dudosos contados como falsos positivos). LR de Reiman 2014 con esos datos: LR+ 13,71 (IC 95 % 3,54–51,24), LR− 0,04 (0,02–0,10). Límite: la especificidad sale de solo 28 controles.
2. Maffulli 1998 (Am J Sports Med 26:266–70); LR: Reiman 2014 (J Athl Train 49:820–9)
3. Hueco palpable, que se pierde con el tiempo. Maffulli 1998 (paciente despierto): S 73 %, E 89 %; LR de Reiman 2014: LR+ 6,64 (IC 95 % 2,32–19,91), LR− 0,30 (0,23–0,40). Es otro test que Thompson, pero en el mismo paciente: si los dos son positivos, el peso conjunto puede estar algo sobrestimado.
4. Batería progresiva: ETM bipodal → monopodal → saltos bipodales → monopodales, hasta reproducir; dolor localizado (1–2 dedos). EVA en cada escalón. Aquiles: la palpación no ayuda al diagnóstico. No puntúa: la única cifra de estos gestos es de Hutchison 2013 (estudio piloto, 10 tendinopatías; en Reiman 2014): ETM monopodal S 22 %, E 93 %, LR+ 3,14; salto S 43 %, E 87 %, LR+ 3,31, sin intervalo de confianza publicado.
5. Tarjeta de consulta tobillo y pie (ap. 5); Reiman 2014 (J Athl Train 49:820–9)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp3 · Rotura del Aquiles | Test «Thompson (Simmonds)» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp3 · Rotura del Aquiles | Test «Thompson (Simmonds)» | 4b · cita bajo el test | 2 |
| Tobillo y pie | tp3 · Rotura del Aquiles | Test «Hueco palpable» (en `criterio`) | 4b · mención en el texto | 3 |
| Tobillo y pie | tp3 · Rotura del Aquiles | Test «Hueco palpable» | 4b · cita bajo el test | 2 |
| Tobillo y pie | tp8 · Tendinopatía del Aquiles, Porción Media | Test «Batería progresiva de carga» (en `criterio`) | 4b · mención en el texto | 4 |
| Tobillo y pie | tp8 · Tendinopatía del Aquiles, Porción Media | Test «Batería progresiva de carga» | 4b · cita bajo el test | 5 |

### Reiman 2015

Publicación: Br J Sports Med  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral: 4 estudios, n = 319, referencia: cirugía; LR− IC 95 %: 0,02–0,93). Con artro-RM como referencia, LR− 0,45 (IC hasta 1,09). Estudios de baja calidad con pacientes de alta probabilidad previa. Antes: S 80 %, E 25–26 % sin fuente
2. Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral: 2 estudios, n = 27)
3. McCarthy y Busconi 1995 (Can J Surg; estudio único, n = 59 con dolor de cadera refractario; referencia: artroscopia, rotura labral), LR calculadas en Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med)
4. Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral: 4 estudios, n = 319, referencia: cirugía; LR− IC 95 %: 0,02–0,93). Con artro-RM como referencia, LR− 0,45 (IC hasta 1,09). Estudios de baja calidad con pacientes de alta probabilidad previa
5. McCarthy y Busconi 1995 (Can J Surg; estudio único, n = 59 con dolor de cadera refractario; referencia: artroscopia, rotura labral), LR calculadas en Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med). En contra: Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test FADDIR (Flexión-Aducción-Rotación Interna)» | 4b · cita bajo el test | 1 |
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test de flexión-rotación interna» | 4b · cita bajo el test | 2 |
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test de Thomas» | 4b · cita bajo el test | 3 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de flexión-rotación interna» | 4b · cita bajo el test | 2 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «FADDIR (valor agrupado)» | 4b · cita bajo el test | 4 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Thomas» | 4b · cita bajo el test | 5 |

### Saueressig 2021

Publicación: J Orthop Sports Phys Ther  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Han 2023 (eClinicalMedicine, revisión sistemática, 6 estudios; LR+ IC 95 %: 1,50–3,98, LR− 0,21–0,47; referencia: bloqueo anestésico). Misma regla que la tarjeta lumbar: 3 de 5 positivos. Saueressig 2021 (JOSPT, metaanálisis, 5 estudios): LR+ 2,13, LR− 0,33, certeza muy baja (GRADE); descarta mejor de lo que confirma

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Cluster «Tests de provocación SI (3 de 5)» | 4b · cita del cluster | 1 |

### Sman 2015

Publicación: Br J Sports Med  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Palpación del LTPAI (la más sensible). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: la palpación del LTPAI sola da resultados contradictorios (Frey 2017: S 95 %, E 86 %; Großterlinden 2016: S 43 %, E 52 %; recogidos en Netterström-Wedin 2021). La LR− 0,28 (IC 0,09–0,89) de Sman 2015 es de otra cosa: dolor en cualquiera de cinco estructuras de la sindesmosis (S 92 %, E 29 %).
2. Tarjeta de consulta tobillo y pie (ap. 5); Sman 2015 (Br J Sports Med, publicado en línea en 2013); Netterström-Wedin 2021 (Phys Ther Sport 49:214–26)
3. squeeze test (la más específica). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: Sman 2015 (RM de referencia) da S 26 %, E 88 %, LR+ 2,15 (IC 0,86–5,39); agrupado en Netterström-Wedin 2021 (4 estudios, 428 participantes), S 32 %, E 85 %, LR+ 3,16 (IC 0,95–10,49), LR− 0,77. Los dos intervalos de la LR+ cruzan el 1.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» | 4b · cita bajo el test | 2 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Squeeze test» (en `criterio`) | 4b · mención en el texto | 3 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Squeeze test» | 4b · cita bajo el test | 2 |

### Smith 2015

Publicación: Evid Based Med 20:88–97  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Smith 2015 (Evid Based Med 20:88–97; metaanálisis, 9 estudios, n = 1234, calidad metodológica en general baja; referencia: artroscopia o RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro2 · Lesión Meniscal | Test «Test de McMurray» | 4b · cita bajo el test | 1 |
| Rodilla | ro2 · Lesión Meniscal | Test «Sensibilidad a la palpación de la línea articular» | 4b · cita bajo el test | 1 |

### Solomon 2001

Publicación: JAMA 286:1610–20  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Rotación tibial + extensión de rodilla desde posición de flexión completa. Positivo: chasquido o dolor en línea articular. S IC 95 %: 45–74 %; E IC 69–92 %. En contra: Solomon 2001 (JAMA) da LR+ 1,3 (IC 0,9–1,7) y LR− 0,8.
2. Dolor a la palpación directa de la línea articular medial o lateral. S IC 95 %: 73–90 %; E IC 61–94 %. En contra: Solomon 2001 (JAMA) da LR+ 0,9 y LR− 1,1.
3. Solomon 2001 (JAMA 286:1610–20, Rational Clinical Examination); LR+ IC 95 %: 1,4–5,1; LR− IC 0,2–0,7

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro2 · Lesión Meniscal | Test «Test de McMurray» (en `criterio`) | 4b · mención en el texto | 1 |
| Rodilla | ro2 · Lesión Meniscal | Test «Sensibilidad a la palpación de la línea articular» (en `criterio`) | 4b · mención en el texto | 2 |
| Rodilla | ro2 · Lesión Meniscal | Test «Combinación de tests clínicos» | 4b · cita bajo el test | 3 |

### Suri 2010

Publicación: JAMA  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Suri 2010 (JAMA, revisión RCE; IC 95 %: 1,9–95)
2. Suri 2010 (JAMA, revisión RCE; IC 95 %: 1,4–13)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Marcha con base amplia» | 4b · cita bajo el test | 1 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Romberg alterado» | 4b · cita bajo el test | 2 |

### Tawa 2017

Publicación: —  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Tawa 2017 (revisión sistemática)
2. Tawa 2017 (revisión sistemática; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Test «Reflejos rotuliano (L3–L4) y aquíleo (L5–S1)» | 4b · cita bajo el test | 1 |
| Lumbar | lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Test «Sensibilidad (algodón, diapasón, pinchazo)» | 4b · cita bajo el test | 2 |

### Thoomes 2026

Publicación: BMC Musculoskelet Disord  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Rango de 5 estudios; la técnica y la interpretación varían y no hay valor agrupado. E con certeza baja, S y LR con certeza muy baja (Thoomes 2026, BMC Musculoskelet Disord, actualización de la revisión de 2018)
2. Thoomes 2026 (BMC Musculoskelet Disord, actualización de la revisión sistemática de 2018; metaanálisis bivariado, tabla 4)
3. Thoomes 2026 (BMC Musculoskelet Disord, actualización de la revisión sistemática de 2018; metaanálisis de Apelby-Albrecht 2013 y Grondin, tabla 4)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce3 · Radiculopatía Cervical | Test «Test de Spurling (Compresión Foraminal)» | 4b · cita bajo el test | 1 |
| Cervical | ce3 · Radiculopatía Cervical | Test «Upper Limb Neurodynamic Test (ULNT) 1» | 4b · cita bajo el test | 2 |
| Cervical | ce3 · Radiculopatía Cervical | Test «Shoulder Abduction Relief Test» | 4b · cita bajo el test | 2 |
| Cervical | ce3 · Radiculopatía Cervical | Test «Combinación de 4 ULNT (ULNT1 y ULNT2a mediano, ULNT2b radial, ULNT3 cubital)» | 4b · cita bajo el test | 3 |

### van Dijk 1996

Publicación: J Bone Joint Surg Br 78-B(6)  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Cajón anterior con mejor S y E a los 4–6 días; sin signo del surco, el LPAA no está roto del todo. No puntúa: van Dijk 1996 (160 inversiones; referencia: cirugía o artrografía) da para la exploración diferida completa (día 5: hinchazón, hematoma, palpación y cajón) S 96 %, E 84 %, pero para el cajón solo el texto (S 86 %, E 74 %) no cuadra con su propia tabla, y lo que valida es rotura frente a ligamentos intactos, no esguince frente a otros diagnósticos.
2. Tarjeta de consulta tobillo y pie (ap. 5); van Dijk 1996 (J Bone Joint Surg Br 78-B(6))

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «Cajón anterior (a los 4–6 días)» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «Cajón anterior (a los 4–6 días)» | 4b · cita bajo el test | 2 |

### Walton 2004

Publicación: J Bone Joint Surg Am  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Walton 2004 (J Bone Joint Surg Am; 38 con dolor localizado en la AC, 28 con respuesta a la infiltración; tabla I)
2. Walton 2004 (J Bone Joint Surg Am; 38 con dolor localizado en la AC, 28 con respuesta a la infiltración; tablas I y IV)
3. Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6).
4. Chronopoulos 2004 (Am J Sports Med) y Walton 2004 (J Bone Joint Surg Am)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h7 · Artropatía Acromioclavicular | Test «Palpación directa de la articulación AC» | 4b · cita bajo el test | 1 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Paxinos + gammagrafía ósea combinados» | 4b · cita bajo el test | 2 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» (en `criterio`) | 4b · mención en el texto | 3 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» | 4b · cita bajo el test | 4 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Test de Paxinos» | 4b · cita bajo el test | 2 |

### Warden 2007

Publicación: Am J Sports Med 35:427–36  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Warden 2007 (Am J Sports Med 35:427–36; 30 con tendinopatía rotuliana clínica frente a 33 asintomáticos)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro5 · Tendinopatía Rotuliana | Test «Ecografía o RM (si se dispone de informe)» | 4b · cita bajo el test | 1 |

### Williams 2025

Publicación: J Man Manip Ther  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Williams 2025 (J Man Manip Ther, revisión de revisiones sistemáticas): evidencia del PAIVM frente a bloqueo facetario

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce1 · Disfunción Articular Cervical | Test «PAIVM (Movilidad Intervertebral Pasiva Accesoria) C0-C3» | 4b · cita bajo el test | 1 |

### Wong 2022

Publicación: Curr Rev Musculoskelet Med 15:38–52  
DOI: 10.1007/s12178-022-09745-8  
Última revisión: 2026-10 · Sin cambios: solo describe la técnica, no aporta cifras.  
Nota: Solo para la técnica del test.

Citada como:

1. McCarthy y Busconi 1995 (Can J Surg; estudio único, n = 59 con dolor de cadera refractario; referencia: artroscopia, rotura labral), LR calculadas en Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med)
2. McCarthy y Busconi 1995 (Can J Surg; estudio único, n = 59 con dolor de cadera refractario; referencia: artroscopia, rotura labral), LR calculadas en Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med). En contra: Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test de Thomas» | 4b · cita bajo el test | 1 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Thomas» | 4b · cita bajo el test | 2 |

### Zaslav 2001

Publicación: J Shoulder Elbow Surg 10:23–27  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Zaslav 2001 (J Shoulder Elbow Surg 10:23–27)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h5 · Lesión Labral Superior (SLAP) | Test «Test de Resistencia a Rotación Interna» | 4b · cita bajo el test | 1 |

### Zhang 2010

Publicación: Ann Rheum Dis 69:483–9  
DOI: —  
Última revisión: **sin revisar**

Citada como:

1. Zhang 2010 (Ann Rheum Dis 69:483–9, recomendaciones EULAR de diagnóstico de artrosis de rodilla, tabla 2; referencia: diagnóstico clínico o radiográfico; 4 estudios, 2 de casos y controles, n = 942; LR+ IC 95 %: 1,90–2,63)
2. Zhang 2010 (Ann Rheum Dis 69:483–9, recomendaciones EULAR de diagnóstico de artrosis de rodilla, tabla 2; referencia: diagnóstico clínico o radiográfico; 3 estudios, 1 de casos y controles, n = 3108; LR+ IC 95 %: 4,94–28,22)
3. Zhang 2010 (Ann Rheum Dis 69:483–9, recomendaciones EULAR de diagnóstico de artrosis de rodilla, tabla 2; referencia: diagnóstico clínico o radiográfico; 6 estudios, n = 3661; sin IC publicado)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro1 · Artrosis de Rodilla | Test «Crepitación articular» | 4b · cita bajo el test | 1 |
| Rodilla | ro1 · Artrosis de Rodilla | Test «Agrandamiento óseo» | 4b · cita bajo el test | 2 |
| Rodilla | ro1 · Artrosis de Rodilla | Test «Restricción de ROM» | 4b · cita bajo el test | 3 |

## 3. Otras fuentes del contenido

Contenido que no lleva un campo `fuente` pero tiene origen conocido.

| Región | Qué | Fase | Fuente |
|---|---|---|---|
| Cadera | Recuadro «DERIVACIÓN URGENTE · FRACTURA DE ESTRÉS DEL CUELLO FEMORAL» | 2 | Literal de la tarjeta de consulta (URGENCIA) |
| Cervical | Recuadro «URGENCIAS HOY · disfunción arterial · lesión tras traumatismo · cefalea con signos de alarma» | 2 | Literal de la tarjeta de consulta (URGENCIA) |
| Lumbar | Recuadro «URGENCIAS HOY · CAUDA EQUINA» | 2 | Literal de la tarjeta de consulta (URGENCIA) |
| Lumbar | Criterio compuesto · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 | Criterio de Goodman (cap. 14): 2 de 4 → sensibilidad 70%, especificidad 81%; 3 de 4 → especificidad cercana al 100%. No es un diagnóstico. |
| Rodilla | Recuadro «URGENCIAS · TVP · ARTRITIS SÉPTICA · APARATO EXTENSOR · BURSA CON FIEBRE · NEUROVASCULAR» | 2 | Literal de la tarjeta de consulta (URGENCIA) |
| Tobillo y pie | Recuadro «URGENCIAS · COMPARTIMENTAL Y NEUROVASCULAR · ARTRITIS INFECCIOSA · ROTURA DEL AQUILES · OTTAWA» | 2 | Literal de la tarjeta de consulta (URGENCIA) |
| Todas | Formulario previo, cara 1 (`formularios/comun.js`) | 1 | Literal de `guia-de-consulta/tools/plantilla_formularios.js` (cara 1) |
| Ver sección 1 | Formulario previo, cara 2 (`formularios/<región>.js`) | 1 y 4 | Literal de `guia-de-consulta/data/formulario_<región>.js` |

Las fuentes que faltan para las dosis están en `docs/dosis-pendientes-fuentes.md`.

## 4. Tests sin fuente

Tests sin `fuente` (los miembros de un cluster con `fuente` no cuentan: la cita del cluster los cubre).
«Puntúa» = sí: sus cifras mueven la puntuación de la fase 4b sin que la app diga de dónde salen.

### Hombro (8)

| Hipótesis | Test | Cifras | Puntúa |
|---|---|---|---|
| h1 · Capsulitis Adhesiva | Abducción pasiva glenohumeral <80° | S 83-100% VPP (para capsulitis confirmada por volumen capsular <12 mL) | no |
| h1 · Capsulitis Adhesiva | Test de Rotación Externa (brazo neutro al lado, codo 90°) | — | no |
| h6 · Disfunción Cervical con Dolor Referido a Hombro | Test de Spurling (Compresión Foraminal) | — | no |
| h6 · Disfunción Cervical con Dolor Referido a Hombro | Movilidad Glenohumeral Pasiva (PROM) | — | no |
| h8 · Discinesia Escapular | Observación visual de asimetría escapular (winging, tilting) | — | no |
| h8 · Discinesia Escapular | Test de Asistencia Escapular | — | no |
| h9 · Disfunción de Primera Costilla (Zona Cervicotorácica) | Palpación posteroanterior de 1ª costilla | — | no |
| h9 · Disfunción de Primera Costilla (Zona Cervicotorácica) | Test de elevación del brazo post-movilización | — | no |

### Cadera (39)

| Hipótesis | Test | Cifras | Puntúa |
|---|---|---|---|
| ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test FABER (Flexión-Abducción-Rotación Externa) | — | no |
| ca3 · Desgarro del Labrum Acetabular | Apoyo Monopodal <30 segundos | — | no |
| ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test de Abducción Resistida de Cadera | — | no |
| ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Marcha de Trendelenburg | — | no |
| ca5 · Debilidad de Abductores de Cadera | Test de Trendelenburg | — | no |
| ca5 · Debilidad de Abductores de Cadera | Dinamometría manual (HHD) de abductores | — | no |
| ca5 · Debilidad de Abductores de Cadera | Test de paso lateral + marcha en tándem combinados | — | no |
| ca6 · Disfunción de Control Neuromuscular de Cadera | Test de Sentadilla Monopodal (Single-Leg Squat) | — | no |
| ca6 · Disfunción de Control Neuromuscular de Cadera | Test de Step-Down | — | no |
| ca6 · Disfunción de Control Neuromuscular de Cadera | Marcha de Trendelenburg (observación) | — | no |
| ca7 · Síndrome Glúteo Profundo (Síndrome Piriforme) | Test de estiramiento del piriforme en sedestación | — | no |
| ca7 · Síndrome Glúteo Profundo (Síndrome Piriforme) | Dolor con sedestación prolongada (>20 min) | — | no |
| ca8 · Pinzamiento Isquiofemoral | Test de marcha con zancada larga (Long-Stride Walking Test) | — | no |
| ca9 · Tendinopatía Proximal de Isquiotibiales | Sensibilidad a la palpación sobre tuberosidad isquiática | — | no |
| ca9 · Tendinopatía Proximal de Isquiotibiales | Dolor con test de fuerza de isquiotibiales | — | no |
| ca10 · Dolor Articular Sacroilíaco | Test de Compresión Pélvica | — | no |
| ca10 · Dolor Articular Sacroilíaco | Test de Patrick (FABER) | — | no |
| ca10 · Dolor Articular Sacroilíaco | Sin sensibilidad por encima de L5 | — | no |
| ca11 · Lesión Aguda de Ingle | Resistencia del grupo sospechoso | — | no |
| ca11 · Lesión Aguda de Ingle | Estiramiento del grupo sospechoso | — | no |
| ca12 · Ligamento Redondo e Inestabilidad | Movilidad aumentada | — | no |
| ca12 · Ligamento Redondo e Inestabilidad | Episodio de fallo | — | no |
| ca13 · Condropatía de Cadera | Dolor en reposo y nocturno con síntomas mecánicos | — | no |
| ca13 · Condropatía de Cadera | Rigidez | — | no |
| ca13 · Condropatía de Cadera | IMC >25 | — | no |
| ca14 · Neuropatías de Cadera e Ingle | Neurodinámico del femorocutáneo | — | no |
| ca14 · Neuropatías de Cadera e Ingle | Obturador: neurodinámico, sensibilidad del muslo medial y fuerza de aductores | — | no |
| ca14 · Neuropatías de Cadera e Ingle | Arch and twist de pie | — | no |
| ca15 · Sensibilización Central | Dolor en las AVD | — | no |
| ca15 · Sensibilización Central | Fatiga y mal sueño | — | no |
| ca15 · Sensibilización Central | Dificultades de memoria | — | no |
| ca15 · Sensibilización Central | Más comorbilidad; intolerancia al estrés, ansiedad o depresión | — | no |
| ca16 · Dolor Inguinal Relacionado con el Aductor | Estiramiento pasivo de aductores | — | no |
| ca17 · Dolor Inguinal Relacionado con el Psoas Ilíaco | Flexión resistida con cadera y rodilla a 90° | — | no |
| ca17 · Dolor Inguinal Relacionado con el Psoas Ilíaco | Flexión resistida o extensión pasiva en Thomas modificado | — | no |
| ca18 · Dolor Inguinal Relacionado con el Canal Inguinal | Sit-up recto u oblicuo resistido | — | no |
| ca18 · Dolor Inguinal Relacionado con el Canal Inguinal | Valsalva, tos o estornudo | — | no |
| ca18 · Dolor Inguinal Relacionado con el Canal Inguinal | Flexión resistida en Thomas modificado | — | no |
| ca19 · Dolor Inguinal Relacionado con el Pubis | Resistencia abdominal y squeeze | — | no |

### Cervical (22)

| Hipótesis | Test | Cifras | Puntúa |
|---|---|---|---|
| ce1 · Disfunción Articular Cervical | ROM Cervical Activo con CROM | — | no |
| ce2 · Disfunción Neuromuscular Cervical | Test de Flexión Craneocervical (CCFT) con biofeedback de presión | — | no |
| ce2 · Disfunción Neuromuscular Cervical | Test de Reposicionamiento Cabeza-Neutro | — | no |
| ce3 · Radiculopatía Cervical | Reflejos tendinosos (bíceps C6, tríceps C7) | — | no |
| ce4 · Cefalea Cervicogénica | PAIVM C0-C3 (segmento C1-C2 más sintomático) | — | no |
| ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | ROM Cervical Activo (reducción significativa) | — | no |
| ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Risk Assessment Score para WAD agudo | — | no |
| ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Síntomas de hiperalerta / PTSD | — | no |
| ce6 · Debilidad Muscular Cérvico-Escapular | Fuerza de Flexión Cervical (dinamometría) | — | no |
| ce6 · Debilidad Muscular Cérvico-Escapular | Fuerza de Extensión Cervical (dinamometría) | — | no |
| ce7 · Dolor Mecánico Cervical Inespecífico Crónico | ROM Cervical Activo (reducción en todas las direcciones) | — | no |
| ce7 · Dolor Mecánico Cervical Inespecífico Crónico | Test de reposicionamiento cabeza-neutro | — | no |
| ce8 · Mielopatía Espondilótica Cervical | Signo de Hoffmann | — | no |
| ce8 · Mielopatía Espondilótica Cervical | Clonus de tobillo/muñeca | — | no |
| ce8 · Mielopatía Espondilótica Cervical | Evaluación de marcha (alteración) | — | no |
| ce8 · Mielopatía Espondilótica Cervical | Hiperreflexia (ROT aumentados) | — | no |
| ce9 · Disfunción Postural Cérvico-Torácica | Evaluación postural de cabeza adelantada (Forward Head Posture) | — | no |
| ce9 · Disfunción Postural Cérvico-Torácica | Evaluación de cifosis torácica | — | no |
| ce10 · Disfunción de 1ª Costilla (Articulación Costo-Vertebral Superior) | Palpación de 1ª costilla (sensibilidad y restricción) | — | no |
| ce10 · Disfunción de 1ª Costilla (Articulación Costo-Vertebral Superior) | Restricción de rotación cervical ipsilateral | — | no |
| ce11 · Fatiga Muscular Cérvico-Escapular | Test de resistencia de flexores cervicales profundos | — | no |
| ce11 · Fatiga Muscular Cérvico-Escapular | Evaluación de fatiga en actividades funcionales prolongadas | — | no |

### Lumbar (11)

| Hipótesis | Test | Cifras | Puntúa |
|---|---|---|---|
| lu1 · Disfunción Segmentaria Lumbosacra (Déficit de Movilidad) | Evaluación de hipomovilidad segmentaria lumbar (PAIVM) | — | no |
| lu2 · Inestabilidad Espinal Lumbar (Déficit de Coordinación) | Evaluación de control motor en bipedestación | — | no |
| lu4 · Estenosis Espinal / Claudicación Neurogénica | Déficits sensoriales (L3-S1) | S ~50% · E ~80% | no |
| lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Fuerza por miotomas L1–S2 | — | no |
| lu6 · Dolor Lumbar Discogénico | Preferencia direccional | — | no |
| lu6 · Dolor Lumbar Discogénico | Observación: espalda plana o shift lateral | — | no |
| lu7 · Dolor Lumbar Facetario | PA unilateral dolorosa o con menos movilidad | — | no |
| lu7 · Dolor Lumbar Facetario | Sin signos radiculares y sin alivio con repetidos | — | no |
| lu8 · Dolor de la Articulación Sacroilíaca | No centraliza con movimientos repetidos | — | no |
| lu9 · Síndrome de Dolor Miofascial Lumbar | Punto hipersensible dentro de la banda | — | no |
| lu9 · Síndrome de Dolor Miofascial Lumbar | El paciente reconoce el dolor provocado | — | no |

### Rodilla (11)

| Hipótesis | Test | Cifras | Puntúa |
|---|---|---|---|
| ro3 · Dolor Patelofemoral (Síndrome) | Cluster diagnóstico: edad + localización + escaleras + palpación facetas + ROM extensión | — | no |
| ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test de Lachman | S 81–87% · E 85–97% | no |
| ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test de Cajón Anterior | S 64–83% · E 85–87% | no |
| ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test de Pivot Shift | S 55–59% · E 94–97% | no |
| ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Lever Sign Test | S 79–83% · E 91–92% | no |
| ro5 · Tendinopatía Rotuliana | Dolor localizado en polo inferior de rótula + palpación del tendón | — | no |
| ro5 · Tendinopatía Rotuliana | Dolor durante sentadilla en tabla inclinada (decline squat) | — | no |
| ro6 · Síndrome de la Banda Iliotibial | Test de Ober | — | no |
| ro6 · Síndrome de la Banda Iliotibial | Test de Compresión de Noble | — | no |
| ro7 · Bursitis de la Pata de Ganso | Dolor y tumefacción en cara medial de rodilla (inserción pata de ganso) | — | no |
| ro7 · Bursitis de la Pata de Ganso | Ecografía o RMN confirmatoria | — | no |

### Codo (14)

| Hipótesis | Test | Cifras | Puntúa |
|---|---|---|---|
| co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test de Thomsen (extensión resistida de muñeca) | — | no |
| co2 · Tendinopatía Medial (Epicondilalgia Medial / Codo de Golfista) | Dolor a la palpación del epicóndilo medial | — | no |
| co2 · Tendinopatía Medial (Epicondilalgia Medial / Codo de Golfista) | Dolor con flexión resistida de antebrazo y pronación | — | no |
| co3 · Capsulitis Adhesiva del Codo (Rigidez Post-traumática) | Limitación activa Y pasiva comparada con lado sano | — | no |
| co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test de valgo dinámico (maniobra de ordeño, test de valgo móvil de Mayo) | — | no |
| co5 · Inestabilidad Rotatoria Posterolateral (IRPL) | Test de cajón posterolateral / Test de pivote lateral | — | no |
| co5 · Inestabilidad Rotatoria Posterolateral (IRPL) | Dolor lateral con palpación del ligamento colateral radial | — | no |
| co7 · Rotura Distal del Bíceps | Test del Gancho (Hook Test) | — | no |
| co7 · Rotura Distal del Bíceps | Deformidad visible del contorno del bíceps + equimosis fosa antecubital | — | no |
| co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test de Tinel en túnel cubital | — | no |
| co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Evaluación de subluxación del nervio cubital | — | no |
| co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Electrodiagnóstico (velocidad de conducción nerviosa) | — | no |
| co9 · Síndrome del Túnel Radial (Compresión Nervio Interóseo Posterior) | Dolor en antebrazo proximal (NO en epicóndilo lateral) | — | no |
| co9 · Síndrome del Túnel Radial (Compresión Nervio Interóseo Posterior) | Dolor con extensión resistida del 3er dedo | — | no |
