import { makeConfig } from 'lib/helpers';

export const RISK_STYLES = makeConfig([
  {
    id: 'totalValue',
    label: 'Total Value',
  },
  {
    id: 'economicUse',
    label: 'Economic Use',
  },
  {
    id: 'populationUse',
    label: 'Population Use',
  },
  {
    id: 'totalRisk',
    label: 'Total Risk',
  },
  {
    id: 'ead',
    label: 'Expected Annual Damages (EAD)',
  },
  {
    id: 'eael',
    label: 'Expected Annual Economic Losses (EAEL)',
  },
]);
