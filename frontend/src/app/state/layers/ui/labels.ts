import { selector } from 'recoil';

import { ViewLayer, viewOnlyLayer } from 'lib/data-map/view-layers';
import { sectionVisibilityState } from 'lib/state/sections';

import { regionLabelsDeckLayer } from 'data-layers/regions/region-labels-deck-layer';
import { regionLevelState } from 'data-layers/regions/state/data-selection';
import { backgroundState, showLabelsState } from 'app/map/layers/layers-state';

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
