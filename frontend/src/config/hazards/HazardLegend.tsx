import { FC } from 'react';

import { RasterLegend } from 'map/legend/RasterLegend';
import { ViewLayer } from 'lib/data-map/view-layers';

import { HAZARD_COLOR_MAPS, HAZARDS_METADATA } from 'config/hazards/metadata';

export const HazardLegend: FC<{ viewLayer: ViewLayer }> = ({ viewLayer }) => {
  const { id } = viewLayer;
  const { label, dataUnit } = HAZARDS_METADATA[id];
  const { scheme, range } = HAZARD_COLOR_MAPS[id];
  return <RasterLegend label={label} dataUnit={dataUnit} scheme={scheme} range={range} />;
};
