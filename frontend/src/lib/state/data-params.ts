import forEach from 'lodash/forEach';
import { atom, atomFamily, selector, selectorFamily, useRecoilTransaction_UNSTABLE, waitForAll } from 'lib/jotai-compat/recoil';

import {
  DataParamGroupConfig,
  Param,
  ParamDomain,
  resolveParamDependencies,
} from 'lib/controls/data-params';
import { toDictionary } from 'lib/helpers';

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

    Object.keys(newConfig).forEach((group) => {
      const groupConfig = newConfig[group];
      const paramNames = Object.keys(groupConfig.paramDefaults);
      const [defaultValues, options] = resolveParamDependencies(
        groupConfig.paramDefaults,
        groupConfig,
      );

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
        const paramNames = Object.keys(groupConfig.paramDefaults);
        const groupParams = toDictionary(
          paramNames,
          (param: string) => param,
          (param: string) => get(dataParamState({ group, param })),
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
