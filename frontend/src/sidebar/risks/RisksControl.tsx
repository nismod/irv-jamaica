import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useRecoilValue } from 'recoil';

import { dataParamState, useUpdateDataParam } from 'state/data-params';
import { InputSection } from 'sidebar/ui/InputSection';
import { InputRow } from 'sidebar/ui/InputRow';
import { EpochControl } from 'sidebar/ui/params/EpochControl';
import { RCPControl } from 'sidebar/ui/params/RCPControl';
import { HAZARDS, HAZARDS_METADATA } from 'config/view-layers/risks/metadata';

export const RisksControl = () => {
  const hazard = useRecoilValue(dataParamState({ group: 'risks', param: 'hazard' }));
  const updateHazard = useUpdateDataParam('risks', 'hazard');
  function selectHazard(event, value) {
    updateHazard(value);
  }

  return (
    <>
      <InputSection>
        <FormControl>
          <FormLabel>Hazard</FormLabel>
          <RadioGroup value={hazard} onChange={selectHazard}>
            {HAZARDS.map((hazardOption) => (
              <FormControlLabel
                key={hazardOption}
                label={HAZARDS_METADATA[hazardOption].label}
                control={<Radio value={hazardOption} />}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </InputSection>
      <InputSection>
        <InputRow>
          <EpochControl group="risks" />
          <RCPControl group="risks" />
        </InputRow>
      </InputSection>
    </>
  );
};
