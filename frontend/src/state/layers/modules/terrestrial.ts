import { TERRESTRIAL_LANDUSE_COLORS } from 'config/solutions/colors';
import { terrestrialViewLayer } from 'config/solutions/terrestrial-view-layer';
import { ViewLayer, FieldSpec, ColorSpec } from 'lib/data-map/view-layers';
import { selector } from 'recoil';
import { sectionStyleValueState, sectionVisibilityState } from 'state/sections';
import {
  terrestrialFiltersState,
  TerrestrialLocationFilters,
} from 'state/solutions/terrestrial-filters';
import { colorMap } from 'lib/color-map';
import { VECTOR_COLOR_MAPS } from 'config/color-maps';
import { featureProperty } from 'lib/deck/props/data-source';
import { Accessor } from 'lib/deck/props/getters';
import { LandUseOption, TerrestrialLocationFilterType } from 'config/solutions/domains';
import { truthyKeys } from 'lib/helpers';
import { landuseFilterState } from 'state/solutions/landuse-tree';

export function landuseColorMap(x: string) {
  return TERRESTRIAL_LANDUSE_COLORS[x].css;
}

export const terrestrialColorSpecState = selector<ColorSpec>({
  key: 'terrestrialColorSpecState',
  get: ({ get }) => {
    const style = get(sectionStyleValueState('terrestrial'));

    if (style === 'elevation') {
      return VECTOR_COLOR_MAPS.terrestrialElevation;
    } else if (style === 'slope') {
      return VECTOR_COLOR_MAPS.terrestrialSlope;
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
