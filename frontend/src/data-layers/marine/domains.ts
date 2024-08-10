import { toDictionary } from 'lib/helpers';

const marineHabitatsConst = [
  {
    value: 'coral',
    label: 'Coral',
  },
  {
    value: 'coral_seagrass',
    label: 'Coral and Seagrass',
  },
  {
    value: 'seagrass',
    label: 'Seagrass',
  },
  {
    value: 'mangrove',
    label: 'Mangrove',
  },
  {
    value: 'coral_mangrove_seagrass',
    label: 'Coral, Mangrove and Seagrass',
  },
  {
    value: 'mangrove_seagrass',
    label: 'Mangrove and Seagrass',
  },
  {
    value: 'coral_mangrove',
    label: 'Coral and Mangrove',
  },
  {
    value: 'other',
    label: 'Buffer Zone',
  },
] as const;

export const MARINE_HABITATS = [...marineHabitatsConst];
export const MARINE_HABITATS_LOOKUP = toDictionary(
  MARINE_HABITATS,
  (x) => x.value,
  (x) => x.label,
);

export type MarineHabitatType = (typeof MARINE_HABITATS)[number]['value'];

export const MARINE_LOCATION_FILTERS = [
  {
    value: 'within_coral_500m',
    label: 'Within 500m of coral',
  },
  {
    value: 'within_seagrass_500m',
    label: 'Within 500m of seagrass',
  },
  {
    value: 'within_mangrove_500m',
    label: 'Within 500m of mangrove',
  },
] as const;

export type MarineLocationFilterType = (typeof MARINE_LOCATION_FILTERS)[number]['value'];
