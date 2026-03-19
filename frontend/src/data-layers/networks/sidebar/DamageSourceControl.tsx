import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material';
import { useId } from 'react';
import { useAtom } from 'jotai';

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
  const [damageSource, setDamageSource] = useAtom(damageSourceState);
  const [damageType, setDamageType] = useAtom(damageTypeState);
  const id = useId();

  return (
    <>
      <StateEffectRoot state={damageSourceState} effect={damageSourceStateEffect} />
      <LayerStylePanel>
        <InputSection>
          <FormControl fullWidth>
            <FormLabel id={`${id}-damage-type`}>Damage type</FormLabel>
            <Select<string>
              labelId={`${id}-damage-type`}
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
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Hazard</FormLabel>
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
