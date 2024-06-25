import { selector } from 'recoil';

import { ViewLayer } from 'lib/data-map/view-layers';
import { sectionVisibilityState } from 'state/sections';
import { regionLevelState, showPopulationState } from 'state/regions';
import { populationViewLayer } from 'config/regions/population-view-layer';
import { regionBoundariesViewLayer } from 'config/regions/boundaries-view-layer';

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
