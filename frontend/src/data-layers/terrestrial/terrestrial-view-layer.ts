import { DataFilterExtension } from '@deck.gl/extensions';
import { createElement } from 'react';

import { VectorTarget } from 'lib/data-map/types';
import { ViewLayer } from 'lib/data-map/view-layers';
import { selectableMvtLayer } from 'lib/deck/layers/selectable-mvt-layer';
import { border, fillColor } from 'lib/deck/props/style';
import { dataColorMap } from 'lib/deck/props/color-map';

import { getSolutionsDataAccessor } from './data-access';
import { getTerrestrialDataFormats } from './data-formats';
import { LandUseOption, TerrestrialLocationFilterType } from './domains';
import { TerrestrialFilters } from './state/terrestrial-filters';
import { TerrestrialHoverDescription } from './TerrestrialHoverDescription';
import { VectorLegend } from 'lib/map/legend/VectorLegend';

function landuseFilterValue(p, landuseFilters: Set<LandUseOption>) {
  return landuseFilters.has(p.landuse_desc) ? 1 : 0;
}

function locationFilterValue(p, locationFiltersKeys: TerrestrialLocationFilterType[]) {
  //eslint-disable-next-line eqeqeq -- values are currently sometimes 1 and sometimes true
  return locationFiltersKeys.every((key) => p[key] == true) ? 1 : 0;
}

function terrestrialFilters(
  filters: TerrestrialFilters,
  landuseFilterSet: Set<LandUseOption>,
  locationFilterKeys: TerrestrialLocationFilterType[],
  doFilter: boolean = true,
) {
  return {
    getFilterValue: ({ properties }) => [
      doFilter ? landuseFilterValue(properties, landuseFilterSet) : 1,
      doFilter ? properties.slope_degrees : 1,
      doFilter ? properties.elevation_m : 1,
      doFilter ? locationFilterValue(properties, locationFilterKeys) : 1,
    ],
    filterRange: [
      [1, 1],
      doFilter ? [...filters.slope_degrees] : [1, 1],
      doFilter ? [...filters.elevation_m] : [1, 1],
      [1, 1],
    ],

    updateTriggers: {
      getFilterValue: [doFilter, landuseFilterSet, locationFilterKeys],
    },

    extensions: [new DataFilterExtension({ filterSize: 4 })],
  };
}

export function terrestrialViewLayer({
  fieldSpec,
  colorSpec,
  dataFn,
  colorFn,
  filters,
  landuseFilterSet,
  locationFilterKeys,
}): ViewLayer {
  return {
    id: 'terrestrial',
    group: null,
    interactionGroup: 'solutions',
    styleParams: colorSpec && {
      colorMap: {
        fieldSpec,
        colorSpec,
      },
    },
    dataAccessFn: getSolutionsDataAccessor,
    dataFormatsFn: getTerrestrialDataFormats,
    fn: ({ deckProps, zoom, selection }) => {
      const switchoverZoom = 14.5;
      const target = selection?.target as VectorTarget;
      const selectedFeatureIds = [target?.feature.id];

      return [
        selectableMvtLayer(
          {
            selectionOptions: {
              selectedFeatureIds,
              polygonOffset: -1000,
            },
          },
          deckProps,
          {
            id: `${deckProps.id}@points`,
            data: '/vector/data/natural_terrestrial_combined_points.json',
            visible: zoom < switchoverZoom,
            binary: false,
            filled: true,
            pointAntialiasing: false,
            stroked: false,
          },
          {
            getPointRadius: 35,
            pointRadiusUnit: 'meters',
            pointRadiusMinPixels: 4,
            pointRadiusMaxPixels: 7,
          },
          fillColor(dataColorMap(dataFn, colorFn)),
          terrestrialFilters(filters, landuseFilterSet, locationFilterKeys, zoom < switchoverZoom),
        ),
        selectableMvtLayer(
          {
            selectionOptions: {
              selectedFeatureIds,
              polygonOffset: -1000,
            },
          },
          deckProps,
          {
            data: '/vector/data/natural_terrestrial_combined.json',
            minZoom: 14,
            visible: zoom >= switchoverZoom,
            binary: false,
            filled: true,

            getLineWidth: 1,
            lineWidthUnit: 'pixels',
            lineWidthMinPixels: 1,
          },
          border(),
          fillColor(dataColorMap(dataFn, colorFn)),
          terrestrialFilters(filters, landuseFilterSet, locationFilterKeys, zoom >= switchoverZoom),
        ),
      ];
    },
    renderLegend() {
      const { colorMap } = this.styleParams;
      const key = `${colorMap.fieldSpec.fieldGroup}-${colorMap.fieldSpec.field}`;
      const legendFormatConfig = this.dataFormatsFn(colorMap.fieldSpec);
      return createElement(VectorLegend, { key, colorMap, legendFormatConfig });
    },
    renderTooltip({ target }: { target: VectorTarget }) {
      return createElement(TerrestrialHoverDescription, { key: this.id, target, viewLayer: this });
    },
  };
}
