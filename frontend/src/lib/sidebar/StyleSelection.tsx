import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FC, useId } from 'react';
import { useRecoilValue } from 'lib/jotai-compat/recoil';
import { useAtom } from 'jotai';

import { sectionStyleOptionsState, sectionStyleValueState } from 'lib/state/sections';

type AtomSetter<T> = (value: T | ((prev: T) => T)) => void;

export const StyleSelection: FC<{ id: string }> = ({ id }) => {
  const [value, setValue] = useAtom(sectionStyleValueState(id) as never) as [
    string,
    AtomSetter<string>,
  ];
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
