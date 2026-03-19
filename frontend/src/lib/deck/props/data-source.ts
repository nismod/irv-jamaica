import memoize from 'lodash/memoize';
import { MapGeoJSONFeature } from 'maplibre-gl';

import { Accessor, withTriggers } from './getters';

export const featureProperty = memoize(
  <T = string>(field: string | Accessor<T, MapGeoJSONFeature>): Accessor<T, MapGeoJSONFeature> => {
    return typeof field === 'string'
      ? withTriggers((f) => f.properties[field] as T, [field])
      : field;
  },
);
