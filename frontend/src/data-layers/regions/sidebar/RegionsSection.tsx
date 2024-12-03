import { FC } from 'react';

import { SidebarPanel } from 'app/sidebar/SidebarPanel';
import { StyleSelection } from 'app/sidebar/StyleSelection';
import { SidebarPanelSection } from 'lib/sidebar/ui/SidebarPanelSection';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';

import { RegionsControl } from './RegionsControl';

/**
 * Sidebar controls for the `regions` layer.
 * Show parishes or enumeration districts on the map,
 * either as boundaries or colour-coded by population.
 */
export const RegionsSection: FC = () => {
  return (
    <SidebarPanel id="regions" title="Regions">
      <ErrorBoundary message="There was a problem displaying this section.">
        <SidebarPanelSection>
          <RegionsControl />
        </SidebarPanelSection>
        <SidebarPanelSection variant="style">
          <StyleSelection id="regions" />
        </SidebarPanelSection>
      </ErrorBoundary>
    </SidebarPanel>
  );
};
