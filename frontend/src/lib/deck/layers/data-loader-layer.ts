import { DataLoader } from 'lib/data-loader/data-loader';
import { MapGeoJSONFeature } from 'maplibre-gl';

export interface DataLoaderOptions {
  dataLoader: DataLoader;
  data?: Record<string, any>;
}

/**
 * Load data from the attributes API for every feature in a tile.
 */
export function dataLoaderLayer(tileProps, { dataLoader, data }: DataLoaderOptions) {
  const {
    tile: { content },
  } = tileProps;
  if (content && dataLoader) {
    if (data) {
      dataLoader.loadData(data);
    } else {
      const ids: number[] = content.map((f: MapGeoJSONFeature) => f.id);
      dataLoader.loadDataForIds(ids);
    }
  }

  return null;
}
