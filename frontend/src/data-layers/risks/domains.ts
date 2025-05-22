import { DataParamGroupConfig } from 'lib/controls/data-params';

export interface RiskParams {
  sector: string;
  returnPeriod: number;
  epoch: number;
  rcp: string;
  confidence: string | number;
}

export const sectorRiskTypes = {
  power: ['demandAffected', 'exposureValue', 'populationAffected', 'lossGdp'],
  water: ['exposureValue'],
  transport: ['exposureValue'],
  all: ['exposureValue'],
};

/*
  Default parameter ranges for each hazard type.
  These are used to define ranges for input controls in the sidebar.
*/
const sectorParamDomains = {
  power: {
    returnPeriod: [0],
    epoch: [2010],
    rcp: ['baseline'],
    confidence: ['None'],
  },
  transport: {
    returnPeriod: [0],
    epoch: [2010],
    rcp: ['baseline'],
    confidence: ['None'],
  },
  water: {
    returnPeriod: [0],
    epoch: [2010],
    rcp: ['baseline'],
    confidence: ['None'],
  },
  all: {
    returnPeriod: [0],
    epoch: [2010],
    rcp: ['baseline'],
    confidence: ['None'],
  },
};

export const RISK_DOMAINS: DataParamGroupConfig<RiskParams> = {
  /*
    Default parameter ranges for each risk type.
  */
  paramDomains: {
    sector: ['power', 'transport', 'water', 'all'],
    returnPeriod: [0],
    epoch: [2010],
    rcp: ['baseline'],
    confidence: ['None'],
  },
  /*
    Default parameter values for each risk type.
  */
  paramDefaults: {
    sector: 'all',
    returnPeriod: 0,
    epoch: 2010,
    rcp: 'baseline',
    confidence: 'None',
  },
  /*
    Callback functions to define custom parameter ranges based on selected hazard etc.
  */
  paramDependencies: {
    rcp: ({ sector }) => sectorParamDomains[sector].rcp,
    epoch: ({ sector }) => sectorParamDomains[sector].epoch,
    returnPeriod: ({ sector }) => sectorParamDomains[sector].returnPeriod,
    confidence: ({ sector }) => sectorParamDomains[sector].confidence,
  },
};
