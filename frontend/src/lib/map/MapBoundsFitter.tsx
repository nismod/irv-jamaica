import { WebMercatorViewport } from 'deck.gl';
import { FC, useEffect } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import { atom, useRecoilValue, useResetRecoilState } from 'recoil';

import { BoundingBox, appToDeckBoundingBox } from '../bounding-box';

export const mapFitBoundsState = atom<BoundingBox>({
  key: 'mapFitBoundsState',
  default: null,
});

export const MapBoundsFitter: FC = () => {
  const { current: map } = useMap();
  const boundingBox = useRecoilValue(mapFitBoundsState);

  const resetFitBounds = useResetRecoilState(mapFitBoundsState);
  useEffect(() => {
    // reset map fit bounds whenever map is mounted
    resetFitBounds();
  }, [resetFitBounds]);

  useEffect(() => {
    if (boundingBox != null && map != null) {
      map.fitBounds(boundingBox, {});
    }
  }, [boundingBox, map]);

  return null;
};

export function getBoundingBoxViewState(
  boundingBox: BoundingBox,
  viewportWidth = 800,
  viewportHeight = 600,
) {
  const deckBbox = appToDeckBoundingBox(boundingBox);
  const viewport = new WebMercatorViewport({ width: viewportWidth, height: viewportHeight });
  const { latitude, longitude, zoom } = viewport.fitBounds(deckBbox, { padding: 20 });

  return { latitude, longitude, zoom };
}
