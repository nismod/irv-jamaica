import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { Collapse } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

import { StateEffectRoot } from 'lib/recoil/state-effects/StateEffectRoot';

import { SidebarPanel } from 'app/sidebar/SidebarPanel';
import { StyleSelection } from 'app/sidebar/StyleSelection';
import { SidebarPanelSection } from 'app/sidebar/ui/SidebarPanelSection';
import { networksStyleStateEffect, sectionStyleValueState } from 'app/state/sections';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';

import { DamageSourceControl } from './DamageSourceControl';
import { AdaptationControl } from './AdaptationControl';
import { NetworkControl } from './NetworkControl';

export const NetworksSection: FC = () => {
  const style = useRecoilValue(sectionStyleValueState('assets'));
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
