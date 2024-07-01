import { FC } from 'react';

import { VectorTarget } from 'lib/data-map/types';
import { VectorHoverDescription } from 'map/tooltip/content/VectorHoverDescription';
import { ViewLayer } from 'lib/data-map/view-layers';

export const AssetHoverDescription: FC<{ target: VectorTarget; viewLayer: ViewLayer }> = ({
  target,
  viewLayer,
}) => {
  return <VectorHoverDescription viewLayer={viewLayer} feature={target.feature} />;
};
