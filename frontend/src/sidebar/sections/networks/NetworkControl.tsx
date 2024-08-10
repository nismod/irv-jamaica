import { Box } from '@mui/system';
import { Alert } from '@mui/material';
import { FC } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  networkTreeCheckboxState,
  networkTreeConfig,
  networkTreeExpandedState,
} from 'data-layers/networks/data-selection';
import { NETWORK_LAYERS_HIERARCHY } from 'data-layers/networks/hierarchy';
import { NETWORKS_METADATA } from 'data-layers/networks/metadata';
import { showAdaptationsState } from 'data-layers/networks/state';
import { CheckboxTree } from 'lib/controls/checkbox-tree/CheckboxTree';
import { LayerLabel } from 'sidebar/ui/LayerLabel';

export const NetworkControl: FC = () => {
  const [checkboxState, setCheckboxState] = useRecoilState(networkTreeCheckboxState);
  const [expanded, setExpanded] = useRecoilState(networkTreeExpandedState);

  const showAdaptations = useRecoilValue(showAdaptationsState);
  const disableCheck = showAdaptations;

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
        getLabel={(node, checked) =>
          node.children ? (
            node.label
          ) : (
            <LayerLabel {...NETWORKS_METADATA[node.id]} label={node.label} visible={checked} />
          )
        }
        checkboxState={checkboxState}
        onCheckboxState={setCheckboxState}
        expanded={expanded}
        onExpanded={setExpanded}
        disableCheck={disableCheck}
      />
    </>
  );
};
