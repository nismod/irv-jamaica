import { colorScaleValues } from 'lib/color-map';
import { ColorMap, FormatConfig } from 'lib/data-map/view-layers';
import { FC } from 'react';
import { GradientLegend } from './GradientLegend';

export const VectorLegend: FC<{ colorMap: ColorMap; legendFormatConfig: FormatConfig }> = ({
  colorMap,
  legendFormatConfig,
}) => {
  const { colorSpec, fieldSpec } = colorMap;
  const colorMapValues = colorScaleValues(colorSpec, 255);

  const { getDataLabel, getValueFormatted } = legendFormatConfig;

  const label = getDataLabel(fieldSpec);
  const getValueLabel = (value) => getValueFormatted(value, fieldSpec);

  return (
    <GradientLegend
      label={label}
      range={colorSpec.range}
      colorMapValues={colorMapValues}
      getValueLabel={getValueLabel}
    />
  );
};
