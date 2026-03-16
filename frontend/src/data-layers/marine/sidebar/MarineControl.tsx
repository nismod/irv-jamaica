import { ParamChecklist } from 'lib/controls/params/ParamChecklist';
import { useAtom } from 'jotai';
import { InputSection } from 'lib/sidebar/ui/InputSection';

import { MarineLocationFilterType, MARINE_LOCATION_FILTERS } from '../domains';
import { MarineFilters, marineFiltersState } from '../state/marine-filters';

type AtomSetter<T> = (value: T | ((prev: T) => T)) => void;

export const MarineControl = () => {
  const [marineFilters, setMarineFilters] = useAtom(marineFiltersState as never) as [MarineFilters, AtomSetter<MarineFilters>];

  return (
    <>
      {/* <ParamChecklist<LandUseOption>
        title="Land Use Types"
        options={LAND_USE_VALUES}
        checklistState={terrestrialFilters.landuse_desc}
        onChecklistState={(checklistState) =>
          setTerrestrialFilters({
            ...terrestrialFilters,
            landuse_desc: checklistState as Record<LandUseOption, boolean>,
          })
        }
        renderLabel={(key) => <>{key}</>}
      /> */}
      <InputSection>
        <ParamChecklist<MarineLocationFilterType>
          title="Find areas in proximity"
          options={[...MARINE_LOCATION_FILTERS]}
          checklistState={marineFilters.location_filters}
          onChecklistState={(checklistState) =>
            setMarineFilters({ ...marineFilters, location_filters: checklistState })
          }
          showAllNone={false}
          renderLabel={(key, label) => <>{label}</>}
        />
      </InputSection>
    </>
  );
};
