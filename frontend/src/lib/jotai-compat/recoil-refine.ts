type RefineValidator<T> = {
  type: string;
  parse: (value: unknown) => T;
};

function makeValidator<T>(type: string, parse: (value: unknown) => T): RefineValidator<T> {
  return { type, parse };
}

export function bool() {
  return makeValidator('bool', (value) => Boolean(value));
}

export function string() {
  return makeValidator('string', (value) => `${value ?? ''}`);
}

export function number() {
  return makeValidator('number', (value) => Number(value));
}

export function date() {
  return makeValidator('date', (value) => (value instanceof Date ? value : new Date(`${value}`)));
}

export function nullable<T>(inner: RefineValidator<T>) {
  return makeValidator<T | null>('nullable', (value) => (value == null ? null : inner.parse(value)));
}

export function array<T>(inner: RefineValidator<T>) {
  return makeValidator<T[]>('array', (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => inner.parse(item));
  });
}

export function dict<T>(inner: RefineValidator<T>) {
  return makeValidator<Record<string, T>>('dict', (value) => {
    if (!value || typeof value !== 'object') return {};
    const entries = Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, inner.parse(v)]);
    return Object.fromEntries(entries);
  });
}

export function object<T extends Record<string, RefineValidator<unknown>>>(shape: T) {
  return makeValidator('object', (value) => {
    if (!value || typeof value !== 'object') return {};
    const result: Record<string, unknown> = {};
    Object.entries(shape).forEach(([key, validator]) => {
      result[key] = validator.parse((value as Record<string, unknown>)[key]);
    });
    return result;
  });
}
