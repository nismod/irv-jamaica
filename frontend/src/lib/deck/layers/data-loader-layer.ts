import { DataLoader } from 'lib/data-loader/data-loader';
import { getFeatureId } from '../utils/get-feature-id';

export interface DataLoaderOptions {
  dataLoader: DataLoader;
}

/**
 * Load data from the attributes API for every feature in a tile.
 */
export function dataLoaderLayer(tileProps, { dataLoader }: DataLoaderOptions) {
  const {
    tile: { content },
  } = tileProps;
  if (content && dataLoader) {
    const ids: number[] = !dataLoader.hasData ? content.map((f) => getFeatureId(f, 'id')) : [];

    dataLoader.loadDataForIds(ids);
  }

  return null;
}
