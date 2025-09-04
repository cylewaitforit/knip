import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../../src/index.js';
import { createOptions } from '../../src/util/create-options.js';
import baseCounters from '../helpers/baseCounters.js';
import { resolve } from '../helpers/resolve.js';

const cwd = resolve('fixtures/plugins/metro');

test('Find dependencies with the Metro plugin', async () => {
  const options = await createOptions({ cwd });
  const { issues, counters } = await main(options);

  assert(issues.dependencies['package.json']['react']);
  assert(issues.dependencies['package.json']['react-native']);

  assert(issues.unresolved['metro.config.js']['metro-minify-esbuild']);
  assert(issues.unresolved['package.json']['./custom-metro-transformer.js']);

  assert.deepEqual(counters, {
    ...baseCounters,
    dependencies: 2,
    unresolved: 2,
    processed: 2,
    total: 2,
  });
});
