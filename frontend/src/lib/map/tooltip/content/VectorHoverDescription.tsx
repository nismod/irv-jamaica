import { Typography } from '@mui/material';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { DataItem } from '../detail-components';
import { VectorTarget } from 'lib/data-map/types';
import { DataDescription } from '../DataDescription';
import { ColorBox } from './ColorBox';
import { ViewLayer } from 'lib/data-map/view-layers';
import { singleViewLayerParamsState } from 'lib/state/layers/view-layers';

type VectorHoverDescriptionProps = {
  viewLayer: ViewLayer;
  feature: VectorTarget['feature'];
  title: string;
  color: string;
};
export const VectorHoverDescription: FC<VectorHoverDescriptionProps> = ({
  title,
  color = '#ccc',
  viewLayer,
  feature,
}) => {
  const layerParams = useRecoilValue(singleViewLayerParamsState(viewLayer.id));
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
