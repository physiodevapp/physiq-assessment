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
