import { urlMemoBool, urlMemoStr } from 'lib/state/map-view/map-url';

import { DroughtOptionsVariableType } from '../metadata';

export const droughtShowOptionsState = urlMemoBool('drShowOp', true);

export const droughtOptionsVariableState = urlMemoStr<DroughtOptionsVariableType>('drOpVar', 'cost_jmd');
