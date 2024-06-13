import { RiskParams } from 'config/view-layers/risks/domains';
import { riskViewLayer } from 'config/view-layers/risks/risk-view-layer';
import { ViewLayer } from 'lib/data-map/view-layers';
import { selector } from 'recoil';
import { dataParamsByGroupState } from 'state/data-params';
import { sectionVisibilityState } from 'state/sections';
import { sectionStyleValueState } from 'state/sections';

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
