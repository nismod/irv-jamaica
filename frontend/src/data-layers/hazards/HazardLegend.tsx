import { FC } from 'react';

import { RasterLegend } from 'lib/map/legend/RasterLegend';
import { ViewLayer } from 'lib/data-map/view-layers';

import * as HAZARD_COLOR_MAPS from './color-maps';
import { HAZARDS_METADATA } from './metadata';

export const HazardLegend: FC<{ viewLayer: ViewLayer }> = ({ viewLayer }) => {
  const { id } = viewLayer;
  const { label, dataUnit } = HAZARDS_METADATA[id];
  const { scheme, range } = HAZARD_COLOR_MAPS[id];
  return <RasterLegend label={label} dataUnit={dataUnit} scheme={scheme} range={range} />;
};
