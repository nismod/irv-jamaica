import { selector } from 'recoil';

import { ViewLayer } from 'lib/data-map/view-layers';
import { truthyKeys } from 'lib/helpers';
import { buildingsViewLayer } from 'data-layers/buildings/buildings-view-layer';
import { buildingSelectionState } from 'state/data-selection/buildings';
import { sectionVisibilityState } from 'state/sections';

export const buildingsLayerState = selector<ViewLayer[]>({
  key: 'buildingLayersState',
  get: ({ get }) =>
    get(sectionVisibilityState('buildings'))
      ? truthyKeys(get(buildingSelectionState)).map((buildingType) =>
          buildingsViewLayer(buildingType),
        )
      : [],
});
