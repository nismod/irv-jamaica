import omit from 'lodash/omit';
import { FC, ReactNode } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

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
  const background = useRecoilValue(backgroundState);
  const showLabels = useRecoilValue(showLabelsState);
  const [viewState, setViewState] = useRecoilState(mapViewStateState);
  const setNonCoordsViewState = useSetRecoilState(nonCoordsMapViewStateState);
  const { mapStyle } = useBasemapStyle(background, showLabels);
  if (viewState.zoom < 0) {
    setViewState(INITIAL_VIEW_STATE);
    setNonCoordsViewState(INITIAL_NON_COORDS_STATE);
    // wait for initial state to be set before showing a map.
    return null;
  }

  return <BaseMap mapStyle={mapStyle}>{children}</BaseMap>;
};
