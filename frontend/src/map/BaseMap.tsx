import { MapViewState } from 'deck.gl/typed';
import { FC, ReactNode } from 'react';
import { Map } from 'react-map-gl/maplibre';
import { useRecoilState, useRecoilValue } from 'recoil';

import { backgroundState, showLabelsState } from 'map/layers/layers-state';
import { useBasemapStyle } from 'map/use-basemap-style';
import { mapViewStateState, useSyncMapUrl } from 'state/map-view/map-view-state';

export interface BaseMapProps {
  children?: ReactNode;
}

/**
 * Displays a react-map-gl basemap component.
 * Accepts children such as a DeckGLOverlay, HUD controls etc
 */
export const BaseMap: FC<BaseMapProps> = ({ children }) => {
  const background = useRecoilValue(backgroundState);
  const showLabels = useRecoilValue(showLabelsState);
  const [viewState, setViewState] = useRecoilState(mapViewStateState);
  const { mapStyle } = useBasemapStyle(background, showLabels);
  useSyncMapUrl();

  function handleViewStateChange({ viewState }: { viewState: MapViewState }) {
    setViewState(viewState);
  }

  return (
    <Map
      reuseMaps={true}
      styleDiffing={true}
      {...viewState}
      onMove={handleViewStateChange}
      mapStyle={mapStyle}
      dragRotate={false}
      keyboard={false}
      touchZoomRotate={true}
      touchPitch={false}
      antialias={true}
      attributionControl={false}
    >
      {children}
    </Map>
  );
};
