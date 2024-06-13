import { FC } from 'react';

import { RisksControl } from './RisksControl';
import { SidebarPanel } from 'sidebar/SidebarPanel';
import { SidebarPanelSection } from 'sidebar/ui/SidebarPanelSection';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';

export const RisksSection: FC = () => {
  return (
    <SidebarPanel id="risks" title="Aggregated Risk">
      <ErrorBoundary message="There was a problem displaying this section.">
        <SidebarPanelSection>
          <RisksControl />
        </SidebarPanelSection>
      </ErrorBoundary>
    </SidebarPanel>
  );
};
