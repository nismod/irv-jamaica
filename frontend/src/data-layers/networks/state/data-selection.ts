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
import { stringify } from 'querystring';

export const networkTreeExpandedState = atom<string[]>({
  key: 'networkTreeExpandedState',
  default: [],
});

export const networkTreeConfig = buildTreeConfig(NETWORK_LAYERS_HIERARCHY);

function parseTreeFromString(value: string) {
  const checkedFields = value.split(',').filter(Boolean);
  const checked = {};
  checkedFields.forEach((id) => {
    checked[id] = true;
  });
  return recalculateCheckboxStates({ checked, indeterminate: {} }, networkTreeConfig);
}

function stringifyTree(tree: CheckboxTreeState) {
  const checked = Object.keys(tree.checked).filter(
    (id) => tree.checked[id] && !networkTreeConfig.nodes[id].children,
  );
  return checked.join(',');
}

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
        console.log('read', value);
        if (value instanceof DefaultValue) {
          return value;
        }
        return parseTreeFromString(value as string);
      },
      write: ({ write, reset }, value) => {
        if (value instanceof DefaultValue) {
          reset('netTree');
          return;
        }
        write('netTree', stringifyTree(value));
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
