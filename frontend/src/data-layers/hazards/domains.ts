import { DataParamGroupConfig } from 'lib/controls/data-params';

export interface HazardParams {
  returnPeriod: number;
  epoch: number;
  rcp: string;
  confidence: string | number;
  speed?: number;
}

export const HAZARD_DOMAINS: Record<string, DataParamGroupConfig<HazardParams>> = {
  fluvial: {
    paramDomains: {
      returnPeriod: [20, 50, 100, 200, 500, 1500],

      rcp: ['baseline', '2.6', '4.5', '8.5'],
      epoch: [2010, 2050, 2080],
      confidence: ['None'],
    },
    paramDefaults: {
      returnPeriod: 100,

      rcp: 'baseline',
      epoch: 2010,
      confidence: 'None',
    },
    paramDependencies: {
      rcp: ({ epoch }) => {
        if (epoch === 2010) return ['baseline'];
        else if (epoch === 2050 || epoch === 2080) return ['2.6', '4.5', '8.5'];
      },
    },
  },
  surface: {
    paramDomains: {
      returnPeriod: [20, 50, 100, 200, 500, 1500],

      rcp: ['baseline', '2.6', '4.5', '8.5'],
      epoch: [2010, 2050, 2080],
      confidence: ['None'],
    },
    paramDefaults: {
      returnPeriod: 100,

      rcp: 'baseline',
      epoch: 2010,
      confidence: 'None',
    },
    paramDependencies: {
      rcp: ({ epoch }) => {
        if (epoch === 2010) return ['baseline'];
        else if (epoch === 2050 || epoch === 2080) return ['2.6', '4.5', '8.5'];
      },
    },
  },
  coastal: {
    paramDomains: {
      returnPeriod: [1, 2, 5, 10, 50, 100],
      epoch: [2010, 2030, 2050, 2070, 2100],
      rcp: ['baseline', '2.6', '4.5', '8.5'],

      confidence: ['None'],
    },
    paramDefaults: {
      returnPeriod: 100,
      epoch: 2010,
      rcp: 'baseline',

      confidence: 'None',
    },
    paramDependencies: {
      rcp: ({ epoch }) => {
        if (epoch === 2010) return ['baseline'];
        if (epoch === 2050 || epoch === 2100) return ['2.6', '4.5', '8.5'];
        if (epoch === 2030 || epoch === 2070) return ['4.5', '8.5'];
      },
    },
  },
  cyclone: {
    paramDomains: {
      returnPeriod: [
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000,
        3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
      ],
      epoch: [2010, 2050, 2100],
      rcp: ['baseline', '4.5', '8.5'],
      confidence: [5, 50, 95],
    },
    paramDefaults: {
      returnPeriod: 100,
      epoch: 2010,
      rcp: 'baseline',
      confidence: 50,
    },
    paramDependencies: {
      rcp: ({ epoch }) => {
        if (epoch === 2010) return ['baseline'];
        if (epoch === 2050 || epoch === 2100) return ['4.5', '8.5'];
      },
    },
  },
  storm: {
    paramDomains: {
      returnPeriod: [0],
      epoch: [2010, 2050],
      rcp: ['baseline', '4.5', '8.5'],
      confidence: ['None'],
      speed: [20, 25, 29, 30, 35, 37, 40, 43, 45, 50, 51, 55, 60, 61, 65, 70],
    },
    paramDefaults: {
      returnPeriod: 0,
      epoch: 2010,
      rcp: 'baseline',
      confidence: 'None',
      speed: 30,
    },
    paramDependencies: {
      rcp: ({ epoch }) => {
        if (epoch === 2010) return ['baseline'];
        if (epoch === 2050) return ['8.5'];
      },
      returnPeriod: () => [0],
    },
  },
};
