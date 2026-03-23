import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useAtom, useAtomValue } from 'jotai';
import { SyntheticEvent, useCallback } from 'react';

import {
  hazardAccordionExpandedState,
  openAccordionState,
  SINGLE_ACCORDION_MODE,
} from '../accordion-state';

import {
  pixelDrillerDataHeaders,
  pixelDrillerDataRows,
  pixelDrillerDataRPs,
} from 'lib/state/pixel-driller';

import '../hazard-table.css';

const title = 'River flooding';

const displayReturnPeriods = new Set([5, 10, 20, 50, 100, 200, 500]);

const PixelDataGrid = ({ pixel_layer }) => {
  const [individualExpanded, setIndividualExpanded] = useAtom(
    hazardAccordionExpandedState(pixel_layer),
  );
  const [openAccordion, setOpenAccordion] = useAtom(openAccordionState);

  const headers = useAtomValue(pixelDrillerDataHeaders);
  const rows = useAtomValue(pixelDrillerDataRows(pixel_layer));
  const dataReturnPeriods = useAtomValue(pixelDrillerDataRPs(pixel_layer));
  const columns = [
    { field: 'epoch', headerName: 'Epoch', width: 55 },
    { field: 'rcp', headerName: 'RCP', width: 55 },
  ];

  // Include confidence column if there are multiple values
  const confidences = new Set(rows.map((d) => d.confidence));
  if (confidences.size > 1) {
    columns.push({ field: 'confidence', headerName: 'Confidence', width: 60 });
  }

  const returnPeriods = displayReturnPeriods.intersection(dataReturnPeriods);

  returnPeriods.forEach((rp) => {
    columns.push({ field: `rp-${rp}`, headerName: `RP ${rp}`, width: 60 });
  });

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
    [setIndividualExpanded, setOpenAccordion],
  );

  if (!headers.length || !rows.length) {
    return null;
  }
  const variable = rows[0].variable;
  const unit = rows[0].unit;

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={handleChange}
        data-hazard-title={title}
      >
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
            {title}: {variable} ({unit})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DataGrid columns={columns} rows={rows} rowHeight={30} density="compact" />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default PixelDataGrid;
