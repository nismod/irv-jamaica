import { Typography } from '@mui/material';
import { NETWORKS_METADATA } from 'data-layers/networks/metadata';
import { DataItem } from 'details/features/detail-components';
import { VectorTarget } from 'lib/data-map/types';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { singleViewLayerParamsState } from 'lib/state/layers/view-layers';
import { DataDescription } from '../DataDescription';
import { ColorBox } from './ColorBox';
import { ViewLayer } from 'lib/data-map/view-layers';

export const VectorHoverDescription: FC<{
  viewLayer: ViewLayer;
  feature: VectorTarget['feature'];
}> = ({ viewLayer, feature }) => {
  const layerParams = useRecoilValue(singleViewLayerParamsState(viewLayer.id));
  const { styleParams } = layerParams;
  const { colorMap } = styleParams ?? {};

  const isDataMapped = colorMap != null;

  const { label: title, color = '#ccc' } = NETWORKS_METADATA[viewLayer.params.assetId];

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
