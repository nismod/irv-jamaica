import { selector } from 'recoil';

import { droughtRcpParamState } from 'data-layers/droughtRisks/state/data-selection';
import { ColorSpec, FieldSpec, ViewLayer } from 'lib/data-map/view-layers';
import { sectionVisibilityState } from 'state/sections';

import * as droughtOptionsColorSpecLookup from '../color-maps';
import { droughtOptionsViewLayer } from '../drought-options-view-layer';
import { DROUGHT_OPTIONS_VARIABLES_WITH_RCP } from '../metadata';
import { droughtOptionsVariableState, droughtShowOptionsState } from './data-selection';

export const droughtOptionsFieldSpecState = selector<FieldSpec>({
  key: 'droughtOptionsFieldSpecState',
  get: ({ get }) => {
    const field = get(droughtOptionsVariableState);

    const rcp = get(droughtRcpParamState);

    return {
      fieldGroup: 'properties',
      field,
      fieldDimensions: DROUGHT_OPTIONS_VARIABLES_WITH_RCP.includes(field)
        ? {
            rcp,
          }
        : {},
    };
  },
});

export const droughtOptionsColorSpecState = selector<ColorSpec>({
  key: 'droughtOptionsColorSpecState',
  get: ({ get }) => {
    const field = get(droughtOptionsVariableState);
    return droughtOptionsColorSpecLookup[field];
  },
});

export const droughtOptionsLayerState = selector<ViewLayer>({
  key: 'droughtOptionsLayerState',
  get: ({ get }) => {
    const showDroughts = get(sectionVisibilityState('drought')) && get(droughtShowOptionsState);

    if (!showDroughts) {
      return null;
    }

    const fieldSpec = get(droughtOptionsFieldSpecState);
    const colorSpec = get(droughtOptionsColorSpecState);

    return droughtOptionsViewLayer({ fieldSpec, colorSpec });
  },
});
