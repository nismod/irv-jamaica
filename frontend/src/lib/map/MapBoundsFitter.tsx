import { WebMercatorViewport } from 'deck.gl';
import { FC, useEffect } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import { atom, useAtomValue, WritableAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import { BoundingBox, appToDeckBoundingBox } from '../bounding-box';

export const mapFitBoundsState = atom<BoundingBox | null>(null) as WritableAtom<
  BoundingBox | null,
  unknown[],
  void
>;

function isValidBoundingBox(value: BoundingBox | null | undefined): value is BoundingBox {
  if (!Array.isArray(value) || value.length !== 4) {
    return false;
  }

  const [minX, minY, maxX, maxY] = value;
  if (![minX, minY, maxX, maxY].every(Number.isFinite)) {
    return false;
  }

  return minX <= maxX && minY <= maxY;
}

export const MapBoundsFitter: FC = () => {
  const { current: map } = useMap();
  const boundingBox = useAtomValue(mapFitBoundsState);

  const resetFitBounds = useResetAtom(mapFitBoundsState);
  useEffect(() => {
    // reset map fit bounds whenever map is mounted
    resetFitBounds();
  }, [resetFitBounds]);

  useEffect(() => {
    if (isValidBoundingBox(boundingBox) && map != null) {
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
  if (!isValidBoundingBox(boundingBox)) {
    return null;
  }

  const deckBbox = appToDeckBoundingBox(boundingBox);
  const viewport = new WebMercatorViewport({ width: viewportWidth, height: viewportHeight });
  const { latitude, longitude, zoom } = viewport.fitBounds(deckBbox, { padding: 20 });

  return { latitude, longitude, zoom };
}
