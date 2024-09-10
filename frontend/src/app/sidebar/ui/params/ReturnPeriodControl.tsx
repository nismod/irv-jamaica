import { FormControl, FormLabel } from '@mui/material';
import uniqueId from 'lodash/uniqueId';
import { useRef } from 'react';
import { CustomNumberSlider } from 'lib/controls/CustomSlider';
import { DataParam } from './DataParam';

export const ReturnPeriodControl = ({ group, ...otherProps }) => {
  const htmlId = useRef(uniqueId('return-period-'));
  const labelId = `${htmlId.current}-label`;
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
