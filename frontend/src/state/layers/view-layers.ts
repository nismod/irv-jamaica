import { waitForAll, selector } from 'recoil';

import { ViewLayer } from 'lib/data-map/view-layers';
import { ConfigTree } from 'lib/nested-config/config-tree';

import { buildingsLayerState } from './modules/buildings';
import { droughtOptionsLayerState } from './modules/drought';
import { droughtRegionsLayerState } from './modules/drought';
import { featureBoundingBoxLayerState } from './modules/featureBoundingBox';
import { hazardsLayerState } from './modules/hazards';
import { labelsLayerState } from './modules/labels';
import { marineLayerState } from './modules/marine';
import { networksLayerState } from './modules/networks';
import { regionsLayerState } from './modules/regions';
import { terrestrialLayerState } from './modules/terrestrial';

const layerDisplayOrder = [
  regionsLayerState,
  droughtRegionsLayerState,
  terrestrialLayerState,
  marineLayerState,
  hazardsLayerState,
  buildingsLayerState,
  networksLayerState,
  droughtOptionsLayerState,
  featureBoundingBoxLayerState,
  labelsLayerState,
]

export const viewLayersState = selector<ConfigTree<ViewLayer>>({
  key: 'viewLayersState',
  get: ({ get }) => get(waitForAll(layerDisplayOrder)),
});
