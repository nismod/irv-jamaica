import _ from 'lodash';
import * as d3 from 'd3-scale-chromatic';
import { colorMap } from 'lib/color-map';
import { Accessor, withTriggers } from 'lib/deck/props/getters';

export const RASTER_COLOR_MAPS = {
  fluvial: {
    scheme: 'blues',
    range: [0, 10],
  },
  coastal: {
    scheme: 'greens',
    range: [0, 10],
  },
  surface: {
    scheme: 'purples',
    range: [0, 10],
  },
  cyclone: {
    scheme: 'reds',
    range: [0, 75],
  },
};

function invertColorScale<T>(colorScale: (t: number, n: number) => T) {
  return (i: number, n: number) => colorScale(1 - i, n);
}

export const VECTOR_COLOR_MAPS = {
  damages: {
    scale: invertColorScale(d3.interpolateInferno),
    range: [0, 1000000],
    empty: '#ccc',
  },
  population: {
    scale: d3.interpolateInferno,
    range: [0, 10000],
    empty: '#ccc',
  },
};

export const colorMapFromScheme = _.memoize(function (
  colorScheme: string,
): Accessor<string, any> {
  const { scale, range, empty } = VECTOR_COLOR_MAPS[colorScheme];

  return withTriggers(colorMap(scale, range, empty), [colorScheme]);
});
