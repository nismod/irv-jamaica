import { Atom, atom } from 'jotai';
import { atomFamily } from 'jotai-family';

import { ConfigViewLayer } from 'lib/data-map/view-layers';

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

const layerCache = new Map<string, Atom<ConfigViewLayer>>();

const viewLayerConfig = atomFamily((type: string) =>
  atom<ConfigViewLayer | Promise<ConfigViewLayer>>((get) => {
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

export const viewLayerConfigs = atom<ConfigViewLayer | Promise<ConfigViewLayer>>((get) => {
  const extraLayers = [get(featureBoundingBoxLayerState), get(labelsLayerState)];
  const layerResults = VIEW_LAYERS.map((type) => get(viewLayerConfig(type)));

  if (layerResults.some((r) => r instanceof Promise)) {
    return Promise.all(layerResults).then((resolved) => [...resolved, ...extraLayers]);
  }

  return [...(layerResults as ConfigViewLayer[]), ...extraLayers];
});
