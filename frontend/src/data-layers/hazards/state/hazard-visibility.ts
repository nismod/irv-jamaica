import { atom } from 'jotai';

import { damageSourceState } from 'lib/state/damage-map';
import { showDamagesState } from 'app/state/damage-mapping/damage-map';

import { HAZARDS_MAP_ORDER } from '../metadata';
import { getHazardSelectionAggregate } from './data-selection';

export const hazardVisibilityState = atom((get) => {
  if (get(showDamagesState)) {
    const selectedDamageSource = get(damageSourceState);
    if (selectedDamageSource === 'all') {
      return {};
    } else {
      return {
        [selectedDamageSource]: true,
      };
    }
  } else {
    return getHazardSelectionAggregate({ get }, HAZARDS_MAP_ORDER);
  }
});
