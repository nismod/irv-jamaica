import { DataFilterExtension, DataFilterExtensionProps } from '@deck.gl/extensions';
import { LayerProps } from 'deck.gl';

import { geoJsonLayer } from './base';
import { getFeatureId } from '../utils/get-feature-id';

import { fillColor, strokeColor } from '../props/style';

export interface TileSelectionLayerOptions {
  selectedFeatureIds: (string | number)[] | null;
  selectionFillColor?: [number, number, number, number];
  selectionLineColor?: [number, number, number, number];
  polygonOffset?: number;
}

/**
 * Filter features by ID (or unique ID property) using the GPU extension
 * @param featureId the feature ID to filter by
 * @param uniqueIdProperty the name of a unique ID property, if feature IDs are not present
 * @returns deck.gl layer props that configure feature filtering
 */
function featureFilter(
  selectedFeatureIds: (string | number)[],
): DataFilterExtensionProps & Pick<LayerProps, 'updateTriggers' | 'extensions'> {

  return {
    updateTriggers: {
      getFilterValue: [selectedFeatureIds],
    },

    // use on-GPU filter extension to only show the selected features
    getFilterValue: (x) => (selectedFeatureIds?.includes(getFeatureId(x)) ? 1 : 0),
    filterRange: [1, 1],
    extensions: [new DataFilterExtension({ filterSize: 1 })],
  };
}

/**
 * GeoJSON layer highlighting a list of selected feature IDs.
 */
export function tileSelectionLayer(
  tileProps,
  {
    selectedFeatureIds,
    selectionFillColor = [0, 255, 255, 50],
    selectionLineColor = [0, 255, 255, 255],
    polygonOffset = 0,
  }: TileSelectionLayerOptions,
) {
  return geoJsonLayer(
    tileProps,
    {
      id: tileProps?.id + '-selection',
      pickable: false,
      getPolygonOffset: ({ layerIndex }) => [0, layerIndex * 100 - polygonOffset],
      visible: selectedFeatureIds != null,

      getLineWidth: 2,
      lineWidthUnits: 'pixels',
    },
    // use on-GPU filter extension to only show the selected feature
    featureFilter(selectedFeatureIds),

    fillColor(selectionFillColor),
    strokeColor(selectionLineColor),
  );
}
