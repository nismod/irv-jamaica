import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import uniqueId from 'lodash/uniqueId';
import { useRef } from 'react';

import { DataParam } from './DataParam';

function rcpLabel(value) {
  return value === 'baseline' ? 'Baseline' : value;
}

export const RCPControl = ({ group, disabled = false }) => {
  const labelId = useRef(uniqueId('rcp-'));
  return (
    <FormControl fullWidth disabled={disabled}>
      <FormLabel id={labelId.current}>
        <abbr title="Representative Concentration Pathway (Climate Scenario)">RCP</abbr>
      </FormLabel>
      <DataParam group={group} id="rcp">
        {({ value, onChange, options }) => (
          <Select
            labelId={labelId.current}
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
