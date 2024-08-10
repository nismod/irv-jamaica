import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { VectorHoverDescription } from 'lib/data-map/types';
import { DataItem } from 'details/features/detail-components';

import { REGIONS_METADATA } from './metadata';
import { showPopulationState } from './data-selection';

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
