import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import uniqueId from 'lodash/uniqueId';
import { useRef } from 'react';

import { DataParam } from './DataParam';

function epochLabel(value) {
  if (value === 2010) return 'Present';
  return value;
}

export const EpochControl = ({ group, disabled = false }) => {
  const labelId = useRef(uniqueId('epoch-'));

  return (
    <FormControl fullWidth disabled={disabled}>
      <FormLabel id={labelId.current}>Epoch</FormLabel>
      <DataParam group={group} id="epoch">
        {({ value, onChange, options }) => (
          <Select
            labelId={labelId.current}
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
