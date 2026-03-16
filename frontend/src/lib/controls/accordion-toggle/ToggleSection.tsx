import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createContext, FC, ReactNode, useContext, useId } from 'react';
import { useAtom } from 'jotai';

import { RecoilStateFamily } from 'lib/recoil/types';

type AtomSetter<T> = (value: T | ((prev: T) => T)) => void;

export const ToggleStateContext = createContext<RecoilStateFamily<boolean, string>>(null);

export const ToggleSectionGroup: FC<{
  children: ReactNode;
  toggleState: RecoilStateFamily<boolean, string>;
}> = ({ children, toggleState }) => {
  return <ToggleStateContext.Provider value={toggleState}>{children}</ToggleStateContext.Provider>;
};

interface ToggleSectionProps {
  id: string;
  label: string;
  disabled?: boolean;
  children: ReactNode;
}

export const ToggleSection: FC<ToggleSectionProps> = ({
  id,
  label,
  disabled = false,
  children,
}) => {
  const toggleState = useContext(ToggleStateContext);
  const [show, setShow] = useAtom(toggleState(id) as never) as [boolean, AtomSetter<boolean>];
  const handleShow = (e, checked: boolean) => setShow(checked);
  const htmlId = useId();

  return (
    <Accordion disabled={disabled} expanded={show} onChange={handleShow}>
      <AccordionSummary
        id={`${htmlId}-header`}
        aria-controls={`${htmlId}-details`}
        expandIcon={show ? <Visibility /> : <VisibilityOff />}
      >
        {label}
      </AccordionSummary>
      <AccordionDetails style={{ display: 'block' }}>{children}</AccordionDetails>
    </Accordion>
  );
};
