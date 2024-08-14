import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';
import { bool, string } from '@recoiljs/refine';

import { DroughtRiskVariableType } from '../metadata';

export const droughtRcpParamState = atom<string>({
  key: 'droughtRcpParamState',
  default: '2.6',
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'drRcp',
      refine: string(),
    }),
  ],
});

export const droughtShowRiskState = atom<boolean>({
  key: 'droughtShowRiskState',
  default: true,
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'drShowRi',
      refine: bool(),
    }),
  ],
});

export const droughtRiskVariableState = atom<DroughtRiskVariableType>({
  key: 'droughtRiskVariableState',
  default: 'mean_monthly_water_stress_',
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'drRiVar',
      refine: string(),
    }),
  ],
});
