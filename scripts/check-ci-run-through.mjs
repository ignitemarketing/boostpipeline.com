// Fails when a check step in a workflow can be skipped by an earlier failure.
// Every step except checkout must carry `if: ${{ !cancelled() }}` (or
// `always()`), so one CI run reports every failing check.
// Usage: node scripts/check-ci-run-through.mjs <workflow.yml>...

import { readFileSync } from 'node:fs';

const SETUP = /uses:\s*actions\/checkout@/;
const RUN_THROUGH = /^\s*if:\s*\$\{\{\s*(!cancelled\(\)|always\(\))/;

function stepsOf(text) {
  const steps = [];
  let indent = null;
  let current = null;
  for (const line of text.split('\n')) {
    const item = line.match(/^(\s*)- /);
    if (/^\s*steps:\s*$/.test(line)) {
      indent = null;
      current = null;
      continue;
    }
    if (item && (indent === null || item[1].length === indent)) {
      indent = item[1].length;
      current = { lines: [line] };
      steps.push(current);
    } else if (current && (line.trim() === '' || line.search(/\S/) > indent)) {
      current.lines.push(line);
    } else {
      current = null;
    }
  }
  return steps;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: check-ci-run-through.mjs <workflow.yml>...');
  process.exit(2);
}

const failures = [];
for (const file of files) {
  const steps = stepsOf(readFileSync(file, 'utf8'));
  if (steps.length === 0) failures.push(`${file}: no steps found`);
  for (const step of steps) {
    const body = step.lines.join('\n');
    if (SETUP.test(body)) continue;
    if (!step.lines.some((l) => RUN_THROUGH.test(l.replace(/^(\s*)- /, '$1  ')))) {
      const name = body.match(/name:\s*(.+)/)?.[1] ?? '(unnamed step)';
      failures.push(`${file}: step "${name}" lacks if: \${{ !cancelled() }}`);
    }
  }
}

if (failures.length > 0) {
  for (const f of failures) console.error(f);
  process.exit(1);
}
console.log(`run-through condition present on every check step in ${files.join(', ')}`);
