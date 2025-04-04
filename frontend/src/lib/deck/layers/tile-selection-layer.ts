import { DataFilterExtension } from '@deck.gl/extensions';

import { geoJsonLayer } from './base';
import { getFeatureId } from '../utils/get-feature-id';

export interface TileSelectionLayerOptions {
  selectedFeatureIds: (string | number)[] | null;
  selectionFillColor?: [number, number, number, number];
  selectionLineColor?: [number, number, number, number];
  polygonOffset?: number;
}

/**
 * GeoJSON layer highlighting a list of selected feature IDs.
 */
export function tileSelectionLayer(
  tileProps,
  {
    selectedFeatureIds,
    selectionFillColor = [0, 255, 255, 255],
    selectionLineColor = [0, 255, 255, 255],
    polygonOffset = 0,
  }: TileSelectionLayerOptions,
) {
  return geoJsonLayer(tileProps, {
    id: tileProps.id + '-selection',
    pickable: false,
    getPolygonOffset: ({ layerIndex }) => [0, -layerIndex * 100 + polygonOffset],
    visible: selectedFeatureIds != null,
    refinementStrategy: 'no-overlap',

    getLineWidth: 2,
    lineWidthUnits: 'pixels',
    getFillColor: selectionFillColor,
    getLineColor: selectionLineColor,

    updateTriggers: {
      getLineWidth: selectedFeatureIds,
      getFilterValue: selectedFeatureIds,
    },

    // use on-GPU filter extension to only show the selected features
    getFilterValue: (x) => (selectedFeatureIds?.includes(getFeatureId(x)) ? 1 : 0),
    filterRange: [1, 1],
    extensions: [new DataFilterExtension({ filterSize: 1 })],
  });
}
