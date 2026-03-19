import { useAtomValue } from 'jotai';

import { selectionState } from 'lib/state/interactions/interaction-state';
import { Box } from '@mui/material';
import { RegionDetailsContent } from './RegionDetailsContent';
import { SidePanel } from 'details/SidePanel';
import { DeselectButton } from 'details/DeselectButton';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { MobileTabContentWatcher } from 'lib/map/layouts/tab-has-content';
import { InteractionTarget, VectorTarget } from 'lib/data-map/types';

/**
 * Display detailed information about a selected region (parish or enumeration district.)
 */
export const RegionDetails = () => {
  const selectedRegion = useAtomValue(selectionState('regions'));

  if (!selectedRegion || selectedRegion.interactionStyle !== 'vector') return null;

  const vectorRegion = selectedRegion as InteractionTarget<VectorTarget>;

  return (
    <SidePanel position="relative">
      <MobileTabContentWatcher tabId="details" />
      <ErrorBoundary message="There was a problem displaying these details.">
        <Box position="absolute" top={0} right={0} p={2}>
          <DeselectButton interactionGroup="regions" title="Deselect region" />
        </Box>
        <RegionDetailsContent selectedRegion={vectorRegion} />
      </ErrorBoundary>
    </SidePanel>
  );
};
