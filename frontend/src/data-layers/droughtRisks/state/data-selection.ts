import { urlMemoBool, urlMemoStr } from 'lib/state/map-view/map-url';

import { DroughtRiskVariableType } from '../metadata';

export const droughtRcpParamState = urlMemoStr('drRcp', '2.6');

export const droughtShowRiskState = urlMemoBool('drShowRi', true);

export const droughtRiskVariableState = urlMemoStr<DroughtRiskVariableType>('drRiVar', 'mean_monthly_water_stress_');
