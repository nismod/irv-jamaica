import { FormatConfig } from 'lib/data-map/view-layers';
import { numFormat, toDictionary } from 'lib/helpers';
import { DroughtOptionsVariableType, DROUGHT_OPTIONS_VARIABLE_LABELS } from './metadata';

const optionsLabelLookup = toDictionary(
  DROUGHT_OPTIONS_VARIABLE_LABELS,
  (x) => x.value,
  (x) => x.label,
);

const optionsValueFormatLookup: Record<DroughtOptionsVariableType, (x: number) => string> = {
  cost_jmd: (x) => `$${numFormat(x)}`,
  population_protected: (x) => numFormat(x, 21),
  net_present_value_benefit: (x) => `$${numFormat(x)}`,
  benefit_cost_ratio: (x) => `${numFormat(x)}x`,
};

export function getDroughtOptionsDataFormats(): FormatConfig {
  return {
    getDataLabel: (colorField) =>
      optionsLabelLookup[colorField.field as DroughtOptionsVariableType],
    getValueFormatted: (value, { field }) => optionsValueFormatLookup[field](value),
  };
}
