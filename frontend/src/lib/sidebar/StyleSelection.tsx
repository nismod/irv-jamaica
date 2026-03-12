import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FC, useId } from 'react';
import { useRecoilState, useRecoilValue } from 'lib/jotai-compat/recoil';

import { sectionStyleOptionsState, sectionStyleValueState } from 'lib/state/sections';

export const StyleSelection: FC<{ id: string }> = ({ id }) => {
  const [value, setValue] = useRecoilState(sectionStyleValueState(id));
  const options = useRecoilValue(sectionStyleOptionsState(id));

  const htmlId = useId();
  const labelId = `${htmlId}-input-label`;

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>Layer style</InputLabel>
      <Select
        labelId={labelId}
        label="Layer style"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
