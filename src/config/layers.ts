import { titleCase } from 'vega-lite';
import { makeConfig } from '../helpers';
import { COLORS } from './colors';

export interface LayerDefinition {
  deckLayer: string | { baseName: string; params: any };
  deckLayerParams?: any;
  label: string;
  type: string; //'line' | 'circle' | 'raster';
  color: string;
  getId?: (x) => string;
}

export function getHazardId<
  F extends 'fluvial' | 'surface' | 'coastal' | 'cyclone',
  RP extends number,
  RCP extends string,
  E extends number,
  C extends number | string,
>({
  hazardType,
  returnPeriod,
  rcp,
  epoch,
  confidence,
}: {
  hazardType: F;
  returnPeriod: RP;
  rcp: RCP;
  epoch: E;
  confidence: C;
}) {
  return `${hazardType}__rp_${returnPeriod}__rcp_${rcp}__epoch_${epoch}__conf_${confidence}` as const;
}

function hazardLayer<
  F extends 'fluvial' | 'surface' | 'coastal' | 'cyclone',
  RP extends number,
  RCP extends string,
  E extends number,
  C extends number | string,
>(label: string, hazardType: F, returnPeriod: RP, rcp: RCP, epoch: E, confidence: C) {
  const id = getHazardId({ hazardType, returnPeriod, rcp, epoch, confidence });
  return {
    id,
    deckLayer: { baseName: 'hazard', params: { hazardType, returnPeriod, rcp, epoch, confidence } },
    type: 'raster',
    label, //: `${titleCase(hazardType)}`,
    color: '#aaaaaa',
    getId: getHazardId,
  } as LayerDefinition & { id: typeof id };
}

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
export const LAYERS = makeConfig([
  {
    id: 'elec_edges_high',
    deckLayer: 'elec_edges',
    type: 'line',
    label: 'Power Lines (High Voltage)',
    color: COLORS.electricity_high.css,
  },
  {
    id: 'elec_edges_low',
    deckLayer: 'elec_edges',
    type: 'line',
    label: 'Power Lines (Low Voltage)',
    color: COLORS.electricity_low.css,
  },
  {
    id: 'elec_nodes',
    deckLayer: 'elec_nodes',
    type: 'circle',
    label: 'Power Nodes',
    color: COLORS.electricity_high.css,
  },
  {
    id: 'rail_edges',
    deckLayer: 'rail_edges',
    type: 'line',
    label: 'Railways',
    color: COLORS.railway.css,
  },
  {
    id: 'rail_nodes',
    deckLayer: 'rail_nodes',
    type: 'circle',
    label: 'Stations',
    color: COLORS.railway.css,
  },
  {
    id: 'road_edges',
    deckLayer: 'road_edges',
    type: 'line',
    label: 'Roads',
    color: COLORS.roads_unknown.css,
  },
  {
    id: 'road_bridges',
    deckLayer: 'road_bridges',
    type: 'circle',
    label: 'Bridges',
    color: COLORS.bridges.css,
  },
  {
    id: 'water_potable_edges',
    deckLayer: 'water_potable_edges',
    type: 'line',
    label: 'Water Supply Network',
    color: COLORS.water_edges.css,
  },
  {
    id: 'water_potable_nodes',
    deckLayer: 'water_potable_nodes',
    type: 'circle',
    label: 'Water Supply Facilities',
    color: COLORS.water_abstraction.css,
  },

  hazardLayer('River Flooding', 'fluvial', 20, 'baseline', 2010, 'None'),
  hazardLayer('River Flooding', 'fluvial', 50, 'baseline', 2010, 'None'),
  hazardLayer('River Flooding', 'fluvial', 100, 'baseline', 2010, 'None'),
  hazardLayer('River Flooding', 'fluvial', 200, 'baseline', 2010, 'None'),
  hazardLayer('River Flooding', 'fluvial', 500, 'baseline', 2010, 'None'),
  hazardLayer('River Flooding', 'fluvial', 1500, 'baseline', 2010, 'None'),

  hazardLayer('Surface Flooding', 'surface', 20, 'baseline', 2010, 'None'),
  hazardLayer('Surface Flooding', 'surface', 50, 'baseline', 2010, 'None'),
  hazardLayer('Surface Flooding', 'surface', 100, 'baseline', 2010, 'None'),
  hazardLayer('Surface Flooding', 'surface', 200, 'baseline', 2010, 'None'),
  hazardLayer('Surface Flooding', 'surface', 500, 'baseline', 2010, 'None'),
  hazardLayer('Surface Flooding', 'surface', 1500, 'baseline', 2010, 'None'),

  hazardLayer('Coastal Flooding', 'coastal', 1, '4x5', 2050, 'None'),
  hazardLayer('Coastal Flooding', 'coastal', 2, '4x5', 2050, 'None'),
  hazardLayer('Coastal Flooding', 'coastal', 5, '4x5', 2050, 'None'),
  hazardLayer('Coastal Flooding', 'coastal', 10, '4x5', 2050, 'None'),
  hazardLayer('Coastal Flooding', 'coastal', 50, '4x5', 2050, 'None'),
  hazardLayer('Coastal Flooding', 'coastal', 100, '4x5', 2050, 'None'),
]);

export type LayerName = keyof typeof LAYERS;
