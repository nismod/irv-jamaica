import memoize from 'lodash/memoize';
import { MapGeoJSONFeature } from 'maplibre-gl';

import { DataLoader } from 'lib/data-loader/data-loader';

import { Accessor, withLoaderTriggers, withTriggers } from './getters';

export const featureProperty = memoize(
  (field: string | Accessor<any, MapGeoJSONFeature>): Accessor<any, MapGeoJSONFeature> => {
    return typeof field === 'string' ? withTriggers((f) => f.properties[field], [field]) : field;
  },
);

export function extraProperty(dataLoader: DataLoader): Accessor<any> {
  return withLoaderTriggers((f) => dataLoader.getData(f.id), dataLoader);
}
