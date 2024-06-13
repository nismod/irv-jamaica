import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';

import { dataParamState, useUpdateDataParam } from 'state/data-params';
import { InputSection } from 'sidebar/ui/InputSection';
import { InputRow } from 'sidebar/ui/InputRow';
import { EpochControl } from 'sidebar/ui/params/EpochControl';
import { RCPControl } from 'sidebar/ui/params/RCPControl';
import { risksSelectionState } from 'state/layers/modules/risks';
import { HAZARDS, HAZARDS_METADATA, RISKS, RISKS_METADATA } from 'config/risks/metadata';

export const RisksControl = () => {
  const [risksSelection, setRisksSelection] = useRecoilState(risksSelectionState);

  function selectType({ target }) {
    setRisksSelection(target?.value);
  }

  const hazard = useRecoilValue(dataParamState({ group: 'risks', param: 'hazard' }));
  const updateHazard = useUpdateDataParam('risks', 'hazard');
  function selectHazard(event, value) {
    updateHazard(value);
  }

  return (
    <>
      <InputSection>
        <FormControl fullWidth>
          <FormLabel>Display</FormLabel>
          <Select<string> variant="standard" value={risksSelection} onChange={selectType}>
            {RISKS.map((risk) => (
              <MenuItem key={risk} value={risk}>
                {RISKS_METADATA[risk].label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </InputSection>
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
