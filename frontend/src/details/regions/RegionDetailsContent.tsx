import { Typography } from '@mui/material';
import { REGIONS_METADATA } from 'config/regions/metadata';
import { DataItem } from 'details/features/detail-components';
import { InteractionTarget } from 'state/interactions/use-interactions';
import { numFormat } from 'lib/helpers';
import { FC } from 'react';

export const RegionDetailsContent: FC<{ selectedRegion: InteractionTarget<any> }> = ({
  selectedRegion,
}) => {
  const metadata = REGIONS_METADATA[selectedRegion.viewLayer.params.regionLevel];
  const f = selectedRegion.target.feature.properties;
  const area = f['AREA'] ? f['AREA'] * 1e-6 : f['Shape_Area'] * 1e-6;

  return (
    <>
      {metadata.labelSingular}
      <Typography variant="h6">
        {selectedRegion.target.feature.properties[metadata.fieldName]}
      </Typography>
      <DataItem label="Population" value={f['population'].toLocaleString()} />
      <DataItem label="Area (km²)" value={numFormat(area)} />
      <DataItem label="Population per km²" value={numFormat(f['population_density_per_km2'])} />
    </>
  );
};
