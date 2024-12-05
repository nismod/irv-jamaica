import memoize from 'lodash/memoize';
import { MapGeoJSONFeature } from 'maplibre-gl';

import { Accessor, withTriggers } from './getters';

export const featureProperty = memoize(
  (field: string | Accessor<any, MapGeoJSONFeature>): Accessor<any, MapGeoJSONFeature> => {
    return typeof field === 'string' ? withTriggers((f) => f.properties[field], [field]) : field;
  },
);
