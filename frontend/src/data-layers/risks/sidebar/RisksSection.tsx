import { FC } from 'react';

import { useSyncConfigState } from 'app/state/data-params';

import { SidebarPanel } from 'lib/sidebar/SidebarPanel';
import { SidebarPanelSection } from 'lib/sidebar/ui/SidebarPanelSection';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';

import { RisksControl } from './RisksControl';

export const RisksSection: FC = () => {
  useSyncConfigState();
  return (
    <SidebarPanel id="risks" title="Hotspots">
      <ErrorBoundary message="There was a problem displaying this section.">
        <SidebarPanelSection>
          <RisksControl />
        </SidebarPanelSection>
      </ErrorBoundary>
    </SidebarPanel>
  );
};
