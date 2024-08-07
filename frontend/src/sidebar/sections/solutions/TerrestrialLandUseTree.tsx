import { TERRESTRIAL_LANDUSE_COLORS } from 'config/data-layers/terrestrial/colors';
import { LANDUSE_HIERARCHY } from 'config/data-layers/terrestrial/landuse-hierarchy';
import { CheckboxTree } from 'lib/controls/checkbox-tree/CheckboxTree';
import { useRecoilState } from 'recoil';
import { LayerLabel } from 'sidebar/ui/LayerLabel';
import {
  landuseTreeCheckboxState,
  landuseTreeConfig,
  landuseTreeExpandedState,
} from 'state/data-selection/solutions/landuse-tree';

export const TerrestrialLandUseTree = () => {
  const [checkboxState, setCheckboxState] = useRecoilState(landuseTreeCheckboxState);
  const [expanded, setExpanded] = useRecoilState(landuseTreeExpandedState);

  return (
    <CheckboxTree
      nodes={LANDUSE_HIERARCHY}
      config={landuseTreeConfig}
      getLabel={(node, checked) =>
        node.children ? (
          node.label
        ) : (
          <LayerLabel
            label={node.label}
            type="polygon"
            color={TERRESTRIAL_LANDUSE_COLORS[node.id].css}
            visible={checked}
          />
        )
      }
      checkboxState={checkboxState}
      onCheckboxState={setCheckboxState}
      expanded={expanded}
      onExpanded={setExpanded}
    />
  );
};
