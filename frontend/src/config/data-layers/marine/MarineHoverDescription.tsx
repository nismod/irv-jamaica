import { Typography } from '@mui/material';
import { MARINE_HABITATS_LOOKUP } from './domains';
import { DataItem } from 'details/features/detail-components';
import { VectorHoverDescription } from 'lib/data-map/types';
import startCase from 'lodash/startCase';
import { FC } from 'react';
import { habitatColorMap } from 'state/layers/data-layers/marine';
import { ColorBox } from 'map/tooltip/content/ColorBox';

export const SolutionHoverDescription: FC<VectorHoverDescription> = ({ target, viewLayer }) => {
  return (
    <>
      <Typography variant="body2">{startCase(viewLayer.id)}</Typography>
      <>
        {/* not using DataDescription for Habitat because currently it only works for colorSpec-based color maps (not categorical) */}
        <DataItem
          label="Habitat"
          value={
            <>
              <ColorBox color={habitatColorMap(target.feature.properties.habitat)} />
              {target.feature.properties.habitat
                ? MARINE_HABITATS_LOOKUP[target.feature.properties.habitat]
                : 'Buffer Zone'}
            </>
          }
        />
      </>
    </>
  );
};
