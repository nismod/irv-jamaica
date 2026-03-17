import { atom } from 'jotai';
import { atomWithLocation } from 'jotai-location';

type Location = { pathname?: string; searchParams?: URLSearchParams; hash?: string };

/**
 * We deliberately restrict this atom to only the URL search params, never
 * touching pathname or hash.  React Router owns those and any replaceState
 * call that includes a stale pathname will revert the route.
 */
export const locationAtom = atomWithLocation({
  getLocation: () => ({
    searchParams: new URLSearchParams(window.location.search),
  }),
  applyLocation: (loc: Location) => {
    const url = new URL(window.location.href);
    url.search = loc.searchParams?.toString() ?? '';
    window.history.replaceState({}, '', url.toString());
  },
});

function readParam(searchParams: URLSearchParams | undefined, key: string): number {
  const raw = searchParams?.get(key);
  if (raw == null) return -1;
  const parsed = Number(raw);
  return isNaN(parsed) ? -1 : parsed;
}

function makeUrlNumberAtom(itemKey: string, maximumFractionDigits: number) {
  return atom(
    (get) => readParam(get(locationAtom).searchParams, itemKey),
    (get, set, value: number) => {
      const formatted = +value.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits,
        useGrouping: false,
      });
      set(locationAtom, (_prev) => {
        const params = new URLSearchParams(window.location.search);
        params.set(itemKey, String(formatted));
        return { searchParams: params };
      });
    },
  );
}

export const mapZoomUrlState = makeUrlNumberAtom('zoom', 2);
export const mapLonUrlState = makeUrlNumberAtom('lon', 5);
export const mapLatUrlState = makeUrlNumberAtom('lat', 5);

// ── URL param helpers ────────────────────────────────────────────────────────

export function readUrlString(
  params: URLSearchParams | undefined,
  key: string,
  defaultVal: string,
): string {
  return params?.get(key) ?? defaultVal;
}

export function readUrlBool(
  params: URLSearchParams | undefined,
  key: string,
  defaultVal: boolean,
): boolean {
  const raw = params?.get(key);
  if (raw == null) return defaultVal;
  try {
    return JSON.parse(raw) as boolean;
  } catch {
    return defaultVal;
  }
}

export function readUrlJson<T>(params: URLSearchParams | undefined, key: string, defaultVal: T): T {
  const raw = params?.get(key);
  if (raw == null) return defaultVal;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return defaultVal;
  }
}

/**
 * Returns a location updater that sets a single URL search param.
 * Strings are stored as-is; all other values are JSON.stringify'd to match
 * the encoding used by the former RecoilURLSync layer.
 *
 * Note: we deliberately re-read pathname and hash from window.location at
 * write time rather than spreading from `prev`, so that React Router's
 * current route is never overwritten by a stale snapshot.
 */
export function setUrlParam(key: string, value: unknown): (prev: Location) => Location {
  return (_prev) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, typeof value === 'string' ? value : JSON.stringify(value));
    return {
      pathname: window.location.pathname,
      hash: window.location.hash,
      searchParams: params,
    };
  };
}
