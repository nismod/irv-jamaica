import { DefaultValue } from 'lib/jotai-compat/recoil';

export const isReset = (candidate: unknown): candidate is DefaultValue => {
  if (candidate instanceof DefaultValue) return true;
  return false;
};
