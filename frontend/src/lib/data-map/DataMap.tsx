import type { MapboxOverlay } from '@deck.gl/mapbox/typed';
import { useMap } from 'react-map-gl/maplibre';
import { FC, useCallback, useMemo, useRef } from 'react';

import { useInteractions } from 'lib/state/interactions/use-interactions';
import { useTriggerMemo } from 'lib/hooks/use-trigger-memo';
import { useDataLoadTrigger } from 'lib/data-map/use-data-load-trigger';
import { InteractionGroupConfig } from 'lib/data-map/types';
import { DeckGLOverlay } from 'lib/map/DeckGLOverlay';
import { ViewLayer, ViewLayerParams } from 'lib/data-map/view-layers';
import { LayersList } from 'deck.gl/typed';

// set a convention where the view layer id is either the first part of the deck id before the @ sign, or it's the whole id
function lookupViewForDeck(deckLayerId: string) {
  return deckLayerId.split('@')[0];
}

export const DataMap: FC<{
  firstLabelId: string;
  interactionGroups: Map<string, InteractionGroupConfig>;
  viewLayers: ViewLayer[];
  viewLayersParams: Record<string, ViewLayerParams>;
}> = ({ firstLabelId, interactionGroups, viewLayers, viewLayersParams }) => {
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
        makeDeckLayers(viewLayer, viewLayersParams[viewLayer.id], zoom, firstLabelId),
      ) as LayersList,
    [firstLabelId, viewLayers, viewLayersParams],
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
