import { CheckboxTree } from 'lib/controls/checkbox-tree/CheckboxTree';
import { useAtom } from 'jotai';
import { LayerLabel } from 'lib/sidebar/ui/LayerLabel';

import { TERRESTRIAL_LANDUSE_COLORS } from '../colors';
import { LANDUSE_HIERARCHY } from './landuse-hierarchy';
import {
  landuseTreeCheckboxState,
  landuseTreeConfig,
  landuseTreeExpandedState,
} from './landuse-tree';

function getLabel(node, checked) {
  return node.children ? (
    node.label
  ) : (
    <LayerLabel
      label={node.label}
      type="polygon"
      color={TERRESTRIAL_LANDUSE_COLORS[node.id].css}
      visible={checked}
    />
  );
}

export const TerrestrialLandUseTree = () => {
  const [checkboxState, setCheckboxState] = useAtom(landuseTreeCheckboxState);
  const [expanded, setExpanded] = useAtom(landuseTreeExpandedState);

  return (
    <CheckboxTree
      nodes={LANDUSE_HIERARCHY}
      config={landuseTreeConfig}
      getLabel={getLabel}
      checkboxState={checkboxState}
      onCheckboxState={setCheckboxState}
      expanded={expanded}
      onExpanded={setExpanded}
    />
  );
};
