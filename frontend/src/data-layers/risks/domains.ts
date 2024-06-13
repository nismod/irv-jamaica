import { DataParamGroupConfig } from 'lib/controls/data-params';

export interface RiskParams {
  hazard: string;
  returnPeriod: number;
  epoch: number;
  rcp: string;
  confidence: string | number;
}

/*
  Default parameter ranges for each hazard type.
  These are used to define ranges for input controls in the sidebar.
*/
const hazardParamDomains = {
  none: {
    returnPeriod: [0],
    epoch: [2010],
    rcp: ['baseline'],
    confidence: ['None'],
  },
  cyclone: {
    returnPeriod: [0],
    epoch: [2010],
    rcp: ['baseline'],
    confidence: ['None'],
  },
  fluvial: {
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
    hazard: ['none', 'cyclone', 'fluvial'],
    returnPeriod: [0],
    epoch: [2010],
    rcp: ['baseline'],
    confidence: ['None'],
  },
  /*
    Default parameter values for each risk type.
  */
  paramDefaults: {
    hazard: 'none',
    returnPeriod: 0,
    epoch: 2010,
    rcp: 'baseline',
    confidence: 'None',
  },
  /*
    Callback functions to define custom parameter ranges based on selected hazard etc.
  */
  paramDependencies: {
    rcp: ({ hazard }) => hazardParamDomains[hazard].rcp,
    epoch: ({ hazard }) => hazardParamDomains[hazard].epoch,
    returnPeriod: ({ hazard }) => hazardParamDomains[hazard].returnPeriod,
    confidence: ({ hazard }) => hazardParamDomains[hazard].confidence,
  },
};
