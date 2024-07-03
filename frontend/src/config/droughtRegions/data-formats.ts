import { FormatConfig } from 'lib/data-map/view-layers';
import { numFormat, toDictionary } from 'lib/helpers';
import { DroughtRiskVariableType, DROUGHT_RISK_VARIABLE_LABELS } from './metadata';

const riskLabelLookup = toDictionary(
  DROUGHT_RISK_VARIABLE_LABELS,
  (x) => x.value,
  (x) => x.label,
);

const riskValueFormatLookup: Record<DroughtRiskVariableType, (x: number) => string> = {
  mean_monthly_water_stress_: (x) => numFormat(x),
  epd: (x) => numFormat(x),
  eael: (x) => `$${numFormat(x)}`,
};

export function getDroughtRiskDataFormats(): FormatConfig {
  return {
    getDataLabel: (colorField) => riskLabelLookup[colorField.field as DroughtRiskVariableType],
    getValueFormatted: (value, { field }) => riskValueFormatLookup[field](value),
  };
}
