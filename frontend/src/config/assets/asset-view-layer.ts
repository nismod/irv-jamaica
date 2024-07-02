import { createElement } from 'react';

import {
  StyleParams,
  ViewLayer,
  ViewLayerDataAccessFunction,
  ViewLayerFunctionOptions,
} from 'lib/data-map/view-layers';
import { VectorTarget } from 'lib/data-map/types';
import { selectableMvtLayer } from 'lib/deck/layers/selectable-mvt-layer';

import { getAssetDataFormats } from './data-formats';
import { ASSETS_SOURCE } from './source';
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
  const { group, spatialType, interactionGroup } = metadata;

  return {
    id: assetId,
    group,
    spatialType,
    interactionGroup,
    params: {
      assetId,
    },
    fn: ({ deckProps, zoom, styleParams, selection }: ViewLayerFunctionOptions) => {
      const target = selection?.target as VectorTarget;
      const selectedFeatureId = target?.feature.id;
      return selectableMvtLayer(
        {
          selectionOptions: {
            selectedFeatureId,
            polygonOffset: selectionPolygonOffset,
          },
          dataLoaderOptions: {
            dataLoader: customDataAccessFn?.(styleParams?.colorMap?.fieldSpec)?.dataLoader,
          },
        },
        deckProps,
        {
          data: ASSETS_SOURCE.getDataUrl({ assetId }),
        },
        ...customFn({ zoom, styleParams }),
      );
    },
    dataAccessFn: customDataAccessFn,
    dataFormatsFn: getAssetDataFormats,
    renderTooltip({ target }: { target: VectorTarget }) {
      return createElement(AssetHoverDescription, { key: this.id, target, viewLayer: this });
    },
  };
}
