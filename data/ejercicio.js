// ============================================================
// PhysiQ-Assessment · data/ejercicio.js
// Contenido de la guía «Efectos del ejercicio» de la cabecera
// (docs/efectos-ejercicio.md). Un bloque por tema, no por molécula. Solo lleva
// `apartados` un bloque escrito con fuentes leídas en la sesión y revisado por
// el usuario; los demás se listan como pendientes.
//
// Límites (docs/efectos-ejercicio.md): solo lectura; nunca una regla de
// dosificación automática; nunca sustituye a un tratamiento médico; nada de
// esto llega al payload, los resúmenes ni el prompt del informe con IA.
//
// Esquema de un bloque con contenido:
//   { id, titulo, resumen,
//     apartados: {
//       que:       [{ t, nivel }],   // qué ocurre
//       evidencia: [{ t, nivel }],   // hasta dónde llega lo demostrado
//       consulta:  [{ t, nivel }],   // qué cambia en la dosis o la decisión (solo si una fuente leída lo dice)
//       paciente:  [{ t, apoya: [i, …] }],   // para explicárselo; `apoya` = índices de `evidencia`
//       detalle?:  string | string[] },      // «Ampliar ▾»
//     fuentes: ['<clave de data/referencias.js>', …] }
// `nivel` es una clave de NIVELES_EJERCICIO. Una frase de `paciente` solo se
// apoya en afirmaciones de `evidencia` con nivel 'clinico' (decisión 4);
// `problemasBloque()` (lib/ejercicio.js) lo comprueba y un test lo exige.
// Las citas dentro de la frase («(Naugle 2012)») se pintan como botones.
// ============================================================

// Tres niveles (decisión 3 de docs/efectos-ejercicio.md). Lo visto solo en
// animales o in vitro es 'mecanismo' y la frase lo dice.
export const NIVELES_EJERCICIO = {
  clinico: {
    corto: 'Clínico',
    explicacion: 'Efecto medido en personas sobre un resultado que importa (dolor, función).',
  },
  mecanismo: {
    corto: 'Mecanismo',
    explicacion: 'Solo el mecanismo (una molécula en sangre, un cambio en el tejido), sin efecto clínico demostrado. Si solo se ha visto en animales o in vitro, la frase lo dice.',
  },
  discutido: {
    corto: 'Discutido',
    explicacion: 'Fuentes leídas que se contradicen: se dicen las dos.',
  },
};

export const APARTADOS_EJERCICIO = [
  { id: 'que', titulo: 'Qué ocurre' },
  { id: 'evidencia', titulo: 'Hasta dónde llega lo demostrado' },
  { id: 'consulta', titulo: 'Qué cambia en la consulta' },
  { id: 'paciente', titulo: 'Para explicárselo al paciente' },
];

// Los cinco bloques, en orden de trabajo. `resumen` es solo la pista de qué
// cubrirá; no es contenido (cada frase saldrá de una fuente leída).
export const BLOQUES_EJERCICIO = [
  { id: 'hipoalgesia', titulo: 'Hipoalgesia inducida por el ejercicio',
    resumen: 'Ejercicio local y a distancia, qué pasa en el dolor crónico y con la sensibilización central, y qué implica para la dosis y los brotes' },
  { id: 'mecanotransduccion', titulo: 'Carga y adaptación del tejido (mecanotransducción)',
    resumen: 'Tendón, hueso, cartílago y músculo: cómo la carga se convierte en adaptación y por qué el reposo absoluto no repara' },
  { id: 'antiinflamatorio', titulo: 'Efecto antiinflamatorio sistémico',
    resumen: 'La IL-6 que libera el músculo al contraerse, su diferencia con la de la inflamación, y qué se sabe en dolor musculoesquelético' },
  { id: 'mioquinas', titulo: 'El músculo como órgano endocrino: otras mioquinas',
    resumen: 'Concepto y estado real de cada mioquina; puede quedar como párrafo del bloque anterior si sus fuentes dan casi solo mecanismo' },
  { id: 'centrales', titulo: 'Efectos centrales',
    resumen: 'Sueño, estado de ánimo y autoeficacia' },
];

export const TEXTOS_EJERCICIO = {
  intro: 'Qué hace el ejercicio en el cuerpo y hasta dónde llega lo que se sabe. Sirve para decidir la dosis y para explicárselo al paciente sin prometer más de lo demostrado.',
  limites: 'Es una guía de lectura: no dosifica por ti, no cambia el plan y no sustituye a un tratamiento médico. Cada afirmación lleva su nivel de evidencia.',
  nivelesTitulo: 'Nivel de cada afirmación',
  pendientesTitulo: 'Pendientes de fuentes revisadas',
  pendientesNota: 'Se escriben de uno en uno, solo con fuentes leídas por completo.',
  pie: 'Contenido de apoyo para el fisioterapeuta. No se guarda ni se comparte con el informe.',
};
