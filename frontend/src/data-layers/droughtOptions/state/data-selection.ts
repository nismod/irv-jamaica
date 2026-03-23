import { atomWithStoredBool, atomWithStoredStr } from 'lib/state/map-view/map-url';

import { DroughtOptionsVariableType } from '../metadata';

export const droughtShowOptionsState = atomWithStoredBool('drShowOp', true);

export const droughtOptionsVariableState = atomWithStoredStr<DroughtOptionsVariableType>(
  'drOpVar',
  'cost_jmd',
);
