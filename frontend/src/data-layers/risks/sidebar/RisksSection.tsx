import { FC } from 'react';

import { SidebarPanel } from 'app/sidebar/SidebarPanel';
import { SidebarPanelSection } from 'lib/sidebar/ui/SidebarPanelSection';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';

import { RisksControl } from './RisksControl';

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
