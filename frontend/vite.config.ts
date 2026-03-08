import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
/**
 * To set up a development proxy, create and edit the file dev-proxy/proxy-table.js
 * You can copy and rename one of the included examples.
 * See https://vitejs.dev/config/server-options.html#server-proxy for syntax
 */
import { devProxy } from './dev-proxy/proxy-table.js';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), url(), svgr()],
  build: {
    outDir: 'build',
  },
  server: {
    open: true,
    proxy: devProxy,
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
