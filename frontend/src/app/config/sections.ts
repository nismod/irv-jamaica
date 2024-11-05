import { StyleSelectionOption } from 'app/state/sections';
import { BUILDING_STYLES } from 'data-layers/buildings/styles';
import { DROUGHT_STYLES } from 'data-layers/droughtRisks/styles';
import { NETWORK_STYLES } from 'data-layers/networks/styles';
import { REGION_STYLES } from 'data-layers/regions/styles';
import { MARINE_STYLES } from 'data-layers/marine/styles';
import { TERRESTRIAL_STYLES } from 'data-layers/terrestrial/styles';
import { RISK_STYLES } from 'data-layers/risks/styles';

export const SECTIONS_CONFIG: Record<string, { styles?: Record<string, StyleSelectionOption> }> = {
  assets: {
    styles: NETWORK_STYLES,
  },
  drought: {
    styles: DROUGHT_STYLES,
  },
  hazards: {},
  risks: {
    styles: RISK_STYLES,
  },
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
