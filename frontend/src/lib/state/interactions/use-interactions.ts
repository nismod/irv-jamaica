import { Texture } from '@luma.gl/core';
import { BitmapLayer, PickingInfo } from 'deck.gl';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import { useRecoilCallback, useSetRecoilState } from 'recoil';

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
import { RecoilStateFamily } from 'lib/recoil/types';
import { pixelSelectionState } from '../pixel-driller';

function processRasterTarget(info: any): RasterTarget {
  const { bitmap, sourceLayer, layer } = info;
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
}

function processVectorTarget(info: PickingInfo<any>): VectorTarget {
  const { object } = info;
  const feature = {
    id: object.id || object.properties?.id,
    ...object,
  };

  return object
    ? {
        feature,
      }
    : null;
}

function processTargetByType(type: InteractionStyle, info: PickingInfo<any>) {
  return type === 'raster' ? processRasterTarget(info) : processVectorTarget(info);
}

function processPickedObject(
  info: PickingInfo<any>,
  type: InteractionStyle,
  groupName: string,
  viewLayerLookup: (id: string) => ViewLayer,
  lookupViewForDeck: (deckLayerId: string) => string,
) {
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

function useSetInteractionGroupState(
  stateFamily: RecoilStateFamily<InteractionLayer | InteractionLayer[], string>,
) {
  return useRecoilCallback(({ set }) => {
    return (groupName: string, value: InteractionLayer | InteractionLayer[]) => {
      set(stateFamily(groupName), value);
    };
  });
}

/**
 * Interactive group layers, grouped by interaction group.
 * @param viewLayers
 * @returns A dictionary of arrays of view layers, grouped by interaction group.
 */
function useActiveGroups(viewLayers) {
  const interactiveLayers = viewLayers.filter((x) => x.interactionGroup);
  return groupBy(interactiveLayers, (viewLayer) => viewLayer.interactionGroup);
}

/**
 * Update stored hover and selection states whenever the active view layers change.
 * @param viewLayers
 */
function useSyncAllowedLayers(viewLayers: ViewLayer[]) {
  const activeGroups = useActiveGroups(viewLayers);
  const allowedGroupLayers = mapValues(activeGroups, (viewLayers) =>
    viewLayers.map((viewLayer) => viewLayer.id),
  );
  const setAllowedGroupLayers = useSetRecoilState(allowedGroupLayersState);
  setAllowedGroupLayers(allowedGroupLayers);
}

export function useInteractions(
  viewLayers: ViewLayer[],
  lookupViewForDeck: (deckLayerId: string) => string,
  interactionGroups: Map<string, InteractionGroupConfig>,
) {
  const setHoverXY = useSetRecoilState(hoverPositionState);

  const setInteractionGroupHover = useSetInteractionGroupState(hoverState);
  const setInteractionGroupSelection = useSetInteractionGroupState(selectionState);
  const setPixelSelection = useSetRecoilState(pixelSelectionState);

  const [primaryGroup] = [...interactionGroups.keys()];
  const primaryGroupPickingRadius = interactionGroups.get(primaryGroup).pickingRadius;

  const activeGroups = useActiveGroups(viewLayers);
  useSyncAllowedLayers(viewLayers);

  const onHover = (info: any, deck) => {
    const { x, y } = info;
    const viewLayerLookup = (id: string) => viewLayers.find((x) => x.id === id);

    for (const [groupName, layers] of Object.entries(activeGroups)) {
      const layerIds = layers.map((layer) => layer.id);
      const interactionGroup = interactionGroups.get(groupName);
      const { type, pickingRadius: radius, pickMultiple } = interactionGroup;

      const pickingParams = { x, y, layerIds, radius };

      if (pickMultiple) {
        const pickedObjects: PickingInfo<any>[] = deck.pickMultipleObjects(pickingParams);
        const interactionTargets: InteractionLayer[] = pickedObjects
          .map((info) =>
            processPickedObject(info, type, groupName, viewLayerLookup, lookupViewForDeck),
          )
          .filter(Boolean);

        setInteractionGroupHover(groupName, interactionTargets);
      } else {
        const info: PickingInfo<any> = deck.pickObject(pickingParams);
        const interactionTarget: InteractionLayer =
          info && processPickedObject(info, type, groupName, viewLayerLookup, lookupViewForDeck);

        setInteractionGroupHover(groupName, interactionTarget);
      }
    }

    setHoverXY([x, y]);
  };

  const onClick = (info: PickingInfo, deck) => {
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
    const [lon, lat] = info.coordinate;
    setPixelSelection({ lon, lat });
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
