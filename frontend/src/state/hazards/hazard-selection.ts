import fromPairs from 'lodash/fromPairs';
import { atomFamily, RecoilValue } from 'recoil';

export const hazardSelectionState = atomFamily({
  key: 'hazardSelectionState',
  default: false,
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
