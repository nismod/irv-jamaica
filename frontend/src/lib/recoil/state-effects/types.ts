import { TransactionInterface_UNSTABLE } from 'lib/jotai-compat/recoil';

export type StateEffect<T> = (
  ops: TransactionInterface_UNSTABLE,
  value: T,
  previousValue: T,
) => void;
