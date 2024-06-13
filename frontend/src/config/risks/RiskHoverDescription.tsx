import { FC } from 'react';

import { RasterHoverDescription } from 'lib/data-map/types';
import { RasterHoverDescription as RasterTooltip } from 'map/tooltip/content/RasterHoverDescription';

import { RISKS_METADATA, RISKS_COLOR_MAPS } from './metadata';

export const RiskHoverDescription: FC<RasterHoverDescription> = ({ target, viewLayer }) => {
  const { label, dataUnit } = RISKS_METADATA[viewLayer.id];
  const { scheme, range } = RISKS_COLOR_MAPS[viewLayer.id];
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
