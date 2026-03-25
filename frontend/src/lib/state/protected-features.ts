import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { unwrap } from 'jotai/utils';

import { createClient } from 'lib/api-client/client';
import { featuresReadProtectedFeatures } from 'lib/api-client/sdk.gen';
import { ProtectedFeatureListItem } from 'lib/api-client/types.gen';
import { selectionState } from './interactions/interaction-state';
import { VectorTarget } from 'lib/data-map/types';
import { dataParamState } from './data-params';
import { viewLayerState } from './layers/view-layers';
import { sectionStyleValueState } from './sections';

const apiClient = createClient({
  baseUrl: '/api',
});

/**
 * Fetch a list of all adaptation options, by feature ID and layer,
 * for features protected by the current selected feature,
 * filtered by RCP.
 */
const protectedFeatureAdaptationOptionsQuery = atomFamily((rcp: string = '2.6') =>
  atom(async (get) => {
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
      },
    });
    return data;
  }),
);

const protectedFeatureAdaptationOptionsCached = atomFamily((rcp: string = '2.6') =>
  unwrap(protectedFeatureAdaptationOptionsQuery(rcp), (prev) => prev ?? []),
);

/**
 * A list of all adaptation options, by feature ID and layer,
 * for features protected by the current selected feature.
 * Components using this atom will not suspend while waiting for the API.
 */
export const protectedFeatureAdaptationOptionsState = atomFamily((rcp: string = '2.6') =>
  atom((get) => {
    try {
      const data: ProtectedFeatureListItem[] = get(
        protectedFeatureAdaptationOptionsCached(rcp ?? '2.6'),
      );
      return { data, error: null };
    } catch (error) {
      return { data: [], error };
    }
  }),
);

/**
 * Fetch a list of layer IDs for the current protected feature query set.
 */
export const protectedFeatureLayersQuery = atom(async (get) => {
  const rcpParam = get(dataParamState({ group: 'adaptation', param: 'rcp' }));
  const rcp = rcpParam !== null ? String(rcpParam) : undefined;
  const features = await get(protectedFeatureAdaptationOptionsQuery(rcp ?? '2.6'));
  return new Set(features?.map((feature) => feature.layer));
});

const protectedFeatureLayersCached = unwrap(
  protectedFeatureLayersQuery,
  (prev) => prev ?? new Set<string>(),
);

/**
 * A set of unique feature layer IDs for the protected feature list.
 */
export const protectedFeatureLayersState = atom((get) => {
  const style = get(sectionStyleValueState('assets'));
  if (!style || style !== 'protectedFeatures') {
    return new Set<string>();
  }
  try {
    return get(protectedFeatureLayersCached);
  } catch {
    return new Set<string>();
  }
});

/**
 * A list of adaptation options, by feature ID and layer, for the RCP
 * set by the adaptations sidebar control state.
 */
export const protectedFeatureAdaptationsState = atom((get) => {
  const rcpParam = get(dataParamState({ group: 'adaptation', param: 'rcp' }));
  const rcp = rcpParam !== null ? String(rcpParam) : undefined;
  const { data } = get(protectedFeatureAdaptationOptionsState(rcp));
  return data;
});

const viewLayerAdaptationField = atomFamily((viewLayerID: string) =>
  atom((get) => {
    const viewLayer = get(viewLayerState(viewLayerID));
    return viewLayer?.styleParams?.colorMap?.fieldSpec?.field;
  }),
);

export const protectedFeatureLayerDataState = atom((get) => {
  const viewLayersData = new Map();
  const style = get(sectionStyleValueState('assets'));
  if (!style || style !== 'protectedFeatures') {
    return viewLayersData;
  }
  const protectedFeatureAdaptations = get(protectedFeatureAdaptationsState);
  const viewLayerIDs = get(protectedFeatureLayersState);
  viewLayerIDs.forEach((viewLayerID: string) => {
    const field = get(viewLayerAdaptationField(viewLayerID));
    const viewLayerDataEntries: [number, string | number][] = protectedFeatureAdaptations
      ?.filter((row) => row.layer === viewLayerID && !!row[field])
      .map((row) => [row.id, row[field]]);
    const data = viewLayerDataEntries.length > 0 ? Object.fromEntries(viewLayerDataEntries) : null;
    viewLayersData.set(viewLayerID, data);
  });
  return viewLayersData;
});
