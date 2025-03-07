import { ToggleSection, ToggleSectionGroup } from 'lib/controls/accordion-toggle/ToggleSection';

import { InputRow } from 'lib/sidebar/ui/InputRow';
import { InputSection } from 'lib/sidebar/ui/InputSection';
import { ReturnPeriodControl } from 'lib/sidebar/ui/params/ReturnPeriodControl';
import { EpochControl } from 'lib/sidebar/ui/params/EpochControl';
import { RCPControl } from 'lib/sidebar/ui/params/RCPControl';
import { useRecoilValue } from 'recoil';
import { showDamagesState } from 'app/state/damage-mapping/damage-map';
import { Alert, Box, FormControl, FormLabel, Slider } from '@mui/material';

import { hazardSelectionState } from '../state/data-selection';
import { HAZARDS_UI_ORDER, HAZARDS_METADATA } from '../metadata';
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
  const sliderValue = options.findIndex((speed) => speed === value);
  const markCategories = options.map((option) => {
    const [category] =
      Object.entries(STORM_CATEGORIES).findLast(([, speed]) => option >= speed) || [];
    return category;
  });
  const marks = options.map((speed, idx) => {
    const category = markCategories[idx];
    const label =
      category === undefined
        ? ''
        : markCategories.findIndex((c) => c === category) === idx
          ? category
          : '';
    return { value: idx, label };
  });

  function handleChange(e) {
    onChange(options[e.target?.value]);
  }

  return (
    <Slider
      min={0}
      max={options.length - 1}
      step={1}
      marks={marks}
      value={sliderValue}
      onChange={handleChange}
      scale={(x) => options[x]}
      valueLabelDisplay="auto"
      valueLabelFormat={(v) => `${v} m/s`}
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
