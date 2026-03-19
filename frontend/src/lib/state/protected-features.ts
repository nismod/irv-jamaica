import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { loadable } from 'jotai/utils';

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

type ProtectedFeatureDetailsQuery = { rcp?: string };

/**
 * Fetch a list of all adaptation options, by feature ID and layer,
 * for features protected by the current selected feature,
 * filtered by RCP.
 */
const protectedFeatureAdaptationOptionsQuery = atomFamily(
  ({ rcp = '2.6' }: ProtectedFeatureDetailsQuery) =>
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

/**
 * A list of all adaptation options, by feature ID and layer,
 * for features protected by the current selected feature.
 * Components using this atom will not suspend while waiting for the API.
 */
export const protectedFeatureAdaptationOptionsState = atomFamily(
  ({ rcp = '2.6' }: ProtectedFeatureDetailsQuery) =>
    atom((get) => {
      const l = get(loadable(protectedFeatureAdaptationOptionsQuery({ rcp })));
      const data: ProtectedFeatureListItem[] = l.state === 'hasData' ? l.data : [];
      const error = l.state === 'hasError' ? l.error : null;
      return { data, error };
    }),
);

/**
 * Fetch a list of layer IDs for the current protected feature query set.
 */
export const protectedFeatureLayersQuery = atom(async (get) => {
  const rcpParam = get(dataParamState({ group: 'adaptation', param: 'rcp' }));
  const rcp = rcpParam !== null ? String(rcpParam) : undefined;
  const features = await get(protectedFeatureAdaptationOptionsQuery({ rcp }));
  return new Set(features?.map((feature) => feature.layer));
});

/**
 * A set of unique feature layer IDs for the protected feature list.
 */
export const protectedFeatureLayersState = atom((get) => {
  const style = get(sectionStyleValueState('assets'));
  if (!style || style !== 'protectedFeatures') {
    return new Set<string>();
  }
  const l = get(loadable(protectedFeatureLayersQuery));
  return l.state === 'hasData' ? l.data : new Set<string>();
});

/**
 * A list of adaptation options, by feature ID and layer, for the RCP
 * set by the adaptations sidebar control state.
 */
export const protectedFeatureAdaptationsState = atom((get) => {
  const rcpParam = get(dataParamState({ group: 'adaptation', param: 'rcp' }));
  const rcp = rcpParam !== null ? String(rcpParam) : undefined;
  const { data } = get(protectedFeatureAdaptationOptionsState({ rcp }));
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
