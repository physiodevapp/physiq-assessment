# App de sesión + Word anexo

Motor de la «App de sesión» de la skill `consulta-clinica` (sección 4 de `SKILL.md`): una página para seguir y registrar un plan de tratamiento durante la sesión (móvil, tablet u ordenador) que genera, al terminar, un Word anexo con la plantilla de la unidad.

| Archivo | Qué es |
|---|---|
| `plantilla.html` | La página: diseño, modos «Preparar» / «En sesión», navegación (chips, índice lateral, barra inferior), guardado en el dispositivo. Sin contenido clínico. |
| `anexo.js` | Genera el Word del anexo en el navegador a partir del `Documento_base.docx` de la unidad. |
| `construir.mjs` | Une plantilla, generador y plan, y comprueba el plan antes. |
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

## Lo que guarda el dispositivo

Registro de la sesión, modo, secciones plegadas, nombre del profesional y la plantilla: solo en el navegador de ese dispositivo (`localStorage` e IndexedDB), nunca en claude.ai. Se puede borrar (navegación privada, borrar datos del navegador): lo que vale es el Word descargado.

## Comprobado (2026-11)

Navegación (chips, índice, barra inferior, títulos de sección, scroll a mano) en móvil 320/390 px, tablet 820 px y ordenador 1280 px; arranque con datos guardados; Word con la plantilla de la unidad (casillas que se marcan en Word; en Google Docs el logo de la cabecera se descoloca, en Word no).
