import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { useId } from 'react';

import { DataParam } from './DataParam';

function rcpLabel(value) {
  return value === 'baseline' ? 'Baseline' : value;
}

export const RCPControl = ({ group, disabled = false }) => {
  const labelId = useId();
  return (
    <FormControl fullWidth disabled={disabled}>
      <FormLabel id={labelId}>
        <abbr title="Representative Concentration Pathway (Climate Scenario)">RCP</abbr>
      </FormLabel>
      <DataParam group={group} id="rcp">
        {({ value, onChange, options }) => (
          <Select
            labelId={labelId}
            variant="standard"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
          >
            {options.map((rcp) => (
              <MenuItem key={rcp} value={rcp}>
                {rcpLabel(rcp)}
              </MenuItem>
            ))}
          </Select>
        )}
      </DataParam>
    </FormControl>
  );
};
