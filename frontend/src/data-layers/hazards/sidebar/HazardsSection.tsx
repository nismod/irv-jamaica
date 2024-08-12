import { FC } from 'react';

import { SidebarPanel } from 'app/sidebar/SidebarPanel';
import { Box } from '@mui/system';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';

import { HazardsControl } from './HazardsControl';

export const HazardsSection: FC = () => {
  return (
    <SidebarPanel id="hazards" title="Hazards">
      <Box p={2}>
        <ErrorBoundary message="There was a problem displaying this section.">
          <HazardsControl />
        </ErrorBoundary>
      </Box>
    </SidebarPanel>
  );
};
