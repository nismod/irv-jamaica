import stringify from 'json-stable-stringify';
import { FieldSpec } from 'lib/data-map/view-layers';
import { DataLoader } from './data-loader';

function getLoaderKey(layer: string, fieldSpec: FieldSpec) {
  return `${layer}__${stringify(fieldSpec)}`;
}

export class DataLoaderManager {
  private loaders: Map<string, DataLoader> = new Map();
  private nextLoaderId = 0;

  public getDataLoader(layer: string, fieldSpec: FieldSpec) {
    const loaderKey = getLoaderKey(layer, fieldSpec);
    if (!this.loaders.has(loaderKey)) {
      console.log(`Initialising data loader for ${layer} ${stringify(fieldSpec)}`);
      return this.registerDataLoader(layer, fieldSpec);
    }
    return this.loaders.get(loaderKey);
  }

  public registerDataLoader(layer: string, fieldSpec: FieldSpec) {
    const loader = new DataLoader(this.nextLoaderId.toString(), layer, fieldSpec);
    this.nextLoaderId += 1;
    const loaderKey = getLoaderKey(layer, fieldSpec);
    this.loaders.set(loaderKey, loader);
    return loader;
  }

  public clearDataLoader(layer: string, fieldSpec: FieldSpec) {
    const loaderKey = getLoaderKey(layer, fieldSpec);
    const loader = this.loaders.get(loaderKey);

    if (loader != null) {
      loader.destroy();
      this.loaders.delete(loaderKey);
    }
  }
}

export const dataLoaderManager = new DataLoaderManager();
