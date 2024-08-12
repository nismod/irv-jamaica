import { FC } from 'react';

import { SidebarPanel } from 'app/sidebar/SidebarPanel';
import { StyleSelection } from 'app/sidebar/StyleSelection';
import { SidebarPanelSection } from 'app/sidebar/ui/SidebarPanelSection';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';

import { RegionsControl } from './RegionsControl';

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
