import { atom, selector } from 'recoil';

import { sectionStyleValueState } from 'lib/state/sections';

import { RegionLevel } from '../metadata';
import { urlSyncEffect } from 'recoil-sync';
import { string } from '@recoiljs/refine';

export const regionLevelState = atom<RegionLevel>({
  key: 'regionLevelState',
  default: 'parish',
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'regLevel',
      refine: string(),
    }),
  ],
});

export const regionsStyleState = selector({
  key: 'regionsStyleState',
  get: ({ get }) => get(sectionStyleValueState('regions')),
});

export const showPopulationState = selector({
  key: 'showPopulationState',
  get: ({ get }) => get(regionsStyleState) === 'population',
});
