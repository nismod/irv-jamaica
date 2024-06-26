import { DataFilterExtension } from '@deck.gl/extensions';
import { MARINE_HABITAT_COLORS } from 'config/solutions/colors';
import { ViewLayer, FieldSpec } from 'lib/data-map/view-layers';
import { VectorTarget } from 'lib/data-map/types';
import { selector } from 'recoil';
import { sectionStyleValueState, sectionVisibilityState } from 'state/sections';
import { featureProperty } from 'lib/deck/props/data-source';
import { dataColorMap } from 'lib/deck/props/color-map';
import { fillColor } from 'lib/deck/props/style';
import { Accessor } from 'lib/deck/props/getters';
import { marineFiltersState } from 'state/solutions/marine-filters';
import { selectableMvtLayer } from 'lib/deck/layers/selectable-mvt-layer';

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

function filterRange(value: boolean) {
  return value ? [1, 1] : [0, 1];
}

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

    return {
      id: 'marine',
      group: null,
      interactionGroup: 'solutions',
      fn: ({ deckProps, selection }) => {
        const target = selection?.target as VectorTarget;
        const selectedFeatureId = target?.feature.id;
        return selectableMvtLayer(
          {
            selectionOptions: {
              selectedFeatureId,
              polygonOffset: -3000,
            },
          },
          deckProps,
          {
            data: '/vector/data/natural_marine_combined.json',
            binary: false,
            filled: true,
            stroked: true,

            getLineColor: [250, 250, 250],
            getLineWidth: 2,
            lineWidthUnit: 'meters',
          },
          {
            getFilterValue: ({ properties }) => [
              parseInt(properties.within_coral_500m ?? '0'),
              parseInt(properties.within_seagrass_500m ?? '0'),
              parseInt(properties.within_mangrove_500m ?? '0'),
            ],
            filterRange: [
              filterRange(filters.location_filters.within_coral_500m),
              filterRange(filters.location_filters.within_seagrass_500m),
              filterRange(filters.location_filters.within_mangrove_500m),
            ],

            extensions: [new DataFilterExtension({ filterSize: 3 })],
          },
          fillColor(dataColorMap(dataFn, colorFn)),
        );
      },
    };
  },
});
