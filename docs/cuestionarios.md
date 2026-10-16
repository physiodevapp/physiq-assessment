# Cuestionarios (PROMs y cribado psicosocial)

Estado (2026-10): investigación hecha; **calculadora implementada** para el piloto psicosocial y de dolor (§8). Base para decidir qué cuestionarios puntúa la app y cómo.

## 1. Qué propone la app hoy

Antes de la calculadora (§8), ningún cuestionario se puntuaba en la app: solo se recomendaban como texto.

- **Fase 1, riesgo psicosocial** (`app.js`, `selectPsico`, `updatePsicoRecomendacion`, `applyRegionChange`): Örebro (OMPSQ) para cualquier región; hasta 2026-10 también STarT Back para lumbar, retirado por no tener validación en castellano de España (§8). Con `psico_*` en «Sí» o «Dudoso»: FABQ y TSK-11 (miedo-evitación), PCS (autoeficacia; ver §6), PHQ-2 → PHQ-9 (estado de ánimo). El nivel Bajo/Medio/Alto lo elige el clínico.
- **Fases 4b y 5, `prom` de cada hipótesis** (`data/<región>.js`; badge `.prom-badge` y «Escala recomendada para el seguimiento» en el prompt del informe con IA). La MCID va dentro del texto (`'ODI (MCID: 8.5 pts) / …'`), no como dato aparte.

| Región | PROMs (desde 2026-10, solo validados en castellano de España) | Antes |
|---|---|---|
| Lumbar | ODI, RMDQ, NPRS | Sin cambios |
| Cervical | NDI, EVA | PSFS y mJOA retirados (sin validación de España) |
| Hombro | SPADI, ASES, DASH | QuickDASH → DASH (el QuickDASH no tiene validación de España propia) |
| Codo | PRTEE, DASH | QuickDASH → DASH; Oxford Elbow Score y MEPS retirados |
| Cadera | WOMAC (artrosis), iHOT-12, HOS, LEFS, ODI (sacroilíaca) | HOOS → WOMAC en la artrosis, iHOT-12 o LEFS en el resto (ODI en el dolor sacroilíaco); HAGOS → HOS o iHOT-12 |
| Rodilla | KOOS, Kujala, VISA-P, LEFS, EVA | KOOS-12 e IKDC subjetivo → KOOS; KOOS-PF retirado |
| Tobillo y pie | FAAM, LEFS, VISA-A, CAIT, IdFAI | Sin cambios |

Validaciones de España de los instrumentos nuevos en el badge: WOMAC, Escobar 2002 (*Clin Rheumatol* 21(6):466–471, Bilbao, PMID 12447629); DASH, Hervás 2006 (*Med Clin* 127:441–447); HOS, Seijas 2014 (*HQLO* 12:70); LEFS, Cruz-Díaz 2014 (*Disabil Rehabil* 36(23):2005–2011); ODI, Flórez 1995 y Alcántara-Bumbiedro 2006 (*Rehabilitación*). Las MCID se mantienen solo donde ya estaban; a los sustitutos no se les añade ninguna. Un test unitario («PROM de las hipótesis») solo admite los instrumentos de esta tabla.

## 2. Cómo se investigó y límites

- Licencias: el proxy del entorno bloqueó las páginas oficiales (ePROVIDE/Mapi, IWH, Keele, koos.nu, AOSSM, Oxford University Innovation, phqscreeners.com). Las condiciones salen de los extractos del buscador sobre esas páginas y de fuentes secundarias (SRA Lab, APTA…). **Hay que confirmarlas con el titular antes de usar nada en la app o en el repo.**
- Validaciones españolas: comprobadas en PubMed (autor, año, revista, PMID/DOI).
- Puntos de corte marcados con * se dieron de memoria y no se reverificaron.
- §5 recoge la revisión de los PDF de la carpeta personal del usuario (39 archivos, 2026-10).

Leyenda de licencia:

- 🟢 Libre para app y repo.
- 🟡 Probablemente libre; falta confirmarlo.
- 🟠 Sin condiciones publicadas: pedir permiso al autor.
- 🔴 Licencia obligatoria, a menudo con tarifa, sin derecho a redistribuir.

## 3. Licencias, versión española e interpretación

### Psicosociales y generales

| Cuestionario | Licencia | Titular | Versión española validada | Interpretación |
|---|---|---|---|---|
| PHQ-2 / PHQ-9 | 🟢 | Pfizer: «No permission required to reproduce, translate, display or distribute» | Diez-Quevedo 2001, *Psychosom Med*, PMID 11485122; Muñoz-Navarro 2017, *BMC Psychiatry*, PMID 28793892; Gómez-Gómez 2022, *Psychol Med*, PMID 36258639 | PHQ-2 ≥3; PHQ-9 5 / 10 / 15 / 20 (leve, moderada, moderadamente grave, grave) |
| GAD-7 | 🟢 | Pfizer, misma nota que el PHQ | García-Campayo 2010 (no reverificado en PubMed) | 0-4 / 5-9 / 10-14 / 15-21 |
| STarT Back | 🟡 | Keele University: libre para uso no comercial; un producto requiere contacto con la Impact Accelerator Unit | Gusi 2011, *Aten Primaria*, PMID 21296465 (solo traducción y entrevistas cognitivas) | Total ≤3 bajo; total ≥4 con subescala psicosocial (ítems 5-9) ≥4 alto; resto medio (Hill 2008) |
| OMPSQ / OMPSQ-10 | 🟡 | Linton (Örebro University): copias gratis para uso clínico o de investigación; nada sobre software | OMPSQ-21: Cuesta-Vargas 2014, *HQLO*, PMID 25358630. **OMPSQ-10: no hay** | OMPSQ-10 ≥50* (no está en la calculadora: sin versión española); OMPSQ-21 <105 bajo, 105–130 moderado, >130 alto (las bandas que recoge Cuesta-Vargas 2014) |
| FABQ | 🟡 | Waddell 1993; sin licencia formal | Kovacs 2006, *Spine*, PMID 16395186 | Trabajo >34 (Fritz y George 2002); el >14 de actividad física no se usa (mediana de Burton 1999, no predijo la discapacidad: George 2008) |
| TSK-11 | 🟡 | Woby 2005 / Kori 1990; sin información | Gómez-Pérez 2011, *J Pain*, PMID 20926355 (TSK-11SV) | Sin punto de corte consensuado |
| PCS | 🔴 | Sullivan, a través de Mapi/ePROVIDE | García Campayo 2008, *Med Clin*, PMID 19007576 (fibromialgia) | ≥30 riesgo alto, 20–29 moderado (manual de Sullivan: P75 y P50) |
| PSFS | 🟠 | Stratford | **No hay** para dolor musculoesquelético | Sin bandas; MCID ≈2 |
| LEFS | 🟡 | Binkley | Cruz-Díaz 2014, *Disabil Rehabil*, PMID 24593163 | Sin bandas; MCID ≈9 |

### Columna y miembro superior

| Cuestionario | Licencia | Titular | Versión española validada | Interpretación |
|---|---|---|---|---|
| RMDQ | 🟢 / 🟡 | Roland: original y traducciones de dominio público. La versión española dice «© Fundación Kovacs… libre para su uso clínico»; para otros fines, citar Kovacs 2002 | Kovacs 2002, *Spine*, PMID 11880841 | Sin bandas |
| ODI | 🔴 | Fairbank, a través de Mapi: siempre exige acuerdo de licencia; la versión electrónica requiere revisión de capturas | Flórez 1995 y Alcántara-Bumbiedro 2006, *Rehabilitación* (no en PubMed) | 0-20 / 21-40 / 41-60 / 61-80 / 81-100 % (Fairbank 2000) |
| NDI | 🔴 | Vernon, a través de Mapi; las fuentes discrepan sobre la gratuidad clínica | Andrade Ortega 2008, *Med Clin*, PMID 18261377; 2010, *Spine*, PMID 20110848 | Sobre 50: 0-4 / 5-14 / 15-24 / 25-34 / >34 |
| mJOA | 🟠 | Benzel; lo puntúa el clínico | Solo un resumen de congreso (SENEC 2022) | Leve 15-17, moderada 12-14, grave ≤11 |
| SPADI | 🟡 | Roach: «free, non-proprietary» según fuentes secundarias | Membrilla-Mesa 2015, *HQLO*, PMID 26690943; Luque-Suárez 2016, PMID 26927584 | Sin bandas |
| DASH / QuickDASH | 🔴 | Institute for Work & Health: permiso escrito para software (categoría B, 1.250 CAD) | DASH: Hervás 2006, *Med Clin*, PMID 17040628. QuickDASH: traducción en la web del IWH, validada solo en túnel carpiano | Sin bandas |
| ASES | 🟡 | ASES; «public domain» según fuentes secundarias | Vrotsou 2016, *HQLO*, PMID 27756317 | Sin bandas |
| PRTEE | 🟠 | MacDermid | Gallego-Izquierdo 2020, *J Orthop Res*, PMID 32761913 | Sin bandas |
| Oxford Elbow Score | 🔴 | Oxford University Innovation; gratis solo para «individual, small-scale practices» | **No hay** | Sin bandas |
| MEPS | 🟠 | Mayo; lo puntúa el clínico | **No hay** | ≥90 / 75-89 / 60-74 / <60 |

### Cadera, rodilla y tobillo-pie

| Cuestionario | Licencia | Titular | Versión española validada | Interpretación |
|---|---|---|---|---|
| HOOS / HOOS-12 | 🔴 | Roos, a través de Mapi desde 2023: las clínicas pagan; la versión electrónica tiene tarifa | Solo Chile (Carmona 2025, PMID 40398581) / ninguna | Sin bandas |
| KOOS / KOOS-12 | 🔴 | Ídem | KOOS: Vaquero 2014, *KSSTA*, PMID 23143387; Lizaur-Utilla 2019, PMID 31161609. KOOS-12: solo México | Sin bandas |
| KOOS-PF | 🟡 | ePROVIDE: «not copyrighted» | Solo Colombia (Martínez-Cano 2021, PMID 34078455) | Sin bandas; MIC 16 |
| HAGOS | 🟡 | ePROVIDE: «not copyrighted» | No validada; existe traducción oficial «Spanish version LK 1.0» | Sin bandas |
| iHOT-12 | 🟠 | Griffin y otros | González-de-la-Flor 2022, *J Clin Med*, PMID 36362462 | Sin bandas |
| HOS | 🟠 | Martin | Seijas 2014, *HQLO*, PMID 24884511 | Sin bandas; MCID 9 (AVD) / 6 (deporte) |
| IKDC subjetivo | 🔴 | AOSSM; prohibido modificarlo | Pujol 2025, PMID 41094617 (solo traducción) | Sin bandas |
| Kujala (AKPS) | 🟠 | Kujala | Gil-Gámez 2016, *KSSTA*, PMID 25649731 | Sin bandas; MCID 10 |
| VISA-P / VISA-A | 🟠 | Visentini / Robinson. El VISA-P-SP lleva © JOSPT | Hernández-Sánchez 2011, PMID 21765223 / 2018, PMID 29237355 (JOSPT) | Sin bandas |
| FAAM | 🟠 | Martin / Irrgang | Cervera-Garvi 2017, PMID 28852426; Membrilla-Mesa 2022, PMID 34716013 | Sin bandas; MCID 8 (AVD) / 9 (deporte) |
| VISA-A | Suma 0–100 con los puntos de la hoja española (apéndice de Hernández-Sánchez 2018, versión publicada, aportada por el usuario), los mismos del original | Ítems 2–5: el paciente marca el dolor de 0 (sin dolor) a 10 y puntúa 10 − lo marcado, así que la app pide el número marcado (antes pedía los puntos, como la versión chilena de Keller 2018). La hoja «no validada» que circula da los mismos puntos a 8A, 8B y 8C: está mal |
| CAIT | 🟠 | Hiller | Cruz-Díaz 2013, PMID 23053687; Rodríguez-Fernández 2015, PMID 26292174 | ≤27 original; ≤25 (Wright 2014); <24 (International Ankle Consortium, Gribble 2014) |
| IdFAI | 🟠 | Simon; © AOFAS | Cervera-Garvi 2020 (*Disabil Rehabil*, PMID 33296608); Izquierdo 2021, PMID 33582620 | ≥10,5 (Cervera-Garvi 2020); ≥11 con puntos enteros, como el original (Gribble 2014 lo cita como «> 11») |

### Conclusiones

- **Los PROMs regionales más usados por la app son 🔴:** ODI, NDI, QuickDASH, KOOS-12 y HOOS-12. Alternativas libres: RMDQ para lumbar; KOOS-PF y HAGOS para rodilla y cadera (sin versión de España). Para cervical no se encontró alternativa libre al NDI.
- **La traducción tiene sus propios derechos.** Que el artículo de validación sea de acceso abierto no permite publicar el cuestionario: hace falta el permiso del autor original y el de los traductores.
- **Interpretación:** solo algunos tienen bandas o puntos de corte (STarT Back, OMPSQ, PHQ, GAD-7, ODI, NDI, PCS, CAIT, IdFAI, MEPS, mJOA). El resto da solo la puntuación; la app no debe inventar una interpretación.
- **MCID:** sin una revisión posterior (la app hace una valoración única), es solo información de referencia.

## 4. Imprimir desde la app

No alojar los PDF en el repo: es público y se despliega en GitHub Pages, así que alojarlos es redistribuirlos, y casi ningún titular lo permite.

- Para todos: un enlace «Abrir en la fuente oficial ↗» junto al badge del PROM, a la página de descarga del titular.
- Para 🟢 (y 🟡 una vez confirmados): cuando los ítems estén en datos estructurados, generar la versión imprimible desde esos datos (una sola fuente), no mantener un PDF aparte.

## 5. Revisión de los PDF del usuario (2026-10)

Carpeta personal, nombres del usuario (prefijos `COL_`, `MINF_`, `MSUP_`, `TRANS_`). Los archivos no están en el repo.

### Usables

| Archivo | Qué es | Notas |
|---|---|---|
| `COL_ROLAND-MORRIS_ESP` | RMDQ, versión Kovacs 2002 | «© Fundación Kovacs», libre para uso clínico |
| `COL_OWESTRY_ESP` | ODI **versión 1.0** (ítem 1 sobre calmantes) | Línea Flórez 1995 / Alcántara 2006. Trae «suma × 2» y la MCID de la FDA (15 puntos, para fusión); la app cita 8,5 |
| `MINF_HAGOS_ESP` | HAGOS «Spanish version LK 1.0» | Traducción oficial de España |
| `MINF_FAAM_ESP` | FAAM en español de España | No cita de qué validación sale |
| `MINF_KOOS_ESP` | KOOS «Spanish version LK1.0, nov 2012» (Vaquero) | Erratas menores (S5 «¿Puedo doblar…?», orden de opciones de Q4) |
| `MINF_VISA-P_ESP` | VISA-P-SP, apéndice de JOSPT 2011 | © JOSPT, «for personal use only» |
| `MINF_iHOT-12_ESP` | iHOT-12Sv, escala visual 0-100 | Corregir P8 (extremos de dolor en una pregunta de preocupación), P6 y «marcha»; PDF parcialmente dañado |
| `MSUP_SPADI_ESP` | SPADI-Sp, España | Sin instrucciones de puntuación |
| `TRANS_TSK11_ESP` | TSK-11SV (Gómez-Pérez 2011) | — |
| `TRANS_ÖREBRO MSK PAIN QUESTIONNAIRE_ESP` | OMPSQ-21, material suplementario de Cuesta-Vargas 2014 | — |
| `TRANS_DN4_ESP` | DN4 (Pérez 2006) | Sin el punto de corte (≥4) |
| `TRANS_DOLOR-S-LANSS_ESP` | S-LANSS en español | Sin cita ni puntuación ponderada |
| `TRANS_paindDetect_ESP` | painDETECT en español | © Pfizer Pharma GmbH |
| `TRANS_CADC_ESP` | Cuestionario de Autoeficacia en Dolor Crónico (Martín-Aragón y otros, 1999) | Ver §6 |

### Para sustituir

| Archivo | Problema | Usar en su lugar |
|---|---|---|
| `COL_IDC_ESP` (NDI) | El ítem 7 tiene 5 opciones en vez de 6: máximo 49, bandas desplazadas | Andrade Ortega 2008 |
| `COL_STarT_ESP` | Traducción de EE. UU. (membrete de Minneapolis, puntuación en inglés) | Versión de España de la página de traducciones de Keele |
| `MINF_EFEI_ESP` (LEFS) | Traducción de EE. UU. o Latinoamérica («cuadras», «milla») | Cruz-Díaz 2014 |
| `MSUP_Upper-Extremity_ESP` (UEFI) | Misma familia estadounidense | — |
| `MINF_HOOS_ESP` | 39 ítems con restos del KOOS («rodilla» dos veces; faltan P2 y P3 de dolor; S2 mal traducido; dirección de puntuación incoherente) | No hay versión de España; con licencia, Chile (Carmona 2025) |
| `MINF_FFI_ESP` | Instrucción «de 1 a 10», escala 0-10, total entre 207 en vez de 230 | Corregir; la app no lo propone |
| `MINF_VISA-A_ESP` | «Este cuestionario no está validado»; P6 y P8 mal | Hernández-Sánchez 2018 |
| `MINF_VISA-H_ESP` | Copiado del VISA-P («tendinopatía rotuliana», «rodilla») | — |
| `MINF_Pelvic-Girdle-Questionnaire_ESP` | Ítems 23-25 «Bastante (3)» en vez de (2); divide siempre entre 75 | Corregir |
| `MINF_LLFI_ESP` | Escala 0-4; el original es Sí / En parte / No | Comprobar la versión |
| `TRANS_PHQ-2_ESP`, `TRANS_PHQ-9_ESP`, `TRANS_GAD-7_ESP` | Versiones de EE. UU. (instrucciones en inglés en el PHQ-2) | Diez-Quevedo 2001; García-Campayo 2010 |

### Solo en inglés

`MINF_FADI` (antecesor del FAAM, prescindible), `MINF_VISA-G` (sin versión española encontrada), `TRANS_ÖREBRO … SHORTFORM_ESP` (pese al nombre; no hay OMPSQ-10 español validado).

### Fuera de alcance

`MINF_WOMAC_ESP` (🔴 Bellamy), `TRANS_EurQoL 5D_ESP` (EQ-5D-5L oficial de España, 🔴 registro en EuroQol), `TRANS_McGill_Short` (🔴), `TRANS_Inventario-de-depresion-BDI_ESP` (BDI-I/IA, 🔴 Pearson; el PHQ-9 lo cubre), `TRANS_MiniBESTest_ESP` (traducción aprobada por Horak 2017; equilibrio, lo puntúa el clínico), `TRANS_WAI_ESP` (INSST NTP 1.147; capacidad laboral), `MSUP_FMA-UE_ESP` (ictus, lo puntúa el clínico).

### La app los recomienda y no están en la carpeta

QuickDASH/DASH, PRTEE, ASES, Oxford Elbow Score, IKDC, Kujala, KOOS-PF, KOOS-12, HOOS-12, HOS, CAIT, IdFAI, FABQ, PCS, PSFS.

## 6. Pendiente de revisión clínica

- **Autoeficacia en la fase 1 — resuelto (decisión del usuario, 2026-10):** la PCS mide catastrofización, así que pasa a la pregunta «miedo al movimiento o catastrofización» (`psico_miedo`, junto a FABQ y TSK-11), y la de «baja autoeficacia o desesperanza» (`psico_autoef`) sugiere el CADC (Martín-Aragón y otros, 1999), creado en España. `updatePsicoRecomendacion()`, `app.js`.
- **MCID del ODI — resuelto (decisión del usuario, 2026-10):** se mantiene la de la app. Los 15 puntos de la hoja del usuario son el criterio de la FDA para fusión vertebral, no una MCID general.

## 7. Pendiente de verificar

- Condiciones oficiales de ePROVIDE (ODI, NDI, PCS, KOOS/HOOS, HAGOS, KOOS-PF), IWH (DASH/QuickDASH para una app gratuita), Keele (STarT Back), Linton (OMPSQ), Roach (SPADI), MacDermid (PRTEE), Stratford (PSFS), Fundación Kovacs (RMDQ en app y repo).
- Puntos de corte marcados con *: ya no queda ninguno en la calculadora. FABQ, OMPSQ-21, IdFAI y CAIT (< 24, Gribble 2014, leído: 24 pasa a la zona dudosa) están comprobados con su fuente (§8); el OMPSQ-10 no se usa.
- Fuentes sin leer que la calculadora suple con otra (cada `nota` lo dice): la hoja española del IdFAI (etiquetas traducidas por nosotros). La hoja española de la VISA-A ya está comprobada (apéndice de la versión publicada de Hernández-Sánchez 2018). Resueltas en 2026-10 con artículos aportados por el usuario: las bandas del ODI (Alcántara-Bumbiedro 2006, con su redacción y la exclusión de ítems sin contestar) y el CADC (Martín-Aragón 1999: ítems, escala 0–10 y tres factores; el artículo no da regla de puntuación ni corte, así que la media 0–10 sigue siendo elección de la app).
- Validación de origen de los PDF sin cita: FAAM, iHOT-12, S-LANSS, LLFI, Pelvic Girdle Questionnaire.

## 8. Calculadora (implementada, 2026-10)

Decisiones del usuario (2026-10):

- **Para qué:** puntuar rápido e interpretar la hoja que el paciente ya ha rellenado en papel. No sustituye al papel ni lo reproduce.
- **Dónde:** icono en la cabecera, en cualquier fase y también en el hub (no usa red), como «⏱ Tiempos de recuperación».
- **Entrada:** tocar el valor de cada ítem; el total, lo que falta y la interpretación se actualizan solos.
- **Resultado:** al payload (`cu`), a 📋 Notas, a la fase 5 y al informe con IA. No al 📄 Informe para el paciente o su médico.
- **Piloto:** psicosociales y dolor neuropático (PHQ-2, PHQ-9, GAD-7, TSK-11, CADC, Örebro, DN4, S-LANSS). Los regionales, después.
- **Requisito obligatorio:** solo cuestionarios con una validación publicada en castellano de España (las latinoamericanas no valen) (campo `validacionEs`; un test unitario falla sin él). STarT Back salió de la calculadora por eso: su versión de España (Gusi 2011) es solo una traducción con entrevistas cognitivas, sin fiabilidad ni validez, y en PubMed no hay una validación posterior (búsqueda de 2026-10).

Criterios del diseño:

- **Etiquetas cortas, no el texto literal de cada ítem.** El paciente responde en su hoja; la app solo recoge lo que marcó, en el mismo orden. Así tampoco reproduce el texto con derechos, lo que reduce mucho el problema de licencias de §3: una calculadora usa el número de ítems, sus valores y la regla de puntuación, no el cuestionario.
- **Solo reglas leídas en la fuente.** Cada cuestionario cita su `fuente`. Sin punto de corte publicado, la app lo dice («Sin punto de corte consensuado») en vez de inventar uno.
- **Sin puntuación con ítems en blanco.** Ninguna fuente del piloto da una regla para ítems sin contestar que hayamos leído; hasta que la haya, la puntuación aparece solo con el cuestionario completo.
- **Las alertas de seguridad no esperan.** El ítem 9 del PHQ-9 avisa en cuanto se marca, aunque falten ítems.
- **Hojas en papel:** la calculadora sigue la versión validada. Si la hoja del usuario difiere (§5: NDI, HOOS, VISA-A…), hay que cambiar la hoja, no la calculadora.

Verificación de las reglas del piloto (2026-10; el proxy solo dejó leer PMC y PubMed):

| Cuestionario | Leído en | Verificado | Sin verificar en la fuente primaria |
|---|---|---|---|
| PHQ-9 | Kroenke 2001, texto completo (tabla 2) | Ítems 0–3, suma 0–27, bandas 5/10/15/20, ≥10 S y E 88 %, la pregunta de dificultad no suma | El aviso del ítem 9 es una regla de seguridad de la app (consta en su `nota`) |
| PHQ-2 | Kroenke 2003, resumen | ≥3, S 83 %, E 92 % | — |
| GAD-7 | García-Campayo 2010, texto completo (tabla 2) | Corte 10 en la versión española (S 86,8 %, E 93,4 %) | Bandas 5/10/15 del original (Spitzer 2006 no se pudo abrir; García-Campayo las cita con una errata en la última) |
| STarT Back | — | Retirado de la calculadora: sin validación española | — |
| DN4 | Pérez 2007, texto completo (tabla 4) | 10 ítems, ≥4, S 79,8 %, E 78,0 % | — |
| S-LANSS | López-de-Uralde-Villanueva 2018, resumen | ≥12 en la versión española | Pesos 5/5/3/2/1/5/3 solo en fuentes secundarias |
| TSK-11 | Woby 2005 y Gómez-Pérez 2011, resúmenes | 11 ítems, sin invertidos, sin corte; mejoría importante ≥4 puntos | Escala 1–4 solo en fuentes secundarias; ítems de las dos subescalas (no se usan) |
| Örebro | Cuesta-Vargas 2014, texto completo y formulario | Puntuación de cada ítem (formulario), total 210 | Bandas <105 / 105–130 / >130 según Cuesta-Vargas, que las atribuye a Linton y Boersma 2003; el corte de 90 de Linton 2003, solo en su resumen |
| CADC | Martín-Aragón 1999 (tabla 1 y anexo 1, leído) | 19 ítems de 0 a 10; control de síntomas (8), funcionamiento físico (6) y manejo del dolor (5): los tres bloques de la hoja | El artículo no da regla de puntuación (lleva los totales a 0–100 para el análisis) ni corte: la app usa la media 0–10 |

Regionales (2026-10): los PROM que recomiendan las hipótesis, todos validados en castellano de España. Especificación verificada por fuente; lo que no se pudo leer consta en la `nota` de cada uno.

| Cuestionario | Puntuación | Decisión (aceptadas por el usuario, 2026-10) o duda pendiente |
|---|---|---|
| ODI v1.0 | % = suma ÷ (5 × contestados) × 100; bandas de la versión española (las de Fairbank) | Comprobado con Alcántara-Bumbiedro 2006 (aportado por el usuario): bandas «mínima, moderada, intensa, discapacidad, limitación funcional máxima»; un ítem sin contestar se excluye, sin límite |
| Roland-Morris | Frases marcadas, 0–24 | — |
| NDI | % del máximo; bandas de Vernon en % | Comprobado con Andrade Ortega 2008 (anexo): el ítem 7 tiene 6 opciones (a la hoja del usuario le falta una); «conducir» sin contestar se excluye del máximo |
| SPADI | Dolor ÷ 50, discapacidad ÷ 80, total = media de las dos | Otras fuentes usan suma ÷ 130; se sigue la validación española |
| ASES | (10 − EVA) × 5 + función × 5/3 | Solo el lado afectado |
| DASH | ((suma ÷ n) − 1) × 25 | Orden comprobado con la hoja española de Rosales 2002 (los ítems 3 y 4 van al revés que en inglés) |
| PRTEE | Dolor + función ÷ 2 | Orden comprobado con la hoja española de Hernández-Sánchez 2013 |
| WOMAC | Suma 0–96 y subescalas | — |
| iHOT-12 | Media de los mm (0–100) | El ítem 9 «no relevante» se excluye (deducción) |
| HOS | % por subescala sin N/A, sin total | — |
| KOOS | 100 − media × 25 por subescala, sin total | Q4 de la hoja con opciones en orden dudoso: puntúa la posición |
| Kujala | Suma 0–100 con puntos por opción | Letras, orden y redacción de la versión española (Gil-Gámez 2016, apéndice 2); puntos del original (apéndice 1 del mismo artículo, comprobados uno a uno). El ítem 4 (escaleras) tiene una opción más que el original, C «dolor leve al subir», que Gil-Gámez puntúa con 8, como «dolor al bajar» (lo pidió el 5,3 % en la prueba piloto; acordado con Kujala). El 11D dice «después de la cirugía» (original: «luxación documentada»), se puntúa igual |
| VISA-P | Puntos del apéndice de la VISA-P-SP | — |
| FAAM | % por subescala sin N/A | **Decidido (usuario, 2026-10):** vida diaria con los 15 ítems validados en España (sin el 2, 7, 13, 14, 18 y 20), con la fórmula original aplicada a esos 15 |
| CAIT | Suma 0–30 con los puntos de la hoja del usuario; cortes < 24 (IAC) y ≤ 27 (Hiller), con «zona dudosa» de 24 a 27 | La hoja no dice de qué validación española sale (sus puntos coinciden con el original); «< 24» leído en Gribble 2014 (aportado por el usuario) |
| LEFS | Suma 0–80 | Orden (1–20) y redacción comprobados con la versión española (Cruz-Díaz 2014, apéndice 1): mismo orden que el original, «250 metros» y «un kilómetro» en vez de manzanas y millas. Su cambio mínimo detectable (2,18 puntos) se añade a la interpretación |

**IdFAI** (añadido): puntos por respuesta del apéndice B del original (Simon 2012, *Foot Ankle Int* 33(9):755–763, aportado por el usuario); la pregunta 1 (número de esguinces) no puntúa y las 2–10 suman 0–37 (más es peor). Corte de la versión española ≥ 10,5 (Cervera-Garvi 2020, *Disabil Rehabil*, doi:10.1080/09638288.2020.1857446; AUC 0,84), ≥ 11 con puntos enteros, como el original; cambio mínimo detectable 6,4. El artículo español no trae el cuestionario: etiquetas traducidas por nosotros, pendientes de comparar con la hoja española si aparece.

physiq-report lee el campo `cu` del payload (`buildClinicalContext()`, mismo bloque que `contextoValoracion()`; physiodevapp/physiq-report#89).

**FABQ y PCS** (añadidos a petición del usuario, 2026-10; no estaban en su carpeta, así que la puntuación sale de la bibliografía):

- **FABQ** (validación española: Kovacs 2006, *Spine* 31(1):104–110; texto completo aportado por el usuario). Las 16 frases, en el orden del original, que la versión española mantiene (solo reformuló la 8, indemnización). **Total 0–96**, suma de las 16, como lo define Kovacs 2006, que lo recomienda («al menos tan válido como sus subescalas y más sencillo de puntuar»); sin punto de corte publicado. **Subescalas** del apéndice de Waddell 1993 (texto completo aportado por el usuario): actividad física 2–5 (0–24) y trabajo 6, 7, 9, 10, 11, 12 y 15 (0–42); Kovacs 2006 cita la de trabajo sin el 15, pero su máximo de 42 solo cuadra con los 7 ítems. **Corte solo en trabajo**: > 34 predice restricciones laborales a las 4 semanas y < 30 lo hace improbable (Fritz y George 2002, lumbalgia aguda laboral; cocientes de probabilidad 3,33 y 0,08), con 30–34 como zona intermedia. El «> 14» de actividad física es la mediana de Burton 1999 y no predijo la discapacidad a 6 meses (George 2008), así que no se usa como corte. Etiquetas comprobadas con la hoja española de la Fundación Kovacs (kovacs.org/descargas/CuestionarioFAB.pdf, aportada por el usuario; «libre para su uso clínico», citando su copyright y Kovacs 2006): mismas 16 frases y orden, escala 0 = en total desacuerdo, 3 = ni de acuerdo ni en desacuerdo, 6 = completamente de acuerdo. La frase 8 es más amplia que la del original: recibir o tramitar cualquier compensación (baja laboral, pensión o indemnización); no entra en las subescalas.
- **PCS** (validación española: García Campayo 2008, *Med Clin* 131(13):487–492, en fibromialgia; no hay otra en población musculoesquelética de España). 13 ítems 0–4, total 0–52; rumiación 8–11, magnificación 6, 7 y 13, desesperanza 1–5 y 12 (Cook 2021, *Pain Rep* 6(1):e909, leído). Corte: 30 = catastrofización clínicamente relevante, leído en el manual de Sullivan (*PCS User Manual*, 2009, aportado por el usuario): p. 7, «a total PCS score of 30 represents clinically relevant level of catastrophizing» y corresponde al percentil 75; en la tabla de percentiles (apéndice A) el 30 está en el P75. Eso cierra la duda «≥ 30» frente a «> 30» (la ficha de Shirley Ryan AbilityLab y Acta Orthop 2019 decían «> 30»): la app usa ≥ 30. El manual da también el P75 de las subescalas (rumiación 11, magnificación 5, desesperanza 13; solo en la nota) y, para el cribado de cronicidad (p. 8), riesgo alto por encima del P75 y moderado entre P50 y P75; en su tabla el P50 es un total de 20, así que la app da tres bandas: < 20, 20–29 (riesgo moderado, `medio`) y ≥ 30 (relevante, riesgo alto) (banda moderada añadida a petición del usuario, 2026-10). Las normas son de 851 trabajadores lesionados (75 % lumbar) y el manual pide cautela en dolor agudo. La hoja original en inglés (© Sullivan, aportada por el usuario) confirma los 13 ítems, su orden y la escala 0–4. Hayashi 2022 (*Pain Ther* 11(3):753–769) desaconseja un corte único entre culturas: la interpretación lo dice.

Enlaces «Calcular» (hecho): junto a la recomendación psicosocial de la fase 1 y al badge del PROM de las fases 4b y 5, un botón por cuestionario de la calculadora que nombra el texto («Calcular PHQ-9», o lo que lleva hecho: «PHQ-9 · 12/27 ✓»), que abre la calculadora en ese cuestionario. FABQ y PCS llevan botón desde que están en la calculadora (ver abajo).
