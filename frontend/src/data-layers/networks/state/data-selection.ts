import mapValues from 'lodash/mapValues';
import { atom } from 'jotai';

import {
  buildTreeConfig,
  recalculateCheckboxStates,
  CheckboxTreeState,
} from 'lib/controls/checkbox-tree/CheckboxTree';
import { sectionStyleValueState } from 'lib/state/sections';
import { STORAGE_PREFIX, atomWithQueryParams, setUrlParam } from 'lib/state/map-view/map-url';

import { NETWORK_LAYERS_HIERARCHY } from '../sidebar/hierarchy';

export const networkTreeExpandedState = atom<string[]>([]);

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
    if (id !== undefined) {
      checked[id] = true;
    }
  });
  return recalculateCheckboxStates({ checked, indeterminate: {} }, networkTreeConfig);
}

function stringifyTree(tree: CheckboxTreeState) {
  const checkedLayers = Object.keys(tree.checked).filter(
    (id) =>
      tree.checked[id] && networkTreeConfig.nodes[id] && !networkTreeConfig.nodes[id].children,
  );
  const checked = checkedLayers.map((id) => networkTreeURLs[id]);
  return checked.join('.');
}

const defaultNetworkTreeState: CheckboxTreeState = {
  checked: mapValues(networkTreeConfig.nodes, () => false),
  indeterminate: mapValues(networkTreeConfig.nodes, () => false),
};

const _networkTreeBase = atom<CheckboxTreeState>(
  (() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('netTree') ?? sessionStorage.getItem(STORAGE_PREFIX + 'netTree');
    if (!raw) return defaultNetworkTreeState;
    return parseTreeFromString(raw);
  })(),
);

export const networkTreeCheckboxState = atom(
  (get) => get(_networkTreeBase),
  (_get, set, newTree: CheckboxTreeState) => {
    set(_networkTreeBase, newTree);
    const str = stringifyTree(newTree);
    sessionStorage.setItem(STORAGE_PREFIX + 'netTree', str);
    set(atomWithQueryParams, setUrlParam('netTree', str));
  },
);

export const networkSelectionState = atom<string[]>((get) => {
  const checkboxState = get(networkTreeCheckboxState);

  return Object.keys(checkboxState.checked).filter(
    (id) =>
      checkboxState.checked[id] &&
      networkTreeConfig.nodes[id] &&
      !networkTreeConfig.nodes[id].children,
  );
});

export const networksStyleState = atom((get) => get(sectionStyleValueState('assets')));
