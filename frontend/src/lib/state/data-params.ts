import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import mapValues from 'lodash/mapValues';
import { atom, atomFamily, selector, useRecoilTransaction_UNSTABLE } from 'recoil';

import {
  DataParamGroupConfig,
  Param,
  ParamDomain,
  resolveParamDependencies,
} from 'lib/controls/data-params';
import { toDictionary } from 'lib/helpers';
import { groupedFamily } from 'lib/recoil/grouped-family';

export type DataParamParam = Readonly<{
  group: string;
  param: string;
}>;

export const dataParamConfigState = atom({
  key: 'dataParamConfigState',
  default: {},
});

export const dataParamState = atomFamily<Param, DataParamParam>({
  key: 'dataParamState',
  default: null,
});

export const dataParamOptionsState = atomFamily<ParamDomain, DataParamParam>({
  key: 'dataParamOptionsState',
  default: [],
});

export const dataParamNamesByGroupState = atomFamily<string[], string>({
  key: 'dataParamNamesByGroupState',
  default: [],
});

export const dataParamsByGroupState = groupedFamily<Param, DataParamParam>(
  'dataParamsByGroupState',
  dataParamState,
  dataParamNamesByGroupState,
  (group, param) => ({ group, param }),
);

export const dataParamOptionsByGroupState = groupedFamily<ParamDomain, DataParamParam>(
  'dataParamOptionsByGroupState',
  dataParamOptionsState,
  dataParamNamesByGroupState,
  (group, param) => ({ group, param }),
);

/**
 * A writeable selector that takes a config object, from an external source,
 * and creates new data params states for the sidebar controls.
 * Use this to initialise the sidebar from app config.
 */
export const syncExternalConfigState = selector({
  key: 'syncedConfigState',
  get: ({ get }) => get(dataParamConfigState),
  set: ({ set }, newConfig: Record<string, DataParamGroupConfig>) => {
    set(dataParamConfigState, newConfig);
    const dataParamNamesByGroup = mapValues(newConfig, (groupConfig) =>
      keys(groupConfig.paramDefaults),
    );
    const dataParamDefaultsByGroup = mapValues(newConfig, (groupConfig) =>
      resolveParamDependencies(groupConfig.paramDefaults, groupConfig),
    );
    Object.keys(newConfig).forEach((group) => {
      const paramNames = dataParamNamesByGroup[group];
      const [defaultValues, options] = dataParamDefaultsByGroup[group];
      set(dataParamNamesByGroupState(group), paramNames);
      paramNames.forEach((param) => {
        set(dataParamState({ group, param }), defaultValues[param]);
        set(dataParamOptionsState({ group, param }), options[param]);
      });
    });
  },
});

export function useUpdateDataParam(group: string, paramId: string) {
  return useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      (newValue) => {
        const dataParamConfig = get(dataParamConfigState);
        const dataParamSize = Object.entries(dataParamConfig).length;
        if (dataParamSize === 0) {
          return;
        }
        const groupConfig = dataParamConfig[group];
        const paramNames = get(dataParamNamesByGroupState(group));
        const groupParams = toDictionary(
          paramNames,
          (param) => param,
          (param) => get(dataParamState({ group, param })),
        );

        const [resolvedParams, resolvedOptions] = resolveParamDependencies(
          { ...groupParams, [paramId]: newValue },
          groupConfig,
        );

        forEach(resolvedParams, (resolvedParamValue, paramId) => {
          const recoilParam = { group, param: paramId };
          set(dataParamState(recoilParam), resolvedParamValue);
          set(dataParamOptionsState(recoilParam), resolvedOptions[paramId]);
        });
      },
    [group, paramId],
  );
}
