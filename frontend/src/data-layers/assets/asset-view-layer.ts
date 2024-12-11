import { createElement } from 'react';

import { StyleParams, ViewLayer, ViewLayerDataAccessFunction } from 'lib/data-map/view-layers';
import { VectorTarget } from 'lib/data-map/types';
import { assetViewLayer as baseAssetViewLayer } from 'lib/data-map/layers/assets/asset-view-layer';

import { getAssetDataFormats } from './data-formats';
import { AssetHoverDescription } from './AssetHoverDescription';

interface ViewLayerMetadata {
  group: string;
  spatialType: string;
  interactionGroup: string;
}

export function assetViewLayer(
  assetId: string,
  metadata: ViewLayerMetadata,
  selectionPolygonOffset: number,
  customFn: ({ zoom, styleParams }: { zoom: number; styleParams?: StyleParams }) => object[],
  customDataAccessFn: ViewLayerDataAccessFunction,
): ViewLayer {
  const baseLayer = baseAssetViewLayer(
    assetId,
    metadata,
    selectionPolygonOffset,
    customFn,
    customDataAccessFn,
  );
  baseLayer.dataFormatsFn = getAssetDataFormats;
  baseLayer.renderTooltip = function ({ target }: { target: VectorTarget }) {
    return createElement(AssetHoverDescription, { key: this.id, target, viewLayer: this });
  };
  return baseLayer;
}
