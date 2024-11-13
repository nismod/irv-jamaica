import { selector } from 'recoil';

import { ViewLayer } from 'lib/data-map/view-layers';
import { truthyKeys } from 'lib/helpers';
import { dataParamsByGroupState } from 'lib/state/data-params';
import { sectionVisibilityState } from 'app/state/sections';

import { hazardVisibilityState } from './hazard-visibility';
import { HazardParams } from '../domains';
import { hazardViewLayer } from '../hazard-view-layer';

export const hazardsLayerState = selector<ViewLayer[]>({
  key: 'hazardsLayerState',
  get: ({ get }) =>
    get(sectionVisibilityState('hazards'))
      ? truthyKeys(get(hazardVisibilityState)).map((hazard) =>
          hazardViewLayer(hazard, get(dataParamsByGroupState(hazard)) as HazardParams),
        )
      : [],
});
