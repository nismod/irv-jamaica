import { FC } from 'react';

import { VectorHoverDescription } from 'lib/data-map/types';
import { VectorHoverDescription as VectorTooltip } from 'lib/map/tooltip/content/VectorHoverDescription';
import { NETWORKS_METADATA } from 'data-layers/networks/metadata';

export const AssetHoverDescription: FC<VectorHoverDescription> = ({ target, viewLayer }) => {
  const { assetId } = (viewLayer.params ?? {}) as { assetId: string };
  const { label: title, color = '#ccc' } = NETWORKS_METADATA[assetId];
  return (
    <VectorTooltip viewLayer={viewLayer} feature={target.feature} title={title} color={color} />
  );
};
