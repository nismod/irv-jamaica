import { Typography } from '@mui/material';
import { DataItem } from 'details/features/detail-components';
import { VectorHoverDescription } from 'lib/data-map/types';
import { FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  droughtRegionsColorSpecState,
  droughtRegionsFieldSpecState,
} from 'state/layers/modules/droughtRegions';
import { DataDescription } from 'map/tooltip/DataDescription';

export const DroughtRegionsHoverDescription: FC<VectorHoverDescription> = ({
  target,
  viewLayer,
}) => {
  const fieldSpec = useRecoilValue(droughtRegionsFieldSpecState);
  const colorSpec = useRecoilValue(droughtRegionsColorSpecState);

  const colorMap = useMemo(
    () => ({
      fieldSpec,
      colorSpec,
    }),
    [fieldSpec, colorSpec],
  );

  return (
    <>
      <Typography variant="body2">Drought Risk</Typography>

      <DataItem label="Region" value={target.feature.properties.HYDROLOGIC} />
      <DataDescription viewLayer={viewLayer} feature={target.feature} colorMap={colorMap} />
    </>
  );
};
