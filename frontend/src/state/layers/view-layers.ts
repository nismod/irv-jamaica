import { waitForAll, selector } from 'recoil';

import { ViewLayer } from 'lib/data-map/view-layers';
import { ConfigTree } from 'lib/nested-config/config-tree';

import { buildingsLayerState } from './view-layers/buildings';
import { droughtOptionsLayerState } from './view-layers/droughtOptions';
import { droughtRisksLayerState } from './view-layers/droughtRisks';
import { featureBoundingBoxLayerState } from './ui/featureBoundingBox';
import { hazardsLayerState } from './view-layers/hazards';
import { labelsLayerState } from './view-layers/labels';
import { marineLayerState } from './view-layers/marine';
import { networksLayerState } from './view-layers/networks';
import { regionsLayerState } from './view-layers/regions';
import { terrestrialLayerState } from './view-layers/terrestrial';

export const viewLayersState = selector<ConfigTree<ViewLayer>>({
  key: 'viewLayersState',
  get: ({ get }) =>
    get(
      waitForAll([
        regionsLayerState,
        droughtRisksLayerState,
        terrestrialLayerState,
        marineLayerState,
        hazardsLayerState,
        buildingsLayerState,
        networksLayerState,
        droughtOptionsLayerState,
        featureBoundingBoxLayerState,
        labelsLayerState,
      ]),
    ),
});
