import { FC } from 'react';

import { VectorHoverDescription } from 'lib/data-map/types';
import { VectorHoverDescription as VectorTooltip } from 'map/tooltip/content/VectorHoverDescription';

export const AssetHoverDescription: FC<VectorHoverDescription> = ({ target, viewLayer }) => {
  return <VectorTooltip viewLayer={viewLayer} feature={target.feature} />;
};
