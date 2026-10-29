// Código QR mínimo para los esquemas imprimibles (sin dependencias, como lib/zip.js):
// modo byte (UTF-8), corrección de errores M (~15 %), versiones 1–10 (hasta 213
// bytes), la máscara con menos penalización. Algoritmo según ISO/IEC 18004,
// con la misma estructura que el generador de referencia de Nayuki (MIT).
//   qrMatriz(texto)    → matriz de booleanos (true = módulo oscuro)
//   qrSVG(texto, px)   → <svg> con 4 módulos de margen

// Nivel M, por versión (índice 0 sin usar)
const ECC_POR_BLOQUE = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26];
const NUM_BLOQUES = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
const BITS_FORMATO_M = 0;

function modulosDatos(v) {
  let r = (16 * v + 128) * v + 64;
  if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; }
  return r;
}
const codewordsDatos = v => Math.floor(modulosDatos(v) / 8) - ECC_POR_BLOQUE[v] * NUM_BLOQUES[v];

// Reed-Solomon sobre GF(256), polinomio 0x11D
function mul(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; }
  return z & 0xFF;
}
function divisor(grado) {
  const r = new Array(grado).fill(0); r[grado - 1] = 1;
  let raiz = 1;
  for (let i = 0; i < grado; i++) {
    for (let j = 0; j < grado; j++) { r[j] = mul(r[j], raiz); if (j + 1 < grado) r[j] ^= r[j + 1]; }
    raiz = mul(raiz, 0x02);
  }
  return r;
}
function resto(datos, div) {
  const r = new Array(div.length).fill(0);
  for (const b of datos) {
    const f = b ^ r.shift(); r.push(0);
    div.forEach((c, i) => { r[i] ^= mul(c, f); });
  }
  return r;
}

function codificar(texto) {
  const bytes = [...new TextEncoder().encode(texto)];
  let v = 1;
  for (; v <= 10; v++) {
    const bitsCuenta = v <= 9 ? 8 : 16;
    if (4 + bitsCuenta + bytes.length * 8 <= codewordsDatos(v) * 8) break;
  }
  if (v > 10) throw new Error('Texto demasiado largo para el QR');
  const bits = [];
  const poner = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
  poner(0b0100, 4); poner(bytes.length, v <= 9 ? 8 : 16);
  bytes.forEach(b => poner(b, 8));
  const cap = codewordsDatos(v) * 8;
  poner(0, Math.min(4, cap - bits.length));
  poner(0, (8 - bits.length % 8) % 8);
  for (let p = 0xEC; bits.length < cap; p ^= 0xEC ^ 0x11) poner(p, 8);
  const datos = [];
  for (let i = 0; i < bits.length; i += 8) datos.push(parseInt(bits.slice(i, i + 8).join(''), 2));
  // Bloques con su corrección de errores, entrelazados
  const nb = NUM_BLOQUES[v], ecc = ECC_POR_BLOQUE[v], brutos = Math.floor(modulosDatos(v) / 8);
  const cortos = nb - brutos % nb, largoCorto = Math.floor(brutos / nb), div = divisor(ecc);
  const bloques = [];
  for (let i = 0, k = 0; i < nb; i++) {
    const d = datos.slice(k, k + largoCorto - ecc + (i < cortos ? 0 : 1)); k += d.length;
    const e = resto(d, div);
    if (i < cortos) d.push(0);
    bloques.push(d.concat(e));
  }
  const final = [];
  for (let i = 0; i < bloques[0].length; i++)
    bloques.forEach((b, j) => { if (i !== largoCorto - ecc || j >= cortos) final.push(b[i]); });
  return { v, final };
}

export function qrMatriz(texto) {
  const { v, final } = codificar(texto);
  const n = v * 4 + 17;
  const m = Array.from({ length: n }, () => new Array(n).fill(false));
  const fn = Array.from({ length: n }, () => new Array(n).fill(false));
  const fijar = (x, y, osc) => { m[y][x] = osc; fn[y][x] = true; };
  // Patrones fijos: temporización, buscadores, alineación, formato, versión
  for (let i = 0; i < n; i++) { fijar(6, i, i % 2 === 0); fijar(i, 6, i % 2 === 0); }
  for (const [cx, cy] of [[3, 3], [n - 4, 3], [3, n - 4]])
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx, y = cy + dy, d = Math.max(Math.abs(dx), Math.abs(dy));
      if (x >= 0 && x < n && y >= 0 && y < n) fijar(x, y, d !== 2 && d !== 4);
    }
  if (v > 1) {
    const na = Math.floor(v / 7) + 2, paso = Math.ceil((v * 4 + 4) / (na * 2 - 2)) * 2;
    const pos = [6];
    for (let p = n - 7; pos.length < na; p -= paso) pos.splice(1, 0, p);
    pos.forEach((y, i) => pos.forEach((x, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === na - 1) || (i === na - 1 && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) fijar(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }));
  }
  const formato = mascara => {
    const d = (BITS_FORMATO_M << 3) | mascara;
    let r = d; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    const b = ((d << 10) | r) ^ 0x5412, bit = i => ((b >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) fijar(8, i, bit(i));
    fijar(8, 7, bit(6)); fijar(8, 8, bit(7)); fijar(7, 8, bit(8));
    for (let i = 9; i < 15; i++) fijar(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) fijar(n - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) fijar(8, n - 15 + i, bit(i));
    fijar(8, n - 8, true);
  };
  formato(0);
  if (v >= 7) {
    let r = v; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
    const b = (v << 12) | r;
    for (let i = 0; i < 18; i++) { const o = ((b >>> i) & 1) === 1, a = n - 11 + i % 3, c = Math.floor(i / 3); fijar(a, c, o); fijar(c, a, o); }
  }
  // Datos en zigzag de dos columnas, de abajo arriba y vuelta
  let i = 0;
  for (let der = n - 1; der >= 1; der -= 2) {
    if (der === 6) der = 5;
    for (let vert = 0; vert < n; vert++) for (let j = 0; j < 2; j++) {
      const x = der - j, arriba = ((der + 1) & 2) === 0, y = arriba ? n - 1 - vert : vert;
      if (!fn[y][x] && i < final.length * 8) { m[y][x] = ((final[i >>> 3] >>> (7 - (i & 7))) & 1) === 1; i++; }
    }
  }
  const CONDICION = [
    (x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, x => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => (x * y) % 2 + (x * y) % 3 === 0,
    (x, y) => ((x * y) % 2 + (x * y) % 3) % 2 === 0, (x, y) => ((x + y) % 2 + (x * y) % 3) % 2 === 0,
  ];
  const aplicar = k => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!fn[y][x] && CONDICION[k](x, y)) m[y][x] = !m[y][x]; };
  let mejor = 0, menor = Infinity;
  for (let k = 0; k < 8; k++) {
    aplicar(k); formato(k);
    const p = penalizacion(m);
    if (p < menor) { menor = p; mejor = k; }
    aplicar(k);   // deshacer (XOR)
  }
  aplicar(mejor); formato(mejor);
  return m;
}

// Penalización de una máscara (reglas 1–4 de la norma)
function penalizacion(m) {
  const n = m.length; let p = 0;
  const lineas = [];
  for (let y = 0; y < n; y++) lineas.push(m[y]);
  for (let x = 0; x < n; x++) lineas.push(m.map(f => f[x]));
  const patron = [true, false, true, true, true, false, true];
  for (const l of lineas) {
    let corrida = 1;
    for (let i = 1; i <= n; i++) {
      if (i < n && l[i] === l[i - 1]) corrida++;
      else { if (corrida >= 5) p += 3 + corrida - 5; corrida = 1; }
    }
    for (let i = 0; i + 7 <= n; i++) {
      if (!patron.every((b, k) => l[i + k] === b)) continue;
      const claroAntes = i >= 4 && [1, 2, 3, 4].every(k => !l[i - k]);
      const claroDespues = i + 11 <= n && [7, 8, 9, 10].every(k => !l[i + k]);
      if (claroAntes || claroDespues) p += 40;
    }
  }
  for (let y = 0; y + 1 < n; y++) for (let x = 0; x + 1 < n; x++) {
    const c = m[y][x];
    if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3;
  }
  const oscuros = m.flat().filter(Boolean).length, total = n * n;
  p += Math.floor(Math.abs(oscuros * 20 - total * 10) / total) * 10;
  return p;
}

export function qrSVG(texto, px = 72) {
  const m = qrMatriz(texto), n = m.length, borde = 4, t = n + borde * 2;
  let d = '';
  m.forEach((fila, y) => fila.forEach((osc, x) => { if (osc) d += `M${x + borde} ${y + borde}h1v1h-1z`; }));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t} ${t}" width="${px}" height="${px}" shape-rendering="crispEdges"><rect width="${t}" height="${t}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}
