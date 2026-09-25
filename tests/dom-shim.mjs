'use strict';
// ── DOM shim ─────────────────────────────────────────────────────────────────
// Shared by tests/unit.js and tests/gen-cif-snapshot.mjs — anything that
// `await import()`s app.js/phase4.js/phase4b.js needs this in place first,
// since those touch `document`/`window` at module top level (e.g. app.js's
// _initHubIntegration() call). A static `import './dom-shim.mjs'` at the top
// of the importing file runs this before any other code in that file,
// including its own later `await import(...)` calls.
function makeEl() {
  return {
    className: '', textContent: '', innerHTML: '', id: '',
    style: { cssText: '' },
    classList: { contains: () => false, add() {}, remove() {}, toggle() {} },
    querySelectorAll: () => [],
    querySelector:    () => null,
    closest:          () => null,
    addEventListener: () => {},
    getAttribute:     () => null,
    setAttribute:     () => {},
    remove:           () => {},
    appendChild:      () => {},
  };
}

// `window` IS `globalThis`: modules do `window.x = y` (or `Object.assign(window, {...})`)
// to expose things for inline onclick/oninput attributes — aliasing window to
// globalThis means those assignments land as real globals here too, so callers
// can just `await import(...)` the real source files and read their exports back.
globalThis.window = globalThis;
globalThis.innerWidth = 1024;
globalThis.addEventListener = () => {};
globalThis.scrollTo = () => {};
globalThis.location = { search: '', href: '' };
globalThis.history = { replaceState() {}, pushState() {}, go() {} };
globalThis.btoa = s => Buffer.from(s, 'binary').toString('base64');
globalThis.BroadcastChannel = class { constructor() {} postMessage() {} set onmessage(_) {} };
globalThis.document = {
  addEventListener:  () => {},
  getElementById:    () => makeEl(),
  querySelector:     () => makeEl(),
  querySelectorAll:  () => [],
  createElement:     () => makeEl(),
  body:              { appendChild: () => {}, style: {}, classList: { add() {}, remove() {}, contains: () => false } },
};
// Node defines a read-only global `navigator`; override it with a configurable one.
Object.defineProperty(globalThis, 'navigator', {
  value: { serviceWorker: { register: () => Promise.resolve() }, clipboard: { writeText: () => Promise.resolve() } },
  writable: true,
  configurable: true,
});
globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
