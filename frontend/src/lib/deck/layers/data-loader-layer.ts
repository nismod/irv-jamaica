import { DataFetcher, DataLoader } from 'lib/data-loader/data-loader';
import { MapGeoJSONFeature } from 'maplibre-gl';

export interface DataLoaderOptions {
  dataLoader: DataLoader;
  dataFetcher?: DataFetcher;
}

/**
 * Load data from the attributes API for every feature in a tile.
 */
export function dataLoaderLayer(tileProps, { dataLoader, dataFetcher }: DataLoaderOptions) {
  const {
    tile: { content },
  } = tileProps;
  if (content && dataLoader) {
    const ids: number[] = content.map((f: MapGeoJSONFeature) => f.id);
    dataLoader?.loadData(dataFetcher, ids);
  }

  return null;
}
