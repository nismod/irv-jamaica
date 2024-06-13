export const HAZARDS_METADATA = {
  none: { label: 'None' },
  cyclone: { label: 'Cyclone' },
  fluvial: { label: 'All Flooding' },
};

export const HAZARDS = Object.keys(HAZARDS_METADATA);

export const RISKS_METADATA = {
  totalValue: {
    label: 'Total value',
    dataUnit: '',
  },
  economicUse: {
    label: 'Economic use',
    dataUnit: '',
  },
  populationUse: {
    label: 'Population use',
    dataUnit: '',
  },
  totalRisk: {
    label: 'Total risk',
    dataUnit: '',
  },
  ead: {
    label: 'Expected Annual Damages (EAD)',
    dataUnit: '',
  },
  eael: {
    label: 'Expected Annual Economic Losses (EAEL)',
    dataUnit: '',
  },
};

export const RISKS = Object.keys(RISKS_METADATA);
