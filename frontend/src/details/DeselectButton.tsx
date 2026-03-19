import Close from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { selectionState } from 'lib/state/interactions/interaction-state';
import { useResetAtom } from 'jotai/utils';

export const DeselectButton = ({ interactionGroup, title }) => {
  const clearSelection = useResetAtom(selectionState(interactionGroup));

  return (
    <IconButton onClick={() => clearSelection()} title={title}>
      <Close />
    </IconButton>
  );
};
