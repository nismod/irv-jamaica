import { COLORS } from './colors';
import { makeConfig } from 'lib/helpers';

/* Line widths:

-) elec_edges_high,
base: 1,
stops: [
  [7, 1],
  [12, 2],
  [16, 6],
],

-) elec_edges_low, pot_edges
base: 0.5,
stops: [
  [7, 0.5],
  [12, 1],
  [16, 3],
],

-) rail_edges
base: 1.5,
stops: [
  [7, 1.5],
  [12, 2],
  [16, 6],
],

-) road_edges
base: 0.5,
stops: [
  [7, 1.5],
  [12, 2],
  [16, 6],
],

-) all circle layers
base: 1.5,
stops: [
  [7, 3],
  [12, 4],
  [16, 12],
],

*/

export const NETWORKS_METADATA = makeConfig([
  {
    id: 'elec_edges_high',
    type: 'line',
    label: 'Power Lines (High Voltage)',
    color: COLORS.electricity_high.css,
  },
  {
    id: 'elec_edges_low',
    type: 'line',
    label: 'Power Lines (Low Voltage)',
    color: COLORS.electricity_low.css,
    minZoom: 11,
  },
  {
    id: 'elec_nodes_diesel',
    type: 'square',
    label: 'Power Generation (Diesel)',
    color: COLORS.elec_nodes_diesel.css,
  },
  {
    id: 'elec_nodes_gas',
    type: 'square',
    label: 'Power Generation (Gas)',
    color: COLORS.elec_nodes_gas.css,
  },
  {
    id: 'elec_nodes_hydro',
    type: 'square',
    label: 'Power Generation (Hydro)',
    color: COLORS.elec_nodes_hydro.css,
  },
  {
    id: 'elec_nodes_solar',
    type: 'square',
    label: 'Power Generation (Solar)',
    color: COLORS.elec_nodes_solar.css,
  },
  {
    id: 'elec_nodes_wind',
    type: 'square',
    label: 'Power Generation (Wind)',
    color: COLORS.elec_nodes_wind.css,
  },
  {
    id: 'elec_nodes_pole',
    type: 'circle',
    label: 'Power Transmission (Poles)',
    color: COLORS.electricity_low.css,
    minZoom: 13,
  },
  {
    id: 'elec_nodes_substation',
    type: 'circle',
    label: 'Power Transmission (Substations)',
    color: COLORS.electricity_high.css,
  },
  {
    id: 'elec_nodes_demand',
    type: 'circle',
    label: 'Power Demand',
    color: COLORS.electricity_demand.css,
    minZoom: 13,
  },
  {
    id: 'rail_edges',
    type: 'line',
    label: 'Railways',
    color: COLORS.railway.css,
  },
  {
    id: 'rail_stations',
    type: 'circle',
    label: 'Stations',
    color: COLORS.railway.css,
  },
  {
    id: 'rail_junctions',
    type: 'diamond',
    label: 'Railway Junctions',
    color: COLORS.railway.css,
  },
  {
    id: 'road_edges_class_a',
    type: 'line',
    label: 'Roads (Class A)',
    color: COLORS.roads_class_a.css,
  },
  {
    id: 'road_edges_class_b',
    type: 'line',
    label: 'Roads (Class B)',
    color: COLORS.roads_class_b.css,
  },
  {
    id: 'road_edges_class_c',
    type: 'line',
    label: 'Roads (Class C)',
    color: COLORS.roads_class_c.css,
  },
  {
    id: 'road_edges_motorway',
    type: 'line',
    label: 'Roads (Toll)',
    color: COLORS.roads_motorway.css,
  },
  {
    id: 'road_edges_residential',
    type: 'line',
    label: 'Roads (Residential)',
    color: COLORS.roads_unknown.css,
    minZoom: 10,
  },
  {
    id: 'road_edges_unclassified',
    type: 'line',
    label: 'Roads (Unclassified)',
    color: COLORS.roads_unknown.css,
    minZoom: 10,
  },
  {
    id: 'road_bridges',
    type: 'diamond',
    label: 'Bridges',
    color: COLORS.bridges.css,
  },
  {
    id: 'airport_runways',
    type: 'polygon',
    label: 'Airports (Runway)',
    color: COLORS.airport_runways.css,
  },
  {
    id: 'airport_terminals',
    type: 'polygon',
    label: 'Airports (Terminal)',
    color: COLORS.airport_terminals.css,
  },
  {
    id: 'port_areas_break',
    type: 'polygon',
    label: 'Ports (Break)',
    color: COLORS.port_areas_break.css,
  },
  {
    id: 'port_areas_container',
    type: 'polygon',
    label: 'Ports (Container)',
    color: COLORS.port_areas_container.css,
  },
  {
    id: 'port_areas_industry',
    type: 'polygon',
    label: 'Ports (Industry)',
    color: COLORS.port_areas_industry.css,
  },
  {
    id: 'port_areas_silo',
    type: 'polygon',
    label: 'Ports (Silo)',
    color: COLORS.port_areas_silo.css,
  },
  {
    id: 'water_potable_edges',
    type: 'line',
    label: 'Water Supply Pipelines',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_booster',
    label: 'Water Supply (Booster Station)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_catchment',
    label: 'Water Supply (Catchment)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_entombment',
    label: 'Water Supply (Entombment)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_filter',
    label: 'Water Supply (Filter Plant)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_intake',
    label: 'Water Supply (Intake)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_well',
    label: 'Water Supply (Production Well)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_pump',
    label: 'Water Supply (Pump Station)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_relift',
    label: 'Water Supply (Relift Station)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_reservoir',
    label: 'Water Supply (Reservoir)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_river_source',
    label: 'Water Supply (River Source)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_spring',
    label: 'Water Supply (Spring)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_tank',
    label: 'Water Supply (Storage Tank)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_sump',
    label: 'Water Supply (Sump)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_potable_nodes_tp',
    label: 'Water Supply (Treatment Plant)',
    type: 'inv-triangle',
    color: COLORS.water_supply.css,
  },
  {
    id: 'water_irrigation_edges',
    type: 'line',
    label: 'Irrigation Canals',
    color: COLORS.water_irrigation.css,
  },
  {
    id: 'water_irrigation_nodes',
    type: 'inv-triangle',
    label: 'Irrigation facilities',
    color: COLORS.water_irrigation.css,
  },
  {
    id: 'water_waste_sewer_gravity',
    type: 'line',
    label: 'Wastewater Pipelines (Gravity)',
    color: COLORS.water_wastewater.css,
  },
  {
    id: 'water_waste_sewer_pressure',
    type: 'line',
    label: 'Wastewater Pipelines (Pressure)',
    color: COLORS.water_wastewater.css,
  },
  {
    id: 'water_waste_nodes_sump',
    type: 'inv-triangle',
    label: 'Wastewater (Sump)',
    color: COLORS.water_wastewater.css,
  },
  {
    id: 'water_waste_nodes_pump',
    type: 'inv-triangle',
    label: 'Wastewater (Pump Station)',
    color: COLORS.water_wastewater.css,
  },
  {
    id: 'water_waste_nodes_relift',
    type: 'inv-triangle',
    label: 'Wastewater (Relift Station)',
    color: COLORS.water_wastewater.css,
  },
  {
    id: 'water_waste_nodes_wwtp',
    type: 'inv-triangle',
    label: 'Wastewater (Treament Plant)',
    color: COLORS.water_wastewater.css,
  },
  {
    id: 'buildings_commercial',
    type: 'polygon',
    label: 'Buildings (Commercial)',
    color: COLORS.buildings_commercial.css,
    minZoom: 12,
  },
  {
    id: 'buildings_industrial',
    type: 'polygon',
    label: 'Buildings (Industrial)',
    color: COLORS.buildings_industrial.css,
    minZoom: 12,
  },
  {
    id: 'buildings_institutional',
    type: 'polygon',
    label: 'Buildings (Institutional)',
    color: COLORS.buildings_institutional.css,
    minZoom: 12,
  },
  {
    id: 'buildings_mixed',
    type: 'polygon',
    label: 'Buildings (Mixed Use)',
    color: COLORS.buildings_mixed.css,
    minZoom: 12,
  },
  {
    id: 'buildings_other',
    type: 'polygon',
    label: 'Buildings (Other)',
    color: COLORS.buildings_other.css,
    minZoom: 12,
  },
  {
    id: 'buildings_recreation',
    type: 'polygon',
    label: 'Buildings (Recreation)',
    color: COLORS.buildings_recreation.css,
    minZoom: 12,
  },
  {
    id: 'buildings_residential',
    type: 'polygon',
    label: 'Buildings (Residential)',
    color: COLORS.buildings_residential.css,
    minZoom: 12,
  },
  {
    id: 'buildings_resort',
    type: 'polygon',
    label: 'Buildings (Resort)',
    color: COLORS.buildings_resort.css,
    minZoom: 12,
  },
]);
