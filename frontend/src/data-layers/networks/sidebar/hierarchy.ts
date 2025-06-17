import { TreeNode } from 'lib/controls/checkbox-tree/tree-node';

interface NetworkLayerData {
  label: string;
  url?: string;
}

export const NETWORK_LAYERS_HIERARCHY: TreeNode<NetworkLayerData>[] = [
  {
    id: 'power',
    label: 'Power',
    children: [
      {
        id: 'power-lines',
        label: 'Transmission',
        children: [
          {
            id: 'elec_edges_high',
            label: 'High Voltage',
            url: '01',
          },
          {
            id: 'elec_edges_low',
            label: 'Low Voltage',
            url: '02',
          },
          {
            id: 'elec_nodes_pole',
            label: 'Poles',
            url: '03',
          },
          {
            id: 'elec_nodes_substation',
            label: 'Substations',
            url: '04',
          },
        ],
      },
      {
        id: 'elec_nodes_source',
        label: 'Generation',
        children: [
          {
            id: 'elec_nodes_diesel',
            label: 'Diesel',
            url: '05',
          },
          {
            id: 'elec_nodes_gas',
            label: 'Gas',
            url: '06',
          },
          {
            id: 'elec_nodes_hydro',
            label: 'Hydro',
            url: '07',
          },
          {
            id: 'elec_nodes_solar',
            label: 'Solar',
            url: '08',
          },
          {
            id: 'elec_nodes_wind',
            label: 'Wind',
            url: '09',
          },
        ],
      },
      {
        id: 'elec_nodes_demand',
        label: 'Demand',
        url: '0a',
      },
    ],
  },
  {
    id: 'transport',
    label: 'Transport',
    children: [
      {
        id: 'rail-network',
        label: 'Rail Network',
        children: [
          {
            id: 'rail_edges',
            label: 'Railways',
            url: '0b',
          },
          {
            id: 'rail_stations',
            label: 'Stations',
            url: '0c',
          },
          {
            id: 'rail_junctions',
            label: 'Junctions',
            url: '0d',
          },
        ],
      },
      {
        id: 'road-network',
        label: 'Road Network',
        children: [
          {
            id: 'roads',
            label: 'Roads',
            children: [
              {
                id: 'road_edges_motorway',
                label: 'Toll',
                url: '11',
              },
              {
                id: 'road_edges_class_a',
                label: 'Class A',
                url: '0e',
              },
              {
                id: 'road_edges_class_b',
                label: 'Class B',
                url: '0f',
              },
              {
                id: 'road_edges_class_c',
                label: 'Class C',
                url: '10',
              },
              {
                id: 'road_edges_residential',
                label: 'Residential',
                url: '12',
              },
              {
                id: 'road_edges_unclassified',
                label: 'Unclassified',
                url: '13',
              },
            ],
          },
          {
            id: 'road_bridges',
            label: 'Bridges',
            url: '14',
          },
        ],
      },
      {
        id: 'port_areas',
        label: 'Ports',
        children: [
          {
            id: 'port_areas_break',
            label: 'Break',
            url: '15',
          },
          {
            id: 'port_areas_container',
            label: 'Container',
            url: '16',
          },
          {
            id: 'port_areas_industry',
            label: 'Industry',
            url: '17',
          },
          {
            id: 'port_areas_silo',
            label: 'Silo',
            url: '18',
          },
        ],
      },
      {
        id: 'air',
        label: 'Airports',
        children: [
          {
            id: 'airport_runways',
            label: 'Runways',
            url: '19',
          },
          {
            id: 'airport_terminals',
            label: 'Terminals',
            url: '1a',
          },
        ],
      },
    ],
  },
  {
    id: 'water',
    label: 'Water',
    children: [
      {
        id: 'water-supply',
        label: 'Potable Water Supply',
        children: [
          {
            id: 'water_potable_edges',
            label: 'Supply Pipelines',
            url: '1b',
          },
          {
            id: 'water_potable_nodes',
            label: 'Supply Facilities',
            children: [
              {
                id: 'water_potable_nodes_booster',
                label: 'Booster Station',
                url: '1c',
              },
              {
                id: 'water_potable_nodes_catchment',
                label: 'Catchment',
                url: '1d',
              },
              {
                id: 'water_potable_nodes_entombment',
                label: 'Entombment',
                url: '1e',
              },
              {
                id: 'water_potable_nodes_filter',
                label: 'Filter Plant',
                url: '1f',
              },
              {
                id: 'water_potable_nodes_intake',
                label: 'Intake',
                url: '20',
              },
              {
                id: 'water_potable_nodes_well',
                label: 'Production Well',
                url: '21',
              },
              {
                id: 'water_potable_nodes_pump',
                label: 'Pump Station',
                url: '22',
              },
              {
                id: 'water_potable_nodes_relift',
                label: 'Relift Station',
                url: '23',
              },
              {
                id: 'water_potable_nodes_reservoir',
                label: 'Reservoir',
                url: '24',
              },
              {
                id: 'water_potable_nodes_river_source',
                label: 'River Source',
                url: '25',
              },
              {
                id: 'water_potable_nodes_spring',
                label: 'Spring',
                url: '26',
              },
              {
                id: 'water_potable_nodes_tank',
                label: 'Storage Tank',
                url: '27',
              },
              {
                id: 'water_potable_nodes_sump',
                label: 'Sump',
                url: '28',
              },
              {
                id: 'water_potable_nodes_tp',
                label: 'Treatment Plant',
                url: '29',
              },
            ],
          },
        ],
      },
      {
        id: 'water-irrigation',
        label: 'Irrigation',
        children: [
          {
            id: 'water_irrigation_edges',
            label: 'Irrigation Canals',
            url: '2a',
          },
          {
            id: 'water_irrigation_nodes',
            label: 'Irrigation Wells',
            url: '2b',
          },
        ],
      },
      {
        id: 'water-waste',
        label: 'Wastewater',
        children: [
          {
            id: 'water_waste_edges',
            label: 'Wastewater Pipelines',
            children: [
              {
                id: 'water_waste_sewer_gravity',
                label: 'Gravity',
                url: '2c',
              },
              {
                id: 'water_waste_sewer_pressure',
                label: 'Pressure',
                url: '2d',
              },
            ],
          },
          {
            id: 'water_waste_nodes',
            label: 'Wastewater Facilities',
            children: [
              {
                id: 'water_waste_nodes_sump',
                label: 'Sump',
                url: '2e',
              },
              {
                id: 'water_waste_nodes_pump',
                label: 'Pump',
                url: '2f',
              },
              {
                id: 'water_waste_nodes_relift',
                label: 'Relift Station',
                url: '30',
              },
              {
                id: 'water_waste_nodes_wwtp',
                label: 'Treatment Plant',
                url: '31',
              },
            ],
          },
        ],
      },
    ],
  },
];
