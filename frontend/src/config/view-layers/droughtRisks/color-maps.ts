import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Scale from 'd3-scale';
import { ColorSpec } from 'lib/data-map/view-layers';

function invertColorScale<T>(colorScale: (t: number) => T) {
  return (i: number) => colorScale(1 - i);
}

export const mean_monthly_water_stress_: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: d3ScaleChromatic.interpolateReds,
  range: [0, 15],
  empty: '#ccc',
};

export const epd: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: d3ScaleChromatic.interpolateReds,
  range: [0, 2_500_000],
  empty: '#ccc',
};

export const eael: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: invertColorScale(d3ScaleChromatic.interpolateInferno),
  range: [0, 1e9],
  empty: '#ccc',
};
