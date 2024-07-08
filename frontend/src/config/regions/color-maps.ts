import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Scale from 'd3-scale';
import { ColorSpec } from 'lib/data-map/view-layers';

function invertColorScale<T>(colorScale: (t: number) => T) {
  return (i: number) => colorScale(1 - i);
}

export const population: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: invertColorScale(d3ScaleChromatic.interpolateInferno),
  range: [0, 1e4],
  empty: '#ccc',
};
