import { CssBaseline } from '@mui/material';
import { StyledEngineProvider } from '@mui/styled-engine';
import { ThemeProvider } from '@mui/material/styles';
import type { Preview } from '@storybook/react-vite';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { atom, RecoilRoot } from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';

import { theme } from '../src/app/theme';
import { useSyncRecoilState } from '../src/lib/recoil/sync-state';
import { viewStateEffect } from '../src/app/state/view';
import { useStateEffect } from '../src/lib/recoil/state-effects/use-state-effect';

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({
  serviceWorker: {
    url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
  },
});

const mockViewState = atom({
  key: 'mockViewState',
  default: 'exposure',
});

function SectionStyle({ children, view }) {
  useSyncRecoilState(mockViewState, view);
  useStateEffect(mockViewState, viewStateEffect);
  return children;
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    (Story, { args }) => (
      <RecoilRoot>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Router>
              <CssBaseline />
              <SectionStyle view={args.view}>
                <Story />
              </SectionStyle>
            </Router>
          </ThemeProvider>
        </StyledEngineProvider>
      </RecoilRoot>
    ),
  ],
  loaders: [mswLoader],
  tags: ['autodocs'],
};

export default preview;
