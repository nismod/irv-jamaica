import { parseSync } from '@loaders.gl/core';
import { WKTLoader } from '@loaders.gl/wkt';
import bbox from '@turf/bbox';
import pick from 'lodash/pick';
import { atom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai-family';

import { createClient } from 'lib/api-client/client';
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

const sortedFeaturesState = atomFamily((queryKey: string) => {
  const { fieldGroup, field, dimensions, parameters, page, pageSize, ...layerSpec } =
    JSON.parse(queryKey) as SortedFeaturesQuery;
  return atom(async () => {
      try {
        if (dimensions === '{}') {
          return {
            features: [],
            pageInfo: {
              page,
              size: pageSize,
              total: 0,
            },
            error: null,
          };
        }
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
        return { features, pageInfo, error: null };
      } catch (error) {
        return {
          features: [],
          pageInfo: {
            page,
            size: pageSize,
            total: 0,
          },
          error,
        };
      }
    });
});

export interface LayerSpec {
  layer?: string;
  sector?: string;
  subsector?: string;
  asset_type?: string;
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
  const queryKey = JSON.stringify({ fieldGroup, field, dimensions, parameters, page, pageSize, ...layerSpec });
  const result = useAtomValue(sortedFeaturesState(queryKey));

  const { features = [], pageInfo = { page, size: pageSize, total: 0 }, error = null } =
    result ?? {};

  return {
    features,
    pageInfo,
    error,
  };
};
