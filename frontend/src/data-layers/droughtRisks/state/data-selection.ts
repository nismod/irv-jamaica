import { atomWithStoredBool, atomWithStoredStr } from 'lib/state/map-view/map-url';

import { DroughtRiskVariableType } from '../metadata';

export const droughtRcpParamState = atomWithStoredStr('drRcp', '2.6');

export const droughtShowRiskState = atomWithStoredBool('drShowRi', true);

export const droughtRiskVariableState = atomWithStoredStr<DroughtRiskVariableType>(
  'drRiVar',
  'mean_monthly_water_stress_',
);
