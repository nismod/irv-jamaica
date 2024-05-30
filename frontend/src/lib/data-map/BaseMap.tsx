import { MapViewState } from 'deck.gl/typed';
import { ComponentProps, FC, ReactNode } from 'react';
import { Map } from 'react-map-gl/maplibre';

export interface BaseMapProps {
  mapStyle: ComponentProps<typeof Map>['mapStyle'];
  viewState: MapViewState;
  onViewState: (vs: MapViewState) => void;
  children?: ReactNode;
}

/**
 * Displays a react-map-gl basemap component.
 * Accepts children such as a DeckGLOverlay, HUD controls etc
 */
export const BaseMap: FC<BaseMapProps> = ({ mapStyle, viewState, onViewState, children }) => {
  return (
    <Map
      reuseMaps={true}
      styleDiffing={true}
      {...viewState}
      onMove={({ viewState }) => onViewState(viewState)}
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
