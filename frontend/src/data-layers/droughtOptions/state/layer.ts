import { atom } from 'jotai';

import { droughtRcpParamState } from 'data-layers/droughtRisks/state/data-selection';
import { ColorSpec, FieldSpec, ViewLayer } from 'lib/data-map/view-layers';
import { sectionVisibilityState } from 'lib/state/sections';

import * as droughtOptionsColorSpecLookup from '../color-maps';
import { droughtOptionsViewLayer } from '../drought-options-view-layer';
import { DROUGHT_OPTIONS_VARIABLES_WITH_RCP } from '../metadata';
import { droughtOptionsVariableState, droughtShowOptionsState } from './data-selection';

export const droughtOptionsFieldSpecState = atom<FieldSpec>((get) => {
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
});

export const droughtOptionsColorSpecState = atom<ColorSpec>((get) => {
  const field = get(droughtOptionsVariableState);
  return droughtOptionsColorSpecLookup[field];
});

export const droughtOptionsLayerState = atom<ViewLayer>((get) => {
  const showDroughts = get(sectionVisibilityState('drought')) && get(droughtShowOptionsState);

  if (!showDroughts) {
    return null;
  }

  const fieldSpec = get(droughtOptionsFieldSpecState);
  const colorSpec = get(droughtOptionsColorSpecState);

  return droughtOptionsViewLayer({ fieldSpec, colorSpec });
});
