import _ from 'lodash';
import { selector } from 'recoil';

import { ViewLayerParams } from 'lib/data-map/view-layers';
import { singleViewLayerParamsState } from 'lib/state/layers/view-layers';

import { viewLayersFlatState } from './view-layers-flat';

export const viewLayersParamsState = selector<Record<string, ViewLayerParams>>({
  key: 'viewLayersParamsState',
  get: ({ get }) => {
    const viewLayers = get(viewLayersFlatState);

    return _(viewLayers)
      .keyBy('id')
      .mapValues((viewLayer) => get(singleViewLayerParamsState(viewLayer.id)))
      .value();
  },
});
