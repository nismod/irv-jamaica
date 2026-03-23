import { atom } from 'jotai';

import { atomWithStoredJson } from 'lib/state/map-view/map-url';

export const buildingsStyleState = atom('type');

export const BUILDING_TYPES = [
  'buildings_commercial',
  'buildings_residential',
  'buildings_institutional',
  'buildings_mixed',
  'buildings_industrial',
  'buildings_recreation',
  'buildings_other',
  'buildings_resort',
];

export type BuildingType = (typeof BUILDING_TYPES)[number];

export type BuildingSelection = Record<BuildingType, boolean>;

const defaultBuildingSelection: BuildingSelection = {
  buildings_commercial: true,
  buildings_residential: true,
  buildings_institutional: true,
  buildings_mixed: true,
  buildings_industrial: true,
  buildings_recreation: true,
  buildings_other: true,
  buildings_resort: true,
};

export const buildingSelectionState = atomWithStoredJson<BuildingSelection>(
  'buiSel',
  defaultBuildingSelection,
);
