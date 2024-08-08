import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useRecoilState } from 'recoil';
import { sectionVisibilityState, sidebarSectionExpandedState } from 'state/sections';

export const VisibilityToggle = ({ id }) => {
  const [visibility, setVisibility] = useRecoilState(sectionVisibilityState(id));
  const [expanded, setExpanded] = useRecoilState(sidebarSectionExpandedState(id));

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
