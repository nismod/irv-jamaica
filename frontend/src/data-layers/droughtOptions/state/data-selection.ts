import { atom } from 'jotai';

import { locationAtom, readUrlBool, readUrlString, setUrlParam } from 'lib/state/map-view/map-url';

import { DroughtOptionsVariableType } from '../metadata';

export const droughtShowOptionsState = atom(
  (get) => readUrlBool(get(locationAtom).searchParams, 'drShowOp', true),
  (_get, set, value: boolean) => set(locationAtom, setUrlParam('drShowOp', value)),
);

export const droughtOptionsVariableState = atom(
  (get) => readUrlString(get(locationAtom).searchParams, 'drOpVar', 'cost_jmd') as DroughtOptionsVariableType,
  (_get, set, value: DroughtOptionsVariableType) => set(locationAtom, setUrlParam('drOpVar', value)),
);
