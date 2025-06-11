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
  coastal_mangrove: 'Coastal (mangrove)',
  coastal_nomangrove: 'Coastal (no mangrove)',
  coastal_nomangrove_minus_mangrove: 'Coastal (no mangrove - mangrove)',
};

const displayReturnPeriods = new Set([10, 20, 50, 100, 200, 500]);

export const PixelDataGrid = ({ hazard }) => {
  const headers = useRecoilValue(pixelDrillerDataHeaders);
  const rows = useRecoilValue(pixelDrillerDataRows(hazard));
  const dataReturnPeriods = useRecoilValue(pixelDrillerDataRPs(hazard));
  const columns = [
    { field: 'epoch', headerName: 'Epoch', width: 55 },
    { field: 'rcp', headerName: 'RCP', width: 55 },
  ];
  const returnPeriods = displayReturnPeriods.intersection(dataReturnPeriods);

  returnPeriods.forEach((rp) => {
    columns.push({ field: `rp-${rp}`, headerName: `RP ${rp}`, width: 60 });
  });
  if (!headers.length) {
    return null;
  }
  const variable = rows[0].variable;
  const unit = rows[0].unit;

  return (
    <>
      <Typography variant="subtitle2" component="h3">
        {headings[hazard]}: {variable} ({unit})
      </Typography>

      <DataGrid columns={columns} rows={rows} rowHeight={30} density="compact" />
    </>
  );
};
