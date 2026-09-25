'use strict';
// Regenerates tests/fixtures/cif-tree-navigation.json — the checked-in
// snapshot of "what does each CIF_TREES option resolve to next" that
// tests/unit.js compares against (section "CIF tree navigation regression").
//
// That test exists to catch a specific, silent failure mode: inserting or
// reordering a step in a region's `steps` array can change which step an
// UNRELATED, untouched option falls through to — because an option without
// an explicit `next` resolves to "the next step in the array" (see the
// schema comment above CIF_TREES in data.js). No id goes dangling, nothing
// throws, the tree still "works" — it just quietly answers a different
// question than before for a branch nobody meant to touch. The snapshot
// test turns that into a named, reviewable diff instead of a hidden bug.
//
// Run this ONLY after `node tests/unit.js` fails on the navigation snapshot
// AND you've read the diff it prints and confirmed every changed entry is
// an intended consequence of the region reorganization you just made — not
// collateral damage from reordering steps. Then re-run tests/unit.js to
// confirm the new snapshot is what you expect, and commit the fixture
// alongside your data.js change.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import './dom-shim.mjs';

const { CIF_TREES } = await import('../data.js');
const { resolveOptionTargets } = await import('../phase4.js');

const snapshot = {};
for (const region of Object.keys(CIF_TREES).sort()) {
  const tree = CIF_TREES[region];
  const steps = {};
  tree.steps.forEach((step, stepIdx) => {
    steps[step.id] = step.options.map((opt, optIdx) => {
      const [target] = resolveOptionTargets(tree, stepIdx, opt);
      return target ? target.id : null;
    });
  });
  snapshot[region] = steps;
}

const outPath = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'cif-tree-navigation.json');
writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Wrote ${outPath}`);
