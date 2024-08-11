import { Alert } from '@mui/material';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { viewState } from 'state/view';

import { BuildingsSection } from 'data-layers/buildings/sidebar/BuildingsSection';
import { DroughtsSection } from 'data-layers/droughtRisks/sidebar/DroughtsSection';
import { HazardsSection } from 'data-layers/hazards/sidebar/HazardsSection';
import { NetworksSection } from 'data-layers/networks/sidebar/NetworksSection';
import { RegionsSection } from 'data-layers/regions/sidebar/RegionsSection';
import { MarineSection } from 'data-layers/marine/sidebar/MarineSection';
import { TerrestrialSection } from 'data-layers/terrestrial/sidebar/TerrestrialSection';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { MobileTabContentWatcher } from 'pages/map/layouts/mobile/tab-has-content';

const viewLabels = {
  exposure: 'Exposure',
  risk: 'Risk',
  adaptation: 'Adaptation',
  'nature-based-solutions': 'Nature-based Solutions',
};

const SidebarContent: FC = () => {
  const view = useRecoilValue(viewState);
  switch (view) {
    case 'exposure':
    case 'risk':
      return (
        <>
          <NetworksSection />
          <HazardsSection />
          <BuildingsSection />
          <RegionsSection />
        </>
      );
    case 'adaptation':
      return (
        <>
          <NetworksSection />
          <DroughtsSection />
          <HazardsSection />
          <BuildingsSection />
          <RegionsSection />
          <TerrestrialSection />
          <MarineSection />
        </>
      );
    case 'nature-based-solutions':
      return (
        <>
          <TerrestrialSection />
          <MarineSection />
          <NetworksSection />
          <HazardsSection />
          <BuildingsSection />
          <RegionsSection />
        </>
      );
    default: {
      const viewLabel = viewLabels[view];

      if (viewLabel) {
        return <Alert severity="info">{viewLabel}: Coming soon.</Alert>;
      } else {
        return <Alert severity="error">Unknown view!</Alert>;
      }
    }
  }
};

export const LayersSidebar = () => {
  return (
    <>
      <MobileTabContentWatcher tabId="layers" />
      <ErrorBoundary message="There was a problem displaying the sidebar.">
        <SidebarContent />
      </ErrorBoundary>
    </>
  );
};
