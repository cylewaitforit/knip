import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../src/index.js';
import { createOptions } from '../src/util/create-options.js';
import baseCounters from './helpers/baseCounters.js';
import { resolve } from './helpers/resolve.js';

const cwd = resolve('fixtures/workspaces-plugin-overlap');

test('Handles config file shared by multiple plugins in workspaces', async () => {
  const options = await createOptions({ cwd, isIsolateWorkspaces: true });
  const { counters } = await main(options);

  assert.deepEqual(counters, {
    ...baseCounters,
  });
});
