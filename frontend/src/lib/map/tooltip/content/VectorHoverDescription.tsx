import { Typography } from '@mui/material';
import { FC } from 'react';

import { DataItem } from '../detail-components';
import { VectorTarget } from 'lib/data-map/types';
import { DataDescription } from '../DataDescription';
import { ColorBox } from './ColorBox';
import { ViewLayer, ViewLayerParams } from 'lib/data-map/view-layers';

type VectorHoverDescriptionProps = {
  viewLayer: ViewLayer;
  feature: VectorTarget['feature'];
  layerParams: ViewLayerParams;
  title: string;
  color: string;
};
export const VectorHoverDescription: FC<VectorHoverDescriptionProps> = ({
  layerParams,
  title,
  color = '#ccc',
  viewLayer,
  feature,
}) => {
  const { styleParams } = layerParams;
  const { colorMap } = styleParams ?? {};

  const isDataMapped = colorMap != null;

  return (
    <>
      <Typography variant="body2">
        <ColorBox color={color} empty={isDataMapped} />
        {title}
      </Typography>

      <DataItem label="ID" value={`${feature.properties.asset_id}`} />
      {colorMap && <DataDescription viewLayer={viewLayer} feature={feature} colorMap={colorMap} />}
    </>
  );
};
