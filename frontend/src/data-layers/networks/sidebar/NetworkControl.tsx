import { Box } from '@mui/system';
import { Alert } from '@mui/material';
import { FC } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { CheckboxTree, recalculateCheckboxStates } from 'lib/controls/checkbox-tree/CheckboxTree';
import { useUpdateDataParam } from 'lib/state/data-params';

import { LayerLabel } from 'lib/sidebar/ui/LayerLabel';

import {
  networkTreeCheckboxState,
  networkTreeConfig,
  networkTreeExpandedState,
} from '../state/data-selection';
import { NETWORK_LAYERS_HIERARCHY } from './hierarchy';
import { NETWORKS_METADATA } from '../metadata';
import { showAdaptationsState } from '../state/layer';
import adaptationSectorLayers from '../adaptation-sector-layers.json';
import { protectedFeatureLayersState } from 'lib/state/protected-features';

/**
 * Set the checkbox tree state to true for protected feature layers.
 * @param checkBoxState network checkbox tree state.
 */
function useSyncProtectedFeatureLayers(checkboxState) {
  const protectedFeatureLayers = useRecoilValue(protectedFeatureLayersState);
  const setCheckboxState = useSetRecoilState(networkTreeCheckboxState);
  protectedFeatureLayers.forEach((layer: string) => {
    if (!checkboxState.checked[layer]) {
      setCheckboxState((prev) => {
        const newState = {
          indeterminate: {},
          checked: {
            ...prev.checked,
            [layer]: true,
          },
        };
        const resolvedTreeState = recalculateCheckboxStates(newState, networkTreeConfig);
        return resolvedTreeState;
      });
    }
  });
}

/**
 * Sync adaptation parameters to the infrastructure checkbox tree, so that
 * selected adaptation sector etc. change when the selected infrastructure
 * layers change.
 * @param checkboxState infrastructure checkbox tree state.
 */
function useSyncAdaptationParameters(checkboxState) {
  const updateSector = useUpdateDataParam('adaptation', 'sector');
  const updateSubsector = useUpdateDataParam('adaptation', 'subsector');
  const updateAssetType = useUpdateDataParam('adaptation', 'asset_type');
  const selectedLayers = Object.keys(checkboxState.checked).filter(
    (id) => checkboxState.checked[id] && networkTreeConfig.nodes[id] && !networkTreeConfig.nodes[id].children,
  );
  const adaptationLayer = adaptationSectorLayers.find((x) => selectedLayers.includes(x.layer_name));
  if (adaptationLayer) {
    const { sector, subsector, asset_type } = adaptationLayer;
    updateSector(sector);
    updateSubsector(subsector);
    updateAssetType(asset_type);
  }
}

function getLabel(node, checked) {
  return node.children ? (
    node.label
  ) : (
    <LayerLabel {...NETWORKS_METADATA[node.id]} label={node.label} visible={checked} />
  );
}

export const NetworkControl: FC = () => {
  const [checkboxState, setCheckboxState] = useRecoilState(networkTreeCheckboxState);
  const [expanded, setExpanded] = useRecoilState(networkTreeExpandedState);

  const showAdaptations = useRecoilValue(showAdaptationsState);
  const disableCheck = showAdaptations;

  useSyncAdaptationParameters(checkboxState);
  useSyncProtectedFeatureLayers(checkboxState);

  return (
    <>
      {showAdaptations ? (
        <Box my={1}>
          <Alert severity="info">
            Infrastructure layers are currently following the Adaptation Options selection
          </Alert>
        </Box>
      ) : null}
      <CheckboxTree
        nodes={NETWORK_LAYERS_HIERARCHY}
        config={networkTreeConfig}
        getLabel={getLabel}
        checkboxState={checkboxState}
        onCheckboxState={setCheckboxState}
        expanded={expanded}
        onExpanded={setExpanded}
        disableCheck={disableCheck}
      />
    </>
  );
};
