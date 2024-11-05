import { DataFilterExtension } from '@deck.gl/extensions';
import { createElement } from 'react';

import { VectorTarget } from 'lib/data-map/types';
import { ViewLayer } from 'lib/data-map/view-layers';
import { selectableMvtLayer } from 'lib/deck/layers/selectable-mvt-layer';
import { dataColorMap } from 'lib/deck/props/color-map';
import { fillColor } from 'lib/deck/props/style';
import { VectorLegend } from 'app/map/legend/VectorLegend';

import { SolutionHoverDescription } from './MarineHoverDescription';

function filterRange(value: boolean) {
  return value ? [1, 1] : [0, 1];
}

export function marineViewLayer({ dataFn, colorFn, filters }): ViewLayer {
  return {
    id: 'marine',
    group: null,
    interactionGroup: 'solutions',
    fn: ({ deckProps, selection }) => {
      const target = selection?.target as VectorTarget;
      const selectedFeatureIds = [target?.feature.id];
      return selectableMvtLayer(
        {
          selectionOptions: {
            selectedFeatureIds,
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
    renderLegend() {
      const { colorMap } = this.styleParams;
      const key = `${colorMap.fieldSpec.fieldGroup}-${colorMap.fieldSpec.field}`;
      const legendFormatConfig = this.dataFormatsFn(colorMap.fieldSpec);
      return createElement(VectorLegend, { key, colorMap, legendFormatConfig });
    },
    renderTooltip({ target }: { target: VectorTarget }) {
      return createElement(SolutionHoverDescription, { key: this.id, target, viewLayer: this });
    },
  };
}
