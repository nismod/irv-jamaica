import { LANDUSE_HIERARCHY } from 'data-layers/terrestrial/sidebar/landuse-hierarchy';
import { LandUseOption } from 'data-layers/terrestrial/domains';
import {
  buildTreeConfig,
  recalculateCheckboxStates,
  CheckboxTreeState,
} from 'lib/controls/checkbox-tree/CheckboxTree';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import { atom, DefaultValue, selector } from 'recoil';
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
      read: ({ read }) => {
        const value = read('landTree');
        if (value instanceof DefaultValue) {
          return value;
        }
        const checkedFields = (value as string).split(',').filter(Boolean);
        const checked = {};
        checkedFields.forEach((id) => {
          checked[id] = true;
        });
        return recalculateCheckboxStates({ checked, indeterminate: {} }, landuseTreeConfig);
      },
      write: ({ write, reset }, value) => {
        if (value instanceof DefaultValue) {
          reset('landTree');
          return;
        }
        const checked = Object.keys(value.checked).filter(
          (id) => value.checked[id] && !landuseTreeConfig.nodes[id].children,
        );
        write('landTree', checked.join(','));
      },
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
