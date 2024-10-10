import { MapViewState } from 'deck.gl/typed';
import { StyleSpecification } from 'maplibre-gl';
import { FC, ReactNode } from 'react';
import { Map } from 'react-map-gl/maplibre';

export interface BaseMapProps {
  children?: ReactNode;
  mapStyle: StyleSpecification;
  onMove: ({ viewState }: { viewState: MapViewState }) => void;
  viewState: MapViewState;
}

/**
 * Displays a react-map-gl basemap component.
 * Accepts children such as a DeckGLOverlay, HUD controls etc
 */
export const BaseMap: FC<BaseMapProps> = ({ children, mapStyle, onMove, viewState }) => {
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
      antialias={true}
      attributionControl={false}
    >
      {children}
    </Map>
  );
};
