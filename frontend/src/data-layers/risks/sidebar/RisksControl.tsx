import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';

import { InputSection } from 'app/sidebar/ui/InputSection';
import { sectionStyleOptionsState, sectionStyleValueState } from 'app/state/sections';

export const RisksControl = () => {
  const [value, setValue] = useRecoilState(sectionStyleValueState('risks'));
  const options = useRecoilValue(sectionStyleOptionsState('risks'));
  function onChange(event, value) {
    setValue(value);
  }

  return (
    <>
      <InputSection>
        <FormControl>
          <FormLabel>Risk</FormLabel>
          <RadioGroup value={value} onChange={onChange}>
            {options.map((option) => (
              <FormControlLabel
                key={option.id}
                label={option.label}
                control={<Radio value={option.id} />}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </InputSection>
    </>
  );
};
