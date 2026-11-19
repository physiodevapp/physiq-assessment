# App de sesión + Word anexo

Motor de la «App de sesión» de la skill `consulta-clinica` (sección 4 de `SKILL.md`): una página para seguir y registrar un plan de tratamiento durante la sesión (móvil, tablet u ordenador) que genera, al terminar, un Word anexo con la plantilla de la unidad.

| Archivo | Qué es |
|---|---|
| `plantilla.html` | La página: diseño, modos «Preparar» / «En sesión», navegación (chips, índice lateral, barra inferior), guardado en el dispositivo. Sin contenido clínico. |
| `anexo.js` | Genera el Word del anexo en el navegador a partir del `Documento_base.docx` de la unidad. |
| `construir.mjs` | Une plantilla, generador y plan, y comprueba el plan antes. Con `ia` en el plan, incrusta también el `ampliar-ia.js` de la raíz del repo (el de la app, no una copia). |
| `ejemplo-lumbar-caida.js` | Plan de referencia (dolor lumbar tras caída en un paciente mayor; genérico, no es un paciente real). |

La plantilla de la clínica **no** está en el repo: lleva el logo y los datos de la clínica, y la app la carga desde cada dispositivo («Cargar plantilla»).

## Construir

```
node construir.mjs <plan.js> <salida.html>           # cuerpo para publicar con la herramienta Artifact
node construir.mjs <plan.js> <salida.html> --local   # documento completo para abrir con doble clic
```

El artifact se publica con `capabilities: {downloads: true}` (sin ella, el botón Word no puede descargar). Fuera de claude.ai, la versión `--local` descarga el Word con el navegador.

## Formato de un plan

Un archivo que define `globalThis.PLAN`. Todo el contenido clínico va aquí; la plantilla no lleva nada del caso.

```js
globalThis.PLAN = {
  id: 'ejemplo-lumbar-caida', // minúsculas, números y guiones; clave del guardado en el dispositivo
  titulo: 'Sesión lumbar (ejemplo)',   // nombre de la página (2-4 palabras)
  nombre: 'Lumbar tras caída · ejemplo',// subtítulo de la barra; nunca el nombre del paciente
  sesiones: 4,                 // botones de número de sesión
  resumen: '…', tipo: '…',     // una línea cada uno: el caso y el plan (A/B, sesiones, minutos)
  ia: { contexto: 'el plan de tratamiento de …' },  // opcional: «✨ Ampliar con IA» (ver abajo); nunca datos del paciente

  condicion: {                 // opcional: condición de seguridad que reduce el plan
    corto: 'Fractura', titulo: 'Condición para aplicar este plan: …', pregunta: 'Fractura vertebral descartada',
    si: 'Sí, descartada', no: 'No o sin confirmar',
    siNo: 'Si no se puede descartar: …', urgencias: 'Urgencias hoy si …',
    reducido: 'Plan reducido: …', noAplicar: 'No aplicar: …', noAplicado: 'no aplicado: …',
    anexoSi: 'Sí: plan completo.', anexoNo: 'No (o sin confirmar): plan reducido.'
  },

  antes: {                     // preguntas que se contestan al preparar (antes de la sesión)
    titulo: 'Antes de empezar', corto: 'Antes', min: 5, sub: 'con la familia',
    items: [
      { id: 'a1', texto: 'Pregunta completa',
        opciones: ['…', '…'],              // respuestas rápidas (botones)
        multi: true, exclusivas: ['Ninguno'], // opcional: varias a la vez; las exclusivas desmarcan las demás
        alertas: { '…': 'Aviso en rojo si se elige esa opción' },
        nota: 'Etiqueta del «+ Nota»' }
    ]
  },

  bloques: [                   // los bloques de la sesión, en orden
    { id: 'b1', nombre: 'Reevaluación', corto: 'Reeval.', min: 5,
      fijo: true,                          // opcional: no se pliega (p. ej. el que lleva la red de seguridad)
      grupos: [{ titulo: 'a) …', items: [
        { id: 'b1i1', texto: 'Texto completo', corto: 'Una línea (≤ 60 caracteres)',
          completo: true,                  // opcional: se lee siempre entero (red de seguridad)
          soloSiCondicion: true }          // opcional: «No aplicar» si la condición no se cumple
      ] }] }
  ],

  medidas: [                   // se pintan dentro del bloque indicado
    { id: 'm1', bloque: 'b1', etiqueta: 'EVN en reposo', tipo: 'evn' },                       // 0-10
    { id: 'm2', bloque: 'b1', etiqueta: '…', tipo: 'opciones', opciones: ['…'], nota: '…', alertas: { '…': '…' } },
    { id: 'm3', bloque: 'b5', etiqueta: '… · final', tipo: 'evn', inicio: 'm1' }              // muestra el valor del inicio
  ],

  casa: { titulo: 'Programa para casa', sub: '…', nota: '…',
    ejercicios: [{ id: 'c1', nombre: '1. …', dosis: '…', como: '…', soloSiCondicion: true }] },

  progresion: { regla: '…', columnas: ['…'], filas: [{ n: 1, etiqueta: '1 · …', celdas: ['…'] }] },
  seguir: ['…'], durante: ['…'],
  comparar: { sesion: 4, filas: [{ id: 'k1', medida: '…', inicial: '…' }] }   // opcional
};
```

`construir.mjs` para con la lista de problemas si falta algo, si un `id` se repite, si una medida apunta a un bloque que no existe, si un texto corto pasa de 60 caracteres o si una alerta no corresponde a ninguna opción.

## Ampliar con IA (opcional)

Con `ia: { contexto }` en el plan, la app lleva el «✨ Ampliar con IA» de PhysiQ-Assessment (`ampliar-ia.js`): al final de cada texto del plan, «✨ IA ↗ ▾», y al seleccionar texto, una barra «✨ Ampliar en … ↗». La ▾ elige Perplexity (por defecto), Google en modo IA o Claude, con la ventaja de cada una, y la elección se recuerda en el dispositivo (la misma clave que la app). El prompt es el de la app con el enfoque práctico: «Soy fisioterapeuta. Explícame con más detalle este fragmento sobre <contexto>, apartado «<sección>»: «…». Qué quiere decir en la práctica clínica…», más la frase de fuentes y «Cita las fuentes con enlace.».

- **Solo en «Preparar».** En «En sesión» no hay enlaces ni barra (`body.ia-off`, y sin `data-ia-ctx`).
- **Solo los textos del plan:** «Antes de tratar», las preguntas de «Antes», los ítems de los bloques, el «cómo» de los ejercicios de casa, la progresión (regla, celdas), «Seguir o cambiar» y «Durante todo el mes». **Nunca** lo que se escribe o se marca (paciente, profesional, notas, medidas, respuestas) ni el aviso «No aplicar» (`.ia-excluir`). `contexto` sale en cada pregunta: describe el caso sin nada que identifique al paciente (`construir.mjs` rechaza «paciente:» o «nombre:»).
- Es el mismo archivo que la app: un cambio de prompt o destinos en `ampliar-ia.js` llega al reconstruir. `tests/unit.js` comprueba que sigue pudiéndose incrustar. En el visor de claude.ai la página va en un iframe, por eso se llama con `initAmpliarIA({ enIframe: true, arriba: '.barra', abajo: '.barra-pasos' })`.
- Sin `ia`, no se incrusta nada.

## Lo que guarda el dispositivo

Registro de la sesión, modo, secciones plegadas, nombre del profesional y la plantilla: solo en el navegador de ese dispositivo (`localStorage` e IndexedDB), nunca en claude.ai. Se puede borrar (navegación privada, borrar datos del navegador): lo que vale es el Word descargado.

## Comprobado (2026-11)

Navegación (chips, índice, barra inferior, títulos de sección, scroll a mano) en móvil 320/390 px, tablet 820 px y ordenador 1280 px; arranque con datos guardados; Word con la plantilla de la unidad (casillas que se marcan en Word; en Google Docs el logo de la cabecera se descoloca, en Word no).
