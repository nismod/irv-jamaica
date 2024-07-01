import { FC } from 'react';

import { RasterTarget } from 'lib/data-map/types';
import { RasterHoverDescription } from 'map/tooltip/content/RasterHoverDescription';

import { HAZARDS_METADATA, HAZARD_COLOR_MAPS } from './metadata';
import { ViewLayer } from 'lib/data-map/view-layers';

export const HazardHoverDescription: FC<{ target: RasterTarget; viewLayer: ViewLayer }> = ({
  target,
  viewLayer,
}) => {
  const { label, dataUnit } = HAZARDS_METADATA[viewLayer.id];
  const { scheme, range } = HAZARD_COLOR_MAPS[viewLayer.id];
  return (
    <RasterHoverDescription
      color={target.color}
      label={label}
      dataUnit={dataUnit}
      scheme={scheme}
      range={range}
    />
  );
};
