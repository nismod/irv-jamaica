import { atom, noWait, RecoilState, RecoilValueReadOnly, selector, selectorFamily } from 'recoil';

const epochs = [2010, 2050, 2070, 2080, 2100];
const parameters = epochs.flatMap((epoch) =>
  epoch === 2010
    ? {
        epoch,
        rcp: 'baseline',
      }
    : [
        { epoch, rcp: '2.6' },
        { epoch, rcp: '4.5' },
        { epoch, rcp: '8.5' },
      ],
);

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
export const pixelSelectionState: RecoilState<PixelDrillerQueryParams> = atom({
  key: 'pixelSelection',
  default: { lat: 0, lon: 0 },
});

/**
 * Query to fetch hazard data for the selected map pixel.
 */
const pixelDrillerQuery: RecoilValueReadOnly<PixelData> = selector({
  key: 'pixelDrillerQuery',
  get: async ({ get }) => {
    const { lat, lon } = get(pixelSelectionState);
    const key = `${lat.toFixed(3)}-${lon.toFixed(3)}`;
    if (dataCache.has(key)) {
      return dataCache.get(key);
    }
    const response = await fetch(`/pixel/${lon.toFixed(3)}/${lat.toFixed(3)}`);
    const data: PixelData = await response.json();
    dataCache.set(key, data);
    return data;
  },
});

/**
 * Loadable state for the current pixel driller data.
 */
export const pixelDrillerDataState: RecoilValueReadOnly<{ data: PixelData; error: Error }> =
  selector({
    key: 'pixelDrillerDataState',
    get: ({ get }) => {
      const loadable = get(noWait(pixelDrillerQuery));
      const data = loadable.state === 'hasValue' ? loadable.contents : null;
      const error = loadable.state === 'hasError' ? loadable.contents : null;
      return { data, error };
    },
  });

/**
 * Column headers for the pixel driller data tables.
 */
export const pixelDrillerDataHeaders: RecoilValueReadOnly<string[]> = selector({
  key: 'pixelDrillerDataHeaders',
  get: ({ get }) => {
    const pixelData = get(pixelDrillerDataState).data;
    if (!pixelData) {
      return [];
    }
    const headers = Object.keys(pixelData);
    return headers;
  },
});

/**
 * Set of return periods for a given hazard.
 */
export const pixelDrillerDataRPs: (hazard: string) => RecoilValueReadOnly<Set<number>> =
  selectorFamily({
    key: 'pixelDrillerDataRPs',
    get:
      (hazard: string) =>
      ({ get }) => {
        const pixelData = get(pixelDrillerDataState).data;
        if (!pixelData) {
          return new Set();
        }
        const data = getFilteredPixelData(pixelData, hazard);
        return new Set(data.map((d) => d.rp));
      },
  });

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
 * @returns
 */
function reducePixelDataRow(data: Row[], hazard: string, epoch: number, rcp: string): Row {
  if (!data.length) {
    return null;
  }
  const { variable, unit } = data[0];
  const row = {
    id: `${hazard}-${epoch}-${rcp}`,
    variable,
    unit,
    hazard,
    epoch,
    rcp,
  };
  data.forEach((d) => {
    row[`rp-${d.rp}`] = d.band_data?.toFixed(2);
  });
  return row;
}

/**
 * Rows of pixel driller data for a specific hazard, epoch, RCP, and confidence level.
 */
export const pixelDrillerDataRows: (hazard: string) => RecoilValueReadOnly<Row[]> = selectorFamily({
  key: 'pixelDrillerDataRows',
  get:
    (hazard: string) =>
    ({ get }) => {
      const pixelData = get(pixelDrillerDataState).data;
      return parameters
        .map(({ epoch, rcp }) => {
          const confidence = hazard === 'cyclone' ? 95 : null;
          const data = getFilteredPixelData(pixelData, hazard, epoch, rcp, confidence);
          return reducePixelDataRow(data, hazard, epoch, rcp);
        })
        .filter(Boolean);
    },
});
