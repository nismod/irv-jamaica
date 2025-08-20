import { ComponentType, FC } from 'react';

import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

import { titleCase, isNumeric, numFormat, paren, numRangeFormat } from 'lib/helpers';
import { useRecoilValue } from 'recoil';
import { protectedFeatureAdaptationOptionsState } from 'lib/state/protected-features';

interface DataItemProps {
  label: string;
  value: any;
  maximumSignificantDigits?: number;
}

export const DataItem: FC<DataItemProps> = ({ label, value, maximumSignificantDigits }) => {
  if (isNumeric(value)) {
    value = numFormat(value, maximumSignificantDigits);
  }
  return (
    <ListItem disableGutters disablePadding>
      <ListItemText
        primary={label}
        primaryTypographyProps={{ variant: 'caption' }}
        secondary={value === ' ' ? '-' : value || '-'}
      />
    </ListItem>
  );
};

interface DetailSubheaderProps {
  id: string;
}

const DetailSubheader: FC<DetailSubheaderProps> = ({ id }) => (
  <Typography variant="caption" component="p">
    ID: <span className="asset_id">{id}</span>
  </Typography>
);

interface DetailsComponentProps {
  f: any;
}

export type DetailsComponent = ComponentType<DetailsComponentProps>;

export const DefaultDetailsList: FC<DetailsComponentProps> = ({ f }) => {
  return (
    <List>
      {Object.entries(f).map(([key, value]) => (
        <DataItem key={key} label={titleCase(key.replace(/_/g, ' '))} value={value} />
      ))}
    </List>
  );
};

export const DefaultDetails: FC<DetailsComponentProps> = ({ f }) => {
  return (
    <>
      <Typography variant="h6" component="h1">
        Asset
      </Typography>
      <DefaultDetailsList f={f} />
    </>
  );
};

export const AirportDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <Typography variant="h6" component="h1">
      {f.name}
    </Typography>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Passengers (people/year)" value={f.passenger_number} />
      <DataItem label="Freight (tonnes/year)" value={f.freight_tonnes} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={`${numFormat(f.cost_mean)} ${paren(numRangeFormat(f.cost_min, f.cost_max))}`}
      />
    </List>
  </>
);

export const PowerLineDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    {f.name && (
      <Typography variant="h6" component="h1">
        {f.name}
      </Typography>
    )}
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Connection" value={`${f.from_type} ${f.from_id}–${f.to_type} ${f.to_id} `} />
      <DataItem label="Voltage (kV)" value={f.voltage_kV} />
      <DataItem label="Length (m)" value={f.length} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={`${numFormat(f.cost_mean)} (${numFormat(f.cost_min)}–${numFormat(f.cost_max)})`}
      />
    </List>
  </>
);

export const PowerGenerationNodeDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <Typography variant="h6" component="h1">
      {f.title}
    </Typography>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Capacity (MW)" value={f.capacity} />
      <DataItem label={`Energy intensity (${f.ei_uom})`} value={f.ei} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={`${numFormat(f.cost_mean)} (${numFormat(f.cost_min)}–${numFormat(f.cost_max)})`}
      />
    </List>
  </>
);

export const PowerDemandNodeDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Population served" value={f.population} />
      <DataItem label={`Energy intensity (${f.ei_uom})`} value={f.ei} />
    </List>
  </>
);

export const PowerJunctionNodeDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label={`Energy intensity (${f.ei_uom})`} value={f.ei} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={`${numFormat(f.cost_mean)} (${numFormat(f.cost_min)}–${numFormat(f.cost_max)})`}
      />
    </List>
  </>
);

export const IrrigationDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={numRangeFormat(f.cost_min, f.cost_max)}
      />
      <DataItem label="Notes" value={f.comment} />
    </List>
  </>
);

export const WaterPipelineDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Material" value={f.Material} />
      <DataItem label="Diameter (m)" value={f.Diameter} />
      <DataItem label="Length (m)" value={f.Length} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={numRangeFormat(f.cost_min, f.cost_max)}
      />
      <DataItem label="Notes" value={f.comment} />
    </List>
  </>
);

export const PortDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <Typography variant="h6" component="h1">
      {f.name}
    </Typography>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Vessels (vessels/year)" value={f.vessels_number} />
      <DataItem label="Passengers (people/year)" value={f.passenger_number} />
      <DataItem label="Commodity" value={f.commodity} />
      <DataItem label="Export (tonnes/year)" value={f.export_tonnes} />
      <DataItem label="Import (tonnes/year)" value={f.import_tonnes} />
      <DataItem label="Import of vehicles (tonnes/year)" value={f.import_vehicles_tonnes} />
      <DataItem label="Transhipment (tonnes/year)" value={f.transhipment_tonnes} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={`${numFormat(f.cost_mean)} ${paren(numRangeFormat(f.cost_min, f.cost_max))}`}
      />
      <DataItem label="Notes" value={f.comment} />
    </List>
  </>
);

export const WaterSupplyNodeDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <Typography variant="h6" component="h1">
      {f.name}
    </Typography>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Tank" value={f.Tank_Type} />
      <DataItem label="Population served" value={f.asset_pop_new_2010} />
      <DataItem label="Capacity (mgd, millions of gallons/day)" value={f['capacity (mgd)']} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={numRangeFormat(f.cost_min, f.cost_max)}
      />
      <DataItem label="Notes" value={f.comment} />
    </List>
  </>
);

export const RailEdgeDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <Typography variant="h6" component="h1">
      {f.rail_sect}
    </Typography>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Connection" value={`${f.from_node}–${f.to_node}`} />
      <DataItem label="Owner" value={f.type} />
      <DataItem label="Status" value={f.status} />
      <DataItem label="Length (m)" value={f.shape_length} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={`${numFormat(f.cost_mean)} (${numFormat(f.cost_min)}–${numFormat(f.cost_max)})`}
      />
    </List>
  </>
);

export const RailNodeDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <Typography variant="h6" component="h1">
      {f.Station}
    </Typography>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Lines" value={f.Lines} />
      <DataItem label="Status" value={`${f.status} ${paren(f.Condition)}`} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={`${numFormat(f.cost_mean)} (${numFormat(f.cost_min)}–${numFormat(f.cost_max)})`}
      />
    </List>
  </>
);

export const RoadEdgeDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <Typography variant="h6" component="h1">
      {f.tag_name}
      {f.tag_code ? ', ' : ''}
      {f.tag_code}
    </Typography>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Surface" value={f.tag_surface} />
      <DataItem label="Lanes" value={f.lanes} />
      <DataItem label="Length (m)" value={f.length_m} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={`${numFormat(f.cost_mean)} (${numFormat(f.cost_min)}–${numFormat(f.cost_max)})`}
      />
      <DataItem label="Connection" value={`${f.from_node}–${f.to_node}`} />
      <DataItem label="Source ID" value={f.osm_way_id?.toString()} />
    </List>
  </>
);

export const RoadJunctionDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <Typography variant="h6" component="h1">
      {f.name}
    </Typography>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={`${numFormat(f.cost_mean)} ${paren(numRangeFormat(f.cost_min, f.cost_max))}`}
      />
      <DataItem label={`Reopening cost (${f.cost_unit})`} value={`${numFormat(f.cost_reopen)}`} />
    </List>
  </>
);

export const BridgeDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <Typography variant="h6" component="h1">
      {f.tag_name}
    </Typography>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Source ID" value={f.osm_way_id?.toString()} />
      <DataItem label="Length (m)" value={f.length_m} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={`${numFormat(f.cost_mean)} ${paren(numRangeFormat(f.cost_min, f.cost_max))}`}
      />
    </List>
  </>
);

export const WastewaterNodeDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    <Typography variant="h6" component="h1">
      {f.Name}
    </Typography>
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Treatment type" value={f.Type_of_Tr} />
      <DataItem label="Status" value={f.Status} />
      <DataItem label="Capacity (mgd, millions of gallons/day)" value={f['capacity (mgd)']} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={numRangeFormat(f.cost_min, f.cost_max)}
      />
      <DataItem label="Notes" value={f.comment} />
    </List>
  </>
);

export const BuildingDetails: FC<DetailsComponentProps> = ({ f }) => (
  <>
    {f.name && (
      <Typography variant="h6" component="h1">
        {f.name}
      </Typography>
    )}
    <DetailSubheader id={f.asset_id} />
    <List>
      <DataItem label="Source ID" value={f.osm_way_id} />
      <DataItem label={`Total GDP (${f.GDP_unit})`} value={numFormat(f.total_GDP)} />
      <DataItem
        label={`Rehabilitation cost (${f.cost_unit})`}
        value={`${numFormat(f.cost_mean)} ${paren(numRangeFormat(f.cost_min, f.cost_max))}`}
      />
    </List>
  </>
);

export const CoastalDefenceDetails: FC<DetailsComponentProps> = ({ f }) => {
  const { data } = useRecoilValue(protectedFeatureAdaptationOptionsState({ rcp: '8.5' }));

  // There may be adaptation results calculated for the coastal protection
  // region as a whole. They have a protected_feature_id == feature_id, so
  // appear in `data`, but showing them would be a kind of double counting.
  // We exclude them here.
  const filteredProtectedFeatures = data.filter(
    feature => feature.id !== f.uid
  );

  const sortedProtectedFeatures = [...filteredProtectedFeatures].sort((a, b) => {
    return (b.avoided_ead_mean || 0) - (a.avoided_ead_mean || 0);
  });

  return (
    <>
      <List>
        <DataItem label="ID" value={f.asset_id} />
        <DataItem label="Length (m)" value={`${numFormat(f.length)}`} />
        <DataItem label="Max modelled flood height (m)" value={`${numFormat(f.max_flood_height)}`} />
        <DataItem label="Asset type" value={f.asset_type} />
        <ListItem disableGutters disablePadding>
          <ListItemText
            primary="Protectee assets"
            primaryTypographyProps={{ variant: 'caption' }}
            secondary={
              sortedProtectedFeatures.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 1, maxHeight: 300 }}>
                  <Table size="small" stickyHeader sx={{ '& .MuiTableCell-root': { padding: '4px 8px', fontSize: '0.75rem' } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: '0.7rem' }}>Asset ID</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>Layer</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }} align="right">Avoided EAD ($)</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }} align="right">Avoided EAEL ($)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedProtectedFeatures.map((feature, index) => (
                        <TableRow key={index}>
                          <TableCell>{feature.string_id}</TableCell>
                          <TableCell>{feature.layer}</TableCell>
                          <TableCell align="right">{numFormat(feature.avoided_ead_mean)}</TableCell>
                          <TableCell align="right">{numFormat(feature.avoided_eael_mean)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                '-'
              )
            }
          />
        </ListItem>
      </List>
    </>
  );
};