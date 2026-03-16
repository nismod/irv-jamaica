import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';
import { useAtom } from 'jotai';

import { sectionVisibilityState, sidebarSectionExpandedState } from 'lib/state/sections';

type AtomSetter<T> = (value: T | ((prev: T) => T)) => void;

export const VisibilityToggle = ({ id }) => {
  const [visibility, setVisibility] = useAtom(sectionVisibilityState(id) as never) as [
    boolean,
    AtomSetter<boolean>,
  ];
  const [, setExpanded] = useAtom(sidebarSectionExpandedState(id) as never) as [
    boolean,
    AtomSetter<boolean>,
  ];

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
