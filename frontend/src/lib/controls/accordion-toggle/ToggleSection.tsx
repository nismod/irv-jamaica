import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import uniqueId from 'lodash/uniqueId';
import { createContext, FC, ReactNode, useContext, useRef } from 'react';
import { useRecoilState } from 'recoil';

import { RecoilStateFamily } from 'lib/recoil/types';

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
  const [show, setShow] = useRecoilState(toggleState(id));
  const handleShow = (e, checked: boolean) => setShow(checked);
  const htmlId = useRef(uniqueId('toggle-section-'));

  return (
    <Accordion disabled={disabled} expanded={show} onChange={handleShow}>
      <AccordionSummary
        id={`${htmlId.current}-header`}
        aria-controls={`${htmlId.current}-details`}
        expandIcon={show ? <Visibility /> : <VisibilityOff />}
      >
        {label}
      </AccordionSummary>
      <AccordionDetails style={{ display: 'block' }}>{children}</AccordionDetails>
    </Accordion>
  );
};
