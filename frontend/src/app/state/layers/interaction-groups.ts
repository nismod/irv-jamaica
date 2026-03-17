import { atom } from 'jotai';

import { INTERACTION_GROUPS } from 'app/config/interaction-groups';
import { showPopulationState } from 'data-layers/regions/state/data-selection';

export const interactionGroupsState = atom((get) => {
  const regionDataShown = get(showPopulationState);
  if (INTERACTION_GROUPS.has('regions')) {
    const regionsGroup = INTERACTION_GROUPS.get('regions');
    INTERACTION_GROUPS.set('regions', { ...regionsGroup, usesAutoHighlight: regionDataShown });
  }

  return INTERACTION_GROUPS;
});
