import { NETWORK_LAYERS_HIERARCHY } from '../sidebar/hierarchy';
import { buildTreeConfig, CheckboxTreeState } from 'lib/controls/checkbox-tree/CheckboxTree';
import mapValues from 'lodash/mapValues';
import { atom, selector } from 'recoil';
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
