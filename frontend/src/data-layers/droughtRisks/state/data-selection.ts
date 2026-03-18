import { atom } from 'jotai';

import { locationAtom, readUrlBool, readUrlString, setUrlParam } from 'lib/state/map-view/map-url';

import { DroughtRiskVariableType } from '../metadata';

export const droughtRcpParamState = atom(
  (get) => readUrlString(get(locationAtom).searchParams, 'drRcp', '2.6'),
  (_get, set, value: string) => set(locationAtom, setUrlParam('drRcp', value)),
);

export const droughtShowRiskState = atom(
  (get) => readUrlBool(get(locationAtom).searchParams, 'drShowRi', true),
  (_get, set, value: boolean) => set(locationAtom, setUrlParam('drShowRi', value)),
);

export const droughtRiskVariableState = atom(
  (get) =>
    readUrlString(
      get(locationAtom).searchParams,
      'drRiVar',
      'mean_monthly_water_stress_',
    ) as DroughtRiskVariableType,
  (_get, set, value: DroughtRiskVariableType) => set(locationAtom, setUrlParam('drRiVar', value)),
);
