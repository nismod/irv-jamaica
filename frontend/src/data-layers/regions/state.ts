import { selector } from 'recoil';

import { ViewLayer } from 'lib/data-map/view-layers';
import { sectionVisibilityState } from 'state/sections';
import { regionLevelState, showPopulationState } from 'state/data-selection/regions';
import { populationViewLayer } from 'data-layers/regions/population-view-layer';
import { regionBoundariesViewLayer } from 'data-layers/regions/boundaries-view-layer';

export const regionsLayerState = selector<ViewLayer>({
  key: 'regionsLayerState',
  get: ({ get }) => {
    const showRegions = get(sectionVisibilityState('regions'));
    const showPopulation = get(showPopulationState);
    const regionLevel = get(regionLevelState);
    const regionLayer = showPopulation ? populationViewLayer : regionBoundariesViewLayer;
    return showRegions && regionLayer(regionLevel);
  },
});
