import { FC } from 'react';
import { useAtomValue } from 'jotai';

import { VectorHoverDescription } from 'lib/data-map/types';
import { DataItem } from 'lib/map/tooltip/detail-components';

import { REGIONS_METADATA } from './metadata';
import { showPopulationState } from './state/data-selection';

export const RegionHoverDescription: FC<VectorHoverDescription> = ({ target, viewLayer }) => {
  const { regionLevel } = (viewLayer.params ?? {}) as { regionLevel: string };
  const metadata = REGIONS_METADATA[regionLevel];

  const showPopulation = useAtomValue(showPopulationState);

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
