import { ToggleSection, ToggleSectionGroup } from 'lib/controls/accordion-toggle/ToggleSection';

import { InputRow } from 'lib/sidebar/ui/InputRow';
import { InputSection } from 'lib/sidebar/ui/InputSection';
import { ReturnPeriodControl } from 'lib/sidebar/ui/params/ReturnPeriodControl';
import { EpochControl } from 'lib/sidebar/ui/params/EpochControl';
import { RCPControl } from 'lib/sidebar/ui/params/RCPControl';
import { useRecoilValue } from 'recoil';
import { showDamagesState } from 'app/state/damage-mapping/damage-map';
import { Alert, Box, FormControl, FormLabel } from '@mui/material';

import { hazardSelectionState } from '../state/data-selection';
import { HAZARDS_UI_ORDER, HAZARDS_METADATA } from '../metadata';
import { CustomNumberSlider } from 'lib/controls/CustomSlider';
import { DataParam } from 'lib/sidebar/ui/params/DataParam';

/* Lower bound of NOAA storm categories, in m/s.
  https://www.nhc.noaa.gov/aboutsshws.php
*/
const STORM_CATEGORIES = {
  1: 33,
  2: 43,
  3: 50,
  4: 58,
  5: 70,
};

function SpeedSlider({ value, onChange, options }) {
  const [category] = Object.entries(STORM_CATEGORIES).findLast(([, speed]) => value >= speed) || [];
  const categoryLabel = category ? `Category ${category}` : '';
  return (
    <CustomNumberSlider
      marks={options}
      value={value}
      onChange={onChange}
      scale={(x) => options[x]}
      showMarkLabelsFor={[20, 30, 40, 50, 60, 70]}
      valueLabelDisplay="auto"
      valueLabelFormat={(v) => `${v} ${categoryLabel}`}
    />
  );
}

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
        {hazard === 'storm' ? (
          <FormControl fullWidth>
            <FormLabel id="storm-speed">Storm speed (m/s)</FormLabel>
            <DataParam group={hazard} id="speed">
              {({ value, onChange, options }) => (
                <SpeedSlider value={value} onChange={onChange} options={options} />
              )}
            </DataParam>
          </FormControl>
        ) : (
          <ReturnPeriodControl
            group={hazard}
            param="returnPeriod"
            disabled={disabled}
            {...otherProps}
          />
        )}
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
