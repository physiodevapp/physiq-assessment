# «Anatomía» de los tests de la fase 4b (enlaces a Kenhub)

Decisión del usuario (2026-10): poder repasar la anatomía de lo que carga cada test sin salir del flujo de la valoración. Estado por región: `MIGRATION_PLAN.md`, **Fase K**. Hombro es el piloto. **Una región por sesión** y revisión clínica del usuario antes de `main`.

## Qué es

Debajo de la fuente de cada test de la fase 4b hay una línea «ANATOMÍA Supraespinoso ↗ · Bursa subacromial ↗ · …». Cada enlace abre en una pestaña nueva el artículo de esa estructura en la biblioteca de Kenhub: **en español si Kenhub lo tiene y, si no, en inglés**, con una marca «EN» junto al nombre y «(sin versión en español)» en el `title` (decisión del usuario, 2026-10). El panel «Ampliar →» del test repite la lista en una sección «Anatomía (Kenhub)», entre «En detalle» y «Fuentes».

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

**Código** (`phase4b.js`): `enlacesAnatomia(test)` → `[{ nombre, url, nota, ingles }]` (`url` en español si hay `kenhubEs`; si no, en inglés con `ingles: true`). `anatomiaTestHTML(test)` pinta la línea de la tarjeta y `abrirRazonamientoTest()` añade la sección del panel. Estilos: `.test-anat`, `.anat-enlace`, `.anat-idioma` (la marca «EN») y `.razon-anatomia` en `styles.css`. En pantalla táctil los enlaces llevan 6 px de relleno vertical para que sean más fáciles de tocar.

## Procedimiento por región

1. **Listar los tests de la región** con su índice:
   ```
   node -e "import('./data/<region>.js').then(m=>{for(const [id,h] of Object.entries(m.hypotheses)){console.log(id,h.name);h.tests.forEach((t,i)=>console.log('  ',i,t.name))}})"
   ```
2. **Decidir las estructuras de cada test**: qué tejido carga, comprime o explora según su `criterio` y su `razonamiento`. Si un test no tiene una estructura clara, se deja sin campo.
3. **Comprobar cada slug nuevo** antes de añadirlo. `www.kenhub.com` está en los *Allowed domains* del entorno (2026-10), así que basta con `curl -sSL -o pagina.html -w "%{http_code} %{url_effective}" -A "Mozilla/5.0" https://www.kenhub.com/en/library/anatomy/<slug>`: tiene que dar 200 sin redirección a otra página, y el `<title>` tiene que ser el de la estructura. La versión en español sale del `hreflang="es"` de esa misma página (`grep -oE '<link[^>]+hreflang="es"[^>]*>' pagina.html`): si existe, se abre igual con `curl` y su slug va a `kenhubEs`; si no, la estructura se queda solo con `kenhub`. Si `curl` no llega, se puede buscar en el índice web, restringido a `kenhub.com`, que la URL exacta aparece como artículo de la biblioteca. **Nunca se inventa un slug**: si no se encuentra el artículo propio, se enlaza el de la estructura que lo contiene, con `nota`, como el labrum.
4. **Añadir** las estructuras nuevas a `ESTRUCTURAS` (agrupadas bajo un comentario con la región) y el campo `anatomia` a los tests. Para muchos tests compensa un script de una sola vez que inserte `anatomia: [...]` detrás del `name` de cada test por hipótesis e índice, y que compruebe el resultado importando el módulo.
5. **Tests**:
   - `node tests/unit.js`, tema «anatomía»: claves existentes, sin artículo repetido dentro de un test, ninguna estructura sin usar, nada en payload, resúmenes ni prompt. Al terminar la región, se añade su lista de tests sin `anatomia` como el test del piloto («hombro… salvo los genéricos»), para que un test nuevo de la región no se quede sin anatomía sin que nadie lo vea.
   - `node tests/smoke.mjs --solo anatomia`: la sección comprueba hombro y no hace falta tocarla por región.
6. **Revisión del usuario**: la tabla de la región en la Fase K con las estructuras de cada test. Después, a `main`.

`data/anatomia.js` entra en el despliegue con `cp data/*.js` (`deploy-to-hub.yml`), y el smoke test lo incluye en su comprobación de módulos.

## Hombro (piloto)

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
