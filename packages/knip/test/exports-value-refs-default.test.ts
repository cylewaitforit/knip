import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../src/index.js';
import { createOptions } from '../src/util/create-options.js';
import baseCounters from './helpers/baseCounters.js';
import { resolve } from './helpers/resolve.js';

const cwd = resolve('fixtures/exports-value-refs-default');

test('Find unused exports in exported types (default)', async () => {
  const options = await createOptions({ cwd });
  const { issues, counters } = await main(options);

  assert(issues.exports['refs.ts']['logger']);
  assert(issues.types['refs.ts']['Lizard']);

  assert.deepEqual(counters, {
    ...baseCounters,
    exports: 1,
    types: 1,
    processed: 2,
    total: 2,
  });
});
