import { Atom, atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { unwrap } from 'jotai/utils';
import { atomWithStoredJson } from './map-view/map-url';

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

type LayerParam = {
  epoch: number;
  rcp: string;
  confidence?: number;
};

const dataCache = new Map<string, PixelData>();

type MapLocation = {
  lat: number;
  lon: number;
};

/**
 * Latitude and longitude of the selected map pixel.
 */
export const pixelSelectionState = atomWithStoredJson<MapLocation | null>(
  'site',
  null as MapLocation | null,
);

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
    return dataCache.get(key) ?? null;
  }
  const response = await fetch(`/pixel/${lon.toFixed(3)}/${lat.toFixed(3)}`);
  const data: PixelData = await response.json();
  dataCache.set(key, data);
  return data;
});

/**
 * Loadable state for the current pixel driller data.
 */
export const pixelDrillerDataState: Atom<PixelData | null> = unwrap(
  pixelDrillerQuery,
  (prev) => prev ?? null,
);

/**
 * Column headers for the pixel driller data tables.
 */
export const pixelDrillerDataHeaders: Atom<string[]> = atom((get) => {
  const pixelData = get(pixelDrillerDataState);
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
      const pixelData = get(pixelDrillerDataState);
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
): Row | null {
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

type PixelDrillerRowsKey = {
  pixel_layer: string;
  layerParams: LayerParam[];
  _serialized?: string;
};

function createPixelDrillerRowsKey(
  pixel_layer: string,
  layerParams: LayerParam[],
): PixelDrillerRowsKey {
  const serialized = layerParams
    .map(({ epoch, rcp, confidence }) => `${epoch}|${rcp}|${confidence ?? 'none'}`)
    .join(',');
  return { pixel_layer, layerParams, _serialized: serialized };
}

/**
 * Rows of pixel driller data for a specific pixel_layer, grouped by epoch, RCP, and confidence level.
 */
export const pixelDrillerDataRows = ({
  pixel_layer,
  layerParams,
}: PixelDrillerRowsKey): Atom<Row[]> => {
  const key = createPixelDrillerRowsKey(pixel_layer, layerParams);
  return pixelDrillerDataRowsFamily(key);
};

const pixelDrillerDataRowsFamily = atomFamily(
  ({ pixel_layer, layerParams }: PixelDrillerRowsKey) =>
    atom((get) => {
      const pixelData = get(pixelDrillerDataState);
      if (!pixelData) {
        return [];
      }
      return layerParams
        .map(({ epoch, rcp, confidence }) => {
          const data = getFilteredPixelData(pixelData, pixel_layer, epoch, rcp, confidence);
          const reduced = reducePixelDataRow(data, pixel_layer, epoch, rcp, confidence);
          return reduced;
        })
        .filter((row): row is Row => row !== null);
    }),
  (a, b) => a.pixel_layer === b.pixel_layer && a._serialized === b._serialized,
);
