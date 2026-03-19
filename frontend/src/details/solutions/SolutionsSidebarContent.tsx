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
  feature: { properties: Record<string, unknown> };
  solutionType: string; // 'terrestrial' | 'marine'
  showRiskSection?: boolean;
}

interface SolutionProperties {
  cell_index?: string | number;
  landuse_desc?: string;
  slope_degrees?: number;
  elevation_m?: number;
  habitat?: string;
  is_coral?: boolean;
  coral_type?: string;
  is_mangrove?: boolean;
  mangrove_type?: string;
  within_coral_500m?: boolean;
  within_mangrove_500m?: boolean;
  within_seagrass_500m?: boolean;
}

export const SolutionsSidebarContent: FC<SolutionsSidebarContentProps> = ({
  feature,
  solutionType,
}) => {
  const p = feature.properties as SolutionProperties;
  const landuseColor =
    p.landuse_desc != null && p.landuse_desc !== ''
      ? (() => {
          try {
            return landuseColorMap(p.landuse_desc as string);
          } catch {
            return undefined;
          }
        })()
      : undefined;

  return (
    <>
      <Typography variant="body2">{startCase(solutionType)}</Typography>

      {solutionType === 'terrestrial' && (
        <List>
          <DataItem label="Cell ID" value={p.cell_index} maximumSignificantDigits={21} />
          <DataItem
            label="Land Use"
            value={
              <>
                {landuseColor && <ColorBox color={landuseColor} />}
                {p.landuse_desc}
              </>
            }
          />
          <DataItem
            label="Slope (deg)"
            value={
              <>
                <ColorBox color={slopeColorFunction(p.slope_degrees ?? 0)} />
                {p.slope_degrees?.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </>
            }
          />
          <DataItem
            label="Elevation (m)"
            value={
              <>
                <ColorBox color={elevationColorFunction(p.elevation_m ?? 0)} />
                {p.elevation_m}
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
                <ColorBox color={habitatColorMap(p.habitat ?? '')} />
                {p.habitat ? MARINE_HABITATS_LOOKUP[p.habitat] : 'Buffer Zone'}
              </>
            }
          />
          {p.is_coral ? <DataItem label="Coral Type" value={p.coral_type} /> : null}
          {p.is_mangrove ? <DataItem label="Mangrove Type" value={p.mangrove_type} /> : null}
          <DataItem
            label="Proximity"
            value={
              <List disablePadding dense>
                {[
                  p.within_coral_500m ? (
                    <ListItem disablePadding>within 500m of coral</ListItem>
                  ) : null,
                  p.within_mangrove_500m ? (
                    <ListItem disablePadding>within 500m of mangrove</ListItem>
                  ) : null,
                  p.within_seagrass_500m ? (
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
