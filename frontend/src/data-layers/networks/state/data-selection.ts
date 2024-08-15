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
const networkTreeURLs = mapValues(networkTreeConfig.nodes, (node) => node.url);
const networkTreeIDs = Object.keys(networkTreeURLs);

function parseTreeFromString(value: string) {
  const separator = value.includes('.') ? '.' : ',';
  const checkedFields = value.split(separator).filter(Boolean);
  const checked = {};
  checkedFields.forEach((url) => {
    const id = networkTreeIDs.includes(url)
      ? url // url is a layer ID.
      : networkTreeIDs.find((id) => networkTreeURLs[id] === url); // url is the hex code for a layer.
    checked[id] = true;
  });
  return recalculateCheckboxStates({ checked, indeterminate: {} }, networkTreeConfig);
}

function stringifyTree(tree: CheckboxTreeState) {
  const checkedLayers = Object.keys(tree.checked).filter(
    (id) => tree.checked[id] && !networkTreeConfig.nodes[id].children,
  );
  const checked = checkedLayers.map((id) => networkTreeURLs[id]);
  return checked.join('.');
}

function writeTreeToUrl(tree: CheckboxTreeState, param: string) {
  const urlTree = stringifyTree(tree);
  const url = new URL(window.location.href);
  url.searchParams.set(param, urlTree);
  window.history.replaceState({}, '', url.toString());
}

export const networkTreeCheckboxState = atom<CheckboxTreeState>({
  key: 'networkTreeSelectionState',
  default: {
    checked: mapValues(networkTreeConfig.nodes, () => false),
    indeterminate: mapValues(networkTreeConfig.nodes, () => false),
  },
  effects: [
    ({ onSet }) => {
      onSet((newTree) => {
        if (newTree instanceof DefaultValue) {
          return;
        }
        writeTreeToUrl(newTree, 'netTree');
      });
    },
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
