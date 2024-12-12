import { createClient } from '@hey-api/client-fetch';
import { noWait, selector, selectorFamily } from 'recoil';

import { featuresReadProtectedFeatures } from 'lib/api-client/sdk.gen';
import { selectionState } from './interactions/interaction-state';
import { VectorTarget } from 'lib/data-map/types';
import { dataParamState } from './data-params';
import { viewLayerState } from './layers/view-layers';
import { sectionStyleValueState } from './sections';

const apiClient = createClient({
  baseUrl: '/api',
});

type ProtectedFeatureDetailsQuery = { rcp: string; protectionLevel: number };

/**
 * Fetch a list of all adaptation options, by feature ID and layer,
 * for features protected by the current selected feature,
 * filtered by RCP and protection level.
 */
const protectedFeatureAdaptationOptionsQuery = selectorFamily({
  key: 'protectedFeatureDetails',
  get:
    ({ rcp = '2.6', protectionLevel = 1 }: ProtectedFeatureDetailsQuery) =>
    async ({ get }) => {
      const selection = get(selectionState('assets'));
      const target = selection?.target as VectorTarget;
      if (!target?.feature?.id) {
        return [];
      }
      const { data } = await featuresReadProtectedFeatures({
        client: apiClient,
        path: {
          protector_id: +target.feature.id,
        },
        query: {
          rcp,
          protection_level: protectionLevel,
        },
      });
      return data;
    },
});

/**
 * A list of all adaptation options, by feature ID and layer,
 * for features protected by the current selected feature.
 * Components using this selector will not suspend while waiting for the API.
 */
const protectedFeatureAdaptationOptionsState = selectorFamily({
  key: 'protectedFeatureDetailsState',
  get:
    ({ rcp = '2.6', protectionLevel = 1 }: ProtectedFeatureDetailsQuery) =>
    ({ get }) => {
      const loadable = get(
        noWait(protectedFeatureAdaptationOptionsQuery({ rcp, protectionLevel })),
      );
      const data = loadable.state === 'hasValue' ? loadable.contents : [];
      const error = loadable.state === 'hasError' ? loadable.contents : null;
      return { data, error };
    },
});

/**
 * Fetch a list of layer IDs for the current protected feature query set.
 */
export const protectedFeatureLayersQuery = selector({
  key: 'protectedFeatureLayersQuery',
  get: ({ get }) => {
    const rcp = get(dataParamState({ group: 'adaptation', param: 'rcp' }));
    const protectionLevel = get(
      dataParamState({ group: 'adaptation', param: 'adaptation_protection_level' }),
    );
    return new Set(
      get(protectedFeatureAdaptationOptionsQuery({ rcp, protectionLevel }))?.map(
        (feature) => feature.layer,
      ),
    );
  },
});

/**
 * A set of unique feature layer IDs for the protected feature list.
 */
export const protectedFeatureLayersState = selector({
  key: 'protectedFeatureLayers',
  get: ({ get }) => {
    const style = get(sectionStyleValueState('assets'));
    if (!style || style !== 'protectedFeatures') {
      return new Set();
    }
    const loadable = get(noWait(protectedFeatureLayersQuery));
    return loadable.state === 'hasValue' ? loadable.contents : new Set();
  },
});

/**
 * A list of adaptation options, by feature ID and layer, for the RCP and protection level
 * set by the adaptations sidebar control state.
 */
export const protectedFeatureAdaptationsState = selector({
  key: 'protectedFeatureAdaptations',
  get: ({ get }) => {
    const rcp = get(dataParamState({ group: 'adaptation', param: 'rcp' }));
    const protectionLevel = get(
      dataParamState({ group: 'adaptation', param: 'adaptation_protection_level' }),
    );
    const { data } = get(protectedFeatureAdaptationOptionsState({ rcp, protectionLevel }));
    return data;
  },
});

const viewLayerAdaptationField = selectorFamily({
  key: 'viewLayerAdaptationField',
  get:
    (viewLayerID: string) =>
    ({ get }) => {
      const viewLayer = get(viewLayerState(viewLayerID));
      return viewLayer?.styleParams?.colorMap?.fieldSpec?.field;
    },
});

export const protectedFeatureLayerDataState = selector({
  key: 'protectedFeatureLayerData',
  get: ({ get }) => {
    const viewLayersData = new Map();
    const style = get(sectionStyleValueState('assets'));
    if (!style || style !== 'protectedFeatures') {
      return viewLayersData;
    }
    const protectedFeatureAdaptations = get(protectedFeatureAdaptationsState);
    const viewLayerIDs = get(protectedFeatureLayersState);
    viewLayerIDs.forEach((viewLayerID: string) => {
      const field = get(viewLayerAdaptationField(viewLayerID));
      const viewLayerDataEntries = protectedFeatureAdaptations
        ?.filter((row) => row.layer === viewLayerID && !!row[field])
        .map((row) => [row.id, row[field]]);
      const data =
        viewLayerDataEntries.length > 0 ? Object.fromEntries(viewLayerDataEntries) : null;
      viewLayersData.set(viewLayerID, data);
    });
    return viewLayersData;
  },
});
