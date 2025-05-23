import { Box } from '@mui/material';
import { DeselectButton } from 'details/DeselectButton';
import { SidePanel } from 'details/SidePanel';
import { selectionState } from 'lib/state/interactions/interaction-state';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { SolutionsSidebarContent } from './SolutionsSidebarContent';
import { MobileTabContentWatcher } from 'lib/map/layouts/tab-has-content';
import { InteractionTarget, VectorTarget } from 'lib/data-map/types';

/**
 * Display detailed information about a selected feature
 * from either the `marine` or `terrestrial` data layers.
 */
export const SolutionsSidebar: FC = () => {
  const featureSelection = useRecoilValue(selectionState('solutions'));

  if (!featureSelection) return null;

  const {
    target: { feature },
    viewLayer,
  } = featureSelection as InteractionTarget<VectorTarget>;

  return (
    <SidePanel position="relative">
      <MobileTabContentWatcher tabId="details" />
      <ErrorBoundary message="There was a problem displaying these details.">
        <Box position="absolute" top={0} right={0} p={2}>
          <DeselectButton interactionGroup="solutions" title="Deselect" />
        </Box>
        <SolutionsSidebarContent feature={feature} solutionType={viewLayer.id} />
      </ErrorBoundary>
    </SidePanel>
  );
};
