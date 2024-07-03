import { ValueLabel } from 'lib/controls/params/value-label';

export const DROUGHT_OPTIONS_VARIABLES = [
  'cost_jmd',
  'population_protected',
  'net_present_value_benefit',
  'benefit_cost_ratio',
] as const;

export type DroughtOptionsVariableType = (typeof DROUGHT_OPTIONS_VARIABLES)[number];

export const DROUGHT_OPTIONS_VARIABLE_LABELS: ValueLabel<DroughtOptionsVariableType>[] = [
  {
    value: 'cost_jmd',
    label: 'Cost (J$)',
  },
  {
    value: 'population_protected',
    label: 'Population Protected',
  },
  {
    value: 'net_present_value_benefit',
    label: 'Benefit (J$)',
  },
  {
    value: 'benefit_cost_ratio',
    label: 'Benefit-Cost Ratio',
  },
];

export const DROUGHT_OPTIONS_VARIABLES_WITH_RCP: DroughtOptionsVariableType[] = [
  'net_present_value_benefit',
  'benefit_cost_ratio',
];
