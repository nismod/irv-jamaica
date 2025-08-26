import { FC, Suspense } from 'react';
import { Box, IconButton, Typography } from '@mui/material';

import {
  AirportDetails,
  BridgeDetails,
  BuildingDetails,
  CoastalDefenceDetails,
  DefaultDetails,
  DetailsComponent,
  IrrigationDetails,
  PortDetails,
  PowerDemandNodeDetails,
  PowerGenerationNodeDetails,
  PowerJunctionNodeDetails,
  PowerLineDetails,
  RailEdgeDetails,
  RailNodeDetails,
  RoadEdgeDetails,
  WastewaterNodeDetails,
  WaterPipelineDetails,
  WaterSupplyNodeDetails,
} from 'lib/map/tooltip/detail-components';
import { NETWORKS_METADATA } from 'data-layers/networks/metadata';
import { ColorBox } from 'lib/map/tooltip/content/ColorBox';
import { DamagesSection } from './damages/DamagesSection';
import { AdaptationSection } from './adaptation/AdaptationSection';
import Download from '@mui/icons-material/Download';
import { downloadFile } from 'lib/helpers';
import { useRecoilValue } from 'recoil';
import { selectedAssetDetails } from 'lib/state/interactions/interaction-state';

const componentMapping: Record<keyof typeof NETWORKS_METADATA, DetailsComponent> = {
  airport_terminals: AirportDetails,
  airport_runways: AirportDetails,

  port_areas_break: PortDetails,
  port_areas_container: PortDetails,
  port_areas_industry: PortDetails,
  port_areas_silo: PortDetails,

  rail_edges: RailEdgeDetails,
  rail_stations: RailNodeDetails,
  rail_junctions: RailNodeDetails,

  road_bridges: BridgeDetails,
  road_edges_class_a: RoadEdgeDetails,
  road_edges_class_b: RoadEdgeDetails,
  road_edges_class_c: RoadEdgeDetails,
  road_edges_motorway: RoadEdgeDetails,
  road_edges_residential: RoadEdgeDetails,
  road_edges_unclassified: RoadEdgeDetails,

  water_irrigation_edges: IrrigationDetails,
  water_irrigation_nodes: IrrigationDetails,

  water_potable_nodes_booster: WaterSupplyNodeDetails,
  water_potable_nodes_catchment: WaterSupplyNodeDetails,
  water_potable_nodes_entombment: WaterSupplyNodeDetails,
  water_potable_nodes_filter: WaterSupplyNodeDetails,
  water_potable_nodes_intake: WaterSupplyNodeDetails,
  water_potable_nodes_well: WaterSupplyNodeDetails,
  water_potable_nodes_pump: WaterSupplyNodeDetails,
  water_potable_nodes_relift: WaterSupplyNodeDetails,
  water_potable_nodes_reservoir: WaterSupplyNodeDetails,
  water_potable_nodes_river_source: WaterSupplyNodeDetails,
  water_potable_nodes_spring: WaterSupplyNodeDetails,
  water_potable_nodes_tank: WaterSupplyNodeDetails,
  water_potable_nodes_sump: WaterSupplyNodeDetails,
  water_potable_nodes_tp: WaterSupplyNodeDetails,
  water_potable_edges: WaterPipelineDetails,

  water_waste_nodes_sump: WastewaterNodeDetails,
  water_waste_nodes_pump: WastewaterNodeDetails,
  water_waste_nodes_relift: WastewaterNodeDetails,
  water_waste_nodes_wwtp: WastewaterNodeDetails,
  water_waste_sewer_gravity: WaterPipelineDetails,
  water_waste_sewer_pressure: WaterPipelineDetails,

  elec_edges_high: PowerLineDetails,
  elec_edges_low: PowerLineDetails,
  elec_nodes_pole: PowerJunctionNodeDetails,
  elec_nodes_substation: PowerJunctionNodeDetails, // TODO create own component

  elec_nodes_demand: PowerDemandNodeDetails,

  elec_nodes_diesel: PowerGenerationNodeDetails,
  elec_nodes_gas: PowerGenerationNodeDetails,
  elec_nodes_hydro: PowerGenerationNodeDetails,
  elec_nodes_solar: PowerGenerationNodeDetails,
  elec_nodes_wind: PowerGenerationNodeDetails,

  buildings_commercial: BuildingDetails,
  buildings_industrial: BuildingDetails,
  buildings_residential: BuildingDetails,
  buildings_other: BuildingDetails,
  buildings_institutional: BuildingDetails,
  buildings_mixed: BuildingDetails,
  buildings_recreation: BuildingDetails,
  buildings_resort: BuildingDetails,

  coast_nodes_cpf: CoastalDefenceDetails,
};

interface FeatureSidebarContentProps {
  feature: { id: string | number; properties?: Record<string, string> };
  assetType: string;
  showRiskSection?: boolean;
}

const FeatureDetails = ({ assetType, feature, showRiskSection }) => {
  const DetailsComponent = componentMapping[assetType] ?? DefaultDetails;
  const featureDetails = useRecoilValue(selectedAssetDetails(feature.id));
  const f = feature.properties;
  return (
    <>
      <pre style={{ display: 'none' }}>
        <code className="feature-debug">{JSON.stringify(f, null, 2)}</code>
        {featureDetails && (
          <code className="feature-details-debug">
            {JSON.stringify(featureDetails.properties, null, 2)}
          </code>
        )}
      </pre>
      <DetailsComponent f={featureDetails.properties} />
      {showRiskSection && (
        <>
          <IconButton
            sx={{
              position: 'absolute',
              top: 0,
              right: 30, // hack: larger right margin to allow space for close button
            }}
            title="Download CSV with feature metadata"
            onClick={() =>
              downloadFile(makeDetailsCsv(featureDetails), 'text/csv', `feature_${feature.id}.csv`)
            }
          >
            <Download />
          </IconButton>
          <DamagesSection fd={featureDetails} />
          <AdaptationSection fd={featureDetails} />
        </>
      )}
    </>
  );
};

export const FeatureSidebarContent: FC<FeatureSidebarContentProps> = ({
  feature,
  assetType,
  showRiskSection = true,
}) => {
  const { color, label } = NETWORKS_METADATA[assetType];

  return (
    <Box position="relative">
      <Typography variant="caption">
        <ColorBox color={color ?? '#333'} />
        {label}
      </Typography>
      <Suspense fallback={null}>
        <FeatureDetails assetType={assetType} feature={feature} showRiskSection={showRiskSection} />
      </Suspense>
    </Box>
  );
};

function makeDetailsCsv(fd) {
  return (
    'variable,value\n' +
    Object.entries(fd.properties)
      .map(([k, v]) => `${k},${v}`)
      .join('\n')
  );
}
