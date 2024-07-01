import { FC } from 'react';

import { REGIONS_METADATA } from './metadata';
import { InteractionTarget, VectorTarget } from 'lib/data-map/types';
import { useRecoilValue } from 'recoil';
import { showPopulationState } from 'state/regions';
import { DataItem } from 'details/features/detail-components';

export const RegionHoverDescription: FC<{
  hoveredObject: InteractionTarget<VectorTarget>;
}> = ({ hoveredObject }) => {
  const metadata = REGIONS_METADATA[hoveredObject.viewLayer.params.regionLevel];

  const showPopulation = useRecoilValue(showPopulationState);

  return (
    <>
      <DataItem
        label={metadata.labelSingular}
        value={hoveredObject.target.feature.properties[metadata.fieldName]}
      />
      {showPopulation && (
        <DataItem
          label="Population"
          value={hoveredObject.target.feature.properties.population.toLocaleString()}
        />
      )}
    </>
  );
};
