import { NETWORK_LAYERS_HIERARCHY } from '../sidebar/hierarchy';
import {
  buildTreeConfig,
  recalculateCheckboxStates,
  CheckboxTreeState,
} from 'lib/controls/checkbox-tree/CheckboxTree';
import mapValues from 'lodash/mapValues';
import { atom, DefaultValue, selector } from 'recoil';
import { sectionStyleValueState } from 'app/state/sections';
import { urlSyncEffect } from 'recoil-sync';
import { bool, dict, object } from '@recoiljs/refine';

export const networkTreeExpandedState = atom<string[]>({
  key: 'networkTreeExpandedState',
  default: [],
});

export const networkTreeConfig = buildTreeConfig(NETWORK_LAYERS_HIERARCHY);

export const networkTreeCheckboxState = atom<CheckboxTreeState>({
  key: 'networkTreeSelectionState',
  default: {
    checked: mapValues(networkTreeConfig.nodes, () => false),
    indeterminate: mapValues(networkTreeConfig.nodes, () => false),
  },
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'netTree',
      refine: object({
        checked: dict(bool()),
        indeterminate: dict(bool()),
      }),
      read: ({ read }) => {
        const value = read('netTree');
        if (value instanceof DefaultValue) {
          return value;
        }
        const checkedFields = (value as string).split(',');
        const checked = {};
        checkedFields.forEach((id) => {
          checked[id] = true;
        });
        return recalculateCheckboxStates({ checked, indeterminate: {} }, networkTreeConfig);
      },
      write: ({ write, reset }, value) => {
        if (value instanceof DefaultValue) {
          reset('netTree');
          return;
        }
        const checked = Object.keys(value.checked).filter(
          (id) => value.checked[id] && !networkTreeConfig.nodes[id].children,
        );
        write('netTree', checked.join(','));
      },
    }),
  ],
});

export const networkSelectionState = selector<string[]>({
  key: 'networkSelectionState',
  get: ({ get }) => {
    const checkboxState = get(networkTreeCheckboxState);

    return Object.keys(checkboxState.checked).filter(
      (id) => checkboxState.checked[id] && !networkTreeConfig.nodes[id].children,
    );
  },
});

export const networksStyleState = selector({
  key: 'networksStyleState',
  get: ({ get }) => get(sectionStyleValueState('assets')),
});
