import { selector } from 'recoil';

import { ViewLayer, FieldSpec } from 'lib/data-map/view-layers';
import { sectionStyleValueState, sectionVisibilityState } from 'lib/state/sections';
import { featureProperty } from 'lib/deck/props/data-source';
import { Accessor } from 'lib/deck/props/getters';

import { MARINE_HABITAT_COLORS } from '../colors';
import { marineViewLayer } from '../marine-view-layer';
import { marineFiltersState } from './marine-filters';

export function habitatColorMap(x: string) {
  return MARINE_HABITAT_COLORS[x]?.css ?? MARINE_HABITAT_COLORS['other'].css;
}

export const marineColorFn = selector<Accessor<string>>({
  key: 'marineColorSpec',
  get: ({ get }) => {
    const style = get(sectionStyleValueState('marine'));

    if (style === 'habitat') {
      return habitatColorMap;
    }
  },
});

export const marineFieldSpecState = selector<FieldSpec>({
  key: 'marineFieldSpecState',
  get: ({ get }) => {
    const style = get(sectionStyleValueState('marine'));

    let field: string;

    if (style === 'habitat') {
      field = 'habitat';
    }

    return {
      fieldGroup: 'properties',
      field,
    };
  },
});

export const marineLayerState = selector<ViewLayer>({
  key: 'marineLayerState',
  get: ({ get }) => {
    const showMarine = get(sectionVisibilityState('marine'));

    if (!showMarine) {
      return null;
    }

    const filters = get(marineFiltersState);
    const fieldSpec = get(marineFieldSpecState);

    const dataFn = featureProperty(fieldSpec.field);
    const colorFn = get(marineColorFn);

    if (!colorFn || !dataFn) {
      return null;
    }

    return marineViewLayer({ dataFn, colorFn, filters });
  },
});
