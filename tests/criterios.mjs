// Fase 4b, «¿Por qué?» de los tests (docs/razonamiento-tests.md): al recortar
// el `criterio` de un test, lo que sobra se mueve a `razonamiento.detalle`
// sin reescribirlo. Esta comprobación lo garantiza: cada trozo del criterio
// original (instantánea en tests/fixtures/criterios-4b.json) tiene que seguir
// estando, literal, en el criterio nuevo o en el detalle. Lo que se retira a
// propósito (notas de mantenimiento, que pasan a un comentario en data/) va
// en `retiradas` de la instantánea, con el texto, para que quede constancia.

// Trozos: se corta tras «.», «;» o «:» seguidos de espacio. Cortar de más no
// importa (cada trozo sigue siendo literal); cortar de menos obligaría a
// mover juntas dos frases.
export function trozos(texto) {
  return String(texto || '').split(/(?<=[.;:])\s+/).map(s => s.trim()).filter(Boolean);
}

// Al mover frases se permite cambiar la mayúscula inicial y la puntuación
// final («…30°:» → «…30°.»): se compara sin distinguir mayúsculas y sin el
// signo final de cada trozo.
const norm = s => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
const nucleo = f => norm(f).replace(/[.;:,]$/, '');

export const claveTest = (hId, t) => `${hId}|${t.name}`;

// Texto actual de un test: criterio + detalle del razonamiento.
export function textoTest(t) {
  return norm(`${t.criterio || ''} ${t.razonamiento?.detalle || ''}`);
}

export function instantanea(HYPOTHESES, anterior = {}) {
  const out = {};
  for (const [hId, h] of Object.entries(HYPOTHESES)) {
    h.tests.forEach(t => {
      const k = claveTest(hId, t);
      const retiradas = anterior[k]?.retiradas || [];
      out[k] = { frases: [...trozos(t.criterio), ...trozos(t.razonamiento?.detalle)].filter(f => !retiradas.includes(f)) };
      if (retiradas.length) out[k].retiradas = retiradas;
    });
  }
  return out;
}

// Problemas: tests sin instantánea, instantáneas sin test y frases perdidas.
export function frasesPerdidas(HYPOTHESES, snap) {
  const perdidas = [], sinSnap = [], vistos = new Set();
  for (const [hId, h] of Object.entries(HYPOTHESES)) {
    h.tests.forEach(t => {
      const k = claveTest(hId, t);
      vistos.add(k);
      const s = snap[k];
      if (!s) { sinSnap.push(k); return; }
      const texto = textoTest(t);
      for (const f of s.frases) if (!(s.retiradas || []).includes(f) && !texto.includes(nucleo(f))) perdidas.push({ test: k, frase: f });
    });
  }
  const sobrantes = Object.keys(snap).filter(k => !vistos.has(k));
  return { perdidas, sinSnap, sobrantes };
}
