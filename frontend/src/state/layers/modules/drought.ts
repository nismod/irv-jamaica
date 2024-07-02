import { VECTOR_COLOR_MAPS } from 'config/color-maps';
import { droughtOptionsViewLayer } from 'config/drought/drought-options-view-layer';
import { droughtRiskViewLayer } from 'config/drought/drought-risk-view-layer';
import {
  DroughtOptionsVariableType,
  DroughtRiskVariableType,
  DROUGHT_OPTIONS_VARIABLES_WITH_RCP,
  DROUGHT_RISK_VARIABLES_WITH_RCP,
} from 'config/drought/metadata';
import { ColorSpec, FieldSpec, ViewLayer } from 'lib/data-map/view-layers';
import { selector } from 'recoil';
import {
  droughtOptionsVariableState,
  droughtRcpParamState,
  droughtRiskVariableState,
  droughtShowOptionsState,
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

export const droughtOptionsFieldSpecState = selector<FieldSpec>({
  key: 'droughtOptionsFieldSpecState',
  get: ({ get }) => {
    const field = get(droughtOptionsVariableState);

    const rcp = get(droughtRcpParamState);

    return {
      fieldGroup: 'properties',
      field,
      fieldDimensions: DROUGHT_OPTIONS_VARIABLES_WITH_RCP.includes(field)
        ? {
            rcp,
          }
        : {},
    };
  },
});

const droughtOptionsColorSpecLookup: Record<DroughtOptionsVariableType, ColorSpec> = {
  cost_jmd: VECTOR_COLOR_MAPS.droughtOptionsCost,
  population_protected: VECTOR_COLOR_MAPS.droughtOptionsPopulationProtected,
  net_present_value_benefit: VECTOR_COLOR_MAPS.droughtOptionsNPVBenefit,
  benefit_cost_ratio: VECTOR_COLOR_MAPS.droughtOptionsBenefitCost,
};

export const droughtOptionsColorSpecState = selector<ColorSpec>({
  key: 'droughtOptionsColorSpecState',
  get: ({ get }) => {
    const field = get(droughtOptionsVariableState);
    return droughtOptionsColorSpecLookup[field];
  },
});

export const droughtOptionsLayerState = selector<ViewLayer>({
  key: 'droughtOptionsLayerState',
  get: ({ get }) => {
    const showDroughts = get(sectionVisibilityState('drought')) && get(droughtShowOptionsState);

    if (!showDroughts) {
      return null;
    }

    const fieldSpec = get(droughtOptionsFieldSpecState);
    const colorSpec = get(droughtOptionsColorSpecState);

    return droughtOptionsViewLayer({ fieldSpec, colorSpec });
  },
});
