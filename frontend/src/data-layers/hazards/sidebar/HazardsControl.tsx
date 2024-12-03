import { ToggleSection, ToggleSectionGroup } from 'lib/controls/accordion-toggle/ToggleSection';

import { InputRow } from 'lib/sidebar/ui/InputRow';
import { InputSection } from 'lib/sidebar/ui/InputSection';
import { ReturnPeriodControl } from 'lib/sidebar/ui/params/ReturnPeriodControl';
import { EpochControl } from 'lib/sidebar/ui/params/EpochControl';
import { RCPControl } from 'lib/sidebar/ui/params/RCPControl';
import { useRecoilValue } from 'recoil';
import { showDamagesState } from 'app/state/damage-mapping/damage-map';
import { Alert, Box } from '@mui/material';

import { hazardSelectionState } from '../state/data-selection';
import { HAZARDS_UI_ORDER, HAZARDS_METADATA } from '../metadata';

function HazardToggleSection({ hazard, disabled }) {
  const otherProps =
    hazard === 'cyclone'
      ? {
          showMarkLabelsFor: [10, 50, 100, 500, 1000, 5000, 10000],
          valueLabelDisplay: 'auto',
        }
      : {};
  return (
    <ToggleSection id={hazard} label={HAZARDS_METADATA[hazard].label} disabled={disabled}>
      <InputSection>
        <ReturnPeriodControl
          group={hazard}
          param="returnPeriod"
          disabled={disabled}
          {...otherProps}
        />
      </InputSection>
      <InputSection>
        <InputRow>
          <EpochControl group={hazard} disabled={disabled} />
          <RCPControl group={hazard} disabled={disabled} />
        </InputRow>
      </InputSection>
    </ToggleSection>
  );
}

export const HazardsControl = () => {
  const showDirectDamages = useRecoilValue(showDamagesState);
  const disabled = showDirectDamages;

  return (
    <>
      {showDirectDamages ? (
        <Box my={1}>
          <Alert severity="info">
            Hazards are currently following the Infrastructure &gt; Damages selection
          </Alert>
        </Box>
      ) : null}
      <ToggleSectionGroup toggleState={hazardSelectionState}>
        {HAZARDS_UI_ORDER.map((hazard) => (
          <HazardToggleSection key={hazard} hazard={hazard} disabled={disabled} />
        ))}
      </ToggleSectionGroup>
    </>
  );
};
