import { atom } from 'recoil';

import { DroughtOptionsVariableType } from '../metadata';

export const droughtShowOptionsState = atom<boolean>({
  key: 'droughtShowOptionsState',
  default: true,
});

export const droughtOptionsVariableState = atom<DroughtOptionsVariableType>({
  key: 'droughtOptionsVariableState',
  default: 'cost_jmd',
});
