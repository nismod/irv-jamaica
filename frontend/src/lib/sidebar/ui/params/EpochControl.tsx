import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { useId } from 'react';

import { DataParam } from './DataParam';

function epochLabel(value) {
  if (value === 2010) return 'Present';
  return value;
}

export const EpochControl = ({ group, disabled = false }) => {
  const labelId = useId();

  return (
    <FormControl fullWidth disabled={disabled}>
      <FormLabel id={labelId}>Epoch</FormLabel>
      <DataParam group={group} id="epoch">
        {({ value, onChange, options }) => (
          <Select
            labelId={labelId}
            variant="standard"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
          >
            {options.map((epoch) => (
              <MenuItem key={epoch} value={epoch}>
                {epochLabel(epoch)}
              </MenuItem>
            ))}
          </Select>
        )}
      </DataParam>
    </FormControl>
  );
};
