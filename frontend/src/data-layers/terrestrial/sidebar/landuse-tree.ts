import { LANDUSE_HIERARCHY } from 'data-layers/terrestrial/sidebar/landuse-hierarchy';
import { LandUseOption } from 'data-layers/terrestrial/domains';
import { buildTreeConfig, CheckboxTreeState } from 'lib/controls/checkbox-tree/CheckboxTree';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import { atom, selector } from 'recoil';
import { object, bool, dict } from '@recoiljs/refine';
import { urlSyncEffect } from 'recoil-sync';

export const landuseTreeExpandedState = atom<string[]>({
  key: 'landuseTreeExpandedState',
  default: [],
});

export const landuseTreeConfig = buildTreeConfig(LANDUSE_HIERARCHY);

export const landuseTreeCheckboxState = atom<CheckboxTreeState>({
  key: 'landuseTreeCheckboxState',
  default: {
    checked: mapValues(landuseTreeConfig.nodes, () => true),
    indeterminate: mapValues(landuseTreeConfig.nodes, () => false),
  },
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'landTree',
      refine: object({
        checked: dict(bool()),
        indeterminate: dict(bool()),
      }),
    }),
  ],
});

export const landuseFilterState = selector<Record<LandUseOption, boolean>>({
  key: 'landuseFilterState',
  get: ({ get }) => {
    const checkboxState = get(landuseTreeCheckboxState).checked;

    return pickBy(checkboxState, (value, id) => !landuseTreeConfig.nodes[id].children) as Record<
      LandUseOption,
      boolean
    >;
  },
});
