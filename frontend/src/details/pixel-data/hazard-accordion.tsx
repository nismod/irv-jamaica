import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, Typography, AccordionDetails, Box } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, SyntheticEvent, ReactNode } from 'react';

import { RagIndicator } from './rag/rag-indicator';
import { RagStatus } from './rag/rag-types';
import {
  hazardAccordionExpandedState,
  openAccordionState,
  SINGLE_ACCORDION_MODE,
} from './accordion-state';

interface HazardAccordionProps {
  id: string;
  title: string;
  status?: RagStatus;
  children: ReactNode;
}

export function HazardAccordion({
  id,
  title,
  status = 'green',
  children,
}: HazardAccordionProps) {
  const [individualExpanded, setIndividualExpanded] = useAtom(hazardAccordionExpandedState(id));
  const openAccordion = useAtomValue(openAccordionState);
  const setOpenAccordion = useSetAtom(openAccordionState);

  // In single-accordion mode, use openAccordionState; otherwise use individual state
  const expanded = SINGLE_ACCORDION_MODE ? openAccordion === id : individualExpanded;

  const handleChange = useCallback(
    (_event: SyntheticEvent, isExpanded: boolean) => {
      if (SINGLE_ACCORDION_MODE) {
        // In single-accordion mode, track which accordion is open
        setOpenAccordion(isExpanded ? id : null);
      } else {
        // In multi-accordion mode, just update this accordion's state
        setIndividualExpanded(isExpanded);
      }
    },
    [id, setIndividualExpanded, setOpenAccordion],
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
        <Typography variant="subtitle2" component="h3" sx={{ flex: 1 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
          <RagIndicator status={status} />
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
