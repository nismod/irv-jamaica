import { FC } from 'react';

import { RasterHoverDescription } from 'lib/data-map/types';
import { RasterHoverDescription as RasterTooltip } from 'map/tooltip/content/RasterHoverDescription';

import * as HAZARD_COLOR_MAPS from './color-maps';
import { HAZARDS_METADATA } from './metadata';

export const HazardHoverDescription: FC<RasterHoverDescription> = ({ target, viewLayer }) => {
  const { label, dataUnit } = HAZARDS_METADATA[viewLayer.id];
  const { scheme, range } = HAZARD_COLOR_MAPS[viewLayer.id];
  return (
    <RasterTooltip
      color={target.color}
      label={label}
      dataUnit={dataUnit}
      scheme={scheme}
      range={range}
    />
  );
};
