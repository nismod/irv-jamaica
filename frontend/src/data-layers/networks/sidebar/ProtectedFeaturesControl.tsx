import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { FormLabel } from '@mui/material';

import { ParamDropdown } from 'lib/controls/ParamDropdown';

import { InputRow } from 'lib/sidebar/ui/InputRow';
import { InputSection } from 'lib/sidebar/ui/InputSection';
import { LayerStylePanel } from 'lib/sidebar/ui/LayerStylePanel';
import { DataParam } from 'lib/sidebar/ui/params/DataParam';

import { adaptationFieldState } from '../state/layer';

export const ProtectedFeaturesControl: FC = () => {
  const [adaptationField, setAdaptationField] = useRecoilState(adaptationFieldState);
  return (
    <LayerStylePanel>
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
