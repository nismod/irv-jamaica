export const RISKS_METADATA = {
  demandAffected: {
    label: 'Demand affected',
    dataUnit: '',
    format: 'integer',
  },
  exposureValue: {
    label: 'Exposure value',
    dataUnit: 'JMD',
    format: 'financial',
  },
  populationAffected: {
    label: 'Population affected',
    dataUnit: '',
    format: 'population',
  },
  lossGdp: {
    label: 'Loss GDP',
    dataUnit: 'JMD/day',
    format: 'financial',
  },
  lossGdpIsolation: {
    label: 'Loss GDP (isolation)',
    dataUnit: 'JMD/day',
    format: 'financial',
  },
  lossGdpRerouting: {
    label: 'Loss GDP (rerouting)',
    dataUnit: 'JMD/day',
    format: 'financial',
  },
};

export const RISKS = Object.keys(RISKS_METADATA);
