import { HazardParams } from 'config/view-layers/hazards/domains';
import { hazardViewLayer } from 'config/view-layers/hazards/hazard-view-layer';
import { ViewLayer } from 'lib/data-map/view-layers';
import { truthyKeys } from 'lib/helpers';
import { selector } from 'recoil';
import { dataParamsByGroupState } from 'state/data-params';
import { hazardVisibilityState } from 'state/data-selection/hazards/hazard-visibility';
import { sectionVisibilityState } from 'state/sections';

export const hazardsLayerState = selector<ViewLayer[]>({
  key: 'hazardsLayerState',
  get: ({ get }) =>
    get(sectionVisibilityState('hazards'))
      ? truthyKeys(get(hazardVisibilityState)).map((hazard) =>
          hazardViewLayer(hazard, get(dataParamsByGroupState(hazard)) as HazardParams),
        )
      : [],
});
