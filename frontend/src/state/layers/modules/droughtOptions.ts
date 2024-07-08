import * as droughtOptionsColorSpecLookup from 'config/droughtOptions/color-maps';
import { droughtOptionsViewLayer } from 'config/droughtOptions/drought-options-view-layer';
import { DROUGHT_OPTIONS_VARIABLES_WITH_RCP } from 'config/droughtOptions/metadata';
import { ColorSpec, FieldSpec, ViewLayer } from 'lib/data-map/view-layers';
import { selector } from 'recoil';
import {
  droughtOptionsVariableState,
  droughtRcpParamState,
  droughtShowOptionsState,
} from 'state/drought/drought-parameters';
import { sectionVisibilityState } from 'state/sections';

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
