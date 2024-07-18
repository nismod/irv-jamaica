import { RegionLevel } from 'config/view-layers/regions/metadata';
import { atom, selector } from 'recoil';
import { sectionStyleValueState } from '../sections';

export const regionLevelState = atom<RegionLevel>({
  key: 'regionLevelState',
  default: 'parish',
});

export const regionsStyleState = selector({
  key: 'regionsStyleState',
  get: ({ get }) => get(sectionStyleValueState('regions')),
});

export const showPopulationState = selector({
  key: 'showPopulationState',
  get: ({ get }) => get(regionsStyleState) === 'population',
});
