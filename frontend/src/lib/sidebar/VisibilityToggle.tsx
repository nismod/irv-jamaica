import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';
import { useAtom } from 'jotai';

import { sectionVisibilityState, sidebarSectionExpandedState } from 'lib/state/sections';

export const VisibilityToggle = ({ id }) => {
  const [visibility, setVisibility] = useAtom(sectionVisibilityState(id));
  const [, setExpanded] = useAtom(sidebarSectionExpandedState(id));

  function handleClick(e) {
    setVisibility(!visibility);
    setExpanded(!visibility);
    e.stopPropagation();
  }

  return (
    <IconButton title={visibility ? 'Hide layer' : 'Show layer'} onClick={handleClick}>
      {visibility ? <Visibility /> : <VisibilityOff />}
    </IconButton>
  );
};
