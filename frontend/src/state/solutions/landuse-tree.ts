import { LANDUSE_HIERARCHY } from 'config/terrestrial/landuse-hierarchy';
import { LandUseOption } from 'config/terrestrial/domains';
import { buildTreeConfig, CheckboxTreeState } from 'lib/controls/checkbox-tree/CheckboxTree';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import { atom, selector } from 'recoil';

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
