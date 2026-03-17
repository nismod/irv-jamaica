import { Atom, atom } from 'jotai';
import { atomFamily } from 'jotai-family';

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

const layerCache = new Map<string, Atom<ViewLayer>>();

const viewLayerConfig = atomFamily((type: string) =>
  atom<ViewLayer | Promise<ViewLayer>>((get) => {
    if (layerCache.has(type)) {
      // Synchronous path: dynamic import already resolved, no suspend on re-evaluation
      return get(layerCache.get(type));
    }
    // Async path: only taken once per layer type on first load
    return importLayerState(type).then((layer) => {
      layerCache.set(type, layer);
      return get(layer);
    });
  }),
);

export const viewLayerConfigs = atom<ConfigTree<ViewLayer> | Promise<ConfigTree<ViewLayer>>>((get) => {
  const extraLayers = [get(featureBoundingBoxLayerState), get(labelsLayerState)];
  const layerResults = VIEW_LAYERS.map((type) => get(viewLayerConfig(type)));

  if (layerResults.some((r) => r instanceof Promise)) {
    return Promise.all(layerResults).then((resolved) => [...resolved, ...extraLayers]);
  }

  return [...(layerResults as ViewLayer[]), ...extraLayers];
});
