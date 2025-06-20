import { useRecoilValue, useSetRecoilState } from 'recoil';

import { Box, IconButton } from '@mui/material';
import { SidePanel } from 'details/SidePanel';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { MobileTabContentWatcher } from 'lib/map/layouts/tab-has-content';
import {
  pixelDrillerDataHeaders,
  pixelDrillerDataState,
  pixelSelectionState,
} from 'lib/state/pixel-driller';
import { PixelDataGrid } from './PixelDataGrid';
import Close from '@mui/icons-material/Close';

/**
 * Display detailed information about a selected pixel (lat/lon point.)
 */
export const PixelData = () => {
  const { data: selectedData } = useRecoilValue(pixelDrillerDataState);
  const headers = useRecoilValue(pixelDrillerDataHeaders);
  const setPixelSelection = useSetRecoilState(pixelSelectionState);

  function clearSelectedLocation() {
    setPixelSelection(null);
  }

  if (!selectedData) {
    return null;
  }
  if (!headers.length) {
    return null;
  }
  // Define which pixel layers to include, in display order
  const pixel_layers = ['fluvial', 'surface', 'coastal', 'cyclone'];

  return (
    <SidePanel position="relative">
      <MobileTabContentWatcher tabId="details" />
      <ErrorBoundary message="There was a problem displaying these details.">
        <Box position="absolute" top={0} right={0} p={2}>
          <IconButton onClick={clearSelectedLocation} title={'Close'}>
            <Close />
          </IconButton>
        </Box>
        {pixel_layers.map((pixel_layer) => (
          <Box key={pixel_layer} mt={2}>
            <PixelDataGrid pixel_layer={pixel_layer} />
          </Box>
        ))}
      </ErrorBoundary>
    </SidePanel>
  );
};
