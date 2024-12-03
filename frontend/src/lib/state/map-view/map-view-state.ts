import { DefaultValue, atom, selector } from 'recoil';

import { useSyncStateThrottled } from 'lib/recoil/sync-state-throttled';

import { mapLatUrlState, mapLonUrlState, mapZoomUrlState } from './map-url';

const mapLatState = atom({ key: 'mapLat', default: mapLatUrlState });
const mapLonState = atom({ key: 'mapLon', default: mapLonUrlState });
const mapZoomState = atom({ key: 'mapZoom', default: mapZoomUrlState });

export const nonCoordsMapViewStateState = atom({
  key: 'nonCoordsMapViewState',
  default: {},
});

export const mapViewStateState = selector({
  key: 'mapViewState',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    const viewState = {
      ...get(nonCoordsMapViewStateState),
      latitude: get(mapLatState),
      longitude: get(mapLonState),
      zoom: get(mapZoomState),
    };
    return viewState;
  },
  set: ({ set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(mapZoomState);
      reset(mapLatState);
      reset(mapLonState);
      reset(nonCoordsMapViewStateState);
    } else {
      const { latitude, longitude, zoom, ...nonCoords } = newValue;
      set(mapZoomState, zoom);
      set(mapLonState, longitude);
      set(mapLatState, latitude);
      set(nonCoordsMapViewStateState, nonCoords);
    }
  },
});

export function useSyncMapUrl() {
  useSyncStateThrottled(mapLatState, mapLatUrlState, 2000);
  useSyncStateThrottled(mapLonState, mapLonUrlState, 2000);
  useSyncStateThrottled(mapZoomState, mapZoomUrlState, 2000);
}
