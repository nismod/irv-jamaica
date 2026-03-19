import { List, Typography } from '@mui/material';
import { REGIONS_METADATA } from 'data-layers/regions/metadata';
import { DataItem } from 'lib/map/tooltip/detail-components';
import { InteractionTarget, VectorTarget } from 'lib/data-map/types';
import { numFormat } from 'lib/helpers';
import { FC } from 'react';

export const RegionDetailsContent: FC<{ selectedRegion: InteractionTarget<VectorTarget> }> = ({
  selectedRegion,
}) => {
  const params = selectedRegion.viewLayer.params as { regionLevel: string };
  const metadata = REGIONS_METADATA[params.regionLevel];
  const f = selectedRegion.target.feature.properties as Record<string, number | string | undefined>;
  const area = Number(f['AREA'] ?? f['Shape_Area'] ?? 0) * 1e-6;

  return (
    <>
      {metadata.labelSingular}
      <Typography variant="h6">
        {selectedRegion.target.feature.properties[metadata.fieldName]}
      </Typography>
      <List>
        <DataItem label="Population" value={f['population'].toLocaleString()} />
        <DataItem label="Area (km²)" value={numFormat(area)} />
        <DataItem label="Population per km²" value={numFormat(f['population_density_per_km2'])} />
      </List>
    </>
  );
};
