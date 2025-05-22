import { Box } from '@mui/material';
import { FC, useMemo } from 'react';

import { useRasterColorMapValues } from 'lib/map/legend/use-color-map-values';
import { numFormatMoney } from 'lib/helpers';

import { DataItem } from '../detail-components';
import { ColorBox } from './ColorBox';

function useRasterColorMapLookup(colorMapValues) {
  return useMemo(
    () =>
      colorMapValues &&
      Object.fromEntries(colorMapValues.map(({ value, color }) => [color, value])),
    [colorMapValues],
  );
}

const formatter = {
  hazard: (value, dataUnit) => value.toFixed(1) + dataUnit,
  financial: numFormatMoney,
  integer: (value) =>
    value.toLocaleString(undefined, {
      maximumSignificantDigits: 3,
      maximumFractionDigits: 0,
      roundingPriority: 'lessPrecision',
    }),
  population: (value) =>
    value.toLocaleString(undefined, {
      maximumSignificantDigits: 3,
    }),
  years: (value) => `${parseInt(value)} years`,
};

function formatValue(color, value, dataUnit, type, maxValue) {
  const formattedValue = value == null ? '' : formatter[type](value, dataUnit);
  return (
    <>
      <ColorBox color={color} />
      {value === maxValue ? '> ' : ''}
      {formattedValue}
    </>
  );
}

export const RasterHoverDescription: FC<{
  color: [number, number, number, number];
  label: string;
  dataUnit: string;
  scheme: string;
  range: [number, number];
  type?: string;
}> = ({ color, label, dataUnit, scheme, range, type = 'hazard' }) => {
  const title = `${label}`;

  const { colorMapValues } = useRasterColorMapValues(scheme, range);
  const rasterValueLookup = useRasterColorMapLookup(colorMapValues);

  const colorString = `rgb(${color[0]},${color[1]},${color[2]})`;
  const value = rasterValueLookup?.[colorString];
  const maxValue = range[1];

  return (
    <Box>
      <DataItem label={title} value={formatValue(colorString, value, dataUnit, type, maxValue)} />
    </Box>
  );
};
