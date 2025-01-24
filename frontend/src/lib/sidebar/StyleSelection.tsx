import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import uniqueId from 'lodash/uniqueId';
import { FC, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { sectionStyleOptionsState, sectionStyleValueState } from 'lib/state/sections';

export const StyleSelection: FC<{ id: string }> = ({ id }) => {
  const [value, setValue] = useRecoilState(sectionStyleValueState(id));
  const options = useRecoilValue(sectionStyleOptionsState(id));

  const htmlId = useRef(uniqueId('style-selection-'));
  const labelId = `${htmlId.current}-input-label`;

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
