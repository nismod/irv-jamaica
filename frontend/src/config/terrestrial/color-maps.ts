import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Scale from 'd3-scale';
import { ColorSpec } from 'lib/data-map/view-layers';

function invertColorScale<T>(colorScale: (t: number) => T) {
  return (i: number) => colorScale(1 - i);
}

export const terrestrialElevation: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: invertColorScale(d3ScaleChromatic.interpolateGreys),
  range: [0, 2250],
  empty: '#ccc',
};

export const terrestrialSlope: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: d3ScaleChromatic.interpolateReds,
  range: [0, 90],
  empty: '#ccc',
};
