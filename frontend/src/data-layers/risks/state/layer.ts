import { atom } from 'jotai';

import { ViewLayer } from 'lib/data-map/view-layers';
import { dataParamState } from 'lib/state/data-params';

import { sectionVisibilityState, sectionStyleValueState } from 'lib/state/sections';

import { RiskParams } from '../domains';
import { riskViewLayer } from '../risk-view-layer';

export const risksLayerState = atom<ViewLayer[]>((get) => {
  const riskVisibility = get(sectionVisibilityState('risks'));
  if (!riskVisibility) {
    return [];
  }

  const riskType = get(sectionStyleValueState('risks'));

  const sectorParam = get(dataParamState({ group: 'risks', param: 'sector' }));
  const returnPeriodParam = get(dataParamState({ group: 'risks', param: 'returnPeriod' }));
  const epochParam = get(dataParamState({ group: 'risks', param: 'epoch' }));
  const rcpParam = get(dataParamState({ group: 'risks', param: 'rcp' }));
  const confidenceParam = get(dataParamState({ group: 'risks', param: 'confidence' }));

  if (
    [sectorParam, returnPeriodParam, epochParam, rcpParam, confidenceParam].some(
      (param) => param === null,
    )
  ) {
    return [];
  }

  const dataParams: RiskParams = {
    sector: String(sectorParam),
    returnPeriod: Number(returnPeriodParam),
    epoch: Number(epochParam),
    rcp: String(rcpParam),
    confidence: confidenceParam,
  };
  return [riskViewLayer(riskType, dataParams)];
});
