import omit from 'lodash/omit';
import { FC, ReactNode } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { mapViewConfig } from 'app/config/map-view';
import { mapViewStateState, nonCoordsMapViewStateState } from 'lib/state/map-view/map-view-state';
import { BaseMap } from 'lib/data-map/BaseMap';

import { backgroundState, showLabelsState } from './layers/layers-state';
import { useBasemapStyle } from './use-basemap-style';

export interface BaseMapProps {
  children?: ReactNode;
}

const INITIAL_VIEW_STATE = {
  ...mapViewConfig.initialViewState,
  ...mapViewConfig.viewLimits,
};
const INITIAL_NON_COORDS_STATE = omit(INITIAL_VIEW_STATE, ['latitude', 'longitude', 'zoom']);

export const BaseMapContainer: FC<BaseMapProps> = ({ children }) => {
  const background = useAtomValue(backgroundState);
  const showLabels = useAtomValue(showLabelsState);
  const [viewState, setViewState] = useAtom(mapViewStateState);
  const setNonCoordsViewState = useSetAtom(nonCoordsMapViewStateState);
  const { mapStyle } = useBasemapStyle(background, showLabels);

  const hasInvalidViewState =
    !Number.isFinite(viewState.zoom) ||
    !Number.isFinite(viewState.latitude) ||
    !Number.isFinite(viewState.longitude) ||
    viewState.zoom < 0;

  if (hasInvalidViewState) {
    setViewState(INITIAL_VIEW_STATE);
    setNonCoordsViewState(INITIAL_NON_COORDS_STATE);
    // wait for initial state to be set before showing a map.
    return null;
  }

  return <BaseMap mapStyle={mapStyle}>{children}</BaseMap>;
};
