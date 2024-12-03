import { MapViewState } from 'deck.gl/typed';
import { FC, ReactNode } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { mapViewStateState, useSyncMapUrl } from 'app/state/map-view/map-view-state';
import { BaseMap } from 'lib/data-map/BaseMap';
import { labelZoomState } from 'lib/sidebar/ui/LayerLabel';
import { backgroundState, showLabelsState } from './layers/layers-state';
import { useBasemapStyle } from './use-basemap-style';

export interface BaseMapProps {
  children?: ReactNode;
}

export const BaseMapContainer: FC<BaseMapProps> = ({ children }) => {
  const background = useRecoilValue(backgroundState);
  const showLabels = useRecoilValue(showLabelsState);
  const [viewState, setViewState] = useRecoilState(mapViewStateState);
  const [labelZoom, setLabelZoom] = useRecoilState(labelZoomState);
  const { mapStyle } = useBasemapStyle(background, showLabels);
  useSyncMapUrl();

  function handleViewStateChange({ viewState }: { viewState: MapViewState }) {
    setViewState(viewState);
    setLabelZoom(viewState.zoom);
  }

  return (
    <BaseMap onMove={handleViewStateChange} viewState={viewState} mapStyle={mapStyle}>
      {children}
    </BaseMap>
  );
};
