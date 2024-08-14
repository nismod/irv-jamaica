import { bool } from '@recoiljs/refine';
import fromPairs from 'lodash/fromPairs';
import { atomFamily, RecoilValue } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const hazardSelectionState = atomFamily({
  key: 'hazardSelectionState',
  default: false,
  effects: (id) => [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: id.toString(),
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
