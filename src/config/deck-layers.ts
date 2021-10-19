import { MVTLayer, TileLayer, BitmapLayer } from 'deck.gl';
import GL from '@luma.gl/constants';
import { DataFilterExtension } from '@deck.gl/extensions';

import { COLORS } from './colors';
import { makeConfig } from '../helpers';
import { getHazardId } from './layers';

const lineStyle = (zoom) => ({
  getLineWidth: 15,
  lineWidthUnit: 'meters',
  lineWidthMinPixels: 1,
  lineWidthMaxPixels: 5,
  lineJointRounded: true,
  lineCapRounded: true,

  // widthScale: 2 ** (15 - zoom),
});

const pointRadius = (zoom) => ({
  getPointRadius: 20,
  pointRadiusUnit: 'meters',
  pointRadiusMinPixels: 3,
  pointRadiusMaxPixels: 10,
  // radiusScale: 2 ** (15 - zoom),
});

const rasterColormaps = {
  fluvial: 'blues',
  coastal: 'greens',
  surface: 'purples',
  cyclone: 'reds',
};

const rasterColormapRanges = {
  fluvial: '[0,10]',
  coastal: '[0,3.5]',
  surface: '[0,10]',
  cyclone: '[20,80]',
};

function getBoundsForTile(tileProps) {
  const {
    bbox: { west, south, east, north },
  } = tileProps;

  return [west, south, east, north];
}

enum ElecVoltage {
  elec_edges_high = 'elec_edges_high',
  elec_edges_low = 'elec_edges_low',
}

const elecVoltageLookup = {
  'High Voltage': ElecVoltage.elec_edges_high,
  'Low Voltage': ElecVoltage.elec_edges_low,
};

enum ElecNode {
  source = 'source',
  sink = 'sink',
  junction = 'junction'
}

const elecNodeLookup = {
  'source': ElecNode.source,
  'sink': ElecNode.sink,
  'junction': ElecNode.junction,
}

const electricityColor = {
  [ElecVoltage.elec_edges_high]: COLORS.electricity_high.deck,
  [ElecVoltage.elec_edges_low]: COLORS.electricity_low.deck,
  [ElecNode.source]: COLORS.electricity_high.deck,
  [ElecNode.junction]: COLORS.electricity_unknown.deck,
  [ElecNode.sink]: COLORS.electricity_low.deck,
};

enum RoadClass {
  class_a = 'class_a',
  class_b = 'class_b',
  class_c = 'class_c',
  metro = 'metro',
  other = 'other',
  track = 'track',
}

const roadClassLookup = {
  'CLASS A': RoadClass.class_a,
  'CLASS B': RoadClass.class_b,
  'CLASS C': RoadClass.class_c,
  METRO: RoadClass.metro,
  TRACK: RoadClass.track,
  OTHER: RoadClass.other,
};

const roadColor = {
  [RoadClass.class_a]: COLORS.roads_class_a.deck,
  [RoadClass.class_b]: COLORS.roads_class_b.deck,
  [RoadClass.class_c]: COLORS.roads_class_c.deck,
  [RoadClass.metro]: COLORS.roads_class_metro.deck,
  [RoadClass.track]: COLORS.roads_unknown.deck,
  [RoadClass.other]: COLORS.roads_unknown.deck,
};

export const DECK_LAYERS = makeConfig<any, string>([
  {
    id: 'elec_edges',
    type: 'MVTLayer',
    spatialType: 'vector',
    fn: ({ props, zoom, visibility }) =>
      new MVTLayer(props, {
        data: 'http://localhost:8080/data/elec_edges.json',
        refinementStrategy: 'no-overlap',
        dataTransform: (data) => {
          for (const objectProperty of data.lines.properties) {
            objectProperty.__logicalLayer = elecVoltageLookup[objectProperty.asset_type];
          }
          return data;
        },
        getLineColor: (x) => electricityColor[x.properties.__logicalLayer],
        getFilterValue: (x) => (visibility[x.properties.__logicalLayer] ? 1 : 0),
        filterRange: [1, 1],
        getLineWidth: 10,
        lineWidthUnit: 'meters',
        lineWidthMinPixels: 1,
        lineWidthMaxPixels: 10,
        lineJointRounded: true,
        lineCapRounded: true,
        updateTriggers: {
          getFilterValue: [visibility],
        },
        extensions: [new DataFilterExtension({ filterSize: 1 })],
      } as any),
    getLogicalLayer: ({ deckLayerId, feature }) => {
      return feature.properties.__logicalLayer;
    },
  },
  {
    id: 'elec_nodes',
    type: 'MVTLayer',
    spatialType: 'vector',
    fn: ({ props, zoom }) =>
      new MVTLayer(props, {
        data: 'http://localhost:8080/data/elec_nodes.json',
        refinementStrategy: 'no-overlap',
        getFillColor: (x) => {
          const elecNodeProp = x.properties.asset_type;
          const elecNodeEnum = elecNodeLookup[elecNodeProp];
          const color = electricityColor[elecNodeEnum];
          return color;
        },
        stroked: true,
        getLineColor: [255, 255, 255],
        lineWidthMinPixels: 1,
        ...pointRadius(zoom),
      } as any),
  },
  {
    id: 'rail_edges',
    type: 'MVTLayer',
    spatialType: 'vector',
    fn: ({ props, zoom }) =>
      new MVTLayer(props, {
        data: 'http://localhost:8080/data/rail_edges.json',
        refinementStrategy: 'no-overlap',
        getLineColor: COLORS.railway.deck,
        ...lineStyle(zoom),
      } as any),
  },
  {
    id: 'rail_nodes',
    type: 'MVTLayer',
    spatialType: 'vector',
    fn: ({ props, zoom }) =>
      new MVTLayer(props, {
        data: 'http://localhost:8080/data/rail_nodes.json',
        refinementStrategy: 'no-overlap',
        getFillColor: COLORS.railway.deck,
        stroked: true,
        getLineColor: [255, 255, 255],
        ...pointRadius(zoom),
      } as any),
  },
  {
    id: 'road_edges',
    type: 'MVTLayer',
    spatialType: 'vector',
    fn: ({ props, zoom }) =>
      new MVTLayer(props, {
        data: 'http://localhost:8080/data/road_edges.json',
        refinementStrategy: 'no-overlap',
        getLineColor: (x) => {
          const roadClassProp = x.properties.road_class;
          // console.log('prop', roadClassProp);
          const roadClassEnum = roadClassLookup[roadClassProp];
          // console.log('enum', roadClassEnum);
          const color = roadColor[roadClassEnum];
          // console.log(color);
          return color;
        },
        ...lineStyle(zoom),
      } as any),
  },
  {
    id: 'road_bridges',
    type: 'MVTLayer',
    spatialType: 'vector',
    fn: ({ props, zoom }) =>
      new MVTLayer(props, {
        data: 'http://localhost:8080/data/road_bridges.json',
        refinementStrategy: 'no-overlap',
        getFillColor: COLORS.bridges.deck,
        stroked: true,
        getLineColor: [255, 255, 255],
        ...pointRadius(zoom),
      } as any),
  },
  {
    id: 'water_potable_edges',
    type: 'MVTLayer',
    spatialType: 'vector',
    fn: ({ props, zoom }) =>
      new MVTLayer(props, {
        data: 'http://localhost:8080/data/water_potable_edges.json',
        refinementStrategy: 'no-overlap',
        ...lineStyle(zoom),
        getLineColor: COLORS.water_edges.deck,
      } as any),
  },
  {
    id: 'water_potable_nodes',
    type: 'MVTLayer',
    spatialType: 'vector',
    fn: ({ props, zoom }) =>
      new MVTLayer(props, {
        data: 'http://localhost:8080/data/water_potable_nodes.json',
        refinementStrategy: 'no-overlap',
        getFillColor: COLORS.water_abstraction.deck,
        stroked: true,
        getLineColor: [255, 255, 255],
        ...pointRadius(zoom),
      } as any),
  },

  hazardDeckLayer('fluvial', 20, 'baseline', 2010, 'None'),
  hazardDeckLayer('fluvial', 50, 'baseline', 2010, 'None'),
  hazardDeckLayer('fluvial', 100, 'baseline', 2010, 'None'),
  hazardDeckLayer('fluvial', 200, 'baseline', 2010, 'None'),
  hazardDeckLayer('fluvial', 500, 'baseline', 2010, 'None'),
  hazardDeckLayer('fluvial', 1500, 'baseline', 2010, 'None'),

  hazardDeckLayer('surface', 20, 'baseline', 2010, 'None'),
  hazardDeckLayer('surface', 50, 'baseline', 2010, 'None'),
  hazardDeckLayer('surface', 100, 'baseline', 2010, 'None'),
  hazardDeckLayer('surface', 200, 'baseline', 2010, 'None'),
  hazardDeckLayer('surface', 500, 'baseline', 2010, 'None'),
  hazardDeckLayer('surface', 1500, 'baseline', 2010, 'None'),

  hazardDeckLayer('coastal', 1, '2x6', 2050, 'None'),
  hazardDeckLayer('coastal', 2, '2x6', 2050, 'None'),
  hazardDeckLayer('coastal', 5, '2x6', 2050, 'None'),
  hazardDeckLayer('coastal', 10, '2x6', 2050, 'None'),
  hazardDeckLayer('coastal', 50, '2x6', 2050, 'None'),
  hazardDeckLayer('coastal', 100, '2x6', 2050, 'None'),
  hazardDeckLayer('coastal', 1, '2x6', 2100, 'None'),
  hazardDeckLayer('coastal', 2, '2x6', 2100, 'None'),
  hazardDeckLayer('coastal', 5, '2x6', 2100, 'None'),
  hazardDeckLayer('coastal', 10, '2x6', 2100, 'None'),
  hazardDeckLayer('coastal', 50, '2x6', 2100, 'None'),
  hazardDeckLayer('coastal', 100, '2x6', 2100, 'None'),
  hazardDeckLayer('coastal', 1, 'baseline', 2010, 'None'),
  hazardDeckLayer('coastal', 2, 'baseline', 2010, 'None'),
  hazardDeckLayer('coastal', 5, 'baseline', 2010, 'None'),
  hazardDeckLayer('coastal', 10, 'baseline', 2010, 'None'),
  hazardDeckLayer('coastal', 50, 'baseline', 2010, 'None'),
  hazardDeckLayer('coastal', 100, 'baseline', 2010, 'None'),
  hazardDeckLayer('coastal', 1, '4x5', 2030, 'None'),
  hazardDeckLayer('coastal', 2, '4x5', 2030, 'None'),
  hazardDeckLayer('coastal', 5, '4x5', 2030, 'None'),
  hazardDeckLayer('coastal', 10, '4x5', 2030, 'None'),
  hazardDeckLayer('coastal', 50, '4x5', 2030, 'None'),
  hazardDeckLayer('coastal', 100, '4x5', 2030, 'None'),
  hazardDeckLayer('coastal', 1, '4x5', 2050, 'None'),
  hazardDeckLayer('coastal', 2, '4x5', 2050, 'None'),
  hazardDeckLayer('coastal', 5, '4x5', 2050, 'None'),
  hazardDeckLayer('coastal', 10, '4x5', 2050, 'None'),
  hazardDeckLayer('coastal', 50, '4x5', 2050, 'None'),
  hazardDeckLayer('coastal', 100, '4x5', 2050, 'None'),
  hazardDeckLayer('coastal', 1, '4x5', 2070, 'None'),
  hazardDeckLayer('coastal', 2, '4x5', 2070, 'None'),
  hazardDeckLayer('coastal', 5, '4x5', 2070, 'None'),
  hazardDeckLayer('coastal', 10, '4x5', 2070, 'None'),
  hazardDeckLayer('coastal', 50, '4x5', 2070, 'None'),
  hazardDeckLayer('coastal', 100, '4x5', 2070, 'None'),
  hazardDeckLayer('coastal', 1, '4x5', 2100, 'None'),
  hazardDeckLayer('coastal', 2, '4x5', 2100, 'None'),
  hazardDeckLayer('coastal', 5, '4x5', 2100, 'None'),
  hazardDeckLayer('coastal', 10, '4x5', 2100, 'None'),
  hazardDeckLayer('coastal', 50, '4x5', 2100, 'None'),
  hazardDeckLayer('coastal', 100, '4x5', 2100, 'None'),
  hazardDeckLayer('coastal', 1, '8x5', 2030, 'None'),
  hazardDeckLayer('coastal', 2, '8x5', 2030, 'None'),
  hazardDeckLayer('coastal', 5, '8x5', 2030, 'None'),
  hazardDeckLayer('coastal', 10, '8x5', 2030, 'None'),
  hazardDeckLayer('coastal', 50, '8x5', 2030, 'None'),
  hazardDeckLayer('coastal', 100, '8x5', 2030, 'None'),
  hazardDeckLayer('coastal', 1, '8x5', 2050, 'None'),
  hazardDeckLayer('coastal', 2, '8x5', 2050, 'None'),
  hazardDeckLayer('coastal', 5, '8x5', 2050, 'None'),
  hazardDeckLayer('coastal', 10, '8x5', 2050, 'None'),
  hazardDeckLayer('coastal', 50, '8x5', 2050, 'None'),
  hazardDeckLayer('coastal', 100, '8x5', 2050, 'None'),
  hazardDeckLayer('coastal', 1, '8x5', 2070, 'None'),
  hazardDeckLayer('coastal', 2, '8x5', 2070, 'None'),
  hazardDeckLayer('coastal', 5, '8x5', 2070, 'None'),
  hazardDeckLayer('coastal', 10, '8x5', 2070, 'None'),
  hazardDeckLayer('coastal', 50, '8x5', 2070, 'None'),
  hazardDeckLayer('coastal', 100, '8x5', 2070, 'None'),
  hazardDeckLayer('coastal', 1, '8x5', 2100, 'None'),
  hazardDeckLayer('coastal', 2, '8x5', 2100, 'None'),
  hazardDeckLayer('coastal', 5, '8x5', 2100, 'None'),
  hazardDeckLayer('coastal', 10, '8x5', 2100, 'None'),
  hazardDeckLayer('coastal', 50, '8x5', 2100, 'None'),
  hazardDeckLayer('coastal', 100, '8x5', 2100, 'None'),

  hazardDeckLayer('cyclone', 10, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 10, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 10, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 20, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 20, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 20, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 30, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 30, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 30, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 40, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 40, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 40, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 50, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 50, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 50, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 60, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 60, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 60, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 70, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 70, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 70, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 80, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 80, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 80, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 90, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 90, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 90, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 100, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 100, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 100, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 200, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 200, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 200, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 300, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 300, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 300, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 400, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 400, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 400, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 500, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 500, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 500, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 600, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 600, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 600, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 700, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 700, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 700, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 800, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 800, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 800, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 900, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 900, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 900, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 1000, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 1000, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 1000, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 2000, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 2000, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 2000, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 3000, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 3000, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 3000, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 4000, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 4000, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 4000, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 5000, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 5000, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 5000, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 6000, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 6000, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 6000, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 7000, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 7000, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 7000, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 8000, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 8000, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 8000, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 9000, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 9000, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 9000, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 10000, '4x5', 2050, 5),
  hazardDeckLayer('cyclone', 10000, '4x5', 2050, 50),
  hazardDeckLayer('cyclone', 10000, '4x5', 2050, 95),
  hazardDeckLayer('cyclone', 10, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 10, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 10, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 20, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 20, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 20, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 30, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 30, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 30, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 40, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 40, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 40, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 50, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 50, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 50, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 60, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 60, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 60, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 70, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 70, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 70, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 80, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 80, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 80, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 90, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 90, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 90, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 100, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 100, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 100, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 200, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 200, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 200, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 300, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 300, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 300, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 400, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 400, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 400, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 500, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 500, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 500, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 600, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 600, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 600, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 700, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 700, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 700, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 800, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 800, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 800, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 900, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 900, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 900, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 1000, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 1000, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 1000, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 2000, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 2000, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 2000, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 3000, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 3000, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 3000, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 4000, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 4000, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 4000, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 5000, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 5000, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 5000, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 6000, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 6000, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 6000, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 7000, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 7000, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 7000, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 8000, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 8000, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 8000, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 9000, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 9000, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 9000, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 10000, '4x5', 2100, 5),
  hazardDeckLayer('cyclone', 10000, '4x5', 2100, 50),
  hazardDeckLayer('cyclone', 10000, '4x5', 2100, 95),
  hazardDeckLayer('cyclone', 10, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 10, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 10, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 20, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 20, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 20, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 30, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 30, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 30, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 40, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 40, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 40, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 50, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 50, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 50, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 60, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 60, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 60, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 70, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 70, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 70, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 80, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 80, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 80, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 90, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 90, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 90, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 100, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 100, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 100, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 200, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 200, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 200, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 300, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 300, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 300, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 400, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 400, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 400, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 500, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 500, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 500, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 600, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 600, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 600, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 700, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 700, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 700, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 800, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 800, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 800, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 900, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 900, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 900, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 1000, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 1000, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 1000, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 2000, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 2000, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 2000, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 3000, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 3000, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 3000, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 4000, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 4000, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 4000, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 5000, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 5000, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 5000, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 6000, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 6000, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 6000, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 7000, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 7000, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 7000, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 8000, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 8000, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 8000, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 9000, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 9000, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 9000, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 10000, '8x5', 2050, 5),
  hazardDeckLayer('cyclone', 10000, '8x5', 2050, 50),
  hazardDeckLayer('cyclone', 10000, '8x5', 2050, 95),
  hazardDeckLayer('cyclone', 10, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 10, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 10, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 20, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 20, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 20, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 30, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 30, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 30, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 40, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 40, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 40, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 50, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 50, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 50, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 60, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 60, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 60, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 70, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 70, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 70, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 80, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 80, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 80, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 90, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 90, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 90, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 100, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 100, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 100, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 200, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 200, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 200, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 300, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 300, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 300, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 400, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 400, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 400, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 500, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 500, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 500, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 600, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 600, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 600, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 700, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 700, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 700, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 800, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 800, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 800, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 900, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 900, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 900, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 1000, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 1000, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 1000, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 2000, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 2000, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 2000, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 3000, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 3000, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 3000, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 4000, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 4000, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 4000, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 5000, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 5000, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 5000, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 6000, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 6000, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 6000, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 7000, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 7000, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 7000, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 8000, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 8000, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 8000, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 9000, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 9000, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 9000, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 10000, '8x5', 2100, 5),
  hazardDeckLayer('cyclone', 10000, '8x5', 2100, 50),
  hazardDeckLayer('cyclone', 10000, '8x5', 2100, 95),
  hazardDeckLayer('cyclone', 10, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 10, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 10, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 20, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 20, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 20, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 30, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 30, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 30, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 40, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 40, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 40, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 50, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 50, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 50, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 60, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 60, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 60, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 70, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 70, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 70, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 80, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 80, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 80, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 90, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 90, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 90, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 100, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 100, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 100, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 200, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 200, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 200, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 300, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 300, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 300, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 400, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 400, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 400, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 500, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 500, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 500, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 600, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 600, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 600, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 700, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 700, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 700, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 800, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 800, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 800, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 900, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 900, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 900, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 1000, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 1000, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 1000, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 2000, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 2000, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 2000, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 3000, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 3000, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 3000, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 4000, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 4000, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 4000, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 5000, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 5000, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 5000, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 6000, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 6000, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 6000, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 7000, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 7000, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 7000, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 8000, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 8000, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 8000, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 9000, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 9000, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 9000, 'baseline', 2010, 95),
  hazardDeckLayer('cyclone', 10000, 'baseline', 2010, 5),
  hazardDeckLayer('cyclone', 10000, 'baseline', 2010, 50),
  hazardDeckLayer('cyclone', 10000, 'baseline', 2010, 95),

  // {
  //   id: 'hazard',
  //   type: 'TileLayer',
  //   spatialType: 'raster',
  //   fn: ({ props, params: { floodType, returnPeriod } }) =>
  //     new TileLayer(props, {
  //       data: `http://localhost:5000/singleband/${floodType}/${returnPeriod}/raw/{z}/{x}/{y}.png?colormap=${rasterColormaps[floodType]}&stretch_range=${rasterColormapRanges[floodType]}`,
  //       refinementStrategy: 'no-overlap',
  //       renderSubLayers: (props) =>
  //         new BitmapLayer(props, {
  //           data: null,
  //           image: props.data,
  //           bounds: getBoundsForTile(props.tile),
  //           textureParameters: {
  //             [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
  //             [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
  //           },
  //         }),
  //     }),
  // },
]);

function hazardDeckLayer(hazardType, returnPeriod, rcp, epoch, confidence) {
  const id = getHazardId({ hazardType, returnPeriod, rcp, epoch, confidence }); //`hazard_${hazardType}_${returnPeriod}`;

  const magFilter = hazardType === 'cyclone' ? GL.NEAREST : GL.LINEAR;
  const opacity = hazardType === 'cyclone' ? 0.2 : 1;
  // const refinement = hazardType === 'cyclone' ? 'no-overlap' : 'never'

  return {
    id,
    type: 'TileLayer',
    spatialType: 'raster',
    fn: ({ props, zoom, params: { hazardType, returnPeriod, rcp, epoch, confidence } }) =>
      new TileLayer(props, {
        data: `http://localhost:5000/singleband/${hazardType}/${returnPeriod}/${rcp}/${epoch}/${confidence}/{z}/{x}/{y}.png?colormap=${rasterColormaps[hazardType]}&stretch_range=${rasterColormapRanges[hazardType]}`,
        refinementStrategy: 'no-overlap',
        renderSubLayers: (props) =>
          new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: getBoundsForTile(props.tile),
            opacity,
            textureParameters: {
              [GL.TEXTURE_MAG_FILTER]: magFilter,
              // [GL.TEXTURE_MAG_FILTER]: zoom < 12 ? GL.NEAREST : GL.NEAREST_MIPMAP_LINEAR,
            },
          }),
      }),
  };
}
