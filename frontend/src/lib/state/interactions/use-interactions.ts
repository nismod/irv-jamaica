import DeckGL, { Deck, PickInfo } from 'deck.gl';
import { readPixelsToArray } from '@luma.gl/core';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilCallback, useSetRecoilState } from 'recoil';

import { ViewLayer } from 'lib/data-map/view-layers';
import { InteractionGroupConfig, InteractionStyle, InteractionTarget, RasterTarget, VectorTarget } from 'lib/data-map/types';

import {
  hoverState,
  hoverPositionState,
  selectionState,
  allowedGroupLayersState,
} from './interaction-state';
import { RecoilStateFamily } from 'lib/recoil/types';

function processRasterTarget(info: any): RasterTarget {
  const { bitmap, sourceLayer } = info;
  if (bitmap) {
    const pixelColor = readPixelsToArray(sourceLayer.props.image, {
      sourceX: bitmap.pixel[0],
      sourceY: bitmap.pixel[1],
      sourceWidth: 1,
      sourceHeight: 1,
      sourceType: undefined,
    });

    return pixelColor[3]
      ? {
          color: pixelColor,
        }
      : null;
  }
}

function processVectorTarget(info: PickInfo<any>): VectorTarget {
  const { object } = info;

  return object
    ? {
        feature: object,
      }
    : null;
}

function processTargetByType(type: InteractionStyle, info: PickInfo<any>) {
  return type === 'raster' ? processRasterTarget(info) : processVectorTarget(info);
}

function processPickedObject(
  info: PickInfo<any>,
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

export function useInteractions(
  viewLayers: ViewLayer[],
  lookupViewForDeck: (deckLayerId: string) => string,
  interactionGroups: Map<string, InteractionGroupConfig>,
) {
  const setHoverXY = useSetRecoilState(hoverPositionState);

  const setInteractionGroupHover = useSetInteractionGroupState(hoverState);
  const setInteractionGroupSelection = useSetInteractionGroupState(selectionState);

  const [primaryGroup] = [...interactionGroups.keys()];
  const primaryGroupPickingRadius = interactionGroups.get(primaryGroup).pickingRadius;

  const interactiveLayers = viewLayers.filter((x) => x.interactionGroup);

  const activeGroups = useMemo(
    () => groupBy(interactiveLayers, (viewLayer) => viewLayer.interactionGroup),
    [interactiveLayers],
  );

  const setAllowedGroupLayers = useSetRecoilState(allowedGroupLayersState);

  useEffect(() => {
    setAllowedGroupLayers(
      mapValues(activeGroups, (viewLayers) => viewLayers.map((viewLayer) => viewLayer.id)),
    );
  }, [activeGroups, setAllowedGroupLayers]);

  const onHover = useCallback(
    (info: any, deck: Deck) => {
      const { x, y } = info;
      const viewLayerLookup = (id: string) => viewLayers.find((x) => x.id === id);

      for (const [groupName, layers] of Object.entries(activeGroups)) {
        const layerIds = layers.map((layer) => layer.id);
        const interactionGroup = interactionGroups.get(groupName);
        const { type, pickingRadius: radius, pickMultiple } = interactionGroup;

        const pickingParams = { x, y, layerIds, radius };

        if (pickMultiple) {
          const pickedObjects: PickInfo<any>[] = deck.pickMultipleObjects(pickingParams);
          const interactionTargets: InteractionLayer[] = pickedObjects
            .map((info) =>
              processPickedObject(info, type, groupName, viewLayerLookup, lookupViewForDeck),
            )
            .filter(Boolean);

          setInteractionGroupHover(groupName, interactionTargets);
        } else {
          const info: PickInfo<any> = deck.pickObject(pickingParams);
          const interactionTarget: InteractionLayer =
            info && processPickedObject(info, type, groupName, viewLayerLookup, lookupViewForDeck);

          setInteractionGroupHover(groupName, interactionTarget);
        }
      }

      setHoverXY([x, y]);
    },
    [
      activeGroups,
      interactionGroups,
      lookupViewForDeck,
      setHoverXY,
      setInteractionGroupHover,
      viewLayers,
    ],
  );

  const onClick = useCallback(
    (info: any, deck: DeckGL) => {
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
    },
    [activeGroups, interactionGroups, lookupViewForDeck, setInteractionGroupSelection, viewLayers],
  );

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
