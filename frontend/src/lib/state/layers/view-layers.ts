import { useCallback } from 'react';
import { atom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { atomFamily } from 'jotai-family';

import { ViewLayer, ViewLayerParams } from 'lib/data-map/view-layers';
import { selectionState } from 'lib/state/interactions/interaction-state';

export const viewLayerState = atomFamily(
  (_id: string) => atom(null as ViewLayer | null),
);

export const viewLayersFlatState = atom<ViewLayer[]>([]);

export const useSaveViewLayers = () => {
  return useAtomCallback(
    useCallback(
      (_get, set, viewLayers: ViewLayer[]) =>
        viewLayers.forEach((viewLayer) => {
          if (!viewLayer?.id) {
            return;
          }
          set(viewLayerState(viewLayer.id), viewLayer);
        }),
      [],
    ),
  );
};

export const singleViewLayerParamsState = atomFamily((viewLayerId: string) =>
  atom<ViewLayerParams>((get) => {
    const viewLayer = get(viewLayerState(viewLayerId));

    const layerParams: {
      selection?: ViewLayerParams['selection'];
    } = {};

    if (viewLayer == null) return layerParams;

    const interactionGroup = viewLayer.interactionGroup;
    const groupSelection = get(selectionState(interactionGroup));

    layerParams.selection = groupSelection?.viewLayer.id === viewLayer.id ? groupSelection : null;

    return layerParams;
  }),
);
