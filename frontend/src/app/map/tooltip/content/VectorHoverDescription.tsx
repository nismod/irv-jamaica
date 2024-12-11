import { FC } from 'react';

import { NETWORKS_METADATA } from 'data-layers/networks/metadata';

import { VectorHoverDescription as BaseDescription } from 'lib/map/tooltip/content/VectorHoverDescription';

import { VectorTarget } from 'lib/data-map/types';
import { ViewLayer } from 'lib/data-map/view-layers';

export const VectorHoverDescription: FC<{
  viewLayer: ViewLayer;
  feature: VectorTarget['feature'];
}> = ({ viewLayer, feature }) => {
  const { label: title, color = '#ccc' } = NETWORKS_METADATA[viewLayer.params.assetId];

  return <BaseDescription title={title} color={color} viewLayer={viewLayer} feature={feature} />;
};
