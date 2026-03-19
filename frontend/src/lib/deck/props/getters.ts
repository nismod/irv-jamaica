import { DataLoader } from 'lib/data-loader/data-loader';

export type Accessor<To, From = unknown> = ((x: From) => To) & {
  updateTriggers?: unknown[];
  dataLoader?: DataLoader;
};
export type Getter<T> = T | Accessor<T>;

export function mergeTriggers(...accessors: Accessor<unknown>[]) {
  const res: unknown[] = [];
  for (const acc of accessors) {
    for (const elem of acc.updateTriggers ?? []) {
      res.push(elem);
    }
  }
  return res;
}

export function withTriggers<T, F>(fn: Accessor<T, F>, triggers: unknown[]) {
  fn.updateTriggers = triggers;
  return fn;
}
