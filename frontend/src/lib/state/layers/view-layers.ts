import { atom, atomFamily, selectorFamily, useRecoilTransaction_UNSTABLE } from 'recoil';

import { ViewLayer, ViewLayerParams } from 'lib/data-map/view-layers';
import { selectionState } from 'lib/state/interactions/interaction-state';

const viewLayerState = atomFamily<ViewLayer, string>({
  key: 'viewLayerState',
  default: null,
});

export const viewLayersFlatState = atom<ViewLayer[]>({
  key: 'viewLayersFlatState',
  default: [],
});

export const useSaveViewLayers = () => {
  return useRecoilTransaction_UNSTABLE(
    ({ set }) =>
      (viewLayers: ViewLayer[]) =>
        viewLayers.forEach((viewLayer) => set(viewLayerState(viewLayer.id), viewLayer)),
  );
};

export const singleViewLayerParamsState = selectorFamily<ViewLayerParams, string>({
  key: 'singleViewLayerParamsState',
  get:
    (viewLayerId: string) =>
    ({ get }) => {
      const viewLayer = get(viewLayerState(viewLayerId));

      const layerParams: {
        selection?: ViewLayerParams['selection'];
      } = {};

      if (viewLayer == null) return layerParams;

      const interactionGroup = viewLayer.interactionGroup;
      const groupSelection = get(selectionState(interactionGroup));

      layerParams.selection = groupSelection?.viewLayer.id === viewLayer.id ? groupSelection : null;

      return layerParams;
    },
});
