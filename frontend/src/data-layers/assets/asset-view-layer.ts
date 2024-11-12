import { createElement } from 'react';

import {
  StyleParams,
  ViewLayer,
  ViewLayerDataAccessFunction,
  ViewLayerFunctionOptions,
} from 'lib/data-map/view-layers';
import { VectorTarget } from 'lib/data-map/types';
import { selectableMvtLayer } from 'lib/deck/layers/selectable-mvt-layer';
import { VectorLegend } from 'lib/map/legend/VectorLegend';

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
    fn({ deckProps, zoom, selection }: ViewLayerFunctionOptions) {
      const styleParams = this?.styleParams;
      const target = selection?.target as VectorTarget;
      const selectedFeatureIds = [target?.feature.id];
      return selectableMvtLayer(
        {
          selectionOptions: {
            selectedFeatureIds,
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
    renderLegend() {
      const { colorMap } = this.styleParams;
      const key = `${colorMap.fieldSpec.fieldGroup}-${colorMap.fieldSpec.field}`;
      const legendFormatConfig = this.dataFormatsFn(colorMap.fieldSpec);
      return createElement(VectorLegend, { key, colorMap, legendFormatConfig });
    },
    renderTooltip({ target }: { target: VectorTarget }) {
      return createElement(AssetHoverDescription, { key: this.id, target, viewLayer: this });
    },
  };
}
