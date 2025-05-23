import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../../src/index.js';
import { resolve } from '../../src/util/path.js';
import baseArguments from '../helpers/baseArguments.js';
import baseCounters from '../helpers/baseCounters.js';

const cwd = resolve('fixtures/plugins/storybook');

test('Find dependencies with the Storybook plugin', async () => {
  const { issues, counters } = await main({
    ...baseArguments,
    cwd,
  });

  assert(issues.devDependencies['package.json']['storybook-addon-performance']);
  assert(issues.unlisted['main.js']['@storybook/builder-webpack5']);
  assert(issues.unlisted['main.js']['@storybook/manager-webpack5']);
  assert(issues.unlisted['main.js']['@storybook/react-webpack5']);
  assert(issues.unlisted['preview.js']['cypress-storybook']);
  assert(issues.unresolved['main.js']['@storybook/addon-knobs/preset']);
  assert(issues.unresolved['main.js']['storybook-addon-export-to-codesandbox']);
  assert(issues.binaries['package.json']['storybook']);

  assert.deepEqual(counters, {
    ...baseCounters,
    devDependencies: 1,
    unlisted: 4,
    unresolved: 2,
    binaries: 1,
    processed: 3,
    total: 3,
  });
});
