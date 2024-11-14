import { truthyKeys } from 'lib/helpers';
import { StateEffect } from 'lib/recoil/state-effects/types';
import { getHazardSelectionAggregate } from 'data-layers/hazards/state/data-selection';
import { HAZARDS_UI_ORDER } from 'data-layers/hazards/metadata';

import { damageSourceState } from './damage-mapping/damage-map';

export const networksStyleStateEffect: StateEffect<string> = ({ get, set }, style) => {
  if (style === 'damages') {
    const hazardSelection = getHazardSelectionAggregate({ get }, HAZARDS_UI_ORDER);
    const visibleHazards = truthyKeys(hazardSelection);
    const defaultDamageSource = visibleHazards[0] ?? 'all';

    set(damageSourceState, defaultDamageSource);
  }
};
