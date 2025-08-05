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

export const avoided_ead_mean: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: discardSides(d3ScaleChromatic.interpolateBlues, 0.2, 0.2),
  range: [0, 1e7],
  empty: '#ccc',
};

export const avoided_eael_mean: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: invertColorScale(d3ScaleChromatic.interpolateInferno),
  range: [0, 1e7],
  empty: '#ccc',
};

export const adaptation_cost: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: discardSides(d3ScaleChromatic.interpolateGreens, 0.2, 0.2),
  range: [0, 1e9],
  empty: '#ccc',
};

export const cost_benefit_ratio: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: invertColorScale(d3ScaleChromatic.interpolateViridis),
  range: [1, 10],
  empty: '#ccc',
};

export const damages: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: invertColorScale(d3ScaleChromatic.interpolateInferno),
  range: [0, 1e6],
  empty: '#ccc',
};

export const damagesCoastalDefence: ColorSpec = {
  scale: d3Scale.scaleSequential,
  scheme: d3ScaleChromatic.interpolateBuPu,
  range: [0, 1e8],
  empty: '#ccc',
};