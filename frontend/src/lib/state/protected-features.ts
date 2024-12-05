import { selector, selectorFamily } from 'recoil';

import { ApiClient } from 'lib/api-client';
import { selectionState } from './interactions/interaction-state';
import { VectorTarget } from 'lib/data-map/types';
import { dataParamState } from './data-params';
import { viewLayersFlatState } from './layers/view-layers';

const apiClient = new ApiClient({
  BASE: '/api',
});

/**
 * Fetch a list of all adaptation options, by feature ID and layer,
 * for features protected by the current selected feature.
 */
export const protectedFeatureAdaptationOptionsState = selector({
  key: 'protectedFeatureDetails',
  get: async ({ get }) => {
    const selection = get(selectionState('assets'));
    const target = selection?.target as VectorTarget;
    if (!target?.feature?.id) {
      return [];
    }
    const featureDetails = await apiClient.features.featuresReadProtectedFeatures({
      protectorId: target.feature.id,
    });
    return featureDetails;
  },
});

/**
 * A set of unique RCP values for the protected feature list.
 */
export const protectedFeatureRCPState = selector({
  key: 'protectedFeatureRCP',
  get: ({ get }) =>
    new Set(get(protectedFeatureAdaptationOptionsState)?.map((feature) => feature.rcp)),
});

/**
 * A set of unique protection levels for the protected feature list.
 */
export const protectedFeatureProtectionLevelState = selector({
  key: 'protectedFeatureProtectionLevel',
  get: ({ get }) =>
    new Set(
      get(protectedFeatureAdaptationOptionsState)?.map(
        (feature) => feature.adaptation_protection_level,
      ),
    ),
});

/**
 * A set of unique feature layer IDs for the protected feature list.
 */
export const protectedFeatureLayersState = selector({
  key: 'protectedFeatureLayers',
  get: ({ get }) =>
    new Set(get(protectedFeatureAdaptationOptionsState)?.map((feature) => feature.layer)),
});

type ProtectedFeatureDetailsQuery = { rcp: number; protectionLevel: number };
/**
 * A list of adaptation options, by feature ID and layer,
 * filtered by RCP and protection level.
 */
export const protectedFeatureAdaptationsQuery = selectorFamily({
  key: 'protectedFeatureDetailsQuery',
  get:
    ({ rcp = 2.6, protectionLevel = 1 }: ProtectedFeatureDetailsQuery) =>
    ({ get }) =>
      get(protectedFeatureAdaptationOptionsState)?.filter(
        (item) => item.rcp === rcp && item.adaptation_protection_level === protectionLevel,
      ),
});

/**
 * A list of adaptation options, by feature ID and layer, for the RCP and protection level
 * set by the adaptations sidebar control state.
 */
export const protectedFeatureAdaptationsState = selector({
  key: 'protectedFeatureAdaptations',
  get: ({ get }) => {
    const rcpAsString = get(dataParamState({ group: 'adaptation', param: 'rcp' }));
    const rcp = parseFloat(rcpAsString);
    const protectionLevel = get(
      dataParamState({ group: 'adaptation', param: 'adaptation_protection_level' }),
    );
    return get(protectedFeatureAdaptationsQuery({ rcp, protectionLevel }));
  },
});

export const viewLayersDataState = selector({
  key: 'viewLayersData',
  get: ({ get }) => {
    const viewLayersData = new Map();
    const protectedFeatureAdaptations = get(protectedFeatureAdaptationsState);
    const viewLayerIDs = get(protectedFeatureLayersState);
    const viewLayers = get(viewLayersFlatState);
    viewLayerIDs.forEach((viewLayerID) => {
      const viewLayer = viewLayers.find((layer) => layer.id === viewLayerID);
      const fieldSpec = viewLayer?.styleParams?.colorMap?.fieldSpec;
      const field = fieldSpec?.field;
      const viewLayerDataEntries = protectedFeatureAdaptations
        ?.filter((row) => row.layer === viewLayerID)
        .map((row) => [row.id, row[field]]);
      const data =
        viewLayerDataEntries.length > 0 ? Object.fromEntries(viewLayerDataEntries) : null;
      console.log({
        viewLayerID,
        field,
        protectedFeatureAdaptations,
        viewLayerDataEntries,
      });
      viewLayersData.set(viewLayerID, data);
    });
    return viewLayersData;
  },
});
