import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
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

function cancelEvent(e) {
  e.preventDefault();
  return false;
}
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
    <Accordion disableGutters disabled={disabled} expanded={show} onChange={handleShow}>
      <AccordionSummary id={`${htmlId.current}-header`} aria-controls={`${htmlId.current}-details`}>
        <FormControlLabel
          control={<Checkbox checked={show} tabIndex={-1} />}
          label={label}
          onClick={cancelEvent}
        />
      </AccordionSummary>
      <AccordionDetails style={{ display: 'block' }}>{children}</AccordionDetails>
    </Accordion>
  );
};
