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
    id: 'populationAffected',
    label: 'Population Affected',
  },
  {
    id: 'lossGdp',
    label: 'Loss GDP',
  },
]);