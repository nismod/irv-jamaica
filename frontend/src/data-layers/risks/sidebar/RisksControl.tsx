import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material';
import { useRecoilValue } from 'lib/jotai-compat/recoil';
import { useAtom } from 'jotai';

import { sectionStyleOptionsState, sectionStyleValueState } from 'lib/state/sections';

import { InputSection } from 'lib/sidebar/ui/InputSection';
import { DataParam } from 'lib/sidebar/ui/params/DataParam';

import { sectorRiskTypes } from '../domains';
import { dataParamState } from 'lib/state/data-params';

function capitalise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type AtomSetter<T> = (value: T | ((prev: T) => T)) => void;

export const RisksControl = () => {
  const [riskType, setRiskType] = useAtom(sectionStyleValueState('risks') as never) as [string, AtomSetter<string>];
  const riskTypes = useRecoilValue(sectionStyleOptionsState('risks'));
  const sector = useRecoilValue(dataParamState({ group: 'risks', param: 'sector' }));

  // Reset risk type if the selected sector does not support the current risk type.
  const allowedRiskTypes = sectorRiskTypes[sector] || [];
  if (!allowedRiskTypes.includes(riskType)) {
    setRiskType(allowedRiskTypes[0]);
  }

  function onSelectRiskType(event, value) {
    setRiskType(value);
  }

  return (
    <>
      <InputSection>
        <FormControl fullWidth sx={{ my: 2 }}>
          <FormLabel id="risks-sector">Sector</FormLabel>
          <DataParam group="risks" id="sector">
            {({ value, onChange, options }) => (
              <Select
                labelId="risks-sector"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {capitalise(option)}
                  </MenuItem>
                ))}
              </Select>
            )}
          </DataParam>
        </FormControl>
      </InputSection>
      <InputSection>
        <FormControl component="fieldset">
          <FormLabel component="legend">Variable</FormLabel>
          <RadioGroup value={riskType} onChange={onSelectRiskType}>
            {riskTypes
              .filter((option) => sectorRiskTypes[sector]?.includes(option.id))
              .map((option) => (
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
