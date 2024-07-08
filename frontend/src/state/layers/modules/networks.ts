import * as networkColorMaps from 'config/networks/color-maps';
import { AdaptationOptionParams } from 'config/domains/adaptation';
import { INFRASTRUCTURE_VIEW_LAYERS } from 'config/networks/view-layers';
import { ViewLayer, StyleParams, ColorSpec, FieldSpec } from 'lib/data-map/view-layers';
import { StateEffect } from 'lib/recoil/state-effects/types';
import { atom, selector } from 'recoil';
import { damageMapStyleParamsState } from 'state/damage-mapping/damage-style-params';
import { dataParamsByGroupState } from 'state/data-params';
import {
  networkSelectionState,
  networkTreeCheckboxState,
  networkTreeConfig,
} from 'state/networks/network-selection';
import { networksStyleState } from 'state/networks/networks-style';
import { sectionVisibilityState } from 'state/sections';

import adaptationSectorLayers from 'config/domains/adaptation-sector-layers.json';
import uniq from 'lodash/uniq';
import fromPairs from 'lodash/fromPairs';
import mapValues from 'lodash/mapValues';
import { recalculateCheckboxStates } from 'lib/controls/checkbox-tree/CheckboxTree';
import { LayerSpec } from 'asset-list/use-sorted-features';

export const networksLayerState = selector<ViewLayer[]>({
  key: 'networkLayersState',
  get: ({ get }) =>
    get(sectionVisibilityState('assets'))
      ? get(networkSelectionState).map((network) => INFRASTRUCTURE_VIEW_LAYERS[network])
      : [],
});

export const showAdaptationsState = selector<boolean>({
  key: 'showAdaptationsState',
  get: ({ get }) => get(networksStyleState) === 'adaptation',
});

export const adaptationFieldState = atom<
  'avoided_ead_mean' | 'avoided_eael_mean' | 'adaptation_cost' | 'cost_benefit_ratio'
>({
  key: 'adaptationFieldState',
  default: 'avoided_ead_mean',
});

export const adaptationCostBenefitRatioEaelDaysState = atom<number>({
  key: 'adaptationCostBenefitRatioEaelDaysState',
  default: 15,
});

export const adaptationDataParamsStateEffect: StateEffect<AdaptationOptionParams> = (
  { get, set },
  adaptationParams,
) => {
  const { sector, subsector, asset_type } = adaptationParams;

  const layers = uniq(
    adaptationSectorLayers
      .filter(
        (x) => x.sector === sector && x.subsector === subsector && x.asset_type === asset_type,
      )
      .map((x) => x.layer_name),
  );

  const currentSelection = get(networkTreeCheckboxState);
  const updatedTreeState = {
    checked: {
      ...mapValues(currentSelection.checked, () => false),
      ...fromPairs(layers.map((layer) => [layer, true])),
    },
    indeterminate: {},
  };
  const resolvedTreeState = recalculateCheckboxStates(updatedTreeState, networkTreeConfig);

  set(networkTreeCheckboxState, resolvedTreeState);

  // currently not auto-updating the expanded state of the tree since that can make the adaptations UI section move out of view
  // set(networkTreeExpandedState, truthyKeys(resolvedTreeState.indeterminate));
};

export const adaptationLayerSpecState = selector<LayerSpec>({
  key: 'adaptationLayerSpecState',
  get: ({ get }) => {
    const { sector, subsector, asset_type } = get(dataParamsByGroupState('adaptation'));

    return {
      sector,
      subsector,
      assetType: asset_type,
    };
  },
});

export const adaptationFieldSpecState = selector<FieldSpec>({
  key: 'adaptationFieldSpecState',
  get: ({ get }) => {
    const field = get(adaptationFieldState);
    const { hazard, rcp, adaptation_name, adaptation_protection_level } = get(
      dataParamsByGroupState('adaptation'),
    );

    let fieldParams: {
      eael_days?: number;
    } = {};
    if (field === 'cost_benefit_ratio') {
      fieldParams = {
        eael_days: get(adaptationCostBenefitRatioEaelDaysState),
      };
    }

    return {
      fieldGroup: 'adaptation',
      fieldDimensions: {
        hazard,
        rcp,
        adaptation_name,
        adaptation_protection_level,
      },
      field,
      fieldParams,
    };
  },
});

export const adaptationColorSpecState = selector<ColorSpec>({
  key: 'adaptationColorSpecState',
  get: ({ get }) => {
    const field = get(adaptationFieldState);
    return networkColorMaps[field];
  },
});

export const adaptationStyleParamsState = selector<StyleParams>({
  key: 'adaptationStyleParamsState',
  get: ({ get }) => {
    const fieldSpec = get(adaptationFieldSpecState);
    const colorSpec = get(adaptationColorSpecState);

    return {
      colorMap: {
        fieldSpec,
        colorSpec,
      },
    };
  },
});

export const networkStyleParamsState = selector<StyleParams>({
  key: 'networkStyleParamsState',
  get: ({ get }) => {
    switch (get(networksStyleState)) {
      case 'damages':
        return get(damageMapStyleParamsState);
      case 'adaptation':
        return get(adaptationStyleParamsState);
      default:
        return {};
    }
  },
});
