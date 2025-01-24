import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { FC } from 'react';
import { SidebarPanel } from 'lib/sidebar/SidebarPanel';
import { StyleSelection } from 'lib/sidebar/StyleSelection';
import { SidebarPanelSection } from 'lib/sidebar/ui/SidebarPanelSection';

import { TerrestrialControl } from './TerrestrialControl';

/**
 * Sidebar controls for the `terrestrial` layer.
 * Select land use types to display on the map,
 * optionally filtered by slope and elevation.
 */
export const TerrestrialSection: FC = () => {
  return (
    <SidebarPanel id="terrestrial" title="Terrestrial">
      <ErrorBoundary message="There was a problem displaying this section.">
        <SidebarPanelSection>
          <TerrestrialControl />
        </SidebarPanelSection>
        <SidebarPanelSection variant="style">
          <StyleSelection id="terrestrial" />
        </SidebarPanelSection>
      </ErrorBoundary>
    </SidebarPanel>
  );
};
