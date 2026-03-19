import { Atom, WritableAtom } from 'jotai';

/**
 * A readable and writable recoil state family
 */
export type RecoilStateFamily<DataType, ParamType> = (
  param: ParamType,
) => WritableAtom<DataType, unknown[], void> | Atom<DataType>;

/**
 * A recoil state family for which only read operation is required
 */
export type RecoilReadableStateFamily<DataType, ParamType> = (
  param: ParamType,
) => WritableAtom<DataType, unknown[], void> | Atom<DataType>;
