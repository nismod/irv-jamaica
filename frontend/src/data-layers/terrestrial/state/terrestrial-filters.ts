import { LandUseOption, TerrestrialLocationFilterType } from 'data-layers/terrestrial/domains';
import { atom, selector } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';
import { landuseFilterState } from '../sidebar/landuse-tree';
import { array, bool, dict, number, object } from '@recoiljs/refine';

export type TerrestrialLocationFilters = Record<TerrestrialLocationFilterType, boolean>;

interface TerrestrialNonLandUseFilters {
  slope_degrees: [number, number];
  elevation_m: [number, number];
  location_filters: TerrestrialLocationFilters;
}

export type TerrestrialFilters = TerrestrialNonLandUseFilters & {
  landuse_desc: Record<LandUseOption, boolean>;
};

export const terrestrialNonLandUseFiltersState = atom<TerrestrialNonLandUseFilters>({
  key: 'terrestrialNonLandUseFiltersState',
  default: {
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
  },
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'terrFilt',
      refine: object({
        slope_degrees: array(number()),
        elevation_m: array(number()),
        location_filters: dict(bool()),
      }),
    }),
  ],
});

export const terrestrialFiltersState = selector<TerrestrialFilters>({
  key: 'terrestrialFiltersState',
  get: ({ get }) => {
    return {
      landuse_desc: get(landuseFilterState),
      ...get(terrestrialNonLandUseFiltersState),
    };
  },
});
