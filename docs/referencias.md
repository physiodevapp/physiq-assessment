# Referencias bibliográficas

> **Archivo generado — no editar a mano.** Sale de `data/` y del registro `data/referencias.js` con
> `node tests/gen-referencias.mjs`; `node tests/unit.js` falla si no está al día.

Todas las referencias que cita el contenido clínico de la app y dónde se usa cada una.
Las citas viven en `data/<región>.js`: `fuente` de cada test y de cada cluster (se ve en la fase 4b,
bajo el test), `pronostico.fuente` y `dosisFuente` (fase 5, bajo el pronóstico y la pauta).
También se recogen las menciones a un estudio dentro de otros textos (el `criterio` de un test, la `dosis`)
y las `fuentes` del razonamiento de cada pregunta de cribado (fase 2, «¿Por qué?»).
Lo que es de la referencia y no de cada uso (revista, DOI, última revisión) vive en el registro
`data/referencias.js`, una entrada por referencia.

## Resumen

- **322** referencias de literatura, con **1318** usos.
- **4** tarjetas de consulta (repo guia-de-consulta), con **89** usos, basadas en Lluch 2020.
- **193** de 322 referencias del registro revisadas. Ver «Estado de revisión».
- **1** de 484 tests sin `fuente` (0 de ellos puntúan en la fase 4b). Ver «Tests sin fuente».

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
«razonamiento fase 2» = respalda el «¿Por qué?» de una pregunta de cribado (no cambia ninguna alerta);
«texto» = solo se menciona.

| Referencia | Afecta a | Usos | Última revisión |
|---|---|---|---|
| [Maffulli 1998](#maffulli-1998) | puntuación 4b · texto | 4 | **sin revisar** |
| [Bachmann 2003](#bachmann-2003) | puntuación 4b · razonamiento fase 2 · texto | 6 | **sin revisar** |
| [Molloy 2003](#molloy-2003) | puntuación 4b · texto | 2 | **sin revisar** |
| [O'Driscoll 2007](#odriscoll-2007) | puntuación 4b · texto | 2 | **sin revisar** |
| [Apelby-Albrecht 2013](#apelby-albrecht-2013) | puntuación 4b | 1 | **sin revisar** |
| [Devereaux y ElMaraghy 2013](#devereaux-y-elmaraghy-2013) | puntuación 4b | 2 | **sin revisar** |
| [Reiman 2014](#reiman-2014) | puntuación 4b · test 4b sin puntuar · texto | 6 | **sin revisar** |
| [Zwerus 2018](#zwerus-2018) | puntuación 4b · test 4b sin puntuar · texto | 18 | **sin revisar** |
| [Park 2019](#park-2019) | puntuación 4b · test 4b sin puntuar | 2 | **sin revisar** |
| [Campbell 2020](#campbell-2020) | puntuación 4b | 2 | **sin revisar** |
| [Getsoian 2020](#getsoian-2020) | puntuación 4b | 1 | **sin revisar** |
| [Demont 2022](#demont-2022) | puntuación 4b · test 4b sin puntuar · texto | 3 | **sin revisar** |
| [Gomes 2022](#gomes-2022) | puntuación 4b · texto | 2 | **sin revisar** |
| [Paquin 2022](#paquin-2022) | puntuación 4b | 1 | **sin revisar** |
| [Thoomes 2026](#thoomes-2026) | puntuación 4b · test 4b sin puntuar | 4 | **sin revisar** |
| [Goodman 2018](#goodman-2018) | cribado fase 2 · razonamiento fase 2 · texto | 119 | **sin revisar** |
| [Jonsson 2008](#jonsson-2008) | pauta | 1 | **sin revisar** |
| [McKeon 2008](#mckeon-2008) | pauta · texto | 2 | **sin revisar** |
| [Kuijper 2009](#kuijper-2009) | pauta · texto | 2 | **sin revisar** |
| [Kulig 2009](#kulig-2009) | pauta | 1 | **sin revisar** |
| [Rinkel 2013](#rinkel-2013) | pauta | 2 | **sin revisar** |
| [Reid 2014](#reid-2014) | pauta | 1 | **sin revisar** |
| [Warden 2014](#warden-2014) | pauta | 1 | **sin revisar** |
| [van Dijk 2016](#van-dijk-2016) | pauta | 1 | **sin revisar** |
| [Blanpied 2017](#blanpied-2017) | pauta · test 4b sin puntuar · texto | 29 | **sin revisar** |
| [Biz 2019](#biz-2019) | pauta | 1 | **sin revisar** |
| [Cascia 2019](#cascia-2019) | pauta | 1 | **sin revisar** |
| [Lubiatowski 2020](#lubiatowski-2020) | pauta | 1 | **sin revisar** |
| [Martin 2021](#martin-2021) | pauta | 2 | **sin revisar** |
| [Lucado 2022](#lucado-2022) | pauta · test 4b sin puntuar · texto | 3 | **sin revisar** |
| [Koc 2023](#koc-2023) | pauta | 1 | **sin revisar** |
| [Siemensma 2023](#siemensma-2023) | pauta | 1 | **sin revisar** |
| [Chimenti 2024](#chimenti-2024) | pauta | 1 | **sin revisar** |
| [Bateman 2025](#bateman-2025) | pauta | 1 | **sin revisar** |
| [Caliandro 2025](#caliandro-2025) | pauta | 1 | **sin revisar** |
| [Liu 2025](#liu-2025) | pauta | 1 | **sin revisar** |
| [Quzli 2025](#quzli-2025) | pauta | 1 | **sin revisar** |
| [Wistow 2025](#wistow-2025) | pauta | 1 | **sin revisar** |
| [See 2026](#see-2026) | pauta | 1 | **sin revisar** |
| [NICE NG19](#nice-ng19) | pronóstico · razonamiento fase 2 | 2 | **sin revisar** |
| [Lluch 2020](#1-tarjetas-de-consulta) | pronóstico · test 4b sin puntuar | 89 | **sin revisar** |
| [Hermena y Slane 2025](#hermena-y-slane-2025) | pronóstico · test 4b sin puntuar · razonamiento fase 2 | 5 | **sin revisar** |
| [van Dijk 1996](#van-dijk-1996) | test 4b sin puntuar · texto | 2 | **sin revisar** |
| [O'Driscoll 2005](#odriscoll-2005) | test 4b sin puntuar · texto | 4 | **sin revisar** |
| [Dorf 2007](#dorf-2007) | test 4b sin puntuar · texto | 2 | **sin revisar** |
| [Jull 2007](#jull-2007) | test 4b sin puntuar | 1 | **sin revisar** |
| [Appelboam 2008](#appelboam-2008) | test 4b sin puntuar · razonamiento fase 2 · texto | 6 | **sin revisar** |
| [Park 2008](#park-2008) | test 4b sin puntuar | 1 | **sin revisar** |
| [Ochi 2011](#ochi-2011) | test 4b sin puntuar · texto | 2 | **sin revisar** |
| [Ochi 2012](#ochi-2012) | test 4b sin puntuar · texto | 6 | **sin revisar** |
| [Maxwell y Sterling 2013](#maxwell-y-sterling-2013) | test 4b sin puntuar | 1 | **sin revisar** |
| [Mahadevan 2015](#mahadevan-2015) | test 4b sin puntuar · texto | 2 | **sin revisar** |
| [Sman 2015](#sman-2015) | test 4b sin puntuar · texto | 4 | **sin revisar** |
| [Netterström-Wedin 2021](#netterström-wedin-2021) | test 4b sin puntuar · texto | 4 | **sin revisar** |
| [Karanasios 2022](#karanasios-2022) | test 4b sin puntuar | 2 | **sin revisar** |
| [Pitcher 2024](#pitcher-2024) | test 4b sin puntuar · texto | 2 | **sin revisar** |
| [Bergman 2025](#bergman-2025) | test 4b sin puntuar · razonamiento fase 2 | 2 | **sin revisar** |
| [Margetis y Donnally 2025](#margetis-y-donnally-2025) | test 4b sin puntuar · razonamiento fase 2 | 7 | **sin revisar** |
| [Williams 2025](#williams-2025) | test 4b sin puntuar | 1 | **sin revisar** |
| [Menon y Rednam 2026](#menon-y-rednam-2026) | test 4b sin puntuar · razonamiento fase 2 | 2 | **sin revisar** |
| [Deeb y Maher 2026 (Raynaud)](#deeb-y-maher-2026-raynaud) | razonamiento fase 2 | 3 | **sin revisar** |
| [NICE NG125](#nice-ng125) | razonamiento fase 2 | 1 | **sin revisar** |
| [NICE NG158](#nice-ng158) | razonamiento fase 2 · texto | 22 | **sin revisar** |
| [NICE NG38](#nice-ng38) | razonamiento fase 2 | 1 | **sin revisar** |
| [NICE NG89](#nice-ng89) | razonamiento fase 2 | 2 | **sin revisar** |
| [Barcelos 2014](#barcelos-2014) | razonamiento fase 2 | 1 | **sin revisar** |
| [Goebel 2018](#goebel-2018) | razonamiento fase 2 · texto | 9 | **sin revisar** |
| [Kim y Chang 2021](#kim-y-chang-2021) | razonamiento fase 2 | 1 | **sin revisar** |
| [Goodfriend 2022](#goodfriend-2022) | razonamiento fase 2 | 1 | **sin revisar** |
| [Rhodes 2022](#rhodes-2022) | razonamiento fase 2 | 1 | **sin revisar** |
| [Adigun 2023](#adigun-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Agrawal y Tiwari 2023](#agrawal-y-tiwari-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Ashley y Lui 2023](#ashley-y-lui-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Beloor Suresh y Asuncion 2023](#beloor-suresh-y-asuncion-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Chen 2023](#chen-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Cunha 2023](#cunha-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Gheewala 2023](#gheewala-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Jeanmonod y Varacallo 2023](#jeanmonod-y-varacallo-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Kaplan y Kanwal 2023](#kaplan-y-kanwal-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Khan y Bollu 2023](#khan-y-bollu-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [King y Lowery 2023](#king-y-lowery-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Lacy 2023](#lacy-2023) | razonamiento fase 2 | 3 | **sin revisar** |
| [LaPelusa y Dave 2023](#lapelusa-y-dave-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Leslie 2023](#leslie-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [McMordie 2023](#mcmordie-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Pana y Saggu 2023](#pana-y-saggu-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Raj 2023](#raj-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Rushton 2023](#rushton-2023) | razonamiento fase 2 | 4 | **sin revisar** |
| [Sekhon 2023](#sekhon-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Sevy 2023](#sevy-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Shahid 2023](#shahid-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Shamrock 2023](#shamrock-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Singleton y Hefner 2023](#singleton-y-hefner-2023) | razonamiento fase 2 | 5 | **sin revisar** |
| [Smidt y Massey 2023](#smidt-y-massey-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Ziu 2023](#ziu-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Bodman 2024](#bodman-2024) | razonamiento fase 2 | 2 | **sin revisar** |
| [Brotman 2024](#brotman-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Fariduddin 2024](#fariduddin-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Feller 2024](#feller-2024) | razonamiento fase 2 | 5 | **sin revisar** |
| [Hall 2024](#hall-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Hantzidiamantis 2024](#hantzidiamantis-2024) | razonamiento fase 2 | 2 | **sin revisar** |
| [Hunter 2024](#hunter-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Menger 2024](#menger-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Patil 2024](#patil-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Rout 2024](#rout-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Vyas 2024](#vyas-2024) | razonamiento fase 2 | 3 | **sin revisar** |
| [Zabaglo 2024](#zabaglo-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Benjamin y Lui 2025](#benjamin-y-lui-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Budha 2025](#budha-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Guthmiller 2025](#guthmiller-2025) | razonamiento fase 2 | 3 | **sin revisar** |
| [Hall 2025](#hall-2025) | razonamiento fase 2 | 2 | **sin revisar** |
| [Kaur 2025](#kaur-2025) | razonamiento fase 2 | 2 | **sin revisar** |
| [Khalil 2025](#khalil-2025) | razonamiento fase 2 | 2 | **sin revisar** |
| [Lleva 2025](#lleva-2025) | razonamiento fase 2 | 3 | **sin revisar** |
| [Pangia 2025](#pangia-2025) | razonamiento fase 2 | 2 | **sin revisar** |
| [Shams 2025](#shams-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Suha 2025](#suha-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Tavakoli 2025](#tavakoli-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Bhatti 2026](#bhatti-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Deeb y Maher 2026](#deeb-y-maher-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Denault y Launico 2026](#denault-y-launico-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Gillen 2026](#gillen-2026) | razonamiento fase 2 | 2 | **sin revisar** |
| [Jain 2026](#jain-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Moore y Tafti 2026](#moore-y-tafti-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Seaman y Bergman 2026](#seaman-y-bergman-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Stern 2026](#stern-2026) | razonamiento fase 2 | 2 | **sin revisar** |
| [Hutchison 2013](#hutchison-2013) | texto | 1 | **sin revisar** |
| [Großterlinden 2016](#großterlinden-2016) | texto | 1 | **sin revisar** |
| [Frey 2017](#frey-2017) | texto | 1 | **sin revisar** |
| [Katz 1995](#katz-1995) | puntuación 4b · test 4b sin puntuar | 2 | 2026-10 · Sin cambios: sus datos (Romberg y dolor de muslo con 30 s de extensión) están en Cook 2019 (PDF del usuario), con riesgo de sesgo bajo y las mismas cifras; los dos tests de lu4 pasan a citar Cook 2019. Su patrón de referencia es el diagnóstico del médico experto, no la RM: se corrige en la cita. |
| [Devillé 2000](#devillé-2000) | puntuación 4b | 2 | 2026-10 · Sustituida por van der Windt 2010 (revisión Cochrane del mismo grupo, con Devillé como autor; PDF del usuario): SLR y SLR cruzado de lu3 pasan a sus cifras agrupadas con LR publicadas. Se menciona como dato anterior. |
| [Litaker 2000](#litaker-2000) | puntuación 4b | 1 | 2026-10 · Sin cambios: PDF del usuario leído entero (2026-10). La LR 5,0 del grupo de validación sale de la tabla 4 (52 de 146 frente a 5 de 70); 9,84 es la del grupo de derivación. Sigue siendo un solo estudio retrospectivo de un cirujano, con artrografía como referencia; no se encontró validación externa entre los artículos que lo citan (Europe PMC). Hanchard 2013 (Cochrane) lo excluye; Zhao 2024 lo usa solo para el Hawkins. |
| [Solomon 2001](#solomon-2001) | puntuación 4b · texto | 3 | 2026-10 · Sin cambios: PDF del usuario leído; combinación LR+ 2,7 (1,4–5,1), LR− 0,4 (0,2–0,7), McMurray 1,3 / 0,8 e interlínea 0,9 / 1,1 coinciden con el resumen y la tabla 5. Hay una revisión posterior de la exploración compuesta, Rana 2026 (S 85 %, E 95 % en el menisco medial, sin LR): por decisión del usuario sigue mandando Solomon y Rana se cita en el criterio. |
| [Laslett 2003](#laslett-2003) | puntuación 4b · texto | 3 | 2026-10 · No leída directamente: sus cifras se toman de Laslett 2008 (ref. 52) y de Saueressig 2021 (fig. 3: S 0,91, E 0,78), que la incluye en su metaanálisis. Ambas leídas en PDF (2026-10). |
| [Bachmann 2004](#bachmann-2004) | puntuación 4b · razonamiento fase 2 | 2 | 2026-10 · Hay dos revisiones sistemáticas posteriores: Sims 2020 (LR− 0,07) y Kazemi 2023 (18 estudios, 6702 adultos; LR− 0,12). Por la regla de conflictos (mismo nivel, la más reciente), Kazemi 2023 pasa a dar las cifras de ro11 y de ro_t1; Bachmann se cita como concordante. |
| [Fritz 2005](#fritz-2005) | puntuación 4b · test 4b sin puntuar | 4 | 2026-10 · Sin cambios: PubMed (tests clínicos de inestabilidad lumbar, revisiones sistemáticas). Ferrari 2015 (Chiropr Man Therap, 10.1186/s12998-015-0058-7) confirma que solo Fritz 2005 estudió la precisión del test de inestabilidad en prono; Thomas 2026 (Cureus, 10.7759/cureus.108817, búsqueda hasta 12/2025) sigue citando su regla «flexión ≥ 53° o sin hipomovilidad» (LR+ 4,3) sin replicación externa. Leídas enteras en PMC. Estudios sueltos posteriores (Seyedhoseinpoor 2022, Areeudomwong 2020, Chatprem 2021) no leídos en texto completo. |
| [Laslett 2005](#laslett-2005) | puntuación 4b · test 4b sin puntuar · texto | 6 | 2026-10 · Sin cambios en las cifras: PDF releído entero (2026-10); tabla 2 (compresión LR+ 2,20, LR− 0,46; thigh thrust LR+ 2,80, LR− 0,18; LR publicadas, método score) y tablas 4–6 coinciden con las citas. Es un solo estudio de los creadores (48 pacientes no consecutivos, crónicos, 16 con bloqueo positivo). Agrupados en Han 2023 el thigh thrust (5 estudios) y la compresión (2) no llegan a LR+ 2 ni a LR− 0,5: los dos pasan a hallazgo en ca10 (decisión del usuario, 2026-10). Saueressig 2021 no la agrupa por ser la misma población que Laslett 2003. |
| [Park 2005](#park-2005) | puntuación 4b · texto | 3 | 2026-10 · Sin cambios: PDF del usuario leído entero (2026-10). Tabla V: 50 de 153 roturas completas frente a 4 de 195 controles con los tres test positivos (LR+ 15,57) y 14 de 153 frente a 114 de 195 con los tres negativos (LR 0,16), en 348 operados con los tres test hechos. La combinación sale de una regresión logística en la misma muestra, sin validación; ninguno de los artículos que lo citan (Europe PMC) la valida. Hermans 2013 lo clasifica como nivel IV y Hanchard 2013 (Cochrane) lo deja pendiente de clasificar. |
| [Hancock 2007](#hancock-2007) | puntuación 4b | 1 | 2026-10 · Sin cambios: ya superada por Han 2023, que es la que da las cifras; solo se menciona como dato anterior. |
| [Kastelein 2008](#kastelein-2008) | puntuación 4b | 1 | 2026-10 · Sin cambios: PDF del usuario leído; S 0,56, E 0,91, LR+ 6,4 (2,7–15,2) y LR− 0,5 (0,3–0,8) de la combinación coinciden con la tabla 5 (un solo fisioterapeuta exploró a todos los pacientes). PubMed (exploración clínica del LCM de rodilla, revisiones sistemáticas desde 2008) no encuentra ningún estudio ni revisión posterior de precisión diagnóstica de la exploración. |
| [Laslett 2008](#laslett-2008) | puntuación 4b · test 4b sin puntuar · texto | 3 | 2026-10 · Revisión narrativa, no un agrupado: PDF releído entero (2026-10). El S 91 % / E 78 % del cluster (E 87 % sin centralización; LR+ 4,16, LR− 0,12) lo toma de un solo estudio, su ref. 52 (Laslett 2003, Aust J Physiother). El cluster de ca10 pasa a las LR de Saueressig 2021 (decisión del usuario, 2026-10); Laslett 2008 queda citada para el contexto y la tabla 1. |
| [Lequesne 2008](#lequesne-2008) | puntuación 4b · test 4b sin puntuar · texto | 4 | 2026-10 · Cifras comprobadas en el resumen y en la tabla 2 de Kinsella 2024. La E se midió frente a controles sin dolor de cadera (casos y controles), lo que la infla: la derotación externa resistida pasa a hallazgo. |
| [Cook 2010](#cook-2010) | puntuación 4b | 1 | 2026-10 · Sin cambios: PubMed (pruebas clínicas de dolor femoropatelar desde 2013) no encuentra ninguna revisión sistemática posterior que agrupe la sentadilla. |
| [Suri 2010](#suri-2010) | puntuación 4b | 2 | 2026-10 · Parcial: el Romberg de lu4 pasa a Cook 2019 (revisión posterior, mismos datos de Katz 1995, LR+ 4,06); la marcha con base amplia sigue con Suri 2010 porque Cook 2019 no da su cifra. |
| [van der Windt 2010](#van-der-windt-2010) | puntuación 4b · test 4b sin puntuar | 3 | 2026-10 · Sin cambios: PubMed (revisiones de la exploración física en ciática o hernia discal desde 2011). Scaia 2012 (J Back Musculoskelet Rehabil, 7 estudios del SLR) no agrupa; Al Nezari 2013 (Spine J) trata la exploración neurológica, no el SLR; Tawa 2017 (BMC Musculoskelet Disord, leída entera en PMC) no hace metaanálisis y da una media del SLR (S 0,84, E 0,78) con patrones de referencia mezclados. La Cochrane, con metaanálisis y referencia quirúrgica, sigue siendo la mejor. |
| [Zhang 2010](#zhang-2010) | puntuación 4b | 3 | 2026-10 · Sin cambios: PDF del usuario leído; crepitación (S 0,89, E 0,60, LR 2,23, κ entre examinadores 0,23), agrandamiento óseo (0,55 / 0,95, LR 11,81) y movilidad restringida (0,17 / 0,96, LR 4,4) coinciden con la tabla 2. PubMed (recomendaciones EULAR y revisiones sistemáticas de diagnóstico clínico de artrosis de rodilla desde 2010) no encuentra ninguna posterior; las de EULAR de 2023 son de tratamiento. |
| [Cook 2011](#cook-2011) | puntuación 4b | 1 | 2026-10 · Sin cambios en las cifras: Cook 2019 (revisión sistemática, PDF del usuario) la incluye solo con sus ítems sueltos, sin el clúster, y le asigna riesgo de sesgo alto (QUADAS-2); no hay validación posterior del clúster. El aviso se añade a la cita. |
| [Hegedus 2012](#hegedus-2012) | puntuación 4b · test 4b sin puntuar · texto | 12 | 2026-10 · Sin cambios: PDF del usuario leído entero (2026-10). Las cifras de h2, h4 y h5 coinciden con su tabla 3. Pinzamiento con modelo HSROC/bivariante; aprehensión, recolocación y sorpresa con DerSimonian-Laird univariante (la aprehensión agrupa 2 estudios, n = 409, que por tamaño son Farber 2006 y Lo 2004, dos poblaciones distintas). El metaanálisis posterior de Zhao 2024 (bivariante, más estudios) da LR más bajas para el pinzamiento, pero tiene errores de extracción (la tabla 2×2 del arco doloroso de Park 2005 suma 718 pacientes de 552): se mantiene Hegedus y Zhao va como segunda cifra. Gismervik 2017 (efectos fijos, 2 estudios por test) y Hanchard 2013 (Cochrane, sin agrupar) no aportan nada mejor. |
| [Hermans 2013](#hermans-2013) | puntuación 4b · test 4b sin puntuar · texto | 7 | 2026-10 · Sin cambios: PDF del usuario leído entero (2026-10). Las cifras de h2 y h3 coinciden con su tabla 3 (la tabla 2, citada antes, solo describe los test). Los signos de retraso salen de un solo estudio (Miller 2008, 37 pacientes, 46 hombros, ecografía); la RE resistida de otro (Salaffi 2010, 203, ecografía); el empty can, de 3 estudios con modelo univariante de efectos aleatorios. Clasifica Park 2005 y Litaker 2000 como nivel IV. El agrupado posterior de Zhao 2024 mezcla roturas del subescapular y del supraespinoso en el signo de retraso en RI. |
| [Nunes 2013](#nunes-2013) | puntuación 4b | 1 | 2026-10 · Cita corregida (PDF del usuario): la revisión solo hizo metaanálisis del test de aprensión rotuliana; la cifra de la sentadilla (S 91 %, E 50 %, LR+ 1,8, LR− 0,2, tabla 3) es de un solo estudio, Cook 2010, que pasa a citarse. Mismas cifras, sin cambio de puntuación. PubMed (revisiones de tests clínicos de dolor femoropatelar desde 2013) no encuentra ninguna posterior. |
| [Smith 2015](#smith-2015) | puntuación 4b · test 4b sin puntuar | 3 | 2026-10 · Cifras actualizadas en ro2 (PDF del usuario, tabla 3): el metaanálisis es bivariante y publica LR, que antes no se usaban (se calculaban desde S y E): McMurray LR+ 3,2, LR− 0,52; interlínea LR+ 4,0, LR− 0,23. Con ellas el McMurray negativo deja de puntuar. Thessaly a 20° (S 75 %, E 87 %, I² 94 %) añadido como hallazgo. PubMed (metaanálisis de McMurray, interlínea y Thessaly desde 2015) no encuentra ninguno posterior; Rana 2026 solo agrupa la exploración compuesta. |
| [Genevay 2017](#genevay-2017) | puntuación 4b | 1 | 2026-10 · Sin cambios: PubMed (RAPIDH, validación o precisión diagnóstica; publicaciones de Genevay) no encuentra ninguna validación externa de los criterios RAPIDH. |
| [Grimaldi 2017](#grimaldi-2017) | puntuación 4b · test 4b sin puntuar · texto | 4 | 2026-10 · Cifras comprobadas en la tabla 2 de Kinsella 2024. La palpación y la abducción resistida pasan a las cifras agrupadas de Kinsella 2024; Grimaldi queda como dato del estudio de mayor calidad (y como fuente de la derotación, que pasa a hallazgo). |
| [Décary 2018](#décary-2018) | puntuación 4b | 6 | 2026-10 · Sin cambios: PDF de los tres artículos leídos (PLoS One en PMC; PM&R y Arch Phys Med Rehabil, del usuario): las cifras de ro2, ro3 y ro4 coinciden con sus tablas (PM&R, tabla del grupo traumático y tabla 6; Arch Phys Med Rehabil, tablas 3 y 4; PLoS One, tablas 6 y 7), incluidas las de la validación interna por bootstrap. PubMed (publicaciones de Décary sobre rodilla desde 2018 y validaciones de grupos de historia y exploración de rodilla) no encuentra ninguna validación externa de estos grupos. |
| [Cook 2019](#cook-2019) | puntuación 4b · test 4b sin puntuar | 3 | 2026-10 · Sin cambios: PubMed (revisiones sistemáticas de precisión diagnóstica de la historia y la exploración en estenosis lumbar desde 2019) solo encuentra Wang 2024 (J Med Internet Res) y Yang 2024 (Spine), de inteligencia artificial sobre imagen, no de exploración clínica. |
| [Metcalfe 2019](#metcalfe-2019) | puntuación 4b · test 4b sin puntuar | 5 | 2026-10 · Sin cambios: texto completo leído (PMC7583647); S, E, LR+ y LR− con sus IC coinciden en los cinco usos. Es la revisión más reciente sobre exploración clínica de la artrosis de cadera. |
| [Pålsson 2020](#pålsson-2020) | puntuación 4b · test 4b sin puntuar | 2 | 2026-10 · Sin cambios: texto completo leído (PMC7511272); RI en neutro S 29 % (13–44), E 94 % (86–100), kappa 0,43. El mismo estudio da para el FADIR S 80 %, E 24 % (ver Reiman 2015). |
| [Sims 2020](#sims-2020) | puntuación 4b · razonamiento fase 2 | 2 | 2026-10 · Sin cambios: PDF del usuario leído entero (antes solo el resumen); S 0,99, E 0,49, LR+ 1,86 y LR− 0,07 (0,02–0,24), 8 estudios y 7385 adultos, con modelo bivariante. Sigue citada como concordante con Kazemi 2023 (decisión del usuario). |
| [Saueressig 2021](#saueressig-2021) | puntuación 4b | 2 | 2026-10 · Sin cambios: PubMed (clústeres de provocación sacroilíaca, revisiones sistemáticas) no encuentra ninguna posterior; solo una carta sobre su método (Vraa 2022, JOSPT 52(1):49–50). PDF leído entero en la sesión de cadera (2026-10): metaanálisis bivariante (Reitsma, paquete mada), 5 estudios con doble o simple bloqueo; incluye el estudio de los creadores (Laslett 2003) y excluye Laslett 2005 por ser la misma población. S 0,83, E 0,59, LR+ 2,13 (1,2–3,9), LR− 0,33 (0,11–0,72), certeza muy baja. Pasa a ser la fuente del cluster de ca10 y de lu8 (decisión del usuario, se prefiere el bivariante como en ro4). |
| [Sokal 2022](#sokal-2022) | puntuación 4b | 4 | 2026-10 · Sin cambios: texto completo leído en PMC; las cifras de la tabla 4 (modelo bivariante) coinciden en los cuatro tests de ro4. Hay dos metaanálisis posteriores solo del Lever: Hesmerg 2024 (23 estudios, sin el del creador; S 79 %, E 92 %, LR+ 9,9, LR− 0,22; agrupación univariante de S y E) concuerda, y Hu 2024 (12 estudios, con el del creador) da E 78 %. Se citan en el criterio; por el método (bivariante, LCA sin otras lesiones ligamentosas) sigue mandando Sokal. |
| [Han 2023](#han-2023) | puntuación 4b · test 4b sin puntuar · texto | 8 | 2026-10 · Sin cambios: PubMed (precisión diagnóstica de la exploración clínica para origen discal, facetario o sacroilíaco, revisiones sistemáticas desde 2023) no encuentra ninguna revisión posterior de tests clínicos; Manchikanti 2026 (Pain Physician) trata de bloqueos facetarios, no de exploración. Tabla 1 releída en PMC en la sesión de cadera (2026-10): agrupa con Meta-DiSc 1.4, efectos aleatorios, sin decir si es univariante o bivariante; ≥3 tests positivos, 6 estudios, 276 pacientes, LR+ 2,44, LR− 0,31; thigh thrust 5 estudios, LR+ 1,13, LR− 0,91; compresión 2 estudios, LR+ 1,79, LR− 0,74. En ca10 da las cifras agrupadas de los tests sueltos; el cluster de ca10 y de lu8 usa Saueressig 2021 (bivariante), y Han 2023 queda como segunda cifra. |
| [Kazemi 2023](#kazemi-2023) | puntuación 4b · razonamiento fase 2 | 2 | 2026-10 · Sin cambios: texto completo leído en PMC; S 98 %, E 43 %, LR+ 1,56 y LR− 0,12 (0,05–0,26) coinciden. Agrupa con un modelo univariante (Meta-DiSc, DerSimonian-Laird), y Sims 2020 es bivariante; se mantiene por decisión del usuario (más estudios y LR− más conservadora) y se anota el modelo en la cita. PubMed (revisiones de la regla de Ottawa de rodilla desde 2020) no encuentra ninguna posterior. |
| [Kinsella 2024](#kinsella-2024) | puntuación 4b · test 4b sin puntuar | 5 | 2026-10 · Texto completo leído (tablas 2 y 3). En el texto el LR+ de la abducción resistida aparece como 13,39, que en la tabla 3 es la DOR; se usa el LR+ de la tabla (6,09). |
| [Zhao 2024](#zhao-2024) | puntuación 4b · texto | 6 | 2026-10 · Añadida: texto completo y figuras leídos en Europe PMC (2026-10). Metaanálisis con modelo bivariante (paquete mada) para S, E y LR. Errores de extracción: la tabla 2×2 del arco doloroso de Park 2005 suma 718 pacientes de 552, incluye el arco doloroso de Silva 2008 aunque su tabla 1 no lo recoge, y cuenta dos veces la cohorte ROW (Jain 2017 y Jain 2018) en el Jobe y otros tests; el signo de retraso en RI mezcla roturas del subescapular y del supraespinoso. Por eso va como segunda cifra, no sustituye a Hegedus 2012. |
| [Consenso de Zúrich IHiPRN](#consenso-de-zúrich-ihiprn) | pauta · texto | 4 | 2026-10 · Sin cambios: PubMed (SIFA y fisioterapia, consensos y revisiones desde 2022) no encuentra un consenso posterior del IHiPRN; el ensayo PhysioFIRST (Kemp 2026) se suma a la pauta de ca2 sin contradecirlo. |
| [NICE NG226](#nice-ng226) | pauta · test 4b sin puntuar | 4 | 2026-10 · Sin cambios: nice.org.uk leído (2026-10), la guía sigue siendo la de 2022, sin actualizaciones. Respalda el diagnóstico clínico de ro1 (sin S ni E; no puntúa) y su pauta (recomendaciones 1.3.1–1.3.11). |
| [NICE NG59](#nice-ng59) | pauta · pronóstico | 9 | 2026-10 · Sin cambios: nice.org.uk leído (2026-10), última actualización 29 de julio de 2026; las recomendaciones citadas (1.2.1, 1.2.6, 1.2.7 —corregida en 2026—, 1.3.1–1.3.3 y 1.3.6) dicen lo que recoge la app. |
| [Hölmich 1999](#hölmich-1999) | pauta | 1 | 2026-10 · Texto completo leído: la pauta de ca16 coincide con el panel 1 y los métodos. Corregido el trote (pasadas las 6 primeras semanas) y añadida la población (varones de 18 a 50 años). No se encontró un ensayo posterior que lo sustituya. |
| [Kelley 2013](#kelley-2013) | pauta · test 4b sin puntuar · texto | 3 | 2026-10 · Sin cambios: búsqueda en PubMed (2026-10) sin revisión de la guía de capsulitis adhesiva de JOSPT; sigue vigente junto con el consenso Salamh 2025. |
| [Mellor 2016](#mellor-2016) | pauta | 1 | 2026-10 · Sin cambios: protocolo del ensayo LEAP (ver Mellor 2018); las revisiones posteriores (Wang 2025, Cordeiro 2024) no dan una progresión de ejercicios más detallada. |
| [Al-Subahi 2017](#al-subahi-2017) | pauta | 1 | 2026-10 · Complementada: Trager 2024 (J Man Manip Ther, revisión sistemática con metaanálisis de 16 ensayos, PDF del usuario) actualiza el efecto de la terapia manual sacroilíaca (discapacidad: efecto moderado, certeza baja; dolor: sin efecto demostrado, certeza muy baja; ninguna técnica superior). Al-Subahi se mantiene para el ejercicio de estabilización, la duración de los programas y el vendaje. |
| [Logerstedt 2017](#logerstedt-2017) | pauta | 4 | 2026-10 · Sin cambios: PubMed (guías de JOSPT de rodilla desde 2017) no encuentra revisión de la guía de esguince de ligamentos; lo posterior son consensos quirúrgicos (esquina posterolateral, 2025; reconstrucción del LCA, 2026), de menos peso y sobre otra pregunta. |
| [Griffin 2018](#griffin-2018) | pauta | 1 | 2026-10 · Sin cambios: sigue siendo el ensayo de artroscopia frente a fisioterapia de la pauta de ca2; PubMed (SIFA y fisioterapia desde 2022) solo añade el ensayo PhysioFIRST (Kemp 2026), que compara dos programas de fisioterapia. |
| [Logerstedt 2018](#logerstedt-2018) | pauta | 1 | 2026-10 · Complementada: el consenso formal EU-US de 2024 (Prill 2025, acceso abierto) cubre el tratamiento sin cirugía, que la guía deja para su próxima revisión; la pauta de ro2 suma sus recomendaciones con su grado. La guía AAOS 2024 de patología meniscal aislada aguda (PDF completo del usuario) también se suma a la pauta de ro2 (opciones de consenso). |
| [Mellor 2018](#mellor-2018) | pauta | 1 | 2026-10 · Sin cambios: PubMed (tendinopatía glútea o dolor trocantéreo con ejercicio o educación desde 2022). El metaanálisis en red de Wang 2025 (J Orthop Surg Res 20:126, 19 ensayos, PMC11783921) sitúa el ejercicio primero para dolor y función, y el de Cordeiro 2024 (Sci Rep 14:3343, PMC10858207) lo encuentra mejor que la intervención mínima (certeza baja) e igual que la infiltración en dolor; ninguno da una pauta mejor que la del LEAP. Leídos en PMC (2026-10). |
| [Willy 2019](#willy-2019) | pauta | 1 | 2026-10 · Sin cambios: la guía holandesa (Ophey 2025), posterior y del mismo nivel, ya manda donde discrepan; no hay revisión de la guía de JOSPT. |
| [Kemp 2020](#kemp-2020) | pauta | 1 | 2026-10 · Sin cambios: PubMed (dolor de cadera relacionado con la articulación y fisioterapia, revisiones sistemáticas desde 2021) no encuentra una revisión posterior de las intervenciones; el ensayo PhysioFIRST (Kemp 2026), posterior, se suma a la pauta de ca2. |
| [Rathleff 2020](#rathleff-2020) | pauta | 2 | 2026-10 · Sin cambios: la revisión posterior de tratamientos de Osgood-Schlatter (Ndjonko 2026, Orthop J Sports Med, revisión de alcance, nivel 4) no aporta ningún ensayo ni pauta mejor. |
| [Serner 2020](#serner-2020) | pauta | 1 | 2026-10 · Sin cambios: la revisión sistemática más reciente sobre la lesión aguda del aductor (Farrell, Hatem y Bharam 2023, Am J Sports Med 51(13):3591–3603, doi 10.1177/03635465221140923; PDF del usuario leído entero, 2026-10) la incluye (ref. 40) y no aporta otra pauta: 30 estudios, síntesis narrativa sin metaanálisis; las roturas parciales se trataron siempre sin cirugía, con vuelta al deporte en 1–7 semanas. Da las medias de Serner 2020 (sin dolor a las 1,9 semanas, entrenamiento completo a las 6,9; recaída al año 7,4 %); la pauta de ca11 usa las medianas por grado del propio artículo. |
| [George 2021](#george-2021) | pauta | 8 | 2026-10 · Sin cambios: PubMed (guías de práctica clínica de lumbalgia en JOSPT y de la APTA desde 2021) no encuentra una revisión posterior de esta guía. |
| [Ammendolia 2022](#ammendolia-2022) | pauta · texto | 2 | 2026-10 · Sin cambios: es la actualización de la revisión Cochrane de 2013 y la más reciente que encontró la búsqueda en PubMed (tratamiento no quirúrgico de la estenosis lumbar) al incorporarla en 2026-10. |
| [Enseki 2023](#enseki-2023) | pauta · test 4b sin puntuar | 5 | 2026-10 · Sin cambios: es la revisión vigente de la guía APTA de dolor de cadera no artrósico; PubMed (2026-10) no encuentra una posterior (la revisión de 2025 es la de artrosis, Koc 2025). |
| [Munakomi 2023](#munakomi-2023) | pauta · razonamiento fase 2 · texto | 4 | 2026-10 · Sin cambios: el capítulo sigue en su versión del 13 de agosto de 2023 (PubMed). Se añade a la pauta de lu4 Ammendolia 2022 (revisión sistemática del tratamiento no quirúrgico de la estenosis, leída entera en PMC). |
| [AAOS 2024](#aaos-2024) | pauta · test 4b sin puntuar · texto | 4 | 2026-10 · Sin cambios: es la guía más reciente de la rotura meniscal aguda aislada; coherente con Prill 2025 y con Smith 2015. |
| [Sanchez-Alvarado 2024](#sanchez-alvarado-2024) | pauta | 1 | 2026-10 · Sin cambios: hay una revisión posterior, Ferrero 2026 (Orthop Res Rev, 24 estudios, resumen leído), que concluye que la rehabilitación estructurada es la primera opción y que ningún tratamiento puede recomendarse sobre otro por la heterogeneidad; no contradice la pauta de ro6. |
| [Trager 2024](#trager-2024) | pauta | 1 | 2026-10 · Sin cambios: es la revisión más reciente que encontró la búsqueda en PubMed (terapia manual en el dolor sacroilíaco) al incorporarla en 2026-10. |
| [Balcarek 2025](#balcarek-2025) | pauta | 1 | 2026-10 · Sin cambios: PubMed (consensos y guías de primera luxación de rótula desde 2024) no encuentra nada posterior; el consenso de 2024 para adolescentes (J Pediatr Orthop) es anterior. |
| [Desmeules 2025](#desmeules-2025) | pauta · test 4b sin puntuar · texto | 4 | 2026-10 · Sin cambios: guía de 2025; búsqueda en PubMed (2026-10) sin versión posterior. Sigue como pauta de h2 y h3. |
| [Koc 2025](#koc-2025) | pauta | 1 | 2026-10 · Sustituye a Cibulka 2017 (revisión 2017 de la misma guía) en la pauta de ca1. PDF del usuario leído (2026-10; trae CPG1 y CPG10–CPG31, todas las intervenciones; faltan el resumen, la introducción, los métodos y el diagnóstico, CPG2–CPG9). Cambios frente a 2017: ejercicio (A) 1–5 veces por semana, 30–120 min, 5–16 semanas, incluido el acuático; terapia manual (A) con distracción longitudinal y movilización con movimiento; punción seca nueva (A); educación con afrontamiento del dolor por internet (B); pérdida de peso de C a B; ultrasonido de B a D. Donde choca con NICE NG226 (punción seca, ultrasonido) se dan las dos posturas (decisión del usuario). |
| [Lopes 2025](#lopes-2025) | pauta | 1 | 2026-10 · Sin cambios: es la revisión Cochrane más reciente; el metaanálisis en red posterior (BMC Sports Sci Med Rehabil, 2026) no la sustituye en la pauta, que sigue la guía holandesa (Ophey 2025). |
| [Ophey 2025](#ophey-2025) | pauta · test 4b sin puntuar | 4 | 2026-10 · Sin cambios: PubMed (guías de dolor femoropatelar y de tendinopatía rotuliana desde 2024) no encuentra ninguna posterior; la guía de buena práctica de BJSM (2024) es anterior y de menos peso. |
| [Prill 2025](#prill-2025) | pauta | 1 | 2026-10 · Sin cambios: es lo más reciente sobre el tratamiento sin cirugía de las lesiones de menisco; la guía AAOS 2024 (leída entera) solo da para la fisioterapia una opción de consenso, coherente con este. |
| [Rich 2025](#rich-2025) | pauta · test 4b sin puntuar · texto | 3 | 2026-10 · Sin cambios: es el ensayo más reciente sobre tendinopatía proximal de isquiotibiales (PubMed, revisiones y ensayos desde 2024). |
| [Salamh 2025](#salamh-2025) | pauta · test 4b sin puntuar | 2 | 2026-10 · Sin cambios: consenso de 2025; búsqueda en PubMed (2026-10) sin guía ni consenso posterior sobre el hombro congelado. |
| [Alentorn-Geli 2026](#alentorn-geli-2026) | pauta | 2 | 2026-10 · Sin cambios: consenso de 2026, el más reciente sobre la inestabilidad anterior traumática (búsqueda en PubMed, 2026-10). |
| [Kemp 2026](#kemp-2026) | pauta | 1 | 2026-10 · Ensayo más reciente sobre fisioterapia en el SIFA (PubMed, 2026-10); se suma a la pauta de ca2. |
| [Vandeputte 2026](#vandeputte-2026) | pauta | 1 | 2026-10 · Sin cambios: es de 2026 y PubMed no encuentra una revisión posterior del dolor inguinal relacionado con el psoas ilíaco. |
| [Englund 2003](#englund-2003) | pronóstico | 1 | 2026-10 · Sin cambios: PDF del usuario leído; 155 pacientes, 68 controles, RR 7,0 (2,1–23,5) por rotura degenerativa y 2,7 (0,9–7,7) por traumática coinciden. Las revisiones posteriores (PubMed, meniscectomía y artrosis desde 2015) tratan otros desenlaces (prótesis, rodilla tras el LCA) y no sustituyen esta cifra. |
| [Culvenor 2019](#culvenor-2019) | pronóstico | 1 | 2026-10 · Sin cambios: texto completo leído en PMC; 63 estudios, 5397 rodillas y, con 40 años o más, defectos de cartílago 43 % y roturas de menisco 19 % coinciden. PubMed (prevalencia de hallazgos en la RM de rodillas sin síntomas, revisiones desde 2019) no encuentra ninguna posterior. |
| [Altman 1991](#altman-1991) | test 4b sin puntuar · texto | 2 | 2026-10 · S 86 % / E 75 % del árbol clínico comprobadas en el resumen, pero son de la muestra de desarrollo; en atención primaria los criterios no se sostienen (Bierma-Zeinstra 1999, Reijman 2004) y no hay S/E de ese ámbito. Los criterios ACR de cadera (ca1) pasan a hallazgo, sin puntuar. |
| [McCarthy y Busconi 1995](#mccarthy-y-busconi-1995) | test 4b sin puntuar | 2 | 2026-10 · Texto completo no conseguido. Según Reiman 2015 (tabla 3), el estudio no publicó S ni E del test de Thomas («NA»): las calcularon los autores del metaanálisis. Serie de casos con riesgo de sesgo alto; Narvani 2003 no lo confirma. El Thomas pasa a hallazgo en labrum. |
| [Bierma-Zeinstra 1999](#bierma-zeinstra-1999) | test 4b sin puntuar · texto | 2 | 2026-10 · Solo resumen leído (PubMed 10332979): el texto completo no es accesible. No da S ni E de los criterios clínicos. |
| [Cook 2001](#cook-2001) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: PubMed (precisión diagnóstica de la palpación y de las pruebas de carga en la tendinopatía rotuliana desde 2016) no encuentra ninguna revisión sistemática; la guía holandesa (Ophey 2025) ya resume esta evidencia. |
| [Kim 2001](#kim-2001) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: Hegedus 2012 (tablas 2 y 3, PDF del usuario) recoge dos estudios independientes con S 30–55 % y E 53–78 % y concluye con «menos optimismo»; Gismervik 2017 (PMC) lo excluye de su metaanálisis como valor atípico por el espectro de pacientes jóvenes. El Biceps Load II de h5 sigue como hallazgo. |
| [Zaslav 2001](#zaslav-2001) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: búsqueda en PubMed (2026-10) sin estudios posteriores del test; Hanchard 2013 (Cochrane) lo cita como test original sin replicar. Sigue como hallazgo en h5. |
| [Flynn 2002](#flynn-2002) | test 4b sin puntuar | 2 | 2026-10 · Sin cambios en las cifras: Haskins 2015 (J Clin Epidemiol, revisión sistemática, PDF del usuario) encuentra 9 validaciones de la regla: ser positivo predice menos discapacidad con manipulación con o sin thrust, pero como modificador del efecto solo la apoya Childs 2004 (Hancock 2008 no), y no hay estudios de impacto. Se añade al criterio de lu1. PubMed (reglas de predicción para manipulación lumbar desde 2012) no encuentra nada posterior. |
| [Narvani 2003](#narvani-2003) | test 4b sin puntuar · texto | 3 | 2026-10 · Sin cambios: chasquido S 100 %, E 85 % y «Thomas ni sensible ni específico» comprobados en el resumen. |
| [Childs 2004](#childs-2004) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: Haskins 2015 (J Clin Epidemiol, revisión sistemática, PDF del usuario) encuentra 9 validaciones de la regla: ser positivo predice menos discapacidad con manipulación con o sin thrust, pero como modificador del efecto solo la apoya Childs 2004 (Hancock 2008 no), y no hay estudios de impacto. Se añade al criterio de lu1. PubMed (reglas de predicción para manipulación lumbar desde 2012) no encuentra nada posterior. |
| [Chronopoulos 2004](#chronopoulos-2004) | test 4b sin puntuar · texto | 3 | 2026-10 · Cifras actualizadas en Cadogan 2013: PDF del usuario leído entero (2026-10). Las cifras citadas coinciden con su tabla 3 (aducción cruzada 27 de 35 y 410 de 518; O’Brien 7 de 17 y 291 de 308), pero es retrospectivo de casos y controles con controles quirúrgicos, Krill 2018 lo excluye por ser de nivel III y en atención primaria (Cadogan 2013) la aducción cruzada no discrimina (LR+ 0,86): la aducción cruzada de h7 pasa a hallazgo (decisión del usuario). |
| [Kim 2004](#kim-2004) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: solo describe la técnica del test MPP; la validación es Kim 2007. |
| [Reijman 2004](#reijman-2004) | test 4b sin puntuar · texto | 2 | 2026-10 · Solo resumen leído: en PMC (PMC1754907) el cuerpo es un PDF escaneado que no se pudo descargar. |
| [Walton 2004](#walton-2004) | test 4b sin puntuar · texto | 5 | 2026-10 · Sin cambios: el artículo no se ha leído entero; sus cifras (Paxinos S 79 %, E 50 %; palpación S 96 %, E 10 %; O’Brien S 16 %, E 90 %) coinciden con las que recogen Krill 2018 (tabla 3) y Cadogan 2013 (tabla 1), leídos enteros. Ningún test de h7 que lo cite puntúa. |
| [Rennie y Saifuddin 2005](#rennie-y-saifuddin-2005) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: PubMed (bursitis de la pata de ganso, diagnóstico y prevalencia desde 2015) no encuentra ningún estudio de precisión diagnóstica ni revisión sistemática. |
| [Laslett 2006](#laslett-2006) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: Han 2023 (revisión sistemática, revisada 2026-10) la recoge: los criterios de Revel no se replican y no se pueden agrupar. |
| [Peat 2006](#peat-2006) | test 4b sin puntuar | 1 | 2026-10 · Texto completo leído (PMC1798313, tabla 3). Más recientes en la misma dirección, solo resumen: Miguel 2019 (Clin Rheumatol) y Wang 2024 (Arthritis Care Res). |
| [Kim 2007](#kim-2007) | test 4b sin puntuar · texto | 2 | 2026-10 · Sin cambios: PDF del usuario leído; 172 rodillas, tabla 2×2 51/13/6/102 y los 13 falsos positivos (7 franjas sinoviales de la grasa de Hoffa, 5 sinovitis, 1 cartílago) coinciden. PubMed (diagnóstico de la plica medial desde 2008) no encuentra ningún estudio de precisión posterior del test; lo más reciente es de RM (2026) y de tratamiento (revisión de 2025). |
| [Warden 2007](#warden-2007) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: PDF del usuario leído; 30 con tendinopatía clínica frente a 33 asintomáticos, ecografía S 87 % y RM S 57 %, E 82 % ambas, coinciden. PubMed no encuentra revisiones posteriores de precisión de la imagen en la tendinopatía rotuliana. |
| [Hancock 2008](#hancock-2008) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: Haskins 2015 (J Clin Epidemiol, revisión sistemática, PDF del usuario) encuentra 9 validaciones de la regla: ser positivo predice menos discapacidad con manipulación con o sin thrust, pero como modificador del efecto solo la apoya Childs 2004 (Hancock 2008 no), y no hay estudios de impacto. Se añade al criterio de lu1. PubMed (reglas de predicción para manipulación lumbar desde 2012) no encuentra nada posterior. |
| [Majlesi 2008](#majlesi-2008) | test 4b sin puntuar | 1 | 2026-10 · Cifras sin cambios, con aviso: van der Windt 2010 (Cochrane) recoge solo dos estudios del Slump y señala que la especificidad de Majlesi puede estar inflada por su diseño de casos y controles (controles con RM normal); el otro estudio dio S 0,44, E 0,58. PubMed (2026-10): ninguna revisión posterior del Slump. Por decisión del usuario (2026-10), el Slump pasa a hallazgo: sus cifras quedan en el criterio y no puntúa. |
| [Lucas 2009](#lucas-2009) | test 4b sin puntuar | 1 | 2026-10 · Complementada: Rathbone 2017 (Clin J Pain, metaanálisis de la fiabilidad de la palpación de puntos gatillo, PDF del usuario) da κ 0,34 para el nódulo en banda tensa y confirma la fiabilidad baja; sus cifras pasan a lu9. |
| [Al Nezari 2013](#al-nezari-2013) | test 4b sin puntuar | 2 | 2026-10 · Sin cambios: PubMed (exploración neurológica en radiculopatía lumbar o hernia discal, revisiones desde 2013) solo encuentra Tawa 2017, posterior pero sin metaanálisis. |
| [Cadogan 2013](#cadogan-2013) | test 4b sin puntuar · texto | 4 | 2026-10 · Añadida: texto completo leído en Europe PMC (2026-10). Estudio prospectivo en atención primaria (153 pacientes consecutivos; referencia: bloqueo de la AC guiado por fluoroscopia, ≥80 % de alivio); es uno de los 2 estudios de Krill 2018. |
| [Haskins 2015](#haskins-2015) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: PubMed (reglas de predicción clínica para manipulación lumbar, desde 2012) no encuentra revisiones posteriores. |
| [Reiman 2015](#reiman-2015) | test 4b sin puntuar · texto | 8 | 2026-10 · Texto completo leído (tablas 3 y 4): cifras correctas, pero el FADDIR agrupado sale de pacientes operados (probabilidad previa 90 %) y los propios autores concluyen que ningún test cambia de forma significativa la probabilidad. El FADDIR pasa a hallazgo en SIFA (con Pålsson 2020) y en labrum. Revisiones posteriores (Shanmugaraj 2020, Fernandes 2022, Dhillon 2025) no dan un valor agrupado mejor. |
| [Uysal 2015](#uysal-2015) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: PubMed (bursitis de la pata de ganso desde 2015) no encuentra ninguna cifra de prevalencia posterior en artrosis. |
| [Carro 2016](#carro-2016) | test 4b sin puntuar | 2 | 2026-10 · Sin cambios: PubMed (síndrome glúteo profundo o del piriforme, diagnóstico, revisiones desde 2018) solo encuentra revisiones narrativas, sin cifras de exactitud de los tests clínicos. |
| [Dobbs 2016](#dobbs-2016) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: Cook 2019 (PDF del usuario) recoge el test de extensión modificado con las mismas cifras (S 0,92, E 0,40, LR− 0,20, IC hasta 1,36; n = 30, referencia RM). PubMed (revisiones de tests clínicos de estenosis lumbar desde 2019) no encuentra nada posterior. |
| [Mendonça 2016](#mendonça-2016) | test 4b sin puntuar | 1 | 2026-10 · Cita corregida (PDF del usuario): la muestra son 43 deportistas de competición (86 tendones), no seleccionados por dolor en el tendón; LR+ 4,2 (2,3–7,14) de la sentadilla declinada coincide. Sigue como hallazgo. |
| [Rathbone 2017](#rathbone-2017) | test 4b sin puntuar | 2 | 2026-10 · Sin cambios: PubMed (fiabilidad de la palpación de puntos gatillo o banda tensa, revisiones sistemáticas desde 2009) no encuentra ninguna posterior. |
| [Tawa 2017](#tawa-2017) | test 4b sin puntuar | 2 | 2026-10 · Complementada: leída entera en PMC. No hace metaanálisis; la sensibilidad S 61 %, E 63 % es el mejor estudio suelto (referencia quirúrgica, no RM como dice el resumen). Los dos tests de lu5 pasan a las cifras agrupadas de Al Nezari 2013 (metaanálisis, PDF del usuario); Tawa queda como revisión posterior. No cambia la puntuación: ningún test puntúa con ninguna de las dos cifras. |
| [Krill 2018](#krill-2018) | test 4b sin puntuar · texto | 4 | 2026-10 · Sin cambios: texto completo leído en PMC (2026-10). Incluye 2 estudios (Walton 2004 y Cadogan 2013) y deja fuera Chronopoulos 2004 por ser de nivel III; las cifras citadas en h7 están en sus tablas 3 y 4. |
| [Mastromarchi 2021](#mastromarchi-2021) | test 4b sin puntuar | 4 | 2026-10 · Sin cambios: búsqueda en PubMed (2026-10) sin estudios posteriores de fiabilidad ni validez de los tests de la 1.ª costilla. Sigue como opinión de expertos; no puntúa (h9 y ce10). |
| [Wong 2022](#wong-2022) | test 4b sin puntuar | 2 | 2026-10 · Sin cambios: solo describe la técnica, no aporta cifras. |
| [Adib 2023](#adib-2023) | test 4b sin puntuar · texto | 4 | 2026-10 · Sin cambios: S y E del Arlington y del twist comprobadas en el resumen; siguen como hallazgo. El mismo estudio da para el FADIR S 43 %, E 56 % (ver Reiman 2015). |
| [Mohr 2024](#mohr-2024) | test 4b sin puntuar · razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 25 de enero de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Grimaldi 2026](#grimaldi-2026) | test 4b sin puntuar | 5 | 2026-10 · Sin cambios: es de 2026 y PubMed no encuentra nada posterior sobre pinzamiento isquiofemoral o dolor glúteo bajo. |
| [Halliwell 2026](#halliwell-2026) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: S 94 %, E 100 %, AUC 0,879 comprobadas en el resumen; sigue como hallazgo. |
| [NICE CG147](#nice-cg147) | razonamiento fase 2 | 4 | 2026-10 · Sin cambios: nice.org.uk consultado (2026-10): publicada el 8 de agosto de 2012, última actualización el 11 de diciembre de 2020. |
| [NICE NG126](#nice-ng126) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: nice.org.uk leído (2026-10). La última actualización, del 17 de junio de 2026, solo añade recomendaciones sobre la profilaxis anti-D; las de síntomas y signos del embarazo ectópico que usa h_g1 no cambian. |
| [Fairbank 2011](#fairbank-2011) | razonamiento fase 2 | 1 | 2026-10 · Complementada: PubMed (cauda equina, revisiones sistemáticas desde 2012) no encuentra una revisión de precisión diagnóstica posterior. Galliker 2020 (Am J Med, PDF del usuario) aporta el único estudio en urgencias (silla de montar LR+ 3,1, esfínteres LR+ 2,1) y Hennessy 2025 (Eur Spine J, PDF del usuario) revisa 9 guías: RM urgente y radiculopatía bilateral como señal clave. Ambos se añaden a `l6`. Tabrah 2022 (tacto rectal) y Boktor 2023 (residuo posmiccional) no leídos: tratan pruebas que no hace el fisioterapeuta. |
| [Downie 2013](#downie-2013) | razonamiento fase 2 | 2 | 2026-10 · Complementada: PubMed (banderas rojas de cáncer o fractura en lumbalgia, revisiones desde 2014). Williams 2023 (Cochrane de fractura) es una reedición con búsqueda hasta 2012, no más reciente. Verhagen 2017 (Pain, PDF del usuario) confirma que el antecedente de cáncer es la única bandera de malignidad informativa (LR+ 15,3), y Galliker 2020 (Am J Med, PDF del usuario) añade los datos de urgencias (LR+ 5,9; 27,9 con sospecha clínica): se añaden a `l2`. Sin cambios para fractura (`l_e4`). Maselli 2022 (Disabil Rehabil, dolor toracolumbar) no leída. |
| [Henschke 2013](#henschke-2013) | razonamiento fase 2 | 2 | 2026-10 · Complementada: Verhagen 2017 (Pain, PDF del usuario) apoya sus conclusiones con una búsqueda más amplia; el dolor nocturno solo se midió en un estudio (LR+ 0,7). Galliker 2020 (Am J Med, PDF del usuario) aporta el dato de urgencias (LR+ 2,2). Ambos se añaden a `l_on2`. |
| [Verhagen 2017](#verhagen-2017) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: PubMed (banderas rojas de malignidad en lumbalgia, revisiones desde 2017) solo encuentra Galliker 2020 (urgencias), que se cita junto a ella. |
| [HerniaSurge 2018](#herniasurge-2018) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: su actualización (Stabilini 2023, BJS Open 7(5):zrad080, PMC10588975, leída en 2026-10) revisa técnicas de reparación, malla y hernia oculta contralateral, no el diagnóstico ni la epidemiología. Cifras del razonamiento de ca_gi3 comprobadas en PMC: exploración S 0,745, E 0,963 (cap. 3, un estudio de cohortes); hernia inguinal 9–12 veces más en hombres y femoral unas 4 veces más en mujeres (cap. 16; la reparación, 8–10 veces más en hombres, cap. 2); factores de riesgo del resumen. |
| [Finucane 2020](#finucane-2020) | razonamiento fase 2 | 10 | 2026-10 · Sin cambios: PubMed (autor Finucane LM, «red flags») no encuentra una versión posterior del marco IFOMPT. |
| [Galliker 2020](#galliker-2020) | razonamiento fase 2 | 3 | 2026-10 · Sin cambios: PubMed (banderas rojas en lumbalgia en urgencias, revisiones desde 2020) no encuentra ninguna posterior. |
| [Cabre 2022](#cabre-2022) | razonamiento fase 2 | 1 | 2026-10 · Complementada: el consenso del COI de 2023 (Mountjoy 2023, Br J Sports Med, PDF del usuario) actualiza el marco: REDs en ambos sexos y la fractura de estrés del sacro o la pelvis como de alto riesgo. Se añade a `l_e6`; la cifra de 4,5 veces más lesiones óseas sigue citando Cabre. |
| [Kalakonda 2022](#kalakonda-2022) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 12 de septiembre de 2022 (fecha del documento en PubMed, consultada en 2026-10). |
| [Barney 2023](#barney-2023) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 3 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Basit 2023](#basit-2023) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 3 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Chauhan 2023](#chauhan-2023) | razonamiento fase 2 | 4 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 25 de mayo de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Davis y Shaw 2023](#davis-y-shaw-2023) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 28 de agosto de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Davis y Silberman 2023](#davis-y-silberman-2023) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 22 de mayo de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Dookie y Joseph 2023](#dookie-y-joseph-2023) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 14 de agosto de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Jayarangaiah 2023](#jayarangaiah-2023) | razonamiento fase 2 | 10 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 31 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Johns 2023](#johns-2023) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 25 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Koh y Markovich 2023](#koh-y-markovich-2023) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 24 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Leib 2023](#leib-2023) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 4 de agosto de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Malik 2023](#malik-2023) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 5 de junio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Malik y Herron 2023](#malik-y-herron-2023) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 22 de abril de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [May y Marappa-Ganeshan 2023](#may-y-marappa-ganeshan-2023) | razonamiento fase 2 | 5 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 10 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [McClary y Massey 2023](#mcclary-y-massey-2023) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 16 de enero de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Momodu y Savaliya 2023](#momodu-y-savaliya-2023) | razonamiento fase 2 | 6 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 3 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Mountjoy 2023](#mountjoy-2023) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: es el consenso vigente del COI (el anterior es de 2018). |
| [Oliver y Ashurst 2023](#oliver-y-ashurst-2023) | razonamiento fase 2 | 5 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 24 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Pak y Kim 2023](#pak-y-kim-2023) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 1 de mayo de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Pencle y Varacallo 2023](#pencle-y-varacallo-2023) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 4 de agosto de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Pope 2023](#pope-2023) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 22 de abril de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Rider y Marra 2023](#rider-y-marra-2023) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 7 de agosto de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Rowe 2023](#rowe-2023) | razonamiento fase 2 | 4 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 17 de marzo de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Rupp y Leslie 2023](#rupp-y-leslie-2023) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 17 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Sanvictores 2023](#sanvictores-2023) | razonamiento fase 2 | 5 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 30 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Schick y Sternard 2023](#schick-y-sternard-2023) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 12 de junio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Torlincasi 2023](#torlincasi-2023) | razonamiento fase 2 | 3 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 16 de enero de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Truong 2023](#truong-2023) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 22 de abril de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Waheed 2023](#waheed-2023) | razonamiento fase 2 | 3 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 19 de enero de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Wenker y Quint 2023](#wenker-y-quint-2023) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 20 de junio de 2023 (fecha del documento en PubMed, consultada en 2026-10). |
| [Antunes 2024](#antunes-2024) | razonamiento fase 2 | 3 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 17 de agosto de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Belyayeva 2024](#belyayeva-2024) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 28 de febrero de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Durer 2024](#durer-2024) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 8 de enero de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Greenwood 2024](#greenwood-2024) | razonamiento fase 2 | 4 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 11 de diciembre de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Lassiter 2024](#lassiter-2024) | razonamiento fase 2 | 5 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 26 de febrero de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Leslie 2024](#leslie-2024) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 17 de febrero de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Lezak 2024](#lezak-2024) | razonamiento fase 2 | 3 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 25 de febrero de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Lotfollahzadeh 2024](#lotfollahzadeh-2024) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 12 de febrero de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Mohseni 2024](#mohseni-2024) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 27 de febrero de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Nandhagopal 2024](#nandhagopal-2024) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 4 de mayo de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Regunath y Oba 2024](#regunath-y-oba-2024) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 26 de enero de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Rishor-Olney 2024](#rishor-olney-2024) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 4 de enero de 2024 (fecha del documento en PubMed, consultada en 2026-10). |
| [Daley 2025](#daley-2025) | razonamiento fase 2 | 4 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 19 de enero de 2025 (fecha del documento en PubMed, consultada en 2026-10). |
| [Gill 2025](#gill-2025) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 28 de noviembre de 2025 (fecha del documento en PubMed, consultada en 2026-10). |
| [Grant y John 2025](#grant-y-john-2025) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 19 de enero de 2025 (fecha del documento en PubMed, consultada en 2026-10). |
| [Hennessy 2025](#hennessy-2025) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: publicada en 2025, búsqueda hasta junio de 2024; PubMed no encuentra una revisión de guías posterior. |
| [Jenkins y Vadakekut 2025](#jenkins-y-vadakekut-2025) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 2 de junio de 2025 (fecha del documento en PubMed, consultada en 2026-10). |
| [Jones 2025](#jones-2025) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 6 de julio de 2025 (fecha del documento en PubMed, consultada en 2026-10). |
| [Killeen y Cardenas 2025](#killeen-y-cardenas-2025) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 7 de noviembre de 2025 (fecha del documento en PubMed, consultada en 2026-10). |
| [Leslie 2025](#leslie-2025) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 30 de noviembre de 2025 (fecha del documento en PubMed, consultada en 2026-10). |
| [Margetis y Gillis 2025](#margetis-y-gillis-2025) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 28 de marzo de 2025 (fecha del documento en PubMed, consultada en 2026-10). |
| [Nori y Stretanski 2025](#nori-y-stretanski-2025) | razonamiento fase 2 | 3 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 1 de mayo de 2025 (fecha del documento en PubMed, consultada en 2026-10). |
| [Patel 2025](#patel-2025) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 3 de mayo de 2025 (fecha del documento en PubMed, consultada en 2026-10). |
| [Shaw 2025](#shaw-2025) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 19 de enero de 2025 (fecha del documento en PubMed, consultada en 2026-10). |
| [Vadakekut y Gnugnoli 2025](#vadakekut-y-gnugnoli-2025) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 27 de marzo de 2025 (fecha del documento en PubMed, consultada en 2026-10). |
| [Anastasopoulou y Gillespie 2026](#anastasopoulou-y-gillespie-2026) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 17 de agosto de 2026 (fecha del documento en PubMed, consultada en 2026-10). |
| [Awidi y Babiker 2026](#awidi-y-babiker-2026) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 8 de septiembre de 2026 (fecha del documento en PubMed, consultada en 2026-10). |
| [Consoli y Carlson 2026](#consoli-y-carlson-2026) | razonamiento fase 2 | 3 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 17 de junio de 2026 (fecha del documento en PubMed, consultada en 2026-10). |
| [Farmer y Matto 2026](#farmer-y-matto-2026) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 9 de septiembre de 2026 (fecha del documento en PubMed, consultada en 2026-10). |
| [Jogu 2026](#jogu-2026) | razonamiento fase 2 | 2 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 15 de mayo de 2026 (fecha del documento en PubMed, consultada en 2026-10). |
| [Mabrouk y Pilson 2026](#mabrouk-y-pilson-2026) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 14 de septiembre de 2026 (fecha del documento en PubMed, consultada en 2026-10). |
| [Mabrouk y Siwiec 2026](#mabrouk-y-siwiec-2026) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 15 de febrero de 2026 (fecha del documento en PubMed, consultada en 2026-10). |
| [Menon y Cassaro 2026](#menon-y-cassaro-2026) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 13 de septiembre de 2026 (fecha del documento en PubMed, consultada en 2026-10). |
| [Sabry y Li 2026](#sabry-y-li-2026) | razonamiento fase 2 | 3 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 25 de marzo de 2026 (fecha del documento en PubMed, consultada en 2026-10). |
| [Sendrea 2026](#sendrea-2026) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: publicada en 2026; no se buscó literatura posterior. |
| [Vijayan y Mabrouk 2026](#vijayan-y-mabrouk-2026) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 14 de septiembre de 2026 (fecha del documento en PubMed, consultada en 2026-10). |
| [Vijayan y Maher 2026](#vijayan-y-maher-2026) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 21 de febrero de 2026 (fecha del documento en PubMed, consultada en 2026-10). |
| [Wróblewski 2026](#wróblewski-2026) | razonamiento fase 2 | 1 | 2026-10 · Sin cambios: publicada en 2026; no se buscó literatura posterior. |
| [Zemaitis 2026](#zemaitis-2026) | razonamiento fase 2 | 6 | 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 31 de enero de 2026 (fecha del documento en PubMed, consultada en 2026-10). |
| [Altman 1986](#altman-1986) | texto | 2 | 2026-10 · Sustituida por Peat 2006 en los criterios del ACR de rodilla (ro1): su S 95 % / E 69 % sale de la muestra de desarrollo, no del ámbito de un fisio. Solo queda citada como contexto en el texto del test. |
| [Seaberg y Jackson 1994](#seaberg-y-jackson-1994) | texto | 1 | 2026-10 · Sin cambios: estudio de creación de la regla; ver Seaberg 1998. |
| [Seaberg 1998](#seaberg-1998) | texto | 1 | 2026-10 · Sin cambios: PubMed (regla de Pittsburgh de rodilla desde 2015) no encuentra ninguna revisión sistemática ni validación posterior. |
| [Hesmerg 2024](#hesmerg-2024) | texto | 1 | 2026-10 · Sin cambios: es la revisión más reciente y amplia del Lever; concuerda con Sokal 2022, que sigue dando las cifras de ro4 por el método. |
| [Hu 2024](#hu-2024) | texto | 1 | 2026-10 · Sin cambios: discrepa de Sokal 2022 y de Hesmerg 2024 en la especificidad; incluye el estudio del creador del test y atribuye a Hegedus unas cifras del Lever que no son suyas. Solo se cita en el criterio. |
| [Rana 2026](#rana-2026) | texto | 1 | 2026-10 · Sin cambios: es la revisión más reciente de la exploración clínica compuesta del menisco; por decisión del usuario no sustituye a Solomon 2001 (sin LR, agrupación univariante, cirujanos ortopédicos, pacientes que iban a artroscopia). |

## 1. Tarjetas de consulta

Autores: Lluch, López-Cubas, Jones, Jull, Hall y Lewis  
Título: *Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders*  
Publicación: ZERAPI  
DOI: —  
Última revisión: **sin revisar**  
Nota: Base de las guías clínicas de cada región, de las que son extracto las tarjetas de consulta (repo guia-de-consulta). Los capítulos que citan los pies de las tarjetas (Struyf y Powell y Lewis, cap. 3, en hombro; Fondevila Suárez, cap. 5, en lumbar) son de este libro. Capítulos leídos enteros (PDF escaneado del usuario) y citados directamente como fuente, con capítulo y páginas: cap. 5.1 (Fondevila Suárez, lumbar, pp. 295–326: pronósticos de lu3–lu8, tests de lu5–lu9 y l_e7) caps. 5.3 y 5.3.1 (cervical) cap. 4.1, subcaps. 4.1.1–4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg, cadera, pp. 123–189, bibliografía incluida; releído entero en 2026-10: pronósticos y tests de cadera y razonamiento del cribado de cadera) cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan, rodilla, pp. 191–234, bibliografía incluida: pronósticos y tests de rodilla y razonamiento del cribado de rodilla; el capítulo no tiene tabla de banderas rojas) y cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook, tobillo y pie, pp. 235–291, bibliografía incluida: 112 de las 147 citas de pronósticos y tests de tobillo y pie y razonamiento del cribado de tobillo y pie; sus banderas rojas están en la p. 287) y cap. 3.2 (Coombes y Bisset, codo, pp. 81–103, bibliografía incluida: 10 tests de codo y razonamiento del cribado de codo; sin tabla de banderas rojas).

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
2. Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75; Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)

| Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|
| h1 · Capsulitis Adhesiva | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h3 · Rotura del Manguito Rotador | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h5 · Lesión Labral Superior (SLAP) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h7 · Artropatía Acromioclavicular | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h11 · Luxación Bloqueada o Fractura (→ Rx) | Pronóstico | 5 · cita del pronóstico | 2 |

### Tarjeta de consulta cadera

Archivo: `guia-de-consulta/data/tarjeta_cadera.js` · formulario previo: `guia-de-consulta/data/formulario_cadera.js`

De dónde sale (pies de la tarjeta):

- Guía clínica de cadera e ingle, ap. 1 y 4 — Ficha de primera visita, bloques 0, 3 y 4
- Guía clínica de cadera e ingle, ap. 5 · las filas ① y ② son propuestas de la guía, no proceden del capítulo
- Guía clínica de cadera e ingle, ap. 5 y 6 · entidades de Doha y filas Imagen, Cuidado y Pronóstico

Formulario previo, cara 2 (`formularios/cadera.js`): Hoja 2 de 2 · versión 2 — Preguntas discriminantes: guía clínica de cadera e ingle, ap. 3 (deporte y antecedentes: ap. 1 y 6).

_Ninguna cita en `data/` nombra esta tarjeta._

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

_Ninguna cita en `data/` nombra esta tarjeta._

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

| Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|
| ro1 · Artrosis de Rodilla | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro2 · Lesión Meniscal | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro3 · Dolor Patelofemoral (Síndrome) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro5 · Tendinopatía Rotuliana | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro6 · Síndrome de la Banda Iliotibial | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro7 · Bursitis de la Pata de Ganso | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro8 · Lesión del Ligamento Colateral Medial (LCM) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro9 · Lesión del Ligamento Cruzado Posterior (LCP) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro11 · Fracturas (Rótula o Meseta Tibial) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro12 · Inestabilidad Rotuliana | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro13 · Síndrome de la Grasa de Hoffa | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro14 · Bursitis Pre e Infrarrotuliana | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro16 · Lesión Osteocondral | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro17 · Plica Sinovial Medial | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro18 · Disfunción de la Articulación Tibioperonea Proximal | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro19 · Neuropatía del Nervio Peroneo Común | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| ro20 · Quiste Poplíteo (Baker) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |

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
2. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 248–249; Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)
3. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 247 y 250–251; Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)

| Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|
| tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp2 · Lesión de la Sindesmosis | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp3 · Rotura del Aquiles | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp4 · Lesión de Lisfranc | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp6 · Luxación del Tibial Posterior | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp7 · Pinzamiento Posterior del Tobillo | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp8 · Tendinopatía del Aquiles, Porción Media | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp9 · Tendinopatía Insercional del Aquiles | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp10 · Afectación de la Vaina del Aquiles | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp11 · Tendinopatía del Plantar Delgado | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp12 · Neuropatía del Nervio Sural | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp13 · Bursitis Calcánea Superficial | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp14 · Tendinopatía del Tibial Posterior | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp14 · Tendinopatía del Tibial Posterior | Pronóstico | 5 · cita del pronóstico | 2 |
| tp15 · Tendinopatía del Flexor Largo del Primer Dedo (FHL) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp15 · Tendinopatía del Flexor Largo del Primer Dedo (FHL) | Pronóstico | 5 · cita del pronóstico | 3 |
| tp16 · Síndrome del Túnel del Tarso | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp17 · Fractura de Estrés del Tobillo (Maléolo Medial, Astrágalo, Calcáneo) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp18 · Síndrome del Seno del Tarso | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp19 · Tendinopatía de los Peroneos | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp20 · Pinzamiento Anterior del Tobillo | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp21 · Inestabilidad Crónica del Tobillo | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp22 · Sinovitis Postraumática | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp23 · Coalición Tarsiana | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp24 · Artrosis de Tobillo o Pie | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp25 · Osteocondritis Disecante del Astrágalo | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp26 · Dolor Plantar Crónico del Talón | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp27 · Síndrome de la Almohadilla Grasa del Talón | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp28 · Atrapamiento Nervioso del Talón | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp29 · Lesión Calcaneocuboidea y Cubometatarsiana | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp30 · Fractura de Estrés del Mediopié (Navicular, Cuboides, Cuñas) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp31 · Lesión de la 1.ª Metatarsofalángica | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp32 · Dolor en la Base del 2.º Metatarsiano | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp33 · Fractura de Estrés del Cuello de un Metatarsiano (Fractura de Marcha) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| tp35 · Gota | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |

## 2. Literatura científica

Orden alfabético. Un mismo «Autor Año» puede agrupar dos artículos distintos (p. ej. dos de Décary 2018):
la lista «Citada como» los distingue.

[AAOS 2024](#aaos-2024) · [Adib 2023](#adib-2023) · [Adigun 2023](#adigun-2023) · [Agrawal y Tiwari 2023](#agrawal-y-tiwari-2023) · [Al Nezari 2013](#al-nezari-2013) · [Al-Subahi 2017](#al-subahi-2017) · [Alentorn-Geli 2026](#alentorn-geli-2026) · [Altman 1986](#altman-1986) · [Altman 1991](#altman-1991) · [Ammendolia 2022](#ammendolia-2022) · [Anastasopoulou y Gillespie 2026](#anastasopoulou-y-gillespie-2026) · [Antunes 2024](#antunes-2024) · [Apelby-Albrecht 2013](#apelby-albrecht-2013) · [Appelboam 2008](#appelboam-2008) · [Ashley y Lui 2023](#ashley-y-lui-2023) · [Awidi y Babiker 2026](#awidi-y-babiker-2026) · [Bachmann 2003](#bachmann-2003) · [Bachmann 2004](#bachmann-2004) · [Balcarek 2025](#balcarek-2025) · [Barcelos 2014](#barcelos-2014) · [Barney 2023](#barney-2023) · [Basit 2023](#basit-2023) · [Bateman 2025](#bateman-2025) · [Beloor Suresh y Asuncion 2023](#beloor-suresh-y-asuncion-2023) · [Belyayeva 2024](#belyayeva-2024) · [Benjamin y Lui 2025](#benjamin-y-lui-2025) · [Bergman 2025](#bergman-2025) · [Bhatti 2026](#bhatti-2026) · [Bierma-Zeinstra 1999](#bierma-zeinstra-1999) · [Biz 2019](#biz-2019) · [Blanpied 2017](#blanpied-2017) · [Bodman 2024](#bodman-2024) · [Brotman 2024](#brotman-2024) · [Budha 2025](#budha-2025) · [Cabre 2022](#cabre-2022) · [Cadogan 2013](#cadogan-2013) · [Caliandro 2025](#caliandro-2025) · [Campbell 2020](#campbell-2020) · [Carro 2016](#carro-2016) · [Cascia 2019](#cascia-2019) · [Chauhan 2023](#chauhan-2023) · [Chen 2023](#chen-2023) · [Childs 2004](#childs-2004) · [Chimenti 2024](#chimenti-2024) · [Chronopoulos 2004](#chronopoulos-2004) · [Consenso de Zúrich IHiPRN](#consenso-de-zúrich-ihiprn) · [Consoli y Carlson 2026](#consoli-y-carlson-2026) · [Cook 2001](#cook-2001) · [Cook 2010](#cook-2010) · [Cook 2011](#cook-2011) · [Cook 2019](#cook-2019) · [Culvenor 2019](#culvenor-2019) · [Cunha 2023](#cunha-2023) · [Daley 2025](#daley-2025) · [Davis y Shaw 2023](#davis-y-shaw-2023) · [Davis y Silberman 2023](#davis-y-silberman-2023) · [Décary 2018](#décary-2018) · [Deeb y Maher 2026](#deeb-y-maher-2026) · [Deeb y Maher 2026 (Raynaud)](#deeb-y-maher-2026-raynaud) · [Demont 2022](#demont-2022) · [Denault y Launico 2026](#denault-y-launico-2026) · [Desmeules 2025](#desmeules-2025) · [Devereaux y ElMaraghy 2013](#devereaux-y-elmaraghy-2013) · [Devillé 2000](#devillé-2000) · [Dobbs 2016](#dobbs-2016) · [Dookie y Joseph 2023](#dookie-y-joseph-2023) · [Dorf 2007](#dorf-2007) · [Downie 2013](#downie-2013) · [Durer 2024](#durer-2024) · [Englund 2003](#englund-2003) · [Enseki 2023](#enseki-2023) · [Fairbank 2011](#fairbank-2011) · [Fariduddin 2024](#fariduddin-2024) · [Farmer y Matto 2026](#farmer-y-matto-2026) · [Feller 2024](#feller-2024) · [Finucane 2020](#finucane-2020) · [Flynn 2002](#flynn-2002) · [Frey 2017](#frey-2017) · [Fritz 2005](#fritz-2005) · [Galliker 2020](#galliker-2020) · [Genevay 2017](#genevay-2017) · [George 2021](#george-2021) · [Getsoian 2020](#getsoian-2020) · [Gheewala 2023](#gheewala-2023) · [Gill 2025](#gill-2025) · [Gillen 2026](#gillen-2026) · [Goebel 2018](#goebel-2018) · [Gomes 2022](#gomes-2022) · [Goodfriend 2022](#goodfriend-2022) · [Goodman 2018](#goodman-2018) · [Grant y John 2025](#grant-y-john-2025) · [Greenwood 2024](#greenwood-2024) · [Griffin 2018](#griffin-2018) · [Grimaldi 2017](#grimaldi-2017) · [Grimaldi 2026](#grimaldi-2026) · [Großterlinden 2016](#großterlinden-2016) · [Guthmiller 2025](#guthmiller-2025) · [Hall 2024](#hall-2024) · [Hall 2025](#hall-2025) · [Halliwell 2026](#halliwell-2026) · [Han 2023](#han-2023) · [Hancock 2007](#hancock-2007) · [Hancock 2008](#hancock-2008) · [Hantzidiamantis 2024](#hantzidiamantis-2024) · [Haskins 2015](#haskins-2015) · [Hegedus 2012](#hegedus-2012) · [Hennessy 2025](#hennessy-2025) · [Henschke 2013](#henschke-2013) · [Hermans 2013](#hermans-2013) · [Hermena y Slane 2025](#hermena-y-slane-2025) · [HerniaSurge 2018](#herniasurge-2018) · [Hesmerg 2024](#hesmerg-2024) · [Hölmich 1999](#hölmich-1999) · [Hu 2024](#hu-2024) · [Hunter 2024](#hunter-2024) · [Hutchison 2013](#hutchison-2013) · [Jain 2026](#jain-2026) · [Jayarangaiah 2023](#jayarangaiah-2023) · [Jeanmonod y Varacallo 2023](#jeanmonod-y-varacallo-2023) · [Jenkins y Vadakekut 2025](#jenkins-y-vadakekut-2025) · [Jogu 2026](#jogu-2026) · [Johns 2023](#johns-2023) · [Jones 2025](#jones-2025) · [Jonsson 2008](#jonsson-2008) · [Jull 2007](#jull-2007) · [Kalakonda 2022](#kalakonda-2022) · [Kaplan y Kanwal 2023](#kaplan-y-kanwal-2023) · [Karanasios 2022](#karanasios-2022) · [Kastelein 2008](#kastelein-2008) · [Katz 1995](#katz-1995) · [Kaur 2025](#kaur-2025) · [Kazemi 2023](#kazemi-2023) · [Kelley 2013](#kelley-2013) · [Kemp 2020](#kemp-2020) · [Kemp 2026](#kemp-2026) · [Khalil 2025](#khalil-2025) · [Khan y Bollu 2023](#khan-y-bollu-2023) · [Killeen y Cardenas 2025](#killeen-y-cardenas-2025) · [Kim 2001](#kim-2001) · [Kim 2004](#kim-2004) · [Kim 2007](#kim-2007) · [Kim y Chang 2021](#kim-y-chang-2021) · [King y Lowery 2023](#king-y-lowery-2023) · [Kinsella 2024](#kinsella-2024) · [Koc 2023](#koc-2023) · [Koc 2025](#koc-2025) · [Koh y Markovich 2023](#koh-y-markovich-2023) · [Krill 2018](#krill-2018) · [Kuijper 2009](#kuijper-2009) · [Kulig 2009](#kulig-2009) · [Lacy 2023](#lacy-2023) · [LaPelusa y Dave 2023](#lapelusa-y-dave-2023) · [Laslett 2003](#laslett-2003) · [Laslett 2005](#laslett-2005) · [Laslett 2006](#laslett-2006) · [Laslett 2008](#laslett-2008) · [Lassiter 2024](#lassiter-2024) · [Leib 2023](#leib-2023) · [Lequesne 2008](#lequesne-2008) · [Leslie 2023](#leslie-2023) · [Leslie 2024](#leslie-2024) · [Leslie 2025](#leslie-2025) · [Lezak 2024](#lezak-2024) · [Litaker 2000](#litaker-2000) · [Liu 2025](#liu-2025) · [Lleva 2025](#lleva-2025) · [Lluch 2020](#lluch-2020) · [Logerstedt 2017](#logerstedt-2017) · [Logerstedt 2018](#logerstedt-2018) · [Lopes 2025](#lopes-2025) · [Lotfollahzadeh 2024](#lotfollahzadeh-2024) · [Lubiatowski 2020](#lubiatowski-2020) · [Lucado 2022](#lucado-2022) · [Lucas 2009](#lucas-2009) · [Mabrouk y Pilson 2026](#mabrouk-y-pilson-2026) · [Mabrouk y Siwiec 2026](#mabrouk-y-siwiec-2026) · [Maffulli 1998](#maffulli-1998) · [Mahadevan 2015](#mahadevan-2015) · [Majlesi 2008](#majlesi-2008) · [Malik 2023](#malik-2023) · [Malik y Herron 2023](#malik-y-herron-2023) · [Margetis y Donnally 2025](#margetis-y-donnally-2025) · [Margetis y Gillis 2025](#margetis-y-gillis-2025) · [Martin 2021](#martin-2021) · [Mastromarchi 2021](#mastromarchi-2021) · [Maxwell y Sterling 2013](#maxwell-y-sterling-2013) · [May y Marappa-Ganeshan 2023](#may-y-marappa-ganeshan-2023) · [McCarthy y Busconi 1995](#mccarthy-y-busconi-1995) · [McClary y Massey 2023](#mcclary-y-massey-2023) · [McKeon 2008](#mckeon-2008) · [McMordie 2023](#mcmordie-2023) · [Mellor 2016](#mellor-2016) · [Mellor 2018](#mellor-2018) · [Mendonça 2016](#mendonça-2016) · [Menger 2024](#menger-2024) · [Menon y Cassaro 2026](#menon-y-cassaro-2026) · [Menon y Rednam 2026](#menon-y-rednam-2026) · [Metcalfe 2019](#metcalfe-2019) · [Mohr 2024](#mohr-2024) · [Mohseni 2024](#mohseni-2024) · [Molloy 2003](#molloy-2003) · [Momodu y Savaliya 2023](#momodu-y-savaliya-2023) · [Moore y Tafti 2026](#moore-y-tafti-2026) · [Mountjoy 2023](#mountjoy-2023) · [Munakomi 2023](#munakomi-2023) · [Nandhagopal 2024](#nandhagopal-2024) · [Narvani 2003](#narvani-2003) · [Netterström-Wedin 2021](#netterström-wedin-2021) · [NICE CG147](#nice-cg147) · [NICE NG125](#nice-ng125) · [NICE NG126](#nice-ng126) · [NICE NG158](#nice-ng158) · [NICE NG19](#nice-ng19) · [NICE NG226](#nice-ng226) · [NICE NG38](#nice-ng38) · [NICE NG59](#nice-ng59) · [NICE NG89](#nice-ng89) · [Nori y Stretanski 2025](#nori-y-stretanski-2025) · [Nunes 2013](#nunes-2013) · [O'Driscoll 2005](#odriscoll-2005) · [O'Driscoll 2007](#odriscoll-2007) · [Ochi 2011](#ochi-2011) · [Ochi 2012](#ochi-2012) · [Oliver y Ashurst 2023](#oliver-y-ashurst-2023) · [Ophey 2025](#ophey-2025) · [Pak y Kim 2023](#pak-y-kim-2023) · [Pålsson 2020](#pålsson-2020) · [Pana y Saggu 2023](#pana-y-saggu-2023) · [Pangia 2025](#pangia-2025) · [Paquin 2022](#paquin-2022) · [Park 2005](#park-2005) · [Park 2008](#park-2008) · [Park 2019](#park-2019) · [Patel 2025](#patel-2025) · [Patil 2024](#patil-2024) · [Peat 2006](#peat-2006) · [Pencle y Varacallo 2023](#pencle-y-varacallo-2023) · [Pitcher 2024](#pitcher-2024) · [Pope 2023](#pope-2023) · [Prill 2025](#prill-2025) · [Quzli 2025](#quzli-2025) · [Raj 2023](#raj-2023) · [Rana 2026](#rana-2026) · [Rathbone 2017](#rathbone-2017) · [Rathleff 2020](#rathleff-2020) · [Regunath y Oba 2024](#regunath-y-oba-2024) · [Reid 2014](#reid-2014) · [Reijman 2004](#reijman-2004) · [Reiman 2014](#reiman-2014) · [Reiman 2015](#reiman-2015) · [Rennie y Saifuddin 2005](#rennie-y-saifuddin-2005) · [Rhodes 2022](#rhodes-2022) · [Rich 2025](#rich-2025) · [Rider y Marra 2023](#rider-y-marra-2023) · [Rinkel 2013](#rinkel-2013) · [Rishor-Olney 2024](#rishor-olney-2024) · [Rout 2024](#rout-2024) · [Rowe 2023](#rowe-2023) · [Rupp y Leslie 2023](#rupp-y-leslie-2023) · [Rushton 2023](#rushton-2023) · [Sabry y Li 2026](#sabry-y-li-2026) · [Salamh 2025](#salamh-2025) · [Sanchez-Alvarado 2024](#sanchez-alvarado-2024) · [Sanvictores 2023](#sanvictores-2023) · [Saueressig 2021](#saueressig-2021) · [Schick y Sternard 2023](#schick-y-sternard-2023) · [Seaberg 1998](#seaberg-1998) · [Seaberg y Jackson 1994](#seaberg-y-jackson-1994) · [Seaman y Bergman 2026](#seaman-y-bergman-2026) · [See 2026](#see-2026) · [Sekhon 2023](#sekhon-2023) · [Sendrea 2026](#sendrea-2026) · [Serner 2020](#serner-2020) · [Sevy 2023](#sevy-2023) · [Shahid 2023](#shahid-2023) · [Shamrock 2023](#shamrock-2023) · [Shams 2025](#shams-2025) · [Shaw 2025](#shaw-2025) · [Siemensma 2023](#siemensma-2023) · [Sims 2020](#sims-2020) · [Singleton y Hefner 2023](#singleton-y-hefner-2023) · [Sman 2015](#sman-2015) · [Smidt y Massey 2023](#smidt-y-massey-2023) · [Smith 2015](#smith-2015) · [Sokal 2022](#sokal-2022) · [Solomon 2001](#solomon-2001) · [Stern 2026](#stern-2026) · [Suha 2025](#suha-2025) · [Suri 2010](#suri-2010) · [Tavakoli 2025](#tavakoli-2025) · [Tawa 2017](#tawa-2017) · [Thoomes 2026](#thoomes-2026) · [Torlincasi 2023](#torlincasi-2023) · [Trager 2024](#trager-2024) · [Truong 2023](#truong-2023) · [Uysal 2015](#uysal-2015) · [Vadakekut y Gnugnoli 2025](#vadakekut-y-gnugnoli-2025) · [van der Windt 2010](#van-der-windt-2010) · [van Dijk 1996](#van-dijk-1996) · [van Dijk 2016](#van-dijk-2016) · [Vandeputte 2026](#vandeputte-2026) · [Verhagen 2017](#verhagen-2017) · [Vijayan y Mabrouk 2026](#vijayan-y-mabrouk-2026) · [Vijayan y Maher 2026](#vijayan-y-maher-2026) · [Vyas 2024](#vyas-2024) · [Waheed 2023](#waheed-2023) · [Walton 2004](#walton-2004) · [Warden 2007](#warden-2007) · [Warden 2014](#warden-2014) · [Wenker y Quint 2023](#wenker-y-quint-2023) · [Williams 2025](#williams-2025) · [Willy 2019](#willy-2019) · [Wistow 2025](#wistow-2025) · [Wong 2022](#wong-2022) · [Wróblewski 2026](#wróblewski-2026) · [Zabaglo 2024](#zabaglo-2024) · [Zaslav 2001](#zaslav-2001) · [Zemaitis 2026](#zemaitis-2026) · [Zhang 2010](#zhang-2010) · [Zhao 2024](#zhao-2024) · [Ziu 2023](#ziu-2023) · [Zwerus 2018](#zwerus-2018)

### AAOS 2024

Autores: American Academy of Orthopaedic Surgeons (grupo de trabajo presidido por Brophy)  
Título: *Management of Acute Isolated Meniscal Pathology. Evidence-Based Clinical Practice Guideline*  
Publicación: AAOS, 10 de junio de 2024 (aaos.org/ampcpg); resumen en J Am Acad Orthop Surg 33(13):e724–e730, 2025  
DOI: 10.5435/JAAOS-D-25-00135  
Última revisión: 2026-10 · Sin cambios: es la guía más reciente de la rotura meniscal aguda aislada; coherente con Prill 2025 y con Smith 2015.  
Nota: PDF completo del usuario leído (2026-10; 41 páginas, primera edición). Exploración física: recomendación moderada (calidad alta, rebajada por resultados inconsistentes), sin cifras agrupadas; deja fuera el estudio original del Thessaly. Fisioterapia: opción de consenso (calidad muy baja, un solo estudio). Cirugía precoz en la rotura desplazada o reparable: consenso. Pauta y Thessaly de ro2. El DOI es el del resumen en la revista (comprobado en Crossref); la guía completa no tiene DOI.

Citada como:

1. Valoración global del examinador (historia + exploración) para rotura meniscal: rinde mejor que cada maniobra suelta (McMurray LR+ 1,3; línea articular 0,9 en la misma revisión). 5 estudios con artroscopia: S media 77 %, E media 91 %. Más reciente, Rana 2026 (Br Med Bull 159:ldag023; 6 y 7 estudios con exploración compuesta, todos con RM y artroscopia en el mismo paciente) da S 85 % y E 95 % en el menisco medial y S 75 % y E 93 % en el lateral, pero sin LR, con agrupación univariante, exploraciones hechas por cirujanos ortopédicos y pacientes que iban a artroscopia: no sustituye a estas LR. La guía AAOS 2024 recomienda la exploración combinada (interlínea, McMurray, Thessaly) con fuerza moderada, sin cifras agrupadas.
2. El capítulo lo cita entre las pruebas de rotura meniscal, junto con la palpación de la interlínea y el McMurray, sin describir la técnica ni dar cifras. A 20° de flexión, el metaanálisis da S 75 % (IC 53–89 %), E 87 % (IC 65–96 %), LR+ 5,6 (IC 1,5–21,0) y LR− 0,28 (IC 0,11–0,71), pero con heterogeneidad muy alta (I² 94 %), y el estudio de los creadores del test da cifras muy superiores a las de los demás. La guía AAOS 2024 deja fuera ese estudio por no cumplir sus criterios de inclusión y, en uno de alta calidad, recoge S 64 % y E 53 %: cuenta como hallazgo.
3. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 209 y 220; Smith 2015 (Evid Based Med 20:88–97; metaanálisis bivariante, tabla 3); AAOS 2024 (guía de práctica clínica de patología meniscal aislada aguda, recomendación de exploración física)
4. Prill 2025, Knee Surg Sports Traumatol Arthrosc 33(8):3014–3024 (consenso formal EU-US de rehabilitación del menisco, ESSKA-AOSSM-AASPT, parte II: tratamiento sin cirugía; grados A a D, de más respaldo científico a opinión de expertos); Logerstedt 2018, J Orthop Sports Phys Ther 48(2):A1–A50 (guía de práctica clínica APTA, lesiones de menisco y de cartílago articular: tras la meniscectomía; deja el tratamiento sin cirugía para su próxima revisión; letra = grado de la recomendación, tal como la da la guía); AAOS 2024 (guía de práctica clínica de patología meniscal aislada aguda, opciones «Physical Therapy» e «Indications for Acute Surgical Intervention»)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro2 · Lesión Meniscal | Test «Combinación de tests clínicos» (en `criterio`) | 4b · mención en el texto | 1 |
| Rodilla | ro2 · Lesión Meniscal | Test «Test de Thessaly» (en `criterio`) | 4b · mención en el texto | 2 |
| Rodilla | ro2 · Lesión Meniscal | Test «Test de Thessaly» | 4b · cita bajo el test | 3 |
| Rodilla | ro2 · Lesión Meniscal | Pauta de tratamiento | 5 · cita de la pauta | 4 |

### Adib 2023

Publicación: Am J Sports Med 51(4):1007–14  
DOI: 10.1177/03635465221149748  
Última revisión: 2026-10 · Sin cambios: S y E del Arlington y del twist comprobadas en el resumen; siguen como hallazgo. El mismo estudio da para el FADIR S 43 %, E 56 % (ver Reiman 2015).

Citada como:

1. Adib 2023 (Am J Sports Med; retrospectivo, evaluado por el autor de los tests; referencia: artro-RM)
2. Flexión, aducción y rotación interna. Positivo: dolor conocido, bloqueo, chasquido o enganche (que reproduzca el chasquido cuenta como positivo). No puntúa: el valor agrupado (S 99 %, E 5 %, LR− 0,14) sale de pacientes ya operados, con una probabilidad previa del 90 % y un IC del LR− que llega a 0,93; con artro-RM como referencia el LR− es 0,45 y su IC cruza el 1. En otra serie, S 43 %, E 56 % (Adib 2023). Un negativo no descarta la rotura.
3. Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral, tabla 4: 4 estudios, n = 319, referencia: cirugía, probabilidad previa 90 %; LR− IC 95 %: 0,02–0,93; con artro-RM como referencia, 4 estudios, n = 188: LR− 0,45, IC 0,19–1,09). Adib 2023 (Am J Sports Med; retrospectivo; referencia: artro-RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Arlington» | 4b · cita bajo el test | 1 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Torsión/Twist» | 4b · cita bajo el test | 1 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «FADDIR (valor agrupado)» (en `criterio`) | 4b · mención en el texto | 2 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «FADDIR (valor agrupado)» | 4b · cita bajo el test | 3 |

### Adigun 2023

Autores: Adigun, Nguyen, Fox y Anastasopoulou  
Título: *Acromegaly*  
Publicación: StatPearls [Internet], NBK431086 (act. 2023-02-02)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de codo.

Citada como:

1. Adigun 2023 — Adigun, Nguyen, Fox y Anastasopoulou, «Acromegaly», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de febrero de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co_e1` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |

### Agrawal y Tiwari 2023

Autores: Agrawal y Tiwari  
Título: *Metatarsal Fractures*  
Publicación: StatPearls [Internet], NBK574512 (act. 2023-08-03)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie.

Citada como:

1. Agrawal y Tiwari 2023 — Agrawal y Tiwari, «Metatarsal Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | — | Pregunta `tp_o1` · Fractura de Estrés | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_o2` · Fractura de Estrés | 2 · razonamiento del cribado | 1 |

### Al Nezari 2013

Autores: Al Nezari, Schneiders y Hendrick  
Título: *Neurological examination of the peripheral nervous system to diagnose lumbar spinal disc herniation with suspected radiculopathy: a systematic review and meta-analysis*  
Publicación: Spine J 13(6):657–674  
DOI: 10.1016/j.spinee.2013.02.007  
Última revisión: 2026-10 · Sin cambios: PubMed (exploración neurológica en radiculopatía lumbar o hernia discal, revisiones desde 2013) solo encuentra Tawa 2017, posterior pero sin metaanálisis.  
Nota: PDF del usuario (2026-10), leído entero. Reflejos y sensibilidad de lu5 (tabla 5 y texto de resultados).

Citada como:

1. Al Nezari 2013 (Spine J, metaanálisis; referencia: cirugía) · Tawa 2017 (revisión sistemática posterior, sin metaanálisis)
2. Al Nezari 2013 (Spine J, metaanálisis; referencia: cirugía) · Tawa 2017 (revisión sistemática posterior, sin metaanálisis: mejor estudio suelto)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Test «Reflejos rotuliano (L3–L4) y aquíleo (L5–S1)» | 4b · cita bajo el test | 1 |
| Lumbar | lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Test «Sensibilidad (algodón, diapasón, pinchazo)» | 4b · cita bajo el test | 2 |

### Al-Subahi 2017

Autores: Al-Subahi, Alayat, Alshehri, Helal, Alhasan, Alalawi, Takrouni y Alfaqeh  
Título: *The effectiveness of physiotherapy interventions for sacroiliac joint dysfunction: a systematic review*  
Publicación: J Phys Ther Sci 29(9):1689–1694  
DOI: 10.1589/jpts.29.1689  
Última revisión: 2026-10 · Complementada: Trager 2024 (J Man Manip Ther, revisión sistemática con metaanálisis de 16 ensayos, PDF del usuario) actualiza el efecto de la terapia manual sacroilíaca (discapacidad: efecto moderado, certeza baja; dolor: sin efecto demostrado, certeza muy baja; ninguna técnica superior). Al-Subahi se mantiene para el ejercicio de estabilización, la duración de los programas y el vendaje.  
Nota: Texto completo en PMC5599847 (acceso abierto). Pauta de lu8.

Citada como:

1. Al-Subahi 2017, J Phys Ther Sci 29(9):1689–1694 (revisión sistemática, 9 estudios de 2004–2014 de calidad baja o media: manipulación, ejercicio y vendaje neuromuscular) · Trager 2024, J Man Manip Ther 32(6):561–572 (revisión sistemática con metaanálisis, 16 ensayos; GRADE) · NICE NG59 (rec. 1.2.7; actualizada en julio de 2026)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Alentorn-Geli 2026

Autores: Alentorn-Geli, Brilakis, Ângelo, Bøe, Ruíz-Iban, Dyrna, Saccomanno, Lacheta, Housset, Benea, Fonte, Boutsiadis, Zampeli, Milano, Beaufils y Kovacic  
Título: *Age- and time-specific management of traumatic anterior shoulder instability: The 2024 ESSKA–ESA Formal Consensus. Part 2: Treatment and return to sports*  
Publicación: Knee Surg Sports Traumatol Arthrosc 34:3040–3051  
DOI: 10.1002/ksa.70497  
Última revisión: 2026-10 · Sin cambios: consenso de 2026, el más reciente sobre la inestabilidad anterior traumática (búsqueda en PubMed, 2026-10).  
Nota: PDF aportado por el usuario. Consenso formal ESSKA-ESA (grados B, C y D; ninguna recomendación A). Solo inestabilidad anterior traumática. Pauta de h4 y rotura completa tras luxación en h3.

Citada como:

1. Desmeules 2025, J Orthop Sports Phys Ther 55(4):235–274 (guía de práctica clínica; incluye la rotura parcial y excluye la completa; letra = grado de la recomendación, tal como la da la guía) · Alentorn-Geli 2026, Knee Surg Sports Traumatol Arthrosc 34:3040–3051 (consenso formal de la ESSKA-ESA, parte 2: tratamiento y vuelta al deporte; letra = grado de la recomendación, tal como la da el consenso; ninguna llega a A)
2. Alentorn-Geli 2026, Knee Surg Sports Traumatol Arthrosc 34:3040–3051 (consenso formal de la ESSKA-ESA, parte 2: tratamiento y vuelta al deporte; letra = grado de la recomendación, tal como la da el consenso; ninguna llega a A)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h3 · Rotura del Manguito Rotador | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Hombro | h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Pauta de tratamiento | 5 · cita de la pauta | 2 |

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

### Ammendolia 2022

Autores: Ammendolia, Hofkirchner, Plener, Bussières, Schneider, Young, Furlan, Stuber, Ahmed, Cancelliere, Adeboyejo y Ornelas  
Título: *Non-operative treatment for lumbar spinal stenosis with neurogenic claudication: an updated systematic review*  
Publicación: BMJ Open 12(1):e057724  
DOI: 10.1136/bmjopen-2021-057724  
Última revisión: 2026-10 · Sin cambios: es la actualización de la revisión Cochrane de 2013 y la más reciente que encontró la búsqueda en PubMed (tratamiento no quirúrgico de la estenosis lumbar) al incorporarla en 2026-10.  
Nota: Texto completo en PMC8772406, leído entero (2026-10). Pauta de lu4.

Citada como:

1. Ejercicio general (A en mayores con lumbalgia crónica), con progresión de volumen e intensidad: en los ensayos con estenosis, un programa multimodal de ejercicio general y aeróbico mejoró dolor y discapacidad a los 6 meses, y el ejercicio general individualizado con terapia manual superó al ejercicio en grupo y a la atención médica habitual a los 2 meses. Estiramiento, fortalecimiento y ejercicio aeróbico; evitar caminar cuesta abajo y la extensión lumbar excesiva (Munakomi 2023). La revisión sistemática más reciente del tratamiento no quirúrgico (Ammendolia 2022) halla evidencia de calidad moderada de que un programa multimodal de terapia manual y ejercicio, con o sin educación, es eficaz y seguro, y de que las infiltraciones epidurales de corticoides no aportan mejoría clínicamente importante. Ninguna fuente fija repeticiones ni tiempos: el volumen queda a criterio del clínico.
2. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · Munakomi 2023, StatPearls, «Spinal Stenosis and Neurogenic Claudication» (tratamiento conservador) · Ammendolia 2022, BMJ Open 12:e057724 (revisión sistemática, actualización de la Cochrane de 2013; GRADE)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Dosis (en el texto) | 5 · mención en el texto | 1 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Pauta de tratamiento | 5 · cita de la pauta | 2 |

### Anastasopoulou y Gillespie 2026

Autores: Anastasopoulou y Gillespie  
Título: *Paget Bone Disease*  
Publicación: StatPearls [Internet], NBK430805 (act. 2026-08-17)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 17 de agosto de 2026 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Anastasopoulou y Gillespie 2026 — Anastasopoulou y Gillespie, «Paget Bone Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de agosto de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_e5` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |

### Antunes 2024

Autores: Antunes, Tian y Copelin  
Título: *Upper Gastrointestinal Bleeding*  
Publicación: StatPearls [Internet], NBK470300 (act. 2024-08-17)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 17 de agosto de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Antunes 2024 — Antunes, Tian y Copelin, «Upper Gastrointestinal Bleeding», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de agosto de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `hem_4` · Hematológico | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_gi2` · Gastrointestinal | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_gi2` · Gastrointestinal | 2 · razonamiento del cribado | 1 |

### Apelby-Albrecht 2013

Publicación: —  
DOI: 10.1016/j.jmpt.2013.07.007  
Última revisión: **sin revisar**  
Nota: Citado a través de Thoomes 2026.

Citada como:

1. Thoomes 2026 (BMC Musculoskelet Disord, actualización de la revisión sistemática de 2018; metaanálisis de Apelby-Albrecht 2013 y Grondin, tabla 4)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce3 · Radiculopatía Cervical | Test «Combinación de 4 ULNT (ULNT1 y ULNT2a mediano, ULNT2b radial, ULNT3 cubital)» | 4b · cita bajo el test | 1 |

### Appelboam 2008

Autores: Appelboam, Reuben, Benger et al.  
Título: *Elbow extension test to rule out elbow fracture: multicentre, prospective validation and observational study of diagnostic accuracy in adults and children*  
Publicación: BMJ 337:a2428  
DOI: 10.1136/bmj.a2428  
Última revisión: **sin revisar**  
Nota: Texto completo leído en Europe PMC (PMC2600962) en la sesión de codo (2026-10): prueba de extensión del codo en el sistema traumático del cribado de codo (co_t1, co_t2) y en la derivación de co_step1. Ya se citaba como aclaración en co3.

Citada como:

1. Extensión completa, flexión, pronación y supinación comparadas con el lado sano. Sin cifras para la rigidez: la «S 99 %» que tenía es del test de extensión del codo para descartar fractura tras traumatismo (Appelboam 2008: no extender del todo el codo → radiografía; S 96,8 %), otra condición.
2. Appelboam 2008 (BMJ 337:a2428), solo como aclaración: su cifra es para fractura, no para rigidez
3. Caída o golpe reciente y el codo no llega a estirarse del todo: casi un 50 % de fracturas (Appelboam 2008; Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 94)
4. Sospecha de fractura o luxación tras un traumatismo (deformidad, o el codo no llega a estirarse del todo: casi un 50 % de fracturas en Appelboam 2008): derivación médica para radiografía; antes, explorar la sensibilidad, el color y la temperatura de la mano.
5. Appelboam 2008 — Appelboam, Reuben, Benger et al., «Elbow extension test to rule out elbow fracture: multicentre, prospective validation and observational study of diagnostic accuracy in adults and children», BMJ 337:a2428 (estudio prospectivo multicéntrico, 1740 pacientes).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co3 · Rigidez del Codo (Contractura Postraumática o Capsular) | Test «Test de ROM activo en 4 direcciones» (en `criterio`) | 4b · mención en el texto | 1 |
| Codo | co3 · Rigidez del Codo (Contractura Postraumática o Capsular) | Test «Test de ROM activo en 4 direcciones» | 4b · cita bajo el test | 2 |
| Codo | — | `sistemas.1.banderasRojas.0` | 2 · mención en el texto | 3 |
| Codo | — | `steps.0.options.1.derivacion` | 4 · mención en el texto | 4 |
| Codo | — | Pregunta `co_t1` · Traumático (Fractura o Luxación) | 2 · razonamiento del cribado | 5 |
| Codo | — | Pregunta `co_t2` · Traumático (Fractura o Luxación) | 2 · razonamiento del cribado | 5 |

### Ashley y Lui 2023

Autores: Ashley y Lui  
Título: *Physiology, Nerve*  
Publicación: StatPearls [Internet], NBK551652 (act. 2023-05-01)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie. Releído en la sesión de codo (2026-10): razonamiento del cribado de codo.

Citada como:

1. Ashley y Lui 2023 — Ashley y Lui, «Physiology, Nerve», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co4b` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_n1` · Neurológico | 2 · razonamiento del cribado | 1 |

### Awidi y Babiker 2026

Autores: Awidi y Babiker  
Título: *Hemophilia A*  
Publicación: StatPearls [Internet], NBK470265 (act. 2026-09-08)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 8 de septiembre de 2026 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Awidi y Babiker 2026 — Awidi y Babiker, «Hemophilia A», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de septiembre de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `r4` · Oncológico / Hematológico | 2 · razonamiento del cribado | 1 |

### Bachmann 2003

Autores: Bachmann, Kolb, Koller, Steurer y ter Riet  
Título: *Accuracy of Ottawa ankle rules to exclude fractures of the ankle and mid-foot: systematic review*  
Publicación: BMJ 326:417  
DOI: 10.1136/bmj.326.7386.417  
Última revisión: **sin revisar**  
Nota: Revisión sistemática (27 estudios, 15 581 pacientes). LR− agrupadas del resumen (PubMed, 2026-10): 0,08 para el tobillo y para el mediopié, 0,07 en niños; reduce un 30–40 % las radiografías. Regla de Ottawa en tp5 y razonamiento del cribado de tobillo y pie (tp_t2); autores y PMC149439 comprobados en PubMed.

Citada como:

1. TOBILLO → radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. PIE → radiografía si dolor en el mediopié Y alguno: dolor óseo en la base del 5.º MT · en el navicular · no carga cuatro pasos. Solo descarta: Bachmann 2003 (27 estudios, 15 581 pacientes) da LR− 0,08 aplicando solo la regla del tobillo o solo la del pie, pero 0,21 (IC 95 % 0,12–0,38) en los estudios que aplican las dos juntas, que es como se usan aquí (se toma la más prudente). El positivo es un hallazgo: en adultos, LR+ 1,47 (IC 1,11–1,93; Gomes 2022).
2. Bachmann 2003 (BMJ 326:417); Gomes 2022 (BMC Musculoskelet Disord 23:885)
3. Radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. Solo descarta: aplicando solo la regla del tobillo, Bachmann 2003 (27 estudios, 15 581 pacientes) da LR− 0,08 (IC 95 % 0,03–0,18). El positivo es un hallazgo: la regla es muy sensible y poco específica. Excluidas embarazadas y personas que no pueden seguir la prueba.
4. Bachmann 2003 (BMJ 326:417); Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 256–257
5. REGLAS DE OTTAWA, antes de explorar cualquier traumatismo agudo. TOBILLO → radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. PIE → radiografía si dolor en el mediopié Y alguno: dolor óseo en la base del 5.º MT · en el navicular · no carga cuatro pasos. Muy sensible, moderadamente específica: S 98,5 % en niños de más de 6 años (Lluch, p. 257); en adultos, una regla negativa descarta fractura (LR− 0,08, Bachmann 2003). Excluidas embarazadas y personas que no pueden seguir la prueba (p. ej., traumatismo craneal). ≈10 % de las inversiones acaban en fractura.
6. Bachmann 2003 — Bachmann, Kolb, Koller, Steurer y ter Riet, «Accuracy of Ottawa ankle rules to exclude fractures of the ankle and mid-foot: systematic review», BMJ 326(7386):417 (2003); resumen leído en PubMed.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Reglas de Ottawa de tobillo y de pie» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Reglas de Ottawa de tobillo y de pie» | 4b · cita bajo el test | 2 |
| Tobillo y pie | tp37 · Fractura de Tobillo (Maleolar) | Test «Regla de Ottawa de tobillo» (en `criterio`) | 4b · mención en el texto | 3 |
| Tobillo y pie | tp37 · Fractura de Tobillo (Maleolar) | Test «Regla de Ottawa de tobillo» | 4b · cita bajo el test | 4 |
| Tobillo y pie | — | `urgencia.lineas.3` | 2 · mención en el texto | 5 |
| Tobillo y pie | — | Pregunta `tp_t2` · Traumático / Mecánico | 2 · razonamiento del cribado | 6 |

### Bachmann 2004

Autores: Bachmann, Haberzeth, Steurer y ter Riet  
Título: *The accuracy of the Ottawa knee rule to rule out knee fractures: a systematic review*  
Publicación: Ann Intern Med 140(2):121–4  
DOI: 10.7326/0003-4819-140-5-200403020-00013  
Última revisión: 2026-10 · Hay dos revisiones sistemáticas posteriores: Sims 2020 (LR− 0,07) y Kazemi 2023 (18 estudios, 6702 adultos; LR− 0,12). Por la regla de conflictos (mismo nivel, la más reciente), Kazemi 2023 pasa a dar las cifras de ro11 y de ro_t1; Bachmann se cita como concordante.  
Nota: Revisión sistemática (6 estudios, 4249 adultos): S 98,5 %, E 48,6 %, LR− 0,05, leídas en el resumen de PubMed (2026-10); no está en PMC. Sustituía a la S 1,0 que Lluch 2020 (cap. 4.2, p. 197) toma del estudio de derivación (Stiell 1995). Regla de Ottawa en ro11 y razonamiento de ro_t1, ahora como revisión concordante con Kazemi 2023.

Citada como:

1. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 197; Kazemi 2023 (Arch Acad Emerg Med 11:e30; revisión sistemática con metaanálisis univariante, 18 estudios, 6702 adultos); Sims 2020 (Eur Radiol 30:4438–46; metaanálisis bivariante, 8 estudios, 7385 adultos: S 99 %, E 49 %, LR− 0,07); Bachmann 2004 (Ann Intern Med 140:121–4; 6 estudios, 4249 adultos: S 98,5 %, E 48,6 %, LR− 0,05)
2. Bachmann 2004 — Bachmann, Haberzeth, Steurer y ter Riet, «The accuracy of the Ottawa knee rule to rule out knee fractures: a systematic review», Ann Intern Med 2004;140(2):121–4.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro11 · Fracturas (Rótula o Meseta Tibial) | Test «Regla de Ottawa antes de nada» | 4b · cita bajo el test | 1 |
| Rodilla | — | Pregunta `ro_t1` · Traumático / Mecánico | 2 · razonamiento del cribado | 2 |

### Balcarek 2025

Autores: Balcarek, Blønd, Beaufils, Askenberger, Stephen y cols.  
Título: *Management of first-time patellar dislocation: The ESSKA 2024 formal consensus—Part 2*  
Publicación: Knee Surg Sports Traumatol Arthrosc 33(12):4197–4206  
DOI: 10.1002/ksa.12637  
Última revisión: 2026-10 · Sin cambios: PubMed (consensos y guías de primera luxación de rótula desde 2024) no encuentra nada posterior; el consenso de 2024 para adolescentes (J Pediatr Orthop) es anterior.  
Nota: Consenso formal ESSKA; texto completo leído en PMC12684363 (2026-10). Pauta de ro12.

Citada como:

1. Balcarek 2025, Knee Surg Sports Traumatol Arthrosc 33(12):4197–4206 (consenso formal de la ESSKA, publicado en 2025, sobre la primera luxación de rótula, parte 2; letra = grado: B presunción científica, C bajo nivel científico)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro12 · Inestabilidad Rotuliana | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Barcelos 2014

Autores: Barcelos, Patriota y Netto  
Título: *Nontraumatic atlantoaxial rotatory subluxation: Grisel syndrome. Case report and literature review*  
Publicación: Global Spine J 4(3):179–186  
DOI: 10.1055/s-0033-1363936  
Última revisión: **sin revisar**  
Nota: Texto completo en PMC4111947 (acceso abierto). Caso clínico y revisión; razonamiento del cribado cervical (cv_n3).

Citada como:

1. Barcelos 2014 — Barcelos, Patriota y Netto, «Nontraumatic atlantoaxial rotatory subluxation: Grisel syndrome. Case report and literature review», Global Spine J 2014;4(3):179–186 (texto completo en PMC).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_n3` · Médula / Estructural | 2 · razonamiento del cribado | 1 |

### Barney 2023

Autores: Barney, Piuzzi y Akhondi  
Título: *Femoral Head Avascular Necrosis*  
Publicación: StatPearls [Internet], NBK546658 (act. 2023-07-03)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 3 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Barney 2023 — Barney, Piuzzi y Akhondi, «Femoral Head Avascular Necrosis», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_os1` · Óseo / Desarrollo | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_os2` · Óseo / Desarrollo | 2 · razonamiento del cribado | 1 |

### Basit 2023

Autores: Basit, Pop, Malik y Sharma  
Título: *Fitz-Hugh-Curtis Syndrome*  
Publicación: StatPearls [Internet], NBK499950 (act. 2023-07-03)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 3 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Basit 2023 — Basit, Pop, Malik y Sharma, «Fitz-Hugh-Curtis Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_g2` · Ginecológico | 2 · razonamiento del cribado | 1 |

### Bateman 2025

Autores: Bateman, Swaile y Tambe  
Título: *Effectiveness of night splints for cubital tunnel syndrome - A systematic review*  
Publicación: Hand Ther 30(3):105–112  
DOI: 10.1177/17589983251336157  
Última revisión: **sin revisar**  
Nota: Revisión sistemática (RoB 2, ROBINS-I y GRADE). Solo el resumen de los autores (Europe PMC no da el texto completo). Leído en la sesión de dosis de codo (2026-10). Pauta de co8: evidencia insuficiente sobre la férula nocturna (certeza muy baja). Más reciente que Natroshvili 2023 (mismo nivel), que no se cita.

Citada como:

1. Caliandro 2025, Cochrane Database Syst Rev (4):CD006839 (revisión Cochrane, 15 ensayos; solo el resumen) · Rinkel 2013, Clin J Pain 29(12):1087–1096 (revisión sistemática) · Bateman 2025, Hand Ther 30(3):105–112 (revisión sistemática con GRADE; solo el resumen)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Beloor Suresh y Asuncion 2023

Autores: Beloor Suresh y Asuncion  
Título: *Myasthenia Gravis*  
Publicación: StatPearls [Internet], NBK559331 (act. 2023-08-08)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de codo.

Citada como:

1. Beloor Suresh y Asuncion 2023 — Beloor Suresh y Asuncion, «Myasthenia Gravis», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co_e2b` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |

### Belyayeva 2024

Autores: Belyayeva, Leslie, Rout y Jeong  
Título: *Acute Pyelonephritis*  
Publicación: StatPearls [Internet], NBK519537 (act. 2024-02-28)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 28 de febrero de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Belyayeva 2024 — Belyayeva, Leslie, Rout y Jeong, «Acute Pyelonephritis», StatPearls [Internet], NCBI Bookshelf, última actualización 28 de febrero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_r1` · Renal / Urológico | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `c3` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Benjamin y Lui 2025

Autores: Benjamin y Lui  
Título: *Vertebrobasilar Insufficiency*  
Publicación: StatPearls [Internet], NBK482259 (act. 2025-12-01)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Benjamin y Lui 2025 — Benjamin y Lui, «Vertebrobasilar Insufficiency», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de diciembre de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_ar2` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 1 |

### Bergman 2025

Autores: Bergman, Li y Shuman  
Título: *Acute Ankle Sprain*  
Publicación: StatPearls [Internet], NBK459212 (act. 2025-08-02)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie.

Citada como:

1. Bergman 2025 (StatPearls, «Acute Ankle Sprain»)
2. Bergman 2025 — Bergman, Li y Shuman, «Acute Ankle Sprain», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de agosto de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp37 · Fractura de Tobillo (Maleolar) | Test «Palpar el peroné hasta la rodilla» | 4b · cita bajo el test | 1 |
| Tobillo y pie | — | Pregunta `tp_t2` · Traumático / Mecánico | 2 · razonamiento del cribado | 2 |

### Bhatti 2026

Autores: Bhatti, Maheshwary y Sun  
Título: *Guillain-Barre Syndrome*  
Publicación: StatPearls [Internet], NBK532254 (act. 2026-01-31)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie.

Citada como:

1. Bhatti 2026 — Bhatti, Maheshwary y Sun, «Guillain-Barre Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de enero de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | — | Pregunta `tp_n1` · Neurológico | 2 · razonamiento del cribado | 1 |

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

### Biz 2019

Autores: Biz, Crimì, Belluzzi, Maschio, Baracco, Volpin y Ruggieri  
Título: *Conservative Versus Surgical Management of Elbow Medial Ulnar Collateral Ligament Injury: A Systematic Review*  
Publicación: Orthop Surg 11(6):974–984  
DOI: 10.1111/os.12571  
Última revisión: **sin revisar**  
Nota: Revisión sistemática de 15 estudios, casi todos de nivel IV; texto completo leído en Europe PMC. Leído en la sesión de dosis de codo (2026-10). Pauta de co4.

Citada como:

1. Biz 2019, Orthop Surg 11(6):974–984 (revisión sistemática de 15 estudios, casi todos de nivel IV) · Cascia 2019, Sports Health 11(4):367–374 (revisión sistemática de 7 series retrospectivas, nivel 4; solo el resumen)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Blanpied 2017

Publicación: J Orthop Sports Phys Ther 47(7):A1–A83  
DOI: 10.2519/jospt.2017.0302  
Última revisión: **sin revisar**

Citada como:

1. Reproducción del dolor de hombro con extensión + inclinación lateral ipsilateral + compresión axial. En el dolor de hombro cervicogénico el dolor se reproduce con las pruebas de la columna cervical y la movilidad pasiva glenohumeral no está limitada, lo que lo distingue del hombro congelado (Lluch 2020, tabla 2). El Spurling se ha estudiado para la radiculopatía cervical (S 0,50, E 0,86–0,93; revisión de Rubinstein recogida por Blanpied 2017), no para el dolor referido al hombro: aquí no puntúa.
2. Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19)
3. Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía)
4. Movilización segmentaria posteroanterior. Positivo si hipomóvil y reproduce síntomas. La fiabilidad entre examinadores de la movilidad pasiva intervertebral cervical es pobre o regular (revisión de 7 artículos). Cuenta como hallazgo: las cifras que tenía (κ 0,53–0,72, S 59–65 %, E 78–87 %, LR+ 2,9–4,9, LR− 0,43–0,49) son del PAIVM C0–C3 para la cefalea cervicogénica (Blanpied 2017, p. A19), no para el déficit de movilidad, que no tiene patrón de referencia; y la evidencia publicada del PAIVM en el dolor cervical es para dolor facetario confirmado con bloqueo de rama medial (S 90 %, E 73 %).
5. Williams 2025 (J Man Manip Ther, revisión de revisiones sistemáticas): evidencia del PAIVM frente a bloqueo facetario · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19)
6. Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19) · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)
7. Lluch 2020, cap. 5.3 (Jull y Falla), pp. 377–378 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)
8. Lluch 2020, cap. 5.3 (Jull y Falla), pp. 379–380 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19)
9. Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · Lluch 2020, cap. 5.3 (Jull y Falla), p. 378 (test de flexión craneocervical para dosificar)
10. Lluch 2020, cap. 5.3 (Jull y Falla), p. 380 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)
11. Blanpied 2017 (J Orthop Sports Phys Ther 47(7), pp. A13–A14, tabla 6)
12. Lluch 2020, cap. 5.3 (Jull y Falla), pp. 372–373 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), pp. A13–A14, tabla 6)
13. Lluch 2020, cap. 5.3 (Jull y Falla), p. 379 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)
14. Lluch 2020, cap. 5.3 (Jull y Falla), p. 375 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)
15. Margetis y Donnally 2025 (StatPearls, «Cervical Myelopathy», exploración) · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A15)
16. Lluch 2020, cap. 5.3 (Jull y Falla), p. 379 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A20)
17. Kuijper 2009, BMJ 339:b3883 (ensayo aleatorizado, n = 205; la lista de ejercicios está en su apéndice web, no revisado) · Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h6 · Disfunción Cervical con Dolor Referido a Hombro | Test «Test de Spurling (Compresión Foraminal)» (en `criterio`) | 4b · mención en el texto | 1 |
| Hombro | h6 · Disfunción Cervical con Dolor Referido a Hombro | Test «Test de Spurling (Compresión Foraminal)» | 4b · cita bajo el test | 2 |
| Hombro | h6 · Disfunción Cervical con Dolor Referido a Hombro | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce1 · Disfunción Articular Cervical | Test «PAIVM (Movilidad Intervertebral Pasiva Accesoria) C0-C3» (en `criterio`) | 4b · mención en el texto | 4 |
| Cervical | ce1 · Disfunción Articular Cervical | Test «PAIVM (Movilidad Intervertebral Pasiva Accesoria) C0-C3» | 4b · cita bajo el test | 5 |
| Cervical | ce1 · Disfunción Articular Cervical | Test «ROM Cervical Activo con CROM» | 4b · cita bajo el test | 6 |
| Cervical | ce1 · Disfunción Articular Cervical | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce2 · Disfunción Neuromuscular Cervical | Test «Test de Flexión Craneocervical (CCFT) con biofeedback de presión» | 4b · cita bajo el test | 7 |
| Cervical | ce2 · Disfunción Neuromuscular Cervical | Test «Test de Reposicionamiento Cabeza-Neutro» | 4b · cita bajo el test | 8 |
| Cervical | ce2 · Disfunción Neuromuscular Cervical | Pauta de tratamiento | 5 · cita de la pauta | 9 |
| Cervical | ce3 · Radiculopatía Cervical | Test «Reflejos tendinosos (bíceps C6, tríceps C7)» | 4b · cita bajo el test | 10 |
| Cervical | ce3 · Radiculopatía Cervical | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce4 · Cefalea Cervicogénica | Test «PAIVM C0-C3 (segmento C1-C2 más sintomático)» | 4b · cita bajo el test | 6 |
| Cervical | ce4 · Cefalea Cervicogénica | Pauta de tratamiento | 5 · cita de la pauta | 9 |
| Cervical | ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Test «Factores de riesgo de evolución persistente (WAD agudo o subagudo)» | 4b · cita bajo el test | 11 |
| Cervical | ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Test «Síntomas de hiperalerta / PTSD» | 4b · cita bajo el test | 12 |
| Cervical | ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce6 · Debilidad Muscular Cérvico-Escapular | Test «Fuerza de Flexión Cervical (dinamometría)» | 4b · cita bajo el test | 13 |
| Cervical | ce6 · Debilidad Muscular Cérvico-Escapular | Test «Fuerza de Extensión Cervical (dinamometría)» | 4b · cita bajo el test | 13 |
| Cervical | ce6 · Debilidad Muscular Cérvico-Escapular | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce7 · Dolor Mecánico Cervical Inespecífico Crónico | Test «ROM Cervical Activo (reducción en todas las direcciones)» | 4b · cita bajo el test | 14 |
| Cervical | ce7 · Dolor Mecánico Cervical Inespecífico Crónico | Test «Test de reposicionamiento cabeza-neutro» | 4b · cita bajo el test | 8 |
| Cervical | ce7 · Dolor Mecánico Cervical Inespecífico Crónico | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce8 · Mielopatía Espondilótica Cervical | Test «Signo de Hoffmann» | 4b · cita bajo el test | 15 |
| Cervical | ce9 · Disfunción Postural Cérvico-Torácica | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce11 · Fatiga Muscular Cérvico-Escapular | Test «Test de resistencia de flexores cervicales profundos» | 4b · cita bajo el test | 16 |
| Cervical | ce11 · Fatiga Muscular Cérvico-Escapular | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce12 · Dolor Radicular Cervical | Pauta de tratamiento | 5 · cita de la pauta | 17 |
| Cervical | ce14 · Dolor Cervical Idiopático | Pauta de tratamiento | 5 · cita de la pauta | 3 |

### Bodman 2024

Autores: Bodman, Dreyer y Varacallo  
Título: *Diabetic Peripheral Neuropathy*  
Publicación: StatPearls [Internet], NBK442009 (act. 2024-02-25)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie. Releído en la sesión de codo (2026-10): razonamiento del cribado de codo.

Citada como:

1. Bodman 2024 — Bodman, Dreyer y Varacallo, «Diabetic Peripheral Neuropathy», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de febrero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co4b` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_n2` · Neurológico | 2 · razonamiento del cribado | 1 |

### Brotman 2024

Autores: Brotman, Moreno-Escobar, Joseph, Munakomi y Pawar  
Título: *Amyotrophic Lateral Sclerosis*  
Publicación: StatPearls [Internet], NBK556151 (act. 2024-02-12)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de codo.

Citada como:

1. Brotman 2024 — Brotman, Moreno-Escobar, Joseph, Munakomi y Pawar, «Amyotrophic Lateral Sclerosis», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de febrero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co3` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |

### Budha 2025

Autores: Budha, Paudel, Luitel, Joshi, Upreti y Ghimire  
Título: *Torticollis in a child with Grisel syndrome: A case report and review of the literature*  
Publicación: Int J Surg Case Rep 127:110817  
DOI: 10.1016/j.ijscr.2025.110817  
Última revisión: **sin revisar**  
Nota: Texto completo en PMC11786686 (acceso abierto). Caso clínico y revisión; razonamiento del cribado cervical (cv_n3).

Citada como:

1. Budha 2025 — Budha, Paudel, Luitel, Joshi, Upreti y Ghimire, «Torticollis in a child with Grisel syndrome: a case report and review of the literature», Int J Surg Case Rep 2025;127:110817 (texto completo en PMC).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_n3` · Médula / Estructural | 2 · razonamiento del cribado | 1 |

### Cabre 2022

Autores: Cabre, Moore, Smith-Ryan y Hackney  
Título: *Relative Energy Deficiency in Sport (RED-S): Scientific, Clinical, and Practical Implications for the Female Athlete*  
Publicación: Dtsch Z Sportmed 73(7):225–234  
DOI: 10.5960/dzsm.2022.546  
Última revisión: 2026-10 · Complementada: el consenso del COI de 2023 (Mountjoy 2023, Br J Sports Med, PDF del usuario) actualiza el marco: REDs en ambos sexos y la fractura de estrés del sacro o la pelvis como de alto riesgo. Se añade a `l_e6`; la cifra de 4,5 veces más lesiones óseas sigue citando Cabre.  
Nota: Texto completo en PMC9724109. Razonamiento del cribado lumbar (l_e6).

Citada como:

1. Cabre 2022 — Cabre, Moore, Smith-Ryan y Hackney, «Relative Energy Deficiency in Sport (RED-S): Scientific, Clinical, and Practical Implications for the Female Athlete», Dtsch Z Sportmed 2022;73(7):225–234 (texto completo en PMC).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_e6` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |

### Cadogan 2013

Autores: Cadogan, McNair, Laslett y Hing  
Título: *Shoulder pain in primary care: diagnostic accuracy of clinical examination tests for non-traumatic acromioclavicular joint pain*  
Publicación: BMC Musculoskelet Disord 14:156  
DOI: 10.1186/1471-2474-14-156  
Última revisión: 2026-10 · Añadida: texto completo leído en Europe PMC (2026-10). Estudio prospectivo en atención primaria (153 pacientes consecutivos; referencia: bloqueo de la AC guiado por fluoroscopia, ≥80 % de alivio); es uno de los 2 estudios de Krill 2018.  
Nota: Contexto de los tests de la AC de h7 (tabla 4).

Citada como:

1. Brazo a 90° de flexión, aducción horizontal pasiva cruzando el cuerpo. Positivo si duele en la parte superior del hombro, cerca de la AC. Cuenta como hallazgo. En un estudio retrospectivo de casos y controles da S 77 % (27 de 35) y E 79 % (410 de 518), de las que saldrían LR+ 3,7 y LR− 0,29; pero los casos se definieron por dolor a la palpación de la AC e infiltración positiva, y los controles eran otras cirugías de hombro. En atención primaria (Cadogan 2013, 153 pacientes consecutivos, bloqueo de la AC guiado por fluoroscopia) da S 64 %, E 26 %, LR+ 0,86, LR− 1,39: no discrimina. La revisión de Krill 2018 deja fuera el primero por ser de nivel III. Lluch 2020 (cap. 3.1, p. 61) dice «S >67 %». S y E solo aquí, para que no se recalcule la LR.
2. Chronopoulos 2004 (Am J Sports Med 32:655–661, tabla 3; 35 lesiones AC crónicas aisladas frente a 580 controles quirúrgicos) · Cadogan 2013 (BMC Musculoskelet Disord 14:156, tabla 4) · Krill 2018 (Phys Sportsmed 46:98–104, revisión sistemática; tabla 3)
3. Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6). En atención primaria (Cadogan 2013, 153 pacientes consecutivos, bloqueo de la AC guiado por fluoroscopia) da S 14 %, E 92 %, LR+ 1,73 (0,53–5,15). Combinado con el Paxinos y hechos en serie (los dos positivos), la revisión de Krill 2018 (Walton 2004 y Cadogan 2013; deja fuera a Chronopoulos 2004 por ser de nivel III) da S 11 %, E 96 % y LR+ 2,71, la mejor de las combinaciones, y concluye que ninguna cambia más que poco la probabilidad; Lluch 2020 (cap. 3.1, p. 61) lo resume como «S y E >90 %», cifra que la revisión no respalda.
4. Chronopoulos 2004 (Am J Sports Med 32:655–661, tabla 3) · Walton 2004 (J Bone Joint Surg Am) · Cadogan 2013 (BMC Musculoskelet Disord 14:156, tabla 4) · Krill 2018 (Phys Sportsmed 46:98–104, revisión sistemática; tablas 3 y 4)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h7 · Artropatía Acromioclavicular | Test «Test de Aducción Cruzada (Cross-body Adduction)» (en `criterio`) | 4b · mención en el texto | 1 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Test de Aducción Cruzada (Cross-body Adduction)» | 4b · cita bajo el test | 2 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» (en `criterio`) | 4b · mención en el texto | 3 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» | 4b · cita bajo el test | 4 |

### Caliandro 2025

Autores: Caliandro, La Torre, Padua, Giannini, Reale y Padua  
Título: *Treatment for ulnar neuropathy at the elbow*  
Publicación: Cochrane Database Syst Rev 2025(4):CD006839  
DOI: 10.1002/14651858.CD006839.pub5  
Última revisión: **sin revisar**  
Nota: Revisión Cochrane (15 ensayos, 970 participantes; búsqueda hasta julio de 2022). Solo el resumen de los autores: el texto completo no es accesible desde la red de la sesión. Leído en la sesión de dosis de codo (2026-10). Pauta de co8.

Citada como:

1. Caliandro 2025, Cochrane Database Syst Rev (4):CD006839 (revisión Cochrane, 15 ensayos; solo el resumen) · Rinkel 2013, Clin J Pain 29(12):1087–1096 (revisión sistemática) · Bateman 2025, Hand Ther 30(3):105–112 (revisión sistemática con GRADE; solo el resumen)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Campbell 2020

Publicación: Am J Sports Med 48:2819–2827  
DOI: 10.1177/0363546520937302  
Última revisión: **sin revisar**  
Nota: Recoge los datos de Roedl (sin año en la cita).

Citada como:

1. Roedl, recogido en Campbell 2020 (Am J Sports Med 48:2819–2827, revisión sistemática; 144 pacientes, referencia intraoperatoria, positivo con apertura ≥1,0 mm frente al lado sano; para rotura completa, umbral de 2,5 mm: S 95 %, E 89 %)
2. Roedl, recogido en Campbell 2020 (Am J Sports Med 48:2819–2827, revisión sistemática; 144 pacientes, referencia intraoperatoria; la misma precisión que la ecografía convencional en esa cohorte; otros estudios de la revisión, S 81–100 %, E 91–100 %)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Ecografía dinámica con estrés en valgo» | 4b · cita bajo el test | 1 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «RM con artrograma» | 4b · cita bajo el test | 2 |

### Carro 2016

Autores: Pérez Carro, Fernández Hernando, Cerezal, Sáenz Navarro, Alfonso Fernández y Ortiz Castillo  
Título: *Deep gluteal space problems: piriformis syndrome, ischiofemoral impingement and sciatic nerve release*  
Publicación: Muscles Ligaments Tendons J 6(3):384–396  
DOI: 10.11138/mltj/2016.6.3.384  
Última revisión: 2026-10 · Sin cambios: PubMed (síndrome glúteo profundo o del piriforme, diagnóstico, revisiones desde 2018) solo encuentra revisiones narrativas, sin cifras de exactitud de los tests clínicos.  
Nota: Revisión narrativa, acceso abierto; PDF aportado por el usuario (2026-10; Europe PMC daba error 500 con el texto completo). DOI verificado en Europe PMC (PMID 28066745), que indexa al primer autor (Luis Pérez Carro) como «Carro LP», igual que Lluch 2020, cap. 4.1 (ref. 42): de ahí la clave. Técnica del estiramiento del piriforme en sedestación e intolerancia a estar sentado más de 20–30 min (sin cifras de exactitud propias). Tests de ca7 (cadera).

Citada como:

1. Carro 2016 (Muscles Ligaments Tendons J 6(3):384–396, revisión narrativa)
2. Carro 2016 (Muscles Ligaments Tendons J 6(3):384–396, revisión narrativa). Grimaldi 2026 (Musculoskelet Sci Pract 84:103592, revisión narrativa, apartado 2.1.3)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca7 · Síndrome Glúteo Profundo (Síndrome Piriforme) | Test «Test de estiramiento del piriforme en sedestación» | 4b · cita bajo el test | 1 |
| Cadera | ca7 · Síndrome Glúteo Profundo (Síndrome Piriforme) | Test «Dolor con sedestación prolongada (>20 min)» | 4b · cita bajo el test | 2 |

### Cascia 2019

Autores: Cascia, Picha, Hettrich y Uhl  
Título: *Considerations of Conservative Treatment After a Partial Ulnar Collateral Ligament Injury in Overhead Athletes: A Systematic Review*  
Publicación: Sports Health 11(4):367–374  
DOI: 10.1177/1941738119853589  
Última revisión: **sin revisar**  
Nota: Revisión sistemática de 7 series retrospectivas (nivel 4). Solo el resumen de los autores (Europe PMC no da el texto completo). Leído en la sesión de dosis de codo (2026-10). Pauta de co4.

Citada como:

1. Biz 2019, Orthop Surg 11(6):974–984 (revisión sistemática de 15 estudios, casi todos de nivel IV) · Cascia 2019, Sports Health 11(4):367–374 (revisión sistemática de 7 series retrospectivas, nivel 4; solo el resumen)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Chauhan 2023

Autores: Chauhan, Jandu, Brent y Al-Dhahir  
Título: *Rheumatoid Arthritis*  
Publicación: StatPearls [Internet], NBK441999 (act. 2023-05-25)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 25 de mayo de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie.

Citada como:

1. Chauhan 2023 — Chauhan, Jandu, Brent y Al-Dhahir, «Rheumatoid Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de mayo de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_in2` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_n1` · Médula / Estructural | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_in2` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_i2` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |

### Chen 2023

Autores: Chen, Sabir y Al Khalili  
Título: *Physiology, Osmoregulation and Excretion*  
Publicación: StatPearls [Internet], NBK541108 (act. 2023-05-01)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Chen 2023 — Chen, Sabir y Al Khalili, «Physiology, Osmoregulation and Excretion», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `end_2` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |

### Childs 2004

Autores: Childs, Fritz, Flynn, Irrgang, Johnson, Majkowski y Delitto  
Título: *A Clinical Prediction Rule To Identify Patients with Low Back Pain Most Likely To Benefit from Spinal Manipulation: A Validation Study*  
Publicación: Ann Intern Med 141(12):920–928  
DOI: 10.7326/0003-4819-141-12-200412210-00008  
Última revisión: 2026-10 · Sin cambios: Haskins 2015 (J Clin Epidemiol, revisión sistemática, PDF del usuario) encuentra 9 validaciones de la regla: ser positivo predice menos discapacidad con manipulación con o sin thrust, pero como modificador del efecto solo la apoya Childs 2004 (Hancock 2008 no), y no hay estudios de impacto. Se añade al criterio de lu1. PubMed (reglas de predicción para manipulación lumbar desde 2012) no encuentra nada posterior.  
Nota: PDF del usuario (2026-10). Validación de la regla de Flynn (lu1).

Citada como:

1. Flynn 2002 (regla pronóstica: probabilidad de éxito con manipulación del 45 % al 95 %) · Childs 2004 (Ann Intern Med, ensayo de validación) · Hancock 2008 (Eur Spine J, validación independiente) · Haskins 2015 (J Clin Epidemiol, revisión sistemática)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu1 · Disfunción Segmentaria Lumbosacra (Déficit de Movilidad) | Test «Regla de Predicción Clínica de Flynn (4/5 criterios)» | 4b · cita bajo el test | 1 |

### Chimenti 2024

Publicación: J Orthop Sports Phys Ther 54(12):CPG1–CPG32  
DOI: 10.2519/jospt.2024.0302  
Última revisión: **sin revisar**

Citada como:

1. Chimenti 2024, J Orthop Sports Phys Ther 54(12):CPG1–CPG32 (guía de práctica clínica APTA; letra = grado de la recomendación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp8 · Tendinopatía del Aquiles, Porción Media | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Chronopoulos 2004

Publicación: Am J Sports Med  
DOI: 10.1177/0363546503261723  
Última revisión: 2026-10 · Cifras actualizadas en Cadogan 2013: PDF del usuario leído entero (2026-10). Las cifras citadas coinciden con su tabla 3 (aducción cruzada 27 de 35 y 410 de 518; O’Brien 7 de 17 y 291 de 308), pero es retrospectivo de casos y controles con controles quirúrgicos, Krill 2018 lo excluye por ser de nivel III y en atención primaria (Cadogan 2013) la aducción cruzada no discrimina (LR+ 0,86): la aducción cruzada de h7 pasa a hallazgo (decisión del usuario).  
Nota: Mismo cirujano y misma base de datos quirúrgica (Johns Hopkins) que Park 2005.

Citada como:

1. Chronopoulos 2004 (Am J Sports Med 32:655–661, tabla 3; 35 lesiones AC crónicas aisladas frente a 580 controles quirúrgicos) · Cadogan 2013 (BMC Musculoskelet Disord 14:156, tabla 4) · Krill 2018 (Phys Sportsmed 46:98–104, revisión sistemática; tabla 3)
2. Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6). En atención primaria (Cadogan 2013, 153 pacientes consecutivos, bloqueo de la AC guiado por fluoroscopia) da S 14 %, E 92 %, LR+ 1,73 (0,53–5,15). Combinado con el Paxinos y hechos en serie (los dos positivos), la revisión de Krill 2018 (Walton 2004 y Cadogan 2013; deja fuera a Chronopoulos 2004 por ser de nivel III) da S 11 %, E 96 % y LR+ 2,71, la mejor de las combinaciones, y concluye que ninguna cambia más que poco la probabilidad; Lluch 2020 (cap. 3.1, p. 61) lo resume como «S y E >90 %», cifra que la revisión no respalda.
3. Chronopoulos 2004 (Am J Sports Med 32:655–661, tabla 3) · Walton 2004 (J Bone Joint Surg Am) · Cadogan 2013 (BMC Musculoskelet Disord 14:156, tabla 4) · Krill 2018 (Phys Sportsmed 46:98–104, revisión sistemática; tablas 3 y 4)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h7 · Artropatía Acromioclavicular | Test «Test de Aducción Cruzada (Cross-body Adduction)» | 4b · cita bajo el test | 1 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» (en `criterio`) | 4b · mención en el texto | 2 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» | 4b · cita bajo el test | 3 |

### Consenso de Zúrich IHiPRN

Autores: Kemp, Risberg, Mosler, Harris-Hayes, Serner, Moksnes, Bloom, Crossley et al. (grupo IHiPRN; último autor, Bizzini)  
Título: *Physiotherapist-led treatment for young to middle-aged active adults with hip-related pain: consensus recommendations from the International Hip-related Pain Research Network, Zurich 2018*  
Publicación: Br J Sports Med 54:504–511 (2020)  
DOI: 10.1136/bjsports-2019-101458  
Última revisión: 2026-10 · Sin cambios: PubMed (SIFA y fisioterapia, consensos y revisiones desde 2022) no encuentra un consenso posterior del IHiPRN; el ensayo PhysioFIRST (Kemp 2026) se suma a la pauta de ca2 sin contradecirlo.  
Nota: PDF aportado por el usuario. Mismo primer autor y año que la revisión «Kemp 2020», por eso se cita como «consenso de Zúrich». Dosis de ca2 y ca3 (cadera).

Citada como:

1. Abordaje multimodal (B): modificar la actividad y fortalecer la musculatura propia de la cadera (psoas ilíaco, glúteo medio y mayor, rotadores internos y externos), el tronco (abdominales y paravertebrales) y el resto del miembro inferior, junto con terapia manual, corrección postural y del movimiento, estiramientos y equilibrio. Evitar los ejercicios que provoquen síntomas o que lleven a rangos que reproduzcan el pinzamiento. Educación para modificar los factores agravantes y manejar el dolor (C); entrenamiento del patrón de movimiento en las actividades que duelen (C); movilización articular si el dolor o la cápsula limitan la movilidad, y de tejidos blandos si lo hacen músculo y fascia (F); reeducación neuromuscular progresiva (F). La ortesis sola no se recomienda (D, evidencia contradictoria). Duración de al menos 3 meses; recomendar actividad física, incluido el deporte, y hablar de expectativas, decidir juntos y educar (consenso de Zúrich). En el ensayo FASHIoN, 6–10 contactos en 12–24 semanas; la artroscopia mejoró algo más a los 12 meses (6,8 puntos de iHOT-33). En el ensayo PhysioFIRST (n = 154, de 18 a 50 años), 6 meses de fisioterapia (los 3 primeros, 6 consultas quincenales y 12 sesiones de ejercicio supervisadas semanales, más 2 sesiones semanales por su cuenta; después, 3 consultas mensuales y gimnasio por su cuenta) mejoraron la calidad de vida de forma clínicamente relevante tanto con fortalecimiento dirigido como con estiramientos estandarizados (unos 20 puntos de iHOT-33, sin diferencia entre ellos); con el fortalecimiento mejoraron más la fuerza y el dolor percibido (72 % frente a 52 %). Ninguna fuente fija series ni repeticiones: el volumen queda a criterio del clínico.
2. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Griffin 2018, Lancet 391:2225–2235 (ensayo aleatorizado UK FASHIoN, n = 348) · Kemp 2026, Br J Sports Med 60:951–961 (ensayo aleatorizado PhysioFIRST, n = 154, fortalecimiento dirigido frente a estiramientos)
3. El mismo abordaje multimodal que en el SIFA, que la guía recomienda en particular para el SIFA y las lesiones del labrum (B): modificar la actividad y fortalecer cadera (psoas ilíaco, glúteos, rotadores), tronco y miembro inferior, junto con terapia manual, corrección postural y del movimiento, estiramientos y equilibrio, evitando los ejercicios y rangos que provoquen síntomas. Educación sobre los factores agravantes y el dolor (C) y entrenamiento del patrón de movimiento (C). Al menos 3 meses (consenso de Zúrich). En adolescentes con rotura labral en la RM, el 73 % de los tratados solo con fisioterapia y modificación de la actividad alcanzó la mejoría mínima importante a los 3 años, igual que con infiltración o artroscopia (serie de casos). Ninguna fuente fija series ni repeticiones: el volumen queda a criterio del clínico.
4. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía; serie de Murtha citada en ella) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Kemp 2020, Br J Sports Med 54:1382–1394 (revisión sistemática)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Dosis (en el texto) | 5 · mención en el texto | 1 |
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Pauta de tratamiento | 5 · cita de la pauta | 2 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Dosis (en el texto) | 5 · mención en el texto | 3 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Pauta de tratamiento | 5 · cita de la pauta | 4 |

### Consoli y Carlson 2026

Autores: Consoli y Carlson  
Título: *Endometriosis*  
Publicación: StatPearls [Internet], NBK567777 (act. 2026-06-17)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 17 de junio de 2026 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Consoli y Carlson 2026 — Consoli y Carlson, «Endometriosis», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de junio de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_u4` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l3` · Gastrointestinal | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_e3` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |

### Cook 2001

Autores: Cook, Khan, Kiss, Purdam y Griffiths  
Título: *Reproducibility and clinical utility of tendon palpation to detect patellar tendinopathy in young basketball players*  
Publicación: Br J Sports Med 35(1):65–9  
DOI: 10.1136/bjsm.35.1.65  
Última revisión: 2026-10 · Sin cambios: PubMed (precisión diagnóstica de la palpación y de las pruebas de carga en la tendinopatía rotuliana desde 2016) no encuentra ninguna revisión sistemática; la guía holandesa (Ophey 2025) ya resume esta evidencia.  
Nota: Leído el resumen de PubMed (2026-10); el texto de PMC1724272 es un escaneado sin texto. Palpación del tendón en ro5 (sin cifras de S ni E).

Citada como:

1. Ophey 2025 (Knee Surg Sports Traumatol Arthrosc 33:457–469; guía multidisciplinar holandesa, módulo 4; certeza GRADE muy baja); Cook 2001 (Br J Sports Med 35:65–9; 326 tendones de jóvenes jugadores de baloncesto; referencia: ecografía)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro5 · Tendinopatía Rotuliana | Test «Dolor localizado en polo inferior de rótula + palpación del tendón» | 4b · cita bajo el test | 1 |

### Cook 2010

Autores: Cook, Hegedus, Hawkins, Scovell y Wyland  
Título: *Diagnostic Accuracy and Association to Disability of Clinical Test Findings Associated with Patellofemoral Pain Syndrome*  
Publicación: Physiother Can 62(1):17–24  
DOI: 10.3138/physio.62.1.17  
Última revisión: 2026-10 · Sin cambios: PubMed (pruebas clínicas de dolor femoropatelar desde 2013) no encuentra ninguna revisión sistemática posterior que agrupe la sentadilla.  
Nota: Resumen leído en PubMed (2026-10; en PMC solo el escaneado) y su fila de la tabla 3 de Nunes 2013 (PDF del usuario). 76 pacientes consecutivos con dolor anterior de rodilla. Origen de la cifra de la sentadilla de ro3.

Citada como:

1. Nunes 2013 (Phys Ther Sport 14:54–9; revisión sistemática, 5 estudios, tabla 3); la cifra de la sentadilla es de Cook 2010 (Physiother Can 62:17–24; 76 pacientes consecutivos con dolor anterior de rodilla, dolor femoropatelar frente a otros diagnósticos; calidad intermedia en QUADAS: no consta el cegamiento del examinador)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro3 · Dolor Patelofemoral (Síndrome) | Test «Dolor anterior durante sentadilla» | 4b · cita bajo el test | 1 |

### Cook 2011

Publicación: Physiother Res Int 16(3):170–178  
DOI: 10.1002/pri.500  
Última revisión: 2026-10 · Sin cambios en las cifras: Cook 2019 (revisión sistemática, PDF del usuario) la incluye solo con sus ítems sueltos, sin el clúster, y le asigna riesgo de sesgo alto (QUADAS-2); no hay validación posterior del clúster. El aviso se añade a la cita.

Citada como:

1. Cook 2011 (n = 1448). 4 de 5: S 6 %, E 98 %; ninguno: S 96 %. Cook 2019 (revisión sistemática) le asigna riesgo de sesgo alto (QUADAS-2)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Cluster «Cluster de Cook (anamnesis y observación)» | 4b · cita del cluster | 1 |

### Cook 2019

Autores: Cook, Cook, Reiman, Joshi, Richardson y Garcia  
Título: *Systematic review of diagnostic accuracy of patient history, clinical findings, and physical tests in the diagnosis of lumbar spinal stenosis*  
Publicación: Eur Spine J 29(1):93–112  
DOI: 10.1007/s00586-019-06048-4  
Última revisión: 2026-10 · Sin cambios: PubMed (revisiones sistemáticas de precisión diagnóstica de la historia y la exploración en estenosis lumbar desde 2019) solo encuentra Wang 2024 (J Med Internet Res) y Yang 2024 (Spine), de inteligencia artificial sobre imagen, no de exploración clínica.  
Nota: PDF del usuario (2026-10), leído entero. Romberg de lu4 (tabla 5) y riesgo de sesgo de Cook 2011.

Citada como:

1. Cook 2019 (Eur Spine J, revisión sistemática; datos de Katz 1995, n = 75; referencia: diagnóstico del médico experto; LR+ IC 95 %: 1,29–12,76; riesgo de sesgo bajo). Antes: Suri 2010, LR+ 4,2
2. Cook 2019 (Eur Spine J, revisión sistemática; datos de Katz 1995, n = 75; referencia: diagnóstico del médico experto; LR+ 1,64, IC 95 %: 0,91–2,96; riesgo de sesgo bajo). Versión modificada: Dobbs 2016 (Manual Therapy, n = 30; referencia: RM)
3. Cook 2011 (n = 1448). 4 de 5: S 6 %, E 98 %; ninguno: S 96 %. Cook 2019 (revisión sistemática) le asigna riesgo de sesgo alto (QUADAS-2)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Romberg alterado» | 4b · cita bajo el test | 1 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Test de extensión lumbar de 30 s» | 4b · cita bajo el test | 2 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Cluster «Cluster de Cook (anamnesis y observación)» | 4b · cita del cluster | 3 |

### Culvenor 2019

Autores: Culvenor, Øiestad, Hart, Stefanik, Guermazi y Crossley  
Título: *Prevalence of knee osteoarthritis features on magnetic resonance imaging in asymptomatic uninjured adults: a systematic review and meta-analysis*  
Publicación: Br J Sports Med 53(20):1268–78  
DOI: 10.1136/bjsports-2018-099257  
Última revisión: 2026-10 · Sin cambios: texto completo leído en PMC; 63 estudios, 5397 rodillas y, con 40 años o más, defectos de cartílago 43 % y roturas de menisco 19 % coinciden. PubMed (prevalencia de hallazgos en la RM de rodillas sin síntomas, revisiones desde 2019) no encuentra ninguna posterior.  
Nota: Ref. 65 de Lluch 2020, cap. 4.2 (allí con fecha 2018, la de la publicación anticipada). Cifras (defectos de cartílago en el 43 % y roturas de menisco en el 19 % de los adultos de 40 años o más) leídas en el resumen de PubMed (2026-10). Pronóstico de ro1.

Citada como:

1. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 210–211; Culvenor 2019 (Br J Sports Med 53:1268–78; revisión sistemática con metaanálisis, 63 estudios, 5397 rodillas sin síntomas ni lesiones)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro1 · Artrosis de Rodilla | Pronóstico | 5 · cita del pronóstico | 1 |

### Cunha 2023

Autores: Cunha, Tadi y Bragg  
Título: *Torticollis*  
Publicación: StatPearls [Internet], NBK539857 (act. 2023-08-08)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Cunha 2023 — Cunha, Tadi y Bragg, «Torticollis», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_n2` · Médula / Estructural | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_n3` · Médula / Estructural | 2 · razonamiento del cribado | 1 |

### Daley 2025

Autores: Daley, Ali, Ohnuma y Adigun  
Título: *Anorexia and Cachexia*  
Publicación: StatPearls [Internet], NBK430977 (act. 2025-01-19)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 19 de enero de 2025 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie.

Citada como:

1. Daley 2025 — Daley, Ali, Ohnuma y Adigun, «Anorexia and Cachexia», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h6` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_on3` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv5` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_c1` · Oncológico / Sistémico | 2 · razonamiento del cribado | 1 |

### Davis y Shaw 2023

Autores: Davis y Shaw  
Título: *Popliteal Artery Entrapment Syndrome*  
Publicación: StatPearls [Internet], NBK441965 (act. 2023-08-28)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 28 de agosto de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Davis y Shaw 2023 — Davis y Shaw, «Popliteal Artery Entrapment Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 28 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `r_v1` · Vascular | 2 · razonamiento del cribado | 1 |

### Davis y Silberman 2023

Autores: Davis y Silberman  
Título: *Acute Bacterial Prostatitis*  
Publicación: StatPearls [Internet], NBK459257 (act. 2023-05-22)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 22 de mayo de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Davis y Silberman 2023 — Davis y Silberman, «Acute Bacterial Prostatitis», StatPearls [Internet], NCBI Bookshelf, última actualización 22 de mayo de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_u2` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Décary 2018

Publicación: PLoS One 13:e0198797 · PM R 10:472–482 · Arch Phys Med Rehabil 99(4):607–614 (tres artículos)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: PDF de los tres artículos leídos (PLoS One en PMC; PM&R y Arch Phys Med Rehabil, del usuario): las cifras de ro2, ro3 y ro4 coinciden con sus tablas (PM&R, tabla del grupo traumático y tabla 6; Arch Phys Med Rehabil, tablas 3 y 4; PLoS One, tablas 6 y 7), incluidas las de la validación interna por bootstrap. PubMed (publicaciones de Décary sobre rodilla desde 2018 y validaciones de grupos de historia y exploración de rodilla) no encuentra ninguna validación externa de estos grupos.  
Nota: Tres artículos distintos con la misma clave: la cita de cada uso dice la revista. DOI de cada uno (el campo doi admite uno solo): PLoS One (LCA) 10.1371/journal.pone.0198797; PM R (menisco) 10.1016/j.pmrj.2017.10.009; Arch Phys Med Rehabil (dolor femoropatelar; PDF del usuario leído en 2026-10, tablas 3 y 4: los grupos para confirmar y descartar de ro3) 10.1016/j.apmr.2017.10.014.

Citada como:

1. Décary 2018 (PM&R; n = 279, 35 roturas traumáticas; referencia: diagnóstico compuesto de médico experto con RM)
2. Décary 2018 (PM&R; n = 279, 45 roturas degenerativas; referencia: diagnóstico compuesto de médico experto con RM)
3. Décary 2018 (Arch Phys Med Rehabil 99:607–614; n = 279 consultas por la rodilla, 75 con dolor femoropatelar; referencia: diagnóstico compuesto de médico experto con radiografía y, si hacía falta, RM; tabla 3)
4. Décary 2018 (Arch Phys Med Rehabil 99:607–614; n = 279 consultas por la rodilla, 75 con dolor femoropatelar; referencia: diagnóstico compuesto de médico experto con radiografía y, si hacía falta, RM; tabla 4)
5. Décary 2018 (PLoS One; n = 279, 22 roturas completas; referencia: diagnóstico compuesto de médico experto con RM)
6. Décary 2018 (PLoS One; n = 279, 43 roturas parciales o completas; referencia: diagnóstico compuesto de médico experto con RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro2 · Lesión Meniscal | Test «Combinación traumática: traumatismo + dolor medial o difuso + palpación de la interlínea medial» | 4b · cita bajo el test | 1 |
| Rodilla | ro2 · Lesión Meniscal | Test «Combinación degenerativa: inicio progresivo + dolor medial aislado + uno de tres» | 4b · cita bajo el test | 2 |
| Rodilla | ro3 · Dolor Patelofemoral (Síndrome) | Test «Confirmar: grupos de Décary (edad, localización del dolor, escaleras, faceta medial, extensión pasiva)» | 4b · cita bajo el test | 3 |
| Rodilla | ro3 · Dolor Patelofemoral (Síndrome) | Test «Descartar: grupos de Décary (si se cumple alguno, marcar «Negativo»)» | 4b · cita bajo el test | 4 |
| Rodilla | ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test «Confirmar: mecanismo de pivote + derrame inmediato + Lachman positivo» | 4b · cita bajo el test | 5 |
| Rodilla | ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test «Descartar: sin mecanismo de pivote ni chasquido + Lachman o pivot shift negativos (si se cumple, marcar «Negativo»)» | 4b · cita bajo el test | 6 |

### Deeb y Maher 2026

Autores: Deeb y Maher  
Título: *Psoriatic Arthritis*  
Publicación: StatPearls [Internet], NBK547710 (act. 2026-04-19)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie.

Citada como:

1. Deeb y Maher 2026 — Deeb y Maher, «Psoriatic Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de abril de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | — | Pregunta `tp_i2` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |

### Deeb y Maher 2026 (Raynaud)

Autores: Deeb y Maher  
Título: *Raynaud Disease*  
Publicación: StatPearls [Internet], NBK499833 (act. 2026-09-13)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de codo. Mismos autores y año que «Deeb y Maher 2026» (Psoriatic Arthritis); la clave lleva el tema entre paréntesis para distinguirlas (decisión del usuario).

Citada como:

1. Deeb y Maher 2026 (Raynaud) — Deeb y Maher, «Raynaud Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de septiembre de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co4a` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |
| Codo | — | Pregunta `co4a_uni` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |
| Codo | — | Pregunta `co4a_prog` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |

### Demont 2022

Publicación: Musculoskelet Sci Pract  
DOI: 10.1016/j.msksp.2022.102640  
Última revisión: **sin revisar**

Citada como:

1. Demont 2022 (Musculoskelet Sci Pract, metaanálisis, 4 estudios, n = 182; frente a cefalea facetaria cervical baja, migraña, cefaleas concomitantes o asintomáticos; certeza moderada. S IC 95 %: 70–92 %; E IC 95 %: 71–91 %; LR+ IC 2,6–9,5; LR− IC 0,1–0,4; 4 estudios de cohorte prospectivos de Hall y Ogince, 2007–2010; riesgo de sesgo por la selección de pacientes). FRT normal en cervicogénica de C2–C3/C3–C4: Getsoian 2020 (BMJ Open, bloqueos diagnósticos controlados), citado en Demont 2022. Precauciones: Paquin 2022 (Arch Physiother 12:26, artículo de opinión)
2. Movilidad pasiva intervertebral de C0 a C3; el segmento sintomático más frecuente es C1–C2. Una revisión de calidad aceptable (Rubio-Ochoa, citada por la guía) da para la cefalea cervicogénica κ 0,53–0,72, S 59–65 %, E 78–87 %, LR+ 2,9–4,9 y LR− 0,43–0,49. Hallazgo esperado: la cefalea se reproduce al provocar los segmentos cervicales altos implicados. No puntúa (decisión del usuario): el FRT ya aporta la LR de la hipótesis con un metaanálisis más reciente (Demont 2022), el patrón de referencia de estos estudios es la propia exploración manual, de fiabilidad pobre, y la guía califica de pobre a regular la fiabilidad entre examinadores de la movilidad pasiva intervertebral cervical.
3. Jull 2007 (Cephalalgia 27:793–802, parte 1; 18 cervicogénicas frente a 22 migrañas, 33 tensionales y 57 controles, n = 130; tabla 3). Riesgo de sesgo alto según Demont 2022 (PROBAST)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce4 · Cefalea Cervicogénica | Test «Test de Flexión-Rotación Cervical (CFRT)» | 4b · cita bajo el test | 1 |
| Cervical | ce4 · Cefalea Cervicogénica | Test «PAIVM C0-C3 (segmento C1-C2 más sintomático)» (en `criterio`) | 4b · mención en el texto | 2 |
| Cervical | ce4 · Cefalea Cervicogénica | Test «Cluster: ROM cervical + PAIVM + CCFT» | 4b · cita bajo el test | 3 |

### Denault y Launico 2026

Autores: Denault y Launico  
Título: *Physiology, Platelet*  
Publicación: StatPearls [Internet], NBK470328 (act. 2026-09-14)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Denault y Launico 2026 — Denault y Launico, «Physiology, Platelet», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de septiembre de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `hem_1` · Hematológico | 2 · razonamiento del cribado | 1 |

### Desmeules 2025

Autores: Desmeules, Roy, Lafrance, Charron, Dubé, Dupuis, Beneciuk, Grimes, Kim, Lamontagne, McCreesh, Shanley, Vukobrat y Michener  
Título: *Rotator Cuff Tendinopathy Diagnosis, Nonsurgical Medical Care, and Rehabilitation: A Clinical Practice Guideline*  
Publicación: J Orthop Sports Phys Ther 55(4):235–274  
DOI: 10.2519/jospt.2025.13182  
Última revisión: 2026-10 · Sin cambios: guía de 2025; búsqueda en PubMed (2026-10) sin versión posterior. Sigue como pauta de h2 y h3.  
Nota: PDF aportado por el usuario. Incluye tendinopatía del manguito con o sin calcificación, síndrome de dolor subacromial y rotura parcial; excluye la rotura completa. Pauta de h2 y h3; recomendación 6 en el test de observación escapular de h8.

Citada como:

1. Desmeules 2025, J Orthop Sports Phys Ther 55(4):235–274 (guía de práctica clínica; incluye el síndrome de dolor subacromial dentro de la tendinopatía del manguito; letra = grado de la recomendación, tal como la da la guía)
2. Desmeules 2025, J Orthop Sports Phys Ther 55(4):235–274 (guía de práctica clínica; incluye la rotura parcial y excluye la completa; letra = grado de la recomendación, tal como la da la guía) · Alentorn-Geli 2026, Knee Surg Sports Traumatol Arthrosc 34:3040–3051 (consenso formal de la ESSKA-ESA, parte 2: tratamiento y vuelta al deporte; letra = grado de la recomendación, tal como la da el consenso; ninguna llega a A)
3. Asimetría visual en la elevación del brazo: ángulo inferior, borde medial o espina escapular prominentes. Las medidas de la movilidad escapular son poco fiables y de validez limitada, y no deben usarse para medir objetivamente la movilidad escapular dinámica (Desmeules 2025, recomendación 6, A). La discinesia se asocia al SAPS, pero no se ha demostrado que cause el dolor (Lluch 2020). Sin S ni E; no puntúa.
4. Desmeules 2025 (J Orthop Sports Phys Ther 55(4):235–274, recomendación 6) · Lluch 2020, cap. 3.1 (Struyf), pp. 53–54

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Hombro | h3 · Rotura del Manguito Rotador | Pauta de tratamiento | 5 · cita de la pauta | 2 |
| Hombro | h8 · Discinesia Escapular | Test «Observación visual de asimetría escapular (winging, tilting)» (en `criterio`) | 4b · mención en el texto | 3 |
| Hombro | h8 · Discinesia Escapular | Test «Observación visual de asimetría escapular (winging, tilting)» | 4b · cita bajo el test | 4 |

### Devereaux y ElMaraghy 2013

Autores: Devereaux y ElMaraghy  
Título: *Improving the rapid and reliable diagnosis of complete distal biceps tendon rupture: a nuanced approach to the clinical examination*  
Publicación: Am J Sports Med 41(9):1998–2004  
DOI: 10.1177/0363546513493383  
Última revisión: **sin revisar**  
Nota: Leído en la sesión de codo (2026-10). Resumen en PubMed (PMID 23804587) y cifras de Zwerus 2018, tabla 4. Hook test y pronación pasiva de co7 (codo).

Citada como:

1. Devereaux y ElMaraghy 2013 (Am J Sports Med 41:1998–2004; cohorte), recogido en Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · O'Driscoll 2007 (Am J Sports Med 35:1865–1869; resumen en PubMed) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84–85 y 102
2. Devereaux y ElMaraghy 2013 (Am J Sports Med 41:1998–2004; cohorte), recogido en Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 85 y 102

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co7 · Rotura Distal del Bíceps | Test «Test del Gancho (Hook Test)» | 4b · cita bajo el test | 1 |
| Codo | co7 · Rotura Distal del Bíceps | Test «Pronación pasiva del antebrazo (PFP) / test de pronosupinación pasiva» | 4b · cita bajo el test | 2 |

### Devillé 2000

Publicación: Spine 25(9):1140–1147  
DOI: 10.1097/00007632-200005010-00016  
Última revisión: 2026-10 · Sustituida por van der Windt 2010 (revisión Cochrane del mismo grupo, con Devillé como autor; PDF del usuario): SLR y SLR cruzado de lu3 pasan a sus cifras agrupadas con LR publicadas. Se menciona como dato anterior.

Citada como:

1. van der Windt 2010 (revisión Cochrane, 9 estudios; LR+ IC 95 %: 1,1–1,4; LR− 0,24–0,39; referencia: cirugía). Antes: Devillé 2000
2. van der Windt 2010 (revisión Cochrane, 5 estudios; LR+ IC 95 %: 1,6–2,8; referencia: cirugía o imagen). Antes: Devillé 2000

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «Test de Elevación de Pierna Recta (SLR) ipsilateral» | 4b · cita bajo el test | 1 |
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «SLR Contralateral (Lasègue cruzado)» | 4b · cita bajo el test | 2 |

### Dobbs 2016

Publicación: Manual Therapy  
DOI: 10.1016/j.math.2016.05.332  
Última revisión: 2026-10 · Sin cambios: Cook 2019 (PDF del usuario) recoge el test de extensión modificado con las mismas cifras (S 0,92, E 0,40, LR− 0,20, IC hasta 1,36; n = 30, referencia RM). PubMed (revisiones de tests clínicos de estenosis lumbar desde 2019) no encuentra nada posterior.

Citada como:

1. Cook 2019 (Eur Spine J, revisión sistemática; datos de Katz 1995, n = 75; referencia: diagnóstico del médico experto; LR+ 1,64, IC 95 %: 0,91–2,96; riesgo de sesgo bajo). Versión modificada: Dobbs 2016 (Manual Therapy, n = 30; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Test de extensión lumbar de 30 s» | 4b · cita bajo el test | 1 |

### Dookie y Joseph 2023

Autores: Dookie y Joseph  
Título: *Osteoid Osteoma*  
Publicación: StatPearls [Internet], NBK537279 (act. 2023-08-14)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 14 de agosto de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie.

Citada como:

1. Dookie y Joseph 2023 — Dookie y Joseph, «Osteoid Osteoma», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `r2` · Oncológico / Hematológico | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_c2` · Oncológico / Sistémico | 2 · razonamiento del cribado | 1 |

### Dorf 2007

Publicación: J Hand Surg Am 32:882–886  
DOI: 10.1016/j.jhsa.2007.04.010  
Última revisión: **sin revisar**

Citada como:

1. Prensión máxima con el codo a 90° de flexión y en extensión completa: en la epicondilalgia, la fuerza cae en extensión (en el sano no cambia). Cuenta como hallazgo: los intervalos no se convierten en LR, y el estudio de origen comparaba el brazo afectado con el sano del mismo paciente, no con otras causas de dolor lateral. Cifras de Dorf 2007 en Zwerus 2018 (tabla 4; 40 pacientes, brazo sano como control): caída ≥5 %, S 83 %, E 80 % (LR+ 4,2, LR− 0,21); ≥8 %, S 80 %, E 85 % (LR+ 5,3, LR− 0,24); ≥10 %, S 78 %, E 90 % (LR+ 7,7, LR− 0,24).
2. Karanasios 2022 (J Hand Ther 35:541–551; revisión sistemática, 24 estudios, 97 % con riesgo de sesgo alto o incierto; solo 2 estudios de exploración física). Estudio de origen, casi con seguridad: Dorf 2007 (J Hand Surg Am 32:882–886; retrospectivo, 81 pacientes; una diferencia del 8 % entre flexión y extensión distinguió el brazo afectado del sano con un 83 % de precisión) · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Reducción de fuerza de prensión (diferencia 5-10% entre posiciones)» (en `criterio`) | 4b · mención en el texto | 1 |
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Reducción de fuerza de prensión (diferencia 5-10% entre posiciones)» | 4b · cita bajo el test | 2 |

### Downie 2013

Autores: Downie, Williams, Henschke, Hancock, Ostelo, de Vet, Macaskill, Irwig, van Tulder, Koes y Maher  
Título: *Red flags to screen for malignancy and fracture in patients with low back pain: systematic review*  
Publicación: BMJ 347:f7095  
DOI: 10.1136/bmj.f7095  
Última revisión: 2026-10 · Complementada: PubMed (banderas rojas de cáncer o fractura en lumbalgia, revisiones desde 2014). Williams 2023 (Cochrane de fractura) es una reedición con búsqueda hasta 2012, no más reciente. Verhagen 2017 (Pain, PDF del usuario) confirma que el antecedente de cáncer es la única bandera de malignidad informativa (LR+ 15,3), y Galliker 2020 (Am J Med, PDF del usuario) añade los datos de urgencias (LR+ 5,9; 27,9 con sospecha clínica): se añaden a `l2`. Sin cambios para fractura (`l_e4`). Maselli 2022 (Disabil Rehabil, dolor toracolumbar) no leída.  
Nota: Texto completo en PMC3898572. Resume las dos revisiones Cochrane de banderas rojas (malignidad y fractura).

Citada como:

1. Downie 2013 — Downie, Williams, Henschke et al., «Red flags to screen for malignancy and fracture in patients with low back pain: systematic review», BMJ 2013;347:f7095 (texto completo en PMC).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_e4` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |

### Durer 2024

Autores: Durer, Gasalberti y Shaikh  
Título: *Ewing Sarcoma*  
Publicación: StatPearls [Internet], NBK559183 (act. 2024-01-08)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 8 de enero de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Durer 2024 — Durer, Gasalberti y Shaikh, «Ewing Sarcoma», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de enero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `r2` · Oncológico / Hematológico | 2 · razonamiento del cribado | 1 |

### Englund 2003

Autores: Englund, Roos y Lohmander  
Título: *Impact of type of meniscal tear on radiographic and symptomatic knee osteoarthritis: a sixteen-year followup of meniscectomy with matched controls*  
Publicación: Arthritis Rheum 48(8):2178–87  
DOI: 10.1002/art.11088  
Última revisión: 2026-10 · Sin cambios: PDF del usuario leído; 155 pacientes, 68 controles, RR 7,0 (2,1–23,5) por rotura degenerativa y 2,7 (0,9–7,7) por traumática coinciden. Las revisiones posteriores (PubMed, meniscectomía y artrosis desde 2015) tratan otros desenlaces (prótesis, rodilla tras el LCA) y no sustituyen esta cifra.  
Nota: Ref. 52 de Lluch 2020, cap. 4.2. El resumen de PubMed (2026-10) muestra que el riesgo 7 veces mayor es tras meniscectomía por rotura degenerativa (RR 7,0; por rotura traumática, 2,7, sin significación), no tras cualquier lesión meniscal. Pronóstico de ro2.

Citada como:

1. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 209–210; Englund 2003 (Arthritis Rheum 48:2178–87; 155 meniscectomías frente a 68 controles, 16 años; RR 7,0, IC 95 %: 2,1–23,5)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro2 · Lesión Meniscal | Pronóstico | 5 · cita del pronóstico | 1 |

### Enseki 2023

Autores: Enseki, Bloom, Harris-Hayes, Cibulka, Disantis, Di Stasi, Malloy, Clohisy y Martin  
Título: *Hip Pain and Movement Dysfunction Associated With Nonarthritic Hip Joint Pain: A Revision*  
Publicación: J Orthop Sports Phys Ther 53(7):CPG1–CPG70  
DOI: 10.2519/jospt.2023.0302  
Última revisión: 2026-10 · Sin cambios: es la revisión vigente de la guía APTA de dolor de cadera no artrósico; PubMed (2026-10) no encuentra una posterior (la revisión de 2025 es la de artrosis, Koc 2025).  
Nota: Guía de práctica clínica APTA; PDF aportado por el usuario (dos partes). Dosis de ca2 y ca3 (cadera). Releída en PDF (2026-10): fiabilidad de la sentadilla monopodal y del step-down (p. CPG20), tests de ca6; excluye el dolor posterior extraarticular (pinzamiento isquiofemoral, atrapamientos) y las tendinopatías.

Citada como:

1. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Griffin 2018, Lancet 391:2225–2235 (ensayo aleatorizado UK FASHIoN, n = 348) · Kemp 2026, Br J Sports Med 60:951–961 (ensayo aleatorizado PhysioFIRST, n = 154, fortalecimiento dirigido frente a estiramientos)
2. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía; serie de Murtha citada en ella) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Kemp 2020, Br J Sports Med 54:1382–1394 (revisión sistemática)
3. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 174. Enseki 2023 (J Orthop Sports Phys Ther 53(7), guía de práctica clínica APTA, p. CPG20)
4. Enseki 2023 (J Orthop Sports Phys Ther 53(7), guía de práctica clínica APTA, p. CPG20). Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 158
5. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía; la precaución está en su descripción de la intervención multimodal)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Pauta de tratamiento | 5 · cita de la pauta | 2 |
| Cadera | ca6 · Disfunción de Control Neuromuscular de Cadera | Test «Test de Sentadilla Monopodal (Single-Leg Squat)» | 4b · cita bajo el test | 3 |
| Cadera | ca6 · Disfunción de Control Neuromuscular de Cadera | Test «Test de Step-Down» | 4b · cita bajo el test | 4 |
| Cadera | ca12 · Ligamento Redondo e Inestabilidad | Pauta de tratamiento | 5 · cita de la pauta | 5 |

### Fairbank 2011

Autores: Fairbank, Hashimoto, Dailey, Patel y Dettori  
Título: *Does patient history and physical examination predict MRI proven cauda equina syndrome?*  
Publicación: Evid Based Spine Care J 2(4):27–33  
DOI: 10.1055/s-0031-1274754  
Última revisión: 2026-10 · Complementada: PubMed (cauda equina, revisiones sistemáticas desde 2012) no encuentra una revisión de precisión diagnóstica posterior. Galliker 2020 (Am J Med, PDF del usuario) aporta el único estudio en urgencias (silla de montar LR+ 3,1, esfínteres LR+ 2,1) y Hennessy 2025 (Eur Spine J, PDF del usuario) revisa 9 guías: RM urgente y radiculopatía bilateral como señal clave. Ambos se añaden a `l6`. Tabrah 2022 (tacto rectal) y Boktor 2023 (residuo posmiccional) no leídos: tratan pruebas que no hace el fisioterapeuta.  
Nota: Texto completo en PMC3506147.

Citada como:

1. Fairbank 2011 — Fairbank, Hashimoto, Dailey, Patel y Dettori, «Does patient history and physical examination predict MRI proven cauda equina syndrome?», Evid Based Spine Care J 2011;2(4):27–33 (texto completo en PMC).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l6` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Fariduddin 2024

Autores: Fariduddin, Haq y Bansal  
Título: *Hypothyroid Myopathy*  
Publicación: StatPearls [Internet], NBK519513 (act. 2024-06-07)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de codo.

Citada como:

1. Fariduddin 2024 — Fariduddin, Haq y Bansal, «Hypothyroid Myopathy», StatPearls [Internet], NCBI Bookshelf, última actualización 7 de junio de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co_e2a` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |

### Farmer y Matto 2026

Autores: Farmer y Matto  
Título: *Lymphadenopathy*  
Publicación: StatPearls [Internet], NBK513250 (act. 2026-09-09)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 9 de septiembre de 2026 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Farmer y Matto 2026 — Farmer y Matto, «Lymphadenopathy», StatPearls [Internet], NCBI Bookshelf, última actualización 9 de septiembre de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_on4` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |

### Feller 2024

Autores: Feller, Chiarotto, Koes, Maselli y Mourad  
Título: *Red flags for potential serious pathologies in people with neck pain: a systematic review of clinical practice guidelines*  
Publicación: Arch Physiother 14:105–115  
DOI: 10.33393/aop.2024.3245  
Última revisión: **sin revisar**  
Nota: Texto completo en PMC11618059 (acceso abierto). Razonamiento del cribado cervical.

Citada como:

1. Feller 2024 — Feller, Chiarotto, Koes, Maselli y Mourad, «Red flags for potential serious pathologies in people with neck pain: a systematic review of clinical practice guidelines», Arch Physiother 2024;14:105–115 (texto completo en PMC), apartados «Red flags» y «Level of evidence».
2. Feller 2024 — Feller, Chiarotto, Koes, Maselli y Mourad, «Red flags for potential serious pathologies in people with neck pain: a systematic review of clinical practice guidelines», Arch Physiother 2024;14:105–115 (texto completo en PMC), apartado «Agreement in red flags recommendations».
3. Feller 2024 — Feller, Chiarotto, Koes, Maselli y Mourad, «Red flags for potential serious pathologies in people with neck pain: a systematic review of clinical practice guidelines», Arch Physiother 2024;14:105–115 (texto completo en PMC), apartado «Implication for practice».
4. Feller 2024 — Feller, Chiarotto, Koes, Maselli y Mourad, «Red flags for potential serious pathologies in people with neck pain: a systematic review of clinical practice guidelines», Arch Physiother 2024;14:105–115 (texto completo en PMC), apartados «Level of evidence» y «Discussion».
5. Feller 2024 — Feller, Chiarotto, Koes, Maselli y Mourad, «Red flags for potential serious pathologies in people with neck pain: a systematic review of clinical practice guidelines», Arch Physiother 2024;14:105–115 (texto completo en PMC), apartados «Red flags» e «Implication for future research».

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv4` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv5` · Cáncer / Oncológico | 2 · razonamiento del cribado | 2 |
| Cervical | — | Pregunta `cv3` · Renal / Urológico | 2 · razonamiento del cribado | 3 |
| Cervical | — | Pregunta `cv_ar3` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 4 |
| Cervical | — | Pregunta `cv_in2` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 5 |

### Finucane 2020

Autores: Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe  
Título: *International Framework for Red Flags for Potential Serious Spinal Pathologies*  
Publicación: IFOMPT, marzo de 2020 (documento completo); artículo en J Orthop Sports Phys Ther 50(7):350–372  
DOI: 10.2519/jospt.2020.9971  
Última revisión: 2026-10 · Sin cambios: PubMed (autor Finucane LM, «red flags») no encuentra una versión posterior del marco IFOMPT.  
Nota: Se leyó el documento completo del marco IFOMPT; las páginas citadas son las suyas, no las del artículo de JOSPT.

Citada como:

1. Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), sección 4 (malignidad), pp. 34–36.
2. Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), tabla 4.2, «Night pain», p. 37.
3. Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), tabla 4.2, «Unexplained weight loss», p. 39.
4. Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), tabla 5.1, «Recent pre-existing infection», p. 46.
5. Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), sección 5 (infección), pp. 43–48.
6. Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), sección 2 (síndrome de cola de caballo), pp. 9–17.
7. Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), sección 3 (fractura vertebral), pp. 24–26.
8. Finucane 2020 — Finucane, Downie, Mercer, Greenhalgh, Boissonnault, Pool-Goudzwaard, Beneciuk, Leech y Selfe, «International Framework for Red Flags for Potential Serious Spinal Pathologies», IFOMPT, marzo de 2020 (documento completo del marco publicado en J Orthop Sports Phys Ther 2020;50(7):350–372), sección 2 (síndrome de cola de caballo), pp. 9–11.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv4` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv1` · Cáncer / Oncológico | 2 · razonamiento del cribado | 2 |
| Cervical | — | Pregunta `cv5` · Cáncer / Oncológico | 2 · razonamiento del cribado | 3 |
| Cervical | — | Pregunta `cv_r2` · Renal / Urológico | 2 · razonamiento del cribado | 4 |
| Cervical | — | Pregunta `cv_in1` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 5 |
| Lumbar | — | Pregunta `l2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_on2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 2 |
| Lumbar | — | Pregunta `l6` · Urogenital / Renal | 2 · razonamiento del cribado | 6 |
| Lumbar | — | Pregunta `l_e4` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 7 |
| Lumbar | — | Pregunta `l_e7` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 8 |

### Flynn 2002

Publicación: —  
DOI: 10.1097/00007632-200212150-00021  
Última revisión: 2026-10 · Sin cambios en las cifras: Haskins 2015 (J Clin Epidemiol, revisión sistemática, PDF del usuario) encuentra 9 validaciones de la regla: ser positivo predice menos discapacidad con manipulación con o sin thrust, pero como modificador del efecto solo la apoya Childs 2004 (Hancock 2008 no), y no hay estudios de impacto. Se añade al criterio de lu1. PubMed (reglas de predicción para manipulación lumbar desde 2012) no encuentra nada posterior.

Citada como:

1. Flynn 2002 (regla pronóstica: probabilidad de éxito con manipulación del 45 % al 95 %) · Childs 2004 (Ann Intern Med, ensayo de validación) · Hancock 2008 (Eur Spine J, validación independiente) · Haskins 2015 (J Clin Epidemiol, revisión sistemática)
2. Fritz 2005 (técnica y fiabilidad, tabla 3) · Flynn 2002 (variable de la regla, tabla 5)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu1 · Disfunción Segmentaria Lumbosacra (Déficit de Movilidad) | Test «Regla de Predicción Clínica de Flynn (4/5 criterios)» | 4b · cita bajo el test | 1 |
| Lumbar | lu1 · Disfunción Segmentaria Lumbosacra (Déficit de Movilidad) | Test «Evaluación de hipomovilidad segmentaria lumbar (PAIVM)» | 4b · cita bajo el test | 2 |

### Frey 2017

Publicación: Clin J Sport Med 27(3):e36 (resumen de congreso)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Citado a través de Netterström-Wedin 2021 (ref. 21). Resumen de congreso sin DOI propio: «Prospective study of ankle injury in high level athlete to detect the lesion of the distal tibio-fibular syndesmosis (DTFS) in the French national sport institute in Paris».

Citada como:

1. Palpación del LTPAI (la más sensible). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: la palpación del LTPAI sola da resultados contradictorios (Frey 2017: S 95 %, E 86 %; Großterlinden 2016: S 43 %, E 52 %; recogidos en Netterström-Wedin 2021). La LR− 0,28 (IC 0,09–0,89) de Sman 2015 es de otra cosa: dolor en cualquiera de cinco estructuras de la sindesmosis (S 92 %, E 29 %).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» (en `criterio`) | 4b · mención en el texto | 1 |

### Fritz 2005

Publicación: Eur Spine J 14:743–750  
DOI: 10.1007/s00586-004-0803-4  
Última revisión: 2026-10 · Sin cambios: PubMed (tests clínicos de inestabilidad lumbar, revisiones sistemáticas). Ferrari 2015 (Chiropr Man Therap, 10.1186/s12998-015-0058-7) confirma que solo Fritz 2005 estudió la precisión del test de inestabilidad en prono; Thomas 2026 (Cureus, 10.7759/cureus.108817, búsqueda hasta 12/2025) sigue citando su regla «flexión ≥ 53° o sin hipomovilidad» (LR+ 4,3) sin replicación externa. Leídas enteras en PMC. Estudios sueltos posteriores (Seyedhoseinpoor 2022, Areeudomwong 2020, Chatprem 2021) no leídos en texto completo.

Citada como:

1. Fritz 2005 (técnica y fiabilidad, tabla 3) · Flynn 2002 (variable de la regla, tabla 5)
2. Fritz 2005 (IC 95 % del LR+: 1,8–10,6)
3. Fritz 2005 (referencia: inestabilidad radiológica)
4. Fritz 2005 (tablas 2 y 3; referencia: inestabilidad radiológica)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu1 · Disfunción Segmentaria Lumbosacra (Déficit de Movilidad) | Test «Evaluación de hipomovilidad segmentaria lumbar (PAIVM)» | 4b · cita bajo el test | 1 |
| Lumbar | lu2 · Inestabilidad Espinal Lumbar (Déficit de Coordinación) | Test «Flexión lumbar ≥ 53° o ausencia de hipomovilidad en la exploración segmentaria» | 4b · cita bajo el test | 2 |
| Lumbar | lu2 · Inestabilidad Espinal Lumbar (Déficit de Coordinación) | Test «Test de inestabilidad en prono» | 4b · cita bajo el test | 3 |
| Lumbar | lu2 · Inestabilidad Espinal Lumbar (Déficit de Coordinación) | Test «Movimientos aberrantes en la flexo-extensión» | 4b · cita bajo el test | 4 |

### Galliker 2020

Autores: Galliker, Scherer, Trippolini, Rasmussen-Barr, LoMartire y Wertli  
Título: *Low Back Pain in the Emergency Department: Prevalence of Serious Spinal Pathologies and Diagnostic Accuracy of Red Flags – A Systematic Review*  
Publicación: Am J Med 133(1):60–72.e14  
DOI: 10.1016/j.amjmed.2019.06.005  
Última revisión: 2026-10 · Sin cambios: PubMed (banderas rojas en lumbalgia en urgencias, revisiones desde 2020) no encuentra ninguna posterior.  
Nota: PDF del usuario (2026-10, manuscrito aceptado), leído entero. Preguntas `l2`, `l_on2` y `l6`.

Citada como:

1. Galliker 2020 — Galliker, Scherer, Trippolini, Rasmussen-Barr, LoMartire y Wertli, «Low Back Pain in the Emergency Department: Prevalence of Serious Spinal Pathologies and Diagnostic Accuracy of Red Flags – A Systematic Review», Am J Med 2020;133(1):60–72.e14, resultados y tabla suplementaria de precisión diagnóstica.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_on2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l6` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Genevay 2017

Publicación: Spine J 17(10):1464–1471  
DOI: 10.1016/j.spinee.2017.05.005  
Última revisión: 2026-10 · Sin cambios: PubMed (RAPIDH, validación o precisión diagnóstica; publicaciones de Genevay) no encuentra ninguna validación externa de los criterios RAPIDH.

Citada como:

1. Genevay 2017

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «Criterios RAPIDH (5 criterios)» | 4b · cita bajo el test | 1 |

### George 2021

Autores: George, Fritz, Silfies, Schneider, Beneciuk, Lentz, Gilliam, Hendren y Norman  
Título: *Interventions for the Management of Acute and Chronic Low Back Pain: Revision 2021*  
Publicación: J Orthop Sports Phys Ther 51(11):CPG1–CPG60  
DOI: 10.2519/jospt.2021.0304  
Última revisión: 2026-10 · Sin cambios: PubMed (guías de práctica clínica de lumbalgia en JOSPT y de la APTA desde 2021) no encuentra una revisión posterior de esta guía.  
Nota: Texto completo en PMC10508241 (manuscrito del autor). En ese texto no se ven las letras de grado: se deducen del verbo con la tabla de la propia guía. Pauta de lu1–lu7 y lu9.

Citada como:

1. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · NICE NG59 (rec. 1.2.1 y 1.2.7; actualizada en julio de 2026)
2. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D)
3. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · NICE NG59 (rec. 1.2.6 y 1.2.7; actualizada en julio de 2026)
4. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · Munakomi 2023, StatPearls, «Spinal Stenosis and Neurogenic Claudication» (tratamiento conservador) · Ammendolia 2022, BMJ Open 12:e057724 (revisión sistemática, actualización de la Cochrane de 2013; GRADE)
5. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · NICE NG59 (rec. 1.2.1, 1.2.6 y 1.2.7; actualizada en julio de 2026)
6. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C) · NICE NG59 (rec. 1.2.7; actualizada en julio de 2026)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu1 · Disfunción Segmentaria Lumbosacra (Déficit de Movilidad) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Lumbar | lu2 · Inestabilidad Espinal Lumbar (Déficit de Coordinación) | Pauta de tratamiento | 5 · cita de la pauta | 2 |
| Lumbar | lu3 · Dolor Radicular Lumbar | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Pauta de tratamiento | 5 · cita de la pauta | 4 |
| Lumbar | lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Pauta de tratamiento | 5 · cita de la pauta | 5 |
| Lumbar | lu6 · Dolor Lumbar Discogénico | Pauta de tratamiento | 5 · cita de la pauta | 6 |
| Lumbar | lu7 · Dolor Lumbar Facetario | Pauta de tratamiento | 5 · cita de la pauta | 6 |
| Lumbar | lu9 · Síndrome de Dolor Miofascial Lumbar | Pauta de tratamiento | 5 · cita de la pauta | 6 |

### Getsoian 2020

Publicación: BMJ Open  
DOI: 10.1136/bmjopen-2019-035245  
Última revisión: **sin revisar**  
Nota: Citado a través de Demont 2022.

Citada como:

1. Demont 2022 (Musculoskelet Sci Pract, metaanálisis, 4 estudios, n = 182; frente a cefalea facetaria cervical baja, migraña, cefaleas concomitantes o asintomáticos; certeza moderada. S IC 95 %: 70–92 %; E IC 95 %: 71–91 %; LR+ IC 2,6–9,5; LR− IC 0,1–0,4; 4 estudios de cohorte prospectivos de Hall y Ogince, 2007–2010; riesgo de sesgo por la selección de pacientes). FRT normal en cervicogénica de C2–C3/C3–C4: Getsoian 2020 (BMJ Open, bloqueos diagnósticos controlados), citado en Demont 2022. Precauciones: Paquin 2022 (Arch Physiother 12:26, artículo de opinión)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce4 · Cefalea Cervicogénica | Test «Test de Flexión-Rotación Cervical (CFRT)» | 4b · cita bajo el test | 1 |

### Gheewala 2023

Autores: Gheewala, Arain y Rosenbaum  
Título: *Tarsal Navicular Fractures*  
Publicación: StatPearls [Internet], NBK542221 (act. 2023-07-10)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie.

Citada como:

1. Gheewala 2023 — Gheewala, Arain y Rosenbaum, «Tarsal Navicular Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | — | Pregunta `tp_o1` · Fractura de Estrés | 2 · razonamiento del cribado | 1 |

### Gill 2025

Autores: Gill, Leslie y Minter  
Título: *Acute Cystitis*  
Publicación: StatPearls [Internet], NBK459322 (act. 2025-11-28)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 28 de noviembre de 2025 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Gill 2025 — Gill, Leslie y Minter, «Acute Cystitis», StatPearls [Internet], NCBI Bookshelf, última actualización 28 de noviembre de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `c3` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_u3a` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Gillen 2026

Autores: Gillen, Shams y Goyal  
Título: *Stable Angina*  
Publicación: StatPearls [Internet], NBK559016 (act. 2026-06-17)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Gillen 2026 — Gillen, Shams y Goyal, «Stable Angina», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de junio de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv2` · Cardiovascular | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_c2` · Cardiovascular | 2 · razonamiento del cribado | 1 |

### Goebel 2018

Autores: Goebel, Barker, Turner-Stokes et al. (Guideline Development Panel)  
Título: *Complex regional pain syndrome in adults: UK guidelines for diagnosis, referral and management in primary and secondary care, 2.ª ed.*  
Publicación: Royal College of Physicians, Londres, 2018 (ISBN 978-1-86016-721-8); revisión prevista en julio de 2023  
DOI: —  
Última revisión: **sin revisar**  
Nota: Guía de consenso de expertos de 28 organizaciones británicas (entre ellas la Chartered Society of Physiotherapy). PDF del usuario (2026-10): leídas la introducción, atención primaria, fisioterapia y terapia ocupacional, práctica quirúrgica (pp. 1–17) y los apéndices 4 y 7. Razonamiento del cribado posquirúrgico (pq_sdrc, pq_nervio). La red del entorno no llega a rcp.ac.uk.

Citada como:

1. Posible lesión de un nervio por la operación o la lesión: que la revise el cirujano con urgencia (Goebel 2018).
2. Goebel 2018 — Goebel, Barker, Turner-Stokes et al., «Complex regional pain syndrome in adults: UK guidelines for diagnosis, referral and management in primary and secondary care», 2.ª ed. (Royal College of Physicians, 2018), pp. 1–3 (introducción y tabla 1), 6–12 (atención primaria y fisioterapia), 13–16 (práctica quirúrgica), 45–46 (apéndice 4) y 51–54 (apéndice 7).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `pq_sdrc` · Posquirúrgico | 2 · razonamiento del cribado | 2 |
| Todas (sistemas comunes) | — | Pregunta `pq_nervio` · Posquirúrgico | 2 · razonamiento del cribado | 2 |
| Hombro | — | `sistemas.0.preguntas.6.urgencia` | 2 · mención en el texto | 1 |
| Cadera | — | `sistemas.0.preguntas.6.urgencia` | 2 · mención en el texto | 1 |
| Cervical | — | `sistemas.0.preguntas.6.urgencia` | 2 · mención en el texto | 1 |
| Lumbar | — | `sistemas.0.preguntas.6.urgencia` | 2 · mención en el texto | 1 |
| Rodilla | — | `sistemas.0.preguntas.6.urgencia` | 2 · mención en el texto | 1 |
| Codo | — | `sistemas.0.preguntas.6.urgencia` | 2 · mención en el texto | 1 |
| Tobillo y pie | — | `sistemas.0.preguntas.6.urgencia` | 2 · mención en el texto | 1 |

### Gomes 2022

Publicación: BMC Musculoskelet Disord 23:885  
DOI: 10.1186/s12891-022-05831-7  
Última revisión: **sin revisar**

Citada como:

1. TOBILLO → radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. PIE → radiografía si dolor en el mediopié Y alguno: dolor óseo en la base del 5.º MT · en el navicular · no carga cuatro pasos. Solo descarta: Bachmann 2003 (27 estudios, 15 581 pacientes) da LR− 0,08 aplicando solo la regla del tobillo o solo la del pie, pero 0,21 (IC 95 % 0,12–0,38) en los estudios que aplican las dos juntas, que es como se usan aquí (se toma la más prudente). El positivo es un hallazgo: en adultos, LR+ 1,47 (IC 1,11–1,93; Gomes 2022).
2. Bachmann 2003 (BMJ 326:417); Gomes 2022 (BMC Musculoskelet Disord 23:885)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Reglas de Ottawa de tobillo y de pie» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Reglas de Ottawa de tobillo y de pie» | 4b · cita bajo el test | 2 |

### Goodfriend 2022

Autores: Goodfriend, Tadi y Koury  
Título: *Carotid Artery Dissection*  
Publicación: StatPearls [Internet], NBK430835 (act. 2022-12-19)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Goodfriend 2022 — Goodfriend, Tadi y Koury, «Carotid Artery Dissection», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de diciembre de 2022.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_ar1` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 1 |

### Goodman 2018

Autores: Goodman, Heick y Lazaro  
Título: *Differential Diagnosis for Physical Therapists: Screening for Referral*  
Publicación: Elsevier, 6.ª edición  
DOI: —  
Última revisión: **sin revisar**  
Nota: El cribado de fase 2 lo cita sin año («Criterio de Goodman (cap. 14)»).

Citada como:

1. Fractura sacra por estrés: mujer deportista con actividad vigorosa y repetitiva, dolor en nalga que reproduce la carrera, dieta pobre, alteraciones menstruales o fracturas de estrés previas. Signo de la nalga; la radiografía inicial suele ser normal: la confirman la gammagrafía o la RM (Goodman 2018, cap. 15)
2. Criterio de Goodman (cap. 14): 2 de 4 → sensibilidad 70%, especificidad 81%; 3 de 4 → especificidad cercana al 100%. No es un diagnóstico.
3. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 119; cap. 13, pp. 464 y 472–475; cap. 18, pp. 685 y 700–705.
4. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 119; cap. 6, p. 234; cap. 8, p. 307; cap. 13, p. 476; cap. 18, pp. 690, 703 y 707.
5. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 9, p. 343; cap. 13, pp. 475–476; cap. 18, pp. 685, 698 y 703.
6. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 92 y 120; cap. 6, pp. 226 y 233–236; cap. 18, pp. 685, 690 y 693–694.
7. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 226 y 233–236; cap. 18, pp. 692–693, 704 y 707–708.
8. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 226–227 y 239; cap. 7, pp. 272–273; cap. 18, pp. 693, 696 y 705–709.
9. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 92–95; cap. 7, pp. 274–275; cap. 18, pp. 689, 692–693, 696, 704–705 y 707–709.
10. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 226–227, 233 y 239; cap. 7, pp. 272–275 y 279; cap. 18, pp. 689, 693 y 704–705.
11. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, p. 227; cap. 7, pp. 272, 274–275, 282 y 285–286; cap. 18, pp. 685, 693, 703 y 707–709.
12. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 10, pp. 361–364; cap. 18, pp. 689, 697–698 y 705.
13. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 92–93; cap. 10, pp. 362–363; cap. 18, pp. 693, 697–699 y 705.
14. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 92–93; cap. 15, p. 591; cap. 18, pp. 689, 692, 703–705 y 708.
15. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 15, pp. 587 y 592–595; cap. 18, pp. 689, 703–705 y 708.
16. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 92; cap. 8, p. 307; cap. 9, pp. 337, 339, 341 y 349–351; cap. 18, pp. 689, 698–699 y 705–709.
17. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 8, p. 306; cap. 9, pp. 337 y 339–343; cap. 18, pp. 699 y 704.
18. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 95; cap. 8, pp. 306 y 315–317; cap. 18, pp. 698 y 705–709.
19. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 18, pp. 688, 704 y 707.
20. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 114–117; cap. 9, p. 341; cap. 18, pp. 699–700, 704 y 707.
21. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 18, pp. 700–703 y 706.
22. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 387, 392 y 423.
23. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 399, 402 y 423.
24. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 395–397 y 423.
25. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 392, 402–403 y 423.
26. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 404, 408–409 y 423.
27. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 213 y 218–221.
28. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 213–215, 220 y 221.
29. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 213, 217–218 y 221.
30. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 213, 219–221; cap. 8, p. 306.
31. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 472 y 487; cap. 16, pp. 611, 616, 629–632 y 641–642.
32. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 475 y 487; cap. 16, pp. 626 y 631–632.
33. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 475 y 487; cap. 16, p. 618.
34. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 472 y 475; cap. 16, pp. 616, 629–630 y 639.
35. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 228 y 254–255; cap. 15, p. 595; cap. 16, pp. 623 y 636–637.
36. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 255–256; cap. 16, pp. 624 y 636.
37. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 228 y 254–255; cap. 16, p. 624.
38. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 10, pp. 361–362, 364 y 367; cap. 16, pp. 621 y 633.
39. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 10, pp. 361, 367–368 y 374–375; cap. 16, pp. 617, 633 y 640.
40. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 16, p. 617.
41. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 15, pp. 587–588 y 591–595; cap. 16, p. 617.
42. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 8, pp. 304 y 311–314; cap. 15, pp. 584 y 600–601; cap. 16, pp. 616 y 633–636.
43. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 8, pp. 306–307; cap. 13, p. 475; cap. 15, pp. 584 y 602–603; cap. 16, pp. 630 y 638.
44. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 8, p. 314; cap. 15, pp. 590 y 603; cap. 16, p. 619.
45. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 15, pp. 583–584; cap. 16, pp. 625–627 y 639–640.
46. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 16, pp. 616 y 637–639.
47. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 12, p. 455; cap. 16, pp. 611, 614, 633 y 639.
48. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 12, pp. 439–440, 447–448 y 455; cap. 15, p. 582; cap. 16, pp. 627 y 636.
49. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 16, pp. 611, 614 y 633.
50. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 463–464 y 475; cap. 14, pp. 529 y 540–542.
51. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, «Night pain», p. 119; cap. 8, p. 307; cap. 13, pp. 476 y 483; cap. 14, pp. 525 y 562.
52. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, p. 475; cap. 14, pp. 523, 527 y 540–542.
53. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 92; cap. 6, pp. 226 y 233–236; cap. 14, pp. 542–543.
54. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 226 y 234–236; cap. 14, pp. 537, 543 y 567.
55. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 92; cap. 7, pp. 272–275; cap. 13, p. 483; cap. 14, pp. 548–550.
56. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 226–227; cap. 7, pp. 272–274; cap. 14, pp. 549–550.
57. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 10, pp. 372–373 y 376; cap. 13, p. 483; cap. 14, pp. 531, 542 y 568.
58. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 10, pp. 372–373; cap. 14, pp. 531, 550 y 562–563.
59. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 90; cap. 8, pp. 304 y 307; cap. 14, pp. 532 y 552–553.
60. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 8, pp. 306–307 y 316; cap. 14, pp. 532 y 553.
61. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 522 y 532.
62. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, p. 227; cap. 14, pp. 530 y 532.
63. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 523–524.
64. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, p. 482; cap. 14, pp. 528–531.
65. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 12, pp. 440 y 448; cap. 14, pp. 522, 531–532.
66. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 522, 531 y 562–563.
67. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 12, pp. 429, 438, 440 y 447–448; cap. 14, pp. 522 y 531.
68. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, «Screening for oncologic causes of back pain», pp. 539–542.
69. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, «Night pain», p. 119; cap. 8, p. 307; cap. 14, pp. 534 y 562–563.
70. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, «Screening for renal and urologic causes of back pain», pp. 550–552.
71. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, «Neurogenic» y tabla «Cauda equina syndrome», pp. 536–537 y 552.
72. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 550–552 y «Screening for male reproductive causes of back pain», pp. 561–562.
73. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, p. 552 y pp. 561–562.
74. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 555–556; cap. 15, cuadro 15.1 (p. 581) y pp. 584–585.
75. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 555 y 557–561.
76. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 8, pp. 306–307; cap. 14, pp. 553–555.
77. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 534–535; cap. 15, pp. 581–583.
78. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 534–535, 542 y 563.
79. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 119; cap. 8, p. 307; cap. 14, pp. 534–535.
80. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, pp. 557–561; cap. 15, «The pelvis», pp. 585 y ss.
81. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, «Spondylogenic», pp. 538–539; cap. 15, pp. 583–584.
82. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, p. 538; cap. 15, cuadro 15.2 y «Paget’s disease», p. 583.
83. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, p. 539; cap. 15, cuadro 15.2 y «Fracture», pp. 583–584.
84. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, tablas 14.5 y 14.6, cuadro 14.4 y pp. 537–538 y 545–548.
85. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, «Abdominal aortic aneurysm», pp. 543–545; cuadro 14.4, p. 538.
86. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 14, «Screening for peripheral vascular causes of back pain», tablas 14.6 y 14.7, pp. 537 y 545–546.
87. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 120; cap. 6, pp. 228 y 254–255; cap. 16, pp. 623 y 636.
88. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 255–257; cap. 16, pp. 622 y 636.
89. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 114–117; cap. 12, pp. 449 y 455; cap. 16, pp. 611 y 641.
90. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 114–117; cap. 12, pp. 448–449 y 455–456; cap. 16, pp. 633 y 636.
91. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 119; cap. 13, pp. 476, 487–488 y 496; cap. 16, pp. 624 y 631–632.
92. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 475, 487 y 495–496; cap. 16, pp. 624, 630 y 639.
93. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 5, pp. 218–221; cap. 16, pp. 612 y 638.
94. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 119; cap. 6, p. 254.
95. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 118; cap. 16, pp. 612, 615, 617 y 622.
96. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 18, p. 704.
97. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, p. 254; cap. 18, p. 704.
98. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, p. 255.
99. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, p. 255; cap. 13, p. 494; cap. 18, pp. 696–697 y 705.
100. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 18, pp. 701 y 706.
101. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 18, pp. 701, 703 y 705–706.
102. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, p. 395; cap. 12, pp. 454–455.
103. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 18, pp. 699–700 y 707.
104. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 13, pp. 475–476; cap. 18, pp. 700–701, 704 y 707.
105. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 387–390, 398 y 404; cap. 18, p. 699.
106. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 11, pp. 387, 390, 392, 395, 398–399, 404 y 422–423; cap. 13, p. 475.
107. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 119–120; cap. 13, pp. 487–488.
108. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 114–117; cap. 12, pp. 449 y 455.
109. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 113–117; cap. 12, pp. 438–441, 449–450 y 455–456.
110. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, pp. 113–114 y 119; cap. 13, pp. 475–476, 487 y 495–496.
111. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 125; cap. 13, pp. 487 y 498.
112. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 3, p. 120; cap. 6, pp. 228, 254–255 y 262.
113. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 6, pp. 255–257.
114. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 12, pp. 453–456.
115. Goodman 2018 — Goodman, Heick y Lazaro, Differential Diagnosis for Physical Therapists: Screening for Referral, 6.ª ed. (Elsevier, 2018), cap. 12, p. 440.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `end_1` · Endocrino / Metabólico | 2 · razonamiento del cribado | 22 |
| Todas (sistemas comunes) | — | Pregunta `end_2` · Endocrino / Metabólico | 2 · razonamiento del cribado | 23 |
| Todas (sistemas comunes) | — | Pregunta `end_3` · Endocrino / Metabólico | 2 · razonamiento del cribado | 24 |
| Todas (sistemas comunes) | — | Pregunta `end_4` · Endocrino / Metabólico | 2 · razonamiento del cribado | 25 |
| Todas (sistemas comunes) | — | Pregunta `end_5` · Endocrino / Metabólico | 2 · razonamiento del cribado | 26 |
| Todas (sistemas comunes) | — | Pregunta `hem_1` · Hematológico | 2 · razonamiento del cribado | 27 |
| Todas (sistemas comunes) | — | Pregunta `hem_2` · Hematológico | 2 · razonamiento del cribado | 28 |
| Todas (sistemas comunes) | — | Pregunta `hem_3` · Hematológico | 2 · razonamiento del cribado | 29 |
| Todas (sistemas comunes) | — | Pregunta `hem_4` · Hematológico | 2 · razonamiento del cribado | 30 |
| Hombro | — | Pregunta `h3` · Cáncer / Oncológico | 2 · razonamiento del cribado | 3 |
| Hombro | — | Pregunta `h4` · Cáncer / Oncológico | 2 · razonamiento del cribado | 4 |
| Hombro | — | Pregunta `h6` · Cáncer / Oncológico | 2 · razonamiento del cribado | 5 |
| Hombro | — | Pregunta `h1` · Cardiovascular | 2 · razonamiento del cribado | 6 |
| Hombro | — | Pregunta `h2` · Cardiovascular | 2 · razonamiento del cribado | 7 |
| Hombro | — | Pregunta `h_c3` · Cardiovascular | 2 · razonamiento del cribado | 8 |
| Hombro | — | Pregunta `h5` · Pulmonar | 2 · razonamiento del cribado | 9 |
| Hombro | — | Pregunta `h_p2` · Pulmonar | 2 · razonamiento del cribado | 10 |
| Hombro | — | Pregunta `h_p3` · Pulmonar | 2 · razonamiento del cribado | 11 |
| Hombro | — | Pregunta `h_r1` · Renal / Urológico | 2 · razonamiento del cribado | 12 |
| Hombro | — | Pregunta `h_r2` · Renal / Urológico | 2 · razonamiento del cribado | 13 |
| Hombro | — | Pregunta `h_g1` · Ginecológico | 2 · razonamiento del cribado | 14 |
| Hombro | — | Pregunta `h_g2` · Ginecológico | 2 · razonamiento del cribado | 15 |
| Hombro | — | Pregunta `h_gi1` · GI / Hepático | 2 · razonamiento del cribado | 16 |
| Hombro | — | Pregunta `h_gi2` · GI / Hepático | 2 · razonamiento del cribado | 17 |
| Hombro | — | Pregunta `h_gi3` · GI / Hepático | 2 · razonamiento del cribado | 18 |
| Hombro | — | Pregunta `h_t1` · Traumático (Fractura o Luxación) | 2 · razonamiento del cribado | 19 |
| Hombro | — | Pregunta `h_i1` · Infección / Sistémico | 2 · razonamiento del cribado | 20 |
| Hombro | — | Pregunta `h_n1` · Neurológico | 2 · razonamiento del cribado | 21 |
| Cadera | — | Pregunta `c5` · Cáncer / Oncológico | 2 · razonamiento del cribado | 31 |
| Cadera | — | Pregunta `ca_on2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 32 |
| Cadera | — | Pregunta `ca_on3` · Cáncer / Oncológico | 2 · razonamiento del cribado | 33 |
| Cadera | — | Pregunta `ca_on4` · Cáncer / Oncológico | 2 · razonamiento del cribado | 34 |
| Cadera | — | Pregunta `c2` · Vascular | 2 · razonamiento del cribado | 35 |
| Cadera | — | Pregunta `ca_v2` · Vascular | 2 · razonamiento del cribado | 36 |
| Cadera | — | Pregunta `ca_v3` · Vascular | 2 · razonamiento del cribado | 37 |
| Cadera | — | Pregunta `c3` · Urogenital / Renal | 2 · razonamiento del cribado | 38 |
| Cadera | — | Pregunta `ca_u2` · Urogenital / Renal | 2 · razonamiento del cribado | 39 |
| Cadera | — | Pregunta `ca_u3` · Urogenital / Renal | 2 · razonamiento del cribado | 40 |
| Cadera | — | Pregunta `ca_u4` · Urogenital / Renal | 2 · razonamiento del cribado | 41 |
| Cadera | — | Pregunta `c4` · Gastrointestinal | 2 · razonamiento del cribado | 42 |
| Cadera | — | Pregunta `ca_gi2` · Gastrointestinal | 2 · razonamiento del cribado | 43 |
| Cadera | — | Pregunta `ca_gi3` · Gastrointestinal | 2 · razonamiento del cribado | 44 |
| Cadera | — | Pregunta `ca_os1` · Óseo / Desarrollo | 2 · razonamiento del cribado | 45 |
| Cadera | — | Pregunta `ca_os2` · Óseo / Desarrollo | 2 · razonamiento del cribado | 46 |
| Cadera | — | Pregunta `ca_os3` · Óseo / Desarrollo | 2 · razonamiento del cribado | 40 |
| Cadera | — | Pregunta `ca_in1` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 47 |
| Cadera | — | Pregunta `ca_in2` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 48 |
| Cadera | — | Pregunta `ca_in3` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 49 |
| Cervical | — | Pregunta `cv4` · Cáncer / Oncológico | 2 · razonamiento del cribado | 50 |
| Cervical | — | Pregunta `cv1` · Cáncer / Oncológico | 2 · razonamiento del cribado | 51 |
| Cervical | — | Pregunta `cv5` · Cáncer / Oncológico | 2 · razonamiento del cribado | 52 |
| Cervical | — | Pregunta `cv2` · Cardiovascular | 2 · razonamiento del cribado | 53 |
| Cervical | — | Pregunta `cv_c2` · Cardiovascular | 2 · razonamiento del cribado | 54 |
| Cervical | — | Pregunta `cv_p1` · Pulmonar | 2 · razonamiento del cribado | 55 |
| Cervical | — | Pregunta `cv_p2` · Pulmonar | 2 · razonamiento del cribado | 56 |
| Cervical | — | Pregunta `cv3` · Renal / Urológico | 2 · razonamiento del cribado | 57 |
| Cervical | — | Pregunta `cv_r2` · Renal / Urológico | 2 · razonamiento del cribado | 58 |
| Cervical | — | Pregunta `cv_gi1` · Gastrointestinal | 2 · razonamiento del cribado | 59 |
| Cervical | — | Pregunta `cv_gi2` · Gastrointestinal | 2 · razonamiento del cribado | 60 |
| Cervical | — | Pregunta `cv_ar1` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 61 |
| Cervical | — | Pregunta `cv_ar2` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 62 |
| Cervical | — | Pregunta `cv_ar3` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 63 |
| Cervical | — | Pregunta `cv_ar4` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 64 |
| Cervical | — | Pregunta `cv_n1` · Médula / Estructural | 2 · razonamiento del cribado | 65 |
| Cervical | — | Pregunta `cv_in1` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 66 |
| Cervical | — | Pregunta `cv_in2` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 67 |
| Lumbar | — | `sistemas.4.banderasRojas.5` | 2 · mención en el texto | 1 |
| Lumbar | — | `sistemas.4.criterioCompuesto.nota` | 2 · criterio compuesto del cribado | 2 |
| Lumbar | — | Pregunta `l2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 68 |
| Lumbar | — | Pregunta `l_on2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 69 |
| Lumbar | — | Pregunta `l4` · Urogenital / Renal | 2 · razonamiento del cribado | 70 |
| Lumbar | — | Pregunta `l6` · Urogenital / Renal | 2 · razonamiento del cribado | 71 |
| Lumbar | — | Pregunta `l_u3a` · Urogenital / Renal | 2 · razonamiento del cribado | 72 |
| Lumbar | — | Pregunta `l_u3b` · Urogenital / Renal | 2 · razonamiento del cribado | 73 |
| Lumbar | — | Pregunta `l1` · Gastrointestinal | 2 · razonamiento del cribado | 74 |
| Lumbar | — | Pregunta `l3` · Gastrointestinal | 2 · razonamiento del cribado | 75 |
| Lumbar | — | Pregunta `l_gi2` · Gastrointestinal | 2 · razonamiento del cribado | 76 |
| Lumbar | — | Pregunta `l5` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 77 |
| Lumbar | — | Pregunta `l5c` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 77 |
| Lumbar | — | Pregunta `l5d` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 78 |
| Lumbar | — | Pregunta `l_e2` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 79 |
| Lumbar | — | Pregunta `l_e3` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 80 |
| Lumbar | — | Pregunta `l_e4` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 81 |
| Lumbar | — | Pregunta `l_e5` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 82 |
| Lumbar | — | Pregunta `l_e6` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 83 |
| Lumbar | — | Pregunta `l_v1` · Vascular | 2 · razonamiento del cribado | 84 |
| Lumbar | — | Pregunta `l_v2` · Vascular | 2 · razonamiento del cribado | 85 |
| Lumbar | — | Pregunta `l_v3` · Vascular | 2 · razonamiento del cribado | 86 |
| Rodilla | — | Pregunta `r_v1` · Vascular | 2 · razonamiento del cribado | 87 |
| Rodilla | — | Pregunta `r_v2` · Vascular | 2 · razonamiento del cribado | 88 |
| Rodilla | — | Pregunta `r1` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 89 |
| Rodilla | — | Pregunta `r_i2` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 90 |
| Rodilla | — | Pregunta `r2` · Oncológico / Hematológico | 2 · razonamiento del cribado | 91 |
| Rodilla | — | Pregunta `r3` · Oncológico / Hematológico | 2 · razonamiento del cribado | 92 |
| Rodilla | — | Pregunta `r4` · Oncológico / Hematológico | 2 · razonamiento del cribado | 93 |
| Rodilla | — | Pregunta `ro_t4` · Traumático / Mecánico | 2 · razonamiento del cribado | 94 |
| Rodilla | — | Pregunta `ro_p1` · Niño o Adolescente | 2 · razonamiento del cribado | 95 |
| Codo | — | Pregunta `co_t1` · Traumático (Fractura o Luxación) | 2 · razonamiento del cribado | 96 |
| Codo | — | Pregunta `co_t2` · Traumático (Fractura o Luxación) | 2 · razonamiento del cribado | 97 |
| Codo | — | Pregunta `co4a` · Vascular / Neurológica | 2 · razonamiento del cribado | 98 |
| Codo | — | Pregunta `co4a_uni` · Vascular / Neurológica | 2 · razonamiento del cribado | 99 |
| Codo | — | Pregunta `co4a_prog` · Vascular / Neurológica | 2 · razonamiento del cribado | 98 |
| Codo | — | Pregunta `co4b` · Vascular / Neurológica | 2 · razonamiento del cribado | 100 |
| Codo | — | Pregunta `co3` · Vascular / Neurológica | 2 · razonamiento del cribado | 101 |
| Codo | — | Pregunta `co_e2b` · Vascular / Neurológica | 2 · razonamiento del cribado | 102 |
| Codo | — | Pregunta `co1` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 103 |
| Codo | — | Pregunta `co2` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 104 |
| Codo | — | Pregunta `co_e1` · Endocrino / Metabólico | 2 · razonamiento del cribado | 105 |
| Codo | — | Pregunta `co_e2a` · Endocrino / Metabólico | 2 · razonamiento del cribado | 106 |
| Tobillo y pie | — | Pregunta `tp_t1` · Traumático / Mecánico | 2 · razonamiento del cribado | 94 |
| Tobillo y pie | — | Pregunta `tp_o1` · Fractura de Estrés | 2 · razonamiento del cribado | 107 |
| Tobillo y pie | — | Pregunta `tp_i1` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 108 |
| Tobillo y pie | — | Pregunta `tp_i2` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 109 |
| Tobillo y pie | — | Pregunta `tp_c1` · Oncológico / Sistémico | 2 · razonamiento del cribado | 110 |
| Tobillo y pie | — | Pregunta `tp_c2` · Oncológico / Sistémico | 2 · razonamiento del cribado | 111 |
| Tobillo y pie | — | Pregunta `tp_v1` · Vascular | 2 · razonamiento del cribado | 112 |
| Tobillo y pie | — | Pregunta `tp_v2` · Vascular | 2 · razonamiento del cribado | 113 |
| Tobillo y pie | — | Pregunta `tp_n1` · Neurológico | 2 · razonamiento del cribado | 114 |
| Tobillo y pie | — | Pregunta `tp_n2` · Neurológico | 2 · razonamiento del cribado | 115 |

### Grant y John 2025

Autores: Grant y John  
Título: *Cholestatic Jaundice*  
Publicación: StatPearls [Internet], NBK482279 (act. 2025-01-19)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 19 de enero de 2025 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Grant y John 2025 — Grant y John, «Cholestatic Jaundice», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_gi2` · GI / Hepático | 2 · razonamiento del cribado | 1 |

### Greenwood 2024

Autores: Greenwood, Arora y Shaikh  
Título: *Osteosarcoma (Osteogenic Sarcoma)*  
Publicación: StatPearls [Internet], NBK563177 (act. 2024-12-11)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 11 de diciembre de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie.

Citada como:

1. Greenwood 2024 — Greenwood, Arora y Shaikh, «Osteosarcoma (Osteogenic Sarcoma)», StatPearls [Internet], NCBI Bookshelf, última actualización 11 de diciembre de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `r2` · Oncológico / Hematológico | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `r3` · Oncológico / Hematológico | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_c1` · Oncológico / Sistémico | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_c2` · Oncológico / Sistémico | 2 · razonamiento del cribado | 1 |

### Griffin 2018

Autores: Griffin, Dickenson, Wall, Achana, Donovan, Griffin, Hobson, Hutchinson, Jepson, Parsons, Petrou, Realpe, Smith y Foster (FASHIoN Study Group)  
Título: *Hip arthroscopy versus best conservative care for the treatment of femoroacetabular impingement syndrome (UK FASHIoN): a multicentre randomised controlled trial*  
Publicación: Lancet 391(10136):2225–2235  
DOI: 10.1016/s0140-6736(18)31202-9  
Última revisión: 2026-10 · Sin cambios: sigue siendo el ensayo de artroscopia frente a fisioterapia de la pauta de ca2; PubMed (SIFA y fisioterapia desde 2022) solo añade el ensayo PhysioFIRST (Kemp 2026), que compara dos programas de fisioterapia.  
Nota: Texto completo en PMC5988794 (leído en Europe PMC). Dosis de ca2 (cadera).

Citada como:

1. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Griffin 2018, Lancet 391:2225–2235 (ensayo aleatorizado UK FASHIoN, n = 348) · Kemp 2026, Br J Sports Med 60:951–961 (ensayo aleatorizado PhysioFIRST, n = 154, fortalecimiento dirigido frente a estiramientos)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Grimaldi 2017

Publicación: Br J Sports Med 51(6):519–24  
DOI: 10.1136/bjsports-2016-096175  
Última revisión: 2026-10 · Cifras comprobadas en la tabla 2 de Kinsella 2024. La palpación y la abducción resistida pasan a las cifras agrupadas de Kinsella 2024; Grimaldi queda como dato del estudio de mayor calidad (y como fuente de la derotación, que pasa a hallazgo).

Citada como:

1. Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3: 2 estudios, certeza baja; LR+ IC 95 %: 1,37–4,30; LR− IC 0,15–0,43). Solo Grimaldi 2017 (BJSM; n = 65, referencia: RM): S 80 %, E 47 %
2. Grimaldi 2017 (BJSM; n = 65 con dolor lateral de cadera, referencia: RM). Agrupado: Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3: 2 estudios, certeza muy baja)
3. Supino, cadera a 90° en RE; el paciente vuelve a neutro contra resistencia. Positivo: reproduce su dolor. Si es negativo, repetir en prono con la cadera en extensión. No puntúa: en pacientes con dolor lateral de cadera, S 44 %, E 93 %, LR+ 6,6 con IC 0,97–45 (Grimaldi 2017). Las cifras altas (S 88 %, E 97 %) son de un estudio con controles sin dolor de cadera (Lequesne 2008), que también sostiene el valor agrupado (LR+ 16,5, IC 2,95–92,7; certeza muy baja).
4. Grimaldi 2017 (BJSM; n = 65 con dolor lateral de cadera, referencia: RM; versión con aducción añadida), según Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3, tabla 2). Lequesne 2008 (Arthritis Rheum; n = 17 con SDTM refractario de 13 meses de media, frente a 38 caderas sin dolor; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Palpación del trocánter mayor / tendón glúteo» | 4b · cita bajo el test | 1 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Apoyo Monopodal <30 segundos (Single-Leg Stance)» | 4b · cita bajo el test | 2 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Derotación externa resistida» (en `criterio`) | 4b · mención en el texto | 3 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Derotación externa resistida» | 4b · cita bajo el test | 4 |

### Grimaldi 2026

Autores: Grimaldi, Ganderton y Nasser  
Título: *Ischiofemoral impingement: Clinical perspectives for enhancing diagnosis, and rehabilitation*  
Publicación: Musculoskelet Sci Pract 84:103592  
DOI: 10.1016/j.msksp.2026.103592  
Última revisión: 2026-10 · Sin cambios: es de 2026 y PubMed no encuentra nada posterior sobre pinzamiento isquiofemoral o dolor glúteo bajo.  
Nota: Masterclass (revisión narrativa y experiencia de los autores), acceso abierto; PDF aportado por el usuario, con la fe de erratas de la fig. 3 (doi 10.1016/j.msksp.2026.103617: las imágenes a y b del test de pinzamiento isquiofemoral están invertidas). DOI verificado en Europe PMC (PMID 42242024). Cifras del test de zancada larga (fig. 3), tomadas de un estudio retrospectivo de 30 pacientes; diagnóstico diferencial del dolor glúteo bajo (tabla 1). Tests de ca5, ca8 y ca9 (cadera).

Citada como:

1. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 157–158. Grimaldi 2026 (Musculoskelet Sci Pract 84:103592, revisión narrativa, apartado 2.2.1)
2. Carro 2016 (Muscles Ligaments Tendons J 6(3):384–396, revisión narrativa). Grimaldi 2026 (Musculoskelet Sci Pract 84:103592, revisión narrativa, apartado 2.1.3)
3. Grimaldi 2026 (Musculoskelet Sci Pract 84:103592, revisión narrativa, fig. 3)
4. Grimaldi 2026 (Musculoskelet Sci Pract 84:103592, revisión narrativa, apartado 2.1.2 y tabla 1)
5. Grimaldi 2026 (Musculoskelet Sci Pract 84:103592, revisión narrativa, tabla 1). Rich 2025 (Am J Sports Med 53:3396–3407, apéndice, tabla A1: criterios de inclusión)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca5 · Debilidad de Abductores de Cadera | Test «Test de Trendelenburg» | 4b · cita bajo el test | 1 |
| Cadera | ca7 · Síndrome Glúteo Profundo (Síndrome Piriforme) | Test «Dolor con sedestación prolongada (>20 min)» | 4b · cita bajo el test | 2 |
| Cadera | ca8 · Pinzamiento Isquiofemoral | Test «Test de marcha con zancada larga (Long-Stride Walking Test)» | 4b · cita bajo el test | 3 |
| Cadera | ca9 · Tendinopatía Proximal de Isquiotibiales | Test «Sensibilidad a la palpación sobre tuberosidad isquiática» | 4b · cita bajo el test | 4 |
| Cadera | ca9 · Tendinopatía Proximal de Isquiotibiales | Test «Dolor con test de fuerza de isquiotibiales» | 4b · cita bajo el test | 5 |

### Großterlinden 2016

Publicación: —  
DOI: 10.1007/s00167-015-3604-x  
Última revisión: **sin revisar**  
Nota: Citado a través de Netterström-Wedin 2021.

Citada como:

1. Palpación del LTPAI (la más sensible). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: la palpación del LTPAI sola da resultados contradictorios (Frey 2017: S 95 %, E 86 %; Großterlinden 2016: S 43 %, E 52 %; recogidos en Netterström-Wedin 2021). La LR− 0,28 (IC 0,09–0,89) de Sman 2015 es de otra cosa: dolor en cualquiera de cinco estructuras de la sindesmosis (S 92 %, E 29 %).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» (en `criterio`) | 4b · mención en el texto | 1 |

### Guthmiller 2025

Autores: Guthmiller, Dua, Dey y Varacallo  
Título: *Complex Regional Pain Syndrome*  
Publicación: StatPearls [Internet], NBK430719 (act. 2025-05-04)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie. Releído entero en la sesión del cribado posquirúrgico (2026-10), PDF del usuario: razonamiento de pq_sdrc y pq_nervio.

Citada como:

1. Guthmiller 2025 — Guthmiller, Dua, Dey y Varacallo, «Complex Regional Pain Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de mayo de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `pq_sdrc` · Posquirúrgico | 2 · razonamiento del cribado | 1 |
| Todas (sistemas comunes) | — | Pregunta `pq_nervio` · Posquirúrgico | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_n3` · Neurológico | 2 · razonamiento del cribado | 1 |

### Hall 2024

Autores: Hall, Graeber y Cecava  
Título: *Vertebral Osteomyelitis*  
Publicación: StatPearls [Internet], NBK532256 (act. 2024-11-25)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Hall 2024 — Hall, Graeber y Cecava, «Vertebral Osteomyelitis», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de noviembre de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_in1` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |

### Hall 2025

Autores: Hall, Munakomi y Mesfin  
Título: *Spinal Epidural Abscess*  
Publicación: StatPearls [Internet], NBK441890 (act. 2025-11-08)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Hall 2025 — Hall, Munakomi y Mesfin, «Spinal Epidural Abscess», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de noviembre de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_r2` · Renal / Urológico | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_in1` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |

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

Publicación: eClinicalMedicine 59:101960  
DOI: 10.1016/j.eclinm.2023.101960  
Última revisión: 2026-10 · Sin cambios: PubMed (precisión diagnóstica de la exploración clínica para origen discal, facetario o sacroilíaco, revisiones sistemáticas desde 2023) no encuentra ninguna revisión posterior de tests clínicos; Manchikanti 2026 (Pain Physician) trata de bloqueos facetarios, no de exploración. Tabla 1 releída en PMC en la sesión de cadera (2026-10): agrupa con Meta-DiSc 1.4, efectos aleatorios, sin decir si es univariante o bivariante; ≥3 tests positivos, 6 estudios, 276 pacientes, LR+ 2,44, LR− 0,31; thigh thrust 5 estudios, LR+ 1,13, LR− 0,91; compresión 2 estudios, LR+ 1,79, LR− 0,74. En ca10 da las cifras agrupadas de los tests sueltos; el cluster de ca10 y de lu8 usa Saueressig 2021 (bivariante), y Han 2023 queda como segunda cifra.

Citada como:

1. Laslett 2005 (Man Ther 10:207–218, tabla 2; referencia: bloqueo anestésico intraarticular). Agrupado: Han 2023 (eClinicalMedicine 59:101960, revisión sistemática, tabla 1)
2. Distracción, compresión, thigh thrust, Gaenslen y sacral thrust; positivo si 3 o más reproducen su dolor. LR+ 2,13 (IC 95 % 1,2–3,9), LR− 0,33 (IC 0,11–0,72), certeza muy baja (GRADE): positivo orienta poco; negativo descarta mejor. Si los síntomas no se centralizan con movimientos repetidos, la especificidad sube (del 78 % al 87 % en el estudio de los creadores): los positivos con centralización (dolor discal) son falsos positivos. Lluch cita S 85–94 %, E 79 %; la cifra de la revisión de Laslett de 2008 (S 91 %, E 78 %; LR+ 4,16, LR− 0,12) es de un solo estudio (Laslett 2003, 48 pacientes, doble bloqueo), y el de 2005, con 6 tests, daba S 94 %, E 78 %. Otra revisión, sin aclarar el modelo y con dos publicaciones de la misma población, da LR+ 2,44 y LR− 0,31 (Han 2023). Regla alternativa del estudio de 2005, sin Gaenslen: 2 o más positivos de 4 (distracción, thigh thrust, compresión y sacral thrust) dan S 88 %, E 78 %, LR+ 4,0 (IC 2,13–8,08), LR− 0,16 (IC 0,04–0,47); orden propuesto: thigh thrust y distracción primero, y si los dos son positivos no hace falta seguir; con uno positivo, compresión y, si es negativa, sacral thrust. En ese estudio, con todos los tests negativos se descartaba la sacroilíaca.
3. Saueressig 2021 (J Orthop Sports Phys Ther 51:422–431; metaanálisis bivariante, 5 estudios de 34 a 60 pacientes con dolor lumbar crónico y sospecha de dolor sacroilíaco; referencia: bloqueo anestésico intraarticular; incluye el estudio de los creadores, Laslett 2003). Laslett 2008 (J Man Manip Ther 16:142–152); Laslett 2005 (Man Ther 10:207–218, tablas 4–6 y fig. 7); Han 2023 (eClinicalMedicine 59:101960, tabla 1: 6 estudios); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153
4. Laslett 2005 (Man Ther 10:207–218, tabla 2; referencia: bloqueo anestésico intraarticular). Agrupado: Han 2023 (eClinicalMedicine 59:101960, revisión sistemática, tabla 1); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 153–154
5. Han 2023 (eClinicalMedicine, revisión sistemática, 4 estudios; LR+ IC 95 %: 1,44–6,50; referencia: discografía). Antes: Hancock 2007, LR+ 2,8
6. Laslett 2006 (no replica a Revel; referencia: doble bloqueo); Han 2023 (eClinicalMedicine, revisión sistemática: Revel inconsistente, no agrupable)
7. Han 2023 (eClinicalMedicine, revisión sistemática, 2 estudios; LR+ IC 95 %: 1,89–3,07)
8. Saueressig 2021 (J Orthop Sports Phys Ther 51:422–431; metaanálisis bivariante, 5 estudios; LR+ IC 95 %: 1,2–3,9, LR− 0,11–0,72; referencia: bloqueo anestésico intraarticular; incluye el estudio de los creadores, Laslett 2003): certeza muy baja (GRADE); descarta mejor de lo que confirma. Misma regla que la tarjeta lumbar: 3 de 5 positivos. Han 2023 (eClinicalMedicine, revisión sistemática, 6 estudios, sin aclarar el modelo y con dos publicaciones de la misma población): LR+ 2,44, LR− 0,31

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Test de Compresión Pélvica» | 4b · cita bajo el test | 1 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Cluster de Laslett: 3 o más de 5 tests de provocación positivos» (en `criterio`) | 4b · mención en el texto | 2 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Cluster de Laslett: 3 o más de 5 tests de provocación positivos» | 4b · cita bajo el test | 3 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Thigh thrust» | 4b · cita bajo el test | 4 |
| Lumbar | lu6 · Dolor Lumbar Discogénico | Test «Centralización con movimientos repetidos» | 4b · cita bajo el test | 5 |
| Lumbar | lu7 · Dolor Lumbar Facetario | Test «Dolor en extensión, inclinación o rotación hacia el lado del dolor» | 4b · cita bajo el test | 6 |
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Test «Ausencia de dolor lumbar en la línea media» | 4b · cita bajo el test | 7 |
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Cluster «Tests de provocación SI (3 de 5)» | 4b · cita del cluster | 8 |

### Hancock 2007

Publicación: —  
DOI: 10.1007/s00586-007-0391-1  
Última revisión: 2026-10 · Sin cambios: ya superada por Han 2023, que es la que da las cifras; solo se menciona como dato anterior.  
Nota: Cifra anterior, sustituida por Han 2023 (se menciona en la cita).

Citada como:

1. Han 2023 (eClinicalMedicine, revisión sistemática, 4 estudios; LR+ IC 95 %: 1,44–6,50; referencia: discografía). Antes: Hancock 2007, LR+ 2,8

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu6 · Dolor Lumbar Discogénico | Test «Centralización con movimientos repetidos» | 4b · cita bajo el test | 1 |

### Hancock 2008

Autores: Hancock, Maher, Latimer, Herbert y McAuley  
Título: *Independent evaluation of a clinical prediction rule for spinal manipulative therapy: a randomised controlled trial*  
Publicación: Eur Spine J 17(7):936–943  
DOI: 10.1007/s00586-008-0679-9  
Última revisión: 2026-10 · Sin cambios: Haskins 2015 (J Clin Epidemiol, revisión sistemática, PDF del usuario) encuentra 9 validaciones de la regla: ser positivo predice menos discapacidad con manipulación con o sin thrust, pero como modificador del efecto solo la apoya Childs 2004 (Hancock 2008 no), y no hay estudios de impacto. Se añade al criterio de lu1. PubMed (reglas de predicción para manipulación lumbar desde 2012) no encuentra nada posterior.  
Nota: PDF del usuario (2026-10). Validación independiente de la regla de Flynn (lu1).

Citada como:

1. Flynn 2002 (regla pronóstica: probabilidad de éxito con manipulación del 45 % al 95 %) · Childs 2004 (Ann Intern Med, ensayo de validación) · Hancock 2008 (Eur Spine J, validación independiente) · Haskins 2015 (J Clin Epidemiol, revisión sistemática)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu1 · Disfunción Segmentaria Lumbosacra (Déficit de Movilidad) | Test «Regla de Predicción Clínica de Flynn (4/5 criterios)» | 4b · cita bajo el test | 1 |

### Hantzidiamantis 2024

Autores: Hantzidiamantis, Awosika y Lappin  
Título: *Physiology, Glucose*  
Publicación: StatPearls [Internet], NBK545201 (2024)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF en modo lectura aportado por el usuario, sin fecha visible: el año sale del índice de Europe PMC.

Citada como:

1. Hantzidiamantis 2024 — Hantzidiamantis, Awosika y Lappin, «Physiology, Glucose», StatPearls [Internet], NCBI Bookshelf (2024).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `end_2` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |
| Todas (sistemas comunes) | — | Pregunta `end_5` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |

### Haskins 2015

Autores: Haskins, Osmotherly y Rivett  
Título: *Validation and impact analysis of prognostic clinical prediction rules for low back pain is needed: a systematic review*  
Publicación: J Clin Epidemiol 68(7):821–832  
DOI: 10.1016/j.jclinepi.2015.02.003  
Última revisión: 2026-10 · Sin cambios: PubMed (reglas de predicción clínica para manipulación lumbar, desde 2012) no encuentra revisiones posteriores.  
Nota: PDF del usuario (2026-10), leído entero. Regla de Flynn de lu1.

Citada como:

1. Flynn 2002 (regla pronóstica: probabilidad de éxito con manipulación del 45 % al 95 %) · Childs 2004 (Ann Intern Med, ensayo de validación) · Hancock 2008 (Eur Spine J, validación independiente) · Haskins 2015 (J Clin Epidemiol, revisión sistemática)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu1 · Disfunción Segmentaria Lumbosacra (Déficit de Movilidad) | Test «Regla de Predicción Clínica de Flynn (4/5 criterios)» | 4b · cita bajo el test | 1 |

### Hegedus 2012

Publicación: Br J Sports Med 46:964–978  
DOI: 10.1136/bjsports-2012-091066  
Última revisión: 2026-10 · Sin cambios: PDF del usuario leído entero (2026-10). Las cifras de h2, h4 y h5 coinciden con su tabla 3. Pinzamiento con modelo HSROC/bivariante; aprehensión, recolocación y sorpresa con DerSimonian-Laird univariante (la aprehensión agrupa 2 estudios, n = 409, que por tamaño son Farber 2006 y Lo 2004, dos poblaciones distintas). El metaanálisis posterior de Zhao 2024 (bivariante, más estudios) da LR más bajas para el pinzamiento, pero tiene errores de extracción (la tabla 2×2 del arco doloroso de Park 2005 suma 718 pacientes de 552): se mantiene Hegedus y Zhao va como segunda cifra. Gismervik 2017 (efectos fijos, 2 estudios por test) y Hanchard 2013 (Cochrane, sin agrupar) no aportan nada mejor.

Citada como:

1. Hegedus 2012 (Br J Sports Med 46:964–978; metaanálisis HSROC/bivariante, tabla 3) · Zhao 2024 (BMC Musculoskelet Disord 25:1028, tabla 3 y fig. 3)
2. Hegedus 2012 (Br J Sports Med 46:964–978; metaanálisis HSROC/bivariante, tabla 3) · Zhao 2024 (BMC Musculoskelet Disord 25:1028, tabla 3)
3. Contracción isométrica de rotación externa contra resistencia, codo a 90°. Positivo si reproduce dolor. LR+ 2,6 (IC 95 % 1,8–3,6), LR− 0,49 (0,33–0,72) para patología del manguito, un solo estudio (203 pacientes, ecografía); con el arco doloroso, el hallazgo más útil según la revisión. Para el pinzamiento con artroscopia como referencia, un estudio de bajo riesgo de sesgo recogido por Hegedus 2012 da LR+ 4,39 y LR− 0,50.
4. Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 3, patología del manguito) · Hegedus 2012 (Br J Sports Med 46:964–978, tabla 1)
5. Imposibilidad de mantener la rotación externa pasivamente colocada. Para rotura completa: LR+ 7,2 (IC 95 % 1,7–31), LR− 0,57 (0,35–0,92), un solo estudio (37 pacientes, ecografía); un negativo no descarta. En otro estudio de bajo riesgo de sesgo recogido por Hegedus 2012 da LR+ 28 para la rotura completa del supraespinoso. Si el nervio supraescapular está paralizado, los test del supraespinoso y del infraespinoso salen positivos con el manguito intacto; distinguirlo exige más que la clínica y la atrofia (Lluch 2020, cap. 3.1, pp. 66–67).
6. Hegedus 2012 (Br J Sports Med 46:964–978; metaanálisis DerSimonian-Laird, tabla 3)
7. Hegedus 2012 (Br J Sports Med; metaanálisis, tabla 3)
8. En supino, brazo elevado a 120° y en rotación externa máxima, codo a 90° y antebrazo en supinación; el paciente flexiona el codo contra resistencia. Positivo si esa flexión resistida provoca dolor. La LR+ alta es del estudio de sus creadores (S 89,7 %, E 96,9 %, n = 127, 15–52 años, excluidos luxación y hombro rígido); en los dos estudios independientes recogidos por Hegedus 2012, S 30–55 % y E 53–78 %, y la revisión concluye que hay «menos optimismo». Cuenta como hallazgo: la LR+ 26 solo se sostiene en el estudio de sus creadores.
9. Kim 2001 (Arthroscopy 17:160–164) · Hegedus 2012 (Br J Sports Med 46:964–978, tabla 2)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Arco doloroso» | 4b · cita bajo el test | 1 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Hawkins-Kennedy» | 4b · cita bajo el test | 2 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Neer» | 4b · cita bajo el test | 2 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Resistencia a Rotación Externa» (en `criterio`) | 4b · mención en el texto | 3 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Resistencia a Rotación Externa» | 4b · cita bajo el test | 4 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «External Rotation Lag Sign» (en `criterio`) | 4b · mención en el texto | 5 |
| Hombro | h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Test de Aprehensión» | 4b · cita bajo el test | 6 |
| Hombro | h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Test de Recolocación (Jobe)» | 4b · cita bajo el test | 7 |
| Hombro | h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Test de Liberación/Release/Surprise» | 4b · cita bajo el test | 7 |
| Hombro | h5 · Lesión Labral Superior (SLAP) | Test «Test de O'Brien (Active Compression)» | 4b · cita bajo el test | 7 |
| Hombro | h5 · Lesión Labral Superior (SLAP) | Test «Biceps Load Test II» (en `criterio`) | 4b · mención en el texto | 8 |
| Hombro | h5 · Lesión Labral Superior (SLAP) | Test «Biceps Load Test II» | 4b · cita bajo el test | 9 |

### Hennessy 2025

Autores: Hennessy, Devitt, Synnott y Timlin  
Título: *Assessment and early investigation of cauda equina syndrome- a systematic review of existing international guidelines and summary of the current evidence*  
Publicación: Eur Spine J 34(4):1545–1551  
DOI: 10.1007/s00586-025-08732-0  
Última revisión: 2026-10 · Sin cambios: publicada en 2025, búsqueda hasta junio de 2024; PubMed no encuentra una revisión de guías posterior.  
Nota: PDF del usuario (2026-10), leído entero. Pregunta `l6`.

Citada como:

1. Hennessy 2025 — Hennessy, Devitt, Synnott y Timlin, «Assessment and early investigation of cauda equina syndrome – a systematic review of existing international guidelines and summary of the current evidence», Eur Spine J 2025;34(4):1545–1551, tabla 1 y discusión.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l6` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Henschke 2013

Autores: Henschke, Maher, Ostelo, de Vet, Macaskill e Irwig  
Título: *Red flags to screen for malignancy in patients with low-back pain*  
Publicación: Cochrane Database Syst Rev (2):CD008686  
DOI: 10.1002/14651858.CD008686.pub2  
Última revisión: 2026-10 · Complementada: Verhagen 2017 (Pain, PDF del usuario) apoya sus conclusiones con una búsqueda más amplia; el dolor nocturno solo se midió en un estudio (LR+ 0,7). Galliker 2020 (Am J Med, PDF del usuario) aporta el dato de urgencias (LR+ 2,2). Ambos se añaden a `l_on2`.  
Nota: Leído el resumen y las conclusiones de los autores (PMC10631455); las cifras de esta revisión se citan a través de Downie 2013.

Citada como:

1. Henschke 2013 — Henschke, Maher, Ostelo et al., «Red flags to screen for malignancy in patients with low-back pain», Cochrane Database Syst Rev 2013;(2):CD008686 (resumen y conclusiones de los autores).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `c5` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_on2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |

### Hermans 2013

Publicación: JAMA 310:837–847  
DOI: 10.1001/jama.2013.276187  
Última revisión: 2026-10 · Sin cambios: PDF del usuario leído entero (2026-10). Las cifras de h2 y h3 coinciden con su tabla 3 (la tabla 2, citada antes, solo describe los test). Los signos de retraso salen de un solo estudio (Miller 2008, 37 pacientes, 46 hombros, ecografía); la RE resistida de otro (Salaffi 2010, 203, ecografía); el empty can, de 3 estudios con modelo univariante de efectos aleatorios. Clasifica Park 2005 y Litaker 2000 como nivel IV. El agrupado posterior de Zhao 2024 mezcla roturas del subescapular y del supraespinoso en el signo de retraso en RI.

Citada como:

1. Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 3, patología del manguito) · Hegedus 2012 (Br J Sports Med 46:964–978, tabla 1)
2. Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 3, univariante de efectos aleatorios)
3. Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 3, patología del manguito)
4. Hermans 2013 (JAMA 310:837–847, revisión sistemática; tabla 3, rotura completa)
5. Rotura COMPLETA si los tres son positivos: 50 de 153 roturas completas frente a 4 de 195 controles (348 operados con los tres test hechos) → LR+ 15,57 (con dos de tres, LR+ 3,57). La combinación sale de una regresión logística en la misma muestra, sin grupo de validación (en Litaker, la LR bajó de 9,84 a 5,0 al validarla), y Hermans 2013 clasifica el estudio como de nivel IV. Arco doloroso: dolor o enganche entre 60° y 120° de elevación activa en el plano de la escápula, al subir o al bajar. Drop arm: al bajar el brazo desde la elevación completa, cae de golpe o duele mucho. Debilidad en RE (infraespinoso): codo a 90° junto al cuerpo, rotación neutra; positivo si cede por debilidad o dolor, o si hay signo de retraso en RE. Población quirúrgica (controles: otras cirugías de hombro, incluida la bursitis y la rotura parcial). Si puntúa, el drop arm, el signo de retraso en RE y el cluster B no suman aparte.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Resistencia a Rotación Externa» | 4b · cita bajo el test | 1 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Test de Lata Vacía (Empty Can)» | 4b · cita bajo el test | 2 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Test de Lata Llena (Full Can)» | 4b · cita bajo el test | 3 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «External Rotation Lag Sign» | 4b · cita bajo el test | 4 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Internal Rotation Lag Sign» | 4b · cita bajo el test | 4 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Drop Arm Test» | 4b · cita bajo el test | 3 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Cluster A, confirmar: arco doloroso + drop arm + debilidad en RE, los tres positivos» (en `criterio`) | 4b · mención en el texto | 5 |

### Hermena y Slane 2025

Autores: Hermena y Slane  
Título: *Ankle Fracture*  
Publicación: StatPearls [Internet], NBK542324 (act. 2025-02-15)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie.

Citada como:

1. Hermena y Slane 2025 (StatPearls, «Ankle Fracture»); Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 255
2. Hermena y Slane 2025 (StatPearls, «Ankle Fracture»)
3. Hermena y Slane 2025 (StatPearls, «Ankle Fracture»); NICE NG19, rec. 1.7.1
4. Hermena y Slane 2025 — Hermena y Slane, «Ankle Fracture», StatPearls [Internet], NCBI Bookshelf, última actualización 15 de febrero de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp37 · Fractura de Tobillo (Maleolar) | Test «No carga cuatro pasos» | 4b · cita bajo el test | 1 |
| Tobillo y pie | tp37 · Fractura de Tobillo (Maleolar) | Test «Estado neurovascular» | 4b · cita bajo el test | 2 |
| Tobillo y pie | tp37 · Fractura de Tobillo (Maleolar) | Pronóstico | 5 · cita del pronóstico | 3 |
| Tobillo y pie | — | Pregunta `tp_t2` · Traumático / Mecánico | 2 · razonamiento del cribado | 4 |
| Tobillo y pie | — | Pregunta `tp_v2` · Vascular | 2 · razonamiento del cribado | 4 |

### HerniaSurge 2018

Autores: HerniaSurge Group  
Título: *International guidelines for groin hernia management*  
Publicación: Hernia 22(1):1–165  
DOI: 10.1007/s10029-017-1668-x  
Última revisión: 2026-10 · Sin cambios: su actualización (Stabilini 2023, BJS Open 7(5):zrad080, PMC10588975, leída en 2026-10) revisa técnicas de reparación, malla y hernia oculta contralateral, no el diagnóstico ni la epidemiología. Cifras del razonamiento de ca_gi3 comprobadas en PMC: exploración S 0,745, E 0,963 (cap. 3, un estudio de cohortes); hernia inguinal 9–12 veces más en hombres y femoral unas 4 veces más en mujeres (cap. 16; la reparación, 8–10 veces más en hombres, cap. 2); factores de riesgo del resumen.  
Nota: Texto completo en PMC5809582 (Europe PMC). Razonamiento del cribado de cadera (ca_gi3): exploración clínica de la ingle como prueba de referencia, epidemiología y factores de riesgo. Hay una actualización (Stabilini 2023, BJS Open, PMC10588975) que no cambia esos puntos.

Citada como:

1. HerniaSurge 2018 — HerniaSurge Group, «International guidelines for groin hernia management», Hernia 2018;22(1):1–165 (texto completo en PMC).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_gi3` · Gastrointestinal | 2 · razonamiento del cribado | 1 |

### Hesmerg 2024

Autores: Hesmerg, Oostenbroek y van der List  
Título: *Lever sign test shows high diagnostic accuracy for anterior cruciate ligament injuries: A systematic review and meta-analysis of 3299 observations*  
Publicación: Knee 47:81–91  
DOI: 10.1016/j.knee.2024.01.003  
Última revisión: 2026-10 · Sin cambios: es la revisión más reciente y amplia del Lever; concuerda con Sokal 2022, que sigue dando las cifras de ro4 por el método.  
Nota: PDF del usuario leído entero (2026-10). 23 estudios; sin anestesia y sin el estudio del creador: S 79,2 % (68,7–86,9), E 92,0 % (82,2–96,6), LR+ 9,9, LR− 0,22. S y E agrupadas con modelo univariante (el bivariante solo para la curva SROC). Citada en el criterio del Lever de ro4.

Citada como:

1. Puño debajo de la rodilla — si el LCA está roto, el talón no se eleva. S IC 95 %: 68–92 %; E IC 83–95 %; LR+ IC 5,01–17,30; LR− IC 0,09–0,34. El que mejor descarta de los cuatro; en lesiones de menos de 3 semanas fue el más exacto. Concordante, Hesmerg 2024 (Knee 47:81–91; 23 estudios sin anestesia, sin el de su creador): S 79 %, E 92 %, LR+ 9,9, LR− 0,22. Hu 2024 (J Orthop Surg Res 19:155; 12 estudios, con el del creador) da E 78 % y LR+ 3,1.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test «Lever Sign Test» (en `criterio`) | 4b · mención en el texto | 1 |

### Hölmich 1999

Publicación: Lancet 353(9151):439–43  
DOI: 10.1016/S0140-6736(98)03340-6  
Última revisión: 2026-10 · Texto completo leído: la pauta de ca16 coincide con el panel 1 y los métodos. Corregido el trote (pasadas las 6 primeras semanas) y añadida la población (varones de 18 a 50 años). No se encontró un ensayo posterior que lo sustituya.

Citada como:

1. Hölmich 1999, Lancet 353:439–443 (ensayo aleatorizado, n = 68 varones de 18 a 50 años, frente a fisioterapia pasiva)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca16 · Dolor Inguinal Relacionado con el Aductor | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Hu 2024

Autores: Hu, Wang, Wang y Feng  
Título: *Lever sign test for anterior cruciate ligament injuries: a diagnostic meta-analysis*  
Publicación: J Orthop Surg Res 19(1):155  
DOI: 10.1186/s13018-024-04635-w  
Última revisión: 2026-10 · Sin cambios: discrepa de Sokal 2022 y de Hesmerg 2024 en la especificidad; incluye el estudio del creador del test y atribuye a Hegedus unas cifras del Lever que no son suyas. Solo se cita en el criterio.  
Nota: Texto completo leído en PMC (2026-10). 12 estudios, 1365 personas, modelo bivariante: S 0,81, E 0,78, LR+ 3,15, LR− 0,21. Citada en el criterio del Lever de ro4.

Citada como:

1. Puño debajo de la rodilla — si el LCA está roto, el talón no se eleva. S IC 95 %: 68–92 %; E IC 83–95 %; LR+ IC 5,01–17,30; LR− IC 0,09–0,34. El que mejor descarta de los cuatro; en lesiones de menos de 3 semanas fue el más exacto. Concordante, Hesmerg 2024 (Knee 47:81–91; 23 estudios sin anestesia, sin el de su creador): S 79 %, E 92 %, LR+ 9,9, LR− 0,22. Hu 2024 (J Orthop Surg Res 19:155; 12 estudios, con el del creador) da E 78 % y LR+ 3,1.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test «Lever Sign Test» (en `criterio`) | 4b · mención en el texto | 1 |

### Hunter 2024

Autores: Hunter, Goldin y Regunath  
Título: *Pleurisy*  
Publicación: StatPearls [Internet], NBK558958 (act. 2024-11-14)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Hunter 2024 — Hunter, Goldin y Regunath, «Pleurisy», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de noviembre de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_p1` · Pulmonar | 2 · razonamiento del cribado | 1 |

### Hutchison 2013

Publicación: —  
DOI: 10.1016/j.fas.2012.12.006  
Última revisión: **sin revisar**  
Nota: Citado a través de Reiman 2014.

Citada como:

1. Batería progresiva: ETM bipodal → monopodal → saltos bipodales → monopodales, hasta reproducir; dolor localizado (1–2 dedos). EVA en cada escalón. Aquiles: la palpación no ayuda al diagnóstico. No puntúa: la única cifra de estos gestos es de Hutchison 2013 (estudio piloto, 10 tendinopatías; en Reiman 2014): ETM monopodal S 22 %, E 93 %, LR+ 3,14; salto S 43 %, E 87 %, LR+ 3,31, sin intervalo de confianza publicado.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp8 · Tendinopatía del Aquiles, Porción Media | Test «Batería progresiva de carga» (en `criterio`) | 4b · mención en el texto | 1 |

### Jain 2026

Autores: Jain, Singh, Shah y Grossman  
Título: *Acute Coronary Syndrome*  
Publicación: StatPearls [Internet], NBK459157 (act. 2026-07-05)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Jain 2026 — Jain, Singh, Shah y Grossman, «Acute Coronary Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de julio de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv2` · Cardiovascular | 2 · razonamiento del cribado | 1 |

### Jayarangaiah 2023

Autores: Jayarangaiah, Kemp y Theetha Kariyanna  
Título: *Bone Metastasis*  
Publicación: StatPearls [Internet], NBK507911 (act. 2023-07-31)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 31 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie. Releído en la sesión de codo (2026-10): razonamiento del cribado de codo.

Citada como:

1. Jayarangaiah 2023 — Jayarangaiah, Kemp y Theetha Kariyanna, «Bone Metastasis», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `c5` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_on2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv4` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv1` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_on2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `r2` · Oncológico / Hematológico | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `r3` · Oncológico / Hematológico | 2 · razonamiento del cribado | 1 |
| Codo | — | Pregunta `co2` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_c1` · Oncológico / Sistémico | 2 · razonamiento del cribado | 1 |

### Jeanmonod y Varacallo 2023

Autores: Jeanmonod y Varacallo  
Título: *Geriatric Cervical Spine Injury*  
Publicación: StatPearls [Internet], NBK470375 (act. 2023-08-04)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Jeanmonod y Varacallo 2023 — Jeanmonod y Varacallo, «Geriatric Cervical Spine Injury», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_ar3` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 1 |

### Jenkins y Vadakekut 2025

Autores: Jenkins y Vadakekut  
Título: *Pelvic Inflammatory Disease*  
Publicación: StatPearls [Internet], NBK499959 (act. 2025-06-02)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 2 de junio de 2025 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Jenkins y Vadakekut 2025 — Jenkins y Vadakekut, «Pelvic Inflammatory Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de junio de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_g2` · Ginecológico | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_u4` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Jogu 2026

Autores: Jogu, Swamy y Maher  
Título: *Reactive Arthritis*  
Publicación: StatPearls [Internet], NBK499831 (act. 2026-05-15)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 15 de mayo de 2026 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie.

Citada como:

1. Jogu 2026 — Jogu, Swamy y Maher, «Reactive Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 15 de mayo de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `r_i2` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_i2` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |

### Johns 2023

Autores: Johns, Mabrouk y Tavarez  
Título: *Slipped Capital Femoral Epiphysis*  
Publicación: StatPearls [Internet], NBK538302 (act. 2023-07-25)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 25 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera y rodilla.

Citada como:

1. Johns 2023 — Johns, Mabrouk y Tavarez, «Slipped Capital Femoral Epiphysis», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_os3` · Óseo / Desarrollo | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `ro_p1` · Niño o Adolescente | 2 · razonamiento del cribado | 1 |

### Jones 2025

Autores: Jones, Santos y Patel  
Título: *Acute Cholecystitis*  
Publicación: StatPearls [Internet], NBK459171 (act. 2025-07-06)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 6 de julio de 2025 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Jones 2025 — Jones, Santos y Patel, «Acute Cholecystitis», StatPearls [Internet], NCBI Bookshelf, última actualización 6 de julio de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_gi1` · GI / Hepático | 2 · razonamiento del cribado | 1 |

### Jonsson 2008

Publicación: Br J Sports Med 42:746–749  
DOI: 10.1136/bjsm.2007.039545  
Última revisión: **sin revisar**

Citada como:

1. Jonsson 2008, Br J Sports Med 42:746–749 (estudio piloto sin grupo control, n = 27, 34 tendones, diagnóstico con ecografía)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp9 · Tendinopatía Insercional del Aquiles | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Jull 2007

Publicación: Cephalalgia 27:793–802  
DOI: 10.1111/j.1468-2982.2007.01345.x  
Última revisión: **sin revisar**

Citada como:

1. Jull 2007 (Cephalalgia 27:793–802, parte 1; 18 cervicogénicas frente a 22 migrañas, 33 tensionales y 57 controles, n = 130; tabla 3). Riesgo de sesgo alto según Demont 2022 (PROBAST)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce4 · Cefalea Cervicogénica | Test «Cluster: ROM cervical + PAIVM + CCFT» | 4b · cita bajo el test | 1 |

### Kalakonda 2022

Autores: Kalakonda, Jenkins y John  
Título: *Physiology, Bilirubin*  
Publicación: StatPearls [Internet], NBK470290 (act. 2022-09-12)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 12 de septiembre de 2022 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Kalakonda 2022 — Kalakonda, Jenkins y John, «Physiology, Bilirubin», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de septiembre de 2022.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_gi2` · GI / Hepático | 2 · razonamiento del cribado | 1 |

### Kaplan y Kanwal 2023

Autores: Kaplan y Kanwal  
Título: *Thoracic Outlet Syndrome*  
Publicación: StatPearls [Internet], NBK557450 (act. 2023-04-10)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de codo.

Citada como:

1. Kaplan y Kanwal 2023 — Kaplan y Kanwal, «Thoracic Outlet Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de abril de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co4a_uni` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |
| Codo | — | Pregunta `co4b` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |

### Karanasios 2022

Publicación: J Hand Ther 35:541–551  
DOI: 10.1016/j.jht.2021.02.002  
Última revisión: **sin revisar**

Citada como:

1. Karanasios 2022 (J Hand Ther 35:541–551; revisión sistemática, 24 estudios, 97 % con riesgo de sesgo alto o incierto; solo 2 estudios de exploración física) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 83 y 100 (la precisión diagnóstica del test no se conoce)
2. Karanasios 2022 (J Hand Ther 35:541–551; revisión sistemática, 24 estudios, 97 % con riesgo de sesgo alto o incierto; solo 2 estudios de exploración física). Estudio de origen, casi con seguridad: Dorf 2007 (J Hand Surg Am 32:882–886; retrospectivo, 81 pacientes; una diferencia del 8 % entre flexión y extensión distinguió el brazo afectado del sano con un 83 % de precisión) · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Test de Cozen (extensión resistida de muñeca)» | 4b · cita bajo el test | 1 |
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Reducción de fuerza de prensión (diferencia 5-10% entre posiciones)» | 4b · cita bajo el test | 2 |

### Kastelein 2008

Publicación: Am J Med  
DOI: 10.1016/j.amjmed.2008.05.041  
Última revisión: 2026-10 · Sin cambios: PDF del usuario leído; S 0,56, E 0,91, LR+ 6,4 (2,7–15,2) y LR− 0,5 (0,3–0,8) de la combinación coinciden con la tabla 5 (un solo fisioterapeuta exploró a todos los pacientes). PubMed (exploración clínica del LCM de rodilla, revisiones sistemáticas desde 2008) no encuentra ningún estudio ni revisión posterior de precisión diagnóstica de la exploración.

Citada como:

1. Kastelein 2008 (Am J Med; n = 134, 35 con lesión del LCM; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro8 · Lesión del Ligamento Colateral Medial (LCM) | Test «Valgo forzado a 30° de flexión + mecanismo de la entrevista» | 4b · cita bajo el test | 1 |

### Katz 1995

Publicación: —  
DOI: 10.1002/art.1780380910  
Última revisión: 2026-10 · Sin cambios: sus datos (Romberg y dolor de muslo con 30 s de extensión) están en Cook 2019 (PDF del usuario), con riesgo de sesgo bajo y las mismas cifras; los dos tests de lu4 pasan a citar Cook 2019. Su patrón de referencia es el diagnóstico del médico experto, no la RM: se corrige en la cita.  
Nota: Citado a través de Dobbs 2016.

Citada como:

1. Cook 2019 (Eur Spine J, revisión sistemática; datos de Katz 1995, n = 75; referencia: diagnóstico del médico experto; LR+ IC 95 %: 1,29–12,76; riesgo de sesgo bajo). Antes: Suri 2010, LR+ 4,2
2. Cook 2019 (Eur Spine J, revisión sistemática; datos de Katz 1995, n = 75; referencia: diagnóstico del médico experto; LR+ 1,64, IC 95 %: 0,91–2,96; riesgo de sesgo bajo). Versión modificada: Dobbs 2016 (Manual Therapy, n = 30; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Romberg alterado» | 4b · cita bajo el test | 1 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Test de extensión lumbar de 30 s» | 4b · cita bajo el test | 2 |

### Kaur 2025

Autores: Kaur, Gandhi y Sharma  
Título: *Physiology, Cortisol*  
Publicación: StatPearls [Internet], NBK538239 (act. 2025-12-01)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Kaur 2025 — Kaur, Gandhi y Sharma, «Physiology, Cortisol», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de diciembre de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `end_1` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |
| Todas (sistemas comunes) | — | Pregunta `end_4` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |

### Kazemi 2023

Autores: Kazemi, Khorram, Fayyazishishavan y cols.  
Título: *Diagnostic Accuracy of Ottawa Knee Rule for Diagnosis of Fracture in Patients with Knee Trauma; a Systematic Review and Meta-analysis*  
Publicación: Arch Acad Emerg Med 11(1):e30  
DOI: 10.22037/aaem.v11i1.1934  
Última revisión: 2026-10 · Sin cambios: texto completo leído en PMC; S 98 %, E 43 %, LR+ 1,56 y LR− 0,12 (0,05–0,26) coinciden. Agrupa con un modelo univariante (Meta-DiSc, DerSimonian-Laird), y Sims 2020 es bivariante; se mantiene por decisión del usuario (más estudios y LR− más conservadora) y se anota el modelo en la cita. PubMed (revisiones de la regla de Ottawa de rodilla desde 2020) no encuentra ninguna posterior.  
Nota: Revisión sistemática más reciente de la regla de Ottawa de rodilla (18 estudios, 6702 adultos; S 98 %, E 43 %, LR+ 1,56, LR− 0,12); texto completo leído en PMC (2026-10). Sustituye a Bachmann 2004 en ro11 (puntúa con LR− 0,12) y en el razonamiento de ro_t1, por la regla de conflictos (mismo nivel, la más reciente).

Citada como:

1. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 197; Kazemi 2023 (Arch Acad Emerg Med 11:e30; revisión sistemática con metaanálisis univariante, 18 estudios, 6702 adultos); Sims 2020 (Eur Radiol 30:4438–46; metaanálisis bivariante, 8 estudios, 7385 adultos: S 99 %, E 49 %, LR− 0,07); Bachmann 2004 (Ann Intern Med 140:121–4; 6 estudios, 4249 adultos: S 98,5 %, E 48,6 %, LR− 0,05)
2. Kazemi 2023 — Kazemi, Khorram, Fayyazishishavan y cols., «Diagnostic Accuracy of Ottawa Knee Rule for Diagnosis of Fracture in Patients with Knee Trauma; a Systematic Review and Meta-analysis», Arch Acad Emerg Med 2023;11(1):e30.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro11 · Fracturas (Rótula o Meseta Tibial) | Test «Regla de Ottawa antes de nada» | 4b · cita bajo el test | 1 |
| Rodilla | — | Pregunta `ro_t1` · Traumático / Mecánico | 2 · razonamiento del cribado | 2 |

### Kelley 2013

Autores: Kelley, Shaffer, Kuhn, Michener, Seitz, Uhl, Godges y McClure  
Título: *Shoulder Pain and Mobility Deficits: Adhesive Capsulitis. Clinical Practice Guidelines*  
Publicación: J Orthop Sports Phys Ther 43(5):A1–A31  
DOI: 10.2519/jospt.2013.0302  
Última revisión: 2026-10 · Sin cambios: búsqueda en PubMed (2026-10) sin revisión de la guía de capsulitis adhesiva de JOSPT; sigue vigente junto con el consenso Salamh 2025.  
Nota: PDF aportado por el usuario. Guía APTA de capsulitis adhesiva (Lluch 2020, cap. 3.1.1, ref. 23). Pauta de h1 y test de rotación externa de h1. Donde choca con Salamh 2025 (consenso de expertos, posterior pero de menor nivel) se presentan las dos.

Citada como:

1. Positivo si la RE pasiva con el brazo al lado pierde más del 50 % respecto al lado sano o queda por debajo de 30°: es el criterio que se ha usado en los estudios para definir la capsulitis, junto a una pérdida de movilidad mayor del 25 % en al menos 2 planos (Kelley 2013, p. A9). La pérdida de movilidad pasiva en varios planos, sobre todo de RE con el brazo al lado y en distintos grados de abducción, es un hallazgo significativo para orientar el tratamiento (Kelley 2013, E). El consenso de 2025 asocia al hombro congelado una RE pasiva más limitada que las demás direcciones (100 %) y cada vez más limitada al aumentar la abducción (100 %). Lluch 2020: la RE está reducida de forma constante en neutro y a 90° de abducción, aunque la RI suele ser la más afectada cerca de 90°. Sin S ni E; no puntúa.
2. Kelley 2013 (J Orthop Sports Phys Ther 43(5):A1–A31, pp. A9 y A26) · Salamh 2025 (J Man Manip Ther 33(4):309–320, tabla 2) · Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 72
3. Kelley 2013, J Orthop Sports Phys Ther 43(5):A1–A31 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · Salamh 2025, J Man Manip Ther 33(4):309–320 (consenso Delphi de 14 expertos; % = acuerdo del panel; es opinión de expertos, no evidencia de eficacia)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h1 · Capsulitis Adhesiva | Test «Test de Rotación Externa (brazo neutro al lado, codo 90°)» (en `criterio`) | 4b · mención en el texto | 1 |
| Hombro | h1 · Capsulitis Adhesiva | Test «Test de Rotación Externa (brazo neutro al lado, codo 90°)» | 4b · cita bajo el test | 2 |
| Hombro | h1 · Capsulitis Adhesiva | Pauta de tratamiento | 5 · cita de la pauta | 3 |

### Kemp 2020

Autores: Kemp, Mosler, Hart, Bizzini, Chang, Scholes, Semciw y Crossley  
Título: *Improving function in people with hip-related pain: a systematic review and meta-analysis of physiotherapist-led interventions for hip-related pain*  
Publicación: Br J Sports Med 54(23):1382–1394  
DOI: 10.1136/bjsports-2019-101690  
Última revisión: 2026-10 · Sin cambios: PubMed (dolor de cadera relacionado con la articulación y fisioterapia, revisiones sistemáticas desde 2021) no encuentra una revisión posterior de las intervenciones; el ensayo PhysioFIRST (Kemp 2026), posterior, se suma a la pauta de ca2.  
Nota: Texto completo en PMC7677471. Dosis de ca2 y ca3 (cadera). No confundir con el consenso de Zúrich del mismo grupo y año (entrada «Consenso de Zúrich IHiPRN»).

Citada como:

1. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía; serie de Murtha citada en ella) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Kemp 2020, Br J Sports Med 54:1382–1394 (revisión sistemática)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca3 · Desgarro del Labrum Acetabular | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Kemp 2026

Autores: Kemp, Scholes, Smith, Coburn, Johnston, Jones, Girdwood, King, Mentiplay, De Oliveira Silva, Pazzinatto, Schache, Gomes, Coburn y Crossley  
Título: *Physiotherapist-led treatment for femoroacetabular impingement syndrome (the PhysioFIRST study): an assessor-blinded, limited disclosure randomised controlled trial*  
Publicación: Br J Sports Med 60(13):951–961  
DOI: 10.1136/bjsports-2025-110986  
Última revisión: 2026-10 · Ensayo más reciente sobre fisioterapia en el SIFA (PubMed, 2026-10); se suma a la pauta de ca2.  
Nota: Texto completo en PMC13479264 (leído en 2026-10); DOI comprobado en Crossref. 154 participantes de 18 a 50 años con SIFA (dolor ≥6 semanas, FADIR positivo, morfología cam en la radiografía, Kellgren-Lawrence <2), en 4 clínicas de Victoria (Australia). Fortalecimiento dirigido frente a estiramientos estandarizados, 6 meses: sin diferencia en iHOT-33 (0,2; IC −5,9 a 6,3), los dos mejoran unos 20 puntos; mejoría del dolor percibido 72 % frente a 52 %. Dosis de ca2 (cadera).

Citada como:

1. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Griffin 2018, Lancet 391:2225–2235 (ensayo aleatorizado UK FASHIoN, n = 348) · Kemp 2026, Br J Sports Med 60:951–961 (ensayo aleatorizado PhysioFIRST, n = 154, fortalecimiento dirigido frente a estiramientos)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Khalil 2025

Autores: Khalil, Marwaha y Bollu  
Título: *Physiology, Neuromuscular Junction*  
Publicación: StatPearls [Internet], NBK470413 (act. 2025-02-17)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de codo.

Citada como:

1. Khalil 2025 — Khalil, Marwaha y Bollu, «Physiology, Neuromuscular Junction», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de febrero de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co3` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |
| Codo | — | Pregunta `co_e2b` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |

### Khan y Bollu 2023

Autores: Khan y Bollu  
Título: *Horner Syndrome*  
Publicación: StatPearls [Internet], NBK500000 (act. 2023-04-10)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Khan y Bollu 2023 — Khan y Bollu, «Horner Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de abril de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_ar1` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 1 |

### Killeen y Cardenas 2025

Autores: Killeen y Cardenas  
Título: *Hemarthrosis*  
Publicación: StatPearls [Internet], NBK525999 (act. 2025-11-07)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 7 de noviembre de 2025 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Killeen y Cardenas 2025 — Killeen y Cardenas, «Hemarthrosis», StatPearls [Internet], NCBI Bookshelf, última actualización 7 de noviembre de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `r4` · Oncológico / Hematológico | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `ro_t1` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### Kim 2001

Publicación: Arthroscopy 17:160–164  
DOI: 10.1053/jars.2001.20665  
Última revisión: 2026-10 · Sin cambios: Hegedus 2012 (tablas 2 y 3, PDF del usuario) recoge dos estudios independientes con S 30–55 % y E 53–78 % y concluye con «menos optimismo»; Gismervik 2017 (PMC) lo excluye de su metaanálisis como valor atípico por el espectro de pacientes jóvenes. El Biceps Load II de h5 sigue como hallazgo.

Citada como:

1. Kim 2001 (Arthroscopy 17:160–164) · Hegedus 2012 (Br J Sports Med 46:964–978, tabla 2)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h5 · Lesión Labral Superior (SLAP) | Test «Biceps Load Test II» | 4b · cita bajo el test | 1 |

### Kim 2004

Publicación: —  
DOI: 10.1016/j.arthro.2004.08.003  
Última revisión: 2026-10 · Sin cambios: solo describe la técnica del test MPP; la validación es Kim 2007.  
Nota: Solo para la técnica del test.

Citada como:

1. Kim 2007 (Arthroscopy; 172 rodillas, referencia: artroscopia); técnica: Kim 2004

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro17 · Plica Sinovial Medial | Test «Test de provocación de la plica rotuliana medial» | 4b · cita bajo el test | 1 |

### Kim 2007

Publicación: Arthroscopy  
DOI: 10.1016/j.arthro.2007.06.016  
Última revisión: 2026-10 · Sin cambios: PDF del usuario leído; 172 rodillas, tabla 2×2 51/13/6/102 y los 13 falsos positivos (7 franjas sinoviales de la grasa de Hoffa, 5 sinovitis, 1 cartílago) coinciden. PubMed (diagnóstico de la plica medial desde 2008) no encuentra ningún estudio de precisión posterior del test; lo más reciente es de RM (2026) y de tratamiento (revisión de 2025).

Citada como:

1. Es la mejor forma de diagnosticarlo en consulta. Técnica (test MPP): supino, rodilla extendida; presión con el pulgar sobre la porción inferomedial de la femororrotuliana y, manteniéndola, flexionar a 90°. Positivo: dolor en extensión que desaparece o disminuye mucho a 90°; comparar con el otro lado. Kim 2007 da S 89,5 % · E 88,7 % frente a artroscopia (la tarjeta redondea a S 0,90 · E 0,89 · LR+ 8,18 · LR− 0,11), pero no puntúa: toda la especificidad sale de los controles con dolor en la interlínea lateral. En el grupo con dolor anteromedial, las 13 rodillas sin plica patológica (7 pinzamientos de franjas sinoviales de la grasa de Hoffa, 5 sinovitis localizadas, 1 lesión de cartílago) dieron el test positivo: E 0 de 13 en el diagnóstico diferencial real. Además, nivel III, no consecutivos y test hecho por su autor sin cegamiento. Cuenta como hallazgo compatible.
2. Kim 2007 (Arthroscopy; 172 rodillas, referencia: artroscopia); técnica: Kim 2004

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro17 · Plica Sinovial Medial | Test «Test de provocación de la plica rotuliana medial» (en `criterio`) | 4b · mención en el texto | 1 |
| Rodilla | ro17 · Plica Sinovial Medial | Test «Test de provocación de la plica rotuliana medial» | 4b · cita bajo el test | 2 |

### Kim y Chang 2021

Autores: Kim y Chang  
Título: *Neuralgic amyotrophy: an underrecognized entity*  
Publicación: J Int Med Res 49(4):03000605211006542  
DOI: 10.1177/03000605211006542  
Última revisión: **sin revisar**  
Nota: Texto completo en PMC8033465 (acceso abierto, leído vía Europe PMC). Revisión narrativa; razonamiento del cribado de hombro (h_n1).

Citada como:

1. Kim y Chang 2021 — Kim y Chang, «Neuralgic amyotrophy: an underrecognized entity», J Int Med Res 49(4):3000605211006542 (revisión narrativa).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_n1` · Neurológico | 2 · razonamiento del cribado | 1 |

### King y Lowery 2023

Autores: King y Lowery  
Título: *Physiology, Cardiac Output*  
Publicación: StatPearls [Internet], NBK470455 (act. 2023-07-17)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. King y Lowery 2023 — King y Lowery, «Physiology, Cardiac Output», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `hem_2` · Hematológico | 2 · razonamiento del cribado | 1 |

### Kinsella 2024

Publicación: J Orthop Sports Phys Ther 54(1):26–49  
DOI: 10.2519/jospt.2023.11890  
Última revisión: 2026-10 · Texto completo leído (tablas 2 y 3). En el texto el LR+ de la abducción resistida aparece como 13,39, que en la tabla 3 es la DOR; se usa el LR+ de la tabla (6,09).

Citada como:

1. Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3: 2 estudios, certeza baja; LR+ IC 95 %: 1,37–4,30; LR− IC 0,15–0,43). Solo Grimaldi 2017 (BJSM; n = 65, referencia: RM): S 80 %, E 47 %
2. Grimaldi 2017 (BJSM; n = 65 con dolor lateral de cadera, referencia: RM). Agrupado: Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3: 2 estudios, certeza muy baja)
3. Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3: 5 estudios, certeza baja; LR+ IC 95 %: 3,19–11,61; LR− IC 0,33–0,63). Incluye un estudio con controles sin dolor de cadera (Lequesne 2008)
4. Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3: 3 estudios, certeza muy baja)
5. Grimaldi 2017 (BJSM; n = 65 con dolor lateral de cadera, referencia: RM; versión con aducción añadida), según Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3, tabla 2). Lequesne 2008 (Arthritis Rheum; n = 17 con SDTM refractario de 13 meses de media, frente a 38 caderas sin dolor; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Palpación del trocánter mayor / tendón glúteo» | 4b · cita bajo el test | 1 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Apoyo Monopodal <30 segundos (Single-Leg Stance)» | 4b · cita bajo el test | 2 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Test de Abducción Resistida de Cadera» | 4b · cita bajo el test | 3 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Marcha de Trendelenburg» | 4b · cita bajo el test | 4 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Derotación externa resistida» | 4b · cita bajo el test | 5 |

### Koc 2023

Publicación: J Orthop Sports Phys Ther 53(12):CPG1–CPG39  
DOI: 10.2519/jospt.2023.0303  
Última revisión: **sin revisar**

Citada como:

1. Koc 2023, J Orthop Sports Phys Ther 53(12):CPG1–CPG39 (guía de práctica clínica APTA; letra = grado de la recomendación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp26 · Dolor Plantar Crónico del Talón | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Koc 2025

Autores: Koc, Cibulka, Enseki, Gentile, MacDonald, Kollmorgen y Martin  
Título: *Hip Pain and Mobility Deficits—Hip Osteoarthritis: Revision 2025*  
Publicación: J Orthop Sports Phys Ther 55(11):CPG1–CPG31  
DOI: 10.2519/jospt.2025.0301  
Última revisión: 2026-10 · Sustituye a Cibulka 2017 (revisión 2017 de la misma guía) en la pauta de ca1. PDF del usuario leído (2026-10; trae CPG1 y CPG10–CPG31, todas las intervenciones; faltan el resumen, la introducción, los métodos y el diagnóstico, CPG2–CPG9). Cambios frente a 2017: ejercicio (A) 1–5 veces por semana, 30–120 min, 5–16 semanas, incluido el acuático; terapia manual (A) con distracción longitudinal y movilización con movimiento; punción seca nueva (A); educación con afrontamiento del dolor por internet (B); pérdida de peso de C a B; ultrasonido de B a D. Donde choca con NICE NG226 (punción seca, ultrasonido) se dan las dos posturas (decisión del usuario).  
Nota: Guía de práctica clínica APTA; PDF aportado por el usuario; DOI comprobado en Crossref. Dosis de ca1 (cadera).

Citada como:

1. Koc 2025, J Orthop Sports Phys Ther 55(11):CPG1–CPG31 (guía de práctica clínica APTA, revisión de 2025; letra = grado de la recomendación, tal como la da la guía) · NICE NG226 (rec. 1.3.1–1.3.11; donde chocan, se dan las dos posturas)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca1 · Artrosis de Cadera | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Koh y Markovich 2023

Autores: Koh y Markovich  
Título: *Anatomy, Abdomen and Pelvis, Obturator Nerve*  
Publicación: StatPearls [Internet], NBK551640 (act. 2023-07-24)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 24 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Koh y Markovich 2023 — Koh y Markovich, «Anatomy, Abdomen and Pelvis, Obturator Nerve», StatPearls [Internet], NCBI Bookshelf, última actualización 24 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `ro_p1` · Niño o Adolescente | 2 · razonamiento del cribado | 1 |

### Krill 2018

Autores: Krill, Rosas, Kwon, Dakkak, Nwachukwu y McCormick  
Título: *A concise evidence-based physical examination for diagnosis of acromioclavicular joint pathology: a systematic review*  
Publicación: Phys Sportsmed 46(1):98–104  
DOI: 10.1080/00913847.2018.1413920  
Última revisión: 2026-10 · Sin cambios: texto completo leído en PMC (2026-10). Incluye 2 estudios (Walton 2004 y Cadogan 2013) y deja fuera Chronopoulos 2004 por ser de nivel III; las cifras citadas en h7 están en sus tablas 3 y 4.  
Nota: Texto completo leído en PMC (efetch, 2026-10). Lo cita Lluch 2020 (cap. 3.1, p. 61, ref. 8) como «S y E >90 %» para Paxinos + O’Brien; la revisión da S 11 %, E 96 % (95,8 % en el resumen) y LR+ 2,71 en serie. Contexto del O’Brien y de la aducción cruzada para la AC (h7).

Citada como:

1. Brazo a 90° de flexión, aducción horizontal pasiva cruzando el cuerpo. Positivo si duele en la parte superior del hombro, cerca de la AC. Cuenta como hallazgo. En un estudio retrospectivo de casos y controles da S 77 % (27 de 35) y E 79 % (410 de 518), de las que saldrían LR+ 3,7 y LR− 0,29; pero los casos se definieron por dolor a la palpación de la AC e infiltración positiva, y los controles eran otras cirugías de hombro. En atención primaria (Cadogan 2013, 153 pacientes consecutivos, bloqueo de la AC guiado por fluoroscopia) da S 64 %, E 26 %, LR+ 0,86, LR− 1,39: no discrimina. La revisión de Krill 2018 deja fuera el primero por ser de nivel III. Lluch 2020 (cap. 3.1, p. 61) dice «S >67 %». S y E solo aquí, para que no se recalcule la LR.
2. Chronopoulos 2004 (Am J Sports Med 32:655–661, tabla 3; 35 lesiones AC crónicas aisladas frente a 580 controles quirúrgicos) · Cadogan 2013 (BMC Musculoskelet Disord 14:156, tabla 4) · Krill 2018 (Phys Sportsmed 46:98–104, revisión sistemática; tabla 3)
3. Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6). En atención primaria (Cadogan 2013, 153 pacientes consecutivos, bloqueo de la AC guiado por fluoroscopia) da S 14 %, E 92 %, LR+ 1,73 (0,53–5,15). Combinado con el Paxinos y hechos en serie (los dos positivos), la revisión de Krill 2018 (Walton 2004 y Cadogan 2013; deja fuera a Chronopoulos 2004 por ser de nivel III) da S 11 %, E 96 % y LR+ 2,71, la mejor de las combinaciones, y concluye que ninguna cambia más que poco la probabilidad; Lluch 2020 (cap. 3.1, p. 61) lo resume como «S y E >90 %», cifra que la revisión no respalda.
4. Chronopoulos 2004 (Am J Sports Med 32:655–661, tabla 3) · Walton 2004 (J Bone Joint Surg Am) · Cadogan 2013 (BMC Musculoskelet Disord 14:156, tabla 4) · Krill 2018 (Phys Sportsmed 46:98–104, revisión sistemática; tablas 3 y 4)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h7 · Artropatía Acromioclavicular | Test «Test de Aducción Cruzada (Cross-body Adduction)» (en `criterio`) | 4b · mención en el texto | 1 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Test de Aducción Cruzada (Cross-body Adduction)» | 4b · cita bajo el test | 2 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» (en `criterio`) | 4b · mención en el texto | 3 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» | 4b · cita bajo el test | 4 |

### Kuijper 2009

Publicación: BMJ 339:b3883  
DOI: 10.1136/bmj.b3883  
Última revisión: **sin revisar**

Citada como:

1. Aguda: ejercicios de movilización y estabilización, láser y collarín a corto plazo (C); el collarín, solo poco tiempo, en la fase aguda y si no alivian otros tratamientos. Crónica: tracción cervical mecánica intermitente (la continua no ha mostrado beneficio) combinada con estiramientos y fortalecimiento más movilización o manipulación cervical y torácica (B); educación para seguir con la actividad laboral y el ejercicio (B). Vigilar la irritabilidad y ajustar la terapia manual y el ejercicio; derivar si los síntomas no mejoran o empeoran. Para la fase aguda hay una pauta con volumen de un ensayo (Kuijper 2009) en «Dolor radicular cervical». La guía no fija series, repeticiones ni semanas: el volumen queda a criterio del clínico, ajustado a la irritabilidad.
2. Kuijper 2009, BMJ 339:b3883 (ensayo aleatorizado, n = 205; la lista de ejercicios está en su apéndice web, no revisado) · Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce3 · Radiculopatía Cervical | Dosis (en el texto) | 5 · mención en el texto | 1 |
| Cervical | ce12 · Dolor Radicular Cervical | Pauta de tratamiento | 5 · cita de la pauta | 2 |

### Kulig 2009

Publicación: Phys Ther 89(1):26–37  
DOI: 10.2522/ptj.20080052  
Última revisión: **sin revisar**

Citada como:

1. Kulig 2009, Phys Ther 89(1):26–37 (ensayo aleatorizado, n = 36: plantillas + estiramiento, con o sin ejercicio concéntrico o excéntrico)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp14 · Tendinopatía del Tibial Posterior | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Lacy 2023

Autores: Lacy, Bajaj y Gillis  
Título: *Atlantoaxial Instability*  
Publicación: StatPearls [Internet], NBK519563 (act. 2023-06-12)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Lacy 2023 — Lacy, Bajaj y Gillis, «Atlantoaxial Instability», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de junio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_ar3` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_n1` · Médula / Estructural | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_in2` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |

### LaPelusa y Dave 2023

Autores: LaPelusa y Dave  
Título: *Physiology, Hemostasis*  
Publicación: StatPearls [Internet], NBK545263 (act. 2023-05-01)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. LaPelusa y Dave 2023 — LaPelusa y Dave, «Physiology, Hemostasis», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `hem_1` · Hematológico | 2 · razonamiento del cribado | 1 |
| Todas (sistemas comunes) | — | Pregunta `hem_4` · Hematológico | 2 · razonamiento del cribado | 1 |

### Laslett 2003

Autores: Laslett, Young, Aprill y McDonald  
Título: *Diagnosing painful sacroiliac joints: a validity study of a McKenzie evaluation and sacroiliac provocation tests*  
Publicación: Aust J Physiother 49(2):89–97  
DOI: 10.1016/s0004-9514(14)60125-2  
Última revisión: 2026-10 · No leída directamente: sus cifras se toman de Laslett 2008 (ref. 52) y de Saueressig 2021 (fig. 3: S 0,91, E 0,78), que la incluye en su metaanálisis. Ambas leídas en PDF (2026-10).  
Nota: DOI comprobado en Crossref (2026-10). Estudio de los creadores del cluster sacroilíaco con doble bloqueo (48 pacientes con test índice). Cluster de ca10 (cadera), como dato del estudio original.

Citada como:

1. Distracción, compresión, thigh thrust, Gaenslen y sacral thrust; positivo si 3 o más reproducen su dolor. LR+ 2,13 (IC 95 % 1,2–3,9), LR− 0,33 (IC 0,11–0,72), certeza muy baja (GRADE): positivo orienta poco; negativo descarta mejor. Si los síntomas no se centralizan con movimientos repetidos, la especificidad sube (del 78 % al 87 % en el estudio de los creadores): los positivos con centralización (dolor discal) son falsos positivos. Lluch cita S 85–94 %, E 79 %; la cifra de la revisión de Laslett de 2008 (S 91 %, E 78 %; LR+ 4,16, LR− 0,12) es de un solo estudio (Laslett 2003, 48 pacientes, doble bloqueo), y el de 2005, con 6 tests, daba S 94 %, E 78 %. Otra revisión, sin aclarar el modelo y con dos publicaciones de la misma población, da LR+ 2,44 y LR− 0,31 (Han 2023). Regla alternativa del estudio de 2005, sin Gaenslen: 2 o más positivos de 4 (distracción, thigh thrust, compresión y sacral thrust) dan S 88 %, E 78 %, LR+ 4,0 (IC 2,13–8,08), LR− 0,16 (IC 0,04–0,47); orden propuesto: thigh thrust y distracción primero, y si los dos son positivos no hace falta seguir; con uno positivo, compresión y, si es negativa, sacral thrust. En ese estudio, con todos los tests negativos se descartaba la sacroilíaca.
2. Saueressig 2021 (J Orthop Sports Phys Ther 51:422–431; metaanálisis bivariante, 5 estudios de 34 a 60 pacientes con dolor lumbar crónico y sospecha de dolor sacroilíaco; referencia: bloqueo anestésico intraarticular; incluye el estudio de los creadores, Laslett 2003). Laslett 2008 (J Man Manip Ther 16:142–152); Laslett 2005 (Man Ther 10:207–218, tablas 4–6 y fig. 7); Han 2023 (eClinicalMedicine 59:101960, tabla 1: 6 estudios); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153
3. Saueressig 2021 (J Orthop Sports Phys Ther 51:422–431; metaanálisis bivariante, 5 estudios; LR+ IC 95 %: 1,2–3,9, LR− 0,11–0,72; referencia: bloqueo anestésico intraarticular; incluye el estudio de los creadores, Laslett 2003): certeza muy baja (GRADE); descarta mejor de lo que confirma. Misma regla que la tarjeta lumbar: 3 de 5 positivos. Han 2023 (eClinicalMedicine, revisión sistemática, 6 estudios, sin aclarar el modelo y con dos publicaciones de la misma población): LR+ 2,44, LR− 0,31

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Cluster de Laslett: 3 o más de 5 tests de provocación positivos» (en `criterio`) | 4b · mención en el texto | 1 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Cluster de Laslett: 3 o más de 5 tests de provocación positivos» | 4b · cita bajo el test | 2 |
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Cluster «Tests de provocación SI (3 de 5)» | 4b · cita del cluster | 3 |

### Laslett 2005

Autores: Laslett, Aprill, McDonald y Young  
Título: *Diagnosis of sacroiliac joint pain: validity of individual provocation tests and composites of tests*  
Publicación: Man Ther 10(3):207–218  
DOI: 10.1016/j.math.2005.01.003  
Última revisión: 2026-10 · Sin cambios en las cifras: PDF releído entero (2026-10); tabla 2 (compresión LR+ 2,20, LR− 0,46; thigh thrust LR+ 2,80, LR− 0,18; LR publicadas, método score) y tablas 4–6 coinciden con las citas. Es un solo estudio de los creadores (48 pacientes no consecutivos, crónicos, 16 con bloqueo positivo). Agrupados en Han 2023 el thigh thrust (5 estudios) y la compresión (2) no llegan a LR+ 2 ni a LR− 0,5: los dos pasan a hallazgo en ca10 (decisión del usuario, 2026-10). Saueressig 2021 no la agrupa por ser la misma población que Laslett 2003.  
Nota: PDF aportado por el usuario. Ref. 99 de Lluch 2020, cap. 4.1: origen de las cifras del thigh thrust (tabla 2) y de la regla de 2 de 4 tests (tablas 5–6). Errata en la tabla 4: la LR− de «3 o más de 6» figura como 0,80 (IC 0,14–0,37); por los datos es ≈0,08. Hipótesis ca10 (cadera); su criterio de exclusión (dolor solo en la línea media o simétrico por encima de L5) respalda el criterio de localización de ca10, y su lista de 6 tests muestra que el Patrick no estaba (releído en 2026-10). Tests de compresión y thigh thrust de ca10, ahora como hallazgo.

Citada como:

1. Laslett 2005 (Man Ther 10:207–218, tabla 2; referencia: bloqueo anestésico intraarticular). Agrupado: Han 2023 (eClinicalMedicine 59:101960, revisión sistemática, tabla 1)
2. Flexión, abducción y rotación externa (posición de 4). Como provocación sacroilíaca no tiene exactitud propia: formó parte de la batería de 6 tests de uno de los dos estudios que compara Laslett 2008, no de la de Laslett 2005 ni del cluster de 5 tests. En la cadera se usa sobre todo como test intraarticular (ver el FABER del SIFA). Cuenta como hallazgo.
3. Laslett 2008 (J Man Manip Ther 16:142–152, tabla 1). Laslett 2005 (Man Ther 10:207–218)
4. Laslett 2005 (Man Ther 10:207–218, criterios de exclusión). Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153
5. Saueressig 2021 (J Orthop Sports Phys Ther 51:422–431; metaanálisis bivariante, 5 estudios de 34 a 60 pacientes con dolor lumbar crónico y sospecha de dolor sacroilíaco; referencia: bloqueo anestésico intraarticular; incluye el estudio de los creadores, Laslett 2003). Laslett 2008 (J Man Manip Ther 16:142–152); Laslett 2005 (Man Ther 10:207–218, tablas 4–6 y fig. 7); Han 2023 (eClinicalMedicine 59:101960, tabla 1: 6 estudios); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153
6. Laslett 2005 (Man Ther 10:207–218, tabla 2; referencia: bloqueo anestésico intraarticular). Agrupado: Han 2023 (eClinicalMedicine 59:101960, revisión sistemática, tabla 1); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 153–154

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Test de Compresión Pélvica» | 4b · cita bajo el test | 1 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Test de Patrick (FABER)» (en `criterio`) | 4b · mención en el texto | 2 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Test de Patrick (FABER)» | 4b · cita bajo el test | 3 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Dolor no limitado a la línea media ni por encima de L5» | 4b · cita bajo el test | 4 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Cluster de Laslett: 3 o más de 5 tests de provocación positivos» | 4b · cita bajo el test | 5 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Thigh thrust» | 4b · cita bajo el test | 6 |

### Laslett 2006

Publicación: —  
DOI: 10.1016/j.spinee.2006.01.004  
Última revisión: 2026-10 · Sin cambios: Han 2023 (revisión sistemática, revisada 2026-10) la recoge: los criterios de Revel no se replican y no se pueden agrupar.

Citada como:

1. Laslett 2006 (no replica a Revel; referencia: doble bloqueo); Han 2023 (eClinicalMedicine, revisión sistemática: Revel inconsistente, no agrupable)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu7 · Dolor Lumbar Facetario | Test «Dolor en extensión, inclinación o rotación hacia el lado del dolor» | 4b · cita bajo el test | 1 |

### Laslett 2008

Autores: Laslett  
Título: *Evidence-based diagnosis and treatment of the painful sacroiliac joint*  
Publicación: J Man Manip Ther 16(3):142–152  
DOI: 10.1179/jmt.2008.16.3.142  
Última revisión: 2026-10 · Revisión narrativa, no un agrupado: PDF releído entero (2026-10). El S 91 % / E 78 % del cluster (E 87 % sin centralización; LR+ 4,16, LR− 0,12) lo toma de un solo estudio, su ref. 52 (Laslett 2003, Aust J Physiother). El cluster de ca10 pasa a las LR de Saueressig 2021 (decisión del usuario, 2026-10); Laslett 2008 queda citada para el contexto y la tabla 1.  
Nota: Texto completo en PMC2582421. Revisión narrativa. Recoge la cifra del cluster de provocación sacroilíaca (≥3/5: S 91 %, E 78 %; E 87 % sin centralización) que Lluch 2020 cita como «85–94 %, 79 %»; es de Laslett 2003 (ref. 52), no de un agrupado. Hipótesis ca10 (cadera). Releído entero en PDF del usuario (2026-10; Europe PMC daba error 500): la tabla 1 compara Laslett 2005 con van der Wurff 2006, cuya batería incluía el Patrick; test de Patrick de ca10.

Citada como:

1. Flexión, abducción y rotación externa (posición de 4). Como provocación sacroilíaca no tiene exactitud propia: formó parte de la batería de 6 tests de uno de los dos estudios que compara Laslett 2008, no de la de Laslett 2005 ni del cluster de 5 tests. En la cadera se usa sobre todo como test intraarticular (ver el FABER del SIFA). Cuenta como hallazgo.
2. Laslett 2008 (J Man Manip Ther 16:142–152, tabla 1). Laslett 2005 (Man Ther 10:207–218)
3. Saueressig 2021 (J Orthop Sports Phys Ther 51:422–431; metaanálisis bivariante, 5 estudios de 34 a 60 pacientes con dolor lumbar crónico y sospecha de dolor sacroilíaco; referencia: bloqueo anestésico intraarticular; incluye el estudio de los creadores, Laslett 2003). Laslett 2008 (J Man Manip Ther 16:142–152); Laslett 2005 (Man Ther 10:207–218, tablas 4–6 y fig. 7); Han 2023 (eClinicalMedicine 59:101960, tabla 1: 6 estudios); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Test de Patrick (FABER)» (en `criterio`) | 4b · mención en el texto | 1 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Test de Patrick (FABER)» | 4b · cita bajo el test | 2 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Cluster de Laslett: 3 o más de 5 tests de provocación positivos» | 4b · cita bajo el test | 3 |

### Lassiter 2024

Autores: Lassiter, Bhutta y Allam  
Título: *Inflammatory Back Pain and Spondyloarthropathies*  
Publicación: StatPearls [Internet], NBK539753 (act. 2024-02-26)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 26 de febrero de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Lassiter 2024 — Lassiter, Bhutta y Allam, «Inflammatory Back Pain and Spondyloarthropathies», StatPearls [Internet], NCBI Bookshelf, última actualización 26 de febrero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_in2` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l5` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l5c` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l5d` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_e2` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |

### Leib 2023

Autores: Leib, Roshan, Foris y Varacallo  
Título: *Baker’s Cyst*  
Publicación: StatPearls [Internet], NBK430774 (act. 2023-08-04)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 4 de agosto de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Leib 2023 — Leib, Roshan, Foris y Varacallo, «Baker’s Cyst», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `r_v3` · Vascular | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `ro_t4` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### Lequesne 2008

Publicación: Arthritis Rheum 59(2):241–6  
DOI: 10.1002/art.23354  
Última revisión: 2026-10 · Cifras comprobadas en el resumen y en la tabla 2 de Kinsella 2024. La E se midió frente a controles sin dolor de cadera (casos y controles), lo que la infla: la derotación externa resistida pasa a hallazgo.

Citada como:

1. Positivo: reproduce el dolor lateral de cadera antes de 30 s de apoyo sobre la pierna afectada. Todos los positivos tenían tendinopatía en la RM (LR+ 12,2), pero con IC 95 % de 0,8 a 191,5 (15 pacientes sin tendinopatía): aún no puntúa. El valor agrupado (LR+ 87,8, IC 3,0–2587) depende de un estudio con controles sin dolor de cadera (Lequesne 2008); certeza muy baja. Negativo no descarta (S 38 %).
2. Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3: 5 estudios, certeza baja; LR+ IC 95 %: 3,19–11,61; LR− IC 0,33–0,63). Incluye un estudio con controles sin dolor de cadera (Lequesne 2008)
3. Supino, cadera a 90° en RE; el paciente vuelve a neutro contra resistencia. Positivo: reproduce su dolor. Si es negativo, repetir en prono con la cadera en extensión. No puntúa: en pacientes con dolor lateral de cadera, S 44 %, E 93 %, LR+ 6,6 con IC 0,97–45 (Grimaldi 2017). Las cifras altas (S 88 %, E 97 %) son de un estudio con controles sin dolor de cadera (Lequesne 2008), que también sostiene el valor agrupado (LR+ 16,5, IC 2,95–92,7; certeza muy baja).
4. Grimaldi 2017 (BJSM; n = 65 con dolor lateral de cadera, referencia: RM; versión con aducción añadida), según Kinsella 2024 (J Orthop Sports Phys Ther 54:26–49; metaanálisis, 6 estudios, 272 participantes con dolor lateral de cadera; tabla 3, tabla 2). Lequesne 2008 (Arthritis Rheum; n = 17 con SDTM refractario de 13 meses de media, frente a 38 caderas sin dolor; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Apoyo Monopodal <30 segundos (Single-Leg Stance)» (en `criterio`) | 4b · mención en el texto | 1 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Test de Abducción Resistida de Cadera» | 4b · cita bajo el test | 2 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Derotación externa resistida» (en `criterio`) | 4b · mención en el texto | 3 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Test «Derotación externa resistida» | 4b · cita bajo el test | 4 |

### Leslie 2023

Autores: Leslie, Tadi y Tayyeb  
Título: *Neurogenic Bladder and Neurogenic Lower Urinary Tract Dysfunction*  
Publicación: StatPearls [Internet], NBK560617 (act. 2023-07-04)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Leslie 2023 — Leslie, Tadi y Tayyeb, «Neurogenic Bladder and Neurogenic Lower Urinary Tract Dysfunction», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv3` · Renal / Urológico | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_r2` · Renal / Urológico | 2 · razonamiento del cribado | 1 |

### Leslie 2024

Autores: Leslie, Sajjad y Singh  
Título: *Nocturia*  
Publicación: StatPearls [Internet], NBK518987 (act. 2024-02-17)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 17 de febrero de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Leslie 2024 — Leslie, Sajjad y Singh, «Nocturia», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de febrero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_u3b` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Leslie 2025

Autores: Leslie, Hamawy y Saleem  
Título: *Gross and Microscopic Hematuria*  
Publicación: StatPearls [Internet], NBK534213 (act. 2025-11-30)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 30 de noviembre de 2025 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Leslie 2025 — Leslie, Hamawy y Saleem, «Gross and Microscopic Hematuria», StatPearls [Internet], NCBI Bookshelf, última actualización 30 de noviembre de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_r1` · Renal / Urológico | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `c3` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Lezak 2024

Autores: Lezak, Massel y Varacallo  
Título: *Peroneal Nerve Injury*  
Publicación: StatPearls [Internet], NBK549859 (act. 2024-02-25)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 25 de febrero de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie.

Citada como:

1. Lezak 2024 — Lezak, Massel y Varacallo, «Peroneal Nerve Injury», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de febrero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `ro_t4` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `ro_t5` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_n2` · Neurológico | 2 · razonamiento del cribado | 1 |

### Litaker 2000

Publicación: J Am Geriatr Soc  
DOI: 10.1111/j.1532-5415.2000.tb03875.x  
Última revisión: 2026-10 · Sin cambios: PDF del usuario leído entero (2026-10). La LR 5,0 del grupo de validación sale de la tabla 4 (52 de 146 frente a 5 de 70); 9,84 es la del grupo de derivación. Sigue siendo un solo estudio retrospectivo de un cirujano, con artrografía como referencia; no se encontró validación externa entre los artículos que lo citan (Europe PMC). Hanchard 2013 (Cochrane) lo excluye; Zhao 2024 lo usa solo para el Hawkins.

Citada como:

1. Litaker 2000 (J Am Geriatr Soc; n = 448 derivados a artrografía, 67 % con rotura; tabla 4, grupo de validación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h3 · Rotura del Manguito Rotador | Test «Cluster B: debilidad en RE + edad ≥65 (puntuación de Litaker ≥4)» | 4b · cita bajo el test | 1 |

### Liu 2025

Publicación: BMC Sports Sci Med Rehabil 17:335  
DOI: 10.1186/s13102-025-01404-y  
Última revisión: **sin revisar**

Citada como:

1. Martin 2021, J Orthop Sports Phys Ther 51(4):CPG1–CPG80 (guía de práctica clínica APTA; letra = grado de la recomendación) · Liu 2025, BMC Sports Sci Med Rehabil 17:335 (metaanálisis de dosis) · McKeon 2008, Med Sci Sports Exerc 40(10):1810–1819 (ensayo aleatorizado, n = 31)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp21 · Inestabilidad Crónica del Tobillo | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Lleva 2025

Autores: Lleva, Munakomi, Sun y Chang  
Título: *Ulnar Neuropathy*  
Publicación: StatPearls [Internet], NBK534226 (act. 2025-12-13)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de codo.

Citada como:

1. Lleva 2025 — Lleva, Munakomi, Sun y Chang, «Ulnar Neuropathy», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de diciembre de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co4b` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |
| Codo | — | Pregunta `co3` · Vascular / Neurológica | 2 · razonamiento del cribado | 1 |
| Codo | — | Pregunta `co_e1` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |

### Lluch 2020

Autores: Lluch, López-Cubas, Jones, Jull, Hall y Lewis  
Título: *Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders*  
Publicación: ZERAPI  
DOI: —  
Última revisión: **sin revisar**  
Nota: Base de las guías clínicas de cada región, de las que son extracto las tarjetas de consulta (repo guia-de-consulta). Los capítulos que citan los pies de las tarjetas (Struyf y Powell y Lewis, cap. 3, en hombro; Fondevila Suárez, cap. 5, en lumbar) son de este libro. Capítulos leídos enteros (PDF escaneado del usuario) y citados directamente como fuente, con capítulo y páginas: cap. 5.1 (Fondevila Suárez, lumbar, pp. 295–326: pronósticos de lu3–lu8, tests de lu5–lu9 y l_e7) caps. 5.3 y 5.3.1 (cervical) cap. 4.1, subcaps. 4.1.1–4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg, cadera, pp. 123–189, bibliografía incluida; releído entero en 2026-10: pronósticos y tests de cadera y razonamiento del cribado de cadera) cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan, rodilla, pp. 191–234, bibliografía incluida: pronósticos y tests de rodilla y razonamiento del cribado de rodilla; el capítulo no tiene tabla de banderas rojas) y cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook, tobillo y pie, pp. 235–291, bibliografía incluida: 112 de las 147 citas de pronósticos y tests de tobillo y pie y razonamiento del cribado de tobillo y pie; sus banderas rojas están en la p. 287) y cap. 3.2 (Coombes y Bisset, codo, pp. 81–103, bibliografía incluida: 10 tests de codo y razonamiento del cribado de codo; sin tabla de banderas rojas).

Citada como:

1. Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 73
2. Positivo si la RE pasiva con el brazo al lado pierde más del 50 % respecto al lado sano o queda por debajo de 30°: es el criterio que se ha usado en los estudios para definir la capsulitis, junto a una pérdida de movilidad mayor del 25 % en al menos 2 planos (Kelley 2013, p. A9). La pérdida de movilidad pasiva en varios planos, sobre todo de RE con el brazo al lado y en distintos grados de abducción, es un hallazgo significativo para orientar el tratamiento (Kelley 2013, E). El consenso de 2025 asocia al hombro congelado una RE pasiva más limitada que las demás direcciones (100 %) y cada vez más limitada al aumentar la abducción (100 %). Lluch 2020: la RE está reducida de forma constante en neutro y a 90° de abducción, aunque la RI suele ser la más afectada cerca de 90°. Sin S ni E; no puntúa.
3. Kelley 2013 (J Orthop Sports Phys Ther 43(5):A1–A31, pp. A9 y A26) · Salamh 2025 (J Man Manip Ther 33(4):309–320, tabla 2) · Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 72
4. Lluch 2020, cap. 3.1.1 (Powell y Lewis), pp. 72–73
5. Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 71
6. Lluch 2020, cap. 3.1.1 (Powell y Lewis), pp. 69–73
7. Elevación pasiva en el plano escapular con rotación interna. Combinar test para el SAPS apenas mejora la precisión (Lluch 2020, cap. 3.1, p. 54). Metaanálisis de 7 estudios (n = 946): LR+ 1,79 (IC 1,24–2,58), LR− 0,47 (IC 0,39–0,56), modelo bivariante. Sirve para descartar; un positivo es solo un hallazgo. Zhao 2024 (7 estudios, bivariante) da LR+ 1,54 (1,09–2,18), LR− 0,47 (0,41–0,54).
8. Lluch 2020, cap. 3.1 (Struyf), p. 54
9. Lluch 2020, cap. 3.1 (Struyf), pp. 53–54
10. Imposibilidad de mantener la rotación externa pasivamente colocada. Para rotura completa: LR+ 7,2 (IC 95 % 1,7–31), LR− 0,57 (0,35–0,92), un solo estudio (37 pacientes, ecografía); un negativo no descarta. En otro estudio de bajo riesgo de sesgo recogido por Hegedus 2012 da LR+ 28 para la rotura completa del supraespinoso. Si el nervio supraescapular está paralizado, los test del supraespinoso y del infraespinoso salen positivos con el manguito intacto; distinguirlo exige más que la clínica y la atrofia (Lluch 2020, cap. 3.1, pp. 66–67).
11. Lluch 2020, cap. 3.1 (Struyf), p. 66
12. Puntuación: debilidad en RE 2 puntos + edad ≥65 años 2 + dolor nocturno 1; positivo con ≥4, así que basta con debilidad en RE y edad ≥65 (el dolor nocturno no hace falta). Debilidad en RE: brazos junto al cuerpo, codos a 90°, pulgares arriba y 20° de rotación interna; resistir el empuje hacia dentro. Dolor nocturno: se duerme, pero el dolor le despierta. LR+ 9,8 en el grupo de derivación (43 de 131 frente a 2 de 60); en el de validación baja a 5,0 (52 de 146 frente a 5 de 70, calculada de la tabla 4): se usa esta, como dice la tarjeta. Lluch 2020 (cap. 3.1, p. 66) da LR 9,84 con los tres positivos: es la cifra del grupo de derivación. Rotura parcial o completa por artrografía, en una consulta de cirugía de hombro. No publica LR−.
13. Lluch 2020, cap. 3.1 (Struyf), pp. 66–67
14. Lluch 2020, cap. 3.1 (Struyf), pp. 58–59
15. Lluch 2020, cap. 3.1 (Struyf), p. 59
16. Flexión a 90°, aducción horizontal 10°, rotación interna (pulgar abajo) — resistencia. Luego igual con rotación externa. Positivo: dolor que desaparece o disminuye en supinación. Lluch 2020 (cap. 3.1, p. 63): ningún hallazgo físico es específico; sirve para sostener la hipótesis, no para confirmarla. Metaanálisis de 6 estudios (n = 782), sin el estudio original de O’Brien, que distorsionaba el resultado: S 0,67, E 0,37, LR+ 1,06 (IC 0,90–1,25), LR− 0,89 (IC 0,67–1,20). No puntúa: antes multiplicaba por el extremo bajo de «3–50», sin fuente.
17. Lluch 2020, cap. 3.1 (Struyf), pp. 63–64
18. Reproducción del dolor de hombro con extensión + inclinación lateral ipsilateral + compresión axial. En el dolor de hombro cervicogénico el dolor se reproduce con las pruebas de la columna cervical y la movilidad pasiva glenohumeral no está limitada, lo que lo distingue del hombro congelado (Lluch 2020, tabla 2). El Spurling se ha estudiado para la radiculopatía cervical (S 0,50, E 0,86–0,93; revisión de Rubinstein recogida por Blanpied 2017), no para el dolor referido al hombro: aquí no puntúa.
19. Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19)
20. PROM glenohumeral preservado: diferencia el origen cervical del capsular primario. En la tabla de diagnóstico diferencial de Lluch 2020, el dolor de hombro cervicogénico no restringe la movilidad pasiva glenohumeral, mientras que el hombro congelado y la luxación bloqueada restringen la activa y la pasiva. Sin S ni E; no puntúa.
21. Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75
22. Brazo a 90° de flexión, aducción horizontal pasiva cruzando el cuerpo. Positivo si duele en la parte superior del hombro, cerca de la AC. Cuenta como hallazgo. En un estudio retrospectivo de casos y controles da S 77 % (27 de 35) y E 79 % (410 de 518), de las que saldrían LR+ 3,7 y LR− 0,29; pero los casos se definieron por dolor a la palpación de la AC e infiltración positiva, y los controles eran otras cirugías de hombro. En atención primaria (Cadogan 2013, 153 pacientes consecutivos, bloqueo de la AC guiado por fluoroscopia) da S 64 %, E 26 %, LR+ 0,86, LR− 1,39: no discrimina. La revisión de Krill 2018 deja fuera el primero por ser de nivel III. Lluch 2020 (cap. 3.1, p. 61) dice «S >67 %». S y E solo aquí, para que no se recalcule la LR.
23. Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6). En atención primaria (Cadogan 2013, 153 pacientes consecutivos, bloqueo de la AC guiado por fluoroscopia) da S 14 %, E 92 %, LR+ 1,73 (0,53–5,15). Combinado con el Paxinos y hechos en serie (los dos positivos), la revisión de Krill 2018 (Walton 2004 y Cadogan 2013; deja fuera a Chronopoulos 2004 por ser de nivel III) da S 11 %, E 96 % y LR+ 2,71, la mejor de las combinaciones, y concluye que ninguna cambia más que poco la probabilidad; Lluch 2020 (cap. 3.1, p. 61) lo resume como «S y E >90 %», cifra que la revisión no respalda.
24. Lluch 2020, cap. 3.1 (Struyf), p. 61 · Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75
25. Asimetría visual en la elevación del brazo: ángulo inferior, borde medial o espina escapular prominentes. Las medidas de la movilidad escapular son poco fiables y de validez limitada, y no deben usarse para medir objetivamente la movilidad escapular dinámica (Desmeules 2025, recomendación 6, A). La discinesia se asocia al SAPS, pero no se ha demostrado que cause el dolor (Lluch 2020). Sin S ni E; no puntúa.
26. Desmeules 2025 (J Orthop Sports Phys Ther 55(4):235–274, recomendación 6) · Lluch 2020, cap. 3.1 (Struyf), pp. 53–54
27. Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75; Tarjeta de consulta hombro (guía clínica de hombro, ap. 5)
28. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 164 y 170
29. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 138; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164
30. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 162
31. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137
32. Lluch 2020, cap. 4.1.1 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 125; cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 136; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 175–176
33. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 157
34. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 176–177
35. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 134, 137 y 142; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 179
36. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 157–158. Grimaldi 2026 (Musculoskelet Sci Pract 84:103592, revisión narrativa, apartado 2.2.1)
37. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 172
38. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 174. Enseki 2023 (J Orthop Sports Phys Ther 53(7), guía de práctica clínica APTA, p. CPG20)
39. Enseki 2023 (J Orthop Sports Phys Ther 53(7), guía de práctica clínica APTA, p. CPG20). Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 158
40. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 157
41. Laslett 2005 (Man Ther 10:207–218, criterios de exclusión). Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153
42. Saueressig 2021 (J Orthop Sports Phys Ther 51:422–431; metaanálisis bivariante, 5 estudios de 34 a 60 pacientes con dolor lumbar crónico y sospecha de dolor sacroilíaco; referencia: bloqueo anestésico intraarticular; incluye el estudio de los creadores, Laslett 2003). Laslett 2008 (J Man Manip Ther 16:142–152); Laslett 2005 (Man Ther 10:207–218, tablas 4–6 y fig. 7); Han 2023 (eClinicalMedicine 59:101960, tabla 1: 6 estudios); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153
43. Laslett 2005 (Man Ther 10:207–218, tabla 2; referencia: bloqueo anestésico intraarticular). Agrupado: Han 2023 (eClinicalMedicine 59:101960, revisión sistemática, tabla 1); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 153–154
44. Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153
45. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 168
46. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 168
47. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 168, 170 y 173
48. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 160
49. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 137; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 162
50. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 163; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 175
51. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 162–163
52. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 137
53. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 135
54. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 175 y 177
55. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 141; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 172
56. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 141
57. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 138
58. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 136 (fig. 4)
59. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 138
60. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 139–140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164
61. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164
62. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 138–139; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 173; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 177
63. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 164 y 168
64. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 138–139; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 145; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 173; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 177
65. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 139; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164
66. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 138–139; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 145; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 164 y 173
67. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164
68. Lluch 2020, cap. 5.3 (Jull y Falla), pp. 377–378 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)
69. Lluch 2020, cap. 5.3 (Jull y Falla), pp. 379–380 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19)
70. Ejercicio neuromuscular (coordinación, propiocepción, entrenamiento postural, coordinación ojo-cabeza-cuello) dentro del abordaje multimodal de la fase crónica (B). El fortalecimiento isométrico de los flexores profundos redujo dolor y discapacidad a corto plazo, pero el entrenamiento con biofeedback de presión no fue mejor que el fortalecimiento de los flexores con pesas. Para dosificar el entrenamiento craneocervical (Lluch 2020): test de flexión craneocervical en supino con biofeedback de presión inflado a 20 mmHg y cinco escalones de 2 mmHg (22–30), sin activar en exceso el esternocleidomastoideo ni los escalenos y sin retraer la cabeza; la resistencia se mide con apoyos repetidos de 5–10 s en cada nivel y el entrenamiento empieza en el nivel inferior al del fallo. Ni la guía ni el libro fijan series ni semanas.
71. Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · Lluch 2020, cap. 5.3 (Jull y Falla), p. 378 (test de flexión craneocervical para dosificar)
72. Lluch 2020, cap. 5.3 (Jull y Falla), p. 380 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)
73. Según la fase (dolor de cuello con cefalea). Aguda: instrucción supervisada en ejercicios de movilidad activa (B); autoSNAG C1–2 (C). Subaguda: manipulación y movilización cervical (B); autoSNAG C1–2 (C). Crónica: manipulación o movilización cervical o cervicotorácica combinada con estiramiento, fortalecimiento y resistencia de cuello y cintura escapular (B); el fortalecimiento cervicoescapular con entrenamiento de flexión craneocervical con biofeedback mejoró dolor y función a largo plazo, y los autores de la guía señalan, como opinión, que el entrenamiento craneocervical puede ser especialmente útil. Con algún signo de disfunción temporomandibular, la terapia manual y el ejercicio dirigidos a la ATM mejoraron más que los centrados solo en la región craneocervical. Aplicar antes el cribado vascular del marco IFOMPT. Para dosificar el entrenamiento craneocervical (Lluch 2020): test de flexión craneocervical en supino con biofeedback de presión inflado a 20 mmHg y cinco escalones de 2 mmHg (22–30), sin activar en exceso el esternocleidomastoideo ni los escalenos y sin retraer la cabeza; la resistencia se mide con apoyos repetidos de 5–10 s en cada nivel y el entrenamiento empieza en el nivel inferior al del fallo. La guía no fija series ni semanas (la manipulación 3–4 veces por semana, 12–18 sesiones, superó a una vez por semana a corto plazo, pero no a medio).
74. Lluch 2020, cap. 5.3 (Jull y Falla), p. 382
75. Lluch 2020, cap. 5.3 (Jull y Falla), pp. 372–373 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), pp. A13–A14, tabla 6)
76. Lluch 2020, cap. 5.3 (Jull y Falla), p. 379 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)
77. Lluch 2020, cap. 5.3 (Jull y Falla), p. 375 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A22)
78. Lluch 2020, cap. 5.3 (Jull y Falla), pp. 374–375
79. Lluch 2020, cap. 5.3 (Jull y Falla), p. 375
80. Lluch 2020, cap. 5.3 (Jull y Falla), p. 379 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A20)
81. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 308–309
82. Lluch 2020, cap. 5.1 (Fondevila Suárez), p. 313
83. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 313–314 · NICE NG59 (rec. 1.3.6)
84. Lluch 2020, cap. 5.1 (Fondevila Suárez), p. 310
85. Lluch 2020, cap. 5.1 (Fondevila Suárez), p. 311
86. Lluch 2020, cap. 5.1 (Fondevila Suárez), p. 317 y tabla 4 (consenso Delphi), p. 316
87. Lluch 2020, cap. 5.1 (Fondevila Suárez), tablas 4 y 6, pp. 316 y 323 (orientativo)
88. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 317–318
89. Lluch 2020, cap. 5.1 (Fondevila Suárez), tabla 5 (consenso Delphi), p. 319
90. Lluch 2020, cap. 5.1 (Fondevila Suárez), tablas 5 y 6, pp. 319 y 323
91. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 319–320 · NICE NG59 (rec. 1.3.1–1.3.3, derivación)
92. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 321–322 (criterio a del clúster de Laslett)
93. Lluch 2020, cap. 5.1 (Fondevila Suárez), p. 322
94. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 323–324
95. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 323–324 · Rathbone 2017 (Clin J Pain, fiabilidad)
96. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 211
97. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 210–211; Culvenor 2019 (Br J Sports Med 53:1268–78; revisión sistemática con metaanálisis, 63 estudios, 5397 rodillas sin síntomas ni lesiones)
98. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 209 y 220; Smith 2015 (Evid Based Med 20:88–97; metaanálisis bivariante, tabla 3); AAOS 2024 (guía de práctica clínica de patología meniscal aislada aguda, recomendación de exploración física)
99. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 209–210; Englund 2003 (Arthritis Rheum 48:2178–87; 155 meniscectomías frente a 68 controles, 16 años; RR 7,0, IC 95 %: 2,1–23,5)
100. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 194
101. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 194–195
102. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 206–207
103. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 192–193; Ophey 2025 (Knee Surg Sports Traumatol Arthrosc 33:457–469; guía multidisciplinar holandesa, módulo 4; certeza GRADE muy baja); Mendonça 2016 (J Orthop Sports Phys Ther 46:673–80; 43 deportistas de competición de voleibol, baloncesto, fútbol y carrera, con y sin dolor en el tendón rotuliano; referencia: ecografía)
104. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 192–193
105. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 215 y 220
106. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 215
107. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 215–216
108. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 211–212; Rennie y Saifuddin 2005 (Skeletal Radiol 34:395–8; revisión retrospectiva de 509 RM de rodillas con dolor)
109. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 211–212; Uysal 2015 (Clin Rheumatol 34:529–33; ecografía de 170 rodillas de 85 pacientes con artrosis sintomática)
110. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 212
111. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 208
112. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 222
113. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 216 y 221–222
114. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 216
115. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 219–220
116. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 219
117. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 197; Kazemi 2023 (Arch Acad Emerg Med 11:e30; revisión sistemática con metaanálisis univariante, 18 estudios, 6702 adultos); Sims 2020 (Eur Radiol 30:4438–46; metaanálisis bivariante, 8 estudios, 7385 adultos: S 99 %, E 49 %, LR− 0,07); Bachmann 2004 (Ann Intern Med 140:121–4; 6 estudios, 4249 adultos: S 98,5 %, E 48,6 %, LR− 0,05)
118. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 197
119. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 198
120. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 197–198
121. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 195
122. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 195–196
123. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 196
124. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 202
125. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 202–203
126. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 203
127. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 203–204
128. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 203–205
129. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 201
130. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 200–201
131. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 199
132. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 199; Mohr 2024 (StatPearls, NBK538194)
133. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 217
134. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 217 y 220
135. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 216–217
136. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 218
137. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 218 y 220
138. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 223
139. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 223–224
140. Karanasios 2022 (J Hand Ther 35:541–551; revisión sistemática, 24 estudios, 97 % con riesgo de sesgo alto o incierto; solo 2 estudios de exploración física) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 83 y 100 (la precisión diagnóstica del test no se conoce)
141. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 82 y 84
142. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84 y 101
143. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 101
144. Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 5) · Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 84
145. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 90 (medir la movilidad activa y pasiva del codo y el antebrazo y la sensación final; sin datos de precisión)
146. Reproducción del dolor medial con estrés en valgo dinámico. En el único estudio (O'Driscoll 2005; Zwerus 2018, tabla 4) fue más sensible que el valgo estático con dolor (100 % frente a 64,7 %). Test de valgo móvil (O'Driscoll 2005): hombro en abducción y rotación externa, valgo mantenido con el codo en flexión completa y extensión rápida; positivo si reproduce el dolor medial, máximo entre 120° y 70°. En 21 pacientes operados: S 100 % (17/17), E 75 % (3 de 4 controles). Lluch 2020 (p. 86) da las cifras invertidas (S 75 %, E 100 %). Zwerus 2018 (tabla 4) da las mismas cifras que el original, con LR+ 4 (IC 0,7–21,8, que cruza el 1); es el texto de la revisión el que las invierte, y de ahí las copia Lluch. Cuenta como hallazgo: la especificidad sale de solo 4 controles y el IC de la LR+ incluye el 1. La maniobra de ordeño es otra prueba (Zwerus 2018, tabla 5), sin estudios de precisión.
147. O'Driscoll 2005 (Am J Sports Med 33:231–239; resumen en PubMed) · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 86
148. Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tablas 4 y 5) · Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 86
149. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 86 y 101
150. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 87 y 100 · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4)
151. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 83, 85 y 100
152. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 87–88 y 100 · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4)
153. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 93 y 100
154. Park 2019 (Medicine 98:e15497): punto de máximo dolor en la línea radiocapitelar en 20 de 24 · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 83–84 y 100 (dolor localizado en la línea radiohumeral posterolateral: sospechar un problema intraarticular)
155. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 89 y 100
156. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 89
157. Devereaux y ElMaraghy 2013 (Am J Sports Med 41:1998–2004; cohorte), recogido en Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · O'Driscoll 2007 (Am J Sports Med 35:1865–1869; resumen en PubMed) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84–85 y 102
158. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84 y 102
159. Devereaux y ElMaraghy 2013 (Am J Sports Med 41:1998–2004; cohorte), recogido en Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 85 y 102
160. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 101
161. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 92 (la subluxación no es diagnóstica de neuropatía cubital)
162. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 92
163. Ochi 2012 (J Shoulder Elbow Surg 21:777–781; casos y controles) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 101
164. Ochi 2011 (J Hand Surg Am 36:782–787; resumen en PubMed) · Ochi 2012 (J Shoulder Elbow Surg 21:777–781) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 101
165. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 90–91 y 100
166. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 83 y 100
167. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 100
168. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 91 y 100
169. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84 y 103
170. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 103
171. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84–85 y 103
172. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 85–86, 88 y 103
173. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 86 y 103
174. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 89 · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 5)
175. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 81 y 103
176. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 102
177. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 102
178. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 91 y 102
179. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 94 y 100
180. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 100
181. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 94
182. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 94 y 101
183. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 94 (capítulo de libro: opinión de los autores, sin ensayos)
184. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 94–95
185. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 95
186. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 255–256
187. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 255
188. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 255; van Dijk 1996 (J Bone Joint Surg Br 78-B(6))
189. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 238, 254–258, 260, 263 y 285
190. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 262; Sman 2015 (Br J Sports Med, publicado en línea en 2013); Netterström-Wedin 2021 (Phys Ther Sport 49:214–26)
191. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 263
192. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 245, 268, 273 y 280
193. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 272
194. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 280
195. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 268
196. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 249
197. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 247 y 249
198. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 239–240
199. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 239
200. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 240–241
201. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 237 y 243; Reiman 2014 (J Athl Train 49:820–9)
202. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 243
203. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 242 y 244
204. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 237 y 242
205. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 237 y 243
206. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 237
207. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 237 y 244
208. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 244
209. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 243–244, 251–252 y 268
210. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 246
211. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 248
212. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 248–249; Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)
213. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 250
214. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 247 y 250
215. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 247 y 250–251; Tarjeta de consulta tobillo y pie (guía clínica de tobillo y pie, ap. 5 y 6)
216. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 247 y 252
217. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 252
218. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 253
219. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 252–253
220. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 257
221. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 257–259 y 263
222. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 258
223. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 254 y 258
224. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 259
225. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 260
226. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 261
227. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 263 y 285
228. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 264
229. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 260 y 264
230. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 285
231. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 265–266
232. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 266–267
233. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 265 y 267
234. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 270
235. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 271, 276–278 y 281
236. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 252–253 y 271–272
237. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 276
238. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 277
239. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 277
240. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 278
241. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 278–279
242. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 279
243. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 252 y 279
244. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 281; Mahadevan 2015 (J Foot Ankle Surg 54:549–53); Pitcher 2024 (Foot Ankle Orthop 9(4))
245. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 281
246. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 281; Menon y Rednam 2026 (StatPearls, «Gout»)
247. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 286
248. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 286
249. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 284 y 286
250. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 284
251. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 284–287
252. Bachmann 2003 (BMJ 326:417); Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 256–257
253. Hermena y Slane 2025 (StatPearls, «Ankle Fracture»); Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 255
254. Tumor (Lluch 2020, cap. 3.1 (Struyf), pp. 54 y 61; Lluch 2020, cap. 3.1.1 (Powell y Lewis), pp. 75–76): antecedente de cáncer, pérdida de peso inexplicada, dolor sin relación con el movimiento o implacable, dolor nocturno o en reposo con síntomas sistémicos, masa o deformidad inexplicada. Raros en clavícula distal y acromion; pensar en ellos si hay dolor nocturno + síntomas sistémicos.
255. Fractura o luxación no reducida (Lluch 2020, cap. 3.1 (Struyf), p. 54; Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75): traumatismo previo (caída sobre el hombro o el codo), pérdida aguda de movilidad, deformidad, osteoporosis. Ayuda en consulta: test de aprensión ósea; signo de percusión olécranon-manubrio (buen valor para luxación anterior y fracturas de clavícula y húmero).
256. Infección o sistémico (Lluch 2020, cap. 3.1 (Struyf), p. 54; Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 76): fiebre, sensación de estar enfermo, cambios en la piel (aspecto, erupciones, sudoración), hematomas inexplicados, dolor en otras partes del cuerpo. Preguntar siempre por el estado general reciente.
257. Lesión neurológica (Lluch 2020, cap. 3.1 (Struyf), p. 54; Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 76): déficit motor o sensitivo significativo, atrofia. Exploración neurológica breve: sensibilidad, fuerza y reflejos.
258. Infección (Lluch 2020, cap. 5.1, tabla 1): fiebre, infección bacteriana reciente, cirugía lumbar reciente, dolor nocturno, dolor que empeora con el tiempo, sin respuesta al tratamiento conservador, inmunosupresión o VIH
259. Caída o golpe reciente y el codo no llega a estirarse del todo: casi un 50 % de fracturas (Appelboam 2008; Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 94)
260. Deformidad del codo tras una caída (luxación), o mano dormida, fría o pálida: compromiso neurovascular (Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 93)
261. Niño pequeño que no mueve el brazo tras un tirón (pronación dolorosa): descartar una fractura o una infección (Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 94)
262. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1.1 (Powell y Lewis), pp. 73 y 75–76.
263. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), pp. 61 y 66; cap. 3.1.1 (Powell y Lewis), pp. 70–71.
264. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), p. 54; cap. 3.1.1 (Powell y Lewis), pp. 75–76.
265. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), p. 54.
266. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), p. 54; cap. 3.1.1 (Powell y Lewis), p. 76.
267. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), pp. 54 y 66–67; cap. 3.1.1 (Powell y Lewis), pp. 73 y 76.
268. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 146 y 148.
269. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 137; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 146.
270. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 147–148.
271. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 147.
272. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 139; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 147 y 152.
273. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 149.
274. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 148–149.
275. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 147 y 152; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 178.
276. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 131; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 152; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 158.
277. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 141; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 147.
278. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 146.
279. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), tabla 1, p. 383.
280. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), tabla 1, p. 383; cap. 5.3.1 (Hall, Luedtke, von Piekartz y Fernández de las Peñas), p. 410.
281. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), pp. 370–371 y tabla 1, p. 383.
282. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), p. 369 y tabla 1, p. 384.
283. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3.1 (Hall, Luedtke, von Piekartz y Fernández de las Peñas), «Serious pathology presenting with headache», p. 410.
284. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), tabla 1, p. 384; cap. 5.3.1 (Hall, Luedtke, von Piekartz y Fernández de las Peñas), pp. 410–411.
285. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), tabla 1, p. 384.
286. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.1 (Fondevila Suárez), tabla 1, p. 303.
287. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.1 (Fondevila Suárez), p. 301 y tabla 1, p. 303.
288. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.1 (Fondevila Suárez), tabla 1, p. 304.
289. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 224–225.
290. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 223–225.
291. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 203–205.
292. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 200.
293. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 196–198 y 205–206.
294. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 196–197.
295. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 219 y 221–222.
296. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 198, 217 y 223.
297. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 217–218 y 220.
298. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 198–199 y 205.
299. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 191, 201 y 213–214.
300. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.2 (Coombes y Bisset), pp. 86, 89 y 93–94.
301. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.2 (Coombes y Bisset), pp. 81, 87 y 93–94.
302. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.2 (Coombes y Bisset), pp. 90–92 y 101.
303. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.2 (Coombes y Bisset), pp. 91–92 y 100–102.
304. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.2 (Coombes y Bisset), pp. 89–90.
305. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.2 (Coombes y Bisset), pp. 90–91 y 100.
306. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 272.
307. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 254–257.
308. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 237 y 241–245.
309. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 268 y 272–273.
310. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 247–251.
311. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 235, 247, 252–253 y 278–280.
312. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 235, 252 y 287.
313. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 280–282.
314. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 264, 282 y 287.
315. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 235 y 287.
316. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 265 y 285–286.
317. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 287.
318. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 283.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h1 · Capsulitis Adhesiva | Test «Abducción pasiva glenohumeral <80°» | 4b · cita bajo el test | 1 |
| Hombro | h1 · Capsulitis Adhesiva | Test «Test de Rotación Externa (brazo neutro al lado, codo 90°)» (en `criterio`) | 4b · mención en el texto | 2 |
| Hombro | h1 · Capsulitis Adhesiva | Test «Test de Rotación Externa (brazo neutro al lado, codo 90°)» | 4b · cita bajo el test | 3 |
| Hombro | h1 · Capsulitis Adhesiva | Test «Restricción equivalente activa y pasiva (criterio de Bunker)» | 4b · cita bajo el test | 4 |
| Hombro | h1 · Capsulitis Adhesiva | Test «Test del dolor en la coracoides» | 4b · cita bajo el test | 1 |
| Hombro | h1 · Capsulitis Adhesiva | Test «Identificadores clínicos de fase precoz (Walmsley)» | 4b · cita bajo el test | 5 |
| Hombro | h1 · Capsulitis Adhesiva | Pronóstico | 5 · cita del pronóstico | 6 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Neer» (en `criterio`) | 4b · mención en el texto | 7 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Regla clínica de SAPS» | 4b · cita bajo el test | 8 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Pronóstico | 5 · cita del pronóstico | 9 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «External Rotation Lag Sign» (en `criterio`) | 4b · mención en el texto | 10 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Inspección» | 4b · cita bajo el test | 11 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Cluster B: debilidad en RE + edad ≥65 (puntuación de Litaker ≥4)» (en `criterio`) | 4b · mención en el texto | 12 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Signo de Hornblower» | 4b · cita bajo el test | 11 |
| Hombro | h3 · Rotura del Manguito Rotador | Pronóstico | 5 · cita del pronóstico | 13 |
| Hombro | h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Anterior: aprensión, recolocación y sorpresa en conjunto» | 4b · cita bajo el test | 14 |
| Hombro | h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Posterior: Jerk, Kim y signo de pinzamiento posterior agrupados» | 4b · cita bajo el test | 15 |
| Hombro | h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Inestabilidad multidireccional: surco + tests en una dirección» | 4b · cita bajo el test | 14 |
| Hombro | h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Pronóstico | 5 · cita del pronóstico | 14 |
| Hombro | h5 · Lesión Labral Superior (SLAP) | Test «Test de O'Brien (Active Compression)» (en `criterio`) | 4b · mención en el texto | 16 |
| Hombro | h5 · Lesión Labral Superior (SLAP) | Pronóstico | 5 · cita del pronóstico | 17 |
| Hombro | h6 · Disfunción Cervical con Dolor Referido a Hombro | Test «Test de Spurling (Compresión Foraminal)» (en `criterio`) | 4b · mención en el texto | 18 |
| Hombro | h6 · Disfunción Cervical con Dolor Referido a Hombro | Test «Test de Spurling (Compresión Foraminal)» | 4b · cita bajo el test | 19 |
| Hombro | h6 · Disfunción Cervical con Dolor Referido a Hombro | Test «Movilidad Glenohumeral Pasiva (PROM)» (en `criterio`) | 4b · mención en el texto | 20 |
| Hombro | h6 · Disfunción Cervical con Dolor Referido a Hombro | Test «Movilidad Glenohumeral Pasiva (PROM)» | 4b · cita bajo el test | 21 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Test de Aducción Cruzada (Cross-body Adduction)» (en `criterio`) | 4b · mención en el texto | 22 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Movilidad pasiva sin restricción; posible escalón» | 4b · cita bajo el test | 21 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» (en `criterio`) | 4b · mención en el texto | 23 |
| Hombro | h7 · Artropatía Acromioclavicular | Pronóstico | 5 · cita del pronóstico | 24 |
| Hombro | h8 · Discinesia Escapular | Test «Observación visual de asimetría escapular (winging, tilting)» (en `criterio`) | 4b · mención en el texto | 25 |
| Hombro | h8 · Discinesia Escapular | Test «Observación visual de asimetría escapular (winging, tilting)» | 4b · cita bajo el test | 26 |
| Hombro | h8 · Discinesia Escapular | Test «Test de Asistencia Escapular» | 4b · cita bajo el test | 9 |
| Hombro | h10 · Artrosis Glenohumeral | Test «Mayor edad + crepitación con rigidez activa = pasiva» | 4b · cita bajo el test | 21 |
| Hombro | h11 · Luxación Bloqueada o Fractura (→ Rx) | Test «Test de aprensión ósea y percusión olécranon-manubrio» | 4b · cita bajo el test | 8 |
| Hombro | h11 · Luxación Bloqueada o Fractura (→ Rx) | Pronóstico | 5 · cita del pronóstico | 27 |
| Hombro | — | `sistemas.1.banderasRojas.5` | 2 · mención en el texto | 254 |
| Hombro | — | `sistemas.7.banderasRojas.0` | 2 · mención en el texto | 255 |
| Hombro | — | `sistemas.8.banderasRojas.0` | 2 · mención en el texto | 256 |
| Hombro | — | `sistemas.9.banderasRojas.0` | 2 · mención en el texto | 257 |
| Hombro | — | Pregunta `h3` · Cáncer / Oncológico | 2 · razonamiento del cribado | 262 |
| Hombro | — | Pregunta `h4` · Cáncer / Oncológico | 2 · razonamiento del cribado | 263 |
| Hombro | — | Pregunta `h6` · Cáncer / Oncológico | 2 · razonamiento del cribado | 264 |
| Hombro | — | Pregunta `h_r2` · Renal / Urológico | 2 · razonamiento del cribado | 265 |
| Hombro | — | Pregunta `h_t1` · Traumático (Fractura o Luxación) | 2 · razonamiento del cribado | 264 |
| Hombro | — | Pregunta `h_i1` · Infección / Sistémico | 2 · razonamiento del cribado | 266 |
| Hombro | — | Pregunta `h_n1` · Neurológico | 2 · razonamiento del cribado | 267 |
| Cadera | ca1 · Artrosis de Cadera | Test «Apoyo monopodal (30 s)» | 4b · cita bajo el test | 28 |
| Cadera | ca1 · Artrosis de Cadera | Pronóstico | 5 · cita del pronóstico | 29 |
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test FABER (Flexión-Abducción-Rotación Externa)» | 4b · cita bajo el test | 30 |
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Dolor inguinal» | 4b · cita bajo el test | 31 |
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Pronóstico | 5 · cita del pronóstico | 32 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Longitud de paso» | 4b · cita bajo el test | 33 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Pronóstico | 5 · cita del pronóstico | 34 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Pronóstico | 5 · cita del pronóstico | 35 |
| Cadera | ca5 · Debilidad de Abductores de Cadera | Test «Test de Trendelenburg» | 4b · cita bajo el test | 36 |
| Cadera | ca5 · Debilidad de Abductores de Cadera | Test «Dinamometría manual (HHD) de abductores» | 4b · cita bajo el test | 37 |
| Cadera | ca6 · Disfunción de Control Neuromuscular de Cadera | Test «Test de Sentadilla Monopodal (Single-Leg Squat)» | 4b · cita bajo el test | 38 |
| Cadera | ca6 · Disfunción de Control Neuromuscular de Cadera | Test «Test de Step-Down» | 4b · cita bajo el test | 39 |
| Cadera | ca6 · Disfunción de Control Neuromuscular de Cadera | Test «Marcha de Trendelenburg (observación)» | 4b · cita bajo el test | 40 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Dolor no limitado a la línea media ni por encima de L5» | 4b · cita bajo el test | 41 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Cluster de Laslett: 3 o más de 5 tests de provocación positivos» | 4b · cita bajo el test | 42 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Thigh thrust» | 4b · cita bajo el test | 43 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Prueba del dedo (Fortin)» | 4b · cita bajo el test | 44 |
| Cadera | ca11 · Lesión Aguda de Ingle | Test «Palpación del grupo sospechoso (primero)» | 4b · cita bajo el test | 45 |
| Cadera | ca11 · Lesión Aguda de Ingle | Test «Resistencia del grupo sospechoso» | 4b · cita bajo el test | 46 |
| Cadera | ca11 · Lesión Aguda de Ingle | Test «Estiramiento del grupo sospechoso» | 4b · cita bajo el test | 46 |
| Cadera | ca11 · Lesión Aguda de Ingle | Pronóstico | 5 · cita del pronóstico | 47 |
| Cadera | ca12 · Ligamento Redondo e Inestabilidad | Test «Log roll» | 4b · cita bajo el test | 48 |
| Cadera | ca12 · Ligamento Redondo e Inestabilidad | Test «Movilidad aumentada» | 4b · cita bajo el test | 49 |
| Cadera | ca12 · Ligamento Redondo e Inestabilidad | Test «Episodio de fallo» | 4b · cita bajo el test | 31 |
| Cadera | ca12 · Ligamento Redondo e Inestabilidad | Pronóstico | 5 · cita del pronóstico | 50 |
| Cadera | ca13 · Condropatía de Cadera | Test «Cribado intraarticular y Thomas positivos» | 4b · cita bajo el test | 51 |
| Cadera | ca13 · Condropatía de Cadera | Test «Dolor en reposo y nocturno con síntomas mecánicos» | 4b · cita bajo el test | 52 |
| Cadera | ca13 · Condropatía de Cadera | Test «Rigidez» | 4b · cita bajo el test | 53 |
| Cadera | ca13 · Condropatía de Cadera | Test «IMC >25» | 4b · cita bajo el test | 31 |
| Cadera | ca13 · Condropatía de Cadera | Pronóstico | 5 · cita del pronóstico | 54 |
| Cadera | ca14 · Neuropatías de Cadera e Ingle | Test «Tinel del femorocutáneo (meralgia)» | 4b · cita bajo el test | 55 |
| Cadera | ca14 · Neuropatías de Cadera e Ingle | Test «Neurodinámico del femorocutáneo» | 4b · cita bajo el test | 37 |
| Cadera | ca14 · Neuropatías de Cadera e Ingle | Test «Obturador: neurodinámico, sensibilidad del muslo medial y fuerza de aductores» | 4b · cita bajo el test | 37 |
| Cadera | ca14 · Neuropatías de Cadera e Ingle | Test «Arch and twist de pie» | 4b · cita bajo el test | 37 |
| Cadera | ca14 · Neuropatías de Cadera e Ingle | Test «Pudendo: dolor perineal al sentarse o en bici» | 4b · cita bajo el test | 56 |
| Cadera | ca14 · Neuropatías de Cadera e Ingle | Pronóstico | 5 · cita del pronóstico | 37 |
| Cadera | ca15 · Sensibilización Central | Test «Dolor multifocal, referido y extenso» | 4b · cita bajo el test | 57 |
| Cadera | ca15 · Sensibilización Central | Test «Dolor en las AVD» | 4b · cita bajo el test | 58 |
| Cadera | ca15 · Sensibilización Central | Test «Fatiga y mal sueño» | 4b · cita bajo el test | 59 |
| Cadera | ca15 · Sensibilización Central | Test «Dificultades de memoria» | 4b · cita bajo el test | 59 |
| Cadera | ca15 · Sensibilización Central | Test «Más comorbilidad; intolerancia al estrés, ansiedad o depresión» | 4b · cita bajo el test | 59 |
| Cadera | ca16 · Dolor Inguinal Relacionado con el Aductor | Test «Palpación dolorosa de aductores + squeeze doloroso» | 4b · cita bajo el test | 60 |
| Cadera | ca16 · Dolor Inguinal Relacionado con el Aductor | Test «Estiramiento pasivo de aductores» | 4b · cita bajo el test | 61 |
| Cadera | ca16 · Dolor Inguinal Relacionado con el Aductor | Pronóstico | 5 · cita del pronóstico | 62 |
| Cadera | ca17 · Dolor Inguinal Relacionado con el Psoas Ilíaco | Test «Palpación dolorosa supra o infrainguinal» | 4b · cita bajo el test | 60 |
| Cadera | ca17 · Dolor Inguinal Relacionado con el Psoas Ilíaco | Test «Flexión resistida con cadera y rodilla a 90°» | 4b · cita bajo el test | 63 |
| Cadera | ca17 · Dolor Inguinal Relacionado con el Psoas Ilíaco | Test «Flexión resistida o extensión pasiva en Thomas modificado» | 4b · cita bajo el test | 63 |
| Cadera | ca17 · Dolor Inguinal Relacionado con el Psoas Ilíaco | Pronóstico | 5 · cita del pronóstico | 64 |
| Cadera | ca18 · Dolor Inguinal Relacionado con el Canal Inguinal | Test «Dolor en la región del canal + palpación dolorosa del canal, sin hernia palpable» | 4b · cita bajo el test | 60 |
| Cadera | ca18 · Dolor Inguinal Relacionado con el Canal Inguinal | Test «Sit-up recto u oblicuo resistido» | 4b · cita bajo el test | 63 |
| Cadera | ca18 · Dolor Inguinal Relacionado con el Canal Inguinal | Test «Valsalva, tos o estornudo» | 4b · cita bajo el test | 65 |
| Cadera | ca18 · Dolor Inguinal Relacionado con el Canal Inguinal | Test «Flexión resistida en Thomas modificado» | 4b · cita bajo el test | 63 |
| Cadera | ca18 · Dolor Inguinal Relacionado con el Canal Inguinal | Pronóstico | 5 · cita del pronóstico | 66 |
| Cadera | ca19 · Dolor Inguinal Relacionado con el Pubis | Test «Palpación dolorosa de la sínfisis y el hueso adyacente» | 4b · cita bajo el test | 60 |
| Cadera | ca19 · Dolor Inguinal Relacionado con el Pubis | Test «Resistencia abdominal y squeeze» | 4b · cita bajo el test | 67 |
| Cadera | ca19 · Dolor Inguinal Relacionado con el Pubis | Pronóstico | 5 · cita del pronóstico | 62 |
| Cadera | — | Pregunta `c5` · Cáncer / Oncológico | 2 · razonamiento del cribado | 268 |
| Cadera | — | Pregunta `ca_on2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 269 |
| Cadera | — | Pregunta `ca_on3` · Cáncer / Oncológico | 2 · razonamiento del cribado | 268 |
| Cadera | — | Pregunta `ca_on4` · Cáncer / Oncológico | 2 · razonamiento del cribado | 270 |
| Cadera | — | Pregunta `ca_u3` · Urogenital / Renal | 2 · razonamiento del cribado | 271 |
| Cadera | — | Pregunta `c4` · Gastrointestinal | 2 · razonamiento del cribado | 271 |
| Cadera | — | Pregunta `ca_gi2` · Gastrointestinal | 2 · razonamiento del cribado | 271 |
| Cadera | — | Pregunta `ca_gi3` · Gastrointestinal | 2 · razonamiento del cribado | 272 |
| Cadera | — | Pregunta `ca_os1` · Óseo / Desarrollo | 2 · razonamiento del cribado | 273 |
| Cadera | — | Pregunta `ca_os2` · Óseo / Desarrollo | 2 · razonamiento del cribado | 274 |
| Cadera | — | Pregunta `ca_os3` · Óseo / Desarrollo | 2 · razonamiento del cribado | 275 |
| Cadera | — | Pregunta `ca_os4` · Óseo / Desarrollo | 2 · razonamiento del cribado | 276 |
| Cadera | — | Pregunta `ca_in1` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 271 |
| Cadera | — | Pregunta `ca_in2` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 277 |
| Cadera | — | Pregunta `ca_in3` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 278 |
| Cervical | ce2 · Disfunción Neuromuscular Cervical | Test «Test de Flexión Craneocervical (CCFT) con biofeedback de presión» | 4b · cita bajo el test | 68 |
| Cervical | ce2 · Disfunción Neuromuscular Cervical | Test «Test de Reposicionamiento Cabeza-Neutro» | 4b · cita bajo el test | 69 |
| Cervical | ce2 · Disfunción Neuromuscular Cervical | Dosis (en el texto) | 5 · mención en el texto | 70 |
| Cervical | ce2 · Disfunción Neuromuscular Cervical | Pauta de tratamiento | 5 · cita de la pauta | 71 |
| Cervical | ce3 · Radiculopatía Cervical | Test «Reflejos tendinosos (bíceps C6, tríceps C7)» | 4b · cita bajo el test | 72 |
| Cervical | ce4 · Cefalea Cervicogénica | Dosis (en el texto) | 5 · mención en el texto | 73 |
| Cervical | ce4 · Cefalea Cervicogénica | Pauta de tratamiento | 5 · cita de la pauta | 71 |
| Cervical | ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Test «ROM Cervical Activo (reducción significativa)» | 4b · cita bajo el test | 74 |
| Cervical | ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Test «Síntomas de hiperalerta / PTSD» | 4b · cita bajo el test | 75 |
| Cervical | ce6 · Debilidad Muscular Cérvico-Escapular | Test «Fuerza de Flexión Cervical (dinamometría)» | 4b · cita bajo el test | 76 |
| Cervical | ce6 · Debilidad Muscular Cérvico-Escapular | Test «Fuerza de Extensión Cervical (dinamometría)» | 4b · cita bajo el test | 76 |
| Cervical | ce7 · Dolor Mecánico Cervical Inespecífico Crónico | Test «ROM Cervical Activo (reducción en todas las direcciones)» | 4b · cita bajo el test | 77 |
| Cervical | ce7 · Dolor Mecánico Cervical Inespecífico Crónico | Test «Test de reposicionamiento cabeza-neutro» | 4b · cita bajo el test | 69 |
| Cervical | ce9 · Disfunción Postural Cérvico-Torácica | Test «Evaluación postural de cabeza adelantada (Forward Head Posture)» | 4b · cita bajo el test | 78 |
| Cervical | ce9 · Disfunción Postural Cérvico-Torácica | Test «Evaluación de cifosis torácica» | 4b · cita bajo el test | 79 |
| Cervical | ce11 · Fatiga Muscular Cérvico-Escapular | Test «Test de resistencia de flexores cervicales profundos» | 4b · cita bajo el test | 80 |
| Cervical | ce11 · Fatiga Muscular Cérvico-Escapular | Test «Evaluación de fatiga en actividades funcionales prolongadas» | 4b · cita bajo el test | 78 |
| Cervical | — | Pregunta `cv2` · Cardiovascular | 2 · razonamiento del cribado | 279 |
| Cervical | — | Pregunta `cv_ar1` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 280 |
| Cervical | — | Pregunta `cv_ar2` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 281 |
| Cervical | — | Pregunta `cv_ar3` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 282 |
| Cervical | — | Pregunta `cv_ar4` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 283 |
| Cervical | — | Pregunta `cv_n1` · Médula / Estructural | 2 · razonamiento del cribado | 284 |
| Cervical | — | Pregunta `cv_n3` · Médula / Estructural | 2 · razonamiento del cribado | 285 |
| Lumbar | lu3 · Dolor Radicular Lumbar | Pronóstico | 5 · cita del pronóstico | 81 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Déficits sensoriales (L3-S1)» | 4b · cita bajo el test | 82 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Pronóstico | 5 · cita del pronóstico | 83 |
| Lumbar | lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Test «Fuerza por miotomas L1–S2» | 4b · cita bajo el test | 84 |
| Lumbar | lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Pronóstico | 5 · cita del pronóstico | 85 |
| Lumbar | lu6 · Dolor Lumbar Discogénico | Test «Preferencia direccional» | 4b · cita bajo el test | 86 |
| Lumbar | lu6 · Dolor Lumbar Discogénico | Test «Observación: espalda plana o shift lateral» | 4b · cita bajo el test | 87 |
| Lumbar | lu6 · Dolor Lumbar Discogénico | Pronóstico | 5 · cita del pronóstico | 88 |
| Lumbar | lu7 · Dolor Lumbar Facetario | Test «PA unilateral dolorosa o con menos movilidad» | 4b · cita bajo el test | 89 |
| Lumbar | lu7 · Dolor Lumbar Facetario | Test «Sin signos radiculares y sin alivio con repetidos» | 4b · cita bajo el test | 90 |
| Lumbar | lu7 · Dolor Lumbar Facetario | Pronóstico | 5 · cita del pronóstico | 91 |
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Test «No centraliza con movimientos repetidos» | 4b · cita bajo el test | 92 |
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Pronóstico | 5 · cita del pronóstico | 93 |
| Lumbar | lu9 · Síndrome de Dolor Miofascial Lumbar | Test «Punto hipersensible dentro de la banda» | 4b · cita bajo el test | 94 |
| Lumbar | lu9 · Síndrome de Dolor Miofascial Lumbar | Test «El paciente reconoce el dolor provocado» | 4b · cita bajo el test | 95 |
| Lumbar | — | `sistemas.6.banderasRojas.0` | 2 · mención en el texto | 258 |
| Lumbar | — | Pregunta `l_u4` · Urogenital / Renal | 2 · razonamiento del cribado | 286 |
| Lumbar | — | Pregunta `l_e7` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 287 |
| Lumbar | — | Pregunta `l_inf1` · Infección vertebral | 2 · razonamiento del cribado | 288 |
| Rodilla | ro1 · Artrosis de Rodilla | Test «Rango disminuido, hinchazón persistente, debilidad de cuádriceps» | 4b · cita bajo el test | 96 |
| Rodilla | ro1 · Artrosis de Rodilla | Pronóstico | 5 · cita del pronóstico | 97 |
| Rodilla | ro2 · Lesión Meniscal | Test «Test de Thessaly» | 4b · cita bajo el test | 98 |
| Rodilla | ro2 · Lesión Meniscal | Pronóstico | 5 · cita del pronóstico | 99 |
| Rodilla | ro3 · Dolor Patelofemoral (Síndrome) | Test «Palpación alrededor de la FR, sobre todo de las facetas» | 4b · cita bajo el test | 100 |
| Rodilla | ro3 · Dolor Patelofemoral (Síndrome) | Pronóstico | 5 · cita del pronóstico | 101 |
| Rodilla | ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Pronóstico | 5 · cita del pronóstico | 102 |
| Rodilla | ro5 · Tendinopatía Rotuliana | Test «Dolor durante sentadilla en tabla inclinada (decline squat)» | 4b · cita bajo el test | 103 |
| Rodilla | ro5 · Tendinopatía Rotuliana | Pronóstico | 5 · cita del pronóstico | 104 |
| Rodilla | ro6 · Síndrome de la Banda Iliotibial | Test «Test de Ober» | 4b · cita bajo el test | 105 |
| Rodilla | ro6 · Síndrome de la Banda Iliotibial | Test «Test de Compresión de Noble» | 4b · cita bajo el test | 105 |
| Rodilla | ro6 · Síndrome de la Banda Iliotibial | Test «Palpación a lo largo de la cintilla» | 4b · cita bajo el test | 105 |
| Rodilla | ro6 · Síndrome de la Banda Iliotibial | Test «Step-down lateral» | 4b · cita bajo el test | 106 |
| Rodilla | ro6 · Síndrome de la Banda Iliotibial | Test «Test de Thomas» | 4b · cita bajo el test | 105 |
| Rodilla | ro6 · Síndrome de la Banda Iliotibial | Pronóstico | 5 · cita del pronóstico | 107 |
| Rodilla | ro7 · Bursitis de la Pata de Ganso | Test «Dolor y tumefacción en cara medial de rodilla (inserción pata de ganso)» | 4b · cita bajo el test | 108 |
| Rodilla | ro7 · Bursitis de la Pata de Ganso | Test «Ecografía o RMN confirmatoria» | 4b · cita bajo el test | 109 |
| Rodilla | ro7 · Bursitis de la Pata de Ganso | Test «Flexión de rodilla en carga y palpación de la pata de ganso» | 4b · cita bajo el test | 110 |
| Rodilla | ro8 · Lesión del Ligamento Colateral Medial (LCM) | Pronóstico | 5 · cita del pronóstico | 111 |
| Rodilla | ro9 · Lesión del Ligamento Cruzado Posterior (LCP) | Test «Cajón posterior a 90° de flexión» | 4b · cita bajo el test | 112 |
| Rodilla | ro9 · Lesión del Ligamento Cruzado Posterior (LCP) | Test «Signo del sag posterior» | 4b · cita bajo el test | 112 |
| Rodilla | ro9 · Lesión del Ligamento Cruzado Posterior (LCP) | Test «Test activo del cuádriceps» | 4b · cita bajo el test | 112 |
| Rodilla | ro9 · Lesión del Ligamento Cruzado Posterior (LCP) | Pronóstico | 5 · cita del pronóstico | 113 |
| Rodilla | ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Test «Hinchazón y equimosis laterales; palpación dolorosa del ligamento» | 4b · cita bajo el test | 114 |
| Rodilla | ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Test «Varo forzado a unos 30° de flexión» | 4b · cita bajo el test | 114 |
| Rodilla | ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Test «Marcha con empuje en varo» | 4b · cita bajo el test | 115 |
| Rodilla | ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Test «Test del dial (esquina posterolateral)» | 4b · cita bajo el test | 116 |
| Rodilla | ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Test «Cajón posterolateral» | 4b · cita bajo el test | 116 |
| Rodilla | ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Test «Test de recurvatum» | 4b · cita bajo el test | 116 |
| Rodilla | ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Pronóstico | 5 · cita del pronóstico | 113 |
| Rodilla | ro11 · Fracturas (Rótula o Meseta Tibial) | Test «Regla de Ottawa antes de nada» | 4b · cita bajo el test | 117 |
| Rodilla | ro11 · Fracturas (Rótula o Meseta Tibial) | Test «Rótula: dolor localizado, escalón, dolor con extensión resistida» | 4b · cita bajo el test | 118 |
| Rodilla | ro11 · Fracturas (Rótula o Meseta Tibial) | Test «Meseta: dolor exquisito sobre el foco y función neurovascular» | 4b · cita bajo el test | 119 |
| Rodilla | ro11 · Fracturas (Rótula o Meseta Tibial) | Pronóstico | 5 · cita del pronóstico | 120 |
| Rodilla | ro12 · Inestabilidad Rotuliana | Test «Tests de estrés tibiofemoral normales» | 4b · cita bajo el test | 121 |
| Rodilla | ro12 · Inestabilidad Rotuliana | Test «Movilidad rotuliana excesiva» | 4b · cita bajo el test | 122 |
| Rodilla | ro12 · Inestabilidad Rotuliana | Test «Test de aprensión» | 4b · cita bajo el test | 123 |
| Rodilla | ro12 · Inestabilidad Rotuliana | Pronóstico | 5 · cita del pronóstico | 122 |
| Rodilla | ro13 · Síndrome de la Grasa de Hoffa | Test «Observación: genu recurvatum» | 4b · cita bajo el test | 124 |
| Rodilla | ro13 · Síndrome de la Grasa de Hoffa | Test «Test de Hoffa» | 4b · cita bajo el test | 124 |
| Rodilla | ro13 · Síndrome de la Grasa de Hoffa | Pronóstico | 5 · cita del pronóstico | 125 |
| Rodilla | ro14 · Bursitis Pre e Infrarrotuliana | Test «Fiebre >37,7 °C (séptica → urgencia)» | 4b · cita bajo el test | 126 |
| Rodilla | ro14 · Bursitis Pre e Infrarrotuliana | Test «Hinchazón en la propia bursa y arrodillarse intolerable» | 4b · cita bajo el test | 127 |
| Rodilla | ro14 · Bursitis Pre e Infrarrotuliana | Pronóstico | 5 · cita del pronóstico | 128 |
| Rodilla | ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Test «Cadera primero» | 4b · cita bajo el test | 129 |
| Rodilla | ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Test «Palpación de la tuberosidad tibial o del polo inferior de la rótula» | 4b · cita bajo el test | 130 |
| Rodilla | ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Test «Sentadillas, escaleras, step-down, saltos y extensión resistida» | 4b · cita bajo el test | 130 |
| Rodilla | ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Pronóstico | 5 · cita del pronóstico | 130 |
| Rodilla | ro16 · Lesión Osteocondral | Test «Palpación de la zona afectada» | 4b · cita bajo el test | 131 |
| Rodilla | ro16 · Lesión Osteocondral | Test «Marcha antiálgica» | 4b · cita bajo el test | 131 |
| Rodilla | ro16 · Lesión Osteocondral | Test «Signos de inestabilidad: derrame y bloqueo» | 4b · cita bajo el test | 132 |
| Rodilla | ro18 · Disfunción de la Articulación Tibioperonea Proximal | Test «Presión directa sobre la cabeza del peroné y movilidad accesoria» | 4b · cita bajo el test | 133 |
| Rodilla | ro18 · Disfunción de la Articulación Tibioperonea Proximal | Test «Movimiento de rodilla con isquiotibiales en tensión y movimiento de tobillo» | 4b · cita bajo el test | 133 |
| Rodilla | ro18 · Disfunción de la Articulación Tibioperonea Proximal | Test «Cabeza del peroné prominente, hipermovilidad o luxación» | 4b · cita bajo el test | 134 |
| Rodilla | ro18 · Disfunción de la Articulación Tibioperonea Proximal | Pronóstico | 5 · cita del pronóstico | 135 |
| Rodilla | ro19 · Neuropatía del Nervio Peroneo Común | Test «Marcha en steppage» | 4b · cita bajo el test | 136 |
| Rodilla | ro19 · Neuropatía del Nervio Peroneo Común | Test «Sensibilidad en la cara lateral inferior de la pierna y el dorso del pie» | 4b · cita bajo el test | 136 |
| Rodilla | ro19 · Neuropatía del Nervio Peroneo Común | Test «Fuerza de eversión y de flexión dorsal de tobillo y dedos» | 4b · cita bajo el test | 136 |
| Rodilla | ro19 · Neuropatía del Nervio Peroneo Común | Test «Tinel cerca de la cabeza del peroné» | 4b · cita bajo el test | 136 |
| Rodilla | ro19 · Neuropatía del Nervio Peroneo Común | Test «Prueba neurodinámica con sesgo peroneo» | 4b · cita bajo el test | 137 |
| Rodilla | ro19 · Neuropatía del Nervio Peroneo Común | Pronóstico | 5 · cita del pronóstico | 136 |
| Rodilla | ro20 · Quiste Poplíteo (Baker) | Test «Signos de patología meniscal o condral» | 4b · cita bajo el test | 138 |
| Rodilla | ro20 · Quiste Poplíteo (Baker) | Test «Signo de Foucher» | 4b · cita bajo el test | 138 |
| Rodilla | ro20 · Quiste Poplíteo (Baker) | Pronóstico | 5 · cita del pronóstico | 139 |
| Rodilla | — | Pregunta `r_v2` · Vascular | 2 · razonamiento del cribado | 289 |
| Rodilla | — | Pregunta `r_v3` · Vascular | 2 · razonamiento del cribado | 290 |
| Rodilla | — | Pregunta `r_i3` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 291 |
| Rodilla | — | Pregunta `r3` · Oncológico / Hematológico | 2 · razonamiento del cribado | 292 |
| Rodilla | — | Pregunta `ro_t1` · Traumático / Mecánico | 2 · razonamiento del cribado | 293 |
| Rodilla | — | Pregunta `ro_t2` · Traumático / Mecánico | 2 · razonamiento del cribado | 294 |
| Rodilla | — | Pregunta `ro_t3` · Traumático / Mecánico | 2 · razonamiento del cribado | 295 |
| Rodilla | — | Pregunta `ro_t4` · Traumático / Mecánico | 2 · razonamiento del cribado | 296 |
| Rodilla | — | Pregunta `ro_t5` · Traumático / Mecánico | 2 · razonamiento del cribado | 297 |
| Rodilla | — | Pregunta `ro_t6` · Traumático / Mecánico | 2 · razonamiento del cribado | 298 |
| Rodilla | — | Pregunta `ro_p1` · Niño o Adolescente | 2 · razonamiento del cribado | 299 |
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Test de Cozen (extensión resistida de muñeca)» | 4b · cita bajo el test | 140 |
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Fuerza de prensión sin dolor (dinamómetro)» | 4b · cita bajo el test | 141 |
| Codo | co2 · Tendinopatía Medial (Epicondilalgia Medial / Codo de Golfista) | Test «Dolor a la palpación del epicóndilo medial» | 4b · cita bajo el test | 142 |
| Codo | co2 · Tendinopatía Medial (Epicondilalgia Medial / Codo de Golfista) | Test «Dolor con flexión resistida de antebrazo y pronación» | 4b · cita bajo el test | 143 |
| Codo | co2 · Tendinopatía Medial (Epicondilalgia Medial / Codo de Golfista) | Test «Test de Polk (medial)» | 4b · cita bajo el test | 144 |
| Codo | co3 · Rigidez del Codo (Contractura Postraumática o Capsular) | Test «Limitación activa Y pasiva comparada con lado sano» | 4b · cita bajo el test | 145 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Test de valgo móvil (moving valgus stress test)» (en `criterio`) | 4b · mención en el texto | 146 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Test de valgo móvil (moving valgus stress test)» | 4b · cita bajo el test | 147 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Test de valgo estático (dolor)» | 4b · cita bajo el test | 148 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Test de valgo estático (laxitud)» | 4b · cita bajo el test | 148 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Dolor a la palpación justo distal al epicóndilo medial» | 4b · cita bajo el test | 149 |
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Test «Test de cajón posterolateral / Test de pivote lateral» | 4b · cita bajo el test | 150 |
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Test «Dolor lateral a la palpación (complejo colateral lateral)» | 4b · cita bajo el test | 151 |
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Test «Test de flexión en suelo (push-up) con el antebrazo en supinación» | 4b · cita bajo el test | 150 |
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Test «Test de recolocación en la mesa (table-top relocation)» | 4b · cita bajo el test | 152 |
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Test «Dolor y laxitud con estrés en varo» | 4b · cita bajo el test | 153 |
| Codo | co6 · Dolor Radiohumeral / Pinzamiento Posterolateral por Plica Radiocapitelar | Test «Dolor posterolateral en línea articular radiocapitelar a la palpación» | 4b · cita bajo el test | 154 |
| Codo | co6 · Dolor Radiohumeral / Pinzamiento Posterolateral por Plica Radiocapitelar | Test «PEPPER (palpación-extensión de la radiocapitelar)» | 4b · cita bajo el test | 155 |
| Codo | co6 · Dolor Radiohumeral / Pinzamiento Posterolateral por Plica Radiocapitelar | Test «SALT (supinación y dolor anterolateral)» | 4b · cita bajo el test | 155 |
| Codo | co6 · Dolor Radiohumeral / Pinzamiento Posterolateral por Plica Radiocapitelar | Test «Test de flexión-pronación» | 4b · cita bajo el test | 156 |
| Codo | co6 · Dolor Radiohumeral / Pinzamiento Posterolateral por Plica Radiocapitelar | Test «Deslizamientos accesorios de la cabeza del radio» | 4b · cita bajo el test | 155 |
| Codo | co7 · Rotura Distal del Bíceps | Test «Test del Gancho (Hook Test)» | 4b · cita bajo el test | 157 |
| Codo | co7 · Rotura Distal del Bíceps | Test «Pérdida del contorno normal del brazo y tendón distal no palpable» | 4b · cita bajo el test | 158 |
| Codo | co7 · Rotura Distal del Bíceps | Test «Pronación pasiva del antebrazo (PFP) / test de pronosupinación pasiva» | 4b · cita bajo el test | 159 |
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Test de Tinel en túnel cubital» | 4b · cita bajo el test | 160 |
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Evaluación de subluxación del nervio cubital» | 4b · cita bajo el test | 161 |
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Electrodiagnóstico (velocidad de conducción nerviosa)» | 4b · cita bajo el test | 162 |
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Test de flexión del codo» | 4b · cita bajo el test | 163 |
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Test de rotación interna del hombro con flexión del codo (SIRT)» | 4b · cita bajo el test | 164 |
| Codo | co9 · Neuropatía Radial en el Codo (Síndrome del Túnel Radial / del Nervio Interóseo Posterior) | Test «Dolor en antebrazo proximal (NO en epicóndilo lateral)» | 4b · cita bajo el test | 165 |
| Codo | co9 · Neuropatía Radial en el Codo (Síndrome del Túnel Radial / del Nervio Interóseo Posterior) | Test «Dolor con extensión resistida del 3er dedo» | 4b · cita bajo el test | 166 |
| Codo | co9 · Neuropatía Radial en el Codo (Síndrome del Túnel Radial / del Nervio Interóseo Posterior) | Test «Dolor con supinación resistida con el codo extendido» | 4b · cita bajo el test | 167 |
| Codo | co9 · Neuropatía Radial en el Codo (Síndrome del Túnel Radial / del Nervio Interóseo Posterior) | Test «Neurodinámica del nervio radial (ULNT radial)» | 4b · cita bajo el test | 167 |
| Codo | co9 · Neuropatía Radial en el Codo (Síndrome del Túnel Radial / del Nervio Interóseo Posterior) | Test «Debilidad de la extensión de los dedos (síndrome del nervio interóseo posterior)» | 4b · cita bajo el test | 168 |
| Codo | co10 · Tendinopatía o Rotura del Tríceps | Test «Dolor con la extensión activa o resistida del codo» | 4b · cita bajo el test | 169 |
| Codo | co10 · Tendinopatía o Rotura del Tríceps | Test «Dolor a la palpación de la inserción del tríceps» | 4b · cita bajo el test | 170 |
| Codo | co10 · Tendinopatía o Rotura del Tríceps | Test «Defecto palpable e hinchazón (rotura)» | 4b · cita bajo el test | 171 |
| Codo | co11 · Pinzamiento Posterior o Posteromedial (Sobrecarga en Extensión-Valgo) | Test «Dolor en la extensión terminal del codo» | 4b · cita bajo el test | 172 |
| Codo | co11 · Pinzamiento Posterior o Posteromedial (Sobrecarga en Extensión-Valgo) | Test «Déficit fijo de extensión» | 4b · cita bajo el test | 173 |
| Codo | co11 · Pinzamiento Posterior o Posteromedial (Sobrecarga en Extensión-Valgo) | Test «Arm bar test» | 4b · cita bajo el test | 174 |
| Codo | co11 · Pinzamiento Posterior o Posteromedial (Sobrecarga en Extensión-Valgo) | Test «Test de sobrecarga en valgo (valgus overload)» | 4b · cita bajo el test | 174 |
| Codo | co12 · Fractura de Estrés del Olécranon | Test «Dolor con la extensión del codo, sin traumatismo» | 4b · cita bajo el test | 175 |
| Codo | co12 · Fractura de Estrés del Olécranon | Test «Pérdida de la extensión terminal» | 4b · cita bajo el test | 170 |
| Codo | co12 · Fractura de Estrés del Olécranon | Test «TC (si la radiografía no es concluyente)» | 4b · cita bajo el test | 170 |
| Codo | co13 · Neuropatía del Mediano en el Codo (Síndrome del Pronador / del Nervio Interóseo Anterior) | Test «Dolor a la palpación del pronador redondo» | 4b · cita bajo el test | 176 |
| Codo | co13 · Neuropatía del Mediano en el Codo (Síndrome del Pronador / del Nervio Interóseo Anterior) | Test «Síntomas con la pronación resistida con el codo extendido» | 4b · cita bajo el test | 176 |
| Codo | co13 · Neuropatía del Mediano en el Codo (Síndrome del Pronador / del Nervio Interóseo Anterior) | Test «Debilidad del flexor largo del pulgar, del flexor profundo del 2.º y 3.º dedo, del flexor superficial y del pronador redondo» | 4b · cita bajo el test | 176 |
| Codo | co13 · Neuropatía del Mediano en el Codo (Síndrome del Pronador / del Nervio Interóseo Anterior) | Test «Neurodinámica del nervio mediano (ULNT mediano)» | 4b · cita bajo el test | 177 |
| Codo | co13 · Neuropatía del Mediano en el Codo (Síndrome del Pronador / del Nervio Interóseo Anterior) | Test «Debilidad aislada del flexor profundo del 2.º y 3.º dedo y del flexor largo del pulgar (interóseo anterior)» | 4b · cita bajo el test | 178 |
| Codo | co14 · Pronación Dolorosa (Subluxación de la Cabeza del Radio en el Niño) | Test «Tirón del brazo extendido en un menor de 5 años, sin caída» | 4b · cita bajo el test | 179 |
| Codo | co14 · Pronación Dolorosa (Subluxación de la Cabeza del Radio en el Niño) | Test «Dolor y limitación de la pronación y de la extensión del codo» | 4b · cita bajo el test | 180 |
| Codo | co15 · Codo de la Liga Infantil (Apofisitis o Avulsión del Epicóndilo Medial en el Lanzador Joven) | Test «Dolor medial con el lanzamiento en un deportista con el esqueleto inmaduro» | 4b · cita bajo el test | 181 |
| Codo | co15 · Codo de la Liga Infantil (Apofisitis o Avulsión del Epicóndilo Medial en el Lanzador Joven) | Test «Dolor y laxitud con el estrés en valgo o el valgo móvil» | 4b · cita bajo el test | 182 |
| Codo | co15 · Codo de la Liga Infantil (Apofisitis o Avulsión del Epicóndilo Medial en el Lanzador Joven) | Pauta de tratamiento | 5 · cita de la pauta | 183 |
| Codo | co16 · Enfermedad de Panner / Osteocondritis Disecante del Capítulo | Test «Dolor lateral sordo e hinchazón de inicio insidioso entre los 7 y los 12 años» | 4b · cita bajo el test | 184 |
| Codo | co16 · Enfermedad de Panner / Osteocondritis Disecante del Capítulo | Test «Imagen: radiografía o RM» | 4b · cita bajo el test | 185 |
| Codo | — | `sistemas.1.banderasRojas.0` | 2 · mención en el texto | 259 |
| Codo | — | `sistemas.1.banderasRojas.1` | 2 · mención en el texto | 260 |
| Codo | — | `sistemas.1.banderasRojas.2` | 2 · mención en el texto | 261 |
| Codo | — | Pregunta `co_t1` · Traumático (Fractura o Luxación) | 2 · razonamiento del cribado | 300 |
| Codo | — | Pregunta `co_t2` · Traumático (Fractura o Luxación) | 2 · razonamiento del cribado | 301 |
| Codo | — | Pregunta `co4b` · Vascular / Neurológica | 2 · razonamiento del cribado | 302 |
| Codo | — | Pregunta `co3` · Vascular / Neurológica | 2 · razonamiento del cribado | 303 |
| Codo | — | Pregunta `co1` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 304 |
| Codo | — | Pregunta `co2` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 305 |
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «Reglas de Ottawa (si no carga)» | 4b · cita bajo el test | 186 |
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «LPAA: palpar y estirar» | 4b · cita bajo el test | 187 |
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «LPC: palpar y estirar» | 4b · cita bajo el test | 187 |
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «Cajón anterior (a los 4–6 días)» | 4b · cita bajo el test | 188 |
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Pronóstico | 5 · cita del pronóstico | 189 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» | 4b · cita bajo el test | 190 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Squeeze test» | 4b · cita bajo el test | 190 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Pronóstico | 5 · cita del pronóstico | 191 |
| Tobillo y pie | tp3 · Rotura del Aquiles | Pronóstico | 5 · cita del pronóstico | 192 |
| Tobillo y pie | tp4 · Lesión de Lisfranc | Test «Neurovascular y cinco P» | 4b · cita bajo el test | 193 |
| Tobillo y pie | tp4 · Lesión de Lisfranc | Test «Equimosis plantar» | 4b · cita bajo el test | 193 |
| Tobillo y pie | tp4 · Lesión de Lisfranc | Test «Dolor en todo el ancho del mediopié» | 4b · cita bajo el test | 193 |
| Tobillo y pie | tp4 · Lesión de Lisfranc | Test «1.º y 2.º MT en direcciones opuestas» | 4b · cita bajo el test | 193 |
| Tobillo y pie | tp4 · Lesión de Lisfranc | Pronóstico | 5 · cita del pronóstico | 192 |
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «5.º MT: dolor en la base» | 4b · cita bajo el test | 194 |
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Calcáneo: talón doloroso con equimosis» | 4b · cita bajo el test | 195 |
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Pronóstico | 5 · cita del pronóstico | 192 |
| Tobillo y pie | tp6 · Luxación del Tibial Posterior | Test «Hinchazón y equimosis perimaleolar medial» | 4b · cita bajo el test | 196 |
| Tobillo y pie | tp6 · Luxación del Tibial Posterior | Test «Resalte con la flexión dorsal y plantar» | 4b · cita bajo el test | 197 |
| Tobillo y pie | tp7 · Pinzamiento Posterior del Tobillo | Test «Test de pinzamiento posterior» | 4b · cita bajo el test | 198 |
| Tobillo y pie | tp7 · Pinzamiento Posterior del Tobillo | Test «Hinchazón y dolor por detrás del astrágalo» | 4b · cita bajo el test | 199 |
| Tobillo y pie | tp7 · Pinzamiento Posterior del Tobillo | Pronóstico | 5 · cita del pronóstico | 200 |
| Tobillo y pie | tp8 · Tendinopatía del Aquiles, Porción Media | Test «Batería progresiva de carga» | 4b · cita bajo el test | 201 |
| Tobillo y pie | tp8 · Tendinopatía del Aquiles, Porción Media | Test «Descarga en el salto» | 4b · cita bajo el test | 202 |
| Tobillo y pie | tp8 · Tendinopatía del Aquiles, Porción Media | Pronóstico | 5 · cita del pronóstico | 203 |
| Tobillo y pie | tp9 · Tendinopatía Insercional del Aquiles | Test «Dolor con carga y flexión dorsal» | 4b · cita bajo el test | 204 |
| Tobillo y pie | tp9 · Tendinopatía Insercional del Aquiles | Test «Salto con el talón elevado frente a aterrizaje» | 4b · cita bajo el test | 202 |
| Tobillo y pie | tp9 · Tendinopatía Insercional del Aquiles | Test «ETM monopodal sobre plano inclinado» | 4b · cita bajo el test | 202 |
| Tobillo y pie | tp9 · Tendinopatía Insercional del Aquiles | Pronóstico | 5 · cita del pronóstico | 203 |
| Tobillo y pie | tp10 · Afectación de la Vaina del Aquiles | Test «Crepitación en flexión plantar y dorsal» | 4b · cita bajo el test | 205 |
| Tobillo y pie | tp10 · Afectación de la Vaina del Aquiles | Test «ETM en rango amplio» | 4b · cita bajo el test | 202 |
| Tobillo y pie | tp10 · Afectación de la Vaina del Aquiles | Pronóstico | 5 · cita del pronóstico | 203 |
| Tobillo y pie | tp11 · Tendinopatía del Plantar Delgado | Test «ETM sobre un step en todo el rango» | 4b · cita bajo el test | 206 |
| Tobillo y pie | tp11 · Tendinopatía del Plantar Delgado | Test «Marcha descalzo» | 4b · cita bajo el test | 207 |
| Tobillo y pie | tp11 · Tendinopatía del Plantar Delgado | Pronóstico | 5 · cita del pronóstico | 203 |
| Tobillo y pie | tp12 · Neuropatía del Nervio Sural | Test «Tinel a lo largo del sural» | 4b · cita bajo el test | 206 |
| Tobillo y pie | tp12 · Neuropatía del Nervio Sural | Test «Palpación en prono con flexión dorsal pasiva» | 4b · cita bajo el test | 208 |
| Tobillo y pie | tp12 · Neuropatía del Nervio Sural | Pronóstico | 5 · cita del pronóstico | 209 |
| Tobillo y pie | tp13 · Bursitis Calcánea Superficial | Test «Dolor superficial e hinchazón a la presión» | 4b · cita bajo el test | 210 |
| Tobillo y pie | tp14 · Tendinopatía del Tibial Posterior | Test «Dolor retromaleolar medial» | 4b · cita bajo el test | 211 |
| Tobillo y pie | tp14 · Tendinopatía del Tibial Posterior | Test «Inversión resistida» | 4b · cita bajo el test | 211 |
| Tobillo y pie | tp14 · Tendinopatía del Tibial Posterior | Test «ETM: el retropié no va a varo» | 4b · cita bajo el test | 211 |
| Tobillo y pie | tp14 · Tendinopatía del Tibial Posterior | Test ««Demasiados dedos»» | 4b · cita bajo el test | 197 |
| Tobillo y pie | tp14 · Tendinopatía del Tibial Posterior | Pronóstico | 5 · cita del pronóstico | 212 |
| Tobillo y pie | tp15 · Tendinopatía del Flexor Largo del Primer Dedo (FHL) | Test «Flexoextensión del primer dedo en flexión plantar completa» | 4b · cita bajo el test | 213 |
| Tobillo y pie | tp15 · Tendinopatía del Flexor Largo del Primer Dedo (FHL) | Test «Crepitación e hinchazón en la vaina» | 4b · cita bajo el test | 214 |
| Tobillo y pie | tp15 · Tendinopatía del Flexor Largo del Primer Dedo (FHL) | Pronóstico | 5 · cita del pronóstico | 215 |
| Tobillo y pie | tp16 · Síndrome del Túnel del Tarso | Test «Tinel a lo largo del túnel» | 4b · cita bajo el test | 216 |
| Tobillo y pie | tp16 · Síndrome del Túnel del Tarso | Test «Hinchazón en el túnel o la subastragalina posterior» | 4b · cita bajo el test | 217 |
| Tobillo y pie | tp16 · Síndrome del Túnel del Tarso | Test «Explorar el FHL» | 4b · cita bajo el test | 217 |
| Tobillo y pie | tp16 · Síndrome del Túnel del Tarso | Pronóstico | 5 · cita del pronóstico | 209 |
| Tobillo y pie | tp17 · Fractura de Estrés del Tobillo (Maléolo Medial, Astrágalo, Calcáneo) | Test «Dolor óseo a la palpación» | 4b · cita bajo el test | 218 |
| Tobillo y pie | tp17 · Fractura de Estrés del Tobillo (Maléolo Medial, Astrágalo, Calcáneo) | Test «Calcáneo: compresión medial y lateral a la vez» | 4b · cita bajo el test | 218 |
| Tobillo y pie | tp17 · Fractura de Estrés del Tobillo (Maléolo Medial, Astrágalo, Calcáneo) | Test «Astrágalo: hinchazón en el seno del tarso o posterior» | 4b · cita bajo el test | 218 |
| Tobillo y pie | tp17 · Fractura de Estrés del Tobillo (Maléolo Medial, Astrágalo, Calcáneo) | Pronóstico | 5 · cita del pronóstico | 219 |
| Tobillo y pie | tp18 · Síndrome del Seno del Tarso | Test «Palpación del seno del tarso» | 4b · cita bajo el test | 220 |
| Tobillo y pie | tp18 · Síndrome del Seno del Tarso | Test «Estrés en inversión de la subastragalina o KTW (rodilla a la pared) con pronación» | 4b · cita bajo el test | 220 |
| Tobillo y pie | tp18 · Síndrome del Seno del Tarso | Pronóstico | 5 · cita del pronóstico | 221 |
| Tobillo y pie | tp19 · Tendinopatía de los Peroneos | Test «Dolor retromaleolar lateral» | 4b · cita bajo el test | 222 |
| Tobillo y pie | tp19 · Tendinopatía de los Peroneos | Test «Subluxación de los peroneos» | 4b · cita bajo el test | 223 |
| Tobillo y pie | tp19 · Tendinopatía de los Peroneos | Test «Crepitación e hinchazón» | 4b · cita bajo el test | 222 |
| Tobillo y pie | tp19 · Tendinopatía de los Peroneos | Pronóstico | 5 · cita del pronóstico | 222 |
| Tobillo y pie | tp20 · Pinzamiento Anterior del Tobillo | Test «KTW (rodilla a la pared)» | 4b · cita bajo el test | 224 |
| Tobillo y pie | tp20 · Pinzamiento Anterior del Tobillo | Test «Palpación anterior» | 4b · cita bajo el test | 224 |
| Tobillo y pie | tp20 · Pinzamiento Anterior del Tobillo | Pronóstico | 5 · cita del pronóstico | 221 |
| Tobillo y pie | tp21 · Inestabilidad Crónica del Tobillo | Test «Hinchazón articular» | 4b · cita bajo el test | 225 |
| Tobillo y pie | tp21 · Inestabilidad Crónica del Tobillo | Test «Cajón anterior: signo del surco» | 4b · cita bajo el test | 226 |
| Tobillo y pie | tp21 · Inestabilidad Crónica del Tobillo | Test «Laxitud subastragalina» | 4b · cita bajo el test | 226 |
| Tobillo y pie | tp21 · Inestabilidad Crónica del Tobillo | Pronóstico | 5 · cita del pronóstico | 226 |
| Tobillo y pie | tp22 · Sinovitis Postraumática | Test «Hinchazón y dolor a la palpación» | 4b · cita bajo el test | 225 |
| Tobillo y pie | tp22 · Sinovitis Postraumática | Test «Laxitud del LPAA y del LPC» | 4b · cita bajo el test | 225 |
| Tobillo y pie | tp22 · Sinovitis Postraumática | Pronóstico | 5 · cita del pronóstico | 221 |
| Tobillo y pie | tp23 · Coalición Tarsiana | Test «Movilidad subastragalina y mediotarsiana» | 4b · cita bajo el test | 191 |
| Tobillo y pie | tp23 · Coalición Tarsiana | Pronóstico | 5 · cita del pronóstico | 227 |
| Tobillo y pie | tp24 · Artrosis de Tobillo o Pie | Test «Perfil clínico» | 4b · cita bajo el test | 228 |
| Tobillo y pie | tp24 · Artrosis de Tobillo o Pie | Test «Palpación de la interlínea» | 4b · cita bajo el test | 229 |
| Tobillo y pie | tp24 · Artrosis de Tobillo o Pie | Pronóstico | 5 · cita del pronóstico | 228 |
| Tobillo y pie | tp25 · Osteocondritis Disecante del Astrágalo | Test «Palpación de la cúpula astragalina en flexión plantar» | 4b · cita bajo el test | 230 |
| Tobillo y pie | tp25 · Osteocondritis Disecante del Astrágalo | Test «Hinchazón, derrame, crepitación» | 4b · cita bajo el test | 230 |
| Tobillo y pie | tp25 · Osteocondritis Disecante del Astrágalo | Pronóstico | 5 · cita del pronóstico | 227 |
| Tobillo y pie | tp26 · Dolor Plantar Crónico del Talón | Test «Palpación de la tuberosidad medial del calcáneo» | 4b · cita bajo el test | 231 |
| Tobillo y pie | tp26 · Dolor Plantar Crónico del Talón | Pronóstico | 5 · cita del pronóstico | 232 |
| Tobillo y pie | tp27 · Síndrome de la Almohadilla Grasa del Talón | Test «Palpación posterolateral del talón» | 4b · cita bajo el test | 231 |
| Tobillo y pie | tp27 · Síndrome de la Almohadilla Grasa del Talón | Pronóstico | 5 · cita del pronóstico | 232 |
| Tobillo y pie | tp28 · Atrapamiento Nervioso del Talón | Test «Tinel sobre el nervio calcáneo medial» | 4b · cita bajo el test | 233 |
| Tobillo y pie | tp28 · Atrapamiento Nervioso del Talón | Pronóstico | 5 · cita del pronóstico | 209 |
| Tobillo y pie | tp29 · Lesión Calcaneocuboidea y Cubometatarsiana | Test «Aguda: palpación calcaneocuboidea» | 4b · cita bajo el test | 234 |
| Tobillo y pie | tp29 · Lesión Calcaneocuboidea y Cubometatarsiana | Test «Gradual: interlíneas del cuboides» | 4b · cita bajo el test | 234 |
| Tobillo y pie | tp29 · Lesión Calcaneocuboidea y Cubometatarsiana | Test «Carga del antepié e inicio de la ETM» | 4b · cita bajo el test | 234 |
| Tobillo y pie | tp29 · Lesión Calcaneocuboidea y Cubometatarsiana | Pronóstico | 5 · cita del pronóstico | 235 |
| Tobillo y pie | tp30 · Fractura de Estrés del Mediopié (Navicular, Cuboides, Cuñas) | Test «Punto N» | 4b · cita bajo el test | 218 |
| Tobillo y pie | tp30 · Fractura de Estrés del Mediopié (Navicular, Cuboides, Cuñas) | Test «Dolor puntual sobre cuboides o cuñas» | 4b · cita bajo el test | 193 |
| Tobillo y pie | tp30 · Fractura de Estrés del Mediopié (Navicular, Cuboides, Cuñas) | Pronóstico | 5 · cita del pronóstico | 236 |
| Tobillo y pie | tp31 · Lesión de la 1.ª Metatarsofalángica | Test «Equimosis e hinchazón en la interlínea» | 4b · cita bajo el test | 237 |
| Tobillo y pie | tp31 · Lesión de la 1.ª Metatarsofalángica | Test «Rango de la 1.ª MTF frente al lado sano» | 4b · cita bajo el test | 238 |
| Tobillo y pie | tp31 · Lesión de la 1.ª Metatarsofalángica | Test «Dolor sobre los sesamoideos» | 4b · cita bajo el test | 239 |
| Tobillo y pie | tp31 · Lesión de la 1.ª Metatarsofalángica | Pronóstico | 5 · cita del pronóstico | 235 |
| Tobillo y pie | tp32 · Dolor en la Base del 2.º Metatarsiano | Test «Palpación de la base del 2.º MT y de Lisfranc» | 4b · cita bajo el test | 240 |
| Tobillo y pie | tp32 · Dolor en la Base del 2.º Metatarsiano | Test «Estrés frente a sinovitis» | 4b · cita bajo el test | 241 |
| Tobillo y pie | tp33 · Fractura de Estrés del Cuello de un Metatarsiano (Fractura de Marcha) | Test «Dolor puntual sobre el cuello» | 4b · cita bajo el test | 242 |
| Tobillo y pie | tp33 · Fractura de Estrés del Cuello de un Metatarsiano (Fractura de Marcha) | Test «Carga axial del MT» | 4b · cita bajo el test | 242 |
| Tobillo y pie | tp33 · Fractura de Estrés del Cuello de un Metatarsiano (Fractura de Marcha) | Pronóstico | 5 · cita del pronóstico | 243 |
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» | 4b · cita bajo el test | 244 |
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Diferencial del antepié» | 4b · cita bajo el test | 245 |
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Pronóstico | 5 · cita del pronóstico | 235 |
| Tobillo y pie | tp35 · Gota | Test «Articulación roja, hinchada y muy dolorosa» | 4b · cita bajo el test | 245 |
| Tobillo y pie | tp35 · Gota | Test «Suele estar sistémicamente bien» | 4b · cita bajo el test | 246 |
| Tobillo y pie | tp36 · Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg) | Test «Sever: inserción del Aquiles (8–12 años)» | 4b · cita bajo el test | 247 |
| Tobillo y pie | tp36 · Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg) | Test «Iselin: base del 5.º MT (8–13 años)» | 4b · cita bajo el test | 248 |
| Tobillo y pie | tp36 · Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg) | Test «Navicular: apofisitis del tibial posterior o Köhler» | 4b · cita bajo el test | 249 |
| Tobillo y pie | tp36 · Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg) | Test «Freiberg: cabeza del 2.º–4.º MT (14–18 años)» | 4b · cita bajo el test | 250 |
| Tobillo y pie | tp36 · Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg) | Pronóstico | 5 · cita del pronóstico | 251 |
| Tobillo y pie | tp37 · Fractura de Tobillo (Maleolar) | Test «Regla de Ottawa de tobillo» | 4b · cita bajo el test | 252 |
| Tobillo y pie | tp37 · Fractura de Tobillo (Maleolar) | Test «No carga cuatro pasos» | 4b · cita bajo el test | 253 |
| Tobillo y pie | — | Pregunta `tp_t1` · Traumático / Mecánico | 2 · razonamiento del cribado | 306 |
| Tobillo y pie | — | Pregunta `tp_t2` · Traumático / Mecánico | 2 · razonamiento del cribado | 307 |
| Tobillo y pie | — | Pregunta `tp_t3` · Traumático / Mecánico | 2 · razonamiento del cribado | 308 |
| Tobillo y pie | — | Pregunta `tp_t4` · Traumático / Mecánico | 2 · razonamiento del cribado | 309 |
| Tobillo y pie | — | Pregunta `tp_t5` · Traumático / Mecánico | 2 · razonamiento del cribado | 310 |
| Tobillo y pie | — | Pregunta `tp_o1` · Fractura de Estrés | 2 · razonamiento del cribado | 311 |
| Tobillo y pie | — | Pregunta `tp_o2` · Fractura de Estrés | 2 · razonamiento del cribado | 312 |
| Tobillo y pie | — | Pregunta `tp_i1` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 313 |
| Tobillo y pie | — | Pregunta `tp_i2` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 314 |
| Tobillo y pie | — | Pregunta `tp_c1` · Oncológico / Sistémico | 2 · razonamiento del cribado | 315 |
| Tobillo y pie | — | Pregunta `tp_c2` · Oncológico / Sistémico | 2 · razonamiento del cribado | 316 |
| Tobillo y pie | — | Pregunta `tp_v1` · Vascular | 2 · razonamiento del cribado | 317 |
| Tobillo y pie | — | Pregunta `tp_n1` · Neurológico | 2 · razonamiento del cribado | 318 |
| Tobillo y pie | — | Pregunta `tp_n2` · Neurológico | 2 · razonamiento del cribado | 318 |
| Tobillo y pie | — | Pregunta `tp_n3` · Neurológico | 2 · razonamiento del cribado | 317 |

### Logerstedt 2017

Autores: Logerstedt, Scalzitti, Risberg, Engebretsen, Webster, Feller, Snyder-Mackler, Axe y McDonough  
Título: *Knee Stability and Movement Coordination Impairments: Knee Ligament Sprain Revision 2017*  
Publicación: J Orthop Sports Phys Ther 47(11):A1–A47  
DOI: 10.2519/jospt.2017.0303  
Última revisión: 2026-10 · Sin cambios: PubMed (guías de JOSPT de rodilla desde 2017) no encuentra revisión de la guía de esguince de ligamentos; lo posterior son consensos quirúrgicos (esquina posterolateral, 2025; reconstrucción del LCA, 2026), de menos peso y sobre otra pregunta.  
Nota: Guía de práctica clínica APTA; PDF completo de orthopt.org leído (resumen de recomendaciones, 2026-10). Pautas de ro4 y ro8–ro10.

Citada como:

1. Logerstedt 2017, J Orthop Sports Phys Ther 47(11):A1–A47 (guía de práctica clínica APTA, esguince de ligamentos de rodilla; letra = grado de la recomendación, tal como la da la guía: A evidencia fuerte, C débil, F opinión de expertos)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Rodilla | ro8 · Lesión del Ligamento Colateral Medial (LCM) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Rodilla | ro9 · Lesión del Ligamento Cruzado Posterior (LCP) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Rodilla | ro10 · Lesión del Ligamento Lateral Externo y Esquina Posterolateral (LLE y EPL) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Logerstedt 2018

Autores: Logerstedt, Scalzitti, Bennell, Hinman, Silvers-Granelli, Ebert, Hambly, Carey, Snyder-Mackler, Axe y McDonough  
Título: *Knee Pain and Mobility Impairments: Meniscal and Articular Cartilage Lesions Revision 2018*  
Publicación: J Orthop Sports Phys Ther 48(2):A1–A50  
DOI: 10.2519/jospt.2018.0301  
Última revisión: 2026-10 · Complementada: el consenso formal EU-US de 2024 (Prill 2025, acceso abierto) cubre el tratamiento sin cirugía, que la guía deja para su próxima revisión; la pauta de ro2 suma sus recomendaciones con su grado. La guía AAOS 2024 de patología meniscal aislada aguda (PDF completo del usuario) también se suma a la pauta de ro2 (opciones de consenso).  
Nota: Guía de práctica clínica APTA; PDF completo de orthopt.org leído (resumen de recomendaciones y ejercicio terapéutico, 2026-10). Pauta de ro2.

Citada como:

1. Prill 2025, Knee Surg Sports Traumatol Arthrosc 33(8):3014–3024 (consenso formal EU-US de rehabilitación del menisco, ESSKA-AOSSM-AASPT, parte II: tratamiento sin cirugía; grados A a D, de más respaldo científico a opinión de expertos); Logerstedt 2018, J Orthop Sports Phys Ther 48(2):A1–A50 (guía de práctica clínica APTA, lesiones de menisco y de cartílago articular: tras la meniscectomía; deja el tratamiento sin cirugía para su próxima revisión; letra = grado de la recomendación, tal como la da la guía); AAOS 2024 (guía de práctica clínica de patología meniscal aislada aguda, opciones «Physical Therapy» e «Indications for Acute Surgical Intervention»)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro2 · Lesión Meniscal | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Lopes 2025

Autores: Lopes, Rizzo, Hespanhol, Costa y Kamper  
Título: *Exercise for patellar tendinopathy*  
Publicación: Cochrane Database Syst Rev 5(5):CD013078  
DOI: 10.1002/14651858.CD013078.pub2  
Última revisión: 2026-10 · Sin cambios: es la revisión Cochrane más reciente; el metaanálisis en red posterior (BMC Sports Sci Med Rehabil, 2026) no la sustituye en la pauta, que sigue la guía holandesa (Ophey 2025).  
Nota: Revisión Cochrane (7 ensayos, 211 deportistas); leído el resumen de PubMed (2026-10). Matiz de la pauta de ro5.

Citada como:

1. Ophey 2025, Knee Surg Sports Traumatol Arthrosc 33:457–469 (guía multidisciplinar holandesa, módulos 5–7; certeza GRADE muy baja) · Lopes 2025, Cochrane Database Syst Rev 5:CD013078 (revisión sistemática, 7 ensayos, 211 deportistas)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro5 · Tendinopatía Rotuliana | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Lotfollahzadeh 2024

Autores: Lotfollahzadeh, Lopez y Deppen  
Título: *Appendicitis*  
Publicación: StatPearls [Internet], NBK493193 (act. 2024-02-12)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 12 de febrero de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Lotfollahzadeh 2024 — Lotfollahzadeh, Lopez y Deppen, «Appendicitis», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de febrero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `c4` · Gastrointestinal | 2 · razonamiento del cribado | 1 |

### Lubiatowski 2020

Autores: Lubiatowski, Wałecka, Dzianach, Stefaniak y Romanowski  
Título: *Synovial plica of the elbow and its clinical relevance*  
Publicación: EFORT Open Rev 5(9):549–557  
DOI: 10.1302/2058-5241.5.200027  
Última revisión: **sin revisar**  
Nota: Revisión narrativa con tabla de 19 series de resección; texto completo leído en Europe PMC. Leído en la sesión de dosis de codo (2026-10). Pauta de co6.

Citada como:

1. Lubiatowski 2020, EFORT Open Rev 5(9):549–557 (revisión narrativa)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co6 · Dolor Radiohumeral / Pinzamiento Posterolateral por Plica Radiocapitelar | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Lucado 2022

Autores: Lucado, Day, Vincent, MacDermid, Fedorczyk, Grewal y Martin  
Título: *Lateral Elbow Pain and Muscle Function Impairments. Clinical Practice Guidelines*  
Publicación: J Orthop Sports Phys Ther 52(12):CPG1–CPG111  
DOI: 10.2519/jospt.2022.0302  
Última revisión: **sin revisar**  
Nota: Guía de práctica clínica APTA (literatura hasta noviembre de 2021); PDF completo descargado de orthopt.org. Leído en la sesión de dosis de codo (2026-10). Pauta de co1. También da las MCID del PRTEE (7 y 11 puntos) y del DASH (10,2), y dice que no hay estudios del QuickDASH en la epicondilalgia lateral.

Citada como:

1. Otro nombre del test de Cozen: la guía de Lucado 2022 (apéndice E) lo cita como «Thomsen test (Cozen's)». No es una prueba distinta: marcar solo una de las dos para no contar dos veces el mismo hallazgo.
2. Lucado 2022 (J Orthop Sports Phys Ther 52(12):CPG1–CPG111, apéndice E)
3. Lucado 2022, J Orthop Sports Phys Ther 52(12):CPG1–CPG111 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Test de Thomsen (= test de Cozen)» (en `criterio`) | 4b · mención en el texto | 1 |
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Test de Thomsen (= test de Cozen)» | 4b · cita bajo el test | 2 |
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Pauta de tratamiento | 5 · cita de la pauta | 3 |

### Lucas 2009

Publicación: —  
DOI: 10.1097/ajp.0b013e31817e13b6  
Última revisión: 2026-10 · Complementada: Rathbone 2017 (Clin J Pain, metaanálisis de la fiabilidad de la palpación de puntos gatillo, PDF del usuario) da κ 0,34 para el nódulo en banda tensa y confirma la fiabilidad baja; sus cifras pasan a lu9.

Citada como:

1. Rathbone 2017 (Clin J Pain, metaanálisis de fiabilidad) · Lucas 2009 (revisión sistemática de fiabilidad previa)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu9 · Síndrome de Dolor Miofascial Lumbar | Test «Banda tensa palpable» | 4b · cita bajo el test | 1 |

### Mabrouk y Pilson 2026

Autores: Mabrouk y Pilson  
Título: *Patellar Fractures*  
Publicación: StatPearls [Internet], NBK513330 (act. 2026-09-14)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 14 de septiembre de 2026 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Mabrouk y Pilson 2026 — Mabrouk y Pilson, «Patellar Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de septiembre de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `ro_t1` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### Mabrouk y Siwiec 2026

Autores: Mabrouk y Siwiec  
Título: *Patellar Tendon Rupture*  
Publicación: StatPearls [Internet], NBK513275 (act. 2026-02-15)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 15 de febrero de 2026 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Mabrouk y Siwiec 2026 — Mabrouk y Siwiec, «Patellar Tendon Rupture», StatPearls [Internet], NCBI Bookshelf, última actualización 15 de febrero de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `ro_t2` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### Maffulli 1998

Publicación: Am J Sports Med 26:266–70  
DOI: 10.1177/03635465980260021801  
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
DOI: 10.1053/j.jfas.2014.09.021  
Última revisión: **sin revisar**

Citada como:

1. Dolor a la palpación directa del espacio (sobre todo 3.º–4.º); posible chasquido al palpar mientras se comprimen los metatarsianos. No puntúa: la compresión pulgar-índice del espacio (Mahadevan 2015) tiene S 96 %, pero su especificidad sale de un solo pie sin Morton; el chasquido de Mulder da LR+ 2,19 (IC 0,45–10,60; Dando, en Pitcher 2024).
2. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 281; Mahadevan 2015 (J Foot Ankle Surg 54:549–53); Pitcher 2024 (Foot Ankle Orthop 9(4))

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» | 4b · cita bajo el test | 2 |

### Majlesi 2008

Publicación: —  
DOI: 10.1097/rhu.0b013e31816b2f99  
Última revisión: 2026-10 · Cifras sin cambios, con aviso: van der Windt 2010 (Cochrane) recoge solo dos estudios del Slump y señala que la especificidad de Majlesi puede estar inflada por su diseño de casos y controles (controles con RM normal); el otro estudio dio S 0,44, E 0,58. PubMed (2026-10): ninguna revisión posterior del Slump. Por decisión del usuario (2026-10), el Slump pasa a hallazgo: sus cifras quedan en el criterio y no puntúa.

Citada como:

1. Majlesi 2008 (estudio único; referencia: RM) · van der Windt 2010 (revisión Cochrane: límites del estudio y un segundo estudio)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «Test de Slump» | 4b · cita bajo el test | 1 |

### Malik 2023

Autores: Malik, Gnanapandithan y Singh  
Título: *Peptic Ulcer Disease*  
Publicación: StatPearls [Internet], NBK534792 (act. 2023-06-05)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 5 de junio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Malik 2023 — Malik, Gnanapandithan y Singh, «Peptic Ulcer Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de junio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_gi2` · Gastrointestinal | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_gi2` · Gastrointestinal | 2 · razonamiento del cribado | 1 |

### Malik y Herron 2023

Autores: Malik, Herron, Mabrouk y Rosenberg  
Título: *Tibial Plateau Fractures*  
Publicación: StatPearls [Internet], NBK470593 (act. 2023-04-22)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 22 de abril de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Clave con los dos primeros autores para no confundirla con Malik 2023 (úlcera péptica), del mismo año. Razonamiento del cribado de rodilla.

Citada como:

1. Malik y Herron 2023 — Malik, Herron, Mabrouk y Rosenberg, «Tibial Plateau Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 22 de abril de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `ro_t1` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `ro_t4` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### Margetis y Donnally 2025

Autores: Margetis y Donnally  
Título: *Cervical Myelopathy*  
Publicación: StatPearls [Internet], NBK482312 (act. 2025-08-02)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Releído en la sesión de codo (2026-10): razonamiento del cribado de codo.

Citada como:

1. Margetis y Donnally 2025 (StatPearls, «Cervical Myelopathy», exploración) · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A15)
2. Margetis y Donnally 2025 (StatPearls, «Cervical Myelopathy», exploración)
3. Margetis y Donnally 2025 — Margetis y Donnally, «Cervical Myelopathy», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de agosto de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce8 · Mielopatía Espondilótica Cervical | Test «Signo de Hoffmann» | 4b · cita bajo el test | 1 |
| Cervical | ce8 · Mielopatía Espondilótica Cervical | Test «Clonus de tobillo/muñeca» | 4b · cita bajo el test | 2 |
| Cervical | ce8 · Mielopatía Espondilótica Cervical | Test «Evaluación de marcha (alteración)» | 4b · cita bajo el test | 2 |
| Cervical | ce8 · Mielopatía Espondilótica Cervical | Test «Hiperreflexia (ROT aumentados)» | 4b · cita bajo el test | 2 |
| Cervical | — | Pregunta `cv3` · Renal / Urológico | 2 · razonamiento del cribado | 3 |
| Codo | — | Pregunta `co4b` · Vascular / Neurológica | 2 · razonamiento del cribado | 3 |
| Codo | — | Pregunta `co3` · Vascular / Neurológica | 2 · razonamiento del cribado | 3 |

### Margetis y Gillis 2025

Autores: Margetis y Gillis  
Título: *Spondylolisthesis*  
Publicación: StatPearls [Internet], NBK430767 (act. 2025-03-28)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 28 de marzo de 2025 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Margetis y Gillis 2025 — Margetis y Gillis, «Spondylolisthesis», StatPearls [Internet], NCBI Bookshelf, última actualización 28 de marzo de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_e7` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |

### Martin 2021

Publicación: J Orthop Sports Phys Ther 51(4):CPG1–CPG80  
DOI: 10.2519/jospt.2021.0302  
Última revisión: **sin revisar**

Citada como:

1. Martin 2021, J Orthop Sports Phys Ther 51(4):CPG1–CPG80 (guía de práctica clínica APTA; letra = grado de la recomendación)
2. Martin 2021, J Orthop Sports Phys Ther 51(4):CPG1–CPG80 (guía de práctica clínica APTA; letra = grado de la recomendación) · Liu 2025, BMC Sports Sci Med Rehabil 17:335 (metaanálisis de dosis) · McKeon 2008, Med Sci Sports Exerc 40(10):1810–1819 (ensayo aleatorizado, n = 31)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Tobillo y pie | tp21 · Inestabilidad Crónica del Tobillo | Pauta de tratamiento | 5 · cita de la pauta | 2 |

### Mastromarchi 2021

Autores: Mastromarchi y May  
Título: *First rib dysfunction in patients with neck and shoulder pain: a Delphi investigation*  
Publicación: J Man Manip Ther 29(3):181–188  
DOI: 10.1080/10669817.2020.1824470  
Última revisión: 2026-10 · Sin cambios: búsqueda en PubMed (2026-10) sin estudios posteriores de fiabilidad ni validez de los tests de la 1.ª costilla. Sigue como opinión de expertos; no puntúa (h9 y ce10).  
Nota: PDF aportado por el usuario. Delphi de 12 expertos en terapia manual (cuatro rondas): opinión de expertos; los autores piden estudiar la fiabilidad y la validez de los tests. Tests de la 1.ª costilla de h9 y ce10.

Citada como:

1. Mastromarchi 2021 (J Man Manip Ther 29(3):181–188, Delphi, tabla 2)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h9 · Disfunción de Primera Costilla (Zona Cervicotorácica) | Test «Palpación posteroanterior de 1ª costilla» | 4b · cita bajo el test | 1 |
| Hombro | h9 · Disfunción de Primera Costilla (Zona Cervicotorácica) | Test «Test de elevación del brazo post-movilización» | 4b · cita bajo el test | 1 |
| Cervical | ce10 · Disfunción de 1ª Costilla (Articulación Costo-Vertebral Superior) | Test «Palpación de 1ª costilla (sensibilidad y restricción)» | 4b · cita bajo el test | 1 |
| Cervical | ce10 · Disfunción de 1ª Costilla (Articulación Costo-Vertebral Superior) | Test «Restricción de rotación cervical ipsilateral» | 4b · cita bajo el test | 1 |

### Maxwell y Sterling 2013

Publicación: Man Ther 18:172–174  
DOI: 10.1016/j.math.2012.07.004  
Última revisión: **sin revisar**

Citada como:

1. Maxwell y Sterling 2013 (Man Ther 18:172–174; 62 con latigazo crónico, grado II–III, 124 lados del cuello; referencia: umbral de dolor al frío ≥13 °C con termotest; orden de los tests no aleatorizado). Tarjeta de consulta cervical (guía clínica cervical, ap. 5)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Test «Hielo sobre la nuca (hiperalgesia al frío)» | 4b · cita bajo el test | 1 |

### May y Marappa-Ganeshan 2023

Autores: May y Marappa-Ganeshan  
Título: *Stress Fractures*  
Publicación: StatPearls [Internet], NBK554538 (act. 2023-07-10)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 10 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie.

Citada como:

1. May y Marappa-Ganeshan 2023 — May y Marappa-Ganeshan, «Stress Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_os1` · Óseo / Desarrollo | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_e6` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_e7` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_o1` · Fractura de Estrés | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_o2` · Fractura de Estrés | 2 · razonamiento del cribado | 1 |

### McCarthy y Busconi 1995

Publicación: Can J Surg 38 Supl 1:S13–7  
DOI: —  
Última revisión: 2026-10 · Texto completo no conseguido. Según Reiman 2015 (tabla 3), el estudio no publicó S ni E del test de Thomas («NA»): las calcularon los autores del metaanálisis. Serie de casos con riesgo de sesgo alto; Narvani 2003 no lo confirma. El Thomas pasa a hallazgo en labrum.

Citada como:

1. McCarthy y Busconi 1995 (Can J Surg; serie de 59 casos con dolor de cadera refractario; referencia: artroscopia, rotura labral), S y E calculadas por los autores de Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med)
2. McCarthy y Busconi 1995 (Can J Surg; serie de 59 casos con dolor de cadera refractario; referencia: artroscopia, rotura labral), S y E calculadas por los autores de Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med). En contra: Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test de Thomas» | 4b · cita bajo el test | 1 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Thomas» | 4b · cita bajo el test | 2 |

### McClary y Massey 2023

Autores: McClary y Massey  
Título: *Ankle Brachial Index*  
Publicación: StatPearls [Internet], NBK544226 (act. 2023-01-16)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 16 de enero de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. McClary y Massey 2023 — McClary y Massey, «Ankle Brachial Index», StatPearls [Internet], NCBI Bookshelf, última actualización 16 de enero de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `ro_t3` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `ro_t4` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### McKeon 2008

Publicación: Med Sci Sports Exerc 40(10):1810–1819  
DOI: 10.1249/mss.0b013e31817e0f92  
Última revisión: **sin revisar**

Citada como:

1. Ejercicio propioceptivo y neuromuscular para la estabilidad postural dinámica y la estabilidad percibida (A). Terapia manual —movilizaciones graduadas, manipulación y movilización con movimiento en carga y sin carga— para la dorsiflexión en carga y el equilibrio dinámico a corto plazo (A); se puede combinar con el ejercicio (B). Tobillera o vendaje nunca como tratamiento único (B). La guía no fija dosis. Orientativo (metaanálisis de 26 ensayos, análisis de subgrupos exploratorio, certeza de muy baja a moderada): terapia manual 1–2 veces por semana durante 4 semanas o menos para el CAIT; entrenamiento multimodal 1–2 veces por semana durante 5–8 semanas para el FAAM. Protocolo concreto con ensayo (McKeon 2008, adultos jóvenes): 12 sesiones supervisadas de unos 20 min, 3 por semana durante 4 semanas: saltos a estabilización monopodal en 4 direcciones (10 por dirección), salto con alcance (5), saltos no anticipados siguiendo una secuencia, y equilibrio monopodal con ojos abiertos y cerrados. 7 niveles por tarea (saltos de 46, 69 y 91 cm, primero con ayuda de los brazos y luego con las manos en la cadera; al final, desde una plataforma de 15 cm); se sube de nivel tras 10 repeticiones sin error (5 en el salto con alcance). Mejoró la función autorreferida (FADI) y el equilibrio frente a no entrenar.
2. Martin 2021, J Orthop Sports Phys Ther 51(4):CPG1–CPG80 (guía de práctica clínica APTA; letra = grado de la recomendación) · Liu 2025, BMC Sports Sci Med Rehabil 17:335 (metaanálisis de dosis) · McKeon 2008, Med Sci Sports Exerc 40(10):1810–1819 (ensayo aleatorizado, n = 31)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp21 · Inestabilidad Crónica del Tobillo | Dosis (en el texto) | 5 · mención en el texto | 1 |
| Tobillo y pie | tp21 · Inestabilidad Crónica del Tobillo | Pauta de tratamiento | 5 · cita de la pauta | 2 |

### McMordie 2023

Autores: McMordie, Viswanathan y Gillis  
Título: *Cervical Spine Fractures Overview*  
Publicación: StatPearls [Internet], NBK448129 (act. 2023-04-03)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. McMordie 2023 — McMordie, Viswanathan y Gillis, «Cervical Spine Fractures Overview», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de abril de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_ar3` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 1 |

### Mellor 2016

Autores: Mellor, Grimaldi, Wajswelner, Hodges, Abbott, Bennell y Vicenzino  
Título: *Exercise and load modification versus corticosteroid injection versus 'wait and see' for persistent gluteus medius/minimus tendinopathy (the LEAP trial): a protocol for a randomised clinical trial*  
Publicación: BMC Musculoskelet Disord 17:196  
DOI: 10.1186/s12891-016-1043-6  
Última revisión: 2026-10 · Sin cambios: protocolo del ensayo LEAP (ver Mellor 2018); las revisiones posteriores (Wang 2025, Cordeiro 2024) no dan una progresión de ejercicios más detallada.  
Nota: Protocolo del ensayo LEAP (texto completo en PMC4852446): tabla 3 con ejercicios y progresión. Dosis de ca4 (cadera).

Citada como:

1. Mellor 2018, BMJ 361:k1662 (ensayo aleatorizado LEAP, n = 204, frente a infiltración de corticoide y a esperar) · Mellor 2016, BMC Musculoskelet Disord 17:196 (protocolo del ensayo, tabla 3: ejercicios y progresión)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Mellor 2018

Autores: Mellor, Bennell, Grimaldi, Nicolson, Kasza, Hodges, Wajswelner y Vicenzino  
Título: *Education plus exercise versus corticosteroid injection use versus a wait and see approach on global outcome and pain from gluteal tendinopathy: prospective, single blinded, randomised clinical trial*  
Publicación: BMJ 361:k1662  
DOI: 10.1136/bmj.k1662  
Última revisión: 2026-10 · Sin cambios: PubMed (tendinopatía glútea o dolor trocantéreo con ejercicio o educación desde 2022). El metaanálisis en red de Wang 2025 (J Orthop Surg Res 20:126, 19 ensayos, PMC11783921) sitúa el ejercicio primero para dolor y función, y el de Cordeiro 2024 (Sci Rep 14:3343, PMC10858207) lo encuentra mejor que la intervención mínima (certeza baja) e igual que la infiltración en dolor; ninguno da una pauta mejor que la del LEAP. Leídos en PMC (2026-10).  
Nota: Ensayo LEAP, texto completo en PMC5930290. Dosis de ca4 (cadera).

Citada como:

1. Mellor 2018, BMJ 361:k1662 (ensayo aleatorizado LEAP, n = 204, frente a infiltración de corticoide y a esperar) · Mellor 2016, BMC Musculoskelet Disord 17:196 (protocolo del ensayo, tabla 3: ejercicios y progresión)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Mendonça 2016

Autores: Mendonça, Ocarino, Bittencourt, Fernandes, Verhagen y Fonseca  
Título: *The Accuracy of the VISA-P Questionnaire, Single-Leg Decline Squat, and Tendon Pain History to Identify Patellar Tendon Abnormalities in Adult Athletes*  
Publicación: J Orthop Sports Phys Ther 46(8):673–80  
DOI: 10.2519/jospt.2016.6192  
Última revisión: 2026-10 · Cita corregida (PDF del usuario): la muestra son 43 deportistas de competición (86 tendones), no seleccionados por dolor en el tendón; LR+ 4,2 (2,3–7,14) de la sentadilla declinada coincide. Sigue como hallazgo.  
Nota: Leído el resumen de PubMed (2026-10). Sentadilla declinada de ro5 (hallazgo: la referencia es la ecografía, no el diagnóstico).

Citada como:

1. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 192–193; Ophey 2025 (Knee Surg Sports Traumatol Arthrosc 33:457–469; guía multidisciplinar holandesa, módulo 4; certeza GRADE muy baja); Mendonça 2016 (J Orthop Sports Phys Ther 46:673–80; 43 deportistas de competición de voleibol, baloncesto, fútbol y carrera, con y sin dolor en el tendón rotuliano; referencia: ecografía)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro5 · Tendinopatía Rotuliana | Test «Dolor durante sentadilla en tabla inclinada (decline squat)» | 4b · cita bajo el test | 1 |

### Menger 2024

Autores: Menger, Rayi y Notarianni  
Título: *Klippel Feil Syndrome*  
Publicación: StatPearls [Internet], NBK493157 (act. 2024-05-11)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Menger 2024 — Menger, Rayi y Notarianni, «Klippel Feil Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 11 de mayo de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_n1` · Médula / Estructural | 2 · razonamiento del cribado | 1 |

### Menon y Cassaro 2026

Autores: Menon y Cassaro  
Título: *Sarcoma Overview*  
Publicación: StatPearls [Internet], NBK519533 (act. 2026-09-13)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 13 de septiembre de 2026 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Menon y Cassaro 2026 — Menon y Cassaro, «Sarcoma Overview», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de septiembre de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `r3` · Oncológico / Hematológico | 2 · razonamiento del cribado | 1 |

### Menon y Rednam 2026

Autores: Menon, Rednam, Gujarathi y Maher  
Título: *Gout*  
Publicación: StatPearls [Internet], NBK546606 (act. 2026-04-12)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie. Lleva dos autores en la clave para no confundirse con Menon y Cassaro 2026.

Citada como:

1. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 281; Menon y Rednam 2026 (StatPearls, «Gout»)
2. Menon y Rednam 2026 — Menon, Rednam, Gujarathi y Maher, «Gout», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de abril de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp35 · Gota | Test «Suele estar sistémicamente bien» | 4b · cita bajo el test | 1 |
| Tobillo y pie | — | Pregunta `tp_i1` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 2 |

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

### Mohr 2024

Autores: Mohr, Mabrouk y Baldea  
Título: *Osteochondritis Dissecans of the Knee*  
Publicación: StatPearls [Internet], NBK538194 (act. 2024-01-25)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 25 de enero de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 199; Mohr 2024 (StatPearls, NBK538194)
2. Mohr 2024 — Mohr, Mabrouk y Baldea, «Osteochondritis Dissecans of the Knee», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de enero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro16 · Lesión Osteocondral | Test «Signos de inestabilidad: derrame y bloqueo» | 4b · cita bajo el test | 1 |
| Rodilla | — | Pregunta `ro_t6` · Traumático / Mecánico | 2 · razonamiento del cribado | 2 |

### Mohseni 2024

Autores: Mohseni, Mabrouk y Simon  
Título: *Knee Dislocation*  
Publicación: StatPearls [Internet], NBK470595 (act. 2024-02-27)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 27 de febrero de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Mohseni 2024 — Mohseni, Mabrouk y Simon, «Knee Dislocation», StatPearls [Internet], NCBI Bookshelf, última actualización 27 de febrero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `ro_t3` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `ro_t4` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### Molloy 2003

Publicación: J Bone Joint Surg Br 85-B(3)  
DOI: 10.1302/0301-620x.85b3.12873  
Última revisión: **sin revisar**

Citada como:

1. Pulgar sobre la gotera anterolateral con el pie en flexión plantar y, sin soltar, llevar a flexión dorsal completa. Positivo si la maniobra combinada provoca dolor o aumenta el que daba la presión sola. Molloy 2003, 73 pacientes con artroscopia: 37 verdaderos positivos, 4 falsos positivos (adherencias, artrosis), 2 falsos negativos, 30 verdaderos negativos → S 94,8 %, E 88 % (LR calculadas). Límites: todos ya iban a artroscopia (sin inestabilidad mecánica), el mismo cirujano exploraba y decidía operar, y valida el pinzamiento sinovial anterolateral, no el óseo.
2. Molloy 2003 (J Bone Joint Surg Br 85-B(3))

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp20 · Pinzamiento Anterior del Tobillo | Test «Signo de pinzamiento de Molloy» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp20 · Pinzamiento Anterior del Tobillo | Test «Signo de pinzamiento de Molloy» | 4b · cita bajo el test | 2 |

### Momodu y Savaliya 2023

Autores: Momodu y Savaliya  
Título: *Septic Arthritis*  
Publicación: StatPearls [Internet], NBK538176 (act. 2023-07-03)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 3 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro y rodilla. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie. Releído en la sesión de codo (2026-10): razonamiento del cribado de codo.

Citada como:

1. Momodu y Savaliya 2023 — Momodu y Savaliya, «Septic Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_i1` · Infección / Sistémico | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_in1` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_in3` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `r1` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |
| Codo | — | Pregunta `co1` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_i1` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |

### Moore y Tafti 2026

Autores: Moore y Tafti  
Título: *Pes Planus*  
Publicación: StatPearls [Internet], NBK430802 (act. 2026-02-15)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie.

Citada como:

1. Moore y Tafti 2026 — Moore y Tafti, «Pes Planus», StatPearls [Internet], NCBI Bookshelf, última actualización 15 de febrero de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | — | Pregunta `tp_t5` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### Mountjoy 2023

Autores: Mountjoy, Ackerman, Bailey, Burke, Constantini, Hackney, Heikura, Melin, Pensgaard, Stellingwerff, Sundgot-Borgen, Torstveit, Jacobsen, Verhagen, Budgett, Engebretsen y Erdener  
Título: *2023 International Olympic Committee's (IOC) consensus statement on Relative Energy Deficiency in Sport (REDs)*  
Publicación: Br J Sports Med 57(17):1073–1098  
DOI: 10.1136/bjsports-2023-106994  
Última revisión: 2026-10 · Sin cambios: es el consenso vigente del COI (el anterior es de 2018).  
Nota: PDF del usuario (2026-10), leído en lo relativo a salud ósea y a la herramienta REDs CAT2 (tabla 4). Pregunta `l_e6`.

Citada como:

1. Mountjoy 2023 — Mountjoy, Ackerman, Bailey, Burke, Constantini, Hackney et al., «2023 International Olympic Committee's (IOC) consensus statement on Relative Energy Deficiency in Sport (REDs)», Br J Sports Med 2023;57(17):1073–1098, tabla 4 (herramienta REDs CAT2), p. 1083.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_e6` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |

### Munakomi 2023

Autores: Munakomi, Foris y Varacallo  
Título: *Spinal Stenosis and Neurogenic Claudication*  
Publicación: StatPearls [Internet], NBK430872 (act. 2023-08-13)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo sigue en su versión del 13 de agosto de 2023 (PubMed). Se añade a la pauta de lu4 Ammendolia 2022 (revisión sistemática del tratamiento no quirúrgico de la estenosis, leída entera en PMC).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie.

Citada como:

1. Ejercicio general (A en mayores con lumbalgia crónica), con progresión de volumen e intensidad: en los ensayos con estenosis, un programa multimodal de ejercicio general y aeróbico mejoró dolor y discapacidad a los 6 meses, y el ejercicio general individualizado con terapia manual superó al ejercicio en grupo y a la atención médica habitual a los 2 meses. Estiramiento, fortalecimiento y ejercicio aeróbico; evitar caminar cuesta abajo y la extensión lumbar excesiva (Munakomi 2023). La revisión sistemática más reciente del tratamiento no quirúrgico (Ammendolia 2022) halla evidencia de calidad moderada de que un programa multimodal de terapia manual y ejercicio, con o sin educación, es eficaz y seguro, y de que las infiltraciones epidurales de corticoides no aportan mejoría clínicamente importante. Ninguna fuente fija repeticiones ni tiempos: el volumen queda a criterio del clínico.
2. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · Munakomi 2023, StatPearls, «Spinal Stenosis and Neurogenic Claudication» (tratamiento conservador) · Ammendolia 2022, BMJ Open 12:e057724 (revisión sistemática, actualización de la Cochrane de 2013; GRADE)
3. Munakomi 2023 — Munakomi, Foris y Varacallo, «Spinal Stenosis and Neurogenic Claudication», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Dosis (en el texto) | 5 · mención en el texto | 1 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Pauta de tratamiento | 5 · cita de la pauta | 2 |
| Lumbar | — | Pregunta `l_v1` · Vascular | 2 · razonamiento del cribado | 3 |
| Tobillo y pie | — | Pregunta `tp_v1` · Vascular | 2 · razonamiento del cribado | 3 |

### Nandhagopal 2024

Autores: Nandhagopal, Tiwari, Tiwari y De Cicco  
Título: *Developmental Dysplasia of the Hip*  
Publicación: StatPearls [Internet], NBK563157 (act. 2024-05-04)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 4 de mayo de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Nandhagopal 2024 — Nandhagopal, Tiwari, Tiwari y De Cicco, «Developmental Dysplasia of the Hip», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de mayo de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_os4` · Óseo / Desarrollo | 2 · razonamiento del cribado | 1 |

### Narvani 2003

Publicación: Knee Surg Sports Traumatol Arthrosc 11(6):403–8  
DOI: 10.1007/s00167-003-0390-7  
Última revisión: 2026-10 · Sin cambios: chasquido S 100 %, E 85 % y «Thomas ni sensible ni específico» comprobados en el resumen.

Citada como:

1. Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)
2. Si la sospecha persiste. Supino con ambas caderas en flexión completa; se sujeta la contralateral en flexión y la afectada se lleva a extensión completa fuera del borde de la camilla. Positivo: dolor conocido, bloqueo, chasquido o enganche (en el estudio: chasquido palpable o dolor). Si la cadera no llega a neutro, indica acortamiento de flexores, no lesión labral. No puntúa: el S 89 % / E 92 % (LR+ 11,1) no lo publicó el estudio original; lo calcularon los autores del metaanálisis de Reiman 2015 a partir de una serie de 59 casos operados, con riesgo de sesgo alto. En Narvani 2003 no fue ni sensible ni específico (positivo en 1 de 4 roturas).
3. McCarthy y Busconi 1995 (Can J Surg; serie de 59 casos con dolor de cadera refractario; referencia: artroscopia, rotura labral), S y E calculadas por los autores de Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med). En contra: Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Chasquido doloroso» | 4b · cita bajo el test | 1 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Thomas» (en `criterio`) | 4b · mención en el texto | 2 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Thomas» | 4b · cita bajo el test | 3 |

### Netterström-Wedin 2021

Publicación: Phys Ther Sport 49:214–26  
DOI: 10.1016/j.ptsp.2021.03.005  
Última revisión: **sin revisar**

Citada como:

1. Palpación del LTPAI (la más sensible). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: la palpación del LTPAI sola da resultados contradictorios (Frey 2017: S 95 %, E 86 %; Großterlinden 2016: S 43 %, E 52 %; recogidos en Netterström-Wedin 2021). La LR− 0,28 (IC 0,09–0,89) de Sman 2015 es de otra cosa: dolor en cualquiera de cinco estructuras de la sindesmosis (S 92 %, E 29 %).
2. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 262; Sman 2015 (Br J Sports Med, publicado en línea en 2013); Netterström-Wedin 2021 (Phys Ther Sport 49:214–26)
3. squeeze test (la más específica). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: Sman 2015 (RM de referencia) da S 26 %, E 88 %, LR+ 2,15 (IC 0,86–5,39); agrupado en Netterström-Wedin 2021 (4 estudios, 428 participantes), S 32 %, E 85 %, LR+ 3,16 (IC 0,95–10,49), LR− 0,77. Los dos intervalos de la LR+ cruzan el 1.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» | 4b · cita bajo el test | 2 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Squeeze test» (en `criterio`) | 4b · mención en el texto | 3 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Squeeze test» | 4b · cita bajo el test | 2 |

### NICE CG147

Publicación: Guía NICE «Peripheral arterial disease: diagnosis and management» (2012, actualizada el 11 de diciembre de 2020)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: nice.org.uk consultado (2026-10): publicada el 8 de agosto de 2012, última actualización el 11 de diciembre de 2020.  
Nota: Leídas las recomendaciones 1.3.1–1.3.4 y 1.6.1 y el contexto en nice.org.uk (2026-10). Razonamiento del cribado de cadera (c2, ca_v3) y de rodilla (r_v1); recomendaciones 1.3.1–1.3.4 releídas en la sesión de rodilla (2026-10). Releídas en la sesión de tobillo y pie (2026-10): razonamiento de tp_v1.

Citada como:

1. NICE CG147 — NICE, «Peripheral arterial disease: diagnosis and management» (2012, actualizada el 11 de diciembre de 2020), recomendaciones 1.3.1–1.3.2 y contexto.
2. NICE CG147 — NICE, «Peripheral arterial disease: diagnosis and management» (2012, actualizada el 11 de diciembre de 2020), recomendaciones 1.3.2–1.3.4 y 1.6.1, y contexto.
3. NICE CG147 — NICE, «Peripheral arterial disease: diagnosis and management» (2012, actualizada el 11 de diciembre de 2020), recomendaciones 1.3.1–1.3.4.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `c2` · Vascular | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_v3` · Vascular | 2 · razonamiento del cribado | 2 |
| Rodilla | — | Pregunta `r_v1` · Vascular | 2 · razonamiento del cribado | 3 |
| Tobillo y pie | — | Pregunta `tp_v1` · Vascular | 2 · razonamiento del cribado | 3 |

### NICE NG125

Publicación: Guía NICE «Surgical site infections: prevention and treatment» (11 de abril de 2019, actualizada el 19 de agosto de 2020)  
DOI: —  
Última revisión: **sin revisar**  
Nota: PDF del usuario, leído entero (2026-10). Trata sobre todo la prevención; para reconocer la infección aporta la definición («Terms used in this guideline»), la frecuencia («Context») y las recomendaciones 1.1.3 y 1.4.9. Razonamiento del cribado posquirúrgico (pq_herida).

Citada como:

1. NICE NG125 — NICE, «Surgical site infections: prevention and treatment» (2019, actualizada el 19 de agosto de 2020), recomendaciones 1.1.3 y 1.4.9, «Terms used in this guideline» y «Context».

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `pq_herida` · Posquirúrgico | 2 · razonamiento del cribado | 1 |

### NICE NG126

Publicación: Guía NICE «Ectopic pregnancy and miscarriage: diagnosis and initial management» (2019, actualizada el 17 de junio de 2026)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: nice.org.uk leído (2026-10). La última actualización, del 17 de junio de 2026, solo añade recomendaciones sobre la profilaxis anti-D; las de síntomas y signos del embarazo ectópico que usa h_g1 no cambian.  
Nota: Leídas las recomendaciones 1.4.1–1.4.7 (síntomas y signos del embarazo ectópico) en nice.org.uk y en el PDF aportado por el usuario (2026-10). Razonamiento del cribado de hombro (h_g1). Las CKS de NICE (cks.nice.org.uk) no son accesibles fuera del Reino Unido.

Citada como:

1. NICE NG126 — NICE, «Ectopic pregnancy and miscarriage: diagnosis and initial management» (2019, actualizada el 17 de junio de 2026), recomendaciones 1.4.1–1.4.5.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_g1` · Ginecológico | 2 · razonamiento del cribado | 1 |

### NICE NG158

Publicación: Guía NICE «Venous thromboembolic diseases: diagnosis, management and thrombophilia testing» (2020, actualizada el 2 de agosto de 2023)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Leídas las recomendaciones 1.1.1–1.1.4 y la tabla 1 (escala de Wells de dos niveles) en nice.org.uk (2026-10). Razonamiento del cribado de cadera (ca_v2) y de rodilla (r_v2); releídas en la sesión de rodilla (2026-10). Releídas en la sesión de tobillo y pie (2026-10): razonamiento de tp_v2. Releídas en la sesión del cribado posquirúrgico (2026-10), con la tabla 2 (Wells de la embolia) y las recomendaciones 1.1.15–1.1.18: razonamiento de pq_tvp, pq_tvp_ms y pq_tep.

Citada como:

1. Posible TVP: derivar hoy (NICE NG158: con Wells ≥2, ecografía en 4 horas; con 1 o menos, dímero D en 4 horas; riesgo de embolia pulmonar).
2. Si son la pantorrilla hinchada, caliente o dolorosa (no los calambres solos): posible TVP; derivar hoy (NICE NG158: con Wells ≥2, ecografía en 4 horas; con 1 o menos, dímero D en 4 horas; riesgo de embolia pulmonar).
3. NICE NG158 — NICE, «Venous thromboembolic diseases: diagnosis, management and thrombophilia testing» (2020, actualizada el 2 de agosto de 2023), recomendaciones 1.1.1–1.1.8 y 1.1.15–1.1.18, tablas 1 y 2 (escalas de Wells de dos niveles).
4. NICE NG158 — NICE, «Venous thromboembolic diseases: diagnosis, management and thrombophilia testing» (2020, actualizada el 2 de agosto de 2023), recomendaciones 1.1.1–1.1.4 y 1.1.8, y tabla 1 (escala de Wells de dos niveles).
5. NICE NG158 — NICE, «Venous thromboembolic diseases: diagnosis, management and thrombophilia testing» (2020, actualizada el 2 de agosto de 2023), recomendaciones 1.1.1–1.1.4 y tabla 1 (escala de Wells de dos niveles).
6. NICE NG158 — NICE, «Venous thromboembolic diseases: diagnosis, management and thrombophilia testing» (2020, actualizada el 2 de agosto de 2023), recomendaciones 1.1.1–1.1.8 y tabla 1 (escala de Wells de dos niveles).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `pq_tvp` · Posquirúrgico | 2 · razonamiento del cribado | 3 |
| Todas (sistemas comunes) | — | Pregunta `pq_tvp_ms` · Posquirúrgico | 2 · razonamiento del cribado | 3 |
| Todas (sistemas comunes) | — | Pregunta `pq_tep` · Posquirúrgico | 2 · razonamiento del cribado | 3 |
| Hombro | — | `sistemas.0.preguntas.1.urgencia` | 2 · mención en el texto | 1 |
| Hombro | — | `sistemas.0.preguntas.2.urgencia` | 2 · mención en el texto | 1 |
| Cadera | — | `sistemas.0.preguntas.1.urgencia` | 2 · mención en el texto | 1 |
| Cadera | — | `sistemas.0.preguntas.2.urgencia` | 2 · mención en el texto | 1 |
| Cadera | — | `sistemas.2.preguntas.1.urgencia` | 2 · mención en el texto | 2 |
| Cadera | — | Pregunta `ca_v2` · Vascular | 2 · razonamiento del cribado | 4 |
| Cervical | — | `sistemas.0.preguntas.1.urgencia` | 2 · mención en el texto | 1 |
| Cervical | — | `sistemas.0.preguntas.2.urgencia` | 2 · mención en el texto | 1 |
| Lumbar | — | `sistemas.0.preguntas.1.urgencia` | 2 · mención en el texto | 1 |
| Lumbar | — | `sistemas.0.preguntas.2.urgencia` | 2 · mención en el texto | 1 |
| Rodilla | — | `sistemas.0.preguntas.1.urgencia` | 2 · mención en el texto | 1 |
| Rodilla | — | `sistemas.0.preguntas.2.urgencia` | 2 · mención en el texto | 1 |
| Rodilla | — | Pregunta `r_v2` · Vascular | 2 · razonamiento del cribado | 5 |
| Codo | — | `sistemas.0.preguntas.1.urgencia` | 2 · mención en el texto | 1 |
| Codo | — | `sistemas.0.preguntas.2.urgencia` | 2 · mención en el texto | 1 |
| Tobillo y pie | — | `sistemas.0.preguntas.1.urgencia` | 2 · mención en el texto | 1 |
| Tobillo y pie | — | `sistemas.0.preguntas.2.urgencia` | 2 · mención en el texto | 1 |
| Tobillo y pie | — | `sistemas.5.preguntas.1.urgencia` | 2 · mención en el texto | 1 |
| Tobillo y pie | — | Pregunta `tp_v2` · Vascular | 2 · razonamiento del cribado | 6 |

### NICE NG19

Publicación: Guía NICE «Diabetic foot problems: prevention and management» (2015, actualizada el 11 de octubre de 2019)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Leídas las recomendaciones 1.3.4, 1.3.6, 1.4.1–1.4.2 y 1.7.1–1.7.4 en nice.org.uk (2026-10). Razonamiento del cribado de tobillo y pie (tp_n2).

Citada como:

1. Hermena y Slane 2025 (StatPearls, «Ankle Fracture»); NICE NG19, rec. 1.7.1
2. NICE NG19 — NICE, «Diabetic foot problems: prevention and management» (2015, actualizada el 11 de octubre de 2019), recomendaciones 1.3.4, 1.3.6, 1.4.1–1.4.2 y 1.7.1–1.7.3.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp37 · Fractura de Tobillo (Maleolar) | Pronóstico | 5 · cita del pronóstico | 1 |
| Tobillo y pie | — | Pregunta `tp_n2` · Neurológico | 2 · razonamiento del cribado | 2 |

### NICE NG226

Publicación: Guía NICE «Osteoarthritis in over 16s: diagnosis and management» (19 de octubre de 2022)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: nice.org.uk leído (2026-10), la guía sigue siendo la de 2022, sin actualizaciones. Respalda el diagnóstico clínico de ro1 (sin S ni E; no puntúa) y su pauta (recomendaciones 1.3.1–1.3.11).

Citada como:

1. NICE NG226 (2022). Metcalfe 2019 (JAMA) para la rigidez matutina
2. Koc 2025, J Orthop Sports Phys Ther 55(11):CPG1–CPG31 (guía de práctica clínica APTA, revisión de 2025; letra = grado de la recomendación, tal como la da la guía) · NICE NG226 (rec. 1.3.1–1.3.11; donde chocan, se dan las dos posturas)
3. NICE NG226 (2022)
4. NICE NG226 (2022; recomendaciones 1.3.1–1.3.11, leídas en nice.org.uk en 2026-10; NICE marca la fuerza con el verbo: «offer» = recomendación firme, «consider» = más débil, «do not offer» = no hacer)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca1 · Artrosis de Cadera | Test «Criterio clínico combinado: Edad ≥45 + dolor en actividad + rigidez <1h» | 4b · cita bajo el test | 1 |
| Cadera | ca1 · Artrosis de Cadera | Pauta de tratamiento | 5 · cita de la pauta | 2 |
| Rodilla | ro1 · Artrosis de Rodilla | Test «Criterio combinado: Edad ≥45 + dolor en actividad + rigidez <30 min» | 4b · cita bajo el test | 3 |
| Rodilla | ro1 · Artrosis de Rodilla | Pauta de tratamiento | 5 · cita de la pauta | 4 |

### NICE NG38

Publicación: Guía NICE «Fractures (non-complex): assessment and management» (2016)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Leída la recomendación 1.2.2 (reglas de Ottawa de tobillo y pie a partir de los 5 años) en nice.org.uk (2026-10). Razonamiento del cribado de tobillo y pie (tp_t2).

Citada como:

1. NICE NG38 — NICE, «Fractures (non-complex): assessment and management» (2016), recomendación 1.2.2.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | — | Pregunta `tp_t2` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### NICE NG59

Publicación: Guía NICE «Low back pain and sciatica in over 16s: assessment and management» (2016, actualizada en julio de 2026)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: nice.org.uk leído (2026-10), última actualización 29 de julio de 2026; las recomendaciones citadas (1.2.1, 1.2.6, 1.2.7 —corregida en 2026—, 1.3.1–1.3.3 y 1.3.6) dicen lo que recoge la app.  
Nota: Leídas las recomendaciones en nice.org.uk (2026-10). Pauta de lu1, lu3 y lu5–lu9; derivación de lu4 y lu7.

Citada como:

1. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · NICE NG59 (rec. 1.2.1 y 1.2.7; actualizada en julio de 2026)
2. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · NICE NG59 (rec. 1.2.6 y 1.2.7; actualizada en julio de 2026)
3. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 313–314 · NICE NG59 (rec. 1.3.6)
4. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · NICE NG59 (rec. 1.2.1, 1.2.6 y 1.2.7; actualizada en julio de 2026)
5. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C) · NICE NG59 (rec. 1.2.7; actualizada en julio de 2026)
6. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 319–320 · NICE NG59 (rec. 1.3.1–1.3.3, derivación)
7. Al-Subahi 2017, J Phys Ther Sci 29(9):1689–1694 (revisión sistemática, 9 estudios de 2004–2014 de calidad baja o media: manipulación, ejercicio y vendaje neuromuscular) · Trager 2024, J Man Manip Ther 32(6):561–572 (revisión sistemática con metaanálisis, 16 ensayos; GRADE) · NICE NG59 (rec. 1.2.7; actualizada en julio de 2026)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu1 · Disfunción Segmentaria Lumbosacra (Déficit de Movilidad) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Lumbar | lu3 · Dolor Radicular Lumbar | Pauta de tratamiento | 5 · cita de la pauta | 2 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Pronóstico | 5 · cita del pronóstico | 3 |
| Lumbar | lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Pauta de tratamiento | 5 · cita de la pauta | 4 |
| Lumbar | lu6 · Dolor Lumbar Discogénico | Pauta de tratamiento | 5 · cita de la pauta | 5 |
| Lumbar | lu7 · Dolor Lumbar Facetario | Pronóstico | 5 · cita del pronóstico | 6 |
| Lumbar | lu7 · Dolor Lumbar Facetario | Pauta de tratamiento | 5 · cita de la pauta | 5 |
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Pauta de tratamiento | 5 · cita de la pauta | 7 |
| Lumbar | lu9 · Síndrome de Dolor Miofascial Lumbar | Pauta de tratamiento | 5 · cita de la pauta | 5 |

### NICE NG89

Publicación: Guía NICE «Venous thromboembolism in over 16s: reducing the risk of hospital-acquired deep vein thrombosis or pulmonary embolism» (21 de marzo de 2018, actualizada el 13 de agosto de 2019)  
DOI: —  
Última revisión: **sin revisar**  
Nota: PDF del usuario (2026-10): leídas las recomendaciones 1.1–1.3 y 1.10–1.15 (riesgo, información al alta y profilaxis por tipo de cirugía). Razonamiento del cribado posquirúrgico (pq_tvp, pq_tvp_ms).

Citada como:

1. NICE NG89 — NICE, «Venous thromboembolism in over 16s: reducing the risk of hospital-acquired deep vein thrombosis or pulmonary embolism» (2018, actualizada el 13 de agosto de 2019), recomendaciones 1.2.4, 1.11.1–1.11.16 y 1.12.1–1.12.3.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `pq_tvp` · Posquirúrgico | 2 · razonamiento del cribado | 1 |
| Todas (sistemas comunes) | — | Pregunta `pq_tvp_ms` · Posquirúrgico | 2 · razonamiento del cribado | 1 |

### Nori y Stretanski 2025

Autores: Nori y Stretanski  
Título: *Foot Drop*  
Publicación: StatPearls [Internet], NBK554393 (act. 2025-05-01)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 1 de mayo de 2025 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie.

Citada como:

1. Nori y Stretanski 2025 — Nori y Stretanski, «Foot Drop», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `ro_t5` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_n1` · Neurológico | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_n2` · Neurológico | 2 · razonamiento del cribado | 1 |

### Nunes 2013

Publicación: Phys Ther Sport 14:54–9  
DOI: 10.1016/j.ptsp.2012.11.003  
Última revisión: 2026-10 · Cita corregida (PDF del usuario): la revisión solo hizo metaanálisis del test de aprensión rotuliana; la cifra de la sentadilla (S 91 %, E 50 %, LR+ 1,8, LR− 0,2, tabla 3) es de un solo estudio, Cook 2010, que pasa a citarse. Mismas cifras, sin cambio de puntuación. PubMed (revisiones de tests clínicos de dolor femoropatelar desde 2013) no encuentra ninguna posterior.

Citada como:

1. Nunes 2013 (Phys Ther Sport 14:54–9; revisión sistemática, 5 estudios, tabla 3); la cifra de la sentadilla es de Cook 2010 (Physiother Can 62:17–24; 76 pacientes consecutivos con dolor anterior de rodilla, dolor femoropatelar frente a otros diagnósticos; calidad intermedia en QUADAS: no consta el cegamiento del examinador)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro3 · Dolor Patelofemoral (Síndrome) | Test «Dolor anterior durante sentadilla» | 4b · cita bajo el test | 1 |

### O'Driscoll 2005

Autores: O'Driscoll, Lawton y Smith  
Título: *The "moving valgus stress test" for medial collateral ligament tears of the elbow*  
Publicación: Am J Sports Med 33(2):231–239  
DOI: 10.1177/0363546504267804  
Última revisión: **sin revisar**  
Nota: Resumen en PubMed (PMID 15701609; no está en PMC). Comprobación de las cifras que da Lluch 2020, cap. 3.2, p. 86, invertidas. Test de valgo dinámico de co4 (codo).

Citada como:

1. Reproducción del dolor medial con estrés en valgo dinámico. En el único estudio (O'Driscoll 2005; Zwerus 2018, tabla 4) fue más sensible que el valgo estático con dolor (100 % frente a 64,7 %). Test de valgo móvil (O'Driscoll 2005): hombro en abducción y rotación externa, valgo mantenido con el codo en flexión completa y extensión rápida; positivo si reproduce el dolor medial, máximo entre 120° y 70°. En 21 pacientes operados: S 100 % (17/17), E 75 % (3 de 4 controles). Lluch 2020 (p. 86) da las cifras invertidas (S 75 %, E 100 %). Zwerus 2018 (tabla 4) da las mismas cifras que el original, con LR+ 4 (IC 0,7–21,8, que cruza el 1); es el texto de la revisión el que las invierte, y de ahí las copia Lluch. Cuenta como hallazgo: la especificidad sale de solo 4 controles y el IC de la LR+ incluye el 1. La maniobra de ordeño es otra prueba (Zwerus 2018, tabla 5), sin estudios de precisión.
2. O'Driscoll 2005 (Am J Sports Med 33:231–239; resumen en PubMed) · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 86
3. Sentado, codo a 70° de flexión y antebrazo en supinación máxima; estrés en valgo comparado con el otro codo; positivo si reproduce el dolor medial. Tradicionalmente se hace a 20–30°, pero el codo es más inestable a 70°. El dolor es más sensible y la laxitud, más específica (Lluch). En O'Driscoll 2005 (Zwerus, tabla 4): S 64,7 %, E 50 % (solo 4 controles), LR+ 1,29 (IC 0,46–3,66), LR− 0,71: no cambia la probabilidad, cuenta como hallazgo.
4. La misma maniobra, valorando la apertura medial o la falta de tope firme frente al otro codo. En O'Driscoll 2005 (Zwerus, tabla 4): S 18,8 %, E 100 % (solo 4 controles; la LR+ no se puede calcular), LR− 0,81: cuenta como hallazgo.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Test de valgo móvil (moving valgus stress test)» (en `criterio`) | 4b · mención en el texto | 1 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Test de valgo móvil (moving valgus stress test)» | 4b · cita bajo el test | 2 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Test de valgo estático (dolor)» (en `criterio`) | 4b · mención en el texto | 3 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Test de valgo estático (laxitud)» (en `criterio`) | 4b · mención en el texto | 4 |

### O'Driscoll 2007

Autores: O'Driscoll, Goncalves y Dietz  
Título: *The hook test for distal biceps tendon avulsion*  
Publicación: Am J Sports Med 35(11):1865–1869  
DOI: 10.1177/0363546507305016  
Última revisión: **sin revisar**  
Nota: Leído en la sesión de codo (2026-10). Resumen en PubMed (PMID 17687121). Hook test de co7 (codo).

Citada como:

1. Con el codo en 90° de flexión activa y antebrazo supinado, se intenta "enganchar" el tendón del bíceps con el dedo índice. Imposible si hay rotura. Puntúa solo cuando es normal: en la cohorte de Devereaux y ElMaraghy (48 pacientes con sospecha de rotura, confirmada con cirugía o RM), S 81 %, E 100 % (IC 54–100: solo 6 sin rotura completa), LR− 0,19 (IC 0,10–0,36); la LR+ no se puede calcular. En O'Driscoll 2007 (45 operados, el brazo sano como control) dio S y E del 100 %.
2. Devereaux y ElMaraghy 2013 (Am J Sports Med 41:1998–2004; cohorte), recogido en Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · O'Driscoll 2007 (Am J Sports Med 35:1865–1869; resumen en PubMed) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84–85 y 102

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co7 · Rotura Distal del Bíceps | Test «Test del Gancho (Hook Test)» (en `criterio`) | 4b · mención en el texto | 1 |
| Codo | co7 · Rotura Distal del Bíceps | Test «Test del Gancho (Hook Test)» | 4b · cita bajo el test | 2 |

### Ochi 2011

Autores: Ochi, Horiuchi, Tanabe, Morita, Takeda y Ninomiya  
Título: *Comparison of shoulder internal rotation test with the elbow flexion test in the diagnosis of cubital tunnel syndrome*  
Publicación: J Hand Surg Am 36(5):782–787  
DOI: 10.1016/j.jhsa.2010.12.019  
Última revisión: **sin revisar**  
Nota: Leído en la sesión de codo (2026-10). Solo el resumen en PubMed (PMID 21349657; no está en PMC). SIRT de co8 (codo).

Citada como:

1. Hombro en 90° de abducción, rotación interna máxima y 10° de flexión, codo a 90°, antebrazo neutro y muñeca y dedos extendidos; positivo si reproduce los síntomas en 10 segundos. Ochi 2011 (25 pacientes; 54 controles sin síntomas y 14 con otras neuropatías): a los 10 segundos, S 80 % y ningún control positivo. Ochi 2012, a los 5 segundos: S 58 %, E 100 %. Cuenta como hallazgo: estudios de casos y controles del autor del test.
2. Ochi 2011 (J Hand Surg Am 36:782–787; resumen en PubMed) · Ochi 2012 (J Shoulder Elbow Surg 21:777–781) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 101

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Test de rotación interna del hombro con flexión del codo (SIRT)» (en `criterio`) | 4b · mención en el texto | 1 |
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Test de rotación interna del hombro con flexión del codo (SIRT)» | 4b · cita bajo el test | 2 |

### Ochi 2012

Autores: Ochi, Horiuchi, Tanabe, Waseda, Kaneko y Koyanagi  
Título: *Shoulder internal rotation elbow flexion test for diagnosing cubital tunnel syndrome*  
Publicación: J Shoulder Elbow Surg 21(6):777–781  
DOI: 10.1016/j.jse.2011.10.015  
Última revisión: **sin revisar**  
Nota: Leído en la sesión de codo (2026-10). PDF aportado por el usuario. Tests de provocación de co8 (codo).

Citada como:

1. Flexión pasiva mantenida del codo durante 60 segundos; positivo si reproduce las parestesias en el territorio cubital. En Ochi 2012 (55 nervios con túnel cubital frente a 123 controles sin síntomas, de un solo cirujano), a los 5 segundos: S 25 %, E 100 %. Según los estudios que recoge Ochi, la S es del 75 % al minuto y del 86–93 % a los 3 minutos (el rango que da Lluch). Las «LR+ 27–41» que atribuye Lluch a los tests de provocación no aparecen en Ochi 2012. Cuenta como hallazgo: con controles sin síntomas la especificidad se sobrestima.
2. Ochi 2012 (J Shoulder Elbow Surg 21:777–781; casos y controles) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 101
3. Hombro en 90° de abducción, rotación interna máxima y 10° de flexión, codo a 90°, antebrazo neutro y muñeca y dedos extendidos; positivo si reproduce los síntomas en 10 segundos. Ochi 2011 (25 pacientes; 54 controles sin síntomas y 14 con otras neuropatías): a los 10 segundos, S 80 % y ningún control positivo. Ochi 2012, a los 5 segundos: S 58 %, E 100 %. Cuenta como hallazgo: estudios de casos y controles del autor del test.
4. Ochi 2011 (J Hand Surg Am 36:782–787; resumen en PubMed) · Ochi 2012 (J Shoulder Elbow Surg 21:777–781) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 92 y 101
5. Como el SIRT (hombro en 90° de abducción, 10° de flexión y rotación interna máxima), pero con el codo en flexión máxima, el antebrazo en supinación máxima y la muñeca y los dedos en extensión máxima; positivo si reproduce o agrava los síntomas en el territorio cubital en menos de 5 segundos. Ochi 2012: S 87 % (48/55), E 98 % (121/123), LR+ 42,5 publicada; más sensible que el test de flexión y el SIRT de 5 segundos. Cuenta como hallazgo: casos y controles, con controles sin síntomas de un solo cirujano, y el propio estudio advierte de que el desfiladero torácico y otros diagnósticos podrían dar positivo.
6. Ochi 2012 (J Shoulder Elbow Surg 21:777–781; casos y controles, tabla 1)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Test de flexión del codo» (en `criterio`) | 4b · mención en el texto | 1 |
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Test de flexión del codo» | 4b · cita bajo el test | 2 |
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Test de rotación interna del hombro con flexión del codo (SIRT)» (en `criterio`) | 4b · mención en el texto | 3 |
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Test de rotación interna del hombro con flexión del codo (SIRT)» | 4b · cita bajo el test | 4 |
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Test de rotación interna del hombro con flexión máxima del codo (SIREFT)» (en `criterio`) | 4b · mención en el texto | 5 |
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Test «Test de rotación interna del hombro con flexión máxima del codo (SIREFT)» | 4b · cita bajo el test | 6 |

### Oliver y Ashurst 2023

Autores: Oliver y Ashurst  
Título: *Anatomy, Thorax, Phrenic Nerves*  
Publicación: StatPearls [Internet], NBK513325 (act. 2023-07-24)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 24 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Oliver y Ashurst 2023 — Oliver y Ashurst, «Anatomy, Thorax, Phrenic Nerves», StatPearls [Internet], NCBI Bookshelf, última actualización 24 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h5` · Pulmonar | 2 · razonamiento del cribado | 1 |
| Hombro | — | Pregunta `h_p3` · Pulmonar | 2 · razonamiento del cribado | 1 |
| Hombro | — | Pregunta `h_r1` · Renal / Urológico | 2 · razonamiento del cribado | 1 |
| Hombro | — | Pregunta `h_g1` · Ginecológico | 2 · razonamiento del cribado | 1 |
| Hombro | — | Pregunta `h_g2` · Ginecológico | 2 · razonamiento del cribado | 1 |

### Ophey 2025

Autores: Ophey, Koëter, van Ooijen, van Ark, Boots, Ilbrink y cols.  
Título: *Dutch multidisciplinary guideline on anterior knee pain: Patellofemoral pain and patellar tendinopathy*  
Publicación: Knee Surg Sports Traumatol Arthrosc 33(2):457–469  
DOI: 10.1002/ksa.12367  
Última revisión: 2026-10 · Sin cambios: PubMed (guías de dolor femoropatelar y de tendinopatía rotuliana desde 2024) no encuentra ninguna posterior; la guía de buena práctica de BJSM (2024) es anterior y de menos peso.  
Nota: Guía de práctica clínica (AGREE II y GRADE); texto completo leído en PMC (2026-10). Pautas de ro3 y ro5 y criterios diagnósticos de ro5. Más reciente que Willy 2019 (mismo nivel): manda en lo que discrepan.

Citada como:

1. Ophey 2025, Knee Surg Sports Traumatol Arthrosc 33:457–469 (guía multidisciplinar holandesa, módulos 1–3; certeza GRADE como la da la guía) · Willy 2019, J Orthop Sports Phys Ther 49(9):CPG1–CPG95 (guía de práctica clínica APTA, resumen de recomendaciones, pp. CPG2–CPG3; letra = grado de la recomendación)
2. Ophey 2025 (Knee Surg Sports Traumatol Arthrosc 33:457–469; guía multidisciplinar holandesa, módulo 4; certeza GRADE muy baja); Cook 2001 (Br J Sports Med 35:65–9; 326 tendones de jóvenes jugadores de baloncesto; referencia: ecografía)
3. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 192–193; Ophey 2025 (Knee Surg Sports Traumatol Arthrosc 33:457–469; guía multidisciplinar holandesa, módulo 4; certeza GRADE muy baja); Mendonça 2016 (J Orthop Sports Phys Ther 46:673–80; 43 deportistas de competición de voleibol, baloncesto, fútbol y carrera, con y sin dolor en el tendón rotuliano; referencia: ecografía)
4. Ophey 2025, Knee Surg Sports Traumatol Arthrosc 33:457–469 (guía multidisciplinar holandesa, módulos 5–7; certeza GRADE muy baja) · Lopes 2025, Cochrane Database Syst Rev 5:CD013078 (revisión sistemática, 7 ensayos, 211 deportistas)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro3 · Dolor Patelofemoral (Síndrome) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Rodilla | ro5 · Tendinopatía Rotuliana | Test «Dolor localizado en polo inferior de rótula + palpación del tendón» | 4b · cita bajo el test | 2 |
| Rodilla | ro5 · Tendinopatía Rotuliana | Test «Dolor durante sentadilla en tabla inclinada (decline squat)» | 4b · cita bajo el test | 3 |
| Rodilla | ro5 · Tendinopatía Rotuliana | Pauta de tratamiento | 5 · cita de la pauta | 4 |

### Pak y Kim 2023

Autores: Pak y Kim  
Título: *Anterior Glenohumeral Joint Dislocation*  
Publicación: StatPearls [Internet], NBK557862 (act. 2023-05-01)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 1 de mayo de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Pak y Kim 2023 — Pak y Kim, «Anterior Glenohumeral Joint Dislocation», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de mayo de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_t1` · Traumático (Fractura o Luxación) | 2 · razonamiento del cribado | 1 |
| Hombro | — | Pregunta `h_n1` · Neurológico | 2 · razonamiento del cribado | 1 |

### Pålsson 2020

Publicación: Knee Surg Sports Traumatol Arthrosc 28(10):3382–92  
DOI: 10.1007/s00167-020-06005-5  
Última revisión: 2026-10 · Sin cambios: texto completo leído (PMC7511272); RI en neutro S 29 % (13–44), E 94 % (86–100), kappa 0,43. El mismo estudio da para el FADIR S 80 %, E 24 % (ver Reiman 2015).

Citada como:

1. Pålsson 2020 (Knee Surg Sports Traumatol Arthrosc; 69 caderas de 63 pacientes derivados a atención especializada, 35 con SIFA; referencia: síntomas + morfología cam/pincer + respuesta a infiltración intraarticular; S IC 95 %: 67–93 %, E IC 9–38 %). Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral, tabla 4: 4 estudios, n = 319, referencia: cirugía, probabilidad previa 90 %; LR− IC 95 %: 0,02–0,93; con artro-RM como referencia, 4 estudios, n = 188: LR− 0,45, IC 0,19–1,09)
2. Pålsson 2020 (Knee Surg Sports Traumatol Arthrosc; 69 caderas de 63 pacientes derivados a atención especializada, 35 con SIFA; referencia: síntomas + morfología cam/pincer + respuesta a infiltración intraarticular). S IC 95 %: 13–44 %; E IC 86–100 %

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test FADDIR (Flexión-Aducción-Rotación Interna)» | 4b · cita bajo el test | 1 |
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Rotación Interna de cadera en posición neutra <24°» | 4b · cita bajo el test | 2 |

### Pana y Saggu 2023

Autores: Pana y Saggu  
Título: *Dystonia*  
Publicación: StatPearls [Internet], NBK448144 (act. 2023-09-04)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Pana y Saggu 2023 — Pana y Saggu, «Dystonia», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de septiembre de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_n2` · Médula / Estructural | 2 · razonamiento del cribado | 1 |

### Pangia 2025

Autores: Pangia, Taqi y Rizvi  
Título: *Olecranon Bursitis*  
Publicación: StatPearls [Internet], NBK470291 (act. 2025-12-13)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de codo.

Citada como:

1. Pangia 2025 — Pangia, Taqi y Rizvi, «Olecranon Bursitis», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de diciembre de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co1` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |
| Codo | — | Pregunta `co2` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |

### Paquin 2022

Publicación: Arch Physiother 12:26  
DOI: 10.1186/s40945-022-00153-2  
Última revisión: **sin revisar**

Citada como:

1. Demont 2022 (Musculoskelet Sci Pract, metaanálisis, 4 estudios, n = 182; frente a cefalea facetaria cervical baja, migraña, cefaleas concomitantes o asintomáticos; certeza moderada. S IC 95 %: 70–92 %; E IC 95 %: 71–91 %; LR+ IC 2,6–9,5; LR− IC 0,1–0,4; 4 estudios de cohorte prospectivos de Hall y Ogince, 2007–2010; riesgo de sesgo por la selección de pacientes). FRT normal en cervicogénica de C2–C3/C3–C4: Getsoian 2020 (BMJ Open, bloqueos diagnósticos controlados), citado en Demont 2022. Precauciones: Paquin 2022 (Arch Physiother 12:26, artículo de opinión)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce4 · Cefalea Cervicogénica | Test «Test de Flexión-Rotación Cervical (CFRT)» | 4b · cita bajo el test | 1 |

### Park 2005

Publicación: J Bone Joint Surg Am  
DOI: 10.2106/jbjs.d.02335  
Última revisión: 2026-10 · Sin cambios: PDF del usuario leído entero (2026-10). Tabla V: 50 de 153 roturas completas frente a 4 de 195 controles con los tres test positivos (LR+ 15,57) y 14 de 153 frente a 114 de 195 con los tres negativos (LR 0,16), en 348 operados con los tres test hechos. La combinación sale de una regresión logística en la misma muestra, sin validación; ninguno de los artículos que lo citan (Europe PMC) la valida. Hermans 2013 lo clasifica como nivel IV y Hanchard 2013 (Cochrane) lo deja pendiente de clasificar.

Citada como:

1. Dolor durante la elevación activa entre 60° y 120°. Metaanálisis de 4 estudios (n = 756): LR+ 2,25 (IC 1,24–4,08), LR− 0,62 (IC 0,37–1,03), modelo bivariante. Sirve algo para confirmar; un negativo es solo un hallazgo. Un metaanálisis posterior (Zhao 2024, 6 estudios, bivariante) da LR+ 1,57 (1,07–2,31), LR− 0,63, pero su tabla 2×2 de Park 2005 suma 718 pacientes de un estudio de 552: se mantiene la cifra de Hegedus.
2. Park 2005 (J Bone Joint Surg Am; n = 552 operados con artroscopia, 215 roturas completas; tabla V)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Arco doloroso» (en `criterio`) | 4b · mención en el texto | 1 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Cluster A, confirmar: arco doloroso + drop arm + debilidad en RE, los tres positivos» | 4b · cita bajo el test | 2 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Cluster A, descartar: arco doloroso, drop arm y debilidad en RE, los tres negativos (si se cumple, marcar «Negativo»)» | 4b · cita bajo el test | 2 |

### Park 2008

Publicación: Arch Phys Med Rehabil 89:738–742  
DOI: 10.1016/j.apmr.2007.09.048  
Última revisión: **sin revisar**

Citada como:

1. Park 2008 (Arch Phys Med Rehabil 89:738–742; prospectivo, un solo radiólogo)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co2 · Tendinopatía Medial (Epicondilalgia Medial / Codo de Golfista) | Test «Ecografía (si se dispone de informe)» | 4b · cita bajo el test | 1 |

### Park 2019

Publicación: Medicine 98:e15497  
DOI: 10.1097/md.0000000000015497  
Última revisión: **sin revisar**

Citada como:

1. Park 2019 (Medicine 98:e15497): punto de máximo dolor en la línea radiocapitelar en 20 de 24 · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 83–84 y 100 (dolor localizado en la línea radiohumeral posterolateral: sospechar un problema intraarticular)
2. Park 2019 (Medicine 98:e15497; retrospectivo, n = 24 frente a 56)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co6 · Dolor Radiohumeral / Pinzamiento Posterolateral por Plica Radiocapitelar | Test «Dolor posterolateral en línea articular radiocapitelar a la palpación» | 4b · cita bajo el test | 1 |
| Codo | co6 · Dolor Radiohumeral / Pinzamiento Posterolateral por Plica Radiocapitelar | Test «Test de plica radiocapitelar posterolateral» | 4b · cita bajo el test | 2 |

### Patel 2025

Autores: Patel, Azmat y Goethals  
Título: *Femoral Hernia*  
Publicación: StatPearls [Internet], NBK535449 (act. 2025-05-03)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 3 de mayo de 2025 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Patel 2025 — Patel, Azmat y Goethals, «Femoral Hernia», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de mayo de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_gi3` · Gastrointestinal | 2 · razonamiento del cribado | 1 |

### Patil 2024

Autores: Patil, Rehman, Anastasopoulou y Jialal  
Título: *Hypothyroidism*  
Publicación: StatPearls [Internet], NBK519536 (act. 2024-02-18)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de codo.

Citada como:

1. Patil 2024 — Patil, Rehman, Anastasopoulou y Jialal, «Hypothyroidism», StatPearls [Internet], NCBI Bookshelf, última actualización 18 de febrero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co_e1` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |

### Peat 2006

Publicación: Ann Rheum Dis 65(10):1363–7  
DOI: 10.1136/ard.2006.051482  
Última revisión: 2026-10 · Texto completo leído (PMC1798313, tabla 3). Más recientes en la misma dirección, solo resumen: Miguel 2019 (Clin Rheumatol) y Wang 2024 (Arthritis Care Res).

Citada como:

1. Peat 2006 (Ann Rheum Dis 65:1363–7; transversal en población general, 788 personas de 50 años o más con dolor de rodilla; formato en árbol de los criterios; referencia: síntomas casi diarios + artrosis radiográfica; tabla 3: S IC 95 %: 35–47 %, E IC 95 %: 71–78 %)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro1 · Artrosis de Rodilla | Test «Criterios clínicos del ACR» | 4b · cita bajo el test | 1 |

### Pencle y Varacallo 2023

Autores: Pencle y Varacallo  
Título: *Proximal Humerus Fracture*  
Publicación: StatPearls [Internet], NBK470346 (act. 2023-08-04)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 4 de agosto de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Pencle y Varacallo 2023 — Pencle y Varacallo, «Proximal Humerus Fracture», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_t1` · Traumático (Fractura o Luxación) | 2 · razonamiento del cribado | 1 |
| Hombro | — | Pregunta `h_n1` · Neurológico | 2 · razonamiento del cribado | 1 |

### Pitcher 2024

Publicación: Foot Ankle Orthop 9(4)  
DOI: 10.1177/24730114241291055  
Última revisión: **sin revisar**

Citada como:

1. Dolor a la palpación directa del espacio (sobre todo 3.º–4.º); posible chasquido al palpar mientras se comprimen los metatarsianos. No puntúa: la compresión pulgar-índice del espacio (Mahadevan 2015) tiene S 96 %, pero su especificidad sale de un solo pie sin Morton; el chasquido de Mulder da LR+ 2,19 (IC 0,45–10,60; Dando, en Pitcher 2024).
2. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 275 y 281; Mahadevan 2015 (J Foot Ankle Surg 54:549–53); Pitcher 2024 (Foot Ankle Orthop 9(4))

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» | 4b · cita bajo el test | 2 |

### Pope 2023

Autores: Pope, El Bitar, Mabrouk y Plexousakis  
Título: *Quadriceps Tendon Rupture*  
Publicación: StatPearls [Internet], NBK482389 (act. 2023-04-22)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 22 de abril de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Pope 2023 — Pope, El Bitar, Mabrouk y Plexousakis, «Quadriceps Tendon Rupture», StatPearls [Internet], NCBI Bookshelf, última actualización 22 de abril de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `ro_t2` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### Prill 2025

Autores: Prill, Ma, Wong, Beaufils, Monllau y cols. (consenso ESSKA-AOSSM-AASPT)  
Título: *The formal EU-US Meniscus Rehabilitation 2024 Consensus: An ESSKA-AOSSM-AASPT initiative. Part II—Prevention, non-operative treatment and return to sport*  
Publicación: Knee Surg Sports Traumatol Arthrosc 33(8):3014–3024  
DOI: 10.1002/ksa.12689  
Última revisión: 2026-10 · Sin cambios: es lo más reciente sobre el tratamiento sin cirugía de las lesiones de menisco; la guía AAOS 2024 (leída entera) solo da para la fisioterapia una opción de consenso, coherente con este.  
Nota: Texto completo leído en PMC (2026-10). Consenso formal de 67 expertos (cirujanos y fisioterapeutas); grados A (respaldo científico alto) a D (opinión de expertos). Pauta de ro2 sin cirugía, con Logerstedt 2018 para el posoperatorio.

Citada como:

1. Prill 2025, Knee Surg Sports Traumatol Arthrosc 33(8):3014–3024 (consenso formal EU-US de rehabilitación del menisco, ESSKA-AOSSM-AASPT, parte II: tratamiento sin cirugía; grados A a D, de más respaldo científico a opinión de expertos); Logerstedt 2018, J Orthop Sports Phys Ther 48(2):A1–A50 (guía de práctica clínica APTA, lesiones de menisco y de cartílago articular: tras la meniscectomía; deja el tratamiento sin cirugía para su próxima revisión; letra = grado de la recomendación, tal como la da la guía); AAOS 2024 (guía de práctica clínica de patología meniscal aislada aguda, opciones «Physical Therapy» e «Indications for Acute Surgical Intervention»)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro2 · Lesión Meniscal | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Quzli 2025

Autores: Quzli, Elheet y Quzali  
Título: *Posterolateral Rotatory Instability of the Elbow: A Practice-Focused Narrative Review*  
Publicación: Cureus 17(11):e96151  
DOI: 10.7759/cureus.96151  
Última revisión: **sin revisar**  
Nota: Revisión narrativa (fuentes elegidas por relevancia, sin protocolo); texto completo leído en Europe PMC. Leído en la sesión de dosis de codo (2026-10). Pauta de co5, presentada como opinión.

Citada como:

1. Rinkel 2013, Clin J Pain 29(12):1087–1096 (revisión sistemática) · Quzli 2025, Cureus 17(11):e96151 (revisión narrativa, sin protocolo: opinión de los autores)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Raj 2023

Autores: Raj, Creech y Rogol  
Título: *Female Athlete Triad*  
Publicación: StatPearls [Internet], NBK430787 (act. 2023-08-08)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie.

Citada como:

1. Raj 2023 — Raj, Creech y Rogol, «Female Athlete Triad», StatPearls [Internet], NCBI Bookshelf, última actualización 8 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | — | Pregunta `tp_o2` · Fractura de Estrés | 2 · razonamiento del cribado | 1 |

### Rana 2026

Autores: Rana, Mehan, Hassan, Gohil, Tyagi y Maffulli  
Título: *Diagnostic accuracy of clinical examination versus MRI for meniscal tears: a systematic review and meta-analysis*  
Publicación: Br Med Bull 159(1):ldag023  
DOI: 10.1093/bmb/ldag023  
Última revisión: 2026-10 · Sin cambios: es la revisión más reciente de la exploración clínica compuesta del menisco; por decisión del usuario no sustituye a Solomon 2001 (sin LR, agrupación univariante, cirujanos ortopédicos, pacientes que iban a artroscopia).  
Nota: PDF del usuario leído entero (2026-10). 10 estudios (1643 rodillas) con exploración, RM y artroscopia en el mismo paciente; exploración compuesta (6 estudios en el medial, 7 en el lateral): medial S 85 % (82–88), E 95 % (92–97); lateral S 75 % (70–79), E 93 % (91–95). Citada en el criterio de la combinación de tests clínicos de ro2.

Citada como:

1. Valoración global del examinador (historia + exploración) para rotura meniscal: rinde mejor que cada maniobra suelta (McMurray LR+ 1,3; línea articular 0,9 en la misma revisión). 5 estudios con artroscopia: S media 77 %, E media 91 %. Más reciente, Rana 2026 (Br Med Bull 159:ldag023; 6 y 7 estudios con exploración compuesta, todos con RM y artroscopia en el mismo paciente) da S 85 % y E 95 % en el menisco medial y S 75 % y E 93 % en el lateral, pero sin LR, con agrupación univariante, exploraciones hechas por cirujanos ortopédicos y pacientes que iban a artroscopia: no sustituye a estas LR. La guía AAOS 2024 recomienda la exploración combinada (interlínea, McMurray, Thessaly) con fuerza moderada, sin cifras agrupadas.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro2 · Lesión Meniscal | Test «Combinación de tests clínicos» (en `criterio`) | 4b · mención en el texto | 1 |

### Rathbone 2017

Autores: Rathbone, Grosman-Rimon y Kumbhare  
Título: *Interrater Agreement of Manual Palpation for Identification of Myofascial Trigger Points: A Systematic Review and Meta-Analysis*  
Publicación: Clin J Pain 33(8):715–729  
DOI: 10.1097/AJP.0000000000000459  
Última revisión: 2026-10 · Sin cambios: PubMed (fiabilidad de la palpación de puntos gatillo o banda tensa, revisiones sistemáticas desde 2009) no encuentra ninguna posterior.  
Nota: PDF del usuario (2026-10), leído entero. Banda tensa y reconocimiento del dolor de lu9.

Citada como:

1. Rathbone 2017 (Clin J Pain, metaanálisis de fiabilidad) · Lucas 2009 (revisión sistemática de fiabilidad previa)
2. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 323–324 · Rathbone 2017 (Clin J Pain, fiabilidad)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu9 · Síndrome de Dolor Miofascial Lumbar | Test «Banda tensa palpable» | 4b · cita bajo el test | 1 |
| Lumbar | lu9 · Síndrome de Dolor Miofascial Lumbar | Test «El paciente reconoce el dolor provocado» | 4b · cita bajo el test | 2 |

### Rathleff 2020

Publicación: Orthop J Sports Med 8(4):2325967120911106  
DOI: 10.1177/2325967120911106  
Última revisión: 2026-10 · Sin cambios: la revisión posterior de tratamientos de Osgood-Schlatter (Ndjonko 2026, Orthop J Sports Med, revisión de alcance, nivel 4) no aporta ningún ensayo ni pauta mejor.

Citada como:

1. Rathleff 2020, Orthop J Sports Med 8(4):2325967120911106 (serie de casos, n = 51, 10–14 años, sin grupo control: nivel de evidencia 4; pauta de su apéndice 1)
2. Rathleff 2020, Orthop J Sports Med 8(4):2325967120911106 (Osgood-Schlatter, aplicado por analogía: no hay estudios en Sever ni Iselin; serie de casos, n = 51, 10–14 años, nivel de evidencia 4)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Tobillo y pie | tp36 · Apofisitis y Osteocondrosis Pediátricas (Sever, Iselin, Köhler, Freiberg) | Pauta de tratamiento | 5 · cita de la pauta | 2 |

### Regunath y Oba 2024

Autores: Regunath y Oba  
Título: *Community-Acquired Pneumonia*  
Publicación: StatPearls [Internet], NBK430749 (act. 2024-01-26)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 26 de enero de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Regunath y Oba 2024 — Regunath y Oba, «Community-Acquired Pneumonia», StatPearls [Internet], NCBI Bookshelf, última actualización 26 de enero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_p3` · Pulmonar | 2 · razonamiento del cribado | 1 |

### Reid 2014

Publicación: Phys Ther 94(4):466–476  
DOI: 10.2522/ptj.20120483  
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
DOI: 10.4085/1062-6050-49.3.36  
Última revisión: **sin revisar**

Citada como:

1. Thompson: prono, pie fuera de la camilla; al comprimir la pantorrilla el tobillo no se mueve → S 96 % · E 93 % → derivación preferente. Maffulli 1998: 133 roturas confirmadas en cirugía y 28 controles con lesión posterior sin rotura (26 negativos; 2 dudosos contados como falsos positivos). LR de Reiman 2014 con esos datos: LR+ 13,71 (IC 95 % 3,54–51,24), LR− 0,04 (0,02–0,10). Límite: la especificidad sale de solo 28 controles.
2. Maffulli 1998 (Am J Sports Med 26:266–70); LR: Reiman 2014 (J Athl Train 49:820–9)
3. Hueco palpable, que se pierde con el tiempo. Maffulli 1998 (paciente despierto): S 73 %, E 89 %; LR de Reiman 2014: LR+ 6,64 (IC 95 % 2,32–19,91), LR− 0,30 (0,23–0,40). Es otro test que Thompson, pero en el mismo paciente: si los dos son positivos, el peso conjunto puede estar algo sobrestimado.
4. Batería progresiva: ETM bipodal → monopodal → saltos bipodales → monopodales, hasta reproducir; dolor localizado (1–2 dedos). EVA en cada escalón. Aquiles: la palpación no ayuda al diagnóstico. No puntúa: la única cifra de estos gestos es de Hutchison 2013 (estudio piloto, 10 tendinopatías; en Reiman 2014): ETM monopodal S 22 %, E 93 %, LR+ 3,14; salto S 43 %, E 87 %, LR+ 3,31, sin intervalo de confianza publicado.
5. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), pp. 237 y 243; Reiman 2014 (J Athl Train 49:820–9)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp3 · Rotura del Aquiles | Test «Thompson (Simmonds)» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp3 · Rotura del Aquiles | Test «Thompson (Simmonds)» | 4b · cita bajo el test | 2 |
| Tobillo y pie | tp3 · Rotura del Aquiles | Test «Hueco palpable» (en `criterio`) | 4b · mención en el texto | 3 |
| Tobillo y pie | tp3 · Rotura del Aquiles | Test «Hueco palpable» | 4b · cita bajo el test | 2 |
| Tobillo y pie | tp8 · Tendinopatía del Aquiles, Porción Media | Test «Batería progresiva de carga» (en `criterio`) | 4b · mención en el texto | 4 |
| Tobillo y pie | tp8 · Tendinopatía del Aquiles, Porción Media | Test «Batería progresiva de carga» | 4b · cita bajo el test | 5 |

### Reiman 2015

Publicación: Br J Sports Med 49(12):811  
DOI: 10.1136/bjsports-2014-094302  
Última revisión: 2026-10 · Texto completo leído (tablas 3 y 4): cifras correctas, pero el FADDIR agrupado sale de pacientes operados (probabilidad previa 90 %) y los propios autores concluyen que ningún test cambia de forma significativa la probabilidad. El FADDIR pasa a hallazgo en SIFA (con Pålsson 2020) y en labrum. Revisiones posteriores (Shanmugaraj 2020, Fernandes 2022, Dhillon 2025) no dan un valor agrupado mejor.

Citada como:

1. Cadera a 90° de flexión, aducción completa y rotación interna máxima. Positivo: dolor conocido, bloqueo, chasquido o enganche. En pacientes derivados con sospecha de SIFA, S 80 %, E 24 % (LR− 0,83): no puntúa. Un negativo orienta algo en contra, pero no descarta. El valor agrupado de Reiman 2015 (S 99 %, E 5 %, LR− 0,14) sale de pacientes ya operados, con una probabilidad previa del 90 % y un IC del LR− que llega a 0,93.
2. Pålsson 2020 (Knee Surg Sports Traumatol Arthrosc; 69 caderas de 63 pacientes derivados a atención especializada, 35 con SIFA; referencia: síntomas + morfología cam/pincer + respuesta a infiltración intraarticular; S IC 95 %: 67–93 %, E IC 9–38 %). Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral, tabla 4: 4 estudios, n = 319, referencia: cirugía, probabilidad previa 90 %; LR− IC 95 %: 0,02–0,93; con artro-RM como referencia, 4 estudios, n = 188: LR− 0,45, IC 0,19–1,09)
3. Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral: 2 estudios, n = 27)
4. McCarthy y Busconi 1995 (Can J Surg; serie de 59 casos con dolor de cadera refractario; referencia: artroscopia, rotura labral), S y E calculadas por los autores de Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med)
5. Reiman 2015 (BJSM, metaanálisis de FAIS/rotura labral, tabla 4: 4 estudios, n = 319, referencia: cirugía, probabilidad previa 90 %; LR− IC 95 %: 0,02–0,93; con artro-RM como referencia, 4 estudios, n = 188: LR− 0,45, IC 0,19–1,09). Adib 2023 (Am J Sports Med; retrospectivo; referencia: artro-RM)
6. Si la sospecha persiste. Supino con ambas caderas en flexión completa; se sujeta la contralateral en flexión y la afectada se lleva a extensión completa fuera del borde de la camilla. Positivo: dolor conocido, bloqueo, chasquido o enganche (en el estudio: chasquido palpable o dolor). Si la cadera no llega a neutro, indica acortamiento de flexores, no lesión labral. No puntúa: el S 89 % / E 92 % (LR+ 11,1) no lo publicó el estudio original; lo calcularon los autores del metaanálisis de Reiman 2015 a partir de una serie de 59 casos operados, con riesgo de sesgo alto. En Narvani 2003 no fue ni sensible ni específico (positivo en 1 de 4 roturas).
7. McCarthy y Busconi 1995 (Can J Surg; serie de 59 casos con dolor de cadera refractario; referencia: artroscopia, rotura labral), S y E calculadas por los autores de Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med). En contra: Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test FADDIR (Flexión-Aducción-Rotación Interna)» (en `criterio`) | 4b · mención en el texto | 1 |
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test FADDIR (Flexión-Aducción-Rotación Interna)» | 4b · cita bajo el test | 2 |
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test de flexión-rotación interna» | 4b · cita bajo el test | 3 |
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test de Thomas» | 4b · cita bajo el test | 4 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de flexión-rotación interna» | 4b · cita bajo el test | 3 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «FADDIR (valor agrupado)» | 4b · cita bajo el test | 5 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Thomas» (en `criterio`) | 4b · mención en el texto | 6 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Thomas» | 4b · cita bajo el test | 7 |

### Rennie y Saifuddin 2005

Autores: Rennie y Saifuddin  
Título: *Pes anserine bursitis: incidence in symptomatic knees and clinical presentation*  
Publicación: Skeletal Radiol 34(7):395–8  
DOI: 10.1007/s00256-005-0918-7  
Última revisión: 2026-10 · Sin cambios: PubMed (bursitis de la pata de ganso, diagnóstico y prevalencia desde 2015) no encuentra ningún estudio de precisión diagnóstica ni revisión sistemática.  
Nota: Leído el resumen de PubMed (2026-10). Presentación clínica de ro7.

Citada como:

1. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 211–212; Rennie y Saifuddin 2005 (Skeletal Radiol 34:395–8; revisión retrospectiva de 509 RM de rodillas con dolor)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro7 · Bursitis de la Pata de Ganso | Test «Dolor y tumefacción en cara medial de rodilla (inserción pata de ganso)» | 4b · cita bajo el test | 1 |

### Rhodes 2022

Autores: Rhodes, Denault y Varacallo  
Título: *Physiology, Oxygen Transport*  
Publicación: StatPearls [Internet], NBK538336 (act. 2022-11-14)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Rhodes 2022 — Rhodes, Denault y Varacallo, «Physiology, Oxygen Transport», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de noviembre de 2022.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `hem_2` · Hematológico | 2 · razonamiento del cribado | 1 |

### Rich 2025

Autores: Rich, Ford, Cook y Hahne  
Título: *Physiotherapy Compared With Shockwave Therapy for the Treatment of Proximal Hamstring Tendinopathy: A Randomized Controlled Trial*  
Publicación: Am J Sports Med 53(14):3396–3407  
DOI: 10.1177/03635465251391134  
Última revisión: 2026-10 · Sin cambios: es el ensayo más reciente sobre tendinopatía proximal de isquiotibiales (PubMed, revisiones y ensayos desde 2024).  
Nota: Texto completo en PMC12657663. El protocolo detallado de fisioterapia está enviado a publicación aparte. Dosis de ca9 (cadera). El apéndice (tabla A1, criterios de inclusión: dolor isquiático reproducido por 3 de 4 pruebas de carga o compresión) se leyó en los ficheros suplementarios de Europe PMC (2026-10): test de fuerza de ca9.

Citada como:

1. Reproduce su dolor isquiático al cargar los isquiotibiales, sobre todo en estiramiento: flexión de rodilla resistida con la cadera a 90°, plancha supina a una pierna o puente a una pierna con la rodilla flexionada. En el ensayo de Rich 2025 se exigía que 3 de 4 pruebas de carga o compresión reprodujeran el dolor. Sin S ni E: cuenta como hallazgo.
2. Grimaldi 2026 (Musculoskelet Sci Pract 84:103592, revisión narrativa, tabla 1). Rich 2025 (Am J Sports Med 53:3396–3407, apéndice, tabla A1: criterios de inclusión)
3. Rich 2025, Am J Sports Med 53:3396–3407 (ensayo aleatorizado, n = 100, fisioterapia frente a ondas de choque, los dos con la misma educación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca9 · Tendinopatía Proximal de Isquiotibiales | Test «Dolor con test de fuerza de isquiotibiales» (en `criterio`) | 4b · mención en el texto | 1 |
| Cadera | ca9 · Tendinopatía Proximal de Isquiotibiales | Test «Dolor con test de fuerza de isquiotibiales» | 4b · cita bajo el test | 2 |
| Cadera | ca9 · Tendinopatía Proximal de Isquiotibiales | Pauta de tratamiento | 5 · cita de la pauta | 3 |

### Rider y Marra 2023

Autores: Rider y Marra  
Título: *Cauda Equina and Conus Medullaris Syndromes*  
Publicación: StatPearls [Internet], NBK537200 (act. 2023-08-07)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 7 de agosto de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Rider y Marra 2023 — Rider y Marra, «Cauda Equina and Conus Medullaris Syndromes», StatPearls [Internet], NCBI Bookshelf, última actualización 7 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l6` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Rinkel 2013

Autores: Rinkel, Schreuders, Koes y Huisstede  
Título: *Current evidence for effectiveness of interventions for cubital tunnel syndrome, radial tunnel syndrome, instability, or bursitis of the elbow: a systematic review*  
Publicación: Clin J Pain 29(12):1087–1096  
DOI: 10.1097/AJP.0b013e31828b8e7d  
Última revisión: **sin revisar**  
Nota: Revisión sistemática (1 revisión y 6 ensayos; búsqueda hasta enero de 2012). PDF aportado por el usuario. Leído en la sesión de dosis de codo (2026-10). Pautas de co5 y co8; sin ningún ensayo del túnel radial (co9, sin pauta).

Citada como:

1. Rinkel 2013, Clin J Pain 29(12):1087–1096 (revisión sistemática) · Quzli 2025, Cureus 17(11):e96151 (revisión narrativa, sin protocolo: opinión de los autores)
2. Caliandro 2025, Cochrane Database Syst Rev (4):CD006839 (revisión Cochrane, 15 ensayos; solo el resumen) · Rinkel 2013, Clin J Pain 29(12):1087–1096 (revisión sistemática) · Bateman 2025, Hand Ther 30(3):105–112 (revisión sistemática con GRADE; solo el resumen)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Codo | co8 · Neuropatía Cubital (Síndrome del Túnel Cubital) | Pauta de tratamiento | 5 · cita de la pauta | 2 |

### Rishor-Olney 2024

Autores: Rishor-Olney, Taqi y Pozun  
Título: *Prepatellar Bursitis*  
Publicación: StatPearls [Internet], NBK557508 (act. 2024-01-04)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 4 de enero de 2024 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Rishor-Olney 2024 — Rishor-Olney, Taqi y Pozun, «Prepatellar Bursitis», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de enero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `r_i3` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |

### Rout 2024

Autores: Rout, Reynolds y Zito  
Título: *Neutropenia*  
Publicación: StatPearls [Internet], NBK507702 (act. 2024-06-07)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Rout 2024 — Rout, Reynolds y Zito, «Neutropenia», StatPearls [Internet], NCBI Bookshelf, última actualización 7 de junio de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `hem_3` · Hematológico | 2 · razonamiento del cribado | 1 |

### Rowe 2023

Autores: Rowe, Koller y Sharma  
Título: *Physiology, Bone Remodeling*  
Publicación: StatPearls [Internet], NBK499863 (act. 2023-03-17)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 17 de marzo de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie.

Citada como:

1. Rowe 2023 — Rowe, Koller y Sharma, «Physiology, Bone Remodeling», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de marzo de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_e4` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_e5` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_o1` · Fractura de Estrés | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_o2` · Fractura de Estrés | 2 · razonamiento del cribado | 1 |

### Rupp y Leslie 2023

Autores: Rupp y Leslie  
Título: *Epididymitis*  
Publicación: StatPearls [Internet], NBK430814 (act. 2023-07-17)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 17 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Rupp y Leslie 2023 — Rupp y Leslie, «Epididymitis», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_u2` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_u3` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Rushton 2023

Autores: Rushton, Carlesso, Flynn, Hing, Rubinstein, Vogel y Kerry  
Título: *International Framework for Examination of the Cervical Region for Potential of Vascular Pathologies of the Neck Prior to Musculoskeletal Intervention: International IFOMPT Cervical Framework*  
Publicación: J Orthop Sports Phys Ther 53(1):7–22  
DOI: 10.2519/jospt.2022.11147  
Última revisión: **sin revisar**  
Nota: Declaración de posición del marco IFOMPT cervical (aprobado en 2020). PDF del artículo aportado por el usuario: no está en PMC y el documento de ifompt.org no es accesible desde la red del entorno. Fe de erratas en J Orthop Sports Phys Ther 53(6):372 (corrige las cifras de riesgo de los AINE de la tabla 9; no afecta al cribado).

Citada como:

1. Rushton 2023 — Rushton, Carlesso, Flynn, Hing, Rubinstein, Vogel y Kerry, «International Framework for Examination of the Cervical Region for Potential of Vascular Pathologies of the Neck Prior to Musculoskeletal Intervention: International IFOMPT Cervical Framework», J Orthop Sports Phys Ther 2023;53(1):7–22 (marco IFOMPT cervical aprobado en 2020), tablas 1–2, 4, 6 y 7, pp. 9–12; «Differentiation during the patient examination», p. 16; riesgo, p. 17.
2. Rushton 2023 — Rushton, Carlesso, Flynn, Hing, Rubinstein, Vogel y Kerry, «International Framework for Examination of the Cervical Region for Potential of Vascular Pathologies of the Neck Prior to Musculoskeletal Intervention: International IFOMPT Cervical Framework», J Orthop Sports Phys Ther 2023;53(1):7–22 (marco IFOMPT cervical aprobado en 2020), tablas 2, 5 y 6, pp. 11–12; «Planning the physical examination», p. 14.
3. Rushton 2023 — Rushton, Carlesso, Flynn, Hing, Rubinstein, Vogel y Kerry, «International Framework for Examination of the Cervical Region for Potential of Vascular Pathologies of the Neck Prior to Musculoskeletal Intervention: International IFOMPT Cervical Framework», J Orthop Sports Phys Ther 2023;53(1):7–22 (marco IFOMPT cervical aprobado en 2020), «Importance of observation throughout history», p. 13.
4. Rushton 2023 — Rushton, Carlesso, Flynn, Hing, Rubinstein, Vogel y Kerry, «International Framework for Examination of the Cervical Region for Potential of Vascular Pathologies of the Neck Prior to Musculoskeletal Intervention: International IFOMPT Cervical Framework», J Orthop Sports Phys Ther 2023;53(1):7–22 (marco IFOMPT cervical aprobado en 2020), tabla 1, p. 9.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_ar1` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_ar2` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 2 |
| Cervical | — | Pregunta `cv_ar3` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 3 |
| Cervical | — | Pregunta `cv_ar4` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 4 |

### Sabry y Li 2026

Autores: Sabry y Li  
Título: *Legg-Calve-Perthes Disease*  
Publicación: StatPearls [Internet], NBK513230 (act. 2026-03-25)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 25 de marzo de 2026 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera y rodilla.

Citada como:

1. Sabry y Li 2026 — Sabry y Li, «Legg-Calve-Perthes Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de marzo de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_os3` · Óseo / Desarrollo | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_os4` · Óseo / Desarrollo | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `ro_p1` · Niño o Adolescente | 2 · razonamiento del cribado | 1 |

### Salamh 2025

Autores: Salamh, Stoner, Ruley, Zhu, Bateman, Chester, Da Baets, Gibson, Hollmann, Kelley, Lewis, McClure, McCreesh, Mertens, Michener, Seitz, Struyf, Zuckerman y King  
Título: *An international consensus on the etiology, risk factors, diagnosis and Management for individuals with Frozen Shoulder: a Delphi study*  
Publicación: J Man Manip Ther 33(4):309–320  
DOI: 10.1080/10669817.2025.2470461  
Última revisión: 2026-10 · Sin cambios: consenso de 2025; búsqueda en PubMed (2026-10) sin guía ni consenso posterior sobre el hombro congelado.  
Nota: PDF aportado por el usuario. Consenso Delphi de 14 expertos (12 fisioterapeutas): opinión de expertos, no evidencia de eficacia. Pauta de h1 y test de rotación externa de h1.

Citada como:

1. Kelley 2013 (J Orthop Sports Phys Ther 43(5):A1–A31, pp. A9 y A26) · Salamh 2025 (J Man Manip Ther 33(4):309–320, tabla 2) · Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 72
2. Kelley 2013, J Orthop Sports Phys Ther 43(5):A1–A31 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · Salamh 2025, J Man Manip Ther 33(4):309–320 (consenso Delphi de 14 expertos; % = acuerdo del panel; es opinión de expertos, no evidencia de eficacia)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h1 · Capsulitis Adhesiva | Test «Test de Rotación Externa (brazo neutro al lado, codo 90°)» | 4b · cita bajo el test | 1 |
| Hombro | h1 · Capsulitis Adhesiva | Pauta de tratamiento | 5 · cita de la pauta | 2 |

### Sanchez-Alvarado 2024

Autores: Sanchez-Alvarado, Bokil, Cassel y Engel  
Título: *Effects of conservative treatment strategies for iliotibial band syndrome on pain and function in runners: a systematic review*  
Publicación: Front Sports Act Living 6:1386456  
DOI: 10.3389/fspor.2024.1386456  
Última revisión: 2026-10 · Sin cambios: hay una revisión posterior, Ferrero 2026 (Orthop Res Rev, 24 estudios, resumen leído), que concluye que la rehabilitación estructurada es la primera opción y que ningún tratamiento puede recomendarse sobre otro por la heterogeneidad; no contradice la pauta de ro6.  
Nota: Revisión sistemática; texto completo leído en PMC (2026-10). Pauta de ro6.

Citada como:

1. Sanchez-Alvarado 2024, Front Sports Act Living 6:1386456 (revisión sistemática; 13 estudios, 5 de ellos ensayos aleatorizados, 201 corredores)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro6 · Síndrome de la Banda Iliotibial | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Sanvictores 2023

Autores: Sanvictores, Jozsa y Tadi  
Título: *Neuroanatomy, Autonomic Nervous System Visceral Afferent Fibers and Pain*  
Publicación: StatPearls [Internet], NBK560843 (act. 2023-07-30)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 30 de julio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Sanvictores 2023 — Sanvictores, Jozsa y Tadi, «Neuroanatomy, Autonomic Nervous System Visceral Afferent Fibers and Pain», StatPearls [Internet], NCBI Bookshelf, última actualización 30 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv2` · Cardiovascular | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_gi1` · Gastrointestinal | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l4` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l1` · Gastrointestinal | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l3` · Gastrointestinal | 2 · razonamiento del cribado | 1 |

### Saueressig 2021

Publicación: J Orthop Sports Phys Ther 51(9):422–431  
DOI: 10.2519/jospt.2021.10469  
Última revisión: 2026-10 · Sin cambios: PubMed (clústeres de provocación sacroilíaca, revisiones sistemáticas) no encuentra ninguna posterior; solo una carta sobre su método (Vraa 2022, JOSPT 52(1):49–50). PDF leído entero en la sesión de cadera (2026-10): metaanálisis bivariante (Reitsma, paquete mada), 5 estudios con doble o simple bloqueo; incluye el estudio de los creadores (Laslett 2003) y excluye Laslett 2005 por ser la misma población. S 0,83, E 0,59, LR+ 2,13 (1,2–3,9), LR− 0,33 (0,11–0,72), certeza muy baja. Pasa a ser la fuente del cluster de ca10 y de lu8 (decisión del usuario, se prefiere el bivariante como en ro4).

Citada como:

1. Saueressig 2021 (J Orthop Sports Phys Ther 51:422–431; metaanálisis bivariante, 5 estudios de 34 a 60 pacientes con dolor lumbar crónico y sospecha de dolor sacroilíaco; referencia: bloqueo anestésico intraarticular; incluye el estudio de los creadores, Laslett 2003). Laslett 2008 (J Man Manip Ther 16:142–152); Laslett 2005 (Man Ther 10:207–218, tablas 4–6 y fig. 7); Han 2023 (eClinicalMedicine 59:101960, tabla 1: 6 estudios); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153
2. Saueressig 2021 (J Orthop Sports Phys Ther 51:422–431; metaanálisis bivariante, 5 estudios; LR+ IC 95 %: 1,2–3,9, LR− 0,11–0,72; referencia: bloqueo anestésico intraarticular; incluye el estudio de los creadores, Laslett 2003): certeza muy baja (GRADE); descarta mejor de lo que confirma. Misma regla que la tarjeta lumbar: 3 de 5 positivos. Han 2023 (eClinicalMedicine, revisión sistemática, 6 estudios, sin aclarar el modelo y con dos publicaciones de la misma población): LR+ 2,44, LR− 0,31

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Cluster de Laslett: 3 o más de 5 tests de provocación positivos» | 4b · cita bajo el test | 1 |
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Cluster «Tests de provocación SI (3 de 5)» | 4b · cita del cluster | 2 |

### Schick y Sternard 2023

Autores: Schick y Sternard  
Título: *Testicular Torsion*  
Publicación: StatPearls [Internet], NBK448199 (act. 2023-06-12)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 12 de junio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Schick y Sternard 2023 — Schick y Sternard, «Testicular Torsion», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de junio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_u3` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Seaberg 1998

Autores: Seaberg, Yealy, Lukens, Auble y Mathias  
Título: *Multicenter comparison of two clinical decision rules for the use of radiography in acute, high-risk knee injuries*  
Publicación: Ann Emerg Med 32(1):8–13  
DOI: 10.1016/s0196-0644(98)70092-7  
Última revisión: 2026-10 · Sin cambios: PubMed (regla de Pittsburgh de rodilla desde 2015) no encuentra ninguna revisión sistemática ni validación posterior.  
Nota: Leído el resumen de PubMed (2026-10): Pittsburgh S 99 % (IC 94–100), E 60 % (IC 56–64), en 745 pacientes. Paso 1b del árbol de rodilla.

Citada como:

1. ¿Algún criterio de Ottawa (≥55 años · cabeza del peroné · rótula aislada · no flexiona 90° · no carga cuatro pasos)? Y en toda rodilla traumática con dolor anterior, elevación de la pierna extendida. Alternativa a Ottawa: Pittsburgh — contusión o caída MÁS (<12 o >50 años, o no puede caminar); S ≈99 % con E ≈60 %, pide menos radiografías (Seaberg y Jackson 1994; Seaberg 1998).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | `steps.1.question` | 4 · mención en el texto | 1 |

### Seaberg y Jackson 1994

Autores: Seaberg y Jackson  
Título: *Clinical decision rule for knee radiographs*  
Publicación: Am J Emerg Med 12(5):541–3  
DOI: 10.1016/0735-6757(94)90274-7  
Última revisión: 2026-10 · Sin cambios: estudio de creación de la regla; ver Seaberg 1998.  
Nota: Estudio que crea la regla de Pittsburgh (caída o traumatismo cerrado MÁS no poder caminar o edad <12 o >50 años); leído el resumen de PubMed (2026-10). Paso 1b del árbol de rodilla.

Citada como:

1. ¿Algún criterio de Ottawa (≥55 años · cabeza del peroné · rótula aislada · no flexiona 90° · no carga cuatro pasos)? Y en toda rodilla traumática con dolor anterior, elevación de la pierna extendida. Alternativa a Ottawa: Pittsburgh — contusión o caída MÁS (<12 o >50 años, o no puede caminar); S ≈99 % con E ≈60 %, pide menos radiografías (Seaberg y Jackson 1994; Seaberg 1998).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | `steps.1.question` | 4 · mención en el texto | 1 |

### Seaman y Bergman 2026

Autores: Seaman y Bergman  
Título: *Calcaneus Fractures*  
Publicación: StatPearls [Internet], NBK430861 (act. 2026-08-11)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie.

Citada como:

1. Seaman y Bergman 2026 — Seaman y Bergman, «Calcaneus Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 11 de agosto de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | — | Pregunta `tp_t4` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### See 2026

Autores: See, Loo y Jaafar  
Título: *Eccentric exercise therapy for medial epicondylitis: A systematic review of clinical outcomes*  
Publicación: Complement Ther Med 98:103364  
DOI: 10.1016/j.ctim.2026.103364  
Última revisión: **sin revisar**  
Nota: Revisión sistemática (5 estudios, 143 pacientes; GRADE bajo a muy bajo). PDF aportado por el usuario. Leído en la sesión de dosis de codo (2026-10). Pauta de co2.

Citada como:

1. See 2026, Complement Ther Med 98:103364 (revisión sistemática; certeza GRADE baja a muy baja)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co2 · Tendinopatía Medial (Epicondilalgia Medial / Codo de Golfista) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Sekhon 2023

Autores: Sekhon, Sharma y Cascella  
Título: *Thunderclap Headache*  
Publicación: StatPearls [Internet], NBK560629 (act. 2023-06-04)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Sekhon 2023 — Sekhon, Sharma y Cascella, «Thunderclap Headache», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de junio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_ar4` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 1 |

### Sendrea 2026

Autores: Sendrea, Periferakis, Periferakis, Xefteris, Troumpata, Periferakis, Scheau, Preda, Nedelea, Vulpe, Birlutiu, Scheau y Cergan  
Título: *Infectious Spondylodiscitis of Bacterial Causes in Adults: Epidemiology, Pathophysiology, Diagnostic and Treatment Challenges*  
Publicación: Microorganisms 14(5):1110  
DOI: 10.3390/microorganisms14051110  
Última revisión: 2026-10 · Sin cambios: publicada en 2026; no se buscó literatura posterior.  
Nota: Revisión narrativa; texto completo en PMC13210327, leído en PubMed Central (2026-10). Razonamiento de l_inf1 (infección vertebral, lumbar).

Citada como:

1. Sendrea 2026 — Sendrea, Periferakis, Periferakis, Xefteris, Troumpata, Periferakis, Scheau, Preda, Nedelea, Vulpe, Birlutiu, Scheau y Cergan, «Infectious Spondylodiscitis of Bacterial Causes in Adults: Epidemiology, Pathophysiology, Diagnostic and Treatment Challenges», Microorganisms 2026;14(5):1110 (texto completo en PMC), apartados 2, 3.2 y 6.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_inf1` · Infección vertebral | 2 · razonamiento del cribado | 1 |

### Serner 2020

Autores: Serner, Weir, Tol, Thorborg, Lanzinger, Otten y Hölmich  
Título: *Return to Sport After Criteria-Based Rehabilitation of Acute Adductor Injuries in Male Athletes: A Prospective Cohort Study*  
Publicación: Orthop J Sports Med 8(1):2325967119897247  
DOI: 10.1177/2325967119897247  
Última revisión: 2026-10 · Sin cambios: la revisión sistemática más reciente sobre la lesión aguda del aductor (Farrell, Hatem y Bharam 2023, Am J Sports Med 51(13):3591–3603, doi 10.1177/03635465221140923; PDF del usuario leído entero, 2026-10) la incluye (ref. 40) y no aporta otra pauta: 30 estudios, síntesis narrativa sin metaanálisis; las roturas parciales se trataron siempre sin cirugía, con vuelta al deporte en 1–7 semanas. Da las medias de Serner 2020 (sin dolor a las 1,9 semanas, entrenamiento completo a las 6,9; recaída al año 7,4 %); la pauta de ca11 usa las medianas por grado del propio artículo.  
Nota: Texto completo en PMC6990618; el apéndice 2 (series y cargas) no se consultó. Dosis de ca11 (cadera).

Citada como:

1. Serner 2020, Orthop J Sports Med 8(1):2325967119897247 (cohorte prospectiva, n = 81 varones de 18 a 40 años, sin grupo control)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca11 · Lesión Aguda de Ingle | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Sevy 2023

Autores: Sevy, Sina y Varacallo  
Título: *Carpal Tunnel Syndrome*  
Publicación: StatPearls [Internet], NBK448179 (act. 2023-10-29)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de codo.

Citada como:

1. Sevy 2023 — Sevy, Sina y Varacallo, «Carpal Tunnel Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 29 de octubre de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | — | Pregunta `co_e1` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |

### Shahid 2023

Autores: Shahid, Ashraf y Sharma  
Título: *Physiology, Thyroid Hormone*  
Publicación: StatPearls [Internet], NBK500006 (act. 2023-06-05)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Releído en la sesión de codo (2026-10): razonamiento del cribado de codo.

Citada como:

1. Shahid 2023 — Shahid, Ashraf y Sharma, «Physiology, Thyroid Hormone», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de junio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `end_3` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |
| Codo | — | Pregunta `co_e2a` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |

### Shamrock 2023

Autores: Shamrock, Dreyer y Varacallo  
Título: *Achilles Tendon Rupture*  
Publicación: StatPearls [Internet], NBK430844 (act. 2023-08-17)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie.

Citada como:

1. Shamrock 2023 — Shamrock, Dreyer y Varacallo, «Achilles Tendon Rupture», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | — | Pregunta `tp_t3` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### Shams 2025

Autores: Shams, Malik y Chhabra  
Título: *Heart Failure (Congestive Heart Failure)*  
Publicación: StatPearls [Internet], NBK430873 (act. 2025-02-26)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Shams 2025 — Shams, Malik y Chhabra, «Heart Failure (Congestive Heart Failure)», StatPearls [Internet], NCBI Bookshelf, última actualización 26 de febrero de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_p2` · Pulmonar | 2 · razonamiento del cribado | 1 |

### Shaw 2025

Autores: Shaw, Loree y Oropallo  
Título: *Abdominal Aortic Aneurysm*  
Publicación: StatPearls [Internet], NBK470237 (act. 2025-01-19)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 19 de enero de 2025 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Shaw 2025 — Shaw, Loree y Oropallo, «Abdominal Aortic Aneurysm», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_v2` · Vascular | 2 · razonamiento del cribado | 1 |

### Siemensma 2023

Autores: Siemensma, van der Windt, van Es, Colaris y Eygendaal  
Título: *Management of the stiff elbow: a literature review*  
Publicación: EFORT Open Rev 8(5):351–360  
DOI: 10.1530/EOR-23-0039  
Última revisión: **sin revisar**  
Nota: Revisión narrativa; texto completo leído en Europe PMC. Leído en la sesión de dosis de codo (2026-10). Pauta de co3 (indicación del tratamiento conservador y uso de las férulas, esto último opinión de los autores).

Citada como:

1. Wistow 2025, JSES Int 9(6):2146–2155 (revisión sistemática, 9 estudios y 312 participantes, sin metaanálisis) · Siemensma 2023, EFORT Open Rev 8(5):351–360 (revisión narrativa)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co3 · Rigidez del Codo (Contractura Postraumática o Capsular) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Sims 2020

Autores: Sims, Chau y Davies  
Título: *Diagnostic accuracy of the Ottawa Knee Rule in adult acute knee injuries: a systematic review and meta-analysis*  
Publicación: Eur Radiol 30(8):4438–46  
DOI: 10.1007/s00330-020-06804-x  
Última revisión: 2026-10 · Sin cambios: PDF del usuario leído entero (antes solo el resumen); S 0,99, E 0,49, LR+ 1,86 y LR− 0,07 (0,02–0,24), 8 estudios y 7385 adultos, con modelo bivariante. Sigue citada como concordante con Kazemi 2023 (decisión del usuario).  
Nota: Revisión sistemática (8 estudios, 7385 adultos; S 99 %, E 49 %, LR− 0,07); leído el resumen de PubMed (2026-10). Concordante con Kazemi 2023 en ro11 y ro_t1.

Citada como:

1. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), p. 197; Kazemi 2023 (Arch Acad Emerg Med 11:e30; revisión sistemática con metaanálisis univariante, 18 estudios, 6702 adultos); Sims 2020 (Eur Radiol 30:4438–46; metaanálisis bivariante, 8 estudios, 7385 adultos: S 99 %, E 49 %, LR− 0,07); Bachmann 2004 (Ann Intern Med 140:121–4; 6 estudios, 4249 adultos: S 98,5 %, E 48,6 %, LR− 0,05)
2. Sims 2020 — Sims, Chau y Davies, «Diagnostic accuracy of the Ottawa Knee Rule in adult acute knee injuries: a systematic review and meta-analysis», Eur Radiol 2020;30(8):4438–46.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro11 · Fracturas (Rótula o Meseta Tibial) | Test «Regla de Ottawa antes de nada» | 4b · cita bajo el test | 1 |
| Rodilla | — | Pregunta `ro_t1` · Traumático / Mecánico | 2 · razonamiento del cribado | 2 |

### Singleton y Hefner 2023

Autores: Singleton y Hefner  
Título: *Spinal Cord Compression*  
Publicación: StatPearls [Internet], NBK557604 (act. 2023-02-13)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Singleton y Hefner 2023 — Singleton y Hefner, «Spinal Cord Compression», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de febrero de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv4` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv1` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_p1` · Pulmonar | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv3` · Renal / Urológico | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_in1` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |

### Sman 2015

Publicación: Br J Sports Med  
DOI: 10.1136/bjsports-2013-092787  
Última revisión: **sin revisar**

Citada como:

1. Palpación del LTPAI (la más sensible). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: la palpación del LTPAI sola da resultados contradictorios (Frey 2017: S 95 %, E 86 %; Großterlinden 2016: S 43 %, E 52 %; recogidos en Netterström-Wedin 2021). La LR− 0,28 (IC 0,09–0,89) de Sman 2015 es de otra cosa: dolor en cualquiera de cinco estructuras de la sindesmosis (S 92 %, E 29 %).
2. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 262; Sman 2015 (Br J Sports Med, publicado en línea en 2013); Netterström-Wedin 2021 (Phys Ther Sport 49:214–26)
3. squeeze test (la más específica). Si las dos reproducen el dolor conocido, sospechar lesión. Sin cifras en el capítulo. No puntúa: Sman 2015 (RM de referencia) da S 26 %, E 88 %, LR+ 2,15 (IC 0,86–5,39); agrupado en Netterström-Wedin 2021 (4 estudios, 428 participantes), S 32 %, E 85 %, LR+ 3,16 (IC 0,95–10,49), LR− 0,77. Los dos intervalos de la LR+ cruzan el 1.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Palpación del LTPAI» | 4b · cita bajo el test | 2 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Squeeze test» (en `criterio`) | 4b · mención en el texto | 3 |
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Test «Squeeze test» | 4b · cita bajo el test | 2 |

### Smidt y Massey 2023

Autores: Smidt y Massey  
Título: *5th Metatarsal Fracture*  
Publicación: StatPearls [Internet], NBK544369 (act. 2023-05-29)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie.

Citada como:

1. Smidt y Massey 2023 — Smidt y Massey, «5th Metatarsal Fracture», StatPearls [Internet], NCBI Bookshelf, última actualización 29 de mayo de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | — | Pregunta `tp_t2` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### Smith 2015

Publicación: Evid Based Med 20:88–97  
DOI: 10.1136/ebmed-2014-110160  
Última revisión: 2026-10 · Cifras actualizadas en ro2 (PDF del usuario, tabla 3): el metaanálisis es bivariante y publica LR, que antes no se usaban (se calculaban desde S y E): McMurray LR+ 3,2, LR− 0,52; interlínea LR+ 4,0, LR− 0,23. Con ellas el McMurray negativo deja de puntuar. Thessaly a 20° (S 75 %, E 87 %, I² 94 %) añadido como hallazgo. PubMed (metaanálisis de McMurray, interlínea y Thessaly desde 2015) no encuentra ninguno posterior; Rana 2026 solo agrupa la exploración compuesta.

Citada como:

1. Smith 2015 (Evid Based Med 20:88–97; metaanálisis bivariante, 9 estudios, n = 1234, calidad metodológica en general baja; referencia: artroscopia o RM; LR de la tabla 3)
2. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 209 y 220; Smith 2015 (Evid Based Med 20:88–97; metaanálisis bivariante, tabla 3); AAOS 2024 (guía de práctica clínica de patología meniscal aislada aguda, recomendación de exploración física)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro2 · Lesión Meniscal | Test «Test de McMurray» | 4b · cita bajo el test | 1 |
| Rodilla | ro2 · Lesión Meniscal | Test «Sensibilidad a la palpación de la línea articular» | 4b · cita bajo el test | 1 |
| Rodilla | ro2 · Lesión Meniscal | Test «Test de Thessaly» | 4b · cita bajo el test | 2 |

### Sokal 2022

Autores: Sokal, Norris, Maddox y Oldershaw  
Título: *The diagnostic accuracy of clinical tests for anterior cruciate ligament tears are comparable but the Lachman test has been previously overestimated: a systematic review and meta-analysis*  
Publicación: Knee Surg Sports Traumatol Arthrosc 30(10):3287–3303  
DOI: 10.1007/s00167-022-06898-4  
Última revisión: 2026-10 · Sin cambios: texto completo leído en PMC; las cifras de la tabla 4 (modelo bivariante) coinciden en los cuatro tests de ro4. Hay dos metaanálisis posteriores solo del Lever: Hesmerg 2024 (23 estudios, sin el del creador; S 79 %, E 92 %, LR+ 9,9, LR− 0,22; agrupación univariante de S y E) concuerda, y Hu 2024 (12 estudios, con el del creador) da E 78 %. Se citan en el criterio; por el método (bivariante, LCA sin otras lesiones ligamentosas) sigue mandando Sokal.  
Nota: Revisión sistemática con metaanálisis bivariante; texto completo leído en PMC (2026-10), cifras de la tabla 4. Lachman, cajón anterior, pivot shift y Lever de ro4 (puntúan con sus LR publicadas). Huang 2022 (Medicine, agosto de 2022, univariante) es del mismo año: se elige Sokal por el método, que tiene en cuenta la correlación entre S y E.

Citada como:

1. Sokal 2022 (Knee Surg Sports Traumatol Arthrosc 30:3287–303; revisión sistemática con metaanálisis bivariante, tabla 4: 12 estudios con S y E; LCA sin otras lesiones ligamentosas; referencia: artroscopia o RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test «Test de Lachman» | 4b · cita bajo el test | 1 |
| Rodilla | ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test «Test de Cajón Anterior» | 4b · cita bajo el test | 1 |
| Rodilla | ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test «Test de Pivot Shift» | 4b · cita bajo el test | 1 |
| Rodilla | ro4 · Lesión del Ligamento Cruzado Anterior (LCA) | Test «Lever Sign Test» | 4b · cita bajo el test | 1 |

### Solomon 2001

Publicación: JAMA 286:1610–20  
DOI: 10.1001/jama.286.13.1610  
Última revisión: 2026-10 · Sin cambios: PDF del usuario leído; combinación LR+ 2,7 (1,4–5,1), LR− 0,4 (0,2–0,7), McMurray 1,3 / 0,8 e interlínea 0,9 / 1,1 coinciden con el resumen y la tabla 5. Hay una revisión posterior de la exploración compuesta, Rana 2026 (S 85 %, E 95 % en el menisco medial, sin LR): por decisión del usuario sigue mandando Solomon y Rana se cita en el criterio.

Citada como:

1. Rotación tibial + extensión de rodilla desde posición de flexión completa. Positivo: chasquido o dolor en línea articular. S IC 95 %: 45–74 %; E IC 69–92 %; LR+ IC 1,7–5,9; LR− IC 0,34–0,81 (heterogeneidad I² 51 %). Negativo apenas baja la probabilidad (LR− 0,52): no descarta la rotura. En contra: Solomon 2001 (JAMA) da LR+ 1,3 (IC 0,9–1,7) y LR− 0,8.
2. Dolor a la palpación directa de la línea articular medial o lateral. S IC 95 %: 73–90 %; E IC 61–94 %; LR+ IC 2,1–7,5; LR− IC 0,12–0,44 (heterogeneidad alta, I² 83 %). En contra: Solomon 2001 (JAMA) da LR+ 0,9 y LR− 1,1.
3. Solomon 2001 (JAMA 286:1610–20, Rational Clinical Examination); LR+ IC 95 %: 1,4–5,1; LR− IC 0,2–0,7

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro2 · Lesión Meniscal | Test «Test de McMurray» (en `criterio`) | 4b · mención en el texto | 1 |
| Rodilla | ro2 · Lesión Meniscal | Test «Sensibilidad a la palpación de la línea articular» (en `criterio`) | 4b · mención en el texto | 2 |
| Rodilla | ro2 · Lesión Meniscal | Test «Combinación de tests clínicos» | 4b · cita bajo el test | 3 |

### Stern 2026

Autores: Stern, Bergman y Singh  
Título: *Lisfranc Dislocation*  
Publicación: StatPearls [Internet], NBK448147 (act. 2026-09-04)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de tobillo y pie.

Citada como:

1. Stern 2026 — Stern, Bergman y Singh, «Lisfranc Dislocation», StatPearls [Internet], NCBI Bookshelf, última actualización 4 de septiembre de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | — | Pregunta `tp_t1` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_t4` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### Suha 2025

Autores: Suha, Modi y Sharma  
Título: *Dyspnea*  
Publicación: StatPearls [Internet], NBK499965 (act. 2025-12-13)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Suha 2025 — Suha, Modi y Sharma, «Dyspnea», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de diciembre de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_p2` · Pulmonar | 2 · razonamiento del cribado | 1 |

### Suri 2010

Publicación: JAMA  
DOI: 10.1001/jama.2010.1833  
Última revisión: 2026-10 · Parcial: el Romberg de lu4 pasa a Cook 2019 (revisión posterior, mismos datos de Katz 1995, LR+ 4,06); la marcha con base amplia sigue con Suri 2010 porque Cook 2019 no da su cifra.

Citada como:

1. Suri 2010 (JAMA, revisión RCE; IC 95 %: 1,9–95)
2. Cook 2019 (Eur Spine J, revisión sistemática; datos de Katz 1995, n = 75; referencia: diagnóstico del médico experto; LR+ IC 95 %: 1,29–12,76; riesgo de sesgo bajo). Antes: Suri 2010, LR+ 4,2

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Marcha con base amplia» | 4b · cita bajo el test | 1 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Romberg alterado» | 4b · cita bajo el test | 2 |

### Tavakoli 2025

Autores: Tavakoli, Britt y Agarwal  
Título: *Vertebral Artery Dissection*  
Publicación: StatPearls [Internet], NBK441827 (act. 2025-04-06)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Tavakoli 2025 — Tavakoli, Britt y Agarwal, «Vertebral Artery Dissection», StatPearls [Internet], NCBI Bookshelf, última actualización 6 de abril de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_ar1` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 1 |

### Tawa 2017

Publicación: BMC Musculoskelet Disord 18:93  
DOI: 10.1186/s12891-016-1383-2  
Última revisión: 2026-10 · Complementada: leída entera en PMC. No hace metaanálisis; la sensibilidad S 61 %, E 63 % es el mejor estudio suelto (referencia quirúrgica, no RM como dice el resumen). Los dos tests de lu5 pasan a las cifras agrupadas de Al Nezari 2013 (metaanálisis, PDF del usuario); Tawa queda como revisión posterior. No cambia la puntuación: ningún test puntúa con ninguna de las dos cifras.

Citada como:

1. Al Nezari 2013 (Spine J, metaanálisis; referencia: cirugía) · Tawa 2017 (revisión sistemática posterior, sin metaanálisis)
2. Al Nezari 2013 (Spine J, metaanálisis; referencia: cirugía) · Tawa 2017 (revisión sistemática posterior, sin metaanálisis: mejor estudio suelto)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Test «Reflejos rotuliano (L3–L4) y aquíleo (L5–S1)» | 4b · cita bajo el test | 1 |
| Lumbar | lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Test «Sensibilidad (algodón, diapasón, pinchazo)» | 4b · cita bajo el test | 2 |

### Thoomes 2026

Publicación: BMC Musculoskelet Disord  
DOI: 10.1186/s12891-026-09551-0  
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

### Torlincasi 2023

Autores: Torlincasi, Lopez y Waseem  
Título: *Acute Compartment Syndrome*  
Publicación: StatPearls [Internet], NBK448124 (act. 2023-01-16)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 16 de enero de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie. Releído entero en la sesión del cribado posquirúrgico (2026-10), PDF del usuario: razonamiento de pq_compart.

Citada como:

1. Torlincasi 2023 — Torlincasi, Lopez y Waseem, «Acute Compartment Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 16 de enero de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `pq_compart` · Posquirúrgico | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `ro_t4` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_t1` · Traumático / Mecánico | 2 · razonamiento del cribado | 1 |

### Trager 2024

Autores: Trager, Baumann, Rogers, Tidd, Orellana, Preston y Baldwin  
Título: *Efficacy of manual therapy for sacroiliac joint pain syndrome: a systematic review and meta-analysis of randomized controlled trials*  
Publicación: J Man Manip Ther 32(6):561–572  
DOI: 10.1080/10669817.2024.2316420  
Última revisión: 2026-10 · Sin cambios: es la revisión más reciente que encontró la búsqueda en PubMed (terapia manual en el dolor sacroilíaco) al incorporarla en 2026-10.  
Nota: PDF del usuario (2026-10), leído entero. Pauta de lu8.

Citada como:

1. Al-Subahi 2017, J Phys Ther Sci 29(9):1689–1694 (revisión sistemática, 9 estudios de 2004–2014 de calidad baja o media: manipulación, ejercicio y vendaje neuromuscular) · Trager 2024, J Man Manip Ther 32(6):561–572 (revisión sistemática con metaanálisis, 16 ensayos; GRADE) · NICE NG59 (rec. 1.2.7; actualizada en julio de 2026)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Truong 2023

Autores: Truong, Mabrouk y Ashurst  
Título: *Septic Bursitis*  
Publicación: StatPearls [Internet], NBK470331 (act. 2023-04-22)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 22 de abril de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla. Releído en la sesión de codo (2026-10): razonamiento del cribado de codo.

Citada como:

1. Truong 2023 — Truong, Mabrouk y Ashurst, «Septic Bursitis», StatPearls [Internet], NCBI Bookshelf, última actualización 22 de abril de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `r_i3` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |
| Codo | — | Pregunta `co1` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |

### Uysal 2015

Autores: Uysal, Akbal, Gökmen, Adam y Reşorlu  
Título: *Prevalence of pes anserine bursitis in symptomatic osteoarthritis patients: an ultrasonographic prospective study*  
Publicación: Clin Rheumatol 34(3):529–33  
DOI: 10.1007/s10067-014-2653-8  
Última revisión: 2026-10 · Sin cambios: PubMed (bursitis de la pata de ganso desde 2015) no encuentra ninguna cifra de prevalencia posterior en artrosis.  
Nota: Leído el resumen de PubMed (2026-10); publicado en línea en 2014. Prevalencia del 20 % en ro7 (la que cita Lluch 2020).

Citada como:

1. Lluch 2020, cap. 4.2 (Courtney, Grindstaff, Hensley y Jayaseelan), pp. 211–212; Uysal 2015 (Clin Rheumatol 34:529–33; ecografía de 170 rodillas de 85 pacientes con artrosis sintomática)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro7 · Bursitis de la Pata de Ganso | Test «Ecografía o RMN confirmatoria» | 4b · cita bajo el test | 1 |

### Vadakekut y Gnugnoli 2025

Autores: Vadakekut y Gnugnoli  
Título: *Ectopic Pregnancy*  
Publicación: StatPearls [Internet], NBK539860 (act. 2025-03-27)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 27 de marzo de 2025 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Vadakekut y Gnugnoli 2025 — Vadakekut y Gnugnoli, «Ectopic Pregnancy», StatPearls [Internet], NCBI Bookshelf, última actualización 27 de marzo de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_g1` · Ginecológico | 2 · razonamiento del cribado | 1 |

### van der Windt 2010

Autores: van der Windt, Simons, Riphagen, Ammendolia, Verhagen, Laslett, Devillé, Deyo, Bouter, de Vet y Aertgeerts  
Título: *Physical examination for lumbar radiculopathy due to disc herniation in patients with low-back pain*  
Publicación: Cochrane Database Syst Rev 2010, n.º 2, CD007431  
DOI: 10.1002/14651858.CD007431.pub2  
Última revisión: 2026-10 · Sin cambios: PubMed (revisiones de la exploración física en ciática o hernia discal desde 2011). Scaia 2012 (J Back Musculoskelet Rehabil, 7 estudios del SLR) no agrupa; Al Nezari 2013 (Spine J) trata la exploración neurológica, no el SLR; Tawa 2017 (BMC Musculoskelet Disord, leída entera en PMC) no hace metaanálisis y da una media del SLR (S 0,84, E 0,78) con patrones de referencia mezclados. La Cochrane, con metaanálisis y referencia quirúrgica, sigue siendo la mejor.  
Nota: PDF del usuario (2026-10), leído entero. SLR y SLR cruzado de lu3 (tabla de resultados) y límites del Slump.

Citada como:

1. van der Windt 2010 (revisión Cochrane, 9 estudios; LR+ IC 95 %: 1,1–1,4; LR− 0,24–0,39; referencia: cirugía). Antes: Devillé 2000
2. van der Windt 2010 (revisión Cochrane, 5 estudios; LR+ IC 95 %: 1,6–2,8; referencia: cirugía o imagen). Antes: Devillé 2000
3. Majlesi 2008 (estudio único; referencia: RM) · van der Windt 2010 (revisión Cochrane: límites del estudio y un segundo estudio)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «Test de Elevación de Pierna Recta (SLR) ipsilateral» | 4b · cita bajo el test | 1 |
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «SLR Contralateral (Lasègue cruzado)» | 4b · cita bajo el test | 2 |
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «Test de Slump» | 4b · cita bajo el test | 3 |

### van Dijk 1996

Publicación: J Bone Joint Surg Br 78-B(6)  
DOI: 10.1302/0301-620x78b6.1283  
Última revisión: **sin revisar**

Citada como:

1. Cajón anterior con mejor S y E a los 4–6 días; sin signo del surco, el LPAA no está roto del todo. No puntúa: van Dijk 1996 (160 inversiones; referencia: cirugía o artrografía) da para la exploración diferida completa (día 5: hinchazón, hematoma, palpación y cajón) S 96 %, E 84 %, pero para el cajón solo el texto (S 86 %, E 74 %) no cuadra con su propia tabla, y lo que valida es rotura frente a ligamentos intactos, no esguince frente a otros diagnósticos.
2. Lluch 2020, cap. 4.3 (Lam, Mayes, Rio, Delahunt y Cook), p. 255; van Dijk 1996 (J Bone Joint Surg Br 78-B(6))

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «Cajón anterior (a los 4–6 días)» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «Cajón anterior (a los 4–6 días)» | 4b · cita bajo el test | 2 |

### van Dijk 2016

Publicación: Knee Surg Sports Traumatol Arthrosc 24(4):1217–27  
DOI: 10.1007/s00167-016-4017-1  
Última revisión: **sin revisar**  
Nota: Consenso ESSKA-AFAS sobre el tratamiento de la lesión aguda y aislada de la sindesmosis; PDF aportado por el usuario. Leído junto con su compañero de clasificación y diagnóstico (van Dijk et al., KSSTA 2016;24(4):1200–16, doi 10.1007/s00167-015-3942-8), que no se cita.

Citada como:

1. van Dijk 2016, Knee Surg Sports Traumatol Arthrosc 24(4):1217–27 (consenso ESSKA-AFAS tras una revisión sistemática; nivel de evidencia IV)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp2 · Lesión de la Sindesmosis | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Vandeputte 2026

Autores: Vandeputte, Sergooris, Roose, Timmermans y Corten  
Título: *Clinical Diagnosis and Treatment of Iliopsoas-Related Groin Pain: A Systematic Review*  
Publicación: J Clin Med 15(15):5912  
DOI: 10.3390/jcm15155912  
Última revisión: 2026-10 · Sin cambios: es de 2026 y PubMed no encuentra una revisión posterior del dolor inguinal relacionado con el psoas ilíaco.  
Nota: Texto completo en PMC13466767 (Europe PMC intercambia nombre y apellido de los autores). Dosis de ca17 (cadera).

Citada como:

1. Vandeputte 2026, J Clin Med 15(15):5912 (revisión sistemática; tratamiento conservador solo en series de casos y cohortes, calidad baja a moderada)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca17 · Dolor Inguinal Relacionado con el Psoas Ilíaco | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Verhagen 2017

Autores: Verhagen, Downie, Maher y Koes  
Título: *Most red flags for malignancy in low back pain guidelines lack empirical support: a systematic review*  
Publicación: Pain 158(10):1860–1868  
DOI: 10.1097/j.pain.0000000000000998  
Última revisión: 2026-10 · Sin cambios: PubMed (banderas rojas de malignidad en lumbalgia, revisiones desde 2017) solo encuentra Galliker 2020 (urgencias), que se cita junto a ella.  
Nota: PDF del usuario (2026-10), leído entero. Preguntas `l2` y `l_on2` (tabla 1).

Citada como:

1. Verhagen 2017 — Verhagen, Downie, Maher y Koes, «Most red flags for malignancy in low back pain guidelines lack empirical support; a systematic review», Pain 2017;158(10):1860–1868, tabla 1.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_on2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |

### Vijayan y Mabrouk 2026

Autores: Vijayan y Mabrouk  
Título: *Septic Arthritis of the Pediatric Hip*  
Publicación: StatPearls [Internet], NBK459284 (act. 2026-09-14)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 14 de septiembre de 2026 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Vijayan y Mabrouk 2026 — Vijayan y Mabrouk, «Septic Arthritis of the Pediatric Hip», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de septiembre de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_in1` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |

### Vijayan y Maher 2026

Autores: Vijayan y Maher  
Título: *Gonococcal Arthritis*  
Publicación: StatPearls [Internet], NBK470439 (act. 2026-02-21)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 21 de febrero de 2026 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla.

Citada como:

1. Vijayan y Maher 2026 — Vijayan y Maher, «Gonococcal Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 21 de febrero de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | — | Pregunta `r_i2` · Infecciosa / Inflamatoria | 2 · razonamiento del cribado | 1 |

### Vyas 2024

Autores: Vyas, Sankari y Goyal  
Título: *Acute Pulmonary Embolism*  
Publicación: StatPearls [Internet], NBK560551 (act. 2024-12-11)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado posquirúrgico (pq_tvp, pq_tvp_ms y pq_tep).

Citada como:

1. Vyas 2024 — Vyas, Sankari y Goyal, «Acute Pulmonary Embolism», StatPearls [Internet], NCBI Bookshelf, última actualización 11 de diciembre de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `pq_tvp` · Posquirúrgico | 2 · razonamiento del cribado | 1 |
| Todas (sistemas comunes) | — | Pregunta `pq_tvp_ms` · Posquirúrgico | 2 · razonamiento del cribado | 1 |
| Todas (sistemas comunes) | — | Pregunta `pq_tep` · Posquirúrgico | 2 · razonamiento del cribado | 1 |

### Waheed 2023

Autores: Waheed, Kudaravalli y Hotwagner  
Título: *Deep Venous Thrombosis*  
Publicación: StatPearls [Internet], NBK507708 (act. 2023-01-19)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 19 de enero de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera y rodilla. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie.

Citada como:

1. Waheed 2023 — Waheed, Kudaravalli y Hotwagner, «Deep Venous Thrombosis», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_v2` · Vascular | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `r_v2` · Vascular | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_v2` · Vascular | 2 · razonamiento del cribado | 1 |

### Walton 2004

Publicación: J Bone Joint Surg Am  
DOI: 10.2106/00004623-200404000-00021  
Última revisión: 2026-10 · Sin cambios: el artículo no se ha leído entero; sus cifras (Paxinos S 79 %, E 50 %; palpación S 96 %, E 10 %; O’Brien S 16 %, E 90 %) coinciden con las que recogen Krill 2018 (tabla 3) y Cadogan 2013 (tabla 1), leídos enteros. Ningún test de h7 que lo cite puntúa.

Citada como:

1. Walton 2004 (J Bone Joint Surg Am; 38 con dolor localizado en la AC, 28 con respuesta a la infiltración; tabla I)
2. Walton 2004 (J Bone Joint Surg Am; 38 con dolor localizado en la AC, 28 con respuesta a la infiltración; tablas I y IV)
3. Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6). En atención primaria (Cadogan 2013, 153 pacientes consecutivos, bloqueo de la AC guiado por fluoroscopia) da S 14 %, E 92 %, LR+ 1,73 (0,53–5,15). Combinado con el Paxinos y hechos en serie (los dos positivos), la revisión de Krill 2018 (Walton 2004 y Cadogan 2013; deja fuera a Chronopoulos 2004 por ser de nivel III) da S 11 %, E 96 % y LR+ 2,71, la mejor de las combinaciones, y concluye que ninguna cambia más que poco la probabilidad; Lluch 2020 (cap. 3.1, p. 61) lo resume como «S y E >90 %», cifra que la revisión no respalda.
4. Chronopoulos 2004 (Am J Sports Med 32:655–661, tabla 3) · Walton 2004 (J Bone Joint Surg Am) · Cadogan 2013 (BMC Musculoskelet Disord 14:156, tabla 4) · Krill 2018 (Phys Sportsmed 46:98–104, revisión sistemática; tablas 3 y 4)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h7 · Artropatía Acromioclavicular | Test «Palpación directa de la articulación AC» | 4b · cita bajo el test | 1 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Paxinos + gammagrafía ósea combinados» | 4b · cita bajo el test | 2 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» (en `criterio`) | 4b · mención en el texto | 3 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» | 4b · cita bajo el test | 4 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Test de Paxinos» | 4b · cita bajo el test | 2 |

### Warden 2007

Publicación: Am J Sports Med 35:427–36  
DOI: 10.1177/0363546506294858  
Última revisión: 2026-10 · Sin cambios: PDF del usuario leído; 30 con tendinopatía clínica frente a 33 asintomáticos, ecografía S 87 % y RM S 57 %, E 82 % ambas, coinciden. PubMed no encuentra revisiones posteriores de precisión de la imagen en la tendinopatía rotuliana.

Citada como:

1. Warden 2007 (Am J Sports Med 35:427–36; 30 con tendinopatía rotuliana clínica frente a 33 asintomáticos)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro5 · Tendinopatía Rotuliana | Test «Ecografía o RM (si se dispone de informe)» | 4b · cita bajo el test | 1 |

### Warden 2014

Publicación: J Orthop Sports Phys Ther 44(10):749–65  
DOI: 10.2519/jospt.2014.5334  
Última revisión: **sin revisar**  
Nota: Comentario clínico (nivel 5) sobre las fracturas de estrés en corredores; PDF aportado por el usuario.

Citada como:

1. Warden 2014, J Orthop Sports Phys Ther 44(10):749–65 (comentario clínico; nivel de evidencia 5; programa de carrera de su tabla 3)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp33 · Fractura de Estrés del Cuello de un Metatarsiano (Fractura de Marcha) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Wenker y Quint 2023

Autores: Wenker y Quint  
Título: *Ankylosing Spondylitis*  
Publicación: StatPearls [Internet], NBK470173 (act. 2023-06-20)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 20 de junio de 2023 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Wenker y Quint 2023 — Wenker y Quint, «Ankylosing Spondylitis», StatPearls [Internet], NCBI Bookshelf, última actualización 20 de junio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_in2` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |

### Williams 2025

Publicación: J Man Manip Ther  
DOI: 10.1080/10669817.2024.2436403  
Última revisión: **sin revisar**

Citada como:

1. Williams 2025 (J Man Manip Ther, revisión de revisiones sistemáticas): evidencia del PAIVM frente a bloqueo facetario · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce1 · Disfunción Articular Cervical | Test «PAIVM (Movilidad Intervertebral Pasiva Accesoria) C0-C3» | 4b · cita bajo el test | 1 |

### Willy 2019

Autores: Willy, Hoglund, Barton, Bolgla, Scalzitti, Logerstedt, Lynch, Snyder-Mackler y McDonough  
Título: *Patellofemoral Pain: Clinical Practice Guidelines Linked to the International Classification of Functioning, Disability and Health*  
Publicación: J Orthop Sports Phys Ther 49(9):CPG1–CPG95  
DOI: 10.2519/jospt.2019.0302  
Última revisión: 2026-10 · Sin cambios: la guía holandesa (Ophey 2025), posterior y del mismo nivel, ya manda donde discrepan; no hay revisión de la guía de JOSPT.  
Nota: Guía de práctica clínica APTA; PDF del usuario (2026-10): resumen de recomendaciones (pp. CPG2–CPG3) y lagunas sobre la dosis. Pauta de ro3: se suma en lo que no choca; en vendaje, rodilleras y ortesis manda Ophey 2025, más reciente.

Citada como:

1. Ophey 2025, Knee Surg Sports Traumatol Arthrosc 33:457–469 (guía multidisciplinar holandesa, módulos 1–3; certeza GRADE como la da la guía) · Willy 2019, J Orthop Sports Phys Ther 49(9):CPG1–CPG95 (guía de práctica clínica APTA, resumen de recomendaciones, pp. CPG2–CPG3; letra = grado de la recomendación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro3 · Dolor Patelofemoral (Síndrome) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Wistow 2025

Autores: Wistow, Newman, Hannink y Barker  
Título: *Investigating the effectiveness of stretching interventions on post-traumatic elbow stiffness: a systematic review*  
Publicación: JSES Int 9(6):2146–2155  
DOI: 10.1016/j.jseint.2025.06.015  
Última revisión: **sin revisar**  
Nota: Revisión sistemática (9 estudios, 312 participantes; sin metaanálisis); texto completo leído en Europe PMC. Leído en la sesión de dosis de codo (2026-10). Pauta de co3.

Citada como:

1. Wistow 2025, JSES Int 9(6):2146–2155 (revisión sistemática, 9 estudios y 312 participantes, sin metaanálisis) · Siemensma 2023, EFORT Open Rev 8(5):351–360 (revisión narrativa)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co3 · Rigidez del Codo (Contractura Postraumática o Capsular) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Wong 2022

Publicación: Curr Rev Musculoskelet Med 15:38–52  
DOI: 10.1007/s12178-022-09745-8  
Última revisión: 2026-10 · Sin cambios: solo describe la técnica, no aporta cifras.  
Nota: Solo para la técnica del test.

Citada como:

1. McCarthy y Busconi 1995 (Can J Surg; serie de 59 casos con dolor de cadera refractario; referencia: artroscopia, rotura labral), S y E calculadas por los autores de Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med)
2. McCarthy y Busconi 1995 (Can J Surg; serie de 59 casos con dolor de cadera refractario; referencia: artroscopia, rotura labral), S y E calculadas por los autores de Reiman 2015. Riesgo de sesgo alto. Técnica: Wong 2022 (Curr Rev Musculoskelet Med). En contra: Narvani 2003 (Knee Surg Sports Traumatol Arthrosc; 18 deportistas con dolor inguinal, 4 roturas; referencia: artro-RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Test de Thomas» | 4b · cita bajo el test | 1 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Test de Thomas» | 4b · cita bajo el test | 2 |

### Wróblewski 2026

Autores: Wróblewski, Wróblewska, Szukalska, Karczewska, Lichwala, Samborska, Balajewicz y Siwek  
Título: *Current Perspectives on Urolithiasis: Pathogenesis, Clinical Management, and Treatment*  
Publicación: Cureus 18(1):e101141  
DOI: 10.7759/cureus.101141  
Última revisión: 2026-10 · Sin cambios: publicada en 2026; no se buscó literatura posterior.  
Nota: Revisión narrativa; texto completo en PMC12883049, leído en PubMed Central (2026-10). Razonamiento de l_u4 (cólico renal, lumbar).

Citada como:

1. Wróblewski 2026 — Wróblewski, Wróblewska, Szukalska, Karczewska, Lichwala, Samborska, Balajewicz y Siwek, «Current Perspectives on Urolithiasis: Pathogenesis, Clinical Management, and Treatment», Cureus 2026;18(1):e101141 (texto completo en PMC), apartados «Etiology», «Diagnosis» y «Treatment and management».

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_u4` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Zabaglo 2024

Autores: Zabaglo, Leslie y Sharman  
Título: *Postoperative Wound Infections*  
Publicación: StatPearls [Internet], NBK560533 (act. 2024-03-05)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado posquirúrgico (pq_herida).

Citada como:

1. Zabaglo 2024 — Zabaglo, Leslie y Sharman, «Postoperative Wound Infections», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de marzo de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `pq_herida` · Posquirúrgico | 2 · razonamiento del cribado | 1 |

### Zaslav 2001

Publicación: J Shoulder Elbow Surg 10:23–27  
DOI: 10.1067/mse.2001.111960  
Última revisión: 2026-10 · Sin cambios: búsqueda en PubMed (2026-10) sin estudios posteriores del test; Hanchard 2013 (Cochrane) lo cita como test original sin replicar. Sigue como hallazgo en h5.

Citada como:

1. Zaslav 2001 (J Shoulder Elbow Surg 10:23–27)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h5 · Lesión Labral Superior (SLAP) | Test «Test de Resistencia a Rotación Interna» | 4b · cita bajo el test | 1 |

### Zemaitis 2026

Autores: Zemaitis, Boll, Kato y Golla  
Título: *Peripheral Arterial Disease*  
Publicación: StatPearls [Internet], NBK430745 (act. 2026-01-31)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: el capítulo de StatPearls no se ha actualizado desde el 31 de enero de 2026 (fecha del documento en PubMed, consultada en 2026-10).  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de rodilla. Releído en la sesión de tobillo y pie (2026-10): razonamiento del cribado de tobillo y pie.

Citada como:

1. Zemaitis 2026 — Zemaitis, Boll, Kato y Golla, «Peripheral Arterial Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de enero de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `c2` · Vascular | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_v3` · Vascular | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_v1` · Vascular | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_v3` · Vascular | 2 · razonamiento del cribado | 1 |
| Rodilla | — | Pregunta `r_v1` · Vascular | 2 · razonamiento del cribado | 1 |
| Tobillo y pie | — | Pregunta `tp_v1` · Vascular | 2 · razonamiento del cribado | 1 |

### Zhang 2010

Publicación: Ann Rheum Dis 69:483–9  
DOI: 10.1136/ard.2009.113100  
Última revisión: 2026-10 · Sin cambios: PDF del usuario leído; crepitación (S 0,89, E 0,60, LR 2,23, κ entre examinadores 0,23), agrandamiento óseo (0,55 / 0,95, LR 11,81) y movilidad restringida (0,17 / 0,96, LR 4,4) coinciden con la tabla 2. PubMed (recomendaciones EULAR y revisiones sistemáticas de diagnóstico clínico de artrosis de rodilla desde 2010) no encuentra ninguna posterior; las de EULAR de 2023 son de tratamiento.

Citada como:

1. Zhang 2010 (Ann Rheum Dis 69:483–9, recomendaciones EULAR de diagnóstico de artrosis de rodilla, tabla 2; referencia: diagnóstico clínico o radiográfico; 4 estudios, 2 de casos y controles, n = 942; LR+ IC 95 %: 1,90–2,63)
2. Zhang 2010 (Ann Rheum Dis 69:483–9, recomendaciones EULAR de diagnóstico de artrosis de rodilla, tabla 2; referencia: diagnóstico clínico o radiográfico; 3 estudios, 1 de casos y controles, n = 3108; LR+ IC 95 %: 4,94–28,22)
3. Zhang 2010 (Ann Rheum Dis 69:483–9, recomendaciones EULAR de diagnóstico de artrosis de rodilla, tabla 2; referencia: diagnóstico clínico o radiográfico; 6 estudios, n = 3661; sin IC publicado)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro1 · Artrosis de Rodilla | Test «Crepitación articular» | 4b · cita bajo el test | 1 |
| Rodilla | ro1 · Artrosis de Rodilla | Test «Agrandamiento óseo» | 4b · cita bajo el test | 2 |
| Rodilla | ro1 · Artrosis de Rodilla | Test «Restricción de ROM» | 4b · cita bajo el test | 3 |

### Zhao 2024

Autores: Zhao, Palani, Kassab, Terzic, Olejnik, Wang, Tomassini-Lopez, Dean y Shellenberger  
Título: *Evidence-based approach to the shoulder examination for subacromial bursitis and rotator cuff tears: a systematic review and meta-analysis*  
Publicación: BMC Musculoskelet Disord 25:1028  
DOI: 10.1186/s12891-024-08144-z  
Última revisión: 2026-10 · Añadida: texto completo y figuras leídos en Europe PMC (2026-10). Metaanálisis con modelo bivariante (paquete mada) para S, E y LR. Errores de extracción: la tabla 2×2 del arco doloroso de Park 2005 suma 718 pacientes de 552, incluye el arco doloroso de Silva 2008 aunque su tabla 1 no lo recoge, y cuenta dos veces la cohorte ROW (Jain 2017 y Jain 2018) en el Jobe y otros tests; el signo de retraso en RI mezcla roturas del subescapular y del supraespinoso. Por eso va como segunda cifra, no sustituye a Hegedus 2012.  
Nota: Segunda cifra del arco doloroso, el Hawkins y el Neer de h2.

Citada como:

1. Dolor durante la elevación activa entre 60° y 120°. Metaanálisis de 4 estudios (n = 756): LR+ 2,25 (IC 1,24–4,08), LR− 0,62 (IC 0,37–1,03), modelo bivariante. Sirve algo para confirmar; un negativo es solo un hallazgo. Un metaanálisis posterior (Zhao 2024, 6 estudios, bivariante) da LR+ 1,57 (1,07–2,31), LR− 0,63, pero su tabla 2×2 de Park 2005 suma 718 pacientes de un estudio de 552: se mantiene la cifra de Hegedus.
2. Hegedus 2012 (Br J Sports Med 46:964–978; metaanálisis HSROC/bivariante, tabla 3) · Zhao 2024 (BMC Musculoskelet Disord 25:1028, tabla 3 y fig. 3)
3. Flexión de hombro a 90°, rotación interna forzada. Positivo si reproduce dolor subacromial. Metaanálisis de 7 estudios (n = 944): LR+ 1,84 (IC 1,49–2,26), LR− 0,35 (IC 0,27–0,46), modelo bivariante. Sirve para descartar; un positivo es solo un hallazgo. Zhao 2024 (8 estudios, bivariante, con los errores de extracción del arco doloroso) da LR+ 1,64 (1,22–2,19), LR− 0,53 (0,39–0,71).
4. Hegedus 2012 (Br J Sports Med 46:964–978; metaanálisis HSROC/bivariante, tabla 3) · Zhao 2024 (BMC Musculoskelet Disord 25:1028, tabla 3)
5. Elevación pasiva en el plano escapular con rotación interna. Combinar test para el SAPS apenas mejora la precisión (Lluch 2020, cap. 3.1, p. 54). Metaanálisis de 7 estudios (n = 946): LR+ 1,79 (IC 1,24–2,58), LR− 0,47 (IC 0,39–0,56), modelo bivariante. Sirve para descartar; un positivo es solo un hallazgo. Zhao 2024 (7 estudios, bivariante) da LR+ 1,54 (1,09–2,18), LR− 0,47 (0,41–0,54).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Arco doloroso» (en `criterio`) | 4b · mención en el texto | 1 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Arco doloroso» | 4b · cita bajo el test | 2 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Hawkins-Kennedy» (en `criterio`) | 4b · mención en el texto | 3 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Hawkins-Kennedy» | 4b · cita bajo el test | 4 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Neer» (en `criterio`) | 4b · mención en el texto | 5 |
| Hombro | h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Test de Neer» | 4b · cita bajo el test | 4 |

### Ziu 2023

Autores: Ziu, Khan Suheb y Mesfin  
Título: *Subarachnoid Hemorrhage*  
Publicación: StatPearls [Internet], NBK441958 (act. 2023-06-01)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Ziu 2023 — Ziu, Khan Suheb y Mesfin, «Subarachnoid Hemorrhage», StatPearls [Internet], NCBI Bookshelf, última actualización 1 de junio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_ar4` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 1 |

### Zwerus 2018

Autores: Zwerus, Somford, Maissan, Heisen, Eygendaal y van den Bekerom  
Título: *Physical examination of the elbow, what is the evidence? A systematic literature review*  
Publicación: Br J Sports Med 52(19):1253–1260 (en línea en 2017)  
DOI: 10.1136/bjsports-2016-096712  
Última revisión: **sin revisar**  
Nota: Leído en la sesión de codo (2026-10). PDF aportado por el usuario. La revisión que cita Lluch 2020, cap. 3.2 (ref. 9). Ojo: su texto invierte la S y la E del valgo móvil; la tabla 4 las da bien. Tests de co1, co4, co5 y co7 (codo).

Citada como:

1. Prensión máxima con el codo a 90° de flexión y en extensión completa: en la epicondilalgia, la fuerza cae en extensión (en el sano no cambia). Cuenta como hallazgo: los intervalos no se convierten en LR, y el estudio de origen comparaba el brazo afectado con el sano del mismo paciente, no con otras causas de dolor lateral. Cifras de Dorf 2007 en Zwerus 2018 (tabla 4; 40 pacientes, brazo sano como control): caída ≥5 %, S 83 %, E 80 % (LR+ 4,2, LR− 0,21); ≥8 %, S 80 %, E 85 % (LR+ 5,3, LR− 0,24); ≥10 %, S 78 %, E 90 % (LR+ 7,7, LR− 0,24).
2. Karanasios 2022 (J Hand Ther 35:541–551; revisión sistemática, 24 estudios, 97 % con riesgo de sesgo alto o incierto; solo 2 estudios de exploración física). Estudio de origen, casi con seguridad: Dorf 2007 (J Hand Surg Am 32:882–886; retrospectivo, 81 pacientes; una diferencia del 8 % entre flexión y extensión distinguió el brazo afectado del sano con un 83 % de precisión) · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4)
3. Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 5) · Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 84
4. Reproducción del dolor medial con estrés en valgo dinámico. En el único estudio (O'Driscoll 2005; Zwerus 2018, tabla 4) fue más sensible que el valgo estático con dolor (100 % frente a 64,7 %). Test de valgo móvil (O'Driscoll 2005): hombro en abducción y rotación externa, valgo mantenido con el codo en flexión completa y extensión rápida; positivo si reproduce el dolor medial, máximo entre 120° y 70°. En 21 pacientes operados: S 100 % (17/17), E 75 % (3 de 4 controles). Lluch 2020 (p. 86) da las cifras invertidas (S 75 %, E 100 %). Zwerus 2018 (tabla 4) da las mismas cifras que el original, con LR+ 4 (IC 0,7–21,8, que cruza el 1); es el texto de la revisión el que las invierte, y de ahí las copia Lluch. Cuenta como hallazgo: la especificidad sale de solo 4 controles y el IC de la LR+ incluye el 1. La maniobra de ordeño es otra prueba (Zwerus 2018, tabla 5), sin estudios de precisión.
5. O'Driscoll 2005 (Am J Sports Med 33:231–239; resumen en PubMed) · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 86
6. Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tablas 4 y 5) · Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 86
7. Pivot shift: en supino, brazo por encima de la cabeza, hombro en rotación externa completa y antebrazo en supinación; carga axial y valgo mientras se lleva el codo de extensión a flexión; positivo si la radiohumeral se reduce con un resalte palpable. Sensibilidad del 38 % en el paciente despierto (100 % bajo anestesia), por la aprensión y la defensa muscular; sin especificidad publicada en el capítulo. El dato es de Regan y Lapner, recogido en Zwerus 2018: 8 pacientes, todos con la lesión y sin controles, así que no hay especificidad posible.
8. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 87 y 100 · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4)
9. El paciente hace una flexión de brazos con el antebrazo en supinación máxima y otra en pronación máxima; positivo si la aprensión o la subluxación aparecen al extender el codo en supinación. En Zwerus 2018 (tabla 4; Regan y Lapner): S 87,5 % (IC 47,4–99,7) en 8 pacientes, todos con la lesión y sin controles; sin especificidad: cuenta como hallazgo. Lluch da el 88–100 % para este test y el de recolocación juntos.
10. Con el brazo apoyado en el borde de la mesa, el codo hacia fuera y el antebrazo en supinación, el paciente flexiona el codo cargando peso: aparecen aprensión y dolor hacia los 40° de flexión. Se repite con el examinador presionando la cabeza del radio para evitar la subluxación posterior; positivo si los síntomas se alivian. En Zwerus 2018 (tabla 4; Arvind y Hargreaves): S 100 % (IC 63,1–100) en 8 pacientes, todos con la lesión y sin controles; sin especificidad: cuenta como hallazgo.
11. Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 87–88 y 100 · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4)
12. Devereaux y ElMaraghy 2013 (Am J Sports Med 41:1998–2004; cohorte), recogido en Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · O'Driscoll 2007 (Am J Sports Med 35:1865–1869; resumen en PubMed) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 84–85 y 102
13. Devereaux y ElMaraghy 2013 (Am J Sports Med 41:1998–2004; cohorte), recogido en Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 4) · Lluch 2020, cap. 3.2 (Coombes y Bisset), pp. 85 y 102
14. Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 5)
15. Lluch 2020, cap. 3.2 (Coombes y Bisset), p. 89 · Zwerus 2018 (Br J Sports Med 52:1253–1260; revisión sistemática, tabla 5)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Reducción de fuerza de prensión (diferencia 5-10% entre posiciones)» (en `criterio`) | 4b · mención en el texto | 1 |
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Reducción de fuerza de prensión (diferencia 5-10% entre posiciones)» | 4b · cita bajo el test | 2 |
| Codo | co2 · Tendinopatía Medial (Epicondilalgia Medial / Codo de Golfista) | Test «Test de Polk (medial)» | 4b · cita bajo el test | 3 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Test de valgo móvil (moving valgus stress test)» (en `criterio`) | 4b · mención en el texto | 4 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Test de valgo móvil (moving valgus stress test)» | 4b · cita bajo el test | 5 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Test de valgo estático (dolor)» | 4b · cita bajo el test | 6 |
| Codo | co4 · Insuficiencia del Ligamento Colateral Cubital (LCC) | Test «Test de valgo estático (laxitud)» | 4b · cita bajo el test | 6 |
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Test «Test de cajón posterolateral / Test de pivote lateral» (en `criterio`) | 4b · mención en el texto | 7 |
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Test «Test de cajón posterolateral / Test de pivote lateral» | 4b · cita bajo el test | 8 |
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Test «Test de flexión en suelo (push-up) con el antebrazo en supinación» (en `criterio`) | 4b · mención en el texto | 9 |
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Test «Test de flexión en suelo (push-up) con el antebrazo en supinación» | 4b · cita bajo el test | 8 |
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Test «Test de recolocación en la mesa (table-top relocation)» (en `criterio`) | 4b · mención en el texto | 10 |
| Codo | co5 · Lesión del Complejo Colateral Lateral / Inestabilidad Rotatoria Posterolateral (IRPL) | Test «Test de recolocación en la mesa (table-top relocation)» | 4b · cita bajo el test | 11 |
| Codo | co7 · Rotura Distal del Bíceps | Test «Test del Gancho (Hook Test)» | 4b · cita bajo el test | 12 |
| Codo | co7 · Rotura Distal del Bíceps | Test «Pronación pasiva del antebrazo (PFP) / test de pronosupinación pasiva» | 4b · cita bajo el test | 13 |
| Codo | co10 · Tendinopatía o Rotura del Tríceps | Test «Test de compresión del tríceps (triceps squeeze test)» | 4b · cita bajo el test | 14 |
| Codo | co11 · Pinzamiento Posterior o Posteromedial (Sobrecarga en Extensión-Valgo) | Test «Arm bar test» | 4b · cita bajo el test | 15 |
| Codo | co11 · Pinzamiento Posterior o Posteromedial (Sobrecarga en Extensión-Valgo) | Test «Test de sobrecarga en valgo (valgus overload)» | 4b · cita bajo el test | 15 |

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

### Cadera (1)

| Hipótesis | Test | Cifras | Puntúa |
|---|---|---|---|
| ca5 · Debilidad de Abductores de Cadera | Test de paso lateral + marcha en tándem combinados | — | no |
