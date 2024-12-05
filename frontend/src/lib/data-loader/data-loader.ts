import { createClient } from '@hey-api/client-fetch';

import { attributesReadAttributes } from 'lib/api-client/sdk.gen';
import { FieldSpec } from 'lib/data-map/view-layers';

export type DataLoaderSubscriber = (loader: DataLoader) => void;

export type DataFetcher = (
  ids?: number[],
  layer?: string,
  fieldSpec?: FieldSpec,
) => Promise<Record<string, any>>;

const apiClient = createClient({
  baseUrl: '/api',
});

/**
 * Fetch adaptation option values for a list of feature IDs in a given layer.
 * @param ids A list of feature IDs.
 * @param layer An asset layer ID.
 * @param fieldSpec A field specification, containing the adaptation parameters for this query.
 * @returns A list of feature IDs and values for a specific adaptation option and variable.
 */
const defaultDataFetcher: DataFetcher = async (
  ids: number[],
  layer: string,
  fieldSpec: FieldSpec,
) => {
  if (ids.length === 0) return {};
  const { fieldGroup, field, fieldDimensions, fieldParams } = fieldSpec;
  const { data } = await attributesReadAttributes({
    client: apiClient,
    body: ids,
    path: {
      field_group: fieldGroup,
    },
    query: {
      layer,
      field,
      dimensions: JSON.stringify(fieldDimensions),
      parameters: JSON.stringify(fieldParams),
    },
  });
  return data;
};

/**
 * Data loader that fetches data from the attributes API for a layer and field spec.
 * The data is stored in a map with feature IDs as keys.
 * @param id Unique ID for the data loader.
 * @param layer Layer ID.
 * @param fieldSpec Field specification.
 */
export class DataLoader<T = any> {
  constructor(
    public readonly id: string,
    public readonly layer: string,
    public readonly fieldSpec: FieldSpec,
  ) {}

  private _updateTrigger: number = 1;

  public get updateTrigger() {
    return this._updateTrigger;
  }

  private data: Map<number, T> = new Map();

  // feature IDs that have not been loaded yet
  private missingIds: Set<number> = new Set();

  // feature IDs that are currently being loaded
  private loadingIds: Set<number> = new Set();

  private subscribers: DataLoaderSubscriber[];

  private dataFetcher: DataFetcher = defaultDataFetcher;

  getData(id: number) {
    const data = this.data.get(id);

    if (data === undefined) {
      this.missingIds.add(id);
    }

    return data;
  }

  get hasData() {
    return this.data.size > 0;
  }

  async loadData(dataFetcher: DataFetcher, ids?: number[]) {
    this.dataFetcher = dataFetcher || defaultDataFetcher;
    this.loadDataForIds(ids);
  }

  subscribe(callback: DataLoaderSubscriber) {
    this.subscribers ??= [];
    this.subscribers.push(callback);
  }

  unsubscribe(callback: DataLoaderSubscriber) {
    this.subscribers = this.subscribers?.filter((subscriber) => subscriber !== callback);
  }

  destroy() {
    this.subscribers = [];
    this.data.clear();
    this.missingIds.clear();
    this.loadingIds.clear();
  }

  async loadMissingData() {
    if (this.missingIds.size === 0) return;

    const tempMissingIds = Array.from(this.missingIds).filter((id) => !this.loadingIds.has(id));

    if (tempMissingIds.length === 0) return;

    const loadedData = await this.requestMissingData(tempMissingIds);

    this.updateData(loadedData);
  }

  async loadDataForIds(ids: number[]) {
    const tempMissingIds = ids.filter(
      (id) => this.data.get(id) === undefined && !this.loadingIds.has(id),
    );

    const loadedData = await this.requestMissingData(tempMissingIds);
    this.updateData(loadedData);
  }

  private fetchData(ids: number[]) {
    return this.dataFetcher(ids, this.layer, this.fieldSpec);
  }

  private async requestMissingData(requestedIds: number[]): Promise<Record<string, T>> {
    const missingIds = requestedIds.filter((id) => !this.loadingIds.has(id));
    missingIds.forEach((id) => this.loadingIds.add(id));

    return await this.fetchData(missingIds);
  }

  private updateData(loadedData: Record<string, T>) {
    let newData = false;
    for (const [key, value] of Object.entries(loadedData)) {
      const numKey = parseInt(key, 10);
      if (this.data.get(numKey) === undefined) {
        newData = true;
        this.data.set(numKey, value);
      }

      this.missingIds.delete(numKey);
      this.loadingIds.delete(numKey);
    }

    if (newData) {
      this._updateTrigger += 1;
      this.subscribers?.forEach((subscriber) => subscriber(this));
    }
  }
}
