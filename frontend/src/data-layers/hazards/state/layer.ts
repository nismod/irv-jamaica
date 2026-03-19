import { atom } from 'jotai';

import { ViewLayer } from 'lib/data-map/view-layers';
import { truthyKeys } from 'lib/helpers';
import { dataParamState } from 'lib/state/data-params';
import { sectionVisibilityState } from 'lib/state/sections';

import { hazardVisibilityState } from './hazard-visibility';
import { HazardParams } from '../domains';
import { hazardViewLayer } from '../hazard-view-layer';

export const hazardsLayerState = atom<ViewLayer[]>((get) =>
  get(sectionVisibilityState('hazards'))
    ? truthyKeys(get(hazardVisibilityState)).map((hazard) =>
        hazardViewLayer(hazard, {
          returnPeriod: get(dataParamState({ group: hazard, param: 'returnPeriod' })),
          rcp: get(dataParamState({ group: hazard, param: 'rcp' })),
          epoch: get(dataParamState({ group: hazard, param: 'epoch' })),
          confidence: get(dataParamState({ group: hazard, param: 'confidence' })),
          speed: get(dataParamState({ group: hazard, param: 'speed' })) ?? undefined,
        } as HazardParams),
      )
    : [],
);
