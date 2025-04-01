import { createClient } from '@hey-api/client-fetch';
import { parseSync } from '@loaders.gl/core';
import { WKTLoader } from '@loaders.gl/wkt';
import bbox from '@turf/bbox';
import pick from 'lodash/pick';
import { selectorFamily, useRecoilValue } from 'recoil';

import { featuresReadSortedFeatures } from 'lib/api-client/sdk.gen';
import { FeatureListItemOutFloat } from 'lib/api-client/types.gen';
import { BoundingBox } from 'lib/bounding-box';
import { FieldSpec } from 'lib/data-map/view-layers';

const apiClient = createClient({
  baseUrl: 'api',
});

export interface PageInfo {
  page?: number;
  size?: number;
  total: number;
}

type SortedFeaturesQuery = {
  fieldGroup: string;
  field: string;
  dimensions: string;
  parameters: string;
  page: number;
  pageSize: number;
};

const sortedFeaturesState = selectorFamily({
  key: 'sorted-features',
  get:
    ({
      fieldGroup,
      field,
      dimensions,
      parameters,
      page,
      pageSize,
      ...layerSpec
    }: SortedFeaturesQuery) =>
    async () => {
      try {
        if (dimensions === '{}') {
          return;
        }
        // if (fieldGroup !== 'damages') {
        //   throw new Error('Only damages field is supported');
        // }
        const { data } = await featuresReadSortedFeatures({
          client: apiClient,
          path: {
            field_group: fieldGroup,
          },
          query: {
            field,
            dimensions,
            parameters,
            ...layerSpec,
            page,
            size: pageSize,
          },
        });
        const features = (data.items as FeatureListItemOutFloat[]).map(processFeature);
        const pageInfo = pick(data, ['page', 'size', 'total']);
        return { features, pageInfo };
      } catch (error) {
        return { features: [], loading: false, error };
      }
    },
});

export interface LayerSpec {
  layer?: string;
  sector?: string;
  subsector?: string;
  assetType?: string;
}
export type ListFeature = Omit<FeatureListItemOutFloat, 'bbox_wkt'> & {
  bbox: BoundingBox;
};

function processFeature(f: FeatureListItemOutFloat): ListFeature {
  const originalBboxGeom = parseSync(f.bbox_wkt, WKTLoader);
  const processedBbox: BoundingBox = bbox(originalBboxGeom) as BoundingBox;

  return {
    ...f,
    bbox: processedBbox,
  };
}

export const useSortedFeatures = (
  layerSpec: LayerSpec,
  fieldSpec: FieldSpec,
  page = 1,
  pageSize = 50,
) => {
  const { fieldGroup, fieldDimensions, field, fieldParams } = fieldSpec;
  const dimensions = JSON.stringify(fieldDimensions);
  const parameters = JSON.stringify(fieldParams);
  const { features, pageInfo, error } = useRecoilValue(
    sortedFeaturesState({
      fieldGroup,
      field,
      dimensions,
      parameters,
      page,
      pageSize,
      ...layerSpec,
    }),
  );

  return {
    features,
    pageInfo,
    error,
  };
};
