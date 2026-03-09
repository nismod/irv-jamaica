import { FormControl, FormLabel } from '@mui/material';
import { useId } from 'react';
import { CustomNumberSlider } from 'lib/controls/CustomSlider';
import { DataParam } from './DataParam';

function useLabelId() {
  const id = useId();
  return `${id}-label`;
}

export const ReturnPeriodControl = ({ group, ...otherProps }) => {
  const labelId = useLabelId();
  return (
    <FormControl fullWidth>
      <FormLabel id={labelId}>Return Period</FormLabel>
      <DataParam group={group} id="returnPeriod">
        {({ value, onChange, options }) => (
          <CustomNumberSlider
            aria-labelledby={labelId}
            marks={options}
            value={value}
            onChange={onChange}
            {...otherProps}
          />
        )}
      </DataParam>
    </FormControl>
  );
};
