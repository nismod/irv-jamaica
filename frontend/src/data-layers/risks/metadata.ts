export const RISKS_METADATA = {
  exposureValue: {
    label: 'Exposure value',
    dataUnit: 'JMD',
    format: 'financial',
  },
  EAD: {
    label: 'Expected Annual Damages',
    dataUnit: 'JMD/year',
    format: 'financial',
  },
  EADflood: {
    label: 'Expected Annual Damages (flooding)',
    dataUnit: 'JMD/year',
    format: 'financial',
  },
  EADcyclone: {
    label: 'Expected Annual Damages (cyclone)',
    dataUnit: 'JMD/year',
    format: 'financial',
  },
  populationAffected: {
    label: 'Population affected',
    dataUnit: '',
    format: 'population',
  },
  demandAffected: {
    label: 'Demand affected',
    dataUnit: '',
    format: 'integer',
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
