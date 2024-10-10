import { MapViewState } from 'deck.gl/typed';
import { FC, ReactNode } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { mapViewStateState, useSyncMapUrl } from 'app/state/map-view/map-view-state';
import { BaseMap } from 'lib/data-map/BaseMap';
import { backgroundState, showLabelsState } from './layers/layers-state';
import { useBasemapStyle } from './use-basemap-style';

export interface BaseMapProps {
  children?: ReactNode;
}

export const BaseMapContainer: FC<BaseMapProps> = ({ children }) => {
  const background = useRecoilValue(backgroundState);
  const showLabels = useRecoilValue(showLabelsState);
  const [viewState, setViewState] = useRecoilState(mapViewStateState);
  const { mapStyle } = useBasemapStyle(background, showLabels);
  useSyncMapUrl();

  function handleViewStateChange({ viewState }: { viewState: MapViewState }) {
    setViewState(viewState);
  }

  return (
    <BaseMap onMove={handleViewStateChange} viewState={viewState} mapStyle={mapStyle}>
      {children}
    </BaseMap>
  );
};
