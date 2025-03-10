import { MapViewState } from 'deck.gl';
import { StyleSpecification } from 'maplibre-gl';
import { FC, ReactNode } from 'react';
import { Map } from 'react-map-gl/maplibre';
import { useRecoilState } from 'recoil';

import { mapViewStateState, useSyncMapUrl } from 'lib/state/map-view/map-view-state';

export interface BaseMapProps {
  children?: ReactNode;
  mapStyle: StyleSpecification;
  onMove: ({ viewState }: { viewState: MapViewState }) => void;
  viewState: MapViewState;
}

const MapGLMap: FC<BaseMapProps> = ({ children, mapStyle, onMove, viewState }) => {
  return (
    <Map
      reuseMaps={true}
      styleDiffing={true}
      {...viewState}
      onMove={onMove}
      mapStyle={mapStyle}
      dragRotate={false}
      keyboard={false}
      touchZoomRotate={true}
      touchPitch={false}
      canvasContextAttributes={{
        antialias: true,
      }}
      attributionControl={false}
    >
      {children}
    </Map>
  );
};

/**
 * Displays a react-map-gl basemap component.
 * Accepts children such as a DeckGLOverlay, HUD controls etc
 */
export const BaseMap: FC<{ children?: ReactNode; mapStyle: StyleSpecification }> = ({
  children,
  mapStyle,
}) => {
  const [viewState, setViewState] = useRecoilState(mapViewStateState);
  useSyncMapUrl();
  function handleViewStateChange({ viewState }: { viewState: MapViewState }) {
    setViewState(viewState);
  }
  return (
    <MapGLMap viewState={viewState} onMove={handleViewStateChange} mapStyle={mapStyle}>
      {children}
    </MapGLMap>
  );
};
