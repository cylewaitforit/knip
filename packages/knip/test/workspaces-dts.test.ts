import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../src/index.js';
import { createOptions } from '../src/util/create-options.js';
import baseCounters from './helpers/baseCounters.js';
import { resolve } from './helpers/resolve.js';

const cwd = resolve('fixtures/workspaces-dts');

test('Find unused un-built exports across workspaces', async () => {
  const options = await createOptions({ cwd });
  const { issues, counters } = await main(options);

  assert(issues.exports['packages/shared/src/index.js']['unusedFunction']);
  assert(issues.exports['packages/shared/src/unused-function.js']['unusedFunction']);

  assert.deepEqual(counters, {
    ...baseCounters,
    exports: 2,
    processed: 8,
    total: 8,
  });
});
