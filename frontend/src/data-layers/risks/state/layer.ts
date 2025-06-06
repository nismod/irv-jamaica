import { selector } from 'recoil';

import { ViewLayer } from 'lib/data-map/view-layers';
import { dataParamsByGroupState } from 'lib/state/data-params';

import { sectionVisibilityState, sectionStyleValueState } from 'lib/state/sections';

import { RiskParams } from '../domains';
import { riskViewLayer } from '../risk-view-layer';

export const risksLayerState = selector<ViewLayer[]>({
  key: 'risksLayerState',
  get: ({ get }) => {
    const riskType = get(sectionStyleValueState('risks'));
    const dataParams = get(dataParamsByGroupState('risks'));
    return get(sectionVisibilityState('risks'))
      ? [riskViewLayer(riskType, dataParams as RiskParams)]
      : [];
  },
});
