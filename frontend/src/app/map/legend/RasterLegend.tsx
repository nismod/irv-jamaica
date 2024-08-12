import { FC, useCallback } from 'react';
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

export const RasterLegend: FC<{
  label: string;
  dataUnit: string;
  scheme: string;
  range: [number, number];
}> = ({ label, dataUnit, scheme, range }) => {
  const { error, loading, colorMapValues } = useRasterColorMapValues(scheme, range);

  const getValueLabel = useCallback(
    (value: number) => `${value.toLocaleString()} ${dataUnit}`,
    [dataUnit],
  );

  return (
    <GradientLegend
      label={label}
      range={range}
      colorMapValues={!(error || loading) ? colorMapValues : null}
      getValueLabel={getValueLabel}
    />
  );
};
