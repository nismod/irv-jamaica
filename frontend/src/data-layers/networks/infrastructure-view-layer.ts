import { ViewLayer, ViewLayerFunctionOptions } from 'lib/data-map/view-layers';
import { assetDataAccessFunction } from 'lib/data-map/layers/assets/data-access';

import { assetViewLayer } from 'data-layers/assets/asset-view-layer';

export function infrastructureViewLayer(
  assetId: string,
  customFn: ({ zoom, styleParams }: ViewLayerFunctionOptions) => object[],
): ViewLayer {
  return assetViewLayer(
    assetId,
    {
      group: 'networks',
      spatialType: 'vector',
      interactionGroup: 'assets',
    },
    -1000,
    customFn,
    assetDataAccessFunction(assetId),
  );
}
