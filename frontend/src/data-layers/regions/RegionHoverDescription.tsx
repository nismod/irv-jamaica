import { FC } from 'react';

import { REGIONS_METADATA } from './metadata';
import { VectorHoverDescription } from 'lib/data-map/types';
import { useRecoilValue } from 'recoil';
import { showPopulationState } from 'state/data-selection/regions';
import { DataItem } from 'details/features/detail-components';

export const RegionHoverDescription: FC<VectorHoverDescription> = ({ target, viewLayer }) => {
  const metadata = REGIONS_METADATA[viewLayer.params.regionLevel];

  const showPopulation = useRecoilValue(showPopulationState);

  return (
    <>
      <DataItem
        label={metadata.labelSingular}
        value={target.feature.properties[metadata.fieldName]}
      />
      {showPopulation && (
        <DataItem
          label="Population"
          value={target.feature.properties.population.toLocaleString()}
        />
      )}
    </>
  );
};
