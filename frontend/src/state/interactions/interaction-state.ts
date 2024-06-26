import forEach from 'lodash/forEach';
import { atom, atomFamily, selector } from 'recoil';

import { INTERACTION_GROUPS } from 'config/interaction-groups';
import { isReset } from 'lib/recoil/is-reset';
import { showPopulationState } from 'state/regions';

import { InteractionTarget, RasterTarget, VectorTarget } from './use-interactions';

type InteractionLayer = InteractionTarget<VectorTarget> | InteractionTarget<RasterTarget>;
type IT = InteractionLayer | InteractionLayer[];

const interactionGroupIds = [...INTERACTION_GROUPS.keys()];

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

type LayerHoverState = { isHovered: boolean; target: IT };
export const layerHoverStates = selector({
  key: 'layerHoverStates',
  get: ({ get }) => {
    const regionDataShown = get(showPopulationState);
    const mapEntries = interactionGroupIds.map((group) => {
      const target = get(hoverState(group));
      const isHovered =
        group === 'regions' ? regionDataShown && hasHover(target) : hasHover(target);
      return [group, { isHovered, target }] as [string, LayerHoverState];
    });
    return new Map<string, LayerHoverState>(mapEntries);
  },
});

export const hoverPositionState = atom({
  key: 'hoverPosition',
  default: null,
});

export const selectionState = atomFamily<InteractionLayer, string>({
  key: 'selectionState',
  default: null,
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
          set(hoverState(group), filterTargets(oldHoverTargets, newAllowedLayers));

          const oldSelectionTargets = get(selectionState(group));
          set(selectionState(group), filterTargets(oldSelectionTargets, newAllowedLayers));
        }
      }
    }

    set(allowedGroupLayersImpl, newAllowedGroups);
  },
});
