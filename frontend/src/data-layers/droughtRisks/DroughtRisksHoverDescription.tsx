import { Typography } from '@mui/material';
import { DataItem } from 'details/features/detail-components';
import { VectorHoverDescription } from 'lib/data-map/types';
import { FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { DataDescription } from 'app/map/tooltip/DataDescription';

import { droughtRisksColorSpecState, droughtRisksFieldSpecState } from './state/layer';

export const DroughtRisksHoverDescription: FC<VectorHoverDescription> = ({ target, viewLayer }) => {
  const fieldSpec = useRecoilValue(droughtRisksFieldSpecState);
  const colorSpec = useRecoilValue(droughtRisksColorSpecState);

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
