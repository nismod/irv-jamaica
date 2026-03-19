import { Atom, WritableAtom } from 'jotai';

type Ops = {
  get: <T>(state: Atom<T>) => T;
  set: <T>(state: WritableAtom<T, [T], void>, value: T) => void;
  reset: <T>(state: WritableAtom<T, [T], void>) => void;
};

export type StateEffect<T> = (ops: Ops, value: T, previousValue: T) => void;
