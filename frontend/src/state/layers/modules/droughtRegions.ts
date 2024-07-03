import { VECTOR_COLOR_MAPS } from 'config/color-maps';
import { droughtRiskViewLayer } from 'config/droughtRegions/drought-risk-view-layer';
import {
  DroughtRiskVariableType,
  DROUGHT_RISK_VARIABLES_WITH_RCP,
} from 'config/droughtRegions/metadata';
import { ColorSpec, FieldSpec, ViewLayer } from 'lib/data-map/view-layers';
import { selector } from 'recoil';
import {
  droughtRcpParamState,
  droughtRiskVariableState,
  droughtShowRiskState,
} from 'state/drought/drought-parameters';
import { sectionVisibilityState } from 'state/sections';

export const droughtRegionsFieldSpecState = selector<FieldSpec>({
  key: 'droughtRegionsFieldSpecState',
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

const droughtRiskColorSpecLookup: Record<DroughtRiskVariableType, ColorSpec> = {
  mean_monthly_water_stress_: VECTOR_COLOR_MAPS.droughtRiskWaterStress,
  epd: VECTOR_COLOR_MAPS.droughtRiskEpd,
  eael: VECTOR_COLOR_MAPS.droughtRiskEael,
};

export const droughtRegionsColorSpecState = selector<ColorSpec>({
  key: 'droughtRegionsColorSpecState',
  get: ({ get }) => {
    const field = get(droughtRiskVariableState);
    return droughtRiskColorSpecLookup[field];
  },
});

export const droughtRegionsLayerState = selector<ViewLayer>({
  key: 'droughtRegionsLayerState',
  get: ({ get }) => {
    const showDroughts = get(sectionVisibilityState('drought')) && get(droughtShowRiskState);

    if (!showDroughts) {
      return null;
    }

    const fieldSpec = get(droughtRegionsFieldSpecState);
    const colorSpec = get(droughtRegionsColorSpecState);

    return droughtRiskViewLayer({ fieldSpec, colorSpec });
  },
});
