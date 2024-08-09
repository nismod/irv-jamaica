import { Typography } from '@mui/material';
import { DataItem } from 'details/features/detail-components';
import { VectorHoverDescription } from 'lib/data-map/types';
import { FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  droughtOptionsColorSpecState,
  droughtOptionsFieldSpecState,
} from 'state/layers/data-layers/droughtOptions';
import { DataDescription } from 'map/tooltip/DataDescription';

export const DroughtOptionsHoverDescription: FC<VectorHoverDescription> = ({
  target,
  viewLayer,
}) => {
  const fieldSpec = useRecoilValue(droughtOptionsFieldSpecState);
  const colorSpec = useRecoilValue(droughtOptionsColorSpecState);

  const colorMap = useMemo(
    () => ({
      fieldSpec,
      colorSpec,
    }),
    [fieldSpec, colorSpec],
  );

  return (
    <>
      <Typography variant="body2">Drought Adaptation Option</Typography>

      <DataItem label="Name" value={target.feature.properties.project_name} />
      <DataItem label="Type" value={target.feature.properties.project_type} />
      <DataDescription viewLayer={viewLayer} feature={target.feature} colorMap={colorMap} />
    </>
  );
};
