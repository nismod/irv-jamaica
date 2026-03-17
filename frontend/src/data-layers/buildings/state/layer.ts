import { atom } from 'jotai';

import { ViewLayer } from 'lib/data-map/view-layers';
import { truthyKeys } from 'lib/helpers';
import { sectionVisibilityState } from 'lib/state/sections';

import { buildingsViewLayer } from 'data-layers/buildings/buildings-view-layer';

import { buildingSelectionState } from './data-selection';

export const buildingsLayerState = atom<ViewLayer[]>((get) =>
  get(sectionVisibilityState('buildings'))
    ? truthyKeys(get(buildingSelectionState)).map((buildingType) =>
        buildingsViewLayer(buildingType),
      )
    : [],
);
