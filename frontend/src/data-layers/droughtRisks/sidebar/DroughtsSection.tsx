import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { FC } from 'react';
import { SidebarPanel } from 'app/sidebar/SidebarPanel';
import { SidebarPanelSection } from 'app/sidebar/ui/SidebarPanelSection';

import { DroughtsControl } from './DroughtsControl';

/**
 * Sidebar controls for the `droughtRisks` and `droughtOptions` layers.
 * Select RCP (climate scenario), drought risk variable and adaptation options.
 */
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
