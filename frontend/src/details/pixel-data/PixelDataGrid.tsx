import { DataGrid } from '@mui/x-data-grid';

import {
  pixelDrillerDataHeaders,
  pixelDrillerDataRows,
  pixelDrillerDataRPs,
} from 'lib/state/pixel-driller';
import { useRecoilValue } from 'recoil';

import './hazard-table.css';
import { Typography } from '@mui/material';

const headings = {
  cyclone: 'Cyclones',
  fluvial: 'River flooding',
  surface: 'Surface flooding',
  coastal: 'Coastal flooding',
};

const displayReturnPeriods = new Set([5, 10, 20, 50, 100, 200, 500]);

export const PixelDataGrid = ({ pixel_layer }) => {
  const headers = useRecoilValue(pixelDrillerDataHeaders);
  const rows = useRecoilValue(pixelDrillerDataRows(pixel_layer));
  const dataReturnPeriods = useRecoilValue(pixelDrillerDataRPs(pixel_layer));
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
  if (!headers.length || !rows.length) {
    return null;
  }
  const variable = rows[0].variable;
  const unit = rows[0].unit;

  return (
    <>
      <Typography variant="subtitle2" component="h3">
        {headings[pixel_layer]}: {variable} ({unit})
      </Typography>

      <DataGrid columns={columns} rows={rows} rowHeight={30} density="compact" />
    </>
  );
};
