export const HAZARDS_METADATA = {
  none: { label: 'None' },
  cyclone: { label: 'Cyclone' },
  fluvial: { label: 'All Flooding' },
};

export const HAZARDS = Object.keys(HAZARDS_METADATA);

export const RISKS_METADATA = {
  demandAffected: {
    label: 'Demand affected',
    dataUnit: '',
    format: 'integer',
  },
  exposureValue: {
    label: 'Exposure value',
    dataUnit: '',
    format: 'financial',
  },
  populationAffected: {
    label: 'Population affected',
    dataUnit: '',
    format: 'population',
  },
  lossGdp: {
    label: 'Loss GDP',
    dataUnit: '',
    format: 'financial',
  },
};

export const RISKS = Object.keys(RISKS_METADATA);
