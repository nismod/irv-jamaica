import { FC } from 'react';

import { numFormatMoney } from 'lib/helpers';
import { GradientLegend } from './GradientLegend';
import { useRasterColorMapValues } from './use-color-map-values';
export interface ColorValue {
  color: string;
  value: number;
}
export interface RasterColorMapValues {
  colorMapValues: ColorValue[];
  rangeTruncated: [boolean, boolean];
}

const formatter = {
  hazard: (value, dataUnit) => `${value.toLocaleString()} ${dataUnit}`,
  financial: (value, dataUnit) => {
    const [currency, period] = dataUnit.split('/');
    if (period) {
      return `${numFormatMoney(value, currency)}/${period}`;
    }
    return numFormatMoney(value, dataUnit);
  },
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
};

export const RasterLegend: FC<{
  label: string;
  dataUnit: string;
  scheme: string;
  range: [number, number];
  type?: string;
}> = ({ label, dataUnit, scheme, range, type = 'hazard' }) => {
  const { error, loading, colorMapValues } = useRasterColorMapValues(scheme, range);

  const getValueLabel = (value: number) => formatter[type](value, dataUnit);

  return (
    <GradientLegend
      label={label}
      range={range}
      colorMapValues={!(error || loading) ? colorMapValues : null}
      getValueLabel={getValueLabel}
    />
  );
};
