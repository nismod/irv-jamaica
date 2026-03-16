import { selector, selectorFamily } from 'lib/jotai-compat/recoil';

import { dataParamState } from 'lib/state/data-params';
import { FieldSpec, StyleParams } from 'lib/data-map/view-layers';

import { damages, damagesCoastalDefence } from 'data-layers/networks/color-maps';

import { damageSourceState, damageTypeState } from './damage-map';

export const damagesFieldState = selector<FieldSpec>({
  key: 'eadAccessorState',
  get: ({ get }) => {
    const damageSource = get(damageSourceState);
    if (damageSource == null) return null;
    const damageType = get(damageTypeState);

    return {
      fieldGroup: 'damages_expected',
      fieldDimensions: {
        hazard: damageSource,
        rcp: get(dataParamState({ group: damageSource, param: 'rcp' })),
        epoch: get(dataParamState({ group: damageSource, param: 'epoch' })),
        protection_standard: 0,
      },
      field: damageType === 'direct' ? 'ead_mean' : 'eael_mean',
    };
  },
});

export const damageMapStyleParamsState = selectorFamily<StyleParams, string>({
  key: 'damageMapStyleParamsState',
  get:
    (layerId: string) =>
    ({ get }) => {
      const eadFieldSpec = get(damagesFieldState);
      if (eadFieldSpec == null) return {};

      const colorSpec = layerId === 'coast_nodes_cpf' ? damagesCoastalDefence : damages;

      return {
        colorMap: {
          colorSpec: colorSpec,
          fieldSpec: eadFieldSpec,
        },
      };
    },
});
