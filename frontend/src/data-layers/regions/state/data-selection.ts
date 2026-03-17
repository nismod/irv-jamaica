import { atom } from 'lib/jotai-compat/recoil';
import { atom as jotaiAtom } from 'jotai';

import { sectionStyleValueState } from 'lib/state/sections';

import { RegionLevel } from '../metadata';
import { urlSyncEffect } from 'lib/jotai-compat/recoil-sync';
import { string } from 'lib/jotai-compat/recoil-refine';

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

export const regionsStyleState = jotaiAtom((get) => get(sectionStyleValueState('regions')));

export const showPopulationState = jotaiAtom((get) => get(regionsStyleState) === 'population');
