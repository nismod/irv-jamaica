import { FieldSpec } from 'lib/data-map/view-layers';
import { featureProperty } from 'lib/deck/props/data-source';
import { Accessor } from 'lib/deck/props/getters';

export function getSolutionsDataAccessor(fieldSpec: FieldSpec): Accessor<string> {
  return fieldSpec && featureProperty(fieldSpec.field);
}
