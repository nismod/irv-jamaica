import { ViewLayer, ViewLayerFunctionOptions } from 'lib/data-map/view-layers';
import { assetViewLayer } from 'config/view-layers/assets/asset-view-layer';
import { assetDataAccessFunction } from 'config/view-layers/assets/data-access';

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
