import { Box } from '@mui/material';
import { selector, useRecoilValue } from 'recoil';

import { sectionStyleValueState, sectionVisibilityState } from 'state/sections';

import { AdaptationsSidebar } from './adaptations/AdaptationsSidebar';
import { FeatureSidebar } from './features/FeatureSidebar';
import { RegionDetails } from './regions/RegionDetails';
import { SolutionsSidebar } from './solutions/SolutionsSidebar';

export const showAdaptationsTableState = selector<boolean>({
  key: 'showAdaptationsTable',
  get: ({ get }) =>
    get(sectionVisibilityState('assets')) && get(sectionStyleValueState('assets')) === 'adaptation',
});

export const DetailsSidebar = () => {
  const showAdaptationsTable = useRecoilValue(showAdaptationsTableState);
  return (
    <>
      <Box mb={2}>
        <SolutionsSidebar />
      </Box>
      <Box mb={2}>{showAdaptationsTable ? <AdaptationsSidebar /> : <FeatureSidebar />}</Box>
      <Box mb={2}>
        <RegionDetails />
      </Box>
    </>
  );
};
