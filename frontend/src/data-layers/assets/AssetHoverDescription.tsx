import { FC } from 'react';

import { VectorHoverDescription } from 'lib/data-map/types';
import { VectorHoverDescription as VectorTooltip } from 'lib/map/tooltip/content/VectorHoverDescription';
import { NETWORKS_METADATA } from 'data-layers/networks/metadata';

export const AssetHoverDescription: FC<VectorHoverDescription> = ({ target, viewLayer }) => {
  const { label: title, color = '#ccc' } = NETWORKS_METADATA[viewLayer.params.assetId];
  return (
    <VectorTooltip viewLayer={viewLayer} feature={target.feature} title={title} color={color} />
  );
};
