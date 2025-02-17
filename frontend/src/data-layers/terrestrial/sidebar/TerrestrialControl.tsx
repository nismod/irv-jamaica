import { FormControl, FormLabel, Slider } from '@mui/material';
import { ParamChecklist } from 'lib/controls/params/ParamChecklist';
import { useRecoilState } from 'recoil';
import { InputSection } from 'lib/sidebar/ui/InputSection';

import { TerrestrialLocationFilterType, TERRESTRIAL_LOCATION_FILTERS } from '../domains';
import { terrestrialNonLandUseFiltersState } from '../state/terrestrial-filters';
import { TerrestrialLandUseTree } from './TerrestrialLandUseTree';

export const TerrestrialControl = () => {
  const [terrestrialFilters, setTerrestrialFilters] = useRecoilState(
    terrestrialNonLandUseFiltersState,
  );

  return (
    <>
      <InputSection>
        <FormLabel>Land Use / Land Cover</FormLabel>
        <TerrestrialLandUseTree />
      </InputSection>
      <InputSection>
        <FormControl fullWidth>
          <FormLabel>Slope (degrees)</FormLabel>
          <Slider
            getAriaLabel={(index) => `${index === 0 ? 'Minimum' : 'Maximum'} slope (degrees)`}
            value={terrestrialFilters.slope_degrees}
            onChange={(event, value) =>
              setTerrestrialFilters({
                ...terrestrialFilters,
                slope_degrees: value as [number, number],
              })
            }
            min={0}
            max={90}
            step={1}
            valueLabelDisplay="auto"
            marks
          />
        </FormControl>
      </InputSection>
      <InputSection>
        <FormControl fullWidth>
          <FormLabel>Elevation (m)</FormLabel>
          <Slider
            getAriaLabel={(index) => `${index === 0 ? 'Minimum' : 'Maximum'} elevation (m)`}
            value={terrestrialFilters.elevation_m}
            onChange={(event, value) =>
              setTerrestrialFilters({
                ...terrestrialFilters,
                elevation_m: value as [number, number],
              })
            }
            min={0}
            max={2250}
            step={10}
            valueLabelDisplay="auto"
            marks
          />
        </FormControl>
      </InputSection>
      <InputSection>
        <ParamChecklist<TerrestrialLocationFilterType>
          title="Apply constraints"
          options={[...TERRESTRIAL_LOCATION_FILTERS]}
          checklistState={terrestrialFilters.location_filters}
          onChecklistState={(checklistState) =>
            setTerrestrialFilters({ ...terrestrialFilters, location_filters: checklistState })
          }
          showAllNone={false}
          renderLabel={(key, label) => <>{label}</>}
        />
      </InputSection>
    </>
  );
};
