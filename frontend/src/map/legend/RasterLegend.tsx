import { RASTER_COLOR_MAPS } from 'config/color-maps';
import { labelsMetadata } from 'config/interaction-groups';
import { ViewLayer } from 'lib/data-map/view-layers';
import { FC, useCallback } from 'react';
import { GradientLegend } from './GradientLegend';
import { useRasterColorMapValues } from './use-color-map-values';
export interface ColorValue {
  color: string;
  value: any;
}
export interface RasterColorMapValues {
  colorMapValues: ColorValue[];
  rangeTruncated: [boolean, boolean];
}

export const RasterLegend: FC<{ viewLayer: ViewLayer }> = ({ viewLayer }) => {
  const { id } = viewLayer;
  const { label, dataUnit } = labelsMetadata[id];
  const { scheme, range } = RASTER_COLOR_MAPS[id];

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
