import { lazy, Suspense } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Link as RouterLink } from 'react-router-dom';

import { Box, IconButton, Typography } from '@mui/material';
import { SidePanel } from 'details/SidePanel';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { MobileTabContentWatcher } from 'lib/map/layouts/tab-has-content';
import {
  pixelDrillerDataHeaders,
  pixelDrillerDataState,
  pixelSelectionState,
} from 'lib/state/pixel-driller';
import Close from '@mui/icons-material/Close';
import { CopyableLink } from 'lib/nav/CopyableLink';

const domainComponents = {
  fluvial: lazy(() => import('./domains/fluvial')),
  surface: lazy(() => import('./domains/surface')),
  coastal: lazy(() => import('./domains/coastal')),
  cyclone: lazy(() => import('./domains/cyclone')),
};

/**
 * Display detailed information about a selected pixel (lat/lon point.)
 */
export const PixelData = () => {
  const selectedData = useAtomValue(pixelDrillerDataState);
  const headers = useAtomValue(pixelDrillerDataHeaders);
  const [pixelSelection, setPixelSelection] = useAtom(pixelSelectionState);

  function clearSelectedLocation() {
    setPixelSelection(null);
  }

  if (!selectedData) {
    return null;
  }
  if (!headers.length) {
    return null;
  }

  const lat = pixelSelection?.lat;
  const lon = pixelSelection?.lon;

  return (
    <SidePanel position="relative">
      <MobileTabContentWatcher tabId="details" />
      <ErrorBoundary message="There was a problem displaying these details.">
        <Box position="absolute" top={0} right={0} p={2}>
          <IconButton onClick={clearSelectedLocation} title={'Close'}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="h6" gutterBottom>
          Site Details
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Coordinates:{' '}
          <CopyableLink
            href={window.location.pathname + window.location.search} // current URL path + query
            component={RouterLink}
            label={`${lat?.toFixed(6)}, ${lon?.toFixed(6)}`}
            copyTooltip="Copy site URL"
          />
        </Typography>
        {Object.entries(domainComponents).map(([pixel_layer, PixelDataGrid]) => (
            <Box key={pixel_layer} mt={2}>
              <Suspense fallback="Loading…">
                <PixelDataGrid pixel_layer={pixel_layer} />
              </Suspense>
            </Box>
          ))}
      </ErrorBoundary>
    </SidePanel>
  );
};
