import { FC } from 'react';

import { RasterLegend } from 'map/legend/RasterLegend';
import { ViewLayer } from 'lib/data-map/view-layers';

import { RISKS_COLOR_MAPS, RISKS_METADATA } from './metadata';

export const RiskLegend: FC<{ viewLayer: ViewLayer }> = ({ viewLayer }) => {
  const { id } = viewLayer;
  const { label, dataUnit } = RISKS_METADATA[id];
  const { scheme, range } = RISKS_COLOR_MAPS[id];
  return <RasterLegend label={label} dataUnit={dataUnit} scheme={scheme} range={range} />;
};
