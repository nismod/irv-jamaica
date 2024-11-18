import { createClient } from '@hey-api/client-fetch';
import forEach from 'lodash/forEach';
import { atom, atomFamily, selector, selectorFamily } from 'recoil';

import { featuresReadFeature, featuresReadProtectedFeatures } from 'lib/api-client/sdk.gen';
import { InteractionLayer, VectorTarget } from 'lib/data-map/types';
import { isReset } from 'lib/recoil/is-reset';

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

const apiClient = createClient({
  baseUrl: '/api',
});

/**
 * Fetch the details of a selected asset feature from the API.
 */
export const selectedAssetDetails = selectorFamily({
  key: 'selectedFeatureState',
  get: (featureId: number) => async () => {
    const { data } = await featuresReadFeature({
      client: apiClient,
      path: {
        feature_id: featureId,
      },
    });
    return data;
  },
});

/**
 * Fetch a list of adaptation options, by feature ID and layer,
 * for features protected by the current selected feature.
 */
export const protectedFeatureDetailsState = selector({
  key: 'protectedFeatureDetails',
  get: async ({ get }) => {
    const selection = get(selectionState('assets'));
    const target = selection?.target as VectorTarget;
    if (!target?.feature?.id) {
      return null;
    }
    const { data } = await featuresReadProtectedFeatures({
      client: apiClient,
      path: {
        protector_id: +target.feature.id,
      },
    });
    return data;
  },
});

/**
 * A set of unique RCP values for the protected feature list.
 */
export const protectedFeatureRCPState = selector({
  key: 'protectedFeatureRCP',
  get: ({ get }) => new Set(get(protectedFeatureDetailsState)?.map((feature) => feature.rcp)),
});

/**
 * A set of unique protection levels for the protected feature list.
 */
export const protectedFeatureProtectionLevelState = selector({
  key: 'protectedFeatureProtectionLevel',
  get: ({ get }) =>
    new Set(
      get(protectedFeatureDetailsState)?.map((feature) => feature.adaptation_protection_level),
    ),
});

type ProtectedFeatureDetailsQuery = { rcp: number; protectionLevel: number };
/**
 * A list of adaptation options, by feature ID and layer,
 * for a specific RCP and protection level.
 */
export const protectedFeatureDetailsQuery = selectorFamily({
  key: 'protectedFeatureDetailsQuery',
  get:
    ({ rcp = 2.6, protectionLevel = 1 }: ProtectedFeatureDetailsQuery) =>
    ({ get }) =>
      get(protectedFeatureDetailsState)?.filter(
        (item) => item.rcp === rcp && item.adaptation_protection_level === protectionLevel,
      ),
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
