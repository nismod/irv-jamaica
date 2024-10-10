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
const landuseTreeURLs = mapValues(landuseTreeConfig.nodes, (node) => node.url);
const landuseTreeIDs = Object.keys(landuseTreeURLs);

function parseTreeFromString(value: string) {
  const separator = value.includes('.') ? '.' : ',';
  const checkedFields = value.split(separator).filter(Boolean);
  const checked = {};
  checkedFields.forEach((url) => {
    const id = landuseTreeIDs.includes(url)
      ? url // url is a layer ID.
      : Object.keys(landuseTreeURLs).find((id) => landuseTreeURLs[id] === url); // url is the hex code for a layer.
    checked[id] = true;
  });
  return recalculateCheckboxStates({ checked, indeterminate: {} }, landuseTreeConfig);
}

function stringifyTree(tree: CheckboxTreeState) {
  const checkedLayers = Object.keys(tree.checked).filter(
    (id) => tree.checked[id] && !landuseTreeConfig.nodes[id].children,
  );
  const checked = checkedLayers.map((id) => landuseTreeURLs[id]);
  return checked.join('.');
}

function writeTreeToUrl(tree: CheckboxTreeState, param: string) {
  const urlTree = stringifyTree(tree);
  const url = new URL(window.location.href);
  url.searchParams.set(param, urlTree);
  window.history.replaceState({}, '', url.toString());
}

export const landuseTreeCheckboxState = atom<CheckboxTreeState>({
  key: 'landuseTreeCheckboxState',
  default: {
    checked: mapValues(landuseTreeConfig.nodes, () => true),
    indeterminate: mapValues(landuseTreeConfig.nodes, () => false),
  },
  effects: [
    ({ onSet }) => {
      onSet((newTree) => {
        if (newTree instanceof DefaultValue) {
          return;
        }
        writeTreeToUrl(newTree, 'landTree');
      });
    },
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
        return parseTreeFromString(`${value}`);
      },
      write: ({ write, reset }, value) => {
        if (value instanceof DefaultValue) {
          reset('landTree');
          return;
        }
        write('landTree', stringifyTree(value));
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
