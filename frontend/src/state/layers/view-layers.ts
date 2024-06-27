import { RecoilValueReadOnly, waitForAll, selector } from 'recoil';

import { VIEW_LAYERS } from 'config/view-layers';
import { ViewLayer } from 'lib/data-map/view-layers';
import { ConfigTree } from 'lib/nested-config/config-tree';

async function importLayerState(type: string): Promise<RecoilValueReadOnly<ViewLayer>> {
  const filename = type === 'droughtOptions' || type === 'droughtRegions' ? 'drought' : type;
  const module = await import(`./modules/${filename}.ts`);
  return module[`${type}LayerState`];
}

const loadLayers = Promise.all(VIEW_LAYERS.map(importLayerState));

export const viewLayersState = selector<ConfigTree<ViewLayer>>({
  key: 'viewLayersState',
  get: ({ get }) => loadLayers.then((layers) => get(waitForAll(layers))),
});
