import { DataItem } from './detail-components';
import { colorMap } from 'lib/color-map';
import { ColorMap, ViewLayer } from 'lib/data-map/view-layers';
import { FC, useMemo } from 'react';
import { ColorBox } from './content/ColorBox';
import { GeoJSONFeature } from 'maplibre-gl';

export const DataDescription: FC<{
  viewLayer: ViewLayer;
  feature: GeoJSONFeature;
  colorMap: ColorMap;
}> = ({ viewLayer, feature, colorMap: { fieldSpec: colorField, colorSpec } }) => {
  const accessor = useMemo(() => viewLayer.dataAccessFn?.(colorField), [viewLayer, colorField]);

  const value = accessor?.(feature);

  const colorFn = useMemo(() => colorMap(colorSpec), [colorSpec]);

  const color = colorFn(value);

  const { getDataLabel, getValueFormatted } = viewLayer.dataFormatsFn(colorField);

  const dataLabel = getDataLabel(colorField);
  const formattedValue = getValueFormatted(value, colorField);

  return (
    <DataItem
      label={dataLabel}
      value={
        <>
          <ColorBox color={color} />
          {formattedValue ?? '-'}
        </>
      }
    />
  );
};
