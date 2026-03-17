type Ops = {
  get: (state: any) => any;
  set: (state: any, value: any) => void;
  reset: (state: any) => void;
};

export type StateEffect<T> = (
  ops: Ops,
  value: T,
  previousValue: T,
) => void;
