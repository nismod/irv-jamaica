import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { FC } from 'react';
import { SidebarPanel } from 'app/sidebar/SidebarPanel';
import { SidebarPanelSection } from 'lib/sidebar/ui/SidebarPanelSection';

import { MarineControl } from './MarineControl';

/**
 * Sidebar controls for the `marine` layer.
 * Select mangrove, coral or seagrass to display on the map.
 * None are selected by default.
 */
export const MarineSection: FC = () => {
  return (
    <SidebarPanel id="marine" title="Marine">
      <ErrorBoundary message="There was a problem displaying this section.">
        <SidebarPanelSection>
          <MarineControl />
        </SidebarPanelSection>
      </ErrorBoundary>
    </SidebarPanel>
  );
};
