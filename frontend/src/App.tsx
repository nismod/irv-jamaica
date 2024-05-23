import { RecoilRoot } from 'recoil';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Box, CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { IntroPage } from './pages/IntroPage';
import { MapPage } from './pages/map/MapPage';
import { DataPage } from './pages/DataPage';
import { GuidePage } from './pages/GuidePage';
import { globalStyleVariables, theme } from './theme';
import { Nav, NavItemConfig } from './Nav';

import 'react-spring-bottom-sheet/dist/style.css';
import './index.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Notice } from 'Notice';
import { RecoilLocalStorageSync } from 'lib/recoil/sync-stores/RecoilLocalStorageSync';

const navItems: NavItemConfig[] = [
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

export const App = () => {
  return (
    <RecoilRoot>
      <RecoilLocalStorageSync storeKey="local-storage">
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
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
          </ThemeProvider>
        </StyledEngineProvider>
      </RecoilLocalStorageSync>
    </RecoilRoot>
  );
};
