import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox';
import { forwardRef, useImperativeHandle } from 'react';
import { useControl } from 'react-map-gl/maplibre';

type DeckGLOverlayProps = MapboxOverlayProps;

const DeckGLOverlayWithRef = (props, ref) => {
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay.setProps(props);

  useImperativeHandle(ref, () => overlay);

  return null;
};
export const DeckGLOverlay = forwardRef<MapboxOverlay, DeckGLOverlayProps>(DeckGLOverlayWithRef);
