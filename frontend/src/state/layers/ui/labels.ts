import { selector } from 'recoil';

import { ViewLayer, viewOnlyLayer } from 'lib/data-map/view-layers';
import { regionLabelsDeckLayer } from 'data-layers/regions/region-labels-deck-layer';
import { sectionVisibilityState } from 'state/sections';
import { regionLevelState } from 'state/data-selection/regions';
import { backgroundState, showLabelsState } from 'map/layers/layers-state';

export const labelsLayerState = selector<ViewLayer[]>({
  key: 'labelsLayerState',
  get: ({ get }) => {
    const showRegions = get(sectionVisibilityState('regions'));
    const regionLevel = get(regionLevelState);
    const background = get(backgroundState);
    const showLabels = get(showLabelsState);
    const regionLabelsLayer =
      showRegions &&
      viewOnlyLayer(`boundaries_${regionLevel}-text`, () =>
        regionLabelsDeckLayer(regionLevel, background),
      );
    return showLabels && [regionLabelsLayer];
  },
});
