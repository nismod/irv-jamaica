import { atom } from 'jotai';

import { urlMemoStr } from 'lib/state/map-view/map-url';
import { sectionStyleValueState } from 'lib/state/sections';

import { RegionLevel } from '../metadata';

export const regionLevelState = urlMemoStr<RegionLevel>('regLevel', 'parish');

export const regionsStyleState = atom((get) => get(sectionStyleValueState('regions')));

export const showPopulationState = atom((get) => get(regionsStyleState) === 'population');
