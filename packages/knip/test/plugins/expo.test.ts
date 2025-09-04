import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../../src/index.js';
import { createOptions } from '../../src/util/create-options.js';
import baseCounters from '../helpers/baseCounters.js';
import { resolve } from '../helpers/resolve.js';

const cwd = resolve('fixtures/plugins/expo');

test('Find dependencies with the Expo plugin (1)', async () => {
  const options = await createOptions({ cwd });
  const { issues, counters } = await main(options);

  assert(issues.dependencies['package.json']['expo-router']);

  assert.deepEqual(counters, {
    ...baseCounters,
    processed: 2,
    total: 2,
    dependencies: 1,
  });
});
