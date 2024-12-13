import { waitForAll, selector, selectorFamily, noWait } from 'recoil';

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

const viewLayerConfigQuery = selectorFamily<ViewLayer, string>({
  key: 'viewLayerConfigQuery',
  get:
    (type) =>
    async ({ get }) => {
      const layer = await importLayerState(type);
      return get(layer);
    },
});

const viewLayerConfig = selectorFamily<ViewLayer, string>({
  key: 'viewLayerConfig',
  get:
    (type) =>
    ({ get }) => {
      const loadable = get(noWait(viewLayerConfigQuery(type)));
      const layer = loadable.state === 'hasValue' ? loadable.contents : null;
      return layer;
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
