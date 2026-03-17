import forEach from 'lodash/forEach';
import { useCallback } from 'react';
import { atom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { atomFamily } from 'jotai-family';

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

export const dataParamConfigState = atom<Record<string, DataParamGroupConfig>>({});

const paramEqual = (a: DataParamParam, b: DataParamParam) => a.group === b.group && a.param === b.param;

export const dataParamState = atomFamily(
  (_param: DataParamParam) => atom(null as Param | null),
  paramEqual,
);

export const dataParamOptionsState = atomFamily(
  (_param: DataParamParam) => atom([] as ParamDomain),
  paramEqual,
);

/**
 * A writeable selector that takes a config object, from an external source,
 * and creates new data params states for the sidebar controls.
 * Use this to initialise the sidebar from app config.
 */
export const syncExternalConfigState = atom(
  (get) => get(dataParamConfigState),
  (_get, set, newConfig: Record<string, DataParamGroupConfig>) => {
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
);

export function useUpdateDataParam(group: string, paramId: string) {
  return useAtomCallback(
    useCallback(
      (get, set, newValue: Param) => {
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
          const atomParam = { group, param: paramId };
          set(dataParamState(atomParam), resolvedParamValue);
          set(dataParamOptionsState(atomParam), resolvedOptions[paramId]);
        });
      },
      [group, paramId],
    ),
  );
}
