import { FormControl, FormLabel, MenuItem, Select, SelectProps } from '@mui/material';
import uniqueId from 'lodash/uniqueId';
import { PropsWithChildren, useCallback, useRef } from 'react';
import { isValueLabel, ValueLabel } from './params/value-label';

interface ParamDropdownProps<V extends string | number = string> {
  title: string;
  value: V;
  options: (V | ValueLabel<V>)[];
  onChange: (value: V) => void;
  disabled?: boolean;
  variant?: SelectProps['variant'];
}

export const ParamDropdown = <V extends string | number = string>({
  title,
  value,
  onChange,
  options,
  disabled = false,
  variant = undefined,
}: PropsWithChildren<ParamDropdownProps<V>>) => {
  const htmlId = useRef(uniqueId('param-dropdown-'));
  const labelId = `${htmlId.current}-input-label`;
  const handleChange = useCallback((e) => onChange(e.target.value), [onChange]);
  return (
    <FormControl fullWidth>
      <FormLabel id={labelId}>{title}</FormLabel>
      <Select
        labelId={labelId}
        value={value}
        onChange={handleChange}
        size="small"
        variant={variant}
        disabled={disabled || options.length < 2}
      >
        {options.map((option) => {
          let value, label;
          if (isValueLabel(option)) {
            ({ value, label } = option);
          } else {
            value = label = option;
          }

          return (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
