import { LandUseOption, TerrestrialLocationFilterType } from 'data-layers/terrestrial/domains';
import { atom } from 'jotai';

import { atomWithStoredJson } from 'lib/state/map-view/map-url';
import { landuseFilterState } from '../sidebar/landuse-tree';

export type TerrestrialLocationFilters = Record<TerrestrialLocationFilterType, boolean>;

export interface TerrestrialNonLandUseFilters {
  slope_degrees: [number, number];
  elevation_m: [number, number];
  location_filters: TerrestrialLocationFilters;
}

export type TerrestrialFilters = TerrestrialNonLandUseFilters & {
  landuse_desc: Record<LandUseOption, boolean>;
};

const defaultTerrestrialNonLandUseFilters: TerrestrialNonLandUseFilters = {
  slope_degrees: [0, 90],
  elevation_m: [0, 2250],
  location_filters: {
    within_forest_100m: false,
    is_protected: false,
    is_proposed_protected: false,
    within_major_river_50m: false,
    within_large_stream_50m: false,
    within_headwater_stream_50m: false,
  },
};

export const terrestrialNonLandUseFiltersState = atomWithStoredJson<TerrestrialNonLandUseFilters>(
  'terrFilt',
  defaultTerrestrialNonLandUseFilters,
);

export const terrestrialFiltersState = atom<TerrestrialFilters>((get) => ({
  landuse_desc: get(landuseFilterState),
  ...get(terrestrialNonLandUseFiltersState),
}));
