import * as droughtRiskColorSpecLookup from 'config/droughtRisks/color-maps';
import { droughtRiskViewLayer } from 'config/droughtRisks/drought-risk-view-layer';
import { DROUGHT_RISK_VARIABLES_WITH_RCP } from 'config/droughtRisks/metadata';
import { ColorSpec, FieldSpec, ViewLayer } from 'lib/data-map/view-layers';
import { selector } from 'recoil';
import {
  droughtRcpParamState,
  droughtRiskVariableState,
  droughtShowRiskState,
} from 'state/drought/drought-parameters';
import { sectionVisibilityState } from 'state/sections';

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
