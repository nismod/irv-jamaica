import { FC } from 'react';

import { InteractionTarget, VectorTarget } from 'lib/data-map/types';
import { VectorHoverDescription } from 'map/tooltip/content/VectorHoverDescription';

export const AssetHoverDescription: FC<{ hoveredObject: InteractionTarget<VectorTarget> }> = ({
  hoveredObject,
}) => {
  const {
    viewLayer,
    target: { feature },
  } = hoveredObject;

  return <VectorHoverDescription viewLayer={viewLayer} feature={feature} />;
};
