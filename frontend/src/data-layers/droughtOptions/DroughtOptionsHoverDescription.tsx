import { Typography } from '@mui/material';
import { DataItem } from 'lib/map/tooltip/detail-components';
import { VectorHoverDescription } from 'lib/data-map/types';
import { FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  droughtOptionsColorSpecState,
  droughtOptionsFieldSpecState,
} from 'data-layers/droughtOptions/state/layer';
import { DataDescription } from 'lib/map/tooltip/DataDescription';

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
