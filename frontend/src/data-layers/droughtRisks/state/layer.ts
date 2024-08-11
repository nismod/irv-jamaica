import { selector } from 'recoil';

import { ColorSpec, FieldSpec, ViewLayer } from 'lib/data-map/view-layers';
import { sectionVisibilityState } from 'state/sections';

import * as droughtRiskColorSpecLookup from '../color-maps';
import { droughtRiskViewLayer } from '../drought-risk-view-layer';
import { DROUGHT_RISK_VARIABLES_WITH_RCP } from '../metadata';
import {
  droughtRcpParamState,
  droughtRiskVariableState,
  droughtShowRiskState,
} from './data-selection';

export const droughtRisksFieldSpecState = selector<FieldSpec>({
  key: 'droughtRisksFieldSpecState',
  get: ({ get }) => {
    const field = get(droughtRiskVariableState);

    const rcp = get(droughtRcpParamState);

    return {
      fieldGroup: 'properties',
      field,
      fieldDimensions: DROUGHT_RISK_VARIABLES_WITH_RCP.includes(field)
        ? {
            rcp,
          }
        : {},
    };
  },
});

export const droughtRisksColorSpecState = selector<ColorSpec>({
  key: 'droughtRisksColorSpecState',
  get: ({ get }) => {
    const field = get(droughtRiskVariableState);
    return droughtRiskColorSpecLookup[field];
  },
});

export const droughtRisksLayerState = selector<ViewLayer>({
  key: 'droughtRegionsLayerState',
  get: ({ get }) => {
    const showDroughts = get(sectionVisibilityState('drought')) && get(droughtShowRiskState);

    if (!showDroughts) {
      return null;
    }

    const fieldSpec = get(droughtRisksFieldSpecState);
    const colorSpec = get(droughtRisksColorSpecState);

    return droughtRiskViewLayer({ fieldSpec, colorSpec });
  },
});
