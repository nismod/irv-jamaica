import { waitForAll, selector, selectorFamily } from 'recoil';

import { ViewLayer } from 'lib/data-map/view-layers';
import { ConfigTree } from 'lib/nested-config/config-tree';

import { VIEW_LAYERS } from 'app/config/view-layers';
import { importLayerState } from 'data-layers/state';

import { featureBoundingBoxLayerState } from './ui/featureBoundingBox';
import { labelsLayerState } from './ui/labels';

const viewLayerState = selectorFamily<ViewLayer, string>({
  key: 'viewLayerState',
  get:
    (type) =>
    async ({ get }) => {
      const layer = await importLayerState(type);
      return get(layer);
    },
});

export const viewLayersState = selector<ConfigTree<ViewLayer>>({
  key: 'viewLayersState',
  get: ({ get }) => {
    return get(
      waitForAll([
        ...VIEW_LAYERS.map(viewLayerState),
        featureBoundingBoxLayerState,
        labelsLayerState,
      ]),
    );
  },
});
