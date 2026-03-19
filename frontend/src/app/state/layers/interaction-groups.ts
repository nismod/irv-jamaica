import { atom } from 'jotai';

import { INTERACTION_GROUPS } from 'app/config/interaction-groups';
import { showPopulationState } from 'data-layers/regions/state/data-selection';

export const interactionGroupsState = atom((get) => {
  const regionDataShown = get(showPopulationState);
  const groups = new Map(INTERACTION_GROUPS);
  if (groups.has('regions')) {
    const regionsGroup = groups.get('regions');
    groups.set('regions', { ...regionsGroup, usesAutoHighlight: regionDataShown });
  }

  return groups;
});
