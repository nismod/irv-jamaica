import * as d3Array from 'd3-array';
import { ColorSpec } from './data-map/view-layers';
import { ScaleSequential } from 'd3-scale';

export function colorScaleFn({ scale, range, scheme }: ColorSpec): ScaleSequential<string, string> {
  return scale(range, scheme);
}

export function colorScaleValues(colorSpec: ColorSpec, n: number) {
  const scaleFn = colorScaleFn(colorSpec);
  const [rangeMin, rangeMax] = colorSpec.range;
  return d3Array
    .ticks(rangeMin, rangeMax, n)
    .map((x): { value: number; color: string } => ({ value: x, color: scaleFn(x) }));
}

export function colorMap(colorSpec: ColorSpec) {
  const scaleFn = colorScaleFn(colorSpec);

  return (value: unknown): string => (value == null ? colorSpec.empty : scaleFn(Number(value)));
}
