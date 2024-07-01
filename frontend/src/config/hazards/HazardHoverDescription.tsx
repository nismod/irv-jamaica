import { FC } from 'react';

import { InteractionTarget, RasterTarget } from 'lib/data-map/types';
import { RasterHoverDescription } from 'map/tooltip/content/RasterHoverDescription';

import { HAZARDS_METADATA, HAZARD_COLOR_MAPS } from './metadata';

export const HazardHoverDescription: FC<{ hoveredObject: InteractionTarget<RasterTarget> }> = ({
  hoveredObject,
}) => {
  const { target, viewLayer } = hoveredObject;

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
