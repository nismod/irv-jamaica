import { List, ListItem, Typography } from '@mui/material';
import { terrestrialSlope, terrestrialElevation } from 'data-layers/terrestrial/color-maps';
import { MARINE_HABITATS_LOOKUP } from 'data-layers/marine/domains';
import { DataItem } from 'lib/map/tooltip/detail-components';
import { colorMap } from 'lib/color-map';
import startCase from 'lodash/startCase';
import { ColorBox } from 'lib/map/tooltip/content/ColorBox';
import { FC } from 'react';
import { habitatColorMap } from 'data-layers/marine/state/layer';
import { landuseColorMap } from 'data-layers/terrestrial/state/layer';

const slopeColorFunction = colorMap(terrestrialSlope);
const elevationColorFunction = colorMap(terrestrialElevation);

interface SolutionsSidebarContentProps {
  feature: any;
  solutionType: string; // 'terrestrial' | 'marine'
  showRiskSection?: boolean;
}

export const SolutionsSidebarContent: FC<SolutionsSidebarContentProps> = ({
  feature,
  solutionType,
}) => {
  return (
    <>
      <Typography variant="body2">{startCase(solutionType)}</Typography>

      {solutionType === 'terrestrial' && (
        <List>
          <DataItem
            label="Cell ID"
            value={feature.properties.cell_index}
            maximumSignificantDigits={21}
          />
          <DataItem
            label="Land Use"
            value={
              <>
                <ColorBox color={landuseColorMap(feature.properties.landuse_desc)} />
                {feature.properties.landuse_desc}
              </>
            }
          />
          <DataItem
            label="Slope (deg)"
            value={
              <>
                <ColorBox color={slopeColorFunction(feature.properties.slope_degrees)} />
                {feature.properties.slope_degrees.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </>
            }
          />
          <DataItem
            label="Elevation (m)"
            value={
              <>
                <ColorBox color={elevationColorFunction(feature.properties.elevation_m)} />
                {feature.properties.elevation_m}
              </>
            }
          />
        </List>
      )}
      {solutionType === 'marine' && (
        <List>
          <DataItem
            label="Habitat"
            value={
              <>
                <ColorBox color={habitatColorMap(feature.properties.habitat)} />
                {feature.properties.habitat
                  ? MARINE_HABITATS_LOOKUP[feature.properties.habitat]
                  : 'Buffer Zone'}
              </>
            }
          />
          {feature.properties.is_coral ? (
            <DataItem label="Coral Type" value={feature.properties.coral_type} />
          ) : null}
          {feature.properties.is_mangrove ? (
            <DataItem label="Mangrove Type" value={feature.properties.mangrove_type} />
          ) : null}
          <DataItem
            label="Proximity"
            value={
              <List disablePadding dense>
                {[
                  feature.properties.within_coral_500m ? (
                    <ListItem disablePadding>within 500m of coral</ListItem>
                  ) : null,
                  feature.properties.within_mangrove_500m ? (
                    <ListItem disablePadding>within 500m of mangrove</ListItem>
                  ) : null,
                  feature.properties.within_seagrass_500m ? (
                    <ListItem disablePadding>within 500m of seagrass</ListItem>
                  ) : null,
                ]}
              </List>
            }
          />
        </List>
      )}
    </>
  );
};
