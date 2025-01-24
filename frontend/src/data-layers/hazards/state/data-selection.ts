import { bool } from '@recoiljs/refine';
import fromPairs from 'lodash/fromPairs';
import { atomFamily, RecoilValue } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

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
  get<T>(a: RecoilValue<T>): T;
}

export function getHazardSelectionAggregate(
  { get }: TransactionGetterInterface,
  hazards: string[],
) {
  return fromPairs(hazards.map((group) => [group, get(hazardSelectionState(group))]));
}
