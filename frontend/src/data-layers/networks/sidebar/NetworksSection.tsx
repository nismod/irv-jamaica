import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { Collapse } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

import { StateEffectRoot } from 'lib/recoil/state-effects/StateEffectRoot';
import { sectionStyleValueState } from 'lib/state/sections';

import { SidebarPanel } from 'lib/sidebar/SidebarPanel';
import { StyleSelection } from 'lib/sidebar/StyleSelection';
import { SidebarPanelSection } from 'lib/sidebar/ui/SidebarPanelSection';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { networksStyleStateEffect } from 'app/state/sections';

import { DamageSourceControl } from './DamageSourceControl';
import { AdaptationControl } from './AdaptationControl';
import { NetworkControl } from './NetworkControl';
import { useSyncConfigState } from 'app/state/data-params';

/**
 * Sidebar controls for the `networks` layer.
 * Select infrastructure networks to display on the map.
 * Each view has its own set of parameters:
 * - Exposure: displays asset types for the selected infrastucture networks.
 * - Risk: displays damages as a function of hazard type, epoch and RCP (climate scenario.)
 * - Adaptation: displays adaptation options for the selected infrastructure networks.
 */
export const NetworksSection: FC = () => {
  const style = useRecoilValue(sectionStyleValueState('assets'));
  useSyncConfigState();
  return (
    <SidebarPanel id="assets" title="Infrastructure">
      <ErrorBoundary message="There was a problem displaying this section.">
        <StateEffectRoot
          state={sectionStyleValueState('assets')}
          effect={networksStyleStateEffect}
        />
        <SidebarPanelSection>
          <NetworkControl />
        </SidebarPanelSection>
        <SidebarPanelSection variant="style">
          <StyleSelection id="assets" />
          <TransitionGroup>
            {style === 'damages' ? (
              <Collapse>
                <DamageSourceControl />
              </Collapse>
            ) : null}
            {style === 'adaptation' ? (
              <Collapse>
                <AdaptationControl />
              </Collapse>
            ) : null}
          </TransitionGroup>
        </SidebarPanelSection>
      </ErrorBoundary>
    </SidebarPanel>
  );
};
