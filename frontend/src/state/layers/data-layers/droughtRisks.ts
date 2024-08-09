import * as droughtRiskColorSpecLookup from 'config/data-layers/droughtRisks/color-maps';
import { droughtRiskViewLayer } from 'config/data-layers/droughtRisks/drought-risk-view-layer';
import { DROUGHT_RISK_VARIABLES_WITH_RCP } from 'config/data-layers/droughtRisks/metadata';
import { ColorSpec, FieldSpec, ViewLayer } from 'lib/data-map/view-layers';
import { selector } from 'recoil';
import {
  droughtRcpParamState,
  droughtRiskVariableState,
  droughtShowRiskState,
} from 'state/data-selection/drought/drought-parameters';
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
