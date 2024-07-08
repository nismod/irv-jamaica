import { createElement } from 'react';

import { ASSETS_SOURCE } from 'config/view-layers/assets/source';
import { colorMap } from 'lib/color-map';
import { ViewLayer } from 'lib/data-map/view-layers';
import { VectorTarget } from 'lib/data-map/types';
import { selectableMvtLayer } from 'lib/deck/layers/selectable-mvt-layer';
import { border, fillColor, pointRadius } from 'lib/deck/props/style';
import { dataColorMap } from 'lib/deck/props/color-map';
import { VectorLegend } from 'map/legend/VectorLegend';

import { getDroughtDataAccessor } from './data-access';
import { getDroughtOptionsDataFormats } from './data-formats';
import { DroughtOptionsHoverDescription } from './DroughtOptionsHoverDescription';

export function droughtOptionsViewLayer({ fieldSpec, colorSpec }): ViewLayer {
  const dataFn = getDroughtDataAccessor(fieldSpec);
  const colorFn = colorMap(colorSpec);
  return {
    id: 'drought_options',
    group: null,
    interactionGroup: 'drought',
    dataAccessFn: getDroughtDataAccessor,
    dataFormatsFn: getDroughtOptionsDataFormats,
    styleParams: {
      colorMap: {
        fieldSpec,
        colorSpec,
      },
    },
    fn: ({ deckProps, selection, zoom }) => {
      const target = selection?.target as VectorTarget;
      const selectedFeatureId = target?.feature.id;
      return selectableMvtLayer(
        {
          selectionOptions: {
            selectedFeatureId,
          },
        },
        deckProps,
        {
          data: ASSETS_SOURCE.getDataUrl({ assetId: 'drought_options' }),

          filled: true,
        },
        pointRadius(zoom),
        border([255, 255, 255]),
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
      return createElement(DroughtOptionsHoverDescription, {
        key: this.id,
        target,
        viewLayer: this,
      });
    },
  };
}
