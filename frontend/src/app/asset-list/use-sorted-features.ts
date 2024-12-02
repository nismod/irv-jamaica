import { parseSync } from '@loaders.gl/core';
import { WKTLoader } from '@loaders.gl/wkt';
import bbox from '@turf/bbox';
import pick from 'lodash/pick';
import { selectorFamily, useRecoilValue } from 'recoil';

import { ApiClient, FeatureListItemOut_float_ } from 'lib/api-client';
import { BoundingBox } from 'lib/bounding-box';
import { FieldSpec } from 'lib/data-map/view-layers';

const apiClient = new ApiClient({
  BASE: 'api',
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
        const response = await apiClient.features.featuresReadSortedFeatures({
          ...layerSpec,
          fieldGroup,
          field,
          dimensions,
          parameters,
          page,
          size: pageSize,
        });
        const features = (response.items as FeatureListItemOut_float_[]).map(processFeature);
        const pageInfo = pick(response, ['page', 'size', 'total']);
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
export type ListFeature = Omit<FeatureListItemOut_float_, 'bbox_wkt'> & {
  bbox: BoundingBox;
};

function processFeature(f: FeatureListItemOut_float_): ListFeature {
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
