import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../../src/index.js';
import { createOptions } from '../../src/util/create-options.js';
import baseCounters from '../helpers/baseCounters.js';
import { resolve } from '../helpers/resolve.js';

const cwd = resolve('fixtures/plugins/angular3');

test('Find dependencies with the Angular plugin (non-production)', async () => {
  const options = await createOptions({ cwd });
  const { issues, counters } = await main(options);

  assert(issues.devDependencies['package.json']['@angular/cli']);

  assert.deepEqual(counters, {
    ...baseCounters,
    devDependencies: 1,
    processed: 10,
    total: 10,
  });
});

test('Find dependencies with the Angular plugin (production)', async () => {
  const options = await createOptions({ cwd, isProduction: true });
  const { counters } = await main(options);

  assert.deepEqual(counters, {
    ...baseCounters,
    processed: 5,
    total: 5,
  });
});
