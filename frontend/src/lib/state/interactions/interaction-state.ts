import forEach from 'lodash/forEach';
import { WritableAtom, PrimitiveAtom, atom } from 'jotai';
import { DefaultValue } from 'lib/jotai-compat/recoil';
import { atomFamily } from 'jotai-family';

import { createClient } from 'lib/api-client/client';
import { featuresReadFeature } from 'lib/api-client/sdk.gen';
import { InteractionLayer, VectorTarget } from 'lib/data-map/types';
import { ViewLayer } from 'lib/data-map/view-layers';
import { isReset } from 'lib/recoil/is-reset';

type IT = InteractionLayer | InteractionLayer[];

export function hasHover(target: IT) {
  if (Array.isArray(target)) {
    return target.length > 0;
  }
  return !!target;
}

export const hoverState = atomFamily((_id: string) => atom(null as IT | null));

export const hoverPositionState = atom(null) as WritableAtom<
  { x: number; y: number } | null,
  unknown[],
  void
>;

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

const selectionBaseState = atomFamily((id: string): PrimitiveAtom<InteractionLayer | null> => {
  const baseAtom = atom(null as InteractionLayer | null);
  baseAtom.onMount = (set) => {
    // Initialise from URL on first subscription (equivalent to effect trigger === 'get').
    const param = `selected${id}`;
    const [viewLayerId, featureId] = readFromUrl(param);
    if (viewLayerId && featureId) {
      set({
        interactionGroup: id,
        interactionStyle: 'vector', // raster selection is not supported at present.
        viewLayer: { id: viewLayerId } as unknown as ViewLayer,
        target: { feature: { id: parseInt(featureId) } } as unknown as VectorTarget,
      });
    }
  };
  return baseAtom;
});

/**
 * Selection state for interaction groups, including selected layer and feature for each group.
 */
export const selectionState = atomFamily((id: string) =>
  atom(
    (get) => get(selectionBaseState(id)),
    (_get, set, newSelection: InteractionLayer | DefaultValue) => {
      if (newSelection instanceof DefaultValue) {
        set(selectionBaseState(id), null);
        return;
      }
      // regions and solutions aren't supported yet.
      if (id === 'assets') {
        const vectorTarget = newSelection?.target as VectorTarget;
        writeToUrl(
          `selected${id}`,
          vectorTarget?.feature?.id as number,
          newSelection?.viewLayer?.id,
        );
      }
      set(selectionBaseState(id), newSelection);
    },
  ),
);

const apiClient = createClient({
  baseUrl: '/api',
});

/**
 * Fetch the details of a selected asset feature from the API.
 */
export const selectedAssetDetails = atomFamily((featureId: number) =>
  atom(async () => {
    const { data } = await featuresReadFeature({
      client: apiClient,
      path: {
        feature_id: featureId,
      },
    });
    return data;
  }),
);

type AllowedGroupLayers = Record<string, string[]>;

const allowedGroupLayersImpl = atom<AllowedGroupLayers>({});

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

export const allowedGroupLayersState = atom(
  (get) => get(allowedGroupLayersImpl),
  (get, set, newAllowedGroups: AllowedGroupLayers | DefaultValue) => {
    const oldAllowedGroupLayers = get(allowedGroupLayersImpl);
    if (isReset(newAllowedGroups)) {
      forEach(oldAllowedGroupLayers, (_layers, group) => {
        set(hoverState(group), null);
        set(selectionState(group), new DefaultValue());
      });
      set(allowedGroupLayersImpl, {});
      return;
    }

    const nextAllowedGroups = newAllowedGroups as AllowedGroupLayers;
    for (const group of Object.keys(oldAllowedGroupLayers)) {
      const newAllowedLayers = nextAllowedGroups[group];

      if (newAllowedLayers == null || newAllowedLayers.length === 0) {
        set(hoverState(group), null);
        set(selectionState(group), new DefaultValue());
      } else {
        const oldHoverTargets = get(hoverState(group));
        const newHoverTargets = filterTargets(oldHoverTargets, newAllowedLayers);
        set(hoverState(group), newHoverTargets);

        const oldSelectionTargets = get(selectionState(group));
        const newSelectionTargets = filterTargets(oldSelectionTargets, newAllowedLayers);
        set(selectionState(group), newSelectionTargets);
      }
    }

    set(allowedGroupLayersImpl, newAllowedGroups);
  },
);
