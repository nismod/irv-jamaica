import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material';
import uniqueId from 'lodash/uniqueId';
import { useRef } from 'react';
import { useRecoilState } from 'recoil';

import { StateEffectRoot } from 'lib/recoil/state-effects/StateEffectRoot';
import { InputSection } from 'lib/sidebar/ui/InputSection';
import { InputRow } from 'lib/sidebar/ui/InputRow';
import { EpochControl } from 'lib/sidebar/ui/params/EpochControl';
import { RCPControl } from 'lib/sidebar/ui/params/RCPControl';
import {
  damageSourceState,
  damageSourceStateEffect,
  damageTypeState,
} from 'app/state/damage-mapping/damage-map';
import { LayerStylePanel } from 'lib/sidebar/ui/LayerStylePanel';

import { HAZARDS_METADATA, HAZARDS_UI_ORDER } from 'data-layers/hazards/metadata';

export const DamageSourceControl = () => {
  const [damageSource, setDamageSource] = useRecoilState(damageSourceState);
  const [damageType, setDamageType] = useRecoilState(damageTypeState);
  const htmlId = useRef(uniqueId('damage-source-'));

  return (
    <>
      <StateEffectRoot state={damageSourceState} effect={damageSourceStateEffect} />
      <LayerStylePanel>
        <InputSection>
          <FormControl fullWidth>
            <FormLabel id={`${htmlId.current}-damage-type`}>Damage type</FormLabel>
            <Select<string>
              labelId={`${htmlId.current}-damage-type`}
              variant="standard"
              value={damageType}
              onChange={(e) => setDamageType(e.target.value)}
            >
              <MenuItem value="direct">Direct Damages</MenuItem>
              <MenuItem value="indirect">Economic Losses</MenuItem>
            </Select>
          </FormControl>
        </InputSection>
        <InputSection>
          <FormControl>
            <FormLabel>Hazard</FormLabel>
            <RadioGroup value={damageSource} onChange={(e, value) => setDamageSource(value)}>
              <FormControlLabel label="All Hazards" control={<Radio value="all" />} />
              {HAZARDS_UI_ORDER.filter((h) => h !== 'storm').map((hazard) => (
                <FormControlLabel
                  key={hazard}
                  label={HAZARDS_METADATA[hazard].label}
                  control={<Radio value={hazard} />}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </InputSection>
        <InputSection>
          <InputRow>
            <EpochControl group={damageSource} />
            <RCPControl group={damageSource} />
          </InputRow>
        </InputSection>
      </LayerStylePanel>
    </>
  );
};
