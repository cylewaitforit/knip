import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { main } from '../src/index.js';
import { createOptions } from '../src/util/create-options.js';
import baseCounters from './helpers/baseCounters.js';
import { resolve } from './helpers/resolve.js';

const cwd = resolve('fixtures/ignore-exports-used-in-file-some');

test('Find unused exports respecting an ignoreExportsUsedInFile object', async () => {
  const options = await createOptions({ cwd });
  const { issues, counters } = await main(options);

  assert.equal(Object.values(issues.exports).length, 1);
  assert.equal(issues.exports['imported.ts']['referencedNeverFunction'].symbol, 'referencedNeverFunction');
  assert.equal(issues.exports['imported.ts']['referencedInternallyFunction'].symbol, 'referencedInternallyFunction');

  assert.equal(Object.values(issues.types).length, 1);
  assert.equal(Object.values(issues.types['imported.ts']).length, 1);
  assert.equal(issues.types['imported.ts']['ReferencedNeverInterface'].symbol, 'ReferencedNeverInterface');

  assert.deepEqual(counters, {
    ...baseCounters,
    duplicates: 0,
    exports: 2,
    nsExports: 0,
    nsTypes: 0,
    processed: 2,
    total: 2,
    types: 1,
  });
});
