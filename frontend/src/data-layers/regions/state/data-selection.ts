import { atom } from 'jotai';

import { locationAtom, readUrlString, setUrlParam } from 'lib/state/map-view/map-url';
import { sectionStyleValueState } from 'lib/state/sections';

import { RegionLevel } from '../metadata';

export const regionLevelState = atom(
  (get) => readUrlString(get(locationAtom).searchParams, 'regLevel', 'parish') as RegionLevel,
  (_get, set, value: RegionLevel) => set(locationAtom, setUrlParam('regLevel', value)),
);

export const regionsStyleState = atom((get) => get(sectionStyleValueState('regions')));

export const showPopulationState = atom((get) => get(regionsStyleState) === 'population');
