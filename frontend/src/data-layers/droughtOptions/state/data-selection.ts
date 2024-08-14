import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';
import { bool, string } from '@recoiljs/refine';

import { DroughtOptionsVariableType } from '../metadata';

export const droughtShowOptionsState = atom<boolean>({
  key: 'droughtShowOptionsState',
  default: true,
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'drShowOp',
      refine: bool(),
    }),
  ],
});

export const droughtOptionsVariableState = atom<DroughtOptionsVariableType>({
  key: 'droughtOptionsVariableState',
  default: 'cost_jmd',
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'drOpVar',
      refine: string(),
    }),
  ],
});
