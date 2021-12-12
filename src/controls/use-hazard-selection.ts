import { useCallback, useEffect, useMemo, useState } from 'react';
import { getHazardId } from '../config/layers';

export const hazardConfig = {
  fluvial: {
    paramDomains: {
      returnPeriod: [20, 50, 100, 200, 500, 1500],

      rcp: ['baseline'],
      epoch: [2010],
      confidence: ['None'],
    },
    paramDefaults: {
      returnPeriod: 20,

      rcp: 'baseline',
      epoch: 2010,
      confidence: 'None',
    },
  },
  surface: {
    paramDomains: {
      returnPeriod: [20, 50, 100, 200, 500, 1500],

      rcp: ['baseline'],
      epoch: [2010],
      confidence: ['None'],
    },
    paramDefaults: {
      returnPeriod: 20,

      rcp: 'baseline',
      epoch: 2010,
      confidence: 'None',
    },
  },
  coastal: {
    paramDomains: {
      returnPeriod: [1, 2, 5, 10, 50, 100],
      epoch: [2010, 2030, 2050, 2070, 2100],
      rcp: ['baseline', '2.6', '4.5', '8.5'],

      confidence: ['None'],
    },
    paramDefaults: {
      returnPeriod: 1,
      epoch: 2010,
      rcp: 'baseline',

      confidence: 'None',
    },
    paramDependencies: {
      rcp: ({ epoch }) => {
        if (epoch === 2010) return ['baseline'];
        if (epoch === 2050 || epoch === 2100) return ['2.6', '4.5', '8.5'];
        if (epoch === 2030 || epoch === 2070) return ['4.5', '8.5'];
      },
    },
  },
  cyclone: {
    paramDomains: {
      returnPeriod: [
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000,
        6000, 7000, 8000, 9000, 10000,
      ],
      epoch: [2010, 2050, 2100],
      rcp: ['baseline', '4.5', '8.5'],
      confidence: [5, 50, 95],
    },
    paramDefaults: {
      returnPeriod: 10,
      epoch: 2010,
      rcp: 'baseline',
      confidence: 50,
    },
    paramDependencies: {
      rcp: ({ epoch }) => {
        if (epoch === 2010) return ['baseline'];
        if (epoch === 2050 || epoch === 2100) return ['4.5', '8.5'];
      },
    },
  },
};

export interface SingleHazardSelection {
  show: boolean;
  paramSelection: {
    returnPeriod?: number;
    epoch?: number;
    rcp?: string;
    confidence?: string | number;
  };
  paramOptions: {
    returnPeriod?: number[];
    epoch?: number[];
    rcp?: string[];
    confidence?: (string | number)[];
  };
}

const hazardTypes = Object.keys(hazardConfig);

function baseSelection() {
  return Object.fromEntries(hazardTypes.map((ht) => [ht, false]));
}

export type HazardSelectionSet = { [k: string]: SingleHazardSelection };

export const useHazardSelection = (forceSingle = false, onlySelect = false) => {
  const [hazardSelection, setHazardSelection] = useState(baseSelection());
  const [hazardParams, setHazardParams] = useState(
    Object.fromEntries(hazardTypes.map((ht) => [ht, hazardConfig[ht].paramDefaults])),
  );

  const [hazardOptions, setHazardOptions] = useState(
    Object.fromEntries(hazardTypes.map((ht) => [ht, hazardConfig[ht].paramDomains])),
  );

  useEffect(() => {
    if (forceSingle) {
      let selectedKeys = Object.entries(hazardSelection)
        .filter(([key, value]) => value)
        .map(([key]) => key);
      if (selectedKeys.length > 1) {
        const firstKey = selectedKeys[0];
        setHazardSelection({ ...baseSelection(), [firstKey]: true });
      }
    }
  }, [forceSingle, hazardSelection]);

  const updateHazardSelection = useCallback(
    (hazardType: string, show: boolean) => {
      const base = forceSingle ? baseSelection() : hazardSelection;
      setHazardSelection({ ...base, [hazardType]: show });
    },
    [forceSingle, hazardSelection],
  );

  const updatedHazardParam = useCallback(
    (hazardType: string, paramName: string, paramValue: any) => {
      const { paramDomains, paramDependencies = {} } = hazardConfig[hazardType];
      const oldParams = hazardParams[hazardType];

      const newSingleHazardParams = { ...oldParams, [paramName]: paramValue };
      const newSingleHazardOptions = {};

      for (const [param, paramValue] of Object.entries(newSingleHazardParams)) {
        const newParamOptions = paramDependencies[param]?.(newSingleHazardParams) ?? paramDomains[param];

        // if the new options don't include the current param value, switch value to the first option
        if (!newParamOptions.includes(paramValue)) {
          newSingleHazardParams[param] = newParamOptions[0];
        }

        newSingleHazardOptions[param] = newParamOptions;
      }

      setHazardParams({ ...hazardParams, [hazardType]: newSingleHazardParams });
      setHazardOptions({ ...hazardOptions, [hazardType]: newSingleHazardOptions });
    },
    [hazardOptions, hazardParams],
  );

  const hazardVisibilitySet = useMemo(() => {
    const visibility: any = {};

    if(onlySelect) return visibility;

    for (const hazardType of hazardTypes) {
      if (hazardSelection[hazardType]) {
        visibility[getHazardId({ ...hazardParams[hazardType], hazardType })] = true;
      }
    }
    return visibility;
  }, [hazardSelection, hazardParams, onlySelect]);

  return {
    hazardSelection,
    hazardParams,
    hazardOptions,
    setSingleHazardShow: updateHazardSelection,
    setSingleHazardParam: updatedHazardParam,
    hazardVisibilitySet,
  };
};
