// ============================================================
// Modo guía con grabadora externa (docs/modo-guia.md): textos.
// Solo datos. Lo pinta app.js; la lógica pura está en lib/modo-guia.js.
// ============================================================

// Campos de texto de la fase 1 y 3 que en modo guía no se teclean: en su lugar
// va la frase para decir en voz alta (decisión 4). `id` = el <textarea>; la
// respuesta sale solo del audio. `ancla`: además se sugiere decir el resultado
// en voz alta (decisión 5). Las frases las revisa el fisio (paso 3 del plan) y se dicen de «tú» al paciente (decisión del fisio, 2026-10).
// `ia`: grupo del informe con IA al que va la respuesta (los de GRUPOS_FORMULARIO
// de lib/informe-narrativo.js, más 'exploracion'); `iaTexto`: cómo se nombra en el
// prompt cuando la frase no es una pregunta al paciente.
export const VERBALES = {
  motivoConsulta: { frase: '¿Qué te trae por aquí? ¿Qué te pasa y desde cuándo?', ia: 'historia' },
  signoComparable: {
    frase: 'Dilo en voz alta cuando lo encuentres: el movimiento que reproduce sus síntomas.',
    ancla: 'Ej.: «Flexión de hombro a 100º con dolor 6 sobre 10»',
    ia: 'exploracion',
    iaTexto: 'Signo comparable: el movimiento que reproduce los síntomas (lo dice el fisioterapeuta durante la exploración)'
  },
  cirIntervencion: { frase: '¿Qué operación te hicieron y cuándo?', ia: 'historia', soloPosq: true },
  cirRestricciones: { frase: '¿Qué restricciones o protocolo te ha dado el cirujano?', ia: 'historia', soloPosq: true }
};

export const TEXTOS_GUIA = {
  // Decisión 13: el consentimiento se pide al empezar a grabar, para que quede en el audio
  consentimiento: 'Al empezar a grabar, informa al paciente y pídele su consentimiento: así queda en el audio.',
  // Tarjeta «🎙 Informe con IA» en modo guía
  informeConAudio: 'Registro con la app como guía: los textos libres (motivo, historia, antecedentes, signo comparable…) no se escribieron. El informe los toma del audio de la consulta.',
  informeSinAudio: 'Registro con la app como guía y sin audio: el informe solo tendrá lo que marcaste con botones. Lo que se preguntó de palabra no constará. Adjunta el audio de la grabadora con «📎 Adjuntar audio».',
  preguntado: 'Preguntado',
  anclaTest: 'Dilo en voz alta al marcarlo',
  cambioAGuia: 'Las respuestas «NO» que no marcaste a propósito se quedan sin responder: no se sabe si se preguntaron. Las respuestas «SÍ» se mantienen.',
  cambioATeclado: 'Las preguntas sin responder pasarán a «NO», como en el modo con teclado.'
};
