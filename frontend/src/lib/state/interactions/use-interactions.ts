import { Texture } from '@luma.gl/core';
import { BitmapLayer, PickingInfo } from 'deck.gl';
import { WritableAtom, useAtomValue, useSetAtom } from 'jotai';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import { useAtomCallback } from 'jotai/utils';
import { useCallback, useEffect, useMemo } from 'react';

import { ViewLayer } from 'lib/data-map/view-layers';
import {
  InteractionGroupConfig,
  InteractionStyle,
  InteractionTarget,
  RasterTarget,
  VectorTarget,
} from 'lib/data-map/types';

import {
  hoverState,
  hoverPositionState,
  selectionState,
  allowedGroupLayersState,
} from './interaction-state';
import { pixelSelectionState } from '../pixel-driller';
import { mapInteractionModeState } from '../map-interaction-state';

type DeckPicker = {
  pickMultipleObjects: (params: unknown) => PickingInfo<unknown>[];
  pickObject: (params: unknown) => PickingInfo<unknown>;
};

function processRasterTarget(info: PickingInfo<unknown>): RasterTarget | null {
  const rasterInfo = info as PickingInfo<unknown> & {
    bitmap?: { pixel: [number, number] };
    sourceLayer?: BitmapLayer;
    layer: {
      context: {
        device: {
          readPixelsToArrayWebGL: (
            image: Texture,
            options: {
              sourceX: number;
              sourceY: number;
              sourceWidth: number;
              sourceHeight: number;
            },
          ) => Uint8Array;
        };
      };
    };
  };

  const { bitmap, sourceLayer, layer } = rasterInfo;
  if (bitmap) {
    const { device } = layer.context;
    // the current deck.gl docs suggest using the deprecated function - see https://github.com/visgl/deck.gl/issues/9493
    const pixelColor = device.readPixelsToArrayWebGL(
      (sourceLayer as BitmapLayer).props.image as Texture,
      {
        sourceX: bitmap.pixel[0],
        sourceY: bitmap.pixel[1],
        sourceWidth: 1,
        sourceHeight: 1,
      },
    );

    return pixelColor[3]
      ? {
          color: Array.from(pixelColor) as [number, number, number, number],
        }
      : null;
  }

  return null;
}

function processVectorTarget(info: PickingInfo<unknown>): VectorTarget | null {
  const object = info.object as
    | ({ id?: unknown; properties?: { id?: unknown } } & Record<string, unknown>)
    | null;
  if (!object) return null;

  const feature = {
    id: object.id || object.properties?.id,
    ...object,
  } as VectorTarget['feature'];

  return {
    feature,
  };
}

function processTargetByType(type: InteractionStyle, info: PickingInfo<unknown>) {
  return type === 'raster' ? processRasterTarget(info) : processVectorTarget(info);
}

function processPickedObject(
  info: PickingInfo<unknown>,
  type: InteractionStyle,
  groupName: string,
  viewLayerLookup: (id: string) => ViewLayer,
  lookupViewForDeck: (deckLayerId: string) => string,
) {
  if (!info?.layer) return null;
  const deckLayerId = info.layer.id;
  const viewLayerId = lookupViewForDeck(deckLayerId);
  const target = processTargetByType(type, info);

  return (target && {
    interactionGroup: groupName,
    interactionStyle: type,
    viewLayer: viewLayerLookup(viewLayerId),
    target,
  }) as InteractionLayer;
}

type InteractionLayer = InteractionTarget<VectorTarget> | InteractionTarget<RasterTarget>;

type AtomFamily<T> = (groupName: string) => WritableAtom<T, unknown[], void>;

function useSetInteractionGroupState<T>(stateFamily: AtomFamily<T>) {
  return useAtomCallback(
    useCallback(
      (_get, set, groupName: string, value: T) => {
        set(stateFamily(groupName), value as never);
      },
      [stateFamily],
    ),
  );
}

/**
 * Interactive group layers, grouped by interaction group.
 * @param viewLayers
 * @returns A dictionary of arrays of view layers, grouped by interaction group.
 */
function useActiveGroups(viewLayers) {
  return useMemo(() => {
    const interactiveLayers = viewLayers.filter((x) => x.interactionGroup);
    return groupBy(interactiveLayers, (viewLayer) => viewLayer.interactionGroup);
  }, [viewLayers]);
}

/**
 * Update stored hover and selection states whenever the active view layers change.
 * @param viewLayers
 */
function useSyncAllowedLayers(viewLayers: ViewLayer[]) {
  const activeGroups = useActiveGroups(viewLayers);
  const allowedGroupLayers = useMemo(
    () => mapValues(activeGroups, (viewLayers) => viewLayers.map((viewLayer) => viewLayer.id)),
    [activeGroups],
  );
  const setAllowedGroupLayers = useSetAtom(allowedGroupLayersState);
  useEffect(() => {
    setAllowedGroupLayers(allowedGroupLayers);
  }, [allowedGroupLayers, setAllowedGroupLayers]);
}

export function useInteractions(
  viewLayers: ViewLayer[],
  lookupViewForDeck: (deckLayerId: string) => string,
  interactionGroups: Map<string, InteractionGroupConfig>,
) {
  const setHoverXY = useSetAtom(hoverPositionState);

  const setInteractionGroupHover = useSetInteractionGroupState(hoverState);
  const setInteractionGroupSelection = useSetInteractionGroupState(selectionState);
  const setPixelSelection = useSetAtom(pixelSelectionState);
  const interactionMode = useAtomValue(mapInteractionModeState);

  const [primaryGroup] = [...interactionGroups.keys()];
  const primaryGroupPickingRadius = interactionGroups.get(primaryGroup).pickingRadius;

  const activeGroups = useActiveGroups(viewLayers);
  useSyncAllowedLayers(viewLayers);

  const onHover = (info: PickingInfo<unknown>, deck: DeckPicker) => {
    const { x, y } = info;
    const viewLayerLookup = (id: string) => viewLayers.find((x) => x.id === id);

    for (const [groupName, layers] of Object.entries(activeGroups)) {
      const layerIds = layers.map((layer) => layer.id);
      const interactionGroup = interactionGroups.get(groupName);
      const { type, pickingRadius: radius, pickMultiple } = interactionGroup;

      const pickingParams = { x, y, layerIds, radius };

      if (pickMultiple) {
        const pickedObjects: PickingInfo<unknown>[] = deck.pickMultipleObjects(pickingParams);
        const interactionTargets: InteractionLayer[] = pickedObjects
          .map((info) =>
            processPickedObject(info, type, groupName, viewLayerLookup, lookupViewForDeck),
          )
          .filter(Boolean);

        setInteractionGroupHover(groupName, interactionTargets);
      } else {
        const info: PickingInfo<unknown> = deck.pickObject(pickingParams);
        const interactionTarget: InteractionLayer =
          info && processPickedObject(info, type, groupName, viewLayerLookup, lookupViewForDeck);

        setInteractionGroupHover(groupName, interactionTarget);
      }
    }

    setHoverXY([x, y]);
  };

  const onClick = (info: PickingInfo, deck: DeckPicker) => {
    const { x, y } = info;
    const viewLayerLookup = (id: string) => viewLayers.find((x) => x.id === id);

    for (const [groupName, viewLayers] of Object.entries(activeGroups)) {
      const viewLayerIds = viewLayers.map((layer) => layer.id);

      const interactionGroup = interactionGroups.get(groupName);
      const { type, pickingRadius: radius } = interactionGroup;

      // currently only supports selecting vector features
      if (interactionGroup.type === 'vector') {
        const info = deck.pickObject({ x, y, layerIds: viewLayerIds, radius });
        const selectionTarget =
          info && processPickedObject(info, type, groupName, viewLayerLookup, lookupViewForDeck);

        setInteractionGroupSelection(groupName, selectionTarget);
      }
    }

    if (interactionMode === 'pixel-driller') {
      const [lon, lat] = info.coordinate;
      setPixelSelection({ lon, lat });
    }
  };

  /**
   * Interaction groups which should be rendered during the hover picking pass
   */
  const hoverPassGroups = [...interactionGroups.values()]
    .filter((group) => group.usesAutoHighlight || group.id === primaryGroup)
    .map((group) => group.id);

  const layerFilter = ({ layer: deckLayer, renderPass }) => {
    if (renderPass === 'picking:hover') {
      const viewLayerId = lookupViewForDeck(deckLayer.id);
      const viewLayerLookup = (id: string) => viewLayers.find((x) => x.id === id);
      const interactionGroup = viewLayerLookup(viewLayerId)?.interactionGroup;

      return interactionGroup ? hoverPassGroups.includes(interactionGroup) : false;
    }
    return true;
  };

  return {
    onHover,
    onClick,
    layerFilter,
    pickingRadius: primaryGroupPickingRadius,
  };
}
