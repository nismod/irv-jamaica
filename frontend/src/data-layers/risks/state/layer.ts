import { ViewLayer } from 'lib/data-map/view-layers';
import { selector } from 'recoil';
import { dataParamsByGroupState } from 'app/state/data-params';
import { sectionVisibilityState } from 'app/state/sections';
import { sectionStyleValueState } from 'app/state/sections';

import { RiskParams } from '../domains';
import { riskViewLayer } from '../risk-view-layer';

export const risksLayerState = selector<ViewLayer[]>({
  key: 'risksLayerState',
  get: ({ get }) => {
    const risksStyle = get(sectionStyleValueState('risks'));
    const dataParams = get(dataParamsByGroupState('risks'));
    return get(sectionVisibilityState('risks'))
      ? [riskViewLayer(risksStyle, dataParams as RiskParams)]
      : [];
  },
});
