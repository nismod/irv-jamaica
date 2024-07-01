import { Typography } from '@mui/material';
import { VECTOR_COLOR_MAPS } from 'config/color-maps';
import { MARINE_HABITATS_LOOKUP } from 'config/solutions/domains';
import { DataItem } from 'details/features/detail-components';
import { VectorHoverDescription } from 'lib/data-map/types';
import startCase from 'lodash/startCase';
import { FC } from 'react';
import { habitatColorMap } from 'state/layers/modules/marine';
import { landuseColorMap } from 'state/layers/modules/terrestrial';
import { DataDescription } from 'map/tooltip/DataDescription';
import { ColorBox } from 'map/tooltip/content/ColorBox';

const slopeFieldSpec = {
  fieldGroup: 'properties',
  field: 'slope_degrees',
};

const elevationFieldSpec = {
  fieldGroup: 'properties',
  field: 'elevation_m',
};

export const SolutionHoverDescription: FC<VectorHoverDescription> = ({ target, viewLayer }) => {
  return (
    <>
      <Typography variant="body2">{startCase(viewLayer.id)}</Typography>

      {viewLayer.id === 'terrestrial' && (
        <>
          <DataItem
            label="Cell ID"
            value={target.feature.properties.cell_id}
            maximumSignificantDigits={21}
          />
          {/* not using DataDescription for Land Use because currently it only works for colorSpec-based color maps (not categorical) */}
          <DataItem
            label="Land Use"
            value={
              <>
                <ColorBox color={landuseColorMap(target.feature.properties.landuse_desc)} />
                {target.feature.properties.landuse_desc}
              </>
            }
          />
          <DataDescription
            colorMap={{
              fieldSpec: slopeFieldSpec,
              colorSpec: VECTOR_COLOR_MAPS.terrestrialSlope,
            }}
            feature={target.feature}
            viewLayer={viewLayer}
          />
          <DataDescription
            colorMap={{
              fieldSpec: elevationFieldSpec,
              colorSpec: VECTOR_COLOR_MAPS.terrestrialElevation,
            }}
            feature={target.feature}
            viewLayer={viewLayer}
          />
        </>
      )}
      {viewLayer.id === 'marine' && (
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
      )}
    </>
  );
};
