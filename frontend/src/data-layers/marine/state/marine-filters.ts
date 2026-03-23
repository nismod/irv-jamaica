import { MarineLocationFilterType } from 'data-layers/marine/domains';
import { atomWithStoredJson } from 'lib/state/map-view/map-url';

export type MarineLocationFilters = Record<MarineLocationFilterType, boolean>;

export interface MarineFilters {
  location_filters: MarineLocationFilters;
}

const defaultMarineFilters: MarineFilters = {
  location_filters: {
    within_coral_500m: false,
    within_seagrass_500m: false,
    within_mangrove_500m: false,
  },
};

export const marineFiltersState = atomWithStoredJson<MarineFilters>(
  'marFilt',
  defaultMarineFilters,
);
