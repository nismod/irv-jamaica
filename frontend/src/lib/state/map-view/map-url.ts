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
  if (raw == null) return NaN;
  const parsed = Number(raw);
  return isNaN(parsed) ? NaN : parsed;
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
      set(locationAtom, () => {
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
  return () => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, typeof value === 'string' ? value : JSON.stringify(value));
    return {
      pathname: window.location.pathname,
      hash: window.location.hash,
      searchParams: params,
    };
  };
}

// ── Memory-backed URL atoms ──────────────────────────────────────────────────
//
// These helpers create atoms that are initialised from the URL once (at module
// load time), then stored in Jotai's in-memory store for the lifetime of the
// session.  Writes are mirrored back to the URL AND to sessionStorage so that
// the values survive both React Router navigation away from the map page and
// a full page refresh on a non-map page (e.g. /about).
//
// Priority order on init: URL param → sessionStorage → supplied default

export const STORAGE_PREFIX = 'jsrat:';

export function urlMemoBool(key: string, defaultVal: boolean) {
  const params = new URLSearchParams(window.location.search);
  let initial: boolean;
  if (params.has(key)) {
    initial = readUrlBool(params, key, defaultVal);
  } else {
    const stored = sessionStorage.getItem(STORAGE_PREFIX + key);
    initial = stored != null ? (JSON.parse(stored) as boolean) : defaultVal;
  }
  const base = atom(initial);
  return atom(
    (get) => get(base),
    (_get, set, value: boolean) => {
      set(base, value);
      sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      set(locationAtom, setUrlParam(key, value));
    },
  );
}

export function urlMemoStr<T extends string = string>(key: string, defaultVal: string) {
  const params = new URLSearchParams(window.location.search);
  let initial: T;
  if (params.has(key)) {
    initial = readUrlString(params, key, defaultVal) as T;
  } else {
    initial = (sessionStorage.getItem(STORAGE_PREFIX + key) ?? defaultVal) as T;
  }
  const base = atom<T>(initial);
  return atom(
    (get) => get(base),
    (_get, set, value: T) => {
      set(base, value);
      sessionStorage.setItem(STORAGE_PREFIX + key, value);
      set(locationAtom, setUrlParam(key, value));
    },
  );
}

export function urlMemoJson<T>(key: string, defaultVal: T) {
  const params = new URLSearchParams(window.location.search);
  let initial: T;
  if (params.has(key)) {
    initial = readUrlJson<T>(params, key, defaultVal);
  } else {
    const stored = sessionStorage.getItem(STORAGE_PREFIX + key);
    initial = stored != null ? (JSON.parse(stored) as T) : defaultVal;
  }
  const base = atom<T>(initial);
  return atom(
    (get) => get(base),
    (_get, set, value: T) => {
      set(base, value);
      sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      set(locationAtom, setUrlParam(key, value));
    },
  );
}
