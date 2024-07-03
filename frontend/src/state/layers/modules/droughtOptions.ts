import { VECTOR_COLOR_MAPS } from 'config/color-maps';
import { droughtOptionsViewLayer } from 'config/droughtOptions/drought-options-view-layer';
import {
  DroughtOptionsVariableType,
  DROUGHT_OPTIONS_VARIABLES_WITH_RCP,
} from 'config/droughtOptions/metadata';
import { ColorSpec, FieldSpec, ViewLayer } from 'lib/data-map/view-layers';
import { selector } from 'recoil';
import {
  droughtOptionsVariableState,
  droughtRcpParamState,
  droughtShowOptionsState,
} from 'state/drought/drought-parameters';
import { sectionVisibilityState } from 'state/sections';

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
