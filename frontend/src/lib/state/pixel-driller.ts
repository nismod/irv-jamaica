import { Atom, WritableAtom, atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { loadable } from 'jotai/utils';

const FLOOD_PARAMETERS = [
  { epoch: 2010, rcp: 'baseline' },
  { epoch: 2050, rcp: '2.6' },
  { epoch: 2050, rcp: '4.5' },
  { epoch: 2050, rcp: '8.5' },
  { epoch: 2080, rcp: '2.6' },
  { epoch: 2080, rcp: '4.5' },
  { epoch: 2080, rcp: '8.5' },
];

const COASTAL_FLOOD_PARAMETERS = [
  { epoch: 2010, rcp: 'baseline' },
  { epoch: 2030, rcp: '4.5' },
  { epoch: 2030, rcp: '8.5' },
  { epoch: 2050, rcp: '4.5' },
  { epoch: 2050, rcp: '8.5' },
  { epoch: 2070, rcp: '4.5' },
  { epoch: 2070, rcp: '8.5' },
  { epoch: 2100, rcp: '4.5' },
  { epoch: 2100, rcp: '8.5' },
];

// confidence 5 and 50 also available in data
const CYCLONE_PARAMETERS = [
  { confidence: 95, epoch: 2010, rcp: 'baseline' },
  { confidence: 95, epoch: 2050, rcp: '4.5' },
  { confidence: 95, epoch: 2050, rcp: '8.5' },
  { confidence: 95, epoch: 2100, rcp: '4.5' },
  { confidence: 95, epoch: 2100, rcp: '8.5' },
];

const PIXEL_LAYER_PARAMETERS = {
  cyclone: CYCLONE_PARAMETERS,
  fluvial: FLOOD_PARAMETERS,
  surface: FLOOD_PARAMETERS,
  coastal: COASTAL_FLOOD_PARAMETERS,
  elevation: [{ epoch: undefined, rcp: undefined }],
  slope: [{ epoch: undefined, rcp: undefined }],
};

type PixelDrillerQueryParams = {
  lat: number;
  lon: number;
};

type PixelData = {
  band_data: number[];
  confidence: number[];
  epoch: number[];
  hazard: string[];
  key: string[];
  rcp: string[];
  rp: number[];
  unit: string[];
  variable: string[];
};

type Row = {
  id: number | string;
  band_data?: number;
  confidence?: number;
  epoch: number;
  hazard: string;
  key?: string;
  rcp: string;
  rp?: number;
  unit: string;
  variable: string;
};

const dataCache = new Map<string, PixelData>();

/**
 * Latitude and longitude of the selected map pixel.
 */
export const pixelSelectionState: WritableAtom<PixelDrillerQueryParams | null, unknown[], void> =
  atom({
    lat: 0,
    lon: 0,
  });

/**
 * Query to fetch hazard data for the selected map pixel.
 */
const pixelDrillerQuery: Atom<Promise<PixelData | null>> = atom(async (get) => {
  const pixelSelection = get(pixelSelectionState);
  if (!pixelSelection) {
    return Promise.resolve(null);
  }
  const { lat, lon } = pixelSelection;
  const key = `${lat.toFixed(3)}-${lon.toFixed(3)}`;
  if (dataCache.has(key)) {
    return dataCache.get(key);
  }
  const response = await fetch(`/pixel/${lon.toFixed(3)}/${lat.toFixed(3)}`);
  const data: PixelData = await response.json();
  dataCache.set(key, data);
  return data;
});

/**
 * Loadable state for the current pixel driller data.
 */
export const pixelDrillerDataState: Atom<{ data: PixelData | null; error: Error | null }> = atom(
  (get) => {
    const l = get(loadable(pixelDrillerQuery));
    const data = l?.state === 'hasData' ? l.data : null;
    const error = l?.state === 'hasError' ? (l.error as Error) : null;
    return { data, error };
  },
);

/**
 * Column headers for the pixel driller data tables.
 */
export const pixelDrillerDataHeaders: Atom<string[]> = atom((get) => {
  const pixelData = get(pixelDrillerDataState).data;
  if (!pixelData) {
    return [];
  }
  const headers = Object.keys(pixelData);
  return headers;
});

/**
 * Set of return periods for a given hazard.
 */
export const pixelDrillerDataRPs: (hazard: string) => Atom<Set<number>> = atomFamily(
  (hazard: string) =>
    atom((get) => {
      const pixelData = get(pixelDrillerDataState).data;
      if (!pixelData) {
        return new Set<number>();
      }
      const data = getFilteredPixelData(pixelData, hazard);
      return new Set(data.map((d) => d.rp));
    }),
);

/**
 * Map a collection of data arrays to a single array of row objects.
 * @param data
 * @returns
 */
function mapDataArraysToRowObjects(data: PixelData): Row[] {
  const keys = Object.keys(data);
  return data[keys[0]].map((_, rowNumber) => {
    const row = { id: rowNumber };
    keys.forEach((key) => {
      row[key] = data[key][rowNumber];
    });
    return row;
  });
}

/**
 * Filter pixel data by hazard, epoch, RCP, and confidence level.
 * @param pixelData
 * @param headers
 * @param hazard
 * @param epoch
 * @param rcp
 * @param confidence
 * @returns
 */
function getFilteredPixelData(
  pixelData: PixelData,
  hazard: string,
  epoch?: number,
  rcp?: string,
  confidence?: number,
): Row[] {
  const rows: Row[] = mapDataArraysToRowObjects(pixelData)
    .filter((row) => row.hazard === hazard)
    .filter((row) => {
      if (rcp && epoch) {
        if (confidence) {
          return row.rcp === rcp && row.epoch === epoch && row.confidence === confidence;
        }
        return row.rcp === rcp && row.epoch === epoch;
      }
      return true;
    });
  return rows;
}

/**
 * Reduce a set of data rows down to a single row with multiple RP columns.
 * @param data
 * @param hazard
 * @param epoch
 * @param rcp
 * @param confidence
 * @returns
 */
function reducePixelDataRow(
  data: Row[],
  hazard: string,
  epoch: number,
  rcp: string,
  confidence?: number,
): Row {
  if (!data.length) {
    return null;
  }
  const { variable, unit } = data[0];
  rcp = rcp === 'baseline' ? '-' : rcp;
  const row = {
    id: `${hazard}-${epoch}-${rcp}-${confidence}`,
    variable,
    unit,
    hazard,
    epoch,
    rcp,
    confidence,
  };
  data.forEach((d) => {
    const value = d.band_data || 0;
    row[`rp-${d.rp}`] = value > 0.005 ? value.toFixed(2) : '-';
  });
  return row;
}

/**
 * Rows of pixel driller data for a specific pixel_layer, grouped by epoch, RCP, and confidence level.
 */
export const pixelDrillerDataRows: (pixel_layer: string) => Atom<Row[]> = atomFamily(
  (pixel_layer: string) =>
    atom((get) => {
      const pixelData = get(pixelDrillerDataState).data;
      if (!pixelData) {
        return [];
      }
      return PIXEL_LAYER_PARAMETERS[pixel_layer]
        .map(({ epoch, rcp, confidence }) => {
          const data = getFilteredPixelData(pixelData, pixel_layer, epoch, rcp, confidence);
          const reduced = reducePixelDataRow(data, pixel_layer, epoch, rcp, confidence);
          return reduced;
        })
        .filter(Boolean);
    }),
);
