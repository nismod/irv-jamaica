import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { FormLabel } from '@mui/material';

import { CustomNumberSlider } from 'lib/controls/CustomSlider';
import { ParamDropdown } from 'lib/controls/ParamDropdown';
import { StateEffectRoot } from 'lib/recoil/state-effects/StateEffectRoot';
import { dataParamsByGroupState } from 'lib/state/data-params';

import { InputRow } from 'lib/sidebar/ui/InputRow';
import { InputSection } from 'lib/sidebar/ui/InputSection';
import { LayerStylePanel } from 'lib/sidebar/ui/LayerStylePanel';
import { DataParam } from 'lib/sidebar/ui/params/DataParam';

import { adaptationDataParamsStateEffect, adaptationFieldState } from '../state/layer';

export const ProtectedFeaturesControl: FC = () => {
  const [adaptationField, setAdaptationField] = useRecoilState(adaptationFieldState);
  return (
    <LayerStylePanel>
      <StateEffectRoot
        state={dataParamsByGroupState('adaptation')}
        effect={adaptationDataParamsStateEffect}
      />
      <InputSection>
        <FormLabel>Adaptation for</FormLabel>
        <InputRow>
          <DataParam group="adaptation" id="rcp">
            {({ value, onChange, options }) => (
              <ParamDropdown title="RCP" value={value} onChange={onChange} options={options} />
            )}
          </DataParam>
        </InputRow>
      </InputSection>
      <InputSection>
        <DataParam group="adaptation" id="adaptation_protection_level">
          {({ value, onChange, options }) =>
            options.length > 2 ? (
              <>
                <FormLabel>Protection level</FormLabel>
                <CustomNumberSlider
                  title="Protection level"
                  value={value}
                  onChange={onChange}
                  marks={options}
                />
              </>
            ) : (
              <ParamDropdown
                title="Protection level"
                value={value}
                onChange={onChange}
                options={options}
              />
            )
          }
        </DataParam>
      </InputSection>

      <InputSection>
        <ParamDropdown<typeof adaptationField>
          title="Displayed variable"
          value={adaptationField}
          onChange={setAdaptationField}
          options={[
            { value: 'avoided_ead_mean', label: 'Avoided Expected Annual Damages' },
            { value: 'avoided_eael_mean', label: 'Avoided Expected Annual Economic Losses' },
            { value: 'adaptation_cost', label: 'Adaptation Cost' },
          ]}
        />
      </InputSection>
    </LayerStylePanel>
  );
};
