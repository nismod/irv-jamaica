import { RecoilValueReadOnly, waitForAll, selector, selectorFamily } from 'recoil';

import { ViewLayer } from 'lib/data-map/view-layers';
import { ConfigTree } from 'lib/nested-config/config-tree';

import { VIEW_LAYERS } from 'config/view-layers';

import { featureBoundingBoxLayerState } from './ui/featureBoundingBox';
import { labelsLayerState } from './ui/labels';

async function importLayerState(type: string): Promise<RecoilValueReadOnly<ViewLayer>> {
  const importName = `${type}LayerState`;
  const module = await import(`./data-layers/${type}.ts`);
  return module[importName];
}

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
