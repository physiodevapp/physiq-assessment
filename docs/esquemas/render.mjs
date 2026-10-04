// Convierte docs/esquemas/<nombre>.html (generado por <nombre>.py) en PDF y PNG.
// Uso: node docs/esquemas/render.mjs arbol-lumbar   (necesita Playwright, como tests/smoke.mjs)
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { rmSync } from 'node:fs';
const require = createRequire(process.cwd() + '/');
let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = require('playwright')); }
const dir = dirname(fileURLToPath(import.meta.url));
const nombre = process.argv[2] || 'arbol-lumbar';
const html = join(dir, `${nombre}.html`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1587, height: 1123 } });
await p.goto('file://' + html);
await p.screenshot({ path: join(dir, `${nombre}.png`) });
await p.pdf({ path: join(dir, `${nombre}.pdf`), width: '420mm', height: '297mm', printBackground: true, pageRanges: '1' });
await b.close();
rmSync(html);
console.log(`${nombre}.pdf y ${nombre}.png generados`);
