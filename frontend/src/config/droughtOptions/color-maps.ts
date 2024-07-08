import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Scale from 'd3-scale';
import { ColorSpec } from 'lib/data-map/view-layers';

function invertColorScale<T>(colorScale: (t: number) => T) {
  return (i: number) => colorScale(1 - i);
}

function discardSides<T>(interpolator: (t: number) => T, cutStart: number, cutEnd: number = 0) {
  return (i: number) => {
    const t = i * (1 - cutStart - cutEnd) + cutStart;
    return interpolator(t);
  };
}

export const cost_jmd: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: discardSides(d3ScaleChromatic.interpolateGreens, 0.2, 0.2),
  range: [0, 1_000_000_000],
  empty: '#ccc',
};

export const population_protected: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: discardSides(d3ScaleChromatic.interpolateBlues, 0.2, 0.2),
  range: [0, 100_000],
  empty: '#ccc',
};

export const net_present_value_benefit: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: discardSides(d3ScaleChromatic.interpolateBlues, 0.2, 0.2),
  range: [0, 1_000_000_000],
  empty: '#ccc',
};

export const benefit_cost_ratio: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: invertColorScale(d3ScaleChromatic.interpolateViridis),
  range: [1, 1.5],
  empty: '#ccc',
};
