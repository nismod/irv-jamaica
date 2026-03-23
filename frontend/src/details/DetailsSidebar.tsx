import { Box } from '@mui/material';
import { atom, useAtomValue } from 'jotai';

import { sectionStyleValueState, sectionVisibilityState } from 'lib/state/sections';
import { mapInteractionModeState } from 'lib/state/map-interaction-state';

import { AdaptationsSidebar } from './adaptations/AdaptationsSidebar';
import { FeatureSidebar } from './features/FeatureSidebar';
import { RegionDetails } from './regions/RegionDetails';
import { SolutionsSidebar } from './solutions/SolutionsSidebar';
import { PixelData } from './pixel-data/PixelData';

export const showAdaptationsTableState = atom(
  (get) =>
    get(sectionVisibilityState('assets')) && get(sectionStyleValueState('assets')) === 'adaptation',
);

export const DetailsSidebar = () => {
  const showAdaptationsTable = useAtomValue(showAdaptationsTableState);
  const interactionMode = useAtomValue(mapInteractionModeState);
  return (
    <>
      {interactionMode === 'pixel-driller' && (
        <Box mb={2}>
          <PixelData />
        </Box>
      )}
      <Box mb={2}>
        <SolutionsSidebar />
      </Box>
      <Box mb={2}>{showAdaptationsTable ? <AdaptationsSidebar /> : null}</Box>
      <Box mb={2}>
        <FeatureSidebar />
      </Box>
      <Box mb={2}>
        <RegionDetails />
      </Box>
    </>
  );
};
