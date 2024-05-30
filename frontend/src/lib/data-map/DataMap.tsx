import type { MapboxOverlay } from '@deck.gl/mapbox/typed';
import { useMap } from 'react-map-gl/maplibre';
import { FC, useCallback, useMemo, useRef } from 'react';

import { useTriggerMemo } from '../hooks/use-trigger-memo';
import { useDataLoadTrigger } from './use-data-load-trigger';

import { DeckGLOverlay } from '../map/DeckGLOverlay';
import { useInteractions } from './interactions/use-interactions';
import { ViewLayer, ViewLayerParams } from './view-layers';

export interface DataMapProps {
  beforeId: string,
  viewLayers: ViewLayer[];
  viewLayersParams: Record<string, ViewLayerParams>;
  interactionGroups: any;
}

// set a convention where the view layer id is either the first part of the deck id before the @ sign, or it's the whole id
function lookupViewForDeck(deckLayerId: string) {
  return deckLayerId.split('@')[0];
}

export const DataMap: FC<DataMapProps> = ({
  beforeId,
  viewLayers,
  viewLayersParams,
  interactionGroups,
}) => {
  const deckRef = useRef<MapboxOverlay>();
  const { current: map } = useMap();
  const zoom = map.getMap().getZoom();

  const dataLoaders = useMemo(
    () =>
      viewLayers
        .map((vl) => vl.dataAccessFn?.(vl.styleParams?.colorMap?.fieldSpec)?.dataLoader)
        .filter(Boolean),
    [viewLayers],
  );

  const dataLoadTrigger = useDataLoadTrigger(dataLoaders);


  const layersFunction = useCallback(
    ({ zoom }: { zoom: number }) =>
      viewLayers.map((viewLayer) =>
        makeDeckLayers(viewLayer, viewLayersParams[viewLayer.id], zoom, beforeId),
      ),
    [beforeId, viewLayers, viewLayersParams],
  );

  const { onHover, onClick, layerFilter, pickingRadius } = useInteractions(
    viewLayers,
    lookupViewForDeck,
    interactionGroups,
  );

  const layers = useTriggerMemo(
    () => layersFunction({ zoom }),
    [layersFunction, zoom],
    dataLoadTrigger,
  );

  return (
    <DeckGLOverlay
      interleaved={true}
      ref={deckRef}
      style={{
        overflow: 'hidden',
      }}
      getCursor={() => 'default'}
      layers={layers}
      layerFilter={layerFilter}
      onHover={(info) => deckRef.current && onHover?.(info, deckRef.current)}
      onClick={(info) => deckRef.current && onClick?.(info, deckRef.current)}
      pickingRadius={pickingRadius}
    />
  );
};

function makeDeckLayers(
  viewLayer: ViewLayer,
  viewLayerParams: ViewLayerParams,
  zoom: number,
  beforeId: string | undefined,
) {
  return viewLayer.fn({
    deckProps: { id: viewLayer.id, pickable: !!viewLayer.interactionGroup, beforeId },
    zoom,
    ...viewLayerParams,
  });
}
