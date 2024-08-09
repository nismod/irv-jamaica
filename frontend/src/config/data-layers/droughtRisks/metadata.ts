import { ValueLabel } from 'lib/controls/params/value-label';

export const DROUGHT_RISK_VARIABLES = ['mean_monthly_water_stress_', 'epd', 'eael'] as const;

export type DroughtRiskVariableType = (typeof DROUGHT_RISK_VARIABLES)[number];

export const DROUGHT_RISK_VARIABLE_LABELS: ValueLabel<DroughtRiskVariableType>[] = [
  {
    value: 'mean_monthly_water_stress_',
    label: 'Mean Monthly Water Stress',
  },
  {
    value: 'epd',
    label: 'Expected Population Disrupted',
  },
  {
    value: 'eael',
    label: 'Expected Annual Economic Losses (J$/Day)',
  },
];

export const DROUGHT_RISK_VARIABLES_WITH_RCP: DroughtRiskVariableType[] = [
  'mean_monthly_water_stress_',
  'epd',
  'eael',
];
