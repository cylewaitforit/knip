import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../src/index.js';
import { createOptions } from '../src/util/create-options.js';
import baseCounters from './helpers/baseCounters.js';
import { resolve } from './helpers/resolve.js';

const cwd = resolve('fixtures/exports-value-refs');

test('Find unused exports in exported types', async () => {
  const options = await createOptions({ cwd });
  const { issues, counters } = await main(options);

  assert(issues.exports['refs.ts']['NotInExportedType']);
  assert(issues.exports['refs.ts']['myValue']);
  assert(issues.exports['refs.ts']['myResult']);

  assert.deepEqual(counters, {
    ...baseCounters,
    exports: 3,
    processed: 2,
    total: 2,
  });
});
