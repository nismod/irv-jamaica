import { makeConfig } from 'lib/helpers';

export const RISK_STYLES = makeConfig([
  {
    id: 'demandAffected',
    label: 'Demand Affected',
  },
  {
    id: 'exposureValue',
    label: 'Exposure Value',
  },
  {
    id: 'EAD',
    label: 'Expected Annual Damages',
  },
  {
    id: 'EADflood',
    label: 'Expected Annual Damages (flooding)',
  },
  {
    id: 'EADcyclone',
    label: 'Expected Annual Damages (cyclone)',
  },
  {
    id: 'populationAffected',
    label: 'Population Affected',
  },
  {
    id: 'lossGdp',
    label: 'Loss GDP',
  },
  {
    id: 'lossGdpIsolation',
    label: 'Loss GDP (isolation)',
  },
  {
    id: 'lossGdpRerouting',
    label: 'Loss GDP (rerouting)',
  },
]);
