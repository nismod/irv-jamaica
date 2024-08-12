import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { FC } from 'react';
import { SidebarPanel } from 'app/sidebar/SidebarPanel';
import { SidebarPanelSection } from 'app/sidebar/ui/SidebarPanelSection';

import { DroughtsControl } from './DroughtsControl';

export const DroughtsSection: FC = () => {
  return (
    <SidebarPanel id="drought" title="Drought">
      <ErrorBoundary message="There was a problem displaying this section.">
        <SidebarPanelSection>
          <DroughtsControl />
        </SidebarPanelSection>
      </ErrorBoundary>
    </SidebarPanel>
  );
};
