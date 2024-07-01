export const HAZARDS_METADATA = {
  cyclone: {
    label: 'Cyclones',
    dataUnit: 'm/s',
  },
  fluvial: {
    label: 'River Flooding',
    dataUnit: 'm',
  },
  surface: {
    label: 'Surface Flooding',
    dataUnit: 'm',
  },
  coastal: {
    label: 'Coastal Flooding',
    dataUnit: 'm',
  },
};

export const HAZARD_COLOR_MAPS = {
  fluvial: {
    scheme: 'blues',
    range: [0, 10],
  },
  coastal: {
    scheme: 'greens',
    range: [0, 10],
  },
  surface: {
    scheme: 'purples',
    range: [0, 10],
  },
  cyclone: {
    scheme: 'reds',
    range: [0, 75],
  },
};

export const HAZARDS_MAP_ORDER = ['cyclone', 'fluvial', 'surface', 'coastal'];
export const HAZARDS_UI_ORDER = ['fluvial', 'surface', 'coastal', 'cyclone'];
