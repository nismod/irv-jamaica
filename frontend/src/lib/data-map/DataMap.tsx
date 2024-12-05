import type { MapboxOverlay } from '@deck.gl/mapbox';
import { LayersList, PickingInfo } from 'deck.gl';
import { useMap } from 'react-map-gl/maplibre';
import { FC, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import { useInteractions } from 'lib/state/interactions/use-interactions';
import { useDataLoadTrigger } from 'lib/data-map/use-data-load-trigger';
import { InteractionGroupConfig } from 'lib/data-map/types';
import { useSaveViewLayers, viewLayersFlatState } from 'lib/state/layers/view-layers';
import { viewLayersParamsState } from 'lib/state/layers/view-layers-params';
import { DeckGLOverlay } from 'lib/map/DeckGLOverlay';
import { ViewLayer, ViewLayerParams } from 'lib/data-map/view-layers';
import { protectedFeatureLayerDataState } from 'lib/state/protected-features';

// set a convention where the view layer id is either the first part of the deck id before the @ sign, or it's the whole id
function lookupViewForDeck(deckLayerId: string) {
  return deckLayerId.split('@')[0];
}

/**
 * Map an array of view layer objects to an array of Deck.GL layers.
 * @param viewLayers - Array of view layer objects.
 * @param viewLayersParams - View layer selection and style parameters, mapped by view layer ID.
 * @param zoom - Current map zoom level.
 * @param beforeId - ID of the first labels layer.
 * @param viewLayersData - Optional adaptation data for each view layer, mapped by view layer ID.
 * @returns Array of Deck.GL layers.
 */
function buildLayers(
  viewLayers: ViewLayer[],
  viewLayersParams: Map<string, ViewLayerParams>,
  zoom: number,
  beforeId: string | undefined,
  viewLayersData?: Map<string, Record<string, any>>,
): LayersList {
  return viewLayers.map((viewLayer) => {
    const viewLayerParams = viewLayersParams.get(viewLayer.id);
    const data = viewLayersData?.get(viewLayer.id);
    const dataFetcher = data ? async () => data : undefined;
    const deckProps = {
      id: viewLayer.id,
      pickable: !!viewLayer.interactionGroup,
      beforeId,
    };
    return viewLayer.fn({
      deckProps,
      zoom,
      ...viewLayerParams,
      dataFetcher,
    });
  });
}

/**
 * Register data loaders for an array of view layers.
 * Adds data loaders for any new layers. Destroys data loaders for any layers that have been removed.
 * @param viewLayers
 * @returns
 */
function useTrigger(viewLayers: ViewLayer[]) {
  const saveViewLayers = useSaveViewLayers();
  const dataLoaders = viewLayers
    .map((vl) => vl.dataAccessFn?.(vl.styleParams?.colorMap?.fieldSpec)?.dataLoader)
    .filter(Boolean);

  useDataLoadTrigger(dataLoaders);
  // fix a small bug where view layers don't always sync to the URL.
  saveViewLayers(viewLayers);
}

export const DataMap: FC<{
  firstLabelId: string;
  interactionGroups: Map<string, InteractionGroupConfig>;
}> = ({ firstLabelId, interactionGroups }) => {
  const deckRef = useRef<MapboxOverlay>();
  const { current: map } = useMap();
  const zoom = map.getMap().getZoom();
  const viewLayers = useRecoilValue(viewLayersFlatState);
  const viewLayersParams = useRecoilValue(viewLayersParamsState);
  const viewLayersData = useRecoilValue(protectedFeatureLayerDataState);
  const saveViewLayers = useSaveViewLayers();

  useTrigger(viewLayers);

  const { onHover, onClick, layerFilter, pickingRadius } = useInteractions(
    viewLayers,
    lookupViewForDeck,
    interactionGroups,
  );

  const layers = buildLayers(viewLayers, viewLayersParams, zoom, firstLabelId, viewLayersData);
  const onClickFeature = (info: PickingInfo) => {
    if (deckRef.current) {
      onClick?.(info, deckRef.current);
      saveViewLayers(viewLayers);
    }
  };
  const onHoverFeature = (info: PickingInfo) => {
    if (deckRef.current) {
      onHover?.(info, deckRef.current);
      saveViewLayers(viewLayers);
    }
  };

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
      onHover={onHoverFeature}
      onClick={onClickFeature}
      pickingRadius={pickingRadius}
    />
  );
};
