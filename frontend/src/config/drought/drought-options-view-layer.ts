import { createElement } from 'react';

import { ASSETS_SOURCE } from 'config/assets/source';
import { colorMap } from 'lib/color-map';
import { ViewLayer } from 'lib/data-map/view-layers';
import { VectorTarget } from 'lib/data-map/types';
import { selectableMvtLayer } from 'lib/deck/layers/selectable-mvt-layer';
import { border, fillColor, pointRadius } from 'lib/deck/props/style';
import { dataColorMap } from 'lib/deck/props/color-map';

import { getDroughtDataAccessor } from './data-access';
import { getDroughtOptionsDataFormats } from './data-formats';
import { DroughtHoverDescription } from './DroughtHoverDescription';

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
    renderTooltip({ target }: { target: VectorTarget }) {
      return createElement(DroughtHoverDescription, { key: this.id, target, viewLayer: this });
    },
  };
}
