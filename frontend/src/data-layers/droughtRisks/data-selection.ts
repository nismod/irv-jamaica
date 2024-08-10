import { atom } from 'recoil';

import { DroughtRiskVariableType } from './metadata';

export const droughtRcpParamState = atom<string>({
  key: 'droughtRcpParamState',
  default: '2.6',
});

export const droughtShowRiskState = atom<boolean>({
  key: 'droughtShowRiskState',
  default: true,
});

export const droughtRiskVariableState = atom<DroughtRiskVariableType>({
  key: 'droughtRiskVariableState',
  default: 'mean_monthly_water_stress_',
});
