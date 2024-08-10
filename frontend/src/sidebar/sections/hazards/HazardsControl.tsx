import { ToggleSection, ToggleSectionGroup } from 'lib/controls/accordion-toggle/ToggleSection';

import { hazardSelectionState } from 'data-layers/hazards/data-selection';
import { InputRow } from 'sidebar/ui/InputRow';
import { InputSection } from 'sidebar/ui/InputSection';
import { ReturnPeriodControl } from 'sidebar/ui/params/ReturnPeriodControl';
import { EpochControl } from 'sidebar/ui/params/EpochControl';
import { RCPControl } from 'sidebar/ui/params/RCPControl';
import { useRecoilValue } from 'recoil';
import { showDamagesState } from 'state/damage-mapping/damage-map';
import { Alert, Box } from '@mui/material';
import { HAZARDS_UI_ORDER, HAZARDS_METADATA } from 'data-layers/hazards/metadata';

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
