import ArrowRight from '@mui/icons-material/ArrowRight';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { FC, ReactNode, useId } from 'react';
import { useAtom } from 'jotai';

import { sidebarSectionExpandedState } from 'lib/state/sections';

import { VisibilityToggle } from './VisibilityToggle';

type AtomSetter<T> = (value: T | ((prev: T) => T)) => void;

export const SidebarPanel: FC<{
  id: string;
  title: string;
  children: ReactNode;
}> = ({ id, title, children }) => {
  const [expanded, setExpanded] = useAtom(sidebarSectionExpandedState(id) as never) as [
    boolean,
    AtomSetter<boolean>,
  ];
  const htmlId = useId();

  return (
    <Accordion
      disableGutters
      square // clears the original border radius so that we can set our own
      expanded={expanded}
      onChange={(e, expanded) => setExpanded(expanded)}
      sx={{ pointerEvents: 'auto', marginBottom: 1, borderRadius: 1, overflow: 'hidden' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: '6px', width: '100%' }}>
        <Box sx={{ flexGrow: 1 }}>
          <AccordionSummary
            sx={{
              '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                transform: 'rotate(90deg)',
              },
              '& .MuiAccordionSummary-content': {
                marginY: '6px',
              },
              paddingLeft: '6px',
              flexDirection: 'row-reverse', // this puts the expand icon to the left of the summary bar
            }}
            expandIcon={<ArrowRight />}
            id={`${htmlId}-header`}
            aria-controls={`${htmlId}-details`}
          >
            <Typography>{title}</Typography>
          </AccordionSummary>
        </Box>
        <Box>
          <VisibilityToggle id={id} />
        </Box>
      </Box>
      <AccordionDetails
        id={`${htmlId}-details`}
        role="region"
        aria-labelledby={`${htmlId}-header`}
        sx={{ padding: 0 }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
