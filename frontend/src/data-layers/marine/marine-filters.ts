import { MarineLocationFilterType } from 'data-layers/marine/domains';
import { atom } from 'recoil';

export type MarineLocationFilters = Record<MarineLocationFilterType, boolean>;

export interface MarineFilters {
  location_filters: MarineLocationFilters;
}

export const marineFiltersState = atom<MarineFilters>({
  key: 'marineFiltersState',
  default: {
    location_filters: {
      within_coral_500m: false,
      within_seagrass_500m: false,
      within_mangrove_500m: false,
    },
  },
});
