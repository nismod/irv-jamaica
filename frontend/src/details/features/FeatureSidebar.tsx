import { FC } from 'react';

import { FeatureSidebarContent } from './FeatureSidebarContent';
import { useRecoilValue } from 'recoil';
import { selectionState } from 'lib/state/interactions/interaction-state';
import { SidePanel } from 'details/SidePanel';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { Box } from '@mui/system';
import { DeselectButton } from 'details/DeselectButton';
import { MobileTabContentWatcher } from 'lib/map/layouts/tab-has-content';
import { InteractionTarget, VectorTarget } from 'lib/data-map/types';

/**
 * A detailed report that appears when you select an infrastructure asset on the map.
 * Includes a description of the asset, a risk assessment, and a list of adaptation options.
 */
export const FeatureSidebar: FC = () => {
  const featureSelection = useRecoilValue(selectionState('assets'));

  if (!featureSelection) return null;

  const {
    target: { feature },
    viewLayer,
  } = featureSelection as InteractionTarget<VectorTarget>;

  return (
    <SidePanel position="relative">
      <MobileTabContentWatcher tabId="details" />
      <ErrorBoundary message="There was a problem displaying these details.">
        <Box position="absolute" top={15} right={15} zIndex={1000}>
          <DeselectButton interactionGroup="assets" title="Deselect asset" />
        </Box>
        <FeatureSidebarContent feature={feature} assetType={viewLayer.id} />
      </ErrorBoundary>
    </SidePanel>
  );
};
