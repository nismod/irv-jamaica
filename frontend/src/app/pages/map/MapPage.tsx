import { FC } from 'react';

import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { StateEffectRoot } from 'lib/recoil/state-effects/StateEffectRoot';
import { useSyncRecoilState } from 'lib/recoil/sync-state';

import { viewState, viewStateEffect } from 'app/state/view';

import { MapViewRouteSync } from './MapViewRouteSync';
import { MapPageDesktopLayout } from './layouts/MapPageDesktopLayout';
import { useIsMobile } from 'app/use-is-mobile';
import { MapPageMobileLayout } from './layouts/mobile/MapPageMobileLayout';
import { useParams } from 'react-router-dom';

export const MapPage: FC = () => {
  const { view } = useParams();
  useSyncRecoilState(viewState, view);

  const isMobile = useIsMobile();

  return (
    <ErrorBoundary message="There was a problem displaying this page.">
      <MapViewRouteSync>
        <StateEffectRoot state={viewState} effect={viewStateEffect} />
        {isMobile ? <MapPageMobileLayout /> : <MapPageDesktopLayout />}
      </MapViewRouteSync>
    </ErrorBoundary>
  );
};
