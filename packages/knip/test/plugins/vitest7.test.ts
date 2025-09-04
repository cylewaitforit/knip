import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../../src/index.js';
import { createOptions } from '../../src/util/create-options.js';
import baseCounters from '../helpers/baseCounters.js';
import { resolve } from '../helpers/resolve.js';

const cwd = resolve('fixtures/plugins/vitest7');

test('Find dependencies with the Vitest plugin (7)', async () => {
  const options = await createOptions({ cwd });
  const { counters } = await main(options);

  assert.deepEqual(counters, {
    ...baseCounters,
    files: 0,
    processed: 3,
    total: 3,
  });
});
