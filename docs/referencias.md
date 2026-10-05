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

- **201** referencias de literatura, con **630** usos.
- **4** tarjetas de consulta (repo guia-de-consulta), con **251** usos, basadas en Lluch 2020.
- **18** de 201 referencias del registro revisadas. Ver «Estado de revisión».
- **83** de 434 tests sin `fuente` (0 de ellos puntúan en la fase 4b). Ver «Tests sin fuente».

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
| [Laslett 2008](#laslett-2008) | puntuación 4b | 1 | **sin revisar** |
| [Majlesi 2008](#majlesi-2008) | puntuación 4b | 1 | **sin revisar** |
| [Suri 2010](#suri-2010) | puntuación 4b | 2 | **sin revisar** |
| [Zhang 2010](#zhang-2010) | puntuación 4b | 3 | **sin revisar** |
| [Cook 2011](#cook-2011) | puntuación 4b | 1 | **sin revisar** |
| [Hegedus 2012](#hegedus-2012) | puntuación 4b · test 4b sin puntuar · texto | 9 | **sin revisar** |
| [Apelby-Albrecht 2013](#apelby-albrecht-2013) | puntuación 4b | 1 | **sin revisar** |
| [Hermans 2013](#hermans-2013) | puntuación 4b · test 4b sin puntuar | 6 | **sin revisar** |
| [Nunes 2013](#nunes-2013) | puntuación 4b | 1 | **sin revisar** |
| [Reiman 2014](#reiman-2014) | puntuación 4b · test 4b sin puntuar · texto | 6 | **sin revisar** |
| [Smith 2015](#smith-2015) | puntuación 4b | 2 | **sin revisar** |
| [Genevay 2017](#genevay-2017) | puntuación 4b | 1 | **sin revisar** |
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
| [Goodman 2018](#goodman-2018) | cribado fase 2 · razonamiento fase 2 · texto | 88 | **sin revisar** |
| [Consenso de Zúrich IHiPRN](#consenso-de-zúrich-ihiprn) | pauta · texto | 4 | **sin revisar** |
| [NICE NG59](#nice-ng59) | pauta · pronóstico | 9 | **sin revisar** |
| [Jonsson 2008](#jonsson-2008) | pauta | 1 | **sin revisar** |
| [McKeon 2008](#mckeon-2008) | pauta · texto | 2 | **sin revisar** |
| [Kuijper 2009](#kuijper-2009) | pauta · texto | 2 | **sin revisar** |
| [Kulig 2009](#kulig-2009) | pauta | 1 | **sin revisar** |
| [Kelley 2013](#kelley-2013) | pauta · test 4b sin puntuar · texto | 3 | **sin revisar** |
| [Reid 2014](#reid-2014) | pauta | 1 | **sin revisar** |
| [Mellor 2016](#mellor-2016) | pauta | 1 | **sin revisar** |
| [Al-Subahi 2017](#al-subahi-2017) | pauta | 1 | **sin revisar** |
| [Blanpied 2017](#blanpied-2017) | pauta · test 4b sin puntuar · texto | 14 | **sin revisar** |
| [Cibulka 2017](#cibulka-2017) | pauta | 1 | **sin revisar** |
| [Griffin 2018](#griffin-2018) | pauta | 1 | **sin revisar** |
| [Mellor 2018](#mellor-2018) | pauta | 1 | **sin revisar** |
| [Kemp 2020](#kemp-2020) | pauta | 1 | **sin revisar** |
| [Rathleff 2020](#rathleff-2020) | pauta | 1 | **sin revisar** |
| [Serner 2020](#serner-2020) | pauta | 1 | **sin revisar** |
| [George 2021](#george-2021) | pauta | 8 | **sin revisar** |
| [Martin 2021](#martin-2021) | pauta | 2 | **sin revisar** |
| [Enseki 2023](#enseki-2023) | pauta | 3 | **sin revisar** |
| [Koc 2023](#koc-2023) | pauta | 1 | **sin revisar** |
| [Munakomi 2023](#munakomi-2023) | pauta · razonamiento fase 2 · texto | 3 | **sin revisar** |
| [Chimenti 2024](#chimenti-2024) | pauta | 1 | **sin revisar** |
| [Desmeules 2025](#desmeules-2025) | pauta · test 4b sin puntuar · texto | 4 | **sin revisar** |
| [Liu 2025](#liu-2025) | pauta | 1 | **sin revisar** |
| [Rich 2025](#rich-2025) | pauta | 1 | **sin revisar** |
| [Salamh 2025](#salamh-2025) | pauta · test 4b sin puntuar | 2 | **sin revisar** |
| [Alentorn-Geli 2026](#alentorn-geli-2026) | pauta | 2 | **sin revisar** |
| [Vandeputte 2026](#vandeputte-2026) | pauta | 1 | **sin revisar** |
| [Lluch 2020](#1-tarjetas-de-consulta) | pronóstico · test 4b sin puntuar | 251 | **sin revisar** |
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
| [Krill 2018](#krill-2018) | test 4b sin puntuar · texto | 2 | **sin revisar** |
| [Mastromarchi 2021](#mastromarchi-2021) | test 4b sin puntuar | 4 | **sin revisar** |
| [Netterström-Wedin 2021](#netterström-wedin-2021) | test 4b sin puntuar · texto | 4 | **sin revisar** |
| [Karanasios 2022](#karanasios-2022) | test 4b sin puntuar | 2 | **sin revisar** |
| [Pitcher 2024](#pitcher-2024) | test 4b sin puntuar · texto | 2 | **sin revisar** |
| [Williams 2025](#williams-2025) | test 4b sin puntuar | 1 | **sin revisar** |
| [NICE CG147](#nice-cg147) | razonamiento fase 2 | 2 | **sin revisar** |
| [NICE NG126](#nice-ng126) | razonamiento fase 2 | 1 | **sin revisar** |
| [NICE NG158](#nice-ng158) | razonamiento fase 2 | 1 | **sin revisar** |
| [Fairbank 2011](#fairbank-2011) | razonamiento fase 2 | 1 | **sin revisar** |
| [Downie 2013](#downie-2013) | razonamiento fase 2 | 2 | **sin revisar** |
| [Henschke 2013](#henschke-2013) | razonamiento fase 2 | 2 | **sin revisar** |
| [Barcelos 2014](#barcelos-2014) | razonamiento fase 2 | 1 | **sin revisar** |
| [HerniaSurge 2018](#herniasurge-2018) | razonamiento fase 2 | 1 | **sin revisar** |
| [Finucane 2020](#finucane-2020) | razonamiento fase 2 | 10 | **sin revisar** |
| [Kim y Chang 2021](#kim-y-chang-2021) | razonamiento fase 2 | 1 | **sin revisar** |
| [Cabre 2022](#cabre-2022) | razonamiento fase 2 | 1 | **sin revisar** |
| [Goodfriend 2022](#goodfriend-2022) | razonamiento fase 2 | 1 | **sin revisar** |
| [Kalakonda 2022](#kalakonda-2022) | razonamiento fase 2 | 1 | **sin revisar** |
| [Rhodes 2022](#rhodes-2022) | razonamiento fase 2 | 1 | **sin revisar** |
| [Barney 2023](#barney-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Basit 2023](#basit-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Chauhan 2023](#chauhan-2023) | razonamiento fase 2 | 3 | **sin revisar** |
| [Chen 2023](#chen-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Cunha 2023](#cunha-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Davis y Silberman 2023](#davis-y-silberman-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Jayarangaiah 2023](#jayarangaiah-2023) | razonamiento fase 2 | 6 | **sin revisar** |
| [Jeanmonod y Varacallo 2023](#jeanmonod-y-varacallo-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Johns 2023](#johns-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Khan y Bollu 2023](#khan-y-bollu-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [King y Lowery 2023](#king-y-lowery-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Lacy 2023](#lacy-2023) | razonamiento fase 2 | 3 | **sin revisar** |
| [LaPelusa y Dave 2023](#lapelusa-y-dave-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Leslie 2023](#leslie-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Malik 2023](#malik-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [May y Marappa-Ganeshan 2023](#may-y-marappa-ganeshan-2023) | razonamiento fase 2 | 3 | **sin revisar** |
| [McMordie 2023](#mcmordie-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Momodu y Savaliya 2023](#momodu-y-savaliya-2023) | razonamiento fase 2 | 3 | **sin revisar** |
| [Oliver y Ashurst 2023](#oliver-y-ashurst-2023) | razonamiento fase 2 | 5 | **sin revisar** |
| [Pak y Kim 2023](#pak-y-kim-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Pana y Saggu 2023](#pana-y-saggu-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Pencle y Varacallo 2023](#pencle-y-varacallo-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Rider y Marra 2023](#rider-y-marra-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Rowe 2023](#rowe-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Rupp y Leslie 2023](#rupp-y-leslie-2023) | razonamiento fase 2 | 2 | **sin revisar** |
| [Rushton 2023](#rushton-2023) | razonamiento fase 2 | 4 | **sin revisar** |
| [Sanvictores 2023](#sanvictores-2023) | razonamiento fase 2 | 5 | **sin revisar** |
| [Schick y Sternard 2023](#schick-y-sternard-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Sekhon 2023](#sekhon-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Shahid 2023](#shahid-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Singleton y Hefner 2023](#singleton-y-hefner-2023) | razonamiento fase 2 | 5 | **sin revisar** |
| [Waheed 2023](#waheed-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Wenker y Quint 2023](#wenker-y-quint-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Ziu 2023](#ziu-2023) | razonamiento fase 2 | 1 | **sin revisar** |
| [Antunes 2024](#antunes-2024) | razonamiento fase 2 | 3 | **sin revisar** |
| [Belyayeva 2024](#belyayeva-2024) | razonamiento fase 2 | 2 | **sin revisar** |
| [Feller 2024](#feller-2024) | razonamiento fase 2 | 5 | **sin revisar** |
| [Hall 2024](#hall-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Hantzidiamantis 2024](#hantzidiamantis-2024) | razonamiento fase 2 | 2 | **sin revisar** |
| [Hunter 2024](#hunter-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Lassiter 2024](#lassiter-2024) | razonamiento fase 2 | 5 | **sin revisar** |
| [Leslie 2024](#leslie-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Lotfollahzadeh 2024](#lotfollahzadeh-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Menger 2024](#menger-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Nandhagopal 2024](#nandhagopal-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Regunath y Oba 2024](#regunath-y-oba-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Rout 2024](#rout-2024) | razonamiento fase 2 | 1 | **sin revisar** |
| [Benjamin y Lui 2025](#benjamin-y-lui-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Budha 2025](#budha-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Daley 2025](#daley-2025) | razonamiento fase 2 | 3 | **sin revisar** |
| [Gill 2025](#gill-2025) | razonamiento fase 2 | 2 | **sin revisar** |
| [Grant y John 2025](#grant-y-john-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Hall 2025](#hall-2025) | razonamiento fase 2 | 2 | **sin revisar** |
| [Jenkins y Vadakekut 2025](#jenkins-y-vadakekut-2025) | razonamiento fase 2 | 2 | **sin revisar** |
| [Jones 2025](#jones-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Kaur 2025](#kaur-2025) | razonamiento fase 2 | 2 | **sin revisar** |
| [Leslie 2025](#leslie-2025) | razonamiento fase 2 | 2 | **sin revisar** |
| [Margetis y Donnally 2025](#margetis-y-donnally-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Margetis y Gillis 2025](#margetis-y-gillis-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Patel 2025](#patel-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Shams 2025](#shams-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Shaw 2025](#shaw-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Suha 2025](#suha-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Tavakoli 2025](#tavakoli-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Vadakekut y Gnugnoli 2025](#vadakekut-y-gnugnoli-2025) | razonamiento fase 2 | 1 | **sin revisar** |
| [Anastasopoulou y Gillespie 2026](#anastasopoulou-y-gillespie-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Consoli y Carlson 2026](#consoli-y-carlson-2026) | razonamiento fase 2 | 3 | **sin revisar** |
| [Denault y Launico 2026](#denault-y-launico-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Farmer y Matto 2026](#farmer-y-matto-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Gillen 2026](#gillen-2026) | razonamiento fase 2 | 2 | **sin revisar** |
| [Jain 2026](#jain-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Sabry y Li 2026](#sabry-y-li-2026) | razonamiento fase 2 | 2 | **sin revisar** |
| [Sendrea 2026](#sendrea-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Vijayan y Mabrouk 2026](#vijayan-y-mabrouk-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Wróblewski 2026](#wróblewski-2026) | razonamiento fase 2 | 1 | **sin revisar** |
| [Zemaitis 2026](#zemaitis-2026) | razonamiento fase 2 | 4 | **sin revisar** |
| [Hutchison 2013](#hutchison-2013) | texto | 1 | **sin revisar** |
| [Großterlinden 2016](#großterlinden-2016) | texto | 1 | **sin revisar** |
| [Frey 2017](#frey-2017) | texto | 1 | **sin revisar** |
| [Lequesne 2008](#lequesne-2008) | puntuación 4b · test 4b sin puntuar · texto | 4 | 2026-10 · Cifras comprobadas en el resumen y en la tabla 2 de Kinsella 2024. La E se midió frente a controles sin dolor de cadera (casos y controles), lo que la infla: la derotación externa resistida pasa a hallazgo. |
| [Grimaldi 2017](#grimaldi-2017) | puntuación 4b · test 4b sin puntuar · texto | 4 | 2026-10 · Cifras comprobadas en la tabla 2 de Kinsella 2024. La palpación y la abducción resistida pasan a las cifras agrupadas de Kinsella 2024; Grimaldi queda como dato del estudio de mayor calidad (y como fuente de la derotación, que pasa a hallazgo). |
| [Metcalfe 2019](#metcalfe-2019) | puntuación 4b · test 4b sin puntuar | 5 | 2026-10 · Sin cambios: texto completo leído (PMC7583647); S, E, LR+ y LR− con sus IC coinciden en los cinco usos. Es la revisión más reciente sobre exploración clínica de la artrosis de cadera. |
| [Pålsson 2020](#pålsson-2020) | puntuación 4b · test 4b sin puntuar | 2 | 2026-10 · Sin cambios: texto completo leído (PMC7511272); RI en neutro S 29 % (13–44), E 94 % (86–100), kappa 0,43. El mismo estudio da para el FADIR S 80 %, E 24 % (ver Reiman 2015). |
| [Kinsella 2024](#kinsella-2024) | puntuación 4b · test 4b sin puntuar | 5 | 2026-10 · Texto completo leído (tablas 2 y 3). En el texto el LR+ de la abducción resistida aparece como 13,39, que en la tabla 3 es la DOR; se usa el LR+ de la tabla (6,09). |
| [NICE NG226](#nice-ng226) | pauta · test 4b sin puntuar | 3 | 2026-10 · Sin cambios: solo respalda el diagnóstico clínico (edad ≥45, dolor con la actividad, rigidez matutina ausente o ≤30 min), sin S ni E; no puntúa. No se pudo abrir nice.org.uk (bloqueado por la red) para comprobar si hay actualización. |
| [Hölmich 1999](#hölmich-1999) | pauta | 1 | 2026-10 · Texto completo leído: la pauta de ca16 coincide con el panel 1 y los métodos. Corregido el trote (pasadas las 6 primeras semanas) y añadida la población (varones de 18 a 50 años). No se encontró un ensayo posterior que lo sustituya. |
| [Altman 1991](#altman-1991) | test 4b sin puntuar · texto | 2 | 2026-10 · S 86 % / E 75 % del árbol clínico comprobadas en el resumen, pero son de la muestra de desarrollo; en atención primaria los criterios no se sostienen (Bierma-Zeinstra 1999, Reijman 2004) y no hay S/E de ese ámbito. Los criterios ACR de cadera (ca1) pasan a hallazgo, sin puntuar. |
| [McCarthy y Busconi 1995](#mccarthy-y-busconi-1995) | test 4b sin puntuar | 2 | 2026-10 · Texto completo no conseguido. Según Reiman 2015 (tabla 3), el estudio no publicó S ni E del test de Thomas («NA»): las calcularon los autores del metaanálisis. Serie de casos con riesgo de sesgo alto; Narvani 2003 no lo confirma. El Thomas pasa a hallazgo en labrum. |
| [Bierma-Zeinstra 1999](#bierma-zeinstra-1999) | test 4b sin puntuar · texto | 2 | 2026-10 · Solo resumen leído (PubMed 10332979): el texto completo no es accesible. No da S ni E de los criterios clínicos. |
| [Narvani 2003](#narvani-2003) | test 4b sin puntuar · texto | 3 | 2026-10 · Sin cambios: chasquido S 100 %, E 85 % y «Thomas ni sensible ni específico» comprobados en el resumen. |
| [Reijman 2004](#reijman-2004) | test 4b sin puntuar · texto | 2 | 2026-10 · Solo resumen leído: en PMC (PMC1754907) el cuerpo es un PDF escaneado que no se pudo descargar. |
| [Peat 2006](#peat-2006) | test 4b sin puntuar | 1 | 2026-10 · Texto completo leído (PMC1798313, tabla 3). Más recientes en la misma dirección, solo resumen: Miguel 2019 (Clin Rheumatol) y Wang 2024 (Arthritis Care Res). |
| [Reiman 2015](#reiman-2015) | test 4b sin puntuar · texto | 8 | 2026-10 · Texto completo leído (tablas 3 y 4): cifras correctas, pero el FADDIR agrupado sale de pacientes operados (probabilidad previa 90 %) y los propios autores concluyen que ningún test cambia de forma significativa la probabilidad. El FADDIR pasa a hallazgo en SIFA (con Pålsson 2020) y en labrum. Revisiones posteriores (Shanmugaraj 2020, Fernandes 2022, Dhillon 2025) no dan un valor agrupado mejor. |
| [Wong 2022](#wong-2022) | test 4b sin puntuar | 2 | 2026-10 · Sin cambios: solo describe la técnica, no aporta cifras. |
| [Adib 2023](#adib-2023) | test 4b sin puntuar · texto | 4 | 2026-10 · Sin cambios: S y E del Arlington y del twist comprobadas en el resumen; siguen como hallazgo. El mismo estudio da para el FADIR S 43 %, E 56 % (ver Reiman 2015). |
| [Halliwell 2026](#halliwell-2026) | test 4b sin puntuar | 1 | 2026-10 · Sin cambios: S 94 %, E 100 %, AUC 0,879 comprobadas en el resumen; sigue como hallazgo. |
| [Altman 1986](#altman-1986) | texto | 2 | 2026-10 · Sustituida por Peat 2006 en los criterios del ACR de rodilla (ro1): su S 95 % / E 69 % sale de la muestra de desarrollo, no del ámbito de un fisio. Solo queda citada como contexto en el texto del test. |

## 1. Tarjetas de consulta

Autores: Lluch, López-Cubas, Jones, Jull, Hall y Lewis  
Título: *Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders*  
Publicación: ZERAPI  
DOI: —  
Última revisión: **sin revisar**  
Nota: Base de las guías clínicas de cada región, de las que son extracto las tarjetas de consulta (repo guia-de-consulta). Los capítulos que citan los pies de las tarjetas (Struyf y Powell y Lewis, cap. 3, en hombro; Fondevila Suárez, cap. 5, en lumbar) son de este libro. Capítulos leídos enteros (PDF escaneado del usuario) y citados directamente como fuente, con capítulo y páginas: cap. 5.1 (Fondevila Suárez, lumbar, pp. 295–326: pronósticos de lu3–lu8, tests de lu5–lu9 y l_e7) caps. 5.3 y 5.3.1 (cervical) y cap. 4.1, subcaps. 4.1.1–4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg, cadera, pp. 123–179: pronósticos y tests de cadera y razonamiento del cribado de cadera).

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

| Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|
| h1 · Capsulitis Adhesiva | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h2 · Síndrome de Pinzamiento Subacromial (Impingement) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h3 · Rotura del Manguito Rotador | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h4 · Inestabilidad Glenohumeral (Anterior o Posterior) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h5 · Lesión Labral Superior (SLAP) | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h7 · Artropatía Acromioclavicular | Test «Gesto testigo (①) y medida objetiva (②)» | 4b · cita bajo el test | 1 |
| h11 · Luxación Bloqueada o Fractura (→ Rx) | Test «Rx antes de nada» | 4b · cita bajo el test | 1 |

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

[Adib 2023](#adib-2023) · [Al-Subahi 2017](#al-subahi-2017) · [Alentorn-Geli 2026](#alentorn-geli-2026) · [Altman 1986](#altman-1986) · [Altman 1991](#altman-1991) · [Anastasopoulou y Gillespie 2026](#anastasopoulou-y-gillespie-2026) · [Antunes 2024](#antunes-2024) · [Apelby-Albrecht 2013](#apelby-albrecht-2013) · [Appelboam 2008](#appelboam-2008) · [Bachmann 2003](#bachmann-2003) · [Barcelos 2014](#barcelos-2014) · [Barney 2023](#barney-2023) · [Basit 2023](#basit-2023) · [Belyayeva 2024](#belyayeva-2024) · [Benjamin y Lui 2025](#benjamin-y-lui-2025) · [Bierma-Zeinstra 1999](#bierma-zeinstra-1999) · [Blanpied 2017](#blanpied-2017) · [Budha 2025](#budha-2025) · [Cabre 2022](#cabre-2022) · [Campbell 2020](#campbell-2020) · [Chauhan 2023](#chauhan-2023) · [Chen 2023](#chen-2023) · [Chimenti 2024](#chimenti-2024) · [Chronopoulos 2004](#chronopoulos-2004) · [Cibulka 2017](#cibulka-2017) · [Consenso de Zúrich IHiPRN](#consenso-de-zúrich-ihiprn) · [Consoli y Carlson 2026](#consoli-y-carlson-2026) · [Cook 2011](#cook-2011) · [Cunha 2023](#cunha-2023) · [Daley 2025](#daley-2025) · [Davis y Silberman 2023](#davis-y-silberman-2023) · [Décary 2018](#décary-2018) · [Demont 2022](#demont-2022) · [Denault y Launico 2026](#denault-y-launico-2026) · [Desmeules 2025](#desmeules-2025) · [Devillé 2000](#devillé-2000) · [Dobbs 2016](#dobbs-2016) · [Dorf 2007](#dorf-2007) · [Downie 2013](#downie-2013) · [Enseki 2023](#enseki-2023) · [Fairbank 2011](#fairbank-2011) · [Farmer y Matto 2026](#farmer-y-matto-2026) · [Feller 2024](#feller-2024) · [Finucane 2020](#finucane-2020) · [Flynn 2002](#flynn-2002) · [Frey 2017](#frey-2017) · [Fritz 2005](#fritz-2005) · [Genevay 2017](#genevay-2017) · [George 2021](#george-2021) · [Getsoian 2020](#getsoian-2020) · [Gill 2025](#gill-2025) · [Gillen 2026](#gillen-2026) · [Gomes 2022](#gomes-2022) · [Goodfriend 2022](#goodfriend-2022) · [Goodman 2018](#goodman-2018) · [Grant y John 2025](#grant-y-john-2025) · [Griffin 2018](#griffin-2018) · [Grimaldi 2017](#grimaldi-2017) · [Großterlinden 2016](#großterlinden-2016) · [Hall 2024](#hall-2024) · [Hall 2025](#hall-2025) · [Halliwell 2026](#halliwell-2026) · [Han 2023](#han-2023) · [Hancock 2007](#hancock-2007) · [Hantzidiamantis 2024](#hantzidiamantis-2024) · [Hegedus 2012](#hegedus-2012) · [Henschke 2013](#henschke-2013) · [Hermans 2013](#hermans-2013) · [HerniaSurge 2018](#herniasurge-2018) · [Hölmich 1999](#hölmich-1999) · [Hunter 2024](#hunter-2024) · [Hutchison 2013](#hutchison-2013) · [Jain 2026](#jain-2026) · [Jayarangaiah 2023](#jayarangaiah-2023) · [Jeanmonod y Varacallo 2023](#jeanmonod-y-varacallo-2023) · [Jenkins y Vadakekut 2025](#jenkins-y-vadakekut-2025) · [Johns 2023](#johns-2023) · [Jones 2025](#jones-2025) · [Jonsson 2008](#jonsson-2008) · [Jull 2007](#jull-2007) · [Kalakonda 2022](#kalakonda-2022) · [Karanasios 2022](#karanasios-2022) · [Kastelein 2008](#kastelein-2008) · [Katz 1995](#katz-1995) · [Kaur 2025](#kaur-2025) · [Kelley 2013](#kelley-2013) · [Kemp 2020](#kemp-2020) · [Khan y Bollu 2023](#khan-y-bollu-2023) · [Kim 2001](#kim-2001) · [Kim 2004](#kim-2004) · [Kim 2007](#kim-2007) · [Kim y Chang 2021](#kim-y-chang-2021) · [King y Lowery 2023](#king-y-lowery-2023) · [Kinsella 2024](#kinsella-2024) · [Koc 2023](#koc-2023) · [Krill 2018](#krill-2018) · [Kuijper 2009](#kuijper-2009) · [Kulig 2009](#kulig-2009) · [Lacy 2023](#lacy-2023) · [LaPelusa y Dave 2023](#lapelusa-y-dave-2023) · [Laslett 2006](#laslett-2006) · [Laslett 2008](#laslett-2008) · [Lassiter 2024](#lassiter-2024) · [Lequesne 2008](#lequesne-2008) · [Leslie 2023](#leslie-2023) · [Leslie 2024](#leslie-2024) · [Leslie 2025](#leslie-2025) · [Litaker 2000](#litaker-2000) · [Liu 2025](#liu-2025) · [Lluch 2020](#lluch-2020) · [Lotfollahzadeh 2024](#lotfollahzadeh-2024) · [Lucas 2009](#lucas-2009) · [Maffulli 1998](#maffulli-1998) · [Mahadevan 2015](#mahadevan-2015) · [Majlesi 2008](#majlesi-2008) · [Malik 2023](#malik-2023) · [Margetis y Donnally 2025](#margetis-y-donnally-2025) · [Margetis y Gillis 2025](#margetis-y-gillis-2025) · [Martin 2021](#martin-2021) · [Mastromarchi 2021](#mastromarchi-2021) · [Maxwell y Sterling 2013](#maxwell-y-sterling-2013) · [May y Marappa-Ganeshan 2023](#may-y-marappa-ganeshan-2023) · [McCarthy y Busconi 1995](#mccarthy-y-busconi-1995) · [McKeon 2008](#mckeon-2008) · [McMordie 2023](#mcmordie-2023) · [Mellor 2016](#mellor-2016) · [Mellor 2018](#mellor-2018) · [Menger 2024](#menger-2024) · [Metcalfe 2019](#metcalfe-2019) · [Molloy 2003](#molloy-2003) · [Momodu y Savaliya 2023](#momodu-y-savaliya-2023) · [Munakomi 2023](#munakomi-2023) · [Nandhagopal 2024](#nandhagopal-2024) · [Narvani 2003](#narvani-2003) · [Netterström-Wedin 2021](#netterström-wedin-2021) · [NICE CG147](#nice-cg147) · [NICE NG126](#nice-ng126) · [NICE NG158](#nice-ng158) · [NICE NG226](#nice-ng226) · [NICE NG59](#nice-ng59) · [Nunes 2013](#nunes-2013) · [Oliver y Ashurst 2023](#oliver-y-ashurst-2023) · [Pak y Kim 2023](#pak-y-kim-2023) · [Pålsson 2020](#pålsson-2020) · [Pana y Saggu 2023](#pana-y-saggu-2023) · [Paquin 2022](#paquin-2022) · [Park 2005](#park-2005) · [Park 2008](#park-2008) · [Park 2019](#park-2019) · [Patel 2025](#patel-2025) · [Peat 2006](#peat-2006) · [Pencle y Varacallo 2023](#pencle-y-varacallo-2023) · [Pitcher 2024](#pitcher-2024) · [Rathleff 2020](#rathleff-2020) · [Regunath y Oba 2024](#regunath-y-oba-2024) · [Reid 2014](#reid-2014) · [Reijman 2004](#reijman-2004) · [Reiman 2014](#reiman-2014) · [Reiman 2015](#reiman-2015) · [Rhodes 2022](#rhodes-2022) · [Rich 2025](#rich-2025) · [Rider y Marra 2023](#rider-y-marra-2023) · [Rout 2024](#rout-2024) · [Rowe 2023](#rowe-2023) · [Rupp y Leslie 2023](#rupp-y-leslie-2023) · [Rushton 2023](#rushton-2023) · [Sabry y Li 2026](#sabry-y-li-2026) · [Salamh 2025](#salamh-2025) · [Sanvictores 2023](#sanvictores-2023) · [Saueressig 2021](#saueressig-2021) · [Schick y Sternard 2023](#schick-y-sternard-2023) · [Sekhon 2023](#sekhon-2023) · [Sendrea 2026](#sendrea-2026) · [Serner 2020](#serner-2020) · [Shahid 2023](#shahid-2023) · [Shams 2025](#shams-2025) · [Shaw 2025](#shaw-2025) · [Singleton y Hefner 2023](#singleton-y-hefner-2023) · [Sman 2015](#sman-2015) · [Smith 2015](#smith-2015) · [Solomon 2001](#solomon-2001) · [Suha 2025](#suha-2025) · [Suri 2010](#suri-2010) · [Tavakoli 2025](#tavakoli-2025) · [Tawa 2017](#tawa-2017) · [Thoomes 2026](#thoomes-2026) · [Vadakekut y Gnugnoli 2025](#vadakekut-y-gnugnoli-2025) · [van Dijk 1996](#van-dijk-1996) · [Vandeputte 2026](#vandeputte-2026) · [Vijayan y Mabrouk 2026](#vijayan-y-mabrouk-2026) · [Waheed 2023](#waheed-2023) · [Walton 2004](#walton-2004) · [Warden 2007](#warden-2007) · [Wenker y Quint 2023](#wenker-y-quint-2023) · [Williams 2025](#williams-2025) · [Wong 2022](#wong-2022) · [Wróblewski 2026](#wróblewski-2026) · [Zaslav 2001](#zaslav-2001) · [Zemaitis 2026](#zemaitis-2026) · [Zhang 2010](#zhang-2010) · [Ziu 2023](#ziu-2023)

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

### Al-Subahi 2017

Autores: Al-Subahi, Alayat, Alshehri, Helal, Alhasan, Alalawi, Takrouni y Alfaqeh  
Título: *The effectiveness of physiotherapy interventions for sacroiliac joint dysfunction: a systematic review*  
Publicación: J Phys Ther Sci 29(9):1689–1694  
DOI: 10.1589/jpts.29.1689  
Última revisión: **sin revisar**  
Nota: Texto completo en PMC5599847 (acceso abierto). Pauta de lu8.

Citada como:

1. Al-Subahi 2017, J Phys Ther Sci 29(9):1689–1694 (revisión sistemática, 9 estudios de 2004–2014 de calidad baja o media: manipulación, ejercicio y vendaje neuromuscular) · NICE NG59 (rec. 1.2.7; actualizada en julio de 2026)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Alentorn-Geli 2026

Autores: Alentorn-Geli, Brilakis, Ângelo, Bøe, Ruíz-Iban, Dyrna, Saccomanno, Lacheta, Housset, Benea, Fonte, Boutsiadis, Zampeli, Milano, Beaufils y Kovacic  
Título: *Age- and time-specific management of traumatic anterior shoulder instability: The 2024 ESSKA–ESA Formal Consensus. Part 2: Treatment and return to sports*  
Publicación: Knee Surg Sports Traumatol Arthrosc 34:3040–3051  
DOI: 10.1002/ksa.70497  
Última revisión: **sin revisar**  
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

### Anastasopoulou y Gillespie 2026

Autores: Anastasopoulou y Gillespie  
Título: *Paget Bone Disease*  
Publicación: StatPearls [Internet], NBK430805 (act. 2026-08-17)  
DOI: —  
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
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

Publicación: BMJ 337:a2428  
DOI: 10.1136/bmj.a2428  
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
DOI: 10.1136/bmj.326.7386.417  
Última revisión: **sin revisar**

Citada como:

1. TOBILLO → radiografía si dolor en la zona maleolar Y alguno: dolor óseo en los 6 cm distales del borde posterior de la tibia o punta del maléolo medial · ídem del peroné o punta del maléolo lateral · no carga cuatro pasos, ni justo tras la lesión ni en consulta. PIE → radiografía si dolor en el mediopié Y alguno: dolor óseo en la base del 5.º MT · en el navicular · no carga cuatro pasos. Solo descarta: Bachmann 2003 (27 estudios, 15 581 pacientes) da LR− 0,08 aplicando solo la regla del tobillo o solo la del pie, pero 0,21 (IC 95 % 0,12–0,38) en los estudios que aplican las dos juntas, que es como se usan aquí (se toma la más prudente). El positivo es un hallazgo: en adultos, LR+ 1,47 (IC 1,11–1,93; Gomes 2022).
2. Bachmann 2003 (BMJ 326:417); Gomes 2022 (BMC Musculoskelet Disord 23:885)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Reglas de Ottawa de tobillo y de pie» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp5 · Fracturas del Pie (5.º MT, Calcáneo) | Test «Reglas de Ottawa de tobillo y de pie» | 4b · cita bajo el test | 2 |

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
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Basit 2023 — Basit, Pop, Malik y Sharma, «Fitz-Hugh-Curtis Syndrome», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_g2` · Ginecológico | 2 · razonamiento del cribado | 1 |

### Belyayeva 2024

Autores: Belyayeva, Leslie, Rout y Jeong  
Título: *Acute Pyelonephritis*  
Publicación: StatPearls [Internet], NBK519537 (act. 2024-02-28)  
DOI: —  
Última revisión: **sin revisar**  
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
DOI: 10.2519/jospt.2017.0302  
Última revisión: **sin revisar**

Citada como:

1. Reproducción del dolor de hombro con extensión + inclinación lateral ipsilateral + compresión axial. En el dolor de hombro cervicogénico el dolor se reproduce con las pruebas de la columna cervical y la movilidad pasiva glenohumeral no está limitada, lo que lo distingue del hombro congelado (Lluch 2020, tabla 2). El Spurling se ha estudiado para la radiculopatía cervical (S 0,50, E 0,86–0,93; revisión de Rubinstein recogida por Blanpied 2017), no para el dolor referido al hombro: aquí no puntúa.
2. Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75 · Blanpied 2017 (J Orthop Sports Phys Ther 47(7), p. A19)
3. Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía)
4. Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · Lluch 2020, cap. 5.3 (Jull y Falla), p. 378 (test de flexión craneocervical para dosificar)
5. Kuijper 2009, BMJ 339:b3883 (ensayo aleatorizado, n = 205; la lista de ejercicios está en su apéndice web, no revisado) · Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h6 · Disfunción Cervical con Dolor Referido a Hombro | Test «Test de Spurling (Compresión Foraminal)» (en `criterio`) | 4b · mención en el texto | 1 |
| Hombro | h6 · Disfunción Cervical con Dolor Referido a Hombro | Test «Test de Spurling (Compresión Foraminal)» | 4b · cita bajo el test | 2 |
| Hombro | h6 · Disfunción Cervical con Dolor Referido a Hombro | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce1 · Disfunción Articular Cervical | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce2 · Disfunción Neuromuscular Cervical | Pauta de tratamiento | 5 · cita de la pauta | 4 |
| Cervical | ce3 · Radiculopatía Cervical | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce4 · Cefalea Cervicogénica | Pauta de tratamiento | 5 · cita de la pauta | 4 |
| Cervical | ce5 · Trastornos Asociados a Latigazo Cervical (WAD) | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce6 · Debilidad Muscular Cérvico-Escapular | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce7 · Dolor Mecánico Cervical Inespecífico Crónico | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce9 · Disfunción Postural Cérvico-Torácica | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce11 · Fatiga Muscular Cérvico-Escapular | Pauta de tratamiento | 5 · cita de la pauta | 3 |
| Cervical | ce12 · Dolor Radicular Cervical | Pauta de tratamiento | 5 · cita de la pauta | 5 |
| Cervical | ce14 · Dolor Cervical Idiopático | Pauta de tratamiento | 5 · cita de la pauta | 3 |

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
Última revisión: **sin revisar**  
Nota: Texto completo en PMC9724109. Razonamiento del cribado lumbar (l_e6).

Citada como:

1. Cabre 2022 — Cabre, Moore, Smith-Ryan y Hackney, «Relative Energy Deficiency in Sport (RED-S): Scientific, Clinical, and Practical Implications for the Female Athlete», Dtsch Z Sportmed 2022;73(7):225–234 (texto completo en PMC).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_e6` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |

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

### Chauhan 2023

Autores: Chauhan, Jandu, Brent y Al-Dhahir  
Título: *Rheumatoid Arthritis*  
Publicación: StatPearls [Internet], NBK441999 (act. 2023-05-25)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Chauhan 2023 — Chauhan, Jandu, Brent y Al-Dhahir, «Rheumatoid Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de mayo de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_in2` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_n1` · Médula / Estructural | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv_in2` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |

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
Última revisión: **sin revisar**

Citada como:

1. Chronopoulos 2004 (Am J Sports Med; 35 lesiones AC crónicas aisladas frente a 580 controles quirúrgicos)
2. Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6). Combinado con el Paxinos y hechos en serie (los dos positivos), la revisión de Krill 2018 da E 95,8 % y LR+ 2,71, la mejor de las combinaciones, y concluye que ninguna cambia más que poco la probabilidad; Lluch 2020 (cap. 3.1, p. 61) lo resume como «S y E >90 %», cifra que el resumen de la revisión no respalda.
3. Chronopoulos 2004 (Am J Sports Med) · Walton 2004 (J Bone Joint Surg Am) · Krill 2018 (Phys Sportsmed 46:98–104, revisión sistemática; resumen)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h7 · Artropatía Acromioclavicular | Test «Test de Aducción Cruzada (Cross-body Adduction)» | 4b · cita bajo el test | 1 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» (en `criterio`) | 4b · mención en el texto | 2 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» | 4b · cita bajo el test | 3 |

### Cibulka 2017

Autores: Cibulka, Bloom, Enseki, Macdonald, Woehrle y McDonough  
Título: *Hip Pain and Mobility Deficits—Hip Osteoarthritis: Revision 2017*  
Publicación: J Orthop Sports Phys Ther 47(6):A1–A37  
DOI: 10.2519/jospt.2017.0301  
Última revisión: **sin revisar**  
Nota: Guía de práctica clínica APTA; PDF aportado por el usuario. Dosis de ca1 (cadera); donde choca con NICE NG226 (terapia manual, ultrasonido) prevalece NICE, más reciente.

Citada como:

1. Cibulka 2017, J Orthop Sports Phys Ther 47(6):A1–A37 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · NICE NG226 (rec. 1.3.1–1.3.11; prevalece donde chocan, por ser más reciente)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca1 · Artrosis de Cadera | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Consenso de Zúrich IHiPRN

Autores: Kemp, Risberg, Mosler, Harris-Hayes, Serner, Moksnes, Bloom, Crossley et al. (grupo IHiPRN; último autor, Bizzini)  
Título: *Physiotherapist-led treatment for young to middle-aged active adults with hip-related pain: consensus recommendations from the International Hip-related Pain Research Network, Zurich 2018*  
Publicación: Br J Sports Med 54:504–511 (2020)  
DOI: 10.1136/bjsports-2019-101458  
Última revisión: **sin revisar**  
Nota: PDF aportado por el usuario. Mismo primer autor y año que la revisión «Kemp 2020», por eso se cita como «consenso de Zúrich». Dosis de ca2 y ca3 (cadera).

Citada como:

1. Abordaje multimodal (B): modificar la actividad y fortalecer la musculatura propia de la cadera (psoas ilíaco, glúteo medio y mayor, rotadores internos y externos), el tronco (abdominales y paravertebrales) y el resto del miembro inferior, junto con terapia manual, corrección postural y del movimiento, estiramientos y equilibrio. Evitar los ejercicios que provoquen síntomas o que lleven a rangos que reproduzcan el pinzamiento. Educación para modificar los factores agravantes y manejar el dolor (C); entrenamiento del patrón de movimiento en las actividades que duelen (C); movilización articular si el dolor o la cápsula limitan la movilidad, y de tejidos blandos si lo hacen músculo y fascia (F); reeducación neuromuscular progresiva (F). La ortesis sola no se recomienda (D, evidencia contradictoria). Duración de al menos 3 meses; recomendar actividad física, incluido el deporte, y hablar de expectativas, decidir juntos y educar (consenso de Zúrich). En el ensayo FASHIoN, 6–10 contactos en 12–24 semanas; la artroscopia mejoró algo más a los 12 meses (6,8 puntos de iHOT-33). Ninguna fuente fija series ni repeticiones: el volumen queda a criterio del clínico.
2. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Griffin 2018, Lancet 391:2225–2235 (ensayo aleatorizado UK FASHIoN, n = 348)
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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Consoli y Carlson 2026 — Consoli y Carlson, «Endometriosis», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de junio de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_u4` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l3` · Gastrointestinal | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_e3` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |

### Cook 2011

Publicación: —  
DOI: 10.1002/pri.500  
Última revisión: **sin revisar**

Citada como:

1. Cook 2011 (n = 1448). 4 de 5: S 6 %, E 98 %; ninguno: S 96 %

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Cluster «Cluster de Cook (anamnesis y observación)» | 4b · cita del cluster | 1 |

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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Daley 2025 — Daley, Ali, Ohnuma y Adigun, «Anorexia and Cachexia», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h6` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_on3` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Cervical | — | Pregunta `cv5` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |

### Davis y Silberman 2023

Autores: Davis y Silberman  
Título: *Acute Bacterial Prostatitis*  
Publicación: StatPearls [Internet], NBK459257 (act. 2023-05-22)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Davis y Silberman 2023 — Davis y Silberman, «Acute Bacterial Prostatitis», StatPearls [Internet], NCBI Bookshelf, última actualización 22 de mayo de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_u2` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Décary 2018

Publicación: PLoS One 13:e0198797 · PM R 10:472–482 (dos artículos)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Dos artículos distintos con la misma clave: la cita de cada uso dice la revista. DOI de cada uno (el campo doi admite uno solo): PLoS One (LCA) 10.1371/journal.pone.0198797; PM R (menisco) 10.1016/j.pmrj.2017.10.009.

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
DOI: 10.1016/j.msksp.2022.102640  
Última revisión: **sin revisar**

Citada como:

1. Demont 2022 (Musculoskelet Sci Pract, metaanálisis, 4 estudios, n = 182; frente a cefalea facetaria cervical baja, migraña, cefaleas concomitantes o asintomáticos; certeza moderada. S IC 95 %: 70–92 %; E IC 95 %: 71–91 %; LR+ IC 2,6–9,5; LR− IC 0,1–0,4; 4 estudios de cohorte prospectivos de Hall y Ogince, 2007–2010; riesgo de sesgo por la selección de pacientes). FRT normal en cervicogénica de C2–C3/C3–C4: Getsoian 2020 (BMJ Open, bloqueos diagnósticos controlados), citado en Demont 2022. Precauciones: Paquin 2022 (Arch Physiother 12:26, artículo de opinión)
2. Jull 2007 (Cephalalgia 27:793–802, parte 1; 18 cervicogénicas frente a 22 migrañas, 33 tensionales y 57 controles, n = 130; tabla 3). Riesgo de sesgo alto según Demont 2022 (PROBAST)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | ce4 · Cefalea Cervicogénica | Test «Test de Flexión-Rotación Cervical (CFRT)» | 4b · cita bajo el test | 1 |
| Cervical | ce4 · Cefalea Cervicogénica | Test «Cluster: ROM cervical + PAIVM + CCFT» | 4b · cita bajo el test | 2 |

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
Última revisión: **sin revisar**  
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

### Devillé 2000

Publicación: —  
DOI: 10.1097/00007632-200005010-00016  
Última revisión: **sin revisar**

Citada como:

1. Devillé 2000 (revisión sistemática; referencia: cirugía)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «Test de Elevación de Pierna Recta (SLR) ipsilateral» | 4b · cita bajo el test | 1 |
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «SLR Contralateral (Lasègue cruzado)» | 4b · cita bajo el test | 1 |

### Dobbs 2016

Publicación: Manual Therapy  
DOI: 10.1016/j.math.2016.05.332  
Última revisión: **sin revisar**

Citada como:

1. Katz 1995, datos citados en Dobbs 2016 (Manual Therapy; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Test de extensión lumbar de 30 s» | 4b · cita bajo el test | 1 |

### Dorf 2007

Publicación: J Hand Surg Am 32:882–886  
DOI: 10.1016/j.jhsa.2007.04.010  
Última revisión: **sin revisar**

Citada como:

1. Karanasios 2022 (J Hand Ther 35:541–551; revisión sistemática, 24 estudios, 97 % con riesgo de sesgo alto o incierto; solo 2 estudios de exploración física). Estudio de origen, casi con seguridad: Dorf 2007 (J Hand Surg Am 32:882–886; retrospectivo, 81 pacientes; una diferencia del 8 % entre flexión y extensión distinguió el brazo afectado del sano con un 83 % de precisión)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co1 · Tendinopatía Lateral (Epicondilalgia Lateral / Codo de Tenista) | Test «Reducción de fuerza de prensión (diferencia 5-10% entre posiciones)» | 4b · cita bajo el test | 1 |

### Downie 2013

Autores: Downie, Williams, Henschke, Hancock, Ostelo, de Vet, Macaskill, Irwig, van Tulder, Koes y Maher  
Título: *Red flags to screen for malignancy and fracture in patients with low back pain: systematic review*  
Publicación: BMJ 347:f7095  
DOI: 10.1136/bmj.f7095  
Última revisión: **sin revisar**  
Nota: Texto completo en PMC3898572. Resume las dos revisiones Cochrane de banderas rojas (malignidad y fractura).

Citada como:

1. Downie 2013 — Downie, Williams, Henschke et al., «Red flags to screen for malignancy and fracture in patients with low back pain: systematic review», BMJ 2013;347:f7095 (texto completo en PMC).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_e4` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |

### Enseki 2023

Autores: Enseki, Bloom, Harris-Hayes, Cibulka, Disantis, Di Stasi, Malloy, Clohisy y Martin  
Título: *Hip Pain and Movement Dysfunction Associated With Nonarthritic Hip Joint Pain: A Revision*  
Publicación: J Orthop Sports Phys Ther 53(7):CPG1–CPG70  
DOI: 10.2519/jospt.2023.0302  
Última revisión: **sin revisar**  
Nota: Guía de práctica clínica APTA; PDF aportado por el usuario (dos partes). Dosis de ca2 y ca3 (cadera).

Citada como:

1. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Griffin 2018, Lancet 391:2225–2235 (ensayo aleatorizado UK FASHIoN, n = 348)
2. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía; serie de Murtha citada en ella) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Kemp 2020, Br J Sports Med 54:1382–1394 (revisión sistemática)
3. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía; la precaución está en su descripción de la intervención multimodal)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Pauta de tratamiento | 5 · cita de la pauta | 1 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Pauta de tratamiento | 5 · cita de la pauta | 2 |
| Cadera | ca12 · Ligamento Redondo e Inestabilidad | Pauta de tratamiento | 5 · cita de la pauta | 3 |

### Fairbank 2011

Autores: Fairbank, Hashimoto, Dailey, Patel y Dettori  
Título: *Does patient history and physical examination predict MRI proven cauda equina syndrome?*  
Publicación: Evid Based Spine Care J 2(4):27–33  
DOI: 10.1055/s-0031-1274754  
Última revisión: **sin revisar**  
Nota: Texto completo en PMC3506147.

Citada como:

1. Fairbank 2011 — Fairbank, Hashimoto, Dailey, Patel y Dettori, «Does patient history and physical examination predict MRI proven cauda equina syndrome?», Evid Based Spine Care J 2011;2(4):27–33 (texto completo en PMC).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l6` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Farmer y Matto 2026

Autores: Farmer y Matto  
Título: *Lymphadenopathy*  
Publicación: StatPearls [Internet], NBK513250 (act. 2026-09-09)  
DOI: —  
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**

Citada como:

1. Flynn 2002 (regla pronóstica: probabilidad de éxito con manipulación del 45 % al 95 %)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu1 · Disfunción Segmentaria Lumbosacra (Déficit de Movilidad) | Test «Regla de Predicción Clínica de Flynn (4/5 criterios)» | 4b · cita bajo el test | 1 |

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

Publicación: —  
DOI: 10.1007/s00586-004-0803-4  
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
DOI: 10.1016/j.spinee.2017.05.005  
Última revisión: **sin revisar**

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
Última revisión: **sin revisar**  
Nota: Texto completo en PMC10508241 (manuscrito del autor). En ese texto no se ven las letras de grado: se deducen del verbo con la tabla de la propia guía. Pauta de lu1–lu7 y lu9.

Citada como:

1. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · NICE NG59 (rec. 1.2.1 y 1.2.7; actualizada en julio de 2026)
2. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D)
3. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · NICE NG59 (rec. 1.2.6 y 1.2.7; actualizada en julio de 2026)
4. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · Munakomi 2023, StatPearls, «Spinal Stenosis and Neurogenic Claudication» (tratamiento conservador)
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

### Gill 2025

Autores: Gill, Leslie y Minter  
Título: *Acute Cystitis*  
Publicación: StatPearls [Internet], NBK459322 (act. 2025-11-28)  
DOI: —  
Última revisión: **sin revisar**  
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
| Lumbar | — | `sistemas.3.banderasRojas.5` | 2 · mención en el texto | 1 |
| Lumbar | — | `sistemas.3.criterioCompuesto.nota` | 2 · criterio compuesto del cribado | 2 |
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

### Grant y John 2025

Autores: Grant y John  
Título: *Cholestatic Jaundice*  
Publicación: StatPearls [Internet], NBK482279 (act. 2025-01-19)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Grant y John 2025 — Grant y John, «Cholestatic Jaundice», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_gi2` · GI / Hepático | 2 · razonamiento del cribado | 1 |

### Griffin 2018

Autores: Griffin, Dickenson, Wall, Achana, Donovan, Griffin, Hobson, Hutchinson, Jepson, Parsons, Petrou, Realpe, Smith y Foster (FASHIoN Study Group)  
Título: *Hip arthroscopy versus best conservative care for the treatment of femoroacetabular impingement syndrome (UK FASHIoN): a multicentre randomised controlled trial*  
Publicación: Lancet 391(10136):2225–2235  
DOI: 10.1016/s0140-6736(18)31202-9  
Última revisión: **sin revisar**  
Nota: Texto completo en PMC5988794 (leído en Europe PMC). Dosis de ca2 (cadera).

Citada como:

1. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Griffin 2018, Lancet 391:2225–2235 (ensayo aleatorizado UK FASHIoN, n = 348)

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

Publicación: eClinicalMedicine  
DOI: 10.1016/j.eclinm.2023.101960  
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
DOI: 10.1007/s00586-007-0391-1  
Última revisión: **sin revisar**  
Nota: Cifra anterior, sustituida por Han 2023 (se menciona en la cita).

Citada como:

1. Han 2023 (eClinicalMedicine, revisión sistemática, 4 estudios; LR+ IC 95 %: 1,44–6,50; referencia: discografía). Antes: Hancock 2007, LR+ 2,8

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu6 · Dolor Lumbar Discogénico | Test «Centralización con movimientos repetidos» | 4b · cita bajo el test | 1 |

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

### Hegedus 2012

Publicación: Br J Sports Med 46:964–978  
DOI: 10.1136/bjsports-2012-091066  
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

### Henschke 2013

Autores: Henschke, Maher, Ostelo, de Vet, Macaskill e Irwig  
Título: *Red flags to screen for malignancy in patients with low-back pain*  
Publicación: Cochrane Database Syst Rev (2):CD008686  
DOI: 10.1002/14651858.CD008686.pub2  
Última revisión: **sin revisar**  
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

### HerniaSurge 2018

Autores: HerniaSurge Group  
Título: *International guidelines for groin hernia management*  
Publicación: Hernia 22(1):1–165  
DOI: 10.1007/s10029-017-1668-x  
Última revisión: **sin revisar**  
Nota: Texto completo en PMC5809582 (Europe PMC). Razonamiento del cribado de cadera (ca_gi3): exploración clínica de la ingle como prueba de referencia, epidemiología y factores de riesgo. Hay una actualización (Stabilini 2023, BJS Open, PMC10588975) que no cambia esos puntos.

Citada como:

1. HerniaSurge 2018 — HerniaSurge Group, «International guidelines for groin hernia management», Hernia 2018;22(1):1–165 (texto completo en PMC).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_gi3` · Gastrointestinal | 2 · razonamiento del cribado | 1 |

### Hölmich 1999

Publicación: Lancet 353(9151):439–43  
DOI: 10.1016/S0140-6736(98)03340-6  
Última revisión: 2026-10 · Texto completo leído: la pauta de ca16 coincide con el panel 1 y los métodos. Corregido el trote (pasadas las 6 primeras semanas) y añadida la población (varones de 18 a 50 años). No se encontró un ensayo posterior que lo sustituya.

Citada como:

1. Hölmich 1999, Lancet 353:439–443 (ensayo aleatorizado, n = 68 varones de 18 a 50 años, frente a fisioterapia pasiva)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca16 · Dolor Inguinal Relacionado con el Aductor | Pauta de tratamiento | 5 · cita de la pauta | 1 |

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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Jenkins y Vadakekut 2025 — Jenkins y Vadakekut, «Pelvic Inflammatory Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de junio de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_g2` · Ginecológico | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_u4` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Johns 2023

Autores: Johns, Mabrouk y Tavarez  
Título: *Slipped Capital Femoral Epiphysis*  
Publicación: StatPearls [Internet], NBK538302 (act. 2023-07-25)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Johns 2023 — Johns, Mabrouk y Tavarez, «Slipped Capital Femoral Epiphysis», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_os3` · Óseo / Desarrollo | 2 · razonamiento del cribado | 1 |

### Jones 2025

Autores: Jones, Santos y Patel  
Título: *Acute Cholecystitis*  
Publicación: StatPearls [Internet], NBK459171 (act. 2025-07-06)  
DOI: —  
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Kalakonda 2022 — Kalakonda, Jenkins y John, «Physiology, Bilirubin», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de septiembre de 2022.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_gi2` · GI / Hepático | 2 · razonamiento del cribado | 1 |

### Karanasios 2022

Publicación: J Hand Ther 35:541–551  
DOI: 10.1016/j.jht.2021.02.002  
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
DOI: 10.1016/j.amjmed.2008.05.041  
Última revisión: **sin revisar**

Citada como:

1. Kastelein 2008 (Am J Med; n = 134, 35 con lesión del LCM; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro8 · Lesión del Ligamento Colateral Medial (LCM) | Test «Valgo forzado a 30° de flexión + mecanismo de la entrevista» | 4b · cita bajo el test | 1 |

### Katz 1995

Publicación: —  
DOI: 10.1002/art.1780380910  
Última revisión: **sin revisar**  
Nota: Citado a través de Dobbs 2016.

Citada como:

1. Katz 1995, datos citados en Dobbs 2016 (Manual Therapy; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Test de extensión lumbar de 30 s» | 4b · cita bajo el test | 1 |

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

### Kelley 2013

Autores: Kelley, Shaffer, Kuhn, Michener, Seitz, Uhl, Godges y McClure  
Título: *Shoulder Pain and Mobility Deficits: Adhesive Capsulitis. Clinical Practice Guidelines*  
Publicación: J Orthop Sports Phys Ther 43(5):A1–A31  
DOI: 10.2519/jospt.2013.0302  
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
Nota: Texto completo en PMC7677471. Dosis de ca2 y ca3 (cadera). No confundir con el consenso de Zúrich del mismo grupo y año (entrada «Consenso de Zúrich IHiPRN»).

Citada como:

1. Enseki 2023, J Orthop Sports Phys Ther 53(7):CPG1–CPG70 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía; serie de Murtha citada en ella) · consenso de Zúrich del IHiPRN (Kemp, Risberg, Mosler et al., Br J Sports Med 54:504–511) · Kemp 2020, Br J Sports Med 54:1382–1394 (revisión sistemática)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca3 · Desgarro del Labrum Acetabular | Pauta de tratamiento | 5 · cita de la pauta | 1 |

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

### Kim 2001

Publicación: Arthroscopy 17:160–164  
DOI: 10.1053/jars.2001.20665  
Última revisión: **sin revisar**

Citada como:

1. Kim 2001 (Arthroscopy 17:160–164) · Hegedus 2012 (Br J Sports Med 46:964–978, tabla 2)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h5 · Lesión Labral Superior (SLAP) | Test «Biceps Load Test II» | 4b · cita bajo el test | 1 |

### Kim 2004

Publicación: —  
DOI: 10.1016/j.arthro.2004.08.003  
Última revisión: **sin revisar**  
Nota: Solo para la técnica del test.

Citada como:

1. Kim 2007 (Arthroscopy; 172 rodillas, referencia: artroscopia); técnica: Kim 2004

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro17 · Plica Sinovial Medial | Test «Test de provocación de la plica rotuliana medial» | 4b · cita bajo el test | 1 |

### Kim 2007

Publicación: Arthroscopy  
DOI: 10.1016/j.arthro.2007.06.016  
Última revisión: **sin revisar**

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

### Krill 2018

Autores: Krill, Rosas, Kwon, Dakkak, Nwachukwu y McCormick  
Título: *A concise evidence-based physical examination for diagnosis of acromioclavicular joint pathology: a systematic review*  
Publicación: Phys Sportsmed 46(1):98–104  
DOI: 10.1080/00913847.2018.1413920  
Última revisión: **sin revisar**  
Nota: Solo leído el resumen de los autores (Europe PMC, 2026-10): el texto completo de PMC6396285 no se pudo descargar. Lo cita Lluch 2020 (cap. 3.1, p. 61, ref. 8) como «S y E >90 %» para Paxinos + O’Brien; el resumen da E 95,8 % y LR+ 2,71 en serie. Contexto del O’Brien para la AC (h7); no puntúa.

Citada como:

1. Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6). Combinado con el Paxinos y hechos en serie (los dos positivos), la revisión de Krill 2018 da E 95,8 % y LR+ 2,71, la mejor de las combinaciones, y concluye que ninguna cambia más que poco la probabilidad; Lluch 2020 (cap. 3.1, p. 61) lo resume como «S y E >90 %», cifra que el resumen de la revisión no respalda.
2. Chronopoulos 2004 (Am J Sports Med) · Walton 2004 (J Bone Joint Surg Am) · Krill 2018 (Phys Sportsmed 46:98–104, revisión sistemática; resumen)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» (en `criterio`) | 4b · mención en el texto | 1 |
| Hombro | h7 · Artropatía Acromioclavicular | Test «Compresión activa (O’Brien) para la AC» | 4b · cita bajo el test | 2 |

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

### Laslett 2006

Publicación: —  
DOI: 10.1016/j.spinee.2006.01.004  
Última revisión: **sin revisar**

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
Última revisión: **sin revisar**  
Nota: Texto completo en PMC2582421. Fuente primaria de la cifra del cluster de provocación sacroilíaca (≥3/5: S 91 %, E 78 %; E 87 % sin centralización) que Lluch 2020 cita como «85–94 %, 79 %». Hipótesis ca10 (cadera).

Citada como:

1. Laslett 2008 (J Man Manip Ther 16:142–152); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Cluster de Laslett: 3 o más de 5 tests de provocación positivos» | 4b · cita bajo el test | 1 |

### Lassiter 2024

Autores: Lassiter, Bhutta y Allam  
Título: *Inflammatory Back Pain and Spondyloarthropathies*  
Publicación: StatPearls [Internet], NBK539753 (act. 2024-02-26)  
DOI: —  
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Leslie 2025 — Leslie, Hamawy y Saleem, «Gross and Microscopic Hematuria», StatPearls [Internet], NCBI Bookshelf, última actualización 30 de noviembre de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_r1` · Renal / Urológico | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `c3` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Litaker 2000

Publicación: J Am Geriatr Soc  
DOI: 10.1111/j.1532-5415.2000.tb03875.x  
Última revisión: **sin revisar**

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

### Lluch 2020

Autores: Lluch, López-Cubas, Jones, Jull, Hall y Lewis  
Título: *Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders*  
Publicación: ZERAPI  
DOI: —  
Última revisión: **sin revisar**  
Nota: Base de las guías clínicas de cada región, de las que son extracto las tarjetas de consulta (repo guia-de-consulta). Los capítulos que citan los pies de las tarjetas (Struyf y Powell y Lewis, cap. 3, en hombro; Fondevila Suárez, cap. 5, en lumbar) son de este libro. Capítulos leídos enteros (PDF escaneado del usuario) y citados directamente como fuente, con capítulo y páginas: cap. 5.1 (Fondevila Suárez, lumbar, pp. 295–326: pronósticos de lu3–lu8, tests de lu5–lu9 y l_e7) caps. 5.3 y 5.3.1 (cervical) y cap. 4.1, subcaps. 4.1.1–4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg, cadera, pp. 123–179: pronósticos y tests de cadera y razonamiento del cribado de cadera).

Citada como:

1. Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 73
2. Positivo si la RE pasiva con el brazo al lado pierde más del 50 % respecto al lado sano o queda por debajo de 30°: es el criterio que se ha usado en los estudios para definir la capsulitis, junto a una pérdida de movilidad mayor del 25 % en al menos 2 planos (Kelley 2013, p. A9). La pérdida de movilidad pasiva en varios planos, sobre todo de RE con el brazo al lado y en distintos grados de abducción, es un hallazgo significativo para orientar el tratamiento (Kelley 2013, E). El consenso de 2025 asocia al hombro congelado una RE pasiva más limitada que las demás direcciones (100 %) y cada vez más limitada al aumentar la abducción (100 %). Lluch 2020: la RE está reducida de forma constante en neutro y a 90° de abducción, aunque la RI suele ser la más afectada cerca de 90°. Sin S ni E; no puntúa.
3. Kelley 2013 (J Orthop Sports Phys Ther 43(5):A1–A31, pp. A9 y A26) · Salamh 2025 (J Man Manip Ther 33(4):309–320, tabla 2) · Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 72
4. Lluch 2020, cap. 3.1.1 (Powell y Lewis), pp. 72–73
5. Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 71
6. Lluch 2020, cap. 3.1.1 (Powell y Lewis), pp. 69–73
7. Elevación pasiva en el plano escapular con rotación interna. Combinar test para el SAPS apenas mejora la precisión (Lluch 2020, cap. 3.1, p. 54). Metaanálisis de 7 estudios (n = 946): LR+ 1,79 (IC 1,24–2,58), LR− 0,47 (IC 0,39–0,56). Sirve para descartar; un positivo es solo un hallazgo.
8. Lluch 2020, cap. 3.1 (Struyf), p. 54
9. Lluch 2020, cap. 3.1 (Struyf), pp. 53–54
10. Imposibilidad de mantener la rotación externa pasivamente colocada. Para rotura completa: LR+ 7,2 (IC 95 % 1,7–31), LR− 0,57 (0,35–0,92), un solo estudio; un negativo no descarta. Si el nervio supraescapular está paralizado, los test del supraespinoso y del infraespinoso salen positivos con el manguito intacto; distinguirlo exige más que la clínica y la atrofia (Lluch 2020, cap. 3.1, pp. 66–67).
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
22. Brazo a 90° de flexión, aducción horizontal pasiva cruzando el cuerpo. Positivo si duele en la parte superior del hombro, cerca de la AC. S 77 % (27 de 35), E 79 % (410 de 518); Lluch 2020 (cap. 3.1, p. 61) dice «S >67 %». Estudio de casos y controles: los casos se definieron por dolor localizado, dolor a la palpación de la AC y alivio con infiltración, y los controles eran otras cirugías de hombro.
23. Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6). Combinado con el Paxinos y hechos en serie (los dos positivos), la revisión de Krill 2018 da E 95,8 % y LR+ 2,71, la mejor de las combinaciones, y concluye que ninguna cambia más que poco la probabilidad; Lluch 2020 (cap. 3.1, p. 61) lo resume como «S y E >90 %», cifra que el resumen de la revisión no respalda.
24. Lluch 2020, cap. 3.1 (Struyf), p. 61 · Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75
25. Asimetría visual en la elevación del brazo: ángulo inferior, borde medial o espina escapular prominentes. Las medidas de la movilidad escapular son poco fiables y de validez limitada, y no deben usarse para medir objetivamente la movilidad escapular dinámica (Desmeules 2025, recomendación 6, A). La discinesia se asocia al SAPS, pero no se ha demostrado que cause el dolor (Lluch 2020). Sin S ni E; no puntúa.
26. Desmeules 2025 (J Orthop Sports Phys Ther 55(4):235–274, recomendación 6) · Lluch 2020, cap. 3.1 (Struyf), pp. 53–54
27. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 164 y 170
28. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 138; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164
29. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137
30. Lluch 2020, cap. 4.1.1 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 125; cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 136; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 175–176
31. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 157
32. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 176–177
33. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 134, 137 y 142; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 179
34. Laslett 2008 (J Man Manip Ther 16:142–152); Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153
35. Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 153–154
36. Lluch 2020, cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 153
37. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 168
38. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 168, 170 y 173
39. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 160
40. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 163; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 175
41. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 162–163
42. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 137; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 175 y 177
43. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 141; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 172
44. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 141
45. Lluch 2020, cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 172
46. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 138
47. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 139–140; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 164
48. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 138–139; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 173; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 177
49. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 138–139; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 145; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 173; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 177
50. Lluch 2020, cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 138–139; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 145; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 164 y 173
51. Ejercicio neuromuscular (coordinación, propiocepción, entrenamiento postural, coordinación ojo-cabeza-cuello) dentro del abordaje multimodal de la fase crónica (B). El fortalecimiento isométrico de los flexores profundos redujo dolor y discapacidad a corto plazo, pero el entrenamiento con biofeedback de presión no fue mejor que el fortalecimiento de los flexores con pesas. Para dosificar el entrenamiento craneocervical (Lluch 2020): test de flexión craneocervical en supino con biofeedback de presión inflado a 20 mmHg y cinco escalones de 2 mmHg (22–30), sin activar en exceso el esternocleidomastoideo ni los escalenos y sin retraer la cabeza; la resistencia se mide con apoyos repetidos de 5–10 s en cada nivel y el entrenamiento empieza en el nivel inferior al del fallo. Ni la guía ni el libro fijan series ni semanas.
52. Blanpied 2017, J Orthop Sports Phys Ther 47(7):A1–A83 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · Lluch 2020, cap. 5.3 (Jull y Falla), p. 378 (test de flexión craneocervical para dosificar)
53. Según la fase (dolor de cuello con cefalea). Aguda: instrucción supervisada en ejercicios de movilidad activa (B); autoSNAG C1–2 (C). Subaguda: manipulación y movilización cervical (B); autoSNAG C1–2 (C). Crónica: manipulación o movilización cervical o cervicotorácica combinada con estiramiento, fortalecimiento y resistencia de cuello y cintura escapular (B); el fortalecimiento cervicoescapular con entrenamiento de flexión craneocervical con biofeedback mejoró dolor y función a largo plazo, y los autores de la guía señalan, como opinión, que el entrenamiento craneocervical puede ser especialmente útil. Con algún signo de disfunción temporomandibular, la terapia manual y el ejercicio dirigidos a la ATM mejoraron más que los centrados solo en la región craneocervical. Aplicar antes el cribado vascular del marco IFOMPT. Para dosificar el entrenamiento craneocervical (Lluch 2020): test de flexión craneocervical en supino con biofeedback de presión inflado a 20 mmHg y cinco escalones de 2 mmHg (22–30), sin activar en exceso el esternocleidomastoideo ni los escalenos y sin retraer la cabeza; la resistencia se mide con apoyos repetidos de 5–10 s en cada nivel y el entrenamiento empieza en el nivel inferior al del fallo. La guía no fija series ni semanas (la manipulación 3–4 veces por semana, 12–18 sesiones, superó a una vez por semana a corto plazo, pero no a medio).
54. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 308–309
55. Lluch 2020, cap. 5.1 (Fondevila Suárez), p. 313
56. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 313–314 · NICE NG59 (rec. 1.3.6)
57. Lluch 2020, cap. 5.1 (Fondevila Suárez), p. 310
58. Lluch 2020, cap. 5.1 (Fondevila Suárez), p. 311
59. Lluch 2020, cap. 5.1 (Fondevila Suárez), p. 317 y tabla 4 (consenso Delphi), p. 316
60. Lluch 2020, cap. 5.1 (Fondevila Suárez), tablas 4 y 6, pp. 316 y 323 (orientativo)
61. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 317–318
62. Lluch 2020, cap. 5.1 (Fondevila Suárez), tabla 5 (consenso Delphi), p. 319
63. Lluch 2020, cap. 5.1 (Fondevila Suárez), tablas 5 y 6, pp. 319 y 323
64. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 319–320 · NICE NG59 (rec. 1.3.1–1.3.3, derivación)
65. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 321–322 (criterio a del clúster de Laslett)
66. Lluch 2020, cap. 5.1 (Fondevila Suárez), p. 322
67. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 323–324
68. Tumor (Lluch 2020, cap. 3.1 (Struyf), pp. 54 y 61; Lluch 2020, cap. 3.1.1 (Powell y Lewis), pp. 75–76): antecedente de cáncer, pérdida de peso inexplicada, dolor sin relación con el movimiento o implacable, dolor nocturno o en reposo con síntomas sistémicos, masa o deformidad inexplicada. Raros en clavícula distal y acromion; pensar en ellos si hay dolor nocturno + síntomas sistémicos.
69. Fractura o luxación no reducida (Lluch 2020, cap. 3.1 (Struyf), p. 54; Lluch 2020, cap. 3.1.1 (Powell y Lewis), tabla 2, p. 75): traumatismo previo (caída sobre el hombro o el codo), pérdida aguda de movilidad, deformidad, osteoporosis. Ayuda en consulta: test de aprensión ósea; signo de percusión olécranon-manubrio (buen valor para luxación anterior y fracturas de clavícula y húmero).
70. Infección o sistémico (Lluch 2020, cap. 3.1 (Struyf), p. 54; Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 76): fiebre, sensación de estar enfermo, cambios en la piel (aspecto, erupciones, sudoración), hematomas inexplicados, dolor en otras partes del cuerpo. Preguntar siempre por el estado general reciente.
71. Lesión neurológica (Lluch 2020, cap. 3.1 (Struyf), p. 54; Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 76): déficit motor o sensitivo significativo, atrofia. Exploración neurológica breve: sensibilidad, fuerza y reflejos.
72. Infección (Lluch 2020, cap. 5.1, tabla 1): fiebre, infección bacteriana reciente, cirugía lumbar reciente, dolor nocturno, dolor que empeora con el tiempo, sin respuesta al tratamiento conservador, inmunosupresión o VIH
73. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1.1 (Powell y Lewis), pp. 73 y 75–76.
74. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), pp. 61 y 66; cap. 3.1.1 (Powell y Lewis), pp. 70–71.
75. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), p. 54; cap. 3.1.1 (Powell y Lewis), pp. 75–76.
76. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), p. 54.
77. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), p. 54; cap. 3.1.1 (Powell y Lewis), p. 76.
78. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 3.1 (Struyf), pp. 54 y 66–67; cap. 3.1.1 (Powell y Lewis), pp. 73 y 76.
79. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 146 y 148.
80. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 135 y 137; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 146.
81. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 147–148.
82. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 147.
83. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 139; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 147 y 152.
84. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 149.
85. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 148–149.
86. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), pp. 147 y 152; cap. 4.1.5 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 178.
87. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 131; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 152; cap. 4.1.4 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 158.
88. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.2 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 141; cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 147.
89. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 4.1.3 (Llopis San Juan, Molina Martínez, Oviaño y Thorborg), p. 146.
90. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), tabla 1, p. 383.
91. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), tabla 1, p. 383; cap. 5.3.1 (Hall, Luedtke, von Piekartz y Fernández de las Peñas), p. 410.
92. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), pp. 370–371 y tabla 1, p. 383.
93. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), p. 369 y tabla 1, p. 384.
94. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3.1 (Hall, Luedtke, von Piekartz y Fernández de las Peñas), «Serious pathology presenting with headache», p. 410.
95. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), tabla 1, p. 384; cap. 5.3.1 (Hall, Luedtke, von Piekartz y Fernández de las Peñas), pp. 410–411.
96. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.3 (Jull y Falla), tabla 1, p. 384.
97. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.1 (Fondevila Suárez), tabla 1, p. 303.
98. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.1 (Fondevila Suárez), p. 301 y tabla 1, p. 303.
99. Lluch 2020 — Lluch, López-Cubas, Jones, Jull, Hall y Lewis (eds.), Pattern Recognition of Clinical Syndromes Related to Neuromusculoskeletal Pain Disorders (ZERAPI, 2020), cap. 5.1 (Fondevila Suárez), tabla 1, p. 304.

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
| Hombro | h11 · Luxación Bloqueada o Fractura (→ Rx) | Test «Luxación bloqueada» | 4b · cita bajo el test | 21 |
| Hombro | h11 · Luxación Bloqueada o Fractura (→ Rx) | Test «Fractura» | 4b · cita bajo el test | 21 |
| Hombro | h11 · Luxación Bloqueada o Fractura (→ Rx) | Test «Test de aprensión ósea y percusión olécranon-manubrio» | 4b · cita bajo el test | 8 |
| Hombro | — | `sistemas.0.banderasRojas.5` | 2 · mención en el texto | 68 |
| Hombro | — | `sistemas.6.banderasRojas.0` | 2 · mención en el texto | 69 |
| Hombro | — | `sistemas.7.banderasRojas.0` | 2 · mención en el texto | 70 |
| Hombro | — | `sistemas.8.banderasRojas.0` | 2 · mención en el texto | 71 |
| Hombro | — | Pregunta `h3` · Cáncer / Oncológico | 2 · razonamiento del cribado | 73 |
| Hombro | — | Pregunta `h4` · Cáncer / Oncológico | 2 · razonamiento del cribado | 74 |
| Hombro | — | Pregunta `h6` · Cáncer / Oncológico | 2 · razonamiento del cribado | 75 |
| Hombro | — | Pregunta `h_r2` · Renal / Urológico | 2 · razonamiento del cribado | 76 |
| Hombro | — | Pregunta `h_t1` · Traumático (Fractura o Luxación) | 2 · razonamiento del cribado | 75 |
| Hombro | — | Pregunta `h_i1` · Infección / Sistémico | 2 · razonamiento del cribado | 77 |
| Hombro | — | Pregunta `h_n1` · Neurológico | 2 · razonamiento del cribado | 78 |
| Cadera | ca1 · Artrosis de Cadera | Test «Apoyo monopodal (30 s)» | 4b · cita bajo el test | 27 |
| Cadera | ca1 · Artrosis de Cadera | Pronóstico | 5 · cita del pronóstico | 28 |
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test «Dolor inguinal» | 4b · cita bajo el test | 29 |
| Cadera | ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Pronóstico | 5 · cita del pronóstico | 30 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Test «Longitud de paso» | 4b · cita bajo el test | 31 |
| Cadera | ca3 · Desgarro del Labrum Acetabular | Pronóstico | 5 · cita del pronóstico | 32 |
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Pronóstico | 5 · cita del pronóstico | 33 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Cluster de Laslett: 3 o más de 5 tests de provocación positivos» | 4b · cita bajo el test | 34 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Thigh thrust» | 4b · cita bajo el test | 35 |
| Cadera | ca10 · Dolor Articular Sacroilíaco | Test «Prueba del dedo (Fortin)» | 4b · cita bajo el test | 36 |
| Cadera | ca11 · Lesión Aguda de Ingle | Test «Palpación del grupo sospechoso (primero)» | 4b · cita bajo el test | 37 |
| Cadera | ca11 · Lesión Aguda de Ingle | Pronóstico | 5 · cita del pronóstico | 38 |
| Cadera | ca12 · Ligamento Redondo e Inestabilidad | Test «Log roll» | 4b · cita bajo el test | 39 |
| Cadera | ca12 · Ligamento Redondo e Inestabilidad | Pronóstico | 5 · cita del pronóstico | 40 |
| Cadera | ca13 · Condropatía de Cadera | Test «Cribado intraarticular y Thomas positivos» | 4b · cita bajo el test | 41 |
| Cadera | ca13 · Condropatía de Cadera | Pronóstico | 5 · cita del pronóstico | 42 |
| Cadera | ca14 · Neuropatías de Cadera e Ingle | Test «Tinel del femorocutáneo (meralgia)» | 4b · cita bajo el test | 43 |
| Cadera | ca14 · Neuropatías de Cadera e Ingle | Test «Pudendo: dolor perineal al sentarse o en bici» | 4b · cita bajo el test | 44 |
| Cadera | ca14 · Neuropatías de Cadera e Ingle | Pronóstico | 5 · cita del pronóstico | 45 |
| Cadera | ca15 · Sensibilización Central | Test «Dolor multifocal, referido y extenso» | 4b · cita bajo el test | 46 |
| Cadera | ca16 · Dolor Inguinal Relacionado con el Aductor | Test «Palpación dolorosa de aductores + squeeze doloroso» | 4b · cita bajo el test | 47 |
| Cadera | ca16 · Dolor Inguinal Relacionado con el Aductor | Pronóstico | 5 · cita del pronóstico | 48 |
| Cadera | ca17 · Dolor Inguinal Relacionado con el Psoas Ilíaco | Test «Palpación dolorosa supra o infrainguinal» | 4b · cita bajo el test | 47 |
| Cadera | ca17 · Dolor Inguinal Relacionado con el Psoas Ilíaco | Pronóstico | 5 · cita del pronóstico | 49 |
| Cadera | ca18 · Dolor Inguinal Relacionado con el Canal Inguinal | Test «Dolor en la región del canal + palpación dolorosa del canal, sin hernia palpable» | 4b · cita bajo el test | 47 |
| Cadera | ca18 · Dolor Inguinal Relacionado con el Canal Inguinal | Pronóstico | 5 · cita del pronóstico | 50 |
| Cadera | ca19 · Dolor Inguinal Relacionado con el Pubis | Test «Palpación dolorosa de la sínfisis y el hueso adyacente» | 4b · cita bajo el test | 47 |
| Cadera | ca19 · Dolor Inguinal Relacionado con el Pubis | Pronóstico | 5 · cita del pronóstico | 48 |
| Cadera | — | Pregunta `c5` · Cáncer / Oncológico | 2 · razonamiento del cribado | 79 |
| Cadera | — | Pregunta `ca_on2` · Cáncer / Oncológico | 2 · razonamiento del cribado | 80 |
| Cadera | — | Pregunta `ca_on3` · Cáncer / Oncológico | 2 · razonamiento del cribado | 79 |
| Cadera | — | Pregunta `ca_on4` · Cáncer / Oncológico | 2 · razonamiento del cribado | 81 |
| Cadera | — | Pregunta `ca_u3` · Urogenital / Renal | 2 · razonamiento del cribado | 82 |
| Cadera | — | Pregunta `c4` · Gastrointestinal | 2 · razonamiento del cribado | 82 |
| Cadera | — | Pregunta `ca_gi2` · Gastrointestinal | 2 · razonamiento del cribado | 82 |
| Cadera | — | Pregunta `ca_gi3` · Gastrointestinal | 2 · razonamiento del cribado | 83 |
| Cadera | — | Pregunta `ca_os1` · Óseo / Desarrollo | 2 · razonamiento del cribado | 84 |
| Cadera | — | Pregunta `ca_os2` · Óseo / Desarrollo | 2 · razonamiento del cribado | 85 |
| Cadera | — | Pregunta `ca_os3` · Óseo / Desarrollo | 2 · razonamiento del cribado | 86 |
| Cadera | — | Pregunta `ca_os4` · Óseo / Desarrollo | 2 · razonamiento del cribado | 87 |
| Cadera | — | Pregunta `ca_in1` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 82 |
| Cadera | — | Pregunta `ca_in2` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 88 |
| Cadera | — | Pregunta `ca_in3` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 89 |
| Cervical | ce2 · Disfunción Neuromuscular Cervical | Dosis (en el texto) | 5 · mención en el texto | 51 |
| Cervical | ce2 · Disfunción Neuromuscular Cervical | Pauta de tratamiento | 5 · cita de la pauta | 52 |
| Cervical | ce4 · Cefalea Cervicogénica | Dosis (en el texto) | 5 · mención en el texto | 53 |
| Cervical | ce4 · Cefalea Cervicogénica | Pauta de tratamiento | 5 · cita de la pauta | 52 |
| Cervical | — | Pregunta `cv2` · Cardiovascular | 2 · razonamiento del cribado | 90 |
| Cervical | — | Pregunta `cv_ar1` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 91 |
| Cervical | — | Pregunta `cv_ar2` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 92 |
| Cervical | — | Pregunta `cv_ar3` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 93 |
| Cervical | — | Pregunta `cv_ar4` · Arterial / Traumatismo / Cefalea de alarma | 2 · razonamiento del cribado | 94 |
| Cervical | — | Pregunta `cv_n1` · Médula / Estructural | 2 · razonamiento del cribado | 95 |
| Cervical | — | Pregunta `cv_n3` · Médula / Estructural | 2 · razonamiento del cribado | 96 |
| Lumbar | lu3 · Dolor Radicular Lumbar | Pronóstico | 5 · cita del pronóstico | 54 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Test «Déficits sensoriales (L3-S1)» | 4b · cita bajo el test | 55 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Pronóstico | 5 · cita del pronóstico | 56 |
| Lumbar | lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Test «Fuerza por miotomas L1–S2» | 4b · cita bajo el test | 57 |
| Lumbar | lu5 · Radiculopatía Lumbar (Déficit Neurológico) | Pronóstico | 5 · cita del pronóstico | 58 |
| Lumbar | lu6 · Dolor Lumbar Discogénico | Test «Preferencia direccional» | 4b · cita bajo el test | 59 |
| Lumbar | lu6 · Dolor Lumbar Discogénico | Test «Observación: espalda plana o shift lateral» | 4b · cita bajo el test | 60 |
| Lumbar | lu6 · Dolor Lumbar Discogénico | Pronóstico | 5 · cita del pronóstico | 61 |
| Lumbar | lu7 · Dolor Lumbar Facetario | Test «PA unilateral dolorosa o con menos movilidad» | 4b · cita bajo el test | 62 |
| Lumbar | lu7 · Dolor Lumbar Facetario | Test «Sin signos radiculares y sin alivio con repetidos» | 4b · cita bajo el test | 63 |
| Lumbar | lu7 · Dolor Lumbar Facetario | Pronóstico | 5 · cita del pronóstico | 64 |
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Test «No centraliza con movimientos repetidos» | 4b · cita bajo el test | 65 |
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Pronóstico | 5 · cita del pronóstico | 66 |
| Lumbar | lu9 · Síndrome de Dolor Miofascial Lumbar | Test «Punto hipersensible dentro de la banda» | 4b · cita bajo el test | 67 |
| Lumbar | lu9 · Síndrome de Dolor Miofascial Lumbar | Test «El paciente reconoce el dolor provocado» | 4b · cita bajo el test | 67 |
| Lumbar | — | `sistemas.5.banderasRojas.0` | 2 · mención en el texto | 72 |
| Lumbar | — | Pregunta `l_u4` · Urogenital / Renal | 2 · razonamiento del cribado | 97 |
| Lumbar | — | Pregunta `l_e7` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 98 |
| Lumbar | — | Pregunta `l_inf1` · Infección vertebral | 2 · razonamiento del cribado | 99 |

### Lotfollahzadeh 2024

Autores: Lotfollahzadeh, Lopez y Deppen  
Título: *Appendicitis*  
Publicación: StatPearls [Internet], NBK493193 (act. 2024-02-12)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Lotfollahzadeh 2024 — Lotfollahzadeh, Lopez y Deppen, «Appendicitis», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de febrero de 2024.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `c4` · Gastrointestinal | 2 · razonamiento del cribado | 1 |

### Lucas 2009

Publicación: —  
DOI: 10.1097/ajp.0b013e31817e13b6  
Última revisión: **sin revisar**

Citada como:

1. Lucas 2009 (revisión sistemática de fiabilidad)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu9 · Síndrome de Dolor Miofascial Lumbar | Test «Banda tensa palpable» | 4b · cita bajo el test | 1 |

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
2. Tarjeta de consulta tobillo y pie (ap. 5); Mahadevan 2015 (J Foot Ankle Surg 54:549–53); Pitcher 2024 (Foot Ankle Orthop 9(4))

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» | 4b · cita bajo el test | 2 |

### Majlesi 2008

Publicación: —  
DOI: 10.1097/rhu.0b013e31816b2f99  
Última revisión: **sin revisar**

Citada como:

1. Majlesi 2008 (estudio único; referencia: RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu3 · Dolor Radicular Lumbar | Test «Test de Slump» | 4b · cita bajo el test | 1 |

### Malik 2023

Autores: Malik, Gnanapandithan y Singh  
Título: *Peptic Ulcer Disease*  
Publicación: StatPearls [Internet], NBK534792 (act. 2023-06-05)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Malik 2023 — Malik, Gnanapandithan y Singh, «Peptic Ulcer Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de junio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv_gi2` · Gastrointestinal | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_gi2` · Gastrointestinal | 2 · razonamiento del cribado | 1 |

### Margetis y Donnally 2025

Autores: Margetis y Donnally  
Título: *Cervical Myelopathy*  
Publicación: StatPearls [Internet], NBK482312 (act. 2025-08-02)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Margetis y Donnally 2025 — Margetis y Donnally, «Cervical Myelopathy», StatPearls [Internet], NCBI Bookshelf, última actualización 2 de agosto de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cervical | — | Pregunta `cv3` · Renal / Urológico | 2 · razonamiento del cribado | 1 |

### Margetis y Gillis 2025

Autores: Margetis y Gillis  
Título: *Spondylolisthesis*  
Publicación: StatPearls [Internet], NBK430767 (act. 2025-03-28)  
DOI: —  
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. May y Marappa-Ganeshan 2023 — May y Marappa-Ganeshan, «Stress Fractures», StatPearls [Internet], NCBI Bookshelf, última actualización 10 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_os1` · Óseo / Desarrollo | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_e6` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_e7` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |

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
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
Nota: Ensayo LEAP, texto completo en PMC5930290. Dosis de ca4 (cadera).

Citada como:

1. Mellor 2018, BMJ 361:k1662 (ensayo aleatorizado LEAP, n = 204, frente a infiltración de corticoide y a esperar) · Mellor 2016, BMC Musculoskelet Disord 17:196 (protocolo del ensayo, tabla 3: ejercicios y progresión)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca4 · Síndrome de Dolor Trocantérico Mayor (Tendinopatía Glútea) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Momodu y Savaliya 2023 — Momodu y Savaliya, «Septic Arthritis», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de julio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_i1` · Infección / Sistémico | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_in1` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_in3` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |

### Munakomi 2023

Autores: Munakomi, Foris y Varacallo  
Título: *Spinal Stenosis and Neurogenic Claudication*  
Publicación: StatPearls [Internet], NBK430872 (act. 2023-08-13)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Ejercicio general (A en mayores con lumbalgia crónica), con progresión de volumen e intensidad: en los ensayos con estenosis, un programa multimodal de ejercicio general y aeróbico mejoró dolor y discapacidad a los 6 meses, y el ejercicio general individualizado con terapia manual superó al ejercicio en grupo y a la atención médica habitual a los 2 meses. Estiramiento, fortalecimiento y ejercicio aeróbico; evitar caminar cuesta abajo y la extensión lumbar excesiva (Munakomi 2023). Ninguna fuente fija repeticiones ni tiempos: el volumen queda a criterio del clínico.
2. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · Munakomi 2023, StatPearls, «Spinal Stenosis and Neurogenic Claudication» (tratamiento conservador)
3. Munakomi 2023 — Munakomi, Foris y Varacallo, «Spinal Stenosis and Neurogenic Claudication», StatPearls [Internet], NCBI Bookshelf, última actualización 13 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Dosis (en el texto) | 5 · mención en el texto | 1 |
| Lumbar | lu4 · Estenosis Espinal / Claudicación Neurogénica | Pauta de tratamiento | 5 · cita de la pauta | 2 |
| Lumbar | — | Pregunta `l_v1` · Vascular | 2 · razonamiento del cribado | 3 |

### Nandhagopal 2024

Autores: Nandhagopal, Tiwari, Tiwari y De Cicco  
Título: *Developmental Dysplasia of the Hip*  
Publicación: StatPearls [Internet], NBK563157 (act. 2024-05-04)  
DOI: —  
Última revisión: **sin revisar**  
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
2. Tarjeta de consulta tobillo y pie (ap. 5); Sman 2015 (Br J Sports Med, publicado en línea en 2013); Netterström-Wedin 2021 (Phys Ther Sport 49:214–26)
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
Última revisión: **sin revisar**  
Nota: Leídas las recomendaciones 1.3.1–1.3.4 y 1.6.1 y el contexto en nice.org.uk (2026-10). Razonamiento del cribado de cadera (c2, ca_v3).

Citada como:

1. NICE CG147 — NICE, «Peripheral arterial disease: diagnosis and management» (2012, actualizada el 11 de diciembre de 2020), recomendaciones 1.3.1–1.3.2 y contexto.
2. NICE CG147 — NICE, «Peripheral arterial disease: diagnosis and management» (2012, actualizada el 11 de diciembre de 2020), recomendaciones 1.3.2–1.3.4 y 1.6.1, y contexto.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `c2` · Vascular | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_v3` · Vascular | 2 · razonamiento del cribado | 2 |

### NICE NG126

Publicación: Guía NICE «Ectopic pregnancy and miscarriage: diagnosis and initial management» (2019, actualizada el 17 de junio de 2026)  
DOI: —  
Última revisión: **sin revisar**  
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
Nota: Leídas las recomendaciones 1.1.1–1.1.4 y la tabla 1 (escala de Wells de dos niveles) en nice.org.uk (2026-10). Razonamiento del cribado de cadera (ca_v2).

Citada como:

1. NICE NG158 — NICE, «Venous thromboembolic diseases: diagnosis, management and thrombophilia testing» (2020, actualizada el 2 de agosto de 2023), recomendaciones 1.1.1–1.1.4 y tabla 1 (escala de Wells de dos niveles).

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_v2` · Vascular | 2 · razonamiento del cribado | 1 |

### NICE NG226

Publicación: Guía NICE (2022)  
DOI: —  
Última revisión: 2026-10 · Sin cambios: solo respalda el diagnóstico clínico (edad ≥45, dolor con la actividad, rigidez matutina ausente o ≤30 min), sin S ni E; no puntúa. No se pudo abrir nice.org.uk (bloqueado por la red) para comprobar si hay actualización.

Citada como:

1. NICE NG226 (2022). Metcalfe 2019 (JAMA) para la rigidez matutina
2. Cibulka 2017, J Orthop Sports Phys Ther 47(6):A1–A37 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · NICE NG226 (rec. 1.3.1–1.3.11; prevalece donde chocan, por ser más reciente)
3. NICE NG226 (2022)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca1 · Artrosis de Cadera | Test «Criterio clínico combinado: Edad ≥45 + dolor en actividad + rigidez <1h» | 4b · cita bajo el test | 1 |
| Cadera | ca1 · Artrosis de Cadera | Pauta de tratamiento | 5 · cita de la pauta | 2 |
| Rodilla | ro1 · Artrosis de Rodilla | Test «Criterio combinado: Edad ≥45 + dolor en actividad + rigidez <30 min» | 4b · cita bajo el test | 3 |

### NICE NG59

Publicación: Guía NICE «Low back pain and sciatica in over 16s: assessment and management» (2016, actualizada en julio de 2026)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Leídas las recomendaciones en nice.org.uk (2026-10). Pauta de lu1, lu3 y lu5–lu9; derivación de lu4 y lu7.

Citada como:

1. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · NICE NG59 (rec. 1.2.1 y 1.2.7; actualizada en julio de 2026)
2. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · NICE NG59 (rec. 1.2.6 y 1.2.7; actualizada en julio de 2026)
3. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 313–314 · NICE NG59 (rec. 1.3.6)
4. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C, «should not» D) · NICE NG59 (rec. 1.2.1, 1.2.6 y 1.2.7; actualizada en julio de 2026)
5. George 2021, J Orthop Sports Phys Ther 51(11):CPG1–CPG60 (guía de práctica clínica APTA; letra = grado de la recomendación, deducido del verbo según la tabla de la guía: «should» A, «may» B, «can» C) · NICE NG59 (rec. 1.2.7; actualizada en julio de 2026)
6. Lluch 2020, cap. 5.1 (Fondevila Suárez), pp. 319–320 · NICE NG59 (rec. 1.3.1–1.3.3, derivación)
7. Al-Subahi 2017, J Phys Ther Sci 29(9):1689–1694 (revisión sistemática, 9 estudios de 2004–2014 de calidad baja o media: manipulación, ejercicio y vendaje neuromuscular) · NICE NG59 (rec. 1.2.7; actualizada en julio de 2026)

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

### Nunes 2013

Publicación: Phys Ther Sport 14:54–9  
DOI: 10.1016/j.ptsp.2012.11.003  
Última revisión: **sin revisar**

Citada como:

1. Nunes 2013 (Phys Ther Sport 14:54–9; revisión sistemática con metaanálisis, 5 estudios, 2 de buena calidad)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro3 · Dolor Patelofemoral (Síndrome) | Test «Dolor anterior durante sentadilla» | 4b · cita bajo el test | 1 |

### Oliver y Ashurst 2023

Autores: Oliver y Ashurst  
Título: *Anatomy, Thorax, Phrenic Nerves*  
Publicación: StatPearls [Internet], NBK513325 (act. 2023-07-24)  
DOI: —  
Última revisión: **sin revisar**  
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

### Pak y Kim 2023

Autores: Pak y Kim  
Título: *Anterior Glenohumeral Joint Dislocation*  
Publicación: StatPearls [Internet], NBK557862 (act. 2023-05-01)  
DOI: —  
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**

Citada como:

1. Park 2005 (J Bone Joint Surg Am; n = 552 operados con artroscopia, 215 roturas completas; tabla V)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h3 · Rotura del Manguito Rotador | Test «Cluster A, confirmar: arco doloroso + drop arm + debilidad en RE, los tres positivos» | 4b · cita bajo el test | 1 |
| Hombro | h3 · Rotura del Manguito Rotador | Test «Cluster A, descartar: arco doloroso, drop arm y debilidad en RE, los tres negativos (si se cumple, marcar «Negativo»)» | 4b · cita bajo el test | 1 |

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

1. Park 2019 (Medicine 98:e15497): punto de máximo dolor en la línea radiocapitelar en 20 de 24
2. Park 2019 (Medicine 98:e15497; retrospectivo, n = 24 frente a 56)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Codo | co6 · Pinzamiento Posterolateral por Plica Radiocapitelar | Test «Dolor posterolateral en línea articular radiocapitelar a la palpación» | 4b · cita bajo el test | 1 |
| Codo | co6 · Pinzamiento Posterolateral por Plica Radiocapitelar | Test «Test de plica radiocapitelar posterolateral» | 4b · cita bajo el test | 2 |

### Patel 2025

Autores: Patel, Azmat y Goethals  
Título: *Femoral Hernia*  
Publicación: StatPearls [Internet], NBK535449 (act. 2025-05-03)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Patel 2025 — Patel, Azmat y Goethals, «Femoral Hernia», StatPearls [Internet], NCBI Bookshelf, última actualización 3 de mayo de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_gi3` · Gastrointestinal | 2 · razonamiento del cribado | 1 |

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
Última revisión: **sin revisar**  
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
2. Tarjeta de consulta tobillo y pie (ap. 5); Mahadevan 2015 (J Foot Ankle Surg 54:549–53); Pitcher 2024 (Foot Ankle Orthop 9(4))

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp34 · Neuroma de Morton o Bursitis Intermetatarsiana | Test «Palpación del espacio con compresión de los metatarsianos» | 4b · cita bajo el test | 2 |

### Rathleff 2020

Publicación: Orthop J Sports Med 8(4):2325967120911106  
DOI: 10.1177/2325967120911106  
Última revisión: **sin revisar**

Citada como:

1. Rathleff 2020, Orthop J Sports Med 8(4):2325967120911106 (serie de casos, n = 51, 10–14 años, sin grupo control: nivel de evidencia 4; pauta de su apéndice 1)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro15 · Apofisitis del Adolescente (Osgood-Schlatter, Sinding-Larsen-Johansson) | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Regunath y Oba 2024

Autores: Regunath y Oba  
Título: *Community-Acquired Pneumonia*  
Publicación: StatPearls [Internet], NBK430749 (act. 2024-01-26)  
DOI: —  
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
Nota: Texto completo en PMC12657663. El protocolo detallado de fisioterapia está enviado a publicación aparte. Dosis de ca9 (cadera).

Citada como:

1. Rich 2025, Am J Sports Med 53:3396–3407 (ensayo aleatorizado, n = 100, fisioterapia frente a ondas de choque, los dos con la misma educación)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca9 · Tendinopatía Proximal de Isquiotibiales | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Rider y Marra 2023

Autores: Rider y Marra  
Título: *Cauda Equina and Conus Medullaris Syndromes*  
Publicación: StatPearls [Internet], NBK537200 (act. 2023-08-07)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Rider y Marra 2023 — Rider y Marra, «Cauda Equina and Conus Medullaris Syndromes», StatPearls [Internet], NCBI Bookshelf, última actualización 7 de agosto de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l6` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Rowe 2023 — Rowe, Koller y Sharma, «Physiology, Bone Remodeling», StatPearls [Internet], NCBI Bookshelf, última actualización 17 de marzo de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_e4` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_e5` · Espondiloartropatías / Espondilogénicas / Ginecológico | 2 · razonamiento del cribado | 1 |

### Rupp y Leslie 2023

Autores: Rupp y Leslie  
Título: *Epididymitis*  
Publicación: StatPearls [Internet], NBK430814 (act. 2023-07-17)  
DOI: —  
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Sabry y Li 2026 — Sabry y Li, «Legg-Calve-Perthes Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 25 de marzo de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_os3` · Óseo / Desarrollo | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_os4` · Óseo / Desarrollo | 2 · razonamiento del cribado | 1 |

### Salamh 2025

Autores: Salamh, Stoner, Ruley, Zhu, Bateman, Chester, Da Baets, Gibson, Hollmann, Kelley, Lewis, McClure, McCreesh, Mertens, Michener, Seitz, Struyf, Zuckerman y King  
Título: *An international consensus on the etiology, risk factors, diagnosis and Management for individuals with Frozen Shoulder: a Delphi study*  
Publicación: J Man Manip Ther 33(4):309–320  
DOI: 10.1080/10669817.2025.2470461  
Última revisión: **sin revisar**  
Nota: PDF aportado por el usuario. Consenso Delphi de 14 expertos (12 fisioterapeutas): opinión de expertos, no evidencia de eficacia. Pauta de h1 y test de rotación externa de h1.

Citada como:

1. Kelley 2013 (J Orthop Sports Phys Ther 43(5):A1–A31, pp. A9 y A26) · Salamh 2025 (J Man Manip Ther 33(4):309–320, tabla 2) · Lluch 2020, cap. 3.1.1 (Powell y Lewis), p. 72
2. Kelley 2013, J Orthop Sports Phys Ther 43(5):A1–A31 (guía de práctica clínica APTA; letra = grado de la recomendación, tal como la da la guía) · Salamh 2025, J Man Manip Ther 33(4):309–320 (consenso Delphi de 14 expertos; % = acuerdo del panel; es opinión de expertos, no evidencia de eficacia)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | h1 · Capsulitis Adhesiva | Test «Test de Rotación Externa (brazo neutro al lado, codo 90°)» | 4b · cita bajo el test | 1 |
| Hombro | h1 · Capsulitis Adhesiva | Pauta de tratamiento | 5 · cita de la pauta | 2 |

### Sanvictores 2023

Autores: Sanvictores, Jozsa y Tadi  
Título: *Neuroanatomy, Autonomic Nervous System Visceral Afferent Fibers and Pain*  
Publicación: StatPearls [Internet], NBK560843 (act. 2023-07-30)  
DOI: —  
Última revisión: **sin revisar**  
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

Publicación: J Orthop Sports Phys Ther  
DOI: 10.2519/jospt.2021.10469  
Última revisión: **sin revisar**

Citada como:

1. Han 2023 (eClinicalMedicine, revisión sistemática, 6 estudios; LR+ IC 95 %: 1,50–3,98, LR− 0,21–0,47; referencia: bloqueo anestésico). Misma regla que la tarjeta lumbar: 3 de 5 positivos. Saueressig 2021 (JOSPT, metaanálisis, 5 estudios): LR+ 2,13, LR− 0,33, certeza muy baja (GRADE); descarta mejor de lo que confirma

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | lu8 · Dolor de la Articulación Sacroilíaca | Cluster «Tests de provocación SI (3 de 5)» | 4b · cita del cluster | 1 |

### Schick y Sternard 2023

Autores: Schick y Sternard  
Título: *Testicular Torsion*  
Publicación: StatPearls [Internet], NBK448199 (act. 2023-06-12)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Schick y Sternard 2023 — Schick y Sternard, «Testicular Torsion», StatPearls [Internet], NCBI Bookshelf, última actualización 12 de junio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_u3` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

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
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
Nota: Texto completo en PMC6990618; el apéndice 2 (series y cargas) no se consultó. Dosis de ca11 (cadera).

Citada como:

1. Serner 2020, Orthop J Sports Med 8(1):2325967119897247 (cohorte prospectiva, n = 81 varones de 18 a 40 años, sin grupo control)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca11 · Lesión Aguda de Ingle | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Shahid 2023

Autores: Shahid, Ashraf y Sharma  
Título: *Physiology, Thyroid Hormone*  
Publicación: StatPearls [Internet], NBK500006 (act. 2023-06-05)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Shahid 2023 — Shahid, Ashraf y Sharma, «Physiology, Thyroid Hormone», StatPearls [Internet], NCBI Bookshelf, última actualización 5 de junio de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Todas (sistemas comunes) | — | Pregunta `end_3` · Endocrino / Metabólico | 2 · razonamiento del cribado | 1 |

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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Shaw 2025 — Shaw, Loree y Oropallo, «Abdominal Aortic Aneurysm», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_v2` · Vascular | 2 · razonamiento del cribado | 1 |

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
DOI: 10.1136/ebmed-2014-110160  
Última revisión: **sin revisar**

Citada como:

1. Smith 2015 (Evid Based Med 20:88–97; metaanálisis, 9 estudios, n = 1234, calidad metodológica en general baja; referencia: artroscopia o RM)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro2 · Lesión Meniscal | Test «Test de McMurray» | 4b · cita bajo el test | 1 |
| Rodilla | ro2 · Lesión Meniscal | Test «Sensibilidad a la palpación de la línea articular» | 4b · cita bajo el test | 1 |

### Solomon 2001

Publicación: JAMA 286:1610–20  
DOI: 10.1001/jama.286.13.1610  
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
Última revisión: **sin revisar**

Citada como:

1. Suri 2010 (JAMA, revisión RCE; IC 95 %: 1,9–95)
2. Suri 2010 (JAMA, revisión RCE; IC 95 %: 1,4–13)

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

Publicación: —  
DOI: 10.1186/s12891-016-1383-2  
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

### Vadakekut y Gnugnoli 2025

Autores: Vadakekut y Gnugnoli  
Título: *Ectopic Pregnancy*  
Publicación: StatPearls [Internet], NBK539860 (act. 2025-03-27)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de hombro.

Citada como:

1. Vadakekut y Gnugnoli 2025 — Vadakekut y Gnugnoli, «Ectopic Pregnancy», StatPearls [Internet], NCBI Bookshelf, última actualización 27 de marzo de 2025.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Hombro | — | Pregunta `h_g1` · Ginecológico | 2 · razonamiento del cribado | 1 |

### van Dijk 1996

Publicación: J Bone Joint Surg Br 78-B(6)  
DOI: 10.1302/0301-620x78b6.1283  
Última revisión: **sin revisar**

Citada como:

1. Cajón anterior con mejor S y E a los 4–6 días; sin signo del surco, el LPAA no está roto del todo. No puntúa: van Dijk 1996 (160 inversiones; referencia: cirugía o artrografía) da para la exploración diferida completa (día 5: hinchazón, hematoma, palpación y cajón) S 96 %, E 84 %, pero para el cajón solo el texto (S 86 %, E 74 %) no cuadra con su propia tabla, y lo que valida es rotura frente a ligamentos intactos, no esguince frente a otros diagnósticos.
2. Tarjeta de consulta tobillo y pie (ap. 5); van Dijk 1996 (J Bone Joint Surg Br 78-B(6))

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «Cajón anterior (a los 4–6 días)» (en `criterio`) | 4b · mención en el texto | 1 |
| Tobillo y pie | tp1 · Esguince Lateral Agudo (LPAA y LPC) | Test «Cajón anterior (a los 4–6 días)» | 4b · cita bajo el test | 2 |

### Vandeputte 2026

Autores: Vandeputte, Sergooris, Roose, Timmermans y Corten  
Título: *Clinical Diagnosis and Treatment of Iliopsoas-Related Groin Pain: A Systematic Review*  
Publicación: J Clin Med 15(15):5912  
DOI: 10.3390/jcm15155912  
Última revisión: **sin revisar**  
Nota: Texto completo en PMC13466767 (Europe PMC intercambia nombre y apellido de los autores). Dosis de ca17 (cadera).

Citada como:

1. Vandeputte 2026, J Clin Med 15(15):5912 (revisión sistemática; tratamiento conservador solo en series de casos y cohortes, calidad baja a moderada)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | ca17 · Dolor Inguinal Relacionado con el Psoas Ilíaco | Pauta de tratamiento | 5 · cita de la pauta | 1 |

### Vijayan y Mabrouk 2026

Autores: Vijayan y Mabrouk  
Título: *Septic Arthritis of the Pediatric Hip*  
Publicación: StatPearls [Internet], NBK459284 (act. 2026-09-14)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Vijayan y Mabrouk 2026 — Vijayan y Mabrouk, «Septic Arthritis of the Pediatric Hip», StatPearls [Internet], NCBI Bookshelf, última actualización 14 de septiembre de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_in1` · Inflamatoria / Infecciosa | 2 · razonamiento del cribado | 1 |

### Waheed 2023

Autores: Waheed, Kudaravalli y Hotwagner  
Título: *Deep Venous Thrombosis*  
Publicación: StatPearls [Internet], NBK507708 (act. 2023-01-19)  
DOI: —  
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo. Razonamiento del cribado de cadera.

Citada como:

1. Waheed 2023 — Waheed, Kudaravalli y Hotwagner, «Deep Venous Thrombosis», StatPearls [Internet], NCBI Bookshelf, última actualización 19 de enero de 2023.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `ca_v2` · Vascular | 2 · razonamiento del cribado | 1 |

### Walton 2004

Publicación: J Bone Joint Surg Am  
DOI: 10.2106/00004623-200404000-00021  
Última revisión: **sin revisar**

Citada como:

1. Walton 2004 (J Bone Joint Surg Am; 38 con dolor localizado en la AC, 28 con respuesta a la infiltración; tabla I)
2. Walton 2004 (J Bone Joint Surg Am; 38 con dolor localizado en la AC, 28 con respuesta a la infiltración; tablas I y IV)
3. Brazo a 90° de flexión y 10° de aducción; resistir un empuje hacia abajo con el pulgar hacia abajo y después hacia arriba. Positivo si el dolor está en la AC con el pulgar abajo y baja o desaparece con el pulgar arriba; dolor en otro sitio = negativo. Evidencia contradictoria, así que no puntúa: Chronopoulos 2004 (casos y controles, 17 casos y 308 controles quirúrgicos) da S 41 %, E 95 % (LR+ 8,2); Walton 2004 (prospectivo, referencia: infiltración de la AC, 28 casos y 10 controles) da S 16 %, E 90 % (LR+ 1,6). Combinado con el Paxinos y hechos en serie (los dos positivos), la revisión de Krill 2018 da E 95,8 % y LR+ 2,71, la mejor de las combinaciones, y concluye que ninguna cambia más que poco la probabilidad; Lluch 2020 (cap. 3.1, p. 61) lo resume como «S y E >90 %», cifra que el resumen de la revisión no respalda.
4. Chronopoulos 2004 (Am J Sports Med) · Walton 2004 (J Bone Joint Surg Am) · Krill 2018 (Phys Sportsmed 46:98–104, revisión sistemática; resumen)

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
Última revisión: **sin revisar**

Citada como:

1. Warden 2007 (Am J Sports Med 35:427–36; 30 con tendinopatía rotuliana clínica frente a 33 asintomáticos)

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Rodilla | ro5 · Tendinopatía Rotuliana | Test «Ecografía o RM (si se dispone de informe)» | 4b · cita bajo el test | 1 |

### Wenker y Quint 2023

Autores: Wenker y Quint  
Título: *Ankylosing Spondylitis*  
Publicación: StatPearls [Internet], NBK470173 (act. 2023-06-20)  
DOI: —  
Última revisión: **sin revisar**  
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
Última revisión: **sin revisar**  
Nota: Revisión narrativa; texto completo en PMC12883049, leído en PubMed Central (2026-10). Razonamiento de l_u4 (cólico renal, lumbar).

Citada como:

1. Wróblewski 2026 — Wróblewski, Wróblewska, Szukalska, Karczewska, Lichwala, Samborska, Balajewicz y Siwek, «Current Perspectives on Urolithiasis: Pathogenesis, Clinical Management, and Treatment», Cureus 2026;18(1):e101141 (texto completo en PMC), apartados «Etiology», «Diagnosis» y «Treatment and management».

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Lumbar | — | Pregunta `l_u4` · Urogenital / Renal | 2 · razonamiento del cribado | 1 |

### Zaslav 2001

Publicación: J Shoulder Elbow Surg 10:23–27  
DOI: 10.1067/mse.2001.111960  
Última revisión: **sin revisar**

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
Última revisión: **sin revisar**  
Nota: Capítulo de StatPearls (NCBI Bookshelf); PDF aportado por el usuario. La clave lleva el año de la última actualización del capítulo.

Citada como:

1. Zemaitis 2026 — Zemaitis, Boll, Kato y Golla, «Peripheral Arterial Disease», StatPearls [Internet], NCBI Bookshelf, última actualización 31 de enero de 2026.

| Región | Hipótesis | Dónde | Fase | Cita |
|---|---|---|---|---|
| Cadera | — | Pregunta `c2` · Vascular | 2 · razonamiento del cribado | 1 |
| Cadera | — | Pregunta `ca_v3` · Vascular | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_v1` · Vascular | 2 · razonamiento del cribado | 1 |
| Lumbar | — | Pregunta `l_v3` · Vascular | 2 · razonamiento del cribado | 1 |

### Zhang 2010

Publicación: Ann Rheum Dis 69:483–9  
DOI: 10.1136/ard.2009.113100  
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

### Cadera (36)

| Hipótesis | Test | Cifras | Puntúa |
|---|---|---|---|
| ca2 · Síndrome de Pinzamiento Femoroacetabular (SIFA) | Test FABER (Flexión-Abducción-Rotación Externa) | — | no |
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

### Cervical (20)

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
| ce11 · Fatiga Muscular Cérvico-Escapular | Test de resistencia de flexores cervicales profundos | — | no |
| ce11 · Fatiga Muscular Cérvico-Escapular | Evaluación de fatiga en actividades funcionales prolongadas | — | no |

### Lumbar (2)

| Hipótesis | Test | Cifras | Puntúa |
|---|---|---|---|
| lu1 · Disfunción Segmentaria Lumbosacra (Déficit de Movilidad) | Evaluación de hipomovilidad segmentaria lumbar (PAIVM) | — | no |
| lu2 · Inestabilidad Espinal Lumbar (Déficit de Coordinación) | Evaluación de control motor en bipedestación | — | no |

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
