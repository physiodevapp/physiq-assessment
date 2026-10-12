// ============================================================
// PhysiQ-Assessment · data/tejidos.js
// Tiempos de recuperación de tejidos (consulta desde la cabecera, ⏱)
// ============================================================
//
// Contenido clínico, sin lógica: lo pinta lib/tejidos.js en el panel
// «Tiempos de recuperación» (abrirTiemposTejido(), app.js). Solo consulta: no
// lo lee ningún algoritmo, ni el payload, ni los resúmenes, ni el informe con
// IA. Diseño y decisiones: docs/tiempos-tejido.md.
//
// Punto de partida: la tabla «Tiempos de Tejido» de physiq-wiki (adaptada de
// Snyder-Mackler et al., «Developing Treatment Pathways», 2012), corregida:
//   - una sola gravedad (color) por fila: en el wiki la versión de escritorio
//     y la de móvil pintaban distinto las filas de grado III;
//   - «Tendinopatía / Ruptura» separada en dos filas;
//   - la franja de fases de reparación, nueva.
// Lo que no sale de esa fuente lleva `pendiente: true` (o `fuentes: []` en la
// franja de fases) y la app lo marca «pendiente de fuente» hasta que se
// revise con una fuente leída (docs/tiempos-tejido.md, «Pendiente»).
//
// Esquema:
//   columnas[]  { etiqueta, corta, hasta }  — eje NO lineal, como en el wiki;
//               `hasta` = último día que cubre la columna (bordes contiguos:
//               la primera empieza en el día 0 y cada una en el `hasta` de la
//               anterior). Sirve para colocar la franja de fases y la línea «hoy».
//   gravedades  { <id>: etiqueta }  — color de la barra (--tej-<id>, styles.css)
//   grupos[]    { tejido, filas[] }
//     fila      { id, nombre, desde, hasta, gravedad, fuentes[], nota?, pendiente? }
//               `desde`/`hasta` = índices de columna (inclusive)
//   fases[]     { id, nombre, desdeDia, hastaDia, fuentes[] } — franja general
//               de reparación de tejido blando, en días sobre el mismo eje
//   fuentes     claves de data/referencias.js (las cuenta tests/referencias.mjs)

export const TIEMPOS_TEJIDO = {
  columnas: [
    { etiqueta: '1–3 días', corta: '1–3d', hasta: 3 },
    { etiqueta: '4–14 días', corta: '4–14d', hasta: 14 },
    { etiqueta: '3–4 semanas', corta: '3–4s', hasta: 28 },
    { etiqueta: '5–8 semanas', corta: '5–8s', hasta: 56 },
    { etiqueta: '2–3 meses', corta: '2–3m', hasta: 91 },
    { etiqueta: '3–6 meses', corta: '3–6m', hasta: 182 },
    { etiqueta: '6 meses–1 año', corta: '6m–1a', hasta: 365 },
    { etiqueta: '2 años', corta: '2a', hasta: 730 },
  ],

  gravedades: {
    minima: 'Mínima',
    leve: 'Leve',
    moderada: 'Moderada',
    grave: 'Grave / reconstrucción',
  },

  grupos: [
    {
      tejido: 'Tendón',
      filas: [
        {
          id: 'tendinopatia', nombre: 'Tendinopatía', desde: 2, hasta: 5, gravedad: 'moderada',
          fuentes: ['Snyder-Mackler 2012'],
          nota: 'No es un plazo de cicatrización: orienta el tiempo de adaptación a la carga. En la fuente comparte fila con la rotura.',
        },
        {
          id: 'tendon_rotura', nombre: 'Rotura / reparación de tendón', desde: 4, hasta: 6, gravedad: 'grave',
          fuentes: [], pendiente: true,
          nota: 'Separada de la tendinopatía; el rango no sale de la fuente de la tabla.',
        },
      ],
    },
    {
      tejido: 'Músculo',
      filas: [
        { id: 'doms', nombre: 'Dolor muscular tardío (DOMS)', desde: 0, hasta: 0, gravedad: 'minima', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'musculo_g1', nombre: 'Rotura grado I', desde: 1, hasta: 2, gravedad: 'leve', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'musculo_g2', nombre: 'Rotura grado II', desde: 2, hasta: 3, gravedad: 'moderada', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'musculo_g3', nombre: 'Rotura grado III', desde: 2, hasta: 4, gravedad: 'grave', fuentes: ['Snyder-Mackler 2012'] },
      ],
    },
    {
      tejido: 'Ligamento',
      filas: [
        { id: 'ligamento_g1', nombre: 'Esguince grado I', desde: 1, hasta: 2, gravedad: 'leve', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'ligamento_g2', nombre: 'Esguince grado II', desde: 2, hasta: 4, gravedad: 'moderada', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'ligamento_g3', nombre: 'Esguince grado III', desde: 3, hasta: 5, gravedad: 'grave', fuentes: ['Snyder-Mackler 2012'] },
        { id: 'injerto', nombre: 'Injerto (reconstrucción)', desde: 4, hasta: 6, gravedad: 'grave', fuentes: ['Snyder-Mackler 2012'] },
      ],
    },
    {
      tejido: 'Hueso',
      filas: [
        { id: 'fractura', nombre: 'Fractura', desde: 2, hasta: 5, gravedad: 'moderada', fuentes: ['Snyder-Mackler 2012'] },
      ],
    },
  ],

  // Franja general de reparación de tejido blando (orientativa; los límites
  // se solapan en la realidad). Pendiente de fuente leída.
  fases: [
    { id: 'inflamatoria', nombre: 'Inflamatoria', desdeDia: 0, hastaDia: 5, fuentes: [] },
    { id: 'proliferativa', nombre: 'Proliferativa', desdeDia: 5, hastaDia: 21, fuentes: [] },
    { id: 'remodelacion', nombre: 'Remodelación', desdeDia: 21, hastaDia: 365, fuentes: [] },
  ],

  notas: [
    'Rangos orientativos: dependen de la edad, de las enfermedades y fármacos del paciente (diabetes, tabaco, corticoides…) y de la carga que se aplique.',
    'El dolor y la función no siguen por fuerza el calendario del tejido: el paciente puede estar listo antes o seguir con síntomas después.',
    'Paciente posquirúrgico: manda el protocolo del cirujano.',
  ],

  fuente: 'Adaptado de Snyder-Mackler et al., «Developing Treatment Pathways», 2012 (tabla de physiq-wiki).',
};
