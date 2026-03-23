import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, SyntheticEvent, ReactNode } from 'react';
import {
  hazardAccordionExpandedState,
  openAccordionState,
  SINGLE_ACCORDION_MODE,
} from './accordion-state';

interface HazardAccordionProps {
  title: string;
  children: ReactNode;
}

export function HazardAccordion({ title, children }: HazardAccordionProps) {
  const [individualExpanded, setIndividualExpanded] = useAtom(hazardAccordionExpandedState(title));
  const openAccordion = useAtomValue(openAccordionState);
  const setOpenAccordion = useSetAtom(openAccordionState);

  // In single-accordion mode, use openAccordionState; otherwise use individual state
  const expanded = SINGLE_ACCORDION_MODE ? openAccordion === title : individualExpanded;

  const handleChange = useCallback(
    (_event: SyntheticEvent, isExpanded: boolean) => {
      if (SINGLE_ACCORDION_MODE) {
        // In single-accordion mode, track which accordion is open
        setOpenAccordion(isExpanded ? title : null);
      } else {
        // In multi-accordion mode, just update this accordion's state
        setIndividualExpanded(isExpanded);
      }
    },
    [title, setIndividualExpanded, setOpenAccordion],
  );

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '& .MuiAccordionSummary-content': {
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          },
        }}
      >
        <Typography variant="subtitle2" component="h3">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
