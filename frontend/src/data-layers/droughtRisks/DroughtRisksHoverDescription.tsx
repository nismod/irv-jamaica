import { Typography } from '@mui/material';
import { DataItem } from 'lib/map/tooltip/detail-components';
import { VectorHoverDescription } from 'lib/data-map/types';
import { FC, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { DataDescription } from 'lib/map/tooltip/DataDescription';

import { droughtRisksColorSpecState, droughtRisksFieldSpecState } from './state/layer';

export const DroughtRisksHoverDescription: FC<VectorHoverDescription> = ({ target, viewLayer }) => {
  const fieldSpec = useAtomValue(droughtRisksFieldSpecState);
  const colorSpec = useAtomValue(droughtRisksColorSpecState);

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
