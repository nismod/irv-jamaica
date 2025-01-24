import { Checkbox, Divider, FormControlLabel } from '@mui/material';
import { ParamDropdown } from 'lib/controls/ParamDropdown';
import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { InputSection } from 'lib/sidebar/ui/InputSection';

import {
  DroughtOptionsVariableType,
  DROUGHT_OPTIONS_VARIABLE_LABELS,
} from 'data-layers/droughtOptions/metadata';
import {
  droughtOptionsVariableState,
  droughtShowOptionsState,
} from 'data-layers/droughtOptions/state/data-selection';

import { DroughtRiskVariableType, DROUGHT_RISK_VARIABLE_LABELS } from '../metadata';
import {
  droughtRcpParamState,
  droughtRiskVariableState,
  droughtShowRiskState,
} from '../state/data-selection';

export const DroughtsControl: FC = () => {
  const [rcp, setRcp] = useRecoilState(droughtRcpParamState);
  const [showRisk, setShowRisk] = useRecoilState(droughtShowRiskState);
  const [showOptions, setShowOptions] = useRecoilState(droughtShowOptionsState);

  const [riskVariable, setRiskVariable] = useRecoilState(droughtRiskVariableState);
  const [optionsVariable, setOptionsVariable] = useRecoilState(droughtOptionsVariableState);

  return (
    <>
      <InputSection>
        <ParamDropdown<string>
          title="Climate Scenario (RCP)"
          value={rcp}
          onChange={setRcp}
          options={['2.6', '4.5', '8.5']}
        />
      </InputSection>
      <InputSection>
        <FormControlLabel
          label="Drought Risk"
          control={<Checkbox checked={showRisk} onChange={(e, checked) => setShowRisk(checked)} />}
        />
        <ParamDropdown<DroughtRiskVariableType>
          title="Drought Risk Variable"
          value={riskVariable}
          onChange={setRiskVariable}
          options={DROUGHT_RISK_VARIABLE_LABELS}
          disabled={!showRisk}
        />
        <Divider />
      </InputSection>
      <InputSection>
        <FormControlLabel
          label="Adaptation Options"
          control={
            <Checkbox checked={showOptions} onChange={(e, checked) => setShowOptions(checked)} />
          }
        />
        <ParamDropdown<DroughtOptionsVariableType>
          title="Adaptation Options Variable"
          value={optionsVariable}
          onChange={setOptionsVariable}
          options={DROUGHT_OPTIONS_VARIABLE_LABELS}
          disabled={!showOptions}
        />
      </InputSection>
    </>
  );
};
