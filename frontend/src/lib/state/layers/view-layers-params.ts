import { atom } from 'jotai';

import { ViewLayerParams } from 'lib/data-map/view-layers';
import { singleViewLayerParamsState, viewLayersFlatState } from 'lib/state/layers/view-layers';

/**
 * View layer selection and style parameters, mapped by view layer ID.
 */
export const viewLayersParamsState = atom<Map<string, ViewLayerParams>>((get) => {
  const viewLayers = get(viewLayersFlatState);
  const viewLayersParams = new Map<string, ViewLayerParams>();
  viewLayers.forEach((viewLayer) => {
    viewLayersParams.set(viewLayer.id, get(singleViewLayerParamsState(viewLayer.id)));
  });

  return viewLayersParams;
});
