import type { MapboxOverlay } from '@deck.gl/mapbox/typed';
import { useMap } from 'react-map-gl/maplibre';
import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import { interactionGroupsState } from 'state/layers/interaction-groups';
import { viewLayersFlatState } from 'state/layers/view-layers-flat';
import { useSaveViewLayers, viewLayersParamsState } from 'state/layers/view-layers-params';
import { backgroundState, showLabelsState } from 'map/layers/layers-state';
import { useBasemapStyle } from 'map/use-basemap-style';
import { useInteractions } from 'lib/state/interactions/use-interactions';

import { useTriggerMemo } from '../hooks/use-trigger-memo';
import { useDataLoadTrigger } from './use-data-load-trigger';

import { DeckGLOverlay } from '../map/DeckGLOverlay';
import { ViewLayer, ViewLayerParams } from './view-layers';
import { LayersList } from 'deck.gl/typed';

// set a convention where the view layer id is either the first part of the deck id before the @ sign, or it's the whole id
function lookupViewForDeck(deckLayerId: string) {
  return deckLayerId.split('@')[0];
}

export const DataMap: FC = () => {
  const deckRef = useRef<MapboxOverlay>();
  const { current: map } = useMap();
  const zoom = map.getMap().getZoom();
  const background = useRecoilValue(backgroundState);
  const showLabels = useRecoilValue(showLabelsState);
  const viewLayers = useRecoilValue(viewLayersFlatState);
  const saveViewLayers = useSaveViewLayers();
  const { firstLabelId } = useBasemapStyle(background, showLabels);

  useEffect(() => {
    saveViewLayers(viewLayers);
  }, [saveViewLayers, viewLayers]);

  const viewLayersParams = useRecoilValue(viewLayersParamsState);

  const interactionGroups = useRecoilValue(interactionGroupsState);

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
