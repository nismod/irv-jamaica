import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

import { RegionLevel } from '../metadata';
import { regionLevelState } from '../state/data-selection';

type AtomSetter<T> = (value: T | ((prev: T) => T)) => void;

export const RegionLevelSelection = () => {
  const [regionLevel, setRegionLevel] = useAtom(regionLevelState as never) as [RegionLevel, AtomSetter<RegionLevel>];

  const handleChange = useCallback(
    (e, value: string) => {
      if (value != null) {
        setRegionLevel(value as RegionLevel);
      }
    },
    [setRegionLevel],
  );

  return (
    <ToggleButtonGroup exclusive value={regionLevel} onChange={handleChange} fullWidth>
      <ToggleButton value="parish" sx={{ textTransform: 'none' }}>
        Parishes
      </ToggleButton>
      <ToggleButton value="enumeration" sx={{ textTransform: 'none' }}>
        Enumeration Districts
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export const RegionsControl = () => {
  return <RegionLevelSelection />;
};
