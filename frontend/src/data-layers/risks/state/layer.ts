import { atom } from 'jotai';

import { ViewLayer } from 'lib/data-map/view-layers';
import { dataParamState } from 'lib/state/data-params';

import { sectionVisibilityState, sectionStyleValueState } from 'lib/state/sections';

import { RiskParams } from '../domains';
import { riskViewLayer } from '../risk-view-layer';

export const risksLayerState = atom<ViewLayer[]>((get) => {
  const riskType = get(sectionStyleValueState('risks'));
  const dataParams: RiskParams = {
    sector: get(dataParamState({ group: 'risks', param: 'sector' })),
    returnPeriod: get(dataParamState({ group: 'risks', param: 'returnPeriod' })),
    epoch: get(dataParamState({ group: 'risks', param: 'epoch' })),
    rcp: get(dataParamState({ group: 'risks', param: 'rcp' })),
    confidence: get(dataParamState({ group: 'risks', param: 'confidence' })),
  };
  return get(sectionVisibilityState('risks'))
    ? [riskViewLayer(riskType, dataParams)]
    : [];
});
