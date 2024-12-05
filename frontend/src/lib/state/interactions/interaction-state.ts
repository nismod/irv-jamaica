import forEach from 'lodash/forEach';
import { atom, atomFamily, selector, selectorFamily } from 'recoil';

import { InteractionLayer } from 'lib/data-map/types';
import { isReset } from 'lib/recoil/is-reset';
import { ApiClient } from 'lib/api-client';

type IT = InteractionLayer | InteractionLayer[];

export function hasHover(target: IT) {
  if (Array.isArray(target)) {
    return target.length > 0;
  }
  return !!target;
}

export const hoverState = atomFamily<IT, string>({
  key: 'hoverState',
  default: null,
});

export const hoverPositionState = atom({
  key: 'hoverPosition',
  default: null,
});

function readFromUrl(param: string) {
  const url = new URL(window.location.href);
  return url.searchParams.get(param)?.split('.') || [];
}

function writeToUrl(param: string, featureId: number, viewLayerId: string) {
  const url = new URL(window.location.href);
  if (featureId) {
    const value = `${viewLayerId}.${featureId}`;
    url.searchParams.set(param, value);
  } else {
    url.searchParams.delete(param);
  }
  window.history.replaceState({}, '', url.toString());
}

const selectionChangeEffect =
  (id: string) =>
  ({ onSet, setSelf, trigger }) => {
    const param = `selected${id}`;
    onSet((newSelection) => {
      // regions and solutions aren't supported yet.
      if (id === 'assets') {
        writeToUrl(param, newSelection?.target?.feature?.id, newSelection?.viewLayer?.id);
      }
    });

    if (trigger === 'get') {
      const [viewLayerId, featureId] = readFromUrl(param);
      if (viewLayerId && featureId) {
        setSelf({
          interactionGroup: id,
          interactionStyle: 'vector', // raster selection is not supported at present.
          viewLayer: { id: viewLayerId },
          target: {
            feature: {
              id: parseInt(featureId),
            },
          },
        });
      } else {
        setSelf(null);
      }
    }
  };

/**
 * Selection state for interaction groups, including selected layer and feature for each group.
 */
export const selectionState = atomFamily<InteractionLayer, string>({
  key: 'selectionState',
  default: null,
  effects: (id) => [selectionChangeEffect(id)],
});

const apiClient = new ApiClient({
  BASE: '/api',
});

/**
 * Fetch the details of a selected asset feature from the API.
 */
export const selectedAssetDetails = selectorFamily({
  key: 'selectedFeatureState',
  get: (featureId: number) => async () => {
    const featureDetails = await apiClient.features.featuresReadFeature({ featureId });
    return featureDetails;
  },
});

type AllowedGroupLayers = Record<string, string[]>;

const allowedGroupLayersImpl = atom<AllowedGroupLayers>({
  key: 'allowedGroupLayersImpl',
  default: {},
});

function filterOneOrArray<T>(items: T | T[], filter: (item: T) => boolean) {
  if (Array.isArray(items)) {
    return items.filter(filter);
  } else {
    return items && filter(items) ? items : null;
  }
}

function filterTargets(oldHoverTargets: IT, allowedLayers: string[]): IT {
  const newLayerFilter = new Set(allowedLayers);
  return filterOneOrArray(oldHoverTargets, (target) => newLayerFilter.has(target.viewLayer.id));
}

export const allowedGroupLayersState = selector<AllowedGroupLayers>({
  key: 'allowedGroupLayersState',
  get: ({ get }) => get(allowedGroupLayersImpl),
  set: ({ get, set, reset }, newAllowedGroups) => {
    const oldAllowedGroupLayers = get(allowedGroupLayersImpl);
    if (isReset(newAllowedGroups)) {
      forEach(oldAllowedGroupLayers, (layers, group) => {
        reset(hoverState(group));
        reset(selectionState(group));
      });
    } else {
      for (const group of Object.keys(oldAllowedGroupLayers)) {
        const newAllowedLayers = newAllowedGroups[group];

        if (newAllowedLayers == null || newAllowedLayers.length === 0) {
          reset(hoverState(group));
          reset(selectionState(group));
        } else {
          const oldHoverTargets = get(hoverState(group));
          const newHoverTargets = filterTargets(oldHoverTargets, newAllowedLayers);
          set(hoverState(group), newHoverTargets);

          const oldSelectionTargets = get(selectionState(group));
          const newSelectionTargets = filterTargets(oldSelectionTargets, newAllowedLayers);
          set(selectionState(group), newSelectionTargets);
        }
      }
    }

    set(allowedGroupLayersImpl, newAllowedGroups);
  },
});
