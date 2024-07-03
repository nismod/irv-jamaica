import { makeColorConfig } from 'lib/helpers';
import { MarineHabitatType } from './domains';

export const MARINE_HABITAT_COLORS = makeColorConfig<MarineHabitatType>({
  coral: '#f9b2ea',
  coral_mangrove: '#808cf2',
  coral_mangrove_seagrass: '#152513',
  coral_seagrass: '#f2808c',
  mangrove: '#80f2e6',
  mangrove_seagrass: '#95e78b',
  seagrass: '#f2e680',
  other: 'rgba(128,128,128,0.2)',
});
