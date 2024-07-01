import { RiskParams } from 'config/risks/domains';
import { riskViewLayer } from 'config/risks/risk-view-layer';
import { ViewLayer } from 'lib/data-map/view-layers';
import { selector, atom } from 'recoil';
import { dataParamsByGroupState } from 'state/data-params';
import { sectionVisibilityState } from 'state/sections';

export const risksSelectionState = atom({
  key: 'riskSelectionState',
  default: 'totalValue',
});

export const risksLayerState = selector<ViewLayer[]>({
  key: 'risksLayerState',
  get: ({ get }) => {
    const risksSelection = get(risksSelectionState);
    const dataParams = get(dataParamsByGroupState('risks'));
    return get(sectionVisibilityState('risks'))
      ? [riskViewLayer(risksSelection, dataParams as RiskParams)]
      : [];
  },
});
