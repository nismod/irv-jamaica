import { Typography } from '@mui/material';
import { DataItem } from 'lib/map/tooltip/detail-components';
import { VectorHoverDescription } from 'lib/data-map/types';
import startCase from 'lodash/startCase';
import { FC } from 'react';
import { DataDescription } from 'lib/map/tooltip/DataDescription';
import { ColorBox } from 'lib/map/tooltip/content/ColorBox';

import { terrestrialSlope, terrestrialElevation } from './color-maps';
import { landuseColorMap } from './state/layer';

const slopeFieldSpec = {
  fieldGroup: 'properties',
  field: 'slope_degrees',
};

const elevationFieldSpec = {
  fieldGroup: 'properties',
  field: 'elevation_m',
};

export const TerrestrialHoverDescription: FC<VectorHoverDescription> = ({ target, viewLayer }) => {
  return (
    <>
      <Typography variant="body2">{startCase(viewLayer.id)}</Typography>
      <>
        <DataItem
          label="Cell ID"
          value={target.feature.properties.cell_index}
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
            colorSpec: terrestrialSlope,
          }}
          feature={target.feature}
          viewLayer={viewLayer}
        />
        <DataDescription
          colorMap={{
            fieldSpec: elevationFieldSpec,
            colorSpec: terrestrialElevation,
          }}
          feature={target.feature}
          viewLayer={viewLayer}
        />
      </>
    </>
  );
};
