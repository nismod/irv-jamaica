import { atom } from 'jotai';
import { FieldSpec } from 'lib/data-map/view-layers';
import { dataParamState } from './data-params';

export const damageSourceState = atom('all');

export const damageTypeState = atom('direct');

export const damagesFieldState = atom<FieldSpec | null>((get) => {
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
});
