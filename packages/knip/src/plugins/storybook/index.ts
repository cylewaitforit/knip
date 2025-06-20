import type { IsPluginEnabled, Plugin, ResolveConfig } from '../../types/config.js';
import { toDeferResolve, toDependency, toEntry } from '../../util/input.js';
import { join, relative } from '../../util/path.js';
import { hasDependency } from '../../util/plugin.js';
import type { StorybookConfig } from './types.js';

// https://storybook.js.org/docs/react/configure/overview

const title = 'Storybook';

const enablers = [/^@storybook\//, '@nrwl/storybook'];

const isEnabled: IsPluginEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);

const config = ['.{storybook,rnstorybook}/{main,test-runner}.{js,ts,mts}'];

const stories = ['**/*.@(mdx|stories.@(mdx|js|jsx|mjs|ts|tsx))'];

const restEntry = ['.{storybook,rnstorybook}/{manager,preview,index,vitest.setup}.{js,jsx,ts,tsx}'];

const entry = [...restEntry, ...stories];

const project = ['.{storybook,rnstorybook}/**/*.{js,jsx,ts,tsx,mts}'];

const resolveConfig: ResolveConfig<StorybookConfig> = async (localConfig, options) => {
  const { cwd, configFileDir } = options;
  const strs = typeof localConfig?.stories === 'function' ? await localConfig.stories(stories) : localConfig?.stories;
  const relativePatterns = strs?.map(pattern => {
    if (typeof pattern === 'string') return relative(cwd, join(configFileDir, pattern));
    return relative(cwd, join(configFileDir, pattern.directory, pattern.files ?? stories[0]));
  });
  const patterns = [
    ...(options.config.entry ?? restEntry),
    ...(relativePatterns && relativePatterns.length > 0 ? relativePatterns : stories),
  ];

  const addons = localConfig.addons?.map(addon => (typeof addon === 'string' ? addon : addon.name)) ?? [];
  const builder =
    localConfig?.core?.builder &&
    (typeof localConfig.core.builder === 'string' ? localConfig.core.builder : localConfig.core.builder.name);
  const builderPackages = builder
    ? builder.startsWith('webpack')
      ? [`@storybook/builder-${builder}`, `@storybook/manager-${builder}`]
      : [builder]
    : [];

  const framework = typeof localConfig.framework === 'string' ? localConfig.framework : localConfig.framework?.name;
  const frameworks = framework ? [framework] : [];

  return [
    ...patterns.map(id => toEntry(id)),
    ...addons.map(id => toDeferResolve(id)),
    ...builderPackages.map(id => toDependency(id)),
    ...frameworks.map(id => toDependency(id)),
  ];
};

export default {
  title,
  enablers,
  isEnabled,
  config,
  entry,
  project,
  resolveConfig,
} satisfies Plugin;
