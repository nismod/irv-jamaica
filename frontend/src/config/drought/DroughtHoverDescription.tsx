import { Typography } from '@mui/material';
import { DataItem } from 'details/features/detail-components';
import { VectorTarget } from 'lib/data-map/types';
import { FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  droughtOptionsColorSpecState,
  droughtOptionsFieldSpecState,
  droughtRegionsColorSpecState,
  droughtRegionsFieldSpecState,
} from 'state/layers/modules/drought';
import { DataDescription } from 'map/tooltip/DataDescription';
import { ViewLayer } from 'lib/data-map/view-layers';

const DroughtRiskDescription: FC<{
  target: VectorTarget;
  viewLayer: ViewLayer;
}> = ({ target, viewLayer }) => {
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

const DroughtOptionDescription: FC<{
  target: VectorTarget;
  viewLayer: ViewLayer;
}> = ({ target, viewLayer }) => {
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

export const DroughtHoverDescription: FC<{
  target: VectorTarget;
  viewLayer: ViewLayer;
}> = ({ target, viewLayer }) => {
  if (viewLayer.id === 'drought_risk') {
    return <DroughtRiskDescription target={target} viewLayer={viewLayer} />;
  } else if (viewLayer.id === 'drought_options') {
    return <DroughtOptionDescription target={target} viewLayer={viewLayer} />;
  }
};
