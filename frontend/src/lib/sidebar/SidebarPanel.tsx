import { ArrowRight } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import uniqueId from 'lodash/uniqueId';
import { FC, ReactNode, useRef } from 'react';
import { useRecoilState } from 'recoil';

import { sidebarSectionExpandedState } from 'lib/state/sections';

import { VisibilityToggle } from './VisibilityToggle';

export const SidebarPanel: FC<{
  id: string;
  title: string;
  children: ReactNode;
}> = ({ id, title, children }) => {
  const [expanded, setExpanded] = useRecoilState(sidebarSectionExpandedState(id));
  const htmlId = useRef(uniqueId('sidebar-panel-'));

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
            id={`${htmlId.current}-header`}
            aria-controls={`${htmlId.current}-details`}
          >
            <Typography>{title}</Typography>
          </AccordionSummary>
        </Box>
        <Box>
          <VisibilityToggle id={id} />
        </Box>
      </Box>
      <AccordionDetails
        id={`${htmlId.current}-details`}
        role="region"
        aria-labelledby={`${htmlId.current}-header`}
        sx={{ padding: 0 }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
