import { colorCssToRgb } from 'lib/helpers';
import memoize from 'lodash/memoize';
import { Accessor, mergeTriggers, withTriggers } from './getters';

const memoizedColorCssToRgb = memoize(colorCssToRgb);

export function dataColorMap<T>(dataSource: Accessor<T>, colorSource: Accessor<string, T>) {
  return withTriggers(
    (x) => memoizedColorCssToRgb(colorSource(dataSource(x))),
    mergeTriggers(dataSource, colorSource),
  );
}
