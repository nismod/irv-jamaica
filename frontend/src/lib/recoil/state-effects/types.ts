import { Atom, WritableAtom } from 'jotai';
import { RESET } from 'jotai/utils';

export type ResettableAtom<T> = WritableAtom<T, [T | typeof RESET], void>;

export type Ops = {
  get: <T>(state: Atom<T>) => T;
  set: <T>(state: WritableAtom<T, [T], void>, value: T) => void;
  reset: <T>(state: ResettableAtom<T>) => void;
};

export type StateEffect<T> = (ops: Ops, value: T, previousValue: T) => void;
