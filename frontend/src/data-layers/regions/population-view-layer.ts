import { createElement } from 'react';

import { population } from './color-maps';
import { colorMap } from 'lib/color-map';
import { FieldSpec, ViewLayer } from 'lib/data-map/view-layers';
import { VectorTarget } from 'lib/data-map/types';
import { selectableMvtLayer } from 'lib/deck/layers/selectable-mvt-layer';
import { dataColorMap } from 'lib/deck/props/color-map';
import { featureProperty } from 'lib/deck/props/data-source';
import { border, fillColor } from 'lib/deck/props/style';
import { VectorLegend } from 'lib/map/legend/VectorLegend';

import { RegionLevel } from './metadata';
import { REGIONS_SOURCE } from './source';
import { RegionHoverDescription } from './RegionHoverDescription';
import { getFeatureId } from 'lib/deck/utils/get-feature-id';

export function populationViewLayer(regionLevel: RegionLevel): ViewLayer {
  const source = REGIONS_SOURCE;

  const fieldSpec: FieldSpec = {
    fieldGroup: 'properties',
    field: 'population_density_per_km2',
  };
  const colorSpec = population;

  return {
    id: `population_${regionLevel}`,
    interactionGroup: 'regions',
    spatialType: 'vector',
    group: 'regions',
    params: {
      regionLevel,
    },
    styleParams: {
      colorMap: {
        fieldSpec,
        colorSpec,
      },
    },
    dataFormatsFn: () => ({
      getDataLabel: () => 'Population density',
      getValueFormatted: (value: number) => `${value.toLocaleString()}/km²`,
    }),
    fn: ({ deckProps, zoom, selection }) => {
      const target = selection?.target as VectorTarget;
      const selectedFeatureIds = [getFeatureId(target?.feature)];
      return selectableMvtLayer(
        { selectionOptions: { selectedFeatureIds } },
        deckProps,
        {
          data: source.getDataUrl({ regionLevel }),
        },
        (regionLevel === 'parish' || zoom > 12) && border([40, 40, 40, 255]),
        fillColor(dataColorMap(featureProperty('population_density_per_km2'), colorMap(colorSpec))),
        {
          highlightColor: [0, 255, 255, 100],
        },
      );
    },
    renderLegend() {
      const { colorMap } = this.styleParams;
      const key = `${colorMap.fieldSpec.fieldGroup}-${colorMap.fieldSpec.field}`;
      const legendFormatConfig = this.dataFormatsFn(colorMap.fieldSpec);
      return createElement(VectorLegend, { key, colorMap, legendFormatConfig });
    },
    renderTooltip({ target }: { target: VectorTarget }) {
      return createElement(RegionHoverDescription, { key: this.id, target, viewLayer: this });
    },
  };
}
