import { atom } from 'jotai';
import { atomWithDefault, RESET } from 'jotai/utils';
import { DefaultValue } from 'lib/jotai-compat/recoil';

import { useSyncStateThrottled } from 'lib/recoil/sync-state-throttled';

import { mapLatUrlState, mapLonUrlState, mapZoomUrlState } from './map-url';

const mapLatState = atomWithDefault<number>((get) => get(mapLatUrlState));
const mapLonState = atomWithDefault<number>((get) => get(mapLonUrlState));
const mapZoomState = atomWithDefault<number>((get) => get(mapZoomUrlState));

export const nonCoordsMapViewStateState = atom<Record<string, unknown>>({});

export const mapViewStateState = atom(
  (get) => ({
    ...get(nonCoordsMapViewStateState),
    latitude: get(mapLatState),
    longitude: get(mapLonState),
    zoom: get(mapZoomState),
  }),
  (_get, set, newValue) => {
    if (newValue instanceof DefaultValue) {
      set(mapZoomState, RESET);
      set(mapLatState, RESET);
      set(mapLonState, RESET);
      set(nonCoordsMapViewStateState, {});
    } else {
      const { latitude, longitude, zoom, ...nonCoords } = newValue as {
        latitude: number;
        longitude: number;
        zoom: number;
        [key: string]: unknown;
      };
      set(mapZoomState, zoom);
      set(mapLonState, longitude);
      set(mapLatState, latitude);
      set(nonCoordsMapViewStateState, nonCoords);
    }
  },
);

export function useSyncMapUrl() {
  useSyncStateThrottled(mapLatState, mapLatUrlState, 2000);
  useSyncStateThrottled(mapLonState, mapLonUrlState, 2000);
  useSyncStateThrottled(mapZoomState, mapZoomUrlState, 2000);
}
