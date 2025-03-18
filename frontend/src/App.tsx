import { RecoilRoot } from 'recoil';
import { RecoilURLSync } from 'recoil-sync';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Box, CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './query-client';

import { IntroPage } from './app/pages/IntroPage';
import { MapPage } from './app/pages/map/MapPage';
import { DataPage } from './app/pages/DataPage';
import { GuidePage } from './app/pages/GuidePage';
import { globalStyleVariables, theme } from './app/theme';
import { Nav, NavItemConfig } from './app/Nav';

import 'react-spring-bottom-sheet/dist/style.css';
import './index.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Notice } from 'app/Notice';
import { RecoilLocalStorageSync } from 'lib/recoil/sync-stores/RecoilLocalStorageSync';

export const navItems: NavItemConfig[] = [
  {
    to: '/exposure',
    title: 'Exposure',
    tooltip: 'Infrastructure assets and natural hazards',
  },
  {
    to: '/risk',
    title: 'Risk',
    tooltip: 'Risk of hazard-related damages to assets',
  },
  {
    to: '/adaptation',
    title: 'Adaptation',
    tooltip: 'Adaptation options to decrease hazard-related risks',
  },
  {
    to: '/nature-based-solutions',
    title: 'Nature-based Solutions',
    tooltip: 'Analysis of nature-based solutions potential',
  },
  {
    to: '/data',
    title: 'About',
    tooltip: 'More information about datasets in the tool',
  },
  {
    to: '/guide',
    title: 'Guide',
    tooltip: 'Help and guidance for use of the tool',
  },
];

const serialise = (value) => {
  if (typeof value === 'undefined') {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  return JSON.stringify(value);
};

const deserialise = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const App = () => {
  return (
    <RecoilRoot>
      <RecoilLocalStorageSync storeKey="local-storage">
        <RecoilURLSync
          storeKey="url-json"
          location={{ part: 'queryParams' }}
          serialize={serialise}
          deserialize={deserialise}
        >
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <QueryClientProvider client={queryClient}>
                <Router>
                  <CssBaseline />
                  <Nav height={globalStyleVariables.navbarHeight} navItems={navItems} />
                  <Notice />
                  <Box
                    position="absolute"
                    top={globalStyleVariables.navbarHeight}
                    bottom={0}
                    left={0}
                    right={0}
                  >
                    <Routes>
                      <Route path="/" element={<IntroPage />} />
                      <Route path="/:view" element={<MapPage />} />
                      <Route path="/data" element={<DataPage />} />
                      <Route path="/guide" element={<GuidePage />} />
                    </Routes>
                  </Box>
                </Router>
              </QueryClientProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </RecoilURLSync>
      </RecoilLocalStorageSync>
    </RecoilRoot>
  );
};
