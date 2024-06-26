import { useCallback } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view';
import { produce } from 'immer';

import { dfs, getDescendants, TreeNode } from './tree-node';
import { CheckboxTreeItem } from './CheckboxTreeItem';

export interface CheckboxTreeConfig<T> {
  roots: TreeNode<T>[];
  nodes: {
    [nodeId: string]: TreeNode<T> & {
      descendantIds: string[];
    };
  };
}

export function buildTreeConfig<T>(nodes: TreeNode<T>[]): CheckboxTreeConfig<T> {
  const config: CheckboxTreeConfig<T> = {
    roots: nodes,
    nodes: {},
  };

  nodes.forEach((node) => {
    dfs(node, (node) => {
      config.nodes[node.id] = {
        ...node,
        descendantIds: getDescendants(node),
      };
    });
  });
  return config;
}

export interface CheckboxTreeState {
  checked: { [nodeId: string]: boolean };
  indeterminate: { [nodeId: string]: boolean };
}

export function recalculateCheckboxStates<T>(
  state: CheckboxTreeState,
  config: CheckboxTreeConfig<T>,
): CheckboxTreeState {
  for (const root of config.roots) {
    // traverse each root tree in post-order to recalculate state starting from leaf nodes
    dfs(
      root,
      (node) => {
        const nodeChildren = config.nodes[node.id].children;
        if (nodeChildren) {
          const checked = nodeChildren.every((child) => state.checked[child.id]);
          const indeterminate =
            !checked &&
            nodeChildren.some((child) => state.checked[child.id] || state.indeterminate[child.id]);
          state.checked[node.id] = checked;
          state.indeterminate[node.id] = indeterminate;
        }
      },
      false,
      'post',
    );
  }

  return state;
}

export function CheckboxTree<T>({
  nodes,
  config,
  getLabel,
  checkboxState,
  onCheckboxState,
  expanded,
  onExpanded,
  disableCheck = false,
}: {
  config: CheckboxTreeConfig<T>;
  nodes: TreeNode<T>[];
  getLabel: (node: TreeNode<T>, checked: boolean) => string | JSX.Element;
  checkboxState: CheckboxTreeState;
  onCheckboxState: (state: CheckboxTreeState) => void;
  expanded: string[];
  onExpanded: (expanded: string[]) => void;
  disableCheck?: boolean;
}) {
  const handleChange = useCallback(
    (checked: boolean, node: TreeNode<T>) => {
      const descendants: string[] = config.nodes[node.id].descendantIds;
      onCheckboxState(
        produce(checkboxState, (draft) => {
          draft.checked[node.id] = checked;
          descendants.forEach((n) => (draft.checked[n] = checked));

          return recalculateCheckboxStates(draft, config);
        }),
      );
    },
    [checkboxState, config, onCheckboxState],
  );

  return (
    <>
      <SimpleTreeView
        expandedItems={expanded}
        onExpandedItemsChange={(e, nodeIds) => onExpanded(nodeIds)}
        multiSelect
        selectedItems={Object.keys(checkboxState.checked).filter((id) => checkboxState.checked[id])}
      >
        {nodes.map((node) => (
          <CheckboxTreeItem
            key={node.id}
            root={node}
            checkboxState={checkboxState}
            handleChange={handleChange}
            getLabel={getLabel}
            disableCheck={disableCheck}
          />
        ))}
      </SimpleTreeView>
    </>
  );
}
