import { INTERACTION_GROUPS } from 'config/interaction-groups';
import { selector } from 'recoil';
import { showPopulationState } from 'data-layers/regions/data-selection';

export const interactionGroupsState = selector({
  key: 'interactionGroupsState',
  get: ({ get }) => {
    const regionDataShown = get(showPopulationState);
    if (INTERACTION_GROUPS.has('regions')) {
      const regionsGroup = INTERACTION_GROUPS.get('regions');
      INTERACTION_GROUPS.set('regions', { ...regionsGroup, usesAutoHighlight: regionDataShown });
    }

    return INTERACTION_GROUPS;
  },
});
