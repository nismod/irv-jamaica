import { selector } from 'recoil';

import { ViewLayer, FieldSpec, ColorSpec } from 'lib/data-map/view-layers';
import { sectionStyleValueState, sectionVisibilityState } from 'lib/state/sections';
import { colorMap } from 'lib/color-map';
import { featureProperty } from 'lib/deck/props/data-source';
import { Accessor } from 'lib/deck/props/getters';
import { truthyKeys } from 'lib/helpers';

import { LandUseOption, TerrestrialLocationFilterType } from '../domains';
import { TERRESTRIAL_LANDUSE_COLORS } from '../colors';
import { terrestrialElevation, terrestrialSlope } from '../color-maps';
import { terrestrialViewLayer } from '../terrestrial-view-layer';
import { landuseFilterState } from '../sidebar/landuse-tree';
import { terrestrialFiltersState, TerrestrialLocationFilters } from './terrestrial-filters';

export function landuseColorMap(x: string) {
  return TERRESTRIAL_LANDUSE_COLORS[x].css;
}

export const terrestrialColorSpecState = selector<ColorSpec>({
  key: 'terrestrialColorSpecState',
  get: ({ get }) => {
    const style = get(sectionStyleValueState('terrestrial'));

    if (style === 'elevation') {
      return terrestrialElevation;
    } else if (style === 'slope') {
      return terrestrialSlope;
    } else {
      // land use will not have a colorSpec, because it's categorical
      return null;
    }
  },
});

export const terrestrialColorFnState = selector<Accessor<string>>({
  key: 'terrestrialColorFnState',
  get: ({ get }) => {
    const style = get(sectionStyleValueState('terrestrial'));

    if (style === 'landuse') {
      return landuseColorMap;
    } else {
      const colorSpec = get(terrestrialColorSpecState);

      if (colorSpec) {
        return colorMap(colorSpec);
      }
    }
  },
});

export const terrestrialFieldSpecState = selector<FieldSpec>({
  key: 'terrestrialFieldSpecState',
  get: ({ get }) => {
    const style = get(sectionStyleValueState('terrestrial'));

    let field: string;

    if (style === 'landuse') {
      field = 'landuse_desc';
    } else if (style === 'elevation') {
      field = 'elevation_m';
    } else if (style === 'slope') {
      field = 'slope_degrees';
    }

    return {
      fieldGroup: 'properties',
      field,
    };
  },
});

const landuseFilterSetState = selector<Set<LandUseOption>>({
  key: 'landuseFilterSetState',
  get: ({ get }) => new Set(truthyKeys(get(landuseFilterState))),
});

const locationFilterState = selector<TerrestrialLocationFilters>({
  key: 'locationFilterState',
  get: ({ get }) => get(terrestrialFiltersState).location_filters,
});

const locationFilterKeysState = selector<TerrestrialLocationFilterType[]>({
  key: 'locationFilterKeysState',
  get: ({ get }) => truthyKeys(get(locationFilterState)),
});

export const terrestrialLayerState = selector<ViewLayer>({
  key: 'terrestrialLayerState',
  get: ({ get }) => {
    const showTerrestrial = get(sectionVisibilityState('terrestrial'));

    if (!showTerrestrial) {
      return null;
    }

    const filters = get(terrestrialFiltersState);
    const fieldSpec = get(terrestrialFieldSpecState);

    const dataFn = featureProperty(fieldSpec.field);
    const colorFn = get(terrestrialColorFnState);

    if (!colorFn || !dataFn) {
      return null;
    }

    const colorSpec = get(terrestrialColorSpecState);

    const landuseFilterSet = get(landuseFilterSetState);
    const locationFilterKeys = get(locationFilterKeysState);

    return terrestrialViewLayer({
      fieldSpec,
      colorSpec,
      dataFn,
      colorFn,
      filters,
      landuseFilterSet,
      locationFilterKeys,
    });
  },
});
