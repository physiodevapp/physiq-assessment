# «Anatomía» en Kenhub: tests de la fase 4b y cribado de la fase 2

Decisión del usuario (2026-10): poder repasar la anatomía de lo que carga cada test sin salir del flujo de la valoración. Estado por región: `MIGRATION_PLAN.md`, **Fase K**. Hombro es el piloto. **Una región por sesión** y revisión clínica del usuario antes de `main`.

## Qué es

Debajo de la fuente de cada test de la fase 4b hay una línea «ANATOMÍA Supraespinoso ↗ · Bursa subacromial ↗ · …». Cada enlace abre en una pestaña nueva el artículo de esa estructura en la biblioteca de Kenhub: **en español si Kenhub lo tiene y, si no, en inglés**, con una marca «EN» junto al nombre y «(sin versión en español)» en el `title` (decisión del usuario, 2026-10). El panel «Ampliar →» del test repite la lista en una sección «Anatomía (Kenhub)», entre «En detalle» y «Fuentes».

**En la fase 2** (decisión del usuario, 2026-10) la misma línea va dentro del «ⓘ ¿Por qué?» de las preguntas de cribado, entre «Cuánto pesa» y el pie de fuentes, y su panel «Ampliar →» la repite antes de «Fuentes». Encaja especialmente bien en el cribado: casi todas sus preguntas buscan una víscera o un nervio que refiere dolor a la región (en el hombro, el diafragma y el nervio frénico, el corazón, la pleura, la vesícula…), y ver esa anatomía explica la derivación. **Nunca en los sistemas transversales** (posquirúrgico, endocrino, hematológico): son el mismo objeto en las 7 regiones, así que su anatomía aparecería en todas, y no tienen una estructura concreta (test unitario).

- **Solo standalone**: en el hub se oculta por CSS (`.in-hub .test-anat, .in-hub .razon-anatomia`), igual que «✨ Ampliar con IA». Mostrarlo también en el hub sería quitar esa línea de CSS, porque no usa red ni datos.
- **Al imprimir no aparece** (`@media print`).
- **Nunca sale nada del paciente**: la URL lleva solo el slug de la estructura. Tampoco entra en el payload, `📋 Notas`, `📄 Informe` ni el prompt del informe con IA (test unitario).

## Por qué un enlace y no Kenhub dentro de la app

Se descartó el iframe. Kenhub prohíbe que lo incrusten: sus páginas responden `X-Frame-Options: SAMEORIGIN` (comprobado, 2026-10), así que dentro de la app no se vería nada. Aunque lo permitiera, el inicio de sesión en un iframe de otro dominio falla en Safari/iOS por las cookies de terceros, y en un móvil una web completa dentro de un panel es incómoda. Con un `<a target="_blank" rel="noopener noreferrer">` no hace falta JavaScript, y no hay `window.open`.

## Cuenta de Kenhub

**La app no pregunta si hay cuenta ni guarda nada de Kenhub.** La URL de un artículo es la misma para todos y Kenhub decide qué enseña según la sesión del navegador:

- **Con cuenta premium y la sesión iniciada en ese navegador**: el contenido completo.
- **Sin cuenta**: la parte gratuita.

Matices que no se pueden probar en automático:
- **La sesión va por navegador.** Una PWA instalada abre el enlace en el navegador del sistema. En iOS a veces lo abre en una vista propia sin la sesión.
- **Que la app de Kenhub capture el enlace** depende de que Kenhub tenga enlaces universales.

No se enlazan secciones solo para suscriptores (atlas, quizzes): el artículo general sirve para todos.

## Datos

**`data/anatomia.js`**: el registro de estructuras, una entrada por estructura.

```js
export const KENHUB_BASE = 'https://www.kenhub.com/en/library/anatomy/';
export const KENHUB_BASE_ES = 'https://www.kenhub.com/es/library/anatomia-es/';
export const ESTRUCTURAS = {
  supraespinoso:     { nombre: 'Supraespinoso', kenhub: 'supraspinatus-muscle', kenhubEs: 'musculo-supraespinoso' },
  bursa_subacromial: { nombre: 'Bursa subacromial', kenhub: 'subacromial-bursa' },   // sin versión en español
  labrum_glenoideo:  { nombre: 'Labrum glenoideo', kenhub: 'the-shoulder-joint', kenhubEs: 'articulacion-glenohumeral',
                       nota: 'Sin artículo propio: se trata en «Articulación glenohumeral»' },
  …
};
```

- `nombre`: lo que se lee en el enlace, en español.
- `kenhub`: el slug del artículo **en inglés**, obligatorio. Existe siempre y es el respaldo.
- `kenhubEs` (opcional): el slug de la versión **en español**, que es la que se enlaza cuando existe. Tiene otros slugs (`musculo-supraespinoso`, a veces con un `-es` final: `musculo-redondo-menor-es`), así que no se deduce: se copia del `<link rel="alternate" hreflang="es">` del artículo en inglés. Kenhub no traduce todos los artículos: de las 19 estructuras de hombro, 16 tienen versión en español y 3 no (bursa subacromial y ligamentos coracoacromial y coracohumeral). Esas 3 enlazan la inglesa con la marca «EN». La misma cuenta de Kenhub vale para los dos idiomas.
- `nota` (opcional): cuando la estructura no tiene artículo propio y se enlaza el que la trata. Se ve en el `title` del enlace.

Las claves son genéricas y se comparten entre regiones (`escapula`, `columna_cervical`…). Antes de crear una, se mira si ya existe.

**En cada test** (`data/<region>.js`): `anatomia: ['supraespinoso', 'bursa_subacromial']`, justo detrás de `name`. Se ponen las estructuras que el test carga, comprime o explora, en orden de importancia, normalmente de 1 a 3. Si un test es genérico no lleva campo: «Gesto testigo (①) y medida objetiva (②)», identificadores de consenso como los de Walmsley. Una estructura del registro que no use ningún test se borra.

**En cada pregunta de cribado** (`data/<region>.js`, `screening`): `anatomia: ['diafragma', 'nervio_frenico']`, justo detrás de `id`. Solo en preguntas con `razonamiento` (la línea va dentro de su «¿Por qué?») y solo cuando una estructura concreta explica la derivación o el riesgo; las preguntas generales (dolor nocturno, pérdida de peso, dolor constante, síntomas sistémicos) no llevan campo.

**Código** (`phase4b.js`): `enlacesAnatomia(item)` → `[{ nombre, url, nota, ingles }]` (`url` en español si hay `kenhubEs`; si no, en inglés con `ingles: true`), para un test o una pregunta. `anatomiaLineaHTML(item)` pinta la línea (tarjeta del test; `razonamientoInlineHTML()` de `app.js` en la fase 2) y `anatomiaPanelHTML(item)` la sección del panel (`abrirRazonamientoTest()` y `abrirRazonamiento()` de `app.js`). Estilos: `.test-anat`, `.anat-enlace`, `.anat-idioma` (la marca «EN») y `.razon-anatomia` en `styles.css`. En pantalla táctil los enlaces llevan 6 px de relleno vertical para que sean más fáciles de tocar.

## Procedimiento por región

Cada región pasa por las mismas dos fases que hombro, en la misma sesión: los tests de la 4b y las preguntas de su cribado de la fase 2 (solo sus sistemas propios). El registro es común, así que las estructuras que ya existen se reutilizan.

1. **Listar los tests de la región** con su índice:
   ```
   node -e "import('./data/<region>.js').then(m=>{for(const [id,h] of Object.entries(m.hypotheses)){console.log(id,h.name);h.tests.forEach((t,i)=>console.log('  ',i,t.name))}})"
   ```
   y las preguntas de sus sistemas propios con su «por qué»:
   ```
   node -e "import('./data/<region>.js').then(m=>{for(const s of m.screening.sistemas){if(s.id.startsWith('transversal'))continue;console.log('##',s.id);for(const q of s.preguntas)console.log('  ',q.id,q.text,'\n     ',q.razonamiento?.porque)}})"
   ```
2. **Decidir las estructuras** de cada test (qué tejido carga, comprime o explora según su `criterio` y su `razonamiento`) y de cada pregunta de cribado (qué víscera, nervio o hueso nombra su «por qué»). Si no hay una estructura clara, se deja sin campo.
3. **Comprobar cada slug nuevo** antes de añadirlo. `www.kenhub.com` está en los *Allowed domains* del entorno (2026-10), así que basta con `curl -sSL -o pagina.html -w "%{http_code} %{url_effective}" -A "Mozilla/5.0" https://www.kenhub.com/en/library/anatomy/<slug>`: tiene que dar 200 sin redirección a otra página, y el `<title>` tiene que ser el de la estructura. La versión en español sale del `hreflang="es"` de esa misma página (`grep -oE '<link[^>]+hreflang="es"[^>]*>' pagina.html`): si existe, se abre igual con `curl` y su slug va a `kenhubEs`; si no, la estructura se queda solo con `kenhub`. Si `curl` no llega, se puede buscar en el índice web, restringido a `kenhub.com`, que la URL exacta aparece como artículo de la biblioteca. **Nunca se inventa un slug**: si no se encuentra el artículo propio, se enlaza el de la estructura que lo contiene, con `nota`, como el labrum.
4. **Añadir** las estructuras nuevas a `ESTRUCTURAS` (agrupadas bajo un comentario con la región y la fase) y el campo `anatomia` a los tests y a las preguntas. Compensa un script de una sola vez que inserte `anatomia: [...]` detrás del `name` de cada test (por hipótesis e índice) y detrás de `{ id: '<pregunta>', ` en el cribado (ojo: los ids de pregunta pueden coincidir con ids de hipótesis, como `h3`; el `{ ` delante los distingue), y que compruebe el resultado importando el módulo.
5. **Tests**:
   - `node tests/unit.js`, tema «anatomía»: claves existentes, sin artículo repetido dentro de un test o pregunta, ninguna estructura sin usar, nada en los sistemas transversales, la línea dentro del «¿Por qué?», nada en payload, resúmenes ni prompt. Al terminar la región, se fijan sus listas como las del piloto (tests sin `anatomia`; preguntas con y sin ella), para que un test o una pregunta nuevos no se queden sin anatomía sin que nadie lo vea.
   - `node tests/smoke.mjs --solo anatomia,cribado`: la sección comprueba hombro (4b y fase 2) y no hace falta tocarla por región.
6. **Revisión del usuario**: las tablas de la región en este documento (tests y preguntas) y su fila en la Fase K. Después, a `main`.

`data/anatomia.js` entra en el despliegue con `cp data/*.js` (`deploy-to-hub.yml`), y el smoke test lo incluye en su comprobación de módulos.

## Hombro (piloto)

### Tests de la fase 4b

19 estructuras, 42 de los 49 tests. Se quedan sin campo los genéricos: h1/3, h2/5, h3/9, h4/5, h5/3 y h7/5 (gesto testigo) y h1/5 (identificadores de Walmsley).

| Hipótesis | Tests → estructuras |
|---|---|
| h1 Capsulitis | abducción pasiva, criterio de Bunker → art. glenohumeral · RE con brazo al lado → art. glenohumeral + lig. coracohumeral · dolor en la coracoides → escápula + lig. coracohumeral |
| h2 Pinzamiento subacromial | arco doloroso, regla SAPS → manguito + bursa subacromial · Hawkins → supraespinoso + bursa + lig. coracoacromial · Neer → supraespinoso + bursa + escápula (acromion) · RE resistida → infraespinoso + redondo menor |
| h3 Rotura del manguito | empty/full can, drop arm → supraespinoso · ER lag → infraespinoso + redondo menor · IR lag → subescapular · inspección, clusters A → manguito · cluster B (debilidad en RE) → infraespinoso · Hornblower → redondo menor |
| h4 Inestabilidad | todos (aprensión, recolocación, sorpresa, clusters, multidireccional) → art. glenohumeral (el artículo trata cápsula, ligamentos y labrum) |
| h5 SLAP | O'Brien, Biceps Load II → labrum + bíceps braquial · RI resistida → labrum |
| h6 Cervical referido | Spurling → columna cervical · PROM glenohumeral → art. glenohumeral |
| h7 Acromioclavicular | todos salvo el gesto testigo → art. acromioclavicular |
| h8 Discinesia escapular | observación, asistencia escapular → escápula + serrato anterior + trapecio |
| h9 Primera costilla | palpación PA → costillas + escalenos · elevación tras movilizar → costillas |
| h10 Artrosis | → art. glenohumeral |
| h11 Luxación / fractura | → húmero + art. glenohumeral |

Las 19 URLs inglesas y las 16 españolas se abrieron de verdad (2026-10): todas dan 200, sin redirección, con el título de la estructura, y el artículo español es completo (igual o más largo que el inglés). El artículo de la articulación glenohumeral trata el labrum (lo nombra 15 veces), lo que confirma el enlace con `nota`.

### Cribado de la fase 2

15 de las 19 preguntas de sus sistemas propios, con 11 estructuras nuevas (todas con versión en español) y 4 ya existentes (húmero, plexo braquial, columna cervical, articulación glenohumeral). Sin campo, por no tener una estructura concreta: h4 (dolor nocturno que despierta), h6 (pérdida de peso), h_r2 (dolor constante que no cambia con el movimiento) y h_i1 (síntomas sistémicos). Nada en los sistemas transversales.

| Sistema | Pregunta → estructuras |
|---|---|
| Cáncer | h3 antecedente de cáncer → húmero + plexo braquial (metástasis ósea, invasión del plexo) |
| Cardiovascular | h1 dolor con el esfuerzo, h2 sudor/náuseas/opresión → corazón · h_c3 ortopnea → corazón + diafragma |
| Pulmonar | h5 dolor al toser o respirar → pleura + diafragma + nervio frénico · h_p2 disnea → pulmones + corazón · h_p3 tos, esputo, hemoptisis → pulmones + pleura |
| Renal | h_r1 orina y fiebre → riñón + diafragma |
| Ginecológico | h_g1 ectópico roto → diafragma + nervio frénico · h_g2 endometriosis, Fitz-Hugh-Curtis → diafragma + hígado |
| GI / hepático | h_gi1 tras comidas grasas → vesícula biliar + nervio frénico · h_gi2 orina oscura, heces claras → hígado + vesícula biliar · h_gi3 dolor que sube con AINE → estómago |
| Traumático | h_t1 caída con deformidad → húmero + clavícula + articulación glenohumeral |
| Neurológico | h_n1 pérdida de fuerza o atrofia → plexo braquial + columna cervical |

Las 11 URLs nuevas, en inglés y en español, se abrieron con `curl` (2026-10): todas dan 200, sin redirección, con el título de la estructura. Los pulmones enlazan `the-lung` (`lungs` y `lung` dan 404) y su versión española es `vision-general-de-la-anatomia-pulmonar`.

Revisado por el usuario (2026-10).

## Rodilla

33 estructuras nuevas, 19 con versión en español. Kenhub no tiene en español los meniscos, el LCA, la articulación patelofemoral, la pata de ganso, la articulación tibioperonea, el nervio peroneo común ni las dos venas: esas se enlazan en inglés con la marca «EN». Sin artículo propio, y enlazadas a «Articulación de la rodilla» con `nota`, porque el artículo los trata: los colaterales medial y lateral (33 menciones), la bursa prerrotuliana y la grasa de Hoffa (13). El ligamento patelofemoral medial se dejó fuera, porque Kenhub solo lo nombra una vez; la inestabilidad rotuliana enlaza rótula y articulación patelofemoral. La plica medial enlaza la articulación de la rodilla, que la menciona.

### Tests de la fase 4b

70 de los 90 tests: todos salvo los 20 «Gesto testigo (①) y medida objetiva (②)».

| Hipótesis | Tests → estructuras |
|---|---|
| ro1 Artrosis | criterios (NICE, ACR), crepitación, osteofitos, restricción → art. rodilla · rango, hinchazón y debilidad → art. rodilla + cuádriceps |
| ro2 Menisco | McMurray, palpación de la interlínea, combinación global, Thessaly → menisco medial + lateral · combinaciones traumática y degenerativa (dolor medial) → menisco medial |
| ro3 Patelofemoral | dolor en sentadilla, grupos de Décary → art. patelofemoral · palpación de las facetas → rótula + art. patelofemoral |
| ro4 LCA | Lachman, cajón anterior, pivot shift, lever sign, clusters → LCA |
| ro5 Tendinopatía rotuliana | dolor en el polo inferior → tendón rotuliano + rótula · decline squat, imagen → tendón rotuliano |
| ro6 Cintilla iliotibial | Ober, Thomas → cintilla + tensor de la fascia lata · Noble → cintilla + fémur (cóndilo lateral) · palpación → cintilla · step-down lateral → glúteo medio |
| ro7 Pata de ganso | los tres → pata de ganso |
| ro8 LCM | valgo a 30° → colateral medial |
| ro9 LCP | cajón posterior, sag → LCP · activo del cuádriceps → LCP + cuádriceps |
| ro10 LLE y esquina posterolateral | hinchazón, varo a 30°, marcha en varo → colateral lateral · dial, cajón posterolateral, recurvatum → poplíteo + colateral lateral |
| ro11 Fracturas | Ottawa → rótula + peroné + tibia · rótula → rótula · meseta (y función neurovascular) → tibia + arteria poplítea + nervio peroneo común |
| ro12 Inestabilidad rotuliana | estrés tibiofemoral normal → art. rodilla · movilidad rotuliana, aprensión → rótula + art. patelofemoral |
| ro13 Hoffa | recurvatum, test de Hoffa → grasa de Hoffa |
| ro14 Bursitis pre e infrarrotuliana | fiebre (séptica), hinchazón en la bursa → bursa prerrotuliana |
| ro15 Apofisitis | cadera primero → art. cadera · tuberosidad o polo inferior → tibia + tendón rotuliano · sentadillas y extensión resistida → tendón rotuliano + cuádriceps |
| ro16 Osteocondral | palpación → fémur + art. rodilla · marcha, derrame y bloqueo → art. rodilla |
| ro17 Plica | test de provocación → art. rodilla |
| ro18 Tibioperonea proximal | presión, prominencia → art. tibioperonea + peroné · isquiotibiales en tensión → bíceps femoral + art. tibioperonea |
| ro19 Peroneo común | steppage, sensibilidad, fuerza, neurodinámica → nervio peroneo común · Tinel → nervio peroneo común + peroné |
| ro20 Quiste de Baker | signos meniscales → fosa poplítea + menisco medial · Foucher → fosa poplítea + semimembranoso |

### Cribado de la fase 2

15 de las 16 preguntas de sus sistemas propios. Sin campo solo r2 (dolor constante y nocturno, sin estructura concreta).

| Sistema | Pregunta → estructuras |
|---|---|
| Vascular | r_v1 claudicación → arteria femoral + arteria poplítea · r_v2 TVP → venas del miembro inferior + vena poplítea · r_v3 quiste de Baker con pantorrilla → fosa poplítea + semimembranoso + gastrocnemio |
| Infecciosa | r1 artritis séptica, r_i2 infección reciente → art. rodilla · r_i3 bursitis prerrotuliana séptica → bursa prerrotuliana |
| Oncológico / hematológico | r3 cáncer o bulto → fémur + tibia · r4 hemartros tras golpe menor → art. rodilla |
| Traumático | ro_t1 golpe o caída sin poder cargar → rótula + tibia · ro_t2 aparato extensor → cuádriceps + rótula + tendón rotuliano · ro_t3 luxación de alta energía → arteria poplítea + art. rodilla · ro_t4 pie frío o dormido → arteria poplítea + nervio peroneo común · ro_t5 pie caído → nervio peroneo común + peroné · ro_t6 bloqueo (osteocondritis) → fémur + art. rodilla |
| Pediátrico | ro_p1 dolor sin traumatismo (explorar la cadera) → art. cadera + nervio obturador |

Las 29 URLs inglesas y las 19 españolas se abrieron con `curl` (2026-10): todas dan 200, sin redirección, con el título de la estructura. Slugs que no se deducen: `the-knee-joint`, `the-quadriceps-femoris-muscle`, `patellar-tendon` (no `patellar-ligament`), `iliotibial-band`, `gluteus-medius-and-minimus-muscles`, `tibiofibular-joints`, `common-fibular-nerve`.

Revisado por el usuario (2026-10).

## Codo

18 estructuras nuevas, 10 con versión en español; reutiliza bíceps braquial, húmero, plexo braquial, columna cervical y escalenos de hombro. Sin versión en español: radiocubital proximal, extensor radial corto del carpo, flexor radial del carpo, flexor largo del pulgar y flexor profundo de los dedos. Sin artículo propio, y enlazados a «Articulación del codo» con `nota`, porque el artículo los trata: el ligamento colateral cubital (12 menciones) y el complejo colateral lateral (9). Kenhub trata radio y cúbito en un solo artículo («Radio y cúbito»), que enlaza el olécranon; la cabeza del radio tiene artículo propio. El ligamento anular no lo tiene, pero lo trata el de la articulación radiocubital proximal (y el del codo). La bursa olecraniana solo se nombra una vez: la pregunta de infección enlaza la articulación del codo.

### Tests de la fase 4b

Los 63 tests (codo no tiene filas de «Gesto testigo»).

| Hipótesis | Tests → estructuras |
|---|---|
| co1 Epicondilalgia lateral | Cozen, Thomsen → extensor radial corto del carpo + húmero (epicóndilo) · prensión → extensor radial corto del carpo |
| co2 Epicondilalgia medial | los cuatro → pronador redondo + flexor radial del carpo |
| co3 Rigidez | movilidad activa y pasiva → art. codo |
| co4 Colateral cubital | los seis → colateral cubital |
| co5 Colateral lateral (IRPL) | los cinco → complejo colateral lateral |
| co6 Radiohumeral / plica | los seis → cabeza del radio + art. codo |
| co7 Rotura distal del bíceps | los tres → bíceps braquial |
| co8 Túnel cubital | todos → nervio cubital; la subluxación, además, húmero |
| co9 Túnel radial / interóseo posterior | los cinco → nervio radial + supinador |
| co10 Tríceps | los cuatro → tríceps braquial |
| co11 Pinzamiento posterior | los cuatro → radio y cúbito (olécranon) + art. codo |
| co12 Fractura de estrés del olécranon | los tres → radio y cúbito |
| co13 Síndrome del pronador / interóseo anterior | palpación y pronación resistida → pronador redondo + nervio mediano · debilidades → nervio mediano + flexor largo del pulgar + flexor profundo · neurodinámica → nervio mediano |
| co14 Pronación dolorosa | los dos → cabeza del radio + art. radiocubital proximal (ligamento anular) |
| co15 Codo de la liga infantil | los dos → húmero (epicóndilo medial) + colateral cubital |
| co16 Panner / osteocondritis | los dos → húmero (capítulo) + art. codo |

### Cribado de la fase 2

7 de las 12 preguntas de sus sistemas propios. Sin campo, por no tener una estructura concreta: co4a (Raynaud) y co4a_prog (su evolución), co_e2b (miastenia), co2 (dolor constante y nocturno) y co_e2a (debilidad proximal).

| Sistema | Pregunta → estructuras |
|---|---|
| Traumático | co_t1 prueba de extensión del codo → art. codo + cabeza del radio · co_t2 deformidad o mano fría → art. codo + arteria braquial + nervio mediano |
| Vascular / neurológica | co4a_uni Raynaud en una mano → arteria subclavia + escalenos (desfiladero) · co4b zona dormida → nervio cubital · co3 debilidad progresiva → plexo braquial + columna cervical |
| Infecciosa | co1 fiebre y calor → art. codo |
| Endocrino | co_e1 síntomas bilaterales → nervio mediano + nervio cubital |

Las 16 URLs inglesas y las 10 españolas se abrieron con `curl` (2026-10): todas dan 200, sin redirección, con el título de la estructura. La española de la arteria subclavia es `artieria-subclavia-anatomia`, con la errata del propio Kenhub. Slugs que no se deducen: `the-radius-and-the-ulna`, `head-of-radius`, `the-ulnar-nerve`, `the-median-nerve` (pero `radial-nerve`), `the-subclavian-artery`.

Revisado por el usuario (2026-10).

## Cervical

13 estructuras nuevas, 10 con versión en español; reutiliza columna cervical, plexo braquial, escalenos, costillas, nervios mediano, radial y cubital, bíceps y tríceps, y del cribado de hombro corazón, pulmones, pleura, nervio frénico y estómago. Sin versión en español: articulación atlantoaxial, semiespinoso de la cabeza y suboccipitales. La columna craneocervical (C0–C3, C1–C2) enlaza la articulación atlantoaxial, cuyo artículo trata también el ligamento transverso del atlas (30 menciones): por eso la artritis reumatoide, el síndrome de Down y la tortícolis de Grisel la enlazan.

### Tests de la fase 4b

37 de los 48 tests. Sin campo los genéricos: ① gesto testigo y ② medida objetiva (ce3/5, ce5/5, ce12/1, ce12/2, ce13/2, ce14/0), los factores pronósticos del latigazo (ce5/1 riesgo de evolución persistente, ce5/2 hiperalerta, ce5/3 hiperalgesia al frío), la tabla orientativa de cefaleas (ce4/4) y la fatiga en actividades funcionales (ce11/1).

| Hipótesis | Tests → estructuras |
|---|---|
| ce1 Disfunción articular | PAIVM C0–C3 → atlantoaxial + columna cervical · movilidad activa → columna cervical |
| ce2 Disfunción neuromuscular | flexión craneocervical → largo del cuello · reposicionamiento → columna cervical |
| ce3 Radiculopatía | Spurling → columna cervical + nervios espinales · ULNT1 → nervio mediano + plexo braquial · abducción del hombro → nervios espinales · reflejos → bíceps + tríceps · exploración neurológica → nervios espinales + plexo braquial · combinación de 4 ULNT → nervios mediano, radial y cubital |
| ce4 Cefalea cervicogénica | flexión-rotación → atlantoaxial · PAIVM C0–C3 → atlantoaxial + columna cervical · cluster → columna cervical + largo del cuello · examen manual alto → atlantoaxial + suboccipitales |
| ce5 Latigazo | movilidad activa, reposición articular → columna cervical |
| ce6 Debilidad cérvico-escapular | flexión → largo del cuello · extensión → semiespinoso + esplenio de la cabeza |
| ce7 Dolor crónico inespecífico | movilidad, reposicionamiento → columna cervical |
| ce8 Mielopatía | Hoffmann, clonus, marcha, hiperreflexia → médula espinal |
| ce9 Postura | cabeza adelantada → columna cervical · cifosis → vértebras torácicas |
| ce10 Primera costilla | palpación → costillas + escalenos · rotación ipsilateral → costillas |
| ce11 Fatiga | resistencia de flexores profundos → largo del cuello |
| ce12 Dolor radicular | ULNT1 → nervio mediano + plexo braquial · rasgos neuropáticos → nervios espinales + plexo braquial |
| ce13 Mareo cervicogénico | descartar lo vascular → arteria vertebral + carótida · error de reposición → columna cervical |
| ce14 Dolor idiopático | movilidad, examen segmentario → columna cervical · flexión-rotación → atlantoaxial · extensión-rotación → articulaciones cigapofisarias |

### Cribado de la fase 2

16 de las 20 preguntas de sus sistemas propios. Sin campo: cv1 (dolor nocturno), cv5 (pérdida de peso), cv_ar4 (cefalea de cambio brusco, que apunta a las arterias cerebrales, sin artículo concreto) y cv_in2 (rigidez y otras articulaciones).

| Sistema | Pregunta → estructuras |
|---|---|
| Cáncer | cv4 antecedente de cáncer → columna cervical |
| Cardiovascular | cv2 sudor y dolor torácico, cv_c2 dolor con el esfuerzo → corazón |
| Pulmonar | cv_p1 dolor al toser o respirar → pleura + nervio frénico · cv_p2 disnea → corazón + pulmones |
| Renal | cv3 esfínteres, cv_r2 dificultad para orinar → médula espinal |
| Gastrointestinal | cv_gi1 relación con la comida → esófago + estómago · cv_gi2 melena → estómago |
| Arterial / traumatismo | cv_ar1 dolor súbito distinto (disección) → arteria vertebral + carótida · cv_ar2 mareo con signos de tronco → arteria vertebral · cv_ar3 traumatismo → atlantoaxial + columna cervical |
| Médula / estructural | cv_n1 artritis reumatoide, Down, Klippel-Feil → atlantoaxial · cv_n2 distonía → esternocleidomastoideo · cv_n3 tortícolis de Grisel → atlantoaxial |
| Inflamatoria | cv_in1 febrícula y dolor continuo → columna cervical |

Las 13 URLs inglesas y las 10 españolas se abrieron con `curl` (2026-10): todas dan 200, sin redirección, con el título de la estructura. Slugs que no se deducen: `the-spinal-cord`, `zygapophyseal-joints`, `atlantoaxial-joint`, `common-carotid-artery`.

Revisado por el usuario (2026-10).

## Cadera

26 estructuras nuevas, 18 con versión en español; reutiliza articulación de la cadera, glúteo medio (el artículo trata también el menor), cuádriceps, fémur, nervio obturador, arterias femoral y poplítea, venas del miembro inferior, riñón y estómago. Sin versión en español: labrum acetabular, trocánter mayor, cuadrado femoral, isquiotibiales (artículo «Posterior thigh muscles»), aductores de la cadera y los nervios femorocutáneo lateral, ilioinguinal e iliohipogástrico. El ligamento redondo no tiene artículo propio: lo trata el de la articulación de la cadera, que es lo que enlaza ca12. Ovarios y útero van juntos en «Órganos reproductores femeninos» (el ovario no tiene artículo propio).

### Tests de la fase 4b

67 de los 74 tests. Sin campo los genéricos: longitud de paso (ca3/7), IMC >25 (ca13/3) y los cinco rasgos de la sensibilización central (ca15/0–4).

| Hipótesis | Tests → estructuras |
|---|---|
| ca1 Artrosis | criterio clínico, aducción, rotación interna, sentadilla profunda, ACR, apoyo monopodal → articulación de la cadera · debilidad de abductores → glúteo medio |
| ca2 Pinzamiento femoroacetabular | FADDIR, flexión-RI → articulación de la cadera + labrum · FABER, RI en neutro, dolor inguinal → articulación de la cadera · Thomas → iliopsoas + cuádriceps |
| ca3 Labrum | Arlington, Twist, FADDIR + FABER + EPR resistida, chasquido doloroso, flexión-RI, FADDIR agrupado → labrum · Thomas → iliopsoas + cuádriceps |
| ca4 Dolor trocantérico | palpación → glúteo medio + trocánter mayor · apoyo monopodal, abducción resistida, Trendelenburg, derotación externa → glúteo medio |
| ca5 Debilidad de abductores | Trendelenburg, dinamometría, paso lateral + tándem → glúteo medio |
| ca6 Control neuromuscular | sentadilla monopodal, step-down, marcha de Trendelenburg → glúteo medio |
| ca7 Glúteo profundo | estiramiento del piriforme, sedestación prolongada → piriforme + nervio ciático |
| ca8 Pinzamiento isquiofemoral | zancada larga → cuadrado femoral + tuberosidad isquiática |
| ca9 Tendinopatía de isquiotibiales | palpación → isquiotibiales + tuberosidad isquiática · fuerza → isquiotibiales |
| ca10 Sacroilíaca | compresión, Patrick, dolor bajo L5, cluster de Laslett, thigh thrust, prueba del dedo → articulación sacroilíaca |
| ca11 Lesión aguda de ingle | palpación, resistencia, estiramiento del grupo sospechoso → aductores + iliopsoas |
| ca12 Ligamento redondo e inestabilidad | log roll, movilidad aumentada, episodio de fallo → articulación de la cadera |
| ca13 Condropatía | cribado intraarticular + Thomas, dolor en reposo con síntomas mecánicos, rigidez → articulación de la cadera |
| ca14 Neuropatías | Tinel y neurodinámico del femorocutáneo → nervio femorocutáneo lateral · obturador → nervio obturador + aductores · arch and twist → nervios ilioinguinal, iliohipogástrico y genitofemoral · pudendo → nervio pudendo |
| ca16 Ingle, aductor | palpación + squeeze, estiramiento → aductores |
| ca17 Ingle, psoas ilíaco | palpación, flexión resistida, Thomas modificado → iliopsoas |
| ca18 Ingle, canal inguinal | dolor y palpación del canal, Valsalva → conducto inguinal · sit-up resistido → recto del abdomen + conducto inguinal · flexión resistida en Thomas → iliopsoas + conducto inguinal |
| ca19 Ingle, pubis | palpación de la sínfisis → sínfisis del pubis · resistencia abdominal y squeeze → sínfisis + recto del abdomen + aductores |

### Cribado de la fase 2

20 de las 21 preguntas de sus sistemas propios. Sin campo: ca_on3 (pérdida de peso o bulto nuevo, sin estructura concreta).

| Sistema | Pregunta → estructuras |
|---|---|
| Cáncer | c5 antecedente de cáncer, ca_on2 dolor constante y nocturno → hueso coxal + fémur · ca_on4 ganglio en la ingle → ganglios inguinales |
| Vascular | c2 claudicación → arteria femoral · ca_v2 TVP → venas del miembro inferior · ca_v3 isquemia en reposo → arterias femoral y poplítea |
| Urogenital | c3 orina → riñón + uréteres · ca_u2 dolor testicular o al orinar → próstata + testículos · ca_u3 torsión → testículos · ca_u4 relación con la regla → órganos reproductores femeninos |
| Gastrointestinal | c4 molestias abdominales → iliopsoas + intestino grueso · ca_gi2 melena o sangre → estómago + intestino grueso · ca_gi3 hernia → conducto inguinal + triángulo femoral |
| Óseo | ca_os1 fractura de estrés, ca_os2 osteonecrosis → fémur · ca_os3 epifisiolisis o avulsión → fémur + hueso coxal · ca_os4 cadera infantil → articulación de la cadera |
| Inflamatoria | ca_in1 artritis séptica, ca_in3 cirugía o infiltración previa → articulación de la cadera · ca_in2 artritis reumatoide o espondilitis → articulación de la cadera + sacroilíaca |

Las 26 URLs inglesas y las 18 españolas se abrieron con `curl` (2026-10): todas dan 200, sin redirección, con el título de la estructura. Slugs que no se deducen: `posterior-thigh-muscles`, `the-hip-adductors`, `the-sciatic-nerve`, `the-ureters`, `the-prostate-gland`, `the-testes`, `greater-trochanter-of-femur`, `musculo-piriforme-piramidal-de-la-pelvis`.

Revisado por el usuario (2026-10).
