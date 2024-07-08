import { StyleSelectionOption } from 'state/sections';
import { BUILDING_STYLES } from './view-layers/buildings/styles';
import { DROUGHT_STYLES } from './view-layers/droughtRisks/styles';
import { NETWORK_STYLES } from './view-layers/networks/styles';
import { REGION_STYLES } from './view-layers/regions/styles';
import { MARINE_STYLES } from './view-layers/marine/styles';
import { TERRESTRIAL_STYLES } from './view-layers/terrestrial/styles';

export const SECTIONS_CONFIG: Record<string, { styles?: Record<string, StyleSelectionOption> }> = {
  assets: {
    styles: NETWORK_STYLES,
  },
  drought: {
    styles: DROUGHT_STYLES,
  },
  hazards: {},
  buildings: {
    styles: BUILDING_STYLES,
  },
  regions: {
    styles: REGION_STYLES,
  },
  terrestrial: {
    styles: TERRESTRIAL_STYLES,
  },
  marine: {
    styles: MARINE_STYLES,
  },
};
