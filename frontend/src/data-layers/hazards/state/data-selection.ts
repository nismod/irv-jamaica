import { Atom, atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import fromPairs from 'lodash/fromPairs';

import { locationAtom, readUrlBool, setUrlParam } from 'lib/state/map-view/map-url';

export const hazardSelectionState = atomFamily((id: string) =>
  atom(
    (get) => readUrlBool(get(locationAtom).searchParams, id, false),
    (_get, set, value: boolean) => set(locationAtom, setUrlParam(id, value)),
  ),
);

interface TransactionGetterInterface {
  get<T>(a: Atom<T>): T;
}

export function getHazardSelectionAggregate(
  { get }: TransactionGetterInterface,
  hazards: string[],
) {
  return fromPairs(hazards.map((group) => [group, get(hazardSelectionState(group))]));
}
