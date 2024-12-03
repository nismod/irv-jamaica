import { FC } from 'react';

import { SidebarPanel } from 'lib/sidebar/SidebarPanel';
import { Box } from '@mui/system';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';

import { HazardsControl } from './HazardsControl';
import { useSyncConfigState } from 'app/state/data-params';

/**
 * Sidebar controls for the `hazards` layer.
 * Select hazard types to display on the map.
 * Each hazard type has its own set of parameters:
 * - Return period in years.
 * - Epoch.
 * - RCP (climate scenario.)
 */
export const HazardsSection: FC = () => {
  useSyncConfigState();
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
