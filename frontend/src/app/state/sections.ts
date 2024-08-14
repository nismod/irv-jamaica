import { bool, string } from '@recoiljs/refine';
import { atomFamily } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { truthyKeys } from 'lib/helpers';
import { StateEffect } from 'lib/recoil/state-effects/types';
import { getHazardSelectionAggregate } from 'data-layers/hazards/state/data-selection';
import { HAZARDS_UI_ORDER } from 'data-layers/hazards/metadata';

import { damageSourceState } from './damage-mapping/damage-map';

export const sectionVisibilityState = atomFamily<boolean, string>({
  key: 'sectionVisibilityState',
  default: false,
  effects: (id) => [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: id,
      refine: bool(),
    }),
  ],
});

export const sidebarSectionExpandedState = atomFamily({
  key: 'sidebarSectionExpandedState',
  default: false,
});

export const sectionStyleValueState = atomFamily<string, string>({
  key: 'sectionStyleValueState',
  default: '',
  effects: (id) => [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: `${id}Style`,
      refine: string(),
    }),
  ],
});

export const networksStyleStateEffect: StateEffect<string> = ({ get, set }, style) => {
  if (style === 'damages') {
    const hazardSelection = getHazardSelectionAggregate({ get }, HAZARDS_UI_ORDER);
    const visibleHazards = truthyKeys(hazardSelection);
    const defaultDamageSource = visibleHazards[0] ?? 'all';

    set(damageSourceState, defaultDamageSource);
  }
};

export interface StyleSelectionOption {
  id: string;
  label: string;
}

export const sectionStyleOptionsState = atomFamily<StyleSelectionOption[], string>({
  key: 'sectionStyleOptionsState',
  default: [],
});

export const sectionStyleDefaultValueState = atomFamily<string, string>({
  key: 'sectionStyleDefaultValueState',
  default: null,
});
