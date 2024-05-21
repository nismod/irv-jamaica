import { TreeItem } from '@mui/x-tree-view';
import { Box, Checkbox } from '@mui/material';

import { CheckboxTreeState } from './CheckboxTree';
import { TreeNode } from './tree-node';

function handleClick(e) {
  e.stopPropagation();
  return true;
}

export function CheckboxTreeItem<T>({
  root,
  handleChange,
  checkboxState,
  getLabel,
  disableCheck = false,
}: {
  root: TreeNode<T>;
  handleChange: (checked: boolean, node: TreeNode<T>) => void;
  checkboxState: CheckboxTreeState;
  getLabel: (node: TreeNode<T>, checked: boolean) => any;
  disableCheck?: boolean;
}) {
  const indeterminate = checkboxState.indeterminate[root.id];
  const checked = indeterminate || checkboxState.checked[root.id];

  function handleCheckboxChange(event) {
    handleChange(event.currentTarget.checked, root);
  }

  function handleItemKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleChange(!checked, root);
      event.stopPropagation();
    }
  }

  const checkedState = indeterminate
    ? 'mixed'
    : checked
      ? 'true'
      : 'false'
  return (
    <TreeItem
      aria-checked={checkedState}
      key={root.id}
      itemId={root.id}
      onKeyDown={handleItemKeyDown}
      label={
        <Box display="flex" alignItems="center" width="100%">
          <Checkbox
            checked={checked}
            indeterminate={indeterminate}
            onChange={handleCheckboxChange}
            onClick={handleClick}
            disabled={disableCheck}
          />
          <Box flexGrow={1}>{getLabel(root, checked)}</Box>
        </Box>
      }
    >
      {root.children?.map((node) => (
        <CheckboxTreeItem
          key={node.id}
          root={node}
          handleChange={handleChange}
          checkboxState={checkboxState}
          getLabel={getLabel}
          disableCheck={disableCheck}
        ></CheckboxTreeItem>
      ))}
    </TreeItem>
  );
}
