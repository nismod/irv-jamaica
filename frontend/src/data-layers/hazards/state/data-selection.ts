import { Atom } from 'jotai';
import { bool } from 'lib/jotai-compat/recoil-refine';
import fromPairs from 'lodash/fromPairs';
import { atomFamily } from 'lib/jotai-compat/recoil';
import { urlSyncEffect } from 'lib/jotai-compat/recoil-sync';

export const hazardSelectionState = atomFamily<boolean, string>({
  key: 'hazardSelectionState',
  default: false,
  effects: (id) => [
    ({ onSet }) => {
      onSet((newVisibility) => {
        const url = new URL(window.location.href);
        url.searchParams.set(id, newVisibility.toString());
        window.history.replaceState({}, '', url.toString());
      });
    },
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: id,
      refine: bool(),
    }),
  ],
});

interface TransactionGetterInterface {
  get<T>(a: Atom<T>): T;
}

export function getHazardSelectionAggregate(
  { get }: TransactionGetterInterface,
  hazards: string[],
) {
  return fromPairs(hazards.map((group) => [group, get(hazardSelectionState(group))]));
}
