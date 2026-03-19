import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { unwrap } from 'jotai/utils';

import { ViewLayerConfigs } from 'lib/data-map/view-layers';

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

const viewLayerConfigAsync = atomFamily((type: string) =>
  atom(async (get): Promise<ViewLayerConfigs> => {
    const layer = await importLayerState(type);
    return get(layer);
  }),
);

const viewLayerConfigCached = atomFamily((type: string) =>
  unwrap(viewLayerConfigAsync(type), (prev) => prev ?? undefined),
);

export const viewLayerConfigs = atom<ViewLayerConfigs>((get) => {
  const extraLayers = [get(featureBoundingBoxLayerState), get(labelsLayerState)];
  const layerResults = VIEW_LAYERS.map((type) => get(viewLayerConfigCached(type)));
  return [...layerResults.filter((r): r is ViewLayerConfigs => r !== undefined), ...extraLayers];
});
