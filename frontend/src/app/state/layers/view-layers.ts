import { waitForAll, selector, selectorFamily } from 'recoil';

import { ViewLayer } from 'lib/data-map/view-layers';
import { ConfigTree } from 'lib/nested-config/config-tree';

import { importLayerState } from 'data-layers/state';

import { featureBoundingBoxLayerState } from './ui/featureBoundingBox';
import { labelsLayerState } from './ui/labels';

const VIEW_LAYERS = [
  'regions',
  'droughtRisks',
  'terrestrial',
  'marine',
  'hazards',
  'risks',
  'buildings',
  'networks',
  'droughtOptions',
] as string[];

const viewLayerConfig = selectorFamily<ViewLayer, string>({
  key: 'viewLayerConfig',
  get:
    (type) =>
    async ({ get }) => {
      const layer = await importLayerState(type);
      return get(layer);
    },
});

export const viewLayerConfigs = selector<ConfigTree<ViewLayer>>({
  key: 'viewLayerConfigs',
  get: ({ get }) => {
    return get(
      waitForAll([
        ...VIEW_LAYERS.map(viewLayerConfig),
        featureBoundingBoxLayerState,
        labelsLayerState,
      ]),
    );
  },
});
